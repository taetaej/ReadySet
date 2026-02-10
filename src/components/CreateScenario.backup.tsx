import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, ArrowRight, Scale, Target, X, Clock, Info, CheckCircle, AlertCircle } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { AppLayout } from './layout/AppLayout'

interface CreateScenarioProps {
  slotData?: any
}

interface ScenarioFormData {
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
  reachCurve?: any
}

// 매체 데이터 구조
const mediaData = {
  DIGITAL: {
    'Google Ads': [
      '범퍼애드_CPM',
      '인피드 동영상 광고_CPV',
      '디맨드젠 이미지 광고_CPA',
      '디맨드젠 이미지 광고_CPC',
      '디맨드젠 동영상 광고_CPC',
      '일반 디스플레이 광고_CPA',
      '일반 디스플레이 광고_CPC',
      '일반 디스플레이 광고_CPM',
      '트루뷰 인스트림_CPV',
      '반응형 디스플레이 광고_CPA',
      '반응형 디스플레이 광고_CPC',
      '트루뷰 포 리치_CPM',
      '비디오 액션 캠페인_CPA',
      '비디오 뷰 캠페인(VVC 2.0)_CPV',
      '건너뛸 수 없는 인스트림 광고_CPM',
      '비디오 리치 캠페인 (VRC) 2.0_CPM'
    ],
    'Meta': [
      '경매_인지도_노출_instagram',
      '경매_인지도_ThruPlay 조회 극대화_instagram',
      '경매_트래픽_링크 클릭수 극대화_facebook',
      '경매_참여_ThruPlay 조회 극대화_instagram',
      '경매_트래픽_링크 클릭수 극대화_instagram',
      '경매_인지도_일일 고유 도달 극대화_instagram',
      '경매_판매_앱 이벤트 수 극대화_instagram',
      '경매_참여_게시물 참여 극대화_instagram',
      '경매_트래픽_랜딩 페이지 조회수 극대화_instagram',
      '경매_인지도_ThruPlay 조회 극대화_facebook&instagram',
      '경매_트래픽_링크 클릭수 극대화_facebook&instagram',
      '경매_참여_앱 이벤트 수 극대화_instagram',
      '경매_트래픽_Instagram 프로필 방문 수 극대화_instagram',
      '경매_판매_앱 이벤트 수 극대화_facebook&instagram',
      '경매_인지도_동영상 연속 2초 이상 재생 극대화_instagram'
    ],
    'NAVER 보장형 DA': [
      'SPM_메인_브랜딩DA(420)_배너_이미지형_CPM',
      'SPM_신제품검색_검색_이미지형_CPT',
      'SPM_스노우_스플래시(CPM)_배너_이미지형(신)_CPM',
      'SPM_브랜드검색_라이트형(신)_검색_이미지_썸네일형_CPT',
      'SPP_서칭뷰(신)_검색_동영상형_CPT',
      'SPM_인플루언서_프리미엄DA_배너_이미지형_CPM',
      'SPP_브랜드검색_라이트형(신)_검색_이미지형_CPT',
      'SPM_메인_스마트채널_배너_이미지(160)형_CPM',
      'SPM_메인_스마트채널_배너_동영상_확장형_CPM',
      'SPM_웹툰_논스킵AD_동영상(신)_풀스크린_동영상형_CPM',
      'SPM_메인_스페셜DA(신)_배너_이미지형_CPT',
      'SPP_브랜드검색_프리미엄형(신)_검색_동영상형_CPT',
      'SPP_메인_타임보드(신)_배너_동영상_확장형_CPT',
      'SPM_브랜드검색_리미티드형_컴박스_검색_일반형_CPT',
      'SPM_통합_DA (신)_배너_이미지형_CPM',
      'SPM_지도_앱_스플래시(1주)_배너_이미지_특수형_CPT',
      'SPP_메인_타임보드(신)_배너_이미지형(신)_CPT',
      'SPM_브랜드검색_라이트형(신)_검색_이미지_좌측형_CPT',
      'SPP_브랜드검색_프리미엄형(신)_검색_이미지형_CPT',
      'SPM_웹툰_빅배너_통합(신)_배너_동영상_Autoplay(16:9)형_CPM',
      'SPPM_치지직_인스트림_15초 SKIP(신)_동영상_15초 SKIP형_CPM',
      'SPP_메인_하단(좌)_제휴(신)_배너_이미지형_CPT',
      'SPM_지도_앱_스마트채널(검색대기)(1주)_배너_이미지형_CPT',
      'SPP_메인_하단(중)_제휴(신)_배너_이미지형_CPT',
      'SPM_브랜드검색_브랜드추천형(프리미엄)_검색_프리미엄형_CPT',
      'SPP_메인_롤링보드(신)_배너_이미지형(신)_CPM',
      'SPP_메인_타임보드(비보장)_배너_이미지형(신)_CPM',
      'SPM_브랜드검색_프리미엄형(신)_검색_프리미엄형_CPT',
      'SPM_메인_브랜딩DA_아웃스트림동영상_네이티브_동영상_AutoPlay(16:9형)_CPM',
      'SPM_웹툰_빅배너_통합(신)_배너_이미지형_CPM'
    ],
    'NAVER 성과형 DA': [
      '디스플레이_방문_CPC',
      '카카오톡비즈보드_방문_CPC',
      '디스플레이_전환_픽셀&SDK_CPC',
      '카카오톡비즈보드_전환_픽셀&SDK_CPC'
    ],
    '카카오모먼트': [
      '디스플레이_방문_CPC',
      '카카오톡비즈보드_방문_CPC',
      '디스플레이_전환_픽셀&SDK_CPC',
      '카카오톡비즈보드_전환_픽셀&SDK_CPC'
    ],
    'GFA': [
      '동영상 조회_피드 영역_CPV',
      '인지도 및 트래픽_밴드_CPC',
      '동영상 조회_네이버 메인_CPV',
      '웹사이트 전환_밴드_CPC',
      '인지도 및 트래픽_피드 영역_CPC',
      '인지도 및 트래픽_네이버 메인_CPC',
      '웹사이트 전환_피드 영역_CPC',
      '웹사이트 전환_네이버 메인_CPC',
      '인지도 및 트래픽_스마트 채널_CPC',
      '카탈로그 판매_서비스 통합_CPC',
      '웹사이트 전환_스마트 채널_CPC',
      '인지도 및 트래픽_커뮤니케이션 영역_CPC',
      '인지도 및 트래픽_서비스 통합_CPC',
      '쇼핑 프로모션_서비스 통합_CPC',
      '웹사이트 전환_서비스 통합_CPC'
    ],
    'TargetPick': [
      'TargetPick (띠배너)',
      'TargetPick (전면배너)',
      'TargetPick Native (전면배너)',
      'TargetPick Video',
      'TargetPick (6초)'
    ]
  },
  TV: {
    '지상파': ['KBS2', 'MBC', 'SBS'],
    '종편': ['채널A', 'JTBC', 'MBN', 'TV 조선'],
    'CJ ENM': [
      'tvN', 'tvN STORY', 'tvN SHOW', 'OCN', 'Mnet',
      'tvN DRAMA', 'OCN Movie', 'OCN Movie2', 'Tooniverse',
      'tvN Sports', '중화 TV'
    ]
  }
}

// 미연동 매체 목록
const unlinkedMedia = [
  'SMR', '11번가', 'CJ ONE', 'L.POINT', 'OK캐쉬백', 'SOOP', 'X(구.트위터)',
  '골프존', '네이트', '넷플릭스', '다나와', '당근', '리멤버', '마이클',
  '배달의민족', '블라인드', '스노우', '스카이스캐너', '알바몬', '에브리타임',
  '에이블리', '엔카', '오늘의집', '웨이브', '잡코리아', '직방', '치지직',
  '카카오 T', '카카오뱅크', '카카오페이', '카카오페이지', '쿠팡', '토스',
  '티맵', '티빙', '틱톡', '페이코', '해피포인트'
]

// 샘플 브랜드 데이터 (실제로는 Slot의 광고주에 연결된 브랜드들)
const sampleBrands = [
  { name: '갤럭시', industry: '전자/IT' },
  { name: 'QLED TV', industry: '전자/IT' },
  { name: '비스포크', industry: '가전' },
  { name: '그램', industry: '전자/IT' },
  { name: '올레드 TV', industry: '전자/IT' },
  { name: '아이오닉', industry: '자동차' },
  { name: '쏘나타', industry: '자동차' },
  { name: '네이버페이', industry: '금융/핀테크' },
  { name: '카카오톡', industry: '소셜/메신저' }
]

// 타겟 GRP 옵션
const targetGrpOptions = {
  male: [
    '남성 7~12세', '남성 13~18세', '남성 19~24세', '남성 25~29세',
    '남성 30~34세', '남성 35~39세', '남성 40~44세', '남성 45~49세',
    '남성 50~54세', '남성 55~59세', '남성 60~69세', '남성 70~79세'
  ],
  female: [
    '여성 7~12세', '여성 13~18세', '여성 19~24세', '여성 25~29세',
    '여성 30~34세', '여성 35~39세', '여성 40~44세', '여성 45~49세',
    '여성 50~54세', '여성 55~59세', '여성 60~69세', '여성 70~79세'
  ]
}

export function CreateScenario({ slotData }: CreateScenarioProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })
  const [formData, setFormData] = useState<ScenarioFormData>({
    scenarioName: '',
    description: '',
    moduleType: '',
    brand: '',
    industry: '',
    period: { start: '', end: '' },
    targetGrp: [],
    simulationUnit: ''
  })
  
  const [brandSearchQuery, setBrandSearchQuery] = useState('')
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
  const [targetGrpDialogOpen, setTargetGrpDialogOpen] = useState(false)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  const [allSlotsExpanded, setAllSlotsExpanded] = useState(true)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  
  // 매체별 예산 배분 관련 state
  const [selectedMediaCategory, setSelectedMediaCategory] = useState<'DIGITAL' | 'TV'>('DIGITAL')
  const [selectedMedia, setSelectedMedia] = useState<string[]>([])
  const [expandedMedia, setExpandedMedia] = useState<string[]>([])
  const [productSelectionDialog, setProductSelectionDialog] = useState<{
    open: boolean
    mediaName: string
    selectedProducts: string[]
  }>({ open: false, mediaName: '', selectedProducts: [] })
  const [productSearchQuery, setProductSearchQuery] = useState('')
  const [mediaRatios, setMediaRatios] = useState<{ [key: string]: number }>({})
  const [productRatios, setProductRatios] = useState<{ [mediaKey: string]: { [productKey: string]: number } }>({})
  
  // Step 3 확인 체크박스
  const [isConfirmed, setIsConfirmed] = useState(false)
  
  // 유효성 검사 활성화 상태 (사용자가 입력을 시작했는지)
  const [validationActive, setValidationActive] = useState(false)
  
  // 토스트 알림
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Reach Predictor 매체 설정 관련 state
  const [reachPredictorMedia, setReachPredictorMedia] = useState<Array<{
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
  }>>([])
  const [rpMediaSelectionDialog, setRpMediaSelectionDialog] = useState(false)
  const [rpMediaSearchQuery, setRpMediaSearchQuery] = useState('')
  const [rpSelectedProducts, setRpSelectedProducts] = useState<{
    [key: string]: string[] // mediaName: [productNames]
  }>({})
  const [rpExpandedMedia, setRpExpandedMedia] = useState<string[]>([])
  const [rpPeriodDialog, setRpPeriodDialog] = useState<{
    open: boolean
    mediaId: string | null
    isBulk: boolean
  }>({ open: false, mediaId: null, isBulk: false })
  const [rpTargetDialog, setRpTargetDialog] = useState<{
    open: boolean
    mediaId: string | null
    isBulk: boolean
  }>({ open: false, mediaId: null, isBulk: false })
  const [rpTempPeriod, setRpTempPeriod] = useState<{ start: string; end: string }>({ start: '', end: '' })
  const [rpTempTarget, setRpTempTarget] = useState<string[]>([])
  const [rpPeriodStartOpen, setRpPeriodStartOpen] = useState(false)
  const [rpPeriodEndOpen, setRpPeriodEndOpen] = useState(false)

  // 다크모드 적용
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])
  
  // 유효성 검사 활성화 감지 (사용자가 입력을 시작하면 활성화)
  useEffect(() => {
    if (!validationActive) {
      const hasAnyInput = !!(
        formData.scenarioName ||
        formData.description ||
        formData.moduleType ||
        formData.brand ||
        formData.period.start ||
        formData.period.end ||
        formData.targetGrp.length > 0 ||
        formData.totalBudget ||
        formData.simulationUnit ||
        selectedMedia.length > 0
      )
      if (hasAnyInput) {
        setValidationActive(true)
      }
    }
  }, [formData, selectedMedia, validationActive])
  
  // Step 3에 도달하면 자동으로 확인 처리
  useEffect(() => {
    if (currentStep === 3) {
      setIsConfirmed(true)
    }
  }, [currentStep])

  const steps = [
    { number: 1, title: '기본 정보', description: '시나리오 기본 설정' },
    { number: 2, title: '상세 설정', description: '모듈별 특화 설정' },
    { number: 3, title: '검토 및 실행', description: '설정 확인 및 실행' }
  ]
  
  const filteredBrands = sampleBrands.filter(brand =>
    brand.name.toLowerCase().includes(brandSearchQuery.toLowerCase())
  )
  
  const handleBrandSelect = (brand: typeof sampleBrands[0]) => {
    setFormData({ ...formData, brand: brand.name, industry: brand.industry })
    setBrandDropdownOpen(false)
    setBrandSearchQuery('')
  }
  
  const toggleTargetGrp = (target: string) => {
    if (formData.targetGrp.includes(target)) {
      setFormData({ ...formData, targetGrp: formData.targetGrp.filter(t => t !== target) })
    } else {
      setFormData({ ...formData, targetGrp: [...formData.targetGrp, target] })
    }
  }
  
  const selectAllMale = () => {
    const allMale = targetGrpOptions.male
    const hasAllMale = allMale.every(t => formData.targetGrp.includes(t))
    if (hasAllMale) {
      setFormData({ ...formData, targetGrp: formData.targetGrp.filter(t => !allMale.includes(t)) })
    } else {
      const newTargets = [...new Set([...formData.targetGrp, ...allMale])]
      setFormData({ ...formData, targetGrp: newTargets })
    }
  }
  
  const selectAllFemale = () => {
    const allFemale = targetGrpOptions.female
    const hasAllFemale = allFemale.every(t => formData.targetGrp.includes(t))
    if (hasAllFemale) {
      setFormData({ ...formData, targetGrp: formData.targetGrp.filter(t => !allFemale.includes(t)) })
    } else {
      const newTargets = [...new Set([...formData.targetGrp, ...allFemale])]
      setFormData({ ...formData, targetGrp: newTargets })
    }
  }

  // 숫자를 한글로 변환
  const numberToKorean = (num: number): string => {
    if (num === 0) return ''
    
    const koreanNumbers = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
    const units = ['', '만', '억', '조']
    const smallUnits = ['', '십', '백', '천']
    
    let result = ''
    let unitIndex = 0
    
    while (num > 0) {
      const part = num % 10000
      if (part > 0) {
        let partStr = ''
        let tempPart = part
        let smallUnitIndex = 0
        
        while (tempPart > 0) {
          const digit = tempPart % 10
          if (digit > 0) {
            // 1은 십백천 앞에서 생략, 만억조 앞에서는 표시
            if (digit === 1 && smallUnitIndex > 0) {
              partStr = smallUnits[smallUnitIndex] + partStr
            } else {
              partStr = koreanNumbers[digit] + smallUnits[smallUnitIndex] + partStr
            }
          }
          tempPart = Math.floor(tempPart / 10)
          smallUnitIndex++
        }
        
        result = partStr + units[unitIndex] + result
      }
      num = Math.floor(num / 10000)
      unitIndex++
    }
    
    return result + '원'
  }

  // 키보드 네비게이션 핸들러
  const handleRatioKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const inputs = Array.from(document.querySelectorAll('input[data-ratio-input]')) as HTMLInputElement[]
      const currentIndex = inputs.indexOf(e.currentTarget)
      
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        inputs[currentIndex - 1]?.focus()
      } else if (e.key === 'ArrowDown' && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1]?.focus()
      }
    }
  }

  // 매체 비중 합계 검증
  const getMediaRatioValidation = () => {
    const total = Object.values(mediaRatios).reduce((sum, val) => sum + val, 0)
    const isValid = total === 100
    return {
      total,
      isValid,
      message: isValid ? '✓ 비중 합계가 정확합니다' : `비중 합계가 ${total}%입니다. 100%로 맞춰주세요.`
    }
  }

  // 상품 비중 합계 검증
  const getProductRatioValidation = (mediaKey: string) => {
    const total = Object.values(productRatios[mediaKey] || {}).reduce((sum, val) => sum + val, 0)
    const isValid = total === 100
    return {
      total,
      isValid,
      message: isValid ? '✓ 비중 합계가 정확합니다' : `비중 합계가 ${total}%입니다. 100%로 맞춰주세요.`
    }
  }

  // Step 1 유효성 검사
  const isStep1Valid = () => {
    return !!(
      formData.scenarioName &&
      formData.moduleType &&
      formData.brand &&
      formData.industry &&
      formData.period.start &&
      formData.period.end &&
      formData.targetGrp.length > 0
    )
  }

  // Step 2 유효성 검사
  const isStep2Valid = () => {
    if (formData.moduleType !== 'Ratio Finder') return true
    
    // 총 예산 확인
    if (!formData.totalBudget || formData.totalBudget <= 0) return false
    
    // 시뮬레이션 단위 확인
    if (!formData.simulationUnit) return false
    
    // DIGITAL과 TVC 각각 최소 1개씩 선택 확인
    const digitalMedia = selectedMedia.filter(m => m.startsWith('DIGITAL'))
    const tvcMedia = selectedMedia.filter(m => m.startsWith('TV'))
    if (digitalMedia.length === 0 || tvcMedia.length === 0) return false
    
    // 모든 매체에 상품이 선택되었는지 확인
    const allMediaHaveProducts = selectedMedia.every(mediaKey => {
      const products = productRatios[mediaKey]
      return products && Object.keys(products).length > 0
    })
    if (!allMediaHaveProducts) return false
    
    // 각 매체의 상품 비중 합계가 100%인지 확인
    const allProductRatiosValid = selectedMedia.every(mediaKey => {
      const validation = getProductRatioValidation(mediaKey)
      return validation.isValid
    })
    if (!allProductRatiosValid) return false
    
    // DIGITAL과 TVC 각각 비중 합계가 100%인지 확인
    const digitalTotal = digitalMedia.reduce((sum, mediaKey) => sum + (mediaRatios[mediaKey] || 0), 0)
    const tvcTotal = tvcMedia.reduce((sum, mediaKey) => sum + (mediaRatios[mediaKey] || 0), 0)
    if (digitalTotal !== 100 || tvcTotal !== 100) return false
    
    return true
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 시나리오 생성 로직
      console.log('시나리오 생성:', formData)
      
      // 성공 시
      setShowToast({ 
        type: 'success', 
        message: '시나리오 생성 요청이 완료되었습니다. 완료 시 알림 센터에서 알려드립니다.' 
      })
      
      setTimeout(() => {
        navigate('/reachcaster')
      }, 2000)
      
    } catch (error) {
      // 실패 시
      setShowToast({ 
        type: 'error', 
        message: '시나리오 생성 요청에 실패했습니다. 다시 시도해주세요.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppLayout
      currentView="createScenario"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', onClick: () => navigate('/slotboard') },
        { label: slotData?.title || 'Slot', onClick: () => navigate('/reachcaster') },
        { label: '새 시나리오 생성' }
      ]}
      isDarkMode={isDarkMode}
      onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      sidebarProps={{
        allSlotsExpanded: allSlotsExpanded,
        expandedFolders: expandedFolders,
        onToggleAllSlots: () => setAllSlotsExpanded(!allSlotsExpanded),
        onToggleFolder: (folderId: string) => {
          setExpandedFolders(prev => 
            prev.includes(folderId) 
              ? prev.filter(id => id !== folderId)
              : [...prev, folderId]
          )
        },
        onNavigateToWorkspace: () => navigate('/slotboard')
      }}
    >
      <div style={{
        padding: '32px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* 페이지 헤더 */}
        <div style={{
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            새 시나리오 생성
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'hsl(var(--muted-foreground))'
          }}>
            단계별로 시나리오 정보를 입력하고 분석을 시작하세요
          </p>
        </div>

        {/* 위자드 레이아웃 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1px 420px',
          gap: '48px',
          alignItems: 'start'
        }}>
          {/* 좌측: 스텝퍼 + 입력 폼 */}
          <div>
            {/* 미니멀 스텝퍼 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
              gap: '8px'
            }}>
              {steps.map((step, index) => (
                <div key={step.number} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {/* 스텝 표시 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backgroundColor: step.number === currentStep 
                      ? 'hsl(var(--primary))' 
                      : step.number < currentStep
                      ? 'hsl(var(--muted))'
                      : 'transparent',
                    border: step.number > currentStep ? '1px solid hsl(var(--border))' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: step.number === currentStep 
                        ? 'hsl(var(--primary-foreground))' 
                        : step.number < currentStep
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--muted))',
                      color: step.number === currentStep 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--primary-foreground))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {step.number < currentStep ? (
                        <Check size={12} />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: step.number === currentStep 
                        ? 'hsl(var(--primary-foreground))' 
                        : step.number < currentStep
                        ? 'hsl(var(--foreground))'
                        : 'hsl(var(--muted-foreground))'
                    }}>
                      {step.title}
                    </span>
                  </div>
                  
                  {/* 구분선 */}
                  {index < steps.length - 1 && (
                    <div style={{
                      width: '24px',
                      height: '1px',
                      backgroundColor: step.number < currentStep 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--border))',
                      transition: 'all 0.3s'
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* 입력 폼 영역 */}
            <div style={{
              minHeight: '500px'
            }}>
              {/* Step 1: 기본 정보 */}
              {currentStep === 1 && (
                <div style={{ width: '800px' }}>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '24px'
                  }}>
                    기본 정보
                  </h2>
                  
                  {/* 시나리오명 */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      시나리오명 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.scenarioName}
                      onChange={(e) => {
                        if (e.target.value.length <= 30) {
                          setFormData({ ...formData, scenarioName: e.target.value })
                        }
                      }}
                      placeholder="시나리오 이름을 입력하세요"
                      className="input"
                      style={{ 
                        width: '100%',
                        borderColor: validationActive && !formData.scenarioName ? 'hsl(var(--destructive))' : undefined
                      }}
                      maxLength={30}
                    />
                    {validationActive && !formData.scenarioName && (
                      <div style={{
                        fontSize: '11px',
                        color: 'hsl(var(--destructive))',
                        marginTop: '4px'
                      }}>
                        시나리오명을 입력해주세요.
                      </div>
                    )}
                    <div style={{ 
                      fontSize: '12px', 
                      color: 'hsl(var(--muted-foreground))', 
                      marginTop: '4px',
                      textAlign: 'right'
                    }}>
                      {formData.scenarioName.length}/30
                    </div>
                  </div>

                  {/* 설명 */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      설명
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => {
                        if (e.target.value.length <= 200) {
                          setFormData({ ...formData, description: e.target.value })
                        }
                      }}
                      placeholder="시나리오에 대한 설명을 입력하세요"
                      className="input"
                      style={{ 
                        width: '100%', 
                        minHeight: '80px', 
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      maxLength={200}
                    />
                    <div style={{ 
                      fontSize: '12px', 
                      color: 'hsl(var(--muted-foreground))', 
                      marginTop: '4px',
                      textAlign: 'right'
                    }}>
                      {formData.description.length}/200
                    </div>
                  </div>

                  {/* 분석 모듈 선택 */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      분석 모듈 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button
                        onClick={() => setFormData({ ...formData, moduleType: 'Ratio Finder' })}
                        style={{
                          padding: '16px',
                          border: `1px solid ${formData.moduleType === 'Ratio Finder' ? 'hsl(var(--primary))' : validationActive && !formData.moduleType ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}`,
                          borderRadius: '8px',
                          backgroundColor: formData.moduleType === 'Ratio Finder' ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: 'hsl(var(--foreground))'
                        }}>
                          <Scale size={18} style={{ color: 'hsl(var(--foreground))' }} />
                          Ratio Finder
                        </div>
                        <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                          TVC와 디지털 매체 간 최적 예산 배분 비율 탐색
                        </div>
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, moduleType: 'Reach Predictor' })}
                        style={{
                          padding: '16px',
                          border: `1px solid ${formData.moduleType === 'Reach Predictor' ? 'hsl(var(--primary))' : validationActive && !formData.moduleType ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}`,
                          borderRadius: '8px',
                          backgroundColor: formData.moduleType === 'Reach Predictor' ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: 'hsl(var(--foreground))'
                        }}>
                          <Target size={18} style={{ color: 'hsl(var(--foreground))' }} />
                          Reach Predictor
                        </div>
                        <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                          광고 집행 전후의 통합 및 개별 매체 도달률 예측
                        </div>
                      </button>
                    </div>
                    {validationActive && !formData.moduleType && (
                      <div style={{
                        fontSize: '11px',
                        color: 'hsl(var(--destructive))',
                        marginTop: '8px'
                      }}>
                        분석 모듈을 선택해주세요.
                      </div>
                    )}
                  </div>

                  {/* 브랜드 + 업종 (가로 배치) */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      브랜드 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                    </label>
                    <div style={{
                      fontSize: '12px',
                      color: 'hsl(var(--muted-foreground))',
                      marginBottom: '12px'
                    }}>
                      업종별 특화 예측 분석 모델로 시나리오를 생성합니다.
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: formData.industry ? '1fr auto' : '1fr',
                      gap: '12px',
                      alignItems: 'center',
                      position: 'relative'
                    }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          value={formData.brand || brandSearchQuery}
                          onChange={(e) => {
                            setBrandSearchQuery(e.target.value)
                            setFormData({ ...formData, brand: '', industry: '' })
                            setBrandDropdownOpen(true)
                          }}
                          onFocus={() => setBrandDropdownOpen(true)}
                          placeholder="브랜드를 검색하세요"
                          className="input"
                          style={{ 
                            width: '100%',
                            borderColor: validationActive && !formData.brand ? 'hsl(var(--destructive))' : undefined
                          }}
                        />
                        {brandDropdownOpen && (
                          <div className="dropdown" style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '4px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            zIndex: 1000
                          }}>
                            {filteredBrands.length > 0 ? (
                              filteredBrands.map((brand, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleBrandSelect(brand)}
                                  className="dropdown-item"
                                  style={{ justifyContent: 'space-between' }}
                                >
                                  <span>{brand.name}</span>
                                  <span style={{ 
                                    fontSize: '11px', 
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: 'hsl(var(--muted))',
                                    color: 'hsl(var(--muted-foreground))'
                                  }}>
                                    {brand.industry}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <div style={{ padding: '12px', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                                검색 결과가 없습니다
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {validationActive && !formData.brand && (
                        <div style={{
                          fontSize: '11px',
                          color: 'hsl(var(--destructive))',
                          marginTop: '4px',
                          gridColumn: '1 / -1'
                        }}>
                          브랜드를 선택해주세요.
                        </div>
                      )}
                      
                      {/* 업종 뱃지 (미니멀) */}
                      {formData.industry && (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: 'hsl(var(--muted))',
                          border: '1px solid hsl(var(--border))',
                          whiteSpace: 'nowrap'
                        }}>
                          <span style={{ 
                            fontSize: '11px', 
                            color: 'hsl(var(--muted-foreground))'
                          }}>
                            업종
                          </span>
                          <div style={{
                            width: '1px',
                            height: '12px',
                            backgroundColor: 'hsl(var(--border))'
                          }} />
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '500',
                            color: 'hsl(var(--foreground))'
                          }}>
                            {formData.industry}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 캠페인 기간 */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      캠페인 기간 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'end' }}>
                      {/* 시작일 */}
                      <div>
                        <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>
                          시작일
                        </div>
                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            onClick={() => setStartDateOpen(!startDateOpen)}
                            className="input"
                            style={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              borderColor: validationActive && !formData.period.start ? 'hsl(var(--destructive))' : undefined
                            }}
                          >
                            <span style={{ 
                              color: formData.period.start ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                            }}>
                              {formData.period.start ? new Date(formData.period.start).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '날짜 선택'}
                            </span>
                          </button>
                          {startDateOpen && (
                            <>
                              <div 
                                style={{
                                  position: 'fixed',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  zIndex: 999
                                }}
                                onClick={() => setStartDateOpen(false)}
                              />
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  left: 0,
                                  marginTop: '8px',
                                  zIndex: 1000,
                                  backgroundColor: 'hsl(var(--card))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px',
                                  padding: '12px',
                                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                                }}
                              >
                                <style>{`
                                  .rdp {
                                    --rdp-cell-size: 32px;
                                    --rdp-accent-color: hsl(var(--foreground));
                                    --rdp-background-color: hsl(var(--muted));
                                    margin: 0;
                                  }
                                  .rdp-months {
                                    justify-content: center;
                                  }
                                  .rdp-month {
                                    color: hsl(var(--foreground));
                                  }
                                  .rdp-caption {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    padding: 0;
                                    margin-bottom: 12px;
                                  }
                                  .rdp-caption_label {
                                    font-size: 13px;
                                    font-weight: 600;
                                  }
                                  .rdp-nav {
                                    position: absolute;
                                    top: 0;
                                    display: flex;
                                    gap: 4px;
                                  }
                                  .rdp-nav_button {
                                    width: 28px;
                                    height: 28px;
                                    border-radius: 6px;
                                    border: 1px solid hsl(var(--border));
                                    background: transparent;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                  }
                                  .rdp-nav_button:hover {
                                    background: hsl(var(--muted));
                                  }
                                  .rdp-nav_button_previous {
                                    left: 0;
                                  }
                                  .rdp-nav_button_next {
                                    right: 0;
                                  }
                                  .rdp-head_cell {
                                    color: hsl(var(--muted-foreground));
                                    font-size: 11px;
                                    font-weight: 500;
                                    text-transform: uppercase;
                                  }
                                  .rdp-cell {
                                    padding: 1px;
                                  }
                                  .rdp-day {
                                    width: 100%;
                                    height: 100%;
                                    border-radius: 6px;
                                    font-size: 12px;
                                    transition: all 0.2s;
                                    border: none;
                                    background: transparent;
                                    cursor: pointer;
                                    color: hsl(var(--foreground));
                                  }
                                  .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
                                    background: hsl(var(--muted));
                                  }
                                  .rdp-day_selected {
                                    background: hsl(var(--foreground));
                                    color: hsl(var(--background));
                                    font-weight: 600;
                                  }
                                  .rdp-day_disabled {
                                    color: hsl(var(--muted-foreground));
                                    opacity: 0.3;
                                    cursor: not-allowed;
                                  }
                                  .rdp-day_outside {
                                    color: hsl(var(--muted-foreground));
                                    opacity: 0.3;
                                  }
                                `}</style>
                                <DayPicker
                                  mode="single"
                                  selected={formData.period.start ? new Date(formData.period.start) : undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      const dateStr = date.toISOString().split('T')[0]
                                      setFormData({ ...formData, period: { ...formData.period, start: dateStr } })
                                      setStartDateOpen(false)
                                    }
                                  }}
                                  disabled={(date) => {
                                    if (formData.period.end) {
                                      return date > new Date(formData.period.end)
                                    }
                                    return false
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 화살표 */}
                      <div style={{ 
                        paddingBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ArrowRight size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
                      </div>

                      {/* 종료일 */}
                      <div>
                        <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>
                          종료일
                        </div>
                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            onClick={() => setEndDateOpen(!endDateOpen)}
                            className="input"
                            style={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              borderColor: validationActive && !formData.period.end ? 'hsl(var(--destructive))' : undefined
                            }}
                          >
                            <span style={{ 
                              color: formData.period.end ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                            }}>
                              {formData.period.end ? new Date(formData.period.end).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '날짜 선택'}
                            </span>
                          </button>
                          {endDateOpen && (
                            <>
                              <div 
                                style={{
                                  position: 'fixed',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  zIndex: 999
                                }}
                                onClick={() => setEndDateOpen(false)}
                              />
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  left: 0,
                                  marginTop: '8px',
                                  zIndex: 1000,
                                  backgroundColor: 'hsl(var(--card))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px',
                                  padding: '12px',
                                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                                }}
                              >
                                <style>{`
                                  .rdp {
                                    --rdp-cell-size: 32px;
                                    --rdp-accent-color: hsl(var(--foreground));
                                    --rdp-background-color: hsl(var(--muted));
                                    margin: 0;
                                  }
                                  .rdp-months {
                                    justify-content: center;
                                  }
                                  .rdp-month {
                                    color: hsl(var(--foreground));
                                  }
                                  .rdp-caption {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    padding: 0;
                                    margin-bottom: 12px;
                                  }
                                  .rdp-caption_label {
                                    font-size: 13px;
                                    font-weight: 600;
                                  }
                                  .rdp-nav {
                                    position: absolute;
                                    top: 0;
                                    display: flex;
                                    gap: 4px;
                                  }
                                  .rdp-nav_button {
                                    width: 28px;
                                    height: 28px;
                                    border-radius: 6px;
                                    border: 1px solid hsl(var(--border));
                                    background: transparent;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                  }
                                  .rdp-nav_button:hover {
                                    background: hsl(var(--muted));
                                  }
                                  .rdp-nav_button_previous {
                                    left: 0;
                                  }
                                  .rdp-nav_button_next {
                                    right: 0;
                                  }
                                  .rdp-head_cell {
                                    color: hsl(var(--muted-foreground));
                                    font-size: 11px;
                                    font-weight: 500;
                                    text-transform: uppercase;
                                  }
                                  .rdp-cell {
                                    padding: 1px;
                                  }
                                  .rdp-day {
                                    width: 100%;
                                    height: 100%;
                                    border-radius: 6px;
                                    font-size: 12px;
                                    transition: all 0.2s;
                                    border: none;
                                    background: transparent;
                                    cursor: pointer;
                                    color: hsl(var(--foreground));
                                  }
                                  .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
                                    background: hsl(var(--muted));
                                  }
                                  .rdp-day_selected {
                                    background: hsl(var(--foreground));
                                    color: hsl(var(--background));
                                    font-weight: 600;
                                  }
                                  .rdp-day_disabled {
                                    color: hsl(var(--muted-foreground));
                                    opacity: 0.3;
                                    cursor: not-allowed;
                                  }
                                  .rdp-day_outside {
                                    color: hsl(var(--muted-foreground));
                                    opacity: 0.3;
                                  }
                                `}</style>
                                <DayPicker
                                  mode="single"
                                  selected={formData.period.end ? new Date(formData.period.end) : undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      const dateStr = date.toISOString().split('T')[0]
                                      setFormData({ ...formData, period: { ...formData.period, end: dateStr } })
                                      setEndDateOpen(false)
                                    }
                                  }}
                                  disabled={(date) => {
                                    if (formData.period.start) {
                                      return date < new Date(formData.period.start)
                                    }
                                    return false
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {validationActive && (!formData.period.start || !formData.period.end) && (
                      <div style={{
                        fontSize: '11px',
                        color: 'hsl(var(--destructive))',
                        marginTop: '8px'
                      }}>
                        캠페인 시작일과 종료일을 모두 선택해주세요.
                      </div>
                    )}
                  </div>

                  {/* 타겟 GRP (다이얼로그) */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      타겟 GRP <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                    </label>
                    <div style={{
                      fontSize: '12px',
                      color: 'hsl(var(--muted-foreground))',
                      marginBottom: '12px',
                      lineHeight: '1.5'
                    }}>
                      도달률 산출 시 적용할 모수를 설정합니다.<br />
                      설정한 타겟 모수는 보고서의 '타겟 GRP'에 적용됩니다.
                    </div>
                    
                    <button
                      onClick={() => setTargetGrpDialogOpen(true)}
                      className="input"
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderColor: validationActive && formData.targetGrp.length === 0 ? 'hsl(var(--destructive))' : undefined
                      }}
                    >
                      <span style={{ color: formData.targetGrp.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                        {formData.targetGrp.length === 24 
                          ? '전체' 
                          : formData.targetGrp.length > 0 
                          ? `${formData.targetGrp.length}개 타겟 선택됨` 
                          : '타겟을 선택하세요'}
                      </span>
                      <ChevronRight size={16} />
                    </button>
                    {validationActive && formData.targetGrp.length === 0 && (
                      <div style={{
                        fontSize: '11px',
                        color: 'hsl(var(--destructive))',
                        marginTop: '4px'
                      }}>
                        타겟 GRP를 선택해주세요.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 타겟 GRP 다이얼로그 */}
              {targetGrpDialogOpen && (
                <div className="dialog-overlay" onClick={() => setTargetGrpDialogOpen(false)}>
                  <div 
                    className="dialog-content" 
                    onClick={(e) => e.stopPropagation()}
                    style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}
                  >
                    <div className="dialog-header">
                      <h3 className="dialog-title">타겟 GRP 선택</h3>
                      <p className="dialog-description">
                        도달률 산출에 적용할 타겟 모수를 선택하세요
                      </p>
                    </div>
                    
                    <div style={{ padding: '24px' }}>
                      {/* 남성 */}
                      <div style={{ marginBottom: '24px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '16px',
                          paddingBottom: '12px',
                          borderBottom: '1px solid hsl(var(--border))'
                        }}>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>남성</span>
                          <button
                            onClick={selectAllMale}
                            className="btn btn-ghost btn-sm"
                          >
                            {targetGrpOptions.male.every(t => formData.targetGrp.includes(t)) ? '전체 해제' : '전체 선택'}
                          </button>
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '8px'
                        }}>
                          {targetGrpOptions.male.map((target) => (
                            <label
                              key={target}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: `1px solid ${formData.targetGrp.includes(target) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                                backgroundColor: formData.targetGrp.includes(target) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                                transition: 'all 0.2s'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={formData.targetGrp.includes(target)}
                                onChange={() => toggleTargetGrp(target)}
                                className="checkbox-custom"
                              />
                              <span style={{ fontSize: '12px' }}>{target.replace('남성 ', '')}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 여성 */}
                      <div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '16px',
                          paddingBottom: '12px',
                          borderBottom: '1px solid hsl(var(--border))'
                        }}>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>여성</span>
                          <button
                            onClick={selectAllFemale}
                            className="btn btn-ghost btn-sm"
                          >
                            {targetGrpOptions.female.every(t => formData.targetGrp.includes(t)) ? '전체 해제' : '전체 선택'}
                          </button>
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '8px'
                        }}>
                          {targetGrpOptions.female.map((target) => (
                            <label
                              key={target}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: `1px solid ${formData.targetGrp.includes(target) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                                backgroundColor: formData.targetGrp.includes(target) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                                transition: 'all 0.2s'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={formData.targetGrp.includes(target)}
                                onChange={() => toggleTargetGrp(target)}
                                className="checkbox-custom"
                              />
                              <span style={{ fontSize: '12px' }}>{target.replace('여성 ', '')}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="dialog-footer">
                      <button
                        onClick={() => setTargetGrpDialogOpen(false)}
                        className="btn btn-secondary btn-md"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => setTargetGrpDialogOpen(false)}
                        className="btn btn-primary btn-md"
                      >
                        확인 ({formData.targetGrp.length}개 선택)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: 상세 설정 */}
              {currentStep === 2 && (
                <div style={{ width: '800px' }}>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '24px'
                  }}>
                    상세 설정 - {formData.moduleType}
                  </h2>
                  
                  {formData.moduleType === 'Ratio Finder' && (
                    <>
                      {/* 총 예산 */}
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '8px'
                        }}>
                          총 예산 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '200px auto 1fr', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={formData.totalBudget ? formData.totalBudget.toLocaleString('ko-KR') : ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/,/g, '')
                              if (value === '' || /^\d+$/.test(value)) {
                                setFormData({ ...formData, totalBudget: value === '' ? undefined : parseInt(value) })
                              }
                            }}
                            placeholder="예산을 입력하세요"
                            className="input"
                            style={{ 
                              width: '100%',
                              borderColor: validationActive && (!formData.totalBudget || formData.totalBudget <= 0) ? 'hsl(var(--destructive))' : undefined
                            }}
                          />
                          <span style={{ 
                            fontSize: '14px', 
                            color: 'hsl(var(--muted-foreground))',
                            whiteSpace: 'nowrap'
                          }}>
                            천원
                          </span>
                          {formData.totalBudget && formData.totalBudget > 0 && (
                            <span style={{
                              fontSize: '14px',
                              color: 'hsl(var(--foreground))',
                              fontWeight: '500'
                            }}>
                              = {numberToKorean(formData.totalBudget * 1000)}
                            </span>
                          )}
                        </div>
                        {validationActive && (!formData.totalBudget || formData.totalBudget <= 0) && (
                          <div style={{
                            fontSize: '11px',
                            color: 'hsl(var(--destructive))',
                            marginTop: '4px'
                          }}>
                            총 예산을 입력해주세요.
                          </div>
                        )}
                      </div>

                      {/* 시뮬레이션 단위 */}
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '8px'
                        }}>
                          시뮬레이션 단위 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                        </label>
                        <div style={{
                          fontSize: '12px',
                          color: 'hsl(var(--muted-foreground))',
                          marginBottom: '12px'
                        }}>
                          매체 간 예산 비중을 변화시키며 최적 배분을 탐색하는 단위입니다. 작은 값은 세밀한 결과를, 큰 값은 빠르고 간결한 결과를 제공합니다.
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                          {(['5%', '10%', '20%'] as const).map((unit) => (
                            <button
                              key={unit}
                              onClick={() => setFormData({ ...formData, simulationUnit: unit })}
                              className="btn btn-ghost"
                              style={{
                                height: '48px',
                                border: `1px solid ${
                                  formData.simulationUnit === unit 
                                    ? 'hsl(var(--primary))' 
                                    : validationActive && !formData.simulationUnit
                                    ? 'hsl(var(--destructive))'
                                    : 'hsl(var(--border))'
                                }`,
                                backgroundColor: formData.simulationUnit === unit ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                                fontWeight: formData.simulationUnit === unit ? '600' : '500',
                                transition: 'all 0.2s'
                              }}
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                        {validationActive && !formData.simulationUnit && (
                          <div style={{
                            fontSize: '11px',
                            color: 'hsl(var(--destructive))',
                            marginTop: '8px'
                          }}>
                            시뮬레이션 단위를 선택해주세요.
                          </div>
                        )}
                      </div>

                      {/* 매체별 예산 배분 */}
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '8px'
                        }}>
                          매체별 예산 배분 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                        </label>
                        <div style={{
                          fontSize: '12px',
                          color: 'hsl(var(--muted-foreground))',
                          marginBottom: '12px'
                        }}>
                          각 계층별 비중의 합은 100%로 맞춰주세요.
                        </div>
                        
                        <div style={{
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}>
                          {/* 카테고리 탭 (DIGITAL / TVC) */}
                          <div style={{
                            display: 'flex',
                            borderBottom: '1px solid hsl(var(--border))',
                            backgroundColor: 'hsl(var(--muted) / 0.3)'
                          }}>
                            <button
                              onClick={() => setSelectedMediaCategory('DIGITAL')}
                              style={{
                                flex: 1,
                                padding: '12px',
                                fontSize: '13px',
                                fontWeight: '600',
                                border: 'none',
                                backgroundColor: selectedMediaCategory === 'DIGITAL' ? 'hsl(var(--background))' : 'transparent',
                                color: selectedMediaCategory === 'DIGITAL' ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                                cursor: 'pointer',
                                borderBottom: selectedMediaCategory === 'DIGITAL' ? '2px solid hsl(var(--foreground))' : 'none',
                                transition: 'all 0.2s'
                              }}
                            >
                              DIGITAL
                            </button>
                            <button
                              onClick={() => setSelectedMediaCategory('TV')}
                              style={{
                                flex: 1,
                                padding: '12px',
                                fontSize: '13px',
                                fontWeight: '600',
                                border: 'none',
                                backgroundColor: selectedMediaCategory === 'TV' ? 'hsl(var(--background))' : 'transparent',
                                color: selectedMediaCategory === 'TV' ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                                cursor: 'pointer',
                                borderBottom: selectedMediaCategory === 'TV' ? '2px solid hsl(var(--foreground))' : 'none',
                                transition: 'all 0.2s'
                              }}
                            >
                              TVC
                            </button>
                          </div>

                          {/* 매체 목록 */}
                          <div style={{ padding: '16px' }}>
                            {Object.keys(mediaData[selectedMediaCategory]).map((mediaName, mediaIndex) => {
                              const mediaKey = `${selectedMediaCategory}_${mediaName}`
                              const isSelected = selectedMedia.includes(mediaKey)
                              const isExpanded = expandedMedia.includes(mediaKey)
                              const products = mediaData[selectedMediaCategory][mediaName as keyof typeof mediaData[typeof selectedMediaCategory]]
                              const selectedProducts = productRatios[mediaKey] ? Object.keys(productRatios[mediaKey]) : []
                              const productValidation = isSelected && selectedProducts.length > 0 ? getProductRatioValidation(mediaKey) : null
                              
                              return (
                                <div key={mediaKey} style={{ marginBottom: '12px' }}>
                                  {/* 매체 행 */}
                                  <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'auto 1fr 120px 40px',
                                    gap: '12px',
                                    alignItems: 'center',
                                    padding: '12px',
                                    backgroundColor: isSelected ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                                    borderRadius: '6px',
                                    border: `1px solid ${isSelected ? 'hsl(var(--border))' : 'transparent'}`
                                  }}>
                                    {/* 체크박스 */}
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedMedia([...selectedMedia, mediaKey])
                                        } else {
                                          setSelectedMedia(selectedMedia.filter(m => m !== mediaKey))
                                          setExpandedMedia(expandedMedia.filter(m => m !== mediaKey))
                                          const newMediaRatios = { ...mediaRatios }
                                          delete newMediaRatios[mediaKey]
                                          setMediaRatios(newMediaRatios)
                                          const newProductRatios = { ...productRatios }
                                          delete newProductRatios[mediaKey]
                                          setProductRatios(newProductRatios)
                                        }
                                      }}
                                      className="checkbox-custom"
                                    />
                                    
                                    {/* 매체명 */}
                                    <div style={{
                                      fontSize: '13px',
                                      fontWeight: '500',
                                      color: isSelected ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                                    }}>
                                      {mediaName}
                                      {isSelected && selectedProducts.length > 0 && (
                                        <span style={{
                                          marginLeft: '8px',
                                          fontSize: '11px',
                                          color: 'hsl(var(--muted-foreground))'
                                        }}>
                                          ({selectedProducts.length}개 선택)
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* 비중 입력 */}
                                    {isSelected && (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <input
                                          type="number"
                                          value={mediaRatios[mediaKey] || ''}
                                          onChange={(e) => {
                                            const value = e.target.value === '' ? 0 : parseInt(e.target.value)
                                            if (value >= 0 && value <= 100) {
                                              setMediaRatios({ ...mediaRatios, [mediaKey]: value })
                                            }
                                          }}
                                          onKeyDown={handleRatioKeyDown}
                                          placeholder="0"
                                          className="input"
                                          data-ratio-input
                                          style={{
                                            width: '80px',
                                            textAlign: 'right',
                                            padding: '6px 8px',
                                            fontSize: '13px'
                                          }}
                                          min="0"
                                          max="100"
                                          step="1"
                                        />
                                        <span style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>%</span>
                                      </div>
                                    )}
                                    
                                    {/* 상품 선택 버튼 */}
                                    {isSelected && (
                                      <button
                                        onClick={() => {
                                          setProductSelectionDialog({
                                            open: true,
                                            mediaName: mediaKey,
                                            selectedProducts: selectedProducts
                                          })
                                          setProductSearchQuery('')
                                        }}
                                        className="btn btn-ghost btn-sm"
                                        style={{
                                          fontSize: '11px',
                                          padding: '4px 8px',
                                          height: 'auto'
                                        }}
                                      >
                                        선택
                                      </button>
                                    )}
                                  </div>
                                  
                                  {/* 선택된 상품 목록 */}
                                  {isSelected && selectedProducts.length > 0 && (
                                    <div style={{
                                      marginTop: '8px',
                                      marginLeft: '40px',
                                      padding: '12px',
                                      backgroundColor: 'hsl(var(--muted) / 0.3)',
                                      borderRadius: '6px',
                                      border: `1px solid ${productValidation?.isValid ? 'hsl(var(--border))' : 'hsl(var(--destructive))'}`
                                    }}>
                                      {selectedProducts.map((product, productIndex) => (
                                        <div key={product} style={{
                                          display: 'grid',
                                          gridTemplateColumns: '1fr 120px 24px',
                                          gap: '8px',
                                          alignItems: 'center',
                                          padding: '8px 0',
                                          borderBottom: productIndex < selectedProducts.length - 1 ? '1px solid hsl(var(--border))' : 'none'
                                        }}>
                                          <div style={{
                                            fontSize: '12px',
                                            color: 'hsl(var(--foreground))'
                                          }}>
                                            {product}
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <input
                                              type="number"
                                              value={productRatios[mediaKey]?.[product] || ''}
                                              onChange={(e) => {
                                                const value = e.target.value === '' ? 0 : parseInt(e.target.value)
                                                if (value >= 0 && value <= 100) {
                                                  setProductRatios({
                                                    ...productRatios,
                                                    [mediaKey]: {
                                                      ...productRatios[mediaKey],
                                                      [product]: value
                                                    }
                                                  })
                                                }
                                              }}
                                              onKeyDown={handleRatioKeyDown}
                                              placeholder="0"
                                              className="input"
                                              data-ratio-input
                                              style={{
                                                width: '80px',
                                                textAlign: 'right',
                                                padding: '4px 6px',
                                                fontSize: '12px'
                                              }}
                                              min="0"
                                              max="100"
                                              step="1"
                                            />
                                            <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>%</span>
                                          </div>
                                          <button
                                            onClick={() => {
                                              const newProductRatios = { ...productRatios }
                                              const { [product]: removed, ...rest } = newProductRatios[mediaKey]
                                              newProductRatios[mediaKey] = rest
                                              setProductRatios(newProductRatios)
                                            }}
                                            style={{
                                              width: '24px',
                                              height: '24px',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              border: 'none',
                                              backgroundColor: 'transparent',
                                              color: 'hsl(var(--muted-foreground))',
                                              cursor: 'pointer',
                                              borderRadius: '4px',
                                              transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                              e.currentTarget.style.backgroundColor = 'hsl(var(--destructive) / 0.1)'
                                              e.currentTarget.style.color = 'hsl(var(--destructive))'
                                            }}
                                            onMouseLeave={(e) => {
                                              e.currentTarget.style.backgroundColor = 'transparent'
                                              e.currentTarget.style.color = 'hsl(var(--muted-foreground))'
                                            }}
                                            title="상품 제거"
                                          >
                                            <X size={14} />
                                          </button>
                                        </div>
                                      ))}
                                      {/* 상품 합계 및 검증 메시지 */}
                                      <div style={{ paddingTop: '12px' }}>
                                        <div style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          fontSize: '12px',
                                          fontWeight: '600',
                                          marginBottom: productValidation?.isValid ? '0' : '8px'
                                        }}>
                                          <span>합계</span>
                                          <span style={{
                                            color: productValidation?.isValid
                                              ? 'hsl(var(--foreground))'
                                              : 'hsl(var(--destructive))'
                                          }}>
                                            {productValidation?.total}%
                                          </span>
                                        </div>
                                        {!productValidation?.isValid && (
                                          <div style={{
                                            fontSize: '11px',
                                            color: 'hsl(var(--destructive))',
                                            padding: '6px 8px',
                                            backgroundColor: 'hsl(var(--destructive) / 0.1)',
                                            borderRadius: '4px'
                                          }}>
                                            {productValidation?.message}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                            
                            {/* 현재 탭의 매체 합계 및 검증 */}
                            {(() => {
                              const currentTabMedia = selectedMedia.filter(m => m.startsWith(selectedMediaCategory))
                              if (currentTabMedia.length === 0) return null
                              
                              const currentTabTotal = currentTabMedia.reduce((sum, mediaKey) => sum + (mediaRatios[mediaKey] || 0), 0)
                              const isValidTabTotal = currentTabTotal === 100
                              
                              // 상품 미선택 매체 확인
                              const mediaWithoutProducts = currentTabMedia.filter(mediaKey => {
                                const products = productRatios[mediaKey]
                                return !products || Object.keys(products).length === 0
                              })
                              
                              return (
                                <div style={{
                                  marginTop: '16px',
                                  paddingTop: '16px',
                                  borderTop: '2px solid hsl(var(--border))'
                                }}>
                                  {/* 현재 탭 합계 */}
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: isValidTabTotal ? '0' : '8px'
                                  }}>
                                    <span>{selectedMediaCategory} 합계</span>
                                    <span style={{
                                      color: isValidTabTotal ? 'hsl(var(--foreground))' : 'hsl(var(--destructive))'
                                    }}>
                                      {currentTabTotal}%
                                    </span>
                                  </div>
                                  
                                  {/* 비중 합계 검증 */}
                                  {!isValidTabTotal && (
                                    <div style={{
                                      fontSize: '11px',
                                      color: 'hsl(var(--destructive))',
                                      marginBottom: '8px'
                                    }}>
                                      {selectedMediaCategory} 매체 비중 합계가 {currentTabTotal}%입니다. 100%로 맞춰주세요.
                                    </div>
                                  )}
                                  
                                  {/* 상품 미선택 경고 */}
                                  {mediaWithoutProducts.length > 0 && (
                                    <div style={{
                                      fontSize: '11px',
                                      color: 'hsl(var(--destructive))',
                                      padding: '8px',
                                      backgroundColor: 'hsl(var(--destructive) / 0.1)',
                                      borderRadius: '4px'
                                    }}>
                                      {mediaWithoutProducts.map(mediaKey => {
                                        const mediaName = mediaKey.split('_')[1]
                                        return (
                                          <div key={mediaKey}>• {mediaName}: 최소 1개 이상의 상품을 선택해주세요.</div>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              )
                            })()}
                          </div>
                        </div>
                        
                        {/* 전체 카테고리 선택 검증 메시지 (탭 외부) */}
                        {validationActive && (() => {
                          const digitalMedia = selectedMedia.filter(m => m.startsWith('DIGITAL'))
                          const tvcMedia = selectedMedia.filter(m => m.startsWith('TV'))
                          const hasDigital = digitalMedia.length > 0
                          const hasTVC = tvcMedia.length > 0
                          
                          // 카테고리 선택 검증만 표시
                          let validationMessages: string[] = []
                          
                          if (!hasDigital) {
                            validationMessages.push('DIGITAL 카테고리에서 최소 1개 이상의 매체를 선택해주세요.')
                          }
                          if (!hasTVC) {
                            validationMessages.push('TVC 카테고리에서 최소 1개 이상의 매체를 선택해주세요.')
                          }
                          
                          if (validationMessages.length === 0) return null
                          
                          return (
                            <div style={{
                              marginTop: '12px'
                            }}>
                              {validationMessages.map((msg, idx) => (
                                <div key={idx} style={{
                                  fontSize: '11px',
                                  color: 'hsl(var(--destructive))',
                                  marginTop: idx > 0 ? '4px' : '0'
                                }}>
                                  {msg}
                                </div>
                              ))}
                            </div>
                          )
                        })()}
                      </div>

                      {/* 상품 선택 다이얼로그 */}
                      {productSelectionDialog.open && (() => {
                        const allProducts = mediaData[selectedMediaCategory][productSelectionDialog.mediaName.split('_')[1] as keyof typeof mediaData[typeof selectedMediaCategory]] || []
                        const filteredProducts = allProducts.filter((product: string) => 
                          product.toLowerCase().includes(productSearchQuery.toLowerCase())
                        )
                        const allSelected = filteredProducts.length > 0 && filteredProducts.every((p: string) => productSelectionDialog.selectedProducts.includes(p))
                        
                        return (
                          <div className="dialog-overlay" onClick={() => {
                            setProductSelectionDialog({ open: false, mediaName: '', selectedProducts: [] })
                            setProductSearchQuery('')
                          }}>
                            <div 
                              className="dialog-content" 
                              onClick={(e) => e.stopPropagation()}
                              style={{ width: '600px', height: '600px', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
                            >
                              <div className="dialog-header">
                                <h3 className="dialog-title">
                                  {productSelectionDialog.mediaName.split('_')[1]} 상품 선택
                                </h3>
                                <p className="dialog-description">
                                  분석에 포함할 상품을 선택하세요
                                </p>
                              </div>
                              
                              <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                                {/* 검색 및 전체 선택 */}
                                <div style={{ marginBottom: '16px' }}>
                                  <input
                                    type="text"
                                    value={productSearchQuery}
                                    onChange={(e) => setProductSearchQuery(e.target.value)}
                                    placeholder="상품 검색..."
                                    className="input"
                                    style={{ width: '100%', marginBottom: '12px' }}
                                  />
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    backgroundColor: 'hsl(var(--muted) / 0.5)',
                                    borderRadius: '6px'
                                  }}>
                                    <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                                      {filteredProducts.length}개 상품
                                    </span>
                                    <button
                                      onClick={() => {
                                        if (allSelected) {
                                          // 전체 해제
                                          setProductSelectionDialog({
                                            ...productSelectionDialog,
                                            selectedProducts: productSelectionDialog.selectedProducts.filter(
                                              (p: string) => !filteredProducts.includes(p)
                                            )
                                          })
                                        } else {
                                          // 전체 선택
                                          const newSelected = [...new Set([...productSelectionDialog.selectedProducts, ...filteredProducts])]
                                          setProductSelectionDialog({
                                            ...productSelectionDialog,
                                            selectedProducts: newSelected
                                          })
                                        }
                                      }}
                                      className="btn btn-ghost btn-sm"
                                      style={{ fontSize: '11px' }}
                                    >
                                      {allSelected ? '전체 해제' : '전체 선택'}
                                    </button>
                                  </div>
                                </div>

                                {/* 상품 목록 */}
                                <div style={{
                                  display: 'grid',
                                  gridTemplateColumns: '1fr',
                                  gap: '8px',
                                  maxHeight: '400px',
                                  overflowY: 'auto'
                                }}>
                                  {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product: string) => (
                                      <label
                                        key={product}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '12px',
                                          cursor: 'pointer',
                                          padding: '12px',
                                          borderRadius: '6px',
                                          border: `1px solid ${productSelectionDialog.selectedProducts.includes(product) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                                          backgroundColor: productSelectionDialog.selectedProducts.includes(product) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                                          transition: 'all 0.2s'
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={productSelectionDialog.selectedProducts.includes(product)}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setProductSelectionDialog({
                                                ...productSelectionDialog,
                                                selectedProducts: [...productSelectionDialog.selectedProducts, product]
                                              })
                                            } else {
                                              setProductSelectionDialog({
                                                ...productSelectionDialog,
                                                selectedProducts: productSelectionDialog.selectedProducts.filter(p => p !== product)
                                              })
                                            }
                                          }}
                                          className="checkbox-custom"
                                        />
                                        <span style={{ fontSize: '13px' }}>{product}</span>
                                      </label>
                                    ))
                                  ) : (
                                    <div style={{
                                      padding: '32px',
                                      textAlign: 'center',
                                      color: 'hsl(var(--muted-foreground))',
                                      fontSize: '13px'
                                    }}>
                                      검색 결과가 없습니다
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="dialog-footer">
                                <button
                                  onClick={() => {
                                    setProductSelectionDialog({ open: false, mediaName: '', selectedProducts: [] })
                                    setProductSearchQuery('')
                                  }}
                                  className="btn btn-secondary btn-md"
                                >
                                  취소
                                </button>
                                <button
                                  onClick={() => {
                                    const mediaKey = productSelectionDialog.mediaName
                                    const newProductRatios = { ...productRatios }
                                    
                                    // 새로 선택된 상품들 추가
                                    newProductRatios[mediaKey] = {}
                                    productSelectionDialog.selectedProducts.forEach(product => {
                                      newProductRatios[mediaKey][product] = productRatios[mediaKey]?.[product] || 0
                                    })
                                    
                                    setProductRatios(newProductRatios)
                                    setProductSelectionDialog({ open: false, mediaName: '', selectedProducts: [] })
                                    setProductSearchQuery('')
                                  }}
                                  className="btn btn-primary btn-md"
                                >
                                  확인 ({productSelectionDialog.selectedProducts.length}개 선택)
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </>
                  )}

                  {formData.moduleType === 'Reach Predictor' && (
                    <>
                      {/* 매체 설정 */}
                      <div style={{ marginBottom: '32px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '8px'
                        }}>
                          매체 설정 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                        </label>
                        <div style={{
                          fontSize: '12px',
                          color: 'hsl(var(--muted-foreground))',
                          marginBottom: '12px'
                        }}>
                          각 매체별로 확정 예산(필수), 예상 노출(선택), CPM(자동 계산)을 설정합니다.
                        </div>
                        
                        {/* 매체 테이블 */}
                        <div style={{
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}>
                          {/* 테이블 헤더 */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '160px 1fr 110px 110px 100px 80px 80px 40px',
                            gap: '12px',
                            padding: '12px 16px',
                            backgroundColor: 'hsl(var(--muted) / 0.3)',
                            borderBottom: '1px solid hsl(var(--border))',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: 'hsl(var(--muted-foreground))',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            <div>매체</div>
                            <div>상품</div>
                            <div>확정 예산 (천원)</div>
                            <div>예상 노출</div>
                            <div>CPM (원)</div>
                            <div>기간</div>
                            <div>타겟팅</div>
                            <div></div>
                          </div>
                          
                          {/* 매체 행들 */}
                          <div style={{ padding: '16px' }}>
                            {/* 일괄 설정 버튼 */}
                            {reachPredictorMedia.length > 0 && (
                              <div style={{
                                marginBottom: '16px',
                                paddingBottom: '12px',
                                borderBottom: '1px solid hsl(var(--border))',
                                display: 'flex',
                                gap: '8px'
                              }}>
                                <button
                                  onClick={() => {
                                    setRpTempPeriod(formData.period)
                                    setRpPeriodDialog({ open: true, mediaId: null, isBulk: true })
                                  }}
                                  className="btn btn-ghost btn-sm"
                                  style={{ fontSize: '11px' }}
                                >
                                  전체 기간 일괄 설정
                                </button>
                                <button
                                  onClick={() => {
                                    setRpTempTarget(formData.targetGrp)
                                    setRpTargetDialog({ open: true, mediaId: null, isBulk: true })
                                  }}
                                  className="btn btn-ghost btn-sm"
                                  style={{ fontSize: '11px' }}
                                >
                                  전체 타겟팅 일괄 설정
                                </button>
                              </div>
                            )}
                            
                            {reachPredictorMedia.length === 0 ? (
                              <div style={{
                                padding: '32px',
                                textAlign: 'center',
                                color: 'hsl(var(--muted-foreground))',
                                fontSize: '13px'
                              }}>
                                매체를 추가하여 예산을 설정하세요
                              </div>
                            ) : (
                              reachPredictorMedia.map((media, index) => (
                                <div key={media.id} style={{
                                  display: 'grid',
                                  gridTemplateColumns: '160px 1fr 110px 110px 100px 80px 80px 40px',
                                  gap: '12px',
                                  alignItems: 'center',
                                  padding: '12px 0',
                                  borderBottom: index < reachPredictorMedia.length - 1 ? '1px solid hsl(var(--border))' : 'none'
                                }}>
                                  {/* 매체명 */}
                                  <div style={{
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    color: 'hsl(var(--foreground))'
                                  }}>
                                    {media.mediaName}
                                  </div>
                                  
                                  {/* 상품명 */}
                                  <div style={{
                                    fontSize: '12px',
                                    color: media.productName ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                                  }}>
                                    {media.productName || '—'}
                                  </div>
                                  
                                  {/* 확정 예산 */}
                                  <input
                                    type="text"
                                    value={media.budget}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/,/g, '')
                                      if (value === '' || /^\d+$/.test(value)) {
                                        const formatted = value === '' ? '' : parseInt(value).toLocaleString('ko-KR')
                                        const newMedia = [...reachPredictorMedia]
                                        newMedia[index] = { ...media, budget: formatted }
                                        
                                        // CPM 자동 계산
                                        if (formatted && media.impressions) {
                                          const budgetNum = parseInt(value) * 1000
                                          const impressionsNum = parseInt(media.impressions.replace(/,/g, ''))
                                          const cpm = Math.round((budgetNum / impressionsNum) * 1000)
                                          newMedia[index].cpm = cpm.toLocaleString('ko-KR')
                                        }
                                        
                                        setReachPredictorMedia(newMedia)
                                      }
                                    }}
                                    placeholder="0"
                                    className="input"
                                    style={{
                                      width: '100%',
                                      textAlign: 'right',
                                      padding: '6px 8px',
                                      fontSize: '13px'
                                    }}
                                  />
                                  
                                  {/* 예상 노출 */}
                                  <input
                                    type="text"
                                    value={media.impressions}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/,/g, '')
                                      if (value === '' || /^\d+$/.test(value)) {
                                        const formatted = value === '' ? '' : parseInt(value).toLocaleString('ko-KR')
                                        const newMedia = [...reachPredictorMedia]
                                        newMedia[index] = { ...media, impressions: formatted }
                                        
                                        // CPM 자동 계산
                                        if (media.budget && formatted) {
                                          const budgetNum = parseInt(media.budget.replace(/,/g, '')) * 1000
                                          const impressionsNum = parseInt(value)
                                          const cpm = Math.round((budgetNum / impressionsNum) * 1000)
                                          newMedia[index].cpm = cpm.toLocaleString('ko-KR')
                                        }
                                        
                                        setReachPredictorMedia(newMedia)
                                      }
                                    }}
                                    placeholder="0"
                                    className="input"
                                    style={{
                                      width: '100%',
                                      textAlign: 'right',
                                      padding: '6px 8px',
                                      fontSize: '13px'
                                    }}
                                  />
                                  
                                  {/* CPM (자동 계산) */}
                                  <div style={{
                                    padding: '6px 8px',
                                    textAlign: 'right',
                                    fontSize: '13px',
                                    color: media.cpm ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                                    backgroundColor: 'hsl(var(--muted) / 0.3)',
                                    borderRadius: '6px',
                                    fontWeight: '500'
                                  }}>
                                    {media.cpm || '—'}
                                  </div>
                                  
                                  {/* 기간 설정 버튼 */}
                                  <button
                                    onClick={() => {
                                      setRpTempPeriod(media.customPeriod || formData.period)
                                      setRpPeriodDialog({ open: true, mediaId: media.id, isBulk: false })
                                    }}
                                    className="btn btn-ghost btn-sm"
                                    style={{
                                      fontSize: '11px',
                                      padding: '4px 8px',
                                      height: 'auto',
                                      backgroundColor: media.customPeriod ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                                      color: media.customPeriod ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'
                                    }}
                                  >
                                    {media.customPeriod ? '개별' : '기본'}
                                  </button>
                                  
                                  {/* 타겟팅 설정 버튼 */}
                                  <button
                                    onClick={() => {
                                      setRpTempTarget(media.customTarget || formData.targetGrp)
                                      setRpTargetDialog({ open: true, mediaId: media.id, isBulk: false })
                                    }}
                                    className="btn btn-ghost btn-sm"
                                    style={{
                                      fontSize: '11px',
                                      padding: '4px 8px',
                                      height: 'auto',
                                      backgroundColor: media.customTarget ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                                      color: media.customTarget ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'
                                    }}
                                  >
                                    {media.customTarget ? '개별' : '기본'}
                                  </button>
                                  
                                  {/* 삭제 버튼 */}
                                  <button
                                    onClick={() => {
                                      setReachPredictorMedia(reachPredictorMedia.filter(m => m.id !== media.id))
                                    }}
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      border: 'none',
                                      backgroundColor: 'transparent',
                                      color: 'hsl(var(--muted-foreground))',
                                      cursor: 'pointer',
                                      borderRadius: '6px',
                                      transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = 'hsl(var(--destructive) / 0.1)'
                                      e.currentTarget.style.color = 'hsl(var(--destructive))'
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent'
                                      e.currentTarget.style.color = 'hsl(var(--muted-foreground))'
                                    }}
                                    title="매체 제거"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                          
                          {/* 총 예산 합계 */}
                          {reachPredictorMedia.length > 0 && (
                            <div style={{
                              padding: '12px 16px',
                              borderTop: '2px solid hsl(var(--border))',
                              backgroundColor: 'hsl(var(--muted) / 0.2)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <span style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: 'hsl(var(--foreground))'
                              }}>
                                총 예산 합계
                              </span>
                              <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'hsl(var(--foreground))'
                              }}>
                                {(() => {
                                  const total = reachPredictorMedia.reduce((sum, media) => {
                                    const budget = media.budget ? parseInt(media.budget.replace(/,/g, '')) : 0
                                    return sum + budget
                                  }, 0)
                                  return `${total.toLocaleString('ko-KR')}천원`
                                })()}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* 매체 추가 버튼 */}
                        <button
                          onClick={() => setRpMediaSelectionDialog(true)}
                          className="btn btn-secondary btn-md"
                          style={{ marginTop: '12px' }}
                        >
                          + 매체 추가
                        </button>
                      </div>
                      
                      {/* 리치커브 설정 */}
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '8px'
                        }}>
                          리치커브 설정 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                        </label>
                        <div style={{
                          fontSize: '12px',
                          color: 'hsl(var(--muted-foreground))',
                          marginBottom: '12px'
                        }}>
                          리치커브 예산 상한과 증분 구간을 설정하여 정밀한 도달률 예측 곡선을 생성합니다.
                        </div>
                        
                        <div style={{
                          padding: '20px',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          backgroundColor: 'hsl(var(--muted) / 0.1)'
                        }}>
                          <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                            리치커브 설정 UI는 Phase 2에서 구현됩니다.
                          </p>
                        </div>
                      </div>

                      {/* 매체 선택 다이얼로그 */}
                      {rpMediaSelectionDialog && (
                        <div className="dialog-overlay" onClick={() => setRpMediaSelectionDialog(false)}>
                          <div 
                            className="dialog-content" 
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: '700px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
                          >
                            <div className="dialog-header">
                              <h3 className="dialog-title">매체 선택</h3>
                              <p className="dialog-description">
                                분석에 포함할 매체를 선택하세요
                              </p>
                            </div>
                            
                            <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                              {/* 카테고리 탭 (DIGITAL / TVC) */}
                              <div style={{
                                display: 'flex',
                                borderBottom: '1px solid hsl(var(--border))',
                                marginBottom: '16px'
                              }}>
                                <button
                                  onClick={() => setRpSelectedCategory('DIGITAL')}
                                  style={{
                                    flex: 1,
                                    padding: '12px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: rpSelectedCategory === 'DIGITAL' ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                                    cursor: 'pointer',
                                    borderBottom: rpSelectedCategory === 'DIGITAL' ? '2px solid hsl(var(--foreground))' : 'none',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  DIGITAL
                                </button>
                                <button
                                  onClick={() => setRpSelectedCategory('TVC')}
                                  style={{
                                    flex: 1,
                                    padding: '12px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: rpSelectedCategory === 'TVC' ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                                    cursor: 'pointer',
                                    borderBottom: rpSelectedCategory === 'TVC' ? '2px solid hsl(var(--foreground))' : 'none',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  TVC
                                </button>
                              </div>
                              
                              {/* 검색 */}
                              <input
                                type="text"
                                value={rpMediaSearchQuery}
                                onChange={(e) => setRpMediaSearchQuery(e.target.value)}
                                placeholder="매체 검색..."
                                className="input"
                                style={{ width: '100%', marginBottom: '16px' }}
                              />
                              
                              {/* 매체 목록 */}
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '8px'
                              }}>
                                {rpSelectedCategory === 'DIGITAL' && (
                                  <>
                                    {/* 연동 매체 (상품 선택 필요) */}
                                    {Object.entries(mediaData.DIGITAL)
                                      .filter(([mediaName]) => 
                                        mediaName.toLowerCase().includes(rpMediaSearchQuery.toLowerCase())
                                      )
                                      .map(([mediaName, products]) => (
                                        <button
                                          key={mediaName}
                                          onClick={() => {
                                            setRpProductSelectionDialog({
                                              open: true,
                                              category: 'DIGITAL',
                                              mediaName,
                                              selectedProducts: []
                                            })
                                            setRpProductSearchQuery('')
                                          }}
                                          style={{
                                            padding: '12px',
                                            textAlign: 'left',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '6px',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            color: 'hsl(var(--foreground))'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent'
                                          }}
                                        >
                                          {mediaName}
                                          <span style={{
                                            marginLeft: '8px',
                                            fontSize: '11px',
                                            color: 'hsl(var(--muted-foreground))'
                                          }}>
                                            ({Array.isArray(products) ? products.length : 0}개 상품)
                                          </span>
                                        </button>
                                      ))}
                                    
                                    {/* 미연동 매체 (바로 추가) */}
                                    {unlinkedMedia
                                      .filter(mediaName => 
                                        mediaName.toLowerCase().includes(rpMediaSearchQuery.toLowerCase())
                                      )
                                      .map((mediaName) => (
                                        <button
                                          key={mediaName}
                                          onClick={() => {
                                            const newMedia = {
                                              id: `unlinked_${Date.now()}_${Math.random()}`,
                                              category: 'DIGITAL' as const,
                                              type: 'unlinked' as const,
                                              mediaName,
                                              budget: '',
                                              impressions: '',
                                              cpm: ''
                                            }
                                            setReachPredictorMedia([...reachPredictorMedia, newMedia])
                                            setRpMediaSelectionDialog(false)
                                            setRpMediaSearchQuery('')
                                          }}
                                          style={{
                                            padding: '12px',
                                            textAlign: 'left',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '6px',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            color: 'hsl(var(--foreground))'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent'
                                          }}
                                        >
                                          {mediaName}
                                        </button>
                                      ))}
                                  </>
                                )}
                                
                                {rpSelectedCategory === 'TVC' && (
                                  <>
                                    {Object.entries(mediaData.TV)
                                      .filter(([mediaName]) => 
                                        mediaName.toLowerCase().includes(rpMediaSearchQuery.toLowerCase())
                                      )
                                      .map(([mediaName, products]) => (
                                        <button
                                          key={mediaName}
                                          onClick={() => {
                                            setRpProductSelectionDialog({
                                              open: true,
                                              category: 'TVC',
                                              mediaName,
                                              selectedProducts: []
                                            })
                                            setRpProductSearchQuery('')
                                          }}
                                          style={{
                                            padding: '12px',
                                            textAlign: 'left',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '6px',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            color: 'hsl(var(--foreground))'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent'
                                          }}
                                        >
                                          {mediaName}
                                          <span style={{
                                            marginLeft: '8px',
                                            fontSize: '11px',
                                            color: 'hsl(var(--muted-foreground))'
                                          }}>
                                            ({Array.isArray(products) ? products.length : 0}개 상품)
                                          </span>
                                        </button>
                                      ))}
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="dialog-footer">
                              <button
                                onClick={() => {
                                  setRpMediaSelectionDialog(false)
                                  setRpMediaSearchQuery('')
                                }}
                                className="btn btn-secondary btn-md"
                              >
                                닫기
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 상품 선택 다이얼로그 */}
                      {rpProductSelectionDialog.open && (() => {
                        const allProducts = rpProductSelectionDialog.category === 'DIGITAL'
                          ? (mediaData.DIGITAL[rpProductSelectionDialog.mediaName as keyof typeof mediaData.DIGITAL] || []) as string[]
                          : (mediaData.TV[rpProductSelectionDialog.mediaName as keyof typeof mediaData.TV] || []) as string[]
                        
                        const filteredProducts = allProducts.filter((product: string) => 
                          product.toLowerCase().includes(rpProductSearchQuery.toLowerCase())
                        )
                        
                        const allSelected = filteredProducts.length > 0 && filteredProducts.every((p: string) => 
                          rpProductSelectionDialog.selectedProducts.includes(p)
                        )
                        
                        return (
                          <div className="dialog-overlay" onClick={() => {
                            setRpProductSelectionDialog({ open: false, category: 'DIGITAL', mediaName: '', selectedProducts: [] })
                            setRpProductSearchQuery('')
                          }}>
                            <div 
                              className="dialog-content" 
                              onClick={(e) => e.stopPropagation()}
                              style={{ width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
                            >
                              <div className="dialog-header">
                                <h3 className="dialog-title">
                                  {rpProductSelectionDialog.mediaName} 상품 선택
                                </h3>
                                <p className="dialog-description">
                                  분석에 포함할 상품을 선택하세요 (여러 개 선택 가능)
                                </p>
                              </div>
                              
                              <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                                {/* 검색 및 전체 선택 */}
                                <input
                                  type="text"
                                  value={rpProductSearchQuery}
                                  onChange={(e) => setRpProductSearchQuery(e.target.value)}
                                  placeholder="상품 검색..."
                                  className="input"
                                  style={{ width: '100%', marginBottom: '12px' }}
                                />
                                
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '8px 12px',
                                  backgroundColor: 'hsl(var(--muted) / 0.5)',
                                  borderRadius: '6px',
                                  marginBottom: '16px'
                                }}>
                                  <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                                    {filteredProducts.length}개 상품
                                  </span>
                                  <button
                                    onClick={() => {
                                      if (allSelected) {
                                        // 전체 해제
                                        setRpProductSelectionDialog({
                                          ...rpProductSelectionDialog,
                                          selectedProducts: rpProductSelectionDialog.selectedProducts.filter(
                                            (p: string) => !filteredProducts.includes(p)
                                          )
                                        })
                                      } else {
                                        // 전체 선택
                                        const newSelected = [...new Set([...rpProductSelectionDialog.selectedProducts, ...filteredProducts])]
                                        setRpProductSelectionDialog({
                                          ...rpProductSelectionDialog,
                                          selectedProducts: newSelected
                                        })
                                      }
                                    }}
                                    className="btn btn-ghost btn-sm"
                                    style={{ fontSize: '11px' }}
                                  >
                                    {allSelected ? '전체 해제' : '전체 선택'}
                                  </button>
                                </div>

                                {/* 상품 목록 */}
                                <div style={{
                                  display: 'grid',
                                  gridTemplateColumns: '1fr',
                                  gap: '8px'
                                }}>
                                  {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product: string) => (
                                      <label
                                        key={product}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '12px',
                                          cursor: 'pointer',
                                          padding: '12px',
                                          borderRadius: '6px',
                                          border: `1px solid ${rpProductSelectionDialog.selectedProducts.includes(product) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                                          backgroundColor: rpProductSelectionDialog.selectedProducts.includes(product) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                                          transition: 'all 0.2s'
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={rpProductSelectionDialog.selectedProducts.includes(product)}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setRpProductSelectionDialog({
                                                ...rpProductSelectionDialog,
                                                selectedProducts: [...rpProductSelectionDialog.selectedProducts, product]
                                              })
                                            } else {
                                              setRpProductSelectionDialog({
                                                ...rpProductSelectionDialog,
                                                selectedProducts: rpProductSelectionDialog.selectedProducts.filter(p => p !== product)
                                              })
                                            }
                                          }}
                                          className="checkbox-custom"
                                        />
                                        <span style={{ fontSize: '13px' }}>{product}</span>
                                      </label>
                                    ))
                                  ) : (
                                    <div style={{
                                      padding: '32px',
                                      textAlign: 'center',
                                      color: 'hsl(var(--muted-foreground))',
                                      fontSize: '13px'
                                    }}>
                                      검색 결과가 없습니다
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="dialog-footer">
                                <button
                                  onClick={() => {
                                    setRpProductSelectionDialog({ open: false, category: 'DIGITAL', mediaName: '', selectedProducts: [] })
                                    setRpProductSearchQuery('')
                                  }}
                                  className="btn btn-secondary btn-md"
                                >
                                  취소
                                </button>
                                <button
                                  onClick={() => {
                                    // 선택된 상품들을 각각 별도 행으로 추가
                                    const newMediaItems = rpProductSelectionDialog.selectedProducts.map(product => ({
                                      id: `linked_${Date.now()}_${Math.random()}`,
                                      category: rpProductSelectionDialog.category,
                                      type: 'linked' as const,
                                      mediaName: rpProductSelectionDialog.mediaName,
                                      productName: product,
                                      budget: '',
                                      impressions: '',
                                      cpm: ''
                                    }))
                                    
                                    setReachPredictorMedia([...reachPredictorMedia, ...newMediaItems])
                                    setRpProductSelectionDialog({ open: false, category: 'DIGITAL', mediaName: '', selectedProducts: [] })
                                    setRpProductSearchQuery('')
                                    setRpMediaSelectionDialog(false)
                                    setRpMediaSearchQuery('')
                                  }}
                                  className="btn btn-primary btn-md"
                                  disabled={rpProductSelectionDialog.selectedProducts.length === 0}
                                  style={{
                                    opacity: rpProductSelectionDialog.selectedProducts.length === 0 ? 0.5 : 1,
                                    cursor: rpProductSelectionDialog.selectedProducts.length === 0 ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  확인 ({rpProductSelectionDialog.selectedProducts.length}개 선택)
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </>
                  )}
                </div>
              )}

              {/* Step 3: 검토 및 실행 */}
              {currentStep === 3 && (
                <div style={{ width: '800px' }}>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '24px'
                  }}>
                    검토 및 실행
                  </h2>
                  
                  {/* 안내 메시지 */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: 'hsl(var(--muted) / 0.5)',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    marginBottom: '32px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      color: 'hsl(var(--foreground))',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Clock size={18} />
                      시나리오 생성 소요 시간 안내
                    </div>
                    
                    {/* 분석 모듈별 메시지 */}
                    {formData.moduleType === 'Ratio Finder' && (
                      <>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          marginBottom: '8px',
                          color: 'hsl(var(--foreground))'
                        }}>
                          "TVC와 Digital의 최적 예산 비중을 탐색합니다."
                        </div>
                        <div style={{
                          fontSize: '13px',
                          lineHeight: '1.6',
                          color: 'hsl(var(--muted-foreground))'
                        }}>
                          AI 알고리즘이 수만 개의 조합을 시뮬레이션하여 데이터 기반의 최적 배분안을 도출합니다.<br />
                          정밀 연산을 위해 <strong style={{ color: 'hsl(var(--foreground))' }}>최대 20분</strong>이 소요될 수 있으며, 완료 시 상단 <strong style={{ color: 'hsl(var(--foreground))' }}>알림 센터</strong>에서 알려드립니다.
                        </div>
                      </>
                    )}
                    
                    {formData.moduleType === 'Reach Predictor' && (
                      <>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          marginBottom: '8px',
                          color: 'hsl(var(--foreground))'
                        }}>
                          "매체 믹스에 따른 통합 광고 성과를 정밀하게 예측합니다."
                        </div>
                        <div style={{
                          fontSize: '13px',
                          lineHeight: '1.6',
                          color: 'hsl(var(--muted-foreground))'
                        }}>
                          방대한 과거 집행 데이터를 분석하여 예상 도달률(Reach) 및 주요 지표를 계산합니다. 결과 도출까지 <strong style={{ color: 'hsl(var(--foreground))' }}>최대 20분</strong>이 소요되며, 완료 시 <strong style={{ color: 'hsl(var(--foreground))' }}>알림 센터</strong>에서 알려드립니다.
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* 확인 메시지 */}
                  <div style={{
                    padding: '16px 20px',
                    backgroundColor: 'hsl(var(--muted) / 0.3)',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'hsl(var(--foreground))',
                      lineHeight: '1.5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Check size={16} />
                      우측 Configuration Summary에서 설정 내용을 확인하세요!
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 네비게이션 버튼 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '24px'
            }}>
              <button
                onClick={() => navigate('/reachcaster')}
                className="btn btn-ghost btn-lg"
              >
                취소
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                {currentStep > 1 && (
                  <button
                    onClick={handlePrev}
                    className="btn btn-secondary btn-lg"
                  >
                    <ChevronLeft size={20} />
                    이전
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="btn btn-primary btn-lg"
                    disabled={currentStep === 1 ? !isStep1Valid() : !isStep2Valid()}
                    style={{
                      opacity: (currentStep === 1 ? !isStep1Valid() : !isStep2Valid()) ? 0.5 : 1,
                      cursor: (currentStep === 1 ? !isStep1Valid() : !isStep2Valid()) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    다음
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg"
                    style={{
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? '생성 요청 중...' : '시나리오 생성 요청'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 중앙: 세로 구분선 */}
          <div style={{
            width: '1px',
            backgroundColor: 'hsl(var(--border))',
            alignSelf: 'stretch',
            minHeight: '600px'
          }} />

          {/* 우측: 실시간 요약 */}
          <div style={{
            position: 'sticky',
            top: '24px'
          }}>
            <div style={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid hsl(var(--border))'
              }}>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'hsl(var(--muted-foreground))'
                }}>
                  Configuration Summary
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Step 1: 기본 정보 */}
                <div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: 'hsl(var(--muted-foreground))',
                    marginBottom: '12px'
                  }}>
                    Step 1 · Basic Information
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        시나리오명
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: formData.scenarioName ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                        textAlign: 'right',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {formData.scenarioName || '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        분석 모듈
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: formData.moduleType ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.moduleType || '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        브랜드
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: formData.brand ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.brand || '—'}
                      </span>
                    </div>

                    {formData.industry && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                          업종
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                          {formData.industry}
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        캠페인 기간
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: (formData.period.start || formData.period.end) ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.period.start || '—'} → {formData.period.end || '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        타겟 GRP
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: formData.targetGrp.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {formData.targetGrp.length === 24 
                          ? '전체' 
                          : formData.targetGrp.length > 0 
                          ? `${formData.targetGrp.length}개` 
                          : '—'}
                      </span>
                    </div>
                    
                    {/* 타겟 GRP 상세 */}
                    {formData.targetGrp.length > 0 && formData.targetGrp.length < 24 && (
                      <div style={{
                        marginTop: '8px',
                        padding: '8px',
                        backgroundColor: 'hsl(var(--muted) / 0.3)',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}>
                        {/* 남성 */}
                        {(() => {
                          const maleTargets = formData.targetGrp.filter(t => t.startsWith('남성'))
                          if (maleTargets.length === 0) return null
                          return (
                            <div style={{ marginBottom: maleTargets.length > 0 && formData.targetGrp.some(t => t.startsWith('여성')) ? '8px' : '0' }}>
                              <div style={{
                                fontSize: '10px',
                                fontWeight: '600',
                                color: 'hsl(var(--muted-foreground))',
                                marginBottom: '4px'
                              }}>
                                남성 ({maleTargets.length})
                              </div>
                              <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '4px'
                              }}>
                                {maleTargets.map(target => (
                                  <span key={target} style={{
                                    padding: '2px 6px',
                                    backgroundColor: 'hsl(var(--muted))',
                                    borderRadius: '3px',
                                    fontSize: '10px',
                                    color: 'hsl(var(--foreground))'
                                  }}>
                                    {target.replace('남성 ', '')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        })()}
                        
                        {/* 여성 */}
                        {(() => {
                          const femaleTargets = formData.targetGrp.filter(t => t.startsWith('여성'))
                          if (femaleTargets.length === 0) return null
                          return (
                            <div>
                              <div style={{
                                fontSize: '10px',
                                fontWeight: '600',
                                color: 'hsl(var(--muted-foreground))',
                                marginBottom: '4px'
                              }}>
                                여성 ({femaleTargets.length})
                              </div>
                              <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '4px'
                              }}>
                                {femaleTargets.map(target => (
                                  <span key={target} style={{
                                    padding: '2px 6px',
                                    backgroundColor: 'hsl(var(--muted))',
                                    borderRadius: '3px',
                                    fontSize: '10px',
                                    color: 'hsl(var(--foreground))'
                                  }}>
                                    {target.replace('여성 ', '')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* 구분선 */}
                <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />

                {/* Step 2: 상세 설정 */}
                <div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: currentStep >= 2 ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground) / 0.5)',
                    marginBottom: '12px'
                  }}>
                    Step 2 · Module Configuration
                  </div>
                  
                  {formData.moduleType === 'Ratio Finder' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* 총 예산 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                          총 예산
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          fontWeight: '500',
                          color: formData.totalBudget ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                        }}>
                          {formData.totalBudget ? `${formData.totalBudget.toLocaleString('ko-KR')}천원` : '—'}
                        </span>
                      </div>
                      
                      {/* 시뮬레이션 단위 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                          시뮬레이션 단위
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          fontWeight: '500',
                          color: formData.simulationUnit ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                        }}>
                          {formData.simulationUnit || '—'}
                        </span>
                      </div>
                      
                      {/* 매체별 예산 배분 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                          매체별 예산 배분
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          fontWeight: '500',
                          color: selectedMedia.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                        }}>
                          {selectedMedia.length > 0 ? `${selectedMedia.length}개 매체` : '—'}
                        </span>
                      </div>
                      
                      {/* 선택된 매체 상세 (접힌 형태) */}
                      {selectedMedia.length > 0 && (
                        <div style={{
                          padding: '8px',
                          backgroundColor: 'hsl(var(--muted) / 0.3)',
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}>
                          {selectedMedia.map((mediaKey) => {
                            const mediaName = mediaKey.split('_')[1]
                            const ratio = mediaRatios[mediaKey] || 0
                            const products = productRatios[mediaKey] || {}
                            const hasProducts = Object.keys(products).length > 0
                            
                            return (
                              <div key={mediaKey} style={{ marginBottom: '6px' }}>
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  fontWeight: '500',
                                  color: 'hsl(var(--foreground))'
                                }}>
                                  <span>{mediaName}</span>
                                  <span>{ratio}%</span>
                                </div>
                                {hasProducts && (
                                  <div style={{
                                    marginTop: '4px',
                                    marginLeft: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px'
                                  }}>
                                    {Object.entries(products).map(([product, productRatio]) => (
                                      <div key={product} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        color: 'hsl(var(--muted-foreground))',
                                        fontSize: '10px'
                                      }}>
                                        <span style={{
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          maxWidth: '200px'
                                        }}>
                                          ∟ {product}
                                        </span>
                                        <span>{productRatio}%</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {formData.moduleType === 'Reach Predictor' && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: 'hsl(var(--muted-foreground))',
                      fontStyle: 'italic'
                    }}>
                      {currentStep >= 2 ? 'In progress...' : 'Pending'}
                    </div>
                  )}
                  
                  {!formData.moduleType && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: 'hsl(var(--muted-foreground))',
                      fontStyle: 'italic'
                    }}>
                      Pending
                    </div>
                  )}
                </div>

                {/* 구분선 */}
                <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))' }} />

                {/* Step 3: 검토 및 실행 */}
                <div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: currentStep >= 3 ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground) / 0.5)',
                    marginBottom: '12px'
                  }}>
                    Step 3 · Review & Execute
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                        검토
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '500',
                        color: currentStep >= 3 && isConfirmed ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {currentStep >= 3 ? (isConfirmed ? '확인 완료' : '미확인') : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* 토스트 알림 */}
      {showToast && (
        <div className={`toast ${showToast.type === 'success' ? 'toast--success' : 'toast--error'}`}>
          <div className="toast__icon">
            {showToast.type === 'success' ? (
              <CheckCircle size={20} style={{ color: 'hsl(142.1 76.2% 36.3%)' }} />
            ) : (
              <AlertCircle size={20} style={{ color: 'hsl(var(--destructive))' }} />
            )}
          </div>
          <div className="toast__content">
            <p className="toast__title">
              {showToast.type === 'success' ? '성공' : '오류'}
            </p>
            <p className="toast__description">
              {showToast.message}
            </p>
          </div>
          <button
            onClick={() => setShowToast(null)}
            className="toast__close"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </AppLayout>
  )
}

// Reach Predictor 기간 설정 다이얼로그 (위 코드에 추가 필요)
// rpPeriodDialog.open 체크 후 다이얼로그 렌더링
// rpTargetDialog.open 체크 후 다이얼로그 렌더링
