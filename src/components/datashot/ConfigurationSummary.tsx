import { metaMetrics } from './types'
import { adProductStructureByMedia } from './sampleData'
import { FormData } from './createDatasetTypes'

interface ConfigurationSummaryProps {
  formData: FormData
  currentStep: number
}

export function ConfigurationSummary({ formData, currentStep }: ConfigurationSummaryProps) {
  // products 배열에서 각 field별 선택값 합산
  const getFieldValues = (fieldKey: string): string[] => {
    const values = new Set<string>()
    formData.products.forEach(p => {
      try {
        const parsed = JSON.parse(p)
        const val = parsed[fieldKey]
        if (Array.isArray(val)) val.forEach((v: string) => values.add(v))
        else if (val) values.add(val)
      } catch {}
    })
    return Array.from(values)
  }

  const structure = formData.media ? adProductStructureByMedia[formData.media] : null

  return (
    <div style={{ position: 'sticky', top: '24px' }}>
      <div style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '24px' }}>
        <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid hsl(var(--border))' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'hsl(var(--muted-foreground))' }}>
            Configuration Summary
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Step 1 · BASIC INFORMATION */}
          <div>
            <StepLabel label="BASIC INFORMATION" step={1} currentStep={currentStep} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SummaryItem label="데이터셋명" value={formData.datasetName || '—'} />
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
              <IndustryItem industries={formData.industries} />
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />

          {/* Step 2 · QUERY SETTINGS */}
          <div>
            <StepLabel label="QUERY SETTINGS" step={2} currentStep={currentStep} />
            {!formData.media ? (
              <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', fontStyle: 'italic' }}>
                Pending
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* 매체 */}
                <SummaryItem label="매체" value={formData.media} />

                {/* 매체별 광고상품 필드 동적 렌더링 */}
                {structure && structure.fields.map(field => {
                  const values = getFieldValues(field.key)
                  return (
                    <SummaryItem
                      key={field.key}
                      label={field.label}
                      value={values.length > 0 ? `${values.length}개` : '—'}
                      detail={values.length > 0 && values.length <= 3 ? values.join(', ') : undefined}
                    />
                  )
                })}

                {/* 타겟팅 옵션 */}
                <SummaryItem
                  label="타겟팅 옵션"
                  value={
                    formData.targetingCategory
                      ? formData.targetingOptions.length > 0
                        ? `${formData.targetingOptions.length}개`
                        : '선택 안 함'
                      : '선택 안 함'
                  }
                  detail={
                    formData.targetingCategory && formData.targetingOptions.length > 0
                      ? `${formData.targetingCategory} › ${formData.targetingOptions.join(', ')}`
                      : undefined
                  }
                />

                {/* 지표 */}
                <MetricsItem metrics={formData.metrics} media={formData.media} />
              </div>
            )}
          </div>

          <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />

          {/* Step 3 · REVIEW & EXTRACT */}
          <div>
            <StepLabel label="REVIEW & EXTRACT" step={3} currentStep={currentStep} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>검토</span>
              <span style={{ fontSize: '13px', fontWeight: '500', color: currentStep >= 3 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                {currentStep >= 3 ? '확인 중' : '—'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function StepLabel({ label, step, currentStep }: { label: string; step: number; currentStep: number }) {
  const isActive = currentStep === step
  const isDone = currentStep > step
  return (
    <div style={{
      fontSize: '10px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      marginBottom: '12px',
      color: isActive ? 'hsl(var(--primary))' : isDone ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
    }}>
      Step {step} · {label}
    </div>
  )
}

function SummaryItem({ label, value, detail }: { label: string; value: string; detail?: string }) {
  const hasValue = value !== '—' && value !== '선택 안 함'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>{label}</span>
        <span style={{
          fontSize: '13px', fontWeight: '500',
          color: hasValue ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
          textAlign: 'right', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }}>
          {value}
        </span>
      </div>
      {detail && (
        <div style={{
          marginTop: '4px',
          fontSize: '11px',
          color: 'hsl(var(--muted-foreground))',
          textAlign: 'right',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {detail}
        </div>
      )}
    </div>
  )
}

function IndustryItem({ industries }: { industries: string[] }) {
  const grouped: Record<string, number> = {}
  industries.forEach(ind => {
    const key = ind.split(' > ')[0] || ind
    grouped[key] = (grouped[key] || 0) + 1
  })
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>업종</span>
        <span style={{ fontSize: '13px', fontWeight: '500', color: industries.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
          {industries.length > 0 ? `${industries.length}개` : '—'}
        </span>
      </div>
      {industries.length > 0 && (
        <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: '6px', maxHeight: '160px', overflowY: 'auto' }}>
          {Object.entries(grouped).map(([cat, count], i) => (
            <div key={i} style={{ fontSize: '11px', color: 'hsl(var(--foreground))', lineHeight: '1.6' }}>
              <span style={{ color: 'hsl(var(--muted-foreground))' }}>{cat}</span>
              <span style={{ margin: '0 4px', color: 'hsl(var(--muted-foreground))' }}>›</span>
              <span>{count}개</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MetricsItem({ metrics, media }: { metrics: string[]; media: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>지표</span>
        <span style={{ fontSize: '13px', fontWeight: '500', color: metrics.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
          {metrics.length > 0 ? `${metrics.length}개` : '—'}
        </span>
      </div>
      {metrics.length > 0 && media === 'Meta' && (
        <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: '6px', maxHeight: '200px', overflowY: 'auto' }}>
          {metaMetrics.map(group => {
            const matched = group.metrics.filter(m => metrics.includes(m.id))
            if (!matched.length) return null
            return (
              <div key={group.group} style={{ fontSize: '11px', lineHeight: '1.6' }}>
                <span style={{ color: 'hsl(var(--muted-foreground))' }}>{group.group}</span>
                <span style={{ margin: '0 4px', color: 'hsl(var(--muted-foreground))' }}>›</span>
                <span>{matched.map(m => m.label).join(', ')}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
