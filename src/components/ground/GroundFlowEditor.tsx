// GroundFlowEditor.tsx — /ground/flow/:flowId
// 캔버스(노드 추가 · 드래그 · 연결) + 오른쪽 설정 패널 + 실행 결과
// 노드 디자인은 인사이트 맵 문법을 잇는다: 무채색 · 1px · 그린은 결론에만

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock, Play, PlusSquare, RefreshCw, Send, Trash2, X, Zap, Hand } from 'lucide-react'
import { GroundLayout } from './GroundLayout'
import { SpinXOrb } from '../spinx/SpinXOrb'
import { DRAFTS, FLOWS, NODE_DEFAULT, NODE_META, PALETTE, findFlow, fmtRunAt, type Flow, type FlowEdge, type FlowNode, type FlowNodeKind, type FlowRun } from './flowData'
import { STATUS_LABEL } from './GroundFlowList'
import { findSkillByName } from './skillData'
import type { FlowPatch } from './groundTypes'

const NW = 240
const NH = 66

export function FlowIcon({ kind, size = 15 }: { kind: FlowNodeKind; size?: number }) {
  const p = { size, 'aria-hidden': true } as const
  switch (kind) {
    case 'schedule': return <Clock {...p} />
    case 'event': return <Zap {...p} />
    case 'manual': return <Hand {...p} />
    case 'scenarioCreate': return <PlusSquare {...p} />
    case 'scenarioRun': return <RefreshCw {...p} />
    case 'library': return <BookOpen {...p} />
    case 'llm': return <SpinXOrb size={size + 3} motion="static" title="" />
    case 'output': return <Send {...p} />
  }
}

type NodeState = 'idle' | 'running' | 'done' | 'failed' | 'skipped'

export function GroundFlowEditor() {
  const { flowId = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const src = DRAFTS.get(flowId) ?? findFlow(flowId)
  const [flow, setFlow] = useState<Flow | undefined>(() => (src ? structuredClone(src) : undefined))
  const [sel, setSel] = useState<string | null>(null)
  const [run, setRun] = useState<Record<string, NodeState> | null>(null)
  const [runIdx, setRunIdx] = useState(0)
  const tab = params.get('tab') === 'runs' ? 'runs' : 'canvas'
  const fresh = (location.state as { fresh?: boolean } | null)?.fresh
  const fromChat = (location.state as { fromChat?: boolean } | null)?.fromChat

  // 대화에서 온 수정 제안 적용 — 같은 화면이면 이벤트, 다른 화면에서 왔으면 location.state
  const applyPatch = (p: FlowPatch) => {
    setFlow(f => {
      if (!f || f.id !== p.flowId) return f
      let nodes = f.nodes.map(n => {
        const c = p.changes.find(x => x.nodeId === n.id)
        if (!c) return n
        const config = c.config ? [...n.config.filter(x => !c.config!.some(y => y.k === x.k)), ...c.config] : n.config
        return { ...n, title: c.title, sub: c.sub ?? n.sub, config }
      })
      let edges = f.edges
      if (p.add) {
        const after = nodes.find(n => n.id === p.add!.after)
        const id = `n${Date.now().toString(36)}`
        nodes = [...nodes, { id, kind: p.add.kind, title: p.add.title, sub: p.add.sub, x: after?.x ?? 200, y: (after?.y ?? 0) + 130, config: structuredClone(NODE_DEFAULT[p.add.kind].config) }]
        edges = [...edges, { from: p.add.after, to: id }]
        setSel(id)
      } else if (p.changes[0]) setSel(p.changes[0].nodeId)
      return { ...f, nodes, edges }
    })
    setParams({}, { replace: true })
    setPatched(true)
  }
  const [patched, setPatched] = useState(false)
  useEffect(() => {
    const on = (e: Event) => applyPatch((e as CustomEvent<FlowPatch>).detail)
    window.addEventListener('ground:apply-patch', on)
    const st = (location.state as { patch?: FlowPatch } | null)?.patch
    if (st) applyPatch(st)
    return () => window.removeEventListener('ground:apply-patch', on)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 수정은 세션 동안 유지 (목업)
  useEffect(() => { if (flow) { const i = FLOWS.findIndex(f => f.id === flow.id); if (i >= 0) FLOWS[i] = flow; else DRAFTS.set(flow.id, flow) } }, [flow])
  useEffect(() => { document.title = `${flow?.name ?? '워크플로우'} - Ground` }, [flow?.name])

  if (!flow) {
    return <GroundLayout title="Workflows - Ground"><div className="gf-page"><p className="gd-page-sub">워크플로우를 찾을 수 없어요.</p></div></GroundLayout>
  }

  const update = (p: Partial<Flow>) => setFlow(f => (f ? { ...f, ...p } : f))
  const setNode = (id: string, p: Partial<FlowNode>) => setFlow(f => (f ? { ...f, nodes: f.nodes.map(n => (n.id === id ? { ...n, ...p } : n)) } : f))
  const selNode = flow.nodes.find(n => n.id === sel)

  const addNode = (kind: FlowNodeKind) => {
    const from = selNode ?? [...flow.nodes].sort((a, b) => b.y - a.y)[0]
    const id = `n${Date.now().toString(36)}`
    const y = from ? from.y + 130 : 40
    const x = from ? from.x : 200
    const n: FlowNode = { id, kind, ...structuredClone(NODE_DEFAULT[kind]), x, y }
    setFlow(f => (f ? { ...f, nodes: [...f.nodes, n], edges: from ? [...f.edges, { from: from.id, to: id }] : f.edges } : f))
    setSel(id)
  }
  const removeNode = (id: string) => {
    setFlow(f => (f ? { ...f, nodes: f.nodes.filter(n => n.id !== id), edges: f.edges.filter(e => e.from !== id && e.to !== id) } : f))
    setSel(null)
  }

  // 실행 — 위에서 아래로, 같은 줄은 함께. 멈추는 노드가 있으면 그 뒤는 건너뜀
  const start = () => {
    const rows = [...new Set(flow.nodes.map(n => n.y))].sort((a, b) => a - b)
    const willFail = flow.id === 'FL-04' ? 'b' : null
    const st: Record<string, NodeState> = Object.fromEntries(flow.nodes.map(n => [n.id, 'idle']))
    setRun({ ...st }); setParams({}, { replace: true }); setSel(null)
    let failed = false
    rows.forEach((y, i) => {
      setTimeout(() => {
        flow.nodes.filter(n => n.y === y).forEach(n => { st[n.id] = failed ? 'skipped' : 'running' })
        setRun({ ...st })
      }, i * 520)
      setTimeout(() => {
        flow.nodes.filter(n => n.y === y).forEach(n => {
          if (st[n.id] === 'skipped') return
          if (n.id === willFail) { st[n.id] = 'failed'; failed = true } else st[n.id] = 'done'
        })
        setRun({ ...st })
        if (i === rows.length - 1) finish(failed)
      }, i * 520 + 440)
    })
  }
  const finish = (failed: boolean) => {
    const base = FLOWS[0]
    const now = new Date()
    const at = `2026-11-04 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const r: FlowRun = failed
      ? { id: `r${Date.now()}`, at, status: 'failed', duration: '1.2초', summary: 'DataShot 데이터셋 갱신 대기' }
      : { id: `r${Date.now()}`, at, status: 'success', duration: `${(flow.nodes.length * 2.4).toFixed(1)}초`, summary: flow.runs[0]?.summary ?? '결과 1건' }
    setTimeout(() => {
      setFlow(f => {
        if (!f) return f
        // 처음 돌린 초안은 주간 점검 결과를 예시로 채운다
        const nodes = f.nodes.map(n => {
          if (NODE_META[n.kind].group === '시작') return { ...n, result: `${fmtRunAt(at)} 시작`, ms: 0 }
          return n.result ? n : { ...n, result: base.nodes.find(x => x.kind === n.kind)?.result ?? '완료', ms: base.nodes.find(x => x.kind === n.kind)?.ms ?? 400 }
        })
        return { ...f, nodes, runs: [r, ...f.runs], output: f.output ?? (failed ? undefined : base.output) }
      })
      setRunIdx(0); setRun(null); setParams({ tab: 'runs' })
    }, 500)
  }

  return (
    <GroundLayout title={`${flow.name} - Ground`}>
      <div className="gf-editor">
        <header className="gf-bar">
          <button type="button" className="gf-back" onClick={() => navigate('/ground/flow')} aria-label="Workflows"><ArrowLeft size={15} /></button>
          <div className="gf-bar-name">
            <label htmlFor="gf-name" className="gd-sr">워크플로우 이름</label>
            <input id="gf-name" value={flow.name} onChange={e => update({ name: e.target.value })} />
            <span>{flow.trigger} · 노드 {flow.nodes.length}</span>
          </div>
          <div className="gf-tabs" role="tablist" aria-label="보기">
            <button type="button" role="tab" aria-selected={tab === 'canvas'} onClick={() => setParams({}, { replace: true })}>캔버스</button>
            <button type="button" role="tab" aria-selected={tab === 'runs'} onClick={() => setParams({ tab: 'runs' }, { replace: true })}>실행 결과{flow.runs.length > 0 && <span className="gd-count">{flow.runs.length}</span>}</button>
          </div>
          <button type="button" role="switch" aria-checked={flow.status === 'on'} className="ob-toggle gf-onoff" onClick={() => update({ status: flow.status === 'on' ? 'off' : 'on' })}>
            <span className="ob-toggle-l">{flow.status === 'on' ? '켜짐' : '꺼짐'}</span><span className="ob-switch" aria-hidden />
          </button>
          <button type="button" className="gd-btn-pill gd-btn-inline gf-run" disabled={!!run} onClick={start}>
            <Play size={15} aria-hidden />{run ? '실행 중…' : '지금 실행'}
          </button>
        </header>

        {patched && tab === 'canvas' && <div className="gf-note" role="status">SpinX가 제안한 수정을 캔버스에 적용했어요. 바뀐 노드를 선택해 뒀어요.</div>}
        {fromChat && !patched && tab === 'canvas' && (
          <div className="gf-note" role="status">대화에서 SpinX가 짠 단계예요. 시작 노드를 이벤트나 스케줄로 바꾸고 켜두면 알아서 다시 돌아요.</div>
        )}
        {tab === 'canvas'
          ? <Canvas flow={flow} sel={sel} setSel={setSel} setNode={setNode} run={run} addNode={addNode} fresh={!!fresh && flow.runs.length === 0}
              inspector={<Inspector flow={flow} node={selNode} setNode={setNode} remove={removeNode} close={() => setSel(null)} update={update} />} />
          : <Runs flow={flow} idx={runIdx} setIdx={setRunIdx} onCanvas={() => setParams({}, { replace: true })} />}
      </div>
    </GroundLayout>
  )
}

// ─────────────────────────────────────────────
// 캔버스
// ─────────────────────────────────────────────
function Canvas({ flow, sel, setSel, setNode, run, addNode, inspector, fresh }: {
  flow: Flow; sel: string | null; setSel: (id: string | null) => void; setNode: (id: string, p: Partial<FlowNode>) => void
  run: Record<string, NodeState> | null; addNode: (k: FlowNodeKind) => void; inspector: React.ReactNode; fresh: boolean
}) {
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const drag = useRef<{ id?: string; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null)
  const wrap = useRef<HTMLDivElement>(null)

  // 노드 묶음을 캔버스 가운데로 — 처음, 그리고 캔버스 폭이 바뀔 때(SpinX 패널 열고 닫기)
  const nodesRef = useRef(flow.nodes); nodesRef.current = flow.nodes
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const center = () => {
      const ns = nodesRef.current
      if (!ns.length) return
      const x0 = Math.min(...ns.map(n => n.x)), x1 = Math.max(...ns.map(n => n.x)) + NW
      setPan(p => ({ x: Math.round((el.clientWidth - (x1 - x0)) / 2 - x0), y: p.y || 24 }))
    }
    center()
    const ro = new ResizeObserver(center)
    ro.observe(el)
    return () => ro.disconnect()
  }, [flow.id])

  const onDown = (e: React.PointerEvent, id?: string) => {
    e.stopPropagation()
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
    const n = id ? flow.nodes.find(x => x.id === id)! : null
    drag.current = { id, sx: e.clientX, sy: e.clientY, ox: n ? n.x : pan.x, oy: n ? n.y : pan.y, moved: false }
  }
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true
    if (!d.moved) return
    if (d.id) setNode(d.id, { x: Math.round((d.ox + dx) / 10) * 10, y: Math.round((d.oy + dy) / 10) * 10 })
    else setPan({ x: d.ox + dx, y: d.oy + dy })
  }
  const onUp = () => {
    const d = drag.current
    drag.current = null
    if (d && !d.moved) setSel(d.id ?? null)
  }

  const byId = useMemo(() => new Map(flow.nodes.map(n => [n.id, n])), [flow.nodes])
  const groups = PALETTE.reduce<Record<string, FlowNodeKind[]>>((m, k) => { (m[NODE_META[k].group] ||= []).push(k); return m }, {})
  const maxY = Math.max(0, ...flow.nodes.map(n => n.y)) + NH + 80

  return (
    <div className="gf-work">
      <div ref={wrap} className="gf-canvas" onPointerDown={e => onDown(e)} onPointerMove={onMove} onPointerUp={onUp}>
        <div className="gf-plane" style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
          <svg className="gf-edges" width={1200} height={maxY} aria-hidden>
            {flow.edges.map((e: FlowEdge) => {
              const a = byId.get(e.from), b = byId.get(e.to)
              if (!a || !b) return null
              const x1 = a.x + NW / 2, y1 = a.y + NH, x2 = b.x + NW / 2, y2 = b.y
              const my = (y1 + y2) / 2
              const st = run?.[b.id]
              const on = st === 'running' || st === 'done' || (!run && (sel === a.id || sel === b.id))
              return <path key={`${e.from}-${e.to}`} d={`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`} className={`gf-edge ${on ? 'is-on' : ''} ${st === 'running' ? 'is-flow' : ''}`} />
            })}
          </svg>
          {flow.nodes.map(n => {
            const st = run?.[n.id] ?? 'idle'
            const trigger = NODE_META[n.kind].group === '시작'
            return (
              <div key={n.id} className={`gf-node k-${n.kind} ${trigger ? 'is-trigger' : ''} ${sel === n.id ? 'is-sel' : ''} st-${st}`}
                style={{ left: n.x, top: n.y, width: NW, height: NH }}
                role="button" tabIndex={0} aria-label={`${NODE_META[n.kind].label}: ${n.title}`} aria-pressed={sel === n.id}
                onPointerDown={e => onDown(e, n.id)} onKeyDown={e => { if (e.key === 'Enter') setSel(n.id) }}>
                <span className="gf-port is-in" aria-hidden /><span className="gf-port is-out" aria-hidden />
                <span className="gf-node-ic"><FlowIcon kind={n.kind} /></span>
                <span className="gf-node-body">
                  <span className="gf-node-k">{NODE_META[n.kind].label}</span>
                  <span className="gf-node-t">{n.title}</span>
                  <span className="gf-node-s">{n.sub}</span>
                </span>
                {st !== 'idle' && (
                  <span className="gf-node-st" aria-label={st}>
                    {st === 'running' && <span className="gf-spin" />}
                    {st === 'done' && <Check size={13} />}
                    {st === 'failed' && <X size={13} />}
                    {st === 'skipped' && <span className="gf-skip">건너뜀</span>}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* 팔레트 — 누르면 선택한 노드(없으면 맨 아래) 다음에 붙는다 */}
        <nav className="gf-palette" aria-label="노드 추가" onPointerDown={e => e.stopPropagation()}>
          {Object.entries(groups).map(([g, ks]) => (
            <div key={g} className="gf-pal-g">
              <span className="gf-pal-h">{g}</span>
              {ks.map(k => <button key={k} type="button" onClick={() => addNode(k)}><FlowIcon kind={k} size={14} />{NODE_META[k].label}</button>)}
            </div>
          ))}
        </nav>
        {fresh && flow.nodes.length <= 1 && <p className="gf-hint">왼쪽에서 노드를 누르면 아래로 이어 붙어요. 노드는 끌어서 옮길 수 있어요.</p>}
        <span className="gf-canvas-tip">빈 곳을 끌어 이동</span>
      </div>
      {inspector}
    </div>
  )
}

// ─────────────────────────────────────────────
// 오른쪽 설정 패널
// ─────────────────────────────────────────────
function Inspector({ flow, node, setNode, remove, close, update }: {
  flow: Flow; node?: FlowNode; setNode: (id: string, p: Partial<FlowNode>) => void; remove: (id: string) => void; close: () => void; update: (p: Partial<Flow>) => void
}) {
  const navigate = useNavigate()
  if (!node) {
    return (
      <aside className="gf-insp" aria-label="워크플로우 정보">
        <div className="gf-insp-k">워크플로우</div>
        <label className="gf-field"><span>설명</span>
          <textarea rows={3} value={flow.desc} placeholder="이 워크플로우가 하는 일" onChange={e => update({ desc: e.target.value })} />
        </label>
        <dl className="gd-kv gf-kv">
          <dt>시작</dt><dd>{flow.trigger}</dd>
          <dt>만든 사람</dt><dd>{flow.owner}</dd>
          <dt>마지막 실행</dt><dd>{flow.runs[0] ? `${fmtRunAt(flow.runs[0].at)} · ${STATUS_LABEL[flow.runs[0].status]}` : '아직 없음'}</dd>
        </dl>
        <p className="gf-insp-note">노드를 누르면 여기서 설정해요. 실행할 때마다 거친 리포트 · 시나리오가 인사이트 맵에 경로로 남아요.</p>
      </aside>
    )
  }
  return (
    <aside className="gf-insp" aria-label="노드 설정">
      <div className="gf-insp-top">
        <span className="gf-insp-k"><FlowIcon kind={node.kind} size={13} />{NODE_META[node.kind].label}</span>
        <button type="button" className="gd-map-panel-x" aria-label="닫기" onClick={close}><X size={14} /></button>
      </div>
      <label className="gf-field"><span>이름</span><input value={node.title} onChange={e => setNode(node.id, { title: e.target.value })} /></label>
      {node.config.map((c, i) => (
        <label key={c.k} className="gf-field"><span>{c.k}</span>
          <input value={c.v} onChange={e => setNode(node.id, { config: node.config.map((x, j) => (j === i ? { ...x, v: e.target.value } : x)) })} />
        </label>
      ))}
      {(() => { const k = node.config.find(c => c.k === 'Skill')?.v; const sk = k && findSkillByName(k); return sk ? <button type="button" className="gf-sklink" onClick={() => navigate(`/ground/skills/${sk.id}`)}>Skill 열기 · {sk.name}<ArrowRight size={11} className="gd-arrow" aria-hidden /></button> : null })()}
      {node.result && (
        <div className="gf-insp-res">
          <span className="gf-insp-k">마지막 결과</span>
          <p>{node.result}</p>
          {node.ms !== undefined && node.ms > 0 && <span className="gd-muted">{(node.ms / 1000).toFixed(1)}초</span>}
        </div>
      )}
      <button type="button" className="gf-del" onClick={() => remove(node.id)}><Trash2 size={13} aria-hidden />노드 삭제</button>
    </aside>
  )
}

// ─────────────────────────────────────────────
// 실행 결과
// ─────────────────────────────────────────────
function Runs({ flow, idx, setIdx, onCanvas }: { flow: Flow; idx: number; setIdx: (i: number) => void; onCanvas: () => void }) {
  const navigate = useNavigate()
  const r = flow.runs[idx]
  if (!r) {
    return (
      <div className="gf-runs-empty">
        <p>아직 실행한 적이 없어요.</p>
        <button type="button" className="gd-float-more" onClick={onCanvas}>캔버스로<ArrowRight size={12} className="gd-arrow" aria-hidden /></button>
      </div>
    )
  }
  const latest = idx === 0
  const failed = r.status === 'failed'
  const failAt = failed ? flow.nodes.find(n => n.kind === 'scenarioRun' || n.kind === 'scenarioCreate') : undefined
  const ordered = [...flow.nodes].sort((a, b) => a.y - b.y || a.x - b.x)
  return (
    <div className="gf-runs">
      <aside className="gf-runlist" aria-label="실행 기록">
        {flow.runs.map((x, i) => (
          <button key={x.id} type="button" className={`gf-runrow ${i === idx ? 'is-on' : ''}`} onClick={() => setIdx(i)}>
            <span className="gf-runrow-t"><span className={`gf-dot s-${x.status}`} aria-hidden />{fmtRunAt(x.at)}<span className="gd-muted">{x.duration}</span></span>
            <span className="gf-runrow-s">{x.summary}</span>
          </button>
        ))}
      </aside>

      <article className="gf-doc">
        <div className="gf-doc-k">{fmtRunAt(r.at)} 실행 · {r.duration} · {STATUS_LABEL[r.status]}</div>
        {failed ? (
          <>
            <h2 className="gf-doc-h">{failAt?.title}에서 멈췄어요</h2>
            <p className="gf-doc-p">DataShot 데이터셋이 아직 갱신되지 않아 다시 계산할 수 없었어요. 갱신되면 자동으로 다시 시도해요.</p>
          </>
        ) : latest && flow.output ? (
          <>
            <h2 className="gf-doc-h">{flow.output.title.replace(/^\d+\.\d+(?= )/, fmtRunAt(r.at).split(' ')[0])}</h2>
            <p className="gf-doc-c">{flow.output.conclusion}</p>
            {flow.output.body.map(p => <p key={p} className="gf-doc-p">{p}</p>)}
            <div className="gf-doc-cites">
              <span className="gf-insp-k">근거</span>
              {flow.output.cites.map(c => (
                <button key={c.id} type="button" onClick={() => navigate(`/ground/library/${c.id}`)}>{c.label}<ArrowRight size={12} className="gd-arrow" aria-hidden /></button>
              ))}
            </div>
            <div className="gf-doc-acts">
              {flow.output.next && <button type="button" className="gd-btn-pill gd-btn-inline gf-doc-next" onClick={() => navigate(flow.output!.next!.to)}>{flow.output.next.label}</button>}
              <button type="button" className="gd-wf-save" onClick={() => navigate(`/ground/artifacts/AR-${flow.id}`)}>Artifacts에서 보기<ArrowRight size={13} className="gd-arrow" aria-hidden /></button>
            </div>
          </>
        ) : (
          <>
            <h2 className="gf-doc-h">{r.summary}</h2>
            <p className="gf-doc-p gd-muted">지난 실행이라 요약만 남아 있어요.</p>
          </>
        )}

        {latest && (
          <section className="gf-steps" aria-labelledby="gf-steps-h">
            <h3 id="gf-steps-h" className="gf-steps-h">단계별 결과</h3>
            <ol>
              {ordered.map(n => {
                const st = failed ? (n === failAt ? 'failed' : n.y < (failAt?.y ?? 0) ? 'done' : 'skipped') : n.result ? 'done' : 'skipped'
                return (
                  <li key={n.id} className={`st-${st}`}>
                    <span className="gf-step-ic"><FlowIcon kind={n.kind} size={13} /></span>
                    <span className="gf-step-b">
                      <span className="gf-step-t">{n.title}<span className="gd-muted"> · {NODE_META[n.kind].label}</span></span>
                      <span className="gf-step-r">{st === 'failed' ? '데이터셋 갱신 대기로 멈춤' : st === 'skipped' ? '건너뜀' : n.result}</span>
                    </span>
                    <span className="gf-step-ms">{st === 'done' && n.ms ? `${(n.ms / 1000).toFixed(1)}초` : ''}</span>
                  </li>
                )
              })}
            </ol>
          </section>
        )}
      </article>
    </div>
  )
}
