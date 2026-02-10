// Scenario 관련 타입 정의

export interface ScenarioFormData {
  // 공통 속성 (Step 1)
  scenarioName: string
  description: string
  moduleType: 'Ratio Finder' | 'Reach Predictor' | ''
  brand: string
  industry: string
  period: { start: string; end: string }
  targetGrp: string[]
  
  // Ratio Finder 특화 (Step 2)
  totalBudget?: number
  budgetDistribution?: {
    [mediaKey: string]: {
      ratio: number
      products: {
        [productKey: string]: number
      }
    }
  }
  simulationUnit?: '5%' | '10%' | '20%' | ''
  
  // Reach Predictor 특화 (Step 2)
  mediaBudget?: any
  targeting?: any
  reachCurve?: {
    budgetCap?: number // 예산 상한 (천원)
    detailSettings?: {
      rangeMin?: number // 구간 최소값 (천원)
      rangeMax?: number // 구간 최대값 (천원)
      criteriaType?: 'count' | 'amount' // 구간 수 기준 or 구간별 금액 기준
      intervalCount?: number // 구간 수 (1-20)
      intervalAmount?: number // 구간별 금액 (천원)
    }
  }
}

export interface ReachPredictorMedia {
  id: string
  category: 'DIGITAL' | 'TVC'
  type: 'linked' | 'unlinked'
  mediaName: string
  productName?: string
  budget: string
  impressions: string
  cpm: string
  customPeriod?: { start: string; end: string }
  customTarget?: string[]
}

export interface Brand {
  name: string
  industry: string
}

export interface TargetGrpOptions {
  male: string[]
  female: string[]
}
