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
      <div className={gender === 'male' ? 'mb-6' : ''}>
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[hsl(var(--border))]">
          <span className="text-[14px] font-semibold">{label}</span>
          <button onClick={() => toggleAllGender(gender)} className="btn btn-ghost btn-sm">
            {allSelected ? '전체 해제' : '전체 선택'}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {targetGrpOptions[gender].map((target) => {
            const isChecked = selectedTarget.includes(target)
            return (
              <label
                key={target}
                className="flex items-center gap-2 cursor-pointer px-[10px] py-2 rounded-md border transition-all duration-200"
                style={{
                  borderColor: isChecked ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                  backgroundColor: isChecked ? 'hsl(var(--primary) / 0.1)' : 'transparent'
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleTarget(target)}
                  className="checkbox-custom"
                />
                <span className="text-[12px]">{target.replace(`${label} `, '')}</span>
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

        <div className="p-6">
          {/* 시나리오명 (자동 생성, 변경 불가) */}
          <div className="mb-5">
            <div className="text-[13px] font-semibold text-[hsl(var(--foreground))] mb-[6px]">시나리오명</div>
            <div className="text-[14px] text-[hsl(var(--foreground))]">{presetName}</div>
          </div>

          {/* 승계 정보: 업종 · 캠페인 기간 (원본 시나리오에서 동일하게 전달) */}
          <div className="flex gap-6 flex-wrap px-[14px] py-3 mb-6 rounded-lg bg-[hsl(var(--muted)/0.4)]">
            <div className="min-w-0">
              <div className="text-[11px] text-[hsl(var(--muted-foreground))] mb-[2px]">업종</div>
              <div className="text-[13px] font-medium text-[hsl(var(--foreground))]">{industry}</div>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[hsl(var(--muted-foreground))] mb-[2px]">캠페인 기간</div>
              <div className="text-[13px] font-medium text-[hsl(var(--foreground))]">{period.start} ~ {period.end}</div>
            </div>
            <div className="flex items-end ml-auto">
              <span className="text-[11px] text-[hsl(var(--muted-foreground))]">원본 시나리오와 동일하게 전달됩니다</span>
            </div>
          </div>

          {/* 동일 슬롯 안내 */}
          <p className="text-[12px] text-[hsl(var(--muted-foreground))] mt-[-12px] mb-6 flex items-center gap-[5px]">
            <Info size={12} style={{ flexShrink: 0 }} />
            생성되는 Reach Caster 시나리오는 현재 Slot 안에 함께 만들어집니다.
          </p>

          {/* 타겟 GRP — 기본 전체 선택, 접힘 요약 + 수정 시 전체 UI 펼침 */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[13px] font-semibold text-[hsl(var(--foreground))]">타겟 GRP</span>
                <span className="text-[12px] text-[hsl(var(--muted-foreground))] ml-2">
                  {selectedTarget.length === allTargets.length ? '전체' : `${selectedTarget.length}개 선택`}
                </span>
              </div>
              <button onClick={() => setTargetEditing(v => !v)} className="btn btn-ghost btn-sm">
                {targetEditing ? '완료' : '수정'}
              </button>
            </div>
            {targetEditing && (
              <div className="mt-4">
                {renderGenderSection('male')}
                {renderGenderSection('female')}
              </div>
            )}
          </div>

          {/* 전달 미리보기 표 (예상 노출 전달 옵션을 표 헤더 세그먼트로 통합) */}
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3 mb-[6px] flex-wrap">
              <div>
                <div className="text-[13px] font-semibold text-[hsl(var(--foreground))]">매체별 전달 내역</div>
                <div className="text-[12px] text-[hsl(var(--muted-foreground))] mt-[2px]">
                  전달 {mapped.length}개 · 미지원 제외 {unmapped.length}개
                </div>
              </div>
              {/* 예상 노출 전달 옵션 세그먼트 */}
              <div className="inline-flex p-[2px] rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] flex-shrink-0">
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

            <div className="border border-[hsl(var(--border))] rounded-lg overflow-hidden">
              {/* 헤더 */}
              <div
                className="grid gap-2 px-3 py-[9px] bg-[hsl(var(--muted)/0.5)] text-[11px] font-semibold text-[hsl(var(--muted-foreground))]"
                style={{ gridTemplateColumns: '1fr 110px 130px' }}
              >
                <div>매체 &gt; 상품</div>
                <div className="text-right">예산</div>
                <div className="text-right">예상 노출</div>
              </div>
              {/* 행 */}
              <div className="max-h-[220px] overflow-y-auto">
                {[...mapped, ...unmapped].map((a, i) => {
                  const excluded = isUnsupported(a)
                  const required = isImpressionRequired(a)
                  const hasImp = (a.impression || 0) > 0
                  const impSent = !excluded && hasImp && (impressionMode === 'all' || (impressionMode === 'required' && required))
                  return (
                    <div
                      key={i}
                      className="grid gap-2 px-3 py-[9px] text-[12px] items-center"
                      style={{
                        gridTemplateColumns: '1fr 110px 130px',
                        borderTop: i === 0 ? 'none' : '1px solid hsl(var(--border))',
                        backgroundColor: excluded ? 'hsl(var(--muted) / 0.25)' : 'transparent'
                      }}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-[6px]">
                          <span
                            className="overflow-hidden text-ellipsis whitespace-nowrap"
                            style={{ color: excluded ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))', textDecoration: excluded ? 'line-through' : 'none' }}
                          >
                            {a.mediaName} &gt; {a.productName}
                          </span>
                          {required && !excluded && (
                            <span className="flex-shrink-0 text-[10px] px-[6px] py-[1px] rounded-full bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]">노출 필수</span>
                          )}
                          {excluded && (
                            <span className="flex-shrink-0 text-[10px] px-[6px] py-[1px] rounded-full bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))] inline-flex items-center gap-[3px]">
                              <AlertTriangle size={9} /> 미지원 제외
                            </span>
                          )}
                        </div>
                      </div>
                      {/* 예산 */}
                      <div className="text-right" style={{ color: excluded ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))' }}>
                        {excluded ? '-' : `${a.budget.toLocaleString()}원`}
                      </div>
                      {/* 예상 노출 */}
                      <div className="text-right">
                        {excluded ? (
                          <span className="text-[hsl(var(--muted-foreground))]">-</span>
                        ) : !hasImp ? (
                          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">노출 없음</span>
                        ) : impSent ? (
                          <span className="inline-flex items-center gap-[3px] justify-end" style={{ color: 'hsl(142 71% 45%)' }}>
                            <Check size={11} /> {a.impression.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-[hsl(var(--muted-foreground)/0.6)]">{a.impression.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* 미지원 제외 안내 */}
            {unmapped.length > 0 && !allUnmapped && (
              <div className="mt-[10px] text-[11px] text-[hsl(var(--muted-foreground))] flex items-start gap-[5px] leading-[1.5]">
                <AlertTriangle size={12} style={{ color: 'hsl(var(--destructive))', flexShrink: 0, marginTop: '1px' }} />
                <span>
                  <strong className="text-[hsl(var(--foreground))] font-semibold">미지원 제외</strong>는 해당 매체·상품이 Reach Caster의 이 업종에서 지원되지 않아 도달 예측 대상이 아니라는 의미입니다. 제외 항목은 전달되지 않으며, 나머지 항목만 예산·노출이 넘어갑니다.
                </span>
              </div>
            )}
            {allUnmapped && (
              <div className="mt-[10px] text-[12px] text-[hsl(var(--destructive))] flex items-start gap-[5px] leading-[1.5]">
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
            className="btn btn-primary btn-md inline-flex items-center gap-[6px]"
            style={{
              opacity: canCreate ? 1 : 0.5,
              cursor: canCreate ? 'pointer' : 'not-allowed'
            }}
          >
            Reach Caster 생성 <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
