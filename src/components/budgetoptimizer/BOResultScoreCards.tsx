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
      title: `Guaranteed ${kpiLabelEn}`,
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '20px'
    }}>
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {/* 헤더 */}
          <div style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--muted-foreground))', fontFamily: 'Paperlogy, sans-serif', marginBottom: '16px' }}>
            {card.title}
          </div>

          {/* 값 */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{
              fontSize: '28px', fontWeight: '700', color: 'hsl(var(--foreground))',
              fontFamily: 'Paperlogy, sans-serif'
            }}>
              {card.value}
            </span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'hsl(var(--muted-foreground))' }}>
              {card.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
