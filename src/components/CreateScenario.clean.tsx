import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, X, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { AppLayout } from './layout/AppLayout'
import { 
  ScenarioStep1,
  ScenarioStep2ReachPredictor,
  ReachPredictorMediaDialog,
  type ScenarioFormData,
  type ReachPredictorMedia,
  numberToKorean
} from './scenario'

interface CreateScenarioProps {
  slotData?: any
}

export function CreateScenario({ slotData }: CreateScenarioProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })
  
  // Form Data
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
  
  // Reach Predictor State
  const [reachPredictorMedia, setReachPredictorMedia] = useState<ReachPredictorMedia[]>([])
  const [rpMediaSelectionDialog, setRpMediaSelectionDialog] = useState(false)
  
  // UI State
  const [validationActive, setValidationActive] = useState(false)
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 다크모드 적용
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])
  
  // 유효성 검사 활성화 감지
  useEffect(() => {
    if (!validationActive) {
      const hasAnyInput = !!(
        formData.scenarioName ||
        formData.description ||
        formData.moduleType ||
        formData.brand ||
        formData.period.start ||
        formData.period.end ||
        formData.targetGrp.length > 0
      )
      if (hasAnyInput) {
        setValidationActive(true)
      }
    }
  }, [formData, validationActive])

  const steps = [
    { number: 1, title: '기본 정보', description: '시나리오 기본 설정' },
    { number: 2, title: '상세 설정', description: '모듈별 특화 설정' },
    { number: 3, title: '검토 및 실행', description: '설정 확인 및 실행' }
  ]

  // Step 1 유효성 검사
  const isStep1Valid = () => {
    return !!(
      formData.scenarioName &&
      formData.description &&
      formData.moduleType &&
      formData.brand &&
      formData.period.start &&
      formData.period.end &&
      formData.targetGrp.length > 0
    )
  }

  // Step 2 유효성 검사
  const isStep2Valid = () => {
    if (formData.moduleType === 'Reach Predictor') {
      if (reachPredictorMedia.length === 0) return false
      
      for (const media of reachPredictorMedia) {
        if (!media.budget) return false
        if (media.type === 'unlinked' && !media.impressions) return false
      }
      
      return true
    }
    // Ratio Finder는 나중에 구현
    return false
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
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setShowToast({
        type: 'success',
        message: '시나리오가 성공적으로 생성되었습니다.'
      })
      
      setTimeout(() => {
        navigate('/reachcaster')
      }, 2000)
    } catch (error) {
      setShowToast({
        type: 'error',
        message: '시나리오 생성에 실패했습니다.'
      })
      setIsSubmitting(false)
    }
  }

  // 토스트 자동 닫기
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  return (
    <AppLayout>
      <div style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))'
      }}>
        {/* 좌측: 입력 폼 */}
        <div style={{
          flex: 1,
          padding: '40px',
          overflowY: 'auto'
        }}>
          {/* 헤더 */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              시나리오 생성
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'hsl(var(--muted-foreground))'
            }}>
              새로운 분석 시나리오를 생성합니다
            </p>
          </div>

          {/* 스텝 인디케이터 */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '40px'
          }}>
            {steps.map((step, index) => (
              <div
                key={step.number}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: currentStep >= step.number ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                  color: currentStep >= step.number ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                  transition: 'all 0.2s'
                }}>
                  {currentStep > step.number ? <Check size={16} /> : step.number}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: currentStep >= step.number ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: 'hsl(var(--muted-foreground))'
                  }}>
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: currentStep > step.number ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                    transition: 'all 0.2s'
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* 입력 폼 영역 */}
          <div style={{ minHeight: '500px' }}>
            {/* Step 1: 기본 정보 */}
            {currentStep === 1 && (
              <ScenarioStep1
                formData={formData}
                setFormData={setFormData}
                validationActive={validationActive}
              />
            )}

            {/* Step 2: 상세 설정 - Reach Predictor */}
            {currentStep === 2 && formData.moduleType === 'Reach Predictor' && (
              <ScenarioStep2ReachPredictor
                reachPredictorMedia={reachPredictorMedia}
                setReachPredictorMedia={setReachPredictorMedia}
                onOpenMediaDialog={() => setRpMediaSelectionDialog(true)}
                validationActive={validationActive}
              />
            )}

            {/* Step 2: 상세 설정 - Ratio Finder */}
            {currentStep === 2 && formData.moduleType === 'Ratio Finder' && (
              <div style={{ width: '800px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '24px'
                }}>
                  상세 설정 - Ratio Finder
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: 'hsl(var(--muted-foreground))'
                }}>
                  Ratio Finder Step 2 구현 예정
                </p>
              </div>
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

                {/* 소요 시간 안내 */}
                <div style={{
                  padding: '16px',
                  backgroundColor: 'hsl(var(--muted) / 0.5)',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  border: '1px solid hsl(var(--border))'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <Clock size={20} style={{ color: 'hsl(var(--primary))', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}>
                        예상 소요 시간
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: 'hsl(var(--muted-foreground))',
                        lineHeight: '1.6'
                      }}>
                        {formData.moduleType === 'Ratio Finder' 
                          ? '시뮬레이션 분석은 약 5-10분 정도 소요됩니다.'
                          : 'Reach Predictor 분석은 약 10-15분 정도 소요됩니다.'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 확인 메시지 */}
                <div style={{
                  padding: '16px',
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--primary) / 0.3)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Check size={16} style={{ color: 'hsl(var(--primary))' }} />
                    <span style={{ fontSize: '13px' }}>
                      우측 Configuration Summary에서 설정 내용을 확인하세요!
                    </span>
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

        {/* 우측: Configuration Summary */}
        <div style={{
          width: '400px',
          padding: '40px 32px',
          overflowY: 'auto',
          backgroundColor: 'hsl(var(--muted) / 0.3)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            Configuration Summary
          </h3>

          {/* 기본 정보 */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '12px',
              color: 'hsl(var(--muted-foreground))'
            }}>
              기본 정보
            </div>
            <div style={{
              fontSize: '13px',
              lineHeight: '1.8',
              color: 'hsl(var(--foreground))'
            }}>
              <div><strong>시나리오명:</strong> {formData.scenarioName || '-'}</div>
              <div><strong>설명:</strong> {formData.description || '-'}</div>
              <div><strong>분석 모듈:</strong> {formData.moduleType || '-'}</div>
              <div><strong>브랜드:</strong> {formData.brand || '-'}</div>
              <div><strong>산업:</strong> {formData.industry || '-'}</div>
              <div><strong>기간:</strong> {formData.period.start && formData.period.end ? `${formData.period.start} ~ ${formData.period.end}` : '-'}</div>
              <div><strong>타겟 GRP:</strong> {formData.targetGrp.length > 0 ? `${formData.targetGrp.length}개 선택` : '-'}</div>
            </div>
          </div>

          {/* Reach Predictor 상세 */}
          {formData.moduleType === 'Reach Predictor' && reachPredictorMedia.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '12px',
                color: 'hsl(var(--muted-foreground))'
              }}>
                매체 설정
              </div>
              <div style={{
                fontSize: '13px',
                lineHeight: '1.8',
                color: 'hsl(var(--foreground))'
              }}>
                <div><strong>총 매체 수:</strong> {reachPredictorMedia.length}개</div>
                <div><strong>총 예산:</strong> {numberToKorean(reachPredictorMedia.reduce((sum, m) => sum + (parseInt(m.budget) || 0), 0) * 1000)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reach Predictor 매체 선택 다이얼로그 */}
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
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          minWidth: '320px',
          padding: '16px',
          backgroundColor: 'hsl(var(--background))',
          border: `1px solid ${showToast.type === 'success' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}`,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {showToast.type === 'success' ? (
            <CheckCircle size={20} style={{ color: 'hsl(var(--primary))' }} />
          ) : (
            <AlertCircle size={20} style={{ color: 'hsl(var(--destructive))' }} />
          )}
          <span style={{ fontSize: '14px' }}>{showToast.message}</span>
          <button
            onClick={() => setShowToast(null)}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </AppLayout>
  )
}
