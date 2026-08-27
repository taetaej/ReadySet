import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
import { BOScenarioList } from './BOScenarioList'
import { getDarkMode, setDarkMode } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'

const sampleSlotData = {
  title: 'CJ올리브영 2025 하반기',
  advertiser: 'CJ올리브영',
  advertiserId: 'AD-2025-001',
  visibility: 'Internal',
  results: 8,
  modified: '2025-08-20',
  description: '2025년 하반기 CJ올리브영 디지털 광고 예산 최적화'
}

export function BOScenarioListPage() {
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
        { label: sampleSlotData.title, onClick: () => navigate(`/slot/SLT001`) },
        { label: 'Budget Optimizer' }
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
      <BOScenarioList
        slotData={sampleSlotData}
        onBack={() => navigate('/slotboard')}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </AppLayout>
  )
}
