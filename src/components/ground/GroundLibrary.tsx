// GroundLibrary.tsx — /ground/library. 라이브러리 (독립 메뉴).
// 분석 리포트는 주제별로, 매체 소식은 따로. 매체 소식은 인사이트 맵에 넣지 않는다.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUp, Lock, Search } from 'lucide-react'
import { GroundDock, openDock } from './GroundDock'
import { GroundLayout } from './GroundLayout'
import { useViewer } from './useViewer'
import { THEMES, visibleReports, visibleNews, linksForSource, fmtYMD, fmtMD } from './groundData'

export function GroundLibrary() {
  const navigate = useNavigate()
  const [viewer] = useViewer()
  // 찾기와 묻기를 한 칸에서 — 치는 동안 목록이 걸러지고, Enter면 SpinX에게
  const [q, setQ] = useState('')
  const has = (...xs: (string | undefined)[]) => !q.trim() || xs.some(x => x?.toLowerCase().includes(q.trim().toLowerCase()))
  const reports = visibleReports(viewer).filter(r => has(r.title, r.subtitle, r.issue, ...r.findings.map(f => f.title)))
  const news = [...visibleNews(viewer)].filter(n => has(n.title, n.summary, n.media)).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  const ask = () => { if (q.trim()) { openDock(q.trim()); setQ('') } }

  return (
    <GroundLayout title="Library - Ground">
      <div className="gd-container gd-page">
        <header className="gd-page-head">
          <h1 className="gd-page-title">Library</h1>
          <p className="gd-page-sub">SpinX가 답할 때 근거로 쓰는 자료예요. 분석 리포트는 발견 단위로 시나리오와 연결돼요.</p>
        </header>
        <div className="gd-pill gd-libq">
          <Search size={16} aria-hidden className="gd-libq-ic" />
          <label htmlFor="gd-libq" className="gd-sr">라이브러리에서 찾거나 SpinX에게 묻기</label>
          <textarea id="gd-libq" className="gd-pill-input" rows={1} value={q} placeholder="찾거나 물어보세요 · Enter로 SpinX에게"
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => { if (e.nativeEvent.isComposing) return; if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask() } }} />
          {q.trim() && <span className="gd-libq-n">리포트 {reports.length} · 소식 {news.length}</span>}
          <button type="button" className="gd-send" aria-label="SpinX에게 묻기" disabled={!q.trim()} onClick={ask}><ArrowUp size={16} strokeWidth={2.2} /></button>
        </div>

        <div className="gd-lib-grid">
          <div>
            {THEMES.map(th => {
              const rs = reports.filter(r => r.theme === th.id).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
              if (!rs.length) return null
              return (
                <section key={th.id} className="gd-lib-theme">
                  <div className="gd-lib-col-h">{th.name} <span className="gd-count">{rs.length}</span><span className="gd-lib-col-m">{th.id === 'attribution' ? '실측 연결 시 시나리오와 이어져요' : th.matchesOn}</span></div>
                  {rs.map(r => {
                    const linked = new Set(r.findings.flatMap(f => linksForSource(f.id, viewer).map(l => l.scenarioId)))
                    return (
                      <button key={r.id} type="button" className="gd-lib-row" onClick={() => navigate(`/ground/library/${r.id}`)}>
                        <span className="gd-lib-issue">{r.issue}</span>
                        <span className="gd-lib-body">
                          <span className="gd-lib-title">{r.title}{r.sample && <span className="gd-sample">예시</span>}</span>
                          <span className="gd-lib-sub">{r.subtitle}{r.code && ` · ${r.code}`}</span>
                        </span>
                        <span className="gd-lib-meta">발견 {r.findings.length}{linked.size > 0 && ` · 시나리오 ${linked.size}`}</span>
                        <span className="gd-lib-date">{fmtYMD(r.publishedAt)}</span>
                        <ArrowRight size={13} className="gd-arrow" aria-hidden />
                      </button>
                    )
                  })}
                </section>
              )
            })}
          </div>

          <div>
            <div className="gd-lib-col-h">매체 소식 <span className="gd-count">{news.length}</span></div>
            <ul className="gd-news-list">
              {news.map(n => (
                <li key={n.id}>
                  <button type="button" onClick={() => navigate(`/ground/library/${n.id}`)}>
                    <span className="gd-news-media">{n.media}</span>
                    <span className="gd-news-body">
                      <span className="gd-news-title">{n.title}{n.audienceLevel === 'internal' && <span className="gd-flag"><Lock size={9} aria-hidden />임직원 전용</span>}</span>
                      <span className="gd-news-sum">{n.summary}</span>
                    </span>
                    <span className="gd-news-date">{fmtMD(n.effectiveFrom)} 적용</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <GroundDock origin={{ type: 'library', id: 'library', label: 'Library', path: '/ground/library' }} />
    </GroundLayout>
  )
}
