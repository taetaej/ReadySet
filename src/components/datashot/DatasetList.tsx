import { useState } from 'react'
import { Plus, Search, Filter, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MoreVertical, Copy, ArrowRightLeft, Trash2, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SlotHeader } from '../reachcaster/SlotHeader'
import { sampleDatasets } from './types'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { maskEmail } from '../../utils/maskEmail'

type SortField = 'id' | 'name' | 'media' | 'industry' | 'startDate' | 'status' | 'created' | 'creator'
type SortOrder = 'asc' | 'desc'

export function DatasetList() {
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()
  
  // 뷰 및 정렬 상태
  const [sortField, setSortField] = useState<SortField>('created')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // 검색 & 필터 상태
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [mediaFilter, setMediaFilter] = useState<string[]>([])
  const [contextMenuOpen, setContextMenuOpen] = useState<number | null>(null)
  
  // 체크박스 선택 상태
  const [selectedDatasets, setSelectedDatasets] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  
  // 이동 모달 상태
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  
  // 삭제 모달 상태
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingDatasets, setDeletingDatasets] = useState<number[]>([])

  // 체크박스 전체 선택/해제
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDatasets([])
      setSelectAll(false)
    } else {
      setSelectedDatasets(filteredDatasets.map(d => d.id))
      setSelectAll(true)
    }
  }

  // 개별 체크박스 선택/해제
  const handleSelectDataset = (id: number) => {
    if (selectedDatasets.includes(id)) {
      const newSelected = selectedDatasets.filter(sid => sid !== id)
      setSelectedDatasets(newSelected)
      setSelectAll(false)
    } else {
      const newSelected = [...selectedDatasets, id]
      setSelectedDatasets(newSelected)
      if (newSelected.length === filteredDatasets.length) {
        setSelectAll(true)
      }
    }
  }

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    setDarkModeUtil(newMode)
  }

  // 임시 슬롯 데이터 (실제로는 props나 context에서 받아올 것)
  const slotData = {
    title: '삼성 갤럭시 S24 캠페인',
    advertiser: '삼성전자',
    advertiserId: 'ADV001',
    visibility: 'Internal',
    results: 5,
    modified: '2024-01-15',
    description: '삼성 갤럭시 S24 출시를 위한 마케팅 캠페인입니다.'
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

  // 정렬 아이콘
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
  }

  // 정렬 및 필터 적용
  const filteredDatasets = sampleDatasets
    .filter(dataset => {
      // 검색 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchName = dataset.name.toLowerCase().includes(query)
        const matchCreator = dataset.creator.toLowerCase().includes(query)
        if (!matchName && !matchCreator) return false
      }
      
      // 상태 필터
      if (statusFilter.length > 0 && !statusFilter.includes(dataset.status)) return false
      
      // 매체 필터
      if (mediaFilter.length > 0 && !mediaFilter.includes(dataset.media)) return false
      
      return true
    })
    .sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      const modifier = sortOrder === 'asc' ? 1 : -1
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * modifier
      }
      return (aVal > bVal ? 1 : -1) * modifier
    })

  // 페이지네이션
  const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentDatasets = filteredDatasets.slice(startIndex, startIndex + itemsPerPage)

  // 상태 뱃지 스타일
  const getStatusStyle = (status: string) => {
    const styles = {
      Completed: { bg: 'hsl(var(--foreground))', color: 'hsl(var(--background))', border: 'hsl(var(--foreground))' },
      Processing: { bg: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', border: 'hsl(var(--border))' },
      Pending: { bg: 'transparent', color: 'hsl(var(--muted-foreground))', border: 'hsl(var(--border))' },
      Error: { bg: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', border: 'hsl(var(--destructive))' },
      Expired: { bg: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', border: 'hsl(var(--destructive))' }
    }
    return styles[status as keyof typeof styles] || styles.Pending
  }

  // 업종 표시 함수
  const getIndustryDisplay = (dataset: { industry: string; industryLevel?: 'major' | 'mid' | 'minor' | null; industryCount?: number }) => {
    if (!dataset.industryLevel || dataset.industry === '전체') {
      return { icon: <Building2 size={14} />, text: '전체' }
    }
    const levelLabel = { major: '대분류', mid: '중분류', minor: '소분류' }[dataset.industryLevel]
    const count = dataset.industryCount ?? 1
    return {
      icon: <Building2 size={14} />,
      text: `${levelLabel} ${count}개`
    }
  }

  // 조회기간 포맷팅 함수
  const formatPeriod = (startDate: string, endDate: string, periodType: 'month' | 'quarter') => {
    if (periodType === 'month') {
      // "2024-01" → "2024-01"
      return `${startDate} → ${endDate}`
    } else {
      // "2024-1" → "2024-Q1"
      const formatQuarter = (date: string) => {
        const [year, quarter] = date.split('-')
        return `${year}-Q${quarter}`
      }
      return `${formatQuarter(startDate)} → ${formatQuarter(endDate)}`
    }
  }

  return (
    <AppLayout
      currentView="datashot"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', href: '/slotboard' },
        { label: slotData.title },
        { label: 'DataShot' }
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
      <SlotHeader 
        slotId={1}
        slotData={slotData}
      />
      
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
              DataShot
            </h1>
            <button 
              onClick={() => navigate('/datashot/new')}
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
                height: '48px'
              }}
            >
              <Plus size={16} />
              New Dataset
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
          {/* 좌측: 데이터셋 개수 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* 데이터셋 개수 */}
            <div style={{ 
              fontSize: '14px',
              color: 'hsl(var(--muted-foreground))'
            }}>
              {filteredDatasets.length} Datasets
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* 선택 개수 표시 */}
            {selectedDatasets.length > 0 && (
              <div style={{
                fontSize: '14px',
                color: 'hsl(var(--foreground))',
                fontWeight: '500'
              }}>
                {selectedDatasets.length}개 선택됨
              </div>
            )}
            
            {/* 선택된 항목 일괄 작업 버튼 */}
            {selectedDatasets.length > 0 && (
              <>
                <button
                  onClick={() => {
                    setShowMoveDialog(true)
                  }}
                  className="btn btn-ghost btn-md"
                  style={{ border: '1px solid hsl(var(--border))' }}
                >
                  <ArrowRightLeft size={16} />
                  이동
                </button>
                <button
                  onClick={() => {
                    setDeletingDatasets(selectedDatasets)
                    setShowDeleteDialog(true)
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
                    placeholder="데이터셋명, 생성자"
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
                  backgroundColor: (statusFilter.length > 0 || mediaFilter.length > 0) 
                    ? 'hsl(var(--primary) / 0.1)' 
                    : 'transparent'
                }}
              >
                <Filter size={16} />
                <span>필터</span>
                {(statusFilter.length > 0 || mediaFilter.length > 0) && (
                  <span style={{
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    {statusFilter.length + mediaFilter.length}
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
                  {/* 상태 필터 */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>상태</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {['Completed', 'Processing', 'Pending', 'Error', 'Expired'].map(status => (
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

                  {/* 매체 필터 */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>매체</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
                      {['Google Ads', 'Meta', 'kakao모먼트', '네이버 성과형 DA', '네이버 보장형 DA', 'TikTok'].map(media => (
                        <label key={media} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={mediaFilter.includes(media)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setMediaFilter([...mediaFilter, media])
                              } else {
                                setMediaFilter(mediaFilter.filter(m => m !== media))
                              }
                            }}
                            className="checkbox-custom"
                          />
                          <span style={{ fontSize: '13px' }}>{media}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 필터 초기화 */}
                  <button
                    onClick={() => {
                      setStatusFilter([])
                      setMediaFilter([])
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

        {/* 테이블 */}
        <div style={{ 
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                backgroundColor: 'hsl(var(--muted) / 0.5)',
                borderBottom: '1px solid hsl(var(--border))'
              }}>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '500', width: '50px' }}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="checkbox-custom"
                  />
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', width: '80px', color: 'hsl(var(--foreground))' }}>
                  <button onClick={() => handleSort('id')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px', padding: 0, color: 'hsl(var(--foreground))' }}>
                    ID {renderSortIcon('id')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', minWidth: '200px', color: 'hsl(var(--foreground))' }}>
                  <button onClick={() => handleSort('name')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px', padding: 0, color: 'hsl(var(--foreground))' }}>
                    데이터셋명 {renderSortIcon('name')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', width: '120px', color: 'hsl(var(--foreground))' }}>
                  <button onClick={() => handleSort('media')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px', padding: 0, color: 'hsl(var(--foreground))' }}>
                    매체 {renderSortIcon('media')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', width: '100px', color: 'hsl(var(--foreground))' }}>
                  <button onClick={() => handleSort('industry')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px', padding: 0, color: 'hsl(var(--foreground))' }}>
                    업종 {renderSortIcon('industry')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', width: '180px', color: 'hsl(var(--foreground))' }}>
                  <button onClick={() => handleSort('startDate')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px', padding: 0, color: 'hsl(var(--foreground))' }}>
                    조회 기간 {renderSortIcon('startDate')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', width: '100px', color: 'hsl(var(--foreground))' }}>
                  <button onClick={() => handleSort('status')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px', padding: 0, color: 'hsl(var(--foreground))' }}>
                    상태 {renderSortIcon('status')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', width: '100px', color: 'hsl(var(--foreground))' }}>
                  <button onClick={() => handleSort('creator')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px', padding: 0, color: 'hsl(var(--foreground))' }}>
                    생성자 {renderSortIcon('creator')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', width: '140px', color: 'hsl(var(--foreground))' }}>
                  <button onClick={() => handleSort('created')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px', padding: 0, color: 'hsl(var(--foreground))' }}>
                    생성일시 {renderSortIcon('created')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '500', width: '60px' }}>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentDatasets.map((dataset) => {
                const statusStyle = getStatusStyle(dataset.status)
                const isClickable = dataset.status === 'Completed'
                const isSelected = selectedDatasets.includes(dataset.id)
                return (
                  <tr 
                    key={dataset.id}
                    style={{ 
                      borderBottom: '1px solid hsl(var(--border))',
                      cursor: isClickable ? 'pointer' : 'default',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      if (isClickable) {
                        e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.3)'
                      }
                    }}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => {
                      if (isClickable) {
                        navigate(`/datashot/${dataset.id}`, {
                          state: {
                            datasetData: dataset,
                            slotData: slotData
                          }
                        })
                      }
                    }}
                  >
                    <td style={{ padding: '12px 16px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectDataset(dataset.id)}
                        className="checkbox-custom"
                      />
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }} className="text-muted-foreground">
                      {dataset.id}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500' }} className={isClickable ? '' : 'text-muted-foreground'}>
                      {dataset.name}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      {dataset.media}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'hsl(var(--muted-foreground))' }}>
                        {getIndustryDisplay(dataset).icon}
                        <span>{getIndustryDisplay(dataset).text}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }} className="text-muted-foreground">
                      {formatPeriod(dataset.startDate, dataset.endDate, dataset.periodType)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`
                      }}>
                        {dataset.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }} className="text-muted-foreground">
                      {dataset.creator} ({maskEmail(dataset.creatorId)})
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }} className="text-muted-foreground">
                      {dataset.created}
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                          data-context-menu
                          onClick={(e) => {
                            e.stopPropagation()
                            setContextMenuOpen(contextMenuOpen === dataset.id ? null : dataset.id)
                          }}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '4px' }}
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {contextMenuOpen === dataset.id && (
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
                                // TODO: 복제 기능 구현
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
                                setSelectedDatasets([dataset.id])
                                setShowMoveDialog(true)
                              }}
                              className="dropdown-item"
                            >
                              <ArrowRightLeft size={14} />
                              이동
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setContextMenuOpen(null)
                                setDeletingDatasets([dataset.id])
                                setShowDeleteDialog(true)
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

        {/* 페이지네이션 */}
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
            </select>
          </div>

          {/* 우측: 페이지 정보 및 네비게이션 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* 페이지 정보 */}
            <span style={{ fontSize: '14px' }} className="text-muted-foreground">
              {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredDatasets.length)} / {filteredDatasets.length}개
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
      </div>

      {/* 이동 다이얼로그 */}
      {showMoveDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">
                데이터셋 이동
              </h3>
              <p className="dialog-description">
                선택한 {selectedDatasets.length}개 데이터셋을 다른 Slot으로 이동합니다.
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
                  console.log('이동:', selectedDatasets)
                  setShowMoveDialog(false)
                  setSelectedDatasets([])
                  setSelectAll(false)
                }}
                className="btn btn-primary btn-sm"
              >
                이동
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">
                데이터셋을 삭제하시겠습니까?
              </h3>
              <p className="dialog-description">
                선택한 {deletingDatasets.length}개 데이터셋을 삭제하면 복원할 수 없습니다. 정말로 삭제하시겠습니까?
              </p>
            </div>

            <div className="dialog-footer">
              <button
                onClick={() => {
                  setShowDeleteDialog(false)
                  setDeletingDatasets([])
                }}
                className="btn btn-secondary btn-sm"
              >
                취소
              </button>
              <button
                onClick={() => {
                  console.log('삭제:', deletingDatasets)
                  setShowDeleteDialog(false)
                  setDeletingDatasets([])
                  setSelectedDatasets([])
                  setSelectAll(false)
                }}
                className="btn btn-sm"
                style={{
                  backgroundColor: 'hsl(var(--destructive))',
                  color: 'hsl(var(--destructive-foreground))'
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
