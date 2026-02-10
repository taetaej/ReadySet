import { useMemo } from 'react'

interface AvatarProps {
  name: string
  type: 'user' | 'advertiser'
  size?: number
  userId?: string // 메시 그라데이션 시드용
}

// 네온 컬러 팔레트 (Cyan, Violet, Pink 계열)
const NEON_COLORS = [
  ['#00D9FF', '#7B2FFF', '#FF006B'], // Cyan → Violet → Pink
  ['#00F5FF', '#9D4EDD', '#FF1B8D'], // Bright Cyan → Purple → Hot Pink
  ['#00E5FF', '#6A0DAD', '#FF0080'], // Electric Cyan → Deep Violet → Magenta
  ['#00FFFF', '#8B00FF', '#FF007F'], // Aqua → Electric Violet → Rose
  ['#00C9FF', '#9333EA', '#EC4899'], // Sky Cyan → Purple → Pink
]

// SaaS 네온 컬러 팔레트 (Linear/Vercel 스타일)
const SAAS_NEON_COLORS = [
  '#00E5FF', // Neon Cyan
  '#7B2FFF', // Electric Violet
  '#00FF94', // Neon Lime
  '#FF006B', // Neon Pink
  '#FFD600', // Neon Yellow
  '#00D9FF', // Bright Cyan
  '#9D4EDD', // Purple
  '#FF1B8D', // Hot Pink
  '#00FFC2', // Mint
  '#FF3D00', // Neon Orange
  '#8B00FF', // Electric Purple
  '#00FFE5', // Aqua
  '#FF0080', // Magenta
  '#CCFF00', // Lime
  '#00C9FF', // Sky Blue
  '#FF007F', // Rose
  '#9333EA', // Violet
  '#00FF7F', // Spring Green
  '#FF4500', // Orange Red
  '#00E5E5', // Turquoise
  '#E500FF', // Fuchsia
  '#00FFB3', // Sea Green
  '#FF0055', // Deep Pink
  '#00D4FF', // Light Cyan
  '#B800FF'  // Purple
]

// 시드 기반 랜덤 선택
const getColorPalette = (seed: string): string[] => {
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return NEON_COLORS[hash % NEON_COLORS.length]
}

// 광고주 네온 컬러 가져오기 (이름 기반 해시)
const getAdvertiserNeonColor = (name: string): string => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return SAAS_NEON_COLORS[hash % SAAS_NEON_COLORS.length]
}

// 색상의 밝기 계산 (0-255)
const getLuminance = (hex: string): number => {
  const rgb = parseInt(hex.slice(1), 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  // Relative luminance formula
  return 0.299 * r + 0.587 * g + 0.114 * b
}

// 배경 색상에 따라 텍스트 색상 결정
const getTextColor = (bgColor: string): string => {
  const luminance = getLuminance(bgColor)
  // 밝기가 128 이상이면 검정, 아니면 흰색
  return luminance > 128 ? '#000000' : '#FFFFFF'
}

// 메시 그라데이션 생성
const generateMeshGradient = (colors: string[]): string => {
  return `
    radial-gradient(at 0% 0%, ${colors[0]} 0px, transparent 50%),
    radial-gradient(at 100% 0%, ${colors[1]} 0px, transparent 50%),
    radial-gradient(at 100% 100%, ${colors[2]} 0px, transparent 50%),
    radial-gradient(at 0% 100%, ${colors[0]} 0px, transparent 50%)
  `
}

export function Avatar({ name, type, size = 32, userId }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase()
  
  const avatarStyle = useMemo(() => {
    if (type === 'user') {
      // General User: Simple primary color
      return {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.4}px`,
        fontWeight: '600',
        fontFamily: 'Paperlogy, -apple-system, sans-serif',
        flexShrink: 0
      }
    } else {
      // Advertiser: SaaS Neon style - flat design
      const neonColor = getAdvertiserNeonColor(name)
      const textColor = getTextColor(neonColor)
      return {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size * 0.3}px`, // Soft squircle
        background: neonColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.4}px`,
        fontWeight: '700',
        fontFamily: 'Paperlogy, -apple-system, sans-serif',
        color: textColor,
        flexShrink: 0,
        position: 'relative' as const
      }
    }
  }, [type, size, userId, name])

  return (
    <div style={avatarStyle}>
      <span>{initial}</span>
    </div>
  )
}
