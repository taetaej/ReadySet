import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Info, Target, Share2, Link2, FileSpreadsheet, FileText, HelpCircle, SearchCheck, Users } from 'lucide-react'
import { AppLayout } from './layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../utils/theme'
import { targetGrpOptions } from './scenario/constants'
import { ReachCurveChart } from './ReachCurveChart'
import { ReachPredictorScoreCards } from './ReachPredictorScoreCards'
import { ReachPredictorDetailTable } from './ReachPredictorDetailTable'

interface ReachPredictorResultProps {
  scenarioData?: any
}

export function ReachPredictorResult({ scenarioData: propScenarioData }: ReachPredictorResultProps) {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 기본 시나리오 데이터 (매체/상품 포함)
  const defaultScenarioData = {
    name: '건강식품 타겟 마케팅',
    description: '선택한 매체 믹스의 예상 도달률을 분석한 결과입니다.',
    totalBudget: 1430000000,
    period: { start: '2024-01-15', end: '2024-02-15' },
    targetGrp: ['M2024', 'M2529', 'M3034', 'M3539', 'F2024', 'F2529', 'F3034', 'F3539'],
    targetGrpArray: ['남성 25~29세', '남성 30~34세', '남성 35~39세', '여성 25~29세', '여성 30~34세', '여성 35~39세', '여성 40~44세', '여성 45~49세'],
    curveSettings: {
      budgetCap: 1800000000,
      minInterval: 300000000,
      maxInterval: 1800000000,
      intervalType: 'amount',
      intervalAmount: 150000000,
      intervalCount: null
    },
    reachPredictorMedia: [
      // DIGITAL - Google Ads (개별 설정 케이스)
      {
        id: '1',
        category: 'DIGITAL',
        type: 'linked',
        mediaName: 'Google Ads',
        productName: 'Google_Display_CPM',
        budget: '150000000',
        impressions: '50000000',
        cpm: '3000',
        customPeriod: { start: '2024-01-20', end: '2024-02-10' },
        customTarget: ['M2024', 'M2529', 'M3034', 'F2024', 'F2529']
      },
      {
        id: '2',
        category: 'DIGITAL',
        type: 'linked',
        mediaName: 'Google Ads',
        productName: 'Google_Video_CPM',
        budget: '200000000',
        impressions: '', // 노출 미입력 케이스
        cpm: '',
        customPeriod: { start: '2024-01-20', end: '2024-02-10' },
        customTarget: ['M2024', 'M2529', 'M3034', 'F2024', 'F2529']
      },
      {
        id: '3',
        category: 'DIGITAL',
        type: 'linked',
        mediaName: 'Google Ads',
        productName: 'Google_Search_CPC',
        budget: '180000000',
        impressions: '30000000',
        cpm: '6000',
        customPeriod: { start: '2024-01-20', end: '2024-02-10' },
        customTarget: ['M2024', 'M2529', 'M3034', 'F2024', 'F2529']
      },
      // DIGITAL - 티빙
      {
        id: '4',
        category: 'DIGITAL',
        type: 'unlinked',
        mediaName: '티빙',
        budget: '120000000',
        impressions: '25000000',
        cpm: '4800'
      },
      // DIGITAL - 블라인드 (노출 미입력 케이스)
      {
        id: '5',
        category: 'DIGITAL',
        type: 'unlinked',
        mediaName: '블라인드',
        budget: '80000000',
        impressions: '',
        cpm: ''
      },
      // TVC - CJ ENM
      {
        id: '6',
        category: 'TVC',
        type: 'linked',
        mediaName: 'CJ ENM',
        productName: 'tvN',
        budget: '300000000',
        impressions: '15000000',
        cpm: '20000'
      },
      {
        id: '7',
        category: 'TVC',
        type: 'linked',
        mediaName: 'CJ ENM',
        productName: 'tvN STORY',
        budget: '150000000',
        impressions: '', // 노출 미입력 케이스
        cpm: ''
      },
      // TVC - JTBC
      {
        id: '8',
        category: 'TVC',
        type: 'linked',
        mediaName: 'JTBC',
        productName: 'JTBC',
        budget: '250000000',
        impressions: '12000000',
        cpm: '20833'
      }
    ]
  }
  
  const scenarioData = propScenarioData || location.state?.scenarioData || defaultScenarioData
  
  // reachPredictorMedia가 없으면 defaultScenarioData의 것을 사용
  if (scenarioData && !scenarioData.reachPredictorMedia) {
    scenarioData.reachPredictorMedia = defaultScenarioData.reachPredictorMedia
  }
  
  // 타겟 GRP 설정
  const defaultTargetGrp = ['남성 25~29세', '남성 30~34세', '여성 25~29세']
  const selectedTargetGrp = scenarioData?.targetGrpArray && Array.isArray(scenarioData.targetGrpArray) && scenarioData.targetGrpArray.length > 0
    ? scenarioData.targetGrpArray 
    : defaultTargetGrp
  
  // 디버깅 로그
  console.log('ReachPredictorResult 렌더링')
  console.log('scenarioData:', scenarioData)
  console.log('targetGrpArray:', scenarioData?.targetGrpArray)
  console.log('selectedTargetGrp:', selectedTargetGrp)
  console.log('reachPredictorMedia:', scenarioData?.reachPredictorMedia)
  console.log('reachPredictorMedia length:', scenarioData?.reachPredictorMedia?.length)
  
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const [allSlotsExpanded, setAllSlotsExpanded] = useState(true)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false)
  const [targetGrpTooltipOpen, setTargetGrpTooltipOpen] = useState(false)
  const [curveSettingsDialogOpen, setCurveSettingsDialogOpen] = useState(false)
  const [populationTooltipOpen, setPopulationTooltipOpen] = useState(false)

  const toggleAllSlots = () => {
    const newExpanded = !allSlotsExpanded
    setAllSlotsExpanded(newExpanded)
    
    // 모든 폴더 펼치기/접기
    if (newExpanded) {
      setExpandedFolders(['samsung', 'samsung-reachcaster', 'lg', 'hyundai'])
    } else {
      setExpandedFolders([])
    }
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

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setExportMenuOpen(false)
  }

  const handleExportExcel = () => {
    console.log('Export to Excel')
    setExportMenuOpen(false)
  }

  const handleExportPDF = () => {
    console.log('Export to PDF')
    setExportMenuOpen(false)
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
      {/* Scenario Header */}
      <div className="slot-detail-header">
        <div className="slot-detail-header__main">
          <div className="slot-detail-header__info">
            {/* 첫 번째 줄: 분석 모듈 뱃지 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: 'hsl(var(--foreground))',
                color: 'hsl(var(--background))',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Target size={14} />
                Reach Predictor
              </span>
            </div>
            
            {/* 두 번째 줄: 시나리오 타이틀 */}
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', fontFamily: 'Paperlogy, sans-serif' }}>
              {scenarioData?.name || 'Reach Predictor 시나리오 결과'}
            </h1>
            
            {/* 세 번째 줄: 설명 */}
            <p className="text-muted-foreground" style={{ fontSize: '14px', margin: 0, marginBottom: '16px', fontFamily: 'Paperlogy, sans-serif' }}>
              {scenarioData?.description || '선택한 매체 믹스의 예상 도달률을 분석한 결과입니다.'}
            </p>
            
            {/* 네 번째 줄: 주요 정보 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px',
              fontSize: '13px',
              fontFamily: 'Paperlogy, sans-serif'
            }} className="text-muted-foreground">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '500' }}>총 예산:</span>
                <span>₩{(scenarioData?.totalBudget || 1000000000).toLocaleString('ko-KR')}</span>
              </div>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '500' }}>분석 매체/상품:</span>
                <span>{scenarioData?.reachPredictorMedia?.length || 0}개</span>
                <button
                  onClick={() => setMediaDialogOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'hsl(var(--muted-foreground))',
                    transition: 'color 0.2s',
                    opacity: 0.6
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'hsl(var(--foreground))'
                    e.currentTarget.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'hsl(var(--muted-foreground))'
                    e.currentTarget.style.opacity = '0.6'
                  }}
                  title="매체/상품 상세 보기"
                >
                  <SearchCheck size={14} />
                </button>
              </div>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
                <span style={{ fontWeight: '500' }}>타겟 GRP:</span>
                <span>{selectedTargetGrp.length}개 세그먼트</span>
                <button
                  onClick={() => setTargetGrpTooltipOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'hsl(var(--muted-foreground))',
                    transition: 'color 0.2s',
                    opacity: 0.6
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'hsl(var(--foreground))'
                    e.currentTarget.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'hsl(var(--muted-foreground))'
                    e.currentTarget.style.opacity = '0.6'
                  }}
                  title="타겟 GRP 상세 보기"
                >
                  <SearchCheck size={14} />
                </button>
              </div>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '500' }}>캠페인 기간:</span>
                <span>{scenarioData?.startDate || '2024-01-15'} ~ {scenarioData?.endDate || '2024-02-15'}</span>
              </div>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '500' }}>브랜드/업종:</span>
                <span>{scenarioData?.brand || '삼성전자'} / {scenarioData?.industry || '전자제품'}</span>
              </div>
            </div>
          </div>

          {/* 우측 액션 버튼들 */}
          <div className="slot-detail-header__actions" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            {/* Export 드롭다운 */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="btn btn-ghost btn-md"
                style={{ padding: '8px' }}
              >
                <Share2 size={18} />
              </button>
              
              {exportMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '200px',
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  zIndex: 1000,
                  fontFamily: 'Paperlogy, sans-serif',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={handleCopyLink}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Link2 size={16} />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FileSpreadsheet size={16} />
                    <span>Export to Excel</span>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FileText size={16} />
                    <span>Export to PDF</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* Info 아이콘 */}
            <div style={{ position: 'relative' }}>
              <button
                data-info-tooltip
                onMouseEnter={() => setInfoTooltipOpen(true)}
                onMouseLeave={() => setInfoTooltipOpen(false)}
                className="btn btn-ghost btn-md"
                style={{ padding: '8px' }}
              >
                <Info size={18} />
              </button>
              
              {infoTooltipOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '280px',
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  zIndex: 1000,
                  fontFamily: 'Paperlogy, sans-serif'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>Scenario ID</div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>#{scenarioData?.id || '1'}</div>
                  </div>
                  
                  <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '8px 0' }} />
                  
                  <div style={{ marginBottom: '12px' }}>
                    <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>생성일시</div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{scenarioData?.created || '2024-01-10 14:30'}</div>
                    <div className="text-muted-foreground" style={{ fontSize: '12px' }}>
                      {scenarioData?.creator || '김철수'} ({scenarioData?.creatorId || 'USER001'})
                    </div>
                  </div>
                  
                  <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '8px 0' }} />
                  
                  <div>
                    <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>완료일시</div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{scenarioData?.completedAt || '2024-01-20 16:45'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="workspace-content" style={{ maxWidth: '100%', overflow: 'visible' }}>
        {/* 차트 및 스코어카드 영역 - 뷰포트 너비에 맞춤 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: '24px',
          marginBottom: '32px',
          width: '100%',
          maxWidth: '100vw',
          boxSizing: 'border-box'
        }}>
          {/* 스코어카드 - 벤토 박스 유지 */}
          <div style={{ minWidth: 0 }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              fontFamily: 'Paperlogy, sans-serif',
              margin: 0,
              marginBottom: '32px',
              color: 'hsl(var(--foreground))'
            }}>
              Key Metrics Summary
            </h3>
            <ReachPredictorScoreCards isDarkMode={isDarkMode} />
          </div>
          
          {/* 리치커브 차트 - 벤토 박스 없이 */}
          <div style={{ minWidth: 0, maxWidth: '100%' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                fontFamily: 'Paperlogy, sans-serif',
                margin: 0,
                color: 'hsl(var(--foreground))'
              }}>
                Reach Curve Analysis
              </h3>
              <button
                onClick={() => setCurveSettingsDialogOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'hsl(var(--muted-foreground))',
                  transition: 'color 0.2s',
                  opacity: 0.6
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'hsl(var(--foreground))'
                  e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'hsl(var(--muted-foreground))'
                  e.currentTarget.style.opacity = '0.6'
                }}
                title="리치커브 설정 보기"
              >
                <SearchCheck size={14} />
              </button>
            </div>
            <ReachCurveChart isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* 기대 성과 테이블 영역 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              fontFamily: 'Paperlogy, sans-serif',
              margin: 0,
              color: 'hsl(var(--foreground))'
            }}>
              Estimated Performance
            </h3>
            
            {/* 모집단 정보 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'Paperlogy, sans-serif'
            }}>
              <Users size={16} className="text-muted-foreground" />
              <span style={{ fontSize: '12px', fontWeight: '400' }} className="text-muted-foreground">
                모집단: 46,039,423명
              </span>
              <div style={{ position: 'relative' }}>
                <button
                  onMouseEnter={() => setPopulationTooltipOpen(true)}
                  onMouseLeave={() => setPopulationTooltipOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Info size={14} className="text-muted-foreground" />
                </button>
                
                {populationTooltipOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '140px',
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    zIndex: 1000,
                    fontFamily: 'Paperlogy, sans-serif',
                    fontSize: '12px'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>기준</div>
                    <div className="text-muted-foreground" style={{ lineHeight: '1.5' }}>
                      코리안클릭 (2026년 1월)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <ReachPredictorDetailTable 
            selectedData={scenarioData}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* 매체/상품 상세 다이얼로그 (읽기 전용) */}
      {mediaDialogOpen && (
        <div className="dialog-overlay" onClick={() => setMediaDialogOpen(false)}>
          <div 
            className="dialog-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              width: '900px', 
              maxWidth: '95vw',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className="dialog-header">
              <h3 className="dialog-title">분석 매체/상품 상세</h3>
              <p className="dialog-description">
                시나리오 생성 시 설정된 매체 및 상품 정보입니다
              </p>
            </div>
            
            <div style={{ 
              padding: '24px', 
              flex: 1, 
              overflowY: 'auto'
            }}>
              {(() => {
                console.log('다이얼로그 내부 - scenarioData:', scenarioData)
                console.log('다이얼로그 내부 - reachPredictorMedia:', scenarioData?.reachPredictorMedia)
                console.log('다이얼로그 내부 - length:', scenarioData?.reachPredictorMedia?.length)
                return null
              })()}
              {scenarioData?.reachPredictorMedia && scenarioData.reachPredictorMedia.length > 0 ? (
                <>
                  <div style={{
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    {/* 테이블 헤더 */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 240px 140px 140px 120px',
                      gap: '12px',
                      padding: '12px 16px',
                      backgroundColor: 'hsl(var(--muted) / 0.5)',
                      borderBottom: '1px solid hsl(var(--border))',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'hsl(var(--muted-foreground))'
                    }}>
                      <div>매체</div>
                      <div>상품</div>
                      <div style={{ textAlign: 'right' }}>확정 예산 (원)</div>
                      <div style={{ textAlign: 'right' }}>예상 노출</div>
                      <div style={{ textAlign: 'right' }}>CPM (원)</div>
                    </div>

                    {/* 테이블 바디 */}
                    {scenarioData.reachPredictorMedia.map((media: any, index: number) => (
                      <div key={index}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '80px 240px 140px 140px 120px',
                            gap: '12px',
                            padding: '12px 16px',
                            alignItems: 'center',
                            borderBottom: (media.customPeriod || media.customTarget) ? 'none' : (index < scenarioData.reachPredictorMedia.length - 1 ? '1px solid hsl(var(--border))' : 'none'),
                            fontSize: '13px'
                          }}
                        >
                          {/* 카테고리 */}
                          <div style={{
                            fontSize: '10px',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: media.category === 'DIGITAL' ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--accent) / 0.1)',
                            color: media.category === 'DIGITAL' ? 'hsl(var(--primary))' : 'hsl(var(--accent-foreground))',
                            fontWeight: '600',
                            textAlign: 'center',
                            width: 'fit-content'
                          }}>
                            {media.category}
                          </div>

                          {/* 매체/상품 */}
                          <div>
                            <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                              {media.mediaName}
                            </div>
                            {media.productName && (
                              <div style={{ 
                                fontSize: '12px', 
                                color: 'hsl(var(--muted-foreground))' 
                              }}>
                                {media.productName}
                              </div>
                            )}
                          </div>

                          {/* 확정 예산 */}
                          <div style={{ textAlign: 'right' }}>
                            {media.budget ? parseInt(media.budget).toLocaleString('ko-KR') : '-'}
                          </div>

                          {/* 예상 노출 */}
                          <div style={{ textAlign: 'right' }}>
                            {media.impressions ? parseInt(media.impressions).toLocaleString('ko-KR') : '-'}
                          </div>

                          {/* CPM */}
                          <div style={{ 
                            textAlign: 'right',
                            color: 'hsl(var(--muted-foreground))'
                          }}>
                            {media.budget && media.impressions 
                              ? ((parseInt(media.budget) / parseInt(media.impressions)) * 1000).toFixed(2)
                              : '-'}
                          </div>
                        </div>

                        {/* 개별 설정 정보 (있는 경우만 표시) */}
                        {(media.customPeriod || media.customTarget) && (
                          <div style={{
                            padding: '8px 16px 12px 92px',
                            backgroundColor: 'hsl(var(--muted) / 0.1)',
                            borderBottom: index < scenarioData.reachPredictorMedia.length - 1 ? '1px solid hsl(var(--border))' : 'none',
                            fontSize: '11px',
                            color: 'hsl(var(--primary))',
                            display: 'flex',
                            gap: '16px'
                          }}>
                            {media.customPeriod && (
                              <div>
                                <span style={{ fontWeight: '500' }}>개별 기간: </span>
                                <span>{media.customPeriod.start} ~ {media.customPeriod.end}</span>
                              </div>
                            )}
                            {media.customTarget && (
                              <div>
                                <span style={{ fontWeight: '500' }}>개별 타겟: </span>
                                <span>
                                  {media.customTarget.length === 24 
                                    ? '전체' 
                                    : `${media.customTarget.length}개 선택`}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: 'hsl(var(--muted-foreground))',
                  fontSize: '14px'
                }}>
                  설정된 매체/상품이 없습니다
                </div>
              )}
            </div>

            <div className="dialog-footer">
              <button
                onClick={() => setMediaDialogOpen(false)}
                className="btn btn-primary btn-md"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 타겟 GRP 다이얼로그 */}
      {targetGrpTooltipOpen && (
        <div className="dialog-overlay" onClick={() => setTargetGrpTooltipOpen(false)}>
          <div 
            className="dialog-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}
          >
            <div className="dialog-header">
              <h3 className="dialog-title">선택한 타겟 GRP</h3>
              <p className="dialog-description">
                이 시나리오에 적용된 타겟 모수입니다
              </p>
            </div>
            
            <div style={{ padding: '24px' }}>
              {/* 남성 */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid hsl(var(--border))'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>남성</span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {targetGrpOptions.male.map((target) => {
                    const isSelected = selectedTargetGrp.includes(target)
                    
                    return (
                      <label
                        key={target}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'not-allowed',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: `1px solid ${isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                          backgroundColor: isSelected ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          opacity: isSelected ? 1 : 0.5,
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled
                          className="checkbox-custom"
                          style={{ cursor: 'not-allowed' }}
                        />
                        <span style={{ fontSize: '12px' }}>{target.replace('남성 ', '')}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* 여성 */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid hsl(var(--border))'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>여성</span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {targetGrpOptions.female.map((target) => {
                    const isSelected = selectedTargetGrp.includes(target)
                    
                    return (
                      <label
                        key={target}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'not-allowed',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: `1px solid ${isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                          backgroundColor: isSelected ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                          opacity: isSelected ? 1 : 0.5,
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled
                          className="checkbox-custom"
                          style={{ cursor: 'not-allowed' }}
                        />
                        <span style={{ fontSize: '12px' }}>{target.replace('여성 ', '')}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="dialog-footer">
              <button
                onClick={() => setTargetGrpTooltipOpen(false)}
                className="btn btn-primary btn-md"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 리치커브 설정 다이얼로그 */}
      {curveSettingsDialogOpen && (
        <div className="dialog-overlay" onClick={() => setCurveSettingsDialogOpen(false)}>
          <div 
            className="dialog-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px' }}
          >
            <div className="dialog-header">
              <h3 className="dialog-title">리치커브 상세 설정</h3>
              <p className="dialog-description">
                시나리오 생성 시 설정된 리치커브 분석 파라미터입니다
              </p>
            </div>
            
            <div style={{ padding: '24px' }}>
              {/* 예산 상한 */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'hsl(var(--foreground))'
                }}>
                  예산 상한 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'hsl(var(--foreground))',
                    textAlign: 'right'
                  }}>
                    {(scenarioData?.curveSettings?.budgetCap || 1800000000).toLocaleString('ko-KR')}
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: 'hsl(var(--muted-foreground))'
                  }}>
                    원
                  </span>
                </div>
              </div>

              {/* 리치커브 상세 설정 */}
              <div style={{
                padding: '20px',
                backgroundColor: 'hsl(var(--muted) / 0.1)',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))'
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: 'hsl(var(--foreground))'
                }}>
                  리치커브 상세 설정 <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '400',
                    color: 'hsl(var(--muted-foreground))'
                  }}>(선택)</span>
                </div>
                
                {/* 구간 */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: 'hsl(var(--foreground))'
                  }}>
                    구간
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'hsl(var(--foreground))',
                      textAlign: 'right'
                    }}>
                      {(scenarioData?.curveSettings?.minInterval || 300000000).toLocaleString('ko-KR')}
                    </div>
                    <span style={{
                      fontSize: '13px',
                      color: 'hsl(var(--muted-foreground))'
                    }}>
                      원
                    </span>
                    <span style={{
                      fontSize: '13px',
                      color: 'hsl(var(--muted-foreground))',
                      padding: '0 4px'
                    }}>
                      →
                    </span>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'hsl(var(--foreground))',
                      textAlign: 'right'
                    }}>
                      {(scenarioData?.curveSettings?.maxInterval || 1800000000).toLocaleString('ko-KR')}
                    </div>
                    <span style={{
                      fontSize: '13px',
                      color: 'hsl(var(--muted-foreground))'
                    }}>
                      원
                    </span>
                  </div>
                </div>

                {/* 구간 수 기준 */}
                <div style={{
                  padding: '14px',
                  backgroundColor: (scenarioData?.curveSettings?.intervalType || 'amount') === 'count' 
                    ? 'hsl(var(--background))' 
                    : 'transparent',
                  borderRadius: '6px',
                  border: `1px solid ${(scenarioData?.curveSettings?.intervalType || 'amount') === 'count' 
                    ? 'hsl(var(--primary))' 
                    : 'hsl(var(--border))'}`,
                  marginBottom: '12px',
                  opacity: (scenarioData?.curveSettings?.intervalType || 'amount') === 'count' ? 1 : 0.5
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: `2px solid ${(scenarioData?.curveSettings?.intervalType || 'amount') === 'count' 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--border))'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {(scenarioData?.curveSettings?.intervalType || 'amount') === 'count' && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'hsl(var(--primary))'
                        }} />
                      )}
                    </div>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'hsl(var(--foreground))'
                    }}>
                      구간 수 기준
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingLeft: '26px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: 'hsl(var(--muted-foreground))',
                      minWidth: '80px'
                    }}>
                      구간 수 (2~20):
                    </span>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'hsl(var(--foreground))'
                    }}>
                      {scenarioData?.curveSettings?.intervalCount ? `${scenarioData.curveSettings.intervalCount}개` : '-'}
                    </div>
                  </div>
                </div>

                {/* 구간별 금액 기준 */}
                <div style={{
                  padding: '14px',
                  backgroundColor: (scenarioData?.curveSettings?.intervalType || 'amount') === 'amount' 
                    ? 'hsl(var(--background))' 
                    : 'transparent',
                  borderRadius: '6px',
                  border: `1px solid ${(scenarioData?.curveSettings?.intervalType || 'amount') === 'amount' 
                    ? 'hsl(var(--primary))' 
                    : 'hsl(var(--border))'}`,
                  opacity: (scenarioData?.curveSettings?.intervalType || 'amount') === 'amount' ? 1 : 0.5
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: `2px solid ${(scenarioData?.curveSettings?.intervalType || 'amount') === 'amount' 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--border))'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {(scenarioData?.curveSettings?.intervalType || 'amount') === 'amount' && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'hsl(var(--primary))'
                        }} />
                      )}
                    </div>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'hsl(var(--foreground))'
                    }}>
                      구간별 금액 기준
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingLeft: '26px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: 'hsl(var(--muted-foreground))',
                      minWidth: '80px'
                    }}>
                      구간별 금액:
                    </span>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'hsl(var(--foreground))'
                    }}>
                      {scenarioData?.curveSettings?.intervalAmount 
                        ? `${(scenarioData.curveSettings.intervalAmount).toLocaleString('ko-KR')}원` 
                        : '150,000,000원'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dialog-footer">
              <button
                onClick={() => setCurveSettingsDialogOpen(false)}
                className="btn btn-primary btn-md"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
