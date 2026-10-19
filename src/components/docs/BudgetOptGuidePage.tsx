import React, { useState, useMemo } from 'react'

/**
 * BudgetOpt 2.0 원리와 개념 — 인터랙티브 가이드
 *
 * 원본(public/budgetopt_docs.html)의 핵심 인터랙션(두 시뮬레이터)을 살리되,
 * 색은 ReadySet 토큰(hsl(var(--...)))으로 통일해 다크모드까지 대응한다.
 * 원본의 빨강 강조·HEX 팔레트는 걷어내고, 강조는 시그니처 그린(primary) 하나로만.
 * 그린은 '시스템이 짚은 판단' 지점에만 쓴다 — Current Spend 마커, 최적 지점,
 * 강조된 매체, 포화 눈금.
 */

// 공통 토큰 헬퍼
const t = {
  fg: 'hsl(var(--foreground))',
  muted: 'hsl(var(--muted-foreground))',
  border: 'hsl(var(--border))',
  card: 'hsl(var(--card))',
  bg: 'hsl(var(--background))',
  primary: 'hsl(var(--primary))',
  primaryFg: 'hsl(var(--primary-foreground))',
  primarySoft: 'hsl(var(--primary) / 0.06)',
  mutedBg: 'hsl(var(--muted))',
} as const

/* ===== 위젯 1 수학 상수/함수 (HTML VERBATIM) ===== */
const KMAX = 1000
const H = 1.5
const XMAX = 14
const X80 = 4 * H // 포화 예산 (포화도 80%) = 6억
const kpi1 = (x: number) => (KMAX * x) / (x + H)
const slope1 = (x: number) => (KMAX * H) / ((x + H) * (x + H))
const marg1 = (x: number) => (KMAX * H * 0.01) / ((x + H) * (x + H))
const MARG0 = marg1(0.2)

// SVG 좌표계 (HTML VERBATIM)
const W = 640
const HT = 300
const SVG_L = 48
const SVG_R = 20
const SVG_T = 22
const SVG_B = 40
const YMAX = 1100
const px = (x: number) => SVG_L + (x / XMAX) * (W - SVG_L - SVG_R)
const py = (y: number) => SVG_T + (1 - y / YMAX) * (HT - SVG_T - SVG_B)

/* ===== 위젯 2 수학 상수/함수 (HTML VERBATIM) ===== */
const TOTAL = 10
const MA = { K: 1000, H: 1 }
const MB = { K: 1500, H: 6 }
const kpi2 = (m: { K: number; H: number }, x: number) => (m.K * x) / (x + m.H)
const marg2 = (m: { K: number; H: number }, x: number) => (m.K * m.H * 0.01) / ((x + m.H) * (x + m.H))
const total2 = (a: number) => kpi2(MA, a) + kpi2(MB, TOTAL - a)
const BASE2 = total2(TOTAL / 2)
// 최적 지점 탐색 루프 (HTML VERBATIM)
const BEST2 = (() => {
  let best = 0
  let bestV = -1
  for (let a = 0; a <= TOTAL + 1e-9; a += 0.01) {
    const v = total2(a)
    if (v > bestV) {
      bestV = v
      best = a
    }
  }
  return Math.round(best * 10) / 10
})()

function Section({
  num,
  title,
  lead,
  children,
}: {
  num: string
  title: string
  lead?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        padding: '48px 0',
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      <p style={{ fontSize: 13, color: t.muted, margin: '0 0 6px' }}>{num}</p>
      <h2 style={{ fontSize: 21, fontWeight: 700, margin: '0 0 8px', color: t.fg }}>{title}</h2>
      {lead && (
        <p style={{ fontSize: 14.5, color: t.muted, maxWidth: 680, margin: '0 0 24px', lineHeight: 1.7 }}>
          {lead}
        </p>
      )}
      {children}
    </section>
  )
}

/* ============ 위젯 1: 효율 포화 곡선 ============ */
function SaturationSimulator() {
  const [x, setX] = useState(2)

  const k = kpi1(x)
  const sat = (x / (x + H)) * 100
  const m = marg1(x)
  const room = X80 - x
  const effPct = (m / MARG0) * 100

  // 곡선 path (고정)
  const curvePath = useMemo(() => {
    let d = ''
    for (let xx = 0; xx <= XMAX + 0.001; xx += 0.1) {
      d += (xx === 0 ? 'M' : 'L') + px(xx).toFixed(1) + ' ' + py(kpi1(xx)).toFixed(1) + ' '
    }
    return d
  }, [])

  // 면적 path (현재 지점까지)
  const areaPath = useMemo(() => {
    let a = 'M' + px(0) + ' ' + py(0) + ' '
    for (let tt = 0; tt <= x + 0.001; tt += 0.1) {
      a += 'L' + px(tt).toFixed(1) + ' ' + py(kpi1(tt)).toFixed(1) + ' '
    }
    return a + 'L' + px(x) + ' ' + py(0) + ' Z'
  }, [x])

  // 접선 (기울기)
  const x1 = Math.max(0, x - 1.1)
  const x2 = Math.min(XMAX, x + 1.1)
  const sl = slope1(x)
  const tanX1 = px(x1)
  const tanY1 = py(k + sl * (x1 - x))
  const tanX2 = px(x2)
  const tanY2 = py(k + sl * (x2 - x))

  const dotX = px(x)
  const dotY = py(k)
  const lblX = Math.min(Math.max(px(x), SVG_L + 44), W - SVG_R - 44)

  // 상태 메시지 (HTML VERBATIM)
  let st: string
  let msg: string
  if (sat <= 40) {
    st = '여력 큼'
    msg = '곡선 앞쪽입니다. 여력이 커서, 예산을 더 넣으면 추가 성과도 크게 늘어납니다.'
  } else if (sat <= 65) {
    st = '중반'
    msg = '곡선 중반입니다. 예산을 더 넣을수록 100만원당 증가 KPI가 눈에 띄게 줄어드는 구간입니다.'
  } else if (sat < 80) {
    st = '포화 근접'
    msg = '포화에 근접했습니다. 아직 포화 예산 전이지만 증가폭이 많이 줄었습니다. 이 근처에서 알고리즘은 다른 매체의 증액 효율과 비교하게 됩니다.'
  } else {
    st = '포화 예산 초과'
    msg = '포화 예산을 넘어선 구간입니다. 더 투입할 수 있고 KPI도 계속 늘지만, 100만원당 늘어나는 KPI가 크게 줄었습니다. 여기가 한계(천장)는 아닙니다.'
  }

  const axis = 'hsl(var(--muted-foreground) / 0.5)'
  const labelFill = t.muted

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 14,
        padding: '26px 22px',
        marginTop: 20,
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: t.muted,
          margin: '0 0 20px',
          paddingBottom: 14,
          borderBottom: `1px solid ${t.border}`,
          lineHeight: 1.6,
        }}
      >
        <b style={{ color: t.fg }}>슬라이더로 예산을 움직여 보세요.</b> 곡선 위 ●가 현재 배분된 예산(Current Spend)
        지점이고, 굵은 선은 그 지점의 기울기, 즉 100만원당 증가 KPI입니다.
      </p>

      <svg
        viewBox="0 0 640 300"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
        aria-label="예산이 늘수록 KPI 증가폭이 줄어드는 반응 곡선 예시"
      >
        {/* x축 눈금 */}
        {Array.from({ length: Math.floor(XMAX / 2) + 1 }).map((_, i) => {
          const tick = i * 2
          return (
            <g key={tick}>
              <line x1={px(tick)} y1={HT - SVG_B} x2={px(tick)} y2={HT - SVG_B + 4} stroke={axis} />
              <text x={px(tick)} y={HT - SVG_B + 18} textAnchor="middle" fontSize={11} fill={labelFill}>
                {tick}억
              </text>
            </g>
          )
        })}
        {/* 축선 */}
        <line x1={SVG_L} y1={HT - SVG_B} x2={W - SVG_R} y2={HT - SVG_B} stroke={axis} />
        <line x1={SVG_L} y1={SVG_T} x2={SVG_L} y2={HT - SVG_B} stroke={axis} />
        <text x={SVG_L + 6} y={SVG_T + 4} fontSize={11} fill={labelFill}>
          예측 KPI
        </text>
        {/* 포화 상한 점선 */}
        <line
          x1={SVG_L}
          y1={py(KMAX)}
          x2={W - SVG_R}
          y2={py(KMAX)}
          stroke={axis}
          strokeDasharray="4 4"
        />
        <text x={W - SVG_R - 4} y={py(KMAX) - 5} textAnchor="end" fontSize={11} fill={labelFill}>
          포화 상한 (예산을 무한히 늘렸을 때)
        </text>
        {/* 포화 예산 눈금 — 시스템이 짚은 지점이므로 그린 */}
        <line
          x1={px(X80)}
          y1={SVG_T + 14}
          x2={px(X80)}
          y2={HT - SVG_B}
          stroke={t.primary}
          strokeDasharray="4 4"
        />
        <text x={px(X80) + 6} y={HT - SVG_B - 8} fontSize={11} fill={t.primary} fontWeight={700}>
          포화 예산 (포화도 80%)
        </text>
        {/* 면적 */}
        <path d={areaPath} fill="hsl(var(--primary) / 0.1)" stroke="none" />
        {/* 곡선 */}
        <path d={curvePath} fill="none" stroke={t.fg} strokeWidth={2.5} />
        {/* 수직선 */}
        <line x1={dotX} y1={dotY} x2={dotX} y2={py(0)} stroke={axis} strokeDasharray="2 3" />
        {/* 접선 (기울기) */}
        <line
          x1={tanX1}
          y1={tanY1}
          x2={tanX2}
          y2={tanY2}
          stroke="hsl(var(--primary) / 0.55)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* Current Spend 마커 — 시스템이 짚은 현재 지점이므로 그린 */}
        <circle cx={dotX} cy={dotY} r={7} fill={t.primary} stroke={t.bg} strokeWidth={2} />
        <text x={lblX} y={dotY - 14} textAnchor="middle" fontWeight={700} fontSize={11} fill={t.fg}>
          Current Spend
        </text>
      </svg>

      {/* 슬라이더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '14px 0 16px' }}>
        <label htmlFor="bo-s1" style={{ fontSize: 13, color: t.muted, whiteSpace: 'nowrap' }}>
          현재 예산
        </label>
        <input
          id="bo-s1"
          type="range"
          min={0.2}
          max={14}
          step={0.1}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          aria-label="현재 예산 (억원)"
          style={{ flex: 1, accentColor: t.primary }}
        />
        <span
          style={{
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 700,
            fontSize: 15,
            minWidth: 78,
            textAlign: 'right',
            color: t.fg,
          }}
        >
          {x.toFixed(1)}억원
        </span>
      </div>

      {/* 지표 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10 }}>
        <Stat n={Math.round(k).toLocaleString()} l="예측 KPI(예시 단위)" />
        <Stat n={`${sat.toFixed(0)}%`} l="포화도" />
        <Stat n={m.toFixed(2)} l="100만원당 증가 KPI" />
        <Stat n={room > 0.05 ? `${room.toFixed(1)}억원` : '초과'} l="Budget Room" />
        <Stat n={st} l="상태" highlight={sat >= 80} small={st.length > 5} />
      </div>

      {/* 게이지: 포화도 */}
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <GaugeRow
          label={
            <>
              포화도 <span style={{ color: t.muted }}>(그린 눈금 = 포화 예산, 80%)</span>
            </>
          }
          barPct={Math.min(100, sat)}
          valueText={`${sat.toFixed(1)}%`}
          capPct={80}
          emphasize={sat >= 80}
        />
        <GaugeRow
          label={
            <>
              100만원당 증가 KPI <span style={{ color: t.muted }}>(예산 0.2억원일 때 = 100%)</span>
            </>
          }
          barPct={Math.min(100, effPct)}
          valueText={`${effPct.toFixed(0)}%`}
        />
      </div>

      <p style={{ fontSize: 13, color: t.muted, textAlign: 'center', margin: '18px 0 0', lineHeight: 1.6, minHeight: 42 }}>
        {msg}
      </p>
    </div>
  )
}

/* ============ 위젯 2: 두 매체 재배분 ============ */
function ReallocSimulator() {
  const [a, setA] = useState(5)
  const b = TOTAL - a
  const kA = kpi2(MA, a)
  const kB = kpi2(MB, b)
  const mA = marg2(MA, a)
  const mB = marg2(MB, b)
  const tk = kA + kB

  const diff = (tk / BASE2 - 1) * 100
  const isEqual = Math.abs(a - TOTAL / 2) < 0.05
  const diffText = isEqual ? '균등 배분 기준' : '균등 배분 대비 ' + (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%'

  const aHot = mA > mB * 1.1
  const bHot = mB > mA * 1.1

  // 상태 메시지 (HTML VERBATIM)
  let msg: string
  if (aHot) {
    msg = '매체 A의 100만원당 증가 KPI가 더 높습니다(강조 표시). 예산을 A 쪽에 더 배분하면 총 성과가 늘어납니다.'
  } else if (bHot) {
    msg = '매체 B의 100만원당 증가 KPI가 더 높습니다(강조 표시). 포화에 가까운 A의 여유 예산을 B에 배분하면 총 성과가 늘어납니다.'
  } else {
    msg = '두 매체의 100만원당 증가 KPI가 비슷해졌습니다. 이 근처에서는 더 배분을 바꿔도 총 성과가 크게 늘지 않습니다.'
  }

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 14,
        padding: '26px 22px',
        marginTop: 20,
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: t.muted,
          margin: '0 0 20px',
          paddingBottom: 14,
          borderBottom: `1px solid ${t.border}`,
          lineHeight: 1.6,
        }}
      >
        <b style={{ color: t.fg }}>총 예산 10억원을 두 매체에 나눠 배분합니다.</b> 슬라이더로 매체 A의 예산을 바꿔 보세요.
      </p>

      {/* split bar */}
      <div
        style={{
          height: 36,
          borderRadius: 8,
          overflow: 'hidden',
          display: 'flex',
          margin: '4px 0 14px',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            width: `${(a / TOTAL) * 100}%`,
            background: t.fg,
            color: t.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            transition: 'width .15s',
          }}
        >
          {a >= 1.2 ? `A ${a.toFixed(1)}억` : ''}
        </div>
        <div
          style={{
            width: `${(b / TOTAL) * 100}%`,
            background: 'hsl(var(--muted-foreground) / 0.45)',
            color: t.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            transition: 'width .15s',
          }}
        >
          {b >= 1.2 ? `B ${b.toFixed(1)}억` : ''}
        </div>
      </div>

      {/* 슬라이더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '14px 0 16px' }}>
        <label htmlFor="bo-s2" style={{ fontSize: 13, color: t.muted, whiteSpace: 'nowrap' }}>
          매체 A 예산
        </label>
        <input
          id="bo-s2"
          type="range"
          min={0}
          max={10}
          step={0.1}
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          aria-label="매체 A 예산 (억원)"
          style={{ flex: 1, accentColor: t.primary }}
        />
        <span
          style={{
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 700,
            fontSize: 15,
            minWidth: 78,
            textAlign: 'right',
            color: t.fg,
          }}
        >
          {a.toFixed(1)}억원
        </span>
      </div>

      {/* 매체 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
        <MediaCard
          title="매체 A"
          sub="곡선이 일찍 평평해지는 매체"
          hot={aHot}
          rows={[
            ['예산', `${a.toFixed(1)}억`],
            ['포화도', `${((a / (a + MA.H)) * 100).toFixed(0)}%`],
            ['100만원당 증가 KPI', mA.toFixed(2)],
            ['예측 KPI', Math.round(kA).toLocaleString()],
          ]}
        />
        <MediaCard
          title="매체 B"
          sub="여력이 큰 매체"
          hot={bHot}
          rows={[
            ['예산', `${b.toFixed(1)}억`],
            ['포화도', `${((b / (b + MB.H)) * 100).toFixed(0)}%`],
            ['100만원당 증가 KPI', mB.toFixed(2)],
            ['예측 KPI', Math.round(kB).toLocaleString()],
          ]}
        />
      </div>

      {/* 총 예측 KPI */}
      <div
        style={{
          background: t.primary,
          color: t.primaryFg,
          borderRadius: 10,
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 6,
          fontSize: 13,
        }}
      >
        <span>총 예측 KPI (예시 단위)</span>
        <span>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 20, fontWeight: 700 }}>
            {Math.round(tk).toLocaleString()}
          </span>
          <span style={{ fontSize: 12, opacity: 0.8, marginLeft: 8 }}>{diffText}</span>
        </span>
      </div>

      <p style={{ fontSize: 13, color: t.muted, textAlign: 'center', margin: '18px 0 0', lineHeight: 1.6, minHeight: 42 }}>
        {msg}
      </p>

      {/* 버튼 */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 14 }}>
        <button
          type="button"
          onClick={() => setA(5)}
          style={{
            fontFamily: 'inherit',
            fontSize: 12.5,
            border: `1px solid ${t.border}`,
            background: t.card,
            color: t.muted,
            borderRadius: 999,
            padding: '7px 16px',
            cursor: 'pointer',
          }}
        >
          균등 배분(5:5)으로 되돌리기
        </button>
        <button
          type="button"
          onClick={() => setA(BEST2)}
          style={{
            fontFamily: 'inherit',
            fontSize: 12.5,
            border: `1px solid ${t.primary}`,
            background: t.primary,
            color: t.primaryFg,
            borderRadius: 999,
            padding: '7px 16px',
            cursor: 'pointer',
          }}
        >
          총 성과가 가장 높은 지점 보기
        </button>
      </div>
    </div>
  )
}

function MediaCard({
  title,
  sub,
  hot,
  rows,
}: {
  title: string
  sub: string
  hot: boolean
  rows: [string, string][]
}) {
  return (
    <div
      style={{
        border: `1px solid ${hot ? t.primary : t.border}`,
        background: hot ? t.primarySoft : t.card,
        borderRadius: 10,
        padding: '14px 16px',
        transition: 'border-color .15s, background .15s',
      }}
    >
      <h5 style={{ fontSize: 13.5, margin: '0 0 2px', fontWeight: 700, color: t.fg }}>{title}</h5>
      <p style={{ fontSize: 11.5, color: t.muted, margin: '0 0 10px' }}>{sub}</p>
      <dl style={{ margin: 0, fontSize: 12.5 }}>
        {rows.map(([dt, dd]) => (
          <div key={dt} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
            <dt style={{ color: t.muted }}>{dt}</dt>
            <dd style={{ margin: 0, fontWeight: 700, color: t.fg, fontVariantNumeric: 'tabular-nums' }}>{dd}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function GaugeRow({
  label,
  barPct,
  valueText,
  capPct,
  emphasize,
}: {
  label: React.ReactNode
  barPct: number
  valueText: string
  capPct?: number
  emphasize?: boolean
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: t.muted }}>{label}</span>
        <span
          style={{
            fontVariantNumeric: 'tabular-nums',
            fontSize: 13,
            fontWeight: 700,
            color: emphasize ? t.fg : t.muted,
          }}
        >
          {valueText}
        </span>
      </div>
      <div style={{ position: 'relative', height: 12, background: t.mutedBg, borderRadius: 6, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: `${Math.max(0, Math.min(100, barPct))}%`,
            background: emphasize ? t.primary : 'hsl(var(--primary) / 0.55)',
            borderRadius: 6,
            transition: 'width .15s',
          }}
        />
        {/* 포화 예산 눈금 — 시스템이 짚은 지점이므로 그린 */}
        {capPct != null && (
          <div
            style={{
              position: 'absolute',
              top: -2,
              bottom: -2,
              left: `${capPct}%`,
              width: 2,
              background: t.primary,
            }}
          />
        )}
      </div>
    </div>
  )
}

function Stat({ n, l, highlight, small }: { n: string; l: string; highlight?: boolean; small?: boolean }) {
  return (
    <div
      style={{
        background: highlight ? t.primarySoft : t.mutedBg,
        borderRadius: 8,
        padding: '14px 8px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontVariantNumeric: 'tabular-nums',
          fontSize: small ? 14 : 19,
          fontWeight: 700,
          color: t.fg,
          lineHeight: 1.3,
        }}
      >
        {n}
      </div>
      <div style={{ fontSize: 11, color: t.muted, marginTop: 4 }}>{l}</div>
    </div>
  )
}

function Card({ k, h, children }: { k: string; h: string; children: React.ReactNode }) {
  return (
    <div style={{ border: `1px solid ${t.border}`, background: t.card, borderRadius: 10, padding: '18px 18px 16px' }}>
      <p style={{ fontSize: 11.5, color: t.muted, margin: '0 0 6px' }}>{k}</p>
      <p style={{ fontSize: 14.5, fontWeight: 700, margin: '0 0 6px', lineHeight: 1.5, color: t.fg }}>{h}</p>
      <p style={{ fontSize: 13, color: t.muted, margin: 0, lineHeight: 1.6 }}>{children}</p>
    </div>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: t.mutedBg,
        borderRadius: 10,
        padding: '18px 20px',
        fontSize: 13.5,
        color: t.muted,
        margin: '18px 0',
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  )
}

function ExampleNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 12.5,
        color: t.muted,
        margin: '16px 0',
        paddingLeft: 12,
        borderLeft: `2px solid ${t.border}`,
        lineHeight: 1.6,
      }}
    >
      {children}
    </p>
  )
}

// 가로 플로우 도식: 데이터 → 학습 → 반응 곡선 → 배분안.
// 마지막 '결과' 단계만 시그니처 그린(시스템이 내놓는 판단), 앞 단계는 무채색.
function FlowDiagram({ steps }: { steps: { k: string; h: string; result?: boolean }[] }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 8,
        flexWrap: 'wrap',
        margin: '4px 0 20px',
      }}
    >
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              flex: '1 1 150px',
              minWidth: 150,
              background: s.result ? t.primary : t.card,
              border: `1px solid ${s.result ? t.primary : t.border}`,
              borderRadius: 10,
              padding: '14px 16px',
            }}
          >
            <p style={{ fontSize: 11, margin: '0 0 4px', color: s.result ? t.primaryFg : t.muted, opacity: s.result ? 0.8 : 1 }}>
              {s.k}
            </p>
            <p style={{ fontSize: 13.5, fontWeight: 700, margin: 0, lineHeight: 1.45, color: s.result ? t.primaryFg : t.fg }}>
              {s.h}
            </p>
          </div>
          {i < steps.length - 1 && (
            <div style={{ display: 'flex', alignItems: 'center', color: t.muted, fontSize: 16, flexShrink: 0 }} aria-hidden="true">
              →
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function SubHead({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 15, fontWeight: 700, margin: '34px 0 12px', color: t.fg }}>{children}</h3>
}

function DoDont({ variant, title, items }: { variant: 'do' | 'dont'; title: string; items: string[] }) {
  const isDo = variant === 'do'
  return (
    <div
      style={{
        borderRadius: 10,
        padding: 18,
        border: `1px solid ${isDo ? t.border : 'hsl(var(--destructive) / 0.3)'}`,
        background: isDo ? t.primarySoft : 'hsl(var(--destructive) / 0.05)',
      }}
    >
      <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: isDo ? t.fg : 'hsl(var(--destructive))' }}>
        {title}
      </h4>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: t.muted, lineHeight: 1.6 }}>
        {items.map((it, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, margin: '10px 0 6px' }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{ textAlign: 'left', padding: '11px 12px', borderBottom: `1px solid ${t.border}`, color: t.muted, fontWeight: 500, fontSize: 12 }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: '11px 12px',
                    borderBottom: `1px solid ${t.border}`,
                    verticalAlign: 'top',
                    color: ci === 0 ? t.fg : t.muted,
                    lineHeight: 1.6,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ReadCard({ title, q, children, warn }: { title: string; q: string; children: React.ReactNode; warn?: React.ReactNode }) {
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, padding: 20, margin: '12px 0' }}>
      <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 2px', color: t.fg }}>{title}</h4>
      <p style={{ fontSize: 12.5, color: t.muted, margin: '0 0 12px' }}>{q}</p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: t.muted, lineHeight: 1.6 }}>{children}</ul>
      {warn && (
        <div style={{ marginTop: 10, fontSize: 12.5, background: t.mutedBg, borderRadius: 8, padding: '10px 14px', color: t.muted, lineHeight: 1.6 }}>
          {warn}
        </div>
      )}
    </div>
  )
}

function FormulaRow({ name, top, bottom, desc }: { name: string; top: string; bottom: string; desc: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '6px 0' }}>
      <span style={{ fontWeight: 700, minWidth: 138, fontSize: 14 }}>{name}</span>
      <span style={{ opacity: 0.6 }}>=</span>
      <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', fontSize: 13.5 }}>
        <span style={{ padding: '2px 6px', borderBottom: `1px solid ${t.primaryFg}`, opacity: 0.95 }}>{top}</span>
        <span style={{ padding: '2px 6px' }}>{bottom}</span>
      </span>
      <span style={{ opacity: 0.7, fontSize: 12 }}>{desc}</span>
    </div>
  )
}

export function BudgetOptGuidePage() {
  return (
    <div style={{ width: '100%', margin: '0 auto', color: t.fg, wordBreak: 'keep-all', overflowWrap: 'break-word' }}>
      {/* Hero */}
      <header style={{ padding: '8px 0 4px' }}>
        <p style={{ fontSize: 13, color: t.muted, fontWeight: 500, margin: '0 0 14px' }}>BudgetOpt 2.0</p>
        <h1 style={{ fontSize: 28, lineHeight: 1.4, fontWeight: 700, margin: '0 0 14px', color: t.fg }}>
          BudgetOpt 2.0 원리와 개념
        </h1>
        <p style={{ fontSize: 15, color: t.muted, maxWidth: 680, margin: 0, lineHeight: 1.7 }}>
          BudgetOpt 2.0이 어떤 원리로 예산을 배분하는지, 그리고 결과 숫자를 어떻게 읽어야 하는지 가장 쉽게 설명합니다.
          아래 슬라이더를 직접 움직여 보면 한 번에 이해됩니다.
        </p>
      </header>

      {/* 1. 예산 배분 원리 */}
      <Section
        num="1. 예산 배분 원리"
        title="BudgetOpt 2.0은 예산을 어떻게 나누나"
        lead="CJ 메조미디어가 쌓은 업종별 실제 집행 데이터로 Meridian 모델을 학습해, 입력한 KPI 목표와 총 예산에 맞는 최적 배분안을 찾는 흐름입니다."
      >
        <FlowDiagram
          steps={[
            { k: '데이터', h: 'CJ 메조미디어 실제 집행 데이터' },
            { k: '학습', h: 'Meridian 모델 학습' },
            { k: '파악', h: '매체·상품별 반응 곡선' },
            { k: '탐색', h: '수만 개 예산 조합 시뮬레이션' },
            { k: '산출', h: 'KPI·예산 맞춤 최적 배분안', result: true },
          ]}
        />
      </Section>

      {/* 2. 효율 포화 */}
      <Section
        num="2. 효율 포화"
        title="예산을 2배로 늘려도 성과가 2배가 되지는 않습니다"
        lead="예산을 늘릴수록 추가로 얻는 성과는 점점 줄어듭니다(체감 법칙, Diminishing Returns). 모델은 매체부터 먼저 배분하되(매체 우선 배분), 이렇게 성과가 둔해지는 포화 지점을 넘지 않도록 제어합니다(효율 포화 초과 방지). 두 원리의 바탕이 되는 반응 곡선을 직접 움직여 봅니다."
      >
        <ExampleNote>반응 곡선(Response Curve)은 체감 법칙을 반영한 포화 곡선으로, Meridian 모델이 실제 집행 데이터를 기반으로 산출합니다. 상세 수식과 모델 파라미터는 제공되지 않습니다.</ExampleNote>

        <SaturationSimulator />

        <ExampleNote>위 곡선과 수치는 개념 설명을 위한 가상의 예시입니다. 실제 모델의 수식·수치와는 무관합니다.</ExampleNote>

        <SubHead>이 화면에서 쓰이는 4가지 지표</SubHead>
        <SimpleTable
          headers={['지표', '뜻']}
          rows={[
            [<b>포화도</b>, '예산을 무한히 늘렸을 때 도달하는 최대 KPI(포화 상한) 대비, 현재 KPI의 비율(%)'],
            [
              <b>100만원당 증가 KPI</b>,
              <>
                <b style={{ color: t.fg }}>현재 배분된 지점 기준</b>으로 100만원을 더 투입할 때 늘어나는 KPI. 증액
                효율이자 그 지점의 곡선 기울기입니다.
              </>,
            ],
            [<b>포화 예산</b>, '포화도가 80%에 도달하는 예산'],
            [<b>Budget Room</b>, '포화 예산 − 현재 예산. 포화에 이르기까지 더 넣을 수 있는 예산(원)'],
          ]}
        />
        <ExampleNote>
          100만원당 증가 KPI는 예산을 더 넣을수록 줄어들며, 줄어드는 폭은 매체마다 다릅니다. 현재 지점의 값이 증액 구간
          내내 유지되지는 않습니다.
        </ExampleNote>

        <SubHead>포화도 구간 읽는 법</SubHead>
        <SimpleTable
          headers={['포화도', '의미']}
          rows={[
            [<span style={{ fontVariantNumeric: 'tabular-nums' }}>~40% 이하</span>, '곡선 앞쪽. 여력이 큼'],
            [<span style={{ fontVariantNumeric: 'tabular-nums' }}>40~65%</span>, '중반'],
            [<span style={{ fontVariantNumeric: 'tabular-nums' }}>65~80%</span>, '포화 근접'],
            [<span style={{ fontVariantNumeric: 'tabular-nums' }}>80% 이상</span>, '포화 예산을 넘어선 구간'],
          ]}
        />

        <Callout>
          <p style={{ margin: '0 0 10px' }}>
            <b style={{ color: t.fg }}>포화 예산은 투입 상한(천장)이 아닙니다.</b> 포화 예산을 넘어서도 예산을 더 투입할
            수 있고 KPI도 계속 늘어납니다. 다만 효율 체감으로 100만원당 증가 KPI가 급감할 뿐입니다. "포화라서 더 넣을 수
            없다", "여기가 한계다"로 해석하지 않습니다.
          </p>
          <p style={{ margin: 0 }}>
            <b style={{ color: t.fg }}>같은 포화도라도 증액 효율은 다를 수 있습니다.</b> 증액 우선순위는 포화도가 아니라
            100만원당 증가 KPI의 대소 비교로 판단합니다. 곡선의 기울기는 매체마다 다르기 때문입니다.
          </p>
        </Callout>
      </Section>

      {/* 3. 예산 재배분 */}
      <Section
        num="3. 예산 재배분"
        title="포화에 가까운 매체의 여유 예산은 효율 높은 매체로 분산됩니다"
        lead="A 매체에 1억 원을 넣었을 때와 2억 원을 넣었을 때의 증가분이 미미하다면, 증액 효율(100만원당 증가 KPI)이 더 높은 B 매체나 다른 상품에 상대적으로 더 많은 예산이 배분됩니다. 특정 매체를 다 채운 뒤 넘기는 순차 방식이 아니라, 매체별 최적 예산을 동시에 산출하는 과정의 결과입니다. 총 예산은 같고 두 매체의 포화 속도만 다를 때 어떻게 달라지는지 직접 확인해 보세요."
      >
        <ReallocSimulator />
        <ExampleNote>
          위 곡선과 수치는 개념 설명을 위한 가상의 예시입니다. 실제 모델의 계산 방식과는 무관하며, Incremental 차트가
          보여주는 '균등 배분 대비 순증'을 직관적으로 이해하기 위한 예시입니다.
        </ExampleNote>
      </Section>

      {/* 4. 잠금과 KPI 역전 */}
      <Section
        num="4. 잠금과 KPI 역전"
        title="내가 잠근 배분이 더 높게 예측될 수도 있습니다"
        lead={
          <>
            잠금 반영 결과의 Estimated KPI가 순수 최적화 결과보다 <b style={{ color: t.fg }}>더 높게 예측되는 경우</b>가
            있습니다. "모델이 자유롭게 배분한 쪽이 더 좋아야 하는 것 아닌가?" 싶은 지점이지만, 이를 알고리즘 오류로
            단정할 필요는 없습니다.
          </>
        }
      >
        <Callout>
          <b style={{ color: t.fg }}>이렇게 읽으세요.</b> "이 시나리오에서는 설정하신 잠금 배분이 순수 최적화보다 높은
          성과로 예측됩니다." — 설정하신 잠금이 이 시나리오에서 유효했다는 뜻입니다.
        </Callout>

        <SubHead>원인은 결과 화면의 데이터로 확인할 수 있습니다</SubHead>
        <p style={{ fontSize: 14, color: t.muted, margin: '0 0 16px', lineHeight: 1.7, maxWidth: 680 }}>
          잠금으로 예산 배분이 달라진 매체, 그리고 그 매체의 포화도와 100만원당 증가 KPI를 확인해 보세요. 예를 들어 순수
          최적화가 특정 매체에 예산을 크게 몰아 그 매체가 포화 근접 구간에 있고, 잠금 반영에서는 그 예산 일부가 증액
          효율이 높은 매체로 분산된 경우가 이에 해당합니다.
        </p>

        <SubHead>두 결과는 이렇게 비교하세요</SubHead>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
          <Card k="STEP 1" h="Estimated KPI 총량">
            어느 결과가 더 높게 예측되는지 확인합니다.
          </Card>
          <Card k="STEP 2" h="Avg. 단가">
            어느 결과가 비용 효율적인지 확인합니다. 총 예산이 다르면 단가로 효율을 비교합니다.
          </Card>
          <Card k="STEP 3" h="delta (잠금 반영 대비 증감)">
            잠금이 어떤 매체의 예산과 성과에 영향을 줬는지 확인합니다.
          </Card>
        </div>

        <SubHead>함께 알아두면 좋은 점</SubHead>
        <ul style={{ margin: '0 0 18px', paddingLeft: 20, fontSize: 13.5, color: t.muted, lineHeight: 1.7 }}>
          <li style={{ marginBottom: 6 }}>
            <b style={{ color: t.fg }}>총 예산이 같다면</b> Estimated KPI가 높은 쪽이 Avg. 단가도 반드시
            낮습니다(단가 = 총예산 ÷ KPI). 따라서 "KPI는 높지만 단가는 나쁘다"는 해석은 성립하지 않습니다.
          </li>
          <li style={{ marginBottom: 6 }}>
            <b style={{ color: t.fg }}>delta가 마이너스인 매체는 '손해'가 아닙니다.</b> 전체 KPI를 최대화하기 위한
            재배분 결과입니다.
          </li>
          <li style={{ marginBottom: 6 }}>두 결과의 격차가 작을 때는 "차이가 미미하다"로 읽으면 됩니다.</li>
        </ul>
      </Section>

      {/* 5. 예측값의 의미 */}
      <Section
        num="5. 예측값의 의미"
        title="최적화 결과이지만, 집행 성과를 보장하지는 않습니다"
        lead={
          <>
            BudgetOpt 2.0의 결과는 모델이 최적화 원리를 적용해 산출한 최적화 결과(배분안)입니다. 다만 수치는 예측값이며,
            실제 캠페인 집행 후 성과를 보장하지는 않습니다. 선을 긋는 대상은 "이것이 최적화 결과다"가 아니라{' '}
            <b style={{ color: t.fg }}>"실제 집행 성과를 보장한다"</b>입니다.
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, margin: '10px 0' }}>
          <DoDont
            variant="do"
            title="이렇게 읽으세요"
            items={[
              '최적화 원리를 적용해 산출한 최적화 결과이며, 수치는 예측값',
              '비교할 때는 KPI 총량과 Avg. 단가를 함께 확인',
            ]}
          />
          <DoDont
            variant="dont"
            title="이렇게 읽으면 오해입니다"
            items={[
              '예측 수치를 집행 성과가 확정된 것처럼 해석',
              '"예측일 뿐이니 최적 결과가 아니다"라고 결과 자체를 깎아서 해석',
              'delta 마이너스 매체를 손해로 해석',
            ]}
          />
        </div>

        <SubHead>모델이 반영하는 변수: 공휴일</SubHead>
        <p style={{ fontSize: 14, color: t.muted, margin: '0 0 16px', lineHeight: 1.7, maxWidth: 680 }}>
          Meridian 모델은 공휴일을 KPI 예측에 <b style={{ color: t.fg }}>직접 반영</b>합니다. KPI를 '기본 수준(baseline)
          + 매체 효과 + 공휴일 효과'로 분리해 학습하므로, 연휴로 인한 성과 변동이 매체 효과로 잘못 섞이지 않습니다.
        </p>
        <SimpleTable
          headers={['구분', '내용']}
          rows={[
            ['반영 범위', '법정 공휴일 전체 (대체공휴일 · 임시공휴일 · 선거일 포함). 날짜는 공공데이터포털 특일정보 API(한국천문연구원) 기준'],
            ['반영되지 않음', '명절 전후 연차, 블랙프라이데이 등 쇼핑 시즌, 방학 (법정 공휴일만 반영)'],
            ['반영 시점', '과거 집행 데이터 학습에 반영됩니다. 이번 캠페인 집행 기간의 공휴일을 예측에 직접 적용하지는 않습니다.'],
          ]}
        />
        <ExampleNote>공휴일 반영은 예측 정확도를 높이기 위한 것이며, 특정 시기의 실제 성과를 보장하지 않습니다.</ExampleNote>
      </Section>

      {/* 6. 차트에서 헷갈리기 쉬운 개념 */}
      <Section
        num="6. 차트에서 헷갈리기 쉬운 개념"
        title="차트를 읽을 때 자주 생기는 오해"
        lead="위에서 설명한 원리가 차트에서 어떻게 보이는지, 그리고 오해하기 쉬운 지점만 정리했습니다. 화면 구성은 '시나리오 결과' 문서를 참고해 주세요."
      >
        <ReadCard title="Budget Share" q="예산은 어디에 배분되었을까?">
          <li style={{ marginBottom: 6 }}>
            예산 비중이 높다고 KPI 기여도도 높은 것은 아닙니다. 테이블의 Estimated KPI와 함께 봐야 효율을 판단할 수
            있습니다.
          </li>
          <li style={{ marginBottom: 6 }}>
            잠금 반영 ↔ 순수 최적화를 전환하면, 비중 변화를 통해 잠금이 어떤 매체에 영향을 줬는지 알 수 있습니다.
          </li>
        </ReadCard>

        <ReadCard
          title="Response Curve"
          q="예산을 더 넣으면 성과가 오를까?"
          warn={
            <>
              <b style={{ color: t.fg }}>X축 끝 ≠ 포화.</b> X축 범위는 매체마다 다르고 예산 상한도 아닙니다. 곡선이 끝나
              보여도 포화 예산이 차트 범위 밖에 있어 아직 포화 전일 수 있습니다.
            </>
          }
        >
          <li style={{ marginBottom: 6 }}>
            Current Spend 마커(●) 왼쪽은 이미 투입된 구간의 성과, 오른쪽은 추가 투입 시 예상 성과입니다. 곡선이
            완만할수록 효율이 포화에 가깝습니다.
          </li>
          <li style={{ marginBottom: 6 }}>
            증액 우선순위는 포화도가 아니라 <b style={{ color: t.fg }}>100만원당 증가 KPI의 대소 비교</b>로 판단합니다.
          </li>
        </ReadCard>

        <ReadCard title="Weekly Contribution" q="업종 내 매체별 기여는 어떤 흐름일까?">
          <li style={{ marginBottom: 6 }}>
            이 시나리오의 <b style={{ color: t.fg }}>미래 성과 예측이 아닙니다.</b> 업종 모델이 학습한 과거 기간의 주차별
            KPI 기여 패턴입니다.
          </li>
          <li style={{ marginBottom: 6 }}>
            차트에 보이는 계열은 이 시나리오에서 <b style={{ color: t.fg }}>선택한 매체·상품뿐</b>입니다. 비중은 "업종
            전체에서 X%"가 아니라 "선택한 매체들 안에서의 비중"입니다.
          </li>
          <li style={{ marginBottom: 6 }}>
            보라색 음영은 캠페인 기간의 전년·전전년 동기간으로, 같은 시기의 계절성을 참고할 수 있습니다.
          </li>
        </ReadCard>

        <ReadCard
          title="Incremental {KPI}"
          q="최적화로 성과가 얼마나 늘어날까?"
          warn={
            <>
              <b style={{ color: t.fg }}>− 값이 나온 매체는 '손해'가 아닙니다.</b> 전체 KPI 최대화를 위한 재배분
              결과입니다.
            </>
          }
        >
          <li style={{ marginBottom: 6 }}>
            기준점은 현재 플랜이 아니라 <b style={{ color: t.fg }}>균등 배분</b>(예산을 균등하게 나눴을 때의 총 KPI)입니다.
          </li>
          <li style={{ marginBottom: 6 }}>
            채널별 + 값은 증액으로 창출한 KPI, − 값은 감액으로 줄어든 KPI입니다. 얻은 KPI가 잃은 KPI보다 크면 총 KPI가
            순증합니다.
          </li>
        </ReadCard>
      </Section>

      {/* 7. 용어 정리 */}
      <Section
        num="7. 용어 정리"
        title="KPI 4종과 Avg. 단가 한눈에 보기"
        lead="앞에서 나온 지표와 단위를 한곳에 정리했습니다. 시나리오는 아래 4가지 KPI 중 1개를 선택해 최적화하며, 화면 전반의 라벨과 차트, 테이블이 선택한 KPI에 맞춰 바뀝니다."
      >
        <SimpleTable
          headers={['KPI', '영문', '단위']}
          rows={[
            ['노출', <span style={{ fontVariantNumeric: 'tabular-nums' }}>Impression</span>, '회'],
            ['클릭', <span style={{ fontVariantNumeric: 'tabular-nums' }}>Click</span>, '회'],
            ['조회', <span style={{ fontVariantNumeric: 'tabular-nums' }}>View</span>, '회'],
            ['도달', <span style={{ fontVariantNumeric: 'tabular-nums' }}>Reach</span>, '회'],
          ]}
        />
        <ExampleNote>
          모든 KPI 수량 단위는 '회'로 통일되어 있습니다. 도달도 비율(%)이 아닌 도달 수 개념이지만, 화면 표기는
          '회'입니다.
        </ExampleNote>

        <SubHead>Estimated {'{KPI}'}는 예측값입니다</SubHead>
        <p style={{ fontSize: 14, color: t.muted, margin: '0 0 16px', lineHeight: 1.7, maxWidth: 680 }}>
          이 예산 배분으로 예측되는 KPI 총량이며, 실제 집행 성과를 보장하지 않습니다. 매체별 도달을 더한 값과 전체
          도달은 다를 수 있는데, 전체 도달(Estimated Total의 Reach)은 매체 간 중복이 제거된 값이기 때문입니다.
        </p>

        <SubHead>Avg. 단가는 이렇게 계산됩니다</SubHead>
        <p style={{ fontSize: 14, color: t.muted, margin: '0 0 16px', lineHeight: 1.7, maxWidth: 680 }}>
          투입 예산 대비 KPI 1단위를 얻는 효율 지표입니다. 선택한 KPI에 따라 이름이 달라지며,{' '}
          <b style={{ color: t.fg }}>값이 낮을수록 효율이 높습니다.</b>
        </p>
        <div
          style={{
            background: t.primary,
            color: t.primaryFg,
            borderRadius: 10,
            padding: '20px 24px',
            margin: '10px 0',
          }}
        >
          <FormulaRow name="노출 → Avg. CPM" top="총예산" bottom="총노출 ÷ 1,000" desc="노출 1,000회당 비용" />
          <FormulaRow name="클릭 → Avg. CPC" top="총예산" bottom="총클릭" desc="클릭 1회당 비용" />
          <FormulaRow name="조회 → Avg. CPV" top="총예산" bottom="총조회" desc="조회 1회당 비용" />
          <FormulaRow name="도달 → Avg. CPR" top="총예산" bottom="총도달" desc="도달 1회당 비용" />
        </div>
        <ExampleNote>분모(총 KPI)가 0이면 값은 0으로 표기됩니다.</ExampleNote>
      </Section>
    </div>
  )
}
