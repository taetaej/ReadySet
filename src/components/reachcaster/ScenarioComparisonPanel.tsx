import { X, Plus, Target, TrendingUp, Clock, DollarSign, Search } from 'lucide-react'
import { useState } from 'react'

interface ComparisonScenario {
  id: string
  name: string
}

interface ComparisonPurpose {
  id: string
  title: string
  description: string
  conditions: string
  icon: any
}

interface ScenarioComparisonPanelProps {
  isOpen: boolean
  onClose: () => void
  baseScenario: {
    id: string
    name: string
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

  // 비교 목적 옵션
  const comparisonPurposes: ComparisonPurpose[] = [
    {
      id: 'impact',
      title: '광고 임팩트 비교',
      description: '동일한 예산과 기간 내에서 어떤 매체 조합이 가장 압도적인 도달과 노출을 만들어내는지 분석합니다.',
      conditions: '조건: 예산/기간/타겟 동일',
      icon: Target
    },
    {
      id: 'budget',
      title: '버짓룸 및 증액 효율',
      description: '현재의 매체 구성이 예산 증액을 수용할 여유가 있는지, 효율이 꺾이는 지점은 어디인지 진단합니다.',
      conditions: '조건: 매체구성/기간/타겟 동일',
      icon: TrendingUp
    },
    {
      id: 'reach-flow',
      title: '누적 도달 가속도',
      description: '캠페인 기간 연장에 따라 도달률이 쌓이는 속도와 임계점을 확인하여 최적의 집행 기간을 도출합니다.',
      conditions: '조건: 타겟/매체구성 동일, 기간 상이',
      icon: Clock
    },
    {
      id: 'efficiency',
      title: '미디어 가성비 비교',
      description: '서로 다른 조건의 시나리오들 중 도달 1%를 확보하기 위해 가장 적은 비용이 드는 \'최적 가성비 안\'을 찾습니다.',
      conditions: '조건: 타겟 동일',
      icon: DollarSign
    }
  ]

  // 더미 시나리오 목록
  const availableScenarios = [
    { id: 'S001', name: '2024 Q4 캠페인' },
    { id: 'S002', name: '신제품 런칭' },
    { id: 'S003', name: '브랜드 인지도 향상' },
    { id: 'S004', name: '여름 시즌 프로모션' },
    { id: 'S005', name: '연말 특별 캠페인' }
  ]

  const handleAddScenario = (scenario: { id: string; name: string }) => {
    if (comparisonScenarios.length < 3) {
      setComparisonScenarios([
        ...comparisonScenarios,
        { id: scenario.id, name: scenario.name }
      ])
      setShowScenarioSelector(false)
      setSearchQuery('') // 검색어 초기화
    }
  }

  const handleRemoveScenario = (id: string) => {
    setComparisonScenarios(comparisonScenarios.filter(s => s.id !== id))
  }

  const handlePurposeChange = (purposeId: string) => {
    setSelectedPurpose(purposeId)
    setComparisonScenarios([]) // 비교 목적 변경 시 선택된 시나리오 리셋
  }

  const canCompare = selectedPurpose !== '' && comparisonScenarios.length >= 1

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isOpen ? 0 : '-700px',
        left: 0,
        right: 0,
        height: '700px',
        backgroundColor: isDarkMode ? 'hsl(var(--card))' : 'hsl(var(--card))',
        borderTop: '1px solid hsl(var(--border))',
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.15)',
        zIndex: 999,
        transition: 'bottom 0.3s ease-out',
        display: 'flex',
        flexDirection: 'column'
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
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 4px 0',
              fontFamily: 'Paperlogy, sans-serif',
              color: 'hsl(var(--foreground))'
            }}
          >
            시나리오 비교 설정
          </h3>
          <p
            style={{
              fontSize: '13px',
              margin: 0,
              color: 'hsl(var(--muted-foreground))'
            }}
          >
            비교 목적을 선택하고 1~3개의 시나리오를 추가하세요
          </p>
        </div>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm"
          style={{ padding: '6px' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* 컨텐츠 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px'
        }}
      >
        {/* Step 1: 비교 목적 선택 */}
        <div style={{ marginBottom: '32px' }}>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: 'hsl(var(--foreground))',
              fontFamily: 'Paperlogy, sans-serif'
            }}
          >
            1. 비교 목적
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
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
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'hsl(var(--foreground))',
                        fontFamily: 'Paperlogy, sans-serif'
                      }}
                    >
                      {purpose.title}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '12px',
                      margin: 0,
                      color: 'hsl(var(--muted-foreground))',
                      lineHeight: '1.5'
                    }}
                  >
                    {purpose.description}
                  </p>
                  <div
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'hsl(var(--muted))',
                      color: 'hsl(var(--muted-foreground))',
                      width: 'fit-content',
                      fontWeight: '500'
                    }}
                  >
                    {purpose.conditions}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2: 비교 시나리오 선택 */}
        <div>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: 'hsl(var(--foreground))',
              fontFamily: 'Paperlogy, sans-serif'
            }}
          >
            2. 비교 시나리오 선택 (1~3개)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {/* 기준 시나리오 */}
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '2px solid hsl(var(--primary))',
                backgroundColor: 'hsl(var(--primary) / 0.05)'
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'hsl(var(--primary))',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                기준 시나리오
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'hsl(var(--foreground))',
                  fontFamily: 'Paperlogy, sans-serif'
                }}
              >
                {baseScenario.name}
              </div>
            </div>

            {/* 비교 시나리오 슬롯 */}
            {[0, 1, 2].map((index) => {
              const scenario = comparisonScenarios[index]
              
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
                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: 'hsl(var(--muted-foreground))',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          비교 {index + 1}
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
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'hsl(var(--foreground))',
                          fontFamily: 'Paperlogy, sans-serif'
                        }}
                      >
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
          justifyContent: 'flex-end',
          gap: '8px',
          flexShrink: 0,
          backgroundColor: 'hsl(var(--muted) / 0.3)'
        }}
      >
        <button
          onClick={onClose}
          className="btn btn-secondary btn-md"
        >
          취소
        </button>
        <button
          onClick={() => onCompare(selectedPurpose, comparisonScenarios)}
          disabled={!canCompare}
          className="btn btn-primary btn-md"
          style={{
            opacity: canCompare ? 1 : 0.5,
            cursor: canCompare ? 'pointer' : 'not-allowed'
          }}
        >
          비교 결과 보기
        </button>
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
            zIndex: 1000
          }}
          onClick={() => setShowScenarioSelector(false)}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? 'hsl(var(--card))' : 'hsl(var(--card))',
              borderRadius: '12px',
              padding: '24px',
              width: '500px',
              height: '600px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 4px 0',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Paperlogy, sans-serif'
              }}
            >
              비교 시나리오 추가
            </h3>
            <p
              style={{
                fontSize: '12px',
                margin: '0 0 16px 0',
                color: 'hsl(var(--muted-foreground))',
                lineHeight: '1.5'
              }}
            >
              {slotName}에서 조건에 부합하는 시나리오 목록만 표시됩니다
            </p>
            
            {/* 검색 입력 */}
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
                style={{
                  width: '100%',
                  paddingLeft: '36px',
                  fontSize: '13px'
                }}
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
                .map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => handleAddScenario(scenario)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      marginBottom: '8px',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontFamily: 'Paperlogy, sans-serif',
                      color: 'hsl(var(--foreground))',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
                      e.currentTarget.style.borderColor = 'hsl(var(--foreground))'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.borderColor = 'hsl(var(--border))'
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                      {scenario.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                      ID: {scenario.id}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
