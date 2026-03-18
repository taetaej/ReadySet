import { metaMetrics, googleMetrics, kakaoMetrics, naverGfaMetrics, naverNospMetrics, type MetricGroup } from './types'
import { adProductStructureByMedia } from './sampleData'
import { FormData } from './createDatasetTypes'

const metricsByMedia: Record<string, MetricGroup[]> = {
  'Meta': metaMetrics,
  'Google Ads': googleMetrics,
  'kakao모먼트': kakaoMetrics,
  '네이버 성과형 DA': naverGfaMetrics,
  '네이버 보장형 DA': naverNospMetrics,
}

interface ConfigurationSummaryProps {
  formData: FormData
  currentStep: number
}

export function ConfigurationSummary({ formData, currentStep }: ConfigurationSummaryProps) {
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
          <div>
            <StepLabel label="BASIC INFORMATION" step={1} currentStep={currentStep} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SummaryItem label="데이터셋명" value={formData.datasetName || '—'} />
              <SummaryItem
                label="조회기간"
                value={
                  formData.period.startYear && formData.period.startMonth
                    ? formData.periodType === 'quarter'
                      ? formData.period.startYear + '-Q' + formData.period.startMonth + ' → ' + formData.period.endYear + '-Q' + formData.period.endMonth
                      : formData.period.startYear + '-' + formData.period.startMonth.padStart(2, '0') + ' → ' + formData.period.endYear + '-' + formData.period.endMonth.padStart(2, '0')
                    : '—'
                }
              />
              <IndustryItem industries={formData.industries} industryLevel={formData.industryLevel} />
            </div>
          </div>
          <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />
          <div>
            <StepLabel label="QUERY SETTINGS" step={2} currentStep={currentStep} />
            {!formData.media ? (
              <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', fontStyle: 'italic' }}>Pending</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <SummaryItem label="매체" value={formData.media} />
                {structure && structure.fields.map(field => {
                  const values = getFieldValues(field.key)
                  return (
                    <SummaryItem
                      key={field.key}
                      label={field.label}
                      value={values.length > 0 ? values.length + '개' : '—'}
                      chips={values.length > 0 ? values : undefined}
                    />
                  )
                })}
                <TargetingSummaryItem
                  category={formData.targetingCategory}
                  options={formData.targetingOptions}
                />
                <MetricsItem metrics={formData.metrics} media={formData.media} />
              </div>
            )}
          </div>
          <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />
          <div>
            <StepLabel label="REVIEW & EXTRACT" step={3} currentStep={currentStep} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>검토</span>
              <span style={{ fontSize: '13px', fontWeight: '500', color: currentStep >= 3 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                {currentStep >= 3 ? '확인 완료' : '—'}
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
    <div style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px', color: isActive ? 'hsl(var(--primary))' : isDone ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
      Step {step} · {label}
    </div>
  )
}

function SummaryItem({ label, value, detail, chips }: { label: string; value: string; detail?: string; chips?: string[] }) {
  const hasValue = value !== '—' && value !== '선택 안 함'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: '500', color: hasValue ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))', textAlign: 'right', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </span>
      </div>
      {chips && chips.length > 0 && <ChipList items={chips} />}
      {!chips && detail && (
        <div style={{ marginTop: '4px', fontSize: '11px', color: 'hsl(var(--muted-foreground))', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {detail}
        </div>
      )}
    </div>
  )
}

function ChipList({ items }: { items: string[] }) {
  const MAX_VISIBLE = 10
  const visible = items.slice(0, MAX_VISIBLE)
  const overflow = items.length - MAX_VISIBLE
  const chipStyle: React.CSSProperties = {
    fontSize: '10px', padding: '3px 6px', borderRadius: '4px',
    backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', whiteSpace: 'nowrap'
  }
  return (
    <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
      {visible.map((item, i) => (
        <div key={i} style={chipStyle}>{item}</div>
      ))}
      {overflow > 0 && (
        <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>외 {overflow}개</span>
      )}
    </div>
  )
}

function IndustryItem({ industries, industryLevel }: { industries: string[]; industryLevel: string | null }) {
  const levelLabel = industryLevel === 'major' ? '대분류' : industryLevel === 'mid' ? '중분류' : industryLevel === 'minor' ? '소분류' : null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>업종</span>
        <span style={{ fontSize: '13px', fontWeight: '500', color: industries.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
          {industries.length > 0 ? industries.length + '개' + (levelLabel ? ' (' + levelLabel + ')' : '') : '—'}
        </span>
      </div>
      {industries.length > 0 && <ChipList items={industries} />}
    </div>
  )
}

function TargetingSummaryItem({ category, options }: { category: string; options: string[] }) {
  const MAX_VISIBLE = 10
  const visible = options.slice(0, MAX_VISIBLE)
  const overflow = options.length - MAX_VISIBLE
  const chipStyle: React.CSSProperties = {
    fontSize: '10px', padding: '3px 6px', borderRadius: '4px',
    backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', whiteSpace: 'nowrap'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>타겟팅 옵션</span>
        <span style={{ fontSize: '13px', fontWeight: '500', color: options.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
          {!category ? '선택 안 함' : options.length > 0 ? options.length + '개' : '—'}
        </span>
      </div>
      {category && (
        <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: '6px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>{category}</span>
          <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginRight: '2px' }}>›</span>
          {visible.map((chip, i) => <div key={i} style={chipStyle}>{chip}</div>)}
          {overflow > 0 && <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>외 {overflow}개</span>}
        </div>
      )}
    </div>
  )
}

function GroupChipRow({ label, chips }: { label: string; chips: string[] }) {
  const MAX_VISIBLE = 10
  const visible = chips.slice(0, MAX_VISIBLE)
  const overflow = chips.length - MAX_VISIBLE
  const chipStyle: React.CSSProperties = {
    fontSize: '10px', padding: '3px 6px', borderRadius: '4px',
    backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', whiteSpace: 'nowrap'
  }
  return (
    <div style={{ fontSize: '11px', lineHeight: '1.6', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
      <span style={{ color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ color: 'hsl(var(--muted-foreground))', marginRight: '2px' }}>›</span>
      {visible.map((chip, i) => <div key={i} style={chipStyle}>{chip}</div>)}
      {overflow > 0 && <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>외 {overflow}개</span>}
    </div>
  )
}

function MetricsItem({ metrics, media }: { metrics: string[]; media: string }) {
  const groups = metricsByMedia[media] ?? []
  const matchedGroups = groups.map(g => ({
    group: g.group,
    matched: g.metrics.filter(m => metrics.includes(m.id)).map(m => m.label)
  })).filter(g => g.matched.length > 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>지표</span>
        <span style={{ fontSize: '13px', fontWeight: '500', color: metrics.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
          {metrics.length > 0 ? metrics.length + '개' : '—'}
        </span>
      </div>
      {matchedGroups.length > 0 && (
        <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {matchedGroups.map(g => (
            <GroupChipRow key={g.group} label={g.group} chips={g.matched} />
          ))}
        </div>
      )}
    </div>
  )
}
