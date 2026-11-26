import { useState } from 'react'
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isSameDay, isWithinInterval, startOfWeek, endOfWeek
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface ACDateRange { from: Date; to?: Date }

interface ACCalendarProps {
  selected?: ACDateRange
  onSelect: (range: ACDateRange) => void
  numberOfMonths?: number
  /** 이 날짜보다 이전 날짜는 선택 불가(비활성) */
  minDate?: Date
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

/**
 * Ad Curator 전용 범위 달력.
 * 공용 `common/Calendar`와 같은 생김새·동작이며, 최소 날짜 이전을 비활성으로 표시한다.
 * (공용 컴포넌트는 수정하지 않음)
 */
export function ACCalendar({ selected, onSelect, numberOfMonths = 2, minDate }: ACCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  const handleDateClick = (date: Date) => {
    if (!selected?.from || selected.to) onSelect({ from: date, to: undefined })
    else if (date < selected.from) onSelect({ from: date, to: selected.from })
    else onSelect({ from: selected.from, to: date })
  }

  const renderMonth = (monthDate: Date) => {
    const days = eachDayOfInterval({
      start: startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 }),
      end: endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 })
    })
    const weeks: Date[][] = []
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))

    return (
      <div className="flex-1">
        <div className="flex justify-between items-center mb-3 px-2">
          <button type="button" onClick={() => setCurrentMonth(subMonths(monthDate, 1))} className="btn btn-ghost btn-sm p-1">
            <ChevronLeft size={16} />
          </button>
          <div className="text-sm font-semibold text-[hsl(var(--foreground))]">{format(monthDate, 'MMMM yyyy')}</div>
          <button type="button" onClick={() => setCurrentMonth(addMonths(monthDate, 1))} className="btn btn-ghost btn-sm p-1">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-[repeat(7,36px)] gap-0.5 mb-1">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-[11px] font-semibold uppercase text-center py-1 text-[hsl(var(--muted-foreground))]">{d}</div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-[repeat(7,36px)] gap-0.5">
            {week.map((day, di) => {
              const outside = !isSameMonth(day, monthDate)
              const disabled = outside || (!!minDate && day < minDate)
              const isToday = isSameDay(day, new Date())
              const isStart = !!selected?.from && isSameDay(day, selected.from)
              const isEnd = !!selected?.to && isSameDay(day, selected.to)
              const inRange = !!selected?.from && !!selected?.to && isWithinInterval(day, { start: selected.from, end: selected.to })
              const isMiddle = inRange && !isStart && !isEnd
              const isSelected = isStart || isEnd

              const tone = isSelected
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold'
                : isMiddle
                  ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
                  : disabled
                    ? 'bg-transparent text-[hsl(var(--muted-foreground))]'
                    : 'bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/0.6)]'
              const radius = isMiddle ? 'rounded-none'
                : isStart && !isEnd && selected?.to ? 'rounded-l rounded-r-none'
                : isEnd && !isStart ? 'rounded-r rounded-l-none'
                : 'rounded'

              return (
                <button
                  key={di}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  disabled={disabled}
                  className={`relative w-9 h-9 text-[13px] border-0 transition-colors duration-200 ${tone} ${radius} ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                >
                  {format(day, 'd')}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[hsl(var(--primary))]" />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-6 font-[Paperlogy,sans-serif]">
      {Array.from({ length: numberOfMonths }).map((_, i) => (
        <div key={i}>{renderMonth(addMonths(currentMonth, i))}</div>
      ))}
    </div>
  )
}
