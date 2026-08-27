import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Clock, CheckCircle, AlertCircle, X, Lock, ChevronLeft, ChevronRight } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { useExitGuard } from '../../hooks/useExitGuard'
import { BOStep1 } from './BOStep1'
import { BOStep2 } from './BOStep2'
import { KPI_LABELS } from './types'

export interface BOProductEntry {
  mediaId: string
  productName: string
  isFixed: boolean
  fixedAmount: number
}

export interface BOMediaFixed {
  mediaId: string
  isFixed: boolean
  fixedAmount: number
}

export interface BOFormData {
  scenarioName: string
  description: string
  industryMode: 'brand' | 'direct' | ''
  brand: string
  industry: string
  period: { start: string; end: string }
  kpi: string
  totalBudget: number
  products: BOProductEntry[]
  mediaFixed: BOMediaFixed[]
}

export function BOCreateScenario() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isDarkMode, setIsDarkModeState] = useState(() => getDarkMode())
  const [validationActive, setValidationActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()

  const [formData, setFormData] = useState<BOFormData>({
    scenarioName: '',
    description: '',
    industryMode: 'brand',
    brand: '',
    industry: '',
    period: { start: '', end: '' },
    kpi: '',
    totalBudget: 0,
    products: [],
    mediaFixed: []
  })

  // 이탈 방지: 입력값 존재 여부 판단 (industryMode='brand'는 디폴트라 제외)
  const isDirty = !!(
    formData.scenarioName ||
    formData.description ||
    formData.brand ||
    formData.industry ||
    formData.period.start ||
    formData.period.end ||
    formData.kpi ||
    formData.totalBudget ||
    formData.products.length > 0
  )

  const { showExitDialog, cancelExit, confirmExit, handleCancel } = useExitGuard({
    isDirty,
    isSubmitted
  })

  useEffect(() => { setDarkMode(isDarkMode) }, [isDarkMode])

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const steps = [
    { number: 1, title: '기본 정보', description: '시나리오 기본 설정' },
    { number: 2, title: '상세 설정', description: '매체 선택 및 예산 배분' },
    { number: 3, title: '검토 및 실행', description: '설정 확인 및 실행' }
  ]

  const isStep1Valid = () => {
    return !!(
      formData.scenarioName &&
      (formData.industryMode === 'brand' ? formData.brand && formData.industry : formData.industry) &&
      formData.period.start &&
      formData.period.end &&
      formData.kpi
    )
  }

  const isStep2Valid = () => {
    if (!formData.totalBudget || formData.totalBudget <= 0) return false
    if (formData.products.length < 2) return false

    // R3: 잠금 시 금액 필수
    const hasRule3Error = formData.mediaFixed.some(m => m.isFixed && (!m.fixedAmount || m.fixedAmount <= 0))
      || formData.products.some(p => p.isFixed && (!p.fixedAmount || p.fixedAmount <= 0))
    if (hasRule3Error) return false

    // R1: 매체-상품 계층 제약
    const hasRule1Error = formData.mediaFixed.some(mf => {
      if (!mf.isFixed) return false
      const children = formData.products.filter(p => p.mediaId === mf.mediaId)
      const lockedChildren = children.filter(c => c.isFixed)
      const childLockedSum = lockedChildren.reduce((sum, p) => sum + p.fixedAmount, 0)
      const hasUnlockedChild = children.some(c => !c.isFixed)
      // 하위 잠금 합계 > 매체 잠금 금액
      if (childLockedSum > mf.fixedAmount) return true
      // 비잠금 상품 있는데 배분 예산 없음
      if (hasUnlockedChild && childLockedSum >= mf.fixedAmount) return true
      // 하위 전부 잠금인데 합계 ≠ 매체 잠금 금액
      if (!hasUnlockedChild && lockedChildren.length > 0 && childLockedSum !== mf.fixedAmount && mf.fixedAmount > 0) return true
      return false
    })
    if (hasRule1Error) return false

    // R4: 배분 가능 예산 ≥ 0 (중복 차감 방지 적용)
    let lockedTotal = 0
    const lockedMediaIds = new Set(formData.mediaFixed.filter(m => m.isFixed).map(m => m.mediaId))
    for (const mf of formData.mediaFixed) {
      if (mf.isFixed) lockedTotal += mf.fixedAmount
    }
    for (const p of formData.products) {
      if (p.isFixed && !lockedMediaIds.has(p.mediaId)) {
        lockedTotal += p.fixedAmount
      }
    }
    if (formData.totalBudget - lockedTotal < 0) return false

    // R10: 매체 미잠금 + 하위 전부 잠금
    const mediaGroups = new Map<string, BOProductEntry[]>()
    for (const p of formData.products) {
      if (!mediaGroups.has(p.mediaId)) mediaGroups.set(p.mediaId, [])
      mediaGroups.get(p.mediaId)!.push(p)
    }
    const hasRule10Warning = Array.from(mediaGroups.entries()).some(([mediaId, children]) => {
      const mf = formData.mediaFixed.find(m => m.mediaId === mediaId)
      const isMediaLocked = mf?.isFixed || false
      return !isMediaLocked && children.length > 0 && children.every(c => c.isFixed)
    })
    if (hasRule10Warning) return false

    // R5: 비잠금 상품 ≥ 2 (매체 잠금 여부 무관)
    let unlockedVarCount = 0
    for (const [, children] of mediaGroups.entries()) {
      unlockedVarCount += children.filter(c => !c.isFixed).length
    }
    if (unlockedVarCount < 2) return false

    // R6: 잔여 예산 수령처 부재 — 배분 가능 예산 > 0인데 받을 비잠금 매체가 없음
    const remainingBudget = formData.totalBudget - lockedTotal
    if (remainingBudget > 0) {
      const hasUnlockedMedia = Array.from(mediaGroups.keys()).some(mediaId => {
        const mf = formData.mediaFixed.find(m => m.mediaId === mediaId)
        return !mf?.isFixed
      })
      if (!hasUnlockedMedia) return false
    }

    return true
  }

  const handleNext = () => {
    setValidationActive(true)
    if (currentStep === 1 && isStep1Valid()) setCurrentStep(2)
    else if (currentStep === 2 && isStep2Valid()) setCurrentStep(3)
  }

  const handlePrev = () => { if (currentStep > 1) setCurrentStep(currentStep - 1) }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      setShowToast({ type: 'success', message: '시나리오 생성 요청이 완료되었습니다. 완료 시 알림 센터에서 알려드립니다.' })
      setTimeout(() => navigate('/budgetoptimizer'), 2000)
    } catch {
      setShowToast({ type: 'error', message: '시나리오 생성 요청에 실패했습니다. 다시 시도해주세요.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleDarkMode = () => { const n = !isDarkMode; setIsDarkModeState(n); setDarkMode(n) }

  const formatBudget = (amount: number) => {
    if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억 원`
    if (amount >= 10000) return `${Math.round(amount / 10000).toLocaleString()}만 원`
    return `${amount.toLocaleString()} 원`
  }

  return (
    <AppLayout
      currentView="createScenario"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', href: '/slotboard' },
        { label: 'CJ올리브영 2025 하반기' },
        { label: 'Budget Optimizer', href: '/budgetoptimizer' },
        { label: '새 시나리오 생성' }
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
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>새 시나리오 생성</h1>
          <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>단계별로 시나리오 정보를 입력하고 분석을 시작하세요</p>
        </div>

        {/* Wizard Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 420px', gap: '48px', alignItems: 'start' }}>
          {/* Left: Stepper + Form */}
          <div>
            {/* Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '8px' }}>
              {steps.map((step, index) => (
                <div key={step.number} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 16px', borderRadius: '20px',
                    backgroundColor: step.number === currentStep ? 'hsl(var(--primary))' : step.number < currentStep ? 'hsl(var(--muted))' : 'transparent',
                    border: step.number > currentStep ? '1px solid hsl(var(--border))' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      backgroundColor: step.number === currentStep ? 'hsl(var(--primary-foreground))' : step.number < currentStep ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                      color: step.number === currentStep ? 'hsl(var(--primary))' : 'hsl(var(--primary-foreground))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: '600'
                    }}>
                      {step.number < currentStep ? <Check size={12} /> : step.number}
                    </div>
                    <span style={{
                      fontSize: '13px', fontWeight: '500',
                      color: step.number === currentStep ? 'hsl(var(--primary-foreground))' : step.number < currentStep ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                    }}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div style={{ width: '24px', height: '1px', backgroundColor: step.number < currentStep ? 'hsl(var(--primary))' : 'hsl(var(--border))', transition: 'all 0.3s' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Form Area */}
            <div style={{ minHeight: '500px' }}>
              {currentStep === 1 && (
                <BOStep1 formData={formData} setFormData={setFormData} validationActive={validationActive} />
              )}
              {currentStep === 2 && (
                <BOStep2 formData={formData} setFormData={setFormData} validationActive={validationActive} />
              )}
              {currentStep === 3 && (
                <div style={{ width: '800px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>검토 및 실행</h2>

                  {/* 안내 메시지 */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: 'hsl(var(--muted) / 0.5)',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    marginBottom: '32px'
                  }}>
                    <div style={{
                      fontSize: '14px', fontWeight: '600', marginBottom: '12px',
                      color: 'hsl(var(--foreground))',
                      display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      <Clock size={18} />
                      시나리오 생성 소요 시간 안내
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'hsl(var(--foreground))' }}>
                      "KPI 목표에 따른 매체별 최적 예산 배분안을 도출합니다."
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'hsl(var(--muted-foreground))' }}>
                      수만 개의 예산 조합을 시뮬레이션하여 데이터 기반의 최적 배분안을 도출합니다.<br />
                      정밀 연산을 위해 <strong style={{ color: 'hsl(var(--foreground))' }}>최대 20분</strong>이 소요될 수 있으며, 완료 시 상단 <strong style={{ color: 'hsl(var(--foreground))' }}>알림 센터</strong>에서 알려드립니다.
                    </div>
                  </div>

                  {/* 확인 메시지 */}
                  <div style={{
                    padding: '16px 20px',
                    backgroundColor: 'hsl(var(--muted) / 0.3)',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      fontSize: '13px', fontWeight: '500', color: 'hsl(var(--foreground))',
                      lineHeight: '1.5', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      <Check size={16} />
                      우측 Configuration Summary에서 설정 내용을 확인하세요!
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button onClick={() => handleCancel('/budgetoptimizer')} className="btn btn-ghost btn-lg">취소</button>
              <div style={{ display: 'flex', gap: '12px' }}>
                {currentStep > 1 && (
                  <button onClick={handlePrev} className="btn btn-secondary btn-lg">
                    <ChevronLeft size={20} />
                    이전
                  </button>
                )}
                {currentStep < 3 ? (
                  <button onClick={handleNext} className="btn btn-primary btn-lg"
                    disabled={(currentStep === 1 && !isStep1Valid()) || (currentStep === 2 && !isStep2Valid())}
                    style={{ opacity: (currentStep === 1 && !isStep1Valid()) || (currentStep === 2 && !isStep2Valid()) ? 0.5 : 1, cursor: (currentStep === 1 && !isStep1Valid()) || (currentStep === 2 && !isStep2Valid()) ? 'not-allowed' : 'pointer' }}
                  >
                    다음
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="btn btn-primary btn-lg" disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                  >
                    {isSubmitting ? '생성 요청 중...' : '시나리오 생성 요청'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', backgroundColor: 'hsl(var(--border))', minHeight: '600px' }} />

          {/* Right: Configuration Summary */}
          <div style={{ position: 'sticky', top: '24px' }}>
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
                    fontSize: '10px', fontWeight: '600', textTransform: 'uppercase',
                    letterSpacing: '0.8px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px'
                  }}>
                    Step 1 · Basic Information
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>시나리오명</span>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: formData.scenarioName ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))', textAlign: 'right', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {formData.scenarioName || '—'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>업종</span>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: formData.industry ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                        {formData.industry || '—'}
                      </span>
                    </div>
                    {formData.brand && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>브랜드</span>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{formData.brand}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>KPI</span>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: formData.kpi ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                        {formData.kpi ? KPI_LABELS[formData.kpi] : '—'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>캠페인 기간</span>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: (formData.period.start || formData.period.end) ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                        {formData.period.start || '—'} → {formData.period.end || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />

                {/* Step 2: 매체/예산 설정 */}
                <div>
                  <div style={{
                    fontSize: '10px', fontWeight: '600', textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: currentStep >= 2 ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground) / 0.5)',
                    marginBottom: '12px'
                  }}>
                    Step 2 · Media & Budget
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>선택 상품</span>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: formData.products.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                        {formData.products.length > 0 ? `${formData.products.length}개` : '—'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>총 예산</span>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: formData.totalBudget > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                        {formData.totalBudget > 0 ? formatBudget(formData.totalBudget) : '—'}
                      </span>
                    </div>
                    {formData.products.length > 0 && (
                      <div style={{
                        marginTop: '8px', padding: '8px',
                        backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: '6px',
                        display: 'flex', flexDirection: 'column', gap: '8px'
                      }}>
                        {[...new Set(formData.products.map(p => p.mediaId))].map((mediaId) => {
                          const products = formData.products.filter(p => p.mediaId === mediaId)
                          const mediaFixed = formData.mediaFixed.find(m => m.mediaId === mediaId)
                          const isMediaLocked = mediaFixed?.isFixed || false
                          return (
                            <div key={mediaId}>
                              <div style={{ fontSize: '10px', fontWeight: '600', color: 'hsl(var(--muted-foreground))', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                {isMediaLocked && <Lock size={8} style={{ color: 'hsl(var(--primary))' }} />}
                                {mediaId}
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                                {products.map(p => (
                                  <div key={`${p.mediaId}-${p.productName}`} style={{
                                    fontSize: '10px', padding: '2px 6px', borderRadius: '4px',
                                    backgroundColor: p.isFixed ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--muted))',
                                    color: p.isFixed ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                                    fontWeight: '500', whiteSpace: 'nowrap',
                                    display: 'flex', alignItems: 'center', gap: '3px'
                                  }}>
                                    {p.isFixed && <Lock size={8} />}
                                    {p.productName}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />

                {/* Step 3 */}
                <div>
                  <div style={{
                    fontSize: '10px', fontWeight: '600', textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: currentStep >= 3 ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground) / 0.5)',
                    marginBottom: '12px'
                  }}>
                    Step 3 · Review & Execute
                  </div>
                  <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                    {currentStep >= 3 ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span>검토</span>
                        <span style={{ fontWeight: '500', color: 'hsl(var(--foreground))' }}>확인 완료</span>
                      </div>
                    ) : '검토'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 이탈 확인 다이얼로그 */}
      {showExitDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">페이지를 떠나시겠습니까?</h3>
              <p className="dialog-description">
                작성 중인 내용은 저장되지 않습니다.
              </p>
            </div>
            <div className="dialog-footer">
              <button onClick={cancelExit} className="btn btn-primary btn-sm">
                계속 작성
              </button>
              <button onClick={confirmExit} className="btn btn-secondary btn-sm">
                나가기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className={`toast ${showToast.type === 'success' ? 'toast--success' : 'toast--error'}`}>
          <div className="toast__icon">
            {showToast.type === 'success' ? <CheckCircle size={20} style={{ color: 'hsl(142.1 76.2% 36.3%)' }} /> : <AlertCircle size={20} style={{ color: 'hsl(var(--destructive))' }} />}
          </div>
          <div className="toast__content">
            <p className="toast__title">{showToast.type === 'success' ? '성공' : '오류'}</p>
            <p className="toast__description">{showToast.message}</p>
          </div>
          <button onClick={() => setShowToast(null)} className="toast__close"><X size={16} /></button>
        </div>
      )}
    </AppLayout>
  )
}
