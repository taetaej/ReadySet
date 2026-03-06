// DataShot 타입 정의

export type DatasetStatus = '대기중' | '추출중' | '완료' | '실패' | '만료'

export interface Dataset {
  id: string
  name: string
  description?: string
  slotId: string
  slotName: string
  advertiser: string
  
  // 조회 조건
  media: string // 매체 (단일)
  industries: string[] // 업종 (다중)
  period: {
    start: string // yy-mm
    end: string // yy-mm
  }
  products: string[] // 광고상품 (다중)
  metrics: string[] // 지표 (다중)
  targetingOptions?: string[] // 타겟팅 옵션 (선택)
  
  // 메타 정보
  status: DatasetStatus
  creator: string
  createdAt: string
  rowCount?: number // 전체 행 수
  
  // 파일 정보
  fullFileSize?: number // bytes
  previewFileSize?: number // bytes
}

export interface DatasetFormData {
  name: string
  description: string
  media: string
  industries: string[]
  period: {
    start: string
    end: string
  }
  products: string[]
  metrics: string[]
  targetingOptions: string[]
}

// 매체 옵션
export const MEDIA_OPTIONS = [
  { value: 'google', label: 'Google Ads' },
  { value: 'meta', label: 'Meta' },
  { value: 'kakao', label: '모먼트' },
  { value: 'naver_gfa', label: 'GFA' },
  { value: 'naver_nosp', label: 'NOSP' },
  { value: 'tiktok', label: '틱톡' }
]

// 업종 옵션 (예시)
export const INDUSTRY_OPTIONS = [
  { value: 'finance', label: '금융' },
  { value: 'automotive', label: '자동차' },
  { value: 'retail', label: '유통' },
  { value: 'food', label: '식음료' },
  { value: 'tech', label: 'IT/기술' }
]

// 지표 옵션 (예시)
export const METRIC_OPTIONS = [
  { value: 'impressions', label: '노출수' },
  { value: 'clicks', label: '클릭수' },
  { value: 'cost', label: '광고비' },
  { value: 'ctr', label: 'CTR' },
  { value: 'cpc', label: 'CPC' },
  { value: 'cpm', label: 'CPM' }
]
