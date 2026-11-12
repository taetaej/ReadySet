// skillData.ts — Skills: 일하는 "방법"의 재사용 패키지 (Claude Agent Skills 모델)
//  · Skill = 이름 + 설명(언제 쓰는지) + 지시문(어떻게 만드는지). 근거 지식(라이브러리)과 섞지 않는다
//  · 만드는 건 대화에서("이 방식 Skill로 저장"), 메뉴는 보고 · 고치고 · 공유하고 · 쓰인 곳을 확인
//  · 쓰인 곳은 워크플로우 LLM 노드와 Artifacts의 skill 이름으로 역추적한다

import { DRAFTS, FLOWS } from './flowData'
import { listArtifacts } from './artifactData'

export type SkillShare = 'private' | 'team' | 'org'
export const SKILL_SHARE_LABEL: Record<SkillShare, string> = { private: '나만', team: '팀', org: '전사' }

export interface Skill {
  id: string
  name: string
  /** SpinX가 이 설명을 보고 "지금 이 Skill을 쓰겠다"고 판단한다 */
  description: string
  instructions: string[]
  output: string
  owner: string
  share: SkillShare
  versions: { v: number; at: string; note: string; by: string }[]
  source?: { label: string; path: string }
}

const SKILLS: Skill[] = [
  {
    id: 'SK-01', name: 'Reach Caster 결과 광고주 대상 설명 자료',
    description: 'Reach Caster 도달 예측 결과를 광고주에게 설명하는 자료가 필요할 때',
    instructions: [
      '첫 장은 결론 한 줄: "이 예산으로 타겟의 몇 %에게 평균 몇 회 닿는다"',
      '순도달 · 평균 빈도 · 리치 커브 순서로 보여주고, 최적점은 한 곳만 강조',
      '매체별 비중은 "왜 이 비중인가"를 근거 1건과 함께 한 줄로',
      '내부 용어(효율 포화, 리베이트 등)는 풀어서 쓰고, 임직원 전용 근거는 넣지 않음',
      '마지막 장은 기간 · 예산 가정과 확인 필요 사항',
    ],
    output: '5쪽 내외 PDF · 공유 링크',
    owner: '김민수', share: 'team',
    versions: [
      { v: 3, at: '2026-11-03 10:40', note: '임직원 전용 근거 제외 규칙 추가', by: '김민수' },
      { v: 2, at: '2026-10-28 15:10', note: '리치 커브 최적점 강조 한 곳으로', by: '신지아' },
      { v: 1, at: '2026-10-21 09:30', note: '처음 작성', by: '김민수' },
    ],
  },
  {
    id: 'SK-02', name: '매체 변경 영향 메모',
    description: '매체 정책 · 단가 · 지면이 바뀌었을 때 내 시나리오에 미치는 영향을 정리할 때',
    instructions: [
      '결론 한 줄: 먼저 다시 계산할 시나리오 하나',
      '걸리는 시나리오를 해당 매체 비중 큰 순으로',
      '배분안 숫자는 공지만으로 바뀌지 않는다는 점을 명시하고, 비교할 대안을 하나 제시',
      '근거는 매체 소식 원문 + 관련 분석 리포트 1건까지',
    ],
    output: 'Ground 알림 · 메모 1장',
    owner: '신지아', share: 'team',
    versions: [
      { v: 2, at: '2026-11-02 18:20', note: '"숫자는 그대로" 문장 필수로', by: '신지아' },
      { v: 1, at: '2026-10-30 16:00', note: '대화에서 저장', by: '신지아' },
    ],
    source: { label: '메타 릴스 단가 바뀌면 내 시나리오 영향 정리해줘', path: '/ground' },
  },
  {
    id: 'SK-03', name: '시나리오별 한 줄 요약',
    description: '여러 시나리오에 걸리는 리포트 · 소식을 시나리오마다 한 줄로 알려줄 때',
    instructions: [
      '시나리오 이름 · 걸리는 이유(조건) · 할 일을 한 줄로',
      '바로 해당 먼저, 참고는 뒤에',
      '연휴 일정처럼 확정 전 값은 "가정"으로 표시',
    ],
    output: 'Ground 알림',
    owner: '신지아', share: 'private',
    versions: [{ v: 1, at: '2026-11-02 10:30', note: '처음 작성', by: '신지아' }],
  },
  {
    id: 'SK-04', name: '연휴 예산 검토',
    description: '집행 기간에 연휴가 끼는 시나리오의 예산 운영 방향을 판단할 때',
    instructions: [
      '평일 휴무 1~2일은 단기, 3일 이상은 장기로 구분 (시맨틱 레이어 규칙)',
      '단기는 평시 계획 유지, 장기는 업종 · 매체별 반응 근거로 유지 또는 조정 판단',
      '업종 근거가 없으면 시장 전체 근거를 쓰고 그 사실을 밝힘',
    ],
    output: '검토 메모',
    owner: '데이터사이언스팀', share: 'org',
    versions: [{ v: 1, at: '2026-11-02 09:00', note: 'Vol.1 기준으로 작성', by: '민지' }],
  },
]

/** 대화에서 저장한 Skill (세션 동안 유지) */
export const SKILL_DRAFTS = new Map<string, Skill>()
export const SKILL_SHARE_OVERRIDE = new Map<string, SkillShare>()
export const listSkills = () => [...[...SKILL_DRAFTS.values()].reverse(), ...SKILLS]
export const findSkill = (id: string) => listSkills().find(s => s.id === id)
export const findSkillByName = (name: string) => listSkills().find(s => s.name === name)
export const skillShareOf = (s: Skill) => SKILL_SHARE_OVERRIDE.get(s.id) ?? s.share

/** 쓰인 곳 — 워크플로우 LLM 노드 · Artifacts */
export function usageOf(s: Skill) {
  const flows = [...FLOWS, ...DRAFTS.values()].filter(f => f.nodes.some(n => n.config.some(c => c.k === 'Skill' && c.v === s.name)))
  const artifacts = listArtifacts().filter(a => a.skill === s.name)
  return { flows, artifacts }
}

/** 대화 답을 Skill로 — 답의 구성(결론 → 근거 → 할 일)을 지시문으로 옮긴다 */
export function skillFromAnswer(question: string, verdict: string, paragraphs: string[]): Skill {
  const id = `SK-${Date.now().toString(36)}`
  const s: Skill = {
    id,
    name: question.replace(/[?？]$/, '').slice(0, 24),
    description: `"${question.slice(0, 30)}" 같은 요청을 받았을 때`,
    instructions: [
      `결론 한 줄을 먼저: 예) ${verdict.slice(0, 40)}${verdict.length > 40 ? '…' : ''}`,
      `근거 문단 ${paragraphs.length}개 이내, 문단마다 근거 1건 인용`,
      '확정 전 값은 "가정"으로 표시',
      '마지막에 이어서 할 일 2개 제안',
    ],
    output: '대화 답 · 메모',
    owner: '신지아', share: 'private',
    versions: [{ v: 1, at: new Date().toISOString().slice(0, 16).replace('T', ' '), note: '대화에서 저장', by: '신지아' }],
    source: { label: question, path: '/ground' },
  }
  SKILL_DRAFTS.set(id, s)
  return s
}
