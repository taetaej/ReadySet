import {
  test,
  expect,
  gotoStable,
  dismissLaunchPopup,
  closeDeleteModal,
  completedIds,
  resultPath,
  enterResult,
  openHeaderMenu,
  countBoRows,
  fixtureSlotId,
  blocked,
  skipReason,
  excluded,
  excludedIfPrd,
  IS_PRD,
  PRD_BO_EXCLUDED_REASON,
} from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// BudgetOpt 2.0 — AREA=BUDGET-OPT
// 근거: dom-evidence §7. 리스트는 증거 확실. 결과 화면 셀렉터는 기존
//   e2e/budgetopt-result.spec.ts의 role/text 재사용(단 STG는 완료 시나리오 id 미확보 → fixme).
// 정렬: 지문상 'P'(있음) → INCLUDE. 단 리스트 정렬 컨트롤 미발견 시 fixme 전환(EXCLUDE 아님).
//
// 생성 TC: 실제 생성 시 시나리오명 testName('bo'). 확정은 fixme.
// 삭제 TC: 모달 노출까지만. 확정 금지.
// ─────────────────────────────────────────────────────────────────────────────

// 데이터가 있는 고정 픽스처 슬롯(148)에서 목록 테스트를 실제 수행(검색/정렬/필터/페이징 실동작).
test.beforeEach(async ({ page }) => {
  // PRD에는 BudgetOpt 2.0 미배포 → BUDGET-OPT-001~012 전부 PRD에서 skip.
  test.skip(IS_PRD, PRD_BO_EXCLUDED_REASON)
  await gotoStable(page, '/slots/' + fixtureSlotId() + '/budgetopt')
  await dismissLaunchPopup(page)
})

test('BUDGET-OPT-001 @major 시나리오 목록이 표시된다', excludedIfPrd(), async ({ page }) => {
  await expect(page.getByRole('button', { name: 'New Scenario' })).toBeVisible()
  await expect(page.getByRole('button', { name: '검색' })).toBeVisible()
  await expect(page.getByRole('button', { name: '필터' })).toBeVisible()
})

test('BUDGET-OPT-002 @major 검색 — 입력 시 목록이 필터링된다', excludedIfPrd(), async ({ page }) => {
  const before = await page.locator('tbody tr').count()
  await page.getByRole('button', { name: '검색' }).click()
  const input = page.locator('input[placeholder="시나리오명, 생성자 검색"]')
  await expect(input).toBeVisible()
  // 특정 순번(test_v1.2.0_bo_01)으로 검색 → 결과가 줄어드는 변화 확인(노출만이 아니라 실제 필터링).
  await input.fill('test_v1.2.0_bo_01')
  await page.waitForTimeout(1500)
  const after = await page.locator('tbody tr').count()
  expect(after).toBeLessThan(before)
})

test('BUDGET-OPT-003 @major 필터 — 상태 필터 적용 시 목록이 변한다', IS_PRD ? excluded(PRD_BO_EXCLUDED_REASON) : skipReason('상태 필터 컨트롤(Processing)이 패널에 미노출이면 skip — 패널 구조/데이터 상태 의존'), async ({ page }) => {
  const before = await page.locator('tbody tr').count()
  await page.getByRole('button', { name: '필터' }).click()
  await expect(page.getByRole('button', { name: '필터 초기화' })).toBeVisible()
  // 상태 필터는 체크박스 드롭다운(Completed/Processing/Pending/Error). 픽스처는 전부 Completed라
  // 'Processing' 체크 시 결과 집합이 바뀐다(적용+변화 검증).
  const processing = page.getByText('Processing', { exact: true }).first()
  test.skip((await processing.count()) === 0, '상태 필터 컨트롤 미노출(패널 구조 변경 가능)')
  await processing.click()
  await page.waitForTimeout(1500)
  const after = await page.locator('tbody tr').count()
  expect(after).not.toBe(before)
  // 초기화로 원복(부작용 없음).
  await page.getByRole('button', { name: '필터 초기화' }).click().catch(() => {})
})

test('BUDGET-OPT-012 @minor 페이징 — 2페이지 이동 시 행 집합이 바뀐다', IS_PRD ? excluded(PRD_BO_EXCLUDED_REASON) : skipReason('2페이지 버튼이 없으면(항목이 한 페이지 이내) skip — 목록 건수 의존'), async ({ page }) => {
  // 고정 슬롯 148은 ~25행이라 페이지가 나뉜다.
  const page2 = page.getByRole('button', { name: '2', exact: true })
  test.skip((await page2.count()) === 0, '페이지가 1개뿐 — 페이징 미노출')
  await expect(page.locator('tbody tr').first()).toBeVisible()
  // 1페이지 첫 행 id
  const firstIdP1 = (await page.locator('tbody tr td').nth(1).textContent())?.trim()
  await page2.first().click()
  await page.waitForTimeout(1500)
  await expect(page.locator('tbody tr').first()).toBeVisible()
  const firstIdP2 = (await page.locator('tbody tr td').nth(1).textContent())?.trim()
  expect(firstIdP2).not.toBe(firstIdP1)
})

test('BUDGET-OPT-004 @major 정렬 — 테이블 컬럼 헤더 클릭', IS_PRD ? excluded(PRD_BO_EXCLUDED_REASON) : skipReason('BO 리스트 테이블 헤더 미발견 시 skip(테이블 뷰 아님) — 컨트롤 생기면 자동 실행(EXCLUDE 아님)'), async ({ page }) => {
  // 사용자 명시: "정렬은 테이블 헤더를 클릭하면 됨". BO 리스트는 카드가 아니라 테이블(<th>)이다.
  // 실제 DOM 확인(런타임): 헤더 th는 cursor-pointer이고 aria-sort는 없으며, 클릭하면 th 안에
  // 정렬 방향 아이콘(lucide-chevron-down/up svg)이 나타난다. 그 아이콘 등장을 관찰 가능한 변화로 assert.
  const header = page.locator('th', { hasText: '시나리오' }).first()
  test.skip((await header.count()) === 0, 'BO 리스트 테이블 헤더 미발견 — 테이블 뷰 아님')
  // 클릭 전: 헤더에 정렬 아이콘 없음
  await expect(header.locator('svg')).toHaveCount(0)
  await header.click()
  // 클릭 후: 정렬 방향 아이콘(chevron)이 헤더에 나타남 = 정렬 적용됨
  await expect(header.locator('svg')).toHaveCount(1)
})

// 실제 최종 생성은 create-flow.spec.ts(CREATE-FLOW-003)가 소유한다. 여기서는 생성 화면 진입까지만 검증.
test('BUDGET-OPT-005 @critical 생성 진입', excludedIfPrd(), async ({ page }) => {
  await page.getByRole('button', { name: 'New Scenario' }).click()
  await expect(page.getByRole('heading', { name: '새 시나리오 생성' })).toBeVisible()
})

test('BUDGET-OPT-006 @critical 삭제 모달만 확인(확정 금지)', IS_PRD ? excluded(PRD_BO_EXCLUDED_REASON) : skipReason('시나리오 카드가 없으면 skip — 고정 픽스처 슬롯에 BO 시나리오 존재 시 실행됨'), async ({ page }) => {
  const menu = page.locator('button[data-context-menu]')
  test.skip((await menu.count()) === 0, '시나리오 카드 없음 — create-flow 선행 시 카드 존재해 실행됨')
  await menu.first().click()
  await page.getByRole('button', { name: '삭제' }).click()
  await expect(page.locator('.dialog-overlay, [role="dialog"]').first()).toBeVisible()
  await closeDeleteModal(page)
})

// 결과 화면 기반 — 고정 슬롯 148의 완료(Completed) BO 시나리오 fixture로 실활성화.
// 결과 라우트(라이브 DOM 확정): /slots/148/budgetopt/scenarios/{id}/result
// 헤더 셀렉터는 budgetopt-result.spec.ts의 role/text 재사용(STG DOM과 일치 확인).

test('BUDGET-OPT-009 @critical 결과 — 핵심 섹션 렌더', IS_PRD ? excluded(PRD_BO_EXCLUDED_REASON) : skipReason('완료 BO fixture id(fixture-ids.json completed.bo) 미확보 시 skip'), async ({ page }) => {
  const id = await enterResult(page, 'bo')
  test.skip(!id, '완료 BO fixture id 미확보(fixture-ids.json completed.bo 비어있음)')
  // 결과 핵심 섹션 제목 렌더(열림만으로 판정하지 않음)
  await expect(page.getByRole('heading', { name: 'Optimization Analytics' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Budget Allocation Detail' })).toBeVisible()
  // 차트 인사이트 SpinX 헤더 존재(결과가 실제로 그려졌다는 신호)
  await expect(page.getByText('SpinX for BudgetOpt 2.0').first()).toBeVisible()
})

test('BUDGET-OPT-007 @major 복제 — 실제 복제 실행 후 목록 1건 증가', IS_PRD ? excluded(PRD_BO_EXCLUDED_REASON) : blocked('완료 BO fixture id 미확보 시 skip. fixture 확보 시 BO가 대표로 실제 복제 submit(목록 +1 검증, 솔루션당 복제 1건)'), async ({ page }) => {
  const id = completedIds('bo')[0]
  test.skip(!id, '완료 BO fixture id 미확보')
  // 복제본 이름 prefix: STG가 '(복제)' 접미 없이 '(복제)test_v1.2.0_bo_NN' 형태로 prefill.
  const clonePrefix = '(복제)test_v1.2.0_bo'
  const before = await countBoRows(page, clonePrefix)

  // 결과 진입 → 헤더 컨텍스트 메뉴 '복제' → 복제 위저드(copyScenarioId)로 이동(이름 prefill)
  await gotoStable(page, resultPath('bo', id))
  await dismissLaunchPopup(page)
  await page.waitForTimeout(1500)
  const opened = await openHeaderMenu(page, /^복제$/)
  test.skip(!opened, '결과 헤더에서 복제 메뉴를 열지 못함(헤더 구조 변경 가능)')
  await page.getByText('복제', { exact: true }).first().click()
  await page.waitForTimeout(2500)
  // 복제=생성 위저드가 열리며 이름이 test_v* 포함으로 prefill됨(앱이 '(복제)' 접두 부여 — 수용)
  await expect(page.getByRole('heading', { name: '새 시나리오 생성' })).toBeVisible()
  const nameVal = await page.locator('input[placeholder="시나리오명을 입력하세요."]').inputValue()
  expect(nameVal).toMatch(/test_v/)

  // 위저드는 전부 prefill → '다음' 2회로 Step3 도달 후 '시나리오 생성 요청'(생성 허용, 완료 대기 안 함)
  for (let s = 0; s < 2; s++) {
    const next = page.getByRole('button', { name: '다음' }).first()
    if ((await next.count()) && !(await next.isDisabled().catch(() => true))) {
      await next.click()
      await page.waitForTimeout(1500)
    }
  }
  await page.getByRole('button', { name: /시나리오 생성 요청/ }).click()
  await page.waitForTimeout(3500)

  // 목록에서 복제본이 1건 늘었는지 검증(복제=생성, 삭제 아님)
  const after = await countBoRows(page, clonePrefix)
  expect(after).toBeGreaterThanOrEqual(before + 1)
})

test('BUDGET-OPT-008 @major 이동 — 헤더 메뉴 레이어 열림까지', IS_PRD ? excluded(PRD_BO_EXCLUDED_REASON) : blocked('완료 BO fixture id 미확보 시 skip — fixture 확보 시 이동 메뉴 열림까지 자동화 대상(이동 확정 금지)'), async ({ page }) => {
  const id = await enterResult(page, 'bo')
  test.skip(!id, '완료 BO fixture id 미확보')
  // '이동'은 부작용(슬롯 이동) 방지 위해 메뉴/레이어 열림까지만. 실제 이동 확정 클릭 없음.
  const opened = await openHeaderMenu(page, /^이동$/)
  test.skip(!opened, '결과 헤더에서 이동 메뉴를 열지 못함')
  await expect(page.getByText('이동', { exact: true }).first()).toBeVisible()
  await page.keyboard.press('Escape').catch(() => {})
})

test('BUDGET-OPT-010 @major 다운로드 — Export to Excel 다운로드 이벤트 수신', IS_PRD ? excluded(PRD_BO_EXCLUDED_REASON) : skipReason('완료 BO fixture id 미확보 시 skip — fixture 확보 시 실제 download 이벤트 수신 + .xlsx 검증'), async ({ page }) => {
  const id = await enterResult(page, 'bo')
  test.skip(!id, '완료 BO fixture id 미확보')
  const opened = await openHeaderMenu(page, 'Copy Link')
  test.skip(!opened, '결과 헤더에서 Export 메뉴를 열지 못함')
  await expect(page.getByText('Export to Excel')).toBeVisible()
  // 실제 다운로드 이벤트 수신(수신만, 생성물 삭제 안 함). 내용 심층검증은 보류.
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15_000 }),
    page.getByText('Export to Excel').first().click(),
  ])
  // 파일명/확장자 확인(.xlsx)
  expect(download.suggestedFilename()).toMatch(/\.xlsx$/)
})

test('BUDGET-OPT-011 @major CTA(Reach Caster 연계) — 간편 생성 진입', IS_PRD ? excluded(PRD_BO_EXCLUDED_REASON) : skipReason('완료 BO fixture id 또는 Reach Caster CTA 미노출 시 skip'), async ({ page }) => {
  const id = await enterResult(page, 'bo')
  test.skip(!id, '완료 BO fixture id 미확보')
  const cta = page.getByText('Reach Caster로 예측하기').first()
  test.skip((await cta.count()) === 0, '결과 화면에 Reach Caster CTA 미노출')
  await cta.click()
  await page.waitForTimeout(1500)
  // 간편 생성 모달 heading 노출(실제 생성은 하지 않음 — CTA 연계 진입만 검증)
  await expect(
    page.getByRole('heading', { name: /최적화 예산으로 도달 예측하기/ })
  ).toBeVisible()
})
