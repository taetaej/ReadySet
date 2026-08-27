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

export interface BOResponseCurvePoint {
  budget: number       // 투입 예산 (원)
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
  responseCurve: BOResponseCurvePoint[]
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
    { budget: 0, 'Google Ads': 0, 'Meta': 0, 'NAVER 성과형 DA': 0, 'TikTok': 0, 'kakao 모먼트': 0 },
    { budget: 50000000, 'Google Ads': 28000000, 'Meta': 24000000, 'NAVER 성과형 DA': 22000000, 'TikTok': 21000000, 'kakao 모먼트': 20000000 },
    { budget: 100000000, 'Google Ads': 48000000, 'Meta': 42000000, 'NAVER 성과형 DA': 38000000, 'TikTok': 38000000, 'kakao 모먼트': 34000000 },
    { budget: 150000000, 'Google Ads': 62500000, 'Meta': 55000000, 'NAVER 성과형 DA': 49000000, 'TikTok': 50000000, 'kakao 모먼트': 43000000 },
    { budget: 200000000, 'Google Ads': 72000000, 'Meta': 64000000, 'NAVER 성과형 DA': 56000000, 'TikTok': 58000000, 'kakao 모먼트': 49000000 },
    { budget: 250000000, 'Google Ads': 78000000, 'Meta': 70000000, 'NAVER 성과형 DA': 61000000, 'TikTok': 63000000, 'kakao 모먼트': 53000000 },
    { budget: 300000000, 'Google Ads': 82000000, 'Meta': 74000000, 'NAVER 성과형 DA': 64000000, 'TikTok': 66000000, 'kakao 모먼트': 55000000 }
  ],
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
    pie: 'Google Ads에 30%가 배분되어 가장 높은 비중을 차지하며, kakao 모먼트는 10%로 최저입니다.',
    responseCurve: 'Google Ads와 Meta는 추가 투입 시 노출 상승 여력이 있으나, kakao 모먼트는 포화 구간에 근접했습니다.',
    dailyAttribution: '캠페인 2주차(08-01 전후)에 노출 기여가 가장 집중되었습니다.',
    kpiContribution: '최적화 결과 Google Ads에 +5천만원 증액, kakao 모먼트에서 -5천만원 감액이 배분되었습니다.'
  }
}
