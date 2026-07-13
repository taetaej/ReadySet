import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AppLayout } from './AppLayout'
import { getDarkMode, toggleDarkMode } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'

interface AccessLogEntry {
  id: number
  startedAt: string
  lastActiveAt: string
  ip: string
}

// Mock 접속 이력 데이터 (30일간)
const accessLogData: AccessLogEntry[] = [
  { id: 1, startedAt: '2026-07-13 09:42', lastActiveAt: '2026-07-13 18:30', ip: '192.168.1.105' },
  { id: 2, startedAt: '2026-07-12 09:15', lastActiveAt: '2026-07-12 18:02', ip: '192.168.1.105' },
  { id: 3, startedAt: '2026-07-11 14:22', lastActiveAt: '2026-07-11 17:45', ip: '10.0.0.52' },
  { id: 4, startedAt: '2026-07-11 09:08', lastActiveAt: '2026-07-11 12:33', ip: '192.168.1.105' },
  { id: 5, startedAt: '2026-07-10 16:33', lastActiveAt: '2026-07-10 19:11', ip: '192.168.1.105' },
  { id: 6, startedAt: '2026-07-10 09:01', lastActiveAt: '2026-07-10 14:28', ip: '192.168.1.105' },
  { id: 7, startedAt: '2026-07-09 17:55', lastActiveAt: '2026-07-09 20:12', ip: '10.0.0.52' },
  { id: 8, startedAt: '2026-07-09 09:12', lastActiveAt: '2026-07-09 17:44', ip: '192.168.1.105' },
  { id: 9, startedAt: '2026-07-08 09:18', lastActiveAt: '2026-07-08 18:55', ip: '192.168.1.105' },
  { id: 10, startedAt: '2026-07-07 15:30', lastActiveAt: '2026-07-07 18:02', ip: '172.16.0.88' },
  { id: 11, startedAt: '2026-07-07 09:05', lastActiveAt: '2026-07-07 13:22', ip: '192.168.1.105' },
  { id: 12, startedAt: '2026-07-06 14:28', lastActiveAt: '2026-07-06 19:15', ip: '192.168.1.105' },
  { id: 13, startedAt: '2026-07-05 09:44', lastActiveAt: '2026-07-05 18:30', ip: '192.168.1.105' },
  { id: 14, startedAt: '2026-07-04 16:55', lastActiveAt: '2026-07-04 19:08', ip: '10.0.0.52' },
  { id: 15, startedAt: '2026-07-04 09:22', lastActiveAt: '2026-07-04 14:45', ip: '192.168.1.105' },
  { id: 16, startedAt: '2026-07-03 09:15', lastActiveAt: '2026-07-03 18:09', ip: '192.168.1.105' },
  { id: 17, startedAt: '2026-07-02 09:30', lastActiveAt: '2026-07-02 17:42', ip: '192.168.1.105' },
  { id: 18, startedAt: '2026-07-01 14:18', lastActiveAt: '2026-07-01 17:55', ip: '10.0.0.52' },
  { id: 19, startedAt: '2026-07-01 09:02', lastActiveAt: '2026-07-01 12:30', ip: '192.168.1.105' },
  { id: 20, startedAt: '2026-06-30 09:11', lastActiveAt: '2026-06-30 18:55', ip: '192.168.1.105' },
  { id: 21, startedAt: '2026-06-29 16:44', lastActiveAt: '2026-06-29 19:22', ip: '172.16.0.88' },
  { id: 22, startedAt: '2026-06-29 09:08', lastActiveAt: '2026-06-29 14:33', ip: '192.168.1.105' },
  { id: 23, startedAt: '2026-06-28 09:15', lastActiveAt: '2026-06-28 18:40', ip: '192.168.1.105' },
  { id: 24, startedAt: '2026-06-27 09:05', lastActiveAt: '2026-06-27 17:33', ip: '192.168.1.105' },
  { id: 25, startedAt: '2026-06-26 09:12', lastActiveAt: '2026-06-26 18:08', ip: '192.168.1.105' },
  { id: 26, startedAt: '2026-06-25 09:01', lastActiveAt: '2026-06-25 17:22', ip: '192.168.1.105' },
  { id: 27, startedAt: '2026-06-24 14:30', lastActiveAt: '2026-06-24 18:15', ip: '10.0.0.52' },
  { id: 28, startedAt: '2026-06-24 09:18', lastActiveAt: '2026-06-24 12:44', ip: '192.168.1.105' },
  { id: 29, startedAt: '2026-06-23 09:22', lastActiveAt: '2026-06-23 17:55', ip: '192.168.1.105' },
  { id: 30, startedAt: '2026-06-22 16:11', lastActiveAt: '2026-06-22 19:30', ip: '172.16.0.88' },
  { id: 31, startedAt: '2026-06-22 09:05', lastActiveAt: '2026-06-22 14:28', ip: '192.168.1.105' },
  { id: 32, startedAt: '2026-06-21 09:08', lastActiveAt: '2026-06-21 18:44', ip: '192.168.1.105' },
  { id: 33, startedAt: '2026-06-20 09:15', lastActiveAt: '2026-06-20 17:30', ip: '192.168.1.105' },
  { id: 34, startedAt: '2026-06-19 09:02', lastActiveAt: '2026-06-19 17:22', ip: '192.168.1.105' },
  { id: 35, startedAt: '2026-06-18 09:10', lastActiveAt: '2026-06-18 14:45', ip: '192.168.1.105' },
]

export function AccessLog() {
  const [isDarkMode, setIsDarkMode] = useState(getDarkMode())
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  const handleToggleDarkMode = () => {
    const newMode = toggleDarkMode()
    setIsDarkMode(newMode)
  }

  const totalItems = accessLogData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentLogs = accessLogData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <AppLayout
      currentView="accessLog"
      isDarkMode={isDarkMode}
      onToggleDarkMode={handleToggleDarkMode}
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', href: '/slotboard' },
        { label: '접속 이력' }
      ]}
      sidebarProps={{
        isCollapsed: isSidebarCollapsed,
        expandedFolders,
        onToggleSidebar: toggleSidebar,
        onToggleFolder: toggleFolder,
        onNavigateToWorkspace: () => {}
      }}
    >
      <div className="workspace-content">
        {/* 페이지 타이틀 */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }} className="text-foreground">
            접속 이력
          </h1>
          <p style={{ fontSize: '13px', margin: '6px 0 0 0' }} className="text-muted-foreground">
            최근 30일간의 접속 이력이 보여집니다.
          </p>
        </div>

        {/* 테이블 */}
        <div className="table-container">
          <div className="table-scroll-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>접속 시작</th>
                  <th>마지막 활동</th>
                  <th>IP 주소</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '13px' }}>{log.startedAt}</td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '13px' }}>{log.lastActiveAt}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '24px'
        }}>
          {/* 좌측: 페이지 크기 선택 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px' }} className="text-muted-foreground">
              페이지당 표시:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="input"
              style={{ 
                width: '80px',
                height: '32px',
                minHeight: '32px',
                padding: '4px 8px',
                fontSize: '14px'
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* 우측: 페이지 정보 및 네비게이션 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* 페이지 정보 */}
            <span style={{ fontSize: '14px' }} className="text-muted-foreground">
              {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} / {totalItems}개
            </span>

            {/* 페이지 네비게이션 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* 첫 페이지로 */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="btn btn-ghost btn-sm"
                style={{ 
                  width: '32px', 
                  height: '32px',
                  padding: '0',
                  opacity: currentPage === 1 ? 0.5 : 1,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={14} />
                <ChevronLeft size={14} style={{ marginLeft: '-8px' }} />
              </button>

              {/* 이전 페이지 */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-ghost btn-sm"
                style={{ 
                  width: '32px', 
                  height: '32px',
                  padding: '0',
                  opacity: currentPage === 1 ? 0.5 : 1,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={14} />
              </button>

              {/* 페이지 번호들 */}
              {(() => {
                const pages = []
                const maxVisible = 5
                let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
                const end = Math.min(totalPages, start + maxVisible - 1)

                if (end - start + 1 < maxVisible) {
                  start = Math.max(1, end - maxVisible + 1)
                }

                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`btn btn-sm ${
                        currentPage === i ? 'btn-primary' : 'btn-ghost'
                      }`}
                      style={{ 
                        width: '32px', 
                        height: '32px',
                        padding: '0',
                        fontSize: '14px',
                        fontWeight: currentPage === i ? '600' : '400'
                      }}
                    >
                      {i}
                    </button>
                  )
                }

                return pages
              })()}

              {/* 다음 페이지 */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-ghost btn-sm"
                style={{ 
                  width: '32px', 
                  height: '32px',
                  padding: '0',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronRight size={14} />
              </button>

              {/* 마지막 페이지로 */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="btn btn-ghost btn-sm"
                style={{ 
                  width: '32px', 
                  height: '32px',
                  padding: '0',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronRight size={14} />
                <ChevronRight size={14} style={{ marginLeft: '-8px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
