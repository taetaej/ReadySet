import React from 'react'
import { GlobalNavBar } from './GlobalNavBar'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { Breadcrumb } from './Breadcrumb'

interface AppLayoutProps {
  children: React.ReactNode
  currentView: string
  showBreadcrumb?: boolean
  breadcrumbItems?: Array<{ label: string; href?: string; onClick?: () => void }>
  isDarkMode: boolean
  onToggleDarkMode: () => void
  sidebarProps?: any
}

export function AppLayout({ 
  children, 
  currentView, 
  showBreadcrumb = true,
  breadcrumbItems = [],
  isDarkMode,
  onToggleDarkMode,
  sidebarProps
}: AppLayoutProps) {
  return (
    <div className={`workspace ${currentView === 'workspace' ? 'workspace--slotboard' : ''}`}>
      {/* Global Navigation Bar */}
      <GlobalNavBar 
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      <div className="workspace-layout workspace-layout--expanded">
        {/* Sidebar */}
        <Sidebar {...sidebarProps} />

        {/* Main Content */}
        <main className="workspace-main">
          {/* Breadcrumb - 조건부 표시 */}
          {showBreadcrumb && (
            <Breadcrumb items={breadcrumbItems || []} />
          )}

          {/* Page Content */}
          {children}

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  )
}