import { useNavigate } from 'react-router-dom'
import { Database, Target, DollarSign, TrendingUp, ArrowRight } from 'lucide-react'

interface SelectedScenario {
  id: string
  name: string
  path: string
}

interface SlotOverviewProps {
  slotData: any
  selectedScenarios: {
    datashot?: SelectedScenario
    adCurator?: SelectedScenario
    budgetOptimizer?: SelectedScenario
    reachCaster?: SelectedScenario
  }
}

export function SlotOverview({ slotData, selectedScenarios }: SlotOverviewProps) {
  const navigate = useNavigate()

  const solutions = [
    {
      id: 'datashot',
      name: 'DataShot',
      icon: Database,
      color: 'hsl(var(--primary))',
      defaultPath: '/datashot',
      scenario: selectedScenarios.datashot
    },
    {
      id: 'adCurator',
      name: 'Ad Curator',
      icon: Target,
      color: 'hsl(142.1 76.2% 36.3%)',
      defaultPath: '/ad-curator',
      scenario: selectedScenarios.adCurator
    },
    {
      id: 'budgetOptimizer',
      name: 'Budget Optimizer',
      icon: DollarSign,
      color: 'hsl(47.9 95.8% 53.1%)',
      defaultPath: '/budget-optimizer',
      scenario: selectedScenarios.budgetOptimizer
    },
    {
      id: 'reachCaster',
      name: 'Reach Caster',
      icon: TrendingUp,
      color: 'hsl(221.2 83.2% 53.3%)',
      defaultPath: '/reachcaster',
      scenario: selectedScenarios.reachCaster
    }
  ]

  return (
    <div style={{ marginBottom: '80px' }}>
      <h2 style={{
        fontSize: '48px',
        fontWeight: '600',
        fontFamily: 'Paperlogy, sans-serif',
        margin: '0 0 64px 0',
        color: 'hsl(var(--foreground))',
        letterSpacing: '-0.02em'
      }}>
        Slot Overview
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '32px'
      }}>
        {solutions.map((solution, index) => {
          const Icon = solution.icon
          const hasScenario = !!solution.scenario
          
          return (
            <div
              key={solution.id}
              className="bento-box"
              style={{
                padding: '32px',
                cursor: hasScenario ? 'pointer' : 'default',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: hasScenario ? 1 : 0.4,
                position: 'relative',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onClick={() => {
                if (hasScenario && solution.scenario) {
                  navigate(solution.scenario.path, { state: { slotData } })
                }
              }}
              onMouseEnter={(e) => {
                if (hasScenario) {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)'
                }
              }}
              onMouseLeave={(e) => {
                if (hasScenario) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = ''
                }
              }}
            >
              {/* 순서 표시 */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'hsl(var(--muted))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: 'hsl(var(--muted-foreground))'
              }}>
                {index + 1}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Icon size={20} style={{ color: solution.color }} />
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: 0,
                    fontFamily: 'Paperlogy, sans-serif',
                    letterSpacing: '-0.01em'
                  }}>
                    {solution.name}
                  </h3>
                </div>

                {hasScenario && solution.scenario ? (
                  <>
                    <p style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      margin: '0 0 8px 0',
                      color: 'hsl(var(--foreground))',
                      lineHeight: '1.5'
                    }}>
                      {solution.scenario.name}
                    </p>
                  </>
                ) : (
                  <p style={{
                    fontSize: '14px',
                    margin: 0,
                    color: 'hsl(var(--muted-foreground))',
                    fontStyle: 'italic'
                  }}>
                    시나리오 미선택
                  </p>
                )}
              </div>

              {hasScenario && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: 'hsl(var(--muted-foreground))',
                  marginTop: '16px'
                }}>
                  <span>결과 보기</span>
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
