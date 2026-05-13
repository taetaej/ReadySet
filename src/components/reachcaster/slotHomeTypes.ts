/* ─── Types ─── */

export interface SelectedOutput {
  id: string
  title: string
  // DataShot용
  media?: string
  insight?: string
  metrics?: { label: string; value: string }[]
  mediaMix?: { name: string; ratio: number; color: string }[]
  // Reach Caster용
  module?: string
  period?: string
  keyMetric?: string
  reach?: string
}

export interface SolutionSlot {
  key: string
  name: string
  desc: string
  path: string
  status: 'completed' | 'in-progress' | 'empty' | 'coming-soon'
  selectedOutputs?: SelectedOutput[]
}

export interface DocumentItem {
  id: string
  name: string
  type: 'pdf' | 'xlsx' | 'pptx' | 'docx'
  size: string
  uploadedAt: string
  uploadedBy: string
}

export interface ActivityItem {
  id: string
  user: string
  solution: string  // 어떤 솔루션
  action: string    // 어떤 작업
  detail?: string   // 부가 정보
  timestamp: string
}

/* ─── Colors ─── */

export const colors = {
  bg: 'hsl(var(--background))',
  surface: 'hsl(var(--card))',
  border: 'hsl(var(--border))',
  borderHover: 'hsl(var(--ring) / 0.3)',
  text: 'hsl(var(--foreground))',
  textMuted: 'hsl(var(--muted-foreground))',
  textDim: 'hsl(var(--muted-foreground) / 0.6)',
  accent: 'hsl(217 91% 60%)',
  accentDim: 'hsl(217 91% 60% / 0.12)',
  success: 'hsl(142 71% 45%)',
  successDim: 'hsl(142 71% 45% / 0.1)',
  warning: 'hsl(38 92% 50%)',
  warningDim: 'hsl(38 92% 50% / 0.1)',
}

/* ─── Mock Data ─── */

export const AVAILABLE_OUTPUTS: Record<string, SelectedOutput[]> = {
  datashot: [
    { id: 'DS001', title: '전자제품 업종 벤치마크', media: 'Meta' },
    { id: 'DS002', title: '경쟁사 미디어 믹스 분석', media: 'Google Ads' },
    { id: 'DS003', title: '스마트폰 카테고리 시즌 분석', media: '네이버 성과형 DA' },
    { id: 'DS004', title: '25-39세 남성 미디어 소비 패턴', media: 'Meta' },
    { id: 'DS005', title: '디지털 vs TVC 효율 비교', media: 'kakao모먼트' },
    { id: 'DS006', title: '모바일 동영상 광고 벤치마크', media: 'Google Ads' },
    { id: 'DS007', title: '경쟁사 A 집행 패턴 분석', media: 'Meta' },
    { id: 'DS008', title: '소셜 미디어 광고 효율 분석', media: '네이버 성과형 DA' },
    { id: 'DS009', title: '프리미엄 세그먼트 광고 반응률', media: 'Google Ads' },
    { id: 'DS010', title: '연간 광고비 트렌드 분석', media: 'kakao모먼트' },
  ],
  reachCaster: [
    { id: 'RC001', title: '스포츠 용품 시즌 오프', module: 'Ratio Finder', period: '2024.03.01 → 2024.03.28', keyMetric: 'Digital 60% : TVC 40%', reach: '72.3%' },
    { id: 'RC002', title: '8주 기간 / 12억 예산', module: 'Reach Predictor', period: '2024.03.01 → 2024.04.25', reach: '68.5%' },
    { id: 'RC003', title: '갤럭시 S24 런칭 캠페인', module: 'Ratio Finder', period: '2024.02.01 → 2024.03.15', keyMetric: 'Digital 55% : TVC 45%', reach: '78.1%' },
    { id: 'RC004', title: '봄 시즌 브랜드 캠페인', module: 'Reach Predictor', period: '2024.03.15 → 2024.05.10', reach: '61.2%' },
    { id: 'RC005', title: '디지털 집중 시나리오', module: 'Ratio Finder', period: '2024.04.01 → 2024.04.30', keyMetric: 'Digital 80% : TVC 20%', reach: '65.8%' },
    { id: 'RC006', title: 'TVC 강화 시나리오', module: 'Reach Predictor', period: '2024.03.01 → 2024.04.30', reach: '74.4%' },
    { id: 'RC007', title: '크로스미디어 최적 믹스', module: 'Ratio Finder', period: '2024.05.01 → 2024.06.30', keyMetric: 'Digital 65% : TVC 35%', reach: '70.9%' },
    { id: 'RC008', title: '여름 시즌 도달률 예측', module: 'Reach Predictor', period: '2024.06.01 → 2024.07.31', reach: '59.3%' },
    { id: 'RC009', title: '하반기 브랜드 리프트', module: 'Ratio Finder', period: '2024.07.01 → 2024.08.31', keyMetric: 'Digital 70% : TVC 30%', reach: '66.7%' },
    { id: 'RC010', title: '연말 프로모션 시나리오', module: 'Reach Predictor', period: '2024.11.01 → 2024.12.31', reach: '82.1%' },
    { id: 'RC011', title: '신규 타겟 확장 시나리오', module: 'Ratio Finder', period: '2024.04.15 → 2024.05.31', keyMetric: 'Digital 75% : TVC 25%', reach: '63.4%' },
    { id: 'RC012', title: '예산 효율화 시나리오', module: 'Reach Predictor', period: '2024.03.01 → 2024.03.31', reach: '55.8%' },
  ],
}

export const INITIAL_FLOW: SolutionSlot[] = [
  { key: 'datashot', name: 'DataShot', desc: '업종별 벤치마크 기반 광고 효율 분석', path: '/datashot', status: 'empty' },
  { key: 'adCurator', name: 'Ad Curator', desc: '캠페인 성과 기반 맞춤형 상품 큐레이션', path: '/ad-curator', status: 'coming-soon' },
  { key: 'budgetOptimizer', name: 'Budget Optimizer', desc: 'KPI 목표 기반 미디어믹스 예산 최적화', path: '/budget-optimizer', status: 'coming-soon' },
  { key: 'reachCaster', name: 'Reach Caster', desc: '크로스미디어 통합 도달 예측 시뮬레이션', path: '/reachcaster', status: 'empty' },
]

export const MOCK_DOCUMENTS: DocumentItem[] = [
  { id: 'D001', name: '캠페인 기획서_v2.pdf', type: 'pdf', size: '2.3 MB', uploadedAt: '2024-01-15', uploadedBy: '김민수' },
    { id: 'D002', name: '타겟 분석 리포트.xlsx', type: 'xlsx', size: '1.8 MB', uploadedAt: '2024-01-18', uploadedBy: '이지은' },
  { id: 'D003', name: '미디어 플래닝 제안서.pptx', type: 'pptx', size: '5.1 MB', uploadedAt: '2024-01-20', uploadedBy: '김민수' },
]

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'A1', user: '김민수', solution: 'Reach Caster', action: '시나리오 생성', detail: '스포츠 용품 시즌 오프', timestamp: '2시간 전' },
  { id: 'A2', user: '이지은', solution: 'DataShot', action: '데이터셋 생성', detail: '전자제품 업종 벤치마크', timestamp: '5시간 전' },
  { id: 'A3', user: '김민수', solution: 'Documents', action: '파일 업로드', detail: '캠페인 기획서_v2.pdf', timestamp: '1일 전' },
  { id: 'A4', user: '이지은', solution: 'DataShot', action: '데이터셋 생성', detail: '25-39세 남성 미디어 소비 패턴', timestamp: '2일 전' },
  { id: 'A5', user: '박서연', solution: 'Reach Caster', action: '시나리오 생성', detail: '갤럭시 S24 런칭 캠페인', timestamp: '3일 전' },
  { id: 'A6', user: '김민수', solution: 'Reach Caster', action: '시나리오 생성', detail: '8주 기간 / 12억 예산', timestamp: '4일 전' },
  { id: 'A7', user: '이지은', solution: 'Documents', action: '파일 업로드', detail: '타겟 분석 리포트.xlsx', timestamp: '5일 전' },
  { id: 'A8', user: '김민수', solution: 'DataShot', action: '데이터셋 생성', detail: '경쟁사 미디어 믹스 분석', timestamp: '6일 전' },
]
