import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Sparkles } from 'lucide-react'
import { BOResponseCurvePoint, BOAllocation } from './resultSampleData'

interface BOResponseCurveChartProps {
  data: BOResponseCurvePoint[]
  allocations: BOAllocation[]
  kpiLabel: string
  insight: string
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(217 91% 60%)',
  'hsl(142 71% 45%)',
  'hsl(38 92% 50%)',
  'hsl(280 65% 60%)',
  'hsl(0 72% 60%)'
]

const formatAxis = (v: number) => {
  if (v >= 100000000) return `${(v / 100000000).toFixed(0)}억`
  if (v >= 10000) return `${Math.round(v / 10000)}만`
  return `${v}`
}

export function BOResponseCurveChart({ data, allocations, kpiLabel, insight }: BOResponseCurveChartProps) {
  const mediaNames = allocations.map(a => a.mediaName)

  return (
    <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '20px', backgroundColor: 'hsl(var(--card))' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>반응곡선 (Response Curve)</h3>
      <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>매체별 예산 투입 대비 {kpiLabel} 반응</p>
      <div style={{ width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="budget" tickFormatter={formatAxis} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tickFormatter={formatAxis} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={40} />
            <Tooltip
              formatter={((value: number, name: string) => [`${value.toLocaleString()} ${kpiLabel}`, name]) as any}
              labelFormatter={((label: number) => `예산 ${formatAxis(label)}원`) as any}
              contentStyle={{ fontSize: '12px', borderRadius: '6px', border: '1px solid hsl(var(--border))' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            {mediaNames.map((name, i) => (
              <Line key={name} type="monotone" dataKey={name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: '16px', padding: '10px 12px', backgroundColor: 'hsl(var(--muted) / 0.4)', borderRadius: '6px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <Sparkles size={14} style={{ color: 'hsl(var(--primary))', flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'hsl(var(--muted-foreground))' }}>{insight}</span>
      </div>
    </div>
  )
}
