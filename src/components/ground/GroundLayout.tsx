// GroundLayout.tsx — Ground 공통 셸. GNB + 왼쪽 레일(Home · Library · Artifacts · Workflows · Skills · Tools · Recent) + 작업 영역.

import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { Home, Library, Workflow, Plug, Plus, MessageSquare, FileText, Sparkles } from 'lucide-react'
import { GlobalNavBar } from '../layout/GlobalNavBar'
import { getDarkMode, setDarkMode, toggleDarkMode } from '../../utils/theme'
import { useViewer } from './useViewer'
import { useSessions, relDay } from './groundSessions'
import './ground.css'

const NAV = [
  { to: '/ground', label: 'Home', icon: Home, end: true },
  { to: '/ground/library', label: 'Library', icon: Library, end: false },
  { to: '/ground/artifacts', label: 'Artifacts', icon: FileText, end: false },
  { to: '/ground/flow', label: 'Workflows', icon: Workflow, end: false },
  { to: '/ground/skills', label: 'Skills', icon: Sparkles, end: false },
  { to: '/ground/tools', label: 'Tools', icon: Plug, end: false, soon: true },
]

export function GroundLayout({ children, title, bleed = false }: { children: React.ReactNode; title: string; bleed?: boolean }) {
  const [isDarkMode, setIsDarkMode] = useState(getDarkMode())
  const [viewer, setViewer] = useViewer()
  const sessions = useSessions()
  const navigate = useNavigate()
  const { sessionId } = useParams()

  useEffect(() => { setDarkMode(isDarkMode) }, [isDarkMode])
  useEffect(() => { document.title = title }, [title])

  return (
    <div className="workspace">
      <GlobalNavBar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(toggleDarkMode())} />
      <div className="gd-shell">
        <aside className="gd-rail" aria-label="Ground 메뉴">
          <button type="button" className="gd-rail-ask" onClick={() => { navigate('/ground'); setTimeout(() => window.dispatchEvent(new Event('ground:focus')), 60) }}>
            <Plus size={15} aria-hidden /><span>New chat</span><kbd>⌘K</kbd>
          </button>
          <nav className="gd-rail-nav">
            {NAV.map(n => <RailLink key={n.to} {...n} />)}
            <div className="gd-rail-h">Recent</div>
            <ul className="gd-rail-sessions">
              {sessions.length === 0 && <li className="gd-rail-empty">질문하면 여기에 쌓여요</li>}
              {sessions.slice(0, 20).map(s => (
                <li key={s.id}>
                  <NavLink to={`/ground/chat/${s.id}`} className={() => `gd-rail-session ${sessionId === s.id ? 'is-active' : ''}`} title={s.title}>
                    {(() => { const I = s.origin?.type === 'workflow' ? Workflow : s.origin?.type === 'library' ? Library : s.origin?.type === 'artifact' ? FileText : s.origin?.type === 'skill' ? Sparkles : MessageSquare; return <I size={12} aria-hidden className="gd-rail-session-ic" /> })()}
                    <span className="gd-rail-session-t">{s.title}</span>
                    <span className="gd-rail-session-d">{relDay(s.updatedAt)}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* 프로토타입 전용 — 권한별 노출 차이 확인용 */}
          <div className="gd-rail-proto" role="group" aria-label="보기 권한 (프로토타입)">
            <span className="gd-proto-note">권한 시뮬레이션</span>
            <div className="gd-segment">
              <button type="button" aria-pressed={viewer === 'internal'} onClick={() => setViewer('internal')}>임직원</button>
              <button type="button" aria-pressed={viewer === 'external'} onClick={() => setViewer('external')}>외부</button>
            </div>
          </div>
        </aside>

        <main className={`gd ${bleed ? 'is-bleed' : ''}`}>{children}</main>
      </div>
    </div>
  )
}

function RailLink({ to, label, icon: Icon, end, soon }: { to: string; label: string; icon: typeof Home; end: boolean; soon?: boolean }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `gd-rail-item ${isActive ? 'is-active' : ''}`}>
      <Icon size={16} aria-hidden />
      <span>{label}</span>
      {soon && <span className="gd-rail-soon">Soon</span>}
    </NavLink>
  )
}
