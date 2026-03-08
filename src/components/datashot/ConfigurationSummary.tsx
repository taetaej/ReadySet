interface ConfigurationSummaryProps {
  formData: {
    datasetName: string
    media: string
    industries: string[]
    period: {
      startYear: string
      startMonth: string
      endYear: string
      endMonth: string
    }
    periodType: 'month' | 'quarter'
    products: string[]
    metrics: string[]
    targetingCategory: string
    targetingOptions: string[]
  }
  currentStep: number
}

export function ConfigurationSummary({ formData, currentStep }: ConfigurationSummaryProps) {
  const calculateMetaProductCount = () => {
    try {
      const groups = formData.products.map(p => JSON.parse(p))
      return groups.reduce((sum, g) => {
        const buyingCount = g.buyingTypes?.length || 2
        const platformCount = g.platforms?.length || 6
        const goalCount = g.performanceGoals?.length || 6
        return sum + (buyingCount * platformCount * goalCount)
      }, 0)
    } catch {
      return formData.products.length
    }
  }

  const productCount = formData.media === 'Meta' 
    ? calculateMetaProductCount() 
    : formData.products.length

  return (
    <div style={{ position: 'sticky', top: '24px' }}>
      <div style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '24px' }}>
        <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid hsl(var(--border))' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'hsl(var(--muted-foreground))' }}>
            Configuration Summary
          </h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
              Step 1 · 조회조건 설정
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SummaryItem label="데이터셋명" value={formData.datasetName || '—'} />
              <SummaryItem label="매체" value={formData.media || '—'} />
              <SummaryItem label="업종" value={formData.industries.length > 0 ? `${formData.industries.length}개` : '—'} />
              <SummaryItem 
                label="조회기간" 
                value={
                  formData.period.startYear && formData.period.startMonth 
                    ? `${formData.period.startYear}-${formData.period.startMonth.padStart(2, '0')}${formData.periodType === 'quarter' ? 'Q' : ''} → ${formData.period.endYear}-${formData.period.endMonth.padStart(2, '0')}${formData.periodType === 'quarter' ? 'Q' : ''}` 
                    : '—'
                }
              />
              <SummaryItem label="광고상품" value={productCount > 0 ? `${productCount}개` : '—'} />
              <SummaryItem label="지표" value={formData.metrics.length > 0 ? `${formData.metrics.length}개` : '—'} />
              <SummaryItem 
                label="타겟팅 옵션" 
                value={formData.targetingCategory ? `${formData.targetingCategory}${formData.targetingOptions.length > 0 ? ` (${formData.targetingOptions.length}개)` : ''}` : '—'}
              />
            </div>
          </div>

          {currentStep === 2 && (
            <>
              <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />
              <div>
                <div style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
                  Step 2 · 샘플 데이터
                </div>
                <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                  샘플 데이터 확인 완료 시<br />추출을 시작할 수 있습니다.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  const hasValue = value !== '—'
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
        {label}
      </span>
      <span style={{ 
        fontSize: '13px', 
        fontWeight: '500',
        color: hasValue ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
        textAlign: 'right',
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {value}
      </span>
    </div>
  )
}
