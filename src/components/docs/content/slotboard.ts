import type { DocSection } from '../docsData'

export const slotboardSection: DocSection = {
  id: 'slot',
  title: 'Slot',
  pages: [
    {
      id: 'slotboard-overview',
      title: 'Slot 개요',
      slug: 'slotboard-overview',
      updatedAt: '2026-05-29',
      content: `# Slot

## Slot이란?

Slot은 특정 목적을 위한 독립된 작업 공간입니다. 캠페인 단위, 브랜드 분석, 시즌 프로모션, 경쟁사 리서치 등 자유롭게 목적을 정의할 수 있습니다.

각 Slot에는 하나의 광고주가 매핑되며, 생성 이후에는 광고주를 변경할 수 없습니다. Slot 내에서 여러 솔루션(DataShot, Reach Caster 등)의 결과물을 연결하여 관리합니다.

## 주요 기능

- Slot 생성 및 삭제
- 광고주별 Slot 분류 및 검색
- 솔루션별 결과물 트리 구조 탐색 (SNB)
- 공개 범위 설정 (Private / Internal / Shared)
- Slot Feed를 통한 활동 이력 확인
- Final Set을 통한 최종 미디어 전략을 확정

## 워크플로우

1. SlotBoard에서 "+ New Slot" 클릭
2. Slot 이름, 광고주, 공개 범위 설정
3. 원하는 솔루션에서 결과물 생성 (DataShot, Reach Caster 등)
4. Final Set으로 최종 전략 확정

## 접근 권한

| 역할 | Slot 조회 | Slot 생성 | 설정 변경 | 삭제 |
|---|---|---|---|---|
| Marketer | O | O | O | O |
| Client | O (Shared만) | X | X | X |
| Agency | O (Shared만) | X | X | X |

## 관련 페이지

- Slot 생성 — 새 작업 공간을 만드는 방법
- Slot 관리 — 설정 변경, 삭제, 공개 범위 조정
- Slot Home — Slot 진입 후 홈 화면 구성`
    },
    {
      id: 'slotboard-create',
      title: 'Slot 생성',
      slug: 'slotboard-create',
      updatedAt: '2026-05-29',
      content: `# Slot 생성

SlotBoard 메인 화면에서 "+ New Slot" 버튼을 클릭하면 Slot 생성 다이얼로그가 열립니다. 필수 정보를 입력하고 공개 범위를 설정하면 새로운 작업 공간이 만들어집니다.

---

## 입력 항목

| 항목 | 필수 | 설명 | 제한 |
|---|---|---|---|
| Slot 이름 | O | 작업 공간의 이름 (목적·프로젝트명 권장) | 최대 30자 |
| 광고주 | O | 매핑할 광고주 선택 | 권한 보유 광고주만 표시 |
| 설명 | X | 목적, 기간, 담당자 등 부가 설명 | 최대 200자 |
| 공개 범위 | O | Private / Internal / Shared 중 선택 | 단일 선택 |

---

## 공개 범위

| 범위 | 접근 대상 | 용도 |
|---|---|---|
| Private | 생성자 본인만 | 초안 작업, 개인 실험 |
| Internal | 해당 광고주 권한을 가진 Marketer | 내부 전략 논의, 팀 협업 |
| Shared | 외부 파트너 (Client / Agency) 포함 | 클라이언트·에이전시 공유 |

Shared 선택 시 공유 대상을 추가로 지정합니다: Client, Agency, 또는 둘 다.

---

## 생성 절차

1. SlotBoard에서 "+ New Slot" 클릭
2. Slot 이름 입력
3. 광고주 선택
4. 공개 범위 설정
5. "생성" 클릭 → Slot Home으로 이동

---

## 주의사항

- **광고주는 생성 이후 변경할 수 없습니다.** 신중하게 선택하세요.
- Marketer 역할만 Slot을 생성할 수 있습니다.
- Slot 이름은 나중에 수정할 수 있습니다.`
    },
    {
      id: 'slotboard-manage',
      title: 'Slot 관리',
      slug: 'slotboard-manage',
      updatedAt: '2026-05-29',
      content: `# Slot 관리

생성된 Slot의 설정을 변경하거나 삭제합니다. SlotBoard 목록 또는 Slot Home의 더보기(⋮) 메뉴에서 접근할 수 있습니다.

---

## SlotBoard 목록

SlotBoard에서 접근 권한이 있는 모든 Slot을 카드 형태로 확인합니다.

### 카드에 표시되는 정보

| 항목 | 설명 |
|---|---|
| Slot 이름 | 작업 공간 이름 |
| 광고주 | 매핑된 광고주 |
| 공개 범위 | Private / Internal / Shared 뱃지 |
| 결과물 수 | Slot 내 생성된 결과물 총 개수 |
| 최종 수정일 | 마지막으로 변경된 날짜 |

### 뷰 전환

- **그리드 뷰** — 카드 형태로 나열
- **리스트 뷰** — 테이블 형태로 나열

### 검색 및 필터

- Slot 이름, 광고주명으로 검색
- 공개 범위별 필터링

---

## 설정 변경

Slot Home 헤더의 더보기(⋮) 메뉴에서 "수정"을 선택합니다.

### 변경 가능 항목

| 항목 | 설명 |
|---|---|
| Slot 이름 | 언제든 수정 가능 |
| 설명 | 언제든 수정 가능 |
| 공개 범위 | 변경 즉시 반영 (아래 참고) |

### 변경 불가 항목

| 항목 | 사유 |
|---|---|
| 광고주 | 생성 시 확정, 이후 변경 불가 |

### 공개 범위 변경 시 영향

| 변경 방향 | 영향 |
|---|---|
| Private → Internal / Shared | 접근 가능 유저 확대 |
| Shared → Internal / Private | 기존 외부 유저 접근 즉시 차단 |
| Internal → Private | 같은 광고주 Marketer 접근 차단 |

---

## Slot 삭제

더보기(⋮) 메뉴에서 "삭제"를 선택합니다. SlotBoard 목록과 Slot Home 모두에서 삭제할 수 있습니다.

### 삭제 시 함께 제거되는 항목

| 항목 | 설명 |
|---|---|
| 시나리오 | Slot 내 모든 Reach Caster 시나리오 |
| 데이터셋 | Slot 내 모든 DataShot 데이터셋 |
| SpinX 세션 | 해당 Slot에서 생성된 AI 대화 이력 |
| Final Set | 확정된 최종 전략 산출물 |

---

## 주의사항

- 삭제 전 확인 다이얼로그가 표시됩니다.
- **삭제된 Slot은 복구할 수 없습니다.**
- Marketer 역할만 설정 변경 및 삭제가 가능합니다.`
    },
    {
      id: 'slotboard-slot-home',
      title: 'Slot Home',
      slug: 'slotboard-slot-home',
      updatedAt: '2026-05-29',
      content: `# Slot Home

개별 Slot에 진입하면 표시되는 홈 화면입니다. 각 솔루션의 최종 결과물을 한눈에 확인하고, Final Set을 구성하며, 활동 이력과 참고 자료를 관리합니다.

---

## 진입 경로

| 경로 | 설명 |
|---|---|
| SlotBoard 카드 클릭 | 목록에서 원하는 Slot 선택 |
| SNB 슬롯명 클릭 | 좌측 네비게이션에서 슬롯명 선택 |
| 브레드크럼 슬롯명 클릭 | 상단 경로에서 슬롯명 선택 |

---

## 화면 구성

Slot Home은 크게 3개 영역으로 구성됩니다.

| 영역 | 위치 | 설명 |
|---|---|---|
| Ready to Final Set | 상단 전체 | 4개 솔루션의 최종 결과물을 플로우 형태로 전시 |
| Activity Log | 하단 좌측 (2/3) | Slot 내 최근 활동 이력 타임라인 |
| Resources | 하단 우측 (1/3) | 참고 문서 파일 관리 |

---

## Ready to Final Set

4개 솔루션(DataShot → Ad Curator → Budget Optimizer → Reach Caster)의 결과물을 컬럼 형태로 나란히 보여줍니다. 각 솔루션에서 선택한 최종 결과물이 여기에 표시됩니다.

### 솔루션 컬럼

| 솔루션 | 상태 | 설명 |
|---|---|---|
| DataShot | 사용 가능 | 업종별 벤치마크 기반 광고 효율 분석 |
| Ad Curator | 준비 중 | 캠페인 성과 기반 맞춤형 상품 큐레이션 |
| Budget Optimizer | 준비 중 | KPI 목표 기반 미디어믹스 예산 최적화 |
| Reach Caster | 사용 가능 | 크로스미디어 통합 도달 예측 시뮬레이션 |

### 결과물 표시

각 컬럼에는 해당 솔루션에서 선택된 결과물이 표시됩니다.

- 결과물명과 핵심 정보가 함께 표시됩니다.
- 결과물을 클릭하면 해당 결과 상세 화면으로 이동합니다.
- 결과물이 없으면 "No Outputs Yet" 안내가 표시됩니다.

### Final Set 관리

솔루션별로 최대 10개의 결과물을 선택하여 Final Set에 등록할 수 있습니다.

- 섹션 우측의 설정 아이콘을 클릭하면 관리 다이얼로그가 열립니다.
- 솔루션 탭별로 결과물을 검색하고 선택합니다.
- Marketer 역할만 Final Set을 관리할 수 있습니다.

---

## Activity Log

Slot 내에서 발생한 최근 활동을 타임라인으로 보여줍니다.

### 기록되는 이벤트

| 솔루션 | 이벤트 |
|---|---|
| DataShot | 데이터셋 생성 |
| Reach Caster | 시나리오 생성 |
| Resources | 파일 업로드 |

### 표시 형식

각 항목은 솔루션별 컬러 도트와 함께 한 줄로 표시됩니다:

- 솔루션명 › 작업 종류 › 결과물명
- 우측에 작업자와 시간 표시
- 최근 10개까지 표시됩니다.

---

## Resources

Slot에 참고 문서를 첨부하여 관리합니다. 캠페인 브리프, 미디어 플랜, 보고서 등을 업로드할 수 있습니다.

### 지원 파일 형식

| 형식 | 확장자 |
|---|---|
| PDF | .pdf |
| Excel | .xlsx |
| PowerPoint | .pptx |
| Word | .docx |

### 파일 관리

- 파일 목록에서 이름, 크기를 확인하고 다운로드할 수 있습니다.
- 설정 아이콘을 클릭하면 파일 추가/삭제 다이얼로그가 열립니다.
- Marketer 역할만 파일을 추가하거나 삭제할 수 있습니다.

---

## Header 액션

Slot Home 상단 헤더에서 다음 기능을 사용할 수 있습니다.

| 버튼 | 동작 |
|---|---|
| 공유 | Slot 링크를 클립보드에 복사 |
| 정보 | Slot ID, 생성일시, 최근 수정일시 툴팁 표시 |
| 더보기(⋮) | Slot 수정, 삭제 메뉴 |

---

## 접근 권한

| 기능 | Marketer | Client / Agency |
|---|---|---|
| 결과물 조회 및 클릭 | O | O (Shared Slot만) |
| Final Set 관리 | O | X |
| Resources 관리 | O | X |
| 공유 (Copy Link) | O | O |
| Slot 수정 / 삭제 | O | X |`
    }
  ]
}
