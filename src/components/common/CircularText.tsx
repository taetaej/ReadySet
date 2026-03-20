import { useEffect } from 'react'
import { motion, useAnimation, useMotionValue } from 'motion/react'
import type { MotionValue, Transition } from 'motion/react'

interface CircularTextProps {
  text: string
  spinDuration?: number
  onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers'
  className?: string
  size?: number
}

const getRotationTransition = (duration: number, from: number, loop: boolean = true) => ({
  from,
  to: from + 360,
  ease: 'linear' as const,
  duration,
  type: 'tween' as const,
  repeat: loop ? Infinity : 0
})

const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 300
  }
})

export function CircularText({
  text,
  spinDuration = 20,
  onHover = 'speedUp',
  className = '',
  size = 200
}: CircularTextProps) {
  const letters = Array.from(text)
  const controls = useAnimation()
  const rotation: MotionValue<number> = useMotionValue(0)

  useEffect(() => {
    const start = rotation.get()
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    })
  }, [spinDuration, text, onHover, controls])

  const handleHoverStart = () => {
    const start = rotation.get()
    if (!onHover) return

    let transitionConfig: ReturnType<typeof getTransition> | Transition
    let scaleVal = 1

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2, start)
        break
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4, start)
        break
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring', damping: 20, stiffness: 300 },
          scale: { type: 'spring', damping: 20, stiffness: 300 }
        }
        break
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20, start)
        scaleVal = 0.8
        break
      default:
        transitionConfig = getTransition(spinDuration, start)
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig
    })
  }

  const handleHoverEnd = () => {
    const start = rotation.get()
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    })
  }

  return (
    <motion.div
      className={className}
      style={{
        margin: 0,
        borderRadius: '9999px',
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        fontWeight: 900,
        textAlign: 'center',
        cursor: 'pointer',
        transformOrigin: 'center',
        rotate: rotation
      }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i
        const factor = Math.PI / letters.length
        const x = factor * i
        const y = factor * i
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`

        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              display: 'inline-block',
              inset: 0,
              fontSize: `${Math.max(14, size / 8)}px`,
              transition: 'all 500ms cubic-bezier(0,0,0,1)',
              transform,
              WebkitTransform: transform,
              fontFamily: 'Paperlogy, sans-serif',
              color: 'inherit'
            }}
          >
            {letter}
          </span>
        )
      })}
    </motion.div>
  )
}
