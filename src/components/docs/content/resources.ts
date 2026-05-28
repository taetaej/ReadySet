import type { DocSection } from '../docsData'

export const resourcesSection: DocSection = {
  id: 'resources',
  title: 'Resources',
  pages: [
    {
      id: 'resources-faq',
      title: 'FAQ',
      slug: 'resources-faq',
      content: `# FAQ

## 자주 묻는 질문

### 데이터는 얼마나 자주 업데이트되나요?

광고 플랫폼 API를 통해 일 단위로 데이터가 갱신됩니다.

### 시나리오 생성에 얼마나 걸리나요?

데이터 규모에 따라 다르지만, 일반적으로 3~10분 내에 완료됩니다.

### 여러 광고주를 동시에 관리할 수 있나요?

네, SlotBoard에서 광고주별로 독립된 Slot을 생성하여 관리할 수 있습니다.`
    },
    {
      id: 'resources-glossary',
      title: '용어 사전',
      slug: 'resources-glossary',
      content: `# 용어 사전

## 플랫폼 용어

- **Slot** — 캠페인 단위의 작업 공간
- **DataShot** — 데이터 수집 및 분석 솔루션
- **Reach Caster** — 도달률 예측 솔루션
- **SpinX** — AI 인사이트 어시스턴트

## 광고 용어

- **Reach** — 광고에 노출된 고유 사용자 수
- **CPM** — 1,000회 노출당 비용
- **CPC** — 클릭당 비용
- **CTR** — 클릭률 (클릭 수 / 노출 수)
- **GRP** — 총 시청률 (Gross Rating Point)
- **CPRP** — 시청률 1% 달성 비용`
    },
    {
      id: 'resources-download',
      title: '소개서 다운로드',
      slug: 'resources-download',
      content: `# 소개서 다운로드

ReadySet 플랫폼 소개서를 다운로드할 수 있습니다.

## 제공 자료

- ReadySet 플랫폼 소개서 (PDF)
- 솔루션별 기능 요약서
- 온보딩 가이드`
    }
  ]
}
