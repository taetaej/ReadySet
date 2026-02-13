import { useState } from 'react'
import { Plus, Minus, Smartphone, Tv } from 'lucide-react'
import { mediaData, unlinkedMedia } from './constants'
import { ReachPredictorMedia } from './types'

interface ReachPredictorMediaDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (mediaItems: ReachPredictorMedia[]) => void
  currentMedia?: ReachPredictorMedia[]
}

export function ReachPredictorMediaDialog({ open, onClose, onConfirm, currentMedia = [] }: ReachPredictorMediaDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: string[]
  }>({})
  const [expandedMedia, setExpandedMedia] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // 다이얼로그가 열릴 때 기존 선택 상태 복원
  if (open && !isInitialized) {
    const initialSelected: { [key: string]: string[] } = {}
    
    currentMedia.forEach(media => {
      const key = `${media.category}_${media.mediaName}`
      if (media.type === 'unlinked') {
        initialSelected[key] = ['default']
      } else if (media.productName) {
        if (!initialSelected[key]) {
          initialSelected[key] = []
        }
        initialSelected[key].push(media.productName)
      }
    })
    
    setSelectedProducts(initialSelected)
    setIsInitialized(true)
  }
  
  // 다이얼로그가 닫힐 때 초기화 플래그 리셋
  if (!open && isInitialized) {
    setIsInitialized(false)
  }

  if (!open) return null

  const handleConfirm = () => {
    const newMediaItems: ReachPredictorMedia[] = []
    
    Object.entries(selectedProducts).forEach(([key, products]) => {
      const [category, ...mediaNameParts] = key.split('_')
      const mediaName = mediaNameParts.join('_')
      const categoryTyped = category as 'DIGITAL' | 'TVC'
      
      if (products.includes('default')) {
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
  }

  const handleCancel = () => {
    onClose()
    setSearchQuery('')
  }
  
  const handleReset = () => {
    setSelectedProducts({})
    setExpandedMedia([])
    setSearchQuery('')
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
    
    // 검색 결과에 해당하는 모든 상품 수집
    const allFilteredProducts: { [key: string]: string[] } = {}
    filtered.forEach(([mediaName, products]) => {
      const key = `${category === 'DIGITAL' ? 'DIGITAL' : 'TVC'}_${mediaName}`
      const filteredProducts = (products as string[]).filter(p => 
        !searchQuery || p.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (filteredProducts.length > 0) {
        allFilteredProducts[key] = filteredProducts
      }
    })
    
    // 모든 필터링된 상품이 선택되어 있는지 확인
    const allKeys = Object.keys(allFilteredProducts)
    const allSelected = allKeys.every(key => {
      const filteredProducts = allFilteredProducts[key]
      return filteredProducts.every(p => selectedProducts[key]?.includes(p))
    })

    if (allSelected) {
      // 전체 해제
      const newSelected = { ...selectedProducts }
      allKeys.forEach(key => {
        const filteredProducts = allFilteredProducts[key]
        if (newSelected[key]) {
          newSelected[key] = newSelected[key].filter(p => !filteredProducts.includes(p))
          if (newSelected[key].length === 0) {
            delete newSelected[key]
          }
        }
      })
      setSelectedProducts(newSelected)
    } else {
      // 전체 선택
      const newSelected = { ...selectedProducts }
      Object.entries(allFilteredProducts).forEach(([key, filteredProducts]) => {
        const currentSelected = newSelected[key] || []
        newSelected[key] = [...new Set([...currentSelected, ...filteredProducts])]
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
          width: '1200px', 
          height: '80vh',
          maxWidth: '95vw', 
          maxHeight: '90vh', 
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
          
          {/* TVC 섹션 */}
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
                      <div style={{ 
                        padding: '12px 12px 12px 52px', 
                        backgroundColor: 'hsl(var(--background))',
                        borderTop: '1px solid hsl(var(--border))'
                      }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          {filteredProducts.map((product) => {
                            const isProductSelected = selectedProducts[key]?.includes(product) || false
                            return (
                              <label
                                key={product}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  cursor: 'pointer',
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  backgroundColor: isProductSelected ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isProductSelected) {
                                    e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.2)'
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isProductSelected) {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                  }
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isProductSelected}
                                  onChange={(e) => {
                                    const currentSelected = selectedProducts[key] || []
                                    if (e.target.checked) {
                                      setSelectedProducts({
                                        ...selectedProducts,
                                        [key]: [...currentSelected, product]
                                      })
                                    } else {
                                      const newSelected = currentSelected.filter(p => p !== product)
                                      if (newSelected.length === 0) {
                                        const newProducts = { ...selectedProducts }
                                        delete newProducts[key]
                                        setSelectedProducts(newProducts)
                                      } else {
                                        setSelectedProducts({
                                          ...selectedProducts,
                                          [key]: newSelected
                                        })
                                      }
                                    }
                                  }}
                                  className="checkbox-custom"
                                />
                                <span style={{ 
                                  fontSize: '12px', 
                                  flex: 1,
                                  color: isProductSelected ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                                }}>
                                  {product}
                                </span>
                              </label>
                            )
                          })}
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
                <Smartphone size={18} style={{ color: 'hsl(var(--primary))' }} />
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
                      <div style={{ 
                        padding: '12px 12px 12px 52px', 
                        backgroundColor: 'hsl(var(--background))',
                        borderTop: '1px solid hsl(var(--border))'
                      }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          {filteredProducts.map((product) => {
                            const isProductSelected = selectedProducts[key]?.includes(product) || false
                            return (
                              <label
                                key={product}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  cursor: 'pointer',
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  backgroundColor: isProductSelected ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isProductSelected) {
                                    e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.2)'
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isProductSelected) {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                  }
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isProductSelected}
                                  onChange={(e) => {
                                    const currentSelected = selectedProducts[key] || []
                                    if (e.target.checked) {
                                      setSelectedProducts({
                                        ...selectedProducts,
                                        [key]: [...currentSelected, product]
                                      })
                                    } else {
                                      const newSelected = currentSelected.filter(p => p !== product)
                                      if (newSelected.length === 0) {
                                        const newProducts = { ...selectedProducts }
                                        delete newProducts[key]
                                        setSelectedProducts(newProducts)
                                      } else {
                                        setSelectedProducts({
                                          ...selectedProducts,
                                          [key]: newSelected
                                        })
                                      }
                                    }
                                  }}
                                  className="checkbox-custom"
                                />
                                <span style={{ 
                                  fontSize: '12px', 
                                  flex: 1,
                                  color: isProductSelected ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                                }}>
                                  {product}
                                </span>
                              </label>
                            )
                          })}
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
                      gridTemplateColumns: '40px 1fr 40px',
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
            onClick={handleReset}
            className="btn btn-ghost btn-md"
            style={{ marginRight: 'auto' }}
          >
            초기화
          </button>
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
