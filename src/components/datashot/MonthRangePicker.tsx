import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

interface MonthRangePickerProps {
  type: 'month' | 'quarter'
  value: {
    startYear: string
    startMonth: string
    endYear: string
    endMonth: string
  }
  onChange: (value: {
    startYear: string
    startMonth: string
    endYear: string
    endMonth: string
  }) => void
}

const AVAILABLE_YEARS = [2023, 2024, 2025, 2026]
const ALL_YEARS = Array.from({ length: 22 }, (_, i) => 2019 + i) // 2019-2040

// Year Selection Component
function YearSelectionView({ onYearClick }: { onYearClick: (year: number) => void }) {
  const [currentPage, setCurrentPage] = useState(0)
  const yearsPerPage = 12
  const totalPages = Math.ceil(ALL_YEARS.length / yearsPerPage)
  
  const startIndex = currentPage * yearsPerPage
  const endIndex = Math.min(startIndex + yearsPerPage, ALL_YEARS.length)
  const displayYears = ALL_YEARS.slice(startIndex, endIndex)
  
  const startYear = displayYears[0]
  const endYear = displayYears[displayYears.length - 1]

  return (
    <>
      {/* Year Range Header with Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <button
          type="button"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          className="btn btn-ghost btn-sm"
          style={{ padding: '4px' }}
          disabled={currentPage === 0}
        >
          <ChevronLeft size={14} />
        </button>
        
        <span style={{ fontSize: '14px', fontWeight: '600', color: 'hsl(var(--muted-foreground))' }}>
          {startYear}-{endYear}
        </span>

        <button
          type="button"
          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          className="btn btn-ghost btn-sm"
          style={{ padding: '4px' }}
          disabled={currentPage === totalPages - 1}
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Year Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px'
      }}>
        {displayYears.map((year) => {
          const isAvailable = AVAILABLE_YEARS.includes(year)
          
          return (
            <button
              key={year}
              type="button"
              onClick={() => {
                if (isAvailable) {
                  onYearClick(year)
                }
              }}
              disabled={!isAvailable}
              style={{
                padding: '10px 8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                color: isAvailable 
                  ? 'hsl(var(--foreground))' 
                  : 'hsl(var(--muted-foreground))',
                fontSize: '12px',
                fontWeight: '400',
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                opacity: isAvailable ? 1 : 0.4,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (isAvailable) {
                  e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {year}
            </button>
          )
        })}
      </div>
    </>
  )
}

export function MonthRangePicker({ type, value, onChange }: MonthRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'months' | 'years'>('months')
  const [startYear, setStartYear] = useState(2025)
  const [endYear, setEndYear] = useState(2026)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setViewMode('months')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleMonthClick = (isStart: boolean, year: number, monthIndex: number) => {
    const month = String(monthIndex + 1)
    const yearStr = String(year)

    if (isStart) {
      onChange({
        startYear: yearStr,
        startMonth: month,
        endYear: value.endYear,
        endMonth: value.endMonth
      })
    } else {
      // 종료일이 시작일보다 이전인지 체크
      if (value.startYear && value.startMonth) {
        const startTotal = parseInt(value.startYear) * 12 + parseInt(value.startMonth) - 1
        const endTotal = year * 12 + monthIndex
        
        // 종료일이 시작일보다 이전이면 선택 불가 (같은 것은 허용)
        if (endTotal < startTotal) {
          return
        }
      }
      
      onChange({
        startYear: value.startYear,
        startMonth: value.startMonth,
        endYear: yearStr,
        endMonth: month
      })
      setIsOpen(false)
      setViewMode('months')
    }
  }

  const handleYearClick = (isStart: boolean, year: number) => {
    if (isStart) {
      setStartYear(year)
    } else {
      setEndYear(year)
    }
    setViewMode('months')
  }

  const getDisplayText = () => {
    if (!value.startYear || !value.startMonth) {
      return type === 'quarter' ? '시작분기 → 종료분기' : '시작월 → 종료월'
    }

    const formatPeriod = (year: string, period: string) => {
      if (type === 'quarter') {
        return `${year}-Q${period}`
      }
      return `${year}-${period.padStart(2, '0')}`
    }

    const start = formatPeriod(value.startYear, value.startMonth)
    const end = value.endYear && value.endMonth ? formatPeriod(value.endYear, value.endMonth) : '...'
    
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{start}</span>
        <ArrowRight size={14} style={{ color: 'hsl(var(--muted-foreground))' }} />
        <span>{end}</span>
      </span>
    )
  }

  const isSelected = (isStart: boolean, year: number, monthIndex: number) => {
    const month = String(monthIndex + 1)
    const yearStr = String(year)

    if (isStart) {
      return yearStr === value.startYear && month === value.startMonth
    } else {
      return yearStr === value.endYear && month === value.endMonth
    }
  }

  const isInRange = (year: number, monthIndex: number) => {
    if (!value.startYear || !value.startMonth || !value.endYear || !value.endMonth) {
      return false
    }

    const current = year * 12 + monthIndex
    const start = parseInt(value.startYear) * 12 + parseInt(value.startMonth) - 1
    const end = parseInt(value.endYear) * 12 + parseInt(value.endMonth) - 1

    return current > start && current < end
  }

  const renderMonthPicker = (isStart: boolean, year: number) => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
    const items = type === 'quarter' ? quarters : monthNames
    
    return (
      <div style={{ flex: 1 }}>
        {/* Year Header - Clickable */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <button
            type="button"
            onClick={() => {
              const prevYear = year - 1
              if (AVAILABLE_YEARS.includes(prevYear)) {
                if (isStart) setStartYear(prevYear)
                else setEndYear(prevYear)
              }
            }}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px' }}
            disabled={!AVAILABLE_YEARS.includes(year - 1)}
          >
            <ChevronLeft size={14} />
          </button>
          
          <button
            type="button"
            onClick={() => setViewMode('years')}
            style={{
              fontSize: '14px',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              color: 'hsl(var(--muted-foreground))'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {year}
          </button>

          <button
            type="button"
            onClick={() => {
              const nextYear = year + 1
              if (AVAILABLE_YEARS.includes(nextYear)) {
                if (isStart) setStartYear(nextYear)
                else setEndYear(nextYear)
              }
            }}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px' }}
            disabled={!AVAILABLE_YEARS.includes(year + 1)}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Month/Quarter Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: type === 'quarter' ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
          gap: '6px'
        }}>
          {items.map((item, index) => {
            const selected = isSelected(isStart, year, index)
            const inRange = isInRange(year, index)
            
            // 종료일 선택 시 시작일보다 이전인지 체크
            let isDisabled = false
            if (!isStart && value.startYear && value.startMonth) {
              const startTotal = parseInt(value.startYear) * 12 + parseInt(value.startMonth) - 1
              const currentTotal = year * 12 + index
              isDisabled = currentTotal < startTotal
            }
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleMonthClick(isStart, year, index)}
                disabled={isDisabled}
                style={{
                  padding: '10px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: selected 
                    ? 'hsl(var(--primary))' 
                    : inRange 
                    ? 'hsl(var(--muted))' 
                    : 'transparent',
                  color: selected 
                    ? 'hsl(var(--primary-foreground))' 
                    : isDisabled
                    ? 'hsl(var(--muted-foreground))'
                    : 'hsl(var(--muted-foreground))',
                  fontSize: '12px',
                  fontWeight: selected ? '600' : '400',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.4 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!selected && !isDisabled) {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected && !inRange) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  } else if (inRange && !selected) {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
                  }
                }}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '800px' }} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input"
        style={{
          width: '100%',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          cursor: 'pointer',
          backgroundColor: 'hsl(var(--background))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '6px'
        }}
      >
        <div style={{ 
          fontSize: '14px',
          color: value.startYear ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
          display: 'flex',
          alignItems: 'center'
        }}>
          {getDisplayText()}
        </div>
        <Calendar size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
      </button>

      {isOpen && (
        <div
          className="dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            width: '500px',
            padding: '16px',
            zIndex: 1000
          }}
        >
          {viewMode === 'months' ? (
            <div style={{ display: 'flex', gap: '16px' }}>
              {renderMonthPicker(true, startYear)}
              {renderMonthPicker(false, endYear)}
            </div>
          ) : (
            <YearSelectionView 
              onYearClick={(year) => {
                handleYearClick(true, year)
                setStartYear(year)
                setEndYear(year)
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}
