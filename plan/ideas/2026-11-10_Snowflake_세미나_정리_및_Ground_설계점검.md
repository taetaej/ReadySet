# Snowflake Data & AI Executive Seminar for CJ Group 정리 및 Ground(가칭) 설계 방향 점검

- 일시: 2026. 11. 10
- 작성: 신지아
- 구성: 1~2장 세미나 요약 / 3~4장 Ground(가칭) 현행 설계와의 부합 여부 및 추가 검토 사항
- 각주 번호가 붙은 내용은 현장 메모 외에 공개 자료로 보완한 내용이며, 출처는 문서 하단에 정리함

---

## 요약

- 모델 성능만으로는 성과가 나지 않음. **회사의 언어(시맨틱)와 관계(온톨로지) 정의, 업무 안의 에이전트, 거버넌스**가 함께 갖춰져야 AX 성과로 이어짐
- Ground 현행 설계(지식 구조화 → SpinX 근거 인용 → 워크플로우 → 결과물)는 세미나에서 제시된 선도 사례 구조와 대체로 부합함
- 다만 **시맨틱 레이어(광고 의미 사전)**, **AI 품질 관리(트레이스·평가)**는 현행 설계에 명시되지 않아 추가 검토가 필요함
- 유사 제품(Snowflake CoWork) 존재로, 차별화 근거를 렙사 고유 데이터와 광고 도메인 정의 중심으로 재확인할 필요가 있음

---

## 1. 세미나 요약

### 1.1 기조연설

- AX는 엔진만 좋다고 좋은 차가 되지 않음. 시트, 핸들, 바퀴가 함께 있어야 함
  - 모델(엔진)은 평준화 단계이며, 데이터·맥락·업무 흐름·거버넌스(차체)가 성과를 좌우함

### 1.2 세션 1. AI 도입을 넘어, 일하는 방식의 변화로 (채병근)

**핵심 메시지**

- AI 성과는 도구 도입이 아닌 **업무 재설계 방식**에서 나옴
- 글로벌 리테일·CPG 선도 기업은 **질의 → 제작 → 실행 → 협업** 순으로 밸류체인 전반에 AI를 적용 중
- AI + Enterprise = Outcome: 기업의 맥락에 AI 역량을 더해야 검증된 개선이 가능함
  - 추진 순서: 업무에서 출발 → AI와 재설계 → 성과로 검증
  - 성숙 단계: **답을 얻는다 → 도구를 만든다 → 프로세스를 만든다**

**사례 1. 네슬레: 공급 차질 사전 탐지 및 원인·대응 권고 연계**

| 구분 | 내용 |
|---|---|
| 문제 | 공급 차질 발견 지연, 원인 파악 한계, 부서별 수작업 대응 |
| 조치 | 15개 표준 데이터 도메인으로 공통 데이터 기반 구축, 계획·운영·재무 데이터를 PULSE에 입력 |
| PULSE | 온톨로지 기반. **문제 탐지 → 원인 파악(5 Why) → 대응 권고**를 하나의 흐름으로 연결 |

- 소매 신호 기반으로 품절 위험을 약 12주 전 예측[^1]
- 로드맵 5단계 (현재 2단계까지 진행)
  1. 자동화: 스크립트, 스케줄러 기반
  2. 보조: 코파일럿이 지원하고 사람이 주도
  3. 역할 에이전트
  4. 자율: 명세 → 테스트 → 자동 수정
  5. Swarm intelligence: 의도 기반 자가 복구·최적화

**사례 2. 국내 K-뷰티사(아모레퍼시픽): 3단계 추진**

1. **의미 정의**: AI에 회사의 언어를 먼저 학습시킴
   - Semantic View에 대상, 관계, 지표, 용어·동의어, 비즈니스 규칙, 시간·캘린더 정의
   - Semantic Manager에서 용어 등록 후 동일 기준으로 전사 배포
2. **업무 안의 에이전트**: Teams 내에서 직접 사용. 영업 인사이트용 별도 BI 화면 없음
   - 리포트 서비스 → Cortex AI 함수 → 브리프 자동 생성
3. **관계 이해(온톨로지)**: 수요 예측 결과의 원인 등 '왜'를 규명

### 1.3 세션 2. 데이터에 컨텍스트를 더하다 (손범수, 파트너 솔루션 엔지니어)

**핵심 메시지**

- 사내 에이전트의 과제는 모델이 아닌 **컨텍스트와 거버넌스**임
- 신뢰할 수 있는 AI = 모델 + 컨텍스트 + 거버넌스
- **AI-ready data**가 핵심이며, 단일 진실 원천(Single Source of Truth) 적용이 필수임

**Snowflake 구성 요소**

| 구성 요소 | 역할 | 비고 |
|---|---|---|
| Cortex AI Functions | SQL 내에서 텍스트·이미지·음성·문서를 AI로 처리 | 데이터 반출 → 서버 관리 → 코드 작성 → 키 관리 과정을 내장 기능으로 대체. AI_COMPLETE 등 함수 형태, 멀티모달 지원[^2] |
| Cortex Search | 비정형 데이터 검색(RAG) | 텍스트·벡터 멀티 인덱스 지원 |
| Cortex Analyst + Semantic View | 정형 데이터를 AI가 이해하도록 하는 회사 공식 정의(시맨틱 레이어) | YAML 형태로 저장. 지표·차원·관계 정의[^3] |
| Semantic View Autopilot | 시맨틱 뷰 자동 생성 | 기존 쿼리·BI 자산 기반 자동 생성, 2026. 2 정식 출시[^4] |
| Business Ontology | 비즈니스 엔티티와 관계 정의 | 시맨틱 뷰는 명시적 개념을, 온톨로지는 도메인 엔티티 간 관계를 정의 |
| Cortex Sense | 맥락 자동 추론 | 실시간 커넥터, 정형·비정형 데이터 지식화, 비즈니스 로직. 쿼리 이력·메타데이터·대시보드 기반으로 맥락 자동 구축[^5] |
| Snowflake CoWork | 업무용 AI 워크스페이스 | 구 Snowflake Intelligence. 대화형 분석, 딥 리서치, 결과물(Artifacts), Skills, 외부 도구 연동[^6] |
| Snowflake CoCo | 네이티브 코딩 에이전트 | 구 Cortex Code, 2026. 6 명칭 변경[^7] |
| Governance (Horizon) | 데이터 접근 통제 | RBAC, 마스킹, 행 단위 접근 정책 |
| AI Quality | AI 품질 모니터링 | 대화 → 트레이스 단위 추적. 요청 추적, 평가, 비용, 가드레일 차단 내역 확인[^8] |
| Cortex AI Gateway | 에이전트의 모델·도구 호출 통제 | 자사·외부 에이전트 호출을 모두 기록하는 라우팅 계층[^9] |

- 맥락은 3개 층으로 구성되며, 순차 단계가 아닌 상호 보완 관계임[^10]
  - Cortex Sense: 맥락을 넓게 **추론**
  - Business Ontology: 의미를 **공인**
  - Semantic View: 지표를 **계산**

### 1.4 세션 3

- AI-ready data 재강조
- 시맨틱은 **'무엇'**에 답하고, 온톨로지는 **'왜'**에 집중함
- 세부 내용은 발표 자료 확인 필요

---

## 2. 주요 개념 정리

| 개념 | 정의 | 답하는 질문 |
|---|---|---|
| AI-ready data | AI가 바로 읽고 신뢰할 수 있게 정리된 데이터 | 이 데이터를 써도 되는가 |
| 시맨틱 레이어 | 회사의 공식 지표·용어·규칙 정의 | 무엇인가 (예: CPC 계산 방식) |
| 온톨로지 | 엔티티와 관계의 정의 | 왜 그런가 (예: 무엇이 무엇에 영향을 주는가) |
| 업무 안의 에이전트 | 별도 화면이 아닌 기존 업무 도구 내에서 동작 | 어디서 쓰는가 |
| 거버넌스 | 권한, 마스킹, 추적, 평가 | 신뢰할 수 있는가 |
| Artifacts | 대화·분석 결과물의 저장·공유 | 무엇이 남는가 |

---

## 3. Ground(가칭) 설계 방향 점검

### 3.1 현행 설계와의 부합 여부

| 세미나 개념 | Ground 현행 설계 | 부합 여부 | 비고 |
|---|---|---|---|
| 답 → 도구 → 프로세스 | 대화(답) → 워크플로우로 저장(도구) → 이벤트 자동 실행(프로세스) | 부합 | 목업 반영 |
| 탐지 → 원인 → 권고 (네슬레 PULSE) | 워크플로우 "매체 소식이 내 시나리오에 걸리면 점검": 해당 시나리오 탐지 → 영향 원인 정리 → 재계산 대상 권고 | 부합 | 목업 반영 |
| 온톨로지(관계 정의) | 인사이트 맵: 리포트 → 발견 → 조건 → 시나리오 관계 | 부분 부합 | 관계는 화면에 표현되나, 관계를 따라 '왜'를 설명하는 답변 방식은 미정의 |
| 시맨틱 레이어(의미 정의) | 발견 조건(업종·기간·매체·KPI·예산)을 데이터에 직접 기술 | 미반영 | 지표 계산식, 용어·동의어, 규칙의 공통 정의 없음 |
| 업무 안의 에이전트 | 전 화면 SpinX 패널 (현재 화면 대상이 맥락으로 자동 연결) | 부분 부합 | Ground 내부만 해당. 솔루션 화면·외부 메신저 연동은 미정의 |
| Artifacts | 결과물 메뉴 | 부합 | 설계 완료, 구현 예정 |
| 접근 통제 (RBAC · 행 단위) | `slotScope` · `audienceLevel` 사전 필터 | 부합 | 정책 정의 완료 |
| AI 품질 관리 (트레이스 · 평가) | 워크플로우 단계별 실행 결과 표시 | 부분 부합 | 대화 단위 추적, 답변 평가, 근거 오류 확인 체계 없음 |
| Skills | 워크플로우 LLM 노드의 Skill | 부합 | 구상 문서 반영 |
| 단계별 로드맵 (자동화 → 보조 → 역할 에이전트 → 자율) | Phase 1 SpinX 인용 → Phase 2 워크플로우 + Skills → Phase 3 실측 보정 → Phase 4 MCP 공급 | 부합 | 단계 구분 기준 상이하나 흐름 일치 |

### 3.2 추가 검토 사항

| 항목 | 검토 내용 | 관련 Phase |
|---|---|---|
| 광고 의미 사전 (시맨틱 레이어) | 지표 계산식(CPM·CPC·CPV·VTR), 용어·동의어(예: GFA = 네이버 성과형 디스플레이), 비즈니스 규칙(연휴 단기·장기 기준, 매체 비중 기준), 캘린더(연휴·시즌)를 공통 정의로 관리할지 여부. 데싸 리포트, 매체 소식 정규화, 솔루션, SpinX가 동일 정의를 사용하는 구조 필요 여부 | Phase 1 (K1 공통 지식 스키마) |
| 발견 단위 입력 체계 | "리포트 → 발견 → 조건" 등록 구조가 AI-ready data 요건을 충족하는지, 데싸 입력 양식과 의미 사전을 함께 설계할지 | Phase 1 (K2 분석 등록) |
| 실행 기록 및 답변 평가 | 대화·워크플로우 실행별 단계, 근거, 소요 시간 기록(트레이스)과 사용자 답변 평가 기능 포함 여부 | Phase 1~2 |
| '왜' 질문 대응 방식 | 인사이트 맵 관계(발견 → 조건 → 시나리오)를 따라 원인을 단계별로 제시하는 답변 방식(5 Why) 정의 여부 | Phase 1 (K4 SpinX 근거 인용) |
| 업무 도구 연동 범위 | 워크플로우 결과를 Slack·Teams 등 기존 업무 도구로 전달할지, 솔루션 화면 SpinX와 Ground SpinX를 통합할지 | Phase 2 |
| 의미 사전 운영 방식 | 용어·지표 후보 자동 추출 후 담당자 승인 방식(Autopilot 방식) 적용 여부 | Phase 1 이후 |

### 3.3 유의 사항

- **유사 제품 존재 (Snowflake CoWork)**
  - 개인 업무 에이전트, Skills, 결과물, 외부 도구 연동 등 Ground와 유사한 구성을 제공함
  - 기능 단위 비교 시 차별성이 약해질 수 있어, 차별화 근거를 아래 항목 중심으로 재확인할 필요가 있음
    - 렙사 보유 다수 광고주·다수 매체 집행 데이터
    - 광고 도메인 의미 사전과 관계 정의
    - 실제 운영 중인 솔루션(BudgetOpt 2.0 · Reach Caster · Ad Curator)
- **명칭 충돌**
  - "CoWork"는 Snowflake, Anthropic(Claude Cowork)이 사용 중으로, 정식 명칭 검토 시 제외 필요
- **인프라 활용 가능성**
  - CJ그룹 대상 세미나로, 그룹 차원의 Snowflake 도입 가능성이 있음
  - 사내 데이터 웨어하우스가 Snowflake일 경우, 검색(Cortex Search)과 의미 정의(Semantic View)를 자체 구축 대신 활용하는 방안의 검토 여지가 있음

---

## 4. 확인 필요 사항

| 대상 | 확인 항목 |
|---|---|
| 데이터·인프라 | 사내(메조미디어·CJ그룹) 데이터 웨어하우스의 Snowflake 사용 또는 도입 계획 여부 |
| 데이터 사이언스 | 광고 의미 사전(지표·용어·규칙) 관리 주체, 기존 정의 문서 유무 |
| 개발 | SpinX 검색의 자체 구현 또는 관리형(Cortex Search 등) 도입 여부 |
| 법무 | 다수 광고주 데이터의 교차 활용 범위 (기존 선결 과제와 동일) |
| 세미나 주최 측 | 세션 3 발표 자료 공유 가능 여부 |

---

## 참고 자료

공개 자료를 요약·재구성함 (Content was rephrased for compliance with licensing restrictions)

[^1]: [Nestlé, Bridging Business & Tech (Tim Connolly) — 발표 영상](https://vimeo.com/1092207770)
[^2]: [Cortex AI Functions — Snowflake 문서](https://docs.snowflake.com/en/user-guide/snowflake-cortex/llm-functions)
[^3]: [Overview of semantic views — Snowflake 문서](https://docs.snowflake.com/en/user-guide/views-semantic/overview)
[^4]: [Semantic View Autopilot 정식 출시 — Snowflake 보도자료](https://www.snowflake.com/en/news/press-releases/snowflake-delivers-semantic-view-autopilot-as-the-foundation-for-trusted-scalable-enterprise-ready-AI/)
[^5]: [Cortex Sense for Enterprise AI Agents — Snowflake 블로그](https://www.snowflake.com/en/blog/enterprise-ai-agents-grounded-context/)
[^6]: [Snowflake CoWork (formerly Snowflake Intelligence) — Snowflake 블로그](https://www.snowflake.com/en/blog/snowflake-cowork-personal-work-agent/)
[^7]: [Overview of Snowflake CoCo — Snowflake 문서](https://docs.snowflake.com/en/user-guide/cortex-code/cortex-code)
[^8]: [AI Observability with Snowflake Cortex — Snowflake 문서](https://docs.snowflake.com/en/user-guide/snowflake-cortex/ai-observability)
[^9]: [Cortex AI Gateway — Snowflake 제품 페이지](https://www.snowflake.com/en/product/features/cortex-ai-gateway/)
[^10]: [Business Ontology: Governed Context for AI — Snowflake 블로그](https://www.snowflake.com/en/blog/business-ontology-context/)
