import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
import { ACCurationList } from './ACCurationList'
import { getDarkMode, setDarkMode } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'

const sampleSlotData = {
  title: 'CJ올리브영 2026 하반기',
  advertiser: 'CJ올리브영',
  advertiserId: 'AD-2026-001',
  visibility: 'Internal',
  results: 12,
  modified: '2026-11-16',
  description: '2026년 하반기 CJ올리브영 매체·상품 큐레이션'
}

export function ACCurationListPage() {
  const navigate = useNavigate()
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()
  const [isDarkMode, setIsDarkModeState] = useState(() => getDarkMode())

  useEffect(() => {
    setDarkMode(isDarkMode)
  }, [isDarkMode])

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkModeState(newMode)
    setDarkMode(newMode)
  }

  return (
    <AppLayout
      currentView="slotDetail"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', href: '/slotboard' },
        { label: sampleSlotData.title, onClick: () => navigate('/slot/SLT001') },
        { label: 'Ad Curator' }
      ]}
      isDarkMode={isDarkMode}
      onToggleDarkMode={handleToggleDarkMode}
      sidebarProps={{
        isCollapsed: isSidebarCollapsed,
        expandedFolders,
        onToggleSidebar: toggleSidebar,
        onToggleFolder: toggleFolder
      }}
    >
      <ACCurationList
        slotData={sampleSlotData}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </AppLayout>
  )
}
