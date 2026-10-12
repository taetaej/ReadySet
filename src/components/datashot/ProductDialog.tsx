// 상품 선택 다이얼로그 — RatioFinder(ScenarioStep2RatioFinder)의 상품 선택 다이얼로그를
// 차용. 비중(productRatios) 결합은 제거하고 상품 소스를 mediaData.DIGITAL로 사용.
// 사용자가 RatioFinder에서 학습한 인터랙션을 동일하게 유지하기 위함.
import { Info } from 'lucide-react'
import { mediaData } from '../scenario/constants'

export interface ProductDialogState {
  open: boolean
  media: string
  selectedProducts: string[]
}

// DataShot 매체명 → RatioFinder mediaData.DIGITAL 키 매핑 (표기 차이 보정)
const DIGITAL = mediaData.DIGITAL as Record<string, string[]>

// ─────────────────────────────────────────────────────────────
// "표본 적음" 판정 (벤치마크 신뢰도 참고 — Spec §C.2.2.1)
// 조건 A: 집행 캠페인 수 ≤ 2  OR  브랜드(광고주) 수 = 1 → 표본 적음.
// 캠페인 수·브랜드 수는 프론트가 알 수 없는 값으로, 백엔드가 광고그룹을
// 집계해 상품 단위 플래그(lowSample)로 내려줘야 함. 현 단계는 목업으로,
// 각 매체 상품 목록의 앞 5개를 "표본 적음"으로 지정해 UI를 확인함.
// 백엔드 연동 시 이 함수의 반환을 응답 플래그로 교체할 것.
// ─────────────────────────────────────────────────────────────
const LOW_SAMPLE_COUNT_PER_MEDIA = 5

/** 해당 (매체, 상품)이 "표본 적음"에 해당하는지 (목업: 매체별 앞 5개). */
export function isLowSampleProduct(media: string, product: string): boolean {
  const products = getProductsForMedia(media)
  const idx = products.indexOf(product)
  return idx >= 0 && idx < LOW_SAMPLE_COUNT_PER_MEDIA
}

/**
 * "표본 적음" 참고 뱃지 — 중립 회색(muted) 톤. 선택을 막는 경고가 아닌 참고 정보.
 * 상품명 바로 옆(같은 줄)에 작게 둠. hover 시 근거 툴팁 노출.
 */
export function LowSampleBadge() {
  return (
    <span
      title="집행 캠페인·브랜드 수가 적어 벤치마크가 특정 광고주에 치우쳐 있을 수 있어요."
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '2px 6px', borderRadius: '4px',
        backgroundColor: 'hsl(var(--muted) / 0.6)',
        color: 'hsl(var(--muted-foreground))',
        fontSize: '10px', fontWeight: 500, lineHeight: 1.4,
        whiteSpace: 'nowrap', cursor: 'default', flexShrink: 0,
      }}
    >
      <Info size={10} />
      표본 적음
    </span>
  )
}
// 매체별 전체 상품 목록(mediaData.DIGITAL)을 반환한다.
export function getProductsForMedia(media: string): string[] {
  if (DIGITAL[media]) return DIGITAL[media]
  // kakao모먼트(붙임) vs 'kakao 모먼트'(띄움) 등 표기 차이 보정
  const normalized = media.replace(/\s+/g, '')
  const key = Object.keys(DIGITAL).find(k => k.replace(/\s+/g, '') === normalized)
  return key ? DIGITAL[key] : []
}

interface Props {
  dialog: ProductDialogState
  setDialog: (d: ProductDialogState) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  onConfirm: (media: string, products: string[]) => void
}

export function ProductDialog({ dialog, setDialog, searchQuery, setSearchQuery, onConfirm }: Props) {
  if (!dialog.open) return null

  const allProducts = getProductsForMedia(dialog.media)
  const filteredProducts = allProducts.filter(product =>
    product.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const allSelected = filteredProducts.length > 0 && filteredProducts.every(p => dialog.selectedProducts.includes(p))

  const close = () => {
    setDialog({ open: false, media: '', selectedProducts: [] })
    setSearchQuery('')
  }

  return (
    <div className="dialog-overlay" onClick={close}>
      <div
        className="dialog-content dialog-md"
        onClick={(e) => e.stopPropagation()}
        style={{ height: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="dialog-header">
          <h3 className="dialog-title">{dialog.media} 광고상품 선택</h3>
          <p className="dialog-description">추출에 포함할 광고상품을 선택하세요</p>
          <div style={{
            marginTop: '12px', padding: '12px',
            backgroundColor: 'hsl(var(--muted) / 0.5)', border: '1px solid hsl(var(--border))',
            borderRadius: '6px', fontSize: '12px', color: 'hsl(var(--muted-foreground))',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Info size={14} />
            <span>Step1에서 선택한 기간·업종의 집행 데이터가 있는 광고상품만 표시됩니다.</span>
          </div>
        </div>

        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {/* 검색 및 전체 선택 */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="광고상품 검색..."
              className="input"
              style={{ width: '100%', marginBottom: '12px' }}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px', backgroundColor: 'hsl(var(--muted) / 0.5)', borderRadius: '6px',
            }}>
              <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                {filteredProducts.length}개 광고상품
              </span>
              <button
                onClick={() => {
                  if (allSelected) {
                    setDialog({
                      ...dialog,
                      selectedProducts: dialog.selectedProducts.filter(p => !filteredProducts.includes(p)),
                    })
                  } else {
                    setDialog({
                      ...dialog,
                      selectedProducts: [...new Set([...dialog.selectedProducts, ...filteredProducts])],
                    })
                  }
                }}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px' }}
              >
                {allSelected ? '전체 해제' : '전체 선택'}
              </button>
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
              선택됨: {dialog.selectedProducts.length}/{allProducts.length}
            </div>
          </div>

          {/* 상품 목록 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <label
                  key={product}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                    padding: '12px', borderRadius: '6px',
                    border: `1px solid ${dialog.selectedProducts.includes(product) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                    backgroundColor: dialog.selectedProducts.includes(product) ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={dialog.selectedProducts.includes(product)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDialog({ ...dialog, selectedProducts: [...dialog.selectedProducts, product] })
                      } else {
                        setDialog({ ...dialog, selectedProducts: dialog.selectedProducts.filter(p => p !== product) })
                      }
                    }}
                    className="checkbox-custom"
                  />
                  <span style={{ fontSize: '13px' }}>{product}</span>
                  {isLowSampleProduct(dialog.media, product) && <LowSampleBadge />}
                </label>
              ))
            ) : (
              <div style={{ padding: '32px', textAlign: 'center', color: 'hsl(var(--muted-foreground))', fontSize: '13px' }}>
                {allProducts.length === 0 ? '선택 가능한 광고상품이 없습니다' : '검색 결과가 없습니다'}
              </div>
            )}
          </div>
        </div>

        <div className="dialog-footer">
          <button onClick={close} className="btn btn-secondary btn-md">취소</button>
          <button
            onClick={() => {
              onConfirm(dialog.media, dialog.selectedProducts)
              close()
            }}
            className="btn btn-primary btn-md"
          >
            확인 ({dialog.selectedProducts.length}개 선택)
          </button>
        </div>
      </div>
    </div>
  )
}
