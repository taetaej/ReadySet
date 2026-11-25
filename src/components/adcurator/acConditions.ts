// Step 2 선별 기준 처리 (순수 함수). SpinX API 연동 시 analyzeContext만 API 호출로 교체한다.
import { ACAnalysis, ACCondition, ACConditionDef, ACPurpose, ACParsedCriterion, PURPOSE_LABELS } from './types'
import { AC_CONDITION_CATALOG, AC_TRAIT_CATALOG } from './sampleData'

export const CONDITION_BY_ID: Record<string, ACConditionDef> =
  Object.fromEntries(AC_CONDITION_CATALOG.map(c => [c.id, c]))

export const TRAIT_LABEL_BY_ID: Record<string, string> =
  Object.fromEntries(AC_TRAIT_CATALOG.map(t => [t.id, t.label]))

/**
 * 특성 기준 안내 문장 (정의서 4.4). 이름은 최대 2개, 그 이상은 "외 N개".
 * traits는 카탈로그 순서로 들어온다고 가정
 */
export function traitSentence(traits: string[]): string {
  const names = traits.map(id => TRAIT_LABEL_BY_ID[id]).filter(Boolean)
  const shown = names.slice(0, 2).map(n => `'${n}'`).join(', ')
  const rest = names.length - 2
  return `SpinX가 캠페인 설명에서 ${shown}${rest > 0 ? ` 외 ${rest}개` : ''} 특성을 찾았습니다.`
}

const CATALOG_INDEX: Record<string, number> =
  Object.fromEntries(AC_CONDITION_CATALOG.map((c, i) => [c.id, i]))

/** 값을 카탈로그 순서로 정렬 (사용자가 고른 순서와 무관하게 표시가 흔들리지 않게) */
export const orderValues = (id: string, values: string[]): string[] => {
  const def = CONDITION_BY_ID[id]
  if (!def || def.money) return values
  return def.values.filter(v => values.includes(v))
}

/** 조건을 카탈로그 순서로 정렬 */
export const byCatalogOrder = (a: string, b: string) => (CATALOG_INDEX[a] ?? 0) - (CATALOG_INDEX[b] ?? 0)

/** 값 표시 */
export const formatValues = (id: string, values: string[]): string => {
  if (CONDITION_BY_ID[id]?.money) return `${Number(values[0]).toLocaleString()}만 원`
  return values.join(' · ')
}

// ---------- SpinX 캠페인 맥락 분석 (모의) ----------

interface Hit { id: string; value: string; phrase: string }

/**
 * 캠페인 설명·첨부 파일 내용에서 "기준"과 "항목 값"을 파싱하는 모의 분석기 (키워드 매칭).
 * - 기준과 항목 값이 함께 파싱되면 행으로 매핑(근거 표현 포함)
 * - 기준은 찾았지만 값이 확실하지 않으면(예: 예산 범위) 빈 값 행 + 후보 제공
 * - 기준으로 쓸 수 없는 표현은 반영하지 않았다는 안내
 */
export function analyzeContext(text: string, purposes: ACPurpose[]): Omit<ACAnalysis, 'key' | 'filled'> & { fills: ACParsedCriterion[]; traits: string[] } {
  const t = text.toLowerCase()
  const hits: Hit[] = []
  const grab = (re: RegExp) => text.match(re)?.[0] ?? ''
  const add = (id: string, value: string, re: RegExp) => { if (re.test(t)) hits.push({ id, value, phrase: grab(new RegExp(re.source, 'i')) }) }

  add('placement', '카카오톡 비즈보드', /카카오\S*/)
  add('placement', '네이버 메인', /네이버\S*/)
  add('placement', 'YouTube', /(유튜브|youtube)\S*/)
  add('placement', 'Instagram', /(인스타|instagram)\S*/)
  add('format', '동영상', /(동영상|영상|숏폼|쇼츠)\S*/)
  add('format', '이미지', /(이미지|배너)\S*/)
  add('buy', '보장형', /보장형\S*/)
  add('buy', '성과형', /성과형\S*/)
  add('device', '모바일', /모바일\S*/)
  add('video', '숏폼 세로형', /(숏폼|쇼츠)\S*/)

  // 특성: 카탈로그에 정의된 특성으로 매핑된 것만 반영 (정의서 4.4). 카탈로그 순서 유지
  const traits = AC_TRAIT_CATALOG.filter(d => d.pattern.test(text)).map(d => d.id)

  // 예산: 단일 금액이면 채우고, 범위면 후보만 제공
  const candidates: Record<string, string[]> = {}
  const toAmount = (n: string, unit: string) => String(Number(n.replace(/,/g, '')) * (unit === '천만' ? 1000 : 1))
  const range = text.match(/(\d[\d,]*)\s*[~\-]\s*(\d[\d,]*)\s*(천만|만)\s*원?/)
  const single = text.match(/(\d[\d,]*)\s*(천만|만)\s*원?/)
  let rangePhrase = ''
  if (range) { candidates.budget = [toAmount(range[1], range[3]), toAmount(range[2], range[3])]; rangePhrase = range[0] }
  else if (single) hits.push({ id: 'budget', value: toAmount(single[1], single[2]), phrase: single[0] })

  // 조건별로 모음
  const grouped: Record<string, Hit[]> = {}
  hits.forEach(h => { (grouped[h.id] = grouped[h.id] ?? []).push(h) })
  const toItem = (id: string, list: Hit[]): ACParsedCriterion => ({
    id,
    values: CONDITION_BY_ID[id].money ? [list[0].value] : orderValues(id, [...new Set(list.map(h => h.value))]),
    reason: `'${[...new Set(list.map(h => h.phrase))].join(', ')}' 표현에서 가져왔습니다`
  })
  const items = Object.entries(grouped).map(([id, list]) => toItem(id, list)).sort((a, b) => byCatalogOrder(a.id, b.id))

  const notes: ACAnalysis['notes'] = []
  const demo = text.match(/\d0대\s*(여성|남성)?|여성|남성|연령|성별/)
  if (demo) notes.push({ phrase: demo[0], reason: '연령·성별 기준은 아직 지원하지 않습니다' })
  const allocation = text.match(/\S*(배분|얼마씩)\S*/)
  if (allocation) notes.push({ phrase: allocation[0], reason: '예산 배분은 BudgetOpt 2.0에서 확인할 수 있습니다' })
  const PURPOSE_WORDS: Record<ACPurpose, string> = { awareness: '인지', view: '조회', traffic: '트래픽', conversion: '전환' }
  const conflict = (Object.keys(PURPOSE_WORDS) as ACPurpose[])
    .find(p => !purposes.includes(p) && new RegExp(`${PURPOSE_WORDS[p]}\\s*목적`).test(text))
  if (conflict) notes.push({ phrase: `${PURPOSE_LABELS[conflict]} 목적`, reason: '기본 정보에서 설정한 값이 우선 적용됩니다' })

  // 값이 확실하지 않은 기준은 빈 값 행으로 매핑하고 후보를 함께 보여 줌
  if (rangePhrase && !items.some(i => i.id === 'budget')) {
    items.push({ id: 'budget', values: [], reason: `'${rangePhrase}' 표현에서 찾았지만 금액이 하나로 정해지지 않았습니다` })
    items.sort((a, b) => byCatalogOrder(a.id, b.id))
  }

  return { fills: items, candidates, notes, traits }
}

/**
 * 분석 결과를 행에 반영. 사용자가 추가했거나 직접 고친 행은 그대로 두고,
 * 이전에 SpinX가 매핑한 행(사용자가 손대지 않은 행)은 새 결과로 바꿈. 새로 찾은 기준은 뒤에 붙임.
 */
export function applyFills(rows: ACCondition[], fills: ACParsedCriterion[]): { rows: ACCondition[]; filled: number } {
  const kept = rows.filter(r => r.source !== 'spinx')
  const added = fills
    .filter(f => !kept.some(r => r.id === f.id))
    .map(f => ({ id: f.id, values: f.values, source: 'spinx' as const, reason: f.reason }))
  return { rows: [...added, ...kept], filled: added.length }
}
