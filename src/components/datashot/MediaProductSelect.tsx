// 광고상품 기준 > 매체 선택 + 매체별 상품 선택
// RatioFinder '매체별 예산 배분'의 선택 UI 골격 + 상품 선택 다이얼로그를 차용.
// 비중(%)·예산·TVC탭 제외. 상품 선택은 ProductDialog(모달)로 처리.
import { useState } from 'react'
import { ListPlus, X, Smartphone, Info } from 'lucide-react'
import { mediaIconMap } from '../common/MediaIcons'
import { ProductDialog, type ProductDialogState } from './ProductDialog'
import type { MediaProductSelection } from './createDatasetTypes'
import type { PeriodLike } from './benchmark2026H1'

// DataShot 매체 목록 (TVING·당근 제외 반영된 6종)
const MEDIA_LIST = ['Google Ads', 'Meta', 'kakao모먼트', 'NAVER 성과형 DA', 'NAVER 보장형 DA', 'TikTok']

interface Props {
  value: MediaProductSelection
  onChange: (next: MediaProductSelection) => void
  validationActive: boolean
  readOnly?: boolean // 조회(상세) 모달 재사용: 조작 요소 비활성 + 선택 매체만 노출
  period?: PeriodLike // 2026 1~6월 범위면 상품 다이얼로그에 집행 데이터 있는 상품만 노출
}

export function MediaProductSelect({ value, onChange, validationActive, readOnly = false, period }: Props) {
  const [dialog, setDialog] = useState<ProductDialogState>({ open: false, media: '', selectedProducts: [] })
  const [searchQuery, setSearchQuery] = useState('')

  const selectedMediaList = MEDIA_LIST.filter(m => value[m] !== undefined)

  const toggleMedia = (media: string, checked: boolean) => {
    const next = { ...value }
    if (checked) next[media] = []
    else delete next[media]
    onChange(next)
  }

  const openDialog = (media: string) => {
    setDialog({ open: true, media, selectedProducts: value[media] || [] })
    setSearchQuery('')
  }

  const removeProduct = (media: string, product: string) => {
    onChange({ ...value, [media]: (value[media] || []).filter(p => p !== product) })
  }

  const handleConfirm = (media: string, products: string[]) => {
    onChange({ ...value, [media]: products })
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      {!readOnly && (
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          매체 · 광고상품 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
        </label>
      )}
      {/* 안내 섹션 (조건 조합 탭과 동일 UI) — 조회 모달에선 숨김 */}
      {!readOnly && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '8px',
          padding: '12px', margin: '16px 0 20px',
          backgroundColor: 'hsl(var(--muted) / 0.5)',
          border: '1px solid hsl(var(--border))', borderRadius: '6px',
          fontSize: '12px', color: 'hsl(var(--muted-foreground))',
        }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: '4px' }} />
          <span style={{ lineHeight: '1.8' }}>Step1에서 설정한 기간, 업종의 집행 데이터가 있는 광고상품만 표시됩니다.</span>
        </div>
      )}

      <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden' }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '12px 16px',
          borderBottom: '1px solid hsl(var(--border))',
          backgroundColor: 'hsl(var(--muted) / 0.3)',
          fontSize: '13px', fontWeight: '600', color: 'hsl(var(--foreground))',
        }}>
          <Smartphone size={16} />
          매체 · 광고상품
        </div>

        <div style={{ padding: '16px' }}>
          {(readOnly ? selectedMediaList : MEDIA_LIST).map((media) => {
            const isSelected = value[media] !== undefined
            const selectedProducts = value[media] || []
            const Icon = mediaIconMap[media]

            return (
              <div key={media} style={{ marginBottom: '12px' }}>
                {/* 매체 행 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: '8px',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: isSelected ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                  borderRadius: '6px',
                  border: `1px solid ${isSelected ? 'hsl(var(--border))' : 'transparent'}`,
                }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={readOnly}
                    onChange={(e) => toggleMedia(media, e.target.checked)}
                    className="checkbox-custom"
                  />
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '13px', fontWeight: '500',
                    color: isSelected ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                  }}>
                    {Icon ? <Icon size={14} /> : null}
                    {media}
                  </div>
                  {isSelected && !readOnly && (
                    <button
                      onClick={() => openDialog(media)}
                      className="btn btn-sm"
                      style={{
                        fontSize: '12px', padding: '6px 12px', height: 'auto',
                        backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))',
                        border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500',
                      }}
                    >
                      <ListPlus size={14} />
                      상품 추가
                      {selectedProducts.length > 0 && (
                        <span style={{
                          backgroundColor: 'hsl(var(--background) / 0.2)', padding: '2px 6px',
                          borderRadius: '10px', fontSize: '11px', fontWeight: '600',
                        }}>
                          {selectedProducts.length}
                        </span>
                      )}
                    </button>
                  )}
                  {isSelected && readOnly && (
                    <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', fontWeight: '500' }}>
                      상품 {selectedProducts.length}개
                    </span>
                  )}
                </div>

                {/* 선택된 상품 리스트 (비중 입력창 제외) */}
                {isSelected && selectedProducts.length > 0 && (
                  <div style={{
                    marginTop: '8px', marginLeft: '40px', padding: '12px',
                    backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: '6px',
                    border: '1px solid hsl(var(--border))',
                  }}>
                    {selectedProducts.map((product, idx) => (
                      <div key={product} style={{
                        display: 'grid', gridTemplateColumns: readOnly ? '1fr' : '1fr 24px', gap: '8px', alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: idx < selectedProducts.length - 1 ? '1px solid hsl(var(--border))' : 'none',
                      }}>
                        <div style={{ fontSize: '12px', color: 'hsl(var(--foreground))' }}>{product}</div>
                        {!readOnly && (
                          <button
                            onClick={() => removeProduct(media, product)}
                            style={{
                              width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: 'none', backgroundColor: 'transparent', color: 'hsl(var(--muted-foreground))',
                              cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'hsl(var(--destructive) / 0.1)'
                              e.currentTarget.style.color = 'hsl(var(--destructive))'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = 'hsl(var(--muted-foreground))'
                            }}
                            title="상품 제거"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 매체 선택 + 상품 0개: 빈 상태 힌트 (조회 모달에선 숨김) */}
                {isSelected && selectedProducts.length === 0 && !readOnly && (
                  <div style={{
                    marginTop: '8px', marginLeft: '40px', padding: '20px',
                    textAlign: 'center', border: '1px dashed hsl(var(--border))',
                    borderRadius: '6px', backgroundColor: 'hsl(var(--muted) / 0.2)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  }}>
                    <ListPlus size={24} style={{ opacity: 0.5, color: 'hsl(var(--muted-foreground))' }} />
                    <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
                      '상품 추가' 버튼을 클릭하여 상품을 추가하세요
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* 매체 목록 하단: 상품 미선택 경고 (조회 모달에선 숨김) */}
          {!readOnly && (() => {
            const mediaWithoutProducts = selectedMediaList.filter(m => (value[m] || []).length === 0)
            if (mediaWithoutProducts.length === 0) return null
            return (
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '11px', color: 'hsl(var(--destructive))', padding: '8px', borderRadius: '4px' }}>
                  {mediaWithoutProducts.map(media => (
                    <div key={media}>• {media}: 최소 1개 이상의 상품을 선택해주세요.</div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      {!readOnly && validationActive && selectedMediaList.length === 0 && (
        <div style={{ fontSize: '11px', color: 'hsl(var(--destructive))', marginTop: '8px' }}>
          최소 1개 이상의 매체를 선택해주세요.
        </div>
      )}

      {/* 상품 선택 다이얼로그 (조회 모달에선 미사용) */}
      {!readOnly && (
        <ProductDialog
          dialog={dialog}
          setDialog={setDialog}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onConfirm={handleConfirm}
          period={period}
        />
      )}
    </div>
  )
}
