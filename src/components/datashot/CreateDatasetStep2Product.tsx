// 광고상품 기준 Step2 — 매체·상품 선택 + (단일 매체 시)타겟팅 + 지표 선택
// 추출 기준이 'product'일 때 CreateDatasetStep2 대신 렌더된다.
import { MediaProductSelect } from './MediaProductSelect'
import { MetricSelect, getMetricGroups, applyTargetingExclusions } from './MetricSelect'
import { TargetingSelector } from './CreateDatasetStep2'
import { CollaborativePartnerSelect } from './CollaborativePartnerSelect'
import { targetingOptionsByMedia } from './types'
import type { FormData, MediaProductSelection } from './createDatasetTypes'

interface Props {
  formData: FormData
  setFormData: (data: FormData) => void
  validationActive: boolean
  // 매체 수 변경이 지표 소스(단일↔공통)를 바꿔 지표 초기화가 필요할 때 상위에 확인 요청
  onConfirmResetMetrics?: (nextMediaProducts: MediaProductSelection) => void
}

export function CreateDatasetStep2Product({ formData, setFormData, validationActive, onConfirmResetMetrics }: Props) {
  const mediaProducts = formData.mediaProducts
  const selectedMedias = Object.keys(mediaProducts)

  // 타겟팅/파트너사는 매체가 "정확히 1개"일 때만 노출
  const singleMedia = selectedMedias.length === 1 ? selectedMedias[0] : null
  const hasTargeting = !!singleMedia && (targetingOptionsByMedia[singleMedia] ?? []).length > 0
  const isMeta = singleMedia === 'Meta'

  // 협력 광고 파트너사 ↔ 기기유형 상호 배제 (Meta 전용, 조건 조합과 동일)
  const hasCollaborativePartner = formData.productCollaborativePartners.length > 0
  const isDeviceTargeting = isMeta && formData.targetingCategory === '기기유형'
  const disabledTargetingCategories = isMeta && hasCollaborativePartner ? ['기기유형'] : []
  const lockCollaborativePartner = isMeta && !hasCollaborativePartner && isDeviceTargeting

  const setMediaProducts = (next: MediaProductSelection) => {
    const prevMedias = selectedMedias
    const nextMedias = Object.keys(next)
    const prevCount = prevMedias.length
    const nextCount = nextMedias.length

    // 지표 소스가 바뀌는지 판정:
    //  - 단일(≤1) ↔ 공통(≥2) 경계를 넘거나
    //  - 둘 다 단일(1개)인데 매체가 교체되면(소스=매체 지표가 달라짐)
    // → 이미 선택한 지표가 있으면 확인 다이얼로그 (취소 시 매체 변경도 되돌림)
    const crossedBoundary = (prevCount <= 1) !== (nextCount <= 1)
    const singleMediaChanged = prevCount === 1 && nextCount === 1 && prevMedias[0] !== nextMedias[0]
    const metricSourceChanged = crossedBoundary || singleMediaChanged
    if (metricSourceChanged && formData.productMetrics.length > 0 && onConfirmResetMetrics) {
      onConfirmResetMetrics(next)
      return
    }

    // 타겟팅/파트너사는 "매체 1개 + 그 매체가 그대로"일 때만 유지. 그 외엔 초기화.
    const keepDetails = nextCount === 1 && prevCount === 1 && prevMedias[0] === nextMedias[0]
    if (keepDetails) {
      setFormData({ ...formData, mediaProducts: next })
    } else {
      setFormData({
        ...formData,
        mediaProducts: next,
        targetingCategory: '', targetingOptions: [], productCollaborativePartners: [],
        // 지표도 소스가 바뀌면 초기화 (위에서 다이얼로그 안 탄 경우 = 지표 없거나 소스 안 바뀜)
        ...(metricSourceChanged ? { productMetrics: [] } : {}),
      })
    }
  }
  const setProductMetrics = (next: string[]) => {
    setFormData({ ...formData, productMetrics: next })
  }

  // 타겟팅 카테고리 변경: 새 타겟팅 기준으로 제외되는 지표를 선택값에서 정리
  const handleTargetingCategoryChange = (cat: string) => {
    let nextMetrics = formData.productMetrics
    if (singleMedia && formData.productMetrics.length > 0) {
      const base = getMetricGroups([singleMedia], formData.purpose)
      const allowed = new Set(applyTargetingExclusions(base, singleMedia, cat).flatMap(g => g.metrics.map(m => m.id)))
      nextMetrics = formData.productMetrics.filter(id => allowed.has(id))
    }
    setFormData({ ...formData, targetingCategory: cat, targetingOptions: [], productMetrics: nextMetrics })
  }

  return (
    <div style={{ width: '800px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>상세 설정</h2>

      <MediaProductSelect
        value={mediaProducts}
        onChange={setMediaProducts}
        validationActive={validationActive}
        period={formData.period}
      />

      {/* 매체 · 광고상품 하단 구분선 (매체 선택 후) */}
      {selectedMedias.length > 0 && (
        <hr style={{ border: 'none', borderTop: '1px solid hsl(var(--border))', margin: '8px 0 24px' }} />
      )}

      {/* 상세 조건 — 매체가 1개이고 해당 매체에 타겟팅/파트너사 옵션이 있을 때만 */}
      {hasTargeting && singleMedia && (
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
            상세 조건
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Meta 전용: 협력 광고 파트너사 (타겟팅 위) */}
          {isMeta && (
            <CollaborativePartnerSelect
              selected={formData.productCollaborativePartners}
              onChange={partners => setFormData({ ...formData, productCollaborativePartners: partners })}
              locked={lockCollaborativePartner}
              lockHint="타겟팅 옵션에서 '기기 유형' 사용 중에는 선택할 수 없습니다"
              selectedProducts={mediaProducts[singleMedia] || []}
            />
          )}
          <TargetingSelector
            media={singleMedia}
            category={formData.targetingCategory}
            selected={formData.targetingOptions}
            onCategoryChange={handleTargetingCategoryChange}
            onOptionsChange={opts => setFormData({ ...formData, targetingOptions: opts })}
            validationActive={validationActive}
            disabledCategories={disabledTargetingCategories}
          />
          </div>
        </div>
      )}

      {/* 상세 조건 ↔ 지표 사이 구분선 */}
      {hasTargeting && singleMedia && selectedMedias.length > 0 && (
        <hr style={{ border: 'none', borderTop: '1px solid hsl(var(--border))', margin: '8px 0 24px' }} />
      )}

      {/* 지표 (매체 선택 후 표시) */}
      {selectedMedias.length > 0 && (
        <MetricSelect
          selectedMedias={selectedMedias}
          metrics={formData.productMetrics}
          onChange={setProductMetrics}
          validationActive={validationActive}
          targetingCategory={singleMedia ? formData.targetingCategory : ''}
          media={singleMedia}
          purpose={formData.purpose}
        />
      )}
    </div>
  )
}
