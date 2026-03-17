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

const AVAILABLE_YEARS = [2024, 2025, 2026]
const ALL_YEARS = Array.from({ length: 22 }, (_, i) => 2019 + i)

function YearSelectionView({ onYearClick }: { onYearClick: (year: number) => void }) {
  const [currentPage, setCurrentPage] = useState(0)
  const yearsPerPage = 12
  const totalPages = Math.ceil(ALL_YEARS.length / yearsPerPage)
  const startIndex = currentPage * yearsPerPage
  const displayYears = ALL_YEARS.slice(startIndex, Math.min(startIndex + yearsPerPage, ALL_YEARS.length))

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <button type="button" onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          className="btn btn-ghost btn-sm" style={{ padding: '4px' }} disabled={currentPage === 0}>
          <ChevronLeft size={14} />
        </button>
        <span style={{ fontSize: '14px', fontWeight: '600', color: 'hsl(var(--muted-foreground))' }}>
          {displayYears[0]}-{displayYears[displayYears.length - 1]}
        </span>
        <button type="button" onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          className="btn btn-ghost btn-sm" style={{ padding: '4px' }} disabled={currentPage === totalPages - 1}>
          <ChevronRight size={14} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        {displayYears.map((year) => {
          const isAvailable = AVAILABLE_YEARS.includes(year)
          return (
            <button key={year} type="button" onClick={() => isAvailable && onYearClick(year)}
              disabled={!isAvailable}
              style={{
                padding: '10px 8px', borderRadius: '4px', border: 'none',
                backgroundColor: 'transparent',
                color: isAvailable ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                fontSize: '12px', cursor: isAvailable ? 'pointer' : 'not-allowed', opacity: isAvailable ? 1 : 0.4,
              }}
              onMouseEnter={(e) => { if (isAvailable) e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
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
  const [leftYear, setLeftYear] = useState(2025)
  const [rightYear, setRightYear] = useState(2026)
  const [yearPickerTarget, setYearPickerTarget] = useState<'left' | 'right'>('left')
  // 선택 단계: 'start' = 시작월 선택 중, 'end' = 종료월 선택 중
  const [selectingPhase, setSelectingPhase] = useState<'start' | 'end'>('start')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setViewMode('months')
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // 드롭다운 열릴 때 phase 초기화
  const handleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSelectingPhase('start')
    }
  }

  const handleMonthClick = (year: number, monthIndex: number) => {
    const month = String(monthIndex + 1)
    const yearStr = String(year)

    if (selectingPhase === 'start') {
      // 시작월 선택 → 종료월 초기화 후 end phase로
      onChange({ startYear: yearStr, startMonth: month, endYear: '', endMonth: '' })
      setSelectingPhase('end')
    } else {
      // 종료월 선택
      if (value.startYear && value.startMonth) {
        const startTotal = parseInt(value.startYear) * 12 + parseInt(value.startMonth) - 1
        const endTotal = year * 12 + monthIndex
        if (endTotal < startTotal) {
          // 시작보다 이전 클릭 시 → 새로운 시작월로 재설정
          onChange({ startYear: yearStr, startMonth: month, endYear: '', endMonth: '' })
          setSelectingPhase('end')
          return
        }
      }
      onChange({ startYear: value.startYear, startMonth: value.startMonth, endYear: yearStr, endMonth: month })
      setIsOpen(false)
      setViewMode('months')
    }
  }

  const getDisplayText = () => {
    if (!value.startYear || !value.startMonth) {
      return type === 'quarter' ? '시작분기 → 종료분기' : '시작월 → 종료월'
    }
    const fmt = (year: string, period: string) =>
      type === 'quarter' ? `${year}-Q${period}` : `${year}-${period.padStart(2, '0')}`
    const start = fmt(value.startYear, value.startMonth)
    const end = value.endYear && value.endMonth ? fmt(value.endYear, value.endMonth) : '...'
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{start}</span>
        <ArrowRight size={14} style={{ color: 'hsl(var(--muted-foreground))' }} />
        <span>{end}</span>
      </span>
    )
  }

  const isSelected = (year: number, monthIndex: number) => {
    const month = String(monthIndex + 1)
    const yearStr = String(year)
    return (yearStr === value.startYear && month === value.startMonth) ||
           (yearStr === value.endYear && month === value.endMonth)
  }

  const isInRange = (year: number, monthIndex: number) => {
    if (!value.startYear || !value.startMonth || !value.endYear || !value.endMonth) return false
    const current = year * 12 + monthIndex
    const start = parseInt(value.startYear) * 12 + parseInt(value.startMonth) - 1
    const end = parseInt(value.endYear) * 12 + parseInt(value.endMonth) - 1
    return current > start && current < end
  }

  const isStartMonth = (year: number, monthIndex: number) => {
    return String(year) === value.startYear && String(monthIndex + 1) === value.startMonth
  }

  const isEndMonth = (year: number, monthIndex: number) => {
    return String(year) === value.endYear && String(monthIndex + 1) === value.endMonth
  }

  const renderPanel = (year: number, isLeft: boolean) => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
    const items = type === 'quarter' ? quarters : monthNames

    return (
      <div style={{ flex: 1 }}>
        {/* 패널 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <button type="button"
            onClick={() => {
              const prev = year - 1
              if (AVAILABLE_YEARS.includes(prev)) isLeft ? setLeftYear(prev) : setRightYear(prev)
            }}
            className="btn btn-ghost btn-sm" style={{ padding: '4px' }}
            disabled={!AVAILABLE_YEARS.includes(year - 1)}>
            <ChevronLeft size={14} />
          </button>
          <button type="button"
            onClick={() => { setYearPickerTarget(isLeft ? 'left' : 'right'); setViewMode('years') }}
            style={{
              fontSize: '14px', fontWeight: '600', background: 'none', border: 'none',
              cursor: 'pointer', padding: '4px 8px', borderRadius: '4px',
              color: 'hsl(var(--muted-foreground))'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'hsl(var(--muted))' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            {year}
          </button>
          <button type="button"
            onClick={() => {
              const next = year + 1
              if (AVAILABLE_YEARS.includes(next)) isLeft ? setLeftYear(next) : setRightYear(next)
            }}
            className="btn btn-ghost btn-sm" style={{ padding: '4px' }}
            disabled={!AVAILABLE_YEARS.includes(year + 1)}>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* 월/분기 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: type === 'quarter' ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
          gap: '6px'
        }}>
          {items.map((item, index) => {
            const selected = isSelected(year, index)
            const inRange = isInRange(year, index)
            const isStart = isStartMonth(year, index)
            const isEnd = isEndMonth(year, index)

            return (
              <button key={index} type="button"
                onClick={() => handleMonthClick(year, index)}
                style={{
                  padding: '10px 8px', borderRadius: '4px', border: 'none',
                  backgroundColor: selected ? 'hsl(var(--primary))' : inRange ? 'hsl(var(--muted))' : 'transparent',
                  color: selected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                  fontSize: '12px', fontWeight: selected ? '600' : '400',
                  cursor: 'pointer', transition: 'all 0.2s',
                  outline: (isStart || isEnd) ? '2px solid hsl(var(--primary))' : 'none',
                  outlineOffset: '-2px',
                }}
                onMouseEnter={(e) => { if (!selected) e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)' }}
                onMouseLeave={(e) => {
                  if (!selected && !inRange) e.currentTarget.style.backgroundColor = 'transparent'
                  else if (inRange && !selected) e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
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
      <button type="button" onClick={handleOpen} className="input"
        style={{
          width: '100%', height: '36px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '8px 12px', cursor: 'pointer',
          backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '6px'
        }}
      >
        <div style={{ fontSize: '14px', color: value.startYear ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center' }}>
          {getDisplayText()}
        </div>
        <Calendar size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
      </button>

      {isOpen && (
        <div className="dropdown" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', width: '500px', padding: '16px', zIndex: 1000 }}>
          {viewMode === 'months' ? (
            <div style={{ display: 'flex', gap: '16px' }}>
              {renderPanel(leftYear, true)}
              <div style={{ width: '1px', backgroundColor: 'hsl(var(--border))' }} />
              {renderPanel(rightYear, false)}
            </div>
          ) : (
            <YearSelectionView onYearClick={(year) => {
              if (yearPickerTarget === 'left') setLeftYear(year)
              else setRightYear(year)
              setViewMode('months')
            }} />
          )}
        </div>
      )}
    </div>
  )
}
