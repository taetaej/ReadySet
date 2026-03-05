# Reach Caster 시나리오 목록 화면 정의서

## 문서 정보
- **작성일**: 2026-03-05
- **버전**: v1.0
- **대상 화면**: Slot 상세 (시나리오 목록)

---

## 1. 화면 개요

Slot 내의 모든 시나리오를 관리하는 화면으로, 리스트 뷰와 타임라인 뷰를 제공하여 시나리오의 상태, 진행 상황, 일정을 한눈에 파악할 수 있습니다.

---

## 2. 화면 구성

### 2.1 Slot 정보 헤더 (SlotHeader)

**레이아웃**: 상단 고정 영역

**구성 요소**:
- **Slot 제목**: 20px, 굵게
- **광고주 정보**: 광고주명 + 광고주 ID
- **공개 범위**: Private / Public 뱃지
- **통계 정보**:
  - 결과 개수: N개
  - 최종 수정일: YYYY-MM-DD HH:mm
- **설명**: Slot 설명 텍스트
- **액션 버튼**:
  - 편집 (Edit 아이콘)
  - 삭제 (Trash2 아이콘)

**스타일**:
- 배경: card 배경
- 패딩: 24px
- 둥근 모서리: 8px
- 그림자: 미세한 shadow

---

### 2.2 타이틀 섹션

**레이아웃**: `(Title) (New Scenario Button)`

**구성 요소**:
- **타이틀**: "Reach Caster" (24px, 굵게)
- **New Scenario 버튼**:
  - 스타일: Primary 색상, 둥근 모서리 (24px)
  - 아이콘: Plus
  - 텍스트: "New Scenario"
  - 높이: 48px
  - 클릭: `/reachcaster/scenario/new` 페이지로 이동

---

### 2.3 컨트롤 섹션

**레이아웃**: `(View Toggle + Count) ... (Bulk Actions) (Search) (Filter)`

#### 2.3.1 좌측 영역

**뷰 모드 토글**:
- 스타일: 토글 버튼 그룹 (muted 배경)
- 옵션:
  - List 아이콘: 리스트 뷰
  - Calendar 아이콘: 타임라인 뷰
- 선택된 버튼: 흰색 배경 + 그림자

**시나리오 개수**:
- 표시: "N Scenarios" (14px, muted-foreground)
- 선택 시: "(N개 선택됨)" 추가 표시 (primary 색상)

#### 2.3.2 우측 영역

**일괄 작업 버튼** (선택된 항목이 있을 때만 표시):
- **이동 버튼**:
  - 아이콘: ArrowRightLeft
  - 텍스트: "이동"
  - 스타일: Ghost 버튼 + 테두리
  - 클릭: 이동 다이얼로그 표시
- **삭제 버튼**:
  - 아이콘: Trash2
  - 텍스트: "삭제"
  - 스타일: Destructive 색상
  - 클릭: 확인 다이얼로그 후 삭제

**검색**:
- 초기 상태: 버튼 형태 (Search 아이콘 + "검색" 텍스트)
- 확장 상태:
  - 너비: 300px
  - 애니메이션: 0.3s ease-out
  - 플레이스홀더: "시나리오명, 작성자"
  - 좌측 아이콘: Search (고정)
  - 우측 아이콘: X (검색어 있을 때만, 클릭 시 초기화)
  - 포커스 아웃 시: 검색어 없으면 버튼으로 복귀
- 검색 대상: 시나리오명, 작성자명, 작성자 ID

**필터**:
- 버튼: Filter 아이콘 + "필터" 텍스트
- 활성 필터 있을 때:
  - 배경: primary/0.1
  - 뱃지: 활성 필터 개수 표시 (primary 배경)
- 클릭: 필터 드롭다운 표시

---

### 2.4 필터 드롭다운

**위치**: 필터 버튼 하단 우측 정렬

**크기**: 320px 너비, 최대 500px 높이

**필터 항목**:

#### 2.4.1 분석 모듈
- 체크박스 리스트
- 옵션: Ratio Finder, Reach Predictor

#### 2.4.2 상태
- 체크박스 리스트
- 옵션: Completed, Processing, Pending, Error

#### 2.4.3 업종
- 체크박스 리스트
- 스크롤 가능 (최대 150px)
- 옵션: 시나리오에서 사용된 모든 업종 (동적)

**필터 초기화 버튼**:
- 위치: 하단
- 스타일: Ghost 버튼, 전체 너비
- 텍스트: "필터 초기화"

---

### 2.5 리스트 뷰

#### 2.5.1 테이블 구조

**컬럼 구성**:
1. **체크박스** (50px)
   - 헤더: 전체 선택/해제
   - 행: 개별 선택

2. **ID** (80px)
   - 정렬 가능
   - 표시: #N 형식
   - 색상: muted-foreground

3. **시나리오** (최소 250px)
   - 정렬 가능
   - 시나리오명 표시
   - Completed 상태: 클릭 가능 (결과 화면으로 이동)
   - 기타 상태: 클릭 불가 (opacity 0.6)

4. **분석 모듈** (150px)
   - 정렬 가능
   - 뱃지 스타일:
     - 배경: foreground
     - 텍스트: background
     - 아이콘: Scale (Ratio Finder), Target (Reach Predictor)
     - 크기: 12px

5. **업종** (100px)
   - 정렬 가능
   - 색상: muted-foreground

6. **타겟 GRP** (180px)
   - 정렬 가능
   - 표시 형식:
     - "전체": Users 아이콘 + "전체"
     - 세그먼트: User 아이콘 + "N개 세그먼트"
   - 색상: muted-foreground
   - 크기: 12px

7. **기간** (200px)
   - 정렬 가능 (시작일 기준)
   - 표시 형식:
     ```
     YYYY-MM-DD →
     YYYY-MM-DD
     ```
   - 2줄 표시
   - 색상: muted-foreground

8. **상태** (130px)
   - 정렬 가능
   - 상태별 표시:
     - **Processing**: 프로그레스바 + 단계 정보
     - **Completed**: 뱃지 + 완료일시
     - **Pending**: 뱃지
     - **Error**: 뱃지 + 재시도 버튼 + 완료일시

9. **작성자** (100px)
   - 정렬 가능
   - 표시: 작성자명(작성자ID)
   - 색상: muted-foreground

10. **작성일시** (140px)
    - 정렬 가능
    - 표시: YYYY-MM-DD HH:mm
    - 색상: muted-foreground

11. **액션** (60px)
    - 컨텍스트 메뉴 버튼 (MoreVertical 아이콘)

#### 2.5.2 상태 뱃지 스타일

**Completed**:
- 배경: foreground
- 텍스트: background
- 테두리: foreground

**Processing**:
- 프로그레스바:
  - 너비: 100px
  - 높이: 24px
  - 배경: muted
  - 진행: foreground (동적 너비)
  - 텍스트: "Processing" (중앙, background 색상)
- 하단 정보: "N/5 · 단계 설명" (11px, muted-foreground)

**Pending**:
- 배경: transparent
- 텍스트: muted-foreground
- 테두리: border

**Error**:
- 배경: destructive
- 텍스트: destructive-foreground
- 테두리: destructive
- 재시도 버튼: 텍스트 버튼, 밑줄, 11px

#### 2.5.3 행 인터랙션

**선택 상태**:
- 배경: muted/0.3

**클릭 (Completed만)**:
- 커서: pointer
- 이동:
  - Ratio Finder: `/reachcaster/scenario/ratio-finder/result`
  - Reach Predictor: `/reachcaster/scenario/reach-predictor/result`
- state로 scenarioData 전달

**컨텍스트 메뉴**:
- 트리거: MoreVertical 버튼 클릭
- 위치: 버튼 하단 우측 정렬
- 너비: 120px
- 메뉴 항목:
  - 복제 (Copy 아이콘)
  - 이동 (ArrowRightLeft 아이콘)
  - 삭제 (Trash2 아이콘)

#### 2.5.4 정렬

**정렬 아이콘**:
- 오름차순: ChevronUp (14px)
- 내림차순: ChevronDown (14px)
- 위치: 컬럼명 우측

**정렬 로직**:
- 같은 컬럼 클릭: 오름차순 ↔ 내림차순 토글
- 다른 컬럼 클릭: 해당 컬럼 오름차순으로 변경

---

### 2.6 타임라인 뷰 (Gantt)

#### 2.6.1 타임라인 컨트롤

**레이아웃**: `(Prev) (Period) (Next) ... (Zoom) (Today)`

**좌측 영역**:
- **이전/다음 버튼**: ChevronLeft/Right 아이콘
- **기간 표시**: 중앙 정렬, 최소 120px
  - 월: "YYYY년 M월"
  - 분기: "YYYY년 QN"
  - 년: "YYYY년"

**우측 영역**:
- **Zoom 컨트롤**: 토글 버튼 그룹
  - 옵션: 월, 분기, 년
  - 선택된 버튼: muted 배경
- **오늘 버튼**: 현재 날짜로 이동

**스타일**:
- 배경: muted/0.3
- 패딩: 8px 12px
- 둥근 모서리: 6px

#### 2.6.2 타임라인 그리드

**헤더 (Sticky)**:
- 위치: 상단 고정
- 배경: muted/0.5 + backdrop-filter blur
- 테두리: 하단 border
- 그리드:
  - 월: 1열 (해당 월)
  - 분기: 3열 (3개월)
  - 년: 12열 (12개월)

**콘텐츠 영역**:
- 최소 높이: 700px
- 패딩: 16px 0
- 배경 그리드: 기간 구분선 (border/0.2)

#### 2.6.3 시나리오 바

**위치 계산**:
- 좌측 (left): 시작일 기준 백분율
- 너비 (width): 기간 일수 기준 백분율
- 상단 (top): 레이어 인덱스 × 68px + 16px
- 높이: 48px

**레이어 로직**:
- 겹치는 시나리오는 다른 레이어에 배치
- 겹침 조건: 시작일 ≤ 다른 항목 종료일 AND 종료일 ≥ 다른 항목 시작일

**스타일**:
- 배경: primary
- 텍스트: primary-foreground
- 둥근 모서리: 6px
- 그림자: 0 1px 3px rgba(0,0,0,0.1)
- 선택 시: 2px ring 테두리

**좌측 상태 바**:
- 너비: 3px
- 높이: 100%
- 색상:
  - Error: destructive
  - Completed: primary-foreground
  - Processing: rgba(255,255,255,0.5)
  - Pending: rgba(255,255,255,0.3)

**내용**:
- **시나리오명** (12px, 굵게):
  - 말줄임 처리
- **상세 정보** (10px, opacity 0.85):
  - 타입 (RF/RP) + 아이콘
  - 업종
  - 상태 (Processing은 N/5 표시)
  - 작성자
  - 구분자: "•"

**인터랙션**:
- 클릭: 체크박스 토글
- 호버: 툴팁 표시
  - 시나리오명
  - 기간
  - 작성자(작성자ID)

---

### 2.7 페이지네이션

**레이아웃**: `(Page Size) ... (Page Info) (Navigation)`

**좌측 영역**:
- 레이블: "페이지당 표시:"
- 드롭다운: 10, 20, 50 옵션
- 너비: 80px

**우측 영역**:
- **페이지 정보**: "N-M / Total개"
- **네비게이션**:
  - 첫 페이지: ChevronLeft × 2
  - 이전 페이지: ChevronLeft
  - 페이지 번호: 최대 5개 표시
  - 다음 페이지: ChevronRight
  - 마지막 페이지: ChevronRight × 2
- **버튼 스타일**:
  - 크기: 32px × 32px
  - 현재 페이지: primary 배경
  - 비활성: opacity 0.5, cursor not-allowed

**페이지 번호 로직**:
- 현재 페이지 중심으로 최대 5개 표시
- 범위 초과 시 시작/끝 조정

---

### 2.8 이동 다이얼로그

**트리거**:
- 일괄 작업 "이동" 버튼
- 컨텍스트 메뉴 "이동" 항목

**구조**:
- **제목**: "시나리오 이동"
- **설명**: "선택한 N개 시나리오를 다른 Slot으로 이동합니다."
- **내용**:
  - 레이블: "이동할 Slot 선택 (광고주: [광고주명])"
  - 드롭다운: 같은 광고주의 다른 Slot 목록
  - 플레이스홀더: "Slot을 선택하세요"
- **액션**:
  - 취소: Secondary 버튼
  - 이동: Primary 버튼

---

## 3. 데이터 구조

### 3.1 시나리오 객체

```typescript
interface Scenario {
  id: number
  name: string
  description: string
  type: 'Ratio Finder' | 'Reach Predictor'
  industry: string
  targetGrp: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  status: 'Completed' | 'Processing' | 'Pending' | 'Error'
  processStep: number // 0-5
  totalSteps: number // 5
  stepDescription: string
  created: string // YYYY-MM-DD HH:mm
  creator: string
  creatorId: string
  completedAt: string | null
  errorMessage: string | null
  
  // Reach Predictor 전용
  reachPredictorMedia?: MediaItem[]
  period?: { start: string, end: string }
  targetGrpArray?: string[]
}
```

### 3.2 상태 관리

```typescript
// 뷰 모드
const [viewMode, setViewMode] = useState<'list' | 'gantt'>('list')

// 정렬
const [sortField, setSortField] = useState<SortField>('id')
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

// 페이지네이션
const [currentPage, setCurrentPage] = useState(1)
const [itemsPerPage] = useState(10)

// 선택
const [selectedScenarios, setSelectedScenarios] = useState<number[]>([])

// 컨텍스트 메뉴
const [contextMenuOpen, setContextMenuOpen] = useState<number | null>(null)

// 타임라인
const [timelineZoom, setTimelineZoom] = useState<'month' | 'quarter' | 'year'>('quarter')
const [timelineYear, setTimelineYear] = useState(2024)
const [timelineMonth, setTimelineMonth] = useState(1)
const [timelineQuarter, setTimelineQuarter] = useState(1)

// 검색 & 필터
const [searchExpanded, setSearchExpanded] = useState(false)
const [searchQuery, setSearchQuery] = useState('')
const [filterOpen, setFilterOpen] = useState(false)
const [statusFilter, setStatusFilter] = useState<string[]>([])
const [moduleFilter, setModuleFilter] = useState<string[]>([])
const [industryFilter, setIndustryFilter] = useState<string[]>([])

// 다이얼로그
const [showMoveDialog, setShowMoveDialog] = useState(false)
```

---

## 4. 인터랙션 플로우

### 4.1 시나리오 생성
1. "New Scenario" 버튼 클릭
2. `/reachcaster/scenario/new` 페이지로 이동
3. 시나리오 생성 완료 후 목록으로 복귀

### 4.2 시나리오 조회
1. 리스트 뷰에서 Completed 상태 시나리오 클릭
2. 분석 모듈에 따라 결과 화면으로 이동
3. state로 시나리오 데이터 전달

### 4.3 시나리오 검색
1. 검색 버튼 클릭 → 입력 필드 확장
2. 검색어 입력 → 실시간 필터링
3. X 버튼 또는 포커스 아웃 → 초기화

### 4.4 시나리오 필터링
1. 필터 버튼 클릭 → 드롭다운 표시
2. 체크박스 선택 → 실시간 필터링
3. 필터 초기화 버튼 → 모든 필터 해제

### 4.5 시나리오 정렬
1. 컬럼 헤더 클릭
2. 같은 컬럼: 오름차순 ↔ 내림차순 토글
3. 다른 컬럼: 해당 컬럼 오름차순

### 4.6 시나리오 선택 및 일괄 작업
1. 체크박스로 시나리오 선택
2. 일괄 작업 버튼 표시
3. 이동 또는 삭제 실행

### 4.7 타임라인 네비게이션
1. Zoom 레벨 선택 (월/분기/년)
2. 이전/다음 버튼으로 기간 이동
3. 오늘 버튼으로 현재 날짜로 이동

---

## 5. 반응형 및 접근성

### 5.1 반응형
- 테이블: 가로 스크롤 (overflow-x: auto)
- 타임라인: 부모 컨테이너 너비 100%
- 검색 필드: 300px 고정 너비
- 필터 드롭다운: 320px 고정 너비

### 5.2 접근성
- 체크박스: 키보드 접근 가능
- 버튼: 포커스 스타일 제공
- 정렬: 키보드로 활성화 가능
- 컨텍스트 메뉴: ESC로 닫기

---

## 6. 기술 스택

### 6.1 라이브러리
- **React**: 18.x
- **React Router**: 네비게이션
- **Lucide React**: 아이콘

### 6.2 아이콘
- Plus, List, Calendar, ChevronDown, ChevronUp, ChevronLeft, ChevronRight
- Scale, Target, Users, User, Search, X, Filter, ArrowRightLeft
- MoreVertical, Edit, Trash2, Copy

### 6.3 상태 관리
- React useState
- 로컬 상태 관리

---

## 7. 향후 개선 사항

### 7.1 단기
- [ ] 로딩 스켈레톤 UI
- [ ] 토스트 메시지 (복제/이동/삭제 완료)
- [ ] 드래그 앤 드롭으로 이동

### 7.2 중기
- [ ] 시나리오 일괄 편집
- [ ] 필터 프리셋 저장
- [ ] 타임라인 뷰 확대/축소

### 7.3 장기
- [ ] 시나리오 템플릿
- [ ] 시나리오 비교 모드
- [ ] 협업 기능 (댓글, 공유)

---

## 8. 참고 자료

### 8.1 관련 컴포넌트
- `SlotDetail.tsx`: 시나리오 목록 화면 (본 문서)
- `SlotHeader.tsx`: Slot 정보 헤더
- `CreateScenario.tsx`: 시나리오 생성 화면

### 8.2 디자인 시스템
- 색상: CSS 변수 기반
- 간격: 4px 단위
- 둥근 모서리: 4px, 6px, 8px, 12px, 24px
- 그림자: 0 1px 3px rgba(0,0,0,0.1)
