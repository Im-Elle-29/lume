import { createServerSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageHeader } from '@/components/layout/PageHeader'
import { PostDetailClient } from './PostDetailClient'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: post } = await supabase.from('posts').select('*, profiles!posts_author_id_fkey(anon_name), groups(name, color, icon)').eq('id', id).eq('is_removed', false).single()
  if (!post) notFound()
  const { data: comments } = await supabase.from('comments').select('*, profiles(anon_name)').eq('post_id', id).eq('is_removed', false).order('created_at', { ascending: true })
  let anonName = 'Anonimo'
  let userLiked = false
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('anon_name').eq('id', user.id).single()
    if (profile) anonName = profile.anon_name
    const { data: like } = await supabase.from('post_likes').select('post_id').match({ post_id: id, user_id: user.id }).single()
    userLiked = !!like
  }
  return (
    <main style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      <PageHeader title="Storia" back />
      <PostDetailClient post={{ ...post, user_liked: userLiked }} comments={comments || []} userId={user?.id} anonName={anonName} />
      <BottomNav />
    </main>
  )
}