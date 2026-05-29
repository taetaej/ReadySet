import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, BookOpen, HelpCircle, FileText, Plus, Database, Zap } from 'lucide-react'
import { SpinXSymbol } from '../spinx/SpinXSymbol'

const solutions = [
  { name: 'DataShot', desc: '업종별 벤치마크 기반으로\n광고 효율을 분석합니다.', slug: 'datashot-overview' },
  { name: 'Ad Curator', desc: '캠페인 성과 데이터를 기반으로\n맞춤형 광고 상품을 큐레이션합니다.', slug: 'ad-curator-overview', disabled: true },
  { name: 'Budget Optimizer', desc: 'KPI 목표에 맞춰\n미디어믹스 예산을 최적 배분합니다.', slug: 'budget-optimizer-overview', disabled: true },
  { name: 'Reach Caster', desc: '크로스미디어 통합 도달을 예측하고\n최적 예산 배분을 시뮬레이션합니다.', slug: 'reach-caster-overview' },
]

const workflow = [
  { step: '01', label: '데이터 분석', solution: 'DataShot' },
  { step: '02', label: '상품 추천', solution: 'Ad Curator' },
  { step: '03', label: '예산 최적화', solution: 'Budget Optimizer' },
  { step: '04', label: '도달 예측', solution: 'Reach Caster' },
]

const quickRefs = [
  { name: '시나리오 생성하기', slug: 'reach-caster-create', icon: Plus },
  { name: '데이터셋 생성하기', slug: 'datashot-create', icon: Database },
  { name: 'Slot 생성 및 관리', slug: 'slotboard-create', icon: BookOpen },
  { name: 'SpinX 사용 방법', slug: 'spinx-reach-caster', icon: Zap },
  { name: 'FAQ', slug: 'resources-faq', icon: HelpCircle },
]

export function DocsIntroPage() {
  const navigate = useNavigate()

  return (
    <div className="docs-intro">
      {/* Hero */}
      <section className="docs-intro-hero">
        <p className="docs-intro-hero-label">ReadySet — Ready to Slot, Set to Win</p>
        <h1 className="docs-intro-hero-title">
          광고 캠페인 예측·분석부터<br />전략 완성까지, 하나로 연결합니다.
        </h1>
        <p className="docs-intro-hero-sub">
          ReadySet은 벤치마크 데이터 분석부터 광고 상품 추천, 예산 최적화, 도달률 예측까지<br />
          — 캠페인의 전 과정을 하나의 Slot 안에서 관리하는 통합 광고 인텔리전스 플랫폼입니다.
        </p>
      </section>

      {/* Solutions Grid */}
      <section className="docs-intro-section">
        <div className="docs-intro-grid">
          {solutions.map((sol) => (
            <button
              key={sol.name}
              className={`docs-intro-card ${sol.disabled ? 'docs-intro-card--disabled' : ''}`}
              onClick={() => !sol.disabled && navigate(`/docs/${sol.slug}`)}
              disabled={sol.disabled}
            >
              {sol.disabled && <span className="docs-intro-card-badge">Coming Soon</span>}
              <div className="docs-intro-card-name">{sol.name}</div>
              <div className="docs-intro-card-desc">{sol.desc}</div>
              {!sol.disabled && (
                <span className="docs-intro-card-link">
                  자세히 보기 <ChevronRight size={12} />
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Workflow Timeline */}
      <section className="docs-intro-section">
        <h2 className="docs-intro-section-title">Workflow</h2>
        <div className="docs-intro-workflow">
          {workflow.map((item, idx) => (
            <React.Fragment key={item.step}>
              <div className="docs-intro-workflow-step">
                <span className="docs-intro-workflow-num">{item.step}</span>
                <span className="docs-intro-workflow-label">{item.label}</span>
                <span className="docs-intro-workflow-solution">{item.solution}</span>
              </div>
              {idx < workflow.length - 1 && <div className="docs-intro-workflow-line" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* SpinX Banner */}
      <section className="docs-intro-section">
        <button
          className="docs-intro-spinx-banner"
          onClick={() => navigate('/docs/spinx-overview')}
        >
          <div className="docs-intro-spinx-left">
            <div className="docs-intro-spinx-symbol">
              <SpinXSymbol size={32} motion="active" title="" style={{ transform: 'rotate(45deg)' }} />
            </div>
            <div>
              <div className="docs-intro-spinx-title">SpinX</div>
              <div className="docs-intro-spinx-desc">AI 어시스턴트로 분석 결과를 더 스마트하게 해석하세요.</div>
            </div>
          </div>
          <ChevronRight size={16} className="docs-intro-spinx-arrow" />
        </button>
      </section>

      {/* Quick References */}
      <section className="docs-intro-section">
        <h2 className="docs-intro-section-title">Quick references</h2>
        <div className="docs-intro-quick-refs">
          {quickRefs.map((ref) => {
            const Icon = ref.icon
            return (
              <button
                key={ref.slug}
                className="docs-intro-quick-ref"
                onClick={() => navigate(`/docs/${ref.slug}`)}
              >
                <Icon size={15} className="docs-intro-quick-ref-icon" />
                <span className="docs-intro-quick-ref-name">{ref.name}</span>
                <ChevronRight size={14} className="docs-intro-quick-ref-arrow" />
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
