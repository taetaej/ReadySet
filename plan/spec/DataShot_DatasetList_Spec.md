# DataShot — 데이터셋 목록 화면 상세 명세서

> 목적: QA 테스트케이스(TC) 작성 기준 문서  
> 버전: v1.2  
> 작성일: 2026-05-26  
> 최종 수정일: 2026-06-04  
> 참조: `plan/eunseo/DataShot_Phase1_policy_IA_v1.0.md`

---

## 1. 화면 개요

| 항목 | 내용 |
|---|---|
| 화면명 | 데이터셋 목록 (DataShot List) |
| 경로 | `/datashot` |
| 진입 경로 | SlotBoard → Slot 선택 → DataShot |
| 접근 권한 | Admin, Marketer, Client, Agency (전 역할 조회 가능) |
| 주요 기능 | 데이터셋 목록 조회, 검색, 필터, 정렬, 페이지네이션, 생성 진입, 복제/이동/삭제 |

---

## 2. 레이아웃 구조

### 2.1 전체 구조

```
┌─────────────────────────────────────────────────────┐
│ AppLayout (GlobalNavBar + Sidebar + Breadcrumb)      │
│  ├── isDarkMode / onToggleDarkMode                  │
│  ├── isSidebarCollapsed / onToggleSidebar           │
│  └── expandedFolders / onToggleFolder               │
├─────────────────────────────────────────────────────┤
│ SlotHeader (Slot 정보 표시)                          │
├─────────────────────────────────────────────────────┤
│ 타이틀 섹션: "DataShot" + [New Dataset] 버튼         │
├─────────────────────────────────────────────────────┤
│ 액션바: 데이터셋 개수 | 선택 액션 | 검색 | 필터       │
├─────────────────────────────────────────────────────┤
│ 테이블 (데이터셋 목록)                               │
├─────────────────────────────────────────────────────┤
│ 페이지네이션                                         │
└─────────────────────────────────────────────────────┘
```

### 2.2 의존 모듈

| 모듈 | 역할 |
|---|---|
| `AppLayout` | 전체 레이아웃 래퍼 (GNB + Sidebar + Breadcrumb) |
| `SlotHeader` | Slot 정보 헤더 (reachcaster에서 공유) |
| `useSidebarState` | 사이드바 상태 관리 훅 (collapsed, expandedFolders) |
| `maskEmail` | 이메일 마스킹 유틸 (예: `user@example.com` → `us***@example.com`) |
| `getDarkMode` / `setDarkMode` | 다크모드 상태 관리 (utils/theme) |
| `sampleDatasets` | 목 데이터 (types.ts에서 import) |

### 2.3 Breadcrumb

| 순서 | 라벨 | 동작 |
|---|---|---|
| 1 | SlotBoard | `/slotboard`로 이동 |
| 2 | {Slot명} | Slot 상세로 이동 |
| 3 | DataShot | 현재 페이지 (비활성) |

---

## 3. 컴포넌트 세부사항

### 3.1 타이틀 섹션

| 요소 | 스펙 |
|---|---|
| 타이틀 텍스트 | "DataShot", font-size: 24px, font-weight: 600 |
| New Dataset 버튼 | 아이콘: Plus(16px) + 텍스트 "New Dataset" |
| 버튼 스타일 | bg: primary, color: primary-foreground, border-radius: 24px, height: 48px, padding: 12px 20px |
| 버튼 클릭 | `/datashot/new`로 네비게이션 |
| 권한 제어 | Admin, Marketer만 표시 (Client, Agency는 버튼 미노출) |

### 3.2 액션바

#### 3.2.1 좌측 — 데이터셋 개수

| 요소 | 스펙 |
|---|---|
| 텍스트 | `{filteredDatasets.length} Datasets` |
| 스타일 | font-size: 14px, color: muted-foreground |
| 동적 반영 | 검색/필터 적용 시 필터링된 결과 수 표시 |

#### 3.2.2 우측 — 선택 액션 (조건부 노출)

| 조건 | 노출 요소 |
|---|---|
| selectedDatasets.length > 0 | "{N}개 선택됨" 텍스트 + 이동 버튼 + 삭제 버튼 |
| selectedDatasets.length === 0 | 미노출 |

| 버튼 | 아이콘 | 텍스트 | 스타일 | 동작 |
|---|---|---|---|---|
| 이동 | ArrowRightLeft(16px) | "이동" | ghost + border | 이동 다이얼로그 오픈 |
| 삭제 | Trash2(16px) | "삭제" | destructive bg | 삭제 확인 다이얼로그 오픈 |

#### 3.2.3 검색

| 상태 | UI |
|---|---|
| 축소 (기본) | 버튼: Search 아이콘 + "검색" 텍스트, border 스타일 |
| 확장 | input width: 300px, placeholder: "데이터셋명, 생성자", 좌측 Search 아이콘, 우측 X 버튼 (값 있을 때) |

| 동작 | 설명 |
|---|---|
| 버튼 클릭 | searchExpanded = true, input 자동 포커스 |
| 입력 | 데이터셋명, 생성자 필드 대상 실시간 필터링 (case-insensitive) |
| X 클릭 | 검색어 초기화 + 축소 |
| blur (값 없을 때) | 자동 축소 |

#### 3.2.4 필터

| 요소 | 스펙 |
|---|---|
| 버튼 | Filter 아이콘 + "필터" 텍스트 |
| 활성 표시 | 필터 적용 시 bg: primary/0.1 + 뱃지(적용 필터 수) |
| 드롭다운 | width: 320px, max-height: 500px, position: absolute right |

| 필터 카테고리 | 옵션 | 타입 |
|---|---|---|
| 상태 | Completed, Processing, Pending, Error, Expired | 다중 선택 (checkbox) |
| 매체 | Google Ads, Meta, kakao모먼트, 네이버 성과형 DA, 네이버 보장형 DA, TikTok | 다중 선택 (checkbox) |

| 동작 | 설명 |
|---|---|
| 체크박스 선택 | 해당 필터 즉시 적용 (OR 조건) |
| 필터 초기화 버튼 | 모든 필터 해제 |
| 필터 간 결합 | 상태 AND 매체 (교차 필터) |

### 3.3 테이블

#### 3.3.1 테이블 헤더

| 컬럼 | 너비 | 정렬 가능 | 정렬 키 |
|---|---|---|---|
| 체크박스 | 50px | X | - |
| ID | 80px | O | `id` |
| 데이터셋명 | min 200px | O | `name` |
| 매체 | 120px | O | `media` |
| 업종 | 100px | O | `industry` |
| 조회 기간 | 180px | O | `startDate` |
| 상태 | 100px | O | `status` |
| 생성자 | 100px | O | `creator` |
| 생성일시 | 140px | O | `created` |
| 액션 (⋮) | 60px | X | - |

#### 3.3.2 정렬 동작

| 동작 | 설명 |
|---|---|
| 헤더 클릭 (다른 컬럼) | 해당 컬럼 asc 정렬 |
| 헤더 클릭 (같은 컬럼) | asc ↔ desc 토글 |
| 기본 정렬 | `created` desc (최신순) |
| 정렬 아이콘 | 활성 컬럼에만 ChevronUp/ChevronDown 표시 |

#### 3.3.3 테이블 행 (Row)

| 필드 | 표시 형식 | 비고 |
|---|---|---|
| 체크박스 | checkbox | 클릭 시 행 선택 (행 클릭 이벤트와 독립) |
| ID | 숫자 | font-size: 13px, muted-foreground |
| 데이터셋명 | 텍스트 | font-size: 13px, font-weight: 500. 비활성 상태면 muted-foreground |
| 매체 | 텍스트 | font-size: 13px |
| 업종 | Building2 아이콘 + "{레벨} {N}개" | font-size: 12px, muted-foreground |
| 조회 기간 | `{startDate} → {endDate}` 또는 `{year}-Q{n} → {year}-Q{n}` | periodType에 따라 포맷 분기 |
| 상태 | 뱃지 | 상태별 색상 (아래 참조) |
| 생성자 | `{이름} ({마스킹된 이메일})` | maskEmail 유틸 적용 |
| 생성일시 | `YYYY-MM-DD HH:mm` | font-size: 13px |
| 액션 | MoreVertical 아이콘 | 컨텍스트 메뉴 트리거 |

#### 3.3.4 상태 뱃지 스타일

| 상태 | 배경색 | 텍스트색 | 테두리 |
|---|---|---|---|
| Completed | foreground | background | foreground |
| Processing | muted | foreground | border |
| Pending | transparent | muted-foreground | border |
| Error | destructive | destructive-foreground | destructive |
| Expired | destructive | destructive-foreground | destructive |

#### 3.3.5 업종 표시 로직

| 조건 | 표시 |
|---|---|
| industryLevel === null 또는 industry === '전체' | "대분류 22개" |
| industryLevel 존재 | `{대분류/중분류/소분류} {industryCount}개` |

#### 3.3.6 행 클릭 동작

| 상태 | 클릭 가능 | 동작 |
|---|---|---|
| Completed | O | `/datashot/{id}`로 이동 (state: datasetData, slotData 전달) |
| Processing | X | cursor: default, 호버 효과 없음 |
| Pending | X | cursor: default, 호버 효과 없음 |
| Error | X | cursor: default, 호버 효과 없음 |
| Expired | X | cursor: default, 호버 효과 없음 |

- 호버 효과: Completed 상태만 `bg: muted/0.3`

#### 3.3.7 컨텍스트 메뉴 (⋮)

| 메뉴 항목 | 아이콘 | 동작 | 권한 |
|---|---|---|---|
| 복제 | Copy(14px) | 조회 조건 상속 → 생성 화면 진입 | Admin, Marketer |
| 이동 | ArrowRightLeft(14px) | 이동 다이얼로그 오픈 (해당 1건 선택) | Admin, Marketer |
| 삭제 | Trash2(14px) | 삭제 확인 다이얼로그 오픈 (해당 1건) | Admin, Marketer |

- 메뉴 위치: position absolute, top: 100%, right: 0, width: 120px
- 다른 곳 클릭 시 메뉴 닫힘

### 3.4 체크박스 선택

| 동작 | 설명 |
|---|---|
| 헤더 체크박스 클릭 | 현재 필터링된 전체 데이터셋 선택/해제 토글 |
| 개별 체크박스 클릭 | 해당 행 선택/해제 |
| 전체 선택 후 개별 해제 | selectAll = false |
| 개별 선택으로 전체 도달 | selectAll = true |
| 체크박스 클릭 | 행 클릭 이벤트 전파 차단 (stopPropagation) |

### 3.5 페이지네이션

#### 3.5.1 좌측 — 페이지 크기

| 요소 | 스펙 |
|---|---|
| 라벨 | "페이지당 표시:" |
| select 옵션 | 10, 20, 50 |
| 기본값 | 10 |
| 변경 시 | currentPage = 1로 리셋 |

#### 3.5.2 우측 — 페이지 정보 및 네비게이션

| 요소 | 스펙 |
|---|---|
| 페이지 정보 | `{startIndex+1}-{endIndex} / {total}개` |
| 첫 페이지 | `<<` (ChevronLeft x2), disabled: currentPage === 1 |
| 이전 페이지 | `<` (ChevronLeft), disabled: currentPage === 1 |
| 페이지 번호 | 최대 5개 표시, 현재 페이지 중심 |
| 다음 페이지 | `>` (ChevronRight), disabled: currentPage === totalPages |
| 마지막 페이지 | `>>` (ChevronRight x2), disabled: currentPage === totalPages |
| disabled 스타일 | opacity: 0.5, cursor: not-allowed |
| 현재 페이지 버튼 | btn-primary, font-weight: 600 |

---

## 4. 상호작용 정의

### 4.1 이동 다이얼로그

| 요소 | 스펙 |
|---|---|
| 트리거 | 액션바 "이동" 버튼 또는 컨텍스트 메뉴 "이동" |
| 타이틀 | "데이터셋 이동" |
| 설명 | "선택한 {N}개 데이터셋을 다른 Slot으로 이동합니다." |
| Slot 선택 | select 드롭다운, 라벨: "이동할 Slot 선택 (광고주: {advertiser})" |
| 선택지 제한 | 동일 광고주 ID의 Slot만 표시 |
| 취소 버튼 | 다이얼로그 닫기 |
| 이동 버튼 | 이동 실행 → 다이얼로그 닫기 → 선택 초기화 |

### 4.2 이동 예외 처리 (External Slot 종합 지표 차단)

> 본 정책은 사용자 권한(Role)에 영향을 받지 않으며, 오직 '슬롯의 가시성 설정'에 따라서만 제어됨

여러 개의 데이터셋을 다른 슬롯으로 일괄 이동 시, 대상 슬롯이 External인 경우에 대한 차단 로직입니다.

| 항목 | 내용 |
|---|---|
| 트리거 시점 | 이동할 Slot 선택 모달에서 [이동] 버튼을 클릭하는 시점 |
| 차단 조건 | 선택한 데이터셋 중 단 1개라도 **종합 지표** 데이터셋이 포함되어 있고, 대상 Slot이 External인 경우 |
| UI 대응 | 이동 불가 안내 다이얼로그 노출 후 이동 차단 |

#### 이동 불가 다이얼로그

| 요소 | 스펙 |
|---|---|
| 타이틀 | "이동 불가" |
| 설명 | "종합 지표 데이터셋은 External Slot으로 이동할 수 없습니다. 해당 데이터셋을 선택에서 제외하거나, Private 또는 Internal Slot을 선택해 주세요." |
| 확인 버튼 | 다이얼로그 닫기 (이동 미실행) |

---

### 4.3 삭제 확인 다이얼로그

| 요소 | 스펙 |
|---|---|
| 트리거 | 액션바 "삭제" 버튼 또는 컨텍스트 메뉴 "삭제" |
| 타이틀 | "데이터셋을 삭제하시겠습니까?" |
| 설명 | "선택한 {N}개 데이터셋을 삭제하면 복원할 수 없습니다. 정말로 삭제하시겠습니까?" |
| 취소 버튼 | 다이얼로그 닫기 |
| 삭제 버튼 | destructive 스타일, 삭제 실행 → 다이얼로그 닫기 → 선택 초기화 |

### 4.3 상태 전환 시나리오

| 시나리오 | 기대 동작 |
|---|---|
| 데이터셋 생성 직후 | 목록에 "Pending" 상태로 즉시 등록 |
| 추출 시작 | "Processing"으로 상태 변경 |
| 추출 완료 | "Completed"로 변경, 행 클릭 가능 |
| 추출 실패 | "Error"로 변경, 행 클릭 불가 |
| 1년 경과 | "Expired"로 변경, 행 클릭 불가 |

---

## 5. 데이터 구조

### 5.1 Dataset 인터페이스

```typescript
interface Dataset {
  id: number
  name: string
  media: string
  industry: string
  industryLevel?: 'major' | 'mid' | 'minor' | null
  industryCount?: number
  startDate: string
  endDate: string
  periodType: 'month' | 'quarter'
  status: 'Completed' | 'Processing' | 'Pending' | 'Error' | 'Expired'
  created: string
  creator: string
  creatorId: string
}
```

### 5.2 정렬/필터/페이지네이션 상태

```typescript
sortField: 'id' | 'name' | 'media' | 'industry' | 'startDate' | 'status' | 'created' | 'creator'
sortOrder: 'asc' | 'desc'
currentPage: number (기본 1)
itemsPerPage: 10 | 20 | 50 (기본 10)
searchQuery: string
statusFilter: string[]
mediaFilter: string[]
```

---

## 6. 에러 처리 및 엣지 케이스

### 6.1 빈 상태 (Empty State)

| 조건 | 표시 |
|---|---|
| 데이터셋 0건 (필터 미적용) | 빈 목록 안내 메시지 필요 |
| 검색/필터 결과 0건 | "검색 결과가 없습니다" 안내 |

### 6.2 Quota 제한

| 조건 | 동작 |
|---|---|
| 유효 데이터셋 100개 도달 | "New Dataset" 버튼 비활성화 + 안내 메시지 |
| Expired 데이터셋 | Quota 산정 제외 |

### 6.3 권한별 UI 차이

| 역할 | New Dataset 버튼 | 컨텍스트 메뉴 | 일괄 이동/삭제 |
|---|---|---|---|
| Admin | 표시 | 복제/이동/삭제 | 표시 |
| Marketer | 표시 | 복제/이동/삭제 | 표시 |
| Client | 미표시 | 미표시 | 미표시 |
| Agency | 미표시 | 미표시 | 미표시 |

### 6.4 동시성 이슈

| 시나리오 | 기대 동작 |
|---|---|
| 다른 사용자가 삭제한 데이터셋 클릭 | 에러 처리 (404 또는 안내 메시지) |
| 목록 로딩 중 네트워크 오류 | 에러 상태 표시 + 재시도 안내 |

---

## 7. 접근성 고려사항

| 항목 | 기준 |
|---|---|
| 테이블 구조 | `<table>`, `<thead>`, `<tbody>` 시맨틱 태그 사용 |
| 정렬 버튼 | aria-sort 속성 필요 |
| 체크박스 | aria-label 또는 연관 label 필요 |
| 모달 다이얼로그 | focus trap, ESC 키 닫기, aria-modal |
| 페이지네이션 | aria-label="페이지 네비게이션", 현재 페이지 aria-current="page" |
| 키보드 네비게이션 | Tab으로 모든 인터랙티브 요소 접근 가능 |
| 상태 뱃지 | 색상만으로 구분하지 않고 텍스트 라벨 포함 |

---

## 8. 비즈니스 규칙 검증 포인트 (TC 작성 기준)

| # | 검증 항목 | 기대 결과 |
|---|---|---|
| 1 | Client/Agency 역할로 접근 시 생성 버튼 미노출 | New Dataset 버튼 렌더링 안 됨 |
| 2 | Completed 상태 행만 클릭 가능 | 다른 상태 행 클릭 시 네비게이션 없음 |
| 3 | 검색어 입력 시 데이터셋명 + 생성자 필드 대상 필터링 | 매칭되지 않는 행 숨김 |
| 4 | 상태 필터 + 매체 필터 동시 적용 | AND 조건으로 교차 필터링 |
| 5 | 정렬 컬럼 변경 시 asc 시작 | 동일 컬럼 재클릭 시 desc 전환 |
| 6 | 페이지 크기 변경 시 1페이지로 리셋 | currentPage = 1 |
| 7 | 전체 선택 후 개별 해제 시 selectAll 해제 | 헤더 체크박스 unchecked |
| 8 | 이동 다이얼로그에서 동일 광고주 Slot만 표시 | 다른 광고주 Slot 미노출 |
| 9 | 삭제 후 복구 불가 | 삭제 확인 다이얼로그에 경고 문구 포함 |
| 10 | Expired 상태 데이터셋 Quota 미산정 | 유효 데이터셋 수에서 제외 |
| 11 | 데이터셋명 자동 생성 규칙 | `[매체명]_[생성일자(YYMMDD)]_[순번]` 형식 준수 |
| 12 | 생성자 이메일 마스킹 처리 | maskEmail 유틸 적용 확인 |
| 13 | 필터 초기화 버튼 클릭 | 모든 필터 해제, 전체 목록 표시 |
| 14 | 컨텍스트 메뉴 외부 클릭 시 닫힘 | 메뉴 사라짐 |
| 15 | 체크박스 클릭 시 행 네비게이션 미발생 | stopPropagation 동작 확인 |
| 16 | 만료 데이터셋 복사 시 | 조건 상속 → 생성 화면 진입 가능 |
| 17 | Slot당 동시 추출 제한 초과 시 | "대기중" 상태로 자동 등록 |
| 18 | 비동기 추출 중 화면 이탈 후 복귀 | 상태 정상 반영 (Polling 또는 WebSocket) |
| 19 | External Slot으로 종합 지표 데이터셋 이동 시도 | 이동 불가 다이얼로그 노출 + 이동 차단 |
| 20 | Private/Internal Slot으로 이동 시 | 종합/성과 지표 데이터셋 모두 정상 이동 |
| 21 | 개별 이동 (컨텍스트 메뉴) + External 대상 + 종합 지표 | 동일하게 차단 |
