import React from 'react'

export function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '64px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px', color: 'hsl(var(--foreground))' }}>{title}</h2>
        <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>{description}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>{children}</div>
    </div>
  )
}

export function ComponentGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px', color: 'hsl(var(--foreground))' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>{children}</div>
    </div>
  )
}
