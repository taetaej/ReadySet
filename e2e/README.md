# ReadySet · Playwright QA 자동화

제품 화면을 실제 브라우저로 자동 조작·검증해 **수기 QA를 자동 채점으로 대체**하는 작업 공간.
현재 범위: **BudgetOpt 2.0 결과 화면** (파일럿). 다른 화면으로 확장 가능.

> 상태: 진행 중 (파일럿 완료). 결과 화면 자동화 가능 TC 45건 작성·통과. 나머지는 바인딩 확보 후 확장.

---

## 1. 지금까지 한 것 (요약)

- 결과 화면(`/budgetopt/scenario/:id/result`)의 **자동화 가능한 TC 45건**을 Playwright E2E로 작성, 전부 통과.
- 원본 수기 TC(200건)를 기준으로, **자동 / 보류(바인딩 필요) / 수동(시각·주관)** 으로 분류.
- 실행 결과를 **버전별로 누적**하고 **ReadySet 무드 대시보드(HTML)**로 보여주는 리포트 생성기 구축.

| 구분 | 건수 | 설명 |
|---|---|---|
| 자동 (완료) | **45** | 텍스트·버튼·토글·모드전환·메뉴·툴팁 등 바인딩 없이 검증 가능 |
| 보류 | ~95 | fixture(상태별 시나리오)·계정·DATA_CONTRACT·다운로드 계약 확보 시 자동화 가능 |
| 수동 | ~60 | 차트 시각(픽셀·path)·문구 품질·주관 UX — 사람이 검토 |

상세: `e2e/tc/자동화_분류.md`

---

## 2. 파일 구조

```
e2e/
├── README.md                    ← 이 문서
├── budgetopt-result.spec.ts     ← 결과 화면 E2E TC 45건 (BO-RESULT-xxx)
├── report.mjs                   ← 대시보드 생성기 (버전별 누적)
├── tc/
│   ├── ReadySet_BO_Result_TC_Playwright.md   ← 원본 TC 200건 (수기 QA 기준)
│   ├── ReadySet_BO_Result_QA_Report_Template.md ← 수기 QA 보고서 양식 (참고)
│   └── 자동화_분류.md            ← 자동/보류/수동 분류 + ROI
└── results/                     ← 실행 산출물 (gitignore 권장)
    ├── last-run.json            ← Playwright가 쓰는 최신 결과 (매 실행 덮어씀)
    ├── runs/                    ← 버전+타임스탬프별 회차 누적 (안 덮어씀)
    └── dashboard.html           ← 버전별 그룹 대시보드

playwright.config.ts             ← 설정 (baseURL=localhost:3000, reporter, webServer)
```

---

## 3. 사전 준비 (최초 1회)

이미 설치돼 있음. 새 환경에서 처음 받을 때만:

```bash
npm install                      # @playwright/test 포함
npx playwright install chromium  # 브라우저 바이너리
```

---

## 4. 실행 방법

**dev 서버가 떠 있어야 한다** (`npm run dev` → localhost:3000). 꺼져 있으면 Playwright가 자동으로 띄운다(설정의 webServer).

```bash
# 1) 자동 채점 실행
npx playwright test                         # 전체
npx playwright test e2e/budgetopt-result.spec.ts   # 결과 화면만
npx playwright test --grep @critical        # critical 우선순위만
npx playwright test --headed                # 브라우저 보면서
npx playwright test --ui                    # UI 모드 (단계별 스냅샷, 가장 직관적)

# 2) 대시보드 생성 (버전 태깅)
QA_VERSION=v1.2.0 QA_FEATURE="BudgetOpt 2.0 결과 화면" node e2e/report.mjs

# 3) 결과 보기
open e2e/results/dashboard.html             # 커스텀 대시보드 (버전별 누적)
npx playwright show-report                  # Playwright 기본 리포트 (스크린샷·trace)
```

- `QA_VERSION`을 바꿔 실행하면 대시보드에 **버전 섹션이 추가로 쌓인다**. 같은 버전을 재실행하면 그 버전의 **회차 이력**이 누적된다.
- 실패 시 스크린샷·trace는 `test-results/`에 자동 저장.

---

## 5. TC 작성 규칙 (이어서 쓸 때)

1. **제목 형식 고정**: `BO-RESULT-xxx @priority 한글 설명`
   - `report.mjs` 파서가 ID·우선순위·영역을 이 형식에서 추출한다. 깨면 대시보드가 안 묶인다.
   - priority: `@critical` / `@major` / `@minor`.
2. **원본 TC ID를 그대로 사용** → 수기 TC(`tc/*.md`)와 1:1 추적.
3. **Expected Result의 각 줄 = 개별 `expect`** (Assertion 분해).
4. **셀렉터는 실제 DOM 근거로만**. 존재하지 않는 `data-testid`를 지어내지 않는다.
   - 텍스트/role 기반(`getByRole`/`getByText`) 우선. 아이콘 전용 버튼은 메뉴 열림/주변 텍스트로 우회.
5. **"화면 열림 성공"으로 데이터·권한 검증을 대신하지 않는다.** 수치·시각·권한 Assertion은
   본문에 `// 보류:` / `// 수동:` 사유 주석으로 남긴다.

---

## 6. 다음에 이어서 할 것 (TODO)

- [ ] **보류 TC 자동화** — 아래 바인딩이 생기면 ~95건 추가 자동화 가능:
  - fixture: 상태별 시나리오(Processing/Pending/Error), KPI별 시나리오, 0원 배분 케이스
  - 계정/권한: Marketer/Client/Agency 역할 로그인
  - DATA_CONTRACT: 스코어카드·테이블 숫자의 기대값 정의 (정합성 검증용)
  - DOWNLOAD_CONTRACT: Export(Excel/PDF) 다운로드 검증
- [ ] **프론트에 `data-testid` 요청** — 아이콘 버튼·차트 등 셀렉터 안정화 (자동화 적중률↑)
- [ ] **비주얼 회귀** — 차트/다크모드/반응형 레이아웃 깨짐은 스크린샷 비교 도입 시 자동화
- [ ] **다른 화면 확장** — 시나리오 생성 Step1/2, 목록 화면 등 (`e2e/<화면>.spec.ts` 추가)
- [ ] **CI 연결** — PR마다 자동 채점 (dev 서버 기동 + playwright test)
- [ ] **대시보드 개선** (선택) — 전체 TC 대비 커버리지 바, 실패 TC 상단 요약, 라이트 테마

---

## 7. 참고

- 자동화 계약 원칙·바인딩 정의: `tc/ReadySet_BO_Result_TC_Playwright.md` §1
- 자동/보류/수동 분류와 사유: `tc/자동화_분류.md`
- 색상: 통과율·버전 태그 = ReadySet 시그니처 그린(#00ff9d, "정답" 신호) / 통과 수치·바 = 의미 그린(hsl 142 71% 45%)
