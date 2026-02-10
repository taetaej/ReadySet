import { useState } from 'react'
import { X, Calendar, Users, Monitor, Tv, ArrowRight, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { type ReachPredictorMedia } from './types'
import { targetGrpOptions } from './constants'

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
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  const [individualStartDateOpen, setIndividualStartDateOpen] = useState<string | null>(null)
  const [individualEndDateOpen, setIndividualEndDateOpen] = useState<string | null>(null)
  const [tempPeriod, setTempPeriod] = useState<{ start: string; end: string } | null>(null)
  
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

  // CPM 자동 계산
  const calculateCPM = (budget: string, impressions: string): string => {
    const b = parseInt(budget) || 0
    const i = parseInt(impressions) || 0
    if (b > 0 && i > 0) {
      return ((b / i) * 1000).toFixed(2)
    }
    return '-'
  }

  // 총 예산 계산
  const calculatedTotalBudget = reachPredictorMedia.reduce((sum, m) => {
    return sum + (parseInt(m.budget) || 0)
  }, 0)

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

  // 전역 기간 일괄 적용
  const applyGlobalPeriod = () => {
    setReachPredictorMedia(
      reachPredictorMedia.map(m => ({
        ...m,
        customPeriod: undefined
      }))
    )
  }

  // 전역 타겟 일괄 적용
  const applyGlobalTarget = () => {
    setReachPredictorMedia(
      reachPredictorMedia.map(m => ({
        ...m,
        customTarget: undefined
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
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px'
        }}>
          분석 대상 매체 설정 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>

        {/* 전역 설정 */}
        <div style={{
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          backgroundColor: 'hsl(var(--muted) / 0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            {/* 캠페인 기간 */}
            <div>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'end' }}>
                {/* 시작일 */}
                <div>
                  <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}>
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
                        fontSize: '12px',
                        padding: '6px 8px',
                        minHeight: '36px'
                      }}
                    >
                      <span style={{ 
                        color: period.start ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {period.start ? new Date(period.start).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '날짜 선택'}
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
                            selected={period.start ? new Date(period.start) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const dateStr = date.toISOString().split('T')[0]
                                onUpdateGlobalSettings?.({ period: { ...period, start: dateStr } })
                                setStartDateOpen(false)
                              }
                            }}
                            disabled={(date) => {
                              if (period.end) {
                                return date > new Date(period.end)
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
                  paddingBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ArrowRight size={14} style={{ color: 'hsl(var(--muted-foreground))' }} />
                </div>

                {/* 종료일 */}
                <div>
                  <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}>
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
                        fontSize: '12px',
                        padding: '6px 8px',
                        minHeight: '36px'
                      }}
                    >
                      <span style={{ 
                        color: period.end ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {period.end ? new Date(period.end).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '날짜 선택'}
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
                            selected={period.end ? new Date(period.end) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const dateStr = date.toISOString().split('T')[0]
                                onUpdateGlobalSettings?.({ period: { ...period, end: dateStr } })
                                setEndDateOpen(false)
                              }
                            }}
                            disabled={(date) => {
                              if (period.start) {
                                return date < new Date(period.start)
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
            </div>

            {/* 타겟 설정 */}
            <div>
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
              {/* 높이 맞추기 위한 더미 텍스트 영역 */}
              <div style={{ 
                fontSize: '11px', 
                color: 'transparent',
                marginBottom: '4px',
                height: '15px',
                visibility: 'hidden'
              }}>
                placeholder
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
                  color: targetGrp.length > 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                  fontSize: '13px'
                }}>
                  {targetGrp.length === 24 
                    ? '전체' 
                    : targetGrp.length > 0 
                    ? `${targetGrp.length}개 타겟 선택됨` 
                    : '타겟을 선택하세요'}
                </span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 매체 추가 버튼 */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={onOpenMediaDialog}
          className="btn btn-primary btn-md"
        >
          매체 추가
        </button>
      </div>

      {/* 매체 설정 테이블 */}
      {reachPredictorMedia.length > 0 ? (
        <div style={{
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
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
                      <Monitor size={18} style={{ color: 'hsl(var(--primary))' }} />
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
                      placeholder={media.type === 'unlinked' ? '필수' : '선택'}
                      className="input"
                      style={{
                        width: '100%',
                        textAlign: 'right',
                        padding: '6px 8px',
                        fontSize: '13px',
                        borderColor: validationActive && media.type === 'unlinked' && !media.impressions ? 'hsl(var(--destructive))' : undefined
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

                {/* 두 번째 줄: 캠페인 기간 & 타겟팅 */}
                <div style={{
                  padding: '0 16px 12px 16px'
                }}>
                  {/* 캠페인 기간 & 타겟팅 정보 (클릭 가능) */}
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '11px',
                    color: 'hsl(var(--muted-foreground))',
                    marginLeft: '64px' // 40px (icon) + 24px (spacing) to align with media/product column
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
              </div>
            ))}
          </div>

          {/* 총 예산 */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '12px 16px',
            backgroundColor: 'hsl(var(--muted) / 0.3)',
            borderTop: '1px solid hsl(var(--border))',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            <span style={{ marginRight: '12px', color: 'hsl(var(--muted-foreground))' }}>
              총 예산:
            </span>
            <span>
              {calculatedTotalBudget.toLocaleString('ko-KR')} 원
            </span>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          border: '1px dashed hsl(var(--border))',
          borderRadius: '8px',
          color: 'hsl(var(--muted-foreground))',
          fontSize: '14px'
        }}>
          매체를 추가해주세요
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
          리치커브
        </label>

        {/* 예산 상한 (필수) */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            예산 상한 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '200px auto', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={reachCurve.budgetCap ? reachCurve.budgetCap.toLocaleString('ko-KR') : ''}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '')
                if (value === '' || /^\d+$/.test(value)) {
                  onUpdateReachCurve?.({
                    ...reachCurve,
                    budgetCap: value === '' ? undefined : parseInt(value)
                  })
                }
              }}
              placeholder="예산 상한을 입력하세요"
              className="input"
              style={{ 
                width: '100%',
                borderColor: validationActive && !reachCurve.budgetCap ? 'hsl(var(--destructive))' : undefined
              }}
            />
            <span style={{ 
              fontSize: '14px', 
              color: 'hsl(var(--muted-foreground))',
              whiteSpace: 'nowrap'
            }}>
              원
            </span>
          </div>
          {validationActive && !reachCurve.budgetCap && (
            <div style={{
              fontSize: '11px',
              color: 'hsl(var(--destructive))',
              marginTop: '4px'
            }}>
              예산 상한을 입력해주세요.
            </div>
          )}
        </div>

        {/* 리치커브 상세 설정 */}
        <div style={{
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: 'hsl(var(--muted) / 0.1)'
        }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '16px'
          }}>
            리치커브 상세 설정 <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', fontWeight: '400' }}>(선택)</span>
          </div>

          {/* 구간 범위 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
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
                style={{ width: '140px', fontSize: '13px' }}
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
                style={{ width: '140px', fontSize: '13px' }}
              />
              <span style={{ 
                fontSize: '13px', 
                color: 'hsl(var(--muted-foreground))',
                whiteSpace: 'nowrap'
              }}>
                원
              </span>
            </div>
          </div>

          {/* 기준 선택 */}
          <div style={{ marginBottom: '16px' }}>
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
                fontSize: '12px',
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
                fontSize: '12px',
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
      </div>

      {/* 기간 설정 다이얼로그 */}
      {showPeriodDialog && (
        <div className="dialog-overlay" onClick={() => {
          setShowPeriodDialog(null)
          setTempPeriod(null)
          setIndividualStartDateOpen(null)
          setIndividualEndDateOpen(null)
        }}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()} style={{ width: '500px' }}>
            <div className="dialog-header">
              <h3 className="dialog-title">캠페인 기간 설정</h3>
              <p className="dialog-description">
                이 매체에 적용할 캠페인 기간을 설정하세요
              </p>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'end' }}>
                {/* 시작일 */}
                <div>
                  <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>
                    시작일
                  </div>
                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const newState = individualStartDateOpen === showPeriodDialog ? null : showPeriodDialog
                        setIndividualStartDateOpen(newState)
                        setIndividualEndDateOpen(null)
                      }}
                      className="input"
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ 
                        color: (tempPeriod?.start || reachPredictorMedia.find(m => m.id === showPeriodDialog)?.customPeriod?.start || period.start) ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {(() => {
                          const dateStr = tempPeriod?.start || reachPredictorMedia.find(m => m.id === showPeriodDialog)?.customPeriod?.start || period.start
                          return dateStr ? new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '날짜 선택'
                        })()}
                      </span>
                    </button>
                    {individualStartDateOpen === showPeriodDialog && (
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
                          onClick={() => setIndividualStartDateOpen(null)}
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
                            selected={(() => {
                              const dateStr = tempPeriod?.start || reachPredictorMedia.find(m => m.id === showPeriodDialog)?.customPeriod?.start || period.start
                              return dateStr ? new Date(dateStr) : undefined
                            })()}
                            onSelect={(date) => {
                              if (date) {
                                const dateStr = date.toISOString().split('T')[0]
                                const media = reachPredictorMedia.find(m => m.id === showPeriodDialog)
                                const currentEnd = tempPeriod?.end || media?.customPeriod?.end || period.end
                                setTempPeriod({ start: dateStr, end: currentEnd })
                                setIndividualStartDateOpen(null)
                              }
                            }}
                            disabled={(date) => {
                              const media = reachPredictorMedia.find(m => m.id === showPeriodDialog)
                              const endDate = tempPeriod?.end || media?.customPeriod?.end || period.end
                              if (endDate) {
                                return date > new Date(endDate)
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
                      onClick={() => {
                        const newState = individualEndDateOpen === showPeriodDialog ? null : showPeriodDialog
                        setIndividualEndDateOpen(newState)
                        setIndividualStartDateOpen(null)
                      }}
                      className="input"
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ 
                        color: (tempPeriod?.end || reachPredictorMedia.find(m => m.id === showPeriodDialog)?.customPeriod?.end || period.end) ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {(() => {
                          const dateStr = tempPeriod?.end || reachPredictorMedia.find(m => m.id === showPeriodDialog)?.customPeriod?.end || period.end
                          return dateStr ? new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '날짜 선택'
                        })()}
                      </span>
                    </button>
                    {individualEndDateOpen === showPeriodDialog && (
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
                          onClick={() => setIndividualEndDateOpen(null)}
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
                            selected={(() => {
                              const dateStr = tempPeriod?.end || reachPredictorMedia.find(m => m.id === showPeriodDialog)?.customPeriod?.end || period.end
                              return dateStr ? new Date(dateStr) : undefined
                            })()}
                            onSelect={(date) => {
                              if (date) {
                                const dateStr = date.toISOString().split('T')[0]
                                const media = reachPredictorMedia.find(m => m.id === showPeriodDialog)
                                const currentStart = tempPeriod?.start || media?.customPeriod?.start || period.start
                                setTempPeriod({ start: currentStart, end: dateStr })
                                setIndividualEndDateOpen(null)
                              }
                            }}
                            disabled={(date) => {
                              const media = reachPredictorMedia.find(m => m.id === showPeriodDialog)
                              const startDate = tempPeriod?.start || media?.customPeriod?.start || period.start
                              if (startDate) {
                                return date < new Date(startDate)
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
            </div>
            <div className="dialog-footer">
              <button 
                onClick={() => {
                  setShowPeriodDialog(null)
                  setTempPeriod(null)
                  setIndividualStartDateOpen(null)
                  setIndividualEndDateOpen(null)
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
                  setIndividualStartDateOpen(null)
                  setIndividualEndDateOpen(null)
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
          <div className="dialog-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
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
                      const hasAllMale = allMale.every(t => targetGrp.includes(t))
                      
                      if (hasAllMale) {
                        onUpdateGlobalSettings?.({ targetGrp: targetGrp.filter(t => !allMale.includes(t)) })
                      } else {
                        onUpdateGlobalSettings?.({ targetGrp: [...new Set([...targetGrp, ...allMale])] })
                      }
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    {targetGrpOptions.male.every(t => targetGrp.includes(t)) ? '전체 해제' : '전체 선택'}
                  </button>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {targetGrpOptions.male.map((target) => {
                    const isChecked = targetGrp.includes(target)
                    
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
                              onUpdateGlobalSettings?.({ targetGrp: targetGrp.filter(t => t !== target) })
                            } else {
                              onUpdateGlobalSettings?.({ targetGrp: [...targetGrp, target] })
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
                      const hasAllFemale = allFemale.every(t => targetGrp.includes(t))
                      
                      if (hasAllFemale) {
                        onUpdateGlobalSettings?.({ targetGrp: targetGrp.filter(t => !allFemale.includes(t)) })
                      } else {
                        onUpdateGlobalSettings?.({ targetGrp: [...new Set([...targetGrp, ...allFemale])] })
                      }
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    {targetGrpOptions.female.every(t => targetGrp.includes(t)) ? '전체 해제' : '전체 선택'}
                  </button>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {targetGrpOptions.female.map((target) => {
                    const isChecked = targetGrp.includes(target)
                    
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
                              onUpdateGlobalSettings?.({ targetGrp: targetGrp.filter(t => t !== target) })
                            } else {
                              onUpdateGlobalSettings?.({ targetGrp: [...targetGrp, target] })
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
                확인 ({targetGrp.length}개 선택)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 타겟팅 설정 다이얼로그 */}
      {showTargetDialog && (
        <div className="dialog-overlay" onClick={() => setShowTargetDialog(null)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
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
