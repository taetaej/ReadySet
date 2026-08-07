import { useState, useEffect } from 'react'
import { X, Info, Scale, Target, CheckCircle, AlertTriangle } from 'lucide-react'
import { Section, ComponentGroup } from './Section'

export function FeedbackSection() {
  // 토스트 상태
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)
  // 툴팁 상태
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  return (
    <>
      {/* 배지 */}
      <Section title="Badges & Status" description="실제 사용하는 상태 표시 및 모듈 칩">
        <ComponentGroup label="Status Badges (DataShot Style)">
          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', backgroundColor: 'hsl(var(--foreground))', color: 'hsl(var(--background))', border: '1px solid hsl(var(--foreground))', fontWeight: '500' }}>
            Completed
          </span>
          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))', fontWeight: '500' }}>
            Processing
          </span>
          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', backgroundColor: 'transparent', color: 'hsl(var(--muted-foreground))', border: '1px solid hsl(var(--border))', fontWeight: '500' }}>
            Pending
          </span>
          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', border: '1px solid hsl(var(--destructive))', fontWeight: '500' }}>
            Error
          </span>
        </ComponentGroup>

        <ComponentGroup label="Module Chips (SpinX Style)">
          <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: 'hsl(var(--foreground))', color: 'hsl(var(--background))', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Scale size={14} />
            Ratio Finder
          </span>
          <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: 'hsl(var(--foreground))', color: 'hsl(var(--background))', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={14} />
            Reach Predictor
          </span>
        </ComponentGroup>

        <ComponentGroup label="Industry Badge">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))' }}>
            <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>업종</span>
            <div style={{ width: '1px', height: '12px', backgroundColor: 'hsl(var(--border))' }} />
            <span style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--foreground))' }}>전자/IT</span>
          </div>
        </ComponentGroup>
      </Section>

      {/* 토스트 메시지 */}
      <Section title="Toast Messages" description="실제 사용하는 토스트 알림">
        <ComponentGroup label="Toast Examples">
          <button className="btn btn-primary" onClick={() => setShowToast({ type: 'success', message: 'Slot이 성공적으로 생성되었습니다.' })}>
            성공 토스트 표시
          </button>
          <button className="btn btn-secondary" onClick={() => setShowToast({ type: 'error', message: 'Slot 생성에 실패했습니다. 다시 시도해주세요.' })}>
            오류 토스트 표시
          </button>
          <button className="btn btn-secondary" onClick={() => setShowToast({ type: 'info', message: "현재 'O03_음료및기호식품' Slot에 위치한 시나리오 상세 페이지입니다." })}>
            안내 토스트 표시
          </button>
        </ComponentGroup>

        <ComponentGroup label="Toast Preview">
          <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', maxWidth: '400px' }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: 'hsl(var(--muted-foreground))' }}>Success Toast</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(142.1 76.2% 36.3% / 0.3)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <CheckCircle size={20} style={{ color: 'hsl(142.1 76.2% 36.3%)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px', color: 'hsl(var(--foreground))' }}>성공</p>
                  <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>Slot이 성공적으로 생성되었습니다.</p>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: 'hsl(var(--muted-foreground))' }}>Error Toast</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--destructive) / 0.3)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <AlertTriangle size={20} style={{ color: 'hsl(var(--destructive))', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px', color: 'hsl(var(--foreground))' }}>오류</p>
                  <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>Slot 생성에 실패했습니다. 다시 시도해주세요.</p>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: 'hsl(var(--muted-foreground))' }}>Info Toast (안내)</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'hsl(var(--background))', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <Info size={20} style={{ color: '#3B82F6', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px', color: 'hsl(var(--foreground))' }}>Slot 이동 안내</p>
                  <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>현재 'O03_음료및기호식품' Slot에 위치한 시나리오 상세 페이지입니다.</p>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
                </button>
              </div>
            </div>
          </div>
        </ComponentGroup>
      </Section>

      {/* 툴팁 */}
      <Section title="Tooltips" description="정보 표시 툴팁">
        <ComponentGroup label="Info Tooltip">
          <div style={{ position: 'relative' }}>
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '6px' }}
            >
              <Info size={16} />
            </button>
            
            {showTooltip && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '8px',
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                padding: '12px 16px',
                minWidth: '200px',
                maxWidth: '300px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: 1000
              }}>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'hsl(var(--foreground))' }}>
                  정보
                </div>
                <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', lineHeight: '1.5' }}>
                  이 항목에 대한 추가 정보가 여기에 표시됩니다.
                </div>
              </div>
            )}
          </div>
        </ComponentGroup>
      </Section>

      {/* 토스트 알림 렌더링 */}
      {showToast && (
        <div className={`toast ${showToast.type === 'success' ? 'toast--success' : showToast.type === 'info' ? 'toast--info' : 'toast--error'}`}>
          <div className="toast__icon">
            {showToast.type === 'success' ? (
              <CheckCircle size={20} style={{ color: 'hsl(142.1 76.2% 36.3%)' }} />
            ) : showToast.type === 'info' ? (
              <Info size={20} style={{ color: '#3B82F6' }} />
            ) : (
              <AlertTriangle size={20} style={{ color: 'hsl(var(--destructive))' }} />
            )}
          </div>
          <div className="toast__content">
            <p className="toast__title">
              {showToast.type === 'success' ? '성공' : showToast.type === 'info' ? 'Slot 이동 안내' : '오류'}
            </p>
            <p className="toast__description">
              {showToast.message}
            </p>
          </div>
          <button onClick={() => setShowToast(null)} className="toast__close">
            <X size={16} />
          </button>
        </div>
      )}
    </>
  )
}
