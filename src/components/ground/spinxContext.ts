// spinxContext.ts — 시작한 자리에 따라 SpinX 답이 달라진다 (프로토타입 스크립트)
//  · 워크플로우: 새로 만들기(단계 + 저장) / 기존 것에 질문 · 수정 요청(캔버스에 적용)
//  · 라이브러리: 보고 있는 리포트와 비슷한 분석 · 내 시나리오 해당 여부
//  · 그 밖은 전역 답(answerQuestion)

import type { GroundAnswer, GroundSession, SessionOrigin, Viewer, CitationRef } from './groundTypes'
import { answerQuestion, findReport, visibleReports, linksForSource, findScenario, themeOf } from './groundData'
import { FLOWS, DRAFTS, findFlow, NODE_META, type Flow } from './flowData'

export const answerFor = (q: string, s: Pick<GroundSession, 'viewer' | 'origin'>) => answerIn(q, s.viewer, s.origin)

export function answerIn(q: string, viewer: Viewer, origin?: SessionOrigin): GroundAnswer {
  if (origin?.type === 'workflow') return origin.id === 'flow-new' ? newFlow(q) : aboutFlow(q, origin.id, viewer)
  if (origin?.type === 'library' && origin.id.startsWith('WR-')) return aboutReport(q, origin.id, viewer) ?? answerQuestion(q, viewer)
  if (origin?.type === 'artifact') return aboutArtifact(q, origin.label)
  if (origin?.type === 'skill') return aboutSkill(q, origin.label)
  return answerQuestion(q, viewer)
}

/** 추천 질문 — 자리마다 다르게 */
export function suggestionsFor(origin: SessionOrigin): string[] {
  if (origin.type === 'workflow' && origin.id === 'flow-new') return ['새 매체 소식이 내 시나리오에 걸리면 영향 정리해서 알려줘', '하이트진로 2030, 1억으로 제안셋 만들어줘']
  if (origin.type === 'workflow') {
    const f = getFlow(origin.id)
    if (f?.runs[0]?.status === 'failed') return ['왜 멈췄어?', '데이터셋 갱신되면 바로 다시 돌게 바꿔줘']
    return ['이 결론은 어떤 근거로 냈어?', f?.id === 'FL-01' ? '겨울 배달 시나리오만 보게 바꿔줘' : '받는 사람에 담당자도 추가해줘']
  }
  if (origin.type === 'artifact') return ['광고주용 톤으로 다시 써줘', '근거를 하나 더 붙여줘']
  if (origin.type === 'skill') return ['결론을 더 짧게 쓰도록 바꿔줘', '이 Skill로 하나 만들어줘']
  if (origin.type === 'library' && origin.id.startsWith('WR-')) return ['이 리포트와 비슷한 분석 있어?', '내 시나리오 중 여기 해당하는 건?']
  return ['연휴 관련 리포트 중 내 시나리오에 걸리는 건?', '이번 달 매체 소식 중 챙겨야 할 거 있어?']
}

const getFlow = (id: string): Flow | undefined => DRAFTS.get(id) ?? findFlow(id)
const citeOf = (id: string): CitationRef => (id.startsWith('MN-') ? { type: 'news', id } : id.startsWith('WR-') && !id.includes('-F') ? { type: 'finding', id: `${id}-F1` } : { type: 'finding', id })

// ── 워크플로우: 새로 만들기 ──
function newFlow(q: string): GroundAnswer {
  const tpl = /리포트/.test(q) ? 'FL-03' : /제안|1억|만들어/.test(q) ? 'FL-02' : 'FL-01'
  const f = findFlow(tpl)!
  const steps = [...f.nodes].sort((a, b) => a.y - b.y || a.x - b.x).map(n => ({ kind: n.kind, title: n.title, result: n.sub }))
  return {
    verdict: `이렇게 짜봤어요. "${f.name}" 흐름이에요.`,
    paragraphs: [
      `${NODE_META[f.nodes[0].kind].label}으로 시작해서 ${steps.length}단계로 돌아요. ${f.desc}`,
      '지금 실행하면 결과와 함께 워크플로우 기록이 남아요. 고칠 게 있으면 캔버스에서 먼저 고쳐도 돼요.',
    ],
    citations: [],
    followUps: ['시작 조건을 매주 월요일로 바꿔줘', '결과를 담당자에게도 보내줘'],
    workflow: { mode: 'proposal', name: f.name, steps, templateId: tpl },
  }
}

// ── 워크플로우: 기존 것에 대해 ──
function aboutFlow(q: string, id: string, viewer: Viewer): GroundAnswer {
  const f = getFlow(id)
  if (!f) return answerQuestion(q, viewer)
  const last = f.runs[0]
  if (/멈|실패|왜 안/.test(q) || (last?.status === 'failed' && /왜/.test(q))) {
    const n = f.nodes.find(x => x.kind === 'scenarioRun' || x.kind === 'scenarioCreate')
    return {
      verdict: `${n?.title ?? '시나리오 호출'} 단계에서 멈췄어요. DataShot 데이터셋이 아직 갱신되지 않았어요.`,
      paragraphs: [
        'Reach Caster는 최신 데이터셋으로만 다시 계산해요. 11.1 08:00 실행 때 10월 데이터셋이 아직 올라오기 전이라 계산을 시작하지 않았어요.',
        '매월 1일 고정 시간 대신 "데이터셋이 갱신되면" 시작하게 바꾸면 같은 일로 멈추지 않아요.',
      ],
      citations: n ? [{ type: 'scenario', id: 'S-208' }] : [],
      followUps: ['데이터셋 갱신되면 바로 다시 돌게 바꿔줘'],
    }
  }
  if (/바꿔|만 보게|추가|넣어|빼줘|돌게/.test(q)) return patchFor(q, f)
  if (/근거|결론|왜/.test(q) && f.output) {
    return {
      verdict: f.output.conclusion,
      paragraphs: [...f.output.body.slice(0, 1), `근거는 ${f.output.cites.length}건이에요. 워크플로우의 LLM 노드는 앞 노드 결과만 인용하도록 되어 있어요 [1].`],
      citations: f.output.cites.map(c => citeOf(c.id)),
      followUps: suggestionsFor({ type: 'workflow', id: f.id, label: f.name, path: '' }).slice(1),
    }
  }
  return {
    verdict: `"${f.name}"은 ${f.nodes.length}단계로 돌아요.`,
    paragraphs: [`${[...f.nodes].sort((a, b) => a.y - b.y).map(n => n.title).join(' → ')} 순서예요.${last ? ` 마지막 실행은 ${last.summary}였어요.` : ''}`],
    citations: [],
    followUps: suggestionsFor({ type: 'workflow', id: f.id, label: f.name, path: '' }),
  }
}

function patchFor(q: string, f: Flow): GroundAnswer {
  // 1) 대상 좁히기 — "겨울 배달 시나리오만"
  if (/만 보게|만 봐/.test(q)) {
    const n = f.nodes.find(x => x.kind === 'library') ?? f.nodes[1]
    return {
      verdict: '찾는 범위를 겨울 배달 프로모션 배분안 하나로 좁혔어요. 캔버스에 적용할까요?',
      paragraphs: ['다른 시나리오에 걸리는 소식은 이제 건너뛰어요. 나머지 단계는 그대로예요.'],
      citations: [{ type: 'scenario', id: 'S-209' }],
      followUps: ['다시 전체 시나리오로 돌려줘'],
      patch: { flowId: f.id, changes: [{ nodeId: n.id, before: n.title, title: '겨울 배달 배분안만 보기', sub: 'S-209 · 적용 기간 × 집행 기간', config: [{ k: '대상', v: '겨울 배달 프로모션 배분안' }, { k: '기준', v: '소식 적용 기간이 집행 기간과 겹칠 때' }] }] },
    }
  }
  // 2) 시작 조건 바꾸기
  if (/돌게|시작|매주|갱신되면/.test(q)) {
    const n = f.nodes[0]
    const weekly = /매주/.test(q)
    return {
      verdict: weekly ? '시작 조건을 매주 월요일 09:00으로 바꿨어요. 캔버스에 적용할까요?' : '시작 조건을 "데이터셋이 갱신되면"으로 바꿨어요. 캔버스에 적용할까요?',
      paragraphs: [weekly ? '정해진 시간에 돌지만, 데이터가 그대로면 결과도 같을 수 있어요.' : '이제 DataShot 데이터셋이 올라오는 즉시 다시 계산해요. 고정 시간에 돌다 멈추는 일이 없어요.'],
      citations: [],
      followUps: [],
      patch: { flowId: f.id, changes: [{ nodeId: n.id, before: n.title, title: weekly ? '매주 월요일 09:00' : '데이터셋이 갱신되면', sub: weekly ? '정해진 시간에 시작' : 'DataShot 이벤트' }] },
    }
  }
  // 3) 받는 사람 · 출력 추가
  const out = [...f.nodes].sort((a, b) => b.y - a.y)[0]
  return {
    verdict: '마지막에 담당자 메일 보내기를 하나 더 붙였어요. 캔버스에 적용할까요?',
    paragraphs: ['Ground 알림은 그대로 두고, 같은 결과를 시나리오 담당자에게 메일로도 보내요.'],
    citations: [],
    followUps: [],
    patch: { flowId: f.id, changes: [], add: { after: out.id, kind: 'output', title: '담당자 메일 보내기', sub: '시나리오 담당자 · 요약본' } },
  }
}

// ── 라이브러리: 보고 있는 리포트 ──
function aboutReport(q: string, id: string, viewer: Viewer): GroundAnswer | null {
  const r = findReport(id)
  if (!r) return null
  if (/비슷|유사|같은 주제|관련된/.test(q)) {
    const keys = (x: typeof r) => new Set(x.findings.flatMap(f => Object.keys(f.condition)))
    const mine = keys(r)
    const sims = visibleReports(viewer).filter(x => x.id !== r.id)
      .map(x => ({ x, same: x.theme === r.theme, overlap: [...keys(x)].filter(k => mine.has(k)).length }))
      .filter(v => v.same || v.overlap > 0)
      .sort((a, b) => Number(b.same) - Number(a.same) || b.overlap - a.overlap)
      .slice(0, 3)
    if (!sims.length) return { verdict: '아직 비슷한 분석이 없어요.', paragraphs: ['같은 주제의 리포트가 들어오면 알려드릴게요.'], citations: [], followUps: ['새 리포트 오면 알려주는 워크플로우 만들어줘'] }
    return {
      verdict: `비슷한 분석이 ${sims.length}개 있어요. ${sims[0].x.issue} "${sims[0].x.title}"이 가장 가까워요.`,
      paragraphs: sims.map((v, i) => `${v.x.issue} ${v.x.title} — ${v.same ? `같은 ${themeOf(r.theme).name} 주제` : '조건이 겹치는 분석'}이에요${v.x.sample ? ' (예시 리포트)' : ''} [${i + 1}].`),
      citations: sims.map(v => ({ type: 'finding', id: v.x.findings[0].id }) as CitationRef),
      followUps: ['내 시나리오 중 여기 해당하는 건?', '새 리포트 오면 알려주는 워크플로우 만들어줘'],
    }
  }
  if (/시나리오|해당|걸리/.test(q)) {
    const links = r.findings.flatMap(f => linksForSource(f.id, viewer))
    const direct = [...new Set(links.filter(l => l.strength === 'direct').map(l => l.scenarioId))]
    const all = [...new Set(links.map(l => l.scenarioId))]
    if (!all.length) return { verdict: r.requiresActual ? '실제 집행 결과와 함께 봐야 하는 리포트라 아직 이어진 시나리오가 없어요.' : '지금 진행 중인 시나리오 중 해당하는 건 없어요.', paragraphs: [], citations: [], followUps: [] }
    const first = links.find(l => l.scenarioId === (direct[0] ?? all[0]))!
    return {
      verdict: `내 시나리오 ${all.length}개에 닿고, 그중 ${direct.length}개는 바로 해당해요.`,
      paragraphs: [
        `가장 직접적인 건 ${findScenario(first.scenarioId)?.name}이에요. ${first.reasons.join(' · ')} 조건이 맞아요 [1].`,
        all.length > 1 ? `나머지는 ${all.filter(x => x !== first.scenarioId).slice(0, 3).map(x => findScenario(x)?.name).join(', ')}${all.length > 4 ? ' 등' : ''}이에요.` : '',
      ].filter(Boolean),
      citations: [{ type: 'scenario', id: first.scenarioId }, { type: 'finding', id: first.sourceId }],
      followUps: ['이 시나리오 기준으로 해석해줘', '새 리포트 오면 알려주는 워크플로우 만들어줘'],
    }
  }
  return null
}

/** 저장할 때 템플릿이 있으면 분기까지 살린 초안으로 */
export const templateFlow = (id?: string) => (id ? FLOWS.find(f => f.id === id) : undefined)

// ── Artifacts: 고치면 새 버전 ──
function aboutArtifact(q: string, label: string): GroundAnswer {
  const tone = /톤|광고주|다시 써/.test(q)
  return {
    verdict: tone ? `"${label}"을 광고주용 톤으로 다시 썼어요. 새 버전으로 저장할까요?` : '근거를 하나 더 붙였어요. 새 버전으로 저장할까요?',
    paragraphs: tone
      ? ['내부 용어(효율 포화, 리베이트 등)는 풀어서 쓰고, 결론을 맨 앞에 두었어요. 임직원 전용 근거는 뺐어요.']
      : ['같은 주제의 분석 리포트 1건을 더 찾아 근거에 붙였어요 [1].'],
    citations: tone ? [] : [{ type: 'finding', id: 'WR-009-F1' }],
    followUps: [],
  }
}

// ── Skill: 대화로 고치면 새 버전 ──
function aboutSkill(q: string, name: string): GroundAnswer {
  if (/만들어|써줘|작성/.test(q) && !/바꿔/.test(q)) {
    return {
      verdict: `"${name}" 방식으로 만들려면 대상 시나리오나 결과가 필요해요. 어떤 걸로 만들까요?`,
      paragraphs: ['최근 결과 중에서는 아이오닉 6 4분기 도달 예측이 이 Skill과 가장 잘 맞아요 [1].'],
      citations: [{ type: 'scenario', id: 'S-208' }],
      followUps: ['아이오닉 6 4분기 도달 예측으로 만들어줘'],
    }
  }
  return {
    verdict: '지시문을 고쳤어요. 저장하면 새 버전이 되고, 이 Skill을 쓰는 워크플로우에도 다음 실행부터 반영돼요.',
    paragraphs: ['바뀐 점: 첫 장 결론을 한 문장 · 30자 이내로 제한하는 규칙을 맨 앞에 추가했어요.'],
    citations: [],
    followUps: [],
  }
}
