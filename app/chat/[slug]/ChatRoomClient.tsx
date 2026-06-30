'use client'

import { useEffect, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { ChatInput } from '@/components/chat/ChatInput'
import { PageHeader } from '@/components/layout/PageHeader'
import toast from 'react-hot-toast'

export function ChatRoomClient({ group, userId, anonName }: { group: any; userId?: string; anonName: string }) {
  const { messages, loading, sendMessage, reportMessage } = useChat(group.id)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(content: string) {
    if (!userId) return
    try { await sendMessage(content, userId) }
    catch { toast.error("Errore nell'invio") }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <PageHeader title={`${group.icon} ${group.name}`} subtitle="Chat anonima in tempo reale" back />
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 140 }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#5C4438', padding: '40px 0', fontFamily: 'DM Sans, sans-serif' }}>Caricamento messaggi...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>◎</div>
            <p style={{ color: '#5C4438', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>Nessun messaggio ancora.<br />Sii il primo a parlare.</p>
          </div>
        ) : messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} isSelf={msg.author_id === userId} userId={userId}
            onReport={async (messageId, reason) => {
              if (!userId) return
              await reportMessage(messageId, userId, reason)
              toast.success('Segnalazione inviata')
            }} />
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ position: 'fixed', bottom: 60, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480 }}>
        <ChatInput onSend={handleSend} disabled={!userId} />
      </div>
    </div>
  )
}