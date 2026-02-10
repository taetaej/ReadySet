import React from 'react'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <header className="workspace-main-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight size={14} className="text-muted-foreground" />
            )}
            {item.href || item.onClick ? (
              <button
                onClick={() => {
                  if (item.onClick) {
                    item.onClick()
                  } else {
                    // 네비게이션 로직 추가 예정
                    console.log('Navigate to:', item.href)
                  }
                }}
                style={{ 
                  fontSize: '14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </button>
            ) : (
              <span 
                style={{ fontSize: '14px', fontWeight: '500' }}
                className="text-foreground"
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </header>
  )
}