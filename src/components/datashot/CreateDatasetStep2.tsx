import { useState } from 'react'
import { ListPlus, Plus, Minus, Search, ChevronDown, Info, X } from 'lucide-react'
import { targetingOptionsByMedia, metaMetrics, googleMetrics, kakaoMetrics, naverGfaMetrics, naverNospMetrics, tiktokMetrics, naverNospKeywords, type MetricGroup } from './types'
import { AdProductsSelector } from './AdProductsSelector'
import { FormData } from './createDatasetTypes'
import { mediaIconMap } from '../common/MediaIcons'

const metricsByMedia: Record<string, MetricGroup[]> = {
  'Meta': metaMetrics,
  'Google Ads': googleMetrics,
  'kakao모먼트': kakaoMetrics,
  '네이버 성과형 DA': naverGfaMetrics,
  '네이버 보장형 DA': naverNospMetrics,
  'TikTok': tiktokMetrics,
}

interface Props {
  formData: FormData
  setFormData: (data: FormData) => void
  validationActive: boolean
}

export function CreateDatasetStep2({ formData, setFormData, validationActive }: Props) {
  const [metricsSearch, setMetricsSearch] = useState('')
  const [showAdFormatAlert, setShowAdFormatAlert] = useState(false)
  const [pendingCat, setPendingCat] = useState<string>('')

  const mediaList = ['Google Ads', 'Meta', 'kakao모먼트', '네이버 성과형 DA', '네이버 보장형 DA', 'TikTok']

  return (
    <>
    {/* 소재유형 비활성화 얼럿 */}
    {showAdFormatAlert && (
      <div className="dialog-overlay">
        <div className="dialog-content">
          <div className="dialog-header">
            <h3 className="dialog-title">소재 유형 사용 불가</h3>
            <p className="dialog-description">
              선택한 타겟팅 옵션에서는 소재 유형 설정이 불가합니다.<br />
              소재 유형 기존 선택 값은 초기화됩니다.<br />
              계속 진행하시겠습니까?
            </p>
          </div>
          <div className="dialog-footer">
            <button
              onClick={() => { setShowAdFormatAlert(false); setPendingCat('') }}
              className="btn btn-secondary btn-sm"
            >
              취소
            </button>
            <button
              onClick={() => {
                try {
                  const sel = JSON.parse(formData.products[0] || '{}')
                  delete sel['adFormat']
                  const products = Object.keys(sel).length > 0 ? [JSON.stringify(sel)] : []
                  setFormData({ ...formData, targetingCategory: pendingCat, targetingOptions: [], products })
                } catch {
                  setFormData({ ...formData, targetingCategory: pendingCat, targetingOptions: [] })
                }
                setShowAdFormatAlert(false)
                setPendingCat('')
              }}
              className="btn btn-primary btn-sm"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    )}
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
            {(() => {
              // kakao모먼트에서 기기유형 외 타겟팅 선택 시 소재 유형 비활성화
              const isKakao = formData.media === 'kakao모먼트'
              const kakaoTargetingDisablesAdFormat = isKakao && !!formData.targetingCategory && formData.targetingCategory !== '기기유형'
              return (
                <AdProductsSelector
                  media={formData.media}
                  value={formData.products}
                  onChange={(products) => setFormData({ ...formData, products })}
                  validationActive={validationActive}
                  disabledFields={kakaoTargetingDisablesAdFormat ? ['adFormat'] : []}
                />
              )
            })()}
          </div>

          {/* 타겟팅 옵션 */}
          <div style={{ marginBottom: '24px' }}>
            <TargetingSelector
              media={formData.media}
              category={formData.targetingCategory}
              selected={formData.targetingOptions}
              onCategoryChange={cat => {
                if (formData.media === 'kakao모먼트' && cat !== '' && cat !== '기기유형') {
                  // 소재 유형 선택값이 있을 때만 얼럿 표시 후 대기
                  try {
                    const sel = JSON.parse(formData.products[0] || '{}')
                    if (sel['adFormat']) {
                      setPendingCat(cat)
                      setShowAdFormatAlert(true)
                      return
                    }
                  } catch { /* noop */ }
                  // 소재 유형 없으면 바로 적용
                  setFormData({ ...formData, targetingCategory: cat, targetingOptions: [] })
                } else {
                  setFormData({ ...formData, targetingCategory: cat, targetingOptions: [] })
                }
              }}
              onOptionsChange={opts => setFormData({ ...formData, targetingOptions: opts })}
              validationActive={validationActive}
            />
          </div>

          {/* 지표 */}
          <div>
            <hr style={{ border: 'none', borderTop: '1px solid hsl(var(--border))', margin: '8px 0 24px' }} />
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
                style={{ width: '100%', height: '32px', fontSize: '12px', paddingLeft: '28px', paddingRight: metricsSearch ? '28px' : '8px', boxSizing: 'border-box' }}
              />
              {metricsSearch && (
                <button onClick={() => setMetricsSearch('')}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--muted-foreground))', padding: '2px', display: 'flex', alignItems: 'center' }}>
                  <X size={12} />
                </button>
              )}
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
    </>
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
        {open && (
          <button
            onClick={e => { e.stopPropagation(); onChange(allSelected ? selected.filter(id => !allIds.includes(id)) : [...new Set([...selected, ...allIds])]) }}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '11px' }}
          >
            {allSelected ? '전체 해제' : '전체 선택'}
          </button>
        )}
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
  const [search, setSearch] = useState('')
  const [showInfoTooltip, setShowInfoTooltip] = useState(false)
  const [keywordSearch, setKeywordSearch] = useState('')
  const [keywordResults, setKeywordResults] = useState<string[]>([])
  const [hasSearchedKeyword, setHasSearchedKeyword] = useState(false)
  const categories = targetingOptionsByMedia[media] ?? []
  const isKeywordMode = category === '키워드' && media === '네이버 보장형 DA'
  const opts = categories.find(t => t.category === category)?.options ?? []
  const filtered = opts.filter(o => o.toLowerCase().includes(search.toLowerCase()))
  const allSelected = opts.length > 0 && opts.every(o => selected.includes(o))
  const toggle = (o: string) => onOptionsChange(selected.includes(o) ? selected.filter(v => v !== o) : [...selected, o])

  const handleKeywordSearch = () => {
    if (!keywordSearch.trim()) { setKeywordResults([]); setHasSearchedKeyword(false); return }
    setHasSearchedKeyword(true)
    const q = keywordSearch.toLowerCase()
    const results = naverNospKeywords.filter(k => k.toLowerCase().includes(q)).slice(0, 50)
    setKeywordResults(results)
  }

  return (
    <>
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
        <span style={{ fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          타겟팅 옵션
          {media === 'kakao모먼트' && (
            <div
              style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
              onClick={e => e.stopPropagation()}
              onMouseEnter={() => setShowInfoTooltip(true)}
              onMouseLeave={() => setShowInfoTooltip(false)}
            >
              <Info size={13} style={{ color: 'hsl(var(--muted-foreground))', cursor: 'default' }} />
              {showInfoTooltip && (
                <div style={{
                  position: 'absolute', top: '100%', left: '0',
                  marginTop: '6px', zIndex: 1100,
                  backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
                  borderRadius: '8px', padding: '10px 14px',
                  width: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  pointerEvents: 'none'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'hsl(var(--foreground))' }}>
                    소재 유형 조회 제한 안내
                  </div>
                  <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', lineHeight: '1.7' }}>
                    타겟팅 옵션 '선택 안 함' 또는 '기기유형' 선택 시에만, 소재 유형 기준 데이터 조회가 가능합니다.
                  </div>
                </div>
              )}
            </div>
          )}
        </span>
        {open && category && (
          <>
            <div style={{ position: 'relative', width: isKeywordMode ? '180px' : '140px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
              <Search size={11} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))', pointerEvents: 'none' }} />
              <input type="text"
                value={isKeywordMode ? keywordSearch : search}
                onChange={e => {
                  if (isKeywordMode) {
                    setKeywordSearch(e.target.value)
                    if (!e.target.value) { setKeywordResults([]); setHasSearchedKeyword(false) }
                  } else {
                    setSearch(e.target.value)
                  }
                }}
                onKeyDown={e => { if (isKeywordMode && e.key === 'Enter') handleKeywordSearch() }}
                placeholder={isKeywordMode ? '키워드 검색 (Enter)' : '검색'}
                className="input"
                style={{ width: '100%', height: '26px', fontSize: '11px', paddingLeft: '24px', paddingRight: (isKeywordMode ? keywordSearch : search) ? '24px' : '8px' }} />
              {(isKeywordMode ? keywordSearch : search) && (
                <button onClick={() => { if (isKeywordMode) { setKeywordSearch(''); setKeywordResults([]); setHasSearchedKeyword(false) } else { setSearch('') } }}
                  style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--muted-foreground))', padding: '2px', display: 'flex', alignItems: 'center' }}>
                  <X size={11} />
                </button>
              )}
            </div>
            {!isKeywordMode && (
              <button
                onClick={e => { e.stopPropagation(); onOptionsChange(allSelected ? [] : opts) }}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px', flexShrink: 0 }}
              >
                {allSelected ? '전체 해제' : '전체 선택'}
              </button>
            )}
            {isKeywordMode && (
              <>
                {selected.length > 0 && (
                  <span onClick={e => e.stopPropagation()} style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                    {selected.length}개 선택
                  </span>
                )}
                {hasSearchedKeyword && keywordResults.length > 0 && (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      const allResultsSelected = keywordResults.every(k => selected.includes(k))
                      if (allResultsSelected) {
                        onOptionsChange(selected.filter(s => !keywordResults.includes(s)))
                      } else {
                        onOptionsChange([...new Set([...selected, ...keywordResults])])
                      }
                    }}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '11px', flexShrink: 0 }}
                  >
                    {keywordResults.every(k => selected.includes(k)) ? '전체 해제' : '전체 선택'}
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* 펼쳐진 옵션 리스트 */}
      {open && (
        <>
          {/* 타입 선택 드롭다운 */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid hsl(var(--border) / 0.5)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="input"
              style={{
                width: '100%', textAlign: 'left', cursor: 'pointer', height: '32px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: '12px', padding: '0 10px', boxSizing: 'border-box'
              }}
            >
              <span style={{ color: category ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                {category || '선택 안 함'}
              </span>
              <ChevronDown size={14} />
            </button>
            {dropdownOpen && (
              <div className="dropdown" style={{
                position: 'absolute', top: '100%', left: '10px', right: '10px', marginTop: '2px',
                maxHeight: '200px', overflowY: 'auto', zIndex: 1000
              }}>
                <button onClick={() => { onCategoryChange(''); setDropdownOpen(false); setKeywordSearch(''); setKeywordResults([]); setHasSearchedKeyword(false) }} className="dropdown-item"
                  style={{ backgroundColor: !category ? 'hsl(var(--muted))' : 'transparent' }}>
                  선택 안 함
                </button>
                {categories.map(t => (
                  <button key={t.category} onClick={() => { onCategoryChange(t.category); setDropdownOpen(false); setSearch(''); setKeywordSearch(''); setKeywordResults([]); setHasSearchedKeyword(false) }} className="dropdown-item"
                    style={{ backgroundColor: category === t.category ? 'hsl(var(--muted))' : 'transparent' }}>
                    {t.category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 키워드 검색 모드 */}
          {isKeywordMode && (
            <div onClick={e => e.stopPropagation()}>
              {/* 검색 결과 or 안내 */}
              {!hasSearchedKeyword ? (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                  키워드를 검색해주세요
                </div>
              ) : keywordResults.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                  검색 결과가 없습니다
                </div>
              ) : (
                <div style={{ maxHeight: '160px', overflowY: 'auto', padding: '4px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    {keywordResults.map(kw => {
                      const isSelected = selected.includes(kw)
                      return (
                        <label key={kw} style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px',
                          backgroundColor: isSelected ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                          transition: 'background 0.1s'
                        }}>
                          <input type="checkbox" checked={isSelected} onChange={() => toggle(kw)} className="checkbox-custom" style={{ flexShrink: 0 }} />
                          <span style={{ color: 'hsl(var(--foreground))', fontWeight: isSelected ? '500' : '400' }}>{kw}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 일반 체크박스 모드 */}
          {category && !isKeywordMode && (
            <div style={{ maxHeight: '128px', overflowY: 'auto', padding: '4px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  {filtered.map(opt => {
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
          )}
        </>
      )}
    </div>
    {validationActive && category && selected.length === 0 && (
      <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>최소 1개 이상 선택해주세요.</div>
    )}
    </>
  )
}