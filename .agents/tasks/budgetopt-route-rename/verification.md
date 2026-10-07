# BudgetOpt 라우트 변경 검증 (`/budgetoptimizer` → `/budgetopt`)

## 변경 요약
URL 경로 문자열 `/budgetoptimizer`(및 하위 경로)를 모두 `/budgetopt`로 교체. 리다이렉트 없이 완전 교체. 디렉토리명·컴포넌트명·데이터 key·docs slug·docs 이미지 경로는 유지.

### 변경된 파일
- `src/App.tsx` — Route path 3개 (`/budgetopt`, `/budgetopt/scenario/new`, `/budgetopt/scenario/:id/result`)
- `src/components/budgetoptimizer/BOResult.tsx` — navigate, breadcrumb href
- `src/components/budgetoptimizer/BOCreateScenario.tsx` — navigate, breadcrumb href, handleCancel 경로
- `src/components/budgetoptimizer/BOScenarioList.tsx` — navigate (목록→생성, 목록→결과)
- `src/components/layout/GlobalNavBar.tsx` — resultUrl 2곳
- `src/components/layout/Sidebar.tsx` — navigate 2곳
- `src/components/reachcaster/slotHomeTypes.ts` — 솔루션 카드 `path`
- `src/components/reachcaster/SlotSolutions.tsx` — 솔루션 목록 `path`
- `src/components/reachcaster/SlotOverview.tsx` — `defaultPath`
- `plan/decisions/BudgetOpt_2.0_Rename_화면변경내역.md` — 문서 업데이트

## 1. 타입 체크 — `npx tsc --noEmit -p tsconfig.json`
결과: 기존 무관 에러 54개(TS6133 unused 등)만 존재. **이번 변경으로 생긴 에러 없음.**
- 변경한 내용은 전부 URL 문자열 리터럴 교체뿐이라 타입에 영향 없음.
- 보고된 에러는 unused import/variable(TS6133), DatasetList의 id 타입 불일치, IndustryDualBarChart prop 불일치 등 라우트와 무관한 기존 에러.

## 2. 잔여 `/budgetoptimizer` grep — `grep -rn "/budgetoptimizer" src/`
남은 3건은 전부 **import 경로의 디렉토리명**이며 의도적으로 유지:
```
src/App.tsx:13: import { BOScenarioListPage } from './components/budgetoptimizer/BOScenarioListPage'
src/App.tsx:14: import { BOCreateScenario } from './components/budgetoptimizer/BOCreateScenario'
src/App.tsx:15: import { BOResult } from './components/budgetoptimizer/BOResult'
```
→ URL 라우트로 쓰이는 `/budgetoptimizer`는 **0건** 남음.
→ 하이픈 버전 `budget-optimizer`(docs slug/이미지)는 범위 외로 유지(정상).

## 3. 빌드 — `npm run build` (vite build)
결과: **통과**. 3000 modules transformed, built in 3.75s. (chunk size 경고는 기존 경고로 무관)

## 4. 이동 경로 일치 확인
- 라우트 정의(App.tsx): `/budgetopt`, `/budgetopt/scenario/new`, `/budgetopt/scenario/:id/result`
- 목록→생성: `navigate('/budgetopt/scenario/new')` ↔ Route 일치
- 목록→결과: `navigate(\`/budgetopt/scenario/${id}/result\`)` ↔ Route 일치
- 슬롯홈→BudgetOpt: slotHomeTypes/SlotSolutions `path: '/budgetopt'`, SlotOverview `defaultPath: '/budgetopt'` ↔ 목록 Route 일치
- breadcrumb href(`/budgetopt`), Sidebar/GNB navigate(`/budgetopt`) 모두 목록 Route 일치
→ 진입 시 404 발생 가능성 없음.
