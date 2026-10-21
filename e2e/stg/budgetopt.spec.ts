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

test('BUDGET-OPT-004 @major 정렬 — 테이블 컬럼 헤더 클릭', async ({ page }) => {
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
test('BUDGET-OPT-005 @critical 생성 진입', async ({ page }) => {
  await page.getByRole('button', { name: 'New Scenario' }).click()
  await expect(page.getByRole('heading', { name: '새 시나리오 생성' })).toBeVisible()
})

test('BUDGET-OPT-006 @critical 삭제 모달만 확인(확정 금지)', async ({ page }) => {
  const menu = page.locator('button[data-context-menu]')
  test.skip((await menu.count()) === 0, '시나리오 카드 없음 — create-flow 선행 시 카드 존재해 실행됨')
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
