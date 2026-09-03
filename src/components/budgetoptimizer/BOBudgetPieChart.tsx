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
    <div style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      {/* 타이틀 + Info 툴팁 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexShrink: 0, position: 'relative' }}>
        <h4 style={{ fontSize: '17px', fontWeight: '500', margin: 0 }}>예산은 어디에 배분되었을까?</h4>
        <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>Budget Share</span>
        <button
          onMouseEnter={() => setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
          style={{ background: 'none', border: 'none', padding: '2px', cursor: 'help', display: 'flex', alignItems: 'center', color: 'hsl(var(--muted-foreground))', opacity: 0.6 }}
        >
          <Info size={14} />
        </button>
        {tooltipOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '280px',
            backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
            borderRadius: '8px', padding: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            zIndex: 100, fontSize: '12px', lineHeight: '1.6', color: 'hsl(var(--muted-foreground))'
          }}>
            <div style={{ fontWeight: '600', color: 'hsl(var(--foreground))', marginBottom: '6px' }}>Budget Share</div>
            선택된 매체/상품별 예산 배분 비중을 시각화합니다. 상위 5개 항목까지 개별 표시되며, 나머지는 '기타(Others)'로 합산됩니다.
          </div>
        )}
      </div>
      <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '8px', flexShrink: 0 }}>
        매체·상품별 예산 배분 비중
      </p>

      {/* 차트 본체 (고정 높이 → 인사이트 구분선 위치 좌우 통일) */}
      <div style={{ height: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* 100% Stacked Bar */}
        <div style={{ display: 'flex', width: '100%', height: '36px', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.map((d, i) => (
            <div
              key={d.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px',
                opacity: hovered === null || hovered === i ? 1 : 0.5,
                transition: 'opacity 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: getMediaColorByRank(i), flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
              </div>
              <span style={{ fontWeight: '500', flexShrink: 0, marginLeft: '12px', color: 'hsl(var(--muted-foreground))' }}>
                {d.ratio.toFixed(1)}% · {formatBudget(d.value)}원
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SpinX Insight (차트 영역 아래 자연 배치 — 텍스트 길이에 따라 아래로 늘어남) */}
      <div style={{ marginTop: '16px', flexShrink: 0 }}>
        <BOSpinXInsight text={insight} onAsk={onAsk} followUpQuestion="@Budget Share 차트 " />
      </div>
    </div>
  )
}
