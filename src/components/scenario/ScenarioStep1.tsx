import { useState } from 'react'
import { ArrowRight, ChevronRight, Scale, Target } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { ScenarioFormData } from './types'
import { sampleBrands, targetGrpOptions } from './constants'

interface ScenarioStep1Props {
  formData: ScenarioFormData
  setFormData: (data: ScenarioFormData) => void
  validationActive: boolean
}

export function ScenarioStep1({ formData, setFormData, validationActive }: ScenarioStep1Props) {
  const [brandSearchQuery, setBrandSearchQuery] = useState('')
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
  const [targetGrpDialogOpen, setTargetGrpDialogOpen] = useState(false)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const filteredBrands = sampleBrands.filter(brand =>
    brand.name.toLowerCase().includes(brandSearchQuery.toLowerCase())
  )

  const handleBrandSelect = (brand: typeof sampleBrands[0]) => {
    setFormData({ ...formData, brand: brand.name, industry: brand.industry })
    setBrandDropdownOpen(false)
    setBrandSearchQuery('')
  }

  const toggleTargetGrp = (target: string) => {
    if (formData.targetGrp.includes(target)) {
      setFormData({ ...formData, targetGrp: formData.targetGrp.filter(t => t !== target) })
    } else {
      setFormData({ ...formData, targetGrp: [...formData.targetGrp, target] })
    }
  }

  const selectAllMale = () => {
    const allMale = targetGrpOptions.male
    const hasAllMale = allMale.every(t => formData.targetGrp.includes(t))
    if (hasAllMale) {
      setFormData({ ...formData, targetGrp: formData.targetGrp.filter(t => !allMale.includes(t)) })
    } else {
      const newTargets = [...new Set([...formData.targetGrp, ...allMale])]
      setFormData({ ...formData, targetGrp: newTargets })
    }
  }

  const selectAllFemale = () => {
    const allFemale = targetGrpOptions.female
    const hasAllFemale = allFemale.every(t => formData.targetGrp.includes(t))
    if (hasAllFemale) {
      setFormData({ ...formData, targetGrp: formData.targetGrp.filter(t => !allFemale.includes(t)) })
    } else {
      const newTargets = [...new Set([...formData.targetGrp, ...allFemale])]
      setFormData({ ...formData, targetGrp: newTargets })
    }
  }

  return (
    <div style={{ width: '800px' }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '24px'
      }}>
        기본 정보
      </h2>
      
      {/* 시나리오명 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          시나리오명 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <input
          type="text"
          value={formData.scenarioName}
          onChange={(e) => {
            if (e.target.value.length <= 30) {
              setFormData({ ...formData, scenarioName: e.target.value })
            }
          }}
          placeholder="시나리오 이름을 입력하세요"
          className="input"
          style={{ 
            width: '100%',
            borderColor: validationActive && !formData.scenarioName ? 'hsl(var(--destructive))' : undefined
          }}
          maxLength={30}
        />
        {validationActive && !formData.scenarioName && (
          <div style={{
            fontSize: '11px',
            color: 'hsl(var(--destructive))',
            marginTop: '4px'
          }}>
            시나리오명을 입력해주세요.
          </div>
        )}
        <div style={{ 
          fontSize: '12px', 
          color: 'hsl(var(--muted-foreground))', 
          marginTop: '4px',
          textAlign: 'right'
        }}>
          {formData.scenarioName.length}/30
        </div>
      </div>

      {/* 설명 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          설명
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => {
            if (e.target.value.length <= 200) {
              setFormData({ ...formData, description: e.target.value })
            }
          }}
          placeholder="시나리오에 대한 설명을 입력하세요"
          className="input"
          style={{ 
            width: '100%', 
            minHeight: '80px', 
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
          maxLength={200}
        />
        <div style={{ 
          fontSize: '12px', 
          color: 'hsl(var(--muted-foreground))', 
          marginTop: '4px',
          textAlign: 'right'
        }}>
          {formData.description.length}/200
        </div>
      </div>

      {/* 분석 모듈 선택 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          분석 모듈 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={() => setFormData({ ...formData, moduleType: 'Ratio Finder' })}
            style={{
              padding: '16px',
              border: `1px solid ${formData.moduleType === 'Ratio Finder' ? 'hsl(var(--primary))' : validationActive && !formData.moduleType ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}`,
              borderRadius: '8px',
              backgroundColor: formData.moduleType === 'Ratio Finder' ? 'hsl(var(--primary) / 0.1)' : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'hsl(var(--foreground))'
            }}>
              <Scale size={18} style={{ color: 'hsl(var(--foreground))' }} />
              Ratio Finder
            </div>
            <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
              TVC와 디지털 매체 간 최적 예산 배분 비율 탐색
            </div>
          </button>
          <button
            onClick={() => setFormData({ ...formData, moduleType: 'Reach Predictor' })}
            style={{
              padding: '16px',
              border: `1px solid ${formData.moduleType === 'Reach Predictor' ? 'hsl(var(--primary))' : validationActive && !formData.moduleType ? 'hsl(var(--destructive))' : 'hsl(var(--border))'}`,
              borderRadius: '8px',
              backgroundColor: formData.moduleType === 'Reach Predictor' ? 'hsl(var(--primary) / 0.1)' : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'hsl(var(--foreground))'
            }}>
              <Target size={18} style={{ color: 'hsl(var(--foreground))' }} />
              Reach Predictor
            </div>
            <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
              광고 집행 전후의 통합 및 개별 매체 도달률 예측
            </div>
          </button>
        </div>
        {validationActive && !formData.moduleType && (
          <div style={{
            fontSize: '11px',
            color: 'hsl(var(--destructive))',
            marginTop: '8px'
          }}>
            분석 모듈을 선택해주세요.
          </div>
        )}
      </div>

      {/* 브랜드 + 업종 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          브랜드 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <div style={{
          fontSize: '12px',
          color: 'hsl(var(--muted-foreground))',
          marginBottom: '12px'
        }}>
          업종별 특화 예측 분석 모델로 시나리오를 생성합니다.
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr auto',
          gap: '12px',
          alignItems: 'center',
          position: 'relative'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={formData.brand || brandSearchQuery}
              onChange={(e) => {
                setBrandSearchQuery(e.target.value)
                setFormData({ ...formData, brand: '', industry: '' })
                setBrandDropdownOpen(true)
              }}
              onFocus={() => setBrandDropdownOpen(true)}
              placeholder="브랜드를 검색하세요"
              className="input"
              style={{ 
                width: '100%',
                borderColor: validationActive && !formData.brand ? 'hsl(var(--destructive))' : undefined
              }}
            />
            {brandDropdownOpen && (
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
                {filteredBrands.length > 0 ? (
                  filteredBrands.map((brand, index) => (
                    <button
                      key={index}
                      onClick={() => handleBrandSelect(brand)}
                      className="dropdown-item"
                      style={{ justifyContent: 'space-between' }}
                    >
                      <span>{brand.name}</span>
                      <span style={{ 
                        fontSize: '11px', 
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'hsl(var(--muted))',
                        color: 'hsl(var(--muted-foreground))'
                      }}>
                        {brand.industry}
                      </span>
                    </button>
                  ))
                ) : (
                  <div style={{ padding: '12px', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                    검색 결과가 없습니다
                  </div>
                )}
              </div>
            )}
          </div>
          {validationActive && !formData.brand && (
            <div style={{
              fontSize: '11px',
              color: 'hsl(var(--destructive))',
              marginTop: '4px',
              gridColumn: '1 / -1'
            }}>
              브랜드를 선택해주세요.
            </div>
          )}
          
          {/* 업종 뱃지 */}
          {formData.industry && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: 'hsl(var(--muted))',
              border: '1px solid hsl(var(--border))',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ 
                fontSize: '11px', 
                color: 'hsl(var(--muted-foreground))'
              }}>
                업종
              </span>
              <div style={{
                width: '1px',
                height: '12px',
                backgroundColor: 'hsl(var(--border))'
              }} />
              <span style={{ 
                fontSize: '13px', 
                fontWeight: '500',
                color: 'hsl(var(--foreground))'
              }}>
                {formData.industry}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 캠페인 기간 */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          캠페인 기간 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'end' }}>
          {/* 시작일 */}
          <div>
            <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>
              시작일
            </div>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setStartDateOpen(!startDateOpen)}
                className="input"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderColor: validationActive && !formData.period.start ? 'hsl(var(--destructive))' : undefined
                }}
              >
                <span style={{ 
                  color: formData.period.start ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                }}>
                  {formData.period.start ? new Date(formData.period.start).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '날짜 선택'}
                </span>
              </button>
              {startDateOpen && (
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
                    onClick={() => setStartDateOpen(false)}
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
                      padding: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                    }}
                  >
                    <DayPicker
                      mode="single"
                      selected={formData.period.start ? new Date(formData.period.start) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const dateStr = date.toISOString().split('T')[0]
                          setFormData({ ...formData, period: { ...formData.period, start: dateStr } })
                          setStartDateOpen(false)
                        }
                      }}
                      disabled={(date) => {
                        if (formData.period.end) {
                          return date > new Date(formData.period.end)
                        }
                        return false
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 화살표 */}
          <div style={{ 
            paddingBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ArrowRight size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
          </div>

          {/* 종료일 */}
          <div>
            <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>
              종료일
            </div>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setEndDateOpen(!endDateOpen)}
                className="input"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderColor: validationActive && !formData.period.end ? 'hsl(var(--destructive))' : undefined
                }}
              >
                <span style={{ 
                  color: formData.period.end ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                }}>
                  {formData.period.end ? new Date(formData.period.end).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '날짜 선택'}
                </span>
              </button>
              {endDateOpen && (
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
                    onClick={() => setEndDateOpen(false)}
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
                      padding: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                    }}
                  >
                    <DayPicker
                      mode="single"
                      selected={formData.period.end ? new Date(formData.period.end) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const dateStr = date.toISOString().split('T')[0]
                          setFormData({ ...formData, period: { ...formData.period, end: dateStr } })
                          setEndDateOpen(false)
                        }
                      }}
                      disabled={(date) => {
                        if (formData.period.start) {
                          return date < new Date(formData.period.start)
                        }
                        return false
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {validationActive && (!formData.period.start || !formData.period.end) && (
          <div style={{
            fontSize: '11px',
            color: 'hsl(var(--destructive))',
            marginTop: '8px'
          }}>
            캠페인 시작일과 종료일을 모두 선택해주세요.
          </div>
        )}
      </div>

      {/* 타겟 GRP */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          타겟 GRP <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
        <div style={{
          fontSize: '12px',
          color: 'hsl(var(--muted-foreground))',
          marginBottom: '12px',
          lineHeight: '1.5'
        }}>
          도달률 산출 시 적용할 모수를 설정합니다.<br />
          설정한 타겟 모수는 보고서의 '타겟 GRP'에 적용됩니다.
        </div>
        
        <button
          onClick={() => setTargetGrpDialogOpen(true)}
          className="input"
          style={{
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: validationActive && formData.targetGrp.length === 0 ? 'hsl(var(--destructive))' : undefined
          }}
        >
          <span style={{ color: formData.targetGrp.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
            {formData.targetGrp.length === 24 
              ? '전체' 
              : formData.targetGrp.length > 0 
              ? `${formData.targetGrp.length}개 타겟 선택됨` 
              : '타겟을 선택하세요'}
          </span>
          <ChevronRight size={16} />
        </button>
        {validationActive && formData.targetGrp.length === 0 && (
          <div style={{
            fontSize: '11px',
            color: 'hsl(var(--destructive))',
            marginTop: '4px'
          }}>
            타겟 GRP를 선택해주세요.
          </div>
        )}
      </div>

      {/* 타겟 GRP 다이얼로그 */}
      {targetGrpDialogOpen && (
        <div className="dialog-overlay" onClick={() => setTargetGrpDialogOpen(false)}>
          <div 
            className="dialog-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}
          >
            <div className="dialog-header">
              <h3 className="dialog-title">타겟 GRP 선택</h3>
              <p className="dialog-description">
                도달률 산출에 적용할 타겟 모수를 선택하세요
              </p>
            </div>
            
            <div style={{ padding: '24px' }}>
              {/* 남성 */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid hsl(var(--border))'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>남성</span>
                  <button
                    onClick={selectAllMale}
                    className="btn btn-ghost btn-sm"
                  >
                    {targetGrpOptions.male.every(t => formData.targetGrp.includes(t)) ? '전체 해제' : '전체 선택'}
                  </button>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {targetGrpOptions.male.map((target) => (
                    <label
                      key={target}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: `1px solid ${formData.targetGrp.includes(target) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                        backgroundColor: formData.targetGrp.includes(target) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.targetGrp.includes(target)}
                        onChange={() => toggleTargetGrp(target)}
                        className="checkbox-custom"
                      />
                      <span style={{ fontSize: '12px' }}>{target.replace('남성 ', '')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 여성 */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid hsl(var(--border))'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>여성</span>
                  <button
                    onClick={selectAllFemale}
                    className="btn btn-ghost btn-sm"
                  >
                    {targetGrpOptions.female.every(t => formData.targetGrp.includes(t)) ? '전체 해제' : '전체 선택'}
                  </button>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {targetGrpOptions.female.map((target) => (
                    <label
                      key={target}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: `1px solid ${formData.targetGrp.includes(target) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                        backgroundColor: formData.targetGrp.includes(target) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.targetGrp.includes(target)}
                        onChange={() => toggleTargetGrp(target)}
                        className="checkbox-custom"
                      />
                      <span style={{ fontSize: '12px' }}>{target.replace('여성 ', '')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="dialog-footer">
              <button
                onClick={() => setTargetGrpDialogOpen(false)}
                className="btn btn-secondary btn-md"
              >
                취소
              </button>
              <button
                onClick={() => setTargetGrpDialogOpen(false)}
                className="btn btn-primary btn-md"
              >
                확인 ({formData.targetGrp.length}개 선택)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
