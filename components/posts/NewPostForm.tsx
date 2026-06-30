'use client'
import { useState } from 'react'
import { Group } from '@/types/database'
import { Avatar } from '@/components/ui/Avatar'

export function NewPostForm({ groups, anonName, onSubmit, defaultGroupId }: {
  groups: Group[]
  anonName: string
  onSubmit: (content: string, groupId: string) => Promise<void>
  defaultGroupId?: string
}) {
  const [content, setContent] = useState('')
  const [groupId, setGroupId] = useState(defaultGroupId || groups[0]?.id || '')
  const [loading, setLoading] = useState(false)
  const MAX = 2000

  async function handleSubmit() {
    if (!content.trim() || content.length < 10 || loading) return
    setLoading(true)
    try { await onSubmit(content.trim(), groupId); setContent('') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ background: '#2E1F16', borderRadius: 16, border: '1px solid #C4845A44', padding: '18px', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Avatar name={anonName} size={32} />
        <span style={{ fontFamily: '"DM Serif Display", serif', fontSize: 14, color: '#E8A87C' }}>{anonName}</span>
      </div>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Scrivi quello che senti. Nessuno ti giudicherà."
        rows={4}
        maxLength={MAX}
        style={{ marginBottom: 4, resize: 'none', lineHeight: 1.7, background: '#261A13', border: '1px solid #3D2A1E', color: '#F0E6DC', borderRadius: 10, padding: '10px 14px', fontFamily: 'Lora, serif', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }}
      />
      <div style={{ fontSize: 11, color: '#5C4438', textAlign: 'right', marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>{content.length}/{MAX}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <select value={groupId} onChange={e => setGroupId(e.target.value)} style={{ flex: 1, fontSize: 13, padding: '9px 12px', background: '#261A13', border: '1px solid #3D2A1E', color: '#A08878', borderRadius: 8, fontFamily: 'DM Sans, sans-serif' }}>
          {groups.map(g => <option key={g.id} value={g.id}>{g.icon} {g.name}</option>)}
        </select>
        <button onClick={handleSubmit} disabled={content.length < 10 || loading} style={{ background: content.length >= 10 ? '#C4845A' : '#3D2A1E', border: 'none', borderRadius: 10, padding: '9px 20px', color: content.length >= 10 ? '#1C1410' : '#5C4438', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
          {loading ? '...' : 'Pubblica'}
        </button>
      </div>
    </div>
  )
}