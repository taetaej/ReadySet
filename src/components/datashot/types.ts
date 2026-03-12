// DataShot 타입 정의

export type DatasetStatus = 'Pending' | 'Processing' | 'Completed' | 'Error' | 'Expired'

export interface Dataset {
  id: number
  name: string
  media: string
  industry: string
  startDate: string
  endDate: string
  periodType: 'month' | 'quarter' // 월별/분기별 구분
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
    industry: '전체',
    startDate: '2024-01',
    endDate: '2024-01',
    periodType: 'month',
    status: 'Completed',
    created: '2024-02-01 14:30',
    creator: '김철수',
    creatorId: 'kimcheolsu@gmail.com'
  },
  {
    id: 2,
    name: 'Meta 광고 성과 분석 데이터',
    media: 'Meta',
    industry: '3개 업종',
    startDate: '2024-01',
    endDate: '2024-02',
    periodType: 'month',
    status: 'Processing',
    created: '2024-02-10 09:15',
    creator: '이영희',
    creatorId: 'leeyounghee@naver.com'
  },
  {
    id: 3,
    name: '카카오 모먼트 캠페인 추출',
    media: 'kakao모먼트',
    industry: '식품',
    startDate: '2024-02',
    endDate: '2024-02',
    periodType: 'month',
    status: 'Pending',
    created: '2024-02-20 11:20',
    creator: '박민수',
    creatorId: 'parkminsu@kakao.com'
  },
  {
    id: 4,
    name: '네이버 성과형 DA 광고 데이터',
    media: '네이버 성과형 DA',
    industry: '5개 업종',
    startDate: '2024-1',
    endDate: '2024-1',
    periodType: 'quarter',
    status: 'Error',
    created: '2024-02-15 15:40',
    creator: '최지은',
    creatorId: 'choijieun@naver.com'
  },
  {
    id: 5,
    name: 'TikTok 광고 성과 데이터',
    media: 'TikTok',
    industry: '패션',
    startDate: '2024-01',
    endDate: '2024-02',
    periodType: 'month',
    status: 'Completed',
    created: '2024-03-01 10:00',
    creator: '정현우',
    creatorId: 'junghyunwoo@gmail.com'
  },
  {
    id: 6,
    name: '네이버 보장형 DA 캠페인 분석',
    media: '네이버 보장형 DA',
    industry: '전체',
    startDate: '2024-02',
    endDate: '2024-03',
    periodType: 'month',
    status: 'Processing',
    created: '2024-02-05 13:25',
    creator: '강민지',
    creatorId: 'kangminji@naver.com'
  },
  {
    id: 7,
    name: 'Google Ads 디스플레이 캠페인',
    media: 'Google Ads',
    industry: '2개 업종',
    startDate: '2024-1',
    endDate: '2024-2',
    periodType: 'quarter',
    status: 'Expired',
    created: '2024-01-22 16:10',
    creator: '윤서준',
    creatorId: 'yoonseojun@gmail.com'
  },
  {
    id: 8,
    name: 'Meta 신제품 런칭 캠페인',
    media: 'Meta',
    industry: '전자제품',
    startDate: '2024-03',
    endDate: '2024-03',
    periodType: 'month',
    status: 'Pending',
    created: '2024-02-20 10:45',
    creator: '조은비',
    creatorId: 'joeunbi@naver.com'
  },
  {
    id: 9,
    name: 'kakao모먼트 여름 프로모션',
    media: 'kakao모먼트',
    industry: '7개 업종',
    startDate: '2024-2',
    endDate: '2024-3',
    periodType: 'quarter',
    status: 'Processing',
    created: '2024-04-25 14:00',
    creator: '한지우',
    creatorId: 'hanjiwoo@kakao.com'
  },
  {
    id: 10,
    name: 'TikTok 건강식품 타겟 마케팅',
    media: 'TikTok',
    industry: '건강식품',
    startDate: '2024-02',
    endDate: '2024-04',
    periodType: 'month',
    status: 'Completed',
    created: '2024-02-10 09:30',
    creator: '송하늘',
    creatorId: 'songhaneul@gmail.com'
  },
  {
    id: 11,
    name: '네이버 성과형 DA 봄 시즌 캠페인',
    media: '네이버 성과형 DA',
    industry: '2개 업종',
    startDate: '2024-03',
    endDate: '2024-05',
    periodType: 'month',
    status: 'Processing',
    created: '2024-03-05 11:15',
    creator: '김민준',
    creatorId: 'kimminjun@naver.com'
  },
  {
    id: 12,
    name: 'Google Ads 검색 광고 최적화',
    media: 'Google Ads',
    industry: '전체',
    startDate: '2024-1',
    endDate: '2024-2',
    periodType: 'quarter',
    status: 'Completed',
    created: '2024-01-18 14:20',
    creator: '이서연',
    creatorId: 'leeseoyeon@gmail.com'
  },
  {
    id: 13,
    name: 'Meta 리타겟팅 캠페인',
    media: 'Meta',
    industry: '5개 업종',
    startDate: '2024-04',
    endDate: '2024-06',
    periodType: 'month',
    status: 'Pending',
    created: '2024-04-01 09:00',
    creator: '박지훈',
    creatorId: 'parkjihun@naver.com'
  },
  {
    id: 14,
    name: 'kakao모먼트 브랜드 인지도 캠페인',
    media: 'kakao모먼트',
    industry: '전자제품',
    startDate: '2024-2',
    endDate: '2024-2',
    periodType: 'quarter',
    status: 'Error',
    created: '2024-04-10 16:30',
    creator: '최수진',
    creatorId: 'choisujin@kakao.com'
  },
  {
    id: 15,
    name: 'TikTok 신규 고객 유치 캠페인',
    media: 'TikTok',
    industry: '3개 업종',
    startDate: '2024-05',
    endDate: '2024-07',
    periodType: 'month',
    status: 'Processing',
    created: '2024-05-01 10:45',
    creator: '정예린',
    creatorId: 'jungyerin@gmail.com'
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
  },
  '건설, 건재및부동산': {
    '건설, 건재및부동산기타': ['건설, 건재및부동산기타']
  },
  '관공서및단체': {
    '관공서및단체기타': ['관공서및단체기타']
  },
  '교육및복지후생': {
    '교육및복지후생기타': ['교육및복지후생기타']
  },
  '금융, 보험및증권': {
    '금융, 보험및증권기타': ['금융, 보험및증권기타']
  },
  '그룹및기업광고': {
    '그룹및기업광고기타': ['그룹및기업광고기타']
  },
  '기초재': {
    '기초재기타': ['기초재기타']
  },
  '산업기기': {
    '산업기기기타': ['산업기기기타']
  },
  '서비스': {
    '서비스기타': ['서비스기타']
  },
  '수송기기': {
    '수송기기기타': ['수송기기기타']
  },
  '식품': {
    '식품기타': ['식품기타']
  },
  '유통': {
    '유통기타': ['유통기타']
  },
  '음료및기호식품': {
    '음료및기호식품기타': ['음료및기호식품기타']
  },
  '정밀기기및사무기기': {
    '정밀기기및사무기기기타': ['정밀기기및사무기기기타']
  },
  '제약및의료': {
    '제약및의료기타': ['제약및의료기타']
  },
  '출판': {
    '출판기타': ['출판기타']
  },
  '컴퓨터및정보통신': {
    '컴퓨터및정보통신기타': ['컴퓨터및정보통신기타']
  },
  '패션': {
    '패션기타': ['패션기타']
  },
  '화장품및보건용품': {
    '화장품및보건용품기타': ['화장품및보건용품기타']
  },
  '화학공업': {
    '화학공업기타': ['화학공업기타']
  },
  'N': {
    'N기타': ['N기타']
  }
}

// 브랜드-업종 매핑 (검색용)
export const brandIndustryMap: { [brand: string]: string } = {
  'LG': '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
  '삼성': '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
  '다이슨': '가정용전기전자 > 가사용전기전자 > 청소기',
  '샤오미': '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
  '애플': '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
  '소니': '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
  '필립스': '가정용전기전자 > 가사용전기전자 > 가사용전기전자기타',
  '보쉬': '가정용전기전자 > 가사용전기전자 > 세탁기',
  '일렉트로룩스': '가정용전기전자 > 가사용전기전자 > 세탁기',
  '쿠쿠': '가정용품 > 주방용품 > 주방용품',
  '락앤락': '가정용품 > 주방용품 > 주방용품',
  '코웨이': '가정용전기전자 > 가사용전기전자 > 가습기',
  '청호나이스': '가정용전기전자 > 가사용전기전자 > 가습기'
}

// 매체별 광고상품 데이터 구조
export interface AdProductField {
  label: string
  key: string
  required: boolean
  options: string[]
}

export interface MediaAdProductStructure {
  fields: AdProductField[]
}

export interface MetaAdProductCombination {
  campaignObjective: string
  buyingType: string
  performanceGoal: string
  platform: string
}

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
  'Meta': [], // Meta는 4단계 구조로 별도 처리
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

// Meta 광고 지표 데이터
export interface MetricItem {
  id: string
  label: string
  selected: boolean
}

export interface MetricGroup {
  group: string
  metrics: MetricItem[]
}

export const metaMetrics: MetricGroup[] = [
  {
    group: '성과',
    metrics: [
      { id: 'clicks_all', label: '클릭(전체)', selected: false },
      { id: 'cpc', label: 'CPC', selected: false },
      { id: 'cpm', label: 'CPM', selected: false },
      { id: 'cpv', label: 'CPV', selected: false },
      { id: 'ctr', label: 'CTR', selected: false },
      { id: 'vtr', label: 'VTR', selected: false },
      { id: 'frequency', label: '빈도', selected: false },
      { id: 'impressions', label: '노출수', selected: false },
      { id: 'reach', label: '도달수', selected: false },
      { id: 'spend', label: '광고 소진금액', selected: false }
    ]
  },
  {
    group: '참여',
    metrics: [
      { id: 'link_click', label: '링크 클릭 수', selected: false },
      { id: 'cost_per_link_click', label: '링크 클릭당 비용', selected: false },
      { id: 'link_ctr', label: '링크 클릭률', selected: false },
      { id: 'cost_per_video_3s', label: '동영상 3초 이상 조회당 비용', selected: false },
      { id: 'cost_per_video_15s', label: '동영상 15초 이상 조회당 비용', selected: false },
      { id: 'video_play_3s', label: '3초 재생수', selected: false },
      { id: 'video_play_15s', label: '15초 재생수', selected: false },
      { id: 'post_reaction', label: '게시물 반응수', selected: false },
      { id: 'post_engagement', label: '게시물 참여수', selected: false },
      { id: 'cost_per_post_engagement', label: '게시물 참여당 비용', selected: false },
      { id: 'video_views_3s', label: '동영상 3초 이상 조회수', selected: false },
      { id: 'video_views_15s', label: '동영상 15초 이상 조회수', selected: false },
      { id: 'video_views_30s', label: '동영상 30초 이상 조회수', selected: false }
    ]
  },
  {
    group: '진단',
    metrics: [
      { id: 'video_view_25', label: '동영상 25% 재생수', selected: false },
      { id: 'video_view_50', label: '동영상 50% 재생수', selected: false },
      { id: 'video_view_75', label: '동영상 75% 재생수', selected: false },
      { id: 'video_view_95', label: '동영상 95% 재생수', selected: false },
      { id: 'video_view_100', label: '동영상 100% 재생', selected: false }
    ]
  },
  {
    group: '전환',
    metrics: [
      { id: 'purchase', label: '구매수', selected: false },
      { id: 'cost_per_purchase', label: '구매당 비용', selected: false },
      { id: 'complete_registration', label: '등록 완료수', selected: false },
      { id: 'cost_per_registration', label: '등록 완료당 비용', selected: false },
      { id: 'install', label: '설치수', selected: false },
      { id: 'cost_per_install', label: '설치당 비용', selected: false }
    ]
  }
]

// 년도 및 월/분기 옵션
export const yearOptions = ['2023', '2024', '2025', '2026']
export const monthOptions = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
export const quarterOptions = ['1분기', '2분기', '3분기', '4분기']

// 매체별 타겟팅 옵션
export interface TargetingOption {
  category: string
  options: string[]
}

export const targetingOptionsByMedia: { [media: string]: TargetingOption[] } = {
  'Google Ads': [
    {
      category: '기기유형',
      options: ['데스크톱', '모바일', '태블릿']
    }
  ],
  'Meta': [
    {
      category: '기기유형',
      options: ['데스크톱', '모바일 웹', '분류되지 않음', '앱 내']
    },
    {
      category: '게재위치',
      options: [
        'Facebook Marketplace',
        'Facebook 검색 결과',
        'Facebook 동영상 피드',
        'Facebook 릴스',
        'Facebook 릴스 광고',
        'Facebook 스토리',
        'Instagram 릴스',
        'Instagram 스토리',
        'Instagram 탐색 탭',
        'Instagram 탐색 홈',
        'Instagram 프로필 피드',
        '분류되지 않음',
        '피드'
      ]
    }
  ],
  'kakao모먼트': [
    {
      category: '기기유형',
      options: ['PC', '모바일']
    },
    {
      category: '게재지면',
      options: ['카카오톡', '카카오스토리', 'Daum']
    },
    {
      category: '연령',
      options: ['10대', '20대', '30대', '40대', '50대', '60대 이상']
    },
    {
      category: '지역',
      options: ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
    },
    {
      category: '소재형식',
      options: ['이미지', '동영상', '캐러셀']
    }
  ],
  '네이버 성과형 DA': [
    {
      category: '기기유형',
      options: ['PC', '모바일']
    }
  ],
  '네이버 보장형 DA': [
    {
      category: '게재위치',
      options: ['메인', '시간', '키워드', '소재오픈']
    },
    {
      category: '시간',
      options: ['오전', '오후', '저녁', '심야']
    },
    {
      category: '키워드',
      options: ['브랜드', '제품', '카테고리']
    },
    {
      category: '소재요소',
      options: ['이미지', '동영상', '텍스트']
    }
  ],
  'TikTok': [
    {
      category: '플랫폼',
      options: ['TikTok', 'Pangle', 'Global App Bundle']
    },
    {
      category: '게재위치',
      options: ['For You 피드', 'Following 피드', 'TikTok 검색']
    },
    {
      category: '성별',
      options: ['남성', '여성']
    },
    {
      category: '연령',
      options: ['13-17', '18-24', '25-34', '35-44', '45-54', '55+']
    },
    {
      category: '지역',
      options: ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
    }
  ]
}

// Meta 광고상품 샘플 데이터 (실제로는 API에서 가져와야 함)
export const metaAdProductCombinations: MetaAdProductCombination[] = [
  // CONVERSIONS 샘플
  { campaignObjective: 'CONVERSIONS', buyingType: 'AUCTION', performanceGoal: 'OFFSITE_CONVERSIONS', platform: 'facebook' },
  { campaignObjective: 'CONVERSIONS', buyingType: 'AUCTION', performanceGoal: 'OFFSITE_CONVERSIONS', platform: 'instagram' },
  { campaignObjective: 'CONVERSIONS', buyingType: 'AUCTION', performanceGoal: 'LINK_CLICKS', platform: 'facebook' },
  { campaignObjective: 'CONVERSIONS', buyingType: 'AUCTION', performanceGoal: 'LINK_CLICKS', platform: 'instagram' },
  { campaignObjective: 'CONVERSIONS', buyingType: 'RESERVED', performanceGoal: 'OFFSITE_CONVERSIONS', platform: 'facebook' },
  
  // LEAD_GENERATION 샘플
  { campaignObjective: 'LEAD_GENERATION', buyingType: 'AUCTION', performanceGoal: 'LEAD_GENERATION', platform: 'facebook' },
  { campaignObjective: 'LEAD_GENERATION', buyingType: 'AUCTION', performanceGoal: 'LEAD_GENERATION', platform: 'instagram' },
  { campaignObjective: 'LEAD_GENERATION', buyingType: 'AUCTION', performanceGoal: 'QUALITY_LEAD', platform: 'facebook' },
  
  // OUTCOME_TRAFFIC 샘플
  { campaignObjective: 'OUTCOME_TRAFFIC', buyingType: 'AUCTION', performanceGoal: 'LINK_CLICKS', platform: 'facebook' },
  { campaignObjective: 'OUTCOME_TRAFFIC', buyingType: 'AUCTION', performanceGoal: 'LINK_CLICKS', platform: 'instagram' },
  { campaignObjective: 'OUTCOME_TRAFFIC', buyingType: 'AUCTION', performanceGoal: 'LANDING_PAGE_VIEWS', platform: 'facebook&instagram' },
  
  // VIDEO_VIEWS 샘플
  { campaignObjective: 'VIDEO_VIEWS', buyingType: 'AUCTION', performanceGoal: 'THRUPLAY', platform: 'facebook' },
  { campaignObjective: 'VIDEO_VIEWS', buyingType: 'AUCTION', performanceGoal: 'VIDEO_VIEWS', platform: 'instagram' },
  { campaignObjective: 'VIDEO_VIEWS', buyingType: 'RESERVED', performanceGoal: 'THRUPLAY', platform: 'facebook&instagram' }
]
