// artifactData.ts — Artifacts (대화 · 워크플로우에서 만든 자료)
// 라이브러리 = 들어오는 지식, Artifacts = 내가 만든 것.
// 워크플로우가 다시 돌면 새 Artifacts이 아니라 버전이 늘어난다.

import { DRAFTS, FLOWS, fmtRunAt, type Flow } from './flowData'

export type ArtifactKind = '점검 메모' | '제안셋' | '알림 요약' | '배분안 요약' | '광고주 설명 자료'
export type ShareLevel = 'private' | 'team' | 'client'
export const SHARE_LABEL: Record<ShareLevel, string> = { private: '나만 보기', team: '팀 공유', client: '광고주 공유' }

export interface Artifact {
  id: string
  title: string
  kind: ArtifactKind
  source: { type: 'workflow' | 'chat'; label: string; path: string }
  slot?: string
  scenarios: string[]
  share: ShareLevel
  skill?: string
  versions: { v: number; at: string; note: string }[]
  conclusion: string
  body: string[]
  cites: { id: string; label: string }[]
  next?: { label: string; to: string }
}

const fromFlow = (f: Flow, p: Partial<Artifact> & Pick<Artifact, 'kind' | 'share'>): Artifact => ({
  id: `AR-${f.id}`,
  title: f.output!.title,
  source: { type: 'workflow', label: f.name, path: `/ground/flow/${f.id}?tab=runs` },
  scenarios: [],
  versions: f.runs.filter(r => r.status === 'success').map((r, i, a) => ({ v: a.length - i, at: r.at, note: r.summary })),
  conclusion: f.output!.conclusion,
  body: f.output!.body,
  cites: f.output!.cites,
  next: f.output!.next,
  ...p,
})

const flow = (id: string) => FLOWS.find(f => f.id === id)!

const STATIC: Artifact[] = [
  fromFlow(flow('FL-01'), { kind: '점검 메모', share: 'team', skill: '매체 변경 영향 메모', slot: '배달의민족 겨울 프로모션', scenarios: ['S-209', 'S-210', 'S-206'] }),
  fromFlow(flow('FL-02'), { kind: '제안셋', share: 'client', slot: '하이트진로 2030 캠페인', scenarios: ['S-207'], skill: 'Reach Caster 결과 광고주 대상 설명 자료' }),
  {
    id: 'AR-05', title: '아이오닉 6 4분기 도달 예측 — 광고주 설명 자료', kind: '광고주 설명 자료',
    source: { type: 'chat', label: '아이오닉 6 도달 예측 설명 자료 만들어줘', path: '/ground' },
    slot: '현대 아이오닉 6 마케팅', scenarios: ['S-208'], share: 'client', skill: 'Reach Caster 결과 광고주 대상 설명 자료',
    versions: [
      { v: 2, at: '2026-11-03 11:20', note: '기간 효과 강조로 다시 작성' },
      { v: 1, at: '2026-11-01 15:02', note: '처음 작성' },
    ],
    conclusion: '4분기 예산으로 타겟의 41.2%에게 평균 3.4회 닿아요.',
    body: [
      '유튜브 40% · 네이버 GFA 35% · 카카오 25% 배분으로, 10월 대비 12월에 순도달이 가장 크게 늘어요. 연말 시즌에 노출 단가가 오르기 전에 도달을 먼저 쌓는 구성이에요.',
      'GFA 홈피드 지면이 11.20부터 넓어져, 12월 도달 단가가 더 내려갈 여지가 있어요.',
    ],
    cites: [{ id: 'MN-1115', label: '네이버 GFA, 홈피드 지면 확대' }, { id: 'WR-009', label: 'Vol.9 피크가 오기 전에 먼저 사야 할까?' }],
    next: { label: 'Reach Caster에서 열기', to: '/reachcaster' },
  },
  fromFlow(flow('FL-03'), { kind: '알림 요약', share: 'private', scenarios: ['S-201', 'S-202', 'S-203'] }),
  {
    id: 'AR-06', title: '설 시즌 연휴 예산 검토 메모', kind: '점검 메모',
    source: { type: 'chat', label: '설 시즌 캠페인도 연휴 예산을 따로 짜야 해?', path: '/ground' },
    slot: 'LG 올레드 TV 런칭 캠페인', scenarios: ['S-204', 'S-205'], share: 'team', skill: '연휴 예산 검토',
    versions: [{ v: 1, at: '2026-11-02 17:45', note: '처음 작성' }],
    conclusion: '2027 설은 단기 연휴라 평시 계획을 그대로 써도 돼요.',
    body: [
      '단기 연휴(평일 1~2일)는 광고비 · 단가 · 반응이 평시 대비 5% 안쪽으로 움직였어요. 올레드 2027 설 시즌 배분안과 설 선물세트 클릭 배분안 모두 평시 기준으로 운영해요.',
      '2027 추석은 평일 3일 장기 연휴라 별도 예산 계획이 필요해요. 연휴 일정은 확정 전 가정값이에요.',
    ],
    cites: [{ id: 'WR-001', label: 'Vol.1 연휴에 광고 줄이면 아끼는 걸까, 놓치는 걸까?' }],
  },
]

/** 대화에서 실행한 워크플로우도 Artifacts로 (최신이 위) */
export function listArtifacts(): Artifact[] {
  const drafts = [...DRAFTS.values()].filter(f => f.runs.length && f.output?.conclusion).reverse()
    .map(f => fromFlow({ ...f, output: { ...f.output!, title: f.name } }, { kind: f.nodes.some(n => n.kind === 'scenarioCreate') ? '배분안 요약' : '점검 메모', share: 'private' }))
  return [...drafts, ...STATIC].sort((a, b) => b.versions[0].at.localeCompare(a.versions[0].at))
}
export const findArtifact = (id: string) => listArtifacts().find(a => a.id === id)
export const artifactOfFlow = (flowId: string) => `AR-${flowId}`
export const fmtAt = fmtRunAt

/** 공유 상태는 세션 동안 유지 (목업) */
export const SHARE_OVERRIDE = new Map<string, ShareLevel>()
export const shareOf = (a: Artifact) => SHARE_OVERRIDE.get(a.id) ?? a.share
