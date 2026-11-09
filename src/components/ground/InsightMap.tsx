// InsightMap.tsx — 인사이트 맵 (옵시디언 그래프 감성)
//  · 작은 점 + 아주 옅은 선만. 장식 없음
//  · 실제 힘 시뮬레이션으로 스르륵 자리 잡음. 노드 드래그 · 휠 확대 · 빈 곳 드래그 이동
//  · 라벨은 리포트만 옅게, 호버하면 이웃만 밝아지며 이름이 뜬다
//  · 연결이 많을수록 점이 커진다. 그린은 호버 시 "바로 해당" 선에만
//  · 필터(옵시디언 방식): 찾기 · 리포트 주제/예시 · 내 시나리오 슬롯/솔루션 · 발견 표시 · 연결 없는 것 · 주변만 보기(깊이)
// 매체 소식은 넣지 않는다 (지나가는 정보라 지식 지도의 노이즈가 된다)

import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react'
import type { Viewer, Link, ThemeId } from './groundTypes'
import {
  SCENARIOS, THEMES, GROUND_SLOTS, isActive, visibleReports, findingLinks, findFinding, findScenario, findSlot, findReport, reportOf, themeOf, fmtMD,
} from './groundData'

type Kind = 'report' | 'finding' | 'scenario'
interface N { id: string; kind: Kind; label: string; sub: string; deg: number; x: number; y: number; vx: number; vy: number; fixed?: boolean; dim?: boolean; sample?: boolean }
interface E { a: string; b: string; kind: 'structure' | 'direct' | 'reference'; link?: Link }

export interface MapFilter {
  q: string
  themes: ThemeId[] // 비면 전체
  sample: boolean
  slot: string // 'all' | slotId
  solution: 'all' | 'BudgetOpt 2.0' | 'Reach Caster'
  findings: boolean
  orphans: boolean
  local: { id: string; depth: number } | null
}
const DEFAULT_FILTER: MapFilter = { q: '', themes: [], sample: true, slot: 'all', solution: 'all', findings: true, orphans: false, local: null }
const activeCount = (f: MapFilter) =>
  (f.themes.length ? 1 : 0) + (f.sample ? 0 : 1) + (f.slot !== 'all' ? 1 : 0) + (f.solution !== 'all' ? 1 : 0) + (f.findings ? 0 : 1) + (f.orphans ? 1 : 0)

const W = 1200
const H = 640

function seeded(i: number) { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x) }

type Pos = Map<string, { x: number; y: number }>

function buildGraph(viewer: Viewer, f: MapFilter, pos: Pos) {
  const reports = visibleReports(viewer).filter(r => (!f.themes.length || f.themes.includes(r.theme)) && (f.sample || !r.sample))
  const scenarios = SCENARIOS.filter(isActive).filter(s => (f.slot === 'all' || s.slotId === f.slot) && (f.solution === 'all' || s.solution === f.solution))
  const fIds = new Set(reports.flatMap(r => r.findings.map(x => x.id)))
  const sIds = new Set(scenarios.map(s => s.id))
  const links = findingLinks(viewer).filter(l => fIds.has(l.sourceId) && sIds.has(l.scenarioId))

  let nodes: N[] = []
  let edges: E[] = []
  const add = (n: Omit<N, 'x' | 'y' | 'vx' | 'vy' | 'deg'>) => {
    const i = nodes.length
    const p = pos.get(n.id)
    const a = seeded(i) * Math.PI * 2, r = 80 + seeded(i + 99) * 220
    nodes.push({ ...n, deg: 0, x: p?.x ?? W / 2 + Math.cos(a) * r, y: p?.y ?? H / 2 + Math.sin(a) * r * 0.7, vx: 0, vy: 0 })
  }
  reports.forEach(r => {
    add({ id: r.id, kind: 'report', label: r.title, sub: `${r.issue} · ${themeOf(r.theme).name}`, dim: r.requiresActual, sample: r.sample })
    if (f.findings) r.findings.forEach(x => {
      add({ id: x.id, kind: 'finding', label: x.title, sub: `${r.issue} 발견`, dim: r.requiresActual })
      edges.push({ a: r.id, b: x.id, kind: 'structure' })
    })
  })
  scenarios.forEach(s => add({ id: s.id, kind: 'scenario', label: s.name, sub: `${findSlot(s.slotId)?.title} · ${fmtMD(s.start)}–${fmtMD(s.end)}` }))
  if (f.findings) links.forEach(l => edges.push({ a: l.sourceId, b: l.scenarioId, kind: l.strength, link: l }))
  else {
    // 발견을 숨기면 리포트 → 시나리오로 바로 잇는다 (하나라도 바로 해당이면 바로 해당)
    const m = new Map<string, E>()
    links.forEach(l => {
      const rid = reportOf(l.sourceId).id, key = `${rid}|${l.scenarioId}`
      const e = m.get(key)
      if (!e) m.set(key, { a: rid, b: l.scenarioId, kind: l.strength, link: l })
      else if (l.strength === 'direct') e.kind = 'direct'
    })
    edges = [...m.values()]
  }

  const keep = (ids: Set<string>) => {
    nodes = nodes.filter(n => ids.has(n.id))
    edges = edges.filter(e => ids.has(e.a) && ids.has(e.b))
  }
  const adj = () => {
    const m = new Map<string, Set<string>>()
    edges.forEach(e => {
      if (!m.has(e.a)) m.set(e.a, new Set()); if (!m.has(e.b)) m.set(e.b, new Set())
      m.get(e.a)!.add(e.b); m.get(e.b)!.add(e.a)
    })
    return m
  }

  // 연결 없는 것 숨기기 — 시나리오와 하나도 안 이어진 리포트(와 그 발견), 리포트와 안 이어진 시나리오
  if (!f.orphans) {
    const linked = new Set<string>()
    edges.forEach(e => { if (e.kind !== 'structure') { linked.add(e.a); linked.add(e.b) } })
    const ok = new Set<string>()
    nodes.forEach(n => {
      if (n.kind === 'finding') { if (linked.has(n.id) || linked.has(reportOf(n.id).id) || reports.find(r => r.id === reportOf(n.id).id)?.findings.some(x => linked.has(x.id))) ok.add(n.id) }
      else if (n.kind === 'report') { if (linked.has(n.id) || findReport(n.id)!.findings.some(x => linked.has(x.id))) ok.add(n.id) }
      else if (linked.has(n.id)) ok.add(n.id)
    })
    keep(ok)
  }

  // 찾기 — 이름이 맞는 노드와 그 이웃만
  const q = f.q.trim().toLowerCase()
  const matched = new Set<string>()
  if (q) {
    const m = adj()
    nodes.forEach(n => { if (`${n.label} ${n.sub}`.toLowerCase().includes(q)) matched.add(n.id) })
    const ids = new Set(matched)
    matched.forEach(id => m.get(id)?.forEach(x => ids.add(x)))
    keep(ids)
  }

  // 주변만 보기 — 로컬 그래프. 깊이만큼 이웃을 펼친다
  if (f.local && nodes.some(n => n.id === f.local!.id)) {
    const m = adj()
    let frontier = [f.local.id]
    const ids = new Set(frontier)
    for (let d = 0; d < f.local.depth; d++) {
      const next: string[] = []
      frontier.forEach(id => m.get(id)?.forEach(x => { if (!ids.has(x)) { ids.add(x); next.push(x) } }))
      frontier = next
    }
    keep(ids)
  }

  const idx = new Map(nodes.map((n, i) => [n.id, i]))
  edges.forEach(e => { nodes[idx.get(e.a)!].deg++; nodes[idx.get(e.b)!].deg++ })
  const shownLinks = links.filter(l => idx.has(l.scenarioId) && (idx.has(l.sourceId) || idx.has(reportOf(l.sourceId).id)))
  return {
    nodes, edges, idx, links: shownLinks, matched,
    total: { reports: reports.length, scenarios: scenarios.length },
  }
}

const radius = (n: N) => (n.kind === 'report' ? 5 + Math.min(n.deg, 14) * 0.35 : n.kind === 'scenario' ? 3.5 + Math.min(n.deg, 10) * 0.28 : 2.6)

function step(nodes: N[], edges: E[], idx: Map<string, number>, alpha: number, cw = W, ch = H) {
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
    const a = nodes[i], b = nodes[j]
    let dx = b.x - a.x, dy = b.y - a.y
    const d2 = Math.max(dx * dx + dy * dy, 25)
    const f = (760 / d2) * alpha
    const d = Math.sqrt(d2); dx /= d; dy /= d
    a.vx -= dx * f; a.vy -= dy * f; b.vx += dx * f; b.vy += dy * f
  }
  edges.forEach(e => {
    const a = nodes[idx.get(e.a)!], b = nodes[idx.get(e.b)!]
    const dx = b.x - a.x, dy = b.y - a.y
    const d = Math.sqrt(dx * dx + dy * dy) || 1
    const rest = e.kind === 'structure' ? 18 : 70
    const k = e.kind === 'structure' ? 0.18 : 0.035
    const f = (d - rest) * k * alpha
    a.vx += (dx / d) * f; a.vy += (dy / d) * f; b.vx -= (dx / d) * f; b.vy -= (dy / d) * f
  })
  nodes.forEach(n => {
    n.vx += (cw / 2 - n.x) * 0.0028 * alpha
    n.vy += (ch / 2 - n.y) * 0.0045 * alpha
    if (n.fixed) { n.vx = 0; n.vy = 0; return }
    n.vx *= 0.82; n.vy *= 0.82
    n.x += n.vx; n.y += n.vy
  })
}

export function InsightMap({ viewer, highlight }: { viewer: Viewer; highlight?: string | null }) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<MapFilter>(DEFAULT_FILTER)
  const [openFilter, setOpenFilter] = useState(false)
  const pos = useRef<Pos>(new Map())
  const g = useMemo(() => buildGraph(viewer, filter, pos.current), [viewer, filter])
  const [, setTick] = useState(0)
  const [hover, setHover] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const [view, setView] = useState({ k: 1, x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)
  // 뷰박스 = 카드 실제 크기 (레터박스 없이, 드래그 좌표가 그대로 맞게)
  const [dim, setDim] = useState({ w: W, h: H })
  const dimRef = useRef(dim); dimRef.current = dim
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => { const r = e.contentRect; if (r.width > 0) setDim({ w: Math.round(r.width), h: Math.round(r.height) }) })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  useEffect(() => { userMoved.current = false; kick(0.15) }, [dim.w, dim.h]) // eslint-disable-line react-hooks/exhaustive-deps
  const alpha = useRef(1)
  const raf = useRef(0)
  const drag = useRef<{ id?: string; panX?: number; panY?: number; sx: number; sy: number; moved: boolean } | null>(null)
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const set = (p: Partial<MapFilter>) => setFilter(f => ({ ...f, ...p }))

  // 사용자가 직접 확대·이동하기 전까지는 그래프가 카드에 꽉 맞게 따라간다
  const userMoved = useRef(false)
  const fit = (ease = 0.12) => {
    if (userMoved.current || !g.nodes.length) return
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    g.nodes.forEach(n => { x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x); y1 = Math.max(y1, n.y) })
    const { w, h } = dimRef.current
    const padX = 150, padY = 70
    const k = Math.min(1.6, Math.max(0.6, Math.min((w - padX * 2) / (x1 - x0 || 1), (h - padY * 2) / (y1 - y0 || 1))))
    const t = { k, x: w / 2 - ((x0 + x1) / 2) * k, y: h / 2 - ((y0 + y1) / 2) * k + 14 }
    setView(v => ({ k: v.k + (t.k - v.k) * ease, x: v.x + (t.x - v.x) * ease, y: v.y + (t.y - v.y) * ease }))
  }

  // 시뮬레이션 — 처음엔 스르륵 자리를 잡고, 드래그하면 다시 깨어난다
  const kick = (a = 0.6) => {
    alpha.current = Math.max(alpha.current, a)
    if (raf.current) return
    const loop = () => {
      step(g.nodes, g.edges, g.idx, alpha.current, dimRef.current.w, dimRef.current.h)
      g.nodes.forEach(n => pos.current.set(n.id, { x: n.x, y: n.y }))
      alpha.current *= 0.99
      fit()
      setTick(t => t + 1)
      raf.current = alpha.current > 0.02 ? requestAnimationFrame(loop) : 0
    }
    raf.current = requestAnimationFrame(loop)
  }
  useEffect(() => {
    userMoved.current = false
    alpha.current = pos.current.size ? 0.5 : 1
    if (reduce) { for (let i = 0; i < 320; i++) { step(g.nodes, g.edges, g.idx, alpha.current, dimRef.current.w, dimRef.current.h); alpha.current *= 0.985 } fit(1); setTick(t => t + 1); return }
    kick(alpha.current)
    return () => { cancelAnimationFrame(raf.current); raf.current = 0 }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g])
  // 필터로 사라진 노드에 고정돼 있으면 풀어준다
  useEffect(() => { if (pinned && !g.idx.has(pinned)) setPinned(null) }, [g, pinned])

  const external = highlight && g.idx.has(highlight) ? highlight : null
  const focus = drag.current?.id ?? hover ?? pinned ?? external
  const neighbors = useMemo(() => {
    const m = new Map<string, Set<string>>()
    g.edges.forEach(e => {
      if (!m.has(e.a)) m.set(e.a, new Set()); if (!m.has(e.b)) m.set(e.b, new Set())
      m.get(e.a)!.add(e.b); m.get(e.b)!.add(e.a)
    })
    return m
  }, [g])
  // 리포트에 포커스하면 발견을 한 단계 더 거쳐 시나리오까지 밝힌다
  const focusKind = focus ? g.nodes[g.idx.get(focus)!]?.kind : undefined
  const twoHop = focusKind === 'report' && filter.findings
  const lit = useMemo(() => {
    if (!focus) return null
    const s = new Set([focus, ...(neighbors.get(focus) ?? [])])
    if (twoHop) [...s].forEach(id => neighbors.get(id)?.forEach(x => s.add(x)))
    return s
  }, [focus, twoHop, neighbors])
  const edgeOn = (e: E) => !!lit && lit.has(e.a) && lit.has(e.b) &&
    (e.a === focus || e.b === focus || (twoHop && e.kind !== 'structure' && !!neighbors.get(focus!)?.has(e.a)))

  // 화면 좌표 → 그래프 좌표
  const toGraph = (cx: number, cy: number) => {
    const r = svgRef.current!.getBoundingClientRect()
    const sx = cx - r.left, sy = cy - r.top
    return { x: (sx - view.x) / view.k, y: (sy - view.y) / view.k }
  }

  const onWheel = (e: React.WheelEvent) => {
    userMoved.current = true
    const r = svgRef.current!.getBoundingClientRect()
    const sx = e.clientX - r.left, sy = e.clientY - r.top
    const k = Math.min(3, Math.max(0.5, view.k * (e.deltaY < 0 ? 1.1 : 0.9)))
    setView(v => ({ k, x: sx - ((sx - v.x) / v.k) * k, y: sy - ((sy - v.y) / v.k) * k }))
  }
  const onDown = (e: React.PointerEvent, id?: string) => {
    e.stopPropagation()
    setOpenFilter(false)
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    drag.current = id ? { id, sx: e.clientX, sy: e.clientY, moved: false } : { panX: view.x, panY: view.y, sx: e.clientX, sy: e.clientY, moved: false }
    if (id) { const n = g.nodes[g.idx.get(id)!]; n.fixed = true }
  }
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    if (Math.abs(e.clientX - d.sx) + Math.abs(e.clientY - d.sy) > 3) d.moved = true
    if (d.id) {
      if (d.moved) userMoved.current = true
      const p = toGraph(e.clientX, e.clientY)
      const n = g.nodes[g.idx.get(d.id)!]
      n.x = p.x; n.y = p.y
      kick(0.3)
    } else if (d.moved) {
      userMoved.current = true
      setView(v => ({ ...v, x: d.panX! + (e.clientX - d.sx), y: d.panY! + (e.clientY - d.sy) }))
    }
  }
  const onUp = () => {
    const d = drag.current
    drag.current = null
    if (!d) return
    if (d.id) {
      g.nodes[g.idx.get(d.id)!].fixed = false
      if (!d.moved) setPinned(p => (p === d.id ? null : d.id!))
      kick(0.2)
    } else if (!d.moved) setPinned(null)
  }

  const node = (id: string) => g.nodes[g.idx.get(id)!]
  const focusNode = focus ? node(focus) : undefined
  const panelNode = (drag.current?.id ?? hover ?? pinned) ? focusNode : undefined

  // 라벨 겹침 회피 — 포커스·연결 많은 노드부터 자리를 잡고, 겹치는 라벨은 숨긴다
  const fs = 10.5 / Math.max(view.k, 1)
  const labelText = (n: N) => (n.label.length > 22 ? `${n.label.slice(0, 22)}…` : n.label)
  const labels = new Set<string>()
  {
    const fk = focusNode?.kind
    const want = g.nodes.filter(n => lit
      ? lit.has(n.id) && (n.id === focus || n.kind !== 'finding' || fk !== 'report')
      : g.matched.has(n.id) || (n.kind === 'report' && view.k >= 0.6) || view.k >= 1.8 || (filter.local && n.kind !== 'finding'))
    want.sort((a, b) => (a.id === focus ? -1 : b.id === focus ? 1 : Number(g.matched.has(b.id)) - Number(g.matched.has(a.id)) || b.deg - a.deg))
    const boxes: [number, number, number, number][] = []
    want.forEach(n => {
      const w = labelText(n).length * fs * 0.92, h = fs * 1.35
      const x = n.x - w / 2, y = n.y + radius(n) + fs * 0.2
      const hit = boxes.some(([bx, by, bw, bh]) => x < bx + bw && x + w > bx && y < by + bh && y + h > by)
      if (!hit || n.id === focus) { boxes.push([x, y, w, h]); labels.add(n.id) }
    })
  }

  const nCount = activeCount(filter)
  const shownReports = g.nodes.filter(n => n.kind === 'report').length
  const shownScenarios = g.nodes.filter(n => n.kind === 'scenario').length
  const localNode = filter.local ? g.nodes.find(n => n.id === filter.local!.id) : undefined

  return (
    <div className="gd-graphmap">
      <svg ref={svgRef} viewBox={`0 0 ${dim.w} ${dim.h}`} className="gd-graphmap-svg" role="group" aria-label="인사이트 맵"
        onWheel={onWheel} onPointerDown={e => onDown(e)} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={() => setHover(null)}>
        <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
          {g.edges.map((e, i) => {
            const a = node(e.a), b = node(e.b)
            const on = edgeOn(e)
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} vectorEffect="non-scaling-stroke" className={`ob-edge e-${e.kind} ${on ? 'is-on' : ''}`} style={{ opacity: lit ? (on ? 1 : 0.06) : undefined }} />
          })}
          {g.nodes.map(n => {
            const on = !lit || lit.has(n.id)
            const r = radius(n)
            return (
              <g key={n.id} transform={`translate(${n.x},${n.y})`} className={`ob-node k-${n.kind} ${n.dim ? 'is-dim' : ''} ${n.id === focus ? 'is-focus' : ''} ${g.matched.has(n.id) ? 'is-match' : ''}`}
                style={{ opacity: on ? 1 : 0.18 }}
                tabIndex={0} role="button" aria-label={`${n.label} · ${n.sub}`}
                onPointerDown={e => onDown(e, n.id)} onPointerEnter={() => setHover(n.id)} onPointerLeave={() => setHover(h => (h === n.id ? null : h))}
                onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}
                onKeyDown={ev => { if (ev.key === 'Enter') setPinned(p => (p === n.id ? null : n.id)) }}>
                <circle r={r + 7} className="ob-hit" />
                <circle r={r} className="ob-dot" />
                {labels.has(n.id) && (
                  <text y={r + 11} textAnchor="middle" className={`ob-label ${lit?.has(n.id) || g.matched.has(n.id) ? 'is-on' : ''}`} style={{ fontSize: fs }}>
                    {labelText(n)}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </svg>

      {/* 툴바 — 찾기 · 필터 · 주변만 보기 */}
      <div className="ob-bar" onPointerDown={e => e.stopPropagation()}>
        <label className="ob-search">
          <Search size={13} aria-hidden />
          <span className="gd-sr">맵에서 찾기</span>
          <input value={filter.q} onChange={e => set({ q: e.target.value })} placeholder="리포트 · 시나리오 찾기" />
          {filter.q && <button type="button" aria-label="찾기 지우기" onClick={() => set({ q: '' })}><X size={12} /></button>}
        </label>
        <button type="button" className={`ob-btn ${openFilter ? 'is-open' : ''}`} aria-expanded={openFilter} onClick={() => setOpenFilter(o => !o)}>
          <SlidersHorizontal size={13} aria-hidden />필터{nCount > 0 && <span className="ob-btn-n">{nCount}</span>}
        </button>
        {localNode && (
          <span className="ob-local">
            <span className="ob-local-t">{labelText(localNode)} 주변</span>
            <span className="ob-seg" role="group" aria-label="깊이">
              {[1, 2, 3].map(d => <button key={d} type="button" aria-pressed={filter.local!.depth === d} onClick={() => set({ local: { id: localNode.id, depth: d } })}>{d}</button>)}
            </span>
            <button type="button" className="ob-x" aria-label="전체 보기" onClick={() => set({ local: null })}><X size={12} /></button>
          </span>
        )}
        <span className="ob-shown">리포트 {shownReports}/{g.total.reports} · 시나리오 {shownScenarios}/{g.total.scenarios}</span>

        {openFilter && (
          <div className="ob-filter" role="dialog" aria-label="맵 필터">
            <div className="ob-filter-sec">
              <div className="ob-filter-h">리포트</div>
              <div className="ob-filter-row">
                <span>주제</span>
                <span className="ob-chips">
                  <button type="button" aria-pressed={!filter.themes.length} onClick={() => set({ themes: [] })}>전체</button>
                  {THEMES.map(t => (
                    <button key={t.id} type="button" aria-pressed={filter.themes.includes(t.id)}
                      onClick={() => set({ themes: filter.themes.includes(t.id) ? filter.themes.filter(x => x !== t.id) : [...filter.themes, t.id] })}>{t.name}</button>
                  ))}
                </span>
              </div>
              <Toggle label="예시 리포트 포함" on={filter.sample} onChange={v => set({ sample: v })} />
            </div>
            <div className="ob-filter-sec">
              <div className="ob-filter-h">내 시나리오</div>
              <div className="ob-filter-row">
                <span>슬롯</span>
                <select value={filter.slot} onChange={e => set({ slot: e.target.value })} aria-label="슬롯">
                  <option value="all">전체 슬롯</option>
                  {GROUND_SLOTS.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div className="ob-filter-row">
                <span>솔루션</span>
                <span className="ob-chips">
                  {(['all', 'BudgetOpt 2.0', 'Reach Caster'] as const).map(s => (
                    <button key={s} type="button" aria-pressed={filter.solution === s} onClick={() => set({ solution: s })}>{s === 'all' ? '전체' : s}</button>
                  ))}
                </span>
              </div>
            </div>
            <div className="ob-filter-sec">
              <div className="ob-filter-h">보기</div>
              <Toggle label="발견 표시" hint="끄면 리포트와 시나리오를 바로 이어요" on={filter.findings} onChange={v => set({ findings: v })} />
              <Toggle label="연결 없는 것도 표시" hint="시나리오와 안 이어진 리포트 · 시나리오" on={filter.orphans} onChange={v => set({ orphans: v })} />
            </div>
            <button type="button" className="ob-reset" disabled={!nCount} onClick={() => setFilter(f => ({ ...DEFAULT_FILTER, q: f.q, local: f.local }))}>기본값으로</button>
          </div>
        )}
      </div>

      {!g.nodes.length && <div className="ob-empty">조건에 맞는 노드가 없어요. 필터를 줄여보세요.</div>}

      <div className="gd-graphmap-legend">
        <span><i className="ob-lg-report" />분석 리포트</span>
        {filter.findings && <span><i className="ob-lg-finding" />발견</span>}
        <span><i className="ob-lg-scenario" />내 시나리오</span>
        <span className="gd-muted">휠로 확대 · 드래그로 이동</span>
      </div>

      {panelNode && <Panel n={panelNode} links={g.links} pinned={pinned === panelNode.id}
        local={filter.local?.id === panelNode.id}
        onLocal={() => { set({ local: filter.local?.id === panelNode.id ? null : { id: panelNode.id, depth: panelNode.kind === 'report' && filter.findings ? 2 : 1 } }); setPinned(panelNode.id) }}
        onClose={() => { setPinned(null); setHover(null) }}
        onGo={() => {
          if (panelNode.kind === 'report') navigate(`/ground/library/${panelNode.id}`)
          else if (panelNode.kind === 'finding') navigate(`/ground/library/${reportOf(panelNode.id).id}#${panelNode.id}`)
          else navigate(findScenario(panelNode.id)?.solution === 'BudgetOpt 2.0' ? '/budgetopt' : '/reachcaster')
        }} />}
    </div>
  )
}

function Toggle({ label, hint, on, onChange }: { label: string; hint?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} className="ob-toggle" onClick={() => onChange(!on)}>
      <span className="ob-toggle-l">{label}{hint && <span className="ob-toggle-h">{hint}</span>}</span>
      <span className="ob-switch" aria-hidden />
    </button>
  )
}

function Panel({ n, links, pinned, local, onLocal, onClose, onGo }: {
  n: N; links: Link[]; pinned: boolean; local: boolean; onLocal: () => void; onClose: () => void; onGo: () => void
}) {
  const report = n.kind === 'report' ? findReport(n.id) : n.kind === 'finding' ? reportOf(n.id) : undefined
  const finding = n.kind === 'finding' ? findFinding(n.id) : undefined
  const related = (n.kind === 'scenario' ? links.filter(l => l.scenarioId === n.id)
    : n.kind === 'finding' ? links.filter(l => l.sourceId === n.id)
      : links.filter(l => report!.findings.some(f => f.id === l.sourceId)))
    .slice().sort((a, b) => (a.strength === b.strength ? 0 : a.strength === 'direct' ? -1 : 1))
  // 리포트·발견 → 시나리오 단위로 묶는다 (같은 시나리오가 여러 번 나오지 않게)
  type Row = { key: string; direct: boolean; title?: string; reasons: string[] }
  const rows: Row[] = []
  related.forEach(l => {
    const key = n.kind === 'scenario' ? l.sourceId : l.scenarioId
    const r = rows.find(x => x.key === key)
    if (r) { r.direct ||= l.strength === 'direct'; l.reasons.forEach(x => { if (!r.reasons.includes(x)) r.reasons.push(x) }) }
    else rows.push({ key, direct: l.strength === 'direct', title: n.kind === 'scenario' ? findFinding(l.sourceId)?.title : findScenario(l.scenarioId)?.name, reasons: [...l.reasons] })
  })
  rows.sort((a, b) => Number(b.direct) - Number(a.direct))
  const kind = n.kind === 'report' ? '분석 리포트' : n.kind === 'finding' ? '발견' : '시나리오'
  return (
    <aside className="gd-map-panel" aria-live="polite" onPointerDown={e => e.stopPropagation()}>
      <div className="gd-map-panel-top">
        <span className="gd-map-panel-kind">{kind}{report && ` · ${themeOf(report.theme).name}`}{report?.sample && <span className="gd-sample">예시</span>}</span>
        {pinned && <button type="button" className="gd-map-panel-x" aria-label="고정 풀기" onClick={onClose}><X size={14} /></button>}
      </div>
      <div className="gd-map-panel-h">{n.label}</div>
      <div className="gd-map-panel-sub">{n.sub}</div>
      {finding && <p className="gd-map-panel-p">{finding.summary}</p>}
      {report?.requiresActual
        ? <p className="gd-map-panel-p gd-muted">실제 집행 결과와 함께 봐야 하는 리포트예요. 매체 실측이 연결되면 시나리오와 이어져요.</p>
        : (
          <>
            <div className="gd-map-panel-count">{n.kind === 'scenario' ? `연결된 발견 ${rows.length}` : `연결된 시나리오 ${rows.length}`}</div>
            <ul className="gd-map-panel-list">
              {rows.slice(0, 4).map(r => (
                <li key={r.key}>
                  <span className={`gd-graph-tag ${r.direct ? 'is-direct' : ''}`}>{r.direct ? '바로 해당' : '참고'}</span>
                  <span className="gd-graph-other">{r.title}</span>
                  <span className="gd-graph-why">{r.reasons.slice(0, 3).join(' · ')}</span>
                </li>
              ))}
              {rows.length > 4 && <li className="gd-graph-why">외 {rows.length - 4}개</li>}
            </ul>
          </>
        )}
      <div className="gd-map-panel-acts">
        <button type="button" className="gd-graph-open" onClick={onGo}>{n.kind === 'scenario' ? '솔루션에서 열기' : '원문 보기'}<ArrowRight size={12} className="gd-arrow" aria-hidden /></button>
        <button type="button" className="gd-graph-open is-sub" aria-pressed={local} onClick={onLocal}>{local ? '전체 보기' : '주변만 보기'}</button>
      </div>
    </aside>
  )
}
