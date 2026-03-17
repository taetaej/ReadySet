import { useState, useEffect, useRef } from 'react'
import { X, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { adProductStructureByMedia, type AdProductOption } from './sampleData'

interface AdProductsSelectorProps {
  media: string
  value: string[]
  onChange: (products: string[]) => void
  validationActive: boolean
}

type SelectionMap = { [fieldKey: string]: string[] }

function parseSelections(products: string[]): SelectionMap {
  if (products.length === 0) return {}
  try { return JSON.parse(products[0]) } catch { return {} }
}

function encodeSelections(sel: SelectionMap): string[] {
  if (Object.keys(sel).length === 0) return []
  return [JSON.stringify(sel)]
}

const CHIP_VISIBLE = 5

function renderChips(selected: string[], onRemove: (v: string) => void, placeholder: string) {
  if (selected.length === 0) {
    return (
      <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '13px', lineHeight: '22px' }}>
        {placeholder}
      </span>
    )
  }
  const visible = selected.slice(0, CHIP_VISIBLE)
  const overflow = selected.length - CHIP_VISIBLE
  const chipStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '3px',
    padding: '2px 8px', backgroundColor: 'hsl(var(--primary) / 0.1)',
    border: '1px solid hsl(var(--primary) / 0.3)',
    borderRadius: '12px', fontSize: '12px', color: 'hsl(var(--primary))', whiteSpace: 'nowrap'
  }
  return (
    <>
      {visible.map(v => (
        <span key={v} style={chipStyle}>
          {v}
          <span role="button" onClick={e => { e.stopPropagation(); onRemove(v) }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'hsl(var(--primary) / 0.6)' }}>
            <X size={10} />
          </span>
        </span>
      ))}
      {overflow > 0 && (
        <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap', lineHeight: '22px' }}>
          외 {overflow}개 선택됨
        </span>
      )}
    </>
  )
}

// 한글 조사 판별 (받침 유무)
function getJosa(word: string, josa: '을/를' | '이/가' | '은/는'): string {
  const last = word[word.length - 1]
  const code = last.charCodeAt(0)
  const hasBatchim = code >= 0xAC00 && code <= 0xD7A3 && (code - 0xAC00) % 28 !== 0
  if (josa === '을/를') return hasBatchim ? '을' : '를'
  if (josa === '이/가') return hasBatchim ? '이' : '가'
  return hasBatchim ? '은' : '는'
}

// 옵션이 string 배열인지 AdProductOption 배열인지 판별
function isOptionObjects(opts: string[] | AdProductOption[]): opts is AdProductOption[] {
  return opts.length > 0 && typeof opts[0] === 'object'
}

// 일반 멀티셀렉 드롭다운 (검색 포함, string[] | AdProductOption[] 모두 지원)
function MultiSelect({
  label,
  required,
  options,
  selected,
  onChange,
  prerequisiteLabel,
}: {
  label: string
  required: boolean
  options: string[] | AdProductOption[]
  selected: string[]
  onChange: (next: string[]) => void
  prerequisiteLabel?: string // 이전 필드 미선택 시 placeholder에 표시할 필드명
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const hasIds = isOptionObjects(options)

  // 검색: label 또는 id 모두 매칭
  const filtered = hasIds
    ? (options as AdProductOption[]).filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase())
      )
    : (options as string[]).filter(o => o.toLowerCase().includes(search.toLowerCase()))

  const filteredValues = hasIds
    ? (filtered as AdProductOption[]).map(o => o.label)
    : (filtered as string[])

  const toggle = (v: string) => {
    onChange(selected.includes(v) ? selected.filter(s => s !== v) : [...selected, v])
  }

  return (
    <div ref={ref} style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>{label}</span>
        {required && <span style={{ color: 'hsl(var(--destructive))' }}>*</span>}
      </div>

      <button
        onClick={() => !prerequisiteLabel && setOpen(o => !o)}
        className="input"
        style={{
          width: '100%', textAlign: 'left', cursor: prerequisiteLabel ? 'default' : 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          minHeight: '36px', height: 'auto', padding: '6px 12px',
          backgroundColor: prerequisiteLabel ? 'hsl(var(--muted) / 0.5)' : undefined,
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '4px', minWidth: 0 }}>
          {prerequisiteLabel
            ? <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '13px', lineHeight: '22px' }}>{prerequisiteLabel}{getJosa(prerequisiteLabel, '을/를')} 먼저 선택해주세요.</span>
            : renderChips(selected, toggle, `${label}${getJosa(label, '을/를')} 선택하세요.`)
          }
        </div>
        {!prerequisiteLabel && (open ? <ChevronUp size={14} style={{ flexShrink: 0, marginLeft: '4px' }} /> : <ChevronDown size={14} style={{ flexShrink: 0, marginLeft: '4px' }} />)}
      </button>

      {open && (
        <div style={{
          border: '1px solid hsl(var(--border))', borderRadius: '6px', marginTop: '4px',
          backgroundColor: 'hsl(var(--card))', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          zIndex: 100, position: 'relative'
        }}>
          {/* 검색 */}
          <div style={{ padding: '8px', borderBottom: '1px solid hsl(var(--border))', position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={hasIds ? '상품명 또는 ID로 검색하세요.' : '검색하세요.'}
              className="input"
              style={{ paddingLeft: '30px', width: '100%', height: '30px', fontSize: '12px' }}
              onClick={e => e.stopPropagation()}
            />
          </div>
          {/* 전체 선택/해제 */}
          <div style={{ padding: '6px 12px', borderBottom: '1px solid hsl(var(--border))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>{filtered.length}개 항목</span>
            <button
              onClick={() => onChange(selected.length === filteredValues.length && filteredValues.every(v => selected.includes(v)) ? selected.filter(v => !filteredValues.includes(v)) : [...new Set([...selected, ...filteredValues])])}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '11px' }}
            >
              {filteredValues.every(v => selected.includes(v)) && filteredValues.length > 0 ? '전체 해제' : '전체 선택'}
            </button>
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filtered.length === 0
              ? <div style={{ padding: '12px', fontSize: '13px', color: 'hsl(var(--muted-foreground))', textAlign: 'center' }}>검색 결과 없음</div>
              : hasIds
                ? (filtered as AdProductOption[]).map(opt => (
                  <label key={opt.label} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 12px', cursor: 'pointer',
                    backgroundColor: selected.includes(opt.label) ? 'hsl(var(--primary) / 0.06)' : 'transparent',
                    transition: 'background 0.1s',
                  }}>
                    <input type="checkbox" checked={selected.includes(opt.label)} onChange={() => toggle(opt.label)} className="checkbox-custom" />
                    <div>
                      <div style={{ fontSize: '13px' }}>{opt.label}</div>
                      <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginTop: '1px' }}>ID: {opt.id}</div>
                    </div>
                  </label>
                ))
                : (filtered as string[]).map(opt => (
                  <label key={opt} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 12px', cursor: 'pointer', fontSize: '13px',
                    backgroundColor: selected.includes(opt) ? 'hsl(var(--primary) / 0.06)' : 'transparent',
                    transition: 'background 0.1s',
                  }}>
                    <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="checkbox-custom" />
                    <span>{opt}</span>
                  </label>
                ))
            }
          </div>
        </div>
      )}
    </div>
  )
}

export function AdProductsSelector({ media, value, onChange, validationActive }: AdProductsSelectorProps) {
  const structure = adProductStructureByMedia[media]

  const selections: SelectionMap = parseSelections(value)

  const updateField = (fieldKey: string, next: string[]) => {
    const updated = { ...selections, [fieldKey]: next }
    if (next.length === 0) delete updated[fieldKey]
    onChange(encodeSelections(updated))
  }

  if (!media) return null
  if (!structure) return null

  const requiredField = structure.fields[0]
  const requiredSelected = selections[requiredField.key] ?? []
  const isRequiredValid = requiredSelected.length > 0

  return (
    <div>
      {/* 첫 번째 필드 (필수) */}
      <MultiSelect
        label={requiredField.label}
        required={true}
        options={requiredField.options}
        selected={requiredSelected}
        onChange={next => updateField(requiredField.key, next)}
      />

      {validationActive && !isRequiredValid && (
        <p style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '-16px', marginBottom: '20px' }}>
          {requiredField.label}{getJosa(requiredField.label, '을/를')} 선택해주세요.
        </p>
      )}

      {/* 나머지 필드 (선택, 첫 번째 선택 후 활성화) */}
      {structure.fields.slice(1).map((field) => (
        <MultiSelect
          key={field.key}
          label={field.label}
          required={false}
          options={field.options}
          selected={selections[field.key] ?? []}
          onChange={next => updateField(field.key, next)}
          prerequisiteLabel={!isRequiredValid ? requiredField.label : undefined}
        />
      ))}
    </div>
  )
}
