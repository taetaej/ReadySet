// SpinXHeader.tsx — 헤더 컴포넌트 (타이틀, 초기화 버튼, 닫기 버튼)

import { X, RotateCcw } from 'lucide-react'

interface SpinXHeaderProps {
  onReset: () => void
  onClose: () => void
}

export function SpinXHeader({ onReset, onClose }: SpinXHeaderProps) {
  return (
    <div style={{ flexShrink: 0 }}>
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid hsl(var(--border))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
      {/* 좌측: 타이틀 */}
      <div>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 2px 0',
            fontFamily: 'Paperlogy, sans-serif',
            color: 'hsl(var(--foreground))'
          }}
        >
          SpinX for Reach Caster
        </h3>
        <p
          style={{
            fontSize: '11px',
            margin: 0,
            color: 'hsl(var(--muted-foreground))'
          }}
        >
          AnXer Spin-off AI Agent
        </p>
      </div>

      {/* 우측: 초기화 + 닫기 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={onReset}
          className="btn btn-ghost btn-sm"
          style={{ padding: '6px' }}
          title="대화 초기화"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm"
          style={{ padding: '6px' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
    </div>
  )
}
