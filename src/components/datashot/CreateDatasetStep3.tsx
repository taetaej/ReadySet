import { Check, Maximize2, SearchX } from 'lucide-react'
import { FormData } from './createDatasetTypes'
import { metaMetrics, googleMetrics, kakaoMetrics, naverGfaMetrics, naverNospMetrics, tiktokMetrics, type MetricGroup } from './types'
import { adProductStructureByMedia } from './sampleData'

const metricsByMedia: Record<string, MetricGroup[]> = {
  'Meta': metaMetrics,
  'Google Ads': googleMetrics,
  'kakao모먼트': kakaoMetrics,
  '네이버 성과형 DA': naverGfaMetrics,
  '네이버 보장형 DA': naverNospMetrics,
  'TikTok': tiktokMetrics,
}

function getMetricLabel(media: string, id: string): string {
  const groups = metricsByMedia[media] ?? []
  for (const g of groups) {
    const found = g.metrics.find(m => m.id === id)
    if (found) return found.label
  }
  return id
}


// 지표별 숫자 값만 반환
const metricMockNumbers: Record<string, () => number> = {
  impressions: () => Math.floor(Math.random() * 900000) + 100000,
  clicks: () => Math.floor(Math.random() * 9000) + 1000,
  cost: () => Math.floor(Math.random() * 9000000) + 1000000,
  ctr: () => parseFloat((Math.random() * 4 + 0.5).toFixed(2)),
  cpc: () => Math.floor(Math.random() * 800) + 200,
  cpm: () => Math.floor(Math.random() * 15000) + 3000,
  cpv: () => Math.floor(Math.random() * 300) + 50,
  vtr: () => parseFloat((Math.random() * 30 + 5).toFixed(2)),
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

// 선택한 광고상품(products JSON)에서 "값이 선택된 필드"만 추출 (라벨 + 값 목록)
// → 선택한 분류만 미리보기 컬럼으로 노출하기 위함.
function getSelectedProductFields(formData: FormData): { key: string; label: string; values: string[] }[] {
  const structure = formData.media ? adProductStructureByMedia[formData.media] : null
  if (!structure) return []
  const picked: Record<string, Set<string>> = {}
  formData.products.forEach(p => {
    try {
      const parsed = JSON.parse(p)
      Object.entries(parsed).forEach(([key, val]) => {
        if (!picked[key]) picked[key] = new Set()
        if (Array.isArray(val)) val.forEach(v => picked[key].add(String(v)))
        else if (val) picked[key].add(String(val))
      })
    } catch {}
  })
  // structure의 필드 순서를 유지하면서, 선택된 값이 있는 필드만
  return structure.fields
    .filter(f => (picked[f.key]?.size ?? 0) > 0)
    .map(f => ({ key: f.key, label: f.label, values: Array.from(picked[f.key]) }))
}

// 5행 목 데이터 생성
function generateMockRows(formData: FormData, selectedFields: { key: string; label: string; values: string[] }[]) {
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
    // 선택된 분류 필드별로 행값을 순환해 샘플 노출
    const adCols = selectedFields.map(f => f.values[i % f.values.length])
    const targeting = formData.targetingCategory
      ? (formData.targetingOptions[i % Math.max(formData.targetingOptions.length, 1)] ?? targetPool[i % targetPool.length])
      : null
    const fixedMetrics = (['cost', 'impressions', 'clicks', 'ctr', 'cpc'] as const).map(m => getMockMetricNumber(m))
    return { period: periodStart, media: formData.media || 'Meta', ind, adCols, targeting, metrics: fixedMetrics }
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



  // 업종(중) 컬럼은 중분류 선택 시에만 노출. 업종(소)는 미제공(폐지).
  const showMidIndustry = formData.industryLevel === 'mid'
  // 선택한 광고분류 필드만 컬럼으로 노출
  const selectedFields = getSelectedProductFields(formData)
  // 타겟팅은 카테고리 + 옵션 1개↑ 선택 시에만 노출 (광고상품 Step3와 통일)
  const showTargeting = !!(formData.targetingCategory && formData.targetingOptions.length > 0)
  const mockRows = generateMockRows(formData, selectedFields)

  return (
    <div style={{ width: '800px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>검토 및 추출</h2>

      {/* 안내 */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'hsl(var(--muted) / 0.3)',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '500',
          color: 'hsl(var(--foreground))',
          lineHeight: '1.5',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={16} />
          우측 Configuration Summary에서 설정 내용을 확인하세요!
        </div>
      </div>

      {/* 데이터 미리보기 */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>데이터 미리보기</h3>
        <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '16px' }}>
          샘플 데이터를 통해 데이터 구조를 확인하세요. 조건이 세분화될수록 데이터가 적어질 수 있으니, 결과 해석 시 유의하시기 바랍니다.
        </p>

        {totalRows === 0 ? (
          <div style={{
            padding: '48px 40px',
            textAlign: 'center',
            border: '1px dashed hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--muted-foreground))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <SearchX size={32} style={{ opacity: 0.5 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                설정한 조회조건에 맞는 데이터가 없습니다.
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                이전 단계로 돌아가서 조회조건을 다시 설정해주세요.
              </div>
            </div>
          </div>
        ) : (
        <>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
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
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '12px', width: '80px' }}>기간</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '12px', width: '90px' }}>매체</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '12px', width: '80px' }}>업종(대)</th>
                {showMidIndustry && <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '12px', width: '80px' }}>업종(중)</th>}
                {selectedFields.map(f => <th key={f.key} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '12px', width: '100px' }}>{f.label}</th>)}
                {showTargeting && <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '12px', width: '90px' }}>{formData.targetingCategory}</th>}
                {(['cost', 'impressions', 'clicks', 'ctr', 'cpc'] as const).map(m => <th key={m} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '12px', width: '100px' }}>{getMetricLabel(formData.media, m)}</th>)}
              </tr>
            </thead>
            <tbody>
              {mockRows.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < 4 ? '1px solid hsl(var(--border))' : 'none' }}>
                  <td style={{ padding: '10px 12px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.period}</td>
                  <td style={{ padding: '10px 12px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.media}</td>
                  <td style={{ padding: '10px 12px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.ind[0] || '—'}</td>
                  {showMidIndustry && <td style={{ padding: '10px 12px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.ind[1] || '—'}</td>}
                  {row.adCols.map((v, j) => <td key={j} style={{ padding: '10px 12px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</td>)}
                  {showTargeting && <td style={{ padding: '10px 12px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>{row.targeting}</td>}
                  {row.metrics.map((v, j) => {
                    const metricId = (['cost', 'impressions', 'clicks', 'ctr', 'cpc'] as const)[j]
                    const unit = metricUnits[metricId] || ''
                    const isPercent = unit === '%'
                    const formatted = isPercent
                      ? v.toFixed(2)
                      : v.toLocaleString()
                    return (
                      <td key={j} style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right', whiteSpace: 'nowrap', color: '#0A0A0A' }}>
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
        </>
        )}
      </div>
    </div>
  )
}
