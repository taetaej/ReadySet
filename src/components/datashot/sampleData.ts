import { metaCampaignObjectives } from './metaCampaignObjectives'
import { metaPlatforms } from './metaPlatforms'
import { metaPerformanceGoals } from './metaPerformanceGoals'

// 데이터샷 상세 페이지 샘플 데이터

// 샘플 데이터 생성 함수 - Meta
export const generateMetaSampleData = () => {
  const data = []
  
  // 캠페인 목표 옵션 (한글 매핑값 사용)
  const objectives = [
    '게시물 참여',      // POST_ENGAGEMENT
    '전환',            // CONVERSIONS
    '트래픽',          // OUTCOME_TRAFFIC
    '도달',            // REACH
    '잠재 고객 확보',   // LEAD_GENERATION
    '동영상 조회',      // VIDEO_VIEWS
    '인지도',          // OUTCOME_AWARENESS
    '참여',            // OUTCOME_ENGAGEMENT
    '판매'             // OUTCOME_SALES
  ]
  
  // 구매 유형 (한글 매핑값 사용)
  const buyingTypes = ['경매', '예약']  // AUCTION, RESERVED
  
  // 플랫폼 (영문 그대로)
  const platforms = [
    'facebook',
    'instagram',
    'facebook&instagram',
    'facebook&instagram&messenger',
    'messenger',
    'audience_network'
  ]
  
  // 성과 목표 (한글 매핑값 사용)
  const performanceGoals = [
    '앱 이벤트 수 극대화',           // OFFSITE_CONVERSIONS
    '링크 클릭수 극대화',            // LINK_CLICKS
    '노출',                         // IMPRESSIONS
    '일일 고유 도달 극대화',         // REACH
    '게시물 참여 극대화',            // POST_ENGAGEMENT
    'ThruPlay 조회 극대화',         // THRUPLAY
    '랜딩 페이지 조회수 극대화',     // LANDING_PAGE_VIEWS
    '전환값 극대화'                 // VALUE
  ]
  
  // 타겟팅 옵션 (한글 매핑값 사용)
  const targetingOptions = [
    '모바일 웹',        // mobile_web
    '데스크톱',         // desktop
    '앱 내',           // mobile_app
    '분류되지 않음'     // unknown
  ]
  
  const seed = (n: number, offset: number) => Math.abs(Math.sin(n * 9301 + offset * 49297) * 233280) % 1

  for (let i = 0; i < 100; i++) {
    const impressions = Math.round(50000 + seed(i, 1) * 5000000)
    const clicks = Math.round(impressions * (0.005 + seed(i, 2) * 0.08))
    const cost = Math.round(500000 + seed(i, 3) * 50000000)
    data.push({
      period: '2024-01',
      media: 'Meta',
      industryLarge: '제조업',
      industryMedium: '전자제품',
      industrySmall: '스마트폰',
      objective: objectives[i % objectives.length],
      buyingType: buyingTypes[i % buyingTypes.length],
      platform: platforms[i % platforms.length],
      performanceGoal: performanceGoals[i % performanceGoals.length],
      targetingOption: targetingOptions[i % targetingOptions.length],
      impressions,
      clicks,
      cost,
      ctr: parseFloat((clicks / impressions * 100).toFixed(2)),
      cpc: Math.round(cost / (clicks || 1)),
      cpm: parseFloat((cost / impressions * 1000).toFixed(1)),
      vtr: parseFloat((seed(i, 10) * 60).toFixed(1))
    })
  }
  return data
}

// 샘플 데이터 생성 함수 - Kakao
export const generateKakaoSampleData = () => {
  const data = []
  
  // 캠페인 유형 (한글 매핑값 사용)
  const campaignTypes = [
    '디스플레이',
    '포커스 풀뷰',
    '포커스 보드',
    '상품 카탈로그',
    '카카오톡비즈보드',
    '카카오톡 채널',
    '동영상'
  ]
  
  // 캠페인 목표 (한글 매핑값 사용)
  const objectives = ['전환', '방문', '도달', '조회']
  
  // 목표 유형 (한글 매핑값 사용)
  const objectiveTypes = ['픽셀&SDK', '카카오톡채널', '카탈로그 광고 최적화']
  
  // 과금 방식 (한글 매핑값 사용)
  const pricingTypes = ['CPC', 'CPA', 'CPM', 'CPV']
  
  // 광고 포맷 (한글 매핑값 사용)
  const adFormats = [
    '이미지 카탈로그',
    '이미지 배너',
    '이미지 네이티브',
    '비디오 네이티브',
    '리치 네이티브',
    '다이나믹 카탈로그',
    '캐러셀 커머스',
    '캐러셀 피드',
    '와이드 이미지'
  ]
  
  const seed = (n: number, offset: number) => Math.abs(Math.sin(n * 9301 + offset * 49297) * 233280) % 1

  for (let i = 0; i < 100; i++) {
    const impressions = Math.round(30000 + seed(i, 4) * 3000000)
    const clicks = Math.round(impressions * (0.003 + seed(i, 5) * 0.07))
    const cost = Math.round(300000 + seed(i, 6) * 30000000)
    data.push({
      period: '2024-01',
      media: 'kakao모먼트',
      industryLarge: '제조업',
      industryMedium: '전자제품',
      industrySmall: '스마트폰',
      campaignType: campaignTypes[i % campaignTypes.length],
      objective: objectives[i % objectives.length],
      objectiveType: objectiveTypes[i % objectiveTypes.length],
      pricingType: pricingTypes[i % pricingTypes.length],
      adFormat: adFormats[i % adFormats.length],
      impressions,
      clicks,
      cost,
      ctr: parseFloat((clicks / impressions * 100).toFixed(2)),
      cpc: Math.round(cost / (clicks || 1)),
      cpm: parseFloat((cost / impressions * 1000).toFixed(1)),
      vtr: parseFloat((seed(i, 11) * 60).toFixed(1))
    })
  }
  return data
}

// 샘플 데이터 생성 함수 - Naver GFA
export const generateNaverGfaSampleData = () => {
  const data = []
  
  // 캠페인 목표 (한글 매핑값 사용)
  const objectives = [
    '쇼핑 프로모션',
    '앱 전환',
    '웹사이트 전환',
    '인지도 및 트래픽',
    '참여 유도',
    '동영상 조회',
    '카탈로그 판매'
  ]
  
  // 과금 방식 (한글 매핑값 사용)
  const pricingTypes = ['CPC', 'CPM', 'CPV']
  
  // 게재 위치 (한글 매핑값 사용)
  const placements = [
    '네이버 > 배너 영역 > 네이버 메인',
    '네이버 > 배너 영역 > 서비스 통합',
    '네이버 > 쇼핑 영역',
    '네이버 패밀리 매체 > 배너 영역',
    '네이버 > 커뮤니케이션 영역',
    '네이버 > 피드 영역',
    '네이버 > 스마트채널',
    '네이버 퍼포먼스 네트워크 > 배너 영역'
  ]
  
  const seed = (n: number, offset: number) => Math.abs(Math.sin(n * 9301 + offset * 49297) * 233280) % 1

  for (let i = 0; i < 100; i++) {
    const impressions = Math.round(20000 + seed(i, 7) * 2000000)
    const clicks = Math.round(impressions * (0.004 + seed(i, 8) * 0.06))
    const cost = Math.round(200000 + seed(i, 9) * 20000000)
    data.push({
      period: '2024-01',
      media: '네이버 성과형 DA',
      industryLarge: '제조업',
      industryMedium: '전자제품',
      industrySmall: '스마트폰',
      objective: objectives[i % objectives.length],
      pricingType: pricingTypes[i % pricingTypes.length],
      placement: placements[i % placements.length],
      impressions,
      clicks,
      cost,
      ctr: parseFloat((clicks / impressions * 100).toFixed(2)),
      cpc: Math.round(cost / (clicks || 1)),
      cpm: parseFloat((cost / impressions * 1000).toFixed(1)),
      vtr: parseFloat((seed(i, 12) * 60).toFixed(1))
    })
  }
  return data
}

// 기본 샘플 데이터 생성 함수 (하위 호환성)
export const generateSampleData = generateMetaSampleData

// 매체별 광고상품 데이터 구조
export interface AdProductOption {
  label: string
  id: string
}

export interface AdProductField {
  label: string
  key: string
  required: boolean
  options: string[] | AdProductOption[]
}

export interface MediaAdProductStructure {
  fields: AdProductField[]
}

// Meta 광고상품 구조
export const metaAdProductStructure: MediaAdProductStructure = {
  fields: [
    {
      label: '캠페인 목표',
      key: 'campaignObjective',
      required: true,
      options: [...metaCampaignObjectives]
    },
    {
      label: '구매 유형',
      key: 'buyingType',
      required: false,
      options: ['경매', '예약']
    },
    {
      label: '플랫폼',
      key: 'platform',
      required: false,
      options: [...metaPlatforms]
    },
    {
      label: '성과 목표',
      key: 'performanceGoal',
      required: false,
      options: [...metaPerformanceGoals]
    }
  ]
}

// Google Ads 광고상품 구조
export const googleAdProductStructure: MediaAdProductStructure = {
  fields: [
    {
      label: '캠페인 유형',
      key: 'campaignType',
      required: true,
      options: [
        '실적 최대화',
        '디맨드젠 캠페인',
        '동영상',
        '디스플레이',
        '앱'
      ]
    },
    {
      label: '캠페인 하위 유형',
      key: 'campaignSubType',
      required: false,
      options: [
        '건너뛸 수 없음',
        '광고 순서',
        '앱 설치',
        '앱 참여',
        '아웃스트림',
        '스마트 디스플레이 캠페인',
        '전환 유도',
        '타겟 게재빈도',
        '지정되지 않음'
      ]
    },
    {
      label: '입찰 전략',
      key: 'biddingStrategy',
      required: false,
      options: [
        '고정 CPM',
        '수동 CPC',
        '전환 가치 극대화',
        '전환수 최대화',
        '조회 가능 CPM',
        '최대 CPV',
        '클릭수 최대화',
        '타겟 광고 투자수익(ROAS)',
        '타겟 CPA',
        '타겟 CPM',
        '타겟 CPV'
      ]
    },
    {
      label: '광고그룹 유형',
      key: 'adGroupType',
      required: false,
      options: [
        '건너뛸 수 없는 인스트림',
        '건너뛸 수 있는 인스트림',
        '디스플레이',
        '마스트헤드',
        '반응형 동영상 광고',
        '범퍼',
        '아웃스트림',
        '인피드 광고 동영상',
        '효율적 잠재고객 도달',
        '지정되지 않음'
      ]
    },
    {
      label: '광고 유형',
      key: 'adType',
      required: false,
      options: [
        '건너뛸 수 없는 인스트림 광고',
        '건너뛸 수 있는 인스트림 광고',
        '디맨드젠 캐러셀 광고',
        '디맨드젠 제품 광고',
        '디맨드젠 이미지 광고',
        '디맨드젠 동영상 광고',
        '반응형 이미지 광고',
        '반응형 동영상 광고',
        '범퍼 광고',
        '아웃스트림 광고',
        '앱 참여 광고',
        '앱 설치 광고',
        '이미지 광고',
        '인피드 동영상 광고',
        '마스트헤드 광고',
        'HTML5 광고'
      ]
    }
  ]
}

// 카카오 광고상품 구조
export const kakaoAdProductStructure: MediaAdProductStructure = {
  fields: [
    {
      label: '광고 목표',
      key: 'campaignObjective',
      required: true,
      options: ['전환', '방문', '도달', '조회']
    },
    {
      label: '광고 유형',
      key: 'campaignType',
      required: false,
      options: [
        '디스플레이',
        '포커스 풀뷰',
        '포커스 보드',
        '리치팝 올데이',
        '상품 카탈로그',
        '프로필 풀뷰',
        '스폰서드 보드',
        '카카오톡비즈보드',
        '카카오 비즈보드 CPT',
        '카카오톡 채널',
        '동영상'
      ]
    },
    {
      label: '광고 목표 설정',
      key: 'objectiveType',
      required: false,
      options: ['픽셀&SDK', '카카오톡채널', '카탈로그 광고 최적화']
    },
    {
      label: '입찰 방식',
      key: 'pricingType',
      required: false,
      options: ['CPC', 'CPA', 'CPM', 'CPT', 'CPMS', 'CPV']
    },
    {
      label: '소재 유형',
      key: 'adFormat',
      required: false,
      options: [
        '이미지 카탈로그',
        '이미지 배너',
        '이미지 네이티브',
        '비디오 네이티브',
        '리치 네이티브',
        '다이나믹 카탈로그',
        '콘텐츠',
        '기본 텍스트',
        '캐러셀 커머스',
        '캐러셀 피드',
        '프리미엄 동영상',
        '와이드 리스트',
        '와이드 이미지'
      ]
    }
  ]
}

// 네이버 GFA 광고상품 구조
export const naverGfaAdProductStructure: MediaAdProductStructure = {
  fields: [
    {
      label: '캠페인 목적',
      key: 'campaignObjective',
      required: true,
      options: [
        '쇼핑 프로모션',
        '앱 전환',
        '웹사이트 전환',
        '인지도 및 트래픽',
        '참여 유도',
        '동영상 조회',
        '카탈로그 판매'
      ]
    },
    {
      label: '청구 기준',
      key: 'pricingType',
      required: false,
      options: ['CPC', 'CPM', 'CPV']
    },
    {
      label: '게재 위치',
      key: 'placement',
      required: false,
      options: [
        '네이버 > 배너 영역 > 네이버 메인',
        '네이버 > 배너 영역 > 서비스 통합',
        '네이버 > 쇼핑 영역',
        '네이버 패밀리 매체 > 배너 영역',
        '네이버 > 커뮤니케이션 영역',
        '네이버 > 피드 영역',
        '네이버 패밀리 매체 > 스마트채널',
        '네이버 패밀리 매체 > 피드 영역',
        '네이버 > 스마트채널',
        '네이버 퍼포먼스 네트워크 > 배너 영역',
        '네이버 퍼포먼스 네트워크 > 스마트채널',
        '네이버 > 인스트림 영역'
      ]
    }
  ]
}

// 네이버 NOSP 광고상품 구조
export const naverNospAdProductStructure: MediaAdProductStructure = {
  fields: [
    {
      label: '광고상품명',
      key: 'productName',
      required: true,
      options: [
        { label: '[SA100001] M_메인_브랜딩DA', id: 'SA100001' },
        { label: '[SA100002] M_메인_브랜딩DA_아웃스트림동영상', id: 'SA100002' },
        { label: '[SA100003] M_메인_스페셜DA', id: 'SA100003' },
        { label: '[SA100004] M_메인_타임보드', id: 'SA100004' },
        { label: '[SA100005] M_메인_롤링보드', id: 'SA100005' },
        { label: '[SA100006] M_서브_브랜딩DA', id: 'SA100006' },
        { label: '[SA100007] M_서브_스페셜DA', id: 'SA100007' },
        { label: '[SA100008] PC_메인_브랜딩DA', id: 'SA100008' },
        { label: '[SA100009] PC_메인_타임보드', id: 'SA100009' },
        { label: '[SA100010] PC_메인_롤링보드', id: 'SA100010' },
        { label: '[SA100011] PC_메인_스페셜DA', id: 'SA100011' },
        { label: '[SA100012] PC_서브_브랜딩DA', id: 'SA100012' },
        { label: '[SA100013] PC_서브_스페셜DA', id: 'SA100013' },
        { label: '[SA100014] M_뉴스_브랜딩DA', id: 'SA100014' },
        { label: '[SA100015] PC_뉴스_브랜딩DA', id: 'SA100015' },
        { label: '[SA100016] M_스포츠_브랜딩DA', id: 'SA100016' },
        { label: '[SA100017] PC_스포츠_브랜딩DA', id: 'SA100017' },
        { label: '[SA100018] M_연예_브랜딩DA', id: 'SA100018' },
        { label: '[SA100019] PC_연예_브랜딩DA', id: 'SA100019' },
        { label: '[SA100020] M_쇼핑_브랜딩DA', id: 'SA100020' },
      ] as AdProductOption[]
    },
    {
      label: '상품 유형',
      key: 'productType',
      required: false,
      options: ['배너_이미지_확장형', '배너_이미지형']
    },
    {
      label: '과금 유형',
      key: 'chargeType',
      required: false,
      options: ['CPM', 'CPT']
    }
  ]
}

// TikTok 광고상품 구조
export const tiktokAdProductStructure: MediaAdProductStructure = {
  fields: [
    {
      label: '목표',
      key: 'objective',
      required: true,
      options: ['커뮤니티 상호작용', '리드 생성', '도달', '동영상 조회', '트래픽', '브랜드 고려 단계', '앱 프로모션', '웹사이트 전환', '판매']
    },
    {
      label: '최적화 목표',
      key: 'optimizationGoal',
      required: false,
      options: ['클릭', '전환', '설치', '인앱 이벤트', '가치', '도달', '팔로워', '양식 제출', '랜딩 페이지 조회', 'TikTok 페이지 방문', '6초 조회수', '15초 조회수', '참여 세션', '고려 단계 시청자 확보']
    },
    {
      label: '게재 위치',
      key: 'placement',
      required: false,
      options: ['TikTok', 'Pangle', '글로벌 앱 번들']
    },
    {
      label: '광고 형식',
      key: 'adFormat',
      required: false,
      options: ['동영상', '캐러셀 애즈', '카탈로그 애즈', '이미지']
    }
  ]
}

// 매체별 광고상품 구조 매핑
export const adProductStructureByMedia: { [media: string]: MediaAdProductStructure } = {
  'Meta': metaAdProductStructure,
  'Google Ads': googleAdProductStructure,
  'kakao모먼트': kakaoAdProductStructure,
  '네이버 성과형 DA': naverGfaAdProductStructure,
  '네이버 보장형 DA': naverNospAdProductStructure,
  'TikTok': tiktokAdProductStructure
}

// 하위 호환성을 위한 기존 데이터 유지
export const metaAdProducts = {
  campaignObjectives: metaAdProductStructure.fields[0].options,
  buyingTypes: metaAdProductStructure.fields[1].options,
  platforms: metaAdProductStructure.fields[2].options,
  performanceGoals: metaAdProductStructure.fields[3].options
}
