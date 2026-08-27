import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Sparkles } from 'lucide-react'
import { BOAllocation } from './resultSampleData'

interface BOBudgetPieChartProps {
  allocations: BOAllocation[]
  insight: string
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(217 91% 60%)',
  'hsl(142 71% 45%)',
  'hsl(38 92% 50%)',
  'hsl(280 65% 60%)',
  'hsl(0 72% 60%)',
  'hsl(190 90% 42%)',
  'hsl(320 65% 55%)'
]

const formatBudget = (v: number) => {
  if (v >= 100000000) return `${(v / 100000000).toFixed(1)}억`
  if (v >= 10000) return `${Math.round(v / 10000).toLocaleString()}만`
  return v.toLocaleString()
}

export function BOBudgetPieChart({ allocations, insight }: BOBudgetPieChartProps) {
  const data = allocations.map(a => ({
    name: a.mediaName,
    value: a.budget,
    ratio: a.ratio
  }))

  return (
    <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '20px', backgroundColor: 'hsl(var(--card))' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>예산 비중</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '180px', height: '180px', flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip
                formatter={((value: number, name: string) => [`${formatBudget(value)}원`, name]) as any}
                contentStyle={{ fontSize: '12px', borderRadius: '6px', border: '1px solid hsl(var(--border))' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.map((d, i) => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: COLORS[i % COLORS.length], flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
              </div>
              <span style={{ fontWeight: '500', flexShrink: 0, marginLeft: '8px' }}>{d.ratio}% · {formatBudget(d.value)}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '16px', padding: '10px 12px', backgroundColor: 'hsl(var(--muted) / 0.4)', borderRadius: '6px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <Sparkles size={14} style={{ color: 'hsl(var(--primary))', flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'hsl(var(--muted-foreground))' }}>{insight}</span>
      </div>
    </div>
  )
}
