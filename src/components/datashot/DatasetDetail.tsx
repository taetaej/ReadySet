import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DollarSign, MousePointerClick, TrendingUp, Eye, Link2, FileSpreadsheet, Share2, Database, Info, MoreVertical, Copy, ArrowRightLeft, Trash2, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Monitor, Calendar, Building2, Package, BarChart3, Target } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [isConfigExpanded, setIsConfigExpanded] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<'광고비' | 'CTR' | 'CPC' | 'CPM'>('CTR')
  const [chartInfoTooltipOpen, setChartInfoTooltipOpen] = useState(false)

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    setDarkModeUtil(newMode)
  }

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

  // 샘플 Key Metrics 데이터
  const keyMetrics = [
    {
      label: '광고비',
      value: '1,234,567,890',
      unit: '원',
      icon: DollarSign,
      color: 'hsl(240, 5%, 26%)',
      key: '광고비' as const
    },
    {
      label: 'CTR',
      value: '2.34',
      unit: '%',
      icon: MousePointerClick,
      color: 'hsl(240, 5%, 26%)',
      key: 'CTR' as const
    },
    {
      label: 'CPC',
      value: '1,250',
      unit: '원',
      icon: TrendingUp,
      color: 'hsl(240, 5%, 26%)',
      key: 'CPC' as const
    },
    {
      label: 'CPM',
      value: '8,500',
      unit: '원',
      icon: Eye,
      color: 'hsl(240, 5%, 26%)',
      key: 'CPM' as const
    }
  ]

  // 차트 데이터 생성 (기간별)
  const generateChartData = () => {
    const periods = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06']
    
    return periods.map((period) => {
      const baseValues = {
        '광고비': 1200000000 + Math.random() * 200000000,
        'CTR': 2.0 + Math.random() * 1.0,
        'CPC': 1000 + Math.random() * 500,
        'CPM': 8000 + Math.random() * 2000
      }
      
      return {
        period,
        광고비: Math.round(baseValues['광고비']),
        CTR: Math.round(baseValues['CTR'] * 100) / 100,
        CPC: Math.round(baseValues['CPC']),
        CPM: Math.round(baseValues['CPM'])
      }
    })
  }

  const chartData = generateChartData()

  // 지표별 포맷팅
  const formatMetricValue = (value: number, metric: string) => {
    switch (metric) {
      case '광고비':
      case 'CPC':
      case 'CPM':
        return value.toLocaleString()
      case 'CTR':
        return `${value}%`
      default:
        return value.toString()
    }
  }

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div style={{
          backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#3f3f46' : '#e4e4e7'}`,
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          fontFamily: 'Paperlogy, sans-serif'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>
            {data.period}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff9d' }}></div>
            <span style={{ color: isDarkMode ? '#a1a1aa' : '#71717a', fontSize: '12px' }}>{selectedMetric}:</span>
            <span style={{ fontWeight: '600', marginLeft: 'auto', fontSize: '12px' }}>
              {formatMetricValue(data[selectedMetric], selectedMetric)}
            </span>
          </div>
        </div>
      )
    }
    return null
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
    const metricKeys: { [key: string]: string } = {
      '노출수': 'impressions',
      '클릭수': 'clicks',
      '광고비': 'cost',
      'CTR': 'ctr',
      'CPC': 'cpc',
      'CPM': 'cpm'
    }
    
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
        performanceGoal: '—',
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
      
      // 숫자 비교
      const aNum = typeof aValue === 'number' ? aValue : parseFloat(aValue) || 0
      const bNum = typeof bValue === 'number' ? bValue : parseFloat(bValue) || 0
      
      if (sortConfig.direction === 'asc') {
        return aNum - bNum
      } else {
        return bNum - aNum
      }
    })
    
    return sorted
  }

  // 페이지네이션 로직
  const sortedData = getSortedData()
  const totalItems = sortedData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageData = sortedData.slice(startIndex, endIndex)

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
          {/* 좌측: 뱃지 + 타이틀 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            flex: 1,
            minWidth: 0
          }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: 'hsl(var(--muted))',
              color: 'hsl(var(--foreground))',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0
            }}>
              <Database size={14} />
              DataShot
            </span>
            
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
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

          {/* 중앙: 주요 정보 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            fontSize: '12px',
            fontFamily: 'Paperlogy, sans-serif',
            flexShrink: 0
          }} className="text-muted-foreground">
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontWeight: '500' }}>매체</span>
              <span>{datasetData?.media || 'Meta'}</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontWeight: '500' }}>기준 데이터 일시</span>
              <span>2024-03-10 14:30:25</span>
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
                      transition: 'background-color 0.2s'
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
                      transition: 'background-color 0.2s'
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

        {/* Key Metrics Summary & Chart - 좌우 배치 */}
        <div style={{ 
          display: 'flex',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* 좌측: Key Metrics Summary */}
          <div style={{ flexShrink: 0, width: '690px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              fontFamily: 'Paperlogy, sans-serif',
              margin: 0,
              marginBottom: '16px',
              color: 'hsl(var(--foreground))'
            }}>
              Key Metrics Summary
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: '16px',
              width: '100%',
              height: '360px'
            }}>
              {keyMetrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedMetric(metric.key)}
                    style={{
                      backgroundColor: selectedMetric === metric.key ? '#F4F4F5' : 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedMetric !== metric.key) {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedMetric !== metric.key) {
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }
                    }}
                  >
                    {/* 헤더 */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'hsl(var(--foreground))',
                        fontFamily: 'Paperlogy, sans-serif'
                      }}>
                        {metric.label}
                      </div>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: metric.color
                      }}>
                        <Icon size={20} />
                      </div>
                    </div>

                    {/* 값 */}
                    <div>
                      <div style={{
                        fontSize: '36px',
                        fontWeight: '700',
                        color: 'hsl(var(--foreground))',
                        fontFamily: 'Paperlogy, sans-serif',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '4px'
                      }}>
                        <span style={{
                          borderBottom: '3px solid #00ff9d',
                          paddingBottom: '2px'
                        }}>
                          {metric.value}
                        </span>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          color: 'hsl(var(--muted-foreground))'
                        }}>
                          {metric.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 우측: Chart */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                fontFamily: 'Paperlogy, sans-serif',
                margin: 0,
                color: 'hsl(var(--foreground))'
              }}>
                Chart
              </h3>
              <div style={{ position: 'relative' }}>
                <div
                  onMouseEnter={() => setChartInfoTooltipOpen(true)}
                  onMouseLeave={() => setChartInfoTooltipOpen(false)}
                  style={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'hsl(var(--muted-foreground))'
                  }}
                >
                  <Info size={16} />
                </div>
                
                {chartInfoTooltipOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '8px',
                    width: '240px',
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    zIndex: 1000,
                    fontFamily: 'Paperlogy, sans-serif',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    color: 'hsl(var(--foreground))',
                    pointerEvents: 'none'
                  }}>
                    좌측 지표 박스를 클릭하여 차트에 표시할 지표를 변경할 수 있습니다.
                  </div>
                )}
              </div>
            </div>
            <div style={{
              height: '360px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={isDarkMode ? '#27272a' : '#e4e4e7'}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="period"
                    stroke={isDarkMode ? '#3f3f46' : '#e4e4e7'}
                    tick={{ fill: isDarkMode ? '#a1a1aa' : '#71717a', fontSize: 11 }}
                  />
                  <YAxis 
                    stroke={isDarkMode ? '#3f3f46' : '#e4e4e7'}
                    tick={{ fill: isDarkMode ? '#a1a1aa' : '#71717a', fontSize: 11 }}
                    width={60}
                    tickFormatter={(value) => {
                      if (selectedMetric === '광고비') {
                        return `${(value / 100000000).toFixed(1)}억`
                      } else if (selectedMetric === 'CTR') {
                        return `${value}%`
                      } else {
                        return value.toLocaleString()
                      }
                    }}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ 
                      stroke: isDarkMode ? '#52525b' : '#d4d4d8', 
                      strokeWidth: 1, 
                      strokeDasharray: '3 3'
                    }}
                    wrapperStyle={{ outline: 'none' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={selectedMetric}
                    stroke="#00ff9d" 
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#00ff9d', stroke: '#00ff9d', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: '#00ff9d', stroke: '#00ff9d', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 추출 데이터 테이블 */}
        <div style={{ marginBottom: '32px' }}>
          {/* 테이블 타이틀 및 안내 메시지 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              fontFamily: 'Paperlogy, sans-serif',
              margin: 0,
              color: 'hsl(var(--foreground))'
            }}>
              Extracted Data
            </h3>
            <div style={{
              fontSize: '12px',
              color: 'hsl(var(--muted-foreground))',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Info size={14} />
              전체 {(12345).toLocaleString()}행 중 5,000행만 표시됩니다. 전체 데이터는 CSV 다운로드를 통해 확인하세요.
            </div>
          </div>

          {/* Query Configuration - 접기/펼치기 */}
          <div style={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            marginBottom: '16px',
            overflow: 'hidden'
          }}>
            {/* 헤더 - 클릭 가능 */}
            <div
              onClick={() => setIsConfigExpanded(!isConfigExpanded)}
              style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                backgroundColor: isConfigExpanded ? 'hsl(var(--muted) / 0.3)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isConfigExpanded) {
                  e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.2)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isConfigExpanded) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChevronRight 
                  size={16} 
                  style={{ 
                    transform: isConfigExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} 
                />
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'hsl(var(--muted-foreground))'
                }}>
                  Query Configuration
                </span>
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'hsl(var(--muted-foreground))'
              }}>
                {isConfigExpanded ? '접기' : '펼쳐서 조회조건 확인'}
              </div>
            </div>

            {/* 상세 내용 - 요약 + 상세 구조 */}
            {isConfigExpanded && (
              <div style={{
                padding: '24px',
                borderTop: '1px solid hsl(var(--border))'
              }}>
                {/* 요약 영역 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  marginBottom: '24px',
                  padding: '16px',
                  backgroundColor: 'hsl(var(--muted) / 0.3)',
                  borderRadius: '8px'
                }}>
                  {/* 매체 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Monitor size={16} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>매체</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{configData.media}</span>
                    </div>
                  </div>

                  {/* 조회기간 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>조회기간</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>2025-05 → 2026-06</span>
                    </div>
                  </div>

                  {/* 업종 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={16} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>업종</span>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>11개</span>
                    </div>
                  </div>

                  {/* 광고상품 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={16} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>광고상품</span>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>72개</span>
                    </div>
                  </div>

                  {/* 지표 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 size={16} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>지표</span>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>10개</span>
                    </div>
                  </div>

                  {/* 타겟팅 옵션 */}
                  {configData.targetingCategory && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Target size={16} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>타겟팅 옵션</span>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>1개</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 구분선 */}
                <div style={{ 
                  height: '1px', 
                  backgroundColor: 'hsl(var(--border))',
                  marginBottom: '24px'
                }} />

                {/* 상세 영역 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* 업종 상세 */}
                  <div>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: '600',
                      color: 'hsl(var(--foreground))',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Building2 size={14} />
                      업종 (11개)
                    </div>
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'hsl(var(--muted) / 0.3)',
                      borderRadius: '6px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}>
                      {[
                        '가정용전기전자 > 가사용전기전자 > 가사용전기전자기타',
                        '가정용전기전자 > 가사용전기전자 > 가습기',
                        '가정용전기전자 > 가사용전기전자 > 다리미',
                        '가정용전기전자 > 가사용전기전자 > 세탁기',
                        '가정용전기전자 > 가사용전기전자 > 청소기',
                        '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자기타PR',
                        '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자기타영고',
                        '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자기타',
                        '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
                        '가정용품 > 가정용품기타 > 가정용품기타',
                        '가정용품 > 주방용품 > 주방용품'
                      ].map((industry, idx) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: '11px',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            color: 'hsl(var(--foreground))',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {industry}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 광고상품 상세 */}
                  <div>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: '600',
                      color: 'hsl(var(--foreground))',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Package size={14} />
                      광고상품 (72개)
                    </div>
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'hsl(var(--muted) / 0.3)',
                      borderRadius: '6px'
                    }}>
                      <div style={{
                        fontSize: '11px',
                        color: 'hsl(var(--foreground))',
                        lineHeight: '1.8',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>조건 1</div>
                        <div>
                          <span style={{ color: 'hsl(var(--muted-foreground))', minWidth: '80px', display: 'inline-block' }}>캠페인 목표</span>
                          <span style={{ margin: '0 6px', color: 'hsl(var(--muted-foreground))' }}>›</span>
                          <span style={{ fontWeight: '500' }}>POST_ENGAGEMENT</span>
                        </div>
                        <div>
                          <span style={{ color: 'hsl(var(--muted-foreground))', minWidth: '80px', display: 'inline-block' }}>구매 유형</span>
                          <span style={{ margin: '0 6px', color: 'hsl(var(--muted-foreground))' }}>›</span>
                          <span>AUCTION, RESERVED</span>
                        </div>
                        <div>
                          <span style={{ color: 'hsl(var(--muted-foreground))', minWidth: '80px', display: 'inline-block' }}>플랫폼</span>
                          <span style={{ margin: '0 6px', color: 'hsl(var(--muted-foreground))' }}>›</span>
                          <span>facebook, instagram, facebook&instagram, messenger, audience_network, facebook&instagram&messenger</span>
                        </div>
                        <div>
                          <span style={{ color: 'hsl(var(--muted-foreground))', minWidth: '80px', display: 'inline-block' }}>성과 목표</span>
                          <span style={{ margin: '0 6px', color: 'hsl(var(--muted-foreground))' }}>›</span>
                          <span>CLICKS, LINK_CLICKS, OFFSITE_CONVERSIONS, LEAD_GENERATION, IMPRESSIONS, REACH</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 지표 상세 */}
                  <div>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: '600',
                      color: 'hsl(var(--foreground))',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <BarChart3 size={14} />
                      지표 (10개)
                    </div>
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'hsl(var(--muted) / 0.3)',
                      borderRadius: '6px'
                    }}>
                      <div style={{ fontSize: '11px', lineHeight: '1.8' }}>
                        <div>
                          <span style={{ color: 'hsl(var(--muted-foreground))', minWidth: '60px', display: 'inline-block' }}>성과</span>
                          <span style={{ margin: '0 6px', color: 'hsl(var(--muted-foreground))' }}>›</span>
                          <span>클릭(전체), CPC, CPM, CPV, CTR, VTR, 반도, 노출수, 도달수, 광고소진금액</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 타겟팅 옵션 상세 */}
                  {configData.targetingCategory && (
                    <div>
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: '600',
                        color: 'hsl(var(--foreground))',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Target size={14} />
                        타겟팅 옵션 (1개)
                      </div>
                      <div style={{
                        padding: '12px',
                        backgroundColor: 'hsl(var(--muted) / 0.3)',
                        borderRadius: '6px'
                      }}>
                        <div style={{ fontSize: '11px', lineHeight: '1.8' }}>
                          <span style={{ color: 'hsl(var(--muted-foreground))', minWidth: '60px', display: 'inline-block' }}>기기유형</span>
                          <span style={{ margin: '0 6px', color: 'hsl(var(--muted-foreground))' }}>›</span>
                          <span>데스크톱</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>기간</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>매체</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>업종(대)</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>업종(중)</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>업종(소)</th>
                    {adProductColumns.map((col) => (
                      <th key={col.key} style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>{col.label}</th>
                    ))}
                    {configData.targetingCategory && (
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>{configData.targetingCategory}</th>
                    )}
                    {/* 지표 컬럼 - 정렬 가능 */}
                    {configData.metrics.map((metric: string) => (
                      <th 
                        key={metric}
                        onClick={() => handleSort(metric)}
                        style={{ 
                          padding: '12px 8px', 
                          textAlign: 'right', 
                          fontWeight: '600', 
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
    </AppLayout>
  )
}
