import { defineConfig } from '@playwright/test'

// ─────────────────────────────────────────────────────────────────────────────
// STG Sanity QA 전용 Playwright 설정 — 라이브 STG/prd에 CDP로 붙어 실행
//
// 로컬 설정(playwright.config.ts)과 분리한다. 로컬은 webServer로 localhost:3000을
// 자동 기동하지만, 여기서는 사용자가 미리 로그인해 둔 실제 Chrome(CDP :9222)에
// chromium.connectOverCDP로 붙어 기존 로그인 컨텍스트를 재사용한다.
// → webServer 없음. 브라우저 기동도 fixture가 CDP로 하므로 projects launch 옵션 불필요.
//
// 실행:
//   1) 디버그 Chrome 띄우고 STG 로그인 (e2e/stg/README.md 참조)
//   2) QA_VERSION=v1.2.0 npx playwright test e2e/stg --config=playwright.stg.config.ts
//
// env:
//   QA_VERSION   생성 객체명 prefix(test_${QA_VERSION}_) · 리포트 버전 태그
//   QA_TARGET    stg | prd (기본 stg)
//   QA_BASE_URL  직접 지정 시 최우선
//   QA_CDP_PORT  디버그 Chrome 포트 (기본 9222)
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.QA_BASE_URL ||
  (process.env.QA_TARGET === 'prd'
    ? 'https://readyset.adly.co.kr'
    : 'https://stg.readyset.adly.co.kr')

export default defineConfig({
  testDir: './e2e/stg',
  timeout: 60_000,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    // report.mjs가 같은 파일을 읽어 버전별 대시보드로 누적한다.
    ['json', { outputFile: 'e2e/results/last-run.json' }]
  ],
  use: {
    baseURL: BASE_URL,
    // 원격 공유 Chrome이라 trace/screenshot 수집이 불안정 → off.
    trace: 'off',
    screenshot: 'off'
  },
  // 실제 브라우저 기동은 fixture(e2e/stg/fixtures.ts)가 CDP로 한다.
  projects: [{ name: 'cdp' }]
})
