import { useState, useEffect } from 'react'
import { MoreVertical, Edit, Trash2, Info } from 'lucide-react'

interface SlotHeaderProps {
  slotId: number
  slotData: {
    title: string
    advertiser: string
    advertiserId: string
    visibility: string
    description: string
    modified: string
  }
  onEdit?: () => void
  onDelete?: () => void
}

export function SlotHeader({ slotId, slotData, onEdit, onDelete }: SlotHeaderProps) {
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown') && !target.closest('[data-context-menu]')) {
        setContextMenuOpen(false)
      }
      if (!target.closest('[data-info-tooltip]')) {
        setInfoTooltipOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="slot-detail-header">
      <div className="slot-detail-header__main">
        <div className="slot-detail-header__info">
          {/* 첫 번째 줄: 가시성 뱃지만 */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: 'hsl(var(--muted))',
              color: 'hsl(var(--muted-foreground))'
            }}>
              {slotData.visibility}
            </span>
          </div>
          
          {/* 두 번째 줄: Slot 타이틀 */}
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            {slotData.title}
          </h1>
          
          {/* 세 번째 줄: 광고주 프로필 + 설명 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            {/* 광고주 프로필 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: slotData.advertiser === '삼성전자' ? '#1f77b4' :
                                 slotData.advertiser === 'LG전자' ? '#ff7f0e' :
                                 slotData.advertiser === '현대자동차' ? '#2ca02c' :
                                 slotData.advertiser === '네이버' ? '#d62728' :
                                 slotData.advertiser === '카카오' ? '#9467bd' :
                                 slotData.advertiser === '쿠팡' ? '#8c564b' :
                                 slotData.advertiser === 'SK텔레콤' ? '#e377c2' :
                                 slotData.advertiser === 'KT' ? '#7f7f7f' :
                                 slotData.advertiser === 'LG유플러스' ? '#bcbd22' :
                                 slotData.advertiser === '롯데마트' ? '#17becf' :
                                 slotData.advertiser === '이마트' ? '#ff9896' :
                                 slotData.advertiser === '홈플러스' ? '#98df8a' :
                                 slotData.advertiser === 'CJ올리브영' ? '#ffbb78' :
                                 slotData.advertiser === '신세계백화점' ? '#c5b0d5' :
                                 slotData.advertiser === '현대백화점' ? '#c49c94' :
                                 slotData.advertiser === '갤러리아백화점' ? '#f7b6d3' :
                                 slotData.advertiser === 'AK플라자' ? '#c7c7c7' :
                                 slotData.advertiser === '롯데백화점' ? '#dbdb8d' :
                                 slotData.advertiser === 'GS25' ? '#9edae5' :
                                 slotData.advertiser === 'CU' ? '#393b79' :
                                 slotData.advertiser === '세븐일레븐' ? '#637939' :
                                 slotData.advertiser === '이디야커피' ? '#8c6d31' :
                                 slotData.advertiser === '스타벅스' ? '#843c39' :
                                 slotData.advertiser === '투썸플레이스' ? '#7b4173' :
                                 slotData.advertiser === '맥도날드' ? '#5254a3' : '#6b6ecf',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
                flexShrink: 0
              }}>
                {slotData.advertiser.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{slotData.advertiser}</div>
                <div className="text-muted-foreground" style={{ fontSize: '11px' }}>ID: {slotData.advertiserId}</div>
              </div>
            </div>
            
            {/* 구분선 */}
            <div style={{ 
              width: '1px', 
              height: '32px', 
              backgroundColor: 'hsl(var(--border))' 
            }} />
            
            {/* 설명 */}
            <p className="text-muted-foreground" style={{ fontSize: '14px', margin: 0, flex: 1 }}>
              {slotData.description}
            </p>
          </div>
        </div>

        {/* 우측 액션 버튼들 */}
        <div className="slot-detail-header__actions" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          {/* Info 아이콘 - Slot ID, 생성/수정 정보 툴팁 */}
          <div style={{ position: 'relative' }}>
            <button
              data-info-tooltip
              onMouseEnter={() => setInfoTooltipOpen(true)}
              onMouseLeave={() => setInfoTooltipOpen(false)}
              className="btn btn-ghost btn-md"
              style={{ padding: '8px' }}
            >
              <Info size={18} />
            </button>
            
            {infoTooltipOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '280px',
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                zIndex: 1000
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>Slot ID</div>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>#{slotId}</div>
                </div>
                
                <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '8px 0' }} />
                
                <div style={{ marginBottom: '12px' }}>
                  <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>생성일시</div>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>2024-01-15 14:30</div>
                  <div className="text-muted-foreground" style={{ fontSize: '12px' }}>김철수 (USER001)</div>
                </div>
                
                <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '8px 0' }} />
                
                <div>
                  <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>최근 수정일시</div>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>{slotData.modified} 16:45</div>
                  <div className="text-muted-foreground" style={{ fontSize: '12px' }}>이영희 (USER002)</div>
                </div>
              </div>
            )}
          </div>
          
          {/* 관리 메뉴 */}
          <div style={{ position: 'relative' }}>
            <button
              data-context-menu
              onClick={(e) => {
                e.stopPropagation()
                setContextMenuOpen(!contextMenuOpen)
              }}
              className="btn btn-ghost btn-md"
              style={{ padding: '8px' }}
            >
              <MoreVertical size={18} />
            </button>
            
            {contextMenuOpen && (
              <div className="dropdown" style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                width: '120px',
                zIndex: 1000
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setContextMenuOpen(false)
                    onEdit?.()
                  }}
                  className="dropdown-item"
                >
                  <Edit size={14} />
                  수정
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setContextMenuOpen(false)
                    onDelete?.()
                  }}
                  className="dropdown-item"
                >
                  <Trash2 size={14} />
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}