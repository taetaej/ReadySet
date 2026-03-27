# 시나리오 비교 화면 정의서

## 문서 정보
- **작성일**: 2026-03-25
- **버전**: v1.0
- **대상 화면**: 시나리오 비교 설정 패널 + 비교 결과 화면
- **관련 컴포넌트**: `ScenarioComparisonPanel.tsx`, `ScenarioComparisonResult.tsx`

---

## 1. 화면 개요

### 1.1 기능 정의
시나리오 비교는 Reach Caster에서 생성된 시나리오들을 **예산 / 타겟 / 기간** 축으로 비교 분석하여, 캠페인 전략 수립에 필요한 인사이트를 제공하는 기능이다.

### 1.2 비교 유형 (3가지)

| 유형 | 영문명 | 비교 변수 | 권장 고정 조건 | 핵심 질문 |
|------|--------|-----------|---------------|-----------|
| 예산 비교 | Budget Scaling | 광고비 | 기간 · 타겟 동일 | 광고비 증액 시 도달 효율의 한계점은? |
| 타겟 비교 | Target Analysis | 타겟 GRP | 예산 · 기간 동일 | 어떤 타겟이 캠페인에 더 효율적으로 반응하는가? |
| 기간 비교 | Period Analysis | 집행 기간 | 예산 · 타겟 동일 | 어떤 운영 전략(기간/강도)이 더 유리한가? |

### 1.3 진입 경로
- 시나리오 목록 화면(SlotDetail)에서 시나리오 선택 후 "비교" 액션
- 시나리오 결과 화면(RatioFinderResult / ReachPredictorResult)에서 비교 버튼

### 1.4 제약 조건
- 기준 시나리오 1개 + 비교 시나리오 최대 3개 (총 4개)
- 비교 시나리오 최소 1개 이상 선택 시 비교 실행 가능
- 동일 Slot 내 시나리오만 비교 가능

---

## 2. 정합성 체크 (Comparison Health Check)

### 2.1 정합성 레벨

| 레벨 | 영문 | 색상 | 아이콘 | 설명 |
|------|------|------|--------|------|
| 비교 적합 | optimal | `hsl(var(--muted-foreground))` | CheckCircle | 권장 조건 일치, 신뢰도 높은 비교 가능 |
| 조건 일부 상이 | caution | `hsl(38 92% 50%)` (주황) | AlertTriangle | 일부 권장 조건 상이, 결과 해석 시 차이 감안 필요 |
| 비교 부적합 | risk | `hsl(var(--destructive))` (빨강) | XCircle | 권장 조건 대부분 상이, 비교 결과 신뢰도 낮음 |

### 2.2 정합성 판정 로직

**비교 유형별 고정 조건 체크**:

```
예산 비교: 기간 일치 + 타겟 일치 → optimal
           기간 일치 OR 타겟 일치 → caution
           둘 다 불일치 → risk

타겟 비교: 예산 일치 + 기간 일치 → optimal
           예산 일치 OR 기간 일치 → caution
           둘 다 불일치 → risk

기간 비교: 예산 일치 + 타겟 일치 → optimal
           예산 일치 OR 타겟 일치 → caution
           둘 다 불일치 → risk
```

**예산 일치 기준**: 기준 시나리오 대비 ±5% 이내
**기간 일치 기준**: 시작일 · 종료일 완전 일치
**타겟 일치 기준**: 타겟 GRP 배열 정렬 후 완전 일치

### 2.3 전체 정합성 레벨
- 비교 시나리오 중 하나라도 `risk` → 전체 `risk`
- `risk` 없고 하나라도 `caution` → 전체 `caution`
- 모두 `optimal` → 전체 `optimal`

### 2.4 조건 상이 항목 표시 (getConditionDiffs)
비교 유형에 따라 **비교 변수를 제외한** 고정 조건의 차이만 표시:
- 예산 비교: 기간 diff, 타겟 diff (예산 diff는 표시하지 않음)
- 타겟 비교: 예산 diff, 기간 diff (타겟 diff는 표시하지 않음)
- 기간 비교: 예산 diff, 타겟 diff (기간 diff는 표시하지 않음)

---

## 3. 비교 설정 패널 (ScenarioComparisonPanel)

### 3.1 패널 레이아웃

**위치**: 화면 하단 슬라이드업 패널

```
position: fixed
bottom: 0 (열림) / -520px (닫힘)
left: 0, right: 0
height: 520px
z-index: 999
```

**진입 애니메이션**: `bottom: -520px → 0`, 0.3s ease-out

**전체 구조**:
```
┌──────────────────────────────────────────────────────┐
│  [A] 헤더: "시나리오 비교" + 닫기 버튼               │
├──────────────────────────────────────────────────────┤
│                                                      │
│  [B] 비교 유형 선택 (3개 카드)                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│  │ 예산비교 │ │ 타겟비교 │ │ 기간비교 │                │
│  └─────────┘ └─────────┘ └─────────┘                │
│                                                      │
│  [C] 기준 시나리오 + 비교 시나리오 선택                │
│  ┌──────────┐  ┌──────────┐ ┌──────────┐ ┌──┐       │
│  │ 기준(고정)│  │ 비교 1   │ │ 비교 2   │ │+ │       │
│  └──────────┘  └──────────┘ └──────────┘ └──┘       │
│                                                      │
│  [D] 정합성 체크 바                                   │
│  [E] 비교 실행 버튼                                   │
└──────────────────────────────────────────────────────┘
```

### 3.2 비교 유형 카드

| 요소 | 스타일 |
|------|--------|
| 카드 컨테이너 | padding `16px 20px`, borderRadius 10px, border `1px solid hsl(var(--border))`, cursor pointer |
| 선택 시 | border `2px solid hsl(var(--primary))`, backgroundColor `hsl(var(--primary) / 0.05)` |
| 아이콘 | DollarSign / Users / Calendar, 20px, `hsl(var(--foreground))` |
| 타이틀 | 14px, fontWeight 600, Paperlogy |
| 서브타이틀 | 12px, `hsl(var(--muted-foreground))` |
| 설명 | 12px, `hsl(var(--muted-foreground))`, lineHeight 1.5 |
| 권장 조건 | 11px, `hsl(var(--muted-foreground))`, 하단 |

### 3.3 시나리오 선택

**기준 시나리오**: 고정 표시 (수정 불가)
- 뱃지: "기준", primary 배경
- 시나리오명 표시

**비교 시나리오 추가**:
- "+" 버튼 클릭 → 시나리오 선택 드롭다운 표시
- 검색 필드: placeholder "시나리오 검색", Search 아이콘
- 시나리오 목록: 정합성 레벨 아이콘 + 시나리오명 + 조건 정보
- 최대 3개까지 추가 가능

**시나리오 카드 스타일**:

| 요소 | 스타일 |
|------|--------|
| 카드 | padding `12px 16px`, borderRadius 8px, border `1px solid hsl(var(--border))` |
| 시나리오명 | 13px, fontWeight 500 |
| 조건 정보 | 11px, `hsl(var(--muted-foreground))` |
| 정합성 아이콘 | CheckCircle / AlertTriangle / XCircle, 12px |
| 삭제 버튼 | X 아이콘, 14px, ghost 스타일 |

### 3.4 정합성 체크 바

**위치**: 시나리오 선택 영역 하단

| 요소 | 스타일 |
|------|--------|
| 아이콘 | 레벨별 아이콘, 14px |
| 레벨 라벨 | 12px, fontWeight 600, 레벨별 색상 |
| 설명 | 12px, `hsl(var(--muted-foreground))` |
| 상이 항목 뱃지 | 10px, 레벨별 border/background 색상, borderRadius 4px |

### 3.5 비교 실행 버튼

| 상태 | 스타일 |
|------|--------|
| 비활성 | `btn btn-primary`, opacity 0.5, cursor not-allowed |
| 활성 (optimal/caution) | `btn btn-primary`, 정상 |
| 활성 (risk) | `btn btn-primary`, 정상 (경고 표시와 함께) |

**활성 조건**: 비교 유형 선택 + 비교 시나리오 1개 이상

---

## 4. 비교 결과 화면 (ScenarioComparisonResult)

### 4.1 전체 레이아웃

```
┌──────────────────────────────────────────────────────┐
│  [A] 헤더: ← 시나리오 비교 [타입 뱃지]  [재설정][공유]│
├──────────────────────────────────────────────────────┤
│  [B] Health Check 바 (클릭 시 Overview 토글)          │
├──────────────────────────────────────────────────────┤
│  [B-1] Scenario Overview (접기/펼치기)                │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │ 기준  │ │비교1 │ │비교2 │ │비교3 │                │
│  └──────┘ └──────┘ └──────┘ └──────┘                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  [C] 시각화 영역 (비교 유형별 다름)                    │
│                                                      │
│  [D] Performance Comparison 테이블                    │
│                                                      │
└──────────────────────────────────────────────────────┘
│  [SpinX 버튼] ──────────────── [SpinX 패널 (400px)]  │
```

### 4.2 헤더 영역 [A]

**레이아웃**: `(← 뒤로) (타이틀 + 타입 뱃지) ... (재설정)(공유)`

| 요소 | 스타일 | 동작 |
|------|--------|------|
| 뒤로 버튼 | ArrowLeft 16px, `btn btn-ghost btn-sm` | 비교 패널로 복귀 |
| 타이틀 | "시나리오 비교", 16px, fontWeight 600, Paperlogy | — |
| 타입 뱃지 | 비교 유형 아이콘 + subtitle, 13px, `hsl(var(--muted-foreground))` | — |
| 재설정 버튼 | RefreshCw 16px, `btn btn-ghost btn-sm` | 재설정 확인 다이얼로그 |
| 공유 버튼 | Share2 16px, `btn btn-ghost btn-sm` | Export 드롭다운 |

**비교 유형별 뱃지**:

| 유형 | 아이콘 | 텍스트 |
|------|--------|--------|
| budget | DollarSign | Budget Scaling |
| target | Users | Target Analysis |
| period | Calendar | Period Analysis |

**Export 드롭다운**:
- 위치: 공유 버튼 하단 우측 정렬
- 너비: 200px
- 항목: "Export to Excel" (FileSpreadsheet 아이콘)

### 4.3 Health Check 바 [B]

**위치**: 헤더 바로 아래, 전체 너비

| 요소 | 스타일 |
|------|--------|
| 컨테이너 | width 100%, padding `8px 32px`, borderBottom `1px solid hsl(var(--border))`, cursor pointer |
| 정합성 아이콘 | 레벨별 아이콘, 13px, 레벨별 색상 |
| 라벨 | "Comparison Health Check", 12px, fontWeight 600, 레벨별 색상 |
| 설명 | 11px, `hsl(var(--muted-foreground))` |
| 상이 항목 뱃지 | 비교 시나리오별 상이 조건 표시, 10px |
| 토글 | "Scenario Overview" + ChevronUp/Down 14px, 우측 정렬 |

**클릭 동작**: Scenario Overview 영역 접기/펼치기

### 4.4 Scenario Overview [B-1]

**레이아웃**: 시나리오 수만큼 균등 분할 (flex: 1)

**공통 스타일**:
- 각 시나리오 카드: padding `14px 20px`
- 카드 간 구분: `borderLeft: 1px solid hsl(var(--border))`
- 기준 시나리오: `backgroundColor: hsl(var(--muted) / 0.15)`
- 하단 구분선: `borderBottom: 2px solid hsl(var(--border))`

**기준 뱃지**: "기준", 10px, uppercase, primary 배경
**비교 라벨**: "비교 1/2/3", 10px, uppercase, `hsl(var(--muted-foreground))`

**비교 유형별 Overview 구성**:

#### 예산 비교 (Budget Scaling)
- **중점 표시**: 예산 금액 (22px, fontWeight 700)
- 기준 대비 증감률 표시 (11px, `hsl(var(--muted-foreground))`)
- 조건 행: 기간 / 타겟 / 매체 (각 행에 일치 CheckCircle 또는 상이 AlertTriangle 아이콘)

#### 타겟 비교 (Target Analysis)
- **중점 표시**: 타겟 설정 텍스트 (12px, fontWeight 600)
- Target Population 수치 표시
- 조건 행: 광고비 / 기간 / 매체

#### 기간 비교 (Period Analysis)
- **중점 표시**: 기간 날짜 (22px, fontWeight 700, `YYYY.MM.DD → YYYY.MM.DD`)
- 일수 표시 (11px)
- 조건 행: 광고비 / 타겟 / 매체

**조건 행 스타일**:

| 요소 | 스타일 |
|------|--------|
| 행 | `display: flex`, `justifyContent: space-between`, fontSize 11px |
| 라벨 | `hsl(var(--muted-foreground))` |
| 값 | `hsl(var(--foreground))` |
| 일치 아이콘 | CheckCircle 10px, `hsl(var(--muted-foreground))` |
| 상이 아이콘 | AlertTriangle 10px, `hsl(38 92% 50%)` |

---

## 5. 시각화 영역 [C] — 비교 유형별

### 5.1 타겟 비교 시각화

**레이아웃**: 2컬럼 그리드 (`1fr 1fr`, gap 32px)

#### 5.1.1 Reach × CPRP Matrix (좌측)

**차트 타입**: Recharts ScatterChart

**구성**:
- X축: CPRP (원), 역순 (높은 값 → 낮은 값 = 좌 → 우)
- Y축: Reach 1+ (%)
- 버블 크기: Target Population 비례
- 색상: 시나리오별 고유 색상 (foreground 기반, opacity 차등)

**인터랙션**:
- 호버: 시나리오명, Reach 1+, CPRP, Target Population 표시
- 범례: 하단 우측, 11px

#### 5.1.2 Key Metrics Comparison (우측)

**차트 타입**: Recharts ComposedChart (Bar + Line)

**구성**:
- X축: 시나리오명 (기준, 비교1, 비교2...)
- Bar (좌축): Reach 1+ (%), foreground 색상, opacity 차등
- Line (우축): Avg. Frequency, `#B794F6` 색상

**인터랙션**:
- 호버: Reach 1+, Avg. Frequency 값 표시
- 범례: 하단 우측, 11px

### 5.2 예산 비교 시각화

**레이아웃**: 2컬럼 그리드 (`1fr 1fr`, gap 32px)

#### 5.2.1 Unified Reach Curve (좌측)

**차트 타입**: Recharts ComposedChart (Area + Line + ReferenceLine)

**핵심 로직 — 조건 동일/상이에 따른 커브 분기**:
- **조건 동일 시나리오**: 동일한 S-curve 위의 서로 다른 포인트로 표시
  - 하나의 Area + Line으로 S-curve 렌더링
  - 각 시나리오의 예산 위치에 dot 마커 표시
- **조건 상이 시나리오**: 별도의 S-curve 라인으로 표시
  - 독립적인 Line 시리즈 추가
  - 점선(strokeDasharray) 스타일로 구분

**S-curve 생성 로직**:
```
f(x) = maxReach × (1 - e^(-k × x))
- maxReach: 시나리오의 최대 도달률 (약 95%)
- k: 곡률 계수 (시나리오 조건에 따라 다름)
- x: 예산 (억 단위)
```

**차트 구성**:
- X축: 예산 (억 단위), 0 ~ maxBudget × 1.5
- Y축: Reach 1+ (%), 0 ~ 100%
- Area: S-curve 아래 영역, `hsl(var(--foreground) / 0.08)` 채움
- Line: S-curve, `hsl(var(--foreground))`, 2px
- Dot 마커: 각 시나리오 위치, 8px, 시나리오별 색상
- ReferenceLine: 각 시나리오 예산 위치에 수직 점선

**Efficiency Peak 마커**:
- S-curve의 변곡점 (2차 미분 = 0)에 표시
- 스타일: 삼각형 마커 + "Efficiency Peak" 라벨
- 색상: `hsl(var(--muted-foreground))`

**범례**: 하단, 시나리오별 색상 dot + 이름

#### 5.2.2 Budget Summary Table (우측)

**위치**: Unified Reach Curve 우측

**가이드 메시지** (테이블 상단):
- Sparkles 아이콘 (14px) + 텍스트
- 텍스트: "시나리오별 Efficiency Peak를 확인하고, 추가 증액 가능한 Budget Room에 맞춰 예산 최적화 전략을 수립해 보세요."
- 스타일: 12px, `hsl(var(--muted-foreground))`, lineHeight 1.5

**테이블 구조**:

| 컬럼 | 설명 | 스타일 |
|------|------|--------|
| 시나리오 | 시나리오명 + 조건 상이 뱃지 | 12px, fontWeight 500 |
| Planned Budget | 설정 예산 | 12px, 우측 정렬 |
| Efficiency Peak | S-curve 변곡점 예산 | 12px, 우측 정렬 |
| Reach 1+ | 해당 예산의 도달률 | 12px, 우측 정렬 |
| Budget Room | 증액/최적/초과 상태 | 12px, 상태별 색상 |

**Budget Room 값 표현**:

| 상태 | 조건 | 표시 | 색상 |
|------|------|------|------|
| 증액 추천 | Planned < Peak | "+N억 증액 추천" | `hsl(142 71% 45%)` (초록) |
| 최적 | Planned ≈ Peak (±5%) | "최적" | `hsl(var(--muted-foreground))` |
| 효율 저하 | Planned > Peak | "−N억 효율 저하" | `hsl(var(--destructive))` (빨강) |

### 5.3 기간 비교 시각화

**현재**: 차트 없음 (사용자 결정)
**향후**: 기간별 도달률 추이 차트 추가 예정

---

## 6. Performance Comparison 테이블 [D]

### 6.1 테이블 구조

**레이아웃**: 전체 너비, borderRadius 10px, border `1px solid hsl(var(--border))`

**헤더 행**:

| 요소 | 스타일 |
|------|--------|
| 지표 컬럼 | width 180px, textAlign left, 12px, fontWeight 600, `hsl(var(--muted-foreground))` |
| 시나리오 컬럼 | textAlign center, 12px, fontWeight 600 |
| 기준 시나리오 | `hsl(var(--primary))` 색상, `hsl(var(--muted) / 0.5)` 배경 |
| 비교 시나리오 | `hsl(var(--foreground))` 색상 |
| 시나리오명 | 11px, fontWeight 400, `hsl(var(--muted-foreground))`, marginTop 2px |

### 6.2 총 광고비 + 매체별 예산 비중 행

**구성**:
- 총 광고비: 14px, fontWeight 600
- TV/Digital 비율: 10px, `hsl(var(--muted-foreground))`
- StackedBar: 매체별 예산 비중 시각화

**StackedBar 스타일**:
- 높이: 16px
- borderRadius: 3px
- 매체별 색상: foreground 기반, opacity 차등 (0.15 ~ 1.0)
- 호버: 매체명 + 비율 + 금액 표시

### 6.3 지표 행

**지표 카테고리 구분**:

| 카테고리 | 지표 |
|----------|------|
| Reach Flow / Market Scale | Target Population |
| Reach 1+ | Reach 1+, Reach 2+, Reach 3+, Reach 4+, Reach 5+ |
| Efficiency | CPRP, GRPs, Avg. Frequency |
| Volume | Reach Count, Impression, Effective Impression |

**카테고리 행 스타일**: borderTop `2px solid`, 13px, fontWeight 600
**하위 지표 행 스타일**: borderTop `1px solid`, 12px, fontWeight 400, paddingLeft 36px

**비교 유형별 지표 순서 차이**:
- 예산 비교: Market Scale → Reach 1+ → Efficiency → Volume (예산이 변수이므로 Budget 강조)
- 타겟/기간 비교: Reach Flow → Reach 1+ → Efficiency → Volume

### 6.4 Diff Indicator

**위치**: 비교 시나리오 값 우측

| 조건 | 색상 | 표시 |
|------|------|------|
| 긍정적 변화 | `hsl(142 71% 45%)` (초록) | ▲ +값 |
| 부정적 변화 | `hsl(var(--destructive))` (빨강) | ▼ −값 |
| 변화 없음 | 표시 안 함 | — |

**inverse 지표** (낮을수록 좋은 지표): CPRP
- CPRP 감소 → 초록 (긍정), CPRP 증가 → 빨강 (부정)

**포맷**:
- % 지표: `+1.2%p` / `-0.8%p`
- 원 지표: `+₩1,234` / `-₩567`
- 일반 지표: `+1,234` / `-567`

---

## 7. 재설정 다이얼로그

### 7.1 트리거
헤더의 재설정(RefreshCw) 버튼 클릭

### 7.2 다이얼로그 구성

| 요소 | 스타일 |
|------|--------|
| 오버레이 | `dialog-overlay` 클래스 |
| 컨테이너 | `dialog-content` 클래스 (confirm 사이즈) |
| 제목 | "비교를 재설정하시겠습니까?", `dialog-title` |
| 설명 | "현재 비교 결과가 초기화되고 시나리오 선택 화면으로 돌아갑니다.", `dialog-description` |
| 취소 버튼 | `btn btn-secondary btn-sm` |
| 재설정 버튼 | `btn btn-primary btn-sm` |

---

## 8. SpinX 연동

### 8.1 SpinX 버튼 위치
- 비교 결과 화면 우측 하단 고정
- 패널 열림 시 `right: 424px`로 이동

### 8.2 SpinX 패널
- `positioning: 'absolute'` (비교 결과 내부)
- 비교 결과 컨텍스트 기반 요약 및 추천 질문 생성
- 세션 키: `comparisonId × userId`

---

## 9. 인터랙션 플로우

### 9.1 비교 설정 → 결과

```
1. 시나리오 목록/결과 화면에서 비교 진입
2. 비교 설정 패널 슬라이드업
3. 비교 유형 선택 (예산/타겟/기간)
4. 비교 시나리오 1~3개 추가
5. 정합성 체크 결과 확인
6. "비교 실행" 클릭
7. 비교 결과 화면 렌더링
```

### 9.2 결과 화면 내 인터랙션

```
1. Health Check 바 클릭 → Scenario Overview 토글
2. 차트 호버 → 툴팁 표시
3. Performance 테이블 스크롤 → 지표별 비교
4. SpinX 버튼 → AI 인사이트 패널
5. 재설정 → 확인 다이얼로그 → 비교 패널로 복귀
6. Export → Excel 다운로드
```

---

## 10. 공통 사항

### 10.1 다크모드 지원
- 모든 색상은 CSS 변수 사용
- 차트 색상은 isDarkMode prop으로 분기 처리
- 정합성 레벨 색상은 다크모드 자동 대응

### 10.2 폰트
- 기본: Paperlogy, sans-serif
- 크기:
  - 헤더 타이틀: 16px
  - 섹션 타이틀: 20px
  - Overview 중점 값: 22px
  - 테이블 카테고리: 13-14px
  - 테이블 내용: 12-13px
  - 보조 정보: 10-11px

### 10.3 반응형
- 비교 설정 패널: 하단 고정, 전체 너비
- 비교 결과: 스크롤 가능 (`overflowY: auto`)
- 차트: 부모 컨테이너 너비 100%
- SpinX 패널 열림 시: `marginRight: 400px` 전환

### 10.4 접근성
- 버튼: 키보드 접근 가능 (button 태그)
- 정합성 레벨: 색상 + 아이콘 + 텍스트 3중 표현
- 다이얼로그: ESC로 닫기
- title 속성: 재설정 버튼 "비교 재설정"

---

## 11. 향후 개선 사항

### 11.1 단기
- [ ] 기간 비교 전용 차트 추가
- [ ] Export to PDF 기능
- [ ] 비교 결과 공유 링크

### 11.2 중기
- [ ] 비교 시나리오 4개 이상 지원
- [ ] 복합 비교 (예산 + 타겟 동시 비교)
- [ ] 비교 결과 저장 및 이력 관리

### 11.3 장기
- [ ] AI 기반 최적 시나리오 추천
- [ ] 비교 결과 기반 자동 리포트 생성
- [ ] 팀 공유 및 코멘트 기능

---

## 12. 참고 자료

### 12.1 관련 컴포넌트
- `src/components/reachcaster/ScenarioComparisonPanel.tsx`: 비교 설정 패널
- `src/components/reachcaster/ScenarioComparisonResult.tsx`: 비교 결과 화면
- `src/components/spinx/SpinXPanel.tsx`: SpinX AI 패널
- `src/components/spinx/SpinXButton.tsx`: SpinX 호출 버튼

### 12.2 디자인 시스템
- 색상: CSS 변수 기반 (`hsl(var(--foreground))`, `hsl(var(--muted-foreground))`)
- 폰트: Paperlogy, sans-serif
- 간격: 4px 단위 (4, 6, 8, 10, 12, 14, 16, 20, 24, 32px)
- 둥근 모서리: 4px (뱃지), 6px (바), 8px (카드), 10px (테이블), 12px (패널)
- 다이얼로그: `ui-dialog-policy.md` 참조 (confirm 사이즈)
