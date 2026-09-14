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
  /** 캠페인 총예산 — 기본 뷰의 X축 max */
  totalBudget: number
  onAsk?: (question: string) => void
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

export function BOResponseCurveChart({ data, allocations, kpiLabel, insight, viewMode, totalBudget, onAsk }: BOResponseCurveChartProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const toggleSeries = (name: string) => {
    setHidden(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

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

  // 곡선 생성 상한(모델 전체 제공 범위)
  const modelMaxSpend = Math.max(...curveItems.map(m => m.maxSpend))
  // X축 표시 범위: 캠페인 총예산 기준 고정
  const axisMax = Math.min(totalBudget, modelMaxSpend)

  // 수식으로 200개 등간격 포인트 생성 (항상 모델 전체 범위로 생성 → domain으로 잘라 표시)
  const chartData = useMemo(() => {
    const steps = 200
    return Array.from({ length: steps + 1 }, (_, i) => {
      const spend = (modelMaxSpend / steps) * i
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
  }, [curveItems, modelMaxSpend])

  // currentSpend 마커 판별용
  const currentSpendMap = new Map(curveItems.map(m => [m.name, m.currentSpend]))

  // KPI 영문 라벨
  const kpiEn = { '노출': 'Impression', '클릭': 'Click', '조회': 'View', '도달': 'Reach' }[kpiLabel] || kpiLabel

  return (
    <div className="min-h-[400px] flex flex-col">
      {/* 타이틀 + Info */}
      <div className="relative flex items-center gap-1.5 mb-1 shrink-0">
        <h4 className="text-[17px] font-medium m-0">예산을 더 넣으면 성과가 오를까?</h4>
        <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Response Curve</span>
        <button
          onMouseEnter={() => setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
          className="flex items-center bg-transparent border-none p-0.5 cursor-help text-[hsl(var(--muted-foreground))] opacity-60"
        >
          <Info size={14} />
        </button>

        {tooltipOpen && (
          <div className="absolute top-full left-0 mt-2 w-[320px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-3 shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] z-[100] text-[12px] leading-[1.6] text-[hsl(var(--muted-foreground))]">
            <div className="font-semibold text-[hsl(var(--foreground))] mb-1.5">Response Curve</div>
            매체별 예산 투입 대비 KPI 반응 곡선입니다.
            <div className="mt-2 text-[11px] leading-[1.6]">
              <div><strong>●점(Current Spend)</strong>: 현재 배분된 예산 지점</div>
              <div><strong>점 왼쪽</strong>: 이미 투입된 예산 구간의 성과</div>
              <div><strong>점 오른쪽</strong>: 추가 투입 시 예상 성과 (곡선이 완만할수록 효율 포화)</div>
              <div className="mt-1.5">기여 상위 5개 {viewMode === 'product' ? '상품' : '매체'}만 표시됩니다.</div>
            </div>
          </div>
        )}
      </div>
      <p className="text-[11px] text-[hsl(var(--muted-foreground))] mb-2 shrink-0">
        예산 투입 대비 보장 {kpiLabel} 반응
      </p>

      {/* 차트 + 우측 범례 (고정 높이 → 인사이트 구분선 위치 좌우 통일) */}
      <div className="h-[300px] flex gap-4 shrink-0">
        <div className="flex-1">
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
                domain={[0, axisMax]}
                allowDataOverflow
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
                      <div style={{ fontWeight: '600', marginBottom: '6px', color: 'hsl(var(--foreground))' }}>Spend: {Math.round(label as number).toLocaleString()}원</div>
                      {payload.filter((p: any) => p.value != null).map((p: any) => (
                        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                          <span style={{ width: '14px', height: '3px', backgroundColor: p.stroke, flexShrink: 0, borderRadius: '1px' }} />
                          <span style={{ color: 'hsl(var(--foreground))' }}>{p.name}</span>
                          <span style={{ marginLeft: 'auto', fontWeight: '500', color: 'hsl(var(--foreground))' }}>{Math.round(p.value).toLocaleString()}</span>
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
                  hide={hidden.has(media.name)}
                  stroke={getMediaColorByRank(idx)}
                  strokeWidth={idx === 0 ? 2.5 : 1.5}
                  connectNulls={false}
                  dot={(props: any) => {
                    const { cx, cy, index } = props
                    // currentSpend에 가장 가까운 단 1개 포인트에서만 마커
                    const cs = currentSpendMap.get(media.name) || 0
                    const spendAtIdx = (modelMaxSpend / 200) * index
                    const spendAtPrev = index > 0 ? (modelMaxSpend / 200) * (index - 1) : -Infinity
                    const spendAtNext = (modelMaxSpend / 200) * (index + 1)
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

        {/* 우측 범례 (클릭 토글) */}
        <div className="w-[200px] flex flex-col shrink-0">
          {/* 범례 항목: 세로 중앙 */}
          <div className="flex-1 flex flex-col justify-center gap-2">
            {curveItems.map((media, idx) => {
              const isHidden = hidden.has(media.name)
              return (
                <button
                  key={media.name}
                  onClick={() => toggleSeries(media.name)}
                  title={media.name}
                  className="flex items-center gap-1.5 text-[11px] bg-transparent border-none p-0 cursor-pointer text-left transition-opacity"
                  style={{
                    color: isHidden ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))',
                    opacity: isHidden ? 0.45 : 1
                  }}
                >
                  <span style={{ width: '16px', height: '2px', backgroundColor: getMediaColorByRank(idx), flexShrink: 0, borderRadius: '1px' }} />
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ textDecoration: isHidden ? 'line-through' : 'none' }}>{media.name}</span>
                </button>
              )
            })}
            <div className="mt-2 text-[10px] text-[hsl(var(--muted-foreground))] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--foreground))]" />
              <span>Current spend</span>
            </div>
          </div>
        </div>
      </div>

      {/* SpinX Insight (차트 영역 아래 자연 배치 — 텍스트 길이에 따라 아래로 늘어남) */}
      <div className="mt-4 shrink-0">
        <BOSpinXInsight text={insight} onAsk={onAsk} followUpQuestion="#Response Curve 차트 " />
      </div>
    </div>
  )
}
