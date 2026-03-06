# DataShot 개발 가이드 (은서님 전용)

## 📋 문서 정보
- **작성일**: 2026-03-05
- **대상**: 은서님 (DataShot 화면 개발 담당)
- **목적**: 프로젝트 이해 및 안전한 작업 가이드 제공

---

## 🎯 1. 프로젝트 개요

### 1.1 예측/분석 플랫폼이란?

이 프로젝트는 **광고 캠페인 예측 및 분석을 위한 통합 플랫폼**입니다.

```
예측/분석 플랫폼
├── Reach Caster (구현 완료) ✅
│   └── 광고 도달률 예측 및 예산 배분 최적화123
├── Data Shot (은서님 담당) 🎯
│   └── 데이터 분석 및 인사이트 제공
├── Ad Curator (준비중)
└── Budget Optimizer (준비중)
```

### 1.2 핵심 개념

#### Slot (슬롯)
- **정의**: 광고주별 작업 공간 (폴더 개념)
- **예시**: "삼성 갤럭시 S24 캠페인", "현대자동차 신차 출시"
- **역할**: 여러 솔루션(Reach Caster, Data Shot 등)의 시나리오를 담는 컨테이너

#### 시나리오
- **정의**: 각 솔루션에서 실행하는 분석 단위
- **예시**: "주요 타겟층 공략 캠페인", "예산 최적화 분석"
- **상태**: 대기중 → 처리중 → 완료/오류

#### 계층 구조
```
SlotBoard (워크스페이스)
  └── Slot (광고주별 폴더)
      ├── Reach Caster (솔루션)
      │   └── 시나리오들
      └── Data Shot (솔루션) ← 은서님 작업 영역
          └── 시나리오들
```

---

## 📂 2. 프로젝트 구조 이해

### 2.1 전체 폴더 구조

```
src/
├── components/
│   ├── layout/              # 공통 레이아웃 (건드리지 마세요!)
│   │   ├── AppLayout.tsx    # 전체 페이지 래퍼
│   │   ├── GlobalNavBar.tsx # 상단 네비게이션
│   │   ├── Sidebar.tsx      # 좌측 사이드바
│   │   ├── Breadcrumb.tsx   # 경로 표시
│   │   └── Footer.tsx       # 하단 푸터
│   │
│   ├── common/              # 공통 컴포넌트 (재사용 가능)
│   │   ├── Avatar.tsx       # 프로필 아바타
│   │   ├── SplashCursor.tsx # 커서 효과
│   │   └── SplitText.tsx    # 텍스트 애니메이션
│   │
│   ├── reachcaster/         # Reach Caster 전용 (참고만 하세요)
│   │   ├── WorkspaceLayout.tsx
│   │   ├── CreateScenario.tsx
│   │   ├── SlotHeader.tsx   # ⭐ 이거 재사용하세요!
│   │   └── ... (기타 파일들)
│   │
│   └── datashot/            # 🎯 은서님 작업 폴더
│       └── DataShotDetail.tsx  # 현재 구현된 파일
│
├── styles/
│   └── globals.css          # 전역 스타일
│
├── utils/
│   └── theme.ts             # 다크모드 관리
│
└── App.tsx                  # 라우팅 설정
```

### 2.2 은서님이 작업할 폴더

```
src/components/datashot/
```

**이 폴더 안에서만 작업하시면 됩니다!** 다른 폴더는 건드리지 마세요.

---

## 🔍 3. 현재 구현 상태

### 3.1 이미 구현된 것들 (사용 가능)

#### ✅ 레이아웃 시스템
- **AppLayout**: 전체 페이지 구조 (GNB + Sidebar + 메인 콘텐츠)
- **SlotHeader**: Slot 정보 표시 헤더 (재사용 권장!)
- **Breadcrumb**: 경로 표시 (자동 생성)

#### ✅ 공통 컴포넌트
- **Avatar**: 프로필 아바타 (광고주 표시용)
- **다크모드**: 자동 지원 (별도 작업 불필요)

#### ✅ 라우팅
- `/datashot` → DataShot 상세 페이지

### 3.2 현재 DataShot 구현 상태

**파일**: `src/components/datashot/DataShotDetail.tsx`

```typescript
// 현재 구현된 내용
- AppLayout 사용 (레이아웃 자동 적용)
- SlotHeader 사용 (Slot 정보 표시)
- Breadcrumb 자동 생성
- 다크모드 지원
- "은서 작업 예정" 플레이스홀더
```

**화면 구성**:
```
┌─────────────────────────────────────────┐
│  GNB (상단 네비게이션)                    │
├──────┬──────────────────────────────────┤
│      │ Breadcrumb: SlotBoard / Slot명 / Data Shot
│ SNB  ├──────────────────────────────────┤
│ (좌) │ SlotHeader (Slot 정보)            │
│      ├──────────────────────────────────┤
│      │                                   │
│      │  "은서 작업 예정"                  │
│      │  (여기를 채워야 합니다!)           │
│      │                                   │
├──────┴──────────────────────────────────┤
│  Footer (하단)                           │
└─────────────────────────────────────────┘
```

---

## 🛠️ 4. 개발 시작하기

### 4.1 개발 환경 설정

```bash
# 1. 프로젝트 폴더로 이동
cd C:\Users\Mezzomedia\Desktop\ReadySet

# 2. 의존성 설치 (처음 한 번만)
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 확인
# http://localhost:5173/datashot
```

### 4.2 파일 구조 만들기

**추천 구조**:
```
src/components/datashot/
├── DataShotDetail.tsx       # 메인 페이지 (이미 있음)
├── DataShotList.tsx         # 시나리오 목록 (새로 만들기)
├── DataShotCard.tsx         # 시나리오 카드 (새로 만들기)
├── CreateDataShot.tsx       # 시나리오 생성 (새로 만들기)
├── DataShotResult.tsx       # 결과 화면 (새로 만들기)
├── types.ts                 # 타입 정의 (새로 만들기)
└── constants.ts             # 상수 정의 (새로 만들기)
```

---

## 📝 5. 코딩 가이드

### 5.1 기본 템플릿

#### 새 컴포넌트 만들기

```typescript
// src/components/datashot/DataShotList.tsx
import { useState } from 'react'

export function DataShotList() {
  const [scenarios, setScenarios] = useState([])

  return (
    <div className="datashot-list">
      <h2>DataShot 시나리오 목록</h2>
      {/* 여기에 코드 작성 */}
    </div>
  )
}
```

### 5.2 공통 컴포넌트 사용하기

#### AppLayout 사용 (필수!)

```typescript
import { AppLayout } from '../layout/AppLayout'

export function MyComponent() {
  return (
    <AppLayout
      currentView="datashot"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', href: '/slotboard' },
        { label: 'Slot명' },
        { label: 'Data Shot' }
      ]}
    >
      {/* 여기에 내용 작성 */}
    </AppLayout>
  )
}
```

#### SlotHeader 사용 (권장!)

```typescript
import { SlotHeader } from '../reachcaster/SlotHeader'

const slotData = {
  title: '삼성 갤럭시 S24 캠페인',
  advertiser: '삼성전자',
  advertiserId: 'ADV001',
  visibility: 'Internal',
  results: 5,
  modified: '2024-01-15',
  description: '캠페인 설명'
}

<SlotHeader 
  slotId={1}
  slotData={slotData}
  onEdit={() => console.log('수정')}
  onDelete={() => console.log('삭제')}
/>
```

#### Avatar 사용

```typescript
import { Avatar } from '../common/Avatar'

<Avatar 
  name="삼성전자" 
  size={32} 
/>
```

### 5.3 스타일링 가이드

#### CSS 변수 사용 (다크모드 자동 지원)

```css
/* 좋은 예 ✅ */
.my-component {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}

/* 나쁜 예 ❌ */
.my-component {
  background: #ffffff;  /* 다크모드에서 안 보임! */
  color: #000000;
}
```

#### 주요 CSS 변수

```css
--background         /* 배경색 */
--foreground         /* 텍스트 색 */
--primary            /* 강조 색 (파란색) */
--primary-foreground /* Primary 위의 텍스트 */
--muted              /* 보조 배경 */
--muted-foreground   /* 보조 텍스트 */
--border             /* 테두리 색 */
--destructive        /* 삭제/에러 색 (빨간색) */
```

### 5.4 아이콘 사용하기

```typescript
import { Database, ArrowRight, Search } from 'lucide-react'

<Database size={16} />
<ArrowRight size={20} />
<Search size={24} />
```

**아이콘 참고 문서**: `guide/Lucide_Icon_Usage_Reference.md`

---

## 🚨 6. 안전한 작업 가이드

### 6.1 절대 건드리지 말아야 할 것들 ⛔

```
❌ src/components/layout/        (레이아웃 시스템)
❌ src/components/reachcaster/   (Reach Caster 코드)
❌ src/components/common/        (공통 컴포넌트)
❌ src/App.tsx                   (라우팅 설정)
❌ src/styles/globals.css        (전역 스타일)
```

### 6.2 작업해도 되는 것들 ✅

```
✅ src/components/datashot/      (DataShot 전용 폴더)
   - 이 폴더 안에서 자유롭게 파일 생성/수정
   - 하위 폴더도 만들어도 됨
```

### 6.3 다른 파일 참고하기

#### Reach Caster 코드 참고 (복사는 OK, 수정은 NO)

```typescript
// ✅ 좋은 예: 참고해서 비슷하게 만들기
// src/components/reachcaster/SlotListItem.tsx 보고
// src/components/datashot/DataShotListItem.tsx 만들기

// ❌ 나쁜 예: Reach Caster 파일 직접 수정
// src/components/reachcaster/SlotListItem.tsx 수정 금지!
```

### 6.4 Git 사용 시 주의사항

```bash
# 1. 작업 전 항상 최신 코드 받기
git pull

# 2. datashot 폴더만 커밋하기
git add src/components/datashot/
git commit -m "DataShot: 시나리오 목록 구현"

# 3. 실수로 다른 파일 수정했다면
git checkout src/components/reachcaster/SlotHeader.tsx  # 되돌리기
```

---

## 📚 7. 참고 문서

### 7.1 필수 읽기 문서

1. **화면 스펙 가이드**
   - 파일: `guide/Screen_Specification_Guide.md`
   - 내용: 화면 설계 방법

2. **아이콘 사용법**
   - 파일: `guide/Lucide_Icon_Usage_Reference.md`
   - 내용: 아이콘 종류 및 사용법

3. **공통 레이아웃 스펙**
   - 파일: `plan/spec/Common_Layout_Spec.md`
   - 내용: GNB, SNB, Breadcrumb 구조

### 7.2 참고용 문서

1. **프로젝트 정책서**
   - 파일: `plan/strategic(highlevel)/예측분석_고도화_프로젝트_정책서_v0.1.md`
   - 내용: 전체 시스템 정책

2. **플랫폼 IA**
   - 파일: `plan/strategic(highlevel)/예측분석_플랫폼_IA_v1.0.md`
   - 내용: 전체 구조 및 화면 흐름

3. **컴포넌트 구조**
   - 파일: `COMPONENT_STRUCTURE.md`
   - 내용: 폴더 구조 설명

---

## 🎨 8. 디자인 가이드

### 8.1 색상 시스템

```typescript
// Primary (강조)
className="bg-primary text-primary-foreground"

// Muted (보조)
className="bg-muted text-muted-foreground"

// Destructive (삭제/에러)
className="bg-destructive text-destructive-foreground"

// Border
className="border border-border"
```

### 8.2 간격 시스템

```typescript
// Padding
className="p-4"   // 16px
className="p-6"   // 24px
className="p-8"   // 32px

// Margin
className="mb-4"  // margin-bottom: 16px
className="mt-6"  // margin-top: 24px

// Gap
className="gap-4" // 16px
```

### 8.3 폰트 크기

```typescript
className="text-sm"   // 14px
className="text-base" // 16px
className="text-lg"   // 18px
className="text-xl"   // 20px
className="text-2xl"  // 24px
```

---

## 🔧 9. 개발 팁

### 9.1 디버깅

```typescript
// 콘솔 로그 활용
console.log('현재 상태:', scenarios)
console.log('클릭 이벤트:', event)

// React DevTools 사용
// 크롬 확장 프로그램 설치 후 사용
```

### 9.2 에러 해결

#### "Cannot find module" 에러
```bash
# 해결: 의존성 재설치
npm install
```

#### "Unexpected token" 에러
```typescript
// 해결: import 경로 확인
import { Avatar } from '../common/Avatar'  // ✅
import { Avatar } from './common/Avatar'   // ❌
```

#### 화면이 안 나올 때
```typescript
// 1. 라우팅 확인 (App.tsx)
<Route path="/datashot" element={<DataShotDetail />} />

// 2. export 확인
export function DataShotDetail() { ... }  // ✅
function DataShotDetail() { ... }         // ❌
```

### 9.3 코드 정리

```bash
# 코드 포맷팅 (자동 정렬)
npm run format  # (있다면)

# 또는 VS Code에서
# Shift + Alt + F (Windows)
# Shift + Option + F (Mac)
```

---

## 📞 10. 도움 요청하기

### 10.1 질문하기 전 체크리스트

- [ ] 에러 메시지를 읽어봤나요?
- [ ] 콘솔에 로그를 찍어봤나요?
- [ ] 비슷한 코드(Reach Caster)를 참고했나요?
- [ ] 문서를 읽어봤나요?

### 10.2 질문 템플릿

```
[문제 상황]
- 무엇을 하려고 했나요?
- 어떤 에러가 발생했나요?

[시도한 것]
- 어떤 방법을 시도했나요?

[코드]
- 관련 코드를 첨부해주세요

[스크린샷]
- 에러 화면을 캡처해주세요
```

---

## ✅ 11. 체크리스트

### 11.1 작업 시작 전

- [ ] 개발 서버가 실행되나요? (`npm run dev`)
- [ ] `/datashot` 페이지가 보이나요?
- [ ] 다크모드 전환이 되나요?
- [ ] 참고 문서를 읽었나요?

### 11.2 코드 작성 시

- [ ] `src/components/datashot/` 폴더 안에서 작업하고 있나요?
- [ ] CSS 변수를 사용하고 있나요? (다크모드 지원)
- [ ] 공통 컴포넌트를 재사용하고 있나요?
- [ ] import 경로가 올바른가요?

### 11.3 커밋 전

- [ ] 다른 폴더 파일을 수정하지 않았나요?
- [ ] 에러 없이 실행되나요?
- [ ] 다크모드에서도 잘 보이나요?
- [ ] 커밋 메시지가 명확한가요?

---

## 🚀 12. 다음 단계

### 12.1 첫 번째 작업 추천

1. **시나리오 목록 만들기**
   - 파일: `DataShotList.tsx`
   - 참고: `reachcaster/SlotListItem.tsx`

2. **시나리오 카드 만들기**
   - 파일: `DataShotCard.tsx`
   - 참고: `reachcaster/SlotCard.tsx`

3. **DataShotDetail에 목록 추가**
   - 기존 "은서 작업 예정" 부분을 목록으로 교체

### 12.2 학습 순서

```
1단계: 기존 코드 이해하기
  └── DataShotDetail.tsx 읽기
  └── Reach Caster 코드 참고

2단계: 간단한 컴포넌트 만들기
  └── DataShotCard.tsx (카드 UI)
  └── DataShotList.tsx (목록 UI)

3단계: 기능 추가하기
  └── 검색/필터 기능
  └── 정렬 기능

4단계: 시나리오 생성 화면
  └── CreateDataShot.tsx
  └── 폼 입력 처리

5단계: 결과 화면
  └── DataShotResult.tsx
  └── 차트/테이블 표시
```

---

## 📖 부록: 자주 사용하는 코드 스니펫

### A. 버튼

```typescript
// Primary 버튼
<button className="btn-primary">
  클릭하세요
</button>

// Ghost 버튼
<button className="btn-ghost">
  취소
</button>

// 아이콘 버튼
<button className="btn-icon">
  <Search size={16} />
</button>
```

### B. 입력 필드

```typescript
// 텍스트 입력
<input 
  type="text"
  placeholder="입력하세요"
  className="input"
/>

// 검색 입력
<div className="search-input">
  <Search size={16} />
  <input type="text" placeholder="검색..." />
</div>
```

### C. 카드

```typescript
<div className="card">
  <div className="card-header">
    <h3>제목</h3>
  </div>
  <div className="card-content">
    내용
  </div>
</div>
```

### D. 테이블

```typescript
<table className="table">
  <thead>
    <tr>
      <th>컬럼1</th>
      <th>컬럼2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>데이터1</td>
      <td>데이터2</td>
    </tr>
  </tbody>
</table>
```

---

## 🎉 마무리

이 가이드를 따라하시면 안전하게 DataShot 화면을 개발하실 수 있습니다!

**기억하세요**:
1. `src/components/datashot/` 폴더 안에서만 작업
2. 다른 폴더는 참고만, 수정은 절대 금지
3. 공통 컴포넌트 적극 활용
4. 막히면 Reach Caster 코드 참고
5. 문서를 자주 읽기

**화이팅! 🚀**
