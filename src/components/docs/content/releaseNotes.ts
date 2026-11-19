import type { DocSection } from '../docsData'
import { MODEL_VERSIONS as M } from '../../common/modelVersion'

export const releaseNotesSection: DocSection = {
  id: 'release-notes',
  title: 'Release Notes',
  pages: [
    {
      id: 'release-notes-latest',
      title: '플랫폼 업데이트',
      slug: 'release-notes-latest',
      updatedAt: '2026-11-30',
      content: `# Release Notes

## v1.3.0 (2026-11-30)

ReadySet 플랫폼 DataShot 광고상품 기준 추출 지원, 결과 화면 모델 정보 표시 및 솔루션 간 연계 강화

---

### DataShot

- \`NEW\` 추출 기준 추가 — 광고상품 기준으로 여러 매체의 성과를 한 번에 비교하며 추출 (기존 방식은 조건 조합으로 유지)
- \`NEW\` Benchmark Analytics — 광고상품 기준 결과에서 업종의 광고비 배분과 매체·상품별 효율을 차트로 확인
- \`FIXED\` NAVER 보장형 DA 지표 데이터 오류 수정 — 광고비와 집행금액 데이터가 서로 바뀌어 표시되던 문제 해결

### BudgetOpt 2.0

- \`NEW\` 모델 정보 표시 — 결과 페이지에서 이 결과를 산출한 모델의 버전·학습 시점과 데이터 출처 확인

### Reach Caster

- \`NEW\` DataShot 연계 — 시나리오 결과에서 업종·매체·광고상품을 그대로 가져가 DataShot 데이터셋 생성을 바로 시작
- \`NEW\` 모델 정보 표시 — 결과 페이지에서 이 결과를 산출한 모델의 버전·학습 시점 확인
- \`IMPROVED\` 결과 테이블 안내 정리 — 모델·데이터 출처·모집단을 한 줄로 모아 표시

### SpinX

- \`IMPROVED\` 진입점 개선 — 결과 화면 하단 독(Dock)에서 SpinX 질문과 시나리오 비교·업종 데이터 뽑기 같은 연계 기능을 한곳에서 이용

## v1.2.0 (2026-10-26)

ReadySet 플랫폼 신규 솔루션 BudgetOpt 2.0 출시 및 사용성 개선

---

### SlotBoard

- \`IMPROVED\` Slot명 입력 확대 — 최대 30자에서 50자로 확대

### BudgetOpt 2.0

- \`NEW\` BudgetOpt 2.0 정식 출시 — 업종별 최적화 모델로 매체·상품별 예산 배분안을 생성하고, 예산 잠금·KPI 기준 최적화·결과 분석까지 지원
- \`NEW\` Reach Caster 연계 — 최적화한 예산안을 Reach Caster 도달 예측으로 바로 이어서 생성

### Reach Caster

- \`IMPROVED\` 업종 직접 선택 — 브랜드 식별 외에 업종을 직접 선택해 시나리오를 생성할 수 있도록 지원
- \`IMPROVED\` 시나리오명 입력 확대 — 최대 30자에서 50자로 확대
- \`IMPROVED\` BudgetOpt 2.0 연계 예측 정합성 개선 — 연계 생성 시 노출·도달 예측값을 일관되게 제공

### DataShot

- \`IMPROVED\` 데이터셋명 입력 확대 — 최대 30자에서 50자로 확대
- \`IMPROVED\` Meta 협력 광고 · 기기 유형 타겟팅 동시 선택 방지 — 함께 설정할 수 없는 조건을 비활성화하고 사유를 안내

### SpinX

- \`NEW\` 컨텍스트 첨부 — 차트·데이터 등 화면 컨텍스트를 대화에 첨부해 더 정확한 분석 요청 가능
- \`IMPROVED\` AI 모델 업그레이드 — Claude Sonnet 5.5 적용



## v1.1.1 (2026-08-27)

ReadySet 플랫폼 안정성 강화 및 사용성 개선

---

### 시스템

- \`IMPROVED\` 서비스 안정성을 위한 데이터베이스 구조 최적화

### Reach Caster

- \`NEW\` 시나리오 결과 PDF 다운로드 — 결과 화면에서 PDF 형식으로 내보내기 지원
- \`NEW\` 모델 데이터 출처 안내 — Estimated Performance 테이블에 데이터 소스 상세 정보 툴팁 추가

### SpinX

- \`IMPROVED\` AI 모델 업그레이드 — Claude Sonnet 5 적용

### GNB · 공통

- \`NEW\` 작성 내용 유실 방지 (데이터셋 생성, 시나리오 생성)

### DataShot

- \`IMPROVED\` 업종 선택 UI — 미제공 중인 소분류 옵션을 제거하여 선택 화면 간소화



## v1.1.0 (2026-08-06)

ReadySet 플랫폼 기능 확장 및 개선

---

### SlotBoard

- \`NEW\` Slot Home — Activity Log 기능 추가 (슬롯 내 활동 이력 조회)
- \`NEW\` Slot Home — Resource 기능 추가 (슬롯별 참고 자료 관리)

### Reach Caster

- \`NEW\` 시나리오 비교 기능 — 동일 슬롯 내 시나리오 간 결과 비교 분석

### DataShot

- \`IMPROVED\` 데이터셋 결과 화면 — 집계행(Summary Row) 추가
- \`NEW\` 지원 매체 추가 — Meta 협력 광고

### SpinX

- \`IMPROVED\` 넓게 보기 모드 — 패널을 화면 50% 너비로 확장하여 오버레이 표시



## v1.0.1 (2026-07-24)

ReadySet 플랫폼 보안 강화 및 개선

---

### GNB · 공통

- \`NEW\` 접속 이력 조회 기능 

### SpinX

- \`IMPROVED\` SpinX 버튼 UI 개선 — Ask SpinX 말풍선 추가, 다크모드 가시성 강화

### Reach Caster

- \`NEW\` 다운로드 파일 내 Reach Curve 데이터 추가



## v1.0.0 (2026-06-29)

ReadySet 플랫폼 정식 오픈

---

### SlotBoard

- \`NEW\` 목적별 작업 공간(Slot) 생성 · 관리
- \`NEW\` 광고주 매핑, 공개 범위 설정
- \`NEW\` Slot Home

### DataShot

- \`NEW\` 업종별 광고 성과 벤치마크 데이터셋 생성
- \`NEW\` 5개 매체 지원 (Google Ads, Meta, kakao모먼트, 네이버 성과형 DA, 네이버 보장형 DA, TikTok)
- \`NEW\` 데이터셋 목록 관리 및 CSV 내보내기

### Reach Caster

- \`NEW\` Ratio Finder: TVC/Digital 최적 비중 탐색
- \`NEW\` Reach Predictor: 매체 믹스 기반 도달률 예측
- \`NEW\` 시나리오 목록 (리스트 뷰 + 타임라인 뷰)
- \`NEW\` 결과 시각화 + 상세 데이터 테이블
- \`NEW\` 시나리오 복제, 공유 (Link / Excel)

### SpinX

- \`NEW\` AI 인사이트 어시스턴트 (Reach Caster 연동)
- \`NEW\` 컨텍스트 자동 요약 + 추천 질문
- \`NEW\` 멀티 모델 선택 (Claude, GPT)
- \`NEW\` 월간 질문 한도 관리

### GNB · 공통

- \`NEW\` Floating Alert Bar (광고주 + 알림 + 등급)
- \`NEW\` 다크모드 지원
- \`NEW\` Gitbook 스타일 사용자 가이드 (/docs)`
    },
    {
      id: 'release-notes-models',
      title: '모델 업데이트',
      slug: 'release-notes-models',
      updatedAt: '2026-11-30',
      content: `# Model Updates
| 모델 | 모델 버전 | 역할 | 사용되는 솔루션 | 정기 재학습 |
|---|---|---|---|---|
| ${M.axiom.name} | ${M.axiom.version} | SpinX 답변의 정확성 검증 | SpinX | - |
| ${M.budgetopt.name} | ${M.budgetopt.version} | 매체·상품별 최적 예산 배분 | BudgetOpt 2.0 | 매월 15일 |
| ${M.reachcaster.name} | ${M.reachcaster.version} | 노출·클릭·조회·도달 예측 | Reach Caster, BudgetOpt 2.0 | 매월 15일 |
## ${M.axiom.name} ${M.axiom.version} (2026-10-26)
SpinX 답변 정확성 검증 모델 최초 공개
${M.axiom.name}은 SpinX 답변의 정확성을 검증하는 모델입니다. 답변을 근거 데이터와 사용자의 요청에 대조해 수치와 주장이 데이터와 일치하는지, 요청한 형식과 관점을 지켰는지 판정하며, 현재 DataShot의 차트 해석, BudgetOpt 2.0의 차트 해석과 시나리오 요약에 적용되어 있습니다.
답변을 만드는 모델과는 별도의 판정 모델이 기준별로 채점합니다. 수치와 주장이 근거 데이터에 있거나 합계·비율·증감률·순위처럼 데이터에서 직접 계산되는지, 요청한 과업과 관점을 따르는지가 핵심 기준이며, 외부 정보를 사실처럼 끌어오거나 데이터가 보장하지 않는 단정·인과 주장도 함께 확인합니다. 불합격 판정은 재검토 모델이 근거 데이터와 다시 대조해 오판을 줄입니다.
화면에 보여 주기 전에 검증하는 답변은 불합격 사유를 반영해 다시 생성한 뒤 전달하고, 실시간 대화처럼 이미 전달된 답변은 사후에 판정해 품질을 점검합니다. 검증 테스트에서 ${M.axiom.name}의 판정은 정답 판정과 99.2% 일치했고, 차트 해석 2,752건에 적용했을 때 SpinX 1차 답변의 오류율은 2.0%에서 0.22%로 줄어 최종 품질 통과율 99.78%를 기록했습니다. 불합격 답변의 89.1%는 사유를 반영해 다시 생성하면 통과했습니다.
## ${M.budgetopt.name} ${M.budgetopt.version} (2026-10-26)
예산 최적화 모델 최초 공개
${M.budgetopt.name}는 Google Meridian을 기반으로 한 BudgetOpt 2.0의 예산 최적화 모델입니다. 총 예산과 KPI 목표(노출·클릭·조회·도달)를 정하면 어느 매체와 상품에 얼마를 넣어야 성과가 가장 커지는지, 그때의 예상 성과가 얼마인지를 제시합니다. 예산을 더 넣어도 성과가 늘지 않는 지점까지 계산하고, 금액을 미리 정해 둔 상품은 그대로 지킨 채 남은 예산만 최적화합니다.
CJ 메조미디어가 실제로 집행한 캠페인의 주 단위 성과로 학습했고, 22개 업종과 전체 업종을 따로 학습해 같은 매체도 업종마다 다르게 반응하는 점까지 반영합니다. 공휴일을 비롯한 외생변수도 함께 반영해 연휴처럼 매체와 무관한 성과 변동을 걷어내고, 매체가 만든 순수한 성과만으로 예산을 판단합니다.
검증 테스트에서 ${M.budgetopt.name}의 학습 모델 92개는 모두 독립적으로 여러 번 학습해도 같은 결과에 도달하는 안정성 검사를 통과했고, 추가 예산을 넣었을 때 성과가 가장 많이 오를 매체는 수천 가지 경우의 96%에서 같은 매체로 나왔습니다. 매월 전월 데이터를 더해 다시 학습하며, 검증을 통과한 모델만 매월 15일에 반영합니다.
## ${M.reachcaster.name} ${M.reachcaster.version} (2026-06-29)
광고 성과(노출·클릭·조회·도달) 예측 모델 최초 공개
${M.reachcaster.name}는 Reach Caster에서 도달을, BudgetOpt 2.0에서 캠페인의 주요 KPI(노출·클릭·조회·도달)를 예측하는 모델입니다. 집행 전에 이 조건이면 얼마나 성과가 나올지를 미리 보여 줍니다.
CJ 메조미디어가 실제로 집행한 캠페인 데이터로 학습했고, 업종별 특성을 반영한 22개 모델로 구성되어 같은 조건도 업종마다 다르게 예측합니다. 학습 엔진으로는 GBRT(Gradient Boosting Regression Tree) 알고리즘을 활용해 매체·상품별 비선형적 상호작용을 정교하게 분석하며, 노출·클릭·조회는 이 1차 예측값을 최종 성과로 그대로 씁니다. 도달은 매체 특성에 맞춰 따로 산출해, Digital은 매체 간 중복 이용률과 매체 리텐션 데이터를 적용하고(모바일 앱 환경 한정), TVC는 방송통계포털의 시청점유율, 방송매체 이용행태조사, 통계청 인구총조사를 기반으로 합니다. 두 매체 간 중복 도달은 자체 확률 모델로 보정해 하나의 순 도달(Net Reach)로 통합합니다.
실제 집행 데이터를 정밀하게 학습한 ${M.reachcaster.name}의 과거 데이터 기준 학습 정확도(100-SMAPE)는 75%입니다(2026년 10월 학습 모델 기준). 매월 15일에 전월 데이터를 추가 학습합니다.`
    }
  ]
}
