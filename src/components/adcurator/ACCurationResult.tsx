import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, AlertCircle, X, PieChart, ArrowRight } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { SpinXPanel } from '../spinx/SpinXPanel'
import { ActionDock, type DockAction } from '../common/ActionDock'
import type { ACCurationResult as ACCurationResultData, ACResultFilters, ACResultItem, ACResultRole } from './resultTypes'
import { AC_PICK_MAX, AC_EMPTY_FILTERS, AC_PAGE_SIZE } from './resultTypes'
import { sortPurposes } from './resultUtils'
import { ACResultHeader, ACRelaxedNotice, countRelaxedItems } from './ACResultHeader'
import { ACAppliedConditionsDialog } from './ACAppliedConditionsDialog'
import { ACBudgetOptDialog, type ACBudgetOptConfirm } from './ACBudgetOptDialog'
import { ACResultHighlights } from './ACResultHighlights'
import { ACResultFitChart } from './ACResultFitChart'
import { ACResultList } from './ACResultList'
import { ACProductDialog } from './ACProductDialog'

/** 결과 화면이 속한 Slot (목록 화면 샘플과 동일) */
const SLOT = { id: 'SLT001', title: 'CJ올리브영 2026 하반기' }

const ROLES: ACResultRole[] = ['admin', 'marketer', 'agency', 'client']

/** ActionDock 제안 질문 (9.2, 결과 상담 범위 안의 질문만) */
const SUGGESTED_QUESTIONS = [
  '매체·상품이 많이 걸러진 이유가 뭔가요?',
  'Best Fit 1위와 2위를 비교해 주세요',
  'Best Match는 왜 이 상품인가요?'
]

export type ACToast = { type: 'success' | 'error'; message: string }

interface ACCurationResultProps {
  result: ACCurationResultData
}

/**
 * 큐레이션 결과 본체 (화면정의서 2장)
 * 컬렉션(7장)과 BudgetOpt 연계(8장)는 이번 구현 범위에서 제외
 */
export function ACCurationResult({ result }: ACCurationResultProps) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()
  const [isDarkMode, setIsDarkModeState] = useState(() => getDarkMode())
  useEffect(() => { setDarkMode(isDarkMode) }, [isDarkMode])
  const handleToggleDarkMode = () => {
    const next = !isDarkMode
    setIsDarkModeState(next)
    setDarkMode(next)
  }

  // ---------- 권한 (샘플: ?role=agency 등으로 전환) ----------
  const roleParam = searchParams.get('role') as ACResultRole | null
  const role: ACResultRole = roleParam && ROLES.includes(roleParam) ? roleParam : 'admin'
  const canEdit = role === 'admin' || role === 'marketer'

  // ---------- 목록 (6장) ----------
  const [filters, setFilters] = useState<ACResultFilters>(AC_EMPTY_FILTERS)
  const [bestShown, setBestShown] = useState(AC_PAGE_SIZE)
  const [goodShown, setGoodShown] = useState(AC_PAGE_SIZE)
  const [goodOpen, setGoodOpen] = useState(false)
  /** 검색·필터 변경 시 두 구역 모두 처음 10개로 */
  const updateFilters = useCallback((next: ACResultFilters) => {
    setFilters(next)
    setBestShown(AC_PAGE_SIZE)
    setGoodShown(AC_PAGE_SIZE)
  }, [])

  const [toast, setToast] = useState<ACToast | null>(null)
  const showToast = useCallback((t: ACToast) => setToast(t), [])

  // ---------- 담기 (BudgetOpt 2.0 연계 후보, 세션 내 상태·저장 없음) ----------
  const [picked, setPicked] = useState<string[]>([])
  const pickFull = picked.length >= AC_PICK_MAX
  const handleTogglePick = useCallback((id: string) => {
    setPicked(prev => prev.includes(id)
      ? prev.filter(x => x !== id)
      : prev.length >= AC_PICK_MAX ? prev : [...prev, id])
  }, [])

  // 열 헤더의 전체 담기/빼기: 대상은 그 구역에서 검색·필터에 걸러진 전체(더 보기로 안 펼친 행 포함).
  // 담기는 상한(AC_PICK_MAX)까지만 담고, 다 못 담으면 토스트로 알림
  const handlePickMany = useCallback((ids: string[], pick: boolean) => {
    if (!pick) {
      const drop = new Set(ids)
      setPicked(prev => prev.filter(x => !drop.has(x)))
      return
    }
    const toAdd = ids.filter(id => !picked.includes(id))
    const room = Math.max(0, AC_PICK_MAX - picked.length)
    setPicked([...picked, ...toAdd.slice(0, room)])
    if (toAdd.length > room) {
      showToast({ type: 'error', message: `최대 ${AC_PICK_MAX}개까지 담을 수 있습니다. ${room}개만 담았습니다.` })
    }
  }, [picked, showToast])

  // ---------- 강조·팝업 ----------
  const [productDialog, setProductDialog] = useState<{ id: string; focus: 'top' | 'promotion' } | null>(null)

  // ---------- 헤더 (3장) ----------
  const [conditionsOpen, setConditionsOpen] = useState(false)
  const relaxedCount = countRelaxedItems(result.appliedConditions)

  // ---------- SpinX (9장) ----------
  const [spinXOpen, setSpinXOpen] = useState(false)
  const [spinXInitialInput, setSpinXInitialInput] = useState<string | undefined>(undefined)
  const [spinXInitialMessage, setSpinXInitialMessage] = useState<string | undefined>(undefined)
  /** 이어서 질문하기: 입력창에 프리필만 (자동 전송 안 함) */
  const handleAskSpinX = useCallback((prefill: string) => {
    setSpinXInitialMessage(undefined)
    setSpinXInitialInput(prefill)
    setSpinXOpen(true)
  }, [])
  /** ActionDock에서 Enter로 보낸 질문은 패널을 열며 전송 */
  const handleSendSpinX = useCallback((q: string) => {
    setSpinXInitialInput(undefined)
    setSpinXInitialMessage(q)
    setSpinXOpen(true)
  }, [])

  // ---------- 토스트 ----------
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  // ---------- 복제 (3.4.3, ActionDock 액션과 동일) ----------
  const { curation } = result
  const handleDuplicate = useCallback(() => {
    navigate('/adcurator/curation/new', {
      state: {
        prefill: {
          name: `(복제) ${curation.name}`,
          description: curation.description,
          industryMode: curation.industryMode,
          brand: curation.brand,
          industry: curation.industry,
          promotionIncluded: curation.promotionIncluded,
          purposes: sortPurposes(curation.purposes)
        }
      }
    })
  }, [navigate, curation])

  // 다음 단계: BudgetOpt 2.0 간편 생성 다이얼로그 (화면정의서 8.3). 하단 CTA와 ActionDock이 같은 다이얼로그를 엶
  const [budgetOptOpen, setBudgetOptOpen] = useState(false)
  const handleGoBudgetOpt = useCallback(() => setBudgetOptOpen(true), [])
  const pickedItems = picked.map(id => result.items.find(i => i.id === id)).filter((i): i is ACResultItem => !!i)
  // 확정: BudgetOpt 2.0 시나리오 생성으로 이동하며 입력값을 state로 넘김 (BudgetOpt 2.0 결과 → Reach Caster 간편 생성과 같은 방식)
  const handleConfirmBudgetOpt = useCallback((params: ACBudgetOptConfirm) => {
    setBudgetOptOpen(false)
    navigate('/budgetopt/scenario/new', {
      state: {
        easyCreateFromAC: {
          ...params,
          sourceId: curation.id,
          sourceName: curation.name,
          // 브랜드는 넘기지 않고 업종만 (다이얼로그와 같음). 기간은 다이얼로그에서 확정한 값(params.period)
          industry: curation.industry
        }
      }
    })
  }, [navigate, curation])
  const dockActions: DockAction[] = [
    { id: 'budget-optimize', label: '예산 최적화하기', icon: <PieChart size={16} />, onSelect: handleGoBudgetOpt, badge: picked.length }
  ]

  const dialogItem = productDialog ? result.items.find(i => i.id === productDialog.id) : undefined

  return (
    <AppLayout
      currentView="adCuratorResult"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', href: '/slotboard' },
        { label: SLOT.title, onClick: () => navigate(`/slot/${SLOT.id}`) },
        { label: 'Ad Curator', onClick: () => navigate('/adcurator') },
        { label: curation.name }
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
      {/* SpinX 패널이 열리면 본문을 패널 폭만큼 밀어 냄 (BOResult와 동일, 동적 값만 인라인) */}
      <div
        className="transition-[margin-right] duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ marginRight: spinXOpen ? '400px' : '0px' }}
      >
        <ACResultHeader
          curation={curation}
          conditions={result.appliedConditions}
          canEdit={canEdit}
          onOpenConditions={() => setConditionsOpen(true)}
          showToast={showToast}
          onDuplicate={handleDuplicate}
          onLeaveToList={() => navigate('/adcurator')}
        />

        {/* 본문 여백은 BOResult 본문과 동일 */}
        <div className="px-8 py-6 flex flex-col gap-6">
          <ACRelaxedNotice count={relaxedCount} onOpen={() => setConditionsOpen(true)} />

          {/* 상단 2분할: 좌 Curation Highlights : 우 Campaign Fit = 5 : 7
              높이 기준은 왼쪽 카드 묶음. 오른쪽은 높이 계산에서 빠지고(absolute) 그 높이 안에서 차트가 남는 높이를 다 씀 */}
          <section className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8" aria-label="결론과 근거">
            <ACResultHighlights result={result} />
            <div className="relative min-w-0">
              <div className="absolute inset-0">
                <ACResultFitChart result={result} onAsk={handleAskSpinX} />
              </div>
            </div>
          </section>

          {/* 매체·상품 목록 */}
          <section className="mt-10" aria-label="매체·상품 목록">
            <ACResultList
              result={result}
              filters={filters}
              onFiltersChange={updateFilters}
              bestShown={bestShown}
              onBestShownChange={setBestShown}
              goodShown={goodShown}
              onGoodShownChange={setGoodShown}
              goodOpen={goodOpen}
              onGoodOpenChange={setGoodOpen}
              onOpenProduct={(id, focus) => setProductDialog({ id, focus })}
              picked={picked}
              pickFull={pickFull}
              onTogglePick={handleTogglePick}
              onPickMany={handlePickMany}
            />
          </section>

          {/* BudgetOpt 2.0 연계 CTA (BOResult의 Reach Caster CTA와 같은 구성). 지금은 이동만, 프리필은 D1에서 별도 진행 */}
          {/* 위 여백은 BOResult CTA와 같은 mt-6. Good Fit List 헤더(위 구분선~제목 20px)와 아래 간격이 비슷하게 보이도록 함 */}
          <section className="mt-6 pt-8 border-t border-[hsl(var(--border))] flex flex-col items-start gap-5" aria-label="다음 단계">
            <div className="flex flex-col gap-[10px] max-w-[560px]">
              <span className="text-[18px] font-semibold font-[Paperlogy,sans-serif] text-[hsl(var(--foreground))] tracking-[-0.01em]">
                이 매체·상품들로 예산을 나눠 볼까요?
              </span>
              <span className="text-[14px] text-[hsl(var(--muted-foreground))] leading-[1.6]">
                BudgetOpt 2.0에서 매체·상품별 최적 예산 배분을 이어서 볼 수 있어요.
              </span>
            </div>
            <button
              type="button"
              onClick={handleGoBudgetOpt}
              className="group inline-flex items-center gap-2 flex-shrink-0 h-12 px-6 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] border-none rounded-[24px] cursor-pointer text-[14px] font-semibold font-[Paperlogy,sans-serif] text-[hsl(var(--primary-foreground))] transition-colors duration-200 whitespace-nowrap"
            >
              <PieChart size={16} className="shrink-0" />
              BudgetOpt 2.0으로 예산 최적화하기
              {picked.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-[hsl(var(--primary-foreground))] text-[hsl(var(--primary))] text-[12px] font-semibold tabular-nums" aria-label={`담은 매체·상품 ${picked.length}개`}>
                  {picked.length}
                </span>
              )}
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
            </button>
          </section>
        </div>
      </div>

      {budgetOptOpen && (
        <ACBudgetOptDialog
          curation={curation}
          items={pickedItems}
          onClose={() => setBudgetOptOpen(false)}
          onRemove={handleTogglePick}
          onConfirm={handleConfirmBudgetOpt}
        />
      )}

      {conditionsOpen && (
        <ACAppliedConditionsDialog
          curation={curation}
          conditions={result.appliedConditions}
          onClose={() => setConditionsOpen(false)}
        />
      )}

      {dialogItem && productDialog && (
        <ACProductDialog
          key={dialogItem.id}
          result={result}
          item={dialogItem}
          focus={productDialog.focus}
          onClose={() => setProductDialog(null)}
        />
      )}

      {/* 우하단 ActionDock: SpinX 패널이 열려 있으면 숨김 (9.2) */}
      {!spinXOpen && (
        <ActionDock
          actions={dockActions}
          spinx={{
            placeholder: 'SpinX에게 물어보세요…',
            suggestedQuestions: SUGGESTED_QUESTIONS,
            onSubmitQuestion: handleSendSpinX,
            onOpenPanel: () => setSpinXOpen(true)
          }}
          isDarkMode={isDarkMode}
        />
      )}

      <SpinXPanel
        isOpen={spinXOpen}
        onClose={() => { setSpinXOpen(false); setSpinXInitialInput(undefined); setSpinXInitialMessage(undefined) }}
        isDarkMode={isDarkMode}
        scenarioName={curation.name}
        analysisType="adCurator"
        initialMessage={spinXInitialMessage}
        initialInput={spinXInitialInput}
        mentionItems={[{ id: 'campaignFit', label: 'Campaign Fit 차트', kind: 'chart' }]}
      />

      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'toast--success' : 'toast--error'}`}>
          <div className="toast__icon">
            {toast.type === 'success'
              ? <CheckCircle size={20} className="text-[hsl(142.1_76.2%_36.3%)]" />
              : <AlertCircle size={20} className="text-[hsl(var(--destructive))]" />}
          </div>
          <div className="toast__content">
            <p className="toast__title">{toast.type === 'success' ? '성공' : '오류'}</p>
            <p className="toast__description">{toast.message}</p>
          </div>
          <button type="button" onClick={() => setToast(null)} className="toast__close"><X size={16} /></button>
        </div>
      )}
    </AppLayout>
  )
}
