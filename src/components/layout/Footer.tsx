import React from 'react'

export function Footer() {
  return (
    <footer className="workspace-footer" style={{ 
      borderTop: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      minHeight: '56px'
    }}>
      <div style={{ fontSize: '12px' }} className="text-muted-foreground">
        © 2026 CJ Mezzomedia. All rights reserved.
      </div>
      <div style={{ fontSize: '11px' }} className="text-muted-foreground">
        ReadySet Platform v1.0
      </div>
    </footer>
  )
}