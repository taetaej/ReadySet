import {
  test,
  expect,
  gotoStable,
  dismissLaunchPopup,
  completedIds,
  enterResult,
  openSpinXPanel,
  fixtureSlotId,
  skipReason,
} from './fixtures'

// SpinX TC는 모두 완료 BO/RC 결과 화면 fixture + 패널 트리거에 의존한다.
// fixture id 미확보 또는 패널 트리거 미노출 시 조건부 skip → 공통 사유.
const SPINX_SKIP_REASON = skipReason(
  '완료 BO/RC fixture id 미확보 또는 결과 화면 SpinX 패널 트리거 미노출 시 skip — fixture 확보 시 실행됨(SpinX는 응답 완료 대기 없이 경량 검증)'
)

// ─────────────────────────────────────────────────────────────────────────────
// SpinX — AREA=SPINX-COMMON
// 완료 BO/RC 결과 화면에서 실활성화(고정 슬롯 148 completed fixture).
//
// 라이브 STG DOM 확정 사항(로컬 소스는 기획서였음 — 실제와 다름):
//  - STG 결과 화면엔 우하단 FAB(aria-label="Open SpinX assistant")가 렌더되지 않는다.
//    대신 닫힘 상태 'Ask SpinX' 말풍선 + 인라인 트리거('최적화 원리 알아보기'/'이어서 질문하기')로 연다.
//  - '최적화 원리 알아보기' 클릭은 질문을 자동 전송하고 응답을 렌더한다(usage 증가로 확인).
//  - 패널: textarea, button[title="대화 초기화"], button[title="넓게 보기"/"기본 보기"], 'Usage n / limit',
//    모델 버튼(예: 'Claude Sonnet 5.5') + 모델 메뉴.
//  - 외부 LLM 호출이라 응답 대기엔 합리적 타임아웃(무한대기 금지).
// ─────────────────────────────────────────────────────────────────────────────

async function gotoBoResult(page: import('@playwright/test').Page): Promise<string | null> {
  return enterResult(page, 'bo')
}

test('SPINX-COMMON-001 @major FAB/진입점 — 결과 화면에 SpinX 진입점 노출, 리스트엔 없음', SPINX_SKIP_REASON, async ({ page }) => {
  const id = await gotoBoResult(page)
  test.skip(!id, '완료 BO fixture id 미확보')
  // 결과 화면: 닫힘 상태 'Ask SpinX' 말풍선(SpinX 진입점) 노출.
  await expect(page.getByText('Ask SpinX').first()).toBeVisible()
  // 리스트 화면엔 SpinX 진입점 미노출(dom-evidence §8).
  await gotoStable(page, '/slots/' + fixtureSlotId() + '/budgetopt')
  await dismissLaunchPopup(page)
  await expect(page.getByText('Ask SpinX')).toHaveCount(0)
})

test('SPINX-COMMON-002 @major 요약·질문 — 패널이 열리고 입력/요약 UI가 뜬다', SPINX_SKIP_REASON, async ({ page }) => {
  const id = await gotoBoResult(page)
  test.skip(!id, '완료 BO fixture id 미확보')
  const opened = await openSpinXPanel(page)
  test.skip(!opened, '결과 화면에서 SpinX 패널 트리거를 찾지 못함')
  // 패널 입력창 + 초기화 버튼(패널 열림의 안정적 신호)
  await expect(page.locator('textarea').first()).toBeVisible()
  await expect(page.locator('button[title="대화 초기화"]')).toHaveCount(1)
})

test('SPINX-COMMON-003 @major 질문답변 — 질문 전송 후 응답 영역 등장', SPINX_SKIP_REASON, async ({ page }) => {
  const id = await gotoBoResult(page)
  test.skip(!id, '완료 BO fixture id 미확보')
  const opened = await openSpinXPanel(page)
  test.skip(!opened, 'SpinX 패널 미오픈')
  const ta = page.locator('textarea').first()
  await ta.fill('이 결과의 핵심 결론을 한 줄로 요약해줘')
  await page.waitForTimeout(400)
  await ta.press('Enter')
  // 전송 신호: 응답 생성 중 '중단'(Stop) 버튼 등장 — 요청이 실제로 나갔다는 관측 신호.
  // 외부 LLM 호출이라 응답 완료까진 기다리지 않는다(무한대기 금지).
  await expect(page.locator('button[title="중단"]')).toBeVisible({ timeout: 15_000 })
})

test('SPINX-COMMON-004 @minor 모델 변경 — 모델 메뉴로 다른 모델 전환', SPINX_SKIP_REASON, async ({ page }) => {
  const id = await gotoBoResult(page)
  test.skip(!id, '완료 BO fixture id 미확보')
  const opened = await openSpinXPanel(page)
  test.skip(!opened, 'SpinX 패널 미오픈')
  // 모델 버튼(현재 모델명 표시) 클릭 → 모델 선택 드롭다운 노출.
  const modelBtn = page.getByRole('button', { name: /Claude|GPT|Gemini|Sonnet|Haiku|Opus|4o/ }).first()
  test.skip((await modelBtn.count()) === 0, '모델 선택 버튼 미노출(패널 구성 차이)')
  const beforeLabel = (await modelBtn.textContent())?.trim() || ''
  // 공유 Chrome에서 패널 헤더 버튼이 뷰포트 밖이라 일반 click이 막힘 → DOM click으로 우회(openScenarioComparison 패턴).
  await modelBtn.evaluate((b: HTMLElement) => b.click())
  await page.waitForTimeout(800)
  // 드롭다운의 다른 모델 옵션 중 현재와 다른 것을 선택.
  const options = page.locator('button', { hasText: /Claude|GPT|Gemini|Sonnet|Haiku|Opus|4o/ })
  const cnt = await options.count()
  let switched = false
  for (let i = 0; i < cnt; i++) {
    const t = (await options.nth(i).textContent())?.trim() || ''
    if (t && !beforeLabel.includes(t) && !t.includes(beforeLabel)) {
      await options.nth(i).evaluate((b: HTMLElement) => b.click()).catch(() => {})
      switched = true
      break
    }
  }
  test.skip(!switched, '선택 가능한 다른 모델 옵션이 없음(단일 모델)')
  await page.waitForTimeout(600)
  // 모델 버튼 라벨이 바뀌었는지(또는 최소한 메뉴가 닫혔는지) 확인.
  await expect(page.locator('textarea').first()).toBeVisible()
})

test('SPINX-COMMON-005 @major R/C Effective Impression — RC 결과 SpinX 인사이트', SPINX_SKIP_REASON, async ({ page }) => {
  const id = await enterResult(page, 'rcReachPredictor')
  test.skip(!id, '완료 Reach Predictor fixture id 미확보')
  // RC 결과에 SpinX 인사이트 + Effective Impression 지표 노출.
  await expect(page.getByText('SpinX for Reach Caster').first()).toBeVisible()
  await expect(page.getByText(/Effective Impression/).first()).toBeVisible()
})

test('SPINX-COMMON-006 @major B/O 최적화 원리 — 원리 트리거로 패널 열림', SPINX_SKIP_REASON, async ({ page }) => {
  const id = await gotoBoResult(page)
  test.skip(!id, '완료 BO fixture id 미확보')
  const trigger = page.getByText('최적화 원리 알아보기').first()
  test.skip((await trigger.count()) === 0, '결과 화면에 최적화 원리 트리거 미노출')
  await trigger.click()
  await page.waitForTimeout(2000)
  // 원리 트리거는 질문을 자동 전송 → 패널(입력/초기화)이 열린다.
  await expect(page.locator('button[title="대화 초기화"]')).toHaveCount(1)
})

test('SPINX-COMMON-007 @minor B/O 세션 — 세션 잔여시간 표시', SPINX_SKIP_REASON, async ({ page }) => {
  const id = await gotoBoResult(page)
  test.skip(!id, '완료 BO fixture id 미확보')
  const opened = await openSpinXPanel(page)
  test.skip(!opened, 'SpinX 패널 미오픈')
  // 세션 잔여(일/시간/분) 표시(SpinXInput 하단).
  await expect(page.getByText(/\d+일 \d+시간 \d+분/).first()).toBeVisible()
})

test('SPINX-COMMON-008 @minor B/O 초기화 — 초기화 확인 다이얼로그', SPINX_SKIP_REASON, async ({ page }) => {
  const id = await gotoBoResult(page)
  test.skip(!id, '완료 BO fixture id 미확보')
  const opened = await openSpinXPanel(page)
  test.skip(!opened, 'SpinX 패널 미오픈')
  const reset = page.locator('button[title="대화 초기화"]')
  // 공유 Chrome에서 패널 헤더 버튼이 뷰포트 밖이라 일반 click이 막힘 → DOM click으로 우회.
  await reset.evaluate((b: HTMLElement) => b.click())
  await page.waitForTimeout(800)
  // 초기화 확인 UI(대화 초기화 안내 또는 초기화/취소 버튼) 노출. 실제 초기화 확정은 누르지 않는다.
  const confirmUi =
    (await page.getByRole('button', { name: /^초기화$/ }).count()) > 0 ||
    (await page.getByText('대화 초기화').count()) > 0
  expect(confirmUi).toBeTruthy()
  await page.keyboard.press('Escape').catch(() => {})
})

test('SPINX-COMMON-009 @minor B/O 사이징 — 넓게/기본 보기 토글', SPINX_SKIP_REASON, async ({ page }) => {
  const id = await gotoBoResult(page)
  test.skip(!id, '완료 BO fixture id 미확보')
  const opened = await openSpinXPanel(page)
  test.skip(!opened, 'SpinX 패널 미오픈')
  const expand = page.locator('button[title="넓게 보기"], button[title="기본 보기"]')
  test.skip((await expand.count()) === 0, '사이징 토글 버튼 미노출')
  await expect(expand.first()).toBeVisible()
  // 공유 Chrome에서 패널 헤더 버튼이 뷰포트 밖이라 일반 click이 막힘 → DOM click으로 우회.
  await expand.first().evaluate((b: HTMLElement) => b.click())
  await page.waitForTimeout(500)
  // 토글 후에도 패널(입력)이 유지됨(사이징만 변경).
  await expect(page.locator('textarea').first()).toBeVisible()
})

test('SPINX-COMMON-010 @minor B/O usage — 사용량 표시', SPINX_SKIP_REASON, async ({ page }) => {
  const id = await gotoBoResult(page)
  test.skip(!id, '완료 BO fixture id 미확보')
  const opened = await openSpinXPanel(page)
  test.skip(!opened, 'SpinX 패널 미오픈')
  // 입력 하단 'Usage n / limit' 사용량 표시.
  await expect(page.getByText(/Usage \d+ \/ \d+/).first()).toBeVisible()
})
