---
inclusion: fileMatch
fileMatchPattern: "**/releaseNotes.ts"
---

# Release Notes 작성 가이드

릴리즈노트 파일(`src/components/docs/content/releaseNotes.ts`) 수정 시 반드시 이 규칙을 따른다.

## 버전 헤더 형식

```
## v{major}.{minor}.{patch} (YYYY-MM-DD)

한 줄 요약 (플랫폼 관점에서 이번 배포의 핵심을 한 문장으로)

---
```

- 날짜는 실제 배포일 기준
- 한 줄 요약은 "ReadySet 플랫폼 ~" 으로 시작

## 카테고리 분류

아래 카테고리만 사용한다. 해당 없는 카테고리는 생략한다.

| 카테고리 | 범위 |
|---|---|
| SlotBoard | 슬롯 생성·관리, Slot Home, Overview |
| Reach Caster | 시나리오 생성·비교·결과, Ratio Finder, Reach Predictor |
| DataShot | 데이터셋 생성·조회·관리, 매체 추가 |
| SpinX | AI 어시스턴트, 모델 관련 |
| GNB · 공통 | GNB, 알림, 다크모드, 가이드 등 UI/UX 공통 기능 |
| 시스템 | DB 마이그레이션, 인프라, 보안, 성능 최적화 |

### 카테고리 판단 기준

- 특정 제품에 속하면 해당 제품 카테고리 사용
- 여러 제품에 걸치는 UX 기능 → `GNB · 공통`
- 사용자에게 직접 보이지 않는 내부 변경 → `시스템`

## 태그 규칙

| 태그 | 사용 조건 |
|---|---|
| `NEW` | 신규 기능 추가 |
| `IMPROVED` | 기존 기능 개선, 성능 향상, 구조 변경 |
| `FIXED` | 버그 수정 |

- 항목당 태그 1개만 사용
- 백틱으로 감싼다: `` \`NEW\` ``

## 항목 작성 규칙

- 한 줄에 하나의 변경사항
- 형식: `- \`TAG\` 기능명 — 부연 설명 (선택)`
- 부연 설명이 짧으면 em dash(—) 없이 한 문장으로
- 사용자 관점에서 무엇이 바뀌었는지 기술 (내부 구현 X)
- 시스템 카테고리는 "서비스 안정성", "성능 개선" 등 사용자 영향 중심으로 표현

### 좋은 예

```
- `IMPROVED` 서비스 안정성을 위한 데이터베이스 구조 최적화
- `NEW` 생성 화면 이탈 방지 (데이터셋 생성, 시나리오 생성)
- `NEW` 시나리오 비교 기능 — 동일 슬롯 내 시나리오 간 결과 비교 분석
```

### 나쁜 예

```
- `IMPROVED` DB 테이블 정규화 및 인덱스 재구성  ← 내부 구현 노출
- `NEW` FormExitGuard 컴포넌트 추가  ← 컴포넌트명 노출
- `IMPROVED` 업데이트  ← 너무 모호
```

## 정렬 순서

1. 버전은 최신이 위 (내림차순)
2. 카테고리 순서: SlotBoard → Reach Caster → DataShot → SpinX → GNB · 공통 → 시스템
3. 카테고리 내 항목은 NEW → IMPROVED → FIXED 순

## updatedAt 필드

- 릴리즈노트 수정 시 `updatedAt` 값을 수정 당일 날짜로 갱신한다
- 형식: `YYYY-MM-DD`
