import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Info, Scale, Users, Share2, Link2, FileSpreadsheet, FileText, Smartphone, Tv } from 'lucide-react'
import { AppLayout } from './layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../utils/theme'
import { DetailedDataTable } from './RatioFinderDetailTable'
import { targetGrpOptions } from './scenario/constants'
import { RatioAnalysisChart } from './RatioAnalysisChart'

interface RatioFinderResultProps {
  scenarioData?: any
}

// 샘플 시뮬레이션 데이터 (10% 단위, 11개 조합) - 컴포넌트 외부로 이동
const generateSimulationData = () => {
  const data = []
  for (let tvcRatio = 0; tvcRatio <= 100; tvcRatio += 10) {
    const digitalRatio = 100 - tvcRatio
    // 도달률은 50:50 근처에서 최대가 되도록 시뮬레이션
    const reach = 45 + 30 * Math.exp(-Math.pow((tvcRatio - 50) / 30, 2)) + Math.random() * 3
    data.push({
      tvcRatio,
      digitalRatio,
      reach: parseFloat(reach.toFixed(2)),
      tvcBudget: tvcRatio * 10000000, // 예시: 총 10억 기준
      digitalBudget: digitalRatio * 10000000,
      frequency: 3.2 + Math.random() * 0.8,
      grp: 150 + Math.random() * 50,
      cpm: 8000 + Math.random() * 2000
    })
  }
  return data
}

export function RatioFinderResult({ scenarioData: propScenarioData }: RatioFinderResultProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const scenarioData = propScenarioData || location.state?.scenarioData
  
  // 기본 타겟 GRP 설정
  const defaultTargetGrp = ['남성 25~29세', '남성 30~34세', '여성 25~29세']
  const selectedTargetGrp = scenarioData?.targetGrp && Array.isArray(scenarioData.targetGrp) && scenarioData.targetGrp.length > 0
    ? scenarioData.targetGrp 
    : defaultTargetGrp
  
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const [allSlotsExpanded, setAllSlotsExpanded] = useState(true)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null)
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [populationTooltipOpen, setPopulationTooltipOpen] = useState(false)
  const [targetGrpTooltipOpen, setTargetGrpTooltipOpen] = useState(false)
  
  // 시뮬레이션 데이터를 useMemo로 한 번만 생성
  const simulationData = useMemo(() => generateSimulationData(), [])
  const maxReachIndex = useMemo(() => 
    simulationData.reduce((maxIdx, curr, idx, arr) => 
      curr.reach > arr[maxIdx].reach ? idx : maxIdx, 0
    ), [simulationData]
  )

  // Optimal Point를 기본 선택 상태로 설정
  useEffect(() => {
    setSelectedBarIndex(maxReachIndex)
  }, [maxReachIndex])

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

  const handleBarClick = (index: number) => {
    setSelectedBarIndex(index)
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setExportMenuOpen(false)
    // TODO: 토스트 메시지 표시
  }

  const handleExportExcel = () => {
    // TODO: Excel export 구현
    console.log('Export to Excel')
    setExportMenuOpen(false)
  }

  const handleExportPDF = () => {
    // TODO: PDF export 구현
    console.log('Export to PDF')
    setExportMenuOpen(false)
  }

  const selectedData = selectedBarIndex !== null ? simulationData[selectedBarIndex] : null

  return (
    <AppLayout
      currentView="ratioFinderResult"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', onClick: () => navigate('/slotboard') },
        { label: 'Slot', onClick: () => navigate('/reachcaster') },
        { label: scenarioData?.name || 'Ratio Finder Result' }
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
      {/* Scenario Header - SlotHeader 스타일 */}
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
                <Scale size={14} />
                Ratio Finder
              </span>
            </div>
            
            {/* 두 번째 줄: 시나리오 타이틀 */}
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', fontFamily: 'Paperlogy, sans-serif' }}>
              {scenarioData?.name || 'Ratio Finder 시나리오 결과'}
            </h1>
            
            {/* 세 번째 줄: 설명 */}
            <p className="text-muted-foreground" style={{ fontSize: '14px', margin: 0, marginBottom: '16px', fontFamily: 'Paperlogy, sans-serif' }}>
              {scenarioData?.description || 'TVC와 Digital 매체의 최적 예산 비중을 분석한 결과입니다.'}
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
                <span>₩1,000,000,000</span>
              </div>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '500' }}>시뮬레이션 단위:</span>
                <span>10%</span>
              </div>
              <span>•</span>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}
              >
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
                    justifyContent: 'center'
                  }}
                >
                  <Info size={14} className="text-muted-foreground" />
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
            
            {/* Info 아이콘 - 시나리오 ID, 생성/완료 정보 툴팁 */}
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

      {/* 차트 영역 - workspace-content 스타일 */}
      <div className="workspace-content" style={{ overflow: 'hidden' }}>
        <div style={{ marginBottom: '16px', position: 'relative', width: '100%', maxWidth: '100%' }}>
          {/* 차트 소제목 */}
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: 'Paperlogy, sans-serif',
            margin: 0,
            marginBottom: '16px',
            color: 'hsl(var(--foreground))'
          }}>
            Digital - TVC Ratio Analysis
          </h3>
          
          {/* 차트 컨테이너 */}
          <div style={{ position: 'relative', marginTop: '24px', marginBottom: '8px' }}>
            <RatioAnalysisChart
              data={simulationData}
              selectedIndex={selectedBarIndex}
              onBarClick={handleBarClick}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* 상세 데이터 테이블 */}
        <div style={{ marginTop: '24px', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
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
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'hsl(var(--foreground))'
            }}>
              <span>Estimated Performance</span>
              {selectedData && (
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }} className="text-muted-foreground">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Smartphone size={14} />
                    Digital {selectedData.digitalRatio}%
                  </span>
                  <span>:</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tv size={14} />
                    TVC {selectedData.tvcRatio}%
                  </span>
                </span>
              )}
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
          
          {selectedData ? (
            <DetailedDataTable selectedData={selectedData} isDarkMode={isDarkMode} />
          ) : (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontFamily: 'Paperlogy, sans-serif'
              }} className="text-muted-foreground">
                차트에서 막대를 클릭하면 상세 데이터가 표시됩니다
              </div>
            )}
        </div>
      </div>

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
    </AppLayout>
  )
}
