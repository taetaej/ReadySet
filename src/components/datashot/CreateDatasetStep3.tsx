import { Check, Database, Maximize2 } from 'lucide-react'
import { FormData } from './createDatasetTypes'

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

  const periodLabel = formData.period.startYear
    ? formData.periodType === 'quarter'
      ? `${formData.period.startYear}-Q${formData.period.startMonth} → ${formData.period.endYear}-Q${formData.period.endMonth}`
      : `${formData.period.startYear}-${formData.period.startMonth.padStart(2, '0')} → ${formData.period.endYear}-${formData.period.endMonth.padStart(2, '0')}`
    : '—'

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
            추출할 전체 데이터 : {totalRows.toLocaleString()} 개 행
          </div>
          <button onClick={onShowSampleData} className="btn btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'hsl(var(--foreground))', color: 'hsl(var(--background))', border: 'none' }}>
            <Maximize2 size={14} />
            전체 컬럼 보기
          </button>
        </div>

        <div style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'hsl(var(--muted))', borderBottom: '1px solid hsl(var(--border))' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>기간</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>매체</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>업종(대)</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>업종(중)</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>업종(소)</th>
                {formData.media === 'Meta'
                  ? ['캠페인 목표', '구매 유형', '플랫폼', '성과 목표'].map(l => <th key={l} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>{l}</th>)
                  : <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>광고상품</th>
                }
                {formData.targetingCategory && <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>{formData.targetingCategory}</th>}
                {formData.metrics.slice(0, 3).map(m => <th key={m} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(row => (
                <tr key={row} style={{ borderBottom: row < 5 ? '1px solid hsl(var(--border))' : 'none' }}>
                  <td style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>{periodLabel.split(' → ')[0]}</td>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{formData.media || '—'}</td>
                  <td style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>{formData.industries[0]?.split(' > ')[0] || '—'}</td>
                  <td style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>{formData.industries[0]?.split(' > ')[1] || '—'}</td>
                  <td style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>{formData.industries[0]?.split(' > ')[2] || '—'}</td>
                  {formData.media === 'Meta'
                    ? [1, 2, 3, 4].map(i => <td key={i} style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>—</td>)
                    : <td style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>—</td>
                  }
                  {formData.targetingCategory && <td style={{ padding: '10px 12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>{formData.targetingOptions[0] || '—'}</td>}
                  {formData.metrics.slice(0, 3).map(m => <td key={m} style={{ padding: '10px 12px', textAlign: 'right', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>—</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
