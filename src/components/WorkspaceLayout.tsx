import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Trash2, X, ChevronDown, Filter, LayoutGrid, List } from 'lucide-react'
import { CreateFolder } from './CreateFolder'
import { EditFolder } from './EditFolder'
import { SlotCard } from './SlotCard'
import { SlotListItem } from './SlotListItem'
import { PageHeader } from './PageHeader'
import { SlotDetail } from './SlotDetail'
import { AppLayout } from './layout/AppLayout'
import { WelcomeSection } from './WelcomeSection'
import { getDarkMode, setDarkMode } from '../utils/theme'

export function SlotBoardLayout({ initialView = 'workspace' }: { initialView?: 'workspace' | 'createFolder' | 'editFolder' | 'slotDetail' }) {
  console.log('SlotBoardLayout 컴포넌트 렌더링됨')
  
  const navigate = useNavigate()
  
  // 샘플 Slot 데이터
  const sampleFolders = [
    { id: 'SLT001', title: '삼성 갤럭시 S24 캠페인', advertiser: '삼성전자', advertiserId: 'ADV001', visibility: 'Internal', results: 5, modified: '2024-01-15', description: '삼성 갤럭시 S24 출시를 위한 마케팅 캠페인입니다.', solutions: { reachCaster: 1, budgetOptimizer: 1, metricHub: 1 } },
    { id: 'SLT002', title: 'LG 올레드 TV 런칭 캠페인 - 2024년 상반기 프리미엄 라인업 출시 기념', advertiser: 'LG전자', advertiserId: 'ADV002', visibility: 'Private', results: 3, modified: '2024-01-14', description: 'LG 올레드 TV 신제품 런칭 캠페인', solutions: { reachCaster: 1, budgetOptimizer: 0, metricHub: 1 } },
    { id: 'SLT003', title: '현대 아이오닉 6 마케팅', advertiser: '현대자동차', advertiserId: 'ADV003', visibility: 'Shared', results: 12, modified: '2024-01-13', description: '현대 아이오닉 6 전기차 마케팅 프로젝트', solutions: { reachCaster: 1, budgetOptimizer: 1, metricHub: 1 } },
    { id: 'SLT004', title: '네이버 쇼핑 프로모션 - 연말 대규모 할인 이벤트 및 브랜드 파트너십 확대 전략', advertiser: '네이버', advertiserId: 'ADV004', visibility: 'Internal', results: 8, modified: '2024-01-12', description: '네이버 쇼핑 연말 프로모션 기획', solutions: { reachCaster: 1, budgetOptimizer: 1, metricHub: 0 } },
    { id: 'SLT005', title: '카카오톡 광고 캠페인', advertiser: '카카오', advertiserId: 'ADV005', visibility: 'Private', results: 6, modified: '2024-01-11', description: '카카오톡 광고 플랫폼 홍보 캠페인', solutions: { reachCaster: 0, budgetOptimizer: 1, metricHub: 1 } },
    { id: 'SLT006', title: '쿠팡 로켓배송 홍보', advertiser: '쿠팡', advertiserId: 'ADV006', visibility: 'Shared', results: 15, modified: '2024-01-10', description: '쿠팡 로켓배송 서비스 홍보', solutions: { reachCaster: 1, budgetOptimizer: 1, metricHub: 1 } },
    { id: 'SLT007', title: 'SK텔레콤 5G 서비스 런칭', advertiser: 'SK텔레콤', advertiserId: 'ADV007', visibility: 'Internal', results: 9, modified: '2024-01-09', description: 'SK텔레콤 5G 서비스 런칭 캠페인', solutions: { reachCaster: 1, budgetOptimizer: 0, metricHub: 0 } },
    { id: 'SLT008', title: 'KT 인터넷 서비스 프로모션', advertiser: 'KT', advertiserId: 'ADV008', visibility: 'Private', results: 7, modified: '2024-01-08', description: 'KT 인터넷 서비스 프로모션', solutions: { reachCaster: 0, budgetOptimizer: 1, metricHub: 0 } },
    { id: 'SLT009', title: 'LG유플러스 모바일 요금제', advertiser: 'LG유플러스', advertiserId: 'ADV009', visibility: 'Shared', results: 11, modified: '2024-01-07', description: 'LG유플러스 모바일 요금제 홍보', solutions: { reachCaster: 1, budgetOptimizer: 1, metricHub: 1 } },
    { id: 'SLT010', title: '롯데마트 온라인 쇼핑몰', advertiser: '롯데마트', advertiserId: 'ADV010', visibility: 'Internal', results: 4, modified: '2024-01-06', description: '롯데마트 온라인 쇼핑몰 프로모션', solutions: { reachCaster: 0, budgetOptimizer: 0, metricHub: 1 } },
    { id: 'SLT011', title: '이마트 트레이더스 멤버십', advertiser: '이마트', advertiserId: 'ADV011', visibility: 'Private', results: 13, modified: '2024-01-05', description: '이마트 트레이더스 멤버십 캠페인', solutions: { reachCaster: 1, budgetOptimizer: 1, metricHub: 1 } },
    { id: 'SLT012', title: '홈플러스 배송 서비스', advertiser: '홈플러스', advertiserId: 'ADV012', visibility: 'Shared', results: 8, modified: '2024-01-04', description: '홈플러스 배송 서비스 홍보', solutions: { reachCaster: 1, budgetOptimizer: 0, metricHub: 1 } },
    { id: 'SLT013', title: 'CJ올리브영 뷰티 페스티벌', advertiser: 'CJ올리브영', advertiserId: 'ADV013', visibility: 'Internal', results: 16, modified: '2024-01-03', description: 'CJ올리브영 뷰티 페스티벌 캠페인', solutions: { reachCaster: 1, budgetOptimizer: 1, metricHub: 1 } },
    { id: 'SLT014', title: '신세계백화점 VIP 이벤트', advertiser: '신세계백화점', advertiserId: 'ADV014', visibility: 'Private', results: 6, modified: '2024-01-02', description: '신세계백화점 VIP 이벤트', solutions: { reachCaster: 0, budgetOptimizer: 1, metricHub: 0 } },
    { id: 'SLT015', title: '현대백화점 면세점 프로모션', advertiser: '현대백화점', advertiserId: 'ADV015', visibility: 'Shared', results: 10, modified: '2024-01-01', description: '현대백화점 면세점 프로모션', solutions: { reachCaster: 1, budgetOptimizer: 1, metricHub: 0 } },
    { id: 'SLT016', title: '갤러리아백화점 럭셔리 브랜드', advertiser: '갤러리아백화점', advertiserId: 'ADV016', visibility: 'Internal', results: 14, modified: '2023-12-31', description: '갤러리아백화점 럭셔리 브랜드 캠페인', solutions: { reachCaster: 1, budgetOptimizer: 1, metricHub: 1 } },
    { id: 'SLT017', title: 'AK플라자 패션 위크', advertiser: 'AK플라자', advertiserId: 'ADV017', visibility: 'Private', results: 7, modified: '2023-12-30', description: 'AK플라자 패션 위크 이벤트', solutions: { reachCaster: 0, budgetOptimizer: 0, metricHub: 1 } },
    { id: 'SLT018', title: '롯데백화점 크리스마스 세일', advertiser: '롯데백화점', advertiserId: 'ADV018', visibility: 'Shared', results: 12, modified: '2023-12-29', description: '롯데백화점 크리스마스 세일', solutions: { reachCaster: 1, budgetOptimizer: 1, metricHub: 1 } },
    { id: 'SLT019', title: 'GS25 편의점 신상품', advertiser: 'GS25', advertiserId: 'ADV019', visibility: 'Internal', results: 5, modified: '2023-12-28', description: 'GS25 편의점 신상품 프로모션', solutions: { reachCaster: 1, budgetOptimizer: 0, metricHub: 0 } },
    { id: 'SLT020', title: 'CU 편의점 멤버십', advertiser: 'CU', advertiserId: 'ADV020', visibility: 'Private', results: 9, modified: '2023-12-27', description: 'CU 편의점 멤버십 캠페인', solutions: { reachCaster: 0, budgetOptimizer: 1, metricHub: 1 } },
    { id: 'SLT021', title: '세븐일레븐 도시락 프로모션', advertiser: '세븐일레븐', advertiserId: 'ADV021', visibility: 'Shared', results: 11, modified: '2023-12-26', description: '세븐일레븐 도시락 프로모션', solutions: { reachCaster: 1, budgetOptimizer: 1, metricHub: 1 } },
    { id: 'SLT022', title: '이디야커피 신메뉴 런칭', advertiser: '이디야커피', advertiserId: 'ADV022', visibility: 'Internal', results: 8, modified: '2023-12-25', description: '이디야커피 신메뉴 런칭 캠페인', solutions: { reachCaster: 1, budgetOptimizer: 0, metricHub: 1 } },
    { id: 'SLT023', title: '스타벅스 시즌 한정 메뉴', advertiser: '스타벅스', advertiserId: 'ADV023', visibility: 'Private', results: 15, modified: '2023-12-24', description: '스타벅스 시즌 한정 메뉴 프로모션', solutions: { reachCaster: 1, budgetOptimizer: 1, metricHub: 1 } },
    { id: 'SLT024', title: '투썸플레이스 케이크 페스티벌', advertiser: '투썸플레이스', advertiserId: 'ADV024', visibility: 'Shared', results: 6, modified: '2023-12-23', description: '투썸플레이스 케이크 페스티벌', solutions: { reachCaster: 0, budgetOptimizer: 0, metricHub: 0 } },
    { id: 'SLT025', title: '맥도날드 해피밀 캠페인', advertiser: '맥도날드', advertiserId: 'ADV025', visibility: 'Internal', results: 13, modified: '2023-12-22', description: '맥도날드 해피밀 캠페인', solutions: { reachCaster: 1, budgetOptimizer: 1, metricHub: 0 } }
  ]

  const [allSlotsExpanded, setAllSlotsExpanded] = useState(true) // 기본적으로 모든 Slot 펼쳐진 상태
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['samsung', 'lg', 'hyundai', 'samsung-reachcaster']) // 기본적으로 모든 폴더 펼쳐진 상태
  const [contextMenuOpen, setContextMenuOpen] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const [currentView, setCurrentView] = useState<'workspace' | 'createFolder' | 'editFolder' | 'slotDetail'>(initialView)
  const [editingFolder, setEditingFolder] = useState<any>(null)
  const [selectedSlot, setSelectedSlot] = useState<any>(initialView === 'slotDetail' ? sampleFolders[0] : null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingFolder, setDeletingFolder] = useState<string | null>(null)
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20) // 페이지 크기 변경 가능하게
  const [isManagementMode, setIsManagementMode] = useState(false) // Slot 관리 모드
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]) // 선택된 Slot들
  const [searchExpanded, setSearchExpanded] = useState(false) // 검색 필드 확장 상태
  const [searchQuery, setSearchQuery] = useState('') // 검색 쿼리
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid') // Grid/List 뷰 타입
  
  // 필터 & 정렬 상태
  const [filterOpen, setFilterOpen] = useState(false)
  const [advertiserFilter, setAdvertiserFilter] = useState<string[]>([])
  const [visibilityFilter, setVisibilityFilter] = useState<string[]>([])
  const [advertiserSearchQuery, setAdvertiserSearchQuery] = useState('')
  const [sortField, setSortField] = useState<'id' | 'title' | 'advertiser' | 'results' | 'created' | 'modified'>('modified')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // 토스트 자동 닫기
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  // 페이지 타이틀 업데이트
  useEffect(() => {
    const titles = {
      workspace: 'SlotBoard - ReadySet',
      createFolder: '새 Slot 생성 - ReadySet',
      editFolder: 'Slot 수정 - ReadySet',
      slotDetail: selectedSlot ? `${selectedSlot.title} - ReadySet` : 'Slot 상세 - ReadySet'
    }
    document.title = titles[currentView as keyof typeof titles] || 'ReadySet'
  }, [currentView, selectedSlot])

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 컨텍스트 메뉴 외부 클릭 시 닫기 - 드롭다운 아이템 클릭은 제외
      const target = event.target as Element
      if (!target.closest('.dropdown') && !target.closest('[data-context-menu]')) {
        setContextMenuOpen(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 다크모드 토글
  useEffect(() => {
    setDarkMode(isDarkMode)
  }, [isDarkMode])

  // 모든 Slot 펼치기/접기 토글
  const toggleAllSlots = () => {
    if (allSlotsExpanded) {
      // 모두 접기
      setExpandedFolders([])
      setAllSlotsExpanded(false)
    } else {
      // 모두 펼치기
      const allSlotIds = ['samsung', 'lg', 'hyundai'] // 모든 Slot ID들
      const allSubIds = ['samsung-reachcaster'] // 하위 솔루션들도 포함
      setExpandedFolders([...allSlotIds, ...allSubIds])
      setAllSlotsExpanded(true)
    }
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    )
  }

  const handleContextMenu = (folderTitle: string, action: 'edit' | 'delete') => {
    console.log('handleContextMenu 호출됨:', folderTitle, action)
    
    // 컨텍스트 메뉴를 약간 지연시켜 닫기
    setTimeout(() => {
      setContextMenuOpen(null)
    }, 100)
    
    switch (action) {
      case 'edit':
        console.log('수정:', folderTitle)
        const folderToEdit = sampleFolders.find(f => f.title === folderTitle)
        if (folderToEdit) {
          setEditingFolder({
            id: `folder-${Date.now()}`,
            folderName: folderToEdit.title,
            folderDescription: folderToEdit.description,
            advertiserId: folderToEdit.advertiserId,
            advertiserName: folderToEdit.advertiser,
            visibility: folderToEdit.visibility
          })
          setCurrentView('editFolder')
        }
        break
      case 'delete':
        console.log('삭제:', folderTitle)
        setDeletingFolder(folderTitle)
        setShowDeleteDialog(true)
        break
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingFolder) return
    
    try {
      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 성공 시
      setShowToast({ type: 'success', message: `"${deletingFolder}" Slot이 성공적으로 삭제되었습니다.` })
      
    } catch (error) {
      // 실패 시
      setShowToast({ type: 'error', message: 'Slot 삭제에 실패했습니다. 다시 시도해주세요.' })
    } finally {
      setShowDeleteDialog(false)
      setDeletingFolder(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setDeletingFolder(null)
  }

  // 다크모드 토글 핸들러
  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    setDarkMode(newMode)
  }

  // 뷰 전환 핸들러
  const handleCreateFolder = () => {
    console.log('새 Slot 버튼 클릭됨')
    setCurrentView('createFolder')
    navigate('/slotboard')
  }

  const handleBackToWorkspace = () => {
    setCurrentView('workspace')
    setEditingFolder(null)
    setSelectedSlot(null)
    navigate('/slotboard')
  }

  const handleFolderCreated = () => {
    setCurrentView('workspace')
    setSelectedSlot(null)
    navigate('/slotboard')
    // 여기에 Slot 목록 새로고침 로직을 추가할 수 있습니다
  }

  const handleFolderUpdated = () => {
    setCurrentView('workspace')
    setEditingFolder(null)
    setSelectedSlot(null)
    navigate('/slotboard')
    // 여기에 Slot 목록 새로고침 로직을 추가할 수 있습니다
  }

  // Slot 관리 모드 관련 함수들
  const toggleManagementMode = () => {
    setIsManagementMode(!isManagementMode)
    setSelectedFolders([]) // 모드 전환 시 선택 초기화
  }

  const toggleFolderSelection = (folderTitle: string) => {
    setSelectedFolders(prev => {
      const newSelection = prev.includes(folderTitle)
        ? prev.filter(title => title !== folderTitle)
        : [...prev, folderTitle]
      
      // 체크박스 선택 시 자동으로 관리모드 진입
      if (newSelection.length > 0 && !isManagementMode) {
        setIsManagementMode(true)
      }
      // 모든 체크박스 해제 시 관리모드 해제
      if (newSelection.length === 0 && isManagementMode) {
        setIsManagementMode(false)
      }
      
      return newSelection
    })
  }

  const selectAllFolders = () => {
    const allCurrentFolderTitles = currentFolders.map(folder => folder.title)
    setSelectedFolders(allCurrentFolderTitles)
    if (!isManagementMode) {
      setIsManagementMode(true)
    }
  }

  const deselectAllFolders = () => {
    setSelectedFolders([])
    setIsManagementMode(false)
  }

  const deleteSelectedFolders = () => {
    if (selectedFolders.length === 0) return
    
    // 여러 Slot 삭제 확인 다이얼로그
    const folderText = selectedFolders.length === 1 ? '1개 Slot' : `${selectedFolders.length}개 Slot`
    if (window.confirm(`선택한 ${folderText}를 삭제하시겠습니까? 삭제된 Slot은 복원할 수 없습니다.`)) {
      // 실제로는 API 호출
      setShowToast({ 
        type: 'success', 
        message: `${folderText}가 성공적으로 삭제되었습니다.` 
      })
      setSelectedFolders([])
      setIsManagementMode(false)
    }
  }

  const handleFolderClick = (folder: any) => {
    if (isManagementMode) {
      // 관리 모드에서는 Slot 선택/해제
      toggleFolderSelection(folder.title)
    } else {
      // 일반 모드에서는 Slot 상세로 이동
      console.log('Slot 상세로 이동:', folder.title)
      setSelectedSlot(folder)
      setCurrentView('slotDetail')
      navigate('/reachcaster')
    }
  }

  // 검색, 필터, 정렬 적용
  const filteredAndSortedFolders = sampleFolders
    .filter(folder => {
      // 검색 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchTitle = folder.title.toLowerCase().includes(query)
        const matchAdvertiser = folder.advertiser.toLowerCase().includes(query)
        if (!matchTitle && !matchAdvertiser) return false
      }
      
      // 광고주 필터
      if (advertiserFilter.length > 0 && !advertiserFilter.includes(folder.advertiser)) return false
      
      // 가시성 필터
      if (visibilityFilter.length > 0 && !visibilityFilter.includes(folder.visibility)) return false
      
      return true
    })
    .sort((a, b) => {
      let aVal: any
      let bVal: any
      
      if (sortField === 'id') {
        aVal = a.id
        bVal = b.id
      } else if (sortField === 'title') {
        aVal = a.title
        bVal = b.title
      } else if (sortField === 'advertiser') {
        aVal = a.advertiser
        bVal = b.advertiser
      } else if (sortField === 'results') {
        aVal = a.results
        bVal = b.results
      } else if (sortField === 'created') {
        // 생성일시는 샘플 데이터에 없어서 modified 사용
        aVal = a.modified
        bVal = b.modified
      } else {
        aVal = a.modified
        bVal = b.modified
      }
      
      const modifier = sortOrder === 'asc' ? 1 : -1
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * modifier
      }
      return (aVal > bVal ? 1 : -1) * modifier
    })

  // 페이지네이션 로직
  const totalItems = filteredAndSortedFolders.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentFolders = filteredAndSortedFolders.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 페이지네이션 컴포넌트 (Shadcn 스타일)
  const renderPagination = () => {
    if (totalPages <= 1) return null

    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginTop: '2rem',
        marginBottom: '1rem'
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
            <option value={100}>100</option>
          </select>
        </div>

        {/* 우측: 페이지 정보 및 네비게이션 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* 페이지 정보 */}
          <span style={{ fontSize: '14px' }} className="text-muted-foreground">
            {startItem}-{endItem} / {totalItems}개
          </span>

          {/* 페이지 네비게이션 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* 첫 페이지로 */}
            <button
              onClick={() => handlePageChange(1)}
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
              onClick={() => handlePageChange(currentPage - 1)}
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
              let end = Math.min(totalPages, start + maxVisible - 1)

              if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1)
              }

              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
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
              onClick={() => handlePageChange(currentPage + 1)}
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
              onClick={() => handlePageChange(totalPages)}
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
    )
  }

  return (
    <AppLayout
      currentView={currentView}
      showBreadcrumb={currentView !== 'workspace'}
      breadcrumbItems={
        currentView === 'createFolder' 
          ? [{ label: 'SlotBoard', onClick: () => setCurrentView('workspace') }, { label: '새 Slot 생성' }]
          : currentView === 'editFolder'
          ? [{ label: 'SlotBoard', onClick: () => setCurrentView('workspace') }, { label: 'Slot 수정' }]
          : currentView === 'slotDetail' && selectedSlot
          ? [{ label: 'SlotBoard', onClick: () => setCurrentView('workspace') }, { label: selectedSlot.title }]
          : []
      }
      isDarkMode={isDarkMode}
      onToggleDarkMode={handleToggleDarkMode}
      sidebarProps={{
        allSlotsExpanded,
        expandedFolders,
        onToggleAllSlots: toggleAllSlots,
        onToggleFolder: toggleFolder,
        onNavigateToWorkspace: () => setCurrentView('workspace')
      }}
    >
      {currentView === 'createFolder' && (
        <CreateFolder 
          onBack={handleBackToWorkspace}
          onSuccess={handleFolderCreated}
        />
      )}

      {/* Slot 수정 페이지 */}
      {currentView === 'editFolder' && editingFolder && (
        <EditFolder 
          onBack={handleBackToWorkspace}
          onSuccess={handleFolderUpdated}
          folderData={editingFolder}
        />
      )}

      {/* Slot 상세 페이지 */}
      {currentView === 'slotDetail' && selectedSlot && (
        <SlotDetail 
          slotData={selectedSlot}
          onBack={handleBackToWorkspace}
          onEdit={() => {
            // Slot 수정 페이지로 이동
            const folderToEdit = {
              id: `folder-${Date.now()}`,
              folderName: selectedSlot.title,
              folderDescription: selectedSlot.description,
              advertiserId: selectedSlot.advertiserId,
              advertiserName: selectedSlot.advertiser,
              visibility: selectedSlot.visibility
            }
            setEditingFolder(folderToEdit)
            setCurrentView('editFolder')
          }}
          onDelete={() => {
            // 삭제 다이얼로그 표시
            setDeletingFolder(selectedSlot.title)
            setShowDeleteDialog(true)
          }}
        />
      )}

      {/* 워크스페이스 메인 화면 */}
      {currentView === 'workspace' && (
        <>
          {/* Welcome Section */}
          <WelcomeSection userName="Jia Shin" />

          {/* Page Header */}
          <PageHeader 
            title="SlotBoard"
            onCreateSlot={handleCreateFolder}
            totalResults={119}
            benchmarkResults={23}
            adCuratorResults={31}
            budgetOptimizerResults={17}
            reachCasterResults={48}
            isManagementMode={isManagementMode}
          />

          {/* Search & Filter */}
          <section className="workspace-search-section" style={{ 
            borderBottom: 'none',
            backgroundColor: 'transparent',
            paddingTop: '8px',
            paddingBottom: '16px'
          }}>
            {/* 좌측: Grid/List 토글 + Slot 개수 표시 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '8px' }}>
              {/* Grid/List 뷰 토글 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => setViewType('grid')}
                  className="btn btn-ghost btn-sm"
                  style={{
                    borderRadius: 0,
                    border: 'none',
                    backgroundColor: viewType === 'grid' ? 'hsl(var(--muted))' : 'transparent',
                    padding: '8px 12px'
                  }}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewType('list')}
                  className="btn btn-ghost btn-sm"
                  style={{
                    borderRadius: 0,
                    border: 'none',
                    backgroundColor: viewType === 'list' ? 'hsl(var(--muted))' : 'transparent',
                    padding: '8px 12px'
                  }}
                >
                  <List size={16} />
                </button>
              </div>
              
              {/* Slot 개수 */}
              <span style={{ 
                fontSize: '14px', 
                color: 'hsl(var(--muted-foreground))'
              }}>
                {filteredAndSortedFolders.length} Slots
              </span>
            </div>

            {/* 우측: 검색, 정렬, 필터, 관리 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* 관리 모드일 때만 보이는 버튼들 */}
              {isManagementMode && (
                <>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '0 12px',
                    fontSize: '14px'
                  }} className="text-muted-foreground">
                    {selectedFolders.length}개 선택됨
                  </div>
                  <button
                    onClick={selectedFolders.length === currentFolders.length ? deselectAllFolders : selectAllFolders}
                    className="btn btn-ghost btn-md"
                    style={{ border: '1px solid hsl(var(--border))' }}
                  >
                    {selectedFolders.length === currentFolders.length ? '전체 해제' : '전체 선택'}
                  </button>
                  <button
                    onClick={deleteSelectedFolders}
                    disabled={selectedFolders.length === 0}
                    className="btn btn-md"
                    style={{ 
                      backgroundColor: selectedFolders.length > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--muted))',
                      color: selectedFolders.length > 0 ? 'hsl(var(--destructive-foreground))' : 'hsl(var(--muted-foreground))',
                      border: 'none',
                      opacity: selectedFolders.length === 0 ? 0.5 : 1,
                      cursor: selectedFolders.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                    삭제
                  </button>
                  <button 
                    onClick={toggleManagementMode}
                    className="btn btn-secondary btn-md"
                    style={{ border: '1px solid hsl(var(--border))' }}
                  >
                    관리 완료
                  </button>
                </>
              )}

              {/* 일반 모드일 때만 보이는 검색/정렬/필터 버튼들 */}
              {!isManagementMode && (
                <>
                  {/* Search - 아이콘 + 텍스트 형태, 클릭하면 펼쳐짐 */}
                  <div style={{ position: 'relative' }}>
                    {!searchExpanded ? (
                      <button
                        onClick={() => setSearchExpanded(true)}
                        className="btn btn-ghost btn-md"
                        style={{ 
                          border: '1px solid hsl(var(--border))',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '0 12px'
                        }}
                      >
                        <Search size={16} />
                        <span>검색</span>
                      </button>
                    ) : (
                      <div style={{ 
                        position: 'relative',
                        width: '300px',
                        transition: 'width 0.3s ease-out'
                      }}>
                        <Search size={16} style={{ 
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 1
                        }} className="text-muted-foreground" />
                        <input 
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onBlur={() => {
                            if (!searchQuery) {
                              setSearchExpanded(false)
                            }
                          }}
                          placeholder="Search (Slot명, 광고주명)"
                          className="input"
                          autoFocus
                          style={{ 
                            paddingLeft: '40px',
                            paddingRight: '12px',
                            height: '36px',
                            minHeight: '36px',
                            width: '100%'
                          }}
                        />
                        {searchQuery && (
                          <button
                            onClick={() => {
                              setSearchQuery('')
                              setSearchExpanded(false)
                            }}
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <X size={14} className="text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 필터 */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setFilterOpen(!filterOpen)}
                      className="btn btn-ghost btn-md"
                      style={{ 
                        border: '1px solid hsl(var(--border))',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '0 12px',
                        backgroundColor: (advertiserFilter.length > 0 || visibilityFilter.length > 0) 
                          ? 'hsl(var(--primary) / 0.1)' 
                          : 'transparent'
                      }}
                    >
                      <Filter size={16} />
                      <span>필터</span>
                      {(advertiserFilter.length > 0 || visibilityFilter.length > 0) && (
                        <span style={{
                          backgroundColor: 'hsl(var(--primary))',
                          color: 'hsl(var(--primary-foreground))',
                          borderRadius: '10px',
                          padding: '2px 6px',
                          fontSize: '10px',
                          fontWeight: '600'
                        }}>
                          {advertiserFilter.length + visibilityFilter.length}
                        </span>
                      )}
                    </button>

                    {/* 필터 드롭다운 */}
                    {filterOpen && (
                      <div 
                        className="dropdown custom-scrollbar" 
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          marginTop: '4px',
                          width: '300px',
                          maxHeight: '450px',
                          overflowY: 'auto',
                          zIndex: 1000,
                          padding: '12px',
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.375rem',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                        }}
                      >
                        {/* 광고주 필터 */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>광고주</div>
                          
                          {/* 광고주 검색 */}
                          <div style={{ position: 'relative', marginBottom: '8px' }}>
                            <Search size={14} style={{ 
                              position: 'absolute',
                              left: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              zIndex: 1
                            }} className="text-muted-foreground" />
                            <input 
                              type="text"
                              value={advertiserSearchQuery}
                              onChange={(e) => setAdvertiserSearchQuery(e.target.value)}
                              placeholder="광고주 검색"
                              className="input"
                              style={{ 
                                paddingLeft: '32px',
                                paddingRight: '8px',
                                height: '32px',
                                minHeight: '32px',
                                width: '100%',
                                fontSize: '12px'
                              }}
                            />
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '6px', 
                            maxHeight: '150px', 
                            overflowY: 'auto'
                          }}
                          className="custom-scrollbar"
                          >
                            {Array.from(new Set(sampleFolders.map(f => f.advertiser)))
                              .filter(advertiser => 
                                advertiser.toLowerCase().includes(advertiserSearchQuery.toLowerCase())
                              )
                              .map(advertiser => (
                              <label key={advertiser} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={advertiserFilter.includes(advertiser)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setAdvertiserFilter([...advertiserFilter, advertiser])
                                    } else {
                                      setAdvertiserFilter(advertiserFilter.filter(a => a !== advertiser))
                                    }
                                  }}
                                  className="checkbox-custom"
                                />
                                <span style={{ fontSize: '13px' }}>{advertiser}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 가시성 필터 */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>가시성</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {['Internal', 'Private', 'Shared'].map(visibility => (
                              <label key={visibility} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={visibilityFilter.includes(visibility)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setVisibilityFilter([...visibilityFilter, visibility])
                                    } else {
                                      setVisibilityFilter(visibilityFilter.filter(v => v !== visibility))
                                    }
                                  }}
                                  className="checkbox-custom"
                                />
                                <span style={{ fontSize: '13px' }}>{visibility}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* 필터 초기화 버튼 */}
                        <button
                          onClick={() => {
                            setAdvertiserFilter([])
                            setVisibilityFilter([])
                            setAdvertiserSearchQuery('')
                          }}
                          className="btn btn-ghost btn-sm"
                          style={{ width: '100%', marginTop: '8px' }}
                        >
                          필터 초기화
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Content */}
          <div className="workspace-content">
            {/* Grid View */}
            {viewType === 'grid' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {currentFolders.map((folder, index) => (
                  <SlotCard
                    key={index}
                    slot={folder}
                    isManagementMode={isManagementMode}
                    isSelected={selectedFolders.includes(folder.title)}
                    contextMenuOpen={contextMenuOpen === folder.title}
                    onSlotClick={handleFolderClick}
                    onContextMenuToggle={(slotTitle) => {
                      setContextMenuOpen(contextMenuOpen === slotTitle ? null : slotTitle)
                    }}
                    onContextMenuAction={handleContextMenu}
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {viewType === 'list' && (
              <div style={{
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 100px 1fr 150px 120px 100px 120px 40px',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 24px',
                  backgroundColor: 'hsl(var(--muted))',
                  borderBottom: '1px solid hsl(var(--border))',
                  fontSize: '12px',
                  fontWeight: '600'
                }} className="text-muted-foreground">
                  <div></div>
                  
                  {/* ID - Sortable */}
                  <div 
                    onClick={() => {
                      if (sortField === 'id') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      } else {
                        setSortField('id')
                        setSortOrder('asc')
                      }
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    ID
                    {sortField === 'id' && (
                      <ChevronDown 
                        size={14} 
                        style={{ 
                          transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }} 
                      />
                    )}
                  </div>
                  
                  {/* Slot - Sortable */}
                  <div 
                    onClick={() => {
                      if (sortField === 'title') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      } else {
                        setSortField('title')
                        setSortOrder('asc')
                      }
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    Slot
                    {sortField === 'title' && (
                      <ChevronDown 
                        size={14} 
                        style={{ 
                          transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }} 
                      />
                    )}
                  </div>
                  
                  {/* 광고주 - Sortable */}
                  <div 
                    onClick={() => {
                      if (sortField === 'advertiser') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      } else {
                        setSortField('advertiser')
                        setSortOrder('asc')
                      }
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    광고주
                    {sortField === 'advertiser' && (
                      <ChevronDown 
                        size={14} 
                        style={{ 
                          transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }} 
                      />
                    )}
                  </div>
                  
                  <div>가시성</div>
                  
                  {/* 결과 수 - Sortable */}
                  <div 
                    onClick={() => {
                      if (sortField === 'results') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      } else {
                        setSortField('results')
                        setSortOrder('desc')
                      }
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    결과 수
                    {sortField === 'results' && (
                      <ChevronDown 
                        size={14} 
                        style={{ 
                          transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }} 
                      />
                    )}
                  </div>
                  
                  {/* 수정일 - Sortable */}
                  <div 
                    onClick={() => {
                      if (sortField === 'modified') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                      } else {
                        setSortField('modified')
                        setSortOrder('desc')
                      }
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    수정일
                    {sortField === 'modified' && (
                      <ChevronDown 
                        size={14} 
                        style={{ 
                          transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }} 
                      />
                    )}
                  </div>
                  
                  <div></div>
                </div>

                {/* List Items */}
                {currentFolders.map((folder, index) => (
                  <SlotListItem
                    key={index}
                    slot={folder}
                    isSelected={selectedFolders.includes(folder.title)}
                    contextMenuOpen={contextMenuOpen === folder.title}
                    onSlotClick={handleFolderClick}
                    onCheckboxChange={(slot, checked) => {
                      toggleFolderSelection(slot.title)
                    }}
                    onContextMenuToggle={(slotTitle) => {
                      setContextMenuOpen(contextMenuOpen === slotTitle ? null : slotTitle)
                    }}
                    onContextMenuAction={handleContextMenu}
                  />
                ))}
              </div>
            )}
            
            {/* 페이지네이션 */}
            {renderPagination()}
          </div>
        </>
      )}

      {/* 삭제 확인 다이얼로그 */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">
                Slot을 삭제하시겠습니까?
              </h3>
              <p className="dialog-description">
                "{deletingFolder}" Slot을 삭제하면 복원할 수 없습니다. 정말로 삭제하시겠습니까?
              </p>
            </div>
            <div className="dialog-footer">
              <button
                onClick={handleDeleteCancel}
                className="btn btn-secondary btn-sm"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn btn-sm"
                style={{
                  backgroundColor: 'hsl(var(--destructive))',
                  color: 'hsl(var(--destructive-foreground))'
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 알림 */}
      {showToast && (
        <div className={`toast ${showToast.type === 'success' ? 'toast--success' : 'toast--error'}`}>
          <div className="toast__icon">
            {showToast.type === 'success' ? (
              <CheckCircle size={20} style={{ color: 'hsl(142.1 76.2% 36.3%)' }} />
            ) : (
              <AlertCircle size={20} style={{ color: 'hsl(var(--destructive))' }} />
            )}
          </div>
          <div className="toast__content">
            <p className="toast__title">
              {showToast.type === 'success' ? '성공' : '오류'}
            </p>
            <p className="toast__description">
              {showToast.message}
            </p>
          </div>
          <button
            onClick={() => setShowToast(null)}
            className="toast__close"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </AppLayout>
  )
}