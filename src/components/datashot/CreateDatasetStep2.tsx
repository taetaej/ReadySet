import { useState } from 'react'
import { ListPlus, Plus, Minus, Search } from 'lucide-react'
import { targetingOptionsByMedia, metaMetrics, googleMetrics, kakaoMetrics, naverGfaMetrics, naverNospMetrics, type MetricGroup } from './types'
import { AdProductsSelector } from './AdProductsSelector'
import { FormData } from './createDatasetTypes'
import { mediaIconMap } from '../common/MediaIcons'

const metricsByMedia: Record<string, MetricGroup[]> = {
  'Meta': metaMetrics,
  'Google Ads': googleMetrics,
  'kakao모먼트': kakaoMetrics,
  '네이버 성과형 DA': naverGfaMetrics,
  '네이버 보장형 DA': naverNospMetrics,
}

interface Props {
  formData: FormData
  setFormData: (data: FormData) => void
  validationActive: boolean
}

export function CreateDatasetStep2({ formData, setFormData, validationActive }: Props) {
  const [metricsSearch, setMetricsSearch] = useState('')

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
              onClick={() => {
                setFormData({ ...formData, media, products: [], metrics: [], targetingCategory: '', targetingOptions: [] })
              }}
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
            <TargetingSelector
              media={formData.media}
              category={formData.targetingCategory}
              selected={formData.targetingOptions}
              onCategoryChange={cat => setFormData({ ...formData, targetingCategory: cat, targetingOptions: [] })}
              onOptionsChange={opts => setFormData({ ...formData, targetingOptions: opts })}
              validationActive={validationActive}
            />
          </div>

          {/* 지표 */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              지표 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
            </label>
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <Search size={12} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))', pointerEvents: 'none' }} />
              <input
                type="text"
                value={metricsSearch}
                onChange={e => setMetricsSearch(e.target.value)}
                placeholder="지표 검색"
                className="input"
                style={{ width: '100%', height: '32px', fontSize: '12px', paddingLeft: '28px', boxSizing: 'border-box' }}
              />
            </div>
            <MetricGroupList
              groups={metricsByMedia[formData.media] ?? []}
              selected={formData.metrics}
              onChange={metrics => setFormData({ ...formData, metrics })}
              searchQuery={metricsSearch}
            />
            {validationActive && formData.metrics.length === 0 && (
              <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>지표를 선택해주세요.</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function MetricGroupRow({ group, selected, onChange, searchQuery }: { group: MetricGroup; selected: string[]; onChange: (next: string[]) => void; searchQuery: string }) {
  const allIds = group.metrics.map(m => m.id)
  const allSelected = allIds.every(id => selected.includes(id))
  const filtered = group.metrics.filter(m => m.label.toLowerCase().includes(searchQuery.toLowerCase()))
  const hasMatch = filtered.length > 0
  const [manualOpen, setManualOpen] = useState(true)
  const open = searchQuery ? hasMatch : manualOpen

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }

  if (searchQuery && !hasMatch) return null

  return (
    <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
      <div
        onClick={() => { if (!searchQuery) setManualOpen(o => !o) }}
        style={{
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
          cursor: searchQuery ? 'default' : 'pointer',
          backgroundColor: open ? 'hsl(var(--muted) / 0.2)' : 'transparent',
          borderBottom: open ? '1px solid hsl(var(--border))' : 'none',
          transition: 'background 0.15s'
        }}
      >
        {!searchQuery && (
          <span style={{
            width: '20px', height: '20px', borderRadius: '4px',
            border: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, color: 'hsl(var(--muted-foreground))'
          }}>
            {open ? <Minus size={12} /> : <Plus size={12} />}
          </span>
        )}
        <span style={{ fontSize: '13px', fontWeight: '500', flex: 1 }}>{group.group}</span>
        <button
          onClick={e => { e.stopPropagation(); onChange(allSelected ? selected.filter(id => !allIds.includes(id)) : [...new Set([...selected, ...allIds])]) }}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '11px' }}
        >
          {allSelected ? '전체 해제' : '전체 선택'}
        </button>
      </div>
      {open && (
        <>
          <div style={{ maxHeight: '128px', overflowY: 'auto', padding: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {filtered.map(m => {
                const isSelected = selected.includes(m.id)
                return (
                  <label key={m.id} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px',
                    backgroundColor: isSelected ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                    transition: 'background 0.1s'
                  }} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggle(m.id)} className="checkbox-custom" style={{ flexShrink: 0 }} />
                    <span style={{ color: 'hsl(var(--foreground))', fontWeight: isSelected ? '500' : '400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function MetricGroupList({ groups, selected, onChange, searchQuery }: { groups: MetricGroup[]; selected: string[]; onChange: (next: string[]) => void; searchQuery: string }) {
  if (groups.length === 0) return (
    <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', fontStyle: 'italic' }}>
      해당 매체의 지표 정보가 없습니다.
    </div>
  )
  return (
    <div>
      {groups.map((group, i) => (
        <MetricGroupRow key={`${group.group}-${i}`} group={group} selected={selected} onChange={onChange} searchQuery={searchQuery} />
      ))}
    </div>
  )
}

function TargetingSelector({ media, category, selected, onCategoryChange, onOptionsChange, validationActive }: {
  media: string
  category: string
  selected: string[]
  onCategoryChange: (cat: string) => void
  onOptionsChange: (opts: string[]) => void
  validationActive: boolean
}) {
  const [open, setOpen] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const categories = targetingOptionsByMedia[media] ?? []
  const opts = categories.find(t => t.category === category)?.options ?? []
  const allSelected = opts.length > 0 && opts.every(o => selected.includes(o))
  const toggle = (o: string) => onOptionsChange(selected.includes(o) ? selected.filter(v => v !== o) : [...selected, o])

  return (
    <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'visible' }}>
      {/* 헤더 행 */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
          cursor: 'pointer', backgroundColor: open ? 'hsl(var(--muted) / 0.2)' : 'transparent',
          borderBottom: open ? '1px solid hsl(var(--border))' : 'none',
          borderRadius: open ? '8px 8px 0 0' : '8px',
          transition: 'background 0.15s'
        }}
      >
        <span style={{
          width: '20px', height: '20px', borderRadius: '4px',
          border: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: 'hsl(var(--muted-foreground))'
        }}>
          {open ? <Minus size={12} /> : <Plus size={12} />}
        </span>
        <span style={{ fontSize: '13px', fontWeight: '500' }}>타겟팅 옵션</span>
        {/* 타입 선택 드롭다운 - 타이틀 오른쪽 */}
        <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="btn btn-ghost btn-sm"
            style={{
              fontSize: '12px', fontWeight: '400', padding: '2px 8px 2px 6px',
              color: category ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
              display: 'flex', alignItems: 'center', gap: '4px',
              border: '1px solid hsl(var(--border))', borderRadius: '4px'
            }}
          >
            {category || '선택 안 함'}
            <span style={{ fontSize: '10px', opacity: 0.5 }}>▾</span>
          </button>
          {dropdownOpen && (
            <div className="dropdown" style={{
              position: 'absolute', top: '100%', left: 0, marginTop: '4px',
              minWidth: '180px', maxHeight: '200px', overflowY: 'auto', zIndex: 1000
            }}>
              <button onClick={() => { onCategoryChange(''); setDropdownOpen(false) }} className="dropdown-item">선택 안 함</button>
              {categories.map(t => (
                <button key={t.category} onClick={() => { onCategoryChange(t.category); setDropdownOpen(false) }} className="dropdown-item">
                  {t.category}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }} />
        {category && (
          <button
            onClick={e => { e.stopPropagation(); onOptionsChange(allSelected ? [] : opts) }}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '11px', flexShrink: 0 }}
          >
            {allSelected ? '전체 해제' : '전체 선택'}
          </button>
        )}
      </div>

      {/* 펼쳐진 옵션 리스트 */}
      {open && (
        <>
          {category ? (
            <div style={{ maxHeight: '128px', overflowY: 'auto', padding: '4px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {opts.map(opt => {
                  const isSelected = selected.includes(opt)
                  return (
                    <label key={opt} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px',
                      backgroundColor: isSelected ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                      transition: 'background 0.1s'
                    }} onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggle(opt)} className="checkbox-custom" style={{ flexShrink: 0 }} />
                      <span style={{ color: 'hsl(var(--foreground))', fontWeight: isSelected ? '500' : '400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {opt}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px 14px', fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
              타겟팅 옵션을 적용하지 않습니다.
            </div>
          )}
        </>
      )}
      {validationActive && category && selected.length === 0 && (
        <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))', padding: '4px 14px 8px' }}>최소 1개 이상 선택해주세요.</div>
      )}
    </div>
  )
}
