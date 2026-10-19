// ReadySet QA 대시보드 생성기 (버전/회차 누적형)
//
// 흐름:
//   1) npx playwright test            → e2e/results/last-run.json 생성
//   2) QA_VERSION=v1.2.0 node e2e/report.mjs
//        - last-run.json을 e2e/results/runs/ 에 "버전+타임스탬프"로 보관(누적)
//        - runs/ 전체를 읽어 버전별로 그룹핑한 대시보드(e2e/results/dashboard.html) 재생성
//
// 환경변수:
//   QA_VERSION  이번 회차의 대상 버전 (기본 'unversioned')
//   QA_FEATURE  이번 회차의 테스트 범위 라벨 (기본 'BudgetOpt 2.0 결과 화면')

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { dirname, resolve, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const RESULTS_DIR = resolve(__dirname, 'results')
const RUNS_DIR = join(RESULTS_DIR, 'runs')
const LAST_RUN = join(RESULTS_DIR, 'last-run.json')
const OUT_PATH = join(RESULTS_DIR, 'dashboard.html')

const VERSION = process.env.QA_VERSION || 'unversioned'
const FEATURE = process.env.QA_FEATURE || 'BudgetOpt 2.0 결과 화면'

mkdirSync(RUNS_DIR, { recursive: true })

// ── 1) 이번 실행 결과를 runs/ 에 보관 ──────────────────────────
function flatten(json) {
  const specs = []
  function walk(suite) {
    for (const sp of suite.specs || []) {
      const result = sp.tests?.[0]?.results?.[0]
      specs.push({
        title: sp.title,
        status: result?.status || (sp.ok ? 'passed' : 'failed'),
        duration: result?.duration || 0,
        error: result?.error?.message || null
      })
    }
    for (const s of suite.suites || []) walk(s)
  }
  for (const s of json.suites || []) walk(s)
  return specs
}

if (existsSync(LAST_RUN)) {
  const json = JSON.parse(readFileSync(LAST_RUN, 'utf-8'))
  const specs = flatten(json)
  const startedAt = json.stats?.startTime || new Date().toISOString()
  const stamp = startedAt.replace(/[:.]/g, '-').slice(0, 19)
  const run = {
    version: VERSION,
    feature: FEATURE,
    startedAt,
    durationMs: json.stats?.duration ?? specs.reduce((a, s) => a + s.duration, 0),
    specs
  }
  writeFileSync(join(RUNS_DIR, `${VERSION}__${stamp}.json`), JSON.stringify(run, null, 2))
  console.log(`회차 보관: ${VERSION}__${stamp}.json (${specs.length}건)`)
}

// ── 2) runs/ 전체 로드 ────────────────────────────────────────
const runFiles = readdirSync(RUNS_DIR).filter(f => f.endsWith('.json')).sort()
const runs = runFiles.map(f => JSON.parse(readFileSync(join(RUNS_DIR, f), 'utf-8')))

// 버전별 그룹: 각 버전의 '최신 회차'를 대표로, 이력도 함께 보관
const byVersion = new Map()
for (const run of runs) {
  if (!byVersion.has(run.version)) byVersion.set(run.version, [])
  byVersion.get(run.version).push(run)
}
for (const [, list] of byVersion) list.sort((a, b) => a.startedAt.localeCompare(b.startedAt))

// 버전 정렬: 최신 회차가 늦은 순 → 위로
const versions = [...byVersion.entries()].sort((a, b) => {
  const la = a[1][a[1].length - 1].startedAt
  const lb = b[1][b[1].length - 1].startedAt
  return lb.localeCompare(la)
})

// ── 파서/헬퍼 ────────────────────────────────────────────────
function parse(title) {
  const id = (title.match(/^(\S+)/) || [, title])[1]
  const priority = (title.match(/@(\w+)/) || [, 'etc'])[1]
  const area = id.split('-').slice(0, 2).join('-')
  const name = title.replace(/^\S+\s*/, '').replace(/@\w+\s*/, '').trim()
  return { id, priority, area, name }
}
const esc = (s) => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
const fmtDate = (iso) => {
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
const prBadge = (p) => {
  const c = { critical: 'var(--rose)', major: 'var(--amber)', minor: 'var(--blue)', etc: 'var(--muted-fg)' }[p] || 'var(--muted-fg)'
  return `<span class="pr" style="--c:${c}">${esc(p)}</span>`
}

function summarize(specs) {
  const total = specs.length
  const passed = specs.filter(s => s.status === 'passed').length
  const failed = specs.filter(s => s.status === 'failed').length
  const skipped = specs.filter(s => s.status === 'skipped').length
  const rate = total ? Math.round((passed / total) * 100) : 0
  return { total, passed, failed, skipped, rate }
}

// ── 버전 섹션 렌더 ───────────────────────────────────────────
function renderVersion([version, list]) {
  const latest = list[list.length - 1]
  const rows = latest.specs.map(s => ({ ...s, ...parse(s.title) }))
  const sum = summarize(latest.specs)
  const durSec = (latest.durationMs / 1000).toFixed(1)

  // 영역별
  const byArea = {}
  for (const r of rows) {
    byArea[r.area] ??= { total: 0, passed: 0, failed: 0 }
    byArea[r.area].total++
    if (r.status === 'passed') byArea[r.area].passed++
    if (r.status === 'failed') byArea[r.area].failed++
  }
  const areaRows = Object.entries(byArea).map(([area, s]) => {
    const rate = Math.round((s.passed / s.total) * 100)
    return `<tr>
      <td class="mono">${esc(area)}</td>
      <td class="num">${s.total}</td>
      <td class="num ok">${s.passed}</td>
      <td class="num ${s.failed ? 'bad' : 'dim'}">${s.failed}</td>
      <td><div class="bar"><div class="bar-fill" style="width:${rate}%;--rate:${rate}"></div></div></td>
      <td class="num pct">${rate}%</td>
    </tr>`
  }).join('')

  // 회차 이력 (2건 이상일 때)
  const history = list.length > 1
    ? `<div class="history">회차 이력: ${list.map(r => { const su = summarize(r.specs); return `<span class="hist-item" title="${esc(fmtDate(r.startedAt))}">${su.passed}/${su.total}</span>` }).join(' → ')}</div>`
    : ''

  const detail = rows.map(r => `<tr class="row-${r.status}">
    <td class="mono small nowrap">${esc(r.id)}</td>
    <td>${prBadge(r.priority)}</td>
    <td>${esc(r.name)}</td>
    <td class="center">${r.status === 'passed' ? '<span class="ok b">통과</span>' : r.status === 'failed' ? '<span class="bad b">실패</span>' : '<span class="dim">건너뜀</span>'}</td>
    <td class="num dim small">${Math.round(r.duration)}ms</td>
  </tr>${r.error ? `<tr class="errrow"><td></td><td colspan="4"><pre>${esc(r.error)}</pre></td></tr>` : ''}`).join('')

  return `<section class="ver">
    <div class="ver-head">
      <div class="ver-left">
        <span class="ver-tag">${esc(version)}</span>
        <span class="ver-feature">${esc(latest.feature)}</span>
      </div>
      <div class="ver-meta">${esc(fmtDate(latest.startedAt))} · ${durSec}초</div>
    </div>

    <div class="cards">
      <div class="metric"><div class="m-label">전체</div><div class="m-value">${sum.total}</div></div>
      <div class="metric"><div class="m-label">통과</div><div class="m-value ok">${sum.passed}</div></div>
      <div class="metric"><div class="m-label">실패</div><div class="m-value ${sum.failed ? 'bad' : 'dim'}">${sum.failed}</div></div>
      <div class="metric"><div class="m-label">통과율</div><div class="m-value ${sum.rate === 100 ? 'rate100' : 'amber'}">${sum.rate}%</div></div>
    </div>
    ${history}

    <h3 class="sub-h">영역별 결과 <span class="sub-note">어디를 얼마나 테스트했나</span></h3>
    <table class="area">
      <thead><tr><th>영역</th><th class="num">전체</th><th class="num">통과</th><th class="num">실패</th><th>통과율</th><th class="num"></th></tr></thead>
      <tbody>${areaRows}</tbody>
    </table>

    <h3 class="sub-h">테스트 상세 <span class="sub-note">무엇을 테스트했나</span></h3>
    <table class="detail">
      <thead><tr><th>TC ID</th><th>우선순위</th><th>테스트 내용</th><th class="center">결과</th><th class="num">소요</th></tr></thead>
      <tbody>${detail}</tbody>
    </table>
  </section>`
}

const latestOverall = runs.length ? runs.map(r => r.startedAt).sort().slice(-1)[0] : new Date().toISOString()

const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ReadySet · QA 자동 채점 대시보드</title>
<style>
  :root{
    --bg:#0b0b0c; --panel:#141416; --panel-2:#1b1b1e; --fg:#fafafa; --muted-fg:#9a9a9f;
    --border:#2a2a2e;
    /* ReadySet 시그니처 강조 그린(Optimal Point) = "시스템이 짚은 정답" 신호. 핵심 수치에만. */
    --green:#00ff9d;
    /* 성공/증가 의미 그린(토스트 성공·증감 표기와 동일) = 차분한 보조. 바·라벨에. */
    --green-soft:hsl(142 71% 45%);
    --rose:hsl(0 84% 60%); --amber:hsl(38 92% 50%); --blue:#5b9dff;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--fg);
    font-family:'Paperlogy','Pretendard',-apple-system,"Apple SD Gothic Neo",sans-serif;
    font-size:14px;line-height:1.5}
  .wrap{max-width:1080px;margin:0 auto;padding:40px 24px 100px}
  .top{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:4px;flex-wrap:wrap}
  h1{font-size:20px;font-weight:700;margin:0;letter-spacing:-0.01em}
  .top .green-dot{color:var(--green)}
  .lead{color:var(--muted-fg);font-size:13px;margin:6px 0 36px}
  .lead b{color:var(--fg);font-weight:600}

  section.ver{background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:24px 26px;margin-bottom:28px}
  .ver-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px;flex-wrap:wrap}
  .ver-left{display:flex;align-items:center;gap:12px;min-width:0}
  .ver-tag{font-weight:700;font-size:15px;color:var(--bg);background:var(--green);
    border-radius:999px;padding:3px 14px;letter-spacing:0.01em}
  .ver-feature{color:var(--fg);font-size:14px}
  .ver-meta{color:var(--muted-fg);font-size:12px;white-space:nowrap}

  .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px}
  .metric{background:var(--panel-2);border:1px solid var(--border);border-radius:12px;padding:16px 18px}
  .m-label{font-size:12px;color:var(--muted-fg);margin-bottom:8px}
  .m-value{font-size:30px;font-weight:800;line-height:1;letter-spacing:-0.02em}

  .history{color:var(--muted-fg);font-size:12px;margin-bottom:18px}
  .hist-item{color:var(--fg);font-weight:600}

  .sub-h{font-size:13px;font-weight:600;margin:22px 0 10px;color:var(--fg)}
  .sub-note{color:var(--muted-fg);font-weight:400;font-size:12px;margin-left:6px}

  table{width:100%;border-collapse:collapse}
  th{text-align:left;font-size:11px;color:var(--muted-fg);font-weight:500;padding:7px 10px;border-bottom:1px solid var(--border)}
  td{padding:9px 10px;border-bottom:1px solid var(--panel-2);font-size:13px;vertical-align:middle}
  tr:last-child td{border-bottom:none}
  .num{text-align:right}.center{text-align:center}.nowrap{white-space:nowrap}
  .mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
  .small{font-size:12px}.dim{color:var(--muted-fg)}
  /* 통과 텍스트·숫자는 차분한 의미 그린. 시그니처 네온 그린(--green)은 버전태그·통과율 100%만. */
  .ok{color:var(--green-soft)}.bad{color:var(--rose)}.amber{color:var(--amber)}.b{font-weight:700}.pct{font-weight:700}
  .m-value.rate100{color:var(--green)}

  .bar{background:var(--border);border-radius:999px;height:6px;overflow:hidden;min-width:160px}
  .bar-fill{height:100%;background:var(--green-soft)}

  .pr{color:var(--c);border:1px solid color-mix(in srgb,var(--c) 40%,transparent);
    background:color-mix(in srgb,var(--c) 12%,transparent);
    border-radius:999px;padding:1px 9px;font-size:11px;font-weight:600}

  .row-failed td{background:#2a0f16}
  .errrow pre{margin:0;white-space:pre-wrap;color:var(--rose);font-size:12px;
    background:#2a0f16;padding:10px;border-radius:8px}

  .foot{color:var(--muted-fg);font-size:12px;margin-top:28px;line-height:1.8}
  .foot code{background:var(--panel-2);border:1px solid var(--border);border-radius:4px;padding:1px 6px;font-size:11px}
</style></head>
<body><div class="wrap">
  <div class="top">
    <h1>ReadySet <span class="green-dot">·</span> QA 자동 채점 대시보드</h1>
  </div>
  <div class="lead">마지막 실행 <b>${esc(fmtDate(latestOverall))}</b> · 버전 ${versions.length}개 · 자동화 범위: ${esc(FEATURE)}</div>

  ${versions.map(renderVersion).join('')}

  <div class="foot">
    원본 TC: <code>e2e/tc/ReadySet_BO_Result_TC_Playwright.md</code> · 자동/수동 분류: <code>e2e/tc/자동화_분류.md</code><br>
    실행: <code>npx playwright test</code> · 리포트 생성: <code>QA_VERSION=v1.2.0 node e2e/report.mjs</code> · 상세 로그: <code>npx playwright show-report</code>
  </div>
</div></body></html>`

writeFileSync(OUT_PATH, html, 'utf-8')
console.log('대시보드 생성:', OUT_PATH)
console.log(`버전 ${versions.length}개 / 총 회차 ${runs.length}건`)
