// SpinXErrorBubble.tsx — 에러 메시지 + 재시도 버튼

import { RefreshCw } from 'lucide-react'

interface SpinXErrorBubbleProps {
  message: string
  originalQuestion: string
  isDarkMode: boolean
  isLoading: boolean
  retryCount: Map<string, number>
  onRetry: (originalQuestion: string) => void
}

export function SpinXErrorBubble({ message, originalQuestion, isDarkMode, isLoading, retryCount, onRetry }: SpinXErrorBubbleProps) {
  const currentRetryCount = retryCount.get(originalQuestion) || 0
  const canRetry = currentRetryCount < 1

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? 'hsl(var(--muted))' : 'hsl(var(--muted))',
        padding: '16px',
        borderRadius: '12px',
        fontFamily: 'Paperlogy, sans-serif',
        position: 'relative'
      }}
    >
      <div style={{
        fontSize: '13px',
        color: 'hsl(var(--destructive))',
        marginBottom: '16px',
        lineHeight: '1.6',
        paddingRight: '32px'
      }}>
        {message}
      </div>
      {canRetry ? (
        <button
          onClick={() => onRetry(originalQuestion)}
          disabled={isLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            padding: '8px 14px',
            borderRadius: '6px',
            border: '1px solid hsl(var(--border))',
            backgroundColor: 'transparent',
            color: 'hsl(var(--foreground))',
            fontFamily: 'Paperlogy, sans-serif',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = 'hsl(var(--accent))'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <RefreshCw size={14} />
          재시도
        </button>
      ) : (
        <div style={{
          fontSize: '11px',
          color: 'hsl(var(--muted-foreground))',
          fontFamily: 'Paperlogy, sans-serif',
          marginTop: '8px'
        }}>
          재시도 횟수를 초과했습니다. 다른 질문을 시도해주세요.
        </div>
      )}
    </div>
  )
}
