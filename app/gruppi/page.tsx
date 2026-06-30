import { createServerSupabase } from '@/lib/supabase-server'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageHeader } from '@/components/layout/PageHeader'
import { GroupsClient } from './GroupsClient'

export default async function GruppiPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: groups } = await supabase
    .from('groups')
    .select('*')
    .eq('is_active', true)
    .order('member_count', { ascending: false })
  let joinedGroups: string[] = []
  if (user) {
    const { data } = await supabase
      .from('group_memberships')
      .select('group_id')
      .eq('user_id', user.id)
    joinedGroups = (data || []).map((m: any) => m.group_id)
  }
  return (
    <main style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      <PageHeader title="Gruppi" subtitle="Comunità anonime per ogni tipo di dolore" />
      <GroupsClient groups={groups || []} joinedGroups={joinedGroups} userId={user?.id} />
      <BottomNav />
    </main>
  )
}