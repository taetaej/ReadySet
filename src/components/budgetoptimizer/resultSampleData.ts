// Budget Optimizer 시나리오 결과 샘플 데이터
import { dailyContributionMediaRaw } from './dailyContributionRaw'

export interface BOAllocation {
  mediaId: string
  mediaName: string
  productName: string
  budget: number       // 배분 예산 (원)
  ratio: number        // 배분 비중 (%)
  kpiValue: number     // 보장 KPI 값
  impression: number
  click: number
  view: number
  reach: number        // 도달 수 (회 단위 표기, % 아님)
  cpm: number
  cpc: number
  cpv: number
  isFixed: boolean
  // Response Curve 파라미터 (상품별)
  satA: number         // 포화 상한값
  satB: number         // 포화 속도
}

export interface BOResponseCurveMedia {
  name: string
  currentSpend: number            // 현재 배분 예산 (Current spend 마커 위치)
  maxSpend: number                // 곡선이 끝나는 X값 (이 이후는 그리지 않음)
  satA: number                    // 포화 상한값 (y = satA * (1 - e^(-satB * x)))
  satB: number                    // 포화 속도
}

// 하위 호환용 (사용하지 않으나 타입 유지)
export interface BOResponseCurvePoint {
  budget: number
  [mediaName: string]: number
}

export interface BODailyAttributionPoint {
  /** 캠페인 시작 기준 경과 주차 (0-based) */
  week: number
  /** YYYY-MM-DD 표기용 주 시작일 */
  date: string
  [mediaName: string]: number | string
}

/**
 * 주차별 기여(Weekly Contribution) 상품 레벨 시계열 생성.
 * 매체 뷰는 실측 데이터를 사용하고, 상품 뷰만 이 함수로 생성한다.
 * 매체 실데이터와 동일한 주차 축(week/date)에 맞춰 자연스러운 변동을 부여한다.
 * @param baseDates 매체 실데이터의 주차 축 (week/date)
 * @param productBase 상품별 피크 주간 기여값
 */
/** 매체 실측 raw(TSV) → 주차별 포인트 배열로 파싱 */
export function parseWeeklyMedia(raw: string): BODailyAttributionPoint[] {
  const byDate = new Map<string, BODailyAttributionPoint>()
  const order: string[] = []
  for (const line of raw.trim().split('\n')) {
    const [d, media, valueStr] = line.split('\t')
    if (!d || !media) continue
    const [y, m, day] = d.split('.').map(Number)
    const iso = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    if (!byDate.has(iso)) {
      byDate.set(iso, { week: 0, date: iso })
      order.push(iso)
    }
    byDate.get(iso)![media.trim()] = Number(valueStr.replace(/,/g, '').trim())
  }
  return order.map((iso, i) => ({ ...byDate.get(iso)!, week: i }))
}

export function generateWeeklyContribution(
  baseDates: { week: number; date: string }[],
  productBase: { name: string; peak: number; peakWeek: number }[]
): BODailyAttributionPoint[] {
  const totalWeeks = baseDates.length
  return baseDates.map(({ week, date }) => {
    const point: BODailyAttributionPoint = { week, date }
    for (const p of productBase) {
      // 피크 주차를 중심으로 완만히 오르내리는 곡선 + 약한 변동
      const dist = Math.abs(week - p.peakWeek) / totalWeeks
      const shape = Math.exp(-Math.pow(dist * 2.6, 2))          // 종형 곡선
      const wobble = 0.9 + 0.2 * Math.sin(week * 0.9 + p.peakWeek)  // 주간 변동
      point[p.name] = Math.round(p.peak * shape * wobble)
    }
    return point
  })
}

export interface BOKpiContributionItem {
  name: string         // 매체/상품명
  delta: number        // KPI 증분 기여 (양수=창출 / 음수=감소)
}

/** KPI 증분 워터폴 데이터: current(기준 총 KPI) → 채널별 증감 → optimized(최종 총 KPI) */
export interface BOKpiWaterfall {
  /** 기준 시점 총 KPI (예: 균등 배분 기준) */
  baseKpiTotal: number
  /** 최적화 후 총 KPI */
  optimizedKpiTotal: number
  /** 채널별 KPI 증감 기여 (누적 순서대로) */
  contributions: BOKpiContributionItem[]
}

export interface BOResultData {
  id: number
  name: string
  description: string
  industry: string
  industryMode: 'brand' | 'direct'
  brand?: string
  kpi: 'impression' | 'click' | 'view' | 'reach'
  totalBudget: number
  period: { start: string; end: string }
  status: 'Completed'
  completedAt: string
  created: string
  creator: string
  creatorId: string
  allocations: BOAllocation[]
  /** 총 도달(중복 제거) — 프론트 합산 불가, 모델(데이터사이언티스트)이 계산해 내려주는 값. 잠금 반영 결과 기준. Estimated Total 행 Reach 표시용 */
  totalReach?: number
  /** 순수 최적화(잠금 없음) 시 총 보장 KPI — 잠금 결과와 비교용 */
  pureOptKpiTotal?: number
  /** 순수 최적화(잠금 해제) allocations — 비교 테이블용 */
  pureAllocations?: BOAllocation[]
  /** 순수 최적화(잠금 없음) 기준 총 도달(중복 제거) — 모델이 계산해 내려주는 값 */
  pureTotalReach?: number
  responseCurve: BOResponseCurveMedia[]
  dailyAttribution: BODailyAttributionPoint[]
  /** 상품 레벨 일자별 기여 (시리즈 키 = "매체 > 상품") */
  dailyAttributionByProduct: BODailyAttributionPoint[]
  kpiWaterfall: BOKpiWaterfall
  /** 상품 레벨 KPI 증분 워터폴 (매체 > 상품) */
  kpiWaterfallByProduct: BOKpiWaterfall
  spinxInsights: {
    pie: string
    responseCurve: string
    dailyAttribution: string
    kpiContribution: string
  }
}

// KPI 라벨/단위 (label: 한글 UI 표기 / labelEn: 영문 컬럼 표기)
export const KPI_META: Record<string, { label: string; labelEn: string; unit: string }> = {
  impression: { label: '노출', labelEn: 'Impression', unit: '회' },
  click: { label: '클릭', labelEn: 'Click', unit: '회' },
  view: { label: '조회', labelEn: 'View', unit: '회' },
  reach: { label: '도달', labelEn: 'Reach', unit: '회' }
}

// 샘플: 시나리오 #1 (설화수 / 노출 KPI / 5개 매체)
export const sampleBOResult: BOResultData = {
  id: 1,
  name: '25년 3분기 디지털 예산 최적화',
  description: '3분기 디지털 매체 예산 배분 최적화 시나리오입니다.',
  industry: '화장품',
  industryMode: 'brand',
  brand: '설화수',
  kpi: 'impression',
  totalBudget: 400000000,
  // 총 도달(중복 제거): 개별 매체 reach의 단순 합이 아니라 모델이 계산해 내려주는 값
  totalReach: 38500000,
  pureTotalReach: 39200000,
  period: { start: '2026-07-01', end: '2026-09-30' },
  status: 'Completed',
  completedAt: '2025-06-20 14:52:33',
  created: '2025-06-20 14:30:00',
  creator: '김미영',
  creatorId: 'kimmiyoung@mezzo.co.kr',
  pureOptKpiTotal: 92000000,  // 잠금 없이 최적화 시 보장 KPI 합 (현재 잠금 적용: ~84M → 순수: 92M)
  // 순수 최적화(잠금 해제) 결과 allocations
  pureAllocations: [
    { mediaId: 'Google Ads', mediaName: 'Google Ads', productName: '비디오 리치 캠페인 (VRC) 2.0_CPM', budget: 12000000, ratio: 3.00, kpiValue: 8200000, impression: 8200000, click: 25000, view: 72000, reach: 7100000, cpm: 1463, cpc: 480, cpv: 167, isFixed: false, satA: 8000000, satB: 0.00000006 },
    { mediaId: 'Google Ads', mediaName: 'Google Ads', productName: '비디오 뷰 캠페인(VVC 2.0)_CPV', budget: 155000000, ratio: 38.75, kpiValue: 8900000, impression: 8900000, click: 2050, view: 2350000, reach: 5150000, cpm: 17416, cpc: 75610, cpv: 65.96, isFixed: false, satA: 12000000, satB: 0.000000008 },
    { mediaId: 'Meta', mediaName: 'Meta', productName: '경매_잠재 고객_앱 이벤트 수 극대화_facebook&instagram', budget: 148000000, ratio: 37.00, kpiValue: 16800000, impression: 16800000, click: 76000, view: 670000, reach: 12600000, cpm: 8810, cpc: 1947, cpv: 220.90, isFixed: false, satA: 18500000, satB: 0.000000015 },
    { mediaId: 'kakao 모먼트', mediaName: 'kakao 모먼트', productName: '디스플레이_방문_CPC', budget: 18000000, ratio: 4.50, kpiValue: 24500000, impression: 24500000, click: 365000, view: 0, reach: 11200000, cpm: 735, cpc: 49.32, cpv: 0, isFixed: false, satA: 25000000, satB: 0.00000005 },
    { mediaId: 'kakao 모먼트', mediaName: 'kakao 모먼트', productName: '카카오톡비즈보드_방문_CPC', budget: 42000000, ratio: 10.50, kpiValue: 32000000, impression: 32000000, click: 68000, view: 0, reach: 17800000, cpm: 1313, cpc: 617.65, cpv: 0, isFixed: false, satA: 35000000, satB: 0.00000004 },
    { mediaId: 'Targetpick', mediaName: 'Targetpick', productName: 'TargetPick Video', budget: 25000000, ratio: 6.25, kpiValue: 1400000, impression: 1400000, click: 1700, view: 2200000, reach: 390000, cpm: 17857, cpc: 14706, cpv: 11.36, isFixed: false, satA: 3000000, satB: 0.000000018 }
  ] as BOAllocation[],
  allocations: [
    // Google Ads
    { mediaId: 'Google Ads', mediaName: 'Google Ads', productName: '비디오 리치 캠페인 (VRC) 2.0_CPM', budget: 7857737, ratio: 1.96, kpiValue: 6756261, impression: 6756261, click: 21181, view: 60965, reach: 6091644, cpm: 1163.03, cpc: 370.98, cpv: 128.89, isFixed: false, satA: 8000000, satB: 0.00000006 },
    { mediaId: 'Google Ads', mediaName: 'Google Ads', productName: '비디오 뷰 캠페인(VVC 2.0)_CPV', budget: 179479061, ratio: 44.87, kpiValue: 9116048, impression: 9116048, click: 2097, view: 2413274, reach: 5295202, cpm: 19688.25, cpc: 85573.34, cpv: 74.37, isFixed: true, satA: 12000000, satB: 0.000000008 },
    // Meta
    { mediaId: 'Meta', mediaName: 'Meta', productName: '경매_잠재 고객_앱 이벤트 수 극대화_facebook&instagram', budget: 139493637, ratio: 34.87, kpiValue: 16287147, impression: 16287147, click: 73306, view: 647642, reach: 12193179, cpm: 8564.65, cpc: 1902.89, cpv: 215.39, isFixed: false, satA: 18500000, satB: 0.000000015 },
    // kakao 모먼트
    { mediaId: 'kakao 모먼트', mediaName: 'kakao 모먼트', productName: '디스플레이_방문_CPC', budget: 13229648, ratio: 3.31, kpiValue: 20914224, impression: 20914224, click: 310596, view: 0, reach: 9861846, cpm: 632.57, cpc: 42.59, cpv: 0, isFixed: false, satA: 25000000, satB: 0.00000005 },
    { mediaId: 'kakao 모먼트', mediaName: 'kakao 모먼트', productName: '카카오톡비즈보드_방문_CPC', budget: 29156256, ratio: 7.29, kpiValue: 29888148, impression: 29888148, click: 61066, view: 0, reach: 16323274, cpm: 975.51, cpc: 477.46, cpv: 0, isFixed: true, satA: 35000000, satB: 0.00000004 },
    // Targetpick
    { mediaId: 'Targetpick', mediaName: 'Targetpick', productName: 'TargetPick Video', budget: 30783661, ratio: 7.70, kpiValue: 1495452, impression: 1495452, click: 1803, view: 2350730, reach: 412835, cpm: 20584.85, cpc: 17069.27, cpv: 13.10, isFixed: false, satA: 3000000, satB: 0.000000018 }
  ],
  responseCurve: [
    // 각 매체: a * (1 - e^(-b*x)) 포화 함수 파라미터로 정의. 차트에서 수식으로 직접 생성.
    { name: 'Google Ads', currentSpend: 187336798, maxSpend: 350000000, satA: 20500000, satB: 0.000000012 },
    { name: 'Meta', currentSpend: 139493637, maxSpend: 300000000, satA: 18500000, satB: 0.000000015 },
    { name: 'kakao 모먼트', currentSpend: 42385904, maxSpend: 100000000, satA: 60000000, satB: 0.000000035 },
    { name: 'Targetpick', currentSpend: 30783661, maxSpend: 80000000, satA: 3000000, satB: 0.000000018 }
  ] as BOResponseCurveMedia[],
  // 매체 뷰: 실측 주간 데이터(Meridian incremental_outcome, 2024.7~2026.6, 104주)
  dailyAttribution: parseWeeklyMedia(dailyContributionMediaRaw),
  // 상품 뷰: 매체 실데이터의 주차 축에 맞춰 임의 생성 (시리즈 키 = "매체 > 상품")
  dailyAttributionByProduct: generateWeeklyContribution(
    parseWeeklyMedia(dailyContributionMediaRaw).map(p => ({ week: p.week, date: p.date as string })),
    [
      { name: 'Google Ads > 비디오 뷰 캠페인(VVC 2.0)_CPV', peak: 62000000, peakWeek: 90 },
      { name: 'Google Ads > 비디오 리치 캠페인 (VRC) 2.0_CPM', peak: 48000000, peakWeek: 78 },
      { name: 'kakao 모먼트 > 카카오톡비즈보드_방문_CPC', peak: 55000000, peakWeek: 95 },
      { name: 'kakao 모먼트 > 디스플레이_방문_CPC', peak: 38000000, peakWeek: 88 },
      { name: 'Meta > 경매_잠재 고객_앱 이벤트 수 극대화_facebook&instagram', peak: 14000000, peakWeek: 60 },
      { name: 'Targetpick > TargetPick Video', peak: 22000000, peakWeek: 70 }
    ]
  ),
  // KPI 증분 워터폴: 균등 배분 기준 총 노출 → 최적화 후 총 노출까지 채널별 기여 누적
  // baseKpiTotal(71.2M) + 채널 증감 합(+13.2M) = optimizedKpiTotal(84.4M)
  kpiWaterfall: {
    baseKpiTotal: 71200000,
    optimizedKpiTotal: 84400000,
    contributions: [
      { name: 'Google Ads', delta: 9800000 },
      { name: 'Meta', delta: 6300000 },
      { name: 'kakao 모먼트', delta: 4100000 },
      { name: 'Targetpick', delta: -2800000 },
      { name: 'NAVER 성과형 DA', delta: -4200000 }
    ]
  },
  // 상품 레벨 KPI 증분 워터폴 (매체 > 상품). base/optimized 총합은 매체 레벨과 동일.
  kpiWaterfallByProduct: {
    baseKpiTotal: 71200000,
    optimizedKpiTotal: 84400000,
    contributions: [
      { name: 'Meta > 경매_잠재 고객_앱 이벤트 수 극대화_facebook&instagram', delta: 6300000 },
      { name: 'Google Ads > 비디오 뷰 캠페인(VVC 2.0)_CPV', delta: 5400000 },
      { name: 'kakao 모먼트 > 카카오톡비즈보드_방문_CPC', delta: 4100000 },
      { name: 'Google Ads > 비디오 리치 캠페인 (VRC) 2.0_CPM', delta: 4400000 },
      { name: 'Targetpick > TargetPick Video', delta: -2800000 },
      { name: 'NAVER 성과형 DA > 웹사이트 전환_피드 영역_CPC', delta: -4200000 }
    ]
  },
  spinxInsights: {
    pie: '전체 예산 4억 중 Google Ads가 46.8%(약 1.87억)로 가장 큰 비중을 차지합니다. 이는 비디오 뷰 캠페인(VVC 2.0)의 CPV 효율이 높아 동일 예산 대비 노출 확보가 유리하기 때문입니다. Meta는 34.9%로, 도달 대비 효율과 앱 이벤트 전환 성과가 안정적이어서 두 번째로 높은 배분을 받았습니다. 반면 kakao 모먼트(10.6%)와 Targetpick(7.7%)은 저예산 구간에서 보조적으로 기여하며, 상위 두 매체에 예산이 집중되는 형태로 배분이 최적화되었습니다.',
    responseCurve: 'Google Ads의 VVC 2.0은 약 1.8억원 투입 지점에서 곡선 기울기가 급격히 완만해지며 효율 포화 구간에 진입합니다. 즉 이 지점을 넘어서는 추가 예산은 노출 상승 폭이 크게 둔화됩니다. 반면 Meta는 현재 배분(약 1.4억) 대비 노출 상승 여력이 약 20% 남아 있어, 추가 예산을 투입할 경우 가장 먼저 고려할 매체입니다. kakao 모먼트는 저예산 구간에서 한계 효율이 높지만 5천만원을 넘어서면 급격히 꺾이므로, 소액 배분에 적합합니다. 종합하면 Meta에 우선 증액하고 포화된 매체는 현행 유지하는 것이 효율적입니다.',
    dailyAttribution: '이 그래프는 해당 업종 모델이 학습한 과거 기간의 매체별 기여 패턴으로, 이 시나리오의 미래 예측이 아닌 업종 데이터에서 관측된 경향입니다. 전체적으로 Google Ads가 학습 기간 내내 가장 크고 안정적인 기여를 유지하며 기반 매체 역할을 합니다. kakao 모먼트는 특정 시즌 구간에서 기여가 급증하는 변동성이 큰 패턴을 보여, 성수기 집중형 매체 성격이 관측됩니다. Meta와 Targetpick은 상대적으로 낮지만 꾸준한 기여를 이어갑니다. 최근 1년 구간에서 kakao 모먼트의 기여 비중이 확대되는 추세가 나타납니다.',
    kpiContribution: '균등 배분 대비 최적화를 적용하면 총 보장 노출이 7,120만에서 8,440만으로 약 18%(+1,320만) 증가합니다. 노출 창출을 주도한 매체는 Google Ads(+980만), Meta(+630만), kakao 모먼트(+410만)로, 효율이 높은 매체에 예산이 재배분되면서 성과가 늘었습니다. 반대로 Targetpick(-280만)과 NAVER 성과형 DA(-420만)는 상대적으로 효율이 낮아 예산이 줄었습니다. 핵심은 감액으로 잃은 노출보다 증액으로 얻은 노출이 훨씬 크다는 점이며, 이 재배분이 동일 예산에서 순증 성과를 만들어낸 최적화의 효과입니다.'
  }
}

// 잠금이 없는 시나리오 목록(목록 mock의 fixedCount === 0인 완료 시나리오 id)
// 이 id로 진입하면 결과 화면은 '잠금 없는 버전'으로 렌더된다(상태 띠배너/모드 전환 없음).
const UNLOCKED_SCENARIO_IDS = new Set<number>([2, 8])

/**
 * 잠금 없는 버전 결과 데이터 생성.
 * - allocations를 pureAllocations(모두 isFixed=false)로 교체
 * - pureAllocations 제거(비교 대상 없음) → 결과 화면이 잠금/순수 전환 UI를 숨김
 */
function toUnlockedResult(base: BOResultData): BOResultData {
  const pure = (base.pureAllocations || base.allocations).map(a => ({ ...a, isFixed: false }))
  return {
    ...base,
    allocations: pure,
    pureAllocations: undefined,
    pureOptKpiTotal: undefined
  }
}

/** id로 결과 데이터 조회. 잠금 없는 시나리오면 잠금 없는 버전을 반환. */
export function getBOResult(id: number): BOResultData {
  if (UNLOCKED_SCENARIO_IDS.has(id)) {
    return toUnlockedResult({ ...sampleBOResult, id })
  }
  return { ...sampleBOResult, id }
}
