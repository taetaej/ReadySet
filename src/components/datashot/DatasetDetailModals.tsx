import { useState } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import { adProductStructureByMedia } from './sampleData'
import { AdProductsSelector } from './AdProductsSelector'

// 매체별 목 데이터 생성 (고정 선택값)
function generateMockProducts(media: string): string[] {
  const structure = adProductStructureByMedia[media]
  if (!structure) return []
  const sel: Record<string, string[]> = {}
  structure.fields.forEach((field, i) => {
    const opts = field.options.map((o: any) => typeof o === 'object' ? o.label : o)
    // 필수 필드: 2~4개, 선택 필드: 2~3개 고정 선택
    const picks = i === 0 ? [0, 1, 3] : [0, 2]
    sel[field.key] = picks.filter(idx => idx < opts.length).map(idx => opts[idx])
  })
  return [JSON.stringify(sel)]
}

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
        className="dialog-content dialog-lg" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
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
  targetingCategory?: string
  targetingOptions?: string[]
}

export function AdProductsModal({ isOpen, onClose, media, products, targetingCategory, targetingOptions = [] }: AdProductsModalProps) {
  if (!isOpen) return null

  const productStructure = adProductStructureByMedia[media]
  if (!productStructure) return null

  // products가 비어있으면 목 데이터 사용
  const displayProducts = products.length > 0 ? products : generateMockProducts(media)

  // 조회조건 총 선택 항목 수 계산
  let totalCount = 0
  try {
    const sel = JSON.parse((displayProducts[0] as string) || '{}')
    Object.values(sel).forEach((v: any) => { if (Array.isArray(v)) totalCount += v.length })
  } catch { /* noop */ }
  totalCount += targetingOptions.length

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog-content dialog-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">선택한 조회조건</h3>
          <p className="dialog-description">
            이 데이터샷에 적용된 조회조건입니다.
          </p>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', right: '24px', top: '24px',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px', color: 'hsl(var(--muted-foreground))'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          <AdProductsSelector
            media={media}
            value={displayProducts}
            onChange={() => {}}
            validationActive={false}
            readOnly={true}
          />

          {/* 타겟팅 옵션 */}
          {targetingCategory && targetingOptions.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <ReadOnlyTargetingSection category={targetingCategory} options={targetingOptions} />
            </div>
          )}
        </div>

        <div className="dialog-footer">
          <button onClick={onClose} className="btn btn-primary btn-md">확인</button>
        </div>
      </div>
    </div>
  )
}


function ReadOnlyTargetingSection({ category, options }: { category: string; options: string[] }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'visible' }}>
      {/* 헤더 */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
          cursor: 'pointer', backgroundColor: open ? 'hsl(var(--muted) / 0.2)' : 'transparent',
          borderBottom: open ? '1px solid hsl(var(--border))' : 'none',
          borderRadius: open ? '8px 8px 0 0' : '8px',
          transition: 'background 0.15s'
        }}
      >
        <span style={{
          width: '20px', height: '20px', borderRadius: '4px',
          border: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: 'hsl(var(--muted-foreground))'
        }}>
          {open ? <Minus size={12} /> : <Plus size={12} />}
        </span>
        <span style={{ fontSize: '13px', fontWeight: '500', flex: 1 }}>타겟팅 옵션</span>
      </div>

      {open && (
        <>
          {/* 카테고리 표시 (드롭다운 스타일) */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid hsl(var(--border) / 0.5)' }}>
            <div
              className="input"
              style={{
                width: '100%', height: '32px',
                display: 'flex', alignItems: 'center',
                fontSize: '12px', padding: '0 10px', boxSizing: 'border-box',
                color: 'hsl(var(--foreground))',
                cursor: 'default'
              }}
            >
              {category}
            </div>
          </div>

          {/* 옵션 체크박스 리스트 */}
          <div style={{ maxHeight: '128px', overflowY: 'auto', padding: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {options.map(opt => (
                <label key={opt} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '5px 10px', cursor: 'default', borderRadius: '4px', fontSize: '12px',
                  backgroundColor: 'hsl(var(--muted) / 0.5)'
                }}>
                  <input type="checkbox" checked disabled className="checkbox-custom" style={{ flexShrink: 0 }} />
                  <span style={{ color: 'hsl(var(--foreground))', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

interface MetricsModalProps {
  isOpen: boolean
  onClose: () => void
  metricGroups: { group: string; metrics: string[] }[]
}

function ReadOnlyMetricGroupRow({ group, metrics }: { group: string; metrics: string[] }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
          cursor: 'pointer', backgroundColor: open ? 'hsl(var(--muted) / 0.2)' : 'transparent',
          borderBottom: open ? '1px solid hsl(var(--border))' : 'none',
          transition: 'background 0.15s'
        }}
      >
        <span style={{
          width: '20px', height: '20px', borderRadius: '4px',
          border: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: 'hsl(var(--muted-foreground))'
        }}>
          {open ? <Minus size={12} /> : <Plus size={12} />}
        </span>
        <span style={{ fontSize: '13px', fontWeight: '500', flex: 1 }}>{group}</span>
      </div>
      {open && (
        <div style={{ maxHeight: '128px', overflowY: 'auto', padding: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {metrics.map((metric, i) => (
              <label key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '5px 10px', cursor: 'default', borderRadius: '4px', fontSize: '12px',
                backgroundColor: 'hsl(var(--muted) / 0.5)'
              }}>
                <input type="checkbox" checked disabled className="checkbox-custom" style={{ flexShrink: 0 }} />
                <span style={{ color: 'hsl(var(--foreground))', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {metric}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function MetricsModal({ isOpen, onClose, metricGroups }: MetricsModalProps) {
  if (!isOpen) return null

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog-content dialog-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">선택한 지표</h3>
          <p className="dialog-description">
            이 데이터샷에 적용된 지표입니다.
          </p>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', right: '24px', top: '24px',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px', color: 'hsl(var(--muted-foreground))'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {metricGroups.map(g => (
            <ReadOnlyMetricGroupRow key={g.group} group={g.group} metrics={g.metrics} />
          ))}
        </div>

        <div className="dialog-footer">
          <button onClick={onClose} className="btn btn-primary btn-md">확인</button>
        </div>
      </div>
    </div>
  )
}
