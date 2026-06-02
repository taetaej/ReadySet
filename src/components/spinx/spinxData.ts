// spinxData.ts — 정적 데이터 (모델 목록, 추천 질문, 답변 예시, 역질문 매핑)

import type { LLMModel, MessageContent, ClarifyingQuestion } from './spinxTypes'

export const availableModels: LLMModel[] = [
  { provider: 'Anthropic', name: 'claude-sonnet-4.6', displayName: 'Claude Sonnet 4.6', description: '데이터 해석 · 전략 수립' },
  { provider: 'OpenAI', name: 'gpt-5-4', displayName: 'GPT 5-4', description: '복잡한 추론 · 심층 분석' },
  { provider: 'OpenAI', name: 'gpt-5-4-mini', displayName: 'GPT 5-4 mini', description: '빠른 질의응답 · 콤팩트 분석' }
]

export const suggestedQuestions = [
  '이 예측 결과를 어떻게 해석해야 하나요?',
  'Effective Impression이 무엇인가요?',
  '이 데이터를 차트로 시각화해주세요',
  '2026년 5월 주요 뷰티 행사가 있나요?'
]

export const answerExamples: Record<string, MessageContent> = {
  // 추천 질문 답변
  '이 예측 결과를 어떻게 해석해야 하나요?': '현재 분석 결과는 TVC 50%, Digital 50% 비율이 최적임을 보여줍니다.\n\n주요 해석 포인트:\n\n1. 예상 Reach 1+가 73.2%로, 타겟 오디언스의 약 73%에게 최소 1회 이상 광고가 노출됩니다.\n\n2. 이 비율은 비용 대비 효율성이 가장 높은 지점으로, 예산을 더 투입해도 도달률 증가폭이 감소하는 체감 수익 구간에 진입합니다.\n\n3. 25-34세 여성 타겟의 미디어 소비 패턴이 TV와 디지털을 균형있게 사용하기 때문에 이러한 결과가 도출되었습니다.',
  'Effective Impression이 무엇인가요?': 'Effective Impression(유효 노출)은 광고가 실제로 효과적으로 전달된 노출 수를 의미합니다. [1]\n\n일반 Impression과의 차이:\n\n• 일반 Impression: 광고가 화면에 표시된 모든 횟수\n• Effective Impression: 사용자가 실제로 인지할 수 있는 조건에서 노출된 횟수\n\nReadySet 플랫폼 내 측정 기준:\n- Digital: 광고 면적의 50% 이상이 1초 이상 뷰포트에 노출 (동영상은 2초 이상 + 음성 재생) [2]\n- TVC: Nielsen 패널 기반 프로그램 시청률 × 광고 시간대 잔존율로 추정 [3]\n\nRatio Finder에서의 활용:\n- Effective Impression은 매체별 예산 배분 최적화의 핵심 지표로, 단순 노출 수가 아닌 실질적 광고 효과를 기준으로 최적 비중을 산출합니다.\n- 시뮬레이션 시 각 매체의 Effective CPM(eCPM)을 기반으로 비용 효율성을 비교합니다. [4]',
  '이 데이터를 차트로 시각화해주세요': {
    type: 'chart',
    data: {
      title: '매체별 예산 배분 및 도달률 비교',
      description: '다양한 예산 배분 시나리오에 따른 TVC/Digital 예산과 예상 도달률을 비교한 차트입니다. 현재 최적 비율(TVC 50%, Digital 50%)이 가장 높은 도달률(73.2%)을 보이며, 예산을 20% 증액할 경우 78.5%까지 도달률이 증가합니다.',
      categories: ['현재 최적', '예산 +20%', 'TVC 중심', 'Digital 중심'],
      series: [
        { name: 'TVC 예산', data: [500, 600, 700, 300], color: '#1a1a1a' },
        { name: 'Digital 예산', data: [500, 600, 300, 700], color: '#00FF9D' },
        { name: 'Reach 1+', data: [73.2, 78.5, 68.5, 70.8], color: '#B794F6', yAxis: 1 }
      ]
    }
  },
  '2026년 5월 주요 뷰티 행사가 있나요?': '웹 검색 결과, 2026년 5월 주요 뷰티 행사 정보입니다:\n\n📍 코스모프로프 아시아 (Cosmoprof Asia)\n• 일정: 2026년 5월 12-14일\n• 장소: 홍콩 컨벤션센터\n• 규모: 아시아 최대 뷰티 전시회\n\n📍 뷰티월드 재팬 (Beauty World Japan)\n• 일정: 2026년 5월 18-20일\n• 장소: 도쿄 빅사이트\n• 특징: 화장품, 네일, 에스테틱 종합 전시\n\n💡 캠페인 시사점:\n이 시기에 뷰티 업계 관심도가 높아지므로, 5월 중순 전후로 광고 집행을 강화하면 효과적일 수 있습니다.\n\n출처: 웹 검색 결과 종합',
  // ── 키워드 트리거 ──
  '일반': '현재 시나리오의 TVC:Digital 최적 비율은 50:50이며, 예상 Reach 1+는 73.2%입니다.\n\n총 예산 10억원 기준으로 TVC 5억원, Digital 5억원 배분을 권장합니다. 이 비율은 25-34세 여성 타겟의 미디어 소비 패턴과 과거 캠페인 데이터를 기반으로 최적화되었습니다.',
  'RAG': 'Effective Impression(유효 노출)은 광고가 실제로 효과적으로 전달된 노출 수를 의미합니다. [1]\n\n일반 Impression과의 차이:\n\n• 일반 Impression: 광고가 화면에 표시된 모든 횟수\n• Effective Impression: 사용자가 실제로 인지할 수 있는 조건에서 노출된 횟수 [2]\n\nDigital 채널의 Viewability 기준: 광고 면적 50% 이상이 1초 이상 뷰포트에 노출 [3]\nTVC: Nielsen 패널 기반 프로그램 시청률 × 광고 시간대 잔존율로 추정 [4]',
  '웹서치': '웹 검색 결과, 2026년 상반기 주요 광고 트렌드입니다:\n\n📍 숏폼 콘텐츠 광고 성장\n• TikTok, Instagram Reels 중심 광고비 전년 대비 +35%\n• 15초 이하 영상 광고 CTR 평균 3.2%\n\n📍 AI 기반 타겟팅 고도화\n• 퍼포먼스 캠페인에서 AI 최적화 도입률 68%\n• CPA 평균 22% 개선\n\n💡 시사점:\n현재 시나리오의 Digital 비중(50%)은 이러한 트렌드에 부합하며, 특히 숏폼 광고 상품 비중 확대를 고려해볼 수 있습니다.\n\n출처: 웹 검색 결과 종합',
  '시각화': {
    type: 'chart',
    data: {
      title: '매체별 예산 배분 및 도달률 비교',
      description: '다양한 예산 배분 시나리오에 따른 TVC/Digital 예산과 예상 도달률을 비교한 차트입니다.',
      categories: ['현재 최적', '예산 +20%', 'TVC 중심', 'Digital 중심'],
      series: [
        { name: 'TVC 예산', data: [500, 600, 700, 300], color: '#1a1a1a' },
        { name: 'Digital 예산', data: [500, 600, 300, 700], color: '#00FF9D' },
        { name: 'Reach 1+', data: [73.2, 78.5, 68.5, 70.8], color: '#B794F6', yAxis: 1 }
      ]
    }
  },
  '실패': { type: 'error', message: '답변 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
  '스트리밍': '이 답변은 스트리밍 효과를 확인하기 위한 긴 텍스트입니다.\n\n현재 시나리오 분석 결과를 종합하면 다음과 같습니다:\n\n1. 매체 비중 최적화\nTVC 50%, Digital 50% 비율이 비용 대비 도달률 효율성이 가장 높은 지점입니다. TVC는 브랜드 인지도 확보에, Digital은 타겟 정밀 도달에 각각 강점을 보입니다.\n\n2. 타겟 분석\n25-34세 여성 타겟은 TV와 디지털을 균형있게 소비하는 특성이 있어, 현재 매체 비중이 이 타겟의 미디어 소비 패턴에 최적화되어 있습니다.\n\n3. 예산 효율성\n현재 10억원 예산 기준 Efficiency Peak는 약 8.5억원 지점이며, 추가 1.5억원의 한계 도달률 기여는 +2.1%p입니다.\n\n4. 경쟁사 대비\n동일 업종 평균 대비 도달률 +7.8%p, CPM -13.4% 수준으로 효율적인 매체 배분을 보이고 있습니다.\n\n5. 개선 제안\nDigital 예산 중 리타겟팅 비중을 15%에서 25%로 확대하면 Reach 3+ 기준 약 +4.2%p 개선이 예상됩니다.'
}

export const clarifyingQuestions: Record<string, ClarifyingQuestion> = {
  '이 예측 결과를 어떻게 해석해야 하나요?': {
    question: '어떤 관점에서 분석해드릴까요?',
    options: ['매체별 효율 비교', '타겟 도달률 중심', '예산 최적화 방향', '경쟁사 벤치마크 대비'],
    allowCustom: true,
    selectionMode: 'single'
  },
  '이 데이터를 차트로 시각화해주세요': {
    question: '어떤 지표를 포함할까요? (복수 선택 가능)',
    options: ['Reach 1+', 'CPRP', 'GRPs', 'Avg. Frequency', '매체별 예산 배분'],
    selectionMode: 'multiple'
  },
  // ── 키워드 트리거 ──
  '역질문': {
    question: '어떤 관점에서 분석해드릴까요?',
    options: ['매체별 효율 비교', '타겟 도달률 중심', '예산 최적화 방향', '경쟁사 벤치마크 대비'],
    allowCustom: true,
    selectionMode: 'single'
  },
  '역질문N': {
    question: '어떤 지표를 포함할까요? (복수 선택 가능)',
    options: ['Reach 1+', 'CPRP', 'GRPs', 'Avg. Frequency', '매체별 예산 배분'],
    selectionMode: 'multiple'
  }
}

export const clarifyingAnswers: Record<string, string> = {
  '매체별 효율 비교': '매체별 효율 관점에서 분석한 결과입니다.\n\n현재 TVC 50% : Digital 50% 비율에서:\n\n• TVC의 CPM은 ₩12,500으로, Digital 대비 약 1.8배 높지만 도달 범위가 넓어 브랜드 인지도 확보에 유리합니다.\n• Digital은 CPM ₩6,900으로 비용 효율이 높고, 특히 25-34세 타겟에서 TVC 대비 1.4배 높은 도달률을 보입니다.\n\n결론적으로 현재 50:50 비율이 두 매체의 장점을 균형있게 활용하는 최적 지점입니다.',
  '타겟 도달률 중심': '타겟 도달률 관점에서 분석한 결과입니다.\n\n25-34세 여성 타겟 기준:\n\n• 예상 Reach 1+: 73.2% (약 340만 명 도달)\n• Reach 3+: 45.8% (3회 이상 반복 노출)\n• Effective Frequency 도달률: 52.1%\n\n이 타겟은 TV와 디지털을 균형있게 소비하는 특성이 있어, 현재 매체 비중이 도달률 극대화에 적합합니다.',
  '예산 최적화 방향': '예산 최적화 관점에서 분석한 결과입니다.\n\n현재 10억 예산 기준:\n\n• Efficiency Peak: 약 8.5억 (이 지점까지 도달률 증가폭이 가장 큼)\n• 현재 예산(10억)은 Peak 대비 +1.5억 초과 상태\n• 추가 1.5억의 한계 도달률 기여: +2.1%p\n\n💡 추천: 1.5억을 Digital 리타겟팅에 재배분하면 Reach 3+ 기준 약 +4.2%p 개선이 가능합니다.',
  '경쟁사 벤치마크 대비': '경쟁사 벤치마크 대비 분석 결과입니다.\n\n동일 업종(뷰티) 평균 대비:\n\n• 도달률: 73.2% vs 업종 평균 65.4% (+7.8%p 우위)\n• CPM: ₩9,700 vs 업종 평균 ₩11,200 (13.4% 효율적)\n• 매체 비중: TVC 50% vs 업종 평균 TVC 62% (Digital 비중 높음)\n\n현재 시나리오는 업종 평균 대비 효율적인 매체 배분을 보이고 있습니다.',
  '건너뛰기': '알겠습니다. 그럼 전체적인 관점에서 분석해드릴게요.\n\n현재 분석 결과는 TVC 50%, Digital 50% 비율이 최적임을 보여줍니다.\n\n• 예상 Reach 1+: 73.2%\n• 비용 대비 효율성이 가장 높은 지점\n• 25-34세 여성 타겟의 미디어 소비 패턴에 최적화\n\n더 구체적인 관점이 필요하시면 언제든 질문해주세요.'
}
