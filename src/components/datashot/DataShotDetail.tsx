import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
import { SlotHeader } from '../reachcaster/SlotHeader'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'

export function DataShotDetail() {
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['samsung', 'samsung-datashot'])

  useEffect(() => {
    setDarkModeUtil(isDarkMode)
  }, [isDarkMode])

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    setDarkModeUtil(newMode)
  }

  // 샘플 Slot 데이터 (실제로는 props나 API에서 가져올 것)
  const slotData = {
    title: '삼성 갤럭시 S24 캠페인',
    advertiser: '삼성전자',
    advertiserId: 'ADV001',
    visibility: 'Internal',
    results: 5,
    modified: '2024-01-15',
    description: '삼성 갤럭시 S24 출시를 위한 마케팅 캠페인입니다.'
  }

  const slotId = 1

  return (
    <AppLayout
      currentView="datashot"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', onClick: () => navigate('/slotboard') },
        { label: slotData.title, onClick: () => navigate('/slotboard') },
        { label: 'DataShot' }
      ]}
      isDarkMode={isDarkMode}
      onToggleDarkMode={handleToggleDarkMode}
      sidebarProps={{
        isCollapsed: isSidebarCollapsed,
        expandedFolders: expandedFolders,
        onToggleSidebar: () => setIsSidebarCollapsed(!isSidebarCollapsed),
        onToggleFolder: (folderId: string) => {
          setExpandedFolders(prev => 
            prev.includes(folderId) 
              ? prev.filter(id => id !== folderId)
              : [...prev, folderId]
          )
        },
        onNavigateToWorkspace: () => navigate('/slotboard')
      }}
    >
      {/* Slot 정보 헤더 */}
      <SlotHeader 
        slotId={slotId}
        slotData={slotData}
        onEdit={() => console.log('Edit slot')}
        onDelete={() => console.log('Delete slot')}
      />

      {/* DataShot 콘텐츠 영역 */}
      <div className="workspace-content">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '48px 24px'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '600px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'hsl(var(--foreground))'
            }}>
              DataShot
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'hsl(var(--muted-foreground))',
              lineHeight: '1.6'
            }}>
              은서 작업 예정
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
