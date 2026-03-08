// DataShot 타입 정의

export type DatasetStatus = 'Pending' | 'Processing' | 'Completed' | 'Error' | 'Expired'

export interface Dataset {
  id: number
  name: string
  media: string
  industry: string
  startDate: string
  endDate: string
  status: DatasetStatus
  created: string
  creator: string
  creatorId: string
}

// 샘플 데이터
export const sampleDatasets: Dataset[] = [
  {
    id: 1,
    name: '2024년 1월 Google Ads 캠페인 데이터',
    media: 'Google Ads',
    industry: '화장품',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'Completed',
    created: '2024-02-01 14:30',
    creator: '김철수',
    creatorId: 'USER001'
  },
  {
    id: 2,
    name: 'Meta 광고 성과 분석 데이터',
    media: 'Meta',
    industry: '이커머스',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: 'Processing',
    created: '2024-02-10 09:15',
    creator: '이영희',
    creatorId: 'USER002'
  },
  {
    id: 3,
    name: '카카오 모먼트 캠페인 추출',
    media: 'kakao모먼트',
    industry: '식품',
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    status: 'Pending',
    created: '2024-02-20 11:20',
    creator: '박민수',
    creatorId: 'USER003'
  },
  {
    id: 4,
    name: '네이버 성과형 DA 광고 데이터',
    media: '네이버 성과형 DA',
    industry: '자동차',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    status: 'Error',
    created: '2024-02-15 15:40',
    creator: '최지은',
    creatorId: 'USER004'
  },
  {
    id: 5,
    name: 'TikTok 광고 성과 데이터',
    media: 'TikTok',
    industry: '패션',
    startDate: '2024-01-01',
    endDate: '2024-02-28',
    status: 'Completed',
    created: '2024-03-01 10:00',
    creator: '정현우',
    creatorId: 'USER005'
  },
  {
    id: 6,
    name: '네이버 보장형 DA 캠페인 분석',
    media: '네이버 보장형 DA',
    industry: '게임',
    startDate: '2024-02-10',
    endDate: '2024-03-10',
    status: 'Processing',
    created: '2024-02-05 13:25',
    creator: '강민지',
    creatorId: 'USER006'
  },
  {
    id: 7,
    name: 'Google Ads 디스플레이 캠페인',
    media: 'Google Ads',
    industry: '이커머스',
    startDate: '2024-01-28',
    endDate: '2024-02-28',
    status: 'Expired',
    created: '2024-01-22 16:10',
    creator: '윤서준',
    creatorId: 'USER007'
  },
  {
    id: 8,
    name: 'Meta 신제품 런칭 캠페인',
    media: 'Meta',
    industry: '전자제품',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: 'Pending',
    created: '2024-02-20 10:45',
    creator: '조은비',
    creatorId: 'USER008'
  },
  {
    id: 9,
    name: 'kakao모먼트 여름 프로모션',
    media: 'kakao모먼트',
    industry: '여행',
    startDate: '2024-05-01',
    endDate: '2024-07-31',
    status: 'Processing',
    created: '2024-04-25 14:00',
    creator: '한지우',
    creatorId: 'USER009'
  },
  {
    id: 10,
    name: 'TikTok 건강식품 타겟 마케팅',
    media: 'TikTok',
    industry: '건강식품',
    startDate: '2024-02-15',
    endDate: '2024-04-15',
    status: 'Completed',
    created: '2024-02-10 09:30',
    creator: '송하늘',
    creatorId: 'USER010'
  }
]

// 업종 분류 데이터
export const industryCategories: { [major: string]: { [mid: string]: string[] } } = {
  '가정용전기전자': {
    '가사용전기전자': ['가사용전기전자기타', '가습기', '다리미', '세탁기', '청소기'],
    '가정용전기전자기타': ['가정용전기전자기업PR', '가정용전기전자기업공고', '가정용전기전자기타', '가정용전기전자제품종합']
  },
  '가정용품': {
    '가정용품기타': ['가정용품기타'],
    '주방용품': ['주방용품']
  }
  // TODO: 나머지 20개 대분류 추가 예정
}

// 브랜드-업종 매핑 (검색용)
export const brandIndustryMap: { [brand: string]: string } = {
  'LG': '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
  '삼성': '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
  '다이슨': '가정용전기전자 > 가사용전기전자 > 청소기'
  // TODO: 더 많은 브랜드 추가 예정
}

// 매체별 광고상품 데이터
export const adProductsByMedia: { [media: string]: string[] } = {
  'Google Ads': [
    '검색 광고',
    '디스플레이 광고',
    '동영상 광고 (YouTube)',
    '쇼핑 광고',
    '앱 광고',
    '스마트 캠페인',
    '디스커버리 광고',
    'Performance Max'
  ],
  'Meta': [
    'Facebook 피드 광고',
    'Facebook 스토리 광고',
    'Instagram 피드 광고',
    'Instagram 스토리 광고',
    'Instagram 릴스 광고',
    'Messenger 광고',
    'Audience Network',
    'Facebook 동영상 광고'
  ],
  'kakao모먼트': [
    '카카오톡 비즈보드',
    '카카오톡 채널 광고',
    '카카오스토리 광고',
    'Daum 디스플레이',
    '카카오톡 메시지 광고',
    '브랜드 검색 광고'
  ],
  '네이버 성과형 DA': [
    '파워링크',
    '쇼핑검색',
    '브랜드검색',
    'GFA (보장형 배너)',
    '동영상 광고',
    '네이티브 광고'
  ],
  '네이버 보장형 DA': [
    '프리미엄 배너',
    '메인 롤링보드',
    '브랜드 배너',
    '동영상 배너',
    '네이티브 보드'
  ],
  'TikTok': [
    'In-Feed 광고',
    'TopView 광고',
    'Brand Takeover',
    'Branded Hashtag Challenge',
    'Branded Effects',
    'Spark Ads'
  ]
}

// 선택 가능한 지표 리스트
export const availableMetrics = [
  { id: 'impressions', name: '노출수', category: '기본 지표' },
  { id: 'clicks', name: '클릭수', category: '기본 지표' },
  { id: 'ctr', name: '클릭률 (CTR)', category: '기본 지표' },
  { id: 'reach', name: '도달수', category: '기본 지표' },
  { id: 'frequency', name: '빈도', category: '기본 지표' },
  { id: 'cost', name: '비용', category: '비용 지표' },
  { id: 'cpc', name: '클릭당 비용 (CPC)', category: '비용 지표' },
  { id: 'cpm', name: '1000회 노출당 비용 (CPM)', category: '비용 지표' },
  { id: 'conversions', name: '전환수', category: '전환 지표' },
  { id: 'conversion_rate', name: '전환율', category: '전환 지표' },
  { id: 'cpa', name: '전환당 비용 (CPA)', category: '전환 지표' },
  { id: 'roas', name: '광고 수익률 (ROAS)', category: '전환 지표' },
  { id: 'video_views', name: '동영상 조회수', category: '동영상 지표' },
  { id: 'video_completion', name: '동영상 완료율', category: '동영상 지표' },
  { id: 'engagement', name: '참여수', category: '참여 지표' },
  { id: 'engagement_rate', name: '참여율', category: '참여 지표' }
]
