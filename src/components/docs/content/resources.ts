import type { DocSection } from '../docsData'

export const resourcesSection: DocSection = {
  id: 'resources',
  title: 'Resources',
  pages: [
    {
      id: 'resources-faq',
      title: 'FAQ',
      slug: 'resources-faq',
      updatedAt: '2026-05-28',
      content: `# FAQ

## 계정 및 접근

### 특정 Slot이 보이지 않습니다.

해당 Slot의 공개 범위와 본인의 권한을 확인하세요. Private Slot은 생성자만, Internal Slot은 마케터만 접근 가능합니다. 접근 권한이 필요하면 Slot 관리자에게 공유를 요청하세요.

### 광고주가 목록에 없습니다.

본인에게 해당 광고주 권한이 부여되어 있는지 확인하세요. 권한 부여는 플랫폼 관리자에게 요청해야 합니다.

---

## Reach Caster

### 시나리오 생성에 얼마나 걸리나요?

데이터 규모와 매체 수에 따라 다르지만, 일반적으로 10~20분 내에 완료됩니다. 완료 시 알림 센터에서 알려드립니다.

### Ratio Finder와 Reach Predictor의 차이는 무엇인가요?

- **Ratio Finder**: TVC와 Digital 간 최적 예산 배분 비율을 탐색합니다. "어떤 비율이 가장 효율적인가?"에 답합니다.
- **Reach Predictor**: 이미 정해진 매체 믹스의 예상 도달률을 예측합니다. "이 구성으로 집행하면 얼마나 도달하는가?"에 답합니다.

### 시나리오를 수정할 수 있나요?

생성된 시나리오의 설정은 수정할 수 없습니다. 대신 "복제" 기능으로 기존 설정을 복사한 뒤 필요한 부분만 변경하여 새로 실행할 수 있습니다.

### 시나리오 결과가 Error 상태입니다.

일시적인 서버 오류일 수 있습니다. "재시도" 버튼을 클릭하여 다시 실행해보세요. 반복적으로 실패하면 관리자에게 문의하세요.

### 지원하는 매체는 어떤 것들이 있나요?

DIGITAL 7개 매체(Google Ads, Meta, NAVER 보장형/성과형 DA, kakao 모먼트, TargetPick, TikTok), TV 3개 매체(CJ ENM, 지상파, 종편), 미연동 매체 37개를 지원합니다.

---

## DataShot

### 데이터는 얼마나 자주 업데이트되나요?

광고 플랫폼 API를 통해 일 단위로 데이터가 갱신됩니다.

### 데이터셋 생성이 실패했습니다.

광고 플랫폼 API 연동 상태를 확인하세요. 해당 플랫폼의 인증 토큰이 만료되었을 수 있습니다.

---

## SpinX

### SpinX 대화가 사라졌습니다.

SpinX 세션은 14일간 유지됩니다. 14일이 지나면 자동 만료되어 이전 대화를 볼 수 없습니다.

### SpinX가 부정확한 답변을 합니다.

AI의 답변은 참고용이며, 중요한 의사결정에는 반드시 원본 데이터를 확인하세요. 답변 하단의 출처를 통해 근거를 확인할 수 있습니다.

### 어떤 모델을 선택해야 하나요?

- 데이터 분석/전략: Claude Sonnet 4.5
- 빠른 답변: Claude Haiku 4.5
- 시장 조사/트렌드: Gemini 3pro (기본)
- 아이디어/기획: Chat GPT 4o`
    },
    {
      id: 'resources-glossary',
      title: '용어 사전',
      slug: 'resources-glossary',
      updatedAt: '2026-05-28',
      content: `# 용어 사전

## 플랫폼 용어

- **Slot** — 캠페인 단위의 독립된 작업 공간. 하나의 광고 캠페인 또는 프로젝트에 대응
- **SlotBoard** — Slot을 생성하고 관리하는 메인 대시보드
- **Slot Home** — 개별 Slot에 진입했을 때 보이는 홈 화면. 솔루션별 결과물 요약 제공
- **DataShot** — 광고 플랫폼 데이터를 수집하여 분석용 데이터셋을 생성하는 솔루션
- **Reach Caster** — 광고 캠페인의 도달률을 예측하고 최적 매체 배분을 찾는 솔루션
- **SpinX** — AI 기반 인사이트 어시스턴트. 분석 결과를 자연어로 해석
- **Ad Curator** — 광고 소재 최적화 솔루션 (준비중)
- **Budget Optimizer** — 예산 최적화 솔루션 (준비중)

## Reach Caster 용어

- **Ratio Finder** — TVC와 Digital 간 최적 예산 배분 비율을 탐색하는 분석 모듈
- **Reach Predictor** — 선택한 매체 믹스의 예상 도달률을 예측하는 분석 모듈
- **시나리오** — 특정 조건(매체, 예산, 기간, 타겟)으로 실행한 하나의 분석 단위
- **시뮬레이션 단위** — Ratio Finder에서 매체 비중을 변화시키는 간격 (5%/10%/20%)
- **리치커브** — 예산 변화에 따른 도달률 변화를 S-curve로 시각화한 차트
- **Optimal Point** — 리치커브에서 비용 대비 도달률 효율이 가장 높은 지점
- **Efficiency Peak** — 예산 증액 대비 도달률 증가가 체감되기 시작하는 변곡점

## DataShot 용어

- **DataShot** — 업종별 광고 성과 벤치마크 데이터를 추출하는 솔루션
- **데이터셋 (Dataset)** — DataShot에서 조회 조건을 조합하여 추출한 성과 데이터 결과물
- **조회조건** — 매체별 세부 필터 항목 (캠페인 목표, 구매 유형, 플랫폼, 과금 방식 등)
- **타겟팅 옵션** — 데이터를 세분화하는 타겟팅 기준 (기기유형, 성별, 연령 등)
- **Configuration Summary** — 데이터셋 생성 시 우측에 표시되는 현재 설정 요약 패널
- **조회기간** — 데이터 추출 대상 기간. 월별 또는 분기별로 설정하며 최대 2년
- **업종 분류** — 대분류 > 중분류 > 소분류 3단계 계층 구조의 업종 카테고리
- **샘플 데이터** — Step 3에서 추출 전 미리보기로 제공하는 데이터 프리뷰
- **Completed** — 데이터 추출이 정상 완료된 데이터셋 상태
- **Processing** — 데이터 추출이 진행 중인 데이터셋 상태
- **Expired** — 생성 후 1년 경과로 만료된 데이터셋 상태

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
      updatedAt: '2026-05-28',
      content: `# 소개서 다운로드

ReadySet 플랫폼 관련 자료를 다운로드할 수 있습니다.

## 제공 자료

### ReadySet 플랫폼 소개서

플랫폼 전체 기능과 솔루션을 소개하는 종합 자료입니다. 내부 공유 및 클라이언트 프레젠테이션에 활용할 수 있습니다.

- [ReadySet 플랫폼 소개서 다운로드 (PDF)](/docs/downloads/readyset-platform-intro.pdf)

### adly 온보딩 가이드

신규 사용자를 위한 단계별 시작 가이드입니다. adly 계정 설정부터 솔루션 사용 시작까지의 과정을 안내합니다.

- [adly 온보딩 가이드 다운로드 (PDF)](/docs/downloads/onboarding-guide.pdf)`
    }
  ]
}
