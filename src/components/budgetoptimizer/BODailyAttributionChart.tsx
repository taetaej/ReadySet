import { useState, useMemo, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts'
import { Info, Maximize2, Minimize2 } from 'lucide-react'
import { BODailyAttributionPoint, BOAllocation } from './resultSampleData'
import { getMediaColorByRank } from './constants'
import { BOSpinXInsight } from './BOSpinXInsight'

interface BODailyAttributionChartProps {
  data: BODailyAttributionPoint[]
  /** 상품 레벨 시계열 (viewMode='product'일 때 사용) */
  dataByProduct: BODailyAttributionPoint[]
  allocations: BOAllocation[]
  kpiLabel: string
  insight: string
  viewMode: 'media' | 'product'
  onAsk?: (question: string) => void
  /** 내 캠페인 기간 — 전년/전전년 동기간을 음영으로 표시 */
  campaignPeriod?: { start: string; end: string }
}

const formatAxis = (v: number) => {
  if (v >= 100000000) return `${(v / 100000000).toFixed(1)}억`
  if (v >= 10000000) return `${(v / 10000000).toFixed(0)}천만`
  if (v >= 10000) return `${Math.round(v / 10000)}만`
  return `${v}`
}

const formatDateTick = (iso: string) => {
  // 'YYYY-MM-DD' → 'MM-DD'
  return iso?.slice(5) ?? ''
}

export function BODailyAttributionChart({ data, dataByProduct, allocations, kpiLabel, insight, viewMode, onAsk, campaignPeriod }: BODailyAttributionChartProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [zoomedOut, setZoomedOut] = useState(false)
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const toggleSeries = (name: string) => {
    setHidden(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  // viewMode 전환 시 숨김 상태 초기화 (매체/상품 시리즈명이 다름)
  useEffect(() => { setHidden(new Set()) }, [viewMode])

  // viewMode에 따라 데이터 소스 선택
  const source = viewMode === 'product' ? dataByProduct : data

  // 시리즈명(매체 or 매체>상품) 정렬: 마지막(피크 근처) 값 기준 Top5
  const mediaNames = useMemo(() => {
    if (viewMode === 'media') {
      const mediaKpi = new Map<string, number>()
      for (const a of allocations) mediaKpi.set(a.mediaName, (mediaKpi.get(a.mediaName) || 0) + a.kpiValue)
      return [...mediaKpi.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name).slice(0, 5)
    }
    // 상품 뷰: 데이터 키에서 시리즈명 추출, 피크값(캠페인 중반) 기준 Top5
    const sample = source[Math.min(45, source.length - 1)] || {}
    const keys = Object.keys(sample).filter(k => k !== 'week' && k !== 'date')
    return keys
      .map(k => ({ k, v: Number(sample[k]) || 0 }))
      .sort((a, b) => b.v - a.v)
      .slice(0, 5)
      .map(x => x.k)
  }, [viewMode, allocations, source])

  // 조회 구간: 기본=최근 1년(최근 52주), 확장=최근 2년(전체)
  const lastWeek = source[source.length - 1]?.week ?? 0
  const startWeek = zoomedOut ? 0 : Math.max(0, lastWeek - 51)
  const chartData = useMemo(() => {
    if (zoomedOut) return source
    return source.filter(d => d.week >= startWeek)
  }, [source, zoomedOut, startWeek])

  // 내 캠페인 기간의 전년/전전년 동기간을 데이터 주차 범위로 환산
  const sameTermBands = useMemo(() => {
    if (!campaignPeriod) return [] as { from: number; to: number; label: string }[]
    const toWeek = (iso: string): number | null => {
      const t = new Date(iso).getTime()
      let best: { w: number; diff: number } | null = null
      for (const p of source) {
        const diff = Math.abs(new Date(p.date as string).getTime() - t)
        if (!best || diff < best.diff) best = { w: p.week, diff }
      }
      return best ? best.w : null
    }
    const bands: { from: number; to: number; label: string }[] = []
    for (const yearsAgo of [1, 2]) {
      const s = new Date(campaignPeriod.start); s.setFullYear(s.getFullYear() - yearsAgo)
      const e = new Date(campaignPeriod.end); e.setFullYear(e.getFullYear() - yearsAgo)
      const from = toWeek(s.toISOString().slice(0, 10))
      const to = toWeek(e.toISOString().slice(0, 10))
      // 데이터 범위 안에 실제로 들어오는 경우만
      if (from != null && to != null && to >= (source[0]?.week ?? 0) && from <= lastWeek) {
        bands.push({ from, to, label: `${new Date(s).getFullYear()} 동기간` })
      }
    }
    return bands
  }, [campaignPeriod, source, lastWeek])

  // KPI 영문 라벨
  const kpiEn = { '노출': 'Impression', '클릭': 'Click', '조회': 'View', '도달': 'Reach' }[kpiLabel] || kpiLabel

  // X축 범위 전환 버튼 (차트 하단 우측, X축 옆)
  const zoomButton = (
    <button
      onClick={() => setZoomedOut(v => !v)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        fontSize: '11px', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
        border: '1px solid hsl(var(--border))', backgroundColor: 'transparent',
        color: 'hsl(var(--muted-foreground))'
      }}
    >
      {zoomedOut ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
      {zoomedOut ? '최근 1년' : '최근 2년'}
    </button>
  )

  return (
    <div style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      {/* 타이틀 + Info + 줌 토글 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexShrink: 0, position: 'relative' }}>
        <h4 style={{ fontSize: '17px', fontWeight: '500', margin: 0 }}>업종 내 매체별 기여는 어떤 흐름일까?</h4>
        <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>Weekly Contribution</span>
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
            <div style={{ fontWeight: '600', color: 'hsl(var(--foreground))', marginBottom: '6px' }}>Weekly Contribution</div>
            해당 업종 모델이 학습한 과거 기간의 {viewMode === 'product' ? '상품별' : '매체별'} 주차별 {kpiLabel} 기여 패턴입니다. 이 시나리오의 미래 예측이 아니라, 업종 데이터에서 관측된 매체별 기여 경향을 보여줍니다.
            <div style={{ marginTop: '8px', fontSize: '11px', lineHeight: '1.6' }}>
              <div><strong>최근 1년</strong>: 가장 최근 52주 구간만 표시</div>
              <div><strong>최근 2년</strong>: 모델이 학습한 전체 기간(104주) 표시</div>
              <div style={{ marginTop: '6px' }}>보라색 음영은 내 캠페인 기간의 전년·전전년 동기간으로, 같은 시기의 업종 매체 기여를 참고할 수 있습니다.</div>
              <div style={{ marginTop: '6px' }}>기여 상위 5개 {viewMode === 'product' ? '상품' : '매체'}만 표시됩니다.</div>
            </div>
          </div>
        )}
      </div>
      <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '8px', flexShrink: 0 }}>
        업종 모델이 학습한 주차별 {viewMode === 'product' ? '상품' : '매체'} 기여 패턴
      </p>

      {/* 차트 + 우측 범례 (고정 높이 → 인사이트 구분선 위치 좌우 통일) */}
      <div style={{ height: '300px', display: 'flex', gap: '16px', flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 16, right: 8, left: 8, bottom: 8 }}>
              <XAxis
                dataKey="week"
                type="number"
                domain={[startWeek, lastWeek]}
                tickFormatter={(week: number) => {
                  const p = source.find(d => d.week === week)
                  return p ? formatDateTick(p.date as string) : `${week}주`
                }}
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                axisLine={false}
                tickLine={false}
                tickCount={6}
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
              {/* 내 캠페인 전년·전전년 동기간 음영 밴드 (현재 표시 구간과 겹치는 부분만 클램프하여 표시) */}
              {sameTermBands
                .filter(b => b.to >= startWeek && b.from <= lastWeek)
                .map((b) => (
                  <ReferenceArea
                    key={b.label}
                    x1={Math.max(b.from, startWeek)}
                    x2={Math.min(b.to, lastWeek)}
                    fill="#BF5AF2"
                    fillOpacity={0.08}
                    label={{ value: b.label, position: 'insideTop', fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  />
                ))}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  const p = source.find(d => d.week === label)
                  return (
                    <div style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)', maxWidth: '340px' }}>
                      <div style={{ fontWeight: '600', marginBottom: '6px', color: 'hsl(var(--foreground))' }}>{p?.date ?? label}</div>
                      {payload.filter((it: any) => it.value != null).map((it: any) => (
                        <div key={it.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                          <span style={{ width: '14px', height: '3px', backgroundColor: it.stroke, flexShrink: 0, borderRadius: '1px', marginTop: '5px', alignSelf: 'flex-start' }} />
                          <span style={{ color: 'hsl(var(--foreground))', whiteSpace: 'normal', wordBreak: 'keep-all', lineHeight: 1.4 }}>{it.name}</span>
                          <span style={{ marginLeft: 'auto', fontWeight: '500', color: 'hsl(var(--foreground))', flexShrink: 0, paddingLeft: '8px' }}>{Math.round(it.value).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )
                }}
              />
              {mediaNames.map((name, i) => (
                <Area
                  key={name}
                  type="monotone"
                  dataKey={name}
                  hide={hidden.has(name)}
                  stackId="1"
                  stroke={getMediaColorByRank(i)}
                  strokeWidth={i === 0 ? 2 : 1.5}
                  fill={getMediaColorByRank(i)}
                  fillOpacity={0.35}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 우측 범례 (클릭 토글) */}
        <div style={{ width: '200px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* 범례 항목: 세로 중앙 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
            {mediaNames.map((name, i) => {
              const isHidden = hidden.has(name)
              return (
                <button
                  key={name}
                  onClick={() => toggleSeries(name)}
                  title={name}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px',
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left',
                    color: isHidden ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))',
                    opacity: isHidden ? 0.45 : 1, transition: 'opacity 0.15s'
                  }}
                >
                  <span style={{ width: '16px', height: '2px', backgroundColor: getMediaColorByRank(i), flexShrink: 0, borderRadius: '1px' }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: isHidden ? 'line-through' : 'none' }}>{name}</span>
                </button>
              )
            })}
            <div style={{ marginTop: '8px', fontSize: '10px', color: 'hsl(var(--muted-foreground))', lineHeight: '1.5' }}>
              업종 모델 과거 학습 데이터
            </div>
          </div>
          {/* X축 범위 전환 버튼: X축 라벨과 동일 선상 */}
          <div style={{ paddingBottom: '24px' }}>
            {zoomButton}
          </div>
        </div>
      </div>

      {/* SpinX Insight (차트 영역 아래 자연 배치 — 텍스트 길이에 따라 아래로 늘어남) */}
      <div style={{ marginTop: '16px', flexShrink: 0 }}>
        <BOSpinXInsight text={insight} onAsk={onAsk} followUpQuestion="@Weekly Contribution 차트 " />
      </div>
    </div>
  )
}
