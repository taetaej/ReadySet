// 광고상품 기준 추출 > 지표 선택
// - 매체 1개: 해당 매체 지표(metricsByMedia, 조건 조합과 동일 소스)
// - 매체 2개 이상: 공통 지표만
// 지표 그룹 UI(접기/검색/전체선택)는 CreateDatasetStep2의 MetricGroupList 로직을 복제.
import { useState } from 'react'
import { Search, X, Plus, Minus, Info, SearchCheck } from 'lucide-react'
import {
  metaMetrics, googleMetrics, kakaoMetrics, naverGfaMetrics, naverNospMetrics, tiktokMetrics,
  type MetricGroup,
} from './types'

const metricsByMedia: Record<string, MetricGroup[]> = {
  'Meta': metaMetrics,
  'Google Ads': googleMetrics,
  'kakao모먼트': kakaoMetrics,
  'NAVER 성과형 DA': naverGfaMetrics,
  'NAVER 보장형 DA': naverNospMetrics,
  'TikTok': tiktokMetrics,
}

// 원본 지표 id (성과 지표 모드에서 제외 대상)
const rawMetricIds = ['common_cost', 'common_impressions', 'common_clicks', 'common_views']

// 선택된 매체 수에 따른 지표 그룹 소스 (요약 등에서 재사용)
// purpose='external'(성과 지표)이면 공통 지표에서 원본 4종을 제외하고 계산 5종만.
// purpose='internal'(종합 지표)이면 전체 9종.
export function getMetricGroups(selectedMedias: string[], purpose?: string): MetricGroup[] {
  if (selectedMedias.length >= 2) {
    if (purpose === 'external') {
      return commonMetricGroups.map(g => ({
        ...g,
        metrics: g.metrics.filter(m => !rawMetricIds.includes(m.id))
      }))
    }
    return commonMetricGroups
  }
  if (selectedMedias.length === 1) return metricsByMedia[selectedMedias[0]] ?? []
  return []
}

// 선택된 지표 id → 그룹별 라벨 매칭 (요약 칩 표시용)
export function getMatchedMetricGroups(selectedMedias: string[], selectedIds: string[], purpose?: string) {
  return getMetricGroups(selectedMedias, purpose)
    .map(g => ({ group: g.group, matched: g.metrics.filter(m => selectedIds.includes(m.id)).map(m => m.label) }))
    .filter(g => g.matched.length > 0)
}

// 매체 2개 이상일 때 제공하는 공통 지표
export const commonMetricGroups: MetricGroup[] = [
  {
    group: '공통 지표',
    metrics: [
      { id: 'common_cost', label: '광고비', selected: false },
      { id: 'common_impressions', label: '노출수', selected: false },
      { id: 'common_clicks', label: '클릭수', selected: false },
      { id: 'common_views', label: '조회수', selected: false },
      { id: 'common_cpm', label: '1,000회 노출당 비용(CPM)', selected: false },
      { id: 'common_cpc', label: '클릭당 비용(CPC)', selected: false },
      { id: 'common_cpv', label: '조회당 비용(CPV)', selected: false },
      { id: 'common_ctr', label: '클릭률(CTR)', selected: false },
      { id: 'common_vtr', label: '조회율(VTR)', selected: false },
    ],
  },
]

// 타겟팅 선택에 따른 지표 제외 (조건 조합 Step2와 동일 규칙)
export function applyTargetingExclusions(base: MetricGroup[], media: string, targetingCategory: string): MetricGroup[] {
  if (media === 'Meta' && targetingCategory === '기기유형') {
    const excluded = ['post_reaction', 'post_engagement', 'cost_per_post_engagement', 'link_click', 'cost_per_link_click', 'link_ctr', 'complete_registration', 'cost_per_registration']
    return base.map(g => {
      if (g.group === '협력 광고') return { ...g, metrics: [] }
      return { ...g, metrics: g.metrics.filter(m => !excluded.includes(m.id)) }
    }).filter(g => g.metrics.length > 0)
  }
  if (media === 'kakao모먼트' && targetingCategory === '디바이스') {
    const excluded = ['conversions', 'message_send', 'message_open', 'message_click', 'message_open_rate', 'message_click_rate', 'channel_add_cpa', 'channel_add_cvr']
    return base.map(g => ({ ...g, metrics: g.metrics.filter(m => !excluded.includes(m.id)) })).filter(g => g.metrics.length > 0)
  }
  if (media === 'NAVER 보장형 DA' && targetingCategory === '노출영역') {
    const excluded = ['cost', 'cost_guaranteed', 'cpc', 'cpm', 'cpv']
    return base.map(g => ({ ...g, metrics: g.metrics.filter(m => !excluded.includes(m.id)) })).filter(g => g.metrics.length > 0)
  }
  return base
}

interface Props {
  selectedMedias: string[]      // 광고상품 모드에서 선택된 매체들
  metrics: string[]
  onChange: (metrics: string[]) => void
  validationActive: boolean
  // 매체 1개일 때 타겟팅 선택에 따라 지표 제외 (매체 2개↑는 공통 지표라 미적용)
  targetingCategory?: string
  media?: string | null
  // 지표 구성(purpose): 'external'(성과 지표)이면 공통 지표에서 원본 4종 제외
  purpose?: string
}

export function MetricSelect({ selectedMedias, metrics, onChange, validationActive, targetingCategory = '', media = null, purpose = '' }: Props) {
  const [search, setSearch] = useState('')
  const [mappingDialogOpen, setMappingDialogOpen] = useState(false)

  const baseGroups: MetricGroup[] = getMetricGroups(selectedMedias, purpose)
  // 매체 1개 + 타겟팅 선택 시 지표 제외 적용 (2개 이상 공통 지표는 그대로)
  const groups: MetricGroup[] = (selectedMedias.length === 1 && media && targetingCategory)
    ? applyTargetingExclusions(baseGroups, media, targetingCategory)
    : baseGroups

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
        지표 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
      </label>
      {/* 안내 섹션 — 좌: 안내문구 / 우: 공통 지표 기준 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        padding: '12px', margin: '16px 0 20px',
        backgroundColor: 'hsl(var(--muted) / 0.5)',
        border: '1px solid hsl(var(--border))', borderRadius: '6px',
        fontSize: '12px', color: 'hsl(var(--muted-foreground))',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: '4px' }} />
          <span style={{ lineHeight: '1.8' }}>
            선택한 매체 수에 따라 제공되는 지표가 달라집니다.<br />
            매체 1개는 해당 매체의 지표, 2개 이상은 매체 간 비교가 가능한 공통 지표가 제공됩니다.
          </span>
        </div>
        {/* 공통 지표 기준 (SearchCheck 아이콘 클릭 → 매핑 표 다이얼로그) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, fontSize: '12px', color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>
          <span>공통 지표 기준</span>
          <SearchCheck
            size={14}
            style={{ cursor: 'pointer' }}
            onClick={() => setMappingDialogOpen(true)}
          />
        </div>
      </div>

      {/* 공통 지표 기준 매핑 다이얼로그 */}
      {mappingDialogOpen && (
        <div className="dialog-overlay" onClick={() => setMappingDialogOpen(false)}>
          <div className="dialog-content dialog-lg" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">공통 지표 기준</h3>
              <p className="dialog-description">각 매체의 지표를 공통 기준으로 매핑해 매체 간 비교가 가능하도록 제공합니다.</p>
            </div>
            <div style={{ padding: '24px' }}>
              <CommonMetricMappingTable />
            </div>
            <div className="dialog-footer">
              <button onClick={() => setMappingDialogOpen(false)} className="btn btn-primary btn-md">확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 검색 · 목록 · 유효성은 매체 선택 후에만 노출 */}
      {selectedMedias.length > 0 && (
        <>
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <Search size={12} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))', pointerEvents: 'none' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="지표 검색"
              className="input"
              style={{ width: '100%', height: '32px', fontSize: '12px', paddingLeft: '28px', paddingRight: search ? '28px' : '8px', boxSizing: 'border-box' }}
            />
            {search && (
              <button onClick={() => setSearch('')}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--muted-foreground))', padding: '2px', display: 'flex', alignItems: 'center' }}>
                <X size={12} />
              </button>
            )}
          </div>

          <MetricGroupList groups={groups} selected={metrics} onChange={onChange} searchQuery={search} />

          {validationActive && metrics.length === 0 && (
            <div style={{ fontSize: '12px', color: 'hsl(var(--destructive))', marginTop: '4px' }}>지표를 선택해주세요.</div>
          )}
        </>
      )}
    </div>
  )
}

// --- CreateDatasetStep2의 MetricGroupList / MetricGroupRow 복제 ---

function MetricGroupList({ groups, selected, onChange, searchQuery }: { groups: MetricGroup[]; selected: string[]; onChange: (next: string[]) => void; searchQuery: string }) {
  if (groups.length === 0) return (
    <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', fontStyle: 'italic' }}>
      매체를 먼저 선택해주세요.
    </div>
  )
  const hasAnyMatch = searchQuery ? groups.some(g => g.metrics.some(m => m.label.toLowerCase().includes(searchQuery.toLowerCase()))) : true
  if (!hasAnyMatch) return (
    <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', padding: '16px 0', textAlign: 'center' }}>
      검색 결과가 없습니다.
    </div>
  )
  return (
    <div>
      {groups.map((group, i) => (
        <MetricGroupRow key={`${group.group}-${i}`} group={group} selected={selected} onChange={onChange} searchQuery={searchQuery} />
      ))}
    </div>
  )
}

function MetricGroupRow({ group, selected, onChange, searchQuery }: { group: MetricGroup; selected: string[]; onChange: (next: string[]) => void; searchQuery: string }) {
  const filtered = group.metrics.filter(m => m.label.toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredIds = filtered.map(m => m.id)
  const allSelected = filteredIds.length > 0 && filteredIds.every(id => selected.includes(id))
  const hasMatch = filtered.length > 0
  const [manualOpen, setManualOpen] = useState(true)
  const open = searchQuery ? hasMatch : manualOpen

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }

  if (searchQuery && !hasMatch) return null

  return (
    <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
      <div
        onClick={() => { if (!searchQuery) setManualOpen(o => !o) }}
        style={{
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
          cursor: searchQuery ? 'default' : 'pointer',
          backgroundColor: open ? 'hsl(var(--muted) / 0.2)' : 'transparent',
          borderBottom: open ? '1px solid hsl(var(--border))' : 'none',
          transition: 'background 0.15s',
        }}
      >
        {!searchQuery && (
          <span style={{
            width: '20px', height: '20px', borderRadius: '4px',
            border: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, color: 'hsl(var(--muted-foreground))',
          }}>
            {open ? <Minus size={12} /> : <Plus size={12} />}
          </span>
        )}
        <span style={{ fontSize: '13px', fontWeight: '500', flex: 1 }}>{group.group}</span>
        {open && (
          <button
            onClick={e => { e.stopPropagation(); onChange(allSelected ? selected.filter(id => !filteredIds.includes(id)) : [...new Set([...selected, ...filteredIds])]) }}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '11px' }}
          >
            {allSelected ? '전체 해제' : '전체 선택'}
          </button>
        )}
      </div>
      {open && (
        <div style={{ padding: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {filtered.map(m => {
              const isSelected = selected.includes(m.id)
              return (
                <label key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px',
                  backgroundColor: isSelected ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                  transition: 'background 0.1s',
                }} onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={isSelected} onChange={() => toggle(m.id)} className="checkbox-custom" style={{ flexShrink: 0 }} />
                  <span style={{ color: 'hsl(var(--foreground))', fontWeight: isSelected ? '500' : '400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.label}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// --- 공통 지표 ↔ 매체별 원본 지표 매핑 (각 매체 지표 라벨 기준, 대응 없으면 '—') ---
const MAPPING_MEDIAS = ['Google Ads', 'Meta', 'kakao모먼트', 'NAVER 성과형 DA', 'NAVER 보장형 DA', 'TikTok'] as const

// 원본 지표 4종: 매체별 라벨
const rawMetricMapping: { common: string; byMedia: Record<string, string> }[] = [
  { common: '광고비', byMedia: { 'Google Ads': '광고비', 'Meta': '광고 소진금액', 'kakao모먼트': '비용', 'NAVER 성과형 DA': '매출(소진금액)', 'NAVER 보장형 DA': '집행금액', 'TikTok': '광고 소진금액' } },
  { common: '노출수', byMedia: { 'Google Ads': '노출수', 'Meta': '노출수', 'kakao모먼트': '노출수', 'NAVER 성과형 DA': '노출수', 'NAVER 보장형 DA': '노출수', 'TikTok': '노출수' } },
  { common: '클릭수', byMedia: { 'Google Ads': '클릭수', 'Meta': '클릭(전체)', 'kakao모먼트': '클릭수', 'NAVER 성과형 DA': '클릭수', 'NAVER 보장형 DA': '클릭수', 'TikTok': '클릭수' } },
  { common: '조회수', byMedia: { 'Google Ads': '조회수', 'Meta': '동영상 3초 이상 재생수', 'kakao모먼트': '재생수', 'NAVER 성과형 DA': '비디오 재생 횟수', 'NAVER 보장형 DA': '동영상 조회수', 'TikTok': '재생수' } },
]

// 계산 지표 5종: 매체 구분 없이 계산식 1개 (전체 매체 공통 공식)
const calcMetricMapping: { common: string; formula: string }[] = [
  { common: '1,000회 노출당 비용(CPM)', formula: '광고비 / 노출수 * 1,000' },
  { common: '클릭당 비용(CPC)', formula: '광고비 / 클릭수' },
  { common: '조회당 비용(CPV)', formula: '광고비 / 조회수' },
  { common: '클릭률(CTR)', formula: '클릭수 / 노출수 * 100' },
  { common: '조회율(VTR)', formula: '조회수 / 노출수 * 100' },
]

function CommonMetricMappingTable() {
  const cellBase: React.CSSProperties = {
    padding: '6px 8px', textAlign: 'left', borderBottom: '1px solid hsl(var(--border))',
    whiteSpace: 'nowrap', fontSize: '11px',
  }
  return (
    <div style={{ border: '1px solid hsl(var(--border))', borderRadius: '6px', overflow: 'auto', maxHeight: '400px' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ ...cellBase, position: 'sticky', top: 0, left: 0, zIndex: 2, backgroundColor: 'hsl(var(--muted))', fontWeight: '600' }}>공통 지표</th>
            {MAPPING_MEDIAS.map(m => (
              <th key={m} style={{ ...cellBase, position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'hsl(var(--muted))', fontWeight: '600' }}>{m}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 원본 지표: 매체별 라벨 */}
          {rawMetricMapping.map(row => (
            <tr key={row.common}>
              <td style={{ ...cellBase, position: 'sticky', left: 0, backgroundColor: 'hsl(var(--card))', fontWeight: '500' }}>{row.common}</td>
              {MAPPING_MEDIAS.map(m => (
                <td key={m} style={{ ...cellBase, color: 'hsl(var(--muted-foreground))' }}>{row.byMedia[m] ?? '—'}</td>
              ))}
            </tr>
          ))}
          {/* 계산 지표: 매체 구분 없이 계산식 1개 (colspan) */}
          {calcMetricMapping.map(row => (
            <tr key={row.common}>
              <td style={{ ...cellBase, position: 'sticky', left: 0, backgroundColor: 'hsl(var(--card))', fontWeight: '500' }}>{row.common}</td>
              <td style={{ ...cellBase, color: 'hsl(var(--muted-foreground))' }} colSpan={MAPPING_MEDIAS.length}>{row.formula}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
