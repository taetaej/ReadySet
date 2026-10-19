import { useState } from 'react'
import { TrendingUp, ArrowRight, X } from 'lucide-react'

/**
 * BudgetOpt 2.0 결과 화면 우측 가장자리에 상주하는 보조 CTA.
 * - 기본: 얇은 세로 탭(우측 끝에 살짝만 돌출)
 * - 호버/포커스: 왼쪽으로 슬라이드하며 펼쳐짐(가로 이동만, 들림/큰 그림자 없음)
 * - ✕: 이번 세션 동안 숨김(sessionStorage), 모달은 열지 않음
 * 데스크톱 전용. 우하단 SpinX 버튼과 겹치지 않도록 세로 중앙 고정.
 */
export function BOReachEdgeTab({ onOpen }: { onOpen: () => void }) {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('bo-reach-edgetab-dismissed') === '1'
  )
  const [expanded, setExpanded] = useState(false)

  if (dismissed) return null

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDismissed(true)
    sessionStorage.setItem('bo-reach-edgetab-dismissed', '1')
  }

  // 가로 슬라이드만: 접힘 상태에선 패널을 오른쪽으로 밀어 세로 탭 sliver(36px)만 보이게 한다.
  const SLIVER = 36

  return (
    <div
      className="fixed right-0 top-1/2"
      style={{ transform: 'translateY(-50%)', zIndex: 900 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
    >
      <div
        className="flex items-stretch overflow-hidden rounded-l-lg border border-r-0 border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[0_4px_12px_-4px_rgb(0_0_0_/_0.15)] transition-transform duration-200 ease-out"
        style={{ transform: expanded ? 'translateX(0)' : `translateX(calc(100% - ${SLIVER}px))` }}
      >
        {/* 접힘 상태 세로 탭 (항상 보이는 sliver) */}
        <button
          type="button"
          onClick={onOpen}
          aria-label="Reach Caster로 도달 예측"
          className="flex w-9 flex-shrink-0 flex-col items-center justify-center gap-[6px] bg-transparent border-none cursor-pointer py-3"
        >
          <TrendingUp size={16} className="text-[hsl(var(--primary))]" style={{ flexShrink: 0 }} />
          <span className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] [writing-mode:vertical-rl]">
            도달 예측
          </span>
        </button>

        {/* 펼침 본문 (클릭 시 모달 열기) */}
        <button
          type="button"
          onClick={onOpen}
          className="flex w-[260px] flex-shrink-0 items-center gap-3 border-l border-[hsl(var(--border))] bg-transparent cursor-pointer text-left px-4 py-[14px]"
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.12)]">
            <TrendingUp size={18} className="text-[hsl(var(--primary))]" />
          </span>
          <span className="flex min-w-0 flex-col gap-[3px]">
            <span className="text-[13px] font-semibold text-[hsl(var(--foreground))] leading-[1.35]">
              이 예산안, 몇 명에게 닿을까요?
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] text-[hsl(var(--muted-foreground))]">
              Reach Caster로 도달 예측
              <ArrowRight size={12} style={{ flexShrink: 0 }} />
            </span>
          </span>
        </button>

        {/* 닫기 ✕ (전파 중단, 모달 열지 않음) */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="도달 예측 탭 닫기"
          className="flex w-8 flex-shrink-0 items-center justify-center border-l border-[hsl(var(--border))] bg-transparent cursor-pointer text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
