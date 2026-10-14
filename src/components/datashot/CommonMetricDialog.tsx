// 공통 지표 기준 안내 다이얼로그 (생성 플로우 지표 선택 + 결과 차트에서 공용)
// 각 매체의 원본 지표를 공통 기준으로 매핑해 매체 간 비교가 가능하게 함을 안내한다.
// 범위: 결과 화면 차트(Benchmark Analytics)의 지표는 이 공통 지표로 고정된다.
//   (하단 Extracted 로우 데이터 테이블은 이 매핑 대상이 아니다.)
import React from 'react'

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
  { common: '클릭당 비용(CPC)', formula: '광고비 / 클릭수' },
  { common: '조회당 비용(CPV)', formula: '광고비 / 조회수' },
  { common: '클릭률(CTR)', formula: '클릭수 / 노출수 * 100' },
  { common: '조회율(VTR)', formula: '조회수 / 노출수 * 100' },
]

export function CommonMetricMappingTable() {
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

// 공통 지표 기준 안내 다이얼로그. 트리거(아이콘/버튼)는 호출부가 두고, 열림 상태만 주입.
export function CommonMetricDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content dialog-lg" onClick={e => e.stopPropagation()}>
        <div className="dialog-header">
          <h3 className="dialog-title">공통 지표 기준</h3>
          <p className="dialog-description">각 매체의 지표를 공통 기준으로 매핑해 매체 간 비교가 가능하도록 제공합니다.</p>
        </div>
        <div style={{ padding: '24px' }}>
          <CommonMetricMappingTable />
        </div>
        <div className="dialog-footer">
          <button onClick={onClose} className="btn btn-primary btn-md">확인</button>
        </div>
      </div>
    </div>
  )
}
