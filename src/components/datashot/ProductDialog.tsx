// 상품 선택 다이얼로그 — RatioFinder(ScenarioStep2RatioFinder)의 상품 선택 다이얼로그를
// 차용. 비중(productRatios) 결합은 제거하고 상품 소스를 mediaData.DIGITAL로 사용.
// 사용자가 RatioFinder에서 학습한 인터랙션을 동일하게 유지하기 위함.
import { Info } from 'lucide-react'
import { mediaData } from '../scenario/constants'
import { type PeriodLike, isWithin2026H1, getBenchmarkProductsForMedia } from './benchmark2026H1'

export interface ProductDialogState {
  open: boolean
  media: string
  selectedProducts: string[]
}

// DataShot 매체명 → RatioFinder mediaData.DIGITAL 키 매핑 (표기 차이 보정)
const DIGITAL = mediaData.DIGITAL as Record<string, string[]>
// period가 2026 1~6월 범위면 "집행 데이터 있는 상품"(벤치마크)만, 아니면 전체 상품 목록.
export function getProductsForMedia(media: string, period?: PeriodLike): string[] {
  if (isWithin2026H1(period)) {
    const bench = getBenchmarkProductsForMedia(media)
    if (bench.length > 0) return bench
  }
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
  period?: PeriodLike // 2026 1~6월 범위면 집행 데이터 있는 상품만 노출
}

export function ProductDialog({ dialog, setDialog, searchQuery, setSearchQuery, onConfirm, period }: Props) {
  if (!dialog.open) return null

  const allProducts = getProductsForMedia(dialog.media, period)
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
          <h3 className="dialog-title">{dialog.media} 상품 선택</h3>
          <p className="dialog-description">추출에 포함할 상품을 선택하세요</p>
          <div style={{
            marginTop: '12px', padding: '12px',
            backgroundColor: 'hsl(var(--muted) / 0.5)', border: '1px solid hsl(var(--border))',
            borderRadius: '6px', fontSize: '12px', color: 'hsl(var(--muted-foreground))',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Info size={14} />
            <span>Step1에서 선택한 기간·업종의 집행 데이터가 있는 상품만 표시됩니다.</span>
          </div>
        </div>

        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {/* 검색 및 전체 선택 */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="상품 검색..."
              className="input"
              style={{ width: '100%', marginBottom: '12px' }}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px', backgroundColor: 'hsl(var(--muted) / 0.5)', borderRadius: '6px',
            }}>
              <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                {filteredProducts.length}개 상품
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
