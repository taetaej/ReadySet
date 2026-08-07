import { useState } from 'react'
import { Search, ChevronRight, ChevronDown } from 'lucide-react'
import { Section, ComponentGroup } from './Section'

export function InputSection() {
  // 드롭다운 상태
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false)
  const [showMediaDropdown, setShowMediaDropdown] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedMedia, setSelectedMedia] = useState('TV')

  return (
    <>
      {/* 인풋 필드 */}
      <Section title="Input Fields" description="텍스트 입력 및 검색 필드">
        <ComponentGroup label="Text Input with Character Count">
          <div style={{ width: '400px' }}>
            <input 
              type="text" 
              placeholder="시나리오명을 입력하세요 (최대 30자)" 
              className="input"
              style={{ width: '100%' }}
              maxLength={30}
            />
            <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginTop: '4px', textAlign: 'right' }}>
              0/30
            </div>
          </div>
        </ComponentGroup>

        <ComponentGroup label="Search Input">
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
            <input type="text" placeholder="브랜드 검색" className="input" style={{ paddingLeft: '40px', width: '100%' }} />
          </div>
        </ComponentGroup>

        <ComponentGroup label="Textarea with Character Count">
          <div style={{ width: '500px' }}>
            <textarea 
              placeholder="시나리오에 대한 설명을 입력하세요 (최대 200자)" 
              className="input"
              style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
              maxLength={200}
            />
            <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginTop: '4px', textAlign: 'right' }}>
              0/200
            </div>
          </div>
        </ComponentGroup>
      </Section>

      {/* 드롭다운 */}
      <Section title="Dropdowns & Selects" description="실제 사용하는 선택 드롭다운">
        <ComponentGroup label="Industry Select (업종 선택 - ChevronRight)">
          <div style={{ position: 'relative', width: '400px' }}>
            <button
              onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
              className="input"
              style={{
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ color: selectedIndustry ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>
                {selectedIndustry || '업종을 선택하세요'}
              </span>
              <ChevronRight size={16} />
            </button>

            {showIndustryDropdown && (
              <div className="dropdown" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000
              }}>
                {['전자/IT', '자동차', '식품/음료', '화장품/뷰티', '금융/보험', '유통/서비스'].map((industry) => (
                  <button
                    key={industry}
                    onClick={() => {
                      setSelectedIndustry(industry)
                      setShowIndustryDropdown(false)
                    }}
                    className="dropdown-item"
                    style={{
                      backgroundColor: selectedIndustry === industry ? 'hsl(var(--muted))' : 'transparent'
                    }}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ComponentGroup>

        <ComponentGroup label="Media Select (매체 선택 - ChevronDown)">
          <div style={{ position: 'relative', width: '300px' }}>
            <button
              onClick={() => setShowMediaDropdown(!showMediaDropdown)}
              className="input"
              style={{
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{selectedMedia}</span>
              <ChevronDown size={16} />
            </button>

            {showMediaDropdown && (
              <div className="dropdown" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                zIndex: 1000
              }}>
                {['TV', 'Digital', 'Radio', 'Print', 'OOH'].map((media) => (
                  <button
                    key={media}
                    onClick={() => {
                      setSelectedMedia(media)
                      setShowMediaDropdown(false)
                    }}
                    className="dropdown-item"
                    style={{
                      backgroundColor: selectedMedia === media ? 'hsl(var(--muted))' : 'transparent'
                    }}
                  >
                    {media}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ComponentGroup>
      </Section>
    </>
  )
}
