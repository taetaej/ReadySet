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
# 전체
QA_VERSION=v1.2.0 npx playwright test e2e/stg --config=playwright.stg.config.ts

# 영역별 (경로를 스펙 파일로)
QA_VERSION=v1.2.0 npx playwright test e2e/stg/common-gnb.spec.ts --config=playwright.stg.config.ts
QA_VERSION=v1.2.0 npx playwright test e2e/stg/slotboard.spec.ts  --config=playwright.stg.config.ts

# critical 우선
QA_VERSION=v1.2.0 npx playwright test e2e/stg --config=playwright.stg.config.ts --grep @critical

# 로드/파싱만 확인(브라우저 미기동)
npx playwright test --list --config=playwright.stg.config.ts
```

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
- **생성 객체명은 전부 `test_${QA_VERSION}_`**, 광고주 `(주)세정`, 가시성 `Private`. 공개 슬롯 금지.
  (실생성은 부작용/flaky 우려로 기본 `test.fixme` — 폼 채움·검증까지만.)
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
