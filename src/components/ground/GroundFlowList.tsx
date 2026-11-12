// GroundFlowList.tsx — /ground/flow
// 워크플로우 목록. 만드는 건 대화에서 (SpinX가 실행하면 곧 워크플로우가 된다)

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { GroundLayout } from './GroundLayout'
import { FLOWS, DRAFTS, NODE_META, fmtRunAt, type Flow, type RunStatus } from './flowData'
import { FlowIcon } from './GroundFlowEditor'

export const STATUS_LABEL: Record<RunStatus, string> = { success: '완료', running: '실행 중', failed: '멈춤', paused: '일시정지' }

export function GroundFlowList() {
  const navigate = useNavigate()
  // 대화에서 실행하면 목록에 바로 반영
  const [, bump] = useState(0)
  useEffect(() => { const on = () => bump(x => x + 1); window.addEventListener('ground:flows', on); return () => window.removeEventListener('ground:flows', on) }, [])
  // 기록이 있는 것만 (캔버스에서 고치기로 열었다가 실행 안 한 초안은 제외)
  const flows: Flow[] = [...[...DRAFTS.values()].filter(f => f.runs.length).reverse(), ...FLOWS]


  return (
    <GroundLayout title="Workflows - Ground">
      <div className="gf-page">
        <header className="gf-head">
          <div>
            <h1 className="gd-page-title">Workflows</h1>
            <p className="gd-page-sub">대화에서 SpinX가 실행한 일이 여기 쌓여요. 켜두면 새 소식이 들어올 때 다시 돌아요.</p>
          </div>
        </header>

        <section aria-labelledby="gf-list-h">
          <header className="gd-sec gd-wl-head">
            <div className="gd-sec-row"><h2 id="gf-list-h" className="gd-sec-t">내 워크플로우</h2><span className="gd-count" style={{ marginLeft: 8 }}>{flows.length}</span></div>
          </header>
          <div className="gf-table" role="table" aria-label="내 워크플로우">
            <div className="gf-tr gf-th" role="row">
              <span role="columnheader">이름</span><span role="columnheader">시작</span><span role="columnheader">노드</span><span role="columnheader">마지막 실행</span><span role="columnheader">상태</span><span />
            </div>
            {flows.map(f => {
              const last = f.runs[0]
              return (
                <button key={f.id} type="button" role="row" className="gf-tr gf-row" onClick={() => navigate(`/ground/flow/${f.id}${last ? '?tab=runs' : ''}`)}>
                  <span className="gf-name" role="cell"><b>{f.name}</b><span>{f.desc || '설명 없음'}</span></span>
                  <span role="cell" className="gf-muted">{f.trigger}</span>
                  <span role="cell" className="gf-start-chain gf-chain-ic" aria-label={f.nodes.map(n => NODE_META[n.kind].label).join(' → ')}>
                    {[...f.nodes].sort((x, y) => x.y - y.y || x.x - y.x).map(n => <span key={n.id} className="gf-start-n" title={NODE_META[n.kind].label}><FlowIcon kind={n.kind} size={11} /></span>)}
                  </span>
                  <span role="cell" className="gf-muted">
                    {last ? <><span className={`gf-dot s-${last.status}`} aria-hidden />{fmtRunAt(last.at)} · {STATUS_LABEL[last.status]}<span className="gf-last">{last.summary}</span></> : '아직 없음'}
                  </span>
                  <span role="cell"><span className={`gf-on ${f.status === 'on' ? 'is-on' : ''}`}>{f.status === 'on' ? '켜짐' : '꺼짐'}</span></span>
                  <ArrowRight size={13} className="gd-arrow" aria-hidden />
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </GroundLayout>
  )
}
