import { test as base, expect, chromium, Page, BrowserContext } from '@playwright/test'

// ─────────────────────────────────────────────────────────────────────────────
// STG Sanity QA 공용 fixture / 유틸 / 상수
//
// 핵심: Playwright 기본 픽스처는 테스트마다 새 BrowserContext를 만든다 → CDP로 붙은
// 로그인 세션을 잃는다. 그래서 context/page를 오버라이드해 chromium.connectOverCDP로
// "사용자가 로그인해 둔 기존 Chrome"의 contexts()[0] / 기존 page를 그대로 재사용한다.
// 절대 새 컨텍스트를 만들지 않는다(세션 유실).
//
// HARD RULES(코드로 강제):
//  - 실제 삭제 금지 → 삭제는 모달 오픈까지만, Escape/취소로 닫는다. 확정 버튼 클릭 코드 없음.
//  - 로그아웃 클릭 금지 → 메뉴 노출만 확인.
//  - 생성 객체명은 전부 testName()을 거쳐 test_${QA_VERSION}_ prefix를 단다.
//  - 광고주 '(주)세정', 가시성 Private 고정. 공개(public) 슬롯 생성 금지.
//  - afterEach/afterAll 자동 cleanup 없음(다른 데이터 삭제 방지).
// ─────────────────────────────────────────────────────────────────────────────

// ── 상수 ─────────────────────────────────────────────────────────────────────
/** 슬롯 생성 시 사용할 광고주(요청: 나이키 대신 (주)세정). */
export const ADVERTISER = '(주)세정'
/** 가시성은 반드시 Private(비공개). 공개 슬롯 생성 금지. */
export const VISIBILITY_LABEL = /Private \(비공개\)/

export const CDP_PORT = process.env.QA_CDP_PORT || '9222'

/** config와 동일한 baseURL 산출 규칙(스펙에서 직접 참조할 때 사용). */
export const BASE_URL =
  process.env.QA_BASE_URL ||
  (process.env.QA_TARGET === 'prd'
    ? 'https://readyset.adly.co.kr'
    : 'https://stg.readyset.adly.co.kr')

// ── 이름 헬퍼 ────────────────────────────────────────────────────────────────
/**
 * 생성 객체명 생성기. 모든 생성명은 이 헬퍼를 거쳐 그날 배포 버전 prefix를 단다.
 * QA_VERSION이 있으면 `test_${QA_VERSION}_${suffix}`,
 * 없으면 안전 기본값 `test_vLOCAL_${suffix}` + 명확한 경고.
 */
export function testName(suffix: string): string {
  const version = process.env.QA_VERSION
  if (!version) {
    console.warn(
      '[STG QA] QA_VERSION 미설정 → 생성명에 안전 기본값 test_vLOCAL_ 사용. ' +
        '실제 배포 검증에서는 QA_VERSION=v1.2.0 식으로 반드시 지정하세요.'
    )
    return `test_vLOCAL_${suffix}`
  }
  return `test_${version}_${suffix}`
}

// ── 레이어(런치) 팝업 닫기 ───────────────────────────────────────────────────
/**
 * /slotboard 진입 시 뜨는 "BudgetOpt 2.0 신규 오픈!" 런치 팝업이 .dialog-overlay로
 * 포인터 이벤트를 가로챈다. 다른 조작 전 반드시 닫는다.
 * '닫기'만 사용한다. '오늘 하루 안 보기'는 이후 세션에 영향을 주므로 누르지 않는다.
 */
export async function dismissLaunchPopup(page: Page): Promise<void> {
  const popupClose = page.getByRole('button', { name: '닫기' })
  if (await popupClose.count()) {
    await popupClose.first().click().catch(() => {})
    await page.waitForTimeout(300)
  }
}

// ── 진입 안정화 ──────────────────────────────────────────────────────────────
/**
 * 공유 Chrome이 연속 상호작용에서 간헐적으로 응답 불능이 되므로, 진입을
 * domcontentloaded + 짧은 정착 대기로 안정화한다(dom-evidence 안정성 경고 반영).
 */
export async function gotoStable(page: Page, path: string): Promise<void> {
  // CDP로 붙은 기존 page에는 config baseURL이 적용되지 않는다(상대경로 goto가 invalid URL).
  // → BASE_URL을 직접 붙여 절대 URL로 이동한다.
  await page.goto(absUrl(path), { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)
}

/** 상대 경로를 BASE_URL 기준 절대 URL로 변환. 이미 절대 URL이면 그대로. */
export function absUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return BASE_URL.replace(/\/$/, '') + (path.startsWith('/') ? path : '/' + path)
}

/**
 * 삭제 확인 모달을 안전하게 닫는다. 확정 버튼은 절대 누르지 않는다.
 * Escape → (남아있으면) '취소' 버튼 순으로 닫는다.
 */
export async function closeDeleteModal(page: Page): Promise<void> {
  await page.keyboard.press('Escape').catch(() => {})
  await page.waitForTimeout(300)
  const cancel = page.getByRole('button', { name: /^(취소|닫기)$/ })
  if (await cancel.count()) {
    await cancel.first().click().catch(() => {})
  }
}

// ── CDP fixture ──────────────────────────────────────────────────────────────
/**
 * context/page를 오버라이드해 CDP로 붙은 기존 로그인 컨텍스트/페이지를 재사용한다.
 * teardown에서 browser.close()를 호출하지 않는다(사용자 Chrome 유지) — 연결만 해제.
 */
export const test = base.extend<{ context: BrowserContext; page: Page }>({
  context: async ({}, use) => {
    const browser = await chromium.connectOverCDP('http://localhost:' + CDP_PORT)
    const contexts = browser.contexts()
    if (!contexts.length) {
      throw new Error(
        `[STG QA] CDP(:${CDP_PORT})에 기존 컨텍스트가 없습니다. ` +
          '디버그 Chrome을 띄우고 STG에 로그인했는지 확인하세요(e2e/stg/README.md).'
      )
    }
    const ctx = contexts[0]
    await use(ctx)
    // 공유 Chrome이므로 컨텍스트/브라우저를 닫지 않는다. CDP 연결만 해제.
    await browser.close()
  },
  page: async ({ context }, use) => {
    const pages = context.pages()
    const page = pages.find((p) => p.url().includes('readyset')) || pages[0]
    if (!page) {
      throw new Error('[STG QA] 재사용할 기존 page를 찾지 못했습니다. STG 탭이 열려 있는지 확인하세요.')
    }
    page.setDefaultTimeout(8000)
    await use(page)
    // page도 닫지 않는다(사용자 세션 유지).
  }
})

export { expect }
