# Reborn 프로젝트 마이그레이션 가이드

> 현재 ReadySet 프로젝트의 컴포넌트/스타일/설정을 신규 프로젝트(Reborn)로 이식하기 위한 가이드.

---

## 1. 새 프로젝트 스캐폴딩

```bash
npm create vite@latest reborn -- --template react-ts
cd reborn
```

---

## 2. 의존성 설치

`package.json`에 아래 패키지를 그대로 복사 후 `npm install`.

```json
{
  "dependencies": {
    "date-fns": "^4.1.0",
    "echarts": "^6.0.0",
    "echarts-for-react": "^3.0.6",
    "framer-motion": "^12.38.0",
    "gsap": "^3.14.2",
    "lucide-react": "^0.263.1",
    "motion": "^12.38.0",
    "react": "^18.2.0",
    "react-day-picker": "^9.13.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.13.0",
    "recharts": "^3.7.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@types/react-router-dom": "^5.3.3",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

> `frappe-gantt`, `frappe-gantt-react`, `ogl`은 신규 프로젝트에서 사용 여부에 따라 선택적으로 포함.

---

## 3. Tailwind CSS 설치

현재 ReadySet은 Tailwind 설정 파일이 별도 없이 CDN 또는 PostCSS 방식을 사용하고 있음.  
신규 프로젝트에서는 Tailwind를 정식 설치:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## 4. 복사해야 할 파일 목록

### 4-1. 설정 파일

| 원본 경로 | 대상 경로 | 비고 |
|-----------|-----------|------|
| `vite.config.ts` | `vite.config.ts` | 그대로 복사 |
| `tsconfig.json` | `tsconfig.json` | 그대로 복사 |
| `tsconfig.node.json` | `tsconfig.node.json` | 그대로 복사 |
| `index.html` | `index.html` | 폰트 태그 확인 후 복사 |

### 4-2. 폰트

```
public/fonts/PaperlogyRegular.woff2
public/fonts/PaperlogyMedium.woff2
public/fonts/PaperlogyBold.woff2
```

→ 신규 프로젝트 `public/fonts/` 에 동일하게 복사.

### 4-3. 글로벌 스타일 (핵심)

```
src/styles/globals.css
```

전체 복사. 키 컬러 변경은 아래 **섹션 5** 참고.

### 4-4. 유틸리티

```
src/utils/theme.ts
src/utils/maskEmail.ts
```

### 4-5. Hooks

```
src/hooks/useSidebarState.ts
```

### 4-6. 레이아웃 컴포넌트 (GNB 포함, 전체 복사)

```
src/components/layout/AppLayout.tsx
src/components/layout/GlobalNavBar.tsx
src/components/layout/Sidebar.tsx
src/components/layout/Breadcrumb.tsx
src/components/layout/Footer.tsx
src/components/layout/GradeCard.tsx
src/components/layout/index.ts
```

### 4-7. 공통 컴포넌트

```
src/components/common/Avatar.tsx
src/components/common/Calendar.tsx
src/components/common/CircularText.tsx
src/components/common/MediaIcons.tsx
src/components/common/SplashCursor.tsx
src/components/common/SplitText.tsx
```

### 4-8. 도메인 컴포넌트 (필요한 것만 선택)

아래는 현재 프로젝트에 있는 도메인 컴포넌트 폴더 목록.  
신규 프로젝트에서 재사용할 것들만 골라서 복사:

```
src/components/reachcaster/   ← ReachCaster 관련 전체
src/components/scenario/      ← Scenario 관련 전체
src/components/datashot/      ← DataShot 관련 전체
src/components/spinx/         ← SpinX 패널
src/components/docs/          ← 필요시
```

### 4-9. Mock 데이터

신규 스펙에서 Mock 데이터는 `/mock` 또는 `/data` 폴더로 관리.  
현재 프로젝트의 `sampleData.ts` 등은 아래로 이동:

```
src/components/datashot/sampleData.ts  →  src/mock/datashot.ts
src/components/scenario/constants.ts   →  src/mock/scenario.ts  (또는 src/data/scenario.ts)
```

### 4-10. App 엔트리

```
src/App.tsx
src/main.tsx
```

라우팅 구조는 신규 프로젝트 IA에 맞게 수정 필요.

---

## 5. 키 컬러 변경 방법

모든 컬러는 `src/styles/globals.css`의 CSS 변수 한 곳에서 관리됨.  
강조 컬러/그라데이션만 아래 변수를 수정하면 전체 반영됨:

### 현재 (모노크롬 기반)

```css
:root {
  --primary: 0 0% 9%;           /* 거의 검정 */
  --ring:    0 0% 3.9%;
}
.dark {
  --primary: 0 0% 98%;          /* 거의 흰색 */
  --ring:    0 0% 83.1%;
}
```

### 예시: 블루 계열 강조 컬러로 변경

```css
:root {
  --primary: 221 83% 53%;       /* #3B82F6 Blue */
  --ring:    221 83% 53%;
}
.dark {
  --primary: 217 91% 60%;       /* 라이트한 블루 */
  --ring:    217 91% 60%;
}
```

### 그라데이션 배경 변경

`globals.css`의 `.workspace--slotboard` 클래스 또는 신규 페이지별 클래스에서:

```css
/* 예시: 퍼플-블루 그라데이션 */
.workspace--hero {
  background: linear-gradient(135deg,
    hsl(250, 40%, 96%) 0%,
    hsl(220, 50%, 95%) 50%,
    hsl(200, 45%, 94%) 100%);
}
.dark .workspace--hero {
  background: linear-gradient(135deg,
    hsl(250, 20%, 5%) 0%,
    hsl(220, 25%, 4.5%) 50%,
    hsl(200, 22%, 4%) 100%);
}
```

### JS에서 동적 변경 (런타임)

`src/utils/theme.ts`의 `updateBrandColors()` 함수 활용:

```ts
import { updateBrandColors } from '@/utils/theme'

updateBrandColors({
  primary: '221 83% 53%',   // HSL 값
  accent:  '250 60% 55%',
})
```

---

## 6. `main.tsx` 글로벌 스타일 import 확인

```tsx
// src/main.tsx
import './styles/globals.css'   // 반드시 포함
```

---

## 7. 폴더 구조 (신규 프로젝트 권장)

```
src/
├── components/
│   ├── common/       ← 공통 UI
│   ├── layout/       ← GNB, Sidebar, AppLayout
│   └── [도메인]/     ← 기능별 컴포넌트
├── mock/             ← Mock 데이터 (신규 정책)
├── hooks/
├── styles/
│   └── globals.css
└── utils/
    ├── theme.ts
    └── maskEmail.ts
```

---

## 8. 체크리스트

- [ ] `npm create vite` 프로젝트 생성
- [ ] `package.json` 의존성 복사 후 `npm install`
- [ ] Tailwind CSS 설치 및 `tailwind.config.js` 생성
- [ ] `public/fonts/` 폰트 파일 복사
- [ ] `src/styles/globals.css` 복사
- [ ] `src/utils/`, `src/hooks/` 복사
- [ ] `src/components/layout/` 전체 복사 (GNB)
- [ ] `src/components/common/` 전체 복사
- [ ] 도메인 컴포넌트 선택 복사
- [ ] Mock 데이터를 `src/mock/` 폴더로 재배치
- [ ] `globals.css`에서 키 컬러 CSS 변수 수정
- [ ] `App.tsx` 라우팅 신규 IA에 맞게 작성
- [ ] `main.tsx`에 `globals.css` import 확인
- [ ] `npm run dev` 로컬 실행 확인

---

## 참고: 현재 프로젝트와 신규 스펙 비교

| 항목 | ReadySet (현재) | Reborn (신규) |
|------|----------------|---------------|
| 프레임워크 | React 18 + TypeScript | 동일 |
| 스타일 | globals.css (커스텀 CSS + Tailwind 유틸) | Tailwind 기본 + CSS Module 허용 |
| 빌드 | Vite | 동일 |
| 라우팅 | react-router-dom v7 | 동일 |
| 차트 | ECharts + Recharts | 동일 |
| 애니메이션 | Framer Motion + GSAP | 동일 |
| 상태관리 | 없음 | 없음 (개발단 결정) |
| Mock 데이터 | 컴포넌트 폴더 내 혼재 | `/mock` 폴더로 분리 |
| 아이콘 | Lucide React | 동일 |

> 스택이 동일하므로 **컴포넌트 코드는 수정 없이 이식 가능**. 변경 포인트는 키 컬러(CSS 변수)와 Mock 데이터 위치뿐.
