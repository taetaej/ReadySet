import { useState } from 'react'
import { Plus, Minus, Smartphone, Info } from 'lucide-react'
import { boMediaData } from './constants'
import { BOProductEntry } from './BOCreateScenario'

interface BOMediaDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (products: BOProductEntry[]) => void
  currentProducts?: BOProductEntry[]
}

const MEDIA_LIST = Object.keys(boMediaData) as (keyof typeof boMediaData)[]

export function BOMediaDialog({ open, onClose, onConfirm, currentProducts = [] }: BOMediaDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<{ [mediaId: string]: string[] }>({})
  const [expandedMedia, setExpandedMedia] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // 다이얼로그 열릴 때 기존 선택 상태 복원
  if (open && !isInitialized) {
    const initial: { [mediaId: string]: string[] } = {}
    currentProducts.forEach(p => {
      if (!initial[p.mediaId]) initial[p.mediaId] = []
      initial[p.mediaId].push(p.productName)
    })
    setSelectedProducts(initial)
    setIsInitialized(true)
  }

  if (!open && isInitialized) {
    setIsInitialized(false)
  }

  if (!open) return null

  const handleConfirm = () => {
    const newProducts: BOProductEntry[] = []
    Object.entries(selectedProducts).forEach(([mediaId, products]) => {
      products.forEach(productName => {
        // 기존 고정 상태 유지
        const existing = currentProducts.find(p => p.mediaId === mediaId && p.productName === productName)
        newProducts.push(existing || { mediaId, productName, isFixed: false, fixedAmount: 0 })
      })
    })
    onConfirm(newProducts)
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

  // 총 선택 수
  const totalSelected = Object.values(selectedProducts).reduce((sum, products) => sum + products.length, 0)

  // 검색 필터
  const filterMediaBySearch = () => {
    return MEDIA_LIST.filter(mediaId => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      if (mediaId.toLowerCase().includes(query)) return true
      const products = boMediaData[mediaId] || []
      return products.some(p => p.toLowerCase().includes(query))
    })
  }

  // 전체 선택/해제
  const handleSelectAll = () => {
    const filtered = filterMediaBySearch()
    const allFilteredProducts: { [key: string]: string[] } = {}

    filtered.forEach(mediaId => {
      const products = boMediaData[mediaId] || []
      const filteredProducts = products.filter(p =>
        !searchQuery || p.toLowerCase().includes(searchQuery.toLowerCase()) || mediaId.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (filteredProducts.length > 0) {
        allFilteredProducts[mediaId] = filteredProducts
      }
    })

    const allKeys = Object.keys(allFilteredProducts)
    const allSelected = allKeys.every(key => {
      const filteredProducts = allFilteredProducts[key]
      return filteredProducts.every(p => selectedProducts[key]?.includes(p))
    })

    if (allSelected) {
      const newSelected = { ...selectedProducts }
      allKeys.forEach(key => {
        const filteredProducts = allFilteredProducts[key]
        if (newSelected[key]) {
          newSelected[key] = newSelected[key].filter(p => !filteredProducts.includes(p))
          if (newSelected[key].length === 0) delete newSelected[key]
        }
      })
      setSelectedProducts(newSelected)
    } else {
      const newSelected = { ...selectedProducts }
      Object.entries(allFilteredProducts).forEach(([key, filteredProducts]) => {
        const current = newSelected[key] || []
        newSelected[key] = [...new Set([...current, ...filteredProducts])]
      })
      setSelectedProducts(newSelected)
    }
  }

  return (
    <div className="dialog-overlay" onClick={handleCancel}>
      <div
        className="dialog-content dialog-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ height: '80vh', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">매체 및 상품 선택</h3>
          <p className="dialog-description">분석에 포함할 매체와 상품을 선택하세요</p>
          <div style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: 'hsl(var(--muted) / 0.5)',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'hsl(var(--muted-foreground))',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Info size={14} />
            <span>Step1에서 선택한 업종의 모델 학습 결과가 있는 광고상품만 표시됩니다.</span>
          </div>
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

          {/* 선택됨 카운트 + 전체 선택 */}
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
              onClick={handleSelectAll}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '11px' }}
            >
              검색 결과 전체 선택
            </button>
          </div>

          <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
            선택됨: {totalSelected}/{Object.values(boMediaData).flat().length}
          </div>

          {/* 매체 리스트 */}
          <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden' }}>
            {filterMediaBySearch().map(mediaId => {
              const products = boMediaData[mediaId] || []
              const key = mediaId as string
              const isExpanded = expandedMedia.includes(key)
              const selectedCount = selectedProducts[key]?.length || 0
              const filteredProducts = products.filter(p =>
                !searchQuery || p.toLowerCase().includes(searchQuery.toLowerCase()) || mediaId.toLowerCase().includes(searchQuery.toLowerCase())
              )

              return (
                <div key={mediaId} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                  {/* 매체 행 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      backgroundColor: 'hsl(var(--muted) / 0.2)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => {
                      if (isExpanded) setExpandedMedia(expandedMedia.filter(m => m !== key))
                      else setExpandedMedia([...expandedMedia, key])
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.4)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.2)' }}
                  >
                    <button
                      style={{
                        width: '24px', height: '24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid hsl(var(--border))', borderRadius: '4px',
                        backgroundColor: 'hsl(var(--background))', cursor: 'pointer', flexShrink: 0
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isExpanded) setExpandedMedia(expandedMedia.filter(m => m !== key))
                        else setExpandedMedia([...expandedMedia, key])
                      }}
                    >
                      {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                    </button>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{mediaId}</div>
                    <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', flexShrink: 0 }}>
                      {products.length}개 상품
                    </div>
                    {selectedCount > 0 && (
                      <div style={{
                        fontSize: '10px', padding: '2px 6px', borderRadius: '10px',
                        backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))',
                        fontWeight: '600', textAlign: 'center', flexShrink: 0
                      }}>
                        {selectedCount}
                      </div>
                    )}
                    <div style={{ flex: 1 }} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const allSelected = filteredProducts.length > 0 && filteredProducts.every(p => selectedProducts[key]?.includes(p))
                        if (allSelected) {
                          const newProducts = { ...selectedProducts }
                          delete newProducts[key]
                          setSelectedProducts(newProducts)
                        } else {
                          setSelectedProducts({ ...selectedProducts, [key]: [...filteredProducts] })
                        }
                      }}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '11px', flexShrink: 0, padding: '4px 8px' }}
                    >
                      {filteredProducts.length > 0 && filteredProducts.every(p => selectedProducts[key]?.includes(p)) ? '전체 해제' : '전체 선택'}
                    </button>
                  </div>

                  {/* 상품 목록 */}
                  {isExpanded && (
                    <div style={{
                      padding: '12px 12px 12px 52px',
                      backgroundColor: 'hsl(var(--background))',
                      borderTop: '1px solid hsl(var(--border))'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {filteredProducts.map(product => {
                          const isProductSelected = selectedProducts[key]?.includes(product) || false
                          return (
                            <label
                              key={product}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                cursor: 'pointer', padding: '8px 12px', borderRadius: '6px',
                                backgroundColor: isProductSelected ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => { if (!isProductSelected) e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.2)' }}
                              onMouseLeave={(e) => { if (!isProductSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
                            >
                              <input
                                type="checkbox"
                                checked={isProductSelected}
                                onChange={(e) => {
                                  const current = selectedProducts[key] || []
                                  if (e.target.checked) {
                                    setSelectedProducts({ ...selectedProducts, [key]: [...current, product] })
                                  } else {
                                    const newSelected = current.filter(p => p !== product)
                                    if (newSelected.length === 0) {
                                      const newProducts = { ...selectedProducts }
                                      delete newProducts[key]
                                      setSelectedProducts(newProducts)
                                    } else {
                                      setSelectedProducts({ ...selectedProducts, [key]: newSelected })
                                    }
                                  }
                                }}
                                className="checkbox-custom"
                              />
                              <span style={{
                                fontSize: '12px', flex: 1,
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

        <div className="dialog-footer">
          <button onClick={handleReset} className="btn btn-ghost btn-md" style={{ marginRight: 'auto' }}>
            초기화
          </button>
          <button onClick={handleCancel} className="btn btn-secondary btn-md">취소</button>
          <button
            onClick={handleConfirm}
            className="btn btn-primary btn-md"
            disabled={totalSelected < 2}
            style={{ opacity: totalSelected < 2 ? 0.5 : 1, cursor: totalSelected < 2 ? 'not-allowed' : 'pointer' }}
          >
            확인 ({totalSelected}개 선택)
          </button>
        </div>
      </div>
    </div>
  )
}
