// GroundEdgeTab.tsx — SlotBoard 오른쪽 가장자리의 Ground 탭.
// 평소엔 얇은 탭으로 붙어 있고, 누르면 옆에서 패널이 밀려 나온다. 세로 중앙에 둬 우하단 SpinX FAB과 겹치지 않는다.

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUp, X } from 'lucide-react'
import { SpinXOrb } from '../spinx/SpinXOrb'
import { useViewer } from './useViewer'
import { visibleReports, visibleNews, findingLinks, findFinding, findScenario, reportOf, SUGGESTED_QUESTIONS, fmtYMD, fmtMD } from './groundData'
import { createSession } from './groundSessions'
import './ground.css'

const EASE = [0.16, 1, 0.3, 1] as const

export function GroundEdgeTab() {
  const navigate = useNavigate()
  const [viewer] = useViewer()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const tabRef = useRef<HTMLButtonElement>(null)

  const report = [...visibleReports(viewer)].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0]
  const direct = findingLinks(viewer).filter(l => l.strength === 'direct').slice(0, 3)
  const news = [...visibleNews(viewer)].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 2)

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 250)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey) }
  }, [open])

  const close = () => { setOpen(false); tabRef.current?.focus() }
  const ask = (text: string) => {
    if (!text.trim()) return
    const id = createSession(text.trim(), viewer)
    navigate(`/ground/chat/${id}`, { state: { fresh: true } })
  }

  return (
    <>
      <button
        ref={tabRef}
        type="button"
        className={`gd-edge ${open ? 'is-hidden' : ''}`}
        aria-label="Ground 열기"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="gd-edge-dot" aria-hidden />
        <span className="gd-edge-text">Ground</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim" className="gd-drawer-scrim" onClick={close}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            />
            <motion.aside
              key="drawer" className="gd-drawer" role="dialog" aria-label="Ground"
              initial={reduce ? { opacity: 0 } : { x: '100%' }} animate={reduce ? { opacity: 1 } : { x: 0 }} exit={reduce ? { opacity: 0 } : { x: '100%' }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="gd-drawer-head">
                <span className="gd-drawer-brand">Ground</span>
                <button type="button" className="gd-drawer-open" onClick={() => navigate('/ground')}>전체 열기<ArrowRight size={13} className="gd-arrow" aria-hidden /></button>
                <button type="button" className="gd-drawer-x" aria-label="닫기" onClick={close}><X size={16} /></button>
              </div>

              <div className="gd-drawer-body">
                <form className="gd-drawer-ask" onSubmit={e => { e.preventDefault(); ask(q) }}>
                  <SpinXOrb size={22} motion={q.trim() ? 'hover' : 'idle'} title="" />
                  <label htmlFor="gd-drawer-q" className="gd-sr">SpinX에게 질문</label>
                  <input id="gd-drawer-q" ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="무엇이든 물어보세요" autoComplete="off" />
                  <button type="submit" className="gd-send gd-send-sm" aria-label="질문 보내기" disabled={!q.trim()}><ArrowUp size={14} strokeWidth={2.2} /></button>
                </form>
                <div className="gd-drawer-suggest">
                  {SUGGESTED_QUESTIONS.slice(0, 2).map(s => <button key={s} type="button" onClick={() => ask(s)}>{s}</button>)}
                </div>

                {report && (
                  <section className="gd-drawer-sec">
                    <div className="gd-drawer-sec-h">새로 들어온 리포트</div>
                    <button type="button" className="gd-drawer-report" onClick={() => navigate(`/ground/library/${report.id}`)}>
                      <span className="gd-report-meta">{report.series} {report.issue} · {fmtYMD(report.publishedAt)}</span>
                      <span className="gd-drawer-report-t">{report.title}</span>
                      <span className="gd-report-sub">발견 {report.findings.length}건 · {report.publisher}</span>
                    </button>
                  </section>
                )}

                {direct.length > 0 && (
                  <section className="gd-drawer-sec">
                    <div className="gd-drawer-sec-h">내 시나리오에 바로 해당하는 발견</div>
                    {direct.map(l => {
                      const f = findFinding(l.sourceId)!
                      const s = findScenario(l.scenarioId)!
                      return (
                        <button key={`${l.sourceId}-${l.scenarioId}`} type="button" className="gd-drawer-row" onClick={() => navigate(`/ground/library/${reportOf(f.id).id}#${f.id}`)}>
                          <span className="gd-drawer-row-k">{s.name}</span>
                          <span className="gd-drawer-row-t">{f.title}</span>
                        </button>
                      )
                    })}
                  </section>
                )}

                <section className="gd-drawer-sec">
                  <div className="gd-drawer-sec-h">매체 소식</div>
                  {news.map(n => (
                    <button key={n.id} type="button" className="gd-drawer-row" onClick={() => navigate(`/ground/library/${n.id}`)}>
                      <span className="gd-drawer-row-k">{n.media} · {fmtMD(n.effectiveFrom)} 적용</span>
                      <span className="gd-drawer-row-t">{n.title}</span>
                    </button>
                  ))}
                </section>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
