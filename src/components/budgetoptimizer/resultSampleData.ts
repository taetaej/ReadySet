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
  totalBudget: 500000000,
  period: { start: '2025-07-01', end: '2025-09-30' },
  status: 'Completed',
  completedAt: '2025-06-20 14:52:33',
  created: '2025-06-20 14:30:00',
  creator: '김미영',
  creatorId: 'kimmiyoung@mezzo.co.kr',
  allocations: [
    // Google Ads (상품 2개, 1개 잠금)
    { mediaId: 'Google Ads', mediaName: 'Google Ads', productName: '반응형 디스플레이 광고_CPM', budget: 100000000, ratio: 20, kpiValue: 41500000, impression: 41500000, click: 208000, view: 0, reach: 28.5, cpm: 2410, cpc: 481, cpv: 0, isFixed: true },
    { mediaId: 'Google Ads', mediaName: 'Google Ads', productName: '트루뷰 인스트림_CPV', budget: 50000000, ratio: 10, kpiValue: 21000000, impression: 21000000, click: 104500, view: 700000, reach: 13.8, cpm: 2381, cpc: 478, cpv: 71, isFixed: false },
    // Meta (상품 2개)
    { mediaId: 'Meta', mediaName: 'Meta', productName: '경매_인지도_노출_facebook', budget: 70000000, ratio: 14, kpiValue: 28000000, impression: 28000000, click: 154000, view: 0, reach: 21.0, cpm: 2500, cpc: 455, cpv: 0, isFixed: false },
    { mediaId: 'Meta', mediaName: 'Meta', productName: '경매_트래픽_링크 클릭수 극대화_instagram', budget: 50000000, ratio: 10, kpiValue: 20000000, impression: 20000000, click: 110000, view: 0, reach: 14.1, cpm: 2500, cpc: 455, cpv: 0, isFixed: false },
    // NAVER 성과형 DA (상품 1개)
    { mediaId: 'NAVER 성과형 DA', mediaName: 'NAVER 성과형 DA', productName: '인지도 및 트래픽_피드 영역_CPC', budget: 100000000, ratio: 20, kpiValue: 38000000, impression: 38000000, click: 228000, view: 0, reach: 28.7, cpm: 2632, cpc: 439, cpv: 0, isFixed: false },
    // TikTok (상품 1개)
    { mediaId: 'TikTok', mediaName: 'TikTok', productName: '도달_도달_TikTok_동영상', budget: 80000000, ratio: 16, kpiValue: 33600000, impression: 33600000, click: 168000, view: 1120000, reach: 24.5, cpm: 2381, cpc: 476, cpv: 71, isFixed: false },
    // kakao 모먼트 (상품 1개)
    { mediaId: 'kakao 모먼트', mediaName: 'kakao 모먼트', productName: '카카오톡비즈보드_도달_CPM', budget: 50000000, ratio: 10, kpiValue: 20000000, impression: 20000000, click: 90000, view: 0, reach: 15.2, cpm: 2500, cpc: 556, cpv: 0, isFixed: false }
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
