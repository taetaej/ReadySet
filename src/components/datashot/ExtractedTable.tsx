
// 정렬/목록필터/지표필터/페이지네이션 + 집계행. 인라인 스타일 유지(datashot 규칙).
// 데이터: generateSampleData (Meta 100행, 시드 기반 결정적 생성).
import { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search, X, RefreshCcw, AlertTriangle, Info } from 'lucide-react'
import { generateSampleData } from "./sampleData"
import { type PeriodLike, isWithin2026H1, periodToMonths, getBenchmarkTableRows } from './benchmark2026H1'

interface MetricFilter {
  operator: '>' | '<' | '=' | '≥' | '≤' | ''
  value: string
}

// lucide에 맞는 형태의 커스텀 ChevronDown (원본과 동일)
function ChevronDown({ size = 16, ...props }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  )
}

export function ExtractedTable({ period }: { period?: PeriodLike } = {}) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [updateTooltipOpen, setUpdateTooltipOpen] = useState(false)
  const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(null)
  const [filterSearchTerms, setFilterSearchTerms] = useState<{ [key: string]: string }>({})

  const [listFilters, setListFilters] = useState<{
    period: string[]; media: string[]; industryLarge: string[]; industrySmall: string[]
    objective: string[]; buyingType: string[]; platform: string[]; performanceGoal: string[]; targetingOption: string[]
  }>({
    period: [], media: [], industryLarge: [], industrySmall: [],
    objective: [], buyingType: [], platform: [], performanceGoal: [], targetingOption: [],
  })

  const [metricFilters, setMetricFilters] = useState<{
    impressions: MetricFilter; clicks: MetricFilter; cost: MetricFilter; ctr: MetricFilter; cpc: MetricFilter; cpm: MetricFilter; vtr: MetricFilter
  }>({
    impressions: { operator: '=', value: '' }, clicks: { operator: '=', value: '' }, cost: { operator: '=', value: '' },
    ctr: { operator: '=', value: '' }, cpc: { operator: '=', value: '' }, cpm: { operator: '=', value: '' }, vtr: { operator: '=', value: '' },
  })

  // 조회조건 (다매체 목업). 열 구성: 기간 / 매체 / 업종(대) / 상품 + 공통지표
  // 광고상품 기준은 대분류 업종만 제공하므로 업종(중) 컬럼 없음.
  // 상세 옵션 컬럼(캠페인목표 등)·타겟팅 컬럼은 제거하고 '상품' 단일 컬럼으로 통합.
  const configData = { media: 'Meta', targetingCategory: null as string | null, metrics: ['광고비', '노출수', '클릭수', 'CPC', 'CPM', 'CTR', 'VTR'] }
  const adProductColumns = [
    { key: 'product', label: '상품' },
  ]

  // 조회기간이 2026 1~6월 범위면 실데이터(benchmark) 행, 아니면 기존 Meta 샘플(캠페인목표+플랫폼 파생 상품명).
  const useBenchmark = isWithin2026H1(period)
  const sampleData = useBenchmark
    ? getBenchmarkTableRows(periodToMonths(period!))
    : generateSampleData().map((row: any) => ({
        ...row,
        product: `${row.objective}_${row.platform}`,
      }))

  const metricToKey: { [key: string]: string } = {
    '노출수': 'impressions', '클릭수': 'clicks', '광고비': 'cost', 'CTR': 'ctr', 'CPC': 'cpc', 'CPM': 'cpm', 'VTR': 'vtr',
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ key, direction })
  }

  const getSortedData = () => {
    if (!sortConfig) return sampleData
    const dataKey = metricToKey[sortConfig.key] || sortConfig.key
    return [...sampleData].sort((a: any, b: any) => {
      const aValue = a[dataKey], bValue = b[dataKey]
      const aIsNumber = typeof aValue === 'number' || !isNaN(parseFloat(aValue))
      const bIsNumber = typeof bValue === 'number' || !isNaN(parseFloat(bValue))
      if (aIsNumber && bIsNumber) {
        const aNum = typeof aValue === 'number' ? aValue : parseFloat(aValue)
        const bNum = typeof bValue === 'number' ? bValue : parseFloat(bValue)
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum
      }
      const aStr = String(aValue || '').toLowerCase(), bStr = String(bValue || '').toLowerCase()
      return sortConfig.direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })
  }

  const getFilteredData = () => {
    let data = getSortedData()
    Object.entries(listFilters).forEach(([key, values]) => {
      if (values.length > 0) data = data.filter((row: any) => values.includes(String(row[key])))
    })
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

  const getUniqueValues = (key: string) => {
    const values = sampleData.map((row: any) => String(row[key]))
    return Array.from(new Set(values)).sort()
  }

  const filteredData = getFilteredData()
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => setCurrentPage(page)

  // 필터 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (openFilterDropdown && !target.closest('.filter-dropdown-container')) setOpenFilterDropdown(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openFilterDropdown])

  const renderListFilter = (columnKey: string) => {
    const uniqueValues = getUniqueValues(columnKey)
    const searchTerm = filterSearchTerms[columnKey] || ''
    const filteredValues = uniqueValues.filter(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
    const selectedValues = listFilters[columnKey as keyof typeof listFilters] || []
    const allSelected = selectedValues.length === uniqueValues.length

    return (
      <td key={columnKey} style={{ padding: '8px', position: 'relative', backgroundColor: 'hsl(var(--muted) / 0.3)' }} className="filter-dropdown-container">
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setOpenFilterDropdown(openFilterDropdown === columnKey ? null : columnKey)}
            className="input"
            style={{
              width: '100%', height: '32px', padding: '4px 8px', fontSize: '12px', textAlign: 'left',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
              backgroundColor: selectedValues.length > 0 ? 'hsl(var(--muted) / 0.5)' : 'hsl(var(--card))',
              border: selectedValues.length > 0 ? '1px solid hsl(var(--foreground) / 0.2)' : '1px solid hsl(var(--border))',
            }}
          >
            <span style={{
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              color: selectedValues.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
              fontWeight: selectedValues.length > 0 ? '500' : '400',
            }}>
              {selectedValues.length === 0 ? '전체' : selectedValues.length === 1 ? selectedValues[0] : allSelected ? '전체' : `${selectedValues.length}개 선택`}
            </span>
            <ChevronDown size={14} style={{ color: selectedValues.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }} />
          </button>

          {openFilterDropdown === columnKey && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, marginTop: '4px', width: '240px', maxHeight: '320px',
              backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', zIndex: 1000, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '12px', borderBottom: '1px solid hsl(var(--border))' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                  <input
                    type="text" placeholder="검색..." value={searchTerm}
                    onChange={(e) => setFilterSearchTerms(prev => ({ ...prev, [columnKey]: e.target.value }))}
                    className="input"
                    style={{ width: '100%', height: '32px', paddingLeft: '32px', paddingRight: searchTerm ? '32px' : '8px', fontSize: '12px' }}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setFilterSearchTerms(prev => ({ ...prev, [columnKey]: '' }))}
                      style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', color: 'hsl(var(--muted-foreground))' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ padding: '8px 12px', borderBottom: '1px solid hsl(var(--border))' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                  <input
                    type="checkbox" checked={allSelected}
                    onChange={(e) => { setListFilters(prev => ({ ...prev, [columnKey]: e.target.checked ? uniqueValues : [] })); setCurrentPage(1) }}
                    className="checkbox-custom"
                  />
                  <span>전체 선택</span>
                </label>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', maxHeight: '200px' }}>
                {filteredValues.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {filteredValues.map(value => (
                      <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                        <input
                          type="checkbox" checked={selectedValues.includes(value)}
                          onChange={(e) => {
                            setListFilters(prev => ({
                              ...prev,
                              [columnKey]: e.target.checked ? [...selectedValues, value] : selectedValues.filter(v => v !== value),
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
                  <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', textAlign: 'center', padding: '12px' }}>검색 결과가 없습니다</div>
                )}
              </div>

              {selectedValues.length > 0 && (
                <div style={{ padding: '8px 12px', borderTop: '1px solid hsl(var(--border))' }}>
                  <button
                    onClick={() => { setListFilters(prev => ({ ...prev, [columnKey]: [] })); setCurrentPage(1) }}
                    className="btn btn-ghost btn-sm" style={{ width: '100%', fontSize: '12px' }}
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

  const renderMetricFilter = (metricKey: string) => {
    const filter = metricFilters[metricKey as keyof typeof metricFilters]
    const hasValue = !!(filter.operator && filter.value)
    return (
      <td key={metricKey} style={{ padding: '8px', width: '43px', backgroundColor: 'hsl(var(--muted) / 0.3)', ...(metricKey === 'cost' ? { borderLeft: '1px solid hsl(var(--border))' } : {}) }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          border: `1px solid ${hasValue ? 'hsl(var(--foreground) / 0.2)' : 'hsl(var(--border))'}`,
          borderRadius: '6px', overflow: 'hidden',
          backgroundColor: hasValue ? 'hsl(var(--muted) / 0.5)' : 'hsl(var(--card))', height: '32px', width: '100%',
        }}>
          <select
            value={filter.operator}
            onChange={(e) => { setMetricFilters(prev => ({ ...prev, [metricKey]: { ...prev[metricKey as keyof typeof prev], operator: e.target.value as any } })); setCurrentPage(1) }}
            style={{
              width: '46px', height: '100%', flexShrink: 0, border: 'none', borderRight: '1px solid hsl(var(--border))',
              backgroundColor: 'transparent', fontSize: '12px', fontWeight: '500', padding: '0 2px 0 4px', cursor: 'pointer',
              color: 'hsl(var(--foreground))', outline: 'none', appearance: 'none', textAlign: 'center',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 3px center', paddingRight: '14px',
            }}
          >
            <option value="=">=</option>
            <option value=">">{'>'}</option>
            <option value="<">{'<'}</option>
            <option value="≥">≥</option>
            <option value="≤">≤</option>
          </select>
          <input
            type="text" placeholder="값"
            value={filter.value ? Number(filter.value.replace(/,/g, '')).toLocaleString('ko-KR') : ''}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, '').replace(/[^0-9.]/g, '')
              setMetricFilters(prev => ({ ...prev, [metricKey]: { ...prev[metricKey as keyof typeof prev], value: raw } }))
              setCurrentPage(1)
            }}
            style={{ flex: 1, height: '100%', border: 'none', backgroundColor: 'transparent', fontSize: '12px', padding: '0 6px', color: 'hsl(var(--foreground))', outline: 'none', textAlign: 'right' }}
          />
        </div>
      </td>
    )
  }

  const renderPagination = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px' }} className="text-muted-foreground">페이지당 표시:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}
            className="input" style={{ width: '80px', height: '32px', minHeight: '32px', padding: '4px 8px', fontSize: '14px' }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ fontSize: '14px' }} className="text-muted-foreground">{startItem}-{endItem} / {totalItems}개</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="btn btn-ghost btn-sm" style={{ width: '32px', height: '32px', padding: '0', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
              <ChevronLeft size={14} /><ChevronLeft size={14} style={{ marginLeft: '-8px' }} />
            </button>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="btn btn-ghost btn-sm" style={{ width: '32px', height: '32px', padding: '0', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
              <ChevronLeft size={14} />
            </button>
            {(() => {
              const pages = []
              const maxVisible = 5
              let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
              let end = Math.min(totalPages, start + maxVisible - 1)
              if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)
              for (let i = start; i <= end; i++) {
                pages.push(
                  <button key={i} onClick={() => handlePageChange(i)} className={`btn btn-sm ${currentPage === i ? 'btn-primary' : 'btn-ghost'}`} style={{ width: '32px', height: '32px', padding: '0', fontSize: '14px', fontWeight: currentPage === i ? '600' : '400' }}>
                    {i}
                  </button>
                )
              }
              return pages
            })()}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="btn btn-ghost btn-sm" style={{ width: '32px', height: '32px', padding: '0', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>
              <ChevronRight size={14} />
            </button>
            <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="btn btn-ghost btn-sm" style={{ width: '32px', height: '32px', padding: '0', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>
              <ChevronRight size={14} /><ChevronRight size={14} style={{ marginLeft: '-8px' }} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const hasActiveFilter = Object.values(listFilters).some(arr => arr.length > 0) || Object.values(metricFilters).some(f => f.value !== '')

  return (
    <div style={{ marginTop: '64px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '500', fontFamily: 'Paperlogy, sans-serif', margin: 0, color: 'hsl(var(--foreground))' }}>
          Extracted Data
        </h3>
      </div>

      {/* 1000행 초과 경고 배너 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
        <AlertTriangle size={13} style={{ flexShrink: 0, color: 'hsl(38 92% 50%)' }} />
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'hsl(38 92% 50%)' }}>Data Limit Warning</span>
        <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginLeft: '4px' }}>전체 1,320행 중 1,000행만 표시됩니다. 전체 데이터는 파일 다운로드를 통해 확인하세요.</span>
      </div>

      {/* 필터 초기화 + 최근 업데이트 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', paddingRight: '4px' }}>
        <div>
          {hasActiveFilter && (
            <button
              onClick={() => {
                setListFilters({ period: [], media: [], industryLarge: [], industrySmall: [], objective: [], buyingType: [], platform: [], performanceGoal: [], targetingOption: [] })
                setMetricFilters({ impressions: { operator: '=', value: '' }, clicks: { operator: '=', value: '' }, cost: { operator: '=', value: '' }, ctr: { operator: '=', value: '' }, cpc: { operator: '=', value: '' }, cpm: { operator: '=', value: '' }, vtr: { operator: '=', value: '' } })
                setCurrentPage(1)
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'hsl(var(--foreground))', color: 'hsl(var(--background))', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <RefreshCcw size={14} />
              필터 초기화
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>최근 데이터 업데이트: 2026-02-05</span>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={() => setUpdateTooltipOpen(true)} onMouseLeave={() => setUpdateTooltipOpen(false)}>
            <Info size={12} style={{ color: 'hsl(var(--muted-foreground))', cursor: 'default' }} />
            {updateTooltipOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '6px', zIndex: 1100, backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '12px 14px', width: '320px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', pointerEvents: 'none' }}>
                <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', lineHeight: '1.7' }}>
                  DataShot은 매월 5일경 전월 데이터를 정기 업데이트하며, 데이터 품질 향상을 위해 과거 데이터(최근 2년)의 보정 작업이 비정기적으로 진행될 수 있습니다.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', position: 'relative' }}>
        <div style={{ overflowX: 'auto' }} className="custom-scrollbar">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'hsl(var(--muted))', borderBottom: '1px solid hsl(var(--border))' }}>
                {[
                  { key: 'period', label: '기간' },
                  { key: 'media', label: '매체' },
                  { key: 'industryLarge', label: '업종(대)' },
                ].map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)} style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '12px', cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {col.label}
                      {sortConfig?.key === col.key && (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </div>
                  </th>
                ))}
                {adProductColumns.map((col) => (
                  <th key={col.key} onClick={() => handleSort(col.key)} style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '12px', cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {col.label}
                      {sortConfig?.key === col.key && (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </div>
                  </th>
                ))}
                {configData.targetingCategory && (
                  <th onClick={() => handleSort('targetingOption')} style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '12px', cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {configData.targetingCategory}
                      {sortConfig?.key === 'targetingOption' && (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </div>
                  </th>
                )}
                {configData.metrics.map((metric: string, idx: number) => (
                  <th key={metric} onClick={() => handleSort(metric)} style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '12px', cursor: 'pointer', userSelect: 'none', width: '43px', ...(idx === 0 ? { borderLeft: '1px solid hsl(var(--border))' } : {}) }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                      {metric}
                      {sortConfig?.key === metric && (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </div>
                  </th>
                ))}
              </tr>

              {/* 필터 행 */}
              <tr style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                {renderListFilter('period')}
                {renderListFilter('media')}
                {renderListFilter('industryLarge')}
                {adProductColumns.map((col) => renderListFilter(col.key))}
                {configData.targetingCategory && renderListFilter('targetingOption')}
                {renderMetricFilter('cost')}
                {renderMetricFilter('impressions')}
                {renderMetricFilter('clicks')}
                {renderMetricFilter('cpc')}
                {renderMetricFilter('cpm')}
                {renderMetricFilter('ctr')}
                {renderMetricFilter('vtr')}
              </tr>
            </thead>

            {/* 집계 행 */}
            <tbody>
              {(() => {
                // 비지표 컬럼: 기간·매체·업종대(3) + 상품 등(adProduct) + 타겟팅. 라벨이 첫 칸을 차지하므로 -1
                const dashColCount = 3 + adProductColumns.length + (configData.targetingCategory ? 1 : 0) - 1
                const fData = filteredData
                const fCost = fData.reduce((s: number, r: any) => s + (r.cost || 0), 0)
                const fImpressions = fData.reduce((s: number, r: any) => s + (r.impressions || 0), 0)
                const fClicks = fData.reduce((s: number, r: any) => s + (r.clicks || 0), 0)
                const fCpc = fClicks > 0 ? fCost / fClicks : 0
                const fCpm = fImpressions > 0 ? (fCost / fImpressions) * 1000 : 0
                const fCtr = fImpressions > 0 ? (fClicks / fImpressions) * 100 : 0
                const fVtrViews = fData.reduce((s: number, r: any) => s + ((r.vtr ?? 0) / 100 * (r.impressions || 0)), 0)
                const fVtr = fImpressions > 0 ? (fVtrViews / fImpressions) * 100 : 0

                const aData = sampleData
                const aCost = aData.reduce((s: number, r: any) => s + (r.cost || 0), 0)
                const aImpressions = aData.reduce((s: number, r: any) => s + (r.impressions || 0), 0)
                const aClicks = aData.reduce((s: number, r: any) => s + (r.clicks || 0), 0)
                const aCpc = aClicks > 0 ? aCost / aClicks : 0
                const aCpm = aImpressions > 0 ? (aCost / aImpressions) * 1000 : 0
                const aCtr = aImpressions > 0 ? (aClicks / aImpressions) * 100 : 0
                const aVtrViews = aData.reduce((s: number, r: any) => s + ((r.vtr ?? 0) / 100 * (r.impressions || 0)), 0)
                const aVtr = aImpressions > 0 ? (aVtrViews / aImpressions) * 100 : 0

                const summaryRowStyle = { backgroundColor: 'hsl(var(--muted) / 0.5)', borderBottom: '1px solid hsl(var(--border) / 0.6)', fontWeight: '400' as const, fontSize: '11px' }
                const labelStyle = { padding: '10px 12px', textAlign: 'center' as const, color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' as const }
                const dashStyle = { padding: '10px 8px', textAlign: 'center' as const, color: 'hsl(var(--muted-foreground) / 0.4)', fontSize: '11px' }
                const valStyle = { padding: '10px 8px', textAlign: 'right' as const, color: 'hsl(var(--foreground) / 0.9)' }
                const unitSpan = { fontSize: '10px', opacity: 0.5, marginLeft: '3px', fontWeight: '400' as const }
                const pctSpan = { fontSize: '10px', opacity: 0.5, marginLeft: '2px', fontWeight: '400' as const }
                const renderDashes = (count: number) => Array.from({ length: count }, (_, i) => <td key={`dash-${i}`} style={dashStyle}>-</td>)

                return (
                  <>
                    <tr style={summaryRowStyle}>
                      <td style={labelStyle}>전체 데이터 ({aData.length}개)</td>
                      {renderDashes(dashColCount)}
                      <td style={valStyle}>{aCost.toLocaleString()}<span style={unitSpan}>원</span></td>
                      <td style={valStyle}>{aImpressions.toLocaleString()}<span style={unitSpan}>회</span></td>
                      <td style={valStyle}>{aClicks.toLocaleString()}<span style={unitSpan}>회</span></td>
                      <td style={valStyle}>{Math.round(aCpc).toLocaleString()}<span style={unitSpan}>원</span></td>
                      <td style={valStyle}>{Math.round(aCpm).toLocaleString()}<span style={unitSpan}>원</span></td>
                      <td style={valStyle}>{aCtr.toFixed(2)}<span style={pctSpan}>%</span></td>
                      <td style={valStyle}>{aVtr.toFixed(2)}<span style={pctSpan}>%</span></td>
                    </tr>
                    <tr style={{ ...summaryRowStyle, borderBottom: '2px solid hsl(var(--border) / 0.8)' }}>
                      <td style={labelStyle}>필터 조회 결과 ({fData.length}개)</td>
                      {renderDashes(dashColCount)}
                      <td style={valStyle}>{fCost.toLocaleString()}<span style={unitSpan}>원</span></td>
                      <td style={valStyle}>{fImpressions.toLocaleString()}<span style={unitSpan}>회</span></td>
                      <td style={valStyle}>{fClicks.toLocaleString()}<span style={unitSpan}>회</span></td>
                      <td style={valStyle}>{Math.round(fCpc).toLocaleString()}<span style={unitSpan}>원</span></td>
                      <td style={valStyle}>{Math.round(fCpm).toLocaleString()}<span style={unitSpan}>원</span></td>
                      <td style={valStyle}>{fCtr.toFixed(2)}<span style={pctSpan}>%</span></td>
                      <td style={valStyle}>{fVtr.toFixed(2)}<span style={pctSpan}>%</span></td>
                    </tr>
                  </>
                )
              })()}
            </tbody>

            {/* 데이터 행 */}
            <tbody>
              {currentPageData.map((row: any, index: number) => (
                <tr key={index} style={{ borderBottom: '1px solid hsl(var(--border))', transition: 'background-color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">{row.period}</td>
                  <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">{row.media}</td>
                  <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">{row.industryLarge}</td>
                  {adProductColumns.map((col) => (
                    <td key={col.key} style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">{(row as any)[col.key] || '—'}</td>
                  ))}
                  {configData.targetingCategory && (
                    <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">{row.targetingOption || '—'}</td>
                  )}
                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px', borderLeft: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}>{row.cost.toLocaleString()}<span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>원</span></td>
                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px', color: 'hsl(var(--foreground))' }}>{row.impressions.toLocaleString()}<span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>회</span></td>
                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px', color: 'hsl(var(--foreground))' }}>{row.clicks.toLocaleString()}<span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>회</span></td>
                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px', color: 'hsl(var(--foreground))' }}>{row.cpc.toLocaleString()}<span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>원</span></td>
                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px', color: 'hsl(var(--foreground))' }}>{row.cpm.toLocaleString()}<span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>원</span></td>
                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px', color: 'hsl(var(--foreground))' }}>{row.ctr.toFixed(2)}<span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '2px', fontWeight: '400' }}>%</span></td>
                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px', color: 'hsl(var(--foreground))' }}>{(row as any).vtr?.toFixed(2) ?? '—'}<span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '2px', fontWeight: '400' }}>%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {renderPagination()}
    </div>
  )
}
