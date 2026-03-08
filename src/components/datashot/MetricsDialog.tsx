import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { metaMetrics, type MetricGroup } from './types'

interface MetricsDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedMetrics: string[]
  onUpdate: (metrics: string[]) => void
  media: string
}

export function MetricsDialog({ isOpen, onClose, selectedMetrics, onUpdate, media }: MetricsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  // Meta 지표만 지원 (추후 다른 매체 추가 가능)
  const metricsData = media === 'Meta' ? metaMetrics : []

  // 검색 필터링
  const filteredMetrics = metricsData.map(group => ({
    ...group,
    metrics: group.metrics.filter(metric =>
      metric.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.metrics.length > 0)

  const toggleMetric = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      onUpdate(selectedMetrics.filter(id => id !== metricId))
    } else {
      onUpdate([...selectedMetrics, metricId])
    }
  }

  const toggleGroupAll = (group: MetricGroup) => {
    const groupMetricIds = group.metrics.map(m => m.id)
    const allSelected = groupMetricIds.every(id => selectedMetrics.includes(id))
    
    if (allSelected) {
      onUpdate(selectedMetrics.filter(id => !groupMetricIds.includes(id)))
    } else {
      onUpdate([...new Set([...selectedMetrics, ...groupMetricIds])])
    }
  }

  const getMetricLabel = (metricId: string): string => {
    for (const group of metricsData) {
      const metric = group.metrics.find(m => m.id === metricId)
      if (metric) return metric.label
    }
    return metricId
  }

  const handleReset = () => {
    onUpdate([])
    setSearchQuery('')
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div 
        className="dialog-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '900px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">지표 선택</h3>
          <p className="dialog-description">
            데이터 추출에 포함할 지표를 선택하세요
          </p>
        </div>
        
        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* 검색 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ 
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(var(--muted-foreground))'
              }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="지표 검색"
                className="input"
                style={{ paddingLeft: '40px', width: '100%' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* 선택된 지표 Chips */}
          {selectedMetrics.length > 0 && (
            <div style={{
              marginBottom: '16px',
              padding: '8px 12px',
              backgroundColor: 'hsl(var(--muted) / 0.3)',
              borderRadius: '6px',
              border: '1px solid hsl(var(--border))',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'hsl(var(--muted-foreground))',
                whiteSpace: 'nowrap'
              }}>
                선택된 지표 ({selectedMetrics.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flex: 1 }}>
                {selectedMetrics.map(metricId => (
                  <div
                    key={metricId}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                      border: '1px solid hsl(var(--primary))',
                      borderRadius: '16px',
                      fontSize: '12px'
                    }}
                  >
                    <span>{getMetricLabel(metricId)}</span>
                    <button
                      onClick={() => toggleMetric(metricId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'hsl(var(--primary))'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 지표 그룹 리스트 */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredMetrics.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: 'hsl(var(--muted-foreground))',
                fontSize: '13px'
              }}>
                {searchQuery ? '검색 결과가 없습니다' : '지표를 불러올 수 없습니다'}
              </div>
            ) : (
              <div style={{
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {filteredMetrics.map((group, groupIndex) => {
                  const groupMetricIds = group.metrics.map(m => m.id)
                  const allSelected = groupMetricIds.every(id => selectedMetrics.includes(id))
                  const selectedCount = group.metrics.filter(m => selectedMetrics.includes(m.id)).length
                  
                  return (
                    <div 
                      key={group.group} 
                      style={{ 
                        borderBottom: groupIndex < filteredMetrics.length - 1 ? '1px solid hsl(var(--border))' : 'none'
                      }}
                    >
                      {/* 그룹 헤더 */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 100px 80px 40px',
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleGroupAll(group)
                          }}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '11px', padding: '4px 8px' }}
                        >
                          {allSelected ? '전체 해제' : '전체 선택'}
                        </button>
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

                      {/* 지표 리스트 (항상 표시) */}
                      <div style={{ backgroundColor: 'hsl(var(--background))' }}>
                        {group.metrics.map((metric, metricIndex) => {
                          const isSelected = selectedMetrics.includes(metric.id)
                          return (
                            <label
                              key={metric.id}
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '40px 1fr',
                                alignItems: 'center',
                                padding: '10px 12px',
                                cursor: 'pointer',
                                borderTop: '1px solid hsl(var(--border))',
                                backgroundColor: isSelected ? 'hsl(var(--primary) / 0.05)' : 'transparent',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.2)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.backgroundColor = 'transparent'
                                }
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleMetric(metric.id)}
                                className="checkbox-custom"
                                style={{ marginLeft: '8px' }}
                              />
                              <span style={{ 
                                fontSize: '13px',
                                fontWeight: isSelected ? '500' : '400'
                              }}>
                                {metric.label}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
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
            onClick={onClose}
            className="btn btn-secondary btn-md"
          >
            취소
          </button>
          <button
            onClick={onClose}
            className="btn btn-primary btn-md"
          >
            확인 ({selectedMetrics.length}개 선택)
          </button>
        </div>
      </div>
    </div>
  )
}
