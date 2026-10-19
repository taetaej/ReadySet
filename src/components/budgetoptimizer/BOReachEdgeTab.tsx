import { useEffect, useState } from 'react'
import { TrendingUp, ArrowRight, X } from 'lucide-react'

/**
 * BudgetOpt 2.0 결과 화면 우하단에 상주하는 보조 CTA(B안 — confident card).
 * - 우하단 SpinX 버튼(bottom:32px, 64px 높이, ~72px 툴팁 = 약 110px 클러스터) 위에 쌓인다.
 * - 1px 테두리 + 미세 그림자의 카드. 세로 탭 아님.
 * - ✕: 이번 세션 동안 숨김(sessionStorage), 모달은 열지 않음.
 * 데스크톱 전용.
 */
export function BOReachEdgeTab({ onOpen }: { onOpen: () => void }) {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('bo-reach-edgetab-dismissed') === '1'
  )
  // 마운트 직후 짧은 fade/slide-up (미세 모션)
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  if (dismissed) return null

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDismissed(true)
    sessionStorage.setItem('bo-reach-edgetab-dismissed', '1')
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
      aria-label="이 예산안으로 도달 예측하기"
      className="fixed bottom-[128px] right-8 w-[268px] cursor-pointer rounded-[14px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 text-left shadow-[0_6px_20px_-8px_rgb(0_0_0_/_0.18)] transition-[opacity,transform] duration-200 ease-out"
      style={{
        zIndex: 900,
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      {/* 닫기 ✕ (전파 중단, 모달 열지 않음) */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="도달 예측 카드 닫기"
        className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center bg-transparent border-none cursor-pointer text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200"
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
  )
}
