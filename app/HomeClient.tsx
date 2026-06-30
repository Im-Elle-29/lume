'use client'
import Link from 'next/link'
import { Group } from '@/types/database'

export function HomeClient({ anonName, groups, userId }: { anonName: string; groups: Group[]; userId?: string }) {
  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ padding: '48px 20px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>🕯️</div>
        <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 36, color: '#F0E6DC', marginBottom: 12, fontWeight: 400 }}>Lume</h1>
        <p style={{ color: '#A08878', fontSize: 15, lineHeight: 1.7 }}>Un luogo sicuro per chi sente<br />il peso del mondo.</p>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ background: '#2E1F16', borderRadius: 16, border: '1px solid #3D2A1E', padding: '20px', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ fontSize: 32 }}>🌿</div>
          <div>
            <div style={{ fontSize: 11, color: '#5C4438', letterSpacing: '0.1em', marginBottom: 4, fontFamily: 'DM Sans, sans-serif' }}>LA TUA IDENTITÀ ANONIMA</div>
            <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: '#E8A87C' }}>{anonName}</div>
            <div style={{ fontSize: 12, color: '#5C4438', marginTop: 4, fontFamily: 'DM Sans, sans-serif' }}>Generata casualmente. Nessuno sa chi sei.</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 18, color: '#F0E6DC', marginBottom: 14, fontWeight: 400 }}>Inizia da qui</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '❋', label: 'Unisciti a un gruppo', sub: 'Trova persone simili a te', href: '/gruppi', color: '#C4845A' },
            { icon: '◎', label: 'Entra in una chat', sub: 'Parla in tempo reale, in anonimo', href: '/chat', color: '#5A8FA8' },
            { icon: '✦', label: 'Condividi la tua storia', sub: 'Scrivi, sfoga, inspira', href: '/storie', color: '#7A6EA8' },
            { icon: '◉', label: 'Stanze vocali', sub: 'Ascolta o parla con la voce', href: '/chiamate', color: '#5A8A6A' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ background: '#2E1F16', border: '1px solid #3D2A1E', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: item.color + '22', border: `1px solid ${item.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: item.color, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#F0E6DC', marginBottom: 2, fontFamily: 'DM Sans, sans-serif' }}>{item.label}</div>
                <div style={{ fontSize: 13, color: '#A08878', fontFamily: 'DM Sans, sans-serif' }}>{item.sub}</div>
              </div>
              <span style={{ color: '#5C4438', fontSize: 20 }}>›</span>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ background: '#1A1010', borderRadius: 14, border: '1px solid #C47A7A33', padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20 }}>🆘</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#C47A7A', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>Hai bisogno di aiuto urgente?</div>
            <div style={{ fontSize: 12, color: '#A08878', lineHeight: 1.8, fontFamily: 'DM Sans, sans-serif' }}>
              Telefono Amico: <a href="tel:0223272327" style={{ color: '#F0E6DC' }}>02 2327 2327</a><br />
              Telefono Azzurro: <a href="tel:19696" style={{ color: '#F0E6DC' }}>19696</a><br />
              Emergenze: <a href="tel:112" style={{ color: '#F0E6DC' }}>112</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}