import { createServerSupabase } from '@/lib/supabase-server'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageHeader } from '@/components/layout/PageHeader'
import Link from 'next/link'

export default async function ChatPage() {
  const supabase = await createServerSupabase()
  const { data: groups } = await supabase.from('groups').select('*').eq('is_active', true)
  return (
    <main style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      <PageHeader title="Chat" subtitle="Scegli un gruppo per chattare" />
      <div style={{ padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(groups || []).map((g: any) => (
          <Link key={g.id} href={`/chat/${g.slug}`} style={{ background: '#2E1F16', border: '1px solid #3D2A1E', borderRadius: 16, padding: '18px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, flexShrink: 0, background: g.color + '22', border: `1px solid ${g.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{g.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 17, color: '#F0E6DC' }}>{g.name}</div>
              <div style={{ fontSize: 12, color: '#5C4438', marginTop: 2, fontFamily: 'DM Sans, sans-serif' }}>Chat anonima in tempo reale</div>
            </div>
            <span style={{ color: '#5C4438', fontSize: 20 }}>›</span>
          </Link>
        ))}
      </div>
      <BottomNav />
    </main>
  )
}