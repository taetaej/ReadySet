// DataShot 전용 벤치마크 데이터 (2026-01 ~ 2026-06)
// ──────────────────────────────────────────────────────────────────────────
// 목적: 데이터셋 생성 시 조회기간이 2026-01~06에 "완전히 포함"될 때(예: 1~3월, 1~6월),
//       상품 선택 다이얼로그 / 결과 차트 / Extracted 테이블에 실제 집행 성과 데이터를 보여준다.
//       (1~9월, 3~7월처럼 범위를 벗어나면 기존 더미 동작 유지)
//
// 범위: 이 모듈은 DataShot 전용이다. scenario 등 다른 솔루션은 참조하지 않는다.
//
// 데이터 성격: 원본(월·업종(대/중)·매체·광고상품별 노출/클릭/비용/조회)에서
//   데이터가 풍부한 대표 업종(대)을 집계한 값. 노출/클릭/비용/조회는 실데이터 기반이며,
//   그 외 파생 지표(CPM/CPC/CPV/CTR/VTR)는 이 4개로 계산한다. 데이터에 없는 지표(전환수 등)는
//   호출부에서 시드 기반 임의값으로 채운다(실데이터 영역 아님).
//
// 매체명 표기: 원본은 'kakao 모먼트'(공백), 'NAVER 성과형 DA'. DataShot 선택 UI는 'kakao모먼트'(붙임).
//   매칭은 공백 제거 정규화(normalizeMedia)로 보정한다.

export interface BenchmarkRow {
  media: string          // 원본 표기 매체명
  product: string        // 광고상품명 (mediaData.DIGITAL 포맷과 동일)
  impressions: number
  clicks: number
  cost: number           // 원
  views: number
}

// 업종(대) → 매체×상품 집계 (대표 업종만. 각 업종 상품 ≥3 → 차트 제공 조건 충족)
// 값 출처: 2026-01 원본에서 해당 업종·매체·상품의 노출/클릭/비용/조회.
export const benchmarkByIndustry: Record<string, BenchmarkRow[]> = {
  '금융,보험및증권': [
    { media: 'kakao 모먼트', product: '카카오톡비즈보드_전환_픽셀&SDK_CPC', impressions: 534843134, clicks: 1069112, cost: 462625808, views: 0 },
    { media: 'kakao 모먼트', product: '카카오톡비즈보드_방문_CPC', impressions: 623333865, clicks: 1358908, cost: 194615756, views: 0 },
    { media: 'Google Ads', product: '비디오 뷰 캠페인(VVC 2.0)_CPV', impressions: 68883602, clicks: 38456, cost: 212179269, views: 21840248 },
    { media: 'Google Ads', product: '비디오 리치 캠페인 (VRC) 2.0_CPM', impressions: 74864168, clicks: 52250, cost: 154956791, views: 5392165 },
    { media: 'Google Ads', product: '앱 설치 캠페인_CPA', impressions: 13706743, clicks: 186559, cost: 112074007, views: 859078 },
    { media: 'Meta', product: '경매_트래픽_링크 클릭수 극대화_instagram', impressions: 7076927, clicks: 83229, cost: 32636880, views: 256861 },
    { media: 'Meta', product: '경매_인지도_동영상 연속 2초 이상 재생 극대화_instagram', impressions: 5172650, clicks: 9797, cost: 10418756, views: 1086277 },
    { media: 'NAVER 성과형 DA', product: '인지도 및 트래픽_서비스 통합_CPC', impressions: 44417932, clicks: 188762, cost: 59110834, views: 0 },
    { media: 'TikTok', product: '웹사이트 전환_전환_Pangle&TikTok_동영상', impressions: 4155272, clicks: 499582, cost: 20686554, views: 3468792 },
  ],
  '컴퓨터및정보통신': [
    { media: 'Google Ads', product: '비디오 리치 캠페인 (VRC) 2.0_CPM', impressions: 77357078, clicks: 92022, cost: 152975484, views: 5945180 },
    { media: 'Google Ads', product: '비디오 뷰 캠페인(VVC 2.0)_CPV', impressions: 45895423, clicks: 84226, cost: 122028786, views: 11038704 },
    { media: 'Google Ads', product: 'CPM 마스트헤드_CPM', impressions: 23545916, clicks: 6828, cost: 62278958, views: 425353 },
    { media: 'Meta', product: '경매_인지도_일일 고유 도달 극대화_instagram', impressions: 79135574, clicks: 87131, cost: 107801478, views: 2350555 },
    { media: 'Meta', product: '경매_참여_ThruPlay 조회 극대화_instagram', impressions: 6815040, clicks: 41523, cost: 20924454, views: 3986354 },
    { media: 'NAVER 성과형 DA', product: '인지도 및 트래픽_피드 영역_CPC', impressions: 41586891, clicks: 234087, cost: 136483620, views: 0 },
    { media: 'kakao 모먼트', product: '카카오톡비즈보드_방문_CPC', impressions: 466718239, clicks: 443937, cost: 127964381, views: 0 },
    { media: 'TikTok', product: '트래픽_랜딩 페이지 조회_TikTok_동영상', impressions: 38445137, clicks: 605041, cost: 69576770, views: 38058551 },
  ],
  '화장품및보건용품': [
    { media: 'Google Ads', product: '비디오 리치 캠페인 (VRC) 2.0_CPM', impressions: 70000353, clicks: 65898, cost: 179149532, views: 5708226 },
    { media: 'Google Ads', product: '디맨드젠 동영상 광고_CPA', impressions: 15908010, clicks: 86767, cost: 67456550, views: 2108394 },
    { media: 'Google Ads', product: '디맨드젠 이미지 광고_CPC', impressions: 15122913, clicks: 271223, cost: 38988173, views: 0 },
    { media: 'Meta', product: '경매_트래픽_링크 클릭수 극대화_instagram', impressions: 12406389, clicks: 244883, cost: 53918713, views: 489066 },
    { media: 'Meta', product: '경매_판매_앱 이벤트 수 극대화_instagram', impressions: 8864336, clicks: 62794, cost: 48782215, views: 0 },
    { media: 'NAVER 성과형 DA', product: '웹사이트 전환_피드 영역_CPC', impressions: 7223123, clicks: 117349, cost: 98964500, views: 0 },
    { media: 'kakao 모먼트', product: '카카오톡비즈보드_방문_CPC', impressions: 80721476, clicks: 40167, cost: 21732468, views: 0 },
    { media: 'TikTok', product: '트래픽_클릭_TikTok_동영상', impressions: 30995902, clicks: 145010, cost: 84065891, views: 30825422 },
  ],
  '엔터테인먼트': [
    { media: 'Google Ads', product: '앱 설치 캠페인_CPA', impressions: 37138152, clicks: 736754, cost: 179657999, views: 574874 },
    { media: 'Google Ads', product: '비디오 뷰 캠페인(VVC 2.0)_CPV', impressions: 41916827, clicks: 120928, cost: 108286391, views: 14119337 },
    { media: 'Google Ads', product: '비디오 리치 캠페인 (VRC) 2.0_CPM', impressions: 22975287, clicks: 33248, cost: 74342148, views: 1246978 },
    { media: 'Meta', product: '경매_참여_ThruPlay 조회 극대화_instagram', impressions: 29102931, clicks: 101703, cost: 97169837, views: 13844418 },
    { media: 'Meta', product: '경매_트래픽_링크 클릭수 극대화_instagram', impressions: 45623738, clicks: 1142627, cost: 59424333, views: 10975892 },
    { media: 'NAVER 성과형 DA', product: '인지도 및 트래픽_스마트 채널_CPC', impressions: 73444616, clicks: 86603, cost: 43914109, views: 0 },
    { media: 'kakao 모먼트', product: '카카오톡비즈보드_방문_CPC', impressions: 85010641, clicks: 90908, cost: 25810318, views: 0 },
    { media: 'TikTok', product: '동영상 조회_6초 조회수_TikTok_동영상', impressions: 84830844, clicks: 415113, cost: 61606550, views: 83375803 },
  ],
  '수송기기': [
    { media: 'Google Ads', product: '비디오 뷰 캠페인(VVC 2.0)_CPV', impressions: 12346312, clicks: 36367, cost: 12605155, views: 2604421 },
    { media: 'Google Ads', product: '디맨드젠 이미지 광고_CPC', impressions: 6033523, clicks: 190122, cost: 8053222, views: 0 },
    { media: 'Meta', product: '경매_트래픽_Instagram 프로필 방문 수 극대화_instagram', impressions: 25701271, clicks: 222827, cost: 28144084, views: 608581 },
    { media: 'Meta', product: '경매_참여_게시물 참여 극대화_instagram', impressions: 7847871, clicks: 15581, cost: 13110583, views: 1784390 },
    { media: 'NAVER 성과형 DA', product: '인지도 및 트래픽_피드 영역_CPC', impressions: 6474500, clicks: 107508, cost: 24020939, views: 0 },
    { media: 'kakao 모먼트', product: '카카오톡비즈보드_방문_CPC', impressions: 163733694, clicks: 70425, cost: 26392437, views: 0 },
  ],
  '식품': [
    { media: 'Google Ads', product: '디맨드젠 동영상 광고_CPA', impressions: 22412816, clicks: 376987, cost: 115410803, views: 3468936 },
    { media: 'Google Ads', product: '비디오 뷰 캠페인(VVC 2.0)_CPV', impressions: 10052123, clicks: 10705, cost: 24791228, views: 3186601 },
    { media: 'Meta', product: '경매_인지도_ThruPlay 조회 극대화_instagram', impressions: 5346798, clicks: 13268, cost: 42924748, views: 1769753 },
    { media: 'NAVER 성과형 DA', product: '인지도 및 트래픽_서비스 통합_CPC', impressions: 36271153, clicks: 46350, cost: 18702189, views: 0 },
    { media: 'kakao 모먼트', product: '카카오톡비즈보드_방문_CPC', impressions: 25850060, clicks: 19622, cost: 8619818, views: 0 },
    { media: 'TikTok', product: '동영상 조회_6초 조회수_TikTok_동영상', impressions: 7353117, clicks: 26266, cost: 10186425, views: 7288446 },
  ],
}

// ── 매체명 정규화 (공백 제거) ──────────────────────────────────────────────
export function normalizeMedia(media: string): string {
  return media.replace(/\s+/g, '')
}

// ── 기간이 2026-01 ~ 2026-06에 완전히 포함되는지 ──────────────────────────
// period: { startYear, startMonth, endYear, endMonth } (문자열)
// 2026년이고 시작·종료 월이 모두 1~6 사이이며 시작 ≤ 종료일 때만 true.
export interface PeriodLike {
  startYear: string
  startMonth: string
  endYear: string
  endMonth: string
}
export function isWithin2026H1(period: PeriodLike | undefined): boolean {
  if (!period) return false
  const { startYear, startMonth, endYear, endMonth } = period
  if (startYear !== '2026' || endYear !== '2026') return false
  const sm = parseInt(startMonth, 10)
  const em = parseInt(endMonth, 10)
  if (!sm || !em) return false
  if (sm < 1 || sm > 6 || em < 1 || em > 6) return false
  return sm <= em
}

// ── 매체별 "데이터 있는 상품" 목록 (상품 다이얼로그용) ──────────────────────
// 모든 업종을 가로질러, 해당 매체에 집행 데이터(노출>0 또는 비용>0)가 있는 상품을 합집합으로.
export function getBenchmarkProductsForMedia(media: string): string[] {
  const target = normalizeMedia(media)
  const set = new Set<string>()
  for (const rows of Object.values(benchmarkByIndustry)) {
    for (const r of rows) {
      if (normalizeMedia(r.media) === target && (r.impressions > 0 || r.cost > 0)) {
        set.add(r.product)
      }
    }
  }
  return Array.from(set)
}

// ── 차트 제공 가능한 업종(대) 목록 (상품 ≥3) ───────────────────────────────
export function getBenchmarkIndustries(): string[] {
  return Object.keys(benchmarkByIndustry).filter(k => {
    const products = new Set(benchmarkByIndustry[k].map(r => r.product))
    return products.size >= 3
  })
}

// ── 차트용: 업종의 매체×상품 — 절대수 + 파생 지표(CTR/CPC/VTR/CPV) ──────────
// ResultCharts.Row와 동일 형상. 절대수(impressions/clicks/views/cost)는 내부 계산용,
// clicks===0 → 클릭 탭 제외, views===0 → 조회 탭 제외 (차트2 §2.4).
export interface IndustryChartRow {
  label: string; media: string
  cost: number; impressions: number; clicks: number; views: number
  ctr: number; cpc: number; vtr: number; cpv: number
}
export function getIndustryChartRows(industry: string): IndustryChartRow[] {
  const rows = benchmarkByIndustry[industry] ?? []
  return rows.map(r => ({
    label: r.product,
    media: toDatashotMedia(r.media),
    cost: r.cost,
    impressions: r.impressions,
    clicks: r.clicks,
    views: r.views,
    ctr: r.clicks > 0 && r.impressions > 0 ? Math.round((r.clicks / r.impressions) * 10000) / 100 : 0,
    cpc: r.clicks > 0 ? Math.round(r.cost / r.clicks) : 0,
    vtr: r.views > 0 && r.impressions > 0 ? Math.round((r.views / r.impressions) * 10000) / 100 : 0,
    cpv: r.views > 0 ? Math.round(r.cost / r.views) : 0,
  }))
}

// ── 테이블/미리보기용 행 (기간·매체·업종대·상품 + 파생 지표) ─────────────────
// 월은 선택 기간을 전달받아 분배(없으면 2026-01). 공통 지표(파생)는 노출/클릭/비용/조회로 계산.
export interface BenchmarkTableRow {
  period: string
  media: string
  industryLarge: string
  product: string
  impressions: number
  clicks: number
  cost: number
  views: number
  cpm: number
  cpc: number
  cpv: number
  ctr: number
  vtr: number
}
export function getBenchmarkTableRows(months: string[] = ['2026-01']): BenchmarkTableRow[] {
  const out: BenchmarkTableRow[] = []
  const monthList = months.length > 0 ? months : ['2026-01']
  let i = 0
  for (const [industry, rows] of Object.entries(benchmarkByIndustry)) {
    for (const r of rows) {
      const period = monthList[i % monthList.length]
      i++
      out.push({
        period,
        media: r.media,
        industryLarge: industry,
        product: r.product,
        impressions: r.impressions,
        clicks: r.clicks,
        cost: Math.round(r.cost),
        views: r.views,
        cpm: r.impressions > 0 ? Math.round((r.cost / r.impressions) * 1000) : 0,
        cpc: r.clicks > 0 ? Math.round(r.cost / r.clicks) : 0,
        cpv: r.views > 0 ? Math.round(r.cost / r.views) : 0,
        ctr: r.impressions > 0 ? parseFloat(((r.clicks / r.impressions) * 100).toFixed(2)) : 0,
        vtr: r.impressions > 0 ? parseFloat(((r.views / r.impressions) * 100).toFixed(2)) : 0,
      })
    }
  }
  return out
}

// 선택 기간(period)을 월 배열로 전개. 2026 H1 범위 전제(호출부에서 isWithin2026H1 체크).
export function periodToMonths(period: PeriodLike): string[] {
  const sm = parseInt(period.startMonth, 10)
  const em = parseInt(period.endMonth, 10)
  const months: string[] = []
  for (let m = sm; m <= em; m++) months.push(`2026-${String(m).padStart(2, '0')}`)
  return months.length > 0 ? months : ['2026-01']
}

// ── 매체+상품의 벤치마크 지표값 조회 (미리보기/테이블 셀 채우기용) ──────────
// 여러 업종에 같은 매체·상품이 있으면 합산. 없으면 null.
export interface BenchmarkMetricValues {
  impressions: number; clicks: number; cost: number; views: number
  cpm: number; cpc: number; cpv: number; ctr: number; vtr: number
}
export function getBenchmarkMetricsFor(media: string, product: string): BenchmarkMetricValues | null {
  const target = normalizeMedia(media)
  let imp = 0, clk = 0, cost = 0, views = 0, found = false
  for (const rows of Object.values(benchmarkByIndustry)) {
    for (const r of rows) {
      if (normalizeMedia(r.media) === target && r.product === product) {
        imp += r.impressions; clk += r.clicks; cost += r.cost; views += r.views; found = true
      }
    }
  }
  if (!found) return null
  return {
    impressions: imp, clicks: clk, cost: Math.round(cost), views,
    cpm: imp > 0 ? Math.round((cost / imp) * 1000) : 0,
    cpc: clk > 0 ? Math.round(cost / clk) : 0,
    cpv: views > 0 ? Math.round(cost / views) : 0,
    ctr: imp > 0 ? parseFloat(((clk / imp) * 100).toFixed(2)) : 0,
    vtr: imp > 0 ? parseFloat(((views / imp) * 100).toFixed(2)) : 0,
  }
}

// DataShot 매체 선택 UI 표준 표기 (MediaProductSelect.MEDIA_LIST와 동일) — 헤더 모달이 이 표기로 매칭.
const DATASHOT_MEDIA_LIST = ['Google Ads', 'Meta', 'kakao모먼트', 'NAVER 성과형 DA', 'NAVER 보장형 DA', 'TikTok']
// 벤치마크 매체명('kakao 모먼트' 등) → DataShot 표준 표기('kakao모먼트')로 정규화. 매칭 안 되면 원본 유지.
function toDatashotMedia(media: string): string {
  const n = normalizeMedia(media)
  return DATASHOT_MEDIA_LIST.find(m => normalizeMedia(m) === n) ?? media
}

// ── 결과 화면 헤더 요약용 집계 (차트 데이터와 동일 소스) ────────────────────
// 매체별 선택 광고상품 목록. 차트에 쓰인 모든 업종을 가로질러 매체→상품(집행 데이터 있음) 합집합.
// 매체 노출 순서는 benchmarkByIndustry 등장 순서를 따른다(일관성). 매체명은 DataShot 표준 표기로.
export function getBenchmarkMediaProducts(): { media: string; products: string[] }[] {
  const order: string[] = []
  const map = new Map<string, Set<string>>()
  for (const rows of Object.values(benchmarkByIndustry)) {
    for (const r of rows) {
      if (!(r.impressions > 0 || r.cost > 0)) continue
      const media = toDatashotMedia(r.media)
      if (!map.has(media)) { map.set(media, new Set()); order.push(media) }
      map.get(media)!.add(r.product)
    }
  }
  return order.map(media => ({ media, products: Array.from(map.get(media)!) }))
}

// 차트에 포함된 업종(대) 목록 (헤더 업종 요약·모달용).
export function getBenchmarkIndustryList(): string[] {
  return Object.keys(benchmarkByIndustry)
}

// 결과 헤더 지표 요약·모달용 — 차트/테이블이 실제 쓰는 공통 지표 9종(단일 '공통 지표' 그룹).
// 원본 4종(광고비/노출수/클릭수/조회수)은 실데이터, 계산 5종(CPM/CPC/CPV/CTR/VTR)은 그 4종으로 연산.
export function getBenchmarkMetricGroups(): { group: string; metrics: string[] }[] {
  return [
    { group: '공통 지표', metrics: ['광고비', '노출수', '클릭수', '조회수', 'CPM', 'CPC', 'CPV', 'CTR', 'VTR'] },
  ]
}
