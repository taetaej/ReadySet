import { X, Smartphone, Tv } from 'lucide-react'
import { type ScenarioFormData, mediaData, numberToKorean } from './index'

interface ScenarioStep2RatioFinderProps {
  formData: ScenarioFormData
  setFormData: (data: ScenarioFormData) => void
  validationActive: boolean
  selectedMedia: string[]
  setSelectedMedia: (media: string[]) => void
  expandedMedia: string[]
  setExpandedMedia: (media: string[]) => void
  mediaRatios: { [key: string]: number }
  setMediaRatios: (ratios: { [key: string]: number }) => void
  productRatios: { [mediaKey: string]: { [productKey: string]: number } }
  setProductRatios: (ratios: { [mediaKey: string]: { [productKey: string]: number } }) => void
  selectedMediaCategory: 'DIGITAL' | 'TV'
  setSelectedMediaCategory: (category: 'DIGITAL' | 'TV') => void
  productSelectionDialog: { open: boolean; mediaName: string; selectedProducts: string[] }
  setProductSelectionDialog: (dialog: { open: boolean; mediaName: string; selectedProducts: string[] }) => void
  productSearchQuery: string
  setProductSearchQuery: (query: string) => void
}

export function ScenarioStep2RatioFinder(props: ScenarioStep2RatioFinderProps) {
  const {
    formData,
    setFormData,
    validationActive,
    selectedMedia,
    setSelectedMedia,
    expandedMedia,
    setExpandedMedia,
    mediaRatios,
    setMediaRatios,
    productRatios,
    setProductRatios,
    selectedMediaCategory,
    setSelectedMediaCategory,
    productSelectionDialog,
    setProductSelectionDialog,
    productSearchQuery,
    setProductSearchQuery
  } = props

  // 키보드 네비게이션 핸들러
  const handleRatioKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const inputs = Array.from(document.querySelectorAll('input[data-ratio-input]')) as HTMLInputElement[]
      const currentIndex = inputs.indexOf(e.currentTarget)
      
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        inputs[currentIndex - 1]?.focus()
      } else if (e.key === 'ArrowDown' && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1]?.focus()
      }
    }
  }

  // 매체 비중 합계 검증
  const getMediaRatioValidation = () => {
    const total = Object.values(mediaRatios).reduce((sum, ratio) => sum + ratio, 0)
    const isValid = total === 100
    return {
      total,
      isValid,
      message: isValid ? '✓ 비중 합계가 정확합니다' : `비중 합계가 ${total}%입니다. 100%로 맞춰주세요.`
    }
  }

  // 상품 비중 합계 검증
  const getProductRatioValidation = (mediaKey: string) => {
    const total = Object.values(productRatios[mediaKey] || {}).reduce((sum, val) => sum + val, 0)
    const isValid = total === 100
    return {
      total,
      isValid,
      message: isValid ? '✓ 비중 합계가 정확합니다' : `비중 합계가 ${total}%입니다. 100%로 맞춰주세요.`
    }
  }

  const mediaValidation = getMediaRatioValidation()

  return (
    <div style={{ width: '800px' }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '24px'
      }}>
        상세 설정 - Ratio Finder
      </h2>
      
      {/* 총 예산 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          총 예산 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '200px auto 1fr', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            value={formData.totalBudget ? formData.totalBudget.toLocaleString('ko-KR') : ''}
            onChange={(e) => {
              const value = e.target.value.replace(/,/g, '')
              if (value === '' || /^\d+$/.test(value)) {
                setFormData({ ...formData, totalBudget: value === '' ? undefined : parseInt(value) })
              }
            }}
            placeholder="예산을 입력하세요"
            className="input"
            style={{ 
              width: '100%',
              borderColor: validationActive && (!formData.totalBudget || formData.totalBudget <= 0) ? 'hsl(var(--destructive))' : undefined
            }}
          />
          <span style={{ 
            fontSize: '14px', 
            color: 'hsl(var(--muted-foreground))',
            whiteSpace: 'nowrap'
          }}>
            원
          </span>
          {formData.totalBudget && formData.totalBudget > 0 && (
            <span style={{
              fontSize: '14px',
              color: 'hsl(var(--foreground))',
              fontWeight: '500'
            }}>
              = {numberToKorean(formData.totalBudget)}
            </span>
          )}
        </div>
        {validationActive && (!formData.totalBudget || formData.totalBudget <= 0) && (
          <div style={{
            fontSize: '11px',
            color: 'hsl(var(--destructive))',
            marginTop: '4px'
          }}>
            총 예산을 입력해주세요.
          </div>
        )}
      </div>

      {/* 시뮬레이션 단위 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          시뮬레이션 단위 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <div style={{
          fontSize: '12px',
          color: 'hsl(var(--muted-foreground))',
          marginBottom: '12px'
        }}>
          매체 간 예산 비중을 변화시키며 최적 배분을 탐색하는 단위입니다. 작은 값은 세밀한 결과를, 큰 값은 빠르고 간결한 결과를 제공합니다.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {(['5%', '10%', '20%'] as const).map((unit) => (
            <button
              key={unit}
              onClick={() => setFormData({ ...formData, simulationUnit: unit })}
              className="btn btn-ghost"
              style={{
                height: '48px',
                border: `1px solid ${
                  formData.simulationUnit === unit 
                    ? 'hsl(var(--primary))' 
                    : validationActive && !formData.simulationUnit
                    ? 'hsl(var(--destructive))'
                    : 'hsl(var(--border))'
                }`,
                backgroundColor: formData.simulationUnit === unit ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                fontWeight: formData.simulationUnit === unit ? '600' : '500',
                transition: 'all 0.2s'
              }}
            >
              {unit}
            </button>
          ))}
        </div>
        {validationActive && !formData.simulationUnit && (
          <div style={{
            fontSize: '11px',
            color: 'hsl(var(--destructive))',
            marginTop: '8px'
          }}>
            시뮬레이션 단위를 선택해주세요.
          </div>
        )}
      </div>

      {/* 매체별 예산 배분 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          매체별 예산 배분 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <div style={{
          fontSize: '12px',
          color: 'hsl(var(--muted-foreground))',
          marginBottom: '12px'
        }}>
          각 계층별 비중의 합은 100%로 맞춰주세요.
        </div>
        
        <div style={{
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* 카테고리 탭 (DIGITAL / TVC) */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--muted) / 0.3)'
          }}>
            <button
              onClick={() => setSelectedMediaCategory('DIGITAL')}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '13px',
                fontWeight: '600',
                border: 'none',
                backgroundColor: selectedMediaCategory === 'DIGITAL' ? 'hsl(var(--background))' : 'transparent',
                color: selectedMediaCategory === 'DIGITAL' ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                cursor: 'pointer',
                borderBottom: selectedMediaCategory === 'DIGITAL' ? '2px solid hsl(var(--foreground))' : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Smartphone size={16} />
              DIGITAL
            </button>
            <button
              onClick={() => setSelectedMediaCategory('TV')}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '13px',
                fontWeight: '600',
                border: 'none',
                backgroundColor: selectedMediaCategory === 'TV' ? 'hsl(var(--background))' : 'transparent',
                color: selectedMediaCategory === 'TV' ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                cursor: 'pointer',
                borderBottom: selectedMediaCategory === 'TV' ? '2px solid hsl(var(--foreground))' : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Tv size={16} />
              TVC
            </button>
          </div>

          {/* 매체 목록 */}
          <div style={{ padding: '16px' }}>
            {Object.keys(mediaData[selectedMediaCategory]).map((mediaName, mediaIndex) => {
              const mediaKey = `${selectedMediaCategory}_${mediaName}`
              const isSelected = selectedMedia.includes(mediaKey)
              const isExpanded = expandedMedia.includes(mediaKey)
              const products = mediaData[selectedMediaCategory][mediaName as keyof typeof mediaData[typeof selectedMediaCategory]]
              const selectedProducts = productRatios[mediaKey] ? Object.keys(productRatios[mediaKey]) : []
              const productValidation = isSelected && selectedProducts.length > 0 ? getProductRatioValidation(mediaKey) : null
              
              return (
                <div key={mediaKey} style={{ marginBottom: '12px' }}>
                  {/* 매체 행 */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr 120px 40px',
                    gap: '12px',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: isSelected ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                    borderRadius: '6px',
                    border: `1px solid ${isSelected ? 'hsl(var(--border))' : 'transparent'}`
                  }}>
                    {/* 체크박스 */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMedia([...selectedMedia, mediaKey])
                        } else {
                          setSelectedMedia(selectedMedia.filter(m => m !== mediaKey))
                          setExpandedMedia(expandedMedia.filter(m => m !== mediaKey))
                          const newMediaRatios = { ...mediaRatios }
                          delete newMediaRatios[mediaKey]
                          setMediaRatios(newMediaRatios)
                          const newProductRatios = { ...productRatios }
                          delete newProductRatios[mediaKey]
                          setProductRatios(newProductRatios)
                        }
                      }}
                      className="checkbox-custom"
                    />
                    
                    {/* 매체명 */}
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: isSelected ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                    }}>
                      {mediaName}
                      {isSelected && selectedProducts.length > 0 && (
                        <span style={{
                          marginLeft: '8px',
                          fontSize: '11px',
                          color: 'hsl(var(--muted-foreground))'
                        }}>
                          ({selectedProducts.length}개 선택)
                        </span>
                      )}
                    </div>
                    
                    {/* 비중 입력 */}
                    {isSelected && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          type="number"
                          value={mediaRatios[mediaKey] || ''}
                          onChange={(e) => {
                            const value = e.target.value === '' ? 0 : parseInt(e.target.value)
                            if (value >= 0 && value <= 100) {
                              setMediaRatios({ ...mediaRatios, [mediaKey]: value })
                            }
                          }}
                          onKeyDown={handleRatioKeyDown}
                          placeholder="0"
                          className="input"
                          data-ratio-input
                          style={{
                            width: '80px',
                            textAlign: 'right',
                            padding: '6px 8px',
                            fontSize: '13px'
                          }}
                          min="0"
                          max="100"
                          step="1"
                        />
                        <span style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>%</span>
                      </div>
                    )}
                    
                    {/* 상품 선택 버튼 */}
                    {isSelected && (
                      <button
                        onClick={() => {
                          setProductSelectionDialog({
                            open: true,
                            mediaName: mediaKey,
                            selectedProducts: selectedProducts
                          })
                          setProductSearchQuery('')
                        }}
                        className="btn btn-ghost btn-sm"
                        style={{
                          fontSize: '11px',
                          padding: '4px 8px',
                          height: 'auto'
                        }}
                      >
                        선택
                      </button>
                    )}
                  </div>
                  
                  {/* 선택된 상품 목록 */}
                  {isSelected && selectedProducts.length > 0 && (
                    <div style={{
                      marginTop: '8px',
                      marginLeft: '40px',
                      padding: '12px',
                      backgroundColor: 'hsl(var(--muted) / 0.3)',
                      borderRadius: '6px',
                      border: `1px solid ${productValidation?.isValid ? 'hsl(var(--border))' : 'hsl(var(--destructive))'}`
                    }}>
                      {selectedProducts.map((product, productIndex) => (
                        <div key={product} style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 120px 24px',
                          gap: '8px',
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom: productIndex < selectedProducts.length - 1 ? '1px solid hsl(var(--border))' : 'none'
                        }}>
                          <div style={{
                            fontSize: '12px',
                            color: 'hsl(var(--foreground))'
                          }}>
                            {product}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="number"
                              value={productRatios[mediaKey]?.[product] || ''}
                              onChange={(e) => {
                                const value = e.target.value === '' ? 0 : parseInt(e.target.value)
                                if (value >= 0 && value <= 100) {
                                  setProductRatios({
                                    ...productRatios,
                                    [mediaKey]: {
                                      ...productRatios[mediaKey],
                                      [product]: value
                                    }
                                  })
                                }
                              }}
                              onKeyDown={handleRatioKeyDown}
                              placeholder="0"
                              className="input"
                              data-ratio-input
                              style={{
                                width: '80px',
                                textAlign: 'right',
                                padding: '4px 6px',
                                fontSize: '12px'
                              }}
                              min="0"
                              max="100"
                              step="1"
                            />
                            <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>%</span>
                          </div>
                          <button
                            onClick={() => {
                              const newProductRatios = { ...productRatios }
                              const { [product]: removed, ...rest } = newProductRatios[mediaKey]
                              newProductRatios[mediaKey] = rest
                              setProductRatios(newProductRatios)
                            }}
                            style={{
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: 'hsl(var(--muted-foreground))',
                              cursor: 'pointer',
                              borderRadius: '4px',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'hsl(var(--destructive) / 0.1)'
                              e.currentTarget.style.color = 'hsl(var(--destructive))'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = 'hsl(var(--muted-foreground))'
                            }}
                            title="상품 제거"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {/* 상품 합계 및 검증 메시지 */}
                      <div style={{ paddingTop: '12px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '12px',
                          fontWeight: '600',
                          marginBottom: productValidation?.isValid ? '0' : '8px'
                        }}>
                          <span>합계</span>
                          <span style={{
                            color: productValidation?.isValid
                              ? 'hsl(var(--foreground))'
                              : 'hsl(var(--destructive))'
                          }}>
                            {productValidation?.total}%
                          </span>
                        </div>
                        {!productValidation?.isValid && (
                          <div style={{
                            fontSize: '11px',
                            color: 'hsl(var(--destructive))',
                            padding: '6px 8px',
                            backgroundColor: 'hsl(var(--destructive) / 0.1)',
                            borderRadius: '4px'
                          }}>
                            {productValidation?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            
            {/* 현재 탭의 매체 합계 및 검증 */}
            {(() => {
              const currentTabMedia = selectedMedia.filter(m => m.startsWith(selectedMediaCategory))
              if (currentTabMedia.length === 0) return null
              
              const currentTabTotal = currentTabMedia.reduce((sum, mediaKey) => sum + (mediaRatios[mediaKey] || 0), 0)
              const isValidTabTotal = currentTabTotal === 100
              
              // 상품 미선택 매체 확인
              const mediaWithoutProducts = currentTabMedia.filter(mediaKey => {
                const products = productRatios[mediaKey]
                return !products || Object.keys(products).length === 0
              })
              
              return (
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '2px solid hsl(var(--border))'
                }}>
                  {/* 현재 탭 합계 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: isValidTabTotal ? '0' : '8px'
                  }}>
                    <span>{selectedMediaCategory} 합계</span>
                    <span style={{
                      color: isValidTabTotal ? 'hsl(var(--foreground))' : 'hsl(var(--destructive))'
                    }}>
                      {currentTabTotal}%
                    </span>
                  </div>
                  
                  {/* 비중 합계 검증 */}
                  {!isValidTabTotal && (
                    <div style={{
                      fontSize: '11px',
                      color: 'hsl(var(--destructive))',
                      marginBottom: '8px'
                    }}>
                      {selectedMediaCategory} 매체 비중 합계가 {currentTabTotal}%입니다. 100%로 맞춰주세요.
                    </div>
                  )}
                  
                  {/* 상품 미선택 경고 */}
                  {mediaWithoutProducts.length > 0 && (
                    <div style={{
                      fontSize: '11px',
                      color: 'hsl(var(--destructive))',
                      padding: '8px',
                      backgroundColor: 'hsl(var(--destructive) / 0.1)',
                      borderRadius: '4px'
                    }}>
                      {mediaWithoutProducts.map(mediaKey => {
                        const mediaName = mediaKey.split('_')[1]
                        return (
                          <div key={mediaKey}>• {mediaName}: 최소 1개 이상의 상품을 선택해주세요.</div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
        
        {/* 전체 카테고리 선택 검증 메시지 (탭 외부) */}
        {validationActive && (() => {
          const digitalMedia = selectedMedia.filter(m => m.startsWith('DIGITAL'))
          const tvcMedia = selectedMedia.filter(m => m.startsWith('TV'))
          const hasDigital = digitalMedia.length > 0
          const hasTVC = tvcMedia.length > 0
          
          // 카테고리 선택 검증만 표시
          let validationMessages: string[] = []
          
          if (!hasDigital) {
            validationMessages.push('DIGITAL 카테고리에서 최소 1개 이상의 매체를 선택해주세요.')
          }
          if (!hasTVC) {
            validationMessages.push('TVC 카테고리에서 최소 1개 이상의 매체를 선택해주세요.')
          }
          
          if (validationMessages.length === 0) return null
          
          return (
            <div style={{
              marginTop: '12px'
            }}>
              {validationMessages.map((msg, idx) => (
                <div key={idx} style={{
                  fontSize: '11px',
                  color: 'hsl(var(--destructive))',
                  marginTop: idx > 0 ? '4px' : '0'
                }}>
                  {msg}
                </div>
              ))}
            </div>
          )
        })()}
      </div>

      {/* 상품 선택 다이얼로그 */}
      {productSelectionDialog.open && (() => {
        const mediaKey = productSelectionDialog.mediaName.split('_')[1]
        const allProducts = (mediaData[selectedMediaCategory] as any)[mediaKey] || []
        const filteredProducts = (allProducts as string[]).filter((product: string) => 
          product.toLowerCase().includes(productSearchQuery.toLowerCase())
        )
        const allSelected = filteredProducts.length > 0 && filteredProducts.every((p: string) => productSelectionDialog.selectedProducts.includes(p))
        
        return (
          <div className="dialog-overlay" onClick={() => {
            setProductSelectionDialog({ open: false, mediaName: '', selectedProducts: [] })
            setProductSearchQuery('')
          }}>
            <div 
              className="dialog-content" 
              onClick={(e) => e.stopPropagation()}
              style={{ width: '600px', height: '600px', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            >
              <div className="dialog-header">
                <h3 className="dialog-title">
                  {productSelectionDialog.mediaName.split('_')[1]} 상품 선택
                </h3>
                <p className="dialog-description">
                  분석에 포함할 상품을 선택하세요
                </p>
              </div>
              
              <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                {/* 검색 및 전체 선택 */}
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="상품 검색..."
                    className="input"
                    style={{ width: '100%', marginBottom: '12px' }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    backgroundColor: 'hsl(var(--muted) / 0.5)',
                    borderRadius: '6px'
                  }}>
                    <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                      {filteredProducts.length}개 상품
                    </span>
                    <button
                      onClick={() => {
                        if (allSelected) {
                          // 전체 해제
                          setProductSelectionDialog({
                            ...productSelectionDialog,
                            selectedProducts: productSelectionDialog.selectedProducts.filter(
                              (p: string) => !filteredProducts.includes(p)
                            )
                          })
                        } else {
                          // 전체 선택
                          const newSelected = [...new Set([...productSelectionDialog.selectedProducts, ...filteredProducts])]
                          setProductSelectionDialog({
                            ...productSelectionDialog,
                            selectedProducts: newSelected
                          })
                        }
                      }}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '11px' }}
                    >
                      {allSelected ? '전체 해제' : '전체 선택'}
                    </button>
                  </div>
                </div>

                {/* 상품 목록 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '8px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product: string) => (
                      <label
                        key={product}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          padding: '12px',
                          borderRadius: '6px',
                          border: `1px solid ${productSelectionDialog.selectedProducts.includes(product) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                          backgroundColor: productSelectionDialog.selectedProducts.includes(product) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={productSelectionDialog.selectedProducts.includes(product)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProductSelectionDialog({
                                ...productSelectionDialog,
                                selectedProducts: [...productSelectionDialog.selectedProducts, product]
                              })
                            } else {
                              setProductSelectionDialog({
                                ...productSelectionDialog,
                                selectedProducts: productSelectionDialog.selectedProducts.filter(p => p !== product)
                              })
                            }
                          }}
                          className="checkbox-custom"
                        />
                        <span style={{ fontSize: '13px' }}>{product}</span>
                      </label>
                    ))
                  ) : (
                    <div style={{
                      padding: '32px',
                      textAlign: 'center',
                      color: 'hsl(var(--muted-foreground))',
                      fontSize: '13px'
                    }}>
                      검색 결과가 없습니다
                    </div>
                  )}
                </div>
              </div>

              <div className="dialog-footer">
                <button
                  onClick={() => {
                    setProductSelectionDialog({ open: false, mediaName: '', selectedProducts: [] })
                    setProductSearchQuery('')
                  }}
                  className="btn btn-secondary btn-md"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    const mediaKey = productSelectionDialog.mediaName
                    const newProductRatios = { ...productRatios }
                    
                    // 새로 선택된 상품들 추가
                    newProductRatios[mediaKey] = {}
                    productSelectionDialog.selectedProducts.forEach(product => {
                      newProductRatios[mediaKey][product] = productRatios[mediaKey]?.[product] || 0
                    })
                    
                    setProductRatios(newProductRatios)
                    setProductSelectionDialog({ open: false, mediaName: '', selectedProducts: [] })
                    setProductSearchQuery('')
                  }}
                  className="btn btn-primary btn-md"
                >
                  확인 ({productSelectionDialog.selectedProducts.length}개 선택)
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}