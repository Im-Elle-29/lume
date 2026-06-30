'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', icon: '◈', label: 'Home' },
  { href: '/gruppi', icon: '❋', label: 'Gruppi' },
  { href: '/storie', icon: '✦', label: 'Storie' },
  { href: '/chat', icon: '◎', label: 'Chat' },
  { href: '/chiamate', icon: '◉', label: 'Chiamate' },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: '#261A13', borderTop: '1px solid #3D2A1E', display: 'flex', justifyContent: 'space-around', padding: '10px 0 20px', zIndex: 100 }}>
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
        return (
          <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: active ? '#C4845A' : '#5C4438', textDecoration: 'none', padding: '2px 12px' }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 10, letterSpacing: '0.08em', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>{item.label.toUpperCase()}</span>
          </Link>
        )
      })}
    </nav>
  )
}