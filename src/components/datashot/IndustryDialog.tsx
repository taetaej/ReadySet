import { useState } from 'react'
import { X, ChevronRight, PlusCircle } from 'lucide-react'
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
  const [brandSearchResults, setBrandSearchResults] = useState<Array<{ brand: string, path: string }>>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false) // 검색 실행 여부 추적
  
  // 3단 필터 상태
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [selectedMids, setSelectedMids] = useState<string[]>([])
  const [selectedMinors, setSelectedMinors] = useState<string[]>([])

  // 검색 필터링 (업종 대/중/소 모두) + 자동 상위 선택
  const getFilteredMajors = () => {
    const majors = Object.keys(industryCategories)
    if (!searchQuery || searchType === 'brand') return majors
    
    const query = searchQuery.toLowerCase()
    
    // 중/소분류에서 매칭되는 경우 상위 대분류도 포함
    const matchedMajors = new Set<string>()
    
    majors.forEach(major => {
      // 대분류 자체가 매칭
      if (major.toLowerCase().includes(query)) {
        matchedMajors.add(major)
      }
      
      // 중분류나 소분류에서 매칭되면 대분류 포함
      Object.entries(industryCategories[major]).forEach(([mid, minors]) => {
        if (mid.toLowerCase().includes(query)) {
          matchedMajors.add(major)
        }
        (minors as string[]).forEach(minor => {
          if (minor.toLowerCase().includes(query)) {
            matchedMajors.add(major)
          }
        })
      })
    })
    
    return Array.from(matchedMajors)
  }

  const getFilteredMids = () => {
    // 검색어가 없으면 선택된 대분류 기준으로 중분류 표시
    if (!searchQuery || searchType === 'brand') {
      return getMidOptions()
    }
    
    const query = searchQuery.toLowerCase()
    
    // 검색 시: 필터링된 대분류들에서 중/소분류 검색
    // 소분류에서 매칭되는 경우 상위 중분류도 포함
    const matchedMids = new Set<string>()
    const majorsToSearch = getFilteredMajors()
    
    majorsToSearch.forEach(major => {
      Object.entries(industryCategories[major] || {}).forEach(([mid, minors]) => {
        // 중분류 자체가 매칭
        if (mid.toLowerCase().includes(query)) {
          matchedMids.add(mid)
        }
        
        // 소분류에서 매칭되면 중분류 포함
        (minors as string[]).forEach(minor => {
          if (minor.toLowerCase().includes(query)) {
            matchedMids.add(mid)
          }
        })
      })
    })
    
    return Array.from(matchedMids)
  }

  const getFilteredMinors = () => {
    // 검색어가 없으면 선택된 대/중분류 기준으로 소분류 표시
    if (!searchQuery || searchType === 'brand') {
      return getMinorOptions()
    }
    
    const query = searchQuery.toLowerCase()
    
    // 검색 시: 필터링된 대분류와 중분류들에서 소분류 검색
    const matchedMinors = new Set<string>()
    const majorsToSearch = getFilteredMajors()
    
    majorsToSearch.forEach(major => {
      Object.entries(industryCategories[major] || {}).forEach(([mid, minors]) => {
        (minors as string[]).forEach(minor => {
          if (minor.toLowerCase().includes(query)) {
            matchedMinors.add(minor)
          }
        })
      })
    })
    
    return Array.from(matchedMinors)
  }

  // 검색어 하이라이팅 함수
  const highlightText = (text: string, query: string) => {
    if (!query) return text
    
    const lowerText = text.toLowerCase()
    const lowerQuery = query.toLowerCase()
    const index = lowerText.indexOf(lowerQuery)
    
    if (index === -1) return text
    
    return (
      <>
        {text.substring(0, index)}
        <strong style={{ fontWeight: '700', color: 'hsl(var(--primary))' }}>
          {text.substring(index, index + query.length)}
        </strong>
        {text.substring(index + query.length)}
      </>
    )
  }

  // 검색어 변경 시 자동으로 상위 카테고리 선택 - 제거
  // 이제 하이라이팅만 하고 자동 선택은 하지 않음
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

  // 브랜드 검색 실행
  const handleBrandSearch = () => {
    if (!searchQuery.trim()) {
      setBrandSearchResults([])
      setHasSearched(false)
      return
    }
    
    setIsSearching(true)
    setHasSearched(true)
    
    // TODO: 실제 API 호출로 교체
    // const results = await fetch(`/api/brands/search?q=${searchQuery}`)
    
    // 임시: 로컬 데이터에서 검색
    const results = Object.entries(brandIndustryMap)
      .filter(([brand]) => brand.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(([brand, path]) => ({ brand, path }))
      .slice(0, 20) // 최대 20개
    
    setBrandSearchResults(results)
    setIsSearching(false)
  }

  // 엔터키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchType === 'brand') {
      handleBrandSearch()
    }
  }

  // 선택된 업종 삭제 (우측 리스트에서 X 버튼 클릭 시)
  const handleRemoveIndustry = (industry: string) => {
    // 우측 리스트에서 제거
    onUpdate(selectedIndustries.filter(i => i !== industry))
    
    // 좌측 체크박스도 해제
    const parts = industry.split(' > ')
    
    if (parts.length === 1) {
      // 대분류만 있는 경우
      setSelectedMajors(prev => prev.filter(m => m !== parts[0]))
      setSelectedMids([])
      setSelectedMinors([])
    } else if (parts.length === 2) {
      // 대 > 중
      const [major, mid] = parts
      setSelectedMids(prev => prev.filter(m => m !== mid))
      setSelectedMinors([])
      
      // 해당 대분류에 속한 다른 중분류가 선택되어 있는지 확인
      const otherMidsInSameMajor = selectedMids.filter(m => {
        return m !== mid && Object.keys(industryCategories[major] || {}).includes(m)
      })
      
      // 다른 중분류가 없으면 대분류도 해제
      if (otherMidsInSameMajor.length === 0) {
        setSelectedMajors(prev => prev.filter(m => m !== major))
      }
    } else if (parts.length === 3) {
      // 대 > 중 > 소
      const [major, mid, minor] = parts
      setSelectedMinors(prev => prev.filter(m => m !== minor))
      
      // 해당 중분류에 속한 다른 소분류가 선택되어 있는지 확인
      const minorsInSameMid = industryCategories[major]?.[mid] as string[] || []
      const otherMinorsInSameMid = selectedMinors.filter(m => {
        return m !== minor && minorsInSameMid.includes(m)
      })
      
      // 다른 소분류가 없으면 중분류도 해제
      if (otherMinorsInSameMid.length === 0) {
        setSelectedMids(prev => prev.filter(m => m !== mid))
        
        // 해당 대분류에 속한 다른 중분류가 선택되어 있는지 확인
        const otherMidsInSameMajor = selectedMids.filter(m => {
          return m !== mid && Object.keys(industryCategories[major] || {}).includes(m)
        })
        
        // 다른 중분류가 없으면 대분류도 해제
        if (otherMidsInSameMajor.length === 0) {
          setSelectedMajors(prev => prev.filter(m => m !== major))
        }
      }
    }
  }

  // 브랜드 선택 - 우측 리스트에 바로 추가
  const handleBrandSelect = (path: string) => {
    if (!selectedIndustries.includes(path)) {
      onUpdate([...selectedIndustries, path])
    }
  }

  // 초기화
  const handleReset = () => {
    // 선택된 업종 초기화
    onUpdate([])
    // 검색 필터 초기화
    setSearchType('industry')
    setSearchQuery('')
    setBrandSearchResults([])
    setHasSearched(false)
    // 업종 선택 UI 초기화
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
      
      // 중분류 선택 시 소분류 초기화 (선택 해제 시에만)
      if (prev.includes(mid)) {
        setSelectedMinors([])
      } else {
        // 중분류 선택 시: 해당 중분류가 속한 대분류를 자동 선택
        const parentMajor = Object.keys(industryCategories).find(major => 
          Object.keys(industryCategories[major]).includes(mid)
        )
        if (parentMajor && !selectedMajors.includes(parentMajor)) {
          setSelectedMajors(prevMajors => [...prevMajors, parentMajor])
        }
      }
      
      return newSelection
    })
  }

  // 소분류 체크박스 핸들러
  const handleMinorToggle = (minor: string) => {
    setSelectedMinors(prev => {
      const isRemoving = prev.includes(minor)
      const newSelection = isRemoving
        ? prev.filter(m => m !== minor)
        : [...prev, minor]
      
      if (!isRemoving) {
        // 소분류 선택 시: 해당 소분류가 속한 대분류와 중분류를 자동 선택
        let parentMajor = ''
        let parentMid = ''
        
        Object.entries(industryCategories).forEach(([major, midCategories]) => {
          Object.entries(midCategories).forEach(([mid, minors]) => {
            if ((minors as string[]).includes(minor)) {
              parentMajor = major
              parentMid = mid
            }
          })
        })
        
        if (parentMajor && !selectedMajors.includes(parentMajor)) {
          setSelectedMajors(prevMajors => [...prevMajors, parentMajor])
        }
        if (parentMid && !selectedMids.includes(parentMid)) {
          setSelectedMids(prevMids => [...prevMids, parentMid])
        }
      }
      
      return newSelection
    })
  }

  // 대분류 전체 선택/해제
  const handleMajorSelectAll = () => {
    const allMajors = getFilteredMajors()
    const isAllSelected = selectedMajors.length === allMajors.length && allMajors.length > 0
    
    if (isAllSelected) {
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
    const isAllSelected = selectedMids.length === allMids.length && allMids.length > 0
    
    if (isAllSelected) {
      setSelectedMids([])
      setSelectedMinors([])
    } else {
      setSelectedMids(allMids)
      // 중분류 전체 선택 시 관련된 대분류도 자동 선택
      const parentMajors = new Set<string>()
      allMids.forEach(mid => {
        const parentMajor = Object.keys(industryCategories).find(major => 
          Object.keys(industryCategories[major]).includes(mid)
        )
        if (parentMajor) parentMajors.add(parentMajor)
      })
      setSelectedMajors(prev => [...new Set([...prev, ...Array.from(parentMajors)])])
    }
  }

  // 소분류 전체 선택/해제
  const handleMinorSelectAll = () => {
    const allMinors = getFilteredMinors()
    const isAllSelected = selectedMinors.length === allMinors.length && allMinors.length > 0
    
    if (isAllSelected) {
      setSelectedMinors([])
    } else {
      setSelectedMinors(allMinors)
      // 소분류 전체 선택 시 관련된 대분류와 중분류도 자동 선택
      const parentMajors = new Set<string>()
      const parentMids = new Set<string>()
      
      allMinors.forEach(minor => {
        Object.entries(industryCategories).forEach(([major, midCategories]) => {
          Object.entries(midCategories).forEach(([mid, minors]) => {
            if ((minors as string[]).includes(minor)) {
              parentMajors.add(major)
              parentMids.add(mid)
            }
          })
        })
      })
      
      setSelectedMajors(prev => [...new Set([...prev, ...Array.from(parentMajors)])])
      setSelectedMids(prev => [...new Set([...prev, ...Array.from(parentMids)])])
    }
  }

  if (!isOpen) return null

  const filteredMajors = getFilteredMajors()
  const filteredMids = getFilteredMids()
  const filteredMinors = getFilteredMinors()

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div 
        className="dialog-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          width: '1300px',
          height: '900px',
          maxWidth: '95vw',
          maxHeight: '90vh',
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
          {/* 검색 영역 - 셀렉트박스 + 인풋 + 검색 버튼 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value as 'industry' | 'brand')
                setSearchQuery('')
                setBrandSearchResults([])
                setHasSearched(false)
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
              onKeyPress={handleKeyPress}
              placeholder={searchType === 'industry' ? '업종 검색...' : '브랜드명 입력 후 검색...'}
              className="input"
              style={{ flex: 1 }}
            />
            {searchType === 'brand' && (
              <button
                onClick={handleBrandSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="btn btn-primary btn-md"
                style={{
                  opacity: isSearching || !searchQuery.trim() ? 0.5 : 1,
                  cursor: isSearching || !searchQuery.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {isSearching ? '검색 중...' : '검색'}
              </button>
            )}
          </div>

          {/* 브랜드 검색 결과 */}
          {searchType === 'brand' && brandSearchResults.length > 0 && (
            <div style={{ 
              marginBottom: '16px',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              backgroundColor: 'hsl(var(--muted) / 0.1)',
              maxHeight: '200px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                padding: '12px',
                borderBottom: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--muted) / 0.3)',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                브랜드 검색 결과 ({brandSearchResults.length}개)
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                {brandSearchResults.map(({ brand, path }) => (
                  <div
                    key={brand}
                    onClick={() => handleBrandSelect(path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      marginBottom: '6px',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      backgroundColor: 'hsl(var(--background))',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.3)'
                      e.currentTarget.style.borderColor = 'hsl(var(--primary))'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--background))'
                      e.currentTarget.style.borderColor = 'hsl(var(--border))'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{brand}</div>
                      <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                        {path}
                      </div>
                    </div>
                    <PlusCircle 
                      size={20} 
                      style={{ 
                        color: 'hsl(var(--primary))',
                        flexShrink: 0,
                        marginLeft: '12px'
                      }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 브랜드 검색 결과 없음 */}
          {searchType === 'brand' && hasSearched && !isSearching && brandSearchResults.length === 0 && (
            <div style={{
              marginBottom: '16px',
              padding: '24px',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              backgroundColor: 'hsl(var(--muted) / 0.1)',
              textAlign: 'center',
              fontSize: '13px',
              color: 'hsl(var(--muted-foreground))'
            }}>
              검색 결과가 없습니다
            </div>
          )}

          {/* 4단 레이아웃: 업종(대) | 업종(중) | 업종(소) | > | 선택된 업종 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr 48px 1.5fr',
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
                    {selectedMajors.length === filteredMajors.length && filteredMajors.length > 0 ? '전체 해제' : '전체 선택'}
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
                        backgroundColor: selectedMajors.includes(major) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                        marginBottom: '4px'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMajors.includes(major)}
                        onChange={() => handleMajorToggle(major)}
                        className="checkbox-custom"
                      />
                      <span>{searchQuery && searchType === 'industry' ? highlightText(major, searchQuery) : major}</span>
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
                opacity: selectedMajors.length === 0 && !searchQuery ? 0.5 : 1
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
                  {(selectedMajors.length > 0 || searchQuery) && (
                    <button
                      onClick={handleMidSelectAll}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '11px', padding: '2px 8px', height: '24px' }}
                    >
                      {selectedMids.length === filteredMids.length && filteredMids.length > 0 ? '전체 해제' : '전체 선택'}
                    </button>
                  )}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  {selectedMajors.length === 0 && !searchQuery ? (
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
                          backgroundColor: selectedMids.includes(mid) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          marginBottom: '4px'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMids.includes(mid)}
                          onChange={() => handleMidToggle(mid)}
                          className="checkbox-custom"
                        />
                        <span>{searchQuery && searchType === 'industry' ? highlightText(mid, searchQuery) : mid}</span>
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
                opacity: selectedMids.length === 0 && !searchQuery ? 0.5 : 1
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
                  {(selectedMids.length > 0 || searchQuery) && (
                    <button
                      onClick={handleMinorSelectAll}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '11px', padding: '2px 8px', height: '24px' }}
                    >
                      {selectedMinors.length === filteredMinors.length && filteredMinors.length > 0 ? '전체 해제' : '전체 선택'}
                    </button>
                  )}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  {selectedMids.length === 0 && !searchQuery ? (
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
                          backgroundColor: selectedMinors.includes(minor) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          marginBottom: '4px'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMinors.includes(minor)}
                          onChange={() => handleMinorToggle(minor)}
                          className="checkbox-custom"
                        />
                        <span>{searchQuery && searchType === 'industry' ? highlightText(minor, searchQuery) : minor}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* 중앙 Chevron 버튼 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => {
                    const results: string[] = []
                    
                    // 대분류만 선택
                    if (selectedMajors.length > 0 && selectedMids.length === 0) {
                      selectedMajors.forEach(major => {
                        results.push(major)
                      })
                    }
                    // 대+중 선택
                    else if (selectedMajors.length > 0 && selectedMids.length > 0 && selectedMinors.length === 0) {
                      selectedMajors.forEach(major => {
                        selectedMids.forEach(mid => {
                          if (industryCategories[major]?.[mid]) {
                            results.push(`${major} > ${mid}`)
                          }
                        })
                      })
                    }
                    // 대+중+소 선택
                    else if (selectedMajors.length > 0 && selectedMids.length > 0 && selectedMinors.length > 0) {
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
                    }
                    
                    if (results.length > 0) {
                      onUpdate([...new Set([...selectedIndustries, ...results])])
                      // 선택 초기화
                      setSelectedMajors([])
                      setSelectedMids([])
                      setSelectedMinors([])
                    }
                  }}
                  disabled={selectedMajors.length === 0}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '2px solid hsl(var(--primary))',
                    backgroundColor: selectedMajors.length > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                    color: selectedMajors.length > 0 ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                    cursor: selectedMajors.length > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    opacity: selectedMajors.length > 0 ? 1 : 0.5
                  }}
                >
                  <ChevronRight size={24} />
                </button>
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
                          onClick={() => handleRemoveIndustry(industry)}
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

          {/* 브랜드 탭일 때도 선택된 업종 표시 제거 - 항상 4단 구조 유지 */}
        </div>

        <div className="dialog-footer">
          <button
            onClick={handleReset}
            className="btn btn-ghost btn-md"
            style={{ marginRight: 'auto' }}
          >
            초기화
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-md"
          >
            취소
          </button>
          <button
            onClick={onClose}
            className="btn btn-primary btn-md"
          >
            선택 완료 ({selectedIndustries.length}개)
          </button>
        </div>
      </div>
    </div>
  )
}
