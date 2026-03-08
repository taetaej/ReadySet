import { useState } from 'react'
import { ChevronRight, Search, X } from 'lucide-react'
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

  if (!isOpen) return null

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
          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ 
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(var(--muted-foreground))'
              }} />
              <input
                type="text"
                value={brandSearchQuery}
                onChange={(e) => setBrandSearchQuery(e.target.value)}
                placeholder="브랜드명으로 검색 (예: LG, 삼성, 다이슨)"
                className="input"
                style={{ paddingLeft: '40px', width: '100%' }}
              />
              {brandSearchQuery && (
                <button
                  onClick={() => setBrandSearchQuery('')}
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
            
            {/* 브랜드 검색 결과 */}
            {brandSearchQuery && brandIndustryMap[brandSearchQuery] && (
              <div style={{
                marginTop: '8px',
                padding: '12px 16px',
                backgroundColor: 'hsl(var(--primary) / 0.1)',
                border: '1px solid hsl(var(--primary))',
                borderRadius: '6px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: 'hsl(var(--primary))' }}>{brandSearchQuery}</strong>
                  <span style={{ color: 'hsl(var(--muted-foreground))', marginLeft: '8px' }}>→</span>
                  <span style={{ marginLeft: '8px' }}>{brandIndustryMap[brandSearchQuery]}</span>
                </div>
                <button
                  onClick={() => {
                    const industryPath = brandIndustryMap[brandSearchQuery]
                    if (!selectedIndustries.includes(industryPath)) {
                      onUpdate([...selectedIndustries, industryPath])
                    }
                    setBrandSearchQuery('')
                  }}
                  className="btn btn-primary btn-sm"
                >
                  추가
                </button>
              </div>
            )}
          </div>

          {/* 2단 레이아웃 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1px 380px',
            gap: '0',
            flex: 1,
            overflow: 'hidden',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}>
            {/* 좌측: 트리 구조 선택 */}
            <div style={{ 
              overflowY: 'auto',
              backgroundColor: 'hsl(var(--background))',
              padding: '16px'
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
              flexDirection: 'column'
            }}>
              <div style={{ 
                padding: '12px 16px',
                borderBottom: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--muted))',
                fontWeight: '600',
                fontSize: '12px',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>선택된 업종 ({selectedIndustries.length})</span>
                {selectedIndustries.length > 0 && (
                  <button
                    onClick={() => onUpdate([])}
                    style={{
                      fontSize: '10px',
                      padding: '4px 8px',
                      backgroundColor: 'hsl(var(--destructive))',
                      color: 'hsl(var(--destructive-foreground))',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    전체 삭제
                  </button>
                )}
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
                                fontWeight: idx === parts.length - 1 ? '600' : '400',
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
