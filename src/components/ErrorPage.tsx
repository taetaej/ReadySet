import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { getDarkMode, setDarkMode } from '../utils/theme'

/**
 * /error 페이지
 * - auth API에서 401 이외의 에러코드가 내려올 때 이동되는 에러 안내 화면
 * - query params: ?code=500&message=서버+오류
 */
export function ErrorPage() {
  const [searchParams] = useSearchParams()
  const errorMessage = searchParams.get('message') || '일시적인 오류가 발생했습니다.'

  // 다크모드 상태 복원 (직접 진입 시에도 적용되도록)
  useEffect(() => {
    setDarkMode(getDarkMode())
  }, [])

  const handleRetry = () => {
    window.location.href = '/'
  }

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'hsl(var(--background))',
      fontFamily: 'Paperlogy, sans-serif',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', maxWidth: '420px', padding: '0 24px',
      }}>
        {/* 아이콘 */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          backgroundColor: 'hsl(var(--destructive) / 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px',
        }}>
          <AlertCircle size={36} style={{ color: 'hsl(var(--destructive))' }} />
        </div>

        {/* 메인 메시지 */}
        <h1 style={{
          fontSize: '22px', fontWeight: '700', color: 'hsl(var(--foreground))',
          margin: '0 0 12px 0', lineHeight: '1.4',
        }}>
          서비스 이용에 불편을 드려 죄송합니다.
        </h1>

        {/* 서브 메시지 */}
        <p style={{
          fontSize: '14px', color: 'hsl(var(--muted-foreground))',
          margin: '0 0 32px 0', lineHeight: '1.6',
        }}>
          {errorMessage}<br />
          잠시 후 다시 시도해 주세요.
        </p>

        {/* 액션 버튼 */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleRetry}
            className="btn btn-primary btn-sm"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', fontSize: '13px', fontWeight: '600',
            }}
          >
            <RefreshCw size={14} />
            새로고침
          </button>
          <button
            onClick={handleGoBack}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', fontSize: '13px', fontWeight: '600',
            }}
          >
            <ArrowLeft size={14} />
            이전 페이지
          </button>
        </div>
      </div>
    </div>
  )
}
