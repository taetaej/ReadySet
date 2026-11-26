import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { AC_ATTRIBUTE_CATALOG } from './sampleData'

interface ACAddCriteriaDialogProps {
  /** 이미 표에 있는 기준 id (목록에서 제외) */
  existingIds: string[]
  onAdd: (ids: string[]) => void
  onClose: () => void
}

/** 기준 추가: 표에 없는 속성만 골라 행으로 추가. 값은 표에서 세팅. 특성은 캠페인 설명에서만 들어오므로 제외 (정의서 4.5) */
export function ACAddCriteriaDialog({ existingIds, onAdd, onClose }: ACAddCriteriaDialogProps) {
  const [pickedIds, setPickedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const remaining = AC_ATTRIBUTE_CATALOG.filter(c => !existingIds.includes(c.id))
  // 기준 이름·설명·항목 값·관련 키워드 부분 일치 (대소문자 무시, 앞뒤 공백 트리밍, 실시간)
  const term = searchQuery.trim().toLowerCase()
  const left = remaining.filter(c => !term || [c.label, c.description, ...c.values, ...c.keys].some(x => x.toLowerCase().includes(term)))

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const toggleCriterion = (id: string) => setPickedIds(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]))

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="dialog-content dialog-md flex flex-col overflow-hidden max-h-[80vh] font-[Paperlogy,sans-serif]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ac-add-criteria-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="dialog-header">
          <h3 id="ac-add-criteria-title" className="dialog-title">속성 기준 추가</h3>
          <p className="dialog-description">선별에 더할 기준을 고르세요. 추가한 기준은 표에서 값을 세팅합니다.</p>
          <div className="relative mt-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="기준명 또는 상세 항목 검색"
              className="input w-full pl-9"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar border-t border-[hsl(var(--border))]">
          {left.length === 0 && (
            <div className="py-10 text-center text-sm text-[hsl(var(--muted-foreground))]">
              {remaining.length === 0 ? '추가할 수 있는 기준이 없습니다.' : '검색 결과가 없습니다.'}
            </div>
          )}
          {left.length > 0 && (
              <div className="pt-1">
                {left.map(c => (
                  <label key={c.id} className="flex items-start gap-2.5 py-3 border-b border-[hsl(var(--border))] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pickedIds.includes(c.id)}
                      onChange={() => toggleCriterion(c.id)}
                      className="w-4 h-4 mt-0.5 cursor-pointer accent-[hsl(var(--primary))]"
                    />
                    <span>
                      <span className="block text-sm">{c.label}</span>
                      <span className="block mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">{c.description}</span>
                    </span>
                  </label>
                ))}
              </div>
          )}
        </div>

        <div className="dialog-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary btn-md">취소</button>
          <button
            type="button"
            disabled={!pickedIds.length}
            onClick={() => onAdd(pickedIds)}
            className={`btn btn-primary btn-md ${pickedIds.length ? '' : 'opacity-50 cursor-not-allowed'}`}
          >
            추가 ({pickedIds.length}개 선택)
          </button>
        </div>
      </div>
    </div>
  )
}
