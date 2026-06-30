'use client'

import { useState } from 'react'
import { getClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function CallsClient({ rooms: initialRooms, groups, userId }: { rooms: any[]; groups: any[]; userId?: string }) {
  const [rooms, setRooms] = useState(initialRooms)
  const [inCall, setInCall] = useState<any>(null)
  const [muted, setMuted] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [showCreate, setShowCreate] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomGroup, setNewRoomGroup] = useState(groups[0]?.id || '')
  const supabase = getClient()
  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  async function joinRoom(room: any) {
    if (!userId) return
    await supabase.from('call_participants').upsert({ room_id: room.id, user_id: userId })
    setInCall(room)
    const timer = setInterval(() => setSeconds(s => s+1), 1000)
    return () => clearInterval(timer)
  }

  async function leaveRoom() {
    if (!userId || !inCall) return
    await supabase.from('call_participants').delete().match({ room_id: inCall.id, user_id: userId })
    setInCall(null); setSeconds(0)
  }

  async function createRoom() {
    if (!userId || !newRoomName.trim()) return
    const { data, error } = await supabase.from('call_rooms').insert({ name: newRoomName, group_id: newRoomGroup, created_by: userId }).select('*, groups(name, color, icon)').single()
    if (!error && data) { setRooms(prev => [data, ...prev]); setNewRoomName(''); setShowCreate(false); toast.success('Stanza creata!') }
  }

  if (inCall) return (
    <div style={{ padding: '40px 20px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 12, letterSpacing: '0.1em', color: '#5C4438', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>IN CHIAMATA</div>
      <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 24, color: '#F0E6DC', margin: '0 0 4px' }}>{inCall.name}</h2>
      <div style={{ fontSize: 13, color: '#A08878', marginBottom: 40, fontFamily: 'DM Sans, sans-serif' }}>{fmt(seconds)}</div>
      <div style={{ fontSize: 60, marginBottom: 40 }}>◉</div>
      <div style={{ display: 'flex', gap: 16 }}>
        <button onClick={() => setMuted(m => !m)} style={{ width: 56, height: 56, borderRadius: '50%', background: muted ? '#C47A7A33' : '#2E1F16', border: `1px solid ${muted ? '#C47A7A55' : '#3D2A1E'}`, color: muted ? '#C47A7A' : '#A08878', fontSize: 22 }}>{muted ? '🔇' : '🎙️'}</button>
        <button onClick={leaveRoom} style={{ width: 56, height: 56, borderRadius: '50%', background: '#C47A7A33', border: '1px solid #C47A7A55', color: '#C47A7A', fontSize: 22 }}>✕</button>
      </div>
      <p style={{ fontSize: 12, color: '#5C4438', marginTop: 32, textAlign: 'center', fontFamily: 'DM Sans, sans-serif' }}>La chiamata è anonima. La tua voce non viene registrata.</p>
    </div>
  )

  return (
    <div style={{ padding: '20px 20px 100px' }}>
      <button onClick={() => setShowCreate(s => !s)} style={{ width: '100%', background: '#2E1F16', border: '1px solid #3D2A1E', borderRadius: 14, padding: '14px 18px', marginBottom: 20, color: '#A08878', textAlign: 'left', fontSize: 14, fontFamily: 'Lora, serif', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>◉</span>
        <span style={{ color: '#5C4438' }}>Crea una nuova stanza...</span>
        <span style={{ marginLeft: 'auto', color: '#C4845A', fontSize: 18 }}>{showCreate ? '✕' : '+'}</span>
      </button>
      {showCreate && (
        <div style={{ background: '#2E1F16', borderRadius: 16, border: '1px solid #C4845A44', padding: '18px', marginBottom: 20 }}>
          <input value={newRoomName} onChange={e => setNewRoomName(e.target.value)} placeholder="Nome della stanza..." style={{ marginBottom: 10 }} />
          <select value={newRoomGroup} onChange={e => setNewRoomGroup(e.target.value)} style={{ marginBottom: 12 }}>
            {groups.map((g: any) => <option key={g.id} value={g.id}>{g.icon} {g.name}</option>)}
          </select>
          <button onClick={createRoom} style={{ width: '100%', background: '#C4845A', border: 'none', borderRadius: 10, padding: '12px', color: '#1C1410', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>Crea stanza</button>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#5C4438', fontFamily: 'DM Sans, sans-serif' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>◉</div>
            <p>Nessuna stanza attiva.<br />Creane una tu!</p>
          </div>
        ) : rooms.map(room => (
          <div key={room.id} style={{ background: '#2E1F16', borderRadius: 16, border: '1px solid #3D2A1E', padding: '18px' }}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: (room.groups?.color || '#C4845A') + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: room.groups?.color || '#C4845A' }}>◉</div>
              <div>
                <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 17, color: '#F0E6DC' }}>{room.name}</div>
                <div style={{ fontSize: 12, color: '#5C4438', fontFamily: 'DM Sans, sans-serif' }}>{room.groups?.name} · {room.participant_count} partecipanti</div>
              </div>
            </div>
            <button onClick={() => joinRoom(room)} style={{ width: '100%', background: (room.groups?.color || '#C4845A') + '22', border: `1px solid ${(room.groups?.color || '#C4845A')}44`, borderRadius: 10, padding: '10px', color: room.groups?.color || '#C4845A', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 13 }}>Entra nella stanza</button>
          </div>
        ))}
      </div>
    </div>
  )
}