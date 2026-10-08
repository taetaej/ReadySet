
// - 업종 필터 1개(제목 옆)로 두 차트 공통 필터링
// - 차트1: 매체·광고상품별 광고비 비중 (도넛, 최대 7개) + 범례
// - 차트2: 매체·광고상품별 CTR × CPC 산점도 (클릭 효율 vs 클릭 단가)
// 색/축/툴팁은 Budget Optimizer 패턴:
//   · 1위(최대 비중)만 시그니처 그린(--bo-accent), 나머지 무채색 opacity 단계
//   · 축 muted-foreground + axisLine/tickLine false, 커스텀 툴팁(card/border/8px/shadow)
// DataShot은 인라인 스타일 모듈이므로 토큰 값을 인라인으로 사용.
import { useState, useEffect } from 'react'
import { ChevronDown, Info } from 'lucide-react'
import { SpinXSymbol } from '../spinx/SpinXSymbol'
import { PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ZAxis, ReferenceLine, ReferenceArea } from 'recharts'
import { type PeriodLike, isWithin2026H1, getBenchmarkIndustries, getIndustryChartRows } from './benchmark2026H1'

// label = 실제 광고상품명(mediaData.DIGITAL 기준), media = 매체(색상 그룹용)
// 절대수(impressions/clicks/views/cost)는 내부 계산(가중평균·비중)에만 쓰고 화면엔 노출 안 함.
// clicks===0 → 클릭 탭 제외(조회형), views===0 → 조회 탭 제외.
interface Row {
  label: string; media: string
  cost: number           // 광고비(내부)
  impressions: number    // 노출수(내부)
  clicks: number         // 클릭수(내부, 0이면 조회형)
  views: number          // 조회수(내부, 0이면 클릭형)
  ctr: number; cpc: number   // 클릭 탭 지표
  vtr: number; cpv: number   // 조회 탭 지표
}

// 샘플 상품 1개 생성 — 노출·클릭·조회·광고비로 지표(CTR/CPC/VTR/CPV) 자동 산출.
// clicks=0이면 ctr/cpc=0(클릭 탭 제외), views=0이면 vtr/cpv=0(조회 탭 제외).
function mkRow(label: string, media: string, cost: number, impressions: number, clicks: number, views: number): Row {
  return {
    label, media, cost, impressions, clicks, views,
    ctr: clicks > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0,  // % 2자리
    cpc: clicks > 0 ? Math.round(cost / clicks) : 0,
    vtr: views > 0 ? Math.round((views / impressions) * 10000) / 100 : 0,
    cpv: views > 0 ? Math.round(cost / views) : 0,
  }
}

const dataByIndustry: Record<string, Row[]> = {
  // 다매체 — 클릭형·조회형 혼재
  '패션': [
    mkRow('디맨드젠 이미지 광고_ROAS', 'Google Ads', 32000000, 4200000, 75600, 1680000),
    mkRow('경매_판매_전환값 극대화_instagram', 'Meta', 18000000, 2100000, 48300, 630000),
    mkRow('판매_전환_TikTok_동영상', 'TikTok', 24000000, 3800000, 41800, 1900000),
    mkRow('반응형 디스플레이 광고_CPC', 'Google Ads', 15000000, 2500000, 22500, 0),
    mkRow('경매_트래픽_링크 클릭수 극대화_facebook&instagram', 'Meta', 21000000, 2600000, 75400, 390000),
    mkRow('YouTube 셀렉트_CPM', 'Google Ads', 12000000, 2800000, 95200, 2240000),
    mkRow('트래픽_클릭_TikTok_동영상', 'TikTok', 8000000, 1500000, 22500, 750000),
  ],
  // 단일 매체(Google Ads) — '매체' 뷰 토글 비활성 케이스
  '식품': [
    mkRow('반응형 디스플레이 광고_CPA', 'Google Ads', 28000000, 3200000, 108800, 0),
    mkRow('디맨드젠 동영상 광고_ROAS', 'Google Ads', 19000000, 2400000, 50400, 1200000),
    mkRow('디맨드젠 이미지 광고_CPC', 'Google Ads', 12000000, 1900000, 22800, 0),
    mkRow('YouTube 셀렉트_CPM', 'Google Ads', 9000000, 2100000, 33600, 1050000),
  ],
  '금융보험및증권': [
    mkRow('경매_잠재 고객_잠재 고객 수 극대화_facebook&instagram', 'Meta', 41000000, 5100000, 40800, 0),
    mkRow('반응형 디스플레이 광고_CPM', 'Google Ads', 35000000, 4200000, 109200, 1680000),
    mkRow('웹사이트 전환_전환_TikTok_동영상', 'TikTok', 8000000, 1300000, 16900, 650000),
  ],
}

// BO 팔레트 규칙: 1위(강조 대상)만 시그니처 그린, 나머지는 무채색 opacity 단계
const MONO_OPACITIES = [1, 0.7, 0.5, 0.35, 0.2, 0.12, 0.08]
function colorByRank(rank: number, isTop: boolean): string {
  if (isTop) return 'hsl(var(--bo-accent))'
  return `hsl(var(--foreground) / ${MONO_OPACITIES[Math.min(rank, MONO_OPACITIES.length - 1)]})`
}

// 차트별 · 업종별 SpinX 해석. 수치 요약이 아니라 '발견'을 준다.
// cost = 차트1(Cost Share, 광고비 비중) 해석 / eff = 차트2(Efficiency Map, 효율) 해석
const insightByIndustry: Record<string, { cost: string; eff: string }> = {
  '패션': {
    cost: '패션의류 업종의 광고비는 Google Ads 디맨드젠 이미지 광고(약 32%)에 가장 크게 쏠렸고, Meta의 전환·트래픽 캠페인이 그 뒤를 이었습니다. 상위 3개 상품이 전체의 절반을 넘겨, 소수 상품에 예산이 집중된 배분 구조입니다. 이는 이 업종이 시각 소재 중심의 대형 매체에 의존하는 경향을 보여줍니다. 반대로 하위 상품들은 저마다 10% 미만의 비중에 머물러, 실험적 집행에 가까웠던 것으로 보입니다.',
    eff: '집행 1위였던 디맨드젠은 단가가 높아 효율 존 밖에 위치했고, 효율 포인트는 광고비 5위였던 Meta 트래픽 캠페인이었습니다. 반응률은 평균을 크게 웃돌고 단가는 가장 낮아 지도의 좌상단에 자리했습니다. 이 업종에서는 집행 규모가 가장 컸던 상품과 효율이 가장 좋았던 상품이 서로 달랐던 것이 특징입니다. 반응형 디스플레이 계열은 단가가 높은 우측에 분포해, 클릭 효율 측면에서는 상대적으로 불리했던 흐름을 보였습니다.',
  },
  '식품': {
    cost: '식품 업종은 집행이 Google Ads 한 매체에 집중됐습니다. 그중에서도 반응형 디스플레이 광고(CPA)에 광고비가 크게 쏠렸고(약 41%), 디맨드젠 동영상·이미지, YouTube 셀렉트가 그 뒤를 이었습니다. 매체는 하나로 통일하되 상품은 여러 갈래로 나눈, 매체 집중·상품 분산형 배분입니다. 단일 매체 안에서 포맷을 폭넓게 실험한 집행 성향이 읽힙니다.',
    eff: '집행 1위였던 반응형 디스플레이가 효율 포인트와도 일치했습니다. 반응률과 단가가 모두 평균을 웃돌아 효율 존 좌상단에 자리했고, 집중 투자와 효율이 함께 맞아떨어진 사례였습니다. 나머지 상품들은 저비용·저반응 구간에 분포해, 소액으로 폭넓게 테스트된 흐름을 보였습니다. 매체가 하나뿐이라 비교는 상품 단위에서만 이뤄집니다.',
  },
  '금융보험및증권': {
    cost: '금융 업종은 Meta 잠재고객 확보 캠페인에 광고비가 절반 가까이 집중됐습니다(약 49%). 반응형 디스플레이(CPM)가 그 뒤를 잇고, 나머지 상품은 소액에 그쳐 뚜렷한 양강 구조를 보입니다. 전환보다 리드 수집을 우선하는 이 업종의 특성이 배분에 그대로 드러납니다. 소수 상품에 예산을 몰아주는 이런 형태는 세 업종 중 금융에서 가장 두드러졌습니다.',
    eff: '집행 1위였던 잠재고객 캠페인은 CPC가 880원으로 표시 상품 중 가장 비싸, 효율 존 밖 우측에 자리했습니다. 반면 효율 포인트는 광고비 비중이 낮았던 디스플레이(CPM) 상품이었습니다. 이 업종에서는 리드 확보에 예산이 집중되면서, 클릭 효율이 가장 좋았던 상품과는 다른 지점에 투자가 몰렸던 것이 특징입니다. 목적 지표와 클릭 효율이 어긋나는 양상은 금융처럼 고관여 업종에서 흔히 관찰됩니다.',
  },
}

export function ResultCharts({ period }: { period?: PeriodLike } = {}) {
  // 조회기간이 2026 1~6월 범위면 실데이터(benchmark) 집계로, 아니면 기존 샘플(dataByIndustry).
  const useBenchmark = isWithin2026H1(period)
  const sourceByIndustry: Record<string, Row[]> = useBenchmark
    ? getBenchmarkIndustries().reduce<Record<string, Row[]>>((acc, ind) => {
        acc[ind] = getIndustryChartRows(ind); return acc
      }, {})
    : dataByIndustry

  // 제공 기준: 업종 최소 단위 안에 매체 1개 이상 AND 상품(고유 label) 3개 이상. 충족 업종만 노출.
  // (상품 2개면 도넛 2조각·산점도 2점이라 분석 가치가 낮아 3개 이상으로 상향)
  // 제공 조건: 고유 상품 3개 이상 (매체 수는 조건 아님 — §0.1)
  const meetsCriteria = (rs: Row[]) => new Set(rs.map(r => r.label)).size >= 3
  const industries = Object.keys(sourceByIndustry).filter(k => meetsCriteria(sourceByIndustry[k]))
  const hasAnyIndustry = industries.length > 0

  const [industry, setIndustry] = useState(industries[0] ?? '')
  // 데이터 소스(샘플↔실데이터) 전환으로 업종 목록이 바뀌면, 현재 선택이 사라졌을 때 첫 업종으로 보정
  useEffect(() => {
    if (industries.length > 0 && !industries.includes(industry)) setIndustry(industries[0])
  }, [industries, industry])
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [scHovered, setScHovered] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'media' | 'product'>('product')
  const [benchInfoOpen, setBenchInfoOpen] = useState(false)
  const [effTab, setEffTab] = useState<'click' | 'view'>('click')

  // 충족 업종이 하나도 없으면 차트 대신 안내만 렌더
  if (!hasAnyIndustry) {
    return (
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '500', margin: '0 0 14px', fontFamily: 'Paperlogy, sans-serif' }}>
          Benchmark Analytics
        </h3>
        <div style={{
          padding: '40px 24px', textAlign: 'center', border: '1px solid hsl(var(--border))', borderRadius: '8px',
          backgroundColor: 'hsl(var(--muted) / 0.2)', color: 'hsl(var(--muted-foreground))', fontSize: '13px', lineHeight: 1.6,
        }}>
          차트 생성을 위한 데이터가 충분하지 않습니다.
        </div>
      </div>
    )
  }

  // 광고상품 기준은 대분류 업종만 제공하므로 라벨은 '업종(대)' 고정
  const industryDepthLabel = '업종(대)'
  // 뷰 단위 라벨 — 제목·caption·툴팁에서 '매체'/'상품'으로 치환
  const unit = viewMode === 'media' ? '매체' : '상품'

  const rows = sourceByIndustry[industry] ?? []
  const totalCost = rows.reduce((s, r) => s + r.cost, 0)

  // SpinX 차트1(Cost Share) 해석 — 실데이터 업종은 범용 문구로 폴백
  const costInsight = insightByIndustry[industry]?.cost
    ?? `${industry} 업종의 광고비가 매체·상품별로 어떻게 배분됐는지 보여줍니다. 비중 1위 상품이 녹색으로 강조되며, 상위 상품에 예산이 집중된 정도를 통해 미디어믹스의 쏠림을 가늠할 수 있습니다. 선택한 기간의 실제 집행 실적을 집계한 참고용 벤치마크입니다.`

  // 이 업종에 매체가 1개뿐이면 '매체' 뷰는 무의미(100% 1조각) → 토글에서 '매체' 비활성 + 강제 상품 뷰
  const mediaCount = new Set(rows.map(r => r.media)).size
  const mediaToggleDisabled = mediaCount <= 1
  useEffect(() => {
    if (mediaToggleDisabled && viewMode === 'media') setViewMode('product')
  }, [mediaToggleDisabled, viewMode])

  // 광고비 비중: 뷰에 따라 상품 단위 or 매체 합산. 큰 순 정렬 → 상위 6개 + 나머지 '기타' 합산
  const costSource = viewMode === 'media'
    ? Object.entries(rows.reduce<Record<string, number>>((acc, r) => {
        acc[r.media] = (acc[r.media] ?? 0) + r.cost; return acc
      }, {})).map(([media, cost]) => ({ name: media, cost }))
    : rows.map(r => ({ name: `${r.media} > ${r.label}`, cost: r.cost }))

  const sortedByCost = costSource
    .map(r => ({ name: r.name, share: Math.round((r.cost / totalCost) * 1000) / 10 }))
    .sort((a, b) => b.share - a.share)

  const costData: { name: string; share: number; isEtc?: boolean }[] =
    sortedByCost.length > 6
      ? [
          ...sortedByCost.slice(0, 6),
          { name: '기타', share: Math.round(sortedByCost.slice(6).reduce((s, r) => s + r.share, 0) * 10) / 10, isEtc: true },
        ]
      : sortedByCost

  // ── 차트2 Efficiency Map ── (DataShot_ResultCharts_Spec.md §2)
  // 탭(클릭/조회)별로 반응·단가 지표가 다름. 각 탭 지표를 '측정한' 상품만 대상.
  //   클릭 탭: clicks>0 → 반응=CTR, 단가=CPC / 조회 탭: views>0 → 반응=VTR, 단가=CPV
  const clickRows = rows.filter(r => r.clicks > 0)
  const viewRows = rows.filter(r => r.views > 0)
  const clickTabEnabled = clickRows.length > 0
  const viewTabEnabled = viewRows.length > 0
  const effDataAvailable = clickTabEnabled || viewTabEnabled

  // 비활성 탭이 선택돼 있으면 활성 탭으로 자동 전환 (§2.3)
  useEffect(() => {
    if (effTab === 'click' && !clickTabEnabled && viewTabEnabled) setEffTab('view')
    else if (effTab === 'view' && !viewTabEnabled && clickTabEnabled) setEffTab('click')
  }, [effTab, clickTabEnabled, viewTabEnabled])

  const activeEffTab: 'click' | 'view' = clickTabEnabled && viewTabEnabled ? effTab : (clickTabEnabled ? 'click' : 'view')
  // 현재 탭 기준 지표 접근자 (반응=높을수록 좋음, 단가=낮을수록 좋음)
  const resp = (r: Row) => (activeEffTab === 'click' ? r.ctr : r.vtr)
  const price = (r: Row) => (activeEffTab === 'click' ? r.cpc : r.cpv)
  const respUnit = '%'
  const respLabel = activeEffTab === 'click' ? '클릭률' : '조회율'
  const priceLabel = activeEffTab === 'click' ? '클릭당 비용' : '조회당 비용'

  // §2.4 대상 상품: 현재 탭 지표 보유 상품만 → 광고비 상위 6
  const tabRows = activeEffTab === 'click' ? clickRows : viewRows
  // 매체 뷰: 매체 단위 집계(§2.8). 반응·단가는 노출/해당분모 가중평균. 탭 분모 0 상품은 이미 제외됨.
  const effBase: Row[] = viewMode === 'media'
    ? Object.values(tabRows.reduce<Record<string, Row>>((acc, r) => {
        const a = acc[r.media] ?? { label: r.media, media: r.media, cost: 0, impressions: 0, clicks: 0, views: 0, ctr: 0, cpc: 0, vtr: 0, cpv: 0 }
        a.cost += r.cost; a.impressions += r.impressions; a.clicks += r.clicks; a.views += r.views
        acc[r.media] = a; return acc
      }, {})).map(a => ({
        ...a,
        ctr: a.impressions > 0 ? Math.round((a.clicks / a.impressions) * 10000) / 100 : 0,
        cpc: a.clicks > 0 ? Math.round(a.cost / a.clicks) : 0,
        vtr: a.impressions > 0 ? Math.round((a.views / a.impressions) * 10000) / 100 : 0,
        cpv: a.views > 0 ? Math.round(a.cost / a.views) : 0,
      }))
    : tabRows

  const top6 = [...effBase].sort((a, b) => b.cost - a.cost).slice(0, 6)

  // §2.5 선택 평균(가중): 합계끼리 나눔. 분모 0 방지.
  const sum = (f: (r: Row) => number) => top6.reduce((s, r) => s + f(r), 0)
  const totalImp = sum(r => r.impressions), totalClk = sum(r => r.clicks), totalView = sum(r => r.views), totalCostEff = sum(r => r.cost)
  const avgResp = activeEffTab === 'click'
    ? (totalImp > 0 ? (totalClk / totalImp) * 100 : 0)
    : (totalImp > 0 ? (totalView / totalImp) * 100 : 0)
  const avgPrice = activeEffTab === 'click'
    ? (totalClk > 0 ? totalCostEff / totalClk : 0)
    : (totalView > 0 ? totalCostEff / totalView : 0)

  // §2.6 효율 포인트: 반응·단가 0~1 정규화 → 이상점(반응1·단가0) 거리² 최소 1개. 대상 2개 이상일 때만.
  const respLo = Math.min(...top6.map(resp)), respHi = Math.max(...top6.map(resp))
  const priceLo = Math.min(...top6.map(price)), priceHi = Math.max(...top6.map(price))
  const nrm = (v: number, lo: number, hi: number) => (hi === lo ? 0.5 : (v - lo) / (hi - lo))
  const effScore = (r: Row) => (1 - nrm(resp(r), respLo, respHi)) ** 2 + nrm(price(r), priceLo, priceHi) ** 2
  // E1: 대상 1개 이하면 강조 생략. 동점(E3): 반응 높은 쪽 우선.
  const bestLabel = top6.length >= 2
    ? [...top6].sort((a, b) => effScore(a) - effScore(b) || resp(b) - resp(a)).map(r => r.label)[0]
    : null

  const scatterData = top6.map(r => ({
    label: r.label, media: r.media,
    name: viewMode === 'media' ? r.media : `${r.media} > ${r.label}`,
    resp: resp(r), price: price(r),
    top: bestLabel != null && r.label === bestLabel,
    share: Math.round((r.cost / totalCost) * 1000) / 10,
  }))

  // 축 범위: 데이터 min/max에 여유 패딩. §2.1 — 축 최소는 0 밑으로 못 감(max(0, ...)).
  const priceVals = scatterData.map(d => d.price), respVals = scatterData.map(d => d.resp)
  const priceFloor = 0  // 단가(CPC/CPV) X축 최소도 항상 0 고정
  const priceCeil = Math.max(...priceVals) + 60
  const respFloor = 0  // 반응률(CTR/VTR) Y축 최소는 항상 0 고정
  const respCeil = Math.max(...respVals) + 0.4

  // SpinX 효율 해석 — 탭 맥락 반영 폴백
  const effInsightText = insightByIndustry[industry]?.eff
    ?? `${industry} 업종에서 선택한 상품들을 ${respLabel}과 ${priceLabel} 두 축에 놓은 결과입니다. 왼쪽 위(저단가·고반응)에 가까운 상품이 효율 포인트로 녹색 강조되며, 광고비를 가장 많이 쓴 상품과 효율이 가장 좋은 상품이 서로 다를 수 있습니다. (선택 상품 간 비교·참고용)`

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* 헤더 (제목) → 아래 줄에 업종 필터 */}
      {/* 헤더 행: 제목(좌) + 매체/상품 토글(우) — BO Optimization Analytics 헤더와 동일 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', margin: '0 0 14px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '500', margin: 0, fontFamily: 'Paperlogy, sans-serif' }}>
            Benchmark Analytics
          </h3>
          <button
            onMouseEnter={() => setBenchInfoOpen(true)}
            onMouseLeave={() => setBenchInfoOpen(false)}
            style={{ display: 'flex', alignItems: 'center', padding: '2px', background: 'transparent', border: 'none', cursor: 'help', color: 'hsl(var(--muted-foreground))', opacity: 0.6 }}
          >
            <Info size={15} />
          </button>
          {benchInfoOpen && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '340px', zIndex: 100,
              backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '12px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', lineHeight: 1.6, color: 'hsl(var(--muted-foreground))',
            }}>
              <div style={{ fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '6px' }}>분석 차트 제공 기준</div>
              아래 차트는 선택한 업종의 <strong style={{ color: 'hsl(var(--foreground))' }}>과거 집행 실적(벤치마크)</strong>을 집계한 결과입니다.
              <div style={{ marginTop: '8px', fontSize: '11px', lineHeight: 1.6 }}>
                <div><strong style={{ color: 'hsl(var(--foreground))' }}>제공 조건</strong>: 데이터 추출 업종의 최소 단위 기준, 상품 3개 이상인 업종만 제공</div>
                <div><strong style={{ color: 'hsl(var(--foreground))' }}>업종 목록</strong>: 조건을 충족하는 업종만 위 드롭다운에 표시됩니다</div>
              </div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', border: '1px solid hsl(var(--border))', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
          {(['media', 'product'] as const).map(mode => {
            const disabled = mode === 'media' && mediaToggleDisabled
            return (
            <button
              key={mode}
              onClick={() => !disabled && setViewMode(mode)}
              disabled={disabled}
              title={disabled ? '단일 매체 업종은 매체별 보기를 제공하지 않습니다' : undefined}
              style={{
                padding: '6px 16px', fontSize: '12px', fontWeight: 500, border: 'none', transition: 'all 0.2s',
                cursor: disabled ? 'not-allowed' : 'pointer',
                backgroundColor: viewMode === mode ? 'hsl(var(--foreground))' : 'transparent',
                color: viewMode === mode ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
                opacity: disabled ? 0.4 : 1,
              }}
            >
              {mode === 'media' ? '매체' : '상품'}
            </button>
          )})}
        </div>
      </div>

      {/* 업종 필터 — "업종(대)" 라벨 + 밑줄 드롭다운 가로 나란히 (BO picker 스타일 이식) */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '24px', maxWidth: '360px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'hsl(var(--muted-foreground))', flexShrink: 0 }}>
          {industryDepthLabel}
        </span>
        <div style={{ position: 'relative', flex: 1 }}>
            <button
              onClick={() => setOpen(o => !o)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                padding: '4px 2px', background: 'transparent', border: 'none',
                borderBottom: '1px solid hsl(var(--border))', cursor: 'pointer', textAlign: 'left',
                fontSize: '16px', fontWeight: 500, color: 'hsl(var(--foreground))',
              }}
            >
              <span>{industry}</span>
              <ChevronDown size={16} style={{ flexShrink: 0, color: 'hsl(var(--muted-foreground))', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
            </button>
          {open && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
              backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', zIndex: 1000, overflow: 'hidden',
            }}>
              {industries.map(ind => (
                <button
                  key={ind}
                  onClick={() => { setIndustry(ind); setOpen(false) }}
                  style={{
                    width: '100%', padding: '10px 14px', textAlign: 'left', border: 'none', cursor: 'pointer',
                    fontSize: '13px', backgroundColor: ind === industry ? 'hsl(var(--muted))' : 'transparent',
                    color: 'hsl(var(--foreground))',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.6)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = ind === industry ? 'hsl(var(--muted))' : 'transparent'}
                >
                  {ind}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2열 배치 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '40px' }}>
        {/* 차트1: 광고비 비중 도넛 + 범례 */}
        <ChartCard
          title="광고비는 어디에 집중됐을까?"
          eng="Cost Share"
          caption="매체·상품별 광고비 배분 비중"
          info={{
            heading: 'Cost Share',
            body: (
              <>
                이 업종에서 광고비가 {unit}별로 어떻게 배분됐는지 비중(%)으로 보여줍니다.
                <div style={{ marginTop: '8px', fontSize: '11px', lineHeight: 1.6 }}>
                  <div><strong style={{ color: 'hsl(var(--foreground))' }}>조각</strong>: {viewMode === 'media' ? '매체' : '매체 > 상품'} 단위의 광고비 비중</div>
                  <div style={{ marginTop: '6px' }}>
                    <strong style={{ color: 'hsl(var(--foreground))' }}>비중</strong>: {unit} 광고비 ÷ 전체 광고비 × 100
                  </div>
                  <div style={{ marginTop: '6px' }}>비중 상위 <strong style={{ color: 'hsl(var(--foreground))' }}>최대 6개</strong> {unit}만 표시되며, 나머지는 <strong style={{ color: 'hsl(var(--foreground))' }}>'기타'</strong>로 합산됩니다.</div>
                </div>
              </>
            ),
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px', height: '250px', paddingLeft: '48px', paddingRight: '24px' }}>
            <div style={{ width: '200px', height: '220px', flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<PieTooltip />} />
                <Pie
                  data={costData} dataKey="share" nameKey="name" cx="50%" cy="50%"
                  innerRadius={50} outerRadius={90} paddingAngle={2} stroke="none"
                  startAngle={90} endAngle={-270}
                  isAnimationActive={false}
                  labelLine={false}
                  label={(p: any) => {
                    if (p.share < 10) return null // 작은 조각은 라벨 생략
                    const RAD = Math.PI / 180
                    const r = p.innerRadius + (p.outerRadius - p.innerRadius) * 0.5
                    const x = p.cx + r * Math.cos(-p.midAngle * RAD)
                    const y = p.cy + r * Math.sin(-p.midAngle * RAD)
                    const top = p.index === 0 && !costData[0].isEtc
                    return (
                      <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                        style={{ fontSize: 11, fontWeight: 600 }}
                        fill={top ? 'hsl(var(--foreground))' : 'hsl(var(--background))'}>
                        {p.share}%
                      </text>
                    )
                  }}
                >
                  {costData.map((r, i) => (
                    <Cell
                      key={i}
                      fill={r.isEtc ? 'hsl(var(--foreground) / 0.12)' : colorByRank(i, i === 0)}
                      opacity={hovered === null || hovered === i ? 1 : 0.4}
                      style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            </div>
            {/* 범례 (도넛과 hover 연동) — 조각 수와 무관하게 상단 정렬로 고정 */}
            <div style={{ flex: 1, minWidth: 0, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
              {costData.map((r, i) => (
                <div
                  key={r.name}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer',
                    opacity: hovered === null || hovered === i ? 1 : 0.5, transition: 'opacity 0.2s',
                  }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: r.isEtc ? 'hsl(var(--foreground) / 0.12)' : colorByRank(i, i === 0), flexShrink: 0 }} />
                  <span style={{ color: 'hsl(var(--foreground))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }} title={r.name}>{r.name}</span>
                  <span style={{ fontWeight: i === 0 && !r.isEtc ? '600' : '500', color: 'hsl(var(--foreground))', flexShrink: 0 }}>{r.share}%</span>
                </div>
              ))}
            </div>
          </div>
          <SpinXInsight key={`cost-${industry}`} text={costInsight} />
        </ChartCard>

        {/* 차트2: 단가(x, 왼쪽=저렴) × 반응(y) 포지셔닝 맵 — 좌상단=효율 영역 */}
        {!effDataAvailable ? (
          <ChartCard title="어떤 상품이 효율적이었을까?" eng="Efficiency Map" caption="매체·상품별 반응률·단가 비교">
            <div style={{
              height: '290px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              border: '1px solid hsl(var(--border))', borderRadius: '8px', backgroundColor: 'hsl(var(--muted) / 0.2)',
              color: 'hsl(var(--muted-foreground))', fontSize: '13px', lineHeight: 1.6,
            }}>
              차트 생성을 위한 데이터가 충분하지 않습니다.
            </div>
          </ChartCard>
        ) : (
        <ChartCard
          title="어떤 상품이 효율적이었을까?"
          eng="Efficiency Map"
          caption="매체·상품별 반응률·단가 비교"
          titleRight={
            <div style={{ display: 'flex', border: '1px solid hsl(var(--border))', borderRadius: '6px', overflow: 'hidden' }}>
              {([['click', '클릭', clickTabEnabled], ['view', '조회', viewTabEnabled]] as const).map(([key, label, enabled]) => (
                <button
                  key={key}
                  onClick={() => enabled && setEffTab(key)}
                  disabled={!enabled}
                  title={enabled ? undefined : '데이터가 충분하지 않습니다'}
                  style={{
                    padding: '6px 16px', fontSize: '12px', fontWeight: 500, border: 'none', transition: 'all 0.2s',
                    cursor: enabled ? 'pointer' : 'not-allowed',
                    backgroundColor: activeEffTab === key ? 'hsl(var(--foreground))' : 'transparent',
                    color: activeEffTab === key ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
                    opacity: enabled ? 1 : 0.4,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          }
          info={{
            heading: 'Efficiency Map',
            body: (
              <>
                선택한 {unit}을 반응률·단가 두 축에 놓아, 어느 {unit}이 효율적인 자리에 있는지 보여줍니다. 왼쪽 위(저단가·고반응)로 갈수록 효율적입니다.
                <div style={{ marginTop: '8px', fontSize: '11px', lineHeight: 1.6 }}>
                  <div><strong style={{ color: 'hsl(var(--foreground))' }}>탭(클릭·조회)</strong>: <strong>클릭</strong> 탭은 클릭률·클릭당 비용(CPC), <strong>조회</strong> 탭은 조회율·조회당 비용(CPV)으로 비교합니다. (해당 성과가 측정된 {unit}만 표시)</div>
                  <div style={{ marginTop: '6px' }}><strong style={{ color: 'hsl(var(--foreground))' }}>가로축(단가)</strong>: 왼쪽일수록 저렴</div>
                  <div><strong style={{ color: 'hsl(var(--foreground))' }}>세로축(반응률)</strong>: 위일수록 반응 좋음</div>
                  <div><strong style={{ color: 'hsl(var(--foreground))' }}>버블 크기</strong>: 광고비 비중</div>
                  <div style={{ marginTop: '6px' }}>
                    <strong style={{ color: 'hsl(var(--foreground))' }}>평균</strong>: 점선 십자선. 선택한 {unit}들의 반응률·단가를 집행 규모로 가중평균한 값입니다. (업종 전체가 아닌 선택 {unit} 기준)
                  </div>
                  <div style={{ marginTop: '6px' }}>
                    <strong style={{ color: 'hsl(var(--bo-accent))' }}>효율 포인트</strong>: 선택 {unit} 중 반응이 높고 단가가 낮은, 가장 효율적인 지점에 가까운 1개(초록 점). 반응률과 단가를 동등 가중해 산출합니다.
                  </div>
                </div>
              </>
            ),
          }}
        >
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart margin={{ top: 16, right: 24, bottom: 28, left: 8 }}>
              <XAxis type="number" dataKey="price" name={priceLabel} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} domain={[priceFloor, priceCeil]}
                tickCount={5} tickFormatter={(v) => Math.round(v).toLocaleString()}
                label={{ value: `${priceLabel} (원)`, position: 'insideBottom', offset: -18, style: { fill: 'hsl(var(--muted-foreground))', fontSize: 11, textAnchor: 'middle' } }} />
              <YAxis type="number" dataKey="resp" name={respLabel} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={64}
                domain={[respFloor, respCeil]} tickCount={5} tickFormatter={(v) => `${v.toFixed(1)}%`}
                label={{ value: `${respLabel} (%)`, angle: -90, position: 'insideLeft', offset: 10, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))', fontSize: 11 } }} />
              <ZAxis type="number" dataKey="share" range={[80, 520]} name="비중" unit="%" />

              {/* 효율 영역(좌상: 저단가·고반응) 그린 틴트 — 라벨 없음 */}
              <ReferenceArea x1={priceFloor} y1={avgResp} x2={avgPrice} y2={respCeil} fill="hsl(var(--bo-accent))" fillOpacity={0.1} stroke="none" />
              {/* 비효율 영역(우하: 고단가·저반응) 연한 그레이 틴트 */}
              <ReferenceArea x1={avgPrice} y1={respFloor} x2={priceCeil} y2={avgResp} fill="hsl(var(--foreground))" fillOpacity={0.05} stroke="none" />

              {/* 평균 십자선 (라벨은 차트 상세 팝업에서 설명) */}
              <ReferenceLine x={avgPrice} stroke="hsl(var(--border))" strokeDasharray="4 4"
                label={{ value: '평균', position: 'insideBottomRight', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <ReferenceLine y={avgResp} stroke="hsl(var(--border))" strokeDasharray="4 4" />

              <Tooltip content={<ScatterTooltip respLabel={respLabel} priceLabel={priceLabel} respUnit={respUnit} />} cursor={false} />
              <Scatter
                data={scatterData}
                shape={(props: any) => <BubbleDot {...props} hovered={scHovered} />}
                isAnimationActive
                animationBegin={100}
                animationDuration={700}
                animationEasing="ease-out"
                onMouseEnter={(_: any, i: number) => setScHovered(i)}
                onMouseLeave={() => setScHovered(null)}
              />
            </ScatterChart>
          </ResponsiveContainer>
          <SpinXInsight key={`eff-${industry}-${activeEffTab}`} text={effInsightText} />
        </ChartCard>
        )}
      </div>
    </div>
  )
}

function tooltipBox(): React.CSSProperties {
  return {
    backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
    borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)',
  }
}

// 커스텀 버블 — A: 효율 최적점(top) 그린+외곽링+라벨 / D: hover 시 나머지 흐림
function BubbleDot(props: any) {
  const { cx, cy, payload, index, hovered } = props
  if (cx == null || cy == null) return null
  const top = !!payload?.top
  // ZAxis range[80,520]는 '면적' → 반지름 = sqrt(size/π). recharts가 size를 안 넘기면 share로 근사
  const size = props.size ?? props.node?.z ?? (80 + (payload?.share ?? 0) / 100 * 440)
  const r = Math.max(5, Math.sqrt(size / Math.PI))
  const dim = hovered != null && hovered !== index
  const fill = top ? 'hsl(var(--bo-accent))' : 'hsl(var(--foreground) / 0.4)'

  return (
    <g style={{ opacity: dim ? 0.25 : 1, transition: 'opacity 0.2s' }}>
      {top && (
        <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke="hsl(var(--bo-accent))" strokeWidth={1.5} opacity={0.4} />
      )}
      <circle cx={cx} cy={cy} r={r} fill={fill} />
    </g>
  )
}

// 도넛 조각 툴팁 — 범례에서 잘리는 전체 이름 + 비율을 보여줌
function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div style={tooltipBox()}>
      <div style={{ fontWeight: '600', marginBottom: '4px', color: 'hsl(var(--foreground))', maxWidth: '260px', whiteSpace: 'normal', wordBreak: 'keep-all', lineHeight: 1.4 }}>{d.name}</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <span style={{ color: 'hsl(var(--muted-foreground))' }}>광고비 비중</span>
        <span style={{ marginLeft: 'auto', fontWeight: '500' }}>{d.value}%</span>
      </div>
    </div>
  )
}

function ScatterTooltip({ active, payload, respLabel = '반응', priceLabel = '단가' }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={tooltipBox()}>
      <div style={{ fontWeight: '600', marginBottom: '6px', color: 'hsl(var(--foreground))', maxWidth: '240px', whiteSpace: 'normal', wordBreak: 'keep-all', lineHeight: 1.4 }}>{d.name}</div>
      <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'hsl(var(--muted-foreground))' }}>{respLabel}</span><span style={{ marginLeft: 'auto', fontWeight: '500' }}>{d.resp.toFixed(2)}%</span></div>
      <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'hsl(var(--muted-foreground))' }}>{priceLabel}</span><span style={{ marginLeft: 'auto', fontWeight: '500' }}>{d.price.toLocaleString()}원</span></div>
      <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'hsl(var(--muted-foreground))' }}>광고비 비중</span><span style={{ marginLeft: 'auto', fontWeight: '500' }}>{d.share}%</span></div>
    </div>
  )
}

// BO(BOSpinXInsight) 이식: 심볼 + 워드마크 + 타이핑 해석. 벤치마크 성격이라 액션 제안은 없음. datashot이라 인라인.
function SpinXInsight({ text, speed = 18 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    setDisplayText('')
    setIsTyping(true)
    let i = 0
    const timer = setInterval(() => {
      i++
      if (i >= text.length) { setDisplayText(text); setIsTyping(false); clearInterval(timer) }
      else setDisplayText(text.slice(0, i))
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid hsl(var(--border))' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        <SpinXSymbol size={13} motion={isTyping ? 'active' : 'idle'} title="" style={{ transform: 'rotate(45deg)', flexShrink: 0 }} />
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.02em', color: 'hsl(var(--muted-foreground))' }}>SpinX for DataShot</span>
        {isTyping && <span style={{ fontSize: '10px', opacity: 0.6, color: 'hsl(var(--muted-foreground))' }}>analyzing…</span>}
      </div>
      <p style={{ fontSize: '12.5px', lineHeight: 1.65, margin: 0, opacity: 0.9, color: 'hsl(var(--foreground))' }}>
        {displayText}
        {isTyping && <span style={{ animation: 'spinx-cursor-blink 0.8s step-end infinite' }}>|</span>}
      </p>
    </div>
  )
}

// BO(BOBudgetPieChart) 패턴: 제목 옆 영어 차트명 + Info(i) hover 툴팁. datashot이라 인라인으로 이식.
function ChartCard({ title, eng, info, caption, titleRight, children }: {
  title: string; eng?: string; info?: { heading: string; body: React.ReactNode }; caption: string; titleRight?: React.ReactNode; children: React.ReactNode
}) {
  const [infoOpen, setInfoOpen] = useState(false)
  return (
    <div style={{ minWidth: 0 }}>
      {/* 제목 행: 좌측 제목·영문·Info / 우측 titleRight 슬롯(예: 클릭·조회 토글) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '2px', minHeight: '28px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <span style={{ fontSize: '17px', fontWeight: '500', color: 'hsl(var(--foreground))' }}>{title}</span>
          {eng && <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>{eng}</span>}
          {info && (
            <>
              <button
                onMouseEnter={() => setInfoOpen(true)}
                onMouseLeave={() => setInfoOpen(false)}
                style={{ display: 'flex', alignItems: 'center', padding: '2px', background: 'transparent', border: 'none', cursor: 'help', color: 'hsl(var(--muted-foreground))', opacity: 0.6 }}
              >
                <Info size={14} />
              </button>
              {infoOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '340px', zIndex: 100,
                  backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', padding: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', lineHeight: 1.6, color: 'hsl(var(--muted-foreground))',
                }}>
                  <div style={{ fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '6px' }}>{info.heading}</div>
                  {info.body}
                </div>
              )}
            </>
          )}
        </div>
        {titleRight && <div style={{ flexShrink: 0 }}>{titleRight}</div>}
      </div>
      <div style={{ marginBottom: '16px', fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>{caption}</div>
      {children}
    </div>
  )
}
