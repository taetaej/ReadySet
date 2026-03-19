import { useState, useEffect, useRef } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, Zap } from 'lucide-react'

interface BubbleDataPoint {
  name: string
  spendShare: number
  ctr: number
  impression: number
  color: string
}

interface IndustryBubbleChartProps {
  industry?: string
}

// 뷰티 업종 샘플 데이터 (광고비 비중 상위 20개 광고상품)
const beautyData: BubbleDataPoint[] = [
  { name: 'Meta > CONVERSIONS > AUCTION > OFFSITE_CONVERSIONS > instagram', spendShare: 12.5, ctr: 2.8, impression: 850000, color: 'hsl(var(--foreground))' },
  { name: 'Google Ads > 디스플레이 광고', spendShare: 10.2, ctr: 2.3, impression: 720000, color: 'hsl(var(--foreground))' },
  { name: 'Meta > VIDEO_VIEWS > AUCTION > THRUPLAY > facebook', spendShare: 9.8, ctr: 3.1, impression: 650000, color: 'hsl(var(--foreground))' },
  { name: 'TikTok > In-Feed 광고', spendShare: 8.5, ctr: 2.6, impression: 580000, color: 'hsl(var(--foreground))' },
  { name: 'Google Ads > 동영상 광고 (YouTube)', spendShare: 7.9, ctr: 1.9, impression: 920000, color: 'hsl(var(--foreground))' },
  { name: 'Meta > OUTCOME_TRAFFIC > AUCTION > LINK_CLICKS > facebook&instagram', spendShare: 7.2, ctr: 2.4, impression: 480000, color: 'hsl(var(--foreground))' },
  { name: 'kakao 모먼트 > 카카오톡 비즈보드', spendShare: 6.8, ctr: 2.1, impression: 780000, color: 'hsl(var(--foreground))' },
  { name: 'Google Ads > 검색 광고', spendShare: 6.5, ctr: 1.8, impression: 690000, color: 'hsl(var(--foreground))' },
  { name: 'Meta > CONVERSIONS > AUCTION > LINK_CLICKS > facebook', spendShare: 6.1, ctr: 2.2, impression: 540000, color: 'hsl(var(--foreground))' },
  { name: 'TikTok > Spark Ads', spendShare: 5.8, ctr: 2.9, impression: 420000, color: 'hsl(var(--foreground))' },
  { name: '네이버 성과형 DA > 파워링크', spendShare: 5.4, ctr: 2.5, impression: 380000, color: 'hsl(var(--foreground))' },
  { name: 'Meta > LEAD_GENERATION > AUCTION > LEAD_GENERATION > instagram', spendShare: 5.1, ctr: 1.7, impression: 610000, color: 'hsl(var(--foreground))' },
  { name: 'Google Ads > Performance Max', spendShare: 4.8, ctr: 2.0, impression: 520000, color: 'hsl(var(--foreground))' },
  { name: 'kakao 모먼트 > 카카오톡 채널 광고', spendShare: 4.5, ctr: 2.3, impression: 460000, color: 'hsl(var(--foreground))' },
  { name: 'TikTok > TopView 광고', spendShare: 4.2, ctr: 1.9, impression: 550000, color: 'hsl(var(--foreground))' },
  { name: 'Meta > VIDEO_VIEWS > AUCTION > VIDEO_VIEWS > instagram', spendShare: 3.9, ctr: 2.7, impression: 390000, color: 'hsl(var(--foreground))' },
  { name: '네이버 성과형 DA > 쇼핑검색', spendShare: 3.6, ctr: 2.1, impression: 340000, color: 'hsl(var(--foreground))' },
  { name: 'Google Ads > 디스커버리 광고', spendShare: 3.3, ctr: 1.6, impression: 280000, color: 'hsl(var(--foreground))' },
  { name: 'kakao 모먼트 > Daum 디스플레이', spendShare: 3.0, ctr: 2.4, impression: 410000, color: 'hsl(var(--foreground))' },
  { name: '네이버 성과형 DA > GFA (보장형 배너)', spendShare: 2.7, ctr: 2.2, impression: 320000, color: 'hsl(var(--foreground))' }
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div style={{
        backgroundColor: 'hsl(var(--popover))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        maxWidth: '300px'
      }}>
        <p style={{ 
          margin: '0 0 8px 0', 
          fontWeight: '600',
          fontSize: '12px',
          color: 'hsl(var(--foreground))',
          lineHeight: '1.4',
          wordBreak: 'break-word'
        }}>
          {data.name}
        </p>
        <p style={{ 
          margin: '4px 0', 
          fontSize: '12px',
          color: 'hsl(var(--muted-foreground))'
        }}>
          Spend Share: <span style={{ fontWeight: '600', color: 'hsl(var(--foreground))' }}>{data.spendShare}%</span>
        </p>
        <p style={{ 
          margin: '4px 0', 
          fontSize: '12px',
          color: 'hsl(var(--muted-foreground))'
        }}>
          CTR: <span style={{ fontWeight: '600', color: 'hsl(var(--foreground))' }}>{data.ctr}%</span>
        </p>
        <p style={{ 
          margin: '4px 0', 
          fontSize: '12px',
          color: 'hsl(var(--muted-foreground))'
        }}>
          Impression: <span style={{ fontWeight: '600', color: 'hsl(var(--foreground))' }}>{data.impression.toLocaleString()}</span>
        </p>
      </div>
    )
  }
  return null
}

export function IndustryBubbleChart({ industry = '뷰티' }: IndustryBubbleChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [markerPositions, setMarkerPositions] = useState<{
    maxSpend: { x: number; y: number } | null
    maxCtr: { x: number; y: number } | null
  }>({ maxSpend: null, maxCtr: null })

  // 광고비가 가장 많은 상품 찾기
  const maxSpendProduct = beautyData.reduce((max, item) => 
    item.spendShare > max.spendShare ? item : max
  , beautyData[0])
  
  // CTR이 가장 높은 상품 찾기
  const maxCtrProduct = beautyData.reduce((max, item) => 
    item.ctr > max.ctr ? item : max
  , beautyData[0])

  // 차트 렌더링 후 버블 위치 계산
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chartContainerRef.current) {
        const svg = chartContainerRef.current.querySelector('svg')
        if (!svg) return

        const symbols = svg.querySelectorAll('.recharts-symbols')
        if (symbols.length === 0) return

        const containerRect = chartContainerRef.current.getBoundingClientRect()
        const svgRect = svg.getBoundingClientRect()

        symbols.forEach((symbolGroup) => {
          const circles = symbolGroup.querySelectorAll('path')
          circles.forEach((circle) => {
            const parent = circle.parentElement
            if (!parent) return

            const transform = parent.getAttribute('transform')
            if (!transform) return

            const match = transform.match(/translate\(([^,]+),([^)]+)\)/)
            if (!match) return

            const x = parseFloat(match[1])
            const y = parseFloat(match[2])

            // stroke가 있는 특별한 버블 찾기
            const stroke = circle.getAttribute('stroke')
            if (stroke && stroke !== 'none') {
              const relativeX = x + (svgRect.left - containerRect.left)
              const relativeY = y + (svgRect.top - containerRect.top)

              // Y 위치로 구분 (CTR이 높은 것이 위쪽)
              if (y < svgRect.height / 2) {
                setMarkerPositions(prev => ({ ...prev, maxCtr: { x: relativeX, y: relativeY } }))
              } else {
                setMarkerPositions(prev => ({ ...prev, maxSpend: { x: relativeX, y: relativeY } }))
              }
            }
          })
        })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="card" style={{
      padding: '24px',
      minHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'none',
      position: 'relative'
    }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          margin: '0 0 4px 0',
          color: 'hsl(var(--foreground))'
        }}>
          {industry} 업종 광고 성과 분석
        </h3>
        <p style={{
          fontSize: '12px',
          fontWeight: '400',
          margin: '0',
          color: 'hsl(var(--muted-foreground))'
        }}>
          최근 6개월 광고비 비중 상위 20개 상품 • 시장 흐름과 효율 분석
        </p>
      </div>

      {/* 차트 */}
      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart
            margin={{ top: 60, right: 20, bottom: 20, left: 20 }}
          >
            <XAxis 
              type="number" 
              dataKey="spendShare" 
              name="Spend Share"
              unit="%"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              label={{ 
                value: 'Spend Share (%)', 
                position: 'bottom',
                offset: 0,
                style: { 
                  fill: 'hsl(var(--foreground))', 
                  fontSize: 12,
                  fontWeight: 500
                }
              }}
            />
            <YAxis 
              type="number" 
              dataKey="ctr" 
              name="CTR"
              unit="%"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              label={{ 
                value: 'CTR (%)', 
                angle: -90, 
                position: 'left',
                offset: 0,
                style: { 
                  fill: 'hsl(var(--foreground))', 
                  fontSize: 12,
                  fontWeight: 500
                }
              }}
            />
            <ZAxis 
              type="number" 
              dataKey="impression" 
              range={[100, 1000]} 
              name="Impression"
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: '3 3', stroke: 'hsl(var(--border))' }}
            />
            <Scatter 
              data={beautyData} 
              fill="hsl(var(--foreground))"
            >
              {beautyData.map((entry, index) => {
                const isMaxSpend = entry.spendShare === maxSpendProduct.spendShare
                const isMaxCtr = entry.ctr === maxCtrProduct.ctr
                
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={isMaxSpend || isMaxCtr ? 'hsl(var(--background))' : 'hsl(var(--foreground))'}
                    opacity={isMaxSpend || isMaxCtr ? 1 : 0.3}
                    stroke={isMaxSpend || isMaxCtr ? 'hsl(var(--foreground))' : 'none'}
                    strokeWidth={isMaxSpend || isMaxCtr ? 2 : 0}
                  />
                )
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* 마커들 - 버블 위치에 맞춤 */}
        {/* Best CTR 마커 - 왼쪽 상단 (spendShare: 9.8%, ctr: 3.1%) */}
        <div
          style={{
            position: 'absolute',
            left: '48%',
            top: '18%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <div
            style={{
              backgroundColor: 'hsl(var(--foreground))',
              color: 'hsl(var(--background))',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: 'Paperlogy, sans-serif',
              whiteSpace: 'nowrap',
              position: 'relative',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Zap size={14} strokeWidth={2.5} />
            Best CTR
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid hsl(var(--foreground))',
              }}
            />
          </div>
        </div>

        {/* Highest Spend 마커 - 오른쪽 상단 (spendShare: 12.5%, ctr: 2.8%) */}
        <div
          style={{
            position: 'absolute',
            left: '68%',
            top: '25%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <div
            style={{
              backgroundColor: 'hsl(var(--foreground))',
              color: 'hsl(var(--background))',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: 'Paperlogy, sans-serif',
              whiteSpace: 'nowrap',
              position: 'relative',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <TrendingUp size={14} strokeWidth={2.5} />
            Highest Spend
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid hsl(var(--foreground))',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
