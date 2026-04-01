import { } from 'lucide-react'

// 마름모 3개 착착 쌓이는 애니메이션 (무한 반복)
function StackingLayers() {
  return (
    <div style={{ width: '24px', height: '28px', position: 'relative' }}>
      <style>{`
        @keyframes diamondStack {
          0%, 100% { opacity: 0; transform: translateY(6px) scale(0.7); }
          20%, 80% { opacity: var(--op); transform: translateY(0) scale(1); }
          90% { opacity: 0; transform: translateY(-4px) scale(0.9); }
        }
      `}</style>
      {[
        { top: 14, op: 0.25, delay: 0 },
        { top: 7, op: 0.55, delay: 0.3 },
        { top: 0, op: 1, delay: 0.6 },
      ].map((layer, i) => (
        <svg key={i} width="18" height="14" viewBox="0 0 18 14" style={{
          position: 'absolute', left: '3px', top: `${layer.top}px`,
          animation: `diamondStack 2.4s ease-in-out ${layer.delay}s infinite`,
          '--op': `${layer.op}`,
        } as any}>
          <path
            d="M9 0 L17 7 L9 14 L1 7 Z"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  )
}

export function DataInsightCard() {
  return (
    <div className="card" style={{
      padding: '24px',
      minHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: 'none',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '56px', fontWeight: '700', lineHeight: '1',
          color: 'hsl(var(--foreground))', marginBottom: '8px', letterSpacing: '-0.02em'
        }}>
          130K+
        </div>
        <div style={{
          fontSize: '13px', fontWeight: '500',
          color: 'hsl(var(--muted-foreground))', marginBottom: '16px'
        }}>
          Real Campaign Data
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <StackingLayers />
          <div style={{
            fontSize: '28px', fontWeight: '700', lineHeight: '1',
            color: 'hsl(var(--foreground))', letterSpacing: '-0.01em'
          }}>
            22
          </div>
        </div>
        <div style={{
          fontSize: '13px', fontWeight: '500',
          color: 'hsl(var(--muted-foreground))', paddingLeft: '26px'
        }}>
          Industry-Specific Models
        </div>
      </div>
      {/* 하단 텍스트 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '12px', fontWeight: '400', margin: '0', color: 'hsl(var(--muted-foreground))', lineHeight: '1.5' }}>
          Real campaign data meets AI-driven insights for smarter predictions
        </p>
      </div>
    </div>
  )
}
