import { ChevronDown, ArrowLeft } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface IndustryDualBarChartProps {
  onIndustryChange?: (industry: string) => void
}

// 매체별 액센트 컬러 (네온 계열)
const MEDIA_COLORS: Record<string, string> = {
  '전체': 'hsl(var(--foreground))',
  'Meta': '#00D9FF',       // Cyan
  'Google Ads': '#FF3D00',     // Neon Orange-Red
  'TikTok': 'hsl(var(--foreground))',
  'Kakao 모먼트': '#FFD600',      // Neon Yellow
  'NAVER 성과형 DA': '#00FF94', // Neon Lime
  'NAVER 보장형 DA': '#00FF94', // Neon Lime
}

const INDUSTRY_LIST = [
  '뷰티', '식품', '패션', '전자제품', '자동차', '게임', '이커머스', '여행',
  '건강식품', '금융', '교육', '부동산', '의료', '스포츠', '엔터테인먼트',
  '가구/인테리어', '반려동물', '육아', '서비스', '통신', '유통', '기타'
]

// 매체 레벨 데이터 — 업종별 매체 CTR + 광고비 비중
const MEDIA_LEVEL: Record<string, { media: string; ctr: number; share: number }[]> = {
  '전체': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.9, share: 28 },
    { media: 'Google Ads', ctr: 2.0, share: 22 },
    { media: 'TikTok', ctr: 3.2, share: 14 },
    { media: 'Kakao 모먼트', ctr: 2.1, share: 16 },
    { media: 'NAVER 성과형 DA', ctr: 2.4, share: 12 },
    { media: 'NAVER 보장형 DA', ctr: 1.8, share: 8 },
  ],
  '뷰티': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 3.4, share: 35 },
    { media: 'Google Ads', ctr: 2.1, share: 18 },
    { media: 'TikTok', ctr: 3.8, share: 20 },
    { media: 'Kakao 모먼트', ctr: 2.3, share: 14 },
    { media: 'NAVER 성과형 DA', ctr: 2.6, share: 9 },
    { media: 'NAVER 보장형 DA', ctr: 1.9, share: 4 },
  ],
  '식품': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.5, share: 22 },
    { media: 'Google Ads', ctr: 1.9, share: 20 },
    { media: 'TikTok', ctr: 2.8, share: 10 },
    { media: 'Kakao 모먼트', ctr: 2.4, share: 25 },
    { media: 'NAVER 성과형 DA', ctr: 2.2, share: 15 },
    { media: 'NAVER 보장형 DA', ctr: 1.7, share: 8 },
  ],
  '패션': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 3.6, share: 38 },
    { media: 'Google Ads', ctr: 2.0, share: 15 },
    { media: 'TikTok', ctr: 4.1, share: 22 },
    { media: 'Kakao 모먼트', ctr: 2.2, share: 12 },
    { media: 'NAVER 성과형 DA', ctr: 2.3, share: 8 },
    { media: 'NAVER 보장형 DA', ctr: 1.8, share: 5 },
  ],
  '전자제품': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.4, share: 20 },
    { media: 'Google Ads', ctr: 2.2, share: 30 },
    { media: 'TikTok', ctr: 2.6, share: 8 },
    { media: 'Kakao 모먼트', ctr: 2.0, share: 18 },
    { media: 'NAVER 성과형 DA', ctr: 2.5, share: 14 },
    { media: 'NAVER 보장형 DA', ctr: 1.9, share: 10 },
  ],
  '자동차': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.0, share: 18 },
    { media: 'Google Ads', ctr: 1.8, share: 28 },
    { media: 'TikTok', ctr: 2.2, share: 5 },
    { media: 'Kakao 모먼트', ctr: 1.9, share: 20 },
    { media: 'NAVER 성과형 DA', ctr: 2.1, share: 16 },
    { media: 'NAVER 보장형 DA', ctr: 1.6, share: 13 },
  ],
  '게임': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 3.2, share: 25 },
    { media: 'Google Ads', ctr: 2.4, share: 20 },
    { media: 'TikTok', ctr: 4.5, share: 30 },
    { media: 'Kakao 모먼트', ctr: 2.6, share: 10 },
    { media: 'NAVER 성과형 DA', ctr: 2.8, share: 10 },
    { media: 'NAVER 보장형 DA', ctr: 2.0, share: 5 },
  ],
  '이커머스': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.8, share: 26 },
    { media: 'Google Ads', ctr: 2.3, share: 24 },
    { media: 'TikTok', ctr: 3.0, share: 12 },
    { media: 'Kakao 모먼트', ctr: 2.2, share: 18 },
    { media: 'NAVER 성과형 DA', ctr: 2.6, share: 14 },
    { media: 'NAVER 보장형 DA', ctr: 1.8, share: 6 },
  ],
  '여행': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.7, share: 30 },
    { media: 'Google Ads', ctr: 2.1, share: 25 },
    { media: 'TikTok', ctr: 2.9, share: 10 },
    { media: 'Kakao 모먼트', ctr: 2.0, share: 15 },
    { media: 'NAVER 성과형 DA', ctr: 2.3, share: 12 },
    { media: 'NAVER 보장형 DA', ctr: 1.7, share: 8 },
  ],
  '건강식품': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 3.1, share: 32 },
    { media: 'Google Ads', ctr: 2.0, share: 18 },
    { media: 'TikTok', ctr: 3.3, share: 15 },
    { media: 'Kakao 모먼트', ctr: 2.4, share: 20 },
    { media: 'NAVER 성과형 DA', ctr: 2.5, share: 10 },
    { media: 'NAVER 보장형 DA', ctr: 1.8, share: 5 },
  ],
  '금융': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 1.8, share: 15 },
    { media: 'Google Ads', ctr: 1.6, share: 32 },
    { media: 'TikTok', ctr: 1.9, share: 5 },
    { media: 'Kakao 모먼트', ctr: 1.7, share: 22 },
    { media: 'NAVER 성과형 DA', ctr: 1.9, share: 18 },
    { media: 'NAVER 보장형 DA', ctr: 1.4, share: 8 },
  ],
  '교육': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.2, share: 28 },
    { media: 'Google Ads', ctr: 1.9, share: 26 },
    { media: 'TikTok', ctr: 2.4, share: 8 },
    { media: 'Kakao 모먼트', ctr: 2.0, share: 18 },
    { media: 'NAVER 성과형 DA', ctr: 2.1, share: 14 },
    { media: 'NAVER 보장형 DA', ctr: 1.6, share: 6 },
  ],
  '부동산': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 1.9, share: 20 },
    { media: 'Google Ads', ctr: 1.7, share: 30 },
    { media: 'TikTok', ctr: 2.0, share: 4 },
    { media: 'Kakao 모먼트', ctr: 1.8, share: 22 },
    { media: 'NAVER 성과형 DA', ctr: 2.0, share: 16 },
    { media: 'NAVER 보장형 DA', ctr: 1.5, share: 8 },
  ],
  '의료': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.1, share: 22 },
    { media: 'Google Ads', ctr: 1.8, share: 28 },
    { media: 'TikTok', ctr: 2.2, share: 6 },
    { media: 'Kakao 모먼트', ctr: 1.9, share: 20 },
    { media: 'NAVER 성과형 DA', ctr: 2.1, share: 16 },
    { media: 'NAVER 보장형 DA', ctr: 1.6, share: 8 },
  ],
  '스포츠': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 3.0, share: 30 },
    { media: 'Google Ads', ctr: 2.2, share: 20 },
    { media: 'TikTok', ctr: 3.5, share: 18 },
    { media: 'Kakao 모먼트', ctr: 2.3, share: 14 },
    { media: 'NAVER 성과형 DA', ctr: 2.4, share: 12 },
    { media: 'NAVER 보장형 DA', ctr: 1.8, share: 6 },
  ],
  '엔터테인먼트': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 3.3, share: 32 },
    { media: 'Google Ads', ctr: 2.1, share: 18 },
    { media: 'TikTok', ctr: 4.2, share: 25 },
    { media: 'Kakao 모먼트', ctr: 2.4, share: 12 },
    { media: 'NAVER 성과형 DA', ctr: 2.5, share: 8 },
    { media: 'NAVER 보장형 DA', ctr: 1.9, share: 5 },
  ],
  '가구/인테리어': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.3, share: 24 },
    { media: 'Google Ads', ctr: 2.0, share: 26 },
    { media: 'TikTok', ctr: 2.5, share: 10 },
    { media: 'Kakao 모먼트', ctr: 2.1, share: 18 },
    { media: 'NAVER 성과형 DA', ctr: 2.2, share: 14 },
    { media: 'NAVER 보장형 DA', ctr: 1.7, share: 8 },
  ],
  '반려동물': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 3.2, share: 34 },
    { media: 'Google Ads', ctr: 2.1, share: 18 },
    { media: 'TikTok', ctr: 3.6, share: 16 },
    { media: 'Kakao 모먼트', ctr: 2.3, share: 16 },
    { media: 'NAVER 성과형 DA', ctr: 2.4, share: 10 },
    { media: 'NAVER 보장형 DA', ctr: 1.8, share: 6 },
  ],
  '육아': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.6, share: 28 },
    { media: 'Google Ads', ctr: 1.9, share: 20 },
    { media: 'TikTok', ctr: 2.8, share: 12 },
    { media: 'Kakao 모먼트', ctr: 2.3, share: 22 },
    { media: 'NAVER 성과형 DA', ctr: 2.2, share: 12 },
    { media: 'NAVER 보장형 DA', ctr: 1.7, share: 6 },
  ],
  '서비스': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.5, share: 26 },
    { media: 'Google Ads', ctr: 2.0, share: 24 },
    { media: 'TikTok', ctr: 2.7, share: 10 },
    { media: 'Kakao 모먼트', ctr: 2.1, share: 18 },
    { media: 'NAVER 성과형 DA', ctr: 2.3, share: 14 },
    { media: 'NAVER 보장형 DA', ctr: 1.7, share: 8 },
  ],
  '통신': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.0, share: 18 },
    { media: 'Google Ads', ctr: 1.8, share: 28 },
    { media: 'TikTok', ctr: 2.2, share: 8 },
    { media: 'Kakao 모먼트', ctr: 1.9, share: 20 },
    { media: 'NAVER 성과형 DA', ctr: 2.0, share: 16 },
    { media: 'NAVER 보장형 DA', ctr: 1.6, share: 10 },
  ],
  '유통': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.6, share: 24 },
    { media: 'Google Ads', ctr: 2.1, share: 22 },
    { media: 'TikTok', ctr: 2.8, share: 12 },
    { media: 'Kakao 모먼트', ctr: 2.2, share: 20 },
    { media: 'NAVER 성과형 DA', ctr: 2.3, share: 14 },
    { media: 'NAVER 보장형 DA', ctr: 1.7, share: 8 },
  ],
  '기타': [
    { media: '전체', ctr: 2.3, share: 100 },
    { media: 'Meta', ctr: 2.5, share: 26 },
    { media: 'Google Ads', ctr: 2.0, share: 22 },
    { media: 'TikTok', ctr: 2.7, share: 12 },
    { media: 'Kakao 모먼트', ctr: 2.1, share: 18 },
    { media: 'NAVER 성과형 DA', ctr: 2.2, share: 14 },
    { media: 'NAVER 보장형 DA', ctr: 1.7, share: 8 },
  ],
}

// 광고상품 레벨 데이터 — 매체별 상위 5개 상품 CTR + 광고비 비중
const PRODUCT_LEVEL: Record<string, Record<string, { product: string; ctr: number; share: number }[]>> = {
  '뷰티': {
    'Meta': [
      { product: 'CONVERSIONS > instagram', ctr: 3.8, share: 18 },
      { product: 'VIDEO_VIEWS > instagram', ctr: 3.5, share: 11 },
      { product: 'OUTCOME_TRAFFIC > instagram', ctr: 3.2, share: 8 },
      { product: 'CONVERSIONS > facebook', ctr: 2.9, share: 6 },
      { product: 'LEAD_GENERATION > instagram', ctr: 2.6, share: 5 },
    ],
    'Google Ads': [
      { product: '디스플레이 광고', ctr: 2.4, share: 9 },
      { product: '동영상 광고 (YouTube)', ctr: 2.1, share: 7 },
      { product: 'Performance Max', ctr: 2.3, share: 5 },
      { product: '검색 광고', ctr: 1.9, share: 4 },
      { product: '디스커버리 광고', ctr: 1.7, share: 3 },
    ],
    'TikTok': [
      { product: 'In-Feed 광고', ctr: 4.2, share: 14 },
      { product: 'Spark Ads', ctr: 3.9, share: 8 },
      { product: 'TopView 광고', ctr: 3.5, share: 5 },
      { product: '브랜드 인수 광고', ctr: 3.1, share: 3 },
      { product: '해시태그 챌린지', ctr: 2.8, share: 2 },
    ],
    'Kakao 모먼트': [
      { product: '카카오톡 비즈보드', ctr: 2.6, share: 8 },
      { product: '카카오톡 채널 광고', ctr: 2.4, share: 5 },
      { product: 'Daum 디스플레이', ctr: 2.1, share: 3 },
      { product: '카카오 모먼트 동영상', ctr: 2.3, share: 2 },
      { product: '카카오 스토리', ctr: 1.9, share: 1 },
    ],
    'NAVER 성과형 DA': [
      { product: '파워링크', ctr: 2.9, share: 5 },
      { product: '쇼핑검색', ctr: 2.7, share: 3 },
      { product: 'GFA 배너', ctr: 2.4, share: 2 },
      { product: '브랜드검색', ctr: 2.2, share: 1 },
      { product: '동영상 광고', ctr: 2.0, share: 1 },
    ],
    'NAVER 보장형 DA': [
      { product: '타임보드', ctr: 2.1, share: 2 },
      { product: '롤링보드', ctr: 1.9, share: 1 },
      { product: '브랜딩DA', ctr: 1.7, share: 1 },
      { product: '스마트채널', ctr: 1.6, share: 1 },
      { product: '메인 배너', ctr: 1.5, share: 1 },
    ],
  },
  '패션': {
    'Meta': [
      { product: 'CONVERSIONS > instagram', ctr: 4.1, share: 20 },
      { product: 'VIDEO_VIEWS > instagram', ctr: 3.8, share: 12 },
      { product: 'OUTCOME_TRAFFIC > instagram', ctr: 3.5, share: 10 },
      { product: 'CONVERSIONS > facebook', ctr: 3.1, share: 7 },
      { product: 'LEAD_GENERATION > instagram', ctr: 2.8, share: 5 },
    ],
    'TikTok': [
      { product: 'In-Feed 광고', ctr: 4.5, share: 16 },
      { product: 'Spark Ads', ctr: 4.2, share: 9 },
      { product: 'TopView 광고', ctr: 3.8, share: 6 },
      { product: '브랜드 인수 광고', ctr: 3.4, share: 4 },
      { product: '해시태그 챌린지', ctr: 3.1, share: 3 },
    ],
    'Google Ads': [
      { product: '디스플레이 광고', ctr: 2.3, share: 8 },
      { product: 'Performance Max', ctr: 2.5, share: 6 },
      { product: '동영상 광고 (YouTube)', ctr: 2.0, share: 5 },
      { product: '검색 광고', ctr: 1.8, share: 3 },
      { product: '디스커버리 광고', ctr: 1.6, share: 2 },
    ],
    'Kakao 모먼트': [
      { product: '카카오톡 비즈보드', ctr: 2.5, share: 7 },
      { product: '카카오톡 채널 광고', ctr: 2.3, share: 4 },
      { product: 'Daum 디스플레이', ctr: 2.0, share: 2 },
      { product: '카카오 모먼트 동영상', ctr: 2.2, share: 2 },
      { product: '카카오 스토리', ctr: 1.8, share: 1 },
    ],
    'NAVER 성과형 DA': [
      { product: '파워링크', ctr: 2.6, share: 4 },
      { product: '쇼핑검색', ctr: 2.8, share: 3 },
      { product: 'GFA 배너', ctr: 2.2, share: 2 },
      { product: '브랜드검색', ctr: 2.0, share: 1 },
      { product: '동영상 광고', ctr: 1.9, share: 1 },
    ],
    'NAVER 보장형 DA': [
      { product: '타임보드', ctr: 2.0, share: 2 },
      { product: '롤링보드', ctr: 1.8, share: 1 },
      { product: '브랜딩DA', ctr: 1.6, share: 1 },
      { product: '스마트채널', ctr: 1.5, share: 1 },
      { product: '메인 배너', ctr: 1.4, share: 1 },
    ],
  },
}

// 나머지 업종은 뷰티 데이터를 기본값으로 사용 (실제 구현 시 각 업종별 데이터 추가)
function getProductData(industry: string, media: string) {
  const industryData = PRODUCT_LEVEL[industry] || PRODUCT_LEVEL['뷰티']
  return industryData[media] || PRODUCT_LEVEL['뷰티'][media] || []
}

type MetricMode = 'ctr' | 'share'

function CustomTooltip({ active, payload, label, mode, drillMedia }: any) {
  if (!active || !payload?.length) return null
  const barEntry = payload.find((p: any) => p.dataKey === 'value')
  const lineEntry = payload.find((p: any) => p.dataKey === 'avg')
  const isShare = mode === 'share'
  return (
    <div style={{
      backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
      borderRadius: '8px', padding: '10px 14px', fontFamily: 'Paperlogy, sans-serif',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '160px'
    }}>
      <div style={{ fontSize: '12px', fontWeight: '600', color: 'hsl(var(--foreground))', marginBottom: '6px' }}>
        {drillMedia ? `${drillMedia} > ${label}` : label}
      </div>
      {barEntry && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', lineHeight: '1.8' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'hsl(var(--foreground))', opacity: 0.7, display: 'inline-block' }} />
          <span style={{ color: 'hsl(var(--muted-foreground))' }}>{isShare ? '광고비 비중' : '평균 CTR'}</span>
          <span style={{ fontWeight: '600', color: 'hsl(var(--foreground))' }}>
            {isShare ? `${Number(barEntry.value).toFixed(2)}%` : `${Number(barEntry.value).toFixed(2)}%`}
          </span>
        </div>
      )}
      {lineEntry && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', lineHeight: '1.8' }}>
          <span style={{ width: '14px', height: '2px', backgroundColor: 'hsl(var(--muted-foreground))', display: 'inline-block', borderRadius: '1px' }} />
          <span style={{ color: 'hsl(var(--muted-foreground))' }}>{isShare ? '전체 평균 비중' : '전체 평균 CTR'}</span>
          <span style={{ fontWeight: '600', color: 'hsl(var(--muted-foreground))' }}>{Number(lineEntry.value).toFixed(2)}%</span>
        </div>
      )}
    </div>
  )
}

export function IndustryDualBarChart({ onIndustryChange }: IndustryDualBarChartProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('전체')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mode, setMode] = useState<MetricMode>('ctr')
  const [drillMedia, setDrillMedia] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const handleIndustrySelect = (ind: string) => {
    setSelectedIndustry(ind)
    setDropdownOpen(false)
    setDrillMedia(null)
    onIndustryChange?.(ind)
  }

  // 레벨 1 차트 데이터
  const mediaData = MEDIA_LEVEL[selectedIndustry] || MEDIA_LEVEL['뷰티']
  const overallAvg = mode === 'ctr' ? 2.3 : (100 / 6)

  const level1Data = mediaData.map(d => ({
    name: d.media,
    value: mode === 'ctr' ? d.ctr : d.share,
    avg: overallAvg,
    _media: d.media,
    _color: MEDIA_COLORS[d.media] || 'hsl(var(--foreground))',
  }))

  // 레벨 2 차트 데이터
  const productData = drillMedia ? getProductData(selectedIndustry, drillMedia) : []
  const drillColor = drillMedia ? (MEDIA_COLORS[drillMedia] || 'hsl(var(--foreground))') : 'hsl(var(--foreground))'
  const mediaAvg = drillMedia
    ? (mode === 'ctr'
      ? (mediaData.find(d => d.media === drillMedia)?.ctr ?? 2.3)
      : (mediaData.find(d => d.media === drillMedia)?.share ?? 16))
    : 0

  const level2Data = productData.map(d => ({
    name: d.product.length > 18 ? d.product.slice(0, 18) + '…' : d.product,
    fullName: d.product,
    value: mode === 'ctr' ? d.ctr : d.share,
    avg: mediaAvg,
    _color: drillColor,
  }))

  const chartData = drillMedia ? level2Data : level1Data
  const yLabel = mode === 'ctr' ? 'CTR (%)' : '광고비 비중 (%)'
  const avgLabel = drillMedia
    ? (mode === 'ctr' ? `${drillMedia} 평균 CTR` : `${drillMedia} 평균 비중`)
    : (mode === 'ctr' ? '전체 평균 CTR' : '전체 평균 비중')

  return (
    <div className="card" style={{
      padding: '20px 24px', height: '280px', display: 'flex',
      flexDirection: 'column', gap: '12px', boxShadow: 'none', overflow: 'hidden'
    }}>
      {/* 상단 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 드릴다운 뒤로가기 */}
          {drillMedia ? (
            <button
              onClick={() => setDrillMedia(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontSize: '12px', color: 'hsl(var(--muted-foreground))',
                fontFamily: 'Paperlogy, sans-serif', marginBottom: '4px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
            >
              <ArrowLeft size={12} />
              매체 전체 보기
            </button>
          ) : null}
          <h3 style={{
            fontSize: '15px', fontWeight: '700', margin: 0,
            color: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif', lineHeight: '1.3'
          }}>
            {drillMedia
              ? `${drillMedia}의 광고상품별 ${mode === 'ctr' ? 'CTR' : '광고비 비중'}`
              : mode === 'ctr'
                ? `${selectedIndustry} 업종에서 가장 반응이 뜨거운 매체는?`
                : `${selectedIndustry} 업종에서 가장 투자 비중이 높은 매체는?`
            }
          </h3>
          {!drillMedia && (
            <p style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))', margin: '4px 0 0 0', fontFamily: 'Paperlogy, sans-serif', lineHeight: '1.5' }}>
              최근 6개월 집행 캠페인 데이터 기준
            </p>
          )}
          {drillMedia && (
            <p style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))', margin: '4px 0 0 0', fontFamily: 'Paperlogy, sans-serif', lineHeight: '1.5' }}>
              {mode === 'ctr' ? 'CTR' : '광고비 비중'} 기준 상위 5개 광고상품
            </p>
          )}
        </div>

        {/* 우측 컨트롤 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* CTR / 광고비 비중 토글 */}
          <div style={{
            display: 'flex', borderRadius: '6px', overflow: 'hidden',
            border: '1px solid hsl(var(--border))'
          }}>
            {(['ctr', 'share'] as MetricMode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: '4px 10px', fontSize: '11px', fontWeight: mode === m ? '600' : '400',
                backgroundColor: mode === m ? 'hsl(var(--foreground))' : 'transparent',
                color: mode === m ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'Paperlogy, sans-serif'
              }}>
                {m === 'ctr' ? 'CTR' : '광고비'}
              </button>
            ))}
          </div>

          {/* 업종 드롭다운 */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px', fontSize: '11px', fontWeight: '500',
                color: 'hsl(var(--foreground))', backgroundColor: 'hsl(var(--muted))',
                border: '1px solid hsl(var(--border))', borderRadius: '6px',
                cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                fontFamily: 'Paperlogy, sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--accent))'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
            >
              {selectedIndustry}
              <ChevronDown size={11} style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                width: '140px', maxHeight: '240px', overflowY: 'auto',
                backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))',
                borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50, padding: '4px'
              }}>
                {INDUSTRY_LIST.map((ind) => (
                  <button key={ind} onClick={() => handleIndustrySelect(ind)} style={{
                    width: '100%', padding: '6px 10px', fontSize: '12px',
                    fontWeight: selectedIndustry === ind ? '600' : '400',
                    color: selectedIndustry === ind ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                    backgroundColor: selectedIndustry === ind ? 'hsl(var(--accent))' : 'transparent',
                    border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s', fontFamily: 'Paperlogy, sans-serif'
                  }}
                    onMouseEnter={(e) => { if (selectedIndustry !== ind) e.currentTarget.style.backgroundColor = 'hsl(var(--muted))' }}
                    onMouseLeave={(e) => { if (selectedIndustry !== ind) e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    {selectedIndustry === ind ? '✓ ' : ''}{ind}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 차트 */}
      <div style={{ minHeight: '120px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'hsl(var(--foreground))', opacity: 0.6, display: 'inline-block' }} />
            {yLabel}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>
            <span style={{ width: '14px', height: '2px', backgroundColor: 'hsl(var(--muted-foreground))', display: 'inline-block', borderRadius: '1px' }} />
            {avgLabel}
          </span>
        </div>
        <div style={{ userSelect: 'none' }}>
        <style>{`.recharts-surface:focus, .recharts-surface *:focus { outline: none !important; }`}</style>
        <ResponsiveContainer width="100%" height={130}>
          <ComposedChart
            data={chartData}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >

            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'Paperlogy, sans-serif' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip mode={mode} drillMedia={drillMedia} />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
            <ReferenceLine y={drillMedia ? mediaAvg : overallAvg} yAxisId={0} stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} />
            <Bar
              dataKey="value"
              fill="hsl(var(--foreground))"
              fillOpacity={0.12}
              radius={0}
              maxBarSize={32}
              cursor={!drillMedia ? 'pointer' : 'default'}
              onClick={(data: any) => {
                if (!drillMedia && data?._media && data._media !== '전체') {
                  setDrillMedia(data._media)
                }
              }}
              shape={(props: any) => {
                const { x, y, width, height, _color } = props
                const barColor = _color || 'hsl(var(--foreground))'
                return (
                  <g>
                    <rect x={x} y={y} width={width} height={height} fill="hsl(var(--foreground))" fillOpacity={0.12} />
                    <rect x={x} y={y} width={width} height={2.5} fill={barColor} fillOpacity={0.9} />
                  </g>
                )
              }}
            />
            <Line dataKey="avg" stroke="transparent" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
        </div>
        {!drillMedia && (
          <p style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))', margin: '4px 0 0 0', fontFamily: 'Paperlogy, sans-serif', opacity: 0.7 }}>
            막대 클릭 시 광고상품으로 드릴다운
          </p>
        )}
      </div>
    </div>
  )
}
