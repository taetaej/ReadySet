# 브레드크럼 네비게이션 정책 및 정의서

## 문서 정보

| 항목 | 내용 |
|---|---|
| 문서명 | 브레드크럼 네비게이션 정책 및 정의서 |
| 버전 | 1.0 |
| 작성일 | 2026.03.05 |
| 작성자 | AI Assistant |
| 상태 | 승인됨 |

---

## 1. 개요

### 1.1 목적
본 문서는 예측/분석 플랫폼의 브레드크럼 네비게이션 구조와 동작 규칙을 정의하여, 사용자가 현재 위치를 명확히 인지하고 효율적으로 탐색할 수 있도록 합니다.

### 1.2 적용 범위
- 전체 플랫폼의 모든 페이지 (SlotBoard, Slot 상세, 시나리오 생성/결과 등)
- 향후 추가될 솔루션 (Data Shot, Ad Curator, Budget Optimizer 등)

### 1.3 배경
- Slot은 여러 솔루션(Reach Caster, Data Shot 등)의 컨테이너 역할
- 향후 Slot 자체의 홈 화면이 추가될 예정
- 사용자가 현재 어떤 솔루션 영역에 있는지 명확히 인지할 필요

---

## 2. 브레드크럼 구조 정의

### 2.1 계층 구조

```
Level 1: SlotBoard (워크스페이스 홈)
    ↓
Level 2: Slot명 (특정 Slot)
    ↓
Level 3: 솔루션명 (Reach Caster, Data Shot 등)
    ↓
Level 4: 세부 페이지 (시나리오 생성, 결과 등)
```

### 2.2 표시 형식

```
SlotBoard / {Slot명} / {솔루션명} / {세부 페이지명}
```

**구분자**: ChevronRight 아이콘 (Lucide React, size: 14px)

---

## 3. 네비게이션 규칙

### 3.1 클릭 가능 여부

| 레벨 | 항목 | 클릭 가능 | 동작 | 이유 |
|---|---|---|---|---|
| Level 1 | SlotBoard | ✅ 가능 | `/slotboard`로 이동 | 워크스페이스 홈으로 복귀 |
| Level 2 | Slot명 | ❌ 불가능 | - | 향후 Slot 홈 추가 시 혼란 방지 |
| Level 3 | 솔루션명 | ✅ 가능 | 해당 솔루션 홈으로 이동 | 솔루션 내 네비게이션 |
| Level 4 | 세부 페이지명 | ❌ 불가능 | - | 현재 페이지 표시 |

### 3.2 시각적 구분

#### 클릭 가능한 항목
- 색상: `text-muted-foreground` (기본)
- 호버: `hover:text-foreground` (강조)
- 커서: `cursor: pointer`
- 요소: `<button>` 태그

#### 클릭 불가능한 항목 (현재 위치)
- 색상: `text-foreground`
- 폰트 굵기: `font-weight: 500`
- 커서: 기본
- 요소: `<span>` 태그

---

## 4. 페이지별 브레드크럼 정의

### 4.1 SlotBoard (워크스페이스 홈)
```
표시 안 함
```
- 최상위 페이지이므로 브레드크럼 불필요

### 4.2 Slot 생성/수정
```
SlotBoard / 새 Slot 생성
SlotBoard / Slot 수정
```

### 4.3 Slot 상세 (솔루션 홈)
```
SlotBoard / {Slot명} / Reach Caster
SlotBoard / {Slot명} / Data Shot
SlotBoard / {Slot명} / Ad Curator
SlotBoard / {Slot명} / Budget Optimizer
```

**예시**:
```
SlotBoard / 2024 봄 시즌 캠페인 / Reach Caster
```

### 4.4 시나리오 생성
```
SlotBoard / {Slot명} / Reach Caster / 새 시나리오 생성
```

**예시**:
```
SlotBoard / 2024 봄 시즌 캠페인 / Reach Caster / 새 시나리오 생성
```

### 4.5 시나리오 결과
```
SlotBoard / {Slot명} / Reach Caster / {시나리오명}
```

**예시**:
```
SlotBoard / 2024 봄 시즌 캠페인 / Reach Caster / 주요 타겟층 공략 캠페인
```

**구현 참고**:
- Slot 상세 페이지에서 시나리오 클릭 시 `slotData`를 함께 전달
- 결과 페이지에서 `location.state.slotData`로 Slot 정보 수신
- Slot명이 없을 경우 기본값 사용

---

## 5. 솔루션별 명칭 정의

### 5.1 현재 구현된 솔루션

| 솔루션 | 브레드크럼 표시명 | 라우트 |
|---|---|---|
| Reach Caster | Reach Caster | `/reachcaster` |
| Data Shot | Data Shot | `/datashot` |

### 5.2 향후 추가 예정 솔루션

| 솔루션 | 브레드크럼 표시명 | 라우트 (예정) |
|---|---|---|
| Ad Curator | Ad Curator | `/adcurator` |
| Budget Optimizer | Budget Optimizer | `/budgetoptimizer` |

### 5.3 솔루션 아이콘 (향후 추가 예정)

현재는 텍스트만 표시하며, 향후 각 솔루션의 심볼(아이콘)이 디자인되면 텍스트 앞에 추가할 예정입니다.

**예시 (향후)**:
```
SlotBoard / {Slot명} / [Target 아이콘] Reach Caster / 새 시나리오 생성
```

---

## 6. 기술 구현 명세

### 6.1 컴포넌트 구조

```typescript
// src/components/layout/Breadcrumb.tsx

interface BreadcrumbItem {
  label: string          // 표시할 텍스트
  href?: string         // 클릭 시 이동할 경로 (선택)
  onClick?: () => void  // 클릭 이벤트 핸들러 (선택)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}
```

### 6.2 사용 예시

```typescript
// Slot 상세 페이지 (Reach Caster)
<AppLayout
  breadcrumbItems={[
    { label: 'SlotBoard', href: '/slotboard' },
    { label: selectedSlot.title },  // href 없음 = 클릭 불가
    { label: 'Reach Caster' }       // 현재 위치 = 클릭 불가
  ]}
/>

// 시나리오 생성 페이지
<AppLayout
  breadcrumbItems={[
    { label: 'SlotBoard', href: '/slotboard' },
    { label: slotData.title },
    { label: 'Reach Caster', href: '/reachcaster' },
    { label: '새 시나리오 생성' }  // 현재 위치 = 클릭 불가
  ]}
/>

// 시나리오 결과 페이지
<AppLayout
  breadcrumbItems={[
    { label: 'SlotBoard', href: '/slotboard' },
    { label: slotData.title },  // location.state.slotData에서 가져옴
    { label: 'Reach Caster', href: '/reachcaster' },
    { label: scenarioData.name }  // 현재 위치 = 클릭 불가
  ]}
/>
```

**데이터 전달 방법**:
```typescript
// Slot 상세에서 결과 페이지로 이동 시
navigate(resultPath, { 
  state: { 
    scenarioData: scenario,
    slotData: slotData  // Slot 정보 함께 전달
  } 
})

// 결과 페이지에서 수신
const slotData = location.state?.slotData || {
  title: '기본 Slot명',
  advertiser: '기본 광고주',
  advertiserId: 'ADV001'
}
```

### 6.3 스타일 명세

```css
/* 클릭 가능한 항목 */
button {
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: hsl(var(--muted-foreground));
  transition: color 0.2s;
}

button:hover {
  color: hsl(var(--foreground));
}

/* 클릭 불가능한 항목 (현재 위치) */
span {
  font-size: 14px;
  font-weight: 500;
  color: hsl(var(--foreground));
}

/* 구분자 */
.chevron-icon {
  size: 14px;
  color: hsl(var(--muted-foreground));
}
```

---

## 7. 향후 확장 계획

### 7.1 Slot 홈 추가 시

Slot 자체의 홈 화면이 추가되면 다음과 같이 확장:

```
SlotBoard / {Slot명}  ← Slot 홈 (솔루션 선택 화면)
    ↓
SlotBoard / {Slot명} / Reach Caster  ← 솔루션 홈
```

이 경우 Level 2 (Slot명)도 클릭 가능하게 변경:
- 클릭 시 Slot 홈으로 이동
- 여러 솔루션 간 전환 가능

### 7.2 솔루션 아이콘 추가

각 솔루션의 심볼이 디자인되면:
- 솔루션명 앞에 아이콘 추가
- 아이콘 크기: 16px
- 간격: 6px

```typescript
{ 
  label: 'Reach Caster', 
  href: '/reachcaster',
  icon: <Target size={16} />  // 예시
}
```

### 7.3 다국어 지원

향후 다국어 지원 시:
- 솔루션명은 영문 고정 (브랜드 아이덴티티)
- 기타 항목은 다국어 처리

```
SlotBoard / 2024 봄 시즌 캠페인 / Reach Caster / 새 시나리오 생성  (한국어)
SlotBoard / 2024 Spring Campaign / Reach Caster / New Scenario      (영어)
```

---

## 8. 사용자 경험 가이드

### 8.1 네비게이션 패턴

**상위로 이동**:
1. SlotBoard 클릭 → 워크스페이스 홈
2. 솔루션명 클릭 → 해당 솔루션 홈

**동일 레벨 이동**:
- 사이드바(SNB) 사용
- 다른 Slot 또는 시나리오로 직접 이동

### 8.2 컨텍스트 인지

사용자는 브레드크럼을 통해 다음을 즉시 파악:
1. 현재 어떤 Slot에 있는가?
2. 현재 어떤 솔루션을 사용 중인가?
3. 현재 어떤 작업을 하고 있는가?

### 8.3 접근성

- 키보드 네비게이션 지원 (Tab, Enter)
- 스크린 리더 호환
- 충분한 클릭 영역 (최소 44px × 44px)

---

## 9. 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|---|---|---|---|
| 2026.03.05 | 1.0 | 초안 작성 | AI Assistant |

---

## 10. 참고 문서

- `plan/strategic(highlevel)/예측분석_플랫폼_IA_v1.0.md` - 전체 IA 구조
- `plan/spec/Common_Layout_Spec.md` - 공통 레이아웃 명세
- `src/components/layout/Breadcrumb.tsx` - 브레드크럼 컴포넌트 구현

---

## 부록 A: 전체 브레드크럼 매트릭스

| 페이지 | 브레드크럼 | Level 1 클릭 | Level 2 클릭 | Level 3 클릭 | Level 4 클릭 |
|---|---|---|---|---|---|
| SlotBoard | - | - | - | - | - |
| Slot 생성 | SlotBoard / 새 Slot 생성 | ✅ | ❌ | - | - |
| Slot 수정 | SlotBoard / Slot 수정 | ✅ | ❌ | - | - |
| Slot 상세 (R/C) | SlotBoard / {Slot명} / Reach Caster | ✅ | ❌ | ❌ | - |
| 시나리오 생성 | SlotBoard / {Slot명} / Reach Caster / 새 시나리오 생성 | ✅ | ❌ | ✅ | ❌ |
| 시나리오 결과 | SlotBoard / {Slot명} / Reach Caster / {시나리오명} | ✅ | ❌ | ✅ | ❌ |
| Data Shot | SlotBoard / {Slot명} / Data Shot | ✅ | ❌ | ❌ | - |

---

## 부록 B: 코드 체크리스트

새로운 페이지 추가 시 확인 사항:

- [ ] `breadcrumbItems` 배열 정의
- [ ] Level 1 (SlotBoard)에 `href: '/slotboard'` 추가
- [ ] Level 2 (Slot명)에 `href` 없음 확인
- [ ] Level 3 (솔루션명)에 적절한 `href` 추가 (현재 위치가 아닌 경우)
- [ ] Level 4 (세부 페이지)에 `href` 없음 확인
- [ ] 구분자 아이콘 자동 삽입 확인
- [ ] 호버 스타일 동작 확인
- [ ] 키보드 네비게이션 테스트
