import { 
  GoogleAdsIcon, 
  MetaIcon, 
  KakaoIcon, 
  NaverIcon, 
  TikTokIcon, 
  TvingIcon, 
  DaangnIcon,
  mediaIconMap 
} from '../common/MediaIcons'
import { Section, ComponentGroup } from './Section'

const iconEntries = Object.entries(mediaIconMap)

export function MediaIconSection() {
  return (
    <Section title="Media Icons" description="광고 매체 로고 아이콘 (모노톤, currentColor 사용)">
      <ComponentGroup label="All Media Icons (Grid)">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
          gap: '16px', 
          width: '100%' 
        }}>
          {iconEntries.map(([name, IconComponent]) => (
            <div 
              key={name} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '16px', 
                borderRadius: '8px', 
                border: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--card))',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ 
                width: '48px', 
                height: '48px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'hsl(var(--foreground))'
              }}>
                <IconComponent size={32} />
              </div>
              <span style={{ 
                fontSize: '11px', 
                color: 'hsl(var(--muted-foreground))', 
                textAlign: 'center',
                wordBreak: 'keep-all'
              }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </ComponentGroup>

      <ComponentGroup label="Size Variations">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <GoogleAdsIcon size={16} />
            <span style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>16px</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <GoogleAdsIcon size={24} />
            <span style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>24px</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <GoogleAdsIcon size={32} />
            <span style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>32px</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <GoogleAdsIcon size={48} />
            <span style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>48px</span>
          </div>
        </div>
      </ComponentGroup>

      <ComponentGroup label="Usage Example (Inline with Text)">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'hsl(var(--foreground))' }}>
          <MetaIcon size={16} /> Meta Ads
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'hsl(var(--foreground))' }}>
          <KakaoIcon size={16} /> kakao모먼트
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'hsl(var(--foreground))' }}>
          <NaverIcon size={16} /> NAVER 성과형 DA
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'hsl(var(--foreground))' }}>
          <TikTokIcon size={16} /> TikTok
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'hsl(var(--foreground))' }}>
          <TvingIcon size={16} /> TVING
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'hsl(var(--foreground))' }}>
          <DaangnIcon size={16} /> 당근비즈니스
        </div>
      </ComponentGroup>
    </Section>
  )
}
