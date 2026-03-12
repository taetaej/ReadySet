import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { adProductStructureByMedia, MediaAdProductStructure } from './types'

interface ConditionGroup {
  id: string
  [key: string]: string | string[]
}

interface AdProductsDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedProducts: string[]
  onUpdate: (products: string[]) => void
  media: string
}

export function AdProductsDialog({ isOpen, onClose, selectedProducts, onUpdate, media }: AdProductsDialogProps) {
  const [conditionGroups, setConditionGroups] = useState<ConditionGroup[]>([])
  const [validationActive, setValidationActive] = useState(false)
  
  // Searchable dropdown 상태 (각 그룹별로 관리)
  const [dropdownStates, setDropdownStates] = useState<{ [groupId: string]: { open: boolean; search: string } }>({})
  
  // 매체별 광고상품 구조 가져오기
  const productStructure: MediaAdProductStructure | undefined = adProductStructureByMedia[media]

  useEffect(() => {
    if (isOpen && productStructure) {
      // 기존 선택값이 있으면 파싱, 없으면 기본 그룹 1개
      if (selectedProducts.length > 0) {
        try {
          const parsed = selectedProducts.map(p => JSON.parse(p)) as ConditionGroup[]
          setConditionGroups(parsed)
        } catch {
          setConditionGroups([createNewGroup()])
        }
      } else {
        setConditionGroups([createNewGroup()])
      }
      // 드롭다운 상태 초기화
      setDropdownStates({})
    }
  }, [isOpen, selectedProducts, productStructure])

  // 매체가 변경되면 conditionGroups 초기화
  useEffect(() => {
    if (productStructure) {
      const newGroup = createNewGroup()
      setConditionGroups([newGroup])
      setDropdownStates({})
    }
  }, [media])

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.searchable-dropdown-container')) {
        setDropdownStates({})
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const createNewGroup = (): ConditionGroup => {
    const group: any = {
      id: `group-${Date.now()}-${Math.random()}`
    }
    
    // 필드 초기화
    if (productStructure) {
      productStructure.fields.forEach(field => {
        // 필수 필드는 빈 문자열, 선택 필드는 전체 옵션 선택
        group[field.key] = field.required ? '' : [...field.options]
      })
    }
    
    return group as ConditionGroup
  }

  const addGroup = () => {
    if (conditionGroups.length >= 5) {
      return
    }
    setConditionGroups([...conditionGroups, createNewGroup()])
  }

  const removeGroup = (id: string) => {
    if (conditionGroups.length > 1) {
      setConditionGroups(conditionGroups.filter(g => g.id !== id))
    }
  }

  // 이미 선택된 필수 필드 값 목록
  const getSelectedRequiredValues = (fieldKey: string, excludeGroupId?: string): string[] => {
    return conditionGroups
      .filter(g => g.id !== excludeGroupId && g[fieldKey])
      .map(g => g[fieldKey] as string)
      .filter(v => v !== '')
  }

  // 선택 가능한 필수 필드 옵션 (이미 선택된 것 제외)
  const getAvailableOptions = (fieldKey: string, options: string[], groupId: string): string[] => {
    const selected = getSelectedRequiredValues(fieldKey, groupId)
    return options.filter(opt => !selected.includes(opt))
  }

  const updateGroup = (id: string, updates: Partial<ConditionGroup>) => {
    setConditionGroups(conditionGroups.map(g => 
      g.id === id ? { ...g, ...updates } as ConditionGroup : g
    ))
  }

  const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  const handleReset = () => {
    setConditionGroups([createNewGroup()])
    setValidationActive(false)
  }

  const handleConfirm = () => {
    if (!productStructure) return
    
    setValidationActive(true)
    
    // 필수 필드 확인
    const requiredField = productStructure.fields.find(f => f.required)
    if (!requiredField) return
    
    // 모든 그룹이 필수 필드를 가지고 있는지 확인
    const allValid = conditionGroups.every(g => g[requiredField.key])
    
    if (!allValid) {
      // 유효하지 않은 그룹이 있으면 창을 닫지 않음
      return
    }

    // JSON 문자열로 변환하여 저장
    const products = conditionGroups.map(g => JSON.stringify(g))
    onUpdate(products)
    setValidationActive(false)
    onClose()
  }

  // 조합 개수 계산
  const calculateCombinations = (group: ConditionGroup): number => {
    if (!productStructure) return 0
    
    const requiredField = productStructure.fields.find(f => f.required)
    if (!requiredField || !group[requiredField.key]) return 0
    
    let count = 1
    productStructure.fields.forEach(field => {
      const value = group[field.key]
      if (Array.isArray(value)) {
        count *= value.length || field.options.length
      } else if (value) {
        count *= 1
      }
    })
    
    return count
  }

  const totalCombinations = conditionGroups.reduce((sum, group) => sum + calculateCombinations(group), 0)

  if (!isOpen) return null
  
  if (!productStructure) {
    return (
      <div className="dialog-overlay" onClick={onClose}>
        <div 
          className="dialog-content" 
          onClick={(e) => e.stopPropagation()}
          style={{ 
            maxWidth: '500px',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
            지원하지 않는 매체
          </h3>
          <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))', marginBottom: '24px' }}>
            {media} 매체는 아직 광고상품 구조가 정의되지 않았습니다.
          </p>
          <button onClick={onClose} className="btn btn-primary btn-md">
            확인
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div 
        className="dialog-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          width: '1200px', 
          height: '80vh',
          maxWidth: '95vw', 
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">광고상품 선택</h3>
          <p className="dialog-description">
            {productStructure.fields.find(f => f.required)?.label}을(를) 선택하고 필요시 세부 조건을 추가하세요
          </p>
        </div>
        
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {conditionGroups.map((group, index) => (
            <div key={group.id}>
              <div
                style={{
                  marginBottom: index < conditionGroups.length - 1 ? '16px' : '24px',
                  padding: '20px',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  backgroundColor: 'hsl(var(--card))'
                }}
              >
                {/* 그룹 헤더 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600' }}>
                    조건 {index + 1}
                  </h3>
                  {conditionGroups.length > 1 && (
                    <button
                      onClick={() => removeGroup(group.id)}
                      style={{
                        padding: '6px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        color: 'hsl(var(--destructive))',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px'
                      }}
                    >
                      <Trash2 size={14} />
                      삭제
                    </button>
                  )}
                </div>

                {/* 동적 필드 렌더링 */}
                {productStructure && productStructure.fields.map((field, fieldIndex) => {
                  const isRequired = field.required
                  const value = group[field.key]
                  const isSelect = isRequired
                  const showError = validationActive && isRequired && !value

                  return (
                    <div key={field.key} style={{ marginBottom: fieldIndex < productStructure.fields.length - 1 ? '16px' : '0' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                        {field.label} {isRequired && <span style={{ color: 'hsl(var(--destructive))' }}>*</span>}
                      </label>
                      
                      {isSelect ? (
                        // 필수 필드: Searchable Dropdown
                        <>
                          <div className="searchable-dropdown-container" style={{ position: 'relative' }}>
                            <input
                              type="text"
                              value={value as string || dropdownStates[group.id]?.search || ''}
                              onChange={(e) => {
                                setDropdownStates({
                                  ...dropdownStates,
                                  [group.id]: { open: true, search: e.target.value }
                                })
                                if (!e.target.value) {
                                  updateGroup(group.id, { [field.key]: '' })
                                }
                              }}
                              onFocus={() => {
                                setDropdownStates({
                                  ...dropdownStates,
                                  [group.id]: { open: true, search: dropdownStates[group.id]?.search || '' }
                                })
                              }}
                              placeholder="선택하세요"
                              className="input"
                              style={{ 
                                width: '100%',
                                borderColor: showError ? 'hsl(var(--destructive))' : undefined
                              }}
                            />
                            {dropdownStates[group.id]?.open && (
                              <div className="dropdown" style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                marginTop: '4px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                zIndex: 1000
                              }}>
                                {getAvailableOptions(field.key, field.options, group.id)
                                  .filter(opt => 
                                    opt.toLowerCase().includes((dropdownStates[group.id]?.search || '').toLowerCase())
                                  )
                                  .map(opt => (
                                    <button
                                      key={opt}
                                      onClick={() => {
                                        updateGroup(group.id, { [field.key]: opt })
                                        setDropdownStates({
                                          ...dropdownStates,
                                          [group.id]: { open: false, search: '' }
                                        })
                                      }}
                                      className="dropdown-item"
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                {getAvailableOptions(field.key, field.options, group.id)
                                  .filter(opt => 
                                    opt.toLowerCase().includes((dropdownStates[group.id]?.search || '').toLowerCase())
                                  ).length === 0 && (
                                  <div style={{ padding: '12px', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                                    검색 결과가 없습니다
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          {showError && (
                            <p style={{ 
                              fontSize: '12px', 
                              color: 'hsl(var(--destructive))', 
                              marginTop: '4px' 
                            }}>
                              {field.label}을(를) 선택해주세요.
                            </p>
                          )}
                        </>
                      ) : (
                        // 선택 필드: 체크박스 그룹
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', width: '100%' }}>
                            <input
                              type="checkbox"
                              checked={(value as string[]).length === field.options.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // 전체 선택: 모든 옵션 선택
                                  updateGroup(group.id, { [field.key]: [...field.options] })
                                } else {
                                  // 전체 해제: 빈 배열
                                  updateGroup(group.id, { [field.key]: [] })
                                }
                              }}
                              className="checkbox-custom"
                            />
                            전체
                          </label>
                          {field.options.map(opt => (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', width: 'calc(50% - 4px)' }}>
                              <input
                                type="checkbox"
                                checked={(value as string[]).includes(opt)}
                                onChange={() => updateGroup(group.id, { 
                                  [field.key]: toggleArrayItem(value as string[], opt)
                                })}
                                className="checkbox-custom"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              
              {/* OR 구분선 */}
              {index < conditionGroups.length - 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '16px 0',
                  gap: '12px'
                }}>
                  <div style={{
                    flex: 1,
                    height: '1px',
                    backgroundColor: 'hsl(var(--border))'
                  }} />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'hsl(var(--muted-foreground))',
                    padding: '4px 12px',
                    backgroundColor: 'hsl(var(--muted))',
                    borderRadius: '12px',
                    border: '1px solid hsl(var(--border))'
                  }}>
                    OR
                  </span>
                  <div style={{
                    flex: 1,
                    height: '1px',
                    backgroundColor: 'hsl(var(--border))'
                  }} />
                </div>
              )}
            </div>
          ))}

          {/* 조건 추가 버튼 */}
          {conditionGroups.length < 5 && (
            <button
              onClick={addGroup}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px dashed hsl(var(--border))',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'hsl(var(--muted-foreground))',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'hsl(var(--primary))'
                e.currentTarget.style.color = 'hsl(var(--primary))'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'hsl(var(--border))'
                e.currentTarget.style.color = 'hsl(var(--muted-foreground))'
              }}
            >
              <Plus size={16} />
              조건 추가
            </button>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="dialog-footer">
          <button
            onClick={handleReset}
            className="btn btn-ghost btn-md"
            style={{ marginRight: 'auto' }}
          >
            초기화
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-md"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="btn btn-primary btn-md"
          >
            확인 ({totalCombinations}개 선택)
          </button>
        </div>
      </div>
    </div>
  )
}
