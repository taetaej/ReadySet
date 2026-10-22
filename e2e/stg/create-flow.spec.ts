import {
  test,
  expect,
  createPrivateSlot,
  enterSlot,
  createDataset,
  createBoScenario,
  createRcRatioFinder,
  createRcReachPredictor,
  testName,
  skipReason,
  excluded,
  IS_PRD,
  PRD_BO_EXCLUDED_REASON,
} from './fixtures'

// CREATE-FLOW-002~005는 선행 CREATE-FLOW-001의 slotId 캡처에 의존한다.
const CF_DEP = skipReason('선행 CREATE-FLOW-001 슬롯 생성/슬롯id 캡처 실패 시 skip — serial 의존')

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
//  - 각 모듈 생성 본문은 fixtures.ts의 createDataset/createBoScenario/createRcRatioFinder/
//    createRcReachPredictor 헬퍼로 추출됐다(셀렉터·대기값·최종 생성 클릭·성공 판정 동일).
//    setup-fixture-slot.spec.ts의 대량 생성 루프가 같은 헬퍼를 재사용한다.
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

  test('CREATE-FLOW-002 @critical DataShot 데이터셋 실제 생성 (슬롯 내부)', CF_DEP, async ({ page }) => {
    test.skip(!slotId && !slotName, 'CREATE-FLOW-001에서 슬롯 생성 실패 — 선행 의존')
    await enterSlot(page, slotId, slotName)
    // 슬롯 안에서만 모듈 진입 가능. slotId 없으면 폴백 불가하므로 가드.
    test.skip(!slotId, 'slotId 미캡처 — 모듈 직접 라우트 진입 불가(/slotboard 리다이렉트)')

    await createDataset(page, slotId!, testName('dataset'))
  })

  test('CREATE-FLOW-003 @critical BudgetOpt 2.0 시나리오 실제 생성 (슬롯 내부)', IS_PRD ? excluded(PRD_BO_EXCLUDED_REASON) : CF_DEP, async ({ page }) => {
    // PRD에는 BudgetOpt 2.0 미배포 → 생성 skip. serial 체인은 001 slotId만 공유하므로 003 skip은 004/005에 무해.
    test.skip(IS_PRD, PRD_BO_EXCLUDED_REASON)
    test.skip(!slotId, 'slotId 미캡처 — 모듈 진입 불가')
    await createBoScenario(page, slotId!, testName('bo'))
  })

  test('CREATE-FLOW-004 @critical Reach Caster Ratio Finder 실제 생성 (슬롯 내부)', CF_DEP, async ({ page }) => {
    test.skip(!slotId, 'slotId 미캡처 — 모듈 진입 불가')
    await createRcRatioFinder(page, slotId!, testName('rc-rf'))
  })

  test('CREATE-FLOW-005 @critical Reach Caster Reach Predictor 실제 생성 (슬롯 내부)', CF_DEP, async ({ page }) => {
    test.skip(!slotId, 'slotId 미캡처 — 모듈 진입 불가')
    await createRcReachPredictor(page, slotId!, testName('rc-rp'))
  })
})
