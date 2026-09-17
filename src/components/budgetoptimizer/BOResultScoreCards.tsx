import { BOAllocation } from './resultSampleData'

interface BOResultScoreCardsProps {
  allocations: BOAllocation[]
  totalBudget: number
  kpiCode: 'impression' | 'click' | 'view' | 'reach'
  kpiLabel: string
  kpiLabelEn: string
}

interface ScoreCard {
  title: string
  value: string
  unit: string
}

export function BOResultScoreCards({ allocations, totalBudget, kpiCode, kpiLabelEn }: BOResultScoreCardsProps) {
  const totalKpi = allocations.reduce((s, a) => s + a.kpiValue, 0)

  // 3번 카드: 선택 KPI에 맞는 평균 단가 (노출→CPM, 클릭→CPC, 조회→CPV, 도달→CPR)
  const unitCostMeta: Record<BOResultScoreCardsProps['kpiCode'], { title: string; denominator: number }> = {
    impression: { title: 'Avg. CPM', denominator: allocations.reduce((s, a) => s + a.impression, 0) / 1000 },
    click: { title: 'Avg. CPC', denominator: allocations.reduce((s, a) => s + a.click, 0) },
    view: { title: 'Avg. CPV', denominator: allocations.reduce((s, a) => s + a.view, 0) },
    reach: { title: 'Avg. CPR', denominator: allocations.reduce((s, a) => s + a.reach, 0) }
  }
  const { title: unitCostTitle, denominator: unitCostDenominator } = unitCostMeta[kpiCode]
  const avgUnitCost = unitCostDenominator > 0 ? Math.round(totalBudget / unitCostDenominator) : 0

  const lockedBudget = allocations.filter(a => a.isFixed).reduce((s, a) => s + a.budget, 0)
  const lockedPct = totalBudget > 0 ? (lockedBudget / totalBudget) * 100 : 0
  const hasLocked = lockedBudget > 0

  const cards: ScoreCard[] = [
    {
      title: `Estimated ${kpiLabelEn}`,
      value: totalKpi.toLocaleString(),
      unit: '회'
    },
    {
      title: 'Total Budget',
      value: totalBudget.toLocaleString(),
      unit: '원'
    },
    {
      title: unitCostTitle,
      value: avgUnitCost.toLocaleString(),
      unit: '원'
    },
    {
      title: 'Locked Budget',
      value: hasLocked ? lockedBudget.toLocaleString() : '0',
      unit: hasLocked ? `원 (${lockedPct.toFixed(2)}%)` : ''
    }
  ]

  return (
    <div className="grid grid-cols-4 gap-4 mb-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className="flex flex-col justify-center p-5 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]"
        >
          {/* 헤더 */}
          <div className="text-[13px] font-medium mb-4 text-[hsl(var(--muted-foreground))] font-[Paperlogy,sans-serif]">
            {card.title}
          </div>

          {/* 값 */}
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-bold text-[hsl(var(--foreground))] font-[Paperlogy,sans-serif]">
              {card.value}
            </span>
            <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
              {card.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
