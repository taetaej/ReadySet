import { ACProductName } from './ACProductName'
import type { ACAltCard, ACCurationResult, ACResultItem } from './resultTypes'

const ALT_LABELS: Record<ACAltCard['kind'], { en: string; ko: string }> = {
  industryFavorite: { en: 'Industry Favorite', ko: '같은 업종에서 많이 쓴' },
  topPerformer: { en: 'Top Performer', ko: '효율이 가장 좋은' }
}

interface ACResultHighlightsProps {
  result: ACCurationResult
}

/**
 * Curation Highlights (화면정의서 4장)
 * 왕중왕 카드 2~3개를 세로로 쌓은 가로형 카드. hover·클릭 동작 없음(정적 요약).
 * Best Fit 개수는 목록 헤더에서 보여 줌
 */
export function ACResultHighlights({ result }: ACResultHighlightsProps) {
  const byId = new Map(result.items.map(i => [i.id, i]))
  const bestMatch = byId.get(result.bestMatchId)!
  const alts = result.altCards.filter(c => byId.has(c.itemId))

  return (
    <div className="flex flex-col min-w-0">
      {/* 헤더: 우측 차트와 같은 제목 위계 */}
      <div className="mb-5">
        <h3 className="text-[20px] font-medium leading-[28px] font-[Paperlogy,sans-serif] m-0 text-[hsl(var(--foreground))]">Curation Highlights</h3>
      </div>

      {/* 세로 스택: 카드 1장 = 가로로 긴 한 줄 (좌 라벨 · 우 매체·상품) */}
      <div className="flex flex-col gap-3">
        {/* Best Match: 강조 타일(muted 배경) */}
        <ProductTile item={bestMatch} title="Best Match" subtitle="캠페인에 딱 맞는" highlighted />

        {alts.map(card => {
          const label = ALT_LABELS[card.kind]
          return (
            <ProductTile
              key={`${card.kind}-${card.itemId}`}
              item={byId.get(card.itemId)!}
              title={label.en}
              subtitle={label.ko}
            />
          )
        })}
      </div>
    </div>
  )
}

interface ProductTileProps {
  item: ACResultItem
  title: string
  subtitle: string
  highlighted?: boolean
}

/** 가로형 카드: 좌 라벨(제목·부제) | 우 매체명 → 상품명 */
function ProductTile({ item, title, subtitle, highlighted }: ProductTileProps) {
  return (
    <div
      className={`min-w-0 overflow-hidden rounded-xl border border-[hsl(var(--border))] px-5 py-4 grid grid-cols-[148px_minmax(0,1fr)] items-center gap-x-5
        ${highlighted ? 'bg-[hsl(var(--muted))]' : 'bg-[hsl(var(--card))]'}`}
    >
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-[hsl(var(--foreground))] font-[Paperlogy,sans-serif] line-clamp-2">{title}</div>
        <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-[2px] line-clamp-2">{subtitle}</div>
      </div>
      <div className="min-w-0">
        <div className="text-[12px] text-[hsl(var(--muted-foreground))] truncate">{item.mediaName}</div>
        <div className="mt-[2px] text-[17px] font-bold leading-[1.5] text-[hsl(var(--foreground))] font-[Paperlogy,sans-serif] line-clamp-2">
          <ACProductName name={item.productName} />
        </div>
      </div>
    </div>
  )
}
