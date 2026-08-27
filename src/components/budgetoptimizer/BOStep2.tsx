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
          message: `하위 비잠금 상품에 배분할 예산이 없습니다. 매체 잠금 금액을 늘리거나 상품 잠금을 해제해주세요.`
        })
      } else if (!hasUnlockedChild && lockedChildren.length > 0 && childLockedSum !== mf.fixedAmount && mf.fixedAmount > 0) {
        errors.push({
          mediaId: mf.mediaId,
          message: `모든 상품이 잠금되어 있으나 합계(${childLockedSum.toLocaleString()}원)가 매체 잠금 금액(${mf.fixedAmount.toLocaleString()}원)과 다릅니다. 비잠금 상품을 추가하거나, 잠금 금액 합계를 매체 금액과 동일하게 맞춰주세요.`
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
        errors.push({ rowId: `media-${mf.mediaId}`, message: '잠금 금액을 입력해주세요.' })
      }
    }
    for (const p of formData.products) {
      if (p.isFixed && (!p.fixedAmount || p.fixedAmount <= 0)) {
        errors.push({ rowId: `product-${p.mediaId}-${p.productName}`, message: '잠금 금액을 입력해주세요.' })
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

  // R5: 실질 비잠금 행 ≥ 2 (비잠금 상품 수 — 매체 잠금 여부 무관하게 카운트)
  const unlockedVarCount = useMemo(() => {
    let count = 0
    for (const [, children] of mediaGroupsForValidation.entries()) {
      const unlockedChildren = children.filter(c => !c.isFixed)
      count += unlockedChildren.length
    }
    return count
  }, [mediaGroupsForValidation])
  const rule5Error = (totalProductCount >= 2 && unlockedVarCount < 2) ? '최적화를 위해 잠금되지 않은 항목이 2개 이상 필요합니다.' : null

  // R6: 잔여 예산 수령처 부재
  const rule6Error = useMemo(() => {
    if (remainingBudget <= 0) return null
    const hasUnlockedMedia = Array.from(mediaGroupsForValidation.keys()).some(mediaId => {
      const mf = formData.mediaFixed.find(m => m.mediaId === mediaId)
      return !mf?.isFixed
    })
    if (!hasUnlockedMedia) return '잔여 예산을 배분할 비잠금 매체가 없습니다. 매체를 추가하거나 잠금을 해제해주세요.'
    return null
  }, [remainingBudget, mediaGroupsForValidation, formData.mediaFixed])

  // R10: 매체 미잠금 + 하위 전부 잠금
  const rule10Warnings = useMemo(() => {
    const warnings: { mediaId: string; message: string }[] = []
    for (const [mediaId, children] of mediaGroupsForValidation.entries()) {
      const mf = formData.mediaFixed.find(m => m.mediaId === mediaId)
      const isMediaLocked = mf?.isFixed || false
      if (!isMediaLocked && children.length > 0 && children.every(c => c.isFixed)) {
        warnings.push({
          mediaId,
          message: `${mediaId}의 모든 상품이 잠금되어 있습니다. 매체도 잠금하거나, 일부 상품의 잠금을 해제해주세요.`
        })
      }
    }
    return warnings
  }, [mediaGroupsForValidation, formData.mediaFixed])

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
    <div style={{ width: '900px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>상세 설정</h2>

      {/* 총 예산 입력 */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          총 예산 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '260px' }}>
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
              className="input"
              style={{ width: '100%', paddingRight: '40px', borderColor: validationActive && !formData.totalBudget ? 'hsl(var(--destructive))' : undefined }}
            />
            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>원</span>
          </div>
          {formData.totalBudget > 0 && (
            <span style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>
              = {numberToKorean(formData.totalBudget)}
            </span>
          )}
        </div>
        {validationActive && !formData.totalBudget && (
          <div style={{ fontSize: '11px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>총 예산을 입력해주세요.</div>
        )}
      </div>

      {/* 매체/상품 선택 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
          분석 대상 매체 설정 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>

        <button
          onClick={() => setDialogOpen(true)}
          disabled={budgetNotSet}
          className="btn btn-primary btn-md"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: budgetNotSet ? 0.5 : 1, cursor: budgetNotSet ? 'not-allowed' : 'pointer' }}
        >
          <ListPlus size={16} />
          매체 · 상품 추가
        </button>
        {budgetNotSet && (
          <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginTop: '4px' }}>총 예산을 먼저 입력해주세요.</div>
        )}
      </div>

      {/* Empty State */}
      {totalProductCount === 0 && (
        <div style={{
          padding: '48px 40px',
          textAlign: 'center',
          border: '1px dashed hsl(var(--border))',
          borderRadius: '8px',
          color: 'hsl(var(--muted-foreground))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <ListPlus size={32} style={{ opacity: 0.5 }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              분석할 매체와 상품을 추가해주세요
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              '매체 · 상품 추가' 버튼을 클릭하여 시작하세요
            </div>
          </div>
        </div>
      )}

      {validationActive && totalProductCount < 2 && !budgetNotSet && (
        <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginBottom: '16px' }}>최소 2개 이상의 상품을 추가해주세요.</div>
      )}

      {/* 예산 배분 테이블 */}
      {totalProductCount > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            예산 잠금 설정 <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', fontWeight: '400' }}>(선택)</span>
          </label>
          <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '16px' }}>
            특정 상품에 예산을 잠금하면, 잔여 예산만 최적화 대상이 됩니다.
          </div>

          <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 200px 40px', gap: '12px', padding: '10px 16px', backgroundColor: 'hsl(var(--muted) / 0.3)', borderBottom: '1px solid hsl(var(--border))', fontSize: '12px', fontWeight: '500', color: 'hsl(var(--muted-foreground))' }}>
              <div>매체 / 상품</div>
              <div style={{ textAlign: 'center' }}>잠금</div>
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
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 80px 200px 40px', gap: '12px',
                    padding: '10px 16px', borderBottom: '1px solid hsl(var(--border))',
                    backgroundColor: 'hsl(var(--muted) / 0.15)', alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => toggleMediaExpand(mediaId)}>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>{mediaId}</span>
                      <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>({products.length}개)</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => toggleMediaFixed(mediaId)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                          color: isMediaFixed ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                        }}
                      >
                        {isMediaFixed ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>
                    </div>
                    <div>
                      {isMediaFixed ? (
                        <div style={{ position: 'relative' }}>
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
                            className="input"
                            style={{
                              width: '100%', height: '30px', minHeight: '30px', fontSize: '12px', paddingRight: '24px',
                              borderColor: rule3Errors.some(e => e.rowId === `media-${mediaId}`) || rule1Errors.some(e => e.mediaId === mediaId) ? 'hsl(var(--destructive))' : undefined
                            }}
                          />
                          <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>원</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>최적화 대상</span>
                      )}
                    </div>
                    <button onClick={() => removeMedia(mediaId)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                      <X size={14} style={{ color: 'hsl(var(--muted-foreground))' }} />
                    </button>
                  </div>
                  {/* R3: 매체 잠금 금액 미입력 에러 */}
                  {rule3Errors.some(e => e.rowId === `media-${mediaId}`) && (
                    <div style={{ padding: '4px 16px 8px', fontSize: '11px', color: 'hsl(var(--destructive))' }}>
                      잠금 금액을 입력해주세요.
                    </div>
                  )}
                  {/* R1: 매체-상품 계층 제약 에러 */}
                  {rule1Errors.filter(e => e.mediaId === mediaId).map((err, i) => (
                    <div key={`r1-${i}`} style={{ padding: '4px 16px 8px', fontSize: '11px', color: 'hsl(var(--destructive))' }}>
                      {err.message}
                    </div>
                  ))}
                  {/* R10: 매체 미잠금 + 하위 전부 잠금 에러 */}
                  {rule10Warnings.filter(w => w.mediaId === mediaId).map((warn, i) => (
                    <div key={`r10-${i}`} style={{ padding: '4px 16px 8px', fontSize: '11px', color: 'hsl(var(--destructive))' }}>
                      {warn.message}
                    </div>
                  ))}

                  {/* Product Rows */}
                  {isExpanded && products.map(product => (
                    <div key={`${mediaId}-${product.productName}`}>
                      <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 80px 200px 40px', gap: '12px',
                        padding: '8px 16px 8px 40px', borderBottom: '1px solid hsl(var(--border))', alignItems: 'center'
                      }}>
                        <div style={{ fontSize: '12px', color: 'hsl(var(--foreground))' }}>{product.productName}</div>
                        <div style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => toggleProductFixed(mediaId, product.productName)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                              color: product.isFixed ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                            }}
                          >
                            {product.isFixed ? <Lock size={14} /> : <Unlock size={14} />}
                          </button>
                        </div>
                        <div>
                          {product.isFixed ? (
                            <div style={{ position: 'relative' }}>
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
                                className="input"
                                style={{
                                  width: '100%', height: '30px', minHeight: '30px', fontSize: '12px', paddingRight: '24px',
                                  borderColor: rule3Errors.some(e => e.rowId === `product-${mediaId}-${product.productName}`) ? 'hsl(var(--destructive))' : undefined
                                }}
                              />
                              <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>원</span>
                            </div>
                          ) : (
                            <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>최적화 대상</span>
                          )}
                        </div>
                        <button onClick={() => removeProduct(mediaId, product.productName)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                          <X size={12} style={{ color: 'hsl(var(--muted-foreground))' }} />
                        </button>
                      </div>
                      {/* R3: 상품 잠금 금액 미입력 에러 */}
                      {rule3Errors.some(e => e.rowId === `product-${mediaId}-${product.productName}`) && (
                        <div style={{ padding: '2px 16px 6px 40px', fontSize: '11px', color: 'hsl(var(--destructive))' }}>
                          잠금 금액을 입력해주세요.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div style={{ marginTop: '12px', padding: '14px 16px', borderRadius: '8px', backgroundColor: 'hsl(var(--muted) / 0.3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'hsl(var(--muted-foreground))' }}>총 예산</span>
              <span style={{ fontWeight: '500' }}>{formatNumber(formData.totalBudget)} 원</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'hsl(var(--muted-foreground))' }}>잠금 예산 합계</span>
              <span style={{ fontWeight: '500' }}>{formatNumber(fixedTotal)} 원</span>
            </div>
            <div style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'hsl(var(--muted-foreground))' }}>
                잔여 예산 <span style={{ fontSize: '12px' }}>(최적화 대상 {unfixedCount}개 상품)</span>
              </span>
              <span style={{ fontWeight: '700', color: remainingBudget < 0 ? 'hsl(var(--destructive))' : 'hsl(var(--foreground))' }}>
                {formatNumber(remainingBudget)} 원
              </span>
            </div>
          </div>

          {/* Validation Messages */}
          {rule4Error && (
            <div style={{ fontSize: '11px', color: 'hsl(var(--destructive))', marginTop: '8px' }}>
              {rule4Error}
            </div>
          )}
          {rule5Error && (
            <div style={{ fontSize: '11px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>
              {rule5Error}
            </div>
          )}
          {rule6Error && (
            <div style={{ fontSize: '11px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>
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
