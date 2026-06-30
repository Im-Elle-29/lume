'use client'
import { useState } from 'react'
import { Message } from '@/types/database'
import { Avatar } from '@/components/ui/Avatar'
import { ReportModal } from '@/components/ui/ReportModal'
import { format } from 'date-fns'

export function ChatMessage({ message, isSelf, userId, onReport }: {
  message: Message
  isSelf: boolean
  userId?: string
  onReport: (messageId: string, reason: string) => Promise<void>
}) {
  const [showReport, setShowReport] = useState(false)
  const anon = message.profiles?.anon_name || 'Anonimo'
  const time = format(new Date(message.created_at), 'HH:mm')

  return (
    <>
      <div
        style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexDirection: isSelf ? 'row-reverse' : 'row' }}
        onContextMenu={e => { e.preventDefault(); if (!isSelf) setShowReport(true) }}
      >
        {!isSelf && <Avatar name={anon} size={30} />}
        <div style={{ maxWidth: '75%' }}>
          {!isSelf && <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 11, color: '#E8A87C', marginBottom: 4 }}>{anon}</div>}
          <div style={{ background: isSelf ? '#C4845A28' : '#2E1F16', border: `1px solid ${isSelf ? '#C4845A44' : '#3D2A1E'}`, borderRadius: isSelf ? '14px 14px 4px 14px' : '14px 14px 14px 4px', padding: '10px 14px', fontSize: 14, color: '#F0E6DC', lineHeight: 1.65, fontFamily: 'Lora, serif', wordBreak: 'break-word' }}>{message.content}</div>
          <div style={{ fontSize: 10, color: '#5C4438', marginTop: 4, textAlign: isSelf ? 'right' : 'left', fontFamily: 'DM Sans, sans-serif' }}>{time}</div>
        </div>
      </div>
      {showReport && <ReportModal onClose={() => setShowReport(false)} onSubmit={(reason) => onReport(message.id, reason)} contentType="messaggio" />}
    </>
  )
}