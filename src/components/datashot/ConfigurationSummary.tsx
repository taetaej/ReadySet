import { metaMetrics } from './types'

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
  isStep1Confirmed: boolean
}

export function ConfigurationSummary({ formData, currentStep, isStep1Confirmed }: ConfigurationSummaryProps) {
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
              Step 1 · Basic Information
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SummaryItem label="데이터셋명" value={formData.datasetName || '—'} />
              <SummaryItem label="매체" value={formData.media || '—'} />
              
              {/* 업종 - 칩 형태로 표시 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                    업종
                  </span>
                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: '500',
                    color: formData.industries.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                  }}>
                    {formData.industries.length > 0 ? `${formData.industries.length}개` : '—'}
                  </span>
                </div>
                {formData.industries.length > 0 && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    backgroundColor: 'hsl(var(--muted) / 0.3)',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    alignItems: 'flex-start'
                  }}>
                    {formData.industries.slice(0, 20).map((industry, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '10px',
                          padding: '3px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'hsl(var(--muted))',
                          color: 'hsl(var(--foreground))',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {industry}
                      </div>
                    ))}
                    {formData.industries.length > 20 && (
                      <div style={{
                        fontSize: '10px',
                        color: 'hsl(var(--muted-foreground))',
                        fontStyle: 'italic',
                        marginTop: '4px',
                        paddingLeft: '6px'
                      }}>
                        외 {formData.industries.length - 20}개
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <SummaryItem 
                label="조회기간" 
                value={
                  formData.period.startYear && formData.period.startMonth 
                    ? formData.periodType === 'quarter'
                      ? `${formData.period.startYear}-Q${formData.period.startMonth} → ${formData.period.endYear}-Q${formData.period.endMonth}`
                      : `${formData.period.startYear}-${formData.period.startMonth.padStart(2, '0')} → ${formData.period.endYear}-${formData.period.endMonth.padStart(2, '0')}`
                    : '—'
                }
              />
              
              {/* 광고상품 - 동적 표시 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                    광고상품
                  </span>
                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: '500',
                    color: productCount > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                  }}>
                    {productCount > 0 ? `${productCount}개` : '—'}
                  </span>
                </div>
                {formData.products.length > 0 && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    backgroundColor: 'hsl(var(--muted) / 0.3)',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {formData.media === 'Meta' ? (
                      formData.products.map((product, idx) => {
                        try {
                          const parsed = JSON.parse(product)
                          
                          return (
                            <div
                              key={idx}
                              style={{
                                fontSize: '11px',
                                color: 'hsl(var(--foreground))',
                                lineHeight: '1.6',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px'
                              }}
                            >
                              <div>
                                <span style={{ fontWeight: '500' }}>조건 {idx + 1}</span>
                              </div>
                              
                              {/* 캠페인 목표 (필수, 단일) */}
                              {parsed.objective && (
                                <div>
                                  <span style={{ color: 'hsl(var(--muted-foreground))' }}>캠페인 목표</span>
                                  <span style={{ margin: '0 4px', color: 'hsl(var(--muted-foreground))' }}>›</span>
                                  <span style={{ fontWeight: '500' }}>{parsed.objective}</span>
                                </div>
                              )}
                              
                              {/* 구매유형 (선택, 다중) */}
                              {parsed.buyingTypes && (
                                <div>
                                  <span style={{ color: 'hsl(var(--muted-foreground))' }}>구매유형</span>
                                  <span style={{ margin: '0 4px', color: 'hsl(var(--muted-foreground))' }}>›</span>
                                  <span>{parsed.buyingTypes.length > 0 ? parsed.buyingTypes.join(', ') : '전체'}</span>
                                </div>
                              )}
                              
                              {/* 플랫폼 (선택, 다중) */}
                              {parsed.platforms && (
                                <div>
                                  <span style={{ color: 'hsl(var(--muted-foreground))' }}>플랫폼</span>
                                  <span style={{ margin: '0 4px', color: 'hsl(var(--muted-foreground))' }}>›</span>
                                  <span>{parsed.platforms.length > 0 ? parsed.platforms.join(', ') : '전체'}</span>
                                </div>
                              )}
                              
                              {/* 성과목표 (선택, 다중) */}
                              {parsed.performanceGoals && (
                                <div>
                                  <span style={{ color: 'hsl(var(--muted-foreground))' }}>성과목표</span>
                                  <span style={{ margin: '0 4px', color: 'hsl(var(--muted-foreground))' }}>›</span>
                                  <span>{parsed.performanceGoals.length > 0 ? parsed.performanceGoals.join(', ') : '전체'}</span>
                                </div>
                              )}
                            </div>
                          )
                        } catch {
                          return null
                        }
                      })
                    ) : (
                      formData.products.map((product, idx) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: '11px',
                            color: 'hsl(var(--foreground))',
                            lineHeight: '1.4',
                            fontWeight: '500'
                          }}
                        >
                          {product}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              {/* 지표 - 그룹별 표시 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                    지표
                  </span>
                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: '500',
                    color: formData.metrics.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                  }}>
                    {formData.metrics.length > 0 ? `${formData.metrics.length}개` : '—'}
                  </span>
                </div>
                {formData.metrics.length > 0 && formData.media === 'Meta' && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    backgroundColor: 'hsl(var(--muted) / 0.3)',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {metaMetrics.map((group) => {
                      const groupMetrics = group.metrics.filter(m => formData.metrics.includes(m.id))
                      if (groupMetrics.length === 0) return null
                      
                      return (
                        <div key={group.group} style={{ fontSize: '11px', lineHeight: '1.6' }}>
                          <div>
                            <span style={{ color: 'hsl(var(--muted-foreground))' }}>{group.group}</span>
                            <span style={{ margin: '0 4px', color: 'hsl(var(--muted-foreground))' }}>›</span>
                            <span>{groupMetrics.map(m => m.label).join(', ')}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              
              {/* 타겟팅 옵션 - 상세 리스트 표시 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                    타겟팅 옵션
                  </span>
                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: '500',
                    color: formData.targetingCategory ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                  }}>
                    {formData.targetingCategory 
                      ? (formData.targetingOptions.length > 0 ? `${formData.targetingOptions.length}개` : '선택 안 함')
                      : '선택 안 함'}
                  </span>
                </div>
                {formData.targetingCategory && formData.targetingOptions.length > 0 && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    backgroundColor: 'hsl(var(--muted) / 0.3)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: 'hsl(var(--foreground))',
                    lineHeight: '1.6'
                  }}>
                    <span style={{ color: 'hsl(var(--muted-foreground))' }}>{formData.targetingCategory}</span>
                    <span style={{ margin: '0 4px', color: 'hsl(var(--muted-foreground))' }}>›</span>
                    <span>{formData.targetingOptions.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />
          
          <div>
            <div style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
              Step 2 · Review & Extract
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                  검토
                </span>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: '500',
                  color: currentStep >= 2 && isStep1Confirmed ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                }}>
                  {currentStep >= 2 ? (isStep1Confirmed ? '확인 완료' : '미확인') : '—'}
                </span>
              </div>
            </div>
          </div>
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
