import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react'
import { Calendar } from '../common/Calendar'

interface CustomDateRangePickerProps {
  value: { start: string; end: string }
  onChange: (range: { start: string; end: string }) => void
}

export function CustomDateRangePicker({ value, onChange }: CustomDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const dateRange = value.start && value.end ? {
    from: new Date(value.start),
    to: new Date(value.end)
  } : value.start ? {
    from: new Date(value.start),
    to: undefined
  } : undefined

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (range: any) => {
    console.log('CustomDateRangePicker handleSelect:', range)
    if (range?.from && range?.to) {
      onChange({
        start: format(range.from, 'yyyy-MM-dd'),
        end: format(range.to, 'yyyy-MM-dd')
      })
      setIsOpen(false)
    } else if (range?.from) {
      onChange({
        start: format(range.from, 'yyyy-MM-dd'),
        end: ''
      })
    }
  }

  const displayStartDate = value.start ? format(new Date(value.start), 'yyyy.MM.dd') : '시작일'
  const displayEndDate = value.end ? format(new Date(value.end), 'yyyy.MM.dd') : '종료일'

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        className="input"
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          cursor: 'pointer', 
          gap: '12px', 
          padding: '10px 14px', 
          backgroundColor: 'hsl(var(--background))', 
          border: '1px solid hsl(var(--border))', 
          transition: 'all 0.2s' 
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'hsl(var(--ring))'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'hsl(var(--border))'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <span style={{ 
            color: value.start ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))', 
            fontSize: '14px', 
            fontWeight: value.start ? '500' : '400' 
          }}>
            {displayStartDate}
          </span>
          <ArrowRight size={14} style={{ color: 'hsl(var(--muted-foreground))' }} />
          <span style={{ 
            color: value.end ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))', 
            fontSize: '14px', 
            fontWeight: value.end ? '500' : '400' 
          }}>
            {displayEndDate}
          </span>
        </div>
        <CalendarIcon size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
      </button>

      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          marginTop: '8px', 
          zIndex: 1000, 
          backgroundColor: 'hsl(var(--card) / 0.95)', 
          backdropFilter: 'blur(20px)', 
          WebkitBackdropFilter: 'blur(20px)', 
          border: '1px solid hsl(var(--border) / 0.5)', 
          borderRadius: '12px', 
          padding: '16px', 
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)'
        }}>
          <Calendar 
            mode="range" 
            selected={dateRange} 
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </div>
      )}
    </div>
  )
}
