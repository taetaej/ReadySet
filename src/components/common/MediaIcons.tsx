// 매체 로고 아이콘 (모노톤, currentColor 사용)

const s = { display: 'inline-block', verticalAlign: 'middle' } as const

export function GoogleAdsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-3 0 262 262" fill="currentColor" style={s}>
      <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
      <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-1.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
      <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" />
      <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
    </svg>
  )
}

export function MetaIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={s}>
      <path d="M12 2.04c-5.5 0-10 4.48-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7A10.02 10.02 0 0022 12.06c0-5.54-4.5-10.02-10-10.02z"/>
    </svg>
  )
}

export function KakaoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={s}>
      <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.72 1.8 5.108 4.516 6.467-.144.522-.926 3.36-.96 3.57 0 0-.02.166.088.229.108.063.234.014.234.014.308-.043 3.574-2.332 4.137-2.727.636.092 1.296.14 1.985.14 5.523 0 10-3.463 10-7.693S17.523 3 12 3z"/>
    </svg>
  )
}

export function NaverIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={s}>
      <path d="M16.273 12.845L7.376 3H3v18h4.727V11.155L16.624 21H21V3h-4.727z"/>
    </svg>
  )
}

export function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={s}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.84a4.84 4.84 0 01-1-.15z"/>
    </svg>
  )
}

export const mediaIconMap: Record<string, React.FC<{ size?: number }>> = {
  'Google Ads': GoogleAdsIcon,
  'Meta': MetaIcon,
  'kakao모먼트': KakaoIcon,
  '네이버 성과형 DA': NaverIcon,
  '네이버 보장형 DA': NaverIcon,
  'TikTok': TikTokIcon,
}
