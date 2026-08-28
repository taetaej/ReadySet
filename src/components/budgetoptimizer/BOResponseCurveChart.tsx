import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Info } from 'lucide-react'
import { BOResponseCurveMedia, BOAllocation } from './resultSampleData'
import { getMediaColorByRank } from './constants'
import { BOSpinXInsight } from './BOSpinXInsight'

interface BOResponseCurveChartProps {
  data: BOResponseCurveMedia[]
  allocations: BOAllocation[]
  kpiLabel: string
  insight: string
  viewMode: 'media' | 'product'
}

const formatAxis = (v: number) => {
  if (v >= 100000000) return `${(v / 100000000).toFixed(1)}억`
  if (v >= 10000000) return `${(v / 10000000).toFixed(0)}천만`
  if (v >= 10000) return `${Math.round(v / 10000)}만`
  return `${v}`
}

// 포화 함수: y = a * (1 - e^(-b*x))
function saturationFn(x: number, a: number, b: number): number {
  return a * (1 - Math.exp(-b * x))
}

export function BOResponseCurveChart({ data, allocations, kpiLabel, insight, viewMode }: BOResponseCurveChartProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  // viewMode에 따라 데이터 소스 결정
  const curveItems: { name: string; currentSpend: number; maxSpend: number; satA: number; satB: number }[] = useMemo(() => {
    if (viewMode === 'media') {
      // 매체 레벨: responseCurve 데이터 사용, kpiValue 순 Top5
      const mediaBudgets = new Map<string, number>()
      for (const a of allocations) mediaBudgets.set(a.mediaName, (mediaBudgets.get(a.mediaName) || 0) + a.kpiValue)
      const sorted = [...mediaBudgets.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name).slice(0, 5)
      return sorted.map(name => {
        const m = data.find(d => d.name === name)
        return m ? { name: m.name, currentSpend: m.currentSpend, maxSpend: m.maxSpend, satA: m.satA, satB: m.satB } : null
      }).filter(Boolean) as any[]
    } else {
      // 상품 레벨: allocations의 satA/satB 사용, kpiValue 순 Top5
      return [...allocations]
        .sort((a, b) => b.kpiValue - a.kpiValue)
        .slice(0, 5)
        .map(a => ({
          name: `${a.mediaName} > ${a.productName}`,
          currentSpend: a.budget,
          maxSpend: a.budget * 3,
          satA: a.satA,
          satB: a.satB
        }))
    }
  }, [viewMode, data, allocations])

  const maxSpend = Math.max(...curveItems.map(m => m.maxSpend))

  // 수식으로 200개 등간격 포인트 생성
  const chartData = useMemo(() => {
    const steps = 200
    return Array.from({ length: steps + 1 }, (_, i) => {
      const spend = (maxSpend / steps) * i
      const point: Record<string, number | undefined> = { spend }
      for (const media of curveItems) {
        if (spend > media.maxSpend) {
          point[media.name] = undefined
        } else {
          point[media.name] = Math.round(saturationFn(spend, media.satA, media.satB))
        }
      }
      return point
    })
  }, [curveItems, maxSpend])

  // currentSpend 마커 판별용
  const currentSpendMap = new Map(curveItems.map(m => [m.name, m.currentSpend]))

  // KPI 영문 라벨
  const kpiEn = { '노출': 'Impression', '클릭': 'Click', '조회': 'View', '도달': 'Reach' }[kpiLabel] || kpiLabel

  return (
    <div style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      {/* 타이틀 + Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexShrink: 0, position: 'relative' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>Response Curve</h4>
        <button
          onMouseEnter={() => setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
          style={{ background: 'none', border: 'none', padding: '2px', cursor: 'help', display: 'flex', alignItems: 'center', color: 'hsl(var(--muted-foreground))', opacity: 0.6 }}
        >
          <Info size={14} />
        </button>
        {tooltipOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '320px',
            backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
            borderRadius: '8px', padding: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            zIndex: 100, fontSize: '12px', lineHeight: '1.6', color: 'hsl(var(--muted-foreground))'
          }}>
            <div style={{ fontWeight: '600', color: 'hsl(var(--foreground))', marginBottom: '6px' }}>Response Curve</div>
            매체별 예산 투입 대비 KPI 반응 곡선입니다.
            <div style={{ marginTop: '8px', fontSize: '11px', lineHeight: '1.6' }}>
              <div><strong>●점(Current Spend)</strong>: 현재 배분된 예산 지점</div>
              <div><strong>점 왼쪽</strong>: 이미 투입된 예산 구간의 성과</div>
              <div><strong>점 오른쪽</strong>: 추가 투입 시 예상 성과 (곡선이 완만할수록 효율 포화)</div>
              <div style={{ marginTop: '6px' }}>KPI 기여 상위 5개 항목만 표시됩니다.</div>
            </div>
          </div>
        )}
      </div>
      <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '8px', flexShrink: 0 }}>
        Spend vs. Guaranteed {kpiEn}
      </p>

      {/* 차트 + 우측 범례 */}
      <div style={{ flex: 1, display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 16, right: 8, left: 8, bottom: 8 }}>
              <XAxis
                dataKey="spend"
                tickFormatter={formatAxis}
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                axisLine={false}
                tickLine={false}
                tickCount={6}
                type="number"
                domain={[0, maxSpend]}
              />
              <YAxis
                tickFormatter={formatAxis}
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                width={50}
                axisLine={false}
                tickLine={false}
                tickCount={5}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }}>
                      <div style={{ fontWeight: '600', marginBottom: '6px', color: 'hsl(var(--foreground))' }}>Spend: {formatAxis(label as number)}</div>
                      {payload.filter((p: any) => p.value != null).map((p: any) => (
                        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                          <span style={{ width: '14px', height: '3px', backgroundColor: p.stroke, flexShrink: 0, borderRadius: '1px' }} />
                          <span style={{ color: 'hsl(var(--foreground))' }}>{p.name}</span>
                          <span style={{ marginLeft: 'auto', fontWeight: '500', color: 'hsl(var(--foreground))' }}>{formatAxis(p.value)}</span>
                        </div>
                      ))}
                    </div>
                  )
                }}
              />
              {curveItems.map((media, idx) => (
                <Line
                  key={media.name}
                  type="linear"
                  dataKey={media.name}
                  stroke={getMediaColorByRank(idx)}
                  strokeWidth={idx === 0 ? 2.5 : 1.5}
                  connectNulls={false}
                  dot={(props: any) => {
                    const { cx, cy, index } = props
                    // currentSpend에 가장 가까운 단 1개 포인트에서만 마커
                    const cs = currentSpendMap.get(media.name) || 0
                    const spendAtIdx = (maxSpend / 200) * index
                    const spendAtPrev = index > 0 ? (maxSpend / 200) * (index - 1) : -Infinity
                    const spendAtNext = (maxSpend / 200) * (index + 1)
                    const distCurr = Math.abs(spendAtIdx - cs)
                    const distPrev = Math.abs(spendAtPrev - cs)
                    const distNext = Math.abs(spendAtNext - cs)
                    if (distCurr <= distPrev && distCurr <= distNext) {
                      return <circle cx={cx} cy={cy} r={idx === 0 ? 6 : 5} fill={getMediaColorByRank(idx)} stroke="hsl(var(--background))" strokeWidth={2} />
                    }
                    return <g />
                  }}
                  activeDot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 우측 범례 */}
        <div style={{ width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px', flexShrink: 0 }}>
          {curveItems.map((media, idx) => (
            <div key={media.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <span style={{ width: '16px', height: '2px', backgroundColor: getMediaColorByRank(idx), flexShrink: 0, borderRadius: '1px' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{media.name}</span>
            </div>
          ))}
          <div style={{ marginTop: '8px', fontSize: '10px', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'hsl(var(--foreground))' }} />
            <span>Current spend</span>
          </div>
        </div>
      </div>

      {/* SpinX Insight */}
      <div style={{ marginTop: 'auto', flexShrink: 0 }}>
        <BOSpinXInsight text={insight} />
      </div>
    </div>
  )
}
