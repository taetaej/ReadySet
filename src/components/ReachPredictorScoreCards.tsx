import { Users, Repeat, Target, Coins } from 'lucide-react'

interface ScoreCard {
  title: string
  value: string
  unit: string
  icon: React.ReactNode
  color: string
  highlighted?: boolean
}

interface ReachPredictorScoreCardsProps {
  data?: {
    reach1Plus?: number
    frequency?: number
    grp?: number
    cprp?: number
  }
  isDarkMode?: boolean
}

export function ReachPredictorScoreCards({ data, isDarkMode = false }: ReachPredictorScoreCardsProps) {
  const scoreCards: ScoreCard[] = [
    {
      title: 'Reach1+',
      value: data?.reach1Plus?.toFixed(1) || '68.5',
      unit: '%',
      icon: <Users size={20} />,
      color: 'hsl(240, 5%, 26%)', // 차콜 그레이
      highlighted: true
    },
    {
      title: 'Avg. Frequency',
      value: data?.frequency?.toFixed(1) || '3.2',
      unit: '회',
      icon: <Repeat size={20} />,
      color: 'hsl(240, 5%, 26%)' // 차콜 그레이
    },
    {
      title: 'GRPs',
      value: data?.grp?.toFixed(0) || '219',
      unit: '',
      icon: <Target size={20} />,
      color: 'hsl(240, 5%, 26%)' // 차콜 그레이
    },
    {
      title: 'CPRP',
      value: data?.cprp?.toLocaleString('ko-KR') || '4,566,210',
      unit: '원',
      icon: <Coins size={20} />,
      color: 'hsl(240, 5%, 26%)' // 차콜 그레이
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      height: '360px'
    }}>
      {scoreCards.map((card, index) => (
        <div
          key={index}
          style={{
            backgroundColor: card.highlighted 
              ? (isDarkMode ? 'hsl(240, 5%, 15%)' : 'hsl(240, 5%, 96%)') 
              : 'hsl(var(--card))',
            border: `1px solid ${card.highlighted 
              ? (isDarkMode ? 'hsl(240, 5%, 25%)' : 'hsl(240, 5%, 90%)') 
              : 'hsl(var(--border))'}`,
            borderRadius: '12px',
            padding: '18px',
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'hsl(var(--foreground))',
              fontFamily: 'Paperlogy, sans-serif'
            }}>
              {card.title}
            </div>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: card.highlighted ? 'transparent' : `${card.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: card.color
            }}>
              {card.icon}
            </div>
          </div>

          {/* 값 */}
          <div>
            <div style={{
              fontSize: '36px',
              fontWeight: '700',
              color: 'hsl(var(--foreground))',
              fontFamily: 'Paperlogy, sans-serif',
              display: 'flex',
              alignItems: 'baseline',
              gap: '4px'
            }}>
              <span style={{
                borderBottom: '3px solid #00ff9d',
                paddingBottom: '2px'
              }}>
                {card.value}
              </span>
              <span style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'hsl(var(--muted-foreground))'
              }}>
                {card.unit}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
