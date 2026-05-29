// SpinXPanel.tsx — 메인 셸 (레이아웃 조합, 리셋 다이얼로그, URL 다이얼로그)

import React from 'react'
import type { SpinXPanelProps } from './spinxTypes'
import { useSpinXChat } from './useSpinXChat'
import { SpinXHeader } from './SpinXHeader'
import { SpinXMessages } from './SpinXMessages'
import { SpinXInput } from './SpinXInput'
import { SpinXClarifying } from './SpinXClarifying'

export function SpinXPanel({
  isOpen,
  onClose,
  isDarkMode = false,
  scenarioName = '25-34세 여성 타겟 집중 공략 디지털+TV 최적 비중 분석',
  analysisType = 'ratioFinder',
  positioning = 'fixed',
  initialMessage
}: SpinXPanelProps) {
  const chat = useSpinXChat()

  // initialMessage가 있고 패널이 열릴 때 자동 전송
  const prevOpenRef = React.useRef(false)
  React.useEffect(() => {
    if (isOpen && !prevOpenRef.current && initialMessage) {
      chat.handleSend(initialMessage)
    }
    prevOpenRef.current = isOpen
  }, [isOpen, initialMessage])

  return (
    <div
      style={{
        position: positioning,
        top: 0,
        right: isOpen ? 0 : '-400px',
        width: '400px',
        height: positioning === 'fixed' ? '100vh' : '100%',
        backgroundColor: isDarkMode ? 'hsl(var(--card))' : 'hsl(var(--card))',
        borderLeft: '1px solid hsl(var(--border))',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        transition: 'right 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        overflow: 'hidden',
        maxHeight: positioning === 'fixed' ? '100vh' : '100%'
      }}
    >
      {/* 헤더 */}
      <SpinXHeader onReset={chat.handleReset} onClose={onClose} />

      {/* 메시지 영역 */}
      <SpinXMessages
        isDarkMode={isDarkMode}
        scenarioName={scenarioName}
        analysisType={analysisType}
        messages={chat.messages}
        isLoading={chat.isLoading}
        loadingMessage={chat.loadingMessage}
        copied={chat.copied}
        copiedMessageIndex={chat.copiedMessageIndex}
        streamingIndex={chat.streamingIndex}
        streamingDisplayText={chat.streamingDisplayText}
        expandedWebSources={chat.expandedWebSources}
        setExpandedWebSources={chat.setExpandedWebSources}
        expandedRagSources={chat.expandedRagSources}
        setExpandedRagSources={chat.setExpandedRagSources}
        activeFootnote={chat.activeFootnote}
        setActiveFootnote={chat.setActiveFootnote}
        retryCount={chat.retryCount}
        messagesEndRef={chat.messagesEndRef}
        onQuestionClick={chat.handleQuestionClick}
        onCopy={() => chat.handleCopy(scenarioName)}
        onCopyMessage={chat.handleCopyMessage}
        onRetry={chat.handleRetry}
      />

      {/* 입력 영역 */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid hsl(var(--border))',
          backgroundColor: isDarkMode ? 'hsl(var(--card))' : 'hsl(var(--card))',
          flexShrink: 0
        }}
      >
        {/* 역질문 선택 UI 또는 일반 입력 */}
        {chat.clarifyingQuestion ? (
          <SpinXClarifying
            clarifyingQuestion={chat.clarifyingQuestion}
            clarifyingSelected={chat.clarifyingSelected}
            setClarifyingSelected={chat.setClarifyingSelected}
            clarifyingMultiSelected={chat.clarifyingMultiSelected}
            setClarifyingMultiSelected={chat.setClarifyingMultiSelected}
            clarifyingCustom={chat.clarifyingCustom}
            setClarifyingCustom={chat.setClarifyingCustom}
            clarifyingCustomMode={chat.clarifyingCustomMode}
            setClarifyingCustomMode={chat.setClarifyingCustomMode}
            onSubmit={chat.handleClarifyingSubmit}
            onSkip={chat.handleClarifyingSkip}
          />
        ) : (
          <SpinXInput
            message={chat.message}
            setMessage={chat.setMessage}
            isLoading={chat.isLoading}
            selectedModel={chat.selectedModel}
            modelMenuOpen={chat.modelMenuOpen}
            setModelMenuOpen={chat.setModelMenuOpen}
            sessionTooltipOpen={chat.sessionTooltipOpen}
            setSessionTooltipOpen={chat.setSessionTooltipOpen}
            attachMenuOpen={chat.attachMenuOpen}
            attachedFile={chat.attachedFile}
            attachedUrl={chat.attachedUrl}
            fileInputRef={chat.fileInputRef}
            daysRemaining={chat.daysRemaining}
            hoursRemaining={chat.hoursRemaining}
            minutesRemaining={chat.minutesRemaining}
            onSend={() => chat.handleSend()}
            onStop={chat.handleStop}
            onKeyDown={chat.handleKeyDown}
            onAttachClick={chat.handleAttachClick}
            onImageAdd={chat.handleImageAdd}
            onPdfAdd={chat.handlePdfAdd}
            onUrlAdd={chat.handleUrlAdd}
            onFileSelect={chat.handleFileSelect}
            removeAttachment={chat.removeAttachment}
            onModelSelect={chat.handleModelSelect}
          />
        )}

        {/* AI 면책 문구 */}
        <div style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'hsl(var(--muted-foreground))',
          opacity: 0.6,
          marginTop: '8px',
          fontFamily: 'Paperlogy, sans-serif',
          lineHeight: '1.4'
        }}>
          AI의 답변은 부정확할 수 있습니다. 중요한 정보는 반드시 확인하세요.
        </div>
      </div>

      {/* 초기화 확인 다이얼로그 */}
      {chat.showResetDialog && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}
          onClick={() => chat.setShowResetDialog(false)}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? 'hsl(var(--card))' : 'hsl(var(--card))',
              borderRadius: '12px',
              padding: '24px',
              width: '320px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 12px 0',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Paperlogy, sans-serif'
              }}
            >
              대화 초기화
            </h3>
            <p
              style={{
                fontSize: '13px',
                margin: '0 0 24px 0',
                color: 'hsl(var(--muted-foreground))',
                lineHeight: '1.6'
              }}
            >
              대화를 초기화하시겠습니까?<br />
              모든 대화 내용이 삭제됩니다.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => chat.setShowResetDialog(false)}
                className="btn btn-ghost"
                style={{ padding: '8px 16px' }}
              >
                취소
              </button>
              <button
                onClick={chat.confirmReset}
                className="btn btn-primary"
                style={{ padding: '8px 16px' }}
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL 입력 다이얼로그 */}
      {chat.showUrlDialog && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}
          onClick={chat.handleUrlCancel}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? 'hsl(var(--card))' : 'hsl(var(--card))',
              borderRadius: '12px',
              padding: '24px',
              width: '340px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 4px 0',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Paperlogy, sans-serif'
              }}
            >
              URL 추가
            </h3>
            <p
              style={{
                fontSize: '12px',
                margin: '0 0 16px 0',
                color: 'hsl(var(--muted-foreground))',
                lineHeight: '1.5'
              }}
            >
              분석하고 싶은 웹페이지 URL을 입력하세요
            </p>
            <input
              type="url"
              value={chat.urlInput}
              onChange={(e) => chat.setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  chat.handleUrlSubmit()
                }
              }}
              placeholder="https://example.com"
              autoFocus
              className="input"
              style={{
                width: '100%',
                marginBottom: '20px',
                fontSize: '13px',
                fontFamily: 'Paperlogy, sans-serif'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={chat.handleUrlCancel}
                className="btn btn-secondary btn-md"
              >
                취소
              </button>
              <button
                onClick={chat.handleUrlSubmit}
                disabled={!chat.urlInput.trim()}
                className="btn btn-primary btn-md"
                style={{
                  opacity: chat.urlInput.trim() ? 1 : 0.5,
                  cursor: chat.urlInput.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
