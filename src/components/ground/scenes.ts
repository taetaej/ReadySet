// scenes.ts — WithSet 대표 장면 3 (캠페인 하나: 갤럭시 2027 추석 프로모션)
// 1 진단(Phase 1) → 2 제안(Phase 2) → 3 실측 비교(Phase 3) → 다시 지식으로

export interface Scene {
  no: string
  title: string
  question: string
  value: string
  uses: string[]
  phase: string
}

export const SCENES: Scene[] = [
  { no: '01', title: '분석 리포트로 시나리오 진단', question: '갤럭시 2027 추석 프로모션, 연휴에 증액해도 괜찮을까?', value: '렙사 분석이 내 시나리오의 근거가 돼요', uses: ['Library', 'SpinX'], phase: 'Phase 1' },
  { no: '02', title: '제안셋 만들기', question: '이 근거로 갤럭시 추석 광고주 제안셋 만들어줘', value: '솔루션 3개가 요청 하나로 이어져요', uses: ['Skills', 'Workflows', 'Artifacts'], phase: 'Phase 2' },
  { no: '03', title: '실측 성과와 비교', question: '작년 추석 갤럭시 집행 성과랑 이 시나리오 비교해줘', value: '예측과 실측의 차이가 다시 지식으로 쌓여요', uses: ['Tools · 매체 MCP', 'Library'], phase: 'Phase 3' },
]
