import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, X, Filter, MoreVertical, Copy, Trash2, ArrowRightLeft, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react'
import { SlotHeader } from '../reachcaster/SlotHeader'
import {
  ACCuration,
  ACPurpose,
  ACSlotData,
  PURPOSE_LABELS,
  PURPOSE_ORDER,
  STATUS_BADGE_CLASSES,
  STATUS_OPTIONS
} from './types'
import { sampleACCurations, AC_MOVE_TARGET_SLOTS } from './sampleData'
import { maskEmail } from '../../utils/maskEmail'

type SortField = 'id' | 'name' | 'industry' | 'period' | 'status' | 'creator' | 'created'

interface ACCurationListProps {
  slotData: ACSlotData
  /** Admin/Marketer만 true. Agency/Client는 생성·선택·메뉴가 노출되지 않음 */
  canManage?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

interface BlockedCuration {
  id: number
  name: string
}

const formatDateTime = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

interface SortHeaderProps {
  field: SortField
  label: string
  className?: string
  sortField: SortField
  sortDirection: 'asc' | 'desc'
  onSort: (field: SortField) => void
}

function SortHeader({ field, label, className = '', sortField, sortDirection, onSort }: SortHeaderProps) {
  return (
    <th onClick={() => onSort(field)} className={`cursor-pointer ${className}`}>
      <div className="flex items-center gap-1">
        {label}
        {sortField === field && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
      </div>
    </th>
  )
}

/** 선택한 목적을 고정 순서(인지→조회→트래픽→전환)로 정렬 */
const sortPurposes = (purposes: ACPurpose[]): ACPurpose[] =>
  PURPOSE_ORDER.filter(p => purposes.includes(p))

/** 1개면 목적명, 2개 이상이면 "{대표 목적} 외 N" + hover/포커스 시 위쪽 툴팁 */
function PurposeCell({ purposes }: { purposes: ACPurpose[] }) {
  const ordered = sortPurposes(purposes)
  if (ordered.length <= 1) {
    return <span className="text-[13px]">{ordered.map(p => PURPOSE_LABELS[p]).join('')}</span>
  }
  return (
    <span className="group relative inline-block cursor-default text-[13px] outline-none" tabIndex={0}>
      {PURPOSE_LABELS[ordered[0]]} 외 {ordered.length - 1}
      <span className="pointer-events-none absolute left-0 bottom-full z-[1000] mb-1 hidden whitespace-nowrap rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2.5 py-1.5 text-xs shadow-sm group-hover:block group-focus:block">
        {ordered.map(p => PURPOSE_LABELS[p]).join(' · ')}
      </span>
    </span>
  )
}

export function ACCurationList({ slotData, canManage = true, onEdit, onDelete }: ACCurationListProps) {
  const navigate = useNavigate()
  const [curations, setCurations] = useState<ACCuration[]>(sampleACCurations)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [sortField, setSortField] = useState<SortField>('created')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [contextMenuId, setContextMenuId] = useState<number | null>(null)
  const [filters, setFilters] = useState({
    status: [] as string[],
    purpose: [] as string[],
    industry: [] as string[]
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const contextMenuRef = useRef<HTMLDivElement>(null)

  // 이동/삭제 다이얼로그
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [showMoveBlockDialog, setShowMoveBlockDialog] = useState(false)
  const [blockedCurations, setBlockedCurations] = useState<BlockedCuration[]>([])
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

  // 상태 실시간 갱신 시뮬레이션 (실서버 연동 시 Polling/SSE로 대체). 변경된 행만 갱신됨
  useEffect(() => {
    const timer = setInterval(() => {
      setCurations(prev => prev.map(c => {
        if (c.status === 'Pending') return { ...c, status: 'Processing' }
        if (c.status === 'Processing') return { ...c, status: 'Completed', completedAt: formatDateTime(new Date()) }
        return c
      }))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // 검색·필터 변경 시 첫 페이지로
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filters])

  // 검색·필터·정렬·페이지 변경 시 선택 해제 (보이지 않는 항목이 일괄 작업에 포함되는 사고 방지)
  useEffect(() => {
    setSelectedIds([])
  }, [searchQuery, filters, sortField, sortDirection, currentPage, itemsPerPage])

  // 필터링
  const filteredCurations = curations.filter(c => {
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      if (!c.name.toLowerCase().includes(q) && !c.creator.toLowerCase().includes(q)) return false
    }
    if (filters.status.length > 0 && !filters.status.includes(c.status)) return false
    if (filters.purpose.length > 0 && !c.purposes.some(p => filters.purpose.includes(p))) return false
    if (filters.industry.length > 0 && !filters.industry.includes(c.industry)) return false
    return true
  })

  // 실시간 갱신으로 목록에서 사라진 행은 선택에서도 제거
  const activeSelectedIds = selectedIds.filter(id => filteredCurations.some(c => c.id === id))

  // 정렬
  const sortedCurations = [...filteredCurations].sort((a, b) => {
    let aVal: string | number
    let bVal: string | number
    switch (sortField) {
      case 'id': aVal = a.id; bVal = b.id; break
      case 'name': aVal = a.name; bVal = b.name; break
      case 'industry': aVal = a.industry; bVal = b.industry; break
      case 'period': aVal = a.startDate; bVal = b.startDate; break
      case 'status': aVal = a.status; bVal = b.status; break
      case 'creator': aVal = a.creator; bVal = b.creator; break
      default: aVal = a.created; bVal = b.created
    }
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // 페이지네이션
  const totalPages = Math.ceil(sortedCurations.length / itemsPerPage)
  const paginatedCurations = sortedCurations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginatedCurations.map(c => c.id) : [])
  }

  const handleSelect = (id: number, checked: boolean) => {
    setSelectedIds(prev => (checked ? [...prev, id] : prev.filter(i => i !== id)))
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // 복제: 생성 화면 Step 1로 이동. 큐레이션명 앞에 "(복제)" 접두, 캠페인 기간은 프리필하지 않음
  const handleDuplicate = (curation: ACCuration) => {
    setContextMenuId(null)
    navigate('/adcurator/curation/new', {
      state: {
        prefill: {
          name: `(복제) ${curation.name}`,
          description: curation.description,
          industryMode: curation.industryMode,
          brand: curation.brand,
          industry: curation.industry,
          promotionIncluded: curation.promotionIncluded,
          purposes: sortPurposes(curation.purposes)
        }
      }
    })
  }

  // 이동 확정
  const handleConfirmMove = async () => {
    const target = AC_MOVE_TARGET_SLOTS.find(s => s.id === moveTargetSlot)
    if (!target) return

    // 프로모션 포함 큐레이션은 Shared Slot으로 이동 불가 → 이동 대신 안내 다이얼로그
    if (target.visibility === 'Shared') {
      const blocked = curations.filter(c => activeSelectedIds.includes(c.id) && c.promotionIncluded)
      if (blocked.length > 0) {
        setBlockedCurations(blocked.map(c => ({ id: c.id, name: c.name })))
        setShowMoveBlockDialog(true)
        return
      }
    }

    const movingIds = activeSelectedIds
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurations(prev => prev.filter(c => !movingIds.includes(c.id)))
      setShowToast({
        type: 'success',
        message: `${movingIds.length}개 큐레이션이 성공적으로 이동되었습니다.`
      })
      setSelectedIds([])
    } catch (error) {
      setShowToast({
        type: 'error',
        message: '큐레이션 이동에 실패했습니다. 다시 시도해주세요.'
      })
    } finally {
      setShowMoveDialog(false)
      setMoveTargetSlot('')
    }
  }

  // 삭제 확정
  const handleConfirmDelete = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurations(prev => prev.filter(c => !deletingIds.includes(c.id)))
      setShowToast({
        type: 'success',
        message: `${deletingIds.length}개 큐레이션이 성공적으로 삭제되었습니다.`
      })
      setSelectedIds([])
    } catch (error) {
      setShowToast({
        type: 'error',
        message: '큐레이션 삭제에 실패했습니다. 다시 시도해주세요.'
      })
    } finally {
      setShowDeleteDialog(false)
      setDeletingIds([])
    }
  }

  const activeFilterCount = filters.status.length + filters.purpose.length + filters.industry.length

  // 업종 목록 (목록 데이터 기반)
  const industries = [...new Set(curations.map(c => c.industry))]

  const toggleFilter = (group: 'status' | 'purpose' | 'industry', value: string, checked: boolean) => {
    setFilters(f => ({
      ...f,
      [group]: checked ? [...f[group], value] : f[group].filter(v => v !== value)
    }))
  }

  const columnCount = 8 + (canManage ? 2 : 0)
  const sortProps = { sortField, sortDirection, onSort: handleSort }

  return (
    <div className="p-0">
      {/* Slot Header */}
      <SlotHeader
        slotId={1}
        slotData={slotData}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="workspace-content">
        {/* Title + New Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Ad Curator</h1>
            {canManage && (
              <button
                onClick={() => navigate('/adcurator/curation/new')}
                className="flex items-center gap-2 h-12 px-5 rounded-3xl border-none text-sm font-semibold cursor-pointer transition-all bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)]"
              >
                <Plus size={16} />
                New Curation
              </button>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              {filteredCurations.length} Curations
            </div>
          </div>

          <div className="flex items-center gap-3">
            {canManage && activeSelectedIds.length > 0 && (
              <>
                <span className="text-sm text-[hsl(var(--primary))]">
                  {activeSelectedIds.length}개 선택됨
                </span>
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
                    setDeletingIds(activeSelectedIds)
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
                    placeholder="큐레이션명, 생성자 검색"
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
                className={`btn btn-ghost btn-md flex items-center gap-1.5 px-3 border border-[hsl(var(--border))] ${activeFilterCount > 0 ? 'bg-[hsl(var(--primary)/0.1)]' : 'bg-transparent'}`}
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
                  {/* 상태 */}
                  <div className="mb-4">
                    <div className="text-xs font-medium mb-2">상태</div>
                    <div className="flex flex-col gap-1.5">
                      {STATUS_OPTIONS.map(status => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.status.includes(status)}
                            onChange={(e) => toggleFilter('status', status, e.target.checked)}
                            className="checkbox-custom"
                          />
                          <span className="text-[13px]">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 캠페인 목적 */}
                  <div className="mb-4">
                    <div className="text-xs font-medium mb-2">목적</div>
                    <div className="flex flex-col gap-1.5">
                      {PURPOSE_ORDER.map(purpose => (
                        <label key={purpose} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.purpose.includes(purpose)}
                            onChange={(e) => toggleFilter('purpose', purpose, e.target.checked)}
                            className="checkbox-custom"
                          />
                          <span className="text-[13px]">{PURPOSE_LABELS[purpose]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 업종 */}
                  <div className="mb-4">
                    <div className="text-xs font-medium mb-2">업종</div>
                    <div className="custom-scrollbar flex flex-col gap-1.5 max-h-[150px] overflow-y-auto">
                      {industries.map(ind => (
                        <label key={ind} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.industry.includes(ind)}
                            onChange={(e) => toggleFilter('industry', ind, e.target.checked)}
                            className="checkbox-custom"
                          />
                          <span className="text-[13px]">{ind}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setFilters({ status: [], purpose: [], industry: [] })}
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
                {canManage && (
                  <th className="w-[50px]">
                    <input
                      type="checkbox"
                      className="checkbox-custom"
                      checked={activeSelectedIds.length === paginatedCurations.length && paginatedCurations.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                )}
                <SortHeader field="id" label="ID" className="w-20" {...sortProps} />
                <SortHeader field="name" label="큐레이션" className="min-w-[200px]" {...sortProps} />
                <SortHeader field="industry" label="업종" className="w-25" {...sortProps} />
                <th className="w-[130px]">목적</th>
                <SortHeader field="period" label="기간" className="w-45" {...sortProps} />
                <SortHeader field="status" label="상태" className="w-[190px]" {...sortProps} />
                <SortHeader field="creator" label="생성자" className="w-[170px]" {...sortProps} />
                <SortHeader field="created" label="생성일시" className="w-[170px]" {...sortProps} />
                {canManage && <th className="w-[60px] text-right pr-6"></th>}
              </tr>
            </thead>
            <tbody>
              {paginatedCurations.length === 0 ? (
                <tr>
                  <td colSpan={columnCount} className="text-center py-20">
                    <p className="text-muted-foreground text-sm">
                      생성된 큐레이션이 없습니다.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedCurations.map(curation => {
                  const isSelected = activeSelectedIds.includes(curation.id)
                  const isClickable = curation.status === 'Completed'

                  return (
                    <tr
                      key={curation.id}
                      className={`${isClickable ? 'cursor-pointer' : 'cursor-default'} ${isSelected ? 'bg-[hsl(var(--muted)/0.3)]' : ''}`}
                      onClick={() => {
                        if (isClickable) navigate(`/adcurator/curation/${curation.id}/result`)
                      }}
                    >
                      {canManage && (
                        <td onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="checkbox-custom"
                            checked={isSelected}
                            onChange={(e) => handleSelect(curation.id, e.target.checked)}
                          />
                        </td>
                      )}
                      <td>
                        <span className="text-[13px] text-[hsl(var(--muted-foreground))]">
                          {curation.id}
                        </span>
                      </td>
                      <td
                        className={`font-normal max-w-[240px] whitespace-nowrap overflow-hidden text-ellipsis ${isClickable ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] opacity-60'}`}
                        title={curation.name}
                      >
                        {curation.name}
                      </td>
                      <td className="text-muted-foreground">{curation.industry}</td>
                      <td>
                        <PurposeCell purposes={curation.purposes} />
                      </td>
                      <td>
                        <div className="flex flex-col text-[13px] leading-[1.4] text-[hsl(var(--muted-foreground))]">
                          <span>{curation.startDate} →</span>
                          <span>{curation.endDate}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col items-start gap-1">
                          <span className={`px-2.5 py-1 rounded text-xs font-medium border ${STATUS_BADGE_CLASSES[curation.status]}`}>
                            {curation.status}
                          </span>
                          {curation.status === 'Completed' && curation.completedAt && (
                            <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
                              {curation.completedAt}
                            </span>
                          )}
                          {curation.status === 'Error' && curation.errorAt && (
                            <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
                              {curation.errorAt}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col text-[13px] leading-[1.4]">
                          <span>{curation.creator}</span>
                          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{maskEmail(curation.creatorId)}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-[13px] text-[hsl(var(--muted-foreground))]">
                          {curation.created}
                        </span>
                      </td>
                      {canManage && (
                        <td className="text-right pr-6">
                          <div className="relative inline-block" ref={contextMenuId === curation.id ? contextMenuRef : null} onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setContextMenuId(contextMenuId === curation.id ? null : curation.id)}
                              className="btn btn-ghost btn-sm p-1"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {contextMenuId === curation.id && (
                              <div className="dropdown absolute top-full right-0 mt-1 w-30 z-[1000]">
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleDuplicate(curation)}
                                >
                                  <Copy size={14} /> 복제
                                </button>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    setSelectedIds([curation.id])
                                    setShowMoveDialog(true)
                                    setContextMenuId(null)
                                  }}
                                >
                                  <ArrowRightLeft size={14} /> 이동
                                </button>
                                <button
                                  className="dropdown-item text-[hsl(var(--destructive))]"
                                  onClick={() => {
                                    setDeletingIds([curation.id])
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
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between mt-6">
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

          <div className="flex items-center gap-6">
            <span className="text-muted-foreground text-sm">
              {sortedCurations.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedCurations.length)} / {sortedCurations.length}개
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="btn btn-ghost btn-sm w-8 h-8 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
                <ChevronLeft size={14} className="-ml-2" />
              </button>

              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-ghost btn-sm w-8 h-8 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>

              {(() => {
                const pages = []
                const maxVisible = 5
                let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
                const end = Math.min(totalPages, start + maxVisible - 1)

                if (end - start + 1 < maxVisible) {
                  start = Math.max(1, end - maxVisible + 1)
                }

                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`btn btn-sm w-8 h-8 p-0 text-sm ${currentPage === i ? 'btn-primary font-semibold' : 'btn-ghost font-normal'}`}
                    >
                      {i}
                    </button>
                  )
                }

                return pages
              })()}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="btn btn-ghost btn-sm w-8 h-8 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="btn btn-ghost btn-sm w-8 h-8 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
                <ChevronRight size={14} className="-ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 큐레이션 이동 다이얼로그 */}
      {showMoveDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">
                큐레이션 이동
              </h3>
              <p className="dialog-description">
                선택한 {activeSelectedIds.length}개 큐레이션을 다른 Slot으로 이동합니다.
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
                  {AC_MOVE_TARGET_SLOTS.map(slot => (
                    <option key={slot.id} value={slot.id}>{slot.name} ({slot.visibility})</option>
                  ))}
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
                className="btn btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이동
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이동 불가 안내 다이얼로그 (Shared Slot × 프로모션 포함) */}
      {showMoveBlockDialog && (
        <div className="dialog-overlay z-[1100]">
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">이동 불가 안내</h3>
              <p className="dialog-description">
                아래 {blockedCurations.length}건의 프로모션 포함 큐레이션은 Shared Slot으로 이동할 수 없습니다.
                <br />
                해당 큐레이션을 제외한 후 다시 시도해 주세요.
              </p>
            </div>
            <div className="custom-scrollbar px-6 pb-4 max-h-40 overflow-y-auto">
              <div className="border border-[hsl(var(--border))] rounded-lg overflow-hidden">
                <table className="data-table w-full text-[13px]">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>큐레이션명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockedCurations.map(item => (
                      <tr key={item.id}>
                        <td className="font-mono text-xs">{item.id}</td>
                        <td>{item.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="dialog-footer">
              <button
                onClick={() => setShowMoveBlockDialog(false)}
                className="btn btn-primary btn-sm"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 큐레이션 삭제 확인 다이얼로그 */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">
                큐레이션을 삭제하시겠습니까?
              </h3>
              <p className="dialog-description">
                선택한 {deletingIds.length}개 큐레이션을 삭제하면 복원할 수 없습니다. 정말로 삭제하시겠습니까?
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

      {/* 토스트 알림 */}
      {showToast && (
        <div className={`toast ${showToast.type === 'success' ? 'toast--success' : 'toast--error'}`}>
          <div className="toast__icon">
            {showToast.type === 'success' ? (
              <CheckCircle size={20} className="text-[hsl(142.1_76.2%_36.3%)]" />
            ) : (
              <AlertCircle size={20} className="text-[hsl(var(--destructive))]" />
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
