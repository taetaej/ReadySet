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
    <div style={{ paddingTop: '12px', borderTop: '1px solid hsl(var(--border))' }}>
      {/* 헤더: 심볼 + 워드마크 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        <SpinXSymbol size={13} motion={isTyping ? 'active' : 'idle'} title="" style={{ transform: 'rotate(45deg)', flexShrink: 0 }} />
        <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.02em', color: 'hsl(var(--muted-foreground))' }}>SpinX for Budget Optimizer</span>
        {isTyping && <span style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))', opacity: 0.6 }}>analyzing…</span>}
      </div>

      {/* 본문 */}
      <p style={{ fontSize: '12.5px', lineHeight: '1.65', color: 'hsl(var(--foreground))', margin: 0, opacity: 0.9 }}>
        {displayText}
        {isTyping && <span style={{ opacity: 0.4, animation: 'blink 1s step-end infinite' }}>|</span>}
      </p>

      {/* 푸터: 이어서 질문하기 (텍스트 링크) */}
      {!isTyping && onAsk && (
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={() => onAsk(followUpQuestion || '이 차트 결과를 더 자세히 설명해 주세요.')}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontSize: '11.5px', fontWeight: '500',
              color: hovered ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
              transition: 'color 0.15s'
            }}
          >
            이어서 질문하기
            <span style={{ transform: hovered ? 'translateX(2px)' : 'none', transition: 'transform 0.15s' }}>→</span>
          </button>
        </div>
      )}
    </div>
  )
}
