import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Archive, ChevronRight, ChevronLeft, Hexagon, LayoutGrid, BookOpen, FileText } from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
  expandedFolders: string[]
  onToggleSidebar: () => void
  onToggleFolder: (folderId: string) => void
  onNavigateToWorkspace: () => void
}

export function Sidebar({ 
  isCollapsed, 
  expandedFolders, 
  onToggleSidebar, 
  onToggleFolder,
  onNavigateToWorkspace 
}: SidebarProps) {
  const navigate = useNavigate()
  
  return (
    <aside className="workspace-sidebar" style={{ 
      borderRight: 'none',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      width: isCollapsed ? '60px' : '320px',
      transition: 'width 0.3s ease',
      flexShrink: 0
    }}>
      <div className="workspace-sidebar-header" style={{ 
        borderBottom: 'none',
        justifyContent: isCollapsed ? 'center' : 'space-between'
      }}>
        {!isCollapsed && (
          <h2 className="workspace-sidebar-title">
            My Slots
          </h2>
        )}
        <button 
          onClick={onToggleSidebar}
          className="btn btn-ghost btn-sm"
          title={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          style={{ padding: '8px' }}
        >
          {isCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>
      
      <nav className="workspace-sidebar-nav" style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        display: isCollapsed ? 'none' : 'block'
      }}>
        <div>
            {/* 삼성 갤럭시 S24 캠페인 Slot */}
            <div 
              onClick={() => onToggleFolder('samsung')}
              className="tree-node"
              style={{ marginBottom: '4px' }}
            >
              <ChevronRight 
                size={12} 
                style={{ 
                  transform: expandedFolders.includes('samsung') ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
              <Archive size={16} />
              <span style={{ 
                fontSize: '14px', 
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                삼성 갤럭시 S24 캠페인
              </span>
              <span style={{ 
                fontSize: '12px', 
                padding: '2px 8px',
                borderRadius: '12px',
                minWidth: '24px',
                textAlign: 'center'
              }} className="bg-muted text-muted-foreground">
                5
              </span>
            </div>
            
            {expandedFolders.includes('samsung') && (
              <div style={{ marginLeft: '16px', borderLeft: '1px solid hsl(var(--border))', paddingLeft: '8px' }}>
                {/* DataShot 솔루션 */}
                <div 
                  className="tree-node"
                  style={{ marginBottom: '4px' }}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFolder('samsung-datashot')
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      marginRight: '4px'
                    }}
                  >
                    <ChevronRight 
                      size={12} 
                      style={{ 
                        transform: expandedFolders.includes('samsung-datashot') ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                    />
                  </div>
                  <Hexagon size={16} style={{ 
                    fill: 'hsl(var(--primary))', 
                    color: 'hsl(var(--primary-foreground))'
                  }} />
                  <span 
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('/datashot')
                    }}
                    style={{ 
                      fontSize: '14px', 
                      flex: 1,
                      cursor: 'pointer'
                    }}
                  >
                    DataShot
                  </span>
                  <span style={{ 
                    fontSize: '12px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    minWidth: '24px',
                    textAlign: 'center'
                  }} className="bg-background text-muted-foreground">
                    4
                  </span>
                </div>

                {/* DataShot 데이터셋 목록 */}
                {expandedFolders.includes('samsung-datashot') && (
                  <div style={{ marginLeft: '16px', borderLeft: '1px solid hsl(var(--border))', paddingLeft: '8px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '6px 8px',
                      borderRadius: '4px',
                      marginBottom: '2px',
                      fontSize: '13px'
                    }}>
                      <span style={{ flex: 1 }}>데이터셋 A</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '6px 8px',
                      borderRadius: '4px',
                      marginBottom: '2px',
                      fontSize: '13px'
                    }}>
                      <span style={{ flex: 1 }}>데이터셋 B</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '6px 8px',
                      borderRadius: '4px',
                      marginBottom: '2px',
                      fontSize: '13px'
                    }}>
                      <span style={{ flex: 1 }}>데이터셋 C</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '6px 8px',
                      borderRadius: '4px',
                      marginBottom: '2px',
                      fontSize: '13px'
                    }}>
                      <span style={{ flex: 1 }}>데이터셋 D</span>
                    </div>
                  </div>
                )}

                {/* Reach Caster 솔루션 */}
                <div 
                  className="tree-node"
                  style={{ marginBottom: '4px' }}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFolder('samsung-reachcaster')
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      marginRight: '4px'
                    }}
                  >
                    <ChevronRight 
                      size={12} 
                      style={{ 
                        transform: expandedFolders.includes('samsung-reachcaster') ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                    />
                  </div>
                  <Hexagon size={16} style={{ 
                    fill: 'hsl(var(--primary))', 
                    color: 'hsl(var(--primary-foreground))' 
                  }} />
                  <span 
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('/reachcaster')
                    }}
                    style={{ 
                      fontSize: '14px', 
                      flex: 1,
                      cursor: 'pointer'
                    }}
                  >
                    Reach Caster
                  </span>
                  <span style={{ 
                    fontSize: '12px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    minWidth: '24px',
                    textAlign: 'center'
                  }} className="bg-background text-muted-foreground">
                    3
                  </span>
                </div>
                
                {/* Reach Caster 결과물들 */}
                {expandedFolders.includes('samsung-reachcaster') && (
                  <div style={{ marginLeft: '16px', borderLeft: '1px solid hsl(var(--border))', paddingLeft: '8px' }}>
                    {/* 완료된 시나리오 */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '6px 8px',
                      borderRadius: '4px',
                      marginBottom: '2px',
                      fontSize: '13px'
                    }}>
                      <span style={{ flex: 1 }}>시나리오 A</span>
                    </div>
                    
                    {/* 생성 중인 시나리오 - 2/5 단계 */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '6px 8px',
                      borderRadius: '4px',
                      marginBottom: '2px',
                      fontSize: '13px'
                    }}>
                      <span className="animate-pulse-custom" style={{ flex: 1 }}>
                        시나리오 B
                      </span>
                      <div style={{ 
                        width: '14px', 
                        height: '14px', 
                        position: 'relative',
                        flexShrink: 0
                      }}>
                        <svg width="14" height="14" style={{ transform: 'rotate(-90deg)' }}>
                          <circle
                            cx="7"
                            cy="7"
                            r="6"
                            stroke="hsl(var(--muted-foreground))"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <circle
                            cx="7"
                            cy="7"
                            r="6"
                            stroke="hsl(var(--primary))"
                            strokeWidth="1.5"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 6 * (2/5)} ${2 * Math.PI * 6}`}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    {/* 생성 중인 시나리오 - 4/7 단계 */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '6px 8px',
                      borderRadius: '4px',
                      marginBottom: '2px',
                      fontSize: '13px'
                    }}>
                      <span className="animate-pulse-custom" style={{ flex: 1 }}>
                        시나리오 C
                      </span>
                      <div style={{ 
                        width: '14px', 
                        height: '14px', 
                        position: 'relative',
                        flexShrink: 0
                      }}>
                        <svg width="14" height="14" style={{ transform: 'rotate(-90deg)' }}>
                          <circle
                            cx="7"
                            cy="7"
                            r="6"
                            stroke="hsl(var(--muted-foreground))"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          <circle
                            cx="7"
                            cy="7"
                            r="6"
                            stroke="hsl(var(--primary))"
                            strokeWidth="1.5"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 6 * (4/7)} ${2 * Math.PI * 6}`}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    {/* 대기 중인 시나리오 */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '6px 8px',
                      borderRadius: '4px',
                      marginBottom: '2px',
                      fontSize: '13px'
                    }}>
                      <span style={{ flex: 1 }} className="text-muted-foreground">시나리오 D</span>
                      <div style={{ 
                        width: '14px', 
                        height: '14px', 
                        position: 'relative',
                        flexShrink: 0
                      }}>
                        <svg width="14" height="14" style={{ transform: 'rotate(-90deg)' }}>
                          <circle
                            cx="7"
                            cy="7"
                            r="6"
                            stroke="hsl(var(--muted-foreground))"
                            strokeWidth="1.5"
                            fill="none"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ad Curator 솔루션 */}
                <div className="tree-node" style={{ marginBottom: '4px', opacity: 0.6 }}>
                  <ChevronRight size={12} style={{ opacity: 0.5 }} />
                  <Hexagon size={16} style={{ opacity: 0.5 }} />
                  <span style={{ fontSize: '14px', flex: 1 }}>Ad Curator</span>
                  <span style={{ 
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '8px'
                  }} className="bg-muted text-muted-foreground">
                    준비중
                  </span>
                </div>

                {/* Budget Optimizer 솔루션 */}
                <div className="tree-node" style={{ marginBottom: '4px', opacity: 0.6 }}>
                  <ChevronRight size={12} style={{ opacity: 0.5 }} />
                  <Hexagon size={16} style={{ opacity: 0.5 }} />
                  <span style={{ fontSize: '14px', flex: 1 }}>Budget Optimizer</span>
                  <span style={{ 
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '8px'
                  }} className="bg-muted text-muted-foreground">
                    준비중
                  </span>
                </div>
              </div>
            )}
            
            {/* LG 올레드 TV 런칭 Slot */}
            <div 
              onClick={() => onToggleFolder('lg')}
              className="tree-node"
              style={{ marginBottom: '4px' }}
            >
              <ChevronRight 
                size={12} 
                style={{ 
                  transform: expandedFolders.includes('lg') ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
              <Archive size={16} />
              <span style={{ 
                fontSize: '14px', 
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                LG 올레드 TV 런칭
              </span>
              <span style={{ 
                fontSize: '12px', 
                padding: '2px 8px',
                borderRadius: '12px',
                minWidth: '24px',
                textAlign: 'center'
              }} className="bg-muted text-muted-foreground">
                3
              </span>
            </div>
            
            {/* 현대 아이오닉 6 마케팅 Slot */}
            <div 
              onClick={() => onToggleFolder('hyundai')}
              className="tree-node"
              style={{ marginBottom: '4px' }}
            >
              <ChevronRight 
                size={12} 
                style={{ 
                  transform: expandedFolders.includes('hyundai') ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
              <Archive size={16} />
              <span style={{ 
                fontSize: '14px', 
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                현대 아이오닉 6 마케팅
              </span>
              <span style={{ 
                fontSize: '12px', 
                padding: '2px 8px',
                borderRadius: '12px',
                minWidth: '24px',
                textAlign: 'center'
              }} className="bg-muted text-muted-foreground">
                12
              </span>
            </div>
          </div>
      </nav>
      
      {/* Support Section - Glassy Tone on Tone */}
      {!isCollapsed && (
        <div style={{
          marginTop: 'auto',
          padding: '16px'
        }}>
          <div style={{
          backgroundColor: 'hsl(var(--background) / 0.5)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid hsl(var(--border) / 0.5)',
          boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '500',
            marginBottom: '6px'
          }} className="text-foreground">
            Need Help?
          </div>
          
          <div style={{
            fontSize: '11px',
            marginBottom: '14px',
            lineHeight: '1.4',
            fontWeight: '400'
          }} className="text-muted-foreground">
            Explore guides and resources
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => window.open('/user-guide', '_blank')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 10px',
                backgroundColor: 'transparent',
                border: '1px solid hsl(var(--border) / 0.3)',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '400',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="text-foreground"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(var(--accent) / 0.5)'
                e.currentTarget.style.borderColor = 'hsl(var(--border))'
                e.currentTarget.style.boxShadow = '0 0 12px 0 hsl(var(--primary) / 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = 'hsl(var(--border) / 0.3)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <BookOpen size={14} className="text-muted-foreground" />
              <span style={{ flex: 1, textAlign: 'left' }}>User Guide</span>
            </button>
            
            <button
              onClick={() => window.open('/platform-overview', '_blank')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 10px',
                backgroundColor: 'transparent',
                border: '1px solid hsl(var(--border) / 0.3)',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '400',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="text-foreground"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(var(--accent) / 0.5)'
                e.currentTarget.style.borderColor = 'hsl(var(--border))'
                e.currentTarget.style.boxShadow = '0 0 12px 0 hsl(var(--primary) / 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = 'hsl(var(--border) / 0.3)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <FileText size={14} className="text-muted-foreground" />
              <span style={{ flex: 1, textAlign: 'left' }}>Platform Overview</span>
            </button>
          </div>
        </div>
        </div>
      )}
    </aside>
  )
}