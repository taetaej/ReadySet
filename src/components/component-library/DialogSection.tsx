import { useState } from 'react'
import { Share2, Link2, FileSpreadsheet, FileText } from 'lucide-react'
import { Section, ComponentGroup } from './Section'

export function DialogSection() {
  const [showDialog, setShowDialog] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  return (
    <>
      {/* 공유 버튼 */}
      <Section title="Share Button" description="공유 기능 버튼">
        <ComponentGroup label="Share Menu">
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '6px' }}
            >
              <Share2 size={16} />
            </button>

            {showShareMenu && (
              <div className="dropdown" style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                minWidth: '180px',
                padding: '4px',
                zIndex: 1000
              }}>
                <button className="dropdown-item">
                  <Link2 size={14} />
                  <span>링크 복사</span>
                </button>
                <button className="dropdown-item">
                  <FileSpreadsheet size={14} />
                  <span>Excel 다운로드</span>
                </button>
                <button className="dropdown-item">
                  <FileText size={14} />
                  <span>PDF 다운로드</span>
                </button>
              </div>
            )}
          </div>
        </ComponentGroup>
      </Section>

      {/* 다이얼로그 */}
      <Section title="Dialogs & Modals" description="다이얼로그 및 모달 예시">
        <ComponentGroup label="Dialog Trigger Buttons">
          <button className="btn btn-primary" onClick={() => setShowDialog(true)}>
            기본 다이얼로그 열기
          </button>
        </ComponentGroup>
      </Section>

      {/* 기본 다이얼로그 */}
      {showDialog && (
        <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="dialog-header">
              <h3 className="dialog-title">다이얼로그 제목</h3>
              <p className="dialog-description">다이얼로그 설명이 여기에 표시됩니다.</p>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
                다이얼로그 내용이 여기에 표시됩니다.
              </p>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary btn-md" onClick={() => setShowDialog(false)}>취소</button>
              <button className="btn btn-primary btn-md" onClick={() => setShowDialog(false)}>확인</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
