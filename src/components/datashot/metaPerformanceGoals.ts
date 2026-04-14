// Meta 성과 목표 value 값
export const metaPerformanceGoals = [
  '게시물 참여 극대화',
  '광고 상기도 성과 증대',
  '노출',
  '대화',
  '동영상 10초 이상 조회',
  '동영상 연속 2초 이상 재생 극대화',
  '랜딩 페이지 조회수 극대화',
  '링크 클릭수 극대화',
  '브랜드 인지도',
  '알림 설정 극대화',
  '앱 설치수 극대화',
  '앱 이벤트 수 극대화',
  '이벤트 응답',
  '일일 고유 도달 극대화',
  '잠재 고객 수 극대화',
  '전환 이벤트',
  '전환 잠재 고객 수 극대화',
  '전환값 극대화',
  '통화 수를 최대한 늘려보세요',
  'CLICKS',
  'Instagram 프로필 방문 수 극대화',
  'Instagram 프로필 방문 수 극대화',
  'ThruPlay 조회 극대화',
] as const

export type MetaPerformanceGoal = (typeof metaPerformanceGoals)[number]
