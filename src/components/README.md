# Components 구조 설명

## 📁 폴더 구조

```
src/components/
├── common/              # 공통 컴포넌트
│   ├── Avatar.tsx       # 프로필 아바타 (사용자/광고주)
│   ├── SplashCursor.tsx # 커서 인터랙션 효과 (WebGL)
│   └── SplitText.tsx    # 텍스트 애니메이션
│
├── layout/              # 레이아웃 컴포넌트
│   ├── AppLayout.tsx    # 전체 페이지 레이아웃 래퍼
│   ├── Breadcrumb.tsx   # 경로 표시 (GNB 하단)
│   ├── Footer.tsx       # 하단 푸터
│   ├── GlobalNavBar.tsx # 상단 글로벌 네비게이션
│   ├── Sidebar.tsx      # 좌측 사이드 네비게이션
│   └── index.ts         # export 모음
│
├── reachcaster/         # Reach Caster 솔루션 전용
│   ├── CreateFolder.tsx              # Slot 생성 폼
│   ├── CreateScenario.tsx            # 시나리오 생성 위자드 (3단계)
│   ├── DateRangePicker.tsx           # 날짜 범위 선택기
│   ├── EditFolder.tsx                # Slot 수정 폼
│   ├── PageHeader.tsx                # SlotBoard 페이지 헤더
│   ├── RatioFinderDetailTable.tsx    # Ratio Finder 상세 테이블
│   ├── RatioFinderResult.tsx         # Ratio Finder 결과 화면
│   ├── ReachCurveChart.tsx           # 리치커브 차트 (ECharts)
│   ├── ReachPredictorDetailTable.tsx # Reach Predictor 상세 테이블
│   ├── ReachPredictorResult.tsx      # Reach Predictor 결과 화면
│   ├── ReachPredictorScoreCards.tsx  # Reach Predictor 스코어카드
│   ├── SlotCard.tsx                  # Slot 카드 (그리드 뷰)
│   ├── SlotDetail.tsx                # Slot 상세 화면 (시나리오 목록)
│   ├── SlotHeader.tsx                # Slot 헤더 (컴팩트 디자인)
│   ├── SlotListItem.tsx              # Slot 목록 아이템 (리스트 뷰)
│   ├── WelcomeSection.tsx            # 환영 섹션
│   └── WorkspaceLayout.tsx           # SlotBoard 메인 레이아웃
│
├── scenario/            # 시나리오 생성 관련 (Reach Caster)
│   ├── ScenarioStep1.tsx                  # Step 1: 기본 정보
│   ├── ScenarioStep2RatioFinder.tsx       # Step 2: Ratio Finder 설정
│   ├── ScenarioStep2ReachPredictor.tsx    # Step 2: Reach Predictor 설정
│   ├── ReachPredictorMediaDialog.tsx      # 매체 선택 다이얼로그
│   ├── constants.ts                       # 상수 (브랜드, 타겟 GRP, 매체 데이터)
│   ├── types.ts                           # 타입 정의
│   ├── utils.ts                           # 유틸리티 함수
│   └── index.ts                           # export 모음
│
└── datashot/            # Data Shot 솔루션 (준비 중)
    └── (향후 추가 예정)
```

## 🎯 컴포넌트 역할

### Common (공통)
모든 솔루션에서 재사용 가능한 기본 컴포넌트

- **Avatar**: 사용자/광고주 프로필 아바타, 이니셜 표시, 색상 자동 생성
- **SplashCursor**: OGL 기반 WebGL 커서 효과
- **SplitText**: 텍스트 애니메이션 효과

### Layout (레이아웃)
전체 애플리케이션의 구조를 담당

- **AppLayout**: GNB + Sidebar + 메인 콘텐츠 영역을 포함하는 최상위 레이아웃
- **GlobalNavBar**: 로고, 솔루션 메뉴, 사용자 프로필
- **Sidebar**: 워크스페이스, Slot 트리, 빠른 네비게이션
- **Breadcrumb**: 현재 위치 표시 (동적 생성)
- **Footer**: 저작권, 링크 등

### Reach Caster
Reach Caster 솔루션 전용 컴포넌트

#### SlotBoard 관련
- **WorkspaceLayout**: SlotBoard 메인 화면 (Slot 목록)
- **PageHeader**: 타이틀, New Slot 버튼, 솔루션별 스코어카드
- **SlotCard**: Slot 카드 (그리드 뷰용)
- **SlotListItem**: Slot 목록 아이템 (리스트 뷰용)
- **CreateFolder**: Slot 생성 폼
- **EditFolder**: Slot 수정 폼
- **WelcomeSection**: 환영 메시지 섹션

#### Slot 상세 관련
- **SlotDetail**: Slot 상세 화면 (시나리오 목록, List/Timeline 뷰)
- **SlotHeader**: Slot 정보 헤더 (컴팩트 디자인)

#### 시나리오 생성 관련
- **CreateScenario**: 3단계 위자드 메인 컨테이너
- **scenario/ScenarioStep1**: 기본 정보 입력 (시나리오명, 모듈, 브랜드, 기간, 타겟 GRP)
- **scenario/ScenarioStep2RatioFinder**: Ratio Finder 상세 설정
- **scenario/ScenarioStep2ReachPredictor**: Reach Predictor 상세 설정
- **scenario/ReachPredictorMediaDialog**: 매체 선택 다이얼로그 (1000×700px)
- **DateRangePicker**: 날짜 범위 선택기 (DayPicker 기반)

#### 결과 화면 관련
- **RatioFinderResult**: Ratio Finder 결과 대시보드
- **ReachPredictorResult**: Reach Predictor 결과 대시보드
- **ReachPredictorScoreCards**: 주요 지표 스코어카드
- **ReachCurveChart**: 리치커브 차트 (ECharts)
- **RatioFinderDetailTable**: Ratio Finder 상세 데이터 테이블
- **ReachPredictorDetailTable**: Reach Predictor 상세 데이터 테이블

### Scenario (시나리오 생성 모듈)
시나리오 생성 위자드의 하위 컴포넌트 및 유틸리티

- **constants.ts**: 브랜드 목록, 타겟 GRP 옵션, 매체 데이터
- **types.ts**: ScenarioFormData, ReachPredictorMedia 등 타입 정의
- **utils.ts**: numberToKorean, formatNumber 등 유틸리티 함수

## 🔄 데이터 흐름

### Reach Caster 시나리오 생성 플로우
```
CreateScenario (메인 컨테이너)
  ├── formData 상태 관리
  ├── Step 1: ScenarioStep1
  │   └── 기본 정보 입력 → formData 업데이트
  ├── Step 2: ScenarioStep2RatioFinder | ScenarioStep2ReachPredictor
  │   └── 모듈별 설정 → formData 업데이트
  └── Step 3: 검토 및 실행
      └── Configuration Summary 표시 → 시나리오 생성 요청
```

## 📝 Import 경로 규칙

### reachcaster 폴더 내 컴포넌트
```typescript
// 공통 컴포넌트
import { Avatar } from '../common/Avatar'

// 레이아웃 컴포넌트
import { AppLayout } from '../layout/AppLayout'

// 유틸리티
import { getDarkMode } from '../../utils/theme'

// 같은 폴더 내 컴포넌트
import { SlotCard } from './SlotCard'

// scenario 폴더
import { ScenarioStep1 } from './scenario/ScenarioStep1'
```

### scenario 폴더 내 컴포넌트
```typescript
// 공통 컴포넌트
import { Avatar } from '../../common/Avatar'

// 레이아웃 컴포넌트
import { AppLayout } from '../../layout/AppLayout'

// 유틸리티
import { getDarkMode } from '../../../utils/theme'

// reachcaster 폴더
import { DateRangePicker } from '../DateRangePicker'

// 같은 폴더 내
import { constants } from './constants'
```

## 🚀 다음 단계: Data Shot

Data Shot 솔루션 작업 시 다음 구조를 따르세요:

```
src/components/datashot/
├── WorkspaceLayout.tsx      # Data Shot 메인 화면
├── CreateAnalysis.tsx       # 분석 생성
├── AnalysisResult.tsx       # 분석 결과
└── ...                      # 기타 Data Shot 전용 컴포넌트
```

## 📌 주의사항

1. **공통 컴포넌트 재사용**: common, layout 폴더의 컴포넌트는 모든 솔루션에서 사용 가능
2. **솔루션별 격리**: 각 솔루션(reachcaster, datashot 등)은 독립적인 폴더로 관리
3. **Import 경로**: 상대 경로를 정확히 사용하여 빌드 오류 방지
4. **타입 정의**: 각 솔루션별로 types.ts 파일에 타입 정의 관리
5. **상수 관리**: constants.ts에 하드코딩된 데이터 관리
