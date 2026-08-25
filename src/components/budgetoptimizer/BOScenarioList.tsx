import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, X, Filter, MoreVertical, Copy, Trash2, ArrowRightLeft, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const itemsPerPage = 10

  const contextMenuRef = useRef<HTMLDivElement>(null)

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
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
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
      case 'name': aVal = a.name; bVal = b.name; break
      case 'created': aVal = a.created; bVal = b.created; break
      case 'totalBudget': aVal = a.totalBudget; bVal = b.totalBudget; break
      case 'status': aVal = a.status; bVal = b.status; break
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
    if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억`
    if (amount >= 10000) return `${(amount / 10000).toFixed(0)}만`
    return amount.toLocaleString()
  }

  const formatDate = (dateStr: string) => {
    return dateStr.split(' ')[0]
  }

  const activeFilterCount = filters.status.length + filters.kpi.length + filters.industry.length

  // Processing 단계별 설명 (Budget Optimizer 6단계)
  const getBOProcessingStepDescription = (step: number): string => {
    const steps: { [key: number]: string } = {
      1: '입력 조건 분석 중',
      2: '매체 기여도 산출 중',
      3: '예산 배분 최적화 중',
      4: '최적 배분 성과 예측 중',
      5: '결과 시각화 중',
      6: '완료'
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
    <div style={{ padding: '0' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '600' }}>
              Budget Optimizer
            </h1>
            <button
              onClick={() => navigate('/budgetoptimizer/scenario/new')}
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

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          {/* Left: Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
              {filteredScenarios.length} Scenarios
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Selected count */}
            {selectedIds.length > 0 && (
              <span style={{ fontSize: '14px', color: 'hsl(var(--primary))' }}>
                {selectedIds.length}개 선택됨
              </span>
            )}

            {/* 선택된 항목 일괄 작업 버튼 */}
            {selectedIds.length > 0 && (
              <>
                <button
                  onClick={() => {
                    console.log('이동:', selectedIds)
                  }}
                  className="btn btn-ghost btn-md"
                  style={{ border: '1px solid hsl(var(--border))' }}
                >
                  <ArrowRightLeft size={16} />
                  이동
                </button>
                <button
                  className="btn btn-md"
                  style={{ backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', border: 'none' }}
                  onClick={() => {
                    setScenarios(prev => prev.filter(s => !selectedIds.includes(s.id)))
                    setSelectedIds([])
                  }}
                >
                  <Trash2 size={16} />
                  삭제
                </button>
              </>
            )}

            {/* Search */}
            <div style={{ position: 'relative' }}>
              {!showSearch ? (
                <button
                  onClick={() => setShowSearch(true)}
                  className="btn btn-ghost btn-md"
                  style={{ border: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', gap: '6px', padding: '0 12px' }}
                >
                  <Search size={16} />
                  <span>검색</span>
                </button>
              ) : (
                <div style={{ position: 'relative', width: '300px', transition: 'width 0.3s ease-out' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} className="text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setShowSearch(false) }}
                    placeholder="시나리오명, 작성자 검색"
                    className="input"
                    autoFocus
                    style={{ paddingLeft: '40px', paddingRight: '12px', height: '36px', minHeight: '36px', width: '100%' }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(''); setShowSearch(false) }}
                      style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={14} className="text-muted-foreground" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Filter */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="btn btn-ghost btn-md"
                style={{
                  border: '1px solid hsl(var(--border))',
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '0 12px',
                  backgroundColor: activeFilterCount > 0 ? 'hsl(var(--primary) / 0.1)' : 'transparent'
                }}
              >
                <Filter size={16} />
                <span>필터</span>
                {activeFilterCount > 0 && (
                  <span style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '10px', padding: '2px 6px', fontSize: '10px', fontWeight: '600' }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {showFilter && (
                <div className="dropdown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', width: '280px', padding: '16px', zIndex: 1000 }}>
                  {/* Status Filter */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }} className="text-muted-foreground">상태</div>
                    {['Pending', 'Processing', 'Completed', 'Error'].map(status => (
                      <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer', fontSize: '13px' }} className="text-foreground">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) setFilters(f => ({ ...f, status: [...f.status, status] }))
                            else setFilters(f => ({ ...f, status: f.status.filter(s => s !== status) }))
                          }}
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                  {/* KPI Filter */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }} className="text-muted-foreground">KPI</div>
                    {Object.entries(KPI_LABELS).map(([key, label]) => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer', fontSize: '13px' }} className="text-foreground">
                        <input
                          type="checkbox"
                          checked={filters.kpi.includes(key)}
                          onChange={(e) => {
                            if (e.target.checked) setFilters(f => ({ ...f, kpi: [...f.kpi, key] }))
                            else setFilters(f => ({ ...f, kpi: f.kpi.filter(k => k !== key) }))
                          }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                  {/* Industry Filter */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }} className="text-muted-foreground">업종</div>
                    {industries.map(ind => (
                      <label key={ind} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer', fontSize: '13px' }} className="text-foreground">
                        <input
                          type="checkbox"
                          checked={filters.industry.includes(ind)}
                          onChange={(e) => {
                            if (e.target.checked) setFilters(f => ({ ...f, industry: [...f.industry, ind] }))
                            else setFilters(f => ({ ...f, industry: f.industry.filter(i => i !== ind) }))
                          }}
                        />
                        {ind}
                      </label>
                    ))}
                  </div>
                  {/* Reset */}
                  {activeFilterCount > 0 && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setFilters({ status: [], kpi: [], industry: [] })}
                      style={{ width: '100%', fontSize: '12px', marginTop: '8px' }}
                    >
                      필터 초기화
                    </button>
                  )}
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
                <th style={{ width: '50px' }}>
                  <input
                    type="checkbox"
                    className="checkbox-custom"
                    checked={selectedIds.length === paginatedScenarios.length && paginatedScenarios.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', width: '80px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ID {sortField === 'name' ? null : null}
                  </div>
                </th>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', minWidth: '250px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    시나리오 {sortField === 'name' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th style={{ width: '100px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>업종</div>
                </th>
                <th style={{ width: '80px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>KPI</div>
                </th>
                <th onClick={() => handleSort('totalBudget')} style={{ cursor: 'pointer', width: '120px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    총 예산 {sortField === 'totalBudget' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th style={{ width: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>기간</div>
                </th>
                <th onClick={() => handleSort('status')} style={{ cursor: 'pointer', width: '130px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    상태 {sortField === 'status' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th onClick={() => handleSort('creator')} style={{ cursor: 'pointer', width: '100px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    생성자 {sortField === 'creator' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th onClick={() => handleSort('created')} style={{ cursor: 'pointer', width: '140px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    생성일시 {sortField === 'created' && (sortDirection === 'asc' ? <ChevronLeft size={14} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={14} style={{ transform: 'rotate(-90deg)' }} />)}
                  </div>
                </th>
                <th style={{ width: '60px', textAlign: 'right', paddingRight: '1.5rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedScenarios.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '80px 0' }}>
                    <p style={{ fontSize: '14px', marginBottom: '8px' }} className="text-muted-foreground">
                      아직 생성된 시나리오가 없습니다.
                    </p>
                    <p style={{ fontSize: '13px' }} className="text-muted-foreground">
                      새 시나리오를 생성하여 최적 예산 배분을 탐색하세요.
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
                        <span style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                          #{scenario.id}
                        </span>
                      </td>
                      <td style={{
                        fontWeight: '400',
                        color: isClickable ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                        opacity: isClickable ? 1 : 0.6
                      }}>
                        {scenario.name}
                      </td>
                      <td className="text-muted-foreground">{scenario.industry}</td>
                      <td>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: 'hsl(var(--primary) / 0.1)',
                          color: 'hsl(var(--primary))'
                        }}>
                          {KPI_LABELS[scenario.kpi]}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                          {formatBudget(scenario.totalBudget)}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px', color: 'hsl(var(--muted-foreground))', lineHeight: '1.4' }}>
                          <span>{scenario.startDate} →</span>
                          <span>{scenario.endDate}</span>
                        </div>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {scenario.status === 'Processing' ? (
                            <>
                              <div style={{
                                position: 'relative', width: '100px', height: '24px',
                                borderRadius: '4px', border: '1px solid hsl(var(--border))',
                                overflow: 'hidden', backgroundColor: 'hsl(var(--muted))'
                              }}>
                                <div style={{
                                  position: 'absolute', top: 0, left: 0, height: '100%',
                                  width: `${(scenario.processStep / scenario.totalSteps) * 100}%`,
                                  backgroundColor: 'hsl(var(--foreground))', transition: 'width 0.3s ease'
                                }} />
                                <div style={{
                                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '12px', fontWeight: '500', color: 'hsl(var(--background))', zIndex: 1
                                }}>
                                  Processing
                                </div>
                              </div>
                              <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                                {scenario.processStep}/{scenario.totalSteps} · {getBOProcessingStepDescription(scenario.processStep)}
                              </span>
                            </>
                          ) : (
                            <>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                  padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '500',
                                  backgroundColor: statusStyle.bg, color: statusStyle.color,
                                  border: `1px solid ${statusStyle.border}`
                                }}>
                                  {scenario.status}
                                </span>
                                {scenario.status === 'Error' && (
                                  <button
                                    onClick={(e) => { e.stopPropagation() }}
                                    style={{ background: 'none', border: 'none', padding: '4px 8px', fontSize: '11px', color: 'hsl(var(--foreground))', cursor: 'pointer', textDecoration: 'underline' }}
                                  >
                                    재시도
                                  </button>
                                )}
                              </div>
                              {scenario.completedAt && (
                                <span style={{ fontSize: '11px' }} className="text-muted-foreground">
                                  {scenario.completedAt}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                          {scenario.creator}({maskEmail(scenario.creatorId)})
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                          {scenario.created.slice(0, 16)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }} ref={contextMenuId === scenario.id ? contextMenuRef : null} onClick={(e) => e.stopPropagation()}>
                          <button
                            data-context-menu
                            onClick={() => setContextMenuId(contextMenuId === scenario.id ? null : scenario.id)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px' }}
                          >
                            <MoreVertical size={16} />
                          </button>
                          {contextMenuId === scenario.id && (
                            <div className="dropdown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', width: '120px', zIndex: 1000 }}>
                              <button className="dropdown-item" onClick={() => setContextMenuId(null)}>
                                <Copy size={14} /> 복제
                              </button>
                              <button className="dropdown-item" onClick={() => setContextMenuId(null)}>
                                <ArrowRightLeft size={14} /> 이동
                              </button>
                              <button
                                className="dropdown-item"
                                style={{ color: 'hsl(0 84% 60%)' }}
                                onClick={() => { setScenarios(prev => prev.filter(s => s.id !== scenario.id)); setContextMenuId(null) }}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <span style={{ fontSize: '14px' }} className="text-muted-foreground">
              {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedScenarios.length)} / {sortedScenarios.length}개
            </span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '4px 8px' }}>
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: '14px', padding: '0 8px' }} className="text-foreground">{currentPage} / {totalPages}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '4px 8px' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
