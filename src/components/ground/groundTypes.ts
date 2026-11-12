// groundTypes.ts — Ground(가칭) 라이브러리 · 인사이트 맵 · 대화 세션 타입

export type AudienceLevel = 'public' | 'internal'
export type Viewer = 'internal' | 'external'
export type HolidayType = 'long' | 'short'

/** 인사이트 맵의 주제 군집. 시나리오의 어떤 키와 맞물리는지로 나눈다 */
export type ThemeId = 'timing' | 'budget' | 'mix' | 'inventory' | 'attribution'

export interface Theme {
  id: ThemeId
  name: string
  /** 이 주제가 시나리오의 어떤 값과 맞물리는지 */
  matchesOn: string
}

export interface Holiday {
  name: string
  start: string
  end: string
  weekdayOff: number
  type: HolidayType
  confirmed: boolean
}

export interface FindingMetric { label: string; change: number }

/** 발견이 시나리오에 붙는 조건. 적힌 조건을 모두 만족할 때만 연결된다 */
export interface FindingCondition {
  holiday?: HolidayType
  /** 시즌 구간(SEASONS 키)과 기간이 겹쳐야 함 */
  season?: string[]
  /** 기간에 월급일(25일)이 포함돼야 함 */
  payday?: boolean
  industry?: string[]
  /** 모든 매체가 최소 비중 이상이어야 함 */
  media?: { name: string; minShare: number }[]
  kpi?: string[]
  budgetChange?: 'increase' | 'keep' | 'decrease'
  /** 총예산 하한 (억 원) */
  minBudget?: number
  minMediaCount?: number
  launch?: boolean
}

export interface Finding {
  id: string
  title: string
  summary: string
  metrics: FindingMetric[]
  insight: string[]
  condition: FindingCondition
  strength: 'direct' | 'reference'
  /** SpinX가 시나리오에 대입할 때 쓰는 행동 제안 */
  action?: string
}

export interface Report {
  id: string
  theme: ThemeId
  series: string
  issue: string
  /** 원 가설 코드 (예: H31+H32) */
  code?: string
  title: string
  subtitle: string
  publishedAt: string
  publisher: string
  audienceLevel: AudienceLevel
  /** 화면 검토용 가상 결과 */
  sample?: boolean
  /** 실측 데이터(매체 MCP)가 있어야 시나리오와 연결된다 */
  requiresActual?: boolean
  method: { label: string; value: string }[]
  findings: Finding[]
  brandNote?: string
  playbook?: { title: string; body: string }[]
  excluded?: string
  next?: { solution: string; title: string; body: string; href: string }
}

export interface MediaNews {
  id: string
  media: string
  title: string
  summary: string
  publishedAt: string
  effectiveFrom: string
  effectiveTo?: string
  source: string
  audienceLevel: AudienceLevel
  body: string
}

export interface MediaShare { media: string; share: number }

export interface Scenario {
  id: string
  slotId: string
  solution: 'BudgetOpt 2.0' | 'Reach Caster'
  name: string
  industry: string
  start: string
  end: string
  kpi: string
  mediaMix: MediaShare[]
  /** 총예산 (억 원) — BO 입력값 */
  budget: number
  /** 직전 대비 예산 변화 — BO 입력값 */
  budgetChange: 'increase' | 'keep' | 'decrease'
  /** 신상품 출시 캠페인 여부 */
  launch?: boolean
  summary: string
}

export interface GroundSlot { id: string; title: string; advertiser: string }

export interface Link {
  sourceId: string
  sourceType: 'finding' | 'news'
  scenarioId: string
  strength: 'direct' | 'reference'
  reasons: string[]
}

export type CitationRef =
  | { type: 'finding'; id: string }
  | { type: 'news'; id: string }
  | { type: 'scenario'; id: string }

export interface GroundAnswer {
  verdict: string
  paragraphs: string[]
  citations: CitationRef[]
  followUps: string[]
  /** 실행이 필요한 요청이면 SpinX가 거친 단계. "워크플로우로 저장"의 재료 */
  /** proposal = SpinX가 제안만 한 단계(지금 실행 전) · done = 이미 실행한 단계(기록이 자동으로 남음) */
  workflow?: { mode: 'proposal' | 'done'; name: string; steps: { kind: import('./flowData').FlowNodeKind; title: string; result: string }[]; templateId?: string }
  patch?: FlowPatch
}

export interface GroundTurn {
  id: string
  question: string
  viewer: Viewer
  answer: GroundAnswer
}

/** 대화 세션 (개인). 답은 질문·권한으로 결정적으로 다시 만들 수 있어 질문만 저장한다 */
/** 대화를 시작한 자리. 같은 대상에서 다시 열면 이 대화를 이어 쓴다 */
export interface SessionOrigin {
  type: 'home' | 'workflow' | 'library' | 'artifact' | 'skill'
  /** 대상 id (워크플로우 FL-xx · 리포트 WR-xxx · 'flow-new' · 'library') */
  id: string
  label: string
  path: string
}
export interface GroundSession {
  id: string
  title: string
  viewer: Viewer
  questions: string[]
  createdAt: number
  updatedAt: number
  origin?: SessionOrigin
}
/** 대화로 캔버스를 고치는 제안 — "캔버스에 적용"의 재료 */
export interface FlowPatch {
  flowId: string
  changes: { nodeId: string; before: string; title: string; sub?: string; config?: { k: string; v: string }[] }[]
  add?: { after: string; kind: import('./flowData').FlowNodeKind; title: string; sub: string }
}
