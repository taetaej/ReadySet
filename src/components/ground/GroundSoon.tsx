// GroundSoon.tsx — 워크플로우 · 도구(MCP) 자리. 1차에는 무엇이 올지만 조용히 알린다.

import { GroundLayout } from './GroundLayout'

const COPY = {
  flow: {
    title: 'Workflows',
    lede: '캔버스 위에 노드를 놓아, 요청 하나로 솔루션을 엮는 흐름을 만들어요.',
    points: [
      '라이브러리 검색 → Ad Curator → BudgetOpt 2.0 → Reach Caster를 노드로 잇기',
      '대화에서 거친 단계를 "워크플로우로 저장"해 캔버스로 가져오기',
      '실행한 워크플로우는 인사이트 맵 위에 경로로 남아요',
    ],
  },
  tools: {
    title: 'Tools',
    lede: '매체 MCP를 연결해 실제 집행 결과를 Ground로 가져와요.',
    points: [
      '광고주(폴더) 단위 토큰 격리와 권한 상속',
      '연결되면 인사이트 맵의 "성과 해석" 군집이 시나리오와 이어져요',
      '시나리오 vs 실제 집행 결과 비교',
    ],
  },
}

export function GroundSoon({ kind }: { kind: 'flow' | 'tools' }) {
  const c = COPY[kind]
  return (
    <GroundLayout title={`${c.title} - Ground`}>
      <div className="gd-container gd-page gd-soon">
        <h1 className="gd-page-title">{c.title}<span className="gd-rail-soon">Soon</span></h1>
        <p className="gd-page-sub">{c.lede}</p>
        <ol className="gd-playbook" style={{ maxWidth: 560 }}>
          {c.points.map((p, i) => <li key={p}><span className="gd-fi-no">{String(i + 1).padStart(2, '0')}</span><div><p style={{ margin: 0, color: 'hsl(var(--foreground))' }}>{p}</p></div></li>)}
        </ol>
      </div>
    </GroundLayout>
  )
}
