import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Link2, FileSpreadsheet, Share2, Info, MoreVertical, Copy, ArrowRightLeft, Trash2, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, SearchCheck, Filter, Clock } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { maskEmail } from '../../utils/maskEmail'

interface DatasetDetailProps {
  datasetData?: any
}

export function DatasetDetail({ datasetData: propDatasetData }: DatasetDetailProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const datasetData = propDatasetData || location.state?.datasetData
  
  const slotData = location.state?.slotData || {
    title: '삼성 갤럭시 S24 캠페인',
    advertiser: '삼성전자'
  }
  
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false)
  const [configModalOpen, setConfigModalOpen] = useState(false)
  const [adProductsModalOpen, setAdProductsModalOpen] = useState(false)
  const [targetingModalOpen, setTargetingModalOpen] = useState(false)
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  
  // 필터 상태
  const [columnFilterOpen, setColumnFilterOpen] = useState<string | null>(null)
  const [filters, setFilters] = useState<{
    period: string[]
    media: string[]
    industryLarge: string[]
    industryMedium: string[]
    industrySmall: string[]
    objective: string[]
    buyingType: string[]
    platform: string[]
    performanceGoal: string[]
    targetingOption: string[]
  }>({
    period: [],
    media: [],
    industryLarge: [],
    industryMedium: [],
    industrySmall: [],
    objective: [],
    buyingType: [],
    platform: [],
    performanceGoal: [],
    targetingOption: []
  })
  const [filterTooltipOpen, setFilterTooltipOpen] = useState(false)
  const [clockTooltipOpen, setClockTooltipOpen] = useState(false)

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    setDarkModeUtil(newMode)
  }

  // 필터 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (columnFilterOpen && !target.closest('th')) {
        setColumnFilterOpen(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [columnFilterOpen])

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setShowToast({ type: 'success', message: '링크가 클립보드에 복사되었습니다.' })
      setExportMenuOpen(false)
    }).catch(() => {
      setShowToast({ type: 'error', message: '링크 복사에 실패했습니다.' })
    })
  }

  const handleExportCSV = () => {
    // CSV 다운로드 로직 (추후 구현)
    console.log('CSV 다운로드')
    setShowToast({ type: 'success', message: 'CSV 파일을 다운로드합니다.' })
    setExportMenuOpen(false)
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // 조회조건 데이터 (실제로는 props나 API에서 받아올 데이터)
  const configData = datasetData?.config || {
    media: 'Meta',
    targetingCategory: '기기유형',
    metrics: ['노출수', '클릭수', '광고비', 'CTR', 'CPC', 'CPM']
  }

  // 광고상품 컬럼 구조 동적 생성
  const getAdProductColumns = () => {
    if (configData.media === 'Meta') {
      return [
        { key: 'objective', label: '캠페인 목표' },
        { key: 'buyingType', label: '구매 유형' },
        { key: 'platform', label: '플랫폼' },
        { key: 'performanceGoal', label: '성과 목표' }
      ]
    }
    return [{ key: 'product', label: '광고상품' }]
  }

  const adProductColumns = getAdProductColumns()

  // 샘플 테이블 데이터 (5000행 제한)
  const generateSampleData = () => {
    const data = []
    
    for (let i = 0; i < 5000; i++) { // 5000행 생성
      data.push({
        period: '2024-01',
        media: configData.media,
        industryLarge: '제조업',
        industryMedium: '전자제품',
        industrySmall: '스마트폰',
        objective: 'Post Engagement',
        buyingType: 'Auction',
        platform: i % 2 === 0 ? 'Facebook' : 'Instagram',
        performanceGoal: i % 4 === 0 ? 'OFFSITE_CONVERSIONS' : i % 4 === 1 ? 'LINK_CLICKS' : i % 4 === 2 ? 'IMPRESSIONS' : 'REACH',
        targetingOption: i % 3 === 0 ? 'Mobile' : (i % 3 === 1 ? 'Desktop' : 'Tablet'),
        impressions: 1234567 + i * 1000,
        clicks: 28901 + i * 100,
        cost: 12345678 + i * 10000,
        ctr: 2.34,
        cpc: 427 + i,
        cpm: 9987 + i * 10
      })
    }
    return data
  }

  const sampleData = generateSampleData()

  // 지표 이름을 데이터 키로 매핑
  const metricToKey: { [key: string]: string } = {
    '노출수': 'impressions',
    '클릭수': 'clicks',
    '광고비': 'cost',
    'CTR': 'ctr',
    'CPC': 'cpc',
    'CPM': 'cpm'
  }

  const getSortedData = () => {
    if (!sortConfig) return sampleData
    
    const dataKey = metricToKey[sortConfig.key] || sortConfig.key
    
    const sorted = [...sampleData].sort((a: any, b: any) => {
      const aValue = a[dataKey]
      const bValue = b[dataKey]
      
      // 숫자인지 확인
      const aIsNumber = typeof aValue === 'number' || !isNaN(parseFloat(aValue))
      const bIsNumber = typeof bValue === 'number' || !isNaN(parseFloat(bValue))
      
      if (aIsNumber && bIsNumber) {
        // 숫자 비교
        const aNum = typeof aValue === 'number' ? aValue : parseFloat(aValue)
        const bNum = typeof bValue === 'number' ? bValue : parseFloat(bValue)
        
        if (sortConfig.direction === 'asc') {
          return aNum - bNum
        } else {
          return bNum - aNum
        }
      } else {
        // 문자열 비교
        const aStr = String(aValue || '').toLowerCase()
        const bStr = String(bValue || '').toLowerCase()
        
        if (sortConfig.direction === 'asc') {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      }
    })
    
    return sorted
  }

  // 필터링 적용
  const getFilteredData = () => {
    let data = getSortedData()
    
    // 컬럼별 필터 적용
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        data = data.filter((row: any) => values.includes(String(row[key])))
      }
    })
    
    return data
  }

  // 고유 값 추출 (필터 옵션용)
  const getUniqueValues = (key: string) => {
    const values = sampleData.map((row: any) => String(row[key]))
    return Array.from(new Set(values)).sort()
  }

  // 페이지네이션 로직
  const filteredData = getFilteredData()
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageData = filteredData.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 페이지네이션 컴포넌트
  const renderPagination = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginTop: '0'
      }}>
        {/* 좌측: 페이지 크기 선택 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px' }} className="text-muted-foreground">
            페이지당 표시:
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
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
            <option value={100}>100</option>
          </select>
        </div>

        {/* 우측: 페이지 정보 및 네비게이션 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* 페이지 정보 */}
          <span style={{ fontSize: '14px' }} className="text-muted-foreground">
            {startItem}-{endItem} / {totalItems}개
          </span>

          {/* 페이지 네비게이션 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* 첫 페이지로 */}
            <button
              onClick={() => handlePageChange(1)}
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
              onClick={() => handlePageChange(currentPage - 1)}
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
                    onClick={() => handlePageChange(i)}
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
              onClick={() => handlePageChange(currentPage + 1)}
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
              onClick={() => handlePageChange(totalPages)}
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
        </div>
      </div>
    )
  }

  return (
    <AppLayout
      currentView="datasetDetail"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', href: '/slotboard' },
        { label: slotData?.title || '삼성 갤럭시 S24 캠페인' },
        { label: 'DataShot', href: '/datashot' },
        { label: datasetData?.name || '2024 Q1 Meta 캠페인 데이터' }
      ]}
      isDarkMode={isDarkMode}
      onToggleDarkMode={handleToggleDarkMode}
      sidebarProps={{
        isCollapsed: isSidebarCollapsed,
        expandedFolders,
        onToggleSidebar: toggleSidebar,
        onToggleFolder: toggleFolder,
        onNavigateToWorkspace: () => navigate('/slotboard')
      }}
    >
      {/* Header - Single Line Layout */}
      <div className="slot-detail-header">
        <div className="slot-detail-header__main" style={{ alignItems: 'center' }}>
          {/* 좌측: 타이틀 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            flex: 1,
            minWidth: 0
          }}>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: '500', 
              margin: 0,
              fontFamily: 'Paperlogy, sans-serif',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0
            }}>
              {datasetData?.name || '2024 Q1 Meta 캠페인 데이터'}
            </h1>
          </div>

          {/* 중앙: 조회조건 요약 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            fontSize: '12px',
            fontFamily: 'Paperlogy, sans-serif',
            flexShrink: 0
          }} className="text-muted-foreground">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>매체</span>
              <span style={{ color: 'hsl(var(--foreground))', fontWeight: '500' }}>{configData.media}</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>조회기간</span>
              <span style={{ color: 'hsl(var(--foreground))', fontWeight: '500' }}>2024-01 → 2024-06</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>업종 11개</span>
              <SearchCheck 
                size={14} 
                style={{ cursor: 'pointer' }}
                onClick={() => setConfigModalOpen(true)}
              />
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>광고상품 72개</span>
              <SearchCheck 
                size={14} 
                style={{ cursor: 'pointer' }}
                onClick={() => setAdProductsModalOpen(true)}
              />
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>타겟팅 옵션 1개</span>
              <SearchCheck 
                size={14} 
                style={{ cursor: 'pointer' }}
                onClick={() => setTargetingModalOpen(true)}
              />
            </div>
          </div>

          <div style={{ 
            width: '1px', 
            height: '24px', 
            backgroundColor: 'hsl(var(--border))',
            margin: '0 8px',
            flexShrink: 0
          }} />

          {/* 우측: 액션 버튼들 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Export 드롭다운 */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '6px' }}
              >
                <Share2 size={16} />
              </button>
              
              {exportMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '180px',
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  zIndex: 1000,
                  fontFamily: 'Paperlogy, sans-serif',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={handleCopyLink}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background-color 0.2s',
                      color: 'hsl(var(--foreground))'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Link2 size={16} />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background-color 0.2s',
                      color: 'hsl(var(--foreground))'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FileSpreadsheet size={16} />
                    <span>Export to CSV</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* Info 아이콘 */}
            <div style={{ position: 'relative' }}>
              <button
                data-info-tooltip
                onMouseEnter={() => setInfoTooltipOpen(true)}
                onMouseLeave={() => setInfoTooltipOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '6px' }}
              >
                <Info size={16} />
              </button>
              
              {infoTooltipOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '280px',
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  zIndex: 1000,
                  fontFamily: 'Paperlogy, sans-serif'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>설명</div>
                    <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                      {datasetData?.description || '선택한 조건으로 추출된 광고 성과 데이터입니다.'}
                    </div>
                  </div>
                  
                  <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '8px 0' }} />
                  
                  <div style={{ marginBottom: '12px' }}>
                    <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>Dataset ID</div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>#{datasetData?.id || '1'}</div>
                  </div>
                  
                  <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '8px 0' }} />
                  
                  <div>
                    <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>생성일시</div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{datasetData?.created || '2024-01-10 14:30'}</div>
                    <div className="text-muted-foreground" style={{ fontSize: '12px' }}>
                      {datasetData?.creator || '김철수'} ({maskEmail(datasetData?.creatorId || 'kimcheolsu@gmail.com')})
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menu 버튼 */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setContextMenuOpen(!contextMenuOpen)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '6px' }}
              >
                <MoreVertical size={16} />
              </button>
              
              {contextMenuOpen && (
                <div className="dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  width: '120px',
                  zIndex: 1000
                }}>
                  <button
                    onClick={() => {
                      setContextMenuOpen(false)
                      console.log('복제:', datasetData?.id)
                    }}
                    className="dropdown-item"
                  >
                    <Copy size={14} />
                    복제
                  </button>
                  <button
                    onClick={() => {
                      setContextMenuOpen(false)
                      console.log('이동:', datasetData?.id)
                    }}
                    className="dropdown-item"
                  >
                    <ArrowRightLeft size={14} />
                    이동
                  </button>
                  <button
                    onClick={() => {
                      setContextMenuOpen(false)
                      console.log('삭제:', datasetData?.id)
                    }}
                    className="dropdown-item"
                  >
                    <Trash2 size={14} />
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="workspace-content" style={{ maxWidth: '100%', overflow: 'hidden' }}>

        {/* 추출 데이터 테이블 */}
        <div style={{ marginBottom: '32px' }}>
          {/* 테이블 타이틀 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between',
            marginBottom: '12px',
            gap: '16px'
          }}>
            <div style={{ 
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '500',
                fontFamily: 'Paperlogy, sans-serif',
                margin: 0,
                color: 'hsl(var(--foreground))'
              }}>
                Extracted Data
              </h3>
              {/* Clock 아이콘 - 데이터 기준 일시 */}
              <div style={{ position: 'relative' }}>
                <Clock 
                  size={18} 
                  style={{ 
                    cursor: 'pointer',
                    color: 'hsl(var(--muted-foreground))'
                  }}
                  onMouseEnter={() => setClockTooltipOpen(true)}
                  onMouseLeave={() => setClockTooltipOpen(false)}
                />
                {clockTooltipOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '8px',
                    width: '220px',
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    zIndex: 1000,
                    fontFamily: 'Paperlogy, sans-serif',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    whiteSpace: 'nowrap'
                  }}>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>데이터 기준 일시</div>
                    <div style={{ color: 'hsl(var(--muted-foreground))' }}>2024-03-10 14:30:25</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 액션 바 - 결과 표시 */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            {/* 결과 개수 */}
            <div style={{
              fontSize: '13px',
              color: 'hsl(var(--muted-foreground))',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>{totalItems.toLocaleString()} / {(12345).toLocaleString()} 결과</span>
              <div style={{ position: 'relative' }}>
                <Info 
                  size={16} 
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setFilterTooltipOpen(true)}
                  onMouseLeave={() => setFilterTooltipOpen(false)}
                />
                {filterTooltipOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '320px',
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    zIndex: 1000,
                    fontFamily: 'Paperlogy, sans-serif',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    whiteSpace: 'normal'
                  }}>
                    전체 {(12345).toLocaleString()}행 중 5,000행만 표시됩니다. 전체 데이터는 CSV 다운로드를 통해 확인하세요.
                  </div>
                )}
              </div>
            </div>
          </div>

          
          {/* 테이블 */}
          <div style={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ 
                    backgroundColor: 'hsl(var(--muted))',
                    borderBottom: '1px solid hsl(var(--border))'
                  }}>
                    <th 
                      onClick={() => handleSort('period')}
                      style={{ 
                        padding: '12px 8px', 
                        textAlign: 'left', 
                        fontWeight: '500', 
                        whiteSpace: 'nowrap', 
                        fontSize: '12px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        기간
                        {sortConfig?.key === 'period' && (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                        <Filter 
                          size={12} 
                          style={{ 
                            marginLeft: 'auto',
                            opacity: filters.period.length > 0 ? 1 : 0.4,
                            color: filters.period.length > 0 ? 'hsl(var(--primary))' : 'currentColor'
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setColumnFilterOpen(columnFilterOpen === 'period' ? null : 'period')
                          }}
                        />
                      </div>
                      {columnFilterOpen === 'period' && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: '4px',
                            width: '220px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            zIndex: 1000,
                            padding: '12px'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600' }}>기간</span>
                            {filters.period.length > 0 && (
                              <button
                                onClick={() => {
                                  setFilters(prev => ({ ...prev, period: [] }))
                                  setCurrentPage(1)
                                }}
                                style={{
                                  fontSize: '11px',
                                  color: 'hsl(var(--primary))',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '2px 6px'
                                }}
                              >
                                초기화
                              </button>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {getUniqueValues('period').map(value => (
                              <label
                                key={value}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={filters.period.includes(value)}
                                  onChange={(e) => {
                                    const checked = e.target.checked
                                    setFilters(prev => ({
                                      ...prev,
                                      period: checked
                                        ? [...prev.period, value]
                                        : prev.period.filter(v => v !== value)
                                    }))
                                    setCurrentPage(1)
                                  }}
                                  className="checkbox-custom"
                                />
                                <span>{value}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </th>
                    <th 
                      onClick={() => handleSort('media')}
                      style={{ 
                        padding: '12px 8px', 
                        textAlign: 'left', 
                        fontWeight: '500', 
                        whiteSpace: 'nowrap', 
                        fontSize: '12px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        매체
                        {sortConfig?.key === 'media' && (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                        <Filter 
                          size={12} 
                          style={{ 
                            marginLeft: 'auto',
                            opacity: filters.media.length > 0 ? 1 : 0.4,
                            color: filters.media.length > 0 ? 'hsl(var(--primary))' : 'currentColor'
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setColumnFilterOpen(columnFilterOpen === 'media' ? null : 'media')
                          }}
                        />
                      </div>
                      {columnFilterOpen === 'media' && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: '4px',
                            width: '220px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            zIndex: 1000,
                            padding: '12px'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600' }}>매체</span>
                            {filters.media.length > 0 && (
                              <button
                                onClick={() => {
                                  setFilters(prev => ({ ...prev, media: [] }))
                                  setCurrentPage(1)
                                }}
                                style={{
                                  fontSize: '11px',
                                  color: 'hsl(var(--primary))',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '2px 6px'
                                }}
                              >
                                초기화
                              </button>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {getUniqueValues('media').map(value => (
                              <label
                                key={value}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={filters.media.includes(value)}
                                  onChange={(e) => {
                                    const checked = e.target.checked
                                    setFilters(prev => ({
                                      ...prev,
                                      media: checked
                                        ? [...prev.media, value]
                                        : prev.media.filter(v => v !== value)
                                    }))
                                    setCurrentPage(1)
                                  }}
                                  className="checkbox-custom"
                                />
                                <span>{value}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </th>
                    <th 
                      onClick={() => handleSort('industryLarge')}
                      style={{ 
                        padding: '12px 8px', 
                        textAlign: 'left', 
                        fontWeight: '500', 
                        whiteSpace: 'nowrap', 
                        fontSize: '12px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        업종(대)
                        {sortConfig?.key === 'industryLarge' && (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                        <Filter 
                          size={12} 
                          style={{ 
                            marginLeft: 'auto',
                            opacity: filters.industryLarge.length > 0 ? 1 : 0.4,
                            color: filters.industryLarge.length > 0 ? 'hsl(var(--primary))' : 'currentColor'
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setColumnFilterOpen(columnFilterOpen === 'industryLarge' ? null : 'industryLarge')
                          }}
                        />
                      </div>
                      {columnFilterOpen === 'industryLarge' && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: '4px',
                            width: '220px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            zIndex: 1000,
                            padding: '12px'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600' }}>업종(대)</span>
                            {filters.industryLarge.length > 0 && (
                              <button
                                onClick={() => {
                                  setFilters(prev => ({ ...prev, industryLarge: [] }))
                                  setCurrentPage(1)
                                }}
                                style={{
                                  fontSize: '11px',
                                  color: 'hsl(var(--primary))',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '2px 6px'
                                }}
                              >
                                초기화
                              </button>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {getUniqueValues('industryLarge').map(value => (
                              <label
                                key={value}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={filters.industryLarge.includes(value)}
                                  onChange={(e) => {
                                    const checked = e.target.checked
                                    setFilters(prev => ({
                                      ...prev,
                                      industryLarge: checked
                                        ? [...prev.industryLarge, value]
                                        : prev.industryLarge.filter(v => v !== value)
                                    }))
                                    setCurrentPage(1)
                                  }}
                                  className="checkbox-custom"
                                />
                                <span>{value}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </th>
                    <th 
                      onClick={() => handleSort('industryMedium')}
                      style={{ 
                        padding: '12px 8px', 
                        textAlign: 'left', 
                        fontWeight: '500', 
                        whiteSpace: 'nowrap', 
                        fontSize: '12px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        업종(중)
                        {sortConfig?.key === 'industryMedium' && (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                        <Filter 
                          size={12} 
                          style={{ 
                            marginLeft: 'auto',
                            opacity: filters.industryMedium.length > 0 ? 1 : 0.4,
                            color: filters.industryMedium.length > 0 ? 'hsl(var(--primary))' : 'currentColor'
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setColumnFilterOpen(columnFilterOpen === 'industryMedium' ? null : 'industryMedium')
                          }}
                        />
                      </div>
                      {columnFilterOpen === 'industryMedium' && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: '4px',
                            width: '220px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            zIndex: 1000,
                            padding: '12px'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600' }}>업종(중)</span>
                            {filters.industryMedium.length > 0 && (
                              <button
                                onClick={() => {
                                  setFilters(prev => ({ ...prev, industryMedium: [] }))
                                  setCurrentPage(1)
                                }}
                                style={{
                                  fontSize: '11px',
                                  color: 'hsl(var(--primary))',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '2px 6px'
                                }}
                              >
                                초기화
                              </button>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {getUniqueValues('industryMedium').map(value => (
                              <label
                                key={value}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={filters.industryMedium.includes(value)}
                                  onChange={(e) => {
                                    const checked = e.target.checked
                                    setFilters(prev => ({
                                      ...prev,
                                      industryMedium: checked
                                        ? [...prev.industryMedium, value]
                                        : prev.industryMedium.filter(v => v !== value)
                                    }))
                                    setCurrentPage(1)
                                  }}
                                  className="checkbox-custom"
                                />
                                <span>{value}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </th>
                    <th 
                      onClick={() => handleSort('industrySmall')}
                      style={{ 
                        padding: '12px 8px', 
                        textAlign: 'left', 
                        fontWeight: '500', 
                        whiteSpace: 'nowrap', 
                        fontSize: '12px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        업종(소)
                        {sortConfig?.key === 'industrySmall' && (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                        <Filter 
                          size={12} 
                          style={{ 
                            marginLeft: 'auto',
                            opacity: filters.industrySmall.length > 0 ? 1 : 0.4,
                            color: filters.industrySmall.length > 0 ? 'hsl(var(--primary))' : 'currentColor'
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setColumnFilterOpen(columnFilterOpen === 'industrySmall' ? null : 'industrySmall')
                          }}
                        />
                      </div>
                      {columnFilterOpen === 'industrySmall' && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: '4px',
                            width: '220px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            zIndex: 1000,
                            padding: '12px'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600' }}>업종(소)</span>
                            {filters.industrySmall.length > 0 && (
                              <button
                                onClick={() => {
                                  setFilters(prev => ({ ...prev, industrySmall: [] }))
                                  setCurrentPage(1)
                                }}
                                style={{
                                  fontSize: '11px',
                                  color: 'hsl(var(--primary))',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '2px 6px'
                                }}
                              >
                                초기화
                              </button>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {getUniqueValues('industrySmall').map(value => (
                              <label
                                key={value}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={filters.industrySmall.includes(value)}
                                  onChange={(e) => {
                                    const checked = e.target.checked
                                    setFilters(prev => ({
                                      ...prev,
                                      industrySmall: checked
                                        ? [...prev.industrySmall, value]
                                        : prev.industrySmall.filter(v => v !== value)
                                    }))
                                    setCurrentPage(1)
                                  }}
                                  className="checkbox-custom"
                                />
                                <span>{value}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </th>
                    {adProductColumns.map((col) => (
                      <th 
                        key={col.key} 
                        onClick={() => handleSort(col.key)}
                        style={{ 
                          padding: '12px 8px', 
                          textAlign: 'left', 
                          fontWeight: '500', 
                          whiteSpace: 'nowrap', 
                          fontSize: '12px',
                          cursor: 'pointer',
                          userSelect: 'none',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {col.label}
                          {sortConfig?.key === col.key && (
                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                          )}
                          <Filter 
                            size={12} 
                            style={{ 
                              marginLeft: 'auto',
                              opacity: filters[col.key as keyof typeof filters]?.length > 0 ? 1 : 0.4,
                              color: filters[col.key as keyof typeof filters]?.length > 0 ? 'hsl(var(--primary))' : 'currentColor'
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setColumnFilterOpen(columnFilterOpen === col.key ? null : col.key)
                            }}
                          />
                        </div>
                        {columnFilterOpen === col.key && (
                          <div 
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              marginTop: '4px',
                              width: '220px',
                              maxHeight: '300px',
                              overflowY: 'auto',
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                              zIndex: 1000,
                              padding: '12px'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600' }}>{col.label}</span>
                              {filters[col.key as keyof typeof filters]?.length > 0 && (
                                <button
                                  onClick={() => {
                                    setFilters(prev => ({ ...prev, [col.key]: [] }))
                                    setCurrentPage(1)
                                  }}
                                  style={{
                                    fontSize: '11px',
                                    color: 'hsl(var(--primary))',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '2px 6px'
                                  }}
                                >
                                  초기화
                                </button>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {getUniqueValues(col.key).map(value => (
                                <label
                                  key={value}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={filters[col.key as keyof typeof filters]?.includes(value) || false}
                                    onChange={(e) => {
                                      const checked = e.target.checked
                                      setFilters(prev => ({
                                        ...prev,
                                        [col.key]: checked
                                          ? [...(prev[col.key as keyof typeof prev] || []), value]
                                          : (prev[col.key as keyof typeof prev] || []).filter(v => v !== value)
                                      }))
                                      setCurrentPage(1)
                                    }}
                                    className="checkbox-custom"
                                  />
                                  <span>{value}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </th>
                    ))}
                    {configData.targetingCategory && (
                      <th 
                        onClick={() => handleSort('targetingOption')}
                        style={{ 
                          padding: '12px 8px', 
                          textAlign: 'left', 
                          fontWeight: '500', 
                          whiteSpace: 'nowrap', 
                          fontSize: '12px',
                          cursor: 'pointer',
                          userSelect: 'none',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {configData.targetingCategory}
                          {sortConfig?.key === 'targetingOption' && (
                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                          )}
                          <Filter 
                            size={12} 
                            style={{ 
                              marginLeft: 'auto',
                              opacity: filters.targetingOption.length > 0 ? 1 : 0.4,
                              color: filters.targetingOption.length > 0 ? 'hsl(var(--primary))' : 'currentColor'
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setColumnFilterOpen(columnFilterOpen === 'targetingOption' ? null : 'targetingOption')
                            }}
                          />
                        </div>
                        {columnFilterOpen === 'targetingOption' && (
                          <div 
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              marginTop: '4px',
                              width: '220px',
                              maxHeight: '300px',
                              overflowY: 'auto',
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                              zIndex: 1000,
                              padding: '12px'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600' }}>{configData.targetingCategory}</span>
                              {filters.targetingOption.length > 0 && (
                                <button
                                  onClick={() => {
                                    setFilters(prev => ({ ...prev, targetingOption: [] }))
                                    setCurrentPage(1)
                                  }}
                                  style={{
                                    fontSize: '11px',
                                    color: 'hsl(var(--primary))',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '2px 6px'
                                  }}
                                >
                                  초기화
                                </button>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {getUniqueValues('targetingOption').map(value => (
                                <label
                                  key={value}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={filters.targetingOption.includes(value)}
                                    onChange={(e) => {
                                      const checked = e.target.checked
                                      setFilters(prev => ({
                                        ...prev,
                                        targetingOption: checked
                                          ? [...prev.targetingOption, value]
                                          : prev.targetingOption.filter(v => v !== value)
                                      }))
                                      setCurrentPage(1)
                                    }}
                                    className="checkbox-custom"
                                  />
                                  <span>{value}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </th>
                    )}
                    {/* 지표 컬럼 - 정렬만 가능 (필터 없음) */}
                    {configData.metrics.map((metric: string) => (
                      <th 
                        key={metric}
                        onClick={() => handleSort(metric)}
                        style={{ 
                          padding: '12px 8px', 
                          textAlign: 'right', 
                          fontWeight: '500', 
                          whiteSpace: 'nowrap',
                          fontSize: '12px',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                          {metric}
                          {sortConfig?.key === metric && (
                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((row, index) => (
                    <tr 
                      key={index}
                      style={{ 
                        borderBottom: '1px solid hsl(var(--border))',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">{row.period}</td>
                      <td style={{ padding: '8px', fontSize: '11px' }}>{row.media}</td>
                      <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">{row.industryLarge}</td>
                      <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">{row.industryMedium}</td>
                      <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">{row.industrySmall}</td>
                      {adProductColumns.map((col) => (
                        <td key={col.key} style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">
                          {(row as any)[col.key] || '—'}
                        </td>
                      ))}
                      {configData.targetingCategory && (
                        <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">
                          {row.targetingOption || '—'}
                        </td>
                      )}
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }} className="text-muted-foreground">
                        {row.impressions.toLocaleString()}
                        <span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>회</span>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }} className="text-muted-foreground">
                        {row.clicks.toLocaleString()}
                        <span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>회</span>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }} className="text-muted-foreground">
                        {row.cost.toLocaleString()}
                        <span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>원</span>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }} className="text-muted-foreground">{row.ctr}%</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }} className="text-muted-foreground">
                        {row.cpc.toLocaleString()}
                        <span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>원</span>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }} className="text-muted-foreground">
                        {row.cpm.toLocaleString()}
                        <span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>원</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 페이지네이션 */}
          {renderPagination()}
        </div>
      </div>

      {/* Toast 알림 */}
      {showToast && (
        <div className={`toast toast--${showToast.type}`}>
          <div className="toast__content">
            <p className="toast__title">{showToast.message}</p>
          </div>
          <button
            onClick={() => setShowToast(null)}
            className="toast__close"
          >
            ×
          </button>
        </div>
      )}

      {/* 선택한 업종 모달 */}
      {configModalOpen && (
        <div className="dialog-overlay" onClick={() => setConfigModalOpen(false)}>
          <div 
            className="dialog-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              width: '900px', 
              maxWidth: '95vw',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className="dialog-header">
              <h3 className="dialog-title">선택한 업종</h3>
              <p className="dialog-description">
                이 데이터셋에 적용된 업종입니다
              </p>
            </div>
            
            <div style={{ 
              padding: '24px', 
              flex: 1, 
              overflowY: 'auto'
            }}>
              {/* 선택된 업종 테이블 */}
              <div style={{
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {/* 테이블 헤더 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  padding: '12px 16px',
                  backgroundColor: 'hsl(var(--muted) / 0.5)',
                  borderBottom: '1px solid hsl(var(--border))',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'hsl(var(--muted-foreground))'
                }}>
                  선택한 업종 (11개)
                </div>

                {/* 테이블 바디 */}
                <div>
                  {['가정용전기전자 > 가사용전기전자 > 가사용전기전자기타', 
                    '가정용전기전자 > 가사용전기전자 > 가습기', 
                    '가정용전기전자 > 가사용전기전자 > 다리미', 
                    '가정용전기전자 > 가사용전기전자 > 세탁기',
                    '가정용전기전자 > 가사용전기전자 > 청소기',
                    '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자기타PR',
                    '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자기업공고',
                    '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자기타',
                    '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
                    '가정용전기전자 > 냉난방기 > 냉난방기기타',
                    '가정용전기전자 > 냉난방기 > 에어컨'].map((industry, idx) => {
                    const parts = industry.split(' > ')
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr',
                          padding: '12px 16px',
                          alignItems: 'center',
                          borderBottom: idx < 10 ? '1px solid hsl(var(--border))' : 'none',
                          fontSize: '13px'
                        }}
                      >
                        <div style={{ lineHeight: '1.4' }}>
                          {parts.map((part, partIdx) => (
                            <span key={partIdx}>
                              {partIdx > 0 && (
                                <span style={{ 
                                  color: 'hsl(var(--muted-foreground))',
                                  margin: '0 4px'
                                }}>
                                  {'>'}
                                </span>
                              )}
                              <span style={{ 
                                color: partIdx === parts.length - 1 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                              }}>
                                {part}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="dialog-footer">
              <button
                onClick={() => setConfigModalOpen(false)}
                className="btn btn-primary btn-md"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 선택한 광고상품 모달 */}
      {adProductsModalOpen && (
        <div className="dialog-overlay" onClick={() => setAdProductsModalOpen(false)}>
          <div 
            className="dialog-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              width: '900px', 
              maxWidth: '95vw',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className="dialog-header">
              <h3 className="dialog-title">선택한 광고상품</h3>
              <p className="dialog-description">
                이 데이터셋에 적용된 광고상품입니다
              </p>
            </div>
            
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {/* 조건 1 */}
              <div style={{
                marginBottom: '16px',
                padding: '20px',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                backgroundColor: 'hsl(var(--card))'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600' }}>
                    조건 1
                  </h3>
                </div>

                {/* 캠페인 목표 */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    캠페인 목표 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                  </label>
                  <select
                    value="POST_ENGAGEMENT"
                    disabled
                    className="input"
                    style={{ 
                      width: '100%', 
                      appearance: 'none', 
                      paddingRight: '32px',
                      opacity: 0.6,
                      cursor: 'not-allowed'
                    }}
                  >
                    <option value="POST_ENGAGEMENT">POST_ENGAGEMENT</option>
                  </select>
                </div>

                {/* 구매 유형 */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    구매 유형
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', width: '100%', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      전체
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      AUCTION
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      RESERVED
                    </label>
                  </div>
                </div>

                {/* 플랫폼 */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    플랫폼
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      facebook
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      instagram
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      facebook&instagram
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      audience_network
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      facebook&instagram&messenger
                    </label>
                  </div>
                </div>

                {/* 성과 목표 */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    성과 목표
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      OFFSITE_CONVERSIONS
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      LINK_CLICKS
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      IMPRESSIONS
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      LEAD_GENERATION
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      REACH
                    </label>
                  </div>
                </div>
              </div>

              {/* OR 구분선 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '16px 0',
                gap: '12px'
              }}>
                <div style={{
                  flex: 1,
                  height: '1px',
                  backgroundColor: 'hsl(var(--border))'
                }} />
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'hsl(var(--muted-foreground))',
                  padding: '4px 12px',
                  backgroundColor: 'hsl(var(--muted))',
                  borderRadius: '12px',
                  border: '1px solid hsl(var(--border))'
                }}>
                  OR
                </span>
                <div style={{
                  flex: 1,
                  height: '1px',
                  backgroundColor: 'hsl(var(--border))'
                }} />
              </div>

              {/* 조건 2 */}
              <div style={{
                padding: '20px',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                backgroundColor: 'hsl(var(--card))'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600' }}>
                    조건 2
                  </h3>
                </div>

                {/* 캠페인 목표 */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    캠페인 목표 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                  </label>
                  <select
                    value="REACH"
                    disabled
                    className="input"
                    style={{ 
                      width: '100%', 
                      appearance: 'none', 
                      paddingRight: '32px',
                      opacity: 0.6,
                      cursor: 'not-allowed'
                    }}
                  >
                    <option value="REACH">REACH</option>
                  </select>
                </div>

                {/* 구매 유형 */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    구매 유형
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', width: '100%', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      전체
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      AUCTION
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      RESERVED
                    </label>
                  </div>
                </div>

                {/* 플랫폼 */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    플랫폼
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      facebook
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      instagram
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      messenger
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      audience_network
                    </label>
                  </div>
                </div>

                {/* 성과 목표 */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                    성과 목표
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      LINK_CLICKS
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      OFFSITE_CONVERSIONS
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      LEAD_GENERATION
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      IMPRESSIONS
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: 'calc(50% - 4px)', opacity: 0.6 }}>
                      <input type="checkbox" checked disabled className="checkbox-custom" style={{ cursor: 'not-allowed' }} />
                      REACH
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="dialog-footer">
              <button
                onClick={() => setAdProductsModalOpen(false)}
                className="btn btn-primary btn-md"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 선택한 타겟팅 옵션 모달 */}
      {targetingModalOpen && (
        <div className="dialog-overlay" onClick={() => setTargetingModalOpen(false)}>
          <div 
            className="dialog-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              width: '900px', 
              maxWidth: '95vw',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className="dialog-header">
              <h3 className="dialog-title">선택한 타겟팅 옵션</h3>
              <p className="dialog-description">
                이 데이터셋에 적용된 타겟팅 옵션입니다
              </p>
            </div>
            
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
              {/* 타겟팅 기준 */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  타겟팅 기준
                </label>
                <select
                  value="기기유형"
                  disabled
                  className="input"
                  style={{ 
                    width: '100%', 
                    height: '36px', 
                    padding: '8px 12px',
                    opacity: 0.6,
                    cursor: 'not-allowed'
                  }}
                >
                  <option value="기기유형">기기유형</option>
                </select>
              </div>

              {/* 타겟팅 세부 옵션 */}
              <div style={{
                padding: '16px',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                backgroundColor: 'hsl(var(--muted) / 0.1)'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>
                  기기유형 옵션 (다중 선택 가능)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      border: '1px solid hsl(var(--primary))',
                      borderRadius: '6px',
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                      opacity: 0.6,
                      cursor: 'not-allowed'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked
                      disabled
                      className="checkbox-custom"
                      style={{ cursor: 'not-allowed' }}
                    />
                    <span style={{ fontSize: '13px' }}>데스크톱</span>
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      opacity: 0.6,
                      cursor: 'not-allowed'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      disabled
                      className="checkbox-custom"
                      style={{ cursor: 'not-allowed' }}
                    />
                    <span style={{ fontSize: '13px' }}>모바일 웹</span>
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      opacity: 0.6,
                      cursor: 'not-allowed'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      disabled
                      className="checkbox-custom"
                      style={{ cursor: 'not-allowed' }}
                    />
                    <span style={{ fontSize: '13px' }}>분류되지 않음</span>
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      opacity: 0.6,
                      cursor: 'not-allowed'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      disabled
                      className="checkbox-custom"
                      style={{ cursor: 'not-allowed' }}
                    />
                    <span style={{ fontSize: '13px' }}>앱 내</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="dialog-footer">
              <button
                onClick={() => setTargetingModalOpen(false)}
                className="btn btn-primary btn-md"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
