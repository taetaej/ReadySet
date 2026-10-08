// 협력 광고 파트너사 선택 (Meta 단일 선택 시, 광고상품 기준 Step2)
// 조건 조합의 상품 구조(adProductStructureByMedia['Meta'].collaborativePartner)를 소스로 사용.
// 아코디언 + 검색 + 전체선택 + 체크박스 그리드 (타겟팅 옵션과 동일 룩앤필).
import { useState, useEffect } from 'react'
import { Plus, Minus, Search, X } from 'lucide-react'
import { adProductStructureByMedia } from './sampleData'

function getPartnerOptions(): string[] {
  const metaFields = adProductStructureByMedia['Meta']?.fields ?? []
  const opts = metaFields.find(f => f.key === 'collaborativePartner')?.options ?? []
  // options는 string[] | AdProductOption[] 유니온 → 문자열만 추출
  return opts.map((o: unknown) => (typeof o === 'string' ? o : (o as { value?: string; label?: string }).value ?? (o as { label?: string }).label ?? '')).filter(Boolean)
}

// 문자열 → 결정적 해시 (목업: 같은 입력엔 항상 같은 결과)
function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

// [MOCKUP] 선택한 광고상품에 "집행 데이터가 있는" 파트너사만 노출.
// 실제로는 백엔드가 상품별 데이터 유무로 필터하지만, 목업에서는 상품명 해시로
// 결정적 서브셋을 산출한다. 여러 상품을 고르면 각 상품의 파트너사 합집합.
export function getAvailablePartners(allPartners: string[], selectedProducts: string[]): string[] {
  if (selectedProducts.length === 0) return []
  const available = new Set<string>()
  selectedProducts.forEach(product => {
    allPartners.forEach((partner, idx) => {
      // 상품+파트너사 조합 해시가 짝수면 "데이터 있음"으로 간주 (약 절반 노출)
      if (hashString(`${product}::${partner}::${idx}`) % 2 === 0) available.add(partner)
    })
  })
  // 아무것도 안 걸리면 최소 1개는 보장 (빈 목록 방지)
  if (available.size === 0 && selectedProducts.length > 0) {
    const seed = hashString(selectedProducts.join('|'))
    available.add(allPartners[seed % allPartners.length])
  }
  // 원래 순서 유지
  return allPartners.filter(p => available.has(p))
}

interface Props {
  selected: string[]
  onChange: (next: string[]) => void
  // 타겟팅에서 '기기유형' 사용 중이면 비활성(상호 배제)
  locked?: boolean
  lockHint?: string
  // 선택한 광고상품 목록. 비어있으면 "광고상품 먼저 선택" 안내.
  // 선택 상품에 데이터가 있는 파트너사만 노출된다.
  selectedProducts: string[]
}

export function CollaborativePartnerSelect({ selected, onChange, locked = false, lockHint, selectedProducts }: Props) {
  const allPartners = getPartnerOptions()
  const productSelected = selectedProducts.length > 0
  // 선택 상품에 데이터가 있는 파트너사만
  const options = getAvailablePartners(allPartners, selectedProducts)
  // 이미 선택한 값이 있으면 기본 열림 (스텝 이동 후 재마운트 시 열림 유지)
  const [open, setOpen] = useState(selected.length > 0)
  const [search, setSearch] = useState('')

  // 노출 목록에서 빠진 선택 파트너사는 자동 정리
  useEffect(() => {
    const invalid = selected.filter(s => !options.includes(s))
    if (invalid.length > 0) {
      onChange(selected.filter(s => options.includes(s)))
    }
  }, [options.join('|')]) // eslint-disable-line react-hooks/exhaustive-deps

  // 잠기면 아코디언 강제 닫힘
  const effectiveOpen = locked ? false : open
  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
  const allSelected = filtered.length > 0 && filtered.every(o => selected.includes(o))

  const toggle = (o: string) => {
    if (locked || !productSelected) return
    onChange(selected.includes(o) ? selected.filter(v => v !== o) : [...selected, o])
  }

  return (
    <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden', opacity: locked ? 0.6 : 1 }}>
      {/* 헤더: 펼침 + 제목 + (펼침 시)검색·전체선택 */}
      <div
        onClick={() => { if (!locked) setOpen(o => !o) }}
        style={{
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
          cursor: locked ? 'not-allowed' : 'pointer',
          backgroundColor: effectiveOpen ? 'hsl(var(--muted) / 0.2)' : 'transparent',
          borderBottom: effectiveOpen ? '1px solid hsl(var(--border))' : 'none',
          transition: 'background 0.15s',
        }}
      >
        <span style={{
          width: '20px', height: '20px', borderRadius: '4px',
          border: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: 'hsl(var(--muted-foreground))',
        }}>
          {effectiveOpen ? <Minus size={12} /> : <Plus size={12} />}
        </span>
        <span style={{ fontSize: '13px', fontWeight: '500', flex: 1 }}>협력 광고 파트너사</span>
        {locked && lockHint && (
          <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>{lockHint}</span>
        )}
        {effectiveOpen && productSelected && (
          <>
            <div style={{ position: 'relative', width: '140px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
              <Search size={11} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))', pointerEvents: 'none' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="검색"
                className="input"
                style={{ width: '100%', height: '26px', fontSize: '11px', paddingLeft: '24px', paddingRight: search ? '24px' : '8px' }} />
              {search && (
                <button onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--muted-foreground))', padding: '2px', display: 'flex', alignItems: 'center' }}>
                  <X size={11} />
                </button>
              )}
            </div>
            <button
              onClick={e => { e.stopPropagation(); onChange(allSelected ? selected.filter(s => !filtered.includes(s)) : [...new Set([...selected, ...filtered])]) }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '11px', flexShrink: 0 }}
            >
              {allSelected ? '전체 해제' : '전체 선택'}
            </button>
          </>
        )}
      </div>

      {/* 콘텐츠 */}
      {effectiveOpen && (
        !productSelected ? (
          <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
            광고상품을 먼저 선택해주세요.
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
            검색 결과가 없습니다.
          </div>
        ) : (
          <div style={{ padding: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {filtered.map(o => {
                const isSelected = selected.includes(o)
                return (
                  <label key={o} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px',
                    backgroundColor: isSelected ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                    transition: 'background 0.1s',
                  }}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggle(o)} className="checkbox-custom" style={{ flexShrink: 0 }} />
                    <span style={{ color: 'hsl(var(--foreground))', fontWeight: isSelected ? '500' : '400' }}>{o}</span>
                  </label>
                )
              })}
            </div>
          </div>
        )
      )}
    </div>
  )
}
