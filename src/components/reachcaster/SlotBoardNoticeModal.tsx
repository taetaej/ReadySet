import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'

// ── 공지 설정 ────────────────────────────────────────────────
// 공지 내용/기간을 교체할 때 아래 상수만 수정한다.
// NOTICE_ID를 바꾸면 "오늘 안 보기" 상태가 리셋되어 다시 노출된다.
const NOTICE_ID = 'budgetopt-2.0-launch'
const PUBLISH_START = '2026-10-02' // 게시 시작일 (배포 즉시 노출되도록 오늘 기준)
const PUBLISH_END = '2026-11-26'   // 게시 종료일 (이 날까지 노출)
const DOCS_PATH = '/docs/budgetopt-overview' // CTA 이동 경로 (Slot 유무와 무관하게 항상 유효)
// ────────────────────────────────────────────────────────────

const STORAGE_KEY = `slotboard-notice-dismissed:${NOTICE_ID}`

// 오늘 날짜(YYYY-MM-DD) 로컬 기준
const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// YYYY-MM-DD 문자열 비교 (사전식 비교가 날짜 순서와 일치)
const inPublishWindow = (today: string) => today >= PUBLISH_START && today <= PUBLISH_END

/**
 * SlotBoard 진입 시 뜨는 공지 모달 (BudgetOpt 2.0 오픈 안내).
 * - 게시 기간(PUBLISH_START ~ PUBLISH_END) 안에서만 노출. 시작일 = 오픈일(10/26).
 * - "오늘 하루 안 보기" 선택 시 당일 재노출하지 않음(localStorage). 날짜가 바뀌면 다시 노출.
 * - CTA는 Docs 소개 페이지로 이동 (Slot이 없어도 항상 유효한 경로).
 */
export function SlotBoardNoticeModal() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const today = todayStr()

  useEffect(() => {
    if (!inPublishWindow(today)) return // 게시 기간 밖이면 노출 안 함
    const dismissedDate = localStorage.getItem(STORAGE_KEY)
    if (dismissedDate !== today) {
      setOpen(true)
    }
  }, [today])

  if (!open) return null

  const close = () => setOpen(false)

  const dismissToday = () => {
    localStorage.setItem(STORAGE_KEY, today)
    setOpen(false)
  }

  const goDocs = () => {
    setOpen(false)
    navigate(DOCS_PATH)
  }

  return (
    <div className="dialog-overlay" onClick={close}>
      <div
        className="dialog-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', width: '100%' }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={close}
          aria-label="닫기"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'hsl(var(--muted-foreground))', display: 'inline-flex',
            padding: '4px', borderRadius: '6px'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ padding: '32px 28px 24px' }}>
          {/* 상태 라벨 — 무채색, 장식 최소 */}
          <div style={{
            display: 'inline-block', fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.02em', padding: '3px 8px', borderRadius: '12px',
            backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))',
            marginBottom: '14px'
          }}>
            NEW
          </div>

          {/* 제목 */}
          <h2 style={{
            fontSize: '20px', fontWeight: 700, lineHeight: 1.4,
            color: 'hsl(var(--foreground))', margin: '0 0 10px'
          }}>
            BudgetOpt 2.0 신규 오픈!
          </h2>

          {/* 본문 — 짧게. 단어 중간 어색한 개행 방지(keep-all) */}
          <p style={{
            fontSize: '14px', lineHeight: 1.6, color: 'hsl(var(--muted-foreground))',
            margin: 0, wordBreak: 'keep-all'
          }}>
            더 정교해진 모델이 매체·상품별 최적 예산 배분을 설계하고, SpinX와 함께 더 쉽고 깊이 있게 분석할 수 있어요.
          </p>

          {/* CTA — 강조는 한 곳(primary)만. Docs로 이동 */}
          <button
            onClick={goDocs}
            style={{
              marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '6px',
              height: '44px', padding: '0 20px', borderRadius: '22px', border: 'none',
              backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'hsl(var(--primary) / 0.9)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'hsl(var(--primary))' }}
          >
            자세히 알아보기
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 하단 바 — "오늘 하루 안 보기" / 닫기 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 28px', borderTop: '1px solid hsl(var(--border))'
        }}>
          <button
            onClick={dismissToday}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '13px', color: 'hsl(var(--muted-foreground))', padding: '4px 0'
            }}
          >
            오늘 하루 안 보기
          </button>
          <button
            onClick={close}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '13px', color: 'hsl(var(--muted-foreground))', padding: '4px 0'
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
