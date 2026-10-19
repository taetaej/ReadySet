import { useState } from 'react'
import { TrendingUp, ArrowRight, X } from 'lucide-react'

/**
 * BudgetOpt 2.0 결과 화면 우하단에 상주하는 보조 CTA.
 * - 기본: 작은 pill(collapsed). 호버/포커스하면 카드로 확장(expanded).
 * - 우하단 SpinX 버튼(bottom:32px, 64px, ~72px 툴팁 = 약 110px 클러스터) 위에 bottom:176px로 떠 있어 겹치지 않는다.
 * - ✕: pill로 접기만 한다(모달 열지 않음). 다시 호버하면 재확장.
 * 데스크톱 전용. (export 이름 BOReachEdgeTab은 BOResult 연동 유지를 위해 보존)
 */
export function BOReachEdgeTab({ onOpen }: { onOpen: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [manuallyCollapsed, setManuallyCollapsed] = useState(false)
  const expanded = hovered && !manuallyCollapsed

  const collapse = () => {
    setHovered(false)
    setManuallyCollapsed(false)
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setManuallyCollapsed(true)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={collapse}
      onFocus={() => setHovered(true)}
      onBlur={collapse}
      aria-label="이 예산안으로 도달 예측하기"
      className="fixed right-8 cursor-pointer text-left transition-all duration-200 ease-out"
      style={{ bottom: '176px', zIndex: 900 }}
    >
      {expanded ? (
        <div className="relative w-[268px] rounded-[14px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_6px_20px_-8px_rgb(0_0_0_/_0.18)]">
          {/* 닫기 ✕ — pill로 접기만(전파 중단, 모달 열지 않음) */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="도달 예측 카드 닫기"
            className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center border-none bg-transparent cursor-pointer text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200"
          >
            <X size={14} />
          </button>

          <TrendingUp size={18} className="text-[hsl(var(--primary))]" style={{ flexShrink: 0 }} />

          <div className="mt-2 flex flex-col gap-1">
            <span className="pr-5 text-[14px] font-semibold leading-[1.35] text-[hsl(var(--foreground))]">
              이 예산안, 몇 명에게 닿을까요?
            </span>
            <span className="text-[11.5px] leading-[1.4] text-[hsl(var(--muted-foreground))]">
              도달 · 프리퀀시 · 리치커브까지 이어보기
            </span>
          </div>

          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[hsl(var(--primary))] px-3 py-[6px] text-[12px] font-semibold text-[hsl(var(--primary-foreground))]">
            도달 예측하기
            <ArrowRight size={13} style={{ flexShrink: 0 }} />
          </span>
        </div>
      ) : (
        <div className="inline-flex h-11 items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 shadow-[0_4px_12px_-6px_rgb(0_0_0_/_0.15)]">
          <TrendingUp size={16} className="text-[hsl(var(--primary))]" style={{ flexShrink: 0 }} />
          <span className="text-[13px] font-semibold text-[hsl(var(--foreground))]">도달 예측</span>
          <ArrowRight size={13} className="text-[hsl(var(--muted-foreground))]" style={{ flexShrink: 0 }} />
        </div>
      )}
    </div>
  )
}
