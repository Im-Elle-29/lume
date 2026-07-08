'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { LoginScreen } from './LoginScreen'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#1C1410' }}>
        <div style={{ fontSize: 48 }}>🕯️</div>
        <p style={{ fontFamily: '"DM Serif Display", serif', fontSize: 20, color: '#C4845A' }}>Lume</p>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  return <>{children}</>
}