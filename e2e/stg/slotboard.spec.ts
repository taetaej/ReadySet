import {
  test,
  expect,
  gotoStable,
  dismissLaunchPopup,
  closeDeleteModal,
  ADVERTISER,
  VISIBILITY_LABEL,
  testName,
  skipReason,
} from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// SlotBoard / Slot — AREA=SLOT-BOARD
// 근거: dom-evidence §2. 정렬은 개선 대기 건 → 제외(TC 미작성).
//
// HARD RULES:
//  - 생성: (주)세정 + Private + test_v* 강제. SLOT-BOARD-001은 실제 '생성'까지 클릭한다(교정).
//  - 삭제: 삭제 확인 모달 노출까지만. 확정 버튼 클릭 코드 없음(Escape/취소로 닫음).
// ─────────────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await gotoStable(page, '/slotboard')
  await dismissLaunchPopup(page)
})

// 생성 폼 진입·필수 영역 노출까지만 검증한다(요청4-1: 슬롯 실생성 중복 제거).
// 실제 '생성' submit은 CREATE-FLOW-001이 단독으로 소유한다 → 전수 1회에 슬롯 실생성 1건.
// 여기서는 (주)세정 + Private + test_v* 필수 입력/컨트롤이 노출되는지만 확인하고 '생성'은 누르지 않는다.
test('SLOT-BOARD-001 @critical 슬롯 생성 폼 — 필수 영역 노출(생성 submit 없음, 실생성은 CREATE-FLOW-001)', async ({ page }) => {
  await page.getByRole('button', { name: 'New Slot' }).click()
  await expect(page.getByRole('heading', { name: '새 Slot 생성' })).toBeVisible()

  // 이름: test_v* prefix 입력(실제 생성은 안 함)
  const name = testName('slot')
  const nameInput = page.locator('input[placeholder="Slot명을 입력하세요"]')
  await nameInput.fill(name)
  await expect(nameInput).toHaveValue(/^test_/)

  // 광고주 (주)세정 선택
  await page.getByRole('button', { name: /광고주를 선택하세요/ }).click()
  await page.locator('input[placeholder="광고주 검색..."]').fill(ADVERTISER)
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: /\(주\)세정/ }).first().click()

  // 가시성 Private(비공개) 컨트롤 노출·선택(공개 슬롯 금지)
  const visibility = page.getByRole('button', { name: VISIBILITY_LABEL })
  await expect(visibility).toBeVisible()
  await visibility.click()

  // 최종 '생성' 버튼이 노출되는 것까지만 확인. HARD RULE: 클릭하지 않는다(실생성은 CREATE-FLOW-001).
  await expect(page.getByRole('button', { name: '생성', exact: true })).toBeVisible()

  // 폼을 닫아 부작용 없이 종료(생성 안 함).
  await page.keyboard.press('Escape').catch(() => {})
})

test('SLOT-BOARD-002 @major 카드 메뉴에서 수정 진입 UI가 노출된다', skipReason('슬롯 카드가 없으면 skip — CREATE-FLOW/기존 카드 존재 시 실행됨'), async ({ page }) => {
  // create-flow(또는 SLOT-BOARD-001)가 선행되면 카드가 존재해 실제로 실행된다.
  const menu = page.locator('button[data-context-menu="true"]')
  test.skip((await menu.count()) === 0, '슬롯 카드 없음 — 생성 플로우 선행 시 카드 존재해 실행됨')
  await menu.first().click()
  await expect(page.getByRole('button', { name: '수정' })).toBeVisible()
  await page.keyboard.press('Escape')
})

test('SLOT-BOARD-003 @critical 삭제 모달만 확인(확정 금지)', skipReason('슬롯 카드가 없으면 skip — CREATE-FLOW/기존 카드 존재 시 실행됨'), async ({ page }) => {
  const menu = page.locator('button[data-context-menu="true"]')
  test.skip((await menu.count()) === 0, '슬롯 카드 없음 — 생성 플로우 선행 시 카드 존재해 실행됨')
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

test('SLOT-BOARD-006 @minor 페이징 컨트롤이 노출된다', skipReason('항목 수가 적어 페이징 미노출 시 skip — 생성 누적 시 노출될 수 있음'), async ({ page }) => {
  const pager = page.getByRole('button', { name: '1', exact: true })
  test.skip((await pager.count()) === 0, '항목 수가 적어 페이징 미노출 — 생성 누적 시 노출될 수 있음')
  await expect(pager.first()).toBeVisible()
})

// SlotBoard 정렬: 개선 대기 건 → TC 제외(미작성).
