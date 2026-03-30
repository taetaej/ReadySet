import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

interface SolutionOutputCardProps {
  data?: {
    datashot: number
    adCurator: number
    budgetOptimizer: number
    reachCaster: number
  }
}

const DEFAULT_DATA = {
  datashot: 23,
  adCurator: 31,
  budgetOptimizer: 17,
  reachCaster: 48,
}

// 솔루션별 색상 — foreground 기반 opacity 차등 (미니멀)
const SOLUTION_COLORS = [
  { key: 'reachCaster',      label: 'Reach Caster',      color: 'hsl(var(--foreground))', opacity: 0.9 },
  { key: 'adCurator',        label: 'Ad Curator',         color: 'hsl(var(--foreground))', opacity: 0.6 },
  { key: 'datashot',         label: 'DataShot',           color: 'hsl(var(--foreground))', opacity: 0.35 },
  { key: 'budgetOptimizer',  label: 'Budget Optimizer',   color: 'hsl(var(--foreground))', opacity: 0.18 },
]

export function SolutionOutputCard({ data = DEFAULT_DATA }: SolutionOutputCardProps) {
  const total = data.datashot + data.adCurator + data.budgetOptimizer + data.reachCaster

  // RadialBarChart는 value가 클수록 링이 길어짐 — 비율(%)로 변환
  const chartData = SOLUTION_COLORS.map(s => ({
    name: s.label,
    value: Math.round((data[s.key as keyof typeof data] / total) * 100),
    count: data[s.key as keyof typeof data],
    fill: s.color,
    fillOpacity: s.opacity,
  }))

  return (
    <div className="card" style={{
      padding: '20px 24px',
      minHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'none',
      overflow: 'hidden'
    }}>
      {/* 타이틀 */}
      <div style={{ marginBottom: '12px' }}>
        <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', margin: '0 0 2px 0', fontFamily: 'Paperlogy, sans-serif' }}>
          솔루션 Output 현황
        </p>
        <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif' }}>
          총 {total}개 결과물
        </h3>
      </div>

      {/* 차트 + 범례 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', minHeight: 0 }}>
        {/* RadialBarChart */}
        <div style={{ width: '140px', height: '140px', flexShrink: 0, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="28%"
              outerRadius="100%"
              barSize={12}
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={6}
                background={{ fill: 'hsl(var(--muted) / 0.3)' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          {/* 중앙 총합 */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif', lineHeight: 1 }}>
              {total}
            </div>
            <div style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))', marginTop: '3px' }}>
              Total
            </div>
          </div>
        </div>

        {/* 범례 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
          {SOLUTION_COLORS.map((s) => {
            const count = data[s.key as keyof typeof data]
            return (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: s.color, opacity: s.opacity, display: 'inline-block'
                }} />
                <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', flex: 1, fontFamily: 'Paperlogy, sans-serif' }}>
                  {s.label}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif', flexShrink: 0 }}>
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
