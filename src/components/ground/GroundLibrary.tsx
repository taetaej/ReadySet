// GroundLibrary.tsx — /ground/library. 라이브러리 (독립 메뉴).
// 분석 리포트는 주제별로, 매체 소식은 따로. 매체 소식은 인사이트 맵에 넣지 않는다.

import { useNavigate } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'
import { GroundLayout } from './GroundLayout'
import { useViewer } from './useViewer'
import { THEMES, visibleReports, visibleNews, linksForSource, fmtYMD, fmtMD } from './groundData'

export function GroundLibrary() {
  const navigate = useNavigate()
  const [viewer] = useViewer()
  const reports = visibleReports(viewer)
  const news = [...visibleNews(viewer)].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  return (
    <GroundLayout title="라이브러리 - Ground">
      <div className="gd-container gd-page">
        <header className="gd-page-head">
          <h1 className="gd-page-title">라이브러리</h1>
          <p className="gd-page-sub">SpinX가 답할 때 근거로 쓰는 자료예요. 분석 리포트는 발견 단위로 시나리오와 연결돼요.</p>
        </header>

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
    </GroundLayout>
  )
}
