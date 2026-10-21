import { test as base, expect, chromium, Page, BrowserContext } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

// ESM 환경: __dirname 미정의 → import.meta.url로 이 파일의 디렉터리를 산출.
const FIXTURE_DIR = path.dirname(fileURLToPath(import.meta.url))

// ─────────────────────────────────────────────────────────────────────────────
// STG Sanity QA 공용 fixture / 유틸 / 상수
//
// 핵심: Playwright 기본 픽스처는 테스트마다 새 BrowserContext를 만든다 → CDP로 붙은
// 로그인 세션을 잃는다. 그래서 context/page를 오버라이드해 chromium.connectOverCDP로
// "사용자가 로그인해 둔 기존 Chrome"의 contexts()[0] / 기존 page를 그대로 재사용한다.
// 절대 새 컨텍스트를 만들지 않는다(세션 유실).
//
// HARD RULES(코드로 강제):
//  - 실제 삭제 금지 → 삭제는 모달 오픈까지만, Escape/취소로 닫는다. 확정 버튼 클릭 코드 없음.
//  - 로그아웃 클릭 금지 → 메뉴 노출만 확인.
//  - 생성 객체명은 전부 testName()을 거쳐 test_${QA_VERSION}_ prefix를 단다.
//  - 광고주 '(주)세정', 가시성 Private 고정. 공개(public) 슬롯 생성 금지.
//  - afterEach/afterAll 자동 cleanup 없음(다른 데이터 삭제 방지).
// ─────────────────────────────────────────────────────────────────────────────

// ── 상수 ─────────────────────────────────────────────────────────────────────
/** 슬롯 생성 시 사용할 광고주(요청: 나이키 대신 (주)세정). */
export const ADVERTISER = '(주)세정'
/** 가시성은 반드시 Private(비공개). 공개 슬롯 생성 금지. */
export const VISIBILITY_LABEL = /Private \(비공개\)/

export const CDP_PORT = process.env.QA_CDP_PORT || '9222'

// ── 통계 분류 / skip 사유 annotation (요청1·요청2) ────────────────────────────
// Playwright 선언형 annotation은 테스트 실행 여부와 무관하게 리포트 JSON의
// tests[0].annotations에 직렬화된다(조건부 skip/fixme여도 보존). 이 메커니즘으로
//  - excluded : 통계 분모에서 제외(권한·계정 의존 — 영구·의도적 제외, '수동 QA 대상')
//  - blocked  : 분모 포함, 아직 자동화되지 않은 미완 과제(사유 표시)
//  - skip-reason : 조건부 skip의 사유 표시(분모 포함)
// 세 가지를 모두 선언형 annotation 하나로 해결한다.
// (report.mjs는 이 annotation을 우선 읽고, 구버전 run JSON처럼 annotation이 없으면
//  정적 분류맵으로 폴백한다 — 사유는 실제 skip 조건 기반이며 지어내지 않는다.)
export const ANNO = {
  EXCLUDED: 'excluded',
  BLOCKED: 'blocked',
  SKIP_REASON: 'skip-reason',
} as const

/** 통계 분모에서 제외(권한·계정 의존). 리포트에 '수동 QA 대상'으로 노출 + 사유 표시. */
export function excluded(description: string) {
  return { annotation: [{ type: ANNO.EXCLUDED, description }] }
}
/** 분모 포함, 미완 자동화 과제. 실제 skip될 때만 리포트에 사유 표시(통과 전환 시 자동 숨김). */
export function blocked(description: string) {
  return { annotation: [{ type: ANNO.BLOCKED, description }] }
}
/** 분모 포함, 조건부 skip의 사유. 실제 skip될 때만 리포트에 사유 표시. */
export function skipReason(description: string) {
  return { annotation: [{ type: ANNO.SKIP_REASON, description }] }
}

/** config와 동일한 baseURL 산출 규칙(스펙에서 직접 참조할 때 사용). */
export const BASE_URL =
  process.env.QA_BASE_URL ||
  (process.env.QA_TARGET === 'prd'
    ? 'https://readyset.adly.co.kr'
    : 'https://stg.readyset.adly.co.kr')

// ── 이름 헬퍼 ────────────────────────────────────────────────────────────────
/**
 * 실행(회차) 타임스탬프. 한 전수 실행(한 Node 프로세스) 동안 1회만 계산해 공유한다
 * → 그 실행이 만든 모든 생성물이 같은 MMDD-HHMM을 달아 "언제/몇 회차 건지" 보드에서 바로 구분된다.
 * 형식: MMDD-HHMM (로컬 시간, 예: 1022-0806).
 */
export const RUN_STAMP = (() => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`
})()

/**
 * 생성 객체명 생성기. 모든 생성명은 이 헬퍼를 거쳐 그날 배포 버전 prefix + 실행 타임스탬프를 단다.
 * 형식: `test_${QA_VERSION}_${base}_${RUN_STAMP}` (예: test_v1.2.0_slot_1022-0806).
 *  - suffix에 말미 숫자 인덱스(_01 등)가 있으면 타임스탬프를 그 앞에 끼운다
 *    (예: testName('dataset_01') → test_v1.2.0_dataset_1022-0806_01) — 회차 구분 + 인덱스 보존.
 * QA_VERSION 미설정 시 안전 기본값 `test_vLOCAL_...` + 경고.
 * (주의: 고정 픽스처 슬롯 'test_fixture_slot'은 이 헬퍼를 거치지 않는다 — literalName 경로로 이름 고정 유지.)
 */
export function testName(suffix: string): string {
  const version = process.env.QA_VERSION
  const prefix = version ? `test_${version}_` : 'test_vLOCAL_'
  if (!version) {
    console.warn(
      '[STG QA] QA_VERSION 미설정 → 생성명에 안전 기본값 test_vLOCAL_ 사용. ' +
        '실제 배포 검증에서는 QA_VERSION=v1.2.0 식으로 반드시 지정하세요.'
    )
  }
  // 말미 숫자 인덱스가 있으면 타임스탬프를 인덱스 앞에 끼운다(base_STAMP_NN).
  const m = suffix.match(/^(.*)_(\d+)$/)
  if (m) {
    return `${prefix}${m[1]}_${RUN_STAMP}_${m[2]}`
  }
  return `${prefix}${suffix}_${RUN_STAMP}`
}

// ── 레이어(런치) 팝업 닫기 ───────────────────────────────────────────────────
/**
 * /slotboard 진입 시 뜨는 "BudgetOpt 2.0 신규 오픈!" 런치 팝업이 .dialog-overlay로
 * 포인터 이벤트를 가로챈다. 다른 조작 전 반드시 닫는다.
 * '닫기'만 사용한다. '오늘 하루 안 보기'는 이후 세션에 영향을 주므로 누르지 않는다.
 */
export async function dismissLaunchPopup(page: Page): Promise<void> {
  const popupClose = page.getByRole('button', { name: '닫기' })
  if (await popupClose.count()) {
    await popupClose.first().click().catch(() => {})
    await page.waitForTimeout(300)
  }
}

// ── 진입 안정화 ──────────────────────────────────────────────────────────────
/**
 * 공유 Chrome이 연속 상호작용에서 간헐적으로 응답 불능이 되므로, 진입을
 * domcontentloaded + 짧은 정착 대기로 안정화한다(dom-evidence 안정성 경고 반영).
 */
export async function gotoStable(page: Page, path: string): Promise<void> {
  // CDP로 붙은 기존 page에는 config baseURL이 적용되지 않는다(상대경로 goto가 invalid URL).
  // → BASE_URL을 직접 붙여 절대 URL로 이동한다.
  // 공유 Chrome이 간헐적으로 응답 지연 → goto는 기본 8s보다 넉넉한 20s로 흡수(dom-evidence 안정성 경고).
  // 한 번 타임아웃 시 1회 재시도(진입 안정화 — 셀렉터/로직 변경 아님).
  try {
    await page.goto(absUrl(path), { waitUntil: 'domcontentloaded', timeout: 20_000 })
  } catch {
    await page.waitForTimeout(1500)
    await page.goto(absUrl(path), { waitUntil: 'domcontentloaded', timeout: 20_000 })
  }
  await page.waitForTimeout(2500)
}

/** 상대 경로를 BASE_URL 기준 절대 URL로 변환. 이미 절대 URL이면 그대로. */
export function absUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return BASE_URL.replace(/\/$/, '') + (path.startsWith('/') ? path : '/' + path)
}

/**
 * 삭제 확인 모달을 안전하게 닫는다. 확정 버튼은 절대 누르지 않는다.
 * Escape → (남아있으면) '취소' 버튼 순으로 닫는다.
 */
export async function closeDeleteModal(page: Page): Promise<void> {
  await page.keyboard.press('Escape').catch(() => {})
  await page.waitForTimeout(300)
  const cancel = page.getByRole('button', { name: /^(취소|닫기)$/ })
  if (await cancel.count()) {
    await cancel.first().click().catch(() => {})
  }
}

// ── 실제 슬롯 생성 헬퍼 (교정 핵심) ───────────────────────────────────────────
/**
 * 슬롯을 실제로 생성한다(최종 '생성' 버튼까지 클릭). 교정 핵심:
 * 선행 구현은 폼만 채우고 생성 버튼을 안 눌렀는데, 사용자는 실제 생성을 원한다.
 *
 * 반드시 지키는 조건(HARD RULE):
 *  - 이름: testName(suffix) → test_${QA_VERSION}_ prefix
 *  - 광고주: (주)세정
 *  - 가시성: Private(비공개). public 슬롯 생성 금지.
 *  - 삭제/cleanup 없음. 생성 객체는 STG에 남긴다.
 *
 * 성공 판정: 실제 STG는 생성 후 슬롯 상세(/slotboard/{id})로 이동한다(런타임 확인).
 *  → URL이 /slotboard/{id}로 바뀌면 그 id를 slotId로 캡처.
 *  → 혹시 리스트로 돌아오면 방금 만든 이름의 카드 존재로 성공 판정하고 slotId=null.
 */
export async function createPrivateSlot(
  page: Page,
  suffixOrName = 'slot',
  opts?: { literalName?: boolean }
): Promise<{ name: string; slotId: string | null }> {
  // literalName:true → 문자열을 그대로 슬롯명으로(고정 식별자 'test_fixture_slot' 용).
  // 기본 → testName(suffix)로 test_${QA_VERSION}_ prefix를 단다(create-flow 거동 유지).
  const name = opts?.literalName ? suffixOrName : testName(suffixOrName)

  await gotoStable(page, '/slotboard')
  await dismissLaunchPopup(page)

  await page.getByRole('button', { name: 'New Slot' }).click()
  await expect(page.getByRole('heading', { name: '새 Slot 생성' })).toBeVisible()

  // 이름(반드시 test_v* prefix)
  await page.locator('input[placeholder="Slot명을 입력하세요"]').fill(name)

  // 광고주 (주)세정 — 커스텀 드롭다운. 검색 후 첫 옵션 클릭.
  await page.getByRole('button', { name: /광고주를 선택하세요/ }).click()
  await page.locator('input[placeholder="광고주 검색..."]').fill(ADVERTISER)
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: /\(주\)세정/ }).first().click()

  // 가시성 Private(비공개) — 공개 슬롯 금지
  await page.getByRole('button', { name: VISIBILITY_LABEL }).click()

  // 실제 '생성' 클릭(교정 핵심). '생성' 은 가시성 버튼 텍스트와 겹치므로 exact.
  await page.getByRole('button', { name: '생성', exact: true }).click()
  await page.waitForLoadState('domcontentloaded').catch(() => {})
  await page.waitForTimeout(3000)

  // 성공 판정 + slotId 캡처
  const m = page.url().match(/\/slotboard\/(\d+)/)
  if (m) {
    return { name, slotId: m[1] }
  }
  // 리스트로 돌아온 경우: 방금 만든 카드 존재로 성공 판정(폴백)
  await expect(page.getByRole('heading', { name }).first()).toBeVisible()
  return { name, slotId: null }
}

/**
 * 생성한 슬롯 내부로 진입한다. slotId가 있으면 상세로 직행, 없으면
 * /slotboard에서 이름 카드 클릭으로 진입(폴백). dismissLaunchPopup 포함.
 */
export async function enterSlot(page: Page, slotId: string | null, slotName?: string): Promise<void> {
  if (slotId) {
    await gotoStable(page, '/slotboard/' + slotId)
    await dismissLaunchPopup(page)
    return
  }
  await gotoStable(page, '/slotboard')
  await dismissLaunchPopup(page)
  if (slotName) {
    await page.getByRole('heading', { name: slotName }).first().click()
    await page.waitForTimeout(2000)
  }
}

/**
 * 리치커브/캠페인 기간 등 CustomDateRangePicker(react 캘린더)를 연 뒤
 * 첫 번째 보이는 달의 유효 범위(startDay→endDay)를 클릭한다.
 * 같은 숫자가 두 달에 모두 있으므로 .first()로 첫 달을 고른다.
 * 값 선택 이유: 당월 내 10~20일(유효·현재월·BO 90일 제한 이내)로 최소 통과.
 */
export async function pickDateRange(page: Page, triggerName: RegExp, startDay = '10', endDay = '20'): Promise<void> {
  await page.getByRole('button', { name: triggerName }).click()
  await page.waitForTimeout(700)
  await page.getByRole('button', { name: startDay, exact: true }).first().click()
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: endDay, exact: true }).first().click()
  await page.waitForTimeout(400)
}

// ── fixture-ids.json read/write ──────────────────────────────────────────────
/** 고정 픽스처 슬롯 메타데이터. 커밋에 포함(비밀정보 없음). */
export type FixtureIds = {
  slotId: string
  slotName: 'test_fixture_slot'
  createdAt: string
  qaVersion: string
  counts: { dataset: number; bo: number; rcrf: number; rcrp: number }
  /**
   * 완료(Completed) fixture 객체의 실제 STG id. 라이브 DOM(슬롯 148 목록)에서 수집한 값만 담는다.
   * 각 배열 원소는 결과 라우트에 끼울 숫자 id(문자열). 하드코딩 가짜 id 금지.
   * (옵셔널 — 완료분 수집 전 구버전 json과 하위호환.)
   */
  completed?: {
    bo: string[]
    rcRatioFinder: string[]
    rcReachPredictor: string[]
    dataset: string[]
  }
  note?: string
}

const FIXTURE_IDS_PATH = path.join(FIXTURE_DIR, 'fixture-ids.json')

/** fixture-ids.json을 읽는다. 파일이 없거나 JSON이 깨졌으면 null(→ 생성으로 폴백). */
export function readFixtureIds(): FixtureIds | null {
  try {
    const raw = fs.readFileSync(FIXTURE_IDS_PATH, 'utf8')
    return JSON.parse(raw) as FixtureIds
  } catch {
    return null
  }
}

/** fixture-ids.json을 2-space 들여쓰기 + 끝 개행으로 저장한다. */
export function writeFixtureIds(data: FixtureIds): void {
  fs.writeFileSync(FIXTURE_IDS_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

// ── 완료(Completed) fixture 소비 ──────────────────────────────────────────────
/** 고정 픽스처 슬롯 id. fixture-ids.json에서 읽고, 없으면 확정값 148로 폴백. */
export function fixtureSlotId(): string {
  return readFixtureIds()?.slotId || '148'
}

/** 라이브 STG에서 상태 '완료'로 표기되는 라벨(DOM 확정). RC/BO는 셀에 완료일시가 붙어 'Completed{일시}'로 보임. */
export const FIXTURE_COMPLETED_LABEL = /Completed/

type CompletedModule = 'bo' | 'rcRatioFinder' | 'rcReachPredictor' | 'dataset'

/** 수집해 둔 완료 fixture id 배열을 읽는다. 없으면 빈 배열(해당 결과 TC는 skip 가드). */
export function completedIds(module: CompletedModule): string[] {
  return readFixtureIds()?.completed?.[module] ?? []
}

/**
 * 완료 fixture의 결과 화면 라우트를 만든다(라이브 DOM에서 확정한 STG 경로).
 *  - bo               → /slots/{slot}/budgetopt/scenarios/{id}/result
 *  - rcRatioFinder    → /slots/{slot}/reachcaster/scenarios/{id}/ratio-finder/result
 *  - rcReachPredictor → /slots/{slot}/reachcaster/scenarios/{id}/reach-predictor/result
 *  - dataset          → /slots/{slot}/datashot/datasets/{id}
 */
export function resultPath(module: CompletedModule, id: string): string {
  const slot = fixtureSlotId()
  switch (module) {
    case 'bo':
      return `/slots/${slot}/budgetopt/scenarios/${id}/result`
    case 'rcRatioFinder':
      return `/slots/${slot}/reachcaster/scenarios/${id}/ratio-finder/result`
    case 'rcReachPredictor':
      return `/slots/${slot}/reachcaster/scenarios/${id}/reach-predictor/result`
    case 'dataset':
      return `/slots/${slot}/datashot/datasets/${id}`
  }
}

/**
 * 완료 fixture 결과 화면으로 진입한다(첫 완료 id 기본). 완료 id가 없으면 null 반환(호출부 skip 가드).
 * gotoStable + 런치 팝업 닫기 + 결과 렌더 정착 대기.
 */
export async function enterResult(
  page: Page,
  module: CompletedModule,
  index = 0
): Promise<string | null> {
  const ids = completedIds(module)
  if (!ids.length || !ids[index]) return null
  const id = ids[index]
  await gotoStable(page, resultPath(module, id))
  await dismissLaunchPopup(page)
  await page.waitForTimeout(1500)
  return id
}

/**
 * BO/RC 결과 화면에서 SpinX 패널을 연다. STG 결과 화면엔 우하단 FAB(aria-label="Open SpinX assistant")가
 * 렌더되지 않고, 닫힘 상태 'Ask SpinX' 말풍선 + 인라인 트리거('최적화 원리 알아보기'/'이어서 질문하기')로만 연다.
 * 패널 열림 판정: 닫힘 말풍선 'Ask SpinX'가 사라진다(SpinXButton 근거).
 * 트리거를 못 찾으면 false 반환(호출부에서 사유와 함께 처리).
 */
export async function openSpinXPanel(page: Page): Promise<boolean> {
  // 패널 닫혀 있으면 'Ask SpinX' 말풍선이 보임. 이미 열려 있으면(textarea 존재) 바로 true.
  if ((await page.locator('button[title="대화 초기화"]').count()) > 0) return true
  // 1순위: 헤더/차트의 '최적화 원리 알아보기'(BO) 또는 '이어서 질문하기'(BO/RC 차트 인사이트)
  const principle = page.getByText('최적화 원리 알아보기').first()
  const followUp = page.getByRole('button', { name: /이어서 질문하기/ }).first()
  let trigger: ReturnType<Page['getByText']> | ReturnType<Page['getByRole']> | null = null
  if (await principle.count()) trigger = principle
  else if (await followUp.count()) {
    // 차트 인사이트 타이핑 애니메이션 완료 후에만 노출 → 넉넉히 대기
    await followUp.waitFor({ state: 'visible', timeout: 20_000 }).catch(() => {})
    if (await followUp.count()) trigger = followUp
  }
  if (!trigger) return false
  await trigger.click()
  await page.waitForTimeout(2000)
  // 열림 판정: 패널 입력(textarea) 또는 초기화 버튼 등장
  return (
    (await page.locator('textarea').count()) > 0 ||
    (await page.locator('button[title="대화 초기화"]').count()) > 0
  )
}

/**
 * Reach Predictor 결과 화면에서 "시나리오 비교"를 수행한다.
 * 1) 비교 설정 섹션으로 스크롤 → 2) 비교 유형(타겟 비교) 선택 → 3) '비교 시나리오 추가' →
 * 4) 다른 완료 시나리오(2번째) 선택 → 5) '비교 결과 보기' 클릭.
 * 공유 Chrome 뷰포트 이슈(요소가 뷰포트 밖)로 클릭이 막히므로 DOM click()으로 우회한다.
 * 2번째로 선택할 시나리오명(prefix). 반환: 비교 결과 진입 성공 여부.
 */
export async function openScenarioComparison(page: Page, secondScenarioName: string): Promise<boolean> {
  // 비교 설정 섹션으로 스크롤
  await page.evaluate(() => {
    const el = [...document.querySelectorAll('*')].find(
      (n) => (n.textContent || '').trim() === '시나리오 비교 설정'
    )
    el?.scrollIntoView({ block: 'center' })
  })
  await page.waitForTimeout(600)
  // 비교 유형 선택(타겟 비교 — 동일 예산·기간 조건이라 가장 단순)
  const typeBtn = page.getByRole('button', { name: /타겟 비교/ }).first()
  if (!(await typeBtn.count())) return false
  await typeBtn.evaluate((b: HTMLElement) => b.click())
  await page.waitForTimeout(1200)
  // 비교 시나리오 추가
  const addBtn = page.getByRole('button', { name: /비교 시나리오 추가/ }).first()
  if (!(await addBtn.count())) return false
  await addBtn.evaluate((b: HTMLElement) => b.click())
  await page.waitForTimeout(2000)
  // 2번째 완료 시나리오 선택(이름 포함 + '비교 적합' 라벨)
  const picked = await page.evaluate((name: string) => {
    const opt = [...document.querySelectorAll('button, li, tr, label, div')].find((n) => {
      const t = (n.textContent || '').replace(/\s+/g, ' ').trim()
      return t.includes(name) && t.includes('비교 적합') && t.length < 60
    }) as HTMLElement | undefined
    if (opt) {
      opt.click()
      return true
    }
    return false
  }, secondScenarioName)
  if (!picked) return false
  await page.waitForTimeout(1500)
  // 비교 결과 보기(활성화되면 클릭)
  const viewBtn = page.getByRole('button', { name: /비교 결과 보기/ }).first()
  if (!(await viewBtn.count()) || (await viewBtn.isDisabled().catch(() => true))) return false
  await viewBtn.evaluate((b: HTMLElement) => b.click())
  await page.waitForTimeout(4000)
  return true
}

// ── 고정 픽스처 슬롯 확보 ─────────────────────────────────────────────────────
/**
 * 테스트 전용 고정 슬롯('test_fixture_slot')을 확보한다.
 * (a) fixture-ids.json에 유효한 slotId가 있고 그 슬롯이 STG에 아직 있으면 재사용.
 * (b) 없으면 createPrivateSlot(literalName)로 새로 만든다(고정명·(주)세정·Private).
 * 삭제/cleanup 없음. 슬롯명은 고정 식별자이므로 testName()을 거치지 않는다(DECIDED DESIGN 1).
 */
export async function ensureFixtureSlot(
  page: Page
): Promise<{ slotId: string; slotName: 'test_fixture_slot'; reused: boolean }> {
  const SLOT_NAME = 'test_fixture_slot' as const
  const existing = readFixtureIds()
  if (existing && existing.slotId) {
    // 아직 존재하는지 확인: 상세로 이동 후 URL이 /slotboard/{id}로 유지되면 존재.
    await gotoStable(page, '/slotboard/' + existing.slotId)
    await dismissLaunchPopup(page)
    const m = page.url().match(/\/slotboard\/(\d+)/)
    if (m && m[1] === existing.slotId) {
      return { slotId: existing.slotId, slotName: SLOT_NAME, reused: true }
    }
    // 리다이렉트됨 → 슬롯이 사라진 것. 아래에서 재생성.
  }
  const r = await createPrivateSlot(page, SLOT_NAME, { literalName: true })
  if (!r.slotId) {
    throw new Error('[STG QA] 고정 픽스처 슬롯 생성 후 slotId를 캡처하지 못했습니다.')
  }
  return { slotId: r.slotId, slotName: SLOT_NAME, reused: false }
}

// ── 모듈별 생성 헬퍼 (create-flow.spec.ts에서 추출, 거동 동일) ────────────────
// 각 헬퍼는 "이미 testName(...)으로 해석된 전체 객체명"을 받는다. create-flow는
// testName('dataset') 식으로, setup 루프는 testName('dataset_01') 식으로 같은 본문을 공유한다.

/** DataShot 데이터셋 생성(즉시 생성). 본문은 CREATE-FLOW-002와 동일. */
export async function createDataset(page: Page, slotId: string, name: string): Promise<void> {
  await gotoStable(page, '/slots/' + slotId + '/datashot')
  await dismissLaunchPopup(page)
  await page.getByRole('button', { name: 'New Dataset' }).click()
  await expect(page.getByRole('heading', { name: '새 데이터셋 생성' })).toBeVisible()

  // ── Step1: 기본 정보 ──
  await page.locator('input[placeholder="데이터셋명을 입력하세요."]').fill(name)
  // 지표 구성: '성과 지표'(external) 선택 — 후속 입력이 더 단순한 쪽. 최소 통과값.
  await page.getByRole('button', { name: /성과 지표/ }).click()
  // 조회기간(MonthRangePicker): 좌측 패널(2025) 3월→5월. 유효 조회기간 중 가장 단순한 범위.
  await page.getByRole('button', { name: /시작월/ }).click()
  await page.waitForTimeout(700)
  await page.getByRole('button', { name: '3월', exact: true }).first().click()
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: '5월', exact: true }).first().click()
  await page.waitForTimeout(400)
  // 업종: 커스텀 div → IndustryDialog → 대분류 → '식품' → 선택 완료. 최소 선택.
  await page.getByText('업종을 선택하세요.').click()
  await page.waitForTimeout(800)
  await page.getByRole('button', { name: '대분류', exact: true }).click()
  await page.waitForTimeout(600)
  await page.getByText(/^식품 \(\d+\)/).click()
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: /선택 완료/ }).click()
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: '다음' }).click()
  await page.waitForTimeout(1500)

  // ── Step2: 상세 설정(매체 · 상품 · 지표) ──
  await page.getByRole('button', { name: 'Google Ads', exact: true }).click()
  await page.waitForTimeout(800)
  await page.getByText('실적 최대화', { exact: true }).click()
  await page.waitForTimeout(300)
  await page.getByText(/클릭당 비용\(CPC\)/).click()
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: '다음' }).click()
  await page.waitForTimeout(1500)

  // ── Step3: 검토 및 추출 → 최종 생성 요청(실제 클릭) ──
  await page.getByRole('button', { name: /데이터셋 생성 요청/ }).click()
  await page.waitForTimeout(3500)

  await expect
    .poll(() => page.url(), { timeout: 8000 })
    .toContain('/slots/' + slotId + '/datashot')
}

/** BudgetOpt 2.0 시나리오 생성 요청(완료 대기 안 함). 본문은 CREATE-FLOW-003과 동일. */
export async function createBoScenario(page: Page, slotId: string, name: string): Promise<void> {
  await gotoStable(page, '/slots/' + slotId + '/budgetopt/scenarios/new')
  await dismissLaunchPopup(page)
  if (!page.url().includes('/scenarios/new')) {
    await gotoStable(page, '/slots/' + slotId + '/budgetopt')
    await dismissLaunchPopup(page)
    await page.getByRole('button', { name: 'New Scenario' }).click()
  }
  await expect(page.getByRole('heading', { name: '새 시나리오 생성' })).toBeVisible()

  // ── Step1: 기본 정보 ──
  await page.locator('input[placeholder="시나리오명을 입력하세요."]').fill(name)
  await page.getByRole('button', { name: '브랜드를 선택하세요' }).click()
  await page.waitForTimeout(500)
  await page.locator('.dropdown-item, .dropdown button').first().click()
  await page.waitForTimeout(500)
  await pickDateRange(page, /시작일/)
  await page.getByRole('button', { name: /노출 \(Impression\)/ }).click()
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: '다음' }).click()
  await page.waitForTimeout(1500)

  // ── Step2: 매체 선택 및 예산 ──
  await page.locator('input[placeholder="총 예산을 입력하세요"]').fill('100000000')
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: /매체 · 상품 추가/ }).click()
  await page.waitForTimeout(1200)
  await page.getByRole('button', { name: '전체 선택', exact: true }).first().click()
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: /확인 \(\d+개 선택\)/ }).click()
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: '다음' }).click()
  await page.waitForTimeout(1500)

  // ── Step3: 검토 및 실행 → 최종 생성 요청(실제 클릭, 완료 대기 안 함) ──
  await page.getByRole('button', { name: /시나리오 생성 요청/ }).click()
  await page.waitForTimeout(3500)

  await expect
    .poll(() => page.url(), { timeout: 8000 })
    .toContain('/slots/' + slotId + '/budgetopt')
}

/** Reach Caster Ratio Finder 시나리오 생성 요청(완료 대기 안 함). 본문은 CREATE-FLOW-004와 동일. */
export async function createRcRatioFinder(page: Page, slotId: string, name: string): Promise<void> {
  await gotoStable(page, '/slots/' + slotId + '/reachcaster/scenarios/new')
  await dismissLaunchPopup(page)
  if (!page.url().includes('/scenarios/new')) {
    await gotoStable(page, '/slots/' + slotId + '/reachcaster')
    await dismissLaunchPopup(page)
    await page.getByRole('button', { name: 'New Scenario' }).click()
  }
  await expect(page.getByRole('heading', { name: '새 시나리오 생성' })).toBeVisible()

  // ── Step1: 기본 정보 (Ratio Finder) ──
  await page.locator('input[placeholder="시나리오명을 입력하세요."]').fill(name)
  await page.getByRole('button', { name: /Ratio Finder/ }).click()
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: '브랜드를 선택하세요' }).click()
  await page.waitForTimeout(500)
  await page.locator('.dropdown-item, .dropdown button').first().click()
  await page.waitForTimeout(500)
  await pickDateRange(page, /시작일/)
  await page.getByRole('button', { name: '다음' }).click()
  await page.waitForTimeout(1500)

  // ── Step2: 상세 설정(예산·시뮬레이션 단위·매체비중) ──
  await page.locator('input[placeholder="예산을 입력하세요"]').fill('100000000')
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: '10%', exact: true }).click()
  await page.waitForTimeout(400)
  // DIGITAL: 첫 매체 체크 → 상품 추가 → 상품 1개(단일=비중 100% 자동)
  await page.getByRole('button', { name: 'DIGITAL', exact: true }).click()
  await page.waitForTimeout(400)
  await page.locator('input[type="checkbox"]:visible').first().check()
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: /상품 추가/ }).first().click()
  await page.waitForTimeout(1000)
  await page.locator('.dialog-content label, [class*="dialog"] label').first().click()
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: /확인 \(\d+개 선택\)/ }).click()
  await page.waitForTimeout(700)
  // TVC: 첫 매체 체크 → 채널 추가 → 채널 1개
  await page.getByRole('button', { name: 'TVC', exact: true }).click()
  await page.waitForTimeout(500)
  await page.locator('input[type="checkbox"]:visible').first().check()
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: /채널 추가/ }).first().click()
  await page.waitForTimeout(1000)
  await page.locator('.dialog-content label, [class*="dialog"] label').first().click()
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: /확인 \(\d+개 선택\)/ }).click()
  await page.waitForTimeout(700)
  await page.getByRole('button', { name: '다음' }).click()
  await page.waitForTimeout(1500)

  // ── Step3: 검토 및 실행 → 최종 생성 요청(실제 클릭, 완료 대기 안 함) ──
  await page.getByRole('button', { name: /시나리오 생성 요청/ }).click()
  await page.waitForTimeout(3500)

  await expect
    .poll(() => page.url(), { timeout: 8000 })
    .toContain('/slots/' + slotId + '/reachcaster')
}

/** Reach Caster Reach Predictor 시나리오 생성 요청(완료 대기 안 함). 본문은 CREATE-FLOW-005와 동일. */
export async function createRcReachPredictor(page: Page, slotId: string, name: string): Promise<void> {
  await gotoStable(page, '/slots/' + slotId + '/reachcaster/scenarios/new')
  await dismissLaunchPopup(page)
  if (!page.url().includes('/scenarios/new')) {
    await gotoStable(page, '/slots/' + slotId + '/reachcaster')
    await dismissLaunchPopup(page)
    await page.getByRole('button', { name: 'New Scenario' }).click()
  }
  await expect(page.getByRole('heading', { name: '새 시나리오 생성' })).toBeVisible()

  // ── Step1: 기본 정보 (Reach Predictor) ──
  await page.locator('input[placeholder="시나리오명을 입력하세요."]').fill(name)
  await page.getByRole('button', { name: /Reach Predictor/ }).click()
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: '브랜드를 선택하세요' }).click()
  await page.waitForTimeout(500)
  await page.locator('.dropdown-item, .dropdown button').first().click()
  await page.waitForTimeout(500)
  await pickDateRange(page, /시작일/)
  await page.getByRole('button', { name: '다음' }).click()
  await page.waitForTimeout(1500)

  // ── Step2: 분석 대상 매체 + 리치커브 ──
  await page.getByRole('button', { name: /매체 · 상품\(채널\) 추가/ }).click()
  await page.waitForTimeout(1200)
  await page.getByRole('button', { name: '전체 선택', exact: true }).first().click()
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: /확인 \(\d+개 선택\)/ }).click()
  await page.waitForTimeout(1000)
  const budgets = page.locator('input[placeholder="0"]:visible')
  const bn = await budgets.count()
  for (let i = 0; i < bn; i++) {
    await budgets.nth(i).fill('10000000')
    await page.waitForTimeout(120)
  }
  await page.locator('input[placeholder="최소값"]').fill('10000000')
  await page.waitForTimeout(200)
  await page.locator('input[placeholder="최대값"]').fill('100000000')
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: '다음' }).click()
  await page.waitForTimeout(1500)

  // ── Step3: 검토 및 실행 → 최종 생성 요청(실제 클릭, 완료 대기 안 함) ──
  await page.getByRole('button', { name: /시나리오 생성 요청/ }).click()
  await page.waitForTimeout(3500)

  await expect
    .poll(() => page.url(), { timeout: 8000 })
    .toContain('/slots/' + slotId + '/reachcaster')
}

// ── 리스트 멱등 카운트 ────────────────────────────────────────────────────────
/** 정규식 특수문자 이스케이프(이름 prefix를 안전하게 RegExp로 쓰기 위함). */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 모듈 리스트에서 namePrefix로 시작하는 기존 객체 수를 센다(멱등 재실행의 부족분 계산용).
 * 검색 버튼 → 노출된 입력에 prefix 입력 → 필터된 목록에서 텍스트 매칭 개수 반환.
 * DataShot/RC는 .card(h3) 텍스트, BO는 table <tr> 셀 텍스트 — getByText(RegExp)가 둘 다 커버.
 * 검색이 불가하거나 목록이 비면 0 반환(루프가 target까지 채우려 시도; 삭제는 절대 없음).
 */
export async function countListMatches(
  page: Page,
  slotId: string,
  module: 'datashot' | 'budgetopt' | 'reachcaster',
  namePrefix: string
): Promise<number> {
  const placeholder =
    module === 'datashot'
      ? '데이터셋명, 생성자'
      : module === 'budgetopt'
      ? '시나리오명, 생성자 검색'
      : '시나리오명, 생성자'

  await gotoStable(page, '/slots/' + slotId + '/' + module)
  await dismissLaunchPopup(page)

  const searchBtn = page.getByRole('button', { name: '검색' })
  if (!(await searchBtn.count())) return 0
  await searchBtn.first().click().catch(() => {})
  await page.waitForTimeout(500)

  const input = page.locator(`input[placeholder="${placeholder}"]`)
  if (!(await input.count())) return 0
  await input.first().fill(namePrefix)
  await page.waitForTimeout(1200)

  // 필터된 목록에서 prefix로 시작하는 텍스트 노드 수. 카드/테이블 공통.
  const matches = page.getByText(new RegExp(escapeRegExp(namePrefix)))
  return await matches.count().catch(() => 0)
}

// ── 결과 화면 헤더 메뉴 ───────────────────────────────────────────────────────
/**
 * 결과 화면 헤더(.slot-detail-header)의 아이콘 전용 버튼을 순회해, 클릭 시 probeText가
 * 보이는 메뉴를 연다. STG 결과 헤더엔 Export(Copy Link/Excel) 버튼과 컨텍스트(복제/이동/삭제)
 * 버튼이 아이콘으로만 있어 role/title로 특정 불가 → 순회가 유일하게 안정적(budgetopt-result 패턴).
 * 반환: 메뉴를 찾아 열었으면 true.
 */
export async function openHeaderMenu(page: Page, probeText: string | RegExp): Promise<boolean> {
  const headerButtons = page.locator('.slot-detail-header button')
  const count = await headerButtons.count()

  // 한 버튼을 클린 상태에서 눌러 probeText가 뜨는지 확인하는 공통 헬퍼.
  const tryButton = async (i: number): Promise<boolean> => {
    // 직전 버튼이 연 드롭다운/모달 오버레이를 먼저 확실히 닫는다(2회 Escape + 대기).
    // RC 결과 헤더의 '상세 보기' 버튼은 모달을 열어 이후 클릭을 가로채므로, 정리가 필수다(실측).
    await page.keyboard.press('Escape').catch(() => {})
    await page.waitForTimeout(150)
    await page.keyboard.press('Escape').catch(() => {})
    await page.waitForTimeout(150)
    await headerButtons.nth(i).click().catch(() => {})
    // 드롭다운/메뉴가 렌더될 시간을 준다(클릭 직후 즉시 isVisible은 메뉴 미등장 → 오탐).
    await page.waitForTimeout(500)
    return page.getByText(probeText).first().isVisible({ timeout: 1000 }).catch(() => false)
  }

  // 한 locator 버튼을 클린 상태에서 눌러 probeText가 뜨는지 확인.
  const tryLocator = async (loc: ReturnType<Page['locator']>): Promise<boolean> => {
    if (!(await loc.count())) return false
    await page.keyboard.press('Escape').catch(() => {})
    await page.waitForTimeout(150)
    await page.keyboard.press('Escape').catch(() => {})
    await page.waitForTimeout(150)
    await loc.first().click().catch(() => {})
    await page.waitForTimeout(500)
    return page.getByText(probeText).first().isVisible({ timeout: 1000 }).catch(() => false)
  }

  // 메뉴가 달린 아이콘 버튼을 먼저 직접 노린다. 결과 헤더엔 '상세 보기' 모달을 여는 버튼이 섞여 있어
  // (특히 RC) 전체 순회 중 그 모달이 이후 클릭을 가로챈다. 메뉴는 항상 아래 두 아이콘에만 있다:
  //  - ellipsis(more-vertical): 컨텍스트 메뉴(복제/이동/삭제)
  //  - share-2: Export 메뉴(Copy Link/Export to Excel/PDF)
  const ellipsis = page.locator('.slot-detail-header button:has(svg.lucide-ellipsis-vertical), .slot-detail-header button:has(svg.lucide-more-vertical)')
  const share = page.locator('.slot-detail-header button:has(svg.lucide-share-2)')
  if (await tryLocator(ellipsis)) return true
  if (await tryLocator(share)) return true

  // 폴백: 위 두 아이콘으로 못 찾으면 전체 버튼을 클린-순회.
  for (let i = 0; i < count; i++) {
    if (await tryButton(i)) return true
  }
  await page.keyboard.press('Escape').catch(() => {})
  return false
}

/**
 * 고정 슬롯 BO 목록에서 prefix로 시작하는 행 수를 센다(복제 +1 검증용).
 * 검색 입력에 prefix를 넣어 필터 후 tbody tr 매칭 수를 반환.
 */
export async function countBoRows(page: Page, prefix: string): Promise<number> {
  await gotoStable(page, '/slots/' + fixtureSlotId() + '/budgetopt')
  await dismissLaunchPopup(page)
  const searchBtn = page.getByRole('button', { name: '검색' })
  if (await searchBtn.count()) {
    await searchBtn.first().click().catch(() => {})
    await page.waitForTimeout(400)
  }
  const input = page.locator('input[placeholder="시나리오명, 생성자 검색"]')
  if (await input.count()) {
    await input.first().fill(prefix)
    await page.waitForTimeout(1500)
  }
  return await page.locator('tbody tr', { hasText: prefix }).count()
}

// ── CDP fixture ──────────────────────────────────────────────────────────────
/**
 * context/page를 오버라이드해 CDP로 붙은 기존 로그인 컨텍스트/페이지를 재사용한다.
 * teardown에서 browser.close()를 호출하지 않는다(사용자 Chrome 유지) — 연결만 해제.
 */
export const test = base.extend<{ context: BrowserContext; page: Page }>({
  context: async ({}, use) => {
    const browser = await chromium.connectOverCDP('http://localhost:' + CDP_PORT)
    const contexts = browser.contexts()
    if (!contexts.length) {
      throw new Error(
        `[STG QA] CDP(:${CDP_PORT})에 기존 컨텍스트가 없습니다. ` +
          '디버그 Chrome을 띄우고 STG에 로그인했는지 확인하세요(e2e/stg/README.md).'
      )
    }
    const ctx = contexts[0]
    await use(ctx)
    // 공유 Chrome이므로 컨텍스트/브라우저를 닫지 않는다. CDP 연결만 해제.
    await browser.close()
  },
  page: async ({ context }, use) => {
    const pages = context.pages()
    const page = pages.find((p) => p.url().includes('readyset')) || pages[0]
    if (!page) {
      throw new Error('[STG QA] 재사용할 기존 page를 찾지 못했습니다. STG 탭이 열려 있는지 확인하세요.')
    }
    page.setDefaultTimeout(8000)
    await use(page)
    // page도 닫지 않는다(사용자 세션 유지).
  }
})

export { expect }
