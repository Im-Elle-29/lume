'use client'

import { useState } from 'react'
import { getClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

function generateCode(): string {
  const words = ['luna', 'stelle', 'mare', 'vento', 'fiamma', 'nube', 'pietra', 'radice', 'onda', 'brezza']
  const word = words[Math.floor(Math.random() * words.length)]
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${word}-${num}`
}

export function LoginScreen() {
  const [mode, setMode] = useState<'choose' | 'code' | 'email' | 'verify'>('choose')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = getClient()

  async function handleNewCode() {
    setLoading(true)
    const newCode = generateCode()
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
      toast.error('Errore. Riprova tra qualche minuto.')
      setLoading(false)
      return
    }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        anon_name: newCode,
        secret_code: newCode
      })
    }
    setGeneratedCode(newCode)
    setMode('verify')
    setLoading(false)
  }

  async function handleLoginWithCode() {
    if (!code.trim()) return
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, secret_code')
      .eq('secret_code', code.trim())
      .single()
    if (error || !data) {
      toast.error('Codice non valido. Riprova.')
      setLoading(false)
      return
    }
    // Usa il link magico per rientrare — per ora mostra messaggio
    toast.error('Per rientrare con il codice contatta il supporto. Funzione in arrivo!')
    setLoading(false)
  }

  async function handleEmailLogin() {
    if (!email.trim()) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin }
    })
    if (error) {
      toast.error('Errore. Riprova.')
    } else {
      toast.success('Link inviato! Controlla la tua email.')
      setMode('choose')
    }
    setLoading(false)
  }

  if (mode === 'verify') {
    return (
      <div style={{ minHeight: '100vh', background: '#1C1410', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>🔑</div>
          <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 24, color: '#F0E6DC', marginBottom: 12, fontWeight: 400 }}>Il tuo codice segreto</h2>
          <p style={{ color: '#A08878', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Salva questo codice in un posto sicuro. Sarà l'unico modo per rientrare con questo profilo.
          </p>
          <div style={{ background: '#2E1F16', border: '2px solid #C4845A', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
            <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 32, color: '#E8A87C', letterSpacing: '0.05em' }}>{generatedCode}</div>
          </div>
          <button
            onClick={() => { navigator.clipboard?.writeText(generatedCode); toast.success('Codice copiato!') }}
            style={{ width: '100%', background: '#2E1F16', border: '1px solid #3D2A1E', borderRadius: 12, padding: '14px', color: '#A08878', fontFamily: 'DM Sans, sans-serif', fontSize: 14, marginBottom: 12 }}
          >
            📋 Copia codice
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{ width: '100%', background: '#C4845A', border: 'none', borderRadius: 12, padding: '14px', color: '#1C1410', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600 }}
          >
            Entra in Lume →
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'code') {
    return (
      <div style={{ minHeight: '100vh', background: '#1C1410', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <button onClick={() => setMode('choose')} style={{ background: 'none', border: 'none', color: '#A08878', fontSize: 22, marginBottom: 24 }}>‹</button>
          <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 24, color: '#F0E6DC', marginBottom: 8, fontWeight: 400 }}>Inserisci il codice</h2>
          <p style={{ color: '#A08878', fontSize: 14, marginBottom: 24 }}>Inserisci il tuo codice segreto per rientrare.</p>
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="es. luna-7823"
            style={{ marginBottom: 12 }}
          />
          <button
            onClick={handleLoginWithCode}
            disabled={!code.trim() || loading}
            style={{ width: '100%', background: code.trim() ? '#C4845A' : '#3D2A1E', border: 'none', borderRadius: 12, padding: '14px', color: code.trim() ? '#1C1410' : '#5C4438', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 16 }}
          >
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => setMode('choose')} style={{ background: 'none', border: 'none', color: '#5C4438', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
              Non hai un codice? Creane uno nuovo
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'email') {
    return (
      <div style={{ minHeight: '100vh', background: '#1C1410', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <button onClick={() => setMode('choose')} style={{ background: 'none', border: 'none', color: '#A08878', fontSize: 22, marginBottom: 24 }}>‹</button>
          <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 24, color: '#F0E6DC', marginBottom: 8, fontWeight: 400 }}>Accedi con email</h2>
          <p style={{ color: '#A08878', fontSize: 14, marginBottom: 24 }}>Ti invieremo un link magico. Nessuna password richiesta.</p>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="la-tua@email.com"
            style={{ marginBottom: 12 }}
          />
          <button
            onClick={handleEmailLogin}
            disabled={!email.trim() || loading}
            style={{ width: '100%', background: email.trim() ? '#C4845A' : '#3D2A1E', border: 'none', borderRadius: 12, padding: '14px', color: email.trim() ? '#1C1410' : '#5C4438', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600 }}
          >
            {loading ? 'Invio...' : 'Invia link magico'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1C1410', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🕯️</div>
        <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 36, color: '#F0E6DC', marginBottom: 8, fontWeight: 400 }}>Lume</h1>
        <p style={{ color: '#A08878', fontSize: 15, lineHeight: 1.7, marginBottom: 48 }}>
          Un luogo sicuro per chi sente<br />il peso del mondo.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={handleNewCode}
            disabled={loading}
            style={{ width: '100%', background: '#C4845A', border: 'none', borderRadius: 14, padding: '16px 20px', color: '#1C1410', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <span style={{ fontSize: 24 }}>🔑</span>
            <div>
              <div>{loading ? 'Creazione...' : 'Entra con codice segreto'}</div>
              <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.8 }}>Anonimo — nessuna email richiesta</div>
            </div>
          </button>
          <button
            onClick={() => setMode('code')}
            style={{ width: '100%', background: '#2E1F16', border: '1px solid #3D2A1E', borderRadius: 14, padding: '16px 20px', color: '#F0E6DC', fontFamily: 'DM Sans, sans-serif', fontSize: 15, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <span style={{ fontSize: 24 }}>🔓</span>
            <div>
              <div>Ho già un codice</div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>Rientra con il tuo codice segreto</div>
            </div>
          </button>
          <button
            onClick={() => setMode('email')}
            style={{ width: '100%', background: '#2E1F16', border: '1px solid #3D2A1E', borderRadius: 14, padding: '16px 20px', color: '#F0E6DC', fontFamily: 'DM Sans, sans-serif', fontSize: 15, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <span style={{ fontSize: 24 }}>✉️</span>
            <div>
              <div>Accedi con email</div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>Ricevi un link magico</div>
            </div>
          </button>
        </div>
        <p style={{ color: '#5C4438', fontSize: 11, marginTop: 32, lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif' }}>
          Entrando accetti di usare questo spazio con rispetto.<br />Nessun dato personale richiesto.
        </p>
      </div>
    </div>
  )
}