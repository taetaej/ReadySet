import React, { useId } from 'react'
import './pulse-node-x-animation.css'

export type PulseNodeXMotion = 'idle' | 'hover' | 'engage' | 'active' | 'settle' | 'static'

export interface PulseNodeXProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> {
  size?: number | string
  motion?: PulseNodeXMotion
  title?: string
}

function toCssSize(size: number | string): string {
  return typeof size === 'number' ? `${size}px` : size
}

export function PulseNodeX({
  size = 56,
  motion = 'idle',
  title = 'SpinX',
  className = '',
  style,
  ...props
}: PulseNodeXProps) {
  const uid = useId().replace(/:/g, '')

  const ids = {
    armGlow: `${uid}-pnx-arm-glow`,
    nodeGlow: `${uid}-pnx-node-glow`,
    coreGlow: `${uid}-pnx-core-glow`,
  }

  // 4개 노드 위치 (X자 형태, 512x512 기준)
  const nodes = [
    { cx: 128, cy: 128, cls: 'pulse-node-x__node--tl' }, // top-left
    { cx: 384, cy: 128, cls: 'pulse-node-x__node--tr' }, // top-right
    { cx: 128, cy: 384, cls: 'pulse-node-x__node--bl' }, // bottom-left
    { cx: 384, cy: 384, cls: 'pulse-node-x__node--br' }, // bottom-right
  ]

  return (
    <svg
      className={`pulse-node-x ${className}`.trim()}
      data-motion={motion}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      style={{ width: toCssSize(size), height: toCssSize(size), ...style }}
      {...props}
    >
      {title ? <title>{title}</title> : null}

      <defs>
        {/* 팔 글로우 필터 */}
        <filter id={ids.armGlow} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" type="matrix"
            values="0 0 0 0 0.00  0 0 0 0 1.00  0 0 0 0 0.62  0 0 0 0.6 0"
            result="greenBlur" />
          <feMerge>
            <feMergeNode in="greenBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 노드 글로우 필터 */}
        <filter id={ids.nodeGlow} x="-80%" y="-80%" width="260%" height="260%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="6" result="glow" />
          <feColorMatrix in="glow" type="matrix"
            values="0 0 0 0 0.00  0 0 0 0 1.00  0 0 0 0 0.62  0 0 0 0.8 0"
            result="greenGlow" />
          <feMerge>
            <feMergeNode in="greenGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 코어 글로우 필터 */}
        <filter id={ids.coreGlow} x="-100%" y="-100%" width="300%" height="300%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="10" result="glow" />
          <feColorMatrix in="glow" type="matrix"
            values="0 0 0 0 0.00  0 0 0 0 1.00  0 0 0 0 0.62  0 0 0 0.9 0"
            result="greenGlow" />
          <feMerge>
            <feMergeNode in="greenGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g fill="none">
        {/* X자 팔 4개 (중심 → 각 노드) */}
        <g className="pulse-node-x__arm" filter={`url(#${ids.armGlow})`}>
          {nodes.map((n, i) => (
            <line
              key={i}
              x1="256" y1="256"
              x2={n.cx} y2={n.cy}
              stroke="#00ff9d"
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.85"
            />
          ))}
          {/* 팔 위에 얇은 하이라이트 */}
          {nodes.map((n, i) => (
            <line
              key={`hl-${i}`}
              x1="256" y1="256"
              x2={n.cx} y2={n.cy}
              stroke="#80ffce"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.5"
            />
          ))}
        </g>

        {/* 4개 끝 노드 */}
        {nodes.map((n, i) => (
          <g key={i} className={`pulse-node-x__node ${n.cls}`} filter={`url(#${ids.nodeGlow})`}>
            <circle cx={n.cx} cy={n.cy} r="30" fill="#00ff9d" opacity="0.3" />
            <circle cx={n.cx} cy={n.cy} r="20" fill="#00ff9d" opacity="0.8" />
            <circle cx={n.cx} cy={n.cy} r="10" fill="#ffffff" opacity="0.95" />
          </g>
        ))}

        {/* 중심 코어 */}
        <g className="pulse-node-x__core" filter={`url(#${ids.coreGlow})`}>
          <circle cx="256" cy="256" r="42" fill="#00ff9d" opacity="0.25" />
          <circle cx="256" cy="256" r="28" fill="#00ff9d" opacity="0.7" />
          <circle cx="256" cy="256" r="14" fill="#ffffff" opacity="0.95" />
        </g>
      </g>
    </svg>
  )
}

export default PulseNodeX
