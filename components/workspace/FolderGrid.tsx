import React from 'react'
import { MoreVertical, Lock, Users, Globe, Star } from 'lucide-react'

type SortField = 'modified' | 'created' | 'advertiser'
type SortDirection = 'asc' | 'desc'

interface SortOption {
  field: SortField
  direction: SortDirection
}

interface FolderGridProps {
  viewType: 'grid' | 'list'
  currentSort: SortOption
}

interface Folder {
  id: string
  name: string
  advertiser: string
  visibility: 'private' | 'internal' | 'shared'
  scenarioCount: number
  completedCount: number
  lastModified: string
  created: string
  creator: string
  brands: string[]
  tags: string[]
  isFavorite: boolean
}

// Mock data
const mockFolders: Folder[] = [
  {
    id: '1',
    name: '삼성 갤럭시 S24 캠페인',
    advertiser: '삼성전자',
    visibility: 'internal',
    scenarioCount: 8,
    completedCount: 5,
    lastModified: '2024-02-20',
    created: '2024-01-15',
    creator: '김마케터',
    brands: ['Galaxy S24', 'Galaxy S24+'],
    tags: ['스마트폰', 'Q1캠페인'],
    isFavorite: true
  },
  {
    id: '2',
    name: 'LG 올레드 TV 런칭',
    advertiser: 'LG전자',
    visibility: 'private',
    scenarioCount: 3,
    completedCount: 2,
    lastModified: '2024-02-18',
    created: '2024-02-01',
    creator: '김마케터',
    brands: ['OLED C4', 'OLED G4'],
    tags: ['TV', '런칭'],
    isFavorite: false
  },
  {
    id: '3',
    name: '현대 아이오닉 6 마케팅',
    advertiser: '현대자동차',
    visibility: 'shared',
    scenarioCount: 12,
    completedCount: 8,
    lastModified: '2024-02-22',
    created: '2024-01-20',
    creator: '박매니저',
    brands: ['아이오닉 6'],
    tags: ['전기차', '친환경'],
    isFavorite: false
  }
]

const visibilityIcons = {
  private: Lock,
  internal: Users,
  shared: Globe
}

export function FolderGrid({ viewType, currentSort }: FolderGridProps) {
  const sortedFolders = [...mockFolders].sort((a, b) => {
    let aValue: string | Date
    let bValue: string | Date

    switch (currentSort.field) {
      case 'created':
        aValue = new Date(a.created)
        bValue = new Date(b.created)
        break
      case 'modified':
        aValue = new Date(a.lastModified)
        bValue = new Date(b.lastModified)
        break
      case 'advertiser':
        aValue = a.advertiser
        bValue = b.advertiser
        break
      default:
        return 0
    }

    if (currentSort.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '오늘'
    if (diffDays === 2) return '1일 전'
    if (diffDays <= 7) return `${diffDays - 1}일 전`
    if (diffDays <= 14) return '1주 전'
    return `${Math.floor(diffDays / 7)}주 전`
  }

  if (viewType === 'list') {
    return (
      <div className="folder-list">
        <div className="folder-list__header">
          <div className="folder-list__col">폴더명</div>
          <div className="folder-list__col">광고주</div>
          <div className="folder-list__col">가시성</div>
          <div className="folder-list__col">시나리오</div>
          <div className="folder-list__col">완료율</div>
          <div className="folder-list__col">수정일</div>
          <div className="folder-list__col"></div>
        </div>
        {sortedFolders.map(folder => (
          <FolderListItem key={folder.id} folder={folder} />
        ))}
      </div>
    )
  }

  return (
    <div className="folder-grid">
      {sortedFolders.map(folder => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
    </div>
  )
}

function FolderCard({ folder }: { folder: Folder }) {
  const VisibilityIcon = visibilityIcons[folder.visibility]
  const completionRate = Math.round((folder.completedCount / folder.scenarioCount) * 100)

  return (
    <div className="folder-card">
      <div className="folder-card__header">
        <div className="folder-card__actions">
          {folder.isFavorite && <Star className="folder-card__favorite" />}
          <button className="folder-card__menu">
            <MoreVertical className="icon" />
          </button>
        </div>
      </div>

      <div className="folder-card__content">
        <h3 className="folder-card__title">{folder.name}</h3>
        <p className="folder-card__advertiser">{folder.advertiser}</p>
        
        <div className="folder-card__stats">
          <div className="folder-card__stat">
            <span className="folder-card__stat-value">{folder.scenarioCount}</span>
            <span className="folder-card__stat-label">시나리오</span>
          </div>
          <div className="folder-card__visibility">
            <VisibilityIcon className="folder-card__visibility-icon" />
            <span className="folder-card__visibility-label">
              {folder.visibility === 'private' ? 'Private' : 
               folder.visibility === 'internal' ? 'Internal' : 'Shared'}
            </span>
          </div>
          <div className="folder-card__stat">
            <span className="folder-card__stat-value">{completionRate}%</span>
            <span className="folder-card__stat-label">완료</span>
          </div>
        </div>

        <div className="folder-card__footer">
          <span className="folder-card__modified">{formatDate(folder.lastModified)}</span>
          <span className="folder-card__creator">{folder.creator}</span>
        </div>
      </div>
    </div>
  )
}

function FolderListItem({ folder }: { folder: Folder }) {
  const VisibilityIcon = visibilityIcons[folder.visibility]
  const completionRate = Math.round((folder.completedCount / folder.scenarioCount) * 100)

  return (
    <div className="folder-list__item">
      <div className="folder-list__col">
        <div className="folder-list__name">
          {folder.isFavorite && <Star className="folder-list__favorite" />}
          {folder.name}
        </div>
      </div>
      <div className="folder-list__col">{folder.advertiser}</div>
      <div className="folder-list__col">
        <div className="folder-list__visibility">
          <VisibilityIcon className="icon" />
          {folder.visibility === 'private' ? 'Private' : 
           folder.visibility === 'internal' ? 'Internal' : 'Shared'}
        </div>
      </div>
      <div className="folder-list__col">{folder.scenarioCount}</div>
      <div className="folder-list__col">{completionRate}%</div>
      <div className="folder-list__col">{formatDate(folder.lastModified)}</div>
      <div className="folder-list__col">
        <button className="folder-list__menu">
          <MoreVertical className="icon" />
        </button>
      </div>
    </div>
  )
}