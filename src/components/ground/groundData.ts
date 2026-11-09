// groundData.ts — Ground 프로토타입 데이터 + 연결 엔진 + 전역 SpinX 응답 시뮬레이션
// Vol.1은 Winning Report 원문(AX팀, 2026.11) 수치. Vol.2~15는 AX팀 분석 예정 가설에 붙인 "화면 검토용 가상 결과"(sample: true).
// 시나리오·매체 소식도 예시 데이터.

import type {
  Theme, ThemeId, Holiday, Report, Finding, FindingCondition, MediaNews, Scenario, GroundSlot, Link, Viewer, GroundAnswer, CitationRef,
} from './groundTypes'
import { industryCategories } from '../datashot/types'

export const TODAY = '2026-11-04'
export const INDUSTRIES = Object.keys(industryCategories)

// ─────────────────────────────────────────────
// 날짜
// ─────────────────────────────────────────────
const t = (d: string) => new Date(`${d}T00:00:00`).getTime()
export const fmtYMD = (d: string) => d.replace(/-/g, '.')
export const fmtMD = (d: string) => `${Number(d.slice(5, 7))}.${Number(d.slice(8, 10))}`
const overlaps = (s1: string, e1: string, s2: string, e2: string) => t(s1) <= t(e2) && t(s2) <= t(e1)
export const isActive = (s: Scenario) => t(s.end) >= t(TODAY)
/** 기간 안에 25일이 한 번이라도 있는지 */
const coversPayday = (s: Scenario) => {
  const d = new Date(`${s.start}T00:00:00`)
  const end = t(s.end)
  while (d.getTime() <= end) { if (d.getDate() === 25) return true; d.setDate(d.getDate() + 1) }
  return false
}

// ─────────────────────────────────────────────
// 캘린더 — 연휴(리포트 기준: 평일 1~2일 단기, 3일 이상 장기) · 시즌
// 2027년 연휴는 공휴일·대체공휴일 규칙으로 계산한 가정값
// ─────────────────────────────────────────────
export const HOLIDAYS: Holiday[] = [
  { name: '2025 설', start: '2025-01-25', end: '2025-02-02', weekdayOff: 4, type: 'long', confirmed: true },
  { name: '2025 추석', start: '2025-10-03', end: '2025-10-09', weekdayOff: 5, type: 'long', confirmed: true },
  { name: '2026 설', start: '2026-02-14', end: '2026-02-18', weekdayOff: 3, type: 'long', confirmed: true },
  { name: '2026 추석', start: '2026-09-24', end: '2026-09-27', weekdayOff: 2, type: 'short', confirmed: true },
  { name: '2027 설', start: '2027-02-05', end: '2027-02-08', weekdayOff: 2, type: 'short', confirmed: false },
  { name: '2027 추석', start: '2027-09-14', end: '2027-09-16', weekdayOff: 3, type: 'long', confirmed: false },
]
export const SEASONS: Record<string, [string, string]> = {
  '블랙프라이데이': ['2026-11-20', '2026-11-30'],
  '연말': ['2026-12-01', '2026-12-31'],
  '2030 월드컵': ['2030-06-13', '2030-07-21'],
}

// ─────────────────────────────────────────────
// 주제 — 인사이트 맵의 군집
// ─────────────────────────────────────────────
export const THEMES: Theme[] = [
  { id: 'timing', name: '타이밍', matchesOn: '집행 기간 · 연휴 · 시즌 · 출시 시점' },
  { id: 'budget', name: '예산 규모', matchesOn: '총예산 · 증액 여부' },
  { id: 'mix', name: '매체 믹스', matchesOn: '매체 비중 · 매체 수' },
  { id: 'inventory', name: '지면 성격', matchesOn: '매체 유형 · KPI' },
  { id: 'attribution', name: '성과 해석', matchesOn: '실측 데이터 (매체 MCP 연결 시)' },
]
export const themeOf = (id: ThemeId) => THEMES.find(x => x.id === id)!

// ─────────────────────────────────────────────
// 라이브러리 — 분석 리포트
// ─────────────────────────────────────────────
const AX = 'CJ메조미디어 AX팀'
const sampleMethod = (period: string, scope: string) => [
  { label: '기간', value: period },
  { label: '대상', value: scope },
]

export const REPORTS: Report[] = [
  {
    id: 'WR-001', theme: 'timing', series: 'Winning Report', issue: 'Vol.1',
    title: '연휴에 광고 줄이면 아끼는 걸까, 놓치는 걸까?',
    subtitle: '104주 데이터로 본 연휴 광고 단가와 반응',
    publishedAt: '2026-11-02', publisher: AX, audienceLevel: 'public',
    method: [
      { label: '기간', value: '최근 104주 (2024.10.28 – 2026.10.25)' },
      { label: '대상', value: '22개 업종 · 4대 매체 (구글, 메타, 네이버 GFA·NOSP, 카카오)' },
      { label: '브랜드', value: '1,561개 (1천만 원 이상 집행)' },
      { label: '비교 기준', value: '연휴 주 vs 앞뒤 3주 중 연휴 없는 주 평균' },
      { label: '연휴 구분', value: '평일 연휴 1~2일 단기 · 3일 이상 장기 (장기 3회: 2025 설·2025 추석·2026 설)' },
      { label: '집계', value: '주간 합계 기준 증감률, 연휴별 결과는 기하평균' },
    ],
    findings: [
      { id: 'WR-001-F1', title: '장기 연휴엔 단가는 내려가고 반응은 오른다',
        summary: '시장 광고비가 16% 줄며 클릭·조회 단가가 내려갔고, 클릭률과 영상 완시청률은 올랐어요.',
        metrics: [{ label: '광고비', change: -16.23 }, { label: 'CPC', change: -10.63 }, { label: 'CPV', change: -17.39 }, { label: 'CTR', change: 5.92 }, { label: 'VTR', change: 14.59 }],
        insight: ['CPC 하락은 노출 단가 하락(49%)과 클릭 증가(51%)가 절반씩 만들었어요.', 'CPV 하락은 영상을 끝까지 본 사람이 늘어난 효과가 71%예요.'],
        condition: { holiday: 'long' }, strength: 'reference', action: '장기 연휴엔 반응이 오르는 매체의 비중을 지키세요.' },
      { id: 'WR-001-F2', title: '단기 연휴(1~2일)는 평시와 거의 같다',
        summary: '광고비와 단가, 반응 모두 평시 대비 5% 안쪽으로 움직였어요. 별도 운영이 필요하지 않아요.',
        metrics: [{ label: '광고비', change: -4.35 }, { label: 'CPM', change: -1.17 }, { label: 'CPC', change: -2.85 }, { label: 'CTR', change: 1.73 }, { label: 'VTR', change: 0.21 }],
        insight: ['단기 연휴는 평시 계획을 그대로 써도 됩니다.'],
        condition: { holiday: 'short' }, strength: 'reference', action: '평시 계획을 그대로 쓰세요.' },
      { id: 'WR-001-F3', title: '컴퓨터·IT기기는 증액할수록 클릭 단가가 올랐다',
        summary: '22개 중 16개 업종의 CPC가 내려갈 때 오히려 11% 올랐고, 장기 연휴 3번 모두 상승했어요.',
        metrics: [{ label: '광고비', change: 62 }, { label: 'CPC', change: 11 }, { label: 'CTR', change: 7 }],
        insight: ['경쟁이 몰리는 업종이라 증액 시 단가 관리가 필요하다는 신호예요.'],
        condition: { holiday: 'long', industry: ['컴퓨터및정보통신'] }, strength: 'direct', action: '증액할 때는 클릭 단가 상한부터 정하세요.' },
      { id: 'WR-001-F4', title: '교육은 효율이 좋아진 시기에 광고비를 절반 줄였다',
        summary: 'CPC가 37% 내리고 CTR이 47% 올랐지만, 같은 기간 광고비는 46% 줄었어요.',
        metrics: [{ label: '광고비', change: -46 }, { label: 'CPC', change: -37 }, { label: 'CTR', change: 47 }],
        insight: ['더 싸게, 더 많이 클릭되는 시기의 반응을 놓친 셈이에요.'],
        condition: { holiday: 'long', industry: ['교육및복지후생'] }, strength: 'direct', action: '연휴 기간 예산을 줄이지 말고 유지하세요.' },
      { id: 'WR-001-F5', title: '화장품은 기회가 더 컸던 장기 연휴에 광고비를 줄였다',
        summary: '단기 연휴엔 광고비를 유지했지만, CTR이 70% 오른 장기 연휴엔 광고비를 35% 줄였어요.',
        metrics: [{ label: '장기 광고비', change: -35 }, { label: '장기 CPC', change: -24 }, { label: '장기 CTR', change: 70 }, { label: '단기 광고비', change: 4 }],
        insight: ['단기 연휴는 광고비 유지, CPC 9% 하락. 장기 연휴의 반응 상승을 활용하지 못했어요.'],
        condition: { holiday: 'long', industry: ['화장품및보건용품'] }, strength: 'direct', action: '장기 연휴 구간의 예산을 지키세요.' },
      { id: 'WR-001-F6', title: '네이버 GFA, 단가는 가장 많이 내렸는데 광고비도 가장 많이 빠졌다',
        summary: '장기 연휴 CPC가 매체 중 가장 큰 폭으로 내렸고 VTR은 올랐지만, 광고비는 37% 줄었어요.',
        metrics: [{ label: '광고비', change: -36.7 }, { label: 'CPC', change: -26.6 }, { label: 'CPV', change: -34.6 }, { label: 'VTR', change: 16.9 }],
        insight: ['반응이 오르는 매체라 장기 연휴에는 비중을 지키는 편이 유리해요.'],
        condition: { holiday: 'long', media: [{ name: '네이버 GFA', minShare: 20 }] }, strength: 'direct', action: '네이버 GFA 비중을 유지하세요.' },
      { id: 'WR-001-F7', title: '메타, 반응은 평시 수준이고 단가는 고르게 내렸다',
        summary: 'CTR·VTR 변화는 1% 안팎이고, CPM·CPC·CPV가 16~17% 고르게 내려갔어요.',
        // 원문은 범위(16~17% 하락, ±1%)만 제시 — 임의 수치를 만들지 않는다
        metrics: [],
        insight: ['반응 개선보다 같은 광고비로 도달을 넓히는 데 적합해요.'],
        condition: { holiday: 'long', media: [{ name: '메타', minShare: 20 }] }, strength: 'reference', action: '메타는 도달 확장용으로 쓰세요.' },
    ],
    brandNote: '브랜드 단위로 보면, 장기 연휴에 CTR은 올랐는데 광고비를 줄인 "놓친 기회" 유형이 가장 많았어요. (70개 브랜드, 광고비 중앙값 -34%, CPC 중앙값 -14% · 유형 분류 가능한 185개 브랜드 기준)',
    playbook: [
      { title: '연휴 길이에 따라 광고비를 나눠 운영하세요', body: '단기 연휴는 평시와 큰 차이가 없지만, 장기 연휴는 단가와 반응이 크게 달라져요. 장기 연휴는 별도 광고비 계획으로 운영하세요.' },
      { title: '증액할 때는 단가 상한부터 정하세요', body: '경쟁이 몰리는 업종에서는 증액하면 단가가 오를 수 있어요(컴퓨터·IT CPC +11%). 목표 단가를 먼저 정하고 단계적으로 증액하세요.' },
      { title: '장기 연휴엔 반응이 오르는 매체의 비중을 지키세요', body: '장기 연휴엔 CPV가 17% 내려가요. 단가가 가장 많이 내려간 네이버 GFA에서 광고비가 가장 많이 빠졌어요. 반응이 오르는 매체의 비중은 유지하거나 늘리세요.' },
    ],
    excluded: '카카오(장기·단기)와 네이버 NOSP(장기)의 CPV·VTR은 변화율이 ±100%를 넘어 조회 집계가 불안정한 것으로 보고 해석에서 제외했어요.',
    next: { solution: 'DataShot', title: '평균은 봤으니, 이제 우리 업종의 기준선을 확인할 차례', body: '이 리포트는 22개 업종 전체 평균이에요. DataShot에서 우리 업종의 CPC·CPV·CTR 벤치마크를 바로 추출해 보세요.', href: '/datashot/new' },
  },

  // ───────── 이하 화면 검토용 가상 결과 (sample) ─────────
  {
    id: 'WR-002', theme: 'mix', series: 'Winning Report', issue: 'Vol.2', code: 'H31+H32', sample: true,
    title: '늘 쓰던 그 매체 조합, 정말 최선일까?', subtitle: '반복 집행 조합과 대안 조합의 효율 비교',
    publishedAt: '2026-10-21', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('최근 52주', '22개 업종 · 3개 이상 매체 집행 캠페인 2,140건'),
    findings: [
      { id: 'WR-002-F1', title: '상위 3개 조합이 전체 집행의 71%, 그중 절반은 업종 평균보다 비쌌다',
        summary: '같은 조합을 반복하는 캠페인의 52%가 업종 평균보다 CPM이 높았어요.',
        metrics: [{ label: '반복 조합 비중', change: 71 }, { label: 'CPM (업종 평균 대비)', change: 12 }],
        insight: ['익숙한 조합일수록 비교 없이 재사용되는 경향이 컸어요.'],
        condition: { minMediaCount: 3, budgetChange: 'keep' }, strength: 'reference', action: '현재 조합을 대안 조합 1개와 비교해 보세요.' },
      { id: 'WR-002-F2', title: '메타+유튜브 고정 조합은 중복 도달이 34%',
        summary: '두 매체를 함께 쓰는 캠페인은 같은 사람에게 겹쳐 노출된 비율이 다른 조합보다 1.6배 높았어요.',
        metrics: [{ label: '중복 도달', change: 34 }, { label: '순도달 증분', change: -9 }],
        insight: ['한쪽 비중을 줄이고 타겟이 덜 겹치는 매체로 옮기면 순도달이 늘어요.'],
        condition: { media: [{ name: '메타', minShare: 20 }, { name: '유튜브', minShare: 20 }] }, strength: 'direct', action: '메타·유튜브 중 한쪽 비중을 다른 매체로 옮겨 보세요.' },
    ],
  },
  {
    id: 'WR-003', theme: 'timing', series: 'Winning Report', issue: 'Vol.3', sample: true,
    title: '비 오는 날, 광고는 누구에게 더 잘 먹힐까?', subtitle: '강수일과 업종별 반응의 관계',
    publishedAt: '2026-10-07', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('최근 104주 · 기상청 일별 강수 데이터 결합', '22개 업종 · 수도권 타겟 캠페인'),
    findings: [
      { id: 'WR-003-F1', title: '비 오는 날, 배달·식품·커머스 CTR은 12% 오른다',
        summary: '강수량 5mm 이상인 날 실내 이용이 늘면서 배달·식품·온라인 커머스의 클릭률이 올랐어요.',
        metrics: [{ label: 'CTR', change: 12 }, { label: 'CVR', change: 8 }, { label: 'CPC', change: -4 }],
        insight: ['오후 6~10시 구간에서 효과가 가장 컸어요.'],
        condition: { industry: ['서비스', '식품', '유통'] }, strength: 'direct', action: '강수 예보일에 저녁 시간대 예산을 늘리는 규칙을 걸어 보세요.' },
      { id: 'WR-003-F2', title: '비 오는 날, 패션 CTR은 8% 내린다',
        summary: '외출 수요가 줄면서 의류·잡화 클릭률이 낮아졌어요. 실내복·우천 용품은 예외예요.',
        metrics: [{ label: 'CTR', change: -8 }, { label: 'CVR', change: -5 }],
        insight: ['강수일에는 실내 카테고리로 소재를 바꾸는 편이 나아요.'],
        condition: { industry: ['패션'] }, strength: 'direct', action: '강수일엔 실내 카테고리 소재로 바꿔 보세요.' },
    ],
  },
  {
    id: 'WR-004', theme: 'budget', series: 'Winning Report', issue: 'Vol.4', code: 'B-10+B-4', sample: true,
    title: '돈을 2배 쓰면, 2배 더 만날까?', subtitle: '예산 증액과 도달 증분의 수확체감',
    publishedAt: '2026-09-23', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('최근 52주', '증액 이력이 있는 캠페인 860건'),
    findings: [
      { id: 'WR-004-F1', title: '예산을 2배로 늘리면 도달은 1.38배',
        summary: '증액분의 62%만 새 사람에게 닿았고, 나머지는 이미 본 사람에게 다시 노출됐어요.',
        metrics: [{ label: '예산', change: 100 }, { label: '순도달', change: 38 }, { label: '평균 빈도', change: 45 }],
        insight: ['증액 전에 매체를 하나 더 추가하는 편이 도달 증분이 컸어요.'],
        condition: { budgetChange: 'increase' }, strength: 'direct', action: '증액분 일부를 새 매체에 배분해 보세요.' },
      { id: 'WR-004-F2', title: '체감은 총예산 5억 원 전후부터 시작된다',
        summary: '5억 원 미만에서는 예산과 도달이 거의 비례했지만, 그 이상에서 증분이 빠르게 줄었어요.',
        metrics: [{ label: '5억 미만 도달 탄력', change: 0.92 }, { label: '5억 이상 도달 탄력', change: 0.41 }],
        insight: ['큰 예산일수록 상품 다변화가 필요해요.'],
        condition: { minBudget: 5 }, strength: 'reference', action: '반응 곡선의 포화 지점을 먼저 확인해 보세요.' },
    ],
  },
  {
    id: 'WR-005', theme: 'inventory', series: 'Winning Report', issue: 'Vol.5', code: 'H22', sample: true,
    title: '오래 머무는 앱 vs 자주 들르는 앱', subtitle: '체류형 지면과 방문형 지면의 반응 차이',
    publishedAt: '2026-09-09', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('최근 52주', '4대 매체 + 유튜브·틱톡 지면별 성과'),
    findings: [
      { id: 'WR-005-F1', title: '체류형 지면은 끝까지 본다 — VTR 1.5배',
        summary: '유튜브·틱톡처럼 머무는 시간이 긴 지면은 영상 완시청률이 방문형 지면의 1.5배였어요.',
        metrics: [{ label: 'VTR', change: 52 }, { label: 'CPV', change: -18 }],
        insight: ['조회 KPI라면 체류형 지면 비중을 우선 확보하세요.'],
        condition: { kpi: ['조회'], media: [{ name: '유튜브', minShare: 30 }] }, strength: 'direct', action: '조회 목표라면 체류형 지면 비중을 지키세요.' },
      { id: 'WR-005-F2', title: '방문형 지면은 누른다 — CTR 1.4배',
        summary: '네이버 GFA·카카오처럼 자주 들르는 지면은 클릭률이 체류형 지면의 1.4배였어요.',
        metrics: [{ label: 'CTR', change: 40 }, { label: 'CPC', change: -15 }],
        insight: ['클릭 KPI라면 방문형 지면에 비중을 두세요.'],
        condition: { kpi: ['클릭'], media: [{ name: '네이버 GFA', minShare: 30 }] }, strength: 'direct', action: '클릭 목표라면 방문형 지면 비중을 높여 보세요.' },
    ],
  },
  {
    id: 'WR-006', theme: 'attribution', series: 'Winning Report', issue: 'Vol.6', code: 'F-8', sample: true, requiresActual: true,
    title: '매체 알고리즘이 바뀐 날, 데이터는 알고 있었다', subtitle: '알고리즘 변경 전후의 성과 변동',
    publishedAt: '2026-08-26', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('최근 104주 · 매체 공지 기준 변경일 14건', '4대 매체 집행 실적'),
    findings: [
      { id: 'WR-006-F1', title: '알고리즘 변경 주에 CPM은 9% 오르고, 2주 안에 돌아온다',
        summary: '변경 직후 학습 기간 동안 단가가 흔들렸다가 평균 11일 만에 이전 수준으로 돌아왔어요.',
        metrics: [{ label: 'CPM (변경 주)', change: 9 }, { label: 'CTR (변경 주)', change: -6 }],
        insight: ['변경 주의 성과를 캠페인 실패로 판단하지 마세요. 실측 데이터와 함께 봐야 해요.'],
        condition: {}, strength: 'reference', action: '변경 주 성과는 2주 뒤 다시 판단하세요.' },
    ],
  },
  {
    id: 'WR-007', theme: 'budget', series: 'Winning Report', issue: 'Vol.7', code: 'H41', sample: true,
    title: '앱이 커지면 예산 한도도 커져야 할까?', subtitle: '앱 규모와 일 예산 상한의 관계',
    publishedAt: '2026-08-12', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('최근 52주', '앱 설치 캠페인 420건'),
    findings: [
      { id: 'WR-007-F1', title: 'MAU 1천만 이상 앱은 예산 상한을 1.6배까지 올려도 CPI가 유지된다',
        summary: '사용자 풀이 큰 앱은 증액해도 설치 단가가 크게 오르지 않았어요. 작은 앱은 1.2배부터 올랐어요.',
        metrics: [{ label: '예산 상한', change: 60 }, { label: 'CPI', change: 3 }],
        insight: ['앱 규모에 따라 증액 한도를 다르게 두세요.'],
        condition: { industry: ['금융보험및증권', '서비스'], budgetChange: 'increase' }, strength: 'direct', action: '앱 규모에 맞춰 일 예산 상한을 다시 잡아 보세요.' },
    ],
  },
  {
    id: 'WR-008', theme: 'mix', series: 'Winning Report', issue: 'Vol.8', code: 'E-9', sample: true,
    title: '매체를 섞으면 왜 더 좋아질까? 시너지의 정체는 빈자리 채우기', subtitle: '다매체 조합의 도달 증분 분해',
    publishedAt: '2026-07-29', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('최근 52주', '도달 KPI 캠페인 1,320건'),
    findings: [
      { id: 'WR-008-F1', title: '3개 이상 매체를 쓰면 순도달이 11%p 오르고, 64%는 빈자리 채우기다',
        summary: '시너지의 대부분은 한 매체가 닿지 못한 사람을 다른 매체가 채운 데서 나왔어요.',
        metrics: [{ label: '순도달', change: 11 }, { label: '빈자리 기여', change: 64 }],
        insight: ['매체를 늘릴 땐 타겟 중복이 적은 매체를 고르세요.'],
        condition: { minMediaCount: 3, kpi: ['도달'] }, strength: 'direct', action: '중복이 적은 매체 조합인지 Reach Caster로 확인해 보세요.' },
    ],
  },
  {
    id: 'WR-009', theme: 'timing', series: 'Winning Report', issue: 'Vol.9', code: 'H01+H51', sample: true,
    title: '피크가 오기 전에 먼저 사야 할까?', subtitle: '시즌 피크 전 선집행의 단가 효과',
    publishedAt: '2026-07-15', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('최근 104주', '시즌성 캠페인 980건 (블랙프라이데이·연말·명절)'),
    findings: [
      { id: 'WR-009-F1', title: '피크 2주 전에 먼저 사면 CPM이 14% 낮다',
        summary: '경쟁이 몰리기 전에 인지 단계를 먼저 집행한 캠페인이 같은 예산으로 더 넓게 닿았어요.',
        metrics: [{ label: 'CPM', change: -14 }, { label: '피크 주 CTR', change: 9 }],
        insight: ['선집행으로 쌓은 인지가 피크 주 클릭률을 끌어올렸어요.'],
        condition: { season: ['블랙프라이데이', '연말'] }, strength: 'direct', action: '피크 2주 전에 인지 단계 예산을 먼저 배치해 보세요.' },
    ],
  },
  {
    id: 'WR-010', theme: 'attribution', series: 'Winning Report', issue: 'Vol.10', code: 'H97', sample: true, requiresActual: true,
    title: '잘 된 건 시장 덕일까, 운영 덕일까?', subtitle: '성과 변동의 시장 요인과 운영 요인 분리',
    publishedAt: '2026-07-01', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('최근 52주', '업종 평균 대비 성과가 ±20% 이상 벗어난 캠페인 310건'),
    findings: [
      { id: 'WR-010-F1', title: '성과 변동의 58%는 시장 흐름, 42%는 운영이 만들었다',
        summary: '업종 전체가 함께 오른 몫을 빼면, 운영으로 만든 성과는 생각보다 작았어요.',
        metrics: [{ label: '시장 요인', change: 58 }, { label: '운영 요인', change: 42 }],
        insight: ['성과를 평가할 땐 업종 평균과 함께 봐야 해요. 실측 데이터가 연결되면 시나리오별로 분리해 볼 수 있어요.'],
        condition: {}, strength: 'reference' },
    ],
  },
  {
    id: 'WR-011', theme: 'mix', series: 'Winning Report', issue: 'Vol.11', code: 'H94', sample: true,
    title: '빨리 크는 앱과 오래 가는 앱, 함께 쓰면?', subtitle: '성장형 매체와 유지형 매체의 조합 효과',
    publishedAt: '2026-06-17', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('최근 52주', '틱톡·메타 동시 집행 캠페인 270건'),
    findings: [
      { id: 'WR-011-F1', title: '틱톡으로 넓히고 메타로 붙잡으면 4주 차 재방문이 18% 높다',
        summary: '신규 유입은 틱톡, 재노출은 메타가 맡은 조합이 단일 매체보다 오래 남았어요.',
        metrics: [{ label: '4주 차 재방문', change: 18 }, { label: '신규 유입 단가', change: -11 }],
        insight: ['역할을 나눠 쓰면 두 매체를 따로 쓸 때보다 효율이 좋아요.'],
        condition: { media: [{ name: '틱톡', minShare: 15 }, { name: '메타', minShare: 20 }] }, strength: 'direct', action: '틱톡은 유입, 메타는 재노출로 역할을 나눠 보세요.' },
    ],
  },
  {
    id: 'WR-012', theme: 'budget', series: 'Winning Report', issue: 'Vol.12', code: 'H50', sample: true,
    title: '상품마다 최적화하면 전체도 최적일까?', subtitle: '상품별 최적화와 통합 최적화의 차이',
    publishedAt: '2026-06-03', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('최근 52주 · BudgetOpt 2.0 시뮬레이션 비교', '다상품 캠페인 540건'),
    findings: [
      { id: 'WR-012-F1', title: '상품별 최적화의 합은 통합 최적화보다 도달이 7% 적다',
        summary: '상품마다 따로 최적화하면 같은 사람을 여러 상품이 동시에 노리면서 낭비가 생겼어요.',
        metrics: [{ label: '도달 (통합 대비)', change: -7 }],
        insight: ['상품이 3개 이상이면 통합 배분으로 다시 계산해 보세요.'],
        condition: { minMediaCount: 3, kpi: ['도달'] }, strength: 'reference', action: 'BudgetOpt 2.0 통합 배분 결과와 비교해 보세요.' },
      { id: 'WR-012-F2', title: '예산 10억 원 이상에서는 차이가 12%까지 벌어진다',
        summary: '예산이 클수록 상품 간 중복이 커져, 통합 최적화의 이득도 커졌어요.',
        metrics: [{ label: '도달 (통합 대비, 10억 이상)', change: -12 }],
        insight: ['큰 예산일수록 통합 배분이 필수예요.'],
        condition: { minBudget: 10 }, strength: 'direct', action: '상품별 배분 대신 통합 배분으로 다시 산출해 보세요.' },
    ],
  },
  {
    id: 'WR-013', theme: 'timing', series: 'Winning Report', issue: 'Vol.13', sample: true,
    title: '월급날엔 광고도 지갑을 연다?', subtitle: '월급일 전후의 전환 반응',
    publishedAt: '2026-05-20', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('최근 104주', '커머스·패션·서비스 업종 클릭 KPI 캠페인'),
    findings: [
      { id: 'WR-013-F1', title: '25일 전후 3일, 커머스 전환율이 16% 오른다',
        summary: '월급일 직후 구매 전환이 몰렸고, 클릭 단가는 거의 오르지 않았어요.',
        metrics: [{ label: 'CVR', change: 16 }, { label: 'CPC', change: 2 }],
        insight: ['월급일 전후로 예산을 당기면 같은 예산으로 전환이 늘어요.'],
        condition: { payday: true, industry: ['유통', '패션', '서비스'], kpi: ['클릭'] }, strength: 'direct', action: '25일 전후 3일에 예산을 당겨 배치해 보세요.' },
    ],
  },
  {
    id: 'WR-014', theme: 'timing', series: 'Winning Report', issue: 'Vol.14', sample: true,
    title: '월드컵이 시작되면 광고는 어디로 가야 할까?', subtitle: '대형 스포츠 이벤트와 지면 단가',
    publishedAt: '2026-05-06', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('2022 카타르 월드컵 기간 ±4주', '4대 매체 + 유튜브 지면별 성과'),
    findings: [
      { id: 'WR-014-F1', title: '스포츠 지면 CPM은 27% 오르고, 비스포츠 지면은 6% 내린다',
        summary: '광고비가 스포츠 지면으로 몰리면서 그 밖의 지면은 오히려 저렴해졌어요.',
        metrics: [{ label: '스포츠 지면 CPM', change: 27 }, { label: '비스포츠 지면 CPM', change: -6 }],
        insight: ['스포츠와 무관한 브랜드라면 비스포츠 지면이 기회예요.'],
        condition: { season: ['2030 월드컵'] }, strength: 'direct', action: '이벤트 기간엔 비스포츠 지면으로 옮겨 보세요.' },
    ],
  },
  {
    id: 'WR-015', theme: 'timing', series: 'Winning Report', issue: 'Vol.15', sample: true,
    title: '신상품 광고, 먼저 탄 사람이 이득일까?', subtitle: '출시 직후 집행 시점과 장기 효과',
    publishedAt: '2026-04-22', publisher: AX, audienceLevel: 'public',
    method: sampleMethod('최근 104주', '신상품 출시 캠페인 390건'),
    findings: [
      { id: 'WR-015-F1', title: '출시 첫 2주에 집행한 브랜드는 3개월 뒤 검색량이 1.9배',
        summary: '출시 직후 인지를 먼저 잡은 브랜드가 이후 같은 예산으로 더 오래 검색됐어요.',
        metrics: [{ label: '3개월 뒤 검색량', change: 90 }, { label: '출시 주 CPM', change: 8 }],
        insight: ['출시 주 단가가 조금 높아도, 장기 효과가 이를 넘어섰어요.'],
        condition: { launch: true }, strength: 'direct', action: '출시 첫 2주에 예산을 앞당겨 배치해 보세요.' },
    ],
  },
]

export const FINDINGS: Finding[] = REPORTS.flatMap(r => r.findings)
export const reportOf = (findingId: string) => REPORTS.find(r => r.findings.some(f => f.id === findingId))!

// ─────────────────────────────────────────────
// 매체 소식 — 라이브러리와 SpinX 근거로만 쓴다 (인사이트 맵에는 넣지 않는다)
// ─────────────────────────────────────────────
export const NEWS: MediaNews[] = [
  { id: 'MN-1115', media: '네이버 GFA', title: '네이버 GFA, 홈피드 지면 확대', summary: '11월 20일부터 홈피드 노출 지면이 늘어 도달 가능 인벤토리가 커져요.', publishedAt: '2026-11-04', effectiveFrom: '2026-11-20', source: '네이버 공식 공지', audienceLevel: 'public',
    body: '홈피드 내 광고 노출 지면이 확대됨. 도달 KPI 캠페인은 GFA 비중을 높였을 때 단가 하락 효과를 기대할 수 있음.' },
  { id: 'MN-1107', media: '메타', title: '메타, 릴스 광고 최소 입찰 단가 조정', summary: '11월 18일부터 릴스 지면 최소 입찰 단가가 올라요.', publishedAt: '2026-11-03', effectiveFrom: '2026-11-18', source: '메타 공식 공지', audienceLevel: 'public',
    body: '릴스 지면의 최소 입찰 단가가 상향 조정됨. 저단가 입찰 비중이 높은 캠페인은 노출량 감소 가능성이 있어 입찰 전략 점검이 필요함.' },
  { id: 'MN-1104', media: '네이버 GFA', title: '네이버 GFA, 12월 집행분 추가 리베이트', summary: '12월 집행분 대상, 구간별 추가 리베이트가 적용돼요.', publishedAt: '2026-11-02', effectiveFrom: '2026-12-01', effectiveTo: '2026-12-31', source: '사내 기간계 · 매체 프로모션', audienceLevel: 'internal',
    body: '12월 집행분에 한해 구간별 추가 리베이트가 적용됨. 세부 조건은 매체 담당자 확인 후 제안에 반영 필요.' },
  { id: 'MN-1098', media: '카카오', title: '카카오 비즈보드, 확장형 신상품 출시', summary: '탭하면 영역이 확장되는 신규 상품으로, 브랜드 인지 캠페인 대상이에요.', publishedAt: '2026-10-30', effectiveFrom: '2026-11-10', source: '카카오 공식 공지', audienceLevel: 'public',
    body: '탭 시 영역이 확장되는 비즈보드 신상품이 출시됨. 브랜드 인지 목적 캠페인에 우선 적용 가능.' },
]

// ─────────────────────────────────────────────
// Slot · 시나리오 (예산·증액 여부는 BO 입력값)
// ─────────────────────────────────────────────
export const GROUND_SLOTS: GroundSlot[] = [
  { id: 'SLT001', title: '삼성 갤럭시 S24 캠페인', advertiser: '삼성전자' },
  { id: 'SLT002', title: 'LG 올레드 TV 런칭 캠페인', advertiser: 'LG전자' },
  { id: 'SLT003', title: '현대 아이오닉 6 마케팅', advertiser: '현대자동차' },
  { id: 'SLT004', title: '네이버 쇼핑 연말 프로모션', advertiser: '네이버' },
  { id: 'SLT013', title: '아모레퍼시픽 시즌 기획전', advertiser: '아모레퍼시픽' },
  { id: 'SLT022', title: '메가스터디 수강신청 캠페인', advertiser: '메가스터디' },
  { id: 'SLT030', title: '하이트진로 2030 캠페인', advertiser: '하이트진로' },
  { id: 'SLT040', title: '배달의민족 겨울 프로모션', advertiser: '우아한형제들' },
  { id: 'SLT041', title: '토스 연말 앱 설치 캠페인', advertiser: '비바리퍼블리카' },
  { id: 'SLT042', title: '무신사 봄 신상품 런칭', advertiser: '무신사' },
]

export const SCENARIOS: Scenario[] = [
  { id: 'S-201', slotId: 'SLT001', solution: 'BudgetOpt 2.0', name: '갤럭시 2027 추석 프로모션 배분안', industry: '컴퓨터및정보통신', start: '2027-09-01', end: '2027-09-30', kpi: '클릭', budget: 8, budgetChange: 'increase', launch: true,
    mediaMix: [{ media: '메타', share: 40 }, { media: '구글', share: 35 }, { media: '네이버 GFA', share: 25 }], summary: '예상 클릭 52만' },
  { id: 'S-202', slotId: 'SLT013', solution: 'Reach Caster', name: '추석 기획전 도달 분석', industry: '화장품및보건용품', start: '2027-09-06', end: '2027-09-26', kpi: '도달', budget: 3, budgetChange: 'keep',
    mediaMix: [{ media: '메타', share: 45 }, { media: '네이버 GFA', share: 35 }, { media: '카카오', share: 20 }], summary: '순도달 38.6%' },
  { id: 'S-203', slotId: 'SLT022', solution: 'BudgetOpt 2.0', name: '추석 연휴 수강신청 배분안', industry: '교육및복지후생', start: '2027-09-08', end: '2027-09-24', kpi: '클릭', budget: 2, budgetChange: 'decrease',
    mediaMix: [{ media: '구글', share: 45 }, { media: '네이버 GFA', share: 40 }, { media: '카카오', share: 15 }], summary: '예상 클릭 18만' },
  { id: 'S-204', slotId: 'SLT002', solution: 'BudgetOpt 2.0', name: '올레드 2027 설 시즌 배분안', industry: '가정용전기전자', start: '2027-01-25', end: '2027-02-14', kpi: '도달', budget: 6, budgetChange: 'keep', launch: true,
    mediaMix: [{ media: '유튜브', share: 45 }, { media: '메타', share: 30 }, { media: '네이버 GFA', share: 25 }], summary: '예상 도달 1,860만' },
  { id: 'S-205', slotId: 'SLT013', solution: 'BudgetOpt 2.0', name: '설 선물세트 클릭 배분안', industry: '화장품및보건용품', start: '2027-01-20', end: '2027-02-10', kpi: '클릭', budget: 2.5, budgetChange: 'increase',
    mediaMix: [{ media: '네이버 GFA', share: 50 }, { media: '메타', share: 30 }, { media: '카카오', share: 20 }], summary: '예상 클릭 31만' },
  { id: 'S-206', slotId: 'SLT004', solution: 'BudgetOpt 2.0', name: '연말 프로모션 클릭 최적화안', industry: '유통', start: '2026-11-15', end: '2026-12-31', kpi: '클릭', budget: 12, budgetChange: 'increase',
    mediaMix: [{ media: '네이버 GFA', share: 52 }, { media: '카카오', share: 31 }, { media: '메타', share: 17 }], summary: '예상 클릭 46만' },
  { id: 'S-207', slotId: 'SLT030', solution: 'BudgetOpt 2.0', name: '2030 연말 조회 배분안', industry: '음료및기호식품', start: '2026-12-01', end: '2026-12-31', kpi: '조회', budget: 1, budgetChange: 'keep',
    mediaMix: [{ media: '유튜브', share: 45 }, { media: '틱톡', share: 35 }, { media: '메타', share: 20 }], summary: '예상 완시청 640만' },
  { id: 'S-208', slotId: 'SLT003', solution: 'Reach Caster', name: '아이오닉 6 4분기 도달 예측', industry: '수송기기', start: '2026-10-01', end: '2026-12-31', kpi: '도달', budget: 15, budgetChange: 'keep',
    mediaMix: [{ media: '유튜브', share: 40 }, { media: '네이버 GFA', share: 35 }, { media: '카카오', share: 25 }], summary: '순도달 41.2%' },
  { id: 'S-209', slotId: 'SLT040', solution: 'BudgetOpt 2.0', name: '겨울 배달 프로모션 배분안', industry: '서비스', start: '2026-12-01', end: '2027-02-28', kpi: '클릭', budget: 4, budgetChange: 'increase',
    mediaMix: [{ media: '메타', share: 50 }, { media: '구글', share: 30 }, { media: '카카오', share: 20 }], summary: '예상 클릭 88만' },
  { id: 'S-210', slotId: 'SLT041', solution: 'BudgetOpt 2.0', name: '연말 앱 설치 배분안', industry: '금융보험및증권', start: '2026-11-20', end: '2026-12-31', kpi: '클릭', budget: 5, budgetChange: 'increase',
    mediaMix: [{ media: '메타', share: 45 }, { media: '구글', share: 40 }, { media: '틱톡', share: 15 }], summary: '예상 설치 21만' },
  { id: 'S-211', slotId: 'SLT042', solution: 'Reach Caster', name: '봄 신상품 런칭 도달 분석', industry: '패션', start: '2027-03-01', end: '2027-03-31', kpi: '도달', budget: 3, budgetChange: 'keep', launch: true,
    mediaMix: [{ media: '메타', share: 55 }, { media: '유튜브', share: 25 }, { media: '틱톡', share: 20 }], summary: '순도달 33.4%' },
]

// ─────────────────────────────────────────────
// 권한 · 조회
// ─────────────────────────────────────────────
export const canView = (level: 'public' | 'internal', viewer: Viewer) => !(level === 'internal' && viewer !== 'internal')
export const visibleReports = (viewer: Viewer) => REPORTS.filter(r => canView(r.audienceLevel, viewer))
export const visibleNews = (viewer: Viewer) => NEWS.filter(n => canView(n.audienceLevel, viewer))
export const findFinding = (id: string) => FINDINGS.find(f => f.id === id)
export const findNews = (id: string) => NEWS.find(n => n.id === id)
export const findScenario = (id: string) => SCENARIOS.find(s => s.id === id)
export const findSlot = (id: string) => GROUND_SLOTS.find(s => s.id === id)
export const findReport = (id: string) => REPORTS.find(r => r.id === id)

// ─────────────────────────────────────────────
// 연결 엔진 — 적힌 조건을 모두 만족할 때만, 이유와 함께
// ─────────────────────────────────────────────
export function linkFinding(f: Finding, s: Scenario): Link | null {
  if (reportOf(f.id).requiresActual) return null // 실측 연결 전에는 시나리오와 잇지 않는다
  const c: FindingCondition = f.condition
  const reasons: string[] = []

  if (c.holiday) {
    const h = HOLIDAYS.find(x => x.type === c.holiday && overlaps(s.start, s.end, x.start, x.end))
    if (!h) return null
    reasons.push(`기간에 ${h.name} 포함 (평일 ${h.weekdayOff}일 · ${h.type === 'long' ? '장기' : '단기'})`)
  }
  if (c.season) {
    const name = c.season.find(n => SEASONS[n] && overlaps(s.start, s.end, ...SEASONS[n]))
    if (!name) return null
    reasons.push(`기간에 ${name} 포함`)
  }
  if (c.payday) {
    if (!coversPayday(s)) return null
    reasons.push('기간에 월급일(25일) 포함')
  }
  if (c.industry) {
    if (!c.industry.includes(s.industry)) return null
    reasons.push(`업종 ${s.industry}`)
  }
  if (c.media) {
    for (const m of c.media) {
      const share = s.mediaMix.find(x => x.media === m.name)?.share ?? 0
      if (share < m.minShare) return null
      reasons.push(`${m.name} ${share}%`)
    }
  }
  if (c.kpi) {
    if (!c.kpi.includes(s.kpi)) return null
    reasons.push(`KPI ${s.kpi}`)
  }
  if (c.budgetChange) {
    if (s.budgetChange !== c.budgetChange) return null
    reasons.push(c.budgetChange === 'increase' ? '예산 증액' : c.budgetChange === 'decrease' ? '예산 감액' : '직전과 같은 예산 · 조합')
  }
  if (c.minBudget !== undefined) {
    if (s.budget < c.minBudget) return null
    reasons.push(`총예산 ${s.budget}억`)
  }
  if (c.minMediaCount !== undefined) {
    if (s.mediaMix.length < c.minMediaCount) return null
    reasons.push(`매체 ${s.mediaMix.length}개 조합`)
  }
  if (c.launch) {
    if (!s.launch) return null
    reasons.push('신상품 출시 캠페인')
  }
  if (reasons.length === 0) return null
  return { sourceId: f.id, sourceType: 'finding', scenarioId: s.id, strength: f.strength, reasons }
}

const NEWS_RELEVANCE_DAYS = 90
export function linkNews(n: MediaNews, s: Scenario): Link | null {
  const share = s.mediaMix.find(m => m.media === n.media)?.share ?? 0
  if (share < 20) return null
  const until = n.effectiveTo ?? new Date(t(n.effectiveFrom) + NEWS_RELEVANCE_DAYS * 86_400_000).toISOString().slice(0, 10)
  if (!overlaps(s.start, s.end, n.effectiveFrom, until)) return null
  return {
    sourceId: n.id, sourceType: 'news', scenarioId: s.id, strength: share >= 40 ? 'direct' : 'reference',
    reasons: [`${n.media} ${share}%`, n.effectiveTo ? `${fmtMD(n.effectiveFrom)}–${fmtMD(n.effectiveTo)} 적용 구간과 겹침` : `${fmtMD(n.effectiveFrom)} 적용 이후 집행 포함`],
  }
}

/** 인사이트 맵용 — 발견 ↔ 시나리오만 (매체 소식 제외) */
export function findingLinks(viewer: Viewer): Link[] {
  const scenarios = SCENARIOS.filter(isActive)
  const out: Link[] = []
  visibleReports(viewer).forEach(r => r.findings.forEach(f => scenarios.forEach(s => { const l = linkFinding(f, s); if (l) out.push(l) })))
  return out
}
export function newsLinks(viewer: Viewer): Link[] {
  const out: Link[] = []
  SCENARIOS.filter(isActive).forEach(s => visibleNews(viewer).forEach(n => { const l = linkNews(n, s); if (l) out.push(l) }))
  return out
}
export const allLinks = (viewer: Viewer) => [...findingLinks(viewer), ...newsLinks(viewer)]
export const linksForSource = (id: string, viewer: Viewer) => allLinks(viewer).filter(l => l.sourceId === id)
export const linksForScenario = (id: string, viewer: Viewer) => allLinks(viewer).filter(l => l.scenarioId === id)

// ─────────────────────────────────────────────
// SpinX 해석 — 리포트를 특정 시나리오에 대입 (리포트 결론과 분리)
// ─────────────────────────────────────────────
export function interpretReport(report: Report, scenarioId: string) {
  const s = findScenario(scenarioId)
  if (!s) return null
  if (report.requiresActual) {
    return { applicable: false, text: `이 리포트는 실제 집행 결과와 함께 봐야 해요. 매체 실측이 연결되면 ${s.name}의 성과를 시장 요인과 운영 요인으로 나눠 볼 수 있어요.` }
  }
  const links = report.findings.map(f => ({ f, l: linkFinding(f, s) })).filter(x => x.l)
  if (links.length === 0) {
    return { applicable: false, text: `${s.name}은 이 리포트의 적용 조건(기간·업종·매체·예산)에 해당하지 않아요. 참고 자료로만 보는 게 맞아요.` }
  }
  const direct = links.filter(x => x.f.strength === 'direct')
  const lead = (direct[0] ?? links[0]).f
  const head = direct.length
    ? `${s.name}에 바로 해당하는 발견이 ${direct.length}건 있어요. 가장 중요한 건 "${lead.title}"예요.`
    : `${s.name}에는 업종·매체가 맞는 발견은 없고, 전체 경향인 "${lead.title}"만 해당돼요.`
  return { applicable: true, text: `${head} ${lead.action ?? ''}`.trim() }
}

// ─────────────────────────────────────────────
// 전역 SpinX
// ─────────────────────────────────────────────
export const SUGGESTED_QUESTIONS = [
  '추석 연휴에 광고비를 줄여야 할까?',
  '갤럭시 2027 추석 프로모션, 연휴에 증액해도 괜찮을까?',
  '연말 앱 설치 캠페인, 예산을 더 늘려도 될까?',
  '설 시즌 캠페인도 연휴 예산을 따로 짜야 해?',
  '이번 달 매체 소식 중 챙겨야 할 거 있어?',
]

interface Scripted { match: RegExp; build: (viewer: Viewer) => GroundAnswer }

const SCRIPTED: Scripted[] = [
  {
    // 실행이 필요한 요청 — 답이 아니라 솔루션을 돌려야 한다. 에이전트 플로우의 입구
    match: /만들어줘|다시 계산|계산해줘|짜줘|돌려줘|보여줘$/,
    build: () => ({
      verdict: '이건 솔루션을 실제로 돌려야 하는 요청이에요. 아래 단계로 실행하면 돼요.',
      paragraphs: [
        '실행 순서는 이래요. 근거가 된 발견을 조건으로 걸고 → BudgetOpt 2.0으로 배분을 다시 산출하고 → Reach Caster로 도달을 확인해요. 앞선 답에서 쓴 근거는 그대로 이어받아요 [1].',
        '에이전트 플로우가 열리면 이 단계를 한 번에 실행하고, 대화에서 "플로우로 저장"해 다음에도 쓸 수 있어요. 지금은 BudgetOpt 2.0에서 직접 시나리오를 만들어 주세요.',
      ],
      citations: [{ type: 'finding', id: 'WR-004-F1' }],
      followUps: ['이 조건으로 BudgetOpt 2.0 시나리오를 만들려면 뭘 넣어야 해?', '증액하면 도달이 얼마나 늘어?'],
    }),
  },
  {
    match: /앱 설치|토스|예산을 더|늘려도/,
    build: () => ({
      verdict: '늘려도 돼요. 단, 증액분 일부는 새 매체로 나누고 일 예산 상한을 앱 규모에 맞추세요.',
      paragraphs: [
        '예산을 2배로 늘린 캠페인은 도달이 1.38배에 그쳤어요. 증액분의 38%는 이미 본 사람에게 다시 노출됐거든요 [1].',
        '다만 사용자 풀이 큰 앱은 예산 상한을 1.6배까지 올려도 설치 단가가 거의 오르지 않았어요 [2]. 연말 앱 설치 배분안은 금융 업종에 증액 계획이라 이 패턴에 해당해요 [3].',
        '배분안에 틱톡 15%와 메타 45%가 함께 들어 있어요. 틱톡은 유입, 메타는 재노출로 역할을 나누면 4주 차 재방문이 18% 높았어요 [4].',
      ],
      citations: [{ type: 'finding', id: 'WR-004-F1' }, { type: 'finding', id: 'WR-007-F1' }, { type: 'scenario', id: 'S-210' }, { type: 'finding', id: 'WR-011-F1' }],
      followUps: ['증액분을 새 매체에 나눈 배분안 만들어줘', '틱톡·메타 역할을 나눈 버전으로 다시 계산해줘'],
    }),
  },
  {
    match: /증액|갤럭시|IT/,
    build: () => ({
      verdict: '증액은 하되, 클릭 단가 상한부터 정하세요. 컴퓨터·IT 업종은 장기 연휴에 증액할수록 CPC가 올랐어요.',
      paragraphs: [
        '장기 연휴엔 22개 업종 중 16곳의 CPC가 내려갔지만, 컴퓨터·IT기기는 광고비를 62% 늘리면서 CPC가 오히려 11% 올랐어요 [1].',
        '갤럭시 2027 추석 프로모션 배분안은 기간에 2027 추석(평일 3일, 장기)이 들어 있고 증액 계획이라 이 패턴에 그대로 해당해요 [2]. 2027년 연휴 일정은 확정 전 가정값이에요.',
        '신상품 출시 캠페인이기도 해서, 출시 첫 2주에 먼저 집행하면 3개월 뒤 검색량이 1.9배였다는 분석도 함께 볼 만해요 [3].',
      ],
      citations: [{ type: 'finding', id: 'WR-001-F3' }, { type: 'scenario', id: 'S-201' }, { type: 'finding', id: 'WR-015-F1' }],
      followUps: ['CPC 상한을 두고 단계 증액한 배분안 만들어줘', '컴퓨터및정보통신 업종 CPC 벤치마크 보여줘'],
    }),
  },
  {
    match: /설/,
    build: () => ({
      verdict: '2027 설은 단기 연휴라 따로 짤 필요가 없어요. 평시 계획을 그대로 쓰면 돼요.',
      paragraphs: [
        '단기 연휴(평일 1~2일)는 광고비와 단가, 반응이 모두 평시 대비 5% 안쪽으로 움직였어요 [1].',
        '2027 설은 평일 연휴가 2일이라 단기예요. 올레드 2027 설 시즌 배분안 [2]과 설 선물세트 클릭 배분안 [3] 모두 평시 기준으로 운영해도 돼요. 연휴 일정은 확정 전 가정값이에요.',
        '장기 연휴는 다르게 봐야 해요. 2027 추석은 평일 3일로 장기라, 그때는 별도 예산 계획을 권해요 [4].',
      ],
      citations: [{ type: 'finding', id: 'WR-001-F2' }, { type: 'scenario', id: 'S-204' }, { type: 'scenario', id: 'S-205' }, { type: 'finding', id: 'WR-001-F1' }],
      followUps: ['2027 추석 시나리오 중 연휴 예산을 따로 봐야 할 건 뭐야?', '장기 연휴 때 매체별로 어떻게 달라져?'],
    }),
  },
  {
    match: /매체 소식|이번 달|챙/,
    build: (viewer) => viewer === 'internal'
      ? {
        verdict: '연말 프로모션 클릭 최적화안은 네이버 GFA 12월 리베이트부터 반영하세요.',
        paragraphs: [
          '네이버 GFA는 12월 집행분에 구간별 추가 리베이트가 붙어요 [1]. 연말 프로모션 클릭 최적화안은 GFA 비중이 52%라 효과가 가장 커요 [2].',
          '같은 GFA는 11월 20일부터 홈피드 지면도 넓어져요 [3]. 아이오닉 6 4분기 도달 예측처럼 도달 KPI라면 GFA 비중을 조금 늘려볼 만해요 [4].',
        ],
        citations: [{ type: 'news', id: 'MN-1104' }, { type: 'scenario', id: 'S-206' }, { type: 'news', id: 'MN-1115' }, { type: 'scenario', id: 'S-208' }],
        followUps: ['리베이트 조건을 반영한 배분안 만들어줘', 'GFA 비중을 늘리면 도달이 얼마나 늘어?'],
      }
      : {
        verdict: '네이버 GFA 홈피드 지면 확대가 지금 시나리오에 가장 직접적이에요.',
        paragraphs: [
          '11월 20일부터 GFA 홈피드 지면이 넓어져요 [1]. 연말 프로모션 클릭 최적화안(GFA 52%) [2]과 아이오닉 6 4분기 도달 예측(GFA 35%) [3]이 적용 기간에 걸려 있어요.',
          '카카오 비즈보드 확장형도 11월 10일부터 열렸어요. 브랜드 인지 목적이라면 대체 지면으로 볼 만해요 [4].',
        ],
        citations: [{ type: 'news', id: 'MN-1115' }, { type: 'scenario', id: 'S-206' }, { type: 'scenario', id: 'S-208' }, { type: 'news', id: 'MN-1098' }],
        followUps: ['GFA 비중을 늘린 배분안 만들어줘', '비즈보드 확장형을 넣으면 도달이 어떻게 돼?'],
      },
  },
  {
    match: /연휴|추석|줄여/,
    build: () => ({
      verdict: '장기 연휴라면 줄이지 마세요. 단가는 내려가고 반응은 올라서, 줄이면 기회를 놓쳐요.',
      paragraphs: [
        '장기 연휴엔 시장 광고비가 16% 줄면서 CPC는 10.6%, CPV는 17.4% 내려갔고, CTR은 5.9%, VTR은 14.6% 올랐어요 [1].',
        '네이버 GFA는 CPC가 26.6% 내려 매체 중 가장 저렴해졌는데, 광고비는 오히려 37% 빠졌어요 [2]. 반응이 오르는 매체의 비중은 지키는 게 좋아요.',
        '2027 추석(평일 3일, 장기)에 걸린 시나리오 중 추석 기획전 도달 분석은 GFA 35%, 추석 연휴 수강신청 배분안은 GFA 40%라 이 패턴에 바로 해당해요 [3][4]. 연휴 일정은 확정 전 가정값이에요.',
      ],
      citations: [{ type: 'finding', id: 'WR-001-F1' }, { type: 'finding', id: 'WR-001-F6' }, { type: 'scenario', id: 'S-202' }, { type: 'scenario', id: 'S-203' }],
      followUps: ['추석 연휴 수강신청 배분안, GFA 비중 유지한 버전 만들어줘', '우리 업종 연휴 CPC 벤치마크 보여줘'],
    }),
  },
]

/** 시나리오에 없는 질문 — 라이브러리 전체에서 제목·요약 단어로 근거를 찾아 답한다 */
function fallback(question: string, viewer: Viewer): GroundAnswer {
  const words = question.replace(/[?.,!]/g, ' ').split(/\s+/).filter(w => w.length >= 2)
  const scored = visibleReports(viewer).flatMap(r => r.findings.map(f => ({ r, f })))
    .map(x => ({ ...x, score: words.reduce((n, w) => ([x.r.title, x.f.title, x.f.summary].join(' ').includes(w) ? n + 1 : n), 0) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
  if (scored.length === 0) {
    return {
      verdict: '이 질문에 바로 쓸 수 있는 근거를 라이브러리에서 찾지 못했어요.',
      paragraphs: ['업종, 기간(연휴·시즌), 매체, 예산, KPI 중 하나를 넣어 다시 물어보면 관련 리포트와 시나리오를 찾아볼게요.'],
      citations: [], followUps: SUGGESTED_QUESTIONS.slice(0, 2),
    }
  }
  return {
    verdict: scored[0].f.summary,
    paragraphs: scored.map((x, i) => `${x.r.title} — ${x.f.title} [${i + 1}].`),
    citations: scored.map(x => ({ type: 'finding', id: x.f.id }) as CitationRef),
    followUps: SUGGESTED_QUESTIONS.slice(0, 2),
  }
}

export function answerQuestion(question: string, viewer: Viewer): GroundAnswer {
  const hit = SCRIPTED.find(s => s.match.test(question))
  const answer = hit ? hit.build(viewer) : fallback(question, viewer)
  const safe = answer.citations.every(c => c.type !== 'news' || canView(findNews(c.id)!.audienceLevel, viewer))
  return safe ? answer : fallback(question, viewer)
}

export function scope(viewer: Viewer) {
  return {
    reports: visibleReports(viewer).length,
    findings: visibleReports(viewer).reduce((n, r) => n + r.findings.length, 0),
    news: visibleNews(viewer).length,
    scenarios: SCENARIOS.filter(isActive).length,
  }
}
