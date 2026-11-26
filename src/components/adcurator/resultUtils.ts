// Ad Curator 결과 화면 순수 함수 (화면 규칙을 컴포넌트 밖에서 확인할 수 있게 분리)
import { PURPOSE_ORDER, type ACPurpose } from './types'
import type { ACResultItem, ACPromotion, ACResultFilters } from './resultTypes'

/** 막대 높이 = 축 점수 단순 합 (5.2) */
export function sumScore(item: ACResultItem): number {
  return Object.values(item.axisScores).reduce((a, b) => a + b, 0)
}

/** 차트 순서: Best Fit만, 점수 합 내림차순, 같으면 목록 순위 오름차순 (5.3, V20) */
export function sortForChart(items: ACResultItem[]): ACResultItem[] {
  return items
    .filter(i => i.group === 'best')
    .slice()
    .sort((a, b) => sumScore(b) - sumScore(a) || a.rank - b.rank)
}

/** 목록 순서: 그룹 내 종합 적합도 순위 (6.2) */
export function sortByRank(items: ACResultItem[]): ACResultItem[] {
  return items.slice().sort((a, b) => a.rank - b.rank)
}

/**
 * 축별 `상위 N%` (5.3 임시식, 15.1 Q6)
 * Best Fit 안에서 축 점수 내림차순 순위 r(동점은 같은 순위), 전체 n → ceil(r / n × 100), 1~100
 */
export function topPercent(item: ACResultItem, axisId: string, bestItems: ACResultItem[]): number {
  const score = item.axisScores[axisId] ?? 0
  const n = bestItems.length
  if (n === 0) return 100
  const r = 1 + bestItems.filter(o => (o.axisScores[axisId] ?? 0) > score).length
  return Math.min(100, Math.max(1, Math.ceil((r / n) * 100)))
}

const toDay = (ymd: string) => Math.floor(Date.parse(`${ymd}T00:00:00Z`) / 86400000)

/** 두 기간이 겹치는 일수 (양 끝 포함). 겹치지 않으면 0 */
export function overlapDays(aStart: string, aEnd: string, bStart: string, bEnd: string): number {
  const s = Math.max(toDay(aStart), toDay(bStart))
  const e = Math.min(toDay(aEnd), toDay(bEnd))
  return e >= s ? e - s + 1 : 0
}

/**
 * 표시할 프로모션 1개 (6.5, V10)
 * 캠페인 기간과 1일 이상 겹치는 것 중 겹친 날이 가장 많은 것, 같으면 시작일이 빠른 것.
 * 프로모션 미포함 큐레이션이면 항상 null.
 */
export function pickPromotion(
  item: ACResultItem,
  campaignStart: string,
  campaignEnd: string,
  promotionIncluded: boolean
): ACPromotion | null {
  if (!promotionIncluded) return null
  let best: ACPromotion | null = null
  let bestDays = 0
  for (const p of item.promotions) {
    const d = overlapDays(p.startDate, p.endDate, campaignStart, campaignEnd)
    if (d < 1) continue
    if (d > bestDays || (d === bestDays && best && p.startDate < best.startDate)) {
      best = p
      bestDays = d
    }
  }
  return best
}

/** 검색어 정규화: 앞뒤 공백 트리밍, 대소문자 무시. 공백만이면 '' (검색 미적용) */
export function normalizeSearch(q: string): string {
  return q.trim().toLowerCase()
}

/**
 * 검색·필터 (6.6, 6.7, V6, V7)
 * 검색: 매체명 + 상품명 + 상품 설명, 부분 일치. 매체 프로모션은 포함·미포함 OR, 검색과는 AND.
 */
export function filterItems(
  items: ACResultItem[],
  filters: ACResultFilters,
  hasPromotion: (item: ACResultItem) => boolean
): ACResultItem[] {
  const q = normalizeSearch(filters.search)
  return items.filter(item => {
    if (q) {
      const hay = `${item.mediaName} ${item.productName} ${item.description}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (filters.promo.length > 0 && !filters.promo.includes(hasPromotion(item) ? 'included' : 'excluded')) return false
    return true
  })
}

/** 필터 배지 숫자 = 선택한 옵션 수 */
export function filterBadgeCount(filters: ACResultFilters): number {
  return filters.promo.length
}

/** 검색 또는 필터가 하나라도 적용 중인지 */
export function isFilterActive(filters: ACResultFilters): boolean {
  return normalizeSearch(filters.search) !== '' || filterBadgeCount(filters) > 0
}

/** 목적 정렬: 선택 순서와 무관하게 인지 → 조회 → 트래픽 → 전환 */
export function sortPurposes(purposes: ACPurpose[]): ACPurpose[] {
  return PURPOSE_ORDER.filter(p => purposes.includes(p))
}

/** 순위 2자리 표기 (01~) */
export function formatRank(rank: number): string {
  return String(rank).padStart(2, '0')
}

