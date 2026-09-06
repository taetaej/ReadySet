import { useState } from 'react'
import { ChevronDown, Search, Eye, MousePointerClick, Play, Users } from 'lucide-react'
import { CustomDateRangePicker } from '../reachcaster/CustomDateRangePicker'
import { BOFormData } from './BOCreateScenario'
import { KPI_LABELS } from './types'

interface BOStep1Props {
  formData: BOFormData
  setFormData: (data: BOFormData) => void
  validationActive: boolean
}

const sampleBrands = [
  { name: '설화수', industry: '화장품' },
  { name: '이니스프리', industry: '화장품' },
  { name: '현대자동차', industry: '자동차' },
  { name: 'CJ제일제당', industry: '식품' },
  { name: '종근당건강', industry: '건강식품' },
  { name: '삼성전자', industry: '전자제품' },
  { name: '나이키코리아', industry: '패션' },
  { name: '하나투어', industry: '여행' },
  { name: '넥슨', industry: '게임' },
  { name: '쿠팡', industry: '이커머스' },
]

const industryList = [
  '화장품', '자동차', '식품', '건강식품', '전자제품',
  '패션', '여행', '게임', '이커머스', '금융',
  '교육', '부동산', '통신', '유통', '엔터테인먼트',
  '스포츠', '의료', '가전', '주류', '생활용품',
  '가구/인테리어', '반려동물'
]

export function BOStep1({ formData, setFormData, validationActive }: BOStep1Props) {
  const [brandSearchQuery, setBrandSearchQuery] = useState('')
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false)

  const filteredBrands = sampleBrands.filter(brand =>
    brand.name.toLowerCase().includes(brandSearchQuery.toLowerCase())
  )

  const handleBrandSelect = (brand: typeof sampleBrands[0]) => {
    setFormData({ ...formData, brand: brand.name, industry: brand.industry })
    setBrandDropdownOpen(false)
    setBrandSearchQuery('')
  }

  return (
    <div style={{ width: '800px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>기본 정보</h2>

      {/* 시나리오명 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          시나리오명 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <input
          type="text"
          value={formData.scenarioName}
          onChange={(e) => { if (e.target.value.length <= 30) setFormData({ ...formData, scenarioName: e.target.value }) }}
          placeholder="시나리오명을 입력하세요."
          className="input"
          style={{ width: '100%', borderColor: validationActive && !formData.scenarioName ? 'hsl(var(--destructive))' : undefined }}
          maxLength={30}
        />
        {validationActive && !formData.scenarioName && (
          <div style={{ fontSize: '11px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>시나리오명을 입력해 주세요.</div>
        )}
        <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginTop: '4px', textAlign: 'right' }}>{formData.scenarioName.length}/30</div>
      </div>

      {/* 설명 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>설명</label>
        <textarea
          value={formData.description}
          onChange={(e) => { if (e.target.value.length <= 200) setFormData({ ...formData, description: e.target.value }) }}
          placeholder="시나리오에 대한 설명을 입력하세요."
          className="input"
          style={{ width: '100%', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
          maxLength={200}
        />
        <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginTop: '4px', textAlign: 'right' }}>{formData.description.length}/200</div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid hsl(var(--border))', margin: '32px 0' }} />

      {/* 업종 식별 방식 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          업종 선택 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
          업종별 특화 최적화 모델(Meridian 활용)로 시나리오를 생성합니다.
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <label
            onClick={() => setFormData({ ...formData, industryMode: 'brand', industry: '', brand: '' })}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}
          >
            <input type="radio" name="industryMode" checked={formData.industryMode === 'brand'} readOnly style={{ accentColor: 'hsl(var(--primary))' }} />
            <span style={{ fontWeight: '500' }}>브랜드 선택</span>
          </label>
          <label
            onClick={() => setFormData({ ...formData, industryMode: 'direct', industry: '', brand: '' })}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}
          >
            <input type="radio" name="industryMode" checked={formData.industryMode === 'direct'} readOnly style={{ accentColor: 'hsl(var(--primary))' }} />
            <span style={{ fontWeight: '500' }}>업종 직접 선택</span>
          </label>
        </div>
        {validationActive && !formData.industryMode && (
          <div style={{ fontSize: '11px', color: 'hsl(var(--destructive))', marginTop: '8px' }}>업종 식별 방식을 선택해 주세요.</div>
        )}
      </div>

      {/* Brand selector (mode: brand) */}
      {formData.industryMode === 'brand' && (
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            브랜드 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
                className="input"
                style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderColor: validationActive && !formData.brand ? 'hsl(var(--destructive))' : undefined, color: formData.brand ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
              >
                <span>{formData.brand || '브랜드를 선택하세요'}</span>
                <ChevronDown size={16} />
              </button>
              {brandDropdownOpen && (
                <div className="dropdown" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', maxHeight: '240px', zIndex: 1000 }}>
                  <div style={{ padding: '8px' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={16} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                      <input type="text" value={brandSearchQuery} onChange={(e) => setBrandSearchQuery(e.target.value)} placeholder="브랜드 검색..." className="input" style={{ paddingLeft: '32px', fontSize: '14px' }} autoFocus />
                    </div>
                  </div>
                  <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                    {filteredBrands.map((brand, i) => (
                      <button key={i} onClick={() => handleBrandSelect(brand)} className="dropdown-item" style={{ justifyContent: 'space-between' }}>
                        <span>{brand.name}</span>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}>{brand.industry}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {formData.industry && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0 12px', height: '36px', borderRadius: '6px', backgroundColor: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>업종</span>
                <div style={{ width: '1px', height: '12px', backgroundColor: 'hsl(var(--border))' }} />
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--foreground))' }}>{formData.industry}</span>
              </div>
            )}
          </div>
          {validationActive && !formData.brand && (
            <div style={{ fontSize: '11px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>브랜드를 선택해 주세요.</div>
          )}
        </div>
      )}

      {/* Industry direct selector (mode: direct) */}
      {formData.industryMode === 'direct' && (
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            업종 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIndustryDropdownOpen(!industryDropdownOpen)}
              className="input"
              style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderColor: validationActive && !formData.industry ? 'hsl(var(--destructive))' : undefined, color: formData.industry ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
            >
              <span>{formData.industry || '업종을 선택하세요'}</span>
              <ChevronDown size={16} />
            </button>
            {industryDropdownOpen && (
              <div className="dropdown" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', maxHeight: '280px', overflowY: 'auto', zIndex: 1000 }}>
                {industryList.map((ind) => (
                  <button key={ind} onClick={() => { setFormData({ ...formData, industry: ind }); setIndustryDropdownOpen(false) }} className="dropdown-item">
                    {ind}
                  </button>
                ))}
              </div>
            )}
          </div>
          {validationActive && !formData.industry && (
            <div style={{ fontSize: '11px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>업종을 선택해 주세요.</div>
          )}
        </div>
      )}

      {/* 캠페인 기간 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          캠페인 기간 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
          최대 90일까지 설정할 수 있습니다.
        </div>
        <CustomDateRangePicker
          value={formData.period}
          onChange={(range) => setFormData({ ...formData, period: range })}
          hasError={validationActive && (!formData.period.start || !formData.period.end)}
        />
        {validationActive && (!formData.period.start || !formData.period.end) && (
          <div style={{ fontSize: '11px', color: 'hsl(var(--destructive))', marginTop: '8px' }}>캠페인 시작일과 종료일을 모두 선택해 주세요.</div>
        )}
      </div>

      {/* KPI 선택 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          KPI <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
          최적화할 KPI를 1개 선택하세요. 선택한 KPI를 극대화하는 방향으로 예산이 배분됩니다.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {Object.entries(KPI_LABELS).map(([key, label]) => {
            const icons: Record<string, any> = { impression: <Eye size={18} />, click: <MousePointerClick size={18} />, view: <Play size={18} />, reach: <Users size={18} /> }
            return (
              <button
                key={key}
                onClick={() => setFormData({ ...formData, kpi: key })}
                style={{
                  padding: '16px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  border: `1px solid ${formData.kpi === key ? 'hsl(var(--primary))' : validationActive && !formData.kpi ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}`,
                  backgroundColor: formData.kpi === key ? 'hsl(var(--primary) / 0.1)' : 'transparent'
                }}
              >
                <div style={{ marginBottom: '8px', color: formData.kpi === key ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}>{icons[key]}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'hsl(var(--foreground))' }}>{label}</div>
                <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginTop: '4px' }}>
                  {key === 'impression' && '노출 수 최대화'}
                  {key === 'click' && '클릭 수 최대화'}
                  {key === 'view' && '조회 수 최대화'}
                  {key === 'reach' && '도달률 최대화'}
                </div>
              </button>
            )
          })}
        </div>
        {validationActive && !formData.kpi && (
          <div style={{ fontSize: '11px', color: 'hsl(var(--destructive))', marginTop: '8px' }}>KPI를 선택해 주세요.</div>
        )}
      </div>
    </div>
  )
}
