'use client'

export function PageHeader({ title, subtitle, right, back }: {
  title: string
  subtitle?: string
  right?: React.ReactNode
  back?: boolean
}) {
  return (
    <div style={{ background: '#261A13', borderBottom: '1px solid #3D2A1E', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
      {back && (
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', color: '#A08878', fontSize: 22, padding: '0 4px' }}>‹</button>
      )}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 20, color: '#F0E6DC', fontWeight: 400 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12, color: '#5C4438', marginTop: 2 }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}