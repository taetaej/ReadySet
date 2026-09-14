import { useState } from 'react'
import { Info } from 'lucide-react'
import { BOAllocation } from './resultSampleData'
import { getMediaColorByRank } from './constants'
import { BOSpinXInsight } from './BOSpinXInsight'

interface BOBudgetPieChartProps {
  allocations: BOAllocation[]
  insight: string
  viewMode: 'media' | 'product'
  onAsk?: (question: string) => void
}

const MAX_ITEMS = 5

const formatBudget = (v: number) => {
  if (v >= 100000000) return `${(v / 100000000).toFixed(1)}억`
  if (v >= 10000) return `${Math.round(v / 10000).toLocaleString()}만`
  return v.toLocaleString()
}

export function BOBudgetPieChart({ allocations, insight, viewMode, onAsk }: BOBudgetPieChartProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const totalBudget = allocations.reduce((s, a) => s + a.budget, 0)

  // 매체별 그룹핑
  const mediaData = (() => {
    const map = new Map<string, number>()
    for (const a of allocations) map.set(a.mediaId, (map.get(a.mediaId) || 0) + a.budget)
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
      ratio: totalBudget > 0 ? (value / totalBudget) * 100 : 0
    })).sort((a, b) => b.value - a.value)
  })()

  // 상품별 (flat) → 상위 8개 + 기타, 이름은 "매체명 > 상품명"
  const productDataRaw = allocations
    .map(a => ({ name: `${a.mediaName} > ${a.productName}`, value: a.budget, ratio: totalBudget > 0 ? (a.budget / totalBudget) * 100 : 0 }))
    .sort((a, b) => b.value - a.value)

  const productData = (() => {
    if (productDataRaw.length <= MAX_ITEMS) return productDataRaw
    const top = productDataRaw.slice(0, MAX_ITEMS)
    const rest = productDataRaw.slice(MAX_ITEMS)
    const othersValue = rest.reduce((s, d) => s + d.value, 0)
    const othersRatio = rest.reduce((s, d) => s + d.ratio, 0)
    return [...top, { name: `기타 (Others) ${rest.length}개`, value: othersValue, ratio: othersRatio }]
  })()

  const data = viewMode === 'media' ? mediaData : productData

  return (
    <div className="min-h-[400px] flex flex-col">
      {/* 타이틀 + Info 툴팁 */}
      <div className="relative flex items-center gap-1.5 mb-1 shrink-0">
        <h4 className="text-[17px] font-medium m-0">예산은 어디에 배분되었을까?</h4>
        <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Budget Share</span>
        <button
          onMouseEnter={() => setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
          className="flex items-center bg-transparent border-none p-0.5 cursor-help text-[hsl(var(--muted-foreground))] opacity-60"
        >
          <Info size={14} />
        </button>
        {tooltipOpen && (
          <div className="absolute top-full left-0 mt-2 w-[280px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-3 shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] z-[100] text-[12px] leading-[1.6] text-[hsl(var(--muted-foreground))]">
            <div className="font-semibold text-[hsl(var(--foreground))] mb-1.5">Budget Share</div>
            선택된 매체·상품별 예산 배분 비중을 시각화합니다.
            <div className="mt-1.5">비중 상위 5개 {viewMode === 'product' ? '상품' : '매체'}만 표시되며, 나머지는 '기타(Others)'로 합산됩니다.</div>
          </div>
        )}
      </div>
      <p className="text-[11px] text-[hsl(var(--muted-foreground))] mb-2 shrink-0">
        매체·상품별 예산 배분 비중
      </p>

      {/* 차트 본체 (고정 높이 → 인사이트 구분선 위치 좌우 통일) */}
      <div className="h-[300px] shrink-0 flex flex-col justify-center">
        {/* 100% Stacked Bar */}
        <div className="flex w-full h-9 rounded-md overflow-hidden mb-4">
          {data.map((d, i) => (
            <div
              key={d.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: `${d.ratio}%`,
                backgroundColor: getMediaColorByRank(i),
                transition: 'opacity 0.2s',
                opacity: hovered === null || hovered === i ? 1 : 0.4,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: d.ratio > 5 ? undefined : '2px'
              }}
            >
              {d.ratio >= 8 && (
                <span style={{ fontSize: '11px', fontWeight: '600', color: i === 0 ? '#000' : '#fff', whiteSpace: 'nowrap' }}>
                  {d.ratio.toFixed(1)}%
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 범례 */}
        <div className="flex flex-col gap-1.5">
          {data.map((d, i) => (
            <div
              key={d.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center justify-between text-[12px] transition-opacity"
              style={{ opacity: hovered === null || hovered === i ? 1 : 0.5 }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: getMediaColorByRank(i), flexShrink: 0 }} />
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{d.name}</span>
              </div>
              <span className="font-medium shrink-0 ml-3 text-[hsl(var(--muted-foreground))]">
                {d.ratio.toFixed(1)}% · {formatBudget(d.value)}원
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SpinX Insight (차트 영역 아래 자연 배치 — 텍스트 길이에 따라 아래로 늘어남) */}
      <div className="mt-4 shrink-0">
        <BOSpinXInsight text={insight} onAsk={onAsk} followUpQuestion="#Budget Share 차트 " />
      </div>
    </div>
  )
}
