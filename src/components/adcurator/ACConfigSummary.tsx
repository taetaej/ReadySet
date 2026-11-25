import { ReactNode } from 'react'
import { ACCreateFormData, ACConditionGroup, PURPOSE_LABELS } from './types'
import { CONDITION_BY_ID, TRAIT_LABEL_BY_ID, byCatalogOrder } from './acConditions'

const SUMMARY_MAX_ITEMS = 10

/** 그룹별 항목 이름 (포함·제외는 하나로, 카탈로그 순서) — 정의서 4.8 */
const groupLabels = (formData: ACCreateFormData, group: ACConditionGroup): string[] =>
  [...new Set([...formData.conditions.filter(c => c.values.length > 0).map(c => c.id), ...Object.keys(formData.excludes)])]
    .filter(id => CONDITION_BY_ID[id]?.group === group)
    .sort(byCatalogOrder)
    .map(id => CONDITION_BY_ID[id].label)

/**
 * 개수 + 항목 칩 (BudgetOpt 2.0 요약의 선택 상품 칩과 같은 형식). 10개 넘으면 "외 N개"
 * 0개이면 개수 자리에 '—'. showChips=false이면 개수만 표시(특성 기준)
 */
interface GroupSummaryProps {
  label: string
  items: string[]
  showChips?: boolean
}

const GroupSummary = ({ label, items, showChips = true }: GroupSummaryProps) => (
  <div>
    <Row label={label} value={items.length ? `${items.length}개` : ''} />
    {showChips && items.length > 0 && (
      <div className="mt-2 p-2 bg-[hsl(var(--muted)/0.3)] rounded-md flex flex-wrap gap-[3px]">
        {items.slice(0, SUMMARY_MAX_ITEMS).map(item => (
          <span key={item} className="text-[10px] py-0.5 px-1.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] font-medium whitespace-nowrap">{item}</span>
        ))}
        {items.length > SUMMARY_MAX_ITEMS && (
          <span className="text-[10px] py-0.5 px-1 text-[hsl(var(--muted-foreground))] whitespace-nowrap">외 {items.length - SUMMARY_MAX_ITEMS}개</span>
        )}
      </div>
    )}
  </div>
)

interface ACConfigSummaryProps {
  formData: ACCreateFormData
  currentStep: number
}

interface RowProps {
  label: string
  value: ReactNode
}

const Row = ({ label, value }: RowProps) => {
  const empty = value === '' || value === null || value === undefined
  const muted = empty || value === '없음'
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="text-xs shrink-0 text-[hsl(var(--muted-foreground))]">{label}</span>
      <span className={`text-[13px] font-medium text-right max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap ${muted ? 'text-[hsl(var(--muted-foreground))]' : 'text-[hsl(var(--foreground))]'}`}>
        {empty ? '—' : value}
      </span>
    </div>
  )
}

interface SectionTitleProps {
  children: string
  active: boolean
}

const SectionTitle = ({ children, active }: SectionTitleProps) => (
  <div className={`text-[10px] font-semibold uppercase tracking-[0.8px] mb-3 ${active ? 'text-[hsl(var(--muted-foreground))]' : 'text-[hsl(var(--muted-foreground)/0.5)]'}`}>
    {children}
  </div>
)

/** 우측 Configuration Summary (BudgetOpt 2.0 생성 화면과 동일한 구성) */
export function ACConfigSummary({ formData, currentStep }: ACConfigSummaryProps) {
  const { start, end } = formData.period
  const period = start || end ? `${start || '—'} → ${end || '—'}` : ''

  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-6 font-[Paperlogy,sans-serif]">
      <div className="mb-6 pb-4 border-b border-[hsl(var(--border))]">
        <h3 className="text-[13px] font-semibold m-0 uppercase tracking-[0.5px] text-[hsl(var(--muted-foreground))]">
          Configuration Summary
        </h3>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <SectionTitle active>Step 1 · Basic Information</SectionTitle>
          <div className="flex flex-col gap-2.5">
            <Row label="큐레이션명" value={formData.name.trim()} />
            <Row label="업종" value={formData.industry} />
            <Row label="캠페인 기간" value={period} />
            <Row label="캠페인 목적" value={formData.purposes.map(p => PURPOSE_LABELS[p]).join(' / ')} />
            <Row label="캠페인 설명" value={[formData.contextFile ? '파일 1개' : '', formData.description.trim() ? '텍스트' : ''].filter(Boolean).join(' · ')} />
            <Row label="매체 프로모션" value={formData.promotionIncluded ? '포함' : '미포함'} />
          </div>
        </div>

        <div className="h-px bg-[hsl(var(--border))]" />

        <div>
          <SectionTitle active={currentStep >= 2}>Step 2 · Detailed Settings</SectionTitle>
          <div className="flex flex-col gap-2.5">
            <GroupSummary label="속성 기준" items={groupLabels(formData, 'attribute')} />
            <GroupSummary label="특성 기준" items={formData.traits.map(id => TRAIT_LABEL_BY_ID[id]).filter(Boolean)} showChips={false} />
          </div>
        </div>

        <div className="h-px bg-[hsl(var(--border))]" />

        <div>
          <SectionTitle active={currentStep >= 3}>Step 3 · Review & Execute</SectionTitle>
          {currentStep >= 3
            ? <Row label="검토" value="확인 완료" />
            : <div className="text-xs text-[hsl(var(--muted-foreground))]">검토</div>}
        </div>
      </div>
    </div>
  )
}
