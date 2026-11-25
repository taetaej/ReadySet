import { useEffect, useRef, useState } from 'react'
import { Share2, Link2, FileSpreadsheet, Info, MoreVertical, Copy, ArrowRightLeft, Trash2, SearchCheck } from 'lucide-react'
import { maskEmail } from '../../utils/maskEmail'
import { AC_CONDITION_CATALOG, AC_MOVE_TARGET_SLOTS } from './sampleData'
import { PURPOSE_LABELS, type ACConditionGroup, type ACCuration } from './types'
import type { ACAppliedCondition } from './resultTypes'
import { sortPurposes } from './resultUtils'
import type { ACToast } from './ACCurationResult'

/** 그룹(속성/특성)별 항목 수: 같은 항목의 포함·제외는 1개, 완화로 제외된 항목 포함 */
export function countConditionItems(conditions: ACAppliedCondition[], group: ACConditionGroup): number {
  const groupOf = (id: string) => AC_CONDITION_CATALOG.find(d => d.id === id)?.group
  return new Set(conditions.filter(c => groupOf(c.conditionId) === group).map(c => c.conditionId)).size
}

/** 완화로 제외된 항목 수 */
export function countRelaxedItems(conditions: ACAppliedCondition[]): number {
  return new Set(conditions.filter(c => c.relaxed).map(c => c.conditionId)).size
}

/** 업종 표기: 브랜드 선택 `{브랜드} / {업종}`, 직접 선택 `{업종}` */
export function industryText(c: ACCuration): string {
  return c.industryMode === 'brand' && c.brand ? `${c.brand} / ${c.industry}` : c.industry
}

/** 업종 라벨: 브랜드를 골랐으면 `브랜드/업종`, 업종을 골랐으면 `업종` */
export function industryLabel(c: ACCuration): string {
  return c.industryMode === 'brand' && c.brand ? '브랜드/업종' : '업종'
}

/** 밖을 누르면 닫히는 팝오버 */
function useOutsideClose(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close() }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open, close])
  return ref
}

interface ACResultHeaderProps {
  curation: ACCuration
  conditions: ACAppliedCondition[]
  canEdit: boolean
  onOpenConditions: () => void
  showToast: (t: ACToast) => void
  /** 복제: 생성 화면으로 프리필과 함께 이동 (이탈 확인을 거침) */
  onDuplicate: (prefill: Record<string, unknown>) => void
  /** 이동·삭제 성공 후 큐레이션 목록으로 (결과가 이 Slot에서 사라지므로 이탈 확인 없음) */
  onLeaveToList: () => void
}

/** 결과 헤더 (화면정의서 3장): 큐레이션명 / 메타 요약 / 구분선 / Share·Info·More */
export function ACResultHeader({ curation, conditions, canEdit, onOpenConditions, showToast, onDuplicate, onLeaveToList }: ACResultHeaderProps) {
  const [exportOpen, setExportOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [moveTarget, setMoveTarget] = useState('')
  const [showMoveBlock, setShowMoveBlock] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [busy, setBusy] = useState(false)

  const exportRef = useOutsideClose(exportOpen, () => setExportOpen(false))
  const menuRef = useOutsideClose(menuOpen, () => setMenuOpen(false))

  const attributeCount = countConditionItems(conditions, 'attribute')
  const traitCount = countConditionItems(conditions, 'efficiency')

  const handleCopyLink = () => {
    setExportOpen(false)
    navigator.clipboard?.writeText(window.location.href).catch(() => {})
    showToast({ type: 'success', message: '링크가 복사되었습니다.' })
  }

  // 엑셀 컬럼 구성은 범위 제외(15.1 Q4). BOResult와 같이 메뉴만 닫음
  const handleExportExcel = () => setExportOpen(false)

  // 복제: 목록(AdCurator_CurationList_Spec 8.1)과 같은 프리필. 캠페인 기간은 비움
  const handleDuplicate = () => {
    setMenuOpen(false)
    onDuplicate({
      name: `(복제) ${curation.name}`,
      description: curation.description,
      industryMode: curation.industryMode,
      brand: curation.brand,
      industry: curation.industry,
      promotionIncluded: curation.promotionIncluded,
      purposes: sortPurposes(curation.purposes)
    })
  }

  const handleConfirmMove = async () => {
    const target = AC_MOVE_TARGET_SLOTS.find(s => s.id === moveTarget)
    if (!target) return
    // 프로모션 포함 큐레이션은 Shared Slot으로 이동 불가 (목록 8.2와 동일)
    if (target.visibility === 'Shared' && curation.promotionIncluded) {
      setShowMoveBlock(true)
      return
    }
    setBusy(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast({ type: 'success', message: '1개 큐레이션이 성공적으로 이동되었습니다.' })
      setShowMoveDialog(false)
      setMoveTarget('')
      onLeaveToList()
    } catch {
      showToast({ type: 'error', message: '큐레이션 이동에 실패했습니다. 다시 시도해주세요.' })
    } finally {
      setBusy(false)
    }
  }

  const handleConfirmDelete = async () => {
    setBusy(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowDeleteDialog(false)
      showToast({ type: 'success', message: '1개 큐레이션이 성공적으로 삭제되었습니다.' })
      // 성공 토스트 후 1.5초 뒤 목록으로 (DataShot 상세 삭제 흐름과 동일)
      setTimeout(onLeaveToList, 1500)
    } catch {
      showToast({ type: 'error', message: '큐레이션 삭제에 실패했습니다. 다시 시도해주세요.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="slot-detail-header">
        <div className="slot-detail-header__main items-center">
          {/* 좌측: 큐레이션명 (한 줄 말줄임) */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <h1 className="text-[20px] font-medium m-0 font-[Paperlogy,sans-serif] whitespace-nowrap overflow-hidden text-ellipsis min-w-0" title={curation.name}>
              {curation.name}
            </h1>
          </div>

          {/* 중앙: 메타 요약 (BudgetOpt 2.0 결과 헤더와 같은 형식: 라벨 medium + 값, `•` 구분)
              업종 → 기간 → 목적 → 속성 조건(돋보기 → 모달) → 특성 조건(있을 때만) */}
          <div className="text-muted-foreground flex items-center gap-4 text-[12px] font-[Paperlogy,sans-serif] flex-shrink-0">
            <div className="flex items-center gap-1">
              <span className="font-medium">{industryLabel(curation)}</span>
              <span>{industryText(curation)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span className="font-medium">기간</span>
              <span>{curation.startDate} → {curation.endDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span className="font-medium">목적</span>
              <span>{sortPurposes(curation.purposes).map(p => PURPOSE_LABELS[p]).join(' / ')}</span>
            </div>
            {attributeCount > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">속성 조건</span>
                  <span>{attributeCount}개</span>
                  <button
                    type="button"
                    onClick={onOpenConditions}
                    aria-label="속성 조건 보기"
                    className="inline-flex p-0 bg-transparent border-none cursor-pointer text-inherit hover:text-[hsl(var(--foreground))]"
                  >
                    <SearchCheck size={14} />
                  </button>
                </div>
              </>
            )}
            {traitCount > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">특성 조건</span>
                  <span>{traitCount}개</span>
                </div>
              </>
            )}
          </div>

          <div className="w-px h-6 bg-[hsl(var(--border))] mx-2 flex-shrink-0" />

          {/* 우측: 액션 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative" ref={exportRef}>
              <button type="button" onClick={() => setExportOpen(v => !v)} className="btn btn-ghost btn-sm p-[6px]" aria-label="공유">
                <Share2 size={16} />
              </button>
              {exportOpen && (
                <div className="absolute top-full right-0 mt-2 w-[200px] bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-lg shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1)] z-[1000] overflow-hidden">
                  {[
                    { icon: <Link2 size={16} />, label: 'Copy Link', onClick: handleCopyLink },
                    { icon: <FileSpreadsheet size={16} />, label: 'Export to Excel', onClick: handleExportExcel }
                  ].map(item => (
                    <button key={item.label} type="button" onClick={item.onClick}
                      className="w-full px-4 py-3 border-none bg-transparent hover:bg-[hsl(var(--muted))] text-left cursor-pointer text-[13px] flex items-center gap-[10px] text-[hsl(var(--popover-foreground))]">
                      {item.icon}<span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setInfoOpen(true)}
                onMouseLeave={() => setInfoOpen(false)}
                className="btn btn-ghost btn-sm p-[6px]"
                aria-label="정보"
              >
                <Info size={16} />
              </button>
              {infoOpen && (
                <div className="absolute top-full right-0 mt-2 w-[280px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-3 shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1)] z-[1000] font-[Paperlogy,sans-serif]">
                  <div className="mb-3">
                    <div className="text-muted-foreground text-[11px] mb-1">Curation ID</div>
                    <div className="text-[13px] font-medium">#{curation.id}</div>
                  </div>
                  <div className="h-px bg-[hsl(var(--border))] my-2" />
                  <div className="mb-3">
                    <div className="text-muted-foreground text-[11px] mb-1">생성일시</div>
                    <div className="text-[13px] font-medium">{curation.created}</div>
                    <div className="text-muted-foreground text-[12px]">{curation.creator} ({maskEmail(curation.creatorId)})</div>
                  </div>
                  <div className="h-px bg-[hsl(var(--border))] my-2" />
                  <div>
                    <div className="text-muted-foreground text-[11px] mb-1">완료일시</div>
                    <div className="text-[13px] font-medium">{curation.completedAt}</div>
                  </div>
                </div>
              )}
            </div>

            {canEdit && (
              <div className="relative" ref={menuRef}>
                <button type="button" onClick={() => setMenuOpen(v => !v)} className="btn btn-ghost btn-sm p-[6px]" aria-label="더보기">
                  <MoreVertical size={16} />
                </button>
                {menuOpen && (
                  <div className="dropdown absolute top-full right-0 mt-1 w-[260px] z-[1000]">
                    <button type="button" onClick={handleDuplicate} className="dropdown-item">
                      <Copy size={14} /> 복제
                    </button>
                    <button type="button" onClick={() => { setMenuOpen(false); setShowMoveDialog(true) }} className="dropdown-item">
                      <ArrowRightLeft size={14} /> 이동
                    </button>
                    <button type="button" onClick={() => { setMenuOpen(false); setShowDeleteDialog(true) }} className="dropdown-item text-[hsl(var(--destructive))]">
                      <Trash2 size={14} /> 삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 이동 다이얼로그 (목록 8.2와 동일) */}
      {showMoveDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">큐레이션 이동</h3>
              <p className="dialog-description">선택한 1개 큐레이션을 다른 Slot으로 이동합니다.</p>
            </div>
            <div className="py-4">
              <div className="mb-3">
                <label className="block text-[13px] font-semibold mb-2">이동할 Slot 선택 (광고주: CJ올리브영)</label>
                <select className="input w-full" value={moveTarget} onChange={e => setMoveTarget(e.target.value)}>
                  <option value="">Slot을 선택하세요</option>
                  {AC_MOVE_TARGET_SLOTS.map(slot => (
                    <option key={slot.id} value={slot.id}>{slot.name} ({slot.visibility})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="dialog-footer">
              <button type="button" onClick={() => { setShowMoveDialog(false); setMoveTarget('') }} className="btn btn-secondary btn-sm">취소</button>
              <button type="button" onClick={handleConfirmMove} disabled={!moveTarget || busy} className="btn btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed">이동</button>
            </div>
          </div>
        </div>
      )}

      {/* 이동 불가 안내 (Shared Slot × 프로모션 포함) */}
      {showMoveBlock && (
        <div className="dialog-overlay z-[1100]">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">이동 불가 안내</h3>
              <p className="dialog-description">
                아래 1건의 프로모션 포함 큐레이션은 Shared Slot으로 이동할 수 없습니다.
                <br />
                해당 큐레이션을 제외한 후 다시 시도해 주세요.
              </p>
            </div>
            <div className="custom-scrollbar px-6 pb-4 max-h-40 overflow-y-auto">
              <div className="border border-[hsl(var(--border))] rounded-lg overflow-hidden">
                <table className="data-table w-full text-[13px]">
                  <thead><tr><th>ID</th><th>큐레이션명</th></tr></thead>
                  <tbody><tr><td className="font-mono text-xs">{curation.id}</td><td>{curation.name}</td></tr></tbody>
                </table>
              </div>
            </div>
            <div className="dialog-footer">
              <button type="button" onClick={() => setShowMoveBlock(false)} className="btn btn-primary btn-sm">확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 (목록 8.3과 동일 문구, N=1) */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">큐레이션을 삭제하시겠습니까?</h3>
              <p className="dialog-description">선택한 1개 큐레이션을 삭제하면 복원할 수 없습니다. 정말로 삭제하시겠습니까?</p>
            </div>
            <div className="dialog-footer">
              <button type="button" onClick={() => setShowDeleteDialog(false)} className="btn btn-secondary btn-sm">취소</button>
              <button type="button" onClick={handleConfirmDelete} disabled={busy} className="btn btn-sm border-none bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] disabled:opacity-50">삭제</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** 조건 완화 안내 줄 (3.3): 완화가 있을 때만 헤더 아래 본문 최상단 */
export function ACRelaxedNotice({ count, onOpen }: { count: number; onOpen: () => void }) {
  if (count <= 0) return null
  return (
    <div className="flex items-center gap-2 text-[12.5px] text-[hsl(var(--muted-foreground))]">
      <Info size={14} className="flex-shrink-0" />
      {/* 속성 조건 모달의 완화 알림과 같은 말로 맞춤 */}
      <span>모든 조건을 충족하는 매체·상품이 없어 조건 {count}개를 제외하고 선별했습니다.</span>
      <button type="button" onClick={onOpen} className="p-0 bg-transparent border-none cursor-pointer text-[hsl(var(--foreground))] underline underline-offset-2 text-[12.5px]">
        제외한 조건 보기
      </button>
    </div>
  )
}
