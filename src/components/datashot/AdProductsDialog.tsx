import { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { adProductStructureByMedia } from './sampleData'

interface AdProductsDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedProducts: string[]
  onUpdate: (products: string[]) => void
  media: string
}

// 저장 형식: JSON.stringify({ [fieldKey]: string[] })
type SelectionMap = { [fieldKey: string]: string[] }

function parseSelections(selectedProducts: string[]): SelectionMap {
  if (selectedProducts.length === 0) return {}
  try { return JSON.parse(selectedProducts[0]) } catch { return {} }
}

export function AdProductsDialog({ isOpen, onClose, selectedProducts, onUpdate, media }: AdProductsDialogProps) {
  const [selections, setSelections] = useState<SelectionMap>({})
  const [openField, setOpenField] = useState<string | null>(null)
  const [validationActive, setValidationActive] = useState(false)

  const structure = adProductStructureByMedia[media]

  useEffect(() => {
    if (isOpen) {
      setSelections(parseSelections(selectedProducts))
      setOpenField(null)
      setValidationActive(false)
    }
  }, [isOpen])

  useEffect(() => {
    setSelections({})
    setOpenField(null)
    setValidationActive(false)
  }, [media])

  if (!isOpen) return null

  if (!structure) {
    return (
      <div className="dialog-overlay" onClick={onClose}>
        <div className="dialog-content" onClick={e => e.stopPropagation()}
          style={{ maxWidth: '500px', padding: '24px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>지원하지 않는 매체</h3>
          <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))', marginBottom: '24px' }}>
            {media} 매체는 아직 광고상품 구조가 정의되지 않았습니다.
          </p>
          <button onClick={onClose} className="btn btn-primary btn-md">확인</button>
        </div>
      </div>
    )
  }

  const requiredField = structure.fields[0]
  const requiredSelected = selections[requiredField.key] ?? []
  const isRequiredValid = requiredSelected.length > 0

  // 선택된 첫 번째 필드 값들의 합집합으로 나머지 필드 옵션 제공
  // (현재 구조상 options는 고정이므로 그대로 사용, 추후 의존 관계 추가 가능)
  const isFieldEnabled = (fieldKey: string) => {
    if (fieldKey === requiredField.key) return true
    return isRequiredValid
  }

  const toggleValue = (fieldKey: string, value: string) => {
    setSelections(prev => {
      const current = prev[fieldKey] ?? []
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      if (next.length === 0) {
        const { [fieldKey]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [fieldKey]: next }
    })
  }

  const clearField = (fieldKey: string) => {
    setSelections(prev => {
      const { [fieldKey]: _, ...rest } = prev
      return rest
    })
  }

  const handleReset = () => {
    setSelections({})
    setOpenField(null)
    setValidationActive(false)
  }

  const handleConfirm = () => {
    setValidationActive(true)
    if (!isRequiredValid) return
    onUpdate(Object.keys(selections).length > 0 ? [JSON.stringify(selections)] : [])
    onClose()
  }

  const totalSelected = Object.values(selections).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}
        style={{ width: '600px', maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

        <div className="dialog-header">
          <h3 className="dialog-title">{media} 광고상품 선택</h3>
          <p className="dialog-description">
            {requiredField.label}은(는) 필수 선택입니다. 나머지 항목은 선택 사항이며 모두 다중 선택 가능합니다.
          </p>
        </div>

        <div style={{ padding: '20px 24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {structure.fields.map((field, idx) => {
            const selected = selections[field.key] ?? []
            const enabled = isFieldEnabled(field.key)
            const isOpen = openField === field.key
            const isRequired = idx === 0
            const showError = validationActive && isRequired && selected.length === 0

            return (
              <div key={field.key} style={{ opacity: enabled ? 1 : 0.4, pointerEvents: enabled ? 'auto' : 'none' }}>
                {/* 필드 레이블 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{field.label}</span>
                  {isRequired && <span style={{ color: 'hsl(var(--destructive))', fontSize: '13px' }}>*</span>}
                  {!isRequired && (
                    <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>선택</span>
                  )}
                </div>

                {/* 드롭다운 트리거 */}
                <button
                  onClick={() => setOpenField(isOpen ? null : field.key)}
                  className="input"
                  style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderColor: showError ? 'hsl(var(--destructive))' : undefined,
                    minHeight: '36px', height: 'auto', padding: '6px 12px',
                  }}
                >
                  <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '4px', minWidth: 0 }}>
                    {selected.length === 0 ? (
                      <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '13px', lineHeight: '22px' }}>
                        {field.label} 선택
                      </span>
                    ) : selected.map(v => (
                      <span key={v} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '3px',
                        padding: '2px 8px', backgroundColor: 'hsl(var(--primary) / 0.1)',
                        border: '1px solid hsl(var(--primary) / 0.3)',
                        borderRadius: '12px', fontSize: '12px', color: 'hsl(var(--primary))',
                        whiteSpace: 'nowrap'
                      }}>
                        {v}
                        <span
                          role="button"
                          onClick={e => { e.stopPropagation(); toggleValue(field.key, v) }}
                          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'hsl(var(--primary) / 0.6)' }}
                        >
                          <X size={10} />
                        </span>
                      </span>
                    ))}
                  </div>
                  {isOpen ? <ChevronUp size={14} style={{ flexShrink: 0, marginLeft: '8px' }} /> : <ChevronDown size={14} style={{ flexShrink: 0, marginLeft: '8px' }} />}
                </button>

                {/* 드롭다운 옵션 목록 */}
                {isOpen && (
                  <div style={{
                    border: '1px solid hsl(var(--border))', borderRadius: '6px',
                    marginTop: '4px', maxHeight: '220px', overflowY: 'auto',
                    backgroundColor: 'hsl(var(--card))',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}>
                    {/* 전체 선택/해제 */}
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid hsl(var(--border))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                        {field.options.length}개 항목
                      </span>
                      <button
                        onClick={() => {
                          if (selected.length === field.options.length) {
                            clearField(field.key)
                          } else {
                            setSelections(prev => ({ ...prev, [field.key]: [...field.options] }))
                          }
                        }}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: '11px' }}
                      >
                        {selected.length === field.options.length ? '전체 해제' : '전체 선택'}
                      </button>
                    </div>
                    {field.options.map(opt => {
                      const isChecked = selected.includes(opt)
                      return (
                        <label key={opt}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '9px 12px', cursor: 'pointer',
                            backgroundColor: isChecked ? 'hsl(var(--primary) / 0.06)' : 'transparent',
                            transition: 'background 0.1s',
                            fontSize: '13px',
                          }}
                          onMouseEnter={e => { if (!isChecked) e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)' }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = isChecked ? 'hsl(var(--primary) / 0.06)' : 'transparent' }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleValue(field.key, opt)}
                            className="checkbox-custom"
                          />
                          <span>{opt}</span>
                        </label>
                      )
                    })}
                  </div>
                )}

                {showError && (
                  <p style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>
                    {field.label}을(를) 선택해주세요.
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div className="dialog-footer">
          <button onClick={handleReset} className="btn btn-ghost btn-md" style={{ marginRight: 'auto' }}>초기화</button>
          <button onClick={onClose} className="btn btn-secondary btn-md">취소</button>
          <button onClick={handleConfirm} className="btn btn-primary btn-md">
            확인 ({totalSelected}개 선택)
          </button>
        </div>
      </div>
    </div>
  )
}
