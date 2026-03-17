import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
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

function getJosa(word: string, _josa: '을/를'): string {
  const last = word[word.length - 1]
  const code = last.charCodeAt(0)
  const hasBatchim = code >= 0xAC00 && code <= 0xD7A3 && (code - 0xAC00) % 28 !== 0
  return hasBatchim ? '을' : '를'
}

function isOptionObjects(opts: string[] | AdProductOption[]): opts is AdProductOption[] {
  return opts.length > 0 && typeof opts[0] === 'object'
}

function getOptionLabel(opt: string | AdProductOption): string {
  return typeof opt === 'object' ? opt.label : opt
}


// ── 인라인 리스트 (선택 필드용) ──
function InlineFieldList({
  label, options, selected, onChange, search, onSearchChange
}: {
  label: string
  options: string[] | AdProductOption[]
  selected: string[]
  onChange: (next: string[]) => void
  search: string
  onSearchChange: (v: string) => void
}) {
  const hasIds = isOptionObjects(options)
  const filtered = hasIds
    ? (options as AdProductOption[]).filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : (options as string[]).filter(o => o.toLowerCase().includes(search.toLowerCase()))

  const toggle = (v: string) => {
    onChange(selected.includes(v) ? selected.filter(s => s !== v) : [...selected, v])
  }

  return (
    <div style={{
      border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden'
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '10px 14px', backgroundColor: 'hsl(var(--muted) / 0.2)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid hsl(var(--border))'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600' }}>{label}</span>
          {selected.length > 0 && (
            <span style={{ fontSize: '11px', color: 'hsl(var(--primary))', fontWeight: '500' }}>{selected.length}개</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              const allLabels = options.map(o => getOptionLabel(o))
              const allSelected = allLabels.every(l => selected.includes(l))
              onChange(allSelected ? [] : allLabels)
            }}
            style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
          >
            {options.map(o => getOptionLabel(o)).every(l => selected.includes(l)) ? '전체 해제' : '전체 선택'}
          </button>
          <div style={{ position: 'relative', width: '160px' }}>
            <Search size={11} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
            <input type="text" value={search} onChange={e => onSearchChange(e.target.value)}
              placeholder="검색" className="input"
              style={{ width: '100%', height: '26px', fontSize: '11px', paddingLeft: '24px' }} />
          </div>
        </div>
      </div>
      {/* 리스트 */}
      <div style={{ maxHeight: '180px', overflowY: 'auto', padding: '4px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '12px', fontSize: '11px', color: 'hsl(var(--muted-foreground))', textAlign: 'center' }}>검색 결과 없음</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0' }}>
            {filtered.map(opt => {
              const lbl = getOptionLabel(opt)
              const isSelected = selected.includes(lbl)
              return (
                <label key={lbl} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px',
                  backgroundColor: isSelected ? 'hsl(var(--primary) / 0.05)' : 'transparent',
                  transition: 'background 0.1s'
                }}>
                  <input type="checkbox" checked={isSelected} onChange={() => toggle(lbl)} className="checkbox-custom" style={{ flexShrink: 0 }} />
                  <span style={{
                    color: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                    fontWeight: isSelected ? '500' : '400',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>{lbl}</span>
                </label>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── 메인 컴포넌트 ──
export function AdProductsSelector({ media, value, onChange, validationActive }: AdProductsSelectorProps) {
  const [searchMap, setSearchMap] = useState<Record<string, string>>({})
  const structure = adProductStructureByMedia[media]
  const selections: SelectionMap = parseSelections(value)

  // 매체 변경 시 검색 초기화
  useEffect(() => { setSearchMap({}) }, [media])

  if (!media || !structure) return null

  const requiredField = structure.fields[0]
  const requiredSelected = selections[requiredField.key] ?? []
  const isRequiredValid = requiredSelected.length > 0

  const updateField = (fieldKey: string, next: string[]) => {
    const updated = { ...selections, [fieldKey]: next }
    if (next.length === 0) delete updated[fieldKey]
    onChange(encodeSelections(updated))
  }

  return (
    <div>
      {/* 필수 필드: 인라인 리스트 */}
      <div style={{ marginBottom: '12px' }}>
        <InlineFieldList
          label={`${requiredField.label} *`}
          options={requiredField.options}
          selected={requiredSelected}
          onChange={next => updateField(requiredField.key, next)}
          search={searchMap[requiredField.key] || ''}
          onSearchChange={v => setSearchMap(prev => ({ ...prev, [requiredField.key]: v }))}
        />
        {validationActive && !isRequiredValid && (
          <p style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>
            {requiredField.label}{getJosa(requiredField.label, '을/를')} 선택해주세요.
          </p>
        )}
      </div>

      {/* 나머지 필드: 인라인 리스트 (캠페인 목표 선택 후 활성화) */}
      {isRequiredValid && structure.fields.slice(1).map(field => (
        <div key={field.key} style={{ marginBottom: '12px' }}>
          <InlineFieldList
            label={field.label}
            options={field.options}
            selected={selections[field.key] ?? []}
            onChange={next => updateField(field.key, next)}
            search={searchMap[field.key] || ''}
            onSearchChange={v => setSearchMap(prev => ({ ...prev, [field.key]: v }))}
          />
        </div>
      ))}
    </div>
  )
}
