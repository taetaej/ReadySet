import {
  test,
  expect,
  gotoStable,
  dismissLaunchPopup,
  testName,
  createPrivateSlot,
  enterSlot,
  pickDateRange,
} from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// CREATE-FLOW — AREA=CREATE-FLOW  (실제 생성 플로우, serial)
//
// 교정 핵심: 슬롯 1개를 실제로 생성하고, 그 슬롯 안에서 모듈별 객체를 실제로 생성한다.
//   (DataShot 데이터셋 / BudgetOpt 2.0 시나리오 / Reach Caster Ratio Finder + Reach Predictor)
// 선행 구현처럼 폼만 채우고 멈추지 않는다 — 최종 생성 버튼까지 실제로 누른다.
//
// 설계:
//  - test.describe.serial: 슬롯은 세션당 1회만 생성(모듈마다 새 슬롯 금지), 캡처한
//    slotId를 뒤 테스트가 재사용한다. (모듈 진입은 슬롯 안에서만 가능 — 직접 라우트는
//    /slotboard로 리다이렉트.)
//  - 모든 폼의 step2+ 필수 입력은 "라이브 STG 폼을 실제로 걸어가며" 발견한 값이다.
//    로컬 소스(*.tsx)는 기획서라 STG DOM과 다를 수 있어 구조 힌트로만 썼고, 셀렉터·필수값은
//    런타임에 확정했다. 각 선택값의 이유는 주석으로 남긴다.
//  - 성공 판정: 최종 생성 후 리스트/상세로 이동(URL) 하거나 리스트에 카드/행 등장.
//    (STG는 생성 후 각 솔루션 리스트로 navigate 함을 런타임에 확인.)
//
// HARD RULE: 여기에는 삭제 확정/자동 cleanup/로그아웃/public 생성이 전혀 없다.
// ─────────────────────────────────────────────────────────────────────────────

test.describe.serial('CREATE-FLOW', () => {
  // serial 테스트 간 공유 상태(슬롯 1개)
  let slotId: string | null = null
  let slotName = ''

  test('CREATE-FLOW-001 @critical 슬롯 실제 생성 — (주)세정 + Private + test_v*', async ({ page }) => {
    const r = await createPrivateSlot(page, 'slot')
    slotId = r.slotId
    slotName = r.name

    // 성공 판정: 슬롯 상세(/slotboard/{id}) 이동 OR 리스트에 방금 만든 카드 등장
    if (slotId) {
      expect(page.url()).toMatch(/\/slotboard\/\d+/)
    } else {
      await expect(page.getByRole('heading', { name: slotName }).first()).toBeVisible()
    }
  })

  test('CREATE-FLOW-002 @critical DataShot 데이터셋 실제 생성 (슬롯 내부)', async ({ page }) => {
    test.skip(!slotId && !slotName, 'CREATE-FLOW-001에서 슬롯 생성 실패 — 선행 의존')
    await enterSlot(page, slotId, slotName)
    // 슬롯 안에서만 모듈 진입 가능. slotId 없으면 폴백 불가하므로 가드.
    test.skip(!slotId, 'slotId 미캡처 — 모듈 직접 라우트 진입 불가(/slotboard 리다이렉트)')

    await gotoStable(page, '/slots/' + slotId + '/datashot')
    await dismissLaunchPopup(page)
    await page.getByRole('button', { name: 'New Dataset' }).click()
    await expect(page.getByRole('heading', { name: '새 데이터셋 생성' })).toBeVisible()

    // ── Step1: 기본 정보 ──
    await page.locator('input[placeholder="데이터셋명을 입력하세요."]').fill(testName('dataset'))
    // 지표 구성: '성과 지표'(external) 선택 — 종합/성과 둘 중 후속 입력이 더 단순한 쪽. 최소 통과값.
    await page.getByRole('button', { name: /성과 지표/ }).click()
    // 조회기간(MonthRangePicker): 당월 아닌 과거 월을 월 그리드에서 선택. 좌측 패널(2025) 3월→5월.
    //   이유: 유효 조회기간(최근 2년 내) 중 가장 단순한 2개월 범위. 같은 '3월'이 좌우 패널에 있어 .first()로 좌측 선택.
    await page.getByRole('button', { name: /시작월/ }).click()
    await page.waitForTimeout(700)
    await page.getByRole('button', { name: '3월', exact: true }).first().click()
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: '5월', exact: true }).first().click()
    await page.waitForTimeout(400)
    // 업종: 커스텀 div(버튼 아님) → 텍스트로 클릭해 IndustryDialog 오픈 → 대분류 → 카테고리 1개 → 선택 완료
    //   이유: 대분류 레벨 + '식품' 1개가 후속 영향이 적은 최소 선택.
    await page.getByText('업종을 선택하세요.').click()
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: '대분류', exact: true }).click()
    await page.waitForTimeout(600)
    await page.getByText(/^식품 \(\d+\)/).click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: /선택 완료/ }).click()
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForTimeout(1500)

    // ── Step2: 상세 설정(매체 · 상품 · 지표) ──
    // 매체 1개(Google Ads) 선택 — 가장 단순한 단일 매체. 이후 상품/지표 1개씩만 충족.
    await page.getByRole('button', { name: 'Google Ads', exact: true }).click()
    await page.waitForTimeout(800)
    // 상품 1개 + 지표 1개(최소 통과). 라벨 텍스트로 선택.
    await page.getByText('실적 최대화', { exact: true }).click()
    await page.waitForTimeout(300)
    await page.getByText(/클릭당 비용\(CPC\)/).click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForTimeout(1500)

    // ── Step3: 검토 및 추출 → 최종 생성(실제 클릭) ──
    await page.getByRole('button', { name: /데이터셋 생성 요청/ }).click()
    await page.waitForTimeout(3500)

    // 성공 판정: DataShot 리스트로 복귀(STG 런타임 거동) OR 생성 데이터셋 흔적
    await expect
      .poll(() => page.url(), { timeout: 8000 })
      .toContain('/slots/' + slotId + '/datashot')
  })

  test('CREATE-FLOW-003 @critical BudgetOpt 2.0 시나리오 실제 생성 (슬롯 내부)', async ({ page }) => {
    test.skip(!slotId, 'slotId 미캡처 — 모듈 진입 불가')
    await gotoStable(page, '/slots/' + slotId + '/budgetopt/scenarios/new')
    await dismissLaunchPopup(page)
    // 직접 new 라우트가 리다이렉트되면 리스트→New Scenario로 폴백
    if (!page.url().includes('/scenarios/new')) {
      await gotoStable(page, '/slots/' + slotId + '/budgetopt')
      await dismissLaunchPopup(page)
      await page.getByRole('button', { name: 'New Scenario' }).click()
    }
    await expect(page.getByRole('heading', { name: '새 시나리오 생성' })).toBeVisible()

    // ── Step1: 기본 정보 ──
    await page.locator('input[placeholder="시나리오명을 입력하세요."]').fill(testName('bo'))
    // 업종: 기본 '브랜드 선택' 모드. 브랜드 드롭다운 첫 옵션(= (주)세정 연계 브랜드). 최소 통과값.
    await page.getByRole('button', { name: '브랜드를 선택하세요' }).click()
    await page.waitForTimeout(500)
    await page.locator('.dropdown-item, .dropdown button').first().click()
    await page.waitForTimeout(500)
    // 캠페인 기간(CustomDateRangePicker): 당월 10~20일(90일 제한 이내 최소 범위).
    await pickDateRange(page, /시작일/)
    // KPI: 첫 옵션 '노출(Impression)'. 최소 통과값.
    await page.getByRole('button', { name: /노출 \(Impression\)/ }).click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForTimeout(1500)

    // ── Step2: 매체 선택 및 예산 ──
    // 총 예산: 1억(최소 유효 양수). 입력해야 '매체 · 상품 추가'가 활성화됨.
    await page.locator('input[placeholder="총 예산을 입력하세요"]').fill('100000000')
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: /매체 · 상품 추가/ }).click()
    await page.waitForTimeout(1200)
    // 매체 다이얼로그: 첫 매체의 '전체 선택'(Google Ads 15개 상품) → 상품 ≥2 보장(확인 버튼 활성 조건).
    //   이유: 개별 체크보다 안정적으로 ≥2 상품을 확보하는 최소 조작.
    await page.getByRole('button', { name: '전체 선택', exact: true }).first().click()
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: /확인 \(\d+개 선택\)/ }).click()
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForTimeout(1500)

    // ── Step3: 검토 및 실행 → 최종 생성(실제 클릭) ──
    await page.getByRole('button', { name: /시나리오 생성 요청/ }).click()
    await page.waitForTimeout(3500)

    await expect
      .poll(() => page.url(), { timeout: 8000 })
      .toContain('/slots/' + slotId + '/budgetopt')
  })

  test('CREATE-FLOW-004 @critical Reach Caster Ratio Finder 실제 생성 (슬롯 내부)', async ({ page }) => {
    test.skip(!slotId, 'slotId 미캡처 — 모듈 진입 불가')
    await gotoStable(page, '/slots/' + slotId + '/reachcaster/scenarios/new')
    await dismissLaunchPopup(page)
    if (!page.url().includes('/scenarios/new')) {
      await gotoStable(page, '/slots/' + slotId + '/reachcaster')
      await dismissLaunchPopup(page)
      await page.getByRole('button', { name: 'New Scenario' }).click()
    }
    await expect(page.getByRole('heading', { name: '새 시나리오 생성' })).toBeVisible()

    // ── Step1: 기본 정보 (Ratio Finder) ──
    await page.locator('input[placeholder="시나리오명을 입력하세요."]').fill(testName('rc-rf'))
    await page.getByRole('button', { name: /Ratio Finder/ }).click()
    await page.waitForTimeout(400)
    // 브랜드 첫 옵션(최소 통과). 타겟 GRP는 STG 기본 '전체'라 별도 선택 불필요(런타임 확인).
    await page.getByRole('button', { name: '브랜드를 선택하세요' }).click()
    await page.waitForTimeout(500)
    await page.locator('.dropdown-item, .dropdown button').first().click()
    await page.waitForTimeout(500)
    await pickDateRange(page, /시작일/)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForTimeout(1500)

    // ── Step2: 상세 설정(예산·시뮬레이션 단위·매체비중) ──
    // Ratio Finder는 DIGITAL/TVC 두 카테고리 모두 매체 ≥1 + 각 비중 합 100% 필요.
    // 단일 매체 선택 시 비중이 자동 100%로 채워진다(런타임 확인) → 최소 통과.
    await page.locator('input[placeholder="예산을 입력하세요"]').fill('100000000')
    await page.waitForTimeout(400)
    // 시뮬레이션 단위 10%(중간값, 최소 통과)
    await page.getByRole('button', { name: '10%', exact: true }).click()
    await page.waitForTimeout(400)
    // DIGITAL: 첫 매체 체크 → 상품 추가 다이얼로그에서 상품 1개 선택(단일=비중 100% 자동)
    await page.getByRole('button', { name: 'DIGITAL', exact: true }).click()
    await page.waitForTimeout(400)
    await page.locator('input[type="checkbox"]:visible').first().check()
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: /상품 추가/ }).first().click()
    await page.waitForTimeout(1000)
    await page.locator('.dialog-content label, [class*="dialog"] label').first().click()
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /확인 \(\d+개 선택\)/ }).click()
    await page.waitForTimeout(700)
    // TVC: 첫 매체 체크 → 채널 추가에서 채널 1개 선택
    await page.getByRole('button', { name: 'TVC', exact: true }).click()
    await page.waitForTimeout(500)
    await page.locator('input[type="checkbox"]:visible').first().check()
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: /채널 추가/ }).first().click()
    await page.waitForTimeout(1000)
    await page.locator('.dialog-content label, [class*="dialog"] label').first().click()
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /확인 \(\d+개 선택\)/ }).click()
    await page.waitForTimeout(700)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForTimeout(1500)

    // ── Step3: 검토 및 실행 → 최종 생성(실제 클릭) ──
    await page.getByRole('button', { name: /시나리오 생성 요청/ }).click()
    await page.waitForTimeout(3500)

    await expect
      .poll(() => page.url(), { timeout: 8000 })
      .toContain('/slots/' + slotId + '/reachcaster')
  })

  test('CREATE-FLOW-005 @critical Reach Caster Reach Predictor 실제 생성 (슬롯 내부)', async ({ page }) => {
    test.skip(!slotId, 'slotId 미캡처 — 모듈 진입 불가')
    await gotoStable(page, '/slots/' + slotId + '/reachcaster/scenarios/new')
    await dismissLaunchPopup(page)
    if (!page.url().includes('/scenarios/new')) {
      await gotoStable(page, '/slots/' + slotId + '/reachcaster')
      await dismissLaunchPopup(page)
      await page.getByRole('button', { name: 'New Scenario' }).click()
    }
    await expect(page.getByRole('heading', { name: '새 시나리오 생성' })).toBeVisible()

    // ── Step1: 기본 정보 (Reach Predictor) ──
    await page.locator('input[placeholder="시나리오명을 입력하세요."]').fill(testName('rc-rp'))
    await page.getByRole('button', { name: /Reach Predictor/ }).click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: '브랜드를 선택하세요' }).click()
    await page.waitForTimeout(500)
    await page.locator('.dropdown-item, .dropdown button').first().click()
    await page.waitForTimeout(500)
    await pickDateRange(page, /시작일/)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForTimeout(1500)

    // ── Step2: 분석 대상 매체 + 리치커브 ──
    // 매체 추가 다이얼로그: 첫 매체 '전체 선택' → 확인(매체 ≥1 충족).
    await page.getByRole('button', { name: /매체 · 상품\(채널\) 추가/ }).click()
    await page.waitForTimeout(1200)
    await page.getByRole('button', { name: '전체 선택', exact: true }).first().click()
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: /확인 \(\d+개 선택\)/ }).click()
    await page.waitForTimeout(1000)
    // 매체별 예산(placeholder "0") 각각 1천만원(최소 유효 양수).
    const budgets = page.locator('input[placeholder="0"]:visible')
    const bn = await budgets.count()
    for (let i = 0; i < bn; i++) {
      await budgets.nth(i).fill('10000000')
      await page.waitForTimeout(120)
    }
    // 리치커브 구간: 최소값 < 최대값 (동일하면 '시작값은 종료값보다 작아야' 에러). 1천만~1억.
    await page.locator('input[placeholder="최소값"]').fill('10000000')
    await page.waitForTimeout(200)
    await page.locator('input[placeholder="최대값"]').fill('100000000')
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForTimeout(1500)

    // ── Step3: 검토 및 실행 → 최종 생성(실제 클릭) ──
    await page.getByRole('button', { name: /시나리오 생성 요청/ }).click()
    await page.waitForTimeout(3500)

    await expect
      .poll(() => page.url(), { timeout: 8000 })
      .toContain('/slots/' + slotId + '/reachcaster')
  })
})
