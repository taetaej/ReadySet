import { useState, useMemo } from 'react'
import { Lock, ChevronRight } from 'lucide-react'
import { BOAllocation } from './resultSampleData'

interface BOResultTableProps {
  allocations: BOAllocation[]
  lockedAllocations: BOAllocation[]
  kpiLabel: string
  resultView: 'locked' | 'pure'
  /** 총 도달(중복 제거) — 모델이 계산해 내려주는 값. 현재 뷰 기준. Estimated Total 행 Reach 표시용 */
  totalReach?: number
}

// 숫자 + 작고 흐린 단위 (Reach Caster formatWithUnit 방식)
const unitStyle: React.CSSProperties = { fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: 400 }
const withUnit = (v: number, unit: string) => (
  <>{v.toLocaleString()}<span style={unitStyle}>{unit}</span></>
)
const fmtBudget = (v: number) => withUnit(Math.round(v), '원')  // 정수 원 (Budget/CPM/CPC/CPV 공通)
const fmtCount = (v: number) => withUnit(v, '회')

// 0이면 하이픈 처리
const orDash = (v: number, formatter: (n: number) => React.ReactNode) => v ? formatter(v) : '-'

interface MediaGroup {
  mediaId: string
  mediaName: string
  products: BOAllocation[]
  budget: number
  ratio: number
  kpiValue: number
  impression: number
  click: number
  view: number
  reach: number
  cpm: number
  cpc: number
  cpv: number
  hasFixed: boolean
}

// 그리드 컬럼 정의 (헤더/바디 공통) — 풀 숫자+단위 표기 기준 폭
const GRID_COLS = '80px minmax(220px, 1fr) 150px 70px 150px 140px 120px 120px 90px 110px 100px 100px'

export function BOResultTable({ allocations, lockedAllocations, kpiLabel, resultView, totalReach }: BOResultTableProps) {
  const mediaGroups = useMemo<MediaGroup[]>(() => {
    const map = new Map<string, BOAllocation[]>()
    for (const a of allocations) {
      if (!map.has(a.mediaId)) map.set(a.mediaId, [])
      map.get(a.mediaId)!.push(a)
    }
    return Array.from(map.entries()).map(([mediaId, products]) => {
      const budget = products.reduce((s, p) => s + p.budget, 0)
      const impression = products.reduce((s, p) => s + p.impression, 0)
      const click = products.reduce((s, p) => s + p.click, 0)
      const view = products.reduce((s, p) => s + p.view, 0)
      const kpiValue = products.reduce((s, p) => s + p.kpiValue, 0)
      const ratio = products.reduce((s, p) => s + p.ratio, 0)
      const cpm = impression > 0 ? Math.round(budget / (impression / 1000)) : 0
      const cpc = click > 0 ? Math.round(budget / click) : 0
      const cpv = view > 0 ? Math.round(budget / view) : 0
      const reach = Math.max(...products.map(p => p.reach))
      return {
        mediaId, mediaName: products[0].mediaName, products,
        budget, ratio, kpiValue, impression, click, view, reach, cpm, cpc, cpv,
        hasFixed: products.some(p => p.isFixed)
      }
    }).sort((a, b) => b.budget - a.budget)
  }, [allocations])

  const allMediaIds = mediaGroups.map(g => g.mediaId)
  const [expanded, setExpanded] = useState<string[]>(allMediaIds)
  const isAllExpanded = expanded.length === allMediaIds.length

  const toggle = (mediaId: string) =>
    setExpanded(prev => (prev.includes(mediaId) ? prev.filter(m => m !== mediaId) : [...prev, mediaId]))
  const toggleAll = () => setExpanded(isAllExpanded ? [] : allMediaIds)

  const totals = mediaGroups.reduce(
    (acc, g) => ({
      budget: acc.budget + g.budget,
      impression: acc.impression + g.impression,
      click: acc.click + g.click,
      view: acc.view + g.view,
      kpiValue: acc.kpiValue + g.kpiValue
    }),
    { budget: 0, impression: 0, click: 0, view: 0, kpiValue: 0 }
  )

  const cell = (align: 'left' | 'right' = 'right'): React.CSSProperties => ({ padding: '12px 8px', textAlign: align })

  const BudgetCell = ({ amount, isFixed }: { amount: number; isFixed: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
      {isFixed && resultView === 'locked' && <Lock size={12} style={{ color: '#BF5AF2', flexShrink: 0 }} />}
      <span>{fmtBudget(amount)}</span>
    </div>
  )

  // 비중(%) 단위 표기 — Decimal(2): 항상 소수 2자리 고정 (3.7 → 3.70%)
  const pct = (v: number) => <>{v.toFixed(2)}<span style={unitStyle}>%</span></>

  const hasLocked = lockedAllocations.some(a => a.isFixed)

  // 잠금 해제 뷰에서 delta 계산용: lockedAllocations를 key로 매핑
  const lockedMap = useMemo(() => {
    const map = new Map<string, BOAllocation>()
    for (const a of lockedAllocations) map.set(`${a.mediaId}|${a.productName}`, a)
    return map
  }, [lockedAllocations])

  // delta 셀 표시 (잠금 해제 뷰에서만, 값이 다르면 화살표+차이 표시)
  const DeltaCell = ({ current, locked, formatter, isDelta }: { current: number; locked: number; formatter: (v: number) => React.ReactNode; isDelta?: 'won' | 'count' }) => {
    const diff = current - locked
    if (resultView === 'locked' || diff === 0) return <>{formatter(current)}</>
    const color = diff > 0 ? 'hsl(142 71% 45%)' : 'hsl(var(--destructive))'
    const deltaText = isDelta === 'won' ? formatDeltaWon(diff) : formatDeltaNum(diff)
    return (
      <div>
        <div>{formatter(current)}</div>
        <div style={{ fontSize: '10px', color, marginTop: '2px' }}>{deltaText}</div>
      </div>
    )
  }

  const formatDeltaWon = (v: number) => `${v > 0 ? '+' : ''}${v.toLocaleString()}원`
  const formatDeltaNum = (v: number) => `${v > 0 ? '+' : ''}${v.toLocaleString()}`

  return (
    <div>
      <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', fontFamily: 'Paperlogy, sans-serif', width: '100%', overflowX: 'auto' }} className="custom-scrollbar">
        <div style={{ minWidth: '1500px' }}>
          {/* 헤더 */}
          <div style={{ display: 'grid', gridTemplateColumns: GRID_COLS, backgroundColor: 'hsl(var(--muted))', borderBottom: '1px solid hsl(var(--border))', fontSize: '12px', fontWeight: '500' }}>
            <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button
                onClick={toggleAll}
                style={{ background: 'none', border: 'none', color: 'hsl(var(--foreground))', fontSize: '11px', fontWeight: '500', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', fontFamily: 'Paperlogy, sans-serif' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted-foreground) / 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {isAllExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>
            <div style={cell('left')}>매체 &gt; 상품</div>
            <div style={cell()}>Budget</div>
            <div style={cell()}>Share</div>
            <div style={cell()}>Guaranteed {kpiLabel}</div>
            <div style={cell()}>Impression</div>
            <div style={cell()}>Click</div>
            <div style={cell()}>View</div>
            <div style={cell()}>Reach</div>
            <div style={cell()}>CPM</div>
            <div style={cell()}>CPC</div>
            <div style={cell()}>CPV</div>
          </div>

          {/* 바디 */}
          {mediaGroups.map((g) => {
            const isExpanded = expanded.includes(g.mediaId)
            return (
              <div key={g.mediaId}>
                {/* 1depth: Media */}
                <div
                  onClick={() => toggle(g.mediaId)}
                  style={{ display: 'grid', gridTemplateColumns: GRID_COLS, backgroundColor: 'hsl(var(--muted) / 0.5)', borderBottom: '1px solid hsl(var(--border))', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'background-color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.7)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'}
                >
                  <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={16} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  </div>
                  <div style={{ ...cell('left'), minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span>{g.mediaName}</span>
                    <span style={{ fontSize: '11px', fontWeight: '400', color: 'hsl(var(--muted-foreground))', marginLeft: '6px' }}>({g.products.length})</span>
                  </div>
                  <div style={cell()}><BudgetCell amount={g.budget} isFixed={g.hasFixed} /></div>
                  <div style={cell()}>{pct(g.ratio)}</div>
                  <div style={cell()}>{orDash(g.kpiValue, fmtCount)}</div>
                  <div style={cell()}>{orDash(g.impression, fmtCount)}</div>
                  <div style={cell()}>{orDash(g.click, fmtCount)}</div>
                  <div style={cell()}>{orDash(g.view, fmtCount)}</div>
                  <div style={cell()}>{orDash(g.reach, fmtCount)}</div>
                  <div style={cell()}>{orDash(g.cpm, fmtBudget)}</div>
                  <div style={cell()}>{orDash(g.cpc, fmtBudget)}</div>
                  <div style={cell()}>{orDash(g.cpv, fmtBudget)}</div>
                </div>

                {/* 2depth: Product */}
                {isExpanded && g.products.map((p) => (
                  <div key={`${p.mediaId}-${p.productName}`} style={{ display: 'grid', gridTemplateColumns: GRID_COLS, borderBottom: '1px solid hsl(var(--border))', fontSize: '13px' }}>
                    <div />
                    <div style={{ ...cell('left'), color: 'hsl(var(--foreground))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.productName}>{p.productName}</div>
                    <div style={cell()}>
                      {(() => {
                        const locked = lockedMap.get(`${p.mediaId}|${p.productName}`)
                        if (resultView === 'pure' && locked) {
                          return <DeltaCell current={p.budget} locked={locked.budget} formatter={fmtBudget} isDelta="won" />
                        }
                        return <BudgetCell amount={p.budget} isFixed={p.isFixed} />
                      })()}
                    </div>
                    <div style={cell()}>
                      {(() => {
                        const locked = lockedMap.get(`${p.mediaId}|${p.productName}`)
                        if (resultView === 'pure' && locked && locked.ratio !== p.ratio) {
                          const diff = p.ratio - locked.ratio
                          return <div><div>{pct(p.ratio)}</div><div style={{ fontSize: '10px', color: diff > 0 ? 'hsl(142 71% 45%)' : 'hsl(var(--destructive))', marginTop: '2px' }}>{diff > 0 ? '+' : ''}{diff.toFixed(2)}%p</div></div>
                        }
                        return pct(p.ratio)
                      })()}
                    </div>
                    <div style={cell()}>
                      {(() => {
                        const locked = lockedMap.get(`${p.mediaId}|${p.productName}`)
                        if (resultView === 'pure' && locked) {
                          return <DeltaCell current={p.kpiValue} locked={locked.kpiValue} formatter={fmtCount} isDelta="count" />
                        }
                        return orDash(p.kpiValue, fmtCount)
                      })()}
                    </div>
                    <div style={{ ...cell(), color: 'hsl(var(--muted-foreground))' }}>{orDash(p.impression, fmtCount)}</div>
                    <div style={{ ...cell(), color: 'hsl(var(--muted-foreground))' }}>{orDash(p.click, fmtCount)}</div>
                    <div style={{ ...cell(), color: 'hsl(var(--muted-foreground))' }}>{orDash(p.view, fmtCount)}</div>
                    <div style={{ ...cell(), color: 'hsl(var(--muted-foreground))' }}>{orDash(p.reach, fmtCount)}</div>
                    <div style={{ ...cell(), color: 'hsl(var(--muted-foreground))' }}>{orDash(p.cpm, fmtBudget)}</div>
                    <div style={{ ...cell(), color: 'hsl(var(--muted-foreground))' }}>{orDash(p.cpc, fmtBudget)}</div>
                    <div style={{ ...cell(), color: 'hsl(var(--muted-foreground))' }}>{orDash(p.cpv, fmtBudget)}</div>
                  </div>
                ))}
              </div>
            )
          })}

          {/* 합계 */}
          {(() => {
            const lockedTotals = {
              budget: lockedAllocations.reduce((s, a) => s + a.budget, 0),
              kpiValue: lockedAllocations.reduce((s, a) => s + a.kpiValue, 0)
            }
            const budgetDiff = totals.budget - lockedTotals.budget
            const kpiDiff = totals.kpiValue - lockedTotals.kpiValue
            const avgCpm = totals.impression > 0 ? Math.round(totals.budget / (totals.impression / 1000)) : 0
            const avgCpc = totals.click > 0 ? Math.round(totals.budget / totals.click) : 0
            const avgCpv = totals.view > 0 ? Math.round(totals.budget / totals.view) : 0
            return (
              <div style={{ display: 'grid', gridTemplateColumns: GRID_COLS, backgroundColor: 'hsl(var(--muted))', borderTop: '2px solid hsl(var(--foreground))', fontSize: '13px', fontWeight: '600' }}>
                <div />
                <div style={cell('left')}>Estimated Total</div>
                <div style={cell()}>
                  {resultView === 'pure' && budgetDiff !== 0 ? (
                    <div>
                      <div>{fmtBudget(totals.budget)}</div>
                      <div style={{ fontSize: '10px', color: budgetDiff > 0 ? 'hsl(142 71% 45%)' : 'hsl(var(--destructive))', marginTop: '2px' }}>{formatDeltaWon(budgetDiff)}</div>
                    </div>
                  ) : fmtBudget(totals.budget)}
                </div>
                <div style={cell()}>{pct(100)}</div>
                <div style={cell()}>
                  {resultView === 'pure' && kpiDiff !== 0 ? (
                    <div>
                      <div>{orDash(totals.kpiValue, fmtCount)}</div>
                      <div style={{ fontSize: '10px', color: kpiDiff > 0 ? 'hsl(142 71% 45%)' : 'hsl(var(--destructive))', marginTop: '2px' }}>{formatDeltaNum(kpiDiff)}</div>
                    </div>
                  ) : orDash(totals.kpiValue, fmtCount)}
                </div>
                <div style={cell()}>{orDash(totals.impression, fmtCount)}</div>
                <div style={cell()}>{orDash(totals.click, fmtCount)}</div>
                <div style={cell()}>{orDash(totals.view, fmtCount)}</div>
                <div style={cell()}>{totalReach ? fmtCount(totalReach) : '-'}</div>
                <div style={cell()}>{orDash(avgCpm, fmtBudget)}</div>
                <div style={cell()}>{orDash(avgCpc, fmtBudget)}</div>
                <div style={cell()}>{orDash(avgCpv, fmtBudget)}</div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
