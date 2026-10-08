// 데이터셋 상세 분기 라우터
// 목록에서 클릭한 데이터셋의 추출 기준(extractMode)에 따라 상세 화면을 분기한다.
// - 'product'(광고상품): 다매체 통합 결과(차트 2종 + 테이블) → MockupDatasetResult
// - 그 외/미지정(조건 조합): 기존 상세 → DatasetDetail
// 확정 시: 광고상품 상세를 본 소스로 승격하고 본 라우터를 정식 분기로 유지.
import { useLocation } from 'react-router-dom'
import { DatasetDetail } from './DatasetDetail'
import { DatasetResult } from './DatasetResult'

export function DatasetDetailRouter() {
  const location = useLocation()
  const datasetData = location.state?.datasetData

  if (datasetData?.extractMode === 'product') {
    return <DatasetResult />
  }
  return <DatasetDetail />
}
