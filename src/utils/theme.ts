// CSS 변수를 JavaScript에서 사용할 수 있도록 하는 유틸리티
export const getThemeValue = (variable: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
  }
  return ''
}

// Shadcn 스타일 기반 테마 객체 (CSS 변수 사용)
export const theme = {
  // CSS 변수를 hsl 형태로 반환
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: 'hsl(var(--card))',
  cardForeground: 'hsl(var(--card-foreground))',
  popover: 'hsl(var(--popover))',
  popoverForeground: 'hsl(var(--popover-foreground))',
  primary: 'hsl(var(--primary))',
  primaryForeground: 'hsl(var(--primary-foreground))',
  secondary: 'hsl(var(--secondary))',
  secondaryForeground: 'hsl(var(--secondary-foreground))',
  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',
  accent: 'hsl(var(--accent))',
  accentForeground: 'hsl(var(--accent-foreground))',
  destructive: 'hsl(var(--destructive))',
  destructiveForeground: 'hsl(var(--destructive-foreground))',
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
}

// 브랜드 컬러 변경 시 이 함수를 사용
export const updateBrandColors = (colors: {
  primary?: string
  secondary?: string
  accent?: string
}) => {
  const root = document.documentElement
  
  if (colors.primary) {
    root.style.setProperty('--primary', colors.primary)
  }
  if (colors.secondary) {
    root.style.setProperty('--secondary', colors.secondary)
  }
  if (colors.accent) {
    root.style.setProperty('--accent', colors.accent)
  }
}