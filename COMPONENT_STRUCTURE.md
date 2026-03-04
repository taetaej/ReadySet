# 컴포넌트 구조 정리 완료

## 📋 작업 내용

### 1. Reach Caster 컴포넌트 정리
모든 Reach Caster 관련 컴포넌트를 `src/components/reachcaster/` 폴더로 이동 및 정리 완료

#### 이동된 파일들
- CreateFolder.tsx
- CreateScenario.tsx (이미 존재)
- DateRangePicker.tsx
- EditFolder.tsx
- PageHeader.tsx
- WelcomeSection.tsx
- WorkspaceLayout.tsx (이미 존재)
- 기타 모든 Reach Caster 관련 컴포넌트

#### Import 경로 수정
모든 파일의 import 경로를 새로운 폴더 구조에 맞게 수정:
- `./layout/AppLayout` → `../layout/AppLayout`
- `./common/Avatar` → `../common/Avatar`
- `../utils/theme` → `../../utils/theme`

### 2. 백업 파일 삭제
- WorkspaceLayout.backup.tsx ✅ 삭제
- WorkspaceLayout.backup2.tsx ✅ 삭제

### 3. App.tsx 라우팅 업데이트
```typescript
// 변경 전
import { SlotBoardLayout } from './components/WorkspaceLayout'
import { CreateScenario } from './components/CreateScenario'

// 변경 후
import { SlotBoardLayout } from './components/reachcaster/WorkspaceLayout'
import { CreateScenario } from './components/reachcaster/CreateScenario'
```

### 4. Data Shot 준비
`src/components/datashot/` 폴더 생성 완료

## 📁 최종 폴더 구조

```
src/
├── components/
│   ├── common/              # 공통 컴포넌트 (모든 솔루션 공유)
│   │   ├── Avatar.tsx
│   │   ├── SplashCursor.tsx
│   │   └── SplitText.tsx
│   │
│   ├── layout/              # 레이아웃 컴포넌트 (GNB, SNB, Footer 등)
│   │   ├── AppLayout.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── Footer.tsx
│   │   ├── GlobalNavBar.tsx
│   │   ├── Sidebar.tsx
│   │   └── index.ts
│   │
│   ├── reachcaster/         # ✅ Reach Caster 솔루션 전용
│   │   ├── CreateFolder.tsx
│   │   ├── CreateScenario.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── EditFolder.tsx
│   │   ├── PageHeader.tsx
│   │   ├── RatioFinderDetailTable.tsx
│   │   ├── RatioFinderResult.tsx
│   │   ├── ReachCurveChart.tsx
│   │   ├── ReachPredictorDetailTable.tsx
│   │   ├── ReachPredictorResult.tsx
│   │   ├── ReachPredictorScoreCards.tsx
│   │   ├── SlotCard.tsx
│   │   ├── SlotDetail.tsx
│   │   ├── SlotHeader.tsx
│   │   ├── SlotListItem.tsx
│   │   ├── WelcomeSection.tsx
│   │   └── WorkspaceLayout.tsx
│   │
│   ├── scenario/            # 시나리오 생성 모듈 (Reach Caster)
│   │   ├── ScenarioStep1.tsx
│   │   ├── ScenarioStep2RatioFinder.tsx
│   │   ├── ScenarioStep2ReachPredictor.tsx
│   │   ├── ReachPredictorMediaDialog.tsx
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── index.ts
│   │
│   ├── datashot/            # 🆕 Data Shot 솔루션 (준비 완료)
│   │   └── .gitkeep
│   │
│   └── README.md            # 📝 컴포넌트 구조 설명서
│
├── styles/
│   └── globals.css
│
├── utils/
│   └── theme.ts
│
├── App.tsx                  # ✅ 라우팅 업데이트 완료
├── main.tsx
└── index.css
```

## 🎯 각 폴더의 역할

### common/
모든 솔루션에서 재사용 가능한 기본 UI 컴포넌트
- Avatar, SplashCursor, SplitText 등

### layout/
전체 애플리케이션의 레이아웃 구조
- AppLayout (최상위 래퍼)
- GlobalNavBar (상단 네비게이션)
- Sidebar (좌측 사이드바)
- Breadcrumb, Footer

### reachcaster/
Reach Caster 솔루션 전용 컴포넌트
- SlotBoard 관련: WorkspaceLayout, SlotCard, SlotDetail 등
- 시나리오 생성: CreateScenario, DateRangePicker 등
- 결과 화면: RatioFinderResult, ReachPredictorResult 등

### scenario/
시나리오 생성 위자드의 하위 컴포넌트
- Step별 컴포넌트 (Step1, Step2RatioFinder, Step2ReachPredictor)
- 상수, 타입, 유틸리티 함수

### datashot/
Data Shot 솔루션 전용 컴포넌트 (향후 추가)

## 🚀 Data Shot 작업 시작 가이드

### 1. 기본 구조 생성
```
src/components/datashot/
├── WorkspaceLayout.tsx      # Data Shot 메인 화면
├── CreateAnalysis.tsx       # 분석 생성 폼
├── AnalysisResult.tsx       # 분석 결과 화면
├── AnalysisCard.tsx         # 분석 카드 컴포넌트
└── types.ts                 # Data Shot 타입 정의
```

### 2. 라우팅 추가 (App.tsx)
```typescript
import { DataShotLayout } from './components/datashot/WorkspaceLayout'
import { CreateAnalysis } from './components/datashot/CreateAnalysis'

// Routes에 추가
<Route path="/datashot" element={<DataShotLayout />} />
<Route path="/datashot/analysis/new" element={<CreateAnalysis />} />
```

### 3. 공통 컴포넌트 재사용
```typescript
// Data Shot 컴포넌트에서
import { Avatar } from '../common/Avatar'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode } from '../../utils/theme'
```

## 📝 Import 경로 참고

### reachcaster 폴더 내에서
```typescript
import { Avatar } from '../common/Avatar'           // 공통
import { AppLayout } from '../layout/AppLayout'     // 레이아웃
import { getDarkMode } from '../../utils/theme'     // 유틸
import { SlotCard } from './SlotCard'               // 같은 폴더
import { ScenarioStep1 } from './scenario/ScenarioStep1' // 하위 폴더
```

### datashot 폴더 내에서 (동일한 패턴)
```typescript
import { Avatar } from '../common/Avatar'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode } from '../../utils/theme'
import { AnalysisCard } from './AnalysisCard'
```

## ✅ 완료 체크리스트

- [x] Reach Caster 컴포넌트 reachcaster 폴더로 이동
- [x] 모든 import 경로 수정
- [x] 백업 파일 삭제
- [x] App.tsx 라우팅 업데이트
- [x] Data Shot 폴더 생성
- [x] 구조 문서화 (README.md, COMPONENT_STRUCTURE.md)
- [ ] Data Shot 컴포넌트 개발 시작

## 🔍 참고 문서

- `src/components/README.md`: 상세한 컴포넌트 설명
- `plan/strategic(highlevel)/예측분석_플랫폼_IA_v1.0.md`: 전체 시스템 IA
- `guide/Screen_Specification_Guide.md`: 화면 스펙 가이드

## 💡 주의사항

1. **솔루션별 격리**: 각 솔루션(reachcaster, datashot)은 독립적인 폴더로 관리
2. **공통 컴포넌트 재사용**: common, layout 폴더의 컴포넌트는 모든 솔루션에서 사용
3. **Import 경로 정확성**: 상대 경로를 정확히 사용하여 빌드 오류 방지
4. **타입 안정성**: 각 솔루션별로 types.ts 파일에 타입 정의 관리
5. **일관성 유지**: Reach Caster의 패턴을 참고하여 Data Shot 개발
