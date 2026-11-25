import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowRight, Info, X } from 'lucide-react'
import { KPI_LABELS } from '../budgetoptimizer/types'
import { boMediaData } from '../budgetoptimizer/constants'
import { CustomDateRangePicker } from '../reachcaster/CustomDateRangePicker'
import { numberToKorean } from '../scenario/utils'
import type { ACCuration } from './types'
import type { ACResultItem } from './resultTypes'

/** BudgetOpt 2.0 시나리오에 필요한 최소 상품 수 (BudgetOptimizer_Scenario_Creation_Spec V2) */
const BO_MIN_PRODUCTS = 2
/** BudgetOpt 2.0 시나리오 최대 상품 수 */
const BO_MAX_PRODUCTS = 30
/** BudgetOpt 2.0 생성 화면과 같은 입력 제한 */
const SCENARIO_NAME_MAX = 50
const BUDGET_MAX_DIGITS = 11
const PERIOD_MAX_DAYS = 90
const DAY_MS = 24 * 60 * 60 * 1000

/** 전달 판별 결과: 전달 / 미지원 매체(항상 제외) / 학습 결과 없음(업종·KPI 조합에 따라 제외) */
type TransferStatus = 'ok' | 'unsupported' | 'noModel'

/** 미지원 매체: 결과 데이터가 미지원으로 표시했거나 BudgetOpt 2.0 매체 카탈로그에 없는 매체·상품 */
const isUnsupported = (item: ACResultItem) => {
  if (item.boUnsupported) return true
  const products = (boMediaData as Record<string, string[]>)[item.mediaName]
  return !products || !products.includes(item.productName)
}

/** 학습 결과 없음: 큐레이션 업종에서 선택한 KPI의 모델 학습 결과가 없는 매체·상품 */
const hasNoModel = (item: ACResultItem, kpi: string) => !!item.boNoModelKpis?.includes(kpi)

/** 시작~종료 일수 (양 끝 포함) */
const periodDays = (start: string, end: string) =>
  Math.round((new Date(end).getTime() - new Date(start).getTime()) / DAY_MS) + 1

export interface ACBudgetOptConfirm {
  scenarioName: string
  totalBudget: number
  kpi: string
  period: { start: string; end: string }
  products: { mediaName: string; productName: string }[]
}

interface ACBudgetOptDialogProps {
  curation: ACCuration
  /** 담은 매체·상품 (담은 순서) */
  items: ACResultItem[]
  onClose: () => void
  /** 전달 내역 행의 × → 담기에서 빼기 (목록의 담기 상태와 함께 바뀜) */
  onRemove: (id: string) => void
  onConfirm: (params: ACBudgetOptConfirm) => void
}

/**
 * BudgetOpt 2.0 간편 생성 다이얼로그 (화면정의서 8.3, md 크기)
 * BudgetOpt 2.0 결과의 "최적화 예산으로 도달 예측하기"(BOReachCasterEasyCreateModal)와 같은 구성.
 * 입력 필드는 BudgetOpt 2.0 시나리오 생성(BOStep1·BOStep2)과 같은 컴포넌트·제한·문구를 씀
 */
export function ACBudgetOptDialog({ curation, items, onClose, onRemove, onConfirm }: ACBudgetOptDialogProps) {
  // 시나리오명 프리필: (AC-{큐레이션 ID}) {큐레이션명}. 수정 가능, 50자 제한
  const [scenarioName, setScenarioName] = useState(() => `(AC-${curation.id}) ${curation.name}`.slice(0, SCENARIO_NAME_MAX))
  // 캠페인 기간 프리필: 큐레이션 기간이 90일 이하면 그대로, 넘으면 비움(다시 선택)
  const periodTooLong = periodDays(curation.startDate, curation.endDate) > PERIOD_MAX_DAYS
  const [period, setPeriod] = useState(() => periodTooLong ? { start: '', end: '' } : { start: curation.startDate, end: curation.endDate })
  const [totalBudget, setTotalBudget] = useState(0)
  const [kpi, setKpi] = useState('')
  // 첫 입력 이후부터 에러 표시
  const [validationActive, setValidationActive] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // 전달 내역 검증: KPI를 바꿀 때마다 다시 판별 (학습 결과 없음은 KPI를 고른 뒤에만 판별)
  const { statusOf, supported, unsupported, noModel } = useMemo(() => {
    const statusOf = (item: ACResultItem): TransferStatus =>
      isUnsupported(item) ? 'unsupported'
        : kpi && hasNoModel(item, kpi) ? 'noModel'
        : 'ok'
    return {
      statusOf,
      supported: items.filter(i => statusOf(i) === 'ok'),
      unsupported: items.filter(i => statusOf(i) === 'unsupported'),
      noModel: items.filter(i => statusOf(i) === 'noModel')
    }
  }, [items, kpi])

  const nameValid = scenarioName.trim().length > 0
  const periodValid = !!period.start && !!period.end
  const enoughItems = supported.length >= BO_MIN_PRODUCTS
  const tooManyItems = supported.length > BO_MAX_PRODUCTS
  const canCreate = nameValid && periodValid && totalBudget > 0 && !!kpi && enoughItems && !tooManyItems

  const handleNameChange = (value: string) => {
    if (value.length <= SCENARIO_NAME_MAX) setScenarioName(value)
    setValidationActive(true)
  }
  const handlePeriodChange = (range: { start: string; end: string }) => {
    setPeriod(range)
    setValidationActive(true)
  }
  const handleBudgetChange = (raw: string) => {
    const digits = raw.replace(/,/g, '')
    // 숫자만, 최대 11자리까지 (그 이상은 입력 차단)
    if (digits !== '' && !/^\d+$/.test(digits)) return
    if (digits.length > BUDGET_MAX_DIGITS) return
    setTotalBudget(parseInt(digits) || 0)
    setValidationActive(true)
  }
  const handleKpiSelect = (key: string) => {
    setKpi(key)
    setValidationActive(true)
  }
  const handleConfirm = () => {
    if (!canCreate) return
    onConfirm({
      scenarioName: scenarioName.trim(),
      totalBudget,
      kpi,
      period,
      products: supported.map(i => ({ mediaName: i.mediaName, productName: i.productName }))
    })
  }

  const nameError = validationActive && !nameValid
  const periodError = validationActive && !periodValid
  const budgetError = validationActive && !(totalBudget > 0)
  const kpiError = validationActive && !kpi
  const labelCls = 'block text-[13px] font-semibold text-[hsl(var(--foreground))] mb-2'
  const required = <span className="text-[hsl(var(--destructive))]">*</span>
  const errorCls = 'text-[11px] mt-1 text-[hsl(var(--destructive))]'

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog-content dialog-md flex flex-col max-h-[86vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ac-bo-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="dialog-header flex-shrink-0">
          <h3 id="ac-bo-title" className="dialog-title">담은 매체·상품으로 예산 최적화하기</h3>
          <p className="dialog-description">큐레이션의 업종·기간과 담은 매체·상품을 BudgetOpt 2.0 예산 최적화로 가져갑니다.</p>
          <p className="m-0 flex items-center gap-[5px] text-[12px] text-[hsl(var(--muted-foreground))]">
            <Info size={12} className="shrink-0" />
            생성되는 BudgetOpt 2.0 시나리오는 현재 Slot 안에 함께 만들어집니다.
          </p>
        </div>

        {/* 본문 여백 p-6: BudgetOpt 2.0 결과의 "최적화 예산으로 도달 예측하기" 다이얼로그와 같음 */}
        <div className="p-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          {/* 시나리오명 (BudgetOpt 2.0 생성 Step 1과 같은 입력·제한·문구) */}
          <div className="mb-5">
            <label htmlFor="ac-bo-name" className={labelCls}>시나리오명 {required}</label>
            <input
              id="ac-bo-name"
              type="text"
              value={scenarioName}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="시나리오명을 입력하세요."
              className={`input w-full ${nameError ? 'border-[hsl(var(--destructive))]' : ''}`}
              maxLength={SCENARIO_NAME_MAX}
            />
            {nameError && <div className={errorCls}>시나리오명을 입력해 주세요.</div>}
            <div className="text-xs mt-1 text-right text-[hsl(var(--muted-foreground))]">{scenarioName.length}/{SCENARIO_NAME_MAX}</div>
          </div>

          {/* 업종 (큐레이션 값, 변경 불가) */}
          <div className="mb-5">
            <div className={labelCls}>업종</div>
            {/* 바꿀 수 없는 값은 입력칸이 아닌 텍스트로 (BudgetOpt 2.0 결과 다이얼로그의 시나리오명 표시와 같음) */}
            <div className="text-[14px] text-[hsl(var(--foreground))]">{curation.industry}</div>
          </div>

          {/* 캠페인 기간 (BudgetOpt 2.0 생성 Step 1과 같은 컴포넌트·안내·문구) */}
          <div className="mb-5">
            <div className={labelCls}>캠페인 기간 {required}</div>
            <div className="text-xs mb-2 text-[hsl(var(--muted-foreground))]">
              최대 {PERIOD_MAX_DAYS}일까지 설정할 수 있습니다.
              {periodTooLong && ` 큐레이션 기간이 ${PERIOD_MAX_DAYS}일을 넘어 다시 선택해야 합니다.`}
            </div>
            <CustomDateRangePicker value={period} onChange={handlePeriodChange} hasError={periodError} />
            {periodError && <div className={errorCls}>캠페인 시작일과 종료일을 모두 선택해 주세요.</div>}
          </div>

          {/* 총 예산 (BudgetOpt 2.0 생성 Step 2와 같은 규칙) */}
          <div className="mb-5">
            <label htmlFor="ac-bo-budget" className={labelCls}>총 예산 {required}</label>
            <div className="flex items-center gap-3">
              <div className="relative w-[260px]">
                <input
                  id="ac-bo-budget"
                  type="text"
                  inputMode="numeric"
                  value={totalBudget > 0 ? totalBudget.toLocaleString() : ''}
                  onChange={e => handleBudgetChange(e.target.value)}
                  placeholder="총 예산을 입력하세요"
                  className={`input w-full pr-10 ${budgetError ? 'border-[hsl(var(--destructive))]' : ''}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[hsl(var(--muted-foreground))]">원</span>
              </div>
              {totalBudget > 0 && (
                <span className="text-[13px] text-[hsl(var(--muted-foreground))] whitespace-nowrap">= {numberToKorean(totalBudget)}</span>
              )}
            </div>
            {budgetError && <div className={errorCls}>총 예산을 입력해 주세요.</div>}
          </div>

          {/* KPI (BudgetOpt 2.0 생성 Step 1과 같은 항목·문구) */}
          <div className="mb-6">
            <div className={labelCls}>KPI {required}</div>
            <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="KPI">
              {Object.entries(KPI_LABELS).map(([key, label]) => {
                const selected = kpi === key
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => handleKpiSelect(key)}
                    className={`px-2 py-3 rounded-lg border text-center text-[13px] font-semibold text-[hsl(var(--foreground))] cursor-pointer transition-colors duration-200
                      ${selected
                        ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]'
                        : kpiError ? 'border-[hsl(var(--destructive))] bg-transparent' : 'border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--muted)/0.4)]'}`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            {kpiError && <div className="text-[11px] mt-2 text-[hsl(var(--destructive))]">KPI를 선택해 주세요.</div>}
          </div>

          {/* 매체·상품 전달 내역 (BudgetOpt 2.0 결과의 전달 내역 표와 같은 구성) */}
          <div>
            <div className="text-[13px] font-semibold text-[hsl(var(--foreground))]">매체·상품 전달 내역</div>
            <div className="text-[12px] text-[hsl(var(--muted-foreground))] mt-[2px] mb-[6px]">
              <span className={tooManyItems ? 'text-[hsl(var(--destructive))]' : ''}>전달 {supported.length} / {BO_MAX_PRODUCTS}개</span>
              {unsupported.length > 0 && ` · 미지원 매체 ${unsupported.length}개`}
              {noModel.length > 0 && ` · 학습 결과 없음 ${noModel.length}개`}
            </div>
            {items.length > 0 ? (
              <div className="border border-[hsl(var(--border))] rounded-lg overflow-hidden">
                <div className="px-3 py-[9px] bg-[hsl(var(--muted)/0.3)] text-[11px] font-semibold text-[hsl(var(--muted-foreground))]">매체 &gt; 상품</div>
                <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                  {[...unsupported, ...noModel, ...supported].map(item => {
                    const status = statusOf(item)
                    const excluded = status !== 'ok'
                    return (
                      <div key={item.id} className={`flex items-center gap-[6px] px-3 py-[9px] text-[12px] border-t border-[hsl(var(--border))] ${excluded ? 'bg-[hsl(var(--muted)/0.25)]' : ''}`}>
                        <span
                          className={`min-w-0 overflow-hidden text-ellipsis whitespace-nowrap ${excluded ? 'line-through text-[hsl(var(--muted-foreground))]' : 'text-[hsl(var(--foreground))]'}`}
                          title={`${item.mediaName} > ${item.productName}`}
                        >
                          {item.mediaName} &gt; {item.productName}
                        </span>
                        {status === 'unsupported' && (
                          <span className="flex-shrink-0 inline-flex items-center gap-[3px] text-[10px] px-[6px] py-[1px] rounded-full bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))]">
                            <AlertTriangle size={9} /> 미지원 매체
                          </span>
                        )}
                        {/* 고칠 수 있는 상태(KPI 변경)라 경고색 대신 muted */}
                        {status === 'noModel' && (
                          <span className="flex-shrink-0 inline-flex items-center text-[10px] px-[6px] py-[1px] rounded-full bg-[hsl(var(--muted-foreground)/0.12)] text-[hsl(var(--muted-foreground))]">
                            학습 결과 없음
                          </span>
                        )}
                        {/* 빼기: 확인 없이 바로 빠짐 (목록의 담기도 함께 해제) */}
                        <button
                          type="button"
                          onClick={() => onRemove(item.id)}
                          aria-label={`${item.productName} 빼기`}
                          className="ml-auto flex-shrink-0 inline-flex p-0.5 rounded bg-transparent border-none cursor-pointer text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/0.6)] transition-colors duration-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="py-6 rounded-lg border border-dashed border-[hsl(var(--border))] text-center text-[12px] text-[hsl(var(--muted-foreground))]">
                담은 매체·상품이 없습니다.
              </div>
            )}
            {unsupported.length > 0 && (
              <div className="mt-[10px] flex items-start gap-[5px] text-[11px] leading-[1.5] text-[hsl(var(--muted-foreground))]">
                <AlertTriangle size={12} className="shrink-0 mt-[1px] text-[hsl(var(--destructive))]" />
                <span>
                  <strong className="font-semibold text-[hsl(var(--foreground))]">미지원 매체</strong> — BudgetOpt 2.0이 지원하지 않는 매체·상품으로, 전달되지 않습니다.
                </span>
              </div>
            )}
            {noModel.length > 0 && (
              <div className="mt-[6px] flex items-start gap-[5px] text-[11px] leading-[1.5] text-[hsl(var(--muted-foreground))]">
                <Info size={12} className="shrink-0 mt-[1px]" />
                <span>
                  <strong className="font-semibold text-[hsl(var(--foreground))]">학습 결과 없음</strong> — 이 업종과 KPI로 학습된 모델에 없는 상품으로, 전달되지 않습니다.
                </span>
              </div>
            )}
            {/* 그룹 레벨 유효성 메시지 (ui-validation-message-policy: 12px destructive, 아이콘·배경 없음, 최소 선택 패턴) */}
            {tooManyItems && (
              <p className="m-0 mt-2 text-[12px] leading-[1.5] text-[hsl(var(--destructive))]">
                최대 {BO_MAX_PRODUCTS}개까지 전달할 수 있습니다. {supported.length - BO_MAX_PRODUCTS}개를 빼 주세요.
              </p>
            )}
            {!enoughItems && (
              <p className="m-0 mt-2 text-[12px] leading-[1.5] text-[hsl(var(--destructive))]">
                {noModel.length > 0
                  ? `최소 ${BO_MIN_PRODUCTS}개 이상의 매체·상품이 전달되어야 합니다. 다른 KPI를 선택하거나 더 담아 주세요.`
                  : `최소 ${BO_MIN_PRODUCTS}개 이상의 매체·상품을 담아 주세요.`}
              </p>
            )}
          </div>
        </div>

        <div className="dialog-footer flex-shrink-0">
          <button type="button" onClick={onClose} className="btn btn-secondary btn-md">취소</button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canCreate}
            className="btn btn-primary btn-md inline-flex items-center gap-[6px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            BudgetOpt 2.0 생성 <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
