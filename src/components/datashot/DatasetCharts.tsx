import { Database, Package, Target } from 'lucide-react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface DatasetChartsProps {
  data: any[]
}

export function DatasetCharts({ data }: DatasetChartsProps) {
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
    { period: '2024-01', cost: 12500000, ctr: 2.34, cpc: 427 },
    { period: '2024-02', cost: 15800000, ctr: 2.56, cpc: 398 },
    { period: '2024-03', cost: 18200000, ctr: 2.89, cpc: 365 },
    { period: '2024-04', cost: 16900000, ctr: 2.71, cpc: 382 },
    { period: '2024-05', cost: 19500000, ctr: 3.12, cpc: 341 },
    { period: '2024-06', cost: 21300000, ctr: 3.28, cpc: 325 }
  ]

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* 차트 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
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
      </div>

      {/* 메인 레이아웃: 좌측 스코어카드 3개 + 우측 차트 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* 좌측: 스코어카드 3개 세로 배치 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
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
            color="#00D9FF"
          />
          
          {/* 3. 타겟팅 옵션 */}
          <ProgressCard
            label="타겟팅 옵션"
            requested={extractionStats.targetingOptions.requested}
            extracted={extractionStats.targetingOptions.extracted}
            percentage={extractionStats.targetingOptions.percentage}
            icon={<Target size={20} />}
            color="#FF6B9D"
          />
        </div>

        {/* 우측: 차트 영역 (단일 박스) */}
        <div style={{
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '12px',
          padding: '24px',
          minHeight: '448px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'Paperlogy, sans-serif',
              margin: 0,
              color: 'hsl(var(--foreground))'
            }}>
              Metrics Trend
            </h4>
          </div>
          
          {/* Recharts */}
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart
              data={trendData}
              margin={{ top: 10, right: 60, left: 20, bottom: 10 }}
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
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any, name: string | undefined) => {
                  if (name === '광고비') return [`${value.toLocaleString()}원`, name]
                  if (name === 'CTR') return [`${value}%`, name]
                  if (name === 'CPC') return [`${value}원`, name]
                  return [value, name]
                }}
              />
              
              <Legend 
                wrapperStyle={{
                  fontSize: '12px',
                  fontFamily: 'Paperlogy, sans-serif'
                }}
              />
              
              {/* 광고비 - 막대 그래프 */}
              <Bar 
                yAxisId="left"
                dataKey="cost" 
                name="광고비"
                fill="#00ff9d"
                opacity={0.8}
                radius={[4, 4, 0, 0]}
              />
              
              {/* CTR - 라인 그래프 */}
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="ctr" 
                name="CTR"
                stroke="#00D9FF"
                strokeWidth={2}
                dot={{ fill: '#00D9FF', r: 4 }}
                activeDot={{ r: 6 }}
              />
              
              {/* CPC - 라인 그래프 */}
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="cpc" 
                name="CPC"
                stroke="#FF6B9D"
                strokeWidth={2}
                dot={{ fill: '#FF6B9D', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
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
