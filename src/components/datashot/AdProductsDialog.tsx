import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'
import { adProductsByMedia } from './types'

interface AdProductsDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedProducts: string[]
  onUpdate: (products: string[]) => void
  media: string
}

export function AdProductsDialog({ isOpen, onClose, selectedProducts, onUpdate, media }: AdProductsDialogProps) {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedProducts)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (isOpen) {
      setLocalSelected(selectedProducts)
      setSearchQuery('')
    }
  }, [isOpen, selectedProducts])

  if (!isOpen) return null

  const products = adProductsByMedia[media] || []
  
  const filteredProducts = products.filter(product =>
    product.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggle = (product: string) => {
    if (localSelected.includes(product)) {
      setLocalSelected(localSelected.filter(p => p !== product))
    } else {
      setLocalSelected([...localSelected, product])
    }
  }

  const handleConfirm = () => {
    onUpdate(localSelected)
    onClose()
  }

  const handleReset = () => {
    setLocalSelected([])
  }

  const handleRemoveChip = (product: string) => {
    setLocalSelected(localSelected.filter(p => p !== product))
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'hsl(var(--background))',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
      }}>
        {/* 헤더 */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid hsl(var(--border))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
              광고상품 선택
            </h2>
            <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
              {media}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 선택된 광고상품 Chips */}
        {localSelected.length > 0 && (
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--muted) / 0.3)'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              {localSelected.map(product => (
                <div
                  key={product}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  <span>{product}</span>
                  <button
                    onClick={() => handleRemoveChip(product)}
                    style={{
                      padding: '2px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'inherit'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 검색 */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid hsl(var(--border))' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(var(--muted-foreground))'
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="광고상품 검색"
              className="input"
              style={{
                width: '100%',
                paddingLeft: '36px'
              }}
            />
          </div>
        </div>

        {/* 광고상품 리스트 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 24px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredProducts.map(product => (
              <label
                key={product}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: localSelected.includes(product) 
                    ? 'hsl(var(--primary) / 0.1)' 
                    : 'transparent',
                  borderColor: localSelected.includes(product)
                    ? 'hsl(var(--primary))'
                    : 'hsl(var(--border))',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="checkbox"
                  checked={localSelected.includes(product)}
                  onChange={() => handleToggle(product)}
                  style={{ accentColor: 'hsl(var(--primary))' }}
                />
                <span style={{ fontSize: '14px' }}>{product}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid hsl(var(--border))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handleReset}
            className="btn btn-ghost"
          >
            초기화
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className="btn btn-primary"
            >
              확인 ({localSelected.length}개 선택)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
