import type { DocSection } from '../docsData'

export const spinxSection: DocSection = {
  id: 'spinx',
  title: 'SpinX',
  pages: [
    {
      id: 'spinx-overview',
      title: '개요',
      slug: 'spinx-overview',
      updatedAt: '2026-05-27',
      content: `# SpinX 개요

SpinX는 AI 기반 인사이트 어시스턴트로, 각 솔루션의 분석 결과를 자연어로 해석하고 추가 질문에 답변합니다.

## 지원 솔루션

- **Reach Caster** — 시나리오 결과 및 비교 결과 분석 (현재 지원)
- DataShot — 준비중
- Ad Curator — 준비중
- Budget Optimizer — 준비중

## 주요 기능

- 시나리오 결과 자연어 해석
- 데이터 기반 추천 제공
- 후속 질문 대화형 응답
- 웹 검색 + 내부 문서 참조 (RAG)
- 차트 시각화 응답
- 멀티 모델 선택 (Claude, GPT, Gemini)

## 사용 방법

1. 결과 화면 우측 하단의 SpinX 버튼을 클릭합니다.
2. 추천 질문을 선택하거나 직접 질문을 입력합니다.
3. AI가 데이터를 기반으로 인사이트를 제공합니다.

## 세션 관리

- 세션 유효 기간: 14일
- 14일 이내 재방문 시 이전 대화 이어가기 가능
- 수동 초기화로 새 세션 시작 가능`
    },
    {
      id: 'spinx-reach-caster',
      title: 'Reach Caster',
      slug: 'spinx-reach-caster',
      updatedAt: '2026-05-27',
      content: `# SpinX for Reach Caster

Reach Caster의 시나리오 결과 및 비교 결과 화면에서 SpinX를 사용할 수 있습니다.

## 호출 위치

- Ratio Finder 결과 화면
- Reach Predictor 결과 화면
- 시나리오 비교 결과 화면

## 컨텍스트 요약

패널을 열면 현재 시나리오의 핵심 데이터를 자동으로 요약합니다:
- 최적 매체 비중
- 예상 도달률
- 주요 인사이트

## 추천 질문 예시

- "이 예측 결과를 어떻게 해석해야 하나요?"
- "Effective Impression이 무엇인가요?"
- "이 데이터를 차트로 시각화해주세요"
- "2026년 5월 주요 뷰티 행사가 있나요?"

## 첨부 기능

- 이미지 첨부 (jpg, png, gif, webp)
- PDF 첨부
- URL 첨부`
    }
  ]
}
