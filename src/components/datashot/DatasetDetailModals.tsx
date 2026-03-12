import { X } from 'lucide-react'
import { adProductStructureByMedia } from './sampleData'

interface IndustryModalProps {
  isOpen: boolean
  onClose: () => void
  industries: string[]
}

export function IndustryModal({ isOpen, onClose, industries }: IndustryModalProps) {
  if (!isOpen) return null

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div 
        className="dialog-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          width: '900px', 
          maxWidth: '95vw',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">선택한 업종</h3>
          <p className="dialog-description">
            이 데이터샷에 적용된 업종입니다.
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
        
        <div style={{ 
          padding: '24px', 
          flex: 1, 
          overflowY: 'auto'
        }}>
          <div style={{
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              padding: '12px 16px',
              backgroundColor: 'hsl(var(--muted) / 0.5)',
              borderBottom: '1px solid hsl(var(--border))',
              fontSize: '12px',
              fontWeight: '600',
              color: 'hsl(var(--muted-foreground))'
            }}>
              선택한 업종 ({industries.length}개)
            </div>

            <div>
              {industries.map((industry, idx) => {
                const parts = industry.split(' > ')
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      padding: '12px 16px',
                      alignItems: 'center',
                      borderBottom: idx < industries.length - 1 ? '1px solid hsl(var(--border))' : 'none',
                      fontSize: '13px'
                    }}
                  >
                    <div style={{ lineHeight: '1.4' }}>
                      {parts.map((part, partIdx) => (
                        <span key={partIdx}>
                          {partIdx > 0 && (
                            <span style={{ 
                              color: 'hsl(var(--muted-foreground))',
                              margin: '0 4px'
                            }}>
                              {'>'}
                            </span>
                          )}
                          <span style={{ 
                            color: partIdx === parts.length - 1 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                          }}>
                            {part}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="dialog-footer">
          <button
            onClick={onClose}
            className="btn btn-primary btn-md"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

interface AdProductsModalProps {
  isOpen: boolean
  onClose: () => void
  media: string
  products: any[]
}

export function AdProductsModal({ isOpen, onClose, media, products }: AdProductsModalProps) {
  if (!isOpen) return null

  // 매체별 광고상품 구조 가져오기
  const productStructure = adProductStructureByMedia[media]
  
  if (!productStructure) {
    return null
  }

  // 샘플 데이터 생성 (products가 비어있으면 샘플 데이터 사용)
  const displayProducts = products.length > 0 ? products : generateSampleProducts(productStructure, 2)

  return (
    <div className="dialog-overlay" onClick={onClose}>
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
          <h3 className="dialog-title">선택한 광고상품</h3>
          <p className="dialog-description">
            이 데이터샷에 적용된 광고상품입니다.
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
        
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {displayProducts.map((product, index) => (
            <div key={index}>
              <div
                style={{
                  marginBottom: index < displayProducts.length - 1 ? '16px' : '0',
                  padding: '20px',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  backgroundColor: 'hsl(var(--card))'
                }}
              >
                {/* 그룹 헤더 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600' }}>
                    조건 {index + 1}
                  </h3>
                </div>

                {/* 동적 필드 렌더링 */}
                {productStructure.fields.map((field, fieldIdx) => {
                  const fieldValue = product[field.key]
                  const isArray = Array.isArray(fieldValue)
                  const hasValue = isArray ? fieldValue && fieldValue.length > 0 : fieldValue

                  return (
                    <div key={field.key} style={{ marginBottom: fieldIdx < productStructure.fields.length - 1 ? '16px' : '0' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                        {field.label} {field.required && <span style={{ color: 'hsl(var(--destructive))' }}>*</span>}
                      </label>
                      
                      {isArray ? (
                        // 배열 값 (체크박스로 표시)
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', width: '100%', opacity: 0.6 }}>
                            <input
                              type="checkbox"
                              checked={fieldValue.length === field.options.length}
                              disabled
                              className="checkbox-custom"
                              style={{ cursor: 'not-allowed' }}
                            />
                            전체
                          </label>
                          {field.options.map(opt => (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                              <input
                                type="checkbox"
                                checked={hasValue && fieldValue.includes(opt)}
                                disabled
                                className="checkbox-custom"
                                style={{ cursor: 'not-allowed' }}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      ) : (
                        // 단일 값 (텍스트 입력으로 표시)
                        <input
                          type="text"
                          value={fieldValue || ''}
                          disabled
                          className="input"
                          style={{ 
                            width: '100%',
                            opacity: 0.6,
                            cursor: 'not-allowed'
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
              
              {/* OR 구분선 */}
              {index < displayProducts.length - 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '16px 0',
                  gap: '12px'
                }}>
                  <div style={{
                    flex: 1,
                    height: '1px',
                    backgroundColor: 'hsl(var(--border))'
                  }} />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'hsl(var(--muted-foreground))',
                    padding: '4px 12px',
                    backgroundColor: 'hsl(var(--muted))',
                    borderRadius: '12px',
                    border: '1px solid hsl(var(--border))'
                  }}>
                    OR
                  </span>
                  <div style={{
                    flex: 1,
                    height: '1px',
                    backgroundColor: 'hsl(var(--border))'
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="dialog-footer">
          <button
            onClick={onClose}
            className="btn btn-primary btn-md"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

// 샘플 광고상품 데이터 생성 함수
function generateSampleProducts(structure: any, count: number = 2): any[] {
  const products = []
  
  for (let i = 0; i < count; i++) {
    const product: any = {}
    
    structure.fields.forEach((field: any, idx: number) => {
      if (field.required) {
        // 필수 필드: 첫 번째 옵션 선택
        product[field.key] = field.options[i % field.options.length]
      } else {
        // 선택 필드: 랜덤하게 30개 정도 선택
        const totalOptions = field.options.length
        const selectCount = Math.min(30, Math.ceil(totalOptions * 0.7)) // 70% 정도 선택
        
        // 랜덤하게 옵션 선택
        const shuffled = [...field.options].sort(() => Math.random() - 0.5)
        product[field.key] = shuffled.slice(0, selectCount)
      }
    })
    
    products.push(product)
  }
  
  return products
}

interface MetricsModalProps {
  isOpen: boolean
  onClose: () => void
  metricGroups: { group: string; metrics: string[] }[]
}

export function MetricsModal({ isOpen, onClose, metricGroups }: MetricsModalProps) {
  if (!isOpen) return null

  const totalMetrics = metricGroups.reduce((sum, group) => sum + group.metrics.length, 0)

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
          <h3 className="dialog-title">선택한 지표</h3>
          <p className="dialog-description">
            이 데이터샷에 적용된 지표입니다.
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
        
        <div style={{ 
          padding: '24px', 
          flex: 1, 
          overflowY: 'auto'
        }}>
          <div style={{
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {metricGroups.map((group, groupIndex) => (
              <div 
                key={group.group} 
                style={{ 
                  borderBottom: groupIndex < metricGroups.length - 1 ? '1px solid hsl(var(--border))' : 'none'
                }}
              >
                {/* 그룹 헤더 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px 80px',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'hsl(var(--muted) / 0.2)'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>
                    {group.group}
                  </div>
                  <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                    {group.metrics.length}개 지표
                  </div>
                  <div style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    fontWeight: '600',
                    textAlign: 'center',
                    width: 'fit-content',
                    marginLeft: 'auto'
                  }}>
                    {group.metrics.length}
                  </div>
                </div>

                {/* 지표 리스트 */}
                <div style={{ backgroundColor: 'hsl(var(--background))' }}>
                  {group.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 1fr',
                        alignItems: 'center',
                        padding: '10px 12px',
                        borderTop: '1px solid hsl(var(--border))',
                        backgroundColor: 'transparent'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked
                        disabled
                        className="checkbox-custom"
                        style={{ marginLeft: '8px', cursor: 'not-allowed', opacity: 0.6 }}
                      />
                      <span style={{ 
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        {metric}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dialog-footer">
          <button
            onClick={onClose}
            className="btn btn-primary btn-md"
          >
            확인 ({totalMetrics}개 선택)
          </button>
        </div>
      </div>
    </div>
  )
}
