import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Share2, Link2, FileSpreadsheet, FileText, Info, MoreVertical, Copy, ArrowRightLeft, Trash2, Lock, Unlock } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { maskEmail } from '../../utils/maskEmail'
import { SpinXButton } from '../spinx/SpinXButton'
import { SpinXPanel } from '../spinx/SpinXPanel'
import { SpinXSymbol } from '../spinx/SpinXSymbol'
import { KPI_LABELS } from './types'
import { sampleBOResult, KPI_META } from './resultSampleData'
import { BOResultTable } from './BOResultTable'
import { BOResultScoreCards } from './BOResultScoreCards'
import { BOBudgetPieChart } from './BOBudgetPieChart'
import { BOResponseCurveChart } from './BOResponseCurveChart'
import { BODailyAttributionChart } from './BODailyAttributionChart'
import { BOKpiContributionChart } from './BOKpiContributionChart'

export function BOResult() {
  const navigate = useNavigate()
  const location = useLocation()
  useParams()

  const [isDarkMode, setIsDarkModeState] = useState(() => getDarkMode())
  const [spinXOpen, setSpinXOpen] = useState(false)
  const [spinXInitialInput, setSpinXInitialInput] = useState<string | undefined>(undefined)
  const [spinXInitialMessage, setSpinXInitialMessage] = useState<string | undefined>(undefined)
  // "이어서 질문하기"(차트): 자동 전송하지 않고 입력창에 프리필만
  const askSpinX = (prefill: string) => { setSpinXInitialInput(prefill); setSpinXInitialMessage(undefined); setSpinXOpen(true) }
  // "최적화 원리 알아보기"(헤더): 바로 질문 전송
  const askSpinXSend = (q: string) => { setSpinXInitialMessage(q); setSpinXInitialInput(undefined); setSpinXOpen(true) }
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [chartViewMode, setChartViewMode] = useState<'media' | 'product'>('media')
  const [resultView, setResultView] = useState<'locked' | 'pure'>('locked')

  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()

  // 샘플 결과 데이터 (실제로는 id로 조회)
  const result = sampleBOResult
  const kpiLabel = KPI_META[result.kpi].label

  const slotData = location.state?.slotData || { title: 'CJ올리브영 2025 하반기' }

  useEffect(() => { setDarkMode(isDarkMode) }, [isDarkMode])

  const handleToggleDarkMode = () => { const n = !isDarkMode; setIsDarkModeState(n); setDarkMode(n) }

  const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href); setExportMenuOpen(false) }
  const handleExportExcel = () => { console.log('Export Excel'); setExportMenuOpen(false) }
  const handleExportPDF = () => { console.log('Export PDF'); setExportMenuOpen(false) }

  const fmtWon = (v: number) => `₩${v.toLocaleString('ko-KR')}`

  // SpinX에게 최적화 원리 물어보기 트리거 (Reach Caster Effective Impression 패턴)
  const spinXModelTrigger = (
    <button
      onClick={() => askSpinXSend('Budget Optimizer는 어떤 원리로 예산을 최적화하나요? 효율 포화와 매체 우선 배분 관점에서 설명해 주세요.')}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        fontSize: '12px', color: 'hsl(var(--muted-foreground))'
      }}
      title="SpinX에게 물어보기"
    >
      <SpinXSymbol size={16} motion="idle" title="SpinX에게 물어보기" style={{ flexShrink: 0, transform: 'rotate(45deg)' }} />
      <span style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>최적화 원리 알아보기</span>
    </button>
  )

  return (
    <AppLayout
      currentView="budgetOptimizerResult"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', href: '/slotboard' },
        { label: slotData.title },
        { label: 'Budget Optimizer', href: '/budgetoptimizer' },
        { label: result.name }
      ]}
      isDarkMode={isDarkMode}
      onToggleDarkMode={handleToggleDarkMode}
      sidebarProps={{
        isCollapsed: isSidebarCollapsed,
        expandedFolders,
        onToggleSidebar: toggleSidebar,
        onToggleFolder: toggleFolder,
        onNavigateToWorkspace: () => navigate('/slotboard')
      }}
    >
      <div style={{
        transition: 'margin-right 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        marginRight: spinXOpen ? '400px' : '0px'
      }}>
        {/* 결과 헤더 (single-line) */}
        <div className="slot-detail-header">
          <div className="slot-detail-header__main" style={{ alignItems: 'center' }}>
            {/* 좌측: 타이틀 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <h1 style={{
                fontSize: '20px', fontWeight: '500', margin: 0, fontFamily: 'Paperlogy, sans-serif',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0
              }}>
                {result.name}
              </h1>
            </div>

            {/* 중앙: 주요 정보 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontFamily: 'Paperlogy, sans-serif', flexShrink: 0 }} className="text-muted-foreground">
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>총 예산</span>
                <span>{fmtWon(result.totalBudget)}</span>
              </div>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>KPI</span>
                <span style={{
                  padding: '2px 8px', borderRadius: '10px', fontSize: '11px',
                  backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))'
                }}>{KPI_LABELS[result.kpi]}</span>
              </div>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>업종</span>
                <span>{result.brand ? `${result.brand} / ${result.industry}` : result.industry}</span>
              </div>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: '500' }}>기간</span>
                <span>{result.period.start} → {result.period.end}</span>
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', backgroundColor: 'hsl(var(--border))', margin: '0 8px', flexShrink: 0 }} />

            {/* 우측: 액션 버튼들 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {/* Export 드롭다운 */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setExportMenuOpen(!exportMenuOpen)} className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
                  <Share2 size={16} />
                </button>
                {exportMenuOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '200px',
                    backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))',
                    borderRadius: '8px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', zIndex: 1000, overflow: 'hidden'
                  }}>
                    {[
                      { icon: <Link2 size={16} />, label: 'Copy Link', onClick: handleCopyLink },
                      { icon: <FileSpreadsheet size={16} />, label: 'Export to Excel', onClick: handleExportExcel },
                      { icon: <FileText size={16} />, label: 'Export to PDF', onClick: handleExportPDF }
                    ].map((item) => (
                      <button key={item.label} onClick={item.onClick}
                        style={{ width: '100%', padding: '12px 16px', border: 'none', backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px', color: 'hsl(var(--popover-foreground))' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        {item.icon}<span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Info 툴팁 */}
              <div style={{ position: 'relative' }}>
                <button
                  data-info-tooltip
                  onMouseEnter={() => setInfoTooltipOpen(true)}
                  onMouseLeave={() => setInfoTooltipOpen(false)}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '6px' }}
                >
                  <Info size={16} />
                </button>
                {infoTooltipOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '280px',
                    backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
                    borderRadius: '8px', padding: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    zIndex: 1000, fontFamily: 'Paperlogy, sans-serif'
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>설명</div>
                      <div style={{ fontSize: '13px', lineHeight: '1.5' }}>{result.description}</div>
                    </div>
                    <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '8px 0' }} />
                    <div style={{ marginBottom: '12px' }}>
                      <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>Scenario ID</div>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>#{result.id}</div>
                    </div>
                    <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '8px 0' }} />
                    <div style={{ marginBottom: '12px' }}>
                      <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>생성일시</div>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>{result.created}</div>
                      <div className="text-muted-foreground" style={{ fontSize: '12px' }}>
                        {result.creator} ({maskEmail(result.creatorId)})
                      </div>
                    </div>
                    <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '8px 0' }} />
                    <div>
                      <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>완료일시</div>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>{result.completedAt}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 컨텍스트 메뉴 */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
                  <MoreVertical size={16} />
                </button>
                {menuOpen && (
                  <div className="dropdown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', width: '120px', zIndex: 1000 }}>
                    <button onClick={() => { setMenuOpen(false); console.log('복제:', result.id) }} className="dropdown-item">
                      <Copy size={14} /> 복제
                    </button>
                    <button onClick={() => { setMenuOpen(false); console.log('이동:', result.id) }} className="dropdown-item">
                      <ArrowRightLeft size={14} /> 이동
                    </button>
                    <button onClick={() => { setMenuOpen(false); console.log('삭제:', result.id) }} className="dropdown-item">
                      <Trash2 size={14} /> 삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 결과 상태 띠배너 (잠금 시나리오에만 노출) */}
          {result.allocations.some(a => a.isFixed) && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
              marginLeft: '-32px', marginRight: '-32px', marginTop: '-24px',
              padding: '14px 32px',
              backgroundColor: 'hsl(var(--muted) / 0.35)',
              borderBottom: '1px solid hsl(var(--border))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', minWidth: 0 }}>
                {resultView === 'locked'
                  ? <Lock size={16} style={{ color: '#BF5AF2', flexShrink: 0 }} />
                  : <Unlock size={16} style={{ color: 'hsl(var(--muted-foreground))', flexShrink: 0 }} />}
                <span style={{ fontSize: '15px', fontWeight: '600', fontFamily: 'Paperlogy, sans-serif', color: 'hsl(var(--foreground))' }}>
                  {resultView === 'locked' ? 'Locked Budget Allocation' : 'Fully Optimized Allocation'}
                </span>
                <span style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                  {resultView === 'locked'
                    ? '시나리오 생성 시 설정한 예산 잠금이 반영된 최적화 결과입니다.'
                    : '예산 잠금 없이 모델이 전체 예산을 자유롭게 최적 배분한 결과입니다.'}
                </span>
              </div>
              <button
                onClick={() => setResultView(resultView === 'locked' ? 'pure' : 'locked')}
                style={{
                  background: 'hsl(var(--foreground))', color: 'hsl(var(--background))',
                  border: 'none', borderRadius: '20px', padding: '7px 14px',
                  fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0
                }}
              >
                {resultView === 'locked' ? <><Unlock size={12} /> 순수 최적화 결과 보기</> : <><Lock size={12} /> 잠금 반영 최적화 결과 보기</>}
              </button>
            </div>
          )}

          {/* 잠금이 없는 시나리오: 전환 없이 기본 타이틀만 */}
          {!result.allocations.some(a => a.isFixed) && (
            <div style={{ marginBottom: '-8px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '500', fontFamily: 'Paperlogy, sans-serif', margin: 0, marginBottom: '4px', color: 'hsl(var(--foreground))' }}>
                Optimized Budget Allocation
              </h3>
              <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', margin: 0 }}>
                모델이 전체 예산을 최적 배분한 결과입니다.
              </p>
            </div>
          )}

          {/* 스코어카드 */}
          <BOResultScoreCards
            allocations={resultView === 'locked' ? result.allocations : (result.pureAllocations || result.allocations)}
            totalBudget={result.totalBudget}
            kpiLabel={kpiLabel}
            kpiLabelEn={KPI_META[result.kpi].labelEn}
          />

          {/* 차트 존 상위 제목 + 최적화 원리 트리거 + 매체/상품 공통 토글 — 동일 선상 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '-16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', minWidth: 0 }}>
              <h3 style={{ fontSize: '20px', fontWeight: '500', fontFamily: 'Paperlogy, sans-serif', margin: 0, color: 'hsl(var(--foreground))' }}>
                Optimization Analytics
              </h3>
              {spinXModelTrigger}
            </div>
            <div style={{ display: 'flex', borderRadius: '6px', border: '1px solid hsl(var(--border))', overflow: 'hidden', flexShrink: 0 }}>
              {(['media', 'product'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setChartViewMode(mode)}
                  style={{
                    padding: '6px 16px', fontSize: '12px', fontWeight: '500', border: 'none', cursor: 'pointer',
                    backgroundColor: chartViewMode === mode ? 'hsl(var(--foreground))' : 'transparent',
                    color: chartViewMode === mode ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
                    transition: 'all 0.2s'
                  }}
                >
                  {mode === 'media' ? '매체' : '상품'}
                </button>
              ))}
            </div>
          </div>

          {/* 차트 그리드 (각 차트가 한글 질문을 제목으로 가짐) — 여백 넉넉히 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '40px', rowGap: '48px' }}>
            <BOBudgetPieChart allocations={resultView === 'locked' ? result.allocations : (result.pureAllocations || result.allocations)} insight={result.spinxInsights.pie} viewMode={chartViewMode} onAsk={askSpinX} />
            <BOResponseCurveChart data={result.responseCurve} allocations={resultView === 'locked' ? result.allocations : (result.pureAllocations || result.allocations)} kpiLabel={kpiLabel} insight={result.spinxInsights.responseCurve} viewMode={chartViewMode} totalBudget={result.totalBudget} onAsk={askSpinX} />
            <BODailyAttributionChart data={result.dailyAttribution} dataByProduct={result.dailyAttributionByProduct} allocations={resultView === 'locked' ? result.allocations : (result.pureAllocations || result.allocations)} kpiLabel={kpiLabel} insight={result.spinxInsights.dailyAttribution} viewMode={chartViewMode} onAsk={askSpinX} campaignPeriod={result.period} />
            <BOKpiContributionChart data={result.kpiWaterfall} dataByProduct={result.kpiWaterfallByProduct} kpiLabel={kpiLabel} insight={result.spinxInsights.kpiContribution} viewMode={chartViewMode} onAsk={askSpinX} />
          </div>

          {/* 차트 끝 */}

          {/* 결과 테이블 */}
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '500', fontFamily: 'Paperlogy, sans-serif', margin: 0, marginBottom: '8px', color: 'hsl(var(--foreground))' }}>
              Budget Allocation Detail
            </h3>
            <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', marginBottom: '20px' }}>
              매체·상품별 예산 배분과 예상 성과를 상세하게 확인할 수 있습니다.
            </p>
            <BOResultTable
              allocations={resultView === 'locked' ? result.allocations : (result.pureAllocations || result.allocations)}
              lockedAllocations={result.allocations}
              kpiLabel={KPI_META[result.kpi].labelEn}
              resultView={resultView}
            />
          </div>
        </div>
      </div>

      {/* SpinX */}
      <SpinXButton isDarkMode={isDarkMode} onClick={() => setSpinXOpen(true)} isOpen={spinXOpen} />
      <SpinXPanel
        isOpen={spinXOpen}
        onClose={() => { setSpinXOpen(false); setSpinXInitialMessage(undefined); setSpinXInitialInput(undefined) }}
        isDarkMode={isDarkMode}
        scenarioName={result.name}
        analysisType="budgetOptimizer"
        initialMessage={spinXInitialMessage}
        initialInput={spinXInitialInput}
        mentionItems={[
          { id: 'budgetShare', label: 'Budget Share 차트' },
          { id: 'responseCurve', label: 'Response Curve 차트' },
          { id: 'weeklyContribution', label: 'Weekly Contribution 차트' },
          { id: 'incremental', label: 'Incremental 차트' }
        ]}
      />
    </AppLayout>
  )
}
