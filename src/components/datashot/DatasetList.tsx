import { Dataset } from './types'

interface DatasetListProps {
  datasets: Dataset[]
  onDatasetClick: (dataset: Dataset) => void
  onCreateDataset: () => void
}

export function DatasetList({ datasets, onDatasetClick, onCreateDataset }: DatasetListProps) {
  return (
    <div className="workspace-content">
      <div style={{ padding: '24px' }}>
        <h1>Data Shot 목록</h1>
        <button onClick={onCreateDataset}>데이터 추출</button>
        <div>
          {datasets.map(dataset => (
            <div key={dataset.id} onClick={() => onDatasetClick(dataset)} style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0', cursor: 'pointer' }}>
              <h3>{dataset.name}</h3>
              <p>매체: {dataset.media}</p>
              <p>상태: {dataset.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
