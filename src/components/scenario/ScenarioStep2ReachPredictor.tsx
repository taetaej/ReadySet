import { useState } from 'react'
import { X, Calendar, Users, Smartphone, Tv, ArrowRight, ChevronRight, Info, ListPlus } from 'lucide-react'
import { type ReachPredictorMedia } from './types'
import { targetGrpOptions } from './constants'
import { CustomDateRangePicker } from '../reachcaster/CustomDateRangePicker'

interface ScenarioStep2ReachPredictorProps {
  reachPredictorMedia: ReachPredictorMedia[]
  setReachPredictorMedia: (media: ReachPredictorMedia[]) => void
  onOpenMediaDialog: () => void
  validationActive: boolean
  // Step 1 정보
  targetGrp?: string[]
  period?: { start: string; end: string }
  onUpdateGlobalSettings?: (settings: {
    targetGrp?: string[]
    period?: { start: string; end: string }
  }) => void
  // 리치커브 설정
  reachCurve?: {
    budgetCap?: number
    detailSettings?: {
      rangeMin?: number
      rangeMax?: number
      criteriaType?: 'count' | 'amount'
      intervalCount?: number
      intervalAmount?: number
    }
  }
  onUpdateReachCurve?: (reachCurve: {
    budgetCap?: number
    detailSettings?: {
      rangeMin?: number
      rangeMax?: number
      criteriaType?: 'count' | 'amount'
      intervalCount?: number
      intervalAmount?: number
    }
  }) => void
}

export function ScenarioStep2ReachPredictor({
  reachPredictorMedia,
  setReachPredictorMedia,
  onOpenMediaDialog,
  validationActive,
  targetGrp = [],
  period = { start: '', end: '' },
  onUpdateGlobalSettings,
  reachCurve = {},
  onUpdateReachCurve
}: ScenarioStep2ReachPredictorProps) {
  const [showPeriodDialog, setShowPeriodDialog] = useState<string | null>(null)
  const [showTargetDialog, setShowTargetDialog] = useState<string | null>(null)
  const [showGlobalTargetDialog, setShowGlobalTargetDialog] = useState(false)
  const [tempPeriod, setTempPeriod] = useState<{ start: string; end: string } | null>(null)
  const [showSummaryTooltip, setShowSummaryTooltip] = useState(false)
  const [batchToolOpen, setBatchToolOpen] = useState(false)
  
  // 일괄 설정용 로컬 state (스텝1 값으로 초기화, 이후 독립적)
  const [localPeriod, setLocalPeriod] = useState<{ start: string; end: string }>(period)
  const [localTargetGrp, setLocalTargetGrp] = useState<string[]>(targetGrp)
  
  // 매체 삭제
  const handleRemoveMedia = (id: string) => {
    setReachPredictorMedia(reachPredictorMedia.filter(m => m.id !== id))
  }

  // 예산 변경
  const handleBudgetChange = (id: string, value: string) => {
    const numValue = value.replace(/,/g, '')
    if (numValue === '' || /^\d+$/.test(numValue)) {
      setReachPredictorMedia(
        reachPredictorMedia.map(m =>
          m.id === id ? { ...m, budget: numValue } : m
        )
      )
    }
  }

  // 노출 변경
  const handleImpressionsChange = (id: string, value: string) => {
    const numValue = value.replace(/,/g, '')
    if (numValue === '' || /^\d+$/.test(numValue)) {
      setReachPredictorMedia(
        reachPredictorMedia.map(m =>
          m.id === id ? { ...m, impressions: numValue } : m
        )
      )
    }
  }

  // CPM 자동 계산 (소수점 첫째자리에서 반올림)
  const calculateCPM = (budget: string, impressions: string): string => {
    const b = parseInt(budget) || 0
    const i = parseInt(impressions) || 0
    if (b > 0 && i > 0) {
      return Math.round((b / i) * 1000).toString()
    }
    return '-'
  }

  // 총 예산 계산
  const calculatedTotalBudget = reachPredictorMedia.reduce((sum, m) => {
    return sum + (parseInt(m.budget) || 0)
  }, 0)

  // 총 예상 노출 계산
  const calculatedTotalImpressions = reachPredictorMedia.reduce((sum, m) => {
    return sum + (parseInt(m.impressions) || 0)
  }, 0)

  // 합계 CPM 계산
  const calculatedTotalCPM = calculatedTotalBudget > 0 && calculatedTotalImpressions > 0
    ? Math.round((calculatedTotalBudget / calculatedTotalImpressions) * 1000)
    : 0

  // 개별 기간 설정
  const handlePeriodChange = (id: string, newPeriod: { start: string; end: string }) => {
    setReachPredictorMedia(
      reachPredictorMedia.map(m =>
        m.id === id ? { ...m, customPeriod: newPeriod } : m
      )
    )
    setShowPeriodDialog(null)
  }

  // 개별 타겟 설정
  const handleTargetChange = (id: string, newTarget: string[]) => {
    setReachPredictorMedia(
      reachPredictorMedia.map(m =>
        m.id === id ? { ...m, customTarget: newTarget } : m
      )
    )
  }

  // 전역 기간 일괄 적용 (DIGITAL만)
  const applyGlobalPeriod = () => {
    setReachPredictorMedia(
      reachPredictorMedia.map(m => ({
        ...m,
        customPeriod: m.category === 'DIGITAL' ? { ...localPeriod } : m.customPeriod
      }))
    )
  }

  // 전역 타겟 일괄 적용 (DIGITAL만)
  const applyGlobalTarget = () => {
    setReachPredictorMedia(
      reachPredictorMedia.map(m => ({
        ...m,
        customTarget: m.category === 'DIGITAL' ? [...localTargetGrp] : m.customTarget
      }))
    )
  }

  return (
    <div style={{ width: '800px' }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '24px'
      }}>
        상세 설정 - Reach Predictor
      </h2>

      {/* 분석 대상 매체 설정 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <label style={{
            fontSize: '14px',
            fontWeight: '500'
          }}>
            분석 대상 매체 설정 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
          </label>
        </div>

        {/* 매체 추가 버튼 */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={onOpenMediaDialog}
            className="btn btn-primary btn-md"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ListPlus size={16} />
            매체 · 상품(채널) 추가
          </button>
        </div>
      </div>

      {/* 매체 설정 테이블 */}
      {reachPredictorMedia.length > 0 ? (
        <div style={{
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          {/* 테이블 상단 바 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 16px',
            backgroundColor: 'hsl(var(--muted) / 0.3)',
            borderBottom: '1px solid hsl(var(--border))'
          }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--foreground))' }}>
              {reachPredictorMedia.length}개 광고상품(채널)
            </span>
            <button
              onClick={() => setBatchToolOpen(!batchToolOpen)}
              className="btn btn-ghost btn-sm"
              style={{
                fontSize: '12px',
                padding: '4px 10px',
                height: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              캠페인 기간 · 타겟 일괄 설정 (DIGITAL 전용)
              <ChevronRight 
                size={14} 
                style={{ 
                  transform: batchToolOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} 
              />
            </button>
          </div>

          {/* 일괄 설정 패널 (아코디언) */}
          {batchToolOpen && (
            <div style={{
              padding: '16px',
              borderBottom: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--muted) / 0.1)'
            }}>
              <div style={{
                fontSize: '12px',
                color: 'hsl(var(--muted-foreground))',
                marginBottom: '12px'
              }}>
                DIGITAL 광고상품에만 적용됩니다. TVC는 스텝1의 설정값이 자동 적용됩니다.
              </div>
              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start'
              }}>
                {/* 캠페인 기간 */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>캠페인 기간</span>
                    <button
                      onClick={applyGlobalPeriod}
                      className="btn btn-ghost"
                      style={{ 
                        fontSize: '11px',
                        padding: '4px 8px',
                        height: 'auto'
                      }}
                    >
                      일괄 적용
                    </button>
                  </div>
                  <CustomDateRangePicker
                    value={localPeriod}
                    onChange={(range) => setLocalPeriod(range)}
                  />
                </div>

                {/* 타겟 설정 */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>타겟 설정</span>
                    <button
                      onClick={applyGlobalTarget}
                      className="btn btn-ghost"
                      style={{ 
                        fontSize: '11px',
                        padding: '4px 8px',
                        height: 'auto'
                      }}
                    >
                      일괄 적용
                    </button>
                  </div>
                  <button
                    onClick={() => setShowGlobalTargetDialog(true)}
                    className="input"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      minHeight: '36px'
                    }}
                  >
                    <span style={{ 
                      color: localTargetGrp.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                      fontSize: '13px'
                    }}>
                      {localTargetGrp.length === 24 
                        ? '전체' 
                        : localTargetGrp.length > 0 
                        ? `${localTargetGrp.length}개 타겟 선택됨` 
                        : '타겟을 선택하세요'}
                    </span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 테이블 헤더 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 24px 240px 130px 130px 100px 1fr',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'hsl(var(--muted) / 0.5)',
            borderBottom: '1px solid hsl(var(--border))',
            fontSize: '12px',
            fontWeight: '600',
            color: 'hsl(var(--muted-foreground))'
          }}>
            <div></div>
            <div></div>
            <div>매체 / 상품</div>
            <div>확정 예산 (원) *</div>
            <div>예상 노출</div>
            <div>CPM (원)</div>
            <div></div>
          </div>

          {/* 테이블 바디 */}
          <div>
            {reachPredictorMedia.map((media, index) => (
              <div
                key={media.id}
                style={{
                  borderBottom: index < reachPredictorMedia.length - 1 ? '1px solid hsl(var(--border))' : 'none'
                }}
              >
                {/* 첫 번째 줄: 기본 정보 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 24px 240px 130px 130px 100px 1fr',
                  gap: '12px',
                  padding: '12px 16px 8px 16px',
                  alignItems: 'center'
                }}>
                  {/* 카테고리 아이콘 */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}>
                    {media.category === 'DIGITAL' ? (
                      <Smartphone size={18} style={{ color: 'hsl(var(--primary))' }} />
                    ) : (
                      <Tv size={18} style={{ color: 'hsl(var(--accent-foreground))' }} />
                    )}
                    <span style={{
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: media.category === 'DIGITAL' ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--accent) / 0.1)',
                      color: media.category === 'DIGITAL' ? 'hsl(var(--primary))' : 'hsl(var(--accent-foreground))',
                      fontWeight: '600'
                    }}>
                      {media.category}
                    </span>
                  </div>

                  {/* 간격 */}
                  <div></div>

                  {/* 매체 / 상품 */}
                  <div style={{ fontSize: '13px' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      marginBottom: '4px',
                      color: 'hsl(var(--foreground))'
                    }}>
                      {media.mediaName}
                    </div>
                    {media.productName && (
                      <div style={{
                        fontSize: '12px',
                        color: 'hsl(var(--foreground))',
                        fontWeight: '500'
                      }}>
                        {media.productName}
                      </div>
                    )}
                  </div>

                  {/* 확정 예산 */}
                  <div>
                    <input
                      type="text"
                      value={media.budget ? parseInt(media.budget).toLocaleString('ko-KR') : ''}
                      onChange={(e) => handleBudgetChange(media.id, e.target.value)}
                      placeholder="0"
                      className="input"
                      style={{
                        width: '100%',
                        textAlign: 'right',
                        padding: '6px 8px',
                        fontSize: '13px',
                        borderColor: validationActive && !media.budget ? 'hsl(var(--destructive))' : undefined
                      }}
                    />
                  </div>

                  {/* 예상 노출 */}
                  <div>
                    <input
                      type="text"
                      value={media.impressions ? parseInt(media.impressions).toLocaleString('ko-KR') : ''}
                      onChange={(e) => handleImpressionsChange(media.id, e.target.value)}
                      placeholder={media.type === 'unlinked' || media.mediaName === 'NAVER 보장형 DA' || media.mediaName === 'NAVER 성과형 DA' ? '필수' : '선택'}
                      className="input"
                      style={{
                        width: '100%',
                        textAlign: 'right',
                        padding: '6px 8px',
                        fontSize: '13px',
                        borderColor: validationActive && (media.type === 'unlinked' || media.mediaName === 'NAVER 보장형 DA' || media.mediaName === 'NAVER 성과형 DA') && !media.impressions ? 'hsl(var(--destructive))' : undefined
                      }}
                    />
                  </div>

                  {/* CPM */}
                  <div style={{
                    fontSize: '13px',
                    textAlign: 'right',
                    color: 'hsl(var(--muted-foreground))'
                  }}>
                    {calculateCPM(media.budget, media.impressions)}
                  </div>

                  {/* 삭제 버튼 (우측 정렬) */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleRemoveMedia(media.id)}
                      style={{
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'hsl(var(--muted-foreground))',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'hsl(var(--destructive) / 0.1)'
                        e.currentTarget.style.color = 'hsl(var(--destructive))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'hsl(var(--muted-foreground))'
                      }}
                      title="매체 제거"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* 두 번째 줄: 캠페인 기간 & 타겟팅 (DIGITAL만) */}
                {media.category === 'DIGITAL' && (
                  <div style={{
                    padding: '0 16px 12px 16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '11px',
                      color: 'hsl(var(--muted-foreground))',
                      marginLeft: '88px'
                    }}>
                      {/* 캠페인 기간 */}
                      <button
                        onClick={() => setShowPeriodDialog(media.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'none',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          color: media.customPeriod ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                        title="클릭하여 기간 설정"
                      >
                        <Calendar size={12} />
                        <span style={{ fontWeight: media.customPeriod ? '500' : '400' }}>
                          {media.customPeriod ? (
                            `${media.customPeriod.start.slice(5)} ~ ${media.customPeriod.end.slice(5)}`
                          ) : (
                            '전역 설정'
                          )}
                        </span>
                      </button>

                      {/* 타겟팅 */}
                      <button
                        onClick={() => setShowTargetDialog(media.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'none',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          color: media.customTarget ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                        title="클릭하여 타겟 설정"
                      >
                        <Users size={12} />
                        <span style={{ fontWeight: media.customTarget ? '500' : '400' }}>
                          {media.customTarget && media.customTarget.length > 0 ? (
                            media.customTarget.length === 24 ? '전체' : `${media.customTarget.length}개 선택`
                          ) : (
                            '전역 설정'
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 요약 행 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 24px 240px 130px 130px 100px 1fr',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'hsl(var(--muted) / 0.3)',
            borderTop: '1px solid hsl(var(--border))',
            fontSize: '13px',
            fontWeight: '600',
            alignItems: 'center'
          }}>
            <div></div>
            <div></div>
            <div style={{ 
              color: 'hsl(var(--muted-foreground))',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              position: 'relative'
            }}>
              <span>요약</span>
              <div
                onMouseEnter={() => setShowSummaryTooltip(true)}
                onMouseLeave={() => setShowSummaryTooltip(false)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'help',
                  position: 'relative'
                }}
              >
                <Info size={14} style={{ color: 'hsl(var(--muted-foreground))' }} />
                {showSummaryTooltip && (
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '8px',
                    padding: '8px 12px',
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    zIndex: 1000,
                    minWidth: '200px',
                    fontSize: '11px',
                    fontWeight: '400',
                    color: 'hsl(var(--foreground))',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none'
                  }}>
                    * 입력된 값을 기준으로 계산된 결과입니다
                  </div>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {calculatedTotalBudget.toLocaleString('ko-KR')}
            </div>
            <div style={{ textAlign: 'right' }}>
              {calculatedTotalImpressions.toLocaleString('ko-KR')}
            </div>
            <div style={{ textAlign: 'right', color: 'hsl(var(--muted-foreground))' }}>
              {calculatedTotalCPM > 0 ? calculatedTotalCPM.toLocaleString('ko-KR') : '-'}
            </div>
            <div></div>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '48px 40px',
          textAlign: 'center',
          border: '1px dashed hsl(var(--border))',
          borderRadius: '8px',
          color: 'hsl(var(--muted-foreground))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <ListPlus size={32} style={{ opacity: 0.5 }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              분석할 매체와 상품(채널)을 추가해주세요
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              '매체 · 상품(채널) 추가' 버튼을 클릭하여 시작하세요
            </div>
          </div>
        </div>
      )}

      {/* 유효성 검사 메시지 */}
      {validationActive && reachPredictorMedia.length === 0 && (
        <div style={{
          fontSize: '12px',
          color: 'hsl(var(--destructive))',
          marginTop: '8px'
        }}>
          최소 1개 이상의 매체를 추가해주세요.
        </div>
      )}

      {/* 리치커브 설정 */}
      <div style={{ marginTop: '40px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '16px'
        }}>
          리치커브 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>

        {/* 구간 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            구간
          </label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* 최소값 */}
            <input
              type="text"
              value={reachCurve.detailSettings?.rangeMin ? reachCurve.detailSettings.rangeMin.toLocaleString('ko-KR') : ''}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '')
                if (value === '' || /^\d+$/.test(value)) {
                  onUpdateReachCurve?.({
                    ...reachCurve,
                    detailSettings: {
                      ...reachCurve.detailSettings,
                      rangeMin: value === '' ? undefined : parseInt(value)
                    }
                  })
                }
              }}
              placeholder="최소값"
              className="input"
              style={{ 
                width: '140px', 
                fontSize: '13px',
                borderColor: validationActive && !reachCurve.detailSettings?.rangeMin ? 'hsl(var(--destructive))' : undefined
              }}
            />
            <span style={{ 
              fontSize: '13px', 
              color: 'hsl(var(--muted-foreground))',
              whiteSpace: 'nowrap'
            }}>
              원
            </span>
            
            {/* 화살표 */}
            <ArrowRight size={14} style={{ color: 'hsl(var(--muted-foreground))', margin: '0 4px' }} />
            
            {/* 최대값 */}
            <input
              type="text"
              value={reachCurve.detailSettings?.rangeMax ? reachCurve.detailSettings.rangeMax.toLocaleString('ko-KR') : ''}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '')
                if (value === '' || /^\d+$/.test(value)) {
                  onUpdateReachCurve?.({
                    ...reachCurve,
                    detailSettings: {
                      ...reachCurve.detailSettings,
                      rangeMax: value === '' ? undefined : parseInt(value)
                    }
                  })
                }
              }}
              placeholder="최대값"
              className="input"
              style={{ 
                width: '140px', 
                fontSize: '13px',
                borderColor: validationActive && !reachCurve.detailSettings?.rangeMax ? 'hsl(var(--destructive))' : undefined
              }}
            />
            <span style={{ 
              fontSize: '13px', 
              color: 'hsl(var(--muted-foreground))',
              whiteSpace: 'nowrap'
            }}>
              원
            </span>
          </div>
          {validationActive && (!reachCurve.detailSettings?.rangeMin || !reachCurve.detailSettings?.rangeMax) && (
            <div style={{
              fontSize: '11px',
              color: 'hsl(var(--destructive))',
              marginTop: '4px'
            }}>
              구간 최소값과 최대값을 입력해주세요.
            </div>
          )}
        </div>

        {/* 리치커브 기준 설정 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            리치커브 기준 설정
          </label>
          <div style={{ 
            display: 'flex', 
            gap: '12px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              cursor: 'pointer',
              padding: '12px',
              border: `1px solid ${reachCurve.detailSettings?.criteriaType === 'count' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
              borderRadius: '6px',
              backgroundColor: reachCurve.detailSettings?.criteriaType === 'count' ? 'hsl(var(--primary) / 0.1)' : 'transparent',
              flex: 1,
              transition: 'all 0.2s'
            }}>
              <input
                type="radio"
                name="criteriaType"
                checked={reachCurve.detailSettings?.criteriaType === 'count'}
                onChange={() => {
                  onUpdateReachCurve?.({
                    ...reachCurve,
                    detailSettings: {
                      ...reachCurve.detailSettings,
                      criteriaType: 'count',
                      intervalAmount: undefined,
                      intervalCount: reachCurve.detailSettings?.intervalCount || 10
                    }
                  })
                }}
                className="radio-custom"
                style={{ marginTop: '2px' }}
              />
              <div style={{ fontSize: '13px', fontWeight: '500' }}>
                구간 수 기준
              </div>
            </label>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              cursor: 'pointer',
              padding: '12px',
              border: `1px solid ${reachCurve.detailSettings?.criteriaType === 'amount' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
              borderRadius: '6px',
              backgroundColor: reachCurve.detailSettings?.criteriaType === 'amount' ? 'hsl(var(--primary) / 0.1)' : 'transparent',
              flex: 1,
              transition: 'all 0.2s'
            }}>
              <input
                type="radio"
                name="criteriaType"
                checked={reachCurve.detailSettings?.criteriaType === 'amount'}
                onChange={() => {
                  onUpdateReachCurve?.({
                    ...reachCurve,
                    detailSettings: {
                      ...reachCurve.detailSettings,
                      criteriaType: 'amount',
                      intervalCount: undefined
                    }
                  })
                }}
                className="radio-custom"
                style={{ marginTop: '2px' }}
              />
              <div style={{ fontSize: '13px', fontWeight: '500' }}>
                구간별 금액 기준
              </div>
            </label>
          </div>
        </div>

        {/* 구간 수 기준 입력 */}
        {reachCurve.detailSettings?.criteriaType === 'count' && (
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '12px'
            }}>
              구간 수 (2~20)
            </label>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={reachCurve.detailSettings?.intervalCount || 10}
                    onChange={(e) => {
                      onUpdateReachCurve?.({
                        ...reachCurve,
                        detailSettings: {
                          ...reachCurve.detailSettings,
                          intervalCount: parseInt(e.target.value)
                        }
                      })
                    }}
                    className="slider-custom"
                    style={{ 
                      background: `linear-gradient(to right, hsl(var(--foreground)) 0%, hsl(var(--foreground)) ${((reachCurve.detailSettings?.intervalCount || 10) - 2) / 18 * 100}%, hsl(var(--muted)) ${((reachCurve.detailSettings?.intervalCount || 10) - 2) / 18 * 100}%, hsl(var(--muted)) 100%)`
                    }}
                  />
                </div>
                <span style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  minWidth: '50px',
                  textAlign: 'right',
                  color: 'hsl(var(--primary))'
                }}>
                  {reachCurve.detailSettings?.intervalCount || 10}개
                </span>
              </div>
              {/* 구간별 금액 표시 */}
              <div style={{
                fontSize: '12px',
                color: 'hsl(var(--muted-foreground))',
                paddingLeft: '4px'
              }}>
                {(() => {
                  const min = reachCurve.detailSettings?.rangeMin || 0
                  const max = reachCurve.detailSettings?.rangeMax || 0
                  const count = reachCurve.detailSettings?.intervalCount || 10
                  
                  if (min > 0 && max > 0 && max > min && count > 0) {
                    const amount = Math.ceil((max - min) / count)
                    return `구간별 금액: ${amount.toLocaleString('ko-KR')} 원`
                  }
                  return '구간별 금액: —'
                })()}
              </div>
            </div>
          </div>
        )}

        {/* 구간별 금액 기준 입력 */}
        {reachCurve.detailSettings?.criteriaType === 'amount' && (
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              구간별 금액 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
            </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={reachCurve.detailSettings?.intervalAmount ? reachCurve.detailSettings.intervalAmount.toLocaleString('ko-KR') : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '')
                      if (value === '' || /^\d+$/.test(value)) {
                        onUpdateReachCurve?.({
                          ...reachCurve,
                          detailSettings: {
                            ...reachCurve.detailSettings,
                            intervalAmount: value === '' ? undefined : parseInt(value)
                          }
                        })
                      }
                    }}
                    placeholder="금액 입력"
                    className="input"
                    style={{ 
                      width: '140px', 
                      fontSize: '13px',
                      borderColor: validationActive && reachCurve.detailSettings?.criteriaType === 'amount' && !reachCurve.detailSettings?.intervalAmount ? 'hsl(var(--destructive))' : undefined
                    }}
                  />
                  <span style={{ 
                    fontSize: '13px', 
                    color: 'hsl(var(--muted-foreground))',
                    whiteSpace: 'nowrap'
                  }}>
                    원
                  </span>
                </div>
                {/* 구간 수 표시 */}
                <div style={{
                  fontSize: '12px',
                  paddingLeft: '4px'
                }}>
                  {(() => {
                    const min = reachCurve.detailSettings?.rangeMin || 0
                    const max = reachCurve.detailSettings?.rangeMax || 0
                    const amount = reachCurve.detailSettings?.intervalAmount || 0
                    
                    if (min > 0 && max > 0 && amount > 0 && max > min) {
                      const count = Math.ceil((max - min) / amount)
                      if (count > 20) {
                        return <span style={{ color: 'hsl(var(--destructive))', fontWeight: '500' }}>구간 수: {count}개 (최대 20개 초과)</span>
                      }
                      return <span style={{ color: 'hsl(var(--muted-foreground))' }}>구간 수: {count}개</span>
                    }
                    return <span style={{ color: 'hsl(var(--muted-foreground))' }}>구간 수: —</span>
                  })()}
                </div>
                {validationActive && reachCurve.detailSettings?.criteriaType === 'amount' && !reachCurve.detailSettings?.intervalAmount && (
                  <div style={{
                    fontSize: '11px',
                    color: 'hsl(var(--destructive))',
                    paddingLeft: '4px'
                  }}>
                    구간별 금액을 입력해주세요.
                  </div>
                )}
              </div>
            </div>
          )}
      </div>

      {/* 기간 설정 다이얼로그 */}
      {showPeriodDialog && (
        <div className="dialog-overlay" onClick={() => {
          setShowPeriodDialog(null)
          setTempPeriod(null)
        }}>
          <div className="dialog-content dialog-sm" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">캠페인 기간 설정</h3>
              <p className="dialog-description">
                이 매체에 적용할 캠페인 기간을 설정하세요
              </p>
            </div>
            <div style={{ padding: '24px' }}>
              <CustomDateRangePicker
                value={{
                  start: tempPeriod?.start || reachPredictorMedia.find(m => m.id === showPeriodDialog)?.customPeriod?.start || period.start,
                  end: tempPeriod?.end || reachPredictorMedia.find(m => m.id === showPeriodDialog)?.customPeriod?.end || period.end
                }}
                onChange={(range) => setTempPeriod(range)}
              />
            </div>
            <div className="dialog-footer">
              <button 
                onClick={() => {
                  setShowPeriodDialog(null)
                  setTempPeriod(null)
                }} 
                className="btn btn-secondary btn-md"
              >
                취소
              </button>
              <button 
                onClick={() => {
                  if (tempPeriod && showPeriodDialog) {
                    handlePeriodChange(showPeriodDialog, tempPeriod)
                  }
                  setShowPeriodDialog(null)
                  setTempPeriod(null)
                }} 
                className="btn btn-primary btn-md"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 전역 타겟 설정 다이얼로그 */}
      {showGlobalTargetDialog && (
        <div className="dialog-overlay" onClick={() => setShowGlobalTargetDialog(false)}>
          <div className="dialog-content dialog-md" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
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
                    onClick={() => {
                      const allMale = targetGrpOptions.male
                      const hasAllMale = allMale.every(t => localTargetGrp.includes(t))
                      
                      if (hasAllMale) {
                        setLocalTargetGrp(localTargetGrp.filter(t => !allMale.includes(t)))
                      } else {
                        setLocalTargetGrp([...new Set([...localTargetGrp, ...allMale])])
                      }
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    {targetGrpOptions.male.every(t => localTargetGrp.includes(t)) ? '전체 해제' : '전체 선택'}
                  </button>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {targetGrpOptions.male.map((target) => {
                    const isChecked = localTargetGrp.includes(target)
                    
                    return (
                      <label
                        key={target}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: `1px solid ${isChecked ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                          backgroundColor: isChecked ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setLocalTargetGrp(localTargetGrp.filter(t => t !== target))
                            } else {
                              setLocalTargetGrp([...localTargetGrp, target])
                            }
                          }}
                          className="checkbox-custom"
                        />
                        <span style={{ fontSize: '12px' }}>{target.replace('남성 ', '')}</span>
                      </label>
                    )
                  })}
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
                    onClick={() => {
                      const allFemale = targetGrpOptions.female
                      const hasAllFemale = allFemale.every(t => localTargetGrp.includes(t))
                      
                      if (hasAllFemale) {
                        setLocalTargetGrp(localTargetGrp.filter(t => !allFemale.includes(t)))
                      } else {
                        setLocalTargetGrp([...new Set([...localTargetGrp, ...allFemale])])
                      }
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    {targetGrpOptions.female.every(t => localTargetGrp.includes(t)) ? '전체 해제' : '전체 선택'}
                  </button>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {targetGrpOptions.female.map((target) => {
                    const isChecked = localTargetGrp.includes(target)
                    
                    return (
                      <label
                        key={target}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: `1px solid ${isChecked ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                          backgroundColor: isChecked ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setLocalTargetGrp(localTargetGrp.filter(t => t !== target))
                            } else {
                              setLocalTargetGrp([...localTargetGrp, target])
                            }
                          }}
                          className="checkbox-custom"
                        />
                        <span style={{ fontSize: '12px' }}>{target.replace('여성 ', '')}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="dialog-footer">
              <button onClick={() => setShowGlobalTargetDialog(false)} className="btn btn-secondary btn-md">
                취소
              </button>
              <button onClick={() => setShowGlobalTargetDialog(false)} className="btn btn-primary btn-md">
                확인 ({localTargetGrp.length}개 선택)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 타겟팅 설정 다이얼로그 */}
      {showTargetDialog && (
        <div className="dialog-overlay" onClick={() => setShowTargetDialog(null)}>
          <div className="dialog-content dialog-md" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="dialog-header">
              <h3 className="dialog-title">타겟팅 설정</h3>
              <p className="dialog-description">
                이 매체에 적용할 타겟 그룹을 선택하세요
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
                    onClick={() => {
                      const media = reachPredictorMedia.find(m => m.id === showTargetDialog)
                      const currentTargets = media?.customTarget || targetGrp
                      const allMale = targetGrpOptions.male
                      const hasAllMale = allMale.every(t => currentTargets.includes(t))
                      
                      if (hasAllMale) {
                        handleTargetChange(showTargetDialog, currentTargets.filter(t => !allMale.includes(t)))
                      } else {
                        handleTargetChange(showTargetDialog, [...new Set([...currentTargets, ...allMale])])
                      }
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    {(() => {
                      const media = reachPredictorMedia.find(m => m.id === showTargetDialog)
                      const currentTargets = media?.customTarget || targetGrp
                      return targetGrpOptions.male.every(t => currentTargets.includes(t)) ? '전체 해제' : '전체 선택'
                    })()}
                  </button>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {targetGrpOptions.male.map((target) => {
                    const media = reachPredictorMedia.find(m => m.id === showTargetDialog)
                    const currentTargets = media?.customTarget || targetGrp
                    const isChecked = currentTargets.includes(target)
                    
                    return (
                      <label
                        key={target}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: `1px solid ${isChecked ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                          backgroundColor: isChecked ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              handleTargetChange(showTargetDialog, currentTargets.filter(t => t !== target))
                            } else {
                              handleTargetChange(showTargetDialog, [...currentTargets, target])
                            }
                          }}
                          className="checkbox-custom"
                        />
                        <span style={{ fontSize: '12px' }}>{target.replace('남성 ', '')}</span>
                      </label>
                    )
                  })}
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
                    onClick={() => {
                      const media = reachPredictorMedia.find(m => m.id === showTargetDialog)
                      const currentTargets = media?.customTarget || targetGrp
                      const allFemale = targetGrpOptions.female
                      const hasAllFemale = allFemale.every(t => currentTargets.includes(t))
                      
                      if (hasAllFemale) {
                        handleTargetChange(showTargetDialog, currentTargets.filter(t => !allFemale.includes(t)))
                      } else {
                        handleTargetChange(showTargetDialog, [...new Set([...currentTargets, ...allFemale])])
                      }
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    {(() => {
                      const media = reachPredictorMedia.find(m => m.id === showTargetDialog)
                      const currentTargets = media?.customTarget || targetGrp
                      return targetGrpOptions.female.every(t => currentTargets.includes(t)) ? '전체 해제' : '전체 선택'
                    })()}
                  </button>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {targetGrpOptions.female.map((target) => {
                    const media = reachPredictorMedia.find(m => m.id === showTargetDialog)
                    const currentTargets = media?.customTarget || targetGrp
                    const isChecked = currentTargets.includes(target)
                    
                    return (
                      <label
                        key={target}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: `1px solid ${isChecked ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                          backgroundColor: isChecked ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              handleTargetChange(showTargetDialog, currentTargets.filter(t => t !== target))
                            } else {
                              handleTargetChange(showTargetDialog, [...currentTargets, target])
                            }
                          }}
                          className="checkbox-custom"
                        />
                        <span style={{ fontSize: '12px' }}>{target.replace('여성 ', '')}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="dialog-footer">
              <button onClick={() => setShowTargetDialog(null)} className="btn btn-secondary btn-md">
                취소
              </button>
              <button onClick={() => setShowTargetDialog(null)} className="btn btn-primary btn-md">
                확인 ({(() => {
                  const media = reachPredictorMedia.find(m => m.id === showTargetDialog)
                  return (media?.customTarget || targetGrp).length
                })()}개 선택)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
