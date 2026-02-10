import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

interface ScenarioResultRatioFinderProps {
  scenarioId?: string
  scenarioName?: string
}

export function ScenarioResultRatioFinder({ 
  scenarioId = 'SCN001', 
  scenarioName = '시나리오 이름' 
}: ScenarioResultRatioFinderProps) {
  const navigate = useNavigate()

  return (
    <div style={{ 
      padding: '24px',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
          style={{ padding: '8px' }}
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600',
            marginBottom: '4px'
          }}>
            Ratio Finder 실행 결과
          </h1>
          <p style={{ 
            fontSize: '14px',
            color: 'hsl(var(--muted-foreground))'
          }}>
            {scenarioName} ({scenarioId})
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        padding: '48px',
        textAlign: 'center',
        backgroundColor: 'hsl(var(--card))'
      }}>
        <p style={{ 
          fontSize: '16px',
          color: 'hsl(var(--muted-foreground))'
        }}>
          Ratio Finder 결과 페이지 (준비 중)
        </p>
      </div>
    </div>
  )
}
