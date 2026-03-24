---
inclusion: auto
---

# Codebase Patterns & Conventions Steering Rules

프로젝트 전체에서 일관되게 적용되는 코딩 패턴, 스타일 규칙, 라이브러리 사용 방식을 정의한 종합 가이드.

---

## 1. Styling Patterns

### 1-1. 스타일링 방식: Inline Styles + CSS Classes

**규칙**: 프로젝트는 **Inline Styles (React style prop)** 를 기본으로 사용하며, 전역 CSS 클래스는 보조적으로만 사용.

- **Inline Styles**: 컴포넌트별 고유 스타일, 동적 스타일, 상태 기반 스타일
- **CSS Classes** (globals.css): 재사용 가능한 유틸리티 클래스 (`.btn`, `.input`, `.card`, `.dialog-*` 등)
- **CSS Modules**: 사용하지 않음
- **Tailwind CSS**: 사용하지 않음

**예시**:
```tsx
// ✅ 올바른 방식
<div style={{
  padding: '16px',
  borderRadius: '8px',
  backgroundColor: 'hsl(var(--card))',
  transition: 'all 0.2s'
}}>
  <button className="btn btn-primary btn-md">
    확인
  </button>
</div>

// ❌ 피해야 할 방식
<div className="p-4 rounded-lg bg-card">  // Tailwind 사용 금지
  <button className="custom-btn">확인</button>  // 새로운 CSS 클래스 정의 금지
</div>
```

### 1-2. 색상 시스템: HSL CSS 변수

**규칙**: 모든 색상은 `hsl(var(--token))` 형식의 CSS 변수를 사용. 직접 색상값 입력 금지.

**사용 가능한 토큰**:
```
--background, --foreground
--card, --card-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring
--sidebar, --sidebar-foreground
```

**예외**: 특수 효과나 브랜드 컬러 (예: SpinX 버튼의 `#00ff9d`, 네온 컬러 팔레트)는 직접 값 사용 가능.

**예시**:
```tsx
// ✅ 올바른 방식
<div style={{
  backgroundColor: 'hsl(var(--card))',
  color: 'hsl(var(--foreground))',
  borderColor: 'hsl(var(--border))'
}}>

// ❌ 피해야 할 방식
<div style={{
  backgroundColor: '#ffffff',
  color: '#000000',
  borderColor: '#e5e5e5'
}}>
```

### 1-3. 다크모드 지원

**규칙**: 다크모드는 `document.documentElement.classList.contains('dark')` 로 감지. CSS 변수는 자동으로 다크모드 값으로 변경됨.

- 라이트모드: 기본 (`:root` 변수)
- 다크모드: `.dark` 클래스 적용 시 변수 오버라이드
- 컴포넌트에서 다크모드 감지 필요 시: `isDarkMode` prop 또는 `document.documentElement.classList.contains('dark')`

**예시**:
```tsx
const isDarkMode = document.documentElement.classList.contains('dark')

const chartColors = {
  cost: '#00FF9D',
  ctr: isDarkMode ? '#f5f5f5' : '#1a1a1a'  // 다크모드에서만 다른 색상
}
```

---

## 2. Font Usage: Paperlogy

### 2-1. 폰트 적용 규칙

**규칙**: 모든 텍스트는 **Paperlogy** 폰트를 기본으로 사용. 폰트 명시 필수.

**폰트 스택**:
```
'Paperlogy', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
```

**가중치**:
- `font-weight: 400` → PaperlogyRegular
- `font-weight: 500` → PaperlogyMedium
- `font-weight: 600+` → PaperlogyBold

**예시**:
```tsx
// ✅ 올바른 방식
<h1 style={{
  fontFamily: 'Paperlogy, sans-serif',
  fontWeight: '600',
  fontSize: '36px'
}}>
  제목
</h1>

// ❌ 피해야 할 방식
<h1 style={{ fontSize: '36px' }}>  // fontFamily 생략 금지
  제목
</h1>
```

### 2-2. 폰트 크기 규칙

**일반적인 크기 체계**:
- 제목 (h1): `56px` (큰 페이지 제목), `36px` (섹션 제목), `20px` (소제목)
- 본문: `14px` (기본), `13px` (compact), `12px` (보조 정보)
- 라벨: `14px` (필드 라벨), `13px` (버튼 텍스트)
- 보조: `11px` (힌트, 에러 메시지), `12px` (메타 정보)

---

## 3. Color Patterns: HSL Variables

### 3-1. 색상 적용 패턴

**배경색**:
```tsx
backgroundColor: 'hsl(var(--background))'      // 페이지 배경
backgroundColor: 'hsl(var(--card))'            // 카드/패널 배경
backgroundColor: 'hsl(var(--muted))'           // 비활성/보조 배경
backgroundColor: 'hsl(var(--primary))'         // 강조 배경
```

**텍스트색**:
```tsx
color: 'hsl(var(--foreground))'                // 기본 텍스트
color: 'hsl(var(--muted-foreground))'          // 보조 텍스트
color: 'hsl(var(--primary))'                   // 강조 텍스트
color: 'hsl(var(--destructive))'               // 에러/경고 텍스트
```

**테두리**:
```tsx
borderColor: 'hsl(var(--border))'              // 기본 테두리
borderColor: 'hsl(var(--border) / 0.5)'        // 투명도 적용
```

### 3-2. 투명도 (Opacity) 사용

**규칙**: 색상 투명도는 CSS 변수에 `/` 연산자로 적용.

```tsx
// ✅ 올바른 방식
backgroundColor: 'hsl(var(--card) / 0.2)'      // 20% 투명도
backgroundColor: 'hsl(var(--primary) / 0.1)'   // 10% 투명도

// ❌ 피해야 할 방식
backgroundColor: 'rgba(255, 255, 255, 0.2)'    // 직접 rgba 사용 금지
```

### 3-3. 특수 색상 (예외)

**네온 컬러 팔레트** (Avatar, SpinX 등):
```tsx
const NEON_COLORS = [
  '#00D9FF', '#7B2FFF', '#FF006B',  // Cyan, Violet, Pink
  '#00FF94', '#FFD600', '#FF3D00'   // Lime, Yellow, Orange
]
```

**차트 색상**:
```tsx
const chartColors = {
  cost: '#00FF9D',        // Digital (네온 그린)
  ctr: isDarkMode ? '#f5f5f5' : '#1a1a1a',  // TVC
  cpc: '#B794F6'          // Reach (보라)
}
```

---

## 4. Chart Library: Recharts

### 4-1. 사용 규칙

**규칙**: 차트는 **Recharts** 라이브러리만 사용. ECharts는 특수한 경우(예: RatioFinderResult의 복잡한 시각화)에만 사용.

**Recharts 컴포넌트**:
- `ComposedChart`: 여러 차트 타입 혼합 (막대 + 라인)
- `BarChart`, `LineChart`, `ScatterChart`: 단일 타입
- `Bar`, `Line`, `Scatter`: 데이터 시리즈
- `XAxis`, `YAxis`, `ZAxis`: 축
- `Tooltip`, `Legend`: 상호작용

**예시**:
```tsx
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

<ResponsiveContainer width="100%" height={300}>
  <ComposedChart data={data}>
    <XAxis dataKey="period" />
    <YAxis yAxisId="left" />
    <YAxis yAxisId="right" orientation="right" />
    <Tooltip />
    <Bar yAxisId="left" dataKey="cost" fill="#00FF9D" />
    <Line yAxisId="right" type="monotone" dataKey="ctr" stroke="#f5f5f5" />
  </ComposedChart>
</ResponsiveContainer>
```

### 4-2. 차트 스타일링

**축 레이블**:
```tsx
<XAxis 
  dataKey="period"
  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
  axisLine={{ stroke: 'hsl(var(--border))' }}
/>
```

**범례 및 Tooltip**:
```tsx
<Tooltip 
  content={<CustomTooltip />}
  cursor={{ strokeDasharray: '3 3', stroke: 'hsl(var(--border))' }}
/>
```

---

## 5. Component Structure Patterns

### 5-1. 파일 구조

**규칙**: 기능별 폴더 구조, 관련 컴포넌트는 같은 폴더에 배치.

```
src/components/
├── common/              # 재사용 가능한 기본 컴포넌트
│   ├── Avatar.tsx
│   ├── Calendar.tsx
│   └── MediaIcons.tsx
├── layout/              # 레이아웃 컴포넌트
│   ├── AppLayout.tsx
│   ├── Sidebar.tsx
│   └── Breadcrumb.tsx
├── reachcaster/         # ReachCaster 기능 모음
│   ├── SlotHome.tsx
│   ├── SlotOverview.tsx
│   ├── IndustryBubbleChart.tsx
│   └── ...
├── datashot/            # DataShot 기능 모음
│   ├── CreateDataset.tsx
│   ├── DatasetCharts.tsx
│   └── ...
└── scenario/            # Scenario 기능 모음
    ├── ScenarioStep1.tsx
    └── ...
```

### 5-2. 컴포넌트 명명 규칙

**규칙**: PascalCase, 기능을 명확히 나타내는 이름.

```tsx
// ✅ 올바른 방식
export function SlotOverview() { }
export function IndustryBubbleChart() { }
export function CreateDatasetStep2() { }

// ❌ 피해야 할 방식
export function slotOverview() { }           // camelCase 금지
export function Chart() { }                  // 너무 일반적인 이름
export function Step2() { }                  // 컨텍스트 부족
```

### 5-3. Props 인터페이스

**규칙**: 모든 컴포넌트는 Props 인터페이스를 명시적으로 정의.

```tsx
interface SlotOverviewProps {
  slotData: any
  selectedScenarios: {
    datashot?: SelectedScenario
    reachCaster?: SelectedScenario
  }
}

export function SlotOverview({ slotData, selectedScenarios }: SlotOverviewProps) {
  // ...
}
```

### 5-4. 컴포넌트 구조 패턴

**일반적인 구조**:
```tsx
// 1. Imports
import { useState } from 'react'
import { IconName } from 'lucide-react'

// 2. Types/Interfaces
interface ComponentProps {
  prop1: string
  prop2?: number
}

// 3. Component
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 3-1. State
  const [state, setState] = useState('')
  
  // 3-2. Handlers
  const handleClick = () => { }
  
  // 3-3. Render
  return (
    <div style={{ /* styles */ }}>
      {/* JSX */}
    </div>
  )
}
```

---

## 6. Icon Library: Lucide React

### 6-1. 사용 규칙

**규칙**: 모든 아이콘은 **lucide-react** 라이브러리에서만 사용.

**설치된 아이콘 예시**:
```tsx
import {
  Archive, ChevronRight, ChevronLeft, ChevronDown,
  Plus, Minus, Search, X,
  Database, Target, DollarSign, TrendingUp,
  Calendar, Users, Info, AlertCircle, CheckCircle,
  Paperclip, MoreVertical, Edit, Trash2,
  Rotate3d, Zap, Sparkles
} from 'lucide-react'
```

### 6-2. 아이콘 크기 규칙

**일반적인 크기**:
- 버튼 내 아이콘: `16px`, `18px`, `20px`
- 헤더/타이틀 아이콘: `20px`, `24px`
- 보조 아이콘: `12px`, `14px`
- 큰 시각적 요소: `32px`, `48px`

**예시**:
```tsx
<button className="btn btn-primary">
  <Plus size={16} />  // 버튼 내 아이콘
  추가
</button>

<h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <Database size={24} />  // 제목 아이콘
  데이터 관리
</h2>
```

### 6-3. 아이콘 색상

**규칙**: 아이콘 색상은 텍스트 색상과 동일하게 적용.

```tsx
// ✅ 올바른 방식
<Plus size={16} style={{ color: 'hsl(var(--foreground))' }} />
<AlertCircle size={14} style={{ color: 'hsl(var(--destructive))' }} />

// ❌ 피해야 할 방식
<Plus size={16} style={{ color: '#000000' }} />  // 직접 색상값 사용 금지
```

---

## 7. Navigation Patterns: React Router

### 7-1. 라우팅 구조

**규칙**: React Router v7 사용, 모든 라우트는 `App.tsx`에서 중앙 관리.

**라우트 정의** (App.tsx):
```tsx
<Routes>
  <Route path="/" element={<SlotBoardLayout />} />
  <Route path="/slotboard" element={<SlotBoardLayout />} />
  <Route path="/slot/:slotId" element={<SlotHome />} />
  <Route path="/reachcaster/scenario/new" element={<CreateScenario />} />
  <Route path="/datashot" element={<DatasetList />} />
  <Route path="/datashot/new" element={<CreateDataset />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### 7-2. 네비게이션 방식

**규칙**: `useNavigate()` 훅 사용, 상태 전달은 `location.state` 활용.

```tsx
const navigate = useNavigate()

// 기본 네비게이션
navigate('/datashot')

// 상태 전달
navigate('/slot/123', { state: { slotData } })

// 뒤로가기
navigate(-1)
```

### 7-3. 경로 명명 규칙

**규칙**: 소문자, 하이픈 구분자, 기능 계층 반영.

```
/slotboard                              // 메인 보드
/slot/:slotId                           // 슬롯 상세
/reachcaster                            // ReachCaster 메인
/reachcaster/scenario/new               // 시나리오 생성
/reachcaster/scenario/ratio-finder/result
/datashot                               // DataShot 목록
/datashot/new                           // 데이터셋 생성
/datashot/:id                           // 데이터셋 상세
```

---

## 8. State Management Patterns

### 8-1. 상태 관리 방식

**규칙**: 프로젝트는 **React Hooks (useState)** 만 사용. Context API, Redux 등 사용하지 않음.

**상태 관리 계층**:
- **로컬 상태**: 컴포넌트 내 `useState` (폼 입력, UI 토글 등)
- **페이지 상태**: 부모 컴포넌트에서 관리, Props로 전달
- **전역 상태**: 필요 시 `localStorage` 활용 (다크모드, 사이드바 상태 등)

**예시**:
```tsx
// ✅ 올바른 방식
function CreateDataset() {
  const [formData, setFormData] = useState<FormData>({
    media: '',
    products: [],
    metrics: []
  })
  
  const handleMediaChange = (media: string) => {
    setFormData({ ...formData, media })
  }
  
  return (
    <div>
      <CreateDatasetStep1 
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  )
}
```

### 8-2. Props Drilling 패턴

**규칙**: Props 전달이 3단계 이상 필요한 경우, 상태 구조 재검토.

```tsx
// ✅ 적절한 구조
<AppLayout isDarkMode={isDarkMode} onToggleDarkMode={handleToggleDarkMode}>
  <SlotHome slotData={slotData} />
</AppLayout>

// ❌ Props Drilling 과다
<AppLayout isDarkMode={isDarkMode}>
  <SlotHome isDarkMode={isDarkMode}>
    <SlotDetail isDarkMode={isDarkMode}>
      <SlotCard isDarkMode={isDarkMode} />
    </SlotDetail>
  </SlotHome>
</AppLayout>
```

### 8-3. 폼 상태 패턴

**규칙**: 폼 데이터는 단일 상태 객체로 관리, 각 필드별 상태 분리 금지.

```tsx
// ✅ 올바른 방식
const [formData, setFormData] = useState({
  scenarioName: '',
  description: '',
  moduleType: '',
  brand: '',
  period: { start: '', end: '' },
  targetGrp: []
})

// ❌ 피해야 할 방식
const [scenarioName, setScenarioName] = useState('')
const [description, setDescription] = useState('')
const [moduleType, setModuleType] = useState('')
// ... 너무 많은 상태 변수
```

---

## 9. Animation & Transition Patterns

### 9-1. 애니메이션 방식

**규칙**: 프로젝트는 **CSS Transitions** 와 **CSS Keyframes** 만 사용. GSAP 라이브러리는 설치되어 있지만 현재 사용하지 않음.

**Transition 사용**:
```tsx
// ✅ 올바른 방식
<div style={{
  transition: 'all 0.2s ease',
  backgroundColor: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--background))'
}}>
  콘텐츠
</div>
```

**Keyframes 사용** (globals.css):
```css
@keyframes dialog-overlay-show {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### 9-2. 일반적인 Transition 값

**규칙**: 일관된 타이밍 함수와 지속 시간 사용.

```tsx
// 빠른 상호작용 (호버, 포커스)
transition: 'all 0.15s ease'

// 일반적인 상태 변경
transition: 'all 0.2s ease'

// 느린 애니메이션 (모달 열기/닫기)
transition: 'all 0.3s ease-out'

// 복잡한 애니메이션
transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
```

### 9-3. 애니메이션 클래스

**globals.css에 정의된 클래스**:
```css
.animate-pulse-custom {
  animation: pulse 2s ease-in-out infinite;
}
```

**사용**:
```tsx
<div className="animate-pulse-custom">
  로딩 중...
</div>
```

### 9-4. 호버 효과 패턴

**규칙**: `onMouseEnter`/`onMouseLeave` 이벤트로 동적 스타일 변경.

```tsx
// ✅ 올바른 방식
<button
  style={{ transition: 'all 0.2s' }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = 'hsl(var(--primary))'
    e.currentTarget.style.transform = 'translateY(-2px)'
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'transparent'
    e.currentTarget.style.transform = 'translateY(0)'
  }}
>
  호버 버튼
</button>
```

---

## 10. Naming Conventions

### 10-1. 파일 명명

**규칙**: PascalCase, 기능을 명확히 나타내는 이름.

```
✅ 올바른 방식
- SlotHome.tsx
- CreateDatasetStep2.tsx
- IndustryBubbleChart.tsx
- AdProductsSelector.tsx

❌ 피해야 할 방식
- slot-home.tsx (kebab-case)
- createDatasetStep2.tsx (camelCase)
- chart.tsx (너무 일반적)
- index.tsx (컨텍스트 부족)
```

### 10-2. 변수 명명

**규칙**: camelCase, 타입을 암시하는 이름.

```tsx
// ✅ 올바른 방식
const [isOpen, setIsOpen] = useState(false)           // boolean
const [selectedItems, setSelectedItems] = useState([]) // array
const [formData, setFormData] = useState({})          // object
const handleClick = () => { }                         // function
const mediaList = ['Google Ads', 'Meta']              // array

// ❌ 피해야 할 방식
const [open, setOpen] = useState(false)               // 타입 불명확
const [items, setItems] = useState([])                // 너무 일반적
const [data, setData] = useState({})                  // 컨텍스트 부족
const onClick = () => { }                             // 함수 접두사 부족
```

### 10-3. 함수 명명

**규칙**: 동사 + 명사, 명확한 의도 표현.

```tsx
// ✅ 올바른 방식
const handleMediaChange = (media: string) => { }
const toggleSidebar = () => { }
const validateFormData = () => { }
const calculateTotalBudget = () => { }

// ❌ 피해야 할 방식
const mediaChange = () => { }                         // 동사 부족
const toggle = () => { }                              // 대상 불명확
const check = () => { }                               // 너무 일반적
const calc = () => { }                                // 약자 사용
```

### 10-4. 상수 명명

**규칙**: UPPER_SNAKE_CASE, 불변 데이터.

```tsx
// ✅ 올바른 방식
const NEON_COLORS = ['#00D9FF', '#7B2FFF']
const DEFAULT_PAGE_SIZE = 10
const MEDIA_LIST = ['Google Ads', 'Meta']

// ❌ 피해야 할 방식
const neonColors = ['#00D9FF', '#7B2FFF']             // 상수는 대문자
const defaultPageSize = 10                            // 상수는 대문자
```

### 10-5. 인터페이스/타입 명명

**규칙**: PascalCase, `Props` 또는 `Data` 접미사.

```tsx
// ✅ 올바른 방식
interface SlotOverviewProps { }
interface FormData { }
interface ScenarioFormData { }
type ViewMode = 'list' | 'grid'

// ❌ 피해야 할 방식
interface slotOverviewProps { }                       // camelCase
interface ISlotOverview { }                           // I 접두사 (TypeScript 관례 아님)
interface Props { }                                   // 컨텍스트 부족
```

---

## 11. 추가 패턴

### 11-1. 에러 처리

**규칙**: 유효성 검사는 `validationActive` 플래그로 제어.

```tsx
const [validationActive, setValidationActive] = useState(false)

{validationActive && !formData.media && (
  <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))' }}>
    매체를 선택해주세요.
  </div>
)}
```

### 11-2. 조건부 렌더링

**규칙**: 삼항 연산자 또는 `&&` 연산자 사용, 복잡한 로직은 변수로 추출.

```tsx
// ✅ 올바른 방식
{isOpen && <Modal />}
{items.length > 0 ? <List items={items} /> : <Empty />}

// ❌ 피해야 할 방식
{isOpen ? <Modal /> : null}                           // null 반환 대신 && 사용
{items.length > 0 && items.map(...)}                  // 복잡한 로직은 변수로 추출
```

### 11-3. 이벤트 핸들러

**규칙**: `handle` 접두사, 명확한 이벤트 타입.

```tsx
// ✅ 올바른 방식
const handleClick = () => { }
const handleMediaChange = (media: string) => { }
const handleFormSubmit = (e: React.FormEvent) => { }

// ❌ 피해야 할 방식
const onClick = () => { }                             // handle 접두사 부족
const onMediaChange = () => { }                       // on 접두사 (콜백용)
```

---

## 12. 체크리스트

새로운 컴포넌트 작성 시 확인 사항:

- [ ] 파일명: PascalCase (예: `ComponentName.tsx`)
- [ ] Props 인터페이스 정의됨
- [ ] 모든 색상: `hsl(var(--token))` 사용
- [ ] 폰트: `fontFamily: 'Paperlogy, sans-serif'` 명시
- [ ] 아이콘: lucide-react에서만 import
- [ ] 스타일: Inline Styles + CSS 클래스 조합
- [ ] 상태: `useState` 사용, Props로 전달
- [ ] 애니메이션: CSS Transitions/Keyframes만 사용
- [ ] 네비게이션: `useNavigate()` 사용
- [ ] 유효성 검사: `validationActive` 플래그 사용
- [ ] 다크모드: CSS 변수 자동 적용 확인

