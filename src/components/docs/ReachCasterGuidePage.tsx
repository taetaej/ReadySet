import React, { useState, useMemo } from 'react'

/**
 * Reach Caster 원리와 개념 — 인터랙티브 가이드
 *
 * 원본(public/reach_caster_guide.html)의 핵심 인터랙션(슬라이더 시뮬레이터)을
 * 살리되, 색은 ReadySet 무채색 토큰(hsl(var(--...)))으로 통일해 다크모드까지 대응한다.
 * 강조는 primary 하나로만, 장식(아이콘 뱃지/겹친 틴트)은 걷어냈다.
 */

// 문서 전체에서 일관되게 쓰는 예시 수치 (딱 떨어지는 값으로 통일)
// Universe(타겟 전체) 3,000만 · Ceiling(지면 최대 도달) 2,000만 → 도달률 상한 약 67%
const UNIVERSE = 30_000_000 // 타겟 전체 인구 (예: 3,000만 명)
const CEILING = 20_000_000 // 지면 최대 잠재 도달 (예: 2,000만 명)
const UNITS = 40 // 시각화 점 개수 → 원 1개 = 50만 명
const PER_UNIT = CEILING / UNITS // 500,000 (원 1개당 인원)
const EFF_RATE = 0.46 // 총노출 → 유효노출 전환 비율
// 참고: 적정 빈도는 캠페인 목적·업종마다 다르므로, 특정 값을 '과포화'로 단정하지 않는다.
const HIGH_FREQ = 20 // 점 색 강조 기준 (빈도가 충분히 높아졌음을 시각적으로만 표현)

function fmt(n: number): string {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + '조'
  if (n >= 1e8) return (n / 1e8).toFixed(1) + '억'
  if (n >= 1e4) return Math.round(n / 1e4).toLocaleString() + '만'
  return Math.round(n).toLocaleString()
}

// 슬라이더(0~100) → 노출량. 0에서 시작(노출 0)하며, 성장 → 포화 → 빈도폭증을
// 순서대로 체감하도록 두 구간으로 나눠 매핑한다.
//   앞 절반(0~50):  0 → 포화점(유효노출이 CEILING에 닿는 노출량)까지 선형 → '성장중' 구간이 잘 보임
//   뒤 절반(50~100): 포화점 → 5조 회까지 로그 → 포화 후 '빈도 폭증'이 잘 보임
const SATURATION_IMP = CEILING / EFF_RATE // 유효노출 = CEILING이 되는 노출량 (약 4,350만)
const IMP_MAX = 5e12 // 슬라이더 끝 = 5조 회 (극단적 과다 노출)
function impFromSlider(v: number): number {
  if (v <= 50) {
    return (v / 50) * SATURATION_IMP
  }
  const p = (v - 50) / 50 // 0~1
  const minLog = Math.log10(SATURATION_IMP)
  const maxLog = Math.log10(IMP_MAX)
  return Math.pow(10, minLog + p * (maxLog - minLog))
}

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

function Section({
  num,
  title,
  lead,
  children,
}: {
  num: string
  title: string
  lead?: string
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

function Simulator() {
  const [v, setV] = useState(30)

  const { imp, reach, freq, saturated } = useMemo(() => {
    const imp = impFromSlider(v)
    const eff = imp * EFF_RATE
    let reach: number
    let freq: number
    if (eff <= CEILING) {
      reach = eff
      freq = 1
    } else {
      reach = CEILING
      freq = eff / CEILING
    }
    return { imp, reach, freq, saturated: eff > CEILING }
  }, [v])

  const filledUnits = Math.round((reach / CEILING) * UNITS)
  const freqLabel = freq >= 1000 ? Math.round(freq).toLocaleString() + '회' : freq.toFixed(1) + '회'
  // 도달률(%)은 타겟 전체 인구(Universe) 대비. Ceiling(2,000만)/Universe(3,000만)=약 67%가 상한.
  const reachPct = (reach / UNIVERSE) * 100
  // 빈도 막대는 로그 스케일로(빈도가 수만까지 치솟아도 막대 안에 담기게)
  const freqBarPct = Math.min(100, (Math.log10(Math.max(freq, 1)) / Math.log10(5000)) * 100)

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
      {/* 3번과 이어지는 베이스 케이스 명시 */}
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
        <b style={{ color: t.fg }}>3번과 같은 예시 지면</b> 기준입니다 — 타겟 전체 인구 3,000만 명, 이 지면 최대 도달(Ceiling) 2,000만 명(도달률 상한 약 67%).
        노출량만 바꿔가며 도달률과 빈도가 어떻게 움직이는지 확인해 보세요.
      </p>

      {/* 유저 풀 시각화 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: 8,
          maxWidth: 280,
          margin: '0 auto 8px',
        }}
      >
        {Array.from({ length: UNITS }).map((_, i) => {
          const filled = i < filledUnits
          const hot = filled && saturated && freq > HIGH_FREQ
          return (
            <div
              key={i}
              style={{
                width: 15,
                height: 15,
                borderRadius: '50%',
                background: hot
                  ? t.primary
                  : filled
                  ? 'hsl(var(--primary) / 0.55)'
                  : t.mutedBg,
                border: `1px solid ${filled ? t.primary : t.border}`,
                transition: 'background .25s, border-color .25s',
              }}
            />
          )
        })}
      </div>
      <p style={{ textAlign: 'center', fontSize: 12, color: t.muted, margin: '0 0 22px' }}>
        원 1개 = 이 지면을 이용하는 {fmt(PER_UNIT)} 명 · {UNITS}개 전체 = {fmt(CEILING)} 명 (예시 기준)
      </p>

      {/* 슬라이더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <label style={{ fontSize: 13, color: t.muted, whiteSpace: 'nowrap' }}>노출량 투입</label>
        <input
          type="range"
          min={0}
          max={100}
          value={v}
          step={1}
          onChange={(e) => setV(Number(e.target.value))}
          style={{ flex: 1, accentColor: t.primary }}
        />
        <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 13, fontWeight: 600, minWidth: 76, textAlign: 'right', color: t.fg }}>
          {fmt(imp)}회
        </span>
      </div>

      {/* 결과 지표 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <Stat n={`${fmt(reach)}명`} l="순도달(명)" />
        <Stat n={freqLabel} l="평균 빈도(회)" />
        <Stat n={saturated ? '포화' : '성장중'} l="상태" highlight={saturated} />
      </div>

      {/* 도달률 vs 빈도 대비 게이지 — 포화 이후 도달은 멈추고 빈도만 자라는 걸 시각화 */}
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <GaugeRow
          label="도달률"
          barPct={reachPct}
          valueText={`${reachPct.toFixed(1)}%`}
          capText={saturated ? '상한 도달 (약 67%)' : undefined}
          capPct={(CEILING / UNIVERSE) * 100}
        />
        <GaugeRow
          label="평균 빈도"
          barPct={freqBarPct}
          valueText={freqLabel}
          emphasize={saturated}
        />
      </div>

      <p style={{ fontSize: 13, color: t.muted, textAlign: 'center', margin: '18px 0 0', lineHeight: 1.6 }}>
        {saturated
          ? `이 지면을 이용하는 사람(예시 기준 2,000만 명)에게 거의 다 닿았습니다. 이 지점부터는 노출을 더 넣어도 새로운 사람은 늘지 않고, 같은 사람이 보는 횟수(빈도)만 계속 올라갑니다. 어느 정도의 빈도가 적정한지는 캠페인 목적에 따라 다릅니다.`
          : '아직 닿지 않은 사람이 남아 있어, 노출을 늘릴수록 도달도 함께 늘어납니다.'}
      </p>
    </div>
  )
}

function GaugeRow({
  label,
  barPct,
  valueText,
  capText,
  capPct,
  emphasize,
}: {
  label: string
  barPct: number
  valueText: string
  capText?: string
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
            transition: 'width .25s',
          }}
        />
        {/* 상한선 눈금 (도달률 막대에만) */}
        {capPct != null && (
          <div
            style={{
              position: 'absolute',
              top: -2,
              bottom: -2,
              left: `${capPct}%`,
              width: 2,
              background: t.fg,
              opacity: 0.55,
            }}
          />
        )}
      </div>
      {capText && (
        <div style={{ fontSize: 11, color: t.muted, marginTop: 4, textAlign: 'right' }}>
          {capText} — 여기서 더 올라가지 않습니다
        </div>
      )}
    </div>
  )
}

function Stat({ n, l, highlight }: { n: string; l: string; highlight?: boolean }) {
  return (
    <div
      style={{
        background: highlight ? t.primarySoft : t.mutedBg,
        borderRadius: 8,
        padding: '14px 8px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontVariantNumeric: 'tabular-nums', fontSize: 19, fontWeight: 700, color: t.fg }}>{n}</div>
      <div style={{ fontSize: 11, color: t.muted, marginTop: 4 }}>{l}</div>
    </div>
  )
}

function Metric({ name, unit, desc }: { name: string; unit: string; desc: string }) {
  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: '18px 16px' }}>
      <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: t.fg }}>{name}</p>
      <p style={{ fontSize: 12, color: t.muted, margin: '0 0 10px' }}>{unit}</p>
      <p style={{ fontSize: 13, color: t.muted, margin: 0, lineHeight: 1.6 }}>{desc}</p>
    </div>
  )
}

export function ReachCasterGuidePage() {
  return (
    <div style={{ width: '100%', margin: '0 auto', color: t.fg, wordBreak: 'keep-all', overflowWrap: 'break-word' }}>
      {/* Hero */}
      <header style={{ padding: '8px 0 4px' }}>
        <p style={{ fontSize: 13, color: t.muted, fontWeight: 500, margin: '0 0 14px' }}>Reach Caster</p>
        <h1 style={{ fontSize: 28, lineHeight: 1.4, fontWeight: 700, margin: '0 0 14px', color: t.fg }}>
          Reach Caster 원리와 개념
        </h1>
        <p style={{ fontSize: 15, color: t.muted, maxWidth: 680, margin: 0, lineHeight: 1.7 }}>
          Reach Caster가 어떤 원리로 숫자를 산출하는지, 그리고 그 숫자를 어떻게 읽어야 하는지
          가장 쉽게 설명합니다. 아래 슬라이더를 직접 움직여 보면 한 번에 이해됩니다.
        </p>
      </header>

      {/* 1. 지표 정의 */}
      <Section
        num="1. 핵심 지표"
        title="도달 · 노출 · 빈도는 서로 다른 숫자"
        lead="이 셋을 헷갈리면 그다음 원리가 이해되지 않습니다. 각각 무엇을 세는 숫자인지부터 구분합니다."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <Metric name="도달 (Reach)" unit="단위: 명" desc="캠페인 기간 동안 광고에 최소 1회 이상 노출된 순수 유저 수. 중복을 제외한 사람 수입니다." />
          <Metric name="노출 (Impression)" unit="단위: 회" desc="광고가 화면에 송출된 총 횟수. 같은 사람이 여러 번 보면 계속 누적됩니다." />
          <Metric name="빈도 (Frequency)" unit="단위: 회" desc="광고를 본 1인당 평균 노출 횟수입니다." />
        </div>
        <Formula />
      </Section>

      {/* 2. 유효 노출 */}
      <Section
        num="2. 유효 노출"
        title="서버가 센 노출이 다 유효한 건 아닙니다"
        lead="유효 노출은 총노출수 중 타겟이 실제로 인지 가능한 유의미한 노출만 통계적으로 선별한 지표입니다. 봇 트래픽, 비뷰어블 스크롤 아웃, 무효 트래픽 등 허수 노출을 걷어냅니다."
      >
        <ExampleNote>아래 46%는 개념 이해를 돕기 위한 예시 비율입니다. 실제 전환 비율은 매체·지면 특성에 따라 달라집니다.</ExampleNote>
        <div style={{ margin: '4px 0 20px' }}>
          <Bar label="총노출수" pct={100} tone="muted" text="100%" />
          <Bar label="유효 노출" pct={46} tone="primary" text="약 46% (예시)" />
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <MiniCard tag="보장형 · CPT" text="예를 들어 보장형 DA·타임보드류 상품은 트래픽 안정성과 가시성이 높아 차감 보정률이 낮고, 유효 노출 전환 비율이 높습니다." />
          <MiniCard tag="비딩형 · RTB" text="트래픽 변동성과 노이즈가 상대적으로 커 보수적인 보정치가 적용됩니다." />
        </div>
      </Section>

      {/* 3. 물리적 한계 */}
      <Section
        num="3. 도달의 물리적 한계"
        title="도달률은 왜 100%까지 가지 못할까"
        lead="한 지면으로 닿을 수 있는 사람 수엔 천장(Ceiling)이 있습니다. Reach Caster는 가상 수치를 무한정 만드는 계산기가 아니라, 실제 인구통계(Universe)와 매체별 활동 유저 풀을 기반으로 확률 곡선을 도출하기 때문입니다."
      >
        <ExampleNote>아래 매체명과 수치는 개념 설명을 위한 예시입니다. 실제 값은 타겟·매체·기간에 따라 달라집니다.</ExampleNote>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
          <Funnel pct={100} label="타겟 전체 인구 (Universe)" val="예: 19~49세 3,000만 명" />
          <Arrow text="↓ 해당 매체·지면 실제 가용 모수" drop="−20%p" />
          <Funnel pct={80} label="특정 지면 이용자 (예시 매체)" val="예: 2,400만 명" />
          <Arrow text="↓ 디바이스 보급률 · 실활동률(DAU) · 뷰어빌리티" drop="−13%p" />
          <Funnel pct={67} label="지면 최종 최대 잠재 도달 (Ceiling)" val="예: 2,000만 명" strong />
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '32px 0 6px', color: t.fg }}>
          그래서 도달률(%)에도 상한이 생깁니다
        </h3>
        <p style={{ fontSize: 14, color: t.muted, margin: '0 0 16px', lineHeight: 1.7 }}>
          도달률(%)의 분모는 <b style={{ color: t.fg }}>타겟 전체 인구(Universe)</b>인데, 실제로 닿을 수 있는 사람은 그중{' '}
          <b style={{ color: t.fg }}>해당 지면을 쓰는 사람(Ceiling)</b>뿐입니다. 그래서 한 지면의 도달률은 아무리 노출을 늘려도
          이 비율을 넘지 못합니다.
        </p>

        <div
          style={{
            background: t.primary,
            color: t.primaryFg,
            borderRadius: 10,
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
            fontSize: 14,
          }}
        >
          <span style={{ fontWeight: 600 }}>도달률 상한</span>
          <span style={{ fontSize: 18, opacity: 0.7 }}>=</span>
          <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch', textAlign: 'center' }}>
            <span style={{ padding: '0 8px 8px' }}>지면 최대 잠재 도달 (Ceiling)</span>
            <span style={{ height: 1, background: t.primaryFg, opacity: 0.5 }} />
            <span style={{ padding: '8px 8px 0' }}>타겟 전체 인구 (Universe)</span>
          </span>
        </div>

        <p style={{ fontVariantNumeric: 'tabular-nums', fontSize: 13.5, color: t.muted, margin: '12px 0 0', textAlign: 'center' }}>
          위 예시 기준 &nbsp;2,000만 ÷ 3,000만 <b style={{ color: t.fg }}>≈ 최대 약 67%</b>
          &nbsp;— 노출을 수조 회 부어도 이 지면 단독으로는 100%에 닿을 수 없습니다.
        </p>

        <div
          style={{
            background: t.primarySoft,
            borderRadius: 10,
            padding: '18px 20px',
            fontSize: 13.5,
            color: t.fg,
            marginTop: 20,
            lineHeight: 1.7,
          }}
        >
          <b>포화 현상</b> — 이미 해당 지면의 가용 유저 전체(위 예시에서는 2,000만 명)에게 광고가 닿은 시점부터는,
          노출을 수억·수조 회 추가해도 순도달은 상한선에 고정되어 단 1명도 늘지 않습니다.
          <br />
          <br />
          다만 이 천장은 <b>지면 단위</b>의 이야기입니다. 서로 다른 지면·매체를 함께 쓰면 각자의 유저 풀이 더해져 전체 도달률은 더 올라갈 수 있습니다(중복은 제거됨 — 5번 참고).
        </div>
      </Section>

      {/* 4. 시뮬레이터 */}
      <Section
        num="4. 직접 눌러보기"
        title="노출을 늘리면 도달과 빈도가 어떻게 움직일까"
        lead="슬라이더를 밀어 노출량을 키워 보세요. 처음엔 도달률과 빈도가 함께 오르지만(성장중), 지면 유저에게 다 닿으면 도달률 막대는 상한선(약 67%)에 딱 멈추고 빈도 막대만 계속 자랍니다(포화). 도달은 멈췄는데 빈도만 늘어나는 대비를 두 막대로 확인할 수 있습니다."
      >
        <Simulator />

        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '32px 0 8px', color: t.fg }}>
          같은 예산, 노출량만 늘린 예시
        </h3>
        <ExampleNote>아래 표의 모든 수치는 원리 설명을 위해 가정한 예시 값입니다. 실제 산출 결과가 아닙니다.</ExampleNote>
        <CaseTable />
      </Section>

      {/* 5. 중복 제거 */}
      <Section
        num="5. 중복 제거 (Deduplication)"
        title="여러 지면을 합쳐도 같은 사람은 한 번만 셉니다"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DedupCard
            variant="single"
            title="시나리오 내 단일 지면 합산"
            text="동일 지면의 구좌·노출량을 합산 입력하면, 확률 모델이 지면 모수 내 중복 노출을 자동 계산해 도달 증가 폭은 둔화되고 빈도가 상승합니다."
          />
          <DedupCard
            variant="mix"
            title="이종 매체 믹스"
            text="여러 매체·지면을 믹스해도 매체 간 교차 유저 풀을 기반으로 중복이 자동 제거되어 '통합 순도달'로 정제됩니다."
          />
        </div>
      </Section>

      {/* 6. 입력 가이드 */}
      <Section
        num="6. 올바른 입력 가이드"
        title="현실적인 범위로 입력해야 비교가 의미 있습니다"
        lead="시장 단가와 지면 가용 트래픽을 벗어난 비현실적 수치를 넣으면, 모델은 수학적 한계점(Ceiling)에서 같은 상한값만 반환해 비교 분석의 의미가 사라집니다."
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <DoDont
            variant="do"
            title="이렇게 입력하세요"
            items={[
              '실제 집행 가능한 시장 단가·지면 가용 트래픽 범위 내 수치',
              '고정형(CPT) 다구좌 상품은 구좌·시간대별 가중치를 쪼개지 말고, 집행 기간·총예산·총노출수 합계를 단일 슬롯에 합산 입력',
            ]}
          />
          <DoDont
            variant="dont"
            title="이러면 값이 깨집니다"
            items={[
              '조 단위 노출량, CPM 수백 원 미만 등 비현실적 수치',
              '구좌 수나 시간대별 가중치를 개별 변수로 쪼개서 입력',
            ]}
          />
        </div>
      </Section>
    </div>
  )
}

function ExampleNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 12.5,
        color: t.muted,
        margin: '0 0 16px',
        paddingLeft: 12,
        borderLeft: `2px solid ${t.border}`,
        lineHeight: 1.6,
      }}
    >
      {children}
    </p>
  )
}

function Formula() {
  return (
    <div
      style={{
        background: t.primary,
        color: t.primaryFg,
        borderRadius: 10,
        padding: '24px 22px',
        marginTop: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 600 }}>
        평균 빈도 <span style={{ opacity: 0.6, fontWeight: 400 }}>(Frequency)</span>
      </span>
      <span style={{ fontSize: 18, opacity: 0.7 }}>=</span>
      <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch', textAlign: 'center' }}>
        <span style={{ padding: '0 8px 8px', fontSize: 14 }}>
          총 유효 노출수 <span style={{ opacity: 0.6 }}>(Effective Imp)</span>
        </span>
        <span style={{ height: 1, background: t.primaryFg, opacity: 0.5 }} />
        <span style={{ padding: '8px 8px 0', fontSize: 14 }}>
          순 도달 <span style={{ opacity: 0.6 }}>(Unique Reach)</span>
        </span>
      </span>
    </div>
  )
}

function Bar({ label, pct, tone, text }: { label: string; pct: number; tone: 'muted' | 'primary'; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
      <span style={{ width: 96, fontSize: 13, color: t.muted, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 28, background: t.mutedBg, borderRadius: 6, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: tone === 'primary' ? t.primary : 'hsl(var(--muted-foreground) / 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 10,
          }}
        >
          <span style={{ fontSize: 12, color: tone === 'primary' ? t.primaryFg : t.fg, fontWeight: 500 }}>{text}</span>
        </div>
      </div>
    </div>
  )
}

function MiniCard({ tag, text }: { tag: string; text: string }) {
  return (
    <div style={{ flex: 1, minWidth: 220, background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: 16 }}>
      <span
        style={{
          display: 'inline-block',
          fontSize: 11,
          fontWeight: 500,
          padding: '3px 9px',
          borderRadius: 999,
          marginBottom: 8,
          background: t.mutedBg,
          color: t.fg,
        }}
      >
        {tag}
      </span>
      <p style={{ fontSize: 13, color: t.muted, margin: 0, lineHeight: 1.6 }}>{text}</p>
    </div>
  )
}

function Funnel({ pct, label, val, strong }: { pct: number; label: string; val: string; strong?: boolean }) {
  // 중앙 정렬 + 위→아래로 폭이 좁아지는 퍼널 형태. 텍스트는 바 안 중앙에 한 줄로.
  return (
    <div
      style={{
        width: `${pct}%`,
        margin: '0 auto',
        background: strong ? t.primary : 'hsl(var(--foreground) / 0.72)',
        color: strong ? t.primaryFg : 'hsl(var(--background))',
        borderRadius: 8,
        padding: '13px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        flexWrap: 'wrap',
        textAlign: 'center',
        boxSizing: 'border-box',
        transition: 'width .3s',
      }}
    >
      <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
      <span style={{ opacity: 0.5 }}>·</span>
      <span style={{ fontWeight: 500, fontSize: 13 }}>{label}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12, opacity: 0.75 }}>{val}</span>
    </div>
  )
}

function Arrow({ text, drop }: { text: string; drop?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '4px 0', width: '100%', boxSizing: 'border-box', textAlign: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontSize: 12, color: t.muted }}>{text}</span>
      {drop && (
        <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12, color: t.fg, fontWeight: 600, whiteSpace: 'nowrap' }}>
          {drop}
        </span>
      )}
    </div>
  )
}

function CaseTable() {
  const rows = [
    ['케이스 A', '5억 회', '약 2.3억 회', '2,000만 명', '11.5회', '지면 잠재 모수 100% 도달 (포화)'],
    ['케이스 B', '6억 회 (+1억)', '약 2.7억 회', '2,000만 명 (변화 없음)', '13.5회 (상승)', '신규 유저 없이 기존 유저 노출만 증가'],
    ['케이스 C', '10조 회 (극단값)', '약 5조 회', '2,000만 명 (변화 없음)', '250,000회 (폭증)', '1인당 광고를 25만 번 본 것으로 전이'],
  ]
  const headers = ['구분', '노출량', '유효 노출', '순도달', '평균 빈도', '비고']
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 14 }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{ textAlign: 'left', padding: '10px 12px', borderBottom: `1px solid ${t.border}`, color: t.muted, fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap' }}
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
                    padding: '10px 12px',
                    borderBottom: `1px solid ${t.border}`,
                    verticalAlign: 'top',
                    color: ci === 0 ? t.fg : t.muted,
                    fontVariantNumeric: ci >= 1 && ci <= 4 ? 'tabular-nums' : 'normal',
                    fontWeight: ri === 2 && ci === 4 ? 700 : 400,
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

function DedupCard({ variant, title, text }: { variant: 'single' | 'mix'; title: string; text: string }) {
  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: 18 }}>
      <h4 style={{ fontSize: 14, margin: '0 0 10px', color: t.fg }}>{title}</h4>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 14px' }}>
        <VennDiagram variant={variant} />
      </div>
      <p style={{ fontSize: 13, color: t.muted, margin: 0, lineHeight: 1.6 }}>{text}</p>
    </div>
  )
}

function VennDiagram({ variant }: { variant: 'single' | 'mix' }) {
  // 무채색 primary 톤의 투명 레이어로 겹침을 표현 (곱해지는 부분이 자연스럽게 진해짐)
  const fill = 'hsl(var(--primary))'
  if (variant === 'single') {
    return (
      <svg width={180} height={100} viewBox="0 0 180 100" role="img" aria-label="두 원이 크게 겹친 벤 다이어그램">
        <circle cx={72} cy={50} r={34} fill={fill} fillOpacity={0.28} />
        <circle cx={108} cy={50} r={34} fill={fill} fillOpacity={0.28} />
      </svg>
    )
  }
  return (
    <svg width={180} height={100} viewBox="0 0 180 100" role="img" aria-label="세 원이 부분적으로 겹친 벤 다이어그램">
      <circle cx={68} cy={52} r={28} fill={fill} fillOpacity={0.22} />
      <circle cx={104} cy={38} r={28} fill={fill} fillOpacity={0.22} />
      <circle cx={104} cy={62} r={28} fill={fill} fillOpacity={0.22} />
    </svg>
  )
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
      <h4 style={{ fontSize: 14, margin: '0 0 10px', color: isDo ? t.fg : 'hsl(var(--destructive))' }}>{title}</h4>
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
