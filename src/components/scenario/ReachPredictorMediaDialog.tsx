import { useState } from 'react'
import { Plus, Minus, Monitor, Tv } from 'lucide-react'
import { mediaData, unlinkedMedia } from './constants'
import { ReachPredictorMedia } from './types'

interface ReachPredictorMediaDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (mediaItems: ReachPredictorMedia[]) => void
}

export function ReachPredictorMediaDialog({ open, onClose, onConfirm }: ReachPredictorMediaDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: string[] // mediaName: [productNames]
  }>({})
  const [expandedMedia, setExpandedMedia] = useState<string[]>([])

  if (!open) return null

  const handleConfirm = () => {
    const newMediaItems: ReachPredictorMedia[] = []
    
    Object.entries(selectedProducts).forEach(([key, products]) => {
      const [category, ...mediaNameParts] = key.split('_')
      const mediaName = mediaNameParts.join('_')
      const categoryTyped = category as 'DIGITAL' | 'TVC'
      
      if (products.includes('default')) {
        // 미연동 매체 (상품 없음)
        newMediaItems.push({
          id: `unlinked_${Date.now()}_${Math.random()}`,
          category: categoryTyped,
          type: 'unlinked',
          mediaName,
          budget: '',
          impressions: '',
          cpm: ''
        })
      } else {
        // 연동 매체 (상품 있음)
        products.forEach(product => {
          newMediaItems.push({
            id: `linked_${Date.now()}_${Math.random()}`,
            category: categoryTyped,
            type: 'linked',
            mediaName,
            productName: product,
            budget: '',
            impressions: '',
            cpm: ''
          })
        })
      }
    })
    
    onConfirm(newMediaItems)
    setSearchQuery('')
    setSelectedProducts({})
    setExpandedMedia([])
  }

  const handleCancel = () => {
    onClose()
    setSearchQuery('')
    setSelectedProducts({})
    setExpandedMedia([])
  }

  const totalSelected = Object.values(selectedProducts).flat().filter(p => p !== 'default').length

  // 검색 필터링
  const filterMediaBySearch = (category: 'DIGITAL' | 'TV') => {
    const data = category === 'DIGITAL' ? mediaData.DIGITAL : mediaData.TV
    return Object.entries(data).filter(([mediaName, products]) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      const mediaMatch = mediaName.toLowerCase().includes(query)
      const productMatch = (products as string[]).some(p => p.toLowerCase().includes(query))
      return mediaMatch || productMatch
    })
  }

  const filterUnlinkedBySearch = () => {
    return unlinkedMedia.filter(mediaName => 
      !searchQuery || mediaName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // 전체 선택/해제
  const handleSelectAll = (category: 'DIGITAL' | 'TV') => {
    const filtered = filterMediaBySearch(category)
    const data = category === 'DIGITAL' ? mediaData.DIGITAL : mediaData.TV
    const allKeys = filtered.map(([mediaName]) => `${category === 'DIGITAL' ? 'DIGITAL' : 'TVC'}_${mediaName}`)
    
    const allSelected = allKeys.every(key => {
      const mediaName = key.split('_').slice(1).join('_')
      const products = data[mediaName as keyof typeof data] as string[]
      return products.every(p => selectedProducts[key]?.includes(p))
    })

    if (allSelected) {
      // 전체 해제
      const newSelected = { ...selectedProducts }
      allKeys.forEach(key => delete newSelected[key])
      setSelectedProducts(newSelected)
    } else {
      // 전체 선택
      const newSelected = { ...selectedProducts }
      filtered.forEach(([mediaName, products]) => {
        const key = `${category === 'DIGITAL' ? 'DIGITAL' : 'TVC'}_${mediaName}`
        newSelected[key] = products as string[]
      })
      setSelectedProducts(newSelected)
    }
  }

  return (
    <div className="dialog-overlay" onClick={handleCancel}>
      <div 
        className="dialog-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          width: '1000px', 
          height: '700px',
          maxWidth: '90vw', 
          maxHeight: '85vh', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">매체 및 상품 선택</h3>
          <p className="dialog-description">
            분석에 포함할 매체와 상품을 선택하세요
          </p>
        </div>
        
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* 검색 */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="매체 또는 상품 검색..."
            className="input"
            style={{ width: '100%', marginBottom: '20px' }}
          />
          
          {/* TVC 섹션 (상단 배치) */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: '2px solid hsl(var(--border))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tv size={18} style={{ color: 'hsl(var(--accent-foreground))' }} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>TVC</span>
              </div>
              <button
                onClick={() => handleSelectAll('TV')}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px' }}
              >
                검색 결과 전체 선택
              </button>
            </div>
            
            {/* TVC 테이블 */}
            <div style={{
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {filterMediaBySearch('TV').map(([mediaName, products]) => {
                const key = `TVC_${mediaName}`
                const isExpanded = expandedMedia.includes(key)
                const selectedCount = selectedProducts[key]?.length || 0
                const filteredProducts = (products as string[]).filter(p => 
                  !searchQuery || p.toLowerCase().includes(searchQuery.toLowerCase())
                )
                
                return (
                  <div key={mediaName} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                    {/* 매체 행 */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr 100px 40px',
                      alignItems: 'center',
                      padding: '10px 12px',
                      backgroundColor: 'hsl(var(--muted) / 0.2)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => {
                      if (isExpanded) {
                        setExpandedMedia(expandedMedia.filter(m => m !== key))
                      } else {
                        setExpandedMedia([...expandedMedia, key])
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.2)'
                    }}
                    >
                      <button
                        style={{
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '4px',
                          backgroundColor: 'hsl(var(--background))',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isExpanded) {
                            setExpandedMedia(expandedMedia.filter(m => m !== key))
                          } else {
                            setExpandedMedia([...expandedMedia, key])
                          }
                        }}
                      >
                        {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                      </button>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>
                        {mediaName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                        {(products as string[]).length}개 상품
                      </div>
                      {selectedCount > 0 && (
                        <div style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          backgroundColor: 'hsl(var(--primary))',
                          color: 'hsl(var(--primary-foreground))',
                          fontWeight: '600',
                          textAlign: 'center'
                        }}>
                          {selectedCount}
                        </div>
                      )}
                    </div>
                    
                    {/* 상품 목록 */}
                    {isExpanded && (
                      <div style={{ padding: '12px', backgroundColor: 'hsl(var(--background))' }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '8px'
                        }}>
                          {filteredProducts.map((product) => (
                            <label
                              key={product}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: `1px solid ${
                                  selectedProducts[key]?.includes(product)
                                    ? 'hsl(var(--primary))' 
                                    : 'hsl(var(--border))'
                                }`,
                                backgroundColor: selectedProducts[key]?.includes(product)
                                  ? 'hsl(var(--primary) / 0.1)' 
                                  : 'transparent',
                                transition: 'all 0.2s'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedProducts[key]?.includes(product) || false}
                                onChange={(e) => {
                                  const currentSelected = selectedProducts[key] || []
                                  if (e.target.checked) {
                                    setSelectedProducts({
                                      ...selectedProducts,
                                      [key]: [...currentSelected, product]
                                    })
                                  } else {
                                    setSelectedProducts({
                                      ...selectedProducts,
                                      [key]: currentSelected.filter(p => p !== product)
                                    })
                                  }
                                }}
                                className="checkbox-custom"
                              />
                              <span style={{ fontSize: '12px', flex: 1 }}>{product}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* DIGITAL 섹션 */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: '2px solid hsl(var(--border))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Monitor size={18} style={{ color: 'hsl(var(--primary))' }} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>DIGITAL</span>
              </div>
              <button
                onClick={() => handleSelectAll('DIGITAL')}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px' }}
              >
                검색 결과 전체 선택
              </button>
            </div>
            
            {/* DIGITAL 테이블 */}
            <div style={{
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {/* 연동 매체 */}
              {filterMediaBySearch('DIGITAL').map(([mediaName, products]) => {
                const key = `DIGITAL_${mediaName}`
                const isExpanded = expandedMedia.includes(key)
                const selectedCount = selectedProducts[key]?.length || 0
                const filteredProducts = (products as string[]).filter(p => 
                  !searchQuery || p.toLowerCase().includes(searchQuery.toLowerCase())
                )
                
                return (
                  <div key={mediaName} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                    {/* 매체 행 */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr 100px 40px',
                      alignItems: 'center',
                      padding: '10px 12px',
                      backgroundColor: 'hsl(var(--muted) / 0.2)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => {
                      if (isExpanded) {
                        setExpandedMedia(expandedMedia.filter(m => m !== key))
                      } else {
                        setExpandedMedia([...expandedMedia, key])
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.2)'
                    }}
                    >
                      <button
                        style={{
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '4px',
                          backgroundColor: 'hsl(var(--background))',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isExpanded) {
                            setExpandedMedia(expandedMedia.filter(m => m !== key))
                          } else {
                            setExpandedMedia([...expandedMedia, key])
                          }
                        }}
                      >
                        {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                      </button>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>
                        {mediaName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                        {(products as string[]).length}개 상품
                      </div>
                      {selectedCount > 0 && (
                        <div style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          backgroundColor: 'hsl(var(--primary))',
                          color: 'hsl(var(--primary-foreground))',
                          fontWeight: '600',
                          textAlign: 'center'
                        }}>
                          {selectedCount}
                        </div>
                      )}
                    </div>
                    
                    {/* 상품 목록 */}
                    {isExpanded && (
                      <div style={{ padding: '12px', backgroundColor: 'hsl(var(--background))' }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '8px'
                        }}>
                          {filteredProducts.map((product) => (
                            <label
                              key={product}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: `1px solid ${
                                  selectedProducts[key]?.includes(product)
                                    ? 'hsl(var(--primary))' 
                                    : 'hsl(var(--border))'
                                }`,
                                backgroundColor: selectedProducts[key]?.includes(product)
                                  ? 'hsl(var(--primary) / 0.1)' 
                                  : 'transparent',
                                transition: 'all 0.2s'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedProducts[key]?.includes(product) || false}
                                onChange={(e) => {
                                  const currentSelected = selectedProducts[key] || []
                                  if (e.target.checked) {
                                    setSelectedProducts({
                                      ...selectedProducts,
                                      [key]: [...currentSelected, product]
                                    })
                                  } else {
                                    setSelectedProducts({
                                      ...selectedProducts,
                                      [key]: currentSelected.filter(p => p !== product)
                                    })
                                  }
                                }}
                                className="checkbox-custom"
                              />
                              <span style={{ fontSize: '12px', flex: 1 }}>{product}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              
              {/* 미연동 매체 */}
              {filterUnlinkedBySearch().map((mediaName) => {
                const key = `DIGITAL_${mediaName}`
                const isSelected = selectedProducts[key]?.length > 0
                
                return (
                  <div key={mediaName} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                    <label style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr 100px 40px',
                      alignItems: 'center',
                      padding: '10px 12px',
                      backgroundColor: 'hsl(var(--muted) / 0.2)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.2)'
                    }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts({
                              ...selectedProducts,
                              [key]: ['default']
                            })
                          } else {
                            const newSelected = { ...selectedProducts }
                            delete newSelected[key]
                            setSelectedProducts(newSelected)
                          }
                        }}
                        className="checkbox-custom"
                        style={{ marginLeft: '8px' }}
                      />
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>
                        {mediaName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                        미연동
                      </div>
                      <div></div>
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="dialog-footer">
          <button
            onClick={handleCancel}
            className="btn btn-secondary btn-md"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="btn btn-primary btn-md"
            disabled={Object.keys(selectedProducts).length === 0}
            style={{
              opacity: Object.keys(selectedProducts).length === 0 ? 0.5 : 1,
              cursor: Object.keys(selectedProducts).length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            확인 ({totalSelected}개 선택)
          </button>
        </div>
      </div>
    </div>
  )
}
