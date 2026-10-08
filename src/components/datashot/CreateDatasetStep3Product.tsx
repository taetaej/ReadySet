// 광고상품 기준 Step3 — 검토 및 추출
// 컬럼: 기간 / 매체 / 업종(대) / 업종(중) / 광고상품 / 선택 지표들
// 행: 선택한 매체 × 광고상품 조합. 지표는 사용자가 고른 것.
import { Check, Maximize2, SearchX } from 'lucide-react'
import type { FormData } from './createDatasetTypes'
import { getMetricGroups } from './MetricSelect'
import { isWithin2026H1, getBenchmarkMetricsFor, type BenchmarkMetricValues } from './benchmark2026H1'

// 목 지표값 생성
function mockMetricValue(id: string): { value: string; unit: string } {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)
  if (id.includes('ctr') || id.includes('vtr')) return { value: (Math.random() * 4 + 0.5).toFixed(2), unit: '%' }
  if (id.includes('cpm')) return { value: rand(3000, 18000).toLocaleString(), unit: '원' }
  if (id.includes('cpc')) return { value: rand(200, 1000).toLocaleString(), unit: '원' }
  if (id.includes('cpv')) return { value: rand(50, 350).toLocaleString(), unit: '원' }
  if (id.includes('cost')) return { value: rand(1000000, 9000000).toLocaleString(), unit: '원' }
  if (id.includes('impressions')) return { value: rand(100000, 900000).toLocaleString(), unit: '회' }
  if (id.includes('clicks')) return { value: rand(1000, 9000).toLocaleString(), unit: '회' }
  if (id.includes('views')) return { value: rand(5000, 80000).toLocaleString(), unit: '회' }
  return { value: rand(1000, 90000).toLocaleString(), unit: '' }
}

// 범위 내(2026 1~6월) 실데이터 셀값. 노출/클릭/비용/조회 + 파생지표(CPM/CPC/CPV/CTR/VTR)는 실데이터.
// 그 외 지표(전환수 등)는 데이터에 없으므로 null → 호출부에서 mock으로 폴백.
function benchMetricValue(id: string, m: BenchmarkMetricValues): { value: string; unit: string } | null {
  if (id.includes('ctr')) return { value: m.ctr.toFixed(2), unit: '%' }
  if (id.includes('vtr')) return { value: m.vtr.toFixed(2), unit: '%' }
  if (id.includes('cpm')) return { value: m.cpm.toLocaleString(), unit: '원' }
  if (id.includes('cpc')) return { value: m.cpc.toLocaleString(), unit: '원' }
  if (id.includes('cpv')) return { value: m.cpv.toLocaleString(), unit: '원' }
  if (id.includes('cost')) return { value: m.cost.toLocaleString(), unit: '원' }
  if (id.includes('impressions')) return { value: m.impressions.toLocaleString(), unit: '회' }
  if (id.includes('clicks')) return { value: m.clicks.toLocaleString(), unit: '회' }
  if (id.includes('views')) return { value: m.views.toLocaleString(), unit: '회' }
  return null
}

interface Props {
  formData: FormData
  onShowSampleData: () => void
}

export function CreateDatasetStep3Product({ formData, onShowSampleData }: Props) {
  const mediaProducts = formData.mediaProducts
  const productMetrics = formData.productMetrics
  const selectedMedias = Object.keys(mediaProducts)

  // 업종(중) 컬럼은 선택한 업종 레벨이 중분류일 때만 노출
  const showMidIndustry = formData.industryLevel === 'mid'
  // Step1에서 선택한 업종 → {대, 중} 분해. 비어있으면 '전체'
  // (industries 값: 대분류='패션', 중분류='패션 > 패션의류' 형태)
  const industryRows = formData.industries.length > 0
    ? formData.industries.map(s => {
        const parts = s.split(' > ')
        return { major: parts[0], mid: parts[1] ?? '' }
      })
    : [{ major: '전체', mid: '' }]

  // 선택 지표 라벨 (매체 수에 따른 공통/매체별 그룹에서 매칭)
  const metricLabels = (() => {
    const groups = getMetricGroups(selectedMedias, formData.purpose)
    const flat = groups.flatMap(g => g.metrics)
    return productMetrics.map(id => flat.find(m => m.id === id)?.label ?? id)
  })()

  const periodStart = formData.period.startYear
    ? formData.periodType === 'quarter'
      ? `${formData.period.startYear}-Q${formData.period.startMonth}`
      : `${formData.period.startYear}-${formData.period.startMonth.padStart(2, '0')}`
    : '2024-01'

  // 행: 매체 × 광고상품 × 업종 조합
  const rows = selectedMedias.flatMap((media) =>
    (mediaProducts[media] || []).flatMap((product) =>
      industryRows.map((ind) => ({ media, product, major: ind.major, mid: ind.mid }))
    )
  )

  const hasData = rows.length > 0 && productMetrics.length > 0
  // 조회기간이 2026 1~6월 범위면 미리보기 지표를 실데이터로 채운다
  const useBenchmark = isWithin2026H1(formData.period)

  // 타겟팅·파트너사: 선택했으면 컬럼 추가
  const hasTargeting = !!(formData.targetingCategory && formData.targetingOptions.length > 0)
  const hasPartners = formData.productCollaborativePartners.length > 0

  return (
    <div style={{ width: '800px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>검토 및 추출</h2>

      {/* 안내 */}
      <div style={{
        padding: '16px 20px', backgroundColor: 'hsl(var(--muted) / 0.3)',
        border: '1px solid hsl(var(--border))', borderRadius: '8px', marginBottom: '24px',
      }}>
        <div style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--foreground))', lineHeight: '1.5', display: 'flex', alignItems: 'center', gap: '8px' }}>
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

        {!hasData ? (
          <div style={{
            padding: '48px 40px', textAlign: 'center', border: '1px dashed hsl(var(--border))',
            borderRadius: '8px', color: 'hsl(var(--muted-foreground))',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          }}>
            <SearchX size={32} style={{ opacity: 0.5 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>설정한 조회조건에 맞는 데이터가 없습니다.</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>이전 단계로 돌아가서 조회조건을 다시 설정해주세요.</div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <button onClick={onShowSampleData} className="btn btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'hsl(var(--foreground))', color: 'hsl(var(--background))', border: 'none' }}>
                <Maximize2 size={14} />
                전체 컬럼 보기
              </button>
            </div>

            <div style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'auto' }}>
              <PreviewTable rows={rows.slice(0, 5)} metricLabels={metricLabels} productMetrics={productMetrics} periodStart={periodStart} showMidIndustry={showMidIndustry} targetingCategory={hasTargeting ? formData.targetingCategory : ''} targetingOptions={formData.targetingOptions} partners={hasPartners ? formData.productCollaborativePartners : []} useBenchmark={useBenchmark} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// 미리보기/모달 공용 표
function PreviewTable({ rows, metricLabels, productMetrics, periodStart, showMidIndustry, targetingCategory, targetingOptions, partners, useBenchmark = false, zebra = false }: {
  rows: { media: string; product: string; major: string; mid: string }[]
  metricLabels: string[]
  productMetrics: string[]
  periodStart: string
  showMidIndustry: boolean
  targetingCategory: string
  targetingOptions: string[]
  partners: string[]
  useBenchmark?: boolean
  zebra?: boolean
}) {
  const showTargeting = !!(targetingCategory && targetingOptions.length > 0)
  const showPartners = partners.length > 0
  return (
    <table style={{ borderCollapse: 'collapse', fontSize: '13px', width: '100%', minWidth: 'max-content' }}>
      <thead>
        <tr style={{ backgroundColor: 'hsl(var(--muted))', borderBottom: '1px solid hsl(var(--border))' }}>
          <th style={thStyle('80px')}>기간</th>
          <th style={thStyle('110px')}>매체</th>
          <th style={thStyle('80px')}>업종(대)</th>
          {showMidIndustry && <th style={thStyle('90px')}>업종(중)</th>}
          <th style={thStyle('140px')}>광고상품</th>
          {showPartners && <th style={thStyle('110px')}>협력 광고 파트너사</th>}
          {showTargeting && <th style={thStyle('110px')}>{targetingCategory}</th>}
          {metricLabels.map(l => <th key={l} style={{ ...thStyle('100px'), textAlign: 'right' }}>{l}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          return (
            <tr key={i} style={{
              borderBottom: i < rows.length - 1 ? '1px solid hsl(var(--border))' : 'none',
              backgroundColor: zebra && i % 2 === 1 ? 'hsl(var(--muted) / 0.2)' : 'transparent',
            }}>
              <td style={tdStyle}>{periodStart}</td>
              <td style={tdStyle}>{row.media}</td>
              <td style={tdStyle}>{row.major}</td>
              {showMidIndustry && <td style={tdStyle}>{row.mid || '—'}</td>}
              <td style={{ ...tdStyle, maxWidth: '140px' }}>{row.product}</td>
              {showPartners && <td style={tdStyle}>{partners[i % partners.length]}</td>}
              {showTargeting && <td style={tdStyle}>{targetingOptions[i % targetingOptions.length]}</td>}
              {productMetrics.map(id => {
                // 범위 내 + 매체·상품에 실데이터가 있으면 실값, 아니면(데이터 없는 지표 포함) mock
                const bench = useBenchmark ? getBenchmarkMetricsFor(row.media, row.product) : null
                const { value, unit } = (bench && benchMetricValue(id, bench)) || mockMetricValue(id)
                return (
                  <td key={id} style={{ ...tdStyle, textAlign: 'right', color: 'hsl(var(--foreground))' }}>
                    {value}{unit && <span style={{ fontSize: '10px', opacity: 0.5, marginLeft: unit === '%' ? '2px' : '4px' }}>{unit}</span>}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const thStyle = (width: string): React.CSSProperties => ({
  padding: '10px 12px', textAlign: 'left', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '12px', width,
})
const tdStyle: React.CSSProperties = {
  padding: '10px 12px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
}
