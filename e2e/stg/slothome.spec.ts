import { test, expect, gotoStable, dismissLaunchPopup, fixtureSlotId, blocked, skipReason } from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// SlotHome — AREA=SLOT-HOME
// 근거: dom-evidence §3. 데이터가 있는 슬롯 /slotboard/1(권장)로 진입.
// 범위 한정: FinalSet "표시/수정"·Resource "파일 변경"의 데이터 있는 상태는
//   빈 슬롯에선 확인 불가 → "관리 레이어가 열린다"까지로 한정, 실제 저장은 // 보류:.
// ─────────────────────────────────────────────────────────────────────────────

// 데이터가 들어있는 고정 픽스처 슬롯(148, (주)세정/Private)으로 진입 — FinalSet/솔루션 데이터 존재.
test.beforeEach(async ({ page }) => {
  await gotoStable(page, '/slotboard/' + fixtureSlotId())
  await dismissLaunchPopup(page)
})

test('SLOT-HOME-001 @major FinalSet 영역이 표시된다', async ({ page }) => {
  // 상태 분기: 미설정이면 안내 문구, 설정이면 관리 버튼 — 둘 중 하나는 반드시 노출.
  const emptyHint = page.getByText('여기를 눌러 Final Set을 설정하세요')
  const manageBtn = page.getByRole('button', { name: 'Ready to Final Set 관리' })
  const shown = (await emptyHint.count()) > 0 || (await manageBtn.count()) > 0
  expect(shown).toBeTruthy()
  // 보류: 상태별(설정/미설정) fixture 분리 검증.
})

test('SLOT-HOME-002 @major FinalSet 설정 레이어가 열린다', skipReason('FinalSet 관리 버튼 미노출 시 skip — 슬롯 FinalSet 설정 상태 의존'), async ({ page }) => {
  const manageBtn = page.getByRole('button', { name: 'Ready to Final Set 관리' })
  test.skip((await manageBtn.count()) === 0, 'FinalSet 관리 버튼 미노출(슬롯 상태 의존)')
  await manageBtn.click()
  // 솔루션명은 레이어/보드에 중복 등장할 수 있어 first()로 한정.
  await expect(page.getByText('DataShot').first()).toBeVisible()
  // BudgetOpt 2.0은 PRD 배포됨(v1.2.0) → FinalSet 레이어에 노출 확인됨(PRD slot 1142 라이브 관측).
  // 슬롯에 BO 시나리오가 없어도 '선택 가능한 솔루션' 목록이라 노출됨. STG/PRD 공통 단언 복구.
  await expect(page.getByText('BudgetOpt 2.0').first()).toBeVisible()
  await expect(page.getByText('Reach Caster').first()).toBeVisible()
  await expect(page.getByRole('button', { name: '적용' })).toBeVisible()
})

test('SLOT-HOME-003 @major FinalSet 설정 레이어에서 적용 버튼이 노출된다', skipReason('FinalSet 관리 버튼 미노출 시 skip — 슬롯 FinalSet 설정 상태 의존'), async ({ page }) => {
  const manageBtn = page.getByRole('button', { name: 'Ready to Final Set 관리' })
  test.skip((await manageBtn.count()) === 0, 'FinalSet 관리 버튼 미노출(슬롯 상태 의존)')
  await manageBtn.click()
  // 레이어 조작까지만 — 실제 '적용' 저장은 // 보류:(부작용 방지).
  await expect(page.getByRole('button', { name: '적용' })).toBeVisible()
  await page.keyboard.press('Escape')
})

test('SLOT-HOME-004 @major Activity Log 섹션이 표시된다', async ({ page }) => {
  await expect(page.getByText('ACTIVITY LOG')).toBeVisible()
})

test('SLOT-HOME-005 @major Resource 섹션이 표시된다', async ({ page }) => {
  await expect(page.getByText('RESOURCES', { exact: true })).toBeVisible()
})

test('SLOT-HOME-006 @major 파일 추가 레이어가 열린다', skipReason('문서 관리 버튼 미노출 시 skip — 슬롯 상태 의존'), async ({ page }) => {
  const docBtn = page.getByRole('button', { name: '문서 관리' })
  test.skip((await docBtn.count()) === 0, '문서 관리 버튼 미노출(슬롯 상태 의존)')
  await docBtn.click()
  await expect(page.getByText('Resources 관리')).toBeVisible()
  await expect(page.getByRole('button', { name: '파일 추가' })).toBeVisible()
  // 숨김 file input 존재 확인(실제 업로드는 // 보류:)
  await expect(page.locator('input[type=file][accept=".pdf,.pptx,.xlsx,.csv"]')).toHaveCount(1)
  await page.keyboard.press('Escape')
})

test('SLOT-HOME-007 @minor 파일 변경', blocked('파일이 이미 업로드된 슬롯에서만 노출 — 파일 보유 fixture 미확보(자동화 대상)'), async () => {
  test.skip(true, '파일이 존재하는 슬롯에서만 노출 — fixture 미확보')
})
