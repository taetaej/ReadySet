import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { ConfigurationSummary } from './ConfigurationSummary'
import { SampleDataModal } from './SampleDataModal'
import { CreateDatasetStep1 } from './CreateDatasetStep1'
import { CreateDatasetStep2 } from './CreateDatasetStep2'
import { CreateDatasetStep3 } from './CreateDatasetStep3'
import { FormData, initialFormData, validateDateRange } from './createDatasetTypes'

interface CreateDatasetProps {
  slotData?: any
}

export function CreateDataset({ slotData }: CreateDatasetProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()

  const [formData, setFormData] = useState<FormData>(initialFormData)

  // 스텝별 유효성 검사 활성화 상태
  const [validationStep1, setValidationStep1] = useState(false)
  const [validationStep2, setValidationStep2] = useState(false)

  // 스텝1: 뭐라도 입력/선택되면 유효성 활성화
  useEffect(() => {
    if (!validationStep1) {
      const hasAnyInput = !!(
        formData.datasetName ||
        formData.description ||
        formData.period.startYear ||
        formData.period.startMonth ||
        formData.industries.length > 0
      )
      if (hasAnyInput) setValidationStep1(true)
    }
  }, [formData, validationStep1])

  // 스텝2: 뭐라도 입력/선택되면 유효성 활성화
  useEffect(() => {
    if (!validationStep2) {
      const hasAnyInput = !!(
        formData.media ||
        formData.products.length > 0 ||
        formData.metrics.length > 0 ||
        formData.targetingCategory ||
        formData.targetingOptions.length > 0
      )
      if (hasAnyInput) setValidationStep2(true)
    }
  }, [formData, validationStep2])

  const [industryDialogOpen, setIndustryDialogOpen] = useState(false)
  const [showSampleDataModal, setShowSampleDataModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => { setDarkModeUtil(isDarkMode) }, [isDarkMode])

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(null), 5000)
      return () => clearTimeout(t)
    }
  }, [showToast])

  const steps = [
    { number: 1, title: '기본 정보', description: '데이터셋명 · 기간 · 업종' },
    { number: 2, title: '상세 설정', description: '매체 · 광고분류 · 지표' },
    { number: 3, title: '검토 및 추출', description: '샘플 데이터 확인' },
  ]

  const dateValidation = validateDateRange(formData, validationStep1)

  const isStep1Valid = () =>
    !!(
      formData.datasetName.trim() &&
      formData.period.startYear &&
      formData.period.startMonth &&
      formData.period.endYear &&
      formData.period.endMonth &&
      dateValidation.valid &&
      formData.industries.length > 0 &&
      formData.industryLevel
    )

  const isStep2Valid = () => {
    const isTargetingValid = !formData.targetingCategory || formData.targetingOptions.length > 0
    return !!(formData.media && formData.products.length > 0 && formData.metrics.length > 0 && isTargetingValid)
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!isStep1Valid()) { setValidationStep1(true); return }
    }
    if (currentStep === 2) {
      if (!isStep2Valid()) { setValidationStep2(true); return }
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('데이터셋 생성:', formData)
      setShowToast({ type: 'success', message: '데이터셋 생성 요청이 완료되었습니다. 데이터셋 목록에서 확인해주세요.' })
      setTimeout(() => navigate('/datashot'), 2000)
    } catch {
      setShowToast({ type: 'error', message: '데이터셋 생성 요청에 실패했습니다. 다시 시도해주세요.' })
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
        onToggleSidebar: toggleSidebar,
        onToggleFolder: toggleFolder,
        onNavigateToWorkspace: () => navigate('/slotboard')
      }}
    >
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* 페이지 헤더 */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>새 데이터셋 생성</h1>
          <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
            조회조건을 선택하여 원하는 데이터를 추출하세요.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '800px 1px 420px', gap: '48px', alignItems: 'start' }}>
          {/* 좌측: 스테퍼 + 폼 */}
          <div>
            {/* 스테퍼 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '8px' }}>
              {steps.map((step, index) => (
                <div key={step.number} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 16px', borderRadius: '20px',
                    backgroundColor: step.number === currentStep
                      ? 'hsl(var(--primary))'
                      : step.number < currentStep
                      ? 'hsl(var(--muted))'
                      : 'transparent',
                    border: step.number > currentStep ? '1px solid hsl(var(--border))' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      backgroundColor: step.number === currentStep
                        ? 'hsl(var(--primary-foreground))'
                        : step.number < currentStep
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--muted))',
                      color: step.number === currentStep
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--primary-foreground))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: '600'
                    }}>
                      {step.number < currentStep ? <Check size={12} /> : step.number}
                    </div>
                    <span style={{
                      fontSize: '13px', fontWeight: '500',
                      color: step.number === currentStep
                        ? 'hsl(var(--primary-foreground))'
                        : step.number < currentStep
                        ? 'hsl(var(--foreground))'
                        : 'hsl(var(--muted-foreground))'
                    }}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div style={{
                      width: '24px', height: '1px',
                      backgroundColor: step.number < currentStep ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                      transition: 'all 0.3s'
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* 스텝 컨텐츠 */}
            <div style={{ minHeight: '500px' }}>
              {currentStep === 1 && (
                <CreateDatasetStep1
                  formData={formData}
                  setFormData={setFormData}
                  validationActive={validationStep1}
                  industryDialogOpen={industryDialogOpen}
                  setIndustryDialogOpen={setIndustryDialogOpen}
                />
              )}
              {currentStep === 2 && (
                <CreateDatasetStep2
                  formData={formData}
                  setFormData={setFormData}
                  validationActive={validationStep2}
                />
              )}
              {currentStep === 3 && (
                <CreateDatasetStep3
                  formData={formData}
                  onShowSampleData={() => setShowSampleDataModal(true)}
                />
              )}
            </div>

            {/* 네비게이션 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button
                onClick={() => navigate('/datashot')}
                className="btn btn-ghost btn-lg"
              >
                취소
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                {currentStep > 1 && (
                  <button
                    onClick={handlePrev}
                    className="btn btn-secondary btn-lg"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ChevronLeft size={20} />
                    이전
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    disabled={currentStep === 1 ? !isStep1Valid() : !isStep2Valid()}
                    className="btn btn-primary btn-lg"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: (currentStep === 1 ? !isStep1Valid() : !isStep2Valid()) ? 0.5 : 1, cursor: (currentStep === 1 ? !isStep1Valid() : !isStep2Valid()) ? 'not-allowed' : 'pointer' }}
                  >
                    다음
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg"
                    style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                  >
                    {isSubmitting ? '생성 중...' : '데이터셋 생성 요청'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div style={{ width: '1px', backgroundColor: 'hsl(var(--border))', alignSelf: 'stretch' }} />

          {/* 우측: Configuration Summary */}
          <ConfigurationSummary
            formData={formData}
            currentStep={currentStep}
          />
        </div>
      </div>

      {/* 샘플 데이터 모달 */}
      <SampleDataModal
        isOpen={showSampleDataModal}
        onClose={() => setShowSampleDataModal(false)}
        formData={formData}
      />

      {/* 토스트 */}
      {showToast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '16px 20px', borderRadius: '8px', maxWidth: '400px',
          backgroundColor: showToast.type === 'success' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))',
          color: 'hsl(var(--primary-foreground))',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {showToast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: '14px', flex: 1 }}>{showToast.message}</span>
          <button onClick={() => setShowToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
            <X size={16} />
          </button>
        </div>
      )}
    </AppLayout>
  )
}
