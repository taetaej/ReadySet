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
    },
    {
      id: 'user-grade',
      title: '사용자 등급',
      slug: 'user-grade',
      updatedAt: '2026-05-29',
      content: `# 사용자 등급

ReadySet은 플랫폼 활용도에 따라 사용자 등급을 부여합니다. 솔루션을 다양하게 활용하고 결과물을 쌓아갈수록 더 높은 등급으로 승급할 수 있습니다.

## 등급 목록

| 등급 | 보유 결과물 수 | 솔루션 사용 | 설명 |
|---|---|---|---|
| Slot-In Ready | 0~4개 | - | ReadySet의 잠재력을 탐색 중인 예비 전략가 |
| Active Slotter | 5~29개 | 1개 이상 사용 | 데이터의 흐름을 만들기 시작한 실무 전략가 |
| Strategy Builder | 30~79개 | 2개 이상 사용 | 개별 솔루션을 조합해 전략의 기틀을 잡는 숙련가 |
| Solution Expert | 80~149개 | 전체 솔루션 사용 | 플랫폼을 완벽히 활용해 최적의 해답을 도출하는 전문가 |
| Master Architect | 150~299개 | 전체 솔루션 사용 | 복잡한 시나리오를 구조화하여 전략 생태계를 구축한 마스터 |
| ReadySet Visionary | 300개 이상 | 전체 솔루션 사용 | 플랫폼의 한계를 넘어 전략의 새 지평을 여는 독보적 선구자 |

## 승급 조건

다음 등급으로 승급하려면 아래 두 가지 미션을 **모두** 달성해야 합니다.

**미션 1: 보유 결과물 수**

플랫폼에서 생성한 결과물(데이터셋, 시나리오 등)의 누적 수가 다음 등급의 기준에 도달해야 합니다.

**미션 2: 솔루션 사용**

다음 등급에서 요구하는 수만큼 서로 다른 솔루션을 사용해야 합니다. 예를 들어 Strategy Builder로 승급하려면 DataShot, Reach Caster 등 2개 이상의 솔루션에서 결과물을 생성한 이력이 있어야 합니다.

두 조건 중 하나만 달성한 경우에는 승급되지 않습니다. 반드시 두 미션을 모두 완료해야 등급이 올라갑니다.

## 등급 유지 정책

- 한 번 달성한 등급은 강등되지 않습니다.
- Slot 권한 해제 등으로 보유 결과물 수가 줄어들더라도 이미 달성한 등급은 그대로 유지됩니다.

## 현재 등급 확인

상단 네비게이션 바에서 현재 등급을 확인할 수 있습니다. 등급명을 클릭하면 다음 등급까지의 미션 달성 현황을 확인할 수 있습니다.

![현재 등급 확인|50%](/docs/images/get-started/001.png)`
    }
  ]
}
