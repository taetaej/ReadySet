import { Check, Plus } from 'lucide-react'
import type { ACResultItem } from './resultTypes'
import { ACProductName } from './ACProductName'
import { formatRank } from './resultUtils'

/** 행 그리드: 순위 | 매체·상품 | 선별 이유 | 담기. 열 헤더와 공유 */
export const AC_ROW_GRID = 'grid grid-cols-[40px_minmax(0,390px)_minmax(0,1fr)_88px] gap-x-8'

interface ACResultRowProps {
  item: ACResultItem
  hasPromotion: boolean
  onOpenProduct: (id: string, focus: 'top' | 'promotion') => void
  picked: boolean
  /** 상한에 도달해 더 담을 수 없음 (이미 담은 행은 해제 가능) */
  pickDisabled: boolean
  onTogglePick: (id: string) => void
}

/**
 * 목록 행 (화면정의서 6.3): 순위 | 상품(매체명·상품명·상품 설명·프로모션) | 선별 사유(근거) | 담기
 * Good Fit 행은 같은 구성이되 상품명 굵기와 대비를 낮춤
 */
export function ACResultRow({ item, hasPromotion, onOpenProduct, picked, pickDisabled, onTogglePick }: ACResultRowProps) {
  const isGood = item.group === 'good'
  return (
    <div
      id={`ac-row-${item.id}`}
      className={`group ${AC_ROW_GRID} items-center py-5 border-t border-[hsl(var(--border))] transition-colors duration-200
        hover:bg-[hsl(var(--muted)/0.45)]`}
    >
      {/* 1 순위 */}
      <div className="pl-2 text-[13px] tabular-nums text-[hsl(var(--muted-foreground))]">
        {formatRank(item.rank)}
      </div>

      {/* 2~5 매체명 · 상품명 · 상품 설명 · 프로모션 */}
      <div className="min-w-0">
        <div className="text-[12.5px] text-[hsl(var(--muted-foreground))]">{item.mediaName}</div>
        <button
          type="button"
          onClick={() => onOpenProduct(item.id, 'top')}
          className={`block p-0 mt-[2px] bg-transparent border-none text-left cursor-pointer leading-[1.4] hover:underline underline-offset-4 decoration-1
            ${isGood ? 'text-[15px] font-medium text-[hsl(var(--foreground)/0.85)]' : 'text-[16px] font-semibold text-[hsl(var(--foreground))]'}`}
        >
          <ACProductName name={item.productName} />
        </button>
        <div className="mt-1 text-[12.5px] leading-[1.5] text-[hsl(var(--muted-foreground))]">
          {item.description}
          {hasPromotion && (
            <>
              {' · '}
              <button
                type="button"
                onClick={() => onOpenProduct(item.id, 'promotion')}
                className="p-0 bg-transparent border-none cursor-pointer text-[12.5px] font-medium text-[hsl(var(--foreground))] hover:underline underline-offset-2"
              >
                매체 프로모션
              </button>
            </>
          )}
        </div>
      </div>

      {/* 6 선별 사유: 결론 구절 없이 근거 한 덩어리 (첫 문장이 결론). 행의 강조는 상품명 하나 */}
      <div className="min-w-0 max-w-[50em] pr-2">
        <div className={`text-[13.5px] font-normal leading-[1.7] ${isGood ? 'text-[hsl(var(--foreground)/0.7)]' : 'text-[hsl(var(--foreground)/0.85)]'}`}>{item.reason}</div>
      </div>

      {/* 8 담기: BudgetOpt 2.0 연계 후보로 담기 (세션 내 상태, 저장 없음) */}
      {/* 텍스트 버튼: 평소 muted → 행 hover 시 진하게 → 담으면 ✓ 담음으로 진하게 고정 */}
      <div className="flex justify-end pr-2">
        <button
          type="button"
          onClick={() => onTogglePick(item.id)}
          disabled={!picked && pickDisabled}
          aria-pressed={picked}
          title={!picked && pickDisabled ? '더 담을 수 없어요' : undefined}
          className={`inline-flex items-center gap-1 p-0 bg-transparent border-none cursor-pointer text-[13px] whitespace-nowrap transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed
            ${picked
              ? 'font-semibold text-[hsl(var(--foreground))]'
              : 'font-medium text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))]'}`}
        >
          {picked ? <Check size={14} /> : <Plus size={14} />}
          {picked ? '담음' : '담기'}
        </button>
      </div>
    </div>
  )
}
