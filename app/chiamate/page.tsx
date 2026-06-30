import { createServerSupabase } from '@/lib/supabase-server'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageHeader } from '@/components/layout/PageHeader'
import { CallsClient } from './CallsClient'

export default async function ChiamatePage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: groups } = await supabase.from('groups').select('*').eq('is_active', true)
  const { data: rooms } = await supabase.from('call_rooms').select('*, groups(name, color, icon)').eq('is_active', true).order('participant_count', { ascending: false })
  return (
    <main style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      <PageHeader title="Stanze vocali" subtitle="Ascolta o parla, sempre in anonimo" />
      <CallsClient rooms={rooms || []} groups={groups || []} userId={user?.id} />
      <BottomNav />
    </main>
  )
}