// 광고상품 추출 기준 조회 화면.
// 상단: 결과 차트 2종(업종 필터 공통) → 하단: Extracted Data(기존 화면과 동일).
// 헤더는 DatasetDetail(조건 조합)과 같은 패턴이되, 광고상품 기준에 맞춰:
//  - 매체 N개 + 돋보기(MediaModal) · 조회기간 · 업종 N개 + 돋보기(IndustryModal)
//  - 조회조건 자리를 "광고상품"으로 교체(AdProductsModal 재사용) · 지표 N개 + 돋보기(MetricsModal)
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Link2, FileSpreadsheet, Share2, MoreVertical, Info, Copy, ArrowRightLeft, Trash2, SearchCheck, X, AlertTriangle, CheckCircle } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { maskEmail } from '../../utils/maskEmail'
import { IndustryModal, MetricsModal, ProductListModal } from './DatasetDetailModals'
import { ResultCharts } from './ResultCharts'
import { ExtractedTable } from './ExtractedTable'
import { type FormData, initialFormData } from './createDatasetTypes'
import { type PeriodLike, isWithin2026H1, getBenchmarkMediaProducts, getBenchmarkIndustryList, getBenchmarkMetricGroups } from './benchmark2026H1'

// 지표 데이터(모달 + 개수 공용). 광고상품 공통 지표 성격의 샘플.
const metricsData = [
  { group: '성과', metrics: ['광고비', '노출수', '클릭수', 'CPC', 'CPM', 'CTR', 'VTR'] },
  { group: '참여', metrics: ['조회수', 'CPV', '재생률'] },
  { group: '전환', metrics: ['전환수', '전환당 비용', '전환율'] },
]

// 다매체 샘플: 매체별 선택 광고상품. (실데이터 연동 전까지 샘플)
const mediaProductsData = [
  { media: 'Google Ads', products: ['디맨드젠 이미지 광고_ROAS', '반응형 디스플레이 광고_CPC', 'YouTube 셀렉트_CPM'] },
  { media: 'Meta', products: ['경매_판매_전환값 극대화_instagram', '경매_트래픽_링크 클릭수 극대화_facebook&instagram'] },
  { media: 'TikTok', products: ['판매_전환_TikTok_동영상', '트래픽_클릭_TikTok_동영상'] },
]

// 업종 샘플 (대분류만 — 광고상품 기준)
const industriesSample = ['패션', '식품', '금융보험및증권', '가정용전기전자', '화장품및보건']

export function DatasetResult() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()

  // 목록 클릭 시 넘어온 데이터셋 (광고상품 기준)
  const datasetData = location.state?.datasetData
  const slotData = location.state?.slotData

  // 헤더 메뉴/모달/다이얼로그 상태
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false)
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDuplicateBlockDialog, setShowDuplicateBlockDialog] = useState(false)
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [moveTargetSlot, setMoveTargetSlot] = useState('')
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [industryModalOpen, setIndustryModalOpen] = useState(false)
  const [adProductsModalOpen, setAdProductsModalOpen] = useState(false)
  const [metricsModalOpen, setMetricsModalOpen] = useState(false)

  const datasetName = datasetData?.name || '다매체 통합 데이터'
  const periodValue = datasetData?.startDate ? `${datasetData.startDate} → ${datasetData.endDate}` : '—'

  // 생성 플로우에서 넘어온 조회기간(2026 1~6월 범위면 차트·테이블이 실데이터로).
  // 우선순위: location.state.period(생성 완료 시 전달) → datasetData.startDate/endDate 파싱.
  const resultPeriod: PeriodLike | undefined = (() => {
    const p = location.state?.period as PeriodLike | undefined
    if (p?.startYear) return p
    const [sy = '', sm = ''] = (datasetData?.startDate || '').split('-')
    const [ey = '', em = ''] = (datasetData?.endDate || '').split('-')
    if (!sy) return undefined
    return { startYear: sy, startMonth: sm, endYear: ey, endMonth: em }
  })()

  // 조회기간이 2026 1~6월 범위면 헤더 요약(매체·광고상품·업종)도 아래 차트와 동일한 실데이터로.
  // 범위 밖이면 기존 샘플(mediaProductsData/industriesSample) 유지.
  const useBenchmark = isWithin2026H1(resultPeriod)
  const headerMediaProducts = useBenchmark ? getBenchmarkMediaProducts() : mediaProductsData
  const headerIndustries = useBenchmark ? getBenchmarkIndustryList() : industriesSample
  const headerMetrics = useBenchmark ? getBenchmarkMetricGroups() : metricsData

  // 요약 개수 — 범위 내(실데이터)면 차트 데이터 기준, 아니면 목록행(datasetData)/샘플 기준
  const mediaCount = useBenchmark ? headerMediaProducts.length : (datasetData?.mediaCount ?? mediaProductsData.length)
  const industryValue = useBenchmark
    ? `${headerIndustries.length}개`
    : datasetData?.industryCount ? `${datasetData.industryCount}개` : `${industriesSample.length}개`
  const productCount = headerMediaProducts.reduce((s, m) => s + m.products.length, 0)
  const totalMetricsCount = headerMetrics.reduce((s, g) => s + g.metrics.length, 0)

  const handleToggleDarkMode = () => {
    const next = !isDarkMode
    setIsDarkMode(next)
    setDarkModeUtil(next)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setExportMenuOpen(false)
    setShowToast({ type: 'success', message: '현재 URL이 복사되었습니다.' })
  }

  const handleExportExcel = () => {
    // 광고상품 기준은 Excel로 다운로드
    console.log('Excel 다운로드')
    setExportMenuOpen(false)
  }

  // 복제: 생성 화면으로 이동 + 현재 데이터셋 옵션을 그대로 프리필(이름 앞 "(복사)")
  const handleDuplicate = () => {
    setContextMenuOpen(false)
    // id 10: 종합 지표 데이터셋 → Shared Slot에서 복제 불가
    if (datasetData?.id === 10) {
      setShowDuplicateBlockDialog(true)
      return
    }
    const [sy = '', sm = ''] = (datasetData?.startDate || '').split('-')
    const [ey = '', em = ''] = (datasetData?.endDate || '').split('-')
    const prefillForm: FormData = {
      ...initialFormData,
      datasetName: `(복사) ${datasetName}`,
      description: datasetData?.description || '',
      // 지표 구성: internal(종합) / external(성과). 미지정 시 external(기존 데이터 하위 호환)
      purpose: datasetData?.purpose === 'internal' ? 'internal' : 'external',
      extractMode: 'product',
      mediaProducts: headerMediaProducts.reduce((acc, m) => { acc[m.media] = m.products; return acc }, {} as Record<string, string[]>),
      productMetrics: headerMetrics.flatMap(g => g.metrics),
      industries: headerIndustries,
      industryLevel: 'major',
      period: { startYear: sy, startMonth: sm, endYear: ey, endMonth: em },
      periodType: datasetData?.periodType === 'quarter' ? 'quarter' : 'month',
    }
    navigate('/datashot/new', { state: { prefillForm, slotData } })
  }

  // 토스트 자동 닫기
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  return (
    <AppLayout
      currentView="datasetDetail"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', href: '/slotboard' },
        { label: slotData?.title || '삼성 갤럭시 S24 캠페인' },
        { label: 'DataShot', href: '/datashot' },
        { label: datasetName },
      ]}
      isDarkMode={isDarkMode}
      onToggleDarkMode={handleToggleDarkMode}
      sidebarProps={{
        isCollapsed: isSidebarCollapsed,
        expandedFolders,
        onToggleSidebar: toggleSidebar,
        onToggleFolder: toggleFolder,
        onNavigateToWorkspace: () => navigate('/slotboard'),
      }}
    >
      {/* Header */}
      <div className="slot-detail-header">
        <div className="slot-detail-header__main" style={{ alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '20px', fontWeight: '500', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {datasetName}
            </h1>
          </div>

          {/* 요약 행 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', flexShrink: 0 }} className="text-muted-foreground">
            <SummaryItem label="매체 · 광고상품" value={`${mediaCount}개 · ${productCount}개`} onSearch={() => setAdProductsModalOpen(true)} />
            <span>•</span>
            <SummaryItem label="조회기간" value={periodValue} />
            <span>•</span>
            <SummaryItem label="업종" value={industryValue} onSearch={() => setIndustryModalOpen(true)} />
            <span>•</span>
            <SummaryItem label="지표" value={`${totalMetricsCount}개`} onSearch={() => setMetricsModalOpen(true)} />
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'hsl(var(--border))', margin: '0 8px', flexShrink: 0 }} />

          {/* 액션 버튼 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* 공유 */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setExportMenuOpen(!exportMenuOpen)} className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
                <Share2 size={16} />
              </button>
              {exportMenuOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '180px',
                  backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', zIndex: 1000,
                  fontFamily: 'Paperlogy, sans-serif', overflow: 'hidden',
                }}>
                  <MenuRow onClick={handleCopyLink} icon={<Link2 size={16} />} label="Copy Link" />
                  <MenuRow onClick={handleExportExcel} icon={<FileSpreadsheet size={16} />} label="Export to Excel" />
                </div>
              )}
            </div>

            {/* 정보 */}
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
                  backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', zIndex: 1000, fontFamily: 'Paperlogy, sans-serif',
                }}>
                  <InfoBlock label="설명" value={datasetData?.description || '선택한 조건으로 추출된 광고 성과 데이터입니다.'} />
                  <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '8px 0' }} />
                  <InfoBlock label="Dataset ID" value={`#${datasetData?.id || '1'}`} />
                  <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '8px 0' }} />
                  <div>
                    <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>생성일시</div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{datasetData?.created || '2024-04-01 09:00'}</div>
                    <div className="text-muted-foreground" style={{ fontSize: '12px' }}>
                      {datasetData?.creator || '박지훈'} ({maskEmail(datasetData?.creatorId || 'parkjihun@naver.com')})
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 더보기 */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setContextMenuOpen(!contextMenuOpen)} className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
                <MoreVertical size={16} />
              </button>
              {contextMenuOpen && (
                <div className="dropdown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', width: '120px', zIndex: 1000 }}>
                  <button onClick={handleDuplicate} className="dropdown-item">
                    <Copy size={14} />
                    복제
                  </button>
                  <button
                    onClick={() => { setContextMenuOpen(false); setMoveTargetSlot(''); setShowMoveDialog(true) }}
                    className="dropdown-item"
                  >
                    <ArrowRightLeft size={14} />
                    이동
                  </button>
                  <button onClick={() => { setContextMenuOpen(false); setShowDeleteDialog(true) }} className="dropdown-item">
                    <Trash2 size={14} />
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="workspace-content" style={{ maxWidth: '100%', overflow: 'hidden' }}>
        {/* 상단: 결과 차트 2종 */}
        <ResultCharts period={resultPeriod} forceInsufficient={datasetData?.chartInsufficient} edgeDemo={datasetData?.chartEdgeDemo} />

        {/* 하단: Extracted Data 테이블 */}
        <ExtractedTable period={resultPeriod} />
      </div>

      {/* 상세 모달 (돋보기) */}
      <IndustryModal isOpen={industryModalOpen} onClose={() => setIndustryModalOpen(false)} industries={headerIndustries} />
      <ProductListModal isOpen={adProductsModalOpen} onClose={() => setAdProductsModalOpen(false)} mediaProducts={headerMediaProducts} />
      <MetricsModal isOpen={metricsModalOpen} onClose={() => setMetricsModalOpen(false)} metricGroups={headerMetrics} />

      {/* 삭제 확인 다이얼로그 */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">데이터셋을 삭제하시겠습니까?</h3>
              <p className="dialog-description">
                "{datasetName}"{josa(datasetName)} 삭제하면 복원할 수 없습니다. 정말로 삭제하시겠습니까?
              </p>
            </div>
            <div className="dialog-footer">
              <button onClick={() => setShowDeleteDialog(false)} className="btn btn-secondary btn-sm">취소</button>
              <button
                onClick={async () => {
                  try {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    setShowDeleteDialog(false)
                    setShowToast({ type: 'success', message: '데이터셋이 성공적으로 삭제되었습니다.' })
                    setTimeout(() => navigate('/datashot'), 1500)
                  } catch {
                    setShowToast({ type: 'error', message: '데이터셋 삭제에 실패했습니다. 다시 시도해주세요.' })
                  } finally {
                    setShowDeleteDialog(false)
                  }
                }}
                className="btn btn-sm"
                style={{ backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 복제 불가 안내 다이얼로그 */}
      {showDuplicateBlockDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">복제 불가 안내</h3>
              <p className="dialog-description">Shared Slot에서는 종합 지표 데이터셋을 복제할 수 없습니다.</p>
            </div>
            <div style={{ padding: '0 24px 24px' }}>
              <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                종합 지표 데이터셋 복제를 원하실 경우,<br />
                Private 또는 Internal Slot으로 이동시킨 후 다시 시도해 주세요.
              </p>
            </div>
            <div className="dialog-footer">
              <button onClick={() => setShowDuplicateBlockDialog(false)} className="btn btn-primary btn-sm">확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 이동 다이얼로그 */}
      {showMoveDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">데이터셋 이동</h3>
              <p className="dialog-description">선택한 1개 데이터셋을 다른 Slot으로 이동합니다.</p>
            </div>
            <div style={{ padding: '16px 0' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                  이동할 Slot 선택 (광고주: {slotData?.advertiser || '삼성전자'})
                </label>
                <select
                  className="input"
                  style={{ width: '100%' }}
                  value={moveTargetSlot}
                  onChange={(e) => setMoveTargetSlot(e.target.value)}
                >
                  <option value="">Slot을 선택하세요</option>
                  <option value="slot-1">삼성 갤럭시 S24 캠페인</option>
                  <option value="slot-2">삼성 갤럭시 Z Fold 캠페인</option>
                  <option value="slot-3">삼성 QLED TV 프로모션</option>
                </select>
              </div>
            </div>
            <div className="dialog-footer">
              <button onClick={() => setShowMoveDialog(false)} className="btn btn-secondary btn-sm">취소</button>
              <button
                onClick={() => {
                  setShowMoveDialog(false)
                  setShowToast({ type: 'success', message: '데이터셋이 이동되었습니다.' })
                }}
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

      {/* 토스트 */}
      {showToast && (
        <div className={`toast ${showToast.type === 'success' ? 'toast--success' : 'toast--error'}`}>
          <div className="toast__icon">
            {showToast.type === 'success'
              ? <CheckCircle size={20} style={{ color: 'hsl(142.1 76.2% 36.3%)' }} />
              : <AlertTriangle size={20} style={{ color: '#ef4444' }} />}
          </div>
          <div className="toast__content">
            <p className="toast__title">{showToast.type === 'success' ? '성공' : '오류'}</p>
            <p className="toast__description">{showToast.message}</p>
          </div>
          <button onClick={() => setShowToast(null)} className="toast__close"><X size={16} /></button>
        </div>
      )}
    </AppLayout>
  )
}

// 요약 항목 — 돋보기(onSearch)가 있으면 SearchCheck 아이콘 노출
function SummaryItem({ label, value, onSearch }: { label: string; value: string; onSearch?: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span>{label}</span>
      <span style={{ fontWeight: '500', color: 'hsl(var(--foreground))' }}>{value}</span>
      {onSearch && (
        <SearchCheck size={14} style={{ cursor: 'pointer' }} onClick={onSearch} />
      )}
    </div>
  )
}

function MenuRow({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: '12px 16px', border: 'none', backgroundColor: 'transparent', textAlign: 'left',
        cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px',
        transition: 'background-color 0.2s', color: 'hsl(var(--foreground))',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '13px', lineHeight: '1.5' }}>{value}</div>
    </div>
  )
}

// 한글 조사(을/를) — 이름 마지막 글자 받침 유무로 판단
function josa(name: string): string {
  const last = name[name.length - 1]
  const code = last?.charCodeAt(0) ?? 0
  const hasJongseong = code >= 0xAC00 && code <= 0xD7A3 && (code - 0xAC00) % 28 !== 0
  return hasJongseong ? '을' : '를'
}
