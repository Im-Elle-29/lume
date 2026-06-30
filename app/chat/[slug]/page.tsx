import { createServerSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { BottomNav } from '@/components/layout/BottomNav'
import { ChatRoomClient } from './ChatRoomClient'

export default async function ChatRoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: group } = await supabase.from('groups').select('*').eq('slug', slug).single()
  if (!group) notFound()
  let anonName = 'Anonimo'
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('anon_name').eq('id', user.id).single()
    if (profile) anonName = profile.anon_name
  }
  return (
    <main style={{ maxWidth: 480, margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ChatRoomClient group={group} userId={user?.id} anonName={anonName} />
      <BottomNav />
    </main>
  )
}