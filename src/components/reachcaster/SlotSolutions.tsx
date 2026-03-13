import { useNavigate } from 'react-router-dom'
import { Database, Target, DollarSign, TrendingUp, ArrowRight } from 'lucide-react'

interface SlotSolutionsProps {
  slotData: any
}

export function SlotSolutions({ slotData }: SlotSolutionsProps) {
  const navigate = useNavigate()

  const solutions = [
    {
      id: 'datashot',
      name: 'DataShot',
      icon: Database,
      color: 'hsl(var(--primary))',
      path: '/datashot'
    },
    {
      id: 'ad-curator',
      name: 'Ad Curator',
      icon: Target,
      color: 'hsl(142.1 76.2% 36.3%)',
      path: '/ad-curator'
    },
    {
      id: 'budget-optimizer',
      name: 'Budget Optimizer',
      icon: DollarSign,
      color: 'hsl(47.9 95.8% 53.1%)',
      path: '/budget-optimizer'
    },
    {
      id: 'reach-caster',
      name: 'Reach Caster',
      icon: TrendingUp,
      color: 'hsl(221.2 83.2% 53.3%)',
      path: '/reachcaster'
    }
  ]

  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        fontFamily: 'Paperlogy, sans-serif',
        margin: '0 0 24px 0',
        color: 'hsl(var(--foreground))'
      }}>
        Solutions
      </h2>

      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {solutions.map((solution) => {
          const Icon = solution.icon
          return (
            <button
              key={solution.id}
              onClick={() => navigate(solution.path, { state: { slotData } })}
              style={{
                padding: '16px 24px',
                borderRadius: '12px',
                border: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--card))',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Paperlogy, sans-serif',
                color: 'hsl(var(--foreground))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                e.currentTarget.style.borderColor = solution.color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'hsl(var(--border))'
              }}
            >
              <Icon size={20} style={{ color: solution.color }} />
              <span>{solution.name}</span>
              <ArrowRight size={16} className="text-muted-foreground" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
