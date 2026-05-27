export interface DocPage {
  id: string
  title: string
  slug: string
  content: string
  updatedAt?: string
  disabled?: boolean
  disabledLabel?: string
}

export interface DocSection {
  id: string
  title: string
  pages: DocPage[]
  disabled?: boolean
  disabledLabel?: string
}

export const docsStructure: DocSection[] = [
  {
    id: 'getting-started',
    title: '시작하기',
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
  },
  {
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
        id: 'slotboard-manage',
        title: 'Slot 관리',
        slug: 'slotboard-manage',
        content: `# Slot 관리

## Slot 생성

1. SlotBoard 메인 화면에서 "+ 새 Slot" 버튼 클릭
2. 캠페인명, 광고주, 설명 입력
3. 생성 완료 후 Slot Home으로 이동

## Slot 설정

- 이름 변경
- 팀원 추가/제거
- 솔루션 활성화/비활성화`
      }
    ]
  },
  {
    id: 'datashot',
    title: 'DataShot',
    pages: [
      {
        id: 'datashot-overview',
        title: '개요',
        slug: 'datashot-overview',
        content: `# DataShot 개요

DataShot은 광고 플랫폼의 데이터를 수집하고 분석용 데이터셋을 생성하는 솔루션입니다.

## 지원 플랫폼

- Meta (Facebook/Instagram)
- Google Ads
- Naver GFA
- Kakao Moment

## 워크플로우

1. 데이터셋 생성 (플랫폼, 기간, 지표 선택)
2. 데이터 수집 및 처리
3. 결과 확인 및 분석`
      },
      {
        id: 'datashot-create',
        title: '데이터셋 생성',
        slug: 'datashot-create',
        content: `# 데이터셋 생성

## Step 1: 플랫폼 선택

분석할 광고 플랫폼을 선택합니다.

## Step 2: 기간 및 지표 설정

- 데이터 수집 기간 설정
- 분석할 지표(KPI) 선택
- 캠페인 목적 필터링

## Step 3: 확인 및 생성

설정 내용을 확인하고 데이터셋 생성을 시작합니다.`
      }
    ]
  },
  {
    id: 'ad-curator',
    title: 'Ad Curator',
    disabled: true,
    disabledLabel: '준비중',
    pages: [
      {
        id: 'ad-curator-overview',
        title: '개요',
        slug: 'ad-curator-overview',
        disabled: true,
        disabledLabel: '준비중',
        content: `# Ad Curator\n\n준비중인 솔루션입니다.`
      }
    ]
  },
  {
    id: 'budget-optimizer',
    title: 'Budget Optimizer',
    disabled: true,
    disabledLabel: '준비중',
    pages: [
      {
        id: 'budget-optimizer-overview',
        title: '개요',
        slug: 'budget-optimizer-overview',
        disabled: true,
        disabledLabel: '준비중',
        content: `# Budget Optimizer\n\n준비중인 솔루션입니다.`
      }
    ]
  },
  {
    id: 'reach-caster',
    title: 'Reach Caster',
    pages: [
      {
        id: 'reach-caster-overview',
        title: '개요',
        slug: 'reach-caster-overview',
        content: `# Reach Caster 개요

Reach Caster는 광고 캠페인의 도달률을 예측하고 최적의 매체 배분을 찾아주는 솔루션입니다.

## 주요 기능

- **Ratio Finder** — 매체별 최적 예산 배분 비율 탐색
- **Reach Predictor** — 예산 기반 도달률 예측
- **시나리오 비교** — 여러 시나리오 결과를 나란히 비교

## 워크플로우

1. 시나리오 생성 (매체, 예산, 기간 설정)
2. 분석 모드 선택 (Ratio Finder / Reach Predictor)
3. 결과 확인 및 시나리오 비교`
      },
      {
        id: 'reach-caster-scenario',
        title: '시나리오 생성',
        slug: 'reach-caster-scenario',
        content: `# 시나리오 생성

## Step 1: 기본 정보

- 시나리오 이름 설정
- 분석 기간 선택
- 총 예산 입력

## Step 2: 매체 및 분석 설정

- 매체 선택 (Meta, Google, Naver 등)
- 분석 모드 선택
  - Ratio Finder: 최적 비율 탐색
  - Reach Predictor: 도달률 예측

## Step 3: 결과 확인

분석 완료 후 결과 화면에서 인사이트를 확인합니다.`
      },
      {
        id: 'reach-caster-comparison',
        title: '시나리오 비교',
        slug: 'reach-caster-comparison',
        content: `# 시나리오 비교

## 비교 방법

1. Slot Home에서 비교할 시나리오를 선택합니다.
2. "비교하기" 버튼을 클릭합니다.
3. 나란히 비교 결과를 확인합니다.

## 비교 항목

- 매체별 예산 배분 비율
- 예상 도달률 (Reach)
- CPM / CPC 예측값
- 효율성 점수`
      }
    ]
  },
  {
    id: 'spinx',
    title: 'SpinX',
    pages: [
      {
        id: 'spinx-overview',
        title: '개요',
        slug: 'spinx-overview',
        content: `# SpinX 개요

SpinX는 AI 기반 인사이트 어시스턴트로, 분석 결과를 자연어로 해석하고 추가 질문에 답변합니다.

## 주요 기능

- 시나리오 결과 자연어 해석
- 데이터 기반 추천 제공
- 후속 질문 대화형 응답

## 사용 방법

1. Reach Caster 결과 화면에서 SpinX 패널을 엽니다.
2. 결과에 대한 질문을 입력합니다.
3. AI가 데이터를 기반으로 인사이트를 제공합니다.`
      }
    ]
  },
  {
    id: 'resources',
    title: 'Resources',
    pages: [
      {
        id: 'resources-faq',
        title: 'FAQ',
        slug: 'resources-faq',
        content: `# FAQ

## 자주 묻는 질문

### 데이터는 얼마나 자주 업데이트되나요?

광고 플랫폼 API를 통해 일 단위로 데이터가 갱신됩니다.

### 시나리오 생성에 얼마나 걸리나요?

데이터 규모에 따라 다르지만, 일반적으로 3~10분 내에 완료됩니다.

### 여러 광고주를 동시에 관리할 수 있나요?

네, SlotBoard에서 광고주별로 독립된 Slot을 생성하여 관리할 수 있습니다.`
      },
      {
        id: 'resources-glossary',
        title: '용어 사전',
        slug: 'resources-glossary',
        content: `# 용어 사전

## 플랫폼 용어

- **Slot** — 캠페인 단위의 작업 공간
- **DataShot** — 데이터 수집 및 분석 솔루션
- **Reach Caster** — 도달률 예측 솔루션
- **SpinX** — AI 인사이트 어시스턴트

## 광고 용어

- **Reach** — 광고에 노출된 고유 사용자 수
- **CPM** — 1,000회 노출당 비용
- **CPC** — 클릭당 비용
- **CTR** — 클릭률 (클릭 수 / 노출 수)`
      },
      {
        id: 'resources-download',
        title: '소개서 다운로드',
        slug: 'resources-download',
        content: `# 소개서 다운로드

ReadySet 플랫폼 소개서를 다운로드할 수 있습니다.

## 제공 자료

- ReadySet 플랫폼 소개서 (PDF)
- 솔루션별 기능 요약서
- 온보딩 가이드`
      }
    ]
  },
  {
    id: 'release-notes',
    title: 'Release Notes',
    pages: [
      {
        id: 'release-notes-latest',
        title: '최신 업데이트',
        slug: 'release-notes-latest',
        content: `# Release Notes

## v1.0.0 (2026.05)

- ReadySet 플랫폼 정식 출시
- SlotBoard, DataShot, Reach Caster 솔루션 제공
- SpinX AI 어시스턴트 베타 출시`
      }
    ]
  }
]
