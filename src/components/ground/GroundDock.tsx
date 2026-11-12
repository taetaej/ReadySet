// GroundDock.tsx — 어느 화면에서든 오른쪽에서 여는 SpinX
//  · 보던 화면은 그대로. 지금 보는 대상(origin)이 맥락으로 붙는다
//  · 같은 대상에서 오늘 시작한 대화가 있으면 이어 쓴다
//  · 대화는 모두 Ground "최근 대화"에 쌓이고, "크게 보기"로 대화 화면에 간다
// 열기: window 이벤트 'ground:dock' (detail: { question?: string }) 또는 open prop

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp, ArrowRight, Maximize2, Plus, X } from 'lucide-react'
import { SpinXOrb } from '../spinx/SpinXOrb'
import { ChatThread } from './GroundSpinX'
import { createSession, latestFor, useSessions } from './groundSessions'
import { suggestionsFor } from './spinxContext'
import { useViewer } from './useViewer'
import type { SessionOrigin } from './groundTypes'

export const openDock = (question?: string) => window.dispatchEvent(new CustomEvent('ground:dock', { detail: { question } }))

export function GroundDock({ origin }: { origin: SessionOrigin }) {
  const navigate = useNavigate()
  const [viewer] = useViewer()
  const sessions = useSessions()
  const [open, setOpen] = useState(false)
  const [sid, setSid] = useState<string | null>(null)
  const [fresh, setFresh] = useState(false)
  const [input, setInput] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)
  const session = sid ? sessions.find(s => s.id === sid) : undefined

  const ask = (q: string) => {
    const question = q.trim()
    if (!question) return
    const id = createSession(question, viewer, origin)
    setSid(id); setFresh(true); setInput('')
  }

  useEffect(() => {
    const onOpen = (e: Event) => {
      const q = (e as CustomEvent<{ question?: string }>).detail?.question
      setOpen(true)
      const prev = latestFor(origin.id)
      if (q) {
        // 같은 대상의 오늘 대화가 있으면 거기에 이어 묻는다
        if (prev) { setSid(prev.id); setFresh(false); setTimeout(() => window.dispatchEvent(new CustomEvent('ground:dock-ask', { detail: q })), 0) }
        else ask(q)
      } else {
        setSid(prev?.id ?? null); setFresh(false)
        setTimeout(() => ref.current?.focus(), 50)
      }
    }
    window.addEventListener('ground:dock', onOpen)
    return () => window.removeEventListener('ground:dock', onOpen)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin.id, viewer])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // 패널이 열려 있는 동안 본문을 패널 폭만큼 비켜준다 (덮지 않게)
  useEffect(() => {
    document.body.classList.toggle('gd-dock-open', open)
    return () => document.body.classList.remove('gd-dock-open')
  }, [open])

  if (!open) return null
  const tips = suggestionsFor(origin)

  return (
    <aside className="gd-dock" aria-label="SpinX">
      <header className="gd-dock-head">
        <SpinXOrb size={20} motion="static" title="" />
        <b>SpinX</b>
        <span className="gd-dock-ctx" title={origin.label}>{origin.label}</span>
        <span className="gd-dock-acts">
          {session && <button type="button" aria-label="새 대화" title="새 대화" onClick={() => { setSid(null); setFresh(false); setTimeout(() => ref.current?.focus(), 30) }}><Plus size={15} /></button>}
          {session && <button type="button" aria-label="크게 보기" title="크게 보기" onClick={() => navigate(`/ground/chat/${session.id}`)}><Maximize2 size={14} /></button>}
          <button type="button" aria-label="닫기" title="닫기 (Esc)" onClick={() => setOpen(false)}><X size={15} /></button>
        </span>
      </header>

      {session ? (
        <div className="gd-dock-body"><DockThread key={session.id} sessionId={session.id} fresh={fresh} /></div>
      ) : (
        <div className="gd-dock-empty">
          <div className="gd-dock-hero">
            <SpinXOrb size={72} motion="idle" title="" />
            <p className="gd-dock-lede">{origin.type === 'workflow' && origin.id === 'flow-new' ? '무엇을 맡길까요?' : `${origin.label}에 대해 물어보세요`}</p>
            <div className="gd-dock-tips">
              {tips.map(t => <button key={t} type="button" onClick={() => ask(t)}><ArrowRight size={12} className="gd-arrow" aria-hidden />{t}</button>)}
            </div>
          </div>
          <div className="gd-pill gd-dock-pill">
            <label htmlFor="gd-dock-in" className="gd-sr">SpinX에게 질문</label>
            <textarea id="gd-dock-in" ref={ref} className="gd-pill-input" rows={1} value={input} placeholder="물어보세요"
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.nativeEvent.isComposing) return; if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input) } }} />
            <button type="button" className="gd-send" aria-label="보내기" disabled={!input.trim()} onClick={() => ask(input)}><ArrowUp size={16} strokeWidth={2.2} /></button>
          </div>
        </div>
      )}
    </aside>
  )
}

/** 이어 묻기 이벤트를 받아 ChatThread에 넘긴다 */
function DockThread({ sessionId, fresh }: { sessionId: string; fresh: boolean }) {
  const sessions = useSessions()
  const session = sessions.find(s => s.id === sessionId)
  if (!session) return null
  return <ChatThread session={session} fresh={fresh} compact />
}
