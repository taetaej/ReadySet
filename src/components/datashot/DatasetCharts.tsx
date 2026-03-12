import { Database, Package, Target, Info } from 'lucide-react'
import { useState } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function DatasetCharts() {
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false)
  // 추출 요약 통계
  const extractionStats = {
    totalRows: 8000, // 총 행 수 (실제 추출된 데이터)
    adProducts: {
      requested: 144, // 요청한 광고상품 조건 수
      extracted: 87, // 실제 수집된 광고상품 수
      percentage: ((87 / 144) * 100) // 수집률
    },
    targetingOptions: {
      requested: 13, // 요청한 타겟팅 옵션 조건 수
      extracted: 11, // 실제 수집된 타겟팅 옵션 수
      percentage: ((11 / 13) * 100) // 수집률
    }
  }

  // 기간별 지표 트렌드 데이터 생성
  const trendData = [
    { period: '2024-01', cost: 12500000, ctr: 1.85, cpc: 427 },
    { period: '2024-02', cost: 15800000, ctr: 2.12, cpc: 398 },
    { period: '2024-03', cost: 18200000, ctr: 2.68, cpc: 365 },
    { period: '2024-04', cost: 16900000, ctr: 3.15, cpc: 382 },
    { period: '2024-05', cost: 19500000, ctr: 3.82, cpc: 341 },
    { period: '2024-06', cost: 21300000, ctr: 4.25, cpc: 325 },
    { period: '2024-07', cost: 23100000, ctr: 4.58, cpc: 312 },
    { period: '2024-08', cost: 20800000, ctr: 4.92, cpc: 298 },
    { period: '2024-09', cost: 22400000, ctr: 5.21, cpc: 285 },
    { period: '2024-10', cost: 24700000, ctr: 5.48, cpc: 273 },
    { period: '2024-11', cost: 26300000, ctr: 5.75, cpc: 261 },
    { period: '2024-12', cost: 28500000, ctr: 6.02, cpc: 249 }
  ]

  // 다크모드 상태 가져오기
  const isDarkMode = document.documentElement.classList.contains('dark')

  // Ratio Finder 색상 (다크모드/라이트모드)
  const chartColors = {
    cost: '#00FF9D', // Digital 색상 (네온 그린)
    ctr: isDarkMode ? '#f5f5f5' : '#1a1a1a', // TVC 색상
    cpc: '#B794F6' // Reach 색상 (보라)
  }

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* 타이틀 - 동일 라인 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          width: '300px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '500',
            fontFamily: 'Paperlogy, sans-serif',
            margin: 0,
            color: 'hsl(var(--foreground))'
          }}>
            Extraction Summary
          </h3>
          <div style={{ position: 'relative' }}>
            <Info 
              size={18} 
              style={{ 
                cursor: 'pointer',
                color: 'hsl(var(--muted-foreground))'
              }}
              onMouseEnter={() => setInfoTooltipOpen(true)}
              onMouseLeave={() => setInfoTooltipOpen(false)}
            />
            {infoTooltipOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '8px',
                width: '280px',
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                zIndex: 1000,
                fontFamily: 'Paperlogy, sans-serif',
                fontSize: '12px',
                lineHeight: '1.5',
                color: 'hsl(var(--foreground))',
                whiteSpace: 'normal'
              }}>
                선택한 조회조건 중 실제 캠페인 데이터가 존재하는 조건의 추출 현황입니다.
              </div>
            )}
          </div>
        </div>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '500',
          fontFamily: 'Paperlogy, sans-serif',
          margin: 0,
          color: 'hsl(var(--foreground))',
          flex: 1,
          paddingLeft: '16px'
        }}>
          Metrics Trend
        </h3>
      </div>

      {/* 메인 레이아웃: 좌측 스코어카드 3개 + 우측 차트 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '16px',
        marginBottom: '24px',
        alignItems: 'stretch'
      }}>
        {/* 좌측: 스코어카드 3개 세로 배치 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          height: '100%'
        }}>
          {/* 1. 총 행 수 */}
          <TotalRowsCard
            value={extractionStats.totalRows}
            icon={<Database size={20} />}
          />
          
          {/* 2. 광고상품 */}
          <ProgressCard
            label="광고상품"
            requested={extractionStats.adProducts.requested}
            extracted={extractionStats.adProducts.extracted}
            percentage={extractionStats.adProducts.percentage}
            icon={<Package size={20} />}
            color={isDarkMode ? '#f5f5f5' : '#1a1a1a'}
          />
          
          {/* 3. 타겟팅 옵션 */}
          <ProgressCard
            label="타겟팅 옵션"
            requested={extractionStats.targetingOptions.requested}
            extracted={extractionStats.targetingOptions.extracted}
            percentage={extractionStats.targetingOptions.percentage}
            icon={<Target size={20} />}
            color={isDarkMode ? '#f5f5f5' : '#1a1a1a'}
          />
        </div>

        {/* 우측: 차트 영역 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          {/* Recharts */}
          <div style={{ position: 'relative', flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={trendData}
                margin={{ top: 40, right: 60, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                
                {/* X축: 기간 */}
                <XAxis 
                  dataKey="period" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                
                {/* Y축 왼쪽: 광고비 */}
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickFormatter={(value) => `${(value / 10000000).toFixed(0)}M`}
                  label={{ 
                    value: '광고비 (원)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 }
                  }}
                />
                
                {/* Y축 우측: 지표 (CTR, CPC) */}
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  label={{ 
                    value: 'CTR (%) / CPC (원)', 
                    angle: 90, 
                    position: 'insideRight',
                    style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 }
                  }}
                />
                
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          padding: '12px',
                          fontSize: '13px',
                          fontFamily: 'Paperlogy, sans-serif'
                        }}>
                          <div style={{ 
                            fontWeight: '600', 
                            marginBottom: '8px',
                            color: 'hsl(var(--foreground))'
                          }}>
                            {payload[0].payload.period}
                          </div>
                          
                          {/* 광고비 - 네모 */}
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            marginBottom: '4px'
                          }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: chartColors.cost,
                              borderRadius: '2px'
                            }} />
                            <span style={{ color: 'hsl(var(--foreground))' }}>
                              광고비: {payload[0].value.toLocaleString()}원
                            </span>
                          </div>

                          <div style={{
                            height: '1px',
                            backgroundColor: 'hsl(var(--border))',
                            margin: '8px 0'
                          }} />

                          {/* CTR - 동그라미 */}
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            marginBottom: '4px'
                          }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: chartColors.ctr,
                              borderRadius: '50%'
                            }} />
                            <span style={{ color: 'hsl(var(--foreground))' }}>
                              CTR: {payload[1].value}%
                            </span>
                          </div>

                          {/* CPC - 동그라미 */}
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px'
                          }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: chartColors.cpc,
                              borderRadius: '50%'
                            }} />
                            <span style={{ color: 'hsl(var(--foreground))' }}>
                              CPC: {payload[2].value.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                
                {/* 광고비 - 막대 그래프 */}
                <Bar 
                  yAxisId="left"
                  dataKey="cost" 
                  name="광고비"
                  fill={chartColors.cost}
                  opacity={0.8}
                  radius={[4, 4, 0, 0]}
                />
                
                {/* CTR - 라인 그래프 */}
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="ctr" 
                  name="CTR"
                  stroke={chartColors.ctr}
                  strokeWidth={2}
                  dot={{ fill: chartColors.ctr, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                
                {/* CPC - 라인 그래프 */}
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="cpc" 
                  name="CPC"
                  stroke={chartColors.cpc}
                  strokeWidth={2}
                  dot={{ fill: chartColors.cpc, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>

            {/* 범례 (중앙 하단) - Ratio Finder 스타일 */}
            <div style={{
              position: 'absolute',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '13px',
              fontFamily: 'Paperlogy, sans-serif',
              color: 'hsl(var(--muted-foreground))'
            }}>
              {/* 광고비 (막대) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '24px',
                  height: '12px',
                  backgroundColor: chartColors.cost,
                  borderRadius: '2px'
                }} />
                <span>광고비</span>
              </div>
              
              {/* CTR (라인 + 원) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  position: 'relative',
                  width: '24px',
                  height: '12px'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: chartColors.ctr
                  }} />
                  <div style={{
                    width: '100%',
                    height: '2px',
                    backgroundColor: chartColors.ctr
                  }} />
                </div>
                <span>CTR</span>
              </div>
              
              {/* CPC (라인 + 원) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  position: 'relative',
                  width: '24px',
                  height: '12px'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: chartColors.cpc
                  }} />
                  <div style={{
                    width: '100%',
                    height: '2px',
                    backgroundColor: chartColors.cpc
                  }} />
                </div>
                <span>CPC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 총 행 수 카드
function TotalRowsCard({ 
  value,
  icon
}: { 
  value: number
  icon: React.ReactNode
}) {
  return (
    <div style={{
      backgroundColor: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%',
      transition: 'all 0.2s',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
    >
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: 'hsl(var(--foreground))',
          fontFamily: 'Paperlogy, sans-serif'
        }}>
          총 행 수
        </div>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '8px',
          backgroundColor: 'hsl(240, 5%, 26%, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'hsl(240, 5%, 26%)'
        }}>
          {icon}
        </div>
      </div>

      {/* 값 */}
      <div>
        <div style={{
          fontSize: '36px',
          fontWeight: '700',
          color: 'hsl(var(--foreground))',
          fontFamily: 'Paperlogy, sans-serif',
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px'
        }}>
          <span>
            {value.toLocaleString()}
          </span>
          <span style={{
            fontSize: '16px',
            fontWeight: '500',
            color: 'hsl(var(--muted-foreground))'
          }}>
            행
          </span>
        </div>
      </div>
    </div>
  )
}

// 진행률 카드 (광고상품, 타겟팅 옵션)
function ProgressCard({ 
  label,
  requested,
  extracted,
  percentage,
  icon,
  color
}: { 
  label: string
  requested: number
  extracted: number
  percentage: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div style={{
      backgroundColor: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%',
      transition: 'all 0.2s',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
    >
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: 'hsl(var(--foreground))',
          fontFamily: 'Paperlogy, sans-serif'
        }}>
          {label}
        </div>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '8px',
          backgroundColor: 'hsl(240, 5%, 26%, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'hsl(240, 5%, 26%)'
        }}>
          {icon}
        </div>
      </div>
      
      {/* 값 */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          fontSize: '36px',
          fontWeight: '700',
          color: 'hsl(var(--foreground))',
          fontFamily: 'Paperlogy, sans-serif',
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px'
        }}>
          <span>
            {extracted.toLocaleString()}
          </span>
          <span style={{
            fontSize: '16px',
            fontWeight: '500',
            color: 'hsl(var(--muted-foreground))'
          }}>
            / {requested.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'hsl(var(--muted))',
          borderRadius: '3px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            color,
            fontFamily: 'Paperlogy, sans-serif'
          }}>
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}
