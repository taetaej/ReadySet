import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList, Customized } from 'recharts'
import { Info } from 'lucide-react'
import { BOKpiWaterfall } from './resultSampleData'
import { ACCENT_COLOR } from './constants'
import { BOSpinXInsight } from './BOSpinXInsight'

interface BOKpiContributionChartProps {
  data: BOKpiWaterfall
  /** 상품 레벨 워터폴 (viewMode='product'일 때 사용) */
  dataByProduct: BOKpiWaterfall
  kpiLabel: string
  insight: string
  viewMode: 'media' | 'product'
  onAsk?: (question: string) => void
}

// 축약(축 라벨/막대 라벨용)
const formatAxis = (v: number) => {
  const abs = Math.abs(v)
  if (abs >= 100000000) return `${(v / 100000000).toFixed(1)}억`
  if (abs >= 10000) return `${Math.round(v / 10000).toLocaleString()}만`
  return `${v}`
}
const formatDelta = (v: number) => `${v > 0 ? '+' : v < 0 ? '-' : ''}${formatAxis(Math.abs(v))}`

// 막대 색상: 최종 결과(최적화)=강조색 / 시작 기준(균등 배분)=진한 무채색 / 증감 막대=흐린 무채색(동일)
const COLOR_OPTIMIZED = ACCENT_COLOR
const COLOR_BASE = 'hsl(var(--foreground) / 0.85)'
const COLOR_DELTA_BAR = 'hsl(var(--foreground) / 0.35)'
// 라벨 색상: 증가(+)=초록 / 감소(-)=빨강 (결과 테이블 delta와 통일)
const COLOR_LABEL_UP = 'hsl(142 71% 45%)'
const COLOR_LABEL_DOWN = 'hsl(var(--destructive))'

type WFBar = {
  name: string
  kind: 'total' | 'up' | 'down'
  base: number      // 투명 받침 (누적 시작 높이)
  value: number     // 표시 막대 높이 (절대값)
  delta: number     // 실제 증감값 (라벨용, total은 총값)
}

export function BOKpiContributionChart({ data, dataByProduct, kpiLabel, insight, viewMode, onAsk }: BOKpiContributionChartProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const kpiEn = { '노출': 'Impression', '클릭': 'Click', '조회': 'View', '도달': 'Reach' }[kpiLabel] || kpiLabel

  // viewMode에 따라 데이터 소스 선택. 증감 큰 순 Top6 + 기타 묶음.
  const wf = viewMode === 'product' ? dataByProduct : data
  const contributions = useMemo(() => {
    const sorted = [...wf.contributions].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    if (sorted.length <= 8) return sorted
    const top = sorted.slice(0, 7)
    const restSum = sorted.slice(7).reduce((s, c) => s + c.delta, 0)
    return [...top, { name: '기타', delta: restSum }]
  }, [wf])

  // 워터폴 막대 계산: 균등 배분 → 채널/상품별 증감 누적 → 최적화
  const bars: WFBar[] = useMemo(() => {
    const result: WFBar[] = []
    result.push({ name: '균등 배분', kind: 'total', base: 0, value: wf.baseKpiTotal, delta: wf.baseKpiTotal })
    let running = wf.baseKpiTotal
    for (const c of contributions) {
      if (c.delta >= 0) {
        result.push({ name: c.name, kind: 'up', base: running, value: c.delta, delta: c.delta })
        running += c.delta
      } else {
        running += c.delta
        result.push({ name: c.name, kind: 'down', base: running, value: -c.delta, delta: c.delta })
      }
    }
    result.push({ name: '최적화', kind: 'total', base: 0, value: wf.optimizedKpiTotal, delta: wf.optimizedKpiTotal })
    return result
  }, [wf, contributions])

  const colorOf = (b: WFBar) => {
    if (b.kind === 'total') return b.name === '최적화' ? COLOR_OPTIMIZED : COLOR_BASE
    return COLOR_DELTA_BAR
  }

  // Y축은 0부터 유지(정직한 총량 표현). 변화는 값 라벨 + 색 + 연결선으로 읽게 한다.
  const yMax = Math.ceil((wf.optimizedKpiTotal * 1.12) / 10000000) * 10000000

  return (
    <div style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      {/* 타이틀 + Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexShrink: 0, position: 'relative' }}>
        <h4 style={{ fontSize: '17px', fontWeight: '500', margin: 0 }}>최적화로 성과가 얼마나 늘었을까?</h4>
        <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>Incremental {kpiEn}</span>
        <button
          onMouseEnter={() => setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
          style={{ background: 'none', border: 'none', padding: '2px', cursor: 'help', display: 'flex', alignItems: 'center', color: 'hsl(var(--muted-foreground))', opacity: 0.6 }}
        >
          <Info size={14} />
        </button>
        {tooltipOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '340px',
            backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
            borderRadius: '8px', padding: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            zIndex: 100, fontSize: '12px', lineHeight: '1.6', color: 'hsl(var(--muted-foreground))'
          }}>
            <div style={{ fontWeight: '600', color: 'hsl(var(--foreground))', marginBottom: '6px' }}>Incremental {kpiEn}</div>
            균등 배분에서 최적화까지, 채널별 {kpiLabel} 창출·감소 기여를 누적해 보여줍니다.
            <div style={{ marginTop: '8px', fontSize: '11px', lineHeight: '1.6' }}>
              <div><strong>최적화(보라)</strong>: 최적화 후 도달하는 총 {kpiLabel}</div>
              <div><strong>균등 배분(진한 회색)</strong>: 최적화 전 기준 총 {kpiLabel}</div>
              <div><strong style={{ color: 'hsl(142 71% 45%)' }}>+ 초록 값</strong>: 예산 증액으로 창출된 {kpiLabel}</div>
              <div><strong style={{ color: 'hsl(var(--destructive))' }}>− 빨강 값</strong>: 예산 감액으로 감소한 {kpiLabel}</div>
              <div style={{ marginTop: '6px' }}>얻은 {kpiLabel}이 잃은 {kpiLabel}보다 크면 최종값이 더 높아집니다.</div>
            </div>
          </div>
        )}
      </div>
      <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '8px', flexShrink: 0 }}>
        균등 배분 대비 채널별 {kpiLabel} 증감 (Incremental {kpiEn})
      </p>

      <div style={{ flex: 1, width: '100%', minHeight: '260px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 20, right: 8, left: 8, bottom: 8 }}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              axisLine={false}
              tickLine={false}
              interval={0}
              height={40}
              tick={(props: any) => {
                const { x, y, payload } = props
                const label: string = payload.value ?? ''
                // 한 줄 최대 글자수, 최대 2줄까지 표시 후 말줄임
                const perLine = 10
                const maxLines = 2
                const lines: string[] = []
                let rest = label
                while (rest.length > 0 && lines.length < maxLines) {
                  lines.push(rest.slice(0, perLine))
                  rest = rest.slice(perLine)
                }
                if (rest.length > 0) {
                  // 남은 글자가 있으면 마지막 줄 끝에 말줄임
                  lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, perLine - 1)}…`
                }
                return (
                  <text x={x} y={y + 10} textAnchor="middle" style={{ fontSize: 10 }} fill="hsl(var(--muted-foreground))">
                    {lines.map((ln, i) => (
                      <tspan key={i} x={x} dy={i === 0 ? 0 : 11}>{ln}</tspan>
                    ))}
                  </text>
                )
              }}
            />
            <YAxis
              tickFormatter={formatAxis}
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
              width={48}
              axisLine={false}
              tickLine={false}
              domain={[0, yMax]}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted) / 0.4)' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const b = payload[0]?.payload as WFBar
                if (!b) return null
                const isTotal = b.kind === 'total'
                return (
                  <div style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)', maxWidth: '320px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '6px', color: 'hsl(var(--foreground))', whiteSpace: 'normal', wordBreak: 'keep-all', lineHeight: 1.4 }}>{b.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: isTotal ? colorOf(b) : (b.delta >= 0 ? COLOR_LABEL_UP : COLOR_LABEL_DOWN), flexShrink: 0 }} />
                      <span style={{ color: 'hsl(var(--foreground))' }}>{isTotal ? `총 ${kpiLabel}` : b.delta >= 0 ? '창출' : '감소'}</span>
                      <span style={{ marginLeft: 'auto', fontWeight: '500', color: 'hsl(var(--foreground))' }}>
                        {isTotal ? b.delta.toLocaleString() : `${b.delta >= 0 ? '+' : '-'}${Math.abs(b.delta).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                )
              }}
            />
            {/* 워터폴 연결선: 이전 막대 누적 상단 → 다음 막대 시작점을 잇는 점선 */}
            <Customized
              component={(props: any) => {
                const xMap = props.xAxisMap && props.xAxisMap[Object.keys(props.xAxisMap)[0]]
                const yMap = props.yAxisMap && props.yAxisMap[Object.keys(props.yAxisMap)[0]]
                if (!xMap || !yMap) return null
                const xScale = xMap.scale
                const yScale = yMap.scale
                const bw = xScale.bandwidth ? xScale.bandwidth() : 0
                const lines: JSX.Element[] = []
                for (let i = 0; i < bars.length - 1; i++) {
                  const b = bars[i]
                  // 현재 막대의 누적 상단값 (total은 자기 값, up/down은 base+value = 누적 끝)
                  const topVal = b.kind === 'total' ? b.value : b.base + b.value
                  const x1 = (xScale(b.name) ?? 0) + bw / 2
                  const x2 = (xScale(bars[i + 1].name) ?? 0) + bw / 2
                  const yy = yScale(topVal)
                  lines.push(
                    <line key={i} x1={x1} y1={yy} x2={x2} y2={yy}
                      stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
                  )
                }
                return <g>{lines}</g>
              }}
            />
            {/* 투명 받침 */}
            <Bar dataKey="base" stackId="wf" fill="transparent" isAnimationActive={false} />
            {/* 표시 막대 */}
            <Bar dataKey="value" stackId="wf" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              {bars.map((b, i) => (
                <Cell key={i} fill={colorOf(b)} />
              ))}
              <LabelList
                dataKey="delta"
                position="top"
                content={(props: any) => {
                  const { x, y, width, index } = props
                  const b = bars[index]
                  if (!b) return null
                  const text = b.kind === 'total' ? formatAxis(b.delta) : formatDelta(b.delta)
                  const labelColor = b.kind === 'total'
                    ? 'hsl(var(--foreground))'
                    : b.delta >= 0 ? COLOR_LABEL_UP : COLOR_LABEL_DOWN
                  return (
                    <text x={x + width / 2} y={y - 4} textAnchor="middle" style={{ fontSize: '10px', fontWeight: b.kind === 'total' ? 600 : 500 }} fill={labelColor}>
                      {text}
                    </text>
                  )
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 'auto', flexShrink: 0 }}>
        <BOSpinXInsight text={insight} onAsk={onAsk} followUpQuestion="@Incremental 차트 " />
      </div>
    </div>
  )
}
