// SpinXClarifying.tsx — 역질문 UI (옵션 선택, 직접 입력, 프로그레스 바, 건너뛰기, 전송 버튼)

import { ArrowUp } from 'lucide-react'
import type { ClarifyingQuestion } from './spinxTypes'

interface SpinXClarifyingProps {
  clarifyingQuestion: ClarifyingQuestion
  clarifyingSelected: number | null
  setClarifyingSelected: (idx: number | null) => void
  clarifyingMultiSelected: number[]
  setClarifyingMultiSelected: React.Dispatch<React.SetStateAction<number[]>>
  clarifyingCustom: string
  setClarifyingCustom: (val: string) => void
  clarifyingCustomMode: boolean
  setClarifyingCustomMode: (mode: boolean) => void
  onSubmit: () => void
  onSkip: () => void
}

export function SpinXClarifying({
  clarifyingQuestion,
  clarifyingSelected,
  setClarifyingSelected,
  clarifyingMultiSelected,
  setClarifyingMultiSelected,
  clarifyingCustom,
  setClarifyingCustom,
  clarifyingCustomMode,
  setClarifyingCustomMode,
  onSubmit,
  onSkip
}: SpinXClarifyingProps) {
  return (
    <div style={{ width: '100%' }}>
      {/* 역질문 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '6px'
      }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif' }}>
          {clarifyingQuestion.question}
        </span>
        <button
          onClick={onSkip}
          style={{
            fontSize: '11px', color: 'hsl(var(--muted-foreground))',
            background: 'none', border: '1px solid hsl(var(--border))',
            borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
            fontFamily: 'Paperlogy, sans-serif', transition: 'all 0.2s', flexShrink: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'hsl(var(--foreground))'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'hsl(var(--border))'}
        >
          건너뛰기
        </button>
      </div>
      {/* [역질문 타이머] 25초 프로그레스 바 — 제거 시 이 블록 삭제 */}
      <div style={{
        width: '100%', height: '3px', borderRadius: '2px',
        backgroundColor: 'hsl(var(--border))', marginBottom: '10px', overflow: 'hidden'
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '2px',
          backgroundColor: 'hsl(var(--muted-foreground))',
          animation: 'spinx-clarify-timer 25s linear forwards'
        }} />
      </div>
      {/* 옵션 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {clarifyingQuestion.options.map((option, idx) => {
          const isMultiple = clarifyingQuestion.selectionMode === 'multiple'
          const isSelected = isMultiple
            ? clarifyingMultiSelected.includes(idx)
            : clarifyingSelected === idx
          return (
            <button
              key={idx}
              onClick={() => {
                if (isMultiple) {
                  setClarifyingMultiSelected(prev =>
                    prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                  )
                  setClarifyingCustomMode(false)
                } else {
                  setClarifyingSelected(idx)
                  setClarifyingCustomMode(false)
                }
              }}
              onDoubleClick={() => {
                if (!isMultiple) {
                  setClarifyingSelected(idx)
                  setClarifyingCustomMode(false)
                  setTimeout(() => onSubmit(), 50)
                }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 12px', borderRadius: '6px',
                border: isSelected ? '1px solid hsl(var(--foreground))' : '1px solid hsl(var(--border))',
                backgroundColor: isSelected ? 'hsl(var(--muted))' : 'transparent',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                fontFamily: 'Paperlogy, sans-serif', width: '100%', outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {isMultiple ? (
                <span style={{
                  width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: isSelected ? 'none' : '1.5px solid hsl(var(--border))',
                  backgroundColor: isSelected ? 'hsl(var(--foreground))' : 'transparent',
                  color: isSelected ? 'hsl(var(--background))' : 'transparent',
                  fontSize: '11px', fontWeight: '700', transition: 'all 0.15s'
                }}>
                  {isSelected ? '✓' : ''}
                </span>
              ) : (
                <span style={{
                  width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700',
                  backgroundColor: isSelected ? 'hsl(var(--foreground))' : 'hsl(var(--muted))',
                  color: isSelected ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))'
                }}>
                  {idx + 1}
                </span>
              )}
              <span style={{ fontSize: '13px', color: 'hsl(var(--foreground))' }}>{option}</span>
              {!isMultiple && isSelected && (
                <ArrowUp size={14} style={{ marginLeft: 'auto', color: 'hsl(var(--foreground))', flexShrink: 0 }} />
              )}
            </button>
          )
        })}
        {/* 기타 직접 입력 */}
        {clarifyingQuestion.allowCustom && (
          <div
            onClick={() => { setClarifyingCustomMode(true); setClarifyingSelected(null) }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px', borderRadius: '6px',
              border: clarifyingCustomMode ? '1px solid hsl(var(--foreground))' : '1px solid hsl(var(--border))',
              backgroundColor: clarifyingCustomMode ? 'hsl(var(--muted))' : 'transparent',
              cursor: 'pointer', transition: 'all 0.15s', width: '100%',
              overflow: 'hidden', minWidth: 0, boxSizing: 'border-box'
            }}
          >
            <span style={{
              width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px',
              backgroundColor: clarifyingCustomMode ? 'hsl(var(--foreground))' : 'hsl(var(--muted))',
              color: clarifyingCustomMode ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))'
            }}>
              ✎
            </span>
            {clarifyingCustomMode ? (
              <input
                autoFocus
                value={clarifyingCustom}
                onChange={(e) => setClarifyingCustom(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && clarifyingCustom.trim()) onSubmit() }}
                placeholder="직접 입력..."
                style={{
                  flex: 1, border: 'none', background: 'none', outline: 'none',
                  fontSize: '13px', color: 'hsl(var(--foreground))',
                  fontFamily: 'Paperlogy, sans-serif', padding: 0,
                  width: '100%', minWidth: 0
                }}
              />
            ) : (
              <span style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>기타</span>
            )}
          </div>
        )}
      </div>
      {/* 전송 버튼 */}
      {(clarifyingSelected !== null || clarifyingMultiSelected.length > 0 || (clarifyingCustomMode && clarifyingCustom.trim())) && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          {clarifyingQuestion.selectionMode === 'multiple' && clarifyingMultiSelected.length > 0 && (
            <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', fontFamily: 'Paperlogy, sans-serif' }}>
              {clarifyingMultiSelected.length}개 선택
            </span>
          )}
          <button
            onClick={onSubmit}
            style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none',
              backgroundColor: 'hsl(var(--foreground))', color: 'hsl(var(--background))',
              fontSize: '12px', fontWeight: '500', cursor: 'pointer',
              fontFamily: 'Paperlogy, sans-serif', transition: 'opacity 0.2s'
            }}
          >
            선택 전송
          </button>
        </div>
      )}
    </div>
  )
}
