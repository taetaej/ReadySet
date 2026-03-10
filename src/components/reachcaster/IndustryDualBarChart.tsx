import { TrendingUp, Zap, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface AdProduct {
  name: string
  spendShare: number
  ctr: number
  impression: number
}

interface IndustryDualBarChartProps {
  industry?: string
  onIndustryChange?: (industry: string) => void
}

// 22개 업종 리스트
const industries = [
  '뷰티',
  '식품',
  '패션',
  '전자제품',
  '자동차',
  '게임',
  '이커머스',
  '여행',
  '건강식품',
  '금융',
  '교육',
  '부동산',
  '의료',
  '스포츠',
  '엔터테인먼트',
  '가구/인테리어',
  '반려동물',
  '육아',
  '서비스',
  '통신',
  '유통',
  '기타'
]

// 뷰티 업종 샘플 데이터
const beautyData: AdProduct[] = [
  { name: 'Meta > instagram', spendShare: 12.5, ctr: 3.1, impression: 850000 },
  { name: 'Google Ads > 디스플레이 광고', spendShare: 10.2, ctr: 2.3, impression: 720000 },
  { name: 'Meta > facebook', spendShare: 9.8, ctr: 2.9, impression: 650000 },
  { name: 'TikTok > In-Feed 광고', spendShare: 8.5, ctr: 2.6, impression: 580000 },
  { name: 'Google Ads > 동영상 광고 (YouTube)', spendShare: 7.9, ctr: 1.9, impression: 920000 },
  { name: 'Meta > OUTCOME_TRAFFIC > AUCTION > LINK_CLICKS > facebook&instagram', spendShare: 7.2, ctr: 2.4, impression: 480000 },
  { name: 'kakao모먼트 > 카카오톡 비즈보드', spendShare: 6.8, ctr: 2.1, impression: 780000 },
  { name: 'Google Ads > 검색 광고', spendShare: 6.5, ctr: 1.8, impression: 690000 },
  { name: 'Meta > CONVERSIONS > AUCTION > LINK_CLICKS > facebook', spendShare: 6.1, ctr: 2.2, impression: 540000 },
  { name: 'TikTok > Spark Ads', spendShare: 5.8, ctr: 2.7, impression: 420000 },
  { name: '네이버 성과형 DA > 파워링크', spendShare: 5.4, ctr: 2.5, impression: 380000 },
  { name: 'Meta > LEAD_GENERATION > AUCTION > LEAD_GENERATION > instagram', spendShare: 5.1, ctr: 1.7, impression: 610000 },
  { name: 'Google Ads > Performance Max', spendShare: 4.8, ctr: 2.0, impression: 520000 },
  { name: 'kakao모먼트 > 카카오톡 채널 광고', spendShare: 4.5, ctr: 2.3, impression: 460000 },
  { name: 'TikTok > TopView 광고', spendShare: 4.2, ctr: 1.9, impression: 550000 },
  { name: 'Meta > VIDEO_VIEWS > AUCTION > VIDEO_VIEWS > instagram', spendShare: 3.9, ctr: 2.8, impression: 390000 },
  { name: '네이버 성과형 DA > 쇼핑검색', spendShare: 3.6, ctr: 2.1, impression: 340000 },
  { name: 'Google Ads > 디스커버리 광고', spendShare: 3.3, ctr: 1.6, impression: 280000 },
  { name: 'kakao모먼트 > Daum 디스플레이', spendShare: 3.0, ctr: 2.4, impression: 410000 },
  { name: '네이버 성과형 DA > GFA (보장형 배너)', spendShare: 2.7, ctr: 2.2, impression: 320000 }
]

export function IndustryDualBarChart({ industry = '뷰티', onIndustryChange }: IndustryDualBarChartProps) {
  const [selectedIndustry, setSelectedIndustry] = useState(industry)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleIndustrySelect = (ind: string) => {
    setSelectedIndustry(ind)
    setDropdownOpen(false)
    onIndustryChange?.(ind)
  }
  
  // 광고비 TOP 5
  const topSpend = [...beautyData]
    .sort((a, b) => b.spendShare - a.spendShare)
    .slice(0, 5)
  
  // CTR TOP 5
  const topCtr = [...beautyData]
    .sort((a, b) => b.ctr - a.ctr)
    .slice(0, 5)
  
  const maxSpend = Math.max(...topSpend.map(p => p.spendShare))
  const maxCtr = Math.max(...topCtr.map(p => p.ctr))
  
  // 양쪽 리스트에 모두 포함된 상품 찾기 (중복 상품)
  const topSpendNames = new Set(topSpend.map(p => p.name))
  const topCtrNames = new Set(topCtr.map(p => p.name))
  const duplicateProducts = new Set(
    [...topSpendNames].filter(name => topCtrNames.has(name))
  )
  
  // 디버깅용 로그
  console.log('Top Spend:', topSpend.map(p => p.name))
  console.log('Top CTR:', topCtr.map(p => p.name))
  console.log('Duplicates:', Array.from(duplicateProducts))
  
  // 중복 상품인지 확인하는 함수
  const isDuplicate = (productName: string) => duplicateProducts.has(productName)
  
  // 상품명 축약
  const shortenName = (name: string) => {
    const parts = name.split(' > ')
    if (parts.length > 2) {
      return `${parts[0]} > ${parts[parts.length - 1]}`
    }
    return name
  }
  
  return (
    <div className="card" style={{
      padding: '24px',
      minHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'none'
    }}>
      {/* 헤더 */}
      <div style={{ 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '500',
            margin: '0 0 4px 0',
            color: 'hsl(var(--foreground))'
          }}>
            {selectedIndustry} 업종의 광고 상품 트렌드와 효율
          </h3>
          <p style={{
            fontSize: '12px',
            fontWeight: '400',
            margin: '0',
            color: 'hsl(var(--muted-foreground))'
          }}>
            최근 6개월 광고비 비중 상위 30개 광고 상품 기준
          </p>
        </div>

        {/* 업종 선택 드롭다운 */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: '500',
              color: 'hsl(var(--foreground))',
              backgroundColor: 'hsl(var(--muted))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(var(--accent))'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
            }}
          >
            {selectedIndustry}
            <ChevronDown 
              size={14} 
              style={{ 
                transition: 'transform 0.2s ease',
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }} 
            />
          </button>

          {/* 드롭다운 메뉴 */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              right: 0,
              width: '160px',
              maxHeight: '300px',
              overflowY: 'auto',
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              zIndex: 50,
              padding: '4px'
            }}>
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => handleIndustrySelect(ind)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: selectedIndustry === ind ? '600' : '400',
                    color: selectedIndustry === ind 
                      ? 'hsl(var(--primary))' 
                      : 'hsl(var(--foreground))',
                    backgroundColor: selectedIndustry === ind 
                      ? 'hsl(var(--accent))' 
                      : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedIndustry !== ind) {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedIndustry !== ind) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {ind}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 듀얼 차트 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        {/* 왼쪽: 광고비 TOP 5 */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <TrendingUp size={16} style={{ color: 'hsl(var(--foreground))' }} />
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              margin: 0,
              color: 'hsl(var(--foreground))'
            }}>
              Highest Spend
            </h4>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topSpend.map((product, index) => {
              const isHighlighted = isDuplicate(product.name)
              
              return (
                <div key={index}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flex: 1,
                      minWidth: 0
                    }}>
                      {/* 중복 인디케이터 */}
                      {isHighlighted && (
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#00ff9d',
                          flexShrink: 0
                        }} />
                      )}
                      <div style={{
                        fontSize: '11px',
                        color: 'hsl(var(--foreground))',
                        fontWeight: isHighlighted ? '600' : '500',
                        flex: 1,
                        minWidth: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {shortenName(product.name)}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'hsl(var(--foreground))',
                      marginLeft: '8px',
                      flexShrink: 0
                    }}>
                      {product.spendShare}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'hsl(var(--muted))',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(product.spendShare / maxSpend) * 100}%`,
                      height: '100%',
                      backgroundColor: 'hsl(var(--foreground))',
                      opacity: 0.3,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease, background-color 0.3s ease'
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 오른쪽: CTR TOP 5 */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <Zap size={16} style={{ color: 'hsl(var(--foreground))' }} />
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              margin: 0,
              color: 'hsl(var(--foreground))'
            }}>
              Best CTR
            </h4>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topCtr.map((product, index) => {
              const isHighlighted = isDuplicate(product.name)
              
              return (
                <div key={index}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flex: 1,
                      minWidth: 0
                    }}>
                      {/* 중복 인디케이터 */}
                      {isHighlighted && (
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#00ff9d',
                          flexShrink: 0
                        }} />
                      )}
                      <div style={{
                        fontSize: '11px',
                        color: 'hsl(var(--foreground))',
                        fontWeight: isHighlighted ? '600' : '500',
                        flex: 1,
                        minWidth: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {shortenName(product.name)}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'hsl(var(--foreground))',
                      marginLeft: '8px',
                      flexShrink: 0
                    }}>
                      {product.ctr}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'hsl(var(--muted))',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(product.ctr / maxCtr) * 100}%`,
                      height: '100%',
                      backgroundColor: 'hsl(var(--foreground))',
                      opacity: 0.3,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease, background-color 0.3s ease'
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
