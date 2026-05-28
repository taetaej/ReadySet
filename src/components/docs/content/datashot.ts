import type { DocSection } from '../docsData'

export const datashotSection: DocSection = {
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
    },
    {
      id: 'datashot-manage',
      title: '데이터셋 관리',
      slug: 'datashot-manage',
      content: `# 데이터셋 관리

## 데이터셋 목록

생성된 데이터셋을 목록으로 확인하고 관리합니다.

## 상태 확인

- Completed: 생성 완료
- Processing: 생성 중
- Pending: 대기 중

## 데이터셋 삭제

불필요한 데이터셋을 삭제할 수 있습니다.`
    },
    {
      id: 'datashot-result',
      title: '데이터셋 결과',
      slug: 'datashot-result',
      content: `# 데이터셋 결과

## 결과 화면 구성

- 데이터 요약 카드
- 차트 시각화
- 상세 데이터 테이블

## 데이터 활용

생성된 데이터셋은 Reach Caster의 예측 모델 학습에 활용됩니다.`
    }
  ]
}
