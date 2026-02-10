import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, X, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { AppLayout } from './layout/AppLayout'
import { getDarkMode, setDarkMode } from '../utils/theme'
import { 
  ScenarioStep1,
  ScenarioStep2RatioFinder,
  ScenarioStep2ReachPredictor,
  ReachPredictorMediaDialog,
  type ScenarioFormData,
  type ReachPredictorMedia
} from './scenario'

interface CreateScenarioProps {
  slotData?: any
}

export function CreateScenario({ slotData }: CreateScenarioProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const [formData, setFormData] = useState<ScenarioFormData>({
    scenarioName: '',
    description: '',
    moduleType: '',
    brand: '',
    industry: '',
    period: { start: '', end: '' },
    targetGrp: [],
    simulationUnit: ''
  })
  
  const [allSlotsExpanded, setAllSlotsExpanded] = useState(true)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  
  // 매체별 예산 배분 관련 state
  const [selectedMediaCategory, setSelectedMediaCategory] = useState<'DIGITAL' | 'TV'>('DIGITAL')
  const [selectedMedia, setSelectedMedia] = useState<string[]>([])
  const [expandedMedia, setExpandedMedia] = useState<string[]>([])
  const [productSelectionDialog, setProductSelectionDialog] = useState<{
    open: boolean
    mediaName: string
    selectedProducts: string[]
  }>({ open: false, mediaName: '', selectedProducts: [] })
  const [productSearchQuery, setProductSearchQuery] = useState('')
  const [mediaRatios, setMediaRatios] = useState<{ [key: string]: number }>({})
  const [productRatios, setProductRatios] = useState<{ [mediaKey: string]: { [productKey: string]: number } }>({})
  
  // Step 3 확인 체크박스
  const [isConfirmed, setIsConfirmed] = useState(false)
  
  // 유효성 검사 활성화 상태 (사용자가 입력을 시작했는지)
  const [validationActive, setValidationActive] = useState(false)
  
  // 토스트 알림
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Reach Predictor 매체 설정 관련 state
  const [reachPredictorMedia, setReachPredictorMedia] = useState<ReachPredictorMedia[]>([])
  const [rpMediaSelectionDialog, setRpMediaSelectionDialog] = useState(false)

  // 다크모드 적용
  useEffect(() => {
    setDarkMode(isDarkMode)
  }, [isDarkMode])
  
  // 유효성 검사 활성화 감지 (사용자가 입력을 시작하면 활성화)
  useEffect(() => {
    if (!validationActive) {
      const hasAnyInput = !!(
        formData.scenarioName ||
        formData.description ||
        formData.moduleType ||
        formData.brand ||
        formData.period.start ||
        formData.period.end ||
        formData.targetGrp.length > 0 ||
        formData.totalBudget ||
        formData.simulationUnit ||
        selectedMedia.length > 0
      )
      if (hasAnyInput) {
        setValidationActive(true)
      }
    }
  }, [formData, selectedMedia, validationActive])
  
  // Step 3에 도달하면 자동으로 확인 처리
  useEffect(() => {
    if (currentStep === 3) {
      setIsConfirmed(true)
    }
  }, [currentStep])

  const steps = [
    { number: 1, title: '기본 정보', description: '시나리오 기본 설정' },
    { number: 2, title: '상세 설정', description: '모듈별 특화 설정' },
    { number: 3, title: '검토 및 실행', description: '설정 확인 및 실행' }
  ]

  // 상품 비중 합계 검증
  const getProductRatioValidation = (mediaKey: string) => {
    const total = Object.values(productRatios[mediaKey] || {}).reduce((sum, val) => sum + val, 0)
    const isValid = total === 100
    return {
      total,
      isValid,
      message: isValid ? '✓ 비중 합계가 정확합니다' : `비중 합계가 ${total}%입니다. 100%로 맞춰주세요.`
    }
  }

  // Step 1 유효성 검사
  const isStep1Valid = () => {
    return !!(
      formData.scenarioName &&
      formData.moduleType &&
      formData.brand &&
      formData.industry &&
      formData.period.start &&
      formData.period.end &&
      formData.targetGrp.length > 0
    )
  }

  // Step 2 유효성 검사
  const isStep2Valid = () => {
    // Reach Predictor 유효성 검사
    if (formData.moduleType === 'Reach Predictor') {
      // 최소 1개 이상의 매체 선택
      if (reachPredictorMedia.length === 0) return false
      
      // 모든 매체에 예산 입력 확인
      const allHaveBudget = reachPredictorMedia.every(m => m.budget && parseInt(m.budget) > 0)
      if (!allHaveBudget) return false
      
      // 미연동 매체는 노출 수 필수
      const unlinkedMediaValid = reachPredictorMedia
        .filter(m => m.type === 'unlinked')
        .every(m => m.impressions && parseInt(m.impressions) > 0)
      if (!unlinkedMediaValid) return false
      
      // 리치커브 예산 상한 필수
      if (!formData.reachCurve?.budgetCap || formData.reachCurve.budgetCap <= 0) return false
      
      // 구간별 금액 기준 선택 시 금액 입력 필수
      if (formData.reachCurve?.detailSettings?.criteriaType === 'amount') {
        if (!formData.reachCurve.detailSettings.intervalAmount || formData.reachCurve.detailSettings.intervalAmount <= 0) return false
        
        // 구간 수가 20개 초과하면 안됨
        const min = formData.reachCurve.detailSettings.rangeMin || 0
        const max = formData.reachCurve.detailSettings.rangeMax || 0
        const amount = formData.reachCurve.detailSettings.intervalAmount
        if (min > 0 && max > 0 && max > min) {
          const count = Math.ceil((max - min) / amount)
          if (count > 20) return false
        }
      }
      
      return true
    }
    
    if (formData.moduleType !== 'Ratio Finder') return true
    
    // 총 예산 확인
    if (!formData.totalBudget || formData.totalBudget <= 0) return false
    
    // 시뮬레이션 단위 확인
    if (!formData.simulationUnit) return false
    
    // DIGITAL과 TVC 각각 최소 1개씩 선택 확인
    const digitalMedia = selectedMedia.filter(m => m.startsWith('DIGITAL'))
    const tvcMedia = selectedMedia.filter(m => m.startsWith('TV'))
    if (digitalMedia.length === 0 || tvcMedia.length === 0) return false
    
    // 모든 매체에 상품이 선택되었는지 확인
    const allMediaHaveProducts = selectedMedia.every(mediaKey => {
      const products = productRatios[mediaKey]
      return products && Object.keys(products).length > 0
    })
    if (!allMediaHaveProducts) return false
    
    // 각 매체의 상품 비중 합계가 100%인지 확인
    const allProductRatiosValid = selectedMedia.every(mediaKey => {
      const validation = getProductRatioValidation(mediaKey)
      return validation.isValid
    })
    if (!allProductRatiosValid) return false
    
    // DIGITAL과 TVC 각각 비중 합계가 100%인지 확인
    const digitalTotal = digitalMedia.reduce((sum, mediaKey) => sum + (mediaRatios[mediaKey] || 0), 0)
    const tvcTotal = tvcMedia.reduce((sum, mediaKey) => sum + (mediaRatios[mediaKey] || 0), 0)
    if (digitalTotal !== 100 || tvcTotal !== 100) return false
    
    return true
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 시나리오 생성 로직
      console.log('시나리오 생성:', formData)
      
      // 성공 시
      setShowToast({ 
        type: 'success', 
        message: '시나리오 생성 요청이 완료되었습니다. 완료 시 알림 센터에서 알려드립니다.' 
      })
      
      setTimeout(() => {
        navigate('/reachcaster')
      }, 2000)
      
    } catch (error) {
      // 실패 시
      setShowToast({ 
        type: 'error', 
        message: '시나리오 생성 요청에 실패했습니다. 다시 시도해주세요.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    setDarkModeUtil(newMode)
  }

  return (
    <AppLayout
      currentView="createScenario"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', onClick: () => navigate('/slotboard') },
        { label: slotData?.title || 'Slot', onClick: () => navigate('/reachcaster') },
        { label: '새 시나리오 생성' }
      ]}
      isDarkMode={isDarkMode}
      onToggleDarkMode={handleToggleDarkMode}
      sidebarProps={{
        allSlotsExpanded: allSlotsExpanded,
        expandedFolders: expandedFolders,
        onToggleAllSlots: () => setAllSlotsExpanded(!allSlotsExpanded),
        onToggleFolder: (folderId: string) => {
          setExpandedFolders(prev => 
            prev.includes(folderId) 
              ? prev.filter(id => id !== folderId)
              : [...prev, folderId]
          )
        },
        onNavigateToWorkspace: () => navigate('/slotboard')
      }}
    >
      <div style={{
        padding: '32px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* 페이지 헤더 */}
        <div style={{
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            새 시나리오 생성
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'hsl(var(--muted-foreground))'
          }}>
            단계별로 시나리오 정보를 입력하고 분석을 시작하세요
          </p>
        </div>

        {/* 위자드 레이아웃 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1px 420px',
          gap: '48px',
          alignItems: 'start'
        }}>
          {/* 좌측: 스테퍼 + 입력 폼 */}
          <div>
            {/* 미니멀 스테퍼 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
              gap: '8px'
            }}>
              {steps.map((step, index) => (
                <div key={step.number} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {/* 스텝 표시 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backgroundColor: step.number === currentStep 
                      ? 'hsl(var(--primary))' 
                      : step.number < currentStep
                      ? 'hsl(var(--muted))'
                      : 'transparent',
                    border: step.number > currentStep ? '1px solid hsl(var(--border))' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: step.number === currentStep 
                        ? 'hsl(var(--primary-foreground))' 
                        : step.number < currentStep
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--muted))',
                      color: step.number === currentStep 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--primary-foreground))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {step.number < currentStep ? (
                        <Check size={12} />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: step.number === currentStep 
                        ? 'hsl(var(--primary-foreground))' 
                        : step.number < currentStep
                        ? 'hsl(var(--foreground))'
                        : 'hsl(var(--muted-foreground))'
                    }}>
                      {step.title}
                    </span>
                  </div>
                  
                  {/* 구분선 */}
                  {index < steps.length - 1 && (
                    <div style={{
                      width: '24px',
                      height: '1px',
                      backgroundColor: step.number < currentStep 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--border))',
                      transition: 'all 0.3s'
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* 입력 폼 영역 */}
            <div style={{
              minHeight: '500px'
            }}>
              {/* Step 1: 기본 정보 */}
              {currentStep === 1 && (
                <ScenarioStep1
                  formData={formData}
                  setFormData={setFormData}
                  validationActive={validationActive}
                />
              )}

              {/* Step 2: 상세 설정 */}
              {currentStep === 2 && (
                <>
                  {formData.moduleType === 'Ratio Finder' && (
                    <ScenarioStep2RatioFinder
                      formData={formData}
                      setFormData={setFormData}
                      validationActive={validationActive}
                      selectedMedia={selectedMedia}
                      setSelectedMedia={setSelectedMedia}
                      expandedMedia={expandedMedia}
                      setExpandedMedia={setExpandedMedia}
                      mediaRatios={mediaRatios}
                      setMediaRatios={setMediaRatios}
                      productRatios={productRatios}
                      setProductRatios={setProductRatios}
                      selectedMediaCategory={selectedMediaCategory}
                      setSelectedMediaCategory={setSelectedMediaCategory}
                      productSelectionDialog={productSelectionDialog}
                      setProductSelectionDialog={setProductSelectionDialog}
                      productSearchQuery={productSearchQuery}
                      setProductSearchQuery={setProductSearchQuery}
                    />
                  )}

                  {formData.moduleType === 'Reach Predictor' && (
                    <ScenarioStep2ReachPredictor
                      reachPredictorMedia={reachPredictorMedia}
                      setReachPredictorMedia={setReachPredictorMedia}
                      onOpenMediaDialog={() => setRpMediaSelectionDialog(true)}
                      validationActive={validationActive}
                      targetGrp={formData.targetGrp}
                      period={formData.period}
                      onUpdateGlobalSettings={(settings) => {
                        setFormData({
                          ...formData,
                          targetGrp: settings.targetGrp || formData.targetGrp,
                          period: settings.period || formData.period
                        })
                      }}
                      reachCurve={formData.reachCurve}
                      onUpdateReachCurve={(reachCurve) => {
                        setFormData({
                          ...formData,
                          reachCurve
                        })
                      }}
                    />
                  )}
                </>
              )}

              {/* Step 3: 검토 및 실행 */}
              {currentStep === 3 && (
                <div style={{ width: '800px' }}>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '24px'
                  }}>
                    검토 및 실행
                  </h2>
                  
                  {/* 안내 메시지 */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: 'hsl(var(--muted) / 0.5)',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    marginBottom: '32px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      color: 'hsl(var(--foreground))',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Clock size={18} />
                      시나리오 생성 소요 시간 안내
                    </div>
                    
                    {/* 분석 모듈별 메시지 */}
                    {formData.moduleType === 'Ratio Finder' && (
                      <>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          marginBottom: '8px',
                          color: 'hsl(var(--foreground))'
                        }}>
                          "TVC와 Digital의 최적 예산 비중을 탐색합니다."
                        </div>
                        <div style={{
                          fontSize: '13px',
                          lineHeight: '1.6',
                          color: 'hsl(var(--muted-foreground))'
                        }}>
                          AI 알고리즘이 수만 개의 조합을 시뮬레이션하여 데이터 기반의 최적 배분안을 도출합니다.<br />
                          정밀 연산을 위해 <strong style={{ color: 'hsl(var(--foreground))' }}>최대 20분</strong>이 소요될 수 있으며, 완료 시 상단 <strong style={{ color: 'hsl(var(--foreground))' }}>알림 센터</strong>에서 알려드립니다.
                        </div>
                      </>
                    )}
                    
                    {formData.moduleType === 'Reach Predictor' && (
                      <>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          marginBottom: '8px',
                          color: 'hsl(var(--foreground))'
                        }}>
                          "매체 믹스에 따른 통합 광고 성과를 정밀하게 예측합니다."
                        </div>
                        <div style={{
                          fontSize: '13px',
                          lineHeight: '1.6',
                          color: 'hsl(var(--muted-foreground))'
                        }}>
                          방대한 과거 집행 데이터를 분석하여 예상 도달률(Reach) 및 주요 지표를 계산합니다.<br />
                          결과 도출까지 <strong style={{ color: 'hsl(var(--foreground))' }}>최대 20분</strong>이 소요되며, 완료 시 <strong style={{ color: 'hsl(var(--foreground))' }}>알림 센터</strong>에서 알려드립니다.
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* 확인 메시지 */}
                  <div style={{
                    padding: '16px 20px',
                    backgroundColor: 'hsl(var(--muted) / 0.3)',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'hsl(var(--foreground))',
                      lineHeight: '1.5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Check size={16} />
                      우측 Configuration Summary에서 설정 내용을 확인하세요!
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 네비게이션 버튼 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '24px'
            }}>
              <button
                onClick={() => navigate('/reachcaster')}
                className="btn btn-ghost btn-lg"
              >
                취소
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                {currentStep > 1 && (
                  <button
                    onClick={handlePrev}
                    className="btn btn-secondary btn-lg"
                  >
                    <ChevronLeft size={20} />
                    이전
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="btn btn-primary btn-lg"
                    disabled={currentStep === 1 ? !isStep1Valid() : !isStep2Valid()}
                    style={{
                      opacity: (currentStep === 1 ? !isStep1Valid() : !isStep2Valid()) ? 0.5 : 1,
                      cursor: (currentStep === 1 ? !isStep1Valid() : !isStep2Valid()) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    다음
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg"
                    style={{
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? '생성 요청 중...' : '시나리오 생성 요청'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 중앙: 세로 구분선 */}
          <div style={{
            width: '1px',
            backgroundColor: 'hsl(var(--border))',
            alignSelf: 'stretch',
            minHeight: '600px'
          }} />

          {/* 우측: 실시간 요약 */}
          <div style={{
            position: 'sticky',
            top: '24px'
          }}>
            <div style={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid hsl(var(--border))'
              }}>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'hsl(var(--muted-foreground))'
                }}>
                  Configuration Summary
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Step 1: 기본 정보 */}
                <div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: 'hsl(var(--muted-foreground))',
                    marginBottom: '12px'
                  }}>
                    Step 1 · Basic Information
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        시나리오명
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: formData.scenarioName ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                        textAlign: 'right',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {formData.scenarioName || '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        분석 모듈
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: formData.moduleType ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.moduleType || '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        브랜드
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: formData.brand ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.brand || '—'}
                      </span>
                    </div>

                    {formData.industry && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                          업종
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                          {formData.industry}
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        캠페인 기간
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: (formData.period.start || formData.period.end) ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.period.start || '—'} → {formData.period.end || '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        타겟 GRP
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: formData.targetGrp.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.targetGrp.length === 24 
                          ? '전체' 
                          : formData.targetGrp.length > 0 
                          ? `${formData.targetGrp.length}개` 
                          : '—'}
                      </span>
                    </div>
                    {formData.targetGrp.length > 0 && (
                      <div style={{
                        marginTop: '8px',
                        padding: '8px',
                        backgroundColor: 'hsl(var(--muted) / 0.3)',
                        borderRadius: '6px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                        maxHeight: '120px',
                        overflowY: 'auto'
                      }}>
                        {formData.targetGrp.length === 24 ? (
                          <div style={{
                            fontSize: '10px',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'hsl(var(--primary) / 0.1)',
                            color: 'hsl(var(--primary))',
                            fontWeight: '500'
                          }}>
                            전체
                          </div>
                        ) : (
                          formData.targetGrp.map((target, idx) => (
                            <div
                              key={idx}
                              style={{
                                fontSize: '10px',
                                padding: '3px 6px',
                                borderRadius: '4px',
                                backgroundColor: 'hsl(var(--muted))',
                                color: 'hsl(var(--foreground))',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {target}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 구분선 */}
                <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />

                {/* Step 2: 상세 설정 */}
                <div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: currentStep >= 2 ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground) / 0.5)',
                    marginBottom: '12px'
                  }}>
                    Step 2 · Module Configuration
                  </div>
                  
                  {formData.moduleType === 'Ratio Finder' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* 총 예산 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                          총 예산
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          fontWeight: '500',
                          color: formData.totalBudget ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                        }}>
                          {formData.totalBudget ? `${formData.totalBudget.toLocaleString('ko-KR')}천원` : '—'}
                        </span>
                      </div>
                      
                      {/* 시뮬레이션 단위 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                          시뮬레이션 단위
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          fontWeight: '500',
                          color: formData.simulationUnit ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                        }}>
                          {formData.simulationUnit || '—'}
                        </span>
                      </div>
                      
                      {/* 매체별 예산 배분 */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                            매체별 예산 배분
                          </span>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '500',
                            color: selectedMedia.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                          }}>
                            {selectedMedia.length > 0 ? `${selectedMedia.length}개 매체` : '—'}
                          </span>
                        </div>
                        {selectedMedia.length > 0 && (
                          <div style={{
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: 'hsl(var(--muted) / 0.3)',
                            borderRadius: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            maxHeight: '200px',
                            overflowY: 'auto'
                          }}>
                            {selectedMedia.map((mediaKey, idx) => {
                              const [, ...mediaNameParts] = mediaKey.split('_')
                              const mediaName = mediaNameParts.join('_')
                              const mediaRatio = mediaRatios[mediaKey] || 0
                              const products = productRatios[mediaKey] || {}
                              
                              return (
                                <div key={idx} style={{ fontSize: '11px' }}>
                                  {/* 매체명 + 비율 */}
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '4px'
                                  }}>
                                    <span style={{ fontWeight: '600', color: 'hsl(var(--foreground))' }}>
                                      {mediaName}
                                    </span>
                                    <span style={{ 
                                      fontSize: '10px',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                                      color: 'hsl(var(--primary))',
                                      fontWeight: '600'
                                    }}>
                                      {mediaRatio}%
                                    </span>
                                  </div>
                                  
                                  {/* 상품 목록 */}
                                  {Object.keys(products).length > 0 && (
                                    <div style={{ 
                                      paddingLeft: '12px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '2px'
                                    }}>
                                      {Object.entries(products).map(([productName, ratio], pIdx) => (
                                        <div 
                                          key={pIdx}
                                          style={{ 
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '10px'
                                          }}
                                        >
                                          <span style={{ color: 'hsl(var(--muted-foreground))' }}>
                                            › {productName}
                                          </span>
                                          <span style={{ 
                                            color: 'hsl(var(--muted-foreground))',
                                            fontWeight: '500'
                                          }}>
                                            {ratio}%
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {formData.moduleType === 'Reach Predictor' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* 분석 대상 매체 */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                            분석 대상 매체
                          </span>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '500',
                            color: reachPredictorMedia.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                          }}>
                            {reachPredictorMedia.length > 0 ? `${reachPredictorMedia.length}개 매체` : '—'}
                          </span>
                        </div>
                        {reachPredictorMedia.length > 0 && (
                          <div style={{
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: 'hsl(var(--muted) / 0.3)',
                            borderRadius: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            maxHeight: '200px',
                            overflowY: 'auto'
                          }}>
                            {reachPredictorMedia.map((media, idx) => (
                              <div
                                key={idx}
                                style={{
                                  fontSize: '11px',
                                  color: 'hsl(var(--foreground))',
                                  lineHeight: '1.4'
                                }}
                              >
                                <span style={{ fontWeight: '500' }}>{media.mediaName}</span>
                                {media.productName && (
                                  <>
                                    <span style={{ 
                                      margin: '0 4px',
                                      color: 'hsl(var(--muted-foreground))'
                                    }}>›</span>
                                    <span style={{ color: 'hsl(var(--muted-foreground))' }}>
                                      {media.productName}
                                    </span>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* 리치커브 */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                            리치커브
                          </span>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '500',
                            color: formData.reachCurve?.budgetCap ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                          }}>
                            {formData.reachCurve?.budgetCap ? '설정됨' : '—'}
                          </span>
                        </div>
                        {formData.reachCurve?.budgetCap && (
                          <div style={{
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: 'hsl(var(--muted) / 0.3)',
                            borderRadius: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                          }}>
                            <div style={{
                              fontSize: '11px',
                              color: 'hsl(var(--foreground))',
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}>
                              <span style={{ color: 'hsl(var(--muted-foreground))' }}>예산 상한</span>
                              <span style={{ fontWeight: '500' }}>
                                {formData.reachCurve.budgetCap.toLocaleString('ko-KR')} 원
                              </span>
                            </div>
                            {formData.reachCurve.detailSettings && (
                              <>
                                {(formData.reachCurve.detailSettings.rangeMin || formData.reachCurve.detailSettings.rangeMax) && (
                                  <div style={{
                                    fontSize: '11px',
                                    color: 'hsl(var(--foreground))',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                  }}>
                                    <span style={{ color: 'hsl(var(--muted-foreground))' }}>구간</span>
                                    <span style={{ fontWeight: '500' }}>
                                      {formData.reachCurve.detailSettings.rangeMin?.toLocaleString('ko-KR') || '—'} ~ {formData.reachCurve.detailSettings.rangeMax?.toLocaleString('ko-KR') || '—'} 원
                                    </span>
                                  </div>
                                )}
                                {formData.reachCurve.detailSettings.criteriaType === 'count' && formData.reachCurve.detailSettings.intervalCount && (
                                  <div style={{
                                    fontSize: '11px',
                                    color: 'hsl(var(--foreground))',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                  }}>
                                    <span style={{ color: 'hsl(var(--muted-foreground))' }}>구간 수</span>
                                    <span style={{ fontWeight: '500' }}>
                                      {formData.reachCurve.detailSettings.intervalCount}개
                                    </span>
                                  </div>
                                )}
                                {formData.reachCurve.detailSettings.criteriaType === 'amount' && formData.reachCurve.detailSettings.intervalAmount && (
                                  <div style={{
                                    fontSize: '11px',
                                    color: 'hsl(var(--foreground))',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                  }}>
                                    <span style={{ color: 'hsl(var(--muted-foreground))' }}>구간별 금액</span>
                                    <span style={{ fontWeight: '500' }}>
                                      {formData.reachCurve.detailSettings.intervalAmount.toLocaleString('ko-KR')} 원
                                    </span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {!formData.moduleType && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: 'hsl(var(--muted-foreground))',
                      fontStyle: 'italic'
                    }}>
                      Pending
                    </div>
                  )}
                </div>

                {/* 구분선 */}
                <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />

                {/* Step 3: 검토 및 실행 */}
                <div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: currentStep >= 3 ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground) / 0.5)',
                    marginBottom: '12px'
                  }}>
                    Step 3 · Review & Execute
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        검토
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: currentStep >= 3 && isConfirmed ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {currentStep >= 3 ? (isConfirmed ? '확인 완료' : '미확인') : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* 매체 선택 다이얼로그 */}
      <ReachPredictorMediaDialog
        open={rpMediaSelectionDialog}
        onClose={() => setRpMediaSelectionDialog(false)}
        onConfirm={(mediaItems) => {
          setReachPredictorMedia([...reachPredictorMedia, ...mediaItems])
          setRpMediaSelectionDialog(false)
        }}
      />
      
      {/* 토스트 알림 */}
      {showToast && (
        <div className={`toast ${showToast.type === 'success' ? 'toast--success' : 'toast--error'}`}>
          <div className="toast__icon">
            {showToast.type === 'success' ? (
              <CheckCircle size={20} style={{ color: 'hsl(142.1 76.2% 36.3%)' }} />
            ) : (
              <AlertCircle size={20} style={{ color: 'hsl(var(--destructive))' }} />
            )}
          </div>
          <div className="toast__content">
            <p className="toast__title">
              {showToast.type === 'success' ? '성공' : '오류'}
            </p>
            <p className="toast__description">
              {showToast.message}
            </p>
          </div>
          <button
            onClick={() => setShowToast(null)}
            className="toast__close"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </AppLayout>
  )
}