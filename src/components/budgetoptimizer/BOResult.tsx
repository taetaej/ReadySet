import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Share2, Link2, FileSpreadsheet, FileText, Info, MoreVertical, Copy, ArrowRightLeft, Trash2 } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { maskEmail } from '../../utils/maskEmail'
import { SpinXButton } from '../spinx/SpinXButton'
import { SpinXPanel } from '../spinx/SpinXPanel'
import { KPI_LABELS } from './types'
import { sampleBOResult, KPI_META } from './resultSampleData'
import { BOResultTable } from './BOResultTable'
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
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
          {/* 결과 테이블 */}
          <BOResultTable allocations={result.allocations} kpiLabel={KPI_META[result.kpi].labelEn} />

          {/* 차트 2×2 그리드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <BOBudgetPieChart allocations={result.allocations} insight={result.spinxInsights.pie} />
            <BOResponseCurveChart data={result.responseCurve} allocations={result.allocations} kpiLabel={kpiLabel} insight={result.spinxInsights.responseCurve} />
            <BODailyAttributionChart data={result.dailyAttribution} allocations={result.allocations} kpiLabel={kpiLabel} insight={result.spinxInsights.dailyAttribution} />
            <BOKpiContributionChart data={result.kpiContribution} insight={result.spinxInsights.kpiContribution} />
          </div>

          {/* 완료 정보 */}
          <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', textAlign: 'right' }}>
            {result.creator}({maskEmail(result.creatorId)}) · 완료 {result.completedAt}
          </div>
        </div>
      </div>

      {/* SpinX */}
      <SpinXButton isDarkMode={isDarkMode} onClick={() => setSpinXOpen(true)} isOpen={spinXOpen} />
      <SpinXPanel
        isOpen={spinXOpen}
        onClose={() => setSpinXOpen(false)}
        isDarkMode={isDarkMode}
        scenarioName={result.name}
      />
    </AppLayout>
  )
}
