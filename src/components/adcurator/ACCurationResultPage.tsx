import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ACCurationResult } from './ACCurationResult'
import { getACResult } from './resultSampleData'

/**
 * 큐레이션 결과 라우트 래퍼 (/adcurator/curation/:id/result)
 * 결과가 없으면(Completed 아님·없는 id) 큐레이션 목록으로 이동함. 안내 문구는 범위 제외(화면정의서 15.1 Q3)
 */
export function ACCurationResultPage() {
  const { id } = useParams<{ id: string }>()
  const result = useMemo(() => getACResult(Number(id)), [id])
  if (!result) return <Navigate to="/adcurator" replace />
  return <ACCurationResult key={result.curation.id} result={result} />
}
