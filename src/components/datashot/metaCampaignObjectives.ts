// Meta 캠페인 목표 value 값 (조회조건 1번)
export const metaCampaignObjectives = [
  '인지도',
  '트래픽',
  '참여',
  '잠재 고객',
  '앱 홍보',
  '판매',
  '게시물 참여',
  '도달',
  '동영상 조회',
  '매장 유입',
  '메시지',
  '모바일 앱 설치',
  '브랜드 인지도',
  '앱 설치',
  '이벤트 응답',
  '잠재 고객 확보',
  '전환',
  '카탈로그 판매',
  '쿠폰 발급',
  '링크 클릭',
  '페이지 좋아요',
] as const

export type MetaCampaignObjective = (typeof metaCampaignObjectives)[number]
