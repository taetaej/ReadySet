import { ArrowLeft, AlertTriangle, CheckCircle, AlertCircle, Users, Calendar, DollarSign } from 'lucide-react'
import { useState } from 'react'
import { SpinXButton } from '../spinx/SpinXButton'
import { SpinXPanel } from '../spinx/SpinXPanel'

interface ComparisonScenario {
  id: string
  name: string
  condition?: string
  budget?: number
  period?: { start: string; end: string }
  targetGrp?: string[]
}

type IntegrityLevel = 'optimal' | 'caution' | 'risk'

interface ScenarioComparisonResultProps {
  isOpen: boolean
  onClose: () => void
  onNewComparison: () => void
  baseScenario: {
    id: string
    name: string
    budget?: number
    period?: { start: string; end: string }
    targetGrp?: string[]
  }
  comparisonScenarios: ComparisonScenario[]
  comparisonType?: string
  integrityLevel?: IntegrityLevel
  isDarkMode?: boolean
}

const comparisonTypeLabels: Record<string, { title: string; subtitle: string; icon: any }> = {
  target: { title: '타겟 비교', subtitle: 'Target Analysis', icon: Users },
  period: { title: '기간 비교', subtitle: 'Period Analysis', icon: Calendar },
  budget: { title: '예산 비교', subtitle: 'Budget Scaling', icon: DollarSign }
}

const integrityConfig = {
  optimal: { color: 'hsl(142.1 76.2% 36.3%)', bg: 'hsl(142.1 76.2% 36.3% / 0.1)', label: '완벽한 비교입니다', icon: CheckCircle },
  caution: { color: 'hsl(47.9 95.8% 53.1%)', bg: 'hsl(47.9 95.8% 53.1% / 0.1)', label: '조건 상이: 해석 시 주의가 필요합니다', icon: AlertTriangle },
  risk: { color: 'hsl(0 84.2% 60.2%)', bg: 'hsl(0 84.2% 60.2% / 0.1)', label: '정합성 낮음: 데이터 왜곡 위험이 큼', icon: AlertCircle }
}

// 조건 차이 계산
function getConditionDiffs(base: ScenarioComparisonResultProps['baseScenario'], scenario: ComparisonScenario): string[] {
  const diffs: string[] = []
  const baseBudget = base.budget || 1000000000
  const sBudget = scenario.budget || 0
  if (sBudget && Math.abs(baseBudget - sBudget) / baseBudget >= 0.05) {
    const pct = (((sBudget - baseBudget) / baseBudget) * 100).toFixed(0)
    diffs.push(`예산(${Number(pct) > 0 ? '+' : ''}${pct}%)`)
  }
  const basePeriod = base.period || { start: '2024-10-01', end: '2024-12-31' }
  const sPeriod = scenario.period || { start: '', end: '' }
  if (basePeriod.start !== sPeriod.start || basePeriod.end !== sPeriod.end) {
    const bDays = Math.round((new Date(basePeriod.end).getTime() - new Date(basePeriod.start).getTime()) / 86400000)
    const sDays = Math.round((new Date(sPeriod.end).getTime() - new Date(sPeriod.start).getTime()) / 86400000)
    const diff = sDays - bDays
    diffs.push(`기간(${diff > 0 ? '+' : ''}${diff}일)`)
  }
  const baseTarget = base.targetGrp || []
  const sTarget = scenario.targetGrp || []
  if (JSON.stringify(baseTarget.sort()) !== JSON.stringify(sTarget.sort())) {
    diffs.push('타겟 상이')
  }
  return diffs
}

export function ScenarioComparisonResult({
  isOpen,
  onClose,
  onNewComparison,
  baseScenario,
  comparisonScenarios,
  comparisonType = '',
  integrityLevel = 'optimal',
  isDarkMode = false
}: ScenarioComparisonResultProps) {
  const [spinXOpen, setSpinXOpen] = useState(false)

  if (!isOpen) return null

  // 더미 비교 데이터
  const comparisonData = {
    base: {
      reach: 73.2,
      frequency: 3.5,
      grp: 256.2,
      budget: 1000000000
    },
    scenarios: comparisonScenarios.map((s, idx) => ({
      ...s,
      reach: 73.2 + (idx + 1) * 2.5,
      frequency: 3.5 + (idx + 1) * 0.3,
      grp: 256.2 + (idx + 1) * 15,
      budget: 1000000000 + (idx + 1) * 100000000
    }))
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginRight: spinXOpen ? '400px' : '0',
        transition: 'margin-right 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          padding: '20px 32px',
          borderBottom: '1px solid hsl(var(--border))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          backgroundColor: 'hsl(var(--card))'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px' }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 2px 0',
                fontFamily: 'Paperlogy, sans-serif',
                color: 'hsl(var(--foreground))'
              }}
            >
              시나리오 비교 결과
            </h3>
            <p
              style={{
                fontSize: '13px',
                margin: 0,
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              {comparisonScenarios.length}개 시나리오 비교
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onNewComparison}
            className="btn btn-secondary btn-md"
          >
            비교 재설정
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-md"
          >
            비교 모드 나가기
          </button>
        </div>
      </div>

      {/* 정합성 Summary Bar */}
      {integrityLevel !== 'optimal' && (
        <div style={{
          padding: '10px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: integrityConfig[integrityLevel].bg,
          borderBottom: '1px solid hsl(var(--border))',
          flexShrink: 0
        }}>
          {(() => {
            const IntIcon = integrityConfig[integrityLevel].icon
            return <IntIcon size={16} style={{ color: integrityConfig[integrityLevel].color }} />
          })()}
          <span style={{
            fontSize: '13px',
            fontWeight: '500',
            color: integrityConfig[integrityLevel].color
          }}>
            {integrityConfig[integrityLevel].label}
          </span>
          <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
            {comparisonScenarios.map(s => {
              const diffs = getConditionDiffs(baseScenario, s)
              return diffs.length > 0 ? `${s.name}: ${diffs.join(', ')}` : null
            }).filter(Boolean).join(' · ')}
          </span>
        </div>
      )}

      {/* 컨텐츠 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px'
        }}
      >
        {/* 비교 유형 뱃지 */}
        {comparisonType && comparisonTypeLabels[comparisonType] && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px'
          }}>
            {(() => {
              const TypeIcon = comparisonTypeLabels[comparisonType].icon
              return <TypeIcon size={16} style={{ color: 'hsl(var(--primary))' }} />
            })()}
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'hsl(var(--foreground))',
              fontFamily: 'Paperlogy, sans-serif'
            }}>
              {comparisonTypeLabels[comparisonType].title}
            </span>
            <span style={{
              fontSize: '12px',
              color: 'hsl(var(--muted-foreground))'
            }}>
              {comparisonTypeLabels[comparisonType].subtitle}
            </span>
          </div>
        )}

        {/* 비교 테이블 */}
        <div
          style={{
            backgroundColor: 'hsl(var(--card))',
            borderRadius: '12px',
            border: '1px solid hsl(var(--border))',
            overflow: 'hidden',
            marginBottom: '32px'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'hsl(var(--muted))',
                  borderBottom: '1px solid hsl(var(--border))'
                }}
              >
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'hsl(var(--foreground))',
                    width: '200px'
                  }}
                >
                  지표
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'hsl(var(--primary))'
                  }}
                >
                  기준<br />
                  <span style={{ fontSize: '11px', fontWeight: '400' }}>
                    {baseScenario.name}
                  </span>
                </th>
                {comparisonScenarios.map((scenario, idx) => (
                  <th
                    key={scenario.id}
                    style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'hsl(var(--foreground))'
                    }}
                  >
                    비교 {idx + 1}<br />
                    <span style={{ fontSize: '11px', fontWeight: '400', color: 'hsl(var(--muted-foreground))' }}>
                      {scenario.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Reach 1+ */}
              <tr style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                <td
                  style={{
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'hsl(var(--foreground))'
                  }}
                >
                  Reach 1+
                </td>
                <td
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'hsl(var(--foreground))'
                  }}
                >
                  {comparisonData.base.reach}%
                </td>
                {comparisonData.scenarios.map((scenario) => {
                  const diff = scenario.reach - comparisonData.base.reach
                  const isPositive = diff > 0
                  
                  return (
                    <td
                      key={scenario.id}
                      style={{
                        padding: '16px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: '600', color: 'hsl(var(--foreground))' }}>
                        {scenario.reach}%
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: isPositive ? 'hsl(142.1 76.2% 36.3%)' : 'hsl(var(--destructive))',
                          marginTop: '4px'
                        }}
                      >
                        {isPositive ? '+' : ''}{diff.toFixed(1)}%p
                      </div>
                    </td>
                  )
                })}
              </tr>

              {/* Avg. Frequency */}
              <tr style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                <td
                  style={{
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'hsl(var(--foreground))'
                  }}
                >
                  Avg. Frequency
                </td>
                <td
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'hsl(var(--foreground))'
                  }}
                >
                  {comparisonData.base.frequency}
                </td>
                {comparisonData.scenarios.map((scenario) => {
                  const diff = scenario.frequency - comparisonData.base.frequency
                  const isPositive = diff > 0
                  
                  return (
                    <td
                      key={scenario.id}
                      style={{
                        padding: '16px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: '600', color: 'hsl(var(--foreground))' }}>
                        {scenario.frequency}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: isPositive ? 'hsl(142.1 76.2% 36.3%)' : 'hsl(var(--destructive))',
                          marginTop: '4px'
                        }}
                      >
                        {isPositive ? '+' : ''}{diff.toFixed(1)}
                      </div>
                    </td>
                  )
                })}
              </tr>

              {/* GRPs */}
              <tr style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                <td
                  style={{
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'hsl(var(--foreground))'
                  }}
                >
                  GRPs
                </td>
                <td
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'hsl(var(--foreground))'
                  }}
                >
                  {comparisonData.base.grp}
                </td>
                {comparisonData.scenarios.map((scenario) => {
                  const diff = scenario.grp - comparisonData.base.grp
                  const isPositive = diff > 0
                  
                  return (
                    <td
                      key={scenario.id}
                      style={{
                        padding: '16px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: '600', color: 'hsl(var(--foreground))' }}>
                        {scenario.grp}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: isPositive ? 'hsl(142.1 76.2% 36.3%)' : 'hsl(var(--destructive))',
                          marginTop: '4px'
                        }}
                      >
                        {isPositive ? '+' : ''}{diff.toFixed(1)}
                      </div>
                    </td>
                  )
                })}
              </tr>

              {/* 총 예산 */}
              <tr>
                <td
                  style={{
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'hsl(var(--foreground))'
                  }}
                >
                  총 예산
                </td>
                <td
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'hsl(var(--foreground))'
                  }}
                >
                  ₩{comparisonData.base.budget.toLocaleString('ko-KR')}
                </td>
                {comparisonData.scenarios.map((scenario) => {
                  const diff = scenario.budget - comparisonData.base.budget
                  const isPositive = diff > 0
                  
                  return (
                    <td
                      key={scenario.id}
                      style={{
                        padding: '16px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '16px', fontWeight: '600', color: 'hsl(var(--foreground))' }}>
                        ₩{scenario.budget.toLocaleString('ko-KR')}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: isPositive ? 'hsl(var(--destructive))' : 'hsl(142.1 76.2% 36.3%)',
                          marginTop: '4px'
                        }}
                      >
                        {isPositive ? '+' : ''}₩{Math.abs(diff).toLocaleString('ko-KR')}
                      </div>
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* 비교 조건 요약 */}
        <div
          style={{
            backgroundColor: 'hsl(var(--card))',
            borderRadius: '12px',
            border: '1px solid hsl(var(--border))',
            padding: '24px',
            marginBottom: '32px'
          }}
        >
          <h4
            style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              fontFamily: 'Paperlogy, sans-serif',
              color: 'hsl(var(--foreground))'
            }}
          >
            비교 조건
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {comparisonScenarios.map((scenario, idx) => {
              const diffs = getConditionDiffs(baseScenario, scenario)
              const hasIssue = diffs.length > 0
              
              return (
                <div
                  key={scenario.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: hasIssue ? 'hsl(47.9 95.8% 53.1% / 0.05)' : 'hsl(var(--muted) / 0.5)',
                    border: `1px solid ${hasIssue ? 'hsl(47.9 95.8% 53.1% / 0.3)' : 'hsl(var(--border))'}`
                  }}
                >
                  <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}>
                    비교 {idx + 1}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'hsl(var(--foreground))', marginBottom: '8px' }}>
                    {scenario.name}
                  </div>
                  {hasIssue ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: 'hsl(47.9 95.8% 53.1%)'
                    }}>
                      <AlertTriangle size={12} />
                      <span style={{ fontWeight: '500' }}>조건 상이: {diffs.join(', ')}</span>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: 'hsl(142.1 76.2% 36.3%)'
                    }}>
                      <CheckCircle size={12} />
                      <span style={{ fontWeight: '500' }}>조건 일치</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* SpinX 플로팅 버튼 */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 998
        }}
      >
        <SpinXButton 
          onClick={() => setSpinXOpen(true)} 
          hasNewMessage={false}
          style={{
            position: 'relative',
            bottom: 'auto',
            right: 'auto'
          }}
        />
      </div>

      {/* SpinX 패널 */}
      <SpinXPanel
        isOpen={spinXOpen}
        onClose={() => setSpinXOpen(false)}
        isDarkMode={isDarkMode}
        scenarioName="시나리오 비교 분석"
        analysisType="reachPredictor"
      />
    </div>
  )
}
