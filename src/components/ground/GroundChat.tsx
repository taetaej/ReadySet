// GroundChat.tsx — /ground/chat/:sessionId. 대화 세션.
// 오른쪽에 "이 대화가 쓴 근거"를 모아 보여준다 (홈 인사이트 맵을 대화 단위로 잘라낸 것).

import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, Trash2 } from 'lucide-react'
import { GroundLayout } from './GroundLayout'
import { ChatThread } from './GroundSpinX'
import { useSessions, deleteSession } from './groundSessions'
import { answerQuestion, findFinding, findNews, findScenario, reportOf, fmtMD } from './groundData'

export function GroundChat() {
  const { sessionId = '' } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { fresh?: boolean } }
  const sessions = useSessions()
  const session = sessions.find(s => s.id === sessionId)

  if (!session) {
    return (
      <GroundLayout title="대화 - Ground">
        <div className="gd-container gd-page">
          <button type="button" className="gd-back" onClick={() => navigate('/ground')}><ArrowLeft size={14} />홈</button>
          <h1 className="gd-d-title" style={{ marginTop: 24, fontSize: 24 }}>대화를 찾을 수 없어요</h1>
          <p className="gd-d-take">삭제되었거나 다른 브라우저에서 만든 대화예요.</p>
        </div>
      </GroundLayout>
    )
  }

  // 이 대화가 인용한 근거 — 중복 제거, 종류별
  const cites = session.questions.flatMap(q => answerQuestion(q, session.viewer).citations)
  const uniq = <T,>(xs: T[]) => Array.from(new Set(xs))
  const findings = uniq(cites.filter(c => c.type === 'finding').map(c => c.id))
  const news = uniq(cites.filter(c => c.type === 'news').map(c => c.id))
  const scenarios = uniq(cites.filter(c => c.type === 'scenario').map(c => c.id))

  return (
    <GroundLayout title={`${session.title} - Ground`}>
      <div className="gd-chat">
        <div className="gd-chat-main">
          <div className="gd-chat-head">
            <span className="gd-chat-title">{session.title}</span>
            <button type="button" className="gd-chat-del" aria-label="대화 삭제" title="대화 삭제" onClick={() => { deleteSession(session.id); navigate('/ground') }}><Trash2 size={14} /></button>
          </div>
          <ChatThread key={session.id} session={session} fresh={!!state?.fresh} />
        </div>

        <aside className="gd-chat-side" aria-label="이 대화가 쓴 근거">
          <div className="gd-chat-side-h">이 대화가 쓴 근거</div>
          {findings.length > 0 && <div className="gd-chat-side-k">분석 리포트 · 발견 {findings.length}</div>}
          {findings.map(id => {
            const f = findFinding(id)!, r = reportOf(id)
            return (
              <button key={id} type="button" className="gd-drawer-row" onClick={() => navigate(`/ground/library/${r.id}#${id}`)}>
                <span className="gd-drawer-row-k">{r.issue}{r.sample && <span className="gd-sample">예시</span>}</span>
                <span className="gd-drawer-row-t">{f.title}</span>
              </button>
            )
          })}
          {scenarios.length > 0 && <div className="gd-chat-side-k">시나리오 {scenarios.length}</div>}
          {scenarios.map(id => {
            const s = findScenario(id)!
            return (
              <button key={id} type="button" className="gd-drawer-row" onClick={() => navigate(s.solution === 'BudgetOpt 2.0' ? '/budgetopt' : '/reachcaster')}>
                <span className="gd-drawer-row-k">{s.solution} · {fmtMD(s.start)}–{fmtMD(s.end)}</span>
                <span className="gd-drawer-row-t">{s.name}</span>
              </button>
            )
          })}
          {news.length > 0 && <div className="gd-chat-side-k">매체 소식 {news.length}</div>}
          {news.map(id => {
            const n = findNews(id)!
            return (
              <button key={id} type="button" className="gd-drawer-row" onClick={() => navigate(`/ground/library/${id}`)}>
                <span className="gd-drawer-row-k">{n.media} · {fmtMD(n.effectiveFrom)} 적용{n.audienceLevel === 'internal' && <Lock size={9} aria-label="임직원 전용" style={{ marginLeft: 4 }} />}</span>
                <span className="gd-drawer-row-t">{n.title}</span>
              </button>
            )
          })}
          {cites.length === 0 && <p className="gd-graph-why">아직 인용한 근거가 없어요.</p>}
        </aside>
      </div>
    </GroundLayout>
  )
}
