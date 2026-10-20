import { useState, useMemo } from 'react'
import { X, Lock, Unlock, ChevronDown, ChevronRight, ListPlus } from 'lucide-react'
import { BOFormData, BOProductEntry } from './BOCreateScenario'
import { numberToKorean } from '../scenario/utils'
import { BOMediaDialog } from './BOMediaDialog'

interface BOStep2Props {
  formData: BOFormData
  setFormData: (data: BOFormData) => void
  validationActive: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// 순수 함수: 예산 배분 상태 판정 (TDD 대상, 모듈 스코프 export)
//
// 두 개념을 분리한다:
//  (A) 매체 몫 확정(shareConfirmed): 라벨용. 매체가 받는 '몫'이 수학적으로 하나로
//      정해지는가. 토글 비잠금이 전체 1개면 확정. 2개 이상이어도 "실질 자유 매체"가
//      1개로 좁혀지면 그 매체는 확정.
//  (B) 잔여 수령처(R6): 전역 잔여를 실제로 받을 수 있는 비잠금 상품이 있는 매체.
//      하위가 전부 잠긴 매체는 몫이 커도 초과분을 받을 상품이 없어 수령처가 아니다.
// ─────────────────────────────────────────────────────────────────────────────

export type MediaFixedInput = { mediaId: string; isFixed: boolean; fixedAmount: number }
export type ProductInput = { mediaId: string; productName: string; isFixed: boolean; fixedAmount: number }

export type AllocStatus = 'fixed' | 'auto-confirmed' | 'optimize'

export interface MediaAllocation {
  mediaId: string
  status: AllocStatus
  amount: number | null
  shareConfirmed: boolean
  share: number | null
}

export interface ProductAllocation {
  mediaId: string
  productName: string
  status: AllocStatus
  amount: number | null
}

export interface AllocationError {
  rule: 'R4' | 'R5' | 'R6'
  message: string
}

export interface AllocationResult {
  media: MediaAllocation[]
  products: ProductAllocation[]
  remainingBudget: number
  fixedTotal: number
  optimizeProductCount: number
  errors: AllocationError[]
}

export function computeAllocation(
  totalBudget: number,
  mediaFixed: MediaFixedInput[],
  products: ProductInput[]
): AllocationResult {
  // 1. 매체 그룹 구성 (입력 등장 순서 보존, 테이블은 상품 기준 렌더)
  const mediaOrder: string[] = []
  const childrenByMedia = new Map<string, ProductInput[]>()
  for (const p of products) {
    if (!childrenByMedia.has(p.mediaId)) {
      childrenByMedia.set(p.mediaId, [])
      mediaOrder.push(p.mediaId)
    }
    childrenByMedia.get(p.mediaId)!.push(p)
  }

  const mediaFixedOf = (mediaId: string) => mediaFixed.find(m => m.mediaId === mediaId)
  const isMediaLocked = (mediaId: string) => !!mediaFixedOf(mediaId)?.isFixed
  const mediaLockAmount = (mediaId: string) => mediaFixedOf(mediaId)?.fixedAmount ?? 0
  const childrenOf = (mediaId: string) => childrenByMedia.get(mediaId) ?? []
  const childLockedSumOf = (mediaId: string) =>
    childrenOf(mediaId).filter(c => c.isFixed).reduce((s, c) => s + c.fixedAmount, 0)
  const unlockedChildrenOf = (mediaId: string) => childrenOf(mediaId).filter(c => !c.isFixed)
  const allChildrenLockedOf = (mediaId: string) => {
    const ch = childrenOf(mediaId)
    return ch.length > 0 && ch.every(c => c.isFixed)
  }

  // 3. fixedTotal / remainingBudget (R4 중복 차감 방지)
  //    매체 잠금액 합 + (매체 비잠금 매체의) 하위 상품 잠금액 합
  let fixedTotal = 0
  for (const mediaId of mediaOrder) {
    if (isMediaLocked(mediaId)) {
      fixedTotal += mediaLockAmount(mediaId)
    } else {
      fixedTotal += childLockedSumOf(mediaId)
    }
  }
  // mediaFixed에만 있고 상품이 없는 잠금 매체도 합산 (방어적)
  for (const mf of mediaFixed) {
    if (mf.isFixed && !childrenByMedia.has(mf.mediaId)) {
      fixedTotal += mf.fixedAmount
    }
  }
  const remainingBudget = totalBudget - fixedTotal

  // 4. 토글 기준 비잠금 매체 (하위 잠금 여부 무관)
  const freeMediaByToggle = mediaOrder.filter(mediaId => !isMediaLocked(mediaId))
  const freeByToggleCount = freeMediaByToggle.length

  // 6. 실질 자유 매체: 토글 비잠금 중 하위 전부 잠긴 매체 제외
  const realFreeMedia = freeMediaByToggle.filter(mediaId => !allChildrenLockedOf(mediaId))
  const realFreeCount = realFreeMedia.length

  // 토글 비잠금 + 하위 전부 잠금 매체들의 childLockedSum 합 (실질 자유 매체 몫 계산용)
  const allMediaLockSum = mediaFixed.filter(m => m.isFixed).reduce((s, m) => s + m.fixedAmount, 0)
  const confirmedToggleFreeChildLockSum = freeMediaByToggle
    .filter(mediaId => allChildrenLockedOf(mediaId))
    .reduce((s, mediaId) => s + childLockedSumOf(mediaId), 0)

  // 5~6. 매체 몫 확정 판정
  const mediaShare = new Map<string, number | null>()
  const shareConfirmed = new Map<string, boolean>()
  for (const mediaId of mediaOrder) {
    if (isMediaLocked(mediaId)) {
      mediaShare.set(mediaId, mediaLockAmount(mediaId))
      shareConfirmed.set(mediaId, true)
      continue
    }
    // 토글 비잠금
    if (allChildrenLockedOf(mediaId)) {
      if (freeByToggleCount === 1) {
        // 유일한 토글-비잠금 매체: 몫 = 총예산 − 모든 매체잠금액 합 (Q1 Meta 900만)
        mediaShare.set(mediaId, totalBudget - allMediaLockSum)
      } else {
        // 하위 전부 잠김 → 몫 = 하위 잠금 합으로 확정
        mediaShare.set(mediaId, childLockedSumOf(mediaId))
      }
      shareConfirmed.set(mediaId, true)
      continue
    }
    // 토글 비잠금 + 하위에 비잠금 상품 존재 (realFree 후보)
    if (freeByToggleCount === 1) {
      mediaShare.set(mediaId, totalBudget - allMediaLockSum)
      shareConfirmed.set(mediaId, true)
    } else if (realFreeCount === 1) {
      // 유일한 실질 자유 매체: 나머지 확정분을 모두 뺀 몫 (C1 TT = 1000 − 0 − 200 = 800)
      mediaShare.set(mediaId, totalBudget - allMediaLockSum - confirmedToggleFreeChildLockSum)
      shareConfirmed.set(mediaId, true)
    } else {
      mediaShare.set(mediaId, null)
      shareConfirmed.set(mediaId, false)
    }
  }

  // 7. 상품 레벨 판정
  const productAllocs: ProductAllocation[] = []
  for (const p of products) {
    if (p.isFixed) {
      productAllocs.push({ mediaId: p.mediaId, productName: p.productName, status: 'fixed', amount: p.fixedAmount })
      continue
    }
    const confirmed = shareConfirmed.get(p.mediaId) === true
    const share = mediaShare.get(p.mediaId)
    const unlockedCount = unlockedChildrenOf(p.mediaId).length
    if (confirmed && share !== null && share !== undefined && unlockedCount === 1) {
      const amount = Math.max(0, share - childLockedSumOf(p.mediaId))
      productAllocs.push({ mediaId: p.mediaId, productName: p.productName, status: 'auto-confirmed', amount })
    } else {
      // 매체 몫 미정 or 비잠금 상품 2개 이상 → 모델이 나눔
      productAllocs.push({ mediaId: p.mediaId, productName: p.productName, status: 'optimize', amount: null })
    }
  }

  // 8. 매체 행 라벨 상태/금액 (토글 비잠금일 때만 의미, 잠금은 input 렌더)
  const mediaAllocs: MediaAllocation[] = mediaOrder.map(mediaId => {
    const confirmed = shareConfirmed.get(mediaId) === true
    const share = mediaShare.get(mediaId) ?? null
    if (isMediaLocked(mediaId)) {
      return { mediaId, status: 'fixed', amount: share, shareConfirmed: confirmed, share }
    }
    // 매체 '몫'이 확정되면, 하위 비잠금 상품 개수와 무관하게 매체 행은 자동 확정.
    // (매체 총액은 정해지고, 그 안의 상품 배분만 모델이 나눌 뿐이다.)
    if (confirmed && share !== null) {
      return { mediaId, status: 'auto-confirmed', amount: share, shareConfirmed: true, share }
    }
    return { mediaId, status: 'optimize', amount: null, shareConfirmed: confirmed, share }
  })

  // 9. 에러 수집 (순서 R4 → R5 → R6)
  const errors: AllocationError[] = []

  // R4: 전체 잠금 합 > 총예산
  if (remainingBudget < 0) {
    errors.push({ rule: 'R4', message: '잠금 예산 합계가 총 예산을 초과합니다.' })
  } else {
    // R5: 최적화 대상 상품이 배분받을 돈이 0원인 경우. 두 레벨에서 발생한다.
    let r5 = false
    // ① 매체 내부: 매체 몫이 확정됐는데 그 안 미잠금 상품에게 남는 돈 ≤ 0
    for (const mediaId of mediaOrder) {
      const confirmed = shareConfirmed.get(mediaId) === true
      const share = mediaShare.get(mediaId)
      const unlocked = unlockedChildrenOf(mediaId)
      if (confirmed && share !== null && share !== undefined && unlocked.length > 0) {
        const available = share - childLockedSumOf(mediaId)
        if (available <= 0) {
          r5 = true
          break
        }
      }
    }
    // ② 매체 간: 매체 몫이 미정인 '최적화 매체'(실질 자유 매체 2개 이상)가 있는데,
    //    그들이 나눠 가질 전역 잔여가 0 이하 → 배분할 돈이 없다.
    //    (realFreeCount === 1 은 M3로 몫이 확정돼 ①에서 판정되므로 여기선 2개 이상만.)
    if (!r5 && realFreeCount >= 2 && remainingBudget <= 0) {
      r5 = true
    }
    if (r5) {
      errors.push({
        rule: 'R5',
        message: '최적화 대상 상품의 배분 가능 예산이 0원입니다. 총 예산을 늘리거나 일부 잠금을 해제해 주세요.'
      })
    }

    // R6: 전역 잔여 > 0 인데 그 잔여를 받을 수령처(실질 자유 매체)가 없음
    if (remainingBudget > 0 && realFreeCount === 0) {
      errors.push({
        rule: 'R6',
        message: `남은 예산(${remainingBudget.toLocaleString()}원)을 배분할 대상이 없습니다. 잠금 금액을 늘리거나 일부 잠금을 해제해 주세요.`
      })
    }
  }

  const optimizeProductCount = productAllocs.filter(p => p.status === 'optimize').length

  return {
    media: mediaAllocs,
    products: productAllocs,
    remainingBudget,
    fixedTotal,
    optimizeProductCount,
    errors
  }
}

export function BOStep2({ formData, setFormData, validationActive }: BOStep2Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [expandedMedia, setExpandedMedia] = useState<Set<string>>(new Set())

  // 매체별 그룹핑
  const groupedProducts = useMemo(() => {
    const map = new Map<string, BOProductEntry[]>()
    for (const p of formData.products) {
      if (!map.has(p.mediaId)) map.set(p.mediaId, [])
      map.get(p.mediaId)!.push(p)
    }
    return map
  }, [formData.products])

  // 유효성 계산 (스펙 R1~R10)
  const totalProductCount = formData.products.length

  // R1: 매체-상품 계층 제약
  const rule1Errors = useMemo(() => {
    const errors: { mediaId: string; message: string }[] = []
    for (const mf of formData.mediaFixed) {
      if (!mf.isFixed) continue
      const children = formData.products.filter(p => p.mediaId === mf.mediaId)
      const lockedChildren = children.filter(c => c.isFixed)
      const childLockedSum = lockedChildren.reduce((sum, c) => sum + c.fixedAmount, 0)
      const hasUnlockedChild = children.some(c => !c.isFixed)

      if (childLockedSum > mf.fixedAmount) {
        errors.push({
          mediaId: mf.mediaId,
          message: `하위 상품 잠금 금액 합계(${childLockedSum.toLocaleString()}원)가 매체 잠금 금액(${mf.fixedAmount.toLocaleString()}원)을 초과합니다.`
        })
      } else if (hasUnlockedChild && childLockedSum >= mf.fixedAmount && mf.fixedAmount > 0) {
        errors.push({
          mediaId: mf.mediaId,
          message: `하위 비잠금 상품에 배분할 예산이 없습니다. 매체 잠금 금액을 늘리거나 상품 잠금을 해제해 주세요.`
        })
      } else if (!hasUnlockedChild && lockedChildren.length > 0 && childLockedSum !== mf.fixedAmount && mf.fixedAmount > 0) {
        errors.push({
          mediaId: mf.mediaId,
          message: `모든 상품이 잠금되어 있으나 합계(${childLockedSum.toLocaleString()}원)가 매체 잠금 금액(${mf.fixedAmount.toLocaleString()}원)과 다릅니다. 비잠금 상품을 추가하거나, 잠금 금액 합계를 매체 금액과 동일하게 맞춰 주세요.`
        })
      }
    }
    return errors
  }, [formData.mediaFixed, formData.products])

  // R3: 잠금 시 금액 필수
  const rule3Errors = useMemo(() => {
    const errors: { rowId: string; message: string }[] = []
    for (const mf of formData.mediaFixed) {
      if (mf.isFixed && (!mf.fixedAmount || mf.fixedAmount <= 0)) {
        errors.push({ rowId: `media-${mf.mediaId}`, message: '잠금 금액을 입력해 주세요.' })
      }
    }
    for (const p of formData.products) {
      if (p.isFixed && (!p.fixedAmount || p.fixedAmount <= 0)) {
        errors.push({ rowId: `product-${p.mediaId}-${p.productName}`, message: '잠금 금액을 입력해 주세요.' })
      }
    }
    return errors
  }, [formData.mediaFixed, formData.products])

  // R4/R5/R6 + 매체·상품별 상태/금액 — 순수 함수로 일원화 (자유도 0 → '자동 확정')
  const alloc = useMemo(
    () => computeAllocation(formData.totalBudget, formData.mediaFixed, formData.products),
    [formData.totalBudget, formData.mediaFixed, formData.products]
  )

  const remainingBudget = alloc.remainingBudget
  const fixedTotal = alloc.fixedTotal

  // 매체/상품별 배분 상태 조회 헬퍼
  const mediaAllocOf = (mediaId: string) => alloc.media.find(m => m.mediaId === mediaId)
  const productAllocOf = (mediaId: string, productName: string) =>
    alloc.products.find(p => p.mediaId === mediaId && p.productName === productName)

  const formatNumber = (num: number) => num.toLocaleString()

  // 비잠금 항목 라벨 렌더: '자동 확정 N원'(N 강조) 또는 '최적화 대상'
  const renderAllocLabel = (status: 'fixed' | 'auto-confirmed' | 'optimize', amount: number | null) => {
    if (status === 'auto-confirmed' && amount !== null) {
      return (
        <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
          자동 확정 <span className="text-[hsl(var(--foreground))] font-medium">{amount.toLocaleString()}</span>원
        </span>
      )
    }
    return <span className="text-[11px] text-[hsl(var(--muted-foreground))]">최적화 대상</span>
  }

  // 매체 토글 (테이블 내 접기/펼치기)
  const toggleMediaExpand = (mediaId: string) => {
    const next = new Set(expandedMedia)
    if (next.has(mediaId)) next.delete(mediaId)
    else next.add(mediaId)
    setExpandedMedia(next)
  }

  // 상품 고정 토글
  const toggleProductFixed = (mediaId: string, productName: string) => {
    const updated = formData.products.map(p =>
      p.mediaId === mediaId && p.productName === productName
        ? { ...p, isFixed: !p.isFixed, fixedAmount: !p.isFixed ? p.fixedAmount : 0 }
        : p
    )
    setFormData({ ...formData, products: updated })
  }

  // 고정 금액 업데이트
  const updateFixedAmount = (mediaId: string, productName: string, amount: number) => {
    const updated = formData.products.map(p =>
      p.mediaId === mediaId && p.productName === productName
        ? { ...p, fixedAmount: amount }
        : p
    )
    setFormData({ ...formData, products: updated })
  }

  // 상품 제거
  const removeProduct = (mediaId: string, productName: string) => {
    const updated = formData.products.filter(p => !(p.mediaId === mediaId && p.productName === productName))
    setFormData({ ...formData, products: updated })
  }

  // 매체 전체 제거
  const removeMedia = (mediaId: string) => {
    const updated = formData.products.filter(p => p.mediaId !== mediaId)
    const updatedMediaFixed = formData.mediaFixed.filter(m => m.mediaId !== mediaId)
    setFormData({ ...formData, products: updated, mediaFixed: updatedMediaFixed })
  }

  // 매체 레벨 고정 토글
  const toggleMediaFixed = (mediaId: string) => {
    const existing = formData.mediaFixed.find(m => m.mediaId === mediaId)
    if (existing) {
      const updated = formData.mediaFixed.map(m =>
        m.mediaId === mediaId ? { ...m, isFixed: !m.isFixed, fixedAmount: !m.isFixed ? m.fixedAmount : 0 } : m
      )
      setFormData({ ...formData, mediaFixed: updated })
    } else {
      setFormData({ ...formData, mediaFixed: [...formData.mediaFixed, { mediaId, isFixed: true, fixedAmount: 0 }] })
    }
  }

  // 매체 레벨 고정 금액 업데이트
  const updateMediaFixedAmount = (mediaId: string, amount: number) => {
    const existing = formData.mediaFixed.find(m => m.mediaId === mediaId)
    if (existing) {
      const updated = formData.mediaFixed.map(m =>
        m.mediaId === mediaId ? { ...m, fixedAmount: amount } : m
      )
      setFormData({ ...formData, mediaFixed: updated })
    } else {
      setFormData({ ...formData, mediaFixed: [...formData.mediaFixed, { mediaId, isFixed: true, fixedAmount: amount }] })
    }
  }

  // Dialog 확인
  const handleDialogConfirm = (newProducts: BOProductEntry[]) => {
    setFormData({ ...formData, products: newProducts })
    setDialogOpen(false)
    // 새로 추가된 매체 자동 펼침
    const mediaIds = new Set(newProducts.map(p => p.mediaId))
    setExpandedMedia(mediaIds)
  }

  const budgetNotSet = !formData.totalBudget || formData.totalBudget <= 0

  return (
    <div className="w-[900px]">
      <h2 className="text-xl font-semibold mb-6">상세 설정</h2>

      {/* 총 예산 입력 */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">
          총 예산 <span className="text-[hsl(var(--destructive))]">*</span>
        </label>
        <div className="relative flex items-center gap-3">
          <div className="relative w-[260px]">
            <input
              type="text"
              value={formData.totalBudget > 0 ? formatNumber(formData.totalBudget) : ''}
              onChange={(e) => {
                const digits = e.target.value.replace(/,/g, '')
                // 숫자만, 최대 11자리(999억 단위)까지 허용
                if (digits !== '' && !/^\d+$/.test(digits)) return
                if (digits.length > 11) return
                const val = parseInt(digits) || 0
                setFormData({ ...formData, totalBudget: val })
              }}
              placeholder="총 예산을 입력하세요"
              className="input w-full pr-10"
              style={{ borderColor: validationActive && !formData.totalBudget ? 'hsl(var(--destructive))' : undefined }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[hsl(var(--muted-foreground))]">원</span>
          </div>
          {formData.totalBudget > 0 && (
            <span className="text-[13px] text-[hsl(var(--muted-foreground))] whitespace-nowrap">
              = {numberToKorean(formData.totalBudget)}
            </span>
          )}
        </div>
        {validationActive && !formData.totalBudget && (
          <div className="text-[11px] text-[hsl(var(--destructive))] mt-1">총 예산을 입력해 주세요.</div>
        )}
      </div>

      {/* 매체/상품 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">
          분석 대상 매체 설정 <span className="text-[hsl(var(--destructive))]">*</span>
        </label>

        <button
          onClick={() => setDialogOpen(true)}
          disabled={budgetNotSet}
          className="btn btn-primary btn-md flex items-center gap-1.5"
          style={{ opacity: budgetNotSet ? 0.5 : 1, cursor: budgetNotSet ? 'not-allowed' : 'pointer' }}
        >
          <ListPlus size={16} />
          매체 · 상품 추가
        </button>
        {budgetNotSet && (
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">총 예산을 먼저 입력해 주세요.</div>
        )}
      </div>

      {/* Empty State */}
      {totalProductCount === 0 && (
        <div className="py-12 px-10 text-center border border-dashed border-[hsl(var(--border))] rounded-lg text-[hsl(var(--muted-foreground))] flex flex-col items-center gap-3 mb-6">
          <ListPlus size={32} style={{ opacity: 0.5 }} />
          <div>
            <div className="text-sm font-medium mb-1">
              분석할 매체와 상품을 추가해 주세요
            </div>
            <div className="text-xs opacity-80">
              '매체 · 상품 추가' 버튼을 클릭하여 시작하세요
            </div>
          </div>
        </div>
      )}

      {validationActive && totalProductCount < 2 && !budgetNotSet && (
        <div className="text-xs text-[hsl(var(--destructive))] mb-4">최소 2개 이상의 상품을 추가해 주세요.</div>
      )}

      {/* 예산 배분 테이블 */}
      {totalProductCount > 0 && (
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            예산 잠금 설정 <span className="text-xs text-[hsl(var(--muted-foreground))] font-normal">(선택)</span>
          </label>
          <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
            특정 상품에 예산을 잠금하면, 잔여 예산만 최적화 대상이 됩니다.
          </div>
          <div className="text-xs text-[hsl(var(--muted-foreground))] mb-4">
            다른 잠금으로 배분 금액이 하나로 정해지는 항목은 '자동 확정'으로 표시됩니다.
          </div>

          <div className="border border-[hsl(var(--border))] rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_80px_200px_40px] gap-3 py-2.5 px-4 bg-[hsl(var(--muted)/0.3)] border-b border-[hsl(var(--border))] text-xs font-medium text-[hsl(var(--muted-foreground))]">
              <div>매체 / 상품</div>
              <div className="text-center">잠금</div>
              <div>잠금 금액</div>
              <div></div>
            </div>

            {/* Media Groups */}
            {Array.from(groupedProducts.entries()).map(([mediaId, products]) => {
              const isExpanded = expandedMedia.has(mediaId)
              const mediaFixed = formData.mediaFixed.find(m => m.mediaId === mediaId)
              const isMediaFixed = mediaFixed?.isFixed || false

              return (
                <div key={mediaId}>
                  {/* Media Row */}
                  <div className="grid grid-cols-[1fr_80px_200px_40px] gap-3 py-2.5 px-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.15)] items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleMediaExpand(mediaId)}>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span className="text-[13px] font-semibold">{mediaId}</span>
                      <span className="text-[11px] text-[hsl(var(--muted-foreground))]">({products.length}개)</span>
                    </div>
                    <div className="text-center">
                      <button
                        onClick={() => toggleMediaFixed(mediaId)}
                        className="bg-none border-none cursor-pointer p-1"
                        style={{ color: isMediaFixed ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
                      >
                        {isMediaFixed ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>
                    </div>
                    <div>
                      {isMediaFixed ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={mediaFixed?.fixedAmount ? formatNumber(mediaFixed.fixedAmount) : ''}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/,/g, '')
                              if (digits !== '' && !/^\d+$/.test(digits)) return
                              if (digits.length > 11) return
                              updateMediaFixedAmount(mediaId, parseInt(digits) || 0)
                            }}
                            placeholder="매체 잠금 금액"
                            className="input w-full h-[30px] min-h-[30px] text-xs pr-6"
                            style={{
                              borderColor: rule3Errors.some(e => e.rowId === `media-${mediaId}`) || rule1Errors.some(e => e.mediaId === mediaId) ? 'hsl(var(--destructive))' : undefined
                            }}
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[hsl(var(--muted-foreground))]">원</span>
                        </div>
                      ) : (
                        (() => {
                          const ma = mediaAllocOf(mediaId)
                          return renderAllocLabel(ma?.status ?? 'optimize', ma?.amount ?? null)
                        })()
                      )}
                    </div>
                    <button onClick={() => removeMedia(mediaId)} className="bg-none border-none cursor-pointer p-1 flex">
                      <X size={14} className="text-[hsl(var(--muted-foreground))]" />
                    </button>
                  </div>
                  {/* R3: 매체 잠금 금액 미입력 에러 */}
                  {rule3Errors.some(e => e.rowId === `media-${mediaId}`) && (
                    <div className="pt-1 px-4 pb-2 text-[11px] text-[hsl(var(--destructive))]">
                      잠금 금액을 입력해 주세요.
                    </div>
                  )}
                  {/* R1: 매체-상품 계층 제약 에러 */}
                  {rule1Errors.filter(e => e.mediaId === mediaId).map((err, i) => (
                    <div key={`r1-${i}`} className="pt-1 px-4 pb-2 text-[11px] text-[hsl(var(--destructive))]">
                      {err.message}
                    </div>
                  ))}
                  {/* Product Rows */}
                  {isExpanded && products.map(product => (
                    <div key={`${mediaId}-${product.productName}`}>
                      <div className="grid grid-cols-[1fr_80px_200px_40px] gap-3 py-2 pr-4 pl-10 border-b border-[hsl(var(--border))] items-center">
                        <div className="text-xs text-[hsl(var(--foreground))]">{product.productName}</div>
                        <div className="text-center">
                          <button
                            onClick={() => toggleProductFixed(mediaId, product.productName)}
                            className="bg-none border-none cursor-pointer p-1"
                            style={{ color: product.isFixed ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
                          >
                            {product.isFixed ? <Lock size={14} /> : <Unlock size={14} />}
                          </button>
                        </div>
                        <div>
                          {product.isFixed ? (
                            <div className="relative">
                              <input
                                type="text"
                                value={product.fixedAmount ? formatNumber(product.fixedAmount) : ''}
                                onChange={(e) => {
                                  const digits = e.target.value.replace(/,/g, '')
                                  if (digits !== '' && !/^\d+$/.test(digits)) return
                                  if (digits.length > 11) return
                                  updateFixedAmount(mediaId, product.productName, parseInt(digits) || 0)
                                }}
                                placeholder="금액 입력"
                                className="input w-full h-[30px] min-h-[30px] text-xs pr-6"
                                style={{
                                  borderColor: rule3Errors.some(e => e.rowId === `product-${mediaId}-${product.productName}`) ? 'hsl(var(--destructive))' : undefined
                                }}
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[hsl(var(--muted-foreground))]">원</span>
                            </div>
                          ) : (
                            (() => {
                              const pa = productAllocOf(mediaId, product.productName)
                              return renderAllocLabel(pa?.status ?? 'optimize', pa?.amount ?? null)
                            })()
                          )}
                        </div>
                        <button onClick={() => removeProduct(mediaId, product.productName)} className="bg-none border-none cursor-pointer p-1 flex">
                          <X size={12} className="text-[hsl(var(--muted-foreground))]" />
                        </button>
                      </div>
                      {/* R3: 상품 잠금 금액 미입력 에러 */}
                      {rule3Errors.some(e => e.rowId === `product-${mediaId}-${product.productName}`) && (
                        <div className="pt-0.5 pr-4 pb-1.5 pl-10 text-[11px] text-[hsl(var(--destructive))]">
                          잠금 금액을 입력해 주세요.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="mt-3 py-3.5 px-4 rounded-lg bg-[hsl(var(--muted)/0.3)] flex flex-col gap-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-[hsl(var(--muted-foreground))]">총 예산</span>
              <span className="font-medium">{formatNumber(formData.totalBudget)} 원</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[hsl(var(--muted-foreground))]">잠금 예산 합계</span>
              <span className="font-medium">{formatNumber(fixedTotal)} 원</span>
            </div>
            <div className="border-t border-[hsl(var(--border))] pt-2 flex justify-between text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">
                잔여 예산 <span className="text-xs">(최적화 대상 {alloc.optimizeProductCount}개 상품)</span>
              </span>
              <span className="font-bold" style={{ color: remainingBudget < 0 ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))' }}>
                {formatNumber(remainingBudget)} 원
              </span>
            </div>
          </div>

          {/* Validation Messages (R4 → R5 → R6 순서) */}
          {alloc.errors.map((err, i) => (
            <div key={err.rule} className={`text-[11px] text-[hsl(var(--destructive))] ${i === 0 ? 'mt-2' : 'mt-1'}`}>
              {err.message}
            </div>
          ))}
        </div>
      )}

      {/* 매체/상품 선택 Dialog */}
      <BOMediaDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDialogConfirm}
        currentProducts={formData.products}
      />
    </div>
  )
}
