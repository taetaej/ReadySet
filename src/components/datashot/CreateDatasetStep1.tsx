import { ChevronRight, Layers, TrendingUp, Package, SlidersHorizontal } from 'lucide-react'
import { MonthRangePicker } from './MonthRangePicker'
import { IndustryDialog } from './IndustryDialog'
import { FormData, validateDateRange } from './createDatasetTypes'

interface Props {
  formData: FormData
  setFormData: (data: FormData) => void
  validationActive: boolean
  industryDialogOpen: boolean
  setIndustryDialogOpen: (open: boolean) => void
  // 광고상품 전환이 선택 업종(중분류) 초기화를 유발할 때, 상위에 확인 다이얼로그를 요청
  onConfirmResetForProduct?: () => void
}

// 추출 기준 택1 옵션
const extractOptions: { value: 'product' | 'condition'; icon: typeof Package; title: string; desc: string }[] = [
  {
    value: 'product',
    icon: Package,
    title: '광고상품',
    desc: 'ReadySet 표준 광고상품 기준으로 정돈된 성과 데이터를 추출\n(업종 대분류만 선택 가능)',
  },
  {
    value: 'condition',
    icon: SlidersHorizontal,
    title: '조건 조합',
    desc: '매체별 상세 옵션을 직접 조합해 세밀하게 데이터를 추출\n(업종 대·중분류 선택 가능)',
  },
]

export function CreateDatasetStep1({ formData, setFormData, validationActive, industryDialogOpen, setIndustryDialogOpen, onConfirmResetForProduct }: Props) {
  const dateValidation = validateDateRange(formData, validationActive)

  // 추출 기준 선택/변경: 광고상품은 업종 대분류만 가능하다.
  // 기존 선택이 중분류면 초기화가 필요하므로, 바로 바꾸지 않고 상위에 확인 다이얼로그를 요청한다(파괴적 동작 사전 동의).
  // 대분류이거나 선택 업종이 없으면 잃을 게 없어 즉시 변경한다.
  const handleExtractModeChange = (mode: 'product' | 'condition') => {
    if (mode === formData.extractMode) return
    if (mode === 'product' && formData.industryLevel === 'mid' && formData.industries.length > 0) {
      onConfirmResetForProduct?.()
      return
    }
    // 추출 기준 전환 시 반대쪽 Step2 입력은 무효이므로 모두 초기화 (잔류 데이터 방지)
    setFormData({
      ...formData,
      extractMode: mode,
      // 조건 조합 전용
      media: '', products: [], metrics: [],
      // 광고상품 전용
      mediaProducts: {}, productMetrics: [], productCollaborativePartners: [],
      // 공유(타겟팅)
      targetingCategory: '', targetingOptions: [],
    })
  }

  return (
    <div style={{ width: '800px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>기본 정보</h2>

      {/* 데이터셋명 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          데이터셋명 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <input
          type="text"
          value={formData.datasetName}
          onChange={(e) => {
            const value = e.target.value.replace(/\n/g, '')
            if (value.length <= 50) setFormData({ ...formData, datasetName: value })
          }}
          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
          placeholder="데이터셋명을 입력하세요."
          className="input"
          style={{ width: '100%', borderColor: validationActive && !formData.datasetName.trim() ? 'hsl(var(--destructive))' : undefined }}
          maxLength={50}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))' }}>
            {validationActive && !formData.datasetName.trim() && '데이터셋명을 입력해주세요.'}
            {validationActive && formData.datasetName.trim().length === 0 && formData.datasetName.length > 0 && '공백만으로 구성할 수 없습니다.'}
          </div>
          <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', flexShrink: 0 }}>
            {formData.datasetName.length}/50
          </div>
        </div>
      </div>

      {/* 설명 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>설명</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => { if (e.target.value.length <= 200) setFormData({ ...formData, description: e.target.value }) }}
          placeholder="데이터셋에 대한 설명을 입력하세요."
          className="input"
          style={{ width: '100%', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
          maxLength={200}
        />
        <div style={{ textAlign: 'right', fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginTop: '4px' }}>
          {(formData.description || '').length}/200
        </div>
      </div>

      {/* 데이터셋 용도 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          지표 구성 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
          종합 지표는 Private 또는 Internal Slot에서만 선택할 수 있습니다.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={() => {
              if (formData.purpose === 'internal') return
              setFormData({ ...formData, purpose: 'internal', productMetrics: [] })
            }}
            style={{
              padding: '16px',
              border: `1px solid ${formData.purpose === 'internal' ? 'hsl(var(--primary))' : validationActive && !formData.purpose ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}`,
              borderRadius: '8px',
              backgroundColor: formData.purpose === 'internal' ? 'hsl(var(--primary) / 0.1)' : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: 'hsl(var(--foreground))' }}>
              <Layers size={18} style={{ color: 'hsl(var(--foreground))' }} />
              종합 지표
            </div>
            <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
              전체 성과 흐름을 통합적으로 확인할 수 있도록 모든 효율 및 비용 지표를 제공
            </div>
          </button>
          <button
            onClick={() => {
              if (formData.purpose === 'external') return
              setFormData({ ...formData, purpose: 'external', productMetrics: [] })
            }}
            style={{
              padding: '16px',
              border: `1px solid ${formData.purpose === 'external' ? 'hsl(var(--primary))' : validationActive && !formData.purpose ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}`,
              borderRadius: '8px',
              backgroundColor: formData.purpose === 'external' ? 'hsl(var(--primary) / 0.1)' : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: 'hsl(var(--foreground))' }}>
              <TrendingUp size={18} style={{ color: 'hsl(var(--foreground))' }} />
              성과 지표
            </div>
            <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
              CTR, CPC 등 순수 효율과 성과 트렌드 분석에 최적화된 데이터셋
            </div>
          </button>
        </div>
        {validationActive && !formData.purpose && (
          <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '8px' }}>
            지표 구성을 선택해주세요.
          </div>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid hsl(var(--border))', margin: '32px 0' }} />

      {/* 조회기간 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          조회기간 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
          최근 2년치 데이터를 조회할 수 있습니다.
        </p>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          {(['month', 'quarter'] as const).map(type => (
            <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="radio" name="periodType" checked={formData.periodType === type}
                onChange={() => setFormData({ ...formData, periodType: type, period: { startYear: '', startMonth: '', endYear: '', endMonth: '' } })}
                style={{ accentColor: 'hsl(var(--primary))' }} />
              <span style={{ fontSize: '13px' }}>{type === 'month' ? '월별' : '분기별'}</span>
            </label>
          ))}
        </div>
        <MonthRangePicker type={formData.periodType} value={formData.period} onChange={(period) => setFormData({ ...formData, period })} hasError={validationActive && !dateValidation.valid} />
        {validationActive && !dateValidation.valid && (
          <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>{dateValidation.message}</div>
        )}
      </div>

      {/* 추출 기준 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          추출 기준 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
          데이터를 어떤 기준으로 추출할지 선택하세요. 선택한 기준에 따라 설정할 업종·매체·지표 항목이 달라집니다.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {extractOptions.map(({ value, icon: Icon, title, desc }) => {
            const selected = formData.extractMode === value
            return (
              <button
                key={value}
                onClick={() => handleExtractModeChange(value)}
                style={{
                  padding: '16px',
                  border: `1px solid ${selected ? 'hsl(var(--primary))' : validationActive && !formData.extractMode ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}`,
                  borderRadius: '8px',
                  backgroundColor: selected ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: 'hsl(var(--foreground))' }}>
                  <Icon size={18} style={{ color: 'hsl(var(--foreground))' }} />
                  {title}
                </div>
                <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                  {desc}
                </div>
              </button>
            )
          })}
        </div>
        {validationActive && !formData.extractMode && (
          <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '8px' }}>
            추출 기준을 선택해주세요.
          </div>
        )}
      </div>

      {/* 업종 — 추출 기준 선택 후 노출 */}
      {formData.extractMode && (
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          업종 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <div style={{
          width: '100%', height: '36px', padding: '8px 12px',
          border: `1px solid ${validationActive && formData.industries.length === 0 ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}`,
          borderRadius: '6px', backgroundColor: 'hsl(var(--background))', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box'
        }} onClick={() => setIndustryDialogOpen(true)}>
          <span style={{
            fontSize: '14px', lineHeight: '16.5px',
            color: formData.industries.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1
          }}>
            {formData.industries.length === 0
              ? '업종을 선택하세요.'
              : `${formData.industries.length}개 업종 선택됨 (${formData.industryLevel === 'major' ? '대분류' : formData.industryLevel === 'mid' ? '중분류' : '소분류'})`}
          </span>
          <ChevronRight size={16} style={{ flexShrink: 0, marginLeft: '8px' }} />
        </div>
        {validationActive && formData.industries.length === 0 && (
          <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>업종을 선택해주세요.</div>
        )}
      </div>
      )}

      <IndustryDialog
        isOpen={industryDialogOpen}
        onClose={() => setIndustryDialogOpen(false)}
        selectedIndustries={formData.industries}
        industryLevel={formData.industryLevel}
        extractMode={formData.extractMode}
        onUpdate={(industries, level) => setFormData({ ...formData, industries, industryLevel: level })}
      />
    </div>
  )
}
