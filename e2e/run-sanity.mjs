// ReadySet · sanity QA 실행 래퍼 (버전·환경 자동 수집 → 전수 실행 → 리포트)
//
// 사람은 이 한 줄만 실행한다:
//   node e2e/run-sanity.mjs
//
// 흐름:
//   1) 디버그 Chrome(CDP :9222)에 connectOverCDP로 붙어, 사용자가 로그인해 둔 기존 page를 재사용
//      (새 컨텍스트·새 탭·새 로그인 금지 — fixtures.ts와 동일 거동).
//      - 버전: <footer>(workspace-footer) 스코프 안의 'ReadySet Platform v1.1.1' 패턴에서 추출.
//        (본문에도 솔루션 버전 v*.*.*가 떠 있으므로 반드시 footer 스코프 + 'ReadySet Platform' 접두로 한정.)
//      - 환경: page.url() 호스트로 판별. stg.readyset.adly.co.kr → stg, readyset.adly.co.kr → prd.
//      - 읽고 바로 CDP 연결만 해제(browser.close()는 사용자 Chrome을 닫지 않음).
//   2) 산출한 QA_VERSION/QA_TARGET을 env로 실어 전수 sanity 실행(@setup 제외, --workers=1).
//   3) 끝나면 같은 env로 report.mjs를 자동 호출 → run JSON에 version/target 정식 기록 + 대시보드 재생성.
//
// override (자동 감지 생략):
//   node e2e/run-sanity.mjs --version v1.1.1 --target prd
//   (또는 환경변수 QA_VERSION / QA_TARGET / QA_BASE_URL 로 지정해도 동일하게 우선한다.)
//
// 자동 감지 실패(푸터 버전 미검출 또는 환경 미판정) 시 조용히 넘어가지 않고 명확히 에러로 종료한다
// (vLOCAL/unversioned로 떨어지지 않는다).

import { chromium } from '@playwright/test'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const CDP_PORT = process.env.QA_CDP_PORT || '9222'

// ── CLI 인자 파싱 (--version / --target) ─────────────────────
function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--version') out.version = argv[++i]
    else if (a === '--target') out.target = argv[++i]
    else if (a.startsWith('--version=')) out.version = a.slice('--version='.length)
    else if (a.startsWith('--target=')) out.target = a.slice('--target='.length)
  }
  return out
}
const args = parseArgs(process.argv.slice(2))

// override: CLI 인자 우선, 없으면 기존 env. (하위 호환 — 수동 QA_VERSION/QA_TARGET 주입도 계속 동작.)
let version = args.version || process.env.QA_VERSION || null
let target = args.target || process.env.QA_TARGET || null

// ── 환경 판정 (URL 호스트 기반) ──────────────────────────────
// stg.readyset.adly.co.kr → stg · readyset.adly.co.kr(stg. 아님) → prd.
function targetFromUrl(url) {
  try {
    const host = new URL(url).hostname
    if (/^stg\.readyset\.adly\.co\.kr$/i.test(host)) return 'stg'
    if (/^readyset\.adly\.co\.kr$/i.test(host)) return 'prd'
    // 기타 호스트: stg 서브도메인 접두 유무로 보수적 판정
    if (/(^|\.)stg\./i.test(host)) return 'stg'
    if (/readyset/i.test(host)) return 'prd'
  } catch {
    /* fallthrough */
  }
  return null
}

// QA_BASE_URL이 명시돼 있으면 그걸로도 환경을 보강 판정할 수 있다.
if (!target && process.env.QA_BASE_URL) {
  const t = targetFromUrl(process.env.QA_BASE_URL)
  if (t) target = t
}

// ── CDP로 붙어 라이브 푸터/URL에서 버전·환경 자동 수집 ────────
// version·target 둘 다 이미 확정됐으면 CDP 감지를 건너뛴다(override 경로).
async function detectFromLive() {
  const endpoint = 'http://localhost:' + CDP_PORT
  let browser
  try {
    browser = await chromium.connectOverCDP(endpoint)
  } catch (e) {
    fail(
      `디버그 Chrome(CDP ${endpoint})에 연결하지 못했습니다.\n` +
        '  → 디버그 Chrome을 띄우고 STG/PRD에 로그인했는지 확인하세요(e2e/stg/README.md §1).\n' +
        '  → 또는 수동으로 --version vX.Y.Z --target stg|prd 를 지정하세요.\n' +
        `  원인: ${e.message}`
    )
  }
  try {
    const contexts = browser.contexts()
    if (!contexts.length) {
      fail(`CDP(:${CDP_PORT})에 기존 컨텍스트가 없습니다. 디버그 Chrome에 로그인했는지 확인하세요.`)
    }
    const pages = contexts[0].pages()
    const page = pages.find((p) => p.url().includes('readyset')) || pages[0]
    if (!page) {
      fail('재사용할 기존 page를 찾지 못했습니다. readyset 탭이 열려 있는지 확인하세요.')
    }

    const url = page.url()

    // 환경: 아직 미확정이면 현재 page URL로 판정.
    if (!target) {
      const t = targetFromUrl(url)
      if (!t) {
        fail(
          `현재 page URL에서 환경을 판정하지 못했습니다: ${url}\n` +
            '  → stg.readyset.adly.co.kr(stg) 또는 readyset.adly.co.kr(prd) 탭이 열려 있어야 합니다.\n' +
            '  → 또는 --target stg|prd 로 지정하세요.'
        )
      }
      target = t
    }

    // 버전: 아직 미확정이면 footer 스코프 + 'ReadySet Platform' 접두로만 파싱.
    if (!version) {
      version = await readFooterVersion(page)
      if (!version) {
        fail(
          '푸터에서 버전(ReadySet Platform vX.Y.Z)을 찾지 못했습니다.\n' +
            '  → 라이브 제품 화면(푸터가 보이는 페이지)이 열려 있는지 확인하세요.\n' +
            '  → 또는 --version vX.Y.Z 로 지정하세요.'
        )
      }
    }
  } finally {
    // 사용자 Chrome은 닫지 않는다. CDP 연결만 해제.
    await browser.close().catch(() => {})
  }
}

/**
 * <footer>(workspace-footer) 스코프 안에서 'ReadySet Platform v(\d+\.\d+\.\d+)'만 매칭한다.
 * 본문에 솔루션 버전 v*.*.*가 떠 있어도 footer 스코프 + 접두 한정이라 오매칭되지 않는다.
 */
async function readFooterVersion(page) {
  const RE = /ReadySet Platform\s+v(\d+\.\d+\.\d+)/
  // 1순위: footer.workspace-footer
  let text = await page
    .locator('footer.workspace-footer')
    .first()
    .textContent({ timeout: 5000 })
    .catch(() => null)
  let m = text && text.match(RE)
  if (m) return 'v' + m[1]
  // 폴백: <footer> 태그 스코프(클래스 변동 대비). 반드시 'ReadySet Platform' 접두 유지.
  text = await page
    .locator('footer')
    .first()
    .textContent({ timeout: 5000 })
    .catch(() => null)
  m = text && text.match(RE)
  if (m) return 'v' + m[1]
  return null
}

function fail(msg) {
  console.error('\n[run-sanity] 자동 수집 실패:\n' + msg + '\n')
  process.exit(1)
}

// ── 메인 ─────────────────────────────────────────────────────
async function main() {
  // version·target 중 하나라도 비었으면 라이브에서 감지.
  if (!version || !target) {
    await detectFromLive()
  }

  // 여기까지 오면 둘 다 확정(감지 실패 시 fail()로 이미 종료됨).
  if (!version || !target) {
    fail('버전·환경을 확정하지 못했습니다(내부 오류).')
  }

  console.log(`[run-sanity] 감지: ${version} / ${target}`)

  const feature = target === 'prd' ? 'PRD Sanity QA' : 'STG Sanity QA'
  const childEnv = {
    ...process.env,
    QA_VERSION: version,
    QA_TARGET: target,
    QA_FEATURE: feature,
  }

  // ── 전수 sanity 실행 (@setup 제외 고정 — PRD 상용 setup 재실행 금지, --workers=1) ──
  console.log('[run-sanity] 전수 실행: playwright test e2e/stg (@setup 제외, --workers=1)')
  const test = spawnSync(
    'npx',
    [
      'playwright',
      'test',
      'e2e/stg',
      '--config=playwright.stg.config.ts',
      '--workers=1',
      '--grep-invert',
      '@setup',
    ],
    { cwd: ROOT, env: childEnv, stdio: 'inherit' }
  )

  // 테스트가 일부 실패해도 리포트는 생성한다(실패분을 대시보드에 기록). spawn 자체 에러만 중단.
  if (test.error) {
    console.error('[run-sanity] playwright test 실행 오류:', test.error.message)
    process.exit(1)
  }

  // ── 리포트 생성 (같은 env — version/target 정식 기록 + 대시보드 재생성) ──
  console.log('[run-sanity] 리포트 생성: node e2e/report.mjs')
  const report = spawnSync('node', ['e2e/report.mjs'], {
    cwd: ROOT,
    env: childEnv,
    stdio: 'inherit',
  })
  if (report.error) {
    console.error('[run-sanity] report.mjs 실행 오류:', report.error.message)
    process.exit(1)
  }

  console.log(`\n[run-sanity] 완료 — ${target.toUpperCase()} · ${version}. 대시보드: e2e/results/dashboard.html`)
  // 테스트 종료코드를 그대로 전파(CI에서 실패 감지 가능).
  process.exit(test.status ?? 0)
}

main().catch((e) => {
  console.error('[run-sanity] 예기치 못한 오류:', e)
  process.exit(1)
})
