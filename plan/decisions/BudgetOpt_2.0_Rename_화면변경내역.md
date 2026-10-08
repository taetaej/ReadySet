# 솔루션명 변경: Budget Optimizer → BudgetOpt 2.0

프론트 전달용 화면 변경 내역입니다. "Budget Optimizer"로 노출되던 모든 사용자 텍스트를 아래 규칙으로 교체했습니다.

---

## 표기 규칙

- **제목(헤더)에만**: `BudgetOpt` 텍스트 + 작은 **무채색 `2.0` 뱃지**
  - 뱃지: 알약형(pill), 배경 `hsl(var(--muted))` / 글자 `hsl(var(--muted-foreground))`, 테두리 없음, 제목보다 작은 폰트(약 11~12px)
  - ⚠️ **primary(그린) 사용 금지** — 그린은 "시스템 판단" 전용 시그니처 색이므로 버전 뱃지엔 쓰지 않음
  - 뱃지는 제목 옆 한 곳에만 (남발 금지)
- **그 외 모든 위치**: 평문 텍스트 `BudgetOpt 2.0` (뱃지 아님)
- **약어**: 기존 `B/O` 그대로 유지 (BudgetOpt이므로 유효)

---

## 화면별 변경 위치

### 제목 (뱃지 적용 — 유일)
- BudgetOpt 2.0 시나리오 목록 화면 상단 제목(h1): `BudgetOpt` + `2.0` 뱃지

### 브레드크럼 (상단 경로)
- 목록 / 시나리오 생성 / 결과 화면의 브레드크럼 라벨 → `BudgetOpt 2.0`
- 브레드크럼 항목의 링크 경로(href) → `/budgetoptimizer`에서 `/budgetopt`로 변경

### URL 라우트
- URL 라우트 `/budgetoptimizer` → `/budgetopt`로 변경 (리다이렉트 없음)
- 하위 경로 포함: `/budgetopt/scenario/new`, `/budgetopt/scenario/:id/result`
- 라우트 정의·navigate·브레드크럼 href·슬롯 솔루션 path 전부 교체

### 공통 레이아웃
- 좌측 사이드바 트리 노드명 → `BudgetOpt 2.0`
- GNB 상단 알림 메시지의 솔루션명 → `BudgetOpt 2.0` (알림 약어 `B/O`는 유지)
- 사용자 등급 카드 내 솔루션 목록명 → `BudgetOpt 2.0`

### 슬롯보드 / 슬롯홈
- Slot Overview 솔루션 카드명 → `BudgetOpt 2.0`
- Slot Solutions 솔루션 목록명 → `BudgetOpt 2.0`
- Solution Output Card 라벨 → `BudgetOpt 2.0`
- 슬롯홈 솔루션 카드 name/설명 → `BudgetOpt 2.0`
- Page Header 집계 카드 라벨 → `BudgetOpt 2.0`

### SpinX
- SpinX 헤더 솔루션명 → `BudgetOpt 2.0`
- 결과 화면 SpinX 인사이트 헤더: "SpinX for BudgetOpt 2.0"
- 결과 화면 SpinX 질문/안내 문구 내 솔루션명 → `BudgetOpt 2.0`

### Docs (문서 페이지)
- Docs 인트로 솔루션 카드 + 워크플로우 단계명 → `BudgetOpt 2.0`
- BudgetOpt 2.0 전용 문서 콘텐츠(제목·본문) → `BudgetOpt 2.0`
- SlotBoard / SpinX / 리소스 문서 내 솔루션 목록·설명 → `BudgetOpt 2.0`
- 릴리즈 노트 → `BudgetOpt 2.0`

---

## 변경하지 않은 것 (의도적 유지)

화면 동작·링크가 깨지지 않도록 아래는 그대로 둡니다. (사용자에게 보이지 않는 내부 식별자)

- **디렉토리명 / 컴포넌트명** (`BO*` 등 내부 명칭)
- **데이터 key / 변수명** (`budgetOptimizer` 등)
- **Docs slug / id** (문서 URL — 바꾸면 링크 깨짐)
- **Docs 이미지 경로**
- **알림 약어** `B/O`
- **일부 색상 매핑 key**: 솔루션 식별 key로 쓰이는 `'Budget Optimizer'` 문자열은 매칭이 깨질 수 있어 key로 유지 (화면 표시 라벨 아님)

---

## 미반영 / 후속 (별도 처리 예정)

- **기획 문서(plan/ 스펙·PRD·정책서)**의 "Budget Optimizer" 표기는 이번 범위에서 제외 — 별도 일괄 반영 예정
- 코드 주석 내 "Budget Optimizer"는 사용자 비노출이라 선택 사항 (미반영)
