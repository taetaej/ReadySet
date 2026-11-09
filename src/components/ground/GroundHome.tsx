// GroundHome.tsx — /ground
// 첫 화면에 바로 보이는 것: 질문을 담은 오브 + 입력창 (스크롤 없이)
// 그 아래: 인사이트 맵(필터 포함, 꽉) → 분석 리포트 · 매체 소식 위젯(각각 최신순)
// 리포트 위젯에 손을 올리면 맵에서 그 리포트가 밝아진다

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { GroundLayout } from './GroundLayout'
import { QuestionOrb } from './GroundSpinX'
import { InsightMap } from './InsightMap'
import { useViewer } from './useViewer'
import { visibleReports, visibleNews, findingLinks, fmtMD } from './groundData'

export function GroundHome() {
  const [viewer] = useViewer()
  const navigate = useNavigate()
    const [hl, setHl] = useState<string | null>(null)
  const reports = [...visibleReports(viewer)].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  const news = [...visibleNews(viewer)].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  const links = findingLinks(viewer)
  const scenarioCount = (id: string) => new Set(links.filter(l => reports.find(r => r.id === id)?.findings.some(f => f.id === l.sourceId)).map(l => l.scenarioId)).size

  return (
    <GroundLayout title="Ground - ReadySet">
      <div className="gd-home3">
        <section className="gd-home3-ask" aria-label="SpinX에게 질문">
          <QuestionOrb viewer={viewer} size={440} />
        </section>

        <section className="gd-home3-map" aria-labelledby="gd-map-h">
          <header className="gd-sec">
            <h2 id="gd-map-h" className="gd-sec-t">인사이트 맵</h2>
            <p className="gd-sec-d">분석 리포트의 발견이 내 시나리오 어디에 닿는지 보여줘요. 점에 마우스를 올려보세요.</p>
          </header>
          <InsightMap viewer={viewer} highlight={hl} />
        </section>

        {/* 라이브러리 — 최신 5개씩. 카드·탭 없이 한 줄 목록 */}
        <div className="gd-wl-grid">
          <section aria-labelledby="gd-rep-h">
            <header className="gd-sec gd-wl-head">
              <div className="gd-sec-row">
                <h2 id="gd-rep-h" className="gd-sec-t">분석 리포트</h2>
                <button type="button" className="gd-float-more" onClick={() => navigate('/ground/library')}>전체 {reports.length}<ArrowRight size={12} className="gd-arrow" aria-hidden /></button>
              </div>
              <p className="gd-sec-d">CJ메조미디어가 실제 집행 데이터로 분석한 리포트예요. SpinX가 답할 때 근거로 써요.</p>
            </header>
            <ul className="gd-wl">
              {reports.slice(0, 5).map(r => {
                const sc = scenarioCount(r.id)
                return (
                  <li key={r.id}>
                    <button type="button" className="gd-wl-row"
                      onMouseEnter={() => setHl(r.id)} onMouseLeave={() => setHl(null)} onFocus={() => setHl(r.id)} onBlur={() => setHl(null)}
                      onClick={() => navigate(`/ground/library/${r.id}`)}>
                      <span className="gd-wl-d">{fmtMD(r.publishedAt)}</span>
                      <span className="gd-wl-t">{r.title}</span>
                      {r.sample && <span className="gd-sample">예시</span>}
                      <span className="gd-wl-m">{r.requiresActual ? '실측 연결 후' : sc ? `시나리오 ${sc}` : ''}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section aria-labelledby="gd-news-h">
            <header className="gd-sec gd-wl-head">
              <div className="gd-sec-row">
                <h2 id="gd-news-h" className="gd-sec-t">매체 소식</h2>
                <button type="button" className="gd-float-more" onClick={() => navigate('/ground/library')}>전체 {news.length}<ArrowRight size={12} className="gd-arrow" aria-hidden /></button>
              </div>
              <p className="gd-sec-d">매체의 정책·상품 변경 소식이에요. 내 시나리오 기간에 걸리면 SpinX가 함께 알려줘요.</p>
            </header>
            <ul className="gd-wl">
              {news.slice(0, 5).map(n => (
                <li key={n.id}>
                  <button type="button" className="gd-wl-row" onClick={() => navigate(`/ground/library/${n.id}`)}>
                    <span className="gd-wl-d">{fmtMD(n.publishedAt)}</span>
                    <span className="gd-wl-t">{n.title}</span>
                    <span className="gd-wl-m">{fmtMD(n.effectiveFrom)}부터</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </GroundLayout>
  )
}
