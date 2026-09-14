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
        className="dialog-content dialog-xl flex flex-col overflow-hidden h-[80vh] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">매체 및 상품 선택</h3>
          <p className="dialog-description">분석에 포함할 매체와 상품을 선택하세요</p>
          <div className="flex items-center gap-2 mt-3 p-3 rounded-md text-xs bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]">
            <Info size={14} />
            <span>Step1에서 선택한 업종의 모델 학습 결과가 있는 광고상품만 표시됩니다.</span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          {/* 검색 */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="매체 또는 상품 검색..."
            className="input w-full mb-5"
          />

          {/* 선택됨 카운트 + 전체 선택 */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-[hsl(var(--border))]">
            <div className="flex items-center gap-2">
              <Smartphone size={18} className="text-[hsl(var(--primary))]" />
              <span className="text-sm font-semibold">DIGITAL</span>
            </div>
            <button
              onClick={handleSelectAll}
              className="btn btn-ghost btn-sm text-[11px]"
            >
              검색 결과 전체 선택
            </button>
          </div>

          <div className="text-xs mb-3 text-[hsl(var(--muted-foreground))]">
            선택됨: {totalSelected}/{Object.values(boMediaData).flat().length}
          </div>

          {/* 매체 리스트 */}
          <div className="rounded-lg overflow-hidden border border-[hsl(var(--border))]">
            {filterMediaBySearch().map(mediaId => {
              const products = boMediaData[mediaId] || []
              const key = mediaId as string
              const isExpanded = expandedMedia.includes(key)
              const selectedCount = selectedProducts[key]?.length || 0
              const filteredProducts = products.filter(p =>
                !searchQuery || p.toLowerCase().includes(searchQuery.toLowerCase()) || mediaId.toLowerCase().includes(searchQuery.toLowerCase())
              )

              return (
                <div key={mediaId} className="border-b border-[hsl(var(--border))]">
                  {/* 매체 행 */}
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors bg-[hsl(var(--muted)/0.2)] hover:bg-[hsl(var(--muted)/0.4)]"
                    onClick={() => {
                      if (isExpanded) setExpandedMedia(expandedMedia.filter(m => m !== key))
                      else setExpandedMedia([...expandedMedia, key])
                    }}
                  >
                    <button
                      className="flex items-center justify-center w-6 h-6 shrink-0 rounded cursor-pointer border border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isExpanded) setExpandedMedia(expandedMedia.filter(m => m !== key))
                        else setExpandedMedia([...expandedMedia, key])
                      }}
                    >
                      {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                    </button>
                    <div className="text-[13px] font-medium">{mediaId}</div>
                    <div className="text-[11px] shrink-0 text-[hsl(var(--muted-foreground))]">
                      {products.length}개 상품
                    </div>
                    {selectedCount > 0 && (
                      <div className="text-[10px] px-1.5 py-0.5 rounded-[10px] font-semibold text-center shrink-0 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
                        {selectedCount}
                      </div>
                    )}
                    <div className="flex-1" />
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
                      className="btn btn-ghost btn-sm text-[11px] shrink-0 px-2 py-1"
                    >
                      {filteredProducts.length > 0 && filteredProducts.every(p => selectedProducts[key]?.includes(p)) ? '전체 해제' : '전체 선택'}
                    </button>
                  </div>

                  {/* 상품 목록 */}
                  {isExpanded && (
                    <div className="pl-[52px] pr-3 py-3 bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
                      <div className="flex flex-col gap-1.5">
                        {filteredProducts.map(product => {
                          const isProductSelected = selectedProducts[key]?.includes(product) || false
                          return (
                            <label
                              key={product}
                              className={`flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-md transition-colors ${isProductSelected ? 'bg-[hsl(var(--muted)/0.5)]' : 'bg-transparent hover:bg-[hsl(var(--muted)/0.2)]'}`}
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
                              <span
                                className="text-xs flex-1"
                                style={{ color: isProductSelected ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
                              >
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
          <button onClick={handleReset} className="btn btn-ghost btn-md mr-auto">
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
