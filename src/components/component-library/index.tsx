import { useState } from 'react'
import { AppLayout } from '../layout/AppLayout'
import { ButtonSection } from './ButtonSection'
import { InputSection } from './InputSection'
import { DatePickerSection } from './DatePickerSection'
import { TableSection } from './TableSection'
import { FeedbackSection } from './FeedbackSection'
import { DialogSection } from './DialogSection'
import { AvatarSection } from './AvatarSection'
import { MediaIconSection } from './MediaIconSection'
import { SpinXSection } from './SpinXSection'
import { TargetGrpSection } from './TargetGrpSection'

export function ComponentLibrary() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('darkMode', JSON.stringify(newMode))
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleToggleSidebar = () => setIsCollapsed(!isCollapsed)
  const handleToggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) ? prev.filter(id => id !== folderId) : [...prev, folderId]
    )
  }
  const handleNavigateToWorkspace = () => {}

  const sections = [
    { id: 'buttons', label: 'Buttons' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'date-pickers', label: 'Date Pickers' },
    { id: 'tables', label: 'Tables' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'dialogs', label: 'Dialogs' },
    { id: 'avatars', label: 'Avatars' },
    { id: 'media-icons', label: 'Media Icons' },
    { id: 'spinx', label: 'SpinX' },
    { id: 'target-grp', label: 'Target GRP' },
  ]

  return (
    <AppLayout 
      isDarkMode={isDarkMode} 
      onToggleDarkMode={toggleDarkMode}
      currentView="component-library"
      showBreadcrumb={true}
      breadcrumbItems={[{ label: 'Component Library' }]}
      sidebarProps={{
        isCollapsed,
        expandedFolders,
        onToggleSidebar: handleToggleSidebar,
        onToggleFolder: handleToggleFolder,
        onNavigateToWorkspace: handleNavigateToWorkspace
      }}
    >
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: 'hsl(var(--foreground))' }}>
            Component Library
          </h1>
          <p style={{ fontSize: '16px', color: 'hsl(var(--muted-foreground))' }}>
            ReadySet 디자인 시스템의 실제 사용 컴포넌트 모음
          </p>

          {/* 섹션 앵커 내비게이션 */}
          <nav style={{ 
            marginTop: '24px', 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px' 
          }}>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'hsl(var(--muted-foreground))',
                  border: '1px solid hsl(var(--border))',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
                  e.currentTarget.style.color = 'hsl(var(--foreground))'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'hsl(var(--muted-foreground))'
                }}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>

        <div id="buttons"><ButtonSection /></div>
        <div id="inputs"><InputSection /></div>
        <div id="date-pickers"><DatePickerSection /></div>
        <div id="tables"><TableSection /></div>
        <div id="feedback"><FeedbackSection /></div>
        <div id="dialogs"><DialogSection /></div>
        <div id="avatars"><AvatarSection /></div>
        <div id="media-icons"><MediaIconSection /></div>
        <div id="spinx"><SpinXSection /></div>
        <div id="target-grp"><TargetGrpSection /></div>
      </div>
    </AppLayout>
  )
}
