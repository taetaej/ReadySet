import type { DocSection } from '../docsData'

export const getStartedSection: DocSection = {
  id: 'get-started',
  title: 'Get Started',
  pages: [
    {
      id: 'intro',
      title: '플랫폼 소개',
      slug: 'intro',
      updatedAt: '2026-05-27',
      content: `# 플랫폼 소개

ReadySet은 광고 캠페인의 예측 분석을 위한 통합 플랫폼입니다.

## 주요 기능

- **SlotBoard** — 캠페인 단위의 작업 공간 관리
- **DataShot** — 광고 데이터셋 생성 및 분석
- **Reach Caster** — 도달률 예측 및 시나리오 비교
- **SpinX** — AI 기반 인사이트 어시스턴트

## 시작하기

1. 로그인 후 SlotBoard에서 새 Slot을 생성합니다.
2. Slot 내에서 필요한 솔루션(DataShot, Reach Caster 등)을 활성화합니다.
3. 각 솔루션의 가이드를 참고하여 분석을 진행합니다.`
    },
    {
      id: 'quick-start',
      title: '빠른 시작 가이드',
      slug: 'quick-start',
      updatedAt: '2026-05-27',
      content: `# 빠른 시작 가이드

## 1단계: Slot 생성

SlotBoard에서 "+ 새 Slot 만들기" 버튼을 클릭하여 캠페인 작업 공간을 생성합니다.

## 2단계: 솔루션 선택

생성된 Slot에서 사용할 솔루션을 선택합니다:
- DataShot: 데이터 수집 및 분석
- Reach Caster: 도달률 예측

## 3단계: 분석 실행

각 솔루션의 워크플로우를 따라 분석을 진행합니다.`
    }
  ]
}
