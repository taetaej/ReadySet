import React, { useId } from "react";
import "./spinx-symbol-animation.css";

function toCssSize(size) {
  return typeof size === "number" ? `${size}px` : size;
}

export function SpinXSymbol({
  size = 56,
  motion = "idle",
  title = "SpinX",
  className = "",
  style,
  ...props
}) {
  const uid = useId().replace(/:/g, "");

  const ids = {
    cyanBand: `${uid}-spinx-cyan-band`,
    cyanHighlight: `${uid}-spinx-cyan-highlight`,
    metalBand: `${uid}-spinx-metal-band`,
    metalHighlight: `${uid}-spinx-metal-highlight`,
    coreBody: `${uid}-spinx-core-body`,
    coreLight: `${uid}-spinx-core-light`,
    softShadow: `${uid}-spinx-soft-shadow`,
    neon: `${uid}-spinx-neon`,
    coreGlow: `${uid}-spinx-core-glow`,
  };

  return (
    <svg
      className={`spinx-symbol ${className}`.trim()}
      data-motion={motion}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      style={{ width: toCssSize(size), height: toCssSize(size), ...style }}
      {...props}
    >
      {title ? <title>{title}</title> : null}

      <defs>
        <linearGradient id={ids.cyanBand} x1="80" y1="108" x2="426" y2="404" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d9feff" />
          <stop offset="0.16" stopColor="#46efff" />
          <stop offset="0.45" stopColor="#03bdd3" />
          <stop offset="0.64" stopColor="#89fbff" />
          <stop offset="1" stopColor="#12d8ef" />
        </linearGradient>

        <linearGradient id={ids.cyanHighlight} x1="122" y1="158" x2="389" y2="363" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".95" />
          <stop offset=".38" stopColor="#91f8ff" stopOpacity=".9" />
          <stop offset="1" stopColor="#00d7ec" stopOpacity=".7" />
        </linearGradient>

        <linearGradient id={ids.metalBand} x1="96" y1="398" x2="425" y2="112" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#546469" />
          <stop offset="0.18" stopColor="#dce9ec" />
          <stop offset="0.33" stopColor="#798a90" />
          <stop offset="0.52" stopColor="#111e22" />
          <stop offset="0.76" stopColor="#eef6f8" />
          <stop offset="1" stopColor="#8a989e" />
        </linearGradient>

        <linearGradient id={ids.metalHighlight} x1="120" y1="377" x2="402" y2="136" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".15" />
          <stop offset=".36" stopColor="#ffffff" stopOpacity=".82" />
          <stop offset=".56" stopColor="#ffffff" stopOpacity=".08" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".72" />
        </linearGradient>

        <radialGradient id={ids.coreBody} cx="50%" cy="42%" r="64%">
          <stop offset="0" stopColor="#536a72" />
          <stop offset="0.42" stopColor="#15272d" />
          <stop offset="1" stopColor="#071114" />
        </radialGradient>

        <radialGradient id={ids.coreLight} cx="50%" cy="50%" r="56%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".26" stopColor="#bfffff" />
          <stop offset=".55" stopColor="#27e7ff" stopOpacity=".96" />
          <stop offset="1" stopColor="#00c6de" stopOpacity="0" />
        </radialGradient>

        <filter id={ids.softShadow} x="-28%" y="-28%" width="156%" height="156%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#071418" floodOpacity=".32" />
        </filter>

        <filter id={ids.neon} x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="5.6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.00  0 0 0 0 0.85  0 0 0 0 1.00  0 0 0 .72 0"
            result="cyanBlur"
          />
          <feMerge>
            <feMergeNode in="cyanBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={ids.coreGlow} x="-70%" y="-70%" width="240%" height="240%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="9" result="glow" />
          <feColorMatrix
            in="glow"
            type="matrix"
            values="0 0 0 0 0.00  0 0 0 0 0.82  0 0 0 0 1.00  0 0 0 .82 0"
            result="cyanGlow"
          />
          <feMerge>
            <feMergeNode in="cyanGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Transparent canvas only: no square tile, no rounded-rect background. */}
      <g className="spinx-symbol__mark" fill="none">
        <g opacity=".62" filter={`url(#${ids.softShadow})`}>
          <ellipse cx="256" cy="256" rx="174" ry="70" transform="rotate(45 256 256)" stroke="#071418" strokeWidth="29" strokeLinecap="round" opacity=".25" />
          <ellipse cx="256" cy="256" rx="174" ry="70" transform="rotate(-45 256 256)" stroke="#071418" strokeWidth="29" strokeLinecap="round" opacity=".18" />
        </g>

        <g className="spinx-symbol__orbit-spin spinx-symbol__orbit-spin--inner">
          <g transform="rotate(45 256 256)">
            <ellipse cx="256" cy="256" rx="174" ry="70" stroke="#091419" strokeWidth="36" strokeLinecap="round" opacity=".82" />
            <ellipse cx="256" cy="256" rx="174" ry="70" stroke={`url(#${ids.metalBand})`} strokeWidth="26" strokeLinecap="round" filter={`url(#${ids.softShadow})`} />
            <ellipse cx="256" cy="256" rx="174" ry="70" stroke={`url(#${ids.metalHighlight})`} strokeWidth="8" strokeLinecap="round" opacity=".9" />
            <ellipse className="spinx-symbol__ring-flow" cx="256" cy="256" rx="174" ry="70" stroke="#eefcff" strokeWidth="4" strokeLinecap="round" opacity=".42" />
          </g>
        </g>

        <g className="spinx-symbol__orbit-spin spinx-symbol__orbit-spin--outer">
          <g transform="rotate(-45 256 256)">
            <ellipse cx="256" cy="256" rx="174" ry="70" stroke="#06252b" strokeWidth="38" strokeLinecap="round" opacity=".82" />
            <ellipse cx="256" cy="256" rx="174" ry="70" stroke={`url(#${ids.cyanBand})`} strokeWidth="27" strokeLinecap="round" filter={`url(#${ids.neon})`} />
            <ellipse cx="256" cy="256" rx="174" ry="70" stroke={`url(#${ids.cyanHighlight})`} strokeWidth="8" strokeLinecap="round" opacity=".94" />
            <ellipse className="spinx-symbol__ring-flow" cx="256" cy="256" rx="174" ry="70" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity=".52" />
          </g>
        </g>

        <g className="spinx-symbol__core" filter={`url(#${ids.coreGlow})`}>
          <circle cx="256" cy="256" r="55" fill={`url(#${ids.coreBody})`} stroke="#20363d" strokeWidth="2" opacity=".98" />
          <circle cx="256" cy="256" r="22" fill={`url(#${ids.coreLight})`} opacity=".98" />
          <circle cx="256" cy="256" r="10" fill="#eaffff" opacity=".96" />
        </g>
      </g>
    </svg>
  );
}

export default SpinXSymbol;
