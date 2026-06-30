'use client'
import { useState, KeyboardEvent } from 'react'

export function ChatInput({ onSend, disabled }: { onSend: (message: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState('')

  function handleSend() {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div style={{ background: '#261A13', borderTop: '1px solid #3D2A1E', padding: '10px 16px 20px', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Scrivi un messaggio..."
        rows={1}
        maxLength={1000}
        disabled={disabled}
        style={{ flex: 1, borderRadius: 24, padding: '12px 18px', resize: 'none', lineHeight: 1.5, background: '#2E1F16', border: '1px solid #3D2A1E', color: '#F0E6DC', fontFamily: 'Lora, serif', fontSize: 14, outline: 'none' }}
      />
      <button onClick={handleSend} disabled={!value.trim() || disabled} style={{ background: value.trim() ? '#C4845A' : '#3D2A1E', border: 'none', borderRadius: 24, width: 46, height: 46, flexShrink: 0, fontSize: 18, color: value.trim() ? '#1C1410' : '#5C4438' }}>↑</button>
    </div>
  )
}