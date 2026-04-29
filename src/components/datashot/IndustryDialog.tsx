import { useState, useEffect, useRef } from 'react'
import { X, Plus, Minus, Search, Info, ChevronDown, Layers } from 'lucide-react'
import { industryCategories, brandIndustryMap } from './types'

type IndustryLevel = 'major' | 'mid' | 'minor'

function buildBrandCountMap(): { [path: string]: number } {
  const map: { [path: string]: number } = {}
  Object.values(brandIndustryMap).forEach(path => {
    const parts = path.split(' > ')
    map[path] = (map[path] || 0) + 1
    const midPath = parts.slice(0, 2).join(' > ')
    map[midPath] = (map[midPath] || 0) + 1
    map[parts[0]] = (map[parts[0]] || 0) + 1
  })
  return map
}
const brandCountMap = buildBrandCountMap()

function buildChildCountMap(): { [path: string]: number } {
  const map: { [path: string]: number } = {}
  Object.keys(industryCategories).forEach(major => {
    const mids = Object.keys(industryCategories[major])
    const validMids = mids.filter(mid => (brandCountMap[`${major} > ${mid}`] || 0) > 0)
    map[major] = validMids.length
    validMids.forEach(mid => {
      const minors = (industryCategories[major][mid] as string[]).filter(
        minor => (brandCountMap[`${major} > ${mid} > ${minor}`] || 0) > 0
      )
      map[`${major} > ${mid}`] = minors.length
    })
  })
  return map
}
const childCountMap = buildChildCountMap()

interface IndustryDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedIndustries: string[]
  onUpdate: (industries: string[], level: IndustryLevel) => void
  industryLevel: IndustryLevel | null
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

export function IndustryDialog({ isOpen, onClose, selectedIndustries, onUpdate, industryLevel }: IndustryDialogProps) {
  const [showLevelChangeAlert, setShowLevelChangeAlert] = useState(false)
  const [pendingLevel, setPendingLevel] = useState<IndustryLevel | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const typeDropdownRef = useRef<HTMLDivElement>(null)
  const [localLevel, setLocalLevel] = useState<IndustryLevel | null>(industryLevel)
  const [searchType, setSearchType] = useState<'industry' | 'brand'>('industry')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [brandResults, setBrandResults] = useState<Array<{ brand: string; path: string }>>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [activeMajor, setActiveMajor] = useState<string | null>(null)
  const [activeMid, setActiveMid] = useState<string | null>(null)
  const initialIndustriesRef = useRef<string[]>(selectedIndustries)
  const initialLevelRef = useRef<IndustryLevel | null>(industryLevel)

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false)
      setShowTypeDropdown(false)
      setSearchType('industry')
      setSearchInput('')
      setSearchQuery('')
      setBrandResults([])
      setHasSearched(false)
      setActiveMajor(null)
      setActiveMid(null)
      setLocalLevel(industryLevel)
      initialIndustriesRef.current = selectedIndustries
      initialLevelRef.current = industryLevel
    }
  }, [isOpen])

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

  const getFilteredMajors = (): Array<{ major: string; isMatch: boolean }> => {
    const majors = Object.keys(industryCategories).filter(m => (brandCountMap[m] || 0) > 0)
    if (!isIndustrySearchMode) return majors.map(major => ({ major, isMatch: true }))
    const q = searchQuery.toLowerCase()
    const result: Array<{ major: string; isMatch: boolean }> = []
    majors.forEach(major => {
      const directMatch = major.toLowerCase().includes(q)
      if (localLevel === 'major') {
        if (directMatch) result.push({ major, isMatch: true })
      } else if (localLevel === 'mid') {
        const hasChildMatch = Object.keys(industryCategories[major]).some(mid => mid.toLowerCase().includes(q))
        if (directMatch || hasChildMatch) result.push({ major, isMatch: directMatch })
      } else {
        const hasChildMatch = Object.entries(industryCategories[major]).some(([mid, minors]) =>
          mid.toLowerCase().includes(q) || (minors as string[]).some(m => m.toLowerCase().includes(q))
        )
        if (directMatch || hasChildMatch) result.push({ major, isMatch: directMatch })
      }
    })
    return result
  }

  const getAllMajors = () => Object.keys(industryCategories).filter(m => (brandCountMap[m] || 0) > 0)

  const getFilteredMids = (major: string): Array<{ mid: string; isMatch: boolean }> => {
    const mids = Object.keys(industryCategories[major] || {}).filter(mid => (brandCountMap[`${major} > ${mid}`] || 0) > 0)
    if (!isIndustrySearchMode) return mids.map(mid => ({ mid, isMatch: true }))
    const q = searchQuery.toLowerCase()
    const result: Array<{ mid: string; isMatch: boolean }> = []
    mids.forEach(mid => {
      const directMatch = mid.toLowerCase().includes(q)
      if (localLevel === 'mid') {
        if (directMatch) result.push({ mid, isMatch: true })
      } else {
        const hasChildMatch = (industryCategories[major][mid] as string[]).some(m => m.toLowerCase().includes(q))
        if (directMatch || hasChildMatch) result.push({ mid, isMatch: directMatch })
      }
    })
    return result
  }

  const getFilteredMinors = (major: string, mid: string) => {
    const minors = (industryCategories[major]?.[mid] as string[]) || []
    const filtered = minors.filter(minor => (brandCountMap[`${major} > ${mid} > ${minor}`] || 0) > 0)
    if (!isIndustrySearchMode) return filtered
    const q = searchQuery.toLowerCase()
    return filtered.filter(m => m.toLowerCase().includes(q))
  }

  const trimPathToLevel = (path: string): string => {
    const parts = path.split(' > ')
    if (localLevel === 'major') return parts[0]
    if (localLevel === 'mid') return parts.slice(0, 2).join(' > ')
    return path
  }

  const handleAdd = (path: string) => {
    const trimmed = trimPathToLevel(path)
    const status = getItemStatus(trimmed, selectedIndustries)
    if (status === 'selected' || status === 'parent-selected') return
    const withoutChildren = selectedIndustries.filter(s => !s.startsWith(trimmed + ' > '))
    onUpdate([...withoutChildren, trimmed], localLevel!)
  }

  const handleRemove = (path: string) => onUpdate(selectedIndustries.filter(s => s !== path), localLevel!)

  const handleIndustrySearch = () => {
    setSearchQuery(searchInput)
    if (searchInput) { setActiveMajor(null); setActiveMid(null) }
  }

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
    onUpdate([], localLevel!)
    setSearchType('industry')
    setSearchInput('')
    setSearchQuery('')
    setBrandResults([])
    setHasSearched(false)
    setActiveMajor(null)
    setActiveMid(null)
  }

  const handleCancel = () => {
    onUpdate(initialIndustriesRef.current, initialLevelRef.current!)
    onClose()
  }

  const getMidItems = (): Array<{ major: string; mid: string; isMatch: boolean }> => {
    if (activeMajor && !isIndustrySearchMode) return getFilteredMids(activeMajor).map(({ mid }) => ({ major: activeMajor, mid, isMatch: true }))
    if (isIndustrySearchMode) return getAllMajors().flatMap(major => getFilteredMids(major).map(({ mid, isMatch }) => ({ major, mid, isMatch })))
    return []
  }

  const getMinorItems = (): Array<{ major: string; mid: string; minor: string }> => {
    if (activeMajor && activeMid && !isIndustrySearchMode)
      return getFilteredMinors(activeMajor, activeMid).map(minor => ({ major: activeMajor, mid: activeMid, minor }))
    if (isIndustrySearchMode)
      return getAllMajors().flatMap(major =>
        getFilteredMids(major).flatMap(({ mid }) =>
          getFilteredMinors(major, mid).map(minor => ({ major, mid, minor }))
        )
      )
    return []
  }

  if (!isOpen) return null

  const filteredMajorItems = getFilteredMajors()
  const filteredMajors = filteredMajorItems.map(({ major }) => major)
  const midItems = getMidItems()
  const minorItems = getMinorItems()
  const filteredSelected = [...selectedIndustries].sort((a, b) => a.localeCompare(b, 'ko'))

  const handleSelectAll = (paths: string[]) => {
    const toAdd = paths.filter(p => {
      const s = getItemStatus(p, selectedIndustries)
      return s !== 'selected' && s !== 'parent-selected'
    })
    if (toAdd.length === 0) return
    let next = [...selectedIndustries]
    toAdd.forEach(p => {
      next = next.filter(s => !s.startsWith(p + ' > '))
      next.push(p)
    })
    onUpdate(next, localLevel!)
  }

  const handleDeselectAll = (paths: string[]) => {
    onUpdate(selectedIndustries.filter(s => !paths.includes(s)), localLevel!)
  }

  const isAllSelected = (paths: string[]) =>
    paths.length > 0 && paths.every(p => getItemStatus(p, selectedIndustries) === 'selected')

  const SelectAllButton = ({ paths }: { paths: string[] }) => {
    if (!localLevel || paths.length === 0) return null
    const allSel = isAllSelected(paths)
    return (
      <button
        onClick={(e) => { e.stopPropagation(); allSel ? handleDeselectAll(paths) : handleSelectAll(paths) }}
        className="btn btn-ghost btn-sm"
        style={{ fontSize: '11px' }}
      >
        {allSel ? '전체 해제' : '전체 선택'}
      </button>
    )
  }

  const colStyle: React.CSSProperties = {
    border: '1px solid hsl(var(--border))', borderRadius: '8px',
    display: 'flex', flexDirection: 'column', overflow: 'hidden'
  }
  const colHeaderStyle: React.CSSProperties = {
    padding: '0 12px', borderBottom: '1px solid hsl(var(--border))',
    backgroundColor: 'hsl(var(--muted) / 0.3)',
    fontSize: '12px', fontWeight: '600', color: 'hsl(var(--muted-foreground))',
    flexShrink: 0,
    height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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
    parentLabel?: string,
    isDimmed?: boolean,
    columnLevel?: IndustryLevel
  ) => {
    const status = getItemStatus(path, selectedIndustries)
    const isSelected = status === 'selected'
    const isParentSelected = status === 'parent-selected'
    const tooltip = isParentSelected ? getParentTooltip(path, selectedIndustries) : ''
    const childCount = childCountMap[path]
    const showActions = !columnLevel || columnLevel === localLevel

    const handleRowClick = () => {
      if (isParentSelected) return
      if (showActions) { isSelected ? handleRemove(path) : handleAdd(path) }
      if (hasChildren && onNavigate) onNavigate()
    }

    return (
      <div key={path}
        className="industry-row"
        onClick={handleRowClick}
        style={{
          display: 'flex', alignItems: 'center', borderRadius: '6px', marginBottom: '2px',
          backgroundColor:
            isActive ? 'hsl(var(--primary) / 0.08)' :
            isSelected ? 'hsl(var(--primary) / 0.1)' :
            isParentSelected ? 'hsl(var(--muted) / 0.5)' :
            status === 'child-selected' ? 'hsl(var(--primary) / 0.04)' : 'transparent',
          outline: isActive ? '2px solid hsl(var(--primary) / 0.4)' : 'none',
          outlineOffset: '-2px',
          opacity: isParentSelected ? 0.55 : isDimmed ? 0.4 : 1,
          transition: 'background 0.12s',
          cursor: isParentSelected ? 'not-allowed' : 'pointer',
        }}>
        <div style={{ flex: 1, padding: '8px 6px 8px 10px', minWidth: 0 }}>
          {parentLabel && (
            <div style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))', marginBottom: '1px' }}>{parentLabel}</div>
          )}
          <span style={{ fontSize: '13px', wordBreak: 'break-word', lineHeight: '1.4' }}>
            {isIndustrySearchMode ? highlightText(label, searchQuery) : label}
            {childCount !== undefined && (
              <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', fontWeight: 400 }}> ({childCount})</span>
            )}
          </span>
        </div>
        {showActions && (
          isSelected ? (
            <span style={{ padding: '8px 8px 8px 4px', display: 'flex', alignItems: 'center', color: 'hsl(var(--destructive))', flexShrink: 0, pointerEvents: 'none' }}>
              <Minus size={14} />
            </span>
          ) : isParentSelected ? (
            <span title={tooltip}
              style={{ padding: '8px 8px 8px 4px', display: 'flex', alignItems: 'center', color: 'hsl(var(--muted-foreground))', flexShrink: 0, opacity: 0.3, pointerEvents: 'none' }}>
              <Plus size={14} />
            </span>
          ) : (
            <span style={{ padding: '8px 8px 8px 4px', display: 'flex', alignItems: 'center', color: 'hsl(var(--primary))', flexShrink: 0, pointerEvents: 'none' }}>
              <Plus size={14} />
            </span>
          )
        )}
      </div>
    )
  }

  return (
    <div className="dialog-overlay" onClick={handleCancel}>
      {showLevelChangeAlert && (
        <div className="dialog-overlay" onClick={e => e.stopPropagation()} style={{ zIndex: 1200 }}>
          <div className="dialog-content" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">선택한 업종 초기화</h3>
              <p className="dialog-description">
                분류 레벨을 변경하면 선택한 업종이 초기화됩니다.<br />
                계속 진행하시겠습니까?
              </p>
            </div>
            <div className="dialog-footer">
              <button onClick={() => { setShowLevelChangeAlert(false); setPendingLevel(null) }} className="btn btn-secondary btn-sm">취소</button>
              <button
                onClick={() => {
                  if (pendingLevel) {
                    setLocalLevel(pendingLevel)
                    onUpdate([], pendingLevel)
                    setActiveMajor(null)
                    setActiveMid(null)
                    setSearchInput('')
                    setSearchQuery('')
                    setBrandResults([])
                    setHasSearched(false)
                  }
                  setShowLevelChangeAlert(false)
                  setPendingLevel(null)
                }}
                className="btn btn-primary btn-sm"
              >확인</button>
            </div>
          </div>
        </div>
      )}

      <div className="dialog-content dialog-xl" onClick={(e) => e.stopPropagation()}
        style={{ height: '90vh', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

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
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'hsl(var(--foreground))' }}>업종 노출 기준</div>
                  <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', lineHeight: '1.6' }}>
                    보유 데이터 기준으로 속한 브랜드가 1개 이상인 업종만 표시됩니다. 브랜드가 0건인 업종은 목록에 노출되지 않습니다.
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="dialog-description">업종 분류 레벨을 먼저 선택해주세요. 레벨 변경 시 선택한 업종이 초기화됩니다.</p>
          <button onClick={handleCancel} style={{ position: 'absolute', right: '24px', top: '24px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'hsl(var(--muted-foreground))' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{
          padding: '14px 24px',
          backgroundColor: 'hsl(var(--muted) / 0.4)',
          borderBottom: '1px solid hsl(var(--border))',
          display: 'flex', alignItems: 'center', gap: '12px',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--foreground))', flexShrink: 0 }}>분류 레벨</span>
          <div style={{ display: 'inline-flex', border: '1px solid hsl(var(--border))', borderRadius: '6px', overflow: 'hidden' }}>
            {([
              { value: 'major' as IndustryLevel, label: '대분류' },
              { value: 'mid'   as IndustryLevel, label: '중분류' },
              { value: 'minor' as IndustryLevel, label: '소분류' },
            ]).map(({ value, label }, i, arr) => {
              const isActive = localLevel === value
              return (
                <button key={value}
                  onClick={() => {
                    if (localLevel !== value) {
                      if (selectedIndustries.length > 0) {
                        setPendingLevel(value)
                        setShowLevelChangeAlert(true)
                      } else {
                        setLocalLevel(value)
                        onUpdate([], value)
                        setActiveMajor(null)
                        setActiveMid(null)
                        setSearchInput('')
                        setSearchQuery('')
                        setBrandResults([])
                        setHasSearched(false)
                      }
                    }
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{
                    borderRadius: 0, border: 'none',
                    borderRight: i < arr.length - 1 ? '1px solid hsl(var(--border))' : 'none',
                    backgroundColor: isActive ? 'hsl(var(--muted))' : 'transparent',
                    color: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                    padding: '6px 16px', fontSize: '13px',
                    fontWeight: isActive ? '500' : '400', cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '12px' }}>

          {!localLevel ? (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '1px dashed hsl(var(--border))', borderRadius: '8px',
              backgroundColor: 'hsl(var(--muted) / 0.15)',
              gap: '10px',
            }}>
              <Layers size={32} style={{ color: 'hsl(var(--muted-foreground))', opacity: 0.4 }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'hsl(var(--muted-foreground))' }}>분류 레벨을 먼저 선택해주세요.</div>
                <div style={{ fontSize: '13px', fontWeight: '400', color: 'hsl(var(--muted-foreground))', marginTop: '6px' }}>원하는 레벨까지의 업종을 설정할 수 있습니다.</div>
              </div>
            </div>
          ) : (<>

          <div style={{ display: 'flex', gap: '8px' }}>
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
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value)
                  if (!e.target.value) { setSearchQuery(''); setBrandResults([]); setHasSearched(false) }
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                placeholder={searchType === 'industry' ? '업종 검색' : '브랜드명으로 업종 검색'}
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
            <button
              onClick={handleSearch}
              disabled={!searchInput.trim()}
              className="btn btn-primary btn-md"
              style={{ flexShrink: 0, opacity: !searchInput.trim() ? 0.5 : 1, cursor: !searchInput.trim() ? 'not-allowed' : 'pointer' }}
            >검색</button>
          </div>

          {searchType === 'brand' && hasSearched && (
            <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden', maxHeight: '200px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <div style={{ ...colHeaderStyle, display: 'flex', justifyContent: 'space-between' }}>
                <span>검색 결과 ({brandResults.length}건)</span>
              </div>
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {brandResults.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>검색 결과가 없습니다</div>
                ) : brandResults.map(({ brand, path }) => {
                  const trimmed = trimPathToLevel(path)
                  const alreadyAdded = selectedIndustries.includes(trimmed)
                  return (
                    <div key={brand}
                      onClick={() => { if (!alreadyAdded) onUpdate([...selectedIndustries, trimmed], localLevel!) }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid hsl(var(--border) / 0.5)', cursor: alreadyAdded ? 'default' : 'pointer', opacity: alreadyAdded ? 0.5 : 1, transition: 'background 0.12s' }}
                      onMouseEnter={(e) => { if (!alreadyAdded) e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.3)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: '600', marginRight: '8px' }}>{highlightText(brand, searchInput)}</span>
                        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>{trimmed}</span>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.4fr', gap: '12px', flex: 1, overflow: 'hidden' }}>

              <div style={colStyle}>
                <div style={colHeaderStyle}>
                  <span>업종(대)</span>
                  {localLevel === 'major' && <SelectAllButton paths={filteredMajorItems.filter(({ isMatch }) => isMatch).map(({ major }) => major)} />}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  {filteredMajors.length === 0
                    ? <div style={emptyStyle}>검색 결과가 없습니다</div>
                    : filteredMajorItems.map(({ major, isMatch }) => renderRow(
                      major, major,
                      localLevel !== 'major',
                      activeMajor === major && !isIndustrySearchMode,
                      () => { if (!isIndustrySearchMode && localLevel !== 'major') { setActiveMajor(activeMajor === major ? null : major); setActiveMid(null) } },
                      undefined,
                      isIndustrySearchMode && !isMatch,
                      'major'
                    ))
                  }
                </div>
              </div>

              <div style={{ ...colStyle, opacity: localLevel === 'major' ? 0.3 : 1 }}>
                <div style={colHeaderStyle}>
                  <span>업종(중)</span>
                  {localLevel === 'mid' && <SelectAllButton paths={midItems.filter(({ isMatch }) => isMatch).map(({ major, mid }) => `${major} > ${mid}`)} />}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  {localLevel === 'major'
                    ? <div style={emptyStyle}>대분류 레벨에서는<br />사용하지 않습니다</div>
                    : !activeMajor && !isIndustrySearchMode
                      ? <div style={emptyStyle}>업종(대)를 클릭하면<br />하위 업종(중)이 표시됩니다.</div>
                      : midItems.length === 0
                        ? <div style={emptyStyle}>검색 결과가 없습니다</div>
                        : midItems.map(({ major, mid, isMatch }) => renderRow(
                          `${major} > ${mid}`, mid,
                          localLevel === 'minor',
                          activeMid === mid && activeMajor === major && !isIndustrySearchMode,
                          () => { if (!isIndustrySearchMode && localLevel === 'minor') { setActiveMajor(major); setActiveMid(activeMid === mid ? null : mid) } },
                          isIndustrySearchMode ? `${major} >` : undefined,
                          isIndustrySearchMode && !isMatch,
                          'mid'
                        ))
                  }
                </div>
              </div>

              <div style={{ ...colStyle, opacity: localLevel !== 'minor' ? 0.3 : 1 }}>
                <div style={colHeaderStyle}>
                  <span>업종(소)</span>
                  {localLevel === 'minor' && <SelectAllButton paths={minorItems.map(({ major, mid, minor }) => `${major} > ${mid} > ${minor}`)} />}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  {localLevel !== 'minor'
                    ? <div style={emptyStyle}>{localLevel === 'major' ? '대분류' : '중분류'} 레벨에서는<br />사용하지 않습니다</div>
                    : !activeMid && !isIndustrySearchMode
                      ? <div style={emptyStyle}>업종(중)을 클릭하면<br />하위 업종(소)이 표시됩니다.</div>
                      : minorItems.length === 0
                        ? <div style={emptyStyle}>검색 결과가 없습니다</div>
                        : minorItems.map(({ major, mid, minor }) => renderRow(
                          `${major} > ${mid} > ${minor}`, minor, false,
                          false, undefined,
                          isIndustrySearchMode ? `${major} > ${mid} >` : undefined,
                          undefined,
                          'minor'
                        ))
                  }
                </div>
              </div>

              <div style={colStyle}>
                <div style={colHeaderStyle}>
                  <span>선택한 업종</span>
                  {selectedIndustries.length > 0 && (
                    <button onClick={() => onUpdate([], localLevel!)} className="btn btn-ghost btn-sm" style={{ fontSize: '11px' }}>
                      전체 해제
                    </button>
                  )}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  {selectedIndustries.length === 0 ? (
                    <div style={emptyStyle}>선택된 업종이 없습니다<br /><span style={{ fontSize: '11px' }}>좌측에서 [+]로 추가하세요</span></div>
                  ) : filteredSelected.length === 0 ? (
                    <div style={emptyStyle}>검색 결과가 없습니다</div>
                  ) : filteredSelected.map(industry => (
                    <div key={industry} style={{ display: 'flex', alignItems: 'flex-start', padding: '7px 10px', marginBottom: '3px', backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '12px', gap: '6px' }}>
                      <span style={{ flex: 1, wordBreak: 'break-word', lineHeight: '1.5' }}>
                        {searchQuery ? highlightText(industry, searchQuery) : industry}
                      </span>
                      <button onClick={() => handleRemove(industry)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', display: 'flex', alignItems: 'center', color: 'hsl(var(--muted-foreground))', flexShrink: 0 }}>
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
          )}
        </div>

        <div className="dialog-footer">
          <button onClick={handleReset} className="btn btn-ghost btn-md" style={{ marginRight: 'auto' }}>초기화</button>
          <button onClick={handleCancel} className="btn btn-secondary btn-md">취소</button>
          <button
            onClick={onClose}
            disabled={selectedIndustries.length === 0}
            className="btn btn-primary btn-md"
            style={{ opacity: selectedIndustries.length === 0 ? 0.5 : 1, cursor: selectedIndustries.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            선택 완료 ({selectedIndustries.length}건)
          </button>
        </div>
      </div>
    </div>
  )
}
