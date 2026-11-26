# Amazon Bedrock AgentCore 분석 및 WithSet 적용 검토
- 일시: 2026. 11. 25
- 작성: 신지아 (초안)
- 구성: 1~2장 AgentCore 개요·서비스별 분석 / 3~4장 WithSet 요구사항 매핑·갭 / 5~8장 도입안·비용·리스크·권고
- 근거: AWS 공식 개발자 가이드와 가격 페이지 (2026. 11. 25 조회). 출처는 문서 하단에 정리함
- 이 문서의 판단(적합도, 도입안, 종속성 평가)은 공식 문서 사실과 구분하여 **[판단]** 으로 표기함
- 관련 문서: `strategic(highlevel)/ReadySet_WithSet_추진계획.md` (v0.4), `ideas/2026-11-10_Snowflake_세미나_정리_및_WithSet_설계점검.md`
---
## 요약
- AgentCore는 에이전트를 **실행(Runtime·Harness) · 연결(Gateway) · 기억(Memory) · 통제(Identity·Policy) · 관측/평가(Observability·Evaluations)** 하는 AWS 관리형 계층임. 프레임워크·모델 중립이며 서비스별로 독립 도입 가능
- WithSet 요구사항 중 **Phase 3 Tools(MCP 연결·토큰 격리·호출 승인)와 Phase 1 K9(트레이스·평가)** 에 가장 직접적으로 대응함. 직접 구축 시 공수가 큰 영역임
- **Phase 1의 병목(K1 시맨틱 레이어, K2 온톨로지, K3 지식 스키마, 커버리지)은 AgentCore가 해결하지 않음.** 지식 검색은 Gateway의 Bedrock Managed Knowledge Base 커넥터로 대체 가능성이 있으나, 사전 필터(`slotScope`·`audienceLevel`)는 별도 검증이 필요함
- 서울 리전에서 대부분의 서비스를 쓸 수 있으나 **Registry·Payments·Web Search는 서울 미지원**이며, **Evaluations는 서울 요청이 전 세계 상용 리전으로 라우팅될 수 있음** (커스텀 평가기로 회피 가능). 다수 광고주 데이터 교차 활용 법무 검토와 함께 확인이 필요함
- 인프라 비용은 작음. 가정 기반 시뮬레이션(월 3,000 세션)에서 **Evaluations가 비용의 80% 이상** 을 차지하고, LLM 토큰 비용은 별도임 (8장)
- **권고**: Phase 1은 Observability·Evaluations 중심의 최소 도입 + 검색 계층 PoC, Phase 2 설계 시 Gateway·Step Functions PoC, Phase 3 착수 전 Identity·Policy 도입 여부를 직접 구축안과 비교 결정 (7장)
---
## 1. AgentCore 개요
### 1.1 정의
- 에이전트를 만들고, 배포하고, 운영하기 위한 관리형 플랫폼. 인프라 관리 없이 에이전트가 도구·데이터에 접근하는 권한과 거버넌스, 대규모 실행, 운영 중 품질 모니터링을 제공함
- 서비스는 **모듈형**임. 함께 쓰든 독립적으로 쓰든 무방함
- 프레임워크: CrewAI, LangGraph, LlamaIndex, Google ADK, OpenAI Agents SDK, Strands Agents, 자체 구현
- 모델: Bedrock 내외 모든 모델 (Claude, Nova, Llama, Mistral, OpenAI, Gemini 등)
- 프로토콜: MCP, A2A, AG-UI (Runtime 호스팅 대상)
- 과금: 사용량 기반. 선결제·최소 요금 없음. 신규 AWS 고객 최대 $200 프리티어 크레딧

### 1.2 서비스 구성
| 계층 | 서비스 | 한 줄 정의 |
|---|---|---|
| 실행 | **Harness** | 모델·프롬프트·툴을 설정(config)으로 선언하면 에이전트 루프를 관리형으로 실행. Strands 기반 |
| 실행 | **Runtime** | 에이전트·툴을 올리는 서버리스 호스팅. 세션별 microVM 격리 |
| 연결 | **Gateway** | API·Lambda·MCP 서버·다른 에이전트·LLM을 단일 엔드포인트로 노출하고 인증·라우팅 |
| 기억 | **Memory** | 단기(세션 이벤트)·장기(추출된 기억) 메모리 |
| 통제 | **Identity** | 에이전트 워크로드 ID, 사용자 위임 접근(OAuth·API 키 보관) |
| 통제 | **Policy** | Gateway에서 툴 호출을 실행 전에 가로채 Cedar/Dogwood 규칙으로 허용·거부 |
| 관측 | **Observability** | OTEL 호환 트레이스·메트릭·로그. CloudWatch 저장 |
| 품질 | **Evaluations** | LLM-as-a-Judge 기반 세션·트레이스·스팬 평가. 온라인(샘플링)·온디맨드·배치 |
| 품질 | **Optimization** | 트레이스 기반 프롬프트·툴 설명 개선안 생성, 배치 평가·A/B 테스트 |
| 카탈로그 | **Registry** | MCP 서버·에이전트·스킬·커스텀 리소스의 검색 가능한 카탈로그와 승인 워크플로 |
| 내장 도구 | Code Interpreter, Browser, Web Search, Web Answer | 샌드박스 코드 실행, 클라우드 브라우저, 웹 검색, 인용 포함 답변 |
| 기타 | Payments | x402·MPP 기반 에이전트 소액 결제 (Coinbase CDP, Stripe Privy 지갑) |

- 가격 페이지는 기능을 14개로 표기하나 개발 가이드의 서비스 표와 항목 구성이 일치하지 않음. 위 표는 가이드 기준이며, 14개 중 누락된 1개는 확인하지 못함
- WithSet과 무관한 서비스(Payments, Browser, Web Answer)는 이후 상세 분석에서 제외함

---
## 2. 서비스별 상세 분석
### 2.1 Runtime
**핵심 특성**
- **세션 격리**: 세션마다 전용 microVM(CPU·메모리·파일시스템 격리). 세션 종료 시 microVM 종료 및 메모리 정리
- **실행 시간**: microVM 최대 8시간, Instances 최대 14일. 유휴 타임아웃 기본 15분(60초~8시간 조정). 세션 파일시스템은 중지/재개 간 유지 가능
- **컴퓨트 2종**: microVM(서버리스, 소비 기반) / Instances(내 계정의 EC2 + 관리 수수료, GPU·다중 에이전트 공유 가능)
- **프로토콜**: HTTP, WebSocket 양방향 스트리밍, MCP, A2A, AG-UI
- **인증**: Inbound(IAM SigV4, OAuth/JWT) + Outbound(Identity 연계). Okta·Entra ID·Cognito 연동
- **페이로드**: 최대 100MB. 동기 요청 최대 15분. 데이터 플레인 1,000 TPS(상향 가능)
- **버전·엔드포인트**: 버전 관리와 이름 있는 엔드포인트
- **플랫폼 V2**: 스냅샷에서 시작해 콜드 스타트를 일정하게 유지. 유휴 메모리 120초 후 회수

**WithSet 관점**
- 사용자 세션마다 격리 환경이 필요한 Chat·Workflow 실행에 적합. 다수 광고주 데이터를 다루므로 세션 간 오염 방지가 구조적으로 보장되는 점이 유리함 **[판단]**
- 에이전트 코드는 직접 작성해야 함. ARM64 컨테이너 또는 코드 직접 배포 방식

### 2.2 Harness
**핵심 특성**
- 모델·시스템 프롬프트·툴·메모리·실행 한도를 **설정으로 선언**하면 AgentCore가 루프를 실행. 모델 교체와 툴 추가가 재배포 없는 설정 변경임
- 세션 중 모델 공급자 전환 가능 (컨텍스트 유지). Bedrock, OpenAI, Gemini, LiteLLM 호환 공급자 지원
- 셸·파일 도구, Agent Skills(Git·S3·AWS 카탈로그), Gateway·MCP·Browser·Code Interpreter 연결
- 불변 버전과 이름 있는 엔드포인트로 롤아웃·롤백
- Step Functions의 `InvokeHarness` 상태로 파이프라인에 삽입 가능. 설정으로 부족하면 Strands 코드로 내보내 Runtime에서 실행 가능
- **별도 요금 없음**. 사용한 하위 서비스만 과금

**제약** (Harness vs. Runtime 비교표 기준)
- 에이전트 프레임워크 선택 불가 (Strands 고정)
- 그래프·워크플로 형태의 비-에이전트-루프 패턴 불가
- 양방향 스트리밍 불가
- 인라인/클라이언트 사이드 툴은 직접 구현 필요

**WithSet 관점 [판단]**
- SpinX Chat(질문 → 근거 검색 → 답변)처럼 **단순 에이전트 루프**는 Harness로 빠르게 시작 가능
- 근거 인용 형식, `slotScope`/`audienceLevel` 주입, DS 시사점과 SpinX 해석의 구분 표시 같은 **세부 제어가 필요하면 Runtime 직접 구현**이 안전함
- Harness로 시작하고 Strands 코드로 내보내는 경로가 있어, 초기 시도의 되돌림 비용이 낮음

### 2.3 Gateway
**핵심 특성**
- 에이전트 트래픽의 **단일 진입점**: 도구(MCP), 다른 에이전트(A2A/HTTP 패스스루), LLM(모델 기반 라우팅)
- **MCP 타깃**: Lambda, API Gateway 스테이지, OpenAPI, Smithy, 외부 MCP 서버, 통합 템플릿(Salesforce, Slack, Jira, Asana, Zendesk), 내장 커넥터
- **내장 커넥터**: Bedrock Managed Knowledge Bases, Web Search, Web Answer, **AWS Step Functions**, AWS Marketplace
- **인증**: Inbound(JWT/OAuth) + Outbound(OAuth·API 키 자격 증명 주입, 토큰 갱신). 타깃별로 다른 자격 증명 공급자 연결
- **시맨틱 툴 검색**: 툴이 수천 개여도 컨텍스트에 맞는 툴만 노출해 프롬프트 크기·지연 절감
- **쿼터**: 게이트웨이당 타깃 100개, 타깃당 툴 1,000개, 툴 호출 페이로드 6MB
- **감사**: CloudTrail 데이터 이벤트 로깅 지원. 호출 단위 레이트 리밋은 추가 요금 없음
- 데이터 암호화: 서비스 키 또는 고객 관리 KMS 키

**WithSet 관점 [판단]**
- 기존 솔루션(Ad Curator, BudgetOpt 2.0, Reach Caster)의 API를 OpenAPI·Lambda 타깃으로 등록하면 SpinX가 MCP 툴로 호출하는 구조를 만들 수 있음
- Phase 3의 "매체·사내·외부 MCP를 단일 구조로 수용" 요구와 구조적으로 일치함
- 외부 MCP 서버를 사용자가 등록하는 방식(개인 범위 → 팀 공유 시 관리자 검토)은 Gateway 타깃 관리와 Registry 승인 워크플로를 조합해 구현할 여지가 있으나, **사용자 단위 등록**이 타깃 모델과 맞는지는 PoC에서 확인해야 함

#### 2.3.1 Gateway의 Managed Knowledge Base 커넥터 (WithSet K6 직접 관련)
- Bedrock Managed Knowledge Base를 Gateway 타깃으로 붙이면 에이전트가 MCP로 조회함. 벡터 저장소·적재·검색 최적화는 AWS가 관리함
- 툴 2종: `Retrieve`(단일 하이브리드 검색), `AgenticRetrieveStream`(계획 → 다단계 검색 → 인용이 달린 합성 답변을 스트리밍)
- 관리자가 타깃에 고정하는 값(검색 대상 KB, 모델, 리랭킹, 가드레일, 최대 반복 횟수)과 에이전트에 노출하는 값(`parameterOverrides`)이 분리됨
- 메타데이터 `filter` 지원 (equals, in, startsWith 등)
- **접근 제어**: KB가 사용자·그룹별 접근 제어를 쓰면 호출 애플리케이션이 `userContext`를 명시적으로 전달해야 함. Gateway는 호출자의 IAM 신원에서 `userContext`를 채워 주지 않음. 모델이 아닌 애플리케이션이 값을 넣어야 함
- **[판단] WithSet 정책 6장과의 관계**: "검색 대상에서 사전 제외"는 이 구조(메타데이터 필터 + `userContext`)로 구현할 수 있어 보임. 단, ① `slotScope`·`audienceLevel`을 KB 메타데이터로 적재할 수 있는지, ② 필터를 모델이 바꾸지 못하게 고정하는 방식, ③ 서울 리전에서 이 커넥터가 제공되는지는 **확인하지 못했음** (PoC 항목)

#### 2.3.2 Gateway의 Step Functions 커넥터 (WithSet Workflows 직접 관련)
- 기존 Step Functions 상태 머신을 코드 없이 MCP 툴로 노출. 노출할 연산(10종)을 선택하고, 시작 연산의 상태 머신은 **고정(pin)** 하여 에이전트가 바꿀 수 없음
- 에이전트는 시작 시점과 입력만 결정하고, **순서는 상태 머신이 결정**함. 에이전트가 단계를 건너뛰거나 순서를 바꿀 수 없음
- Standard 워크플로: 실행 이력 보관(감사 가능), 최대 1년 실행, `.waitForTaskToken` 콜백으로 사람/에이전트 대기 가능
- **[판단]** 제안셋 Workflow(Ad Curator → BudgetOpt 2.0 → Reach Caster)처럼 **고정된 순서**가 필요한 흐름에 적합함. WithSet의 "대화에서 실행하면 자동 기록, 캔버스는 확인·수정용" 모델과 결합하려면, 캔버스 편집 결과를 상태 머신 정의로 변환하는 계층을 직접 만들어야 함 (AgentCore 범위 밖)
- 이벤트·스케줄 재실행(예: "매체 소식이 내 시나리오에 걸리면 점검")은 Step Functions 자체에 트리거가 없으므로 EventBridge 등 별도 구성이 필요함 **[판단: AgentCore 문서 범위 밖의 추정]**

### 2.4 Memory
**핵심 특성**
- **단기**: 세션 단위 이벤트(`CreateEvent`). 대화 원본 보관. 만료 기간 7~365일. 이벤트 메타데이터 키-값 필터 지원
- **장기**: 이벤트에서 비동기로 추출·통합한 기억 레코드. `RetrieveMemoryRecords`는 시맨틱 검색
- **전략**: 내장(관리형, 비용 높음) / 내장+오버라이드(프롬프트·Bedrock 모델 지정, 내 계정에서 모델 호출) / 자체 관리(추출·통합 파이프라인 직접). 메모리 리소스당 전략 최대 6개
- 에이전트 간 공유, 사용자 단위 범위 지정(actor ID) 지원
- 한도: 이벤트당 메시지 100개, 이벤트 크기 10MB, `CreateEvent` 계정당 200 TPS
- **주의**: 이벤트 메타데이터는 고객 관리 키로 암호화되지 않으므로 민감 정보를 넣지 않아야 함

**WithSet 관점 [판단]**
- "대화는 개인 기록으로 저장"(K8)에 단기 메모리가 대응함
- 장기 메모리는 **사용자 선호·대화 요약** 용도이며, **광고 분석 지식 베이스(Library)를 담는 곳이 아님**. 지식 베이스는 2.3.1의 KB 또는 자체 검색 계층이 맡아야 함
- 개인 기억이 쌓이므로 보관·삭제 정책(광고주 데이터 포함 여부)을 법무 검토 항목에 추가해야 함

### 2.5 Identity
- 에이전트를 **워크로드 ID**로 관리. Inbound JWT 인증기, Outbound 자격 증명 공급자(OAuth 2·API 키), 동의 포털(사용자 위임), 프라이빗 IdP 연결
- Runtime·Gateway를 통해 쓰면 **추가 요금 없음**
- **WithSet 관점 [판단]**: 정책 6장(`audienceLevel`: 공개/임직원)과 Phase 3의 "외부 도구 호출 시 매번 사용자 승인, 매체 MCP 토큰 격리"에 대응함. 사내 IdP와의 연동 가능 여부(Okta·Entra ID·Cognito 중 무엇을 쓰는지)는 확인이 필요함

### 2.6 Policy
- 정책 엔진을 Gateway에 연결하면 **모든 툴 호출을 실행 전에 평가**하여 허용·거부함. 에이전트 코드 바깥에서 결정적(deterministic)으로 집행되므로 프롬프트 조작으로 우회하기 어려움
- 언어: Cedar 또는 Dogwood. **자연어로 작성**하면 정책으로 변환하고 도구 스키마 검증과 자동 추론(과도 허용·과도 제한 탐지)을 수행함
- **Dogwood의 세션 인지 조건**: 같은 세션의 이전 이력을 보고 판단함. 예) 승인이 선행되어야 이체 허용, N회 이후 차단, 누적 합계 상한. 가드레일 신호(콘텐츠 안전·프롬프트 공격 점수)도 조건으로 사용 가능
- 모든 판정은 CloudWatch 메트릭·로그로 기록됨 (감사 가능)
- **WithSet 관점 [판단]**
  - Phase 3 공통 정책("외부 도구 호출 시 매번 사용자 승인", "임직원 전용 자료 전송 차단")을 **코드 밖 규칙**으로 표현할 수 있음
  - **범위 한계**: Gateway를 거치는 툴 호출만 통제함. 검색 계층의 조회 필터와 답변 생성 단계는 통제하지 않음. 정책 6장의 "사전 필터"는 Policy가 아니라 검색 계층에서 구현해야 함

### 2.7 Observability
- OTEL 호환 트레이스·스팬, CloudWatch 대시보드(세션 수·지연·토큰 사용량·오류율), 서비스 제공 메트릭(에이전트·Gateway·Memory)
- 감사: Gateway·Registry는 CloudTrail에 API 활동 기록. **CloudTrail 적용 범위는 일부 서비스에 한정**됨
- 기존 모니터링 스택과 연동 가능 (표준 OTEL)
- 에이전트별 비용 모니터링, 계정 간 모니터링 지원
- **WithSet 관점**: K9의 "답변별 사용 근거·단계 기록(트레이스)"에 직접 대응함. 세미나 점검 문서의 "AI 품질 관리: 부분 부합" 공백 중 **추적** 부분을 메움

### 2.8 Evaluations
- 에이전트 트레이스를 통일 포맷으로 변환해 **LLM-as-a-Judge**로 채점함. 평가 수준: 세션·트레이스·스팬
- 내장 평가기 13종(정확성, 유용성, 목표 달성률 등 포함) + 커스텀 평가기. 내장은 수정 불가
- 모드: 온라인(샘플링 규칙·조건부 샘플링), 온디맨드, 배치, 데이터셋 평가, 데이터셋 생성, 시뮬레이션. CI/CD 연동과 품질 임계값 설정 가능
- 지원 프레임워크: **Strands, LangGraph** (OTEL 또는 OpenInference 계측)
- 한도: 리전당 평가 구성 1,000개, 계정당 분당 입출력 토큰 100만
- **WithSet 관점 [판단]**
  - K9의 "답변 평가" 중 **자동 평가**를 대체함. "근거 오류 확인"에 해당하는 내장 평가기가 있는지는 평가기 목록 상세를 확인하지 못함
  - **사용자 평가(👍/👎 등) 수집은 AgentCore 기능이 아님**. 애플리케이션이 직접 저장해야 하며, Evaluations 결과와 합치는 방식은 별도 설계가 필요함
  - Strands·LangGraph 외 프레임워크로 구현하면 평가 적용이 제한됨. 에이전트 구현 선택에 영향을 줌

### 2.9 Optimization
- **Insights**(실패·의도·궤적 분석, 현재 공개 프리뷰·무료), **Recommendations**(프롬프트·툴 설명 개선안 생성), **Experiments**(배치 평가, 라이브 트래픽 A/B 테스트)
- 버전 관리되는 구성 번들과 Gateway 트래픽 분할을 사용함
- **WithSet 관점**: Phase 1에는 시기상조. 트래픽과 평가 데이터가 쌓인 Phase 2 이후에 검토함 **[판단]**

### 2.10 Registry
- MCP 서버·에이전트·스킬·커스텀 리소스를 게시·승인·검색(시맨틱+키워드)하는 카탈로그. 클라우드·온프렘 무관
- 월 무료: 레코드 5,000개, 검색 100만 건, 조회·목록 200만 건
- **서울 리전 미지원** (도쿄는 지원)
- **WithSet 관점 [판단]**: Skills와 Tools(외부 MCP 사용자 등록 → 관리자 검토)의 승인 워크플로 후보. 단, 사용자 개인 단위 Skill 저장·공유 UX를 대체하는 수준은 아님. 서울 미지원이므로 도쿄 등 타 리전 사용 여부는 데이터 레지던시 검토와 함께 판단해야 함

### 2.11 Code Interpreter
- 격리된 샌드박스에서 Python·JavaScript·TypeScript 실행. 사용한 CPU·메모리만 과금(I/O 대기 무료)
- **WithSet 관점**: SpinX가 데이터를 즉석에서 계산·시각화해야 할 때 후보. 현행 요구사항에는 명시되지 않음

---
## 3. WithSet 요구사항 매핑
### 3.1 Phase별 적합도
적합도 기준: **높음** = 요구사항을 서비스 기능으로 직접 충족, **부분** = 일부만 충족하거나 별도 구현 필요, **낮음/없음** = 대응 기능 없음

| Phase | 요구사항 | 대응 서비스 | 적합도 | 비고 |
|---|---|---|---|---|
| 1 | K1 시맨틱 레이어 | 없음 | 없음 | 정의 자체를 만드는 일. 정의된 값을 KB 메타데이터·프롬프트·툴 스키마로 반영하는 방법은 별도 설계 |
| 1 | K2 온톨로지 | 없음 | 없음 | 관계를 따라 '왜'를 답하는 로직은 에이전트 구현 영역 |
| 1 | K3 공통 지식 스키마, K4 분석 등록 | Managed KB(적재·메타데이터) | 부분 | 스키마 설계·DS 입력 UX는 직접 구현. 저장·검색 인프라만 대체 |
| 1 | K5 매체 소식 수집·정규화 | 없음 | 없음 | 수집·정규화 파이프라인은 직접 구현. 적재 대상으로 KB 사용 가능 |
| 1 | K6 SpinX 근거 인용 | Gateway KB 커넥터, Runtime/Harness | 부분 | `AgenticRetrieveStream`이 인용 포함 답변 제공. "DS 시사점 vs SpinX 해석 구분 표시"는 프롬프트·후처리로 구현 |
| 1 | K7 가시성 필터 | KB 메타데이터 `filter` + `userContext` | 부분 | 2.3.1 참조. 서울 제공 여부·메타데이터 매핑 PoC 필요 |
| 1 | K8 WithSet 1차 오픈 (Chat, 개인 기록) | Runtime, Memory(단기), Identity | 높음 | 프런트엔드·Home·Library UI는 직접 구현 |
| 1 | K9 트레이스 | Observability | 높음 | OTEL 트레이스를 답변 단위 근거 표시에 매핑하는 작업 필요 |
| 1 | K9 답변 평가 (자동) | Evaluations | 높음 | 지원 프레임워크 제약 |
| 1 | K9 사용자 평가 수집 | 없음 | 없음 | 직접 구현 |
| 1 | K9 근거 없으면 답하지 않음 | 가드레일, 프롬프트, Policy(부분) | 부분 | 모델 행동 제어. Policy는 툴 호출만 통제하므로 **답변 거부 자체는 프롬프트·가드레일 영역** |
| 2 | A1 제안셋 Workflow | Gateway(OpenAPI/Lambda/Step Functions), Runtime | 부분 | 순서 고정 실행·이력은 Step Functions로 충족. 캔버스 편집과 이벤트·스케줄 트리거는 직접 구현 |
| 2 | A2 근거 자동 보강 | KB 커넥터 | 부분 | 요청 기간·업종으로 필터 조건을 구성하는 로직은 직접 구현 |
| 2 | A3 Skills | Harness Agent Skills, Registry(스킬) | 부분 | 사용자 단위 저장·공유 UX는 직접 구현. Skill 형식 호환성 확인 필요 |
| 2 | A4 Artifacts | Harness 파일시스템(S3 Files/EFS) | 낮음 | "생성 위치·사용 Skill·근거와 함께 보관"하는 메타데이터 모델은 직접 구현 |
| 3 | 매체 MCP 연동 (광고주 단위, 토큰 격리) | Gateway 타깃, Identity | 높음 | 광고주(Slot) 단위 자격 증명 분리 구조의 한도(타깃 100개/게이트웨이)를 고려해 설계 |
| 3 | 사내 MCP (기간계·Slack·Drive) | Gateway(Slack 등 템플릿, MCP 서버) | 높음 | |
| 3 | 외부 MCP 사용자 등록, 팀 공유 시 관리자 검토 | Gateway, Registry(승인) | 부분 | 사용자 개인 단위 등록 모델 PoC 필요 |
| 3 | 호출 시 매번 사용자 승인, 권한 범위 데이터만 전송, 임직원 자료 차단 | Policy(세션 인지), Identity(동의 포털) | 높음 | 승인 UI는 직접 구현 |
| 3 | 예측-실측 비교 | Code Interpreter(선택) | 낮음 | 비교 로직은 솔루션 영역 |
| 4 | 솔루션·지식·Skills의 MCP 공급 | Runtime(MCP 서버 호스팅), Gateway, Registry | 높음 | 외부 공급 시 과금·인증 모델은 별도 설계 |

### 3.2 정책 6장(접근제어)과의 대응
| WithSet 정책 | 대응 가능한 AgentCore 기능 | 충족 수준 |
|---|---|---|
| `slotScope` (콘텐츠의 Slot 소속) | KB 메타데이터 필터, Memory 사용자·세션 범위 | 부분 (적재 시 메타데이터 부여 필요) |
| `audienceLevel` (공개 / 임직원) | JWT 클레임 → Gateway 인가, `userContext`, Policy | 부분 |
| "권한 외 콘텐츠는 검색 대상에서 사전 제외" | KB `userContext` 접근 제어 + 고정 필터 | **PoC 필요** (2.3.1) |
| "답변 단계 사후 마스킹으로는 유출 방지 불가" | Policy는 툴 호출 경계에서 동작 | 사후 마스킹이 아니라 호출 전 통제이므로 방향은 부합. 단, 필터 자체는 검색 계층 구현 |

**[판단]** 사전 필터의 신뢰성은 "필터 값을 모델이 아닌 애플리케이션이 주입한다"는 구조에 달려 있음. Runtime 직접 구현(애플리케이션이 `userContext`와 필터를 서버 측에서 고정)이 Harness(설정 중심)보다 통제하기 쉬움.

### 3.3 Snowflake 문서의 추가 검토 사항과의 대응
| 점검 문서의 항목 | AgentCore 대응 | 비고 |
|---|---|---|
| 광고 의미 사전 (시맨틱 레이어) | 없음 | Snowflake Semantic View 등 별도 기술 영역. AgentCore는 정의를 소비하는 쪽 |
| 실행 기록 및 답변 평가 | Observability, Evaluations | 대응함 |
| '왜' 질문 대응 (5 Why) | 없음 | 에이전트 설계 영역 |
| 업무 도구 연동 범위 (Slack·Teams) | Gateway 통합 템플릿(Slack 등) | Teams 지원은 확인하지 못함 |
| 관리형 검색 도입 여부 | Managed KB (Gateway 커넥터) | Snowflake Cortex Search와 대안 관계. 인프라 결정 필요 |

---
## 4. AgentCore가 제공하지 않는 것 (직접 구축 범위)
| 영역 | 내용 |
|---|---|
| 의미 정의 | 시맨틱 레이어(지표·용어·규칙), 온톨로지(엔티티·관계). Phase 1 P0 선행 과제 |
| 지식 파이프라인 | DS 분석 등록, 매체 소식 수집·정규화, 커버리지 관리 |
| 프런트엔드 | WithSet Home, Chat, Library, Artifacts, 워크플로 캔버스 |
| 워크플로 편집기 | 캔버스 → 실행 정의 변환, 이벤트·스케줄 트리거 |
| 사용자 평가 | 답변별 평가 수집·집계 |
| 제품 맥락 | slot·시나리오 맥락 자동 연결, SpinX 응답 스타일, "DS 시사점과 SpinX 해석 구분" |
| 외부 MCP 사용자 등록 UX | 개인 범위 → 팀 공유 승인 흐름의 화면 |
| 도메인 평가 기준 | 광고 도메인에 맞는 커스텀 평가기(예: 지표 정의 일치 여부) |

---
## 5. 아키텍처 후보안
### 5.1 후보
| 안 | 구성 | 특징 |
|---|---|---|
| **A. 최소 도입** | 자체 백엔드 + Observability + Evaluations | 기존 구현 유지, 관측·평가만 AgentCore. 변경 최소 |
| **B. Harness 중심** | Harness + Gateway(KB, 솔루션 API) + Memory + Identity | 가장 빠른 시작. 에이전트 루프 제어가 제한됨 |
| **C. Runtime + Gateway** | Runtime(자체 에이전트 코드, Strands/LangGraph) + Gateway + Policy + Identity + Memory + Observability + Evaluations | 제어 폭이 넓고 AgentCore 이점을 대부분 확보. 구현 부담이 B보다 큼 |
| **D. 전면 자체 구축** | 직접 구축 | 종속성 없음. 세션 격리·토큰 보관·정책 집행·트레이싱을 직접 만들어야 함 |

### 5.2 비교
| 기준 | A | B | C | D |
|---|---|---|---|---|
| Phase 1 착수 속도 | 빠름 | 가장 빠름 | 보통 | 느림 |
| 사전 필터 통제 | 자체 구현에 의존 | 설정 중심이라 제한적 | 서버 측에서 고정 가능 | 완전 통제 |
| Phase 3 확장성(MCP·토큰·승인) | 낮음 | 높음 | 높음 | 높음, 구축 비용 큼 |
| 평가 적용 | Strands·LangGraph 계측 필요 | 가능 (Strands 기반) | Strands·LangGraph 선택 시 가능 | 직접 구축 |
| 종속성 | 낮음 | 중간 (설정 이전은 Strands 코드 내보내기로 완화) | 중간 | 없음 |
| 초기 구현 부담 | 낮음 | 낮음 | 중간 | 높음 |

### 5.3 종속성 평가 **[판단]**
| 서비스 | 이전 난이도 | 이유 |
|---|---|---|
| Runtime | 낮음~중간 | 컨테이너 기반. 표준 프로토콜(MCP·A2A·HTTP) |
| Gateway | 중간 | 타깃 정의·자격 증명 보관이 AWS 쪽에 있음. 에이전트 쪽은 표준 MCP |
| Observability | 낮음 | 표준 OTEL |
| Memory | 중간~높음 | 이벤트·기억 레코드가 서비스 내부 저장소에 있고 추출 전략이 서비스 기능에 의존 |
| Identity | 중간 | 자격 증명 보관소와 위임 흐름이 서비스 내부 |
| Policy | 중간 | Cedar는 오픈소스이나 Gateway 연동에 의존 |
| Evaluations | 낮음~중간 | 내장 평가기는 서비스 종속. 결과 데이터는 CloudWatch에 있음 |

**[판단] 권고안**: **A에서 시작해 Phase 2에서 C로 확장**. Phase 3에서 Gateway·Identity·Policy를 도입하고 직접 구축(D)과 비교하여 결정함. B는 검색·인용 PoC나 내부 데모에 한정하여 시도해 볼 수 있음.

---
## 6. 리전·데이터 레지던시·보안
### 6.1 서울 리전(ap-northeast-2) 서비스 제공 현황
| 서비스 | 서울 | 비고 |
|---|---|---|
| Harness, Runtime(microVM·Instances), Memory, Gateway, Identity, Observability, Policy, Evaluations, Optimization | 제공 | |
| AWS Agent Registry | **미제공** | 도쿄는 제공 |
| Web Search Tool, Web Search API, Web Answer | **미제공** | |
| Payments | **미제공** | |
| Bedrock Managed Knowledge Base 커넥터 | **확인하지 못함** | 커넥터 문서에 리전 표기가 없고 Bedrock 측 제공 리전 확인이 필요함 |

### 6.2 크로스 리전 추론 (데이터 이동 가능성)
| 서비스 | 서울 요청 처리 범위 | 회피 방법 |
|---|---|---|
| Memory (내장 전략) | 아시아 태평양 지오 내 (도쿄, 서울, 오사카, 뭄바이, 싱가포르, 시드니, 멜버른) | 내장+오버라이드 전략 (내 계정의 모델 선택) |
| Policy | 아시아 태평양 지오 내 | 해당 없음 (확인 필요) |
| **Evaluations** | **전 세계 상용 리전으로 라우팅될 수 있음** (서울 포함 6개 아시아 소스 리전이 해당) | 커스텀 평가기 (CRIS 미사용) |

- 데이터는 주 리전에만 저장되지만, **입력 프롬프트와 출력 결과는 저장 리전 밖에서 처리될 수 있음**. 전송은 암호화됨
- CloudWatch와 CloudTrail 로그에는 추론이 처리된 리전이 기록되지 않음
- **영향**: WithSet은 다수 광고주 데이터의 교차 활용 범위가 법무 선결 과제임. 평가 대상 트레이스에 광고주 데이터가 포함되면 **서울 요청이 해외 리전에서 처리될 수 있는 구조**가 이 선결 과제의 판단 근거가 됨. 서울 리전에서 내장 평가기를 쓰려면 사전 법무 검토가 필요하고, 그렇지 않으면 커스텀 평가기를 쓰는 대안이 있음

### 6.3 보안·컴플라이언스
- 세션 격리: Firecracker microVM, 세션 종료 시 메모리 정리
- 전송 구간 TLS 1.2 이상. 저장 데이터는 서비스 키 또는 고객 관리 KMS 키로 암호화 (일부 필드 제외: Memory 이벤트 메타데이터)
- VPC 및 AWS PrivateLink 지원. Gateway→고객 VPC 송신은 GB당 $0.006 처리 요금
- 인증서·준수: HIPAA 적격, FedRAMP(Class C·D), SOC 2, ISO 27001·27017·27018·27701 등, CSA STAR. 내부 평가 완료 프로그램에 C5, FINMA, HITRUST, IRAP, ISMAP, PCI 등이 있음
- **국내 인증(K-ISMS 등)은 문서에 명시되지 않음**. 필요 시 AWS Artifact·AWS 한국 담당자를 통해 확인해야 함
- 리소스 기반 정책, 리소스 제어 정책, CloudTrail 감사, 교차 서비스 혼동된 대리인 방지 제공
- **주의**: 이름·태그 등 자유 입력 필드에 민감 정보를 넣지 않아야 함 (과금·진단 로그에 사용될 수 있음)

---
## 7. 도입 로드맵 제안 **[판단]**
| 시점 | 범위 | 목적 | 완료 기준(예시) |
|---|---|---|---|
| Phase 1 기획 | Observability + Evaluations 후보 확정, 검색 계층 PoC 설계 | K9 대응. 지식 검색 방식(KB vs 자체 vs Snowflake) 결정 | 답변 1건의 근거·단계를 트레이스로 재현 가능 |
| Phase 1 PoC (소규모) | Managed KB + `userContext`/필터 | 정책 6장 사전 필터 실현 가능성 | 권한 외 문서가 **검색 결과에 한 건도 노출되지 않음**을 테스트 케이스로 증명 |
| Phase 2 설계 | Gateway에 솔루션 3종 등록 + Step Functions 커넥터 | A1 제안셋 Workflow | 고정 순서로 3개 솔루션이 호출되고 실행 이력이 남음 |
| Phase 2 설계 | Skills 방식 비교 (Harness Skills vs 자체) | A3 | 저장·재사용·팀 공유 흐름 시연 |
| Phase 3 착수 전 | Gateway·Identity·Policy 도입 vs 직접 구축 비교 결정 | 토큰 격리·호출 승인 | 광고주 단위 토큰 분리와 호출 전 승인 흐름 시연 |
| Phase 4 | Runtime에 MCP 서버 호스팅, Registry 도입 검토 | 외부 공급 | |

### 7.1 PoC 체크리스트
1. **사전 필터**: `slotScope`·`audienceLevel`을 메타데이터로 적재하고, 서로 다른 사용자 컨텍스트로 질의해 노출 여부를 검증. 모델이 필터를 바꿀 수 없는 구성을 확인
2. **인용 형식**: 인용 답변에서 "DS 시사점 vs SpinX 해석"을 구분 표시할 수 있는지, 인용 메타데이터에서 원문 위치를 복원할 수 있는지
3. **트레이스**: 답변별 근거·단계를 WithSet 화면의 "사용 근거"로 매핑 가능한지
4. **Evaluations**: 내장·커스텀 평가기의 한국어 광고 도메인 답변 평가 품질 확인. 샘플링 비율과 비용
5. **지연·콜드 스타트**: Chat 첫 응답 지연(Runtime 세션 생성 포함), 목표 응답 시간 대비 측정
6. **서울 리전**: KB 커넥터 제공 여부, 크로스 리전 처리 범위가 법무 기준과 맞는지
7. **사용자 등록 MCP**: 사용자 개인 범위 MCP 등록이 Gateway 타깃 모델로 구현 가능한지, 타깃 100개 한도 대응
8. **광고주 단위 토큰 격리**: Identity 자격 증명 공급자 구조로 광고주별 분리가 가능한지

---
## 8. 비용 분석
### 8.1 과금 단위 (공식 가격 페이지·예시 기준)
| 서비스 | 과금 단위 | 확인된 단가·예시 |
|---|---|---|
| Runtime microVM | 사용한 CPU·메모리, 초 단위 (최소 1초, 메모리 최소 128MB) | 예시 계산에 vCPU-시간 $0.1276, GB-시간 $0.0169 사용. I/O 대기 중 CPU 과금 없음 |
| Runtime Instances | EC2 요금 + 관리 수수료 | 관리 수수료 12% (GPU 계열 7.8%). 예시: c7g.2xlarge 3시간 세션 $0.97 |
| Harness | 별도 요금 없음 | 하위 서비스 요금만 |
| Gateway | 호출 수 | InvokeTool $5/백만, 검색 $25/백만, 툴 인덱싱 $0.02/100개. 고객 VPC 송신 $0.006/GB |
| Policy | 인가 요청 수 | $0.000025/요청. 자연어 작성 $0.13/1K 입력 토큰 |
| Identity | 토큰 요청 수 | Runtime·Gateway 경유 시 무료. 그 외 $0.010/1,000 요청 |
| Memory | 단기: 수집·저장·조회, 장기: 저장·조회 | 수집 $1.00/GB, 조회 $0.20/GB, 저장 $0.10/GB-월 (이벤트 12KB~64KB 단위로 올림). 장기 저장 $0.75/1,000 레코드 (내장+오버라이드 $0.25), 조회 $0.50/1,000 |
| Observability | CloudWatch 수집·저장 | 스팬 $0.35/GB, 이벤트 로그 $0.50/GB (예시) |
| Evaluations | 내장: 토큰, 커스텀: 건수 | 내장 입력 $2.40/백만 토큰, 출력 $12/백만 토큰. 커스텀 $1.50/1,000건 + 내 계정의 모델 비용. 배치 평가 25% 할인 |
| Optimization | 하위 서비스 요금 | Recommendations 무료, Insights 프리뷰 무료 |
| Registry | 레코드·호출 수 (무료 구간 있음) | 레코드 $0.40/1,000, 검색 $0.020/1,000, 조회·목록 $0.004/1,000 |
| Code Interpreter | 활성 CPU·메모리 | 예시 계산에 vCPU-시간 $0.0895, GB-시간 $0.00945 사용 |

- 가격 페이지의 본 표는 조회하지 못했고, 위 단가는 **가격 페이지 본문의 설명과 가격 예시**에서 추출한 값임. 예시에 쓰인 단가는 미국 리전 기준으로 추정되며 **서울 리전 단가는 확인하지 못함**. 도입 판단 전에 AWS 가격 계산기로 서울 기준 재산정이 필요함
- LLM 토큰 비용은 모든 구성에서 별도임

### 8.2 시뮬레이션 (가정 기반, 예시)
**가정** (실제 사용량이 아니라 규모 감각을 보기 위한 임의 값)
- 월 3,000 세션 (세션당 평균 5턴 → 15,000 인터랙션)
- 세션당 10분, I/O 대기 90%, 1 vCPU 활성 처리, 메모리 1~2.5GB (AWS 예시와 동일)
- 세션당 툴 호출 10회, 정책 평가 10회
- 내장 평가기 3종, 온라인 평가 **10% 샘플링** (인터랙션당 입력 15,000토큰, 출력 300토큰)

| 항목 | 계산 | 월 비용 |
|---|---|---|
| Runtime | 3,000 세션 × $0.0067 (AWS 예시 세션당 값) | 약 $20 |
| Evaluations (10% 샘플링) | 1,500 인터랙션 × 3 평가기 × $0.0396 | 약 $178 |
| Observability | 15,000 호출 × 약 $0.000033 (AWS 예시 환산) | 약 $0.5 |
| Gateway | 30,000 호출 × $5/백만 | 약 $0.15 |
| Policy | 30,000 요청 × $0.000025 | 약 $0.75 |
| Memory | AWS 예시($18.97, 이벤트 10만 건 + 장기 1만 레코드)의 상한으로 추정 | 최대 약 $20 |
| **합계 (LLM 토큰 제외)** | | **약 $200~220** |

- 평가를 100% 수행하면 Evaluations만 약 $1,782 (15,000 인터랙션 × 3 평가기, AWS 예시와 동일)
- **[판단] 시사점**
  - 인프라 비용은 작고, **평가 샘플링 비율이 사실상 주된 비용 변수**임. Phase 1은 샘플링 + 조건부 샘플링(오류·저평가 건 위주)이 현실적임
  - 에이전트가 쓰는 LLM 토큰 비용은 이 시뮬레이션에 포함되지 않았고, 그쪽이 더 클 가능성이 있음
  - 이 값은 사용량 가정에 전적으로 의존하므로 **의사결정 근거가 아니라 규모 감각용**으로만 사용함

---
## 9. 리스크 및 제약
| 구분 | 내용 | 대응 |
|---|---|---|
| 정책 | Evaluations의 서울 요청이 해외 리전에서 처리될 수 있음 | 법무 확인. 커스텀 평가기 또는 평가 대상 데이터 범위 제한 |
| 정책 | Memory·Policy의 지오 내 크로스 리전 추론 | 내장+오버라이드 전략으로 모델 지정 가능(Memory) |
| 기능 | Registry·Web Search·Payments 서울 미지원 | 타 리전 사용 여부 판단 또는 해당 기능 제외 |
| 기능 | Harness는 Strands 고정, 워크플로형 패턴 불가 | 제어가 필요한 부분은 Runtime 직접 구현 |
| 기능 | Evaluations는 Strands·LangGraph만 지원 | 에이전트 프레임워크 선택 시 고려 |
| 기능 | Policy는 Gateway 경유 호출만 통제 | 툴 호출은 전부 Gateway 경유하도록 설계 |
| 기능 | 사용자 평가·워크플로 캔버스·이벤트 트리거는 미제공 | 직접 구현 범위 확정 (4장) |
| 성숙도 | Insights는 공개 프리뷰, 일부 기능(관리형 세션 스토리지 등)도 프리뷰 | 프리뷰 기능은 로드맵 의존 항목에서 제외 |
| 성숙도 | 서비스가 빠르게 변함 (플랫폼 V2, 신규 서비스 다수) | 도입 직전에 문서 재확인 |
| 쿼터 | 게이트웨이당 타깃 100개 (상향 가능), 메모리 리소스당 전략 6개 | 광고주 단위 타깃 설계 시 한도 계산 |
| 종속성 | Memory·Identity는 이전 난이도가 상대적으로 높음 | 5.3 참조. 이전 가능성이 필요하면 해당 서비스를 후순위로 |
| 보안 | Memory 이벤트 메타데이터는 CMK 암호화 제외 | 민감 정보를 메타데이터에 넣지 않음 |
| 비용 | 평가 비용이 사용량에 비례해 급증 | 샘플링 상한 설정, 비용 알림 |
| 인프라 | 현재 이 저장소는 목업 프런트엔드(React/Vite)이며 SpinX 실제 백엔드·AWS 사용 여부는 코드에서 확인되지 않음 | 4장의 확인 필요 사항 |

---
## 10. 권고
1. **Phase 1에서 AgentCore는 "관측·평가 중심의 최소 도입"으로 시작함.** K9 요구사항(트레이스, 자동 평가)에 가장 직접적이며 직접 구축 대비 공수 절감이 큼
2. **검색 계층은 결정 보류 후 PoC로 판단함.** Gateway KB 커넥터, 자체 구현, Snowflake(Cortex Search) 중 선택. 정책 6장의 사전 필터 증명이 선택 기준
3. **시맨틱 레이어·온톨로지(K1·K2)는 AgentCore와 무관하게 먼저 정의함.** 어떤 인프라를 선택해도 Phase 1의 선행 과제임
4. **Phase 2는 Gateway + Step Functions 커넥터를 PoC함.** 고정 순서 실행과 이력 감사가 A1의 요구와 맞음
5. **Phase 3는 직접 구축과 비교 후 결정함.** 광고주 단위 토큰 격리와 호출 전 승인은 직접 구축 비용이 큰 영역임
6. **서울 리전 사용 시 Evaluations의 크로스 리전 처리 범위를 법무와 함께 확인함.** 다수 광고주 데이터 교차 활용 선결 과제에 이 항목을 추가함

---
## 11. 확인 필요 사항
| 대상 | 확인 항목 |
|---|---|
| 개발 | SpinX 백엔드와 인프라의 현재·계획 구성 (AWS 사용 여부, 모델 공급자, 에이전트 프레임워크) |
| 개발 | 에이전트 구현 프레임워크 선택 (Evaluations 지원 범위: Strands·LangGraph) |
| 데이터·인프라 | 사내 데이터 웨어하우스의 Snowflake 사용·도입 계획 (검색·의미 정의를 어디에 둘지) |
| 법무 | 서울 리전 Evaluations·Memory의 크로스 리전 처리 허용 여부, 광고주 데이터 포함 트레이스의 평가 허용 범위 |
| 법무 | Memory 장기 기억에 광고주 데이터가 포함될 때의 보관·삭제 정책 |
| 보안 | K-ISMS 등 국내 인증 요건 해당 여부, AgentCore 적용 가능성 |
| 보안·IT | 사내 IdP 종류 (Okta, Entra ID, Cognito 등)와 Identity 연동 방식 |
| 개발 | Managed KB 커넥터의 서울 리전 제공 여부, `slotScope`·`audienceLevel` 메타데이터 매핑 |
| 개발 | Skills 형식과 Harness·Registry 스킬 형식의 호환성 |
| AWS | 가격 페이지 본 표 기준 서울 리전 단가, Evaluations "근거 오류" 관련 내장 평가기 목록, 14개 기능 중 가이드에 없는 1개 |

---
## 참고 자료
공개 자료를 요약·재구성함 (Content was rephrased for compliance with licensing restrictions). 조회일 2026. 11. 25
- [What is Amazon Bedrock AgentCore? — 개발자 가이드](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)
- [AgentCore Runtime — 개발자 가이드](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html)
- [Runtime lifecycle settings](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-lifecycle-settings.html)
- [AgentCore harness](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness.html)
- [AgentCore harness vs. Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-vs-runtime.html)
- [AgentCore Gateway](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html)
- [Gateway supported targets](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-supported-targets.html)
- [Gateway — MCP targets](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-targets-mcp.html)
- [Gateway — Built-in connectors](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-connectors.html)
- [Gateway — Bedrock Managed Knowledge Bases connector](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-connector-managed-kb.html)
- [Gateway — AWS Step Functions connector](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-connector-step-functions.html)
- [AgentCore Memory](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html)
- [Memory types](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-types.html)
- [Memory strategies](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-strategies.html)
- [AgentCore Identity](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html)
- [Policy in AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html)
- [Observability](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html)
- [AgentCore Evaluations](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html)
- [Built-in evaluators](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/built-in-evaluators-overview.html)
- [Supported AWS Regions](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agentcore-regions.html)
- [Quotas for Amazon Bedrock AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/bedrock-agentcore-limits.html)
- [Security in AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security.html)
- [Data protection](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/data-protection.html)
- [Cross-region inference (Memory, Policy, Evaluations)](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/cross-region-inference.html)
- [Compliance validation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/compliance-validation.html)
- [Amazon Bedrock AgentCore Pricing](https://aws.amazon.com/bedrock/agentcore/pricing/)
