import { useEffect } from 'react'
import { Info } from 'lucide-react'
import { AC_CONDITION_CATALOG } from './sampleData'
import type { ACCuration } from './types'
import type { ACAppliedCondition } from './resultTypes'

interface ACAppliedConditionsDialogProps {
  curation: ACCuration
  conditions: ACAppliedCondition[]
  onClose: () => void
}

/** 조건 값 표기: 복수 값 가운뎃점, 예산 `{금액}만 원`, 제외 `{값} 제외` */
function valueText(cond: ACAppliedCondition): string {
  const def = AC_CONDITION_CATALOG.find(d => d.id === cond.conditionId)
  const v = def?.money
    ? `${Number(cond.values[0] || 0).toLocaleString('ko-KR')}만 원`
    : cond.values.join(' · ')
  return cond.exclude ? `${v} 제외` : v
}

/** 속성 조건 행: 카탈로그 순서, 같은 항목은 포함 행 → 제외 행 */
function attributeRows(conditions: ACAppliedCondition[]) {
  const order = (id: string) => AC_CONDITION_CATALOG.findIndex(d => d.id === id)
  return conditions
    .filter(c => AC_CONDITION_CATALOG.find(d => d.id === c.conditionId)?.group === 'attribute')
    .sort((a, b) => order(a.conditionId) - order(b.conditionId) || Number(!!a.exclude) - Number(!!b.exclude))
}

/** 속성 조건 모달 (화면정의서 3.3, md 크기, 읽기 전용): 헤더 `속성 조건 N개` 돋보기·완화 안내 링크에서 열림 */
export function ACAppliedConditionsDialog({ conditions, onClose }: ACAppliedConditionsDialogProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const rows = attributeRows(conditions)
  const hasRelaxed = rows.some(c => c.relaxed)
  const rowCls = 'grid grid-cols-[140px_minmax(0,1fr)] items-baseline gap-4 py-2.5 border-b border-[hsl(var(--border))] last:border-b-0 text-[13px]'

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog-content dialog-md flex flex-col overflow-hidden max-h-[80vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ac-applied-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="dialog-header">
          <h3 id="ac-applied-title" className="dialog-title">속성 조건</h3>
          <p className="dialog-description">큐레이션을 만들 때 입력한 속성 조건입니다. 생성 시점 기준으로 고정됩니다.</p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
          {/* 완화 안내: 생성 Step 2 단계 안내와 같은 알림 형식, 표 위에 둠 */}
          {hasRelaxed && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)] text-xs leading-[1.6] text-[hsl(var(--muted-foreground))]">
              <Info size={14} className="shrink-0 mt-[2px]" />
              <span>모든 조건을 충족하는 매체·상품이 없어, 결과에 영향이 가장 적은 조건을 제외하고 선별했습니다.</span>
            </div>
          )}
          {/* 열 헤더: 생성 Step 2 속성 기준 표와 같은 이름 (기준명 / 항목) */}
          <div className={`${rowCls} py-2 text-[12px] font-semibold text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/0.3)] px-3 rounded-t-md`}>
            <span>기준명</span>
            <span>항목</span>
          </div>
          <div className="px-3">
            {rows.map(r => {
              const def = AC_CONDITION_CATALOG.find(d => d.id === r.conditionId)
              return (
                <div key={`${r.conditionId}-${r.exclude ? 'x' : 'i'}`} className={`${rowCls} ${r.relaxed ? 'opacity-50' : ''}`}>
                  <span className="text-[hsl(var(--muted-foreground))]">{def?.label}</span>
                  <span className="text-[hsl(var(--foreground))] break-words min-w-0">
                    {valueText(r)}
                    {r.relaxed && <span className="ml-2 text-[hsl(var(--muted-foreground))]">미반영</span>}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="dialog-footer">
          <button type="button" onClick={onClose} className="btn btn-primary btn-md">확인</button>
        </div>
      </div>
    </div>
  )
}
