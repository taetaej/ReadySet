import {
  test,
  expect,
  testName,
  ensureFixtureSlot,
  countListMatches,
  createDataset,
  createBoScenario,
  createRcRatioFinder,
  createRcReachPredictor,
  readFixtureIds,
  writeFixtureIds,
  boExcludedIfPrdFixture,
  IS_PRD,
  PRD_BO_NO_FIXTURE_REASON,
  type FixtureIds,
} from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// FIXTURE-SETUP — 테스트 전용 "고정 픽스처 슬롯" 셋업 (수동 1회 실행)
//
// 목적: 재사용 가능한 영속 슬롯 'test_fixture_slot'((주)세정, Private) 하나를 확보하고,
//   그 안에 솔루션별 객체를 "생성 요청"으로 다양화해 채운다(목표 13, 최소 11 — 페이징 성립). 이후 목록/결과/
//   비교/SpinX 테스트는 매번 생성+완료대기 대신 이 슬롯을 재사용한다.
//
// HARD RULES(이 파일에서 코드로 강제):
//  - --workers=1 전제(serial). 공유 Chrome(CDP) 세션 재사용, 새 컨텍스트 금지.
//  - "생성 요청"까지만 성공으로 본다. 완료(Completed)를 절대 기다리지 않는다
//    (BO/RC 시나리오는 15분+ 소요). 완료 시나리오 id 수집은 이후 단계에서.
//  - 삭제/cleanup/로그아웃/public 생성 전혀 없음.
//  - 멱등: 매 실행마다 기존 test_v* 행을 세고 부족분만 target까지 채운다. 다양화는 "앞으로 만들 것"에만.
//    기존 동일-옵션 생성물(예: PRD dataset 25개)은 cleanup/삭제 없이 그대로 둔다.
//  - 객체 단위 실패는 기록하고 계속 진행(중간 실패해도 20+까지 채우려 시도).
//
// 기본 전체 실행에서 제외: 모든 제목에 @setup 태그. 라우틴 whole-dir 런은
//   `--grep-invert @setup`로 돌리거나, 이 파일을 경로로 직접 지정해야 한다(README 참조).
// ─────────────────────────────────────────────────────────────────────────────

// 개수(13/11): 세 리스트 모두 페이지당 10개 고정(DatasetList/SlotDetail/BOScenarioList의
// itemsPerPage=10 실측). 2페이지 성립 최소 = 11개. TARGET=13이면 2페이지에 3개 → 페이징
// UI·페이지 이동 테스트가 안정적으로 성립. 생성 1건 실패해도 12 ≥ MIN(11) > 10이라 페이징 보장 유지.
// (요청10/11: 개수 과다 불필요, 다양하게. 13개면 기간·예산 조합이 충분히 분산되어 보드에서 "다양"하게 보임.)
const TARGET = 13
const MIN = 11

// PRD 전용 상한: Reach Predictor(rcrp)는 상용 부하 최소화를 위해 최대 2개만 생성한다
// (비교 테스트는 완료 2건이면 충분). STG는 기존대로 TARGET(13)까지. IS_PRD && suffix==='rcrp'일 때만 2.
const PRD_RCRP_CAP = 2

/** 솔루션별 생성 목표치. PRD의 rcrp만 PRD_RCRP_CAP(2)로 낮추고, 나머지는 TARGET. */
function targetFor(suffix: 'dataset' | 'bo' | 'rcrf' | 'rcrp'): number {
  if (IS_PRD && suffix === 'rcrp') return PRD_RCRP_CAP
  return TARGET
}

/** 2자리 zero-padding 시퀀스(dataset_01 ..). */
const pad2 = (n: number) => String(n).padStart(2, '0')

const QA_VERSION = process.env.QA_VERSION ?? 'vLOCAL'

// 대량 생성(최대 13개 × 다단계 폼)은 config의 per-test 60s로 끝나지 않는다.
// 이 셋업 전용으로 넉넉한 per-test 타임아웃을 건다(라우틴 스펙엔 영향 없음).
const SETUP_TIMEOUT_MS = 40 * 60_000

/** fixture-ids.json을 slotId 유지한 채 counts 일부만 병합 저장. */
function persistCounts(slotId: string, patch: Partial<FixtureIds['counts']>): void {
  const prev = readFixtureIds()
  const base: FixtureIds =
    prev && prev.slotId === slotId
      ? prev
      : {
          slotId,
          slotName: 'test_fixture_slot',
          createdAt: new Date().toISOString(),
          qaVersion: QA_VERSION,
          counts: { dataset: 0, bo: 0, rcrf: 0, rcrp: 0 },
          note: 'completed ids collected 15min+ later',
        }
  writeFixtureIds({
    ...base,
    slotId,
    counts: { ...base.counts, ...patch },
  })
}

/**
 * 한 솔루션 리스트를 target까지 채운다(멱등). 기존 개수를 세고 부족분만 생성.
 * 객체 단위 실패는 catch해 기록하고 계속. 최종 (기존+생성) 개수를 반환.
 */
async function fillSolution(
  page: import('@playwright/test').Page,
  slotId: string,
  module: 'datashot' | 'budgetopt' | 'reachcaster',
  suffix: 'dataset' | 'bo' | 'rcrf' | 'rcrp',
  createFn: (
    page: import('@playwright/test').Page,
    slotId: string,
    name: string,
    index: number
  ) => Promise<void>
): Promise<{ total: number; created: number; failures: string[] }> {
  const prefix = testName(suffix + '_')
  const target = targetFor(suffix)
  const have = await countListMatches(page, slotId, module, prefix)
  const failures: string[] = []
  let created = 0

  for (let i = have + created + 1; i <= target; i++) {
    const name = testName(suffix + '_' + pad2(i))
    try {
      // 시퀀스 i(1-based)를 index로 전달 → 각 객체가 기간·예산 조합을 결정적으로 다르게 가진다.
      await createFn(page, slotId, name, i)
      created++
    } catch (e) {
      failures.push(`${name}: ${(e as Error).message?.split('\n')[0] ?? e}`)
      // 실패해도 다음 시퀀스로 계속. target까지 못 채워도 MIN 이상이면 통과.
    }
  }
  return { total: have + created, created, failures }
}

test.describe.serial('FIXTURE-SETUP', () => {
  let slotId = ''

  test('SETUP-001 @setup 고정 픽스처 슬롯 확보(생성 또는 재사용)', async ({ page }) => {
    const r = await ensureFixtureSlot(page)
    slotId = r.slotId
    expect(slotId).toBeTruthy()

    // slotId/메타 저장(counts는 기존 값 유지 — 이후 스텝이 갱신).
    const prev = readFixtureIds()
    const counts =
      prev && prev.slotId === slotId
        ? prev.counts
        : { dataset: 0, bo: 0, rcrf: 0, rcrp: 0 }
    writeFixtureIds({
      slotId,
      slotName: 'test_fixture_slot',
      createdAt: prev?.createdAt || new Date().toISOString(),
      qaVersion: QA_VERSION,
      counts,
      note: 'completed ids collected 15min+ later',
    })
  })

  test('SETUP-002 @setup DataShot 데이터셋 13개 확보(요청)', async ({ page }) => {
    test.skip(!slotId, 'SETUP-001에서 slotId 미확보 — 선행 의존')
    test.setTimeout(SETUP_TIMEOUT_MS)
    const r = await fillSolution(page, slotId, 'datashot', 'dataset', createDataset)
    persistCounts(slotId, { dataset: r.total })
    if (r.failures.length) console.warn('[SETUP-002] 실패:', r.failures)
    expect(r.total, `DataShot 데이터셋 ${r.total}개(최소 ${MIN})`).toBeGreaterThanOrEqual(MIN)
  })

  test('SETUP-003 @setup BudgetOpt 2.0 시나리오 13개 요청', boExcludedIfPrdFixture(), async ({ page }) => {
    // PRD 고정 슬롯에 BO 대량 생성 안 함(fixture 방침) → SETUP-003 PRD skip 유지(fixture-ids.prd.json의 bo=0 유지).
    test.skip(IS_PRD, PRD_BO_NO_FIXTURE_REASON)
    test.skip(!slotId, 'SETUP-001에서 slotId 미확보 — 선행 의존')
    test.setTimeout(SETUP_TIMEOUT_MS)
    // 요청만. 완료(15분+) 절대 대기 안 함.
    const r = await fillSolution(page, slotId, 'budgetopt', 'bo', createBoScenario)
    persistCounts(slotId, { bo: r.total })
    if (r.failures.length) console.warn('[SETUP-003] 실패:', r.failures)
    expect(r.total, `BO 시나리오 ${r.total}개(최소 ${MIN})`).toBeGreaterThanOrEqual(MIN)
  })

  test('SETUP-004 @setup Reach Caster Ratio Finder 13개 요청', async ({ page }) => {
    test.skip(!slotId, 'SETUP-001에서 slotId 미확보 — 선행 의존')
    test.setTimeout(SETUP_TIMEOUT_MS)
    const r = await fillSolution(page, slotId, 'reachcaster', 'rcrf', createRcRatioFinder)
    persistCounts(slotId, { rcrf: r.total })
    if (r.failures.length) console.warn('[SETUP-004] 실패:', r.failures)
    expect(r.total, `RC Ratio Finder ${r.total}개(최소 ${MIN})`).toBeGreaterThanOrEqual(MIN)
  })

  test('SETUP-005 @setup Reach Caster Reach Predictor 요청(PRD는 최대 2개)', async ({ page }) => {
    test.skip(!slotId, 'SETUP-001에서 slotId 미확보 — 선행 의존')
    test.setTimeout(SETUP_TIMEOUT_MS)
    // 2건 이상이 이후 "시나리오 비교" fixture가 된다.
    // PRD는 상용 부하 최소화로 rcrp를 최대 2개(PRD_RCRP_CAP)만 만든다 → 기대 최소치도 그에 맞춘다.
    const r = await fillSolution(page, slotId, 'reachcaster', 'rcrp', createRcReachPredictor)
    persistCounts(slotId, { rcrp: r.total })
    if (r.failures.length) console.warn('[SETUP-005] 실패:', r.failures)
    const rcrpMin = IS_PRD ? PRD_RCRP_CAP : MIN
    expect(r.total, `RC Reach Predictor ${r.total}개(최소 ${rcrpMin})`).toBeGreaterThanOrEqual(rcrpMin)
  })
})
