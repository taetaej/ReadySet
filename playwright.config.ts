import { defineConfig, devices } from '@playwright/test'

// E2E 테스트 설정 — BudgetOpt 2.0 결과 화면 파일럿
// dev 서버(localhost:3000)가 떠 있는 상태에서 실행한다.
//   npx playwright test e2e           (헤드리스)
//   npx playwright test e2e --headed  (브라우저 보면서)
//   npx playwright show-report        (실행 후 리포트)
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'e2e/results/last-run.json' }]  // 회차별 집계용 데이터
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  // dev 서버가 꺼져 있으면 Playwright가 자동으로 띄우고, 이미 떠 있으면 재사용한다.
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60_000
  }
})
