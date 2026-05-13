# SlotHome 화면 상세 기획 정의서

## 1. 개요

SlotHome은 개별 슬롯(캠페인)의 홈 화면으로, 4개 솔루션의 최종 선택된 결과물을 인보이스/견적서 형태로 큐레이션하여 전시하는 페이지이다.

- **URL**: `/slot/:slotId`
- **진입 경로**: SlotBoard 슬롯 카드 클릭, SNB 슬롯명 클릭, 브레드크럼 슬롯명 클릭
- **디자인 컨셉**: Linear/Vercel 스타일 미니멀리즘. 고밀도, 기술적 미학.

---

## 2. 페이지 구조

```
┌─────────────────────────────────────────────────────────┐
│ Header (캠페인명 + 설명 + 액션 버튼)                      │
├─────────────────────────────────────────────────────────┤
│ Ready to Final Set (4컬럼 솔루션 플로우)                  │
├───────────────────────────────────┬─────────────────────┤
│ Activity Log (2/3)                │ Resources (1/3)     │
└───────────────────────────────────┴─────────────────────┘
```

---

## 3. Header 영역

### 3.1 좌측: 캠페인 정보
| 요소 | 스타일 |
|------|--------|
| 캠페인명 | 40px, Bold 700, Paperlogy |
| 설명 | 14px, muted-foreground |

### 3.2 우측: 액션 버튼
| 버튼 | 아이콘 | 동작 | 권한 |
|------|--------|------|------|
| 공유 | `Share2` | 드롭다운 → Copy Link | 전체 |
| 정보 | `Info` | hover 시 툴팁 (Slot ID, 생성일시, 수정일시) | 전체 |
| 관리 | `MoreVertical` | 드롭다운 → 수정, 삭제 | 전체 |

### 3.3 Info 툴팁 내용
- Slot ID: `#1024`
- 생성일시: `2024-01-15 14:30` + 작성자 (이메일 마스킹)
- 최근 수정일시: `2024-01-20 16:45` + 수정자 (이메일 마스킹)

### 3.4 관리 메뉴
- **수정**: `/slotboard/edit`로 이동 (slotData 전달)
- **삭제**: 컨펌 다이얼로그 호출 → 확인 시 슬롯보드로 이동

---

## 4. Ready to Final Set 영역

### 4.1 섹션 라벨
```
READY TO FINAL SET · {n}/4 COMPLETED  ⚙️(관리자만)
```
- 설정 아이콘(`Settings2`): 관리자 권한일 때만 표시
- 클릭 시 결과물 선택 다이얼로그 오픈

### 4.2 4컬럼 솔루션 플로우

| 솔루션 | 상태 | 설명 |
|--------|------|------|
| DataShot | active | 업종별 벤치마크 기반 광고 효율 분석 |
| Ad Curator | coming-soon | 캠페인 성과 기반 맞춤형 상품 큐레이션 |
| Budget Optimizer | coming-soon | KPI 목표 기반 미디어믹스 예산 최적화 |
| Reach Caster | active | 크로스미디어 통합 도달 예측 시뮬레이션 |

### 4.3 각 솔루션 컬럼 구조

```
┌─────────────────────────────┐
│ STEP n                    → │  ← 컬럼 간 화살표
│ SolutionName →              │  ← Split Text 애니메이션 + 화살표 (hover)
│ 설명                         │
│ [Status: Coming Soon 등]    │
│ ─────────────────────────── │  ← Divider
│ [Output Area]               │
│   결과물명                   │
│   부가정보                   │
└─────────────────────────────┘
```

### 4.4 솔루션명 인터랙션
- **hover 시**: Split Text reveal 애니메이션 (글자별 아래→위 등장) + 우측 화살표 fade-in
- **클릭 시**: 해당 솔루션 목록 페이지로 이동
- **hover 영역**: 상단 헤더 영역만 (결과물 영역과 분리)

### 4.5 결과물 표시 형식

**공통 구조 (1행 = 1결과물)**:
```
결과물명                    결과 보기 → (hover 시)
부가정보 (prefix · 핵심 지표)
```

**DataShot 부가정보**:
```
매체명
```

**Reach Caster 부가정보**:
```
RF · 72.3%  👍 Digital 60% : TVC 40%
RP · 68.5%
```
- `RF`/`RP`: 모듈 prefix (텍스트, 뱃지 아님)
- `👍` (`ThumbsUp` 아이콘): Optimal Point 표시 (RF만)

### 4.6 결과물 클릭 동작
| 솔루션 | 이동 경로 |
|--------|-----------|
| DataShot | `/datashot/detail` (datasetId, datasetName, slotData) |
| Reach Caster (RF) | `/reachcaster/scenario/ratio-finder/result` (scenarioData, slotData) |
| Reach Caster (RP) | `/reachcaster/scenario/reach-predictor/result` (scenarioData, slotData) |

### 4.7 빈 상태 표시
| 상태 | 표시 |
|------|------|
| empty | `Inbox` 아이콘 + "No Outputs Yet" |
| coming-soon | `Hourglass` 아이콘 + "Coming Soon" |

---

## 5. Ready to Final Set 관리 다이얼로그

### 5.1 기본 정보
- **사이즈**: `dialog-lg` (900px, 높이 640px 고정)
- **권한**: 관리자(isAdmin)만 접근 가능
- **트리거**: 섹션 라벨 옆 설정 아이콘 클릭

### 5.2 구조
```
┌─────────────────────────────────────┐
│ Ready to Final Set 관리              │
│ 솔루션별 결과물을 최대 10개까지 선택  │
├─────────────────────────────────────┤
│ [DataShot] [Reach Caster]  ← 탭     │
├─────────────────────────────────────┤
│ 🔍 결과물 검색...        n/10 선택   │
├─────────────────────────────────────┤
│ ☐ 결과물 1                           │
│ ☑ 결과물 2                           │
│ ☐ 결과물 3                           │
│ ...                                  │
├─────────────────────────────────────┤
│                      [취소] [적용]    │
└─────────────────────────────────────┘
```

### 5.3 동작 규칙
- 솔루션별 최대 **10개** 선택 가능
- 10개 초과 시 나머지 항목 비활성화 (opacity 0.35)
- 탭별 독립 검색 (제목/모듈/인사이트 기준)
- "적용" 클릭 시 solutionFlow 상태 업데이트
- coming-soon 솔루션은 탭에 표시하지 않음

---

## 6. Activity Log 영역

### 6.1 레이아웃
- 좌측 2/3 영역
- 세로 타임라인 (1px 선 + 솔루션별 컬러 도트 5px)
- 최근 10개 표시 (우측 상단에 "최근 n개" 표기)

### 6.2 솔루션별 도트 컬러
| 솔루션 | 컬러 |
|--------|------|
| DataShot | `#A855F7` (purple) |
| Reach Caster | `#06B6D4` (cyan) |
| Budget Optimizer | `#F43F5E` (pink) |
| Ad Curator | `#10B981` (emerald) |
| Resources | `hsl(var(--muted-foreground))` |

### 6.3 피드 항목 형식 (1행)
```
● 솔루션명 › 작업종류 › 결과물명          작업자 · 시간
```
- `›` 구분자: opacity 0.4
- 결과물명: fontWeight 500, foreground
- 작업자/시간: 10px, textDim

### 6.4 기록되는 이벤트
| 솔루션 | 작업 종류 |
|--------|-----------|
| DataShot | 데이터셋 생성 |
| Reach Caster | 시나리오 생성 |
| Resources | 파일 업로드 |

---

## 7. Resources 영역

### 7.1 레이아웃
- 우측 1/3 영역
- 파일 목록 (아이콘 + 파일명 + 사이즈 + 다운로드 버튼)

### 7.2 파일 아이콘
- 전체 `hsl(var(--muted-foreground))` 단일 색상
- 타입별 아이콘: pdf=`FileText`, xlsx=`FileSpreadsheet`, pptx=`Presentation`, docx=`FileText`

### 7.3 관리 다이얼로그
- **사이즈**: `dialog-sm` (500px)
- **권한**: 관리자만 (설정 아이콘으로 진입)
- **기능**: 파일 추가 (dashed border 업로드 영역) + 기존 파일 삭제

---

## 8. 권한 체계

| 기능 | 일반 사용자 | 관리자 (isAdmin) |
|------|-------------|-----------------|
| 결과물 조회/클릭 | ✅ | ✅ |
| Ready to Final Set 설정 | ❌ | ✅ |
| Resources 관리 | ❌ | ✅ |
| 공유 (Copy Link) | ✅ | ✅ |
| Info 툴팁 | ✅ | ✅ |
| 슬롯 수정/삭제 | ✅ | ✅ |

---

## 9. 네비게이션 연결

### 9.1 브레드크럼 (솔루션 결과 페이지에서)
```
SlotBoard > 슬롯명 > 솔루션명 > 결과물명
              ↑
         /slot/:slotId 로 이동
```

### 9.2 SNB (Side Navigation Bar)
- **슬롯명 클릭**: `/slot/:slotId`로 이동 (SlotHome)
- **화살표(ChevronRight) 클릭**: 아코디언 토글만 (이동 없음)

---

## 10. 컴포넌트 구조

```
src/components/reachcaster/
├── SlotHome.tsx              # 메인 레이아웃 + 다이얼로그
├── SlotHomeSections.tsx      # SlotFeedSection, DocumentsSection
└── slotHomeTypes.ts          # 타입, colors, mock 데이터
```

---

## 11. 디자인 토큰

- **배경**: 라이트 `hsl(var(--card) / 0.2)` / 다크 `hsl(var(--card))`
- **보더**: `hsl(var(--border))` 1px
- **텍스트**: foreground / muted-foreground / muted-foreground 0.6
- **서체**: Paperlogy 전면 적용
- **애니메이션**: Split Text reveal (hover), splitReveal keyframe (0.4s, stagger 30ms)
