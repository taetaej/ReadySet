import { useState } from 'react'
import { AppLayout } from '../layout/AppLayout'
import { SlotHeader } from '../reachcaster/SlotHeader'
import { DatasetList } from './DatasetList'
import { Dataset } from './types'
import { getDarkMode, toggleDarkMode } from '../../utils/theme'

export function DataShotDetail() {
  const [isDarkMode, setIsDarkMode] = useState(getDarkMode())
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['samsung'])

  const handleToggleDarkMode = () => {
    toggleDarkMode()
    setIsDarkMode(getDarkMode())
  }

  const handleToggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    )
  }

  // 임시 Slot 데이터
  const slotData = {
    title: '삼성 갤럭시 S24 캠페인',
    advertiser: '삼성전자',
    advertiserId: 'ADV001',
    visibility: 'Internal',
    results: 5,
    modified: '2024-01-15',
    description: '2024년 상반기 갤럭시 S24 출시 캠페인'
  }

  // 임시 데이터셋 목록
  const [datasets] = useState<Dataset[]>([
    {
      id: 'DS001',
      name: 'Meta_260115_01',
      description: '2024년 Q4 Meta 캠페인 성과 분석',
      slotId: 'SLOT001',
      slotName: '삼성 갤럭시 S24 캠페인',
      advertiser: '삼성전자',
      media: 'Meta',
      industries: ['tech', 'retail'],
      period: { start: '24-10', end: '24-12' },
      products: ['feed', 'story'],
      metrics: ['impressions', 'clicks', 'cost', 'ctr'],
      status: '완료',
      creator: '김은서',
      createdAt: '2026-01-15',
      rowCount: 15234
    },
    {
      id: 'DS002',
      name: 'Google_260112_01',
      description: 'Google Ads 검색 캠페인 데이터',
      slotId: 'SLOT001',
      slotName: '삼성 갤럭시 S24 캠페인',
      advertiser: '삼성전자',
      media: 'Google Ads',
      industries: ['tech'],
      period: { start: '24-09', end: '24-11' },
      products: ['search', 'display'],
      metrics: ['impressions', 'clicks', 'cost'],
      status: '추출중',
      creator: '박지민',
      createdAt: '2026-01-12'
    },
    {
      id: 'DS003',
      name: 'Kakao_260110_01',
      slotId: 'SLOT001',
      slotName: '삼성 갤럭시 S24 캠페인',
      advertiser: '삼성전자',
      media: '모먼트',
      industries: ['tech', 'automotive'],
      period: { start: '24-08', end: '24-10' },
      products: ['feed'],
      metrics: ['impressions', 'clicks'],
      status: '완료',
      creator: '이수진',
      createdAt: '2026-01-10',
      rowCount: 8921
    },
    {
      id: 'DS004',
      name: 'Naver_260108_01',
      description: '네이버 GFA 캠페인 분석',
      slotId: 'SLOT001',
      slotName: '삼성 갤럭시 S24 캠페인',
      advertiser: '삼성전자',
      media: 'GFA',
      industries: ['tech'],
      period: { start: '24-07', end: '24-09' },
      products: ['display'],
      metrics: ['impressions', 'cost', 'cpm'],
      status: '실패',
      creator: '최민호',
      createdAt: '2026-01-08'
    },
    {
      id: 'DS005',
      name: 'Meta_250315_01',
      description: '2023년 연간 Meta 캠페인 데이터 (만료됨)',
      slotId: 'SLOT001',
      slotName: '삼성 갤럭시 S24 캠페인',
      advertiser: '삼성전자',
      media: 'Meta',
      industries: ['tech'],
      period: { start: '23-01', end: '23-12' },
      products: ['feed', 'story', 'reels'],
      metrics: ['impressions', 'clicks', 'cost'],
      status: '만료',
      creator: '김은서',
      createdAt: '2025-03-15'
    }
  ])

  const handleDatasetClick = (dataset: Dataset) => {
    console.log('Dataset clicked:', dataset)
    // TODO: 데이터셋 상세 페이지로 이동
  }

  const handleCreateDataset = () => {
    console.log('Create new dataset')
    // TODO: 데이터셋 생성 페이지로 이동
  }

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
        isCollapsed,
        expandedFolders,
        onToggleSidebar: () => setIsCollapsed(!isCollapsed),
        onToggleFolder: handleToggleFolder,
        onNavigateToWorkspace: () => console.log('Navigate to workspace')
      }}
    >
      {/* Slot Header */}
      <SlotHeader 
        slotId={1}
        slotData={slotData}
        onEdit={() => console.log('수정')}
        onDelete={() => console.log('삭제')}
      />

      {/* 데이터셋 목록 */}
      <DatasetList
        datasets={datasets}
        onDatasetClick={handleDatasetClick}
        onCreateDataset={handleCreateDataset}
      />
    </AppLayout>
  )
}
