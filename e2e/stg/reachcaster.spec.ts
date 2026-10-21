import { test, expect, gotoStable, dismissLaunchPopup, closeDeleteModal } from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// Reach Caster — AREA=REACH-CASTER
// 근거: dom-evidence §4·§5. 리스트/생성 플로우/삭제 모달까지가 증거 확실.
// 결과·비교·다운로드·복제·이동은 완료 시나리오 fixture 미확보 → fixme.
// 정렬: 개선 대기 건 → 제외(TC 미작성).
//
// 생성 TC: 실제 생성 시 시나리오명은 testName('rc-rf'/'rc-rp')로. 확정은 fixme.
// 삭제 TC: 모달 노출까지만. 확정 금지.
// ─────────────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await gotoStable(page, '/slots/1/reachcaster')
  await dismissLaunchPopup(page)
})

test('REACH-CASTER-001 @major 시나리오 목록이 표시된다', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'New Scenario' })).toBeVisible()
  await expect(page.getByRole('button', { name: '검색' })).toBeVisible()
  await expect(page.getByRole('button', { name: '필터' })).toBeVisible()
})

test('REACH-CASTER-002 @major 검색 입력이 노출된다', async ({ page }) => {
  await page.getByRole('button', { name: '검색' }).click()
  await expect(page.locator('input[placeholder="시나리오명, 생성자"]')).toBeVisible()
})

test('REACH-CASTER-003 @major 필터 패널이 노출된다', async ({ page }) => {
  await page.getByRole('button', { name: '필터' }).click()
  await expect(page.getByRole('button', { name: '필터 초기화' })).toBeVisible()
})

test('REACH-CASTER-004 @minor 리스트 모드 토글', async () => {
  // dom-evidence에 리스트 모드 토글 셀렉터 미확정 → 지어내지 않고 fixme.
  test.fixme(true, '리스트 모드 토글 셀렉터 미확보(실제 DOM 재확인 필요) — 증거 확보 시 작성')
})

test.fixme('REACH-CASTER-005 @critical 생성 R/F 플로우', async ({ page }) => {
  // 실제 생성 시 시나리오명 testName('rc-rf') 사용. 확정은 하지 않음(flaky/부작용).
  await page.getByRole('button', { name: 'New Scenario' }).click()
  await expect(page.getByRole('heading', { name: '새 시나리오 생성' })).toBeVisible()
  await page.getByRole('button', { name: /Ratio Finder/ }).click()
  await expect(page.getByRole('button', { name: /브랜드를 선택하세요/ })).toBeVisible()
})

test.fixme('REACH-CASTER-006 @critical 생성 R/P 플로우', async ({ page }) => {
  // 실제 생성 시 시나리오명 testName('rc-rp') 사용. 확정은 하지 않음.
  await page.getByRole('button', { name: 'New Scenario' }).click()
  await expect(page.getByRole('heading', { name: '새 시나리오 생성' })).toBeVisible()
  await page.getByRole('button', { name: /Reach Predictor/ }).click()
  await expect(page.getByRole('button', { name: '다음' })).toBeVisible()
})

test('REACH-CASTER-007 @critical 삭제 모달만 확인(확정 금지)', async ({ page }) => {
  const menu = page.locator('button[data-context-menu]')
  test.skip((await menu.count()) === 0, '시나리오 카드 없음(STG 데이터 상태 의존)')
  await menu.first().click()
  await page.getByRole('button', { name: '삭제' }).click()
  await expect(page.locator('.dialog-overlay, [role="dialog"]').first()).toBeVisible()
  await closeDeleteModal(page)
})

// 완료 시나리오 fixture 미확보 → fixme.
test.fixme('REACH-CASTER-008 @major 복제', async () => {
  // 복제 메뉴는 결과/상세 헤더에만 존재. 완료 시나리오 fixture 필요.
})
test.fixme('REACH-CASTER-009 @major 이동', async () => {
  // 상세 헤더 메뉴·완료 시나리오 fixture 필요.
})
test.fixme('REACH-CASTER-010 @critical 결과 R/F', async () => {
  // 완료 시나리오 fixture·결과 라우트 미확보.
})
test.fixme('REACH-CASTER-011 @critical 결과 R/P', async () => {
  // 완료 시나리오 fixture·결과 라우트 미확보.
})
test.fixme('REACH-CASTER-012 @major 시나리오 비교', async () => {
  // 완료 시나리오 2건 이상 fixture 필요.
})
test.fixme('REACH-CASTER-013 @major 다운로드', async () => {
  // 다운로드 계약 미확보. 진입 가능해지면 트리거만이라도 검증.
})

// Reach Caster 정렬: 개선 대기 건 → TC 제외(미작성).
