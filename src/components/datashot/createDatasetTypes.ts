export interface FormData {
  datasetName: string
  description: string
  media: string
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
  media: '',
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
