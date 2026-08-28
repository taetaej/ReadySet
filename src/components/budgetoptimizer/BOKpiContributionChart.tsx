import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList } from 'recharts'
import { BOKpiContributionItem } from './resultSampleData'
import { getMediaColorByRank } from './constants'
import { BOSpinXInsight } from './BOSpinXInsight'

interface BOKpiContributionChartProps {
  data: BOKpiContributionItem[]
  insight: string
}

const formatDelta = (v: number) => {
  const sign = v > 0 ? '+' : v < 0 ? '-' : ''
  const abs = Math.abs(v)
  if (abs >= 100000000) return `${sign}${(abs / 100000000).toFixed(1)}억`
  if (abs >= 10000) return `${sign}${Math.round(abs / 10000).toLocaleString()}만`
  return `${sign}${abs.toLocaleString()}`
}

export function BOKpiContributionChart({ data, insight }: BOKpiContributionChartProps) {
  // delta 크기 순으로 rank 계산 (가장 큰 증액 = rank 0 = 강조색)
  const sorted = [...data].sort((a, b) => b.delta - a.delta)
  const rankMap = new Map(sorted.map((d, i) => [d.name, i]))

  return (
    <div style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      <h4 style={{ fontSize: '14px', fontWeight: '600', margin: 0, marginBottom: '4px', flexShrink: 0 }}>Budget Reallocation</h4>
      <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px', flexShrink: 0 }}>Budget change per media vs. equal distribution</p>
      <div style={{ flex: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={0} />
            <YAxis tickFormatter={formatDelta} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={48} />
            <Tooltip
              formatter={((value: number) => [`${formatDelta(value)}원`, '예산 변동']) as any}
              contentStyle={{ fontSize: '12px', borderRadius: '6px', border: '1px solid hsl(var(--border))' }}
            />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
            <Bar dataKey="delta" radius={[3, 3, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={getMediaColorByRank(rankMap.get(d.name) || 0)} />
              ))}
              <LabelList dataKey="delta" position="top" formatter={((v: number) => formatDelta(v)) as any} style={{ fontSize: '10px', fill: 'hsl(var(--foreground))' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 'auto', flexShrink: 0 }}>
        <BOSpinXInsight text={insight} />
      </div>
    </div>
  )
}
