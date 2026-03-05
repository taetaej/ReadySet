import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

interface DateRangePickerProps {
  value: { start: string; end: string }
  onChange: (range: { start: string; end: string }) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const dateRange: DateRange | undefined = value.start && value.end ? {
    from: new Date(value.start),
    to: new Date(value.end)
  } : undefined

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      onChange({
        start: format(range.from, 'yyyy-MM-dd'),
        end: format(range.to, 'yyyy-MM-dd')
      })
      setIsOpen(false)
    } else if (range?.from) {
      onChange({
        start: format(range.from, 'yyyy-MM-dd'),
        end: value.end
      })
    }
  }

  const displayText = value.start && value.end
    ? `${format(new Date(value.start), 'yyyy.MM.dd')} - ${format(new Date(value.end), 'yyyy.MM.dd')}`
    : '기간을 선택하세요'

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <span style={{ 
          color: value.start && value.end ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
        }}>
          {displayText}
        </span>
        <CalendarIcon size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
      </button>

      {isOpen && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '8px',
              zIndex: 1000,
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
            }}
          >
            <style>{`
              .rdp {
                --rdp-cell-size: 40px;
                --rdp-accent-color: hsl(var(--primary));
                --rdp-background-color: hsl(var(--primary) / 0.1);
                margin: 0;
              }
              .rdp-months {
                justify-content: center;
              }
              .rdp-month {
                color: hsl(var(--foreground));
              }
              .rdp-caption {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0;
                margin-bottom: 16px;
              }
              .rdp-caption_label {
                font-size: 14px;
                font-weight: 600;
              }
              .rdp-nav {
                position: absolute;
                top: 0;
                display: flex;
                gap: 4px;
              }
              .rdp-nav_button {
                width: 32px;
                height: 32px;
                border-radius: 6px;
                border: 1px solid hsl(var(--border));
                background: transparent;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
              }
              .rdp-nav_button:hover {
                background: hsl(var(--muted));
              }
              .rdp-nav_button_previous {
                left: 0;
              }
              .rdp-nav_button_next {
                right: 0;
              }
              .rdp-head_cell {
                color: hsl(var(--muted-foreground));
                font-size: 12px;
                font-weight: 500;
                text-transform: uppercase;
              }
              .rdp-cell {
                padding: 2px;
              }
              .rdp-day {
                width: 100%;
                height: 100%;
                border-radius: 6px;
                font-size: 13px;
                transition: all 0.2s;
                border: none;
                background: transparent;
                cursor: pointer;
              }
              .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
                background: hsl(var(--muted));
              }
              .rdp-day_selected {
                background: hsl(var(--primary));
                color: hsl(var(--primary-foreground));
                font-weight: 500;
              }
              .rdp-day_range_middle {
                background: hsl(var(--primary) / 0.1);
                color: hsl(var(--foreground));
              }
              .rdp-day_disabled {
                color: hsl(var(--muted-foreground));
                opacity: 0.5;
                cursor: not-allowed;
              }
              .rdp-day_outside {
                color: hsl(var(--muted-foreground));
                opacity: 0.5;
              }
            `}</style>
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={handleSelect}
              numberOfMonths={2}
            />
          </div>
        </>
      )}
    </div>
  )
}
