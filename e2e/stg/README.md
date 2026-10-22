# ReadySet · STG Sanity QA (Playwright over CDP)

배포 때마다 반복하던 수기 sanity QA를 자동화한다. **라이브 STG**(기본)에, 사용자가
미리 로그인해 둔 실제 Chrome에 CDP로 붙어(`chromium.connectOverCDP`) 기존 로그인
세션을 그대로 재사용해 돌린다. (로컬 dev 서버 흐름인 `e2e/README.md`와는 별개다.)

> 대상: `https://stg.readyset.adly.co.kr` (기본). prd는 `QA_TARGET=prd`로 토글.
> 연결: `browser.contexts()[0]`의 기존 page 재사용. **새 컨텍스트를 만들지 않는다**(세션 유실).
> 셀렉터 근거: `.agents/tasks/stg-sanity-e2e/dom-evidence.md`의 실제 DOM 증거.

---

## 0. Quick Start (처음이라면 이것만)

**처음 1회**: 디버그 Chrome 띄우고(§1) → 그 창에서 STG 로그인 → 고정 픽스처 슬롯 셋업 1회(§2.5).
**매 배포 때**: 디버그 Chrome이 STG 로그인된 상태인지 확인 → 전수 실행(아래) → 리포트 생성 → 대시보드 확인.

```bash
# 0) (최초 1회) 디버그 Chrome 실행 → 열린 창에서 https://stg.readyset.adly.co.kr/slotboard 로그인
#    (평소 쓰는 Chrome과 분리된 전용 프로필로 띄운다 — 자세한 주의는 §1)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 --user-data-dir=/tmp/qa-chrome

# 1) CDP 연결 확인 (Chrome/... 나오면 OK)
curl -s http://localhost:9222/json/version

# 2) (최초 1회) 고정 픽스처 슬롯 셋업 — 목록/결과/비교/SpinX 테스트가 재사용할 데이터 채우기
QA_VERSION=v1.2.0 npx playwright test e2e/stg/setup-fixture-slot.spec.ts --config=playwright.stg.config.ts --workers=1

# 3) 전수 sanity 실행 (배포 때마다)
QA_VERSION=v1.2.0 npx playwright test e2e/stg --config=playwright.stg.config.ts --workers=1 --grep-invert @setup

# 4) 리포트(대시보드) 생성 + 열기
QA_VERSION=v1.2.0 QA_FEATURE="STG Sanity QA" node e2e/report.mjs
open e2e/results/dashboard.html
```

- **반드시 지킬 전제**: ① 디버그 Chrome(§1)이 떠서 STG에 로그인돼 있어야 한다(테스트는 로그인하지 않음). ② 공유 Chrome이라 `--workers=1`. ③ `QA_VERSION`은 그날 배포 버전으로 준다(생성물 이름 prefix + 리포트 버전 태그).
- **PRD에서 돌릴 때**: 같은 Chrome을 PRD(`https://readyset.adly.co.kr`)에 로그인해 두고, 위 명령 앞에 `QA_TARGET=prd`를 붙인다. BudgetOpt 2.0은 PRD 미배포라 자동 제외된다(§6).
- 더 자세히: 부분 실행 레시피 §2.2 · 고정 슬롯 셋업 §2.5 · 다양화 규칙 §2.6 · 환경변수 §3 · 안전 규칙 §4 · 리포트 §5 · PRD §6.

---

## 1. 디버그 Chrome 실행 + STG 로그인

테스트는 **스스로 로그인하지 않는다.** 아래로 디버그 포트가 열린 Chrome을 띄우고,
그 창에서 직접 STG에 로그인해 둔다.

```bash
# macOS. --user-data-dir 는 "평소 쓰는 Chrome과 분리된 전용 프로필" 경로다(아무 경로나 OK, 일관되게 쓰면 됨).
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/qa-chrome
```

그 창에서 `https://stg.readyset.adly.co.kr/slotboard`로 이동해 로그인한다.
CDP가 열렸는지 확인:

```bash
curl -s http://localhost:9222/json/version   # Chrome/... 가 나오면 OK
```

**처음 쓰는 사람이 자주 막히는 2가지:**

1. **평소 쓰던 Chrome이 떠 있으면 디버그 포트가 안 열린다.** 이미 실행 중인 Chrome이 있으면
   위 명령이 그 기존 창에 붙어버려 `--remote-debugging-port`가 무시된다. 그래서 **전용
   `--user-data-dir`(위 `/tmp/qa-chrome`)로 별도 프로필을 띄운다** — 이러면 평소 Chrome과
   독립된 새 창이 떠서 디버그 포트가 확실히 열린다. (평소 Chrome은 켜둔 채여도 된다.)
2. **전용 프로필은 로그인이 안 돼 있다.** `/tmp/qa-chrome`은 깨끗한 프로필이라 처음 띄우면
   로그인 안 된 상태다. 그 창에서 **직접 STG(또는 PRD) 로그인을 한 번 해줘야** 테스트가
   그 세션을 재사용한다. (같은 프로필을 계속 쓰면 보통 로그인이 유지되지만, 세션이 만료되면
   그 창에서 다시 로그인하면 된다.)

> 트러블슈팅: `curl .../json/version`이 응답 없으면 → 디버그 Chrome이 안 떴거나 포트가 다른 것.
> 위 1번(기존 Chrome 충돌)을 의심하고, 전용 프로필로 다시 띄운다. 포트를 바꿨다면 `QA_CDP_PORT`도 맞춘다(§3).
> 테스트가 로그인 화면으로 튕기면 → 세션 만료. 그 Chrome 창에서 다시 로그인하면 이어서 된다.

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

> **전수 실행 소요 ≈ 6.6분 (리포트 생성까지 포함).** 위 `--grep-invert @setup` 커맨드 기준 벽시계
> `real 396s`(≈6.6분)에 **80건 중 66 pass / 14 skip / 0 fail**. 이어서
> `QA_VERSION=v1.2.0 QA_FEATURE="STG Sanity QA" node e2e/report.mjs`로 대시보드 재생성까지 수 초 내 완료.
> (완료 fixture 기반이라 시나리오 생성 완료를 기다리지 않음. SpinX는 '중단' 버튼 등장까지만 = 경량.
> 복제/이동/다운로드 결과계열 반복 진입을 결과 헤더 메뉴 셀렉터 안정화로 줄여 직전 8.0분 → 6.6분.)
>
> **통계 분모 교정(요청1).** 리포트 '자동화 대상 통과율'은 `passed / (total − excluded)`로 센다.
> 의도적 제외(excluded)는 권한(AUTH)·계정 의존(GNB>FAB, 등급/알림) 등 **자동화가 구조적으로 불가**한
> 10건으로, 통과율 분모에서 빠지고 '수동 QA 대상'으로 따로 표기된다. 이번 라운드 기준
> **자동화 대상 통과율 94% (의도적 제외 10건 통계 제외, 분모 70)**. 전체 total/pass/skip 숫자는 그대로 보존.
>
> **skip 사유 노출(요청2).** 각 건너뜀 행 옆에 사유가 함께 표시된다(제외 사유/미완 사유/건너뜀 사유).
> 사유는 선언형 annotation(`excluded`/`blocked`/`skip-reason`) 우선, 없으면 `report.mjs`의 정적
> 분류맵 폴백 — 전부 실제 skip 조건 기반이며 지어내지 않는다. 남은 blocked 4건:
> REACH-CASTER-004(리스트 모드 토글 셀렉터 미확보), DATA-SHOT-006(이동 미지원)/008(다운로드 미지원), SLOT-HOME-007(파일 보유 fixture 미확보).
>
> **생성물 네이밍(타임스탬프).** CREATE-FLOW가 만드는 슬롯/모듈 등 "생성-검증용" 객체명은
> `test_${QA_VERSION}_<base>_<MMDD-HHMM>` 형식으로 **실행 회차 타임스탬프**가 붙는다
> (예: `test_v1.2.0_slot_1021-2333`, `test_v1.2.0_dataset_1021-2333_01`). 한 전수 실행 = 한 타임스탬프
> (실행 시작 시 1회 계산해 공유)라 보드에서 "언제/몇 회차 건지" 바로 구분된다. 복제본은 앱이 `(복제)`
> 접두를 붙여 원본의 타임스탬프가 뒤따른다. **단, 고정 픽스처 슬롯 `test_fixture_slot`(id=148)은
> 재사용 목적이라 타임스탬프 없이 이름 고정.**

---

## 2.2. 실행 레시피 — 전수만이 아니라 "부분 실행"도 된다

전수로만 돌릴 필요 없다. Playwright가 **파일(솔루션) 단위**·**제목(grep) 단위**로 선택 실행을
기본 지원한다. 용도별로 아래를 골라 쓴다. (공유 Chrome이라 전부 `--workers=1` 권장)

> 공통 접두: `QA_VERSION=v1.2.0 npx playwright test ... --config=playwright.stg.config.ts --workers=1`
> 아래는 뒤에 붙이는 **대상 지정부**만 보여준다.

| 용도 | 대상 지정 | 비고 |
|---|---|---|
| **전수 sanity** (배포 후 전체) | `e2e/stg --grep-invert @setup` | 플랫폼 전체 정상 확인. ≈6.6분. 리포트 대표값은 이걸로. |
| **빠른 스모크** (핵심만) | `e2e/stg --grep @critical` | critical만. 가장 빠름. "최소한 안 깨졌나" 확인용. |
| **솔루션 1개** (파일) | `e2e/stg/budgetopt.spec.ts` | 그 솔루션만 배포했을 때. 파일명만 바꾸면 됨. |
| **솔루션 여러 개** | `e2e/stg/budgetopt.spec.ts e2e/stg/datashot.spec.ts` | 경로를 공백으로 나열. |
| **영역 ID로** | `e2e/stg --grep "BUDGET-OPT"` | 파일 대신 TC ID 접두로. 여러 영역은 `--grep "BUDGET-OPT\|REACH-CASTER"`. |
| **TC 1개** (핀포인트) | `e2e/stg --grep "DATA-SHOT-008"` | 방금 고친 것만 재확인할 때. |
| **느린 것 제외** | `e2e/stg --grep-invert "SPINX\|@setup"` | SpinX(외부 LLM 호출) 빼고 더 빠르게. |
| **로드/파싱만** (브라우저 X) | `--list` (QA_VERSION 불필요) | 문법·셀렉터 로드만 확인. 즉시. |

스펙 파일 목록(솔루션 ↔ 파일):
`common-gnb.spec.ts`(공통/GNB) · `common-misc.spec.ts`(DOCS·알림·등급) · `slotboard.spec.ts` ·
`slothome.spec.ts` · `reachcaster.spec.ts` · `datashot.spec.ts` · `budgetopt.spec.ts` ·
`spinx.spec.ts` · `create-flow.spec.ts`(실생성, serial) · `setup-fixture-slot.spec.ts`(`@setup`, 수동 1회) · `auth.spec.ts`(권한, 전부 skip).

**주의 2가지**
- **리포트 통계는 "그 실행에 포함된 TC만" 반영된다.** BudgetOpt만 돌리면 대시보드엔 BudgetOpt만
  찍힌다. → "전체 플랫폼 정상 확인"이 목적이면 **전수**, "특정 부분 빠르게"면 **부분 실행**으로 용도를 나눈다.
  부분 실행 후 `node e2e/report.mjs`를 돌리면 그 부분만 담긴 회차가 누적되니, 전체 통과율을 남기려면 전수로 돌린 뒤 리포트를 생성한다.
- **결과/비교/SpinX 계열은 고정 픽스처 슬롯(2.5)에 완료 데이터가 있어야** 실행된다. 부분 실행이어도
  그 슬롯을 재사용하므로 별도 준비는 불필요하다(셋업이 한 번 돼 있으면 됨).

---

## 2.5. 테스트 전용 고정 픽스처 슬롯 셋업 (수동 1회)

매번 생성하고 완료까지 기다리면 느리다. 그래서 재사용 가능한 영속 슬롯
`test_fixture_slot`((주)세정, Private) **하나**를 만들어 두고, 그 안에 솔루션별 객체를
"생성 요청"으로 **다양화해**(목표 13, 최소 11) 채워 둔다. 이후 목록/결과/비교/SpinX 테스트는
매번 생성+완료대기 대신 이 슬롯을 재사용한다. (개수·다양화 규칙은 아래 **2.6**.)

```bash
QA_VERSION=v1.2.0 npx playwright test e2e/stg/setup-fixture-slot.spec.ts --config playwright.stg.config.ts --workers=1
```

- **수동 1회 실행.** 무거우므로 모든 제목에 `@setup` 태그를 달아 라우틴 whole-dir 런에서
  제외한다(라우틴은 `--grep-invert @setup`). 이 셋업은 위 명령처럼 경로로 직접 지정해 돌린다.
- **멱등 재실행.** 다시 돌리면 각 리스트의 기존 `test_v*` 행 수를 세고 **부족분만** 13까지
  채운다(최소 11). 안전하게 반복 실행 가능. 다양화는 "앞으로 만들 것"에만 적용 —
  기존 동일-옵션 생성물은 cleanup/삭제 없이 그대로 둔다.
- **완료 대기 없음(타이밍).** DataShot 데이터셋은 거의 즉시 생성된다. BO/RC 시나리오는
  "생성 요청"까지만 수행하며 완료(Completed)는 15분+ 걸린다 — 셋업은 **기다리지 않는다.**
  완료 시나리오 id 수집·결과/SpinX/비교 검증은 이후 단계에서 처리한다.
  (Reach Predictor 2건+가 이후 "시나리오 비교" fixture가 된다.)
- **fixture-ids.json** 은 커밋/재사용된다(`{ slotId, slotName, createdAt, qaVersion, counts }`).
  슬롯 재생성을 강제하려면 이 파일을 지우거나 `slotId`를 비운다.
- **삭제/cleanup/로그아웃/public 생성 없음** — HARD RULES 그대로.

---

## 2.6. 생성물 다양화 규칙 (개수 · 후보풀 · 시드)

생성물이 "이름만 다르고 옵션은 전부 동일"하면 보드에서 검색/필터/정렬/페이징이
의미 없어진다("똑같은 것만 생성된다" 지적). 그래서 각 객체의 **기간·예산**을
결정적 랜덤으로 다르게 골라 채운다. 목적은 **보기 다양**(sanity 수준)이지 커버리지가 아니다.

- **개수 = 목표 13 / 최소 11** (`setup-fixture-slot.spec.ts`의 `TARGET=13`, `MIN=11`).
  - 근거: 세 리스트 모두 **페이지당 10개 고정**(`DatasetList`/`SlotDetail`/`BOScenarioList`의
    `itemsPerPage=10`). 2페이지 성립 최소 = 11개. 13개면 2페이지에 3개가 남아 페이징·페이지
    이동 테스트가 안정적으로 성립한다(생성 1건 실패해도 12 ≥ 11 > 10).
  - 기존 PRD 슬롯 1142에는 이미 dataset이 있으므로 목표 충족 시 추가 생성 0(기존 유지).
    RC 2종은 다양화 값으로 신규 생성. 실제 PRD 1142 누적 결과(2026-10-22 기준):
    dataset 13 · rcrf 27(= 이전 비다양화 14 + 다양화 13) · rcrp 13 · bo 0(PRD 제외).
    rcrp는 다양화 13건이 생성된 뒤 "PRD rcrp 상한 2" 지시가 도착해, 이미 만든 13건은
    삭제금지 정책상 유지하고 코드에 `PRD_RCRP_CAP=2`를 반영했다(이후 재실행 시 rcrp 추가 생성 0).
- **다양화 차원(1차) = 기간 · 예산만.** 폼 분기가 없는 안전 차원이라 유효 생성이 깨지지 않는다.
  - DataShot 조회기간: `DS_PERIODS`(2025년 월 범위 4종, 모두 `validateDateRange` 만족).
  - BO/RC 캠페인 기간: `DAY_RANGES`(당월 내 일 범위 4종, BO 90일 제한 이내).
  - BO 총예산 `BO_BUDGETS`, RC 예산 `RC_BUDGETS`(양수 숫자, 폼 제약 없음).
  - 업종/매체/지표/KPI는 **1차 고정**(폼 분기 유발 → dom-evidence 보강 probe 후 2차 확장 대상).
    현재 라이브 실증값은 식품 · Google Ads · CPC · 노출(Impression)뿐이라 보수적으로 고정한다.
  - 폼 불변식 유지: BO 상품 ≥2('전체 선택'), RC DIGITAL/TVC 각 단일=비중 100% 자동.
- **후보풀 정의 위치**: `e2e/stg/fixtures.ts`의 `DS_PERIODS`/`DAY_RANGES`/`BO_BUDGETS`/`RC_BUDGETS`.
  각 원소는 단독으로 폼 제약을 통과하며, 빈 풀이면 `pickDeterministic`가 throw한다.
- **시드 고정(재현성)**: 환경변수 `QA_SEED`(미설정 시 기본 `readyset`). 같은 시드 → 같은
  `(차원, 시퀀스index)` → 같은 조합. 다른 분포가 필요하면 `QA_SEED=<임의문자열>`로 실행한다.
  선택은 `(QA_SEED | salt | index)` 해시(FNV-1a) → mulberry32 PRNG로 결정적으로 이뤄진다.
- **create-flow 회귀 안전**: 단건 생성 헬퍼는 `index`를 생략(기본 1) → 항상 "1번 조합"을 써서
  STG 유효 생성 거동이 바뀌지 않는다. 다양화는 setup 루프(시퀀스 1..13)에서만 분산된다.

---

## 3. 환경변수

| env | 역할 | 기본값 |
|---|---|---|
| `QA_VERSION` | 생성 객체명 prefix(`test_${QA_VERSION}_<base>_<MMDD-HHMM>`) · 리포트 버전 태그 | (없으면 `test_vLOCAL_` + 경고) |
| `QA_TARGET` | `stg` \| `prd` | `stg` |
| `QA_BASE_URL` | baseURL 직접 지정(최우선) | — |
| `QA_CDP_PORT` | 디버그 Chrome 포트 | `9222` |
| `QA_SEED` | 생성물 다양화(기간·예산) 결정적 랜덤 시드. 같은 시드 → 같은 조합 재현(2.6) | `readyset` |

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

**회차 선택:** 같은 버전을 여러 번 돌리면 각 회차가 `e2e/results/runs/`에 타임스탬프로 쌓인다.
대시보드의 버전 헤더 우측 **회차 드롭다운**(최신 회차 기본 선택)에서 과거 회차를 고르면 그 회차의
카드·영역별·상세 테이블이 바로 바뀐다. 각 회차 본문은 서버가 미리 구워 숨겨두고 인라인 바닐라 JS로
토글하므로 외부 의존(스크립트/CSS CDN)이 없다. 동일 버전·시점 구분이 필요할 때 사용한다.

---

## 6. prd 라운드 예고

STG DOM과 prd DOM이 동일하다는 보장은 없다. STG가 통과하면 같은 디버그 Chrome을
prd(`https://readyset.adly.co.kr`)에 로그인해 두고:

```bash
QA_VERSION=v1.2.0 QA_TARGET=prd npx playwright test e2e/stg --config=playwright.stg.config.ts
```

로 재확인한다. 셀렉터가 어긋나면 dom-evidence를 prd 기준으로 보강한 뒤 수정한다.

### prd 파생(BudgetOpt 2.0 미배포) — 자동 제외 레시피

prd에는 아직 BudgetOpt 2.0이 배포되지 않았다. `QA_TARGET=prd`면 `fixtures.ts`의 `IS_PRD`
플래그로 BO 의존 TC가 **자동 제외**된다(코드/환경만으로 토글 — prd에 BO가 배포되면 이 플래그만으로
자동 포함). 구체적으로:

- **자동 제외 대상**: `budgetopt.spec.ts` 전체(BUDGET-OPT-001~012), `create-flow.spec.ts`의
  CREATE-FLOW-003, `spinx.spec.ts`의 SPINX-COMMON-001~004·006~010(BO 결과 의존), `setup-fixture-slot.spec.ts`의
  SETUP-003. 각 TC는 본문에서 `test.skip(IS_PRD, …)`로 건너뛰고, 선언형 `excluded` annotation을 달아
  리포트 분모에서 빠진다(사유: "BudgetOpt 2.0 PRD 미배포 — PRD 라운드 제외").
- **유지(prd에서도 수행)**: SPINX-COMMON-005(Reach Caster 결과 의존), CREATE-FLOW-001/002/004/005,
  DataShot·Reach Caster 결과/비교 TC.
- **fixture-ids 파일 분리**: STG는 `fixture-ids.stg.json`(슬롯 148 + completed), prd는
  `fixture-ids.prd.json`(prd 라이브 셋업이 채우는 스텁)을 쓴다. `QA_TARGET`에 따라 자동으로 갈린다
  (서로 덮어쓰지 않음). prd엔 148 슬롯이 없으므로 `fixtureSlotId()`는 prd에서 148로 폴백하지 않는다.

#### prd 전용 추가 규칙 (상용 부하 최소화 · BO 미배포)

- **rcrp 상한 2 (`PRD_RCRP_CAP`)**: prd는 상용이라 대량 생성이 부담이다. `setup-fixture-slot.spec.ts`의
  `targetFor()`가 `IS_PRD && suffix==='rcrp'`일 때 목표치를 **2**로 낮춘다(STG는 그대로 13). 비교
  테스트는 완료 2건이면 충분하므로 Reach Predictor만 2개로 제한한다. 나머지(dataset·rcrf)는 13 목표 유지,
  bo는 PRD 제외. **이 상한은 "이후 재실행 시 추가 생성 0"을 보장하는 재발 방지 장치** — 이미 존재하는
  객체는 삭제하지 않는다(삭제확정 0).
- **SLOT-HOME-002 BO 단언 prd skip**: `slothome.spec.ts`의 FinalSet 설정 레이어 검증은 `BudgetOpt 2.0`
  노출을 단언한다. prd는 BO 미배포라 레이어에 해당 솔루션이 없으므로, `IS_PRD`면 **그 단언만 skip**한다
  (DataShot·Reach Caster·적용 단언은 유지). STG에선 BO 단언이 계속 실행된다(회귀 금지).

prd 라운드 명령(순서대로):

```bash
# 1) prd 고정 픽스처 슬롯 셋업(멱등). SETUP-003(BO)은 IS_PRD로 skip.
QA_TARGET=prd QA_VERSION=v1.2.0 npx playwright test e2e/stg/setup-fixture-slot.spec.ts --config=playwright.stg.config.ts --workers=1

# 2) prd 전수 검증(셋업 제외). BO 계열은 excluded로 분모 밖.
QA_TARGET=prd QA_VERSION=v1.2.0 npx playwright test e2e/stg --config=playwright.stg.config.ts --workers=1 --grep-invert @setup

# 3) prd 리포트 생성(대시보드 누적). 'PRD Sanity QA' 라벨로 표기.
QA_TARGET=prd QA_VERSION=v1.2.0 QA_FEATURE="PRD Sanity QA" node e2e/report.mjs
```
