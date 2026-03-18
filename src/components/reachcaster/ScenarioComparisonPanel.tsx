import { X, Plus, Users, Calendar, DollarSign, Search, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { useState } from 'react'

interface ComparisonScenario {
  id: string
  name: string
  // 정합성 체크용 더미 데이터
  budget?: number
  period?: { start: string; end: string }
  targetGrp?: string[]
}

interface ComparisonPurpose {
  id: string
  title: string
  subtitle: string
  description: string
  conditions: string
  icon: any
}

type IntegrityLevel = 'optimal' | 'caution' | 'risk'

interface ScenarioComparisonPanelProps {
  isOpen: boolean
  onClose: () => void
  baseScenario: {
    id: string
    name: string
    budget?: number
    period?: { start: string; end: string }
    targetGrp?: string[]
  }
  slotName?: string
  onCompare: (purpose: string, scenarios: ComparisonScenario[]) => void
  isDarkMode?: boolean
}

export function ScenarioComparisonPanel({
  isOpen,
  onClose,
  baseScenario,
  slotName = '슬롯',
  onCompare,
  isDarkMode = false
}: ScenarioComparisonPanelProps) {
  const [selectedPurpose, setSelectedPurpose] = useState<string>('')
  const [comparisonScenarios, setComparisonScenarios] = useState<ComparisonScenario[]>([])
  const [showScenarioSelector, setShowScenarioSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // 비교 유형 3가지
  const comparisonPurposes: ComparisonPurpose[] = [
    {
      id: 'target',
      title: '타겟 비교',
      subtitle: 'Target Analysis',
      description: '동일한 광고비와 기간 조건에서, 어떤 타겟이 캠페인에 더 효율적으로 반응하는가?',
      conditions: '권장: 예산/기간 동일',
      icon: Users
    },
    {
      id: 'period',
      title: '기간 비교',
      subtitle: 'Period Analysis',
      description: '캠페인의 집행 기간과 노출 강도, 어떤 운영 전략이 더 유리한가?',
      conditions: '권장: 예산/타겟 동일',
      icon: Calendar
    },
    {
      id: 'budget',
      title: '예산 비교',
      subtitle: 'Budget Scaling',
      description: '광고비를 증액했을 때, 도달 효율의 한계점은 어디인가?',
      conditions: '권장: 기간/타겟 동일',
      icon: DollarSign
    }
  ]

  // 더미 시나리오 목록 (정합성 체크용 데이터 포함)
  const availableScenarios: ComparisonScenario[] = [
    // 타겟만 다른 시나리오 (권장 조건 일치 = optimal)
    { id: 'S001', name: '남성 25~34 타겟', budget: 1000000000, period: { start: '2024-10-01', end: '2024-12-31' }, targetGrp: ['남성 25~29세', '남성 30~34세'] },
    { id: 'S002', name: '여성 25~34 타겟', budget: 1000000000, period: { start: '2024-10-01', end: '2024-12-31' }, targetGrp: ['여성 25~29세', '여성 30~34세'] },
    { id: 'S003', name: '남녀 20~29 타겟', budget: 1000000000, period: { start: '2024-10-01', end: '2024-12-31' }, targetGrp: ['남성 20~24세', '남성 25~29세', '여성 20~24세', '여성 25~29세'] },
    { id: 'S004', name: '전체 타겟', budget: 1000000000, period: { start: '2024-10-01', end: '2024-12-31' }, targetGrp: ['전체'] },
    { id: 'S005', name: '여성 20~29 타겟', budget: 1000000000, period: { start: '2024-10-01', end: '2024-12-31' }, targetGrp: ['여성 20~24세', '여성 25~29세'] },
    { id: 'S006', name: '남성 35~44 타겟', budget: 1000000000, period: { start: '2024-10-01', end: '2024-12-31' }, targetGrp: ['남성 35~39세', '남성 40~44세'] },
    // 예산 상이 (caution for target, optimal for budget)
    { id: 'S007', name: '여성 30~39 (예산 상이)', budget: 1300000000, period: { start: '2024-10-01', end: '2024-12-31' }, targetGrp: ['여성 30~34세', '여성 35~39세'] },
    { id: 'S008', name: '남녀 30~39 (예산 상이)', budget: 800000000, period: { start: '2024-10-01', end: '2024-12-31' }, targetGrp: ['남성 30~34세', '남성 35~39세', '여성 30~34세', '여성 35~39세'] },
    // 기간 상이 (caution)
    { id: 'S009', name: '남성 20~24 (기간 상이)', budget: 1000000000, period: { start: '2024-11-01', end: '2025-01-31' }, targetGrp: ['남성 20~24세'] },
    // 예산+기간 모두 상이 (risk)
    { id: 'S010', name: '여성 40~49 (조건 상이)', budget: 700000000, period: { start: '2024-07-01', end: '2024-09-30' }, targetGrp: ['여성 40~44세', '여성 45~49세'] },
    // 예산 비교용 시나리오 (동일 타겟/기간, 다른 예산)
    { id: 'S011', name: '보수적 예산안 (7억)', budget: 700000000, period: { start: '2024-10-01', end: '2024-12-31' }, targetGrp: ['남성 25~29세', '남성 30~34세'] },
    { id: 'S012', name: '확장 예산안 (13억)', budget: 1300000000, period: { start: '2024-10-01', end: '2024-12-31' }, targetGrp: ['남성 25~29세', '남성 30~34세'] },
    { id: 'S013', name: '공격적 예산안 (15억)', budget: 1500000000, period: { start: '2024-10-01', end: '2024-12-31' }, targetGrp: ['남성 25~29세', '남성 30~34세'] }
  ]

  // 정합성 체크 로직
  const checkIntegrity = (scenario: ComparisonScenario): IntegrityLevel => {
    if (!selectedPurpose || !baseScenario) return 'optimal'
    
    const baseBudget = baseScenario.budget || 1000000000
    const basePeriod = baseScenario.period || { start: '2024-10-01', end: '2024-12-31' }
    const baseTarget = baseScenario.targetGrp || ['남성 25~29세', '남성 30~34세']
    
    const sBudget = scenario.budget || 0
    const sPeriod = scenario.period || { start: '', end: '' }
    const sTarget = scenario.targetGrp || []
    
    const budgetMatch = Math.abs(baseBudget - sBudget) / baseBudget < 0.05
    const periodMatch = basePeriod.start === sPeriod.start && basePeriod.end === sPeriod.end
    const targetMatch = JSON.stringify(baseTarget.sort()) === JSON.stringify(sTarget.sort())
    
    if (selectedPurpose === 'target') {
      // 타겟 비교: 예산/기간 같아야 optimal
      if (budgetMatch && periodMatch) return 'optimal'
      if (budgetMatch || periodMatch) return 'caution'
      return 'risk'
    }
    if (selectedPurpose === 'period') {
      // 기간 비교: 예산/타겟 같아야 optimal
      if (budgetMatch && targetMatch) return 'optimal'
      if (budgetMatch || targetMatch) return 'caution'
      return 'risk'
    }
    if (selectedPurpose === 'budget') {
      // 예산 비교: 기간/타겟 같아야 optimal
      if (periodMatch && targetMatch) return 'optimal'
      if (periodMatch || targetMatch) return 'caution'
      return 'risk'
    }
    return 'optimal'
  }

  // 전체 정합성 레벨
  const getOverallIntegrity = (): IntegrityLevel => {
    if (comparisonScenarios.length === 0) return 'optimal'
    const levels = comparisonScenarios.map(checkIntegrity)
    if (levels.includes('risk')) return 'risk'
    if (levels.includes('caution')) return 'caution'
    return 'optimal'
  }

  const integrityConfig = {
    optimal: { color: 'hsl(var(--muted-foreground))', label: '비교 적합', desc: '권장 조건이 일치하여 신뢰도 높은 비교가 가능합니다.', icon: CheckCircle },
    caution: { color: 'hsl(38 92% 50%)', label: '조건 일부 상이', desc: '일부 권장 조건이 다릅니다. 결과 해석 시 차이를 감안해 주세요.', icon: AlertTriangle },
    risk: { color: 'hsl(var(--destructive))', label: '비교 부적합', desc: '권장 조건이 대부분 상이하여 비교 결과의 신뢰도가 낮을 수 있습니다.', icon: XCircle }
  }

  const handleAddScenario = (scenario: ComparisonScenario) => {
    if (comparisonScenarios.length < 3) {
      setComparisonScenarios([...comparisonScenarios, scenario])
      setShowScenarioSelector(false)
      setSearchQuery('')
    }
  }

  const handleRemoveScenario = (id: string) => {
    setComparisonScenarios(comparisonScenarios.filter(s => s.id !== id))
  }

  const handlePurposeChange = (purposeId: string) => {
    setSelectedPurpose(purposeId)
    setComparisonScenarios([])
  }

  const overallIntegrity = getOverallIntegrity()
  const canCompare = selectedPurpose !== '' && comparisonScenarios.length >= 1
  const hasRisk = overallIntegrity === 'risk'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isOpen ? 0 : '-520px',
        left: 0,
        right: 0,
        height: '520px',
        backgroundColor: 'hsl(var(--card))',
        borderTop: '1px solid hsl(var(--border))',
        zIndex: 999,
        transition: 'bottom 0.3s ease-out',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
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
          flexShrink: 0
        }}
      >
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 4px 0',
            fontFamily: 'Paperlogy, sans-serif',
            color: 'hsl(var(--foreground))'
          }}>
            시나리오 비교 설정
          </h3>
          <p style={{
            fontSize: '13px',
            margin: 0,
            color: 'hsl(var(--muted-foreground))'
          }}>
            비교 유형을 선택하고 1~3개의 시나리오를 추가하세요
          </p>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
          <X size={16} />
        </button>
      </div>

      {/* 컨텐츠 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        {/* Step 1: 비교 유형 선택 */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: 'hsl(var(--foreground))',
            fontFamily: 'Paperlogy, sans-serif'
          }}>
            1. 비교 유형
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {comparisonPurposes.map((purpose) => {
              const Icon = purpose.icon
              const isSelected = selectedPurpose === purpose.id
              
              return (
                <button
                  key={purpose.id}
                  onClick={() => handlePurposeChange(purpose.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                    backgroundColor: isSelected ? 'hsl(var(--primary) / 0.05)' : 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'hsl(var(--foreground))'
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'hsl(var(--border))'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={18} style={{ color: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }} />
                    <div>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'hsl(var(--foreground))',
                        fontFamily: 'Paperlogy, sans-serif'
                      }}>
                        {purpose.title}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: 'hsl(var(--muted-foreground))',
                        marginLeft: '6px'
                      }}>
                        {purpose.subtitle}
                      </span>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '12px',
                    margin: 0,
                    color: 'hsl(var(--muted-foreground))',
                    lineHeight: '1.5'
                  }}>
                    {purpose.description}
                  </p>
                  <div style={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'hsl(var(--muted))',
                    color: 'hsl(var(--muted-foreground))',
                    width: 'fit-content',
                    fontWeight: '500'
                  }}>
                    {purpose.conditions}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2: 비교 시나리오 선택 */}
        <div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: 'hsl(var(--foreground))',
            fontFamily: 'Paperlogy, sans-serif'
          }}>
            2. 비교 시나리오 선택 (1~3개)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {/* 기준 시나리오 */}
            <div style={{
              padding: '16px',
              borderRadius: '8px',
              border: '2px solid hsl(var(--primary))',
              backgroundColor: 'hsl(var(--primary) / 0.05)'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: 'hsl(var(--primary))',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                기준 시나리오
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Paperlogy, sans-serif'
              }}>
                {baseScenario.name}
              </div>
            </div>

            {/* 비교 시나리오 슬롯 */}
            {[0, 1, 2].map((index) => {
              const scenario = comparisonScenarios[index]
              const integrity = scenario ? checkIntegrity(scenario) : null
              
              return (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: scenario ? 'hsl(var(--muted) / 0.3)' : 'transparent'
                  }}
                >
                  {scenario ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: 'hsl(var(--muted-foreground))',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            비교 {index + 1}
                          </span>
                          {integrity && (
                            (() => {
                              const IntIcon = integrityConfig[integrity].icon
                              return <span title={integrityConfig[integrity].label}><IntIcon size={12} style={{ color: integrityConfig[integrity].color }} /></span>
                            })()
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveScenario(scenario.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                            color: 'hsl(var(--muted-foreground))',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'hsl(var(--foreground))',
                        fontFamily: 'Paperlogy, sans-serif'
                      }}>
                        {scenario.name}
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowScenarioSelector(true)}
                      disabled={comparisonScenarios.length >= 3 || selectedPurpose === ''}
                      style={{
                        width: '100%',
                        height: '100%',
                        minHeight: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: 'none',
                        border: '2px dashed hsl(var(--border))',
                        borderRadius: '8px',
                        cursor: (comparisonScenarios.length >= 3 || selectedPurpose === '') ? 'not-allowed' : 'pointer',
                        color: 'hsl(var(--muted-foreground))',
                        opacity: (comparisonScenarios.length >= 3 || selectedPurpose === '') ? 0.5 : 1,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (comparisonScenarios.length < 3 && selectedPurpose !== '') {
                          e.currentTarget.style.borderColor = 'hsl(var(--foreground))'
                          e.currentTarget.style.color = 'hsl(var(--foreground))'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'hsl(var(--border))'
                        e.currentTarget.style.color = 'hsl(var(--muted-foreground))'
                      }}
                    >
                      <Plus size={20} />
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>
                        비교 시나리오 추가
                      </span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div
        style={{
          padding: '16px 32px',
          borderTop: '1px solid hsl(var(--border))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexShrink: 0,
          backgroundColor: 'hsl(var(--muted) / 0.3)'
        }}
      >
        {/* 좌측: 정합성 메시지 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {comparisonScenarios.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              {(() => {
                const Icon = integrityConfig[overallIntegrity].icon
                return <Icon size={14} style={{ color: integrityConfig[overallIntegrity].color, flexShrink: 0, marginTop: '1px' }} />
              })()}
              <div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'hsl(var(--foreground))'
                }}>
                  {integrityConfig[overallIntegrity].label}
                </span>
                <p style={{
                  fontSize: '11px',
                  margin: '2px 0 0 0',
                  color: 'hsl(var(--muted-foreground))',
                  lineHeight: '1.4'
                }}>
                  {integrityConfig[overallIntegrity].desc}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 우측: 버튼 */}
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button onClick={onClose} className="btn btn-secondary btn-md">
            취소
          </button>
          <button
            onClick={() => onCompare(selectedPurpose, comparisonScenarios)}
            disabled={!canCompare}
            className="btn btn-primary btn-md"
            style={{
              opacity: canCompare ? 1 : 0.5,
              cursor: canCompare ? 'pointer' : 'not-allowed',
              backgroundColor: hasRisk && canCompare ? 'hsl(var(--destructive))' : undefined
            }}
          >
            {hasRisk ? '그래도 비교하기' : '비교 결과 보기'}
          </button>
        </div>
      </div>

      {/* 시나리오 선택 다이얼로그 */}
      {showScenarioSelector && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            overflow: 'hidden'
          }}
          onClick={() => setShowScenarioSelector(false)}
        >
          <div
            style={{
              backgroundColor: 'hsl(var(--card))',
              borderRadius: '12px',
              padding: '24px',
              width: '500px',
              height: '460px',
              border: '1px solid hsl(var(--border))',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 4px 0',
              color: 'hsl(var(--foreground))',
              fontFamily: 'Paperlogy, sans-serif'
            }}>
              비교 시나리오 추가
            </h3>
            <p style={{
              fontSize: '12px',
              margin: '0 0 16px 0',
              color: 'hsl(var(--muted-foreground))',
              lineHeight: '1.5'
            }}>
              {slotName}에서 조건에 부합하는 시나리오 목록만 표시됩니다
            </p>
            
            {/* 검색 */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search 
                size={16} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'hsl(var(--muted-foreground))',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                placeholder="시나리오명 또는 ID로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                style={{ width: '100%', paddingLeft: '36px', fontSize: '13px' }}
              />
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {availableScenarios
                .filter(s => 
                  s.id !== baseScenario.id && 
                  !comparisonScenarios.find(cs => cs.id === s.id) &&
                  (searchQuery === '' || 
                   s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   s.id.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((scenario) => {
                  const integrity = checkIntegrity(scenario)
                  
                  return (
                    <button
                      key={scenario.id}
                      onClick={() => handleAddScenario(scenario)}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        marginBottom: '4px',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        backgroundColor: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontFamily: 'Paperlogy, sans-serif',
                        color: 'hsl(var(--foreground))',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '2px', fontSize: '13px' }}>
                            {scenario.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                            {scenario.id}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                            {(() => {
                              const IntIcon = integrityConfig[integrity].icon
                              return <IntIcon size={12} style={{ color: integrityConfig[integrity].color }} />
                            })()}
                            <span style={{ fontSize: '11px', color: integrityConfig[integrity].color, fontWeight: '500' }}>
                              {integrityConfig[integrity].label}
                            </span>
                          </div>
                      </div>
                    </button>
                  )
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
