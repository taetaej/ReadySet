import { test, expect, gotoStable, dismissLaunchPopup, closeDeleteModal, testName, ADVERTISER, VISIBILITY_LABEL } from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// SlotBoard / Slot — AREA=SLOT-BOARD
// 근거: dom-evidence §2. 정렬은 개선 대기 건 → 제외(TC 미작성).
//
// HARD RULES:
//  - 생성: (주)세정 + Private + test_v* 강제. 실제 생성 확정은 부작용/flaky 우려로 fixme.
//  - 삭제: 삭제 확인 모달 노출까지만. 확정 버튼 클릭 코드 없음(Escape/취소로 닫음).
// ─────────────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await gotoStable(page, '/slotboard')
  await dismissLaunchPopup(page)
})

// 실제 생성은 STG에 객체를 남기고 공유 Chrome에서 flaky하므로 폼 채움·검증까지만.
// 실생성 전환 시에도 반드시 testName()(test_v* prefix) + (주)세정 + Private 조건을 지킨다.
test.fixme('SLOT-BOARD-001 @critical 슬롯 생성 — (주)세정 + Private + test_v*', async ({ page }) => {
  await page.getByRole('button', { name: 'New Slot' }).click()
  await expect(page.getByRole('heading', { name: '새 Slot 생성' })).toBeVisible()

  // 이름: 반드시 test_v* prefix
  await page.locator('input[placeholder="Slot명을 입력하세요"]').fill(testName('slot'))

  // 광고주: (주)세정
  await page.getByRole('button', { name: /광고주를 선택하세요/ }).click()
  await page.locator('input[placeholder="광고주 검색..."]').fill(ADVERTISER)
  await page.getByRole('button', { name: /\(주\)세정/ }).first().click()

  // 가시성: Private(비공개) — 공개 슬롯 금지
  await page.getByRole('button', { name: VISIBILITY_LABEL }).click()

  // 폼 값 검증(실제 '생성' 클릭은 하지 않음 — 부작용 방지)
  await expect(page.locator('input[placeholder="Slot명을 입력하세요"]')).toHaveValue(/^test_/)
  await expect(page.getByText(/\(주\)세정/)).toBeVisible()
  // '생성' 버튼은 존재 확인만. 클릭 코드 없음.
  await expect(page.getByRole('button', { name: '생성', exact: true })).toBeVisible()
})

test('SLOT-BOARD-002 @major 카드 메뉴에서 수정 진입 UI가 노출된다', async ({ page }) => {
  const menu = page.locator('button[data-context-menu="true"]')
  test.skip((await menu.count()) === 0, '슬롯 카드 없음(STG 데이터 상태 의존) — 생성 후 재확인')
  await menu.first().click()
  await expect(page.getByRole('button', { name: '수정' })).toBeVisible()
  await page.keyboard.press('Escape')
})

test('SLOT-BOARD-003 @critical 삭제 모달만 확인(확정 금지)', async ({ page }) => {
  const menu = page.locator('button[data-context-menu="true"]')
  test.skip((await menu.count()) === 0, '슬롯 카드 없음(STG 데이터 상태 의존)')
  await menu.first().click()
  await page.getByRole('button', { name: '삭제' }).click()
  // 삭제 확인 모달/다이얼로그 노출만 확인. HARD RULE: 확정 버튼 클릭 코드 없음.
  await expect(page.locator('.dialog-overlay, [role="dialog"]').first()).toBeVisible()
  await closeDeleteModal(page)
})

test('SLOT-BOARD-004 @major 검색 입력이 노출된다', async ({ page }) => {
  await page.getByRole('button', { name: '검색' }).click()
  await expect(page.locator('input[placeholder="Search (Slot명, 광고주명)"]')).toBeVisible()
})

test('SLOT-BOARD-005 @major 필터 패널이 노출된다', async ({ page }) => {
  await page.getByRole('button', { name: '필터' }).click()
  await expect(page.getByText('가시성')).toBeVisible()
  await expect(page.getByRole('button', { name: '필터 초기화' })).toBeVisible()
})

test('SLOT-BOARD-006 @minor 페이징 컨트롤이 노출된다', async ({ page }) => {
  const pager = page.getByRole('button', { name: '1', exact: true })
  test.skip((await pager.count()) === 0, '항목 수가 적어 페이징 미노출 — 데이터 충분 시 재확인')
  await expect(pager.first()).toBeVisible()
})

// SlotBoard 정렬: 개선 대기 건 → TC 제외(미작성).
