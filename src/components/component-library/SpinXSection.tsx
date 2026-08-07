import { useState } from 'react'
import { SpinXSymbol, type SpinXMotion } from '../spinx/SpinXSymbol'
import { Section, ComponentGroup } from './Section'

export function SpinXSection() {
  const [fabHovered, setFabHovered] = useState(false)
  const [selectedMotion, setSelectedMotion] = useState<SpinXMotion>('idle')

  const motions: SpinXMotion[] = ['idle', 'hover', 'engage', 'active', 'settle', 'static']

  return (
    <Section title="SpinX Components" description="SpinX AI 어시스턴트 관련 UI 컴포넌트">
      <ComponentGroup label="SpinX FAB Button">
        <div style={{ position: 'relative', height: '120px', width: '200px' }}>
          <button
            onMouseEnter={() => setFabHovered(true)}
            onMouseLeave={() => setFabHovered(false)}
            aria-label="Open SpinX assistant"
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: '#09090b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: fabHovered
                ? '0 12px 32px rgba(255, 255, 255, 0.35)'
                : '0 8px 24px rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: fabHovered ? 'scale(1.08)' : 'scale(1)',
              padding: 0,
              overflow: 'visible'
            }}
          >
            <SpinXSymbol size={48} motion={fabHovered ? 'hover' : 'idle'} title="" style={{ transform: 'rotate(45deg)' }} />
          </button>
          {/* Ask SpinX 말풍선 */}
          <div style={{
            position: 'absolute',
            bottom: '88px',
            right: '16px',
            backgroundColor: 'hsl(var(--foreground))',
            color: 'hsl(var(--background))',
            padding: '6px 14px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            pointerEvents: 'none'
          }}>
            Ask SpinX
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              right: '24px',
              width: '0',
              height: '0',
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid hsl(var(--foreground))'
            }} />
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>
          화면 우하단 고정 FAB 버튼. 호버 시 scale 애니메이션 + 심볼 모션 전환.
        </div>
      </ComponentGroup>

      <ComponentGroup label="SpinX Symbol Motions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {motions.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMotion(m)}
                className={`btn btn-sm ${selectedMotion === m ? 'btn-primary' : 'btn-secondary'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '24px',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid hsl(var(--border))',
            backgroundColor: '#09090b'
          }}>
            <SpinXSymbol size={80} motion={selectedMotion} style={{ transform: 'rotate(45deg)' }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                motion="{selectedMotion}"
              </div>
              <div style={{ fontSize: '12px', color: '#a1a1aa' }}>
                {selectedMotion === 'idle' && '기본 대기 상태 — 미세한 회전 루프'}
                {selectedMotion === 'hover' && '호버 시 — 회전 속도 증가'}
                {selectedMotion === 'engage' && '패널 열림 — 확장 애니메이션 (→ active 전환)'}
                {selectedMotion === 'active' && '활성 상태 — 지속 회전'}
                {selectedMotion === 'settle' && '패널 닫힘 — 수축 후 idle 복귀'}
                {selectedMotion === 'static' && '정적 — 애니메이션 없음 (문서/썸네일용)'}
              </div>
            </div>
          </div>
        </div>
      </ComponentGroup>

      <ComponentGroup label="SpinX Symbol Sizes">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '24px',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid hsl(var(--border))',
          backgroundColor: '#09090b'
        }}>
          {[24, 32, 48, 64, 80].map((size) => (
            <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <SpinXSymbol size={size} motion="idle" style={{ transform: 'rotate(45deg)' }} />
              <span style={{ fontSize: '10px', color: '#a1a1aa' }}>{size}px</span>
            </div>
          ))}
        </div>
      </ComponentGroup>

      <ComponentGroup label="SpinX Panel (Style Guide)">
        <div style={{ 
          width: '100%', 
          maxWidth: '400px', 
          borderRadius: '12px', 
          border: '1px solid hsl(var(--border))',
          overflow: 'hidden',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)'
        }}>
          {/* 패널 헤더 — 실제 SpinXHeader 반영 */}
          <div style={{ 
            padding: '20px 24px', 
            borderBottom: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--card))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif' }}>
                SpinX for Reach Caster
              </div>
              <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>AnXer Spin-off AI Agent</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }} title="넓게 보기">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              </button>
              <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }} title="대화 초기화">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              </button>
              <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
          {/* 컨텍스트 요약 영역 */}
          <div style={{ padding: '16px 24px', backgroundColor: 'hsl(var(--background))' }}>
            <div style={{ 
              padding: '14px 18px', 
              borderRadius: '12px', 
              backgroundColor: 'hsl(var(--muted))', 
              fontSize: '13px', 
              color: 'hsl(var(--foreground))',
              lineHeight: '1.6'
            }}>
              최적 매체 비중은 TVC 50%, Digital 50%로 나타났으며, 이 비율로 집행 시 예상 Reach 1+는 73.2%입니다.
            </div>
            {/* 추천 질문 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
              {['이 예측 결과를 어떻게 해석해야 하나요?', 'Effective Impression이 무엇인가요?'].map((q) => (
                <span key={q} style={{ 
                  padding: '6px 12px', 
                  borderRadius: '16px', 
                  border: '1px solid hsl(var(--border))',
                  fontSize: '11px',
                  color: 'hsl(var(--foreground))',
                  cursor: 'pointer'
                }}>{q}</span>
              ))}
            </div>
          </div>
          {/* 패널 입력 영역 */}
          <div style={{ 
            padding: '16px 24px', 
            borderTop: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--card))'
          }}>
            <div className="input" style={{ 
              padding: '10px 14px', 
              fontSize: '13px',
              color: 'hsl(var(--muted-foreground))'
            }}>
              메시지를 입력하세요...
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
              <span>AI 답변은 부정확할 수 있습니다.</span>
              <span>Usage 3 / 100</span>
            </div>
          </div>
        </div>
      </ComponentGroup>
    </Section>
  )
}
