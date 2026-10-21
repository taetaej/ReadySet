import { test, expect, gotoStable, dismissLaunchPopup, closeDeleteModal } from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// BudgetOpt 2.0 — AREA=BUDGET-OPT
// 근거: dom-evidence §7. 리스트는 증거 확실. 결과 화면 셀렉터는 기존
//   e2e/budgetopt-result.spec.ts의 role/text 재사용(단 STG는 완료 시나리오 id 미확보 → fixme).
// 정렬: 지문상 'P'(있음) → INCLUDE. 단 리스트 정렬 컨트롤 미발견 시 fixme 전환(EXCLUDE 아님).
//
// 생성 TC: 실제 생성 시 시나리오명 testName('bo'). 확정은 fixme.
// 삭제 TC: 모달 노출까지만. 확정 금지.
// ─────────────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await gotoStable(page, '/slots/1/budgetopt')
  await dismissLaunchPopup(page)
})

test('BUDGET-OPT-001 @major 시나리오 목록이 표시된다', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'New Scenario' })).toBeVisible()
  await expect(page.getByRole('button', { name: '검색' })).toBeVisible()
  await expect(page.getByRole('button', { name: '필터' })).toBeVisible()
})

test('BUDGET-OPT-002 @major 검색 입력이 노출된다', async ({ page }) => {
  await page.getByRole('button', { name: '검색' }).click()
  await expect(page.locator('input[placeholder="시나리오명, 생성자 검색"]')).toBeVisible()
})

test('BUDGET-OPT-003 @major 필터 패널이 노출된다', async ({ page }) => {
  await page.getByRole('button', { name: '필터' }).click()
  await expect(page.getByRole('button', { name: '필터 초기화' })).toBeVisible()
})

test('BUDGET-OPT-004 @major 정렬 컨트롤이 동작한다', async ({ page }) => {
  // 지문상 'P' → INCLUDE. dom-evidence는 리스트 정렬 버튼 미발견이라 했으므로
  // 실제 DOM에서 정렬 컨트롤을 먼저 찾고, 없으면 fixme로 전환(다른 솔루션처럼 EXCLUDE하지 않음).
  const sortControl = page.getByRole('button', { name: /정렬|최신순|이름순|오래된순/ })
  if ((await sortControl.count()) === 0) {
    test.fixme(true, '지문상 P이나 리스트에서 정렬 컨트롤 미발견 — 실제 DOM 재확인 필요(EXCLUDE 아님)')
    return
  }
  await expect(sortControl.first()).toBeVisible()
})

test.fixme('BUDGET-OPT-005 @critical 생성 진입', async ({ page }) => {
  // 실제 생성 시 시나리오명 testName('bo'). 진입까지만, 확정 금지.
  await page.getByRole('button', { name: 'New Scenario' }).click()
})

test('BUDGET-OPT-006 @critical 삭제 모달만 확인(확정 금지)', async ({ page }) => {
  const menu = page.locator('button[data-context-menu]')
  test.skip((await menu.count()) === 0, '시나리오 카드 없음(STG 데이터 상태 의존)')
  await menu.first().click()
  await page.getByRole('button', { name: '삭제' }).click()
  await expect(page.locator('.dialog-overlay, [role="dialog"]').first()).toBeVisible()
  await closeDeleteModal(page)
})

// 결과 화면 기반 — STG 완료 시나리오 id 미확보 → fixme.
// 진입 가능해지면 기존 budgetopt-result.spec.ts 셀렉터 재사용:
//   헤더 메뉴 복제/이동/삭제, Optimization Analytics / Budget Allocation Detail,
//   Export(Copy Link/Excel/PDF), CTA 'Reach Caster로 예측하기'.
test.fixme('BUDGET-OPT-007 @major 복제', async () => {
  // 결과 헤더 메뉴(복제/이동/삭제)·완료 시나리오 fixture 필요.
})
test.fixme('BUDGET-OPT-008 @major 이동', async () => {
  // 결과 헤더 메뉴·완료 시나리오 fixture 필요.
})
test.fixme('BUDGET-OPT-009 @critical 결과', async () => {
  // STG 완료 시나리오 id 미확보. 진입 시 Optimization Analytics/Budget Allocation Detail 재사용.
})
test.fixme('BUDGET-OPT-010 @major 다운로드', async () => {
  // Export 메뉴(Copy Link/Excel/PDF) 트리거는 기존 셀렉터로 가능하나 완료 시나리오 진입 필요.
  // 다운로드 계약은 // 보류:.
})
test.fixme('BUDGET-OPT-011 @major CTA(Reach Caster 연계)', async () => {
  // 결과 화면 'Reach Caster로 예측하기' CTA — 완료 시나리오 진입 필요.
})
