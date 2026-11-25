import { useLayoutEffect, useRef, useState } from 'react'
import { ChevronDown, Search, Paperclip, FileText, Image as ImageIcon, X } from 'lucide-react'
import { SpinXSymbol } from '../spinx/SpinXSymbol'
import { ACDateRangePicker } from './ACDateRangePicker'
import { ACPurposeCards } from './ACPurposeCards'
import { ACCreateFormData, AC_INDUSTRY_LIST, AC_MAX_PERIOD_DAYS, AC_DESCRIPTION_MAX, AC_ALLOWED_FILE_TYPES } from './types'
import { AC_SAMPLE_BRANDS } from './sampleData'

interface ACStep1Props {
  formData: ACCreateFormData
  setFormData: (data: ACCreateFormData) => void
  /** 첫 입력 이후 true. 입력 시작 전에는 에러를 표시하지 않음 */
  validationActive: boolean
  isSharedSlot: boolean
  onToast: (message: string) => void
}

const DAY_MS = 24 * 60 * 60 * 1000
/** 캠페인 설명 입력창 최대 높이(px). 넘으면 입력창 안에서 스크롤. 최소 높이는 클래스 min-h-[120px] */
const DESC_MAX_H = 320

/** yyyy-mm-dd → 로컬 자정 Date */
const parseDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const getToday = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/** 오늘 이전 날짜는 달력에서 비활성. 최대 기간은 선택 후 검사한다 (정의서 3.4) */
const validatePeriod = (range: { start: string; end: string }): string | null => {
  if (range.start && range.end) {
    const days = Math.round((parseDate(range.end).getTime() - parseDate(range.start).getTime()) / DAY_MS) + 1
    if (days > AC_MAX_PERIOD_DAYS) return `최대 ${AC_MAX_PERIOD_DAYS}일까지 설정할 수 있습니다.`
  }
  return null
}

interface ErrorTextProps {
  children: string
}

const ErrorText = ({ children }: ErrorTextProps) => (
  <div className="text-[11px] mt-1 text-[hsl(var(--destructive))]">{children}</div>
)

const Required = () => <span className="text-[hsl(var(--destructive))]">*</span>

export function ACStep1({ formData, setFormData, validationActive, isSharedSlot, onToast }: ACStep1Props) {
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  // 캠페인 설명: 내용에 맞춰 높이가 늘고, 최대 높이(DESC_MAX_H)를 넘으면 그 안에서 스크롤
  const descRef = useRef<HTMLTextAreaElement>(null)
  useLayoutEffect(() => {
    const el = descRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, DESC_MAX_H)}px`
  }, [formData.description])
  const [brandSearchQuery, setBrandSearchQuery] = useState('')
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false)
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false)
  const [periodError, setPeriodError] = useState<string | null>(null)

  const filteredBrands = AC_SAMPLE_BRANDS.filter(brand =>
    brand.name.toLowerCase().includes(brandSearchQuery.toLowerCase())
  )

  const updateFormData = (patch: Partial<ACCreateFormData>) => setFormData({ ...formData, ...patch })

  const handleFile = (file: File | undefined) => {
    if (!file) return
    if (!AC_ALLOWED_FILE_TYPES.includes(file.type)) { onToast('PDF, PNG, JPG 파일만 첨부할 수 있습니다.'); return }
    updateFormData({ contextFile: file.name })
  }

  const handlePeriodChange = (range: { start: string; end: string }) => {
    const error = validatePeriod(range)
    setPeriodError(error)
    if (error) return // 규칙에 맞지 않는 선택은 반영하지 않음
    updateFormData({ period: range })
  }

  const nameMissing = validationActive && !formData.name.trim()
  const brandMissing = validationActive && formData.industryMode === 'brand' && !formData.brand
  const industryMissing = validationActive && formData.industryMode === 'direct' && !formData.industry
  const periodMissing = validationActive && (!formData.period.start || !formData.period.end)
  const purposeMissing = validationActive && formData.purposes.length === 0

  const getErrorBorderClass = (hasError: boolean) => (hasError ? 'border-[hsl(var(--destructive))]' : '')

  return (
    <div className="w-[800px] font-[Paperlogy,sans-serif]">
      <h2 className="text-xl font-semibold mb-6">기본 정보</h2>

      {/* 큐레이션명 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">큐레이션명 <Required /></label>
        <input
          type="text"
          value={formData.name}
          onChange={e => updateFormData({ name: e.target.value })}
          placeholder="큐레이션명을 입력하세요."
          className={`input w-full ${getErrorBorderClass(nameMissing)}`}
          maxLength={50}
        />
        {nameMissing && <ErrorText>큐레이션명을 입력해 주세요.</ErrorText>}
        <div className="text-xs mt-1 text-right text-[hsl(var(--muted-foreground))]">{formData.name.length}/50</div>
      </div>

      <hr className="border-0 border-t border-[hsl(var(--border))] my-8" />

      {/* 업종 결정 방식 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">업종 선택 <Required /></label>
        <div className="flex gap-6">
          {([['brand', '브랜드 선택'], ['direct', '업종 직접 선택']] as const).map(([mode, label]) => (
            <label key={mode} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="industryMode"
                checked={formData.industryMode === mode}
                onChange={() => { if (formData.industryMode !== mode) updateFormData({ industryMode: mode, brand: '', industry: '' }) }}
                className="accent-[hsl(var(--primary))]"
              />
              <span className="font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 브랜드 */}
      {formData.industryMode === 'brand' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">브랜드 <Required /></label>
          <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                className={`input w-full text-left flex items-center justify-between ${getErrorBorderClass(brandMissing)} ${formData.brand ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`}
              >
                <span>{formData.brand || '브랜드를 선택하세요'}</span>
                <ChevronDown size={16} />
              </button>
              {isBrandDropdownOpen && (
                <div className="dropdown absolute top-full left-0 right-0 mt-1 max-h-60 z-[1000]">
                  <div className="p-2">
                    <div className="relative">
                      <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                      <input
                        type="text"
                        value={brandSearchQuery}
                        onChange={e => setBrandSearchQuery(e.target.value)}
                        placeholder="브랜드 검색..."
                        className="input pl-8 text-sm"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-40 overflow-y-auto custom-scrollbar">
                    {filteredBrands.map(brand => (
                      <button
                        key={brand.name}
                        type="button"
                        onClick={() => {
                          updateFormData({ brand: brand.name, industry: brand.industry })
                          setIsBrandDropdownOpen(false)
                          setBrandSearchQuery('')
                        }}
                        className="dropdown-item justify-between"
                      >
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
          {brandMissing && <ErrorText>브랜드를 선택해 주세요.</ErrorText>}
        </div>
      )}

      {/* 업종 직접 선택 */}
      {formData.industryMode === 'direct' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">업종 <Required /></label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsIndustryDropdownOpen(!isIndustryDropdownOpen)}
              className={`input w-full text-left flex items-center justify-between ${getErrorBorderClass(industryMissing)} ${formData.industry ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`}
            >
              <span>{formData.industry || '업종을 선택하세요'}</span>
              <ChevronDown size={16} />
            </button>
            {isIndustryDropdownOpen && (
              <div className="dropdown absolute top-full left-0 right-0 mt-1 max-h-70 overflow-y-auto custom-scrollbar z-[1000]">
                {AC_INDUSTRY_LIST.map(ind => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => { updateFormData({ industry: ind }); setIsIndustryDropdownOpen(false) }}
                    className="dropdown-item"
                  >
                    {ind}
                  </button>
                ))}
              </div>
            )}
          </div>
          {industryMissing && <ErrorText>업종을 선택해 주세요.</ErrorText>}
        </div>
      )}

      {/* 캠페인 기간 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">캠페인 기간 <Required /></label>
        <div className="text-xs mb-3 text-[hsl(var(--muted-foreground))]">최대 {AC_MAX_PERIOD_DAYS}일까지 설정할 수 있습니다.</div>
        <ACDateRangePicker
          value={formData.period}
          onChange={handlePeriodChange}
          hasError={!!periodError || periodMissing}
          minDate={getToday()}
        />
        {periodError
          ? <ErrorText>{periodError}</ErrorText>
          : periodMissing && <ErrorText>캠페인 시작일과 종료일을 모두 선택해 주세요.</ErrorText>}
      </div>

      {/* 캠페인 목적 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">캠페인 목적 <Required /></label>
        <div className="text-xs mb-3 text-[hsl(var(--muted-foreground))]">선택한 목적에 맞는 매체·상품을 선별합니다. 여러 개를 선택할 수 있습니다.</div>
        <ACPurposeCards value={formData.purposes} onChange={purposes => updateFormData({ purposes })} hasError={purposeMissing} />
        {purposeMissing && <ErrorText>최소 1개 이상의 캠페인 목적을 선택해 주세요.</ErrorText>}
      </div>

      {/* 캠페인 설명 = 캠페인 맥락 프롬프트 (SpinX 패널 입력창과 같은 구성). SpinX가 읽고 Step 2 기준 채우기를 도움 */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <label className="text-sm font-medium">캠페인 설명 <span className="text-xs font-normal text-[hsl(var(--muted-foreground))]">(선택)</span></label>
          <span className="flex items-center gap-1.5">
            <SpinXSymbol size={13} motion="idle" title="" className="rotate-45 shrink-0" />
            <span className="text-[11px] font-semibold tracking-[0.02em] text-[hsl(var(--muted-foreground))]">SpinX for Ad Curator</span>
          </span>
        </div>
        <div className="text-xs mb-3 leading-[1.6] text-[hsl(var(--muted-foreground))]">
          캠페인 내용을 적거나 파일을 첨부해 두면, 다음 단계에서 SpinX가 매체·소재·예산 등 선별 기준을 미리 채워 드립니다.
        </div>
        <div className="relative rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] transition-colors duration-200 focus-within:border-[hsl(var(--ring))]">
          {formData.contextFile && (
            <div className="inline-flex items-center gap-2 mt-3 mx-4 px-2.5 py-1.5 rounded-md border border-[hsl(var(--border))] text-xs">
              <FileText size={14} className="text-[hsl(var(--muted-foreground))]" />
              {formData.contextFile}
              <button type="button" aria-label="첨부 삭제" onClick={() => updateFormData({ contextFile: null })} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                <X size={12} />
              </button>
            </div>
          )}
          {/* 높이는 내용에 맞춰 자동 조절(최대 DESC_MAX_H 후 스크롤). 하단 도구 줄과 겹치지 않도록 도구 줄은 입력창 밖 별도 줄 */}
          <textarea
            ref={descRef}
            value={formData.description}
            onChange={e => updateFormData({ description: e.target.value })}
            placeholder="매체, 소재, 예산 등 정해 둔 캠페인 내용을 입력하세요. 캠페인 정보가 담긴 파일도 첨부할 수 있습니다."
            className="block w-full min-h-[120px] pt-3 px-4 pb-2 bg-transparent border-0 outline-none resize-none overflow-y-auto custom-scrollbar text-sm leading-[1.6] font-[inherit] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
            maxLength={AC_DESCRIPTION_MAX}
          />
          <div className="flex items-center gap-2 px-2 pb-2">
            <div className="relative">
              <button
                type="button"
                title="파일 첨부"
                aria-label="파일 첨부"
                disabled={!!formData.contextFile}
                onClick={() => setIsAttachMenuOpen(!isAttachMenuOpen)}
                className={`btn btn-ghost btn-sm p-1.5 ${formData.contextFile ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Paperclip size={16} />
              </button>
              {isAttachMenuOpen && (
                <div className="dropdown absolute bottom-full left-0 mb-1 w-40 z-[1000]">
                  <button type="button" className="dropdown-item" onClick={() => { setIsAttachMenuOpen(false); imageInputRef.current?.click() }}>
                    <ImageIcon size={16} /> 이미지 추가
                  </button>
                  <button type="button" className="dropdown-item" onClick={() => { setIsAttachMenuOpen(false); pdfInputRef.current?.click() }}>
                    <FileText size={16} /> PDF 추가
                  </button>
                </div>
              )}
            </div>
            <span className="text-xs text-[hsl(var(--muted-foreground))]">{formData.description.length}/{AC_DESCRIPTION_MAX}</span>
          </div>
          <input ref={imageInputRef} type="file" accept="image/png,image/jpeg" hidden onChange={e => { handleFile(e.target.files?.[0]); e.target.value = '' }} />
          <input ref={pdfInputRef} type="file" accept="application/pdf" hidden onChange={e => { handleFile(e.target.files?.[0]); e.target.value = '' }} />
        </div>
      </div>

      <hr className="border-0 border-t border-[hsl(var(--border))] my-8" />

      {/* 프로모션 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">매체 프로모션 <Required /></label>
        <div className="text-xs mb-3 leading-[1.6] text-[hsl(var(--muted-foreground))]">
          캠페인 기간과 겹치는 매체 프로모션을 결과에 함께 표시합니다.<br />
          프로모션에는 외부에 공개할 수 없는 정보가 포함될 수 있어 Shared Slot에서는 포함할 수 없습니다.
        </div>
        <div className="flex gap-6">
          {([[true, '포함'], [false, '미포함']] as const).map(([included, label]) => {
            const disabled = included && isSharedSlot
            return (
              <label
                key={label}
                className={`flex items-center gap-2 text-sm ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <input
                  type="radio"
                  name="promotion"
                  checked={formData.promotionIncluded === included}
                  disabled={disabled}
                  onChange={() => updateFormData({ promotionIncluded: included })}
                  className="accent-[hsl(var(--primary))]"
                />
                <span className="font-medium">{label}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
