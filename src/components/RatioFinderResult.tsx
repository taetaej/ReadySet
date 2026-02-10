import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Info, Scale } from 'lucide-react'
import ReactECharts from 'echarts-for-react'
import { AppLayout } from './layout/AppLayout'
import { getDarkMode, setDarkMode as setDarkModeUtil } from '../utils/theme'

interface RatioFinderResultProps {
  scenarioData?: any
}

// 샘플 시뮬레이션 데이터 (10% 단위, 11개 조합)
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
  
  const [isDarkMode, setIsDarkMode] = useState(() => getDarkMode())
  const [allSlotsExpanded, setAllSlotsExpanded] = useState(true)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null)
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false)
  
  const simulationData = generateSimulationData()
  const maxReachIndex = simulationData.reduce((maxIdx, curr, idx, arr) => 
    curr.reach > arr[maxIdx].reach ? idx : maxIdx, 0
  )

  const toggleAllSlots = () => {
    setAllSlotsExpanded(!allSlotsExpanded)
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

  // ECharts 옵션 설정
  const getChartOption = () => {
    const labels = simulationData.map(d => `TVC ${d.tvcRatio}%\nDigital ${d.digitalRatio}%`)
    const tvcData = simulationData.map(d => d.tvcRatio)
    const digitalData = simulationData.map(d => d.digitalRatio)
    const reachData = simulationData.map(d => d.reach)

    // 컬러 정의
    const colors = {
      tvc: isDarkMode ? '#f5f5f5' : '#1a1a1a',
      tvcFaded: isDarkMode ? 'rgba(245, 245, 245, 0.25)' : 'rgba(26, 26, 26, 0.25)',
      digital: '#00FFE5',
      digitalFaded: 'rgba(0, 255, 229, 0.25)',
      reach: '#FF0055',
      reachShadow: 'rgba(255, 0, 85, 0.5)'
    }

    return {
      backgroundColor: 'transparent',
      grid: {
        left: '3%',
        right: '5%',
        bottom: '20%',
        top: '8%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'transparent'
          }
        },
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        textStyle: {
          color: isDarkMode ? '#fff' : '#000',
          fontFamily: 'Paperlogy, sans-serif',
          fontSize: 13
        },
        formatter: (params: any) => {
          const tvc = params[0]
          const digital = params[1]
          const reach = params[2]
          return `
            <div style="padding: 4px;">
              <div style="font-weight: 600; margin-bottom: 8px;">비중 조합 ${params[0].dataIndex + 1}</div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${colors.tvc}; border-radius: 2px;"></span>
                <span>TVC: ${tvc.value}%</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${colors.digital}; border-radius: 2px;"></span>
                <span>Digital: ${digital.value}%</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${colors.reach}; border-radius: 50%;"></span>
                <span style="font-weight: 600;">통합 도달률: ${reach.value}%</span>
              </div>
            </div>
          `
        }
      },
      legend: {
        data: [
          { name: 'TVC', itemStyle: { color: colors.tvc } },
          { name: 'Digital', itemStyle: { color: colors.digital } },
          { name: '통합 도달률', itemStyle: { color: colors.reach } }
        ],
        bottom: 0,
        textStyle: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          fontFamily: 'Paperlogy, sans-serif',
          fontSize: 12
        }
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
          fontFamily: 'Paperlogy, sans-serif',
          fontSize: 11,
          rotate: 0,
          interval: 0,
          lineHeight: 16
        },
        axisLine: {
          lineStyle: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        },
        axisTick: {
          show: false
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '매체 비중 (%)',
          nameTextStyle: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
            fontFamily: 'Paperlogy, sans-serif',
            fontSize: 12
          },
          max: 100,
          axisLabel: {
            formatter: '{value}%',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            fontFamily: 'Paperlogy, sans-serif',
            fontSize: 11
          },
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              type: 'dashed'
            }
          }
        },
        {
          type: 'value',
          name: '통합 도달률 (%)',
          nameTextStyle: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
            fontFamily: 'Paperlogy, sans-serif',
            fontSize: 12
          },
          min: 40,
          max: 80,
          axisLabel: {
            formatter: '{value}%',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            fontFamily: 'Paperlogy, sans-serif',
            fontSize: 11
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: 'TVC',
          type: 'bar',
          stack: 'ratio',
          data: tvcData.map((val, idx) => ({
            value: val,
            itemStyle: {
              color: selectedBarIndex === null || idx === selectedBarIndex 
                ? colors.tvc
                : colors.tvcFaded,
              borderWidth: 0
            },
            emphasis: {
              itemStyle: {
                color: colors.tvc
              }
            }
          })),
          barWidth: '60%',
          label: {
            show: false
          }
        },
        {
          name: 'Digital',
          type: 'bar',
          stack: 'ratio',
          data: digitalData.map((val, idx) => ({
            value: val,
            itemStyle: {
              color: selectedBarIndex === null || idx === selectedBarIndex
                ? colors.digital
                : colors.digitalFaded,
              borderWidth: 0
            },
            emphasis: {
              itemStyle: {
                color: colors.digital
              }
            }
          })),
          label: {
            show: false
          },
          markPoint: maxReachIndex !== null ? {
            symbol: 'pin',
            symbolSize: 50,
            symbolOffset: [0, '-50%'],
            data: [
              {
                name: 'Best Ratio',
                coord: [maxReachIndex, 105],
                value: 'Best',
                itemStyle: {
                  color: isDarkMode ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))',
                  borderColor: isDarkMode ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))',
                  borderWidth: 0
                },
                label: {
                  show: true,
                  formatter: 'Best',
                  color: isDarkMode ? 'hsl(var(--background))' : 'hsl(var(--background))',
                  fontFamily: 'Paperlogy, sans-serif',
                  fontSize: 10,
                  fontWeight: 600,
                  position: 'inside'
                }
              }
            ]
          } : undefined
        },
        {
          name: '통합 도달률',
          type: 'line',
          yAxisIndex: 1,
          data: reachData,
          smooth: true,
          lineStyle: {
            color: colors.reach,
            width: 3
          },
          itemStyle: {
            color: colors.reach,
            borderColor: colors.reach,
            borderWidth: 3
          },
          symbol: 'circle',
          symbolSize: 8,
          emphasis: {
            scale: 1.3,
            itemStyle: {
              borderWidth: 4,
              shadowBlur: 10,
              shadowColor: colors.reachShadow
            }
          }
        }
      ]
    }
  }

  const onChartClick = (params: any) => {
    if (params.componentType === 'series' && params.seriesType === 'bar') {
      setSelectedBarIndex(params.dataIndex)
    }
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '500' }}>타겟 GRP:</span>
                <span>{scenarioData?.targetGrp?.length || 3}개 세그먼트</span>
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
      <div className="workspace-content">
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '24px',
            fontFamily: 'Paperlogy, sans-serif'
          }} className="text-foreground">
            매체 비중별 통합 도달률 분석
          </h2>
          <ReactECharts
            option={getChartOption()}
            style={{ height: '500px', width: '100%' }}
            onEvents={{
              click: onChartClick
            }}
          />
        </div>

        {/* 상세 데이터 테이블 */}
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            fontFamily: 'Paperlogy, sans-serif'
          }} className="text-foreground">
            상세 데이터
            {selectedData && (
              <span style={{ 
                fontSize: '14px', 
                fontWeight: '400',
                marginLeft: '12px'
              }} className="text-muted-foreground">
                (TVC {selectedData.tvcRatio}% / Digital {selectedData.digitalRatio}%)
              </span>
            )}
          </h2>
          
          {selectedData ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              fontFamily: 'Paperlogy, sans-serif'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '12px', marginBottom: '8px' }} className="text-muted-foreground">
                  통합 도달률
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#7B2FFF' }}>
                  {selectedData.reach}%
                </div>
              </div>
              <div style={{
                padding: '20px',
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '12px', marginBottom: '8px' }} className="text-muted-foreground">
                  TVC 예산
                </div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: isDarkMode ? '#f5f5f5' : '#1a1a1a' }}>
                  ₩{(selectedData.tvcBudget / 1000000).toFixed(0)}M
                </div>
              </div>
              <div style={{
                padding: '20px',
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '12px', marginBottom: '8px' }} className="text-muted-foreground">
                  Digital 예산
                </div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#00FF94' }}>
                  ₩{(selectedData.digitalBudget / 1000000).toFixed(0)}M
                </div>
              </div>
              <div style={{
                padding: '20px',
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '12px', marginBottom: '8px' }} className="text-muted-foreground">
                  평균 빈도
                </div>
                <div style={{ fontSize: '20px', fontWeight: '600' }} className="text-foreground">
                  {selectedData.frequency.toFixed(1)}
                </div>
              </div>
              <div style={{
                padding: '20px',
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '12px', marginBottom: '8px' }} className="text-muted-foreground">
                  총 GRP
                </div>
                <div style={{ fontSize: '20px', fontWeight: '600' }} className="text-foreground">
                  {selectedData.grp.toFixed(1)}
                </div>
              </div>
              <div style={{
                padding: '20px',
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '12px', marginBottom: '8px' }} className="text-muted-foreground">
                  평균 CPM
                </div>
                <div style={{ fontSize: '20px', fontWeight: '600' }} className="text-foreground">
                  ₩{selectedData.cpm.toFixed(0)}
                </div>
              </div>
            </div>
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
    </AppLayout>
  )
}
