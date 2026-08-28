// Budget Optimizer 시나리오 결과 샘플 데이터

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
  reach: number        // 도달률 (%)
  cpm: number
  cpc: number
  cpv: number
  isFixed: boolean
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
  date: string
  [mediaName: string]: number | string
}

export interface BOKpiContributionItem {
  name: string         // 매체/상품명
  delta: number        // 예산 변동분 (원, 양수=증액 / 음수=감액)
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
  responseCurve: BOResponseCurveMedia[]
  dailyAttribution: BODailyAttributionPoint[]
  kpiContribution: BOKpiContributionItem[]
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
  reach: { label: '도달', labelEn: 'Reach', unit: '%' }
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
  period: { start: '2025-07-01', end: '2025-09-30' },
  status: 'Completed',
  completedAt: '2025-06-20 14:52:33',
  created: '2025-06-20 14:30:00',
  creator: '김미영',
  creatorId: 'kimmiyoung@mezzo.co.kr',
  allocations: [
    // Google Ads
    { mediaId: 'Google Ads', mediaName: 'Google Ads', productName: '비디오 리치 캠페인 (VRC) 2.0_CPM', budget: 7857737, ratio: 1.96, kpiValue: 6756261, impression: 6756261, click: 21181, view: 60965, reach: 6091644, cpm: 1163.03, cpc: 370.98, cpv: 128.89, isFixed: false },
    { mediaId: 'Google Ads', mediaName: 'Google Ads', productName: '비디오 뷰 캠페인(VVC 2.0)_CPV', budget: 179479061, ratio: 44.87, kpiValue: 9116048, impression: 9116048, click: 2097, view: 2413274, reach: 5295202, cpm: 19688.25, cpc: 85573.34, cpv: 74.37, isFixed: false },
    // Meta
    { mediaId: 'Meta', mediaName: 'Meta', productName: '경매_잠재 고객_앱 이벤트 수 극대화_facebook&instagram', budget: 139493637, ratio: 34.87, kpiValue: 16287147, impression: 16287147, click: 73306, view: 647642, reach: 12193179, cpm: 8564.65, cpc: 1902.89, cpv: 215.39, isFixed: false },
    // kakao 모먼트
    { mediaId: 'kakao 모먼트', mediaName: 'kakao 모먼트', productName: '디스플레이_방문_CPC', budget: 13229648, ratio: 3.31, kpiValue: 20914224, impression: 20914224, click: 310596, view: 0, reach: 9861846, cpm: 632.57, cpc: 42.59, cpv: 0, isFixed: false },
    { mediaId: 'kakao 모먼트', mediaName: 'kakao 모먼트', productName: '카카오톡비즈보드_방문_CPC', budget: 29156256, ratio: 7.29, kpiValue: 29888148, impression: 29888148, click: 61066, view: 0, reach: 16323274, cpm: 975.51, cpc: 477.46, cpv: 0, isFixed: false },
    // Targetpick
    { mediaId: 'Targetpick', mediaName: 'Targetpick', productName: 'TargetPick Video', budget: 30783661, ratio: 7.70, kpiValue: 1495452, impression: 1495452, click: 1803, view: 2350730, reach: 412835, cpm: 20584.85, cpc: 17069.27, cpv: 13.10, isFixed: false }
  ],
  responseCurve: [
    // 각 매체: a * (1 - e^(-b*x)) 포화 함수 파라미터로 정의. 차트에서 수식으로 직접 생성.
    { name: 'Google Ads', currentSpend: 187336798, maxSpend: 350000000, satA: 20500000, satB: 0.000000012 },
    { name: 'Meta', currentSpend: 139493637, maxSpend: 300000000, satA: 18500000, satB: 0.000000015 },
    { name: 'kakao 모먼트', currentSpend: 42385904, maxSpend: 100000000, satA: 60000000, satB: 0.000000035 },
    { name: 'Targetpick', currentSpend: 30783661, maxSpend: 80000000, satA: 3000000, satB: 0.000000018 }
  ] as BOResponseCurveMedia[],
  dailyAttribution: [
    { date: '07-01', 'Google Ads': 2100000, 'Meta': 1600000, 'NAVER 성과형 DA': 1300000, 'TikTok': 1100000, 'kakao 모먼트': 700000 },
    { date: '07-15', 'Google Ads': 2400000, 'Meta': 1850000, 'NAVER 성과형 DA': 1450000, 'TikTok': 1300000, 'kakao 모먼트': 780000 },
    { date: '08-01', 'Google Ads': 2600000, 'Meta': 2000000, 'NAVER 성과형 DA': 1600000, 'TikTok': 1450000, 'kakao 모먼트': 850000 },
    { date: '08-15', 'Google Ads': 2350000, 'Meta': 1900000, 'NAVER 성과형 DA': 1500000, 'TikTok': 1400000, 'kakao 모먼트': 820000 },
    { date: '09-01', 'Google Ads': 2200000, 'Meta': 1750000, 'NAVER 성과형 DA': 1400000, 'TikTok': 1250000, 'kakao 모먼트': 760000 },
    { date: '09-15', 'Google Ads': 2050000, 'Meta': 1650000, 'NAVER 성과형 DA': 1350000, 'TikTok': 1150000, 'kakao 모먼트': 720000 },
    { date: '09-30', 'Google Ads': 1900000, 'Meta': 1550000, 'NAVER 성과형 DA': 1300000, 'TikTok': 1080000, 'kakao 모먼트': 690000 }
  ],
  // 최적화 전(균등 배분 100M) 대비 변동분
  kpiContribution: [
    { name: 'Google Ads', delta: 50000000 },
    { name: 'Meta', delta: 20000000 },
    { name: 'NAVER 성과형 DA', delta: 0 },
    { name: 'TikTok', delta: -20000000 },
    { name: 'kakao 모먼트', delta: -50000000 }
  ],
  spinxInsights: {
    pie: '전체 예산 4억 중 Google Ads가 46.8%로 가장 큰 비중을 차지하며, 이는 비디오 캠페인의 높은 CPV 효율에 기인합니다. Meta(34.9%)는 도달 수 대비 효율이 우수하여 두 번째로 높은 배분을 받았습니다. kakao 모먼트와 Targetpick은 각각 10.6%, 7.7%로 보조 매체 역할을 수행합니다.',
    responseCurve: 'Google Ads의 VVC 2.0은 1.8억원 투입 시점에서 반응 곡선 기울기가 급격히 완만해지며 포화 구간에 진입합니다. 반면 Meta는 현재 배분(1.4억) 대비 추가 투입 시 노출 상승 여력이 약 20% 남아있어, 예산 증액 시 가장 먼저 고려할 매체입니다. kakao 모먼트는 저예산 구간에서 효율이 높으나 5천만원 이상에서는 한계 효율이 급감합니다.',
    dailyAttribution: '캠페인 초반 2주(7/1~7/15)에 전체 노출의 38%가 집중되며, 이후 점진적으로 감소하는 패턴을 보입니다. Google Ads는 기간 전반에 걸쳐 안정적 기여를 유지하는 반면, Meta는 초반 집중 후 중반부터 기여도가 하락합니다. 캠페인 후반(9월)에는 kakao 모먼트의 상대적 기여 비중이 증가하여 롱테일 효과를 제공합니다.',
    kpiContribution: '균등 배분(매체당 1억) 대비, 최적화 결과 Google Ads에 +8,734만원, Meta에 +3,949만원이 증액되었고, kakao 모먼트에서 -5,761만원, Targetpick에서 -6,922만원이 감액되었습니다. 이 재배분으로 전체 보장 노출이 균등 대비 약 18% 증가하며, CPM 효율은 평균 12% 개선됩니다.'
  }
}
