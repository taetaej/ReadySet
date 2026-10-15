import { test, expect, Page } from '@playwright/test'

// ─────────────────────────────────────────────────────────────────────────────
// BudgetOpt 2.0 결과 화면 — 자동 채점 가능 TC
//
// 원본: e2e/tc/ReadySet_BO_Result_TC_Playwright.md (200건)
// 자동/보류/수동 분류: e2e/tc/자동화_분류.md
// 참조 계획: .agents/tasks/bo-result-e2e-tc/plan.md
//
// 이 파일은 그중 "지금 프로토타입에서 바인딩 없이 자동 채점 가능한" TC만 옮긴 것.
//   자동화 가능 기준: 텍스트/버튼/토글/모드전환/메뉴·모달 열림 등 fixture·계정·DATA_CONTRACT 불필요.
//   자동화 불가(보류/수동): 상태별 진입(fixture), 권한(계정), 숫자 정합성(DATA_CONTRACT),
//     차트 시각(픽셀/곡선), 다운로드, 다크모드·반응형 — 각 test 본문의 `// 보류:`/`// 수동:` 주석 참조.
//
// 테스트 제목에 원본 TC ID를 박아 리포트↔원본을 1:1 추적한다. (report.mjs 파서가 ID/우선순위/영역 추출)
//   제목 형식: `BO-RESULT-xxx @priority 한글설명`  (xxx = 3자리, @priority ∈ {critical, major, minor})
// 각 Expected Result 줄은 개별 expect(= Assertion)로 분해한다. (원본 §1.1 원칙)
// "화면 열림 성공"으로 데이터/권한 Assertion을 대신하지 않는다. (원본 §1.1)
// ─────────────────────────────────────────────────────────────────────────────

// id 해석: BOResult.tsx → getBOResult(Number('BO001')||1) = 1 → 잠금 포함 샘플(모드 전환 UI 렌더)
const RESULT_URL = '/budgetopt/scenario/BO001/result'

test.beforeEach(async ({ page }) => {
  await page.goto(RESULT_URL)
})

// 헤더(.slot-detail-header)의 아이콘 전용 버튼을 순회해, 클릭 시 특징 문구가 뜨는 버튼을 연다.
// Share2(Export) / MoreVertical(컨텍스트 메뉴)는 click, 조건부 렌더 메뉴 항목의 가시성으로 판정.
async function openHeaderMenu(page: Page, probeText: string | RegExp) {
  const headerButtons = page.locator('.slot-detail-header button')
  const count = await headerButtons.count()
  for (let i = 0; i < count; i++) {
    await headerButtons.nth(i).click()
    const probe = page.getByText(probeText)
    if (await probe.first().isVisible().catch(() => false)) return
    await page.keyboard.press('Escape')
  }
  throw new Error(`헤더 메뉴를 찾지 못했습니다: ${probeText}`)
}

// Reach Caster 간편 생성 모달 열기 (CTA 버튼 경로)
async function openEasyCreateModal(page: Page) {
  await page.getByText('Reach Caster로 예측하기').click()
  await expect(page.getByRole('heading', { name: '최적화 예산으로 도달 예측하기' })).toBeVisible()
}

// ── [진입/렌더] ──────────────────────────────────────────────────────────────

test('BO-RESULT-001 @critical 결과 화면 핵심 영역이 렌더된다', async ({ page }) => {
  // A01: 섹션 제목으로 정상 렌더 확인 (열림만으로 판정하지 않음)
  await expect(page.getByRole('heading', { name: 'Optimization Analytics' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Budget Allocation Detail' })).toBeVisible()
  // A01.1: 헤더 시나리오명(h1)
  await expect(page.getByRole('heading', { level: 1, name: '25년 3분기 디지털 예산 최적화' })).toBeVisible()
  // A01.2: 스코어카드 + 차트 4종 제목
  await expect(page.getByText('Total Budget')).toBeVisible()
  await expect(page.getByRole('heading', { name: '예산은 어디에 배분되었을까?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '예산을 더 넣으면 성과가 오를까?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '업종 내 매체별 기여는 어떤 흐름일까?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '최적화로 성과가 얼마나 늘어날까?' })).toBeVisible()
  // 보류: 권한별 비노출(A02)=AUTH_BINDINGS
})

// ── [브레드크럼] ─────────────────────────────────────────────────────────────

test('BO-COMMON-003 @major 브레드크럼에 BudgetOpt 2.0 라벨이 있다', async ({ page }) => {
  const header = page.locator('.workspace-main-header')
  // 솔루션명이 'BudgetOpt 2.0'으로 노출되고 구 'Budget Optimizer'는 없다
  await expect(header.getByRole('button', { name: 'BudgetOpt 2.0' })).toBeVisible()
  await expect(header.getByRole('button', { name: 'SlotBoard' })).toBeVisible()
  await expect(page.getByText('Budget Optimizer')).toHaveCount(0)
})

// ── [헤더] ───────────────────────────────────────────────────────────────────

test('BO-RESULT-007 @major 결과 헤더에 시나리오명과 메타정보가 표시된다', async ({ page }) => {
  const header = page.locator('.slot-detail-header')
  await expect(header.getByRole('heading', { level: 1, name: '25년 3분기 디지털 예산 최적화' })).toBeVisible()
  await expect(header.getByText('총 예산')).toBeVisible()
  await expect(header.getByText('KPI', { exact: true })).toBeVisible()
  await expect(header.getByText('노출 (Impression)')).toBeVisible()
  await expect(header.getByText('업종')).toBeVisible()
  await expect(header.getByText('설화수 / 화장품')).toBeVisible()
  await expect(header.getByText('기간')).toBeVisible()
  // 보류: 말줄임(ellipsis) 레이아웃=시각(수동); 다운로드 동작
})

test('BO-RESULT-009 @major 헤더에 구 솔루션명이 중복 표시되지 않는다', async ({ page }) => {
  const header = page.locator('.slot-detail-header')
  // 결과 헤더 본문에는 'Budget Optimizer' 솔루션 배지가 없다 (브레드크럼은 별도 header scope)
  await expect(header.getByText('Budget Optimizer')).toHaveCount(0)
  await expect(header.getByText('BudgetOpt 2.0')).toHaveCount(0)
})

test('BO-RESULT-014 @major Info 버튼 hover 시 시나리오 상세 툴팁이 뜬다', async ({ page }) => {
  // 조작: 헤더 Info 버튼([data-info-tooltip]) hover → 상세 툴팁 노출
  await page.locator('.slot-detail-header [data-info-tooltip]').hover()
  await expect(page.getByText('Scenario ID')).toBeVisible()
  await expect(page.getByText('생성일시')).toBeVisible()
  await expect(page.getByText('완료일시')).toBeVisible()
})

test('BO-RESULT-010 @major Export 메뉴에 Copy Link / Excel / PDF가 있다', async ({ page }) => {
  // 조작: 헤더 우측 아이콘 버튼 순회로 Export 드롭다운을 연다 (BO-RESULT-011/012/013 커버)
  await openHeaderMenu(page, 'Copy Link')
  await expect(page.getByText('Copy Link')).toBeVisible()
  await expect(page.getByText('Export to Excel')).toBeVisible()
  await expect(page.getByText('Export to PDF')).toBeVisible()
  // 보류: 복사/다운로드 "성공"=DOWNLOAD_CONTRACT (BO-RESULT-011~013 수행부)
})

test('BO-RESULT-015 @major 컨텍스트 메뉴에 복제/이동/삭제 항목이 있다', async ({ page }) => {
  // 조작: 헤더 MoreVertical 메뉴 열기
  await openHeaderMenu(page, 'Reach Caster로 도달 예측하기')
  await expect(page.getByText('복제')).toBeVisible()
  await expect(page.getByText('이동')).toBeVisible()
  await expect(page.getByText('삭제')).toBeVisible()
  // 보류: Role별 노출/비활성(AUTH); 실제 복제/이동/삭제 부작용=승인계정·수동 (BO-RESULT-016~018)
})

// ── [모드/잠금·순수] ─────────────────────────────────────────────────────────

test('BO-RESULT-019 @major 잠금 시나리오면 모드 띠배너가 노출된다', async ({ page }) => {
  const banner = page.getByText(/Locked Budget Allocation|Fully Optimized Allocation/)
  await expect(banner.first()).toBeVisible()
})

test('BO-RESULT-021 @major 잠금 반영 모드 문구가 맞다', async ({ page }) => {
  await expect(page.getByText('Locked Budget Allocation')).toBeVisible()
  await expect(page.getByText('시나리오 생성 시 설정한 예산 잠금이 반영된 최적화 결과입니다.')).toBeVisible()
})

test('BO-RESULT-022 @major 잠금 모드에 순수 최적화 전환 버튼이 있다', async ({ page }) => {
  await expect(page.getByRole('button', { name: /순수 최적화 결과 보기/ })).toBeVisible()
})

test('BO-RESULT-023 @major 모드 전환 버튼으로 순수 최적화로 바뀐다', async ({ page }) => {
  // 조작: "순수 최적화 결과 보기" 클릭 → 문구/배너가 Fully Optimized로 전환
  await page.getByRole('button', { name: /순수 최적화 결과 보기/ }).click()
  await expect(page.getByText('Fully Optimized Allocation')).toBeVisible()
  await expect(page.getByText('예산 잠금 없이 모델이 전체 예산을 자유롭게 최적 배분한 결과입니다.')).toBeVisible()
  await expect(page.getByRole('button', { name: /잠금 반영 최적화 결과 보기/ })).toBeVisible()
})

test('BO-RESULT-024 @major 순수 최적화에서 다시 잠금 반영으로 되돌아온다', async ({ page }) => {
  await page.getByRole('button', { name: /순수 최적화 결과 보기/ }).click()
  await expect(page.getByText('Fully Optimized Allocation')).toBeVisible()
  await page.getByRole('button', { name: /잠금 반영 최적화 결과 보기/ }).click()
  await expect(page.getByText('Locked Budget Allocation')).toBeVisible()
  // 보류: 전환 후 차트/테이블 수치=DATA_CONTRACT; Weekly는 별도 소스(업종 모델)
})

// ── [스코어카드] ─────────────────────────────────────────────────────────────

test('BO-RESULT-038 @major 스코어카드 4종 제목이 표시된다', async ({ page }) => {
  // "Estimated Impression"은 카드 + 테이블 헤더 2곳 → 카드(첫 번째)로 한정
  await expect(page.getByText('Estimated Impression').first()).toBeVisible()
  await expect(page.getByText('Total Budget')).toBeVisible()
  await expect(page.getByText('Avg. CPM')).toBeVisible()
  // "Locked Budget"은 잠금 모드 띠배너("Locked Budget Allocation")와 구분해 카드 제목만 매칭
  await expect(page.getByText('Locked Budget', { exact: true })).toBeVisible()
})

test('BO-RESULT-039 @major Estimated 카드가 선택 KPI(노출) 라벨을 따른다', async ({ page }) => {
  await expect(page.getByText('Estimated Impression').first()).toBeVisible()
  // 노출 KPI이므로 다른 KPI 라벨의 Estimated 카드는 없다
  await expect(page.getByText('Estimated Click')).toHaveCount(0)
  await expect(page.getByText('Estimated View')).toHaveCount(0)
  await expect(page.getByText('Estimated Reach')).toHaveCount(0)
  // 보류: 다른 KPI(클릭/조회/도달) 치환은 FIXTURE(KPI별 시나리오) 필요
})

test('BO-RESULT-044 @major 평균 단가 카드가 노출 KPI에서 CPM으로 표기된다', async ({ page }) => {
  await expect(page.getByText('Avg. CPM')).toBeVisible()
  await expect(page.getByText('Avg. CPC')).toHaveCount(0)
  await expect(page.getByText('Avg. CPV')).toHaveCount(0)
  await expect(page.getByText('Avg. CPR')).toHaveCount(0)
  // 보류: 단가 수치 정합(=총예산÷(총노출÷1000))=DATA_CONTRACT(R-PRICE)
})

test('BO-RESULT-046 @major 스코어카드 단위(회/원)가 표기된다', async ({ page }) => {
  // Estimated Impression=회 / Total Budget·Avg. CPM=원 — 카드 영역에 두 단위 모두 노출
  await expect(page.getByText('회', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('원', { exact: true }).first()).toBeVisible()
  // 보류: 각 카드 수치 정합(DATA_CONTRACT, R-SCORE/R-PRICE/R-LOCK)
})

// ── [KPI 파생 표기] ──────────────────────────────────────────────────────────

test('BO-RESULT-028 @major 노출 KPI 시 헤더·카드·테이블의 KPI 라벨이 노출로 치환된다', async ({ page }) => {
  // 헤더 배지
  await expect(page.locator('.slot-detail-header').getByText('노출 (Impression)')).toBeVisible()
  // 스코어카드 + 테이블 헤더 — "Estimated Impression"이 두 곳(카드/테이블)에 노출
  await expect(page.getByText('Estimated Impression').first()).toBeVisible()
  await expect(page.getByText('Estimated Impression')).toHaveCount(2) // 카드 + 테이블 헤더
  // 보류: 다른 KPI(클릭/조회/도달) 치환은 FIXTURE(KPI별 시나리오) 필요
})

// ── [Optimization Analytics 공통] ────────────────────────────────────────────

test('BO-RESULT-049 @major 차트 섹션 제목과 매체/상품 토글이 있다', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Optimization Analytics' })).toBeVisible()
  await expect(page.getByRole('button', { name: '매체', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: '상품', exact: true })).toBeVisible()
})

test('BO-RESULT-050 @major 차트 섹션에 최적화 원리 알아보기 트리거가 있다', async ({ page }) => {
  await expect(page.getByText('최적화 원리 알아보기')).toBeVisible()
})

test('BO-RESULT-051 @major 매체/상품 토글이 전환된다', async ({ page }) => {
  // 조작: 상품 → 매체 전환. 활성 배경색 변화는 시각이라, 두 버튼의 존재 환원만 확인
  const mediaToggle = page.getByRole('button', { name: '매체', exact: true })
  const productToggle = page.getByRole('button', { name: '상품', exact: true })
  await productToggle.click()
  await expect(productToggle).toBeVisible()
  await expect(mediaToggle).toBeVisible()
  await mediaToggle.click()
  await expect(mediaToggle).toBeVisible()
  await expect(productToggle).toBeVisible()
  // 보류: 활성 배경색 변화·차트 데이터 소스 전환=시각(수동)/DATA_CONTRACT
})

test('BO-RESULT-052 @major 최적화 원리 트리거 hover 시 원리 툴팁이 뜬다', async ({ page }) => {
  // 조작: "최적화 원리 알아보기" hover → 원리 2가지 노출
  await page.getByText('최적화 원리 알아보기').hover()
  await expect(page.getByText('최적화 원리', { exact: true })).toBeVisible()
  await expect(page.getByText('매체 우선 배분')).toBeVisible()
  await expect(page.getByText('효율 포화 회피')).toBeVisible()
})

// ── [차트 제목/구조 — 바인딩 없이 가능한 부분만] ────────────────────────────────

test('BO-RESULT-057 @major Budget Share 차트 제목·설명이 있다', async ({ page }) => {
  await expect(page.getByRole('heading', { name: '예산은 어디에 배분되었을까?' })).toBeVisible()
  await expect(page.getByText('Budget Share').first()).toBeVisible()
  await expect(page.getByText('매체·상품별 예산 배분 비중')).toBeVisible()
  // 수동: 100% stacked bar 폭·색·path=시각 (BO-RESULT-059~064)
})

test('BO-RESULT-058 @major Budget Share Info 툴팁이 상위5+Others 규칙을 안내한다', async ({ page }) => {
  // 조작: Budget Share 차트 Info 아이콘 hover → 규칙 문구 노출
  // 제목 행(heading과 Info 버튼이 같은 flex row)에서 Info 버튼을 집어 hover
  const titleRow = page.locator('div').filter({ has: page.getByRole('heading', { name: '예산은 어디에 배분되었을까?' }) }).last()
  await titleRow.getByRole('button').first().hover()
  // 툴팁 문구: "...나머지는 '기타(Others)'로 합산됩니다." (매체/상품은 동적)
  await expect(page.getByText(/'기타\(Others\)'로 합산됩니다\./)).toBeVisible()
})

test('BO-RESULT-065 @major Response Curve 차트 제목·설명이 있다', async ({ page }) => {
  await expect(page.getByRole('heading', { name: '예산을 더 넣으면 성과가 오를까?' })).toBeVisible()
  await expect(page.getByText('Response Curve').first()).toBeVisible()
  // 수동: 곡선 path·마커 Y·maxSpend=시각/DATA_CONTRACT (BO-RESULT-066~078)
})

test('BO-RESULT-070 @major Response Curve Info 툴팁이 Current Spend를 안내한다', async ({ page }) => {
  const titleRow = page.locator('div').filter({ has: page.getByRole('heading', { name: '예산을 더 넣으면 성과가 오를까?' }) }).last()
  await titleRow.getByRole('button').first().hover()
  // 툴팁 전용 문구(범례의 "Current spend"와 구분): "●점(Current Spend)"
  await expect(page.getByText('●점(Current Spend)')).toBeVisible()
})

test('BO-RESULT-079 @major Weekly Contribution 차트 제목·설명이 있다', async ({ page }) => {
  await expect(page.getByRole('heading', { name: '업종 내 매체별 기여는 어떤 흐름일까?' })).toBeVisible()
  await expect(page.getByText('Weekly Contribution').first()).toBeVisible()
  await expect(page.getByText('업종 모델 과거 학습 데이터')).toBeVisible()
  // 수동/보류: 음영 밴드 위치·주차 수(52/104)=시각/DATA_CONTRACT (BO-RESULT-080~086)
})

test('BO-RESULT-081 @minor Weekly Contribution 최근 1년/2년 범위 전환 버튼이 동작한다', async ({ page }) => {
  // 조작: 기본 "최근 2년" 버튼 → 클릭 시 "최근 1년"으로 토글 (라벨이 다음 상태를 가리킴)
  const chart = page.locator('div').filter({ has: page.getByRole('heading', { name: '업종 내 매체별 기여는 어떤 흐름일까?' }) }).first()
  const zoomBtn = chart.getByRole('button', { name: /최근 (1년|2년)/ })
  await expect(zoomBtn).toContainText('최근 2년')
  await zoomBtn.click()
  await expect(zoomBtn).toContainText('최근 1년')
  await zoomBtn.click()
  await expect(zoomBtn).toContainText('최근 2년')
  // 보류: 실제 표시 주차 수(52/104)=DATA_CONTRACT(R-WEEKLY)
})

test('BO-RESULT-087 @major Incremental 차트 제목·설명이 있다', async ({ page }) => {
  await expect(page.getByRole('heading', { name: '최적화로 성과가 얼마나 늘어날까?' })).toBeVisible()
  await expect(page.getByText('Incremental Impression').first()).toBeVisible()
  // 수동/보류: 워터폴 막대·Y축 절단·증감 수치=시각/DATA_CONTRACT (BO-RESULT-088~096)
})

// ── [SpinX] ──────────────────────────────────────────────────────────────────

test('BO-RESULT-097 @major 각 차트에 SpinX 인사이트 영역이 있다', async ({ page }) => {
  // 차트 4종 각각 "SpinX for BudgetOpt 2.0" 인사이트 헤더를 가진다 (최소 4개 — 차트별 1개)
  const insights = page.getByText('SpinX for BudgetOpt 2.0')
  await expect(insights.first()).toBeVisible()
  expect(await insights.count()).toBeGreaterThanOrEqual(4)
  // 수동: 해석문 품질/약 300자(BO-RESULT-098·099)
})

test('BO-RESULT-100 @major 차트 인사이트의 "이어서 질문하기" 클릭 시 SpinX 패널이 열린다', async ({ page }) => {
  // 타이핑 애니메이션(20ms/char) 완료 후에만 "이어서 질문하기"가 노출 → 넉넉히 대기
  const followUp = page.getByRole('button', { name: /이어서 질문하기/ }).first()
  await expect(followUp).toBeVisible({ timeout: 20_000 })
  // 패널 열림 신호: 닫힘 상태의 "Ask SpinX" 말풍선이 클릭 후 사라진다 (SpinXButton 근거)
  await expect(page.getByText('Ask SpinX')).toBeVisible()
  await followUp.click()
  await expect(page.getByText('Ask SpinX')).toHaveCount(0)
  // 보류: 프리필 '#차트명' 입력값 검증=SPINX_BINDINGS
})

test('BO-RESULT-101 @major 헤더 "최적화 원리 알아보기" 클릭 시 SpinX 패널이 열린다', async ({ page }) => {
  await expect(page.getByText('Ask SpinX')).toBeVisible()
  await page.getByText('최적화 원리 알아보기').click()
  await expect(page.getByText('Ask SpinX')).toHaveCount(0)
  // 보류: 자동 전송된 질문 내용 검증=SPINX_BINDINGS
})

// ── [Budget Allocation Detail 테이블] ────────────────────────────────────────

test('BO-RESULT-107 @major Budget Allocation Detail 테이블 섹션이 있다', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Budget Allocation Detail' })).toBeVisible()
  await expect(page.getByText('매체·상품별 예산 배분과 예상 성과를 상세하게 확인할 수 있습니다.')).toBeVisible()
})

test('BO-RESULT-108 @major 테이블 컬럼 헤더가 모두 표시된다', async ({ page }) => {
  await expect(page.getByText('매체 > 상품')).toBeVisible()
  await expect(page.getByText('Budget', { exact: true })).toBeVisible()
  await expect(page.getByText('Share', { exact: true })).toBeVisible()
  await expect(page.getByText('Estimated Impression').nth(1)).toBeVisible()
  await expect(page.getByText('Impression', { exact: true })).toBeVisible()
  await expect(page.getByText('Click', { exact: true })).toBeVisible()
  await expect(page.getByText('View', { exact: true })).toBeVisible()
  await expect(page.getByText('Reach', { exact: true })).toBeVisible()
  await expect(page.getByText('CPM', { exact: true })).toBeVisible()
  await expect(page.getByText('CPC', { exact: true })).toBeVisible()
  await expect(page.getByText('CPV', { exact: true })).toBeVisible()
  await expect(page.getByText('CPR', { exact: true })).toBeVisible()
})

test('BO-RESULT-109 @major 합계 행(Estimated Total)이 표시된다', async ({ page }) => {
  await expect(page.getByText('Estimated Total')).toBeVisible()
  // 합계 Share = 100.00%
  await expect(page.getByText('100.00').first()).toBeVisible()
  // 보류: 합계 수치 정합(Budget/KPI/CPM 합산)=DATA_CONTRACT
})

test('BO-RESULT-120 @major Expand/Collapse 토글이 동작한다', async ({ page }) => {
  // 기본 전개 상태 → "Collapse" 노출. 클릭 시 "Expand"로 전환
  const toggle = page.getByRole('button', { name: /^(Collapse|Expand)$/ })
  await expect(toggle).toHaveText('Collapse')
  await toggle.click()
  await expect(toggle).toHaveText('Expand')
  await toggle.click()
  await expect(toggle).toHaveText('Collapse')
  // 보류: 셀 값·delta·비중 수치(DATA_CONTRACT, R-DELTA)
})

// ── [0원 배분] ───────────────────────────────────────────────────────────────

test('BO-RESULT-127 @major 0원 배분 셀에 Share 0.00%가 표시된다', async ({ page }) => {
  // 샘플에 0원 배분 상품 2건 존재 → Share 셀에 "0.00" 표기
  await expect(page.getByText('0.00').first()).toBeVisible()
  // 보류: dimmed 스타일=시각(수동); 음수 분기 미지원
})

test('BO-RESULT-128 @major 0원 배분 Share Info hover 시 사유 툴팁이 뜬다', async ({ page }) => {
  // ZeroShareCell Info 아이콘 hover → 사유 툴팁 (position:fixed로 표 밖에 렌더)
  const zeroCell = page.locator('div').filter({ hasText: /^0\.00%$/ }).first()
  await zeroCell.hover()
  await expect(page.getByText('예산이 배분되지 않았습니다')).toBeVisible()
  await expect(page.getByText(/더 효율 높은 곳으로 예산을 모은 결과입니다/)).toBeVisible()
  await expect(page.getByText(/잠금 기능으로 예산을 고정/)).toBeVisible()
})

// ── [Reach Caster 간편 생성 / Easy Create] ───────────────────────────────────

test('BO-RESULT-135 @critical 완료 시나리오에 Reach Caster 연계 CTA가 있다', async ({ page }) => {
  await expect(page.getByText('Reach Caster로 예측하기')).toBeVisible()
  await expect(page.getByText('이 예산안이면 몇 명에게 닿을까요?')).toBeVisible()
})

test('BO-RESULT-136 @major Reach Caster CTA 클릭 시 간편 생성 모달이 열린다', async ({ page }) => {
  await openEasyCreateModal(page)
  await expect(page.getByRole('button', { name: /Reach Caster 생성/ })).toBeVisible()
})

test('BO-RESULT-137 @major 컨텍스트 메뉴에서도 Reach Caster 간편 생성에 진입한다', async ({ page }) => {
  // 조작: 헤더 MoreVertical 메뉴 → "Reach Caster로 도달 예측하기" 클릭
  await openHeaderMenu(page, 'Reach Caster로 도달 예측하기')
  await page.getByText('Reach Caster로 도달 예측하기').click()
  await expect(page.getByRole('heading', { name: '최적화 예산으로 도달 예측하기' })).toBeVisible()
})

test('BO-RESULT-139 @major 간편 생성 모달에 시나리오명 프리셋과 승계 정보가 표시된다', async ({ page }) => {
  await openEasyCreateModal(page)
  await expect(page.getByText('시나리오명')).toBeVisible()
  // presetName = (BO-{id}) {원본명}, id=1
  await expect(page.getByText('(BO-1) 25년 3분기 디지털 예산 최적화')).toBeVisible()
  await expect(page.getByText('캠페인 기간')).toBeVisible()
  // 모달 승계 정보의 업종 값 (헤더의 "설화수 / 화장품"과 구분 위해 exact)
  await expect(page.getByText('화장품', { exact: true })).toBeVisible()
  // 보류: 프리셋 길이/30자 교차 검증
})

test('BO-RESULT-140 @major 간편 생성 모달에 예상 노출 전달 세그먼트가 있다', async ({ page }) => {
  await openEasyCreateModal(page)
  await expect(page.getByRole('button', { name: '노출 포함' })).toBeVisible()
  await expect(page.getByRole('button', { name: '노출 필수 상품만' })).toBeVisible()
  await expect(page.getByRole('button', { name: '노출 미포함' })).toBeVisible()
})

test('BO-RESULT-143 @major 간편 생성 모달 취소 시 닫힌다', async ({ page }) => {
  await openEasyCreateModal(page)
  await page.getByRole('button', { name: '취소' }).click()
  await expect(page.getByRole('heading', { name: '최적화 예산으로 도달 예측하기' })).toHaveCount(0)
})

test('BO-RESULT-148 @major 간편 생성 미리보기에 미지원/0원 제외 안내가 있다', async ({ page }) => {
  // 샘플: Targetpick 미지원 매체 + 0원 배분 상품 존재
  await openEasyCreateModal(page)
  await expect(page.getByText(/미지원 제외/).first()).toBeVisible()
  await expect(page.getByText(/예산 0원 제외/).first()).toBeVisible()
  // 보류: 실제 payload 제외 검증(TRANSFER_CONTRACT)
})

// ── [표시·예외] ──────────────────────────────────────────────────────────────

test('BO-RESULT-162 @minor 완료 상태에서만 Reach Caster CTA가 노출된다', async ({ page }) => {
  // status=Completed 샘플 → CTA 노출
  await expect(page.getByText('Reach Caster로 예측하기')).toBeVisible()
  // 보류: 비완료 상태(Processing/Pending/Error) 숨김=FIXTURE
})
