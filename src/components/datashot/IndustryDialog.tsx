import { useState } from 'react'
import { X } from 'lucide-react'
import { industryCategories, brandIndustryMap } from './types'

interface IndustryDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedIndustries: string[]
  onUpdate: (industries: string[]) => void
}

export function IndustryDialog({ isOpen, onClose, selectedIndustries, onUpdate }: IndustryDialogProps) {
  // 검색 관련 상태
  const [searchType, setSearchType] = useState<'industry' | 'brand'>('industry')
  const [searchQuery, setSearchQuery] = useState('')
  
  // 3단 필터 상태
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [selectedMids, setSelectedMids] = useState<string[]>([])
  const [selectedMinors, setSelectedMinors] = useState<string[]>([])

  // 중분류 옵션 (선택된 대분류 기준)
  const getMidOptions = (): string[] => {
    if (selectedMajors.length === 0) return []
    
    const mids = new Set<string>()
    selectedMajors.forEach(major => {
      Object.keys(industryCategories[major] || {}).forEach(mid => mids.add(mid))
    })
    return Array.from(mids)
  }

  // 소분류 옵션 (선택된 대분류 + 중분류 기준)
  const getMinorOptions = (): string[] => {
    if (selectedMajors.length === 0 || selectedMids.length === 0) return []
    
    const minors = new Set<string>()
    selectedMajors.forEach(major => {
      selectedMids.forEach(mid => {
        const minorList = industryCategories[major]?.[mid] as string[] || []
        minorList.forEach(minor => minors.add(minor))
      })
    })
    return Array.from(minors)
  }

  // 검색 필터링
  const getFilteredMajors = () => {
    const majors = Object.keys(industryCategories)
    if (!searchQuery || searchType === 'brand') return majors
    
    return majors.filter(major => 
      major.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const getFilteredMids = () => {
    const mids = getMidOptions()
    if (!searchQuery || searchType === 'brand') return mids
    
    return mids.filter(mid => 
      mid.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const getFilteredMinors = () => {
    const minors = getMinorOptions()
    if (!searchQuery || searchType === 'brand') return minors
    
    return minors.filter(minor => 
      minor.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // 브랜드 검색 결과
  const getBrandSearchResults = () => {
    if (searchType !== 'brand' || !searchQuery) return []
    
    return Object.entries(brandIndustryMap)
      .filter(([brand]) => brand.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(([brand, path]) => ({ brand, path }))
  }

  // 최종 선택 결과 계산
  const calculateFinalSelection = () => {
    const results: string[] = []
    
    // 대분류만 선택
    if (selectedMajors.length > 0 && selectedMids.length === 0) {
      selectedMajors.forEach(major => {
        results.push(major)
      })
      return results
    }
    
    // 대+중 선택
    if (selectedMajors.length > 0 && selectedMids.length > 0 && selectedMinors.length === 0) {
      selectedMajors.forEach(major => {
        selectedMids.forEach(mid => {
          // 해당 대분류에 중분류가 실제로 존재하는지 확인
          if (industryCategories[major]?.[mid]) {
            results.push(`${major} > ${mid}`)
          }
        })
      })
      return results
    }
    
    // 대+중+소 선택
    if (selectedMajors.length > 0 && selectedMids.length > 0 && selectedMinors.length > 0) {
      selectedMajors.forEach(major => {
        selectedMids.forEach(mid => {
          selectedMinors.forEach(minor => {
            const minorList = industryCategories[major]?.[mid] as string[] || []
            if (minorList.includes(minor)) {
              results.push(`${major} > ${mid} > ${minor}`)
            }
          })
        })
      })
      return results
    }
    
    return results
  }

  // 적용 버튼
  const handleApply = () => {
    const finalSelection = calculateFinalSelection()
    onUpdate([...new Set([...selectedIndustries, ...finalSelection])])
    
    // 초기화
    setSelectedMajors([])
    setSelectedMids([])
    setSelectedMinors([])
  }

  // 전체 선택
  const handleSelectAll = () => {
    const allMajors = Object.keys(industryCategories)
    onUpdate(allMajors)
  }

  // 초기화
  const handleReset = () => {
    onUpdate([])
    setSelectedMajors([])
    setSelectedMids([])
    setSelectedMinors([])
  }

  // 브랜드 선택
  const handleBrandSelect = (path: string) => {
    if (!selectedIndustries.includes(path)) {
      onUpdate([...selectedIndustries, path])
    }
    setSearchQuery('')
  }

  // 대분류 체크박스 핸들러
  const handleMajorToggle = (major: string) => {
    setSelectedMajors(prev => {
      const newSelection = prev.includes(major)
        ? prev.filter(m => m !== major)
        : [...prev, major]
      
      // 대분류 변경 시 중/소분류 초기화
      if (!prev.includes(major)) {
        setSelectedMids([])
        setSelectedMinors([])
      }
      
      return newSelection
    })
  }

  // 중분류 체크박스 핸들러
  const handleMidToggle = (mid: string) => {
    setSelectedMids(prev => {
      const newSelection = prev.includes(mid)
        ? prev.filter(m => m !== mid)
        : [...prev, mid]
      
      // 중분류 변경 시 소분류 초기화
      if (!prev.includes(mid)) {
        setSelectedMinors([])
      }
      
      return newSelection
    })
  }

  // 소분류 체크박스 핸들러
  const handleMinorToggle = (minor: string) => {
    setSelectedMinors(prev =>
      prev.includes(minor)
        ? prev.filter(m => m !== minor)
        : [...prev, minor]
    )
  }

  // 대분류 전체 선택/해제
  const handleMajorSelectAll = () => {
    const allMajors = getFilteredMajors()
    if (selectedMajors.length === allMajors.length) {
      setSelectedMajors([])
      setSelectedMids([])
      setSelectedMinors([])
    } else {
      setSelectedMajors(allMajors)
      setSelectedMids([])
      setSelectedMinors([])
    }
  }

  // 중분류 전체 선택/해제
  const handleMidSelectAll = () => {
    const allMids = getFilteredMids()
    if (selectedMids.length === allMids.length) {
      setSelectedMids([])
      setSelectedMinors([])
    } else {
      setSelectedMids(allMids)
      setSelectedMinors([])
    }
  }

  // 소분류 전체 선택/해제
  const handleMinorSelectAll = () => {
    const allMinors = getFilteredMinors()
    if (selectedMinors.length === allMinors.length) {
      setSelectedMinors([])
    } else {
      setSelectedMinors(allMinors)
    }
  }

  if (!isOpen) return null

  const filteredMajors = getFilteredMajors()
  const filteredMids = getFilteredMids()
  const filteredMinors = getFilteredMinors()
  const brandResults = getBrandSearchResults()

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div 
        className="dialog-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          width: '1000px',
          maxWidth: '95vw',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">업종 선택</h3>
          <p className="dialog-description">
            데이터 추출에 사용할 업종을 선택하세요
          </p>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '24px',
              top: '24px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: 'hsl(var(--muted-foreground))'
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* 상단 액션 버튼 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '16px' }}>
            <button onClick={handleSelectAll} className="btn btn-ghost btn-sm">
              전체 선택
            </button>
            <button onClick={handleReset} className="btn btn-ghost btn-sm">
              초기화
            </button>
          </div>

          {/* 검색 영역 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value as 'industry' | 'brand')
                setSearchQuery('')
              }}
              className="input"
              style={{ width: '100px' }}
            >
              <option value="industry">업종</option>
              <option value="brand">브랜드</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchType === 'industry' ? '업종 검색...' : '브랜드 검색...'}
              className="input"
              style={{ flex: 1 }}
            />
          </div>

          {/* 브랜드 검색 결과 */}
          {searchType === 'brand' && brandResults.length > 0 && (
            <div style={{ 
              marginBottom: '16px',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              padding: '12px',
              maxHeight: '150px',
              overflowY: 'auto'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                브랜드 검색 결과 ({brandResults.length})
              </div>
              {brandResults.map(({ brand, path }) => (
                <button
                  key={brand}
                  onClick={() => handleBrandSelect(path)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px',
                    marginBottom: '4px',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '4px',
                    backgroundColor: 'hsl(var(--background))',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  <div style={{ fontWeight: '600' }}>{brand}</div>
                  <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                    {path}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 3단 필터 */}
          {searchType === 'industry' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              flex: 1,
              overflow: 'hidden'
            }}>
              {/* 업종(대) */}
              <div style={{ 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '12px',
                  borderBottom: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--muted) / 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>업종(대)</span>
                  <button
                    onClick={handleMajorSelectAll}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '11px', padding: '2px 8px', height: '24px' }}
                  >
                    {selectedMajors.length === filteredMajors.length ? '해제' : '전체'}
                  </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  {filteredMajors.map(major => (
                    <label
                      key={major}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontSize: '13px',
                        backgroundColor: selectedMajors.includes(major) ? 'hsl(var(--primary) / 0.1)' : 'transparent'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMajors.includes(major)}
                        onChange={() => handleMajorToggle(major)}
                        className="checkbox-custom"
                      />
                      <span>{major}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 업종(중) */}
              <div style={{ 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                opacity: selectedMajors.length === 0 ? 0.5 : 1
              }}>
                <div style={{
                  padding: '12px',
                  borderBottom: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--muted) / 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>업종(중)</span>
                  {selectedMajors.length > 0 && (
                    <button
                      onClick={handleMidSelectAll}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '11px', padding: '2px 8px', height: '24px' }}
                    >
                      {selectedMids.length === filteredMids.length ? '해제' : '전체'}
                    </button>
                  )}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  {selectedMajors.length === 0 ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      fontSize: '12px',
                      color: 'hsl(var(--muted-foreground))'
                    }}>
                      업종(대)를 먼저 선택하세요
                    </div>
                  ) : (
                    filteredMids.map(mid => (
                      <label
                        key={mid}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          fontSize: '13px',
                          backgroundColor: selectedMids.includes(mid) ? 'hsl(var(--primary) / 0.1)' : 'transparent'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMids.includes(mid)}
                          onChange={() => handleMidToggle(mid)}
                          className="checkbox-custom"
                        />
                        <span>{mid}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* 업종(소) */}
              <div style={{ 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                opacity: selectedMids.length === 0 ? 0.5 : 1
              }}>
                <div style={{
                  padding: '12px',
                  borderBottom: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--muted) / 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>업종(소)</span>
                  {selectedMids.length > 0 && (
                    <button
                      onClick={handleMinorSelectAll}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '11px', padding: '2px 8px', height: '24px' }}
                    >
                      {selectedMinors.length === filteredMinors.length ? '해제' : '전체'}
                    </button>
                  )}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  {selectedMids.length === 0 ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      fontSize: '12px',
                      color: 'hsl(var(--muted-foreground))'
                    }}>
                      업종(중)을 먼저 선택하세요
                    </div>
                  ) : (
                    filteredMinors.map(minor => (
                      <label
                        key={minor}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          fontSize: '13px',
                          backgroundColor: selectedMinors.includes(minor) ? 'hsl(var(--primary) / 0.1)' : 'transparent'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMinors.includes(minor)}
                          onChange={() => handleMinorToggle(minor)}
                          className="checkbox-custom"
                        />
                        <span>{minor}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 선택 결과 미리보기 */}
          {searchType === 'industry' && (selectedMajors.length > 0 || selectedMids.length > 0 || selectedMinors.length > 0) && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              backgroundColor: 'hsl(var(--muted) / 0.1)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                추가될 업종 ({calculateFinalSelection().length}개)
              </div>
              <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                {calculateFinalSelection().slice(0, 5).join(', ')}
                {calculateFinalSelection().length > 5 && ` 외 ${calculateFinalSelection().length - 5}개`}
              </div>
            </div>
          )}

          {/* 선택된 업종 목록 */}
          <div style={{ marginTop: '16px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>
                선택된 업종 ({selectedIndustries.length}개)
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '12px',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              minHeight: '60px',
              maxHeight: '120px',
              overflowY: 'auto',
              backgroundColor: 'hsl(var(--muted) / 0.1)'
            }}>
              {selectedIndustries.length === 0 ? (
                <div style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: 'hsl(var(--muted-foreground))',
                  padding: '12px'
                }}>
                  선택된 업종이 없습니다
                </div>
              ) : (
                selectedIndustries.map(industry => (
                  <div
                    key={industry}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  >
                    <span>{industry}</span>
                    <button
                      onClick={() => onUpdate(selectedIndustries.filter(i => i !== industry))}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'hsl(var(--muted-foreground))'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="dialog-footer">
          {searchType === 'industry' && (selectedMajors.length > 0 || selectedMids.length > 0 || selectedMinors.length > 0) && (
            <button
              onClick={handleApply}
              className="btn btn-primary btn-md"
              style={{ marginRight: 'auto' }}
            >
              선택 항목 추가 ({calculateFinalSelection().length}개)
            </button>
          )}
          <button
            onClick={onClose}
            className="btn btn-secondary btn-md"
            style={{ marginLeft: searchType === 'brand' ? 'auto' : '0' }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
