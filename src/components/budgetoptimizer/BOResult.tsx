import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Share2, Link2, FileSpreadsheet, FileText, Info, MoreVertical, Copy, ArrowRightLeft, Trash2, Lock, Unlock, ArrowRight, TrendingUp, CheckCircle, AlertCircle, X } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { maskEmail } from '../../utils/maskEmail'
import { SpinXButton } from '../spinx/SpinXButton'
import { SpinXPanel } from '../spinx/SpinXPanel'
import { SpinXSymbol } from '../spinx/SpinXSymbol'
import { KPI_LABELS } from './types'
import { getBOResult, KPI_META } from './resultSampleData'
import { BOResultTable } from './BOResultTable'
import { BOResultScoreCards } from './BOResultScoreCards'
import { BOBudgetPieChart } from './BOBudgetPieChart'
import { BOResponseCurveChart } from './BOResponseCurveChart'
import { BODailyAttributionChart } from './BODailyAttributionChart'
import { BOKpiContributionChart } from './BOKpiContributionChart'
import { BOReachCasterEasyCreateModal } from './BOReachCasterEasyCreateModal'

export function BOResult() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: idParam } = useParams()

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
  const [principleTooltipOpen, setPrincipleTooltipOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [chartViewMode, setChartViewMode] = useState<'media' | 'product'>('media')
  const [easyCreateOpen, setEasyCreateOpen] = useState(false)
  const [resultView, setResultView] = useState<'locked' | 'pure'>('locked')

  // 이동/삭제 다이얼로그 (Reach Caster 동일)
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [moveTargetSlot, setMoveTargetSlot] = useState('')
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()

  // id로 결과 조회 — 잠금 없는 시나리오면 잠금 없는 버전이 반환됨
  const result = getBOResult(Number(idParam) || 1)
  const kpiLabel = KPI_META[result.kpi].label

  const slotData = location.state?.slotData || { title: 'CJ올리브영 2025 하반기' }

  useEffect(() => { setDarkMode(isDarkMode) }, [isDarkMode])

  // 토스트 자동 닫기 (Reach Caster 동일)
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const handleToggleDarkMode = () => { const n = !isDarkMode; setIsDarkModeState(n); setDarkMode(n) }

  // 복제/이동/삭제 (Reach Caster 결과 화면 동일 패턴)
  const handleDuplicate = () => {
    setMenuOpen(false)
    setShowToast({ type: 'success', message: '시나리오가 복제되었습니다.' })
  }

  const handleConfirmMove = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowToast({ type: 'success', message: '시나리오가 성공적으로 이동되었습니다.' })
    } catch (error) {
      setShowToast({ type: 'error', message: '시나리오 이동에 실패했습니다. 다시 시도해주세요.' })
    } finally {
      setShowMoveDialog(false)
      setMoveTargetSlot('')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowToast({ type: 'success', message: '시나리오가 성공적으로 삭제되었습니다.' })
      setTimeout(() => { navigate('/budgetoptimizer') }, 1500)
    } catch (error) {
      setShowToast({ type: 'error', message: '시나리오 삭제에 실패했습니다. 다시 시도해주세요.' })
    } finally {
      setShowDeleteDialog(false)
    }
  }

  const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href); setExportMenuOpen(false) }
  const handleExportExcel = () => { console.log('Export Excel'); setExportMenuOpen(false) }
  const handleExportPDF = () => { console.log('Export PDF'); setExportMenuOpen(false) }

  const fmtWon = (v: number) => `₩${v.toLocaleString('ko-KR')}`

  // SpinX에게 최적화 원리 물어보기 트리거 (Reach Caster Effective Impression 패턴)
  // 호버: 최적화 원리 요약 툴팁(B) / 클릭: SpinX 원리 설명 자동 전송(C)
  const spinXModelTrigger = (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setPrincipleTooltipOpen(true)}
      onMouseLeave={() => setPrincipleTooltipOpen(false)}
    >
      <button
        onClick={() => askSpinXSend('Budget Optimizer는 어떤 원리로 예산을 최적화하나요? 효율 포화와 매체 우선 배분 관점에서 설명해 주세요.')}
        className="inline-flex items-center gap-[6px] bg-none border-none p-0 cursor-pointer text-[12px] text-[hsl(var(--muted-foreground))]"
      >
        <SpinXSymbol size={16} motion="idle" style={{ flexShrink: 0, transform: 'rotate(45deg)' }} />
        <span className="underline underline-offset-2">최적화 원리 알아보기</span>
      </button>
      {principleTooltipOpen && (
        <div className="absolute top-full left-0 mt-2 w-[320px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-[14px] shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1)] z-[1000] font-[Paperlogy,sans-serif]">
          <div className="text-[13px] font-semibold mb-[10px]">최적화 원리</div>

          {/* 원리 2가지 */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-start">
              <span className="text-[11px] font-bold text-[hsl(var(--primary))] flex-shrink-0 mt-[1px]">1</span>
              <div className="text-[12px] leading-[1.5]">
                <b>매체 우선 배분</b>
                <div className="text-muted-foreground">매체 단위로 먼저 나눈 뒤, 그 안에서 상품별로 배분합니다.</div>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-[11px] font-bold text-[hsl(var(--primary))] flex-shrink-0 mt-[1px]">2</span>
              <div className="text-[12px] leading-[1.5]">
                <b>효율 포화 회피</b>
                <div className="text-muted-foreground">성과가 둔해지는 포화 지점을 넘는 과잉 투입은 피합니다.</div>
              </div>
            </div>
          </div>

          <div className="text-muted-foreground text-[11px] mt-3 opacity-80">
            클릭하면 SpinX가 이 시나리오에 맞춰 더 자세히 설명해 드려요.
          </div>
        </div>
      )}
    </div>
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
          <div className="slot-detail-header__main items-center">
            {/* 좌측: 타이틀 */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <h1 className="text-[20px] font-medium m-0 font-[Paperlogy,sans-serif] whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                {result.name}
              </h1>
            </div>

            {/* 중앙: 주요 정보 */}
            <div className="text-muted-foreground flex items-center gap-4 text-[12px] font-[Paperlogy,sans-serif] flex-shrink-0">
              <div className="flex items-center gap-1">
                <span className="font-medium">총 예산</span>
                <span>{fmtWon(result.totalBudget)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">KPI</span>
                <span className="px-2 py-[2px] rounded-[10px] text-[11px] bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">{KPI_LABELS[result.kpi]}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">업종</span>
                <span>{result.brand ? `${result.brand} / ${result.industry}` : result.industry}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">기간</span>
                <span>{result.period.start} → {result.period.end}</span>
              </div>
            </div>

            <div className="w-px h-6 bg-[hsl(var(--border))] mx-2 flex-shrink-0" />

            {/* 우측: 액션 버튼들 */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Export 드롭다운 */}
              <div className="relative">
                <button onClick={() => setExportMenuOpen(!exportMenuOpen)} className="btn btn-ghost btn-sm p-[6px]">
                  <Share2 size={16} />
                </button>
                {exportMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-[200px] bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-lg shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1)] z-[1000] overflow-hidden">
                    {[
                      { icon: <Link2 size={16} />, label: 'Copy Link', onClick: handleCopyLink },
                      { icon: <FileSpreadsheet size={16} />, label: 'Export to Excel', onClick: handleExportExcel },
                      { icon: <FileText size={16} />, label: 'Export to PDF', onClick: handleExportPDF }
                    ].map((item) => (
                      <button key={item.label} onClick={item.onClick}
                        className="w-full px-4 py-3 border-none bg-transparent hover:bg-[hsl(var(--muted))] text-left cursor-pointer text-[13px] flex items-center gap-[10px] text-[hsl(var(--popover-foreground))]">
                        {item.icon}<span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Info 툴팁 */}
              <div className="relative">
                <button
                  data-info-tooltip
                  onMouseEnter={() => setInfoTooltipOpen(true)}
                  onMouseLeave={() => setInfoTooltipOpen(false)}
                  className="btn btn-ghost btn-sm p-[6px]"
                >
                  <Info size={16} />
                </button>
                {infoTooltipOpen && (
                  <div className="absolute top-full right-0 mt-2 w-[280px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-3 shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1)] z-[1000] font-[Paperlogy,sans-serif]">
                    <div className="mb-3">
                      <div className="text-muted-foreground text-[11px] mb-1">설명</div>
                      <div className="text-[13px] leading-[1.5]">{result.description}</div>
                    </div>
                    <div className="h-px bg-[hsl(var(--border))] my-2" />
                    <div className="mb-3">
                      <div className="text-muted-foreground text-[11px] mb-1">Scenario ID</div>
                      <div className="text-[13px] font-medium">{result.id}</div>
                    </div>
                    <div className="h-px bg-[hsl(var(--border))] my-2" />
                    <div className="mb-3">
                      <div className="text-muted-foreground text-[11px] mb-1">생성일시</div>
                      <div className="text-[13px] font-medium">{result.created}</div>
                      <div className="text-muted-foreground text-[12px]">
                        {result.creator} ({maskEmail(result.creatorId)})
                      </div>
                    </div>
                    <div className="h-px bg-[hsl(var(--border))] my-2" />
                    <div>
                      <div className="text-muted-foreground text-[11px] mb-1">완료일시</div>
                      <div className="text-[13px] font-medium">{result.completedAt}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 컨텍스트 메뉴 */}
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-ghost btn-sm p-[6px]">
                  <MoreVertical size={16} />
                </button>
                {menuOpen && (
                  <div className="dropdown absolute top-full right-0 mt-1 w-[260px] z-[1000]">
                    <button onClick={() => { setMenuOpen(false); setEasyCreateOpen(true) }} className="dropdown-item whitespace-nowrap">
                      <TrendingUp size={14} style={{ flexShrink: 0 }} /> Reach Caster로 도달 예측하기
                    </button>
                    <div className="h-px bg-[hsl(var(--border))] my-1" />
                    <button onClick={handleDuplicate} className="dropdown-item">
                      <Copy size={14} /> 복제
                    </button>
                    <button onClick={() => { setMenuOpen(false); setShowMoveDialog(true) }} className="dropdown-item">
                      <ArrowRightLeft size={14} /> 이동
                    </button>
                    <button onClick={() => { setMenuOpen(false); setShowDeleteDialog(true) }} className="dropdown-item text-[hsl(var(--destructive))]">
                      <Trash2 size={14} /> 삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className="px-8 py-6 flex flex-col gap-6">
          {/* 결과 상태 띠배너 (잠금 시나리오에만 노출) */}
          {result.allocations.some(a => a.isFixed) && (
            <div className="flex items-center justify-between gap-4 -mx-8 -mt-6 px-8 py-[14px] bg-[hsl(var(--muted)/0.35)] border-b border-[hsl(var(--border))]">
              <div className="flex items-center gap-3 flex-wrap min-w-0">
                {resultView === 'locked'
                  ? <Lock size={16} style={{ color: 'hsl(var(--foreground))', flexShrink: 0 }} />
                  : <Unlock size={16} style={{ color: 'hsl(var(--muted-foreground))', flexShrink: 0 }} />}
                <span className="text-[15px] font-semibold font-[Paperlogy,sans-serif] text-[hsl(var(--foreground))]">
                  {resultView === 'locked' ? 'Locked Budget Allocation' : 'Fully Optimized Allocation'}
                </span>
                <span className="text-[13px] text-[hsl(var(--muted-foreground))]">
                  {resultView === 'locked'
                    ? '시나리오 생성 시 설정한 예산 잠금이 반영된 최적화 결과입니다.'
                    : '예산 잠금 없이 모델이 전체 예산을 자유롭게 최적 배분한 결과입니다.'}
                </span>
              </div>
              <button
                onClick={() => setResultView(resultView === 'locked' ? 'pure' : 'locked')}
                className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] border-none rounded-[20px] px-[14px] py-[7px] text-[12px] font-medium cursor-pointer flex items-center gap-[5px] flex-shrink-0"
              >
                {resultView === 'locked' ? <><Unlock size={12} /> 순수 최적화 결과 보기</> : <><Lock size={12} /> 잠금 반영 최적화 결과 보기</>}
              </button>
            </div>
          )}

          {/* 스코어카드 */}
          <BOResultScoreCards
            allocations={resultView === 'locked' ? result.allocations : (result.pureAllocations || result.allocations)}
            totalBudget={result.totalBudget}
            kpiCode={result.kpi}
            kpiLabel={kpiLabel}
            kpiLabelEn={KPI_META[result.kpi].labelEn}
          />

          {/* 차트 존 상위 제목 + 최적화 원리 트리거 + 매체/상품 공통 토글 — 동일 선상 */}
          <div className="flex items-center justify-between gap-4 mb-[-16px]">
            <div className="flex items-center gap-[14px] flex-wrap min-w-0">
              <h3 className="text-[20px] font-medium font-[Paperlogy,sans-serif] m-0 text-[hsl(var(--foreground))]">
                Optimization Analytics
              </h3>
              {spinXModelTrigger}
            </div>
            <div className="flex rounded-md border border-[hsl(var(--border))] overflow-hidden flex-shrink-0">
              {(['media', 'product'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setChartViewMode(mode)}
                  className="px-4 py-[6px] text-[12px] font-medium border-none cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: chartViewMode === mode ? 'hsl(var(--foreground))' : 'transparent',
                    color: chartViewMode === mode ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))'
                  }}
                >
                  {mode === 'media' ? '매체' : '상품'}
                </button>
              ))}
            </div>
          </div>

          {/* 차트 그리드 (각 차트가 한글 질문을 제목으로 가짐) — 여백 넉넉히 */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-12">
            <BOBudgetPieChart allocations={resultView === 'locked' ? result.allocations : (result.pureAllocations || result.allocations)} insight={result.spinxInsights.pie} viewMode={chartViewMode} onAsk={askSpinX} />
            <BOResponseCurveChart data={result.responseCurve} allocations={resultView === 'locked' ? result.allocations : (result.pureAllocations || result.allocations)} kpiLabel={kpiLabel} insight={result.spinxInsights.responseCurve} viewMode={chartViewMode} totalBudget={result.totalBudget} onAsk={askSpinX} />
            <BODailyAttributionChart data={result.dailyAttribution} dataByProduct={result.dailyAttributionByProduct} allocations={resultView === 'locked' ? result.allocations : (result.pureAllocations || result.allocations)} kpiLabel={kpiLabel} insight={result.spinxInsights.dailyAttribution} viewMode={chartViewMode} onAsk={askSpinX} campaignPeriod={result.period} />
            <BOKpiContributionChart data={result.kpiWaterfall} dataByProduct={result.kpiWaterfallByProduct} kpiLabel={kpiLabel} insight={result.spinxInsights.kpiContribution} viewMode={chartViewMode} onAsk={askSpinX} />
          </div>

          {/* 차트 끝 */}

          {/* 결과 테이블 */}
          <div className="mt-6">
            <h3 className="text-[20px] font-medium font-[Paperlogy,sans-serif] m-0 mb-2 text-[hsl(var(--foreground))]">
              Budget Allocation Detail
            </h3>
            <p className="text-[13px] text-[hsl(var(--muted-foreground))] mb-5">
              매체·상품별 예산 배분과 예상 성과를 상세하게 확인할 수 있습니다.
              {result.allocations.some(a => a.isFixed) && ' 순수 최적화 결과 보기에서는 값 아래에 사용자가 잠근 설정값 대비 증감(↑ 증가 · ↓ 감소)을 함께 표시합니다.'}
            </p>
            <BOResultTable
              allocations={resultView === 'locked' ? result.allocations : (result.pureAllocations || result.allocations)}
              lockedAllocations={result.allocations}
              kpiLabel={KPI_META[result.kpi].labelEn}
              resultView={resultView}
              totalReach={resultView === 'locked' ? result.totalReach : (result.pureTotalReach ?? result.totalReach)}
            />
          </div>

          {/* Reach Caster 간편 생성 CTA (완료 상태) — 눈에 띄는 primary 스타일 */}
          {result.status === 'Completed' && (
            <div className="mt-6 pt-8 border-t border-[hsl(var(--border))] flex flex-col items-start gap-5">
              {/* 맥락: 여기서 새로 보게 될 것 */}
              <div className="flex flex-col gap-[10px] max-w-[560px]">
                <span className="text-[18px] font-semibold font-[Paperlogy,sans-serif] text-[hsl(var(--foreground))] tracking-[-0.01em]">
                  이 예산안이면 몇 명에게 닿을까요?
                </span>
                <span className="text-[14px] text-[hsl(var(--muted-foreground))] leading-[1.6]">
                  Reach Caster에서 타겟 GRP를 설정하면 도달·프리퀀시와 리치커브까지 이어서 볼 수 있어요.
                </span>
              </div>

              {/* 버튼: 프로덕트 primary(pill) 표준에 맞춤 — 텍스트 아래 좌측 정렬 */}
              <button
                onClick={() => setEasyCreateOpen(true)}
                className="bo-reach-cta inline-flex items-center gap-2 flex-shrink-0 h-12 px-6 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] border-none rounded-[24px] cursor-pointer text-[14px] font-semibold font-[Paperlogy,sans-serif] text-[hsl(var(--primary-foreground))] transition-colors duration-200 whitespace-nowrap"
                onMouseEnter={(e) => {
                  const go = e.currentTarget.querySelector<HTMLElement>('.bo-reach-cta__go')
                  if (go) go.style.transform = 'translateX(3px)'
                }}
                onMouseLeave={(e) => {
                  const go = e.currentTarget.querySelector<HTMLElement>('.bo-reach-cta__go')
                  if (go) go.style.transform = 'translateX(0)'
                }}
              >
                <TrendingUp size={16} style={{ flexShrink: 0 }} />
                Reach Caster로 예측하기
                <span className="bo-reach-cta__go inline-flex items-center transition-transform duration-200">
                  <ArrowRight size={16} />
                </span>
              </button>
            </div>
          )}
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
          { id: 'budgetShare', label: 'Budget Share 차트', kind: 'chart' },
          { id: 'responseCurve', label: 'Response Curve 차트', kind: 'chart' },
          { id: 'weeklyContribution', label: 'Weekly Contribution 차트', kind: 'chart' },
          { id: 'incremental', label: 'Incremental 차트', kind: 'chart' }
        ]}
      />

      {/* Reach Caster 간편 생성 중간 설정 레이어 */}
      <BOReachCasterEasyCreateModal
        isOpen={easyCreateOpen}
        onClose={() => setEasyCreateOpen(false)}
        allocations={resultView === 'locked' ? result.allocations : (result.pureAllocations || result.allocations)}
        sourceId={result.id}
        scenarioName={result.name}
        industry={result.industry}
        period={result.period}
        onConfirm={({ scenarioName, targetGrp, mappedAllocations, impressionMode }) => {
          setEasyCreateOpen(false)
          // 예상 노출 전달 여부 판별: none=미전달 / required=CPT 등 필수 상품만 / all=전부
          const isCPT = (name: string) => /_CPT$|_CPT_|예약형|보장형/.test(name)
          const includeImpression = (name: string) =>
            impressionMode === 'all' || (impressionMode === 'required' && isCPT(name))
          navigate('/reachcaster/scenario/new', {
            state: {
              slotData,
              easyCreateFromBO: {
                scenarioName,
                sourceName: result.name,
                industry: result.industry,
                brand: result.brand,
                period: result.period,
                targetGrp,
                impressionMode,
                prefillMedia: mappedAllocations.map(a => ({
                  mediaName: a.mediaName,
                  productName: a.productName,
                  budget: a.budget,
                  impression: includeImpression(a.productName) ? a.impression : undefined
                }))
              }
            }
          })
        }}
      />

      {/* 시나리오 이동 다이얼로그 (Reach Caster 동일) */}
      {showMoveDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">
                시나리오 이동
              </h3>
              <p className="dialog-description">
                "{result.name}"를 다른 Slot으로 이동합니다.
              </p>
            </div>
            <div className="py-4">
              <div className="mb-3">
                <label className="text-[13px] font-semibold mb-2 block">
                  이동할 Slot 선택
                </label>
                <select
                  className="input w-full"
                  value={moveTargetSlot}
                  onChange={(e) => setMoveTargetSlot(e.target.value)}
                >
                  <option value="">Slot을 선택하세요</option>
                  <option value="slot-1">CJ올리브영 2025 상반기</option>
                  <option value="slot-2">CJ올리브영 브랜드 캠페인</option>
                  <option value="slot-3">CJ올리브영 신제품 프로모션</option>
                </select>
              </div>
            </div>
            <div className="dialog-footer">
              <button
                onClick={() => { setShowMoveDialog(false); setMoveTargetSlot('') }}
                className="btn btn-secondary btn-sm"
              >
                취소
              </button>
              <button
                onClick={handleConfirmMove}
                disabled={!moveTargetSlot}
                className="btn btn-primary btn-sm"
                style={{ opacity: moveTargetSlot ? 1 : 0.5, cursor: moveTargetSlot ? 'pointer' : 'not-allowed' }}
              >
                이동
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 시나리오 삭제 확인 다이얼로그 (Reach Caster 동일) */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">
                시나리오를 삭제하시겠습니까?
              </h3>
              <p className="dialog-description">
                "{result.name}"를 삭제하면 복원할 수 없습니다. 정말로 삭제하시겠습니까?
              </p>
            </div>
            <div className="dialog-footer">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="btn btn-secondary btn-sm"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn btn-sm border-none bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 알림 (Reach Caster 동일) */}
      {showToast && (
        <div className={`toast ${showToast.type === 'success' ? 'toast--success' : 'toast--error'}`}>
          <div className="toast__icon">
            {showToast.type === 'success' ? (
              <CheckCircle size={20} style={{ color: 'hsl(142.1 76.2% 36.3%)' }} />
            ) : (
              <AlertCircle size={20} style={{ color: 'hsl(var(--destructive))' }} />
            )}
          </div>
          <div className="toast__content">
            <p className="toast__title">
              {showToast.type === 'success' ? '성공' : '오류'}
            </p>
            <p className="toast__description">
              {showToast.message}
            </p>
          </div>
          <button
            onClick={() => setShowToast(null)}
            className="toast__close"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </AppLayout>
  )
}
