import { test, expect, gotoStable, dismissLaunchPopup, closeDeleteModal, createPrivateSlot } from './fixtures'

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

// 실제 슬롯을 생성한다(교정 핵심). createPrivateSlot이 (주)세정 + Private + test_v*를 강제하고
// 최종 '생성' 버튼까지 누른다. 삭제/cleanup는 하지 않는다(생성 객체는 STG에 남긴다).
test('SLOT-BOARD-001 @critical 슬롯 생성 — (주)세정 + Private + test_v*', async ({ page }) => {
  const { name, slotId } = await createPrivateSlot(page, 'slot')
  // 성공 판정: 상세 URL(/slotboard/{id}) 이동 OR 리스트에 방금 만든 카드 등장
  if (slotId) {
    expect(page.url()).toMatch(/\/slotboard\/\d+/)
  } else {
    await expect(page.getByRole('heading', { name }).first()).toBeVisible()
  }
})

test('SLOT-BOARD-002 @major 카드 메뉴에서 수정 진입 UI가 노출된다', async ({ page }) => {
  // create-flow(또는 SLOT-BOARD-001)가 선행되면 카드가 존재해 실제로 실행된다.
  const menu = page.locator('button[data-context-menu="true"]')
  test.skip((await menu.count()) === 0, '슬롯 카드 없음 — 생성 플로우 선행 시 카드 존재해 실행됨')
  await menu.first().click()
  await expect(page.getByRole('button', { name: '수정' })).toBeVisible()
  await page.keyboard.press('Escape')
})

test('SLOT-BOARD-003 @critical 삭제 모달만 확인(확정 금지)', async ({ page }) => {
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

test('SLOT-BOARD-006 @minor 페이징 컨트롤이 노출된다', async ({ page }) => {
  const pager = page.getByRole('button', { name: '1', exact: true })
  test.skip((await pager.count()) === 0, '항목 수가 적어 페이징 미노출 — 생성 누적 시 노출될 수 있음')
  await expect(pager.first()).toBeVisible()
})

// SlotBoard 정렬: 개선 대기 건 → TC 제외(미작성).
