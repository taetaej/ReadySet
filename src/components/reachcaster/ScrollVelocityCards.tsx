import { useState, useRef, useEffect, useCallback } from 'react'
import {
  motion,
  useSpring,
  useTransform,
  useMotionValue
} from 'motion/react'
import { Database, Users, DollarSign, Target } from 'lucide-react'

interface CardData {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  color: string
  num: string
}

const SOLUTIONS: CardData[] = [
  { id: 'datashot', title: 'DataShot', subtitle: '업종 벤치마크 · 경쟁사 분석', icon: <Database size={20} />, color: '#00D9FF', num: '01' },
  { id: 'adcurator', title: 'Ad Curator', subtitle: '타겟 큐레이션 · 세그먼트', icon: <Users size={20} />, color: '#7B2FFF', num: '02' },
  { id: 'budget', title: 'Budget Optimizer', subtitle: '예산 최적화 · 배분 전략', icon: <DollarSign size={20} />, color: '#00FF94', num: '03' },
  { id: 'reachcaster', title: 'Reach Caster', subtitle: '도달률 예측 · 매체 비중', icon: <Target size={20} />, color: '#FFD600', num: '04' },
]

const CARD_W = 260
const CARD_H = 340

// 각 카드의 기본 3D 배치 — 가로로 넓게 퍼뜨리고 높이/깊이 엇갈림
const BASE_TRANSFORMS = [
  { y: 30, z: -40, rotY: -8, rotZ: -1.5 },
  { y: -20, z: 20, rotY: -3, rotZ: 0.5 },
  { y: 10, z: 50, rotY: 3, rotZ: -0.5 },
  { y: -40, z: -20, rotY: 8, rotZ: 1.5 },
]

export function ScrollVelocityCards() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const velocity = useMotionValue(0)
  const lastWheelTime = useRef(0)
  const decayRaf = useRef<number>(0)

  // wheel 이벤트로 속도 추적
  const handleWheel = useCallback((e: WheelEvent) => {
    // 속도 설정 (deltaY 기반)
    velocity.set(e.deltaY * 3)
    lastWheelTime.current = Date.now()

    // 기존 decay 취소
    if (decayRaf.current) cancelAnimationFrame(decayRaf.current)

    // 감쇠 루프
    const decay = () => {
      const elapsed = Date.now() - lastWheelTime.current
      if (elapsed > 50) {
        const current = velocity.get()
        const next = current * 0.92
        velocity.set(Math.abs(next) < 0.5 ? 0 : next)
        if (Math.abs(next) > 0.5) {
          decayRaf.current = requestAnimationFrame(decay)
        }
      } else {
        decayRaf.current = requestAnimationFrame(decay)
      }
    }
    decayRaf.current = requestAnimationFrame(decay)
  }, [velocity])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    // passive: false로 해야 preventDefault 가능하지만, 여기선 스크롤 막지 않음
    el.addEventListener('wheel', handleWheel, { passive: true })
    return () => {
      el.removeEventListener('wheel', handleWheel)
      if (decayRaf.current) cancelAnimationFrame(decayRaf.current)
    }
  }, [handleWheel])

  // 부드러운 속도
  const smoothVelocity = useSpring(velocity, {
    stiffness: 150,
    damping: 20,
    mass: 0.5
  })

  // 속도 → wave 강도
  const waveIntensity = useTransform(smoothVelocity, [-600, 0, 600], [-14, 0, 14])

  // 속도 → 전체 미세 skew
  const globalSkewY = useTransform(smoothVelocity, [-600, 0, 600], [-1.5, 0, 1.5])

  return (
    <div
      ref={sectionRef}
      style={{
        width: '100%',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
        padding: '40px 0'
      }}
    >
      <motion.div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(4, ${CARD_W}px)`,
          gap: '28px',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          skewY: globalSkewY
        }}
      >
        {SOLUTIONS.map((card, i) => (
          <PlaneCard
            key={card.id}
            card={card}
            index={i}
            baseTransform={BASE_TRANSFORMS[i]}
            waveIntensity={waveIntensity}
            smoothVelocity={smoothVelocity}
          />
        ))}
      </motion.div>
    </div>
  )
}

interface PlaneCardProps {
  card: CardData
  index: number
  baseTransform: { y: number; z: number; rotY: number; rotZ: number }
  waveIntensity: any
  smoothVelocity: any
}

function PlaneCard({ card, index, baseTransform, waveIntensity, smoothVelocity }: PlaneCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // wave: 인덱스별 위상차로 rotateX
  const phases = [0, 0.35, 0.7, 1.0]
  const rotateX = useTransform(waveIntensity, (wave: number) => {
    return wave * (0.7 + phases[index])
  })

  // 속도에 따른 Y 패럴랙스 (깊이별 차등)
  const depthFactor = 1 + baseTransform.z / 200
  const velocityY = useTransform(smoothVelocity, [-600, 0, 600], [
    -12 * depthFactor, 0, 12 * depthFactor
  ])
  const smoothY = useSpring(velocityY, { stiffness: 200, damping: 22 })

  // 기본 Y + 패럴랙스 Y 합산
  const combinedY = useTransform(smoothY, (vy: number) => baseTransform.y + vy)

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        transformStyle: 'preserve-3d',
        y: combinedY,
        z: baseTransform.z,
        rotateX,
        rotateY: baseTransform.rotY,
        rotateZ: baseTransform.rotZ,
        borderRadius: '16px',
        border: '1px solid hsl(var(--border) / 0.5)',
        backgroundColor: 'hsl(var(--card))',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        willChange: 'transform'
      }}
      animate={{
        scale: isHovered ? 1.05 : 1,
        z: isHovered ? baseTransform.z + 80 : baseTransform.z,
        boxShadow: isHovered
          ? `0 20px 50px rgba(0,0,0,0.25), 0 0 0 1px ${card.color}40`
          : '0 8px 24px rgba(0,0,0,0.1)'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* 상단 컬러 라인 */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${card.color}, ${card.color}60)`,
        opacity: isHovered ? 1 : 0.6,
        transition: 'opacity 0.3s'
      }} />

      {/* 넘버링 */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        fontSize: '11px',
        fontWeight: '500',
        color: 'hsl(var(--muted-foreground) / 0.4)',
        fontFamily: 'Paperlogy, sans-serif'
      }}>
        {card.num}
      </div>

      {/* 카드 내용 */}
      <div style={{
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {/* 아이콘 */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          backgroundColor: `${card.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: card.color,
          marginBottom: '28px'
        }}>
          {card.icon}
        </div>

        {/* 타이틀 */}
        <div style={{
          fontSize: '18px',
          fontWeight: '700',
          fontFamily: 'Paperlogy, sans-serif',
          color: 'hsl(var(--foreground))',
          marginBottom: '8px',
          letterSpacing: '-0.02em'
        }}>
          {card.title}
        </div>

        {/* 서브타이틀 */}
        <div style={{
          fontSize: '12px',
          color: 'hsl(var(--muted-foreground))',
          fontFamily: 'Paperlogy, sans-serif',
          lineHeight: '1.5'
        }}>
          {card.subtitle}
        </div>

        {/* 하단 장식 */}
        <div style={{
          marginTop: 'auto',
          height: '1px',
          background: `linear-gradient(90deg, ${card.color}25, transparent)`,
          width: '50%'
        }} />
      </div>
    </motion.div>
  )
}
