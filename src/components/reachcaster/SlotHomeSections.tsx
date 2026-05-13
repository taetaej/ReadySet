import { useState, useRef } from 'react'
import {
  FileText, FileSpreadsheet, Presentation, Download,
  Plus, X, Settings2
} from 'lucide-react'
import { colors, DocumentItem, ActivityItem, MOCK_DOCUMENTS, MOCK_ACTIVITY } from './slotHomeTypes'

/* ─── Document Icon ─── */

function DocIcon({ type }: { type: DocumentItem['type'] }) {
  const map = {
    pdf: FileText,
    xlsx: FileSpreadsheet,
    pptx: Presentation,
    docx: FileText,
  }
  const Icon = map[type] || FileText
  return <Icon size={14} style={{ color: 'hsl(var(--muted-foreground))', flexShrink: 0 }} />
}

/* ─── Solution Colors for timeline dots ─── */

const SOLUTION_DOT_COLORS: Record<string, string> = {
  'DataShot': '#A855F7',
  'Reach Caster': '#06B6D4',
  'Budget Optimizer': '#F43F5E',
  'Ad Curator': '#10B981',
  'Resources': 'hsl(var(--muted-foreground))',
}

/* ─── Slot Feed Section ─── */

const MAX_FEED_ITEMS = 10

export function SlotFeedSection() {
  const items = MOCK_ACTIVITY.slice(0, MAX_FEED_ITEMS)

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <span style={{
          fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const,
          letterSpacing: '0.08em', color: colors.textDim,
        }}>
          Activity Log
        </span>
        <span style={{
          fontSize: '10px', color: colors.textDim,
          fontFamily: 'Paperlogy, sans-serif',
        }}>
          최근 {items.length}개
        </span>
      </div>

      <div style={{ position: 'relative', paddingLeft: '20px' }}>
        {/* 세로 타임라인 */}
        <div style={{
          position: 'absolute',
          left: '4px', top: '4px', bottom: '4px',
          width: '1px',
          backgroundColor: colors.border,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {items.map((item, idx) => {
            const dotColor = SOLUTION_DOT_COLORS[item.solution] || 'hsl(var(--muted-foreground))'

            return (
              <div key={item.id} style={{
                position: 'relative',
                paddingBottom: idx < items.length - 1 ? '14px' : '0',
              }}>
                {/* Dot on timeline */}
                <div style={{
                  position: 'absolute',
                  left: '-18px', top: '6px',
                  width: '5px', height: '5px',
                  borderRadius: '50%',
                  backgroundColor: dotColor,
                }} />

                {/* Content — 한 줄 */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  fontSize: '12px', fontFamily: 'Paperlogy, sans-serif',
                }}>
                  <span style={{ color: colors.textDim, flexShrink: 0 }}>{item.solution}</span>
                  <span style={{ color: colors.textDim, margin: '0 5px', opacity: 0.4 }}>›</span>
                  <span style={{ color: colors.textDim, flexShrink: 0 }}>{item.action}</span>
                  <span style={{ color: colors.textDim, margin: '0 5px', opacity: 0.4 }}>›</span>
                  <span style={{
                    fontWeight: 500, color: colors.text,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    flex: 1,
                  }}>
                    {item.detail || '—'}
                  </span>
                  <span style={{
                    fontSize: '10px', color: colors.textDim,
                    flexShrink: 0, whiteSpace: 'nowrap', marginLeft: '12px',
                  }}>
                    {item.user} · {item.timestamp}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ─── Documents Section ─── */

interface DocumentsSectionProps {
  isAdmin: boolean
}

export function DocumentsSection({ isAdmin }: DocumentsSectionProps) {
  const [docs, setDocs] = useState<DocumentItem[]>(MOCK_DOCUMENTS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleRemove = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <span style={{
          fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const,
          letterSpacing: '0.08em', color: colors.textDim,
        }}>
          Resources · {docs.length}
        </span>
        {isAdmin && (
          <button
            onClick={() => setDialogOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '20px', height: '20px',
              border: 'none', background: 'transparent',
              color: colors.textDim, cursor: 'pointer',
              padding: 0, transition: 'color 0.15s',
            }}
            title="문서 관리"
            onMouseEnter={e => e.currentTarget.style.color = colors.text}
            onMouseLeave={e => e.currentTarget.style.color = colors.textDim}
          >
            <Settings2 size={13} />
          </button>
        )}
      </div>

      {docs.length === 0 ? (
        <div style={{
          padding: '20px 0', textAlign: 'center',
          fontSize: '12px', color: colors.textDim,
          fontFamily: 'Paperlogy, sans-serif',
        }}>
          첨부된 문서가 없습니다.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {docs.map(doc => (
            <div
              key={doc.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: '7px',
                transition: 'background-color 0.15s', cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.4)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <DocIcon type={doc.type} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '12px', fontWeight: 500, color: colors.text,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontFamily: 'Paperlogy, sans-serif',
                }}>
                  {doc.name}
                </div>
                <div style={{
                  fontSize: '10px', color: colors.textDim,
                  fontFamily: 'Paperlogy, sans-serif',
                }}>
                  {doc.size}
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation() }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '24px', height: '24px', borderRadius: '5px',
                  border: 'none', background: 'transparent',
                  color: colors.textDim, cursor: 'pointer',
                  flexShrink: 0, transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = colors.text}
                onMouseLeave={e => e.currentTarget.style.color = colors.textDim}
              >
                <Download size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Documents 관리 다이얼로그 */}
      {dialogOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setDialogOpen(false)}
          />
          <div className="dialog-content dialog-sm" style={{
            position: 'relative', display: 'flex', flexDirection: 'column',
            maxHeight: '80vh', overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: `1px solid ${colors.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: colors.text, fontFamily: 'Paperlogy, sans-serif' }}>
                  Resources 관리
                </div>
                <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '3px', fontFamily: 'Paperlogy, sans-serif' }}>
                  파일을 추가하거나 삭제하세요.
                </div>
              </div>
              <button
                onClick={() => setDialogOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '28px', height: '28px', borderRadius: '6px',
                  border: 'none', backgroundColor: 'transparent',
                  color: colors.textMuted, cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>
              <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: `1px dashed ${colors.border}`,
                  backgroundColor: 'transparent', color: colors.textMuted,
                  cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                  fontFamily: 'Paperlogy, sans-serif', marginBottom: '16px',
                  transition: 'all 0.15s', boxSizing: 'border-box' as const,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = colors.text; e.currentTarget.style.color = colors.text }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textMuted }}
              >
                <Plus size={13} /> 파일 추가
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {docs.map(doc => (
                  <div key={doc.id} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 10px', borderRadius: '7px',
                    border: `1px solid ${colors.border}`,
                  }}>
                    <DocIcon type={doc.type} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '12px', fontWeight: 500, color: colors.text,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        fontFamily: 'Paperlogy, sans-serif',
                      }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: '10px', color: colors.textDim, fontFamily: 'Paperlogy, sans-serif' }}>
                        {doc.size} · {doc.uploadedBy} · {doc.uploadedAt}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(doc.id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '24px', height: '24px', borderRadius: '5px',
                        border: 'none', background: 'transparent',
                        color: colors.textDim, cursor: 'pointer', flexShrink: 0,
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'hsl(var(--destructive))'}
                      onMouseLeave={e => e.currentTarget.style.color = colors.textDim}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '14px 24px',
              borderTop: `1px solid ${colors.border}`,
              display: 'flex', justifyContent: 'flex-end', gap: '8px',
            }}>
              <button
                onClick={() => setDialogOpen(false)}
                style={{
                  padding: '8px 16px', borderRadius: '6px',
                  fontSize: '12px', fontWeight: 500,
                  backgroundColor: 'transparent', color: colors.textMuted,
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer', fontFamily: 'Paperlogy, sans-serif',
                }}
              >
                닫기
              </button>
              <button
                onClick={() => setDialogOpen(false)}
                style={{
                  padding: '8px 16px', borderRadius: '6px',
                  fontSize: '12px', fontWeight: 600,
                  backgroundColor: 'hsl(var(--foreground))',
                  color: 'hsl(var(--background))',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'Paperlogy, sans-serif',
                }}
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
