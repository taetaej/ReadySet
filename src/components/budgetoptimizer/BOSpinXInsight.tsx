import { useState, useEffect } from 'react'
import { SpinXSymbol } from '../spinx/SpinXSymbol'

interface BOSpinXInsightProps {
  text: string
  /** 타이핑 속도 (ms per character) */
  speed?: number
}

export function BOSpinXInsight({ text, speed = 20 }: BOSpinXInsightProps) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

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
    <div style={{ padding: '10px 12px', backgroundColor: 'hsl(var(--muted) / 0.4)', borderRadius: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{
          width: '18px', height: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px'
        }}>
          <SpinXSymbol size={14} motion={isTyping ? 'active' : 'idle'} title="" style={{ transform: 'rotate(45deg)' }} />
        </div>
        <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'hsl(var(--muted-foreground))' }}>
          {displayText}
          {isTyping && <span style={{ opacity: 0.5, animation: 'blink 1s step-end infinite' }}>|</span>}
        </span>
      </div>
      <div style={{ marginTop: '6px', fontSize: '10px', color: 'hsl(var(--muted-foreground))', opacity: 0.5, textAlign: 'right' }}>
        Powered by SpinX for Budget Optimizer
      </div>
    </div>
  )
}
