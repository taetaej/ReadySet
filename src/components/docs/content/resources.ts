import type { DocSection } from '../docsData'

export const resourcesSection: DocSection = {
  id: 'resources',
  title: 'Resources',
  pages: [
    {
      id: 'resources-faq',
      title: 'FAQ',
      slug: 'resources-faq',
      updatedAt: '2026-06-29',
      content: `# FAQ

준비중입니다.`
    },
    {
      id: 'resources-glossary',
      title: '용어 사전',
      slug: 'resources-glossary',
      updatedAt: '2026-06-29',
      content: `# 용어 사전

## 플랫폼 용어

- **Slot** — 캠페인 단위의 독립된 작업 공간. 하나의 광고 캠페인 또는 프로젝트에 대응
- **SlotBoard** — Slot을 생성하고 관리하는 메인 대시보드
- **Slot Home** — 개별 Slot에 진입했을 때 보이는 홈 화면. 솔루션별 결과물 요약 제공
- **DataShot** — 업종별 광고 성과 벤치마크 데이터를 추출하는 솔루션
- **Reach Caster** — 광고 캠페인의 도달률을 예측하고 최적 매체 배분을 찾는 솔루션
- **SpinX** — AI 기반 인사이트 어시스턴트. 분석 결과를 자연어로 해석
- **Ad Curator** — 광고 소재 최적화 솔루션 (준비중)
- **Budget Optimizer** — 예산 최적화 솔루션 (준비중)

## Reach Caster 용어

- **Ratio Finder** — TVC와 Digital 간 최적 예산 배분 비율을 탐색하는 분석 모듈
- **Reach Predictor** — 선택한 매체 믹스의 예상 도달률을 예측하는 분석 모듈
- **시나리오** — 특정 조건(매체, 예산, 기간, 타겟)으로 실행한 하나의 분석 단위
- **시뮬레이션 단위** — Ratio Finder에서 매체 비중을 변화시키는 간격 (5%/10%/20%)
- **리치커브** — 예산 변화에 따른 도달률 변화와 한계 효율점을 시각화한 차트
- **Optimal Point** — 리치커브에서 비용 대비 도달률 효율이 가장 높은 지점
- **Efficiency Peak** — 예산 증액 대비 도달률 증가가 체감되기 시작하는 변곡점

## DataShot 용어

- **DataShot** — 업종별 광고 성과 벤치마크 데이터를 추출하는 솔루션
- **데이터셋 (Dataset)** — DataShot에서 조회 조건을 조합하여 추출한 데이터 결과
- **조회조건** — 매체별 세부 필터 항목
- **타겟팅 옵션** — 캠페인의 타겟팅 설정 조건 (예: 성별, 연령 등)
- **종합 지표** — 광고비 포함 전체 지표. Private, Internal Slot에서만 선택 가능
- **성과 지표** — 단가 및 효율 지표. 모든 Slot에서 선택 가능

## 광고 지표 용어

- **Reach** — 광고에 최소 1회 이상 노출된 고유 사용자 수 (또는 비율)
- **Reach 1+** — 1회 이상 노출된 사용자 비율 (%)
- **Reach 3+** — 3회 이상 노출된 사용자 비율 (%)
- **Frequency** — 1인당 평균 광고 노출 횟수
- **GRP (Gross Rating Point)** — 총 시청률. Reach × Frequency
- **CPM (Cost Per Mille)** — 1,000회 노출당 비용
- **CPRP (Cost Per Rating Point)** — 시청률 1% 달성에 드는 비용
- **CPC (Cost Per Click)** — 클릭당 비용
- **CTR (Click Through Rate)** — 클릭률. 클릭 수 / 노출 수 × 100
- **Impression** — 광고가 화면에 표시된 총 횟수
- **Effective Impression** — 사용자가 실제로 인지할 수 있는 조건에서 발생한 유효 노출 수

## 권한 용어

- **마케터 (Marketer)** — 플랫폼 내부 운영 담당자. 모든 슬롯 권한의 기본 통제권 보유
- **클라이언트 (Client)** — 광고주 본사 담당자. Shared 슬롯에 접근 가능
- **에이전시 (Agency)** — 광고 대행사 담당자. Shared 슬롯에 접근 가능
- **Private** — 생성자 본인만 접근 가능한 슬롯 공개 범위
- **Internal** — 해당 광고주 권한을 가진 마케터만 접근 가능한 슬롯 공개 범위
- **Shared** — 외부 파트너와 공유된 슬롯 공개 범위`
    },
    {
      id: 'resources-download',
      title: '소개서 다운로드',
      slug: 'resources-download',
      updatedAt: '2026-06-29',
      content: `# 소개서 다운로드

ReadySet 플랫폼 관련 자료를 다운로드할 수 있습니다.

## 제공 자료

### ReadySet 플랫폼 소개서

플랫폼 전체 기능과 솔루션을 소개하는 종합 자료입니다. 내부 공유 및 클라이언트 프레젠테이션에 활용할 수 있습니다.

- [ReadySet 플랫폼 소개서 다운로드 (PDF)](https://lib.cjmezzomedia.com/homepage/solutions/cjmezzomedia_adly_20260624.pdf)`
    }
  ]
}
