import { ACPurpose, PURPOSE_ORDER, PURPOSE_LABELS, PURPOSE_DESCRIPTIONS } from './types'

interface ACPurposeCardsProps {
  value: ACPurpose[]
  onChange: (purposes: ACPurpose[]) => void
  hasError?: boolean
  /** 한 줄에 놓을 카드 수. 기본 4(생성 화면), 모달처럼 폭이 좁으면 2(2x2) */
  columns?: 2 | 4
}

/** 캠페인 목적 카드 (다중 선택 토글, 인지 → 조회 → 트래픽 → 전환 고정 순서) */
export function ACPurposeCards({ value, onChange, hasError = false, columns = 4 }: ACPurposeCardsProps) {
  const togglePurpose = (purpose: ACPurpose) => {
    const next = value.includes(purpose) ? value.filter(p => p !== purpose) : [...value, purpose]
    onChange(PURPOSE_ORDER.filter(p => next.includes(p)))
  }

  return (
    <div className={`grid ${columns === 2 ? 'grid-cols-2' : 'grid-cols-4'} gap-3 font-[Paperlogy,sans-serif]`}>
      {PURPOSE_ORDER.map(purpose => {
        const selected = value.includes(purpose)
        const borderClass = selected
          ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]'
          : hasError
            ? 'border-[hsl(var(--destructive))] bg-transparent'
            : 'border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--muted)/0.4)]'
        return (
          <button
            key={purpose}
            type="button"
            aria-pressed={selected}
            onClick={() => togglePurpose(purpose)}
            className={`px-3 py-4 rounded-lg border cursor-pointer text-center transition-colors duration-200 ${borderClass}`}
          >
            <div className="text-sm font-semibold text-[hsl(var(--foreground))]">{PURPOSE_LABELS[purpose]}</div>
            <div className="text-xs mt-1 text-[hsl(var(--muted-foreground))]">{PURPOSE_DESCRIPTIONS[purpose]}</div>
          </button>
        )
      })}
    </div>
  )
}
