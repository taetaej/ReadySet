import { useState, useEffect } from 'react'
import { SpinXSymbol } from '../spinx/SpinXSymbol'

interface BOSpinXInsightProps {
  text: string
  /** 타이핑 속도 (ms per character) */
  speed?: number
  /** "이어서 질문하기" 클릭 시 SpinX 패널을 여는 콜백 (질문 프리필) */
  onAsk?: (question: string) => void
  /** 이어서 질문하기 프리필 질문 */
  followUpQuestion?: string
}

export function BOSpinXInsight({ text, speed = 20, onAsk, followUpQuestion }: BOSpinXInsightProps) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    setDisplayText('')
    setIsTyping(true)
    let i = 0
    const timer = setInterval(() => {
      i++
      if (i >= text.length) {
        setDisplayText(text)
        setIsTyping(false)
        clearInterval(timer)
      } else {
        setDisplayText(text.slice(0, i))
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <div className="pt-3 border-t border-[hsl(var(--border))]">
      {/* 헤더: 심볼 + 워드마크 */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <SpinXSymbol size={13} motion={isTyping ? 'active' : 'idle'} title="" style={{ transform: 'rotate(45deg)', flexShrink: 0 }} />
        <span className="text-[11px] font-semibold tracking-[0.02em] text-[hsl(var(--muted-foreground))]">SpinX for Budget Optimizer</span>
        {isTyping && <span className="text-[10px] opacity-60 text-[hsl(var(--muted-foreground))]">analyzing…</span>}
      </div>

      {/* 본문 */}
      <p className="text-[12.5px] leading-[1.65] m-0 opacity-90 text-[hsl(var(--foreground))]">
        {displayText}
        {/* 커서 blink는 애니메이션이라 인라인 유지 */}
        {isTyping && <span style={{ opacity: 0.4, animation: 'blink 1s step-end infinite' }}>|</span>}
      </p>

      {/* 푸터: 이어서 질문하기 (텍스트 링크) */}
      {!isTyping && onAsk && (
        <div className="mt-2.5">
          <button
            onClick={() => onAsk(followUpQuestion || '이 차트 결과를 더 자세히 설명해 주세요.')}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="inline-flex items-center gap-1 p-0 bg-none border-none cursor-pointer text-[11.5px] font-medium transition-colors duration-150"
            style={{ color: hovered ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
          >
            이어서 질문하기
            <span className="transition-transform duration-150" style={{ transform: hovered ? 'translateX(2px)' : 'none' }}>→</span>
          </button>
        </div>
      )}
    </div>
  )
}
