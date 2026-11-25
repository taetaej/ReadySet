import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X, Filter, Info } from 'lucide-react'
import type { ACCurationResult, ACResultFilters, ACResultItem } from './resultTypes'
import { AC_PAGE_SIZE, AC_PROMO_FILTER_OPTIONS } from './resultTypes'
import { filterBadgeCount, filterItems, isFilterActive, pickPromotion, sortByRank } from './resultUtils'
import { ACResultRow, AC_ROW_GRID } from './ACResultRow'
import { SpinXSymbol } from '../spinx/SpinXSymbol'

interface ACResultListProps {
  result: ACCurationResult
  filters: ACResultFilters
  onFiltersChange: (f: ACResultFilters) => void
  bestShown: number
  onBestShownChange: (n: number) => void
  goodShown: number
  onGoodShownChange: (n: number) => void
  goodOpen: boolean
  onGoodOpenChange: (open: boolean) => void
  onOpenProduct: (id: string, focus: 'top' | 'promotion') => void
  /** 담은 item id (담은 순서) */
  picked: string[]
  pickFull: boolean
  onTogglePick: (id: string) => void
  /** 열 헤더 전체 담기(true)/빼기(false) */
  onPickMany: (ids: string[], pick: boolean) => void
}

/** 매체·상품 목록 (화면정의서 6장): `Best Fit List` 구역 + `Good Fit List` 구역(접이식) */
export function ACResultList(props: ACResultListProps) {
  const { result, filters, onFiltersChange, bestShown, onBestShownChange, goodShown, onGoodShownChange, goodOpen, onGoodOpenChange, onOpenProduct, picked, pickFull, onTogglePick, onPickMany } = props
  const pickedSet = useMemo(() => new Set(picked), [picked])
  const { curation } = result
  const hasPromotion = useMemo(() => {
    const cache = new Map<string, boolean>()
    return (item: ACResultItem) => {
      if (!cache.has(item.id)) cache.set(item.id, !!pickPromotion(item, curation.startDate, curation.endDate, curation.promotionIncluded))
      return cache.get(item.id)!
    }
  }, [curation])

  const best = useMemo(() => sortByRank(result.items.filter(i => i.group === 'best')), [result.items])
  const good = useMemo(() => sortByRank(result.items.filter(i => i.group === 'good')), [result.items])
  const bestFiltered = useMemo(() => filterItems(best, filters, hasPromotion), [best, filters, hasPromotion])
  const goodFiltered = useMemo(() => filterItems(good, filters, hasPromotion), [good, filters, hasPromotion])
  const active = isFilterActive(filters)
  const badge = filterBadgeCount(filters)


  return (
    <div className="flex flex-col min-w-0">
      {/* Best Fit 구역 헤더 + 검색·필터 */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="flex items-baseline gap-2 text-[20px] font-medium leading-[28px] font-[Paperlogy,sans-serif] m-0 text-[hsl(var(--foreground))]">
          Best Fit List
          <span className="text-[15px] font-normal tabular-nums text-[hsl(var(--muted-foreground))]">{active ? bestFiltered.length : best.length}</span>
        </h3>
        <div className="flex items-center gap-2">
          <SearchBox value={filters.search} onChange={search => onFiltersChange({ ...filters, search })} />
          {/* 필터는 프로모션 하나뿐이라, 프로모션 미포함 큐레이션에서는 버튼 자체를 숨김 */}
          {curation.promotionIncluded && (
            <FilterMenu
              filters={filters}
              badge={badge}
              onChange={onFiltersChange}
            />
          )}
        </div>
      </div>

      {/* 설명 + 안내 줄 (6.4): 설명과 SpinX 정리 안내를 한 문장으로, 오른쪽에 생성 시점 기준 */}
      <InfoLine generatedAt={result.generatedAt} promotionIncluded={curation.promotionIncluded} />

      {/* Best Fit 행 */}
      <div className="mt-3">
        <ColumnHeader ids={bestFiltered.map(i => i.id)} pickedSet={pickedSet} pickFull={pickFull} onPickMany={onPickMany} />
        {bestFiltered.length === 0 ? (
          <div className="py-10 border-t border-[hsl(var(--border))] text-center text-[13px] text-[hsl(var(--muted-foreground))]">
            조건에 맞는 매체·상품이 없습니다.
          </div>
        ) : (
          bestFiltered.slice(0, bestShown).map(item => (
            <ACResultRow
              key={item.id}
              item={item}
              hasPromotion={hasPromotion(item)}
              onOpenProduct={onOpenProduct}
              picked={pickedSet.has(item.id)}
              pickDisabled={pickFull}
              onTogglePick={onTogglePick}
            />
          ))
        )}
        <MoreButton shown={bestShown} total={bestFiltered.length} onMore={() => onBestShownChange(bestShown + AC_PAGE_SIZE)} />
      </div>

      {/* 이런 선택지도 있어요 (Good Fit, 접이식) */}
      {good.length > 0 && (
        <div className="mt-12 border-t border-[hsl(var(--border))]">
          <button
            type="button"
            onClick={() => {
              if (goodOpen) onGoodShownChange(AC_PAGE_SIZE)
              onGoodOpenChange(!goodOpen)
            }}
            aria-expanded={goodOpen}
            className="flex flex-col items-start pt-5 pb-1 bg-transparent border-none cursor-pointer text-left"
          >
            {/* 제목 + 개수: Best Fit 구역 제목과 같은 위계 */}
            <span className="flex items-baseline gap-2 text-[20px] font-medium leading-[28px] font-[Paperlogy,sans-serif] text-[hsl(var(--foreground))]">
              Good Fit List
              <span className="text-[15px] font-normal tabular-nums text-[hsl(var(--muted-foreground))]">{active ? goodFiltered.length : good.length}</span>
            </span>
            {/* 둘째 줄: 목록 설명 + 펼치기. Best Fit 구역 안내 줄과 같은 위계(12px). 우하단 ActionDock에 가리지 않도록 펼치기는 왼쪽에 둠 */}
            <span className="mt-1 flex items-center gap-3 text-[12px]">
              <span className="text-[hsl(var(--muted-foreground))]">보조로 검토해 볼 만한 매체·상품이에요</span>
              <span className="font-medium text-[hsl(var(--foreground))]">{goodOpen ? '접기 ↑' : '펼치기 ↓'}</span>
            </span>
          </button>
          {goodOpen && (
            <div className="mt-3">
              <ColumnHeader ids={goodFiltered.map(i => i.id)} pickedSet={pickedSet} pickFull={pickFull} onPickMany={onPickMany} />
              {goodFiltered.length === 0 ? (
                <div className="py-8 border-t border-[hsl(var(--border))] text-center text-[13px] text-[hsl(var(--muted-foreground))]">조건에 맞는 매체·상품이 없습니다.</div>
              ) : (
                goodFiltered.slice(0, goodShown).map(item => (
                  <ACResultRow
                    key={item.id}
                    item={item}
                    hasPromotion={hasPromotion(item)}
                    onOpenProduct={onOpenProduct}
                    picked={pickedSet.has(item.id)}
                    pickDisabled={pickFull}
                    onTogglePick={onTogglePick}
                  />
                ))
              )}
              <MoreButton shown={goodShown} total={goodFiltered.length} onMore={() => onGoodShownChange(goodShown + AC_PAGE_SIZE)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface ColumnHeaderProps {
  /** 이 구역에서 검색·필터에 걸러진 전체 id (더 보기로 안 펼친 행 포함) */
  ids: string[]
  pickedSet: Set<string>
  pickFull: boolean
  onPickMany: (ids: string[], pick: boolean) => void
}

/** 열 헤더: ACResultRow와 같은 그리드 (순위 | 매체·상품 | 선별 이유 | 담기). Best Fit·Good Fit 구역 공통 */
function ColumnHeader({ ids, pickedSet, pickFull, onPickMany }: ColumnHeaderProps) {
  // 하나라도 안 담겼으면 `전체 담기`, 모두 담겼으면 `전체 빼기`. 상한에 차서 더 담을 수 없으면 비활성
  const allPicked = ids.length > 0 && ids.every(id => pickedSet.has(id))
  const blocked = !allPicked && pickFull
  return (
    // 색·굵기: Reach Caster 결과 테이블 헤더(ScenarioComparisonResult)와 동일 (muted/0.3 배경, 12px semibold muted)
    <div className={`${AC_ROW_GRID} py-2.5 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] text-[12px] font-semibold text-[hsl(var(--muted-foreground))]`}>
      <div className="pl-2">순위</div>
      <div>매체·상품</div>
      <div className="flex items-center gap-2 min-w-0">
        <span>선별 이유</span>
        <span className="flex items-center gap-1 font-normal">
          <SpinXSymbol size={12} motion="idle" title="" className="rotate-45 shrink-0" />
          SpinX가 선별 이유를 작성했어요
        </span>
      </div>
      <div className="flex justify-end pr-2">
        {ids.length > 0 && (
          <button
            type="button"
            onClick={() => onPickMany(ids, !allPicked)}
            disabled={blocked}
            title={blocked ? '더 담을 수 없어요' : undefined}
            className="p-0 bg-transparent border-none cursor-pointer text-[12px] font-semibold whitespace-nowrap text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {allPicked ? '전체 빼기' : '전체 담기'}
          </button>
        )}
      </div>
    </div>
  )
}

/** 더 보기 (6.8): `{M}개 더 보기 · {표시} / {전체}`, 다 보이면 숨김 */
function MoreButton({ shown, total, onMore }: { shown: number; total: number; onMore: () => void }) {
  if (shown >= total) return null
  const m = Math.min(AC_PAGE_SIZE, total - shown)
  return (
    <div className="flex justify-center pt-4 border-t border-[hsl(var(--border))]">
      <button type="button" onClick={onMore} className="btn btn-ghost btn-sm text-[13px]">
        {m}개 더 보기 · {Math.min(shown, total)} / {total}
      </button>
    </div>
  )
}

/** 검색 (6.6): 버튼 → 입력창 확장, 빈 값으로 blur하면 축소, X는 초기화 + 축소 */
function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(value !== '')
  useEffect(() => { if (value !== '') setOpen(true) }, [value])
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-ghost btn-md flex items-center gap-1.5 px-3 border border-[hsl(var(--border))]">
        <Search size={16} />
        <span>검색</span>
      </button>
    )
  }
  return (
    <div className="relative w-[260px]">
      <Search size={16} className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 z-[1]" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => { if (!value) setOpen(false) }}
        placeholder="매체·상품 검색"
        className="input w-full h-9 min-h-9 pl-10 pr-8"
        autoFocus
      />
      {value && (
        <button
          type="button"
          onClick={() => { onChange(''); setOpen(false) }}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 bg-transparent border-none cursor-pointer"
          aria-label="검색어 지우기"
        >
          <X size={14} className="text-muted-foreground" />
        </button>
      )}
    </div>
  )
}

interface FilterMenuProps {
  filters: ACResultFilters
  badge: number
  onChange: (f: ACResultFilters) => void
}

/** 필터 (6.7): 매체 프로모션 포함·미포함 (프로모션 포함 큐레이션에서만 노출). 레디셋 메인 필터 UI와 동일 구성 */
function FilterMenu({ filters, badge, onChange }: FilterMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`btn btn-ghost btn-md flex items-center gap-1.5 px-3 border border-[hsl(var(--border))] ${badge > 0 ? 'bg-[hsl(var(--primary)/0.1)]' : 'bg-transparent'}`}
      >
        <Filter size={16} />
        <span>필터</span>
        {badge > 0 && (
          <span className="px-1.5 py-0.5 rounded-[10px] text-[10px] font-semibold bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">{badge}</span>
        )}
      </button>
      {open && (
        <div className="dropdown custom-scrollbar absolute top-full right-0 mt-1 w-[300px] max-h-[450px] overflow-y-auto z-[1000] p-3">
          <div className="mb-4">
            <div className="text-xs font-medium mb-2">매체 프로모션</div>
            <div className="flex flex-col gap-1.5">
              {AC_PROMO_FILTER_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox-custom"
                    checked={filters.promo.includes(opt.value)}
                    onChange={e => onChange({ ...filters, promo: e.target.checked ? [...filters.promo, opt.value] : filters.promo.filter(v => v !== opt.value) })}
                  />
                  <span className="text-[13px]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => onChange({ ...filters, promo: [] })} className="btn btn-ghost btn-sm w-full mt-2">
            필터 초기화
          </button>
        </div>
      )}
    </div>
  )
}

/** 안내 줄 (6.4): 좌 SpinX 정리 / 우 생성 시점 기준 + Info 툴팁 */
function InfoLine({ generatedAt, promotionIncluded }: { generatedAt: string; promotionIncluded: boolean }) {
  const [tipOpen, setTipOpen] = useState(false)
  const tip = promotionIncluded
    ? '결과는 생성 시점의 데이터·프로모션 기준입니다. 다시 계산하지 않으며, 최신 프로모션은 원문 링크에서 확인할 수 있습니다.'
    : '결과는 생성 시점의 데이터 기준입니다. 다시 계산하지 않으며, 최신 기준이 필요하면 복제 후 다시 생성해 주세요.'
  return (
    <div className="flex items-center justify-between gap-4 mt-1 text-[13px] text-[hsl(var(--muted-foreground))]">
      {/* 좌: 목록 설명 한 문장 (우측 생성 시점 기준과 같은 위계) */}
      <span className="text-[12px]">이번 캠페인에 가장 잘 맞아 먼저 검토할 매체·상품이에요</span>
      <span className="relative inline-flex items-center gap-1 text-[12px]">
        생성 시점 기준 · {generatedAt}
        <button
          type="button"
          onMouseEnter={() => setTipOpen(true)}
          onMouseLeave={() => setTipOpen(false)}
          onFocus={() => setTipOpen(true)}
          onBlur={() => setTipOpen(false)}
          className="flex items-center bg-transparent border-none p-0.5 cursor-help text-[hsl(var(--muted-foreground))]"
          aria-label="생성 시점 기준 안내"
        >
          <Info size={13} />
        </button>
        {tipOpen && (
          <span role="tooltip" className="absolute top-full right-0 mt-2 w-[300px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-3 shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] z-[100] text-[12px] leading-[1.6] text-[hsl(var(--muted-foreground))]">
            {tip}
          </span>
        )}
      </span>
    </div>
  )
}
