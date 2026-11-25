import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown, Info } from 'lucide-react'
import { ACDateRangePicker } from './ACDateRangePicker'
import { ACPurposeCards } from './ACPurposeCards'
import { ACDatasetPrefill, ACPurpose, AC_MAX_PERIOD_DAYS, PURPOSE_ORDER } from './types'

interface ACCreateFromDatasetModalProps {
  onClose: () => void
  datasetName: string
  /** 데이터셋 업종 경로 (`대 > 중 > 소` 또는 `대`), 다중 */
  datasetIndustries: string[]
  /** 데이터셋이 속한 Slot이 Shared이면 true → 매체 프로모션 `미포함` 고정 */
  slotShared: boolean
}

const NAME_MAX = 50
const DAY_MS = 24 * 60 * 60 * 1000

const parseDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const getToday = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/** 시작일·종료일 포함 최대 180일 (정의서 §C.4) */
const validatePeriod = (range: { start: string; end: string }): string | null => {
  if (range.start && range.end) {
    const days = Math.round((parseDate(range.end).getTime() - parseDate(range.start).getTime()) / DAY_MS) + 1
    if (days > AC_MAX_PERIOD_DAYS) return `최대 ${AC_MAX_PERIOD_DAYS}일까지 설정할 수 있습니다.`
  }
  return null
}

/** 업종 경로를 대분류로 환원하고 중복 제거 (입력 순서 유지, 정의서 §C.3) */
export const toMajorCategories = (industries: string[]): string[] => {
  const majors = industries.map(path => path.split('>')[0].trim()).filter(Boolean)
  return [...new Set(majors)]
}

const ErrorText = ({ children }: { children: string }) => (
  <div className="text-[11px] mt-1 text-[hsl(var(--destructive))]">{children}</div>
)

const Required = () => <span className="text-[hsl(var(--destructive))]">*</span>

const errorBorder = (hasError: boolean) => (hasError ? 'border-[hsl(var(--destructive))]' : '')

/**
 * DataShot 데이터셋 상세 → Ad Curator 큐레이션 생성 모달.
 * 큐레이션을 즉시 만들지 않고, 입력값을 프리필해 생성 화면 Step 1로 이동한다.
 * 닫으면 부모가 언마운트하므로 다시 열 때 항상 초기값으로 시작한다.
 */
export function ACCreateFromDatasetModal({ onClose, datasetName, datasetIndustries, slotShared }: ACCreateFromDatasetModalProps) {
  const navigate = useNavigate()
  const majors = toMajorCategories(datasetIndustries)
  const singleIndustry = majors.length === 1

  const [name, setName] = useState(`(AC) ${datasetName}`.slice(0, NAME_MAX))
  const [industry, setIndustry] = useState(singleIndustry ? majors[0] : '')
  const [period, setPeriod] = useState({ start: '', end: '' })
  const [periodError, setPeriodError] = useState<string | null>(null)
  const [purposes, setPurposes] = useState<ACPurpose[]>([])
  const [promotionIncluded, setPromotionIncluded] = useState(!slotShared)
  /** 첫 입력 이후 true. 열린 직후에는 에러를 표시하지 않음 */
  const [validationActive, setValidationActive] = useState(false)
  const [industryOpen, setIndustryOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const industryRef = useRef<HTMLDivElement>(null)

  const touch = () => setValidationActive(true)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    if (!industryOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (industryRef.current && !industryRef.current.contains(e.target as Node)) setIndustryOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [industryOpen])

  const handlePeriodChange = (range: { start: string; end: string }) => {
    touch()
    const error = validatePeriod(range)
    setPeriodError(error)
    if (error) return // 규칙에 맞지 않는 선택은 반영하지 않음
    setPeriod(range)
  }

  const nameMissing = validationActive && !name.trim()
  const industryMissing = validationActive && !industry
  const periodMissing = validationActive && (!period.start || !period.end)
  const purposeMissing = validationActive && purposes.length === 0

  const canProceed = !!name.trim() && !!industry && !!period.start && !!period.end && purposes.length > 0

  const handleProceed = () => {
    if (!canProceed) return
    const datasetPrefill: ACDatasetPrefill = {
      source: 'dataset',
      name: name.trim(),
      industry,
      period,
      purposes: PURPOSE_ORDER.filter(p => purposes.includes(p)),
      promotionIncluded: slotShared ? false : promotionIncluded,
      slotShared
    }
    navigate('/adcurator/curation/new', { state: { datasetPrefill } })
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className={`dialog-content dialog-md flex flex-col ${calendarOpen ? 'overflow-visible' : 'max-h-[86vh]'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="dialog-header shrink-0">
          <h3 className="dialog-title">큐레이션 만들기</h3>
          <p className="dialog-description">데이터셋의 업종 맥락을 Ad Curator로 가져가 캠페인에 맞는 매체·상품을 선별합니다.</p>
          <p className="flex items-center gap-[5px] mt-2 text-xs text-[hsl(var(--muted-foreground))]">
            <Info size={12} className="shrink-0" />
            생성되는 Ad Curator 큐레이션은 현재 Slot 안에 함께 만들어집니다.
          </p>
        </div>

        <div className={`flex-1 p-6 font-[Paperlogy,sans-serif] ${calendarOpen ? 'overflow-visible' : 'overflow-y-auto custom-scrollbar'}`}>
          {/* 큐레이션명 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">큐레이션명 <Required /></label>
            <input
              type="text"
              value={name}
              onChange={e => { touch(); setName(e.target.value) }}
              placeholder="큐레이션명을 입력하세요."
              className={`input w-full ${errorBorder(nameMissing)}`}
              maxLength={NAME_MAX}
            />
            {nameMissing && <ErrorText>큐레이션명을 입력해 주세요.</ErrorText>}
            <div className="text-xs mt-1 text-right text-[hsl(var(--muted-foreground))]">{name.length}/{NAME_MAX}</div>
          </div>

          {/* 업종: 대분류 1개면 읽기 표시, 2개 이상이면 그 대분류만 담은 드롭리스트 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">업종 <Required /></label>
            {singleIndustry ? (
              <div className="text-sm text-[hsl(var(--foreground))]">{industry}</div>
            ) : (
              <div ref={industryRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIndustryOpen(!industryOpen)}
                  className={`input w-full text-left flex items-center justify-between ${errorBorder(industryMissing)} ${industry ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`}
                >
                  <span>{industry || '업종을 선택하세요'}</span>
                  <ChevronDown size={16} />
                </button>
                {industryOpen && (
                  <div className="dropdown absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto custom-scrollbar z-[1000]">
                    {majors.map(major => (
                      <button
                        key={major}
                        type="button"
                        onClick={() => { touch(); setIndustry(major); setIndustryOpen(false) }}
                        className="dropdown-item"
                      >
                        {major}
                      </button>
                    ))}
                  </div>
                )}
                {industryMissing && <ErrorText>업종을 선택해 주세요.</ErrorText>}
              </div>
            )}
          </div>

          {/* 캠페인 기간: 데이터셋 조회기간(과거)은 가져오지 않음 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">캠페인 기간 <Required /></label>
            <div className="text-xs mb-3 text-[hsl(var(--muted-foreground))]">최대 {AC_MAX_PERIOD_DAYS}일까지 설정할 수 있습니다.</div>
            <ACDateRangePicker
              value={period}
              onChange={handlePeriodChange}
              hasError={!!periodError || periodMissing}
              minDate={getToday()}
              onOpenChange={setCalendarOpen}
            />
            {periodError
              ? <ErrorText>{periodError}</ErrorText>
              : periodMissing && <ErrorText>캠페인 시작일과 종료일을 모두 선택해 주세요.</ErrorText>}
          </div>

          {/* 캠페인 목적: 미선택으로 시작 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">캠페인 목적 <Required /></label>
            <div className="text-xs mb-3 text-[hsl(var(--muted-foreground))]">선택한 목적에 맞는 매체·상품을 선별합니다. 여러 개를 선택할 수 있습니다.</div>
            <ACPurposeCards value={purposes} onChange={next => { touch(); setPurposes(next) }} hasError={purposeMissing} columns={2} />
            {purposeMissing && <ErrorText>최소 1개 이상의 캠페인 목적을 선택해 주세요.</ErrorText>}
          </div>

          {/* 매체 프로모션: Shared Slot이면 미포함 고정 */}
          <div>
            <label className="block text-sm font-medium mb-2">매체 프로모션 <Required /></label>
            <div className="text-xs mb-3 leading-[1.6] text-[hsl(var(--muted-foreground))]">
              캠페인 기간과 겹치는 매체 프로모션을 결과에 함께 표시합니다.<br />
              프로모션에는 외부에 공개할 수 없는 정보가 포함될 수 있어 Shared Slot에서는 포함할 수 없습니다.
            </div>
            <div className="flex gap-6">
              {([[true, '포함'], [false, '미포함']] as const).map(([included, label]) => {
                const disabled = included && slotShared
                return (
                  <label
                    key={label}
                    className={`flex items-center gap-2 text-sm ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <input
                      type="radio"
                      name="ac-dataset-promotion"
                      checked={(slotShared ? false : promotionIncluded) === included}
                      disabled={disabled}
                      onChange={() => { if (disabled) return; touch(); setPromotionIncluded(included) }}
                      className="accent-[hsl(var(--primary))]"
                    />
                    <span className="font-medium">{label}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        <div className="dialog-footer shrink-0">
          <button type="button" onClick={onClose} className="btn btn-secondary btn-md">취소</button>
          <button
            type="button"
            onClick={handleProceed}
            disabled={!canProceed}
            className={`btn btn-primary btn-md inline-flex items-center gap-1.5 ${canProceed ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
          >
            Ad Curator로 이동 <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
