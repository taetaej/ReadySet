import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react'
import { ACCalendar, ACDateRange } from './ACCalendar'

interface ACDateRangePickerProps {
  value: { start: string; end: string }
  onChange: (range: { start: string; end: string }) => void
  hasError?: boolean
  /** 이 날짜보다 이전 날짜는 선택 불가(비활성) */
  minDate?: Date
  /** 달력 열림 상태 변경 알림 (모달 안에서 달력이 잘리지 않게 할 때 사용) */
  onOpenChange?: (open: boolean) => void
}

/** yyyy-mm-dd → 로컬 자정 Date */
const parseDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Ad Curator 캠페인 기간 선택기.
 * Reach Caster `CustomDateRangePicker`와 같은 구성이며, 최소 시작일 이전 날짜를 비활성으로 표시한다.
 * (reachcaster 모듈은 수정하지 않음)
 */
export function ACDateRangePicker({ value, onChange, hasError = false, minDate, onOpenChange }: ACDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { onOpenChange?.(isOpen) }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const selected = value.start
    ? { from: parseDate(value.start), to: value.end ? parseDate(value.end) : undefined }
    : undefined

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleSelect = (range: ACDateRange) => {
    if (range.to) {
      onChange({ start: format(range.from, 'yyyy-MM-dd'), end: format(range.to, 'yyyy-MM-dd') })
      setIsOpen(false)
    } else {
      onChange({ start: format(range.from, 'yyyy-MM-dd'), end: '' })
    }
  }

  const dateText = (s: string, placeholder: string) => (
    <span className={`text-sm ${s ? 'font-medium text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`}>
      {s ? format(parseDate(s), 'yyyy.MM.dd') : placeholder}
    </span>
  )

  return (
    <div ref={containerRef} className="relative w-full font-[Paperlogy,sans-serif]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`input w-full flex justify-between items-center gap-3 cursor-pointer px-3.5 py-2.5 bg-[hsl(var(--background))] border transition-colors duration-200 ${
          hasError ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--ring))]'
        }`}
      >
        <div className="flex items-center gap-2 flex-1">
          {dateText(value.start, '시작일')}
          <ArrowRight size={14} className="text-[hsl(var(--muted-foreground))]" />
          {dateText(value.end, '종료일')}
        </div>
        <CalendarIcon size={16} className="text-[hsl(var(--muted-foreground))]" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[1000] p-4 rounded-xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.95)] backdrop-blur-[20px] shadow-xl">
          <ACCalendar selected={selected} onSelect={handleSelect} numberOfMonths={2} minDate={minDate} />
        </div>
      )}
    </div>
  )
}
