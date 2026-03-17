import { useState, useEffect } from 'react'
import { ChevronRight, ListPlus } from 'lucide-react'
import { targetingOptionsByMedia } from './types'
import { AdProductsSelector } from './AdProductsSelector'
import { MetricsDialog } from './MetricsDialog'
import { FormData } from './createDatasetTypes'
import { mediaIconMap } from '../common/MediaIcons'

interface Props {
  formData: FormData
  setFormData: (data: FormData) => void
  validationActive: boolean
  metricsDialogOpen: boolean
  setMetricsDialogOpen: (open: boolean) => void
}

export function CreateDatasetStep2({ formData, setFormData, validationActive, metricsDialogOpen, setMetricsDialogOpen }: Props) {
  const [targetingDropdownOpen, setTargetingDropdownOpen] = useState(false)
  const [targetingSearchQuery, setTargetingSearchQuery] = useState('')

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.targeting-dropdown-container')) {
        setTargetingDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const mediaList = ['Google Ads', 'Meta', 'kakao모먼트', '네이버 성과형 DA', '네이버 보장형 DA', 'TikTok']

  return (
    <div style={{ width: '800px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>상세 설정</h2>

      {/* 매체 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          매체 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
          {mediaList.map(media => (
            <button
              key={media}
              onClick={() => setFormData({ ...formData, media, products: [], metrics: [], targetingCategory: '', targetingOptions: [] })}
              className="btn btn-ghost"
              style={{
                height: '36px', padding: '0 16px', fontSize: '13px',
                whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px',
                border: `1px solid ${formData.media === media ? 'hsl(var(--primary))' : validationActive && !formData.media ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}`,
                backgroundColor: formData.media === media ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                fontWeight: formData.media === media ? '600' : '400',
                color: formData.media === media ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                transition: 'all 0.15s'
              }}
            >
              {(() => { const Icon = mediaIconMap[media]; return Icon ? <Icon size={14} /> : null })()}
              {media}
            </button>
          ))}
        </div>
        {validationActive && !formData.media && (
          <p style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>매체를 선택해주세요.</p>
        )}
      </div>

      {/* 매체 선택 전 빈 상태 */}
      {!formData.media ? (
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
          <ListPlus size={32} style={{ opacity: 0.5 }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              매체를 먼저 선택해주세요
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              세분화된 조회 조건을 설정할 수 있습니다.
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 광고 분류 조건 */}
          <div style={{ marginBottom: '24px' }}>
            <AdProductsSelector
              media={formData.media}
              value={formData.products}
              onChange={(products) => setFormData({ ...formData, products })}
              validationActive={validationActive}
            />
          </div>

          {/* 타겟팅 옵션 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>타겟팅 옵션</label>
            <div className="targeting-dropdown-container" style={{ marginBottom: formData.targetingCategory ? '12px' : '0', position: 'relative' }}>
              <input
                type="text"
                value={formData.targetingCategory || targetingSearchQuery}
                onChange={(e) => {
                  setTargetingSearchQuery(e.target.value)
                  setFormData({ ...formData, targetingCategory: '', targetingOptions: [] })
                  setTargetingDropdownOpen(true)
                }}
                onFocus={() => setTargetingDropdownOpen(true)}
                placeholder="선택 안 함"
                className="input"
                style={{ width: '100%', height: '36px', padding: '8px 12px', boxSizing: 'border-box' }}
              />
              {targetingDropdownOpen && (
                <div className="dropdown" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                  <button onClick={() => { setFormData({ ...formData, targetingCategory: '', targetingOptions: [] }); setTargetingSearchQuery(''); setTargetingDropdownOpen(false) }} className="dropdown-item">선택 안 함</button>
                  {targetingOptionsByMedia[formData.media]
                    ?.filter(t => t.category.toLowerCase().includes(targetingSearchQuery.toLowerCase()))
                    .map(t => (
                      <button key={t.category} onClick={() => { setFormData({ ...formData, targetingCategory: t.category, targetingOptions: [] }); setTargetingSearchQuery(''); setTargetingDropdownOpen(false) }} className="dropdown-item">{t.category}</button>
                    ))}
                </div>
              )}
            </div>
            {formData.targetingCategory && (() => {
              const opts = targetingOptionsByMedia[formData.media]?.find(t => t.category === formData.targetingCategory)?.options ?? []
              const allSelected = opts.every(o => formData.targetingOptions.includes(o))
              const toggle = (o: string) => setFormData({
                ...formData,
                targetingOptions: formData.targetingOptions.includes(o)
                  ? formData.targetingOptions.filter(v => v !== o)
                  : [...formData.targetingOptions, o]
              })
              return (
                <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', backgroundColor: 'hsl(var(--muted) / 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid hsl(var(--border))' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>{formData.targetingCategory}</span>
                      {formData.targetingOptions.length > 0 && (
                        <div style={{
                          fontSize: '10px', padding: '2px 6px', borderRadius: '10px',
                          backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))',
                          fontWeight: '600', textAlign: 'center', minWidth: '20px'
                        }}>
                          {formData.targetingOptions.length}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, targetingOptions: allSelected ? [] : opts })}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '11px' }}
                    >
                      {allSelected ? '전체 해제' : '전체 선택'}
                    </button>
                  </div>
                  <div style={{ maxHeight: '128px', overflowY: 'auto', padding: '4px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                      {opts.map(opt => {
                        const isSelected = formData.targetingOptions.includes(opt)
                        return (
                          <label key={opt} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px',
                            backgroundColor: isSelected ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                            transition: 'background 0.1s'
                          }}>
                            <input type="checkbox" checked={isSelected} onChange={() => toggle(opt)} className="checkbox-custom" style={{ flexShrink: 0 }} />
                            <span style={{ color: 'hsl(var(--foreground))', fontWeight: isSelected ? '500' : '400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {opt}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })()}
            {validationActive && formData.targetingCategory && formData.targetingOptions.length === 0 && (
              <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>최소 1개 이상 선택해주세요.</div>
            )}
          </div>

          {/* 지표 */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              지표 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
            </label>
            <div style={{
              width: '100%', height: '36px', padding: '8px 12px',
              border: `1px solid ${validationActive && formData.metrics.length === 0 ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}`,
              borderRadius: '6px', backgroundColor: 'hsl(var(--background))', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box'
            }} onClick={() => setMetricsDialogOpen(true)}>
              <span style={{ fontSize: '14px', color: formData.metrics.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                {formData.metrics.length > 0 ? `${formData.metrics.length}개 지표 선택됨` : '지표를 선택하세요.'}
              </span>
              <ChevronRight size={16} />
            </div>
            {validationActive && formData.metrics.length === 0 && (
              <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>지표를 선택해주세요.</div>
            )}
          </div>
        </>
      )}

      <MetricsDialog
        isOpen={metricsDialogOpen}
        onClose={() => setMetricsDialogOpen(false)}
        selectedMetrics={formData.metrics}
        onUpdate={(metrics) => setFormData({ ...formData, metrics })}
        media={formData.media}
      />
    </div>
  )
}
