import { useState } from 'react'
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isWithinInterval, 
  startOfWeek, 
  endOfWeek 
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarProps {
  mode: 'single' | 'range'
  selected?: Date | { from: Date; to?: Date }
  onSelect?: (date: any) => void
  numberOfMonths?: number
}

export function Calendar({ mode, selected, onSelect, numberOfMonths = 1 }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  const handleDateClick = (date: Date) => {
    if (mode === 'single') {
      onSelect?.(date)
    } else if (mode === 'range') {
      const range = selected as { from: Date; to?: Date } | undefined
      if (!range?.from || (range.from && range.to)) {
        // 새로운 범위 시작
        onSelect?.({ from: date, to: undefined })
      } else {
        // 범위 완성
        if (date < range.from) {
          onSelect?.({ from: date, to: range.from })
        } else {
          onSelect?.({ from: range.from, to: date })
        }
      }
    }
  }

  const renderMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    
    const weeks: Date[][] = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    const range = mode === 'range' ? (selected as { from: Date; to?: Date } | undefined) : undefined
    const singleDate = mode === 'single' ? (selected as Date | undefined) : undefined

    return (
      <div style={{ flex: 1 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '12px',
          padding: '0 8px'
        }}>
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(monthDate, 1))}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px' }}
          >
            <ChevronLeft size={16} />
          </button>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: 'hsl(var(--foreground))' 
          }}>
            {format(monthDate, 'MMMM yyyy')}
          </div>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(monthDate, 1))}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 36px)', 
          gap: '2px', 
          marginBottom: '4px' 
        }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div 
              key={day} 
              style={{ 
                fontSize: '11px', 
                fontWeight: '600', 
                color: 'hsl(var(--muted-foreground))', 
                textAlign: 'center', 
                padding: '4px 0',
                textTransform: 'uppercase'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIdx) => (
          <div 
            key={weekIdx} 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 36px)', 
              gap: '2px' 
            }}
          >
            {week.map((day, dayIdx) => {
              const isCurrentMonth = isSameMonth(day, monthDate)
              const isToday = isSameDay(day, new Date())
              
              let isSelected = false
              let isStart = false
              let isEnd = false
              let isMiddle = false

              if (mode === 'single' && singleDate) {
                isSelected = isSameDay(day, singleDate)
              } else if (mode === 'range' && range?.from) {
                isStart = isSameDay(day, range.from)
                isEnd = range.to ? isSameDay(day, range.to) : false
                const isInRange = range.to && isWithinInterval(day, { start: range.from, end: range.to })
                isMiddle = isInRange && !isStart && !isEnd
                isSelected = isStart || isEnd
              }

              let backgroundColor = 'transparent'
              let color = 'hsl(var(--foreground))'
              let fontWeight = '400'
              let borderRadius = '4px'

              if (!isCurrentMonth) {
                color = 'hsl(var(--muted-foreground))'
              }

              if (isMiddle) {
                backgroundColor = 'hsl(var(--muted))' // CSS 변수 사용
                borderRadius = '0'
              }

              if (isSelected) {
                backgroundColor = 'hsl(var(--primary))' // CSS 변수 사용
                color = 'hsl(var(--primary-foreground))' // CSS 변수 사용
                fontWeight = '600'
              }

              if (isStart && !isEnd) {
                borderRadius = '4px 0 0 4px'
              }

              if (isEnd && !isStart) {
                borderRadius = '0 4px 4px 0'
              }

              return (
                <button 
                  key={dayIdx} 
                  type="button" 
                  onClick={() => handleDateClick(day)} 
                  disabled={!isCurrentMonth}
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    fontSize: '13px', 
                    fontWeight, 
                    border: 'none', 
                    cursor: isCurrentMonth ? 'pointer' : 'not-allowed', 
                    backgroundColor, 
                    color, 
                    borderRadius, 
                    transition: 'all 0.2s', 
                    position: 'relative', 
                    opacity: isCurrentMonth ? 1 : 0.4 
                  }}
                  onMouseEnter={(e) => { 
                    if (isCurrentMonth && !isSelected) {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.6)'
                    }
                  }}
                  onMouseLeave={(e) => { 
                    if (isCurrentMonth && !isSelected && !isMiddle) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    } else if (isMiddle) {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
                    }
                  }}
                >
                  {format(day, 'd')}
                  {isToday && !isSelected && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '2px', 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      width: '4px', 
                      height: '4px', 
                      borderRadius: '50%', 
                      backgroundColor: 'hsl(var(--primary))' 
                    }} />
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
    <div style={{ display: 'flex', gap: '24px' }}>
      {Array.from({ length: numberOfMonths }).map((_, i) => (
        <div key={i}>
          {renderMonth(addMonths(currentMonth, i))}
        </div>
      ))}
    </div>
  )
}
