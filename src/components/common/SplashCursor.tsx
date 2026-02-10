import { useEffect, useState } from 'react'

interface Splash {
  id: number
  x: number
  y: number
}

export function SplashCursor() {
  const [splashes, setSplashes] = useState<Splash[]>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newSplash: Splash = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      }

      setSplashes(prev => [...prev, newSplash])

      // 애니메이션 후 제거
      setTimeout(() => {
        setSplashes(prev => prev.filter(splash => splash.id !== newSplash.id))
      }, 1000)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 9999
    }}>
      {splashes.map(splash => (
        <div
          key={splash.id}
          style={{
            position: 'absolute',
            left: splash.x,
            top: splash.y,
            width: '0px',
            height: '0px'
          }}
        >
          {/* Multiple ripples for depth */}
          {[0, 1, 2].map(index => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '20px',
                height: '20px',
                marginLeft: '-10px',
                marginTop: '-10px',
                borderRadius: '50%',
                border: '2px solid hsl(var(--primary))',
                opacity: 0,
                animation: `splashRipple 1s cubic-bezier(0, 0, 0.2, 1) forwards`,
                animationDelay: `${index * 0.1}s`
              }}
            />
          ))}
          
          {/* Center dot */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '8px',
              height: '8px',
              marginLeft: '-4px',
              marginTop: '-4px',
              borderRadius: '50%',
              backgroundColor: 'hsl(var(--primary))',
              opacity: 0,
              animation: 'splashDot 0.6s cubic-bezier(0, 0, 0.2, 1) forwards'
            }}
          />
        </div>
      ))}
      
      <style>{`
        @keyframes splashRipple {
          0% {
            width: 20px;
            height: 20px;
            marginLeft: -10px;
            marginTop: -10px;
            opacity: 0.8;
          }
          100% {
            width: 100px;
            height: 100px;
            marginLeft: -50px;
            marginTop: -50px;
            opacity: 0;
          }
        }
        
        @keyframes splashDot {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
