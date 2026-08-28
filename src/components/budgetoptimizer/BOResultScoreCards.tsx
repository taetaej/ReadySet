import { Lock, TrendingUp, DollarSign, BarChart3 } from 'lucide-react'
import { BOAllocation } from './resultSampleData'

interface BOResultScoreCardsProps {
  allocations: BOAllocation[]
  totalBudget: number
  kpiLabel: string
  kpiLabelEn: string
}

interface ScoreCard {
  title: string
  value: string
  unit: string
  icon: React.ReactNode
  highlighted?: boolean
}

export function BOResultScoreCards({ allocations, totalBudget, kpiLabelEn }: BOResultScoreCardsProps) {
  const totalKpi = allocations.reduce((s, a) => s + a.kpiValue, 0)
  const totalImpression = allocations.reduce((s, a) => s + a.impression, 0)
  const avgCpm = totalImpression > 0 ? Math.round(totalBudget / (totalImpression / 1000)) : 0
  const lockedBudget = allocations.filter(a => a.isFixed).reduce((s, a) => s + a.budget, 0)
  const lockedPct = totalBudget > 0 ? (lockedBudget / totalBudget) * 100 : 0
  const hasLocked = lockedBudget > 0

  const cards: ScoreCard[] = [
    {
      title: `Guaranteed ${kpiLabelEn}`,
      value: totalKpi.toLocaleString(),
      unit: '회',
      icon: <TrendingUp size={20} />,
      highlighted: true
    },
    {
      title: 'Total Budget',
      value: totalBudget.toLocaleString(),
      unit: '원',
      icon: <DollarSign size={20} />
    },
    {
      title: 'Avg. CPM',
      value: avgCpm.toLocaleString(),
      unit: '원',
      icon: <BarChart3 size={20} />
    },
    {
      title: 'Locked Budget',
      value: hasLocked ? lockedBudget.toLocaleString() : '0',
      unit: hasLocked ? `원 (${lockedPct.toFixed(1)}%)` : '',
      icon: <Lock size={20} />
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '20px'
    }}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            backgroundColor: card.highlighted ? 'hsl(240, 5%, 96%)' : 'hsl(var(--card))',
            border: `1px solid ${card.highlighted ? 'hsl(240, 5%, 90%)' : 'hsl(var(--border))'}`,
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            transition: 'all 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {/* 헤더 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif' }}>
              {card.title}
            </div>
            <div style={{
              width: '34px', height: '34px', borderRadius: '8px',
              backgroundColor: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'hsl(var(--muted-foreground))'
            }}>
              {card.icon}
            </div>
          </div>

          {/* 값 */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{
              fontSize: '28px', fontWeight: '700', color: 'hsl(var(--foreground))',
              fontFamily: 'Paperlogy, sans-serif',
              borderBottom: '3px solid #00ff9d', paddingBottom: '2px'
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
