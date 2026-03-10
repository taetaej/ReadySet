import { Rotate3d } from 'lucide-react'
import { useState } from 'react'

interface SpinXButtonProps {
  onClick: () => void
  hasNewMessage?: boolean
  isDarkMode?: boolean
}

export function SpinXButton({ onClick, hasNewMessage = false, isDarkMode = false }: SpinXButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: '#00ff9d',
        color: isDarkMode ? '#ffffff' : '#000000',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isHovered 
          ? '0 12px 32px rgba(0, 255, 157, 0.5)' 
          : '0 8px 24px rgba(0, 255, 157, 0.4)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        zIndex: 1000,
        animation: 'spinx-bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      {/* SpinX 아이콘 - 데굴데굴 구르는 효과 */}
      <Rotate3d 
        size={30} 
        style={{
          transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isHovered ? 'rotate(360deg)' : 'rotate(0deg)',
          animation: isHovered ? 'none' : 'spinx-pulse 2s ease-in-out infinite'
        }}
      />
      
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
          border: '2px solid #00ff9d',
          animation: 'spinx-badge-pulse 1.5s ease-in-out infinite'
        }} />
      )}
    </button>
  )
}
