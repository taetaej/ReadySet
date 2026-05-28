import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Database, Target, Sparkles, DollarSign, LayoutGrid, BookOpen, HelpCircle, FileText } from 'lucide-react'

const solutions = [
  { name: 'DataShot', desc: '업종별 광고 성과 벤치마크 데이터 추출', slug: 'datashot-overview', icon: Database },
  { name: 'Reach Caster', desc: '도달률 예측 및 최적 매체 배분 탐색', slug: 'reach-caster-overview', icon: Target },
  { name: 'Ad Curator', desc: '광고 소재 최적화', slug: 'ad-curator-overview', icon: Sparkles, disabled: true },
  { name: 'Budget Optimizer', desc: '예산 최적화', slug: 'budget-optimizer-overview', icon: DollarSign, disabled: true },
]

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
      <h1 className="docs-intro-title">ReadySet</h1>
      <p className="docs-intro-desc">
        ReadySet은 광고 캠페인의 예측 분석을 위한 통합 플랫폼입니다. 업종별 특화 모델을 기반으로 도달률 예측, 매체 배분 최적화, 성과 벤치마크 분석을 지원합니다.
      </p>

      {/* 솔루션 카드 4개 */}
      <section className="docs-intro-section">
        <h2 className="docs-intro-section-title">솔루션</h2>
        <div className="docs-intro-solutions">
          {solutions.map((sol) => {
            const Icon = sol.icon
            return (
              <button
                key={sol.name}
                className={`docs-intro-solution-card ${sol.disabled ? 'docs-intro-solution-card--disabled' : ''}`}
                onClick={() => !sol.disabled && navigate(`/docs/${sol.slug}`)}
                disabled={sol.disabled}
              >
                <Icon size={20} className="docs-intro-solution-icon" />
                <div className="docs-intro-solution-name">{sol.name}</div>
                <div className="docs-intro-solution-desc">{sol.desc}</div>
                {sol.disabled && <span className="docs-intro-badge">준비중</span>}
              </button>
            )
          })}
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
