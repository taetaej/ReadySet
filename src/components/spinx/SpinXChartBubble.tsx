// SpinXChartBubble.tsx — 차트 타입 메시지 렌더링

import { Copy, Check } from 'lucide-react'
import type { ChartData, Message } from './spinxTypes'

interface SpinXChartBubbleProps {
  data: ChartData
  index: number
  isDarkMode: boolean
  copiedMessageIndex: number | null
  onCopy: (content: Message['content'], index: number) => void
}

export function SpinXChartBubble({ data, index, isDarkMode, copiedMessageIndex, onCopy }: SpinXChartBubbleProps) {
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
      {/* 복사 버튼 */}
      <button
        onClick={() => onCopy({ type: 'chart', data }, index)}
        className="btn btn-ghost btn-sm"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '6px',
          zIndex: 1
        }}
        title="복사"
      >
        {copiedMessageIndex === index ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <h6 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 8px 0', paddingRight: '32px' }}>
        {data.title}
      </h6>
      <p style={{
        fontSize: '12px',
        color: 'hsl(var(--muted-foreground))',
        margin: '0 0 16px 0',
        lineHeight: '1.6'
      }}>
        {data.description}
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {data.categories.map((cat: string, i: number) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '11px',
              color: 'hsl(var(--muted-foreground))',
              marginBottom: '8px'
            }}>
              {cat}
            </div>
            <div style={{
              height: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: '4px'
            }}>
              {/* TVC 바 */}
              <div style={{
                height: `${(data.series[0].data[i] / 10)}px`,
                backgroundColor: isDarkMode ? '#f5f5f5' : '#1a1a1a',
                borderRadius: '4px 4px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                fontWeight: '600'
              }}>
                {data.series[0].data[i]}M
              </div>
              {/* Digital 바 */}
              <div style={{
                height: `${(data.series[1].data[i] / 10)}px`,
                backgroundColor: '#00FF9D',
                borderRadius: '0 0 4px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#000',
                fontWeight: '600'
              }}>
                {data.series[1].data[i]}M
              </div>
            </div>
            {/* Reach 표시 */}
            <div style={{
              marginTop: '8px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#B794F6'
            }}>
              {data.series[2].data[i]}%
            </div>
          </div>
        ))}
      </div>
      {/* 범례 */}
      <div style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        fontSize: '11px',
        paddingTop: '12px',
        borderTop: '1px solid hsl(var(--border))'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: isDarkMode ? '#f5f5f5' : '#1a1a1a',
            borderRadius: '2px'
          }} />
          <span>TVC 예산</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#00FF9D',
            borderRadius: '2px'
          }} />
          <span>Digital 예산</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#B794F6',
            borderRadius: '50%'
          }} />
          <span>Reach 1+</span>
        </div>
      </div>
    </div>
  )
}
