import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Database, Target, Sparkles, DollarSign, LayoutGrid, HelpCircle, FileText } from 'lucide-react'

const sections = [
  { name: 'ReadySet', desc: '플랫폼 소개 · SlotBoard', slug: 'slotboard-overview', icon: LayoutGrid },
  { name: 'DataShot', desc: '데이터셋 생성 · 관리', slug: 'datashot-overview', icon: Database },
  { name: 'Reach Caster', desc: '시나리오 생성 · 결과', slug: 'reach-caster-overview', icon: Target },
  { name: 'Ad Curator', desc: '준비중', slug: 'ad-curator-overview', icon: Sparkles, disabled: true },
  { name: 'Budget Optimizer', desc: '준비중', slug: 'budget-optimizer-overview', icon: DollarSign, disabled: true },
  { name: 'SpinX', desc: 'AI 어시스턴트', slug: 'spinx-overview', icon: Sparkles },
  { name: 'Resources', desc: 'FAQ · 용어 사전', slug: 'resources-faq', icon: HelpCircle },
  { name: 'Release Notes', desc: '업데이트 내역', slug: 'release-notes-latest', icon: FileText },
]

export function DocsIntroPage() {
  const navigate = useNavigate()

  return (
    <div className="docs-intro">
      <h1 className="docs-intro-title">ReadySet Docs</h1>
      <p className="docs-intro-desc">
        ReadySet 플랫폼의 사용자 가이드입니다. 각 솔루션의 사용 방법, 주요 기능, 워크플로우를 안내합니다.
      </p>

      {/* Docs 소개 */}
      <section className="docs-intro-section">
        <div className="docs-intro-about">
          <p>이 문서에서는 다음 내용을 확인할 수 있습니다:</p>
          <ul>
            <li>SlotBoard를 통한 작업 공간 생성 및 관리</li>
            <li>DataShot으로 업종별 광고 성과 벤치마크 데이터 추출</li>
            <li>Reach Caster로 도달률 예측 및 최적 매체 배분 탐색</li>
            <li>SpinX AI 어시스턴트를 활용한 인사이트 분석</li>
          </ul>
          <p>좌측 메뉴 또는 아래 타일에서 원하는 가이드로 바로 이동할 수 있습니다.</p>
        </div>
      </section>

      {/* A to Z 타일 */}
      <section className="docs-intro-section">
        <h2 className="docs-intro-section-title">ReadySet A to Z</h2>
        <div className="docs-intro-tiles">
          {sections.map((sec) => {
            const Icon = sec.icon
            return (
              <button
                key={sec.name}
                className={`docs-intro-tile ${sec.disabled ? 'docs-intro-tile--disabled' : ''}`}
                onClick={() => !sec.disabled && navigate(`/docs/${sec.slug}`)}
                disabled={sec.disabled}
              >
                <Icon size={18} className="docs-intro-tile-icon" />
                <div>
                  <div className="docs-intro-tile-name">{sec.name}</div>
                  <div className="docs-intro-tile-desc">{sec.desc}</div>
                </div>
                {sec.disabled && <span className="docs-intro-tile-badge">준비중</span>}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
