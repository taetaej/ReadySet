import {
  test,
  expect,
  gotoStable,
  dismissLaunchPopup,
  closeDeleteModal,
  completedIds,
  enterResult,
  fixtureSlotId,
} from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// DataShot — AREA=DATA-SHOT
// 근거: dom-evidence §6. 리스트/생성 진입/삭제 모달까지 증거 확실.
// 결과·이동·다운로드는 완료 데이터셋 fixture 미확보 → fixme.
// 정렬: 개선 대기 건 → 제외(TC 미작성).
//
// 생성 TC: 실제 생성 시 데이터셋명 testName('ds'). 상세 플로우·확정은 fixme.
// 삭제 TC: 모달 노출까지만. 확정 금지.
// ─────────────────────────────────────────────────────────────────────────────

// 데이터가 있는 고정 픽스처 슬롯(148)에서 목록 테스트를 실제 수행.
test.beforeEach(async ({ page }) => {
  await gotoStable(page, '/slots/' + fixtureSlotId() + '/datashot')
  await dismissLaunchPopup(page)
})

test('DATA-SHOT-001 @major 데이터셋 목록이 표시된다', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'New Dataset' })).toBeVisible()
  await expect(page.getByRole('button', { name: '검색' })).toBeVisible()
  await expect(page.getByRole('button', { name: '필터' })).toBeVisible()
})

test('DATA-SHOT-002 @major 검색 — 입력 시 목록이 필터링된다', async ({ page }) => {
  const before = await page.locator('tbody tr').count()
  await page.getByRole('button', { name: '검색' }).click()
  const input = page.locator('input[placeholder="데이터셋명, 생성자"]')
  await expect(input).toBeVisible()
  await input.fill('test_v1.2.0_dataset_01')
  await page.waitForTimeout(1500)
  const after = await page.locator('tbody tr').count()
  expect(after).toBeLessThan(before)
})

test('DATA-SHOT-003 @major 필터 — 상태 필터 적용 시 목록이 변한다', async ({ page }) => {
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

test('DATA-SHOT-009 @minor 페이징 — 2페이지 이동 시 행 집합이 바뀐다', async ({ page }) => {
  const page2 = page.getByRole('button', { name: '2', exact: true })
  test.skip((await page2.count()) === 0, '페이지가 1개뿐 — 페이징 미노출')
  await expect(page.locator('tbody tr').first()).toBeVisible()
  const firstIdP1 = (await page.locator('tbody tr td').nth(1).textContent())?.trim()
  await page2.first().click()
  await page.waitForTimeout(1500)
  // 페이지 전환 후 테이블이 다시 그려질 때까지 대기
  await expect(page.locator('tbody tr').first()).toBeVisible()
  const firstIdP2 = (await page.locator('tbody tr td').nth(1).textContent())?.trim()
  expect(firstIdP2).not.toBe(firstIdP1)
})

// 실제 최종 생성은 create-flow.spec.ts(CREATE-FLOW-002)가 소유한다. 여기서는 생성 화면 진입까지만 검증.
test('DATA-SHOT-004 @critical 생성 진입', async ({ page }) => {
  await page.getByRole('button', { name: 'New Dataset' }).click()
  // 생성 화면 진입 확인. 최종 생성은 create-flow가 담당(중복 생성 방지).
  await expect(page.getByRole('heading', { name: '새 데이터셋 생성' })).toBeVisible()
})

test('DATA-SHOT-005 @critical 삭제 모달만 확인(확정 금지)', async ({ page }) => {
  const menu = page.locator('button[data-context-menu]')
  test.skip((await menu.count()) === 0, '데이터셋 카드 없음 — create-flow 선행 시 카드 존재해 실행됨')
  await menu.first().click()
  await page.getByRole('button', { name: '삭제' }).click()
  await expect(page.locator('.dialog-overlay, [role="dialog"]').first()).toBeVisible()
  await closeDeleteModal(page)
})

// 결과: 완료(Completed) 데이터셋 fixture로 실활성화. 라우트: /slots/148/datashot/datasets/{id}
test('DATA-SHOT-007 @critical 결과 — 데이터셋 결과 화면 렌더', async ({ page }) => {
  const id = await enterResult(page, 'dataset')
  test.skip(!id, '완료 데이터셋 fixture id 미확보(completed.dataset 비어있음)')
  // 데이터셋 결과 핵심 섹션(추출 데이터) + 데이터셋명 헤딩 렌더
  await expect(page.getByRole('heading', { name: 'Extracted Data' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /^test_v1\.2\.0_dataset/ }).first()).toBeVisible()
})

test.fixme('DATA-SHOT-006 @major 이동', async () => {
  // 라이브 DOM 확인: 데이터셋 결과 화면 헤더(업종/조회조건/지표 상세 보기 버튼)·리스트 카드 메뉴(수정/삭제)에
  // '이동' 항목이 존재하지 않음 → DataShot은 이동 미지원. 지어내지 않고 사유와 함께 fixme 유지.
})
test.fixme('DATA-SHOT-008 @major 다운로드', async () => {
  // 라이브 DOM 확인: 데이터셋 결과 화면에 Export/다운로드 트리거(Copy Link/Excel/PDF 등) 미노출.
  // DataShot 결과는 다운로드 계약 없음 → 지어내지 않고 사유와 함께 fixme 유지.
})

// DataShot 정렬: 개선 대기 건 → TC 제외(미작성).
