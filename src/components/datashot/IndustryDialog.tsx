import { useState, useEffect, useRef } from 'react'
import { X, Plus, Minus, Search, Info, ChevronDown } from 'lucide-react'
import { industryCategories, brandIndustryMap } from './types'

// 업종 경로별 브랜드 수 사전 계산
function buildBrandCountMap(): { [path: string]: number } {
  const map: { [path: string]: number } = {}
  Object.values(brandIndustryMap).forEach(path => {
    const parts = path.split(' > ')
    // 소분류 경로
    map[path] = (map[path] || 0) + 1
    // 중분류 경로
    const midPath = parts.slice(0, 2).join(' > ')
    map[midPath] = (map[midPath] || 0) + 1
    // 대분류 경로
    map[parts[0]] = (map[parts[0]] || 0) + 1
  })
  return map
}
const brandCountMap = buildBrandCountMap()

interface IndustryDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedIndustries: string[]
  onUpdate: (industries: string[]) => void
}


function getItemStatus(path: string, selected: string[]): 'selected' | 'parent-selected' | 'child-selected' | 'none' {
  if (selected.includes(path)) return 'selected'
  const parts = path.split(' > ')
  if (parts.length >= 2 && selected.includes(parts.slice(0, -1).join(' > '))) return 'parent-selected'
  if (parts.length === 3 && selected.includes(parts[0])) return 'parent-selected'
  if (selected.some(s => s.startsWith(path + ' > '))) return 'child-selected'
  return 'none'
}

function getParentTooltip(path: string, selected: string[]): string {
  const parts = path.split(' > ')
  if (parts.length >= 2) {
    const parent = parts.slice(0, -1).join(' > ')
    if (selected.includes(parent)) return `'${parent}'이(가) 이미 선택되어 있습니다`
  }
  if (parts.length === 3 && selected.includes(parts[0])) return `'${parts[0]}'이(가) 이미 선택되어 있습니다`
  return ''
}

export function IndustryDialog({ isOpen, onClose, selectedIndustries, onUpdate }: IndustryDialogProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const typeDropdownRef = useRef<HTMLDivElement>(null)
  const [searchType, setSearchType] = useState<'industry' | 'brand'>('industry')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('') // 실제 검색 실행된 쿼리
  const [brandResults, setBrandResults] = useState<Array<{ brand: string; path: string }>>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedSearchQuery, setSelectedSearchQuery] = useState('')
  const [activeMajor, setActiveMajor] = useState<string | null>(null)
  const [activeMid, setActiveMid] = useState<string | null>(null)

  // 모달 열릴 때마다 검색/탐색 상태 초기화 (선택된 업종은 유지)
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false)
      setShowTypeDropdown(false)
      setSearchType('industry')
      setSearchInput('')
      setSearchQuery('')
      setBrandResults([])
      setHasSearched(false)
      setSelectedSearchQuery('')
      setActiveMajor(null)
      setActiveMid(null)
    }
  }, [isOpen])

  // 타입 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setShowTypeDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isIndustrySearchMode = !!(searchQuery && searchType === 'industry')

  const highlightText = (text: string, query: string) => {
    if (!query) return <>{text}</>
    const i = text.toLowerCase().indexOf(query.toLowerCase())
    if (i === -1) return <>{text}</>
    return <>{text.slice(0, i)}<strong style={{ fontWeight: 700, color: 'hsl(var(--primary))' }}>{text.slice(i, i + query.length)}</strong>{text.slice(i + query.length)}</>
  }

  const getFilteredMajors = () => {
    const majors = Object.keys(industryCategories).filter(m => (brandCountMap[m] || 0) > 0)
    if (!isIndustrySearchMode) return majors
    const q = searchQuery.toLowerCase()
    return majors.filter(major => {
      if (major.toLowerCase().includes(q)) return true
      return Object.entries(industryCategories[major]).some(([mid, minors]) =>
        mid.toLowerCase().includes(q) || (minors as string[]).some(m => m.toLowerCase().includes(q))
      )
    })
  }

  const getFilteredMids = (major: string) => {
    const mids = Object.keys(industryCategories[major] || {}).filter(mid => (brandCountMap[`${major} > ${mid}`] || 0) > 0)
    if (!isIndustrySearchMode) return mids
    const q = searchQuery.toLowerCase()
    return mids.filter(mid =>
      mid.toLowerCase().includes(q) || (industryCategories[major][mid] as string[]).some(m => m.toLowerCase().includes(q))
    )
  }

  const getFilteredMinors = (major: string, mid: string) => {
    const minors = (industryCategories[major]?.[mid] as string[]) || []
    const filtered = minors.filter(minor => (brandCountMap[`${major} > ${mid} > ${minor}`] || 0) > 0)
    if (!isIndustrySearchMode) return filtered
    const q = searchQuery.toLowerCase()
    return filtered.filter(m => m.toLowerCase().includes(q))
  }

  const handleAdd = (path: string) => {
    const status = getItemStatus(path, selectedIndustries)
    if (status === 'selected' || status === 'parent-selected') return
    const withoutChildren = selectedIndustries.filter(s => !s.startsWith(path + ' > '))
    onUpdate([...withoutChildren, path])
  }

  const handleRemove = (path: string) => onUpdate(selectedIndustries.filter(s => s !== path))

  // 업종 검색 실행 (엔터 or 버튼)
  const handleIndustrySearch = () => {
    setSearchQuery(searchInput)
    if (searchInput) { setActiveMajor(null); setActiveMid(null) }
  }

  // 브랜드 검색 실행
  const handleBrandSearch = () => {
    if (!searchInput.trim()) { setBrandResults([]); setHasSearched(false); return }
    setHasSearched(true)
    const results = Object.entries(brandIndustryMap)
      .filter(([brand]) => brand.toLowerCase().includes(searchInput.toLowerCase()))
      .map(([brand, path]) => ({ brand, path }))
      .slice(0, 30)
    setBrandResults(results)
  }

  const handleSearch = () => {
    if (searchType === 'industry') handleIndustrySearch()
    else handleBrandSearch()
  }

  const handleSearchTypeChange = (type: 'industry' | 'brand') => {
    setSearchType(type)
    setSearchInput('')
    setSearchQuery('')
    setBrandResults([])
    setHasSearched(false)
    setActiveMajor(null)
    setActiveMid(null)
  }

  const handleReset = () => {
    onUpdate([])
    setSearchType('industry')
    setSearchInput('')
    setSearchQuery('')
    setBrandResults([])
    setHasSearched(false)
    setSelectedSearchQuery('')
    setActiveMajor(null)
    setActiveMid(null)
  }

  const getMidItems = (): Array<{ major: string; mid: string }> => {
    if (activeMajor && !isIndustrySearchMode) return getFilteredMids(activeMajor).map(mid => ({ major: activeMajor, mid }))
    if (isIndustrySearchMode) return getFilteredMajors().flatMap(major => getFilteredMids(major).map(mid => ({ major, mid })))
    return []
  }

  const getMinorItems = (): Array<{ major: string; mid: string; minor: string }> => {
    if (activeMajor && activeMid && !isIndustrySearchMode)
      return getFilteredMinors(activeMajor, activeMid).map(minor => ({ major: activeMajor, mid: activeMid, minor }))
    if (isIndustrySearchMode)
      return getFilteredMajors().flatMap(major =>
        getFilteredMids(major).flatMap(mid =>
          getFilteredMinors(major, mid).map(minor => ({ major, mid, minor }))
        )
      )
    return []
  }

  if (!isOpen) return null

  const filteredMajors = getFilteredMajors()
  const midItems = getMidItems()
  const minorItems = getMinorItems()

  const filteredSelected = [...selectedIndustries]
    .sort((a, b) => a.localeCompare(b, 'ko'))
    .filter(i => !selectedSearchQuery || i.toLowerCase().includes(selectedSearchQuery.toLowerCase()))

  const colStyle: React.CSSProperties = {
    border: '1px solid hsl(var(--border))', borderRadius: '8px',
    display: 'flex', flexDirection: 'column', overflow: 'hidden'
  }
  const colHeaderStyle: React.CSSProperties = {
    padding: '10px 12px', borderBottom: '1px solid hsl(var(--border))',
    backgroundColor: 'hsl(var(--muted) / 0.3)',
    fontSize: '12px', fontWeight: '600', color: 'hsl(var(--muted-foreground))',
    flexShrink: 0
  }
  const emptyStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '100%', fontSize: '12px', color: 'hsl(var(--muted-foreground))',
    textAlign: 'center', padding: '16px', lineHeight: '1.6'
  }

  const renderRow = (
    path: string,
    label: string,
    hasChildren: boolean,
    isActive: boolean,
    onNavigate?: () => void,
    parentLabel?: string
  ) => {
    const status = getItemStatus(path, selectedIndustries)
    const isSelected = status === 'selected'
    const isParentSelected = status === 'parent-selected'
    const tooltip = isParentSelected ? getParentTooltip(path, selectedIndustries) : ''
    const brandCount = brandCountMap[path] || 0

    return (
      <div key={path}
        className="industry-row"
        onClick={hasChildren ? onNavigate : undefined}
        style={{
          display: 'flex', alignItems: 'center', borderRadius: '6px', marginBottom: '2px',
          backgroundColor:
            isActive ? 'hsl(var(--primary) / 0.08)' :
            isSelected ? 'hsl(var(--primary) / 0.1)' :
            isParentSelected ? 'hsl(var(--muted) / 0.5)' :
            status === 'child-selected' ? 'hsl(var(--primary) / 0.04)' : 'transparent',
          outline: isActive ? '2px solid hsl(var(--primary) / 0.4)' : 'none',
          outlineOffset: '-2px',
          opacity: isParentSelected ? 0.55 : 1,
          transition: 'background 0.12s',
          cursor: hasChildren ? 'pointer' : 'default',
        }}>

        {/* + / - 버튼 (항상 노출, 오른쪽) */}
        {/* 텍스트 영역 — 행 전체 클릭 = 탐색 */}
        <div style={{ flex: 1, padding: '8px 6px 8px 10px', minWidth: 0 }}>
          {parentLabel && (
            <div style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))', marginBottom: '1px' }}>{parentLabel}</div>
          )}
          <span style={{ fontSize: '13px', wordBreak: 'break-word', lineHeight: '1.4' }}>
            {isIndustrySearchMode ? highlightText(label, searchQuery) : label}
            {' '}
            <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', fontWeight: 400 }}>({brandCount})</span>
          </span>
        </div>

        {isSelected ? (
          <button onClick={(e) => { e.stopPropagation(); handleRemove(path) }} title="선택 해제"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 8px 8px 4px', display: 'flex', alignItems: 'center', color: 'hsl(var(--destructive))', flexShrink: 0 }}>
            <Minus size={14} />
          </button>
        ) : isParentSelected ? (
          <span title={tooltip}
            style={{ padding: '8px 8px 8px 4px', display: 'flex', alignItems: 'center', color: 'hsl(var(--muted-foreground))', flexShrink: 0, cursor: 'not-allowed', opacity: 0.3 }}>
            <Plus size={14} />
          </span>
        ) : (
          <button onClick={(e) => { e.stopPropagation(); handleAdd(path) }} title="선택"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 8px 8px 4px', display: 'flex', alignItems: 'center', color: 'hsl(var(--primary))', flexShrink: 0 }}>
            <Plus size={14} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}
        style={{ width: '1300px', height: '900px', maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

        <div className="dialog-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 className="dialog-title">업종 선택</h3>
            <div style={{ position: 'relative' }}>
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '4px', color: 'hsl(var(--muted-foreground))' }}
              >
                <Info size={15} />
              </button>
              {showTooltip && (
                <div style={{
                  position: 'absolute', top: '100%', left: '50%',
                  transform: 'translateX(-50%)', marginTop: '6px',
                  backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
                  borderRadius: '8px', padding: '12px 16px',
                  minWidth: '320px', maxWidth: '420px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', zIndex: 1000
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'hsl(var(--foreground))' }}>
                    업종 노출 기준
                  </div>
                  <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', lineHeight: '1.6' }}>
                    보유 데이터 기준으로 속한 브랜드가 1개 이상인 업종만 표시됩니다. 브랜드가 0건인 업종은 목록에 노출되지 않습니다.
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="dialog-description">업종명을 클릭하여 하위 업종을 탐색하세요. [+] 로 원하는 업종을 선택할 수 있습니다.</p>
          <button onClick={onClose} style={{ position: 'absolute', right: '24px', top: '24px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'hsl(var(--muted-foreground))' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '12px' }}>

          {/* 검색 영역 */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* 타입 드롭다운 */}
            <div style={{ position: 'relative', flexShrink: 0 }} ref={typeDropdownRef}>
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="input"
                style={{ width: '90px', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>{searchType === 'industry' ? '업종' : '브랜드'}</span>
                <ChevronDown size={14} />
              </button>
              {showTypeDropdown && (
                <div className="dropdown" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', zIndex: 1100 }}>
                  {(['industry', 'brand'] as const).map(type => (
                    <button key={type}
                      onClick={() => { handleSearchTypeChange(type); setShowTypeDropdown(false) }}
                      className="dropdown-item"
                      style={{ backgroundColor: searchType === type ? 'hsl(var(--muted))' : 'transparent' }}>
                      {type === 'industry' ? '업종' : '브랜드'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 검색 인풋 */}
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                placeholder={searchType === 'industry' ? '업종 검색' : '브랜드명 검색'}
                className="input"
                style={{ paddingLeft: '32px', width: '100%' }}
              />
              {searchInput && (
                <button onClick={() => { setSearchInput(''); setSearchQuery(''); setBrandResults([]); setHasSearched(false) }}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--muted-foreground))', padding: '2px' }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* 검색 버튼 + 초기화 */}
            <button
              onClick={handleSearch}
              disabled={!searchInput.trim()}
              className="btn btn-primary btn-md"
              style={{ flexShrink: 0, opacity: !searchInput.trim() ? 0.5 : 1, cursor: !searchInput.trim() ? 'not-allowed' : 'pointer' }}
            >
              검색
            </button>
            {(searchQuery || hasSearched) && (
              <button
                onClick={() => { setSearchInput(''); setSearchQuery(''); setBrandResults([]); setHasSearched(false); setActiveMajor(null); setActiveMid(null) }}
                className="btn btn-ghost btn-md"
                style={{ flexShrink: 0 }}
              >
                필터 초기화
              </button>
            )}
          </div>

          {/* 브랜드 검색 결과 */}
          {searchType === 'brand' && hasSearched && (
            <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden', maxHeight: '200px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <div style={{ ...colHeaderStyle, display: 'flex', justifyContent: 'space-between' }}>
                <span>검색 결과 ({brandResults.length}건)</span>
              </div>
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {brandResults.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>검색 결과가 없습니다</div>
                ) : brandResults.map(({ brand, path }) => {
                  const alreadyAdded = selectedIndustries.includes(path)
                  return (
                    <div key={brand}
                      onClick={() => { if (!alreadyAdded) onUpdate([...selectedIndustries, path]) }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid hsl(var(--border) / 0.5)', cursor: alreadyAdded ? 'default' : 'pointer', opacity: alreadyAdded ? 0.5 : 1, transition: 'background 0.12s' }}
                      onMouseEnter={(e) => { if (!alreadyAdded) e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.3)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: '600', marginRight: '8px' }}>
                          {highlightText(brand, searchInput)}
                        </span>
                        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>{path}</span>
                      </div>
                      {alreadyAdded
                        ? <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>추가됨</span>
                        : <Plus size={14} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                      }
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 3단 + 선택 패널 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.4fr', gap: '12px', flex: 1, overflow: 'hidden' }}>

            {/* 업종(대) */}
            <div style={colStyle}>
              <div style={colHeaderStyle}>업종(대)</div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                {filteredMajors.length === 0
                  ? <div style={emptyStyle}>검색 결과가 없습니다</div>
                  : filteredMajors.map(major => renderRow(
                    major, major, true,
                    activeMajor === major && !isIndustrySearchMode,
                    () => { if (!isIndustrySearchMode) { setActiveMajor(activeMajor === major ? null : major); setActiveMid(null) } }
                  ))
                }
              </div>
            </div>

            {/* 업종(중) */}
            <div style={{ ...colStyle, opacity: !activeMajor && !isIndustrySearchMode ? 0.45 : 1 }}>
              <div style={colHeaderStyle}>업종(중)</div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                {!activeMajor && !isIndustrySearchMode
                  ? <div style={emptyStyle}>업종(대)의 [›]를<br />클릭하면 표시됩니다</div>
                  : midItems.length === 0
                    ? <div style={emptyStyle}>검색 결과가 없습니다</div>
                    : midItems.map(({ major, mid }) => renderRow(
                      `${major} > ${mid}`, mid, true,
                      activeMid === mid && activeMajor === major && !isIndustrySearchMode,
                      () => { if (!isIndustrySearchMode) { setActiveMajor(major); setActiveMid(activeMid === mid ? null : mid) } },
                      isIndustrySearchMode ? `${major} >` : undefined
                    ))
                }
              </div>
            </div>

            {/* 업종(소) */}
            <div style={{ ...colStyle, opacity: !activeMid && !isIndustrySearchMode ? 0.45 : 1 }}>
              <div style={colHeaderStyle}>업종(소)</div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                {!activeMid && !isIndustrySearchMode
                  ? <div style={emptyStyle}>업종(중)의 [›]를<br />클릭하면 표시됩니다</div>
                  : minorItems.length === 0
                    ? <div style={emptyStyle}>검색 결과가 없습니다</div>
                    : minorItems.map(({ major, mid, minor }) => renderRow(
                      `${major} > ${mid} > ${minor}`, minor, false,
                      false, undefined,
                      isIndustrySearchMode ? `${major} > ${mid} >` : undefined
                    ))
                }
              </div>
            </div>

            {/* 선택된 업종 */}
            <div style={colStyle}>
              <div style={{ ...colHeaderStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>선택된 업종</span>
              </div>
              <div style={{ padding: '8px', borderBottom: '1px solid hsl(var(--border))', flexShrink: 0 }}>
                <div style={{ position: 'relative' }}>
                  <Search size={12} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                  <input type="text" value={selectedSearchQuery}
                    onChange={(e) => setSelectedSearchQuery(e.target.value)}
                    placeholder="선택된 업종 검색..."
                    style={{ width: '100%', padding: '5px 8px 5px 26px', fontSize: '12px', border: '1px solid hsl(var(--border))', borderRadius: '4px', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                {selectedIndustries.length === 0 ? (
                  <div style={emptyStyle}>선택된 업종이 없습니다<br /><span style={{ fontSize: '11px' }}>좌측에서 [+]로 추가하세요</span></div>
                ) : filteredSelected.length === 0 ? (
                  <div style={emptyStyle}>검색 결과가 없습니다</div>
                ) : filteredSelected.map(industry => {
                  return (
                    <div key={industry} style={{ display: 'flex', alignItems: 'flex-start', padding: '7px 10px', marginBottom: '3px', backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '12px', gap: '6px' }}>
                      <span style={{ flex: 1, wordBreak: 'break-word', lineHeight: '1.5' }}>
                        {selectedSearchQuery ? highlightText(industry, selectedSearchQuery) : industry}
                      </span>
                      <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', flexShrink: 0, alignSelf: 'center' }}>
                        ({brandCountMap[industry] || 0})
                      </span>
                      <button onClick={() => handleRemove(industry)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', display: 'flex', alignItems: 'center', color: 'hsl(var(--muted-foreground))', flexShrink: 0 }}>
                        <X size={13} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="dialog-footer">
          <button onClick={handleReset} className="btn btn-ghost btn-md" style={{ marginRight: 'auto' }}>초기화</button>
          <button onClick={onClose} className="btn btn-secondary btn-md">취소</button>
          <button onClick={onClose} className="btn btn-primary btn-md">선택 완료 ({selectedIndustries.length}건)</button>
        </div>
      </div>
    </div>
  )
}
