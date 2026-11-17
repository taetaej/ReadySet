import type { DocSection } from '../docsData'
import { MODEL_VERSIONS as M } from '../../common/modelVersion'
// TODO(배포 전 교체): 모델 업데이트 페이지의 성능 수치는 구조 확인용 샘플입니다. 실제 검증 값으로 교체하세요.
const SAMPLE_METRICS = {
  budgetoptMape: '8.4%',
  budgetoptKpiGain: '12%',
  budgetoptIndustries: '24개',
  reachcastMape: '6.1%',
  reachcastInventories: '180개',
  axiomMatchRate: '99.2%'
}
const S = SAMPLE_METRICS

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
| ${M.reachcaster.name} | ${M.reachcaster.version} | 노출 조건별 도달·빈도 예측 | Reach Caster, BudgetOpt 2.0 | 매월 15일 |
## ${M.axiom.name} ${M.axiom.version} (2026-10-26)
SpinX 답변 정확성 검증 모델 최초 공개
SpinX가 내놓는 답변의 수치와 주장을 결과 데이터와 하나하나 대조해, 근거가 없거나 어긋나는 내용은 답변에서 걸러냅니다. 검증 테스트에서 답변 속 수치의 ${S.axiomMatchRate}가 원본 데이터와 일치했습니다.
## ${M.budgetopt.name} ${M.budgetopt.version} (2026-10-26)
업종별 특화 예산 배분 최적화 모델 최초 공개
${M.budgetopt.name}는 BudgetOpt 2.0의 예산 배분 최적화 모델입니다. 선택한 KPI 목표와 총 예산을 기준으로 수만 개의 예산 조합을 시뮬레이션해, 매체·상품별로 성과가 가장 큰 배분안과 예상 성과를 산출합니다.
업종별로 CJ 메조미디어가 실제 집행한 캠페인 성과 데이터를 학습해 업종마다 다른 매체 반응 곡선(효율 체감·포화)을 반영합니다. 매체 배분은 Google Meridian 미디어믹스 모델이, 상품 배분은 GBRT 예측 모델이 맡아 매체에서 상품 순서의 2단계로 최적화합니다. 매체 우선 배분과 효율 포화 회피 원리에 따라, 포화 지점을 넘지 않는 선에서 증액 효율이 높은 매체로 예산을 모읍니다.
법정 공휴일처럼 매체 효과가 아닌 요인은 학습 단계에서 변수로 분리해 연휴 성과 변동이 매체 효과로 섞이지 않게 합니다. 매월 15일에 전월 데이터를 추가 학습하며, 검증에서 예측 대비 실적 오차(MAPE)는 ${S.budgetoptMape}였고 ${S.budgetoptIndustries} 업종 기준 업종 평균 대비 KPI가 평균 ${S.budgetoptKpiGain} 개선되었습니다.
## ${M.reachcaster.name} ${M.reachcaster.version} (2026-06-29)
도달·빈도 예측 모델 최초 공개
${M.reachcaster.name}는 Reach Caster의 도달·빈도 예측 모델이며, BudgetOpt 2.0 결과의 도달 예측에도 쓰입니다. 노출 조건을 입력하면 타겟별 도달(Reach), 평균 빈도, 리치 커브를 예측하고, 노출을 늘려도 도달이 더 늘지 않는 상한(Ceiling)까지 반영합니다.
CJ 메조미디어가 실제 집행한 캠페인 데이터를 기반으로, Digital은 매체 간 중복 이용률과 매체 리텐션 데이터를 적용한 GBRT 기반 모델이 도달률을 예측합니다(모바일 앱 환경 한정). TVC는 방송통계포털의 시청점유율, 방송매체 이용행태조사, 통계청 인구총조사를 기반으로 타겟별 도달률을 산출합니다.
Digital과 TVC 간 중복 시청자는 자체 확률 모델로 보정해 순 도달(Net Reach)로 통합하며, 봇 트래픽·비뷰어블 노출 같은 허수는 유효 노출 보정으로 걷어냅니다. 매월 15일에 전월 데이터를 추가 학습하며, ${S.reachcastInventories} 지면을 대상으로 한 검증에서 도달률 예측 오차(MAPE)는 ${S.reachcastMape}였습니다.`
    }
  ]
}
