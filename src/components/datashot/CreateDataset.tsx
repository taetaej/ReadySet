import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { adProductsByMedia, yearOptions, monthOptions, quarterOptions } from './types'
import { IndustryDialog } from './IndustryDialog'
import { MetricsDialog } from './MetricsDialog'
import { AdProductsDialog } from './AdProductsDialog'

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
    targetingOption: '' // 단일 선택으로 변경
  })
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [validationActive, setValidationActive] = useState(false)
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [industryDialogOpen, setIndustryDialogOpen] = useState(false)
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false)
  const [adProductsDialogOpen, setAdProductsDialogOpen] = useState(false)

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

  const isStep1Valid = () => {
    return !!(
      formData.datasetName &&
      formData.media &&
      formData.industries.length > 0 &&
      formData.period.startYear &&
      formData.period.startMonth &&
      formData.period.endYear &&
      formData.period.endMonth &&
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
                          if (e.target.value.length <= 30) {
                            setFormData({ ...formData, datasetName: e.target.value })
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
                        color: '#737373',
                        marginTop: '4px'
                      }}>
                        {formData.datasetName.length}/30
                      </div>
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
                        color: '#737373',
                        marginTop: '4px'
                      }}>
                        {formData.description.length}/200
                      </div>
                    </div>
                  </div>

                  {/* 2. 조회조건 */}
                  <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
                      조회조건
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
                              onChange={() => setFormData({ ...formData, media })}
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
                        height: '44px',
                        padding: '12px 16px',
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
                          fontSize: '13px',
                          color: formData.industries.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1
                        }}>
                          {formData.industries.length === 0 
                            ? '업종을 선택하세요'
                            : formData.industries.length === 1
                            ? formData.industries[0]
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

                      {/* 기간 선택 */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '800px' }}>
                        {/* 시작 */}
                        <select
                          value={formData.period.startYear}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            period: { ...formData.period, startYear: e.target.value } 
                          })}
                          className="input"
                          style={{ flex: 1 }}
                        >
                          <option value="">년도</option>
                          {yearOptions.map(year => (
                            <option key={year} value={year}>{year}년</option>
                          ))}
                        </select>
                        
                        <select
                          value={formData.period.startMonth}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            period: { ...formData.period, startMonth: e.target.value } 
                          })}
                          className="input"
                          style={{ flex: 1 }}
                        >
                          <option value="">{formData.periodType === 'month' ? '월' : '분기'}</option>
                          {(formData.periodType === 'month' ? monthOptions : quarterOptions).map((option, idx) => (
                            <option key={idx} value={String(idx + 1)}>{option}</option>
                          ))}
                        </select>

                        <span style={{ color: 'hsl(var(--muted-foreground))', padding: '0 4px' }}>~</span>

                        {/* 종료 */}
                        <select
                          value={formData.period.endYear}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            period: { ...formData.period, endYear: e.target.value } 
                          })}
                          className="input"
                          style={{ flex: 1 }}
                        >
                          <option value="">년도</option>
                          {yearOptions.map(year => (
                            <option key={year} value={year}>{year}년</option>
                          ))}
                        </select>
                        
                        <select
                          value={formData.period.endMonth}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            period: { ...formData.period, endMonth: e.target.value } 
                          })}
                          className="input"
                          style={{ flex: 1 }}
                        >
                          <option value="">{formData.periodType === 'month' ? '월' : '분기'}</option>
                          {(formData.periodType === 'month' ? monthOptions : quarterOptions).map((option, idx) => (
                            <option key={idx} value={String(idx + 1)}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        광고상품 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                      </label>
                      
                      {!formData.media ? (
                        <div style={{
                          width: '800px',
                          height: '36px',
                          padding: '8px 12px',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          backgroundColor: 'hsl(var(--muted) / 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          boxSizing: 'border-box'
                        }}>
                          <span style={{ fontSize: '14px', lineHeight: '16.5px', color: '#737373' }}>
                            먼저 매체를 선택해주세요
                          </span>
                        </div>
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
                        onClick={() => setAdProductsDialogOpen(true)}
                        >
                          <span style={{ 
                            fontSize: '14px',
                            lineHeight: '16.5px',
                            color: formData.products.length > 0 ? '#0A0A0A' : '#737373'
                          }}>
                            {formData.products.length > 0 
                              ? `${formData.products.length}개 광고상품 선택됨` 
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
                          color: formData.metrics.length > 0 ? '#0A0A0A' : '#737373'
                        }}>
                          {formData.metrics.length > 0 
                            ? `${formData.metrics.length}개 지표 선택됨` 
                            : '지표를 선택하세요'}
                        </span>
                        <ChevronRight size={16} />
                      </div>
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

                    {/* 타겟팅 옵션 (단일 선택) */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                        타겟팅 옵션
                      </label>
                      <select
                        value={formData.targetingOption}
                        onChange={(e) => setFormData({ ...formData, targetingOption: e.target.value })}
                        className="input"
                        style={{ width: '800px' }}
                      >
                        <option value="">선택 안 함</option>
                        <option value="age">연령</option>
                        <option value="gender">성별</option>
                        <option value="region">지역</option>
                        <option value="interest">관심사</option>
                      </select>
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
                        color: formData.media ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.media || '—'}
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
                        color: (formData.period.startYear && formData.period.startMonth && formData.period.endYear && formData.period.endMonth) ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.period.startYear && formData.period.startMonth 
                          ? `${formData.period.startYear}-${formData.period.startMonth.padStart(2, '0')}${formData.periodType === 'quarter' ? 'Q' : ''}` 
                          : '—'} → {formData.period.endYear && formData.period.endMonth 
                          ? `${formData.period.endYear}-${formData.period.endMonth.padStart(2, '0')}${formData.periodType === 'quarter' ? 'Q' : ''}` 
                          : '—'}
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
