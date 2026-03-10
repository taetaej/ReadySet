import { Database } from 'lucide-react'

interface SampleDataModalProps {
  isOpen: boolean
  onClose: () => void
  formData: {
    media: string
    period: {
      startYear: string
      startMonth: string
      endYear: string
      endMonth: string
    }
    periodType: 'month' | 'quarter'
    industries: string[]
    products: string[]
    metrics: string[]
    targetingCategory: string
    targetingOptions: string[]
  }
}

export function SampleDataModal({ isOpen, onClose, formData }: SampleDataModalProps) {
  if (!isOpen) return null

  // 광고상품 컬럼 구조 동적 생성
  const getAdProductColumns = () => {
    if (formData.media === 'Meta') {
      return [
        { key: 'objective', label: '캠페인 목표' },
        { key: 'buyingType', label: '구매 유형' },
        { key: 'platform', label: '플랫폼' },
        { key: 'performanceGoal', label: '성과 목표' }
      ]
    }
    return [{ key: 'product', label: '광고상품' }]
  }

  const adProductColumns = getAdProductColumns()

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div 
        className="dialog-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '95vw', width: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">샘플 데이터 미리보기</h3>
          <p className="dialog-description">
            데이터 구조를 확인하고, 조회조건이 다르다면 이전 단계에서 수정하세요.
          </p>
        </div>
        
        <div style={{ padding: '24px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* 테이블 타이틀 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              fontFamily: 'Paperlogy, sans-serif',
              color: 'hsl(var(--foreground))',
              margin: 0
            }}>
              Sample Data
            </h3>
            <span style={{ 
              fontSize: '13px', 
              fontWeight: '400',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'hsl(var(--muted-foreground))'
            }}>
              <Database size={14} />
              전체 데이터: 1,234행
            </span>
          </div>

          {/* 샘플 데이터 테이블 */}
          <div style={{ 
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* 테이블 스크롤 영역 */}
            <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
              <table style={{ 
                width: 'max-content', 
                minWidth: '100%', 
                borderCollapse: 'separate',
                borderSpacing: 0
              }}>
                <thead>
                  <tr>
                    {/* 기간 */}
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      whiteSpace: 'nowrap',
                      position: 'sticky',
                      left: 0,
                      top: 0,
                      backgroundColor: 'hsl(var(--muted))',
                      zIndex: 11,
                      width: '120px',
                      borderBottom: '1px solid hsl(var(--border))'
                    }}>
                      기간
                    </th>
                    
                    {/* 매체 */}
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      whiteSpace: 'nowrap',
                      position: 'sticky',
                      left: '120px',
                      top: 0,
                      backgroundColor: 'hsl(var(--muted))',
                      zIndex: 11,
                      width: '120px',
                      borderBottom: '1px solid hsl(var(--border))'
                    }}>
                      매체
                    </th>
                    
                    {/* 업종 */}
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      whiteSpace: 'nowrap',
                      position: 'sticky',
                      left: '240px',
                      top: 0,
                      backgroundColor: 'hsl(var(--muted))',
                      zIndex: 11,
                      width: '180px',
                      borderBottom: '1px solid hsl(var(--border))'
                    }}>
                      업종
                    </th>
                    
                    {/* 광고상품 컬럼들 (동적) */}
                    {adProductColumns.map((col, idx) => {
                      const leftPosition = 420 + (idx * 160)
                      const isLast = idx === adProductColumns.length - 1 && !formData.targetingCategory
                      
                      return (
                        <th key={col.key} style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          fontSize: '13px', 
                          fontWeight: '600', 
                          whiteSpace: 'nowrap',
                          position: 'sticky',
                          left: `${leftPosition}px`,
                          top: 0,
                          backgroundColor: 'hsl(var(--muted))',
                          zIndex: 11,
                          width: '160px',
                          borderBottom: '1px solid hsl(var(--border))',
                          boxShadow: isLast ? '2px 0 4px rgba(0,0,0,0.1)' : 'none'
                        }}>
                          {col.label}
                        </th>
                      )
                    })}
                    
                    {/* 타겟팅 옵션 (있을 경우 고정) */}
                    {formData.targetingCategory && (
                      <th style={{ 
                        padding: '12px 16px', 
                        textAlign: 'left', 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        left: `${420 + (adProductColumns.length * 160)}px`,
                        top: 0,
                        backgroundColor: 'hsl(var(--muted))',
                        zIndex: 11,
                        width: '160px',
                        borderBottom: '1px solid hsl(var(--border))',
                        boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                      }}>
                        타겟팅 옵션
                      </th>
                    )}
                    
                    {/* 지표 컬럼 (스크롤 영역) */}
                    {formData.metrics.map((metric) => (
                      <th key={metric} style={{ 
                        padding: '12px 16px', 
                        textAlign: 'right', 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        whiteSpace: 'nowrap',
                        backgroundColor: 'hsl(var(--muted))',
                        width: '140px',
                        borderBottom: '1px solid hsl(var(--border))'
                      }}>
                        {metric}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* 샘플 데이터 5행 */}
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row}>
                      {/* 기간 */}
                      <td style={{ 
                        padding: '12px 16px', 
                        fontSize: '13px', 
                        color: 'hsl(var(--muted-foreground))',
                        position: 'sticky',
                        left: 0,
                        backgroundColor: 'hsl(var(--background))',
                        zIndex: 10,
                        whiteSpace: 'nowrap',
                        borderBottom: '1px solid hsl(var(--border))'
                      }}>
                        {formData.period.startYear ? 
                          formData.periodType === 'quarter'
                            ? `${formData.period.startYear}-Q${formData.period.startMonth}`
                            : `${formData.period.startYear}-${formData.period.startMonth.padStart(2, '0')}`
                          : '—'}
                      </td>
                      
                      {/* 매체 */}
                      <td style={{ 
                        padding: '12px 16px', 
                        fontSize: '13px',
                        position: 'sticky',
                        left: '120px',
                        backgroundColor: 'hsl(var(--background))',
                        zIndex: 10,
                        whiteSpace: 'nowrap',
                        borderBottom: '1px solid hsl(var(--border))'
                      }}>
                        {formData.media || '—'}
                      </td>
                      
                      {/* 업종 */}
                      <td style={{ 
                        padding: '12px 16px', 
                        fontSize: '13px', 
                        color: 'hsl(var(--muted-foreground))',
                        position: 'sticky',
                        left: '240px',
                        backgroundColor: 'hsl(var(--background))',
                        zIndex: 10,
                        whiteSpace: 'nowrap',
                        borderBottom: '1px solid hsl(var(--border))'
                      }}>
                        {formData.industries[0]?.split(' > ').join(' > ') || '—'}
                      </td>
                      
                      {/* 광고상품 데이터 (동적) */}
                      {adProductColumns.map((col, idx) => {
                        const leftPosition = 420 + (idx * 160)
                        const isLast = idx === adProductColumns.length - 1 && !formData.targetingCategory
                        
                        return (
                          <td key={col.key} style={{ 
                            padding: '12px 16px', 
                            fontSize: '13px', 
                            color: 'hsl(var(--muted-foreground))',
                            position: 'sticky',
                            left: `${leftPosition}px`,
                            backgroundColor: 'hsl(var(--background))',
                            zIndex: 10,
                            whiteSpace: 'nowrap',
                            borderBottom: '1px solid hsl(var(--border))',
                            boxShadow: isLast ? '2px 0 4px rgba(0,0,0,0.1)' : 'none'
                          }}>
                            —
                          </td>
                        )
                      })}
                      
                      {/* 타겟팅 옵션 (있을 경우 고정) */}
                      {formData.targetingCategory && (
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '13px', 
                          color: 'hsl(var(--muted-foreground))',
                          position: 'sticky',
                          left: `${420 + (adProductColumns.length * 160)}px`,
                          backgroundColor: 'hsl(var(--background))',
                          zIndex: 10,
                          whiteSpace: 'nowrap',
                          borderBottom: '1px solid hsl(var(--border))',
                          boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                        }}>
                          {formData.targetingOptions[0] || '—'}
                        </td>
                      )}
                      
                      {/* 지표 데이터 (스크롤 영역) */}
                      {formData.metrics.map((metric) => (
                        <td key={metric} style={{ 
                          padding: '12px 16px', 
                          fontSize: '13px', 
                          textAlign: 'right', 
                          color: 'hsl(var(--muted-foreground))',
                          whiteSpace: 'nowrap',
                          backgroundColor: 'hsl(var(--background))',
                          borderBottom: '1px solid hsl(var(--border))'
                        }}>
                          —
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
