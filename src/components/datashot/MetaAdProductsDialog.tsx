import { useState, useEffect } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { metaAdProducts } from './types'

interface MetaConditionGroup {
  id: string
  campaignObjective: string
  buyingTypes: string[]
  performanceGoals: string[]
  platforms: string[]
}

interface MetaAdProductsDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedProducts: string[]
  onUpdate: (products: string[]) => void
}

export function MetaAdProductsDialog({ isOpen, onClose, selectedProducts, onUpdate }: MetaAdProductsDialogProps) {
  const [conditionGroups, setConditionGroups] = useState<MetaConditionGroup[]>([])

  useEffect(() => {
    if (isOpen) {
      // 기존 선택값이 있으면 파싱, 없으면 기본 그룹 1개
      if (selectedProducts.length > 0) {
        try {
          const parsed = selectedProducts.map(p => JSON.parse(p))
          setConditionGroups(parsed)
        } catch {
          setConditionGroups([createNewGroup()])
        }
      } else {
        setConditionGroups([createNewGroup()])
      }
    }
  }, [isOpen, selectedProducts])

  const createNewGroup = (): MetaConditionGroup => ({
    id: `group-${Date.now()}-${Math.random()}`,
    campaignObjective: '',
    buyingTypes: [],
    performanceGoals: [],
    platforms: []
  })

  const addGroup = () => {
    if (conditionGroups.length >= 5) {
      alert('조건은 최대 5개까지만 추가할 수 있습니다.')
      return
    }
    setConditionGroups([...conditionGroups, createNewGroup()])
  }

  const removeGroup = (id: string) => {
    if (conditionGroups.length > 1) {
      setConditionGroups(conditionGroups.filter(g => g.id !== id))
    }
  }

  // 이미 선택된 캠페인 목표 목록
  const getSelectedCampaignObjectives = (excludeGroupId?: string): string[] => {
    return conditionGroups
      .filter(g => g.id !== excludeGroupId && g.campaignObjective)
      .map(g => g.campaignObjective)
  }

  // 선택 가능한 캠페인 목표 (이미 선택된 것 제외)
  const getAvailableCampaignObjectives = (groupId: string): string[] => {
    const selected = getSelectedCampaignObjectives(groupId)
    return metaAdProducts.campaignObjectives.filter(obj => !selected.includes(obj))
  }

  const updateGroup = (id: string, updates: Partial<MetaConditionGroup>) => {
    setConditionGroups(conditionGroups.map(g => 
      g.id === id ? { ...g, ...updates } : g
    ))
  }

  const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  const handleReset = () => {
    setConditionGroups([createNewGroup()])
  }

  const handleConfirm = () => {
    // 캠페인 목표가 선택된 그룹만 필터링
    const validGroups = conditionGroups.filter(g => g.campaignObjective)
    
    if (validGroups.length === 0) {
      alert('최소 1개의 캠페인 목표를 선택해주세요.')
      return
    }

    // JSON 문자열로 변환하여 저장
    const products = validGroups.map(g => JSON.stringify(g))
    onUpdate(products)
    onClose()
  }

  // 조합 개수 계산
  const calculateCombinations = (group: MetaConditionGroup): number => {
    if (!group.campaignObjective) return 0
    
    const campaignCount = 1 // 캠페인 목표는 1개
    const buyingCount = group.buyingTypes.length || metaAdProducts.buyingTypes.length
    const platformCount = group.platforms.length || metaAdProducts.platforms.length
    const goalCount = group.performanceGoals.length || metaAdProducts.performanceGoals.length
    
    return campaignCount * buyingCount * platformCount * goalCount
  }

  const totalCombinations = conditionGroups.reduce((sum, group) => sum + calculateCombinations(group), 0)

  if (!isOpen) return null

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
            캠페인 목표를 선택하고 필요시 세부 조건을 추가하세요
          </p>
        </div>
        
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {conditionGroups.map((group, index) => (
            <div
              key={group.id}
              style={{
                marginBottom: '24px',
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

              {/* 캠페인 목표 */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  캠페인 목표 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={group.campaignObjective}
                    onChange={(e) => updateGroup(group.id, { campaignObjective: e.target.value })}
                    className="input"
                    style={{ width: '100%', appearance: 'none', paddingRight: '32px' }}
                  >
                    <option value="">선택하세요</option>
                    {getAvailableCampaignObjectives(group.id).map(obj => (
                      <option key={obj} value={obj}>{obj}</option>
                    ))}
                    {group.campaignObjective && !getAvailableCampaignObjectives(group.id).includes(group.campaignObjective) && (
                      <option key={group.campaignObjective} value={group.campaignObjective}>{group.campaignObjective}</option>
                    )}
                  </select>
                  <ChevronDown 
                    size={16} 
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: 'hsl(var(--muted-foreground))'
                    }} 
                  />
                </div>
              </div>

              {/* 구매 유형 */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  구매 유형
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={group.buyingTypes.length === 0}
                      onChange={() => updateGroup(group.id, { buyingTypes: [] })}
                      className="checkbox-custom"
                    />
                    전체
                  </label>
                  {metaAdProducts.buyingTypes.map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={group.buyingTypes.includes(type)}
                        onChange={() => updateGroup(group.id, { 
                          buyingTypes: toggleArrayItem(group.buyingTypes, type)
                        })}
                        className="checkbox-custom"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* 플랫폼 */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  플랫폼
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', width: '100%' }}>
                    <input
                      type="checkbox"
                      checked={group.platforms.length === 0}
                      onChange={() => updateGroup(group.id, { platforms: [] })}
                      className="checkbox-custom"
                    />
                    전체
                  </label>
                  {metaAdProducts.platforms.map(platform => (
                    <label key={platform} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', width: 'calc(50% - 4px)' }}>
                      <input
                        type="checkbox"
                        checked={group.platforms.includes(platform)}
                        onChange={() => updateGroup(group.id, { 
                          platforms: toggleArrayItem(group.platforms, platform)
                        })}
                        className="checkbox-custom"
                      />
                      {platform}
                    </label>
                  ))}
                </div>
              </div>

              {/* 성과 목표 */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                  성과 목표
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', width: '100%' }}>
                    <input
                      type="checkbox"
                      checked={group.performanceGoals.length === 0}
                      onChange={() => updateGroup(group.id, { performanceGoals: [] })}
                      className="checkbox-custom"
                    />
                    전체
                  </label>
                  {metaAdProducts.performanceGoals.map(goal => (
                    <label key={goal} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', width: 'calc(50% - 4px)' }}>
                      <input
                        type="checkbox"
                        checked={group.performanceGoals.includes(goal)}
                        onChange={() => updateGroup(group.id, { 
                          performanceGoals: toggleArrayItem(group.performanceGoals, goal)
                        })}
                        className="checkbox-custom"
                      />
                      {goal}
                    </label>
                  ))}
                </div>
              </div>
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
            disabled={totalCombinations === 0}
            style={{
              opacity: totalCombinations === 0 ? 0.5 : 1,
              cursor: totalCombinations === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            확인 ({totalCombinations}개 선택)
          </button>
        </div>
      </div>
    </div>
  )
}
