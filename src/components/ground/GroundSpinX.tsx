// GroundSpinX.tsx — 전역 SpinX
//  · QuestionOrb: 홈. 질문을 담은 오브 + 입력. 질문하면 새 대화 세션을 만들고 넘어간다
//  · ChatThread: 대화 세션 안. 이어서 묻고, 근거를 각주로 인용해 답한다

import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUp, ArrowRight, Lock } from 'lucide-react'
import { SpinXOrb } from '../spinx/SpinXOrb'
import type { GroundTurn, GroundSession, Viewer, CitationRef } from './groundTypes'
import {
  SUGGESTED_QUESTIONS, answerQuestion, scope, findFinding, findNews, findScenario, findSlot, reportOf, fmtMD, fmtYMD,
} from './groundData'
import { createSession, appendQuestion } from './groundSessions'

const EASE = [0.16, 1, 0.3, 1] as const
/** 검색 순서를 그대로 보여준다 — 권한 확인이 검색보다 먼저 일어난다 */
const THINKING_STEPS = ['접근 권한 확인', '라이브러리 검색', '시나리오 대조', '답변 작성']
const STEP_MS = 360

/** 입력 — 한 줄 알약. Enter 전송, Shift+Enter 줄바꿈, 한글 조합 중 Enter 무시 */
function Pill({ value, onChange, onSubmit, busy, placeholder, inputRef, leading }: {
  value: string; onChange: (v: string) => void; onSubmit: () => void; busy?: boolean; placeholder: string
  inputRef?: React.RefObject<HTMLTextAreaElement>; leading?: React.ReactNode
}) {
  useEffect(() => {
    const el = inputRef?.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [value, inputRef])
  return (
    <div className="gd-pill">
      {leading}
      <label htmlFor="gd-ask" className="gd-sr">SpinX에게 질문</label>
      <textarea
        id="gd-ask" ref={inputRef} className="gd-pill-input" rows={1} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.nativeEvent.isComposing) return
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit() }
        }}
      />
      <button type="button" className="gd-send" aria-label="질문 보내기" disabled={!value.trim() || busy} onClick={onSubmit}>
        <ArrowUp size={16} strokeWidth={2.2} />
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// 홈 — 질문을 담은 오브
// ─────────────────────────────────────────────
export function QuestionOrb({ viewer, size = 300 }: { viewer: Viewer; size?: number }) {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [input, setInput] = useState('')
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  const typed = input.trim()
  const shown = typed || SUGGESTED_QUESTIONS[idx]

  // 추천 질문 순환 — 입력 중이거나 오브에 손을 올리면 멈춘다
  useEffect(() => {
    if (typed || paused || reduce) return
    const timer = setTimeout(() => setIdx(i => (i + 1) % SUGGESTED_QUESTIONS.length), 4800)
    return () => clearTimeout(timer)
  }, [idx, typed, paused, reduce])

  // ⌘K — 홈에 있으면 입력창으로
  useEffect(() => {
    const focus = () => ref.current?.focus()
    window.addEventListener('ground:focus', focus)
    return () => window.removeEventListener('ground:focus', focus)
  }, [])

  const ask = (q: string) => {
    const question = q.trim()
    if (!question) return
    const id = createSession(question, viewer)
    navigate(`/ground/chat/${id}`, { state: { fresh: true } })
  }

  return (
    <div className="gd-qorb" style={{ ['--orb' as string]: `${size}px` }}>
      <motion.div
        className="gd-hero-orb"
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        initial={reduce ? false : { opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <SpinXOrb size={size} motion={typed ? 'hover' : 'idle'} interactive title="" />
        <button type="button" className="gd-hero-q" onClick={() => ask(shown)} aria-label={`이 질문으로 물어보기: ${shown}`}>
          <span className="gd-hero-kicker">{typed ? '이렇게 물어볼게요' : '이런 걸 물어보세요'}</span>
          {typed ? (
            <span className={`gd-hero-text ${shown.length > 30 ? 'is-long' : ''}`}>{shown}</span>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={idx}
                className={`gd-hero-text ${shown.length > 30 ? 'is-long' : ''}`}
                initial={reduce ? false : { opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduce ? undefined : { opacity: 0, y: -6, filter: 'blur(6px)', transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {shown}
              </motion.span>
            </AnimatePresence>
          )}
          <span className="gd-hero-hint">눌러서 물어보기<ArrowRight size={12} aria-hidden /></span>
        </button>
      </motion.div>
      <div className="gd-hero-dots" role="tablist" aria-label="추천 질문" style={{ visibility: typed ? 'hidden' : 'visible' }}>
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <button key={q} type="button" role="tab" aria-selected={i === idx} aria-label={q} className={i === idx ? 'is-on' : ''} onClick={() => setIdx(i)} />
        ))}
      </div>
      <div className="gd-qorb-input">
        <Pill value={input} onChange={setInput} onSubmit={() => ask(input)} placeholder="내 캠페인에 대해 물어보세요" inputRef={ref} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 대화 세션
// ─────────────────────────────────────────────
export function ChatThread({ session, fresh }: { session: GroundSession; fresh: boolean }) {
  const reduce = useReducedMotion()
  const [input, setInput] = useState('')
  // 새로 들어온 질문 인덱스 — 이 턴만 생각 단계를 보여준다
  const [pendingIdx, setPendingIdx] = useState<number | null>(fresh ? session.questions.length - 1 : null)
  const [step, setStep] = useState(0)
  const ref = useRef<HTMLTextAreaElement>(null)
  const lastRef = useRef<HTMLDivElement>(null)
  const sc = scope(session.viewer)
  const busy = pendingIdx !== null

  const turns: GroundTurn[] = session.questions.map((q, i) => ({ id: `${session.id}-${i}`, question: q, viewer: session.viewer, answer: answerQuestion(q, session.viewer) }))

  useEffect(() => {
    if (pendingIdx === null) return
    if (step >= THINKING_STEPS.length) { setPendingIdx(null); return }
    const timer = setTimeout(() => setStep(s => s + 1), reduce ? 0 : STEP_MS)
    return () => clearTimeout(timer)
  }, [pendingIdx, step, reduce])

  useEffect(() => {
    lastRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }, [session.questions.length, reduce])

  useEffect(() => {
    const focus = () => ref.current?.focus()
    window.addEventListener('ground:focus', focus)
    return () => window.removeEventListener('ground:focus', focus)
  }, [])

  const ask = (text?: string) => {
    const q = (text ?? input).trim()
    if (!q || busy) return
    appendQuestion(session.id, q)
    setPendingIdx(session.questions.length)
    setStep(0)
    setInput('')
  }

  return (
    <div className="gd-ask has-thread">
      <div className="gd-thread" aria-live="polite">
        {turns.map((turn, i) => (
          <div key={turn.id} ref={i === turns.length - 1 ? lastRef : undefined} style={{ scrollMarginTop: 24 }}>
            <Turn turn={turn} pending={i === pendingIdx} step={step} onAsk={q => ask(q)} />
          </div>
        ))}
      </div>
      <div className="gd-composer">
        <Pill value={input} onChange={setInput} onSubmit={() => ask()} busy={busy} placeholder="이어서 물어보세요" inputRef={ref}
          leading={<SpinXOrb size={24} motion={busy ? 'active' : 'idle'} title="" />} />
        <div className="gd-scope">
          리포트 {sc.reports} · 발견 {sc.findings} · 매체 소식 {sc.news} · 진행 중 시나리오 {sc.scenarios}를 보고 답해요
          {session.viewer === 'external' && <span className="gd-scope-note">임직원 전용 소식 제외</span>}
        </div>
      </div>
    </div>
  )
}

function Turn({ turn, pending, step, onAsk }: { turn: GroundTurn; pending: boolean; step: number; onAsk: (q: string) => void }) {
  const [active, setActive] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const { answer } = turn
  const reveal = (i: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: EASE, delay: 0.08 * i } }

  return (
    <article className="gd-turn">
      <h2 className="gd-q">{turn.question}</h2>
      <div className="gd-a">
        <div className="gd-a-head">
          <SpinXOrb size={20} motion={pending ? 'active' : 'settle'} title="" />
          <b>SpinX</b>
          {!pending && answer.citations.length > 0 && <span>근거 {answer.citations.length}건</span>}
        </div>
        <AnimatePresence mode="wait">
          {pending ? (
            <motion.div key="thinking" className="gd-thinking" exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: 0.15 }}>
              {THINKING_STEPS.map((label, i) => (
                <div key={label} className={`gd-thinking-step ${i < step ? 'is-done' : ''}`} style={{ opacity: i <= step ? 1 : 0.35 }}>
                  <span className="gd-thinking-dot" aria-hidden />{label}
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="answer">
              <motion.p className="gd-verdict" {...reveal(0)}>{answer.verdict}</motion.p>
              {answer.paragraphs.map((p, i) => (
                <motion.p key={i} className="gd-para" {...reveal(i + 1)}>
                  <Footnoted text={p} turnId={turn.id} active={active} onActive={setActive} />
                </motion.p>
              ))}
              {answer.citations.length > 0 && (
                <motion.div {...reveal(answer.paragraphs.length + 1)}>
                  <div className="gd-sources-label">근거</div>
                  <div className="gd-sources">
                    {answer.citations.map((c, i) => (
                      <SourceCard key={`${c.type}-${c.id}`} turnId={turn.id} no={i + 1} cite={c} active={active === i + 1} onActive={setActive} />
                    ))}
                  </div>
                </motion.div>
              )}
              {answer.followUps.length > 0 && (
                <motion.div className="gd-follow" {...reveal(answer.paragraphs.length + 2)}>
                  {answer.followUps.map(f => (
                    <button key={f} type="button" onClick={() => onAsk(f)}><ArrowRight size={13} className="gd-arrow" aria-hidden />{f}</button>
                  ))}
                </motion.div>
              )}
              <div className="gd-disclaimer">SpinX 해석은 근거를 바탕으로 생성되며, 리포트 원문의 결론과 구분됩니다.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  )
}

/** "[n]" 표기를 각주 버튼으로. 앞 단어 + 각주 + 뒤 문장부호를 묶어 각주가 줄 끝에서 홀로 떨어지지 않게 한다 */
function Footnoted({ text, turnId, active, onActive }: { text: string; turnId: string; active: number | null; onActive: (n: number | null) => void }) {
  const raw = text.split(/(\[\d+\])/g)
  for (let i = 0; i < raw.length; i++) {
    const m = raw[i].match(/^\[(\d+)\]$/)
    if (!m) continue
    const before = raw[i - 1] ?? ''
    const after = raw[i + 1] ?? ''
    const cut = before.search(/\S+\s*$/)
    const lastWord = cut >= 0 ? before.slice(cut).trimEnd() : ''
    const punct = after.match(/^[.,)]*/)?.[0] ?? ''
    raw[i - 1] = cut >= 0 ? before.slice(0, cut) : before
    raw[i + 1] = after.slice(punct.length)
    raw[i] = `\u0000${m[1]}\u0000${lastWord}\u0000${punct}`
  }
  return (
    <>
      {raw.map((part, i) => {
        if (!part.startsWith('\u0000')) return <React.Fragment key={i}>{part}</React.Fragment>
        const [, num, lastWord, punct] = part.split('\u0000')
        const n = Number(num)
        return (
          <span key={i} style={{ whiteSpace: 'nowrap' }}>
            {lastWord}{lastWord && ' '}
            <button
              type="button"
              className={`gd-fn ${active === n ? 'is-active' : ''}`}
              aria-label={`근거 ${n}`}
              onMouseEnter={() => onActive(n)} onMouseLeave={() => onActive(null)}
              onFocus={() => onActive(n)} onBlur={() => onActive(null)}
              onClick={() => document.getElementById(`${turnId}-src-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
            >{n}</button>
            {punct}
          </span>
        )
      })}
    </>
  )
}

function SourceCard({ turnId, no, cite, active, onActive }: { turnId: string; no: number; cite: CitationRef; active: boolean; onActive: (n: number | null) => void }) {
  const navigate = useNavigate()
  const common = { id: `${turnId}-src-${no}`, className: `gd-source ${active ? 'is-active' : ''}`, onMouseEnter: () => onActive(no), onMouseLeave: () => onActive(null) }

  if (cite.type === 'finding') {
    const f = findFinding(cite.id)
    if (!f) return null
    const r = reportOf(f.id)
    return (
      <button type="button" {...common} onClick={() => navigate(`/ground/library/${r.id}#${f.id}`)}>
        <span className="gd-source-no">{no}</span>
        <span className="gd-source-kind">분석 리포트 · {r.series} {r.issue}</span>
        <span className="gd-source-title">{f.title}</span>
        <span className="gd-source-meta">{r.publisher} · {fmtYMD(r.publishedAt)}</span>
      </button>
    )
  }
  if (cite.type === 'news') {
    const n = findNews(cite.id)
    if (!n) return null
    return (
      <button type="button" {...common} onClick={() => navigate(`/ground/library/${n.id}`)}>
        <span className="gd-source-no">{no}</span>
        <span className="gd-source-kind">매체 소식{n.audienceLevel === 'internal' && <span className="gd-flag"><Lock size={9} aria-hidden />임직원 전용</span>}</span>
        <span className="gd-source-title">{n.title}</span>
        <span className="gd-source-meta">{n.source} · {fmtMD(n.effectiveFrom)} 적용</span>
      </button>
    )
  }
  const s = findScenario(cite.id)
  if (!s) return null
  return (
    <button type="button" {...common} onClick={() => navigate(s.solution === 'BudgetOpt 2.0' ? '/budgetopt' : '/reachcaster')}>
      <span className="gd-source-no">{no}</span>
      <span className="gd-source-kind">{s.solution} 시나리오</span>
      <span className="gd-source-title">{s.name}</span>
      <span className="gd-source-meta">{findSlot(s.slotId)?.title} · {fmtMD(s.start)}–{fmtMD(s.end)} · {s.summary}</span>
    </button>
  )
}
