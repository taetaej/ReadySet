import { useState, useEffect, useRef } from 'react'
import { ThumbsUp } from 'lucide-react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface RatioAnalysisChartProps {
  data: any[]
  selectedIndex: number | null
  onBarClick: (index: number) => void
  isDarkMode?: boolean
}

export function RatioAnalysisChart({ data, selectedIndex, onBarClick, isDarkMode = false }: RatioAnalysisChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [optimalPointPosition, setOptimalPointPosition] = useState<{ x: number; y: number } | null>(null)
  const [showOptimalPoint, setShowOptimalPoint] = useState(false)

  // 최적 포인트 찾기 (도달률이 가장 높은 지점)
  const maxReachIndex = data.reduce((maxIdx, curr, idx, arr) => 
    curr.reach > arr[maxIdx].reach ? idx : maxIdx, 0
  )

  // 차트 데이터 포맷팅
  const chartData = data.map((item, index) => ({
    index,
    name: `${item.tvcRatio}:${item.digitalRatio}`,
    tvc: item.tvcRatio,
    digital: item.digitalRatio,
    reach: item.reach,
    isOptimal: index === maxReachIndex,
    isSelected: index === selectedIndex
  }))

  // 컬러 정의
  const colors = {
    tvc: isDarkMode ? '#f5f5f5' : '#1a1a1a',
    tvcFaded: isDarkMode ? 'rgba(245, 245, 245, 0.4)' : 'rgba(26, 26, 26, 0.4)',
    digital: '#00FF9D',
    digitalFaded: 'rgba(0, 255, 157, 0.4)',
    reach: '#B794F6'
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div style={{
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
          borderRadius: '8px',
          padding: '12px',
          fontFamily: 'Paperlogy, sans-serif'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>
            비중 조합 {data.index + 1}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '12px' }}>
            <div style={{ width: '10px', height: '10px', background: colors.tvc, borderRadius: '2px' }}></div>
            <span>TVC: {data.tvc}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px' }}>
            <div style={{ width: '10px', height: '10px', background: colors.digital, borderRadius: '2px' }}></div>
            <span>Digital: {data.digital}%</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            paddingTop: '8px',
            borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            fontSize: '12px'
          }}>
            <div style={{ width: '10px', height: '10px', background: colors.reach, borderRadius: '50%' }}></div>
            <span style={{ fontWeight: '600' }}>통합 도달률: {data.reach}%</span>
          </div>
        </div>
      )
    }
    return null
  }

  // Optimal Point 마커 위치 계산
  useEffect(() => {
    const calculatePosition = () => {
      if (chartContainerRef.current) {
        const container = chartContainerRef.current
        const svg = container.querySelector('svg')
        
        if (svg) {
          // 최적 포인트의 바 찾기
          const bars = svg.querySelectorAll('.recharts-bar-rectangle')
          if (bars.length > 0) {
            const optimalBar = bars[maxReachIndex * 2 + 1] as SVGRectElement // digital bar
            if (optimalBar) {
              const rect = optimalBar.getBoundingClientRect()
              const containerRect = container.getBoundingClientRect()
              
              setOptimalPointPosition({
                x: rect.left + rect.width / 2 - containerRect.left,
                y: rect.top - containerRect.top
              })
              setShowOptimalPoint(true)
            }
          }
        }
      }
    }

    setShowOptimalPoint(false)
    const timer = setTimeout(calculatePosition, 300)
    
    return () => clearTimeout(timer)
  }, [maxReachIndex, isDarkMode, data])

  return (
    <div style={{ position: 'relative' }} ref={chartContainerRef}>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={chartData}
          margin={{ top: 60, right: 40, bottom: 80, left: 20 }}
          onClick={(e: any) => {
            if (e && e.activeTooltipIndex !== undefined) {
              onBarClick(e.activeTooltipIndex)
            }
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}
            vertical={false}
          />
          
          <XAxis 
            dataKey="name"
            tick={{ 
              fill: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              fontSize: 11,
              fontFamily: 'Paperlogy, sans-serif'
            }}
            stroke={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
            label={{
              value: 'TVC : Digital',
              position: 'insideBottom',
              offset: -10,
              style: {
                fill: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                fontSize: 12,
                fontFamily: 'Paperlogy, sans-serif'
              }
            }}
          />
          
          <YAxis 
            yAxisId="left"
            domain={[0, 100]}
            tick={{ 
              fill: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              fontSize: 11,
              fontFamily: 'Paperlogy, sans-serif'
            }}
            stroke={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
            tickFormatter={(value) => `${value}%`}
            label={{
              value: '매체 비중 (%)',
              angle: -90,
              position: 'insideLeft',
              style: {
                fill: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                fontSize: 12,
                fontFamily: 'Paperlogy, sans-serif'
              }
            }}
          />
          
          <YAxis 
            yAxisId="right"
            orientation="right"
            domain={[40, 80]}
            tick={{ 
              fill: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              fontSize: 11,
              fontFamily: 'Paperlogy, sans-serif'
            }}
            stroke={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
            tickFormatter={(value) => `${value}%`}
            label={{
              value: '통합 도달률 (%)',
              angle: 90,
              position: 'insideRight',
              style: {
                fill: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                fontSize: 12,
                fontFamily: 'Paperlogy, sans-serif'
              }
            }}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          
          <Legend 
            verticalAlign="bottom"
            height={36}
            iconType="rect"
            wrapperStyle={{
              paddingTop: '20px',
              fontFamily: 'Paperlogy, sans-serif',
              fontSize: '12px'
            }}
          />
          
          <Bar 
            dataKey="tvc" 
            stackId="ratio" 
            fill={colors.tvc}
            yAxisId="left"
            name="TVC"
            cursor="pointer"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-tvc-${index}`}
                fill={selectedIndex === null || selectedIndex === index ? colors.tvc : colors.tvcFaded}
              />
            ))}
          </Bar>
          
          <Bar 
            dataKey="digital" 
            stackId="ratio" 
            fill={colors.digital}
            yAxisId="left"
            name="Digital"
            cursor="pointer"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-digital-${index}`}
                fill={selectedIndex === null || selectedIndex === index ? colors.digital : colors.digitalFaded}
              />
            ))}
          </Bar>
          
          <Line 
            type="monotone"
            dataKey="reach"
            stroke={colors.reach}
            strokeWidth={3}
            dot={{ fill: colors.reach, r: 4 }}
            activeDot={{ r: 6 }}
            yAxisId="right"
            name="통합 도달률"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Optimal Point 말풍선 마커 */}
      {optimalPointPosition && showOptimalPoint && (
        <div
          style={{
            position: 'absolute',
            left: `${optimalPointPosition.x}px`,
            top: `${optimalPointPosition.y - 60}px`,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))',
              color: isDarkMode ? 'hsl(var(--background))' : 'hsl(var(--background))',
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
            <ThumbsUp size={14} strokeWidth={2.5} />
            Optimal Point
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
                borderTop: `6px solid ${isDarkMode ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))'}`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
