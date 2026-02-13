import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, List, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Calendar, Scale, Target, MoreVertical, Edit, Trash2, Copy, Users, User, Search, X, Filter, ArrowRightLeft } from 'lucide-react'
import { SlotHeader } from './SlotHeader'
import FrappeGantt from 'frappe-gantt-react'

interface SlotDetailProps {
  slotData: {
    title: string
    advertiser: string
    advertiserId: string
    visibility: string
    results: number
    modified: string
    description: string
  }
  onBack: () => void
  onEdit?: () => void
  onDelete?: () => void
}

// 샘플 시나리오 데이터
const sampleScenarios = [
  { 
    id: 1, 
    name: '주요 타겟층 공략 캠페인', 
    description: '25-34세 여성 타겟 집중 공략 전략',
    type: 'Ratio Finder',
    industry: '화장품',
    targetGrp: '여성(25~34세 외 3건)',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: 'Completed',
    processStep: 5,
    totalSteps: 5,
    stepDescription: '분석 완료',
    created: '2024-01-10 14:30',
    creator: '김철수',
    creatorId: 'USER001',
    completedAt: '2024-01-20 16:45',
    errorMessage: null
  },
  { 
    id: 2, 
    name: '신규 고객 유입 최적화', 
    description: '신규 고객 획득을 위한 도달률 예측',
    type: 'Reach Predictor',
    industry: '이커머스',
    targetGrp: '전체',
    startDate: '2024-01-20',
    endDate: '2024-03-20',
    status: 'Processing',
    processStep: 3,
    totalSteps: 5,
    stepDescription: '예측 모델 실행 중',
    created: '2024-01-18 09:15',
    creator: '이영희',
    creatorId: 'USER002',
    completedAt: null,
    errorMessage: null
  },
  { 
    id: 3, 
    name: '재구매 유도 전략 분석', 
    description: '기존 고객 재구매율 향상 방안',
    type: 'Ratio Finder',
    industry: '식품',
    targetGrp: '남성(30~49세 외 2건)',
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    status: 'Pending',
    processStep: 0,
    totalSteps: 5,
    stepDescription: '대기 중',
    created: '2024-01-25 11:20',
    creator: '박민수',
    creatorId: 'USER003',
    completedAt: null,
    errorMessage: null
  },
  { 
    id: 4, 
    name: '브랜드 인지도 향상 캠페인', 
    description: '브랜드 인지도 제고를 위한 미디어 믹스',
    type: 'Reach Predictor',
    industry: '자동차',
    targetGrp: '남성(35~54세 외 4건)',
    startDate: '2024-01-05',
    endDate: '2024-01-25',
    status: 'Error',
    processStep: 2,
    totalSteps: 5,
    stepDescription: '데이터 검증 실패',
    created: '2024-01-03 15:40',
    creator: '최지은',
    creatorId: 'USER004',
    completedAt: '2024-01-06 10:23',
    errorMessage: '입력 데이터 형식 오류: 예산 정보가 누락되었습니다.'
  },
  { 
    id: 5, 
    name: '시즌 프로모션 효과 예측', 
    description: '여름 시즌 프로모션 도달률 분석',
    type: 'Ratio Finder',
    industry: '패션',
    targetGrp: '여성(19~24세 외 5건)',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'Completed',
    processStep: 5,
    totalSteps: 5,
    stepDescription: '분석 완료',
    created: '2024-01-12 10:00',
    creator: '정현우',
    creatorId: 'USER005',
    completedAt: '2024-01-15 14:20',
    errorMessage: null
  },
  { 
    id: 6, 
    name: '모바일 앱 설치 캠페인', 
    description: '모바일 앱 다운로드 증대 전략',
    type: 'Reach Predictor',
    industry: '게임',
    targetGrp: '남성(19~34세 외 6건)',
    startDate: '2024-02-10',
    endDate: '2024-03-10',
    status: 'Processing',
    processStep: 4,
    totalSteps: 5,
    stepDescription: '결과 분석 중',
    created: '2024-02-05 13:25',
    creator: '강민지',
    creatorId: 'USER006',
    completedAt: null,
    errorMessage: null
  },
  { 
    id: 7, 
    name: '온라인 쇼핑몰 전환율 개선', 
    description: '구매 전환율 향상을 위한 최적화',
    type: 'Ratio Finder',
    industry: '이커머스',
    targetGrp: '여성(25~44세 외 4건)',
    startDate: '2024-01-28',
    endDate: '2024-02-28',
    status: 'Error',
    processStep: 3,
    totalSteps: 5,
    stepDescription: '모델 실행 오류',
    created: '2024-01-22 16:10',
    creator: '윤서준',
    creatorId: 'USER007',
    completedAt: '2024-01-29 09:15',
    errorMessage: '서버 연결 오류: 외부 API 응답 시간 초과'
  },
  { 
    id: 8, 
    name: '신제품 런칭 캠페인', 
    description: '신제품 출시 인지도 확산',
    type: 'Reach Predictor',
    industry: '전자제품',
    targetGrp: '전체',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: 'Pending',
    processStep: 0,
    totalSteps: 5,
    stepDescription: '대기 중',
    created: '2024-02-20 10:45',
    creator: '조은비',
    creatorId: 'USER008',
    completedAt: null,
    errorMessage: null
  },
  { 
    id: 9, 
    name: '여름 휴가 시즌 프로모션', 
    description: '여름 휴가 관련 상품 판매 증대',
    type: 'Ratio Finder',
    industry: '여행',
    targetGrp: '남성(30~49세 외 3건)',
    startDate: '2024-05-01',
    endDate: '2024-07-31',
    status: 'Processing',
    processStep: 2,
    totalSteps: 5,
    stepDescription: '데이터 수집 중',
    created: '2024-04-25 14:00',
    creator: '한지우',
    creatorId: 'USER009',
    completedAt: null,
    errorMessage: null
  },
  { 
    id: 10, 
    name: '건강식품 타겟 마케팅', 
    description: '건강 관심층 대상 맞춤 광고',
    type: 'Reach Predictor',
    industry: '건강식품',
    targetGrp: '여성(40~59세 외 2건)',
    startDate: '2024-02-15',
    endDate: '2024-04-15',
    status: 'Completed',
    processStep: 5,
    totalSteps: 5,
    stepDescription: '분석 완료',
    created: '2024-02-10 09:30',
    creator: '송하늘',
    creatorId: 'USER010',
    completedAt: '2024-04-16 11:20',
    errorMessage: null,
    reachPredictorMedia: [
      {
        id: '1',
        category: 'DIGITAL',
        type: 'linked',
        mediaName: 'Google Ads',
        productName: 'Google_Display_CPM',
        budget: '150000000',
        impressions: '50000000',
        cpm: '3000',
        customPeriod: { start: '2024-01-20', end: '2024-02-10' },
        customTarget: ['M2024', 'M2529', 'M3034', 'F2024', 'F2529']
      },
      {
        id: '2',
        category: 'DIGITAL',
        type: 'linked',
        mediaName: 'Google Ads',
        productName: 'Google_Video_CPM',
        budget: '200000000',
        impressions: '',
        cpm: '',
        customPeriod: { start: '2024-01-20', end: '2024-02-10' },
        customTarget: ['M2024', 'M2529', 'M3034', 'F2024', 'F2529']
      },
      {
        id: '3',
        category: 'DIGITAL',
        type: 'linked',
        mediaName: 'Google Ads',
        productName: 'Google_Search_CPC',
        budget: '180000000',
        impressions: '30000000',
        cpm: '6000',
        customPeriod: { start: '2024-01-20', end: '2024-02-10' },
        customTarget: ['M2024', 'M2529', 'M3034', 'F2024', 'F2529']
      },
      {
        id: '4',
        category: 'DIGITAL',
        type: 'unlinked',
        mediaName: '티빙',
        budget: '120000000',
        impressions: '25000000',
        cpm: '4800'
      },
      {
        id: '5',
        category: 'DIGITAL',
        type: 'unlinked',
        mediaName: '블라인드',
        budget: '80000000',
        impressions: '',
        cpm: ''
      },
      {
        id: '6',
        category: 'TVC',
        type: 'linked',
        mediaName: 'CJ ENM',
        productName: 'tvN',
        budget: '300000000',
        impressions: '15000000',
        cpm: '20000'
      },
      {
        id: '7',
        category: 'TVC',
        type: 'linked',
        mediaName: 'CJ ENM',
        productName: 'tvN STORY',
        budget: '150000000',
        impressions: '',
        cpm: ''
      },
      {
        id: '8',
        category: 'TVC',
        type: 'linked',
        mediaName: 'JTBC',
        productName: 'JTBC',
        budget: '250000000',
        impressions: '12000000',
        cpm: '20833'
      }
    ],
    period: { start: '2024-01-15', end: '2024-02-15' },
    targetGrpArray: ['남성 25~29세', '남성 30~34세', '남성 35~39세', '여성 25~29세', '여성 30~34세', '여성 35~39세', '여성 40~44세', '여성 45~49세']
  },
  { 
    id: 11, 
    name: '명절 특별 프로모션', 
    description: '설날 연휴 특별 할인 이벤트',
    type: 'Ratio Finder',
    industry: '유통',
    targetGrp: '전체',
    startDate: '2024-02-05',
    endDate: '2024-02-12',
    status: 'Completed',
    processStep: 5,
    totalSteps: 5,
    stepDescription: '분석 완료',
    created: '2024-01-28 11:15',
    creator: '임도현',
    creatorId: 'USER011',
    completedAt: '2024-02-13 15:20',
    errorMessage: null
  },
  { 
    id: 12, 
    name: '스포츠 용품 시즌 오프', 
    description: '겨울 스포츠 용품 재고 정리',
    type: 'Reach Predictor',
    industry: '스포츠',
    targetGrp: '남성(20~39세 외 5건)',
    startDate: '2024-03-10',
    endDate: '2024-03-31',
    status: 'Processing',
    processStep: 3,
    totalSteps: 5,
    stepDescription: '예측 모델 실행 중',
    created: '2024-03-05 13:40',
    creator: '배서연',
    creatorId: 'USER012',
    completedAt: null,
    errorMessage: null
  },
  { 
    id: 13, 
    name: '교육 콘텐츠 구독 유도', 
    description: '온라인 교육 플랫폼 구독자 확보',
    type: 'Ratio Finder',
    industry: '교육',
    targetGrp: '여성(25~44세 외 4건)',
    startDate: '2024-01-20',
    endDate: '2024-03-20',
    status: 'Completed',
    processStep: 5,
    totalSteps: 5,
    stepDescription: '분석 완료',
    created: '2024-01-15 10:20',
    creator: '오준혁',
    creatorId: 'USER013',
    completedAt: '2024-03-22 09:45',
    errorMessage: null
  },
  { 
    id: 14, 
    name: '반려동물 용품 캠페인', 
    description: '반려동물 보호자 타겟 마케팅',
    type: 'Reach Predictor',
    industry: '펫케어',
    targetGrp: '여성(30~49세 외 3건)',
    startDate: '2024-02-20',
    endDate: '2024-04-20',
    status: 'Pending',
    processStep: 0,
    totalSteps: 5,
    stepDescription: '대기 중',
    created: '2024-02-15 15:55',
    creator: '신예린',
    creatorId: 'USER014',
    completedAt: null,
    errorMessage: null
  },
  { 
    id: 15, 
    name: '금융 상품 가입 유도', 
    description: '신규 금융 상품 가입자 확보',
    type: 'Ratio Finder',
    industry: '금융',
    targetGrp: '남성(35~54세 외 6건)',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    status: 'Processing',
    processStep: 2,
    totalSteps: 5,
    stepDescription: '데이터 수집 중',
    created: '2024-02-25 11:30',
    creator: '홍재민',
    creatorId: 'USER015',
    completedAt: null,
    errorMessage: null
  },
]

type ViewMode = 'list' | 'gantt'
type SortField = 'id' | 'name' | 'type' | 'industry' | 'targetGrp' | 'startDate' | 'endDate' | 'status' | 'created' | 'creator'
type SortOrder = 'asc' | 'desc'
type TimelineZoom = 'month' | 'quarter' | 'year'

export function SlotDetail({ slotData, onBack, onEdit, onDelete }: SlotDetailProps) {
  const navigate = useNavigate()
  
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortField, setSortField] = useState<SortField>('id')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedScenarios, setSelectedScenarios] = useState<number[]>([])
  const [contextMenuOpen, setContextMenuOpen] = useState<number | null>(null)
  const [timelineZoom, setTimelineZoom] = useState<TimelineZoom>('quarter')
  const [timelineYear, setTimelineYear] = useState(2024)
  const [timelineMonth, setTimelineMonth] = useState(1) // 1-12
  const [timelineQuarter, setTimelineQuarter] = useState(1) // 1-4
  
  // 검색 & 필터 상태
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [moduleFilter, setModuleFilter] = useState<string[]>([])
  const [industryFilter, setIndustryFilter] = useState<string[]>([])
  const [targetFilter, setTargetFilter] = useState<string[]>([])
  const [dateRangeFilter, setDateRangeFilter] = useState<{ start: string, end: string }>({ start: '', end: '' })
  
  // 이동 다이얼로그
  const [showMoveDialog, setShowMoveDialog] = useState(false)

  // Slot ID를 고정값으로 설정 (실제로는 props로 받아올 것)
  const slotId = 1

  // 타임라인 기간 이동
  const handleTimelinePrev = () => {
    if (timelineZoom === 'month') {
      if (timelineMonth === 1) {
        setTimelineMonth(12)
        setTimelineYear(timelineYear - 1)
      } else {
        setTimelineMonth(timelineMonth - 1)
      }
    } else if (timelineZoom === 'quarter') {
      if (timelineQuarter === 1) {
        setTimelineQuarter(4)
        setTimelineYear(timelineYear - 1)
      } else {
        setTimelineQuarter(timelineQuarter - 1)
      }
    } else {
      setTimelineYear(timelineYear - 1)
    }
  }

  const handleTimelineNext = () => {
    if (timelineZoom === 'month') {
      if (timelineMonth === 12) {
        setTimelineMonth(1)
        setTimelineYear(timelineYear + 1)
      } else {
        setTimelineMonth(timelineMonth + 1)
      }
    } else if (timelineZoom === 'quarter') {
      if (timelineQuarter === 4) {
        setTimelineQuarter(1)
        setTimelineYear(timelineYear + 1)
      } else {
        setTimelineQuarter(timelineQuarter + 1)
      }
    } else {
      setTimelineYear(timelineYear + 1)
    }
  }

  const handleTimelineToday = () => {
    const today = new Date()
    setTimelineYear(today.getFullYear())
    setTimelineMonth(today.getMonth() + 1)
    setTimelineQuarter(Math.floor(today.getMonth() / 3) + 1)
  }

  // 타임라인 기간 텍스트
  const getTimelinePeriodText = () => {
    if (timelineZoom === 'month') {
      return `${timelineYear}년 ${timelineMonth}월`
    } else if (timelineZoom === 'quarter') {
      return `${timelineYear}년 Q${timelineQuarter}`
    } else {
      return `${timelineYear}년`
    }
  }

  // 정렬 핸들러
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // 정렬된 데이터
  const sortedScenarios = [...sampleScenarios].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    const modifier = sortOrder === 'asc' ? 1 : -1
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * modifier
    }
    return (aVal > bVal ? 1 : -1) * modifier
  })

  // 검색 & 필터 적용
  const filteredScenarios = sortedScenarios.filter(scenario => {
    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchName = scenario.name.toLowerCase().includes(query)
      const matchCreator = scenario.creator.toLowerCase().includes(query)
      const matchCreatorId = scenario.creatorId.toLowerCase().includes(query)
      if (!matchName && !matchCreator && !matchCreatorId) return false
    }
    
    // 상태 필터
    if (statusFilter.length > 0 && !statusFilter.includes(scenario.status)) return false
    
    // 분석 모듈 필터
    if (moduleFilter.length > 0 && !moduleFilter.includes(scenario.type)) return false
    
    // 업종 필터
    if (industryFilter.length > 0 && !industryFilter.includes(scenario.industry)) return false
    
    // 타겟 GRP 필터
    if (targetFilter.length > 0 && !targetFilter.includes(scenario.targetGrp)) return false
    
    // 기간 범위 필터
    if (dateRangeFilter.start && new Date(scenario.startDate) < new Date(dateRangeFilter.start)) return false
    if (dateRangeFilter.end && new Date(scenario.endDate) > new Date(dateRangeFilter.end)) return false
    
    return true
  })

  // 페이지네이션
  const totalPages = Math.ceil(filteredScenarios.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentScenarios = filteredScenarios.slice(startIndex, startIndex + itemsPerPage)

  // 정렬 아이콘 렌더링
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
  }

  // 상태 뱃지 스타일 - 흰/그레이/검 스타일
  const getStatusStyle = (status: string) => {
    const styles = {
      Completed: { bg: 'hsl(var(--foreground))', color: 'hsl(var(--background))', border: 'hsl(var(--foreground))' },
      Processing: { bg: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', border: 'hsl(var(--border))' },
      Pending: { bg: 'transparent', color: 'hsl(var(--muted-foreground))', border: 'hsl(var(--border))' },
      Error: { bg: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', border: 'hsl(var(--destructive))' }
    }
    return styles[status as keyof typeof styles] || styles.Pending
  }

  // 시나리오 타입 스타일 - 더 잘 보이는 색상
  const getTypeStyle = (type: string) => {
    return { 
      bg: 'hsl(var(--foreground))', 
      color: 'hsl(var(--background))', 
      border: 'hsl(var(--foreground))' 
    }
  }

  // 시나리오 타입 아이콘
  const getTypeIcon = (type: string) => {
    return type === 'Ratio Finder' ? <Scale size={14} /> : <Target size={14} />
  }

  // 처리 단계 진행률 계산
  const getProgressPercentage = (step: number, total: number) => {
    return (step / total) * 100
  }

  // 타겟 GRP 아이콘 및 텍스트
  const getTargetDisplay = (targetGrp: string) => {
    if (targetGrp === '전체') {
      return {
        icon: <Users size={14} />,
        text: '전체'
      }
    } else {
      // "여성(25~34세 외 3건)" 형식에서 숫자 추출
      const match = targetGrp.match(/외\s*(\d+)건/)
      const additionalCount = match ? parseInt(match[1]) : 0
      const totalSegments = additionalCount + 1 // "외 n건"이므로 +1
      
      return {
        icon: <User size={14} />,
        text: `${totalSegments}개 세그먼트`
      }
    }
  }

  // 재시도 핸들러
  const handleRetry = (scenarioId: number) => {
    console.log('시나리오 재시도:', scenarioId)
    // 실제로는 API 호출
  }

  // 체크박스 핸들러
  const toggleScenario = (id: number) => {
    setSelectedScenarios(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    )
  }

  const toggleAllScenarios = () => {
    if (selectedScenarios.length === currentScenarios.length) {
      setSelectedScenarios([])
    } else {
      setSelectedScenarios(currentScenarios.map(s => s.id))
    }
  }

  return (
    <>
      {/* Slot 정보 헤더 */}
      <SlotHeader 
        slotId={slotId}
        slotData={slotData}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {/* 시나리오 영역 */}
      <div className="workspace-content">
        {/* 타이틀 섹션 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '600' }}>
              Reach Caster
            </h1>
            <button 
              onClick={() => navigate('/reachcaster/scenario/new')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '24px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: '0.2s',
                height: '48px',
                opacity: 1,
                transform: 'translateY(0px)'
              }}
            >
              <Plus size={16} />
              New Scenario
            </button>
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          {/* 좌측: 뷰 토글 + Scenario 개수 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* 뷰 모드 토글 */}
            <div style={{ display: 'flex', gap: '4px', padding: '4px', backgroundColor: 'hsl(var(--muted))', borderRadius: '6px' }}>
              <button
                onClick={() => setViewMode('list')}
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ 
                  backgroundColor: viewMode === 'list' ? 'hsl(var(--background))' : 'transparent',
                  boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  padding: '8px'
                }}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('gantt')}
                className={`btn btn-sm ${viewMode === 'gantt' ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ 
                  backgroundColor: viewMode === 'gantt' ? 'hsl(var(--background))' : 'transparent',
                  boxShadow: viewMode === 'gantt' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  padding: '8px'
                }}
              >
                <Calendar size={16} />
              </button>
            </div>
            
            {/* Scenario 개수 */}
            <div style={{ 
              fontSize: '14px',
              color: 'hsl(var(--muted-foreground))'
            }}>
              {filteredScenarios.length} Scenarios
              {selectedScenarios.length > 0 && (
                <span style={{ marginLeft: '12px', color: 'hsl(var(--primary))' }}>
                  ({selectedScenarios.length}개 선택됨)
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* 선택된 항목 일괄 작업 버튼 */}
            {selectedScenarios.length > 0 && (
              <>
                <button
                  onClick={() => setShowMoveDialog(true)}
                  className="btn btn-ghost btn-md"
                  style={{ border: '1px solid hsl(var(--border))' }}
                >
                  <ArrowRightLeft size={16} />
                  이동
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`선택한 ${selectedScenarios.length}개 시나리오를 삭제하시겠습니까?`)) {
                      console.log('삭제:', selectedScenarios)
                      setSelectedScenarios([])
                    }
                  }}
                  className="btn btn-md"
                  style={{
                    backgroundColor: 'hsl(var(--destructive))',
                    color: 'hsl(var(--destructive-foreground))',
                    border: 'none'
                  }}
                >
                  <Trash2 size={16} />
                  삭제
                </button>
              </>
            )}
            
            {/* 검색 */}
            <div style={{ position: 'relative' }}>
              {!searchExpanded ? (
                <button
                  onClick={() => setSearchExpanded(true)}
                  className="btn btn-ghost btn-md"
                  style={{ 
                    border: '1px solid hsl(var(--border))',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0 12px'
                  }}
                >
                  <Search size={16} />
                  <span>검색</span>
                </button>
              ) : (
                <div style={{ 
                  position: 'relative',
                  width: '300px',
                  transition: 'width 0.3s ease-out'
                }}>
                  <Search size={16} style={{ 
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1
                  }} className="text-muted-foreground" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      if (!searchQuery) {
                        setSearchExpanded(false)
                      }
                    }}
                    placeholder="시나리오명, 작성자"
                    className="input"
                    autoFocus
                    style={{ 
                      paddingLeft: '40px',
                      paddingRight: '12px',
                      height: '36px',
                      minHeight: '36px',
                      width: '100%'
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSearchExpanded(false)
                      }}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X size={14} className="text-muted-foreground" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 필터 */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="btn btn-ghost btn-md"
                style={{ 
                  border: '1px solid hsl(var(--border))',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 12px',
                  backgroundColor: (statusFilter.length > 0 || moduleFilter.length > 0 || industryFilter.length > 0 || targetFilter.length > 0 || dateRangeFilter.start || dateRangeFilter.end) 
                    ? 'hsl(var(--primary) / 0.1)' 
                    : 'transparent'
                }}
              >
                <Filter size={16} />
                <span>필터</span>
                {(statusFilter.length > 0 || moduleFilter.length > 0 || industryFilter.length > 0 || targetFilter.length > 0 || dateRangeFilter.start || dateRangeFilter.end) && (
                  <span style={{
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    {statusFilter.length + moduleFilter.length + industryFilter.length + targetFilter.length + (dateRangeFilter.start ? 1 : 0)}
                  </span>
                )}
              </button>

              {/* 필터 드롭다운 */}
              {filterOpen && (
                <div className="dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  width: '320px',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  padding: '12px'
                }}>
                  {/* 분석 모듈 필터 */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>분석 모듈</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {['Ratio Finder', 'Reach Predictor'].map(module => (
                        <label key={module} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={moduleFilter.includes(module)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setModuleFilter([...moduleFilter, module])
                              } else {
                                setModuleFilter(moduleFilter.filter(m => m !== module))
                              }
                            }}
                            className="checkbox-custom"
                          />
                          <span style={{ fontSize: '13px' }}>{module}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 상태 필터 */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>상태</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {['Completed', 'Processing', 'Pending', 'Error'].map(status => (
                        <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={statusFilter.includes(status)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setStatusFilter([...statusFilter, status])
                              } else {
                                setStatusFilter(statusFilter.filter(s => s !== status))
                              }
                            }}
                            className="checkbox-custom"
                          />
                          <span style={{ fontSize: '13px' }}>{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 업종 필터 */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>업종</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
                      {Array.from(new Set(sampleScenarios.map(s => s.industry))).map(industry => (
                        <label key={industry} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={industryFilter.includes(industry)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setIndustryFilter([...industryFilter, industry])
                              } else {
                                setIndustryFilter(industryFilter.filter(i => i !== industry))
                              }
                            }}
                            className="checkbox-custom"
                          />
                          <span style={{ fontSize: '13px' }}>{industry}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 필터 초기화 버튼 */}
                  <button
                    onClick={() => {
                      setStatusFilter([])
                      setModuleFilter([])
                      setIndustryFilter([])
                      setTargetFilter([])
                      setDateRangeFilter({ start: '', end: '' })
                    }}
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    필터 초기화
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 리스트 뷰 */}
        {viewMode === 'list' && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>
                    <input
                      type="checkbox"
                      className="checkbox-custom"
                      checked={selectedScenarios.length === currentScenarios.length && currentScenarios.length > 0}
                      onChange={toggleAllScenarios}
                    />
                  </th>
                  <th onClick={() => handleSort('id')} style={{ cursor: 'pointer', width: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ID {renderSortIcon('id')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', minWidth: '250px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      시나리오 {renderSortIcon('name')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('type')} style={{ cursor: 'pointer', width: '150px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      분석 모듈 {renderSortIcon('type')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('industry')} style={{ cursor: 'pointer', width: '100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      업종 {renderSortIcon('industry')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('targetGrp')} style={{ cursor: 'pointer', width: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      타겟 GRP {renderSortIcon('targetGrp')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('startDate')} style={{ cursor: 'pointer', width: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      기간 {renderSortIcon('startDate')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer', width: '130px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      상태 {renderSortIcon('status')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('creator')} style={{ cursor: 'pointer', width: '100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      작성자 {renderSortIcon('creator')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('created')} style={{ cursor: 'pointer', width: '140px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      작성일시 {renderSortIcon('created')}
                    </div>
                  </th>
                  <th style={{ width: '60px', textAlign: 'right', paddingRight: '1.5rem' }}>
                    
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentScenarios.map((scenario) => {
                  const statusStyle = getStatusStyle(scenario.status)
                  const typeStyle = getTypeStyle(scenario.type)
                  const progressPercentage = getProgressPercentage(scenario.processStep, scenario.totalSteps)
                  const isSelected = selectedScenarios.includes(scenario.id)
                  
                  const isClickable = scenario.status === 'Completed'
                  const handleRowClick = () => {
                    if (isClickable) {
                      const resultPath = scenario.type === 'Ratio Finder' 
                        ? '/reachcaster/scenario/ratio-finder/result'
                        : '/reachcaster/scenario/reach-predictor/result'
                      navigate(resultPath, { state: { scenarioData: scenario } })
                    }
                  }

                  return (
                    <tr 
                      key={scenario.id} 
                      style={{ 
                        backgroundColor: isSelected ? 'hsl(var(--muted) / 0.3)' : undefined,
                        cursor: isClickable ? 'pointer' : 'default'
                      }}
                      onClick={handleRowClick}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="checkbox-custom"
                          checked={isSelected}
                          onChange={() => toggleScenario(scenario.id)}
                        />
                      </td>
                      <td>
                        <span style={{ 
                          fontSize: '13px',
                          color: 'hsl(var(--muted-foreground))'
                        }}>
                          #{scenario.id}
                        </span>
                      </td>
                      <td style={{ 
                        fontWeight: '500',
                        color: isClickable ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                        opacity: isClickable ? 1 : 0.6
                      }}>
                        {scenario.name}
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: typeStyle.bg,
                          color: typeStyle.color,
                          border: `1px solid ${typeStyle.border}`,
                          whiteSpace: 'nowrap',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', color: typeStyle.color }}>
                            {getTypeIcon(scenario.type)}
                          </span>
                          {scenario.type}
                        </span>
                      </td>
                      <td className="text-muted-foreground">{scenario.industry}</td>
                      <td>
                        <span style={{ 
                          fontSize: '12px',
                          color: 'hsl(var(--muted-foreground))',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {(() => {
                            const display = getTargetDisplay(scenario.targetGrp)
                            return (
                              <>
                                {display.icon}
                                {display.text}
                              </>
                            )
                          })()}
                        </span>
                      </td>
                      <td>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          fontSize: '13px',
                          color: 'hsl(var(--muted-foreground))',
                          lineHeight: '1.4'
                        }}>
                          <span>{scenario.startDate} →</span>
                          <span>{scenario.endDate}</span>
                        </div>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {/* Processing 상태: 프로그레스바 뱃지 */}
                          {scenario.status === 'Processing' ? (
                            <>
                              <div style={{
                                position: 'relative',
                                width: '100px',
                                height: '24px',
                                borderRadius: '4px',
                                border: '1px solid hsl(var(--border))',
                                overflow: 'hidden',
                                backgroundColor: 'hsl(var(--muted))'
                              }}>
                                <div style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  height: '100%',
                                  width: `${progressPercentage}%`,
                                  backgroundColor: 'hsl(var(--foreground))',
                                  transition: 'width 0.3s ease'
                                }} />
                                <div style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  color: 'hsl(var(--background))',
                                  zIndex: 1
                                }}>
                                  Processing
                                </div>
                              </div>
                              <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                                {scenario.processStep}/{scenario.totalSteps} · {scenario.stepDescription}
                              </span>
                            </>
                          ) : (
                            /* 다른 상태: 일반 뱃지 */
                            <>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span 
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    backgroundColor: statusStyle.bg,
                                    color: statusStyle.color,
                                    border: `1px solid ${statusStyle.border}`
                                  }}
                                >
                                  {scenario.status}
                                </span>
                                {scenario.status === 'Error' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRetry(scenario.id)
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      padding: '4px 8px',
                                      fontSize: '11px',
                                      color: 'hsl(var(--foreground))',
                                      cursor: 'pointer',
                                      textDecoration: 'underline',
                                      height: '24px'
                                    }}
                                  >
                                    재시도
                                  </button>
                                )}
                              </div>
                              {(scenario.status === 'Completed' || scenario.status === 'Error') && scenario.completedAt && (
                                <span style={{ fontSize: '11px' }} className="text-muted-foreground">
                                  {scenario.completedAt}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          fontSize: '13px',
                          color: 'hsl(var(--muted-foreground))'
                        }}>
                          {scenario.creator}({scenario.creatorId})
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          fontSize: '13px',
                          color: 'hsl(var(--muted-foreground))'
                        }}>
                          {scenario.created}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <button
                            data-context-menu
                            onClick={(e) => {
                              e.stopPropagation()
                              setContextMenuOpen(contextMenuOpen === scenario.id ? null : scenario.id)
                            }}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px' }}
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {contextMenuOpen === scenario.id && (
                            <div className="dropdown" style={{
                              position: 'absolute',
                              top: '100%',
                              right: 0,
                              marginTop: '4px',
                              width: '120px',
                              zIndex: 1000
                            }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setContextMenuOpen(null)
                                  console.log('수정:', scenario.id)
                                }}
                                className="dropdown-item"
                              >
                                <Edit size={14} />
                                수정
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setContextMenuOpen(null)
                                  console.log('복제:', scenario.id)
                                }}
                                className="dropdown-item"
                              >
                                <Copy size={14} />
                                복제
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setContextMenuOpen(null)
                                  console.log('삭제:', scenario.id)
                                }}
                                className="dropdown-item"
                              >
                                <Trash2 size={14} />
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 타임라인 뷰 */}
        {viewMode === 'gantt' && (
          <div>
            {/* 타임라인 컨트롤 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              padding: '8px 12px',
              backgroundColor: 'hsl(var(--muted) / 0.3)',
              borderRadius: '6px'
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  onClick={handleTimelinePrev}
                  className="btn btn-ghost btn-sm" 
                  style={{ padding: '4px 8px' }}
                >
                  <ChevronLeft size={14} />
                </button>
                <span style={{ fontSize: '13px', fontWeight: '600', minWidth: '120px', textAlign: 'center' }}>
                  {getTimelinePeriodText()}
                </span>
                <button 
                  onClick={handleTimelineNext}
                  className="btn btn-ghost btn-sm" 
                  style={{ padding: '4px 8px' }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {/* Zoom 컨트롤 */}
                <div style={{ 
                  display: 'flex', 
                  gap: '2px', 
                  padding: '2px', 
                  backgroundColor: 'hsl(var(--background))', 
                  borderRadius: '4px',
                  border: '1px solid hsl(var(--border))'
                }}>
                  <button
                    onClick={() => setTimelineZoom('month')}
                    className={`btn btn-sm ${timelineZoom === 'month' ? 'btn-secondary' : 'btn-ghost'}`}
                    style={{ 
                      padding: '4px 8px',
                      fontSize: '11px',
                      backgroundColor: timelineZoom === 'month' ? 'hsl(var(--muted))' : 'transparent'
                    }}
                  >
                    월
                  </button>
                  <button
                    onClick={() => setTimelineZoom('quarter')}
                    className={`btn btn-sm ${timelineZoom === 'quarter' ? 'btn-secondary' : 'btn-ghost'}`}
                    style={{ 
                      padding: '4px 8px',
                      fontSize: '11px',
                      backgroundColor: timelineZoom === 'quarter' ? 'hsl(var(--muted))' : 'transparent'
                    }}
                  >
                    분기
                  </button>
                  <button
                    onClick={() => setTimelineZoom('year')}
                    className={`btn btn-sm ${timelineZoom === 'year' ? 'btn-secondary' : 'btn-ghost'}`}
                    style={{ 
                      padding: '4px 8px',
                      fontSize: '11px',
                      backgroundColor: timelineZoom === 'year' ? 'hsl(var(--muted))' : 'transparent'
                    }}
                  >
                    년
                  </button>
                </div>
                
                <button 
                  onClick={handleTimelineToday}
                  className="btn btn-ghost btn-sm" 
                  style={{ padding: '4px 12px', fontSize: '12px' }}
                >
                  오늘
                </button>
              </div>
            </div>

            {/* 타임라인 그리드 */}
            <div style={{ 
              overflowX: 'hidden',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              position: 'relative'
            }}>
              <div style={{ width: '100%' }}>
                {/* 기간 헤더 - sticky */}
                <div style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  display: 'grid',
                  gridTemplateColumns: timelineZoom === 'month' 
                    ? 'repeat(1, 1fr)' 
                    : timelineZoom === 'quarter'
                    ? 'repeat(3, 1fr)'
                    : 'repeat(12, 1fr)',
                  borderBottom: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--muted) / 0.5)',
                  backdropFilter: 'blur(8px)'
                }}>
                  {timelineZoom === 'month' && (
                    <div style={{
                      padding: '12px 8px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {timelineYear}년 {timelineMonth}월
                    </div>
                  )}
                  {timelineZoom === 'quarter' && [1, 2, 3].map((monthOffset, idx) => {
                    const monthNum = (timelineQuarter - 1) * 3 + monthOffset
                    return (
                      <div 
                        key={idx}
                        style={{
                          padding: '12px 8px',
                          textAlign: 'center',
                          fontSize: '13px',
                          fontWeight: '600',
                          borderRight: idx < 2 ? '1px solid hsl(var(--border) / 0.3)' : 'none'
                        }}
                      >
                        {monthNum}월
                      </div>
                    )
                  })}
                  {timelineZoom === 'year' && ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'].map((month, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '8px',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRight: idx < 11 ? '1px solid hsl(var(--border) / 0.3)' : 'none'
                      }}
                    >
                      {month}
                    </div>
                  ))}
                </div>

                {/* 타임라인 콘텐츠 영역 */}
                <div style={{ 
                  position: 'relative',
                  minHeight: '700px',
                  padding: '16px 0'
                }}>
                  {/* 기간 구분선 */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'grid',
                    gridTemplateColumns: timelineZoom === 'month' 
                      ? 'repeat(1, 1fr)' 
                      : timelineZoom === 'quarter'
                      ? 'repeat(3, 1fr)'
                      : 'repeat(12, 1fr)',
                    pointerEvents: 'none'
                  }}>
                    {Array.from({ 
                      length: timelineZoom === 'month' ? 1 : timelineZoom === 'quarter' ? 3 : 12 
                    }).map((_, idx, arr) => (
                      <div 
                        key={idx}
                        style={{
                          borderRight: idx < arr.length - 1 ? '1px solid hsl(var(--border) / 0.2)' : 'none'
                        }}
                      />
                    ))}
                  </div>

                  {/* 시나리오 바들 */}
                  {(() => {
                    // Zoom 레벨에 따른 기간 계산
                    let baseDate: Date
                    let endDate: Date
                    let totalDays: number
                    
                    if (timelineZoom === 'month') {
                      // 특정 월의 1일부터 마지막 날까지
                      baseDate = new Date(timelineYear, timelineMonth - 1, 1)
                      endDate = new Date(timelineYear, timelineMonth, 0) // 다음 달 0일 = 이번 달 마지막 날
                      totalDays = endDate.getDate()
                    } else if (timelineZoom === 'quarter') {
                      // 특정 분기의 첫 날부터 마지막 날까지
                      const startMonth = (timelineQuarter - 1) * 3
                      baseDate = new Date(timelineYear, startMonth, 1)
                      endDate = new Date(timelineYear, startMonth + 3, 0)
                      totalDays = Math.ceil((endDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
                    } else {
                      // 특정 년도 전체
                      baseDate = new Date(timelineYear, 0, 1)
                      endDate = new Date(timelineYear, 11, 31)
                      totalDays = timelineYear % 4 === 0 ? 366 : 365 // 윤년 체크
                    }

                    // 시나리오를 날짜 순으로 정렬
                    const sortedByDate = [...currentScenarios].sort((a, b) => 
                      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                    )

                    // 각 시나리오의 레이어(row) 계산 - 겹침 방지
                    const layers: any[][] = []
                    sortedByDate.forEach(scenario => {
                      const startDate = new Date(scenario.startDate)
                      const endDate = new Date(scenario.endDate)
                      
                      // 겹치지 않는 레이어 찾기
                      let layerIndex = 0
                      while (layerIndex < layers.length) {
                        const hasOverlap = layers[layerIndex].some(item => {
                          const itemStart = new Date(item.startDate)
                          const itemEnd = new Date(item.endDate)
                          // 겹침 조건: 시작일이 다른 항목의 종료일 이전이고, 종료일이 다른 항목의 시작일 이후
                          return startDate <= itemEnd && endDate >= itemStart
                        })
                        if (!hasOverlap) break
                        layerIndex++
                      }
                      
                      if (!layers[layerIndex]) layers[layerIndex] = []
                      layers[layerIndex].push(scenario)
                    })

                    return layers.map((layer, layerIdx) => (
                      <div key={layerIdx}>
                        {layer.map((scenario) => {
                          const startDate = new Date(scenario.startDate)
                          const endDate = new Date(scenario.endDate)
                          
                          // 시작 위치와 너비 계산 (%)
                          const startDays = Math.floor((startDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))
                          const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
                          
                          const leftPercent = Math.max(0, (startDays / totalDays) * 100)
                          const widthPercent = Math.min(100 - leftPercent, (duration / totalDays) * 100)

                          const isSelected = selectedScenarios.includes(scenario.id)

                          return (
                            <div
                              key={scenario.id}
                              style={{
                                position: 'absolute',
                                left: `${leftPercent}%`,
                                width: `${widthPercent}%`,
                                top: `${layerIdx * 68 + 16}px`,
                                height: '48px',
                                padding: '8px 12px',
                                backgroundColor: 'hsl(var(--primary))',
                                color: 'hsl(var(--primary-foreground))',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: isSelected ? '2px solid hsl(var(--ring))' : 'none',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: '3px'
                              }}
                              onClick={() => toggleScenario(scenario.id)}
                              title={`${scenario.name}\n${scenario.startDate} → ${scenario.endDate}\n${scenario.creator}(${scenario.creatorId})`}
                            >
                              {/* 상태별 좌측 바 */}
                              <div style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '3px',
                                backgroundColor: scenario.status === 'Error' 
                                  ? 'hsl(var(--destructive))' 
                                  : scenario.status === 'Completed'
                                  ? 'hsl(var(--primary-foreground))'
                                  : scenario.status === 'Processing'
                                  ? 'rgba(255, 255, 255, 0.5)'
                                  : 'rgba(255, 255, 255, 0.3)'
                              }} />

                              {/* 시나리오명 */}
                              <div style={{ 
                                fontSize: '12px', 
                                fontWeight: '600',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                zIndex: 1
                              }}>
                                {scenario.name}
                              </div>
                              
                              {/* 상세 정보 */}
                              <div style={{ 
                                fontSize: '10px',
                                color: 'hsl(var(--primary-foreground))',
                                opacity: 0.85,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                zIndex: 1
                              }}>
                                {/* 타입 */}
                                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  {getTypeIcon(scenario.type)}
                                  <span>{scenario.type === 'Ratio Finder' ? 'RF' : 'RP'}</span>
                                </span>
                                <span>•</span>
                                {/* 업종 */}
                                <span>{scenario.industry}</span>
                                <span>•</span>
                                {/* 상태 */}
                                <span style={{
                                  fontWeight: '500'
                                }}>
                                  {scenario.status}
                                  {scenario.status === 'Processing' && ` (${scenario.processStep}/${scenario.totalSteps})`}
                                </span>
                                <span>•</span>
                                {/* 작성자 */}
                                <span>{scenario.creator}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 페이지네이션 */}
        {(viewMode === 'list' || viewMode === 'gantt') && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginTop: '24px'
          }}>
            {/* 좌측: 페이지 크기 선택 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px' }} className="text-muted-foreground">
                페이지당 표시:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setCurrentPage(1)
                }}
                className="input"
                style={{ 
                  width: '80px',
                  height: '32px',
                  minHeight: '32px',
                  padding: '4px 8px',
                  fontSize: '14px'
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* 우측: 페이지 정보 및 네비게이션 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {/* 페이지 정보 */}
              <span style={{ fontSize: '14px' }} className="text-muted-foreground">
                {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredScenarios.length)} / {filteredScenarios.length}개
              </span>

              {/* 페이지 네비게이션 */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {/* 첫 페이지로 */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="btn btn-ghost btn-sm"
                    style={{ 
                      width: '32px', 
                      height: '32px',
                      padding: '0',
                      opacity: currentPage === 1 ? 0.5 : 1,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ChevronLeft size={14} />
                    <ChevronLeft size={14} style={{ marginLeft: '-8px' }} />
                  </button>

                  {/* 이전 페이지 */}
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-ghost btn-sm"
                    style={{ 
                      width: '32px', 
                      height: '32px',
                      padding: '0',
                      opacity: currentPage === 1 ? 0.5 : 1,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {/* 페이지 번호들 */}
                  {(() => {
                    const pages = []
                    const maxVisible = 5
                    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
                    let end = Math.min(totalPages, start + maxVisible - 1)

                    if (end - start + 1 < maxVisible) {
                      start = Math.max(1, end - maxVisible + 1)
                    }

                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`btn btn-sm ${
                            currentPage === i ? 'btn-primary' : 'btn-ghost'
                          }`}
                          style={{ 
                            width: '32px', 
                            height: '32px',
                            padding: '0',
                            fontSize: '14px',
                            fontWeight: currentPage === i ? '600' : '400'
                          }}
                        >
                          {i}
                        </button>
                      )
                    }

                    return pages
                  })()}

                  {/* 다음 페이지 */}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-ghost btn-sm"
                    style={{ 
                      width: '32px', 
                      height: '32px',
                      padding: '0',
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ChevronRight size={14} />
                  </button>

                  {/* 마지막 페이지로 */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="btn btn-ghost btn-sm"
                    style={{ 
                      width: '32px', 
                      height: '32px',
                      padding: '0',
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ChevronRight size={14} />
                    <ChevronRight size={14} style={{ marginLeft: '-8px' }} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 이동 다이얼로그 */}
      {showMoveDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">
                시나리오 이동
              </h3>
              <p className="dialog-description">
                선택한 {selectedScenarios.length}개 시나리오를 다른 Slot으로 이동합니다.
              </p>
            </div>
            <div style={{ padding: '16px 0' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                  이동할 Slot 선택 (광고주: {slotData.advertiser})
                </label>
                <select className="input" style={{ width: '100%' }}>
                  <option value="">Slot을 선택하세요</option>
                  <option value="slot-1">삼성 갤럭시 S24 캠페인</option>
                  <option value="slot-2">삼성 갤럭시 Z Fold 캠페인</option>
                  <option value="slot-3">삼성 QLED TV 프로모션</option>
                </select>
              </div>
            </div>
            <div className="dialog-footer">
              <button
                onClick={() => setShowMoveDialog(false)}
                className="btn btn-secondary btn-sm"
              >
                취소
              </button>
              <button
                onClick={() => {
                  console.log('이동:', selectedScenarios)
                  setShowMoveDialog(false)
                  setSelectedScenarios([])
                }}
                className="btn btn-primary btn-sm"
              >
                이동
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}