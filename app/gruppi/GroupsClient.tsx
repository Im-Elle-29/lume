'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Group } from '@/types/database'
import { getClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function GroupsClient({ groups, joinedGroups, userId }: { groups: Group[]; joinedGroups: string[]; userId?: string }) {
  const [joined, setJoined] = useState<Set<string>>(new Set(joinedGroups))
  const supabase = getClient()

  async function toggleJoin(e: React.MouseEvent, groupId: string) {
    e.preventDefault()
    if (!userId) return
    if (joined.has(groupId)) {
      await supabase.from('group_memberships').delete().match({ group_id: groupId, user_id: userId })
      setJoined(prev => { const s = new Set(prev); s.delete(groupId); return s })
      toast('Hai lasciato il gruppo')
    } else {
      await supabase.from('group_memberships').insert({ group_id: groupId, user_id: userId })
      setJoined(prev => new Set([...prev, groupId]))
      toast.success('Benvenuto nel gruppo 🌿')
    }
  }

  return (
    <div style={{ padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {groups.map(g => (
        <Link key={g.id} href={`/gruppi/${g.slug}`} style={{ textDecoration: 'none' }}>
          <div style={{ background: '#2E1F16', borderRadius: 16, border: '1px solid #3D2A1E', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, flexShrink: 0, background: g.color + '22', border: `1px solid ${g.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{g.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 17, color: '#F0E6DC' }}>{g.name}</div>
                <div style={{ fontSize: 12, color: '#5C4438', marginTop: 2, fontFamily: 'DM Sans, sans-serif' }}>{g.member_count.toLocaleString('it')} persone</div>
              </div>
              <span style={{ color: '#5C4438', fontSize: 20 }}>›</span>
            </div>
            <p style={{ fontSize: 13, color: '#A08878', lineHeight: 1.6, marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>{g.description}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={(e) => toggleJoin(e, g.id)} style={{ background: joined.has(g.id) ? g.color + '22' : 'transparent', border: `1px solid ${joined.has(g.id) ? g.color + '55' : '#3D2A1E'}`, borderRadius: 20, padding: '7px 14px', color: joined.has(g.id) ? g.color : '#A08878', fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
                {joined.has(g.id) ? '✓ Unito' : '+ Unisciti'}
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}