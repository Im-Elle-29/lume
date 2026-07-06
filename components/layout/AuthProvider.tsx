'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, signInAnonymously } = useAuth()
  const [tried, setTried] = useState(false)

  useEffect(() => {
    if (!loading && !user && !tried) {
      setTried(true)
      signInAnonymously().catch(console.error)
    }
  }, [loading, user, tried])

  if (loading && !tried) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#1C1410' }}>
        <div style={{ fontSize: 48 }}>🕯️</div>
        <p style={{ fontFamily: '"DM Serif Display", serif', fontSize: 20, color: '#C4845A' }}>Lume</p>
      </div>
    )
  }

  return <>{children}</>
}