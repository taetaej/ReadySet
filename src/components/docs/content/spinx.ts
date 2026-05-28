import type { DocSection } from '../docsData'

export const spinxSection: DocSection = {
  id: 'spinx',
  title: 'SpinX',
  pages: [
    {
      id: 'spinx-overview',
      title: '개요',
      slug: 'spinx-overview',
      updatedAt: '2026-05-28',
      content: `# SpinX

SpinX는 ReadySet 플랫폼의 AI 인사이트 어시스턴트입니다. AnXer의 Spin-off AI Agent로, 솔루션별로 특화된 컨텍스트를 이해하고 분석 결과를 자연어로 해석합니다. 현재 Reach Caster에 먼저 적용되었으며, 향후 다른 솔루션에도 순차 확장됩니다.

## 지원 솔루션

- **Reach Caster** — 시나리오 결과 및 비교 결과 분석 (현재 지원)
- DataShot — 준비중
- Ad Curator — 준비중
- Budget Optimizer — 준비중

## 주요 기능

- 컨텍스트 인식 자동 요약
- 대화형 인사이트 (추천 질문 + 자유 질문)
- 멀티 모델 선택 (Gemini, Claude, GPT)
- 이미지 / PDF / URL 첨부`
    },
    {
      id: 'spinx-reach-caster',
      title: 'Reach Caster',
      slug: 'spinx-reach-caster',
      updatedAt: '2026-05-28',
      content: `# SpinX for Reach Caster

Reach Caster의 시나리오 결과 및 비교 결과 화면에서 SpinX를 사용할 수 있습니다.

## 호출 방법

결과 화면 우측 하단의 SpinX 버튼(원형, 검정 배경)을 클릭하면 패널이 우측에서 슬라이드되며 열립니다.

## 호출 가능 화면

- Ratio Finder 결과 화면
- Reach Predictor 결과 화면
- 시나리오 비교 결과 화면

## 컨텍스트 요약

패널이 열리면 현재 시나리오의 핵심 데이터를 자동으로 요약합니다.

### Ratio Finder 예시

"최적 매체 비중은 TVC 50%, Digital 50%로 나타났으며, 이 비율로 집행 시 예상 Reach 1+는 73.2%입니다. 총 예산 10억원을 TVC 5억원, Digital 5억원으로 배분하는 것을 권장합니다."

### Reach Predictor 예시

"선택한 8개 매체 믹스의 예상 통합 도달률은 73.2%이며, 평균 빈도 3.8회, 예상 GRP 278.2입니다. Optimal Point는 약 13.5억 지점입니다."

## 추천 질문

요약 아래에 4개의 추천 질문이 제공됩니다. 클릭하면 바로 전송됩니다.

- "이 예측 결과를 어떻게 해석해야 하나요?"
- "Effective Impression이 무엇인가요?"
- "이 데이터를 차트로 시각화해주세요"
- "2026년 5월 주요 뷰티 행사가 있나요?"

## 활용 팁

### 전략 수립

"현재 예산에서 도달률을 5%p 더 올리려면 어떻게 해야 하나요?"처럼 구체적인 목표를 제시하면 더 실용적인 답변을 받을 수 있습니다.

### 경쟁사 비교

"동일 업종 평균 대비 현재 시나리오의 효율은 어떤가요?"처럼 벤치마크 관점의 질문도 가능합니다.

### 데이터 시각화

"매체별 예산 배분과 도달률을 차트로 보여줘"라고 요청하면 인라인 차트로 응답합니다.

### 외부 정보 활용

"최근 뷰티 업계 광고 트렌드는?"처럼 웹 검색이 필요한 질문도 지원합니다. 출처가 함께 제공됩니다.

## 모델 선택

입력창 하단의 모델명을 클릭하여 목적에 맞는 AI 모델을 선택할 수 있습니다:

- **Gemini 3pro** — 대량 컨텍스트 · 시장 탐색 (기본)
- **Claude Sonnet 4.5** — 데이터 해석 · 전략 수립
- **Claude Haiku 4.5** — 빠르고 명확한 답변
- **Chat GPT 4o** — 창의적 기획 · 아이디어

## 세션

- 대화는 시나리오 × 사용자 단위로 14일간 유지됩니다.
- 14일 이내 재방문 시 이전 대화를 이어갈 수 있습니다.
- 헤더의 초기화(↺) 버튼으로 대화를 리셋할 수 있습니다.`
    }
  ]
}
