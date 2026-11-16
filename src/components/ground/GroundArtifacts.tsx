// GroundArtifacts.tsx — /withset/artifacts · /withset/artifacts/:id
// Artifacts: 대화 · 워크플로우에서 만든 자료. "무엇이고 · 어디서 왔고 · 무엇을 근거로 했나"만 보여준다.

import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, MessageSquare, Sparkles, Workflow } from 'lucide-react'
import { GroundLayout } from './GroundLayout'
import { GroundDock, openDock } from './GroundDock'
import { listArtifacts, findArtifact, fmtAt } from './artifactData'
import { findScenario } from './groundData'
import { findSkillByName } from './skillData'

export function GroundArtifacts() {
  const navigate = useNavigate()
  const items = listArtifacts()

  return (
    <GroundLayout title="Artifacts - WithSet">
      <div className="gd-container gd-page">
        <header className="gd-page-head">
          <h1 className="gd-page-title">Artifacts</h1>
          <p className="gd-page-sub">대화와 워크플로우에서 만든 자료가 여기 모여요.</p>
        </header>

        <div className="gf-table ar-table" role="table" aria-label="Artifacts">
          <div className="gf-tr gf-th" role="row">
            <span role="columnheader">이름</span><span role="columnheader">만든 곳</span><span role="columnheader">만든 날</span><span />
          </div>
          {items.map(a => (
            <button key={a.id} type="button" role="row" className="gf-tr gf-row" onClick={() => navigate(`/withset/artifacts/${a.id}`)}>
              <span className="gf-name" role="cell"><b>{a.title}</b><span>{a.kind}</span></span>
              <span role="cell" className="gf-muted ar-src">
                {a.source.type === 'workflow' ? <Workflow size={12} aria-hidden /> : <MessageSquare size={12} aria-hidden />}
                <span>{a.source.label}</span>
              </span>
              <span role="cell" className="gf-muted">{fmtAt(a.versions[0].at).split(' ')[0]}</span>
              <ArrowRight size={13} className="gd-arrow" aria-hidden />
            </button>
          ))}
          {!items.length && <p className="gd-page-sub" style={{ padding: '20px 4px' }}>아직 만든 자료가 없어요.</p>}
        </div>
      </div>
    </GroundLayout>
  )
}

export function ArtifactDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const a = findArtifact(id)

  if (!a) {
    return (
      <GroundLayout title="Artifacts - WithSet">
        <div className="gd-container gd-page">
          <button type="button" className="gd-back" onClick={() => navigate('/withset/artifacts')}><ArrowLeft size={14} />Artifacts</button>
          <h1 className="gd-d-title" style={{ marginTop: 24, fontSize: 24 }}>자료를 찾을 수 없어요</h1>
        </div>
      </GroundLayout>
    )
  }
  const sk = a.skill ? findSkillByName(a.skill) : undefined

  return (
    <GroundLayout title={`${a.title} - WithSet`}>
      <div className="gd-container">
        <div className="gd-detail">
          <article>
            <button type="button" className="gd-back" onClick={() => navigate('/withset/artifacts')}><ArrowLeft size={14} />Artifacts</button>
            <div className="gd-d-meta"><span>{a.kind}</span><span>·</span><span>{fmtAt(a.versions[0].at)}</span></div>
            <h1 className="gd-d-title">{a.title}</h1>
            <p className="gf-doc-c">{a.conclusion}</p>
            {a.body.map(p => <p key={p} className="gf-doc-p">{p}</p>)}
            {a.cites.length > 0 && (
              <div className="gf-doc-cites">
                <span className="gf-insp-k">근거</span>
                {a.cites.map(c => <button key={c.id} type="button" onClick={() => navigate(`/withset/library/${c.id}`)}>{c.label}<ArrowRight size={12} className="gd-arrow" aria-hidden /></button>)}
              </div>
            )}
            {a.next && <button type="button" className="gd-btn-pill gd-btn-inline gf-doc-next" onClick={() => navigate(a.next!.to)}>{a.next.label}</button>}
          </article>

          <aside className="gd-aside">
            <div className="gd-panel ar-panel">
              <div className="gf-insp-k">만든 곳</div>
              <button type="button" className="ar-link" onClick={() => navigate(a.source.path)}>
                {a.source.type === 'workflow' ? <Workflow size={13} aria-hidden /> : <MessageSquare size={13} aria-hidden />}
                <span>{a.source.label}</span><ArrowRight size={12} className="gd-arrow" aria-hidden />
              </button>
              {sk && (
                <>
                  <div className="gf-insp-k ar-gap">사용한 Skill</div>
                  <button type="button" className="ar-link" onClick={() => navigate(`/withset/skills/${sk.id}`)}><Sparkles size={13} aria-hidden /><span>{sk.name}</span><ArrowRight size={12} className="gd-arrow" aria-hidden /></button>
                </>
              )}
              {(a.slot || a.scenarios.length > 0) && (
                <>
                  <div className="gf-insp-k ar-gap">관련 시나리오</div>
                  {a.slot && <p className="ar-sub ar-strong">{a.slot}</p>}
                  {a.scenarios.map(s => <p key={s} className="ar-sub">{findScenario(s)?.name}</p>)}
                </>
              )}
            </div>
            <div className="gd-panel ar-panel">
              <div className="gf-insp-k">이 자료로 이어서</div>
              <div className="gd-askthis-tips">
                {['광고주용 톤으로 다시 써줘', '근거를 하나 더 붙여줘'].map(t => (
                  <button key={t} type="button" onClick={() => openDock(t)}><ArrowRight size={12} className="gd-arrow" aria-hidden />{t}</button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      <GroundDock origin={{ type: 'artifact', id: a.id, label: a.title, path: `/withset/artifacts/${a.id}` }} />
    </GroundLayout>
  )
}
