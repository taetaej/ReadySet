# 예측/분석 플랫폼 IA (Information Architecture)

## 문서 이력

| 날짜 | 수정자 | 수정 내용 | 사유 | VER. |
|---|---|---|---|---|
| 2026. 1. 23 | 신지아 | 초안 작성 | - | 1.0 |
| 2026. 2. 02 | 신지아 | 정책서 기반 업데이트 | 정책서 v0.2 반영 | 1.1 |
| 2026. 2. 06 | 신지아 | 구현 기반 업데이트 | 실제 구현 내용 반영 | 1.2 |
| 2026. 2. 09 | AI | 시나리오 생성 페이지 상세 업데이트 | Reach Predictor Phase 1 구현 완료 | 1.3 |
| 2026. 2. 12 | AI | 실제 구현 구조 반영 | 현재 프로젝트 파일 구조 기반 업데이트 | 1.4 |
| 2026. 3. 05 | AI | 브레드크럼 네비게이션 구조 개선 | 솔루션 레이어 추가, 정책 문서화 | 1.5 |
| 2026. 4. 16 | AI | 전체 구조 업데이트 | 실제 코드베이스 기반 기술스택·컴포넌트·프로젝트 구조 반영 | 1.6 |
| 2026. 5. 27 | AI | DataShot + Reach Caster 전체 IA 재작성 | 실제 구현 코드 기반 완전 업데이트 | 2.0 |

---

📢 본 문서는 예측/분석 고도화 프로젝트의 실제 구현 코드를 기반으로 작성된 정보 구조(IA) 가이드입니다.

- 현재 버전: v2.0
- 관리자: 신지아
- 최근 업데이트: DataShot 솔루션 전체 IA 추가, Reach Caster 최신 구현 반영, SlotHome 구조 반영 (2026.05.27)

---

## 1. 전체 시스템 구조

```
예측/분석 플랫폼 — ReadySet (React SPA)
├── 기술 스택
│   ├── 프론트엔드: React 18.2.0 + TypeScript 5.0.2
│   ├── 라우팅: React Router DOM 7.13.0
│   ├── 빌드: Vite 4.4.5
│   ├── UI 컴포넌트
│   │   ├── Lucide React 0.263.1 (아이콘)
│   │   ├── React Day Picker 9.13.0 (날짜 선택)
│   │   ├── Framer Motion 12.38.0 (애니메이션)
│   │   ├── GSAP 3.14.2 (고급 애니메이션)
│   │   └── 커스텀 컴포넌트 (shadcn 스타일)
│   ├── 차트/시각화
│   │   ├── Recharts 3.7.0 (리치커브, 콤보차트 등)
│   │   ├── ECharts 6.0.0 + echarts-for-react 3.0.6 (버블차트, 바차트)
│   │   └── Frappe Gantt 1.0.4 (타임라인)
│   └── 유틸리티
│       ├── date-fns 4.1.0 (날짜 처리)
│       └── OGL 1.0.11 (WebGL 커서 효과)
├── 라우팅 구조 (React Router)
│   ├── / → SlotBoard 메인 (WorkspaceLayout)
│   ├── /slotboard → SlotBoard 메인
│   ├── /slot/:slotId → Slot Home (SlotHome)
│   ├── /reachcaster → Slot 상세 (WorkspaceLayout initialView="slotDetail")
│   ├── /reachcaster/scenario/new → 시나리오 생성 (CreateScenario)
│   ├── /reachcaster/scenario/ratio-finder/result → Ratio Finder 결과
│   ├── /reachcaster/scenario/reach-predictor/result → Reach Predictor 결과
│   ├── /datashot → 데이터셋 목록 (DatasetList)
│   ├── /datashot/new → 데이터셋 생성 (CreateDataset)
│   ├── /datashot/:id → 데이터셋 상세 (DatasetDetail)
│   ├── /docs → 문서 (DocsLayout)
│   ├── /docs/:slug → 문서 상세
│   ├── /component → 컴포넌트 라이브러리
│   ├── /error → 에러 페이지
│   └── /* → 루트로 리다이렉트
├── 프로젝트 구조
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/ (레이아웃)
│   │   │   │   ├── AppLayout.tsx (전체 레이아웃 래퍼)
│   │   │   │   ├── GlobalNavBar.tsx (GNB)
│   │   │   │   ├── Sidebar.tsx (SNB)
│   │   │   │   ├── Breadcrumb.tsx (경로 표시)
│   │   │   │   ├── GradeCard.tsx (사용자 등급 카드)
│   │   │   │   ├── Footer.tsx (푸터)
│   │   │   │   └── index.ts
│   │   │   ├── common/ (공통)
│   │   │   │   ├── Avatar.tsx (프로필 아바타)
│   │   │   │   ├── Calendar.tsx (캘린더)
│   │   │   │   ├── CircularText.tsx (원형 텍스트)
│   │   │   │   ├── MediaIcons.tsx (매체 아이콘)
│   │   │   │   ├── SplashCursor.tsx (WebGL 커서 효과)
│   │   │   │   └── SplitText.tsx (텍스트 애니메이션)
│   │   │   ├── reachcaster/ (Reach Caster 솔루션)
│   │   │   │   ├── WorkspaceLayout.tsx (SlotBoard 메인)
│   │   │   │   ├── SlotHome.tsx (Slot 홈 — 솔루션 플로우)
│   │   │   │   ├── SlotHomeSections.tsx (피드, 문서 섹션)
│   │   │   │   ├── SlotOverview.tsx (솔루션 오버뷰 4카드)
│   │   │   │   ├── SlotSolutions.tsx (솔루션 플로우 카드)
│   │   │   │   ├── SlotCard.tsx / SlotHeader.tsx / SlotDetail.tsx
│   │   │   │   ├── SlotListItem.tsx (시나리오 목록 아이템)
│   │   │   │   ├── CreateScenario.tsx (시나리오 생성 위자드)
│   │   │   │   ├── CreateFolder.tsx / EditFolder.tsx (Slot 생성/수정)
│   │   │   │   ├── RatioFinderResult.tsx / RatioFinderDetailTable.tsx
│   │   │   │   ├── ReachPredictorResult.tsx / ReachPredictorDetailTable.tsx
│   │   │   │   ├── ReachPredictorScoreCards.tsx / ReachCurveChart.tsx
│   │   │   │   ├── ScenarioComparisonPanel.tsx (비교 패널)
│   │   │   │   ├── ScenarioComparisonResult.tsx (비교 결과)
│   │   │   │   ├── SolutionOutputCard.tsx / DataInsightCard.tsx
│   │   │   │   ├── IndustryBubbleChart.tsx / IndustryDualBarChart.tsx
│   │   │   │   ├── WelcomeSection.tsx / WelcomeSectionFixed.tsx
│   │   │   │   ├── DateRangePicker.tsx / CustomDateRangePicker.tsx
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   └── slotHomeTypes.ts (타입 + 목 데이터)
│   │   │   ├── scenario/ (시나리오 생성 공통)
│   │   │   │   ├── ScenarioStep1.tsx (기본 정보)
│   │   │   │   ├── ScenarioStep2RatioFinder.tsx (RF 설정)
│   │   │   │   ├── ScenarioStep2ReachPredictor.tsx (RP 설정)
│   │   │   │   ├── ReachPredictorMediaDialog.tsx (매체 선택)
│   │   │   │   ├── constants.ts / types.ts / utils.ts
│   │   │   │   └── index.ts
│   │   │   ├── datashot/ (DataShot 솔루션)
│   │   │   │   ├── DatasetList.tsx (데이터셋 목록)
│   │   │   │   ├── DatasetDetail.tsx (데이터셋 상세)
│   │   │   │   ├── DatasetDetailModals.tsx (상세 모달 3종)
│   │   │   │   ├── DatasetCharts.tsx (차트 시각화)
│   │   │   │   ├── CreateDataset.tsx (생성 3단계 위자드)
│   │   │   │   ├── CreateDatasetStep1.tsx (기본 정보)
│   │   │   │   ├── CreateDatasetStep2.tsx (상세 설정)
│   │   │   │   ├── CreateDatasetStep3.tsx (검토 및 실행)
│   │   │   │   ├── AdProductsSelector.tsx (광고상품 선택)
│   │   │   │   ├── IndustryDialog.tsx (업종 선택 다이얼로그)
│   │   │   │   ├── MonthRangePicker.tsx (월/분기 기간 선택)
│   │   │   │   ├── ConfigurationSummary.tsx (설정 요약 패널)
│   │   │   │   ├── SampleDataModal.tsx (샘플 데이터 미리보기)
│   │   │   │   ├── DisabledSelectBox.tsx (비활성 셀렉트)
│   │   │   │   ├── createDatasetTypes.ts (폼 타입 + 유효성)
│   │   │   │   ├── types.ts (Dataset 인터페이스)
│   │   │   │   ├── apiMappings.ts (매체별 API 매핑)
│   │   │   │   ├── sampleData.ts (샘플 데이터)
│   │   │   │   ├── metaCampaignObjectives.ts (Meta 캠페인 목표)
│   │   │   │   ├── metaMetrics.ts (Meta 지표)
│   │   │   │   ├── metaPerformanceGoals.ts (Meta 성과 목표)
│   │   │   │   ├── metaPlatforms.ts (Meta 플랫폼)
│   │   │   │   └── index.ts
│   │   │   ├── spinx/ (SpinX AI 어시스턴트)
│   │   │   │   ├── SpinXButton.tsx (플로팅 버튼)
│   │   │   │   ├── SpinXPanel.tsx (채팅 패널)
│   │   │   │   ├── SpinXHeader.tsx / SpinXInput.tsx / SpinXMessages.tsx
│   │   │   │   ├── SpinXChartBubble.tsx (차트 메시지)
│   │   │   │   ├── SpinXClarifying.tsx (명확화 질문)
│   │   │   │   ├── SpinXErrorBubble.tsx (에러 메시지)
│   │   │   │   ├── SpinXFabExample.tsx (FAB 예시)
│   │   │   │   └── PulseNodeX.tsx (펄스 애니메이션)
│   │   │   ├── docs/ (문서 시스템)
│   │   │   │   ├── DocsLayout.tsx / docsData.ts / docs.css
│   │   │   │   └── index.ts
│   │   │   ├── ComponentLibrary.tsx (컴포넌트 라이브러리)
│   │   │   └── ErrorPage.tsx (에러 페이지)
│   │   ├── styles/ → globals.css
│   │   ├── utils/ → theme.ts
│   │   ├── App.tsx (라우팅)
│   │   └── main.tsx (진입점)
│   ├── plan/ (기획 문서)
│   │   ├── spec/ (화면별 상세 스펙)
│   │   ├── eunseo/ (프로젝트 관리)
│   │   └── strategic(highlevel)/ (정책서, IA)
│   └── public/ (정적 리소스)
│       ├── 로고 (다크/라이트 모드별)
│       ├── 폰트 (Paperlogy Bold/Medium/Regular)
│       └── SpinX 아이콘/애니메이션
└── 글로벌 네비게이션 (GNB)
    ├── 좌측: 플랫폼 로고 (ReadySet)
    ├── 중앙: 알림 bar (최근 알림 메시지 1줄 노출)
    ├── 우측
    │   ├── 솔루션 메뉴 (드롭다운)
    │   │   ├── Reach Caster (구현 완료)
    │   │   ├── DataShot (구현 완료)
    │   │   ├── Ad Curator (준비중)
    │   │   └── Budget Optimizer (준비중)
    │   ├── 알림 센터 (Bell 아이콘)
    │   │   ├── 알림 목록 (최근 30개)
    │   │   ├── 알림 타입: 작업 알림 / 사용자 공지 / 레벨 안내
    │   │   ├── 읽음/안읽음 상태
    │   │   └── 클릭 시 해당 결과 페이지 네비게이션
    │   ├── 다크모드 토글 (Sun/Moon)
    │   ├── 사용자 프로필 (Avatar + 드롭다운)
    │   │   ├── 사용자 정보 (이름, 이메일, 역할)
    │   │   ├── 등급 카드 (GradeCard)
    │   │   └── 로그아웃
    │   └── 광고주 선택 (드롭다운)
    │       ├── 상위 3개 광고주 표시
    │       └── 전체 광고주 목록 (검색 가능)
    └── 토스트 알림 (성공/에러, 3초 자동 닫힘)
```

---

## 2. SlotBoard (워크스페이스 메인)

```
SlotBoard (URL: / 또는 /slotboard)
├── 컴포넌트: WorkspaceLayout.tsx
├── 페이지 헤더
│   ├── 타이틀: "SlotBoard"
│   ├── New Slot 버튼 (크고 둥근 primary 스타일)
│   └── 솔루션별 결과 개수 스코어카드
│       ├── Total Results
│       ├── DataShot
│       ├── Ad Curator
│       ├── Budget Optimizer
│       └── Reach Caster
├── 검색/필터/정렬 영역
│   ├── 좌측: Slot 개수 표시 (예: "25 Slots")
│   └── 우측: 액션 버튼들
│       ├── 검색 (Search 아이콘 + "검색")
│       │   ├── 클릭 시 입력 필드 슬라이드 확장
│       │   └── Slot명, 광고주명 실시간 검색
│       ├── 정렬 (ArrowUpDown 아이콘 + "정렬")
│       │   ├── Slot명 A→Z / Z→A
│       │   ├── 광고주 A→Z / Z→A
│       │   ├── 수정일 최신순 / 오래된순
│       │   └── 생성일 최신순 / 오래된순
│       ├── 필터 (Filter 아이콘 + "필터")
│       │   ├── 광고주 (검색 가능 체크박스)
│       │   ├── 가시성 (Internal/Private/Shared)
│       │   └── 필터 개수 뱃지
│       └── Slot 관리 버튼 (관리 모드 진입)
├── Slot 카드 그리드 (auto-fill, minmax(300px, 1fr))
│   ├── Slot 카드
│   │   ├── 광고주 프로필 아바타 (색상별)
│   │   ├── Slot명 (18px, 굵게)
│   │   ├── 광고주명 (ID)
│   │   ├── 가시성 뱃지 (Internal: 회색 / Private: 보라 / Shared: 초록)
│   │   ├── 설명 (2줄 말줄임)
│   │   ├── 솔루션별 결과 개수 (아이콘 + 개수)
│   │   ├── 최종 수정일
│   │   └── 관리 메뉴 (수정/삭제)
│   └── 관리 모드
│       ├── 체크박스 선택
│       ├── 전체 선택/해제
│       └── 일괄 삭제
└── 페이지네이션
    ├── 페이지당 표시 개수 (10/20/50/100)
    ├── 페이지 정보 (1-20 / 25개)
    └── 페이지 네비게이션
```

---

## 3. Slot Home (슬롯 홈)

```
Slot Home (URL: /slot/:slotId)
├── 컴포넌트: SlotHome.tsx
├── 구성 섹션
│   ├── Welcome Section (WelcomeSectionFixed)
│   │   ├── 인사말: "Hello, {userName}!" (SplitText 애니메이션)
│   │   ├── 서브텍스트: "Welcome to ReadySet Platform..."
│   │   └── Bento Box 그리드 (3열: 2fr 5fr 3fr)
│   │       ├── DataInsightCard (데이터 인사이트)
│   │       ├── IndustryDualBarChart (업종별 듀얼 바 차트)
│   │       └── SolutionOutputCard (솔루션 결과 카드)
│   ├── Slot Overview (SlotOverview)
│   │   ├── 타이틀: "Slot Overview" (48px)
│   │   └── 4열 그리드 (솔루션별 카드)
│   │       ├── DataShot (Database 아이콘, primary 색상)
│   │       ├── Ad Curator (Target 아이콘, green)
│   │       ├── Budget Optimizer (DollarSign 아이콘, amber)
│   │       └── Reach Caster (TrendingUp 아이콘, blue)
│   │       └── 각 카드: 솔루션명 + 선택된 시나리오명 + "결과 보기" 링크
│   ├── Slot Solutions (SlotSolutions)
│   │   ├── 솔루션 플로우 카드 (순서대로)
│   │   │   ├── 1. DataShot → 2. Ad Curator → 3. Budget Optimizer → 4. Reach Caster
│   │   │   └── 각 카드: 상태 (completed/in-progress/empty/coming-soon)
│   │   └── 결과물 선택 기능 (AVAILABLE_OUTPUTS에서 선택)
│   ├── Feed Section (SlotFeedSection)
│   │   └── 최근 활동 피드 (사용자, 솔루션, 작업, 시간)
│   └── Documents Section (DocumentsSection)
│       └── 업로드된 문서 목록 (PDF, XLSX, PPTX, DOCX)
├── 데이터 타입 (slotHomeTypes.ts)
│   ├── SolutionSlot: { key, name, desc, path, status, selectedOutputs }
│   ├── SelectedOutput: { id, title, media?, module?, period?, reach? }
│   ├── DocumentItem: { id, name, type, size, uploadedAt, uploadedBy }
│   └── ActivityItem: { id, user, solution, action, detail, timestamp }
└── 솔루션 플로우 순서
    ├── 1. DataShot: 업종별 벤치마크 기반 광고 효율 분석
    ├── 2. Ad Curator: 캠페인 성과 기반 맞춤형 상품 큐레이션 (coming-soon)
    ├── 3. Budget Optimizer: KPI 목표 기반 미디어믹스 예산 최적화 (coming-soon)
    └── 4. Reach Caster: 크로스미디어 통합 도달 예측 시뮬레이션
```

---

## 4. Reach Caster 솔루션

### 4.1 Slot 상세 (시나리오 목록)

```
Slot 상세 (URL: /reachcaster)
├── 컴포넌트: WorkspaceLayout (initialView="slotDetail")
├── Breadcrumb: SlotBoard / {Slot명} / Reach Caster
├── Slot 헤더 (컴팩트)
│   ├── 좌측
│   │   ├── 가시성 뱃지
│   │   ├── Slot 타이틀 (24px, 굵게)
│   │   └── 광고주 프로필 + 이름(ID) + 구분선 + 설명
│   └── 우측
│       ├── Info 아이콘 (호버 툴팁: Slot ID, 생성일시, 수정일시)
│       └── 관리 메뉴 (수정/삭제)
├── 시나리오 섹션
│   ├── 타이틀: "Scenario" + New Scenario 버튼
│   ├── 버튼 섹션
│   │   ├── 시나리오 개수 (예: "15 Scenarios (3개 선택됨)")
│   │   ├── 검색 (시나리오명, 작성자)
│   │   ├── 필터
│   │   │   ├── 분석 모듈 (Ratio Finder / Reach Predictor)
│   │   │   ├── 상태 (Pending/Processing/Completed/Error)
│   │   │   ├── 업종 / 타겟 GRP / 기간 범위
│   │   │   └── 필터 초기화
│   │   ├── 뷰 모드 토글 (List / Timeline)
│   │   └── 일괄 작업 (삭제/이동)
│   ├── List 뷰
│   │   ├── 테이블 컬럼 (정렬 가능)
│   │   │   ├── 체크박스 / 시나리오 ID / 시나리오명
│   │   │   ├── 분석 모듈 (아이콘 + 텍스트, primary)
│   │   │   ├── 업종 / 타겟 GRP / 기간
│   │   │   ├── 상태 뱃지 (Completed: 검정, Processing: 회색, Error: 빨강)
│   │   │   ├── 진행도 (프로그레스 바 + 단계 설명)
│   │   │   ├── 작성자(ID) / 작성일시
│   │   │   └── 관리 메뉴 (수정/복제/삭제)
│   │   └── 페이지네이션
│   └── Timeline 뷰
│       ├── Zoom 컨트롤 (월/분기/년)
│       ├── 기간 네비게이션 (이전/다음/"오늘")
│       └── 타임라인 바 (상태별 색상, 겹치지 않게 레이어 배치)
└── 정렬: List 뷰 정렬이 Timeline 뷰에도 자동 반영
```

### 4.2 시나리오 생성 (Reach Caster)

```
시나리오 생성 (URL: /reachcaster/scenario/new)
├── 컴포넌트: CreateScenario.tsx
├── Breadcrumb: SlotBoard / {Slot명} / Reach Caster / 새 시나리오 생성
├── 레이아웃
│   ├── 좌측: 스테퍼 + 입력 폼 (800px)
│   ├── 중앙: 세로 구분선
│   └── 우측: Configuration Summary (420px)
├── 미니멀 스테퍼 (상단)
│   ├── Step 1: 기본 정보
│   ├── Step 2: 상세 설정
│   └── Step 3: 검토 및 실행
├── Step 1: 기본 정보 (ScenarioStep1)
│   ├── 시나리오명 * (최대 100자)
│   ├── 설명 (선택, 최대 500자)
│   ├── 분석 모듈 * (라디오 카드)
│   │   ├── Ratio Finder: "TVC와 Digital의 최적 예산 비중을 탐색합니다."
│   │   └── Reach Predictor: "매체 믹스에 따른 통합 광고 성과를 정밀하게 예측합니다."
│   ├── 브랜드 * (검색 가능 드롭다운)
│   ├── 업종 (브랜드 선택 시 자동 표시, 읽기 전용)
│   ├── 캠페인 기간 * (DayPicker, "YYYY년 MM월 DD일")
│   └── 타겟 GRP * (다이얼로그, 남성/여성 4열 그리드)
├── Step 2: Ratio Finder (ScenarioStep2RatioFinder)
│   ├── 총 예산 * (콤마 포맷팅, 한글 변환 표시)
│   ├── 시뮬레이션 단위 * (5% / 10% / 20%)
│   ├── 매체 선택 * (DIGITAL/TVC 탭, 아코디언)
│   │   ├── 매체 목록 + 상품 선택 다이얼로그
│   │   └── 유효성: DIGITAL 1개 이상, TVC 1개 이상
│   └── 예산 배분 비중 * (매체별 + 상품별 100% 검증)
├── Step 2: Reach Predictor (ScenarioStep2ReachPredictor)
│   ├── 분석 대상 매체 설정 *
│   │   ├── 전역 설정 (캠페인 기간 + 타겟 설정, 일괄 적용)
│   │   ├── 매체 추가 버튼 → 매체 선택 다이얼로그 (1000×700px)
│   │   │   ├── TVC / DIGITAL 탭
│   │   │   ├── 테이블 형태 (+ - 확장/축소)
│   │   │   ├── 검색 + 전체 선택
│   │   │   └── 상품 선택 (3열 그리드)
│   │   ├── 매체 설정 테이블 (2줄 레이아웃)
│   │   │   ├── Row 1: 아이콘 + 매체/상품 + 확정 예산 + 예상 노출 + CPM + 삭제
│   │   │   ├── Row 2: 캠페인 기간 버튼 + 타겟팅 버튼 (개별 설정 시 primary)
│   │   │   └── 요약 행: 총 예산/노출/CPM 합계 (Info 툴팁)
│   │   └── 유효성: 최소 1개 매체, 모든 예산 입력
│   └── 리치커브 설정 *
│       ├── 구간 (최소값 ~ 최대값, 원)
│       ├── 리치커브 기준 설정 (라디오 카드)
│       │   ├── 구간 수 기준: 슬라이더 2~20 (기본 10)
│       │   └── 구간별 금액 기준: 입력 필드 (구간 수 ≤ 20 검증)
│       └── 자동 계산 표시
├── Step 3: 검토 및 실행 (Step3)
│   ├── 소요 시간 안내 (최대 20분, 알림 센터 알림)
│   └── 확인 메시지: "우측 Configuration Summary에서 설정 내용을 확인하세요!"
├── Configuration Summary (우측 패널)
│   ├── Step 1: Basic Information (시나리오명, 모듈, 브랜드, 업종, 기간, 타겟)
│   ├── Step 2: Module Configuration (모듈별 설정 상세)
│   └── Step 3: Review & Execute
└── 네비게이션 버튼
    ├── 취소 (ghost) / 이전 / 다음 / 시나리오 생성 요청
    └── 유효성 검사 통과 시 활성화
```

### 4.3 Ratio Finder 결과

```
Ratio Finder 결과 (URL: /reachcaster/scenario/ratio-finder/result)
├── 컴포넌트: RatioFinderResult.tsx
├── 결과 헤더
│   ├── 시나리오 정보 (시나리오명, 타입, 브랜드)
│   ├── 실행 상태/시간
│   └── 액션 (Export PDF/CSV, Copy, Move)
├── 결과 대시보드
│   ├── 핵심 지표 요약 (최적 배분 비율, 최대 도달률)
│   ├── 리치커브 그래프 (최적 배분점 표시)
│   └── 상세 데이터 테이블 (RatioFinderDetailTable)
│       └── 매체/채널/상품별 세분화 결과
└── SpinX AI 챗봇 (플로팅)
```

### 4.4 Reach Predictor 결과

```
Reach Predictor 결과 (URL: /reachcaster/scenario/reach-predictor/result)
├── 컴포넌트: ReachPredictorResult.tsx
├── 결과 헤더 (동일 구조)
├── 결과 대시보드
│   ├── 스코어카드 (ReachPredictorScoreCards)
│   │   └── 통합 도달률, 매체별 도달률, 매체별 기여도
│   ├── 리치커브 차트 (ReachCurveChart)
│   └── 상세 데이터 테이블 (ReachPredictorDetailTable)
└── SpinX AI 챗봇 (플로팅)
```

### 4.5 시나리오 비교

```
시나리오 비교
├── 컴포넌트: ScenarioComparisonPanel.tsx + ScenarioComparisonResult.tsx
├── 비교 패널 (ScenarioComparisonPanel)
│   ├── 비교 대상 시나리오 선택 (동일 타입만)
│   ├── 비교 목적 설정 (ComparisonPurpose)
│   └── 비교 실행
├── 비교 결과 (ScenarioComparisonResult)
│   ├── Reach & CPRP 차트 (ReachCPRPChart)
│   ├── 성과 콤보 차트 (PerformanceComboChart)
│   ├── 채널별 예산 배분 (StackedBar)
│   ├── 통합 리치커브 (UnifiedReachCurve)
│   ├── 예산 요약 테이블 (BudgetSummaryTable)
│   └── 조건 차이 표시 (DiffIndicator)
└── 조건 비교: 기간, 타겟 GRP, 예산 차이 하이라이트
```

---

## 5. DataShot 솔루션

### 5.1 데이터셋 목록

```
데이터셋 목록 (URL: /datashot)
├── 컴포넌트: DatasetList.tsx
├── Breadcrumb: SlotBoard / {Slot명} / DataShot
├── 페이지 헤더
│   ├── 타이틀: "DataShot"
│   └── New Dataset 버튼
├── 데이터셋 목록 테이블
│   ├── 컬럼
│   │   ├── 데이터셋명
│   │   ├── 매체
│   │   ├── 업종
│   │   ├── 조회기간
│   │   ├── 상태 (Completed/Processing/Error)
│   │   ├── 작성자
│   │   ├── 작성일시
│   │   └── 관리 메뉴
│   └── 검색/필터/정렬
└── 페이지네이션
```

### 5.2 데이터셋 생성 (3단계 위자드)

```
데이터셋 생성 (URL: /datashot/new)
├── 컴포넌트: CreateDataset.tsx
├── Breadcrumb: SlotBoard / {Slot명} / DataShot / 새 데이터셋 생성
├── 레이아웃
│   ├── 좌측: 스테퍼 + 입력 폼 (800px)
│   ├── 중앙: 세로 구분선
│   └── 우측: Configuration Summary (ConfigurationSummary.tsx)
├── 미니멀 스테퍼
│   ├── Step 1: 기본 정보
│   ├── Step 2: 상세 설정
│   └── Step 3: 검토 및 실행
├── Step 1: 기본 정보 (CreateDatasetStep1)
│   ├── 데이터셋명 * (최대 30자, 글자수 카운터)
│   │   └── 유효성: 필수, 공백만 불가
│   ├── 설명 (선택, 최대 200자)
│   ├── 구분선 (hr)
│   ├── 조회기간 *
│   │   ├── 기간 타입 라디오: 월별 / 분기별
│   │   ├── MonthRangePicker (시작~종료)
│   │   ├── 안내: "최근 2년치 데이터를 조회할 수 있습니다."
│   │   └── 유효성: 필수, 종료 ≥ 시작, 최대 2년
│   └── 업종 *
│       ├── 클릭 시 IndustryDialog 열기
│       ├── 업종 분류 레벨: 대분류 / 중분류 / 소분류
│       ├── 선택 표시: "n개 업종 선택됨 (대분류)"
│       └── 유효성: 최소 1개 선택
├── Step 2: 상세 설정 (CreateDatasetStep2)
│   ├── 매체 * (6개 버튼 그리드)
│   │   ├── Google Ads / Meta / kakao모먼트
│   │   ├── 네이버 성과형 DA / 네이버 보장형 DA / TikTok
│   │   ├── 선택 시: primary 테두리 + 배경
│   │   └── 매체 변경 시 하위 설정 초기화
│   ├── 매체 미선택 시: 빈 상태 안내
│   │   └── "매체를 먼저 선택해주세요 — 세분화된 조회 조건을 설정할 수 있습니다."
│   ├── 데이터 없음 시: 안내
│   │   └── "설정한 조건에 해당하는 데이터가 없습니다 — Step1으로 돌아가 기간 또는 업종을 다시 선택해주세요."
│   ├── 안내 박스 (Info 아이콘)
│   │   └── "Step1에서 설정한 기간, 업종의 집행 데이터가 있는 {광고상품}만 표시됩니다."
│   ├── 광고 분류 조건 (AdProductsSelector)
│   │   ├── 매체별 광고상품 구조 (apiMappings.ts 기반)
│   │   ├── 계층적 선택 (상위 선택 → 하위 필터링)
│   │   └── 유효성: 필수 선택
│   ├── 타겟팅 옵션 (매체별 조건부 표시)
│   │   ├── 카테고리 선택 (라디오)
│   │   ├── 옵션 선택 (체크박스)
│   │   └── 카테고리 변경 시 옵션 + 지표 초기화
│   └── 지표 * (MetricGroupList)
│       ├── 검색 기능 (실시간 필터링)
│       ├── 그룹별 체크박스 (전체 선택/해제)
│       ├── 타겟팅 옵션에 따라 조회 가능 지표 필터링
│       │   ├── Meta + 기기유형: 일부 지표 제외
│       │   ├── kakao모먼트 + 디바이스: 일부 지표 제외
│       │   └── 네이버 보장형 DA + 노출영역: 일부 지표 제외
│       └── 유효성: 최소 1개 선택
├── Step 3: 검토 및 실행 (CreateDatasetStep3)
│   ├── 샘플 데이터 미리보기 테이블
│   │   ├── 선택한 지표 기반 컬럼 생성
│   │   ├── 목 데이터 행 생성 (generateMockRows)
│   │   └── "샘플 데이터 보기" 버튼 → SampleDataModal
│   └── 실행 안내
│       ├── 소요 시간 안내
│       └── 완료 시 알림 센터 알림
├── Configuration Summary (우측 패널)
│   ├── Step 1: 데이터셋명, 조회기간, 업종 (레벨 + 선택 목록)
│   ├── Step 2: 매체, 광고상품, 타겟팅, 지표 (그룹별 칩)
│   └── Step 3: Review & Execute
└── 네비게이션 버튼
    ├── 취소 / 이전 / 다음 / 데이터셋 생성 요청
    └── 유효성 검사 통과 시 활성화
```

### 5.3 데이터셋 상세

```
데이터셋 상세 (URL: /datashot/:id)
├── 컴포넌트: DatasetDetail.tsx
├── Breadcrumb: SlotBoard / {Slot명} / DataShot / {데이터셋명}
├── 상세 헤더
│   ├── 데이터셋명
│   ├── 상태 뱃지
│   ├── 매체 아이콘 + 매체명
│   ├── 생성일시 / 작성자
│   └── 액션 (Export, 삭제)
├── 설정 정보 요약
│   ├── 업종 (클릭 시 IndustryModal)
│   ├── 조회기간
│   ├── 광고상품 (클릭 시 AdProductsModal)
│   │   └── 타겟팅 정보 포함 (ReadOnlyTargetingSection)
│   └── 지표 (클릭 시 MetricsModal)
│       └── 그룹별 지표 목록 (ReadOnlyMetricGroupRow)
├── 차트 시각화 (DatasetCharts)
│   ├── TotalRowsCard (총 데이터 행 수)
│   ├── ProgressCard (처리 진행도)
│   └── 기타 시각화 차트
├── 데이터 테이블
│   ├── 지표별 필터링 (MetricFilter)
│   ├── 정렬 기능
│   └── 페이지네이션
└── 모달 3종 (DatasetDetailModals)
    ├── IndustryModal: 업종 목록 읽기 전용
    ├── AdProductsModal: 광고상품 + 타겟팅 읽기 전용
    └── MetricsModal: 지표 그룹별 읽기 전용
```

### 5.4 DataShot 데이터 구조

```
FormData (createDatasetTypes.ts)
├── datasetName: string (최대 30자)
├── description: string (최대 200자)
├── media: string (6개 매체 중 택 1)
├── industries: string[] (선택된 업종 목록)
├── industryLevel: 'major' | 'mid' | 'minor' | null
├── period: { startYear, startMonth, endYear, endMonth }
├── periodType: 'month' | 'quarter'
├── products: string[] (선택된 광고상품)
├── metrics: string[] (선택된 지표 ID)
├── targetingCategory: string (타겟팅 카테고리)
└── targetingOptions: string[] (타겟팅 옵션)

Dataset (types.ts)
├── id, name, description
├── media, industries, industryLevel
├── period, periodType
├── products, metrics
├── targetingCategory, targetingOptions
├── status: 'completed' | 'processing' | 'error'
├── createdAt, createdBy
└── 관련 인터페이스
    ├── AdProductField: { label, options }
    ├── MediaAdProductStructure: { fields }
    ├── MetricItem: { id, label }
    ├── MetricGroup: { group, metrics }
    └── TargetingOption: { category, options }

매체별 API 매핑 (apiMappings.ts)
├── Google Ads: 캠페인유형 → 광고상품
├── Meta: 캠페인목표 → 성과목표 → 노출위치
├── kakao모먼트: 캠페인유형 → 광고상품
├── 네이버 성과형 DA: 광고상품
├── 네이버 보장형 DA: 광고상품
└── TikTok: 캠페인목표 → 광고상품
```

---

## 6. SpinX AI 어시스턴트

```
SpinX (src/components/spinx/)
├── SpinXButton.tsx (플로팅 버튼)
│   ├── 위치: 우측 하단 고정
│   ├── 새 메시지 알림 표시 (hasNewMessage)
│   ├── 다크모드 대응
│   └── 열림/닫힘 상태 토글
├── SpinXPanel.tsx (채팅 패널)
│   ├── SpinXHeader (리셋, 닫기)
│   ├── SpinXMessages (메시지 목록)
│   │   ├── 텍스트 메시지 (각주 렌더링)
│   │   ├── 차트 메시지 (SpinXChartBubble)
│   │   └── 에러 메시지 (SpinXErrorBubble, 재시도)
│   ├── SpinXClarifying (명확화 질문)
│   └── SpinXInput (입력 영역)
├── PulseNodeX.tsx (펄스 애니메이션 노드)
└── 기능
    ├── 시나리오 결과 기반 질의응답
    ├── 차트 시각화 응답
    ├── 에러 시 재시도 (retryCount 추적)
    └── 대화 리셋
```

---

## 7. 공통 컴포넌트 및 레이아웃

### 7.1 레이아웃 (src/components/layout/)

```
AppLayout
├── 역할: 전체 페이지 레이아웃 래퍼
├── 구성: GNB + Sidebar + 메인 콘텐츠
└── 사용: 모든 페이지 공통

GlobalNavBar (GNB)
├── 좌측: 로고 (ReadySet, 클릭 시 홈)
├── 중앙: 알림 bar 메시지
│   ├── 알림 0개: "Ready to Set? 최상의 성과를 위한 전략을 세팅하세요."
│   └── 알림 1개+: 가장 최근 알림 메시지
├── 우측
│   ├── 솔루션 메뉴 드롭다운
│   ├── 알림 센터 (Bell, 읽지 않은 개수 뱃지)
│   │   ├── 알림 타입: task(작업) / notice(공지) / level(레벨)
│   │   ├── 솔루션명 + 결과물명 + 메시지
│   │   └── 시간 표시 (n분 전)
│   ├── 다크모드 토글
│   ├── 사용자 프로필 메뉴
│   │   ├── 사용자 정보
│   │   ├── GradeCard (등급 카드)
│   │   └── 로그아웃
│   └── 광고주 선택 드롭다운
└── 토스트 알림 시스템

Sidebar (SNB)
├── 워크스페이스 홈
├── Slot 트리 (전체 펼치기/접기)
│   ├── Slot별 시나리오 개수
│   └── 솔루션별 그룹핑
└── 빠른 네비게이션

Breadcrumb
├── 4단계 계층
│   ├── Level 1: SlotBoard (클릭 가능)
│   ├── Level 2: Slot명 (클릭 불가)
│   ├── Level 3: 솔루션명 (클릭 가능)
│   └── Level 4: 세부 페이지명 (현재 위치)
├── 구분자: ChevronRight (14px)
└── 정책: plan/spec/Breadcrumb_Navigation_Policy.md

GradeCard
├── 사용자 등급 표시
├── 등급 진행도
└── 다음 등급까지 안내

Footer
└── 저작권, 링크
```

### 7.2 공통 컴포넌트 (src/components/common/)

```
Avatar: 프로필 아바타 (이니셜, 색상 자동 생성)
Calendar: 캘린더 컴포넌트
CircularText: 원형 텍스트 애니메이션
MediaIcons: 매체별 아이콘 (Google, Meta, Kakao, Naver, TikTok)
SplashCursor: WebGL 커서 인터랙션 효과 (OGL)
SplitText: 글자별 등장 애니메이션
```

---

## 8. 상태 관리 및 데이터 흐름

### 8.1 Reach Caster 상태

```typescript
// CreateScenario 상태
formData: ScenarioFormData {
  scenarioName, description, moduleType, brand, industry,
  period: { start, end }, targetGrp: string[]
}

// Ratio Finder 전용
totalBudget, simulationUnit, selectedMedia, mediaRatios, productRatios

// Reach Predictor 전용
reachPredictorMedia: ReachPredictorMedia[] {
  id, category, mediaName, productName, budget, impressions, period?, targetGrp?
}
reachCurveSettings: { min, max, type, count/amount }

// UI 상태
currentStep: 1 | 2 | 3
validationActive: boolean
isSubmitting: boolean
```

### 8.2 DataShot 상태

```typescript
// CreateDataset 상태
formData: FormData {
  datasetName, description, media, industries, industryLevel,
  period: { startYear, startMonth, endYear, endMonth },
  periodType: 'month' | 'quarter',
  products, metrics, targetingCategory, targetingOptions
}

// UI 상태
currentStep: 1 | 2 | 3
validationActive: boolean
industryDialogOpen: boolean
```

### 8.3 데이터 흐름

```
[사용자 입력]
    ↓
[Step 컴포넌트] (props: formData, setFormData)
    ↓
[메인 컨테이너 상태 업데이트]
    ↓
[Configuration Summary 실시간 반영]
    ↓
[유효성 검사] (validationActive 시)
    ↓
[다음 단계 진행 또는 차단]
    ↓
[Step 3: 최종 확인]
    ↓
[생성 요청 (비동기)]
    ↓
[완료 시 목록 페이지로 이동 + 알림 센터 알림]
```

---

## 9. 권한 및 보안

### 9.1 사용자 역할

```
Admin: 모든 광고주 폴더 접근, 전체 CRUD
Marketer: 할당된 광고주 폴더 접근, CRUD
Agency: 할당된 광고주 폴더 (읽기 전용)
Client: 본인 광고주 폴더 (읽기 전용)
```

### 9.2 기능별 권한 매트릭스

```
Slot 관리: Create/Update/Delete → Admin, Marketer
시나리오 관리: Create/Delete/Copy/Move → Admin, Marketer
데이터셋 관리: Create/Delete → Admin, Marketer
Export: All Users
비교: All Users
SpinX 챗봇: All Users
```

### 9.3 데이터 격리

```
광고주 레벨: 완전 분리, 교차 접근 차단
Slot 레벨: 가시성 설정 기반 (Private/Internal/Shared)
시나리오/데이터셋: Slot 권한 상속
이동 제약: 동일 광고주 내에서만
```

---

## 10. 시나리오 상태 플로우

```
생성 요청 → Pending (취소 가능)
    ↓
Processing (진행률 표시, 취소 가능)
    ↓
Completed (결과 확인) / Error (재시도) / Cancelled (재생성)
```

---

## 11. 문서 시스템

```
Docs (URL: /docs/:slug)
├── 컴포넌트: DocsLayout.tsx
├── 데이터: docsData.ts
├── 스타일: docs.css
└── 기능: 마크다운 기반 문서 렌더링
```

---

## 12. 기타

### 12.1 에러 페이지

```
ErrorPage (URL: /error)
├── 컴포넌트: ErrorPage.tsx
└── 404, 500 등 에러 상태 표시
```

### 12.2 컴포넌트 라이브러리

```
ComponentLibrary (URL: /component)
├── 컴포넌트: ComponentLibrary.tsx
└── 디자인 시스템 컴포넌트 카탈로그
```

---

## 주요 업데이트 내용 (v1.6 → v2.0)

- **DataShot 솔루션 전체 IA 추가**:
  - 데이터셋 목록/생성/상세 3개 화면 완전 문서화
  - 3단계 위자드 (기본 정보 → 상세 설정 → 검토 및 실행)
  - 6개 매체 지원 (Google Ads, Meta, kakao모먼트, 네이버 성과형/보장형 DA, TikTok)
  - 매체별 광고상품 계층 구조, 타겟팅 옵션, 지표 그룹 상세
  - Configuration Summary 실시간 반영
  - DatasetDetail 모달 3종 (업종/광고상품/지표)

- **Slot Home 구조 추가**:
  - /slot/:slotId 라우트 추가
  - Welcome Section (Bento Box 그리드)
  - Slot Overview (4개 솔루션 카드)
  - Slot Solutions (솔루션 플로우 순서)
  - Feed Section + Documents Section

- **시나리오 비교 기능 상세화**:
  - ScenarioComparisonPanel + ScenarioComparisonResult
  - 5종 차트 (Reach&CPRP, Performance Combo, StackedBar, UnifiedReachCurve, BudgetSummary)
  - 조건 차이 하이라이트 (DiffIndicator)

- **GNB 알림 시스템 상세화**:
  - 알림 bar 노출 정책 (0개 시 고정 메시지, 1개+ 시 최근 알림)
  - 알림 타입: task/notice/level
  - 광고주 선택 드롭다운
  - GradeCard (사용자 등급)

- **SpinX AI 어시스턴트 상세화**:
  - 10개 컴포넌트 구조 문서화
  - 차트 메시지, 명확화 질문, 에러 재시도 기능

- **라우팅 구조 확장**:
  - /slot/:slotId, /datashot, /datashot/new, /datashot/:id
  - /docs, /docs/:slug, /component, /error 추가
