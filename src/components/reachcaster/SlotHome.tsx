import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Loader2,
  ArrowRight,
  Scale, Target, ThumbsUp, Settings2, Link2, X, Share2, Search,
  Info, MoreVertical, Edit, Trash2, Hourglass, Inbox
} from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { maskEmail } from '../../utils/maskEmail'
import {
  SolutionSlot, colors,
  AVAILABLE_OUTPUTS, INITIAL_FLOW
} from './slotHomeTypes'
import { DocumentsSection, SlotFeedSection } from './SlotHomeSections'

/* ─── Component ─── */

interface SlotHomeProps {
  slotData?: any
}

export function SlotHome({ slotData: propSlotData }: SlotHomeProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const slotData = propSlotData || location.state?.slotData || {
    title: '2024 봄 시즌 캠페인',
    advertiser: '삼성전자',
    description: '25–39세 남성 타겟 · 8주 집행 · 디지털+TV 크로스미디어',
    owner: '김민수',
    createdAt: '2024-01-15',
    updatedAt: '2시간 전'
  }

  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()
  const [hoveredOutput, setHoveredOutput] = useState<string | null>(null)
  const [hoveredHeader, setHoveredHeader] = useState<string | null>(null)
  const [solutionFlow, setSolutionFlow] = useState<SolutionSlot[]>(INITIAL_FLOW)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const [outputDialogOpen, setOutputDialogOpen] = useState(false)
  const [dialogSelections, setDialogSelections] = useState<Record<string, string[]>>({})
  const [dialogActiveTab, setDialogActiveTab] = useState<string>('datashot')
  const [dialogSearch, setDialogSearch] = useState<Record<string, string>>({})
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  // 권한 플래그 (실제로는 auth context에서 가져옴)
  const isAdmin = true

  const moreMenuRef = useRef<HTMLDivElement>(null)

  // 메뉴 외부 클릭 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setShareMenuOpen(false)
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    setDarkModeUtil(newMode)
  }

  const completedCount = solutionFlow.filter(s => s.status === 'completed').length

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
      <div className="workspace-content" style={{
        padding: '48px 64px',
        fontFamily: 'Paperlogy, sans-serif',
      }}>

        {/* ═══ HEADER ═══ */}
        <header style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            {/* Left: Title + Meta */}
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '40px',
                fontWeight: 700,
                color: colors.text,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                margin: '0 0 10px 0',
                fontFamily: 'Paperlogy, sans-serif',
              }}>
                {slotData.title}
              </h1>

              <p style={{
                fontSize: '14px',
                color: colors.textMuted,
                margin: '0 0 12px 0',
                lineHeight: 1.5,
                letterSpacing: '-0.01em',
              }}>
                {slotData.description}
              </p>
            </div>

            {/* Right: Actions only */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              {/* Copy Link — Share2 버튼 + 드롭다운 (RatioFinderResult 동일 패턴) */}
              <div style={{ position: 'relative' }} ref={shareMenuRef}>
                <button
                  onClick={() => setShareMenuOpen(!shareMenuOpen)}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '6px' }}
                  title="공유"
                >
                  <Share2 size={18} />
                </button>

                {shareMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%', right: 0,
                    marginTop: '8px',
                    width: '200px',
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    zIndex: 1000,
                    fontFamily: 'Paperlogy, sans-serif',
                    overflow: 'hidden',
                  }}>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        setShareMenuOpen(false)
                      }}
                      style={{
                        width: '100%', padding: '12px 16px',
                        border: 'none', backgroundColor: 'transparent',
                        textAlign: 'left', cursor: 'pointer',
                        fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px',
                        transition: 'background-color 0.2s',
                        color: 'hsl(var(--popover-foreground))',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Link2 size={16} />
                      <span>Copy Link</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Info 아이콘 - 슬롯 정보 툴팁 */}
              <div style={{ position: 'relative' }}>
                <button
                  onMouseEnter={() => setInfoTooltipOpen(true)}
                  onMouseLeave={() => setInfoTooltipOpen(false)}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '6px' }}
                >
                  <Info size={18} />
                </button>

                {infoTooltipOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%', right: 0,
                    marginTop: '8px', width: '280px',
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px', padding: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    zIndex: 1000,
                    fontFamily: 'Paperlogy, sans-serif',
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', color: colors.textDim, marginBottom: '4px' }}>Slot ID</div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: colors.text }}>#1024</div>
                    </div>
                    <div style={{ height: '1px', backgroundColor: colors.border, margin: '12px 0' }} />
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', color: colors.textDim, marginBottom: '4px' }}>생성일시</div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: colors.text }}>2024-01-15 14:30</div>
                      <div style={{ fontSize: '12px', color: colors.textDim }}>{slotData.owner} ({maskEmail('kimminsu@readyset.com')})</div>
                    </div>
                    <div style={{ height: '1px', backgroundColor: colors.border, margin: '12px 0' }} />
                    <div>
                      <div style={{ fontSize: '11px', color: colors.textDim, marginBottom: '4px' }}>최근 수정일시</div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: colors.text }}>2024-01-20 16:45</div>
                      <div style={{ fontSize: '12px', color: colors.textDim }}>이지은 ({maskEmail('leejieun@readyset.com')})</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 관리 메뉴 (수정/삭제) */}
              <div style={{ position: 'relative' }} ref={moreMenuRef}>
                <button
                  onClick={e => { e.stopPropagation(); setMoreMenuOpen(!moreMenuOpen) }}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '6px' }}
                >
                  <MoreVertical size={18} />
                </button>

                {moreMenuOpen && (
                  <div className="dropdown" style={{
                    position: 'absolute',
                    top: '100%', right: 0,
                    marginTop: '4px', width: '120px',
                    zIndex: 1000,
                  }}>
                    <button
                      onClick={e => { e.stopPropagation(); setMoreMenuOpen(false); navigate('/slotboard/edit', { state: { slotData } }) }}
                      className="dropdown-item"
                    >
                      <Edit size={14} /> 수정
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setMoreMenuOpen(false); setDeleteConfirmOpen(true) }}
                      className="dropdown-item"
                    >
                      <Trash2 size={14} /> 삭제
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </header>

        {/* ═══ STRATEGY FLOW — Invoice View ═══ */}
        <section>
          {/* Section Label */}
          <div style={{
            display: 'flex', alignItems: 'center',
            marginBottom: '20px',
          }}>
            <span style={{
              fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const,
              letterSpacing: '0.08em', color: colors.textDim,
            }}>
              Final Strategy Set · {completedCount}/{solutionFlow.length} Completed
            </span>
            {isAdmin && (
              <button
                onClick={() => setOutputDialogOpen(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '16px', height: '16px',
                  border: 'none', background: 'transparent',
                  color: colors.textDim, cursor: 'pointer',
                  padding: 0, marginLeft: '6px',
                  transition: 'color 0.15s',
                }}
                title="Final Strategy Set 관리"
                onMouseEnter={e => e.currentTarget.style.color = colors.text}
                onMouseLeave={e => e.currentTarget.style.color = colors.textDim}
              >
                <Settings2 size={13} />
              </button>
            )}
          </div>

          {/* Flow Container */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            overflow: 'hidden',
            backgroundColor: isDarkMode ? colors.surface : 'hsl(var(--card) / 0.2)',
          }}>
            {solutionFlow.map((slot, idx) => {
              const isLast = idx === solutionFlow.length - 1

              return (
                <div
                  key={slot.key}
                  style={{
                    position: 'relative',
                    borderRight: !isLast ? `1px solid ${colors.border}` : 'none',
                    padding: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '320px',
                    opacity: slot.status === 'coming-soon' ? 0.6 : 1,
                  }}
                  onMouseLeave={() => { }}
                >
                  {/* ── Header Area (클릭 → 솔루션 목록) ── */}
                  <div
                    style={{
                      padding: '24px 20px 0',
                      cursor: slot.status === 'coming-soon' ? 'default' : 'pointer',
                      backgroundColor: hoveredHeader === slot.key && slot.status !== 'coming-soon'
                        ? 'hsl(var(--muted) / 0.4)' : 'transparent',
                      transition: 'background-color 0.15s',
                      borderRadius: '0',
                    }}
                    onMouseEnter={() => { if (slot.status !== 'coming-soon') setHoveredHeader(slot.key) }}
                    onMouseLeave={() => setHoveredHeader(null)}
                    onClick={() => slot.status !== 'coming-soon' && navigate(slot.path, { state: { slotData } })}
                  >
                  {/* Step Number + Arrow */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '14px',
                  }}>
                    <span style={{
                      fontSize: '10px', fontWeight: 700,
                      color: colors.textDim,
                      letterSpacing: '0.05em',
                    }}>
                      STEP {idx + 1}
                    </span>
                    {!isLast && (
                      <ArrowRight size={12} style={{
                        color: colors.textDim,
                        position: 'absolute',
                        right: '-7px',
                        top: '28px',
                        zIndex: 2,
                        backgroundColor: colors.surface,
                        borderRadius: '50%',
                        padding: '2px',
                      }} />
                    )}
                  </div>

                  {/* Solution Name — Split Text reveal on hover */}
                  <div
                    style={{
                      fontSize: '20px', fontWeight: 700,
                      color: colors.text,
                      marginBottom: '8px',
                      letterSpacing: '-0.02em',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                  >
                    <span style={{ display: 'inline-flex', overflow: 'hidden' }}>
                      {slot.name.split('').map((char, ci) => (
                        <span
                          key={`${slot.key}-${ci}-${hoveredHeader === slot.key}`}
                          style={{
                            display: 'inline-block',
                            animation: hoveredHeader === slot.key
                              ? `splitReveal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${ci * 0.03}s both`
                              : 'none',
                            whiteSpace: char === ' ' ? 'pre' : 'normal',
                          }}
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                    <span style={{
                      opacity: hoveredHeader === slot.key ? 1 : 0,
                      transition: 'opacity 0.2s, transform 0.3s',
                      transform: hoveredHeader === slot.key ? 'translateX(0)' : 'translateX(-4px)',
                      display: 'inline-flex',
                    }}>
                      <ArrowRight size={16} style={{ color: colors.textMuted }} />
                    </span>
                  </div>

                  {/* Description */}
                  <div style={{
                    fontSize: '11px',
                    color: colors.textDim,
                    marginBottom: '16px',
                    lineHeight: 1.4,
                  }}>
                    {slot.desc}
                  </div>

                  {/* Status Indicator — only show message for non-completed, but reserve space always */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '10px', fontWeight: 600,
                    color: slot.status === 'in-progress' ? colors.warning
                      : slot.status === 'coming-soon' ? colors.textDim
                      : colors.textDim,
                    marginBottom: '16px',
                    minHeight: '16px',
                  }}>
                    {slot.status !== 'completed' && slot.status !== 'empty' && slot.status !== 'coming-soon' && (
                      <>
                        {slot.status === 'in-progress' && <Loader2 size={10} />}
                        {slot.status === 'in-progress' ? 'In Progress' : ''}
                      </>
                    )}
                  </div>

                  {/* Divider */}
                  <div style={{
                    height: '1px',
                    backgroundColor: colors.border,
                    marginBottom: '0',
                  }} />
                  </div>{/* ── End Header Area ── */}

                  {/* ── Output Area ── */}
                  <div style={{ flex: 1, padding: '20px 20px 24px', overflow: 'hidden' }}>
                    {slot.selectedOutputs && slot.selectedOutputs.length > 0 ? (
                      <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {slot.selectedOutputs.map((output, oi) => (
                          <div key={output.id} style={{
                            padding: '0',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: oi < (slot.selectedOutputs?.length || 0) - 1 ? `1px solid ${colors.border}` : 'none',
                            paddingBottom: oi < (slot.selectedOutputs?.length || 0) - 1 ? '10px' : '0',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            transition: 'background-color 0.15s',
                          }}
                            onMouseEnter={e => {
                              e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.3)'
                              setHoveredOutput(output.id)
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              setHoveredOutput(null)
                            }}                            onClick={e => {
                              e.stopPropagation()
                              if (output.module) {
                                const resultPath = output.module === 'Ratio Finder'
                                  ? '/reachcaster/scenario/ratio-finder/result'
                                  : '/reachcaster/scenario/reach-predictor/result'
                                navigate(resultPath, {
                                  state: {
                                    scenarioData: { id: output.id, name: output.title, type: output.module },
                                    slotData
                                  }
                                })
                              } else {
                                navigate('/datashot/detail', {
                                  state: {
                                    datasetId: output.id,
                                    datasetName: output.title,
                                    slotData
                                  }
                                })
                              }
                            }}
                          >
                            {/* Output Title — 윗줄 */}
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              marginBottom: '3px',
                            }}>
                              <span style={{
                                fontSize: '12px', fontWeight: 500,
                                color: colors.text,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                flex: 1,
                              }}>
                                {output.title}
                              </span>
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '2px',
                                fontSize: '10px', color: colors.textMuted,
                                opacity: hoveredOutput === output.id ? 1 : 0,
                                transition: 'opacity 0.15s',
                                flexShrink: 0,
                                whiteSpace: 'nowrap',
                              }}>
                                결과 보기 →
                              </span>
                            </div>

                            {/* 부가정보 — 아랫줄 */}
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              fontSize: '10px', color: colors.textDim,
                            }}>
                              {/* Reach Caster: prefix + 핵심 지표 */}
                              {output.module && (
                                <>
                                  <span style={{ fontWeight: 500, color: colors.textDim, flexShrink: 0 }}>
                                    {output.module === 'Ratio Finder' ? 'RF' : 'RP'} ·
                                  </span>
                                  {output.reach && (
                                    <span>{output.reach}</span>
                                  )}
                                  {output.keyMetric && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                      <ThumbsUp size={8} />
                                      {output.keyMetric}
                                    </span>
                                  )}
                                </>
                              )}
                              {/* DataShot: 매체명 */}
                              {!output.module && output.media && (
                                <span>{output.media}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                    ) : slot.status === 'coming-soon' ? (
                      <div style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        height: '100%', gap: '8px',
                      }}>
                        <Hourglass size={16} style={{ color: colors.textDim }} />
                        <span style={{
                          fontSize: '11px', color: colors.textDim,
                          fontFamily: 'Paperlogy, sans-serif',
                        }}>
                          Coming Soon
                        </span>
                      </div>
                    ) : (
                      /* Empty */
                      <div style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        height: '100%', gap: '8px',
                      }}>
                        <Inbox size={16} style={{ color: colors.textDim }} />
                        <span style={{
                          fontSize: '11px', color: colors.textDim,
                          fontFamily: 'Paperlogy, sans-serif',
                        }}>
                          Empty
                        </span>
                      </div>
                    )}
                  </div>{/* ── End Output Area ── */}

                  {/* Hover Tooltip removed */}
                </div>
              )
            })}
          </div>
        </section>

        {/* ═══ BOTTOM SECTIONS ═══ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginTop: '48px',
        }}>
          {/* Left: Slot Feed */}
          <div style={{
            padding: '24px',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            backgroundColor: isDarkMode ? colors.surface : 'hsl(var(--card) / 0.2)',
          }}>
            <SlotFeedSection />
          </div>

          {/* Right: Documents */}
          <div style={{
            padding: '24px',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            backgroundColor: isDarkMode ? colors.surface : 'hsl(var(--card) / 0.2)',
          }}>
            <DocumentsSection isAdmin={isAdmin} />
          </div>
        </div>
      </div>

      {/* ═══ Delete Confirm Dialog ═══ */}
      {deleteConfirmOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setDeleteConfirmOpen(false)}
          />
          <div className="dialog-content" style={{
            position: 'relative', padding: '24px',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: colors.text, fontFamily: 'Paperlogy, sans-serif', marginBottom: '8px' }}>
              슬롯을 삭제하시겠습니까?
            </div>
            <div style={{ fontSize: '13px', color: colors.textMuted, fontFamily: 'Paperlogy, sans-serif', marginBottom: '24px', lineHeight: 1.5 }}>
              "{slotData.title}" 슬롯과 관련된 모든 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                style={{
                  padding: '8px 16px', borderRadius: '6px',
                  fontSize: '12px', fontWeight: 500,
                  backgroundColor: 'transparent', color: colors.textMuted,
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer', fontFamily: 'Paperlogy, sans-serif',
                }}
              >
                취소
              </button>
              <button
                onClick={() => { setDeleteConfirmOpen(false); navigate('/slotboard') }}
                style={{
                  padding: '8px 16px', borderRadius: '6px',
                  fontSize: '12px', fontWeight: 600,
                  backgroundColor: 'hsl(var(--destructive))',
                  color: 'hsl(var(--destructive-foreground))',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'Paperlogy, sans-serif',
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Output Selection Dialog ═══ */}
      {outputDialogOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Backdrop */}
          <div
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setOutputDialogOpen(false)}
          />

          {/* Dialog */}
          <div className="dialog-content dialog-lg" style={{
            position: 'relative',
            height: '640px',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Dialog Header */}
            <div style={{
              padding: '20px 24px 0',
              borderBottom: `1px solid ${colors.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: colors.text, fontFamily: 'Paperlogy, sans-serif' }}>
                    Final Strategy Set 관리
                  </div>
                  <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '3px', fontFamily: 'Paperlogy, sans-serif' }}>
                    솔루션별 결과물을 최대 10개까지 선택하세요.
                  </div>
                </div>
                <button
                  onClick={() => setOutputDialogOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '28px', height: '28px', borderRadius: '6px',
                    border: 'none', backgroundColor: 'transparent',
                    color: colors.textMuted, cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '0' }}>
                {INITIAL_FLOW.filter(s => s.status !== 'coming-soon' && AVAILABLE_OUTPUTS[s.key]).map(slot => {
                  const selected = dialogSelections[slot.key] || []
                  const isActive = dialogActiveTab === slot.key
                  return (
                    <button
                      key={slot.key}
                      onClick={() => setDialogActiveTab(slot.key)}
                      style={{
                        padding: '8px 16px',
                        border: 'none', borderBottom: isActive ? `2px solid ${colors.text}` : '2px solid transparent',
                        backgroundColor: 'transparent',
                        color: isActive ? colors.text : colors.textDim,
                        fontSize: '13px', fontWeight: isActive ? 600 : 400,
                        cursor: 'pointer', transition: 'all 0.15s',
                        fontFamily: 'Paperlogy, sans-serif',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      {slot.name}
                      {selected.length > 0 && (
                        <span style={{
                          fontSize: '10px', fontWeight: 700,
                          backgroundColor: colors.text,
                          color: 'hsl(var(--background))',
                          borderRadius: '10px', padding: '0 5px', lineHeight: '16px',
                        }}>
                          {selected.length}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Dialog Body */}
            {(() => {
              const activeSlot = INITIAL_FLOW.find(s => s.key === dialogActiveTab)
              if (!activeSlot) return null
              const allOutputs = AVAILABLE_OUTPUTS[activeSlot.key] || []
              const selected = dialogSelections[activeSlot.key] || []
              const searchQuery = (dialogSearch[activeSlot.key] || '').toLowerCase()
              const filtered = allOutputs.filter(o =>
                o.title.toLowerCase().includes(searchQuery) ||
                (o.module && o.module.toLowerCase().includes(searchQuery)) ||
                (o.insight && o.insight.toLowerCase().includes(searchQuery))
              )

              return (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                  {/* Search */}
                  <div style={{ padding: '12px 24px', borderBottom: `1px solid ${colors.border}` }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '7px 12px', borderRadius: '7px',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: 'hsl(var(--muted) / 0.3)',
                    }}>
                      <Search size={13} style={{ color: colors.textDim, flexShrink: 0 }} />
                      <input
                        type="text"
                        placeholder="결과물 검색..."
                        value={dialogSearch[activeSlot.key] || ''}
                        onChange={e => setDialogSearch(prev => ({ ...prev, [activeSlot.key]: e.target.value }))}
                        style={{
                          flex: 1, border: 'none', background: 'transparent',
                          fontSize: '12px', color: colors.text,
                          fontFamily: 'Paperlogy, sans-serif', outline: 'none',
                        }}
                      />
                      <span style={{ fontSize: '10px', color: colors.textDim, flexShrink: 0 }}>
                        {selected.length}/10 선택
                      </span>
                    </div>
                  </div>

                  {/* Output List */}
                  <div style={{ overflowY: 'auto', flex: 1, padding: '8px 24px' }}>
                    {filtered.length === 0 ? (
                      <div style={{
                        padding: '32px 0', textAlign: 'center',
                        fontSize: '12px', color: colors.textDim,
                        fontFamily: 'Paperlogy, sans-serif',
                      }}>
                        검색 결과가 없습니다.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '4px', paddingBottom: '4px' }}>
                        {filtered.map(output => {
                          const isSelected = selected.includes(output.id)
                          const isDisabled = !isSelected && selected.length >= 10

                          return (
                            <label
                              key={output.id}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 12px', borderRadius: '8px',
                                border: `1px solid ${isSelected ? 'hsl(var(--foreground))' : 'transparent'}`,
                                backgroundColor: isSelected ? 'hsl(var(--muted) / 0.4)' : 'transparent',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                opacity: isDisabled ? 0.35 : 1,
                                transition: 'all 0.12s',
                              }}
                              onMouseEnter={e => { if (!isDisabled && !isSelected) e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.2)' }}
                              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={isDisabled}
                                onChange={() => {
                                  setDialogSelections(prev => {
                                    const current = prev[activeSlot.key] || []
                                    if (isSelected) return { ...prev, [activeSlot.key]: current.filter(id => id !== output.id) }
                                    if (current.length >= 10) return prev
                                    return { ...prev, [activeSlot.key]: [...current, output.id] }
                                  })
                                }}
                                style={{ accentColor: 'hsl(var(--foreground))', flexShrink: 0 }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                  {output.module && (
                                    <span style={{
                                      display: 'inline-flex', alignItems: 'center', gap: '2px',
                                      fontSize: '9px', fontWeight: 600,
                                      padding: '1px 5px', borderRadius: '3px',
                                      backgroundColor: output.module === 'Ratio Finder' ? 'hsl(var(--foreground))' : 'hsl(var(--muted))',
                                      color: output.module === 'Ratio Finder' ? 'hsl(var(--background))' : 'hsl(var(--foreground))',
                                    }}>
                                      {output.module === 'Ratio Finder' ? <Scale size={8} /> : <Target size={8} />}
                                      {output.module === 'Ratio Finder' ? 'RF' : 'RP'}
                                    </span>
                                  )}
                                  <span style={{
                                    fontSize: '13px', fontWeight: 500, color: colors.text,
                                    fontFamily: 'Paperlogy, sans-serif',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                  }}>
                                    {output.title}
                                  </span>
                                </div>
                                {output.media && (
                                  <div style={{
                                    fontSize: '11px', color: colors.textDim,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                  }}>
                                    {output.media}
                                  </div>
                                )}
                                {output.reach && (
                                  <div style={{ fontSize: '11px', color: colors.textDim }}>
                                    통합 Reach 1+ {output.reach}{output.keyMetric && ` · ${output.keyMetric}`}
                                  </div>
                                )}
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}

            {/* Dialog Footer */}
            <div style={{
              padding: '14px 24px',
              borderTop: `1px solid ${colors.border}`,
              display: 'flex', justifyContent: 'flex-end', gap: '8px',
            }}>
              <button
                onClick={() => setOutputDialogOpen(false)}
                style={{
                  padding: '8px 16px', borderRadius: '6px',
                  fontSize: '12px', fontWeight: 500,
                  backgroundColor: 'transparent', color: colors.textMuted,
                  border: `1px solid ${colors.border}`,
                  cursor: 'pointer', fontFamily: 'Paperlogy, sans-serif',
                }}
              >
                취소
              </button>
              <button
                onClick={() => {
                  setSolutionFlow(prev => prev.map(slot => {
                    const selectedIds = dialogSelections[slot.key]
                    if (!selectedIds || selectedIds.length === 0) {
                      if (slot.status === 'coming-soon') return slot
                      return { ...slot, status: 'empty' as const, selectedOutputs: undefined }
                    }
                    const outputs = (AVAILABLE_OUTPUTS[slot.key] || []).filter(o => selectedIds.includes(o.id))
                    return { ...slot, status: 'completed' as const, selectedOutputs: outputs }
                  }))
                  setOutputDialogOpen(false)
                }}
                style={{
                  padding: '8px 16px', borderRadius: '6px',
                  fontSize: '12px', fontWeight: 600,
                  backgroundColor: 'hsl(var(--foreground))',
                  color: 'hsl(var(--background))',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'Paperlogy, sans-serif',
                }}
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
