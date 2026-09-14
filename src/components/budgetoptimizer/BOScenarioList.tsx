import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, X, Filter, MoreVertical, Copy, Trash2, ArrowRightLeft, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react'
import { SlotHeader } from '../reachcaster/SlotHeader'
import { BOScenario, BOSlotData, KPI_LABELS } from './types'
import { sampleBOScenarios } from './sampleData'
import { maskEmail } from '../../utils/maskEmail'

interface BOScenarioListProps {
  slotData: BOSlotData
  onBack: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function BOScenarioList({ slotData, onBack: _onBack, onEdit, onDelete }: BOScenarioListProps) {
  const navigate = useNavigate()
  const [scenarios, setScenarios] = useState<BOScenario[]>(sampleBOScenarios)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [sortField, setSortField] = useState<string>('created')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [contextMenuId, setContextMenuId] = useState<number | null>(null)
  const [filters, setFilters] = useState({
    status: [] as string[],
    kpi: [] as string[],
    industry: [] as string[]
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const contextMenuRef = useRef<HTMLDivElement>(null)

  // 이동/삭제 다이얼로그 (Reach Caster 동일)
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingIds, setDeletingIds] = useState<number[]>([])
  const [moveTargetSlot, setMoveTargetSlot] = useState('')
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // 토스트 자동 닫기
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  // 외부 클릭 시 컨텍스트 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 필터링
  const filteredScenarios = scenarios.filter(s => {
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      if (!s.name.toLowerCase().includes(q) && !s.creator.toLowerCase().includes(q)) return false
    }
    if (filters.status.length > 0 && !filters.status.includes(s.status)) return false
    if (filters.kpi.length > 0 && !filters.kpi.includes(s.kpi)) return false
    if (filters.industry.length > 0 && !filters.industry.includes(s.industry)) return false
    return true
  })

  // 정렬
  const sortedScenarios = [...filteredScenarios].sort((a, b) => {
    let aVal: any, bVal: any
    switch (sortField) {
      case 'id': aVal = a.id; bVal = b.id; break
      case 'name': aVal = a.name; bVal = b.name; break
      case 'industry': aVal = a.industry; bVal = b.industry; break
      case 'kpi': aVal = KPI_LABELS[a.kpi] || a.kpi; bVal = KPI_LABELS[b.kpi] || b.kpi; break
      case 'totalBudget': aVal = a.totalBudget; bVal = b.totalBudget; break
      case 'period': aVal = a.startDate; bVal = b.startDate; break
      case 'status': aVal = a.status; bVal = b.status; break
      case 'creator': aVal = a.creator; bVal = b.creator; break
      case 'created': aVal = a.created; bVal = b.created; break
      default: aVal = a.created; bVal = b.created
    }
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // 페이지네이션
  const totalPages = Math.ceil(sortedScenarios.length / itemsPerPage)
  const paginatedScenarios = sortedScenarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedScenarios.map(s => s.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id))
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const formatBudget = (amount: number) => {
    return `${amount.toLocaleString()}원`
  }

  // 이동 확정 (Reach Caster 동일 패턴)
  const handleConfirmMove = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowToast({
        type: 'success',
        message: `${selectedIds.length}개 시나리오가 성공적으로 이동되었습니다.`
      })
      setSelectedIds([])
    } catch (error) {
      setShowToast({
        type: 'error',
        message: '시나리오 이동에 실패했습니다. 다시 시도해주세요.'
      })
    } finally {
      setShowMoveDialog(false)
      setMoveTargetSlot('')
    }
  }

  // 삭제 확정 (Reach Caster 동일 패턴)
  const handleConfirmDelete = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setScenarios(prev => prev.filter(s => !deletingIds.includes(s.id)))
      setShowToast({
        type: 'success',
        message: `${deletingIds.length}개 시나리오가 성공적으로 삭제되었습니다.`
      })
      setSelectedIds([])
    } catch (error) {
      setShowToast({
        type: 'error',
        message: '시나리오 삭제에 실패했습니다. 다시 시도해주세요.'
      })
    } finally {
      setShowDeleteDialog(false)
      setDeletingIds([])
    }
  }

  const activeFilterCount = filters.status.length + filters.kpi.length + filters.industry.length

  // Processing 단계별 설명 (Budget Optimizer 5단계)
  const getBOProcessingStepDescription = (step: number): string => {
    const steps: { [key: number]: string } = {
      1: '입력 조건 분석 중',
      2: '예산 배분 최적화 중',
      3: '최적 배분 성과 예측 중',
      4: '결과 시각화 중',
      5: '완료'
    }
    return steps[step] || '처리 중'
  }

  // 상태 뱃지 스타일 - Reach Caster 동일
  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string; border: string }> = {
      Completed: { bg: 'hsl(var(--foreground))', color: 'hsl(var(--background))', border: 'hsl(var(--foreground))' },
      Processing: { bg: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', border: 'hsl(var(--border))' },
      Pending: { bg: 'transparent', color: 'hsl(var(--muted-foreground))', border: 'hsl(var(--border))' },
      Error: { bg: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', border: 'hsl(var(--destructive))' }
    }
    return styles[status] || styles.Pending
  }

  // 업종 목록 (샘플 데이터 기반)
  const industries = [...new Set(scenarios.map(s => s.industry))]

  return (
    <div className="p-0">
      {/* Slot Header */}
      <SlotHeader
        slotId={1}
        slotData={slotData}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {/* Scenario Section */}
      <div className="workspace-content">
        {/* Title + New Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">
              Budget Optimizer
            </h1>
            <button
              onClick={() => navigate('/budgetoptimizer/scenario/new')}
              className="flex items-center gap-2 h-12 px-5 rounded-3xl border-none text-sm font-semibold cursor-pointer transition-all bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
            >
              <Plus size={16} />
              New Scenario
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          {/* Left: Count */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              {filteredScenarios.length} Scenarios
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Selected count */}
            {selectedIds.length > 0 && (
              <span className="text-sm text-[hsl(var(--primary))]">
                {selectedIds.length}개 선택됨
              </span>
            )}

            {/* 선택된 항목 일괄 작업 버튼 */}
            {selectedIds.length > 0 && (
              <>
                <button
                  onClick={() => setShowMoveDialog(true)}
                  className="btn btn-ghost btn-md border border-[hsl(var(--border))]"
                >
                  <ArrowRightLeft size={16} />
                  이동
                </button>
                <button
                  className="btn btn-md border-none bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]"
                  onClick={() => {
                    setDeletingIds(selectedIds)
                    setShowDeleteDialog(true)
                  }}
                >
                  <Trash2 size={16} />
                  삭제
                </button>
              </>
            )}

            {/* Search */}
            <div className="relative">
              {!showSearch ? (
                <button
                  onClick={() => setShowSearch(true)}
                  className="btn btn-ghost btn-md flex items-center gap-1.5 px-3 border border-[hsl(var(--border))]"
                >
                  <Search size={16} />
                  <span>검색</span>
                </button>
              ) : (
                <div className="relative w-[300px] transition-[width] duration-300 ease-out">
                  <Search size={16} className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 z-[1]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setShowSearch(false) }}
                    placeholder="시나리오명, 생성자 검색"
                    className="input w-full h-9 min-h-9 pl-10 pr-3"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(''); setShowSearch(false) }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 bg-none border-none cursor-pointer"
                    >
                      <X size={14} className="text-muted-foreground" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="btn btn-ghost btn-md flex items-center gap-1.5 px-3 border border-[hsl(var(--border))]"
                style={{ backgroundColor: activeFilterCount > 0 ? 'hsl(var(--primary) / 0.1)' : 'transparent' }}
              >
                <Filter size={16} />
                <span>필터</span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-[10px] text-[10px] font-semibold bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {showFilter && (
                <div className="dropdown custom-scrollbar absolute top-full right-0 mt-1 w-80 max-h-[500px] overflow-y-auto z-[1000] p-3">
                  {/* 상태 필터 */}
                  <div className="mb-4">
                    <div className="text-xs font-medium mb-2">상태</div>
                    <div className="flex flex-col gap-1.5">
                      {['Completed', 'Processing', 'Pending', 'Error'].map(status => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.status.includes(status)}
                            onChange={(e) => {
                              if (e.target.checked) setFilters(f => ({ ...f, status: [...f.status, status] }))
                              else setFilters(f => ({ ...f, status: f.status.filter(s => s !== status) }))
                            }}
                            className="checkbox-custom"
                          />
                          <span className="text-[13px]">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* KPI 필터 */}
                  <div className="mb-4">
                    <div className="text-xs font-medium mb-2">KPI</div>
                    <div className="flex flex-col gap-1.5">
                      {Object.entries(KPI_LABELS).map(([key, label]) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.kpi.includes(key)}
                            onChange={(e) => {
                              if (e.target.checked) setFilters(f => ({ ...f, kpi: [...f.kpi, key] }))
                              else setFilters(f => ({ ...f, kpi: f.kpi.filter(k => k !== key) }))
                            }}
                            className="checkbox-custom"
                          />
                          <span className="text-[13px]">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 업종 필터 */}
                  <div className="mb-4">
                    <div className="text-xs font-medium mb-2">업종</div>
                    <div className="custom-scrollbar flex flex-col gap-1.5 max-h-[150px] overflow-y-auto">
                      {industries.map(ind => (
                        <label key={ind} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.industry.includes(ind)}
                            onChange={(e) => {
                              if (e.target.checked) setFilters(f => ({ ...f, industry: [...f.industry, ind] }))
                              else setFilters(f => ({ ...f, industry: f.industry.filter(i => i !== ind) }))
                            }}
                            className="checkbox-custom"
                          />
                          <span className="text-[13px]">{ind}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 필터 초기화 버튼 */}
                  <button
                    onClick={() => setFilters({ status: [], kpi: [], industry: [] })}
                    className="btn btn-ghost btn-sm w-full mt-2"
                  >
                    필터 초기화
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-[50px]">
                  <input
                    type="checkbox"
                    className="checkbox-custom"
                    checked={selectedIds.length === paginatedScenarios.length && paginatedScenarios.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th onClick={() => handleSort('id')} className="cursor-pointer w-20">
                  <div className="flex items-center gap-1">
                    ID {sortField === 'id' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th onClick={() => handleSort('name')} className="cursor-pointer min-w-[250px]">
                  <div className="flex items-center gap-1">
                    시나리오 {sortField === 'name' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th onClick={() => handleSort('industry')} className="cursor-pointer w-25">
                  <div className="flex items-center gap-1">
                    업종 {sortField === 'industry' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th onClick={() => handleSort('kpi')} className="cursor-pointer w-35">
                  <div className="flex items-center gap-1">
                    KPI {sortField === 'kpi' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th onClick={() => handleSort('totalBudget')} className="cursor-pointer w-30">
                  <div className="flex items-center gap-1">
                    총 예산 {sortField === 'totalBudget' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th onClick={() => handleSort('period')} className="cursor-pointer w-45">
                  <div className="flex items-center gap-1">
                    기간 {sortField === 'period' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th onClick={() => handleSort('status')} className="cursor-pointer w-[130px]">
                  <div className="flex items-center gap-1">
                    상태 {sortField === 'status' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th onClick={() => handleSort('creator')} className="cursor-pointer w-25">
                  <div className="flex items-center gap-1">
                    생성자 {sortField === 'creator' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th onClick={() => handleSort('created')} className="cursor-pointer w-35">
                  <div className="flex items-center gap-1">
                    생성일시 {sortField === 'created' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th className="w-[60px] text-right pr-6"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedScenarios.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-20">
                    <p className="text-muted-foreground text-sm">
                      등록된 시나리오가 없습니다.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedScenarios.map(scenario => {
                  const isSelected = selectedIds.includes(scenario.id)
                  const isClickable = scenario.status === 'Completed'
                  const statusStyle = getStatusStyle(scenario.status)

                  return (
                    <tr
                      key={scenario.id}
                      style={{
                        backgroundColor: isSelected ? 'hsl(var(--muted) / 0.3)' : undefined,
                        cursor: isClickable ? 'pointer' : 'default'
                      }}
                      onClick={() => {
                        if (isClickable) navigate(`/budgetoptimizer/scenario/${scenario.id}/result`)
                      }}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="checkbox-custom"
                          checked={isSelected}
                          onChange={(e) => handleSelect(scenario.id, e.target.checked)}
                        />
                      </td>
                      <td>
                        <span className="text-[13px] text-[hsl(var(--muted-foreground))]">
                          {scenario.id}
                        </span>
                      </td>
                      <td
                        className="font-normal max-w-[300px] whitespace-nowrap overflow-hidden text-ellipsis"
                        style={{
                          color: isClickable ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                          opacity: isClickable ? 1 : 0.6
                        }}
                        title={scenario.name}
                      >
                        {scenario.name}
                      </td>
                      <td className="text-muted-foreground">{scenario.industry}</td>
                      <td>
                        <span className="px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
                          {KPI_LABELS[scenario.kpi]}
                        </span>
                      </td>
                      <td>
                        <span className="text-[13px] font-medium">
                          {formatBudget(scenario.totalBudget)}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-col text-[13px] leading-[1.4] text-[hsl(var(--muted-foreground))]">
                          <span>{scenario.startDate} →</span>
                          <span>{scenario.endDate}</span>
                        </div>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col gap-1">
                          {scenario.status === 'Processing' ? (
                            <>
                              <div className="relative w-[100px] h-6 rounded overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
                                <div
                                  className="absolute top-0 left-0 h-full transition-[width] duration-300 ease-in-out bg-[hsl(var(--foreground))]"
                                  style={{ width: `${(scenario.processStep / scenario.totalSteps) * 100}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium z-[1] text-[hsl(var(--background))]">
                                  Processing
                                </div>
                              </div>
                              <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
                                {scenario.processStep}/{scenario.totalSteps} · {getBOProcessingStepDescription(scenario.processStep)}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="px-2.5 py-1 rounded text-xs font-medium"
                                  style={{
                                    backgroundColor: statusStyle.bg,
                                    color: statusStyle.color,
                                    border: `1px solid ${statusStyle.border}`
                                  }}
                                >
                                  {scenario.status}
                                </span>
                                {scenario.status === 'Error' && (
                                  <button
                                    onClick={(e) => { e.stopPropagation() }}
                                    className="px-2 py-1 text-[11px] underline cursor-pointer bg-none border-none text-[hsl(var(--foreground))]"
                                  >
                                    재시도
                                  </button>
                                )}
                              </div>
                              {scenario.completedAt && (
                                <span className="text-muted-foreground text-[11px]">
                                  {scenario.completedAt.slice(0, 16)}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="text-[13px] text-[hsl(var(--muted-foreground))]">
                          {scenario.creator}({maskEmail(scenario.creatorId)})
                        </span>
                      </td>
                      <td>
                        <span className="text-[13px] text-[hsl(var(--muted-foreground))]">
                          {scenario.created.slice(0, 16)}
                        </span>
                      </td>
                      <td className="text-right pr-6">
                        <div className="relative inline-block" ref={contextMenuId === scenario.id ? contextMenuRef : null} onClick={(e) => e.stopPropagation()}>
                          <button
                            data-context-menu
                            onClick={() => setContextMenuId(contextMenuId === scenario.id ? null : scenario.id)}
                            className="btn btn-ghost btn-sm p-1"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {contextMenuId === scenario.id && (
                            <div className="dropdown absolute top-full right-0 mt-1 w-30 z-[1000]">
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setScenarios(prev => {
                                    const target = prev.find(s => s.id === scenario.id)
                                    if (!target) return prev
                                    const newId = Math.max(0, ...prev.map(s => s.id)) + 1
                                    return [...prev, { ...target, id: newId, name: `${target.name} (사본)` }]
                                  })
                                  setContextMenuId(null)
                                  setShowToast({ type: 'success', message: '시나리오가 복제되었습니다.' })
                                }}
                              >
                                <Copy size={14} /> 복제
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setSelectedIds([scenario.id])
                                  setShowMoveDialog(true)
                                  setContextMenuId(null)
                                }}
                              >
                                <ArrowRightLeft size={14} /> 이동
                              </button>
                              <button
                                className="dropdown-item text-[hsl(var(--destructive))]"
                                onClick={() => {
                                  setDeletingIds([scenario.id])
                                  setShowDeleteDialog(true)
                                  setContextMenuId(null)
                                }}
                              >
                                <Trash2 size={14} /> 삭제
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 (Reach Caster 동일) */}
        <div className="flex items-center justify-between mt-6">
          {/* 좌측: 페이지 크기 선택 */}
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">
              페이지당 표시:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="input w-20 h-8 min-h-8 px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* 우측: 페이지 정보 및 네비게이션 */}
          <div className="flex items-center gap-6">
            {/* 페이지 정보 */}
            <span className="text-muted-foreground text-sm">
              {sortedScenarios.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedScenarios.length)} / {sortedScenarios.length}개
            </span>

            {/* 페이지 네비게이션 */}
            <div className="flex items-center gap-1">
              {/* 첫 페이지로 */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="btn btn-ghost btn-sm w-8 h-8 p-0"
                style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={14} />
                <ChevronLeft size={14} className="-ml-2" />
              </button>

              {/* 이전 페이지 */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-ghost btn-sm w-8 h-8 p-0"
                style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
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
                      className={`btn btn-sm w-8 h-8 p-0 text-sm ${currentPage === i ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontWeight: currentPage === i ? '600' : '400' }}
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
                disabled={currentPage === totalPages || totalPages === 0}
                className="btn btn-ghost btn-sm w-8 h-8 p-0"
                style={{ opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1, cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={14} />
              </button>

              {/* 마지막 페이지로 */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="btn btn-ghost btn-sm w-8 h-8 p-0"
                style={{ opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1, cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={14} />
                <ChevronRight size={14} className="-ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 시나리오 이동 다이얼로그 (Reach Caster 동일) */}
      {showMoveDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">
                시나리오 이동
              </h3>
              <p className="dialog-description">
                선택한 {selectedIds.length}개 시나리오를 다른 Slot으로 이동합니다.
              </p>
            </div>
            <div className="py-4">
              <div className="mb-3">
                <label className="block text-[13px] font-semibold mb-2">
                  이동할 Slot 선택 (광고주: {slotData.advertiser})
                </label>
                <select
                  className="input w-full"
                  value={moveTargetSlot}
                  onChange={(e) => setMoveTargetSlot(e.target.value)}
                >
                  <option value="">Slot을 선택하세요</option>
                  <option value="slot-1">CJ올리브영 2025 상반기</option>
                  <option value="slot-2">CJ올리브영 브랜드 캠페인</option>
                  <option value="slot-3">CJ올리브영 신제품 프로모션</option>
                </select>
              </div>
            </div>
            <div className="dialog-footer">
              <button
                onClick={() => { setShowMoveDialog(false); setMoveTargetSlot('') }}
                className="btn btn-secondary btn-sm"
              >
                취소
              </button>
              <button
                onClick={handleConfirmMove}
                disabled={!moveTargetSlot}
                className="btn btn-primary btn-sm"
                style={{ opacity: moveTargetSlot ? 1 : 0.5, cursor: moveTargetSlot ? 'pointer' : 'not-allowed' }}
              >
                이동
              </button>
              {/* 위 opacity/cursor는 moveTargetSlot 유무에 따른 동적 값이라 인라인 유지 */}
            </div>
          </div>
        </div>
      )}

      {/* 시나리오 삭제 확인 다이얼로그 (Reach Caster 동일) */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">
                시나리오를 삭제하시겠습니까?
              </h3>
              <p className="dialog-description">
                선택한 {deletingIds.length}개 시나리오를 삭제하면 복원할 수 없습니다. 정말로 삭제하시겠습니까?
              </p>
            </div>
            <div className="dialog-footer">
              <button
                onClick={() => { setShowDeleteDialog(false); setDeletingIds([]) }}
                className="btn btn-secondary btn-sm"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn btn-sm border-none bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 알림 (Reach Caster 동일) */}
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
  )
}
