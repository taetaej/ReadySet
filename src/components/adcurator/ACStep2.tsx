import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Info, ListPlus, X } from 'lucide-react'
import { SpinXSymbol } from '../spinx/SpinXSymbol'
import { ACAddCriteriaDialog } from './ACAddCriteriaDialog'
import { ACAnalysis, ACCondition, ACCreateFormData } from './types'
import { CONDITION_BY_ID, formatValues, orderValues, traitSentence } from './acConditions'

interface ACStep2Props {
  formData: ACCreateFormData
  setFormData: (data: ACCreateFormData) => void
  /** Step 1 맥락 분석 결과. 맥락이 없었으면 null */
  analysis: ACAnalysis | null
  isAnalyzing: boolean
  /** 다음 단계로 가려 했는지. true면 값이 빈 행에 에러 표시 */
  validationActive: boolean
}

const MAX_BUDGET_DIGITS = 6

/**
 * Step 2 상세 설정 (정의서 4장).
 * Step 1 캠페인 설명에서 SpinX가 파싱한 기준(기준 + 항목 값)을 행으로 매핑. 사용자는 값을 확인·수정하고, 필요하면 [기준 추가]로 더함.
 */
export function ACStep2({ formData, setFormData, analysis, isAnalyzing, validationActive }: ACStep2Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const rows = formData.conditions
  const setCount = rows.filter(r => r.values.length > 0).length
  const hasContext = !!(formData.contextFile || formData.description.trim())

  const updateRow = (id: string, values: string[]) =>
    setFormData({ ...formData, conditions: rows.map(r => (r.id === id ? { id, values: orderValues(id, values), source: 'user' as const } : r)) })
  const removeRow = (id: string) => setFormData({ ...formData, conditions: rows.filter(r => r.id !== id) })
  const addRows = (ids: string[]) => {
    setFormData({ ...formData, conditions: [...rows, ...ids.map(id => ({ id, values: [] }))] })
    setIsDialogOpen(false)
  }

  if (isAnalyzing) {
    return (
      <div className="w-[800px]">
        <h2 className="text-xl font-semibold mb-6">상세 설정 <span className="text-sm font-normal text-[hsl(var(--muted-foreground))]">(선택)</span></h2>
        <div className="min-h-[360px] flex flex-col items-center justify-center gap-3 text-[hsl(var(--muted-foreground))]" aria-live="polite">
          <SpinXSymbol size={40} motion="active" title="" className="rotate-45" />
          <div className="text-sm font-medium text-[hsl(var(--foreground))]">캠페인 설명을 분석하고 있습니다.</div>
          <div className="text-xs">찾은 속성 기준과 특성 기준을 바로 채워 드립니다.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[800px] font-[Paperlogy,sans-serif]">
      <h2 className="text-xl font-semibold mb-6">상세 설정 <span className="text-sm font-normal text-[hsl(var(--muted-foreground))]">(선택)</span></h2>

      {/* 단계 안내 (DataShot 광고상품 선택 안내와 같은 형식·문장 구조) */}
      <div className="flex items-start gap-2 p-3 mb-5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)] text-xs leading-[1.6] text-[hsl(var(--muted-foreground))]">
        <Info size={14} className="shrink-0 mt-[2px]" />
        <span>Step1에서 입력한 캠페인 설명을 바탕으로 SpinX가 찾은 선별 기준이 표시됩니다.</span>
      </div>

      <label className="block text-sm font-medium mb-1">속성 기준</label>
      {/* 기준 설명 (생성 정의서 4.0): 속성 = 매체·상품의 정해진 스펙(필터), 특성 = 특히 강한 상황·성질(순위 조정) */}
      <p className="m-0 mb-3 text-xs leading-[1.6] text-[hsl(var(--muted-foreground))]">
        매체·상품의 구성 정보로, 지원하지 않으면 제외합니다.
      </p>

      {/* Reach Caster 광고상품(채널) 표와 같은 구성: 상단 바 → 헤더 행 → 행 */}
      <div className="rounded-lg border border-[hsl(var(--border))]">
        <div className="flex items-center justify-between px-4 py-2.5 rounded-t-lg bg-[hsl(var(--muted)/0.3)] border-b border-[hsl(var(--border))]">
          <span className="text-[13px] font-medium text-[hsl(var(--foreground))]">{setCount}개 속성 기준</span>
          <button type="button" onClick={() => setIsDialogOpen(true)} className="btn btn-primary btn-sm flex items-center gap-1.5">
            <ListPlus size={14} />
            기준 추가
            {/* 표에 있는 기준 수 (Reach Caster "상품 추가" 버튼의 개수 뱃지와 같은 형식) */}
            {rows.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-[10px] text-[11px] font-semibold bg-[hsl(var(--background)/0.2)]">{rows.length}</span>
            )}
          </button>
        </div>
        {rows.length === 0 ? (
          // Reach Caster 광고상품 빈 상태와 같은 형식
          <div className="m-3 py-8 px-10 flex flex-col items-center gap-2.5 text-center border border-dashed border-[hsl(var(--border))] rounded-lg text-[hsl(var(--muted-foreground))]">
            <ListPlus size={24} className="opacity-50" />
            <div className="text-[13px]">'기준 추가' 버튼을 클릭하여 속성 기준을 추가하세요</div>
          </div>
        ) : (
        <>
        <div className="grid grid-cols-[170px_1fr_96px_24px] gap-3 px-4 py-3 bg-[hsl(var(--muted)/0.5)] border-b border-[hsl(var(--border))] text-xs font-semibold text-[hsl(var(--muted-foreground))]">
          <div>기준명</div>
          <div>상세 항목</div>
          <div>입력</div>
          <div />
        </div>
        {rows.map(r => (
          <CriteriaRow
            key={r.id}
            row={r}
            candidates={!r.values.length ? analysis?.candidates[r.id] : undefined}
            showError={validationActive && r.values.length === 0}
            onChange={values => updateRow(r.id, values)}
            onRemove={() => removeRow(r.id)}
          />
        ))}

        </>
        )}
      </div>

      {/* 특성 기준: 읽기 전용 문장 한 줄. 카탈로그에 정의된 특성만, 이름 최대 2개 + "외 N개" (정의서 4.4) */}
      <label className="block text-sm font-medium mt-8 mb-1">특성 기준</label>
      <p className="m-0 mb-3 text-xs leading-[1.6] text-[hsl(var(--muted-foreground))]">
        매체·상품이 강한 상황과 성질로, 해당할수록 우선합니다.
      </p>
      <div className="flex items-start gap-2 px-4 py-3.5 rounded-lg border border-[hsl(var(--border))]">
        <SpinXSymbol size={13} motion="idle" title="" className="rotate-45 shrink-0 mt-[3px]" />
        <div className="flex-1 text-[13px] leading-[1.6]">
          {formData.traits.length > 0 ? (
            <>
              <div className="text-[hsl(var(--foreground))]">{traitSentence(formData.traits)}</div>
            </>
          ) : (
            <div className="text-[hsl(var(--muted-foreground))]">
              {hasContext
                ? '캠페인 설명에서 특성을 찾지 못했습니다. 캠페인 상황(신제품 출시, 주말 집중 등)을 입력하면 선별에 반영합니다.'
                : '캠페인 설명을 입력하면 SpinX가 특성을 찾아 선별에 반영합니다.'}
            </div>
          )}
        </div>
      </div>

      {isDialogOpen && (
        <ACAddCriteriaDialog existingIds={rows.map(r => r.id)} onAdd={addRows} onClose={() => setIsDialogOpen(false)} />
      )}
    </div>
  )
}

interface CriteriaRowProps {
  row: ACCondition
  /** 확신이 없어 값 대신 보여 주는 후보 (값이 비어 있을 때만) */
  candidates?: string[]
  /** 값이 비어 있을 때 에러 표시 (표에 있는 기준은 값이 필수) */
  showError: boolean
  onChange: (values: string[]) => void
  onRemove: () => void
}

/** 상세 항목 필수 에러 문구: 값을 고르는 기준은 선택, 예산 같은 금액 기준은 입력 */
export const criteriaErrorText = (money?: boolean) => (money ? '항목을 입력해 주세요.' : '항목을 선택해 주세요.')

function CriteriaRow({ row, candidates, showError, onChange, onRemove }: CriteriaRowProps) {
  const def = CONDITION_BY_ID[row.id]
  if (!def) return null
  return (
    <div className="grid grid-cols-[170px_1fr_96px_24px] gap-3 items-center px-4 py-2.5 border-b border-[hsl(var(--border))] last:border-b-0">
      <div className="text-[13px] text-[hsl(var(--foreground))]">{def.label}</div>

      <div>
        {def.money ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={row.values[0] ? Number(row.values[0]).toLocaleString() : ''}
              onChange={e => {
                const digits = e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, '').slice(0, MAX_BUDGET_DIGITS)
                onChange(digits ? [digits] : [])
              }}
              placeholder="예) 2,000"
              aria-label={`${def.label} (만 원)`}
              className={`input w-36 text-right ${showError ? 'border-[hsl(var(--destructive))]' : ''}`}
            />
            <span className="text-[13px] text-[hsl(var(--muted-foreground))]">만 원</span>
          </div>
        ) : (
          <ValueSelect values={def.values} selected={row.values} onChange={onChange} hasError={showError} />
        )}
        {showError && <div className="text-[11px] mt-1 text-[hsl(var(--destructive))]">{criteriaErrorText(def.money)}</div>}
        {candidates && candidates.length > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[hsl(var(--muted-foreground))]">
            <span>SpinX 후보</span>
            {candidates.map(c => (
              <button key={c} type="button" onClick={() => onChange([c])} className="btn btn-ghost btn-sm text-[11px] h-auto py-0.5 px-2 border border-[hsl(var(--border))]">
                {formatValues(row.id, [c])}
              </button>
            ))}
          </div>
        )}
      </div>

      <SourceCell row={row} />

      {(
        <button
          type="button"
          aria-label={`${def.label} 삭제`}
          title="삭제"
          onClick={onRemove}
          className="w-6 h-6 rounded inline-flex items-center justify-center border-0 bg-transparent text-[hsl(var(--muted-foreground))] transition-colors duration-200 hover:bg-[hsl(var(--destructive)/0.1)] hover:text-[hsl(var(--destructive))]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

/** 입력 출처: SpinX가 채운 값 / 직접 입력 */
interface SourceCellProps {
  row: ACCondition
}

function SourceCell({ row }: SourceCellProps) {
  if (row.source === 'spinx') {
    return (
      <div className="w-fit">
        <span className="flex items-center gap-1 text-[11px] font-medium text-[hsl(var(--foreground))]">
          <SpinXSymbol size={12} motion="idle" title="" className="rotate-45 shrink-0" />
          SpinX
        </span>
      </div>
    )
  }
  if (row.source === 'user' && row.values.length) return <span className="text-[11px] text-[hsl(var(--muted-foreground))]">직접 입력</span>
  return <span className="text-[11px] text-[hsl(var(--muted-foreground))]">—</span>
}

/** 복수 선택 드롭다운 (체크박스 목록, 바깥 클릭 시 닫힘) */
interface ValueSelectProps {
  values: string[]
  selected: string[]
  onChange: (v: string[]) => void
  hasError?: boolean
}

function ValueSelect({ values, selected, onChange, hasError = false }: ValueSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isOpen) return
    const handleMouseDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false) }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isOpen])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`input w-full flex items-center justify-between gap-2 text-left text-[13px] ${hasError ? 'border-[hsl(var(--destructive))]' : ''} ${selected.length ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`}
      >
        <span className="truncate">{selected.length ? selected.join(' · ') : '선택하세요'}</span>
        <ChevronDown size={14} className="shrink-0" />
      </button>
      {isOpen && (
        <div className="dropdown absolute top-full left-0 right-0 mt-1 z-[1000] p-1">
          {values.map(v => (
            <label key={v} className="dropdown-item cursor-pointer gap-2">
              <input
                type="checkbox"
                checked={selected.includes(v)}
                onChange={() => onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])}
                className="w-4 h-4 cursor-pointer accent-[hsl(var(--primary))]"
              />
              {v}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
