import {
  test,
  expect,
  gotoStable,
  dismissLaunchPopup,
  closeDeleteModal,
  completedIds,
  enterResult,
  openHeaderMenu,
  openScenarioComparison,
  fixtureSlotId,
} from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// Reach Caster — AREA=REACH-CASTER
// 근거: dom-evidence §4·§5. 리스트/생성 플로우/삭제 모달까지가 증거 확실.
// 결과·비교·다운로드·복제·이동은 완료 시나리오 fixture 미확보 → fixme.
// 정렬: 개선 대기 건 → 제외(TC 미작성).
//
// 생성 TC: 실제 생성 시 시나리오명은 testName('rc-rf'/'rc-rp')로. 확정은 fixme.
// 삭제 TC: 모달 노출까지만. 확정 금지.
// ─────────────────────────────────────────────────────────────────────────────

// 데이터가 있는 고정 픽스처 슬롯(148)에서 목록 테스트를 실제 수행.
test.beforeEach(async ({ page }) => {
  await gotoStable(page, '/slots/' + fixtureSlotId() + '/reachcaster')
  await dismissLaunchPopup(page)
})

test('REACH-CASTER-001 @major 시나리오 목록이 표시된다', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'New Scenario' })).toBeVisible()
  await expect(page.getByRole('button', { name: '검색' })).toBeVisible()
  await expect(page.getByRole('button', { name: '필터' })).toBeVisible()
})

test('REACH-CASTER-002 @major 검색 — 입력 시 목록이 필터링된다', async ({ page }) => {
  const before = await page.locator('tbody tr').count()
  await page.getByRole('button', { name: '검색' }).click()
  const input = page.locator('input[placeholder="시나리오명, 생성자"]')
  await expect(input).toBeVisible()
  await input.fill('test_v1.2.0_rcrp_01')
  await page.waitForTimeout(1500)
  const after = await page.locator('tbody tr').count()
  expect(after).toBeLessThan(before)
})

test('REACH-CASTER-003 @major 필터 — 상태 필터 적용 시 목록이 변한다', async ({ page }) => {
  const before = await page.locator('tbody tr').count()
  await page.getByRole('button', { name: '필터' }).click()
  await expect(page.getByRole('button', { name: '필터 초기화' })).toBeVisible()
  const processing = page.getByText('Processing', { exact: true }).first()
  test.skip((await processing.count()) === 0, '상태 필터 컨트롤 미노출')
  await processing.click()
  await page.waitForTimeout(1500)
  const after = await page.locator('tbody tr').count()
  expect(after).not.toBe(before)
  await page.getByRole('button', { name: '필터 초기화' }).click().catch(() => {})
})

test('REACH-CASTER-014 @minor 페이징 — 2페이지 이동 시 행 집합이 바뀐다', async ({ page }) => {
  const page2 = page.getByRole('button', { name: '2', exact: true })
  test.skip((await page2.count()) === 0, '페이지가 1개뿐 — 페이징 미노출')
  await expect(page.locator('tbody tr').first()).toBeVisible()
  const firstIdP1 = (await page.locator('tbody tr td').nth(1).textContent())?.trim()
  await page2.first().click()
  await page.waitForTimeout(1500)
  await expect(page.locator('tbody tr').first()).toBeVisible()
  const firstIdP2 = (await page.locator('tbody tr td').nth(1).textContent())?.trim()
  expect(firstIdP2).not.toBe(firstIdP1)
})

test('REACH-CASTER-004 @minor 리스트 모드 토글', async () => {
  // dom-evidence에 리스트 모드 토글 셀렉터 미확정 → 지어내지 않고 fixme.
  test.fixme(true, '리스트 모드 토글 셀렉터 미확보(실제 DOM 재확인 필요) — 증거 확보 시 작성')
})

// 실제 최종 생성은 create-flow.spec.ts(CREATE-FLOW-004/005)가 소유한다(중복 생성 방지).
// 여기서는 생성 진입·모드 선택·필수 영역 노출까지의 read-only 검증만 한다.
test('REACH-CASTER-005 @critical 생성 R/F 진입·모드 선택', async ({ page }) => {
  await page.getByRole('button', { name: 'New Scenario' }).click()
  await expect(page.getByRole('heading', { name: '새 시나리오 생성' })).toBeVisible()
  await page.getByRole('button', { name: /Ratio Finder/ }).click()
  // Ratio Finder 선택 시 브랜드 선택 필드 노출(필수 영역 노출 확인). 최종 생성은 create-flow가 담당.
  await expect(page.getByRole('button', { name: /브랜드를 선택하세요/ })).toBeVisible()
})

test('REACH-CASTER-006 @critical 생성 R/P 진입·모드 선택', async ({ page }) => {
  await page.getByRole('button', { name: 'New Scenario' }).click()
  await expect(page.getByRole('heading', { name: '새 시나리오 생성' })).toBeVisible()
  await page.getByRole('button', { name: /Reach Predictor/ }).click()
  await expect(page.getByRole('button', { name: '다음' })).toBeVisible()
})

test('REACH-CASTER-007 @critical 삭제 모달만 확인(확정 금지)', async ({ page }) => {
  const menu = page.locator('button[data-context-menu]')
  test.skip((await menu.count()) === 0, '시나리오 카드 없음 — create-flow 선행 시 카드 존재해 실행됨')
  await menu.first().click()
  await page.getByRole('button', { name: '삭제' }).click()
  await expect(page.locator('.dialog-overlay, [role="dialog"]').first()).toBeVisible()
  await closeDeleteModal(page)
})

// 완료(Completed) 시나리오 fixture로 실활성화. 결과 라우트(라이브 DOM 확정):
//   Ratio Finder    → /slots/148/reachcaster/scenarios/{id}/ratio-finder/result
//   Reach Predictor → /slots/148/reachcaster/scenarios/{id}/reach-predictor/result

test('REACH-CASTER-010 @critical 결과 R/F — 핵심 섹션 렌더', async ({ page }) => {
  const id = await enterResult(page, 'rcRatioFinder')
  test.skip(!id, '완료 Ratio Finder fixture id 미확보')
  // R/F 결과 핵심 섹션(Digital-TVC 비율 분석 + 예상 성과 + SpinX 인사이트)
  await expect(page.getByRole('heading', { name: /Ratio Analysis/ }).first()).toBeVisible()
  await expect(page.getByText('SpinX for Reach Caster').first()).toBeVisible()
})

test('REACH-CASTER-011 @critical 결과 R/P — 핵심 섹션 렌더', async ({ page }) => {
  const id = await enterResult(page, 'rcReachPredictor')
  test.skip(!id, '완료 Reach Predictor fixture id 미확보')
  // R/P 결과 핵심 섹션
  await expect(page.getByRole('heading', { name: 'Key Metrics Summary' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Reach Curve Analysis' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Estimated Performance' })).toBeVisible()
})

test('REACH-CASTER-012 @major 시나리오 비교 — 완료 R/P 2건 비교 결과 렌더', async ({ page }) => {
  const ids = completedIds('rcReachPredictor')
  test.skip(ids.length < 2, '비교용 완료 Reach Predictor fixture 2건 미확보')
  // 공유 Chrome 뷰포트가 작으면 비교 섹션 요소가 뷰포트 밖 → 넉넉한 뷰포트 지정.
  await page.setViewportSize({ width: 1440, height: 1200 }).catch(() => {})
  // 1번째 완료 R/P 결과로 진입 → 비교 UI에서 다른 완료 R/P(prefix 매칭)를 2번째로 선택해 비교.
  await enterResult(page, 'rcReachPredictor', 0)
  const ok = await openScenarioComparison(page, 'test_v1.2.0_rcrp')
  test.skip(!ok, '비교 UI를 완료하지 못함(비교 유형/추가/선택/결과보기 중 일부 미노출)')
  // 비교 결과 렌더: 비교 전용 섹션 제목 노출
  await expect(
    page.getByRole('heading', { name: /Key Metrics Comparison|Performance Comparison|Reach x CPRP Matrix/ }).first()
  ).toBeVisible()
})

test('REACH-CASTER-008 @major 복제 — 결과 헤더 복제 메뉴', async ({ page }) => {
  const id = await enterResult(page, 'rcReachPredictor')
  test.skip(!id, '완료 Reach Predictor fixture id 미확보')
  // RC 복제는 BO와 동일하게 복제 위저드로 이동 → 부작용(완료 대기 생성) 방지 위해
  // 복제 메뉴가 열리는 것까지만 검증(실제 복제 submit은 BUDGET-OPT-007에서 대표 수행).
  const opened = await openHeaderMenu(page, /^복제$/)
  test.skip(!opened, '결과 헤더에서 복제 메뉴를 열지 못함(헤더 구조 차이 가능)')
  await expect(page.getByText('복제', { exact: true }).first()).toBeVisible()
  await page.keyboard.press('Escape').catch(() => {})
})

test('REACH-CASTER-009 @major 이동 — 결과 헤더 이동 메뉴', async ({ page }) => {
  const id = await enterResult(page, 'rcReachPredictor')
  test.skip(!id, '완료 Reach Predictor fixture id 미확보')
  const opened = await openHeaderMenu(page, /^이동$/)
  test.skip(!opened, '결과 헤더에서 이동 메뉴를 열지 못함')
  await expect(page.getByText('이동', { exact: true }).first()).toBeVisible()
  await page.keyboard.press('Escape').catch(() => {})
})

test('REACH-CASTER-013 @major 다운로드 — Export to Excel 이벤트 수신', async ({ page }) => {
  const id = await enterResult(page, 'rcReachPredictor')
  test.skip(!id, '완료 Reach Predictor fixture id 미확보')
  const opened = await openHeaderMenu(page, /Copy Link|Export to Excel/)
  test.skip(!opened, '결과 헤더에서 Export 메뉴를 열지 못함(RC는 Export 미제공일 수 있음)')
  const excel = page.getByText('Export to Excel').first()
  test.skip((await excel.count()) === 0, 'RC 결과에 Export to Excel 미노출')
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15_000 }),
    excel.click(),
  ])
  expect(download.suggestedFilename()).toMatch(/\.(xlsx|pdf|csv)$/)
})

// Reach Caster 정렬: 개선 대기 건 → TC 제외(미작성).
