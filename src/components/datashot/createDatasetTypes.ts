// 광고상품 기준: 매체별 선택된 상품 목록
export interface MediaProductSelection {
  [media: string]: string[]
}

export interface FormData {
  datasetName: string
  description: string
  purpose: 'internal' | 'external' | ''
  // 추출 기준: 'product'(광고상품) | 'condition'(조건 조합). '' = 미선택
  extractMode: 'product' | 'condition' | ''
  media: string
  // 광고상품 기준(extractMode='product') 전용: 매체별 상품 + 공통/매체 지표
  mediaProducts: MediaProductSelection
  productMetrics: string[]
  // 광고상품 기준 + Meta 단일 선택 시: 협력 광고 파트너사
  productCollaborativePartners: string[]
  industries: string[]
  industryLevel: 'major' | 'mid' | 'minor' | null
  period: {
    startYear: string
    startMonth: string
    endYear: string
    endMonth: string
  }
  periodType: 'month' | 'quarter'
  products: string[]
  metrics: string[]
  targetingCategory: string
  targetingOptions: string[]
}

export const initialFormData: FormData = {
  datasetName: '',
  description: '',
  purpose: '',
  extractMode: '',
  media: '',
  mediaProducts: {},
  productMetrics: [],
  productCollaborativePartners: [],
  industries: [],
  industryLevel: null,
  period: { startYear: '', startMonth: '', endYear: '', endMonth: '' },
  periodType: 'month',
  products: [],
  metrics: [],
  targetingCategory: '',
  targetingOptions: [],
}

export function validateDateRange(formData: FormData, validationActive: boolean) {
  if (validationActive) {
    if (!formData.period.startYear || !formData.period.startMonth ||
        !formData.period.endYear || !formData.period.endMonth) {
      return { valid: false, message: '조회기간을 선택해주세요.' }
    }
  } else {
    if (!formData.period.startYear || !formData.period.startMonth ||
        !formData.period.endYear || !formData.period.endMonth) {
      return { valid: true, message: '' }
    }
  }
  const multiplier = formData.periodType === 'quarter' ? 3 : 1
  const startTotal = parseInt(formData.period.startYear) * 12 + (parseInt(formData.period.startMonth) - 1) * multiplier
  const endTotal = parseInt(formData.period.endYear) * 12 + (parseInt(formData.period.endMonth) - 1) * multiplier
  if (endTotal < startTotal) return { valid: false, message: '종료일은 시작일보다 이후여야 합니다.' }
  if (endTotal - startTotal > 24) return { valid: false, message: '조회기간은 최대 2년까지 설정 가능합니다.' }
  return { valid: true, message: '' }
}
