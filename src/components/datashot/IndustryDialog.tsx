import { useState, useEffect, useRef } from 'react'
import { ChevronRight, X } from 'lucide-react'
import { industryCategories, brandIndustryMap } from './types'

interface IndustryDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedIndustries: string[]
  onUpdate: (industries: string[]) => void
}

export function IndustryDialog({ isOpen, onClose, selectedIndustries, onUpdate }: IndustryDialogProps) {
  const [brandSearchQuery, setBrandSearchQuery] = useState('')
  const [expandedMajor, setExpandedMajor] = useState<string[]>([])
  const [expandedMid, setExpandedMid] = useState<string[]>([])
  const [showBrandDropdown, setShowBrandDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowBrandDropdown(false)
      }
    }

    if (showBrandDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showBrandDropdown])

  if (!isOpen) return null

  // 브랜드 검색 필터링 (대소문자 구분 없이, 부분 일치)
  const filteredBrands = Object.entries(brandIndustryMap).filter(([brand]) => 
    brand.toLowerCase().includes(brandSearchQuery.toLowerCase())
  )

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div 
        className="dialog-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '900px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">업종 선택</h3>
          <p className="dialog-description">
            데이터 추출에 사용할 업종을 선택하세요
          </p>
        </div>
        
        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* 브랜드 검색 */}
          <div ref={searchRef} style={{ marginBottom: '16px', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={brandSearchQuery}
                onChange={(e) => {
                  setBrandSearchQuery(e.target.value)
                  setShowBrandDropdown(true)
                }}
                onFocus={() => setShowBrandDropdown(true)}
                placeholder="브랜드 업종 검색"
                className="input"
                style={{ width: '100%' }}
              />
              {brandSearchQuery && (
                <button
                  onClick={() => {
                    setBrandSearchQuery('')
                    setShowBrandDropdown(false)
                  }}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            {/* 브랜드 검색 드롭다운 */}
            {showBrandDropdown && brandSearchQuery && filteredBrands.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 10
              }}>
                {filteredBrands.map(([brand, industryPath]) => (
                  <div
                    key={brand}
                    onClick={() => {
                      if (!selectedIndustries.includes(industryPath)) {
                        onUpdate([...selectedIndustries, industryPath])
                      }
                      setBrandSearchQuery('')
                      setShowBrandDropdown(false)
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid hsl(var(--border))',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                      {brand}
                    </div>
                    <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                      {industryPath}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2단 레이아웃 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '340px 1px 1fr',
            gap: '0',
            height: '600px',
            overflow: 'hidden',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}>
            {/* 좌측: 트리 구조 선택 */}
            <div style={{ 
              overflowY: 'auto',
              backgroundColor: 'hsl(var(--background))',
              padding: '16px',
              minHeight: '600px',
              maxHeight: '600px'
            }}>
              <div style={{ 
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid hsl(var(--border))',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '600', fontSize: '13px' }}>
                  업종 분류
                </span>
                <button
                  onClick={() => {
                    // 전체 업종 선택/해제
                    const allIndustries: string[] = []
                    Object.entries(industryCategories).forEach(([major, mids]) => {
                      Object.entries(mids).forEach(([mid, minors]) => {
                        (minors as string[]).forEach(minor => {
                          allIndustries.push(`${major} > ${mid} > ${minor}`)
                        })
                      })
                    })
                    const allSelected = allIndustries.every(ind => selectedIndustries.includes(ind))
                    if (allSelected) {
                      onUpdate([])
                    } else {
                      onUpdate(allIndustries)
                    }
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '11px' }}
                >
                  전체 {selectedIndustries.length === Object.values(industryCategories).reduce((acc, mids) => 
                    acc + Object.values(mids).reduce((a, minors) => a + (minors as string[]).length, 0), 0
                  ) ? '해제' : '선택'}
                </button>
              </div>

              {/* 대분류 트리 */}
              {Object.entries(industryCategories).map(([major, mids]) => {
                const isMajorExpanded = expandedMajor.includes(major)
                const majorIndustries: string[] = []
                Object.entries(mids).forEach(([mid, minors]) => {
                  (minors as string[]).forEach(minor => {
                    majorIndustries.push(`${major} > ${mid} > ${minor}`)
                  })
                })
                const allMajorSelected = majorIndustries.every(ind => selectedIndustries.includes(ind))
                const someMajorSelected = majorIndustries.some(ind => selectedIndustries.includes(ind))

                return (
                  <div key={major} style={{ marginBottom: '4px' }}>
                    {/* 대분류 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      borderRadius: '6px',
                      backgroundColor: isMajorExpanded ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                      cursor: 'pointer'
                    }}>
                      <button
                        onClick={() => {
                          setExpandedMajor(prev => 
                            prev.includes(major) ? prev.filter(m => m !== major) : [...prev, major]
                          )
                        }}
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
                        <ChevronRight 
                          size={16} 
                          style={{ 
                            transform: isMajorExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }} 
                        />
                      </button>
                      <input
                        type="checkbox"
                        checked={allMajorSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someMajorSelected && !allMajorSelected
                        }}
                        onChange={() => {
                          if (allMajorSelected) {
                            onUpdate(selectedIndustries.filter(ind => !majorIndustries.includes(ind)))
                          } else {
                            onUpdate([...new Set([...selectedIndustries, ...majorIndustries])])
                          }
                        }}
                        className="checkbox-custom"
                        style={{ cursor: 'pointer' }}
                      />
                      <span 
                        style={{ 
                          fontSize: '13px', 
                          fontWeight: '600',
                          flex: 1,
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setExpandedMajor(prev => 
                            prev.includes(major) ? prev.filter(m => m !== major) : [...prev, major]
                          )
                        }}
                      >
                        {major}
                      </span>
                    </div>

                    {/* 중분류 */}
                    {isMajorExpanded && (
                      <div style={{ marginLeft: '24px' }}>
                        {Object.entries(mids).map(([mid, minors]) => {
                          const isMidExpanded = expandedMid.includes(`${major}>${mid}`)
                          const midIndustries = (minors as string[]).map(minor => `${major} > ${mid} > ${minor}`)
                          const allMidSelected = midIndustries.every(ind => selectedIndustries.includes(ind))
                          const someMidSelected = midIndustries.some(ind => selectedIndustries.includes(ind))

                          return (
                            <div key={mid} style={{ marginBottom: '4px' }}>
                              {/* 중분류 */}
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                backgroundColor: isMidExpanded ? 'hsl(var(--muted) / 0.3)' : 'transparent'
                              }}>
                                <button
                                  onClick={() => {
                                    const key = `${major}>${mid}`
                                    setExpandedMid(prev => 
                                      prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]
                                    )
                                  }}
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
                                  <ChevronRight 
                                    size={14} 
                                    style={{ 
                                      transform: isMidExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                      transition: 'transform 0.2s'
                                    }} 
                                  />
                                </button>
                                <input
                                  type="checkbox"
                                  checked={allMidSelected}
                                  ref={(el) => {
                                    if (el) el.indeterminate = someMidSelected && !allMidSelected
                                  }}
                                  onChange={() => {
                                    if (allMidSelected) {
                                      onUpdate(selectedIndustries.filter(ind => !midIndustries.includes(ind)))
                                    } else {
                                      onUpdate([...new Set([...selectedIndustries, ...midIndustries])])
                                    }
                                  }}
                                  className="checkbox-custom"
                                  style={{ cursor: 'pointer' }}
                                />
                                <span 
                                  style={{ 
                                    fontSize: '12px',
                                    flex: 1,
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => {
                                    const key = `${major}>${mid}`
                                    setExpandedMid(prev => 
                                      prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]
                                    )
                                  }}
                                >
                                  {mid}
                                </span>
                              </div>

                              {/* 소분류 */}
                              {isMidExpanded && (
                                <div style={{ marginLeft: '24px' }}>
                                  {(minors as string[]).map((minor) => {
                                    const fullPath = `${major} > ${mid} > ${minor}`
                                    const isSelected = selectedIndustries.includes(fullPath)

                                    return (
                                      <label
                                        key={minor}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          padding: '6px 8px',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                          backgroundColor: isSelected ? 'hsl(var(--primary) / 0.1)' : 'transparent'
                                        }}
                                      >
                                        <div style={{ width: '14px' }} /> {/* 들여쓰기 공간 */}
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() => {
                                            if (isSelected) {
                                              onUpdate(selectedIndustries.filter(ind => ind !== fullPath))
                                            } else {
                                              onUpdate([...selectedIndustries, fullPath])
                                            }
                                          }}
                                          className="checkbox-custom"
                                        />
                                        <span>{minor}</span>
                                      </label>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* 구분선 */}
            <div style={{ backgroundColor: 'hsl(var(--border))' }} />

            {/* 우측: 선택된 항목 */}
            <div style={{ 
              overflowY: 'auto',
              backgroundColor: 'hsl(var(--muted) / 0.2)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '600px',
              maxHeight: '600px'
            }}>
              <div style={{ 
                padding: '12px 16px',
                borderBottom: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--muted))',
                fontWeight: '600',
                fontSize: '12px',
                position: 'sticky',
                top: 0,
                zIndex: 1
              }}>
                선택된 업종 ({selectedIndustries.length})
              </div>
              
              <div style={{ flex: 1, padding: '8px' }}>
                {selectedIndustries.length === 0 ? (
                  <div style={{ 
                    padding: '32px 16px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: 'hsl(var(--muted-foreground))'
                  }}>
                    선택된 업종이 없습니다
                  </div>
                ) : (
                  selectedIndustries.map((industry) => {
                    const parts = industry.split(' > ')
                    return (
                      <div
                        key={industry}
                        style={{
                          padding: '10px 12px',
                          marginBottom: '6px',
                          fontSize: '12px',
                          borderRadius: '6px',
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '8px'
                        }}
                      >
                        <div style={{ flex: 1, lineHeight: '1.4' }}>
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
                                color: idx === parts.length - 1 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                              }}>
                                {part}
                              </span>
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            onUpdate(selectedIndustries.filter(ind => ind !== industry))
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'hsl(var(--muted-foreground))',
                            flexShrink: 0
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
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
            선택 완료 ({selectedIndustries.length}개)
          </button>
        </div>
      </div>
    </div>
  )
}
