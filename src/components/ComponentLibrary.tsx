import { useState, useEffect } from 'react'
import { AppLayout } from './layout/AppLayout'
import { Avatar } from './common/Avatar'
import { MonthRangePicker } from './datashot/MonthRangePicker'
import { CustomDateRangePicker } from './reachcaster/CustomDateRangePicker'
import { Search, Plus, Filter, Share2, X, Info, Scale, Target, ChevronRight, ChevronDown, LayoutGrid, List, MoreVertical, Edit, Trash2, Copy, CheckCircle, AlertCircle, ChevronLeft, ChevronsLeft, ChevronsRight, Link2, FileSpreadsheet, FileText } from 'lucide-react'

export function ComponentLibrary() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  
  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [moduleFilter, setModuleFilter] = useState<string[]>([])
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  
  // 검색 상태
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // 뷰모드 상태
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  
  // 더보기 메뉴 상태
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  
  // 다이얼로그 상태
  const [showDialog, setShowDialog] = useState(false)
  const [showTargetDialog, setShowTargetDialog] = useState(false)
  
  // 토스트 상태
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // 토스트 자동 닫기
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])
  
  // 날짜 선택 상태
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [monthRange, setMonthRange] = useState({
    startYear: '',
    startMonth: '',
    endYear: '',
    endMonth: ''
  })
  const [quarterRange, setQuarterRange] = useState({
    startYear: '',
    startMonth: '',
    endYear: '',
    endMonth: ''
  })
  
  // 툴팁 상태
  const [showTooltip, setShowTooltip] = useState(false)
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const totalPages = 10
  
  // 공유 메뉴 상태
  const [showShareMenu, setShowShareMenu] = useState(false)
  
  // 드롭다운 상태
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false)
  const [showMediaDropdown, setShowMediaDropdown] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedMedia, setSelectedMedia] = useState('TV')
  
  // 라디오 버튼 상태
  const [selectedModule, setSelectedModule] = useState('')
  
  // 타겟 GRP 상태
  const [selectedTargets, setSelectedTargets] = useState<string[]>([])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('darkMode', JSON.stringify(newMode))
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleToggleSidebar = () => setIsCollapsed(!isCollapsed)
  const handleToggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) ? prev.filter(id => id !== folderId) : [...prev, folderId]
    )
  }
  const handleNavigateToWorkspace = () => {}

  const targetGrpOptions = {
    male: ['남성 13-18', '남성 19-24', '남성 25-29', '남성 30-34', '남성 35-39', '남성 40-44', '남성 45-49', '남성 50-54', '남성 55-59', '남성 60-64', '남성 65-69', '남성 70+'],
    female: ['여성 13-18', '여성 19-24', '여성 25-29', '여성 30-34', '여성 35-39', '여성 40-44', '여성 45-49', '여성 50-54', '여성 55-59', '여성 60-64', '여성 65-69', '여성 70+']
  }

  const toggleTargetGrp = (target: string) => {
    setSelectedTargets(prev =>
      prev.includes(target) ? prev.filter(t => t !== target) : [...prev, target]
    )
  }

  const selectAllMale = () => {
    const allMale = targetGrpOptions.male
    const hasAllMale = allMale.every(t => selectedTargets.includes(t))
    if (hasAllMale) {
      setSelectedTargets(prev => prev.filter(t => !allMale.includes(t)))
    } else {
      setSelectedTargets(prev => [...new Set([...prev, ...allMale])])
    }
  }

  const selectAllFemale = () => {
    const allFemale = targetGrpOptions.female
    const hasAllFemale = allFemale.every(t => selectedTargets.includes(t))
    if (hasAllFemale) {
      setSelectedTargets(prev => prev.filter(t => !allFemale.includes(t)))
    } else {
      setSelectedTargets(prev => [...new Set([...prev, ...allFemale])])
    }
  }

  return (
    <AppLayout 
      isDarkMode={isDarkMode} 
      onToggleDarkMode={toggleDarkMode}
      currentView="component-library"
      showBreadcrumb={true}
      breadcrumbItems={[{ label: 'Component Library' }]}
      sidebarProps={{
        isCollapsed,
        expandedFolders,
        onToggleSidebar: handleToggleSidebar,
        onToggleFolder: handleToggleFolder,
        onNavigateToWorkspace: handleNavigateToWorkspace
      }}
    >
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: 'hsl(var(--foreground))' }}>
            Component Library
          </h1>
          <p style={{ fontSize: '16px', color: 'hsl(var(--muted-foreground))' }}>
            ReadySet 디자인 시스템의 실제 사용 컴포넌트 모음
          </p>
        </div>

        {/* 버튼 섹션 */}
        <Section title="Buttons" description="실제 프로젝트에서 사용하는 버튼 스타일">
          <ComponentGroup label="Primary Action Buttons (Rounded)">
            <button 
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
                transition: 'all 0.2s',
                height: '48px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Plus size={18} />
              New Slot
            </button>
            <button 
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
                transition: 'all 0.2s',
                height: '48px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Plus size={18} />
              New Scenario
            </button>
            <button 
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
                transition: 'all 0.2s',
                height: '48px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Plus size={18} />
              New Dataset
            </button>
          </ComponentGroup>

          <ComponentGroup label="Action Buttons (Form Footer)">
            <button className="btn btn-secondary btn-md">취소</button>
            <button className="btn btn-primary btn-md">확인</button>
            <button className="btn btn-primary btn-md">
              <Plus size={16} />
              생성
            </button>
          </ComponentGroup>

          <ComponentGroup label="Icon Only Buttons">
            <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
              <Info size={16} />
            </button>
            <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
              <Share2 size={16} />
            </button>
            <button className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
              <MoreVertical size={16} />
            </button>
          </ComponentGroup>

          <ComponentGroup label="Search Button (Expandable)">
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
                    zIndex: 1,
                    color: 'hsl(var(--muted-foreground))'
                  }} />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      if (!searchQuery) {
                        setSearchExpanded(false)
                      }
                    }}
                    placeholder="Search (Slot명, 광고주명)"
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
                      <X size={14} style={{ color: 'hsl(var(--muted-foreground))' }} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </ComponentGroup>

          <ComponentGroup label="Filter Button (Interactive)">
            <div style={{ position: 'relative' }}>
              <button 
                className="btn btn-ghost btn-md"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                style={{ 
                  border: '1px solid hsl(var(--border))',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 12px',
                  backgroundColor: (statusFilter.length > 0 || moduleFilter.length > 0) 
                    ? 'hsl(var(--primary) / 0.1)' 
                    : 'transparent'
                }}
              >
                <Filter size={16} />
                <span>필터</span>
                {(statusFilter.length > 0 || moduleFilter.length > 0) && (
                  <span style={{
                    marginLeft: '4px',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {statusFilter.length + moduleFilter.length}
                  </span>
                )}
              </button>

              {showFilterDropdown && (
                <div className="dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  minWidth: '240px',
                  padding: '12px',
                  zIndex: 1000
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>분석 모듈</div>
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

                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>상태</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {['Completed', 'Processing', 'Pending'].map(status => (
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
                </div>
              )}
            </div>
          </ComponentGroup>

          <ComponentGroup label="View Mode Toggle">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setViewType('grid')}
                className="btn btn-ghost btn-sm"
                style={{
                  borderRadius: 0,
                  border: 'none',
                  backgroundColor: viewType === 'grid' ? 'hsl(var(--muted))' : 'transparent',
                  padding: '8px 12px'
                }}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewType('list')}
                className="btn btn-ghost btn-sm"
                style={{
                  borderRadius: 0,
                  border: 'none',
                  backgroundColor: viewType === 'list' ? 'hsl(var(--muted))' : 'transparent',
                  padding: '8px 12px'
                }}
              >
                <List size={16} />
              </button>
            </div>
          </ComponentGroup>

          <ComponentGroup label="More Menu Button (Vertical)">
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '4px' }}
              >
                <MoreVertical size={16} />
              </button>

              {showMoreMenu && (
                <div className="dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  minWidth: '160px',
                  padding: '4px',
                  zIndex: 1000
                }}>
                  <button className="dropdown-item">
                    <Edit size={14} />
                    <span>수정</span>
                  </button>
                  <button className="dropdown-item">
                    <Copy size={14} />
                    <span>복제</span>
                  </button>
                  <button className="dropdown-item" style={{ color: 'hsl(var(--destructive))' }}>
                    <Trash2 size={14} />
                    <span>삭제</span>
                  </button>
                </div>
              )}
            </div>
          </ComponentGroup>
        </Section>

        {/* 라디오 버튼 (분석 모듈 선택 스타일) */}
        <Section title="Radio Buttons (Module Selection)" description="시나리오 생성에서 사용하는 분석 모듈 선택 스타일">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '800px' }}>
            <button
              onClick={() => setSelectedModule('Ratio Finder')}
              style={{
                padding: '16px',
                border: `1px solid ${selectedModule === 'Ratio Finder' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                borderRadius: '8px',
                backgroundColor: selectedModule === 'Ratio Finder' ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--foreground))' }}>
                <Scale size={18} />
                Ratio Finder
              </div>
              <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                TVC와 디지털 매체 간 최적 예산 배분 비율 탐색
              </div>
            </button>
            <button
              onClick={() => setSelectedModule('Reach Predictor')}
              style={{
                padding: '16px',
                border: `1px solid ${selectedModule === 'Reach Predictor' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                borderRadius: '8px',
                backgroundColor: selectedModule === 'Reach Predictor' ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--foreground))' }}>
                <Target size={18} />
                Reach Predictor
              </div>
              <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                광고 집행 전후의 통합 및 개별 매체 도달률 예측
              </div>
            </button>
          </div>
        </Section>

        {/* 인풋 필드 */}
        <Section title="Input Fields" description="텍스트 입력 및 검색 필드">
          <ComponentGroup label="Text Input with Character Count">
            <div style={{ width: '400px' }}>
              <input 
                type="text" 
                placeholder="시나리오명을 입력하세요 (최대 30자)" 
                className="input"
                style={{ width: '100%' }}
                maxLength={30}
              />
              <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginTop: '4px', textAlign: 'right' }}>
                0/30
              </div>
            </div>
          </ComponentGroup>

          <ComponentGroup label="Search Input">
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
              <input type="text" placeholder="브랜드 검색" className="input" style={{ paddingLeft: '40px', width: '100%' }} />
            </div>
          </ComponentGroup>

          <ComponentGroup label="Textarea with Character Count">
            <div style={{ width: '500px' }}>
              <textarea 
                placeholder="시나리오에 대한 설명을 입력하세요 (최대 200자)" 
                className="input"
                style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                maxLength={200}
              />
              <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginTop: '4px', textAlign: 'right' }}>
                0/200
              </div>
            </div>
          </ComponentGroup>
        </Section>

        {/* 드롭다운 */}
        <Section title="Dropdowns & Selects" description="실제 사용하는 선택 드롭다운">
          <ComponentGroup label="Industry Select (업종 선택 - ChevronRight)">
            <div style={{ position: 'relative', width: '400px' }}>
              <button
                onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                className="input"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ color: selectedIndustry ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                  {selectedIndustry || '업종을 선택하세요'}
                </span>
                <ChevronRight size={16} />
              </button>

              {showIndustryDropdown && (
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
                  {['전자/IT', '자동차', '식품/음료', '화장품/뷰티', '금융/보험', '유통/서비스'].map((industry) => (
                    <button
                      key={industry}
                      onClick={() => {
                        setSelectedIndustry(industry)
                        setShowIndustryDropdown(false)
                      }}
                      className="dropdown-item"
                      style={{
                        backgroundColor: selectedIndustry === industry ? 'hsl(var(--muted))' : 'transparent'
                      }}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ComponentGroup>

          <ComponentGroup label="Media Select (매체 선택 - ChevronDown)">
            <div style={{ position: 'relative', width: '300px' }}>
              <button
                onClick={() => setShowMediaDropdown(!showMediaDropdown)}
                className="input"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{selectedMedia}</span>
                <ChevronDown size={16} />
              </button>

              {showMediaDropdown && (
                <div className="dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  zIndex: 1000
                }}>
                  {['TV', 'Digital', 'Radio', 'Print', 'OOH'].map((media) => (
                    <button
                      key={media}
                      onClick={() => {
                        setSelectedMedia(media)
                        setShowMediaDropdown(false)
                      }}
                      className="dropdown-item"
                      style={{
                        backgroundColor: selectedMedia === media ? 'hsl(var(--muted))' : 'transparent'
                      }}
                    >
                      {media}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ComponentGroup>
        </Section>

        {/* 캘린더 */}
        <Section title="Date & Period Pickers" description="일/월/분기 선택 캘린더">
          <ComponentGroup label="Date Range Picker (일 → 일)">
            <div style={{ width: '400px' }}>
              <CustomDateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
          </ComponentGroup>

          <ComponentGroup label="Month Range Picker (월 → 월)">
            <MonthRangePicker
              type="month"
              value={monthRange}
              onChange={setMonthRange}
            />
          </ComponentGroup>

          <ComponentGroup label="Quarter Range Picker (분기 → 분기)">
            <MonthRangePicker
              type="quarter"
              value={quarterRange}
              onChange={setQuarterRange}
            />
          </ComponentGroup>
        </Section>

        {/* 타겟 GRP 다이얼로그 버튼 */}
        <Section title="Target GRP Selection" description="타겟 GRP 선택 다이얼로그">
          <ComponentGroup label="Target GRP Button">
            <button
              onClick={() => setShowTargetDialog(true)}
              className="input"
              style={{
                width: '400px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ color: selectedTargets.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                {selectedTargets.length === 24 
                  ? '전체' 
                  : selectedTargets.length > 0 
                  ? `${selectedTargets.length}개 타겟 선택됨` 
                  : '타겟 GRP를 선택하세요.'}
              </span>
              <ChevronRight size={16} />
            </button>
          </ComponentGroup>
        </Section>

        {/* 아바타 */}
        <Section title="Avatars" description="사용자 및 광고주 프로필 아바타">
          <ComponentGroup label="User Avatars">
            <Avatar name="Shin Jia" type="user" size={32} userId="USER001" />
            <Avatar name="Kim Eunseo" type="user" size={40} userId="USER002" />
            <Avatar name="Lee Minho" type="user" size={48} userId="USER003" />
          </ComponentGroup>

          <ComponentGroup label="Advertiser Avatars">
            <Avatar name="삼성전자" type="advertiser" size={32} />
            <Avatar name="카카오" type="advertiser" size={40} />
            <Avatar name="네이버" type="advertiser" size={48} />
          </ComponentGroup>
        </Section>

        {/* 배지 */}
        <Section title="Badges & Status" description="실제 사용하는 상태 표시 및 모듈 칩">
          <ComponentGroup label="Status Badges (DataShot Style)">
            <span style={{ 
              fontSize: '11px', 
              padding: '4px 10px', 
              borderRadius: '4px', 
              backgroundColor: 'hsl(var(--foreground))', 
              color: 'hsl(var(--background))', 
              border: '1px solid hsl(var(--foreground))',
              fontWeight: '500' 
            }}>
              Completed
            </span>
            <span style={{ 
              fontSize: '11px', 
              padding: '4px 10px', 
              borderRadius: '4px', 
              backgroundColor: 'hsl(var(--muted))', 
              color: 'hsl(var(--foreground))', 
              border: '1px solid hsl(var(--border))',
              fontWeight: '500' 
            }}>
              Processing
            </span>
            <span style={{ 
              fontSize: '11px', 
              padding: '4px 10px', 
              borderRadius: '4px', 
              backgroundColor: 'transparent', 
              color: 'hsl(var(--muted-foreground))', 
              border: '1px solid hsl(var(--border))',
              fontWeight: '500' 
            }}>
              Pending
            </span>
            <span style={{ 
              fontSize: '11px', 
              padding: '4px 10px', 
              borderRadius: '4px', 
              backgroundColor: 'hsl(var(--destructive))', 
              color: 'hsl(var(--destructive-foreground))', 
              border: '1px solid hsl(var(--destructive))',
              fontWeight: '500' 
            }}>
              Error
            </span>
          </ComponentGroup>

          <ComponentGroup label="Module Chips (SpinX Style)">
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: 'hsl(var(--foreground))',
              color: 'hsl(var(--background))',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Scale size={14} />
              Ratio Finder
            </span>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: 'hsl(var(--foreground))',
              color: 'hsl(var(--background))',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Target size={14} />
              Reach Predictor
            </span>
          </ComponentGroup>

          <ComponentGroup label="Industry Badge">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))' }}>
              <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>업종</span>
              <div style={{ width: '1px', height: '12px', backgroundColor: 'hsl(var(--border))' }} />
              <span style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--foreground))' }}>전자/IT</span>
            </div>
          </ComponentGroup>
        </Section>

        {/* 토스트 메시지 */}
        <Section title="Toast Messages" description="실제 사용하는 토스트 알림">
          <ComponentGroup label="Toast Examples">
            <button 
              className="btn btn-primary"
              onClick={() => setShowToast({ type: 'success', message: 'Slot이 성공적으로 생성되었습니다.' })}
            >
              성공 토스트 표시
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowToast({ type: 'error', message: 'Slot 생성에 실패했습니다. 다시 시도해주세요.' })}
            >
              오류 토스트 표시
            </button>
          </ComponentGroup>

          <ComponentGroup label="Toast Preview">
            <div style={{ 
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              maxWidth: '400px'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: 'hsl(var(--muted-foreground))' }}>Success Toast</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(142.1 76.2% 36.3% / 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <CheckCircle size={20} style={{ color: 'hsl(142.1 76.2% 36.3%)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px', color: 'hsl(var(--foreground))' }}>성공</p>
                    <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>Slot이 성공적으로 생성되었습니다.</p>
                  </div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <X size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
                  </button>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: 'hsl(var(--muted-foreground))' }}>Error Toast</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--destructive) / 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <AlertCircle size={20} style={{ color: 'hsl(var(--destructive))', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px', color: 'hsl(var(--foreground))' }}>오류</p>
                    <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>Slot 생성에 실패했습니다. 다시 시도해주세요.</p>
                  </div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <X size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
                  </button>
                </div>
              </div>
            </div>
          </ComponentGroup>
        </Section>

        {/* 페이지네이션 */}
        <Section title="Tables & Pagination" description="데이터 테이블 및 페이지 네비게이션">
          <ComponentGroup label="Data Table (Slot List Style)">
            <div style={{ 
              width: '100%', 
              maxWidth: '1200px',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ 
                    backgroundColor: 'hsl(var(--muted))',
                    borderBottom: '1px solid hsl(var(--border))'
                  }}>
                    <th style={{ 
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'hsl(var(--muted-foreground))',
                      width: '80px'
                    }}>ID</th>
                    <th style={{ 
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'hsl(var(--muted-foreground))'
                    }}>Slot</th>
                    <th style={{ 
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'hsl(var(--muted-foreground))'
                    }}>광고주</th>
                    <th style={{ 
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'hsl(var(--muted-foreground))',
                      width: '100px'
                    }}>가시성</th>
                    <th style={{ 
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'hsl(var(--muted-foreground))',
                      width: '120px'
                    }}>수정일</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'S001', name: '2024 Q4 캠페인', advertiser: '삼성전자', visibility: 'Private', date: '2024.03.10' },
                    { id: 'S002', name: '신제품 런칭', advertiser: '카카오', visibility: 'Shared', date: '2024.03.09' },
                    { id: 'S003', name: '브랜드 인지도 향상', advertiser: '현대자동차', visibility: 'Private', date: '2024.03.08' }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ 
                      borderBottom: '1px solid hsl(var(--border))',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ 
                        padding: '12px 16px',
                        fontSize: '13px',
                        color: 'hsl(var(--muted-foreground))'
                      }}>{row.id}</td>
                      <td style={{ 
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'hsl(var(--foreground))'
                      }}>{row.name}</td>
                      <td style={{ 
                        padding: '12px 16px',
                        fontSize: '13px',
                        color: 'hsl(var(--foreground))'
                      }}>{row.advertiser}</td>
                      <td style={{ 
                        padding: '12px 16px',
                        fontSize: '13px'
                      }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500',
                          backgroundColor: row.visibility === 'Private' ? 'hsl(var(--muted))' : 'hsl(var(--primary) / 0.1)',
                          color: row.visibility === 'Private' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--primary))',
                          border: `1px solid ${row.visibility === 'Private' ? 'hsl(var(--border))' : 'hsl(var(--primary) / 0.3)'}`
                        }}>
                          {row.visibility}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '12px 16px',
                        fontSize: '13px',
                        color: 'hsl(var(--muted-foreground))'
                      }}>{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ComponentGroup>

          <ComponentGroup label="Pagination with Page Count">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
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
                  <ChevronsLeft size={16} />
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
                  <ChevronLeft size={16} />
                </button>

                {/* 페이지 번호 */}
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ 
                      width: '32px',
                      height: '32px',
                      padding: '0',
                      fontSize: '14px',
                      fontWeight: currentPage === page ? '600' : '400'
                    }}
                  >
                    {page}
                  </button>
                ))}

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
                  <ChevronRight size={16} />
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
                  <ChevronsRight size={16} />
                </button>
              </div>

              {/* 페이지 정보 및 항목 수 선택 */}
              <div style={{ 
                fontSize: '13px', 
                color: 'hsl(var(--muted-foreground))',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span>Page {currentPage} of {totalPages}</span>
                <span style={{ color: 'hsl(var(--border))' }}>|</span>
                
                {/* 페이지당 항목 수 선택 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>페이지당 표시:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="input"
                    style={{
                      width: '70px',
                      padding: '4px 8px',
                      height: '28px',
                      minHeight: '28px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                
                <span style={{ color: 'hsl(var(--border))' }}>|</span>
                <span>Total 247 items</span>
              </div>
            </div>
          </ComponentGroup>
        </Section>

        {/* 툴팁 */}
        <Section title="Tooltips" description="정보 표시 툴팁">
          <ComponentGroup label="Info Tooltip">
            <div style={{ position: 'relative' }}>
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '6px' }}
              >
                <Info size={16} />
              </button>
              
              {showTooltip && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: '8px',
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  minWidth: '200px',
                  maxWidth: '300px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 1000
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'hsl(var(--foreground))' }}>
                    정보
                  </div>
                  <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', lineHeight: '1.5' }}>
                    이 항목에 대한 추가 정보가 여기에 표시됩니다.
                  </div>
                </div>
              )}
            </div>
          </ComponentGroup>
        </Section>

        {/* 공유 버튼 */}
        <Section title="Share Button" description="공유 기능 버튼">
          <ComponentGroup label="Share Menu">
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '6px' }}
              >
                <Share2 size={16} />
              </button>

              {showShareMenu && (
                <div className="dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  minWidth: '180px',
                  padding: '4px',
                  zIndex: 1000
                }}>
                  <button className="dropdown-item">
                    <Link2 size={14} />
                    <span>링크 복사</span>
                  </button>
                  <button className="dropdown-item">
                    <FileSpreadsheet size={14} />
                    <span>Excel 다운로드</span>
                  </button>
                  <button className="dropdown-item">
                    <FileText size={14} />
                    <span>PDF 다운로드</span>
                  </button>
                </div>
              )}
            </div>
          </ComponentGroup>
        </Section>

        {/* 다이얼로그 */}
        <Section title="Dialogs & Modals" description="다이얼로그 및 모달 예시">
          <ComponentGroup label="Dialog Trigger Buttons">
            <button className="btn btn-primary" onClick={() => setShowDialog(true)}>
              기본 다이얼로그 열기
            </button>
            <button className="btn btn-primary" onClick={() => setShowTargetDialog(true)}>
              타겟 GRP 다이얼로그 열기
            </button>
          </ComponentGroup>
        </Section>

        {/* Form Footer Buttons */}
        <Section title="Form Footer Buttons" description="생성/수정 화면 하단 버튼">
          <ComponentGroup label="Creation Form Footer">
            <div style={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              padding: '16px 24px',
              borderTop: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--muted) / 0.3)',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '800px'
            }}>
              <button className="btn btn-secondary btn-md">취소</button>
              <button className="btn btn-primary btn-md">
                <Plus size={16} />
                생성
              </button>
            </div>
          </ComponentGroup>

          <ComponentGroup label="Edit Form Footer">
            <div style={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              padding: '16px 24px',
              borderTop: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--muted) / 0.3)',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '800px'
            }}>
              <button className="btn btn-secondary btn-md">취소</button>
              <button className="btn btn-primary btn-md">저장</button>
            </div>
          </ComponentGroup>

          <ComponentGroup label="Multi-step Form Footer">
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '16px 24px',
              borderTop: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--muted) / 0.3)',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '800px'
            }}>
              <button className="btn btn-secondary btn-md">이전</button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-md">취소</button>
                <button className="btn btn-primary btn-md">다음</button>
              </div>
            </div>
          </ComponentGroup>
        </Section>

        {/* 기본 다이얼로그 */}
        {showDialog && (
          <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <div className="dialog-header">
                <h3 className="dialog-title">다이얼로그 제목</h3>
                <p className="dialog-description">다이얼로그 설명이 여기에 표시됩니다.</p>
              </div>
              <div style={{ padding: '24px' }}>
                <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
                  다이얼로그 내용이 여기에 표시됩니다.
                </p>
              </div>
              <div className="dialog-footer">
                <button className="btn btn-secondary btn-md" onClick={() => setShowDialog(false)}>취소</button>
                <button className="btn btn-primary btn-md" onClick={() => setShowDialog(false)}>확인</button>
              </div>
            </div>
          </div>
        )}

        {/* 타겟 GRP 다이얼로그 */}
        {showTargetDialog && (
          <div className="dialog-overlay" onClick={() => setShowTargetDialog(false)}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
              <div className="dialog-header">
                <h3 className="dialog-title">타겟 GRP 선택</h3>
                <p className="dialog-description">도달률 산출에 적용할 타겟 모수를 선택하세요</p>
              </div>
              
              <div style={{ padding: '24px' }}>
                {/* 남성 */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid hsl(var(--border))' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>남성</span>
                    <button onClick={selectAllMale} className="btn btn-ghost btn-sm">
                      {targetGrpOptions.male.every(t => selectedTargets.includes(t)) ? '전체 해제' : '전체 선택'}
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {targetGrpOptions.male.map((target) => (
                      <label key={target} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${selectedTargets.includes(target) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`, backgroundColor: selectedTargets.includes(target) ? 'hsl(var(--primary) / 0.1)' : 'transparent', transition: 'all 0.2s' }}>
                        <input type="checkbox" checked={selectedTargets.includes(target)} onChange={() => toggleTargetGrp(target)} className="checkbox-custom" />
                        <span style={{ fontSize: '12px' }}>{target.replace('남성 ', '')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 여성 */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid hsl(var(--border))' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>여성</span>
                    <button onClick={selectAllFemale} className="btn btn-ghost btn-sm">
                      {targetGrpOptions.female.every(t => selectedTargets.includes(t)) ? '전체 해제' : '전체 선택'}
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {targetGrpOptions.female.map((target) => (
                      <label key={target} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${selectedTargets.includes(target) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`, backgroundColor: selectedTargets.includes(target) ? 'hsl(var(--primary) / 0.1)' : 'transparent', transition: 'all 0.2s' }}>
                        <input type="checkbox" checked={selectedTargets.includes(target)} onChange={() => toggleTargetGrp(target)} className="checkbox-custom" />
                        <span style={{ fontSize: '12px' }}>{target.replace('여성 ', '')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="dialog-footer">
                <button onClick={() => setShowTargetDialog(false)} className="btn btn-secondary btn-md">취소</button>
                <button onClick={() => setShowTargetDialog(false)} className="btn btn-primary btn-md">
                  확인 ({selectedTargets.length}개 선택)
                </button>
              </div>
            </div>
          </div>
        )}

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
      </div>
    </AppLayout>
  )
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '64px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px', color: 'hsl(var(--foreground))' }}>{title}</h2>
        <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>{description}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>{children}</div>
    </div>
  )
}

function ComponentGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px', color: 'hsl(var(--foreground))' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>{children}</div>
    </div>
  )
}
