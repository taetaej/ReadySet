import { ArrowLeft, Users, Calendar, DollarSign, CheckCircle, AlertTriangle, XCircle, TrendingUp, TrendingDown, ChevronDown, ChevronUp, RefreshCw, Share2, FileSpreadsheet } from 'lucide-react'
import { useState } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line, Cell, Area, CartesianGrid } from 'recharts'
import { SpinXButton } from '../spinx/SpinXButton'
import { SpinXPanel } from '../spinx/SpinXPanel'

interface ComparisonScenario {
  id: string
  name: string
  condition?: string
  budget?: number
  period?: { start: string; end: string }
  targetGrp?: string[]
}

type IntegrityLevel = 'optimal' | 'caution' | 'risk'

interface ScenarioComparisonResultProps {
  isOpen: boolean
  onClose: () => void
  onNewComparison: () => void
  baseScenario: {
    id: string
    name: string
    budget?: number
    period?: { start: string; end: string }
    targetGrp?: string[]
  }
  comparisonScenarios: ComparisonScenario[]
  comparisonType?: string
  integrityLevel?: IntegrityLevel
  isDarkMode?: boolean
}

const comparisonTypeLabels: Record<string, { title: string; subtitle: string; icon: any }> = {
  target: { title: '타겟 비교', subtitle: 'Target Analysis', icon: Users },
  period: { title: '기간 비교', subtitle: 'Period Analysis', icon: Calendar },
  budget: { title: '예산 비교', subtitle: 'Budget Scaling', icon: DollarSign }
}

const integrityConfig = {
  optimal: { color: 'hsl(var(--muted-foreground))', label: '비교 적합', desc: '권장 조건이 일치하여 신뢰도 높은 비교가 가능합니다.', icon: CheckCircle },
  caution: { color: 'hsl(38 92% 50%)', label: '조건 일부 상이', desc: '일부 권장 조건이 다릅니다. 결과 해석 시 차이를 감안해 주세요.', icon: AlertTriangle },
  risk: { color: 'hsl(var(--destructive))', label: '비교 부적합', desc: '권장 조건이 대부분 상이하여 비교 결과의 신뢰도가 낮을 수 있습니다.', icon: XCircle }
}

// ── 더미 데이터 ──
interface ScenarioMetrics {
  reach1: number; reach2: number; reach3: number; reach4: number; reach5: number
  reachCount: number; avgFrequency: number; effectiveImpression: number; cprp: number
  grps: number; impression: number; totalBudget: number; tvcRatio: number; digitalRatio: number
  channelBudgets: { name: string; ratio: number }[]
  targetGrp: number; periodDays: number; targetPopulation: number
}

function generateDummyMetrics(_index: number, budget: number, period?: { start: string; end: string }, targetGrp?: string[]): ScenarioMetrics {
  const days = period ? Math.round((new Date(period.end).getTime() - new Date(period.start).getTime()) / 86400000) : 91
  const targets = targetGrp || []
  const targetKey = targets.join(',')
  type Profile = { pop: number; r1: number; r3: number; freq: number; cprp: number; effImp: number; grps: number; tvc: number }
  const profiles: Record<string, Profile> = {
    '남성 25~29세,남성 30~34세': { pop: 4800000, r1: 73.2, r3: 45.6, freq: 3.5, cprp: 3900000, effImp: 12800000, grps: 256.2, tvc: 45 },
    '여성 25~29세,여성 30~34세': { pop: 5100000, r1: 68.5, r3: 41.2, freq: 3.8, cprp: 4250000, effImp: 11200000, grps: 238.7, tvc: 42 },
    '남성 20~24세,남성 25~29세,여성 20~24세,여성 25~29세': { pop: 8900000, r1: 62.1, r3: 36.8, freq: 4.2, cprp: 3150000, effImp: 16500000, grps: 310.4, tvc: 38 },
    '전체': { pop: 12500000, r1: 55.8, r3: 30.4, freq: 4.8, cprp: 2800000, effImp: 21000000, grps: 345.0, tvc: 40 },
    '여성 20~24세,여성 25~29세': { pop: 4200000, r1: 70.8, r3: 43.5, freq: 3.6, cprp: 4100000, effImp: 11800000, grps: 245.0, tvc: 43 },
    '남성 35~39세,남성 40~44세': { pop: 5500000, r1: 65.3, r3: 38.9, freq: 3.3, cprp: 4500000, effImp: 10500000, grps: 228.5, tvc: 48 },
    '여성 30~34세,여성 35~39세': { pop: 5300000, r1: 66.9, r3: 40.1, freq: 3.7, cprp: 4350000, effImp: 11000000, grps: 235.2, tvc: 44 },
    '남성 30~34세,남성 35~39세,여성 30~34세,여성 35~39세': { pop: 9200000, r1: 60.4, r3: 35.2, freq: 4.0, cprp: 3300000, effImp: 15800000, grps: 298.6, tvc: 41 },
    '남성 20~24세': { pop: 2800000, r1: 78.5, r3: 50.2, freq: 3.2, cprp: 4800000, effImp: 9500000, grps: 215.0, tvc: 46 },
    '여성 40~44세,여성 45~49세': { pop: 6100000, r1: 58.2, r3: 33.1, freq: 3.4, cprp: 4650000, effImp: 9800000, grps: 220.8, tvc: 50 }
  }
  const p = profiles[targetKey] || { pop: 5200000, r1: 70.0, r3: 43.0, freq: 3.6, cprp: 3800000, effImp: 13000000, grps: 260.0, tvc: 44 }

  // 예산 스케일링: 기준 10억 대비 예산 비율로 지표 조정 (수확 체감 반영)
  const baseBudgetRef = 1000000000
  const budgetRatio = budget / baseBudgetRef
  // 로그 스케일로 수확 체감 (예산 2배 → reach ~1.15배, 예산 0.5배 → reach ~0.85배)
  const reachScale = Math.pow(budgetRatio, 0.22)
  const freqScale = Math.pow(budgetRatio, 0.35)
  const grpScale = Math.pow(budgetRatio, 0.55)
  // CPRP는 예산 증가 시 비효율 증가 (수확 체감)
  const cprpScale = Math.pow(budgetRatio, 0.45)

  const scaledR1 = Math.min(p.r1 * reachScale, 95)
  const scaledR3 = Math.min(p.r3 * reachScale, 85)
  const scaledFreq = p.freq * freqScale
  const scaledGrps = p.grps * grpScale
  const scaledCprp = p.cprp * cprpScale
  const scaledEffImp = Math.round(p.effImp * grpScale)

  return {
    reach1: scaledR1, reach2: scaledR1 * 0.80, reach3: scaledR3, reach4: scaledR3 * 0.77, reach5: scaledR3 * 0.61,
    reachCount: Math.round(p.pop * (scaledR1 / 100)), avgFrequency: scaledFreq,
    effectiveImpression: scaledEffImp, cprp: Math.round(scaledCprp), grps: scaledGrps,
    impression: Math.round(scaledEffImp * 1.45), totalBudget: budget,
    tvcRatio: p.tvc, digitalRatio: 100 - p.tvc,
    channelBudgets: [
      { name: 'Google Ads', ratio: Math.round((100 - p.tvc) * 0.50) },
      { name: 'Meta', ratio: Math.round((100 - p.tvc) * 0.28) },
      { name: 'Naver GFA', ratio: Math.round((100 - p.tvc) * 0.22) },
      { name: '지상파', ratio: Math.round(p.tvc * 0.40) },
      { name: 'CJ ENM', ratio: Math.round(p.tvc * 0.35) },
      { name: 'JTBC', ratio: Math.round(p.tvc * 0.25) }
    ],
    targetGrp: scaledGrps * 0.72, periodDays: days, targetPopulation: p.pop
  }
}

function DiffIndicator({ value, inverse = false, format }: { value: number; inverse?: boolean; format?: (v: number) => string }) {
  if (Math.abs(value) < 0.01) return <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>—</span>
  const isPositive = value > 0
  const isGood = inverse ? !isPositive : isPositive
  const Icon = isPositive ? TrendingUp : TrendingDown
  const display = format ? format(value) : `${isPositive ? '+' : ''}${value.toFixed(1)}`
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: isGood ? 'hsl(142.1 76.2% 36.3%)' : 'hsl(var(--destructive))' }}>
      <Icon size={10} />{display}
    </span>
  )
}

function getConditionDiffs(base: ScenarioComparisonResultProps['baseScenario'], scenario: ComparisonScenario, comparisonType?: string): string[] {
  const diffs: string[] = []
  // 비교 유형에 해당하는 변수는 diff에서 제외 (해당 변수가 다른 건 정상)
  const excludeMap: Record<string, string> = { target: '타겟', period: '기간', budget: '예산' }
  const excludeKey = comparisonType ? excludeMap[comparisonType] : undefined

  const baseBudget = base.budget || 1000000000
  const sBudget = scenario.budget || 0
  if (sBudget && Math.abs(baseBudget - sBudget) / baseBudget >= 0.05) diffs.push('예산')
  const basePeriod = base.period || { start: '2024-10-01', end: '2024-12-31' }
  const sPeriod = scenario.period || { start: '', end: '' }
  if (basePeriod.start !== sPeriod.start || basePeriod.end !== sPeriod.end) diffs.push('기간')
  const baseTarget = base.targetGrp || []
  const sTarget = scenario.targetGrp || []
  if (JSON.stringify([...baseTarget].sort()) !== JSON.stringify([...sTarget].sort())) diffs.push('타겟')

  return excludeKey ? diffs.filter(d => d !== excludeKey) : diffs
}

// ── 버블 차트: Recharts ScatterChart ──
function ReachCPRPChart({ allData, labels, targetLabels }: {
  allData: ScenarioMetrics[]
  labels: string[]
  targetLabels: string[][]
}) {
  const scatterData = allData.map((m, i) => ({
    x: m.reach1, y: m.cprp, z: m.targetPopulation,
    label: labels[i], target: targetLabels[i]?.join(', ') || '—',
    reachCount: m.reachCount, idx: i
  }))

  const opacities = [0.9, 0.55, 0.4, 0.3, 0.25, 0.2, 0.18, 0.15, 0.13, 0.11]

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div style={{
        background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
        borderRadius: '8px', padding: '12px', fontFamily: 'Paperlogy, sans-serif',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', maxWidth: '280px'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>{d.label}</div>
        <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '8px', lineHeight: '1.4' }}>{d.target}</div>
        <div style={{ fontSize: '11px', lineHeight: '1.8' }}>
          <div>Reach 1+: <span style={{ fontWeight: '600' }}>{d.x.toFixed(1)}%</span></div>
          <div>CPRP: <span style={{ fontWeight: '600' }}>₩{d.y.toLocaleString('ko-KR')}</span></div>
        </div>
        <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', lineHeight: '1.8', marginTop: '4px' }}>
          <div>Target Population: {d.z.toLocaleString('ko-KR')}</div>
          <div>Reach Count: {d.reachCount.toLocaleString('ko-KR')}</div>
        </div>
      </div>
    )
  }

  const minPop = Math.min(...allData.map(m => m.targetPopulation))
  const maxPop = Math.max(...allData.map(m => m.targetPopulation))

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 20, right: 24, bottom: 20, left: 0 }}>
        <XAxis
          dataKey="x" type="number" name="Reach 1+"
          tickFormatter={v => `${v}%`}
          stroke="#e4e4e7" tick={{ fill: '#71717a', fontSize: 11 }}
          label={{ value: 'Reach 1+ (%)', position: 'bottom', offset: 0, style: { fill: '#71717a', fontSize: 11 } }}
        />
        <YAxis
          dataKey="y" type="number" name="CPRP"
          tickFormatter={v => `${(v / 1000000).toFixed(1)}M`}
          stroke="#e4e4e7" tick={{ fill: '#71717a', fontSize: 11 }}
          width={56}
          label={{ value: 'CPRP (원)', angle: 0, position: 'top', offset: 8, style: { fill: '#71717a', fontSize: 12, fontWeight: 500, textAnchor: 'start' } }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d4d4d8', strokeWidth: 1, strokeDasharray: '3 3' }} wrapperStyle={{ outline: 'none' }} />
        <Scatter data={scatterData} shape={(props: any) => {
          const { cx, cy, payload } = props
          const pop = payload.z
          const r = 12 + ((pop - minPop) / (maxPop - minPop || 1)) * 18
          const isBase = payload.idx === 0
          const fillColor = isBase ? '#00ff9d' : 'hsl(var(--foreground))'
          return (
            <g>
              <circle cx={cx} cy={cy} r={r} fill={fillColor} opacity={isBase ? 0.25 : (opacities[payload.idx] || 0.1)} />
              <circle cx={cx} cy={cy} r={3} fill={fillColor} opacity={isBase ? 1 : 0.8} />
            </g>
          )
        }} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}

// ── 바/라인 콤보 차트: Recharts ComposedChart ──
function PerformanceComboChart({ allData, labels }: {
  allData: ScenarioMetrics[]
  labels: string[]
}) {
  const comboData = allData.map((m, i) => ({
    name: labels[i], reach1: m.reach1, avgFreq: m.avgFrequency, idx: i
  }))

  const opacities = [0.85, 0.5, 0.35, 0.25, 0.2, 0.18, 0.15, 0.13, 0.11, 0.1]

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div style={{
        background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
        borderRadius: '8px', padding: '12px', fontFamily: 'Paperlogy, sans-serif',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>{d.name}</div>
        <div style={{ fontSize: '11px', lineHeight: '1.8' }}>
          <div>Reach 1+: <span style={{ fontWeight: '600' }}>{d.reach1.toFixed(1)}%</span></div>
          <div>Avg. Frequency: <span style={{ fontWeight: '600' }}>{d.avgFreq.toFixed(1)}회</span></div>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={comboData} margin={{ top: 20, right: 24, bottom: 20, left: 0 }}>
        <XAxis
          dataKey="name" stroke="#e4e4e7"
          tick={{ fill: '#71717a', fontSize: 11 }}
        />
        <YAxis
          yAxisId="left" tickFormatter={v => `${v}%`}
          stroke="#e4e4e7" tick={{ fill: '#71717a', fontSize: 11 }}
          width={44}
          label={{ value: 'Reach 1+', angle: 0, position: 'top', offset: 8, style: { fill: '#71717a', fontSize: 12, fontWeight: 500, textAnchor: 'start' } }}
        />
        <YAxis
          yAxisId="right" orientation="right"
          tickFormatter={v => `${v.toFixed(1)}회`}
          stroke="#e4e4e7" tick={{ fill: '#71717a', fontSize: 11 }}
          width={48}
          label={{ value: 'Avg. Freq', angle: 0, position: 'top', offset: 8, style: { fill: '#71717a', fontSize: 12, fontWeight: 500, textAnchor: 'end' } }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d4d4d8', strokeWidth: 1, strokeDasharray: '3 3' }} wrapperStyle={{ outline: 'none' }} />
        <Bar yAxisId="left" dataKey="reach1" radius={[4, 4, 0, 0]} maxBarSize={36}>
          {comboData.map((_, i) => (
            <Cell key={i} fill={i === 0 ? '#00ff9d' : 'hsl(var(--foreground))'} opacity={i === 0 ? 0.8 : (opacities[i] || 0.1)} />
          ))}
        </Bar>
        <Line
          yAxisId="right" dataKey="avgFreq" type="monotone"
          stroke="hsl(var(--foreground))" strokeWidth={2}
          dot={{ r: 3.5, fill: 'hsl(var(--foreground))', stroke: 'hsl(var(--foreground))', strokeWidth: 1.5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

// ── 스택바 (매체별 예산 비중) ──
function StackedBar({ channels, totalBudget }: { channels: { name: string; ratio: number }[]; totalBudget: number }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const colors = ['hsl(var(--foreground))', 'hsl(var(--muted-foreground))', 'hsl(var(--muted-foreground) / 0.55)', 'hsl(var(--muted-foreground) / 0.35)', 'hsl(var(--muted-foreground) / 0.2)', 'hsl(var(--muted-foreground) / 0.12)']

  const getTooltipLeft = (idx: number) => {
    let offset = 0
    for (let i = 0; i < idx; i++) offset += channels[i].ratio
    return offset + channels[idx].ratio / 2
  }

  // 상위 2개 매체 라벨
  const top2 = [...channels].sort((a, b) => b.ratio - a.ratio).slice(0, 2)

  return (
    <div style={{ position: 'relative', marginTop: '8px' }}>
      <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
        {channels.map((ch, ci) => (
          <div
            key={ci}
            onMouseEnter={() => setHovered(ci)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: `${ch.ratio}%`, height: '100%',
              backgroundColor: colors[ci] || colors[colors.length - 1],
              cursor: 'pointer', transition: 'opacity 0.15s'
            }}
          />
        ))}
      </div>
      {/* 상위 2개 매체 라벨 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
        {top2.map((ch, i) => {
          const colorIdx = channels.findIndex(c => c.name === ch.name)
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: colors[colorIdx] || colors[0], flexShrink: 0 }} />
              <span style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>{ch.name} {ch.ratio}%</span>
            </div>
          )
        })}
        {channels.length > 2 && (
          <span style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground) / 0.6)' }}>외 {channels.length - 2}개</span>
        )}
      </div>
      {hovered !== null && (
        <div style={{
          position: 'absolute', bottom: '32px', left: `${getTooltipLeft(hovered)}%`, transform: 'translateX(-50%)',
          background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
          borderRadius: '6px', padding: '8px 12px', whiteSpace: 'nowrap', zIndex: 10,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'Paperlogy, sans-serif'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '2px' }}>{channels[hovered].name}</div>
          <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>{channels[hovered].ratio}%</div>
          <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>₩{Math.round(totalBudget * channels[hovered].ratio / 100).toLocaleString('ko-KR')}</div>
        </div>
      )}
    </div>
  )
}

// ── 예산 비교: 통합 리치커브 (시나리오별 S-curve) ──
function UnifiedReachCurve({ allData, labels }: { allData: ScenarioMetrics[]; labels: string[] }) {
  // 각 시나리오의 예산을 기준으로 리치커브 데이터 생성
  // X축: 예산 (3억~18억), Y축: 예측 Reach 1+
  const minBudget = 300000000
  const maxBudget = 1800000000
  const interval = 150000000

  const budgetPoints: number[] = []
  for (let b = minBudget; b <= maxBudget; b += interval) budgetPoints.push(b)

  // 각 시나리오별 커브 데이터 생성 (S-curve, 시나리오 예산 근처에서 실제 reach 값과 일치하도록)
  const curveData = budgetPoints.map(budget => {
    const point: any = { budget, budgetLabel: `${(budget / 100000000).toFixed(1)}억` }
    allData.forEach((m, i) => {
      const normalized = (budget - minBudget) / (maxBudget - minBudget)
      // 시나리오의 실제 reach를 기준으로 S-curve 생성
      const baseReach = m.reach1 * 0.75 // 최소 예산에서의 reach
      const maxReach = Math.min(95, m.reach1 * 1.15) // 최대 예산에서의 reach
      const reach = baseReach + ((maxReach - baseReach) / (1 + Math.exp(-8 * (normalized - 0.45))))
      point[`reach_${i}`] = Math.round(reach * 10) / 10
    })
    return point
  })

  // 기준 시나리오의 예측 범위 (신뢰 구간)
  const baseData = curveData.map(d => {
    const reach = d.reach_0
    const normalized = (d.budget - minBudget) / (maxBudget - minBudget)
    const uncertainty = 3 + (normalized * 2)
    return {
      ...d,
      upperBound: Math.min(95, reach + uncertainty),
      lowerBound: Math.max(40, reach - uncertainty)
    }
  })

  const lineColors = ['#00ff9d', 'hsl(var(--foreground))', 'hsl(var(--muted-foreground))', 'hsl(var(--muted-foreground) / 0.5)']
  const lineOpacities = [1, 0.7, 0.5, 0.35]

  // 각 시나리오의 실제 예산 위치에 마커 표시
  const scenarioMarkers = allData.map((m, i) => ({
    budget: m.totalBudget,
    reach: curveData.reduce((closest, d) =>
      Math.abs(d.budget - m.totalBudget) < Math.abs(closest.budget - m.totalBudget) ? d : closest
    , curveData[0])[`reach_${i}`] as number,
    label: labels[i], idx: i
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div style={{
        background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
        borderRadius: '8px', padding: '12px', fontFamily: 'Paperlogy, sans-serif',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
          예산: ₩{d.budget.toLocaleString('ko-KR')}
        </div>
        <div style={{ fontSize: '11px', lineHeight: '1.8' }}>
          {allData.map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: lineColors[i], flexShrink: 0 }} />
              <span style={{ color: 'hsl(var(--muted-foreground))' }}>{labels[i]}:</span>
              <span style={{ fontWeight: '600', marginLeft: 'auto' }}>{d[`reach_${i}`]}%</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={360}>
      <ComposedChart data={baseData} margin={{ top: 20, right: 24, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} horizontal={false} />
        <XAxis
          dataKey="budget" type="number"
          domain={[minBudget, maxBudget]}
          tickFormatter={v => `${(v / 100000000).toFixed(1)}억`}
          stroke="hsl(var(--border))" tick={{ fill: '#71717a', fontSize: 11 }}
        />
        <YAxis
          tickFormatter={v => `${v}%`}
          stroke="hsl(var(--border))" tick={{ fill: '#71717a', fontSize: 11 }}
          width={50}
          label={{ value: '예측 Reach (%)', angle: 0, position: 'top', offset: 8, style: { fill: '#71717a', fontSize: 12, fontWeight: 500, textAnchor: 'start' } }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d4d4d8', strokeWidth: 1, strokeDasharray: '3 3' }} wrapperStyle={{ outline: 'none' }} />

        {/* 기준 시나리오 신뢰 구간 */}
        <Area type="monotone" dataKey="upperBound" stroke="none" fill="hsl(var(--muted) / 0.3)" fillOpacity={1} />
        <Area type="monotone" dataKey="lowerBound" stroke="none" fill="hsl(var(--background))" fillOpacity={1} />

        {/* 각 시나리오 라인 (역순으로 그려서 기준이 맨 위) */}
        {[...allData].map((_, i) => allData.length - 1 - i).map(i => (
          <Line
            key={i}
            type="monotone"
            dataKey={`reach_${i}`}
            stroke={lineColors[i]}
            strokeWidth={i === 0 ? 3 : 2}
            opacity={lineOpacities[i]}
            dot={false}
            activeDot={{ r: 4, fill: lineColors[i], stroke: lineColors[i], strokeWidth: 2 }}
          />
        ))}

        {/* 각 시나리오의 실제 예산 위치 마커 */}
        <Scatter
          data={scenarioMarkers.map(m => ({ ...m, [`reach_${m.idx}`]: m.reach }))}
          shape={(props: any) => {
            const { cx, cy, payload } = props
            if (!cx || !cy) return null
            const isBase = payload.idx === 0
            return (
              <circle cx={cx} cy={cy} r={isBase ? 6 : 4} fill={lineColors[payload.idx]} stroke="hsl(var(--background))" strokeWidth={2} />
            )
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

// ── 예산 비교: CPRP 효율 바 차트 ──
function BudgetEfficiencyChart({ allData, labels }: { allData: ScenarioMetrics[]; labels: string[] }) {
  const sorted = allData.map((m, i) => ({
    name: labels[i], cprp: m.cprp, grps: m.grps, budget: m.totalBudget, idx: i
  })).sort((a, b) => a.budget - b.budget)

  const opacities = [0.85, 0.5, 0.35, 0.25]

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div style={{
        background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
        borderRadius: '8px', padding: '12px', fontFamily: 'Paperlogy, sans-serif',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>{d.name}</div>
        <div style={{ fontSize: '11px', lineHeight: '1.8' }}>
          <div>Budget: <span style={{ fontWeight: '600' }}>₩{d.budget.toLocaleString('ko-KR')}</span></div>
          <div>CPRP: <span style={{ fontWeight: '600' }}>₩{d.cprp.toLocaleString('ko-KR')}</span></div>
          <div>GRPs: <span style={{ fontWeight: '600' }}>{d.grps.toFixed(1)}</span></div>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={sorted} margin={{ top: 20, right: 24, bottom: 20, left: 0 }}>
        <XAxis
          dataKey="name" stroke="#e4e4e7"
          tick={{ fill: '#71717a', fontSize: 11 }}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={v => `${(v / 1000000).toFixed(1)}M`}
          stroke="#e4e4e7" tick={{ fill: '#71717a', fontSize: 11 }}
          width={52}
          label={{ value: 'CPRP (원)', angle: 0, position: 'top', offset: 8, style: { fill: '#71717a', fontSize: 12, fontWeight: 500, textAnchor: 'start' } }}
        />
        <YAxis
          yAxisId="right" orientation="right"
          tickFormatter={v => v.toFixed(0)}
          stroke="#e4e4e7" tick={{ fill: '#71717a', fontSize: 11 }}
          width={44}
          label={{ value: 'GRPs', angle: 0, position: 'top', offset: 8, style: { fill: '#71717a', fontSize: 12, fontWeight: 500, textAnchor: 'end' } }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d4d4d8', strokeWidth: 1, strokeDasharray: '3 3' }} wrapperStyle={{ outline: 'none' }} />
        <Bar yAxisId="left" dataKey="cprp" radius={[4, 4, 0, 0]} maxBarSize={36}>
          {sorted.map((d, i) => (
            <Cell key={i} fill={d.idx === 0 ? '#00ff9d' : 'hsl(var(--foreground))'} opacity={d.idx === 0 ? 0.8 : (opacities[i] || 0.2)} />
          ))}
        </Bar>
        <Line
          yAxisId="right" dataKey="grps" type="monotone"
          stroke="hsl(var(--foreground))" strokeWidth={2}
          dot={{ r: 3.5, fill: 'hsl(var(--foreground))', stroke: 'hsl(var(--foreground))', strokeWidth: 1.5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export function ScenarioComparisonResult({
  isOpen, onClose, onNewComparison, baseScenario, comparisonScenarios,
  comparisonType = 'target', integrityLevel = 'optimal', isDarkMode = false
}: ScenarioComparisonResultProps) {
  const [spinXOpen, setSpinXOpen] = useState(false)
  const [showOverview, setShowOverview] = useState(true)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)
  if (!isOpen) return null

  const baseMetrics = generateDummyMetrics(-1, baseScenario.budget || 1000000000, baseScenario.period, baseScenario.targetGrp)
  const scenarioMetrics = comparisonScenarios.map((s, i) =>
    generateDummyMetrics(i, s.budget || 1000000000, s.period, s.targetGrp)
  )

  const allScenarios = [
    { label: '기준', name: baseScenario.name, metrics: baseMetrics, isBase: true, diffs: [] as string[], targetGrp: baseScenario.targetGrp || [] },
    ...comparisonScenarios.map((s, i) => ({
      label: `비교 ${i + 1}`, name: s.name, metrics: scenarioMetrics[i], isBase: false,
      diffs: getConditionDiffs(baseScenario, s, comparisonType), targetGrp: s.targetGrp || []
    }))
  ]

  const keyMetrics: { key: keyof ScenarioMetrics; label: string; unit: string; fmt: (v: number) => string; inverse?: boolean; category?: string }[] = comparisonType === 'budget' ? [
    // Budget Scaling: 예산이 변수이므로 Budget을 강조
    { key: 'targetPopulation', label: 'Target Population', unit: '', fmt: v => v.toLocaleString('ko-KR'), category: 'Market Scale' },
    { key: 'reach1', label: 'Reach 1+', unit: '%', fmt: v => `${v.toFixed(1)}%`, category: 'Reach 1+' },
    { key: 'reach2', label: 'Reach 2+', unit: '%', fmt: v => `${v.toFixed(1)}%` },
    { key: 'reach3', label: 'Reach 3+', unit: '%', fmt: v => `${v.toFixed(1)}%` },
    { key: 'reach4', label: 'Reach 4+', unit: '%', fmt: v => `${v.toFixed(1)}%` },
    { key: 'reach5', label: 'Reach 5+', unit: '%', fmt: v => `${v.toFixed(1)}%` },
    { key: 'cprp', label: 'CPRP', unit: '원', fmt: v => `₩${v.toLocaleString('ko-KR')}`, inverse: true, category: 'Efficiency' },
    { key: 'grps', label: 'GRPs', unit: '', fmt: v => v.toFixed(1) },
    { key: 'avgFrequency', label: 'Avg. Frequency', unit: '', fmt: v => v.toFixed(1) },
    { key: 'reachCount', label: 'Reach Count', unit: '', fmt: v => v.toLocaleString('ko-KR'), category: 'Volume' },
    { key: 'impression', label: 'Impression', unit: '', fmt: v => v.toLocaleString('ko-KR') },
    { key: 'effectiveImpression', label: 'Effective Impression', unit: '', fmt: v => v.toLocaleString('ko-KR') },
  ] : [
    // Reach Flow
    { key: 'targetPopulation', label: 'Target Population', unit: '', fmt: v => v.toLocaleString('ko-KR'), category: 'Reach Flow' },
    { key: 'reach1', label: 'Reach 1+', unit: '%', fmt: v => `${v.toFixed(1)}%`, category: 'Reach 1+' },
    { key: 'reach2', label: 'Reach 2+', unit: '%', fmt: v => `${v.toFixed(1)}%` },
    { key: 'reach3', label: 'Reach 3+', unit: '%', fmt: v => `${v.toFixed(1)}%` },
    { key: 'reach4', label: 'Reach 4+', unit: '%', fmt: v => `${v.toFixed(1)}%` },
    { key: 'reach5', label: 'Reach 5+', unit: '%', fmt: v => `${v.toFixed(1)}%` },
    // Efficiency
    { key: 'cprp', label: 'CPRP', unit: '원', fmt: v => `₩${v.toLocaleString('ko-KR')}`, inverse: true, category: 'Efficiency' },
    { key: 'grps', label: 'GRPs', unit: '', fmt: v => v.toFixed(1) },
    { key: 'avgFrequency', label: 'Avg. Frequency', unit: '', fmt: v => v.toFixed(1) },
    // Volume
    { key: 'reachCount', label: 'Reach Count', unit: '', fmt: v => v.toLocaleString('ko-KR'), category: 'Volume' },
    { key: 'impression', label: 'Impression', unit: '', fmt: v => v.toLocaleString('ko-KR') },
    { key: 'effectiveImpression', label: 'Effective Impression', unit: '', fmt: v => v.toLocaleString('ko-KR') },
  ]

  const sectionTitle: React.CSSProperties = {
    fontSize: '20px', fontWeight: '500', margin: 0,
    fontFamily: 'Paperlogy, sans-serif', color: 'hsl(var(--foreground))'
  }

  const fmtDate = (d: string) => d.replace(/-/g, '.')

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'row',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* 메인 콘텐츠 */}
      <div style={{
        flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
        marginRight: spinXOpen ? '400px' : '0',
        transition: 'margin-right 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>

      {/* ── 헤더 (결과 페이지 스타일) ── */}
      <div className="slot-detail-header" style={{ flexShrink: 0 }}>
        <div className="slot-detail-header__main" style={{ alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
              <ArrowLeft size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'Paperlogy, sans-serif', color: 'hsl(var(--foreground))' }}>
                시나리오 비교
              </span>
              {comparisonType && comparisonTypeLabels[comparisonType] && (() => {
                const TypeIcon = comparisonTypeLabels[comparisonType].icon
                return (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                    <TypeIcon size={14} />
                    {comparisonTypeLabels[comparisonType].subtitle}
                  </span>
                )
              })()}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button onClick={() => setResetConfirmOpen(true)} className="btn btn-ghost btn-sm" style={{ padding: '6px' }} title="비교 재설정">
              <RefreshCw size={16} />
            </button>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '6px' }}
              >
                <Share2 size={16} />
              </button>
              {exportMenuOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '200px',
                  backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))',
                  borderRadius: '8px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', zIndex: 1000,
                  fontFamily: 'Paperlogy, sans-serif', overflow: 'hidden'
                }}>
                  <button
                    onClick={() => { console.log('Export to Excel'); setExportMenuOpen(false) }}
                    style={{
                      width: '100%', padding: '12px 16px', border: 'none', backgroundColor: 'transparent',
                      textAlign: 'left', cursor: 'pointer', fontSize: '13px',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      transition: 'background-color 0.2s', color: 'hsl(var(--popover-foreground))'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FileSpreadsheet size={16} />
                    <span>Export to Excel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Health Check 바 (헤더 아래 고정, 클릭 시 시나리오 상세 펼침) ── */}
      <div style={{ flexShrink: 0 }}>
        <button
          onClick={() => setShowOverview(!showOverview)}
          style={{
            width: '100%', padding: '8px 32px', display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', borderBottom: '1px solid hsl(var(--border))',
            cursor: 'pointer', textAlign: 'left'
          }}
        >
          {(() => { const I = integrityConfig[integrityLevel].icon; return <I size={13} style={{ color: integrityConfig[integrityLevel].color, flexShrink: 0 }} /> })()}
          <span style={{ fontSize: '12px', fontWeight: '600', color: integrityConfig[integrityLevel].color }}>Comparison Health Check</span>
          <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginLeft: '4px' }}>{integrityConfig[integrityLevel].desc}</span>
          {allScenarios.filter(s => !s.isBase && s.diffs.length > 0).map((s, i) => (
            <span key={i} style={{
              fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
              border: `1px solid ${integrityConfig[s.diffs.length <= 1 ? 'caution' : 'risk'].color}40`,
              backgroundColor: `${integrityConfig[s.diffs.length <= 1 ? 'caution' : 'risk'].color}10`,
              color: integrityConfig[s.diffs.length <= 1 ? 'caution' : 'risk'].color,
              fontWeight: '500', marginLeft: '4px'
            }}>
              {s.label}: {s.diffs.join(', ')} 상이
            </span>
          ))}
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0, color: 'hsl(var(--muted-foreground))' }}>
            <span style={{ fontSize: '11px' }}>Scenario Overview</span>
            {showOverview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>

        {/* 펼침: 시나리오 상세 */}
        {showOverview && (
          <div style={{
            display: 'flex', alignItems: 'stretch',
            borderBottom: '2px solid hsl(var(--border))'
          }}>
            {allScenarios.map((s, i) => {
              const period = i === 0 ? (baseScenario.period || { start: '2024-10-01', end: '2024-12-31' }) : (comparisonScenarios[i - 1]?.period || { start: '', end: '' })
              const baseBudget = baseScenario.budget || 1000000000
              const sBudget = i === 0 ? baseBudget : (comparisonScenarios[i - 1]?.budget || 0)
              const basePeriod = baseScenario.period || { start: '2024-10-01', end: '2024-12-31' }
              const budgetMatch = s.isBase || Math.abs(baseBudget - sBudget) / baseBudget < 0.05
              const periodMatch = s.isBase || (basePeriod.start === period.start && basePeriod.end === period.end)
              const mediaMatch = s.isBase || true

              return (
                <div key={i} style={{
                  flex: 1, padding: '14px 20px',
                  borderLeft: i > 0 ? '1px solid hsl(var(--border))' : 'none',
                  backgroundColor: s.isBase ? 'hsl(var(--muted) / 0.15)' : 'transparent'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    {s.isBase ? (
                      <span style={{
                        fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase',
                        color: 'hsl(var(--primary-foreground))', backgroundColor: 'hsl(var(--primary))',
                        padding: '2px 8px', borderRadius: '4px'
                      }}>기준</span>
                    ) : (
                      <span style={{
                        fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase',
                        color: 'hsl(var(--muted-foreground))'
                      }}>{s.label}</span>
                    )}
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'hsl(var(--foreground))' }}>{s.name}</span>
                  </div>
                  {comparisonType === 'budget' ? (
                    <>
                      {/* 예산 비교: 예산을 중점 표시 */}
                      <div style={{ fontSize: '22px', fontWeight: '700', color: s.isBase ? 'hsl(var(--primary))' : 'hsl(var(--foreground))', marginBottom: '4px', fontFamily: 'Paperlogy, sans-serif' }}>
                        ₩{s.metrics.totalBudget.toLocaleString('ko-KR')}
                      </div>
                      {!s.isBase && (
                        <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '8px' }}>
                          기준 대비 {s.metrics.totalBudget > baseBudget ? '+' : ''}{((s.metrics.totalBudget - baseBudget) / baseBudget * 100).toFixed(0)}%
                        </div>
                      )}
                      {s.isBase && <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '8px' }}>기준 예산</div>}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {[
                          { label: '기간', value: `${fmtDate(period.start)} → ${fmtDate(period.end)}`, match: periodMatch },
                          { label: '타겟', value: s.targetGrp.join(', ') || '—', match: true },
                          { label: '매체', value: `${s.metrics.channelBudgets.length}개 광고상품`, match: mediaMatch }
                        ].map((row, ri) => (
                          <div key={ri} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                            <span style={{ color: 'hsl(var(--muted-foreground))' }}>{row.label}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <span style={{ color: 'hsl(var(--foreground))' }}>{row.value}</span>
                              {!s.isBase && (
                                row.match
                                  ? <CheckCircle size={10} style={{ color: 'hsl(var(--muted-foreground))' }} />
                                  : <AlertTriangle size={10} style={{ color: 'hsl(38 92% 50%)' }} />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 타겟/기간 비교: 기존 타겟 중점 표시 */}
                      <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '2px' }}>타겟 설정</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: 'hsl(var(--foreground))', lineHeight: '1.5', marginBottom: '2px' }}>
                        {s.targetGrp.join(', ') || '—'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginBottom: '10px' }}>
                        Target Population {s.metrics.targetPopulation.toLocaleString('ko-KR')}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {[
                          { label: '광고비', value: `₩${s.metrics.totalBudget.toLocaleString('ko-KR')}`, match: budgetMatch },
                          { label: '기간', value: `${fmtDate(period.start)} → ${fmtDate(period.end)} (${s.metrics.periodDays}일)`, match: periodMatch },
                          { label: '매체', value: `${s.metrics.channelBudgets.length}개 광고상품`, match: mediaMatch }
                        ].map((row, ri) => (
                          <div key={ri} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                            <span style={{ color: 'hsl(var(--muted-foreground))' }}>{row.label}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <span style={{ color: 'hsl(var(--foreground))' }}>{row.value}</span>
                              {!s.isBase && (
                                row.match
                                  ? <CheckCircle size={10} style={{ color: 'hsl(var(--muted-foreground))' }} />
                                  : <AlertTriangle size={10} style={{ color: 'hsl(38 92% 50%)' }} />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── 컨텐츠 ── */}
      <div className="workspace-content" style={{ flex: 1, overflowY: 'auto', padding: '32px', maxWidth: '100%' }}>

        {/* ── 시각화 (타겟 비교) ── */}
        {comparisonType === 'target' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
              {/* 왼쪽: 버블 차트 */}
              <div style={{ minWidth: 0 }}>
                <h3 style={sectionTitle}>Reach × CPRP Matrix</h3>
                <div style={{ margin: '4px 0 0 0' }}>
                <ReachCPRPChart
                  allData={[baseMetrics, ...scenarioMetrics]}
                  labels={allScenarios.map(s => s.isBase ? `기준: ${s.name}` : s.name)}
                  targetLabels={allScenarios.map(s => s.targetGrp)}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="currentColor" opacity="0.2" /><circle cx="6" cy="6" r="2" fill="currentColor" /></svg>
                    Reach 1+ × CPRP
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="0.5" /></svg>
                    Target Population
                  </span>
                </div>
                </div>
              </div>
              {/* 오른쪽: 바/라인 콤보 */}
              <div style={{ minWidth: 0 }}>
                <h3 style={sectionTitle}>Key Metrics Comparison</h3>
                <div style={{ margin: '4px 0 0 0' }}>
                <PerformanceComboChart
                  allData={[baseMetrics, ...scenarioMetrics]}
                  labels={allScenarios.map(s => s.isBase ? '기준' : s.name)}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="2" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.35" /></svg>
                    Reach 1+
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                    <svg width="14" height="10" viewBox="0 0 14 10"><line x1="0" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="2" /><circle cx="7" cy="5" r="2.5" fill="currentColor" /></svg>
                    Avg. Frequency
                  </span>
                </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── 시각화 (예산 비교) ── */}
        {comparisonType === 'budget' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
              {/* 왼쪽: 통합 리치커브 */}
              <div style={{ minWidth: 0 }}>
                <h3 style={sectionTitle}>Unified Reach Curve</h3>
                <div style={{ margin: '4px 0 0 0' }}>
                <UnifiedReachCurve
                  allData={[baseMetrics, ...scenarioMetrics]}
                  labels={allScenarios.map(s => s.isBase ? `기준: ${s.name}` : s.name)}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                  {allScenarios.map((s, i) => {
                    const colors = ['#00ff9d', 'hsl(var(--foreground))', 'hsl(var(--muted-foreground))', 'hsl(var(--muted-foreground) / 0.5)']
                    return (
                      <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                        <span style={{ width: '8px', height: '3px', borderRadius: '1px', backgroundColor: colors[i], opacity: i === 0 ? 1 : [0.7, 0.5, 0.35][i - 1] }} />
                        {s.isBase ? '기준' : s.name}
                      </span>
                    )
                  })}
                </div>
                </div>
              </div>
              {/* 오른쪽: CPRP 효율 + GRPs */}
              <div style={{ minWidth: 0 }}>
                <h3 style={sectionTitle}>Cost Efficiency</h3>
                <div style={{ margin: '4px 0 0 0' }}>
                <BudgetEfficiencyChart
                  allData={[baseMetrics, ...scenarioMetrics]}
                  labels={allScenarios.map(s => s.isBase ? '기준' : s.name)}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="2" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.35" /></svg>
                    CPRP
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
                    <svg width="14" height="10" viewBox="0 0 14 10"><line x1="0" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="2" /><circle cx="7" cy="5" r="2.5" fill="currentColor" /></svg>
                    GRPs
                  </span>
                </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── 통합 성과 비교 테이블 ── */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ ...sectionTitle, marginBottom: '16px' }}>Performance Comparison</h3>
          <div style={{ borderRadius: '10px', border: '1px solid hsl(var(--border))', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              {/* 헤더: 시나리오명 */}
              <thead>
                <tr style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}>
                  <th style={{ padding: '10px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'hsl(var(--muted-foreground))', width: '180px' }}>지표</th>
                  {allScenarios.map((s, i) => (
                    <th key={i} style={{ padding: '10px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: s.isBase ? 'hsl(var(--primary))' : 'hsl(var(--foreground))', backgroundColor: s.isBase ? 'hsl(var(--muted) / 0.5)' : undefined }}>
                      <div>{s.isBase ? '기준' : s.label}</div>
                      <div style={{ fontSize: '11px', fontWeight: '400', color: 'hsl(var(--muted-foreground))', marginTop: '2px' }}>{s.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              {/* Strategy Top-Card: 광고비 + 스택바 */}
              <tbody>
                <tr style={{ borderTop: '1px solid hsl(var(--border))' }}>
                  <td style={{ padding: '12px 24px', fontSize: '12px', fontWeight: '500', color: 'hsl(var(--muted-foreground))', verticalAlign: 'top' }}>
                    <div>총 광고비</div>
                    <div style={{ marginTop: '4px', fontSize: '11px' }}>매체별 예산 비중</div>
                  </td>
                  {allScenarios.map((s, i) => (
                    <td key={i} style={{ padding: '12px 16px', textAlign: 'center', backgroundColor: s.isBase ? 'hsl(var(--muted) / 0.3)' : 'transparent', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: s.isBase ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}>
                        ₩{s.metrics.totalBudget.toLocaleString('ko-KR')}
                      </div>
                      <div style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))', marginTop: '2px' }}>
                        TV {s.metrics.tvcRatio}% · Digital {s.metrics.digitalRatio}%
                      </div>
                      {/* 스택바 */}
                      <StackedBar channels={s.metrics.channelBudgets} totalBudget={s.metrics.totalBudget} />
                    </td>
                  ))}
                </tr>
              </tbody>
              {/* 통합 지표 */}
              <tbody>
                {keyMetrics.map((m) => {
                  const isFirst = m.category !== undefined
                  return (
                    <tr key={m.key} style={{ borderTop: isFirst ? '2px solid hsl(var(--border))' : '1px solid hsl(var(--border))' }}>
                      <td style={{
                        padding: isFirst ? '12px 24px' : '8px 24px 8px 36px',
                        fontSize: isFirst ? '13px' : '12px',
                        fontWeight: isFirst ? '600' : '400',
                        color: isFirst ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'
                      }}>
                        {m.label}
                      </td>
                      {allScenarios.map((s, i) => {
                        const val = s.metrics[m.key] as number
                        const diff = i === 0 ? 0 : val - (baseMetrics[m.key] as number)
                        return (
                          <td key={i} style={{ padding: isFirst ? '12px 16px' : '8px 16px', textAlign: 'center', backgroundColor: s.isBase ? 'hsl(var(--muted) / 0.3)' : 'transparent' }}>
                            <span style={{
                              fontSize: isFirst ? '14px' : '13px',
                              fontWeight: isFirst ? '700' : '500',
                              color: s.isBase ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'
                            }}>
                              {m.fmt(val)}
                            </span>
                            {!s.isBase && (
                              <span style={{ marginLeft: '6px' }}>
                                <DiffIndicator value={diff} inverse={m.inverse} format={v => {
                                  if (m.unit === '%') return `${v > 0 ? '+' : ''}${v.toFixed(1)}%p`
                                  if (m.key === 'cprp') return `${v > 0 ? '+' : ''}₩${Math.abs(v).toLocaleString('ko-KR')}`
                                  return `${v > 0 ? '+' : ''}${v.toLocaleString('ko-KR')}`
                                }} />
                              </span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 재설정 확인 다이얼로그 */}
      {resetConfirmOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">
                비교를 재설정하시겠습니까?
              </h3>
              <p className="dialog-description">
                현재 비교 결과가 초기화되고 시나리오 선택 화면으로 돌아갑니다.
              </p>
            </div>
            <div className="dialog-footer">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                취소
              </button>
              <button
                onClick={() => { setResetConfirmOpen(false); onNewComparison() }}
                className="btn btn-primary btn-sm"
              >
                재설정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SpinX 버튼 */}
      <div style={{ position: 'fixed', bottom: '24px', right: spinXOpen ? '424px' : '24px', zIndex: 998, transition: 'right 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <SpinXButton onClick={() => setSpinXOpen(true)} hasNewMessage={false} style={{ position: 'relative', bottom: 'auto', right: 'auto' }} />
      </div>
      </div>

      {/* SpinX 패널 — fixed로 뷰포트 기준 배치 */}
      <SpinXPanel isOpen={spinXOpen} onClose={() => setSpinXOpen(false)} isDarkMode={isDarkMode} scenarioName="시나리오 비교 분석" analysisType="reachPredictor" positioning="fixed" />
    </div>
  )
}
