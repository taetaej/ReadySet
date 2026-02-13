import { useEffect, useRef, useMemo, useState } from 'react'
import { ThumbsUp } from 'lucide-react'
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ReachCurveChartProps {
  data?: any[]
  isDarkMode?: boolean
}

export function ReachCurveChart({ data, isDarkMode = false }: ReachCurveChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [optimalPointPosition, setOptimalPointPosition] = useState<{ x: number; y: number } | null>(null)
  const [showOptimalPoint, setShowOptimalPoint] = useState(false)
  const [isChartReady, setIsChartReady] = useState(false)

  // 샘플 리치커브 데이터 생성
  const chartData = useMemo(() => {
    if (data) return data
    
    // 예산 범위: 3억 ~ 18억, 1.5억 단위
    const minBudget = 300000000
    const maxBudget = 1800000000
    const interval = 150000000
    
    const budgetPoints: number[] = []
    for (let budget = minBudget; budget <= maxBudget; budget += interval) {
      budgetPoints.push(budget)
    }
    
    return budgetPoints.map((budget) => {
      // S-curve 공식 사용 (로지스틱 함수) - 60%에서 시작해서 100%까지
      const normalized = (budget - minBudget) / (maxBudget - minBudget)
      const baseReach = 60 // 시작점 60%
      const maxReach = 100 // 최대 100%
      const reachRange = maxReach - baseReach // 40% 범위
      
      // 로지스틱 함수로 60~100% 범위 매핑
      const reach = baseReach + (reachRange / (1 + Math.exp(-10 * (normalized - 0.5))))
      
      // 예측 범위 (신뢰 구간) - 시각적으로 확인 가능한 범위
      const uncertainty = 5 + (normalized * 3) // 5%~8% 범위로 넓게
      const upperBound = Math.min(100, reach + uncertainty)
      const lowerBound = Math.max(baseReach, reach - uncertainty)
      
      return {
        budget: budget,
        budgetLabel: `${(budget / 100000000).toFixed(1)}억`,
        reach: Math.round(reach * 10) / 10,
        upperBound: Math.round(upperBound * 10) / 10,
        lowerBound: Math.round(lowerBound * 10) / 10
      }
    })
  }, [data])
  
  // Y축 최소값 계산 (데이터의 최소값보다 약간 작게)
  const yAxisMin = useMemo(() => {
    const minReach = Math.min(...chartData.map(d => d.lowerBound))
    // 최소값에서 10을 빼고 10 단위로 내림
    return Math.max(0, Math.floor((minReach - 10) / 10) * 10)
  }, [chartData])

  // 최적 포인트 찾기 (기울기가 가장 급격하게 변하는 지점 = 변곡점)
  const optimalPoint = useMemo(() => {
    // S-curve의 변곡점은 normalized = 0.5 지점
    // 예산으로 환산하면 (minBudget + maxBudget) / 2
    const inflectionBudget = 1350000000 // 13.5억
    
    // 해당 예산에 가장 가까운 데이터 포인트 찾기
    let optimal = chartData[0]
    let minDiff = Math.abs(chartData[0].budget - inflectionBudget)
    
    chartData.forEach(point => {
      const diff = Math.abs(point.budget - inflectionBudget)
      if (diff < minDiff) {
        minDiff = diff
        optimal = point
      }
    })
    
    return optimal
  }, [chartData])

  // Optimal Point 마커 위치 계산
  useEffect(() => {
    const calculatePosition = () => {
      if (chartContainerRef.current && isChartReady) {
        const container = chartContainerRef.current
        const svgElement = container.querySelector('svg')
        
        if (svgElement) {
          const svgRect = svgElement.getBoundingClientRect()
          const containerRect = container.getBoundingClientRect()
          
          // SVG 내에서 실제 차트 영역 찾기
          const circles = svgElement.querySelectorAll('circle')
          
          let found = false
          // optimal point에 해당하는 circle 찾기
          circles.forEach((circle) => {
            const cx = parseFloat(circle.getAttribute('cx') || '0')
            const cy = parseFloat(circle.getAttribute('cy') || '0')
            const fill = circle.getAttribute('fill')
            
            // optimal point 찾기 (다크모드: 흰색, 라이트모드: 검은색)
            if (fill && (fill.includes('#ffffff') || fill.includes('#18181b') || fill.includes('#09090b'))) {
              // SVG 좌표를 컨테이너 기준 상대 좌표로 변환
              const relativeX = cx + (svgRect.left - containerRect.left)
              const relativeY = cy + (svgRect.top - containerRect.top)
              
              setOptimalPointPosition({ x: relativeX, y: relativeY })
              setShowOptimalPoint(true)
              found = true
            }
          })
          
          if (!found) {
            setShowOptimalPoint(false)
          }
        }
      }
    }
    
    // 차트가 준비되면 위치 계산
    if (isChartReady) {
      const timer = setTimeout(calculatePosition, 100)
      return () => clearTimeout(timer)
    }
  }, [isChartReady, optimalPoint, chartData, isDarkMode])
  
  // 차트 렌더링 감지
  useEffect(() => {
    setIsChartReady(false)
    setShowOptimalPoint(false)
    
    const timer = setTimeout(() => {
      setIsChartReady(true)
    }, 300)
    
    // ResizeObserver로 차트 컨테이너 크기 변화 감지
    const resizeObserver = new ResizeObserver(() => {
      setIsChartReady(false)
      setShowOptimalPoint(false)
      // 리사이즈 후 차트 재렌더링 대기
      setTimeout(() => {
        setIsChartReady(true)
      }, 400)
    })
    
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current)
    }
    
    return () => {
      clearTimeout(timer)
      resizeObserver.disconnect()
    }
  }, [chartData, isDarkMode])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div style={{
          backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#3f3f46' : '#e4e4e7'}`,
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          fontFamily: 'Paperlogy, sans-serif'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>
            예산: {data.budgetLabel}원
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff9d' }}></div>
            <span style={{ color: isDarkMode ? '#a1a1aa' : '#71717a', fontSize: '12px' }}>Reach (%):</span>
            <span style={{ fontWeight: '600', marginLeft: 'auto', fontSize: '12px' }}>{data.reach}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            <div style={{ width: '8px', height: '4px', background: isDarkMode ? 'rgba(161, 161, 170, 0.3)' : 'rgba(212, 212, 216, 0.5)', borderRadius: '2px' }}></div>
            <span style={{ color: isDarkMode ? '#71717a' : '#a1a1aa' }}>예측 범위:</span>
            <span style={{ color: isDarkMode ? '#a1a1aa' : '#71717a', marginLeft: 'auto' }}>
              {data.lowerBound}% - {data.upperBound}%
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ position: 'relative', outline: 'none' }} ref={chartContainerRef}>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 60, right: 40, bottom: 20, left: 0 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDarkMode ? '#27272a' : '#e4e4e7'}
            vertical={false}
            horizontal={false}
          />
          <XAxis 
            dataKey="budget"
            type="number"
            domain={[300000000, 1800000000]}
            ticks={[300000000, 450000000, 600000000, 750000000, 900000000, 1050000000, 1200000000, 1350000000, 1500000000, 1650000000, 1800000000]}
            tickFormatter={(value) => `${(value / 100000000).toFixed(1)}억`}
            stroke={isDarkMode ? '#3f3f46' : '#e4e4e7'}
            tick={{ fill: isDarkMode ? '#a1a1aa' : '#71717a', fontSize: 11 }}
          />
          <YAxis 
            domain={[yAxisMin, 100]}
            ticks={yAxisMin === 50 ? [50, 60, 70, 80, 90, 100] : [60, 70, 80, 90, 100]}
            tickFormatter={(value) => `${value}%`}
            stroke={isDarkMode ? '#3f3f46' : '#e4e4e7'}
            tick={{ fill: isDarkMode ? '#a1a1aa' : '#71717a', fontSize: 11 }}
            width={50}
            label={{ 
              value: '예측 Reach (%)', 
              angle: 0, 
              position: 'top',
              offset: 30,
              style: { fill: isDarkMode ? '#a1a1aa' : '#71717a', fontSize: 12, fontWeight: 500, textAnchor: 'start' }
            }}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ 
              stroke: isDarkMode ? '#52525b' : '#d4d4d8', 
              strokeWidth: 1, 
              strokeDasharray: '3 3',
              strokeLinecap: 'round'
            }}
            wrapperStyle={{ outline: 'none' }}
          />
          
          {/* 예측 범위 영역 - upperBound와 lowerBound 사이 */}
          <Area
            type="monotone"
            dataKey="upperBound"
            stroke="none"
            fill={isDarkMode ? 'rgba(161, 161, 170, 0.2)' : 'rgba(212, 212, 216, 0.4)'}
            fillOpacity={1}
          />
          <Area
            type="monotone"
            dataKey="lowerBound"
            stroke="none"
            fill={isDarkMode ? 'hsl(var(--background))' : 'hsl(var(--background))'}
            fillOpacity={1}
          />
          
          {/* 메인 라인 */}
          <Line 
            type="monotone" 
            dataKey="reach" 
            stroke="#00ff9d" 
            strokeWidth={3}
            dot={(props: any) => {
              const { cx, cy, payload } = props
              const isOptimal = payload.budget === optimalPoint.budget
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={isOptimal ? 4 : 2.5}
                  fill={isOptimal ? (isDarkMode ? '#ffffff' : '#09090b') : '#00ff9d'}
                  stroke={isOptimal ? (isDarkMode ? '#ffffff' : '#09090b') : '#00ff9d'}
                  strokeWidth={isOptimal ? 2 : 1.5}
                />
              )
            }}
            activeDot={{ r: 5, fill: '#00ff9d', stroke: '#00ff9d', strokeWidth: 2 }}
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
            Efficiency Peak
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
