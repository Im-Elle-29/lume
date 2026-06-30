export function Badge({ children, color = '#C4845A' }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600,
      letterSpacing: '0.05em', borderRadius: 20, padding: '3px 10px',
      background: color + '22', color, border: `1px solid ${color}44`,
      display: 'inline-block',
    }}>{children}</span>
  )
}