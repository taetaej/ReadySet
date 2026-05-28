import type { DocSection } from '../docsData'

export const reachCasterSection: DocSection = {
  id: 'reach-caster',
  title: 'Reach Caster',
  pages: [
    {
      id: 'reach-caster-overview',
      title: '개요',
      slug: 'reach-caster-overview',
      updatedAt: '2026-05-27',
      content: `# Reach Caster 개요

Reach Caster는 광고 캠페인의 도달률을 예측하고 최적의 매체 배분을 찾아주는 솔루션입니다.

## 주요 기능

- **Ratio Finder** — 매체별 최적 예산 배분 비율 탐색
- **Reach Predictor** — 예산 기반 도달률 예측
- **시나리오 비교** — 여러 시나리오 결과를 나란히 비교
- **SpinX** — AI 인사이트 어시스턴트

## 워크플로우

1. 시나리오 생성 (매체, 예산, 기간 설정)
2. 분석 모드 선택 (Ratio Finder / Reach Predictor)
3. 결과 확인 및 시나리오 비교`
    },
    {
      id: 'reach-caster-create',
      title: '시나리오 생성',
      slug: 'reach-caster-create',
      updatedAt: '2026-05-27',
      content: `# 시나리오 생성

## Step 1: 기본 정보

- 시나리오 이름 설정 (최대 30자)
- 분석 모듈 선택 (Ratio Finder / Reach Predictor)
- 브랜드 및 업종 선택
- 캠페인 기간 설정
- 타겟 GRP 설정

## Step 2: 상세 설정

### Ratio Finder

- 총 예산 입력
- 시뮬레이션 단위 선택 (5% / 10% / 20%)
- DIGITAL + TVC 매체 선택
- 매체별 예산 비중 설정
- 상품/채널 선택 및 비중 설정

### Reach Predictor

- 매체·상품 추가 (연동/미연동)
- 매체별 예산 및 노출 수 입력
- 개별 기간/타겟 오버라이드 (선택)
- 리치커브 구간 설정

## Step 3: 검토 및 실행

설정 내용을 확인하고 분석을 시작합니다. 완료 시 알림 센터에서 알려드립니다.`
    },
    {
      id: 'reach-caster-manage',
      title: '시나리오 관리',
      slug: 'reach-caster-manage',
      updatedAt: '2026-05-27',
      content: `# 시나리오 관리

## 시나리오 목록

Slot 내의 모든 시나리오를 리스트 뷰 또는 타임라인 뷰로 확인합니다.

## 주요 기능

- 검색 및 필터링 (모듈, 상태, 업종)
- 정렬 (ID, 이름, 상태, 작성일 등)
- 일괄 작업 (이동, 삭제)
- 타임라인 뷰 (Gantt 차트)

## 시나리오 상태

- **Completed** — 분석 완료, 결과 조회 가능
- **Processing** — 분석 진행 중
- **Pending** — 대기 중
- **Error** — 오류 발생, 재시도 가능`
    },
    {
      id: 'reach-caster-result',
      title: '시나리오 결과',
      slug: 'reach-caster-result',
      updatedAt: '2026-05-27',
      content: `# 시나리오 결과

## Ratio Finder 결과

- TVC/Digital 최적 비중 차트 (Stacked Bar + Line)
- 상세 성과 데이터 테이블
- 막대 클릭 시 해당 조합 상세 표시

## Reach Predictor 결과

- Key Metrics 스코어카드 (도달률, 빈도, GRP, CPM)
- 리치커브 차트 (예측 범위 + Optimal Point)
- 매체별 성과 테이블

## 시나리오 비교

- 타겟 비교 / 기간 비교 / 예산 비교
- 정합성 체크 (Comparison Health Check)
- Performance Comparison 테이블

## SpinX AI 어시스턴트

결과 화면에서 SpinX를 열어 AI 기반 인사이트를 받을 수 있습니다.`
    }
  ]
}
