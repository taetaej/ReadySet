import { X } from 'lucide-react'

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

export function AdProductsModal({ isOpen, onClose, products }: AdProductsModalProps) {
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
        
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {products.map((product, idx) => (
            <div
              key={idx}
              style={{
                padding: '20px',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                backgroundColor: 'hsl(var(--card))'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600' }}>
                  조건 {idx + 1}
                </h3>
              </div>

              {/* 캠페인 목표 */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  캠페인 목표 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                </label>
                <input
                  type="text"
                  value={product.objective || ''}
                  disabled
                  className="input"
                  style={{ 
                    width: '100%',
                    opacity: 0.6,
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              {/* 구매 유형 */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  구매 유형
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.buyingTypes?.map((type: string) => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* 플랫폼 */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  플랫폼
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.platforms?.map((platform: string) => (
                    <label key={platform} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      {platform}
                    </label>
                  ))}
                </div>
              </div>

              {/* 성과 목표 */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  성과 목표
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.performanceGoals?.map((goal: string) => (
                    <label key={goal} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      {goal}
                    </label>
                  ))}
                </div>
              </div>
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
                        backgroundColor: 'hsl(var(--primary) / 0.05)'
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
