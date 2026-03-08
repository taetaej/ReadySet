interface DisabledSelectBoxProps {
  message: string
}

export function DisabledSelectBox({ message }: DisabledSelectBoxProps) {
  return (
    <div style={{
      width: '800px',
      height: '36px',
      padding: '8px 12px',
      border: '1px solid hsl(var(--border))',
      borderRadius: '6px',
      backgroundColor: 'hsl(var(--muted) / 0.3)',
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
      <span style={{ fontSize: '14px', lineHeight: '16.5px', color: '#737373' }}>
        {message}
      </span>
    </div>
  )
}
