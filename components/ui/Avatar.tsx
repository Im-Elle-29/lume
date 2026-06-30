const COLORS = ['#C4845A','#7A6EA8','#5A8FA8','#5A8A6A','#A87A5A','#8A5A8A']

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const color = COLORS[name.charCodeAt(0) % COLORS.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color + '28', border: `1.5px solid ${color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.3, color, fontWeight: 600, flexShrink: 0,
      fontFamily: '"DM Serif Display", serif',
    }}>{initials}</div>
  )
}