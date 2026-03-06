import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
import { SlotHeader } from '../reachcaster/SlotHeader'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'

export function DataShotDetail() {
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()

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
        { label: 'SlotBoard', href: '/slotboard' },
        { label: slotData.title },
        { label: 'Data Shot' }
      ]}
      isDarkMode={isDarkMode}
      onToggleDarkMode={handleToggleDarkMode}
      sidebarProps={{
        isCollapsed: isSidebarCollapsed,
        expandedFolders: expandedFolders,
        onToggleSidebar: toggleSidebar,
        onToggleFolder: toggleFolder,
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
        {/* 시나리오 섹션 */}
        <div style={{ padding: '24px' }}>
          {/* 타이틀 영역 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'hsl(var(--foreground))'
            }}>
              Scenario
            </h2>
            <button
              style={{
                height: '48px',
                padding: '0 32px',
                borderRadius: '24px',
                background: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                border: 'none',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => console.log('New Scenario 클릭')}
            >
              New Scenario
            </button>
          </div>

          {/* 플레이스홀더 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '48px 24px',
            border: '2px dashed hsl(var(--border))',
            borderRadius: '12px',
            background: 'hsl(var(--muted) / 0.3)'
          }}>
            <div style={{
              textAlign: 'center',
              maxWidth: '600px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '12px',
                color: 'hsl(var(--foreground))'
              }}>
                DataShot 시나리오 목록
              </h3>
              <p style={{
                fontSize: '16px',
                color: 'hsl(var(--muted-foreground))',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                여기에 시나리오 목록이 표시됩니다.
              </p>
              <div style={{
                padding: '16px',
                background: 'hsl(var(--muted))',
                borderRadius: '8px',
                fontSize: '14px',
                color: 'hsl(var(--muted-foreground))',
                textAlign: 'left'
              }}>
                <p style={{ marginBottom: '8px', fontWeight: '600' }}>
                  📝 작업 가이드:
                </p>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>plan/eunseo/README.md 먼저 읽기</li>
                  <li>DataShotList.tsx 컴포넌트 만들기</li>
                  <li>DataShotCard.tsx 컴포넌트 만들기</li>
                  <li>이 영역을 목록으로 교체하기</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
