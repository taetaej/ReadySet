import { useState, useEffect } from 'react'

const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed'
const SIDEBAR_FOLDERS_KEY = 'sidebar-expanded-folders'

export function useSidebarState() {
  // localStorage에서 초기값 가져오기
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
    return stored ? JSON.parse(stored) : false
  })

  const [expandedFolders, setExpandedFolders] = useState<string[]>(() => {
    const stored = localStorage.getItem(SIDEBAR_FOLDERS_KEY)
    return stored ? JSON.parse(stored) : ['samsung', 'samsung-reachcaster']
  })

  // 사이드바 접힘/펼침 상태 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  // 폴더 확장 상태 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(SIDEBAR_FOLDERS_KEY, JSON.stringify(expandedFolders))
  }, [expandedFolders])

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev)
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    )
  }

  return {
    isSidebarCollapsed,
    expandedFolders,
    toggleSidebar,
    toggleFolder
  }
}
