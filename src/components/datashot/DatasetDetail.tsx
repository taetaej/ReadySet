import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DollarSign, MousePointerClick, TrendingUp, Eye, Link2, FileSpreadsheet, Share2, Database, Info, MoreVertical, Copy, ArrowRightLeft, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../../utils/theme'
import { useSidebarState } from '../../hooks/useSidebarState'
import { maskEmail } from '../../utils/maskEmail'

interface DatasetDetailProps {
  datasetData?: any
}

export function DatasetDetail({ datasetData: propDatasetData }: DatasetDetailProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const datasetData = propDatasetData || location.state?.datasetData
  
  const slotData = location.state?.slotData || {
    title: '삼성 갤럭시 S24 캠페인',
    advertiser: '삼성전자'
  }
  
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const { isSidebarCollapsed, expandedFolders, toggleSidebar, toggleFolder } = useSidebarState()
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false)
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    setDarkModeUtil(newMode)
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setShowToast({ type: 'success', message: '링크가 클립보드에 복사되었습니다.' })
      setExportMenuOpen(false)
    }).catch(() => {
      setShowToast({ type: 'error', message: '링크 복사에 실패했습니다.' })
    })
  }

  const handleExportCSV = () => {
    // CSV 다운로드 로직 (추후 구현)
    console.log('CSV 다운로드')
    setShowToast({ type: 'success', message: 'CSV 파일을 다운로드합니다.' })
    setExportMenuOpen(false)
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getSortedData = () => {
    if (!sortConfig) return sampleData
    
    const sorted = [...sampleData].sort((a: any, b: any) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      // 숫자 형식 처리 (쉼표 제거)
      const aNum = typeof aValue === 'string' ? parseFloat(aValue.replace(/[^0-9.-]/g, '')) : aValue
      const bNum = typeof bValue === 'string' ? parseFloat(bValue.replace(/[^0-9.-]/g, '')) : bValue
      
      if (sortConfig.direction === 'asc') {
        return aNum > bNum ? 1 : -1
      } else {
        return aNum < bNum ? 1 : -1
      }
    })
    
    return sorted
  }

  // 샘플 Key Metrics 데이터
  const keyMetrics = [
    {
      label: '광고비',
      value: '1,234,567,890',
      unit: '원',
      icon: DollarSign,
      color: '#00FF9D'
    },
    {
      label: 'CTR',
      value: '2.34',
      unit: '%',
      icon: MousePointerClick,
      color: '#B794F6'
    },
    {
      label: 'CPC',
      value: '1,250',
      unit: '원',
      icon: TrendingUp,
      color: '#FF6B9D'
    },
    {
      label: 'CPM',
      value: '8,500',
      unit: '원',
      icon: Eye,
      color: '#FFB800'
    }
  ]

  // 조회조건 데이터 (실제로는 props나 API에서 받아올 데이터)
  const configData = datasetData?.config || {
    media: 'Meta',
    targetingCategory: '기기유형',
    metrics: ['노출수', '클릭수', '광고비', 'CTR', 'CPC', 'CPM']
  }

  // 광고상품 컬럼 구조 동적 생성
  const getAdProductColumns = () => {
    if (configData.media === 'Meta') {
      return [
        { key: 'objective', label: '캠페인 목표' },
        { key: 'buyingType', label: '구매 유형' },
        { key: 'platform', label: '플랫폼' },
        { key: 'performanceGoal', label: '성과 목표' }
      ]
    }
    return [{ key: 'product', label: '광고상품' }]
  }

  const adProductColumns = getAdProductColumns()

  // 샘플 테이블 데이터 (5000행 제한)
  const generateSampleData = () => {
    const data = []
    for (let i = 0; i < 50; i++) { // 실제로는 5000행
      data.push({
        period: '2024-01',
        media: configData.media,
        industryLarge: '제조업',
        industryMedium: '전자제품',
        industrySmall: '스마트폰',
        objective: 'Post Engagement',
        buyingType: 'Auction',
        platform: i % 2 === 0 ? 'Facebook' : 'Instagram',
        performanceGoal: '—',
        targetingOption: configData.targetingCategory ? '기기유형 > Mobile' : null,
        impressions: (1234567 + i * 1000).toLocaleString(),
        clicks: (28901 + i * 100).toLocaleString(),
        cost: (12345678 + i * 10000).toLocaleString(),
        ctr: '2.34%',
        cpc: (427 + i).toLocaleString(),
        cpm: (9987 + i * 10).toLocaleString()
      })
    }
    return data
  }

  const sampleData = generateSampleData()

  return (
    <AppLayout
      currentView="datasetDetail"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', href: '/slotboard' },
        { label: slotData?.title || '삼성 갤럭시 S24 캠페인' },
        { label: 'DataShot', href: '/datashot' },
        { label: datasetData?.name || '2024 Q1 Meta 캠페인 데이터' }
      ]}
      isDarkMode={isDarkMode}
      onToggleDarkMode={handleToggleDarkMode}
      sidebarProps={{
        isCollapsed: isSidebarCollapsed,
        expandedFolders,
        onToggleSidebar: toggleSidebar,
        onToggleFolder: toggleFolder,
        onNavigateToWorkspace: () => navigate('/slotboard')
      }}
    >
      {/* Header - Single Line Layout */}
      <div className="slot-detail-header">
        <div className="slot-detail-header__main" style={{ alignItems: 'center' }}>
          {/* 좌측: 뱃지 + 타이틀 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            flex: 1,
            minWidth: 0
          }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: 'hsl(var(--muted))',
              color: 'hsl(var(--foreground))',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0
            }}>
              <Database size={14} />
              DataShot
            </span>
            
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              margin: 0,
              fontFamily: 'Paperlogy, sans-serif',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0
            }}>
              {datasetData?.name || '2024 Q1 Meta 캠페인 데이터'}
            </h1>
          </div>

          {/* 중앙: 주요 정보 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            fontSize: '12px',
            fontFamily: 'Paperlogy, sans-serif',
            flexShrink: 0
          }} className="text-muted-foreground">
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontWeight: '500' }}>매체</span>
              <span>{datasetData?.media || 'Meta'}</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontWeight: '500' }}>기준 데이터 일시</span>
              <span>2024-03-10 14:30:25</span>
            </div>
          </div>

          <div style={{ 
            width: '1px', 
            height: '24px', 
            backgroundColor: 'hsl(var(--border))',
            margin: '0 8px',
            flexShrink: 0
          }} />

          {/* 우측: 액션 버튼들 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Export 드롭다운 */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '6px' }}
              >
                <Share2 size={16} />
              </button>
              
              {exportMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '180px',
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
                    onClick={handleExportCSV}
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
                    <span>Export to CSV</span>
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
                className="btn btn-ghost btn-sm"
                style={{ padding: '6px' }}
              >
                <Info size={16} />
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
                    <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>설명</div>
                    <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                      {datasetData?.description || '선택한 조건으로 추출된 광고 성과 데이터입니다.'}
                    </div>
                  </div>
                  
                  <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '8px 0' }} />
                  
                  <div style={{ marginBottom: '12px' }}>
                    <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>Dataset ID</div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>#{datasetData?.id || '1'}</div>
                  </div>
                  
                  <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '8px 0' }} />
                  
                  <div>
                    <div className="text-muted-foreground" style={{ fontSize: '11px', marginBottom: '4px' }}>생성일시</div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{datasetData?.created || '2024-01-10 14:30'}</div>
                    <div className="text-muted-foreground" style={{ fontSize: '12px' }}>
                      {datasetData?.creator || '김철수'} ({maskEmail(datasetData?.creatorId || 'kimcheolsu@gmail.com')})
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menu 버튼 */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setContextMenuOpen(!contextMenuOpen)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '6px' }}
              >
                <MoreVertical size={16} />
              </button>
              
              {contextMenuOpen && (
                <div className="dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  width: '120px',
                  zIndex: 1000
                }}>
                  <button
                    onClick={() => {
                      setContextMenuOpen(false)
                      console.log('복제:', datasetData?.id)
                    }}
                    className="dropdown-item"
                  >
                    <Copy size={14} />
                    복제
                  </button>
                  <button
                    onClick={() => {
                      setContextMenuOpen(false)
                      console.log('이동:', datasetData?.id)
                    }}
                    className="dropdown-item"
                  >
                    <ArrowRightLeft size={14} />
                    이동
                  </button>
                  <button
                    onClick={() => {
                      setContextMenuOpen(false)
                      console.log('삭제:', datasetData?.id)
                    }}
                    className="dropdown-item"
                  >
                    <Trash2 size={14} />
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="workspace-content" style={{ maxWidth: '100%', overflow: 'hidden' }}>

        {/* Key Metrics Summary */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: 'Paperlogy, sans-serif',
            margin: 0,
            marginBottom: '16px',
            color: 'hsl(var(--foreground))'
          }}>
            Key Metrics Summary
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '20px'
          }}>
            {keyMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'hsl(var(--foreground))' }}>
                      {metric.label}
                    </span>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: `${metric.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={20} style={{ color: metric.color }} />
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '4px'
                  }}>
                    <span>{metric.value}</span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'hsl(var(--muted-foreground))'
                    }}>
                      {metric.unit}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Reach Curve Analysis 영역 (추후 구현) */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: 'Paperlogy, sans-serif',
            margin: 0,
            marginBottom: '16px',
            color: 'hsl(var(--foreground))'
          }}>
            Reach Curve Analysis
          </h3>
          <div style={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
            padding: '32px',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
              <p style={{ fontSize: '13px' }}>
                차트 영역 (추후 구현)
              </p>
            </div>
          </div>
        </div>

        {/* 추출 데이터 테이블 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              fontFamily: 'Paperlogy, sans-serif',
              margin: 0,
              color: 'hsl(var(--foreground))'
            }}>
              Extracted Data
            </h3>
            <div style={{
              fontSize: '12px',
              color: 'hsl(var(--muted-foreground))',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Info size={14} />
              전체 {(12345).toLocaleString()}행 중 5,000행만 표시됩니다. 전체 데이터는 CSV 다운로드를 통해 확인하세요.
            </div>
          </div>
          <div style={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {/* 테이블 */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ 
                    backgroundColor: 'hsl(var(--muted))',
                    borderBottom: '1px solid hsl(var(--border))'
                  }}>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>기간</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>매체</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>업종(대)</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>업종(중)</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>업종(소)</th>
                    {adProductColumns.map((col) => (
                      <th key={col.key} style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>{col.label}</th>
                    ))}
                    {configData.targetingCategory && (
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12px' }}>{configData.targetingCategory}</th>
                    )}
                    {/* 지표 컬럼 - 정렬 가능 */}
                    {configData.metrics.map((metric: string) => (
                      <th 
                        key={metric}
                        onClick={() => handleSort(metric)}
                        style={{ 
                          padding: '12px 8px', 
                          textAlign: 'right', 
                          fontWeight: '600', 
                          whiteSpace: 'nowrap',
                          fontSize: '12px',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                          {metric}
                          {sortConfig?.key === metric && (
                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getSortedData().map((row, index) => (
                    <tr 
                      key={index}
                      style={{ 
                        borderBottom: '1px solid hsl(var(--border))',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">{row.period}</td>
                      <td style={{ padding: '8px', fontSize: '11px' }}>{row.media}</td>
                      <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">{row.industryLarge}</td>
                      <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">{row.industryMedium}</td>
                      <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">{row.industrySmall}</td>
                      {adProductColumns.map((col) => (
                        <td key={col.key} style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">
                          {(row as any)[col.key] || '—'}
                        </td>
                      ))}
                      {configData.targetingCategory && (
                        <td style={{ padding: '8px', fontSize: '11px' }} className="text-muted-foreground">
                          {row.targetingOption || '—'}
                        </td>
                      )}
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }} className="text-muted-foreground">
                        {row.impressions}
                        <span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>회</span>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }} className="text-muted-foreground">
                        {row.clicks}
                        <span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>회</span>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }} className="text-muted-foreground">
                        {row.cost}
                        <span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>원</span>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }} className="text-muted-foreground">{row.ctr}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }} className="text-muted-foreground">
                        {row.cpc}
                        <span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>원</span>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '11px' }} className="text-muted-foreground">
                        {row.cpm}
                        <span style={{ fontSize: '10px', opacity: 0.5, marginLeft: '4px', fontWeight: '400' }}>원</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Toast 알림 */}
      {showToast && (
        <div className={`toast toast--${showToast.type}`}>
          <div className="toast__content">
            <p className="toast__title">{showToast.message}</p>
          </div>
          <button
            onClick={() => setShowToast(null)}
            className="toast__close"
          >
            ×
          </button>
        </div>
      )}
    </AppLayout>
  )
}
