import { createServerSupabase } from '@/lib/supabase-server'
import { BottomNav } from '@/components/layout/BottomNav'
import { HomeClient } from './HomeClient'

export default async function HomePage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  let anonName = 'Ospite anonimo'
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('anon_name').eq('id', user.id).single()
    if (profile) anonName = profile.anon_name
  }
  const { data: groups } = await supabase.from('groups').select('*').eq('is_active', true).order('member_count', { ascending: false })
  return (
    <main style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      <HomeClient anonName={anonName} groups={groups || []} userId={user?.id} />
      <BottomNav />
    </main>
  )
}