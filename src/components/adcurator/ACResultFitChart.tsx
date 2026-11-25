import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Bar, BarChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, usePlotArea } from 'recharts'
import { Info } from 'lucide-react'
import { SpinXSymbol } from '../spinx/SpinXSymbol'
import { BOSpinXInsight } from '../budgetoptimizer/BOSpinXInsight'
import type { ACCurationResult, ACResultItem } from './resultTypes'
import { sortForChart, sumScore, topPercent } from './resultUtils'

/** 축 순서별 명도 단계 (hover 시 칸 표시용, 아래 칸일수록 진함). 축은 5~6개 */
const MONO_ALPHA = [0.86, 0.7, 0.55, 0.42, 0.3, 0.19]
const GREEN_ALPHA = [1, 0.88, 0.76, 0.64, 0.52, 0.4]
/** 평상시 막대 색 */
const BAR_FILL = 'hsl(var(--foreground) / 0.26)'
/** Good Fit 꼬리 막대 개수 */
const TAIL_COUNT = 6
/** 막대 최대 폭(px) */
const BAR_W_MAX = 32

/** 차트 레이아웃 (px) */
/** 기준선 아래 여백 */
const BOTTOM = 6
/** 오른쪽 여백 */
const RIGHT = 4
/** Best Fit/Good Fit 라벨: 막대 최상단(TOP) 위 기준선 거리, 글자 윗부분 높이 */
const LABEL_GAP = 16
const LABEL_ASCENT = 12
/** Y축 라벨(높음·낮음) 자리 폭 = Recharts YAxis width */
const YAXIS_W = 36

/** 차트 데이터 한 칸: Best Fit 막대 / 구분 칸 / Good Fit 꼬리(장식) */
interface FitDatum {
  key: string
  kind: 'best' | 'gap' | 'tail'
  /** 기준선 위 높이 (점수 합 − 기준선). 구분 칸은 null */
  value: number | null
  index: number
  item?: ACResultItem
}

interface ACResultFitChartProps {
  result: ACCurationResult
  /** 이어서 질문하기 → SpinX 패널 프리필 (자동 전송 안 함) */
  onAsk: (prefill: string) => void
}

/**
 * Curation Fit (화면정의서 5장) — Recharts BarChart
 * 막대 = Best Fit 매체·상품별 축 점수 합(단색), hover 시 축별 칸 표시. 그린 = Best Match(별도 표식 없음, 뜻은 Info 툴팁)
 * 오른쪽에 Good Fit 일부를 옅은 꼬리로 두어 "더 있다"만 보여 줌(동작 없음)
 */
export function ACResultFitChart({ result, onAsk }: ACResultFitChartProps) {
  const [infoOpen, setInfoOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [W, setW] = useState(720)
  const [grown, setGrown] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const best = useMemo(() => sortForChart(result.items), [result.items])
  const tail = useMemo(
    () => result.items.filter(i => i.group === 'good').sort((a, b) => sumScore(b) - sumScore(a)).slice(0, TAIL_COUNT),
    [result.items]
  )
  const goodCount = result.items.filter(i => i.group === 'good').length
  const hasTail = goodCount > 0
  const bestItems = useMemo(() => result.items.filter(i => i.group === 'best'), [result.items])

  // 폭 추적 (막대 폭 계산용. 높이는 왼쪽 카드 묶음이 정함)
  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect
      setW(Math.max(320, r.width))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 진입 모션 1회 (동작 줄이기 설정이면 생략)
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setGrown(true); return }
    const t = setTimeout(() => setGrown(true), 60)
    return () => clearTimeout(t)
  }, [])

  // ---------- 값 ----------
  const sums = best.map(sumScore)
  const maxS = Math.max(...sums)
  const minS = Math.min(...sums)
  // 순서 차이가 보이도록 기준선을 최솟값 아래로 둠 (점수 원값은 표시하지 않음)
  const base = minS - (maxS - minS) * 0.35
  const range = maxS - base || 1
  const lastBestVal = best.length ? sumScore(best[best.length - 1]) - base : range

  const data: FitDatum[] = useMemo(() => {
    const rows: FitDatum[] = best.map((item, i) => ({ key: item.id, kind: 'best', value: sumScore(item) - base, index: i, item }))
    if (hasTail) {
      // 꼬리 높이: 실제 점수가 아니라 "더 있다"는 표시. Best Fit 마지막 막대보다 낮게 시작해 점점 낮아짐
      tail.forEach((item, j) => rows.push({ key: `tail-${item.id}`, kind: 'tail', value: Math.max(range * 0.03, lastBestVal * (0.82 - j * 0.09)), index: rows.length }))
      // 꼬리 끝 `···` 자리 (빈 칸)
      rows.push({ key: '__dots', kind: 'gap', value: null, index: rows.length })
    }
    return rows
  }, [best, tail, hasTail, base, range, lastBestVal])

  // ---------- 막대 폭 (Recharts 밴드 = 플롯 폭 / 칸 수) ----------
  const slot = (W - YAXIS_W - RIGHT) / Math.max(1, data.length)
  // 막대 폭 = 칸 폭의 58% (최대 32px). 막대 수가 적으면 막대도 넓어져 간격만 벌어지지 않음
  const barW = Math.min(BAR_W_MAX, slot * 0.58)
  // 윗선 맞춤: 맨 윗줄(Y축 제목·Best Fit/Good Fit 라벨)이 y=0에 오도록 플롯 윗여백을 정함
  const TOP = LABEL_GAP + LABEL_ASCENT

  const handleMouseMove = (state: { activeTooltipIndex?: number | string | null } | undefined) => {
    const i = state?.activeTooltipIndex
    const row = i === undefined || i === null ? undefined : data[Number(i)]
    setActiveId(row?.kind === 'best' && row.item ? row.item.id : null)
  }
  const handleMouseLeave = () => setActiveId(null)

  return (
    <div className="flex flex-col min-w-0 h-full">
      {/* 헤더: 좌측 Curation Highlights와 같은 제목 위계 */}
      <div className="mb-5">
        <div className="relative flex items-baseline gap-2 min-w-0">
          <h3 className="text-[20px] font-medium leading-[28px] font-[Paperlogy,sans-serif] m-0 text-[hsl(var(--foreground))] whitespace-nowrap">Curation Fit</h3>
          <button
            type="button"
            onMouseEnter={() => setInfoOpen(true)}
            onMouseLeave={() => setInfoOpen(false)}
            className="self-center flex items-center bg-transparent border-none p-0.5 cursor-help text-[hsl(var(--muted-foreground))] opacity-60"
            aria-label="차트 설명"
          >
            <Info size={14} />
          </button>
          {infoOpen && (
            <div className="absolute top-full left-0 mt-2 w-[320px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-3 shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] z-[100] text-[12px] leading-[1.6] text-[hsl(var(--muted-foreground))]">
              <div className="font-semibold text-[hsl(var(--foreground))] mb-1.5">Curation Fit</div>
              Best Fit 매체·상품을 적합도 점수 합이 높은 순으로 보여 줍니다. 막대에 마우스를 올리면 평가 축별로 Best Fit 중 상위 몇 %인지 볼 수 있습니다.
              {/* 차트에 별도 표식이 없으므로 그린의 뜻을 견본과 함께 먼저 말함 */}
              <div className="mt-2.5 pt-2.5 border-t border-[hsl(var(--border))]">
                <div className="flex items-center gap-1.5 font-semibold text-[hsl(var(--foreground))]">
                  <i aria-hidden className="inline-block w-[10px] h-[10px] rounded-[2px] bg-[hsl(var(--bo-accent))]" />
                  Best Match
                </div>
                <div className="mt-0.5 text-[11px]">가중치를 반영한 종합 적합도 1위라, 단순 점수 합 순서와 다를 수 있습니다.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 막대 차트 (최소 높이 160px. 실제 높이는 왼쪽 카드 묶음 높이에서 제목·SpinX 블록을 뺀 값) */}
      <div ref={wrapRef} className="relative w-full flex-1 min-h-[160px]" role="img" aria-label="Best Fit 매체·상품별 평가 축 점수 합 막대 차트">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: TOP, right: RIGHT, bottom: BOTTOM, left: 0 }}
              barSize={barW}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <XAxis dataKey="key" hide />
              {/* Y축: 선·숫자 없이 방향 라벨만 (위 = 높음, 아래 = 낮음). 기준선이 0이 아니므로 눈금 숫자는 두지 않음 */}
              <YAxis
                width={YAXIS_W}
                domain={[0, range]}
                ticks={[0, range]}
                interval={0}
                allowDataOverflow
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => (v >= range ? '높음' : '낮음')}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
              {/* 기준선 (X축) */}
              <ReferenceLine y={0} stroke="hsl(var(--border))" />
              <Tooltip
                cursor={false}
                isAnimationActive={false}
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{ pointerEvents: 'none', zIndex: 200 }}
                content={({ active, payload }) => {
                  const row = payload?.[0]?.payload as FitDatum | undefined
                  if (!active || !row || row.kind !== 'best' || !row.item) return null
                  return <ChartTooltip item={row.item} result={result} bestItems={bestItems} />
                }}
              />
              <Bar
                dataKey="value"
                isAnimationActive={false}
                shape={(props: unknown) => (
                  <FitBarShape
                    {...(props as BarShapeProps)}
                    result={result}
                    activeId={activeId}
                    grown={grown}
                    bestCount={best.length}
                  />
                )}
              />
              <FitOverlay
                bestCount={best.length}
                goodCount={goodCount}
                tailCount={hasTail ? tail.length : 0}
                grown={grown}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* SpinX 차트 해석 (5.4, BudgetOpt 2.0 차트 해석과 같은 구성) */}
      <div className="mt-4 shrink-0">
        <ACFitInsight text={result.insight} onAsk={onAsk} />
      </div>
    </div>
  )
}

/** Recharts가 Bar shape에 넘기는 값 중 쓰는 것 */
interface BarShapeProps {
  x: number
  y: number
  width: number
  height: number
  payload: FitDatum
}

/**
 * 막대 1개: 평상시 단색, hover 중인 막대만 평가 축 칸(축 점수 비율, 아래 = 첫 축), 나머지는 흐림.
 * 진입 모션은 바닥에서 왼쪽부터 순서대로 올라옴 (CSS transition, 동작 줄이기면 즉시)
 */
function FitBarShape({ x, y, width, height, payload, result, activeId, grown, bestCount }: BarShapeProps & {
  result: ACCurationResult
  activeId: string | null
  grown: boolean
  bestCount: number
}) {
  if (!payload || payload.value === null || !(height > 0)) return null
  const h = Math.max(6, height)
  const top = y + height - h
  const bottom = y + height
  const origin = `${x + width / 2}px ${bottom}px`

  // Good Fit 꼬리: 옅게 흐려지는 장식 막대, 동작 없음
  if (payload.kind === 'tail') {
    const j = payload.index - bestCount
    return (
      <rect
        x={x} y={top} width={width} height={h} rx={3}
        fill={`hsl(var(--foreground) / ${(0.18 - j * 0.022).toFixed(3)})`}
        style={{
          pointerEvents: 'none',
          transform: `scaleY(${grown ? 1 : 0})`,
          transformOrigin: origin,
          transition: `transform 600ms cubic-bezier(.2,.8,.2,1) ${bestCount * 22 + 250 + j * 70}ms`
        }}
      />
    )
  }

  const item = payload.item!
  const isBM = item.id === result.bestMatchId
  const showSegs = activeId === item.id
  const dim = activeId !== null && !showSegs
  const total = sumScore(item) || 1
  let acc = 0
  return (
    <g
      style={{
        opacity: dim ? 0.35 : 1,
        transform: `scaleY(${grown ? 1 : 0})`,
        transformOrigin: origin,
        transition: `transform 700ms cubic-bezier(.2,.8,.2,1) ${payload.index * 22}ms, opacity 200ms`
      }}
    >
      <title>{`${item.mediaName} · ${item.productName}`}</title>
      {!showSegs && <rect x={x} y={top} width={width} height={h} rx={3} fill={isBM ? 'hsl(var(--bo-accent))' : BAR_FILL} />}
      {showSegs && result.axes.map((ax, k) => {
        const segH = (item.axisScores[ax.id] / total) * h
        const segY = bottom - acc - segH
        acc += segH
        const a = (isBM ? GREEN_ALPHA : MONO_ALPHA)[Math.min(k, 5)]
        return (
          <rect
            key={ax.id}
            x={x} y={segY} width={width} height={Math.max(0, segH - 1.5)} rx={1.5}
            fill={isBM ? `hsl(var(--bo-accent) / ${a})` : `hsl(var(--foreground) / ${a})`}
          />
        )
      })}
    </g>
  )
}

/**
 * 플롯 영역 위 장식: Y축 제목, Best Fit | Good Fit 구분선·라벨, 꼬리 끝 `···`.
 * Recharts usePlotArea로 실제 플롯 영역 기준 좌표를 씀
 */
function FitOverlay({ bestCount, goodCount, tailCount, grown }: { bestCount: number; goodCount: number; tailCount: number; grown: boolean }) {
  const plot = usePlotArea()
  if (!plot) return null
  // 칸 구성: Best Fit + (꼬리 + `···` 칸)
  const n = bestCount + (tailCount > 0 ? tailCount + 1 : 0)
  const slot = plot.width / Math.max(1, n)
  const labelY = plot.y - LABEL_GAP
  const right = plot.x + plot.width
  // 구분선: 마지막 Best Fit 막대와 첫 꼬리 막대 사이 (칸 경계)
  const dividerX = plot.x + bestCount * slot
  const dotsX = plot.x + (bestCount + tailCount + 0.5) * slot
  return (
    <g pointerEvents="none">
      {/* Y축 제목: 맨 위 왼쪽 */}
      <text x={0} y={LABEL_ASCENT} fontSize={11} fill="hsl(var(--muted-foreground))">적합도 점수 합</text>
      {tailCount > 0 ? (
        <>
          <line x1={dividerX} x2={dividerX} y1={labelY - LABEL_ASCENT} y2={plot.y + plot.height + 4} stroke="hsl(var(--foreground) / 0.35)" strokeDasharray="3 3" />
          <text x={dividerX - 10} y={labelY} textAnchor="end" fontSize={12} fontWeight={600} fill="hsl(var(--foreground))">Best Fit {bestCount}</text>
          <text x={dividerX + 10} y={labelY} fontSize={12} fill="hsl(var(--muted-foreground))">Good Fit {goodCount}</text>
          <text
            x={dotsX} y={plot.y + plot.height - 4} textAnchor="middle" fontSize={16} letterSpacing={3} fill="hsl(var(--muted-foreground))"
            style={{ opacity: grown ? 1 : 0, transition: `opacity 500ms ${bestCount * 22 + 250 + TAIL_COUNT * 70 + 200}ms` }}
          >
            ···
          </text>
        </>
      ) : (
        <text x={right} y={labelY} textAnchor="end" fontSize={12} fontWeight={600} fill="hsl(var(--foreground))">Best Fit {bestCount}</text>
      )}
    </g>
  )
}

/** 막대 툴팁: 매체명 · 상품명 · 이번 캠페인 순위 · 축별 상위 N% (위 칸부터) */
function ChartTooltip({ item, result, bestItems }: { item: ACResultItem; result: ACCurationResult; bestItems: ACResultItem[] }) {
  const isBM = item.id === result.bestMatchId
  const axesTopFirst = result.axes.map((ax, k) => ({ ax, k })).reverse()
  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg px-3 py-2.5 shadow-[0_8px_24px_rgb(0_0_0/0.14)] text-[12px] leading-[1.6] max-w-[300px]">
      <div className="text-[hsl(var(--muted-foreground))]">{item.mediaName}</div>
      <div className="font-semibold text-[hsl(var(--foreground))] break-all">{item.productName}</div>
      <div className="mt-1.5 pt-1.5 border-t border-[hsl(var(--border))] flex flex-col gap-0.5">
        {axesTopFirst.map(({ ax, k }) => (
          <div key={ax.id} className="flex items-center justify-between gap-5">
            <span className="flex items-center gap-1.5 text-[hsl(var(--muted-foreground))]">
              <i
                className="inline-block w-[10px] h-[10px] rounded-[2px]"
                style={{ background: isBM ? `hsl(var(--bo-accent) / ${GREEN_ALPHA[Math.min(k, 5)]})` : `hsl(var(--foreground) / ${MONO_ALPHA[Math.min(k, 5)]})` }}
              />
              {ax.name}
            </span>
            <span className="text-[hsl(var(--foreground))] tabular-nums">상위 {topPercent(item, ax.id, bestItems)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * SpinX 해석 블록. 타이핑 중 높이가 바뀌어 차트가 흔들리지 않도록,
 * 같은 자리에 전문을 보이지 않게 깔아 높이를 미리 확보함 (두 층을 같은 칸에 겹침)
 */
function ACFitInsight({ text, onAsk }: { text: string | null; onAsk: (prefill: string) => void }) {
  if (!text) {
    return (
      <div className="pt-3 border-t border-[hsl(var(--border))]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <SpinXSymbol size={13} motion="idle" title="" className="rotate-45 shrink-0" />
          <span className="text-[11px] font-semibold tracking-[0.02em] text-[hsl(var(--muted-foreground))]">SpinX for Ad Curator</span>
        </div>
        <p className="m-0 text-[12.5px] leading-[1.65] text-[hsl(var(--muted-foreground))]">이 차트에 대한 SpinX 분석을 생성하지 못했습니다.</p>
        <p className="m-0 text-[12px] leading-[1.65] text-[hsl(var(--muted-foreground))]">새로고침하거나 결과에 다시 들어오면 분석을 다시 시도합니다.</p>
      </div>
    )
  }
  return (
    <div className="relative">
      {/* 높이 확보용 (보이지 않음): 헤더 + 해석 문장까지만. 이 끝이 왼쪽 카드 묶음의 아랫선 */}
      <div aria-hidden className="invisible pt-3 border-t border-transparent">
        <div className="flex items-center gap-1.5 mb-1.5 h-[13px]"><span className="text-[11px]">&nbsp;</span></div>
        <p className="text-[12.5px] leading-[1.65] m-0">{text}</p>
      </div>
      {/* 실제 블록을 위에 겹침. `이어서 질문하기`는 아랫선 밖으로 넘침 */}
      <div className="absolute inset-x-0 top-0 min-w-0">
        <BOSpinXInsight text={text} label="SpinX for Ad Curator" onAsk={onAsk} followUpQuestion="#Campaign Fit 차트 " />
      </div>
    </div>
  )
}
