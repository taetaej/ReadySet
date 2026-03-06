import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'

interface CreateDatasetProps {
  slotData?: any
}

export function CreateDataset({ slotData }: CreateDatasetProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  
  const [formData, setFormData] = useState({
    datasetName: '',
    description: '',
    media: [] as string[],
    industries: [] as string[],
    period: { start: '', end: '' },
    products: [] as string[],
    metrics: [] as string[],
    targetingOptions: [] as string[]
  })
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [validationActive, setValidationActive] = useState(false)
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setDarkModeUtil(isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    if (!validationActive) {
      const hasAnyInput = !!(
        formData.datasetName ||
        formData.description ||
        formData.media.length > 0 ||
        formData.industries.length > 0 ||
        formData.period.start ||
        formData.period.end
      )
      if (hasAnyInput) {
        setValidationActive(true)
      }
    }
  }, [formData, validationActive])

  const steps = [
    { number: 1, title: '조회조건 설정', description: '데이터 추출 조건' },
    { number: 2, title: '샘플 데이터 확인', description: '추출 데이터 미리보기' }
  ]

  const isStep1Valid = () => {
    return !!(
      formData.datasetName &&
      formData.media.length > 0 &&
      formData.industries.length > 0 &&
      formData.period.start &&
      formData.period.end &&
      formData.products.length > 0 &&
      formData.metrics.length > 0
    )
  }

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid()) {
      setShowToast({ type: 'error', message: '필수 항목을 모두 입력해주세요.' })
      return
    }
    if (currentStep < 2) {
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowToast({ type: 'success', message: '데이터 추출이 시작되었습니다.' })
      setTimeout(() => {
        navigate('/datashot')
      }, 2000)
    } catch (error) {
      setShowToast({ type: 'error', message: '데이터 추출 실행에 실패했습니다.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppLayout
      currentView="createDataset"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', href: '/slotboard' },
        { label: slotData?.title || '삼성 갤럭시 S24 캠페인' },
        { label: 'DataShot', href: '/datashot' },
        { label: '새 데이터셋 생성' }
      ]}
      isDarkMode={isDarkMode}
      onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      sidebarProps={{
        isCollapsed: isSidebarCollapsed,
        expandedFolders,
        onToggleSidebar: () => setIsSidebarCollapsed(!isSidebarCollapsed),
        onToggleFolder: (id: string) => {
          setExpandedFolders(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
          )
        },
        onNavigateToWorkspace: () => navigate('/slotboard')
      }}
    >
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            새 데이터셋 생성
          </h1>
          <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
            조회조건을 선택하여 원하는 데이터를 추출하세요.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 420px', gap: '48px', alignItems: 'start' }}>
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
            <div style={{ minHeight: '500px' }}>
              {currentStep === 1 && (
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
                    조회조건 설정
                  </h2>
                  <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))', marginBottom: '32px' }}>
                    데이터 추출을 위한 조건을 설정하세요.
                  </p>
                  {/* TODO: Step 1 폼 구현 */}
                  <div style={{ padding: '20px', backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                      조회조건 설정 폼 (구현 예정)
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
                    샘플 데이터 확인
                  </h2>
                  <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))', marginBottom: '32px' }}>
                    추출될 데이터의 샘플을 확인하세요.
                  </p>
                  {/* TODO: Step 2 샘플 데이터 테이블 구현 */}
                  <div style={{ padding: '20px', backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                      샘플 데이터 테이블 (구현 예정)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 네비게이션 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button onClick={() => navigate('/datashot')} className="btn btn-ghost btn-lg">
                취소
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                {currentStep > 1 && (
                  <button onClick={handlePrev} className="btn btn-secondary btn-lg">
                    <ChevronLeft size={20} />
                    이전
                  </button>
                )}
                {currentStep < 2 ? (
                  <button onClick={handleNext} className="btn btn-primary btn-lg">
                    다음
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary btn-lg">
                    {isSubmitting ? '추출 중...' : '데이터 추출 시작'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 중앙: 세로 구분선 */}
          <div style={{ width: '1px', backgroundColor: 'hsl(var(--border))', alignSelf: 'stretch', minHeight: '600px' }} />

          {/* 우측: Configuration Summary */}
          <div style={{ position: 'sticky', top: '24px' }}>
            <div style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '24px' }}>
              <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid hsl(var(--border))' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'hsl(var(--muted-foreground))' }}>
                  Configuration Summary
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Step 1: 조회조건 */}
                <div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: 'hsl(var(--muted-foreground))',
                    marginBottom: '12px'
                  }}>
                    Step 1 · 조회조건 설정
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        데이터셋명
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: formData.datasetName ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                        textAlign: 'right',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {formData.datasetName || '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        매체
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: formData.media.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.media.length > 0 ? `${formData.media.length}개` : '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        업종
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: formData.industries.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.industries.length > 0 ? `${formData.industries.length}개` : '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        조회기간
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
                        광고상품
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: formData.products.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.products.length > 0 ? `${formData.products.length}개` : '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        지표
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: formData.metrics.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.metrics.length > 0 ? `${formData.metrics.length}개` : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 구분선 */}
                {currentStep === 2 && (
                  <>
                    <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />
                    
                    {/* Step 2: 샘플 데이터 */}
                    <div>
                      <div style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        color: 'hsl(var(--muted-foreground))',
                        marginBottom: '12px'
                      }}>
                        Step 2 · 샘플 데이터
                      </div>
                      <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        샘플 데이터 확인 완료 시<br />추출을 시작할 수 있습니다.
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 토스트 알림 */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '16px 24px',
          borderRadius: '8px',
          backgroundColor: showToast.type === 'success' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))',
          color: showToast.type === 'success' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--destructive-foreground))',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          zIndex: 9999
        }}>
          {showToast.message}
        </div>
      )}
    </AppLayout>
  )
}
