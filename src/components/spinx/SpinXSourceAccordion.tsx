// SpinXSourceAccordion.tsx — 웹검색 소스 아코디언 + RAG 내부문서 참조 아코디언

import { Globe, FileText, ChevronRight } from 'lucide-react'
import type { WebSource, RagSource } from './spinxTypes'

interface SpinXSourceAccordionProps {
  index: number
  webSources?: WebSource[]
  ragSources?: RagSource[]
  expandedWebSources: Set<number>
  setExpandedWebSources: React.Dispatch<React.SetStateAction<Set<number>>>
  expandedRagSources: Set<number>
  setExpandedRagSources: React.Dispatch<React.SetStateAction<Set<number>>>
  activeFootnote: { msgIndex: number; footnoteNum: number } | null
  setActiveFootnote: React.Dispatch<React.SetStateAction<{ msgIndex: number; footnoteNum: number } | null>>
}

export function SpinXSourceAccordion({
  index,
  webSources,
  ragSources,
  expandedWebSources,
  setExpandedWebSources,
  expandedRagSources,
  setExpandedRagSources,
  activeFootnote,
  setActiveFootnote
}: SpinXSourceAccordionProps) {
  return (
    <>
      {/* 웹 검색 소스 표시 */}
      {webSources && webSources.length > 0 && (
        <div style={{ marginBottom: '12px', fontFamily: 'Paperlogy, sans-serif' }}>
          <button
            onClick={() => {
              setExpandedWebSources(prev => {
                const newSet = new Set(prev)
                if (newSet.has(index)) {
                  newSet.delete(index)
                } else {
                  newSet.add(index)
                }
                return newSet
              })
            }}
            style={{
              width: '100%',
              padding: '8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              color: 'hsl(var(--muted-foreground))',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
          >
            <Globe size={14} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, textAlign: 'left' }}>
              웹 검색 결과 {webSources.length}개
            </span>
            <ChevronRight
              size={14}
              style={{
                flexShrink: 0,
                transform: expandedWebSources.has(index) ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}
            />
          </button>

          {expandedWebSources.has(index) && (
            <div style={{ paddingLeft: '22px', marginTop: '4px' }}>
              {webSources.map((source, sourceIdx) => (
                <a
                  key={sourceIdx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '6px 0',
                    textDecoration: 'none',
                    color: 'hsl(var(--muted-foreground))',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                >
                  <div style={{
                    width: '14px',
                    height: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    opacity: 0.6
                  }}>
                    <Globe size={10} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '400',
                      marginBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {source.title}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      opacity: 0.6,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {source.url}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RAG 내부 문서 참조 표시 */}
      {ragSources && ragSources.length > 0 && (
        <div style={{ marginBottom: '12px', fontFamily: 'Paperlogy, sans-serif' }}>
          <button
            onClick={() => {
              setExpandedRagSources(prev => {
                const newSet = new Set(prev)
                if (newSet.has(index)) {
                  newSet.delete(index)
                } else {
                  newSet.add(index)
                }
                return newSet
              })
            }}
            style={{
              width: '100%',
              padding: '8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              color: 'hsl(var(--muted-foreground))',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
          >
            <FileText size={14} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, textAlign: 'left' }}>
              내부 문서 참조 {ragSources.length}건
            </span>
            <ChevronRight
              size={14}
              style={{
                flexShrink: 0,
                transform: expandedRagSources.has(index) ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}
            />
          </button>

          {expandedRagSources.has(index) && (
            <div style={{
              paddingLeft: '4px',
              marginTop: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              {ragSources.map((source, sourceIdx) => {
                const isHighlighted = activeFootnote?.msgIndex === index && activeFootnote?.footnoteNum === sourceIdx + 1
                return (
                  <div key={sourceIdx}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveFootnote(isHighlighted ? null : { msgIndex: index, footnoteNum: sourceIdx + 1 })
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '5px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: isHighlighted ? 'hsl(var(--muted))' : 'transparent',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <span style={{
                        fontSize: '9px',
                        fontWeight: '600',
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        backgroundColor: 'hsl(var(--foreground))',
                        color: 'hsl(var(--background))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {sourceIdx + 1}
                      </span>
                      {source.type === 'url' ? (
                        <Globe size={12} style={{ flexShrink: 0, opacity: 0.5 }} />
                      ) : (
                        <FileText size={12} style={{ flexShrink: 0, opacity: 0.5 }} />
                      )}
                      <span style={{
                        fontSize: '11px',
                        fontWeight: isHighlighted ? '500' : '400',
                        color: isHighlighted ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {source.title}
                      </span>
                    </div>
                    {isHighlighted && (
                      <div style={{ padding: '4px 8px 8px 44px' }}>
                        <div style={{
                          fontSize: '11px',
                          lineHeight: '1.5',
                          color: 'hsl(var(--muted-foreground))',
                          marginBottom: source.type === 'url' && source.url ? '4px' : '0'
                        }}>
                          {source.summary}
                        </div>
                        {source.type === 'url' && source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '10px',
                              color: 'hsl(var(--muted-foreground))',
                              textDecoration: 'underline',
                              opacity: 0.7
                            }}
                          >
                            {source.url}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </>
  )
}
