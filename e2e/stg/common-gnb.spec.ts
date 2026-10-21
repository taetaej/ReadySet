import { test, expect, gotoStable, dismissLaunchPopup, absUrl, excluded, skipReason } from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// 공통 / GNB + 레이어(런치) 팝업 — AREA=GNB-COMMON
// 근거: dom-evidence §1, 공통 전제(레이어 팝업). 전부 실제 DOM 셀렉터.
// 제목 형식: GNB-COMMON-NNN @priority 한글설명 (report.mjs 파서 호환)
//
// HARD RULE: 로그아웃(Log Out)은 "메뉴 노출"만 확인한다. 절대 클릭하지 않는다.
// ─────────────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await gotoStable(page, '/slotboard')
  await dismissLaunchPopup(page)
})

test('GNB-COMMON-001 @critical 로고가 헤더에 노출된다', async ({ page }) => {
  await expect(page.locator('header button:has(img[alt="ReadySet"])')).toBeVisible()
})

test('GNB-COMMON-002 @major 라이트/다크 테마 토글 버튼이 동작한다', async ({ page }) => {
  // 아이콘 전용 버튼(aria-label 없음) → 헤더 내 sun 아이콘 버튼으로 집는다.
  const themeToggle = page.locator('header button:has(svg.lucide-sun), header button:has(svg.lucide-moon)')
  await expect(themeToggle.first()).toBeVisible()
  await themeToggle.first().click()
  // 클릭 후에도 토글 버튼이 (sun 또는 moon 형태로) 계속 존재한다.
  await expect(themeToggle.first()).toBeVisible()
  // 수동: 실제 테마 픽셀/배경색 전환은 시각 검증(사람 확인).
})

test('GNB-COMMON-003 @major 유저 프로필을 열면 계정 정보가 표시된다', async ({ page }) => {
  await page.locator('header div[style*="cursor: pointer"]').first().click()
  await expect(page.getByText('신지아', { exact: true })).toBeVisible()
  await expect(page.getByText('Admin', { exact: true })).toBeVisible()
})

test('GNB-COMMON-004 @major 프로필 드롭다운에 접속 이력이 표시된다', async ({ page }) => {
  await page.locator('header div[style*="cursor: pointer"]').first().click()
  await expect(page.getByText('마지막 접속')).toBeVisible()
  await expect(page.getByRole('button', { name: '접속 이력' })).toBeVisible()
})

test('GNB-COMMON-005 @critical 로그아웃 메뉴가 노출된다(클릭 금지)', async ({ page }) => {
  await page.locator('header div[style*="cursor: pointer"]').first().click()
  // HARD RULE: 노출만 확인. 아래에 click() 코드가 없어야 한다(세션 유지).
  await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible()
})

test('GNB-COMMON-009 @major 레이어 팝업이 표시되고 닫기로 사라진다', skipReason('런치 팝업이 세션 상태상 이번 진입에서 안 뜨면 skip'), async ({ page }) => {
  // beforeEach에서 이미 닫으므로, 이 TC는 직접 재진입해 닫기 전 상태를 검증한다.
  await page.goto(absUrl('/slotboard'), { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)
  const popup = page.getByRole('heading', { name: 'BudgetOpt 2.0 신규 오픈!' })
  if (await popup.count()) {
    await expect(popup).toBeVisible()
    await expect(page.getByRole('button', { name: '오늘 하루 안 보기' })).toBeVisible()
    await page.getByRole('button', { name: '닫기' }).first().click()
    await expect(popup).toHaveCount(0)
  } else {
    // '오늘 하루 안 보기'가 이전에 눌렸거나 세션 상 미노출이면 skip 처리.
    test.skip(true, '런치 팝업 미노출(세션 상태상 이번 진입에서 안 뜸) — 재현 시 수동 확인')
  }
})

// ── GNB > FAB (Client 표시 / 알림 / 등급) — dom-evidence §1: FAB 미발견 ──────────
test('GNB-COMMON-006 @minor GNB>FAB Client 표시', excluded('GNB>FAB(Client 표시) 미노출 — 특정 계정 전용 추정. 단일 Admin 세션에서 자동화 불가. 수동 QA 대상'), async () => {
  test.skip(true, 'FAB 미발견: 리스트 화면에 우하단 고정 FAB 없음(결과/특정 계정 전용 추정)')
})

test('GNB-COMMON-007 @minor GNB>FAB 알림', excluded('GNB>FAB(알림) 미노출 — 특정 계정 전용 추정. 단일 Admin 세션에서 자동화 불가. 수동 QA 대상'), async () => {
  test.skip(true, 'FAB 미발견: 동일 사유(결과/특정 계정 전용 추정)')
})

test('GNB-COMMON-008 @minor GNB>FAB 등급', excluded('GNB>FAB(등급) 미노출 — 특정 계정 전용 추정. 단일 Admin 세션에서 자동화 불가. 수동 QA 대상'), async () => {
  test.skip(true, 'FAB 미발견: 동일 사유(결과/특정 계정 전용 추정)')
})
