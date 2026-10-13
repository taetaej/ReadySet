// Reach Caster 결과 → DataShot 데이터셋 생성 모달
// 스펙: plan/spec/DataShot_CreateFromReachCaster_Spec.md
// - 데이터셋명((D/S) 프리필) · 업종(읽기) · 조회기간(월/분기 선택) · 매체별 전달 내역(목업)
// - "DataShot 생성" → /datashot/new 로 프리필 이동 (즉시 생성 아님)
// datashot 모듈 규칙에 따라 인라인 스타일 유지.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Info, ArrowRight, ChevronDown } from 'lucide-react'
import { initialFormData, type FormData, type MediaProductSelection } from './createDatasetTypes'
import { MonthRangePicker } from './MonthRangePicker'

// DataShot이 지원하는 DIGITAL 매체 (MediaProductSelect.MEDIA_LIST와 동일)
const DATASHOT_MEDIA = ['Google Ads', 'Meta', 'kakao모먼트', 'NAVER 성과형 DA', 'NAVER 보장형 DA', 'TikTok']

// 기본 목업 매체·상품 (매체 리스트를 못 넘기는 결과 화면 폴백 — 세 케이스 노출용)
// 전달 / 미지원 제외(TVC·비지원) / 성과 없음 제외(impressions 비움)가 모두 보이도록 구성.
const FALLBACK_MEDIA_ITEMS: RCMediaItem[] = [
  { category: 'DIGITAL', mediaName: 'Google Ads', productName: 'Google_Display_CPM', impressions: '50000000' },
  { category: 'DIGITAL', mediaName: 'Google Ads', productName: 'Google_Search_CPC', impressions: '31000000' },
  { category: 'DIGITAL', mediaName: 'Meta', productName: 'Meta_Feed_CPM', impressions: '42000000' },
  { category: 'DIGITAL', mediaName: 'Meta', productName: 'Meta_Reels_CPV', impressions: '27500000' },
  { category: 'DIGITAL', mediaName: 'kakao모먼트', productName: 'Kakao_BizBoard_CPC', impressions: '18000000' },
  { category: 'DIGITAL', mediaName: 'TikTok', productName: 'TikTok_InFeed_CPV', impressions: '21000000' },
  { category: 'DIGITAL', mediaName: 'NAVER 성과형 DA', productName: 'Naver_GFA_CPM', impressions: '' },      // 성과 없음 제외
  { category: 'DIGITAL', mediaName: 'NAVER 보장형 DA', productName: 'Naver_Guaranteed_CPT', impressions: '' }, // 성과 없음 제외
  { category: 'DIGITAL', mediaName: '티빙', productName: 'TVING_Stream', impressions: '12000000' },           // DataShot 미지원
  { category: 'DIGITAL', mediaName: '당근마켓', productName: 'Daangn_Local_CPM', impressions: '9000000' },     // DataShot 미지원
  { category: 'TVC', mediaName: 'CJ ENM', productName: 'tvN', impressions: '15000000' },                       // 미지원(비DIGITAL)
]

// Reach Caster가 넘기는 매체·상품 1건
interface RCMediaItem {
  category?: string // 'DIGITAL' | 'TVC' ...
  mediaName: string
  productName?: string
  budget?: string
  impressions?: string
}

type Verdict = 'delivered' | 'unsupported' | 'noData'

// 지표 구성 옵션 (생성 Step1 purpose와 동일: internal=종합 / external=성과)
// sharedDisabled=true면 Share Slot 소속 예정 시 비활성(종합 지표만 해당)
const PURPOSE_OPTIONS: { value: FormData['purpose']; label: string; desc: string; sharedDisabled?: boolean }[] = [
  { value: 'internal', label: '종합 지표', desc: '전체 성과 흐름을 통합적으로 확인할 수 있도록 모든 효율 및 비용 지표를 제공', sharedDisabled: true },
  { value: 'external', label: '성과 지표', desc: 'CTR, CPC 등 순수 효율과 성과 트렌드 분석에 최적화된 데이터셋' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  scenarioName: string
  industry: string
  /** Reach Caster 선택 매체·상품 (reachPredictorMedia 등) */
  mediaItems: RCMediaItem[]
  /** 소속 예정 Slot이 Share(공유) Slot이면 true → '종합 지표' 선택 비활성 */
  slotShared?: boolean
}

// 목업 판정 (DIGITAL 매체만 대상 — TVC 등 비DIGITAL은 리스트에서 아예 제외, 뚜껑 안내로 대신).
// DataShot 미지원 DIGITAL 매체 → 미지원 제외.
// 지원 DIGITAL이지만 (목업) 특정 상품은 선택 기간·업종에 성과 없음 → 성과 없음 제외.
// 그 외 → 전달.
function judge(item: RCMediaItem, periodSelected: boolean): Verdict {
  const supported = DATASHOT_MEDIA.includes(item.mediaName)
  if (!supported) return 'unsupported'
  // 기간 선택 후에만 데이터 유무 판정. 목업: productName에 'noData' 또는 impressions 없음을 성과 없음으로 간주
  if (!periodSelected) return 'delivered'
  const noExec = !item.impressions || item.impressions === ''
  return noExec ? 'noData' : 'delivered'
}

export function DataShotCreateModal({ isOpen, onClose, scenarioName, industry, mediaItems, slotShared = false }: Props) {
  const navigate = useNavigate()
  const [datasetName, setDatasetName] = useState(`(D/S) ${scenarioName}`)
  // 기본값 '성과 지표'(external). Share Slot이면 종합 지표가 비활성이라 더더욱 성과 지표가 안전한 기본값.
  const [purpose, setPurpose] = useState<FormData['purpose']>('external')
  const [purposeOpen, setPurposeOpen] = useState(false)
  const [purposeHover, setPurposeHover] = useState<FormData['purpose'] | null>(null)
  const purposeRef = useRef<HTMLDivElement>(null)
  const [periodType, setPeriodType] = useState<'month' | 'quarter'>('month')
  const [period, setPeriod] = useState({ startYear: '', startMonth: '', endYear: '', endMonth: '' })

  const [calendarOpen, setCalendarOpen] = useState(false)

  // 지표 구성 드롭리스트 닫기 (바깥 클릭)
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (purposeRef.current && !purposeRef.current.contains(e.target as Node)) setPurposeOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // Share Slot이면 '종합 지표'(internal) 선택 불가 → 성과 지표로 강제 보정
  useEffect(() => {
    if (slotShared && purpose === 'internal') setPurpose('external')
  }, [slotShared, purpose])

  const periodSelected = !!(period.startYear && period.startMonth && period.endYear && period.endMonth)
  const nameValid = datasetName.trim().length > 0

  // 매체별 전달 내역 판정 (매체 리스트가 없으면 목업 폴백)
  // TVC 등 비DIGITAL 매체는 목록에서 제외(뚜껑의 "TVC 성과 추출 미제공" 안내로 대신).
  const sourceItems = (mediaItems.length > 0 ? mediaItems : FALLBACK_MEDIA_ITEMS)
    .filter(item => (item.category ?? 'DIGITAL') === 'DIGITAL')
  const judged = useMemo(() => {
    return sourceItems.map(item => ({ item, verdict: judge(item, periodSelected) }))
  }, [sourceItems, periodSelected])

  const delivered = judged.filter(j => j.verdict === 'delivered')
  const unsupported = judged.filter(j => j.verdict === 'unsupported')
  const noData = judged.filter(j => j.verdict === 'noData')
  const canCreate = nameValid && !!purpose && periodSelected && delivered.length > 0

  if (!isOpen) return null

  const badge = (verdict: Verdict) => {
    if (verdict === 'unsupported') {
      return (
        <span style={{
          flexShrink: 0, fontSize: '10px', padding: '1px 6px', borderRadius: '10px',
          backgroundColor: 'hsl(var(--destructive) / 0.1)', color: 'hsl(var(--destructive))',
          display: 'inline-flex', alignItems: 'center', gap: '3px',
        }}>
          <AlertTriangle size={9} /> 미지원 제외
        </span>
      )
    }
    if (verdict === 'noData') {
      return (
        <span style={{
          flexShrink: 0, fontSize: '10px', padding: '1px 6px', borderRadius: '10px',
          backgroundColor: 'hsl(var(--muted-foreground) / 0.12)', color: 'hsl(var(--muted-foreground))',
          display: 'inline-flex', alignItems: 'center', gap: '3px',
        }}>
          <AlertTriangle size={9} /> 성과 없음 제외
        </span>
      )
    }
    return null
  }

  // "DataShot 생성" → 생성 화면으로 프리필 이동
  const handleCreate = () => {
    if (!canCreate) return
    // 전달된 매체·상품만 mediaProducts로 구성
    const mediaProducts: MediaProductSelection = {}
    for (const { item } of delivered) {
      if (!item.productName) continue
      if (!mediaProducts[item.mediaName]) mediaProducts[item.mediaName] = []
      if (!mediaProducts[item.mediaName].includes(item.productName)) {
        mediaProducts[item.mediaName].push(item.productName)
      }
    }
    const prefillForm: FormData = {
      ...initialFormData,
      datasetName,
      extractMode: 'product',       // 광고상품 고정
      purpose,                      // 지표 구성 (종합/성과)
      industries: industry ? [industry] : [],
      industryLevel: 'major',       // 광고상품 = 대분류
      periodType,
      period,
      mediaProducts,                // Step2 전달 광고상품 선택 상태
      // productMetrics(지표)는 미선택 유지 (생성 화면 Step2에서 선택)
    }
    // Step1(명·추출기준·업종·지표구성·기간)은 모달에서 다 받았으므로 Step2(광고상품 선택)부터 진입
    navigate('/datashot/new', { state: { prefillForm, startStep: 2 } })
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog-content dialog-md"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: calendarOpen ? 'none' : '86vh',
          display: 'flex', flexDirection: 'column',
          overflow: calendarOpen ? 'visible' : undefined,
        }}
      >
        {/* 1. 헤더 */}
        <div className="dialog-header" style={{ flexShrink: 0 }}>
          <h3 className="dialog-title">내 업종의 캠페인 성과 보기</h3>
          <p className="dialog-description">
            Reach Caster의 업종·매체·광고상품을 DataShot의 캠페인 성과 추출 대상으로 가져갑니다.
          </p>
          <p style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginTop: '8px',
          }}>
            <Info size={12} style={{ flexShrink: 0 }} />
            생성되는 DataShot 데이터셋은 현재 Slot 안에 함께 만들어집니다.
          </p>
        </div>

        <div style={{ padding: '24px', flex: 1, minHeight: '560px', overflowY: calendarOpen ? 'visible' : 'auto' }}>
          {/* 2. 데이터셋명 — 생성 Step1과 동일 UI (너비는 모달 full) */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '8px' }}>
              데이터셋명 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
            </label>
            <input
              type="text"
              value={datasetName}
              onChange={(e) => {
                const value = e.target.value.replace(/\n/g, '')
                if (value.length <= 50) setDatasetName(value)
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
              placeholder="데이터셋명을 입력하세요."
              className="input"
              style={{ width: '100%', borderColor: !nameValid ? 'hsl(var(--destructive))' : undefined }}
              maxLength={50}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))' }}>
                {datasetName.length === 0 && '데이터셋명을 입력해주세요.'}
                {datasetName.length > 0 && !nameValid && '공백만으로 구성할 수 없습니다.'}
              </div>
              <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', flexShrink: 0 }}>
                {datasetName.length}/50
              </div>
            </div>
          </div>

          {/* 3. 업종 (읽기) */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '8px' }}>업종</label>
            <div style={{ fontSize: '14px', color: 'hsl(var(--foreground))' }}>{industry || '-'}</div>
          </div>

          {/* 4. 지표 구성 — 드롭리스트 (생성 Step1 purpose와 동일 옵션). 필수. */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '8px' }}>
              지표 구성 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
            </label>
            <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
              종합 지표는 Private 또는 Internal Slot에서만 선택할 수 있습니다.
            </p>
            <div style={{ position: 'relative' }} ref={purposeRef}>
              <button
                type="button"
                onClick={() => setPurposeOpen(o => !o)}
                className="input"
                style={{
                  width: '100%', textAlign: 'left', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  color: purpose ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                }}
              >
                <span>{purpose ? PURPOSE_OPTIONS.find(o => o.value === purpose)?.label : '지표 구성을 선택하세요.'}</span>
                <ChevronDown size={14} style={{ flexShrink: 0 }} />
              </button>
              {purposeOpen && (
                <div className="dropdown" style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', zIndex: 1000,
                }}>
                  {PURPOSE_OPTIONS.map(opt => {
                    const disabled = !!(opt.sharedDisabled && slotShared)
                    const hovered = purposeHover === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={disabled}
                        onClick={() => { if (disabled) return; setPurpose(opt.value); setPurposeOpen(false) }}
                        onMouseEnter={() => !disabled && setPurposeHover(opt.value)}
                        onMouseLeave={() => setPurposeHover(null)}
                        style={{
                          display: 'block', textAlign: 'left', width: '100%', border: 'none',
                          padding: '10px 12px', cursor: disabled ? 'not-allowed' : 'pointer',
                          opacity: disabled ? 0.5 : 1,
                          // hover 또는 선택 시 그레이(muted) 영역 표시. 비활성은 hover 안 함.
                          backgroundColor: (hovered || purpose === opt.value) && !disabled ? 'hsl(var(--muted))' : 'transparent',
                          transition: 'background-color 0.15s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'hsl(var(--foreground))' }}>
                          {opt.label}
                          {disabled && <span style={{ fontSize: '10px', fontWeight: 500, color: 'hsl(var(--muted-foreground))' }}>· 공유 Slot에서 선택 불가</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginTop: '2px', whiteSpace: 'normal', lineHeight: 1.45 }}>{opt.desc}</div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 5. 조회기간 입력 — DataShot 생성(Step1) 기간 선택기 재사용. 필수. */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '8px' }}>조회기간 <span style={{ color: 'hsl(var(--destructive))' }}>*</span></label>
            <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
              최근 2년치 데이터를 조회할 수 있습니다.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              {(['month', 'quarter'] as const).map(type => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="dsModalPeriodType"
                    checked={periodType === type}
                    onChange={() => { setPeriodType(type); setPeriod({ startYear: '', startMonth: '', endYear: '', endMonth: '' }) }}
                    style={{ accentColor: 'hsl(var(--primary))' }}
                  />
                  <span style={{ fontSize: '13px' }}>{type === 'month' ? '월별' : '분기별'}</span>
                </label>
              ))}
            </div>
            <MonthRangePicker type={periodType} value={period} onChange={setPeriod} width="100%" onOpenChange={setCalendarOpen} />
          </div>

          {/* 6. 매체별 전달 내역 — 뚜껑(헤더)은 항상, 본문은 기간 선택 전/후 분기 */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ marginBottom: '6px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(var(--foreground))' }}>매체별 전달 내역</div>
              {periodSelected && (
                <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginTop: '2px' }}>
                  전달 {delivered.length}개
                  {unsupported.length > 0 && ` · 미지원 제외 ${unsupported.length}개`}
                  {noData.length > 0 && ` · 성과 없음 제외 ${noData.length}개`}
                </div>
              )}
            </div>

            <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden' }}>
              {/* 뚜껑: 테이블 헤더 */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                padding: '9px 12px',
                backgroundColor: 'hsl(var(--muted) / 0.5)',
                borderBottom: '1px solid hsl(var(--border))',
                fontSize: '11px', fontWeight: 600, color: 'hsl(var(--muted-foreground))',
              }}>
                <span>매체 &gt; 광고상품</span>
                <span style={{ fontWeight: 400 }}>TVC 미제공</span>
              </div>

              {!periodSelected ? (
                /* 기간 미선택 안내 */
                <div style={{
                  padding: '32px 12px', textAlign: 'center',
                  fontSize: '13px', color: 'hsl(var(--muted-foreground))',
                }}>
                  조회 기간을 선택해주세요
                </div>
              ) : (
                <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                  {[...unsupported, ...noData, ...delivered].map(({ item, verdict }, i) => {
                    const excluded = verdict !== 'delivered'
                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '9px 12px',
                          borderTop: i === 0 ? 'none' : '1px solid hsl(var(--border))',
                          backgroundColor: excluded ? 'hsl(var(--muted) / 0.25)' : 'transparent',
                          fontSize: '12px',
                        }}
                      >
                        <span
                          style={{
                            flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            color: excluded ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))',
                            textDecoration: excluded ? 'line-through' : 'none',
                          }}
                        >
                          {item.mediaName}{item.productName ? ` > ${item.productName}` : ''}
                        </span>
                        {badge(verdict)}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 하단 설명(범례) — 제외 유형 안내는 기간과 무관하게 항상 표시 */}
            <div style={{ marginTop: '10px', fontSize: '11px', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'flex-start', gap: '5px', lineHeight: 1.5 }}>
              <AlertTriangle size={12} style={{ color: 'hsl(var(--destructive))', flexShrink: 0, marginTop: '1px' }} />
              <span><strong style={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}>미지원 제외</strong> — DataShot이 지원하지 않는 매체·광고상품으로, 전달되지 않습니다.</span>
            </div>
            <div style={{ marginTop: '6px', fontSize: '11px', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'flex-start', gap: '5px', lineHeight: 1.5 }}>
              <Info size={12} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span><strong style={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}>성과 없음 제외</strong> — 선택된 업종 및 기간 내 데이터가 없는 매체·광고상품으로, 전달되지 않습니다.</span>
            </div>
            {periodSelected && delivered.length === 0 && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: 'hsl(var(--destructive))', display: 'flex', alignItems: 'flex-start', gap: '5px', lineHeight: 1.5 }}>
                <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>DataShot으로 전달할 매체·상품이 없습니다. 기간이나 업종을 조정해보세요.</span>
              </div>
            )}
          </div>
        </div>

        {/* 6. 푸터 */}
        <div className="dialog-footer" style={{ flexShrink: 0 }}>
          <button onClick={onClose} className="btn btn-secondary btn-md">취소</button>
          <button
            onClick={handleCreate}
            disabled={!canCreate}
            className="btn btn-primary btn-md"
            style={{
              opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
          >
            DataShot 생성 <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
