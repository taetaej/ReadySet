import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, X, ChevronDown } from 'lucide-react'
import { MediaAdProductStructure } from './types'
import { adProductStructureByMedia } from './sampleData'

// 조건 그룹: 필수 필드 1개 선택 + 선택 필드 여러 개 (AND 조합)
interface ConditionGroup {
  id: string
  // key: field.key, value: 선택된 값 (string)
  selections: { fieldKey: string; value: string }[]
}

interface AdProductsDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedProducts: string[]
  onUpdate: (products: string[]) => void
  media: string
}

// 공통 셀렉박스 컴포넌트
function FieldSelect({
  placeholder,
  options,
  onSelect,
}: {
  placeholder: string
  options: string[]
  onSelect: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', minWidth: '180px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="input"
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          color: 'hsl(var(--muted-foreground))', fontSize: '13px'
        }}
      >
        <span>{placeholder}</span>
        <ChevronDown size={14} style={{ flexShrink: 0, marginLeft: '8px' }} />
      </button>
      {open && (
        <div className="dropdown" style={{
          position: 'absolute', top: '100%', left: 0,
          minWidth: '100%', maxHeight: '220px', overflowY: 'auto',
          marginTop: '4px', zIndex: 1100
        }}>
          {options.map(opt => (
            <button
              key={opt}
              className="dropdown-item"
              onClick={() => { onSelect(opt); setOpen(false) }}
            >
              {opt}
            </button>
          ))}
          {options.length === 0 && (
            <div style={{ padding: '12px', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
              선택 가능한 옵션이 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function AdProductsDialog({ isOpen, onClose, selectedProducts, onUpdate, media }: AdProductsDialogProps) {
  const [groups, setGroups] = useState<ConditionGroup[]>([])
  const [validationActive, setValidationActive] = useState(false)

  const productStructure: MediaAdProductStructure | undefined = adProductStructureByMedia[media]

  const createNewGroup = (): ConditionGroup => ({
    id: `group-${Date.now()}-${Math.random()}`,
    selections: []
  })

  useEffect(() => {
    if (isOpen && productStructure) {
      if (selectedProducts.length > 0) {
        try {
          const parsed = selectedProducts.map(p => JSON.parse(p)) as ConditionGroup[]
          setGroups(parsed)
        } catch {
          setGroups([createNewGroup()])
        }
      } else {
        setGroups([createNewGroup()])
      }
      setValidationActive(false)
    }
  }, [isOpen, productStructure])

  useEffect(() => {
    if (productStructure) {
      setGroups([createNewGroup()])
      setValidationActive(false)
    }
  }, [media])

  const requiredField = productStructure?.fields.find(f => f.required)
  const optionalFields = productStructure?.fields.filter(f => !f.required) ?? []

  // 그룹에서 이미 선택된 fieldKey 목록
  const getSelectedFieldKeys = (group: ConditionGroup) => group.selections.map(s => s.fieldKey)

  // 다음으로 선택 가능한 필드 목록 (이미 선택된 것 제외)
  const getAvailableOptionalFields = (group: ConditionGroup) => {
    const usedKeys = getSelectedFieldKeys(group)
    return optionalFields.filter(f => !usedKeys.includes(f.key))
  }

  const addSelectionToGroup = (groupId: string, fieldKey: string, value: string) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, selections: [...g.selections, { fieldKey, value }] }
        : g
    ))
  }

  const removeSelectionFromGroup = (groupId: string, fieldKey: string) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, selections: g.selections.filter(s => s.fieldKey !== fieldKey) }
        : g
    ))
  }

  const setRequiredField = (groupId: string, value: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g
      // 필수 필드 선택 시 기존 selections에서 required 제거 후 추가
      const withoutRequired = g.selections.filter(s => s.fieldKey !== requiredField!.key)
      return { ...g, selections: [{ fieldKey: requiredField!.key, value }, ...withoutRequired] }
    }))
  }

  const clearRequiredField = (groupId: string) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, selections: g.selections.filter(s => s.fieldKey !== requiredField!.key) }
        : g
    ))
  }

  const addGroup = () => {
    if (groups.length >= 5) return
    setGroups(prev => [...prev, createNewGroup()])
  }

  const removeGroup = (id: string) => {
    if (groups.length > 1) setGroups(prev => prev.filter(g => g.id !== id))
  }

  const handleReset = () => {
    setGroups([createNewGroup()])
    setValidationActive(false)
  }

  const handleConfirm = () => {
    if (!productStructure || !requiredField) return
    setValidationActive(true)
    const allValid = groups.every(g => g.selections.some(s => s.fieldKey === requiredField.key && s.value))
    if (!allValid) return
    onUpdate(groups.map(g => JSON.stringify(g)))
    setValidationActive(false)
    onClose()
  }

  if (!isOpen) return null

  if (!productStructure) {
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

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}
        style={{ width: '860px', maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

        <div className="dialog-header">
          <h3 className="dialog-title">광고상품 선택</h3>
          <p className="dialog-description">
            {requiredField?.label}을(를) 먼저 선택하고, AND 조건으로 세부 조건을 추가하세요. 조건 그룹 간은 OR로 결합됩니다.
          </p>
        </div>

        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
          {groups.map((group, index) => {
            const requiredSelection = group.selections.find(s => s.fieldKey === requiredField?.key)
            const hasRequired = !!requiredSelection
            const showError = validationActive && !hasRequired
            const availableOptional = getAvailableOptionalFields(group)

            return (
              <div key={group.id}>
                {/* 조건 그룹 카드 */}
                <div style={{
                  padding: '20px',
                  border: `1px solid ${showError ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}`,
                  borderRadius: '10px',
                  backgroundColor: 'hsl(var(--card))',
                }}>
                  {/* 그룹 헤더 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      조건 {index + 1}
                    </span>
                    {groups.length > 1 && (
                      <button onClick={() => removeGroup(group.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <Trash2 size={13} />
                        삭제
                      </button>
                    )}
                  </div>

                  {/* 조건 빌더 영역 */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>

                    {/* 필수 필드 */}
                    {hasRequired ? (
                      // 선택된 칩
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginRight: '2px' }}>
                          {requiredField?.label}
                        </span>
                        <Chip
                          label={requiredSelection!.value}
                          onRemove={() => clearRequiredField(group.id)}
                        />
                      </div>
                    ) : (
                      // 셀렉박스
                      <div>
                        <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}>
                          {requiredField?.label} <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                        </div>
                        <FieldSelect
                          placeholder={`${requiredField?.label} 선택`}
                          options={requiredField?.options ?? []}
                          onSelect={val => setRequiredField(group.id, val)}
                        />
                        {showError && (
                          <p style={{ fontSize: '11px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>
                            {requiredField?.label}을(를) 선택해주세요.
                          </p>
                        )}
                      </div>
                    )}

                    {/* AND + 선택된 optional 칩들 */}
                    {hasRequired && group.selections
                      .filter(s => s.fieldKey !== requiredField?.key)
                      .map(sel => {
                        const fieldDef = optionalFields.find(f => f.key === sel.fieldKey)
                        return (
                          <div key={sel.fieldKey} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <AndBadge />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginRight: '2px' }}>
                                {fieldDef?.label}
                              </span>
                              <Chip
                                label={sel.value}
                                onRemove={() => removeSelectionFromGroup(group.id, sel.fieldKey)}
                              />
                            </div>
                          </div>
                        )
                      })
                    }

                    {/* AND + 다음 조건 셀렉박스 */}
                    {hasRequired && availableOptional.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AndBadge />
                        <NextConditionSelect
                          availableFields={availableOptional}
                          onSelect={(fieldKey, value) => addSelectionToGroup(group.id, fieldKey, value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* OR 구분선 */}
                {index < groups.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', margin: '12px 0', gap: '12px' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'hsl(var(--border))' }} />
                    <span style={{
                      fontSize: '11px', fontWeight: '700', color: 'hsl(var(--muted-foreground))',
                      padding: '3px 10px', backgroundColor: 'hsl(var(--muted))',
                      borderRadius: '10px', border: '1px solid hsl(var(--border))'
                    }}>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'hsl(var(--border))' }} />
                  </div>
                )}
              </div>
            )
          })}

          {/* 조건 추가 버튼 */}
          {groups.length < 5 && (
            <button onClick={addGroup}
              style={{
                marginTop: groups.length > 0 ? '12px' : '0',
                width: '100%', padding: '12px',
                border: '1px dashed hsl(var(--border))', borderRadius: '8px',
                backgroundColor: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px', fontSize: '13px', color: 'hsl(var(--muted-foreground))',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(var(--primary))'; e.currentTarget.style.color = 'hsl(var(--primary))' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(var(--border))'; e.currentTarget.style.color = 'hsl(var(--muted-foreground))' }}
            >
              <Plus size={15} />
              OR 조건 추가
            </button>
          )}
        </div>

        <div className="dialog-footer">
          <button onClick={handleReset} className="btn btn-ghost btn-md" style={{ marginRight: 'auto' }}>초기화</button>
          <button onClick={onClose} className="btn btn-secondary btn-md">취소</button>
          <button onClick={handleConfirm} className="btn btn-primary btn-md">확인</button>
        </div>
      </div>
    </div>
  )
}

// 칩 컴포넌트
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '4px 8px 4px 10px',
      backgroundColor: 'hsl(var(--primary) / 0.1)',
      border: '1px solid hsl(var(--primary) / 0.3)',
      borderRadius: '20px', fontSize: '12px', fontWeight: '500',
      color: 'hsl(var(--primary))', whiteSpace: 'nowrap'
    }}>
      {label}
      <button onClick={onRemove}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', display: 'flex', alignItems: 'center', color: 'hsl(var(--primary) / 0.7)', lineHeight: 1 }}>
        <X size={11} />
      </button>
    </div>
  )
}

// AND 배지
function AndBadge() {
  return (
    <span style={{
      fontSize: '10px', fontWeight: '700', color: 'hsl(var(--foreground))',
      padding: '2px 7px', backgroundColor: 'hsl(var(--muted))',
      border: '1px solid hsl(var(--border))', borderRadius: '4px',
      letterSpacing: '0.05em', whiteSpace: 'nowrap'
    }}>
      AND
    </span>
  )
}

// 다음 조건 선택 컴포넌트 (필드 선택 → 값 선택 2단계)
function NextConditionSelect({
  availableFields,
  onSelect,
}: {
  availableFields: { label: string; key: string; options: string[] }[]
  onSelect: (fieldKey: string, value: string) => void
}) {
  const [step, setStep] = useState<'field' | 'value'>('field')
  const [selectedField, setSelectedField] = useState<{ label: string; key: string; options: string[] } | null>(null)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setStep('field')
        setSelectedField(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => { setOpen(o => !o); setStep('field'); setSelectedField(null) }}
        className="input"
        style={{
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', color: 'hsl(var(--muted-foreground))',
          padding: '5px 10px', whiteSpace: 'nowrap'
        }}
      >
        <Plus size={12} />
        조건 추가
        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="dropdown" style={{
          position: 'absolute', top: '100%', left: 0,
          minWidth: '180px', maxHeight: '240px', overflowY: 'auto',
          marginTop: '4px', zIndex: 1100
        }}>
          {step === 'field' ? (
            <>
              <div style={{ padding: '8px 12px 6px', fontSize: '11px', color: 'hsl(var(--muted-foreground))', fontWeight: '600', borderBottom: '1px solid hsl(var(--border))' }}>
                조건 유형 선택
              </div>
              {availableFields.map(f => (
                <button key={f.key} className="dropdown-item"
                  onClick={() => { setSelectedField(f); setStep('value') }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  {f.label}
                  <ChevronDown size={12} style={{ transform: 'rotate(-90deg)', opacity: 0.5 }} />
                </button>
              ))}
            </>
          ) : (
            <>
              <div style={{ padding: '8px 12px 6px', fontSize: '11px', color: 'hsl(var(--muted-foreground))', fontWeight: '600', borderBottom: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button onClick={() => { setStep('field'); setSelectedField(null) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center' }}>
                  ←
                </button>
                {selectedField?.label}
              </div>
              {selectedField?.options.map(opt => (
                <button key={opt} className="dropdown-item"
                  onClick={() => { onSelect(selectedField.key, opt); setOpen(false); setStep('field'); setSelectedField(null) }}
                >
                  {opt}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
