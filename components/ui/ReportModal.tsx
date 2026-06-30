'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

const REASONS = [
  'Contenuto dannoso o pericoloso',
  'Spam o pubblicità',
  'Linguaggio offensivo',
  'Informazioni false',
  'Violazione della privacy',
  'Altro',
]

export function ReportModal({ onClose, onSubmit, contentType }: {
  onClose: () => void
  onSubmit: (reason: string) => Promise<void>
  contentType: string
}) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!reason) return
    setLoading(true)
    try { await onSubmit(reason); toast.success('Segnalazione inviata.'); onClose() }
    catch { toast.error('Errore. Riprova.') }
    finally { setLoading(false) }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#261A13', borderRadius: '20px 20px 0 0', border: '1px solid #3D2A1E', padding: '24px 20px 32px', width: '100%', maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 18, color: '#F0E6DC' }}>Segnala {contentType}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5C4438', fontSize: 22 }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {REASONS.map(r => (
            <button key={r} onClick={() => setReason(r)} style={{ background: reason === r ? '#C4845A22' : '#2E1F16', border: `1px solid ${reason === r ? '#C4845A55' : '#3D2A1E'}`, borderRadius: 10, padding: '12px 16px', color: reason === r ? '#E8A87C' : '#A08878', textAlign: 'left', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>{r}</button>
          ))}
        </div>
        <button onClick={handleSubmit} disabled={!reason || loading} style={{ width: '100%', background: reason ? '#C4845A' : '#3D2A1E', border: 'none', borderRadius: 12, padding: '14px', color: reason ? '#1C1410' : '#5C4438', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600 }}>
          {loading ? 'Invio...' : 'Invia segnalazione'}
        </button>
      </div>
    </div>
  )
}