import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Paperclip, Download, Share2, ArrowRight,
  CheckCircle2, Clock, Loader2,
  FileText, FileSpreadsheet
} from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'

/* ─── 타입 & 목업 데이터 ─── */

interface OutputItem {
  id: string
  title: string
  updatedAt: string
  lineage?: string
  subType?: string
}

interface SolutionGroup {
  key: string
  name: string
  outputs: OutputItem[]
}

const MOCK_OUTPUTS: SolutionGroup[] = [
  {
    key: 'datashot', name: 'DataShot',
    outputs: [
      { id: 'DS001', title: '전자제품 업종 벤치마크', updatedAt: '2시간 전' },
      { id: 'DS002', title: '경쟁사 미디어 믹스 분석', updatedAt: '1일 전' },
      { id: 'DS003', title: '타겟 오디언스 인사이트', updatedAt: '3일 전' },
    ]
  },
  {
    key: 'adCurator', name: 'Ad Curator',
    outputs: [
      { id: 'AC001', title: '25-39세 남성 타겟 큐레이션', updatedAt: '5시간 전' },
      { id: 'AC002', title: '프리미엄 세그먼트 타겟팅', updatedAt: '방금 전' },
    ]
  },
  {
    key: 'budgetOptimizer', name: 'Budget Optimizer',
    outputs: [
      { id: 'BO001', title: '10억 예산 최적화 시나리오', updatedAt: '1일 전' },
    ]
  },
  {
    key: 'reachCaster', name: 'Reach Caster',
    outputs: [
      { id: 'RC001', title: '스포츠 용품 시즌 오프', updatedAt: '2시간 전', subType: 'Ratio Finder', lineage: 'Budget Optimizer에서 상속' },
      { id: 'RC002', title: '8주 기간 / 12억 예산', updatedAt: '3시간 전', subType: 'Reach Predictor', lineage: 'Ratio Finder에서 상속' },
      { id: 'RC003', title: 'TVC 예산 배분 최적화', updatedAt: '방금 전', subType: 'Reach Predictor' },
    ]
  }
]

const SOLUTION_GATES = [
  { key: 'datashot', name: 'DataShot', desc: '경쟁사/벤치마크 기반 인사이트', path: '/datashot' },
  { key: 'adCurator', name: 'Ad Curator', desc: '추천 상품 조합 및 타겟 큐레이션', path: '/ad-curator' },
  { key: 'budgetOptimizer', name: 'Budget Optimizer', desc: '예산 배분 최적안', path: '/budget-optimizer' },
  { key: 'reachCaster', name: 'Reach Caster', desc: '통합 도달률 예측', path: '/reachcaster' },
]

const APPENDIX_FILES = [
  { id: 1, name: '캠페인 기획서.pdf', type: 'pdf', size: '2.3 MB', uploadedAt: '2024-01-15' },
  { id: 2, name: '타겟 분석 리포트.xlsx', type: 'xlsx', size: '1.8 MB', uploadedAt: '2024-01-18' },
  { id: 3, name: '예산 배분 계획.pdf', type: 'pdf', size: '890 KB', uploadedAt: '2024-01-20' },
]

/* ─── 메인 컴포넌트 ─── */

interface SlotHomeProps {
  slotData?: any
}

export function SlotHome({ slotData: propSlotData }: SlotHomeProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const slotData = propSlotData || location.state?.slotData || {
    title: '2024 봄 시즌 캠페인',
    advertiser: '삼성전자',
    advertiserId: 'ADV001',
    description: '25–39세 남성 타겟 · 8주 집행 · 디지털+TV 크로스미디어',
    owner: '김민수',
    updatedAt: '2시간 전'
  }

  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    setDarkModeUtil(newMode)
  }

  const MAX_VISIBLE = 2

  // Recommended: 첫 번째로 output이 없는 솔루션
  const recommendedKey = SOLUTION_GATES.find(s => {
    const group = MOCK_OUTPUTS.find(g => g.key === s.key)
    return !group || group.outputs.length === 0
  })?.key || null

  const totalOutputs = MOCK_OUTPUTS.reduce((sum, g) => sum + g.outputs.length, 0)
  const activeSolutions = MOCK_OUTPUTS.filter(g => g.outputs.length > 0).length

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
      <div className="workspace-content" style={{ padding: '48px 80px' }}>

        {/* ═══ HEADER ═══ */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '48px', fontWeight: '500', fontFamily: 'Paperlogy, sans-serif',
            margin: '0 0 12px 0', color: 'hsl(var(--foreground))',
            letterSpacing: '-0.02em', lineHeight: 1.15, wordBreak: 'keep-all'
          }}>
            {slotData.title}
          </h1>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
            fontSize: '13px', color: 'hsl(var(--muted-foreground))', fontFamily: 'Paperlogy, sans-serif'
          }}>
            <span style={{ fontWeight: 600 }}>{slotData.advertiser}</span>
            {slotData.description && <><span style={{ opacity: 0.4 }}>·</span><span>{slotData.description}</span></>}
            {slotData.owner && <><span style={{ opacity: 0.4 }}>·</span><span>{slotData.owner}</span></>}
            {slotData.updatedAt && (
              <>
                <span style={{ opacity: 0.4 }}>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={11} /> {slotData.updatedAt}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ═══ FINAL SET — 3-Column Grid ═══ */}
        <div style={{
          display: 'grid', gridTemplateColumns: '3fr 5fr 3fr', gap: '0',
          marginBottom: '56px',
          borderTop: '1px solid hsl(var(--border))',
          borderBottom: '1px solid hsl(var(--border))'
        }}>

          {/* ── Column 1: Summary Engine ── */}
          <div style={{
            padding: '32px 28px',
            borderRight: '1px solid hsl(var(--border))',
            display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            <div>
              <div style={{
                fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const,
                letterSpacing: '0.06em', color: 'hsl(var(--muted-foreground) / 0.6)',
                fontFamily: 'Paperlogy, sans-serif', marginBottom: '6px'
              }}>
                Final Set
              </div>
              <div style={{
                fontSize: '20px', fontWeight: 700, fontFamily: 'Paperlogy, sans-serif',
                color: 'hsl(var(--foreground))', lineHeight: 1.3, letterSpacing: '-0.01em'
              }}>
                Campaign Overview
              </div>
            </div>

            {/* Reach Caster 기반 요약 */}
            <div style={{
              fontSize: '13px', lineHeight: 1.7, color: 'hsl(var(--muted-foreground))',
              fontFamily: 'Paperlogy, sans-serif',
              padding: '14px 16px', borderRadius: '8px',
              backgroundColor: 'hsl(var(--muted) / 0.3)',
              border: '1px solid hsl(var(--border) / 0.4)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { label: '타겟', value: '25–39세 남성' },
                  { label: '기간', value: '8주 (3/1 – 4/25)' },
                  { label: '예산', value: '10억 원' },
                  { label: 'Reach 1+', value: '68.5%' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>{item.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'hsl(var(--foreground))' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 상태 요약 */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '12px', color: 'hsl(var(--muted-foreground))', fontFamily: 'Paperlogy, sans-serif'
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '3px 10px', borderRadius: '10px', fontWeight: 500,
                backgroundColor: 'hsl(var(--muted) / 0.6)',
                color: 'hsl(var(--foreground))', fontSize: '11px'
              }}>
                {activeSolutions === SOLUTION_GATES.length
                  ? <CheckCircle2 size={11} />
                  : <Loader2 size={11} />
                }
                {activeSolutions}/{SOLUTION_GATES.length} solutions · {totalOutputs} outputs
              </span>
            </div>


          </div>

          {/* ── Column 2: Latest Outputs ── */}
          <div style={{
            borderRight: '1px solid hsl(var(--border))',
            display: 'flex', flexDirection: 'column'
          }}>
            {MOCK_OUTPUTS.map((group, gi) => {
              const visibleOutputs = group.outputs.slice(0, MAX_VISIBLE)
              const hiddenCount = group.outputs.length - MAX_VISIBLE

              // Reach Caster 서브 카운트
              const rfCount = group.outputs.filter(o => o.subType === 'Ratio Finder').length
              const rpCount = group.outputs.filter(o => o.subType === 'Reach Predictor').length

              return (
                <div key={group.key} style={{
                  padding: '16px 28px',
                  borderBottom: gi < MOCK_OUTPUTS.length - 1 ? '1px solid hsl(var(--border))' : 'none'
                }}>
                  {/* 그룹 헤더 */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px'
                  }}>
                    <span style={{
                      fontSize: '13px', fontWeight: 600, color: 'hsl(var(--foreground))',
                      fontFamily: 'Paperlogy, sans-serif'
                    }}>
                      {group.name}
                    </span>
                    {group.key === 'reachCaster' && (rfCount > 0 || rpCount > 0) && (
                      <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
                        {rfCount > 0 && (
                          <span style={{
                            fontSize: '10px', padding: '1px 6px', borderRadius: '6px',
                            backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))',
                            fontFamily: 'Paperlogy, sans-serif', fontWeight: 500
                          }}>RF {rfCount}</span>
                        )}
                        {rpCount > 0 && (
                          <span style={{
                            fontSize: '10px', padding: '1px 6px', borderRadius: '6px',
                            backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))',
                            fontFamily: 'Paperlogy, sans-serif', fontWeight: 500
                          }}>RP {rpCount}</span>
                        )}
                      </div>
                    )}
                    <span style={{
                      fontSize: '11px', color: 'hsl(var(--muted-foreground) / 0.5)',
                      marginLeft: 'auto', fontFamily: 'Paperlogy, sans-serif'
                    }}>
                      {group.outputs.length}건
                    </span>
                  </div>

                  {/* Output Rows — 깔끔한 텍스트 리스트 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {visibleOutputs.map(output => (
                      <div
                        key={output.id}
                        style={{
                          display: 'flex', flexDirection: 'column', gap: '2px',
                          padding: '6px 10px', borderRadius: '6px',
                          cursor: 'pointer', transition: 'background-color 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.4)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{
                          fontSize: '13px', fontWeight: 500, color: 'hsl(var(--foreground))',
                          fontFamily: 'Paperlogy, sans-serif',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {output.title}
                        </div>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          fontSize: '11px', color: 'hsl(var(--muted-foreground) / 0.6)',
                          fontFamily: 'Paperlogy, sans-serif'
                        }}>
                          {output.subType && (
                            <span style={{
                              padding: '0 5px', borderRadius: '4px',
                              backgroundColor: 'hsl(var(--muted) / 0.6)', fontSize: '10px', fontWeight: 500
                            }}>
                              {output.subType}
                            </span>
                          )}
                          {output.lineage && <span>{output.lineage}</span>}
                          <span style={{ marginLeft: 'auto' }}>{output.updatedAt}</span>
                        </div>
                      </div>
                    ))}
                    {hiddenCount > 0 && (
                      <div style={{
                        fontSize: '11px', color: 'hsl(var(--muted-foreground) / 0.5)',
                        fontFamily: 'Paperlogy, sans-serif', padding: '2px 10px',
                        cursor: 'pointer'
                      }}>
                        +{hiddenCount} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Column 3: Documents + Quick Actions ── */}
          <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Documents */}
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px'
              }}>
                <Paperclip size={13} style={{ color: 'hsl(var(--muted-foreground))' }} />
                <span style={{
                  fontSize: '13px', fontWeight: 600, color: 'hsl(var(--foreground))',
                  fontFamily: 'Paperlogy, sans-serif'
                }}>
                  Documents
                </span>
                <span style={{
                  fontSize: '11px', color: 'hsl(var(--muted-foreground) / 0.5)',
                  marginLeft: 'auto', fontFamily: 'Paperlogy, sans-serif'
                }}>
                  {APPENDIX_FILES.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {APPENDIX_FILES.map(file => (
                  <div
                    key={file.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '8px',
                      padding: '6px 8px', borderRadius: '6px',
                      cursor: 'pointer', transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.4)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {file.type === 'pdf'
                      ? <FileText size={14} style={{ color: 'hsl(var(--destructive))', marginTop: '1px', flexShrink: 0 }} />
                      : <FileSpreadsheet size={14} style={{ color: 'hsl(var(--primary))', marginTop: '1px', flexShrink: 0 }} />
                    }
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '12px', fontWeight: 500, color: 'hsl(var(--foreground))',
                        fontFamily: 'Paperlogy, sans-serif',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {file.name}
                      </div>
                      <div style={{
                        fontSize: '10px', color: 'hsl(var(--muted-foreground) / 0.5)',
                        fontFamily: 'Paperlogy, sans-serif', marginTop: '1px'
                      }}>
                        {file.size} · {file.uploadedAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div style={{
                fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const,
                letterSpacing: '0.06em', color: 'hsl(var(--muted-foreground) / 0.5)',
                fontFamily: 'Paperlogy, sans-serif', marginBottom: '12px'
              }}>
                Quick Actions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { icon: Download, label: '최종 패키지 내보내기' },
                  { icon: Share2, label: '공유' },
                ].map(action => (
                  <button
                    key={action.label}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 10px', borderRadius: '8px',
                      border: 'none', backgroundColor: 'transparent',
                      cursor: 'pointer', transition: 'background-color 0.15s',
                      fontSize: '12px', fontWeight: 500, color: 'hsl(var(--foreground))',
                      fontFamily: 'Paperlogy, sans-serif', width: '100%', textAlign: 'left'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.4)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <action.icon size={14} style={{ color: 'hsl(var(--muted-foreground))' }} />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>


          </div>
        </div>

        {/* ═══ SOLUTIONS — 4 Gates ═══ */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0',
          borderTop: '1px solid hsl(var(--border))',
          borderBottom: '1px solid hsl(var(--border))',
          marginBottom: '48px'
        }}>
          {SOLUTION_GATES.map((sol, i) => {
            const group = MOCK_OUTPUTS.find(g => g.key === sol.key)
            const outputCount = group?.outputs.length || 0
            const latestOutput = group?.outputs[0]
            const isRecommended = sol.key === recommendedKey

            // Reach Caster 서브 카운트
            const rfCount = group?.outputs.filter(o => o.subType === 'Ratio Finder').length || 0
            const rpCount = group?.outputs.filter(o => o.subType === 'Reach Predictor').length || 0

            return (
              <div
                key={sol.key}
                onClick={() => navigate(sol.path, { state: { slotData } })}
                style={{
                  position: 'relative',
                  padding: '24px 24px',
                  borderRight: i < SOLUTION_GATES.length - 1 ? '1px solid hsl(var(--border))' : 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex', flexDirection: 'column', gap: '10px',
                  backgroundColor: isRecommended ? 'hsl(var(--muted) / 0.3)' : 'transparent'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.4)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = isRecommended ? 'hsl(var(--muted) / 0.3)' : 'transparent'}
              >
                {/* Recommended 라벨 */}
                {isRecommended && (
                  <div style={{
                    position: 'absolute', top: '-8px', left: '20px',
                    fontSize: '10px', fontWeight: 600, fontFamily: 'Paperlogy, sans-serif',
                    padding: '2px 8px', borderRadius: '6px',
                    backgroundColor: 'hsl(var(--foreground))', color: 'hsl(var(--background))',
                    letterSpacing: '0.02em'
                  }}>
                    Recommended
                  </div>
                )}

                {/* 솔루션명 */}
                <div style={{
                  fontSize: '14px', fontWeight: 600, color: 'hsl(var(--foreground))',
                  fontFamily: 'Paperlogy, sans-serif'
                }}>
                  {sol.name}
                </div>

                {/* 설명 */}
                <div style={{
                  fontSize: '12px', color: 'hsl(var(--muted-foreground))',
                  fontFamily: 'Paperlogy, sans-serif', lineHeight: 1.4
                }}>
                  {sol.desc}
                </div>

                {/* 최신 결과 */}
                {latestOutput && (
                  <div style={{
                    fontSize: '11px', color: 'hsl(var(--muted-foreground) / 0.6)',
                    fontFamily: 'Paperlogy, sans-serif',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {latestOutput.title}
                  </div>
                )}

                {/* 하단: 카운트 */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  marginTop: 'auto', paddingTop: '6px'
                }}>
                  <span style={{
                    fontSize: '12px', fontWeight: 600, color: 'hsl(var(--foreground))',
                    fontFamily: 'Paperlogy, sans-serif'
                  }}>
                    {outputCount}
                  </span>
                  <span style={{
                    fontSize: '11px', color: 'hsl(var(--muted-foreground) / 0.5)',
                    fontFamily: 'Paperlogy, sans-serif'
                  }}>
                    {outputCount === 0 ? 'empty' : 'outputs'}
                  </span>
                  {sol.key === 'reachCaster' && (rfCount > 0 || rpCount > 0) && (
                    <span style={{
                      fontSize: '10px', color: 'hsl(var(--muted-foreground) / 0.5)',
                      fontFamily: 'Paperlogy, sans-serif'
                    }}>
                      RF {rfCount} · RP {rpCount}
                    </span>
                  )}
                  <ArrowRight size={13} style={{ color: 'hsl(var(--muted-foreground) / 0.3)', marginLeft: 'auto' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
