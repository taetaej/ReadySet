import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { BODailyAttributionPoint, BOAllocation } from './resultSampleData'
import { getMediaColorByRank } from './constants'
import { BOSpinXInsight } from './BOSpinXInsight'

interface BODailyAttributionChartProps {
  data: BODailyAttributionPoint[]
  allocations: BOAllocation[]
  kpiLabel: string
  insight: string
}

const formatAxis = (v: number) => {
  if (v >= 100000000) return `${(v / 100000000).toFixed(0)}억`
  if (v >= 10000) return `${Math.round(v / 10000)}만`
  return `${v}`
}

export function BODailyAttributionChart({ data, allocations, kpiLabel, insight }: BODailyAttributionChartProps) {
  // 매체별 예산순 정렬
  const mediaBudgets = new Map<string, number>()
  for (const a of allocations) mediaBudgets.set(a.mediaName, (mediaBudgets.get(a.mediaName) || 0) + a.budget)
  const mediaNames = [...mediaBudgets.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name)

  return (
    <div style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      <h4 style={{ fontSize: '14px', fontWeight: '600', margin: 0, marginBottom: '4px', flexShrink: 0 }}>Daily Attribution</h4>
      <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px', flexShrink: 0 }}>Cumulative {kpiLabel} contribution by media over campaign period</p>
      <div style={{ flex: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tickFormatter={formatAxis} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={40} />
            <Tooltip
              formatter={((value: number, name: string) => [`${value.toLocaleString()} ${kpiLabel}`, name]) as any}
              contentStyle={{ fontSize: '12px', borderRadius: '6px', border: '1px solid hsl(var(--border))' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            {mediaNames.map((name, i) => (
              <Area key={name} type="monotone" dataKey={name} stackId="1" stroke={getMediaColorByRank(i)} fill={getMediaColorByRank(i)} fillOpacity={0.7} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 'auto', flexShrink: 0 }}>
        <BOSpinXInsight text={insight} />
      </div>
    </div>
  )
}
