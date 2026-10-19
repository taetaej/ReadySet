import React, { useState, useRef, useEffect } from 'react'
import { Plus, ArrowUp } from 'lucide-react'
import { SpinXSymbol } from '../spinx/SpinXSymbol'

// 입력 바는 라이트/다크 양쪽에서 항상 어두운 고대비 표면이어야 한다.
// globals.css에는 "항상 어두운" 토큰이 없다 (--card/--popover/--sidebar/--foreground
// 모두 .dark에서 반전됨). 따라서 이 표면만 SpinX 플로팅 버튼(SpinXButton.tsx)의
// 고정 다크 배경 #09090b 를 의도적으로 그대로 미러링한다. 그 외 색은 전부 토큰 사용.
const DARK_SURFACE = '#09090b'
// 다크 표면 위 hover 피드백 (hsl(var(--muted))는 다크 배경과 충돌하므로 살짝 밝은 다크로)
const DARK_SURFACE_HOVER = '#1c1c1f'
const DARK_BORDER = 'rgba(255, 255, 255, 0.15)'
const DARK_TEXT = 'rgba(255, 255, 255, 0.95)'
const DARK_PLACEHOLDER = 'rgba(255, 255, 255, 0.5)'

export interface DockAction {
  id: string
  label: string
  icon: React.ReactNode
  onSelect: () => void
  /** 핵심 액션 여부 (그린 적용 후보) — 그린 홀딩이라 당장은 미사용 */
  emphasis?: boolean
}

export interface ActionDockSpinX {
  /** 입력 바 placeholder. 기본: "SpinX에게 물어보세요…" */
  placeholder?: string
  /** 입력 포커스 시에만 바 위로 펼쳐지는 추천 질문. [] → 추천 없음 */
  suggestedQuestions: string[]
  /** 타이핑 후 엔터 제출 + 추천 질문 클릭 → SpinX로 라우팅 */
  onSubmitQuestion: (q: string) => void
  /** 쿼리 없이 바/마크 클릭 시 패널만 여는 선택적 핸들러 */
  onOpenPanel?: () => void
  /** 커스텀 마크. 기본 = <SpinXSymbol/> */
  symbol?: React.ReactNode
}

export interface ActionDockProps {
  actions: DockAction[]
  spinx: ActionDockSpinX
  isDarkMode?: boolean
}

export function ActionDock({ actions, spinx }: ActionDockProps) {
  const [inputFocused, setInputFocused] = useState(false)
  const [launcherOpen, setLauncherOpen] = useState(false)
  const [value, setValue] = useState('')
  const [rollIndex, setRollIndex] = useState(0)
  // 바 위에 마우스가 올라오면 롤링을 멈춰 클릭 대상이 커서 밑에서 바뀌지 않게 한다
  const [barHovered, setBarHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fallbackPlaceholder = spinx.placeholder ?? 'SpinX에게 물어보세요…'
  const hasActions = actions.length > 0
  // 런처와 추천 질문 오버레이는 상호 배타적으로 둔다 (시각적 충돌 방지)
  const showSuggestions =
    inputFocused && !launcherOpen && spinx.suggestedQuestions.length > 0

  // 롤링 힌트는 포커스/타이핑이 아닐 때 + 추천 질문이 있을 때만 돈다 (힌트일 뿐 자동 입력 아님)
  const rollEligible =
    !inputFocused && value === '' && spinx.suggestedQuestions.length > 0

  // 호버 중에는 인터벌을 멈춰 현재 질문을 고정한다 (클릭-투-필 타겟 안정화)
  useEffect(() => {
    if (!rollEligible || barHovered) return
    const id = setInterval(() => {
      setRollIndex((prev) => (prev + 1) % spinx.suggestedQuestions.length)
    }, 3000)
    return () => clearInterval(id)
  }, [rollEligible, barHovered, spinx.suggestedQuestions.length])

  // 현재 롤링으로 보여지는 추천 질문 (클릭 시 입력창에 채울 값)
  const rolledQuestion = rollEligible
    ? (spinx.suggestedQuestions[rollIndex % spinx.suggestedQuestions.length] ??
      null)
    : null

  // 표시할 placeholder: 롤링 가능하면 추천 질문, 아니면 기본 placeholder
  const placeholder = rolledQuestion ?? fallbackPlaceholder

  // 롤링 힌트 클릭 → 해당 질문을 입력창에 채우고 포커스 (자동 전송 아님, 쿼터 보호)
  const fillFromHint = () => {
    if (!rolledQuestion) return
    setValue(rolledQuestion)
    inputRef.current?.focus()
  }

  const submit = (q: string) => {
    const text = q.trim()
    if (!text) return
    spinx.onSubmitQuestion(text)
    setValue('')
    inputRef.current?.blur()
  }

  const handleFocus = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current)
    setInputFocused(true)
    // 추천 질문을 펼칠 때 런처 스택은 닫는다
    if (launcherOpen) setLauncherOpen(false)
  }

  const handleBlur = () => {
    // 추천 질문 클릭(mousedown)이 blur보다 먼저 커밋되도록 약간 지연
    blurTimer.current = setTimeout(() => setInputFocused(false), 120)
  }

  const toggleLauncher = () => {
    setLauncherOpen((prev) => {
      const next = !prev
      if (next) setInputFocused(false)
      return next
    })
  }

  const runAction = (action: DockAction) => {
    setLauncherOpen(false)
    action.onSelect()
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        fontFamily: 'Paperlogy, -apple-system, sans-serif',
      }}
    >
      {/* 추천 질문 (입력 포커스 시에만, 바 위로 펼침) */}
      {showSuggestions && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '6px',
          }}
        >
          {spinx.suggestedQuestions.map((q, i) => (
            <button
              key={q}
              type="button"
              // blur보다 먼저 클릭을 커밋
              onMouseDown={(e) => {
                e.preventDefault()
                submit(q)
              }}
              style={{
                maxWidth: '320px',
                textAlign: 'left',
                padding: '8px 14px',
                borderRadius: '18px',
                border: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                fontSize: '13px',
                lineHeight: 1.4,
                cursor: 'pointer',
                whiteSpace: 'normal',
                transition: 'background-color 0.2s',
                opacity: 0,
                transform: 'translateY(6px)',
                animation: `action-dock-rise 0.2s ease forwards`,
                animationDelay: `${i * 40}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(var(--card))'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 액션 알약 스택 (＋ 열림 시, 위로 쌓임 / speed-dial) */}
      {hasActions && launcherOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
          }}
        >
          {/* 아래→위 순차 등장: 배열 역순으로 그려 아래쪽이 먼저 뜨게 */}
          {actions
            .slice()
            .reverse()
            .map((action, i) => (
              <button
                key={action.id}
                type="button"
                onClick={() => runAction(action)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  minWidth: '160px',
                  padding: '10px 16px',
                  borderRadius: '22px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  color: 'hsl(var(--foreground))',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 0.2s',
                  opacity: 0,
                  transform: 'translateY(6px)',
                  animation: `action-dock-rise 0.2s ease forwards`,
                  animationDelay: `${i * 40}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(var(--card))'
                }}
              >
                <span>{action.label}</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: 'hsl(var(--muted-foreground))',
                    flexShrink: 0,
                  }}
                >
                  {action.icon}
                </span>
              </button>
            ))}
        </div>
      )}

      {/* ＋ 액션 런처 (보조) — 입력 바 위, 우측 정렬 */}
      {hasActions && (
        <button
          type="button"
          onClick={toggleLauncher}
          aria-label={launcherOpen ? '액션 닫기' : '액션 열기'}
          aria-expanded={launcherOpen}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: `1px solid ${DARK_BORDER}`,
            backgroundColor: DARK_SURFACE,
            color: DARK_TEXT,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
            transition: 'background-color 0.2s, transform 0.2s',
            transform: launcherOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = DARK_SURFACE_HOVER
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = DARK_SURFACE
          }}
        >
          <Plus size={20} />
        </button>
      )}

      {/* SpinX 입력 바 (메인) — 라이트/다크 양쪽 고정 다크 표면 (SpinX 버튼과 동일) */}
      <div
        onMouseEnter={() => setBarHovered(true)}
        onMouseLeave={() => setBarHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: inputFocused ? '380px' : '300px',
          height: '56px',
          padding: '0 10px 0 18px',
          borderRadius: '28px',
          border: `1px solid ${DARK_BORDER}`,
          backgroundColor: DARK_SURFACE,
          boxShadow: inputFocused
            ? '0 0 0 2px hsl(var(--primary) / 0.5)'
            : '0 8px 24px rgba(0, 0, 0, 0.18)',
          transition: 'width 0.2s, box-shadow 0.2s',
        }}
      >
        <button
          type="button"
          onClick={() => spinx.onOpenPanel?.()}
          aria-label="SpinX 열기"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'none',
            padding: 0,
            cursor: spinx.onOpenPanel ? 'pointer' : 'default',
            flexShrink: 0,
          }}
        >
          {spinx.symbol ?? (
            <SpinXSymbol size={22} motion="idle" title="" style={{ transform: 'rotate(45deg)' }} />
          )}
        </button>

        <div
          onClick={fillFromHint}
          style={{
            position: 'relative',
            flex: 1,
            minWidth: 0,
            display: 'flex',
            cursor: rolledQuestion ? 'pointer' : 'text',
          }}
        >
          {/* 롤링 힌트 오버레이 (입력 비었고 비포커스일 때만) — 힌트일 뿐 자동 입력 아님 */}
          {rollEligible && (
            <span
              key={`hint-${rollIndex}`}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: DARK_PLACEHOLDER,
                fontSize: '14px',
                pointerEvents: 'none',
                animation: 'action-dock-hint-fade 0.2s ease',
              }}
            >
              {placeholder}
            </span>
          )}
          <input
            ref={inputRef}
            className="action-dock-input"
            type="text"
            value={value}
            placeholder={rollEligible ? '' : fallbackPlaceholder}
            onChange={(e) => setValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                submit(value)
              }
            }}
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              background: 'none',
              color: DARK_TEXT,
              caretColor: DARK_TEXT,
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* 전송 어포던스 (기능 신호로서 그린 허용) */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            submit(value)
          }}
          aria-label="보내기"
          disabled={!value.trim()}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: value.trim() ? 'pointer' : 'default',
            backgroundColor: value.trim()
              ? 'hsl(var(--primary))'
              : 'hsl(var(--muted))',
            color: value.trim()
              ? 'hsl(var(--primary-foreground))'
              : 'hsl(var(--muted-foreground))',
            transition: 'background-color 0.2s',
          }}
        >
          <ArrowUp size={16} />
        </button>
      </div>

      <style>{`
        @keyframes action-dock-rise {
          to { opacity: 1; transform: translateY(0); }
        }
        .action-dock-input::placeholder {
          color: ${DARK_PLACEHOLDER};
          opacity: 1;
        }
        /* 롤링 힌트 오버레이 교체 시 미세한 페이드 (~0.2s) */
        @keyframes action-dock-hint-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default ActionDock
