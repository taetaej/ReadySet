import { Check, Database, Maximize2 } from 'lucide-react'
import { FormData } from './createDatasetTypes'
import { metaMetrics, googleMetrics, kakaoMetrics, naverGfaMetrics, naverNospMetrics, type MetricGroup } from './types'

const metricsByMedia: Record<string, MetricGroup[]> = {
  'Meta': metaMetrics,
  'Google Ads': googleMetrics,
  'kakao모먼트': kakaoMetrics,
  '네이버 성과형 DA': naverGfaMetrics,
  '네이버 보장형 DA': naverNospMetrics,
}

function getMetricLabel(media: string, id: string): string {
  const groups = metricsByMedia[media] ?? []
  for (const g of groups) {
    const found = g.metrics.find(m => m.id === id)
    if (found) return found.label
  }
  return id
}

// 매체별 광고상품 목 값
const adProductMockByMedia: Record<string, string[][]> = {
  'Meta': [
    ['전환', '경매', 'facebook', '앱 이벤트 수 극대화'],
    ['트래픽', '경매', 'instagram', '링크 클릭수 극대화'],
    ['동영상 조회', '예약', 'facebook&instagram', 'ThruPlay 조회 극대화'],
    ['도달', '경매', 'facebook', '일일 고유 도달 극대화'],
    ['잠재 고객 확보', '경매', 'instagram', '잠재 고객 수 극대화'],
  ],
}
const defaultAdMock = ['디맨드젠 캠페인', '앱', '디스플레이', '동영상', '실적 최대화']

// 지표 목 값 생성
const metricMockValues: Record<string, () => string> = {
  impressions: () => (Math.floor(Math.random() * 900000) + 100000).toLocaleString(),
  clicks: () => (Math.floor(Math.random() * 9000) + 1000).toLocaleString(),
  cost: () => (Math.floor(Math.random() * 9000000) + 1000000).toLocaleString(),
  ctr: () => (Math.random() * 4 + 0.5).toFixed(2) + '%',
  cpc: () => (Math.floor(Math.random() * 800) + 200).toLocaleString(),
  cpm: () => (Math.floor(Math.random() * 15000) + 3000).toLocaleString(),
  cpv: () => (Math.floor(Math.random() * 300) + 50).toLocaleString(),
  vtr: () => (Math.random() * 30 + 5).toFixed(1) + '%',
  reach: () => (Math.floor(Math.random() * 500000) + 50000).toLocaleString(),
  frequency: () => (Math.random() * 3 + 1).toFixed(1),
  link_click: () => (Math.floor(Math.random() * 5000) + 500).toLocaleString(),
  video_views_3s: () => (Math.floor(Math.random() * 80000) + 10000).toLocaleString(),
  purchase: () => (Math.floor(Math.random() * 500) + 50).toLocaleString(),
  install: () => (Math.floor(Math.random() * 300) + 30).toLocaleString(),
  conversions: () => (Math.floor(Math.random() * 400) + 40).toLocaleString(),
  all_conversions: () => (Math.floor(Math.random() * 400) + 40).toLocaleString(),
  video_views: () => (Math.floor(Math.random() * 60000) + 5000).toLocaleString(),
}

function getMockMetricValue(id: string): string {
  const fn = metricMockValues[id]
  return fn ? fn() : (Math.floor(Math.random() * 90000) + 10000).toLocaleString()
}

// 5행 목 데이터 생성
function generateMockRows(formData: FormData) {
  const industryPool = [
    ['패션', '패션의류', '여성의류'],
    ['식품', '가공식품', '즉석식품'],
    ['금융보험및증권', '금융', '카드'],
    ['서비스', '플랫폼및IT서비스', '모바일앱'],
    ['화장품및보건용품', '기초화장품', '스킨케어'],
  ]
  const targetPool = ['데스크톱', '모바일', '태블릿', 'PC', '앱 내']
  const periodStart = formData.period.startYear
    ? formData.periodType === 'quarter'
      ? `${formData.period.startYear}-Q${formData.period.startMonth}`
      : `${formData.period.startYear}-${formData.period.startMonth.padStart(2, '0')}`
    : '2024-01'

  return Array.from({ length: 5 }, (_, i) => {
    const rawInd = formData.industries[i]?.split(' > ')
    const ind = [
      rawInd?.[0] || industryPool[i % industryPool.length][0],
      rawInd?.[1] || industryPool[i % industryPool.length][1],
      rawInd?.[2] || industryPool[i % industryPool.length][2],
    ]
    const adCols = formData.media === 'Meta'
      ? (adProductMockByMedia['Meta'][i] ?? adProductMockByMedia['Meta'][0])
      : [defaultAdMock[i % defaultAdMock.length]]
    const targeting = formData.targetingCategory
      ? (formData.targetingOptions[i % Math.max(formData.targetingOptions.length, 1)] ?? targetPool[i % targetPool.length])
      : null
    const metrics = formData.metrics.map(m => getMockMetricValue(m))
    return { period: periodStart, media: formData.media || 'Meta', ind, adCols, targeting, metrics }
  })
}




interface Props {
  formData: FormData
  onShowSampleData: () => void
}

export function CreateDatasetStep3({ formData, onShowSampleData }: Props) {
  const totalRows = (() => {
    if (!formData.period.startYear || !formData.period.endYear) return 0
    const multiplier = formData.periodType === 'quarter' ? 3 : 1
    const startTotal = parseInt(formData.period.startYear) * 12 + (parseInt(formData.period.startMonth) - 1) * multiplier
    const endTotal = parseInt(formData.period.endYear) * 12 + (parseInt(formData.period.endMonth) - 1) * multiplier
    const periods = Math.floor((endTotal - startTotal) / multiplier) + 1
    return periods * (formData.industries.length || 0) * (formData.products.length || 0) * (formData.targetingOptions.length || 1)
  })()



  return (
    <div style={{ width: '800px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>검토 및 추출</h2>

      {/* 안내 */}
      <div style={{ padding: '16px 20px', backgroundColor: 'hsl(var(--muted) / 0.3)', border: '1px solid hsl(var(--border))', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--foreground))', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} />
          우측 Configuration Summary에서 설정 내용을 확인하세요.
        </div>
      </div>

      {/* 데이터 미리보기 */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>데이터 미리보기</h3>
        <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '16px' }}>
          샘플 데이터 5행을 통해 데이터 구조를 확인하세요.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Database size={14} />
            추출할 전체 데이터 : {totalRows.toLocaleString()} 행
          </div>
          <button onClick={onShowSampleData} className="btn btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'hsl(var(--foreground))', color: 'hsl(var(--background))', border: 'none' }}>
            <Maximize2 size={14} />
            전체 컬럼 보기
          </button>
        </div>

        <div style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ backgroundColor: 'hsl(var(--muted))', borderBottom: '1px solid hsl(var(--border))' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '80px' }}>기간</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '90px' }}>매체</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '80px' }}>업종(대)</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '80px' }}>업종(중)</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '80px' }}>업종(소)</th>
                {formData.media === 'Meta'
                  ? ['캠페인 목표', '구매 유형', '플랫폼', '성과 목표'].map(l => <th key={l} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '100px' }}>{l}</th>)
                  : <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '110px' }}>캠페인 유형</th>
                }
                {formData.targetingCategory && <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '90px' }}>{formData.targetingCategory}</th>}
                {formData.metrics.slice(0, 5).map(m => <th key={m} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px', width: '100px' }}>{getMetricLabel(formData.media, m)}</th>)}
              </tr>
            </thead>
            <tbody>
              {generateMockRows(formData).map((row, i) => (
                <tr key={i} style={{ borderBottom: i < 4 ? '1px solid hsl(var(--border))' : 'none' }}>
                  <td style={{ padding: '10px 12px', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.period}</td>
                  <td style={{ padding: '10px 12px', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.media}</td>
                  <td style={{ padding: '10px 12px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.ind[0] || '—'}</td>
                  <td style={{ padding: '10px 12px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.ind[1] || '—'}</td>
                  <td style={{ padding: '10px 12px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.ind[2] || '—'}</td>
                  {row.adCols.map((v, j) => <td key={j} style={{ padding: '10px 12px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</td>)}
                  {formData.targetingCategory && <td style={{ padding: '10px 12px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>{row.targeting}</td>}
                  {row.metrics.map((v, j) => <td key={j} style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
