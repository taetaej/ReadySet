import { useState } from 'react'
import { X, ChevronRight } from 'lucide-react'
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

  // 검색 필터링 (업종만)
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

  // 업종 선택 - chevron 클릭 시 우측 리스트에 추가
  const handleAddToSelected = (path: string) => {
    if (!selectedIndustries.includes(path)) {
      onUpdate([...selectedIndustries, path])
    }
  }

  // 브랜드 선택 - 우측 리스트에 바로 추가
  const handleBrandSelect = (path: string) => {
    if (!selectedIndustries.includes(path)) {
      onUpdate([...selectedIndustries, path])
    }
  }

  // 전체 선택
  const handleSelectAll = () => {
    const allMajors = Object.keys(industryCategories)
    onUpdate([...new Set([...selectedIndustries, ...allMajors])])
  }

  // 초기화
  const handleReset = () => {
    onUpdate([])
    setSelectedMajors([])
    setSelectedMids([])
    setSelectedMinors([])
  }

  // 대분류 체크박스 핸들러
  const handleMajorToggle = (major: string) => {
    setSelectedMajors(prev => {
      const newSelection = prev.includes(major)
        ? prev.filter(m => m !== major)
        : [...prev, major]
      
      // 대분류 변경 시 중/소분류 초기화 (선택 해제 시에만)
      if (prev.includes(major)) {
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
      
      // 중분류 변경 시 소분류 초기화 (선택 해제 시에만)
      if (prev.includes(mid)) {
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
    if (selectedMajors.length === allMajors.length && allMajors.length > 0) {
      setSelectedMajors([])
      setSelectedMids([])
      setSelectedMinors([])
    } else {
      setSelectedMajors(allMajors)
    }
  }

  // 중분류 전체 선택/해제
  const handleMidSelectAll = () => {
    const allMids = getFilteredMids()
    if (selectedMids.length === allMids.length && allMids.length > 0) {
      setSelectedMids([])
      setSelectedMinors([])
    } else {
      setSelectedMids(allMids)
    }
  }

  // 소분류 전체 선택/해제
  const handleMinorSelectAll = () => {
    const allMinors = getFilteredMinors()
    if (selectedMinors.length === allMinors.length && allMinors.length > 0) {
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

          {/* 검색 영역 - 탭 형식 */}
          <div style={{ marginBottom: '16px' }}>
            {/* 탭 */}
            <div style={{ 
              display: 'flex', 
              gap: '4px',
              marginBottom: '12px',
              borderBottom: '1px solid hsl(var(--border))'
            }}>
              <button
                onClick={() => {
                  setSearchType('industry')
                  setSearchQuery('')
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '500',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderBottom: searchType === 'industry' ? '2px solid hsl(var(--primary))' : '2px solid transparent',
                  color: searchType === 'industry' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                  transition: 'all 0.2s'
                }}
              >
                업종
              </button>
              <button
                onClick={() => {
                  setSearchType('brand')
                  setSearchQuery('')
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '500',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderBottom: searchType === 'brand' ? '2px solid hsl(var(--primary))' : '2px solid transparent',
                  color: searchType === 'brand' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                  transition: 'all 0.2s'
                }}
              >
                브랜드
              </button>
            </div>
            
            {/* 검색 입력 */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchType === 'industry' ? '업종 검색...' : '브랜드 검색...'}
              className="input"
              style={{ width: '100%' }}
            />
          </div>

          {/* 브랜드 검색 결과 */}
          {searchType === 'brand' && brandResults.length > 0 && (
            <div style={{ 
              marginBottom: '16px',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              padding: '12px',
              maxHeight: '400px',
              overflowY: 'auto',
              backgroundColor: 'hsl(var(--muted) / 0.1)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                브랜드 검색 결과 ({brandResults.length})
              </div>
              {brandResults.map(({ brand, path }) => (
                <div
                  key={brand}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    marginBottom: '6px',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    backgroundColor: 'hsl(var(--background))',
                    fontSize: '13px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{brand}</div>
                    <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                      {path}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBrandSelect(path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'hsl(var(--primary))'
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 4단 레이아웃: 업종(대) | 업종(중) | 업종(소) | 선택된 업종 */}
          {searchType === 'industry' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
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
                    <div
                      key={major}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        backgroundColor: selectedMajors.includes(major) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                        marginBottom: '4px'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMajors.includes(major)}
                        onChange={() => handleMajorToggle(major)}
                        className="checkbox-custom"
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ flex: 1 }}>{major}</span>
                      <button
                        onClick={() => handleAddToSelected(major)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          color: 'hsl(var(--primary))'
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
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
                      <div
                        key={mid}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px',
                          borderRadius: '4px',
                          fontSize: '13px',
                          backgroundColor: selectedMids.includes(mid) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          marginBottom: '4px'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMids.includes(mid)}
                          onChange={() => handleMidToggle(mid)}
                          className="checkbox-custom"
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ flex: 1 }}>{mid}</span>
                        <button
                          onClick={() => {
                            // 대+중 조합으로 추가
                            selectedMajors.forEach(major => {
                              if (industryCategories[major]?.[mid]) {
                                handleAddToSelected(`${major} > ${mid}`)
                              }
                            })
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'hsl(var(--primary))'
                          }}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
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
                      <div
                        key={minor}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px',
                          borderRadius: '4px',
                          fontSize: '13px',
                          backgroundColor: selectedMinors.includes(minor) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          marginBottom: '4px'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMinors.includes(minor)}
                          onChange={() => handleMinorToggle(minor)}
                          className="checkbox-custom"
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ flex: 1 }}>{minor}</span>
                        <button
                          onClick={() => {
                            // 대+중+소 조합으로 추가
                            selectedMajors.forEach(major => {
                              selectedMids.forEach(mid => {
                                const minorList = industryCategories[major]?.[mid] as string[] || []
                                if (minorList.includes(minor)) {
                                  handleAddToSelected(`${major} > ${mid} > ${minor}`)
                                }
                              })
                            })
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'hsl(var(--primary))'
                          }}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 선택된 업종 */}
              <div style={{ 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: 'hsl(var(--muted) / 0.1)'
              }}>
                <div style={{
                  padding: '12px',
                  borderBottom: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--muted) / 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>
                    선택된 업종 ({selectedIndustries.length})
                  </span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  {selectedIndustries.length === 0 ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      fontSize: '12px',
                      color: 'hsl(var(--muted-foreground))'
                    }}>
                      선택된 업종이 없습니다
                    </div>
                  ) : (
                    selectedIndustries.map(industry => (
                      <div
                        key={industry}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px',
                          marginBottom: '4px',
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          fontSize: '12px'
                        }}
                      >
                        <span style={{ flex: 1, wordBreak: 'break-word' }}>{industry}</span>
                        <button
                          onClick={() => onUpdate(selectedIndustries.filter(i => i !== industry))}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'hsl(var(--muted-foreground))',
                            flexShrink: 0,
                            marginLeft: '8px'
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
          )}

          {/* 브랜드 탭일 때도 선택된 업종 표시 */}
          {searchType === 'brand' && (
            <div style={{ 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundColor: 'hsl(var(--muted) / 0.1)',
              flex: 1
            }}>
              <div style={{
                padding: '12px',
                borderBottom: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--muted) / 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>
                  선택된 업종 ({selectedIndustries.length})
                </span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                {selectedIndustries.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    fontSize: '12px',
                    color: 'hsl(var(--muted-foreground))'
                  }}>
                    선택된 업종이 없습니다
                  </div>
                ) : (
                  selectedIndustries.map(industry => (
                    <div
                      key={industry}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px',
                        marginBottom: '4px',
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    >
                      <span style={{ flex: 1, wordBreak: 'break-word' }}>{industry}</span>
                      <button
                        onClick={() => onUpdate(selectedIndustries.filter(i => i !== industry))}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          color: 'hsl(var(--muted-foreground))',
                          flexShrink: 0,
                          marginLeft: '8px'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="dialog-footer">
          <button
            onClick={onClose}
            className="btn btn-secondary btn-md"
            style={{ marginLeft: 'auto' }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
