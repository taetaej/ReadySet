import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { yearOptions, monthOptions, quarterOptions, targetingOptionsByMedia } from './types'
import { IndustryDialog } from './IndustryDialog'
import { MetricsDialog } from './MetricsDialog'
import { AdProductsDialog } from './AdProductsDialog'
import { MetaAdProductsDialog } from './MetaAdProductsDialog'
import { DisabledSelectBox } from './DisabledSelectBox'
import { ConfigurationSummary } from './ConfigurationSummary'
import { MonthRangePicker } from './MonthRangePicker'

interface CreateDatasetProps {
  slotData?: any
}

export function CreateDataset({ slotData }: CreateDatasetProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()
  
  const [formData, setFormData] = useState({
    datasetName: '',
    description: '',
    media: '', // 단일 선택으로 변경
    industries: [] as string[],
    period: { 
      startYear: '', 
      startMonth: '', 
      endYear: '', 
      endMonth: '' 
    },
    periodType: 'month' as 'month' | 'quarter', // 월별/분기별 선택
    products: [] as string[],
    metrics: [] as string[],
    targetingCategory: '', // 타겟팅 기준 (단일 선택)
    targetingOptions: [] as string[] // 타겟팅 세부 옵션 (다중 선택)
  })
  
  const [validationActive, setValidationActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [industryDialogOpen, setIndustryDialogOpen] = useState(false)
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false)
  const [adProductsDialogOpen, setAdProductsDialogOpen] = useState(false)
  const [metaAdProductsDialogOpen, setMetaAdProductsDialogOpen] = useState(false)

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
    if (!formData.period.startYear || !formData.period.startMonth || 
        !formData.period.endYear || !formData.period.endMonth) {
      return { valid: true, message: '' } // 아직 입력 중이면 통과
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
    // 타겟팅 카테고리를 선택했는데 옵션을 선택하지 않은 경우 체크
    const isTargetingValid = !formData.targetingCategory || formData.targetingOptions.length > 0
    
    return !!(
      formData.datasetName &&
      formData.datasetName.trim().length > 0 && // 공백만으로 구성 불가
      formData.media &&
      formData.industries.length > 0 &&
      formData.period.startYear &&
      formData.period.startMonth &&
      formData.period.endYear &&
      formData.period.endMonth &&
      dateRangeValidation.valid && // 날짜 범위 유효성 체크
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTimeout(() => {
        navigate('/datashot')
      }, 500)
    } catch (error) {
      // 에러 처리
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
                          const value = e.target.value.replace(/\n/g, '') // 줄바꿈 차단
                          if (value.length <= 30) {
                            setFormData({ ...formData, datasetName: value })
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault() // Enter 키 차단
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
                        value={formData.description}
                        onChange={(e) => {
                          if (e.target.value.length <= 200) {
                            setFormData({ ...formData, description: e.target.value })
                          }
                        }}
                        placeholder="데이터셋에 대한 설명을 입력하세요"
                        className="input"
                        style={{ width: '800px', minHeight: '80px', resize: 'vertical' }}
                        maxLength={200}
                      />
                      <div style={{ 
                        width: '800px',
                        textAlign: 'right',
                        fontSize: '12px',
                        color: 'hsl(var(--muted-foreground))',
                        marginTop: '4px'
                      }}>
                        {formData.description.length}/200
                      </div>
                      {validationActive && formData.description.trim().length === 0 && formData.description.length > 0 && (
                        <div style={{
                          fontSize: '12px',
                          color: 'hsl(var(--destructive))',
                          marginTop: '4px'
                        }}>
                          공백만으로 구성할 수 없습니다.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. 상세 설정 */}
                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
                      상세 설정
                    </h3>

                    {/* 매체 (단일 선택) */}
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
                                products: [], // 매체 변경 시 광고상품 초기화
                                metrics: [], // 매체 변경 시 지표 초기화
                                targetingCategory: '', // 매체 변경 시 타겟팅 기준 초기화
                                targetingOptions: [] // 매체 변경 시 타겟팅 옵션 초기화
                              })}
                              style={{ accentColor: 'hsl(var(--primary))' }}
                            />
                            <span style={{ fontSize: '13px' }}>{media}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 업종 (다중 선택) */}
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
                          if (formData.media === 'Meta') {
                            setMetaAdProductsDialogOpen(true)
                          } else {
                            setAdProductsDialogOpen(true)
                          }
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

                    {/* 지표 (다중 선택) */}
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
                          {/* 타겟팅 기준 선택 */}
                          <div style={{ marginBottom: '12px' }}>
                            <select
                              value={formData.targetingCategory}
                              onChange={(e) => {
                                setFormData({ 
                                  ...formData, 
                                  targetingCategory: e.target.value,
                                  targetingOptions: [] // 기준 변경 시 세부 옵션 초기화
                                })
                              }}
                              className="input"
                              style={{ width: '100%', height: '36px', padding: '8px 12px', boxSizing: 'border-box' }}
                            >
                              <option value="">선택 안 함</option>
                              {targetingOptionsByMedia[formData.media]?.map((targeting) => (
                                <option key={targeting.category} value={targeting.category}>
                                  {targeting.category}
                                </option>
                              ))}
                            </select>
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
          <ConfigurationSummary formData={formData} currentStep={currentStep} />
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

      {/* Meta 광고상품 선택 다이얼로그 */}
      <MetaAdProductsDialog
        isOpen={metaAdProductsDialogOpen}
        onClose={() => setMetaAdProductsDialogOpen(false)}
        selectedProducts={formData.products}
        onUpdate={(products) => setFormData({ ...formData, products })}
      />

      {/* 지표 선택 다이얼로그 */}
      <MetricsDialog
        isOpen={metricsDialogOpen}
        onClose={() => setMetricsDialogOpen(false)}
        selectedMetrics={formData.metrics}
        onUpdate={(metrics) => setFormData({ ...formData, metrics })}
        media={formData.media}
      />
    </AppLayout>
  )
}
