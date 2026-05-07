// SpinXInput.tsx — 입력 영역 (텍스트 입력, 첨부파일/URL, 모델 선택 드롭다운, 세션 정보)

import { X, Paperclip, Clock, Square, ChevronDown, FileText, ArrowUp, Globe, Image as ImageIcon } from 'lucide-react'
import type { LLMModel } from './spinxTypes'
import { availableModels } from './spinxData'

interface SpinXInputProps {
  message: string
  setMessage: (msg: string) => void
  isLoading: boolean
  selectedModel: LLMModel
  modelMenuOpen: boolean
  setModelMenuOpen: (open: boolean) => void
  sessionTooltipOpen: boolean
  setSessionTooltipOpen: (open: boolean) => void
  attachMenuOpen: boolean
  attachedFile: File | null
  attachedUrl: string
  fileInputRef: React.RefObject<HTMLInputElement>
  daysRemaining: number
  hoursRemaining: number
  minutesRemaining: number
  onSend: () => void
  onStop: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onAttachClick: () => void
  onImageAdd: () => void
  onPdfAdd: () => void
  onUrlAdd: () => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeAttachment: () => void
  onModelSelect: (model: LLMModel) => void
}

export function SpinXInput({
  message,
  setMessage,
  isLoading,
  selectedModel,
  modelMenuOpen,
  setModelMenuOpen,
  sessionTooltipOpen,
  setSessionTooltipOpen,
  attachMenuOpen,
  attachedFile,
  attachedUrl,
  fileInputRef,
  daysRemaining,
  hoursRemaining,
  minutesRemaining,
  onSend,
  onStop,
  onKeyDown,
  onAttachClick,
  onImageAdd,
  onPdfAdd,
  onUrlAdd,
  onFileSelect,
  removeAttachment,
  onModelSelect
}: SpinXInputProps) {
  return (
    <>
      {/* 모델 표시 + 대화 유지 기간 */}
      <div
        style={{
          fontSize: '10px',
          color: 'hsl(var(--muted-foreground))',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setModelMenuOpen(!modelMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              fontSize: '10px',
              color: 'hsl(var(--muted-foreground))'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#00ff9d'
              }}
            />
            {selectedModel.displayName}
            <ChevronDown size={12} />
          </button>

          {/* 모델 선택 드롭다운 */}
          {modelMenuOpen && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              marginBottom: '8px',
              width: '200px',
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              zIndex: 1000,
              fontFamily: 'Paperlogy, sans-serif',
              overflow: 'hidden'
            }}>
              {availableModels.map((model, index) => (
                <button
                  key={index}
                  onClick={() => onModelSelect(model)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    backgroundColor: selectedModel.name === model.name ? 'hsl(var(--muted))' : 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    transition: 'background-color 0.2s',
                    color: 'hsl(var(--foreground))'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedModel.name !== model.name) {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedModel.name !== model.name) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{model.displayName}</span>
                  <span style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>{model.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <div
              onMouseEnter={() => setSessionTooltipOpen(true)}
              onMouseLeave={() => setSessionTooltipOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'help' }}
            >
              <Clock size={12} />
              <span>{daysRemaining}일 {hoursRemaining}시간 {minutesRemaining}분</span>
            </div>

            {sessionTooltipOpen && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                right: 0,
                marginBottom: '8px',
                width: '200px',
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                zIndex: 1000,
                fontFamily: 'Paperlogy, sans-serif',
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>대화 세션</div>
                <div className="text-muted-foreground" style={{ lineHeight: '1.5' }}>
                  이 대화를 이어나갈 수 있는 잔여 세션입니다. 시간 내 돌아오면 대화를 이어할 수 있습니다.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 입력창 영역 */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
          width: '100%'
        }}
      >
        <div style={{ flex: 1, position: 'relative', minWidth: 0, maxWidth: '100%' }}>
          {/* 첨부 파일/URL 칩 */}
          {(attachedFile || attachedUrl) && (
            <div style={{
              marginBottom: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              backgroundColor: 'hsl(var(--muted))',
              borderRadius: '6px',
              fontSize: '12px',
              fontFamily: 'Paperlogy, sans-serif',
              maxWidth: '100%'
            }}>
              {attachedFile ? (
                <>
                  {attachedFile.type === 'application/pdf' ? (
                    <FileText size={14} style={{ flexShrink: 0 }} />
                  ) : (
                    <ImageIcon size={14} style={{ flexShrink: 0 }} />
                  )}
                  <span style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0
                  }}>
                    {attachedFile.name}
                  </span>
                </>
              ) : (
                <>
                  <Globe size={14} style={{ flexShrink: 0 }} />
                  <span style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0
                  }}>
                    {attachedUrl}
                  </span>
                </>
              )}
              <button
                onClick={removeAttachment}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'hsl(var(--muted-foreground))',
                  flexShrink: 0
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="SpinX에게 무엇이든 물어보세요!"
            style={{
              width: '100%',
              minHeight: '44px',
              maxHeight: '120px',
              padding: '12px 60px 12px 16px',
              borderRadius: '8px',
              border: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              fontSize: '14px',
              fontFamily: 'Paperlogy, sans-serif',
              resize: 'none',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'hsl(var(--ring))'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'hsl(var(--border))'
            }}
          />

          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={onFileSelect}
            style={{ display: 'none' }}
          />

          {/* 입력창 내부 버튼들 */}
          <div
            style={{
              position: 'absolute',
              right: '8px',
              bottom: '8px',
              display: 'flex',
              gap: '4px'
            }}
          >
            {/* 첨부 버튼 */}
            {selectedModel.displayName !== 'Chat GPT 4o' && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={onAttachClick}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '6px' }}
                  title="파일 첨부"
                  disabled={attachedFile !== null || attachedUrl !== ''}
                >
                  <Paperclip size={16} />
                </button>

                {attachMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    right: 0,
                    marginBottom: '8px',
                    width: '140px',
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    zIndex: 1000,
                    fontFamily: 'Paperlogy, sans-serif',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={onImageAdd}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s',
                        color: 'hsl(var(--foreground))'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <ImageIcon size={16} />
                      <span>이미지 추가</span>
                    </button>
                    <button
                      onClick={onPdfAdd}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s',
                        color: 'hsl(var(--foreground))'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FileText size={16} />
                      <span>PDF 추가</span>
                    </button>
                    <button
                      onClick={onUrlAdd}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s',
                        color: 'hsl(var(--foreground))'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Globe size={16} />
                      <span>URL 추가</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 전송 버튼 또는 정지 버튼 */}
            {isLoading ? (
              <button
                onClick={onStop}
                className="btn btn-ghost btn-sm"
                style={{
                  padding: '6px',
                  color: 'hsl(var(--destructive))'
                }}
                title="중단"
              >
                <Square size={16} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={onSend}
                disabled={!message.trim() || isLoading}
                style={{
                  padding: '6px',
                  opacity: message.trim() && !isLoading ? 1 : 0.5,
                  cursor: message.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  backgroundColor: message.trim() && !isLoading ? 'hsl(var(--foreground))' : 'hsl(var(--muted))',
                  color: message.trim() && !isLoading ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
                  border: 'none',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                title="전송 (Enter)"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
