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

  // 매체별 그룹 (유효성용)
  const mediaGroupsForValidation = useMemo(() => {
    const map = new Map<string, BOProductEntry[]>()
    for (const p of formData.products) {
      if (!map.has(p.mediaId)) map.set(p.mediaId, [])
      map.get(p.mediaId)!.push(p)
    }
    return map
  }, [formData.products])

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

  // R4: 배분 가능 예산 (중복 차감 방지)
  const lockedMediaIds = useMemo(() => new Set(formData.mediaFixed.filter(m => m.isFixed).map(m => m.mediaId)), [formData.mediaFixed])
  const remainingBudget = useMemo(() => {
    let lockedTotal = 0
    for (const mf of formData.mediaFixed) {
      if (mf.isFixed) lockedTotal += mf.fixedAmount
    }
    for (const p of formData.products) {
      if (p.isFixed && !lockedMediaIds.has(p.mediaId)) {
        lockedTotal += p.fixedAmount
      }
    }
    return formData.totalBudget - lockedTotal
  }, [formData.totalBudget, formData.mediaFixed, formData.products, lockedMediaIds])

  const rule4Error = remainingBudget < 0 ? '잠금 예산 합계가 총 예산을 초과합니다.' : null

  // R5: 최적화 대상은 있으나 배분할 예산이 없음 (비잠금 상품 존재 + 잔여 예산 0)
  const rule5Error = useMemo(() => {
    const hasOptimizationTarget = formData.products.some(p => !p.isFixed)
    if (hasOptimizationTarget && remainingBudget === 0) {
      return '최적화 대상 상품의 배분 가능 예산이 0원입니다. 총 예산을 늘리거나 일부 잠금을 해제해 주세요.'
    }
    return null
  }, [formData.products, remainingBudget])

  // R6: 잔여 예산 수령처 부재 (전부 잠금인데 합계가 총예산에 못 미쳐 잔여가 뜨는 경우)
  const rule6Error = useMemo(() => {
    if (remainingBudget <= 0) return null
    const hasUnlockedMedia = Array.from(mediaGroupsForValidation.keys()).some(mediaId => {
      const mf = formData.mediaFixed.find(m => m.mediaId === mediaId)
      return !mf?.isFixed
    })
    // 비잠금 항목이 없으면(전부 잠금) 잔여 예산을 배분할 대상이 없음 → 합계를 총예산과 일치시켜야 함
    if (!hasUnlockedMedia) return `모든 항목을 잠근 경우 잠금 금액 합계가 총 예산과 같아야 합니다. 남은 예산(${remainingBudget.toLocaleString()}원)만큼 잠금 금액을 늘리거나 일부 잠금을 해제해 주세요.`
    return null
  }, [remainingBudget, mediaGroupsForValidation, formData.mediaFixed])

  // 고정 합계 (Summary 표시용)
  const fixedTotal = useMemo(() => {
    let total = 0
    for (const mf of formData.mediaFixed) {
      if (mf.isFixed) total += mf.fixedAmount
    }
    for (const p of formData.products) {
      if (p.isFixed && !lockedMediaIds.has(p.mediaId)) {
        total += p.fixedAmount
      }
    }
    return total
  }, [formData.mediaFixed, formData.products, lockedMediaIds])

  const unfixedCount = formData.products.filter(p => !p.isFixed).length

  const formatNumber = (num: number) => num.toLocaleString()

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
          <div className="text-xs text-[hsl(var(--muted-foreground))] mb-4">
            특정 상품에 예산을 잠금하면, 잔여 예산만 최적화 대상이 됩니다.
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
                        <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{unfixedCount <= 1 ? '잔여 배정' : '최적화 대상'}</span>
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
                            <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{unfixedCount <= 1 ? '잔여 배정' : '최적화 대상'}</span>
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
                잔여 예산 <span className="text-xs">(최적화 대상 {unfixedCount}개 상품)</span>
              </span>
              <span className="font-bold" style={{ color: remainingBudget < 0 ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))' }}>
                {formatNumber(remainingBudget)} 원
              </span>
            </div>
          </div>

          {/* Validation Messages */}
          {rule4Error && (
            <div className="text-[11px] text-[hsl(var(--destructive))] mt-2">
              {rule4Error}
            </div>
          )}
          {rule5Error && (
            <div className="text-[11px] text-[hsl(var(--destructive))] mt-1">
              {rule5Error}
            </div>
          )}
          {rule6Error && (
            <div className="text-[11px] text-[hsl(var(--destructive))] mt-1">
              {rule6Error}
            </div>
          )}
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
