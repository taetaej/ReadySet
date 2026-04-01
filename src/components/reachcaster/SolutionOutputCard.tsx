import { useEffect, useRef } from 'react'
import { Flame } from 'lucide-react'

interface SolutionOutputCardProps {
  data?: {
    datashot: number
    adCurator: number
    budgetOptimizer: number
    reachCaster: number
  }
}

const DEFAULT_DATA = { datashot: 23, adCurator: 31, budgetOptimizer: 17, reachCaster: 77 }

// 네온 컬러 4개 (Avatar.tsx NEON_COLORS 참조)
const BLOBS = [
  { key: 'datashot',        label: 'DataShot',            color: '#7B2FFF', cx: 42, cy: 38 },
  { key: 'reachCaster',     label: 'Reach Caster',        color: '#00D9FF', cx: 58, cy: 38 },
  { key: 'adCurator',       label: 'Ad Curator',          color: '#00FF94', cx: 58, cy: 62 },
  { key: 'budgetOptimizer', label: 'Budget Optimizer',    color: '#FF006B', cx: 42, cy: 62 },
]

// 블롭 SVG path 생성 — 약간 불규칙한 원형
function blobPath(cx: number, cy: number, r: number, seed: number) {
  const points = 8
  const coords: string[] = []
  for (let i = 0; i < points; i++) {
    const angle = (Math.PI * 2 * i) / points
    const wobble = r + Math.sin(seed + i * 1.7) * r * 0.15
    const x = cx + Math.cos(angle) * wobble
    const y = cy + Math.sin(angle) * wobble
    coords.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  // smooth closed path
  let d = `M ${coords[0]}`
  for (let i = 1; i <= points; i++) {
    const curr = coords[i % points].split(',').map(Number)
    const prev = coords[(i - 1) % points].split(',').map(Number)
    const cpx = (prev[0] + curr[0]) / 2
    const cpy = (prev[1] + curr[1]) / 2
    d += ` Q ${prev[0]},${prev[1]} ${cpx},${cpy}`
  }
  d += ' Z'
  return d
}

export function SolutionOutputCard({ data = DEFAULT_DATA }: SolutionOutputCardProps) {
  const total = data.datashot + data.adCurator + data.budgetOptimizer + data.reachCaster
  const svgRef = useRef<SVGSVGElement>(null)
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)

  // 애니메이션 루프 — 블롭 탱글 효과
  useEffect(() => {
    let running = true
    const animate = () => {
      if (!running || !svgRef.current) return
      timeRef.current += 0.015
      const paths = svgRef.current.querySelectorAll<SVGPathElement>('[data-blob]')
      paths.forEach((path, i) => {
        const blob = BLOBS[i]
        const count = data[blob.key as keyof typeof data]
        const baseR = 24 + (count / 100) * 12 // 24~36 — 개수에 비례
        const t = timeRef.current + i * 1.5
        const scale = 1 + Math.sin(t * 0.8) * 0.08
        const tx = Math.sin(t * 0.6 + i) * 2
        const ty = Math.cos(t * 0.7 + i) * 2
        path.setAttribute('d', blobPath(blob.cx + tx, blob.cy + ty, baseR * scale, t))
      })
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => { running = false; cancelAnimationFrame(frameRef.current) }
  }, [])

  return (
    <div className="card" style={{
      padding: '20px 24px', minHeight: '180px', display: 'flex',
      flexDirection: 'column', boxShadow: 'none', overflow: 'hidden', position: 'relative'
    }}>
      {/* 타이틀 */}
      <div style={{ position: 'relative', zIndex: 2, marginBottom: '4px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif', letterSpacing: '-0.01em' }}>
          Ready to Slot, Set to Win
        </div>
        <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', fontFamily: 'Paperlogy, sans-serif', marginTop: '2px' }}>
          Scanned Set-Power Status
        </div>
      </div>

      {/* 블롭 영역 */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minHeight: 0, paddingBottom: '4px' }}>
        <svg ref={svgRef} viewBox="0 0 100 100" style={{ width: '100%', height: '100%', maxWidth: '220px', maxHeight: '220px' }}>
          {/* 블렌딩을 위한 필터 */}
          <defs>
            <filter id="blob-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 4개 블롭 */}
          {BLOBS.map((blob, i) => (
            <path
              key={blob.key}
              data-blob={blob.key}
              d={blobPath(blob.cx, blob.cy, 24 + (data[blob.key as keyof typeof data] / 100) * 12, i * 1.5)}
              fill={blob.color}
              fillOpacity={0.35}
              stroke="none"
              filter="url(#blob-glow)"
              style={{ mixBlendMode: 'screen' }}
            />
          ))}

          {/* 중앙 — 겹치는 부분 밝게 (radial gradient) */}
          <defs>
            <radialGradient id="center-glow" cx="50%" cy="50%" r="20%">
              <stop offset="0%" stopColor="white" stopOpacity="0.7" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="18" fill="url(#center-glow)" />

          {/* 중앙 숫자 */}
          <text x="50" y="50" textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: '18px', fontWeight: '700', fill: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif' }}>
            {total}
          </text>
        </svg>

        {/* 솔루션 라벨 — 4 코너, 숫자 크게 + 이름 작게 */}
        {BLOBS.map((blob) => {
          const count = data[blob.key as keyof typeof data]
          const isTop = blob.cy < 50
          const isLeft = blob.cx < 50
          const style: React.CSSProperties = {
            position: 'absolute',
            fontFamily: 'Paperlogy, sans-serif',
            whiteSpace: 'nowrap',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            ...(isTop && isLeft  ? { top: '18%', left: '2px', alignItems: 'flex-start' } : {}),
            ...(isTop && !isLeft ? { top: '28%', right: '2px', alignItems: 'flex-end' } : {}),
            ...(!isTop && !isLeft ? { bottom: '18%', right: '6px', alignItems: 'flex-end' } : {}),
            ...(!isTop && isLeft  ? { bottom: '28%', left: '6px', alignItems: 'flex-start' } : {}),
          }
          return (
            <div key={blob.key} style={style}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={14} fill={blob.color} style={{ color: blob.color, flexShrink: 0 }} />
                <span style={{ fontSize: '18px', fontWeight: '700', color: 'hsl(var(--foreground))', lineHeight: 1 }}>
                  {count}
                </span>
              </span>
              <span style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))', marginTop: '2px' }}>
                {blob.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* 하단 메시지 */}
      <div style={{ textAlign: 'center', fontSize: '10px', color: 'hsl(var(--muted-foreground))', fontFamily: 'Paperlogy, sans-serif', opacity: 0.7, paddingTop: '4px' }}>
        Expand your power for the ultimate win
      </div>
    </div>
  )
}
