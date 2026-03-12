import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Link2, FileSpreadsheet, Share2, Info, MoreVertical, Copy, ArrowRightLeft, Trash2, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, SearchCheck, Search, X } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { maskEmail } from '../../utils/maskEmail'
import { DatasetCharts } from './DatasetCharts'
import { IndustryModal, AdProductsModal, MetricsModal } from './DatasetDetailModals'

interface DatasetDetailProps {
  datasetData?: any
}

// 지표 필터 타입
interface MetricFilter {
  operator: '>' | '<' | '=' | '≥' | '≤' | ''
  value: string
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
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  
  // 모달 상태
  const [industryModalOpen, setIndustryModalOpen] = useState(false)
  const [adProductsModalOpen, setAdProductsModalOpen] = useState(false)
  const [metricsModalOpen, setMetricsModalOpen] = useState(false)
  
  // 필터 상태 - 목록형 필터
  const [listFilters, setListFilters] = useState<{
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

  // 지표 필터 상태
  const [metricFilters, setMetricFilters] = useState<{
    impressions: MetricFilter
    clicks: MetricFilter
    cost: MetricFilter
    ctr: MetricFilter
    cpc: MetricFilter
    cpm: MetricFilter
  }>({
    impressions: { operator: '=', value: '' },
    clicks: { operator: '=', value: '' },
    cost: { operator: '=', value: '' },
    ctr: { operator: '=', value: '' },
    cpc: { operator: '=', value: '' },
    cpm: { operator: '=', value: '' }
  })

  // 필터 드롭다운 열림 상태
  const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(null)
  
  // 필터 드롭다운 내 검색어
  const [filterSearchTerms, setFilterSearchTerms] = useState<{ [key: string]: string }>({})

  const [clockTooltipOpen, setClockTooltipOpen] = useState(false)

  // 지표 데이터 (모달에 전달할 데이터)
  const metricsData = [
    {
      group: '성과',
      metrics: ['노출수', '클릭수', '광고비', 'CTR', 'CPC', 'CPM']
    },
    {
      group: '참여',
      metrics: ['링크 클릭 수', '링크 클릭률', '게시물 참여수']
    },
    {
      group: '전환',
      metrics: ['구매수', '구매당 비용', '등록 완료수']
    }
  ]

  // 전체 지표 개수 계산
  const totalMetricsCount = metricsData.reduce((sum, group) => sum + group.metrics.length, 0)

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    setDarkModeUtil(newMode)
  }

  // 필터 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (openFilterDropdown && !target.closest('.filter-dropdown-container')) {
        setOpenFilterDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openFilterDropdown])

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setExportMenuOpen(false)
  }

  const handleExportCSV = () => {
    console.log('CSV 다운로드')
    setExportMenuOpen(false)
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // 조회조건 데이터
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

  // 샘플 테이블 데이터
  const generateSampleData = () => {
    const data = []
    
    for (let i = 0; i < 100; i++) {
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
        ctr: 2.34 + (i * 0.01),
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
      
      const aIsNumber = typeof aValue === 'number' || !isNaN(parseFloat(aValue))
      const bIsNumber = typeof bValue === 'number' || !isNaN(parseFloat(bValue))
      
      if (aIsNumber && bIsNumber) {
        const aNum = typeof aValue === 'number' ? aValue : parseFloat(aValue)
        const bNum = typeof bValue === 'number' ? bValue : parseFloat(bValue)
        
        if (sortConfig.direction === 'asc') {
          return aNum - bNum
        } else {
          return bNum - aNum
        }
      } else {
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
    
    // 목록형 필터 적용
    Object.entries(listFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        data = data.filter((row: any) => values.includes(String(row[key])))
      }
    })
    
    // 지표 필터 적용
    Object.entries(metricFilters).forEach(([key, filter]) => {
      if (filter.operator && filter.value) {
        const filterValue = parseFloat(filter.value)
        if (!isNaN(filterValue)) {
          data = data.filter((row: any) => {
            const rowValue = row[key]
            switch (filter.operator) {
              case '>': return rowValue > filterValue
              case '<': return rowValue < filterValue
              case '=': return rowValue === filterValue
              case '≥': return rowValue >= filterValue
              case '≤': return rowValue <= filterValue
              default: return true
            }
          })
        }
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

  // 목록형 필터 렌더링
  const renderListFilter = (columnKey: string) => {
    const uniqueValues = getUniqueValues(columnKey)
    const searchTerm = filterSearchTerms[columnKey] || ''
    const filteredValues = uniqueValues.filter(v => 
      v.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const selectedValues = listFilters[columnKey as keyof typeof listFilters] || []
    const allSelected = selectedValues.length === uniqueValues.length

    return (
      <td 
        key={columnKey}
        style={{ 
          padding: '8px', 
          position: 'relative',
          backgroundColor: 'hsl(var(--muted) / 0.3)'
        }}
        className="filter-dropdown-container"
      >
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setOpenFilterDropdown(openFilterDropdown === columnKey ? null : columnKey)}
            className="input"
            style={{
              width: '100%',
              height: '32px',
              padding: '4px 8px',
              fontSize: '12px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              backgroundColor: selectedValues.length > 0 ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--background))',
              border: selectedValues.length > 0 ? '1px solid hsl(var(--primary))' : '1px solid hsl(var(--border))'
            }}
          >
            <span style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              color: selectedValues.length > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
            }}>
              {selectedValues.length > 0 ? `${selectedValues.length}개 선택` : '전체'}
            </span>
            <ChevronDown size={14} />
          </button>

          {openFilterDropdown === columnKey && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              width: '240px',
              maxHeight: '320px',
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* 검색 입력 */}
              <div style={{ padding: '12px', borderBottom: '1px solid hsl(var(--border))' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ 
                    position: 'absolute', 
                    left: '8px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: 'hsl(var(--muted-foreground))'
                  }} />
                  <input
                    type="text"
                    placeholder="검색..."
                    value={searchTerm}
                    onChange={(e) => setFilterSearchTerms(prev => ({ ...prev, [columnKey]: e.target.value }))}
                    className="input"
                    style={{
                      width: '100%',
                      height: '32px',
                      paddingLeft: '32px',
                      paddingRight: searchTerm ? '32px' : '8px',
                      fontSize: '12px'
                    }}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setFilterSearchTerms(prev => ({ ...prev, [columnKey]: '' }))}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'hsl(var(--muted-foreground))'
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* 전체 선택 */}
              <div style={{ padding: '8px 12px', borderBottom: '1px solid hsl(var(--border))' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => {
                      const checked = e.target.checked
                      setListFilters(prev => ({
                        ...prev,
                        [columnKey]: checked ? uniqueValues : []
                      }))
                      setCurrentPage(1)
                    }}
                    className="checkbox-custom"
                  />
                  <span>전체 선택</span>
                </label>
              </div>

              {/* 옵션 목록 */}
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '8px 12px',
                maxHeight: '200px'
              }}>
                {filteredValues.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {filteredValues.map(value => (
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
                          checked={selectedValues.includes(value)}
                          onChange={(e) => {
                            const checked = e.target.checked
                            setListFilters(prev => ({
                              ...prev,
                              [columnKey]: checked
                                ? [...selectedValues, value]
                                : selectedValues.filter(v => v !== value)
                            }))
                            setCurrentPage(1)
                          }}
                          className="checkbox-custom"
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'hsl(var(--muted-foreground))',
                    textAlign: 'center',
                    padding: '12px'
                  }}>
                    검색 결과가 없습니다
                  </div>
                )}
              </div>

              {/* 초기화 버튼 */}
              {selectedValues.length > 0 && (
                <div style={{ padding: '8px 12px', borderTop: '1px solid hsl(var(--border))' }}>
                  <button
                    onClick={() => {
                      setListFilters(prev => ({ ...prev, [columnKey]: [] }))
                      setCurrentPage(1)
                    }}
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%', fontSize: '12px' }}
                  >
                    초기화
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </td>
    )
  }

  // 지표 필터 렌더링
  const renderMetricFilter = (metricKey: string) => {
    const filter = metricFilters[metricKey as keyof typeof metricFilters]

    return (
      <td 
        key={metricKey}
        style={{ 
          padding: '8px', 
          backgroundColor: 'hsl(var(--muted) / 0.3)'
        }}
      >
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <select
            value={filter.operator}
            onChange={(e) => {
              setMetricFilters(prev => ({
                ...prev,
                [metricKey]: { ...prev[metricKey as keyof typeof prev], operator: e.target.value as any }
              }))
              setCurrentPage(1)
            }}
            className="input"
            style={{
              width: '60px',
              height: '32px',
              padding: '4px',
              fontSize: '12px',
              backgroundColor: filter.operator && filter.value ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--background))',
              border: filter.operator && filter.value ? '1px solid hsl(var(--primary))' : '1px solid hsl(var(--border))'
            }}
          >
            <option value="=">=</option>
            <option value=">">{'>'}</option>
            <option value="<">{'<'}</option>
            <option value="≥">≥</option>
            <option value="≤">≤</option>
          </select>
          <input
            type="number"
            placeholder="값"
            value={filter.value}
            onChange={(e) => {
              setMetricFilters(prev => ({
                ...prev,
                [metricKey]: { ...prev[metricKey as keyof typeof prev], value: e.target.value }
              }))
              setCurrentPage(1)
            }}
            className="input"
            style={{
              flex: 1,
              height: '32px',
              padding: '4px 8px',
              fontSize: '12px',
              minWidth: '80px',
              backgroundColor: filter.value ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--background))',
              border: filter.value ? '1px solid hsl(var(--primary))' : '1px solid hsl(var(--border))'
            }}
          />
        </div>
      </td>
    )
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ fontSize: '14px' }} className="text-muted-foreground">
            {startItem}-{endItem} / {totalItems}개
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
              <span style={{ color: 'hsl(var(--muted-foreground))', fontWeight: '500' }}>{configData.media}</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>조회기간</span>
              <span style={{ color: 'hsl(var(--muted-foreground))', fontWeight: '500' }}>2024-01 → 2024-06</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>업종 11개</span>
              <SearchCheck 
                size={14} 
                style={{ cursor: 'pointer' }}
                onClick={() => setIndustryModalOpen(true)}
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
              <span>지표 {totalMetricsCount}개</span>
              <SearchCheck 
                size={14} 
                style={{ cursor: 'pointer' }}
                onClick={() => setMetricsModalOpen(true)}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
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
        {/* 차트 영역 */}
        <DatasetCharts />

        {/* 추출 데이터 테이블 */}
        <div style={{ marginBottom: '32px' }}>
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
              <div style={{ position: 'relative' }}>
                <Info 
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
                    width: '280px',
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
                    전체 8,000행 중 5,000행만 표시됩니다. 전체 데이터는 CSV 다운로드를 통해 확인하세요.
                  </div>
                )}
              </div>
            </div>
            
            {/* 데이터 기준 일시 */}
            <div style={{
              fontSize: '13px',
              color: 'hsl(var(--muted-foreground))',
              fontFamily: 'Paperlogy, sans-serif',
              whiteSpace: 'nowrap'
            }}>
              데이터 기준 일시: 2024-03-10 14:30:25
            </div>
          </div>

          {/* 결과 개수는 제거 */}

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
                  {/* 헤더 행 */}
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
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        기간
                        {sortConfig?.key === 'period' && (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                      </div>
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
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        매체
                        {sortConfig?.key === 'media' && (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                      </div>
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
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        업종(대)
                        {sortConfig?.key === 'industryLarge' && (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                      </div>
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
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        업종(중)
                        {sortConfig?.key === 'industryMedium' && (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                      </div>
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
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        업종(소)
                        {sortConfig?.key === 'industrySmall' && (
                          sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                      </div>
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
                          userSelect: 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {col.label}
                          {sortConfig?.key === col.key && (
                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                          )}
                        </div>
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
                          userSelect: 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {configData.targetingCategory}
                          {sortConfig?.key === 'targetingOption' && (
                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                          )}
                        </div>
                      </th>
                    )}
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

                  {/* 필터 행 */}
                  <tr style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                    {renderListFilter('period')}
                    {renderListFilter('media')}
                    {renderListFilter('industryLarge')}
                    {renderListFilter('industryMedium')}
                    {renderListFilter('industrySmall')}
                    {adProductColumns.map((col) => renderListFilter(col.key))}
                    {configData.targetingCategory && renderListFilter('targetingOption')}
                    {renderMetricFilter('impressions')}
                    {renderMetricFilter('clicks')}
                    {renderMetricFilter('cost')}
                    {renderMetricFilter('ctr')}
                    {renderMetricFilter('cpc')}
                    {renderMetricFilter('cpm')}
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
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }} className="text-muted-foreground">{row.ctr.toFixed(2)}%</td>
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

          {renderPagination()}
        </div>
      </div>

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

      {/* 모달들 */}
      <IndustryModal
        isOpen={industryModalOpen}
        onClose={() => setIndustryModalOpen(false)}
        industries={[
          '가정용전기전자 > 가사용전기전자 > 가사용전기전자기타',
          '가정용전기전자 > 가사용전기전자 > 가습기',
          '가정용전기전자 > 가사용전기전자 > 다리미',
          '가정용전기전자 > 가사용전기전자 > 세탁기',
          '가정용전기전자 > 가사용전기전자 > 청소기',
          '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자기타PR',
          '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자기업공고',
          '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자기타',
          '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
          '가정용전기전자 > 냉난방기 > 냉난방기기타',
          '가정용전기전자 > 냉난방기 > 에어컨'
        ]}
      />

      <AdProductsModal
        isOpen={adProductsModalOpen}
        onClose={() => setAdProductsModalOpen(false)}
        media="Meta"
        products={[
          {
            objective: 'POST_ENGAGEMENT',
            buyingTypes: ['AUCTION', 'RESERVED'],
            platforms: ['facebook', 'instagram', 'facebook&instagram', 'audience_network', 'facebook&instagram&messenger'],
            performanceGoals: ['OFFSITE_CONVERSIONS', 'LINK_CLICKS', 'IMPRESSIONS', 'LEAD_GENERATION', 'REACH']
          },
          {
            objective: 'REACH',
            buyingTypes: ['AUCTION', 'RESERVED'],
            platforms: ['facebook', 'instagram', 'messenger', 'audience_network'],
            performanceGoals: ['LINK_CLICKS', 'OFFSITE_CONVERSIONS']
          }
        ]}
      />

      <MetricsModal
        isOpen={metricsModalOpen}
        onClose={() => setMetricsModalOpen(false)}
        metricGroups={metricsData}
      />
    </AppLayout>
  )
}

// ChevronDown 아이콘 컴포넌트 (lucide-react에 없는 경우 직접 정의)
function ChevronDown({ size = 16, ...props }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  )
}
