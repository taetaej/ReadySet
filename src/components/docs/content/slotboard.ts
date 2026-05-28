import type { DocSection } from '../docsData'

export const slotboardSection: DocSection = {
  id: 'slotboard',
  title: 'SlotBoard',
  pages: [
    {
      id: 'slotboard-overview',
      title: '개요',
      slug: 'slotboard-overview',
      updatedAt: '2026-05-28',
      content: `# SlotBoard

SlotBoard는 ReadySet 플랫폼의 메인 대시보드로, 캠페인 단위의 작업 공간(Slot)을 생성하고 관리하는 허브입니다.

## Slot이란?

Slot은 하나의 광고 캠페인 또는 프로젝트를 위한 독립된 작업 공간입니다. 각 Slot에는 여러 솔루션(DataShot, Reach Caster 등)의 결과물이 연결되며, 팀원과 함께 협업할 수 있습니다.

## 주요 기능

- Slot 생성 및 관리
- 광고주별 Slot 분류
- 솔루션별 결과물 트리 구조 탐색 (SNB)
- 공개 범위 설정 (Private / Internal / Shared)
- 팀원 초대 및 권한 관리

## 화면 구성

### 상단 영역

- 환영 메시지 및 사용자 정보
- 업종별 CTR 인사이트 차트
- 솔루션 파워 현황 카드

### 하단 영역

- Slot 카드 목록 (그리드/리스트 뷰 전환)
- 검색 및 필터
- "+ New Slot" 생성 버튼`
    },
    {
      id: 'slotboard-create',
      title: 'Slot 생성',
      slug: 'slotboard-create',
      updatedAt: '2026-05-28',
      content: `# Slot 생성

새로운 캠페인 작업 공간을 생성합니다.

## 생성 방법

1. SlotBoard 메인 화면에서 "+ New Slot" 버튼을 클릭합니다.
2. 필수 정보를 입력합니다.
3. 공개 범위를 설정합니다.
4. "생성" 버튼을 클릭하면 Slot Home으로 이동합니다.

## 입력 항목

### 캠페인명 (필수)

Slot의 이름을 입력합니다. 캠페인 목적이나 브랜드명을 포함하면 관리가 편리합니다.

### 광고주 (필수)

해당 Slot이 속하는 광고주를 선택합니다. 본인에게 권한이 부여된 광고주만 선택 가능합니다.

### 설명 (선택)

캠페인에 대한 간략한 설명을 입력합니다. 타겟, 기간, 목적 등을 기재하면 팀원이 이해하기 쉽습니다.

## 공개 범위 설정

Slot 생성 시 공개 범위를 설정합니다. 기본값은 Internal입니다.

### Private (개인용)

- 생성자 본인만 접근 가능
- 초안 작업, 개인 실험 용도

### Internal (내부용)

- 해당 광고주 권한을 가진 마케터만 접근 가능
- 내부 전략 논의, 마케터 간 협업 용도

### Shared (공유)

- 외부 파트너(클라이언트/에이전시)와 공유
- 공유 대상 선택: 클라이언트, 에이전시, 또는 둘 다

## 생성 후

Slot이 생성되면 Slot Home 화면으로 이동합니다. 여기서 솔루션을 활성화하고 분석을 시작할 수 있습니다.`
    },
    {
      id: 'slotboard-manage',
      title: 'Slot 관리',
      slug: 'slotboard-manage',
      updatedAt: '2026-05-28',
      content: `# Slot 관리

생성된 Slot을 확인하고 설정을 변경합니다.

## Slot 목록

SlotBoard에서 본인에게 접근 권한이 있는 모든 Slot을 카드 형태로 확인합니다.

### 카드 정보

- 캠페인명
- 광고주
- 공개 범위 뱃지 (Private / Internal / Shared)
- 결과물 수
- 최종 수정일

### 뷰 전환

- 그리드 뷰: 카드 형태로 나열
- 리스트 뷰: 테이블 형태로 나열

### 검색 및 필터

- 캠페인명, 광고주명으로 검색
- 공개 범위별 필터링

## Slot 설정 변경

Slot Home에서 설정을 변경할 수 있습니다.

### 이름 변경

Slot Home 헤더의 편집(수정) 버튼을 클릭하여 캠페인명과 설명을 수정합니다.

### 공개 범위 변경

- Private → Internal/Shared: 접근 가능 유저 확대
- Shared → Internal/Private: 기존 외부 유저 접근 즉시 차단
- 변경 시 영향받는 유저에게 즉시 반영됩니다.

### 팀원 관리

Shared 모드에서 공유 대상(클라이언트/에이전시)을 추가하거나 제거합니다.

## Slot 삭제

Slot Home 헤더의 더보기(⋮) 메뉴에서 "삭제"를 선택합니다.

- 삭제 전 확인 다이얼로그가 표시됩니다.
- Slot 내의 모든 시나리오, 데이터셋, SpinX 세션이 함께 삭제됩니다.
- 삭제된 Slot은 복구할 수 없습니다.

## Slot Home

각 Slot에 진입하면 Slot Home 화면이 표시됩니다.

### Ready to Final Set

솔루션별 주요 결과물을 4단계 플로우로 요약합니다:
- Step 1: DataShot
- Step 2: Reach Caster
- Step 3: Ad Curator (준비중)
- Step 4: Budget Optimizer (준비중)

### Slot Feed

Slot 내 최근 활동 이력을 타임라인으로 확인합니다.

### Documents

Slot에 첨부된 문서를 관리합니다.`
    }
  ]
}
