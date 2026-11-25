import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { Check, CheckCircle, AlertCircle, X, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ACStep1 } from './ACStep1'
import { ACStep2 } from './ACStep2'
import { ACConfigSummary } from './ACConfigSummary'
import { ACAnalysis, ACCreateFormData, ACCreatePrefill, ACDatasetPrefill, PURPOSE_ORDER } from './types'
import { analyzeContext, applyFills } from './acConditions'
import { AC_CREATE_SLOT, AC_SAMPLE_BRIEF_TEXT } from './sampleData'

/** 맥락 분석 모의 지연 */
const ANALYZE_MS = 1800

const STEPS = [
  { number: 1, title: '기본 정보' },
  { number: 2, title: '상세 설정' },
  { number: 3, title: '검토 및 실행' }
]

/** 진입 시점의 값: 기본값 + 복제 프리필 (정의서 6.3 이탈 방지의 비교 기준) */
const buildInitialForm = (isSharedSlot: boolean, prefill?: ACCreatePrefill, datasetPrefill?: ACDatasetPrefill): ACCreateFormData => datasetPrefill ? ({
  // DataShot 데이터셋 유입: 업종 직접 선택 + 기간 프리필 허용
  name: datasetPrefill.name.trim().slice(0, 50),
  description: '',
  contextFile: null,
  industryMode: 'direct',
  brand: '',
  industry: datasetPrefill.industry,
  period: { ...datasetPrefill.period },
  purposes: PURPOSE_ORDER.filter(p => datasetPrefill.purposes.includes(p)),
  promotionIncluded: isSharedSlot || datasetPrefill.slotShared ? false : datasetPrefill.promotionIncluded,
  conditions: [],
  traits: [],
  excludes: {}
}) : ({
  name: (prefill?.name ?? '').slice(0, 50),
  description: prefill?.description ?? '',
  contextFile: null,
  industryMode: prefill?.industryMode ?? 'brand',
  brand: prefill?.brand ?? '',
  industry: prefill?.industry ?? '',
  period: { start: '', end: '' },
  purposes: prefill?.purposes ?? [],
  promotionIncluded: isSharedSlot ? false : (prefill?.promotionIncluded ?? true),
  conditions: [],
  traits: [],
  excludes: {}
})

export function ACCreateCuration() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()
  const [isDarkMode, setIsDarkModeState] = useState(() => getDarkMode())

  // 예시: `?slot=shared`로 Shared Slot 동작 확인
  const navState = location.state as { prefill?: ACCreatePrefill; datasetPrefill?: ACDatasetPrefill } | null
  const prefill = navState?.prefill
  const datasetPrefill = navState?.datasetPrefill?.source === 'dataset' ? navState.datasetPrefill : undefined
  const isSharedSlot = searchParams.get('slot') === 'shared' || AC_CREATE_SLOT.visibility === 'Shared' || !!datasetPrefill?.slotShared

  const initialForm = useMemo(() => buildInitialForm(isSharedSlot, prefill, datasetPrefill), []) // eslint-disable-line react-hooks/exhaustive-deps
  const [formData, setFormData] = useState<ACCreateFormData>(initialForm)
  const [currentStep, setCurrentStep] = useState(1)
  const [validationActive, setValidationActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  // Step 1 맥락 분석 결과 (Step 간 이동에도 유지)
  const [analysis, setAnalysis] = useState<ACAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const analyzeTimer = useRef<number | null>(null)
  useEffect(() => () => { if (analyzeTimer.current) window.clearTimeout(analyzeTimer.current) }, [])

  // 진입 시점 값과 다르면 입력한 것으로 봄. 값이 빈 기준 행(기본 항목)은 입력으로 보지 않음. 되돌리면 다시 비활성
  // 특성은 캠페인 설명에서 나오므로 비교하지 않음 (정의서 6.3)
  const serializeForm = (f: ACCreateFormData) => JSON.stringify({ ...f, traits: [], conditions: f.conditions.filter(c => c.values.length).map(c => ({ id: c.id, values: c.values })) })
  const isFormChanged = serializeForm(formData) !== serializeForm(initialForm)
  const isDirty = isFormChanged

  const { showExitDialog, cancelExit, confirmExit, handleCancel } = useExitGuard({ isDirty, isSubmitted })

  // 첫 입력 이후부터 에러 표시
  useEffect(() => { if (isFormChanged) setValidationActive(true) }, [isFormChanged])

  useEffect(() => { setDarkMode(isDarkMode) }, [isDarkMode])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const isStep1Valid = !!(
    formData.name.trim() &&
    (formData.industryMode === 'brand' ? formData.brand && formData.industry : formData.industry) &&
    formData.period.start &&
    formData.period.end &&
    formData.purposes.length > 0
  )

  const handleNext = () => {
    if (currentStep === 1) {
      if (!isStep1Valid) { setValidationActive(true); return }
      setCurrentStep(2)
      const context = formData.description.trim()
      const key = `${formData.contextFile ?? ''}|${context}`
      const hasContext = !!(formData.contextFile || context)
      // 맥락이 있고 지난 분석과 다르면 다시 분석. 사용자가 직접 고친 값은 유지 (정의서 4.2)
      if (hasContext && key !== analysis?.key) {
        setIsAnalyzing(true)
        analyzeTimer.current = window.setTimeout(() => {
          // 첨부 파일 읽기는 SpinX 연동 전이라 예시 브리프 내용으로 대신함
          const text = [formData.contextFile ? AC_SAMPLE_BRIEF_TEXT : '', context].filter(Boolean).join('\n')
          const result = analyzeContext(text, formData.purposes)
          setFormData(prev => {
            const { rows, filled } = applyFills(prev.conditions, result.fills)
            setAnalysis({ key, filled, candidates: result.candidates, notes: result.notes })
            // 특성은 사용자가 고칠 수 없으므로 새 결과로 통째로 교체 (정의서 4.2)
            return { ...prev, conditions: rows, traits: result.traits }
          })
          setIsAnalyzing(false)
        }, ANALYZE_MS)
      }
      // 캠페인 설명을 지웠으면 특성도 비움
      if (!hasContext && formData.traits.length) setFormData(prev => ({ ...prev, traits: [] }))
      return
    }
    if (currentStep === 2 && !isStep2Valid) return
    setCurrentStep(step => Math.min(step + 1, 3))
  }

  const handlePrev = () => { if (!isAnalyzing) setCurrentStep(step => Math.max(step - 1, 1)) }

  // Step 2: 표에 있는 기준은 값이 필수 (정의서 4.3). 값이 빈 행이 있으면 [다음] 비활성 + 해당 행에 바로 에러 표시
  const isStep2Valid = formData.conditions.every(c => c.values.length > 0)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // 생성 요청 API 연동 전 모의 요청
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      setToast({ type: 'success', message: '큐레이션 생성 요청이 완료되었습니다.' })
      setTimeout(() => navigate('/adcurator'), 2000)
    } catch {
      setToast({ type: 'error', message: '큐레이션 생성 요청에 실패했습니다. 다시 시도해 주세요.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleDarkMode = () => { const next = !isDarkMode; setIsDarkModeState(next); setDarkMode(next) }

  // 맥락 분석 중에는 Step 이동 불가
  const isSpinxBusy = isAnalyzing
  const nextDisabled = (currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid) || isSpinxBusy

  return (
    <AppLayout
      currentView="createScenario"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', onClick: () => handleCancel('/slotboard') },
        { label: AC_CREATE_SLOT.title, onClick: () => handleCancel(`/slot/${AC_CREATE_SLOT.id}`) },
        { label: 'Ad Curator', onClick: () => handleCancel('/adcurator') },
        { label: '새 큐레이션 생성' }
      ]}
      isDarkMode={isDarkMode}
      onToggleDarkMode={handleToggleDarkMode}
      sidebarProps={{
        isCollapsed: isSidebarCollapsed,
        expandedFolders,
        onToggleSidebar: toggleSidebar,
        onToggleFolder: toggleFolder,
        onNavigateToWorkspace: () => handleCancel('/slotboard')
      }}
    >
      <div className="p-8 max-w-[1400px] mx-auto font-[Paperlogy,sans-serif]">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold mb-2">새 큐레이션 생성</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">단계별로 큐레이션 정보를 입력하고 선별을 시작하세요</p>
        </div>

        <div className="grid grid-cols-[1fr_1px_420px] gap-12 items-start">
          {/* 좌측: 스테퍼 + 폼 */}
          <div>
            <div className="flex items-center mb-10 gap-2">
              {STEPS.map((step, index) => {
                const isCurrent = step.number === currentStep
                const isDone = step.number < currentStep
                return (
                  <div key={step.number} className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 py-2 px-4 rounded-[20px] transition-colors duration-300 ${
                      isCurrent ? 'bg-[hsl(var(--primary))]' : isDone ? 'bg-[hsl(var(--muted))]' : 'border border-[hsl(var(--border))]'
                    }`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                        isCurrent
                          ? 'bg-[hsl(var(--primary-foreground))] text-[hsl(var(--primary))]'
                          : isDone
                            ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                            : 'bg-[hsl(var(--muted))] text-[hsl(var(--primary-foreground))]'
                      }`}>
                        {isDone ? <Check size={12} /> : step.number}
                      </div>
                      <span className={`text-[13px] font-medium ${
                        isCurrent ? 'text-[hsl(var(--primary-foreground))]' : isDone ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`w-6 h-px transition-colors duration-300 ${isDone ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--border))]'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="min-h-[500px]">
              {currentStep === 1 && (
                <ACStep1 formData={formData} setFormData={setFormData} validationActive={validationActive} isSharedSlot={isSharedSlot} onToast={message => setToast({ type: 'error', message })} />
              )}
              {currentStep === 2 && (
                <ACStep2
                  formData={formData}
                  setFormData={setFormData}
                  analysis={analysis}
                  isAnalyzing={isAnalyzing}
                  validationActive={true}
                />
              )}
              {/* Step 3: 안내 박스 2개 (BudgetOpt 2.0 Step 3과 같은 구성, 정의서 5.1) */}
              {currentStep === 3 && (
                <div className="w-[800px]">
                  <h2 className="text-xl font-semibold mb-6">검토 및 실행</h2>

                  <div className="p-5 bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))] rounded-lg mb-8">
                    <div className="text-sm font-semibold mb-3 text-[hsl(var(--foreground))] flex items-center gap-2">
                      <Clock size={18} />
                      큐레이션 생성 안내
                    </div>
                    <div className="text-[13px] font-semibold mb-2 text-[hsl(var(--foreground))]">
                      "입력한 내용에 맞는 매체·상품을 적합도로 평가해 선별합니다."
                    </div>
                    <div className="text-[13px] leading-[1.6] text-[hsl(var(--muted-foreground))]">
                      생성에는 시간이 걸릴 수 있으며, 완료되면 <strong className="text-[hsl(var(--foreground))]">알림 센터</strong>에서 알려드립니다. 생성한 큐레이션은 수정할 수 없습니다.
                    </div>
                  </div>

                  <div className="py-4 px-5 bg-[hsl(var(--muted)/0.3)] border border-[hsl(var(--border))] rounded-lg">
                    <div className="text-[13px] font-medium text-[hsl(var(--foreground))] leading-[1.5] flex items-center gap-2">
                      <Check size={16} />
                      요청 전에 우측 Configuration Summary에서 설정 내용을 확인해 주세요.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button type="button" onClick={() => handleCancel('/adcurator')} className="btn btn-ghost btn-lg">취소</button>
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={isSpinxBusy}
                    className={`btn btn-secondary btn-lg ${isSpinxBusy ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <ChevronLeft size={20} />
                    이전
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={nextDisabled}
                    className={`btn btn-primary btn-lg ${nextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    다음
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`btn btn-primary btn-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? '생성 요청 중...' : '생성 요청'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="w-px bg-[hsl(var(--border))] min-h-[600px]" />

          {/* 우측: Configuration Summary */}
          <div className="sticky top-6">
            <ACConfigSummary formData={formData} currentStep={currentStep} />
          </div>
        </div>
      </div>

      {/* 이탈 확인 다이얼로그 */}
      {showExitDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">페이지를 떠나시겠습니까?</h3>
              <p className="dialog-description">작성 중인 내용은 저장되지 않습니다.</p>
            </div>
            <div className="dialog-footer">
              <button type="button" onClick={cancelExit} className="btn btn-primary btn-sm">계속 작성</button>
              <button type="button" onClick={confirmExit} className="btn btn-secondary btn-sm">나가기</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'toast--success' : 'toast--error'}`}>
          <div className="toast__icon">
            {toast.type === 'success'
              ? <CheckCircle size={20} className="text-[hsl(142.1_76.2%_36.3%)]" />
              : <AlertCircle size={20} className="text-[hsl(var(--destructive))]" />}
          </div>
          <div className="toast__content">
            <p className="toast__title">{toast.type === 'success' ? '성공' : '오류'}</p>
            <p className="toast__description">{toast.message}</p>
          </div>
          <button type="button" onClick={() => setToast(null)} className="toast__close"><X size={16} /></button>
        </div>
      )}
    </AppLayout>
  )
}
