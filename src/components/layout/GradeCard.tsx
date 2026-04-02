import { useState, useEffect, useRef } from 'react'
import { ChevronRight, Award, Flame, Lock, Zap, Activity, Target, Crown, Star, Rocket, Hourglass, PartyPopper } from 'lucide-react'

const grades = [
  { name: 'Slot-In Ready', icon: Zap, description: 'ReadySet의 잠재력을 탐색 중인 예비 전략가.' },
  { name: 'Active Slotter', icon: Activity, description: '데이터의 흐름을 만들기 시작한 실무 전략가.' },
  { name: 'Strategy Builder', icon: Target, description: '개별 솔루션을 조합해 전략의 기틀을 잡는 숙련가' },
  { name: 'Solution Expert', icon: Award, description: '플랫폼을 완벽히 활용해 최적의 해답을 도출하는 전문가.' },
  { name: 'Master Architect', icon: Crown, description: '복잡한 시나리오를 구조화하여 전략 생태계를 구축한 마스터.' },
  { name: 'ReadySet Visionary', icon: Star, description: '플랫폼의 한계를 넘어 전략의 새 지평을 여는 독보적 선구자.' },
]

const currentGrade = {
  name: 'Strategy Builder',
  icon: Target,
  description: '개별 솔루션을 조합해 전략의 기틀을 잡는 숙련가'
}

export function GradeCard() {
  const [showGradeTooltip, setShowGradeTooltip] = useState(false)
  const [animatedFill, setAnimatedFill] = useState(0)
  const gradeRef = useRef<HTMLDivElement>(null)

  const currentGradeIndex = grades.findIndex(g => g.name === currentGrade.name)
  const nextGrade = currentGradeIndex < grades.length - 1 ? grades[currentGradeIndex + 1] : null

  useEffect(() => {
    if (showGradeTooltip) {
      setAnimatedFill(0)
      const timer = setTimeout(() => {
        const start = 31, end = 81, current = 48
        setAnimatedFill(Math.round(((current - start) / (end - start)) * 100))
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setAnimatedFill(0)
    }
  }, [showGradeTooltip])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gradeRef.current && !gradeRef.current.contains(event.target as Node)) {
        setShowGradeTooltip(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={gradeRef}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        cursor: 'pointer', padding: '6px 12px', borderRadius: '16px',
        transition: 'all 0.2s', position: 'relative'
      }}
      onClick={() => setShowGradeTooltip(!showGradeTooltip)}
    >
      <currentGrade.icon size={16} style={{ color: 'hsl(var(--primary-foreground))' }} />
      <span style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--primary-foreground))' }}>
        {currentGrade.name}
      </span>

      {showGradeTooltip && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: '8px',
          backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border) / 0.6)',
          borderRadius: '16px', padding: '0', width: '280px',
          boxShadow: '0 16px 40px 0 rgb(0 0 0 / 0.12)', zIndex: 1000, overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
        >
          {/* ① 등급 + Next + Set Power */}
          <div style={{ padding: '20px 20px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <currentGrade.icon size={16} style={{ color: 'hsl(var(--foreground))' }} />
              <span style={{ fontSize: '15px', fontWeight: '700' }} className="text-foreground">{currentGrade.name}</span>
            </div>
            <div style={{ fontSize: '11px', lineHeight: '1.4', marginTop: '4px' }} className="text-muted-foreground">
              {currentGrade.description}
            </div>

            {nextGrade && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginTop: '10px' }} className="text-muted-foreground">
                <span>Next Level</span>
                <ChevronRight size={10} />
                <nextGrade.icon size={12} style={{ color: 'hsl(var(--foreground))' }} />
                <span style={{ fontWeight: '600', fontSize: '11px' }} className="text-foreground">{nextGrade.name}</span>
              </div>
            )}

            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid hsl(var(--border) / 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'hsl(var(--foreground))' }}>Let's Level Up!</span>
                <span style={{ display: 'inline-flex' }}><Rocket size={13} style={{ color: 'hsl(var(--primary))' }} /></span>
              </div>

              {/* 미션 1 */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '8px', fontWeight: '600', color: 'hsl(var(--muted-foreground))' }}>Mission 1</span>
                  <span style={{ fontSize: '9px', fontWeight: '500', color: 'hsl(var(--primary))', backgroundColor: 'hsl(var(--primary) / 0.1)', padding: '1px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px', minWidth: '52px', justifyContent: 'center' }}>
                    In Progress
                    <Hourglass size={9} style={{ display: 'inline-block', animation: 'hourglassFlip 3s ease-in-out infinite' }} />
                  </span>
                </div>
                <div style={{ fontSize: '10px', fontWeight: '500', color: 'hsl(var(--foreground))', marginBottom: '4px' }}>Scale Your Results</div>
                <div style={{ fontSize: '9px', lineHeight: '1.5' }} className="text-muted-foreground">총 80개의 결과물을 확보하세요.</div>
                <div style={{ position: 'relative', marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
                    <span style={{ fontSize: '8px' }} className="text-muted-foreground">48/80 to next level</span>
                  </div>
                  <div style={{ position: 'relative', height: '4px', borderRadius: '2px', backgroundColor: 'hsl(var(--muted))', overflow: 'visible' }}>
                    <div style={{ width: `${animatedFill}%`, height: '100%', borderRadius: '2px', backgroundColor: 'hsl(var(--primary))', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                    {[25, 50, 75].map(milestone => {
                      const reached = animatedFill >= milestone
                      return (
                        <div key={milestone} style={{
                          position: 'absolute', left: `${milestone}%`, top: 0,
                          width: '1px', height: '100%',
                          backgroundColor: 'hsl(var(--card) / 0.6)',
                          zIndex: 1
                        }} />
                      )
                    })}
                  </div>
                  <div style={{ fontSize: '8px', color: 'hsl(var(--primary))', marginTop: '4px' }}>
                    {animatedFill >= 75 ? '거의 다 왔어요!' : animatedFill >= 50 ? '절반을 넘었어요!' : animatedFill >= 25 ? '좋은 출발이에요!' : '시작이 반이에요!'}
                  </div>
                </div>
              </div>

              {/* 미션 2 */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '8px', fontWeight: '600', color: 'hsl(var(--muted-foreground))' }}>Mission 2</span>
                  <span style={{ fontSize: '9px', fontWeight: '500', color: 'hsl(var(--primary))', backgroundColor: 'hsl(var(--primary) / 0.1)', padding: '1px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px', minWidth: '52px', justifyContent: 'center', animation: 'softBounce 2s ease-in-out infinite' }}>
                    Complete
                    <PartyPopper size={9} />
                  </span>
                </div>
                <div style={{ fontSize: '10px', fontWeight: '500', color: 'hsl(var(--foreground))', marginBottom: '4px' }}>Expand Your Solution Stack</div>
                <div style={{ fontSize: '9px', lineHeight: '1.5' }} className="text-muted-foreground">2개 이상의 솔루션을 사용하여 불꽃을 밝히세요.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                  {[
                    { name: 'DataShot', color: '#7B61FF', done: true },
                    { name: 'Reach Caster', color: '#00C8FF', done: true },
                    { name: 'Ad Curator', color: '#00E676', done: false },
                    { name: 'Budget Optimizer', color: '#FF3B7A', done: false },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: s.done ? 1 : 0.4 }}>
                      {s.done
                        ? <Flame size={12} fill={s.color} style={{ color: s.color, flexShrink: 0, animation: 'flameFlicker 1.5s ease-in-out infinite' }} />
                        : <Lock size={12} style={{ color: 'hsl(var(--muted-foreground))', flexShrink: 0 }} />
                      }
                      <span style={{ fontSize: '10px', color: s.done ? '#737373' : 'hsl(var(--muted-foreground))' }}>{s.name}</span>
                      {!s.done && <span style={{ fontSize: '8px', color: 'hsl(var(--muted-foreground))' }}>(준비중)</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
