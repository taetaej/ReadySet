import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { mediaData } from './scenario/constants'

interface DetailedDataTableProps {
  selectedData: any
  isDarkMode: boolean
}

export function DetailedDataTable({ selectedData, isDarkMode }: DetailedDataTableProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['DIGITAL', 'TVC'])
  
  // 선택된 비중 데이터
  const tvcRatio = selectedData?.tvcRatio ?? 50
  const digitalRatio = selectedData?.digitalRatio ?? 50
  
  console.log('DetailedDataTable - tvcRatio:', tvcRatio, 'digitalRatio:', digitalRatio)
  console.log('selectedData:', selectedData)
  
  // 모든 매체 키 생성
  const allMediaKeys = [
    ...['Google Ads', 'Meta', 'NAVER 보장형 DA'].map(m => `DIGITAL_${m}`),
    ...['지상파', '종편', 'CJ ENM'].map(m => `TVC_${m}`)
  ]
  
  const [expandedMedia, setExpandedMedia] = useState<string[]>(allMediaKeys)

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
  }

  const toggleMedia = (mediaKey: string) => {
    setExpandedMedia(prev =>
      prev.includes(mediaKey) ? prev.filter(m => m !== mediaKey) : [...prev, mediaKey]
    )
  }

  const expandAll = () => {
    setExpandedCategories(['DIGITAL', 'TVC'])
    setExpandedMedia(allMediaKeys)
  }

  const collapseAll = () => {
    setExpandedCategories([])
    setExpandedMedia([])
  }

  // 샘플 데이터 생성
  const generateDetailedData = () => {
    const data: any = {
      DIGITAL: {},
      TVC: {}
    }

    // DIGITAL 데이터
    const digitalMedia = ['Google Ads', 'Meta', 'NAVER 보장형 DA']
    digitalMedia.forEach(media => {
      const products = mediaData.DIGITAL[media as keyof typeof mediaData.DIGITAL].slice(0, 3)
      data.DIGITAL[media] = products.map((product: string) => ({
        product,
        uv: Math.floor(Math.random() * 2000000) + 500000,
        budget: Math.floor(Math.random() * 500000000) + 100000000,
        impressions: Math.floor(Math.random() * 30000000) + 5000000,
        reach: Math.floor(Math.random() * 10000000) + 2000000,
        frequency: (Math.random() * 2 + 2).toFixed(2),
        grp: (Math.random() * 50 + 20).toFixed(2),
        cprp: Math.floor(Math.random() * 10000000) + 3000000,
        reach1: (Math.random() * 10 + 10).toFixed(2),
        reach2: (Math.random() * 5 + 5).toFixed(2),
        reach3: (Math.random() * 3 + 4).toFixed(2),
        reach4: (Math.random() * 2 + 3).toFixed(2),
        reach5: (Math.random() * 1 + 2).toFixed(2)
      }))
    })

    // TVC 데이터
    const tvcMedia = ['지상파', '종편', 'CJ ENM']
    tvcMedia.forEach(media => {
      const channels = mediaData.TV[media as keyof typeof mediaData.TV].slice(0, 3)
      data.TVC[media] = channels.map((channel: string) => ({
        product: channel,
        uv: Math.floor(Math.random() * 3000000) + 1000000,
        budget: Math.floor(Math.random() * 600000000) + 200000000,
        impressions: Math.floor(Math.random() * 40000000) + 10000000,
        reach: Math.floor(Math.random() * 15000000) + 5000000,
        frequency: (Math.random() * 2 + 2.5).toFixed(2),
        grp: (Math.random() * 60 + 30).toFixed(2),
        cprp: Math.floor(Math.random() * 12000000) + 5000000,
        reach1: '-', // TVC 채널 단위는 Reach 데이터 없음
        reach2: '-',
        reach3: '-',
        reach4: '-',
        reach5: '-'
      }))
    })

    return data
  }

  const detailedData = generateDetailedData()

  // Sub Total 계산
  const calculateMediaSubTotal = (category: string, media: string) => {
    const products = detailedData[category][media]
    
    // TVC 매체는 Reach 4+, 5+ 없음
    const isTVC = category === 'TVC'
    
    return {
      uv: products.reduce((sum: number, p: any) => sum + p.uv, 0),
      budget: products.reduce((sum: number, p: any) => sum + p.budget, 0),
      impressions: products.reduce((sum: number, p: any) => sum + p.impressions, 0),
      reach: products.reduce((sum: number, p: any) => sum + p.reach, 0),
      frequency: (products.reduce((sum: number, p: any) => sum + parseFloat(p.frequency), 0) / products.length).toFixed(2),
      grp: products.reduce((sum: number, p: any) => sum + parseFloat(p.grp), 0).toFixed(2),
      cprp: Math.floor(products.reduce((sum: number, p: any) => sum + p.cprp, 0) / products.length),
      reach1: isTVC ? (Math.random() * 12 + 12).toFixed(2) : (products.reduce((sum: number, p: any) => sum + parseFloat(p.reach1), 0) / products.length).toFixed(2),
      reach2: isTVC ? (Math.random() * 6 + 6).toFixed(2) : (products.reduce((sum: number, p: any) => sum + parseFloat(p.reach2), 0) / products.length).toFixed(2),
      reach3: isTVC ? (Math.random() * 4 + 5).toFixed(2) : (products.reduce((sum: number, p: any) => sum + parseFloat(p.reach3), 0) / products.length).toFixed(2),
      reach4: isTVC ? '-' : (products.reduce((sum: number, p: any) => sum + parseFloat(p.reach4), 0) / products.length).toFixed(2),
      reach5: isTVC ? '-' : (products.reduce((sum: number, p: any) => sum + parseFloat(p.reach5), 0) / products.length).toFixed(2)
    }
  }

  // Category Sub Total 계산
  const calculateCategorySubTotal = (category: string) => {
    const mediaList = Object.keys(detailedData[category])
    const allProducts = mediaList.flatMap(media => detailedData[category][media])
    
    // TVC 카테고리는 Reach 4+, 5+ 없음
    const isTVC = category === 'TVC'
    
    return {
      uv: allProducts.reduce((sum: number, p: any) => sum + p.uv, 0),
      budget: allProducts.reduce((sum: number, p: any) => sum + p.budget, 0),
      impressions: allProducts.reduce((sum: number, p: any) => sum + p.impressions, 0),
      reach: allProducts.reduce((sum: number, p: any) => sum + p.reach, 0),
      frequency: (allProducts.reduce((sum: number, p: any) => sum + parseFloat(p.frequency), 0) / allProducts.length).toFixed(2),
      grp: allProducts.reduce((sum: number, p: any) => sum + parseFloat(p.grp), 0).toFixed(2),
      cprp: Math.floor(allProducts.reduce((sum: number, p: any) => sum + p.cprp, 0) / allProducts.length),
      reach1: isTVC ? (Math.random() * 12 + 12).toFixed(2) : (allProducts.reduce((sum: number, p: any) => sum + parseFloat(p.reach1), 0) / allProducts.length).toFixed(2),
      reach2: isTVC ? (Math.random() * 6 + 6).toFixed(2) : (allProducts.reduce((sum: number, p: any) => sum + parseFloat(p.reach2), 0) / allProducts.length).toFixed(2),
      reach3: isTVC ? (Math.random() * 4 + 5).toFixed(2) : (allProducts.reduce((sum: number, p: any) => sum + parseFloat(p.reach3), 0) / allProducts.length).toFixed(2),
      reach4: isTVC ? '-' : (allProducts.reduce((sum: number, p: any) => sum + parseFloat(p.reach4), 0) / allProducts.length).toFixed(2),
      reach5: isTVC ? '-' : (allProducts.reduce((sum: number, p: any) => sum + parseFloat(p.reach5), 0) / allProducts.length).toFixed(2)
    }
  }

  // Grand Total 계산
  const calculateGrandTotal = () => {
    // 실제로는 백엔드에서 내려올 값 - 샘플 데이터
    return {
      budget: 1500000000,
      impressions: 85000000,
      reach: 32000000,
      frequency: 3.45,
      grp: 245.50,
      cprp: 6500000,
      reach1: 15.8,
      reach2: 8.2,
      reach3: 5.5,
      reach4: 3.8,
      reach5: 2.5
    }
  }

  const formatNumber = (num: number) => num.toLocaleString('ko-KR')
  
  // 단위를 포함한 포맷팅 함수
  const formatWithUnit = (num: number, unit: string) => {
    return (
      <>
        {formatNumber(num)}
        <span style={{ 
          fontSize: '10px', 
          opacity: 0.5, 
          marginLeft: '4px',
          fontWeight: '400'
        }}>
          {unit}
        </span>
      </>
    )
  }

  const isAllExpanded = expandedCategories.length === 2 && expandedMedia.length === allMediaKeys.length

  const toggleAll = () => {
    if (isAllExpanded) {
      collapseAll()
    } else {
      expandAll()
    }
  }

  return (
    <div style={{
      border: '1px solid hsl(var(--border))',
      borderRadius: '8px',
      fontFamily: 'Paperlogy, sans-serif',
      width: '100%',
      maxWidth: '100%',
      overflowX: 'auto',
      overflowY: 'visible'
    }}>
      {/* 가로 스크롤 컨테이너 */}
      <div style={{
        minWidth: '1600px' // 최소 폭 설정
      }}>
          {/* 테이블 헤더 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 140px 120px 120px 100px 100px 120px 100px 100px 100px 100px 100px',
            backgroundColor: 'hsl(var(--muted))',
            borderBottom: '1px solid hsl(var(--border))',
            fontSize: '12px',
            fontWeight: '600',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <div style={{ 
              padding: '12px 8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <button
                onClick={toggleAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'hsl(var(--foreground))',
                  fontSize: '11px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s',
                  fontFamily: 'Paperlogy, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted-foreground) / 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {isAllExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>
            <div style={{ padding: '12px 8px' }}>구분 &gt; 매체 &gt; 상품/채널</div>
            <div style={{ padding: '12px 8px', textAlign: 'right' }}>Budget</div>
            <div style={{ padding: '12px 8px', textAlign: 'right' }}>Impression</div>
            <div style={{ padding: '12px 8px', textAlign: 'right' }}>Reach (Count)</div>
            <div style={{ padding: '12px 8px', textAlign: 'right' }}>Avg. Frequency</div>
            <div style={{ padding: '12px 8px', textAlign: 'right' }}>GRPs</div>
            <div style={{ padding: '12px 8px', textAlign: 'right' }}>CPRP</div>
            <div style={{ padding: '12px 8px', textAlign: 'right' }}>Reach 1+</div>
            <div style={{ padding: '12px 8px', textAlign: 'right' }}>Reach 2+</div>
            <div style={{ padding: '12px 8px', textAlign: 'right' }}>Reach 3+</div>
            <div style={{ padding: '12px 8px', textAlign: 'right' }}>Reach 4+</div>
            <div style={{ padding: '12px 8px', textAlign: 'right' }}>Reach 5+</div>
          </div>

          {/* 테이블 바디 */}
          <div>
        {['DIGITAL', 'TVC'].map(category => {
          const isExpanded = expandedCategories.includes(category)
          const categorySubTotal = calculateCategorySubTotal(category)
          
          // 해당 카테고리의 비중이 0인지 확인
          const categoryRatio = category === 'DIGITAL' ? digitalRatio : tvcRatio
          const hasData = categoryRatio > 0
          
          return (
            <div key={category}>
              {/* 1depth: Category */}
              <div
                onClick={() => hasData && toggleCategory(category)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 140px 120px 120px 100px 100px 120px 100px 100px 100px 100px 100px',
                  backgroundColor: 'hsl(var(--muted) / 0.5)',
                  borderBottom: '1px solid hsl(var(--border))',
                  cursor: hasData ? 'pointer' : 'default',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'background-color 0.2s',
                  opacity: hasData ? 1 : 0.5
                }}
                onMouseEnter={(e) => hasData && (e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.7)')}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'}
              >
                <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {hasData && (
                    <ChevronRight 
                      size={16} 
                      style={{ 
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', 
                        transition: 'transform 0.2s' 
                      }} 
                    />
                  )}
                </div>
                <div style={{ padding: '12px 8px' }}>{category}</div>
                <div style={{ padding: '12px 8px', textAlign: 'right' }}>{hasData ? formatWithUnit(categorySubTotal.budget, '원') : '-'}</div>
                <div style={{ padding: '12px 8px', textAlign: 'right' }}>{hasData ? formatWithUnit(categorySubTotal.impressions, '회') : '-'}</div>
                <div style={{ padding: '12px 8px', textAlign: 'right' }}>{hasData ? formatWithUnit(categorySubTotal.reach, '회') : '-'}</div>
                <div style={{ padding: '12px 8px', textAlign: 'right' }}>{hasData ? formatWithUnit(parseFloat(categorySubTotal.frequency), '회') : '-'}</div>
                <div style={{ padding: '12px 8px', textAlign: 'right' }}>{hasData ? categorySubTotal.grp : '-'}</div>
                <div style={{ padding: '12px 8px', textAlign: 'right' }}>{hasData ? formatWithUnit(categorySubTotal.cprp, '원') : '-'}</div>
                <div style={{ padding: '12px 8px', textAlign: 'right' }} className={!hasData || categorySubTotal.reach1 === '-' ? 'text-muted-foreground' : ''}>{hasData && categorySubTotal.reach1 !== '-' ? formatWithUnit(parseFloat(categorySubTotal.reach1), '%') : '-'}</div>
                <div style={{ padding: '12px 8px', textAlign: 'right' }} className={!hasData || categorySubTotal.reach2 === '-' ? 'text-muted-foreground' : ''}>{hasData && categorySubTotal.reach2 !== '-' ? formatWithUnit(parseFloat(categorySubTotal.reach2), '%') : '-'}</div>
                <div style={{ padding: '12px 8px', textAlign: 'right' }} className={!hasData || categorySubTotal.reach3 === '-' ? 'text-muted-foreground' : ''}>{hasData && categorySubTotal.reach3 !== '-' ? formatWithUnit(parseFloat(categorySubTotal.reach3), '%') : '-'}</div>
                <div style={{ padding: '12px 8px', textAlign: 'right' }} className={!hasData || categorySubTotal.reach4 === '-' ? 'text-muted-foreground' : ''}>{hasData && categorySubTotal.reach4 !== '-' ? formatWithUnit(parseFloat(categorySubTotal.reach4), '%') : '-'}</div>
                <div style={{ padding: '12px 8px', textAlign: 'right' }} className={!hasData || categorySubTotal.reach5 === '-' ? 'text-muted-foreground' : ''}>{hasData && categorySubTotal.reach5 !== '-' ? formatWithUnit(parseFloat(categorySubTotal.reach5), '%') : '-'}</div>
              </div>

              {/* 2depth: Media - 비중이 0이면 표시하지 않음 */}
              {hasData && isExpanded && Object.keys(detailedData[category]).map(media => {
                const mediaKey = `${category}_${media}`
                const isMediaExpanded = expandedMedia.includes(mediaKey)
                const mediaSubTotal = calculateMediaSubTotal(category, media)
                
                return (
                  <div key={mediaKey}>
                    <div
                      onClick={() => toggleMedia(mediaKey)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 1fr 140px 120px 120px 100px 100px 120px 100px 100px 100px 100px 100px',
                        backgroundColor: 'hsl(var(--card))',
                        borderBottom: '1px solid hsl(var(--border))',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--card))'}
                    >
                      <div style={{ padding: '10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '24px' }}>
                        <ChevronRight 
                          size={14} 
                          style={{ 
                            transform: isMediaExpanded ? 'rotate(90deg)' : 'rotate(0deg)', 
                            transition: 'transform 0.2s' 
                          }} 
                        />
                      </div>
                      <div style={{ padding: '10px 8px' }}>{media}</div>
                      <div style={{ padding: '10px 8px', textAlign: 'right' }}>{formatWithUnit(mediaSubTotal.budget, '원')}</div>
                      <div style={{ padding: '10px 8px', textAlign: 'right' }}>{formatWithUnit(mediaSubTotal.impressions, '회')}</div>
                      <div style={{ padding: '10px 8px', textAlign: 'right' }}>{formatWithUnit(mediaSubTotal.reach, '회')}</div>
                      <div style={{ padding: '10px 8px', textAlign: 'right' }}>{formatWithUnit(parseFloat(mediaSubTotal.frequency), '회')}</div>
                      <div style={{ padding: '10px 8px', textAlign: 'right' }}>{mediaSubTotal.grp}</div>
                      <div style={{ padding: '10px 8px', textAlign: 'right' }}>{formatWithUnit(mediaSubTotal.cprp, '원')}</div>
                      <div style={{ padding: '10px 8px', textAlign: 'right' }} className={mediaSubTotal.reach1 === '-' ? 'text-muted-foreground' : ''}>{mediaSubTotal.reach1 !== '-' ? formatWithUnit(parseFloat(mediaSubTotal.reach1), '%') : '-'}</div>
                      <div style={{ padding: '10px 8px', textAlign: 'right' }} className={mediaSubTotal.reach2 === '-' ? 'text-muted-foreground' : ''}>{mediaSubTotal.reach2 !== '-' ? formatWithUnit(parseFloat(mediaSubTotal.reach2), '%') : '-'}</div>
                      <div style={{ padding: '10px 8px', textAlign: 'right' }} className={mediaSubTotal.reach3 === '-' ? 'text-muted-foreground' : ''}>{mediaSubTotal.reach3 !== '-' ? formatWithUnit(parseFloat(mediaSubTotal.reach3), '%') : '-'}</div>
                      <div style={{ padding: '10px 8px', textAlign: 'right' }} className={mediaSubTotal.reach4 === '-' ? 'text-muted-foreground' : ''}>{mediaSubTotal.reach4 !== '-' ? formatWithUnit(parseFloat(mediaSubTotal.reach4), '%') : '-'}</div>
                      <div style={{ padding: '10px 8px', textAlign: 'right' }} className={mediaSubTotal.reach5 === '-' ? 'text-muted-foreground' : ''}>{mediaSubTotal.reach5 !== '-' ? formatWithUnit(parseFloat(mediaSubTotal.reach5), '%') : '-'}</div>
                    </div>

                    {/* 3depth: Products */}
                    {isMediaExpanded && detailedData[category][media].map((product: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '80px 1fr 140px 120px 120px 100px 100px 120px 100px 100px 100px 100px 100px',
                          backgroundColor: 'hsl(var(--background))',
                          borderBottom: '1px solid hsl(var(--border))',
                          fontSize: '11px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--background))'}
                      >
                        <div style={{ padding: '8px' }}></div>
                        <div style={{ padding: '8px', paddingLeft: '48px' }} className="text-muted-foreground">{product.product}</div>
                        <div style={{ padding: '8px', textAlign: 'right' }}>{formatWithUnit(product.budget, '원')}</div>
                        <div style={{ padding: '8px', textAlign: 'right' }}>{formatWithUnit(product.impressions, '회')}</div>
                        <div style={{ padding: '8px', textAlign: 'right' }}>{formatWithUnit(product.reach, '회')}</div>
                        <div style={{ padding: '8px', textAlign: 'right' }}>{formatWithUnit(parseFloat(product.frequency), '회')}</div>
                        <div style={{ padding: '8px', textAlign: 'right' }}>{product.grp}</div>
                        <div style={{ padding: '8px', textAlign: 'right' }}>{formatWithUnit(product.cprp, '원')}</div>
                        <div style={{ padding: '8px', textAlign: 'right' }} className={product.reach1 === '-' ? 'text-muted-foreground' : ''}>{product.reach1 !== '-' ? formatWithUnit(parseFloat(product.reach1), '%') : '-'}</div>
                        <div style={{ padding: '8px', textAlign: 'right' }} className={product.reach2 === '-' ? 'text-muted-foreground' : ''}>{product.reach2 !== '-' ? formatWithUnit(parseFloat(product.reach2), '%') : '-'}</div>
                        <div style={{ padding: '8px', textAlign: 'right' }} className={product.reach3 === '-' ? 'text-muted-foreground' : ''}>{product.reach3 !== '-' ? formatWithUnit(parseFloat(product.reach3), '%') : '-'}</div>
                        <div style={{ padding: '8px', textAlign: 'right' }} className={product.reach4 === '-' ? 'text-muted-foreground' : ''}>{product.reach4 !== '-' ? formatWithUnit(parseFloat(product.reach4), '%') : '-'}</div>
                        <div style={{ padding: '8px', textAlign: 'right' }} className={product.reach5 === '-' ? 'text-muted-foreground' : ''}>{product.reach5 !== '-' ? formatWithUnit(parseFloat(product.reach5), '%') : '-'}</div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )
        })}

        {/* Estimated Total */}
        {(() => {
          const grandTotal = calculateGrandTotal()
          return (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 140px 120px 120px 100px 100px 120px 100px 100px 100px 100px 100px',
                backgroundColor: 'hsl(var(--primary) / 0.15)',
                borderTop: '3px solid hsl(var(--primary))',
                fontSize: '14px',
                fontWeight: '800'
              }}
            >
              <div style={{ padding: '14px 8px' }}></div>
              <div style={{ padding: '14px 8px', letterSpacing: '0.02em' }}>Estimated Total</div>
              <div style={{ padding: '14px 8px', textAlign: 'right' }}>{formatWithUnit(grandTotal.budget, '원')}</div>
              <div style={{ padding: '14px 8px', textAlign: 'right' }}>{formatWithUnit(grandTotal.impressions, '회')}</div>
              <div style={{ padding: '14px 8px', textAlign: 'right' }}>{formatWithUnit(grandTotal.reach, '회')}</div>
              <div style={{ padding: '14px 8px', textAlign: 'right' }}>{formatWithUnit(grandTotal.frequency, '회')}</div>
              <div style={{ padding: '14px 8px', textAlign: 'right' }}>{grandTotal.grp}</div>
              <div style={{ padding: '14px 8px', textAlign: 'right' }}>{formatWithUnit(grandTotal.cprp, '원')}</div>
              <div style={{ padding: '14px 8px', textAlign: 'right' }}>{formatWithUnit(grandTotal.reach1, '%')}</div>
              <div style={{ padding: '14px 8px', textAlign: 'right' }}>{formatWithUnit(grandTotal.reach2, '%')}</div>
              <div style={{ padding: '14px 8px', textAlign: 'right' }}>{formatWithUnit(grandTotal.reach3, '%')}</div>
              <div style={{ padding: '14px 8px', textAlign: 'right' }}>{formatWithUnit(grandTotal.reach4, '%')}</div>
              <div style={{ padding: '14px 8px', textAlign: 'right' }}>{formatWithUnit(grandTotal.reach5, '%')}</div>
            </div>
          )
        })()}
          </div>
        </div>
    </div>
  )
}
