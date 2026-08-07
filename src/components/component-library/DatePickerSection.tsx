import { useState } from 'react'
import { MonthRangePicker } from '../datashot/MonthRangePicker'
import { CustomDateRangePicker } from '../reachcaster/CustomDateRangePicker'
import { Calendar } from '../common/Calendar'
import { Section, ComponentGroup } from './Section'

export function DatePickerSection() {
  // 날짜 선택 상태
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [monthRange, setMonthRange] = useState({
    startYear: '',
    startMonth: '',
    endYear: '',
    endMonth: ''
  })
  const [quarterRange, setQuarterRange] = useState({
    startYear: '',
    startMonth: '',
    endYear: '',
    endMonth: ''
  })

  // Calendar 상태
  const [singleDate, setSingleDate] = useState<Date | undefined>(undefined)
  const [rangeDate, setRangeDate] = useState<{ from: Date; to?: Date } | undefined>(undefined)

  return (
    <Section title="Date & Period Pickers" description="일/월/분기 선택 캘린더">
      <ComponentGroup label="Date Range Picker (일 → 일)">
        <div style={{ width: '400px' }}>
          <CustomDateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </ComponentGroup>

      <ComponentGroup label="Month Range Picker (월 → 월)">
        <MonthRangePicker
          type="month"
          value={monthRange}
          onChange={setMonthRange}
        />
      </ComponentGroup>

      <ComponentGroup label="Quarter Range Picker (분기 → 분기)">
        <MonthRangePicker
          type="quarter"
          value={quarterRange}
          onChange={setQuarterRange}
        />
      </ComponentGroup>

      <ComponentGroup label="Calendar (Single Date)">
        <div style={{ 
          padding: '16px', 
          borderRadius: '8px', 
          border: '1px solid hsl(var(--border))',
          backgroundColor: 'hsl(var(--card))'
        }}>
          <Calendar
            mode="single"
            selected={singleDate}
            onSelect={setSingleDate}
          />
          {singleDate && (
            <div style={{ marginTop: '12px', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
              선택: {singleDate.toLocaleDateString('ko-KR')}
            </div>
          )}
        </div>
      </ComponentGroup>

      <ComponentGroup label="Calendar (Range - 2 Months)">
        <div style={{ 
          padding: '16px', 
          borderRadius: '8px', 
          border: '1px solid hsl(var(--border))',
          backgroundColor: 'hsl(var(--card))'
        }}>
          <Calendar
            mode="range"
            selected={rangeDate}
            onSelect={setRangeDate}
            numberOfMonths={2}
          />
          {rangeDate?.from && (
            <div style={{ marginTop: '12px', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
              범위: {rangeDate.from.toLocaleDateString('ko-KR')}
              {rangeDate.to ? ` ~ ${rangeDate.to.toLocaleDateString('ko-KR')}` : ' ~ (종료일 선택)'}
            </div>
          )}
        </div>
      </ComponentGroup>

      <ComponentGroup label="MonthRangePicker (DataShot용 월 범위 선택)">
        <div style={{ 
          padding: '16px', 
          borderRadius: '8px', 
          border: '1px solid hsl(var(--border))',
          backgroundColor: 'hsl(var(--card))'
        }}>
          <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '8px' }}>
            DataShot에서 사용하는 월 범위 선택기 — 데이터 기간 설정에 사용
          </div>
          <MonthRangePicker
            type="month"
            value={monthRange}
            onChange={setMonthRange}
          />
        </div>
      </ComponentGroup>
    </Section>
  )
}
