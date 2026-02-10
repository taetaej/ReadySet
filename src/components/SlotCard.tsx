import { Archive, Clock, MoreVertical, Edit, Trash2, CheckCircle } from 'lucide-react'

interface SlotData {
  title: string
  advertiser: string
  advertiserId: string
  visibility: string
  results: number
  modified: string
  description: string
  solutions?: {
    reachCaster: number
    budgetOptimizer: number
    metricHub: number
  }
}

interface SlotCardProps {
  slot: SlotData
  isManagementMode: boolean
  isSelected: boolean
  contextMenuOpen: boolean
  onSlotClick: (slot: SlotData) => void
  onContextMenuToggle: (slotTitle: string) => void
  onContextMenuAction: (slotTitle: string, action: 'edit' | 'delete') => void
}

export function SlotCard({ 
  slot, 
  isManagementMode, 
  isSelected, 
  contextMenuOpen, 
  onSlotClick, 
  onContextMenuToggle, 
  onContextMenuAction 
}: SlotCardProps) {
  return (
    <div
      className="card"
      style={{
        padding: '24px 24px 20px 24px',
        minHeight: '200px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: isManagementMode && isSelected 
          ? '2px solid hsl(var(--primary))' 
          : '1px solid hsl(var(--border) / 0.9)',
        backgroundColor: isManagementMode && isSelected
          ? 'hsl(var(--primary) / 0.05)'
          : undefined, // CSS 클래스에서 처리
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', // Safari 지원
        boxShadow: undefined // CSS 클래스에서 처리
      }}
      onClick={() => onSlotClick(slot)}
      onMouseEnter={(e) => {
        if (!isManagementMode) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          // 호버 시 배경과 그림자는 CSS에서 처리하도록 제거
        }
      }}
      onMouseLeave={(e) => {
        if (!isManagementMode) {
          e.currentTarget.style.transform = 'translateY(0)'
          // 원래 상태로 복원은 CSS에서 처리하도록 제거
        }
      }}
    >
      {/* 상단 섹션 */}
      <div style={{ 
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        {/* Context Menu Button - 일반 모드에서만 표시 */}
        {!isManagementMode && (
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <button
              data-context-menu
              onClick={(e) => {
                e.stopPropagation()
                onContextMenuToggle(slot.title)
              }}
              className="btn btn-ghost btn-sm"
              style={{ padding: '4px' }}
            >
              <MoreVertical size={16} />
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
                    onContextMenuAction(slot.title, 'edit')
                  }}
                  className="dropdown-item"
                >
                  <Edit size={14} />
                  수정
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onContextMenuAction(slot.title, 'delete')
                  }}
                  className="dropdown-item"
                >
                  <Trash2 size={14} />
                  삭제
                </button>
              </div>
            )}
          </div>
        )}

        {/* 관리 모드에서 선택 표시 */}
        {isManagementMode && isSelected && (
          <div style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'hsl(var(--primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle size={16} style={{ color: 'hsl(var(--primary-foreground))' }} />
          </div>
        )}

        {/* Slot 제목 */}
        <div style={{ paddingRight: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Archive size={18} className="text-muted-foreground" style={{ marginTop: '2px', flexShrink: 0 }} />
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: 0,
              lineHeight: '1.4',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-word'
            }} className="text-foreground">
              {slot.title}
            </h3>
          </div>
        </div>

        {/* 광고주와 가시성 뱃지 - 상단 영역 하단에 배치 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* 광고주 프로필 동그라미 */}
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: slot.advertiser === '삼성전자' ? '#1f77b4' :
                               slot.advertiser === 'LG전자' ? '#ff7f0e' :
                               slot.advertiser === '현대자동차' ? '#2ca02c' :
                               slot.advertiser === '네이버' ? '#d62728' :
                               slot.advertiser === '카카오' ? '#9467bd' :
                               slot.advertiser === '쿠팡' ? '#8c564b' :
                               slot.advertiser === 'SK텔레콤' ? '#e377c2' :
                               slot.advertiser === 'KT' ? '#7f7f7f' :
                               slot.advertiser === 'LG유플러스' ? '#bcbd22' :
                               slot.advertiser === '롯데마트' ? '#17becf' :
                               slot.advertiser === '이마트' ? '#ff9896' :
                               slot.advertiser === '홈플러스' ? '#98df8a' :
                               slot.advertiser === 'CJ올리브영' ? '#ffbb78' :
                               slot.advertiser === '신세계백화점' ? '#c5b0d5' :
                               slot.advertiser === '현대백화점' ? '#c49c94' :
                               slot.advertiser === '갤러리아백화점' ? '#f7b6d3' :
                               slot.advertiser === 'AK플라자' ? '#c7c7c7' :
                               slot.advertiser === '롯데백화점' ? '#dbdb8d' :
                               slot.advertiser === 'GS25' ? '#9edae5' :
                               slot.advertiser === 'CU' ? '#393b79' :
                               slot.advertiser === '세븐일레븐' ? '#637939' :
                               slot.advertiser === '이디야커피' ? '#8c6d31' :
                               slot.advertiser === '스타벅스' ? '#843c39' :
                               slot.advertiser === '투썸플레이스' ? '#7b4173' :
                               slot.advertiser === '맥도날드' ? '#5254a3' : '#6b6ecf',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: '600',
              flexShrink: 0
            }}>
              {slot.advertiser.charAt(0)}
            </div>
            <span style={{ fontSize: '14px' }} className="text-muted-foreground">
              {slot.advertiser}
            </span>
          </div>
          <span style={{
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '12px',
            backgroundColor: 'hsl(var(--muted))',
            color: 'hsl(var(--muted-foreground))',
            fontWeight: '500'
          }}>
            {slot.visibility}
          </span>
        </div>
      </div>

      {/* 구분선 */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, hsl(var(--border)) 20%, hsl(var(--border)) 80%, transparent 100%)',
        margin: '20px 0',
        opacity: 0.6
      }} />

      {/* 하단 섹션 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        {/* 좌측: 결과물 개수와 수정일 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }} className="text-foreground">
              {slot.results} Results
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={12} className="text-muted-foreground" />
            <span style={{ fontSize: '12px' }} className="text-muted-foreground">
              {slot.modified}
            </span>
          </div>
        </div>

        {/* 우측: 헥사곤 솔루션 상태 - 숨김처리 */}
        {/* <div style={{ display: 'flex', alignItems: 'center' }}>
          <SolutionHexagons solutions={slot.solutions} />
        </div> */}
      </div>
    </div>
  )
}