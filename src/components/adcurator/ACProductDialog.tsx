import { useEffect, useMemo, useRef } from 'react'
import { ACProductName } from './ACProductName'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { ExternalLink } from 'lucide-react'
import type { ACAttributeKey, ACCurationResult, ACProductAttributes, ACResultItem } from './resultTypes'
import { AC_ATTRIBUTE_ROWS } from './resultTypes'
import { overlapDays, pickPromotion } from './resultUtils'

interface ACProductDialogProps {
  result: ACCurationResult
  item: ACResultItem
  /** promotion이면 열린 뒤 프로모션 영역으로 스크롤 */
  focus: 'top' | 'promotion'
  onClose: () => void
}

/** 속성 표시 값 (6.10.2). 값이 없으면 null → 행 숨김 */
function attributeValue(key: ACAttributeKey | 'buyBilling', a: ACProductAttributes): string | null {
  switch (key) {
    case 'buyBilling': {
      const parts = [a.buyType, a.billing].filter(Boolean)
      return parts.length ? parts.join(' · ') : null
    }
    case 'formats':
      if (!a.formats?.length) return null
      return a.formats.join(' · ') + (a.videoSpec && a.formats.includes('동영상') ? ` (${a.videoSpec})` : '')
    case 'targeting': return a.targeting?.length ? a.targeting.join(' · ') : null
    case 'recommendedTarget': return a.recommendedTarget ?? null
    case 'devices': return a.devices?.length ? a.devices.join(' · ') : null
    case 'guarantee': return a.buyType === '보장형' && a.guarantee ? a.guarantee : null
    case 'minBudgetManwon': return a.minBudgetManwon !== undefined ? `${a.minBudgetManwon.toLocaleString('ko-KR')}만 원` : null
    default: return null
  }
}

/** 상품 팝업 (화면정의서 6.10): Best Fit은 lg 2열(레이더 + 속성), Good Fit은 md 1열 */
export function ACProductDialog({ result, item, focus, onClose }: ACProductDialogProps) {
  const promoRef = useRef<HTMLDivElement>(null)
  const isBest = item.group === 'best'
  const { curation } = result
  const promotion = pickPromotion(item, curation.startDate, curation.endDate, curation.promotionIncluded)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (focus === 'promotion' && promoRef.current) promoRef.current.scrollIntoView({ block: 'start' })
  }, [focus])

  // 레이더 데이터: 이 상품 vs Best Fit 평균 (Best Fit만)
  const radarData = useMemo(() => {
    if (!isBest) return []
    const best = result.items.filter(i => i.group === 'best')
    return result.axes.map(ax => ({
      axis: ax.name,
      item: item.axisScores[ax.id] ?? 0,
      avg: best.reduce((s, i) => s + (i.axisScores[ax.id] ?? 0), 0) / best.length
    }))
  }, [isBest, result, item])

  const rows = AC_ATTRIBUTE_ROWS
    .map(r => ({ ...r, value: attributeValue(r.key, item.attributes) }))
    .filter(r => r.value !== null)
  // 매체·상품 상세: 이 상품 고유의 정보만 (캠페인 조건과 비교하지 않음). 옅은 회색 상자 안에 `항목명 | 값`
  const attributes = rows.length > 0 && (
    <div className="min-w-0">
      <div className="text-[13px] font-semibold text-[hsl(var(--foreground))] mb-2">매체·상품 상세</div>
      <div className="rounded-lg bg-[hsl(var(--muted)/0.5)] px-4 py-2">
        {rows.map(r => (
          <div key={r.key} className="grid grid-cols-[88px_minmax(0,1fr)] items-baseline gap-3 py-2 border-b border-[hsl(var(--border))] last:border-b-0 text-[13px]">
            <span className="text-[hsl(var(--muted-foreground))]">{r.label}</span>
            <span className="text-[hsl(var(--foreground))] break-words min-w-0">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className={`dialog-content ${isBest ? 'dialog-lg' : 'dialog-md'} flex flex-col overflow-hidden max-h-[85vh]`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ac-product-title"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 (고정) */}
        <div className="dialog-header">
          <span className="text-[12.5px] text-[hsl(var(--muted-foreground))]">{item.mediaName}</span>
          <h3 id="ac-product-title" className="dialog-title"><ACProductName name={item.productName} /></h3>
          {/* 설명 아래 여백: 본문(레이더·상세)과 헤더를 구분 */}
          <p className="dialog-description mb-4">{item.detail}</p>
        </div>

        {/* 본문 (스크롤) */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-6">
          {isBest ? (
            <div className="grid grid-cols-2 gap-8 items-start">
              <div className="min-w-0">
                <div className="flex items-center justify-center gap-4 text-[11.5px] text-[hsl(var(--muted-foreground))] mb-1">
                  <span className="inline-flex items-center gap-1.5">
                    <i className="inline-block w-[10px] h-[10px] rounded-[2px] bg-[hsl(var(--bo-accent)/0.55)]" />
                    이 상품
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <i className="inline-block w-[14px] border-t border-dashed border-[hsl(var(--muted-foreground))]" />
                    Best Fit 평균
                  </span>
                </div>
                <div className="h-[236px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="80%">
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        dataKey="item"
                        stroke="hsl(var(--bo-accent))"
                        fill="hsl(var(--bo-accent))"
                        fillOpacity={0.3}
                        isAnimationActive={false}
                        dot={false}
                        activeDot={false}
                      />
                      <Radar
                        dataKey="avg"
                        stroke="hsl(var(--muted-foreground))"
                        strokeDasharray="4 3"
                        fill="none"
                        isAnimationActive={false}
                        dot={false}
                        activeDot={false}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {attributes || <div />}
            </div>
          ) : (
            attributes
          )}

          {promotion && (
            <div ref={promoRef} className="mt-2 pt-7 pb-6 border-t border-[hsl(var(--border))]">
              <div className="text-[13px] font-semibold text-[hsl(var(--foreground))] mb-3">프로모션</div>
              {/* 이름 + 원문 링크 / 기간 + 이번 캠페인 적용 일수 */}
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-semibold text-[hsl(var(--foreground))]">{promotion.name}</span>
                <a href={promotion.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] text-[hsl(var(--foreground))] underline underline-offset-2 flex-shrink-0">
                  원문 보기 <ExternalLink size={12} />
                </a>
              </div>
              <div className="mt-1 text-[12.5px] text-[hsl(var(--muted-foreground))]">
                {promotion.startDate} → {promotion.endDate}
                <span className="mx-1.5">·</span>
                캠페인 기간 중 {overlapDays(promotion.startDate, promotion.endDate, curation.startDate, curation.endDate)}일 적용
              </div>
              {/* 혜택·조건·이점: 매체·상품 상세와 같은 `항목명 | 값` 행 */}
              <div className="mt-3">
                {[
                  { label: '혜택', value: promotion.benefit, strong: true },
                  { label: '조건', value: promotion.condition },
                  { label: '이점', value: promotion.advantage }
                ].map(r => (
                  <div key={r.label} className="grid grid-cols-[88px_minmax(0,1fr)] items-baseline gap-3 py-2.5 border-b border-[hsl(var(--border))] last:border-b-0 text-[13px]">
                    <span className="text-[hsl(var(--muted-foreground))]">{r.label}</span>
                    <span className={`text-[hsl(var(--foreground))] leading-[1.55] ${r.strong ? 'font-semibold' : ''}`}>{r.value}</span>
                  </div>
                ))}
              </div>
              <p className="m-0 mt-3 text-[11.5px] text-[hsl(var(--muted-foreground))]">
                생성 시점({result.generatedAt}) 기준입니다. 최신 내용은 MTS 2.0 원문에서 확인해 주세요.
              </p>
            </div>
          )}
        </div>

        {/* 푸터 (고정) */}
        <div className="dialog-footer">
          <button type="button" onClick={onClose} className="btn btn-primary btn-md">확인</button>
        </div>
      </div>
    </div>
  )
}
