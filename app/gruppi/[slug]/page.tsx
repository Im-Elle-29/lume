import { createServerSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageHeader } from '@/components/layout/PageHeader'
import Link from 'next/link'

export default async function GroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabase()
  const { data: group } = await supabase.from('groups').select('*').eq('slug', slug).single()
  if (!group) notFound()
  return (
    <main style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh' }}>
      <PageHeader title={`${group.icon} ${group.name}`} subtitle={group.description || ''} back />
      <div style={{ padding: '24px 20px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { icon: '◎', label: 'Chat del gruppo', sub: 'Messaggi in tempo reale', href: `/chat/${group.slug}`, color: '#5A8FA8' },
          { icon: '✦', label: 'Storie del gruppo', sub: 'Pubblicazioni e condivisioni', href: `/storie`, color: '#7A6EA8' },
          { icon: '◉', label: 'Stanze vocali', sub: 'Parla o ascolta con la voce', href: `/chiamate`, color: '#5A8A6A' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{ background: '#2E1F16', border: '1px solid #3D2A1E', borderRadius: 16, padding: '18px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: item.color + '22', border: `1px solid ${item.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: item.color, flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#F0E6DC', marginBottom: 3, fontFamily: 'DM Sans, sans-serif' }}>{item.label}</div>
              <div style={{ fontSize: 13, color: '#A08878', fontFamily: 'DM Sans, sans-serif' }}>{item.sub}</div>
            </div>
            <span style={{ color: '#5C4438', fontSize: 20 }}>›</span>
          </Link>
        ))}
      </div>
      <BottomNav />
    </main>
  )
}