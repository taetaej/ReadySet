import { ChevronRight, Layers, TrendingUp } from 'lucide-react'
import { MonthRangePicker } from './MonthRangePicker'
import { IndustryDialog } from './IndustryDialog'
import { FormData, validateDateRange } from './createDatasetTypes'

interface Props {
  formData: FormData
  setFormData: (data: FormData) => void
  validationActive: boolean
  industryDialogOpen: boolean
  setIndustryDialogOpen: (open: boolean) => void
}

export function CreateDatasetStep1({ formData, setFormData, validationActive, industryDialogOpen, setIndustryDialogOpen }: Props) {
  const dateValidation = validateDateRange(formData, validationActive)

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
            if (value.length <= 30) setFormData({ ...formData, datasetName: value })
          }}
          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
          placeholder="데이터셋명을 입력하세요."
          className="input"
          style={{ width: '100%', borderColor: validationActive && !formData.datasetName.trim() ? 'hsl(var(--destructive))' : undefined }}
          maxLength={30}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))' }}>
            {validationActive && !formData.datasetName.trim() && '데이터셋명을 입력해주세요.'}
            {validationActive && formData.datasetName.trim().length === 0 && formData.datasetName.length > 0 && '공백만으로 구성할 수 없습니다.'}
          </div>
          <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', flexShrink: 0 }}>
            {formData.datasetName.length}/30
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
            onClick={() => setFormData({ ...formData, purpose: 'internal' })}
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
            onClick={() => setFormData({ ...formData, purpose: 'external' })}
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
            데이터셋 용도를 선택해주세요.
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

      {/* 업종 */}
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

      <IndustryDialog
        isOpen={industryDialogOpen}
        onClose={() => setIndustryDialogOpen(false)}
        selectedIndustries={formData.industries}
        industryLevel={formData.industryLevel}
        onUpdate={(industries, level) => setFormData({ ...formData, industries, industryLevel: level })}
      />
    </div>
  )
}
