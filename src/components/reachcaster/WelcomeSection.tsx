import { SplitText } from './common/SplitText'

interface WelcomeSectionProps {
  userName?: string
}

export function WelcomeSection({ userName = 'Jia Shin' }: WelcomeSectionProps) {
  return (
    <section style={{
      padding: '32px 24px 0 24px'
    }}>
      {/* Greeting */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          margin: '0 0 8px 0',
          color: 'hsl(var(--foreground))',
          letterSpacing: '-0.5px'
        }}>
          <SplitText text="Hello, " />
          <SplitText 
            text={userName}
            style={{ color: 'hsl(var(--primary))' }}
            delay={210}
          />
          <SplitText text="!" delay={390} />
        </h1>
        <p style={{
          fontSize: '14px',
          fontWeight: '400',
          margin: 0,
          lineHeight: '1.5'
        }} className="text-muted-foreground">
          Welcome to ReadySet Platform. Maximize your ad performance with full-slot strategies!
        </p>
      </div>

      {/* Bento Boxes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '5fr 3fr 2fr',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Bento Box 1 */}
        <div className="card" style={{
          padding: '24px',
          minHeight: '180px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: 'none'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }} className="text-muted-foreground">
            Content 1
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '600'
          }} className="text-foreground">
            Coming Soon
          </div>
        </div>

        {/* Bento Box 2 */}
        <div className="card" style={{
          padding: '24px',
          minHeight: '180px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: 'none'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }} className="text-muted-foreground">
            Content 2
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '600'
          }} className="text-foreground">
            Coming Soon
          </div>
        </div>

        {/* Bento Box 3 */}
        <div className="card" style={{
          padding: '24px',
          minHeight: '180px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: 'none'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }} className="text-muted-foreground">
            Content 3
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '600'
          }} className="text-foreground">
            Coming Soon
          </div>
        </div>
      </div>
    </section>
  )
}
