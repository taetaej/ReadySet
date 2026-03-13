import { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
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
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  
  // Cascading 선택 상태
  const [selectedMajor, setSelectedMajor] = useState<string>('')
  const [selectedMid, setSelectedMid] = useState<string>('')
  const [selectedMinor, setSelectedMinor] = useState<string>('')
  
  // 드롭다운 열림 상태
  const [majorDropdownOpen, setMajorDropdownOpen] = useState(false)
  const [midDropdownOpen, setMidDropdownOpen] = useState(false)
  const [minorDropdownOpen, setMinorDropdownOpen] = useState(false)

  // 검색 결과 필터링
  const searchResults = () => {
    if (!searchQuery) return []
    
    const query = searchQuery.toLowerCase()
    
    if (searchType === 'brand') {
      return Object.entries(brandIndustryMap)
        .filter(([brand]) => brand.toLowerCase().includes(query))
        .map(([brand, path]) => ({ type: 'brand' as const, brand, path }))
    } else {
      const results: Array<{ type: 'industry', path: string }> = []
      Object.entries(industryCategories).forEach(([major, mids]) => {
        Object.entries(mids).forEach(([mid, minors]) => {
          (minors as string[]).forEach(minor => {
            const fullPath = `${major} > ${mid} > ${minor}`
            if (
              major.toLowerCase().includes(query) ||
              mid.toLowerCase().includes(query) ||
              minor.toLowerCase().includes(query)
            ) {
              results.push({ type: 'industry', path: fullPath })
            }
          })
        })
      })
      return results
    }
  }

  // 중분류 옵션 가져오기
  const getMidOptions = () => {
    if (!selectedMajor) return []
    return Object.keys(industryCategories[selectedMajor] || {})
  }

  // 소분류 옵션 가져오기
  const getMinorOptions = () => {
    if (!selectedMajor || !selectedMid) return []
    return (industryCategories[selectedMajor]?.[selectedMid] as string[]) || []
  }

  // 추가 버튼 핸들러
  const handleAdd = () => {
    if (!selectedMajor) return
    
    let path = selectedMajor
    
    if (selectedMid) {
      path += ` > ${selectedMid}`
      
      if (selectedMinor) {
        path += ` > ${selectedMinor}`
      }
    }
    
    if (!selectedIndustries.includes(path)) {
      onUpdate([...selectedIndustries, path])
    }
    resetCascading()
  }

  // 전체 선택 핸들러
  const handleSelectAll = () => {
    const allPaths: string[] = []
    Object.keys(industryCategories).forEach(major => {
      allPaths.push(major)
    })
    onUpdate([...new Set([...selectedIndustries, ...allPaths])])
  }

  // Cascading 선택 초기화
  const resetCascading = () => {
    setSelectedMajor('')
    setSelectedMid('')
    setSelectedMinor('')
  }

  // 검색 결과 선택 핸들러
  const handleSearchResultClick = (path: string) => {
    if (!selectedIndustries.includes(path)) {
      onUpdate([...selectedIndustries, path])
    }
    setSearchQuery('')
    setSearchDropdownOpen(false)
  }

  // 선택 항목 제거
  const handleRemove = (path: string) => {
    onUpdate(selectedIndustries.filter(ind => ind !== path))
  }

  if (!isOpen) return null

  const results = searchResults()

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div 
        className="dialog-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          width: '900px',
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
        
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {/* 검색 영역 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: '500', 
              marginBottom: '8px',
              color: 'hsl(var(--foreground))'
            }}>
              검색
            </label>
            <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
              {/* 검색 타입 선택 */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setSearchDropdownOpen(!searchDropdownOpen)}
                  className="input"
                  style={{
                    width: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <span>{searchType === 'industry' ? '업종' : '브랜드'}</span>
                  <ChevronDown size={16} />
                </button>
                
                {searchDropdownOpen && (
                  <div className="dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    width: '100px',
                    zIndex: 1000
                  }}>
                    <button
                      onClick={() => {
                        setSearchType('industry')
                        setSearchDropdownOpen(false)
                        setSearchQuery('')
                      }}
                      className="dropdown-item"
                    >
                      업종
                    </button>
                    <button
                      onClick={() => {
                        setSearchType('brand')
                        setSearchDropdownOpen(false)
                        setSearchQuery('')
                      }}
                      className="dropdown-item"
                    >
                      브랜드
                    </button>
                  </div>
                )}
              </div>
              
              {/* 검색 입력 */}
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchType === 'industry' ? '업종을 검색하세요...' : '브랜드를 검색하세요...'}
                  className="input"
                  style={{ width: '100%' }}
                />
                
                {/* 검색 결과 드롭다운 */}
                {searchQuery && results.length > 0 && (
                  <div className="dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1000
                  }}>
                    {results.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearchResultClick(result.type === 'brand' ? result.path : result.path)}
                        className="dropdown-item"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '4px'
                        }}
                      >
                        {result.type === 'brand' ? (
                          <>
                            <span style={{ fontWeight: '600' }}>{result.brand}</span>
                            <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                              {result.path}
                            </span>
                          </>
                        ) : (
                          <span>{result.path}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cascading 선택 영역 */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label style={{ 
                fontSize: '13px', 
                fontWeight: '500',
                color: 'hsl(var(--foreground))'
              }}>
                업종 선택
              </label>
              <button
                onClick={handleSelectAll}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '12px' }}
              >
                전체 선택
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* 업종(대) */}
              <div style={{ position: 'relative', flex: 1 }}>
                <button
                  onClick={() => {
                    setMajorDropdownOpen(!majorDropdownOpen)
                    setMidDropdownOpen(false)
                    setMinorDropdownOpen(false)
                  }}
                  className="input"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ color: selectedMajor ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                    {selectedMajor || '업종(대) 선택'}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                {majorDropdownOpen && (
                  <div className="dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1000
                  }}>
                    {Object.keys(industryCategories).map(major => (
                      <button
                        key={major}
                        onClick={() => {
                          setSelectedMajor(major)
                          setSelectedMid('')
                          setSelectedMinor('')
                          setMajorDropdownOpen(false)
                        }}
                        className="dropdown-item"
                      >
                        {major}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 업종(중) */}
              <div style={{ position: 'relative', flex: 1 }}>
                <button
                  onClick={() => {
                    if (selectedMajor) {
                      setMidDropdownOpen(!midDropdownOpen)
                      setMajorDropdownOpen(false)
                      setMinorDropdownOpen(false)
                    }
                  }}
                  className="input"
                  disabled={!selectedMajor}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: selectedMajor ? 'pointer' : 'not-allowed',
                    opacity: selectedMajor ? 1 : 0.5
                  }}
                >
                  <span style={{ color: selectedMid ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                    {selectedMid || '업종(중) 선택'}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                {midDropdownOpen && (
                  <div className="dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1000
                  }}>
                    {getMidOptions().map(mid => (
                      <button
                        key={mid}
                        onClick={() => {
                          setSelectedMid(mid)
                          setSelectedMinor('')
                          setMidDropdownOpen(false)
                        }}
                        className="dropdown-item"
                      >
                        {mid}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 업종(소) */}
              <div style={{ position: 'relative', flex: 1 }}>
                <button
                  onClick={() => {
                    if (selectedMid) {
                      setMinorDropdownOpen(!minorDropdownOpen)
                      setMajorDropdownOpen(false)
                      setMidDropdownOpen(false)
                    }
                  }}
                  className="input"
                  disabled={!selectedMid}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: selectedMid ? 'pointer' : 'not-allowed',
                    opacity: selectedMid ? 1 : 0.5
                  }}
                >
                  <span style={{ color: selectedMinor ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                    {selectedMinor || '업종(소) 선택'}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                {minorDropdownOpen && (
                  <div className="dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1000
                  }}>
                    {getMinorOptions().map(minor => (
                      <button
                        key={minor}
                        onClick={() => {
                          setSelectedMinor(minor)
                          setMinorDropdownOpen(false)
                        }}
                        className="dropdown-item"
                      >
                        {minor}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 추가 버튼 */}
              <button
                onClick={handleAdd}
                disabled={!selectedMajor}
                className="btn btn-primary btn-md"
                style={{
                  opacity: selectedMajor ? 1 : 0.5,
                  cursor: selectedMajor ? 'pointer' : 'not-allowed'
                }}
              >
                추가
              </button>
            </div>
          </div>

          {/* 선택 결과 */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <label style={{ 
                fontSize: '13px', 
                fontWeight: '500',
                color: 'hsl(var(--foreground))'
              }}>
                선택된 업종 ({selectedIndustries.length}개)
              </label>
              {selectedIndustries.length > 0 && (
                <button
                  onClick={() => onUpdate([])}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '12px' }}
                >
                  전체 해제
                </button>
              )}
            </div>
            
            <div style={{
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              minHeight: '200px',
              maxHeight: '300px',
              overflowY: 'auto',
              padding: '12px',
              backgroundColor: 'hsl(var(--muted) / 0.2)'
            }}>
              {selectedIndustries.length === 0 ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '176px',
                  fontSize: '13px',
                  color: 'hsl(var(--muted-foreground))'
                }}>
                  선택된 업종이 없습니다
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedIndustries.map((industry) => {
                    const parts = industry.split(' > ')
                    
                    return (
                      <div
                        key={industry}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          {parts.map((part, idx) => (
                            <span key={idx}>
                              {idx > 0 && (
                                <span style={{ 
                                  color: 'hsl(var(--muted-foreground))',
                                  margin: '0 4px'
                                }}>
                                  {'>'}
                                </span>
                              )}
                              <span style={{
                                color: idx === parts.length - 1 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                                fontWeight: part === '관공서및단체' ? '500' : (idx === parts.length - 1 ? '500' : '400')
                              }}>
                                {part}
                              </span>
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleRemove(industry)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'hsl(var(--muted-foreground))'
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dialog-footer">
          <button
            onClick={() => onUpdate([])}
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
            확인 ({selectedIndustries.length}개 선택)
          </button>
        </div>
      </div>
    </div>
  )
}
