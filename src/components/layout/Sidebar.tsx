import React from 'react'
import { Archive, ChevronRight, Hexagon, LayoutGrid } from 'lucide-react'

interface SidebarProps {
  allSlotsExpanded: boolean
  expandedFolders: string[]
  onToggleAllSlots: () => void
  onToggleFolder: (folderId: string) => void
  onNavigateToWorkspace: () => void
}

export function Sidebar({ 
  allSlotsExpanded, 
  expandedFolders, 
  onToggleAllSlots, 
  onToggleFolder,
  onNavigateToWorkspace 
}: SidebarProps) {
  return (
    <aside className="workspace-sidebar" style={{ borderRight: 'none' }}>
      <div className="workspace-sidebar-header" style={{ borderBottom: 'none' }}>
        <h2 className="workspace-sidebar-title">
          My Slots
        </h2>
        <button 
          onClick={onToggleAllSlots}
          className="btn btn-ghost btn-sm"
          title={allSlotsExpanded ? "모든 Slot 접기" : "모든 Slot 펼치기"}
        >
          {allSlotsExpanded ? (
            <span style={{ fontSize: '11px', fontWeight: '500' }}>Collapse</span>
          ) : (
            <span style={{ fontSize: '11px', fontWeight: '500' }}>Expand</span>
          )}
        </button>
      </div>
      
      <nav className="workspace-sidebar-nav">
        <div>
          <div 
            className="tree-node" 
            style={{ justifyContent: 'flex-start' }}
            onClick={onNavigateToWorkspace}
          >
            <LayoutGrid size={16} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              SlotBoard
            </span>
          </div>
          
          <div style={{ marginLeft: '16px' }}>
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
                {/* Reach Caster 솔루션 */}
                <div 
                  onClick={() => onToggleFolder('samsung-reachcaster')}
                  className="tree-node tree-node--active"
                  style={{ marginBottom: '4px' }}
                >
                  <ChevronRight 
                    size={12} 
                    style={{ 
                      transform: expandedFolders.includes('samsung-reachcaster') ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                  <Hexagon size={16} style={{ 
                    fill: 'hsl(var(--primary))', 
                    color: 'hsl(var(--primary-foreground))' 
                  }} />
                  <span style={{ fontSize: '14px', flex: 1 }}>Reach Caster</span>
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
                
                {/* Data Shot 솔루션 */}
                <div className="tree-node" style={{ marginBottom: '4px', opacity: 0.6 }}>
                  <ChevronRight size={12} style={{ opacity: 0.5 }} />
                  <Hexagon size={16} style={{ opacity: 0.5 }} />
                  <span style={{ fontSize: '14px', flex: 1 }}>Data Shot</span>
                  <span style={{ 
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '8px'
                  }} className="bg-muted text-muted-foreground">
                    준비중
                  </span>
                </div>

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
        </div>
      </nav>
    </aside>
  )
}