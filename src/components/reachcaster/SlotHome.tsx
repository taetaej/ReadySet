import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Paperclip, ChevronDown, ChevronUp } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { SlotSolutions } from './SlotSolutions'

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
  const [isAppendixExpanded, setIsAppendixExpanded] = useState(false)
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          marginBottom: '80px'
        }}>
          {/* Left: Slot Name as Main Title */}
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

          {/* Right: ReadySet Message */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <p style={{
              fontSize: '24px',
              color: 'hsl(var(--muted-foreground))',
              lineHeight: '1.7',
              margin: 0,
              fontFamily: 'Paperlogy, sans-serif'
            }}>
              ReadySet은 데이터 기반의 정교한 분석을 통해 
              최적의 미디어 전략을 제시합니다. 
              각 솔루션에서 선별된 최종 시나리오를 
              하나의 통합된 인사이트로 제공합니다.
            </p>
          </div>
        </div>

        {/* Final Selection Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          marginBottom: '60px'
        }}>
          {/* Left: Empty for alignment */}
          <div />

          {/* Right: Final Selection Title */}
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '500',
              fontFamily: 'Paperlogy, sans-serif',
              margin: '0 0 32px 0',
              color: 'hsl(var(--foreground))',
              letterSpacing: '-0.01em'
            }}>
              Final Selection
            </h2>

            {/* Solutions with Outputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {/* DataShot */}
              <div style={{
                paddingTop: '24px',
                paddingBottom: '24px',
                borderTop: '1px solid hsl(var(--border))'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'hsl(var(--foreground))',
                  marginBottom: '16px',
                  fontFamily: 'Paperlogy, sans-serif'
                }}>
                  DataShot
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    onClick={() => navigate('/datashot/DS001', { state: { slotData } })}
                    style={{
                      fontSize: '15px',
                      fontWeight: '400',
                      color: 'hsl(var(--muted-foreground))',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      width: 'fit-content'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                  >
                    전자제품 업종 벤치마크
                  </div>
                  <div
                    onClick={() => navigate('/datashot/DS002', { state: { slotData } })}
                    style={{
                      fontSize: '15px',
                      fontWeight: '400',
                      color: 'hsl(var(--muted-foreground))',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      width: 'fit-content'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                  >
                    경쟁사 미디어 믹스 분석
                  </div>
                  <div
                    onClick={() => navigate('/datashot/DS003', { state: { slotData } })}
                    style={{
                      fontSize: '15px',
                      fontWeight: '400',
                      color: 'hsl(var(--muted-foreground))',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      width: 'fit-content'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                  >
                    타겟 오디언스 인사이트
                  </div>
                </div>
              </div>

              {/* Ad Curator */}
              <div style={{
                paddingTop: '24px',
                paddingBottom: '24px',
                borderTop: '1px solid hsl(var(--border))'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'hsl(var(--foreground))',
                  marginBottom: '16px',
                  fontFamily: 'Paperlogy, sans-serif'
                }}>
                  Ad Curator
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    onClick={() => navigate('/ad-curator/AC001', { state: { slotData } })}
                    style={{
                      fontSize: '15px',
                      fontWeight: '400',
                      color: 'hsl(var(--muted-foreground))',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      width: 'fit-content'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                  >
                    25-39세 남성 타겟 큐레이션
                  </div>
                  <div
                    onClick={() => navigate('/ad-curator/AC002', { state: { slotData } })}
                    style={{
                      fontSize: '15px',
                      fontWeight: '400',
                      color: 'hsl(var(--muted-foreground))',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      width: 'fit-content'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                  >
                    프리미엄 세그먼트 타겟팅
                  </div>
                </div>
              </div>

              {/* Budget Optimizer */}
              <div style={{
                paddingTop: '24px',
                paddingBottom: '24px',
                borderTop: '1px solid hsl(var(--border))'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'hsl(var(--foreground))',
                  marginBottom: '16px',
                  fontFamily: 'Paperlogy, sans-serif'
                }}>
                  Budget Optimizer
                </div>
                <div
                  onClick={() => navigate('/budget-optimizer/BO001', { state: { slotData } })}
                  style={{
                    fontSize: '15px',
                    fontWeight: '400',
                    color: 'hsl(var(--muted-foreground))',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    width: 'fit-content'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                >
                  10억 예산 최적화 시나리오
                </div>
              </div>

              {/* Reach Caster - Multiple Scenarios */}
              <div style={{
                paddingTop: '24px',
                paddingBottom: '24px',
                borderTop: '1px solid hsl(var(--border))',
                borderBottom: '1px solid hsl(var(--border))'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'hsl(var(--foreground))',
                  marginBottom: '16px',
                  fontFamily: 'Paperlogy, sans-serif'
                }}>
                  Reach Caster
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    onClick={() => navigate('/reachcaster/scenario/reach-predictor/result', { state: { slotData } })}
                    style={{
                      fontSize: '15px',
                      fontWeight: '400',
                      color: 'hsl(var(--muted-foreground))',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      width: 'fit-content'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                  >
                    4주 기간 / 8억 예산
                  </div>
                  <div
                    onClick={() => navigate('/reachcaster/scenario/ratio-finder/result', { state: { slotData } })}
                    style={{
                      fontSize: '15px',
                      fontWeight: '400',
                      color: 'hsl(var(--muted-foreground))',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      width: 'fit-content'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                  >
                    8주 기간 / 12억 예산
                  </div>
                  <div
                    onClick={() => navigate('/reachcaster', { state: { slotData } })}
                    style={{
                      fontSize: '15px',
                      fontWeight: '400',
                      color: 'hsl(var(--muted-foreground))',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      width: 'fit-content'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                  >
                    TVC 예산 배분 최적화
                  </div>
                </div>
              </div>

              {/* Appendix - Collapsible */}
              <div style={{ paddingTop: '24px' }}>
                <div
                  onClick={() => setIsAppendixExpanded(!isAppendixExpanded)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginBottom: isAppendixExpanded ? '12px' : '0',
                    transition: 'all 0.2s'
                  }}
                >
                  <Paperclip size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'hsl(var(--muted-foreground))',
                    fontFamily: 'Paperlogy, sans-serif'
                  }}>
                    Appendix
                  </span>
                  {isAppendixExpanded ? (
                    <ChevronUp size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
                  )}
                </div>

                {isAppendixExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '24px' }}>
                    {appendixFiles.map((file) => (
                      <div
                        key={file.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'color 0.2s'
                        }}
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
                            transition: 'color 0.2s'
                          }}
                        >
                          {file.name}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: 'hsl(var(--muted-foreground))'
                        }}>
                          {file.size}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Solutions Navigation */}
        <SlotSolutions slotData={slotData} />
      </div>
    </AppLayout>
  )
}
