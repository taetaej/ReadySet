// SpinXOrb.tsx — SpinX의 새 마크. 정확한 도형 대신 흐르는 오브와 상태별 움직임으로 존재감을 낸다.
// API는 SpinXSymbol과 같다(size, motion, title) — 교체만 하면 된다.
// interactive를 켜면 코어와 하이라이트가 포인터 쪽으로 살짝 기운다 (큰 크기에서만 의미가 있다).

import React, { useEffect, useRef } from 'react'
import './spinx-orb.css'

export type SpinXOrbMotion = 'idle' | 'hover' | 'engage' | 'active' | 'settle' | 'static'

export interface SpinXOrbProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'title'> {
  size?: number
  motion?: SpinXOrbMotion
  /** 접근성 이름. 부모가 이미 라벨을 가지면 "" */
  title?: string
  /** 포인터를 따라 코어가 기운다 */
  interactive?: boolean
}

export function SpinXOrb({ size = 48, motion = 'idle', title = 'SpinX', interactive = false, className = '', style, ...rest }: SpinXOrbProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!interactive) return
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        // 오브 크기의 4배 거리에서 최대로 기울고, 그 이상은 고정
        const reach = r.width * 4
        el.style.setProperty('--mx', String(Math.max(-1, Math.min(1, dx / reach))))
        el.style.setProperty('--my', String(Math.max(-1, Math.min(1, dy / reach))))
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(frame) }
  }, [interactive])

  return (
    <span
      ref={ref}
      className={`sx-orb ${className}`.trim()}
      data-motion={motion}
      data-small={size < 32 ? 'true' : 'false'}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      style={{ ['--s' as string]: `${size}px`, ...style }}
      {...rest}
    >
      <span className="sx-orb__halo" />
      <span className="sx-orb__ring" />
      <span className="sx-orb__ring sx-orb__ring--2" />
      <span className="sx-orb__body">
        <span className="sx-orb__orbit sx-orb__orbit--1"><span className="sx-orb__blob" /></span>
        <span className="sx-orb__orbit sx-orb__orbit--2"><span className="sx-orb__blob" /></span>
        <span className="sx-orb__orbit sx-orb__orbit--3"><span className="sx-orb__blob" /></span>
        <span className="sx-orb__core" />
        <span className="sx-orb__shine" />
        <span className="sx-orb__grain" />
      </span>
    </span>
  )
}

export default SpinXOrb
