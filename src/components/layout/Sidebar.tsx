import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Archive, ChevronRight, ChevronLeft, Hexagon, LayoutGrid, BookOpen } from 'lucide-react'

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
      height: 'calc(100vh - 64px)',
      position: 'sticky',
      top: '64px',
      width: isCollapsed ? '60px' : '320px',
      transition: 'width 0.3s ease',
      flexShrink: 0,
      overflow: 'hidden'
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
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        display: isCollapsed ? 'none' : 'block'
      }}>
        <div>
            {/* 삼성 갤럭시 S24 캠페인 Slot */}
            <div 
              className="tree-node"
              style={{ marginBottom: '4px' }}
            >
              <div
                onClick={(e) => { e.stopPropagation(); onToggleFolder('samsung') }}
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: '4px' }}
              >
                <ChevronRight 
                  size={12} 
                  style={{ 
                    transform: expandedFolders.includes('samsung') ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                />
              </div>
              <div
                onClick={() => navigate('/slot/SLT001', { state: { slotData: { title: '삼성 갤럭시 S24 캠페인', advertiser: '삼성전자', description: '삼성 갤럭시 S24 출시를 위한 마케팅 캠페인입니다.', owner: '김민수', createdAt: '2024-01-15', updatedAt: '2시간 전' } } })}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, cursor: 'pointer', minWidth: 0 }}
              >
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
              </div>
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
                </div>

                {/* DataShot 데이터셋 목록 */}
                {expandedFolders.includes('samsung-datashot') && (() => {
                  const datasets = [
                    { name: '데이터셋 A', status: 'completed' },
                    { name: '데이터셋 B', status: 'completed' },
                    { name: '데이터셋 C', status: 'processing', progress: 3, total: 5 },
                    { name: '데이터셋 D', status: 'completed' },
                    { name: '데이터셋 E', status: 'completed' },
                    { name: '데이터셋 F', status: 'pending' },
                    { name: '데이터셋 G', status: 'completed' },
                    { name: '데이터셋 H', status: 'completed' },
                    { name: '데이터셋 I', status: 'completed' },
                    { name: '데이터셋 J', status: 'completed' },
                    { name: '데이터셋 K', status: 'completed' },
                    { name: '데이터셋 L', status: 'completed' },
                  ]
                  const maxVisible = 10
                  const visibleDatasets = datasets.slice(0, maxVisible)

                  return (
                  <div style={{ marginLeft: '16px', borderLeft: '1px solid hsl(var(--border))', paddingLeft: '8px' }}>
                    {visibleDatasets.map((dataset, idx) => (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '6px 8px',
                        borderRadius: '4px',
                        marginBottom: '2px',
                        fontSize: '13px'
                      }}>
                        <span 
                          style={{ flex: 1 }} 
                          className={dataset.status === 'pending' ? 'text-muted-foreground' : dataset.status === 'processing' ? 'animate-pulse-custom' : ''}
                        >
                          {dataset.name}
                        </span>
                        {dataset.status === 'processing' && (
                          <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                            <svg width="14" height="14" style={{ transform: 'rotate(-90deg)' }}>
                              <circle cx="7" cy="7" r="6" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" fill="none" />
                              <circle cx="7" cy="7" r="6" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none"
                                strokeDasharray={`${2 * Math.PI * 6 * ((dataset.progress || 0) / (dataset.total || 1))} ${2 * Math.PI * 6}`}
                                strokeLinecap="round" />
                            </svg>
                          </div>
                        )}
                        {dataset.status === 'pending' && (
                          <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                            <svg width="14" height="14" style={{ transform: 'rotate(-90deg)' }}>
                              <circle cx="7" cy="7" r="6" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" fill="none" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => navigate('/datashot')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 8px',
                        fontSize: '11px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        width: '100%',
                        transition: 'all 0.2s'
                      }}
                      className="text-muted-foreground"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      최근 {Math.min(datasets.length, maxVisible)}개 · 목록 보기
                      <ChevronRight size={12} />
                    </button>
                  </div>
                  )
                })()}

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
                </div>
                
                {/* Reach Caster 결과물들 */}
                {expandedFolders.includes('samsung-reachcaster') && (() => {
                  const scenarios = [
                    { name: '시나리오 A', status: 'completed' },
                    { name: '시나리오 B', status: 'processing', progress: 2, total: 5 },
                    { name: '시나리오 C', status: 'processing', progress: 4, total: 7 },
                    { name: '시나리오 D', status: 'pending' },
                    { name: '시나리오 E', status: 'completed' },
                    { name: '시나리오 F', status: 'completed' },
                    { name: '시나리오 G', status: 'completed' },
                    { name: '시나리오 H', status: 'processing', progress: 1, total: 3 },
                    { name: '시나리오 I', status: 'completed' },
                    { name: '시나리오 J', status: 'completed' },
                    { name: '시나리오 K', status: 'pending' },
                    { name: '시나리오 L', status: 'completed' },
                    { name: '시나리오 M', status: 'completed' },
                    { name: '시나리오 N', status: 'completed' },
                    { name: '시나리오 O', status: 'completed' },
                  ]
                  const maxVisible = 10
                  const visibleScenarios = scenarios.slice(0, maxVisible)
                  const hasMore = scenarios.length > maxVisible

                  return (
                  <div style={{ marginLeft: '16px', borderLeft: '1px solid hsl(var(--border))', paddingLeft: '8px' }}>
                    {visibleScenarios.map((scenario, idx) => (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '6px 8px',
                        borderRadius: '4px',
                        marginBottom: '2px',
                        fontSize: '13px'
                      }}>
                        <span 
                          style={{ flex: 1 }} 
                          className={scenario.status === 'pending' ? 'text-muted-foreground' : scenario.status === 'processing' ? 'animate-pulse-custom' : ''}
                        >
                          {scenario.name}
                        </span>
                        {scenario.status === 'processing' && (
                          <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                            <svg width="14" height="14" style={{ transform: 'rotate(-90deg)' }}>
                              <circle cx="7" cy="7" r="6" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" fill="none" />
                              <circle cx="7" cy="7" r="6" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none"
                                strokeDasharray={`${2 * Math.PI * 6 * ((scenario.progress || 0) / (scenario.total || 1))} ${2 * Math.PI * 6}`}
                                strokeLinecap="round" />
                            </svg>
                          </div>
                        )}
                        {scenario.status === 'pending' && (
                          <div style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                            <svg width="14" height="14" style={{ transform: 'rotate(-90deg)' }}>
                              <circle cx="7" cy="7" r="6" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" fill="none" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => navigate('/reachcaster')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 8px',
                        fontSize: '11px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        width: '100%',
                        transition: 'all 0.2s'
                      }}
                      className="text-muted-foreground"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      최근 {Math.min(scenarios.length, maxVisible)}개 · 목록 보기
                      <ChevronRight size={12} />
                    </button>
                  </div>
                  )
                })()}

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
            </div>
          </div>
      </nav>
      
      {/* User Guide - 목록 아래 자연 배치 */}
      {!isCollapsed && (
        <div style={{
          flexShrink: 0,
          padding: '12px 16px',
          borderTop: '1px solid hsl(var(--border) / 0.5)',
          background: 'hsl(var(--background))'
        }}>
          <button
            onClick={() => navigate('/docs')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 12px',
              backgroundColor: 'transparent',
              border: '1px solid hsl(var(--border) / 0.3)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
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
            <BookOpen size={15} className="text-muted-foreground" />
            <span style={{ flex: 1, textAlign: 'left' }}>User Guide</span>
          </button>
        </div>
      )}
    </aside>
  )
}