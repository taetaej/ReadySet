import React, { useEffect } from 'react'
import { Construction } from 'lucide-react'
import { getDarkMode, setDarkMode } from '../utils/theme'

/**
 * /maintenance 페이지
 * - 서비스 점검 중일 때 안내하는 화면
 */
export function MaintenancePage() {
  useEffect(() => {
    setDarkMode(getDarkMode())
  }, [])

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'hsl(var(--background))',
      fontFamily: 'Paperlogy, sans-serif',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', maxWidth: '600px', padding: '0 24px',
      }}>
        {/* 아이콘 */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          backgroundColor: 'hsl(var(--muted-foreground) / 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px',
        }}>
          <Construction size={36} strokeWidth={1.5} style={{ color: 'hsl(var(--muted-foreground))' }} />
        </div>

        {/* 메인 메시지 */}
        <h1 style={{
          fontSize: '22px', fontWeight: '700', color: 'hsl(var(--foreground))',
          margin: '0 0 12px 0', lineHeight: '1.4',
        }}>
          ReadySet 플랫폼 점검 중입니다.
        </h1>

        {/* 서브 메시지 */}
        <p style={{
          fontSize: '14px', color: 'hsl(var(--muted-foreground))',
          margin: '0', lineHeight: '1.6', whiteSpace: 'nowrap',
        }}>
          보다 안정적인 서비스 제공을 위해 시스템 점검 작업을 진행 중입니다.<br />
          빠른 시간 안에 작업을 마칠 수 있도록 최선을 다하겠습니다.
        </p>

        {/* 문의처 */}
        <span style={{
          display: 'inline-block',
          marginTop: '28px',
          padding: '6px 14px',
          fontSize: '12px',
          color: 'hsl(var(--muted-foreground))',
          backgroundColor: 'hsl(var(--muted-foreground) / 0.06)',
          borderRadius: '100px',
        }}>
          긴급 문의 · AX팀
        </span>
      </div>
    </div>
  )
}
