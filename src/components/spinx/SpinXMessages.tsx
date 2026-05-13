// SpinXMessages.tsx — 메시지 목록 (초기 요약/추천질문 + 대화 메시지 루프 + 로딩 스켈레톤)

import { Copy, Check, Scale, Target, Rotate3d } from 'lucide-react'
import type { Message, RagSource } from './spinxTypes'
import { suggestedQuestions } from './spinxData'
import { SpinXSourceAccordion } from './SpinXSourceAccordion'
import { SpinXChartBubble } from './SpinXChartBubble'
import { SpinXErrorBubble } from './SpinXErrorBubble'

interface SpinXMessagesProps {
  isDarkMode: boolean
  scenarioName: string
  analysisType: 'ratioFinder' | 'reachPredictor'
  messages: Message[]
  isLoading: boolean
  loadingMessage: string
  copied: boolean
  copiedMessageIndex: number | null
  streamingIndex: number | null
  streamingDisplayText: string
  expandedWebSources: Set<number>
  setExpandedWebSources: React.Dispatch<React.SetStateAction<Set<number>>>
  expandedRagSources: Set<number>
  setExpandedRagSources: React.Dispatch<React.SetStateAction<Set<number>>>
  activeFootnote: { msgIndex: number; footnoteNum: number } | null
  setActiveFootnote: React.Dispatch<React.SetStateAction<{ msgIndex: number; footnoteNum: number } | null>>
  retryCount: Map<string, number>
  messagesEndRef: React.RefObject<HTMLDivElement>
  onQuestionClick: (question: string) => void
  onCopy: () => void
  onCopyMessage: (content: Message['content'], index: number) => void
  onRetry: (originalQuestion: string) => void
}

// 각주 [1], [2] 등을 인라인 뱃지로 변환 — 클릭 시 아코디언 열고 해당 문서 하이라이트
function renderWithFootnotes(
  text: string,
  msgIndex: number,
  _ragSources: RagSource[] | undefined,
  activeFootnote: { msgIndex: number; footnoteNum: number } | null,
  setActiveFootnote: React.Dispatch<React.SetStateAction<{ msgIndex: number; footnoteNum: number } | null>>,
  setExpandedRagSources: React.Dispatch<React.SetStateAction<Set<number>>>
) {
  const parts = text.split(/(\[\d+\])/)
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/)
    if (match) {
      const footnoteNum = parseInt(match[1])
      const isActive = activeFootnote?.msgIndex === msgIndex && activeFootnote?.footnoteNum === footnoteNum
      return (
        <span
          key={i}
          onClick={(e) => {
            e.stopPropagation()
            if (isActive) {
              setActiveFootnote(null)
            } else {
              setActiveFootnote({ msgIndex, footnoteNum })
              setExpandedRagSources(prev => {
                const newSet = new Set(prev)
                newSet.add(msgIndex)
                return newSet
              })
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            borderRadius: '4px',
            backgroundColor: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground) / 0.2)',
            color: isActive ? 'hsl(var(--background))' : 'hsl(var(--foreground))',
            fontSize: '9px',
            fontWeight: '700',
            marginLeft: '2px',
            marginRight: '1px',
            verticalAlign: 'super',
            lineHeight: 1,
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
        >
          {match[1]}
        </span>
      )
    }
    return part
  })
}

export function SpinXMessages({
  isDarkMode,
  scenarioName,
  analysisType,
  messages,
  isLoading,
  loadingMessage,
  copied,
  copiedMessageIndex,
  streamingIndex,
  streamingDisplayText,
  expandedWebSources,
  setExpandedWebSources,
  expandedRagSources,
  setExpandedRagSources,
  activeFootnote,
  setActiveFootnote,
  retryCount,
  messagesEndRef,
  onQuestionClick,
  onCopy,
  onCopyMessage,
  onRetry
}: SpinXMessagesProps) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '24px 32px 24px 24px',
        backgroundColor: isDarkMode ? 'hsl(var(--background))' : 'hsl(var(--background))',
        minHeight: 0
      }}
    >
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {/* NotebookLM 스타일 초기 분석 */}
        <div style={{ marginTop: '24px' }}>
          {/* 분석 모듈 칩 + 시나리오명 (세로 배치) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: 'hsl(var(--foreground))',
                color: 'hsl(var(--background))',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                alignSelf: 'flex-start'
              }}
            >
              {analysisType === 'ratioFinder' ? (
                <>
                  <Scale size={14} />
                  Ratio Finder
                </>
              ) : (
                <>
                  <Target size={14} />
                  Reach Predictor
                </>
              )}
            </span>
            <h4
              style={{
                fontSize: '14px',
                fontWeight: '600',
                margin: 0,
                color: 'hsl(var(--foreground))',
                fontFamily: 'Paperlogy, sans-serif',
                lineHeight: '1.4',
                wordBreak: 'keep-all',
                overflowWrap: 'break-word'
              }}
            >
              {scenarioName}
            </h4>
          </div>

          {/* 요약 섹션 */}
          <div
            style={{
              backgroundColor: isDarkMode ? 'hsl(var(--muted))' : 'hsl(var(--muted))',
              padding: '20px',
              borderRadius: '12px',
              position: 'relative',
              marginBottom: '16px'
            }}
          >
            <button
              onClick={onCopy}
              className="btn btn-ghost btn-sm"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '6px'
              }}
              title="복사"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>

            <h5
              style={{
                fontSize: '13px',
                fontWeight: '600',
                margin: '0 0 12px 0',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Paperlogy, sans-serif'
              }}
            >
              요약
            </h5>

            <p
              style={{
                fontSize: '13px',
                margin: 0,
                color: 'hsl(var(--foreground))',
                lineHeight: '1.7',
                paddingRight: '32px'
              }}
            >
              최적 매체 비중은 <strong>TVC 50%, Digital 50%</strong>로 나타났으며, 이 비율로 집행 시 예상 <strong>Reach 1+는 73.2%</strong>입니다. 총 예산 10억원을 TVC 5억원, Digital 5억원으로 배분하는 것을 권장합니다. 이 비율은 타겟 오디언스의 미디어 소비 패턴과 과거 캠페인 데이터를 기반으로 최적화되었습니다.
            </p>
          </div>

          {/* 추천 질문 섹션 */}
          <div style={{ marginBottom: '16px' }}>
            <h5
              style={{
                fontSize: '13px',
                fontWeight: '600',
                margin: '0 0 12px 0',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Paperlogy, sans-serif'
              }}
            >
              추천 질문
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {suggestedQuestions.map((question, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => onQuestionClick(question)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'transparent',
                    color: 'hsl(var(--foreground))',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'Paperlogy, sans-serif',
                    lineHeight: '1.5'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
                    e.currentTarget.style.borderColor = 'hsl(var(--foreground))'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = 'hsl(var(--border))'
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <span
            style={{
              fontSize: '11px',
              color: 'hsl(var(--muted-foreground))',
              display: 'block'
            }}
          >
            방금 전
          </span>

          {/* 추가 대화 메시지들 */}
          {messages.map((msg, index) => (
            <div key={index} style={{ marginTop: '24px' }}>
              {msg.isModelChange ? (
                <div style={{
                  textAlign: 'center',
                  padding: '8px 0',
                  fontFamily: 'Paperlogy, sans-serif'
                }}>
                  <span style={{
                    fontSize: '11px',
                    color: 'hsl(var(--muted-foreground))',
                    backgroundColor: 'hsl(var(--muted) / 0.5)',
                    padding: '4px 12px',
                    borderRadius: '12px'
                  }}>
                    {typeof msg.content === 'string' ? msg.content : ''}
                  </span>
                </div>
              ) : msg.role === 'user' ? (
                <div style={{ textAlign: 'right', marginBottom: '8px' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'hsl(var(--primary))',
                      color: 'hsl(var(--primary-foreground))',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      maxWidth: '80%',
                      textAlign: 'left',
                      fontFamily: 'Paperlogy, sans-serif',
                      lineHeight: '1.6'
                    }}
                  >
                    {typeof msg.content === 'string' ? msg.content : ''}
                  </div>
                  <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginTop: '4px' }}>
                    {msg.timestamp}
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '8px' }}>
                  {/* 소스 아코디언 */}
                  <SpinXSourceAccordion
                    index={index}
                    webSources={msg.webSources}
                    ragSources={msg.ragSources}
                    expandedWebSources={expandedWebSources}
                    setExpandedWebSources={setExpandedWebSources}
                    expandedRagSources={expandedRagSources}
                    setExpandedRagSources={setExpandedRagSources}
                    activeFootnote={activeFootnote}
                    setActiveFootnote={setActiveFootnote}
                  />

                  {typeof msg.content === 'string' ? (
                    <div
                      style={{
                        backgroundColor: isDarkMode ? 'hsl(var(--muted))' : 'hsl(var(--muted))',
                        padding: '16px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontFamily: 'Paperlogy, sans-serif',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-line',
                        position: 'relative'
                      }}
                    >
                      {/* 복사 버튼 — 스트리밍 완료 후에만 표시 */}
                      {streamingIndex !== index && (
                        <button
                          onClick={() => onCopyMessage(msg.content, index)}
                          className="btn btn-ghost btn-sm"
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            padding: '6px'
                          }}
                          title="복사"
                        >
                          {copiedMessageIndex === index ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      )}
                      <div style={{ paddingRight: '32px' }}>
                        {streamingIndex === index
                          ? <>{renderWithFootnotes(streamingDisplayText, index, msg.ragSources, activeFootnote, setActiveFootnote, setExpandedRagSources)}<span style={{ display: 'inline-block', width: '2px', height: '14px', backgroundColor: 'hsl(var(--foreground))', marginLeft: '2px', verticalAlign: 'text-bottom', animation: 'spinx-cursor-blink 0.8s step-end infinite' }} /></>
                          : renderWithFootnotes(msg.content as string, index, msg.ragSources, activeFootnote, setActiveFootnote, setExpandedRagSources)
                        }
                      </div>
                    </div>
                  ) : msg.content.type === 'error' ? (
                    <SpinXErrorBubble
                      message={msg.content.message}
                      originalQuestion={msg.originalQuestion || ''}
                      isDarkMode={isDarkMode}
                      isLoading={isLoading}
                      retryCount={retryCount}
                      onRetry={onRetry}
                    />
                  ) : (
                    <SpinXChartBubble
                      data={msg.content.data}
                      index={index}
                      isDarkMode={isDarkMode}
                      copiedMessageIndex={copiedMessageIndex}
                      onCopy={onCopyMessage}
                    />
                  )}
                  <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginTop: '4px' }}>
                    {msg.timestamp}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 로딩 스켈레톤 */}
          {isLoading && (
            <div style={{ marginTop: '24px' }}>
              <div
                style={{
                  backgroundColor: isDarkMode ? 'hsl(var(--muted))' : 'hsl(var(--muted))',
                  padding: '16px',
                  borderRadius: '12px',
                  fontFamily: 'Paperlogy, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    animation: 'rotate3d 2s linear infinite',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#00ff9d'
                  }}
                >
                  <Rotate3d size={20} />
                </div>
                <div style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                  {loadingMessage}
                </div>
              </div>
            </div>
          )}
          {/* 스크롤 타겟 */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}
