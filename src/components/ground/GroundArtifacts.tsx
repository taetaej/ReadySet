// GroundArtifacts.tsx — /ground/artifacts · /ground/artifacts/:id
// Artifacts: 대화 · 워크플로우에서 만든 자료. 출처로 돌아갈 수 있고, 공유 상태와 버전을 가진다.

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, MessageSquare, Workflow } from 'lucide-react'
import { GroundLayout } from './GroundLayout'
import { GroundDock, openDock } from './GroundDock'
import { listArtifacts, findArtifact, SHARE_LABEL, SHARE_OVERRIDE, shareOf, fmtAt, type ShareLevel } from './artifactData'
import { findScenario } from './groundData'
import { findSkillByName } from './skillData'

type Filter = 'all' | 'workflow' | 'chat'

export function GroundArtifacts() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')
  const all = listArtifacts()
  const items = all.filter(a => filter === 'all' || a.source.type === filter)

  return (
    <GroundLayout title="Artifacts - Ground">
      <div className="gd-container gd-page">
        <header className="gd-page-head gf-head">
          <div>
            <h1 className="gd-page-title">Artifacts</h1>
            <p className="gd-page-sub">대화와 워크플로우에서 만든 자료예요. 워크플로우가 다시 돌면 버전이 늘어나요.</p>
          </div>
          <div className="gd-segment" role="group" aria-label="출처">
            {([['all', '전체'], ['workflow', '워크플로우'], ['chat', '대화']] as const).map(([k, l]) => (
              <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
        </header>

        <div className="gf-table ar-table" role="table" aria-label="Artifacts">
          <div className="gf-tr gf-th" role="row">
            <span role="columnheader">이름</span><span role="columnheader">출처</span><span role="columnheader">슬롯</span><span role="columnheader">근거</span><span role="columnheader">공유</span><span role="columnheader">최근</span><span />
          </div>
          {items.map(a => (
            <button key={a.id} type="button" role="row" className="gf-tr gf-row" onClick={() => navigate(`/ground/artifacts/${a.id}`)}>
              <span className="gf-name" role="cell"><b>{a.title}</b><span>{a.kind}{a.skill && ` · Skill: ${a.skill}`}</span></span>
              <span role="cell" className="gf-muted ar-src">
                {a.source.type === 'workflow' ? <Workflow size={12} aria-hidden /> : <MessageSquare size={12} aria-hidden />}
                <span>{a.source.label}</span>
              </span>
              <span role="cell" className="gf-muted">{a.slot ?? '—'}</span>
              <span role="cell" className="gf-muted">{a.cites.length}건</span>
              <span role="cell"><span className={`ar-share s-${shareOf(a)}`}>{SHARE_LABEL[shareOf(a)]}</span></span>
              <span role="cell" className="gf-muted">v{a.versions[0].v} · {fmtAt(a.versions[0].at).split(' ')[0]}</span>
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
  const [share, setShare] = useState<ShareLevel | undefined>(a && shareOf(a))
  const [v, setV] = useState(0)

  if (!a) {
    return (
      <GroundLayout title="Artifacts - Ground">
        <div className="gd-container gd-page">
          <button type="button" className="gd-back" onClick={() => navigate('/ground/artifacts')}><ArrowLeft size={14} />Artifacts</button>
          <h1 className="gd-d-title" style={{ marginTop: 24, fontSize: 24 }}>자료를 찾을 수 없어요</h1>
        </div>
      </GroundLayout>
    )
  }
  const ver = a.versions[v]
  const latest = v === 0
  const setLevel = (l: ShareLevel) => { SHARE_OVERRIDE.set(a.id, l); setShare(l) }

  return (
    <GroundLayout title={`${a.title} - Ground`}>
      <div className="gd-container">
        <div className="gd-detail">
          <article>
            <button type="button" className="gd-back" onClick={() => navigate('/ground/artifacts')}><ArrowLeft size={14} />Artifacts</button>
            <div className="gd-d-meta">
              <span>{a.kind}</span><span>·</span><span>v{ver.v}</span><span>·</span><span>{fmtAt(ver.at)}</span>
            </div>
            <h1 className="gd-d-title">{a.title}</h1>
            {latest ? (
              <>
                <p className="gf-doc-c">{a.conclusion}</p>
                {a.body.map(p => <p key={p} className="gf-doc-p">{p}</p>)}
                {a.cites.length > 0 && (
                  <div className="gf-doc-cites">
                    <span className="gf-insp-k">근거</span>
                    {a.cites.map(c => <button key={c.id} type="button" onClick={() => navigate(`/ground/library/${c.id}`)}>{c.label}<ArrowRight size={12} className="gd-arrow" aria-hidden /></button>)}
                  </div>
                )}
                {a.next && <button type="button" className="gd-btn-pill gd-btn-inline gf-doc-next" onClick={() => navigate(a.next!.to)}>{a.next.label}</button>}
              </>
            ) : (
              <>
                <p className="gf-doc-p">{ver.note}</p>
                <p className="gf-doc-p gd-muted">지난 버전이라 요약만 남아 있어요.</p>
              </>
            )}
          </article>

          <aside className="gd-aside">
            <div className="gd-panel ar-panel">
              <div className="gf-insp-k">출처</div>
              <button type="button" className="ar-link" onClick={() => navigate(a.source.path)}>
                {a.source.type === 'workflow' ? <Workflow size={13} aria-hidden /> : <MessageSquare size={13} aria-hidden />}
                <span>{a.source.label}</span><ArrowRight size={12} className="gd-arrow" aria-hidden />
              </button>
              {a.skill && (() => { const sk = findSkillByName(a.skill!); return sk ? <button type="button" className="ar-sub ar-sklink" onClick={() => navigate(`/ground/skills/${sk.id}`)}>Skill · {a.skill}<ArrowRight size={11} className="gd-arrow" aria-hidden /></button> : <p className="ar-sub">Skill · {a.skill}</p> })()}
              {(a.slot || a.scenarios.length > 0) && (
                <>
                  <div className="gf-insp-k ar-gap">연결</div>
                  {a.slot && <p className="ar-sub ar-strong">{a.slot}</p>}
                  {a.scenarios.map(s => <p key={s} className="ar-sub">{findScenario(s)?.name}</p>)}
                </>
              )}
              <div className="gf-insp-k ar-gap">공유</div>
              <div className="gd-segment ar-seg" role="group" aria-label="공유 상태">
                {(['private', 'team', 'client'] as const).map(l => <button key={l} type="button" aria-pressed={share === l} onClick={() => setLevel(l)}>{SHARE_LABEL[l]}</button>)}
              </div>
              {share === 'client' && <p className="ar-sub">광고주 공유 시 임직원 전용 근거는 빠져요.</p>}
            </div>

            <div className="gd-panel ar-panel">
              <div className="gf-insp-k">버전 {a.versions.length}</div>
              <ol className="ar-vers">
                {a.versions.map((x, i) => (
                  <li key={x.v}>
                    <button type="button" aria-pressed={i === v} onClick={() => setV(i)}>
                      <span className="ar-v">v{x.v}</span>
                      <span className="ar-vn">{x.note}</span>
                      <span className="ar-vd">{fmtAt(x.at)}</span>
                    </button>
                  </li>
                ))}
              </ol>
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
      <GroundDock origin={{ type: 'artifact', id: a.id, label: a.title, path: `/ground/artifacts/${a.id}` }} />
    </GroundLayout>
  )
}
