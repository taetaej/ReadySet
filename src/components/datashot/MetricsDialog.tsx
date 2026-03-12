import { useState, useEffect } from 'react'
import { metaMetrics, googleMetrics, kakaoMetrics, MetricGroup } from './types'

interface MetricsDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedMetrics: string[]
  onUpdate: (metrics: string[]) => void
  media: string
}

export function MetricsDialog({ isOpen, onClose, selectedMetrics, onUpdate, media }: MetricsDialogProps) {
  const [metricGroups, setMetricGroups] = useState<MetricGroup[]>([])

  // 매체별 지표 데이터 가져오기
  const getMetricsByMedia = (mediaName: string): MetricGroup[] => {
    switch (mediaName) {
      case 'Meta':
        return metaMetrics
      case 'Google Ads':
        return googleMetrics
      case 'kakao모먼트':
        return kakaoMetrics
      default:
        return []
    }
  }

  useEffect(() => {
    if (isOpen) {
      const metrics = getMetricsByMedia(media)
      // 선택된 지표 반영
      const updatedMetrics = metrics.map(group => ({
        ...group,
        metrics: group.metrics.map(metric => ({
          ...metric,
          selected: selectedMetrics.includes(metric.id)
        }))
      }))
      setMetricGroups(updatedMetrics)
    }
  }, [isOpen, selectedMetrics, media])

  const toggleMetric = (groupIndex: number, metricId: string) => {
    const newGroups = [...metricGroups]
    const metric = newGroups[groupIndex].metrics.find(m => m.id === metricId)
    if (metric) {
      metric.selected = !metric.selected
    }
    setMetricGroups(newGroups)
  }

  const toggleGroup = (groupIndex: number) => {
    const newGroups = [...metricGroups]
    const allSelected = newGroups[groupIndex].metrics.every(m => m.selected)
    newGroups[groupIndex].metrics.forEach(m => {
      m.selected = !allSelected
    })
    setMetricGroups(newGroups)
  }

  const handleReset = () => {
    const metrics = getMetricsByMedia(media)
    setMetricGroups(metrics.map(group => ({
      ...group,
      metrics: group.metrics.map(metric => ({
        ...metric,
        selected: false
      }))
    })))
  }

  const handleConfirm = () => {
    const selected = metricGroups.flatMap(group => 
      group.metrics.filter(m => m.selected).map(m => m.id)
    )
    onUpdate(selected)
    onClose()
  }

  const totalSelected = metricGroups.reduce((sum, group) => 
    sum + group.metrics.filter(m => m.selected).length, 0
  )

  if (!isOpen) return null

  if (metricGroups.length === 0) {
    return (
      <div className="dialog-overlay" onClick={onClose}>
        <div 
          className="dialog-content" 
          onClick={(e) => e.stopPropagation()}
          style={{ 
            maxWidth: '500px',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
            지원하지 않는 매체
          </h3>
          <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))', marginBottom: '24px' }}>
            {media} 매체는 아직 지표가 정의되지 않았습니다.
          </p>
          <button onClick={onClose} className="btn btn-primary btn-md">
            확인
          </button>
        </div>
      </div>
    )
  }

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
          <h3 className="dialog-title">지표 선택</h3>
          <p className="dialog-description">
            추출할 지표를 선택하세요
          </p>
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
            {metricGroups.map((group, groupIndex) => {
              const groupSelectedCount = group.metrics.filter(m => m.selected).length
              const allSelected = groupSelectedCount === group.metrics.length
              
              return (
                <div 
                  key={group.group} 
                  style={{ 
                    borderBottom: groupIndex < metricGroups.length - 1 ? '1px solid hsl(var(--border))' : 'none'
                  }}
                >
                  {/* 그룹 헤더 */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 100px 80px',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: 'hsl(var(--muted) / 0.2)',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleGroup(groupIndex)}
                  >
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => toggleGroup(groupIndex)}
                      onClick={(e) => e.stopPropagation()}
                      className="checkbox-custom"
                      style={{ marginLeft: '8px' }}
                    />
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
                      backgroundColor: groupSelectedCount > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                      color: groupSelectedCount > 0 ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                      fontWeight: '600',
                      textAlign: 'center',
                      width: 'fit-content',
                      marginLeft: 'auto'
                    }}>
                      {groupSelectedCount}
                    </div>
                  </div>

                  {/* 지표 리스트 */}
                  <div style={{ backgroundColor: 'hsl(var(--background))' }}>
                    {group.metrics.map((metric, idx) => (
                      <div
                        key={metric.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '40px 1fr',
                          alignItems: 'center',
                          padding: '10px 12px',
                          borderTop: '1px solid hsl(var(--border))',
                          backgroundColor: metric.selected ? 'hsl(var(--muted) / 0.3)' : 'transparent',
                          cursor: 'pointer'
                        }}
                        onClick={() => toggleMetric(groupIndex, metric.id)}
                      >
                        <input
                          type="checkbox"
                          checked={metric.selected}
                          onChange={() => toggleMetric(groupIndex, metric.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="checkbox-custom"
                          style={{ marginLeft: '8px' }}
                        />
                        <span style={{ 
                          fontSize: '13px',
                          fontWeight: metric.selected ? '500' : '400'
                        }}>
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
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
            onClick={handleConfirm}
            className="btn btn-primary btn-md"
          >
            확인 ({totalSelected}개 선택)
          </button>
        </div>
      </div>
    </div>
  )
}
