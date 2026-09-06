import { useState, useMemo } from 'react'
import { AlertTriangle, ArrowRight, Check, Info } from 'lucide-react'
import { targetGrpOptions } from '../scenario/constants'
import { BOAllocation } from './resultSampleData'

interface BOReachCasterEasyCreateModalProps {
  isOpen: boolean
  onClose: () => void
  /** 최적화 결과 배분 (Reach Caster로 프리필할 매체/상품·예산) */
  allocations: BOAllocation[]
  /** 원본 시나리오 정보 (자동 네이밍·업종·기간 승계 표시용) */
  sourceId: number
  scenarioName: string
  industry: string
  period: { start: string; end: string }
  /** 생성 확정 콜백 (시나리오명 + 타겟 GRP + 프리필 대상 + 예상 노출 전달 모드) */
  onConfirm: (params: {
    scenarioName: string
    targetGrp: string[]
    mappedAllocations: BOAllocation[]
    impressionMode: 'none' | 'required' | 'all'
  }) => void
}

// Reach Caster 미지원(매핑 불일치) 판별 — mock: 특정 상품 패턴을 미지원으로 간주
const isUnsupported = (a: BOAllocation) =>
  a.mediaName === 'Targetpick' || a.productName.includes('디스플레이_방문')

// 예상 노출 입력이 '필수'인 상품 판별 — CPT(보장형/예약형) 상품은 노출 확정 입력이 필요
const isImpressionRequired = (a: BOAllocation) =>
  /_CPT$|_CPT_|예약형|보장형/.test(a.productName)

export function BOReachCasterEasyCreateModal({
  isOpen, onClose, allocations, sourceId, scenarioName, industry, period, onConfirm
}: BOReachCasterEasyCreateModalProps) {
  // 시나리오명 프리셋: (BO-{ID}) {원본명} — 자동 생성, 변경 불가
  const presetName = `(BO-${sourceId}) ${scenarioName}`
  // 타겟 GRP 기본값: 전체 선택
  const allTargets = useMemo(() => [...targetGrpOptions.male, ...targetGrpOptions.female], [])
  const [selectedTarget, setSelectedTarget] = useState<string[]>(allTargets)
  const [targetEditing, setTargetEditing] = useState(false)
  // 노출 포함 전달을 기본값으로
  const [impressionMode, setImpressionMode] = useState<'none' | 'required' | 'all'>('all')

  const { mapped, unmapped } = useMemo(() => {
    const mapped: BOAllocation[] = []
    const unmapped: BOAllocation[] = []
    for (const a of allocations) (isUnsupported(a) ? unmapped : mapped).push(a)
    return { mapped, unmapped }
  }, [allocations])

  // 매핑 가능한 항목 중 예상 노출 필수 상품 수
  const requiredImpressionCount = useMemo(() => mapped.filter(isImpressionRequired).length, [mapped])

  const allUnmapped = mapped.length === 0
  const canCreate = selectedTarget.length > 0 && !allUnmapped

  const toggleTarget = (t: string) => {
    setSelectedTarget(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const toggleAllGender = (gender: 'male' | 'female') => {
    const all = targetGrpOptions[gender]
    const hasAll = all.every(t => selectedTarget.includes(t))
    if (hasAll) setSelectedTarget(prev => prev.filter(t => !all.includes(t)))
    else setSelectedTarget(prev => [...new Set([...prev, ...all])])
  }

  if (!isOpen) return null

  // 성별 타겟 섹션 (Reach Caster 생성 화면 타겟 설정 다이얼로그와 동일 UI)
  const renderGenderSection = (gender: 'male' | 'female') => {
    const label = gender === 'male' ? '남성' : '여성'
    const allSelected = targetGrpOptions[gender].every(t => selectedTarget.includes(t))
    return (
      <div style={{ marginBottom: gender === 'male' ? '24px' : 0 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid hsl(var(--border))'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>{label}</span>
          <button onClick={() => toggleAllGender(gender)} className="btn btn-ghost btn-sm">
            {allSelected ? '전체 해제' : '전체 선택'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {targetGrpOptions[gender].map((target) => {
            const isChecked = selectedTarget.includes(target)
            return (
              <label
                key={target}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                  padding: '8px 10px', borderRadius: '6px',
                  border: `1px solid ${isChecked ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                  backgroundColor: isChecked ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleTarget(target)}
                  className="checkbox-custom"
                />
                <span style={{ fontSize: '12px' }}>{target.replace(`${label} `, '')}</span>
              </label>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog-content dialog-md"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '86vh', overflowY: 'auto' }}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">최적화 예산으로 도달 예측하기</h3>
          <p className="dialog-description">
            최적화 결과의 매체별 예산·예상 노출을 Reach Caster 도달 예측으로 가져갑니다.
          </p>
        </div>

        <div style={{ padding: '24px' }}>
          {/* 시나리오명 (자동 생성, 변경 불가) */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'hsl(var(--foreground))', marginBottom: '6px' }}>시나리오명</div>
            <div style={{ fontSize: '14px', color: 'hsl(var(--foreground))' }}>{presetName}</div>
          </div>

          {/* 승계 정보: 업종 · 캠페인 기간 (원본 시나리오에서 동일하게 전달) */}
          <div style={{
            display: 'flex', gap: '24px', flexWrap: 'wrap',
            padding: '12px 14px', marginBottom: '24px', borderRadius: '8px',
            backgroundColor: 'hsl(var(--muted) / 0.4)'
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '2px' }}>업종</div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--foreground))' }}>{industry}</div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '2px' }}>캠페인 기간</div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--foreground))' }}>{period.start} ~ {period.end}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', marginLeft: 'auto' }}>
              <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>원본 시나리오와 동일하게 전달됩니다</span>
            </div>
          </div>

          {/* 동일 슬롯 안내 */}
          <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', margin: '-12px 0 24px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Info size={12} style={{ flexShrink: 0 }} />
            생성되는 Reach Caster 시나리오는 현재 Slot 안에 함께 만들어집니다.
          </p>

          {/* 타겟 GRP — 기본 전체 선택, 접힘 요약 + 수정 시 전체 UI 펼침 */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'hsl(var(--foreground))' }}>타겟 GRP</span>
                <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginLeft: '8px' }}>
                  {selectedTarget.length === allTargets.length ? '전체' : `${selectedTarget.length}개 선택`}
                </span>
              </div>
              <button onClick={() => setTargetEditing(v => !v)} className="btn btn-ghost btn-sm">
                {targetEditing ? '완료' : '수정'}
              </button>
            </div>
            {targetEditing && (
              <div style={{ marginTop: '16px' }}>
                {renderGenderSection('male')}
                {renderGenderSection('female')}
              </div>
            )}
          </div>

          {/* 전달 미리보기 표 (예상 노출 전달 옵션을 표 헤더 세그먼트로 통합) */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'hsl(var(--foreground))' }}>매체별 전달 내역</div>
                <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginTop: '2px' }}>
                  전달 {mapped.length}개 · 미지원 제외 {unmapped.length}개
                </div>
              </div>
              {/* 예상 노출 전달 옵션 세그먼트 */}
              <div style={{ display: 'inline-flex', padding: '2px', borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--muted) / 0.4)', flexShrink: 0 }}>
                {([
                  { key: 'all' as const, label: '노출 포함' },
                  { key: 'required' as const, label: '노출 필수 상품만', disabled: requiredImpressionCount === 0 },
                  { key: 'none' as const, label: '노출 미포함' }
                ]).map(opt => {
                  const active = impressionMode === opt.key
                  const disabled = 'disabled' in opt && opt.disabled
                  return (
                    <button
                      key={opt.key}
                      onClick={() => { if (!disabled) setImpressionMode(opt.key) }}
                      disabled={disabled}
                      title={disabled ? '노출 입력이 필수인 상품이 없습니다' : undefined}
                      style={{
                        fontSize: '11px', fontWeight: active ? 600 : 400, padding: '5px 12px', borderRadius: '6px',
                        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
                        backgroundColor: active ? 'hsl(var(--card))' : 'transparent',
                        color: disabled ? 'hsl(var(--muted-foreground) / 0.5)' : active ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                        boxShadow: active ? '0 1px 2px rgb(0 0 0 / 0.08)' : 'none',
                        transition: 'all 0.15s'
                      }}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden' }}>
              {/* 헤더 */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 110px 130px', gap: '8px',
                padding: '9px 12px', backgroundColor: 'hsl(var(--muted) / 0.5)',
                fontSize: '11px', fontWeight: '600', color: 'hsl(var(--muted-foreground))'
              }}>
                <div>매체 &gt; 상품</div>
                <div style={{ textAlign: 'right' }}>예산</div>
                <div style={{ textAlign: 'right' }}>예상 노출</div>
              </div>
              {/* 행 */}
              <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                {[...mapped, ...unmapped].map((a, i) => {
                  const excluded = isUnsupported(a)
                  const required = isImpressionRequired(a)
                  const hasImp = (a.impression || 0) > 0
                  const impSent = !excluded && hasImp && (impressionMode === 'all' || (impressionMode === 'required' && required))
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'grid', gridTemplateColumns: '1fr 110px 130px', gap: '8px',
                        padding: '9px 12px', fontSize: '12px', alignItems: 'center',
                        borderTop: i === 0 ? 'none' : '1px solid hsl(var(--border))',
                        backgroundColor: excluded ? 'hsl(var(--muted) / 0.25)' : 'transparent'
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: excluded ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))', textDecoration: excluded ? 'line-through' : 'none' }}>
                            {a.mediaName} &gt; {a.productName}
                          </span>
                          {required && !excluded && (
                            <span style={{ flexShrink: 0, fontSize: '10px', padding: '1px 6px', borderRadius: '999px', backgroundColor: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))' }}>노출 필수</span>
                          )}
                          {excluded && (
                            <span style={{ flexShrink: 0, fontSize: '10px', padding: '1px 6px', borderRadius: '999px', backgroundColor: 'hsl(var(--destructive) / 0.1)', color: 'hsl(var(--destructive))', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <AlertTriangle size={9} /> 미지원 제외
                            </span>
                          )}
                        </div>
                      </div>
                      {/* 예산 */}
                      <div style={{ textAlign: 'right', color: excluded ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))' }}>
                        {excluded ? '-' : `${a.budget.toLocaleString()}원`}
                      </div>
                      {/* 예상 노출 */}
                      <div style={{ textAlign: 'right' }}>
                        {excluded ? (
                          <span style={{ color: 'hsl(var(--muted-foreground))' }}>-</span>
                        ) : !hasImp ? (
                          <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>노출 없음</span>
                        ) : impSent ? (
                          <span style={{ color: 'hsl(142 71% 45%)', display: 'inline-flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
                            <Check size={11} /> {a.impression.toLocaleString()}
                          </span>
                        ) : (
                          <span style={{ color: 'hsl(var(--muted-foreground) / 0.6)' }}>{a.impression.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* 미지원 제외 안내 */}
            {unmapped.length > 0 && !allUnmapped && (
              <div style={{ marginTop: '10px', fontSize: '11px', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'flex-start', gap: '5px', lineHeight: 1.5 }}>
                <AlertTriangle size={12} style={{ color: 'hsl(var(--destructive))', flexShrink: 0, marginTop: '1px' }} />
                <span>
                  <strong style={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}>미지원 제외</strong>는 해당 매체·상품이 Reach Caster의 이 업종에서 지원되지 않아 도달 예측 대상이 아니라는 의미입니다. 제외 항목은 전달되지 않으며, 나머지 항목만 예산·노출이 넘어갑니다.
                </span>
              </div>
            )}
            {allUnmapped && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: 'hsl(var(--destructive))', display: 'flex', alignItems: 'flex-start', gap: '5px', lineHeight: 1.5 }}>
                <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>모든 항목이 Reach Caster의 이 업종에서 지원되지 않아, 전달할 항목이 없습니다. Reach Caster 시나리오를 생성할 수 없습니다.</span>
              </div>
            )}
          </div>
        </div>

        <div className="dialog-footer">
          <button onClick={onClose} className="btn btn-secondary btn-md">취소</button>
          <button
            onClick={() => onConfirm({ scenarioName: presetName, targetGrp: selectedTarget, mappedAllocations: mapped, impressionMode })}
            disabled={!canCreate}
            className="btn btn-primary btn-md"
            style={{
              opacity: canCreate ? 1 : 0.5,
              cursor: canCreate ? 'pointer' : 'not-allowed',
              display: 'inline-flex', alignItems: 'center', gap: '6px'
            }}
          >
            Reach Caster 생성 <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
