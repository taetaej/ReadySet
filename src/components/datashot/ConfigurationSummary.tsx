import { metaMetrics, googleMetrics, kakaoMetrics, naverGfaMetrics, naverNospMetrics, type MetricGroup } from './types'
import { adProductStructureByMedia } from './sampleData'
import { FormData } from './createDatasetTypes'
import { getMatchedMetricGroups } from './MetricSelect'

const metricsByMedia: Record<string, MetricGroup[]> = {
  'Meta': metaMetrics,
  'Google Ads': googleMetrics,
  'kakao모먼트': kakaoMetrics,
  'NAVER 성과형 DA': naverGfaMetrics,
  'NAVER 보장형 DA': naverNospMetrics,
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
                label="지표 구성"
                value={
                  formData.purpose === 'internal' ? '종합 지표'
                    : formData.purpose === 'external' ? '성과 지표'
                    : '—'
                }
              />
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
              <SummaryItem
                label="추출 기준"
                value={
                  formData.extractMode === 'product' ? '광고상품'
                    : formData.extractMode === 'condition' ? '조건 조합'
                    : '—'
                }
              />
              <IndustryItem industries={formData.industries} industryLevel={formData.industryLevel} />
            </div>
          </div>
          <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />
          <div>
            <StepLabel label="QUERY SETTINGS" step={2} currentStep={currentStep} />
            {formData.extractMode === 'product' ? (
              <ProductQuerySettings formData={formData} />
            ) : !formData.media ? (
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

// 광고상품 기준 QUERY SETTINGS: 매체 수 · 매체별 상품 수 · 선택 지표
function ProductQuerySettings({ formData }: { formData: FormData }) {
  const mediaProducts = formData.mediaProducts
  const selectedMedias = Object.keys(mediaProducts)
  const totalProducts = selectedMedias.reduce((sum, m) => sum + (mediaProducts[m] || []).length, 0)
  const productMetrics = formData.productMetrics
  const productMetricGroups = getMatchedMetricGroups(selectedMedias, productMetrics, formData.purpose)

  if (selectedMedias.length === 0) {
    return <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', fontStyle: 'italic' }}>Pending</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <SummaryItem label="매체" value={`${selectedMedias.length}개`} />
      <div style={{ marginTop: '4px', padding: '8px 12px', backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>광고상품</span>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'hsl(var(--foreground))', whiteSpace: 'nowrap' }}>{totalProducts}개</span>
        </div>
        {selectedMedias.map((media) => {
          const count = (mediaProducts[media] || []).length
          return (
            <div key={media} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'hsl(var(--foreground))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{media}</span>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'hsl(var(--foreground))', whiteSpace: 'nowrap' }}>{count > 0 ? `${count}개` : '-'}</span>
            </div>
          )
        })}
      </div>

      {/* 상세 조건 (매체 1개일 때만, 지표와 동일 레이아웃) */}
      {selectedMedias.length === 1 && (formData.productCollaborativePartners.length > 0 || (formData.targetingCategory && formData.targetingOptions.length > 0)) && (
        <div>
          {(() => {
            const totalDetailCount = formData.productCollaborativePartners.length + formData.targetingOptions.length
            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>상세 조건</span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--foreground))' }}>
                    {totalDetailCount}개
                  </span>
                </div>
                <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {formData.productCollaborativePartners.length > 0 && (
                    <GroupChipRow label="협력 광고 파트너사" chips={formData.productCollaborativePartners} />
                  )}
                  {formData.targetingCategory && formData.targetingOptions.length > 0 && (
                    <GroupChipRow label={formData.targetingCategory} chips={formData.targetingOptions} />
                  )}
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* 지표 */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>지표</span>
          <span style={{ fontSize: '13px', fontWeight: '500', color: productMetrics.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
            {productMetrics.length > 0 ? `${productMetrics.length}개` : '—'}
          </span>
        </div>
        {productMetricGroups.length > 0 && (
          <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {productMetricGroups.map(g => (
              <GroupChipRow key={g.group} label={g.group} chips={g.matched} />
            ))}
          </div>
        )}
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
