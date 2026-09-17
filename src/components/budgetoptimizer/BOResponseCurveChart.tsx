import { useState, useMemo, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Info, ChevronDown } from 'lucide-react'
import { BOResponseCurveMedia, BOAllocation } from './resultSampleData'
import { ACCENT_COLOR } from './constants'
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
  const [pickerOpen, setPickerOpen] = useState(false)
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  type CurveItem = { name: string; currentSpend: number; maxSpend: number; satA: number; satB: number }

  // viewMode에 따라 선택 가능한 항목 목록 (기여도 순, 최대 5개)
  const options: CurveItem[] = useMemo(() => {
    if (viewMode === 'media') {
      // 매체 레벨: responseCurve 데이터 사용, kpiValue 순 Top5
      const mediaBudgets = new Map<string, number>()
      for (const a of allocations) mediaBudgets.set(a.mediaName, (mediaBudgets.get(a.mediaName) || 0) + a.kpiValue)
      const sorted = [...mediaBudgets.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name).slice(0, 5)
      return sorted.map(name => {
        const m = data.find(d => d.name === name)
        return m ? { name: m.name, currentSpend: m.currentSpend, maxSpend: m.maxSpend, satA: m.satA, satB: m.satB } : null
      }).filter(Boolean) as CurveItem[]
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

  // viewMode 전환 시 기여 1위로 선택 초기화 (선택값이 목록에 없으면 리셋)
  useEffect(() => {
    if (options.length === 0) return
    if (!selectedName || !options.some(o => o.name === selectedName)) {
      setSelectedName(options[0].name)
    }
  }, [options, selectedName])

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!pickerOpen) return
    const onClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setPickerOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [pickerOpen])

  const selected: CurveItem | undefined = options.find(o => o.name === selectedName) || options[0]

  // X축 표시 범위: 선택 항목의 예산 스케일 기준 (캠페인 총예산으로 상한)
  const modelMaxSpend = selected ? selected.maxSpend : 0
  const axisMax = Math.min(totalBudget, modelMaxSpend)

  // 선택 항목 단일 곡선 — 200개 등간격 포인트
  // currentSpend 기준으로 실선(below)/점선(above) 분리. 경계점은 양쪽에 모두 담아 선이 이어지게 함.
  const chartData = useMemo(() => {
    if (!selected) return []
    const steps = 200
    const cs = selected.currentSpend
    const pts = Array.from({ length: steps + 1 }, (_, i) => {
      const spend = (selected.maxSpend / steps) * i
      const value = Math.round(saturationFn(spend, selected.satA, selected.satB))
      return {
        spend,
        below: spend <= cs ? value : null,   // 현재 스펜드까지: 실선
        above: spend >= cs ? value : null,   // 현재 스펜드 이후: 점선
      } as { spend: number; below: number | null; above: number | null }
    })
    // currentSpend 정확한 경계점을 삽입해 실선/점선이 정확히 만나게 함
    const csValue = Math.round(saturationFn(cs, selected.satA, selected.satB))
    const boundary = { spend: cs, below: csValue, above: csValue }
    const idx = pts.findIndex(p => p.spend >= cs)
    if (idx >= 0) pts.splice(idx, 0, boundary)
    return pts
  }, [selected])

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
              <div><strong>●점(Current Spend)</strong>: 이 배분안에서 배정된 예산 지점</div>
              <div><strong>점 왼쪽</strong>: 배정 예산까지의 예상 성과 (실선)</div>
              <div><strong>점 오른쪽</strong>: 예산 추가 시 예상 성과 (점선, 완만할수록 효율 포화)</div>
              <div className="mt-1.5">기여 상위 5개 {viewMode === 'product' ? '상품' : '매체'}만 표시되며, 우측에서 곡선을 전환할 수 있습니다.</div>
            </div>
          </div>
        )}
      </div>
      <p className="text-[11px] text-[hsl(var(--muted-foreground))] mb-2 shrink-0">
        예산 투입 대비 예상 {kpiLabel} 반응
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
                  // below/above 중 값이 있는 시리즈 하나를 집음
                  const v = payload.map((p: any) => p.value).find((x: any) => x != null)
                  if (v == null) return null
                  return (
                    <div style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }}>
                      <div style={{ fontWeight: '600', marginBottom: '6px', color: 'hsl(var(--foreground))' }}>Spend: {Math.round(label as number).toLocaleString()}원</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '14px', height: '3px', backgroundColor: 'hsl(var(--foreground))', flexShrink: 0, borderRadius: '1px' }} />
                        <span style={{ color: 'hsl(var(--foreground))' }}>예상 {kpiLabel}</span>
                        <span style={{ marginLeft: 'auto', fontWeight: '500', color: 'hsl(var(--foreground))' }}>{Math.round(v).toLocaleString()}</span>
                      </div>
                    </div>
                  )
                }}
              />
              {selected && (
                <>
                  {/* 현재 스펜드까지 — 실선(무채색, 톤 다운) + 경계점 마커(강조색) */}
                  <Line
                    type="monotone"
                    dataKey="below"
                    stroke="hsl(var(--foreground) / 0.7)"
                    strokeWidth={2.5}
                    connectNulls={false}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props
                      // 정확한 경계점(spend === currentSpend)에만 강조색 마커
                      if (payload?.spend === selected.currentSpend) {
                        return <circle cx={cx} cy={cy} r={6} fill={ACCENT_COLOR} stroke="hsl(var(--background))" strokeWidth={2} />
                      }
                      return <g />
                    }}
                    activeDot={{ r: 3 }}
                    isAnimationActive={false}
                  />
                  {/* 현재 스펜드 이후 — 점선(무채색, 더 옅게 — 추가 투입 예상) */}
                  <Line
                    type="monotone"
                    dataKey="above"
                    stroke="hsl(var(--foreground) / 0.4)"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    connectNulls={false}
                    dot={false}
                    activeDot={{ r: 3 }}
                    isAnimationActive={false}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 우측 — 선택 항목(=드롭다운 트리거) + 범례 */}
        <div className="w-[220px] flex flex-col justify-center shrink-0">
          {/* 항목명 자체가 드롭다운 트리거 */}
          <div ref={pickerRef} className="relative">
            <button
              onClick={() => setPickerOpen(o => !o)}
              className="w-full flex items-start justify-between gap-1.5 bg-transparent border-none p-0 text-left cursor-pointer group"
            >
              <span className="text-[13px] font-medium leading-snug text-[hsl(var(--foreground))] break-keep group-hover:text-[hsl(var(--foreground)/0.8)] transition-colors">
                {selected?.name ?? '항목 선택'}
              </span>
              <ChevronDown size={15} className={`shrink-0 mt-0.5 text-[hsl(var(--muted-foreground))] transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
            </button>
            {pickerOpen && (
              <div className="dropdown custom-scrollbar absolute top-full left-0 right-0 mt-1.5 max-h-[220px] overflow-y-auto z-[1000]">
                {options.map(opt => (
                  <button
                    key={opt.name}
                    onClick={() => { setSelectedName(opt.name); setPickerOpen(false) }}
                    title={opt.name}
                    className={`dropdown-item text-[12px] ${opt.name === selectedName ? 'font-medium bg-[hsl(var(--muted))]' : ''}`}
                  >
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{opt.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 범례 */}
          <div className="mt-4 pt-3 border-t border-[hsl(var(--border))] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[11px] text-[hsl(var(--foreground))]">
              <svg width="20" height="4" className="shrink-0"><line x1="0" y1="2" x2="20" y2="2" stroke="hsl(var(--foreground))" strokeOpacity="0.7" strokeWidth="2.5" /></svg>
              <span>배정 예산까지</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))]">
              <svg width="20" height="4" className="shrink-0"><line x1="0" y1="2" x2="20" y2="2" stroke="hsl(var(--foreground))" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="5 4" /></svg>
              <span>예산 추가 시</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[hsl(var(--foreground))]">
              <span className="w-2 h-2 rounded-full shrink-0 ml-[6px] mr-[6px]" style={{ backgroundColor: ACCENT_COLOR }} />
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
