import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList } from 'recharts'
import { Sparkles } from 'lucide-react'
import { BOKpiContributionItem } from './resultSampleData'

interface BOKpiContributionChartProps {
  data: BOKpiContributionItem[]
  insight: string
}

const POSITIVE = 'hsl(217 91% 60%)'  // 증액: 파랑
const NEGATIVE = 'hsl(0 72% 60%)'    // 감액: 빨강

const formatDelta = (v: number) => {
  const sign = v > 0 ? '+' : v < 0 ? '-' : ''
  const abs = Math.abs(v)
  if (abs >= 100000000) return `${sign}${(abs / 100000000).toFixed(1)}억`
  if (abs >= 10000) return `${sign}${Math.round(abs / 10000).toLocaleString()}만`
  return `${sign}${abs.toLocaleString()}`
}

export function BOKpiContributionChart({ data, insight }: BOKpiContributionChartProps) {
  return (
    <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '20px', backgroundColor: 'hsl(var(--card))' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>KPI 창출 (예산 변동)</h3>
      <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>최적화 전후 매체별 예산 변동분 (증액 / 감액)</p>
      <div style={{ width: '100%', height: '200px' }}>
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
                <Cell key={i} fill={d.delta >= 0 ? POSITIVE : NEGATIVE} />
              ))}
              <LabelList dataKey="delta" position="top" formatter={((v: number) => formatDelta(v)) as any} style={{ fontSize: '10px', fill: 'hsl(var(--foreground))' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: '16px', padding: '10px 12px', backgroundColor: 'hsl(var(--muted) / 0.4)', borderRadius: '6px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <Sparkles size={14} style={{ color: 'hsl(var(--primary))', flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'hsl(var(--muted-foreground))' }}>{insight}</span>
      </div>
    </div>
  )
}
