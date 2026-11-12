// GroundSkills.tsx — /ground/skills · /ground/skills/:id
// 일하는 방법(Skill)을 모아보고 · 고치고 · 공유하고 · 쓰인 곳을 확인한다. 만드는 건 대화에서.

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, FileText, MessageSquare, Workflow } from 'lucide-react'
import { GroundLayout } from './GroundLayout'
import { GroundDock, openDock } from './GroundDock'
import { listSkills, findSkill, usageOf, skillShareOf, SKILL_SHARE_LABEL, SKILL_SHARE_OVERRIDE, type SkillShare } from './skillData'
import { fmtRunAt } from './flowData'

type Filter = 'all' | 'mine' | 'shared'

export function GroundSkills() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')
  const items = listSkills().filter(s => filter === 'all' || (filter === 'mine' ? s.owner === '신지아' : skillShareOf(s) !== 'private'))

  return (
    <GroundLayout title="Skills - Ground">
      <div className="gd-container gd-page">
        <header className="gd-page-head gf-head">
          <div>
            <h1 className="gd-page-title">Skills</h1>
            <p className="gd-page-sub">자료를 만드는 방법을 저장해 두고 다시 써요. 대화에서 "Skill로 저장"하면 여기 쌓여요.</p>
          </div>
          <div className="gd-segment" role="group" aria-label="보기">
            {([['all', '전체'], ['mine', '내가 만든'], ['shared', '공유된']] as const).map(([k, l]) => (
              <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
        </header>

        <div className="gf-table sk-table" role="table" aria-label="Skills">
          <div className="gf-tr gf-th" role="row">
            <span role="columnheader">이름</span><span role="columnheader">만든 사람</span><span role="columnheader">공유</span><span role="columnheader">쓰인 곳</span><span role="columnheader">최근</span><span />
          </div>
          {items.map(s => {
            const u = usageOf(s)
            return (
              <button key={s.id} type="button" role="row" className="gf-tr gf-row" onClick={() => navigate(`/ground/skills/${s.id}`)}>
                <span className="gf-name" role="cell"><b>{s.name}</b><span>{s.description}</span></span>
                <span role="cell" className="gf-muted">{s.owner}</span>
                <span role="cell"><span className={`ar-share ${skillShareOf(s) === 'org' ? 's-client' : ''}`}>{SKILL_SHARE_LABEL[skillShareOf(s)]}</span></span>
                <span role="cell" className="gf-muted">{u.flows.length || u.artifacts.length ? [u.flows.length && `워크플로우 ${u.flows.length}`, u.artifacts.length && `Artifacts ${u.artifacts.length}`].filter(Boolean).join(' · ') : '—'}</span>
                <span role="cell" className="gf-muted">v{s.versions[0].v} · {fmtRunAt(s.versions[0].at).split(' ')[0]}</span>
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
  const [share, setShare] = useState<SkillShare | undefined>(s && skillShareOf(s))

  if (!s) {
    return (
      <GroundLayout title="Skills - Ground">
        <div className="gd-container gd-page">
          <button type="button" className="gd-back" onClick={() => navigate('/ground/skills')}><ArrowLeft size={14} />Skills</button>
          <h1 className="gd-d-title" style={{ marginTop: 24, fontSize: 24 }}>Skill을 찾을 수 없어요</h1>
        </div>
      </GroundLayout>
    )
  }
  const u = usageOf(s)
  const setLevel = (l: SkillShare) => { SKILL_SHARE_OVERRIDE.set(s.id, l); setShare(l) }

  return (
    <GroundLayout title={`${s.name} - Ground`}>
      <div className="gd-container">
        <div className="gd-detail">
          <article>
            <button type="button" className="gd-back" onClick={() => navigate('/ground/skills')}><ArrowLeft size={14} />Skills</button>
            <div className="gd-d-meta"><span>Skill</span><span>·</span><span>v{s.versions[0].v}</span><span>·</span><span>{s.owner}</span></div>
            <h1 className="gd-d-title">{s.name}</h1>

            <section className="sk-sec" aria-labelledby="sk-when">
              <h2 id="sk-when" className="sk-h">언제 쓰나</h2>
              <p className="gf-doc-p sk-when">{s.description}</p>
              <p className="sk-note">SpinX는 이 설명을 보고 요청에 맞는 Skill을 골라 써요.</p>
            </section>

            <section className="sk-sec" aria-labelledby="sk-how">
              <h2 id="sk-how" className="sk-h">어떻게 만드나</h2>
              <ol className="sk-steps">
                {s.instructions.map((x, i) => <li key={i}><span className="gd-wf-no">{i + 1}</span><span>{x}</span></li>)}
              </ol>
              <p className="sk-note">결과 형식 · {s.output}</p>
            </section>

            <section className="sk-sec" aria-labelledby="sk-used">
              <h2 id="sk-used" className="sk-h">쓰인 곳</h2>
              {!u.flows.length && !u.artifacts.length && <p className="sk-note">아직 쓰인 곳이 없어요.</p>}
              <div className="gf-doc-cites sk-used">
                {u.flows.map(f => <button key={f.id} type="button" onClick={() => navigate(`/ground/flow/${f.id}`)}><Workflow size={13} aria-hidden />{f.name}<ArrowRight size={12} className="gd-arrow" aria-hidden /></button>)}
                {u.artifacts.map(a => <button key={a.id} type="button" onClick={() => navigate(`/ground/artifacts/${a.id}`)}><FileText size={13} aria-hidden />{a.title}<ArrowRight size={12} className="gd-arrow" aria-hidden /></button>)}
              </div>
            </section>
          </article>

          <aside className="gd-aside">
            <div className="gd-panel ar-panel">
              {s.source && (
                <>
                  <div className="gf-insp-k">만든 곳</div>
                  <button type="button" className="ar-link" onClick={() => navigate(s.source!.path)}><MessageSquare size={13} aria-hidden /><span>{s.source.label}</span><ArrowRight size={12} className="gd-arrow" aria-hidden /></button>
                </>
              )}
              <div className={`gf-insp-k ${s.source ? 'ar-gap' : ''}`}>공유</div>
              <div className="gd-segment ar-seg" role="group" aria-label="공유 범위">
                {(['private', 'team', 'org'] as const).map(l => <button key={l} type="button" aria-pressed={share === l} onClick={() => setLevel(l)}>{SKILL_SHARE_LABEL[l]}</button>)}
              </div>
              {share === 'org' && <p className="ar-sub">전사 공유 Skill은 담당 팀 검토 후 SpinX 기본 목록에 올라가요.</p>}
            </div>

            <div className="gd-panel ar-panel">
              <div className="gf-insp-k">버전 {s.versions.length}</div>
              <ol className="ar-vers">
                {s.versions.map((x, i) => (
                  <li key={x.v}>
                    <button type="button" aria-pressed={i === 0}>
                      <span className="ar-v">v{x.v}</span>
                      <span className="ar-vn">{x.note}</span>
                      <span className="ar-vd">{x.by} · {fmtRunAt(x.at)}</span>
                    </button>
                  </li>
                ))}
              </ol>
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
      <GroundDock origin={{ type: 'skill', id: s.id, label: s.name, path: `/ground/skills/${s.id}` }} />
    </GroundLayout>
  )
}
