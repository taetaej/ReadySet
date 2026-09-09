---
inclusion: always
---

# ⚠️ Agent Efficiency Policy — 반드시 읽을 것 (최상위 지침)

이 파일은 모든 작업에 항상 적용되는 최상위 운영 지침입니다.

## 컨텍스트 참조 제한

- 현재 요청 포함 최근 3개의 대화만 참조한다.
- 그 이전 컨텍스트는 무시한다.
- 오래된 컨텍스트가 필요한 경우 사용자에게 명시적으로 재제공을 요청한다.

## 파일 읽기 규칙

- 수정 전 전체 파일을 읽지 않는다.
- 아래 파일별 핵심 참조 가이드를 먼저 확인하고, 필요한 심볼/섹션만 타겟 조회한다.
- `readCode(selector)` 또는 `readFile(start_line, end_line)` 으로 범위를 한정한다.
- 가이드에 없는 파일은 먼저 "모듈별 위치 가이드"에서 해당 모듈을 찾고, 파일명 == 컴포넌트명 규칙으로 대상을 특정한다.
- 그래도 위치가 불명확하면 `grepSearch` / `fileSearch` 로 심볼을 찾은 뒤 필요한 범위만 읽는다.

### 모듈별 위치 가이드

작업 대상 파일은 아래 모듈 디렉터리에서 찾는다. 대부분 파일명 == 컴포넌트명 규칙을 따른다.

| 모듈 | 경로 | 비고 |
|---|---|---|
| ReachCaster | `src/components/reachcaster/` | 슬롯/시나리오/솔루션 관련 UI |
| DataShot | `src/components/datashot/` | 데이터셋 생성·상세·목록 |
| Scenario | `src/components/scenario/` | 시나리오 스텝(RatioFinder / ReachPredictor) |
| Budget Optimizer | `src/components/budgetoptimizer/` | `BO*` 프리픽스 컴포넌트 |
| SpinX | `src/components/spinx/` | SpinX 챗/심볼/패널 |
| Layout | `src/components/layout/` | GNB, Sidebar, Breadcrumb, Footer 등 공통 레이아웃 |
| Docs | `src/components/docs/` | 문서 페이지·레이아웃 |
| Common | `src/components/common/` | Avatar, Calendar, MediaIcons 등 공용 UI |

### 파일별 핵심 참조 가이드

| 파일 | 핵심 심볼 / 라인 힌트 |
|---|---|
| `src/components/reachcaster/SolutionOutputCard.tsx` | `SolutionOutputCard` 컴포넌트 |
| `src/components/reachcaster/ScenarioComparisonPanel.tsx` | `ScenarioComparisonPanel` 컴포넌트 |
| `src/components/reachcaster/ScenarioComparisonResult.tsx` | `ScenarioComparisonResult` 컴포넌트 |
| `src/components/reachcaster/SlotHome.tsx` | `SlotHome` 컴포넌트 |
| `src/components/reachcaster/SlotHomeSections.tsx` | `SlotHomeSections` 컴포넌트 |
| `src/components/reachcaster/SlotOverview.tsx` | `SlotOverview` 컴포넌트 |
| `src/components/reachcaster/SlotDetail.tsx` | `SlotDetail` 컴포넌트 |
| `src/components/reachcaster/DataInsightCard.tsx` | `DataInsightCard` 컴포넌트 |
| `src/components/reachcaster/IndustryDualBarChart.tsx` | `IndustryDualBarChart` 컴포넌트 |
| `src/components/reachcaster/slotHomeTypes.ts` | 타입 전체 (파일 작음, 전체 읽기 허용) |
| `src/components/datashot/CreateDatasetStep2.tsx` | `CreateDatasetStep2` 컴포넌트 |
| `src/components/datashot/AdProductsSelector.tsx` | `AdProductsSelector` 컴포넌트 |
| `src/components/datashot/DatasetDetail.tsx` | `DatasetDetail` 컴포넌트 |
| `src/components/datashot/DatasetList.tsx` | `DatasetList` 컴포넌트 |
| `src/components/datashot/createDatasetTypes.ts` | 타입 전체 (파일 작음, 전체 읽기 허용) |
| `src/components/scenario/ScenarioStep2RatioFinder.tsx` | `ScenarioStep2RatioFinder` 컴포넌트 |
| `src/components/scenario/ScenarioStep2ReachPredictor.tsx` | `ScenarioStep2ReachPredictor` 컴포넌트 |
| `src/components/scenario/ScenarioStep1.tsx` | `ScenarioStep1` 컴포넌트 |
| `src/components/scenario/constants.ts` | 상수 전체 (파일 작음, 전체 읽기 허용) |
| `src/components/scenario/types.ts` | 타입 전체 (파일 작음, 전체 읽기 허용) |
| `src/components/scenario/utils.ts` | 유틸 함수 전체 (파일 작음, 전체 읽기 허용) |
| `src/components/budgetoptimizer/BOResult.tsx` | `BOResult` 컴포넌트 |
| `src/components/budgetoptimizer/BOCreateScenario.tsx` | `BOCreateScenario` 컴포넌트 |
| `src/components/budgetoptimizer/BOScenarioList.tsx` | `BOScenarioList` 컴포넌트 |
| `src/components/budgetoptimizer/constants.ts` | 상수 전체 (파일 작음, 전체 읽기 허용) |
| `src/components/budgetoptimizer/types.ts` | 타입 전체 (파일 작음, 전체 읽기 허용) |
| `src/components/spinx/SpinXPanel.tsx` | `SpinXPanel` 컴포넌트 |
| `src/components/spinx/useSpinXChat.ts` | `useSpinXChat` 훅 |
| `src/components/spinx/spinxTypes.ts` | 타입 전체 (파일 작음, 전체 읽기 허용) |
| `src/components/layout/GlobalNavBar.tsx` | `GlobalNavBar` 컴포넌트 |
| `src/components/layout/Sidebar.tsx` | `Sidebar` 컴포넌트 |
| `src/components/layout/AppLayout.tsx` | `AppLayout` 컴포넌트 |
| `src/components/layout/Breadcrumb.tsx` | `Breadcrumb` 컴포넌트 |

## 출력 규칙

- 코드 설명 생략, Diff 위주로 출력한다.
- 요약은 핵심 불릿 3개 이내로 간결하게 작성한다.
- 변경되지 않은 코드 블록은 출력하지 않는다.

## 에러 발생 시 규칙

- 에러가 발생해도 전체 파일을 다시 쓰거나 대규모 리팩토링을 임의로 수행하지 않는다.
- 반드시 사용자에게 에러 내용과 예상 원인을 보고하고, 어떤 방식으로 수정할지 먼저 확인한다.
- 사용자 승인 없이 범위를 확장하거나 구조를 변경하지 않는다.

## 작업 순서

1. 파일별 참조 가이드에서 대상 심볼 확인
2. `readCode(selector)` 로 해당 심볼만 조회
3. `strReplace` 또는 `editCode` 로 최소 범위 수정
4. `getDiagnostics` 로 검증
5. Diff + 불릿 요약 출력
