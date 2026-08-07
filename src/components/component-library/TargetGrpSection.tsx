import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Section, ComponentGroup } from './Section'

export function TargetGrpSection() {
  const [showTargetDialog, setShowTargetDialog] = useState(false)
  const [selectedTargets, setSelectedTargets] = useState<string[]>([])

  const targetGrpOptions = {
    male: ['남성 13-18', '남성 19-24', '남성 25-29', '남성 30-34', '남성 35-39', '남성 40-44', '남성 45-49', '남성 50-54', '남성 55-59', '남성 60-64', '남성 65-69', '남성 70+'],
    female: ['여성 13-18', '여성 19-24', '여성 25-29', '여성 30-34', '여성 35-39', '여성 40-44', '여성 45-49', '여성 50-54', '여성 55-59', '여성 60-64', '여성 65-69', '여성 70+']
  }

  const toggleTargetGrp = (target: string) => {
    setSelectedTargets(prev =>
      prev.includes(target) ? prev.filter(t => t !== target) : [...prev, target]
    )
  }

  const selectAllMale = () => {
    const allMale = targetGrpOptions.male
    const hasAllMale = allMale.every(t => selectedTargets.includes(t))
    if (hasAllMale) {
      setSelectedTargets(prev => prev.filter(t => !allMale.includes(t)))
    } else {
      setSelectedTargets(prev => [...new Set([...prev, ...allMale])])
    }
  }

  const selectAllFemale = () => {
    const allFemale = targetGrpOptions.female
    const hasAllFemale = allFemale.every(t => selectedTargets.includes(t))
    if (hasAllFemale) {
      setSelectedTargets(prev => prev.filter(t => !allFemale.includes(t)))
    } else {
      setSelectedTargets(prev => [...new Set([...prev, ...allFemale])])
    }
  }

  return (
    <>
      <Section title="Target GRP Selection" description="타겟 GRP 선택 다이얼로그">
        <ComponentGroup label="Target GRP Button">
          <button
            onClick={() => setShowTargetDialog(true)}
            className="input"
            style={{
              width: '400px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ color: selectedTargets.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
              {selectedTargets.length === 24 
                ? '전체' 
                : selectedTargets.length > 0 
                ? `${selectedTargets.length}개 타겟 선택됨` 
                : '타겟 GRP를 선택하세요.'}
            </span>
            <ChevronRight size={16} />
          </button>
        </ComponentGroup>
      </Section>

      {/* 타겟 GRP 다이얼로그 */}
      {showTargetDialog && (
        <div className="dialog-overlay" onClick={() => setShowTargetDialog(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="dialog-header">
              <h3 className="dialog-title">타겟 GRP 선택</h3>
              <p className="dialog-description">도달률 산출에 적용할 타겟 모수를 선택하세요</p>
            </div>
            
            <div style={{ padding: '24px' }}>
              {/* 남성 */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid hsl(var(--border))' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>남성</span>
                  <button onClick={selectAllMale} className="btn btn-ghost btn-sm">
                    {targetGrpOptions.male.every(t => selectedTargets.includes(t)) ? '전체 해제' : '전체 선택'}
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {targetGrpOptions.male.map((target) => (
                    <label key={target} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${selectedTargets.includes(target) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`, backgroundColor: selectedTargets.includes(target) ? 'hsl(var(--primary) / 0.1)' : 'transparent', transition: 'all 0.2s' }}>
                      <input type="checkbox" checked={selectedTargets.includes(target)} onChange={() => toggleTargetGrp(target)} className="checkbox-custom" />
                      <span style={{ fontSize: '12px' }}>{target.replace('남성 ', '')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 여성 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid hsl(var(--border))' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>여성</span>
                  <button onClick={selectAllFemale} className="btn btn-ghost btn-sm">
                    {targetGrpOptions.female.every(t => selectedTargets.includes(t)) ? '전체 해제' : '전체 선택'}
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {targetGrpOptions.female.map((target) => (
                    <label key={target} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${selectedTargets.includes(target) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`, backgroundColor: selectedTargets.includes(target) ? 'hsl(var(--primary) / 0.1)' : 'transparent', transition: 'all 0.2s' }}>
                      <input type="checkbox" checked={selectedTargets.includes(target)} onChange={() => toggleTargetGrp(target)} className="checkbox-custom" />
                      <span style={{ fontSize: '12px' }}>{target.replace('여성 ', '')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="dialog-footer">
              <button onClick={() => setShowTargetDialog(false)} className="btn btn-secondary btn-md">취소</button>
              <button onClick={() => setShowTargetDialog(false)} className="btn btn-primary btn-md">
                확인 ({selectedTargets.length}개 선택)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
