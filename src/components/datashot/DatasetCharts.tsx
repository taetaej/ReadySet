import { useState } from 'react'
import { BarChart3, TrendingUp, PieChart, LineChart } from 'lucide-react'

interface DatasetChartsProps {
  data: any[]
  configData: any
}

export function DatasetCharts({ data, configData }: DatasetChartsProps) {
  const [selectedChart, setSelectedChart] = useState<'bar' | 'line' | 'pie'>('bar')

  // 간단한 통계 계산
  const stats = {
    totalImpressions: data.reduce((sum, row) => sum + row.impressions, 0),
    totalClicks: data.reduce((sum, row) => sum + row.clicks, 0),
    totalCost: data.reduce((sum, row) => sum + row.cost, 0),
    avgCTR: data.length > 0 ? data.reduce((sum, row) => sum + row.ctr, 0) / data.length : 0,
    avgCPC: data.length > 0 ? data.reduce((sum, row) => sum + row.cpc, 0) / data.length : 0,
    avgCPM: data.length > 0 ? data.reduce((sum, row) => sum + row.cpm, 0) / data.length : 0
  }

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
          Data Overview
        </h3>

        {/* 차트 타입 선택 */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '4px',
          backgroundColor: 'hsl(var(--muted))',
          borderRadius: '8px'
        }}>
          <button
            onClick={() => setSelectedChart('bar')}
            className={`btn btn-sm ${selectedChart === 'bar' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px' }}
          >
            <BarChart3 size={16} />
          </button>
          <button
            onClick={() => setSelectedChart('line')}
            className={`btn btn-sm ${selectedChart === 'line' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px' }}
          >
            <LineChart size={16} />
          </button>
          <button
            onClick={() => setSelectedChart('pie')}
            className={`btn btn-sm ${selectedChart === 'pie' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px' }}
          >
            <PieChart size={16} />
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <StatCard
          label="총 노출수"
          value={stats.totalImpressions.toLocaleString()}
          unit="회"
          icon={<TrendingUp size={20} />}
          color="hsl(var(--primary))"
        />
        <StatCard
          label="총 클릭수"
          value={stats.totalClicks.toLocaleString()}
          unit="회"
          icon={<TrendingUp size={20} />}
          color="hsl(var(--chart-2))"
        />
        <StatCard
          label="총 광고비"
          value={stats.totalCost.toLocaleString()}
          unit="원"
          icon={<TrendingUp size={20} />}
          color="hsl(var(--chart-3))"
        />
        <StatCard
          label="평균 CTR"
          value={stats.avgCTR.toFixed(2)}
          unit="%"
          icon={<TrendingUp size={20} />}
          color="hsl(var(--chart-4))"
        />
        <StatCard
          label="평균 CPC"
          value={stats.avgCPC.toLocaleString()}
          unit="원"
          icon={<TrendingUp size={20} />}
          color="hsl(var(--chart-5))"
        />
        <StatCard
          label="평균 CPM"
          value={stats.avgCPM.toLocaleString()}
          unit="원"
          icon={<TrendingUp size={20} />}
          color="hsl(var(--chart-1))"
        />
      </div>

      {/* 차트 영역 */}
      <div style={{
        backgroundColor: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '12px',
        padding: '24px',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'hsl(var(--muted-foreground))'
        }}>
          <div style={{ marginBottom: '12px' }}>
            {selectedChart === 'bar' && <BarChart3 size={48} style={{ margin: '0 auto' }} />}
            {selectedChart === 'line' && <LineChart size={48} style={{ margin: '0 auto' }} />}
            {selectedChart === 'pie' && <PieChart size={48} style={{ margin: '0 auto' }} />}
          </div>
          <p style={{ fontSize: '14px', margin: 0 }}>
            {selectedChart === 'bar' && '막대 차트'}
            {selectedChart === 'line' && '선 차트'}
            {selectedChart === 'pie' && '파이 차트'}
          </p>
          <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
            차트 라이브러리 연동 후 데이터 시각화가 표시됩니다
          </p>
        </div>
      </div>
    </div>
  )
}

// 통계 카드 컴포넌트
function StatCard({ 
  label, 
  value, 
  unit, 
  icon, 
  color 
}: { 
  label: string
  value: string
  unit: string
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
      gap: '12px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{
          fontSize: '13px',
          color: 'hsl(var(--muted-foreground))',
          fontFamily: 'Paperlogy, sans-serif'
        }}>
          {label}
        </span>
        <div style={{ color }}>
          {icon}
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '4px'
      }}>
        <span style={{
          fontSize: '24px',
          fontWeight: '600',
          fontFamily: 'Paperlogy, sans-serif',
          color: 'hsl(var(--foreground))'
        }}>
          {value}
        </span>
        <span style={{
          fontSize: '14px',
          color: 'hsl(var(--muted-foreground))',
          fontFamily: 'Paperlogy, sans-serif'
        }}>
          {unit}
        </span>
      </div>
    </div>
  )
}
