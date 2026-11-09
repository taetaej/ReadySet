// LibraryDetail.tsx — /ground/library/:id
// 리포트는 발견 단위로 펼치고, 발견마다 연결된 시나리오와 그 이유를 붙인다.
// 리포트 원문(서명된 콘텐츠)과 SpinX 해석(동적 생성)은 화면에서 분리한다.

import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Lock, Sparkles } from 'lucide-react'
import { GroundLayout } from './GroundLayout'
import { SpinXOrb } from '../spinx/SpinXOrb'
import { useViewer } from './useViewer'
import type { Report, Finding, MediaNews, FindingMetric } from './groundTypes'
import {
  SCENARIOS, GROUND_SLOTS, isActive, canView, findReport, findNews, findScenario, findSlot,
  linksForSource, interpretReport, fmtYMD, fmtMD, HOLIDAYS, themeOf,
} from './groundData'

const EASE = [0.16, 1, 0.3, 1] as const

export function LibraryDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [viewer] = useViewer()
  const report = findReport(id)
  const news = findNews(id)
  const item = report ?? news
  const back = () => navigate('/ground/library')

  if (!item || !canView(item.audienceLevel, viewer)) {
    return (
      <GroundLayout title="Ground - ReadySet">
        <div className="gd-container gd-page">
          <button type="button" className="gd-back" onClick={back}><ArrowLeft size={14} />라이브러리</button>
          <h1 className="gd-d-title" style={{ marginTop: 28, fontSize: 24 }}>열람할 수 없는 자료예요</h1>
          <p className="gd-d-take">삭제되었거나 현재 권한으로 볼 수 없는 항목이에요.</p>
        </div>
      </GroundLayout>
    )
  }

  return (
    <GroundLayout title={`${item.title} - Ground`}>
      <div className="gd-container">
        {report ? <ReportView report={report} onBack={back} /> : <NewsView news={news!} onBack={back} />}
      </div>
    </GroundLayout>
  )
}

// ─────────────────────────────────────────────
// 리포트
// ─────────────────────────────────────────────
function ReportView({ report, onBack }: { report: Report; onBack: () => void }) {
  const navigate = useNavigate()
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }, [hash])

  return (
    <div className="gd-detail">
      <article>
        <button type="button" className="gd-back" onClick={onBack}><ArrowLeft size={14} />라이브러리</button>
        <div className="gd-d-meta">
          <span>분석 리포트</span><span>·</span><span>{themeOf(report.theme).name}</span><span>·</span><span>{report.series} {report.issue}{report.code && ` · ${report.code}`}</span><span>·</span><span>{fmtYMD(report.publishedAt)}</span>
          {report.sample && <span className="gd-sample">예시 데이터</span>}
        </div>
        <h1 className="gd-d-title">{report.title}</h1>
        <p className="gd-d-take">{report.subtitle}</p>
        {report.sample && <p className="gd-note gd-muted" style={{ marginTop: 12 }}>AX팀 분석 예정 가설에 붙인 화면 검토용 가상 결과예요. 실제 수치가 아니에요.</p>}
        {report.requiresActual && <p className="gd-note" style={{ marginTop: 12 }}>실제 집행 결과와 함께 봐야 하는 리포트예요. 매체 실측(도구 · MCP)이 연결되면 시나리오와 이어져요.</p>}

        <dl className="gd-method">
          {report.method.map(m => <div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>)}
          <div><dt>발행</dt><dd>{report.publisher}</dd></div>
        </dl>

        <section className="gd-sec">
          <h2 className="gd-sec-h">발견 {report.findings.length}건</h2>
          {report.findings.map((f, i) => <FindingBlock key={f.id} f={f} no={i + 1} report={report} highlight={hash === `#${f.id}`} />)}
        </section>

        {report.brandNote && <p className="gd-note">{report.brandNote}</p>}

        {report.playbook && (
          <section className="gd-sec">
            <h2 className="gd-sec-h">이렇게 준비해 보세요</h2>
            <ol className="gd-playbook">
              {report.playbook.map((p, i) => (
                <li key={p.title}><span className="gd-fi-no">{String(i + 1).padStart(2, '0')}</span><div><b>{p.title}</b><p>{p.body}</p></div></li>
              ))}
            </ol>
          </section>
        )}

        {report.excluded && <p className="gd-note gd-muted">{report.excluded}</p>}

        {report.next && (
          <section className="gd-next">
            <h2 className="gd-next-h">{report.next.title}</h2>
            <p className="gd-next-p">{report.next.body}</p>
            <button type="button" className="gd-btn-pill gd-btn-inline" onClick={() => navigate(report.next!.href)}>
              {report.next.solution}에서 업종 벤치마크 보기<ArrowRight size={14} aria-hidden />
            </button>
          </section>
        )}
      </article>

      <ReportAside report={report} />
    </div>
  )
}

function FindingBlock({ f, no, report, highlight }: { f: Finding; no: number; report: Report; highlight: boolean }) {
  const navigate = useNavigate()
  const [viewer] = useViewer()
  const links = linksForSource(f.id, viewer)
  const max = Math.max(...f.metrics.map(m => Math.abs(m.change)), 10)
  const c = f.condition
  const cond = report.requiresActual ? '실측 데이터 연결 시' : [
    c.holiday && (c.holiday === 'long' ? '장기 연휴' : '단기 연휴'),
    c.season && c.season.join('·'),
    c.payday && '월급일 포함',
    c.industry ? c.industry.join('·') : '전 업종',
    c.media && c.media.map(m => `${m.name} ${m.minShare}% 이상`).join(' · '),
    c.kpi && `KPI ${c.kpi.join('·')}`,
    c.budgetChange && (c.budgetChange === 'increase' ? '예산 증액' : c.budgetChange === 'decrease' ? '예산 감액' : '같은 예산·조합 반복'),
    c.minBudget !== undefined && `총예산 ${c.minBudget}억 이상`,
    c.minMediaCount !== undefined && `매체 ${c.minMediaCount}개 이상`,
    c.launch && '신상품 출시',
  ].filter(Boolean).join(' · ')
  const play = f.action ?? null

  return (
    <div id={f.id} className={`gd-finding ${highlight ? 'is-target' : ''}`}>
      <div className="gd-finding-head">
        <span className="gd-fi-no">{String(no).padStart(2, '0')}</span>
        <div>
          <h3 className="gd-finding-title">{f.title}</h3>
          <p className="gd-finding-sum">{f.summary}</p>
        </div>
      </div>

      {f.metrics.length > 0 && (
        <div className="gd-change">
          {f.metrics.map(m => <ChangeBar key={m.label} m={m} max={max} />)}
          <div className="gd-change-axis" aria-hidden><span>감소</span><span>평시</span><span>증가</span></div>
        </div>
      )}

      <ul className="gd-insight">{f.insight.map(x => <li key={x}>{x}</li>)}</ul>

      <div className="gd-finding-foot">
        <span>적용 조건 · {cond}</span>
        {play && <span>관련 제안 · {play}</span>}
      </div>

      <div className="gd-finding-links">
        {links.length === 0
          ? <span className="gd-muted">지금 진행 중인 시나리오 중에 조건이 맞는 곳이 없어요.</span>
          : links.map(l => {
            const s = findScenario(l.scenarioId)!
            return (
              <button key={l.scenarioId} type="button" className="gd-scn-row" onClick={() => navigate(s.solution === 'BudgetOpt 2.0' ? '/budgetopt' : '/reachcaster')}>
                <span className="gd-scn-main">
                  <span className="gd-scn-name">
                    <span className={`gd-strength-tag ${l.strength === 'direct' ? 'is-direct' : ''}`}>{l.strength === 'direct' ? '바로 해당' : '참고'}</span>
                    {s.name}
                  </span>
                  <span className="gd-scn-meta">{findSlot(s.slotId)?.title} · {s.solution} · {fmtMD(s.start)}–{fmtMD(s.end)}</span>
                </span>
                <span className="gd-scn-why">{l.reasons.join(' · ')}</span>
                <ArrowRight size={14} className="gd-arrow" aria-hidden />
              </button>
            )
          })}
      </div>
    </div>
  )
}

/** 평시 대비 증감률 — 0을 가운데 둔 양방향 막대. 광고비는 지출 변화라 단가·반응과 구분해 외곽선으로 */
function ChangeBar({ m, max }: { m: FindingMetric; max: number }) {
  const reduce = useReducedMotion()
  const spend = m.label.includes('광고비')
  const w = (Math.abs(m.change) / max) * 50
  const neg = m.change < 0
  return (
    <div className="gd-change-row">
      <span className="gd-change-label">{m.label}</span>
      <div className="gd-change-track">
        <span className="gd-change-zero" aria-hidden />
        <motion.span
          className={`gd-change-fill ${spend ? 'is-spend' : ''}`}
          style={{ width: `${w}%`, left: neg ? `${50 - w}%` : '50%', transformOrigin: neg ? 'right center' : 'left center' }}
          initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      </div>
      <span className="gd-change-v">{m.change > 0 ? '+' : ''}{m.change}%</span>
    </div>
  )
}

function ReportAside({ report }: { report: Report }) {
  const reduce = useReducedMotion()
  const [viewer] = useViewer()
  const linked = Array.from(new Set(report.findings.flatMap(f => linksForSource(f.id, viewer).map(l => l.scenarioId))))
  const [scenarioId, setScenarioId] = useState(linked[0] ?? '')
  const [shown, setShown] = useState<string | null>(null)
  const interp = shown ? interpretReport(report, shown) : null
  const upcoming = HOLIDAYS.filter(h => h.end >= '2026-11-04')

  return (
    <aside className="gd-aside">
      <div className="gd-panel">
        <div className="gd-panel-h"><SpinXOrb size={18} motion={shown ? 'static' : 'idle'} title="" />SpinX 해석</div>
        <p className="gd-panel-sub">이 리포트를 내 시나리오에 대입해 볼게요.</p>
        <select className="gd-select" aria-label="해석할 시나리오" value={scenarioId} onChange={e => { setScenarioId(e.target.value); setShown(null) }}>
          <option value="">시나리오 선택</option>
          {GROUND_SLOTS.map(slot => {
            const list = SCENARIOS.filter(s => s.slotId === slot.id && isActive(s))
            if (!list.length) return null
            return (
              <optgroup key={slot.id} label={slot.title}>
                {list.map(s => <option key={s.id} value={s.id}>{s.name}{linked.includes(s.id) ? ' · 연결됨' : ''}</option>)}
              </optgroup>
            )
          })}
        </select>
        {!shown && (
          <button type="button" className="gd-btn-pill" disabled={!scenarioId} style={{ opacity: scenarioId ? 1 : 0.4, cursor: scenarioId ? 'pointer' : 'not-allowed' }} onClick={() => setShown(scenarioId)}>
            <Sparkles size={14} aria-hidden />이 시나리오 기준으로 해석
          </button>
        )}
        <AnimatePresence>
          {interp && (
            <motion.div key={shown} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
              <div className={`gd-interp ${interp.applicable ? 'is-applicable' : ''}`}>{interp.text}</div>
              <div className="gd-interp-note">AI가 생성한 해석이에요. 검증된 결론은 본문 발견을 기준으로 봐 주세요.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="gd-panel">
        <p className="gd-panel-title">연휴 캘린더 · 리포트 기준</p>
        <dl className="gd-kv gd-kv-wide">
          {upcoming.map(h => (
            <div key={h.name} style={{ display: 'contents' }}>
              <dt>{h.name}</dt>
              <dd>평일 {h.weekdayOff}일 · {h.type === 'long' ? '장기' : '단기'}{!h.confirmed && <span className="gd-muted"> · 가정</span>}</dd>
            </div>
          ))}
        </dl>
        <p className="gd-panel-foot">평일 연휴 1~2일은 단기, 3일 이상은 장기예요. 2027년 일정은 확정 전 가정값이에요.</p>
      </div>
    </aside>
  )
}

// ─────────────────────────────────────────────
// 매체 소식
// ─────────────────────────────────────────────
function NewsView({ news, onBack }: { news: MediaNews; onBack: () => void }) {
  const navigate = useNavigate()
  const [viewer] = useViewer()
  const links = linksForSource(news.id, viewer)
  return (
    <div className="gd-detail">
      <article>
        <button type="button" className="gd-back" onClick={onBack}><ArrowLeft size={14} />라이브러리</button>
        <div className="gd-d-meta">
          <span>매체 소식</span><span>·</span><span>{news.media}</span><span>·</span><span>{fmtYMD(news.publishedAt)}</span>
          {news.audienceLevel === 'internal' && <span className="gd-flag"><Lock size={9} aria-hidden />임직원 전용</span>}
        </div>
        <h1 className="gd-d-title">{news.title}</h1>
        <p className="gd-d-take">{news.summary}</p>
        <dl className="gd-method">
          <div><dt>출처</dt><dd>{news.source}</dd></div>
          <div><dt>적용</dt><dd>{fmtYMD(news.effectiveFrom)}{news.effectiveTo ? ` – ${fmtYMD(news.effectiveTo)}` : ' 이후'}</dd></div>
        </dl>
        <section className="gd-sec"><p>{news.body}</p></section>
        <section className="gd-sec">
          <h2 className="gd-sec-h">연결된 시나리오 {links.length}</h2>
          {links.length === 0 && <span className="gd-muted">조건이 맞는 진행 중 시나리오가 없어요.</span>}
          {links.map(l => {
            const s = findScenario(l.scenarioId)!
            return (
              <button key={l.scenarioId} type="button" className="gd-scn-row" onClick={() => navigate(s.solution === 'BudgetOpt 2.0' ? '/budgetopt' : '/reachcaster')}>
                <span className="gd-scn-main">
                  <span className="gd-scn-name"><span className={`gd-strength-tag ${l.strength === 'direct' ? 'is-direct' : ''}`}>{l.strength === 'direct' ? '바로 해당' : '참고'}</span>{s.name}</span>
                  <span className="gd-scn-meta">{findSlot(s.slotId)?.title} · {s.solution} · {fmtMD(s.start)}–{fmtMD(s.end)}</span>
                </span>
                <span className="gd-scn-why">{l.reasons.join(' · ')}</span>
                <ArrowRight size={14} className="gd-arrow" aria-hidden />
              </button>
            )
          })}
        </section>
      </article>
      <aside className="gd-aside" />
    </div>
  )
}
