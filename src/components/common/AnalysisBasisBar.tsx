import type { ReactNode } from 'react'
import { ArrowUpRight, Info } from 'lucide-react'
import { MODEL_VERSIONS, formatDataBasisKo, type ModelVersionKey } from './modelVersion'

interface AnalysisBasisBarProps {
  /** 결과를 산출한 모델. 둘 이상이면 나란히 표시하고 hover에 역할을 덧붙인다 */
  model: ModelVersionKey | ModelVersionKey[]
  /** "데이터 출처" 항목 hover 시 보여줄 설명 */
  dataSource: ReactNode
  /** 모집단 항목 (없으면 생략) */
  population?: { value: string; basis: string }
}

const MODEL_DOCS_HREF = '/docs/release-notes-models'

const tooltipCls =
  'absolute top-full right-0 mt-2 z-[1000] hidden group-hover:block bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-3 shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1)] font-[Paperlogy,sans-serif] text-left'
/** 모델이 둘 이상일 때 hover 머리글에 덧붙이는 역할 */
const ROLE_IN_MULTI: Record<ModelVersionKey, string> = {
  budgetopt: '예산 배분',
  reachcaster: '성과 예측',
  axiom: '답변 검증'
}
const labelCls = 'text-[hsl(var(--muted-foreground))]'
const divider = <span className="w-px h-3 bg-[hsl(var(--border))] flex-shrink-0" />

/**
 * 결과 테이블 제목 행 우측의 "분석 근거" 슬롯: 모델 │ 데이터 출처 │ 모집단.
 * 모델 항목 hover 머리글("이 결과를 산출한 모델")로 이 결과의 모델임을 드러낸다.
 * 각 항목에 hover하면 설명 툴팁이 열린다. 모델 항목은 누르면 Docs 모델 업데이트 페이지로 이동.
 */
export function AnalysisBasisBar({ model, dataSource, population }: AnalysisBasisBarProps) {
  const models = Array.isArray(model) ? model : [model]
  const multi = models.length > 1
  return (
    <div className="flex items-center gap-3 text-[12px] font-[Paperlogy,sans-serif] flex-shrink-0">
      {/* 모델 (둘 이상이면 나란히) */}
      <div className="inline-flex items-center gap-[6px]">
        <span className={labelCls}>모델</span>
        {models.map((key, i) => {
          const { name, version, dataBasis } = MODEL_VERSIONS[key]
          return (
            <div key={key} className="relative group inline-flex items-center gap-[6px]">
              {i > 0 && <span className={labelCls}>·</span>}
              <a
                href={MODEL_DOCS_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[2px] font-medium no-underline text-[hsl(var(--foreground))]"
              >
                {name} {version}
                <ArrowUpRight size={12} className="text-[hsl(var(--muted-foreground))]" />
              </a>
              <div className={`${tooltipCls} w-[260px]`}>
                <div className="text-[11px] text-[hsl(var(--muted-foreground))] mb-1">
                  이 결과를 산출한 모델{multi ? ` · ${ROLE_IN_MULTI[key]}` : ''}
                </div>
                <div className="text-[13px] font-semibold">{name} {version}</div>
                <div className="h-px bg-[hsl(var(--border))] my-[10px]" />
                <div className="grid grid-cols-[72px_1fr] gap-x-3 gap-y-1 text-[12px] leading-[1.5]">
                  <span className={labelCls}>학습 데이터</span>
                  <span>{formatDataBasisKo(dataBasis)}까지</span>
                  <span className={labelCls}>정기 재학습</span>
                  <span>매월 15일 (버전은 유지)</span>
                </div>
                <div className="text-[12px] font-medium mt-[10px] inline-flex items-center gap-[2px]">
                  모델 업데이트 보기
                  <ArrowUpRight size={12} className={labelCls} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {divider}
      {/* 데이터 출처 */}
      <div className="relative group">
        <button className="inline-flex items-center gap-[4px] bg-none border-none p-0 cursor-default">
          <span className={labelCls}>데이터 출처</span>
          <Info size={12} className={labelCls} />
        </button>
        <div className={`${tooltipCls} w-[360px] p-4`}>{dataSource}</div>
      </div>
      {/* 모집단 */}
      {population && (
        <>
          {divider}
          <div className="relative group inline-flex items-center gap-[6px] cursor-default">
            <span className={labelCls}>모집단</span>
            <span className="font-medium text-[hsl(var(--foreground))]" style={{ fontVariantNumeric: 'tabular-nums' }}>{population.value}</span>
            <div className={`${tooltipCls} w-[140px]`}>
              <div className="text-[12px] font-semibold mb-1">기준</div>
              <div className="text-[12px] leading-[1.5] text-[hsl(var(--muted-foreground))]">{population.basis}</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
