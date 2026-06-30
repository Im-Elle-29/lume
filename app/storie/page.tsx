import { createServerSupabase } from '@/lib/supabase-server'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageHeader } from '@/components/layout/PageHeader'
import { StorieClient } from './StorieClient'

export default async function StoriePage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: groups } = await supabase.from('groups').select('*').eq('is_active', true)
  let anonName = 'Anonimo'
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('anon_name').eq('id', user.id).single()
    if (profile) anonName = profile.anon_name
  }
  return (
    <main style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      <PageHeader title="Storie" subtitle="Voci anonime che si intrecciano" />
      <StorieClient groups={groups || []} anonName={anonName} userId={user?.id} />
      <BottomNav />
    </main>
  )
}