import { useState, useEffect } from 'react'
import { Search, Plus, Minus } from 'lucide-react'
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



// ── 접힌 행 ──
function CollapsibleFieldRow({
  label, options, selected, onChange, search, onSearchChange, defaultOpen = true, guideText
}: {
  label: string
  options: string[] | AdProductOption[]
  selected: string[]
  onChange: (next: string[]) => void
  search: string
  onSearchChange: (v: string) => void
  defaultOpen?: boolean
  guideText?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  const hasIds = isOptionObjects(options)
  const allLabels = options.map(o => getOptionLabel(o))
  const allSelected = allLabels.every(l => selected.includes(l))

  const filtered = hasIds
    ? (options as AdProductOption[]).filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : (options as string[]).filter(o => o.toLowerCase().includes(search.toLowerCase()))

  const toggle = (v: string) => onChange(selected.includes(v) ? selected.filter(s => s !== v) : [...selected, v])

  return (
    <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden', marginBottom: '0' }}>
      {/* 헤더 행 */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
          cursor: 'pointer', backgroundColor: open ? 'hsl(var(--muted) / 0.2)' : 'transparent',
          borderBottom: open ? '1px solid hsl(var(--border))' : 'none',
          transition: 'background 0.15s'
        }}
      >
        <span style={{
          width: '20px', height: '20px', borderRadius: '4px',
          border: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: 'hsl(var(--muted-foreground))'
        }}>
          {open ? <Minus size={12} /> : <Plus size={12} />}
        </span>
        <span style={{ fontSize: '13px', fontWeight: '500', flex: 1 }}>
          {label.endsWith(' *') ? (
            <>{label.slice(0, -2)}<span style={{ color: 'hsl(var(--destructive))', marginLeft: '2px' }}>*</span></>
          ) : label}
        </span>
        {open && (
          <div style={{ position: 'relative', width: '140px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            <Search size={11} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))', pointerEvents: 'none' }} />
            <input type="text" value={search} onChange={e => onSearchChange(e.target.value)}
              placeholder="검색" className="input"
              style={{ width: '100%', height: '26px', fontSize: '11px', paddingLeft: '24px' }} />
          </div>
        )}
        {open && (
          <button
            onClick={e => { e.stopPropagation(); onChange(allSelected ? [] : allLabels) }}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '11px', flexShrink: 0 }}
          >
            {allSelected ? '전체 해제' : '전체 선택'}
          </button>
        )}
      </div>

      {/* 펼쳐진 영역 */}
      {open && (
        <>
          {guideText ? (
            <div style={{ padding: '14px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', textAlign: 'center' }}>
              {guideText}
            </div>
          ) : (
          <div style={{ maxHeight: '128px', overflowY: 'auto', padding: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {filtered.map(opt => {
                const lbl = getOptionLabel(opt)
                const isSelected = selected.includes(lbl)
                return (
                  <label key={lbl} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px',
                    backgroundColor: isSelected ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                    transition: 'background 0.1s'
                  }} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggle(lbl)} className="checkbox-custom" style={{ flexShrink: 0 }} />
                    <span style={{ color: 'hsl(var(--foreground))', fontWeight: isSelected ? '500' : '400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lbl}</span>
                  </label>
                )
              })}
            </div>
          </div>
          )}
        </>
      )}
    </div>
  )
}
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
      {/* 필수 필드: 기본 펼침 */}
      <div style={{ marginBottom: '12px' }}>
        <CollapsibleFieldRow
          label={`${requiredField.label} *`}
          options={requiredField.options}
          selected={requiredSelected}
          onChange={next => updateField(requiredField.key, next)}
          search={searchMap[requiredField.key] || ''}
          onSearchChange={v => setSearchMap(prev => ({ ...prev, [requiredField.key]: v }))}
          defaultOpen={true}
        />
        {validationActive && !isRequiredValid && (
          <p style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>
            {requiredField.label}{getJosa(requiredField.label, '을/를')} 선택해주세요.
          </p>
        )}
      </div>

      {/* 나머지 필드: 항상 렌더링, 옵션1 미선택 시 가이드 문구 표시 */}
      {structure.fields.slice(1).map(field => (
        <div key={field.key} style={{ marginBottom: '12px' }}>
          <CollapsibleFieldRow
            label={field.label}
            options={field.options}
            selected={selections[field.key] ?? []}
            onChange={next => updateField(field.key, next)}
            search={searchMap[field.key] || ''}
            onSearchChange={v => setSearchMap(prev => ({ ...prev, [field.key]: v }))}
            defaultOpen={true}
            guideText={!isRequiredValid ? `${requiredField.label}${getJosa(requiredField.label, '을/를')} 먼저 선택해주세요.` : undefined}
          />
        </div>
      ))}
    </div>
  )
}
