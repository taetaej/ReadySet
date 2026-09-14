import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
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
    <div className="w-[800px]">
      <h2 className="text-xl font-semibold mb-6">기본 정보</h2>

      {/* 시나리오명 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          시나리오명 <span className="text-[hsl(var(--destructive))]">*</span>
        </label>
        <input
          type="text"
          value={formData.scenarioName}
          onChange={(e) => { if (e.target.value.length <= 50) setFormData({ ...formData, scenarioName: e.target.value }) }}
          placeholder="시나리오명을 입력하세요."
          className="input w-full"
          style={{ borderColor: validationActive && !formData.scenarioName ? 'hsl(var(--destructive))' : undefined }}
          maxLength={50}
        />
        {validationActive && !formData.scenarioName && (
          <div className="text-[11px] mt-1 text-[hsl(var(--destructive))]">시나리오명을 입력해 주세요.</div>
        )}
        <div className="text-xs mt-1 text-right text-[hsl(var(--muted-foreground))]">{formData.scenarioName.length}/50</div>
      </div>

      {/* 설명 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">설명</label>
        <textarea
          value={formData.description}
          onChange={(e) => { if (e.target.value.length <= 200) setFormData({ ...formData, description: e.target.value }) }}
          placeholder="시나리오에 대한 설명을 입력하세요."
          className="input w-full min-h-20 resize-y font-[inherit]"
          maxLength={200}
        />
        <div className="text-xs mt-1 text-right text-[hsl(var(--muted-foreground))]">{formData.description.length}/200</div>
      </div>

      <hr className="border-none border-t border-[hsl(var(--border))] my-8" />

      {/* 업종 식별 방식 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          업종 선택 <span className="text-[hsl(var(--destructive))]">*</span>
        </label>
        <div className="text-xs mb-3 text-[hsl(var(--muted-foreground))]">
          업종별 특화 최적화 모델(Meridian 활용)로 시나리오를 생성합니다.
        </div>
        <div className="flex gap-6">
          <label
            onClick={() => setFormData({ ...formData, industryMode: 'brand', industry: '', brand: '' })}
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <input type="radio" name="industryMode" checked={formData.industryMode === 'brand'} readOnly style={{ accentColor: 'hsl(var(--primary))' }} />
            <span className="font-medium">브랜드 선택</span>
          </label>
          <label
            onClick={() => setFormData({ ...formData, industryMode: 'direct', industry: '', brand: '' })}
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <input type="radio" name="industryMode" checked={formData.industryMode === 'direct'} readOnly style={{ accentColor: 'hsl(var(--primary))' }} />
            <span className="font-medium">업종 직접 선택</span>
          </label>
        </div>
        {validationActive && !formData.industryMode && (
          <div className="text-[11px] mt-2 text-[hsl(var(--destructive))]">업종 식별 방식을 선택해 주세요.</div>
        )}
      </div>

      {/* Brand selector (mode: brand) */}
      {formData.industryMode === 'brand' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            브랜드 <span className="text-[hsl(var(--destructive))]">*</span>
          </label>
          <div className="relative grid grid-cols-[1fr_auto] gap-3 items-center">
            <div className="relative">
              <button
                onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
                className="input w-full text-left flex items-center justify-between"
                style={{ borderColor: validationActive && !formData.brand ? 'hsl(var(--destructive))' : undefined, color: formData.brand ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
              >
                <span>{formData.brand || '브랜드를 선택하세요'}</span>
                <ChevronDown size={16} />
              </button>
              {brandDropdownOpen && (
                <div className="dropdown absolute top-full left-0 right-0 mt-1 max-h-60 z-[1000]">
                  <div className="p-2">
                    <div className="relative">
                      <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                      <input type="text" value={brandSearchQuery} onChange={(e) => setBrandSearchQuery(e.target.value)} placeholder="브랜드 검색..." className="input pl-8 text-sm" autoFocus />
                    </div>
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {filteredBrands.map((brand, i) => (
                      <button key={i} onClick={() => handleBrandSelect(brand)} className="dropdown-item justify-between">
                        <span>{brand.name}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">{brand.industry}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {formData.industry && (
              <div className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md whitespace-nowrap bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
                <span className="text-[11px] text-[hsl(var(--muted-foreground))]">업종</span>
                <div className="w-px h-3 bg-[hsl(var(--border))]" />
                <span className="text-[13px] font-medium text-[hsl(var(--foreground))]">{formData.industry}</span>
              </div>
            )}
          </div>
          {validationActive && !formData.brand && (
            <div className="text-[11px] mt-1 text-[hsl(var(--destructive))]">브랜드를 선택해 주세요.</div>
          )}
        </div>
      )}

      {/* Industry direct selector (mode: direct) */}
      {formData.industryMode === 'direct' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            업종 <span className="text-[hsl(var(--destructive))]">*</span>
          </label>
          <div className="relative">
            <button
              onClick={() => setIndustryDropdownOpen(!industryDropdownOpen)}
              className="input w-full text-left flex items-center justify-between"
              style={{ borderColor: validationActive && !formData.industry ? 'hsl(var(--destructive))' : undefined, color: formData.industry ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
            >
              <span>{formData.industry || '업종을 선택하세요'}</span>
              <ChevronDown size={16} />
            </button>
            {industryDropdownOpen && (
              <div className="dropdown absolute top-full left-0 right-0 mt-1 max-h-70 overflow-y-auto z-[1000]">
                {industryList.map((ind) => (
                  <button key={ind} onClick={() => { setFormData({ ...formData, industry: ind }); setIndustryDropdownOpen(false) }} className="dropdown-item">
                    {ind}
                  </button>
                ))}
              </div>
            )}
          </div>
          {validationActive && !formData.industry && (
            <div className="text-[11px] mt-1 text-[hsl(var(--destructive))]">업종을 선택해 주세요.</div>
          )}
        </div>
      )}

      {/* 캠페인 기간 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          캠페인 기간 <span className="text-[hsl(var(--destructive))]">*</span>
        </label>
        <div className="text-xs mb-3 text-[hsl(var(--muted-foreground))]">
          최대 90일까지 설정할 수 있습니다.
        </div>
        <CustomDateRangePicker
          value={formData.period}
          onChange={(range) => setFormData({ ...formData, period: range })}
          hasError={validationActive && (!formData.period.start || !formData.period.end)}
        />
        {validationActive && (!formData.period.start || !formData.period.end) && (
          <div className="text-[11px] mt-2 text-[hsl(var(--destructive))]">캠페인 시작일과 종료일을 모두 선택해 주세요.</div>
        )}
      </div>

      {/* KPI 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          KPI <span className="text-[hsl(var(--destructive))]">*</span>
        </label>
        <div className="text-xs mb-3 text-[hsl(var(--muted-foreground))]">
          최적화할 KPI를 1개 선택하세요. 선택한 KPI를 극대화하는 방향으로 예산이 배분됩니다.
        </div>
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(KPI_LABELS).map(([key, label]) => {
            return (
              <button
                key={key}
                onClick={() => setFormData({ ...formData, kpi: key })}
                className="px-3 py-4 rounded-lg cursor-pointer text-center transition-all"
                style={{
                  border: `1px solid ${formData.kpi === key ? 'hsl(var(--primary))' : validationActive && !formData.kpi ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}`,
                  backgroundColor: formData.kpi === key ? 'hsl(var(--primary) / 0.1)' : 'transparent'
                }}
              >
                <div className="text-sm font-semibold text-[hsl(var(--foreground))]">{label}</div>
                <div className="text-[11px] mt-1 text-[hsl(var(--muted-foreground))]">
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
          <div className="text-[11px] mt-2 text-[hsl(var(--destructive))]">KPI를 선택해 주세요.</div>
        )}
      </div>
    </div>
  )
}
