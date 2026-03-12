import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, Database, Maximize2, CheckCircle, AlertCircle, X } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { targetingOptionsByMedia } from './types'
import { IndustryDialog } from './IndustryDialog'
import { MetricsDialog } from './MetricsDialog'
import { AdProductsDialog } from './AdProductsDialog'
import { DisabledSelectBox } from './DisabledSelectBox'
import { ConfigurationSummary } from './ConfigurationSummary'
import { MonthRangePicker } from './MonthRangePicker'
import { SampleDataModal } from './SampleDataModal'

interface CreateDatasetProps {
  slotData?: any
}

export function CreateDataset({ slotData }: CreateDatasetProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()
  
  // Step 1 확인 완료 상태
  const [isStep1Confirmed, setIsStep1Confirmed] = useState(false)
  
  const [formData, setFormData] = useState({
    datasetName: '',
    description: '',
    media: '',
    industries: [] as string[],
    period: { 
      startYear: '', 
      startMonth: '', 
      endYear: '', 
      endMonth: '' 
    },
    periodType: 'month' as 'month' | 'quarter',
    products: [] as string[],
    metrics: [] as string[],
    targetingCategory: '',
    targetingOptions: [] as string[]
  })
  
  const [validationActive, setValidationActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [industryDialogOpen, setIndustryDialogOpen] = useState(false)
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false)
  const [adProductsDialogOpen, setAdProductsDialogOpen] = useState(false)
  const [showSampleDataModal, setShowSampleDataModal] = useState(false)
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  // 타겟팅 옵션 searchable dropdown 상태
  const [targetingDropdownOpen, setTargetingDropdownOpen] = useState(false)
  const [targetingSearchQuery, setTargetingSearchQuery] = useState('')

  useEffect(() => {
    setDarkModeUtil(isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    if (currentStep >= 2) {
      setIsStep1Confirmed(true)
    }
  }, [currentStep])

  // 타겟팅 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (targetingDropdownOpen && !target.closest('.targeting-dropdown-container')) {
        setTargetingDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [targetingDropdownOpen])

  // 토스트 자동 닫기
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  useEffect(() => {
    if (!validationActive) {
      const hasAnyInput = !!(
        formData.datasetName ||
        formData.media ||
        formData.industries.length > 0 ||
        formData.period.startYear ||
        formData.period.endYear
      )
      if (hasAnyInput) {
        setValidationActive(true)
      }
    }
  }, [formData, validationActive])

  const steps = [
    { number: 1, title: '조회조건 설정', description: '데이터 추출 조건' },
    { number: 2, title: '검토 및 추출', description: '샘플 데이터 확인' }
  ]

  // 날짜 범위 유효성 검사
  const validateDateRange = () => {
    // 유효성 검사가 활성화되었을 때만 미선택 체크
    if (validationActive) {
      if (!formData.period.startYear || !formData.period.startMonth || 
          !formData.period.endYear || !formData.period.endMonth) {
        return { valid: false, message: '조회기간을 선택해주세요.' }
      }
    } else {
      // 유효성 검사 비활성화 시 입력 중이면 통과
      if (!formData.period.startYear || !formData.period.startMonth || 
          !formData.period.endYear || !formData.period.endMonth) {
        return { valid: true, message: '' }
      }
    }

    const startYear = parseInt(formData.period.startYear)
    const startPeriod = parseInt(formData.period.startMonth)
    const endYear = parseInt(formData.period.endYear)
    const endPeriod = parseInt(formData.period.endMonth)

    // 월별/분기별에 따라 월 단위로 변환
    const multiplier = formData.periodType === 'quarter' ? 3 : 1
    const startMonthTotal = startYear * 12 + (startPeriod - 1) * multiplier
    const endMonthTotal = endYear * 12 + (endPeriod - 1) * multiplier

    // 종료일이 시작일보다 이전인지 체크
    if (endMonthTotal < startMonthTotal) {
      return { valid: false, message: '종료일은 시작일보다 이후여야 합니다.' }
    }

    // 2년(24개월) 초과 체크
    const diffMonths = endMonthTotal - startMonthTotal
    if (diffMonths > 24) {
      return { valid: false, message: '조회기간은 최대 2년까지 설정 가능합니다.' }
    }

    return { valid: true, message: '' }
  }

  const dateRangeValidation = validateDateRange()

  const isStep1Valid = () => {
    const isTargetingValid = !formData.targetingCategory || formData.targetingOptions.length > 0
    
    return !!(
      formData.datasetName &&
      formData.datasetName.trim().length > 0 &&
      formData.media &&
      formData.industries.length > 0 &&
      formData.period.startYear &&
      formData.period.startMonth &&
      formData.period.endYear &&
      formData.period.endMonth &&
      dateRangeValidation.valid &&
      formData.products.length > 0 &&
      formData.metrics.length > 0 &&
      isTargetingValid
    )
  }

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid()) {
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
      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 데이터셋 생성 로직
      console.log('데이터셋 생성:', formData)
      
      // 성공 시
      setShowToast({ 
        type: 'success', 
        message: '데이터셋 생성 요청이 완료되었습니다. 데이터셋 목록에서 확인해주세요.' 
      })
      
      setTimeout(() => {
        navigate('/datashot')
      }, 2000)
      
    } catch (error) {
      // 실패 시
      setShowToast({ 
        type: 'error', 
        message: '데이터셋 생성 요청에 실패했습니다. 다시 시도해주세요.' 
      })
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
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            새 데이터셋 생성
          </h1>
          <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
            조회조건을 선택하여 원하는 데이터를 추출하세요.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '800px 1px 420px', gap: '48px', alignItems: 'start' }}>
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

                  {/* 1. 기본 정보 */}
                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
                      기본 정보
                    </h3>

                    {/* 데이터셋명 */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        데이터셋명 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.datasetName}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\n/g, '')
                          if (value.length <= 30) {
                            setFormData({ ...formData, datasetName: value })
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                          }
                        }}
                        placeholder="데이터셋명을 입력하세요."
                        className="input"
                        style={{ width: '800px' }}
                        maxLength={30}
                      />
                      <div style={{ 
                        width: '800px',
                        textAlign: 'right',
                        fontSize: '12px',
                        color: 'hsl(var(--muted-foreground))',
                        marginTop: '4px'
                      }}>
                        {formData.datasetName.length}/30
                      </div>
                      {validationActive && formData.datasetName.trim().length === 0 && formData.datasetName.length > 0 && (
                        <div style={{
                          fontSize: '12px',
                          color: 'hsl(var(--destructive))',
                          marginTop: '4px'
                        }}>
                          공백만으로 구성할 수 없습니다.
                        </div>
                      )}
                    </div>

                    {/* 설명 */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        설명
                      </label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value.length <= 200) {
                            setFormData({ ...formData, description: value })
                          }
                        }}
                        placeholder="데이터셋에 대한 설명을 입력하세요."
                        className="input"
                        style={{ 
                          width: '800px',
                          minHeight: '80px',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                        maxLength={200}
                      />
                      <div style={{ 
                        width: '800px',
                        textAlign: 'right',
                        fontSize: '12px',
                        color: 'hsl(var(--muted-foreground))',
                        marginTop: '4px'
                      }}>
                        {(formData.description || '').length}/200
                      </div>
                    </div>
                  </div>

                  {/* 2. 상세 설정 */}
                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
                      상세 설정
                    </h3>

                    {/* 매체 */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        매체 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', width: '800px' }}>
                        {['Google Ads', 'Meta', 'kakao모먼트', '네이버 성과형 DA', '네이버 보장형 DA', 'TikTok'].map(media => (
                          <label 
                            key={media}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              padding: '12px',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              backgroundColor: formData.media === media 
                                ? 'hsl(var(--primary) / 0.1)' 
                                : 'transparent',
                              borderColor: formData.media === media 
                                ? 'hsl(var(--primary))' 
                                : validationActive && !formData.media
                                ? 'hsl(var(--destructive))'
                                : 'hsl(var(--border))',
                              transition: 'all 0.2s'
                            }}
                          >
                            <input
                              type="radio"
                              name="media"
                              checked={formData.media === media}
                              onChange={() => setFormData({ 
                                ...formData, 
                                media,
                                products: [],
                                metrics: [],
                                targetingCategory: '',
                                targetingOptions: []
                              })}
                              style={{ accentColor: 'hsl(var(--primary))' }}
                            />
                            <span style={{ fontSize: '13px' }}>{media}</span>
                          </label>
                        ))}
                      </div>
                      {validationActive && !formData.media && (
                        <p style={{ 
                          fontSize: '12px', 
                          color: 'hsl(var(--destructive))', 
                          marginTop: '4px' 
                        }}>
                          매체를 선택해주세요.
                        </p>
                      )}
                    </div>

                    {/* 업종 */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        업종 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                      </label>
                      <div style={{
                        width: '800px',
                        height: '36px',
                        padding: '8px 12px',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        backgroundColor: 'hsl(var(--background))',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxSizing: 'border-box'
                      }}
                      onClick={() => setIndustryDialogOpen(true)}
                      >
                        <span style={{ 
                          fontSize: '14px',
                          lineHeight: '16.5px',
                          color: formData.industries.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1
                        }}>
                          {formData.industries.length === 0 
                            ? '업종을 선택하세요'
                            : `${formData.industries.length}개 업종 선택됨`}
                        </span>
                        <ChevronRight size={16} style={{ flexShrink: 0, marginLeft: '8px' }} />
                      </div>
                      {validationActive && formData.industries.length === 0 && (
                        <div style={{
                          fontSize: '12px',
                          color: 'hsl(var(--destructive))',
                          marginTop: '4px'
                        }}>
                          업종을 선택해주세요.
                        </div>
                      )}
                    </div>

                    {/* 조회기간 */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        조회기간 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                      </label>
                      <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
                        조회기간은 최대 2년으로 설정해주세요.
                      </p>
                      
                      {/* 월별/분기별 선택 */}
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="periodType"
                            checked={formData.periodType === 'month'}
                            onChange={() => setFormData({ 
                              ...formData, 
                              periodType: 'month', 
                              period: { startYear: '', startMonth: '', endYear: '', endMonth: '' } 
                            })}
                            style={{ accentColor: 'hsl(var(--primary))' }}
                          />
                          <span style={{ fontSize: '13px' }}>월별</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="periodType"
                            checked={formData.periodType === 'quarter'}
                            onChange={() => setFormData({ 
                              ...formData, 
                              periodType: 'quarter', 
                              period: { startYear: '', startMonth: '', endYear: '', endMonth: '' } 
                            })}
                            style={{ accentColor: 'hsl(var(--primary))' }}
                          />
                          <span style={{ fontSize: '13px' }}>분기별</span>
                        </label>
                      </div>

                      {/* 기간 선택 - Custom Month Range Picker */}
                      <MonthRangePicker
                        type={formData.periodType}
                        value={formData.period}
                        onChange={(period) => setFormData({ ...formData, period })}
                      />
                      
                      {validationActive && !dateRangeValidation.valid && (
                        <div style={{
                          fontSize: '12px',
                          color: 'hsl(var(--destructive))',
                          marginTop: '4px'
                        }}>
                          {dateRangeValidation.message}
                        </div>
                      )}
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        광고상품 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                      </label>
                      
                      {!formData.media ? (
                        <DisabledSelectBox message="매체를 먼저 선택하세요" />
                      ) : (
                        <div style={{
                          width: '800px',
                          height: '36px',
                          padding: '8px 12px',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          backgroundColor: 'hsl(var(--background))',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          boxSizing: 'border-box'
                        }}
                        onClick={() => {
                          setAdProductsDialogOpen(true)
                        }}
                        >
                          <span style={{ 
                            fontSize: '14px',
                            lineHeight: '16.5px',
                            color: formData.products.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                          }}>
                            {formData.products.length > 0 
                              ? formData.media === 'Meta'
                                ? (() => {
                                    // Meta의 경우 조합 개수 계산
                                    try {
                                      const groups = formData.products.map(p => JSON.parse(p))
                                      const totalCombinations = groups.reduce((sum, g) => {
                                        const buyingCount = g.buyingTypes?.length || 2
                                        const platformCount = g.platforms?.length || 6
                                        const goalCount = g.performanceGoals?.length || 6
                                        return sum + (buyingCount * platformCount * goalCount)
                                      }, 0)
                                      return `${totalCombinations}개 광고상품 선택됨`
                                    } catch {
                                      return `${formData.products.length}개 광고상품 선택됨`
                                    }
                                  })()
                                : `${formData.products.length}개 광고상품 선택됨`
                              : '광고상품을 선택하세요'}
                          </span>
                          <ChevronRight size={16} />
                        </div>
                      )}
                      {validationActive && formData.products.length === 0 && (
                        <div style={{
                          fontSize: '12px',
                          color: 'hsl(var(--destructive))',
                          marginTop: '4px'
                        }}>
                          광고상품을 선택해주세요.
                        </div>
                      )}
                    </div>

                    {/* 지표 */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        지표 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                      </label>
                      
                      {!formData.media ? (
                        <DisabledSelectBox message="매체를 먼저 선택하세요" />
                      ) : (
                        <div style={{
                          width: '800px',
                          height: '36px',
                          padding: '8px 12px',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          backgroundColor: 'hsl(var(--background))',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          boxSizing: 'border-box'
                        }}
                        onClick={() => setMetricsDialogOpen(true)}
                        >
                          <span style={{ 
                            fontSize: '14px',
                            lineHeight: '16.5px',
                            color: formData.metrics.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                          }}>
                            {formData.metrics.length > 0 
                              ? `${formData.metrics.length}개 지표 선택됨` 
                              : '지표를 선택하세요'}
                          </span>
                          <ChevronRight size={16} />
                        </div>
                      )}
                      {validationActive && formData.metrics.length === 0 && (
                        <div style={{
                          fontSize: '12px',
                          color: 'hsl(var(--destructive))',
                          marginTop: '4px'
                        }}>
                          지표를 선택해주세요.
                        </div>
                      )}
                    </div>

                    {/* 타겟팅 옵션 */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        타겟팅 옵션
                      </label>
                      
                      {!formData.media ? (
                        <DisabledSelectBox message="매체를 먼저 선택하세요" />
                      ) : (
                        <div style={{ width: '800px' }}>
                          {/* 타겟팅 기준 선택 - Searchable Dropdown */}
                          <div className="targeting-dropdown-container" style={{ marginBottom: '12px', position: 'relative' }}>
                            <input
                              type="text"
                              value={formData.targetingCategory || targetingSearchQuery}
                              onChange={(e) => {
                                setTargetingSearchQuery(e.target.value)
                                setFormData({ 
                                  ...formData, 
                                  targetingCategory: '',
                                  targetingOptions: []
                                })
                                setTargetingDropdownOpen(true)
                              }}
                              onFocus={() => setTargetingDropdownOpen(true)}
                              placeholder="선택 안 함"
                              className="input"
                              style={{ width: '100%', height: '36px', padding: '8px 12px', boxSizing: 'border-box' }}
                            />
                            {targetingDropdownOpen && (
                              <div className="dropdown" style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                marginTop: '4px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                zIndex: 1000
                              }}>
                                <button
                                  onClick={() => {
                                    setFormData({ 
                                      ...formData, 
                                      targetingCategory: '',
                                      targetingOptions: []
                                    })
                                    setTargetingSearchQuery('')
                                    setTargetingDropdownOpen(false)
                                  }}
                                  className="dropdown-item"
                                >
                                  선택 안 함
                                </button>
                                {targetingOptionsByMedia[formData.media]
                                  ?.filter(targeting => 
                                    targeting.category.toLowerCase().includes(targetingSearchQuery.toLowerCase())
                                  )
                                  .map((targeting) => (
                                    <button
                                      key={targeting.category}
                                      onClick={() => {
                                        setFormData({ 
                                          ...formData, 
                                          targetingCategory: targeting.category,
                                          targetingOptions: []
                                        })
                                        setTargetingSearchQuery('')
                                        setTargetingDropdownOpen(false)
                                      }}
                                      className="dropdown-item"
                                    >
                                      {targeting.category}
                                    </button>
                                  ))}
                                {targetingOptionsByMedia[formData.media]
                                  ?.filter(targeting => 
                                    targeting.category.toLowerCase().includes(targetingSearchQuery.toLowerCase())
                                  ).length === 0 && (
                                  <div style={{ padding: '12px', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                                    검색 결과가 없습니다
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* 타겟팅 세부 옵션 (다중 선택) */}
                          {formData.targetingCategory && (
                            <div style={{
                              padding: '16px',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px',
                              backgroundColor: 'hsl(var(--muted) / 0.1)'
                            }}>
                              <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>
                                {formData.targetingCategory} 옵션 (다중 선택 가능)
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {targetingOptionsByMedia[formData.media]
                                  ?.find(t => t.category === formData.targetingCategory)
                                  ?.options.map((option) => (
                                    <label
                                      key={option}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px',
                                        border: `1px solid ${formData.targetingOptions.includes(option) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        backgroundColor: formData.targetingOptions.includes(option) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                                        transition: 'all 0.2s'
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={formData.targetingOptions.includes(option)}
                                        onChange={() => {
                                          if (formData.targetingOptions.includes(option)) {
                                            setFormData({
                                              ...formData,
                                              targetingOptions: formData.targetingOptions.filter(o => o !== option)
                                            })
                                          } else {
                                            setFormData({
                                              ...formData,
                                              targetingOptions: [...formData.targetingOptions, option]
                                            })
                                          }
                                        }}
                                        className="checkbox-custom"
                                      />
                                      <span style={{ fontSize: '13px' }}>{option}</span>
                                    </label>
                                  ))}
                              </div>
                              {validationActive && formData.targetingCategory && formData.targetingOptions.length === 0 && (
                                <div style={{
                                  fontSize: '12px',
                                  color: 'hsl(var(--destructive))',
                                  marginTop: '8px'
                                }}>
                                  최소 1개 이상 선택해주세요.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
                    검토 및 추출
                  </h2>
                  
                  {/* Configuration Summary 박스 */}
                  <div style={{
                    padding: '16px 20px',
                    backgroundColor: 'hsl(var(--muted) / 0.3)',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    marginBottom: '24px'
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
                  
                  {/* 샘플 데이터 미리보기 */}
                  <div style={{ marginBottom: '24px' }}>
                    {/* 타이틀 */}
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                      데이터 미리보기
                    </h3>
                    <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '16px' }}>
                      샘플 데이터 5행을 통해 데이터 구조를 확인하세요.
                    </p>
                    
                    {/* 헤더 정보 */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ 
                        fontSize: '12px', 
                        color: 'hsl(var(--muted-foreground))',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap'
                      }}>
                        <Database size={14} />
                        추출할 전체 데이터 : {(() => {
                          // 실제 데이터 행 수 계산
                          const periodMonths = (() => {
                            if (!formData.period.startYear || !formData.period.endYear) return 0
                            const startYear = parseInt(formData.period.startYear)
                            const startPeriod = parseInt(formData.period.startMonth)
                            const endYear = parseInt(formData.period.endYear)
                            const endPeriod = parseInt(formData.period.endMonth)
                            const multiplier = formData.periodType === 'quarter' ? 3 : 1
                            const startMonthTotal = startYear * 12 + (startPeriod - 1) * multiplier
                            const endMonthTotal = endYear * 12 + (endPeriod - 1) * multiplier
                            return Math.floor((endMonthTotal - startMonthTotal) / multiplier) + 1
                          })()
                          
                          const industriesCount = formData.industries.length || 0
                          const productsCount = formData.products.length || 0
                          const targetingCount = formData.targetingOptions.length || 1
                          
                          const totalRows = periodMonths * industriesCount * productsCount * targetingCount
                          return totalRows.toLocaleString()
                        })()} 개 행
                      </div>
                      <button
                        onClick={() => setShowSampleDataModal(true)}
                        className="btn btn-sm"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap',
                          backgroundColor: 'hsl(var(--foreground))',
                          color: 'hsl(var(--background))',
                          border: 'none'
                        }}
                      >
                        <Maximize2 size={14} />
                        전체 컬럼 보기
                      </button>
                    </div>
                    
                    {/* 테이블 컨테이너 */}
                    <div style={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      {/* 테이블 */}
                      <div style={{ overflow: 'hidden' }}>
                        <table style={{ 
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '13px'
                        }}>
                          <thead>
                            <tr style={{ 
                              backgroundColor: 'hsl(var(--muted))',
                              borderBottom: '1px solid hsl(var(--border))'
                            }}>
                              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '100px' }}>기간</th>
                              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '120px' }}>매체</th>
                              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '120px' }}>업종(대)</th>
                              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '120px' }}>업종(중)</th>
                              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '120px' }}>업종(소)</th>
                              {/* 광고상품 컬럼들 (동적) */}
                              {(() => {
                                if (formData.media === 'Meta') {
                                  return ['캠페인 목표', '구매 유형', '플랫폼', '성과 목표'].map((label) => (
                                    <th key={label} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '120px' }}>{label}</th>
                                  ))
                                }
                                return <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '120px' }}>광고상품</th>
                              })()}
                              {/* 타겟팅 옵션 */}
                              {formData.targetingCategory && (
                                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '120px' }}>{formData.targetingCategory}</th>
                              )}
                              {/* 선택한 지표 (최대 3개) */}
                              {formData.metrics.slice(0, 3).map((metric) => (
                                <th key={metric} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '100px' }}>{metric}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {[1, 2, 3, 4, 5].map((row) => (
                              <tr 
                                key={row}
                                style={{ 
                                  borderBottom: row < 5 ? '1px solid hsl(var(--border))' : 'none'
                                }}
                              >
                                <td style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', width: '100px' }}>
                                  {formData.period.startYear ? 
                                    formData.periodType === 'quarter'
                                      ? `${formData.period.startYear}-Q${formData.period.startMonth}`
                                      : `${formData.period.startYear}-${formData.period.startMonth.padStart(2, '0')}`
                                    : '—'}
                                </td>
                                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', width: '120px' }}>{formData.media || '—'}</td>
                                <td style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', width: '120px' }}>
                                  {formData.industries[0]?.split(' > ')[0] || '—'}
                                </td>
                                <td style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', width: '120px' }}>
                                  {formData.industries[0]?.split(' > ')[1] || '—'}
                                </td>
                                <td style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', width: '120px' }}>
                                  {formData.industries[0]?.split(' > ')[2] || '—'}
                                </td>
                                {/* 광고상품 데이터 (동적) */}
                                {(() => {
                                  if (formData.media === 'Meta') {
                                    return [1, 2, 3, 4].map((i) => (
                                      <td key={i} style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', width: '120px' }}>—</td>
                                    ))
                                  }
                                  return <td style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', width: '120px' }}>—</td>
                                })()}
                                {/* 타겟팅 옵션 데이터 */}
                                {formData.targetingCategory && (
                                  <td style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', width: '120px' }}>
                                    {formData.targetingOptions[0] || '—'}
                                  </td>
                                )}
                                {/* 선택한 지표 데이터 (최대 3개) */}
                                {formData.metrics.slice(0, 3).map((metric) => (
                                  <td key={metric} style={{ padding: '10px 12px', textAlign: 'right', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', width: '100px' }}>—</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
                  <button 
                    onClick={handleNext} 
                    disabled={!isStep1Valid()}
                    className="btn btn-primary btn-lg"
                    style={{
                      opacity: !isStep1Valid() ? 0.5 : 1,
                      cursor: !isStep1Valid() ? 'not-allowed' : 'pointer'
                    }}
                  >
                    다음
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary btn-lg">
                    {isSubmitting ? '생성 요청 중...' : '데이터셋 생성 요청'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 중앙: 세로 구분선 */}
          <div style={{ width: '1px', backgroundColor: 'hsl(var(--border))', alignSelf: 'stretch', minHeight: '600px' }} />

          {/* 우측: Configuration Summary */}
          <ConfigurationSummary formData={formData} currentStep={currentStep} isStep1Confirmed={isStep1Confirmed} />
        </div>
      </div>


      {/* 업종 선택 다이얼로그 */}
      <IndustryDialog
        isOpen={industryDialogOpen}
        onClose={() => setIndustryDialogOpen(false)}
        selectedIndustries={formData.industries}
        onUpdate={(industries) => setFormData({ ...formData, industries })}
      />

      {/* 광고상품 선택 다이얼로그 */}
      <AdProductsDialog
        isOpen={adProductsDialogOpen}
        onClose={() => setAdProductsDialogOpen(false)}
        selectedProducts={formData.products}
        onUpdate={(products) => setFormData({ ...formData, products })}
        media={formData.media}
      />

      {/* 지표 선택 다이얼로그 */}
      <MetricsDialog
        isOpen={metricsDialogOpen}
        onClose={() => setMetricsDialogOpen(false)}
        selectedMetrics={formData.metrics}
        onUpdate={(metrics) => setFormData({ ...formData, metrics })}
        media={formData.media}
      />

      {/* 샘플 데이터 미리보기 모달 */}
      <SampleDataModal
        isOpen={showSampleDataModal}
        onClose={() => setShowSampleDataModal(false)}
        formData={formData}
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
