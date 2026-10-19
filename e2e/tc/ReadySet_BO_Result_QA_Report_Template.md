---
document_type: qa_execution_report_template
schema_version: "1.0"
product: "ReadySet"
feature: "Budget Optimizer 결과 화면"
source_tc_document: "ReadySet_BO_Result_TC_Playwright.md"
main_case_count: 200
related_case_count: 10
execution_status: NOT_RUN
---

# Budget Optimizer 결과 화면 · QA 실행 보고서 양식

> **실행 전 빈 양식임. 실제 테스트 결과가 아님.** 본문 TC 200건과 연관 TC 10건을 분리 기록함. 사전 제외 승인은 없으며 모든 TC를 NOT_RUN으로 초기화함.

## 1. 실행 정보

| 항목 | 기록값 |
| --- | --- |
| Run ID | 미설정임 |
| 실행일시 및 시간대 | 미설정임 |
| 대상 환경 / BASE_URL | 미설정임 |
| 앱 버전 / Commit | 미설정임 |
| 자동화 스크립트 버전 / Commit | 미설정임 |
| 브라우저 / 버전 / OS / 뷰포트 | 미설정임 |
| Locale / Timezone | 미설정임 |
| 실행자 | 미설정임 |
| TC 기준 파일 | `ReadySet_BO_Result_TC_Playwright.md`임 |
| 원본 Excel SHA-256 | `7a76d09e4e26c092d92a148601abf93108b558946c5bd8f9c4804d0156c0934b`임 |
| 데이터 snapshot / fixture 버전 | 미설정임 |
| 인증/권한 준비 상태 | 미설정임. 인증정보 원문 저장 금지임 |
| 실행 계층 | UI mock / 실제 API 연동 / 시각 검토를 구분해 기록함 |
| 승인된 제외 TC / 사유 | 없음. 추후 제외 시 승인 근거 기록 필요함 |

## 2. 집계

| 범위 | 전체 TC | PASS | FAIL | N/A | NOT_RUN | BLOCKED | MANUAL_REVIEW | SKIPPED |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 결과 본문 | 200 | 0 | 0 | 0 | 200 | 0 | 0 | 0 |
| 직접 연관 | 10 | 0 | 0 | 0 | 10 | 0 | 0 | 0 |
| 전체 | 210 | 0 | 0 | 0 | 210 | 0 | 0 | 0 |

이 표의 0은 실행 전 초기화값임. `N/A`는 승인된 SKIPPED의 부분집합일 수 있으므로 모든 열을 단순 합산하지 않음. 원본 Result와 실행 상태의 대응 규칙은 TC 문서 §8.1을 따름.

통과율: 산출 전임(PASS+FAIL=0). 실행완료율: 0/210임. 브라우저·KPI·모드별 variant 실행 건수는 아래 별도 기록함. TC ID별 완료를 집계하므로 동일 TC의 여러 variant를 전체 TC 수에 중복 가산하지 않음.

## 3. 원본 TC별 결과

Result는 PASS/FAIL/N/A만 입력함. 실행하지 않았거나 차단/수동검토인 경우 공란 유지함. Assertion 일부만 확인한 경우 PASS 입력 금지임. 조건부 비적용은 사유와 승인 기준을 별도 기록함.

### 3.1 결과 본문 — 200건


| No(원본) | TC ID | Test Case | Priority | Execution Status | Result | Jira_issue num | Tester | Test Date | Comment / Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 321 | BO-RESULT-001 | Completed 결과 진입 검증 | critical | NOT_RUN |  |  |  |  |  |
| 322 | BO-RESULT-002 | Processing 직접 URL 접근 검증 | critical | NOT_RUN |  |  |  |  |  |
| 323 | BO-RESULT-003 | Pending 직접 URL 접근 검증 | critical | NOT_RUN |  |  |  |  |  |
| 324 | BO-RESULT-004 | Error 직접 URL 접근 검증 | critical | NOT_RUN |  |  |  |  |  |
| 325 | BO-RESULT-005 | 삭제된 ID 접근 검증 | critical | NOT_RUN |  |  |  |  |  |
| 326 | BO-RESULT-006 | 권한 없는 Slot 결과 접근 검증 | critical | NOT_RUN |  |  |  |  |  |
| 327 | BO-RESULT-007 | 결과 헤더 헤더 레이아웃 검증 | major | NOT_RUN |  |  |  |  |  |
| 328 | BO-RESULT-008 | 결과 헤더 시나리오명 말줄임 검증 | major | NOT_RUN |  |  |  |  |  |
| 329 | BO-RESULT-009 | 결과 헤더 헤더 메타 중복 방지 검증 | major | NOT_RUN |  |  |  |  |  |
| 330 | BO-RESULT-010 | 결과 헤더 Export 드롭다운 검증 | major | NOT_RUN |  |  |  |  |  |
| 331 | BO-RESULT-011 | 결과 헤더 Copy Link 검증 | major | NOT_RUN |  |  |  |  |  |
| 332 | BO-RESULT-012 | 결과 헤더 Export Excel 검증 | major | NOT_RUN |  |  |  |  |  |
| 333 | BO-RESULT-013 | 결과 헤더 Export PDF 검증 | major | NOT_RUN |  |  |  |  |  |
| 334 | BO-RESULT-014 | 결과 헤더 Info 툴팁 검증 | major | NOT_RUN |  |  |  |  |  |
| 335 | BO-RESULT-015 | 결과 헤더 컨텍스트 메뉴 검증 | major | NOT_RUN |  |  |  |  |  |
| 336 | BO-RESULT-016 | 결과 헤더 컨텍스트 메뉴 외부 클릭 검증 | major | NOT_RUN |  |  |  |  |  |
| 337 | BO-RESULT-017 | 결과 헤더 삭제 메뉴 검증 | major | NOT_RUN |  |  |  |  |  |
| 338 | BO-RESULT-018 | 결과 헤더 삭제 실패 검증 | major | NOT_RUN |  |  |  |  |  |
| 339 | BO-RESULT-019 | 잠금 시나리오 배너 노출 검증 | major | NOT_RUN |  |  |  |  |  |
| 340 | BO-RESULT-020 | 무잠금 시나리오 배너 미노출 검증 | major | NOT_RUN |  |  |  |  |  |
| 341 | BO-RESULT-021 | 잠금 반영 모드 문구 검증 | major | NOT_RUN |  |  |  |  |  |
| 342 | BO-RESULT-022 | 순수 최적화 모드 문구 검증 | major | NOT_RUN |  |  |  |  |  |
| 343 | BO-RESULT-023 | 잠금 반영→순수 전환 버튼 검증 | major | NOT_RUN |  |  |  |  |  |
| 344 | BO-RESULT-024 | 순수→잠금 반영 전환 버튼 검증 | major | NOT_RUN |  |  |  |  |  |
| 345 | BO-RESULT-025 | 모드 전환 데이터 반영 검증 | critical | NOT_RUN |  |  |  |  |  |
| 346 | BO-RESULT-026 | 순수 뷰 잠금 아이콘 숨김 검증 | critical | NOT_RUN |  |  |  |  |  |
| 347 | BO-RESULT-027 | 반복 전환 일관성 검증 | major | NOT_RUN |  |  |  |  |  |
| 348 | BO-RESULT-028 | KPI=노출 화면 라벨 치환 검증 | critical | NOT_RUN |  |  |  |  |  |
| 349 | BO-RESULT-029 | KPI=노출 단가 산출식 검증 | critical | NOT_RUN |  |  |  |  |  |
| 350 | BO-RESULT-030 | KPI=클릭 화면 라벨 치환 검증 | critical | NOT_RUN |  |  |  |  |  |
| 351 | BO-RESULT-031 | KPI=클릭 단가 산출식 검증 | critical | NOT_RUN |  |  |  |  |  |
| 352 | BO-RESULT-032 | KPI=조회 화면 라벨 치환 검증 | critical | NOT_RUN |  |  |  |  |  |
| 353 | BO-RESULT-033 | KPI=조회 단가 산출식 검증 | critical | NOT_RUN |  |  |  |  |  |
| 354 | BO-RESULT-034 | KPI=도달 화면 라벨 치환 검증 | critical | NOT_RUN |  |  |  |  |  |
| 355 | BO-RESULT-035 | KPI=도달 단가 산출식 검증 | critical | NOT_RUN |  |  |  |  |  |
| 356 | BO-RESULT-036 | 차트 한글 질문형 제목 KPI 무관 고정 검증 | major | NOT_RUN |  |  |  |  |  |
| 357 | BO-RESULT-037 | 도달 KPI 단위 회 표기 검증 | critical | NOT_RUN |  |  |  |  |  |
| 358 | BO-RESULT-038 | 스코어카드 Guaranteed KPI 합계 검증 | critical | NOT_RUN |  |  |  |  |  |
| 359 | BO-RESULT-039 | 스코어카드 Total Budget 검증 | critical | NOT_RUN |  |  |  |  |  |
| 360 | BO-RESULT-040 | 스코어카드 Avg CPM 검증 | critical | NOT_RUN |  |  |  |  |  |
| 361 | BO-RESULT-041 | 스코어카드 Avg CPC 검증 | critical | NOT_RUN |  |  |  |  |  |
| 362 | BO-RESULT-042 | 스코어카드 Avg CPV 검증 | critical | NOT_RUN |  |  |  |  |  |
| 363 | BO-RESULT-043 | 스코어카드 Avg CPR 검증 | critical | NOT_RUN |  |  |  |  |  |
| 364 | BO-RESULT-044 | 스코어카드 Locked Budget 값 검증 | critical | NOT_RUN |  |  |  |  |  |
| 365 | BO-RESULT-045 | 스코어카드 잠금 예산 0 검증 | major | NOT_RUN |  |  |  |  |  |
| 366 | BO-RESULT-046 | 스코어카드 모드 전환 재계산 검증 | major | NOT_RUN |  |  |  |  |  |
| 367 | BO-RESULT-047 | 스코어카드 카드 hover 검증 | major | NOT_RUN |  |  |  |  |  |
| 368 | BO-RESULT-048 | 스코어카드 다크모드 검증 | major | NOT_RUN |  |  |  |  |  |
| 369 | BO-RESULT-049 | 차트 공통 섹션 제목 검증 | major | NOT_RUN |  |  |  |  |  |
| 370 | BO-RESULT-050 | 차트 공통 2×2 그리드 검증 | major | NOT_RUN |  |  |  |  |  |
| 371 | BO-RESULT-051 | 차트 공통 매체 토글 검증 | major | NOT_RUN |  |  |  |  |  |
| 372 | BO-RESULT-052 | 차트 공통 상품 토글 검증 | major | NOT_RUN |  |  |  |  |  |
| 373 | BO-RESULT-053 | 차트 공통 상위 5개 표시 검증 | major | NOT_RUN |  |  |  |  |  |
| 374 | BO-RESULT-054 | 차트 공통 데이터 호버 툴팁 숫자 검증 | major | NOT_RUN |  |  |  |  |  |
| 375 | BO-RESULT-055 | 차트 공통 축 틱 축약 검증 | major | NOT_RUN |  |  |  |  |  |
| 376 | BO-RESULT-056 | 차트 공통 Info 툴팁 구분 검증 | major | NOT_RUN |  |  |  |  |  |
| 377 | BO-RESULT-057 | Budget Share 차트 형태 검증 | major | NOT_RUN |  |  |  |  |  |
| 378 | BO-RESULT-058 | Budget Share 상위 5개 + Others 검증 | major | NOT_RUN |  |  |  |  |  |
| 379 | BO-RESULT-059 | Budget Share 비중 1위 강조 검증 | major | NOT_RUN |  |  |  |  |  |
| 380 | BO-RESULT-060 | Budget Share 매체 뷰 검증 | major | NOT_RUN |  |  |  |  |  |
| 381 | BO-RESULT-061 | Budget Share 상품 뷰 검증 | major | NOT_RUN |  |  |  |  |  |
| 382 | BO-RESULT-062 | Budget Share 합계 100% 검증 | major | NOT_RUN |  |  |  |  |  |
| 383 | BO-RESULT-063 | Budget Share 0원 항목 제외/표시 정책 검증 | major | NOT_RUN |  |  |  |  |  |
| 384 | BO-RESULT-064 | Budget Share Info 툴팁 검증 | major | NOT_RUN |  |  |  |  |  |
| 385 | BO-RESULT-065 | Response Curve 기본 항목 검증 | major | NOT_RUN |  |  |  |  |  |
| 386 | BO-RESULT-066 | Response Curve 드롭다운 목록 검증 | major | NOT_RUN |  |  |  |  |  |
| 387 | BO-RESULT-067 | Response Curve 항목 전환 검증 | major | NOT_RUN |  |  |  |  |  |
| 388 | BO-RESULT-068 | Response Curve 단일 곡선 검증 | major | NOT_RUN |  |  |  |  |  |
| 389 | BO-RESULT-069 | Response Curve X축 스케일 검증 | major | NOT_RUN |  |  |  |  |  |
| 390 | BO-RESULT-070 | Response Curve 포화 함수 검증 | major | NOT_RUN |  |  |  |  |  |
| 391 | BO-RESULT-071 | Response Curve Current spend 마커 검증 | major | NOT_RUN |  |  |  |  |  |
| 392 | BO-RESULT-072 | Response Curve 실선/점선 검증 | major | NOT_RUN |  |  |  |  |  |
| 393 | BO-RESULT-073 | Response Curve 경계점 연결 검증 | major | NOT_RUN |  |  |  |  |  |
| 394 | BO-RESULT-074 | Response Curve 의미 범례 검증 | major | NOT_RUN |  |  |  |  |  |
| 395 | BO-RESULT-075 | Response Curve 토글 전환 초기화 검증 | major | NOT_RUN |  |  |  |  |  |
| 396 | BO-RESULT-076 | Response Curve Info 툴팁 문구 검증 | major | NOT_RUN |  |  |  |  |  |
| 397 | BO-RESULT-077 | Response Curve 집행 완료 오해 방지 검증 | major | NOT_RUN |  |  |  |  |  |
| 398 | BO-RESULT-078 | Response Curve CI 밴드 미표시 검증 | major | NOT_RUN |  |  |  |  |  |
| 399 | BO-RESULT-079 | Weekly Contribution 차트 형태 검증 | major | NOT_RUN |  |  |  |  |  |
| 400 | BO-RESULT-080 | Weekly Contribution 최근 1년 토글 검증 | major | NOT_RUN |  |  |  |  |  |
| 401 | BO-RESULT-081 | Weekly Contribution 최근 2년 토글 검증 | major | NOT_RUN |  |  |  |  |  |
| 402 | BO-RESULT-082 | Weekly Contribution 동기간 음영 검증 | major | NOT_RUN |  |  |  |  |  |
| 403 | BO-RESULT-083 | Weekly Contribution 음영 클램프 검증 | major | NOT_RUN |  |  |  |  |  |
| 404 | BO-RESULT-084 | Weekly Contribution 상위 5개 검증 | major | NOT_RUN |  |  |  |  |  |
| 405 | BO-RESULT-085 | Weekly Contribution Info 툴팁 검증 | major | NOT_RUN |  |  |  |  |  |
| 406 | BO-RESULT-086 | Weekly Contribution 미래 예측 오해 문구 없음 검증 | major | NOT_RUN |  |  |  |  |  |
| 407 | BO-RESULT-087 | Incremental 워터폴 구조 검증 | major | NOT_RUN |  |  |  |  |  |
| 408 | BO-RESULT-088 | Incremental 막대 색상 검증 | major | NOT_RUN |  |  |  |  |  |
| 409 | BO-RESULT-089 | Incremental 증가 라벨 검증 | major | NOT_RUN |  |  |  |  |  |
| 410 | BO-RESULT-090 | Incremental 감소 라벨 검증 | major | NOT_RUN |  |  |  |  |  |
| 411 | BO-RESULT-091 | Incremental 연결선 검증 | major | NOT_RUN |  |  |  |  |  |
| 412 | BO-RESULT-092 | Incremental 긴 항목명 검증 | major | NOT_RUN |  |  |  |  |  |
| 413 | BO-RESULT-093 | Incremental Y축 절단 발생 검증 | major | NOT_RUN |  |  |  |  |  |
| 414 | BO-RESULT-094 | Incremental Y축 미절단 검증 | major | NOT_RUN |  |  |  |  |  |
| 415 | BO-RESULT-095 | Incremental 감소 막대 잘림 방지 검증 | major | NOT_RUN |  |  |  |  |  |
| 416 | BO-RESULT-096 | Incremental Info 툴팁 검증 | major | NOT_RUN |  |  |  |  |  |
| 417 | BO-RESULT-097 | SpinX 차트별 해석 블록 노출 검증 | major | NOT_RUN |  |  |  |  |  |
| 418 | BO-RESULT-098 | SpinX 해석 로딩 검증 | major | NOT_RUN |  |  |  |  |  |
| 419 | BO-RESULT-099 | SpinX 해석 본문 길이 검증 | major | NOT_RUN |  |  |  |  |  |
| 420 | BO-RESULT-100 | SpinX 이어서 질문하기 클릭 검증 | major | NOT_RUN |  |  |  |  |  |
| 421 | BO-RESULT-101 | SpinX 자동 전송 안 함 검증 | major | NOT_RUN |  |  |  |  |  |
| 422 | BO-RESULT-102 | SpinX @ 입력 자동완성 검증 | major | NOT_RUN |  |  |  |  |  |
| 423 | BO-RESULT-103 | SpinX 멘션 키보드 선택 검증 | major | NOT_RUN |  |  |  |  |  |
| 424 | BO-RESULT-104 | SpinX 최적화 원리 hover 검증 | major | NOT_RUN |  |  |  |  |  |
| 425 | BO-RESULT-105 | SpinX 최적화 원리 클릭 검증 | major | NOT_RUN |  |  |  |  |  |
| 426 | BO-RESULT-106 | SpinX 잠금 없는 시나리오 트리거 검증 | major | NOT_RUN |  |  |  |  |  |
| 427 | BO-RESULT-107 | Budget Allocation Detail 테이블 구조 검증 | major | NOT_RUN |  |  |  |  |  |
| 428 | BO-RESULT-108 | Budget Allocation Detail 매체 펼침/접힘 검증 | major | NOT_RUN |  |  |  |  |  |
| 429 | BO-RESULT-109 | Budget Allocation Detail Estimated Total 행 검증 | major | NOT_RUN |  |  |  |  |  |
| 430 | BO-RESULT-110 | Budget Allocation Detail Budget 컬럼 검증 | major | NOT_RUN |  |  |  |  |  |
| 431 | BO-RESULT-111 | Budget Allocation Detail Share 컬럼 검증 | major | NOT_RUN |  |  |  |  |  |
| 432 | BO-RESULT-112 | Budget Allocation Detail Guaranteed KPI 컬럼 검증 | major | NOT_RUN |  |  |  |  |  |
| 433 | BO-RESULT-113 | Budget Allocation Detail Impression 컬럼 검증 | major | NOT_RUN |  |  |  |  |  |
| 434 | BO-RESULT-114 | Budget Allocation Detail Click 컬럼 검증 | major | NOT_RUN |  |  |  |  |  |
| 435 | BO-RESULT-115 | Budget Allocation Detail View 컬럼 검증 | major | NOT_RUN |  |  |  |  |  |
| 436 | BO-RESULT-116 | Budget Allocation Detail Reach 컬럼 검증 | critical | NOT_RUN |  |  |  |  |  |
| 437 | BO-RESULT-117 | Budget Allocation Detail CPM 컬럼 검증 | major | NOT_RUN |  |  |  |  |  |
| 438 | BO-RESULT-118 | Budget Allocation Detail CPC 컬럼 검증 | major | NOT_RUN |  |  |  |  |  |
| 439 | BO-RESULT-119 | Budget Allocation Detail CPV 컬럼 검증 | major | NOT_RUN |  |  |  |  |  |
| 440 | BO-RESULT-120 | Budget Allocation Detail 잠금 아이콘 검증 | major | NOT_RUN |  |  |  |  |  |
| 441 | BO-RESULT-121 | Budget Allocation Detail 순수 뷰 잠금 아이콘 미표시 검증 | major | NOT_RUN |  |  |  |  |  |
| 442 | BO-RESULT-122 | Budget Allocation Detail 순수 뷰 delta 검증 | critical | NOT_RUN |  |  |  |  |  |
| 443 | BO-RESULT-123 | Budget Allocation Detail delta 색상 증가 검증 | critical | NOT_RUN |  |  |  |  |  |
| 444 | BO-RESULT-124 | Budget Allocation Detail delta 색상 감소 검증 | critical | NOT_RUN |  |  |  |  |  |
| 445 | BO-RESULT-125 | Budget Allocation Detail 가로 스크롤 검증 | major | NOT_RUN |  |  |  |  |  |
| 446 | BO-RESULT-126 | Budget Allocation Detail 0값 하이픈 검증 | major | NOT_RUN |  |  |  |  |  |
| 447 | BO-RESULT-127 | 0원 배분 상품 행 0원 검증 | major | NOT_RUN |  |  |  |  |  |
| 448 | BO-RESULT-128 | 0원 배분 매체 행 0원 검증 | major | NOT_RUN |  |  |  |  |  |
| 449 | BO-RESULT-129 | 0원 배분 툴팁 제목 검증 | major | NOT_RUN |  |  |  |  |  |
| 450 | BO-RESULT-130 | 0원 배분 툴팁 사유 검증 | major | NOT_RUN |  |  |  |  |  |
| 451 | BO-RESULT-131 | 0원 배분 툴팁 잠금 안내 검증 | major | NOT_RUN |  |  |  |  |  |
| 452 | BO-RESULT-132 | 0원 배분 툴팁 fixed position 검증 | major | NOT_RUN |  |  |  |  |  |
| 453 | BO-RESULT-133 | 0원 배분 예산 > 0 행 검증 | major | NOT_RUN |  |  |  |  |  |
| 454 | BO-RESULT-134 | 0원 배분 순수 뷰 0원 검증 | major | NOT_RUN |  |  |  |  |  |
| 455 | BO-RESULT-135 | Easy Create CTA 노출 검증 | major | NOT_RUN |  |  |  |  |  |
| 456 | BO-RESULT-136 | Easy Create CTA 보조문구 검증 | major | NOT_RUN |  |  |  |  |  |
| 457 | BO-RESULT-137 | Easy Create CTA 클릭 검증 | major | NOT_RUN |  |  |  |  |  |
| 458 | BO-RESULT-138 | Easy Create 시나리오명 프리셋 검증 | major | NOT_RUN |  |  |  |  |  |
| 459 | BO-RESULT-139 | Easy Create 업종·기간 승계 검증 | major | NOT_RUN |  |  |  |  |  |
| 460 | BO-RESULT-140 | Easy Create 타겟 GRP 기본값 검증 | major | NOT_RUN |  |  |  |  |  |
| 461 | BO-RESULT-141 | Easy Create 성별 전체 선택/해제 검증 | major | NOT_RUN |  |  |  |  |  |
| 462 | BO-RESULT-142 | Easy Create 타겟 0개 검증 | major | NOT_RUN |  |  |  |  |  |
| 463 | BO-RESULT-143 | Easy Create 노출 전달 모드 기본 검증 | major | NOT_RUN |  |  |  |  |  |
| 464 | BO-RESULT-144 | Easy Create 노출 전달 none 검증 | major | NOT_RUN |  |  |  |  |  |
| 465 | BO-RESULT-145 | Easy Create 노출 전달 required 검증 | major | NOT_RUN |  |  |  |  |  |
| 466 | BO-RESULT-146 | Easy Create 노출 전달 all 검증 | major | NOT_RUN |  |  |  |  |  |
| 467 | BO-RESULT-147 | Easy Create 전달 내역 미리보기 검증 | major | NOT_RUN |  |  |  |  |  |
| 468 | BO-RESULT-148 | Easy Create 미지원 제외 검증 | major | NOT_RUN |  |  |  |  |  |
| 469 | BO-RESULT-149 | Easy Create 예산 0원 제외 검증 | major | NOT_RUN |  |  |  |  |  |
| 470 | BO-RESULT-150 | Easy Create 미지원 우선순위 검증 | major | NOT_RUN |  |  |  |  |  |
| 471 | BO-RESULT-151 | Easy Create 행 정렬 검증 | major | NOT_RUN |  |  |  |  |  |
| 472 | BO-RESULT-152 | Easy Create 요약 카운트 검증 | major | NOT_RUN |  |  |  |  |  |
| 473 | BO-RESULT-153 | Easy Create 제외 0건 카운트 생략 검증 | major | NOT_RUN |  |  |  |  |  |
| 474 | BO-RESULT-154 | Easy Create 전달 대상 0건 검증 | critical | NOT_RUN |  |  |  |  |  |
| 475 | BO-RESULT-155 | Easy Create 모달 header/footer 고정 검증 | major | NOT_RUN |  |  |  |  |  |
| 476 | BO-RESULT-156 | Easy Create 표 내부 스크롤 검증 | major | NOT_RUN |  |  |  |  |  |
| 477 | BO-RESULT-157 | Easy Create 취소 검증 | major | NOT_RUN |  |  |  |  |  |
| 478 | BO-RESULT-158 | Easy Create 확정 이동 검증 | critical | NOT_RUN |  |  |  |  |  |
| 479 | BO-RESULT-159 | Easy Create 0원 상품 미전달 검증 | critical | NOT_RUN |  |  |  |  |  |
| 480 | BO-RESULT-160 | Easy Create 원본 정보 승계 검증 | major | NOT_RUN |  |  |  |  |  |
| 481 | BO-RESULT-161 | Easy Create 권한 없는 사용자 검증 | major | NOT_RUN |  |  |  |  |  |
| 482 | BO-RESULT-162 | 결과 화면 금액 포맷 검증 | minor | NOT_RUN |  |  |  |  |  |
| 483 | BO-RESULT-163 | 결과 화면 비중 포맷 검증 | minor | NOT_RUN |  |  |  |  |  |
| 484 | BO-RESULT-164 | 결과 화면 수량 포맷 검증 | minor | NOT_RUN |  |  |  |  |  |
| 485 | BO-RESULT-165 | 결과 화면 0값 포맷 검증 | minor | NOT_RUN |  |  |  |  |  |
| 486 | BO-RESULT-166 | 결과 화면 매체명 표준 검증 | minor | NOT_RUN |  |  |  |  |  |
| 487 | BO-RESULT-167 | 결과 화면 결과 API 로딩 검증 | minor | NOT_RUN |  |  |  |  |  |
| 488 | BO-RESULT-168 | 결과 화면 결과 API 실패 검증 | major | NOT_RUN |  |  |  |  |  |
| 489 | BO-RESULT-169 | 결과 화면 차트 데이터 없음 검증 | minor | NOT_RUN |  |  |  |  |  |
| 490 | BO-RESULT-170 | 결과 화면 테이블 데이터 없음 검증 | minor | NOT_RUN |  |  |  |  |  |
| 491 | BO-RESULT-171 | 결과 화면 다크모드 검증 | minor | NOT_RUN |  |  |  |  |  |
| 492 | BO-RESULT-172 | 결과 화면 반응형 검증 | minor | NOT_RUN |  |  |  |  |  |
| 493 | BO-RESULT-173 | 결과 화면 키보드 접근 검증 | minor | NOT_RUN |  |  |  |  |  |
| 494 | BO-RESULT-174 | 결과 화면 툴팁 접근성 검증 | minor | NOT_RUN |  |  |  |  |  |
| 558 | BO-RESULT-175 | 결과 데이터 정합성 allocations 기반 차트 검증 | critical | NOT_RUN |  |  |  |  |  |
| 559 | BO-RESULT-176 | 결과 데이터 정합성 Weekly Contribution 별도 소스 검증 | critical | NOT_RUN |  |  |  |  |  |
| 560 | BO-RESULT-177 | 결과 데이터 정합성 pureAllocations 전환 검증 | critical | NOT_RUN |  |  |  |  |  |
| 561 | BO-RESULT-178 | 결과 데이터 정합성 totalReach 사용 검증 | critical | NOT_RUN |  |  |  |  |  |
| 562 | BO-RESULT-179 | 결과 데이터 정합성 pureTotalReach 사용 검증 | critical | NOT_RUN |  |  |  |  |  |
| 563 | BO-RESULT-180 | 결과 데이터 정합성 잠금 필드 isFixed 검증 | critical | NOT_RUN |  |  |  |  |  |
| 564 | BO-RESULT-181 | 결과 데이터 정합성 0원 판별 budget 검증 | critical | NOT_RUN |  |  |  |  |  |
| 565 | BO-RESULT-182 | 결과 데이터 정합성 Share 계산 검증 | critical | NOT_RUN |  |  |  |  |  |
| 566 | BO-RESULT-183 | 결과 데이터 정합성 Guaranteed KPI 합계 검증 | critical | NOT_RUN |  |  |  |  |  |
| 567 | BO-RESULT-184 | 결과 데이터 정합성 숫자 반올림 검증 | critical | NOT_RUN |  |  |  |  |  |
| 568 | BO-RESULT-185 | 결과 Export Copy Link 성공 검증 | major | NOT_RUN |  |  |  |  |  |
| 569 | BO-RESULT-186 | 결과 Export Copy Link 실패 검증 | major | NOT_RUN |  |  |  |  |  |
| 570 | BO-RESULT-187 | 결과 Export Excel 다운로드 성공 검증 | major | NOT_RUN |  |  |  |  |  |
| 571 | BO-RESULT-188 | 결과 Export Excel 다운로드 실패 검증 | major | NOT_RUN |  |  |  |  |  |
| 572 | BO-RESULT-189 | 결과 Export PDF 다운로드 성공 검증 | major | NOT_RUN |  |  |  |  |  |
| 573 | BO-RESULT-190 | 결과 Export PDF 다운로드 실패 검증 | major | NOT_RUN |  |  |  |  |  |
| 574 | BO-RESULT-191 | 결과 Export Export 메뉴 외부 클릭 검증 | major | NOT_RUN |  |  |  |  |  |
| 575 | BO-RESULT-192 | 결과 Export Export 권한 조회 사용자 검증 | major | NOT_RUN |  |  |  |  |  |
| 576 | BO-RESULT-193 | 결과 접근성 모드 전환 키보드 검증 | minor | NOT_RUN |  |  |  |  |  |
| 577 | BO-RESULT-194 | 결과 접근성 차트 드롭다운 키보드 검증 | minor | NOT_RUN |  |  |  |  |  |
| 578 | BO-RESULT-195 | 결과 접근성 테이블 아코디언 키보드 검증 | minor | NOT_RUN |  |  |  |  |  |
| 579 | BO-RESULT-196 | 결과 접근성 Easy Create 모달 focus trap 검증 | minor | NOT_RUN |  |  |  |  |  |
| 580 | BO-RESULT-197 | 결과 접근성 Easy Create target checkbox 검증 | minor | NOT_RUN |  |  |  |  |  |
| 581 | BO-RESULT-198 | 결과 접근성 Export 메뉴 ESC 검증 | minor | NOT_RUN |  |  |  |  |  |
| 582 | BO-RESULT-199 | 결과 접근성 Info 툴팁 키보드 검증 | minor | NOT_RUN |  |  |  |  |  |
| 583 | BO-RESULT-200 | 결과 접근성 SpinX 멘션 자동완성 키보드 검증 | minor | NOT_RUN |  |  |  |  |  |


### 3.2 직접 연관 — 10건


| No(원본) | TC ID | Test Case | Priority | Execution Status | Result | Jira_issue num | Tester | Test Date | Comment / Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 19 | BO-PERM-019 | Client 권한에서 결과 화면 컨텍스트 메뉴 이동/삭제/복제 제한 검증 | critical | NOT_RUN |  |  |  |  |  |
| 20 | BO-PERM-020 | Agency 권한에서 결과 화면 컨텍스트 메뉴 이동/삭제/복제 제한 검증 | critical | NOT_RUN |  |  |  |  |  |
| 21 | BO-PERM-021 | Client 권한에서 Reach Caster 간편 생성 CTA 제한 검증 | major | NOT_RUN |  |  |  |  |  |
| 22 | BO-PERM-022 | Agency 권한에서 Reach Caster 간편 생성 CTA 제한 검증 | major | NOT_RUN |  |  |  |  |  |
| 25 | BO-COMMON-003 | 결과 화면 브레드크럼 표시 및 이동 검증 | major | NOT_RUN |  |  |  |  |  |
| 505 | BO-GNB-003 | GNB 알림 완료 알림 클릭 정상 검증 | major | NOT_RUN |  |  |  |  |  |
| 506 | BO-GNB-004 | GNB 알림 완료 알림 클릭 Slot 삭제 검증 | major | NOT_RUN |  |  |  |  |  |
| 507 | BO-GNB-005 | GNB 알림 완료 알림 클릭 권한 없음 검증 | major | NOT_RUN |  |  |  |  |  |
| 508 | BO-GNB-006 | GNB 알림 완료 알림 클릭 시나리오 삭제 검증 | major | NOT_RUN |  |  |  |  |  |
| 509 | BO-GNB-007 | GNB 알림 완료 알림 클릭 Slot 이동됨 검증 | major | NOT_RUN |  |  |  |  |  |


## 4. Assertion 및 variant 상세 기록

TC 문서의 Assertion ID를 사용함. TC별 필요 variant를 먼저 선언하고, 실행 기록은 variant마다 추가함. 원본 Expectation을 축소하지 않음.

| Run ID | TC ID | Variant ID | Browser | Role | Scenario ID | KPI | Mode / View | Assertion ID | Expected | Actual | Status | Reason | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | | | NOT_RUN | | |

증적 경로에는 TC ID·variant·Assertion ID가 식별되도록 기록함. 실제 파일이 없는데 증적 경로만 채우지 않음. 통과한 Assertion과 실패/미실행 Assertion을 모두 기록함.

## 5. 확인 필요 사항의 결정 기록

TC 문서 AUTO-01~AUTO-16 중 실제 실행에 영향을 주는 항목을 아래에 기록함. 미확정 상태를 임의로 PASS 또는 N/A로 바꾸지 않음.

| Review ID | 관련 TC/Assertion | 질문/충돌 | 승인된 기대결과 | 승인자/근거 | 상태 | 재실행 필요 여부 |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | 미확정 | |

## 6. 실패/차단/수동 검토 상세

### 항목 기록 양식

- TC ID / Variant / Assertion: 미기록임
- 분류: 제품 결함 / 환경 차단 / fixture 부족 / 사양 미확정 / 수동 검토 중 선택함
- 사전조건 및 재현 절차: 미기록임
- 기대값 및 근거: 미기록임
- 실제값: 미기록임
- 영향 범위: 미기록임
- Screenshot / Trace / 마스킹한 Network / Download 증적: 미기록임
- Jira_issue num: 미기록임
- 재테스트 Run ID 및 결과: 미기록임

## 7. 실행 누락 및 최종 판단

| 점검 항목 | 상태/기록 |
| --- | --- |
| 본문 200개 ID 누락·중복 여부 | 확인 전임 |
| 연관 10개 ID 누락·중복 여부 | 확인 전임 |
| 모든 필수 variant 실행 여부 | 확인 전임 |
| 각 Expected Result 행의 Assertion 매핑 여부 | 확인 전임 |
| NO_DATA/권한 미설정 등을 PASS로 오판하지 않았는지 | 확인 전임 |
| Mock UI 검증과 실제 서버 권한 검증 구분 여부 | 확인 전임 |
| 시각 검토 미완료를 PASS로 기록하지 않았는지 | 확인 전임 |
| 원본 TC·실제 실행 스크립트·보고서 ID 일치 여부 | 확인 전임 |
| 승인 제외 TC와 사유 확인 여부 | 확인 전임 |
| 잔여 FAIL/BLOCKED/MANUAL_REVIEW/NOT_RUN 수 | 실행 전이므로 NOT_RUN 210건임 |
| 배포 판단 | 미판정임. 실행 및 검토 완료 전 승인하지 않음 |
