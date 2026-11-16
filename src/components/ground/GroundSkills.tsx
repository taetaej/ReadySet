// GroundSkills.tsx — /withset/skills · /withset/skills/:id
// Skill = 자료를 만드는 "방법". 언제 쓰는지 · 어떻게 만드는지 · 어디에 쓰였는지만 보여준다. 만드는 건 대화에서.

import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, FileText, MessageSquare, Workflow } from 'lucide-react'
import { GroundLayout } from './GroundLayout'
import { GroundDock, openDock } from './GroundDock'
import { listSkills, findSkill, usageOf } from './skillData'

export function GroundSkills() {
  const navigate = useNavigate()
  const items = listSkills()

  return (
    <GroundLayout title="Skills - WithSet">
      <div className="gd-container gd-page">
        <header className="gd-page-head">
          <h1 className="gd-page-title">Skills</h1>
          <p className="gd-page-sub">자료를 만드는 방법을 저장해 두고 다시 써요. SpinX가 요청에 맞는 Skill을 골라 써요.</p>
        </header>

        <div className="gf-table sk-table" role="table" aria-label="Skills">
          <div className="gf-tr gf-th" role="row">
            <span role="columnheader">이름</span><span role="columnheader">쓰인 곳</span><span role="columnheader">만든 사람</span><span />
          </div>
          {items.map(s => {
            const u = usageOf(s)
            return (
              <button key={s.id} type="button" role="row" className="gf-tr gf-row" onClick={() => navigate(`/withset/skills/${s.id}`)}>
                <span className="gf-name" role="cell"><b>{s.name}</b><span>{s.description}</span></span>
                <span role="cell" className="gf-muted">{u.flows.length + u.artifacts.length ? `${u.flows.length + u.artifacts.length}곳` : '—'}</span>
                <span role="cell" className="gf-muted">{s.owner}</span>
                <ArrowRight size={13} className="gd-arrow" aria-hidden />
              </button>
            )
          })}
        </div>
      </div>
    </GroundLayout>
  )
}

export function SkillDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const s = findSkill(id)

  if (!s) {
    return (
      <GroundLayout title="Skills - WithSet">
        <div className="gd-container gd-page">
          <button type="button" className="gd-back" onClick={() => navigate('/withset/skills')}><ArrowLeft size={14} />Skills</button>
          <h1 className="gd-d-title" style={{ marginTop: 24, fontSize: 24 }}>Skill을 찾을 수 없어요</h1>
        </div>
      </GroundLayout>
    )
  }
  const u = usageOf(s)

  return (
    <GroundLayout title={`${s.name} - WithSet`}>
      <div className="gd-container">
        <div className="gd-detail">
          <article>
            <button type="button" className="gd-back" onClick={() => navigate('/withset/skills')}><ArrowLeft size={14} />Skills</button>
            <div className="gd-d-meta"><span>Skill</span><span>·</span><span>{s.owner}</span></div>
            <h1 className="gd-d-title">{s.name}</h1>

            <section className="sk-sec" aria-labelledby="sk-when">
              <h2 id="sk-when" className="sk-h">언제 쓰나</h2>
              <p className="gf-doc-p sk-when">{s.description}</p>
            </section>

            <section className="sk-sec" aria-labelledby="sk-how">
              <h2 id="sk-how" className="sk-h">어떻게 만드나</h2>
              <ol className="sk-steps">
                {s.instructions.map((x, i) => <li key={i}><span className="gd-wf-no">{i + 1}</span><span>{x}</span></li>)}
              </ol>
              <p className="sk-note">결과 형식 · {s.output}</p>
            </section>
          </article>

          <aside className="gd-aside">
            <div className="gd-panel ar-panel">
              <div className="gf-insp-k">쓰인 곳</div>
              {!u.flows.length && !u.artifacts.length && <p className="ar-sub">아직 쓰인 곳이 없어요.</p>}
              {u.flows.map(f => <button key={f.id} type="button" className="ar-link" onClick={() => navigate(`/withset/flow/${f.id}`)}><Workflow size={13} aria-hidden /><span>{f.name}</span><ArrowRight size={12} className="gd-arrow" aria-hidden /></button>)}
              {u.artifacts.map(a => <button key={a.id} type="button" className="ar-link" onClick={() => navigate(`/withset/artifacts/${a.id}`)}><FileText size={13} aria-hidden /><span>{a.title}</span><ArrowRight size={12} className="gd-arrow" aria-hidden /></button>)}
              {s.source && (
                <>
                  <div className="gf-insp-k ar-gap">만든 곳</div>
                  <button type="button" className="ar-link" onClick={() => navigate(s.source!.path)}><MessageSquare size={13} aria-hidden /><span>{s.source.label}</span><ArrowRight size={12} className="gd-arrow" aria-hidden /></button>
                </>
              )}
            </div>
            <div className="gd-panel ar-panel">
              <div className="gf-insp-k">대화로 고치기</div>
              <div className="gd-askthis-tips">
                {['결론을 더 짧게 쓰도록 바꿔줘', '이 Skill로 하나 만들어줘'].map(t => (
                  <button key={t} type="button" onClick={() => openDock(t)}><ArrowRight size={12} className="gd-arrow" aria-hidden />{t}</button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      <GroundDock origin={{ type: 'skill', id: s.id, label: s.name, path: `/withset/skills/${s.id}` }} />
    </GroundLayout>
  )
}
