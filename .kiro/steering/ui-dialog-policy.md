---
inclusion: auto
---

# Dialog Size Policy

프로젝트 전체에서 사용하는 다이얼로그 사이즈 체계. 새로운 다이얼로그를 만들 때 반드시 이 체계를 따를 것.

## Size Tokens

| Token | CSS Class | Width | 용도 |
|-------|-----------|-------|------|
| `confirm` | `.dialog-confirm` | 기본 (max-width: 32rem) | 삭제 확인, 이동 확인 등 단순 확인/경고 |
| `sm` | `.dialog-sm` | max-width: 500px | 단일 입력, 간단한 설정 (기간 설정, 미지원 매체 안내 등) |
| `md` | `.dialog-md` | max-width: 640px | 타겟 선택, 광고상품 선택 등 중간 복잡도 |
| `lg` | `.dialog-lg` | width: 900px | 업종/지표 선택 등 리스트형 콘텐츠 |
| `xl` | `.dialog-xl` | width: 1200px | 매체 선택 등 복잡한 다중 컬럼 레이아웃 |
| `full` | `.dialog-full` | width: 95vw | 데이터 미리보기 등 전체 화면급 |

## 적용 규칙

- `confirm`: 기존 `.dialog-content` 클래스 그대로 사용 (globals.css 기본값 max-width: 32rem)
- `sm` ~ `full`: `.dialog-content` 위에 사이즈 클래스를 추가로 적용
- 예: `<div className="dialog-content dialog-lg">`
- `width` vs `max-width`: sm/md는 `max-width` (작은 화면 대응), lg/xl/full은 `width` (고정 너비 필요)

## 현재 사용 현황

- **confirm**: DatasetList 삭제/이동, CreateFolder, EditFolder, SlotDetail 삭제/이동, ScenarioComparisonResult 재설정
- **sm (500px)**: ScenarioStep2 기간설정, ComponentLibrary 기본, AdProductsDialog/MetricsDialog 미지원 매체
- **md (640px)**: ScenarioStep2 타겟, AdProductsDialog 광고상품, ReachPredictorResult 리치커브설정/타겟
- **lg (900px)**: DatasetDetailModals 업종/지표, MetricsDialog 지표선택
- **xl (1200px)**: DatasetDetailModals 광고상품, ReachPredictorMediaDialog 매체선택, IndustryDialog 업종선택
- **full (95vw)**: SampleDataModal 데이터 미리보기
