import type { MetricGroup } from './types'

// Meta 지표 — 타입별 순서 정리
export const metaMetrics: MetricGroup[] = [
  {
    group: '성과',
    metrics: [
      { id: 'spend', label: '광고 소진금액', selected: false },
      { id: 'impressions', label: '노출수', selected: false },
      { id: 'clicks_all', label: '클릭(전체)', selected: false },
      { id: 'frequency', label: '빈도', selected: false },
      { id: 'cpc', label: 'CPC', selected: false },
      { id: 'cpm', label: 'CPM', selected: false },
      { id: 'ctr', label: 'CTR', selected: false },
      { id: 'cpv', label: 'CPV', selected: false },
      { id: 'vtr', label: 'VTR', selected: false },
    ]
  },
  {
    group: '진단',
    metrics: [
      { id: 'video_view_25', label: '동영상 25% 재생수', selected: false },
      { id: 'video_view_50', label: '동영상 50% 재생수', selected: false },
      { id: 'video_view_75', label: '동영상 75% 재생수', selected: false },
      { id: 'video_view_95', label: '동영상 95% 재생수', selected: false },
      { id: 'video_view_100', label: '동영상 100% 재생', selected: false },
    ]
  },
  {
    group: '참여',
    metrics: [
      { id: 'video_views_3s', label: '동영상 3초 이상 조회수', selected: false },
      { id: 'video_views_15s', label: '동영상 15초 이상 조회수', selected: false },
      { id: 'video_views_30s', label: '동영상 30초 이상 조회수', selected: false },
      { id: 'cost_per_video_3s', label: '동영상 3초 이상 조회당 비용', selected: false },
      { id: 'cost_per_video_15s', label: '동영상 15초 이상 조회당 비용', selected: false },
      { id: 'video_play_3s', label: '3초 재생수', selected: false },
      { id: 'video_play_15s', label: '15초 재생수', selected: false },
      { id: 'post_reaction', label: '게시물 반응수', selected: false },
      { id: 'post_engagement', label: '게시물 참여수', selected: false },
      { id: 'cost_per_post_engagement', label: '게시물 참여당 비용', selected: false },
      { id: 'link_click', label: '링크 클릭 수', selected: false },
      { id: 'cost_per_link_click', label: '링크 클릭당 비용', selected: false },
      { id: 'link_ctr', label: '링크 클릭률', selected: false },
    ]
  },
  {
    group: '전환',
    metrics: [
      { id: 'purchase', label: '구매수', selected: false },
      { id: 'cost_per_purchase', label: '구매당 비용', selected: false },
      { id: 'complete_registration', label: '등록 완료수', selected: false },
      { id: 'cost_per_registration', label: '등록 완료당 비용', selected: false },
      { id: 'install', label: '설치수', selected: false },
      { id: 'cost_per_install', label: '설치당 비용', selected: false },
    ]
  }
]
