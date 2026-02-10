import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../utils/theme'

interface ReachPredictorResultProps {
  scenarioData?: any
}

export function ReachPredictorResult({ scenarioData: propScenarioData }: ReachPredictorResultProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const scenarioData = propScenarioData || location.state?.scenarioData
  
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const [allSlotsExpanded, setAllSlotsExpanded] = useState(true)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])

  const toggleAllSlots = () => {
    setAllSlotsExpanded(!allSlotsExpanded)
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    )
  }

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    setDarkModeUtil(newMode)
  }

  return (
    <AppLayout
      currentView="reachPredictorResult"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', onClick: () => navigate('/slotboard') },
        { label: 'Slot', onClick: () => navigate('/reachcaster') },
        { label: scenarioData?.name || 'Reach Predictor Result' }
      ]}
      isDarkMode={isDarkMode}
      onToggleDarkMode={handleToggleDarkMode}
      sidebarProps={{
        allSlotsExpanded,
        expandedFolders,
        onToggleAllSlots: toggleAllSlots,
        onToggleFolder: toggleFolder,
        onNavigateToWorkspace: () => navigate('/slotboard')
      }}
    >
      <div style={{ padding: '24px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '600',
          marginBottom: '8px'
        }} className="text-foreground">
          Reach Predictor Result
        </h1>
        {scenarioData && (
          <p style={{ 
            fontSize: '14px',
            marginBottom: '16px'
          }} className="text-muted-foreground">
            {scenarioData.name} (#{scenarioData.id})
          </p>
        )}
        <p className="text-muted-foreground">
          Coming Soon - 도달률 예측 결과 페이지
        </p>
      </div>
    </AppLayout>
  )
}
