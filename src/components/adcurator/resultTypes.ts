// Ad Curator 큐레이션 결과 화면 타입·상수 (화면정의서 plan/spec/AdCurator_CurationResult_Spec.md 13장)
// 점수·순위·문구는 데이터사이언티스트가 정의해 결과로 제공하는 값이며, 화면은 산출 방식을 정의하지 않음.
import type { ACCuration } from './types'

/** 적합도 그룹. Low Fit은 결과 화면에서 다루지 않음 */
export type ACFitGroup = 'best' | 'good'

/** 화면 권한 역할. canEdit = admin | marketer */
export type ACResultRole = 'admin' | 'marketer' | 'agency' | 'client'

/** 평가 축(5개 또는 6개). 배열 순서 = 범례·막대 칸·레이더 순서 */
export interface ACEvalAxis {
  id: string
  name: string
}

/** 프로모션 원본 1건 (MTS 2.0 원문 기준) */
export interface ACPromotion {
  name: string
  /** yyyy-mm-dd, 혜택이 적용되는 광고 집행 기간 */
  startDate: string
  endDate: string
  benefit: string
  condition: string
  advantage: string
  sourceUrl: string
}

/** 상품 속성(6.10.2). 값이 없는 항목은 undefined → 팝업에서 행 자체를 숨김 */
export interface ACProductAttributes {
  buyType?: '보장형' | '성과형'
  billing?: string
  formats?: string[]
  /** 영상 상품의 영상 형식 (예: '스킵 불가 · 15초') */
  videoSpec?: string
  /** 타게팅 지원. 데모는 '연령'·'성별'로 풀어서 저장 */
  targeting?: string[]
  recommendedTarget?: string
  devices?: string[]
  /** 보장형일 때만 */
  guarantee?: string
  /** 최소 집행 금액(만 원) */
  minBudgetManwon?: number
}

export type ACAttributeKey = keyof ACProductAttributes

/** 결과 매체·상품 1건 */
export interface ACResultItem {
  id: string
  group: ACFitGroup
  /** 그룹 내 종합 적합도 순위(1~). 목록 순위·Best Match·카드 기준 */
  rank: number
  /** BudgetOpt 2.0 연계: 미지원 매체 (KPI와 무관하게 항상 제외). 카탈로그에 없는 상품은 화면에서 따로 판별 */
  boUnsupported?: boolean
  /** BudgetOpt 2.0 연계: 이 업종에서 모델 학습 결과가 없는 KPI 목록 (해당 KPI를 고르면 제외) */
  boNoModelKpis?: string[]
  /** 카탈로그 원문 매체명 */
  mediaName: string
  /** 카탈로그 원문 광고상품명 */
  productName: string
  /** 상품 설명: 30자 이내 명사구, 지면 포함, 마침표 없음 (목록 행) */
  description: string
  /** 상품 팝업 설명: 매체·지면을 포함한 한 문장, 50자 내외, 광고주도 이해할 수 있는 말 */
  detail: string
  /** 결론 구절: 15~25자, 해요체 */
  headline: string
  /** 근거: 1~2문장, 결론과 합쳐 150자 이내, 캠페인 입력값 연결 1개 이상 */
  reason: string
  /** 축 id → 점수. 원값은 화면에 표시하지 않음 */
  axisScores: Record<string, number>
  attributes: ACProductAttributes
  /** 입력 속성 기준과 맞는 속성(✓) */
  matchedAttributeKeys: ACAttributeKey[]
  /** 완화로 제외된 조건에 해당하는 속성(조건 완화) */
  relaxedAttributeKeys: ACAttributeKey[]
  /** 원본 프로모션 목록. 표시용 1개는 pickPromotion으로 고름 */
  promotions: ACPromotion[]
  /** BudgetOpt 2.0 지원 상품 여부 (미지원은 BudgetOpt로 넘기지 않음) */
  boSupported: boolean
}

/** 대안 카드 (Best Match 외 1~2개 → 카드 총 2~3개) */
export interface ACAltCard {
  kind: 'industryFavorite' | 'topPerformer'
  itemId: string
  /** 4.2 한 줄 설명 (현재 화면 미표시). 두 관점의 1등이 같은 상품이어도 병합하지 않고 카드를 각각 둠 */
  sentence: string
}

/** 반영된 조건 모달(3.3)의 Step 2 선별 기준 행 */
export interface ACAppliedCondition {
  /** AC_CONDITION_CATALOG의 id */
  conditionId: string
  values: string[]
  /** `{값} 제외` 행 */
  exclude?: boolean
  /** 완화로 제외된 행 */
  relaxed?: boolean
}

/** 큐레이션 결과 스냅샷 (생성 시점 기준, 다시 계산하지 않음) */
export interface ACCurationResult {
  curation: ACCuration
  axes: ACEvalAxis[]
  /** false면 범례 `기본 평가 축` (캠페인 설명 없이 생성) */
  axesFromDescription: boolean
  /** 평가 KPI와 효율 지표 (Top Performer 문구·함께 1등 관점명) */
  evalKpi: { label: string; metric: string }
  /** 전체 풀(입력 조건 적용 전 큐레이션 대상 수) */
  totalPool: number
  items: ACResultItem[]
  bestMatchId: string
  /** 함께 1등 관점명 (`같은 업종 집행` | `{평가 KPI} 효율`), 0~1개 */
  bestMatchCoWinners: string[]
  altCards: ACAltCard[]
  appliedConditions: ACAppliedCondition[]
  /** SpinX 차트 해석. null = 생성 실패 */
  insight: string | null
  /** 생성 시점 yyyy-mm-dd */
  generatedAt: string
}

/** 목록 검색·필터 상태 (Best Fit·Good Fit 두 구역 공통) */
export interface ACResultFilters {
  search: string
  /** 매체 프로모션 포함·미포함 다중 선택(OR). 비어 있으면 전체 */
  promo: ACPromoFilter[]
}

export type ACPromoFilter = 'included' | 'excluded'

export const AC_PROMO_FILTER_OPTIONS: { value: ACPromoFilter; label: string }[] = [
  { value: 'included', label: '포함' },
  { value: 'excluded', label: '미포함' }
]

export const AC_EMPTY_FILTERS: ACResultFilters = { search: '', promo: [] }

/** 담기 최대 개수. BudgetOpt 2.0 상한(30개)보다 넉넉히 두고, 전달 30개 초과는 연계 다이얼로그에서 빼게 함 */
export const AC_PICK_MAX = 50
/** 목록 더 보기 단위 */
export const AC_PAGE_SIZE = 10

/** 상품 팝업 속성 표시 순서와 항목명 (6.10.2) */
export const AC_ATTRIBUTE_ROWS: { key: ACAttributeKey | 'buyBilling'; label: string }[] = [
  { key: 'buyBilling', label: '구매 방식' },
  { key: 'formats', label: '소재 형식' },
  { key: 'targeting', label: '타게팅 지원' },
  { key: 'devices', label: '디바이스' },
  { key: 'guarantee', label: '보장 형태' },
  { key: 'minBudgetManwon', label: '최소 집행 금액' },
  { key: 'recommendedTarget', label: '추천 타겟' }
]
