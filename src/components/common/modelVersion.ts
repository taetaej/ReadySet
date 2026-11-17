/**
 * 솔루션 모델 버전 (단일 소스)
 * - version: 모델 구조/방법론 변경 시에만 올린다.
 * - dataBasis: 매월 15일 전월 데이터를 추가 학습한 뒤 이 값만 갱신한다. (YYYY.MM)
 * - 모델명은 임시값. 확정되면 name만 교체한다.
 */
export interface ModelVersionInfo {
  name: string
  version: string
  dataBasis: string
}

export const MODEL_VERSIONS = {
  budgetopt: { name: 'Opti', version: 'v2.0', dataBasis: '2026.10' },
  reachcaster: { name: 'Predi', version: 'v2.0', dataBasis: '2026.10' },
  axiom: { name: 'AXiom', version: 'v1.0', dataBasis: '2026.10' }
} as const satisfies Record<string, ModelVersionInfo>

export type ModelVersionKey = keyof typeof MODEL_VERSIONS

/** "2026.10" → "2026년 10월" */
export function formatDataBasisKo(dataBasis: string): string {
  const [y, m] = dataBasis.split('.')
  return `${y}년 ${Number(m)}월`
}
