import { Database } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const metricsScrollRef = useRef<HTMLDivElement>(null)
  const fixedTableRef = useRef<HTMLTableElement>(null)
  const metricsTableRef = useRef<HTMLTableElement>(null)
  const [fixedColumnsWidth, setFixedColumnsWidth] = useState(0)
  const [metricsTableWidth, setMetricsTableWidth] = useState(0)

  useEffect(() => {
    if (fixedTableRef.current) {
      // 실제 렌더링된 고정 테이블의 너비를 측정
      const width = fixedTableRef.current.offsetWidth
      setFixedColumnsWidth(width)
    }
    if (metricsTableRef.current) {
      // 실제 렌더링된 지표 테이블의 너비를 측정
      const width = metricsTableRef.current.scrollWidth
      setMetricsTableWidth(width)
    }
  }, [formData.media, formData.targetingCategory, formData.metrics])

  const handleScrollbarScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (metricsScrollRef.current) {
      metricsScrollRef.current.scrollLeft = e.currentTarget.scrollLeft
    }
  }

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
              추출할 전체 데이터 : 1,234 개 행
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
            {/* 테이블 영역 */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              <div style={{ display: 'flex' }}>
                {/* 고정 컬럼 테이블 */}
                <table 
                  ref={fixedTableRef}
                  style={{ 
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                    flexShrink: 0
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ 
                        padding: '8px 10px', 
                        textAlign: 'left', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        whiteSpace: 'nowrap',
                        backgroundColor: 'hsl(var(--muted))',
                        width: '80px',
                        borderBottom: '1px solid hsl(var(--border))'
                      }}>기간</th>
                      <th style={{ 
                        padding: '8px 10px', 
                        textAlign: 'left', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        whiteSpace: 'nowrap',
                        backgroundColor: 'hsl(var(--muted))',
                        width: '100px',
                        borderBottom: '1px solid hsl(var(--border))'
                      }}>매체</th>
                      <th style={{ 
                        padding: '8px 10px', 
                        textAlign: 'left', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        whiteSpace: 'nowrap',
                        backgroundColor: 'hsl(var(--muted))',
                        width: '90px',
                        borderBottom: '1px solid hsl(var(--border))'
                      }}>업종(대)</th>
                      <th style={{ 
                        padding: '8px 10px', 
                        textAlign: 'left', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        whiteSpace: 'nowrap',
                        backgroundColor: 'hsl(var(--muted))',
                        width: '90px',
                        borderBottom: '1px solid hsl(var(--border))'
                      }}>업종(중)</th>
                      <th style={{ 
                        padding: '8px 10px', 
                        textAlign: 'left', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        whiteSpace: 'nowrap',
                        backgroundColor: 'hsl(var(--muted))',
                        width: '90px',
                        borderBottom: '1px solid hsl(var(--border))'
                      }}>업종(소)</th>
                      {adProductColumns.map((col) => (
                        <th key={col.key} style={{ 
                          padding: '8px 10px', 
                          textAlign: 'left', 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          whiteSpace: 'nowrap',
                          backgroundColor: 'hsl(var(--muted))',
                          width: '100px',
                          borderBottom: '1px solid hsl(var(--border))'
                        }}>{col.label}</th>
                      ))}
                      {formData.targetingCategory && (
                        <th style={{ 
                          padding: '8px 10px', 
                          textAlign: 'left', 
                          fontSize: '12px', 
                          fontWeight: '600', 
                          whiteSpace: 'nowrap',
                          backgroundColor: 'hsl(var(--muted))',
                          width: '100px',
                          borderBottom: '1px solid hsl(var(--border))',
                          boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                        }}>{formData.targetingCategory}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((row) => (
                      <tr key={row}>
                        <td style={{ 
                          padding: '8px 10px', 
                          fontSize: '12px', 
                          color: 'hsl(var(--muted-foreground))',
                          whiteSpace: 'nowrap',
                          width: '80px',
                          borderBottom: '1px solid hsl(var(--border))'
                        }}>
                          {formData.period.startYear ? 
                            formData.periodType === 'quarter'
                              ? `${formData.period.startYear}-Q${formData.period.startMonth}`
                              : `${formData.period.startYear}-${formData.period.startMonth.padStart(2, '0')}`
                            : '—'}
                        </td>
                        <td style={{ 
                          padding: '8px 10px', 
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                          width: '100px',
                          borderBottom: '1px solid hsl(var(--border))'
                        }}>{formData.media || '—'}</td>
                        <td style={{ 
                          padding: '8px 10px', 
                          fontSize: '12px', 
                          color: 'hsl(var(--muted-foreground))',
                          whiteSpace: 'nowrap',
                          width: '90px',
                          borderBottom: '1px solid hsl(var(--border))'
                        }}>{formData.industries[0]?.split(' > ')[0] || '—'}</td>
                        <td style={{ 
                          padding: '8px 10px', 
                          fontSize: '12px', 
                          color: 'hsl(var(--muted-foreground))',
                          whiteSpace: 'nowrap',
                          width: '90px',
                          borderBottom: '1px solid hsl(var(--border))'
                        }}>{formData.industries[0]?.split(' > ')[1] || '—'}</td>
                        <td style={{ 
                          padding: '8px 10px', 
                          fontSize: '12px', 
                          color: 'hsl(var(--muted-foreground))',
                          whiteSpace: 'nowrap',
                          width: '90px',
                          borderBottom: '1px solid hsl(var(--border))'
                        }}>{formData.industries[0]?.split(' > ')[2] || '—'}</td>
                        {adProductColumns.map((col) => (
                          <td key={col.key} style={{ 
                            padding: '8px 10px', 
                            fontSize: '12px', 
                            color: 'hsl(var(--muted-foreground))',
                            whiteSpace: 'nowrap',
                            width: '100px',
                            borderBottom: '1px solid hsl(var(--border))'
                          }}>—</td>
                        ))}
                        {formData.targetingCategory && (
                          <td style={{ 
                            padding: '8px 10px', 
                            fontSize: '12px', 
                            color: 'hsl(var(--muted-foreground))',
                            whiteSpace: 'nowrap',
                            width: '100px',
                            borderBottom: '1px solid hsl(var(--border))',
                            boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                          }}>{formData.targetingOptions[0] || '—'}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 지표 컬럼 테이블 */}
                <div 
                  ref={metricsScrollRef}
                  style={{ 
                    flex: 1,
                    overflowX: 'hidden',
                    overflowY: 'hidden',
                    minWidth: 0
                  }}
                >
                  <table 
                    ref={metricsTableRef}
                    style={{ 
                      borderCollapse: 'separate',
                      borderSpacing: 0,
                      width: '100%',
                      minWidth: `${formData.metrics.length * 110}px`
                    }}
                  >
                    <thead>
                      <tr>
                        {formData.metrics.map((metric) => (
                          <th key={metric} style={{ 
                            padding: '8px 10px', 
                            textAlign: 'right', 
                            fontSize: '12px', 
                            fontWeight: '600', 
                            whiteSpace: 'nowrap',
                            backgroundColor: 'hsl(var(--muted))',
                            minWidth: '110px',
                            borderBottom: '1px solid hsl(var(--border))'
                          }}>{metric}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((row) => (
                        <tr key={row}>
                          {formData.metrics.map((metric) => (
                            <td key={metric} style={{ 
                              padding: '8px 10px', 
                              fontSize: '12px', 
                              textAlign: 'right', 
                              color: 'hsl(var(--muted-foreground))',
                              whiteSpace: 'nowrap',
                              minWidth: '110px',
                              borderBottom: '1px solid hsl(var(--border))'
                            }}>—</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 가로 스크롤바 영역 */}
            <div style={{ display: 'flex', borderTop: '1px solid hsl(var(--border))' }}>
              {/* 고정 컬럼 영역 - 실제 테이블과 동일한 구조 */}
              <table style={{ 
                borderCollapse: 'separate',
                borderSpacing: 0,
                flexShrink: 0,
                visibility: 'hidden'
              }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px 10px', width: '80px', height: '1px' }}></th>
                    <th style={{ padding: '8px 10px', width: '100px', height: '1px' }}></th>
                    <th style={{ padding: '8px 10px', width: '90px', height: '1px' }}></th>
                    <th style={{ padding: '8px 10px', width: '90px', height: '1px' }}></th>
                    <th style={{ padding: '8px 10px', width: '90px', height: '1px' }}></th>
                    {adProductColumns.map((col) => (
                      <th key={col.key} style={{ padding: '8px 10px', width: '100px', height: '1px' }}></th>
                    ))}
                    {formData.targetingCategory && (
                      <th style={{ padding: '8px 10px', width: '100px', height: '1px' }}></th>
                    )}
                  </tr>
                </thead>
              </table>
              
              {/* 지표 영역 스크롤바 */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScrollbarScroll}
                style={{ 
                  flex: 1,
                  overflowX: 'auto',
                  overflowY: 'hidden'
                }}
              >
                <div style={{ 
                  height: '1px',
                  width: metricsTableWidth > 0 ? `${metricsTableWidth + 20}px` : '1px'
                }} />
              </div>
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
