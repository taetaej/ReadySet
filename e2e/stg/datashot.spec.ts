import { test, expect, gotoStable, dismissLaunchPopup, closeDeleteModal } from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// DataShot — AREA=DATA-SHOT
// 근거: dom-evidence §6. 리스트/생성 진입/삭제 모달까지 증거 확실.
// 결과·이동·다운로드는 완료 데이터셋 fixture 미확보 → fixme.
// 정렬: 개선 대기 건 → 제외(TC 미작성).
//
// 생성 TC: 실제 생성 시 데이터셋명 testName('ds'). 상세 플로우·확정은 fixme.
// 삭제 TC: 모달 노출까지만. 확정 금지.
// ─────────────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await gotoStable(page, '/slots/1/datashot')
  await dismissLaunchPopup(page)
})

test('DATA-SHOT-001 @major 데이터셋 목록이 표시된다', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'New Dataset' })).toBeVisible()
  await expect(page.getByRole('button', { name: '검색' })).toBeVisible()
  await expect(page.getByRole('button', { name: '필터' })).toBeVisible()
})

test('DATA-SHOT-002 @major 검색 입력이 노출된다', async ({ page }) => {
  await page.getByRole('button', { name: '검색' }).click()
  await expect(page.locator('input[placeholder="데이터셋명, 생성자"]')).toBeVisible()
})

test('DATA-SHOT-003 @major 필터 패널이 노출된다', async ({ page }) => {
  await page.getByRole('button', { name: '필터' }).click()
  await expect(page.getByRole('button', { name: '필터 초기화' })).toBeVisible()
})

test.fixme('DATA-SHOT-004 @critical 생성 진입', async ({ page }) => {
  // 실제 생성 시 데이터셋명 testName('ds'). 상세 플로우 미탐색 → 확정 금지.
  await page.getByRole('button', { name: 'New Dataset' }).click()
  // 생성 화면 진입 확인(헤딩/브레드크럼 셀렉터는 상세 탐색 후 확정 필요).
})

test('DATA-SHOT-005 @critical 삭제 모달만 확인(확정 금지)', async ({ page }) => {
  const menu = page.locator('button[data-context-menu]')
  test.skip((await menu.count()) === 0, '데이터셋 카드 없음(STG 데이터 상태 의존)')
  await menu.first().click()
  await page.getByRole('button', { name: '삭제' }).click()
  await expect(page.locator('.dialog-overlay, [role="dialog"]').first()).toBeVisible()
  await closeDeleteModal(page)
})

test.fixme('DATA-SHOT-006 @major 이동', async () => {
  // 상세 헤더 메뉴·fixture 미확보.
})
test.fixme('DATA-SHOT-007 @critical 결과', async () => {
  // 완료 데이터셋 fixture·결과 라우트 미확보.
})
test.fixme('DATA-SHOT-008 @major 다운로드', async () => {
  // 다운로드 계약 미확보.
})

// DataShot 정렬: 개선 대기 건 → TC 제외(미작성).
