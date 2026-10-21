import { test, expect, gotoStable, dismissLaunchPopup } from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// 공통 부가 + DOCS — AREA=MISC-COMMON
// 근거: dom-evidence §9. DOCS 진입은 증거 확실. 알림·등급은 FAB/계정 의존 → skip.
// ─────────────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await gotoStable(page, '/slotboard')
  await dismissLaunchPopup(page)
})

test('MISC-COMMON-001 @major DOCS로 진입한다', async ({ page }) => {
  await page.getByRole('button', { name: 'ReadySet Docs' }).click()
  await page.waitForTimeout(1500)
  await expect(page).toHaveURL(/\/docs/)
  // 헤딩 Workflow 또는 Quick references 중 하나는 노출.
  const workflow = page.getByRole('heading', { name: 'Workflow' })
  const quickRef = page.getByRole('heading', { name: 'Quick references' })
  const shown = (await workflow.count()) > 0 || (await quickRef.count()) > 0
  expect(shown).toBeTruthy()
})

test('MISC-COMMON-002 @minor 생성 알림', async () => {
  test.skip(true, '알림 FAB 미발견(GNB>FAB 미노출과 동일 사유)')
})
test('MISC-COMMON-003 @minor 등급 알림', async () => {
  test.skip(true, '에이전시/클라이언트 계정 의존(단일 Admin 세션) — 이번 라운드 skip')
})
test('MISC-COMMON-004 @minor 등급 결과물 카운트', async () => {
  test.skip(true, '등급 UI(FAB 경로) 미탐색')
})
test('MISC-COMMON-005 @minor 등급 사용 솔루션 체크', async () => {
  test.skip(true, '등급 UI(FAB 경로) 미탐색')
})
