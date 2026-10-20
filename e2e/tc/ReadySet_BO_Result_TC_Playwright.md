---
document_type: qa_test_cases_markdown
schema_version: "1.0"
product: "ReadySet"
feature: "Budget Optimizer 결과 화면"
conversion_date: "2026-10-15"
source_workbook: "ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx"
source_sheet: "01_TC_All_Detailed"
source_sha256: "7a76d09e4e26c092d92a148601abf93108b558946c5bd8f9c4804d0156c0934b"
main_case_count: 200
related_case_count: 10
execution_status: NOT_RUN
---

# ReadySet · Budget Optimizer 결과 화면 TC

> 목적: 기존 Excel TC를 Playwright 스크립트 작성 및 실행 결과 대조에 전달하기 위한 Markdown 문서임. **스크립트 또는 테스트 실행 결과물이 아님.**
>
> 본문은 **결과 화면 원본 TC 200건**이며, 부록에는 결과 화면에 직접 연결되는 **기존 공통·권한·알림 TC 10건**을 별도로 포함함. 목록·시나리오 생성 전체 TC는 포함하지 않음.

## 0. 읽기 순서 및 원문 보존 기준

먼저 실행 계약·사양 확인 항목을 확인한 뒤 TC를 스크립트로 작성함. 결과는 별도 `ReadySet_BO_Result_QA_Report_Template.md`에 기록함.

- **원문 TC**: 각 TC의 `yaml` 코드블록 안에 기존 Excel의 14개 컬럼을 그대로 보존함. TC ID, No, 우선순위, 사전조건, 절차, 기대결과를 재작성·병합·생략하지 않음. 빈 실행 기록은 `null`임.
- **추가 전달 정보**: 원본 행 위치, Assertion ID, fixture 준비·검증 메모, 미확정 사항 표시는 이번 변환에서 추가한 자동화용 정보임. 제품 요구사항을 새로 확정한 내용이 아님.
- **충돌/모호함 처리**: 기존 TC에 축약·선택적 표현·스펙 차이가 있어도 원문은 보존함. 자동화 메모와 `AUTO-*` 확인 항목을 읽고, 사양을 임의로 보완하거나 통과시키지 않음.

원본 14개 필드: `No`, `TC ID`, `Depth 1`, `Depth 2`, `Test Case`, `Pre-Condition`, `Test steps`, `Expected Result`, `Result`, `Jira_issue num`, `Priority`, `Tester`, `Test Date`, `Comment`임.

### 추출 범위

| 구분 | 원본 위치/선정 기준 | 건수 |
| --- | --- | --- |
| 결과 화면 본문 | `TC ID`가 `BO-RESULT-`로 시작함. `BO-RESULT-001`~`BO-RESULT-200`임 | 200 |
| 원본 Excel 행 | 본문은 `01_TC_All_Detailed!A322:N495` 및 `A559:N584`에서 추출함 | 174 + 26 |
| 직접 연관 부록 | `BO-COMMON-003`, `BO-PERM-019`~`022`, `BO-GNB-003`~`007`임 | 10 |
| 원본 기타 TC | 목록/생성 등 나머지 373건은 이번 변환 대상이 아님 | 373 |

원본 No는 결과 본문에서 321~494 및 558~583을 유지함. 본문 No와 TC ID 뒤 숫자를 동일한 번호로 간주하지 않음. 원본 Excel 전체 TC는 583건임.

### 문서 목차

[실행 계약](#execution-contract) · [규칙 참조](#source-rules) · [확인 필요 사항](#review-items) · [TC 목록](#case-index) · [본문 200건](#main-cases) · [연관 10건](#related-cases) · [원본 지원표](#supporting-tables) · [결과 판정](#result-contract)

<a id="execution-contract"></a>
## 1. 자동화 실행 계약 — 추가 전달 정보

### 1.1 스크립트 작성 원칙

원본 TC ID를 테스트 이름과 결과 로그에 포함함. 하나의 TC에 여러 분기/KPI/모드가 필요하면 동일 ID 아래 `variant_id`로 분리함. 여러 원본 TC가 비슷하더라도 원본 ID별 결과 추적을 유지함.

각 `Expected Result`의 비어 있지 않은 행을 순서대로 `TC ID::A01`, `::A02` 형태의 Assertion으로 대응함. “전체가 일치함”처럼 여러 UI 대상을 포함하는 한 행은 필요 시 `A01.1`, `A01.2`로 세분화함. 화면 열기·버튼 클릭 성공만으로 데이터/문구/권한 Assertion을 대신하지 않음.

원본 절차가 공통 템플릿이라 실제 검증 동작이 빠진 경우 실행용 하위 절차를 명시함. 단, 원본 기대결과를 바꾸거나 범위 밖 기능을 자동 생성하지 않음. 해당 동작이 기획 미확정이면 확인 필요 상태로 남김.

### 1.2 실제 구현에서 바인딩할 항목

아래 값은 제공되지 않았으므로 모두 미설정임. 임의 테스트 URL, 계정, API 경로, DOM selector, `data-testid`를 실제 존재하는 값처럼 생성하지 않음.

```json
{
  "BASE_URL": null,
  "APP_REVISION": null,
  "BROWSER_PROJECTS": null,
  "TIMEZONE_LOCALE": null,
  "AUTH_BINDINGS": null,
  "FIXTURE_BINDINGS": null,
  "UI_BINDINGS": null,
  "DATA_CONTRACT": null,
  "CURVE_CONTRACT": null,
  "AXIS_BREAK_CONTRACT": null,
  "TRANSFER_CONTRACT": null,
  "DOWNLOAD_CONTRACT": null,
  "SPINX_BINDINGS": null,
  "ACCESSIBILITY_CONTRACT": null,
  "VISUAL_BASELINE": null,
  "FAILURE_FIXTURES": null,
  "ARTIFACT_DIRECTORY": null
}
```

`AUTH_BINDINGS`에는 역할별 인증 준비 방법과 안전하게 관리되는 인증 상태 참조만 기록함. 비밀번호·토큰·쿠키 원문을 Markdown/결과 로그에 저장하지 않음. `FIXTURE_BINDINGS`는 아래 원본 테스트 데이터 별칭을 실제 QA 시나리오 ID와 연결하는 항목임.

`UI_BINDINGS`는 실행 버전의 실제 요소 구조와 연결함. 테스트용 selector가 필요하면 실제 추가/확인된 selector만 사용함. `DATA_CONTRACT`는 결과 응답의 계층 구조·단위·모드별 원천 필드와 매핑함.

### 1.3 fixture 및 검증 계층

원본 지원표에 없는 추가 fixture 이름은 **테스트 준비 요구사항의 별칭**일 뿐 실제 저장된 데이터가 아님. `CHART_FIXTURES`=상위 5개/6개 이상 및 매체·상품 집계, `WEEKLY_FIXTURE`=원천 104주 및 최근 52주, `WATERFALL_FIXTURES`=증가/감소·절단/미절단, `ZERO_ALLOCATION_FIXTURE`=0원 매체·상품, `EASY_CREATE_FIXTURE`=지원/미지원·0원·노출 필수 패턴, `NOTIFICATION_FIXTURE`=정상/삭제/이동/권한 회수 알림 상태를 의미함.

UI mock 검증과 실제 API 연동 검증을 분리 기록함. mocked 403 응답으로 오류 화면이 표시됐다는 사실만으로 서버 권한 우회 차단까지 검증됐다고 판정하지 않음. 모델 출력의 화면 일치 검증은 모델의 통계적 정확성 검증과 별개임.

실행마다 시나리오 ID·KPI·결과 모드·집계 뷰·데이터 snapshot을 기록함. 실제 데이터가 없으면 가상의 기대 숫자를 만들지 않음. 수치 검증은 고정 fixture 또는 독립된 원천 응답에서 계산한 기대값을 사용함.

### 1.4 대기·시각 검증·부작용

페이지 전환, 데이터 준비, 토글 전환, tooltip 노출 완료를 해당 상태로 확인한 뒤 Assertion을 수행함. 임의 대기시간 경과만으로 준비 완료를 판정하지 않음. 시간/브라우저/폰트/뷰포트에 영향을 받는 비교는 실행 환경을 고정해 기록함.

차트는 텍스트/숫자/선택 상태 검증과 시각 검증을 분리함. SVG/Canvas 구현 방식, 막대 path 수, 픽셀 좌표를 문서만으로 단정하지 않음. 시각 기준이나 허용 오차가 없으면 스크린샷을 증적으로 남기고 수동 검토로 분류함.

삭제·생성·LLM 자동 질문 등 부작용이 있는 TC는 승인된 QA 계정과 폐기 가능한 데이터에서만 실행함. 공유 fixture를 병렬로 변경하지 않으며 생성/삭제 대상은 실행별로 식별함. 운영 데이터 변경을 기본 전제로 두지 않음.

<a id="source-rules"></a>
## 2. 결과 판정에 필요한 스펙 참조 — 원문 근거 정리

이 절은 TC를 교체하지 않는 보조 참조임. 스펙과 기존 TC가 충돌하면 아래 확인 항목에 따라 판단을 보류함.

참조 파일은 `BudgetOptimizer_Result_Spec.md`이며 문서 정보에는 v1.3/2026-09-29로 표시되지만 변경 이력에는 v1.4/2026-10-02 항목과 관련 본문이 포함되어 있음. 이를 임의로 하나의 버전으로 정정하지 않음.

| 참조 키 | 문서 절 | 확인 기준 |
| --- | --- | --- |
| R-ENTRY | §1.3 | 결과 URL은 `/budgetoptimizer/scenario/:id/result`이며 Completed 상태에서만 결과가 활성화됨 |
| R-MODE | §3·§11 | 잠금 1개 이상이면 모드 띠배너가 노출됨. 기본 `allocations`와 `pureAllocations`를 구분함 |
| R-KPI | §4 | impression=노출/Impression, click=클릭/Click, view=조회/View, reach=도달/Reach임. 수량 단위는 모두 회임 |
| R-SCORE | §5.2 | Guaranteed KPI는 배분별 kpiValue 합계임. Total Budget은 시나리오 총예산임 |
| R-PRICE | §5.2 | CPM=총예산÷(총노출÷1000), CPC=총예산÷총클릭, CPV=총예산÷총조회, CPR=총예산÷총도달임. 정수 반올림하며 분모=0이면 0임 |
| R-LOCK | §5.2 | 잠금 예산은 isFixed=true 배분 예산 합계임. 비중은 잠금예산÷총예산×100, 소수점 2자리임. 잠금예산=0이면 0만 표시하고 단위·비중은 표시하지 않음 |
| R-SHARE | §6.3 | Budget Share는 상위 5개를 개별 표시하고 나머지를 Others로 합산함 |
| R-CURVE | §6.4 | 기여 상위 5개 중 단일 항목 선택임. 기본 기여 1위이며 매체/상품 토글 시 초기화됨. Current spend 전 실선/후 점선, 마커만 그린임 |
| R-WEEKLY | §6.5·§11 | 업종 모델의 과거 학습 주간 시계열임. 최근 1년=52주, 최근 2년=104주이며 미래 예측으로 설명하지 않음 |
| R-AXIS | §6.6 | 절단 시에만 “· 변화 구간을 강조하기 위해 Y축 하단을 생략했습니다.”가 노출됨. 임계값은 구현 코드 확인 대상임 |
| R-TOOLTIP | §6.7 | Info=해석 방법, 데이터 hover=지점 값임. 데이터 값은 콤마 전체 숫자이며 축 tick만 축약을 허용함 |
| R-SPINX | §7.2·§7.4 | 이어서 질문하기=패널+`@{차트명} ` 프리필/자동 전송 없음임. 최적화 원리 클릭=패널+원리 질문 자동 전송임 |
| R-TOTALREACH | §8.1·§11 | Estimated Total Reach는 `totalReach`/`pureTotalReach` 모델 제공값임. 프론트에서 단순 합산하지 않으며 제공되지 않으면 하이픈임 |
| R-DELTA | §8.2 | 순수 모드에서 잠금 반영 대비 Budget/Share/Guaranteed KPI delta를 표시함. 증가 초록·감소 빨강이며 잠금 아이콘은 숨김임 |
| R-ZERO | §8.3 | 결과 테이블 budget=0 매체·상품은 dimmed 및 Share `Info 아이콘 + 0.00%`임. 툴팁은 fixed로 표시함 |
| R-EASY | §9.2~§9.4 | 타겟 기본 전체/최소 1개, 노출 전달 기본 all임. none/required/all을 구분함. 미지원 우선, 그 외 budget≤0은 0원 제외임. 전달 대상 최소 1개임 |

### R-ZERO 툴팁 원문

제목: **예산이 배분되지 않았습니다**

사유: **일정 예산 이하에서는 성과가 거의 발생하지 않는 매체·상품입니다. 최소 배분을 강제하면 예산이 의미 없이 소모되므로, 더 효율 높은 곳으로 예산을 모은 결과입니다.**

잠금 안내: **반드시 배분이 필요한 매체·상품이라면, 시나리오 생성 단계에서 잠금 기능으로 예산을 고정해 보세요.**

### Easy Create 구분 기준

지원되는 양수 예산 상품만 전달 대상임. 미지원 행은 “미지원 제외” 및 예산·노출 하이픈임. 지원되지만 예산이 0원인 제외 행은 “예산 0원 제외” 및 실제 예산 `0원` 표시임. 순서는 미지원 → 예산 0원 → 전달 항목임. 제외 0건 카운트는 생략함.

미지원 mock 판별은 Targetpick 매체 한정임. 실제 매핑 규칙은 연동 계약 확인 대상임. `_CPT` / 예약형 / 보장형 상품명 패턴은 required 모드에서 노출 전달 대상 판별에 사용됨. `디스플레이_방문` 패턴을 미지원 제외로 추가하지 않음.

전달 대상이 없으면 생성 버튼 비활성 및 “전달할 항목이 없습니다”가 노출됨. 모달 확정은 Reach Caster 생성 Step2로 이동하고 프리필하는 동작이며 최종 시나리오 생성 실행과 동일하지 않음.

<a id="review-items"></a>
## 3. 자동 판정 전 확인 필요 사항

`AUTO-*`는 변환 중 식별한 확인 항목임. **결함 확정 목록이 아님.** 관련 TC를 삭제·수정하지 않으며, 확정 가능한 Assertion은 실행하고 미확정 Assertion의 이유를 별도 기록함. 구현 확인은 selector/데이터 바인딩에 사용하고, 충돌하는 제품 정책을 구현만 보고 임의 승인하지 않음.


<a id="auto-01"></a>
### AUTO-01 · 무권한 접근의 최종 랜딩 기준 상충

**대상 TC**: `BO-RESULT-006`, `BO-GNB-005`


**확인 내용**: BO-RESULT-006은 403 페이지를 기대하나, GNB 정책은 무권한 Slot 접근 시 SlotBoard 이동과 Error 토스트를 정의함. GNB 정책 §5는 직접 URL에도 동일 검증을 명시함.

**근거**: `Platform_Role_Permission_Spec.md §5.4 / GNB_Notification_Navigation_Spec.md §3.3·§5.3`

**처리 지침**: 데이터 비노출 검증과 최종 랜딩/문구 검증을 분리함. 진입 경로별 승인 기준을 확보하기 전 최종 랜딩 Assertion을 확정하지 않음.


<a id="auto-02"></a>
### AUTO-02 · 0값 일반 규칙과 화면별 예외

**대상 TC**: `BO-RESULT-029`, `BO-RESULT-031`, `BO-RESULT-033`, `BO-RESULT-035`, `BO-RESULT-045`, `BO-RESULT-111`, `BO-RESULT-126`, `BO-RESULT-127`, `BO-RESULT-128`, `BO-RESULT-129`, `BO-RESULT-130`, `BO-RESULT-131`, `BO-RESULT-132`, `BO-RESULT-133`, `BO-RESULT-134`, `BO-RESULT-149`, `BO-RESULT-163`, `BO-RESULT-165`


**확인 내용**: BO-RESULT-165의 0값 하이픈 문구를 화면 전체에 일괄 적용할 수 없음. 스코어카드 분모=0은 0, Locked Budget=0은 단위·비중 없는 0, 결과 테이블의 budget=0 Share는 0.00%, Easy Create의 0원 제외 예산 셀은 0원으로 별도 정의됨. 합계 Share는 §8.1의 100%와 TC의 100.00% 표기 차이가 존재함.

**근거**: `BudgetOptimizer_Result_Spec.md §5.2·§8.1·§8.3·§9.2·§10`

**처리 지침**: 셀/카드별 검사 범위를 먼저 지정함. 일반 규칙으로 예외 값을 덮어쓰지 않음. 합계 행 소수점 자리 표기는 승인 기준을 확인함.


<a id="auto-03"></a>
### AUTO-03 · 결과 테이블 budget=0과 간편 생성 budget≤0의 적용 범위

**대상 TC**: `BO-RESULT-181`


**확인 내용**: BO-RESULT-181은 결과 행을 budget≤0으로 판별한다고 작성되어 있으나 결과 스펙 §8.3은 budget=0이며, ≤0은 Easy Create §9.4 판별 규칙임.

**근거**: `BudgetOptimizer_Result_Spec.md §8.3·§9.4`

**처리 지침**: 음수 예산의 결과 테이블 기대 동작을 임의로 확정하지 않음. 0원 정상 경계와 음수 비정상 데이터를 별도 하위 케이스로 기록하고, 음수 분기는 기획 확인 전 REVIEW/BLOCKED 처리함.


<a id="auto-04"></a>
### AUTO-04 · 모드 변경 시 Weekly Contribution 원천 데이터

**대상 TC**: `BO-RESULT-025`, `BO-RESULT-027`, `BO-RESULT-175`, `BO-RESULT-176`, `BO-RESULT-177`


**확인 내용**: 모드 전환 TC에는 차트 전체가 순수 최적화 데이터로 전환된다는 표현이 있으나, Weekly Contribution은 allocations가 아닌 업종 모델 학습 주간 시계열의 별도 소스임.

**근거**: `BudgetOptimizer_Result_Spec.md §3.3·§6.5·§11`

**처리 지침**: Budget Share/Response Curve/Incremental의 allocations 전환과 Weekly Contribution의 별도 소스 유지를 분리함. 모드 전환만으로 과거 시계열 수치가 반드시 바뀐다고 가정하지 않음.


<a id="auto-05"></a>
### AUTO-05 · Response Curve 곡선·maxSpend·마커 Y 원천 미확정

**대상 TC**: `BO-RESULT-069`, `BO-RESULT-070`, `BO-RESULT-071`, `BO-RESULT-072`, `BO-RESULT-073`, `BO-RESULT-175`


**확인 내용**: 스펙은 포화함수 곡선을 정의하면서 백엔드 포인트 배열 전환, 상품 maxSpend 공급원, currentSpend 마커 Y값을 구현 논의 중인 항목으로 명시함.

**근거**: `BudgetOptimizer_Result_Spec.md §6.4 / 원본 07_Spec_Gaps No.7`

**처리 지침**: 현재 적용 버전의 곡선 데이터 계약과 마커 기준을 바인딩함. 곡선값=예측 KPI값을 무조건 강제하거나 프론트 임시 maxSpend를 영구 요구사항으로 고정하지 않음.


<a id="auto-06"></a>
### AUTO-06 · Y축 절단 임계값은 구현 기준

**대상 TC**: `BO-RESULT-093`, `BO-RESULT-094`, `BO-RESULT-095`


**확인 내용**: 절단 임계 비율과 여백 비율은 문서에 수치가 없고 구현 코드가 기준임.

**근거**: `BudgetOptimizer_Result_Spec.md §6.6 Y축 절단 규칙`

**처리 지침**: 구현/승인 설정의 임계값을 확인한 fixture로 절단·미절단·감소 막대를 각각 실행함. 예시 수치를 보편 임계값으로 사용하지 않음.


<a id="auto-07"></a>
### AUTO-07 · 약 300자 및 정성 표현은 고정 임계값 아님

**대상 TC**: `BO-RESULT-047`, `BO-RESULT-048`, `BO-RESULT-059`, `BO-RESULT-070`, `BO-RESULT-088`, `BO-RESULT-099`, `BO-RESULT-171`


**확인 내용**: 약 300자 내외, 떠오름 효과, 대비 유지, 왜곡 없이 같은 표현의 정량 합격 범위가 제공되지 않음.

**근거**: `BudgetOptimizer_Result_Spec.md §5.1·§6·§7.1`

**처리 지침**: 300자를 maxLength=300 또는 임의 ±N자로 단정하지 않음. 승인 디자인/허용 범위를 확보하거나 해당 Assertion을 수동 검토로 남김.


<a id="auto-08"></a>
### AUTO-08 · 반올림 오차·Others·0원 차트 정책 미확정

**대상 TC**: `BO-RESULT-053`, `BO-RESULT-058`, `BO-RESULT-062`, `BO-RESULT-063`, `BO-RESULT-084`, `BO-RESULT-087`, `BO-RESULT-184`


**확인 내용**: 상위 5개 원칙은 명시되어 있으나 동률 정렬, Incremental 초과분 집계, Budget Share 0원 항목의 표시/제외, 합계 오차 허용치는 모두 완전하게 확정된 상태가 아님. BO-RESULT-184의 과도하게 보이지 않음은 수치 판정 기준이 아님.

**근거**: `BudgetOptimizer_Result_Spec.md §6.2~§6.7·§10`

**처리 지침**: 동률 없는 검증 fixture로 명시된 기본 규칙을 먼저 검사함. 반올림 전 합계와 표시 후 합계를 구분하고 허용오차를 임의로 만들지 않음. 미확정 분기는 확인 후 실행함.


<a id="auto-09"></a>
### AUTO-09 · 관리 액션·Easy Create·Export Role별 UX

**대상 TC**: `BO-RESULT-015`, `BO-RESULT-016`, `BO-RESULT-017`, `BO-RESULT-018`, `BO-RESULT-161`, `BO-RESULT-192`, `BO-PERM-019`, `BO-PERM-020`, `BO-PERM-021`, `BO-PERM-022`


**확인 내용**: 플랫폼은 Client/Agency 생성 불가를 명시하지만 BO 결과의 관리 메뉴 상세, Easy Create CTA의 숨김/비활성, Export 권한 세부 조건은 BO 정의서에 충분히 명시되어 있지 않음.

**근거**: `Platform_Role_Permission_Spec.md §2.1 / 원본 07_Spec_Gaps No.1·2`

**처리 지침**: 기능 권한과 표현 방식을 구분함. 확인되지 않은 표시 방식을 코드로 고정하지 않음. Export를 단순 조회 권한과 자동 동일시하지 않음.


<a id="auto-10"></a>
### AUTO-10 · Export 산출물 상세 계약 부족

**대상 TC**: `BO-RESULT-010`, `BO-RESULT-011`, `BO-RESULT-012`, `BO-RESULT-013`, `BO-RESULT-185`, `BO-RESULT-186`, `BO-RESULT-187`, `BO-RESULT-188`, `BO-RESULT-189`, `BO-RESULT-190`, `BO-RESULT-191`, `BO-RESULT-192`


**확인 내용**: Export 제공 자체는 명시되어 있으나 파일명, 파일 내부 시트/열, 포함 모드, 범위, 실패 메시지 원문은 정의가 부족함.

**근거**: `BudgetOptimizer_Result_Spec.md §2.2·§12 / 원본 07_Spec_Gaps No.6`

**처리 지침**: 다운로드 이벤트와 파일 저장/열기 성공을 구분함. 파일명과 문서 내부 구조는 승인 계약을 바인딩한 뒤 검사함. 클립보드·토스트 원문도 실제 승인값으로 확인함.


<a id="auto-11"></a>
### AUTO-11 · 간편 생성 전송과 취소/비활성 케이스의 공통 기대결과

**대상 TC**: `BO-RESULT-135`, `BO-RESULT-136`, `BO-RESULT-137`, `BO-RESULT-138`, `BO-RESULT-139`, `BO-RESULT-140`, `BO-RESULT-141`, `BO-RESULT-142`, `BO-RESULT-143`, `BO-RESULT-144`, `BO-RESULT-145`, `BO-RESULT-146`, `BO-RESULT-147`, `BO-RESULT-148`, `BO-RESULT-149`, `BO-RESULT-150`, `BO-RESULT-151`, `BO-RESULT-152`, `BO-RESULT-153`, `BO-RESULT-154`, `BO-RESULT-155`, `BO-RESULT-156`, `BO-RESULT-157`, `BO-RESULT-158`, `BO-RESULT-159`, `BO-RESULT-160`, `BO-RESULT-161`


**확인 내용**: 이 그룹 모든 TC에 미지원·0원 항목 payload 제외가 공통 기대결과로 포함됨. 그러나 CTA 표시, 취소, 타겟 0개, 전달 대상 0개, 권한 차단은 확정 이동을 수행하지 않는 분기임. Step2의 route/state key 상세도 미제공임.

**근거**: `BudgetOptimizer_Result_Spec.md §9 / 원본 07_Spec_Gaps No.8`

**처리 지침**: 허용된 확정 경로에서는 전달 데이터 제외를 검사함. 취소/비활성/권한 차단에서는 이동·전달 없음으로 검사하며 결과를 얻기 위해 비활성 버튼을 강제로 실행하지 않음. 실제 전달 채널이 state인지 요청인지 구현에서 확인함.


<a id="auto-12"></a>
### AUTO-12 · Targetpick 제외는 mock 기준

**대상 TC**: `BO-RESULT-148`, `BO-RESULT-149`, `BO-RESULT-150`, `BO-RESULT-152`, `BO-RESULT-153`, `BO-RESULT-154`, `BO-RESULT-158`, `BO-RESULT-159`, `BO-RESULT-160`


**확인 내용**: Targetpick 미지원 판별은 스펙에 현재 mock 기준으로 한정됨. 실제 업종별 매핑은 연동 시 확정 대상이며 디스플레이_방문 상품 패턴 제외는 제거된 정책임.

**근거**: `BudgetOptimizer_Result_Spec.md §9.4`

**처리 지침**: mock 회귀와 실제 매핑 연동 검증을 구분함. 실제 서비스에서 Targetpick을 영구 미지원으로 하드코딩하지 않음.


<a id="auto-13"></a>
### AUTO-13 · 원문 절차에 없는 후속 Assertion 누락 위험

**대상 TC**: `BO-RESULT-019`, `BO-RESULT-020`, `BO-RESULT-021`, `BO-RESULT-022`, `BO-RESULT-023`, `BO-RESULT-024`, `BO-RESULT-025`, `BO-RESULT-026`, `BO-RESULT-027`, `BO-RESULT-049`, `BO-RESULT-050`, `BO-RESULT-051`, `BO-RESULT-052`, `BO-RESULT-053`, `BO-RESULT-054`, `BO-RESULT-055`, `BO-RESULT-056`, `BO-RESULT-097`, `BO-RESULT-098`, `BO-RESULT-099`, `BO-RESULT-100`, `BO-RESULT-101`, `BO-RESULT-102`, `BO-RESULT-103`, `BO-RESULT-104`, `BO-RESULT-105`, `BO-RESULT-106`, `BO-RESULT-127`, `BO-RESULT-128`, `BO-RESULT-129`, `BO-RESULT-130`, `BO-RESULT-131`, `BO-RESULT-132`, `BO-RESULT-133`, `BO-RESULT-134`, `BO-RESULT-162`, `BO-RESULT-163`, `BO-RESULT-164`, `BO-RESULT-165`, `BO-RESULT-166`, `BO-RESULT-167`, `BO-RESULT-168`, `BO-RESULT-169`, `BO-RESULT-170`, `BO-RESULT-171`, `BO-RESULT-172`, `BO-RESULT-173`, `BO-RESULT-174`, `BO-RESULT-185`, `BO-RESULT-186`, `BO-RESULT-187`, `BO-RESULT-188`, `BO-RESULT-189`, `BO-RESULT-190`, `BO-RESULT-191`, `BO-RESULT-192`


**확인 내용**: 일부 원문 TC는 공통 절차 또는 조건부 기대결과를 공유함. 표시만 확인하면 모드 전환, 요청 횟수, 오류 분기 등 두 번째 기대결과를 검증하지 못할 수 있음.

**근거**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx / 01_TC_All_Detailed 해당 TC 원문`

**처리 지침**: Expected Result의 각 비어 있지 않은 행에 Assertion ID를 부여함. 누락된 실행 분기는 동일 TC ID의 하위 케이스로 명시하며, 미검증 Assertion을 통과로 간주하지 않음. 조건 불성립은 이유를 기록함.


<a id="auto-14"></a>
### AUTO-14 · 오류·빈 상태·접근성의 구현 계약 미제공

**대상 TC**: `BO-RESULT-167`, `BO-RESULT-168`, `BO-RESULT-169`, `BO-RESULT-170`, `BO-RESULT-171`, `BO-RESULT-172`, `BO-RESULT-173`, `BO-RESULT-174`, `BO-RESULT-193`, `BO-RESULT-194`, `BO-RESULT-195`, `BO-RESULT-196`, `BO-RESULT-197`, `BO-RESULT-198`, `BO-RESULT-199`, `BO-RESULT-200`


**확인 내용**: 기존 TC의 오류/재시도 UI, placeholder, aria 상세는 BO 결과 정의서만으로 모두 확정할 수 없음. 원본도 공통 접근성 기준 및 구현 확인이 필요하다고 기록함.

**근거**: `원본 07_Spec_Gaps No.10 / BudgetOptimizer_Result_Spec.md §2·§6·§7·§9`

**처리 지침**: 해당 TC를 삭제하지 않되 정확한 문구·속성·뷰포트·색상 기준을 승인 사양으로 바인딩함. 예상한 오류 응답과 예상하지 않은 화면 런타임 오류를 구분함.


<a id="auto-15"></a>
### AUTO-15 · 시나리오명 프리셋 길이와 Step1 제한의 교차

**대상 TC**: `BO-RESULT-138`, `BO-RESULT-160`


**확인 내용**: 간편 생성 이름은 (BO-{ID}) 접두사를 포함하는 변경 불가 프리셋임. 원본 시나리오명 30자와 합치면 일반 생성 필드 최대 30자를 넘을 수 있으나 자동 절단/예외 정책은 명시되지 않음.

**근거**: `BudgetOptimizer_Result_Spec.md §9.2 / BudgetOptimizer_Scenario_Creation_Spec.md §3.1 / Scenario_Creation_Spec.md §3.1`

**처리 지침**: 접두사를 삭제하거나 30자로 임의 절단하지 않음. 긴 원본명의 승계 검증은 허용 길이/저장 규칙 확인 후 실행함.


<a id="auto-16"></a>
### AUTO-16 · 합산 단위·단가·총 도달 공급원 구분

**대상 TC**: `BO-RESULT-035`, `BO-RESULT-037`, `BO-RESULT-038`, `BO-RESULT-039`, `BO-RESULT-040`, `BO-RESULT-041`, `BO-RESULT-042`, `BO-RESULT-043`, `BO-RESULT-044`, `BO-RESULT-045`, `BO-RESULT-046`, `BO-RESULT-109`, `BO-RESULT-110`, `BO-RESULT-111`, `BO-RESULT-112`, `BO-RESULT-113`, `BO-RESULT-114`, `BO-RESULT-115`, `BO-RESULT-116`, `BO-RESULT-117`, `BO-RESULT-118`, `BO-RESULT-119`, `BO-RESULT-178`, `BO-RESULT-179`, `BO-RESULT-180`, `BO-RESULT-182`, `BO-RESULT-183`, `BO-RESULT-184`


**확인 내용**: 배분 계층의 부모/자식 동시 합산은 중복 집계 위험임. 스코어카드 Guaranteed Reach는 kpiValue 합계이고 테이블 Estimated Total Reach는 중복 제거된 모델 총량임. Locked Budget 집계와 테이블 전체 평균의 상세 API 스키마는 미제공임.

**근거**: `BudgetOptimizer_Result_Spec.md §4·§5.2·§8.1·§11`

**처리 지침**: 실제 데이터 계약에서 집계 단위를 확인하고 부모/자식 합계를 이중 계산하지 않음. Guaranteed Reach와 Estimated Total Reach를 임의로 같게 만들지 않음. null 총 도달과 숫자 0도 구분함.


<a id="case-index"></a>
## 4. 본문 TC 범위 요약


| 세부 영역 | TC ID 범위 | 건수 | critical | major | minor |
| --- | --- | --- | --- | --- | --- |
| 결과 화면/진입 | BO-RESULT-001 ~ BO-RESULT-006 | 6 | 6 | 0 | 0 |
| 결과 화면/헤더 | BO-RESULT-007 ~ BO-RESULT-018 | 12 | 0 | 12 | 0 |
| 결과 화면/잠금·순수 모드 | BO-RESULT-019 ~ BO-RESULT-027 | 9 | 2 | 7 | 0 |
| 결과 화면/KPI 파생 표기 | BO-RESULT-028 ~ BO-RESULT-037 | 10 | 9 | 1 | 0 |
| 결과 화면/스코어카드 | BO-RESULT-038 ~ BO-RESULT-048 | 11 | 7 | 4 | 0 |
| 결과 화면/Optimization Analytics 공통 | BO-RESULT-049 ~ BO-RESULT-056 | 8 | 0 | 8 | 0 |
| 결과 화면/차트 Budget Share | BO-RESULT-057 ~ BO-RESULT-064 | 8 | 0 | 8 | 0 |
| 결과 화면/차트 Response Curve | BO-RESULT-065 ~ BO-RESULT-078 | 14 | 0 | 14 | 0 |
| 결과 화면/차트 Weekly Contribution | BO-RESULT-079 ~ BO-RESULT-086 | 8 | 0 | 8 | 0 |
| 결과 화면/차트 Incremental | BO-RESULT-087 ~ BO-RESULT-096 | 10 | 0 | 10 | 0 |
| 결과 화면/SpinX | BO-RESULT-097 ~ BO-RESULT-106 | 10 | 0 | 10 | 0 |
| 결과 화면/Budget Allocation Detail | BO-RESULT-107 ~ BO-RESULT-126 | 20 | 4 | 16 | 0 |
| 결과 화면/0원 배분 | BO-RESULT-127 ~ BO-RESULT-134 | 8 | 0 | 8 | 0 |
| 결과 화면/Reach Caster 간편 생성 | BO-RESULT-135 ~ BO-RESULT-161 | 27 | 3 | 24 | 0 |
| 결과 화면/표시·예외·접근성 | BO-RESULT-162 ~ BO-RESULT-174 | 13 | 0 | 1 | 12 |
| 결과 화면/데이터 정합성 | BO-RESULT-175 ~ BO-RESULT-184 | 10 | 10 | 0 | 0 |
| 결과 화면/Export | BO-RESULT-185 ~ BO-RESULT-192 | 8 | 0 | 8 | 0 |
| 결과 화면/접근성 | BO-RESULT-193 ~ BO-RESULT-200 | 8 | 0 | 0 | 8 |
| 결과 본문 합계 | BO-RESULT-001 ~ BO-RESULT-200 | 200 | 41 | 139 | 20 |


<a id="main-cases"></a>
## 5. 결과 화면 TC 원문 — 200건


아래 `yaml` 블록은 원본 TC 데이터임. 블록 밖의 자동화 메모만 추가 정보임. `Result: null`은 미실행을 뜻하며 N/A 또는 PASS가 아님.


### 영역: 결과 화면/진입


<!-- TC-BEGIN:BO-RESULT-001 -->
<a id="bo-result-001"></a>
#### BO-RESULT-001 — Completed 결과 진입 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A322:N322` · 분류 `RESULT`


```yaml
"No": 321
"TC ID": "BO-RESULT-001"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/진입"
"Test Case": "Completed 결과 진입 검증"
"Pre-Condition": "Completed BO 시나리오"
"Test steps": |-
  1. 대상 URL `/budgetoptimizer/scenario/{id}/result`에 접근함
  2. 화면 또는 리다이렉트 결과를 확인함
"Expected Result": |-
  - 결과 화면이 정상 렌더링됨
  - 권한 없는 데이터는 응답 내용/화면에 노출되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-001::A01`, `BO-RESULT-001::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + AUTH_BINDINGS`임. 상태별 URL·최종 화면·민감 데이터 비노출을 분리 관찰함. 서버 권한 차단은 실제 인증/권한이 적용된 테스트 환경에서 별도로 검증함.

- **개별 주의**: Completed라는 문자열만 검사하지 않음. 올바른 시나리오의 헤더·스코어카드·차트 4종·배분 테이블이 준비되었는지 각각 확인함. 이 관찰 항목은 자동화 구체화이며 원문 TC를 교체하지 않음.

- **대조 문서**: `§1.3 / Platform_Role_Permission_Spec.md / GNB_Notification_Navigation_Spec.md`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-001 -->


<!-- TC-BEGIN:BO-RESULT-002 -->
<a id="bo-result-002"></a>
#### BO-RESULT-002 — Processing 직접 URL 접근 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A323:N323` · 분류 `RESULT`


```yaml
"No": 322
"TC ID": "BO-RESULT-002"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/진입"
"Test Case": "Processing 직접 URL 접근 검증"
"Pre-Condition": "Processing 상태 시나리오 ID"
"Test steps": |-
  1. 대상 URL `/budgetoptimizer/scenario/{id}/result`에 접근함
  2. 화면 또는 리다이렉트 결과를 확인함
"Expected Result": |-
  - 결과 화면 진입이 차단되고 목록 또는 에러 안내로 이동함
  - 권한 없는 데이터는 응답 내용/화면에 노출되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-002::A01`, `BO-RESULT-002::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + AUTH_BINDINGS`임. 상태별 URL·최종 화면·민감 데이터 비노출을 분리 관찰함. 서버 권한 차단은 실제 인증/권한이 적용된 테스트 환경에서 별도로 검증함.

- **대조 문서**: `§1.3 / Platform_Role_Permission_Spec.md / GNB_Notification_Navigation_Spec.md`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-002 -->


<!-- TC-BEGIN:BO-RESULT-003 -->
<a id="bo-result-003"></a>
#### BO-RESULT-003 — Pending 직접 URL 접근 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A324:N324` · 분류 `RESULT`


```yaml
"No": 323
"TC ID": "BO-RESULT-003"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/진입"
"Test Case": "Pending 직접 URL 접근 검증"
"Pre-Condition": "Pending 상태 시나리오 ID"
"Test steps": |-
  1. 대상 URL `/budgetoptimizer/scenario/{id}/result`에 접근함
  2. 화면 또는 리다이렉트 결과를 확인함
"Expected Result": |-
  - 결과 화면 진입이 차단됨
  - 권한 없는 데이터는 응답 내용/화면에 노출되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-003::A01`, `BO-RESULT-003::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + AUTH_BINDINGS`임. 상태별 URL·최종 화면·민감 데이터 비노출을 분리 관찰함. 서버 권한 차단은 실제 인증/권한이 적용된 테스트 환경에서 별도로 검증함.

- **대조 문서**: `§1.3 / Platform_Role_Permission_Spec.md / GNB_Notification_Navigation_Spec.md`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-003 -->


<!-- TC-BEGIN:BO-RESULT-004 -->
<a id="bo-result-004"></a>
#### BO-RESULT-004 — Error 직접 URL 접근 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A325:N325` · 분류 `RESULT`


```yaml
"No": 324
"TC ID": "BO-RESULT-004"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/진입"
"Test Case": "Error 직접 URL 접근 검증"
"Pre-Condition": "Error 상태 시나리오 ID"
"Test steps": |-
  1. 대상 URL `/budgetoptimizer/scenario/{id}/result`에 접근함
  2. 화면 또는 리다이렉트 결과를 확인함
"Expected Result": |-
  - 결과 화면 진입이 차단됨
  - 권한 없는 데이터는 응답 내용/화면에 노출되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-004::A01`, `BO-RESULT-004::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + AUTH_BINDINGS`임. 상태별 URL·최종 화면·민감 데이터 비노출을 분리 관찰함. 서버 권한 차단은 실제 인증/권한이 적용된 테스트 환경에서 별도로 검증함.

- **대조 문서**: `§1.3 / Platform_Role_Permission_Spec.md / GNB_Notification_Navigation_Spec.md`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-004 -->


<!-- TC-BEGIN:BO-RESULT-005 -->
<a id="bo-result-005"></a>
#### BO-RESULT-005 — 삭제된 ID 접근 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A326:N326` · 분류 `RESULT`


```yaml
"No": 325
"TC ID": "BO-RESULT-005"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/진입"
"Test Case": "삭제된 ID 접근 검증"
"Pre-Condition": "삭제된 BO 시나리오 ID"
"Test steps": |-
  1. 대상 URL `/budgetoptimizer/scenario/{id}/result`에 접근함
  2. 화면 또는 리다이렉트 결과를 확인함
"Expected Result": |-
  - 존재하지 않는 항목 안내 후 목록으로 리다이렉트됨
  - 권한 없는 데이터는 응답 내용/화면에 노출되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-005::A01`, `BO-RESULT-005::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + AUTH_BINDINGS`임. 상태별 URL·최종 화면·민감 데이터 비노출을 분리 관찰함. 서버 권한 차단은 실제 인증/권한이 적용된 테스트 환경에서 별도로 검증함.

- **개별 주의**: 삭제된 시나리오의 과거 데이터가 남아 보이지 않는지 확인함. 목록 리다이렉트 문구와 중간 상태는 알림 네비게이션 정책 및 승인 기준과 대조함.

- **대조 문서**: `§1.3 / Platform_Role_Permission_Spec.md / GNB_Notification_Navigation_Spec.md`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-005 -->


<!-- TC-BEGIN:BO-RESULT-006 -->
<a id="bo-result-006"></a>
#### BO-RESULT-006 — 권한 없는 Slot 결과 접근 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A327:N327` · 분류 `RESULT`


```yaml
"No": 326
"TC ID": "BO-RESULT-006"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/진입"
"Test Case": "권한 없는 Slot 결과 접근 검증"
"Pre-Condition": "접근 권한 없는 Slot의 결과 URL"
"Test steps": |-
  1. 대상 URL `/budgetoptimizer/scenario/{id}/result`에 접근함
  2. 화면 또는 리다이렉트 결과를 확인함
"Expected Result": |-
  - 403 에러 페이지와 '접근 권한이 없습니다. 슬롯 관리자에게 문의하세요.' 메시지 표시
  - 권한 없는 데이터는 응답 내용/화면에 노출되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-006::A01`, `BO-RESULT-006::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + AUTH_BINDINGS`임. 상태별 URL·최종 화면·민감 데이터 비노출을 분리 관찰함. 서버 권한 차단은 실제 인증/권한이 적용된 테스트 환경에서 별도로 검증함.

- **확인 필요**: [AUTO-01](#auto-01) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§1.3 / Platform_Role_Permission_Spec.md / GNB_Notification_Navigation_Spec.md`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-006 -->


### 영역: 결과 화면/헤더


<!-- TC-BEGIN:BO-RESULT-007 -->
<a id="bo-result-007"></a>
#### BO-RESULT-007 — 결과 헤더 헤더 레이아웃 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A328:N328` · 분류 `RESULT`


```yaml
"No": 327
"TC ID": "BO-RESULT-007"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/헤더"
"Test Case": "결과 헤더 헤더 레이아웃 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. 헤더 우측 액션 또는 정보 아이콘을 조작함
  2. 표시 문구와 다운로드/토스트/메뉴 동작을 확인함
"Expected Result": |-
  - 좌측 시나리오명·메타정보와 우측 Export/Info/컨텍스트 메뉴가 한 줄에 표시됨
  - 헤더는 GNB/SNB/Breadcrumb가 있는 AppLayout 내부에 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-007::A01`, `BO-RESULT-007::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + UI_BINDINGS + DOWNLOAD_CONTRACT`임. 시나리오 ID를 기준으로 헤더를 특정함. Export/Info/More가 서로 다른 트리거임을 확인하고 각 메뉴와 툴팁 범위 안에서 검사함.

- **대조 문서**: `§2 / §12`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-007 -->


<!-- TC-BEGIN:BO-RESULT-008 -->
<a id="bo-result-008"></a>
#### BO-RESULT-008 — 결과 헤더 시나리오명 말줄임 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A329:N329` · 분류 `RESULT`


```yaml
"No": 328
"TC ID": "BO-RESULT-008"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/헤더"
"Test Case": "결과 헤더 시나리오명 말줄임 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. 헤더 우측 액션 또는 정보 아이콘을 조작함
  2. 표시 문구와 다운로드/토스트/메뉴 동작을 확인함
"Expected Result": |-
  - 긴 시나리오명은 말줄임 처리되고 레이아웃을 밀어내지 않음
  - 헤더는 GNB/SNB/Breadcrumb가 있는 AppLayout 내부에 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-008::A01`, `BO-RESULT-008::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + UI_BINDINGS + DOWNLOAD_CONTRACT`임. 시나리오 ID를 기준으로 헤더를 특정함. Export/Info/More가 서로 다른 트리거임을 확인하고 각 메뉴와 툴팁 범위 안에서 검사함.

- **대조 문서**: `§2 / §12`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-008 -->


<!-- TC-BEGIN:BO-RESULT-009 -->
<a id="bo-result-009"></a>
#### BO-RESULT-009 — 결과 헤더 헤더 메타 중복 방지 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A330:N330` · 분류 `RESULT`


```yaml
"No": 329
"TC ID": "BO-RESULT-009"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/헤더"
"Test Case": "결과 헤더 헤더 메타 중복 방지 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. 헤더 우측 액션 또는 정보 아이콘을 조작함
  2. 표시 문구와 다운로드/토스트/메뉴 동작을 확인함
"Expected Result": |-
  - Budget Optimizer 전용 뱃지·설정 요약이 헤더에 별도로 중복 표시되지 않음
  - 헤더는 GNB/SNB/Breadcrumb가 있는 AppLayout 내부에 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-009::A01`, `BO-RESULT-009::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + UI_BINDINGS + DOWNLOAD_CONTRACT`임. 시나리오 ID를 기준으로 헤더를 특정함. Export/Info/More가 서로 다른 트리거임을 확인하고 각 메뉴와 툴팁 범위 안에서 검사함.

- **대조 문서**: `§2 / §12`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-009 -->


<!-- TC-BEGIN:BO-RESULT-010 -->
<a id="bo-result-010"></a>
#### BO-RESULT-010 — 결과 헤더 Export 드롭다운 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A331:N331` · 분류 `RESULT`


```yaml
"No": 330
"TC ID": "BO-RESULT-010"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/헤더"
"Test Case": "결과 헤더 Export 드롭다운 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. 헤더 우측 액션 또는 정보 아이콘을 조작함
  2. 표시 문구와 다운로드/토스트/메뉴 동작을 확인함
"Expected Result": |-
  - Export 클릭 시 공유/다운로드 메뉴가 표시됨
  - 헤더는 GNB/SNB/Breadcrumb가 있는 AppLayout 내부에 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-010::A01`, `BO-RESULT-010::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + UI_BINDINGS + DOWNLOAD_CONTRACT`임. 시나리오 ID를 기준으로 헤더를 특정함. Export/Info/More가 서로 다른 트리거임을 확인하고 각 메뉴와 툴팁 범위 안에서 검사함.

- **확인 필요**: [AUTO-10](#auto-10) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2 / §12`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-010 -->


<!-- TC-BEGIN:BO-RESULT-011 -->
<a id="bo-result-011"></a>
#### BO-RESULT-011 — 결과 헤더 Copy Link 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A332:N332` · 분류 `RESULT`


```yaml
"No": 331
"TC ID": "BO-RESULT-011"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/헤더"
"Test Case": "결과 헤더 Copy Link 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. 헤더 우측 액션 또는 정보 아이콘을 조작함
  2. 표시 문구와 다운로드/토스트/메뉴 동작을 확인함
"Expected Result": |-
  - 현재 URL이 클립보드에 복사되고 성공 토스트가 표시됨
  - 헤더는 GNB/SNB/Breadcrumb가 있는 AppLayout 내부에 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-011::A01`, `BO-RESULT-011::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + UI_BINDINGS + DOWNLOAD_CONTRACT`임. 시나리오 ID를 기준으로 헤더를 특정함. Export/Info/More가 서로 다른 트리거임을 확인하고 각 메뉴와 툴팁 범위 안에서 검사함.

- **확인 필요**: [AUTO-10](#auto-10) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2 / §12`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-011 -->


<!-- TC-BEGIN:BO-RESULT-012 -->
<a id="bo-result-012"></a>
#### BO-RESULT-012 — 결과 헤더 Export Excel 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A333:N333` · 분류 `RESULT`


```yaml
"No": 332
"TC ID": "BO-RESULT-012"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/헤더"
"Test Case": "결과 헤더 Export Excel 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. 헤더 우측 액션 또는 정보 아이콘을 조작함
  2. 표시 문구와 다운로드/토스트/메뉴 동작을 확인함
"Expected Result": |-
  - Excel Export 항목 클릭 시 결과 데이터 다운로드가 시작됨
  - 헤더는 GNB/SNB/Breadcrumb가 있는 AppLayout 내부에 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-012::A01`, `BO-RESULT-012::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + UI_BINDINGS + DOWNLOAD_CONTRACT`임. 시나리오 ID를 기준으로 헤더를 특정함. Export/Info/More가 서로 다른 트리거임을 확인하고 각 메뉴와 툴팁 범위 안에서 검사함.

- **확인 필요**: [AUTO-10](#auto-10) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2 / §12`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-012 -->


<!-- TC-BEGIN:BO-RESULT-013 -->
<a id="bo-result-013"></a>
#### BO-RESULT-013 — 결과 헤더 Export PDF 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A334:N334` · 분류 `RESULT`


```yaml
"No": 333
"TC ID": "BO-RESULT-013"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/헤더"
"Test Case": "결과 헤더 Export PDF 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. 헤더 우측 액션 또는 정보 아이콘을 조작함
  2. 표시 문구와 다운로드/토스트/메뉴 동작을 확인함
"Expected Result": |-
  - PDF Export 항목 클릭 시 결과 데이터 다운로드가 시작됨
  - 헤더는 GNB/SNB/Breadcrumb가 있는 AppLayout 내부에 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-013::A01`, `BO-RESULT-013::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + UI_BINDINGS + DOWNLOAD_CONTRACT`임. 시나리오 ID를 기준으로 헤더를 특정함. Export/Info/More가 서로 다른 트리거임을 확인하고 각 메뉴와 툴팁 범위 안에서 검사함.

- **확인 필요**: [AUTO-10](#auto-10) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2 / §12`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-013 -->


<!-- TC-BEGIN:BO-RESULT-014 -->
<a id="bo-result-014"></a>
#### BO-RESULT-014 — 결과 헤더 Info 툴팁 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A335:N335` · 분류 `RESULT`


```yaml
"No": 334
"TC ID": "BO-RESULT-014"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/헤더"
"Test Case": "결과 헤더 Info 툴팁 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. 헤더 우측 액션 또는 정보 아이콘을 조작함
  2. 표시 문구와 다운로드/토스트/메뉴 동작을 확인함
"Expected Result": |-
  - Info hover 시 설명, Scenario ID, 생성일시, 완료일시가 표시됨
  - 헤더는 GNB/SNB/Breadcrumb가 있는 AppLayout 내부에 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-014::A01`, `BO-RESULT-014::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + UI_BINDINGS + DOWNLOAD_CONTRACT`임. 시나리오 ID를 기준으로 헤더를 특정함. Export/Info/More가 서로 다른 트리거임을 확인하고 각 메뉴와 툴팁 범위 안에서 검사함.

- **대조 문서**: `§2 / §12`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-014 -->


<!-- TC-BEGIN:BO-RESULT-015 -->
<a id="bo-result-015"></a>
#### BO-RESULT-015 — 결과 헤더 컨텍스트 메뉴 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A336:N336` · 분류 `RESULT`


```yaml
"No": 335
"TC ID": "BO-RESULT-015"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/헤더"
"Test Case": "결과 헤더 컨텍스트 메뉴 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. 헤더 우측 액션 또는 정보 아이콘을 조작함
  2. 표시 문구와 다운로드/토스트/메뉴 동작을 확인함
"Expected Result": |-
  - More 클릭 시 복제/이동/삭제 관리 메뉴가 표시됨
  - 헤더는 GNB/SNB/Breadcrumb가 있는 AppLayout 내부에 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-015::A01`, `BO-RESULT-015::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + UI_BINDINGS + DOWNLOAD_CONTRACT`임. 시나리오 ID를 기준으로 헤더를 특정함. Export/Info/More가 서로 다른 트리거임을 확인하고 각 메뉴와 툴팁 범위 안에서 검사함.

- **확인 필요**: [AUTO-09](#auto-09) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2 / §12`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-015 -->


<!-- TC-BEGIN:BO-RESULT-016 -->
<a id="bo-result-016"></a>
#### BO-RESULT-016 — 결과 헤더 컨텍스트 메뉴 외부 클릭 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A337:N337` · 분류 `RESULT`


```yaml
"No": 336
"TC ID": "BO-RESULT-016"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/헤더"
"Test Case": "결과 헤더 컨텍스트 메뉴 외부 클릭 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. 헤더 우측 액션 또는 정보 아이콘을 조작함
  2. 표시 문구와 다운로드/토스트/메뉴 동작을 확인함
"Expected Result": |-
  - 외부 클릭 시 메뉴가 닫힘
  - 헤더는 GNB/SNB/Breadcrumb가 있는 AppLayout 내부에 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-016::A01`, `BO-RESULT-016::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + UI_BINDINGS + DOWNLOAD_CONTRACT`임. 시나리오 ID를 기준으로 헤더를 특정함. Export/Info/More가 서로 다른 트리거임을 확인하고 각 메뉴와 툴팁 범위 안에서 검사함.

- **확인 필요**: [AUTO-09](#auto-09) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2 / §12`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-016 -->


<!-- TC-BEGIN:BO-RESULT-017 -->
<a id="bo-result-017"></a>
#### BO-RESULT-017 — 결과 헤더 삭제 메뉴 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A338:N338` · 분류 `RESULT`


```yaml
"No": 337
"TC ID": "BO-RESULT-017"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/헤더"
"Test Case": "결과 헤더 삭제 메뉴 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. 헤더 우측 액션 또는 정보 아이콘을 조작함
  2. 표시 문구와 다운로드/토스트/메뉴 동작을 확인함
"Expected Result": |-
  - 삭제 클릭 시 삭제 확인 다이얼로그가 표시됨
  - 헤더는 GNB/SNB/Breadcrumb가 있는 AppLayout 내부에 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-017::A01`, `BO-RESULT-017::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + UI_BINDINGS + DOWNLOAD_CONTRACT`임. 시나리오 ID를 기준으로 헤더를 특정함. Export/Info/More가 서로 다른 트리거임을 확인하고 각 메뉴와 툴팁 범위 안에서 검사함.

- **확인 필요**: [AUTO-09](#auto-09) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2 / §12`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-017 -->


<!-- TC-BEGIN:BO-RESULT-018 -->
<a id="bo-result-018"></a>
#### BO-RESULT-018 — 결과 헤더 삭제 실패 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A339:N339` · 분류 `RESULT`


```yaml
"No": 338
"TC ID": "BO-RESULT-018"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/헤더"
"Test Case": "결과 헤더 삭제 실패 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. 헤더 우측 액션 또는 정보 아이콘을 조작함
  2. 표시 문구와 다운로드/토스트/메뉴 동작을 확인함
"Expected Result": |-
  - 삭제 실패 시 오류 토스트가 표시되고 결과 화면이 유지됨
  - 헤더는 GNB/SNB/Breadcrumb가 있는 AppLayout 내부에 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-018::A01`, `BO-RESULT-018::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + UI_BINDINGS + DOWNLOAD_CONTRACT`임. 시나리오 ID를 기준으로 헤더를 특정함. Export/Info/More가 서로 다른 트리거임을 확인하고 각 메뉴와 툴팁 범위 안에서 검사함.

- **확인 필요**: [AUTO-09](#auto-09) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2 / §12`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-018 -->


### 영역: 결과 화면/잠금·순수 모드


<!-- TC-BEGIN:BO-RESULT-019 -->
<a id="bo-result-019"></a>
#### BO-RESULT-019 — 잠금 시나리오 배너 노출 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A340:N340` · 분류 `RESULT`


```yaml
"No": 339
"TC ID": "BO-RESULT-019"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/잠금·순수 모드"
"Test Case": "잠금 시나리오 배너 노출 검증"
"Pre-Condition": "잠금이 1개 이상인 결과"
"Test steps": |-
  1. 결과 상태 띠배너와 전환 버튼을 확인하거나 클릭함
  2. 스코어카드/차트/테이블 데이터를 비교함
"Expected Result": |-
  - 결과 상태 띠배너가 노출됨
  - 모드 전환 시 이전 모드의 delta/lock 표시가 잔존하지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-019::A01`, `BO-RESULT-019::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 잠금/순수 결과의 예산·KPI가 서로 다른 fixture를 사용함. 현재 모드 문구와 데이터 갱신 완료를 확인한 뒤 비교함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§3 / §5.2 / §8.2 / §11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-019 -->


<!-- TC-BEGIN:BO-RESULT-020 -->
<a id="bo-result-020"></a>
#### BO-RESULT-020 — 무잠금 시나리오 배너 미노출 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A341:N341` · 분류 `RESULT`


```yaml
"No": 340
"TC ID": "BO-RESULT-020"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/잠금·순수 모드"
"Test Case": "무잠금 시나리오 배너 미노출 검증"
"Pre-Condition": "잠금이 하나도 없는 결과"
"Test steps": |-
  1. 결과 상태 띠배너와 전환 버튼을 확인하거나 클릭함
  2. 스코어카드/차트/테이블 데이터를 비교함
"Expected Result": |-
  - 띠배너가 노출되지 않고 기본 타이틀 Optimized Budget Allocation + 설명만 표시됨
  - 모드 전환 시 이전 모드의 delta/lock 표시가 잔존하지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-020::A01`, `BO-RESULT-020::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 잠금/순수 결과의 예산·KPI가 서로 다른 fixture를 사용함. 현재 모드 문구와 데이터 갱신 완료를 확인한 뒤 비교함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§3 / §5.2 / §8.2 / §11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-020 -->


<!-- TC-BEGIN:BO-RESULT-021 -->
<a id="bo-result-021"></a>
#### BO-RESULT-021 — 잠금 반영 모드 문구 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A342:N342` · 분류 `RESULT`


```yaml
"No": 341
"TC ID": "BO-RESULT-021"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/잠금·순수 모드"
"Test Case": "잠금 반영 모드 문구 검증"
"Pre-Condition": "잠금 반영 뷰"
"Test steps": |-
  1. 결과 상태 띠배너와 전환 버튼을 확인하거나 클릭함
  2. 스코어카드/차트/테이블 데이터를 비교함
"Expected Result": |-
  - Locked Budget Allocation과 '시나리오 생성 시 설정한 예산 잠금이 반영된 최적화 결과입니다.' 문구 표시
  - 모드 전환 시 이전 모드의 delta/lock 표시가 잔존하지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-021::A01`, `BO-RESULT-021::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 잠금/순수 결과의 예산·KPI가 서로 다른 fixture를 사용함. 현재 모드 문구와 데이터 갱신 완료를 확인한 뒤 비교함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§3 / §5.2 / §8.2 / §11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-021 -->


<!-- TC-BEGIN:BO-RESULT-022 -->
<a id="bo-result-022"></a>
#### BO-RESULT-022 — 순수 최적화 모드 문구 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A343:N343` · 분류 `RESULT`


```yaml
"No": 342
"TC ID": "BO-RESULT-022"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/잠금·순수 모드"
"Test Case": "순수 최적화 모드 문구 검증"
"Pre-Condition": "순수 최적화 뷰"
"Test steps": |-
  1. 결과 상태 띠배너와 전환 버튼을 확인하거나 클릭함
  2. 스코어카드/차트/테이블 데이터를 비교함
"Expected Result": |-
  - Fully Optimized Allocation과 '예산 잠금 없이 모델이 전체 예산을 자유롭게 최적 배분한 결과입니다.' 문구 표시
  - 모드 전환 시 이전 모드의 delta/lock 표시가 잔존하지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-022::A01`, `BO-RESULT-022::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 잠금/순수 결과의 예산·KPI가 서로 다른 fixture를 사용함. 현재 모드 문구와 데이터 갱신 완료를 확인한 뒤 비교함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§3 / §5.2 / §8.2 / §11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-022 -->


<!-- TC-BEGIN:BO-RESULT-023 -->
<a id="bo-result-023"></a>
#### BO-RESULT-023 — 잠금 반영→순수 전환 버튼 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A344:N344` · 분류 `RESULT`


```yaml
"No": 343
"TC ID": "BO-RESULT-023"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/잠금·순수 모드"
"Test Case": "잠금 반영→순수 전환 버튼 검증"
"Pre-Condition": "잠금 반영 뷰"
"Test steps": |-
  1. 결과 상태 띠배너와 전환 버튼을 확인하거나 클릭함
  2. 스코어카드/차트/테이블 데이터를 비교함
"Expected Result": |-
  - 버튼 문구가 '순수 최적화 결과 보기'와 열린 자물쇠 아이콘으로 표시됨
  - 모드 전환 시 이전 모드의 delta/lock 표시가 잔존하지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-023::A01`, `BO-RESULT-023::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 잠금/순수 결과의 예산·KPI가 서로 다른 fixture를 사용함. 현재 모드 문구와 데이터 갱신 완료를 확인한 뒤 비교함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§3 / §5.2 / §8.2 / §11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-023 -->


<!-- TC-BEGIN:BO-RESULT-024 -->
<a id="bo-result-024"></a>
#### BO-RESULT-024 — 순수→잠금 반영 전환 버튼 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A345:N345` · 분류 `RESULT`


```yaml
"No": 344
"TC ID": "BO-RESULT-024"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/잠금·순수 모드"
"Test Case": "순수→잠금 반영 전환 버튼 검증"
"Pre-Condition": "순수 최적화 뷰"
"Test steps": |-
  1. 결과 상태 띠배너와 전환 버튼을 확인하거나 클릭함
  2. 스코어카드/차트/테이블 데이터를 비교함
"Expected Result": |-
  - 버튼 문구가 '잠금 반영 최적화 결과 보기'와 자물쇠 아이콘으로 표시됨
  - 모드 전환 시 이전 모드의 delta/lock 표시가 잔존하지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-024::A01`, `BO-RESULT-024::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 잠금/순수 결과의 예산·KPI가 서로 다른 fixture를 사용함. 현재 모드 문구와 데이터 갱신 완료를 확인한 뒤 비교함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§3 / §5.2 / §8.2 / §11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-024 -->


<!-- TC-BEGIN:BO-RESULT-025 -->
<a id="bo-result-025"></a>
#### BO-RESULT-025 — 모드 전환 데이터 반영 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A346:N346` · 분류 `RESULT`


```yaml
"No": 345
"TC ID": "BO-RESULT-025"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/잠금·순수 모드"
"Test Case": "모드 전환 데이터 반영 검증"
"Pre-Condition": "잠금 반영 뷰에서 전환 버튼 클릭"
"Test steps": |-
  1. 결과 상태 띠배너와 전환 버튼을 확인하거나 클릭함
  2. 스코어카드/차트/테이블 데이터를 비교함
"Expected Result": |-
  - 스코어카드·테이블·차트 전체가 순수 최적화 데이터로 전환됨
  - 모드 전환 시 이전 모드의 delta/lock 표시가 잔존하지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-025::A01`, `BO-RESULT-025::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 잠금/순수 결과의 예산·KPI가 서로 다른 fixture를 사용함. 현재 모드 문구와 데이터 갱신 완료를 확인한 뒤 비교함.

- **확인 필요**: [AUTO-04](#auto-04), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§3 / §5.2 / §8.2 / §11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-025 -->


<!-- TC-BEGIN:BO-RESULT-026 -->
<a id="bo-result-026"></a>
#### BO-RESULT-026 — 순수 뷰 잠금 아이콘 숨김 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A347:N347` · 분류 `RESULT`


```yaml
"No": 346
"TC ID": "BO-RESULT-026"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/잠금·순수 모드"
"Test Case": "순수 뷰 잠금 아이콘 숨김 검증"
"Pre-Condition": "순수 최적화 뷰"
"Test steps": |-
  1. 결과 상태 띠배너와 전환 버튼을 확인하거나 클릭함
  2. 스코어카드/차트/테이블 데이터를 비교함
"Expected Result": |-
  - 예산 잠금 표시가 모두 숨겨짐
  - 모드 전환 시 이전 모드의 delta/lock 표시가 잔존하지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-026::A01`, `BO-RESULT-026::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 잠금/순수 결과의 예산·KPI가 서로 다른 fixture를 사용함. 현재 모드 문구와 데이터 갱신 완료를 확인한 뒤 비교함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§3 / §5.2 / §8.2 / §11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-026 -->


<!-- TC-BEGIN:BO-RESULT-027 -->
<a id="bo-result-027"></a>
#### BO-RESULT-027 — 반복 전환 일관성 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A348:N348` · 분류 `RESULT`


```yaml
"No": 347
"TC ID": "BO-RESULT-027"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/잠금·순수 모드"
"Test Case": "반복 전환 일관성 검증"
"Pre-Condition": "모드 전환 3회 반복"
"Test steps": |-
  1. 결과 상태 띠배너와 전환 버튼을 확인하거나 클릭함
  2. 스코어카드/차트/테이블 데이터를 비교함
"Expected Result": |-
  - 각 전환마다 현재 모드 문구와 데이터가 일치함
  - 모드 전환 시 이전 모드의 delta/lock 표시가 잔존하지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-027::A01`, `BO-RESULT-027::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 잠금/순수 결과의 예산·KPI가 서로 다른 fixture를 사용함. 현재 모드 문구와 데이터 갱신 완료를 확인한 뒤 비교함.

- **확인 필요**: [AUTO-04](#auto-04), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§3 / §5.2 / §8.2 / §11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-027 -->


### 영역: 결과 화면/KPI 파생 표기


<!-- TC-BEGIN:BO-RESULT-028 -->
<a id="bo-result-028"></a>
#### BO-RESULT-028 — KPI=노출 화면 라벨 치환 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A349:N349` · 분류 `RESULT`


```yaml
"No": 348
"TC ID": "BO-RESULT-028"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/KPI 파생 표기"
"Test Case": "KPI=노출 화면 라벨 치환 검증"
"Pre-Condition": "선택 KPI가 노출인 BO 결과 데이터가 존재함"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 스코어카드, 차트 제목/부제, 테이블 컬럼명을 확인함
"Expected Result": |-
  - 스코어카드 1번 카드가 'Guaranteed Impression'로 표시됨
  - 스코어카드 3번 카드가 'Avg. CPM'로 표시됨
  - Incremental 영문 차트명이 'Incremental Impression'로 표시됨
  - Response Curve 부제가 '예산 투입 대비 보장 노출 반응'으로 표시됨
  - Budget Allocation Detail의 Guaranteed Impression 컬럼이 표시됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-028::A01`, `BO-RESULT-028::A02`, `BO-RESULT-028::A03`, `BO-RESULT-028::A04`, `BO-RESULT-028::A05`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 노출·클릭·조회·도달 시나리오를 분리함. 라벨 검증과 수치 검증을 분리하고 각 단가 TC의 정상 분모/분모 0 분기를 모두 기록함.

- **개별 주의**: KPI=impression인 fixture로 실행함. {KPI}=노출, {KPIEn}=Impression으로 치환함.

- **대조 문서**: `§4 / §5.2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-028 -->


<!-- TC-BEGIN:BO-RESULT-029 -->
<a id="bo-result-029"></a>
#### BO-RESULT-029 — KPI=노출 단가 산출식 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A350:N350` · 분류 `RESULT`


```yaml
"No": 349
"TC ID": "BO-RESULT-029"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/KPI 파생 표기"
"Test Case": "KPI=노출 단가 산출식 검증"
"Pre-Condition": "선택 KPI=노출, 총예산과 KPI 합계가 알려진 결과 데이터가 존재함"
"Test steps": |-
  1. 결과 화면에 진입함
  2. Avg. 단가 카드 값을 계산식과 비교함
"Expected Result": |-
  - Avg. CPM 값이 선택 KPI의 분모 기준으로 계산됨
  - 분모 KPI 합계가 0인 경우 값이 0으로 표시되어 0 나누기 오류가 발생하지 않음
  - 값 단위는 정수 원으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-029::A01`, `BO-RESULT-029::A02`, `BO-RESULT-029::A03`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 노출·클릭·조회·도달 시나리오를 분리함. 라벨 검증과 수치 검증을 분리하고 각 단가 TC의 정상 분모/분모 0 분기를 모두 기록함.

- **확인 필요**: [AUTO-02](#auto-02) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§4 / §5.2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-029 -->


<!-- TC-BEGIN:BO-RESULT-030 -->
<a id="bo-result-030"></a>
#### BO-RESULT-030 — KPI=클릭 화면 라벨 치환 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A351:N351` · 분류 `RESULT`


```yaml
"No": 350
"TC ID": "BO-RESULT-030"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/KPI 파생 표기"
"Test Case": "KPI=클릭 화면 라벨 치환 검증"
"Pre-Condition": "선택 KPI가 클릭인 BO 결과 데이터가 존재함"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 스코어카드, 차트 제목/부제, 테이블 컬럼명을 확인함
"Expected Result": |-
  - 스코어카드 1번 카드가 'Guaranteed Click'로 표시됨
  - 스코어카드 3번 카드가 'Avg. CPC'로 표시됨
  - Incremental 영문 차트명이 'Incremental Click'로 표시됨
  - Response Curve 부제가 '예산 투입 대비 보장 클릭 반응'으로 표시됨
  - Budget Allocation Detail의 Guaranteed Click 컬럼이 표시됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-030::A01`, `BO-RESULT-030::A02`, `BO-RESULT-030::A03`, `BO-RESULT-030::A04`, `BO-RESULT-030::A05`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 노출·클릭·조회·도달 시나리오를 분리함. 라벨 검증과 수치 검증을 분리하고 각 단가 TC의 정상 분모/분모 0 분기를 모두 기록함.

- **개별 주의**: KPI=click인 fixture로 실행함. {KPI}=클릭, {KPIEn}=Click으로 치환함.

- **대조 문서**: `§4 / §5.2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-030 -->


<!-- TC-BEGIN:BO-RESULT-031 -->
<a id="bo-result-031"></a>
#### BO-RESULT-031 — KPI=클릭 단가 산출식 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A352:N352` · 분류 `RESULT`


```yaml
"No": 351
"TC ID": "BO-RESULT-031"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/KPI 파생 표기"
"Test Case": "KPI=클릭 단가 산출식 검증"
"Pre-Condition": "선택 KPI=클릭, 총예산과 KPI 합계가 알려진 결과 데이터가 존재함"
"Test steps": |-
  1. 결과 화면에 진입함
  2. Avg. 단가 카드 값을 계산식과 비교함
"Expected Result": |-
  - Avg. CPC 값이 선택 KPI의 분모 기준으로 계산됨
  - 분모 KPI 합계가 0인 경우 값이 0으로 표시되어 0 나누기 오류가 발생하지 않음
  - 값 단위는 정수 원으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-031::A01`, `BO-RESULT-031::A02`, `BO-RESULT-031::A03`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 노출·클릭·조회·도달 시나리오를 분리함. 라벨 검증과 수치 검증을 분리하고 각 단가 TC의 정상 분모/분모 0 분기를 모두 기록함.

- **확인 필요**: [AUTO-02](#auto-02) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§4 / §5.2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-031 -->


<!-- TC-BEGIN:BO-RESULT-032 -->
<a id="bo-result-032"></a>
#### BO-RESULT-032 — KPI=조회 화면 라벨 치환 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A353:N353` · 분류 `RESULT`


```yaml
"No": 352
"TC ID": "BO-RESULT-032"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/KPI 파생 표기"
"Test Case": "KPI=조회 화면 라벨 치환 검증"
"Pre-Condition": "선택 KPI가 조회인 BO 결과 데이터가 존재함"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 스코어카드, 차트 제목/부제, 테이블 컬럼명을 확인함
"Expected Result": |-
  - 스코어카드 1번 카드가 'Guaranteed View'로 표시됨
  - 스코어카드 3번 카드가 'Avg. CPV'로 표시됨
  - Incremental 영문 차트명이 'Incremental View'로 표시됨
  - Response Curve 부제가 '예산 투입 대비 보장 조회 반응'으로 표시됨
  - Budget Allocation Detail의 Guaranteed View 컬럼이 표시됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-032::A01`, `BO-RESULT-032::A02`, `BO-RESULT-032::A03`, `BO-RESULT-032::A04`, `BO-RESULT-032::A05`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 노출·클릭·조회·도달 시나리오를 분리함. 라벨 검증과 수치 검증을 분리하고 각 단가 TC의 정상 분모/분모 0 분기를 모두 기록함.

- **개별 주의**: KPI=view인 fixture로 실행함. {KPI}=조회, {KPIEn}=View로 치환함.

- **대조 문서**: `§4 / §5.2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-032 -->


<!-- TC-BEGIN:BO-RESULT-033 -->
<a id="bo-result-033"></a>
#### BO-RESULT-033 — KPI=조회 단가 산출식 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A354:N354` · 분류 `RESULT`


```yaml
"No": 353
"TC ID": "BO-RESULT-033"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/KPI 파생 표기"
"Test Case": "KPI=조회 단가 산출식 검증"
"Pre-Condition": "선택 KPI=조회, 총예산과 KPI 합계가 알려진 결과 데이터가 존재함"
"Test steps": |-
  1. 결과 화면에 진입함
  2. Avg. 단가 카드 값을 계산식과 비교함
"Expected Result": |-
  - Avg. CPV 값이 선택 KPI의 분모 기준으로 계산됨
  - 분모 KPI 합계가 0인 경우 값이 0으로 표시되어 0 나누기 오류가 발생하지 않음
  - 값 단위는 정수 원으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-033::A01`, `BO-RESULT-033::A02`, `BO-RESULT-033::A03`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 노출·클릭·조회·도달 시나리오를 분리함. 라벨 검증과 수치 검증을 분리하고 각 단가 TC의 정상 분모/분모 0 분기를 모두 기록함.

- **확인 필요**: [AUTO-02](#auto-02) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§4 / §5.2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-033 -->


<!-- TC-BEGIN:BO-RESULT-034 -->
<a id="bo-result-034"></a>
#### BO-RESULT-034 — KPI=도달 화면 라벨 치환 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A355:N355` · 분류 `RESULT`


```yaml
"No": 354
"TC ID": "BO-RESULT-034"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/KPI 파생 표기"
"Test Case": "KPI=도달 화면 라벨 치환 검증"
"Pre-Condition": "선택 KPI가 도달인 BO 결과 데이터가 존재함"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 스코어카드, 차트 제목/부제, 테이블 컬럼명을 확인함
"Expected Result": |-
  - 스코어카드 1번 카드가 'Guaranteed Reach'로 표시됨
  - 스코어카드 3번 카드가 'Avg. CPR'로 표시됨
  - Incremental 영문 차트명이 'Incremental Reach'로 표시됨
  - Response Curve 부제가 '예산 투입 대비 보장 도달 반응'으로 표시됨
  - Budget Allocation Detail의 Guaranteed Reach 컬럼이 표시됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-034::A01`, `BO-RESULT-034::A02`, `BO-RESULT-034::A03`, `BO-RESULT-034::A04`, `BO-RESULT-034::A05`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 노출·클릭·조회·도달 시나리오를 분리함. 라벨 검증과 수치 검증을 분리하고 각 단가 TC의 정상 분모/분모 0 분기를 모두 기록함.

- **개별 주의**: KPI=reach인 fixture로 실행함. {KPI}=도달, {KPIEn}=Reach로 치환함.

- **대조 문서**: `§4 / §5.2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-034 -->


<!-- TC-BEGIN:BO-RESULT-035 -->
<a id="bo-result-035"></a>
#### BO-RESULT-035 — KPI=도달 단가 산출식 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A356:N356` · 분류 `RESULT`


```yaml
"No": 355
"TC ID": "BO-RESULT-035"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/KPI 파생 표기"
"Test Case": "KPI=도달 단가 산출식 검증"
"Pre-Condition": "선택 KPI=도달, 총예산과 KPI 합계가 알려진 결과 데이터가 존재함"
"Test steps": |-
  1. 결과 화면에 진입함
  2. Avg. 단가 카드 값을 계산식과 비교함
"Expected Result": |-
  - Avg. CPR 값이 선택 KPI의 분모 기준으로 계산됨
  - 분모 KPI 합계가 0인 경우 값이 0으로 표시되어 0 나누기 오류가 발생하지 않음
  - 값 단위는 정수 원으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-035::A01`, `BO-RESULT-035::A02`, `BO-RESULT-035::A03`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 노출·클릭·조회·도달 시나리오를 분리함. 라벨 검증과 수치 검증을 분리하고 각 단가 TC의 정상 분모/분모 0 분기를 모두 기록함.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§4 / §5.2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-035 -->


<!-- TC-BEGIN:BO-RESULT-036 -->
<a id="bo-result-036"></a>
#### BO-RESULT-036 — 차트 한글 질문형 제목 KPI 무관 고정 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A357:N357` · 분류 `RESULT`


```yaml
"No": 356
"TC ID": "BO-RESULT-036"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/KPI 파생 표기"
"Test Case": "차트 한글 질문형 제목 KPI 무관 고정 검증"
"Pre-Condition": "KPI가 서로 다른 BO 결과 4건이 존재함"
"Test steps": |-
  1. KPI별 결과 화면에 각각 진입함
  2. 4개 차트 한글 질문형 대표 제목을 비교함
"Expected Result": "- 예산은 어디에 배분되었을까? / 예산을 더 넣으면 성과가 오를까? / 업종 내 매체별 기여는 어떤 흐름일까? / 최적화로 성과가 얼마나 늘어날까? 제목이 KPI와 무관하게 동일함"
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-036::A01`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 노출·클릭·조회·도달 시나리오를 분리함. 라벨 검증과 수치 검증을 분리하고 각 단가 TC의 정상 분모/분모 0 분기를 모두 기록함.

- **개별 주의**: 4개의 KPI 시나리오에서 차트 대표 질문 제목의 문자열을 비교함. 특정 한 KPI만 실행한 결과를 전체 KPI 통과로 확대하지 않음.

- **대조 문서**: `§4 / §5.2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-036 -->


<!-- TC-BEGIN:BO-RESULT-037 -->
<a id="bo-result-037"></a>
#### BO-RESULT-037 — 도달 KPI 단위 회 표기 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A358:N358` · 분류 `RESULT`


```yaml
"No": 357
"TC ID": "BO-RESULT-037"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/KPI 파생 표기"
"Test Case": "도달 KPI 단위 회 표기 검증"
"Pre-Condition": "선택 KPI=도달인 결과 데이터가 존재함"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 스코어카드와 테이블 Reach 값을 확인함
"Expected Result": |-
  - 도달도 %가 아닌 정수 + 회로 표시됨
  - Avg. CPR 산출식이 총예산 ÷ 총도달로 적용됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-037::A01`, `BO-RESULT-037::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT`임. 노출·클릭·조회·도달 시나리오를 분리함. 라벨 검증과 수치 검증을 분리하고 각 단가 TC의 정상 분모/분모 0 분기를 모두 기록함.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§4 / §5.2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-037 -->


### 영역: 결과 화면/스코어카드


<!-- TC-BEGIN:BO-RESULT-038 -->
<a id="bo-result-038"></a>
#### BO-RESULT-038 — 스코어카드 Guaranteed KPI 합계 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A359:N359` · 분류 `RESULT`


```yaml
"No": 358
"TC ID": "BO-RESULT-038"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/스코어카드"
"Test Case": "스코어카드 Guaranteed KPI 합계 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 검증용 allocations 데이터가 준비됨"
"Test steps": |-
  1. 스코어카드 4종 값을 확인함
  2. 필요 시 모드 전환 또는 hover를 수행함
"Expected Result": |-
  - 배분별 kpiValue 합계와 1번 카드 값이 일치함
  - 스코어카드 강조 밑줄은 highlighted 카드에만 적용됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-038::A01`, `BO-RESULT-038::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + VISUAL_BASELINE`임. 4개 카드 각각의 영역에서 라벨·값·단위를 검사함. 동일한 숫자가 테이블에 존재한다는 이유로 스코어카드 검증을 통과시키지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5 / 변경 이력의 highlighted 카드 규칙`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-038 -->


<!-- TC-BEGIN:BO-RESULT-039 -->
<a id="bo-result-039"></a>
#### BO-RESULT-039 — 스코어카드 Total Budget 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A360:N360` · 분류 `RESULT`


```yaml
"No": 359
"TC ID": "BO-RESULT-039"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/스코어카드"
"Test Case": "스코어카드 Total Budget 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 검증용 allocations 데이터가 준비됨"
"Test steps": |-
  1. 스코어카드 4종 값을 확인함
  2. 필요 시 모드 전환 또는 hover를 수행함
"Expected Result": |-
  - 총 예산이 정수(원), 축약 없이 전체 표기됨
  - 스코어카드 강조 밑줄은 highlighted 카드에만 적용됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-039::A01`, `BO-RESULT-039::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + VISUAL_BASELINE`임. 4개 카드 각각의 영역에서 라벨·값·단위를 검사함. 동일한 숫자가 테이블에 존재한다는 이유로 스코어카드 검증을 통과시키지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5 / 변경 이력의 highlighted 카드 규칙`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-039 -->


<!-- TC-BEGIN:BO-RESULT-040 -->
<a id="bo-result-040"></a>
#### BO-RESULT-040 — 스코어카드 Avg CPM 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A361:N361` · 분류 `RESULT`


```yaml
"No": 360
"TC ID": "BO-RESULT-040"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/스코어카드"
"Test Case": "스코어카드 Avg CPM 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 검증용 allocations 데이터가 준비됨"
"Test steps": |-
  1. 스코어카드 4종 값을 확인함
  2. 필요 시 모드 전환 또는 hover를 수행함
"Expected Result": |-
  - KPI=노출이면 총예산 ÷ (총노출 ÷ 1000)으로 계산됨
  - 스코어카드 강조 밑줄은 highlighted 카드에만 적용됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-040::A01`, `BO-RESULT-040::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + VISUAL_BASELINE`임. 4개 카드 각각의 영역에서 라벨·값·단위를 검사함. 동일한 숫자가 테이블에 존재한다는 이유로 스코어카드 검증을 통과시키지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5 / 변경 이력의 highlighted 카드 규칙`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-040 -->


<!-- TC-BEGIN:BO-RESULT-041 -->
<a id="bo-result-041"></a>
#### BO-RESULT-041 — 스코어카드 Avg CPC 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A362:N362` · 분류 `RESULT`


```yaml
"No": 361
"TC ID": "BO-RESULT-041"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/스코어카드"
"Test Case": "스코어카드 Avg CPC 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 검증용 allocations 데이터가 준비됨"
"Test steps": |-
  1. 스코어카드 4종 값을 확인함
  2. 필요 시 모드 전환 또는 hover를 수행함
"Expected Result": |-
  - KPI=클릭이면 총예산 ÷ 총클릭으로 계산됨
  - 스코어카드 강조 밑줄은 highlighted 카드에만 적용됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-041::A01`, `BO-RESULT-041::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + VISUAL_BASELINE`임. 4개 카드 각각의 영역에서 라벨·값·단위를 검사함. 동일한 숫자가 테이블에 존재한다는 이유로 스코어카드 검증을 통과시키지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5 / 변경 이력의 highlighted 카드 규칙`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-041 -->


<!-- TC-BEGIN:BO-RESULT-042 -->
<a id="bo-result-042"></a>
#### BO-RESULT-042 — 스코어카드 Avg CPV 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A363:N363` · 분류 `RESULT`


```yaml
"No": 362
"TC ID": "BO-RESULT-042"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/스코어카드"
"Test Case": "스코어카드 Avg CPV 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 검증용 allocations 데이터가 준비됨"
"Test steps": |-
  1. 스코어카드 4종 값을 확인함
  2. 필요 시 모드 전환 또는 hover를 수행함
"Expected Result": |-
  - KPI=조회이면 총예산 ÷ 총조회로 계산됨
  - 스코어카드 강조 밑줄은 highlighted 카드에만 적용됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-042::A01`, `BO-RESULT-042::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + VISUAL_BASELINE`임. 4개 카드 각각의 영역에서 라벨·값·단위를 검사함. 동일한 숫자가 테이블에 존재한다는 이유로 스코어카드 검증을 통과시키지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5 / 변경 이력의 highlighted 카드 규칙`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-042 -->


<!-- TC-BEGIN:BO-RESULT-043 -->
<a id="bo-result-043"></a>
#### BO-RESULT-043 — 스코어카드 Avg CPR 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A364:N364` · 분류 `RESULT`


```yaml
"No": 363
"TC ID": "BO-RESULT-043"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/스코어카드"
"Test Case": "스코어카드 Avg CPR 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 검증용 allocations 데이터가 준비됨"
"Test steps": |-
  1. 스코어카드 4종 값을 확인함
  2. 필요 시 모드 전환 또는 hover를 수행함
"Expected Result": |-
  - KPI=도달이면 총예산 ÷ 총도달로 계산됨
  - 스코어카드 강조 밑줄은 highlighted 카드에만 적용됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-043::A01`, `BO-RESULT-043::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + VISUAL_BASELINE`임. 4개 카드 각각의 영역에서 라벨·값·단위를 검사함. 동일한 숫자가 테이블에 존재한다는 이유로 스코어카드 검증을 통과시키지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5 / 변경 이력의 highlighted 카드 규칙`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-043 -->


<!-- TC-BEGIN:BO-RESULT-044 -->
<a id="bo-result-044"></a>
#### BO-RESULT-044 — 스코어카드 Locked Budget 값 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A365:N365` · 분류 `RESULT`


```yaml
"No": 364
"TC ID": "BO-RESULT-044"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/스코어카드"
"Test Case": "스코어카드 Locked Budget 값 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 검증용 allocations 데이터가 준비됨"
"Test steps": |-
  1. 스코어카드 4종 값을 확인함
  2. 필요 시 모드 전환 또는 hover를 수행함
"Expected Result": |-
  - 잠금 예산 합계와 비중이 '{금액}원 ({비중}%)' 형식으로 표시됨
  - 스코어카드 강조 밑줄은 highlighted 카드에만 적용됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-044::A01`, `BO-RESULT-044::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + VISUAL_BASELINE`임. 4개 카드 각각의 영역에서 라벨·값·단위를 검사함. 동일한 숫자가 테이블에 존재한다는 이유로 스코어카드 검증을 통과시키지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5 / 변경 이력의 highlighted 카드 규칙`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-044 -->


<!-- TC-BEGIN:BO-RESULT-045 -->
<a id="bo-result-045"></a>
#### BO-RESULT-045 — 스코어카드 잠금 예산 0 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A366:N366` · 분류 `RESULT`


```yaml
"No": 365
"TC ID": "BO-RESULT-045"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/스코어카드"
"Test Case": "스코어카드 잠금 예산 0 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 검증용 allocations 데이터가 준비됨"
"Test steps": |-
  1. 스코어카드 4종 값을 확인함
  2. 필요 시 모드 전환 또는 hover를 수행함
"Expected Result": |-
  - 잠금 예산이 0이면 값 0과 함께 비중은 표시되지 않음
  - 스코어카드 강조 밑줄은 highlighted 카드에만 적용됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-045::A01`, `BO-RESULT-045::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + VISUAL_BASELINE`임. 4개 카드 각각의 영역에서 라벨·값·단위를 검사함. 동일한 숫자가 테이블에 존재한다는 이유로 스코어카드 검증을 통과시키지 않음.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5 / 변경 이력의 highlighted 카드 규칙`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-045 -->


<!-- TC-BEGIN:BO-RESULT-046 -->
<a id="bo-result-046"></a>
#### BO-RESULT-046 — 스코어카드 모드 전환 재계산 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A367:N367` · 분류 `RESULT`


```yaml
"No": 366
"TC ID": "BO-RESULT-046"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/스코어카드"
"Test Case": "스코어카드 모드 전환 재계산 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 검증용 allocations 데이터가 준비됨"
"Test steps": |-
  1. 스코어카드 4종 값을 확인함
  2. 필요 시 모드 전환 또는 hover를 수행함
"Expected Result": |-
  - 잠금 반영/순수 최적화 모드 전환 시 4개 카드가 현재 모드 데이터 기준으로 재계산됨
  - 스코어카드 강조 밑줄은 highlighted 카드에만 적용됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-046::A01`, `BO-RESULT-046::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + VISUAL_BASELINE`임. 4개 카드 각각의 영역에서 라벨·값·단위를 검사함. 동일한 숫자가 테이블에 존재한다는 이유로 스코어카드 검증을 통과시키지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5 / 변경 이력의 highlighted 카드 규칙`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-046 -->


<!-- TC-BEGIN:BO-RESULT-047 -->
<a id="bo-result-047"></a>
#### BO-RESULT-047 — 스코어카드 카드 hover 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A368:N368` · 분류 `RESULT`


```yaml
"No": 367
"TC ID": "BO-RESULT-047"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/스코어카드"
"Test Case": "스코어카드 카드 hover 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 검증용 allocations 데이터가 준비됨"
"Test steps": |-
  1. 스코어카드 4종 값을 확인함
  2. 필요 시 모드 전환 또는 hover를 수행함
"Expected Result": |-
  - 카드 hover 시 Reach Caster 기조와 동일한 떠오름 효과가 적용됨
  - 스코어카드 강조 밑줄은 highlighted 카드에만 적용됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-047::A01`, `BO-RESULT-047::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + VISUAL_BASELINE`임. 4개 카드 각각의 영역에서 라벨·값·단위를 검사함. 동일한 숫자가 테이블에 존재한다는 이유로 스코어카드 검증을 통과시키지 않음.

- **확인 필요**: [AUTO-07](#auto-07) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5 / 변경 이력의 highlighted 카드 규칙`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-047 -->


<!-- TC-BEGIN:BO-RESULT-048 -->
<a id="bo-result-048"></a>
#### BO-RESULT-048 — 스코어카드 다크모드 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A369:N369` · 분류 `RESULT`


```yaml
"No": 368
"TC ID": "BO-RESULT-048"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/스코어카드"
"Test Case": "스코어카드 다크모드 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 검증용 allocations 데이터가 준비됨"
"Test steps": |-
  1. 스코어카드 4종 값을 확인함
  2. 필요 시 모드 전환 또는 hover를 수행함
"Expected Result": |-
  - 값/라벨/테두리 색상 대비가 다크모드에서도 유지됨
  - 스코어카드 강조 밑줄은 highlighted 카드에만 적용됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-048::A01`, `BO-RESULT-048::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + VISUAL_BASELINE`임. 4개 카드 각각의 영역에서 라벨·값·단위를 검사함. 동일한 숫자가 테이블에 존재한다는 이유로 스코어카드 검증을 통과시키지 않음.

- **확인 필요**: [AUTO-07](#auto-07) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5 / 변경 이력의 highlighted 카드 규칙`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-048 -->


### 영역: 결과 화면/Optimization Analytics 공통


<!-- TC-BEGIN:BO-RESULT-049 -->
<a id="bo-result-049"></a>
#### BO-RESULT-049 — 차트 공통 섹션 제목 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A370:N370` · 분류 `RESULT`


```yaml
"No": 369
"TC ID": "BO-RESULT-049"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Optimization Analytics 공통"
"Test Case": "차트 공통 섹션 제목 검증"
"Pre-Condition": "BO 결과 화면의 Optimization Analytics 섹션에 진입함"
"Test steps": "1. 차트 섹션을 확인하거나 토글/hover를 수행함"
"Expected Result": |-
  - Optimization Analytics 제목, 최적화 원리 알아보기, 매체/상품 토글이 동일 선상에 표시됨
  - 토글 전환 시 선택된 Response Curve 항목은 해당 뷰의 기여 1위로 초기화됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-049::A01`, `BO-RESULT-049::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + UI_BINDINGS`임. 하나의 매체/상품 토글 조작 후 4개 차트의 집계 단위를 각각 검사함. Response Curve 선택 초기화도 별도 관찰함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.1·§6.2·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-049 -->


<!-- TC-BEGIN:BO-RESULT-050 -->
<a id="bo-result-050"></a>
#### BO-RESULT-050 — 차트 공통 2×2 그리드 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A371:N371` · 분류 `RESULT`


```yaml
"No": 370
"TC ID": "BO-RESULT-050"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Optimization Analytics 공통"
"Test Case": "차트 공통 2×2 그리드 검증"
"Pre-Condition": "BO 결과 화면의 Optimization Analytics 섹션에 진입함"
"Test steps": "1. 차트 섹션을 확인하거나 토글/hover를 수행함"
"Expected Result": |-
  - Budget Share/Response Curve/Weekly Contribution/Incremental 4개 차트가 2×2로 배치됨
  - 토글 전환 시 선택된 Response Curve 항목은 해당 뷰의 기여 1위로 초기화됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-050::A01`, `BO-RESULT-050::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + UI_BINDINGS`임. 하나의 매체/상품 토글 조작 후 4개 차트의 집계 단위를 각각 검사함. Response Curve 선택 초기화도 별도 관찰함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.1·§6.2·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-050 -->


<!-- TC-BEGIN:BO-RESULT-051 -->
<a id="bo-result-051"></a>
#### BO-RESULT-051 — 차트 공통 매체 토글 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A372:N372` · 분류 `RESULT`


```yaml
"No": 371
"TC ID": "BO-RESULT-051"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Optimization Analytics 공통"
"Test Case": "차트 공통 매체 토글 검증"
"Pre-Condition": "BO 결과 화면의 Optimization Analytics 섹션에 진입함"
"Test steps": "1. 차트 섹션을 확인하거나 토글/hover를 수행함"
"Expected Result": |-
  - 토글을 매체로 선택하면 4개 차트가 매체 단위 집계로 동시 전환됨
  - 토글 전환 시 선택된 Response Curve 항목은 해당 뷰의 기여 1위로 초기화됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-051::A01`, `BO-RESULT-051::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + UI_BINDINGS`임. 하나의 매체/상품 토글 조작 후 4개 차트의 집계 단위를 각각 검사함. Response Curve 선택 초기화도 별도 관찰함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.1·§6.2·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-051 -->


<!-- TC-BEGIN:BO-RESULT-052 -->
<a id="bo-result-052"></a>
#### BO-RESULT-052 — 차트 공통 상품 토글 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A373:N373` · 분류 `RESULT`


```yaml
"No": 372
"TC ID": "BO-RESULT-052"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Optimization Analytics 공통"
"Test Case": "차트 공통 상품 토글 검증"
"Pre-Condition": "BO 결과 화면의 Optimization Analytics 섹션에 진입함"
"Test steps": "1. 차트 섹션을 확인하거나 토글/hover를 수행함"
"Expected Result": |-
  - 토글을 상품으로 선택하면 4개 차트가 매체>상품 단위로 동시 전환됨
  - 토글 전환 시 선택된 Response Curve 항목은 해당 뷰의 기여 1위로 초기화됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-052::A01`, `BO-RESULT-052::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + UI_BINDINGS`임. 하나의 매체/상품 토글 조작 후 4개 차트의 집계 단위를 각각 검사함. Response Curve 선택 초기화도 별도 관찰함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.1·§6.2·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-052 -->


<!-- TC-BEGIN:BO-RESULT-053 -->
<a id="bo-result-053"></a>
#### BO-RESULT-053 — 차트 공통 상위 5개 표시 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A374:N374` · 분류 `RESULT`


```yaml
"No": 373
"TC ID": "BO-RESULT-053"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Optimization Analytics 공통"
"Test Case": "차트 공통 상위 5개 표시 검증"
"Pre-Condition": "BO 결과 화면의 Optimization Analytics 섹션에 진입함"
"Test steps": "1. 차트 섹션을 확인하거나 토글/hover를 수행함"
"Expected Result": |-
  - 각 차트는 기여/비중 상위 5개 항목만 개별 표시함
  - 토글 전환 시 선택된 Response Curve 항목은 해당 뷰의 기여 1위로 초기화됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-053::A01`, `BO-RESULT-053::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + UI_BINDINGS`임. 하나의 매체/상품 토글 조작 후 4개 차트의 집계 단위를 각각 검사함. Response Curve 선택 초기화도 별도 관찰함.

- **확인 필요**: [AUTO-08](#auto-08), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.1·§6.2·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-053 -->


<!-- TC-BEGIN:BO-RESULT-054 -->
<a id="bo-result-054"></a>
#### BO-RESULT-054 — 차트 공통 데이터 호버 툴팁 숫자 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A375:N375` · 분류 `RESULT`


```yaml
"No": 374
"TC ID": "BO-RESULT-054"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Optimization Analytics 공통"
"Test Case": "차트 공통 데이터 호버 툴팁 숫자 검증"
"Pre-Condition": "BO 결과 화면의 Optimization Analytics 섹션에 진입함"
"Test steps": "1. 차트 섹션을 확인하거나 토글/hover를 수행함"
"Expected Result": |-
  - 차트 요소 hover 시 값이 전체 숫자(천 단위 콤마)로 표시됨
  - 토글 전환 시 선택된 Response Curve 항목은 해당 뷰의 기여 1위로 초기화됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-054::A01`, `BO-RESULT-054::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + UI_BINDINGS`임. 하나의 매체/상품 토글 조작 후 4개 차트의 집계 단위를 각각 검사함. Response Curve 선택 초기화도 별도 관찰함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.1·§6.2·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-054 -->


<!-- TC-BEGIN:BO-RESULT-055 -->
<a id="bo-result-055"></a>
#### BO-RESULT-055 — 차트 공통 축 틱 축약 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A376:N376` · 분류 `RESULT`


```yaml
"No": 375
"TC ID": "BO-RESULT-055"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Optimization Analytics 공통"
"Test Case": "차트 공통 축 틱 축약 검증"
"Pre-Condition": "BO 결과 화면의 Optimization Analytics 섹션에 진입함"
"Test steps": "1. 차트 섹션을 확인하거나 토글/hover를 수행함"
"Expected Result": |-
  - 축 tick 라벨은 억/천만/만 등 축약 표기가 허용됨
  - 토글 전환 시 선택된 Response Curve 항목은 해당 뷰의 기여 1위로 초기화됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-055::A01`, `BO-RESULT-055::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + UI_BINDINGS`임. 하나의 매체/상품 토글 조작 후 4개 차트의 집계 단위를 각각 검사함. Response Curve 선택 초기화도 별도 관찰함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.1·§6.2·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-055 -->


<!-- TC-BEGIN:BO-RESULT-056 -->
<a id="bo-result-056"></a>
#### BO-RESULT-056 — 차트 공통 Info 툴팁 구분 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A377:N377` · 분류 `RESULT`


```yaml
"No": 376
"TC ID": "BO-RESULT-056"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Optimization Analytics 공통"
"Test Case": "차트 공통 Info 툴팁 구분 검증"
"Pre-Condition": "BO 결과 화면의 Optimization Analytics 섹션에 진입함"
"Test steps": "1. 차트 섹션을 확인하거나 토글/hover를 수행함"
"Expected Result": |-
  - 차트 제목 옆 Info hover는 해석 방법, 차트 요소 hover는 데이터 값을 표시함
  - 토글 전환 시 선택된 Response Curve 항목은 해당 뷰의 기여 1위로 초기화됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-056::A01`, `BO-RESULT-056::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + UI_BINDINGS`임. 하나의 매체/상품 토글 조작 후 4개 차트의 집계 단위를 각각 검사함. Response Curve 선택 초기화도 별도 관찰함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.1·§6.2·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-056 -->


### 영역: 결과 화면/차트 Budget Share


<!-- TC-BEGIN:BO-RESULT-057 -->
<a id="bo-result-057"></a>
#### BO-RESULT-057 — Budget Share 차트 형태 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A378:N378` · 분류 `RESULT`


```yaml
"No": 377
"TC ID": "BO-RESULT-057"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Budget Share"
"Test Case": "Budget Share 차트 형태 검증"
"Pre-Condition": "예산 배분 항목이 6개 이상인 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Share 차트를 확인함
  2. 매체/상품 토글과 Info hover를 수행함
"Expected Result": |-
  - 단일 100% Stacked Bar로 표시됨
  - 차트 부제는 '매체·상품별 예산 배분 비중'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-057::A01`, `BO-RESULT-057::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + DATA_CONTRACT + VISUAL_BASELINE`임. 5개 이하/6개 이상과 0원 항목 fixture를 구분함. 화면 구간과 실제 예산 비중을 대조하고 Others는 상위 5개 외 항목의 합으로 검사함.

- **대조 문서**: `§6.3·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-057 -->


<!-- TC-BEGIN:BO-RESULT-058 -->
<a id="bo-result-058"></a>
#### BO-RESULT-058 — Budget Share 상위 5개 + Others 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A379:N379` · 분류 `RESULT`


```yaml
"No": 378
"TC ID": "BO-RESULT-058"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Budget Share"
"Test Case": "Budget Share 상위 5개 + Others 검증"
"Pre-Condition": "예산 배분 항목이 6개 이상인 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Share 차트를 확인함
  2. 매체/상품 토글과 Info hover를 수행함
"Expected Result": |-
  - 예산 비중 상위 5개를 개별 표시하고 나머지는 Others로 합산됨
  - 차트 부제는 '매체·상품별 예산 배분 비중'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-058::A01`, `BO-RESULT-058::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + DATA_CONTRACT + VISUAL_BASELINE`임. 5개 이하/6개 이상과 0원 항목 fixture를 구분함. 화면 구간과 실제 예산 비중을 대조하고 Others는 상위 5개 외 항목의 합으로 검사함.

- **확인 필요**: [AUTO-08](#auto-08) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.3·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-058 -->


<!-- TC-BEGIN:BO-RESULT-059 -->
<a id="bo-result-059"></a>
#### BO-RESULT-059 — Budget Share 비중 1위 강조 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A380:N380` · 분류 `RESULT`


```yaml
"No": 379
"TC ID": "BO-RESULT-059"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Budget Share"
"Test Case": "Budget Share 비중 1위 강조 검증"
"Pre-Condition": "예산 배분 항목이 6개 이상인 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Share 차트를 확인함
  2. 매체/상품 토글과 Info hover를 수행함
"Expected Result": |-
  - 비중 1위만 강조색, 나머지는 무채색 opacity 단계로 표시됨
  - 차트 부제는 '매체·상품별 예산 배분 비중'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-059::A01`, `BO-RESULT-059::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + DATA_CONTRACT + VISUAL_BASELINE`임. 5개 이하/6개 이상과 0원 항목 fixture를 구분함. 화면 구간과 실제 예산 비중을 대조하고 Others는 상위 5개 외 항목의 합으로 검사함.

- **확인 필요**: [AUTO-07](#auto-07) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.3·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-059 -->


<!-- TC-BEGIN:BO-RESULT-060 -->
<a id="bo-result-060"></a>
#### BO-RESULT-060 — Budget Share 매체 뷰 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A381:N381` · 분류 `RESULT`


```yaml
"No": 380
"TC ID": "BO-RESULT-060"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Budget Share"
"Test Case": "Budget Share 매체 뷰 검증"
"Pre-Condition": "예산 배분 항목이 6개 이상인 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Share 차트를 확인함
  2. 매체/상품 토글과 Info hover를 수행함
"Expected Result": |-
  - 매체별 예산 비중으로 분할됨
  - 차트 부제는 '매체·상품별 예산 배분 비중'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-060::A01`, `BO-RESULT-060::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + DATA_CONTRACT + VISUAL_BASELINE`임. 5개 이하/6개 이상과 0원 항목 fixture를 구분함. 화면 구간과 실제 예산 비중을 대조하고 Others는 상위 5개 외 항목의 합으로 검사함.

- **대조 문서**: `§6.3·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-060 -->


<!-- TC-BEGIN:BO-RESULT-061 -->
<a id="bo-result-061"></a>
#### BO-RESULT-061 — Budget Share 상품 뷰 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A382:N382` · 분류 `RESULT`


```yaml
"No": 381
"TC ID": "BO-RESULT-061"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Budget Share"
"Test Case": "Budget Share 상품 뷰 검증"
"Pre-Condition": "예산 배분 항목이 6개 이상인 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Share 차트를 확인함
  2. 매체/상품 토글과 Info hover를 수행함
"Expected Result": |-
  - 상품별 예산 비중으로 분할됨
  - 차트 부제는 '매체·상품별 예산 배분 비중'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-061::A01`, `BO-RESULT-061::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + DATA_CONTRACT + VISUAL_BASELINE`임. 5개 이하/6개 이상과 0원 항목 fixture를 구분함. 화면 구간과 실제 예산 비중을 대조하고 Others는 상위 5개 외 항목의 합으로 검사함.

- **대조 문서**: `§6.3·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-061 -->


<!-- TC-BEGIN:BO-RESULT-062 -->
<a id="bo-result-062"></a>
#### BO-RESULT-062 — Budget Share 합계 100% 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A383:N383` · 분류 `RESULT`


```yaml
"No": 382
"TC ID": "BO-RESULT-062"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Budget Share"
"Test Case": "Budget Share 합계 100% 검증"
"Pre-Condition": "예산 배분 항목이 6개 이상인 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Share 차트를 확인함
  2. 매체/상품 토글과 Info hover를 수행함
"Expected Result": |-
  - 개별 비중과 Others 합계가 100.00%로 표시됨
  - 차트 부제는 '매체·상품별 예산 배분 비중'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-062::A01`, `BO-RESULT-062::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + DATA_CONTRACT + VISUAL_BASELINE`임. 5개 이하/6개 이상과 0원 항목 fixture를 구분함. 화면 구간과 실제 예산 비중을 대조하고 Others는 상위 5개 외 항목의 합으로 검사함.

- **확인 필요**: [AUTO-08](#auto-08) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.3·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-062 -->


<!-- TC-BEGIN:BO-RESULT-063 -->
<a id="bo-result-063"></a>
#### BO-RESULT-063 — Budget Share 0원 항목 제외/표시 정책 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A384:N384` · 분류 `RESULT`


```yaml
"No": 383
"TC ID": "BO-RESULT-063"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Budget Share"
"Test Case": "Budget Share 0원 항목 제외/표시 정책 검증"
"Pre-Condition": "예산 배분 항목이 6개 이상인 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Share 차트를 확인함
  2. 매체/상품 토글과 Info hover를 수행함
"Expected Result": |-
  - 0원 항목은 비중 0 또는 차트 제외 정책에 따라 왜곡 없이 처리됨
  - 차트 부제는 '매체·상품별 예산 배분 비중'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-063::A01`, `BO-RESULT-063::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + DATA_CONTRACT + VISUAL_BASELINE`임. 5개 이하/6개 이상과 0원 항목 fixture를 구분함. 화면 구간과 실제 예산 비중을 대조하고 Others는 상위 5개 외 항목의 합으로 검사함.

- **확인 필요**: [AUTO-08](#auto-08) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.3·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-063 -->


<!-- TC-BEGIN:BO-RESULT-064 -->
<a id="bo-result-064"></a>
#### BO-RESULT-064 — Budget Share Info 툴팁 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A385:N385` · 분류 `RESULT`


```yaml
"No": 384
"TC ID": "BO-RESULT-064"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Budget Share"
"Test Case": "Budget Share Info 툴팁 검증"
"Pre-Condition": "예산 배분 항목이 6개 이상인 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Share 차트를 확인함
  2. 매체/상품 토글과 Info hover를 수행함
"Expected Result": |-
  - 상위 5개와 Others 합산 안내 문구가 표시됨
  - 차트 부제는 '매체·상품별 예산 배분 비중'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-064::A01`, `BO-RESULT-064::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + DATA_CONTRACT + VISUAL_BASELINE`임. 5개 이하/6개 이상과 0원 항목 fixture를 구분함. 화면 구간과 실제 예산 비중을 대조하고 Others는 상위 5개 외 항목의 합으로 검사함.

- **대조 문서**: `§6.3·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-064 -->


### 영역: 결과 화면/차트 Response Curve


<!-- TC-BEGIN:BO-RESULT-065 -->
<a id="bo-result-065"></a>
#### BO-RESULT-065 — Response Curve 기본 항목 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A386:N386` · 분류 `RESULT`


```yaml
"No": 385
"TC ID": "BO-RESULT-065"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve 기본 항목 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - 기여(kpiValue) 1위 항목이 기본 선택됨
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-065::A01`, `BO-RESULT-065::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-065 -->


<!-- TC-BEGIN:BO-RESULT-066 -->
<a id="bo-result-066"></a>
#### BO-RESULT-066 — Response Curve 드롭다운 목록 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A387:N387` · 분류 `RESULT`


```yaml
"No": 386
"TC ID": "BO-RESULT-066"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve 드롭다운 목록 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - 우측 항목명 클릭 시 기여 상위 5개 목록이 펼쳐짐
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-066::A01`, `BO-RESULT-066::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-066 -->


<!-- TC-BEGIN:BO-RESULT-067 -->
<a id="bo-result-067"></a>
#### BO-RESULT-067 — Response Curve 항목 전환 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A388:N388` · 분류 `RESULT`


```yaml
"No": 387
"TC ID": "BO-RESULT-067"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve 항목 전환 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - 드롭다운에서 다른 항목 선택 시 해당 항목의 단일 곡선으로 전환됨
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-067::A01`, `BO-RESULT-067::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-067 -->


<!-- TC-BEGIN:BO-RESULT-068 -->
<a id="bo-result-068"></a>
#### BO-RESULT-068 — Response Curve 단일 곡선 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A389:N389` · 분류 `RESULT`


```yaml
"No": 388
"TC ID": "BO-RESULT-068"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve 단일 곡선 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - 한 번에 한 매체 또는 상품의 단일 곡선만 표시됨
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-068::A01`, `BO-RESULT-068::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-068 -->


<!-- TC-BEGIN:BO-RESULT-069 -->
<a id="bo-result-069"></a>
#### BO-RESULT-069 — Response Curve X축 스케일 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A390:N390` · 분류 `RESULT`


```yaml
"No": 389
"TC ID": "BO-RESULT-069"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve X축 스케일 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - 선택 항목의 예산 스케일 기준으로 X축이 표시됨
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-069::A01`, `BO-RESULT-069::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **확인 필요**: [AUTO-05](#auto-05) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-069 -->


<!-- TC-BEGIN:BO-RESULT-070 -->
<a id="bo-result-070"></a>
#### BO-RESULT-070 — Response Curve 포화 함수 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A391:N391` · 분류 `RESULT`


```yaml
"No": 390
"TC ID": "BO-RESULT-070"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve 포화 함수 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - 곡선이 오버슈팅/꺾임 없이 포화 형태로 증가함
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-070::A01`, `BO-RESULT-070::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **확인 필요**: [AUTO-05](#auto-05), [AUTO-07](#auto-07) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-070 -->


<!-- TC-BEGIN:BO-RESULT-071 -->
<a id="bo-result-071"></a>
#### BO-RESULT-071 — Response Curve Current spend 마커 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A392:N392` · 분류 `RESULT`


```yaml
"No": 391
"TC ID": "BO-RESULT-071"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve Current spend 마커 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - 현재 배분 예산 지점에 시그니처 그린 점 1개가 표시됨
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-071::A01`, `BO-RESULT-071::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **개별 주의**: 그린 점의 x좌표는 선택 항목의 배분 예산을 기준으로 검사함. y좌표의 진실 공급원은 AUTO-05 확인 항목임.

- **확인 필요**: [AUTO-05](#auto-05) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-071 -->


<!-- TC-BEGIN:BO-RESULT-072 -->
<a id="bo-result-072"></a>
#### BO-RESULT-072 — Response Curve 실선/점선 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A393:N393` · 분류 `RESULT`


```yaml
"No": 392
"TC ID": "BO-RESULT-072"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve 실선/점선 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - Current spend 좌측은 실선, 우측은 점선으로 분리됨
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-072::A01`, `BO-RESULT-072::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **확인 필요**: [AUTO-05](#auto-05) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-072 -->


<!-- TC-BEGIN:BO-RESULT-073 -->
<a id="bo-result-073"></a>
#### BO-RESULT-073 — Response Curve 경계점 연결 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A394:N394` · 분류 `RESULT`


```yaml
"No": 393
"TC ID": "BO-RESULT-073"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve 경계점 연결 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - 실선과 점선 경계가 끊기지 않음
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-073::A01`, `BO-RESULT-073::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **확인 필요**: [AUTO-05](#auto-05) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-073 -->


<!-- TC-BEGIN:BO-RESULT-074 -->
<a id="bo-result-074"></a>
#### BO-RESULT-074 — Response Curve 의미 범례 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A395:N395` · 분류 `RESULT`


```yaml
"No": 394
"TC ID": "BO-RESULT-074"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve 의미 범례 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - 배정 예산까지=실선 / 예산 추가 시=점선 / Current spend=그린 점 범례가 표시됨
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-074::A01`, `BO-RESULT-074::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-074 -->


<!-- TC-BEGIN:BO-RESULT-075 -->
<a id="bo-result-075"></a>
#### BO-RESULT-075 — Response Curve 토글 전환 초기화 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A396:N396` · 분류 `RESULT`


```yaml
"No": 395
"TC ID": "BO-RESULT-075"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve 토글 전환 초기화 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - 매체/상품 토글 전환 시 드롭다운 목록이 변경되고 기여 1위로 초기화됨
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-075::A01`, `BO-RESULT-075::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-075 -->


<!-- TC-BEGIN:BO-RESULT-076 -->
<a id="bo-result-076"></a>
#### BO-RESULT-076 — Response Curve Info 툴팁 문구 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A397:N397` · 분류 `RESULT`


```yaml
"No": 396
"TC ID": "BO-RESULT-076"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve Info 툴팁 문구 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - 매체별 예산 투입 대비 KPI 반응 곡선과 Current Spend 설명이 표시됨
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-076::A01`, `BO-RESULT-076::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-076 -->


<!-- TC-BEGIN:BO-RESULT-077 -->
<a id="bo-result-077"></a>
#### BO-RESULT-077 — Response Curve 집행 완료 오해 방지 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A398:N398` · 분류 `RESULT`


```yaml
"No": 397
"TC ID": "BO-RESULT-077"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve 집행 완료 오해 방지 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - '이미 투입/현재까지 투입' 표현이 없고 배정/배분 기준 표현이 사용됨
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-077::A01`, `BO-RESULT-077::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-077 -->


<!-- TC-BEGIN:BO-RESULT-078 -->
<a id="bo-result-078"></a>
#### BO-RESULT-078 — Response Curve CI 밴드 미표시 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A399:N399` · 분류 `RESULT`


```yaml
"No": 398
"TC ID": "BO-RESULT-078"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Response Curve"
"Test Case": "Response Curve CI 밴드 미표시 검증"
"Pre-Condition": "Response Curve 데이터와 기여 상위 5개 항목이 존재함"
"Test steps": |-
  1. Response Curve 차트를 확인함
  2. 드롭다운/토글/Info hover를 조작함
"Expected Result": |-
  - 신뢰구간 데이터 부재 시 임의 밴드가 표시되지 않음
  - 차트 부제는 '예산 투입 대비 보장 {KPI} 반응'으로 KPI에 맞게 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-078::A01`, `BO-RESULT-078::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `CHART_FIXTURES + CURVE_CONTRACT + UI_BINDINGS`임. 단일 논리 곡선을 실선/점선으로 나누는 구조임. SVG path 개수를 1개로 강제하지 않음. 선택 항목·마커·축 범위·범례를 독립 검사함.

- **개별 주의**: 실제 CI 데이터가 없는 fixture를 사용함. 임의 ±%로 만든 밴드가 없음을 확인하며 CI가 확보된 미래 버전까지 영구 미표시로 고정하지 않음.

- **대조 문서**: `§6.4·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-078 -->


### 영역: 결과 화면/차트 Weekly Contribution


<!-- TC-BEGIN:BO-RESULT-079 -->
<a id="bo-result-079"></a>
#### BO-RESULT-079 — Weekly Contribution 차트 형태 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A400:N400` · 분류 `RESULT`


```yaml
"No": 399
"TC ID": "BO-RESULT-079"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Weekly Contribution"
"Test Case": "Weekly Contribution 차트 형태 검증"
"Pre-Condition": "업종 모델 주간 시계열 데이터가 존재함"
"Test steps": |-
  1. Weekly Contribution 차트를 확인함
  2. 기간 토글과 Info hover를 수행함
"Expected Result": |-
  - 누적 영역(monotone 곡선)으로 표시됨
  - 부제는 '업종 모델이 학습한 주차별 매체(또는 상품) 기여 패턴'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-079::A01`, `BO-RESULT-079::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WEEKLY_FIXTURE + DATA_CONTRACT`임. 52주/104주는 데이터 포인트 수 기준임. 화면에 생략된 축 눈금 수로 판정하지 않음. 업종 학습 시계열과 전년·전전년 동기간을 기준으로 검사함.

- **대조 문서**: `§6.5·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-079 -->


<!-- TC-BEGIN:BO-RESULT-080 -->
<a id="bo-result-080"></a>
#### BO-RESULT-080 — Weekly Contribution 최근 1년 토글 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A401:N401` · 분류 `RESULT`


```yaml
"No": 400
"TC ID": "BO-RESULT-080"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Weekly Contribution"
"Test Case": "Weekly Contribution 최근 1년 토글 검증"
"Pre-Condition": "업종 모델 주간 시계열 데이터가 존재함"
"Test steps": |-
  1. Weekly Contribution 차트를 확인함
  2. 기간 토글과 Info hover를 수행함
"Expected Result": |-
  - 최근 1년 선택 시 52주 데이터가 표시됨
  - 부제는 '업종 모델이 학습한 주차별 매체(또는 상품) 기여 패턴'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-080::A01`, `BO-RESULT-080::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WEEKLY_FIXTURE + DATA_CONTRACT`임. 52주/104주는 데이터 포인트 수 기준임. 화면에 생략된 축 눈금 수로 판정하지 않음. 업종 학습 시계열과 전년·전전년 동기간을 기준으로 검사함.

- **대조 문서**: `§6.5·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-080 -->


<!-- TC-BEGIN:BO-RESULT-081 -->
<a id="bo-result-081"></a>
#### BO-RESULT-081 — Weekly Contribution 최근 2년 토글 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A402:N402` · 분류 `RESULT`


```yaml
"No": 401
"TC ID": "BO-RESULT-081"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Weekly Contribution"
"Test Case": "Weekly Contribution 최근 2년 토글 검증"
"Pre-Condition": "업종 모델 주간 시계열 데이터가 존재함"
"Test steps": |-
  1. Weekly Contribution 차트를 확인함
  2. 기간 토글과 Info hover를 수행함
"Expected Result": |-
  - 최근 2년 선택 시 104주 데이터가 표시됨
  - 부제는 '업종 모델이 학습한 주차별 매체(또는 상품) 기여 패턴'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-081::A01`, `BO-RESULT-081::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WEEKLY_FIXTURE + DATA_CONTRACT`임. 52주/104주는 데이터 포인트 수 기준임. 화면에 생략된 축 눈금 수로 판정하지 않음. 업종 학습 시계열과 전년·전전년 동기간을 기준으로 검사함.

- **대조 문서**: `§6.5·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-081 -->


<!-- TC-BEGIN:BO-RESULT-082 -->
<a id="bo-result-082"></a>
#### BO-RESULT-082 — Weekly Contribution 동기간 음영 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A403:N403` · 분류 `RESULT`


```yaml
"No": 402
"TC ID": "BO-RESULT-082"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Weekly Contribution"
"Test Case": "Weekly Contribution 동기간 음영 검증"
"Pre-Condition": "업종 모델 주간 시계열 데이터가 존재함"
"Test steps": |-
  1. Weekly Contribution 차트를 확인함
  2. 기간 토글과 Info hover를 수행함
"Expected Result": |-
  - 내 캠페인 기간의 전년/전전년 동기간이 보라색 음영과 라벨로 표시됨
  - 부제는 '업종 모델이 학습한 주차별 매체(또는 상품) 기여 패턴'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-082::A01`, `BO-RESULT-082::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WEEKLY_FIXTURE + DATA_CONTRACT`임. 52주/104주는 데이터 포인트 수 기준임. 화면에 생략된 축 눈금 수로 판정하지 않음. 업종 학습 시계열과 전년·전전년 동기간을 기준으로 검사함.

- **대조 문서**: `§6.5·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-082 -->


<!-- TC-BEGIN:BO-RESULT-083 -->
<a id="bo-result-083"></a>
#### BO-RESULT-083 — Weekly Contribution 음영 클램프 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A404:N404` · 분류 `RESULT`


```yaml
"No": 403
"TC ID": "BO-RESULT-083"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Weekly Contribution"
"Test Case": "Weekly Contribution 음영 클램프 검증"
"Pre-Condition": "업종 모델 주간 시계열 데이터가 존재함"
"Test steps": |-
  1. Weekly Contribution 차트를 확인함
  2. 기간 토글과 Info hover를 수행함
"Expected Result": |-
  - 표시 구간과 겹치는 부분만 음영이 표시됨
  - 부제는 '업종 모델이 학습한 주차별 매체(또는 상품) 기여 패턴'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-083::A01`, `BO-RESULT-083::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WEEKLY_FIXTURE + DATA_CONTRACT`임. 52주/104주는 데이터 포인트 수 기준임. 화면에 생략된 축 눈금 수로 판정하지 않음. 업종 학습 시계열과 전년·전전년 동기간을 기준으로 검사함.

- **대조 문서**: `§6.5·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-083 -->


<!-- TC-BEGIN:BO-RESULT-084 -->
<a id="bo-result-084"></a>
#### BO-RESULT-084 — Weekly Contribution 상위 5개 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A405:N405` · 분류 `RESULT`


```yaml
"No": 404
"TC ID": "BO-RESULT-084"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Weekly Contribution"
"Test Case": "Weekly Contribution 상위 5개 검증"
"Pre-Condition": "업종 모델 주간 시계열 데이터가 존재함"
"Test steps": |-
  1. Weekly Contribution 차트를 확인함
  2. 기간 토글과 Info hover를 수행함
"Expected Result": |-
  - 기여 상위 5개 매체/상품만 표시됨
  - 부제는 '업종 모델이 학습한 주차별 매체(또는 상품) 기여 패턴'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-084::A01`, `BO-RESULT-084::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WEEKLY_FIXTURE + DATA_CONTRACT`임. 52주/104주는 데이터 포인트 수 기준임. 화면에 생략된 축 눈금 수로 판정하지 않음. 업종 학습 시계열과 전년·전전년 동기간을 기준으로 검사함.

- **확인 필요**: [AUTO-08](#auto-08) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.5·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-084 -->


<!-- TC-BEGIN:BO-RESULT-085 -->
<a id="bo-result-085"></a>
#### BO-RESULT-085 — Weekly Contribution Info 툴팁 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A406:N406` · 분류 `RESULT`


```yaml
"No": 405
"TC ID": "BO-RESULT-085"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Weekly Contribution"
"Test Case": "Weekly Contribution Info 툴팁 검증"
"Pre-Condition": "업종 모델 주간 시계열 데이터가 존재함"
"Test steps": |-
  1. Weekly Contribution 차트를 확인함
  2. 기간 토글과 Info hover를 수행함
"Expected Result": |-
  - 이 시나리오의 미래 예측이 아니라 업종 모델이 학습한 과거 기여 패턴이라는 문구가 표시됨
  - 부제는 '업종 모델이 학습한 주차별 매체(또는 상품) 기여 패턴'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-085::A01`, `BO-RESULT-085::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WEEKLY_FIXTURE + DATA_CONTRACT`임. 52주/104주는 데이터 포인트 수 기준임. 화면에 생략된 축 눈금 수로 판정하지 않음. 업종 학습 시계열과 전년·전전년 동기간을 기준으로 검사함.

- **대조 문서**: `§6.5·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-085 -->


<!-- TC-BEGIN:BO-RESULT-086 -->
<a id="bo-result-086"></a>
#### BO-RESULT-086 — Weekly Contribution 미래 예측 오해 문구 없음 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A407:N407` · 분류 `RESULT`


```yaml
"No": 406
"TC ID": "BO-RESULT-086"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Weekly Contribution"
"Test Case": "Weekly Contribution 미래 예측 오해 문구 없음 검증"
"Pre-Condition": "업종 모델 주간 시계열 데이터가 존재함"
"Test steps": |-
  1. Weekly Contribution 차트를 확인함
  2. 기간 토글과 Info hover를 수행함
"Expected Result": |-
  - 캠페인 종료 후 잔존 효과 추정 등의 문구가 표시되지 않음
  - 부제는 '업종 모델이 학습한 주차별 매체(또는 상품) 기여 패턴'으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-086::A01`, `BO-RESULT-086::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WEEKLY_FIXTURE + DATA_CONTRACT`임. 52주/104주는 데이터 포인트 수 기준임. 화면에 생략된 축 눈금 수로 판정하지 않음. 업종 학습 시계열과 전년·전전년 동기간을 기준으로 검사함.

- **대조 문서**: `§6.5·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-086 -->


### 영역: 결과 화면/차트 Incremental


<!-- TC-BEGIN:BO-RESULT-087 -->
<a id="bo-result-087"></a>
#### BO-RESULT-087 — Incremental 워터폴 구조 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A408:N408` · 분류 `RESULT`


```yaml
"No": 407
"TC ID": "BO-RESULT-087"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Incremental"
"Test Case": "Incremental 워터폴 구조 검증"
"Pre-Condition": "균등 배분 대비 증감 데이터가 포함된 BO 결과가 존재함"
"Test steps": |-
  1. Incremental 차트를 확인함
  2. 데이터 hover와 Info hover를 수행함
"Expected Result": |-
  - 균등 배분 → 채널별 증감 → 최적화 순서의 워터폴로 표시됨
  - 영문 차트명은 선택 KPI에 따라 Incremental {KPIEn}으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-087::A01`, `BO-RESULT-087::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WATERFALL_FIXTURES + AXIS_BREAK_CONTRACT + VISUAL_BASELINE`임. 균등 기준·채널별 delta·최종값을 별도로 대조함. 양수/음수와 절단/미절단 분기를 분리하고 감소 막대의 잘림 여부를 관찰함.

- **확인 필요**: [AUTO-08](#auto-08) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.6·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-087 -->


<!-- TC-BEGIN:BO-RESULT-088 -->
<a id="bo-result-088"></a>
#### BO-RESULT-088 — Incremental 막대 색상 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A409:N409` · 분류 `RESULT`


```yaml
"No": 408
"TC ID": "BO-RESULT-088"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Incremental"
"Test Case": "Incremental 막대 색상 검증"
"Pre-Condition": "균등 배분 대비 증감 데이터가 포함된 BO 결과가 존재함"
"Test steps": |-
  1. Incremental 차트를 확인함
  2. 데이터 hover와 Info hover를 수행함
"Expected Result": |-
  - 최적화=강조색, 균등 배분=진한 무채색, 증감=흐린 무채색으로 표시됨
  - 영문 차트명은 선택 KPI에 따라 Incremental {KPIEn}으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-088::A01`, `BO-RESULT-088::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WATERFALL_FIXTURES + AXIS_BREAK_CONTRACT + VISUAL_BASELINE`임. 균등 기준·채널별 delta·최종값을 별도로 대조함. 양수/음수와 절단/미절단 분기를 분리하고 감소 막대의 잘림 여부를 관찰함.

- **확인 필요**: [AUTO-07](#auto-07) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.6·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-088 -->


<!-- TC-BEGIN:BO-RESULT-089 -->
<a id="bo-result-089"></a>
#### BO-RESULT-089 — Incremental 증가 라벨 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A410:N410` · 분류 `RESULT`


```yaml
"No": 409
"TC ID": "BO-RESULT-089"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Incremental"
"Test Case": "Incremental 증가 라벨 검증"
"Pre-Condition": "균등 배분 대비 증감 데이터가 포함된 BO 결과가 존재함"
"Test steps": |-
  1. Incremental 차트를 확인함
  2. 데이터 hover와 Info hover를 수행함
"Expected Result": |-
  - 증가 delta 값은 +와 초록색으로 표시됨
  - 영문 차트명은 선택 KPI에 따라 Incremental {KPIEn}으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-089::A01`, `BO-RESULT-089::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WATERFALL_FIXTURES + AXIS_BREAK_CONTRACT + VISUAL_BASELINE`임. 균등 기준·채널별 delta·최종값을 별도로 대조함. 양수/음수와 절단/미절단 분기를 분리하고 감소 막대의 잘림 여부를 관찰함.

- **대조 문서**: `§6.6·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-089 -->


<!-- TC-BEGIN:BO-RESULT-090 -->
<a id="bo-result-090"></a>
#### BO-RESULT-090 — Incremental 감소 라벨 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A411:N411` · 분류 `RESULT`


```yaml
"No": 410
"TC ID": "BO-RESULT-090"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Incremental"
"Test Case": "Incremental 감소 라벨 검증"
"Pre-Condition": "균등 배분 대비 증감 데이터가 포함된 BO 결과가 존재함"
"Test steps": |-
  1. Incremental 차트를 확인함
  2. 데이터 hover와 Info hover를 수행함
"Expected Result": |-
  - 감소 delta 값은 −와 빨강색으로 표시됨
  - 영문 차트명은 선택 KPI에 따라 Incremental {KPIEn}으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-090::A01`, `BO-RESULT-090::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WATERFALL_FIXTURES + AXIS_BREAK_CONTRACT + VISUAL_BASELINE`임. 균등 기준·채널별 delta·최종값을 별도로 대조함. 양수/음수와 절단/미절단 분기를 분리하고 감소 막대의 잘림 여부를 관찰함.

- **대조 문서**: `§6.6·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-090 -->


<!-- TC-BEGIN:BO-RESULT-091 -->
<a id="bo-result-091"></a>
#### BO-RESULT-091 — Incremental 연결선 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A412:N412` · 분류 `RESULT`


```yaml
"No": 411
"TC ID": "BO-RESULT-091"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Incremental"
"Test Case": "Incremental 연결선 검증"
"Pre-Condition": "균등 배분 대비 증감 데이터가 포함된 BO 결과가 존재함"
"Test steps": |-
  1. Incremental 차트를 확인함
  2. 데이터 hover와 Info hover를 수행함
"Expected Result": |-
  - 이전 막대 누적 상단과 다음 막대가 점선 연결선으로 이어짐
  - 영문 차트명은 선택 KPI에 따라 Incremental {KPIEn}으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-091::A01`, `BO-RESULT-091::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WATERFALL_FIXTURES + AXIS_BREAK_CONTRACT + VISUAL_BASELINE`임. 균등 기준·채널별 delta·최종값을 별도로 대조함. 양수/음수와 절단/미절단 분기를 분리하고 감소 막대의 잘림 여부를 관찰함.

- **대조 문서**: `§6.6·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-091 -->


<!-- TC-BEGIN:BO-RESULT-092 -->
<a id="bo-result-092"></a>
#### BO-RESULT-092 — Incremental 긴 항목명 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A413:N413` · 분류 `RESULT`


```yaml
"No": 412
"TC ID": "BO-RESULT-092"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Incremental"
"Test Case": "Incremental 긴 항목명 검증"
"Pre-Condition": "균등 배분 대비 증감 데이터가 포함된 BO 결과가 존재함"
"Test steps": |-
  1. Incremental 차트를 확인함
  2. 데이터 hover와 Info hover를 수행함
"Expected Result": |-
  - 항목명이 한 줄 10자·최대 2줄 말줄임 처리되고 전체명은 툴팁으로 확인 가능함
  - 영문 차트명은 선택 KPI에 따라 Incremental {KPIEn}으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-092::A01`, `BO-RESULT-092::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WATERFALL_FIXTURES + AXIS_BREAK_CONTRACT + VISUAL_BASELINE`임. 균등 기준·채널별 delta·최종값을 별도로 대조함. 양수/음수와 절단/미절단 분기를 분리하고 감소 막대의 잘림 여부를 관찰함.

- **개별 주의**: 긴 항목명은 원문 기준 한 줄 10자·최대 2줄임. 전체 문자열은 해당 항목의 툴팁에서 검사함. 문자열 길이 계산 방식과 줄바꿈 기준이 모호하면 승인 구현 기준을 확인함.

- **대조 문서**: `§6.6·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-092 -->


<!-- TC-BEGIN:BO-RESULT-093 -->
<a id="bo-result-093"></a>
#### BO-RESULT-093 — Incremental Y축 절단 발생 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A414:N414` · 분류 `RESULT`


```yaml
"No": 413
"TC ID": "BO-RESULT-093"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Incremental"
"Test Case": "Incremental Y축 절단 발생 검증"
"Pre-Condition": "균등 배분 대비 증감 데이터가 포함된 BO 결과가 존재함"
"Test steps": |-
  1. Incremental 차트를 확인함
  2. 데이터 hover와 Info hover를 수행함
"Expected Result": |-
  - 균등/최적화 총량이 크고 변화 구간이 작으면 Y축이 0이 아닌 지점에서 시작하고 안내 문구가 표시됨
  - 영문 차트명은 선택 KPI에 따라 Incremental {KPIEn}으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-093::A01`, `BO-RESULT-093::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WATERFALL_FIXTURES + AXIS_BREAK_CONTRACT + VISUAL_BASELINE`임. 균등 기준·채널별 delta·최종값을 별도로 대조함. 양수/음수와 절단/미절단 분기를 분리하고 감소 막대의 잘림 여부를 관찰함.

- **개별 주의**: 절단 시 안내 원문은 “· 변화 구간을 강조하기 위해 Y축 하단을 생략했습니다.”임. 임계값은 AXIS_BREAK_CONTRACT로 바인딩함.

- **확인 필요**: [AUTO-06](#auto-06) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.6·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-093 -->


<!-- TC-BEGIN:BO-RESULT-094 -->
<a id="bo-result-094"></a>
#### BO-RESULT-094 — Incremental Y축 미절단 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A415:N415` · 분류 `RESULT`


```yaml
"No": 414
"TC ID": "BO-RESULT-094"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Incremental"
"Test Case": "Incremental Y축 미절단 검증"
"Pre-Condition": "균등 배분 대비 증감 데이터가 포함된 BO 결과가 존재함"
"Test steps": |-
  1. Incremental 차트를 확인함
  2. 데이터 hover와 Info hover를 수행함
"Expected Result": |-
  - 변화 구간이 충분히 크면 Y축이 0부터 시작하고 안내 문구가 표시되지 않음
  - 영문 차트명은 선택 KPI에 따라 Incremental {KPIEn}으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-094::A01`, `BO-RESULT-094::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WATERFALL_FIXTURES + AXIS_BREAK_CONTRACT + VISUAL_BASELINE`임. 균등 기준·채널별 delta·최종값을 별도로 대조함. 양수/음수와 절단/미절단 분기를 분리하고 감소 막대의 잘림 여부를 관찰함.

- **개별 주의**: 동일 차트에서 미절단 fixture로 전환했을 때 하단 생략 안내가 제거되는지도 검사함.

- **확인 필요**: [AUTO-06](#auto-06) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.6·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-094 -->


<!-- TC-BEGIN:BO-RESULT-095 -->
<a id="bo-result-095"></a>
#### BO-RESULT-095 — Incremental 감소 막대 잘림 방지 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A416:N416` · 분류 `RESULT`


```yaml
"No": 415
"TC ID": "BO-RESULT-095"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Incremental"
"Test Case": "Incremental 감소 막대 잘림 방지 검증"
"Pre-Condition": "균등 배분 대비 증감 데이터가 포함된 BO 결과가 존재함"
"Test steps": |-
  1. Incremental 차트를 확인함
  2. 데이터 hover와 Info hover를 수행함
"Expected Result": |-
  - 감소 막대가 균등값 아래로 내려가도 전체 막대가 화면 안에 표시됨
  - 영문 차트명은 선택 KPI에 따라 Incremental {KPIEn}으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-095::A01`, `BO-RESULT-095::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WATERFALL_FIXTURES + AXIS_BREAK_CONTRACT + VISUAL_BASELINE`임. 균등 기준·채널별 delta·최종값을 별도로 대조함. 양수/음수와 절단/미절단 분기를 분리하고 감소 막대의 잘림 여부를 관찰함.

- **확인 필요**: [AUTO-06](#auto-06) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§6.6·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-095 -->


<!-- TC-BEGIN:BO-RESULT-096 -->
<a id="bo-result-096"></a>
#### BO-RESULT-096 — Incremental Info 툴팁 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A417:N417` · 분류 `RESULT`


```yaml
"No": 416
"TC ID": "BO-RESULT-096"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/차트 Incremental"
"Test Case": "Incremental Info 툴팁 검증"
"Pre-Condition": "균등 배분 대비 증감 데이터가 포함된 BO 결과가 존재함"
"Test steps": |-
  1. Incremental 차트를 확인함
  2. 데이터 hover와 Info hover를 수행함
"Expected Result": |-
  - 균등 배분에서 최적화까지 채널별 KPI 창출·감소 기여 설명이 표시됨
  - 영문 차트명은 선택 KPI에 따라 Incremental {KPIEn}으로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-096::A01`, `BO-RESULT-096::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `WATERFALL_FIXTURES + AXIS_BREAK_CONTRACT + VISUAL_BASELINE`임. 균등 기준·채널별 delta·최종값을 별도로 대조함. 양수/음수와 절단/미절단 분기를 분리하고 감소 막대의 잘림 여부를 관찰함.

- **대조 문서**: `§6.6·§6.7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-096 -->


### 영역: 결과 화면/SpinX


<!-- TC-BEGIN:BO-RESULT-097 -->
<a id="bo-result-097"></a>
#### BO-RESULT-097 — SpinX 차트별 해석 블록 노출 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A418:N418` · 분류 `RESULT`


```yaml
"No": 417
"TC ID": "BO-RESULT-097"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/SpinX"
"Test Case": "SpinX 차트별 해석 블록 노출 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 SpinX 기능 플래그가 활성화됨"
"Test steps": |-
  1. SpinX 해석 블록 또는 최적화 원리 트리거를 클릭/hover함
  2. 패널/입력창/자동 전송 상태를 확인함
"Expected Result": |-
  - 각 차트 하단에 SpinX for Budget Optimizer 해석 블록이 표시됨
  - SpinX 상세 응답 품질 자체는 별도 SpinX TC 범위로 분리함
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-097::A01`, `BO-RESULT-097::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `SPINX_BINDINGS + FIXTURE_BINDINGS`임. 이어서 질문하기의 프리필과 최적화 원리 클릭의 자동 전송을 구분함. 세션 생성 요청과 사용자 질문 전송 요청을 같은 이벤트로 세지 않음.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-097 -->


<!-- TC-BEGIN:BO-RESULT-098 -->
<a id="bo-result-098"></a>
#### BO-RESULT-098 — SpinX 해석 로딩 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A419:N419` · 분류 `RESULT`


```yaml
"No": 418
"TC ID": "BO-RESULT-098"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/SpinX"
"Test Case": "SpinX 해석 로딩 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 SpinX 기능 플래그가 활성화됨"
"Test steps": |-
  1. SpinX 해석 블록 또는 최적화 원리 트리거를 클릭/hover함
  2. 패널/입력창/자동 전송 상태를 확인함
"Expected Result": |-
  - 로딩 중 SpinX 심볼 회전과 analyzing… 상태가 표시됨
  - SpinX 상세 응답 품질 자체는 별도 SpinX TC 범위로 분리함
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-098::A01`, `BO-RESULT-098::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `SPINX_BINDINGS + FIXTURE_BINDINGS`임. 이어서 질문하기의 프리필과 최적화 원리 클릭의 자동 전송을 구분함. 세션 생성 요청과 사용자 질문 전송 요청을 같은 이벤트로 세지 않음.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-098 -->


<!-- TC-BEGIN:BO-RESULT-099 -->
<a id="bo-result-099"></a>
#### BO-RESULT-099 — SpinX 해석 본문 길이 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A420:N420` · 분류 `RESULT`


```yaml
"No": 419
"TC ID": "BO-RESULT-099"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/SpinX"
"Test Case": "SpinX 해석 본문 길이 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 SpinX 기능 플래그가 활성화됨"
"Test steps": |-
  1. SpinX 해석 블록 또는 최적화 원리 트리거를 클릭/hover함
  2. 패널/입력창/자동 전송 상태를 확인함
"Expected Result": |-
  - 본문은 약 300자 내외의 차트 해석 텍스트로 표시됨
  - SpinX 상세 응답 품질 자체는 별도 SpinX TC 범위로 분리함
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-099::A01`, `BO-RESULT-099::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `SPINX_BINDINGS + FIXTURE_BINDINGS`임. 이어서 질문하기의 프리필과 최적화 원리 클릭의 자동 전송을 구분함. 세션 생성 요청과 사용자 질문 전송 요청을 같은 이벤트로 세지 않음.

- **개별 주의**: 약 300자 내외는 선택적 권고가 아니라 원문 표현이나 정확한 허용 범위는 없음. 엄격한 최대 300자 제한 테스트로 변환하지 않음.

- **확인 필요**: [AUTO-07](#auto-07), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-099 -->


<!-- TC-BEGIN:BO-RESULT-100 -->
<a id="bo-result-100"></a>
#### BO-RESULT-100 — SpinX 이어서 질문하기 클릭 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A421:N421` · 분류 `RESULT`


```yaml
"No": 420
"TC ID": "BO-RESULT-100"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/SpinX"
"Test Case": "SpinX 이어서 질문하기 클릭 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 SpinX 기능 플래그가 활성화됨"
"Test steps": |-
  1. SpinX 해석 블록 또는 최적화 원리 트리거를 클릭/hover함
  2. 패널/입력창/자동 전송 상태를 확인함
"Expected Result": |-
  - SpinX 패널이 열리고 입력창에 '@{차트명} ' 멘션이 프리필됨
  - SpinX 상세 응답 품질 자체는 별도 SpinX TC 범위로 분리함
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-100::A01`, `BO-RESULT-100::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `SPINX_BINDINGS + FIXTURE_BINDINGS`임. 이어서 질문하기의 프리필과 최적화 원리 클릭의 자동 전송을 구분함. 세션 생성 요청과 사용자 질문 전송 요청을 같은 이벤트로 세지 않음.

- **개별 주의**: 프리필 문자열 끝 공백까지 포함한 “@{차트명} ”를 입력값으로 대조함. 원문 문자열을 trim 처리해 검사하지 않음.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-100 -->


<!-- TC-BEGIN:BO-RESULT-101 -->
<a id="bo-result-101"></a>
#### BO-RESULT-101 — SpinX 자동 전송 안 함 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A422:N422` · 분류 `RESULT`


```yaml
"No": 421
"TC ID": "BO-RESULT-101"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/SpinX"
"Test Case": "SpinX 자동 전송 안 함 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 SpinX 기능 플래그가 활성화됨"
"Test steps": |-
  1. SpinX 해석 블록 또는 최적화 원리 트리거를 클릭/hover함
  2. 패널/입력창/자동 전송 상태를 확인함
"Expected Result": |-
  - 이어서 질문하기 클릭만으로 질문이 자동 전송되지 않음
  - SpinX 상세 응답 품질 자체는 별도 SpinX TC 범위로 분리함
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-101::A01`, `BO-RESULT-101::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `SPINX_BINDINGS + FIXTURE_BINDINGS`임. 이어서 질문하기의 프리필과 최적화 원리 클릭의 자동 전송을 구분함. 세션 생성 요청과 사용자 질문 전송 요청을 같은 이벤트로 세지 않음.

- **개별 주의**: 질문 전송 이벤트/요청 증가가 없는지 검사함. 패널 초기화·세션 발급·분석 조회 등 다른 요청이 있다는 이유만으로 실패시키지 않음.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-101 -->


<!-- TC-BEGIN:BO-RESULT-102 -->
<a id="bo-result-102"></a>
#### BO-RESULT-102 — SpinX @ 입력 자동완성 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A423:N423` · 분류 `RESULT`


```yaml
"No": 422
"TC ID": "BO-RESULT-102"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/SpinX"
"Test Case": "SpinX @ 입력 자동완성 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 SpinX 기능 플래그가 활성화됨"
"Test steps": |-
  1. SpinX 해석 블록 또는 최적화 원리 트리거를 클릭/hover함
  2. 패널/입력창/자동 전송 상태를 확인함
"Expected Result": |-
  - SpinX 입력창에서 @ 입력 시 Budget Share/Response Curve/Weekly Contribution/Incremental 목록이 표시됨
  - SpinX 상세 응답 품질 자체는 별도 SpinX TC 범위로 분리함
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-102::A01`, `BO-RESULT-102::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `SPINX_BINDINGS + FIXTURE_BINDINGS`임. 이어서 질문하기의 프리필과 최적화 원리 클릭의 자동 전송을 구분함. 세션 생성 요청과 사용자 질문 전송 요청을 같은 이벤트로 세지 않음.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-102 -->


<!-- TC-BEGIN:BO-RESULT-103 -->
<a id="bo-result-103"></a>
#### BO-RESULT-103 — SpinX 멘션 키보드 선택 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A424:N424` · 분류 `RESULT`


```yaml
"No": 423
"TC ID": "BO-RESULT-103"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/SpinX"
"Test Case": "SpinX 멘션 키보드 선택 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 SpinX 기능 플래그가 활성화됨"
"Test steps": |-
  1. SpinX 해석 블록 또는 최적화 원리 트리거를 클릭/hover함
  2. 패널/입력창/자동 전송 상태를 확인함
"Expected Result": |-
  - ↑↓ 이동, Enter/Tab 선택, Esc 닫기가 동작함
  - SpinX 상세 응답 품질 자체는 별도 SpinX TC 범위로 분리함
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-103::A01`, `BO-RESULT-103::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `SPINX_BINDINGS + FIXTURE_BINDINGS`임. 이어서 질문하기의 프리필과 최적화 원리 클릭의 자동 전송을 구분함. 세션 생성 요청과 사용자 질문 전송 요청을 같은 이벤트로 세지 않음.

- **개별 주의**: 방향키 이동, Enter 선택, Tab 선택, Esc 닫기를 각각 하위 케이스로 기록함. Enter/Tab은 독립 실행해 하나의 동작으로 두 조건을 통과 처리하지 않음.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-103 -->


<!-- TC-BEGIN:BO-RESULT-104 -->
<a id="bo-result-104"></a>
#### BO-RESULT-104 — SpinX 최적화 원리 hover 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A425:N425` · 분류 `RESULT`


```yaml
"No": 424
"TC ID": "BO-RESULT-104"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/SpinX"
"Test Case": "SpinX 최적화 원리 hover 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 SpinX 기능 플래그가 활성화됨"
"Test steps": |-
  1. SpinX 해석 블록 또는 최적화 원리 트리거를 클릭/hover함
  2. 패널/입력창/자동 전송 상태를 확인함
"Expected Result": |-
  - Optimization Analytics 제목 옆 트리거 hover 시 원리 요약 툴팁과 '클릭하면 SpinX가…' 보조 문구가 표시됨
  - SpinX 상세 응답 품질 자체는 별도 SpinX TC 범위로 분리함
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-104::A01`, `BO-RESULT-104::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `SPINX_BINDINGS + FIXTURE_BINDINGS`임. 이어서 질문하기의 프리필과 최적화 원리 클릭의 자동 전송을 구분함. 세션 생성 요청과 사용자 질문 전송 요청을 같은 이벤트로 세지 않음.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-104 -->


<!-- TC-BEGIN:BO-RESULT-105 -->
<a id="bo-result-105"></a>
#### BO-RESULT-105 — SpinX 최적화 원리 클릭 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A426:N426` · 분류 `RESULT`


```yaml
"No": 425
"TC ID": "BO-RESULT-105"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/SpinX"
"Test Case": "SpinX 최적화 원리 클릭 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 SpinX 기능 플래그가 활성화됨"
"Test steps": |-
  1. SpinX 해석 블록 또는 최적화 원리 트리거를 클릭/hover함
  2. 패널/입력창/자동 전송 상태를 확인함
"Expected Result": |-
  - SpinX 패널이 열리고 효율 포화·매체 우선 배분 관점 설명 질문이 자동 전송됨
  - SpinX 상세 응답 품질 자체는 별도 SpinX TC 범위로 분리함
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-105::A01`, `BO-RESULT-105::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `SPINX_BINDINGS + FIXTURE_BINDINGS`임. 이어서 질문하기의 프리필과 최적화 원리 클릭의 자동 전송을 구분함. 세션 생성 요청과 사용자 질문 전송 요청을 같은 이벤트로 세지 않음.

- **개별 주의**: 패널 노출만으로 통과하지 않음. 원리 설명 질문의 전송 사실을 별도 기록함. LLM 응답 문장 전체를 고정 문구로 요구하지 않음.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-105 -->


<!-- TC-BEGIN:BO-RESULT-106 -->
<a id="bo-result-106"></a>
#### BO-RESULT-106 — SpinX 잠금 없는 시나리오 트리거 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A427:N427` · 분류 `RESULT`


```yaml
"No": 426
"TC ID": "BO-RESULT-106"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/SpinX"
"Test Case": "SpinX 잠금 없는 시나리오 트리거 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 SpinX 기능 플래그가 활성화됨"
"Test steps": |-
  1. SpinX 해석 블록 또는 최적화 원리 트리거를 클릭/hover함
  2. 패널/입력창/자동 전송 상태를 확인함
"Expected Result": |-
  - 잠금 없는 순수 시나리오에서도 최적화 원리 트리거가 노출됨
  - SpinX 상세 응답 품질 자체는 별도 SpinX TC 범위로 분리함
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-106::A01`, `BO-RESULT-106::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `SPINX_BINDINGS + FIXTURE_BINDINGS`임. 이어서 질문하기의 프리필과 최적화 원리 클릭의 자동 전송을 구분함. 세션 생성 요청과 사용자 질문 전송 요청을 같은 이벤트로 세지 않음.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§7`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-106 -->


### 영역: 결과 화면/Budget Allocation Detail


<!-- TC-BEGIN:BO-RESULT-107 -->
<a id="bo-result-107"></a>
#### BO-RESULT-107 — Budget Allocation Detail 테이블 구조 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A428:N428` · 분류 `RESULT`


```yaml
"No": 427
"TC ID": "BO-RESULT-107"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail 테이블 구조 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 매체 > 상품 1-2뎁스 아코디언 구조로 표시됨
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-107::A01`, `BO-RESULT-107::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-107 -->


<!-- TC-BEGIN:BO-RESULT-108 -->
<a id="bo-result-108"></a>
#### BO-RESULT-108 — Budget Allocation Detail 매체 펼침/접힘 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A429:N429` · 분류 `RESULT`


```yaml
"No": 428
"TC ID": "BO-RESULT-108"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail 매체 펼침/접힘 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 매체 행 클릭 시 하위 상품 행이 펼쳐지거나 접힘
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-108::A01`, `BO-RESULT-108::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-108 -->


<!-- TC-BEGIN:BO-RESULT-109 -->
<a id="bo-result-109"></a>
#### BO-RESULT-109 — Budget Allocation Detail Estimated Total 행 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A430:N430` · 분류 `RESULT`


```yaml
"No": 429
"TC ID": "BO-RESULT-109"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail Estimated Total 행 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 테이블 하단 또는 상단 합계 행에 합산 값이 표시됨
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-109::A01`, `BO-RESULT-109::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-109 -->


<!-- TC-BEGIN:BO-RESULT-110 -->
<a id="bo-result-110"></a>
#### BO-RESULT-110 — Budget Allocation Detail Budget 컬럼 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A431:N431` · 분류 `RESULT`


```yaml
"No": 430
"TC ID": "BO-RESULT-110"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail Budget 컬럼 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 정수 원 단위로 표시되고 합계는 개별 행 예산 합계와 일치함
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-110::A01`, `BO-RESULT-110::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-110 -->


<!-- TC-BEGIN:BO-RESULT-111 -->
<a id="bo-result-111"></a>
#### BO-RESULT-111 — Budget Allocation Detail Share 컬럼 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A432:N432` · 분류 `RESULT`


```yaml
"No": 431
"TC ID": "BO-RESULT-111"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail Share 컬럼 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 소수점 2자리 %로 표시되고 Estimated Total은 100.00%임
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-111::A01`, `BO-RESULT-111::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-111 -->


<!-- TC-BEGIN:BO-RESULT-112 -->
<a id="bo-result-112"></a>
#### BO-RESULT-112 — Budget Allocation Detail Guaranteed KPI 컬럼 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A433:N433` · 분류 `RESULT`


```yaml
"No": 432
"TC ID": "BO-RESULT-112"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail Guaranteed KPI 컬럼 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 선택 KPI에 맞는 Guaranteed {KPIEn} 컬럼이 표시되고 합계가 일치함
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-112::A01`, `BO-RESULT-112::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-112 -->


<!-- TC-BEGIN:BO-RESULT-113 -->
<a id="bo-result-113"></a>
#### BO-RESULT-113 — Budget Allocation Detail Impression 컬럼 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A434:N434` · 분류 `RESULT`


```yaml
"No": 433
"TC ID": "BO-RESULT-113"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail Impression 컬럼 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 정수 회 단위로 표시되고 합계가 일치함
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-113::A01`, `BO-RESULT-113::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-113 -->


<!-- TC-BEGIN:BO-RESULT-114 -->
<a id="bo-result-114"></a>
#### BO-RESULT-114 — Budget Allocation Detail Click 컬럼 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A435:N435` · 분류 `RESULT`


```yaml
"No": 434
"TC ID": "BO-RESULT-114"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail Click 컬럼 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 정수 회 단위로 표시되고 합계가 일치함
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-114::A01`, `BO-RESULT-114::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-114 -->


<!-- TC-BEGIN:BO-RESULT-115 -->
<a id="bo-result-115"></a>
#### BO-RESULT-115 — Budget Allocation Detail View 컬럼 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A436:N436` · 분류 `RESULT`


```yaml
"No": 435
"TC ID": "BO-RESULT-115"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail View 컬럼 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 정수 회 단위로 표시되고 합계가 일치함
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-115::A01`, `BO-RESULT-115::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-115 -->


<!-- TC-BEGIN:BO-RESULT-116 -->
<a id="bo-result-116"></a>
#### BO-RESULT-116 — Budget Allocation Detail Reach 컬럼 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A437:N437` · 분류 `RESULT`


```yaml
"No": 436
"TC ID": "BO-RESULT-116"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail Reach 컬럼 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - Estimated Total Reach는 단순 합산이 아니라 모델 제공 totalReach를 표시함
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-116::A01`, `BO-RESULT-116::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **개별 주의**: 전체 Reach의 기대값은 totalReach임. 상품/매체 reach 합을 대체값으로 넣지 않음. pure 모드의 관련 기준은 BO-RESULT-179로 추적함.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-116 -->


<!-- TC-BEGIN:BO-RESULT-117 -->
<a id="bo-result-117"></a>
#### BO-RESULT-117 — Budget Allocation Detail CPM 컬럼 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A438:N438` · 분류 `RESULT`


```yaml
"No": 437
"TC ID": "BO-RESULT-117"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail CPM 컬럼 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 정수 원으로 표시되고 0값은 하이픈 처리됨
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-117::A01`, `BO-RESULT-117::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-117 -->


<!-- TC-BEGIN:BO-RESULT-118 -->
<a id="bo-result-118"></a>
#### BO-RESULT-118 — Budget Allocation Detail CPC 컬럼 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A439:N439` · 분류 `RESULT`


```yaml
"No": 438
"TC ID": "BO-RESULT-118"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail CPC 컬럼 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 정수 원으로 표시되고 0값은 하이픈 처리됨
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-118::A01`, `BO-RESULT-118::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-118 -->


<!-- TC-BEGIN:BO-RESULT-119 -->
<a id="bo-result-119"></a>
#### BO-RESULT-119 — Budget Allocation Detail CPV 컬럼 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A440:N440` · 분류 `RESULT`


```yaml
"No": 439
"TC ID": "BO-RESULT-119"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail CPV 컬럼 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 정수 원으로 표시되고 0값은 하이픈 처리됨
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-119::A01`, `BO-RESULT-119::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-119 -->


<!-- TC-BEGIN:BO-RESULT-120 -->
<a id="bo-result-120"></a>
#### BO-RESULT-120 — Budget Allocation Detail 잠금 아이콘 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A441:N441` · 분류 `RESULT`


```yaml
"No": 440
"TC ID": "BO-RESULT-120"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail 잠금 아이콘 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 잠금 반영 뷰에서 Budget 셀에 자물쇠 아이콘이 표시됨
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-120::A01`, `BO-RESULT-120::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-120 -->


<!-- TC-BEGIN:BO-RESULT-121 -->
<a id="bo-result-121"></a>
#### BO-RESULT-121 — Budget Allocation Detail 순수 뷰 잠금 아이콘 미표시 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A442:N442` · 분류 `RESULT`


```yaml
"No": 441
"TC ID": "BO-RESULT-121"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail 순수 뷰 잠금 아이콘 미표시 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 순수 최적화 뷰에서는 잠금 아이콘이 표시되지 않음
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-121::A01`, `BO-RESULT-121::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-121 -->


<!-- TC-BEGIN:BO-RESULT-122 -->
<a id="bo-result-122"></a>
#### BO-RESULT-122 — Budget Allocation Detail 순수 뷰 delta 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A443:N443` · 분류 `RESULT`


```yaml
"No": 442
"TC ID": "BO-RESULT-122"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail 순수 뷰 delta 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - Budget/Share/Guaranteed KPI 컬럼에 잠금 반영 대비 delta가 표시됨
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-122::A01`, `BO-RESULT-122::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-122 -->


<!-- TC-BEGIN:BO-RESULT-123 -->
<a id="bo-result-123"></a>
#### BO-RESULT-123 — Budget Allocation Detail delta 색상 증가 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A444:N444` · 분류 `RESULT`


```yaml
"No": 443
"TC ID": "BO-RESULT-123"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail delta 색상 증가 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 증가 delta는 초록색으로 표시됨
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-123::A01`, `BO-RESULT-123::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-123 -->


<!-- TC-BEGIN:BO-RESULT-124 -->
<a id="bo-result-124"></a>
#### BO-RESULT-124 — Budget Allocation Detail delta 색상 감소 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A445:N445` · 분류 `RESULT`


```yaml
"No": 444
"TC ID": "BO-RESULT-124"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail delta 색상 감소 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 감소 delta는 빨강색으로 표시됨
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-124::A01`, `BO-RESULT-124::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-124 -->


<!-- TC-BEGIN:BO-RESULT-125 -->
<a id="bo-result-125"></a>
#### BO-RESULT-125 — Budget Allocation Detail 가로 스크롤 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A446:N446` · 분류 `RESULT`


```yaml
"No": 445
"TC ID": "BO-RESULT-125"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail 가로 스크롤 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 컬럼이 많은 경우 테이블 가로 스크롤이 발생하고 헤더/행 정렬이 유지됨
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-125::A01`, `BO-RESULT-125::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-125 -->


<!-- TC-BEGIN:BO-RESULT-126 -->
<a id="bo-result-126"></a>
#### BO-RESULT-126 — Budget Allocation Detail 0값 하이픈 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A447:N447` · 분류 `RESULT`


```yaml
"No": 446
"TC ID": "BO-RESULT-126"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Budget Allocation Detail"
"Test Case": "Budget Allocation Detail 0값 하이픈 검증"
"Pre-Condition": "BO 결과 화면의 Budget Allocation Detail 테이블에 진입함"
"Test steps": |-
  1. 테이블 행/컬럼/모드 전환을 확인함
  2. 필요 시 매체 행을 펼침/접힘함
"Expected Result": |-
  - 0값은 규칙에 따라 하이픈(-)으로 표시되며 0원 배분 Share 예외는 0.00%로 표시됨
  - 숫자 값은 축약 없이 천 단위 콤마로 표시됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-126::A01`, `BO-RESULT-126::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + UI_BINDINGS`임. 매체/상품 행을 고유 ID로 구분하고 아코디언으로 숨겨진 행을 펼친 뒤 검사함. 부모행과 자식행을 모두 더해 총량을 이중 계산하지 않음.

- **확인 필요**: [AUTO-02](#auto-02) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8·§10·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-126 -->


### 영역: 결과 화면/0원 배분


<!-- TC-BEGIN:BO-RESULT-127 -->
<a id="bo-result-127"></a>
#### BO-RESULT-127 — 0원 배분 상품 행 0원 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A448:N448` · 분류 `RESULT`


```yaml
"No": 447
"TC ID": "BO-RESULT-127"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/0원 배분"
"Test Case": "0원 배분 상품 행 0원 검증"
"Pre-Condition": "예산 0원 매체 또는 상품이 포함된 BO 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Allocation Detail 테이블에서 0원 행을 확인함
  2. Share 셀 Info 아이콘에 hover함
"Expected Result": |-
  - 예산 0원 상품 행이 dimmed 처리되고 Share 셀에 Info 아이콘 + 0.00%가 표시됨
  - 0원 배분은 제외가 아니라 최적화 판단 결과로 설명됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-127::A01`, `BO-RESULT-127::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `ZERO_ALLOCATION_FIXTURE + UI_BINDINGS`임. 모드별 budget=0 상품과 하위 합계 0 매체를 준비함. Share 셀의 0.00% 예외와 양수 행의 부재 검증을 별도로 검사함.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8.3`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-127 -->


<!-- TC-BEGIN:BO-RESULT-128 -->
<a id="bo-result-128"></a>
#### BO-RESULT-128 — 0원 배분 매체 행 0원 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A449:N449` · 분류 `RESULT`


```yaml
"No": 448
"TC ID": "BO-RESULT-128"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/0원 배분"
"Test Case": "0원 배분 매체 행 0원 검증"
"Pre-Condition": "예산 0원 매체 또는 상품이 포함된 BO 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Allocation Detail 테이블에서 0원 행을 확인함
  2. Share 셀 Info 아이콘에 hover함
"Expected Result": |-
  - 하위 상품이 전부 0원인 매체 행도 dimmed 처리되고 Info 아이콘 + 0.00%가 표시됨
  - 0원 배분은 제외가 아니라 최적화 판단 결과로 설명됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-128::A01`, `BO-RESULT-128::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `ZERO_ALLOCATION_FIXTURE + UI_BINDINGS`임. 모드별 budget=0 상품과 하위 합계 0 매체를 준비함. Share 셀의 0.00% 예외와 양수 행의 부재 검증을 별도로 검사함.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8.3`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-128 -->


<!-- TC-BEGIN:BO-RESULT-129 -->
<a id="bo-result-129"></a>
#### BO-RESULT-129 — 0원 배분 툴팁 제목 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A450:N450` · 분류 `RESULT`


```yaml
"No": 449
"TC ID": "BO-RESULT-129"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/0원 배분"
"Test Case": "0원 배분 툴팁 제목 검증"
"Pre-Condition": "예산 0원 매체 또는 상품이 포함된 BO 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Allocation Detail 테이블에서 0원 행을 확인함
  2. Share 셀 Info 아이콘에 hover함
"Expected Result": |-
  - Info hover 시 제목 '예산이 배분되지 않았습니다'가 표시됨
  - 0원 배분은 제외가 아니라 최적화 판단 결과로 설명됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-129::A01`, `BO-RESULT-129::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `ZERO_ALLOCATION_FIXTURE + UI_BINDINGS`임. 모드별 budget=0 상품과 하위 합계 0 매체를 준비함. Share 셀의 0.00% 예외와 양수 행의 부재 검증을 별도로 검사함.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8.3`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-129 -->


<!-- TC-BEGIN:BO-RESULT-130 -->
<a id="bo-result-130"></a>
#### BO-RESULT-130 — 0원 배분 툴팁 사유 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A451:N451` · 분류 `RESULT`


```yaml
"No": 450
"TC ID": "BO-RESULT-130"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/0원 배분"
"Test Case": "0원 배분 툴팁 사유 검증"
"Pre-Condition": "예산 0원 매체 또는 상품이 포함된 BO 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Allocation Detail 테이블에서 0원 행을 확인함
  2. Share 셀 Info 아이콘에 hover함
"Expected Result": |-
  - 사유 문구 '일정 예산 이하에서는 성과가 거의 발생하지 않는 매체·상품입니다...'가 원문대로 표시됨
  - 0원 배분은 제외가 아니라 최적화 판단 결과로 설명됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-130::A01`, `BO-RESULT-130::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `ZERO_ALLOCATION_FIXTURE + UI_BINDINGS`임. 모드별 budget=0 상품과 하위 합계 0 매체를 준비함. Share 셀의 0.00% 예외와 양수 행의 부재 검증을 별도로 검사함.

- **개별 주의**: 원문 TC에는 사유 문장이 ...로 축약되어 있음. 축약 문자열을 실제 UI 문자로 검사하지 않고 본 문서의 규칙 참조 R-ZERO의 스펙 원문 전체와 대조함.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8.3`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-130 -->


<!-- TC-BEGIN:BO-RESULT-131 -->
<a id="bo-result-131"></a>
#### BO-RESULT-131 — 0원 배분 툴팁 잠금 안내 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A452:N452` · 분류 `RESULT`


```yaml
"No": 451
"TC ID": "BO-RESULT-131"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/0원 배분"
"Test Case": "0원 배분 툴팁 잠금 안내 검증"
"Pre-Condition": "예산 0원 매체 또는 상품이 포함된 BO 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Allocation Detail 테이블에서 0원 행을 확인함
  2. Share 셀 Info 아이콘에 hover함
"Expected Result": |-
  - 구분선 아래 '반드시 배분이 필요한 매체·상품이라면, 시나리오 생성 단계에서 잠금 기능으로 예산을 고정해 보세요.' 문구 표시
  - 0원 배분은 제외가 아니라 최적화 판단 결과로 설명됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-131::A01`, `BO-RESULT-131::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `ZERO_ALLOCATION_FIXTURE + UI_BINDINGS`임. 모드별 budget=0 상품과 하위 합계 0 매체를 준비함. Share 셀의 0.00% 예외와 양수 행의 부재 검증을 별도로 검사함.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8.3`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-131 -->


<!-- TC-BEGIN:BO-RESULT-132 -->
<a id="bo-result-132"></a>
#### BO-RESULT-132 — 0원 배분 툴팁 fixed position 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A453:N453` · 분류 `RESULT`


```yaml
"No": 452
"TC ID": "BO-RESULT-132"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/0원 배분"
"Test Case": "0원 배분 툴팁 fixed position 검증"
"Pre-Condition": "예산 0원 매체 또는 상품이 포함된 BO 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Allocation Detail 테이블에서 0원 행을 확인함
  2. Share 셀 Info 아이콘에 hover함
"Expected Result": |-
  - 툴팁 표시 시 테이블 가로 스크롤이 새로 생기지 않음
  - 0원 배분은 제외가 아니라 최적화 판단 결과로 설명됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-132::A01`, `BO-RESULT-132::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `ZERO_ALLOCATION_FIXTURE + UI_BINDINGS`임. 모드별 budget=0 상품과 하위 합계 0 매체를 준비함. Share 셀의 0.00% 예외와 양수 행의 부재 검증을 별도로 검사함.

- **개별 주의**: 툴팁 열기 전후 동일 테이블의 가로 스크롤 범위가 새로 증가하는지 관찰함. 이미 컬럼 때문에 존재하던 스크롤을 오류로 취급하지 않음.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8.3`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-132 -->


<!-- TC-BEGIN:BO-RESULT-133 -->
<a id="bo-result-133"></a>
#### BO-RESULT-133 — 0원 배분 예산 > 0 행 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A454:N454` · 분류 `RESULT`


```yaml
"No": 453
"TC ID": "BO-RESULT-133"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/0원 배분"
"Test Case": "0원 배분 예산 > 0 행 검증"
"Pre-Condition": "예산 0원 매체 또는 상품이 포함된 BO 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Allocation Detail 테이블에서 0원 행을 확인함
  2. Share 셀 Info 아이콘에 hover함
"Expected Result": |-
  - 예산이 0원이 아닌 행에는 dimmed/Info 아이콘/사유 툴팁이 표시되지 않음
  - 0원 배분은 제외가 아니라 최적화 판단 결과로 설명됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-133::A01`, `BO-RESULT-133::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `ZERO_ALLOCATION_FIXTURE + UI_BINDINGS`임. 모드별 budget=0 상품과 하위 합계 0 매체를 준비함. Share 셀의 0.00% 예외와 양수 행의 부재 검증을 별도로 검사함.

- **개별 주의**: 이 TC의 실제 관찰 대상은 양수 예산 행임. 공통 Test steps가 0원 행을 지칭하더라도 양수 행의 dimmed·사유 아이콘·툴팁 부재를 확인해야 함. 원문은 보존하고 실행 하위 절차에 대상을 명시함.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8.3`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-133 -->


<!-- TC-BEGIN:BO-RESULT-134 -->
<a id="bo-result-134"></a>
#### BO-RESULT-134 — 0원 배분 순수 뷰 0원 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A455:N455` · 분류 `RESULT`


```yaml
"No": 454
"TC ID": "BO-RESULT-134"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/0원 배분"
"Test Case": "0원 배분 순수 뷰 0원 검증"
"Pre-Condition": "예산 0원 매체 또는 상품이 포함된 BO 결과 데이터가 존재함"
"Test steps": |-
  1. Budget Allocation Detail 테이블에서 0원 행을 확인함
  2. Share 셀 Info 아이콘에 hover함
"Expected Result": |-
  - 순수 최적화 뷰의 0원 항목에도 동일 정책이 적용됨
  - 0원 배분은 제외가 아니라 최적화 판단 결과로 설명됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-134::A01`, `BO-RESULT-134::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `ZERO_ALLOCATION_FIXTURE + UI_BINDINGS`임. 모드별 budget=0 상품과 하위 합계 0 매체를 준비함. Share 셀의 0.00% 예외와 양수 행의 부재 검증을 별도로 검사함.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§8.3`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-134 -->


### 영역: 결과 화면/Reach Caster 간편 생성


<!-- TC-BEGIN:BO-RESULT-135 -->
<a id="bo-result-135"></a>
#### BO-RESULT-135 — Easy Create CTA 노출 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A456:N456` · 분류 `RESULT`


```yaml
"No": 455
"TC ID": "BO-RESULT-135"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create CTA 노출 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - Budget Allocation Detail 하단에 'Reach Caster로 이 예산안의 도달 성과 예측하기' CTA가 표시됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-135::A01`, `BO-RESULT-135::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-135 -->


<!-- TC-BEGIN:BO-RESULT-136 -->
<a id="bo-result-136"></a>
#### BO-RESULT-136 — Easy Create CTA 보조문구 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A457:N457` · 분류 `RESULT`


```yaml
"No": 456
"TC ID": "BO-RESULT-136"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create CTA 보조문구 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - CTA에 '최적화된 매체별 예산·예상 노출 기반' 보조문구가 표시됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-136::A01`, `BO-RESULT-136::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-136 -->


<!-- TC-BEGIN:BO-RESULT-137 -->
<a id="bo-result-137"></a>
#### BO-RESULT-137 — Easy Create CTA 클릭 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A458:N458` · 분류 `RESULT`


```yaml
"No": 457
"TC ID": "BO-RESULT-137"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create CTA 클릭 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 중간 설정 레이어가 열림
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-137::A01`, `BO-RESULT-137::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-137 -->


<!-- TC-BEGIN:BO-RESULT-138 -->
<a id="bo-result-138"></a>
#### BO-RESULT-138 — Easy Create 시나리오명 프리셋 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A459:N459` · 분류 `RESULT`


```yaml
"No": 458
"TC ID": "BO-RESULT-138"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 시나리오명 프리셋 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 시나리오명은 '(BO-{시나리오ID}) {원본 시나리오명}'으로 표시되고 변경 불가임
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-138::A01`, `BO-RESULT-138::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **개별 주의**: 표시값을 “(BO-{시나리오ID}) {원본 시나리오명}”와 비교하고 수정 불가 상태를 검사함. 긴 이름은 AUTO-15 참조함.

- **확인 필요**: [AUTO-11](#auto-11), [AUTO-15](#auto-15) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-138 -->


<!-- TC-BEGIN:BO-RESULT-139 -->
<a id="bo-result-139"></a>
#### BO-RESULT-139 — Easy Create 업종·기간 승계 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A460:N460` · 분류 `RESULT`


```yaml
"No": 459
"TC ID": "BO-RESULT-139"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 업종·기간 승계 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 원본 BO 시나리오의 업종과 기간이 표시됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-139::A01`, `BO-RESULT-139::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-139 -->


<!-- TC-BEGIN:BO-RESULT-140 -->
<a id="bo-result-140"></a>
#### BO-RESULT-140 — Easy Create 타겟 GRP 기본값 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A461:N461` · 분류 `RESULT`


```yaml
"No": 460
"TC ID": "BO-RESULT-140"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 타겟 GRP 기본값 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 타겟 GRP가 남/여 전체 선택 상태로 시작함
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-140::A01`, `BO-RESULT-140::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-140 -->


<!-- TC-BEGIN:BO-RESULT-141 -->
<a id="bo-result-141"></a>
#### BO-RESULT-141 — Easy Create 성별 전체 선택/해제 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A462:N462` · 분류 `RESULT`


```yaml
"No": 461
"TC ID": "BO-RESULT-141"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 성별 전체 선택/해제 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 남성/여성별 전체 선택/해제 버튼이 해당 성별 항목만 토글함
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-141::A01`, `BO-RESULT-141::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **개별 주의**: 남성 전체 선택/해제와 여성 전체 선택/해제를 별도로 수행하며 다른 성별 선택 상태가 유지되는지 확인함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-141 -->


<!-- TC-BEGIN:BO-RESULT-142 -->
<a id="bo-result-142"></a>
#### BO-RESULT-142 — Easy Create 타겟 0개 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A463:N463` · 분류 `RESULT`


```yaml
"No": 462
"TC ID": "BO-RESULT-142"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 타겟 0개 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 타겟 GRP를 모두 해제하면 생성 버튼이 비활성화됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-142::A01`, `BO-RESULT-142::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **개별 주의**: 타겟 전체 해제 전에는 전달 가능 항목이 1개 이상 존재해야 함. 버튼 비활성 원인이 타겟 0개임을 분리함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-142 -->


<!-- TC-BEGIN:BO-RESULT-143 -->
<a id="bo-result-143"></a>
#### BO-RESULT-143 — Easy Create 노출 전달 모드 기본 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A464:N464` · 분류 `RESULT`


```yaml
"No": 463
"TC ID": "BO-RESULT-143"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 노출 전달 모드 기본 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 예상 노출 전달 모드 기본값이 전부(all)로 선택됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-143::A01`, `BO-RESULT-143::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-143 -->


<!-- TC-BEGIN:BO-RESULT-144 -->
<a id="bo-result-144"></a>
#### BO-RESULT-144 — Easy Create 노출 전달 none 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A465:N465` · 분류 `RESULT`


```yaml
"No": 464
"TC ID": "BO-RESULT-144"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 노출 전달 none 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - none 선택 시 예상 노출값을 Reach Caster로 전달하지 않음
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-144::A01`, `BO-RESULT-144::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-144 -->


<!-- TC-BEGIN:BO-RESULT-145 -->
<a id="bo-result-145"></a>
#### BO-RESULT-145 — Easy Create 노출 전달 required 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A466:N466` · 분류 `RESULT`


```yaml
"No": 465
"TC ID": "BO-RESULT-145"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 노출 전달 required 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - _CPT/예약형/보장형 필수 상품만 예상 노출값을 전달함
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-145::A01`, `BO-RESULT-145::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **개별 주의**: _CPT / 예약형 / 보장형 각 패턴 및 비필수 상품을 준비함. 예산 전달 여부와 예상 노출 전달 여부를 별도로 대조함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-145 -->


<!-- TC-BEGIN:BO-RESULT-146 -->
<a id="bo-result-146"></a>
#### BO-RESULT-146 — Easy Create 노출 전달 all 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A467:N467` · 분류 `RESULT`


```yaml
"No": 466
"TC ID": "BO-RESULT-146"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 노출 전달 all 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 전달 대상 상품 전체에 예상 노출값을 함께 전달함
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-146::A01`, `BO-RESULT-146::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-146 -->


<!-- TC-BEGIN:BO-RESULT-147 -->
<a id="bo-result-147"></a>
#### BO-RESULT-147 — Easy Create 전달 내역 미리보기 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A468:N468` · 분류 `RESULT`


```yaml
"No": 467
"TC ID": "BO-RESULT-147"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 전달 내역 미리보기 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 매체 > 상품별 예산·예상 노출 표가 표시됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-147::A01`, `BO-RESULT-147::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-147 -->


<!-- TC-BEGIN:BO-RESULT-148 -->
<a id="bo-result-148"></a>
#### BO-RESULT-148 — Easy Create 미지원 제외 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A469:N469` · 분류 `RESULT`


```yaml
"No": 468
"TC ID": "BO-RESULT-148"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 미지원 제외 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - Targetpick 등 미지원 항목은 destructive 톤 '미지원 제외' 뱃지와 하이픈 예산/노출로 표시됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-148::A01`, `BO-RESULT-148::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11), [AUTO-12](#auto-12) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-148 -->


<!-- TC-BEGIN:BO-RESULT-149 -->
<a id="bo-result-149"></a>
#### BO-RESULT-149 — Easy Create 예산 0원 제외 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A470:N470` · 분류 `RESULT`


```yaml
"No": 469
"TC ID": "BO-RESULT-149"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 예산 0원 제외 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 예산 0원 지원 상품은 muted 톤 '예산 0원 제외' 뱃지와 실제 예산 0원으로 표시됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-149::A01`, `BO-RESULT-149::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **개별 주의**: 결과 테이블의 0값 하이픈 규칙을 모달 예산 셀에 적용하지 않음. 이 셀의 스펙은 0원 표시임.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-11](#auto-11), [AUTO-12](#auto-12) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-149 -->


<!-- TC-BEGIN:BO-RESULT-150 -->
<a id="bo-result-150"></a>
#### BO-RESULT-150 — Easy Create 미지원 우선순위 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A471:N471` · 분류 `RESULT`


```yaml
"No": 470
"TC ID": "BO-RESULT-150"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 미지원 우선순위 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 미지원이면서 예산 0원인 항목은 미지원 제외로 분류됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-150::A01`, `BO-RESULT-150::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **개별 주의**: 동일 상품을 미지원 제외와 예산 0원 제외 두 그룹에 중복 집계하지 않음.

- **확인 필요**: [AUTO-11](#auto-11), [AUTO-12](#auto-12) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-150 -->


<!-- TC-BEGIN:BO-RESULT-151 -->
<a id="bo-result-151"></a>
#### BO-RESULT-151 — Easy Create 행 정렬 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A472:N472` · 분류 `RESULT`


```yaml
"No": 471
"TC ID": "BO-RESULT-151"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 행 정렬 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 제외 항목이 상단에, 전달 항목이 하단에 표시되며 제외 항목 내부 순서는 미지원 → 예산 0원임
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-151::A01`, `BO-RESULT-151::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-151 -->


<!-- TC-BEGIN:BO-RESULT-152 -->
<a id="bo-result-152"></a>
#### BO-RESULT-152 — Easy Create 요약 카운트 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A473:N473` · 분류 `RESULT`


```yaml
"No": 472
"TC ID": "BO-RESULT-152"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 요약 카운트 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 전달 N개 · 미지원 제외 M개 · 예산 0원 제외 K개가 실제 행 수와 일치함
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-152::A01`, `BO-RESULT-152::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **개별 주의**: 요약 숫자는 상품 단위의 각 분류 행 수와 비교함. 매체 그룹 헤더나 합계 행은 전달 상품 수에 더하지 않음.

- **확인 필요**: [AUTO-11](#auto-11), [AUTO-12](#auto-12) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-152 -->


<!-- TC-BEGIN:BO-RESULT-153 -->
<a id="bo-result-153"></a>
#### BO-RESULT-153 — Easy Create 제외 0건 카운트 생략 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A474:N474` · 분류 `RESULT`


```yaml
"No": 473
"TC ID": "BO-RESULT-153"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 제외 0건 카운트 생략 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 미지원 또는 예산 0원 제외가 0건이면 해당 카운트 항목이 생략됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-153::A01`, `BO-RESULT-153::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11), [AUTO-12](#auto-12) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-153 -->


<!-- TC-BEGIN:BO-RESULT-154 -->
<a id="bo-result-154"></a>
#### BO-RESULT-154 — Easy Create 전달 대상 0건 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A475:N475` · 분류 `RESULT`


```yaml
"No": 474
"TC ID": "BO-RESULT-154"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 전달 대상 0건 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 전달 대상이 0개이면 생성 버튼 비활성화와 '전달할 항목이 없습니다' 안내 표시
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-154::A01`, `BO-RESULT-154::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **개별 주의**: 타겟을 1개 이상 유지한 채 전달 대상 0개 fixture로 실행하여 버튼 비활성 원인을 분리함.

- **확인 필요**: [AUTO-11](#auto-11), [AUTO-12](#auto-12) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-154 -->


<!-- TC-BEGIN:BO-RESULT-155 -->
<a id="bo-result-155"></a>
#### BO-RESULT-155 — Easy Create 모달 header/footer 고정 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A476:N476` · 분류 `RESULT`


```yaml
"No": 475
"TC ID": "BO-RESULT-155"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 모달 header/footer 고정 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 본문 스크롤 시 제목과 취소/생성 버튼 footer가 고정되어 계속 보임
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-155::A01`, `BO-RESULT-155::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-155 -->


<!-- TC-BEGIN:BO-RESULT-156 -->
<a id="bo-result-156"></a>
#### BO-RESULT-156 — Easy Create 표 내부 스크롤 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A477:N477` · 분류 `RESULT`


```yaml
"No": 476
"TC ID": "BO-RESULT-156"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 표 내부 스크롤 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 전달 내역 행이 많으면 표 영역 내부에서 스크롤됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-156::A01`, `BO-RESULT-156::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-156 -->


<!-- TC-BEGIN:BO-RESULT-157 -->
<a id="bo-result-157"></a>
#### BO-RESULT-157 — Easy Create 취소 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A478:N478` · 분류 `RESULT`


```yaml
"No": 477
"TC ID": "BO-RESULT-157"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 취소 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 취소 클릭 시 모달이 닫히고 Reach Caster 이동이 발생하지 않음
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-157::A01`, `BO-RESULT-157::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **개별 주의**: 취소 뒤 결과 페이지 URL 및 원본 배분 데이터가 유지되는지 확인함. 취소 케이스의 전송 없음은 AUTO-11 기준을 적용함.

- **확인 필요**: [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-157 -->


<!-- TC-BEGIN:BO-RESULT-158 -->
<a id="bo-result-158"></a>
#### BO-RESULT-158 — Easy Create 확정 이동 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A479:N479` · 분류 `RESULT`


```yaml
"No": 478
"TC ID": "BO-RESULT-158"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 확정 이동 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - Reach Caster 시나리오 생성 Step2로 이동하고 전달 대상 예산만 프리필됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-158::A01`, `BO-RESULT-158::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **개별 주의**: Reach Caster Step2 도착과 프리필 결과를 확인함. 이 동작만으로 새 시나리오가 서버에 생성되었다고 판정하지 않음.

- **확인 필요**: [AUTO-11](#auto-11), [AUTO-12](#auto-12) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-158 -->


<!-- TC-BEGIN:BO-RESULT-159 -->
<a id="bo-result-159"></a>
#### BO-RESULT-159 — Easy Create 0원 상품 미전달 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A480:N480` · 분류 `RESULT`


```yaml
"No": 479
"TC ID": "BO-RESULT-159"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 0원 상품 미전달 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 예산 0원 상품은 Step2로 전달되지 않아 Reach Caster 생성 버튼 비활성 유발이 없음
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-159::A01`, `BO-RESULT-159::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **개별 주의**: 0원 행 미전달은 확인 가능하나 다른 필수값까지 충족됐다는 뜻은 아님. none 모드의 필수 노출 등 다른 미입력으로 인한 비활성을 0원 결함으로 오판하지 않음.

- **확인 필요**: [AUTO-11](#auto-11), [AUTO-12](#auto-12) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-159 -->


<!-- TC-BEGIN:BO-RESULT-160 -->
<a id="bo-result-160"></a>
#### BO-RESULT-160 — Easy Create 원본 정보 승계 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A481:N481` · 분류 `RESULT`


```yaml
"No": 480
"TC ID": "BO-RESULT-160"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 원본 정보 승계 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - 원본 시나리오명·업종·브랜드·기간·타겟 GRP·노출 모드가 state로 함께 승계됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-160::A01`, `BO-RESULT-160::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **개별 주의**: BO에는 별도 타겟 설정이 없으므로 승계 타겟은 Easy Create에서 확정한 값임. 원문에 기재된 원본 정보 승계의 실제 출처를 항목별로 기록함.

- **확인 필요**: [AUTO-11](#auto-11), [AUTO-12](#auto-12), [AUTO-15](#auto-15) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-160 -->


<!-- TC-BEGIN:BO-RESULT-161 -->
<a id="bo-result-161"></a>
#### BO-RESULT-161 — Easy Create 권한 없는 사용자 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A482:N482` · 분류 `RESULT`


```yaml
"No": 481
"TC ID": "BO-RESULT-161"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Reach Caster 간편 생성"
"Test Case": "Easy Create 권한 없는 사용자 검증"
"Pre-Condition": "BO 결과 화면에 진입하고 Reach Caster Easy Create 기능이 활성화됨"
"Test steps": |-
  1. CTA 또는 Easy Create 모달 요소를 조작함
  2. 미리보기/버튼/이동 결과를 확인함
"Expected Result": |-
  - Client/Agency 조회 계정에서는 CTA가 미노출 또는 비활성화됨
  - 미지원·0원 제외 항목은 Reach Caster Step2 payload에서 제외됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-161::A01`, `BO-RESULT-161::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `EASY_CREATE_FIXTURE + AUTH_BINDINGS + TRANSFER_CONTRACT`임. 지원 양수/미지원/지원 0원/미지원 0원/필수 노출 상품을 준비함. 프리필 이동은 시나리오 생성 완료와 다른 단계이므로 별도로 판정함.

- **확인 필요**: [AUTO-09](#auto-09), [AUTO-11](#auto-11) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§9`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-161 -->


### 영역: 결과 화면/표시·예외·접근성


<!-- TC-BEGIN:BO-RESULT-162 -->
<a id="bo-result-162"></a>
#### BO-RESULT-162 — 결과 화면 금액 포맷 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A483:N483` · 분류 `RESULT`


```yaml
"No": 482
"TC ID": "BO-RESULT-162"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/표시·예외·접근성"
"Test Case": "결과 화면 금액 포맷 검증"
"Pre-Condition": "BO 결과 화면에 진입함"
"Test steps": "1. 대상 상태를 재현하거나 화면 요소를 확인함"
"Expected Result": |-
  - 모든 금액은 정수 원, 천 단위 콤마, 축약 금지로 표시됨
  - 콘솔 오류가 발생하지 않고 주요 액션이 중단되지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-162::A01`, `BO-RESULT-162::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + FAILURE_FIXTURES + UI_BINDINGS + VISUAL_BASELINE`임. 표시 정상 케이스와 네트워크 실패/빈 데이터 케이스를 분리함. 실패를 재현한 요청의 오류와 예기치 않은 런타임 오류를 구분해 기록함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§10 / 공통 레이아웃·접근성 관련 원본 TC`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-162 -->


<!-- TC-BEGIN:BO-RESULT-163 -->
<a id="bo-result-163"></a>
#### BO-RESULT-163 — 결과 화면 비중 포맷 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A484:N484` · 분류 `RESULT`


```yaml
"No": 483
"TC ID": "BO-RESULT-163"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/표시·예외·접근성"
"Test Case": "결과 화면 비중 포맷 검증"
"Pre-Condition": "BO 결과 화면에 진입함"
"Test steps": "1. 대상 상태를 재현하거나 화면 요소를 확인함"
"Expected Result": |-
  - Share는 소수점 2자리 + %로 표시됨
  - 콘솔 오류가 발생하지 않고 주요 액션이 중단되지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-163::A01`, `BO-RESULT-163::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + FAILURE_FIXTURES + UI_BINDINGS + VISUAL_BASELINE`임. 표시 정상 케이스와 네트워크 실패/빈 데이터 케이스를 분리함. 실패를 재현한 요청의 오류와 예기치 않은 런타임 오류를 구분해 기록함.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§10 / 공통 레이아웃·접근성 관련 원본 TC`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-163 -->


<!-- TC-BEGIN:BO-RESULT-164 -->
<a id="bo-result-164"></a>
#### BO-RESULT-164 — 결과 화면 수량 포맷 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A485:N485` · 분류 `RESULT`


```yaml
"No": 484
"TC ID": "BO-RESULT-164"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/표시·예외·접근성"
"Test Case": "결과 화면 수량 포맷 검증"
"Pre-Condition": "BO 결과 화면에 진입함"
"Test steps": "1. 대상 상태를 재현하거나 화면 요소를 확인함"
"Expected Result": |-
  - 노출/클릭/조회/도달은 정수 + 회로 표시됨
  - 콘솔 오류가 발생하지 않고 주요 액션이 중단되지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-164::A01`, `BO-RESULT-164::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + FAILURE_FIXTURES + UI_BINDINGS + VISUAL_BASELINE`임. 표시 정상 케이스와 네트워크 실패/빈 데이터 케이스를 분리함. 실패를 재현한 요청의 오류와 예기치 않은 런타임 오류를 구분해 기록함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§10 / 공통 레이아웃·접근성 관련 원본 TC`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-164 -->


<!-- TC-BEGIN:BO-RESULT-165 -->
<a id="bo-result-165"></a>
#### BO-RESULT-165 — 결과 화면 0값 포맷 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A486:N486` · 분류 `RESULT`


```yaml
"No": 485
"TC ID": "BO-RESULT-165"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/표시·예외·접근성"
"Test Case": "결과 화면 0값 포맷 검증"
"Pre-Condition": "BO 결과 화면에 진입함"
"Test steps": "1. 대상 상태를 재현하거나 화면 요소를 확인함"
"Expected Result": |-
  - 0값은 하이픈으로 표시됨
  - 콘솔 오류가 발생하지 않고 주요 액션이 중단되지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-165::A01`, `BO-RESULT-165::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + FAILURE_FIXTURES + UI_BINDINGS + VISUAL_BASELINE`임. 표시 정상 케이스와 네트워크 실패/빈 데이터 케이스를 분리함. 실패를 재현한 요청의 오류와 예기치 않은 런타임 오류를 구분해 기록함.

- **확인 필요**: [AUTO-02](#auto-02), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§10 / 공통 레이아웃·접근성 관련 원본 TC`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-165 -->


<!-- TC-BEGIN:BO-RESULT-166 -->
<a id="bo-result-166"></a>
#### BO-RESULT-166 — 결과 화면 매체명 표준 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A487:N487` · 분류 `RESULT`


```yaml
"No": 486
"TC ID": "BO-RESULT-166"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/표시·예외·접근성"
"Test Case": "결과 화면 매체명 표준 검증"
"Pre-Condition": "BO 결과 화면에 진입함"
"Test steps": "1. 대상 상태를 재현하거나 화면 요소를 확인함"
"Expected Result": |-
  - Google Ads, Meta, kakao 모먼트, Targetpick, NAVER 성과형 DA 등 표준 명칭으로 표시됨
  - 콘솔 오류가 발생하지 않고 주요 액션이 중단되지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-166::A01`, `BO-RESULT-166::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + FAILURE_FIXTURES + UI_BINDINGS + VISUAL_BASELINE`임. 표시 정상 케이스와 네트워크 실패/빈 데이터 케이스를 분리함. 실패를 재현한 요청의 오류와 예기치 않은 런타임 오류를 구분해 기록함.

- **확인 필요**: [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§10 / 공통 레이아웃·접근성 관련 원본 TC`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-166 -->


<!-- TC-BEGIN:BO-RESULT-167 -->
<a id="bo-result-167"></a>
#### BO-RESULT-167 — 결과 화면 결과 API 로딩 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A488:N488` · 분류 `RESULT`


```yaml
"No": 487
"TC ID": "BO-RESULT-167"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/표시·예외·접근성"
"Test Case": "결과 화면 결과 API 로딩 검증"
"Pre-Condition": "BO 결과 화면에 진입함"
"Test steps": "1. 대상 상태를 재현하거나 화면 요소를 확인함"
"Expected Result": |-
  - 스켈레톤 또는 로딩 상태 후 데이터가 렌더링됨
  - 콘솔 오류가 발생하지 않고 주요 액션이 중단되지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-167::A01`, `BO-RESULT-167::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + FAILURE_FIXTURES + UI_BINDINGS + VISUAL_BASELINE`임. 표시 정상 케이스와 네트워크 실패/빈 데이터 케이스를 분리함. 실패를 재현한 요청의 오류와 예기치 않은 런타임 오류를 구분해 기록함.

- **확인 필요**: [AUTO-13](#auto-13), [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§10 / 공통 레이아웃·접근성 관련 원본 TC`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-167 -->


<!-- TC-BEGIN:BO-RESULT-168 -->
<a id="bo-result-168"></a>
#### BO-RESULT-168 — 결과 화면 결과 API 실패 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A489:N489` · 분류 `RESULT`


```yaml
"No": 488
"TC ID": "BO-RESULT-168"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/표시·예외·접근성"
"Test Case": "결과 화면 결과 API 실패 검증"
"Pre-Condition": "BO 결과 화면에 진입함"
"Test steps": "1. 대상 상태를 재현하거나 화면 요소를 확인함"
"Expected Result": |-
  - 오류 안내와 재시도 UI가 표시되고 빈 차트가 깨지지 않음
  - 콘솔 오류가 발생하지 않고 주요 액션이 중단되지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-168::A01`, `BO-RESULT-168::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + FAILURE_FIXTURES + UI_BINDINGS + VISUAL_BASELINE`임. 표시 정상 케이스와 네트워크 실패/빈 데이터 케이스를 분리함. 실패를 재현한 요청의 오류와 예기치 않은 런타임 오류를 구분해 기록함.

- **확인 필요**: [AUTO-13](#auto-13), [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§10 / 공통 레이아웃·접근성 관련 원본 TC`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-168 -->


<!-- TC-BEGIN:BO-RESULT-169 -->
<a id="bo-result-169"></a>
#### BO-RESULT-169 — 결과 화면 차트 데이터 없음 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A490:N490` · 분류 `RESULT`


```yaml
"No": 489
"TC ID": "BO-RESULT-169"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/표시·예외·접근성"
"Test Case": "결과 화면 차트 데이터 없음 검증"
"Pre-Condition": "BO 결과 화면에 진입함"
"Test steps": "1. 대상 상태를 재현하거나 화면 요소를 확인함"
"Expected Result": |-
  - 해당 차트 영역에 데이터 없음 placeholder가 표시됨
  - 콘솔 오류가 발생하지 않고 주요 액션이 중단되지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-169::A01`, `BO-RESULT-169::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + FAILURE_FIXTURES + UI_BINDINGS + VISUAL_BASELINE`임. 표시 정상 케이스와 네트워크 실패/빈 데이터 케이스를 분리함. 실패를 재현한 요청의 오류와 예기치 않은 런타임 오류를 구분해 기록함.

- **확인 필요**: [AUTO-13](#auto-13), [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§10 / 공통 레이아웃·접근성 관련 원본 TC`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-169 -->


<!-- TC-BEGIN:BO-RESULT-170 -->
<a id="bo-result-170"></a>
#### BO-RESULT-170 — 결과 화면 테이블 데이터 없음 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A491:N491` · 분류 `RESULT`


```yaml
"No": 490
"TC ID": "BO-RESULT-170"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/표시·예외·접근성"
"Test Case": "결과 화면 테이블 데이터 없음 검증"
"Pre-Condition": "BO 결과 화면에 진입함"
"Test steps": "1. 대상 상태를 재현하거나 화면 요소를 확인함"
"Expected Result": |-
  - Budget Allocation Detail 빈 상태가 표시됨
  - 콘솔 오류가 발생하지 않고 주요 액션이 중단되지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-170::A01`, `BO-RESULT-170::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + FAILURE_FIXTURES + UI_BINDINGS + VISUAL_BASELINE`임. 표시 정상 케이스와 네트워크 실패/빈 데이터 케이스를 분리함. 실패를 재현한 요청의 오류와 예기치 않은 런타임 오류를 구분해 기록함.

- **확인 필요**: [AUTO-13](#auto-13), [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§10 / 공통 레이아웃·접근성 관련 원본 TC`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-170 -->


<!-- TC-BEGIN:BO-RESULT-171 -->
<a id="bo-result-171"></a>
#### BO-RESULT-171 — 결과 화면 다크모드 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A492:N492` · 분류 `RESULT`


```yaml
"No": 491
"TC ID": "BO-RESULT-171"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/표시·예외·접근성"
"Test Case": "결과 화면 다크모드 검증"
"Pre-Condition": "BO 결과 화면에 진입함"
"Test steps": "1. 대상 상태를 재현하거나 화면 요소를 확인함"
"Expected Result": |-
  - 차트/테이블/툴팁/모달의 색상 대비가 유지됨
  - 콘솔 오류가 발생하지 않고 주요 액션이 중단되지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-171::A01`, `BO-RESULT-171::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + FAILURE_FIXTURES + UI_BINDINGS + VISUAL_BASELINE`임. 표시 정상 케이스와 네트워크 실패/빈 데이터 케이스를 분리함. 실패를 재현한 요청의 오류와 예기치 않은 런타임 오류를 구분해 기록함.

- **확인 필요**: [AUTO-07](#auto-07), [AUTO-13](#auto-13), [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§10 / 공통 레이아웃·접근성 관련 원본 TC`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-171 -->


<!-- TC-BEGIN:BO-RESULT-172 -->
<a id="bo-result-172"></a>
#### BO-RESULT-172 — 결과 화면 반응형 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A493:N493` · 분류 `RESULT`


```yaml
"No": 492
"TC ID": "BO-RESULT-172"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/표시·예외·접근성"
"Test Case": "결과 화면 반응형 검증"
"Pre-Condition": "BO 결과 화면에 진입함"
"Test steps": "1. 대상 상태를 재현하거나 화면 요소를 확인함"
"Expected Result": |-
  - 좁은 화면에서 헤더는 말줄임, 테이블은 가로 스크롤로 대응함
  - 콘솔 오류가 발생하지 않고 주요 액션이 중단되지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-172::A01`, `BO-RESULT-172::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + FAILURE_FIXTURES + UI_BINDINGS + VISUAL_BASELINE`임. 표시 정상 케이스와 네트워크 실패/빈 데이터 케이스를 분리함. 실패를 재현한 요청의 오류와 예기치 않은 런타임 오류를 구분해 기록함.

- **확인 필요**: [AUTO-13](#auto-13), [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§10 / 공통 레이아웃·접근성 관련 원본 TC`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-172 -->


<!-- TC-BEGIN:BO-RESULT-173 -->
<a id="bo-result-173"></a>
#### BO-RESULT-173 — 결과 화면 키보드 접근 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A494:N494` · 분류 `RESULT`


```yaml
"No": 493
"TC ID": "BO-RESULT-173"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/표시·예외·접근성"
"Test Case": "결과 화면 키보드 접근 검증"
"Pre-Condition": "BO 결과 화면에 진입함"
"Test steps": "1. 대상 상태를 재현하거나 화면 요소를 확인함"
"Expected Result": |-
  - Export/Info/컨텍스트/모드 전환/토글/드롭다운이 키보드로 접근 가능함
  - 콘솔 오류가 발생하지 않고 주요 액션이 중단되지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-173::A01`, `BO-RESULT-173::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + FAILURE_FIXTURES + UI_BINDINGS + VISUAL_BASELINE`임. 표시 정상 케이스와 네트워크 실패/빈 데이터 케이스를 분리함. 실패를 재현한 요청의 오류와 예기치 않은 런타임 오류를 구분해 기록함.

- **확인 필요**: [AUTO-13](#auto-13), [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§10 / 공통 레이아웃·접근성 관련 원본 TC`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-173 -->


<!-- TC-BEGIN:BO-RESULT-174 -->
<a id="bo-result-174"></a>
#### BO-RESULT-174 — 결과 화면 툴팁 접근성 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A495:N495` · 분류 `RESULT`


```yaml
"No": 494
"TC ID": "BO-RESULT-174"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/표시·예외·접근성"
"Test Case": "결과 화면 툴팁 접근성 검증"
"Pre-Condition": "BO 결과 화면에 진입함"
"Test steps": "1. 대상 상태를 재현하거나 화면 요소를 확인함"
"Expected Result": |-
  - Info 아이콘과 툴팁이 aria-describedby 또는 동등한 접근성 속성을 가짐
  - 콘솔 오류가 발생하지 않고 주요 액션이 중단되지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-174::A01`, `BO-RESULT-174::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + FAILURE_FIXTURES + UI_BINDINGS + VISUAL_BASELINE`임. 표시 정상 케이스와 네트워크 실패/빈 데이터 케이스를 분리함. 실패를 재현한 요청의 오류와 예기치 않은 런타임 오류를 구분해 기록함.

- **확인 필요**: [AUTO-13](#auto-13), [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§10 / 공통 레이아웃·접근성 관련 원본 TC`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-174 -->


### 영역: 결과 화면/데이터 정합성


<!-- TC-BEGIN:BO-RESULT-175 -->
<a id="bo-result-175"></a>
#### BO-RESULT-175 — 결과 데이터 정합성 allocations 기반 차트 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A559:N559` · 분류 `RESULT`


```yaml
"No": 558
"TC ID": "BO-RESULT-175"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/데이터 정합성"
"Test Case": "결과 데이터 정합성 allocations 기반 차트 검증"
"Pre-Condition": "검증용 resultSampleData 또는 API 응답 원천값을 확인할 수 있음"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 화면 표시값과 API 응답 필드를 비교함
"Expected Result": |-
  - Budget Share/Response Curve/Incremental은 현재 모드 allocations 데이터를 기준으로 계산됨
  - 잠금 반영/순수 최적화 모드 간 데이터 소스가 혼용되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-175::A01`, `BO-RESULT-175::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + CURVE_CONTRACT`임. 독립적으로 확보한 fixture/API 원천값으로 기대값을 계산함. 화면에서 읽은 값을 그대로 기대값으로 재사용하지 않음.

- **확인 필요**: [AUTO-04](#auto-04), [AUTO-05](#auto-05) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5.2·§6·§8·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-175 -->


<!-- TC-BEGIN:BO-RESULT-176 -->
<a id="bo-result-176"></a>
#### BO-RESULT-176 — 결과 데이터 정합성 Weekly Contribution 별도 소스 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A560:N560` · 분류 `RESULT`


```yaml
"No": 559
"TC ID": "BO-RESULT-176"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/데이터 정합성"
"Test Case": "결과 데이터 정합성 Weekly Contribution 별도 소스 검증"
"Pre-Condition": "검증용 resultSampleData 또는 API 응답 원천값을 확인할 수 있음"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 화면 표시값과 API 응답 필드를 비교함
"Expected Result": |-
  - Weekly Contribution은 allocations가 아닌 업종 모델 학습 주간 시계열 데이터를 기준으로 표시됨
  - 잠금 반영/순수 최적화 모드 간 데이터 소스가 혼용되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-176::A01`, `BO-RESULT-176::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + CURVE_CONTRACT`임. 독립적으로 확보한 fixture/API 원천값으로 기대값을 계산함. 화면에서 읽은 값을 그대로 기대값으로 재사용하지 않음.

- **확인 필요**: [AUTO-04](#auto-04) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5.2·§6·§8·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-176 -->


<!-- TC-BEGIN:BO-RESULT-177 -->
<a id="bo-result-177"></a>
#### BO-RESULT-177 — 결과 데이터 정합성 pureAllocations 전환 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A561:N561` · 분류 `RESULT`


```yaml
"No": 560
"TC ID": "BO-RESULT-177"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/데이터 정합성"
"Test Case": "결과 데이터 정합성 pureAllocations 전환 검증"
"Pre-Condition": "검증용 resultSampleData 또는 API 응답 원천값을 확인할 수 있음"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 화면 표시값과 API 응답 필드를 비교함
"Expected Result": |-
  - 순수 최적화 뷰에서는 pureAllocations 데이터가 사용됨
  - 잠금 반영/순수 최적화 모드 간 데이터 소스가 혼용되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-177::A01`, `BO-RESULT-177::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + CURVE_CONTRACT`임. 독립적으로 확보한 fixture/API 원천값으로 기대값을 계산함. 화면에서 읽은 값을 그대로 기대값으로 재사용하지 않음.

- **확인 필요**: [AUTO-04](#auto-04) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5.2·§6·§8·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-177 -->


<!-- TC-BEGIN:BO-RESULT-178 -->
<a id="bo-result-178"></a>
#### BO-RESULT-178 — 결과 데이터 정합성 totalReach 사용 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A562:N562` · 분류 `RESULT`


```yaml
"No": 561
"TC ID": "BO-RESULT-178"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/데이터 정합성"
"Test Case": "결과 데이터 정합성 totalReach 사용 검증"
"Pre-Condition": "검증용 resultSampleData 또는 API 응답 원천값을 확인할 수 있음"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 화면 표시값과 API 응답 필드를 비교함
"Expected Result": |-
  - 잠금 반영 Estimated Total Reach는 totalReach 값을 사용함
  - 잠금 반영/순수 최적화 모드 간 데이터 소스가 혼용되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-178::A01`, `BO-RESULT-178::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + CURVE_CONTRACT`임. 독립적으로 확보한 fixture/API 원천값으로 기대값을 계산함. 화면에서 읽은 값을 그대로 기대값으로 재사용하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5.2·§6·§8·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-178 -->


<!-- TC-BEGIN:BO-RESULT-179 -->
<a id="bo-result-179"></a>
#### BO-RESULT-179 — 결과 데이터 정합성 pureTotalReach 사용 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A563:N563` · 분류 `RESULT`


```yaml
"No": 562
"TC ID": "BO-RESULT-179"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/데이터 정합성"
"Test Case": "결과 데이터 정합성 pureTotalReach 사용 검증"
"Pre-Condition": "검증용 resultSampleData 또는 API 응답 원천값을 확인할 수 있음"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 화면 표시값과 API 응답 필드를 비교함
"Expected Result": |-
  - 순수 최적화 Estimated Total Reach는 pureTotalReach 값을 사용함
  - 잠금 반영/순수 최적화 모드 간 데이터 소스가 혼용되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-179::A01`, `BO-RESULT-179::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + CURVE_CONTRACT`임. 독립적으로 확보한 fixture/API 원천값으로 기대값을 계산함. 화면에서 읽은 값을 그대로 기대값으로 재사용하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5.2·§6·§8·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-179 -->


<!-- TC-BEGIN:BO-RESULT-180 -->
<a id="bo-result-180"></a>
#### BO-RESULT-180 — 결과 데이터 정합성 잠금 필드 isFixed 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A564:N564` · 분류 `RESULT`


```yaml
"No": 563
"TC ID": "BO-RESULT-180"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/데이터 정합성"
"Test Case": "결과 데이터 정합성 잠금 필드 isFixed 검증"
"Pre-Condition": "검증용 resultSampleData 또는 API 응답 원천값을 확인할 수 있음"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 화면 표시값과 API 응답 필드를 비교함
"Expected Result": |-
  - 잠금 표시는 UI 텍스트가 아니라 isFixed 필드 기준으로 처리됨
  - 잠금 반영/순수 최적화 모드 간 데이터 소스가 혼용되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-180::A01`, `BO-RESULT-180::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + CURVE_CONTRACT`임. 독립적으로 확보한 fixture/API 원천값으로 기대값을 계산함. 화면에서 읽은 값을 그대로 기대값으로 재사용하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5.2·§6·§8·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-180 -->


<!-- TC-BEGIN:BO-RESULT-181 -->
<a id="bo-result-181"></a>
#### BO-RESULT-181 — 결과 데이터 정합성 0원 판별 budget 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A565:N565` · 분류 `RESULT`


```yaml
"No": 564
"TC ID": "BO-RESULT-181"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/데이터 정합성"
"Test Case": "결과 데이터 정합성 0원 판별 budget 검증"
"Pre-Condition": "검증용 resultSampleData 또는 API 응답 원천값을 확인할 수 있음"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 화면 표시값과 API 응답 필드를 비교함
"Expected Result": |-
  - 0원 배분 행은 budget 필드 ≤ 0 기준으로 판별됨
  - 잠금 반영/순수 최적화 모드 간 데이터 소스가 혼용되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-181::A01`, `BO-RESULT-181::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + CURVE_CONTRACT`임. 독립적으로 확보한 fixture/API 원천값으로 기대값을 계산함. 화면에서 읽은 값을 그대로 기대값으로 재사용하지 않음.

- **확인 필요**: [AUTO-03](#auto-03) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5.2·§6·§8·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-181 -->


<!-- TC-BEGIN:BO-RESULT-182 -->
<a id="bo-result-182"></a>
#### BO-RESULT-182 — 결과 데이터 정합성 Share 계산 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A566:N566` · 분류 `RESULT`


```yaml
"No": 565
"TC ID": "BO-RESULT-182"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/데이터 정합성"
"Test Case": "결과 데이터 정합성 Share 계산 검증"
"Pre-Condition": "검증용 resultSampleData 또는 API 응답 원천값을 확인할 수 있음"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 화면 표시값과 API 응답 필드를 비교함
"Expected Result": |-
  - 행별 Share는 해당 모드 총 예산 대비 budget 비중으로 계산됨
  - 잠금 반영/순수 최적화 모드 간 데이터 소스가 혼용되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-182::A01`, `BO-RESULT-182::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + CURVE_CONTRACT`임. 독립적으로 확보한 fixture/API 원천값으로 기대값을 계산함. 화면에서 읽은 값을 그대로 기대값으로 재사용하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5.2·§6·§8·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-182 -->


<!-- TC-BEGIN:BO-RESULT-183 -->
<a id="bo-result-183"></a>
#### BO-RESULT-183 — 결과 데이터 정합성 Guaranteed KPI 합계 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A567:N567` · 분류 `RESULT`


```yaml
"No": 566
"TC ID": "BO-RESULT-183"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/데이터 정합성"
"Test Case": "결과 데이터 정합성 Guaranteed KPI 합계 검증"
"Pre-Condition": "검증용 resultSampleData 또는 API 응답 원천값을 확인할 수 있음"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 화면 표시값과 API 응답 필드를 비교함
"Expected Result": |-
  - 테이블 Guaranteed KPI 합계와 스코어카드 Guaranteed KPI 값이 일치함
  - 잠금 반영/순수 최적화 모드 간 데이터 소스가 혼용되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-183::A01`, `BO-RESULT-183::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + CURVE_CONTRACT`임. 독립적으로 확보한 fixture/API 원천값으로 기대값을 계산함. 화면에서 읽은 값을 그대로 기대값으로 재사용하지 않음.

- **개별 주의**: Guaranteed KPI끼리 비교함. KPI=reach인 경우 Guaranteed Reach 합계와 중복 제거 Estimated Total Reach를 혼동하지 않음.

- **확인 필요**: [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5.2·§6·§8·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-183 -->


<!-- TC-BEGIN:BO-RESULT-184 -->
<a id="bo-result-184"></a>
#### BO-RESULT-184 — 결과 데이터 정합성 숫자 반올림 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A568:N568` · 분류 `RESULT`


```yaml
"No": 567
"TC ID": "BO-RESULT-184"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/데이터 정합성"
"Test Case": "결과 데이터 정합성 숫자 반올림 검증"
"Pre-Condition": "검증용 resultSampleData 또는 API 응답 원천값을 확인할 수 있음"
"Test steps": |-
  1. 결과 화면에 진입함
  2. 화면 표시값과 API 응답 필드를 비교함
"Expected Result": |-
  - 소수점 비중은 소수점 2자리로 반올림되며 합계 오차가 화면에서 과도하게 보이지 않음
  - 잠금 반영/순수 최적화 모드 간 데이터 소스가 혼용되지 않음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-184::A01`, `BO-RESULT-184::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + DATA_CONTRACT + CURVE_CONTRACT`임. 독립적으로 확보한 fixture/API 원천값으로 기대값을 계산함. 화면에서 읽은 값을 그대로 기대값으로 재사용하지 않음.

- **확인 필요**: [AUTO-08](#auto-08), [AUTO-16](#auto-16) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§5.2·§6·§8·§11`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-184 -->


### 영역: 결과 화면/Export


<!-- TC-BEGIN:BO-RESULT-185 -->
<a id="bo-result-185"></a>
#### BO-RESULT-185 — 결과 Export Copy Link 성공 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A569:N569` · 분류 `RESULT`


```yaml
"No": 568
"TC ID": "BO-RESULT-185"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Export"
"Test Case": "결과 Export Copy Link 성공 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. Share/Export 버튼을 클릭함
  2. Copy Link 또는 다운로드 항목을 클릭함
  3. 파일/토스트/메뉴 상태를 확인함
"Expected Result": |-
  - 클립보드에 현재 결과 URL이 복사되고 성공 토스트 표시
  - 다운로드 실패 시 중복 파일 또는 빈 파일이 생성되지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-185::A01`, `BO-RESULT-185::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `DOWNLOAD_CONTRACT + AUTH_BINDINGS + FAILURE_FIXTURES`임. 다운로드 시작/완료/파일 내용/실패 상태를 구분함. 파일 내용의 검증 가능 범위와 권한은 승인 계약으로 설정함.

- **확인 필요**: [AUTO-10](#auto-10), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2.2·§12 / 원본 07_Spec_Gaps No.6`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-185 -->


<!-- TC-BEGIN:BO-RESULT-186 -->
<a id="bo-result-186"></a>
#### BO-RESULT-186 — 결과 Export Copy Link 실패 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A570:N570` · 분류 `RESULT`


```yaml
"No": 569
"TC ID": "BO-RESULT-186"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Export"
"Test Case": "결과 Export Copy Link 실패 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. Share/Export 버튼을 클릭함
  2. Copy Link 또는 다운로드 항목을 클릭함
  3. 파일/토스트/메뉴 상태를 확인함
"Expected Result": |-
  - 브라우저 권한 거부 시 오류 토스트 표시
  - 다운로드 실패 시 중복 파일 또는 빈 파일이 생성되지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-186::A01`, `BO-RESULT-186::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `DOWNLOAD_CONTRACT + AUTH_BINDINGS + FAILURE_FIXTURES`임. 다운로드 시작/완료/파일 내용/실패 상태를 구분함. 파일 내용의 검증 가능 범위와 권한은 승인 계약으로 설정함.

- **확인 필요**: [AUTO-10](#auto-10), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2.2·§12 / 원본 07_Spec_Gaps No.6`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-186 -->


<!-- TC-BEGIN:BO-RESULT-187 -->
<a id="bo-result-187"></a>
#### BO-RESULT-187 — 결과 Export Excel 다운로드 성공 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A571:N571` · 분류 `RESULT`


```yaml
"No": 570
"TC ID": "BO-RESULT-187"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Export"
"Test Case": "결과 Export Excel 다운로드 성공 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. Share/Export 버튼을 클릭함
  2. Copy Link 또는 다운로드 항목을 클릭함
  3. 파일/토스트/메뉴 상태를 확인함
"Expected Result": |-
  - 파일 다운로드가 시작되고 BO 결과의 스코어카드/테이블 데이터가 포함됨
  - 다운로드 실패 시 중복 파일 또는 빈 파일이 생성되지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-187::A01`, `BO-RESULT-187::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `DOWNLOAD_CONTRACT + AUTH_BINDINGS + FAILURE_FIXTURES`임. 다운로드 시작/완료/파일 내용/실패 상태를 구분함. 파일 내용의 검증 가능 범위와 권한은 승인 계약으로 설정함.

- **확인 필요**: [AUTO-10](#auto-10), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2.2·§12 / 원본 07_Spec_Gaps No.6`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-187 -->


<!-- TC-BEGIN:BO-RESULT-188 -->
<a id="bo-result-188"></a>
#### BO-RESULT-188 — 결과 Export Excel 다운로드 실패 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A572:N572` · 분류 `RESULT`


```yaml
"No": 571
"TC ID": "BO-RESULT-188"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Export"
"Test Case": "결과 Export Excel 다운로드 실패 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. Share/Export 버튼을 클릭함
  2. Copy Link 또는 다운로드 항목을 클릭함
  3. 파일/토스트/메뉴 상태를 확인함
"Expected Result": |-
  - 오류 토스트가 표시되고 화면이 유지됨
  - 다운로드 실패 시 중복 파일 또는 빈 파일이 생성되지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-188::A01`, `BO-RESULT-188::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `DOWNLOAD_CONTRACT + AUTH_BINDINGS + FAILURE_FIXTURES`임. 다운로드 시작/완료/파일 내용/실패 상태를 구분함. 파일 내용의 검증 가능 범위와 권한은 승인 계약으로 설정함.

- **확인 필요**: [AUTO-10](#auto-10), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2.2·§12 / 원본 07_Spec_Gaps No.6`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-188 -->


<!-- TC-BEGIN:BO-RESULT-189 -->
<a id="bo-result-189"></a>
#### BO-RESULT-189 — 결과 Export PDF 다운로드 성공 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A573:N573` · 분류 `RESULT`


```yaml
"No": 572
"TC ID": "BO-RESULT-189"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Export"
"Test Case": "결과 Export PDF 다운로드 성공 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. Share/Export 버튼을 클릭함
  2. Copy Link 또는 다운로드 항목을 클릭함
  3. 파일/토스트/메뉴 상태를 확인함
"Expected Result": |-
  - 파일 다운로드가 시작되고 현재 결과 화면 핵심 요약이 포함됨
  - 다운로드 실패 시 중복 파일 또는 빈 파일이 생성되지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-189::A01`, `BO-RESULT-189::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `DOWNLOAD_CONTRACT + AUTH_BINDINGS + FAILURE_FIXTURES`임. 다운로드 시작/완료/파일 내용/실패 상태를 구분함. 파일 내용의 검증 가능 범위와 권한은 승인 계약으로 설정함.

- **확인 필요**: [AUTO-10](#auto-10), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2.2·§12 / 원본 07_Spec_Gaps No.6`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-189 -->


<!-- TC-BEGIN:BO-RESULT-190 -->
<a id="bo-result-190"></a>
#### BO-RESULT-190 — 결과 Export PDF 다운로드 실패 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A574:N574` · 분류 `RESULT`


```yaml
"No": 573
"TC ID": "BO-RESULT-190"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Export"
"Test Case": "결과 Export PDF 다운로드 실패 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. Share/Export 버튼을 클릭함
  2. Copy Link 또는 다운로드 항목을 클릭함
  3. 파일/토스트/메뉴 상태를 확인함
"Expected Result": |-
  - 오류 토스트가 표시되고 화면이 유지됨
  - 다운로드 실패 시 중복 파일 또는 빈 파일이 생성되지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-190::A01`, `BO-RESULT-190::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `DOWNLOAD_CONTRACT + AUTH_BINDINGS + FAILURE_FIXTURES`임. 다운로드 시작/완료/파일 내용/실패 상태를 구분함. 파일 내용의 검증 가능 범위와 권한은 승인 계약으로 설정함.

- **확인 필요**: [AUTO-10](#auto-10), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2.2·§12 / 원본 07_Spec_Gaps No.6`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-190 -->


<!-- TC-BEGIN:BO-RESULT-191 -->
<a id="bo-result-191"></a>
#### BO-RESULT-191 — 결과 Export Export 메뉴 외부 클릭 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A575:N575` · 분류 `RESULT`


```yaml
"No": 574
"TC ID": "BO-RESULT-191"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Export"
"Test Case": "결과 Export Export 메뉴 외부 클릭 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. Share/Export 버튼을 클릭함
  2. Copy Link 또는 다운로드 항목을 클릭함
  3. 파일/토스트/메뉴 상태를 확인함
"Expected Result": |-
  - Export 드롭다운이 닫힘
  - 다운로드 실패 시 중복 파일 또는 빈 파일이 생성되지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-191::A01`, `BO-RESULT-191::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `DOWNLOAD_CONTRACT + AUTH_BINDINGS + FAILURE_FIXTURES`임. 다운로드 시작/완료/파일 내용/실패 상태를 구분함. 파일 내용의 검증 가능 범위와 권한은 승인 계약으로 설정함.

- **개별 주의**: 다운로드 항목 선택이 아니라 열린 Export 메뉴 바깥을 실제로 클릭하여 메뉴 닫힘을 확인함. 원문 공통 절차를 그대로 실행해 다른 메뉴 동작으로 대체하지 않음.

- **확인 필요**: [AUTO-10](#auto-10), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2.2·§12 / 원본 07_Spec_Gaps No.6`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-191 -->


<!-- TC-BEGIN:BO-RESULT-192 -->
<a id="bo-result-192"></a>
#### BO-RESULT-192 — 결과 Export Export 권한 조회 사용자 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A576:N576` · 분류 `RESULT`


```yaml
"No": 575
"TC ID": "BO-RESULT-192"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/Export"
"Test Case": "결과 Export Export 권한 조회 사용자 검증"
"Pre-Condition": "Completed BO 결과 화면에 진입함"
"Test steps": |-
  1. Share/Export 버튼을 클릭함
  2. Copy Link 또는 다운로드 항목을 클릭함
  3. 파일/토스트/메뉴 상태를 확인함
"Expected Result": |-
  - Client/Agency도 조회 허용 결과에서 Export 가능 여부가 정책과 일치함
  - 다운로드 실패 시 중복 파일 또는 빈 파일이 생성되지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-192::A01`, `BO-RESULT-192::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `DOWNLOAD_CONTRACT + AUTH_BINDINGS + FAILURE_FIXTURES`임. 다운로드 시작/완료/파일 내용/실패 상태를 구분함. 파일 내용의 검증 가능 범위와 권한은 승인 계약으로 설정함.

- **확인 필요**: [AUTO-09](#auto-09), [AUTO-10](#auto-10), [AUTO-13](#auto-13) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `§2.2·§12 / 원본 07_Spec_Gaps No.6`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-192 -->


### 영역: 결과 화면/접근성


<!-- TC-BEGIN:BO-RESULT-193 -->
<a id="bo-result-193"></a>
#### BO-RESULT-193 — 결과 접근성 모드 전환 키보드 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A577:N577` · 분류 `RESULT`


```yaml
"No": 576
"TC ID": "BO-RESULT-193"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/접근성"
"Test Case": "결과 접근성 모드 전환 키보드 검증"
"Pre-Condition": "키보드 중심 접근성 검증 환경이 준비됨"
"Test steps": |-
  1. Tab/Enter/Space/ESC/방향키로 대상 요소를 조작함
  2. 포커스 이동과 상태 변경을 확인함
"Expected Result": |-
  - Tab으로 전환 버튼에 접근하고 Enter로 모드가 변경됨
  - 포커스가 화면 밖 또는 숨겨진 요소로 이동하지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-193::A01`, `BO-RESULT-193::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `UI_BINDINGS + ACCESSIBILITY_CONTRACT`임. 키보드만으로 조작함. 모달/메뉴 내부 포커스, 닫힌 뒤 포커스 복귀, 숨겨진 요소로의 이동 여부를 기록함.

- **확인 필요**: [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `원본 접근성 TC / 원본 07_Spec_Gaps No.10`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-193 -->


<!-- TC-BEGIN:BO-RESULT-194 -->
<a id="bo-result-194"></a>
#### BO-RESULT-194 — 결과 접근성 차트 드롭다운 키보드 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A578:N578` · 분류 `RESULT`


```yaml
"No": 577
"TC ID": "BO-RESULT-194"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/접근성"
"Test Case": "결과 접근성 차트 드롭다운 키보드 검증"
"Pre-Condition": "키보드 중심 접근성 검증 환경이 준비됨"
"Test steps": |-
  1. Tab/Enter/Space/ESC/방향키로 대상 요소를 조작함
  2. 포커스 이동과 상태 변경을 확인함
"Expected Result": |-
  - Response Curve 항목 드롭다운을 키보드로 열고 선택 가능함
  - 포커스가 화면 밖 또는 숨겨진 요소로 이동하지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-194::A01`, `BO-RESULT-194::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `UI_BINDINGS + ACCESSIBILITY_CONTRACT`임. 키보드만으로 조작함. 모달/메뉴 내부 포커스, 닫힌 뒤 포커스 복귀, 숨겨진 요소로의 이동 여부를 기록함.

- **확인 필요**: [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `원본 접근성 TC / 원본 07_Spec_Gaps No.10`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-194 -->


<!-- TC-BEGIN:BO-RESULT-195 -->
<a id="bo-result-195"></a>
#### BO-RESULT-195 — 결과 접근성 테이블 아코디언 키보드 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A579:N579` · 분류 `RESULT`


```yaml
"No": 578
"TC ID": "BO-RESULT-195"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/접근성"
"Test Case": "결과 접근성 테이블 아코디언 키보드 검증"
"Pre-Condition": "키보드 중심 접근성 검증 환경이 준비됨"
"Test steps": |-
  1. Tab/Enter/Space/ESC/방향키로 대상 요소를 조작함
  2. 포커스 이동과 상태 변경을 확인함
"Expected Result": |-
  - 매체 행 expand/collapse를 Enter/Space로 조작 가능함
  - 포커스가 화면 밖 또는 숨겨진 요소로 이동하지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-195::A01`, `BO-RESULT-195::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `UI_BINDINGS + ACCESSIBILITY_CONTRACT`임. 키보드만으로 조작함. 모달/메뉴 내부 포커스, 닫힌 뒤 포커스 복귀, 숨겨진 요소로의 이동 여부를 기록함.

- **확인 필요**: [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `원본 접근성 TC / 원본 07_Spec_Gaps No.10`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-195 -->


<!-- TC-BEGIN:BO-RESULT-196 -->
<a id="bo-result-196"></a>
#### BO-RESULT-196 — 결과 접근성 Easy Create 모달 focus trap 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A580:N580` · 분류 `RESULT`


```yaml
"No": 579
"TC ID": "BO-RESULT-196"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/접근성"
"Test Case": "결과 접근성 Easy Create 모달 focus trap 검증"
"Pre-Condition": "키보드 중심 접근성 검증 환경이 준비됨"
"Test steps": |-
  1. Tab/Enter/Space/ESC/방향키로 대상 요소를 조작함
  2. 포커스 이동과 상태 변경을 확인함
"Expected Result": |-
  - 모달 오픈 시 포커스가 내부에 고정되고 ESC/취소로 닫힘
  - 포커스가 화면 밖 또는 숨겨진 요소로 이동하지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-196::A01`, `BO-RESULT-196::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `UI_BINDINGS + ACCESSIBILITY_CONTRACT`임. 키보드만으로 조작함. 모달/메뉴 내부 포커스, 닫힌 뒤 포커스 복귀, 숨겨진 요소로의 이동 여부를 기록함.

- **확인 필요**: [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `원본 접근성 TC / 원본 07_Spec_Gaps No.10`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-196 -->


<!-- TC-BEGIN:BO-RESULT-197 -->
<a id="bo-result-197"></a>
#### BO-RESULT-197 — 결과 접근성 Easy Create target checkbox 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A581:N581` · 분류 `RESULT`


```yaml
"No": 580
"TC ID": "BO-RESULT-197"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/접근성"
"Test Case": "결과 접근성 Easy Create target checkbox 검증"
"Pre-Condition": "키보드 중심 접근성 검증 환경이 준비됨"
"Test steps": |-
  1. Tab/Enter/Space/ESC/방향키로 대상 요소를 조작함
  2. 포커스 이동과 상태 변경을 확인함
"Expected Result": |-
  - 타겟 GRP 체크박스에 label 또는 aria-label이 연결됨
  - 포커스가 화면 밖 또는 숨겨진 요소로 이동하지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-197::A01`, `BO-RESULT-197::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `UI_BINDINGS + ACCESSIBILITY_CONTRACT`임. 키보드만으로 조작함. 모달/메뉴 내부 포커스, 닫힌 뒤 포커스 복귀, 숨겨진 요소로의 이동 여부를 기록함.

- **확인 필요**: [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `원본 접근성 TC / 원본 07_Spec_Gaps No.10`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-197 -->


<!-- TC-BEGIN:BO-RESULT-198 -->
<a id="bo-result-198"></a>
#### BO-RESULT-198 — 결과 접근성 Export 메뉴 ESC 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A582:N582` · 분류 `RESULT`


```yaml
"No": 581
"TC ID": "BO-RESULT-198"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/접근성"
"Test Case": "결과 접근성 Export 메뉴 ESC 검증"
"Pre-Condition": "키보드 중심 접근성 검증 환경이 준비됨"
"Test steps": |-
  1. Tab/Enter/Space/ESC/방향키로 대상 요소를 조작함
  2. 포커스 이동과 상태 변경을 확인함
"Expected Result": |-
  - Export 드롭다운이 ESC로 닫힘
  - 포커스가 화면 밖 또는 숨겨진 요소로 이동하지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-198::A01`, `BO-RESULT-198::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `UI_BINDINGS + ACCESSIBILITY_CONTRACT`임. 키보드만으로 조작함. 모달/메뉴 내부 포커스, 닫힌 뒤 포커스 복귀, 숨겨진 요소로의 이동 여부를 기록함.

- **확인 필요**: [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `원본 접근성 TC / 원본 07_Spec_Gaps No.10`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-198 -->


<!-- TC-BEGIN:BO-RESULT-199 -->
<a id="bo-result-199"></a>
#### BO-RESULT-199 — 결과 접근성 Info 툴팁 키보드 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A583:N583` · 분류 `RESULT`


```yaml
"No": 582
"TC ID": "BO-RESULT-199"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/접근성"
"Test Case": "결과 접근성 Info 툴팁 키보드 검증"
"Pre-Condition": "키보드 중심 접근성 검증 환경이 준비됨"
"Test steps": |-
  1. Tab/Enter/Space/ESC/방향키로 대상 요소를 조작함
  2. 포커스 이동과 상태 변경을 확인함
"Expected Result": |-
  - Info 아이콘 포커스 시에도 툴팁 내용을 확인할 수 있음
  - 포커스가 화면 밖 또는 숨겨진 요소로 이동하지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-199::A01`, `BO-RESULT-199::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `UI_BINDINGS + ACCESSIBILITY_CONTRACT`임. 키보드만으로 조작함. 모달/메뉴 내부 포커스, 닫힌 뒤 포커스 복귀, 숨겨진 요소로의 이동 여부를 기록함.

- **확인 필요**: [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `원본 접근성 TC / 원본 07_Spec_Gaps No.10`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-199 -->


<!-- TC-BEGIN:BO-RESULT-200 -->
<a id="bo-result-200"></a>
#### BO-RESULT-200 — 결과 접근성 SpinX 멘션 자동완성 키보드 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A584:N584` · 분류 `RESULT`


```yaml
"No": 583
"TC ID": "BO-RESULT-200"
"Depth 1": "Budget Optimizer"
"Depth 2": "결과 화면/접근성"
"Test Case": "결과 접근성 SpinX 멘션 자동완성 키보드 검증"
"Pre-Condition": "키보드 중심 접근성 검증 환경이 준비됨"
"Test steps": |-
  1. Tab/Enter/Space/ESC/방향키로 대상 요소를 조작함
  2. 포커스 이동과 상태 변경을 확인함
"Expected Result": |-
  - @멘션 목록이 키보드로 탐색 가능함
  - 포커스가 화면 밖 또는 숨겨진 요소로 이동하지 않음
"Result": null
"Jira_issue num": null
"Priority": "minor"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-RESULT-200::A01`, `BO-RESULT-200::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `UI_BINDINGS + ACCESSIBILITY_CONTRACT`임. 키보드만으로 조작함. 모달/메뉴 내부 포커스, 닫힌 뒤 포커스 복귀, 숨겨진 요소로의 이동 여부를 기록함.

- **확인 필요**: [AUTO-14](#auto-14) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `원본 접근성 TC / 원본 07_Spec_Gaps No.10`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-RESULT-200 -->


<a id="related-cases"></a>
## 6. 결과 화면 직접 연관 TC 원문 — 10건


원본 Excel의 공통/권한/GNB 영역에서 추출한 기존 TC임. 결과 본문 200건에 포함하지 않으며 별도 집계함. 결과 화면 범위를 넓혀 목록 전체를 재검증하지 않음.


### 영역: 권한/기능 제한


<!-- TC-BEGIN:BO-PERM-019 -->
<a id="bo-perm-019"></a>
#### BO-PERM-019 — Client 권한에서 결과 화면 컨텍스트 메뉴 이동/삭제/복제 제한 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A20:N20` · 분류 `RELATED`


```yaml
"No": 19
"TC ID": "BO-PERM-019"
"Depth 1": "Budget Optimizer"
"Depth 2": "권한/기능 제한"
"Test Case": "Client 권한에서 결과 화면 컨텍스트 메뉴 이동/삭제/복제 제한 검증"
"Pre-Condition": "결과 화면 조회 가능 계정으로 로그인함"
"Test steps": |-
  1. Budget Optimizer 목록 또는 결과 화면에 진입함
  2. 결과 화면 컨텍스트 메뉴 이동/삭제/복제 영역 노출 여부를 확인함
  3. 직접 클릭 또는 URL 우회 접근을 시도함
"Expected Result": |-
  - 관리 메뉴 미노출
  - 제한된 액션 실행 API가 호출되지 않음
  - 브라우저 콘솔/네트워크에 권한 우회 성공 흔적이 없음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-PERM-019::A01`, `BO-PERM-019::A02`, `BO-PERM-019::A03`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `AUTH_BINDINGS + UI_BINDINGS`임. 원문에서 목록 또는 결과 화면으로 기술한 경우 이 문서의 실행 범위는 결과 화면으로 한정함. 계정의 Slot 조회 권한은 충족시킨 뒤 관리/생성 기능 제한만 검증함.

- **확인 필요**: [AUTO-09](#auto-09) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `Platform_Role_Permission_Spec.md §2.1 / 원본 07_Spec_Gaps No.1·2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-PERM-019 -->


<!-- TC-BEGIN:BO-PERM-020 -->
<a id="bo-perm-020"></a>
#### BO-PERM-020 — Agency 권한에서 결과 화면 컨텍스트 메뉴 이동/삭제/복제 제한 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A21:N21` · 분류 `RELATED`


```yaml
"No": 20
"TC ID": "BO-PERM-020"
"Depth 1": "Budget Optimizer"
"Depth 2": "권한/기능 제한"
"Test Case": "Agency 권한에서 결과 화면 컨텍스트 메뉴 이동/삭제/복제 제한 검증"
"Pre-Condition": "결과 화면 조회 가능 계정으로 로그인함"
"Test steps": |-
  1. Budget Optimizer 목록 또는 결과 화면에 진입함
  2. 결과 화면 컨텍스트 메뉴 이동/삭제/복제 영역 노출 여부를 확인함
  3. 직접 클릭 또는 URL 우회 접근을 시도함
"Expected Result": |-
  - 관리 메뉴 미노출
  - 제한된 액션 실행 API가 호출되지 않음
  - 브라우저 콘솔/네트워크에 권한 우회 성공 흔적이 없음
"Result": null
"Jira_issue num": null
"Priority": "critical"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-PERM-020::A01`, `BO-PERM-020::A02`, `BO-PERM-020::A03`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `AUTH_BINDINGS + UI_BINDINGS`임. 원문에서 목록 또는 결과 화면으로 기술한 경우 이 문서의 실행 범위는 결과 화면으로 한정함. 계정의 Slot 조회 권한은 충족시킨 뒤 관리/생성 기능 제한만 검증함.

- **확인 필요**: [AUTO-09](#auto-09) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `Platform_Role_Permission_Spec.md §2.1 / 원본 07_Spec_Gaps No.1·2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-PERM-020 -->


<!-- TC-BEGIN:BO-PERM-021 -->
<a id="bo-perm-021"></a>
#### BO-PERM-021 — Client 권한에서 Reach Caster 간편 생성 CTA 제한 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A22:N22` · 분류 `RELATED`


```yaml
"No": 21
"TC ID": "BO-PERM-021"
"Depth 1": "Budget Optimizer"
"Depth 2": "권한/기능 제한"
"Test Case": "Client 권한에서 Reach Caster 간편 생성 CTA 제한 검증"
"Pre-Condition": "BO 결과 화면 조회 가능 계정으로 로그인함"
"Test steps": |-
  1. Budget Optimizer 목록 또는 결과 화면에 진입함
  2. Reach Caster 간편 생성 CTA 영역 노출 여부를 확인함
  3. 직접 클릭 또는 URL 우회 접근을 시도함
"Expected Result": |-
  - 생성 권한이 없어 CTA 미노출 또는 비활성
  - 제한된 액션 실행 API가 호출되지 않음
  - 브라우저 콘솔/네트워크에 권한 우회 성공 흔적이 없음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-PERM-021::A01`, `BO-PERM-021::A02`, `BO-PERM-021::A03`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `AUTH_BINDINGS + UI_BINDINGS`임. 원문에서 목록 또는 결과 화면으로 기술한 경우 이 문서의 실행 범위는 결과 화면으로 한정함. 계정의 Slot 조회 권한은 충족시킨 뒤 관리/생성 기능 제한만 검증함.

- **확인 필요**: [AUTO-09](#auto-09) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `Platform_Role_Permission_Spec.md §2.1 / 원본 07_Spec_Gaps No.1·2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-PERM-021 -->


<!-- TC-BEGIN:BO-PERM-022 -->
<a id="bo-perm-022"></a>
#### BO-PERM-022 — Agency 권한에서 Reach Caster 간편 생성 CTA 제한 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A23:N23` · 분류 `RELATED`


```yaml
"No": 22
"TC ID": "BO-PERM-022"
"Depth 1": "Budget Optimizer"
"Depth 2": "권한/기능 제한"
"Test Case": "Agency 권한에서 Reach Caster 간편 생성 CTA 제한 검증"
"Pre-Condition": "BO 결과 화면 조회 가능 계정으로 로그인함"
"Test steps": |-
  1. Budget Optimizer 목록 또는 결과 화면에 진입함
  2. Reach Caster 간편 생성 CTA 영역 노출 여부를 확인함
  3. 직접 클릭 또는 URL 우회 접근을 시도함
"Expected Result": |-
  - 생성 권한이 없어 CTA 미노출 또는 비활성
  - 제한된 액션 실행 API가 호출되지 않음
  - 브라우저 콘솔/네트워크에 권한 우회 성공 흔적이 없음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-PERM-022::A01`, `BO-PERM-022::A02`, `BO-PERM-022::A03`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `AUTH_BINDINGS + UI_BINDINGS`임. 원문에서 목록 또는 결과 화면으로 기술한 경우 이 문서의 실행 범위는 결과 화면으로 한정함. 계정의 Slot 조회 권한은 충족시킨 뒤 관리/생성 기능 제한만 검증함.

- **확인 필요**: [AUTO-09](#auto-09) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `Platform_Role_Permission_Spec.md §2.1 / 원본 07_Spec_Gaps No.1·2`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-PERM-022 -->


### 영역: 공통 레이아웃/네비게이션


<!-- TC-BEGIN:BO-COMMON-003 -->
<a id="bo-common-003"></a>
#### BO-COMMON-003 — 결과 화면 브레드크럼 표시 및 이동 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A26:N26` · 분류 `RELATED`


```yaml
"No": 25
"TC ID": "BO-COMMON-003"
"Depth 1": "Budget Optimizer"
"Depth 2": "공통 레이아웃/네비게이션"
"Test Case": "결과 화면 브레드크럼 표시 및 이동 검증"
"Pre-Condition": "접근 가능한 Slot과 Budget Optimizer 시나리오가 존재함"
"Test steps": |-
  1. /budgetoptimizer/scenario/{id}/result 경로에 진입함
  2. 브레드크럼 또는 SNB 표시명을 확인함
  3. 클릭 가능한 항목을 클릭함
"Expected Result": |-
  - 표시 경로가 'SlotBoard / {Slot명} / Budget Optimizer / {시나리오명}' 구조와 일치함
  - 현재 시나리오명은 비활성으로 표시됨
  - 클릭 불가 항목은 cursor pointer가 아니며 이동이 발생하지 않음
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-COMMON-003::A01`, `BO-COMMON-003::A02`, `BO-COMMON-003::A03`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `FIXTURE_BINDINGS + UI_BINDINGS`임. 결과 URL의 시나리오와 Breadcrumb 표시명이 일치해야 함. Slot명 클릭 가능 여부는 공통 Breadcrumb 정책과 SlotHome 정의의 차이를 확인한 후 결정함.

- **대조 문서**: `BudgetOptimizer_Result_Spec.md §2.3 / Breadcrumb_Navigation_Policy.md / SlotHome_Spec.md §9.1`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-COMMON-003 -->


### 영역: GNB 알림/BO 네비게이션


<!-- TC-BEGIN:BO-GNB-003 -->
<a id="bo-gnb-003"></a>
#### BO-GNB-003 — GNB 알림 완료 알림 클릭 정상 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A506:N506` · 분류 `RELATED`


```yaml
"No": 505
"TC ID": "BO-GNB-003"
"Depth 1": "Budget Optimizer"
"Depth 2": "GNB 알림/BO 네비게이션"
"Test Case": "GNB 알림 완료 알림 클릭 정상 검증"
"Pre-Condition": "BO 시나리오 생성 완료/실패 알림 데이터를 구성함"
"Test steps": |-
  1. GNB 알림 bar 또는 알림 센터를 확인함
  2. 대상 알림 항목을 클릭함
  3. 랜딩 경로와 토스트 메시지를 확인함
"Expected Result": |-
  - Slot 정상 + 시나리오 존재 시 BO 결과 화면으로 랜딩함
  - 알림 클릭 시 Slot 권한과 시나리오 유효성이 순차 검증됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-GNB-003::A01`, `BO-GNB-003::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `AUTH_BINDINGS + NOTIFICATION_FIXTURE + UI_BINDINGS`임. 완료 알림을 생성한 시점의 Slot과 현재 Slot 상태를 fixture에서 구분함. 알림 클릭 후 현재 권한·삭제·이동 여부를 다시 검사함.

- **대조 문서**: `GNB_Notification_Navigation_Spec.md §3`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-GNB-003 -->


<!-- TC-BEGIN:BO-GNB-004 -->
<a id="bo-gnb-004"></a>
#### BO-GNB-004 — GNB 알림 완료 알림 클릭 Slot 삭제 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A507:N507` · 분류 `RELATED`


```yaml
"No": 506
"TC ID": "BO-GNB-004"
"Depth 1": "Budget Optimizer"
"Depth 2": "GNB 알림/BO 네비게이션"
"Test Case": "GNB 알림 완료 알림 클릭 Slot 삭제 검증"
"Pre-Condition": "BO 시나리오 생성 완료/실패 알림 데이터를 구성함"
"Test steps": |-
  1. GNB 알림 bar 또는 알림 센터를 확인함
  2. 대상 알림 항목을 클릭함
  3. 랜딩 경로와 토스트 메시지를 확인함
"Expected Result": |-
  - SlotBoard로 이동하고 '접근 불가 항목' Error 토스트 표시
  - 알림 클릭 시 Slot 권한과 시나리오 유효성이 순차 검증됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-GNB-004::A01`, `BO-GNB-004::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `AUTH_BINDINGS + NOTIFICATION_FIXTURE + UI_BINDINGS`임. 완료 알림을 생성한 시점의 Slot과 현재 Slot 상태를 fixture에서 구분함. 알림 클릭 후 현재 권한·삭제·이동 여부를 다시 검사함.

- **대조 문서**: `GNB_Notification_Navigation_Spec.md §3`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-GNB-004 -->


<!-- TC-BEGIN:BO-GNB-005 -->
<a id="bo-gnb-005"></a>
#### BO-GNB-005 — GNB 알림 완료 알림 클릭 권한 없음 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A508:N508` · 분류 `RELATED`


```yaml
"No": 507
"TC ID": "BO-GNB-005"
"Depth 1": "Budget Optimizer"
"Depth 2": "GNB 알림/BO 네비게이션"
"Test Case": "GNB 알림 완료 알림 클릭 권한 없음 검증"
"Pre-Condition": "BO 시나리오 생성 완료/실패 알림 데이터를 구성함"
"Test steps": |-
  1. GNB 알림 bar 또는 알림 센터를 확인함
  2. 대상 알림 항목을 클릭함
  3. 랜딩 경로와 토스트 메시지를 확인함
"Expected Result": |-
  - SlotBoard로 이동하고 '접근 불가 항목' Error 토스트 표시
  - 알림 클릭 시 Slot 권한과 시나리오 유효성이 순차 검증됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-GNB-005::A01`, `BO-GNB-005::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `AUTH_BINDINGS + NOTIFICATION_FIXTURE + UI_BINDINGS`임. 완료 알림을 생성한 시점의 Slot과 현재 Slot 상태를 fixture에서 구분함. 알림 클릭 후 현재 권한·삭제·이동 여부를 다시 검사함.

- **확인 필요**: [AUTO-01](#auto-01) 참조함. 미확정 Assertion을 자동 통과시키지 않음.

- **대조 문서**: `GNB_Notification_Navigation_Spec.md §3`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-GNB-005 -->


<!-- TC-BEGIN:BO-GNB-006 -->
<a id="bo-gnb-006"></a>
#### BO-GNB-006 — GNB 알림 완료 알림 클릭 시나리오 삭제 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A509:N509` · 분류 `RELATED`


```yaml
"No": 508
"TC ID": "BO-GNB-006"
"Depth 1": "Budget Optimizer"
"Depth 2": "GNB 알림/BO 네비게이션"
"Test Case": "GNB 알림 완료 알림 클릭 시나리오 삭제 검증"
"Pre-Condition": "BO 시나리오 생성 완료/실패 알림 데이터를 구성함"
"Test steps": |-
  1. GNB 알림 bar 또는 알림 센터를 확인함
  2. 대상 알림 항목을 클릭함
  3. 랜딩 경로와 토스트 메시지를 확인함
"Expected Result": |-
  - 빈 상세 1~2초 후 BO 목록으로 리다이렉트되고 '존재하지 않는 항목' 토스트 표시
  - 알림 클릭 시 Slot 권한과 시나리오 유효성이 순차 검증됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-GNB-006::A01`, `BO-GNB-006::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `AUTH_BINDINGS + NOTIFICATION_FIXTURE + UI_BINDINGS`임. 완료 알림을 생성한 시점의 Slot과 현재 Slot 상태를 fixture에서 구분함. 알림 클릭 후 현재 권한·삭제·이동 여부를 다시 검사함.

- **대조 문서**: `GNB_Notification_Navigation_Spec.md §3`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-GNB-006 -->


<!-- TC-BEGIN:BO-GNB-007 -->
<a id="bo-gnb-007"></a>
#### BO-GNB-007 — GNB 알림 완료 알림 클릭 Slot 이동됨 검증


**원본 위치**: `ReadySet_QA_TC_BudgetOptimizer_Detailed.xlsx` → `01_TC_All_Detailed!A510:N510` · 분류 `RELATED`


```yaml
"No": 509
"TC ID": "BO-GNB-007"
"Depth 1": "Budget Optimizer"
"Depth 2": "GNB 알림/BO 네비게이션"
"Test Case": "GNB 알림 완료 알림 클릭 Slot 이동됨 검증"
"Pre-Condition": "BO 시나리오 생성 완료/실패 알림 데이터를 구성함"
"Test steps": |-
  1. GNB 알림 bar 또는 알림 센터를 확인함
  2. 대상 알림 항목을 클릭함
  3. 랜딩 경로와 토스트 메시지를 확인함
"Expected Result": |-
  - 현재 변경된 Slot의 BO 결과 화면으로 이동하고 'Slot 이동 안내' Info 토스트 표시
  - 알림 클릭 시 Slot 권한과 시나리오 유효성이 순차 검증됨
"Result": null
"Jira_issue num": null
"Priority": "major"
"Tester": null
"Test Date": null
"Comment": null
```


**자동화 전달 메모 — 추가 정보**


- **Assertion 대응**: `BO-GNB-007::A01`, `BO-GNB-007::A02`이며 원문 Expected Result의 비어 있지 않은 행 순서와 1:1 대응함.

- **준비 항목**: `AUTH_BINDINGS + NOTIFICATION_FIXTURE + UI_BINDINGS`임. 완료 알림을 생성한 시점의 Slot과 현재 Slot 상태를 fixture에서 구분함. 알림 클릭 후 현재 권한·삭제·이동 여부를 다시 검사함.

- **대조 문서**: `GNB_Notification_Navigation_Spec.md §3`이며 해당 그룹의 참조 범위임. 원문 TC 전체의 확정 여부는 별도 확인함.


<!-- TC-END:BO-GNB-007 -->


<a id="supporting-tables"></a>
## 7. 원본 Excel 지원표 — 결과 화면 관련 항목


이 절의 표는 기존 Excel 지원 시트에서 추출한 내용임. 원본 지원표 자체의 미확정 사항은 앞 절 확인 항목을 적용함. 실제 테스트 데이터나 권한 정책이 이번 변환으로 새로 생성/확정된 것은 아님.


### 7.1 필드/컨트롤 검증표


| 화면 | 필드/컨트롤 | 필수 | 타입 | 제한/경계값 | 정상 케이스 | 예외/네거티브 | 기대 메시지/표시 | 관련 TC ID 예시 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 결과 | 모드 전환 | 조건부 | Button | 잠금 시나리오에서 잠금 반영/순수 전환 | 전체 데이터 전환 | 이전 모드 lock/delta 잔존 | 모드 문구와 데이터 일치 | BO-RESULT |
| 결과 | KPI 파생 표기 | 자동 | Derived UI | impression/click/view/reach | 라벨/차트/테이블 치환 | 도달 % 표기 오류 | 정수+회, Avg CPM/CPC/CPV/CPR | BO-RESULT |
| 결과 | 0원 배분 | 자동 | Display rule | budget=0 | dimmed + Info + 0.00% | 예산>0 행에 툴팁 노출 | 예산이 배분되지 않았습니다 | BO-RESULT |
| 결과 | Easy Create 타겟 GRP | 필수 | Checkbox | 기본 전체 선택, 최소 1개 | 1개 이상 선택 | 0개 선택 | 생성 버튼 비활성 | BO-RESULT |
| 결과 | Easy Create 노출 전달 모드 | 필수 | Radio | none/required/all, 기본 all | 모드별 payload 분기 | 0원/미지원 항목 전달 | 제외 뱃지 및 미전달 | BO-RESULT |


### 7.2 권한 교차 검증표


원본 `04_Permission_CrossCheck` 전 14개 조건을 보존함. 목록/생성 열은 결과 접근·CTA 제한의 맥락이며 이번 본문 TC 범위를 확장하는 의미가 아님. 메뉴/Export/CTA 표현의 확정 여부는 AUTO-09를 별도로 적용함.


| Role | 광고주 권한 | Slot 공개 범위 | 공유 대상/관계 | 목록 노출 | 결과 조회 | 시나리오 생성 | 이동/삭제/복제 | Easy Create | URL 직접 접근 기대값 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Marketer | O | Private | 생성자 본인 | O | O | O | O | O | 허용 |
| Marketer | O | Private | 생성자 아님 | X | X | X | X | X | 403 |
| Marketer | O | Internal | 내부 | O | O | O | O | O | 허용 |
| Client | O | Internal | - | X | X | X | X | X | 403 |
| Agency | O | Internal | - | X | X | X | X | X | 403 |
| Marketer | O | Shared-Client | 마케터 | O | O | O | O | O | 허용 |
| Client | O | Shared-Client | 공유 대상 | O | O | X | X | X | 조회만 허용 |
| Agency | O | Shared-Client | 공유 대상 아님 | X | X | X | X | X | 403 |
| Marketer | O | Shared-Agency | 마케터 | O | O | O | O | O | 허용 |
| Agency | O | Shared-Agency | 공유 대상 | O | O | X | X | X | 조회만 허용 |
| Client | O | Shared-Agency | 공유 대상 아님 | X | X | X | X | X | 403 |
| Marketer | X | Any | - | X | X | X | X | X | 403/미노출 |
| Client | X | Shared-Client | 공유 대상이어도 광고주 권한 없음 | X | X | X | X | X | 403/미노출 |
| Agency | X | Shared-Agency | 공유 대상이어도 광고주 권한 없음 | X | X | X | X | X | 403/미노출 |


### 7.3 테스트 데이터 준비표


| 구분 | ID/이름 | 조건 | 용도 |
| --- | --- | --- | --- |
| 계정 | MKT_CREATOR | Marketer, 광고주 권한 O, Private Slot 생성자 | Private 허용/생성/관리 TC |
| 계정 | MKT_OTHER | Marketer, 광고주 권한 O, 타인 Private Slot | Private 차단 TC |
| 계정 | CLIENT_SHARED | Client, 광고주 권한 O, Shared-Client 대상 | Shared 조회/생성 제한 TC |
| 계정 | AGENCY_SHARED | Agency, 광고주 권한 O, Shared-Agency 대상 | Shared 조회/생성 제한 TC |
| 계정 | NO_ADV_USER | 광고주 권한 없음 | 3-Step Filter 1단계 차단 TC |
| Slot | BO_PRIVATE_CREATOR | Private, MKT_CREATOR 생성 | Private 접근 TC |
| Slot | BO_INTERNAL | Internal, 광고주 권한 O | Internal 접근 TC |
| Slot | BO_SHARED_CLIENT | Shared, Client만 공유 | Client/Agency 교차 TC |
| Slot | BO_SHARED_AGENCY | Shared, Agency만 공유 | Agency/Client 교차 TC |
| 시나리오 | BO_PENDING | Pending 상태 | 상태별 행 클릭/URL 차단 TC |
| 시나리오 | BO_PROCESSING_1~5 | Processing 1~5단계 | 진행 단계 표시 TC |
| 시나리오 | BO_ERROR | Error 상태 | 상태별 행 클릭/재시도/목록 TC |
| 시나리오 | BO_COMPLETED_LOCKED | 잠금 1개 이상, 결과 데이터 존재 | 잠금/순수 모드 결과 TC |
| 시나리오 | BO_COMPLETED_PURE | 잠금 없음 | 배너 미노출/순수 결과 TC |
| 결과 데이터 | BO_RESULT_KPI_ALL | KPI=노출/클릭/조회/도달 각 1건 | KPI 파생 표기 TC |
| 결과 데이터 | BO_RESULT_ZERO_ALLOC | budget=0 매체/상품 포함 | 0원 배분/Easy Create 제외 TC |
| 결과 데이터 | BO_RESULT_EASY_CREATE | Targetpick 미지원 + CPT/예약형 + 0원 상품 포함 | Reach Caster 간편 생성 TC |


### 7.4 메시지 검증표


| 화면 | 상황 | 메시지/문구 | 표시 위치 | 관련 TC ID 예시 |
| --- | --- | --- | --- | --- |
| 결과 | 0원 배분 툴팁 제목 | 예산이 배분되지 않았습니다 | Share Info 툴팁 | BO-RESULT |
| 결과 | 0원 배분 툴팁 사유 | 일정 예산 이하에서는 성과가 거의 발생하지 않는 매체·상품입니다. 최소 배분을 강제하면 예산이 의미 없이 소모되므로, 더 효율 높은 곳으로 예산을 모은 결과입니다. | Share Info 툴팁 | BO-RESULT |
| 결과 | 0원 배분 잠금 안내 | 반드시 배분이 필요한 매체·상품이라면, 시나리오 생성 단계에서 잠금 기능으로 예산을 고정해 보세요. | Share Info 툴팁 | BO-RESULT |
| Easy Create | 전달 대상 없음 | 전달할 항목이 없습니다 | 모달 본문/버튼 주변 | BO-RESULT |
| GNB | 접근 불가 항목 | Slot이 삭제되었거나 접근 권한이 없습니다. | Error 토스트 | BO-GNB |
| GNB | 존재하지 않는 항목 | 삭제되었거나 존재하지 않는 시나리오입니다. | Error 토스트 | BO-GNB |
| GNB | Slot 이동 안내 | '{현재 Slot명}' Slot에 위치한 시나리오 상세 페이지입니다. | Info 토스트 | BO-GNB |


### 7.5 원본 Spec Gaps 중 관련 항목


| No | 영역 | 확인 필요 사항 | TC 영향 | 제안 처리 |
| --- | --- | --- | --- | --- |
| 1 | 권한 | BO 목록/결과의 복제·이동·삭제 메뉴에 대한 Role별 명시가 목록/결과 정의서에 직접 기재되어 있지 않음 | Client/Agency 관리 액션 기대결과를 플랫폼 권한 정책 기준으로 작성함 | 기획 확인 후 관리 메뉴 기대결과 확정 필요 |
| 2 | 권한 | Easy Create는 Reach Caster 생성으로 이어지므로 Client/Agency에게 CTA를 숨길지 비활성화할지 정의서에 직접 명시되지 않음 | TC는 생성 권한 없음 기준으로 미노출 또는 비활성 기대결과로 작성함 | UX 표현 방식 확정 필요 |
| 6 | 결과 Export | BO 결과 Export의 파일명/파일 내용 범위가 세부 정의되어 있지 않음 | 다운로드 성공 및 핵심 데이터 포함 수준으로 TC 작성함 | 파일명·시트 구성 확정 필요 |
| 7 | 결과 Response Curve | currentSpend 마커 Y값이 곡선 계산값인지 실제 예측 KPI인지 구현 논의 대상으로 남아 있음 | 정합성 TC는 원천값 비교 항목으로 분리함 | 백엔드 원천 기준 확정 필요 |
| 8 | Easy Create | Reach Caster Step2 이동 시 route/state key 상세가 정의서에 없음 | 프리필 결과 중심 TC 작성함 | 라우팅 payload 스키마 확인 필요 |
| 9 | GNB 알림 | BO 알림 약자 표기가 문서에 직접 정의되어 있지 않음 | B/O 또는 정책 약자 일치 검증으로 작성함 | 알림 prefix 최종 확정 필요 |
| 10 | 접근성 | BO 개별 컴포넌트의 aria 속성 상세는 정의서에 없음 | 플랫폼 공통 접근성 기준으로 TC 작성함 | 구현 기준 확인 필요 |


<a id="result-contract"></a>
## 8. 결과 기록 및 합격 판정 — 추가 전달 정보

### 8.1 원본 Result와 실행 상태를 분리함

| Execution Status | 의미 | 원본 Result 입력 |
| --- | --- | --- |
| NOT_RUN | 아직 실행하지 않음 | 공란/null 유지함 |
| PASSED | 적용되는 모든 Assertion·필수 분기가 통과함 | PASS임 |
| FAILED | 실행된 확정 Assertion 중 하나 이상이 실제 기대결과와 불일치함 | FAIL임 |
| BLOCKED | 환경·계정·fixture·명세 미확정 등으로 완료할 수 없음 | 공란/null 유지하며 사유 기록함 |
| MANUAL_REVIEW | 시각/정성 기준 등 수동 검토가 남아 있음 | 공란/null 유지함 |
| SKIPPED | 실행 대상이지만 실행하지 않았거나 승인된 범위 제외임 | 단순 미실행은 공란임. 명시적 적용 제외 승인과 사유가 있을 때만 N/A임 |

원본 Result의 허용값은 `PASS / FAIL / N/A` 3개를 유지함. `BLOCKED` 등을 원본 Result에 새 값으로 넣지 않음. 다른 실행 관리 상태는 별도 `Execution Status` 필드에 기록함.

여러 variant 또는 Assertion 중 확정된 실패가 있으면 TC는 FAILED임. 실패는 없지만 미실행·차단·수동 검토가 남으면 PASSED로 올리지 않음. 전체 테스트가 예외 없이 끝났다는 사실만으로 PASS로 처리하지 않음. 조건부 Assertion의 비적용은 전제 불성립 근거를 기록하며, 실행 누락을 비적용으로 바꾸지 않음.

### 8.2 증적 단위

각 Assertion은 TC ID, variant_id, assertion_id, 기대값, 실제값, 판정, 사유, 증적 경로를 가짐. 증적은 필요에 따라 화면 캡처, 실행 trace, 마스킹한 요청/응답, 다운로드 파일, 런타임 오류 로그로 연결함. 보안 테스트의 차단 기대 API 오류는 예상치로 기록하되, 다른 런타임 오류까지 무시하지 않음.

결과 구조 예시는 다음과 같으며 모두 미실행 상태임. 예시를 실제 실행 결과로 제출하지 않음.

```json
{
  "run_id": null,
  "tc_id": "BO-RESULT-001",
  "variant_id": null,
  "scenario_id": null,
  "role": null,
  "kpi": null,
  "allocation_mode": null,
  "view_mode": null,
  "test_layer": null,
  "execution_status": "NOT_RUN",
  "result": null,
  "assertions": [
    {
      "assertion_id": "BO-RESULT-001::A01",
      "expected": null,
      "actual": null,
      "status": "NOT_RUN",
      "reason": null,
      "evidence": []
    },
    {
      "assertion_id": "BO-RESULT-001::A02",
      "expected": null,
      "actual": null,
      "status": "NOT_RUN",
      "reason": null,
      "evidence": []
    }
  ],
  "jira_issue_num": null,
  "tester": null,
  "test_date": null,
  "comment": null
}
```

### 8.3 실행 보고서 집계

결과 본문 200건과 연관 TC 10건은 각각 집계함. 전체 관리 건수는 210건임. 원본 TC 건수와 variant/브라우저별 실행 건수를 혼동하지 않음.

통과율은 `PASS / (PASS + FAIL)`로 계산하며 분모가 0이면 산출하지 않음. 이 값에는 미실행/차단/수동 검토가 포함되지 않으므로 실행완료율과 잔여 건수를 함께 보고함. 실행완료율은 승인 제외가 확정된 뒤 `완료된 TC 수 / 실행 대상 TC 수`로 계산함. 승인 제외 건수/사유를 별도 공개함.

스크립트 작성자는 `ReadySet_BO_Result_QA_Report_Template.md`에 본문 및 연관 TC 결과를 기록함. 같은 TC를 재실행한 경우 원본 결과를 조용히 덮어쓰지 않고 run_id 및 재실행 이력을 남김.

## 9. 변환 검증 정보

원본 행은 실행 여부와 무관하게 모두 보존함. 본문 200개와 연관 10개 ID의 중복·누락 여부 및 각 TC의 14개 원본 필드 값이 Excel 추출값과 일치하는지 변환 파일을 다시 파싱해 검사함.

실제 서비스 로그인, DOM 확인, Playwright 코드 생성/실행, 서버 권한 검증, 모델 산출값 검증은 이 변환 작업에서 수행하지 않음. 실행 기록은 모두 미실행 상태임.
