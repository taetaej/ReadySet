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
        error: result?.error?.message || null,
        // 선언형 annotation(excluded/blocked/skip-reason)을 함께 보관(요청1·2).
        // 실행 여부와 무관하게 tests[0].annotations에 직렬화된다(조건부 skip/fixme 포함).
        annotations: sp.tests?.[0]?.annotations || []
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

// ── 통계 분류 / skip 사유 (요청1·2) ───────────────────────────────────────────
// 우선순위: run JSON의 선언형 annotation(spec.annotations) → 없으면 아래 정적 분류맵(폴백).
// 정적 맵의 사유는 전부 각 테스트의 "실제 skip 조건/주석" 기반이며 지어내지 않는다
// (스펙 파일의 test.skip/test.fixme 메시지와 일치). annotation 미보유 구버전 run JSON
// (예: annotations 필드 없이 저장된 회차)도 동일한 통계·사유를 재현하도록 한다.
//
//  excluded : 통계 분모 제외(권한·계정 의존 — 영구·의도적, '수동 QA 대상')
//  blocked  : 분모 포함, 미완 자동화 과제(skip일 때만 사유 표시)
//  skip-reason: 분모 포함, 조건부 skip 사유(skip일 때만 사유 표시)
const STATIC_EXCLUDED = {
  'AUTH-001': '권한 테스트 — 단일 Admin 세션(계정 전환/로그아웃 불가)이라 자동화 불가. 수동 QA 대상',
  'AUTH-002': '권한 테스트 — 단일 Admin 세션(계정 전환/로그아웃 불가)이라 자동화 불가. 수동 QA 대상',
  'AUTH-003': '권한 테스트 — 단일 Admin 세션(계정 전환/로그아웃 불가)이라 자동화 불가. 수동 QA 대상',
  'GNB-COMMON-006': 'GNB>FAB(Client 표시) 미노출 — 특정 계정 전용 추정. 단일 Admin 세션에서 자동화 불가. 수동 QA 대상',
  'GNB-COMMON-007': 'GNB>FAB(알림) 미노출 — 특정 계정 전용 추정. 단일 Admin 세션에서 자동화 불가. 수동 QA 대상',
  'GNB-COMMON-008': 'GNB>FAB(등급) 미노출 — 특정 계정 전용 추정. 단일 Admin 세션에서 자동화 불가. 수동 QA 대상',
  'MISC-COMMON-002': '알림 FAB 미노출(GNB>FAB와 동일) — 특정 계정 전용 추정. 자동화 불가. 수동 QA 대상',
  'MISC-COMMON-003': '에이전시/클라이언트 계정 의존 — 단일 Admin 세션에서 자동화 불가. 수동 QA 대상',
  'MISC-COMMON-004': '등급 UI(FAB 경로) 계정 의존 — 단일 Admin 세션에서 미탐색/자동화 불가. 수동 QA 대상',
  'MISC-COMMON-005': '등급 UI(FAB 경로) 계정 의존 — 단일 Admin 세션에서 미탐색/자동화 불가. 수동 QA 대상',
}
const STATIC_BLOCKED = {
  'REACH-CASTER-004': '리스트 모드 토글 셀렉터 미확보 — 라이브 DOM 재확인 필요. 셀렉터를 지어내지 않고 보류(자동화 대상)',
  'REACH-CASTER-008': '완료 RC fixture id 미확보 시 skip. 복제 submit은 BO가 대표로 수행하므로 RC는 메뉴 열림까지만(솔루션당 복제 1건 규칙)',
  'REACH-CASTER-009': '완료 RC fixture id 미확보 시 skip — fixture 수집 시 메뉴 열림까지 자동화 대상',
  'REACH-CASTER-013': '완료 RC fixture id 미확보 또는 RC 결과에 Export to Excel 미노출 시 skip — fixture/Export 확보 시 다운로드 이벤트 검증 대상',
  'BUDGET-OPT-007': '완료 BO fixture id 미확보 시 skip. fixture 확보 시 BO가 대표로 실제 복제 submit(목록 +1 검증, 솔루션당 복제 1건)',
  'BUDGET-OPT-008': '완료 BO fixture id 미확보 시 skip — fixture 확보 시 이동 메뉴 열림까지 자동화 대상(이동 확정 금지)',
  'DATA-SHOT-006': 'DataShot 이동 미지원 — 결과 헤더·리스트 카드 메뉴에 이동 항목 없음(라이브 DOM 확인). 셀렉터를 지어내지 않고 보류',
  'SLOT-HOME-007': '파일이 이미 업로드된 슬롯에서만 노출 — 파일 보유 fixture 미확보(자동화 대상)',
}

/** spec의 annotation(우선) 또는 정적 맵(폴백)에서 분류/사유를 뽑는다. */
function classify(spec) {
  const id = parse(spec.title).id
  const annos = spec.annotations || []
  const byType = (t) => annos.find(a => a.type === t)
  // 1) 선언형 annotation 우선
  if (byType('excluded')) return { kind: 'excluded', reason: byType('excluded').description || '' }
  if (byType('blocked')) return { kind: 'blocked', reason: byType('blocked').description || '' }
  if (byType('skip-reason')) return { kind: 'skip-reason', reason: byType('skip-reason').description || '' }
  // 2) 정적 맵 폴백(annotation 미보유 run JSON)
  if (STATIC_EXCLUDED[id]) return { kind: 'excluded', reason: STATIC_EXCLUDED[id] }
  if (STATIC_BLOCKED[id]) return { kind: 'blocked', reason: STATIC_BLOCKED[id] }
  return { kind: 'none', reason: '' }
}
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
  // 의도적 제외(excluded)는 통과율 분모에서 뺀다(요청1 — % 왜곡 제거).
  // 분류(classify)는 annotation 우선·정적맵 폴백이라 신규/구버전 run JSON 모두 동일 산출.
  const excluded = specs.filter(s => classify(s).kind === 'excluded').length
  const denom = total - excluded
  // '자동화 대상 통과율' = passed / (total − excluded).
  const rate = denom ? Math.round((passed / denom) * 100) : 0
  return { total, passed, failed, skipped, excluded, denom, rate }
}

// 한 회차(run)의 본문(카드/영역별/상세)만 렌더 — 회차 전환 시 서버가 미리 구운 HTML 조각을 토글한다.
// (클라이언트 재집계 대신 회차별 조각을 숨겨두고 바꿔끼움 = 외부 의존 0, 산출 동일 보장)
function renderRunBody(run) {
  const rows = run.specs.map(s => ({ ...s, ...parse(s.title) }))
  const sum = summarize(run.specs)

  // 각 행에 분류(excluded/blocked/skip-reason)와 사유를 붙인다.
  const detailRows = rows.map(r => ({ ...r, cls: classify(r) }))

  // 영역별 통과율도 분모에서 excluded를 뺀다(동일 교정).
  const byArea = {}
  for (const r of detailRows) {
    byArea[r.area] ??= { total: 0, passed: 0, failed: 0, excluded: 0 }
    byArea[r.area].total++
    if (r.status === 'passed') byArea[r.area].passed++
    if (r.status === 'failed') byArea[r.area].failed++
    if (r.cls.kind === 'excluded') byArea[r.area].excluded++
  }
  const areaRows = Object.entries(byArea).map(([area, s]) => {
    const denom = s.total - s.excluded
    const rate = denom ? Math.round((s.passed / denom) * 100) : 0
    return `<tr>
      <td class="mono">${esc(area)}</td>
      <td class="num">${s.total}</td>
      <td class="num ok">${s.passed}</td>
      <td class="num ${s.failed ? 'bad' : 'dim'}">${s.failed}</td>
      <td class="num dim">${s.excluded || '-'}</td>
      <td><div class="bar"><div class="bar-fill" style="width:${rate}%;--rate:${rate}"></div></div></td>
      <td class="num pct">${rate}%</td>
    </tr>`
  }).join('')

  // 상세 행: excluded는 '수동 QA'(muted 배지)로, 그 외 건너뜀은 '건너뜀'으로 표기.
  // 건너뜀 행(excluded/blocked/skip-reason)에 사유가 있으면 바로 아래 muted 소형 행으로 노출(요청2).
  // 지어낸 사유 금지 — classify()가 annotation/정적맵에서 가져온 description만 출력. 통과 건은 사유 숨김.
  const detail = detailRows.map(r => {
    const resultCell =
      r.status === 'passed'
        ? '<span class="ok b">통과</span>'
        : r.status === 'failed'
        ? '<span class="bad b">실패</span>'
        : r.cls.kind === 'excluded'
        ? '<span class="dim b manualqa">수동 QA</span>'
        : '<span class="dim">건너뜀</span>'
    const showReason = r.status === 'skipped' && r.cls.reason
    const reasonLabel = r.cls.kind === 'excluded' ? '제외 사유' : r.cls.kind === 'blocked' ? '미완 사유' : '건너뜀 사유'
    const reasonRow = showReason
      ? `<tr class="skiprow"><td></td><td colspan="4"><span class="skip-tag">${reasonLabel}</span> ${esc(r.cls.reason)}</td></tr>`
      : ''
    return `<tr class="row-${r.status}">
    <td class="mono small nowrap">${esc(r.id)}</td>
    <td>${prBadge(r.priority)}</td>
    <td>${esc(r.name)}</td>
    <td class="center">${resultCell}</td>
    <td class="num dim small">${Math.round(r.duration)}ms</td>
  </tr>${r.error ? `<tr class="errrow"><td></td><td colspan="4"><pre>${esc(r.error)}</pre></td></tr>` : ''}${reasonRow}`
  }).join('')

  // 수동 QA 대상(의도적 제외) 별도 블록 — ID + 사유(요청1).
  const excludedList = detailRows.filter(r => r.cls.kind === 'excluded')
  const manualQaBlock = excludedList.length
    ? `<h3 class="sub-h">수동 QA 대상 <span class="sub-note">의도적 제외 ${excludedList.length}건 · 통과율 분모에서 제외</span></h3>
    <table class="manualqa-tbl">
      <tbody>${excludedList.map(r => `<tr>
        <td class="mono small nowrap">${esc(r.id)}</td>
        <td class="dim small">${esc(r.cls.reason || r.name)}</td>
      </tr>`).join('')}</tbody>
    </table>`
    : ''

  return `<div class="cards">
      <div class="metric"><div class="m-label">전체</div><div class="m-value">${sum.total}</div></div>
      <div class="metric"><div class="m-label">통과</div><div class="m-value ok">${sum.passed}</div></div>
      <div class="metric"><div class="m-label">실패</div><div class="m-value ${sum.failed ? 'bad' : 'dim'}">${sum.failed}</div></div>
      <div class="metric"><div class="m-label">자동화 대상 통과율</div><div class="m-value ${sum.rate === 100 ? 'rate100' : 'amber'}">${sum.rate}%</div>
        <div class="m-sub">의도적 제외 ${sum.excluded}건 통계 제외 · 분모 ${sum.denom}</div></div>
    </div>

    <h3 class="sub-h">영역별 결과 <span class="sub-note">어디를 얼마나 테스트했나 · 통과율 분모는 제외 건 제외</span></h3>
    <table class="area">
      <thead><tr><th>영역</th><th class="num">전체</th><th class="num">통과</th><th class="num">실패</th><th class="num">제외</th><th>통과율</th><th class="num"></th></tr></thead>
      <tbody>${areaRows}</tbody>
    </table>

    ${manualQaBlock}

    <h3 class="sub-h">테스트 상세 <span class="sub-note">무엇을 테스트했나 · 건너뜀엔 사유를 함께 표시</span></h3>
    <table class="detail">
      <thead><tr><th>TC ID</th><th>우선순위</th><th>테스트 내용</th><th class="center">결과</th><th class="num">소요</th></tr></thead>
      <tbody>${detail}</tbody>
    </table>`
}

// ── 버전 섹션 렌더 ───────────────────────────────────────────
function renderVersion([version, list], verIdx) {
  // list는 오래된→최신 순. 회차 선택은 최신이 기본.
  const lastIdx = list.length - 1
  const latest = list[lastIdx]

  // 회차 선택 UI (회차 2건 이상일 때만). 라벨 = 날짜 + passed/total + 통과율.
  const roundSelect = list.length > 1
    ? `<label class="round-pick">
        <span class="round-label">회차</span>
        <select class="round-select" data-ver="${verIdx}" aria-label="${esc(version)} 회차 선택">
          ${list.map((r, i) => {
            const su = summarize(r.specs)
            const isLatest = i === lastIdx
            return `<option value="${i}"${isLatest ? ' selected' : ''}>${esc(fmtDate(r.startedAt))} · ${su.passed}/${su.total} (${su.rate}%)${isLatest ? ' · 최신' : ''}</option>`
          }).reverse().join('')}
        </select>
      </label>`
    : ''

  // 각 회차의 본문 조각을 모두 구워 숨겨두고, 선택된 회차만 표시한다.
  const bodies = list.map((r, i) => {
    const durSec = (r.durationMs / 1000).toFixed(1)
    return `<div class="run-body" data-ver="${verIdx}" data-run="${i}"${i === lastIdx ? '' : ' hidden'}>
      <div class="run-meta">${esc(fmtDate(r.startedAt))} · ${durSec}초</div>
      ${renderRunBody(r)}
    </div>`
  }).join('')

  return `<section class="ver">
    <div class="ver-head">
      <div class="ver-left">
        <span class="ver-tag">${esc(version)}</span>
        <span class="ver-feature">${esc(latest.feature)}</span>
      </div>
      ${roundSelect}
    </div>
    ${bodies}
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
  /* 회차 선택: 무채색 베이스, 강조 없음(1px 구분선만). 시그니처 그린은 버전태그·통과율100%에만. */
  .round-pick{display:flex;align-items:center;gap:8px;white-space:nowrap}
  .round-label{font-size:11px;color:var(--muted-fg)}
  .round-select{appearance:none;background:var(--panel-2);color:var(--fg);
    border:1px solid var(--border);border-radius:8px;padding:6px 28px 6px 12px;font-size:12px;
    font-family:inherit;cursor:pointer;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%239a9a9f' stroke-width='1.4' fill='none' stroke-linecap='round'/></svg>");
    background-repeat:no-repeat;background-position:right 10px center}
  .round-select:hover{border-color:var(--muted-fg)}
  .run-meta{color:var(--muted-fg);font-size:12px;margin:-4px 0 14px}

  .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px}
  .metric{background:var(--panel-2);border:1px solid var(--border);border-radius:12px;padding:16px 18px}
  .m-label{font-size:12px;color:var(--muted-fg);margin-bottom:8px}
  .m-value{font-size:30px;font-weight:800;line-height:1;letter-spacing:-0.02em}
  /* 분모 보조문구: muted 1줄(요청1 — '의도적 제외 N건 통계 제외 · 분모 M'). 강조색 없음. */
  .m-sub{font-size:11px;color:var(--muted-fg);margin-top:8px;line-height:1.4}

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
  /* 건너뜀 사유 행(요청2): 무채색 muted 소형. 강조색·배경 틴트 없음(절제). */
  .skiprow td{color:var(--muted-fg);font-size:12px;padding-top:0;padding-bottom:12px}
  .skip-tag{color:var(--muted-fg);border:1px solid var(--border);border-radius:999px;
    padding:1px 8px;font-size:10px;margin-right:8px;white-space:nowrap}
  .manualqa{font-weight:600}
  /* 수동 QA 대상 블록(요청1): 1px 구분선 + muted. 강조색 없음. */
  .manualqa-tbl td{padding:7px 10px;border-bottom:1px solid var(--panel-2)}
  .manualqa-tbl tr:last-child td{border-bottom:none}

  .foot{color:var(--muted-fg);font-size:12px;margin-top:28px;line-height:1.8}
  .foot code{background:var(--panel-2);border:1px solid var(--border);border-radius:4px;padding:1px 6px;font-size:11px}
</style></head>
<body><div class="wrap">
  <div class="top">
    <h1>ReadySet <span class="green-dot">·</span> QA 자동 채점 대시보드</h1>
  </div>
  <div class="lead">마지막 실행 <b>${esc(fmtDate(latestOverall))}</b> · 버전 ${versions.length}개 · 자동화 범위: ${esc(FEATURE)}</div>

  ${versions.map((v, i) => renderVersion(v, i)).join('')}

  <div class="foot">
    원본 TC: <code>e2e/tc/ReadySet_BO_Result_TC_Playwright.md</code> · 자동/수동 분류: <code>e2e/tc/자동화_분류.md</code><br>
    실행: <code>npx playwright test</code> · 리포트 생성: <code>QA_VERSION=v1.2.0 node e2e/report.mjs</code> · 상세 로그: <code>npx playwright show-report</code>
  </div>
</div>
<script>
  // 회차 선택 → 해당 회차 본문 조각만 표시(서버가 구운 조각 토글). 외부 의존 0.
  document.querySelectorAll('.round-select').forEach(function (sel) {
    sel.addEventListener('change', function () {
      var ver = sel.getAttribute('data-ver')
      var run = sel.value
      document.querySelectorAll('.run-body[data-ver="' + ver + '"]').forEach(function (body) {
        body.hidden = body.getAttribute('data-run') !== run
      })
    })
  })
</script>
</body></html>`

writeFileSync(OUT_PATH, html, 'utf-8')
console.log('대시보드 생성:', OUT_PATH)
console.log(`버전 ${versions.length}개 / 총 회차 ${runs.length}건`)
