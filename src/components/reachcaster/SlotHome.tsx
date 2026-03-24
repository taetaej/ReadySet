import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Paperclip } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { SlotSolutions } from './SlotSolutions'
import { ScrollVelocityCards } from './ScrollVelocityCards'

interface SlotHomeProps {
  slotData?: any
}

export function SlotHome({ slotData: propSlotData }: SlotHomeProps) {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Slot 데이터 가져오기
  const slotData = propSlotData || location.state?.slotData || {
    title: '2024 봄 시즌 캠페인',
    advertiser: '삼성전자',
    advertiserId: 'ADV001'
  }
  
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    setDarkModeUtil(newMode)
  }

  const appendixFiles = [
    { id: 1, name: '캠페인 기획서.pdf', size: '2.3 MB', uploadedAt: '2024-01-15' },
    { id: 2, name: '타겟 분석 리포트.xlsx', size: '1.8 MB', uploadedAt: '2024-01-18' },
    { id: 3, name: '예산 배분 계획.pdf', size: '890 KB', uploadedAt: '2024-01-20' }
  ]

  return (
    <AppLayout
      currentView="slotHome"
      showBreadcrumb={false}
      isDarkMode={isDarkMode}
      onToggleDarkMode={handleToggleDarkMode}
      sidebarProps={{
        isCollapsed: isSidebarCollapsed,
        expandedFolders,
        onToggleSidebar: toggleSidebar,
        onToggleFolder: toggleFolder,
        onNavigateToWorkspace: () => navigate('/slotboard')
      }}
    >
      <div className="workspace-content" style={{ padding: '60px 80px' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '60px' }}>
          <div>
            <h1 style={{
              fontSize: '56px',
              fontWeight: '500',
              fontFamily: 'Paperlogy, sans-serif',
              margin: '0 0 20px 0',
              color: 'hsl(var(--foreground))',
              letterSpacing: '-0.02em',
              lineHeight: '1.1',
              wordBreak: 'keep-all'
            }}>
              {slotData.title}
            </h1>
            
            {/* Description and Advertiser below title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {slotData.description && (
                <div style={{
                  fontSize: '14px',
                  color: 'hsl(var(--muted-foreground))',
                  lineHeight: '1.6'
                }}>
                  {slotData.description}
                </div>
              )}
              <div style={{
                fontSize: '14px',
                color: 'hsl(var(--muted-foreground))'
              }}>
                {slotData.advertiser}
              </div>
            </div>
          </div>

        </div>

        {/* 3D Scroll Velocity Cards */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            fontFamily: 'Paperlogy, sans-serif',
            margin: '0 0 8px 0',
            color: 'hsl(var(--foreground))',
            letterSpacing: '-0.02em',
            lineHeight: '1.2'
          }}>
            Final Set
          </h2>
          <p style={{
            fontSize: '13px',
            color: 'hsl(var(--muted-foreground))',
            fontFamily: 'Paperlogy, sans-serif',
            margin: '0 0 32px 0'
          }}>
            솔루션별 최종 산출물을 확인하세요
          </p>
          <ScrollVelocityCards />
        </div>

        {/* Final Selection — 3-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '4fr 5fr 3fr',
          gap: '0',
          marginBottom: '60px',
          borderTop: '1px solid hsl(var(--border))',
          borderBottom: '1px solid hsl(var(--border))'
        }}>
          {/* Column 1: Final Selection + CircularText */}
          <div style={{
            padding: '40px 32px',
            borderRight: '1px solid hsl(var(--border))',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              fontFamily: 'Paperlogy, sans-serif',
              margin: 0,
              color: 'hsl(var(--foreground))',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              Final Set
            </h2>
          </div>

          {/* Column 2: Solutions with outputs */}
          <div style={{
            borderRight: '1px solid hsl(var(--border))',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* DataShot */}
            <div style={{ padding: '20px 32px', borderBottom: '1px solid hsl(var(--border))' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif', marginBottom: '10px' }}>
                DataShot
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { label: '전자제품 업종 벤치마크', path: '/datashot/DS001' },
                  { label: '경쟁사 미디어 믹스 분석', path: '/datashot/DS002' },
                  { label: '타겟 오디언스 인사이트', path: '/datashot/DS003' }
                ].map((item) => (
                  <div
                    key={item.path}
                    onClick={() => navigate(item.path, { state: { slotData } })}
                    style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', transition: 'color 0.2s', width: 'fit-content' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Curator */}
            <div style={{ padding: '20px 32px', borderBottom: '1px solid hsl(var(--border))' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif', marginBottom: '10px' }}>
                Ad Curator
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { label: '25-39세 남성 타겟 큐레이션', path: '/ad-curator/AC001' },
                  { label: '프리미엄 세그먼트 타겟팅', path: '/ad-curator/AC002' }
                ].map((item) => (
                  <div
                    key={item.path}
                    onClick={() => navigate(item.path, { state: { slotData } })}
                    style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', transition: 'color 0.2s', width: 'fit-content' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Optimizer */}
            <div style={{ padding: '20px 32px', borderBottom: '1px solid hsl(var(--border))' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif', marginBottom: '10px' }}>
                Budget Optimizer
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div
                  onClick={() => navigate('/budget-optimizer/BO001', { state: { slotData } })}
                  style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', transition: 'color 0.2s', width: 'fit-content' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                >
                  10억 예산 최적화 시나리오
                </div>
              </div>
            </div>

            {/* Reach Caster */}
            <div style={{ padding: '20px 32px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif', marginBottom: '10px' }}>
                Reach Caster
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { label: '4주 기간 / 8억 예산', path: '/reachcaster/scenario/reach-predictor/result' },
                  { label: '8주 기간 / 12억 예산', path: '/reachcaster/scenario/ratio-finder/result' },
                  { label: 'TVC 예산 배분 최적화', path: '/reachcaster' }
                ].map((item) => (
                  <div
                    key={item.path}
                    onClick={() => navigate(item.path, { state: { slotData } })}
                    style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', cursor: 'pointer', transition: 'color 0.2s', width: 'fit-content' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Documents */}
          <div style={{ padding: '40px 32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <Paperclip size={14} style={{ color: 'hsl(var(--muted-foreground))' }} />
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Paperlogy, sans-serif'
              }}>
                Documents
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {appendixFiles.map((file) => (
                <div
                  key={file.id}
                  style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => {
                    const nameEl = e.currentTarget.querySelector('[data-filename]') as HTMLElement
                    if (nameEl) nameEl.style.color = 'hsl(var(--foreground))'
                  }}
                  onMouseLeave={(e) => {
                    const nameEl = e.currentTarget.querySelector('[data-filename]') as HTMLElement
                    if (nameEl) nameEl.style.color = 'hsl(var(--muted-foreground))'
                  }}
                >
                  <div
                    data-filename
                    style={{
                      fontSize: '13px',
                      color: 'hsl(var(--muted-foreground))',
                      transition: 'color 0.2s',
                      marginBottom: '2px'
                    }}
                  >
                    {file.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground) / 0.6)' }}>
                    {file.size} · {file.uploadedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Solutions Navigation */}
        <SlotSolutions slotData={slotData} />
      </div>
    </AppLayout>
  )
}
