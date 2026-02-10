import { Plus } from 'lucide-react'

interface PageHeaderProps {
  title: string
  onCreateSlot: () => void
  totalResults?: number
  benchmarkResults?: number
  adCuratorResults?: number
  budgetOptimizerResults?: number
  reachCasterResults?: number
  isManagementMode?: boolean
}

export function PageHeader({ 
  title, 
  onCreateSlot, 
  totalResults = 0, 
  benchmarkResults = 0, 
  adCuratorResults = 0,
  budgetOptimizerResults = 0,
  reachCasterResults = 0,
  isManagementMode
}: PageHeaderProps) {
  return (
    <div style={{
      padding: '32px 24px 32px 24px',
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '32px'
    }}>
      {/* 타이틀 */}
      <h1 style={{
        fontSize: '36px',
        fontWeight: '700',
        margin: 0,
        color: 'hsl(var(--foreground))',
        letterSpacing: '-0.5px'
      }}>
        {title}
      </h1>

      {/* New Slot 버튼 - 관리 모드가 아닐 때만 표시 */}
      {!isManagementMode && (
        <button 
          onClick={onCreateSlot}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '24px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            height: '48px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <Plus size={18} />
          New Slot
        </button>
      )}

      {/* 집계 카드들 - 우측 정렬 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
        {/* Total Results */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 24px',
          backgroundColor: 'transparent',
          borderRadius: '16px',
          minWidth: '100px'
        }}>
          <div style={{
            fontSize: '28px',
            fontWeight: '500',
            lineHeight: '1',
            marginBottom: '4px'
          }} className="text-foreground">
            {totalResults}
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: '400'
          }} className="text-muted-foreground">
            Total Results
          </div>
        </div>

        {/* Data Shot Results */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 24px',
          backgroundColor: 'transparent',
          borderRadius: '16px',
          minWidth: '100px',
          opacity: 0.6
        }}>
          <div style={{
            fontSize: '28px',
            fontWeight: '500',
            lineHeight: '1',
            marginBottom: '4px'
          }} className="text-foreground">
            {benchmarkResults || 23}
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: '400'
          }} className="text-muted-foreground">
            Data Shot
          </div>
        </div>

        {/* Ad Curator Results */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 24px',
          backgroundColor: 'transparent',
          borderRadius: '16px',
          minWidth: '100px',
          opacity: 0.6
        }}>
          <div style={{
            fontSize: '28px',
            fontWeight: '500',
            lineHeight: '1',
            marginBottom: '4px'
          }} className="text-foreground">
            {adCuratorResults || 31}
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: '400'
          }} className="text-muted-foreground">
            Ad Curator
          </div>
        </div>

        {/* Budget Optimizer Results */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 24px',
          backgroundColor: 'transparent',
          borderRadius: '16px',
          minWidth: '100px',
          opacity: 0.6
        }}>
          <div style={{
            fontSize: '28px',
            fontWeight: '500',
            lineHeight: '1',
            marginBottom: '4px'
          }} className="text-foreground">
            {budgetOptimizerResults || 17}
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: '400'
          }} className="text-muted-foreground">
            Budget Optimizer
          </div>
        </div>

        {/* Reach Caster Results */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 24px',
          backgroundColor: 'transparent',
          borderRadius: '16px',
          minWidth: '100px'
        }}>
          <div style={{
            fontSize: '28px',
            fontWeight: '500',
            lineHeight: '1',
            marginBottom: '4px'
          }} className="text-foreground">
            {reachCasterResults}
          </div>
          <div style={{
            fontSize: '13px',
            fontWeight: '400'
          }} className="text-muted-foreground">
            Reach Caster
          </div>
        </div>
      </div>
    </div>
  )
}
