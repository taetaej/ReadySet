// flowData.ts — 워크플로우 더미 데이터 (컨셉 목업)
// 만드는 입구는 대화(SpinX에게 맡기기). 캔버스는 확인 · 수정용
// 노드 종류: 시작(스케줄·이벤트·수동) → 솔루션(시나리오 생성·호출) · 지식(라이브러리 검색) → LLM(SpinX) → 출력
// 실행 결과는 그럴싸한 예시 값이다.

export type FlowNodeKind = 'schedule' | 'event' | 'manual' | 'scenarioCreate' | 'scenarioRun' | 'library' | 'llm' | 'output'

export interface FlowNode {
  id: string
  kind: FlowNodeKind
  title: string
  sub: string
  x: number
  y: number
  /** 인스펙터에 보여줄 설정 */
  config: { k: string; v: string }[]
  /** 마지막 실행 결과 한 줄 */
  result?: string
  ms?: number
}
export interface FlowEdge { from: string; to: string }
export type RunStatus = 'success' | 'running' | 'failed' | 'paused'
export interface FlowRun { id: string; at: string; status: RunStatus; duration: string; summary: string }
export interface FlowOutput {
  title: string
  conclusion: string
  body: string[]
  cites: { id: string; label: string }[]
  next?: { label: string; to: string }
}
export interface Flow {
  id: string
  name: string
  desc: string
  trigger: string
  owner: string
  status: 'on' | 'off'
  nodes: FlowNode[]
  edges: FlowEdge[]
  runs: FlowRun[]
  output?: FlowOutput
}

export const NODE_META: Record<FlowNodeKind, { label: string; group: string }> = {
  schedule: { label: '스케줄', group: '시작' },
  event: { label: '이벤트', group: '시작' },
  manual: { label: '직접 실행', group: '시작' },
  scenarioCreate: { label: '시나리오 생성', group: '솔루션' },
  scenarioRun: { label: '시나리오 호출', group: '솔루션' },
  library: { label: '라이브러리 검색', group: '지식' },
  llm: { label: 'LLM', group: 'AI' },
  output: { label: '출력', group: '끝' },
}

/** 팔레트 순서 */
export const PALETTE: FlowNodeKind[] = ['schedule', 'event', 'manual', 'scenarioCreate', 'scenarioRun', 'library', 'llm', 'output']

export const NODE_DEFAULT: Record<FlowNodeKind, Pick<FlowNode, 'title' | 'sub' | 'config'>> = {
  schedule: { title: '매주 월요일 09:00', sub: '정해진 시간에 시작', config: [{ k: '반복', v: '매주 월요일' }, { k: '시간', v: '09:00' }] },
  event: { title: '새 분석 리포트가 들어오면', sub: '라이브러리 이벤트', config: [{ k: '이벤트', v: '분석 리포트 등록' }] },
  manual: { title: '직접 실행', sub: '입력값을 받아 시작', config: [{ k: '입력', v: '업종 · 기간 · 예산 · KPI' }] },
  scenarioCreate: { title: 'BudgetOpt 2.0 시나리오 생성', sub: '입력값으로 새 시나리오', config: [{ k: '솔루션', v: 'BudgetOpt 2.0' }, { k: 'KPI', v: '앞 노드에서 받기' }] },
  scenarioRun: { title: '시나리오 다시 계산', sub: '저장된 시나리오를 최신 데이터로', config: [{ k: '시나리오', v: '선택하세요' }] },
  library: { title: '관련 리포트 · 소식 찾기', sub: '시나리오 기간 · 업종 기준', config: [{ k: '찾는 것', v: '분석 리포트 · 매체 소식' }, { k: '기준', v: '앞 노드의 시나리오 조건' }] },
  llm: { title: 'SpinX로 정리', sub: '지시문 또는 Skill', config: [{ k: '지시문', v: '앞 결과를 요약해줘' }, { k: 'Skill', v: '없음' }] },
  output: { title: '알림 보내기', sub: '결과를 전달', config: [{ k: '받는 곳', v: '나 · Ground 알림' }] },
}

export const FLOWS: Flow[] = [
  {
    id: 'FL-01',
    name: '매체 소식이 내 시나리오에 걸리면 점검',
    desc: '새 매체 소식이 내 시나리오 집행 기간 · 매체 믹스에 걸리면, 영향을 정리하고 다시 계산할 곳을 알려줘요.',
    trigger: '새 매체 소식',
    owner: '신지아',
    status: 'on',
    nodes: [
      { id: 'a', kind: 'event', title: '새 매체 소식이 들어오면', sub: '라이브러리 이벤트', x: 200, y: 40, config: [{ k: '이벤트', v: '매체 소식 등록' }, { k: '범위', v: '내가 볼 수 있는 소식' }], result: 'MN-1107 메타 릴스 단가 조정', ms: 0 },
      { id: 'b', kind: 'library', title: '걸리는 내 시나리오 찾기', sub: '적용 기간 × 집행 기간 · 매체 믹스', x: 200, y: 160, config: [{ k: '대상', v: '진행 중인 내 시나리오' }, { k: '기준', v: '소식 적용 기간이 집행 기간과 겹치고, 해당 매체 비중 10% 이상' }], result: '3개 · 겨울 배달 · 연말 앱 설치 · 연말 프로모션', ms: 700 },
      { id: 'c', kind: 'scenarioRun', title: '현재 배분안 불러오기', sub: 'BudgetOpt 2.0 · 다시 계산하지 않음', x: 40, y: 290, config: [{ k: '솔루션', v: 'BudgetOpt 2.0' }, { k: '시나리오', v: '앞 노드에서 받기' }, { k: '방식', v: '저장된 결과 읽기' }], result: '메타 비중 50% · 45% · 17%', ms: 900 },
      { id: 'd', kind: 'library', title: '관련 분석 리포트', sub: '매체 · KPI 기준', x: 360, y: 290, config: [{ k: '찾는 것', v: '분석 리포트' }, { k: '기준', v: '해당 매체 · 시나리오 KPI' }], result: 'Vol.2 발견 1건', ms: 500 },
      { id: 'e', kind: 'llm', title: '영향 정리 · 다시 계산할 곳', sub: 'SpinX · Skill: 매체 변경 영향 메모', x: 200, y: 420, config: [{ k: '지시문', v: '시나리오별 영향과 우선순위를 정리해줘' }, { k: 'Skill', v: '매체 변경 영향 메모' }, { k: '근거', v: '앞 노드 결과만 인용' }], result: '결론 1줄 · 근거 3건 인용', ms: 3100 },
      { id: 'f', kind: 'output', title: 'Ground 알림 + 대화로 저장', sub: '나 · 시나리오 담당자', x: 200, y: 550, config: [{ k: '받는 곳', v: '나, 시나리오 담당자' }, { k: '저장', v: '대화 세션으로 남기기' }], result: '3명에게 보냄', ms: 200 },
    ],
    edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'b', to: 'd' }, { from: 'c', to: 'e' }, { from: 'd', to: 'e' }, { from: 'e', to: 'f' }],
    runs: [
      { id: 'r3', at: '2026-11-03 14:20', status: 'success', duration: '5.4초', summary: '메타 릴스 단가 조정 → 시나리오 3개' },
      { id: 'r2', at: '2026-11-02 11:05', status: 'success', duration: '4.9초', summary: 'GFA 12월 리베이트 → 시나리오 2개' },
      { id: 'r1', at: '2026-10-30 17:40', status: 'success', duration: '2.1초', summary: '카카오 비즈보드 신상품 → 걸리는 시나리오 없음' },
    ],
    output: {
      title: '메타 릴스 단가 조정이 내 시나리오 3개에 걸려요',
      conclusion: '메타 비중이 50%인 겨울 배달 프로모션 배분안부터 다시 계산해 보세요.',
      body: [
        '메타 릴스 최소 입찰 단가가 11.18부터 올라요. 겨울 배달 프로모션(메타 50%), 연말 앱 설치(45%), 연말 프로모션 클릭 최적화안(17%)이 집행 기간에 이 변경을 걸쳐요. 저단가 입찰 비중이 높을수록 노출이 줄 수 있어요.',
        '배분안 숫자는 아직 그대로예요. 과거 집행 데이터로 계산한 결과라 공지만으로는 바뀌지 않아요. 11.20부터 네이버 GFA 홈피드가 넓어지니, 줄일 몫을 GFA로 옮긴 안을 함께 계산해 비교해 보세요.',
      ],
      cites: [{ id: 'MN-1107', label: '메타, 릴스 광고 최소 입찰 단가 조정' }, { id: 'MN-1115', label: '네이버 GFA, 홈피드 지면 확대' }, { id: 'WR-002', label: 'Vol.2 늘 쓰던 그 매체 조합, 정말 최선일까?' }],
      next: { label: 'BudgetOpt 2.0에서 다시 계산', to: '/budgetopt' },
    },
  },
  {
    id: 'FL-02',
    name: '하이트진로 2030 제안셋 만들기',
    desc: '요청 하나로 상품 선정부터 예산 배분, 도달 예측까지 이어서 광고주용 제안셋을 만들어요.',
    trigger: '직접 실행',
    owner: '신지아',
    status: 'on',
    nodes: [
      { id: 'a', kind: 'manual', title: '2030 타겟 · 1억 · 10월', sub: '입력값 4개', x: 200, y: 40, config: [{ k: '광고주', v: '하이트진로' }, { k: '타겟', v: '2030' }, { k: '예산', v: '1억 원' }, { k: '기간', v: '2027.10.1 – 10.31' }], result: '입력 확인', ms: 0 },
      { id: 'b', kind: 'scenarioCreate', title: 'Ad Curator 상품 고르기', sub: '2027 1Q 출시 예정', x: 200, y: 160, config: [{ k: '솔루션', v: 'Ad Curator' }, { k: '목표', v: '2030 도달 상품' }], result: '상품 6개 추천', ms: 4200 },
      { id: 'c', kind: 'scenarioCreate', title: 'BudgetOpt 2.0 예산 배분', sub: '추천 상품 기준', x: 40, y: 280, config: [{ k: '솔루션', v: 'BudgetOpt 2.0' }, { k: 'KPI', v: '조회' }, { k: '상품', v: '앞 노드 6개' }], result: '유튜브 45% · 틱톡 35% · 메타 20%', ms: 9800 },
      { id: 'd', kind: 'library', title: '연휴 · 음료 업종 리포트', sub: '기간 · 업종 기준 자동 첨부', x: 360, y: 280, config: [{ k: '찾는 것', v: '분석 리포트' }, { k: '기준', v: '2027 추석(긴 연휴) · 음료및기호식품' }], result: 'Vol.1 발견 2건', ms: 500 },
      { id: 'e', kind: 'scenarioCreate', title: 'Reach Caster 도달 예측', sub: '배분안 기준', x: 40, y: 400, config: [{ k: '솔루션', v: 'Reach Caster' }, { k: '배분안', v: '앞 노드 결과' }], result: '순도달 36.8% · 평균 3.1회', ms: 7600 },
      { id: 'f', kind: 'llm', title: '광고주 설명 자료로', sub: 'Skill: Reach Caster 결과 광고주 대상 설명 자료', x: 200, y: 520, config: [{ k: 'Skill', v: 'Reach Caster 결과 광고주 대상 설명 자료' }, { k: '추가 지시', v: '이번엔 기간 효과를 강조' }], result: '5쪽 · 근거 2건 인용', ms: 5200 },
      { id: 'g', kind: 'output', title: '제안셋 문서 저장', sub: '하이트진로 2030 캠페인 슬롯', x: 200, y: 640, config: [{ k: '저장', v: '슬롯 · 제안셋' }, { k: '형식', v: 'PDF · 공유 링크' }], result: '저장 완료', ms: 300 },
    ],
    edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'b', to: 'd' }, { from: 'c', to: 'e' }, { from: 'e', to: 'f' }, { from: 'd', to: 'f' }, { from: 'f', to: 'g' }],
    runs: [
      { id: 'r1', at: '2026-11-03 16:12', status: 'success', duration: '27.6초', summary: '제안셋 1건 · 순도달 36.8%' },
    ],
    output: {
      title: '하이트진로 2030 제안셋',
      conclusion: '유튜브 · 틱톡 중심 배분으로 2030의 36.8%에게 평균 3.1회 닿아요.',
      body: [
        'Ad Curator가 2030 도달에 맞는 상품 6개를 골랐고, BudgetOpt 2.0이 조회 KPI 기준으로 유튜브 45% · 틱톡 35% · 메타 20%로 나눴어요.',
        '10월은 추석 긴 연휴가 끼는 달이라, 연휴 주간에 광고를 줄이지 않는 편이 낫다는 분석을 근거로 붙였어요. 연휴 전후로 예산을 끊지 않도록 일정을 짰어요.',
      ],
      cites: [{ id: 'WR-001', label: 'Vol.1 연휴에 광고 줄이면 아끼는 걸까, 놓치는 걸까?' }],
      next: { label: 'Reach Caster에서 열기', to: '/reachcaster' },
    },
  },
  {
    id: 'FL-03',
    name: '새 리포트가 닿는 시나리오 알림',
    desc: '분석 리포트가 새로 들어오면 내 시나리오 중 걸리는 곳을 찾아 알려줘요.',
    trigger: '새 분석 리포트',
    owner: '신지아',
    status: 'on',
    nodes: [
      { id: 'a', kind: 'event', title: '새 분석 리포트가 들어오면', sub: '라이브러리 이벤트', x: 200, y: 40, config: [{ k: '이벤트', v: '분석 리포트 등록' }, { k: '범위', v: '임직원 공개 이상' }], result: 'Vol.1 등록 (11.2)', ms: 0 },
      { id: 'b', kind: 'library', title: '내 시나리오와 맞춰보기', sub: '인사이트 맵 연결 규칙', x: 200, y: 170, config: [{ k: '대상', v: '진행 중인 내 시나리오' }, { k: '기준', v: '발견 조건 전부 충족' }], result: '6개 시나리오 · 바로 해당 3', ms: 900 },
      { id: 'c', kind: 'llm', title: '시나리오별 한 줄', sub: 'SpinX', x: 200, y: 300, config: [{ k: '지시문', v: '시나리오마다 왜 걸리는지 한 줄' }], result: '6줄', ms: 2600 },
      { id: 'd', kind: 'output', title: 'Ground 알림', sub: '나', x: 200, y: 430, config: [{ k: '받는 곳', v: '나' }], result: '보냄', ms: 100 },
    ],
    edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'd' }],
    runs: [
      { id: 'r1', at: '2026-11-02 10:41', status: 'success', duration: '3.6초', summary: 'Vol.1 → 시나리오 6개' },
    ],
    output: {
      title: 'Vol.1이 내 시나리오 6개에 닿았어요',
      conclusion: '갤럭시 2027 추석 프로모션 배분안은 연휴에 예산을 줄이지 않는 쪽을 검토해 보세요.',
      body: [
        '바로 해당 3개는 모두 2027 추석(평일 3일 · 긴 연휴)을 집행 기간에 포함해요. 긴 연휴에는 광고를 줄인 브랜드의 회복이 늦었다는 발견과 조건이 맞아요.',
        '참고 3개는 2027 설(짧은 연휴)이 걸려 있어 영향이 작을 수 있어요.',
      ],
      cites: [{ id: 'WR-001', label: 'Vol.1 연휴에 광고 줄이면 아끼는 걸까, 놓치는 걸까?' }],
    },
  },
  {
    id: 'FL-04',
    name: '아이오닉 6 월간 도달 재계산',
    desc: '매달 1일 도달 예측을 다시 계산해 지난달과 비교해요.',
    trigger: '매월 1일 08:00',
    owner: '신지아',
    status: 'off',
    nodes: [
      { id: 'a', kind: 'schedule', title: '매월 1일 08:00', sub: '10.1 – 12.31', x: 200, y: 40, config: [{ k: '반복', v: '매월 1일' }, { k: '시간', v: '08:00' }], result: '11.1 08:00 시작', ms: 0 },
      { id: 'b', kind: 'scenarioRun', title: '아이오닉 6 4분기 도달 예측', sub: 'Reach Caster · 다시 계산', x: 200, y: 170, config: [{ k: '솔루션', v: 'Reach Caster' }, { k: '시나리오', v: '아이오닉 6 4분기 도달 예측' }], result: '데이터셋 갱신 대기로 멈춤', ms: 1200 },
      { id: 'c', kind: 'llm', title: '지난달과 비교', sub: 'SpinX', x: 200, y: 300, config: [{ k: '지시문', v: '지난달 대비 순도달 변화와 이유' }] },
      { id: 'd', kind: 'output', title: '알림 보내기', sub: '나', x: 200, y: 430, config: [{ k: '받는 곳', v: '나' }] },
    ],
    edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'd' }],
    runs: [
      { id: 'r2', at: '2026-11-01 08:00', status: 'failed', duration: '1.2초', summary: 'DataShot 데이터셋 갱신 대기' },
      { id: 'r1', at: '2026-10-01 08:00', status: 'success', duration: '9.4초', summary: '순도달 41.2% · 변화 없음' },
    ],
  },
]

export const findFlow = (id: string) => FLOWS.find(f => f.id === id)
export const fmtRunAt = (s: string) => { const [d, t] = s.split(' '); return `${Number(d.slice(5, 7))}.${Number(d.slice(8, 10))} ${t}` }

/** 템플릿에서 새 초안 (실행 기록·결과는 비운다) */
export function draftFrom(base: Flow, name = base.name, desc = base.desc): Flow {
  return {
    ...structuredClone(base), id: `FL-${Date.now().toString(36)}`, name, desc, status: 'off', runs: [], output: undefined,
    nodes: base.nodes.map(n => ({ ...structuredClone(n), result: undefined, ms: undefined })),
  }
}
/** 말로 만들기 — 프로토타입은 문장과 상관없이 첫 예시 형태로 초안을 만든다 */
export const draftFromText = (text: string) => draftFrom(FLOWS[0], text.trim().slice(0, 28) || '새 워크플로우', text.trim())
export function blankFlow(): Flow {
  return {
    id: `FL-${Date.now().toString(36)}`, name: '새 플로우', desc: '', trigger: '스케줄', owner: '신지아', status: 'off', runs: [],
    nodes: [{ id: 'a', kind: 'schedule', ...NODE_DEFAULT.schedule, x: 200, y: 40 }], edges: [],
  }
}
/** 세션 동안만 유지되는 새 플로우 */
export const DRAFTS = new Map<string, Flow>()

/** 대화에서 SpinX가 거친 단계를 그대로 워크플로우로 */
export function flowFromSteps(name: string, desc: string, steps: { kind: FlowNodeKind; title: string; result: string }[]): Flow {
  const nodes: FlowNode[] = steps.map((st, i) => ({
    id: `s${i}`, kind: st.kind, title: st.title, sub: NODE_DEFAULT[st.kind].sub, x: 200, y: 40 + i * 120,
    config: structuredClone(NODE_DEFAULT[st.kind].config), result: st.result, ms: st.kind === 'manual' ? 0 : 900 + i * 700,
  }))
  return {
    id: `FL-${Date.now().toString(36)}`, name, desc, trigger: '직접 실행', owner: '신지아', status: 'off', runs: [],
    nodes, edges: nodes.slice(1).map((n, i) => ({ from: nodes[i].id, to: n.id })),
  }
}

const pad = (n: number) => String(n).padStart(2, '0')
/** 대화에서 실행 — 실행하면 곧 워크플로우가 되고 기록이 남는다 (따로 저장하지 않음) */
export function recordChatRun(id: string, name: string, desc: string, steps: { kind: FlowNodeKind; title: string; result: string }[], tpl?: Flow, conclusion?: string, extra?: Pick<FlowOutput, 'body' | 'cites' | 'next'>): Flow {
  const base: Flow = tpl ? { ...structuredClone(tpl), name, desc } : flowFromSteps(name, desc, steps)
  const now = new Date()
  const at = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
  const run: FlowRun = { id: `r${Date.now()}`, at, status: 'success', duration: `${(base.nodes.length * 1.9).toFixed(1)}초`, summary: tpl?.runs[0]?.summary ?? '대화에서 실행' }
  const flow: Flow = { ...base, id, status: 'off', runs: [run], output: tpl?.output ?? { title: name, conclusion: conclusion ?? '', body: extra?.body ?? [], cites: extra?.cites ?? [], next: extra?.next } }
  DRAFTS.set(id, flow)
  notifyFlows()
  return flow
}

/** 워크플로우 목록 갱신 알림 (대화에서 실행·자동 실행 켜기) */
export const notifyFlows = () => window.dispatchEvent(new Event('ground:flows'))
