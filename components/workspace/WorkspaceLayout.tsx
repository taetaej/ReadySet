import React, { useState, useEffect, useRef } from 'react'
import { Plus, Search, Filter, Clock, Calendar, Building2 as BuildingIcon, Grid3X3, List, Bell, Building2, Folder, Target, DollarSign, TrendingUp, ChevronRight, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react'
import { FolderGrid } from './FolderGrid'
import { CreateFolderModal } from './CreateFolderModal'

type SortField = 'modified' | 'created' | 'advertiser'
type SortDirection = 'asc' | 'desc'

interface SortOption {
  field: SortField
  direction: SortDirection
}

const SORT_OPTIONS = [
  { 
    field: 'modified' as SortField, 
    label: '수정일', 
    icon: Clock,
    desc: '최신순',
    asc: '오래된순'
  },
  { 
    field: 'created' as SortField, 
    label: '생성일', 
    icon: Calendar,
    desc: '최신순',
    asc: '오래된순'
  },
  { 
    field: 'advertiser' as SortField, 
    label: '광고주', 
    icon: BuildingIcon,
    desc: 'Z-A',
    asc: 'A-Z'
  }
]

export function WorkspaceLayout() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentSort, setCurrentSort] = useState<SortOption>({
    field: 'modified',
    direction: 'desc'
  })
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSortSelect = (field: SortField, direction: SortDirection) => {
    setCurrentSort({ field, direction })
    setSortDropdownOpen(false)
  }

  return (
    <div className="workspace">
      {/* GNB */}
      <header className="workspace__gnb">
        <div className="gnb__content">
          <div className="gnb__logo">
            <span className="logo">Reach Caster</span>
          </div>
          <div className="gnb__user">
            <Bell className="gnb__notification gnb__notification--disabled" />
            <div className="gnb__user-info">
              <span className="gnb__username">김마케터</span>
              <span className="gnb__role">Marketer</span>
            </div>
          </div>
        </div>
      </header>

      <div className="workspace__layout">
        {/* Sidebar Tree Navigation */}
        <aside className={`workspace-sidebar ${sidebarCollapsed ? 'workspace-sidebar--collapsed' : ''}`}>
          <div className="sidebar-header">
            <h2 className="sidebar-title">프로젝트 탐색기</h2>
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronRight className={`icon ${sidebarCollapsed ? '' : 'icon--rotated'}`} />
            </button>
          </div>
          
          <nav className="sidebar-tree">
            <div className="tree-node tree-node--root">
              <div className="tree-node__header">
                <Building2 className="tree-node__icon tree-node__icon--workspace" />
                <span className="tree-node__label">워크스페이스 (Adly)</span>
              </div>
              
              <div className="tree-node__children">
                <div className="tree-node tree-node--folder">
                  <div className="tree-node__header" data-expandable>
                    <ChevronRight className="tree-node__expand" />
                    <Folder className="tree-node__icon tree-node__icon--folder" />
                    <span className="tree-node__label">삼성 갤럭시 S24 캠페인</span>
                    <span className="tree-node__count">5</span>
                  </div>
                  
                  <div className="tree-node__children tree-node__children--collapsed">
                    <div className="tree-node tree-node--solution tree-node--active">
                      <div className="tree-node__header">
                        <Target className="tree-node__icon tree-node__icon--reach-caster" />
                        <span className="tree-node__label">Reach Caster</span>
                        <span className="tree-node__count">3</span>
                      </div>
                    </div>
                    
                    <div className="tree-node tree-node--solution tree-node--disabled">
                      <div className="tree-node__header">
                        <DollarSign className="tree-node__icon tree-node__icon--budget-optimizer" />
                        <span className="tree-node__label">Budget Optimizer</span>
                        <span className="tree-node__badge">준비중</span>
                      </div>
                    </div>
                    
                    <div className="tree-node tree-node--solution tree-node--disabled">
                      <div className="tree-node__header">
                        <TrendingUp className="tree-node__icon tree-node__icon--benchmark" />
                        <span className="tree-node__label">Benchmark</span>
                        <span className="tree-node__badge">준비중</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="tree-node tree-node--folder">
                  <div className="tree-node__header" data-expandable>
                    <ChevronRight className="tree-node__expand" />
                    <Folder className="tree-node__icon tree-node__icon--folder" />
                    <span className="tree-node__label">LG 올레드 TV 런칭</span>
                    <span className="tree-node__count">3</span>
                  </div>
                </div>
                
                <div className="tree-node tree-node--folder">
                  <div className="tree-node__header" data-expandable>
                    <ChevronRight className="tree-node__expand" />
                    <Folder className="tree-node__icon tree-node__icon--folder" />
                    <span className="tree-node__label">현대 아이오닉 6 마케팅</span>
                    <span className="tree-node__count">12</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="sidebar-footer">
            <button 
              className="btn btn--ghost btn--sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="btn__icon" />
              새 폴더
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="workspace__main">
          {/* Header with Breadcrumb */}
          <header className="workspace-header">
            <div className="workspace-header__content">
              <div className="workspace-header__left">
                <button className="sidebar-toggle-btn">
                  <ChevronRight className="icon" />
                </button>
                <div className="breadcrumb">
                  <span className="breadcrumb__item">워크스페이스</span>
                  <span className="breadcrumb__separator">/</span>
                  <span className="breadcrumb__item breadcrumb__item--current">전체 폴더</span>
                </div>
              </div>
              <div className="workspace-header__right">
                <button 
                  className="btn btn--primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="btn__icon" />
                  새 폴더
                </button>
              </div>
            </div>
          </header>

          {/* Search & Filter Bar */}
          <section className="workspace-filters">
            <div className="search-bar">
              <Search className="search-bar__icon" />
              <input 
                type="text" 
                placeholder="폴더명, 광고주명, 캠페인명으로 검색..."
                className="search-bar__input"
              />
            </div>
            <div className="filter-group">
              <select className="filter-select">
                <option>모든 광고주</option>
                <option>삼성전자</option>
                <option>LG전자</option>
                <option>현대자동차</option>
              </select>
              <select className="filter-select">
                <option>모든 가시성</option>
                <option>Private</option>
                <option>Internal</option>
                <option>Shared</option>
              </select>
              
              {/* Sort Buttons */}
              <div className="sort-dropdown" ref={dropdownRef}>
                <button
                  className="sort-button sort-button--dropdown"
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  aria-label="정렬 옵션 선택"
                  aria-expanded={sortDropdownOpen}
                >
                  {(() => {
                    const currentOption = SORT_OPTIONS.find(opt => opt.field === currentSort.field);
                    const IconComponent = currentOption?.icon || Clock;
                    const directionLabel = currentSort.direction === 'desc' ? currentOption?.desc : currentOption?.asc;
                    const DirectionIcon = currentSort.direction === 'desc' ? ArrowDown : ArrowUp;
                    
                    return (
                      <>
                        <IconComponent className="sort-button__icon" />
                        <span className="sort-button__label">{currentOption?.label}</span>
                        <span className="sort-button__direction">{directionLabel}</span>
                        <DirectionIcon className="sort-button__arrow" />
                        <ChevronDown className={`sort-button__chevron ${sortDropdownOpen ? 'sort-button__chevron--open' : ''}`} />
                      </>
                    );
                  })()}
                </button>

                {sortDropdownOpen && (
                  <div className="sort-dropdown__menu sort-dropdown__menu--open">
                    {SORT_OPTIONS.map(option => (
                      <div key={option.field} className="sort-dropdown__group">
                        <div className="sort-dropdown__group-header">
                          <option.icon className="w-4 h-4" />
                          <span>{option.label}</span>
                        </div>
                        <button
                          className={`sort-dropdown__option ${
                            currentSort.field === option.field && currentSort.direction === 'desc' 
                              ? 'sort-dropdown__option--selected' : ''
                          }`}
                          onClick={() => handleSortSelect(option.field, 'desc')}
                        >
                          <ArrowDown className="w-3 h-3" />
                          <span>{option.desc}</span>
                        </button>
                        <button
                          className={`sort-dropdown__option ${
                            currentSort.field === option.field && currentSort.direction === 'asc' 
                              ? 'sort-dropdown__option--selected' : ''
                          }`}
                          onClick={() => handleSortSelect(option.field, 'asc')}
                        >
                          <ArrowUp className="w-3 h-3" />
                          <span>{option.asc}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="view-toggle">
                <button 
                  className={`view-toggle__btn ${viewType === 'grid' ? 'view-toggle__btn--active' : ''}`}
                  onClick={() => setViewType('grid')}
                >
                  <Grid3X3 className="icon" />
                </button>
                <button 
                  className={`view-toggle__btn ${viewType === 'list' ? 'view-toggle__btn--active' : ''}`}
                  onClick={() => setViewType('list')}
                >
                  <List className="icon" />
                </button>
              </div>
            </div>
          </section>

          {/* Folder Grid */}
          <FolderGrid viewType={viewType} currentSort={currentSort} />
        </main>
      </div>

      {/* Create Folder Modal */}
      <CreateFolderModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}