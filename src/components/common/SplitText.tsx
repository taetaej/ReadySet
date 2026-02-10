import { useEffect, useRef, useState } from 'react'

interface SplitTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
}

export function SplitText({ text, className = '', style = {}, delay = 0 }: SplitTextProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <span ref={ref} className={className} style={{ ...style, display: 'inline-block' }}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`,
            transitionDelay: `${index * 0.03}s`,
            whiteSpace: char === ' ' ? 'pre' : 'normal'
          }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
