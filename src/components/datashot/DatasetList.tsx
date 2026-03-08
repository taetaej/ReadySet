import { useState } from 'react'
import { Plus, Search, Filter, List, LayoutGrid, X, ChevronDown, ChevronUp, MoreVertical, Copy, ArrowRightLeft, Trash2, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SlotHeader } from '../reachcaster/SlotHeader'
import { sampleDatasets } from './types'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'

type ViewMode = 'list' | 'grid'
type SortField = 'id' | 'name' | 'media' | 'industry' | 'startDate' | 'status' | 'created' | 'creator'
type SortOrder = 'asc' | 'desc'

export function DatasetList() {
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  
  // 뷰 및 정렬 상태
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortField, setSortField] = useState<SortField>('created')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  
  // 검색 & 필터 상태
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [mediaFilter, setMediaFilter] = useState<string[]>([])
  const [industryFilter, setIndustryFilter] = useState<string[]>([])
  const [contextMenuOpen, setContextMenuOpen] = useState<number | null>(null)

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
      
      // 업종 필터
      if (industryFilter.length > 0 && !industryFilter.includes(dataset.industry)) return false
      
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

  // 상태 뱃지 스타일
  const getStatusStyle = (status: string) => {
    const styles = {
      Completed: { bg: 'hsl(var(--foreground))', color: 'hsl(var(--background))', border: 'hsl(var(--foreground))' },
      Processing: { bg: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', border: 'hsl(var(--border))' },
      Pending: { bg: 'transparent', color: 'hsl(var(--muted-foreground))', border: 'hsl(var(--border))' },
      Error: { bg: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', border: 'hsl(var(--destructive))' },
      Expired: { bg: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', border: 'hsl(var(--border))' }
    }
    return styles[status as keyof typeof styles] || styles.Pending
  }

  // 업종 표시 함수
  const getIndustryDisplay = (industry: string) => {
    if (industry === '전체') {
      return {
        icon: <Building2 size={14} />,
        text: '전체'
      }
    } else {
      // "IT/가전 외 2개" 형식에서 숫자 추출
      const match = industry.match(/외\s*(\d+)개/)
      const additionalCount = match ? parseInt(match[1]) : 0
      const totalCount = additionalCount + 1 // "외 n개"이므로 +1
      
      return {
        icon: <Building2 size={14} />,
        text: `${totalCount}개 업종`
      }
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
        isCollapsed: false,
        expandedFolders: [],
        onToggleSidebar: () => {},
        onToggleFolder: () => {},
        onNavigateToWorkspace: () => {}
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
          {/* 좌측: 뷰 토글 + 데이터셋 개수 */}
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
                onClick={() => setViewMode('grid')}
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ 
                  backgroundColor: viewMode === 'grid' ? 'hsl(var(--background))' : 'transparent',
                  boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  padding: '8px'
                }}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
            
            {/* 데이터셋 개수 */}
            <div style={{ 
              fontSize: '14px',
              color: 'hsl(var(--muted-foreground))'
            }}>
              {filteredDatasets.length} Datasets
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                    placeholder="데이터셋명, 작성자"
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
                  backgroundColor: (statusFilter.length > 0 || mediaFilter.length > 0 || industryFilter.length > 0) 
                    ? 'hsl(var(--primary) / 0.1)' 
                    : 'transparent'
                }}
              >
                <Filter size={16} />
                <span>필터</span>
                {(statusFilter.length > 0 || mediaFilter.length > 0 || industryFilter.length > 0) && (
                  <span style={{
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    {statusFilter.length + mediaFilter.length + industryFilter.length}
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
                      {['Pending', 'Processing', 'Completed', 'Error', 'Expired'].map(status => (
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
                      {Array.from(new Set(sampleDatasets.map(d => d.media))).map(media => (
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

                  {/* 업종 필터 */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>업종</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
                      {Array.from(new Set(sampleDatasets.map(d => d.industry))).map(industry => (
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

                  {/* 필터 초기화 */}
                  <button
                    onClick={() => {
                      setStatusFilter([])
                      setMediaFilter([])
                      setIndustryFilter([])
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
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', width: '80px' }}>
                  <button onClick={() => handleSort('id')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                    ID {renderSortIcon('id')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', minWidth: '200px' }}>
                  <button onClick={() => handleSort('name')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                    데이터셋명 {renderSortIcon('name')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', width: '120px' }}>
                  <button onClick={() => handleSort('media')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                    매체 {renderSortIcon('media')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', width: '100px' }}>
                  <button onClick={() => handleSort('industry')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                    업종 {renderSortIcon('industry')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', width: '180px' }}>
                  조회 기간
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', width: '100px' }}>
                  <button onClick={() => handleSort('status')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                    상태 {renderSortIcon('status')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', width: '100px' }}>
                  <button onClick={() => handleSort('creator')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                    생성자 {renderSortIcon('creator')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', width: '140px' }}>
                  <button onClick={() => handleSort('created')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                    생성일시 {renderSortIcon('created')}
                  </button>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', width: '60px' }}>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDatasets.map((dataset) => {
                const statusStyle = getStatusStyle(dataset.status)
                const isClickable = dataset.status === 'Completed'
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
                        console.log('Navigate to dataset:', dataset.id)
                        // navigate(`/datashot/${dataset.id}`)
                      }
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#737373' }}>
                      {dataset.id}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500', color: isClickable ? '#0A0A0A' : '#737373' }}>
                      {dataset.name}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      {dataset.media}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'hsl(var(--muted-foreground))' }}>
                        {getIndustryDisplay(dataset.industry).icon}
                        <span>{getIndustryDisplay(dataset.industry).text}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                      {dataset.startDate} ~ {dataset.endDate}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`
                      }}>
                        {dataset.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#737373' }}>
                      {dataset.creator} ({dataset.creatorId})
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
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
                                console.log('복제:', dataset.id)
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
                                console.log('이동:', dataset.id)
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
                                console.log('삭제:', dataset.id)
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
      </div>
    </AppLayout>
  )
}
