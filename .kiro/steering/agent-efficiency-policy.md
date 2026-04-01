---
inclusion: always
---

# Agent Efficiency Policy (최상위 지침)

이 파일은 모든 작업에 항상 적용되는 최상위 운영 지침입니다.

## 컨텍스트 참조 제한

- 현재 요청 포함 최근 3개의 대화만 참조한다.
- 그 이전 컨텍스트는 무시한다.
- 오래된 컨텍스트가 필요한 경우 사용자에게 명시적으로 재제공을 요청한다.

## 파일 읽기 규칙

- 수정 전 전체 파일을 읽지 않는다.
- 아래 파일별 핵심 참조 가이드를 먼저 확인하고, 필요한 심볼/섹션만 타겟 조회한다.
- `readCode(selector)` 또는 `readFile(start_line, end_line)` 으로 범위를 한정한다.

### 파일별 핵심 참조 가이드

| 파일 | 핵심 심볼 / 라인 힌트 |
|---|---|
| `src/components/reachcaster/SolutionOutputCard.tsx` | `SolutionOutputCard` 컴포넌트 |
| `src/components/reachcaster/ScenarioComparisonPanel.tsx` | `ScenarioComparisonPanel` 컴포넌트 |
| `src/components/reachcaster/ScenarioComparisonResult.tsx` | `ScenarioComparisonResult` 컴포넌트 |
| `src/components/reachcaster/SlotHome.tsx` | `SlotHome` 컴포넌트 |
| `src/components/reachcaster/SlotOverview.tsx` | `SlotOverview` 컴포넌트 |
| `src/components/reachcaster/DataInsightCard.tsx` | `DataInsightCard` 컴포넌트 |
| `src/components/reachcaster/IndustryDualBarChart.tsx` | `IndustryDualBarChart` 컴포넌트 |
| `src/components/datashot/CreateDatasetStep2.tsx` | `CreateDatasetStep2` 컴포넌트 |
| `src/components/datashot/AdProductsSelector.tsx` | `AdProductsSelector` 컴포넌트 |
| `src/components/scenario/ScenarioStep2RatioFinder.tsx` | `ScenarioStep2RatioFinder` 컴포넌트 |
| `src/components/scenario/ScenarioStep2ReachPredictor.tsx` | `ScenarioStep2ReachPredictor` 컴포넌트 |
| `src/components/scenario/constants.ts` | 상수 전체 (파일 작음, 전체 읽기 허용) |
| `src/components/scenario/types.ts` | 타입 전체 (파일 작음, 전체 읽기 허용) |

## 출력 규칙

- 코드 설명 생략, Diff 위주로 출력한다.
- 요약은 핵심 불릿 3개 이내로 간결하게 작성한다.
- 변경되지 않은 코드 블록은 출력하지 않는다.

## 작업 순서

1. 파일별 참조 가이드에서 대상 심볼 확인
2. `readCode(selector)` 로 해당 심볼만 조회
3. `strReplace` 또는 `editCode` 로 최소 범위 수정
4. `getDiagnostics` 로 검증
5. Diff + 불릿 요약 출력
