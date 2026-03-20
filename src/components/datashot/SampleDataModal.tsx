import { Database } from 'lucide-react'



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

// 지표별 숫자 값만 반환 (단위는 별도 렌더링)
const metricMockNumbers: Record<string, () => number> = {
  impressions: () => Math.floor(Math.random() * 900000) + 100000,
  clicks: () => Math.floor(Math.random() * 9000) + 1000,
  cost: () => Math.floor(Math.random() * 9000000) + 1000000,
  ctr: () => parseFloat((Math.random() * 4 + 0.5).toFixed(2)),
  cpc: () => Math.floor(Math.random() * 800) + 200,
  cpm: () => Math.floor(Math.random() * 15000) + 3000,
  cpv: () => Math.floor(Math.random() * 300) + 50,
  vtr: () => parseFloat((Math.random() * 30 + 5).toFixed(1)),
  reach: () => Math.floor(Math.random() * 500000) + 50000,
  frequency: () => parseFloat((Math.random() * 3 + 1).toFixed(1)),
  link_click: () => Math.floor(Math.random() * 5000) + 500,
  video_views_3s: () => Math.floor(Math.random() * 80000) + 10000,
  purchase: () => Math.floor(Math.random() * 500) + 50,
  install: () => Math.floor(Math.random() * 300) + 30,
  conversions: () => Math.floor(Math.random() * 400) + 40,
  all_conversions: () => Math.floor(Math.random() * 400) + 40,
  video_views: () => Math.floor(Math.random() * 60000) + 5000,
}

const metricUnits: Record<string, string> = {
  impressions: '회', clicks: '회', cost: '원', cpc: '원', cpm: '원', cpv: '원',
  reach: '회', link_click: '회', video_views_3s: '회', purchase: '회',
  install: '회', conversions: '회', all_conversions: '회', video_views: '회',
  ctr: '%', vtr: '%',
}

function getMockMetricNumber(id: string): number {
  const fn = metricMockNumbers[id]
  return fn ? fn() : Math.floor(Math.random() * 90000) + 10000
}

const industryPool = [
  ['패션', '의류', '여성의류'],
  ['식품', '가공식품', '즉석식품'],
  ['금융', '은행', '카드'],
  ['서비스', 'IT서비스', '모바일앱'],
  ['화장품', '기초화장품', '스킨케어'],
]
const targetPool = ['데스크톱', '모바일', '태블릿', 'PC', '앱 내']

interface SampleDataModalProps {
  isOpen: boolean
  onClose: () => void
  formData: {
    media: string
    period: {
      startYear: string
      startMonth: string
      endYear: string
      endMonth: string
    }
    periodType: 'month' | 'quarter'
    industries: string[]
    products: string[]
    metrics: string[]
    targetingCategory: string
    targetingOptions: string[]
  }
}

export function SampleDataModal({ isOpen, onClose, formData }: SampleDataModalProps) {
  if (!isOpen) return null

  const adProductColumns = formData.media === 'Meta'
    ? [
        { key: 'objective', label: '캠페인 목표' },
        { key: 'buyingType', label: '구매 유형' },
        { key: 'platform', label: '플랫폼' },
        { key: 'performanceGoal', label: '성과 목표' }
      ]
    : [{ key: 'product', label: '캠페인 유형' }]

  const periodStr = formData.period.startYear
    ? formData.periodType === 'quarter'
      ? `${formData.period.startYear}-Q${formData.period.startMonth}`
      : `${formData.period.startYear}-${formData.period.startMonth.padStart(2, '0')}`
    : '2024-01'

  const mockRows = Array.from({ length: 5 }, (_, i) => {
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
    const metrics = formData.metrics.map(m => getMockMetricNumber(m))
    return { ind, adCols, targeting, metrics }
  })

  // 지표는 광고비 → 노출수 → 클릭수 → CTR → CPC 고정 순서
  const fixedMetrics = [
    { id: 'cost', label: '광고비' },
    { id: 'impressions', label: '노출수' },
    { id: 'clicks', label: '클릭수' },
    { id: 'ctr', label: 'CTR' },
    { id: 'cpc', label: 'CPC' },
  ]

  const th = (right = false): React.CSSProperties => ({
    padding: '8px 12px', textAlign: right ? 'right' : 'left', fontSize: '12px', fontWeight: '500',
    whiteSpace: 'nowrap', backgroundColor: 'hsl(var(--muted))',
    borderBottom: '1px solid hsl(var(--border))',
    borderRight: '1px solid hsl(var(--border) / 0.5)',
    position: 'sticky', top: 0, zIndex: 1,
  })
  const td = (right = false, muted = false): React.CSSProperties => ({
    padding: '8px 12px', fontSize: '12px', whiteSpace: 'nowrap',
    textAlign: right ? 'right' : 'left',
    borderBottom: '1px solid hsl(var(--border))',
    borderRight: '1px solid hsl(var(--border) / 0.5)',
    color: muted ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))'
  })

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog-content dialog-full"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">샘플 데이터 미리보기</h3>
          <p className="dialog-description">
            데이터 구조를 확인하고, 조회조건이 다르다면 이전 단계에서 수정하세요.
          </p>
        </div>

        <div style={{ padding: '24px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'Paperlogy, sans-serif', color: 'hsl(var(--foreground))', margin: 0 }}>
              Sample Data
            </h3>
            <span style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: 'hsl(var(--muted-foreground))' }}>
              <Database size={14} />
              예상 데이터 크기 : 1,234 행
            </span>
          </div>

          {/* 스크롤 컨테이너: minHeight:0 필수 */}
          <div style={{
            flex: 1, minHeight: 0,
            border: '1px solid hsl(var(--border))', borderRadius: '8px',
            overflow: 'auto',
            backgroundColor: 'hsl(var(--card))'
          }}>
            <table style={{ borderCollapse: 'collapse', fontSize: '12px', width: '100%', minWidth: 'max-content' }}>
              <thead>
                <tr>
                  <th style={th()}>기간</th>
                  <th style={th()}>매체</th>
                  <th style={th()}>업종(대)</th>
                  <th style={th()}>업종(중)</th>
                  <th style={th()}>업종(소)</th>
                  {adProductColumns.map(col => <th key={col.key} style={th()}>{col.label}</th>)}
                  {formData.targetingCategory && <th style={th()}>{formData.targetingCategory}</th>}
                  {fixedMetrics.map(m => <th key={m.id} style={th(true)}>{m.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {mockRows.map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 1 ? 'hsl(var(--muted) / 0.2)' : 'transparent' }}>
                    <td style={td()}>{periodStr}</td>
                    <td style={td()}>{formData.media || 'Meta'}</td>
                    <td style={td(false, true)}>{row.ind[0]}</td>
                    <td style={td(false, true)}>{row.ind[1]}</td>
                    <td style={td(false, true)}>{row.ind[2]}</td>
                    {row.adCols.map((v, j) => <td key={j} style={td(false, true)}>{v}</td>)}
                    {formData.targetingCategory && <td style={td(false, true)}>{row.targeting}</td>}
                    {fixedMetrics.map(m => {
                      const val = getMockMetricNumber(m.id)
                      const unit = metricUnits[m.id] || ''
                      const isPercent = unit === '%'
                      const formatted = isPercent
                        ? val.toFixed(m.id === 'vtr' ? 1 : 2)
                        : val.toLocaleString()
                      return (
                        <td key={m.id} style={td(true)}>
                          {formatted}
                          {unit && <span style={{ fontSize: '10px', opacity: 0.5, marginLeft: isPercent ? '2px' : '4px', fontWeight: '400' }}>{unit}</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dialog-footer">
          <button onClick={onClose} className="btn btn-primary btn-md">확인</button>
        </div>
      </div>
    </div>
  )
}
