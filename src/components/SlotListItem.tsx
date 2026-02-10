import { MoreVertical, Edit, Trash2 } from 'lucide-react'
import { Avatar } from './common/Avatar'

interface SlotData {
  id: string
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

interface SlotListItemProps {
  slot: SlotData
  isSelected: boolean
  contextMenuOpen: boolean
  onSlotClick: (slot: SlotData) => void
  onCheckboxChange: (slot: SlotData, checked: boolean) => void
  onContextMenuToggle: (slotTitle: string) => void
  onContextMenuAction: (slotTitle: string, action: 'edit' | 'delete') => void
}

export function SlotListItem({ 
  slot, 
  isSelected,
  contextMenuOpen, 
  onSlotClick, 
  onCheckboxChange,
  onContextMenuToggle, 
  onContextMenuAction 
}: SlotListItemProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 100px 1fr 150px 120px 100px 120px 40px',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 24px',
        borderBottom: '1px solid hsl(var(--border))',
        backgroundColor: isSelected ? 'hsl(var(--accent))' : 'transparent',
        transition: 'all 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'transparent'
        }
      }}
    >
      {/* Checkbox */}
      <div onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onCheckboxChange(slot, e.target.checked)}
          className="checkbox-custom"
          style={{
            width: '18px',
            height: '18px',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Slot ID */}
      <div 
        onClick={() => onSlotClick(slot)}
        style={{
          fontSize: '12px',
          fontWeight: '500',
          fontFamily: 'Paperlogy, sans-serif'
        }} 
        className="text-muted-foreground"
      >
        {slot.id}
      </div>

      {/* Title */}
      <div 
        onClick={() => onSlotClick(slot)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: 0
        }}
      >
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }} className="text-foreground">
          {slot.title}
        </div>
        <div style={{
          fontSize: '12px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }} className="text-muted-foreground">
          {slot.description}
        </div>
      </div>

      {/* Advertiser */}
      <div 
        onClick={() => onSlotClick(slot)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Avatar 
          name={slot.advertiser}
          type="advertiser"
          size={20}
        />
        <span style={{ 
          fontSize: '13px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }} className="text-foreground">
          {slot.advertiser}
        </span>
      </div>

      {/* Visibility */}
      <div onClick={() => onSlotClick(slot)}>
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

      {/* Results */}
      <div 
        onClick={() => onSlotClick(slot)}
        style={{
          fontSize: '13px',
          fontWeight: '500',
          textAlign: 'center'
        }} 
        className="text-foreground"
      >
        {slot.results}
      </div>

      {/* Modified Date */}
      <div 
        onClick={() => onSlotClick(slot)}
        style={{
          fontSize: '13px'
        }} 
        className="text-muted-foreground"
      >
        {slot.modified}
      </div>

      {/* Context Menu */}
      <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
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
    </div>
  )
}
