import { useState, useEffect, useRef } from 'react'
import { ChevronRight, Award, Flame, Lock, Zap, Activity, Target, Crown, Star } from 'lucide-react'

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
  const [showCheck1, setShowCheck1] = useState(false)
  const [showCheck2, setShowCheck2] = useState(false)
  const gradeRef = useRef<HTMLDivElement>(null)

  const currentGradeIndex = grades.findIndex(g => g.name === currentGrade.name)
  const nextGrade = currentGradeIndex < grades.length - 1 ? grades[currentGradeIndex + 1] : null

  useEffect(() => {
    if (showGradeTooltip) {
      setAnimatedFill(0)
      setShowCheck1(false)
      setShowCheck2(false)
      const timer = setTimeout(() => {
        const start = 31, end = 81, current = 48
        setAnimatedFill(Math.round(((current - start) / (end - start)) * 100))
      }, 50)
      const check1Timer = setTimeout(() => setShowCheck1(true), 700)
      const check2Timer = setTimeout(() => setShowCheck2(true), 1100)
      return () => { clearTimeout(timer); clearTimeout(check1Timer); clearTimeout(check2Timer) }
    } else {
      setAnimatedFill(0)
      setShowCheck1(false)
      setShowCheck2(false)
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
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }} className="text-foreground">{currentGrade.name}</div>
              <div style={{ fontSize: '10px', lineHeight: '1.4' }} className="text-muted-foreground">
                {currentGrade.description}
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', marginTop: '8px' }}>
                {grades.map((grade, i) => {
                  const isCurrent = grade.name === currentGrade.name
                  const height = 20 + i * 6
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                      <div style={{
                        width: '100%',
                        height: `${height}px`,
                        borderRadius: '4px',
                        backgroundColor: isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                        transition: 'background-color 0.3s ease'
                      }} />
                      <span style={{
                        fontSize: '6px',
                        fontWeight: isCurrent ? '700' : '400',
                        color: isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                        textAlign: 'center',
                        lineHeight: '1.2'
                      }}>{grade.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid hsl(var(--border) / 0.4)' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'hsl(var(--foreground))' }}>Let's Level Up!</span>

              {/* 미션 1 */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {showCheck1
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, animation: 'stampPop 0.5s ease-out forwards' }}><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" style={{ flexShrink: 0, visibility: 'hidden' }}><path d="M21.801 10A10 10 0 1 1 17 3.335"/></svg>
                    }
                    <span style={{ fontSize: '8px', fontWeight: '500', color: 'hsl(var(--muted-foreground))' }}>Mission 1</span>
                    <span style={{ fontSize: '10px', fontWeight: '500', color: 'hsl(var(--foreground))' }}>결과물 80개 보유하기</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1px' }}>
                  <span style={{ fontSize: '8px', fontWeight: '500', color: 'hsl(var(--primary))' }}>48/80</span>
                </div>
                <div style={{ position: 'relative', marginTop: '2px' }}>
                  <div style={{ position: 'relative', height: '4px', borderRadius: '2px', backgroundColor: 'hsl(var(--muted))', overflow: 'visible' }}>
                    <div style={{ width: `${animatedFill}%`, height: '100%', borderRadius: '2px', backgroundColor: 'hsl(var(--primary))', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                    {[25, 50, 75].map(milestone => (
                      <div key={milestone} style={{
                        position: 'absolute', left: `${milestone}%`, top: 0,
                        width: '1px', height: '100%',
                        backgroundColor: 'hsl(var(--card) / 0.6)',
                        zIndex: 1
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: '8px', color: 'hsl(var(--primary))', marginTop: '4px' }}>
                    {animatedFill >= 75 ? '거의 다 왔어요!' : animatedFill >= 50 ? '절반을 넘었어요!' : animatedFill >= 25 ? '좋은 출발이에요!' : '시작이 반이에요!'}
                  </div>
                </div>
              </div>

              {/* 미션 2 */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {showCheck2 
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, animation: 'stampPop 0.5s ease-out forwards' }}><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" style={{ flexShrink: 0, visibility: 'hidden' }}><path d="M21.801 10A10 10 0 1 1 17 3.335"/></svg>
                    }
                    <span style={{ fontSize: '8px', fontWeight: '500', color: 'hsl(var(--muted-foreground))' }}>Mission 2</span>
                    <span style={{ fontSize: '10px', fontWeight: '500', color: 'hsl(var(--foreground))' }}>솔루션 2개 이상 사용하기</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  {[
                    { name: 'DataShot', color: '#7B61FF', done: true, locked: false },
                    { name: 'Reach Caster', color: '#00C8FF', done: false, locked: false },
                    { name: 'Ad Curator', color: '#00E676', done: false, locked: true },
                    { name: 'Budget Optimizer', color: '#FF3B7A', done: false, locked: true },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', flex: 1 }}>
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: s.done ? '1px solid transparent' : '1px dashed hsl(var(--muted-foreground) / 0.2)',
                        backgroundColor: s.done ? `${s.color}15` : 'transparent'
                      }}>
                        {s.locked
                          ? <Lock size={13} style={{ color: 'hsl(var(--muted-foreground) / 0.3)' }} />
                          : <Flame size={13}
                              fill={s.done ? s.color : 'none'}
                              style={{ color: s.done ? s.color : 'hsl(var(--muted-foreground) / 0.25)' }}
                            />
                        }
                      </div>
                      <span style={{ fontSize: '7px', color: s.done ? '#737373' : 'hsl(var(--muted-foreground) / 0.4)', textAlign: 'center' }}>{s.name}</span>
                      {s.locked ? <span style={{ fontSize: '6px', color: 'hsl(var(--muted-foreground) / 0.4)' }}>(준비중)</span> : <span style={{ fontSize: '6px', visibility: 'hidden' }}>(준비중)</span>}
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
