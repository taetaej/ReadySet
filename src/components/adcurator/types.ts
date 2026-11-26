// Ad Curator 큐레이션 타입·상수 정의

export type ACPurpose = 'awareness' | 'view' | 'traffic' | 'conversion'

export type ACStatus = 'Pending' | 'Processing' | 'Completed' | 'Error'

export interface ACCuration {
  id: number
  name: string
  description: string
  industry: string
  industryMode: 'brand' | 'direct'
  brand?: string
  promotionIncluded: boolean
  startDate: string
  endDate: string
  /** 캠페인 목적. 1개 이상(복수 선택) */
  purposes: ACPurpose[]
  status: ACStatus
  created: string
  creator: string
  creatorId: string
  /** Completed에서만 값이 있음 */
  completedAt: string | null
  /** Error에서만 값이 있음 */
  errorAt: string | null
}

export interface ACSlotData {
  title: string
  advertiser: string
  advertiserId: string
  visibility: string
  results: number
  modified: string
  description: string
}

export interface ACMoveTargetSlot {
  id: string
  name: string
  visibility: 'Private' | 'Internal' | 'Shared'
}

/** 캠페인 목적 고정 표시 순서 (선택 순서와 무관) */
export const PURPOSE_ORDER: ACPurpose[] = ['awareness', 'view', 'traffic', 'conversion']

export const PURPOSE_LABELS: Record<ACPurpose, string> = {
  awareness: '인지',
  view: '조회',
  traffic: '트래픽',
  conversion: '전환'
}

export const STATUS_OPTIONS: ACStatus[] = ['Completed', 'Processing', 'Pending', 'Error']

/** 상태 뱃지 스타일 (BudgetOpt 2.0 목록 상태 뱃지와 동일한 톤) */
export const STATUS_BADGE_CLASSES: Record<ACStatus, string> = {
  Completed: 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))] border-[hsl(var(--foreground))]',
  Processing: 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]',
  Pending: 'bg-transparent text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]',
  Error: 'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] border-[hsl(var(--destructive))]'
}

// ---------- 큐레이션 생성 (Step 1 기본 정보) ----------

/** 생성 위자드 폼 값. Step 2 상세 조건은 Step 2 구현 시 추가 */
export interface ACCreateFormData {
  name: string
  /** 설명 = 캠페인 맥락 프롬프트. SpinX가 읽고 Step 2 기준 채우기를 도움 */
  description: string
  /** 설명에 첨부한 캠페인 정보 파일 이름 (1개) */
  contextFile: string | null
  industryMode: 'brand' | 'direct'
  brand: string
  industry: string
  period: { start: string; end: string }
  /** 캠페인 목적. 1개 이상, PURPOSE_ORDER 순서로 저장 */
  purposes: ACPurpose[]
  promotionIncluded: boolean
  /** Step 2 선별 기준 행. SpinX가 맥락에서 파싱한 기준 + 사용자가 추가한 기준. 값이 있는 행만 선별에 반영 */
  conditions: ACCondition[]
  /** Step 2 특성 ID 목록 (AC_TRAIT_CATALOG). 캠페인 설명 분석 결과로만 채움, 읽기 전용 */
  traits: string[]
  /** Step 2 제외 값. v2에서는 입력 경로 없음(항상 빈 값). 데이터 호환용으로 유지 */
  excludes: Record<string, string[]>
}

/** 목록 화면에서 복제 진입 시 전달되는 프리필 값 (캠페인 기간·Step 2 상세 조건은 프리필하지 않음) */
export type ACCreatePrefill = Partial<Omit<ACCreateFormData, 'period' | 'conditions' | 'traits' | 'excludes' | 'contextFile'>>

/**
 * DataShot 데이터셋 상세 모달에서 생성 화면으로 이동할 때 전달하는 프리필 값.
 * 네비게이션 state `{ datasetPrefill }`로 전달한다. 이 경로에서만 캠페인 기간 프리필을 허용한다.
 */
export interface ACDatasetPrefill {
  source: 'dataset'
  name: string
  /** DataShot 대분류명 그대로 (AC_INDUSTRY_LIST에 없을 수 있음) */
  industry: string
  /** yyyy-mm-dd */
  period: { start: string; end: string }
  /** PURPOSE_ORDER 순서로 정렬된 배열 */
  purposes: ACPurpose[]
  promotionIncluded: boolean
  /** 데이터셋이 속한 Slot이 Shared인지 */
  slotShared: boolean
}

// ---------- 큐레이션 생성 (Step 2 상세 설정) ----------

/**
 * 조건 분류. 생성 화면(정의서 4.0)에서는 attribute(속성)만 상세 선별 기준 표·기준 추가에 쓰고,
 * 특성은 AC_TRAIT_CATALOG로 따로 관리한다. efficiency는 결과 화면(ACAppliedConditionsDialog) 호환용으로 유지.
 */
export type ACConditionGroup = 'attribute' | 'efficiency'

export const CONDITION_GROUP_LABELS: Record<ACConditionGroup, string> = {
  attribute: '속성 기준',
  efficiency: '특성 기준'
}

/** 조건 정의 (라벨 카탈로그 한 항목) */
export interface ACConditionDef {
  id: string
  label: string
  /** 다이얼로그에서 항목 이름 아래 표시하는 한 줄 설명 */
  description: string
  group: ACConditionGroup
  /** 검색·말 해석에 쓰는 관련 키워드 */
  keys: string[]
  /** 고를 수 있는 값 (카탈로그 순서). 예산은 비어 있음 */
  values: string[]
  /** 금액(만 원)으로 받는 조건. 값 하나 */
  money?: boolean
}

/** 특성 정의 (정의서 4.4). 캠페인 설명에서만 파싱, 화면에는 이름만 표시 */
export interface ACTraitDef {
  id: string
  label: string
  /** 카탈로그 정리용 분류 (화면 미표시) */
  kind: 'media' | 'campaign'
  /** 캠페인 설명에서 이 특성을 찾는 표현 */
  pattern: RegExp
}

/** 선별 기준 행. 예산은 values = [만 원 단위 금액 문자열] */
export interface ACCondition {
  id: string
  values: string[]
  /** 값을 채운 주체. spinx = SpinX가 캠페인 맥락에서 채움, user = 사용자가 직접 입력·수정 */
  source?: 'spinx' | 'user'
  /** SpinX가 채운 근거 (예: 브리프의 어떤 표현에서 가져왔는지) */
  reason?: string
}

/** SpinX가 맥락에서 파싱한 기준 (기준 + 항목 값 + 근거) */
export interface ACParsedCriterion {
  id: string
  values: string[]
  reason: string
}

/** 캠페인 맥락 분석 결과 (Step 1 → Step 2 진입 시) */
export interface ACAnalysis {
  /** 분석한 맥락 식별 키 (설명·파일이 바뀌면 다시 분석) */
  key: string
  /** SpinX가 맥락에서 찾아 행으로 매핑한 기준 수 */
  filled: number
  /** 확신이 없어 값 대신 후보만 보여 주는 항목 { 조건 id: 후보 값[] } */
  candidates: Record<string, string[]>
  /** 기준으로 반영하지 못한 표현 */
  notes: { phrase: string; reason: string }[]
}

/** Step 1 설명(캠페인 맥락) 최대 글자 수 */
export const AC_DESCRIPTION_MAX = 2000

/** 첨부 허용 형식 */
export const AC_ALLOWED_FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg']

/** 캠페인 목적 카드 안내 문구 */
export const PURPOSE_DESCRIPTIONS: Record<ACPurpose, string> = {
  awareness: '브랜드와 제품의 인지도 확대',
  view: '광고 영상의 시청 수 확대',
  traffic: '웹사이트·앱 방문 수 확대',
  conversion: '구매·가입 등 목표 행동 확대'
}

/** 업종 직접 선택 목록 (22개, BudgetOpt 2.0과 동일) */
export const AC_INDUSTRY_LIST = [
  '화장품', '자동차', '식품', '건강식품', '전자제품',
  '패션', '여행', '게임', '이커머스', '금융',
  '교육', '부동산', '통신', '유통', '엔터테인먼트',
  '스포츠', '의료', '가전', '주류', '생활용품',
  '가구/인테리어', '반려동물'
]

/** 캠페인 기간 최대 일수 (시작일·종료일 포함) */
export const AC_MAX_PERIOD_DAYS = 180
