// Budget Optimizer 시나리오 타입 정의

export interface BOScenario {
  id: number
  name: string
  description: string
  industry: string
  industryMode: 'brand' | 'direct'
  brand?: string
  kpi: 'impression' | 'click' | 'view' | 'reach'
  totalBudget: number
  startDate: string
  endDate: string
  status: 'Pending' | 'Processing' | 'Completed' | 'Error'
  processStep: number
  totalSteps: number
  created: string
  creator: string
  creatorId: string
  completedAt: string | null
  errorMessage: string | null
  mediaCount: number
  fixedCount: number
}

export interface BOSlotData {
  title: string
  advertiser: string
  advertiserId: string
  visibility: string
  results: number
  modified: string
  description: string
}

// KPI 라벨 (한글 + 영문 혼용). 생성/목록/결과 헤더에서 공통 사용
// 예외: 결과 화면 Allocation 테이블 컬럼명은 영문만 사용 (KPI_META.labelEn)
export const KPI_LABELS: Record<string, string> = {
  impression: '노출 (Impression)',
  click: '클릭 (Click)',
  view: '조회 (View)',
  reach: '도달 (Reach)'
}

export const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Completed: { bg: 'hsl(var(--foreground))', color: 'hsl(var(--background))' },
  Processing: { bg: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' },
  Pending: { bg: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' },
  Error: { bg: 'hsl(0 84% 60%)', color: 'white' }
}
