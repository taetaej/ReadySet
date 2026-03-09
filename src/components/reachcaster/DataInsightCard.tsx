import { Sparkles, Layers } from 'lucide-react'

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
      {/* 상단: 큰 숫자들 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* 130K+ */}
        <div style={{
          fontSize: '56px',
          fontWeight: '700',
          lineHeight: '1',
          color: 'hsl(var(--foreground))',
          marginBottom: '8px',
          letterSpacing: '-0.02em'
        }}>
          130K+
        </div>
        <div style={{
          fontSize: '13px',
          fontWeight: '500',
          color: 'hsl(var(--muted-foreground))',
          marginBottom: '16px'
        }}>
          Real Campaign Data
        </div>

        {/* 22 Industry Models */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px'
        }}>
          <Layers size={18} style={{ color: 'hsl(var(--foreground))' }} />
          <div style={{
            fontSize: '28px',
            fontWeight: '700',
            lineHeight: '1',
            color: 'hsl(var(--foreground))',
            letterSpacing: '-0.01em'
          }}>
            22
          </div>
        </div>
        <div style={{
          fontSize: '13px',
          fontWeight: '500',
          color: 'hsl(var(--muted-foreground))',
          paddingLeft: '26px'
        }}>
          Industry-Specific Models
        </div>
      </div>

      {/* 하단: 설명 텍스트 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <Sparkles 
            size={16} 
            style={{ 
              color: 'hsl(var(--muted-foreground))',
              flexShrink: 0,
              marginTop: '2px'
            }} 
          />
          <p style={{
            fontSize: '12px',
            fontWeight: '400',
            margin: '0',
            color: 'hsl(var(--muted-foreground))',
            lineHeight: '1.5'
          }}>
            Real campaign data meets AI-driven insights for smarter predictions
          </p>
        </div>
      </div>
    </div>
  )
}
