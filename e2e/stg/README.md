# ReadySet · STG Sanity QA (Playwright over CDP)

배포 때마다 반복하던 수기 sanity QA를 자동화한다. **라이브 STG**(기본)에, 사용자가
미리 로그인해 둔 실제 Chrome에 CDP로 붙어(`chromium.connectOverCDP`) 기존 로그인
세션을 그대로 재사용해 돌린다. (로컬 dev 서버 흐름인 `e2e/README.md`와는 별개다.)

> 대상: `https://stg.readyset.adly.co.kr` (기본). prd는 `QA_TARGET=prd`로 토글.
> 연결: `browser.contexts()[0]`의 기존 page 재사용. **새 컨텍스트를 만들지 않는다**(세션 유실).
> 셀렉터 근거: `.agents/tasks/stg-sanity-e2e/dom-evidence.md`의 실제 DOM 증거.

---

## 1. 디버그 Chrome 실행 + STG 로그인

테스트는 **스스로 로그인하지 않는다.** 아래로 디버그 포트가 열린 Chrome을 띄우고,
그 창에서 직접 STG에 로그인해 둔다.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/readyset-qa-chrome
```

그 창에서 `https://stg.readyset.adly.co.kr/slotboard`로 이동해 로그인한다.
CDP가 열렸는지 확인:

```bash
curl -s http://localhost:9222/json/version   # Chrome/... 가 나오면 OK
```

---

## 2. 실행

```bash
# 전체 (공유 Chrome이라 --workers=1 권장)
QA_VERSION=v1.2.0 npx playwright test e2e/stg --config=playwright.stg.config.ts --workers=1

# 실생성 플로우만 단독 (serial — 반드시 --workers=1)
QA_VERSION=v1.2.0 npx playwright test e2e/stg/create-flow.spec.ts --config=playwright.stg.config.ts --workers=1

# 영역별 (경로를 스펙 파일로)
QA_VERSION=v1.2.0 npx playwright test e2e/stg/common-gnb.spec.ts --config=playwright.stg.config.ts
QA_VERSION=v1.2.0 npx playwright test e2e/stg/slotboard.spec.ts  --config=playwright.stg.config.ts

# critical 우선
QA_VERSION=v1.2.0 npx playwright test e2e/stg --config=playwright.stg.config.ts --grep @critical

# 로드/파싱만 확인(브라우저 미기동)
npx playwright test --list --config=playwright.stg.config.ts

# 라우틴 whole-dir 런에서 무거운 셋업 제외
QA_VERSION=v1.2.0 npx playwright test e2e/stg --config=playwright.stg.config.ts --workers=1 --grep-invert @setup
```

---

## 2.5. 테스트 전용 고정 픽스처 슬롯 셋업 (수동 1회)

매번 생성하고 완료까지 기다리면 느리다. 그래서 재사용 가능한 영속 슬롯
`test_fixture_slot`((주)세정, Private) **하나**를 만들어 두고, 그 안에 솔루션별 객체를
"생성 요청"으로 대량(목표 25, 최소 20)으로 채워 둔다. 이후 목록/결과/비교/SpinX 테스트는
매번 생성+완료대기 대신 이 슬롯을 재사용한다.

```bash
QA_VERSION=v1.2.0 npx playwright test e2e/stg/setup-fixture-slot.spec.ts --config playwright.stg.config.ts --workers=1
```

- **수동 1회 실행.** 무거우므로 모든 제목에 `@setup` 태그를 달아 라우틴 whole-dir 런에서
  제외한다(라우틴은 `--grep-invert @setup`). 이 셋업은 위 명령처럼 경로로 직접 지정해 돌린다.
- **멱등 재실행.** 다시 돌리면 각 리스트의 기존 `test_v*` 행 수를 세고 **부족분만** 25까지
  채운다(최소 20). 안전하게 반복 실행 가능.
- **완료 대기 없음(타이밍).** DataShot 데이터셋은 거의 즉시 생성된다. BO/RC 시나리오는
  "생성 요청"까지만 수행하며 완료(Completed)는 15분+ 걸린다 — 셋업은 **기다리지 않는다.**
  완료 시나리오 id 수집·결과/SpinX/비교 검증은 이후 단계에서 처리한다.
  (Reach Predictor 2건+가 이후 "시나리오 비교" fixture가 된다.)
- **fixture-ids.json** 은 커밋/재사용된다(`{ slotId, slotName, createdAt, qaVersion, counts }`).
  슬롯 재생성을 강제하려면 이 파일을 지우거나 `slotId`를 비운다.
- **삭제/cleanup/로그아웃/public 생성 없음** — HARD RULES 그대로.

---

## 3. 환경변수

| env | 역할 | 기본값 |
|---|---|---|
| `QA_VERSION` | 생성 객체명 prefix(`test_${QA_VERSION}_`) · 리포트 버전 태그 | (없으면 `test_vLOCAL_` + 경고) |
| `QA_TARGET` | `stg` \| `prd` | `stg` |
| `QA_BASE_URL` | baseURL 직접 지정(최우선) | — |
| `QA_CDP_PORT` | 디버그 Chrome 포트 | `9222` |

---

## 4. HARD RULES (안전 규칙 — 코드로 강제)

- **실제 삭제 안 함.** '삭제' 항목은 삭제 확인 모달이 뜨는지만 확인하고 Escape/취소로
  닫는다. 확정 버튼 클릭 코드는 어디에도 없다. `afterEach/afterAll` 자동 cleanup도 없다.
- **로그아웃 클릭 안 함.** 메뉴 노출만 확인(세션 유지).
- **생성은 실제로 끝까지 수행한다** (`create-flow.spec.ts` — 슬롯 1개 + 모듈별 객체 실생성).
  생성 객체명은 전부 `test_${QA_VERSION}_`, 광고주 `(주)세정`, 가시성 `Private`. 공개 슬롯 금지.
  오직 **DELETE만** 모달 오픈까지(확정 금지). 자동 cleanup 없음 → `test_v*` 객체는 STG에 남고 수동 정리(재실행 시 누적 허용).
- **권한 테스트(admin/marketer/agency/client)는 전부 skip**(단일 Admin 세션).
- **셀렉터는 실제 DOM 증거에서만.** 지어낸 testid 금지. 증거 미확보 항목은 `test.fixme`/`test.skip` + 사유.

---

## 5. 리포트 (버전별 누적 대시보드)

```bash
QA_VERSION=v1.2.0 QA_FEATURE="STG Sanity QA" node e2e/report.mjs
open e2e/results/dashboard.html
```

`report.mjs`는 `e2e/results/last-run.json`을 읽어 버전 섹션으로 누적한다. 제목 형식
`AREA-NNN @priority 한글설명`을 지켜야 영역별로 묶인다.

---

## 6. prd 라운드 예고

STG DOM과 prd DOM이 동일하다는 보장은 없다. STG가 통과하면 같은 디버그 Chrome을
prd(`https://readyset.adly.co.kr`)에 로그인해 두고:

```bash
QA_VERSION=v1.2.0 QA_TARGET=prd npx playwright test e2e/stg --config=playwright.stg.config.ts
```

로 재확인한다. 셀렉터가 어긋나면 dom-evidence를 prd 기준으로 보강한 뒤 수정한다.
