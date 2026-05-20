import { useState, useEffect } from 'react'
import { SpinXSymbol, type SpinXMotion } from './SpinXSymbol'

interface SpinXButtonProps {
  onClick: () => void
  hasNewMessage?: boolean
  isDarkMode?: boolean
  /** SpinX 패널이 열려있는지 여부 — active 모션 전환에 사용 */
  isOpen?: boolean
  style?: React.CSSProperties
}

export function SpinXButton({ onClick, hasNewMessage = false, isDarkMode = false, isOpen = false, style }: SpinXButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [motion, setMotion] = useState<SpinXMotion>('idle')

  // 패널 open/close에 따른 모션 전환
  useEffect(() => {
    if (isOpen) {
      setMotion('engage')
      const timer = setTimeout(() => setMotion('active'), 900)
      return () => clearTimeout(timer)
    } else {
      // 처음 마운트 시에는 settle 없이 idle
      if (motion === 'active' || motion === 'engage') {
        setMotion('settle')
        const timer = setTimeout(() => setMotion('idle'), 1100)
        return () => clearTimeout(timer)
      }
    }
  }, [isOpen])

  // hover 시 모션 (패널 닫혀있을 때만)
  const effectiveMotion: SpinXMotion = !isOpen && isHovered ? 'hover' : motion

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Open SpinX assistant"
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: isDarkMode ? 'hsl(var(--primary-foreground))' : 'hsl(var(--primary))',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isHovered
          ? '0 12px 32px rgba(40, 234, 255, 0.4)'
          : '0 8px 24px rgba(40, 234, 255, 0.25)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        zIndex: 1000,
        padding: 0,
        overflow: 'visible',
        ...style
      }}
    >
      <SpinXSymbol size={48} motion={effectiveMotion} title="" />

      {/* 새 메시지 뱃지 */}
      {hasNewMessage && (
        <div style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#ff4444',
          border: '2px solid #0d1117',
          animation: 'spinx-badge-pulse 1.5s ease-in-out infinite'
        }} />
      )}
    </button>
  )
}
