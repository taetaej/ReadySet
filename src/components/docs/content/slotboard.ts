import type { DocSection } from '../docsData'

export const slotboardSection: DocSection = {
  id: 'slotboard',
  title: 'SlotBoard',
  pages: [
    {
      id: 'slotboard-overview',
      title: '개요',
      slug: 'slotboard-overview',
      content: `# SlotBoard 개요

SlotBoard는 캠페인 단위의 작업 공간(Slot)을 관리하는 대시보드입니다.

## Slot이란?

Slot은 하나의 광고 캠페인 또는 프로젝트를 위한 독립된 작업 공간입니다. 각 Slot에는 여러 솔루션(DataShot, Reach Caster 등)을 연결할 수 있습니다.

## 주요 기능

- Slot 생성 및 관리
- 솔루션별 결과물 트리 구조 탐색
- 팀원 초대 및 권한 관리`
    },
    {
      id: 'slotboard-create',
      title: 'Slot 생성',
      slug: 'slotboard-create',
      content: `# Slot 생성

## 생성 방법

1. SlotBoard 메인 화면에서 "+ 새 Slot" 버튼 클릭
2. 캠페인명, 광고주, 설명 입력
3. 공개 범위 설정 (Private / Internal / Shared)
4. 생성 완료 후 Slot Home으로 이동

## 공개 범위

- **Private** — 나만 접근 가능
- **Internal** — 내부 마케터만 접근 가능
- **Shared** — 외부 파트너와 공유`
    },
    {
      id: 'slotboard-manage',
      title: 'Slot 관리',
      slug: 'slotboard-manage',
      content: `# Slot 관리

## Slot 설정

- 이름 변경
- 공개 범위 변경
- 팀원 추가/제거
- 솔루션 활성화/비활성화

## Slot 삭제

슬롯 삭제 시 관련된 모든 데이터가 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`
    }
  ]
}
