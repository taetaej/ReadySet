import { useState } from 'react'
import { Search, Plus, Filter, X, LayoutGrid, List, MoreVertical, Edit, Trash2, Copy, Scale, Target } from 'lucide-react'
import { Section, ComponentGroup } from './Section'

export function ButtonSection() {
  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [moduleFilter, setModuleFilter] = useState<string[]>([])
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  
  // 검색 상태
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // 뷰모드 상태
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  
  // 더보기 메뉴 상태
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  // 라디오 버튼 상태
  const [selectedModule, setSelectedModule] = useState('')

  return (
    <>
      {/* 버튼 섹션 */}
      <Section title="Buttons" description="실제 프로젝트에서 사용하는 버튼 스타일">
        <ComponentGroup label="Primary Action Buttons (Rounded)">
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '24px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              height: '48px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <Plus size={18} />
            New Slot
          </button>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '24px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              height: '48px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <Plus size={18} />
            New Scenario
          </button>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '24px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              height: '48px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <Plus size={18} />
            New Dataset
          </button>
        </ComponentGroup>

        <ComponentGroup label="Action Buttons (Form Footer)">
          <button className="btn btn-secondary btn-md">취소</button>
          <button className="btn btn-primary btn-md">확인</button>
          <button className="btn btn-primary btn-md">
            <Plus size={16} />
            생성
          </button>
        </ComponentGroup>

        <ComponentGroup label="Icon Only Buttons">
          <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
            <Search size={16} />
          </button>
          <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
            <MoreVertical size={16} />
          </button>
        </ComponentGroup>

        <ComponentGroup label="Search Button (Expandable)">
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
                  zIndex: 1,
                  color: 'hsl(var(--muted-foreground))'
                }} />
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
                    <X size={14} style={{ color: 'hsl(var(--muted-foreground))' }} />
                  </button>
                )}
              </div>
            )}
          </div>
        </ComponentGroup>

        <ComponentGroup label="Filter Button (Interactive)">
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-ghost btn-md"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              style={{ 
                border: '1px solid hsl(var(--border))',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 12px',
                backgroundColor: (statusFilter.length > 0 || moduleFilter.length > 0) 
                  ? 'hsl(var(--primary) / 0.1)' 
                  : 'transparent'
              }}
            >
              <Filter size={16} />
              <span>필터</span>
              {(statusFilter.length > 0 || moduleFilter.length > 0) && (
                <span style={{
                  marginLeft: '4px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {statusFilter.length + moduleFilter.length}
                </span>
              )}
            </button>

            {showFilterDropdown && (
              <div className="dropdown" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                minWidth: '240px',
                padding: '12px',
                zIndex: 1000
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>분석 모듈</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {['Ratio Finder', 'Reach Predictor'].map(module => (
                      <label key={module} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={moduleFilter.includes(module)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setModuleFilter([...moduleFilter, module])
                            } else {
                              setModuleFilter(moduleFilter.filter(m => m !== module))
                            }
                          }}
                          className="checkbox-custom"
                        />
                        <span style={{ fontSize: '13px' }}>{module}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>상태</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {['Completed', 'Processing', 'Pending'].map(status => (
                      <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={statusFilter.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStatusFilter([...statusFilter, status])
                            } else {
                              setStatusFilter(statusFilter.filter(s => s !== status))
                            }
                          }}
                          className="checkbox-custom"
                        />
                        <span style={{ fontSize: '13px' }}>{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ComponentGroup>

        <ComponentGroup label="View Mode Toggle">
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
        </ComponentGroup>

        <ComponentGroup label="More Menu Button (Vertical)">
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '4px' }}
            >
              <MoreVertical size={16} />
            </button>

            {showMoreMenu && (
              <div className="dropdown" style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                minWidth: '160px',
                padding: '4px',
                zIndex: 1000
              }}>
                <button className="dropdown-item">
                  <Edit size={14} />
                  <span>수정</span>
                </button>
                <button className="dropdown-item">
                  <Copy size={14} />
                  <span>복제</span>
                </button>
                <button className="dropdown-item" style={{ color: 'hsl(var(--destructive))' }}>
                  <Trash2 size={14} />
                  <span>삭제</span>
                </button>
              </div>
            )}
          </div>
        </ComponentGroup>
      </Section>

      {/* 라디오 버튼 (분석 모듈 선택 스타일) */}
      <Section title="Radio Buttons (Module Selection)" description="시나리오 생성에서 사용하는 분석 모듈 선택 스타일">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '800px' }}>
          <button
            onClick={() => setSelectedModule('Ratio Finder')}
            style={{
              padding: '16px',
              border: `1px solid ${selectedModule === 'Ratio Finder' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
              borderRadius: '8px',
              backgroundColor: selectedModule === 'Ratio Finder' ? 'hsl(var(--primary) / 0.1)' : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--foreground))' }}>
              <Scale size={18} />
              Ratio Finder
            </div>
            <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
              TVC와 디지털 매체 간 최적 예산 배분 비율 탐색
            </div>
          </button>
          <button
            onClick={() => setSelectedModule('Reach Predictor')}
            style={{
              padding: '16px',
              border: `1px solid ${selectedModule === 'Reach Predictor' ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
              borderRadius: '8px',
              backgroundColor: selectedModule === 'Reach Predictor' ? 'hsl(var(--primary) / 0.1)' : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--foreground))' }}>
              <Target size={18} />
              Reach Predictor
            </div>
            <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
              광고 집행 전후의 통합 및 개별 매체 도달률 예측
            </div>
          </button>
        </div>
      </Section>

      {/* Form Footer Buttons */}
      <Section title="Form Footer Buttons" description="생성/수정 화면 하단 버튼">
        <ComponentGroup label="Creation Form Footer">
          <div style={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            padding: '16px 24px',
            borderTop: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--muted) / 0.3)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '800px'
          }}>
            <button className="btn btn-secondary btn-md">취소</button>
            <button className="btn btn-primary btn-md">
              <Plus size={16} />
              생성
            </button>
          </div>
        </ComponentGroup>

        <ComponentGroup label="Edit Form Footer">
          <div style={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            padding: '16px 24px',
            borderTop: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--muted) / 0.3)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '800px'
          }}>
            <button className="btn btn-secondary btn-md">취소</button>
            <button className="btn btn-primary btn-md">저장</button>
          </div>
        </ComponentGroup>

        <ComponentGroup label="Multi-step Form Footer">
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '16px 24px',
            borderTop: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--muted) / 0.3)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '800px'
          }}>
            <button className="btn btn-secondary btn-md">이전</button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-md">취소</button>
              <button className="btn btn-primary btn-md">다음</button>
            </div>
          </div>
        </ComponentGroup>
      </Section>
    </>
  )
}
