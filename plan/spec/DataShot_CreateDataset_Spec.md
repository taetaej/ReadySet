# DataShot — 데이터셋 생성 화면 상세 명세서

> 목적: QA 테스트케이스(TC) 작성 기준 문서  
> 버전: v1.0  
> 작성일: 2026-05-26  
> 참조: `plan/eunseo/DataShot_Phase1_policy_IA_v1.0.md`

---

## 1. 화면 개요

| 항목 | 내용 |
|---|---|
| 화면명 | 데이터셋 생성 (Create Dataset) |
| 경로 | `/datashot/new` |
| 진입 경로 | DataShot 목록 → "New Dataset" 버튼 클릭 |
| 접근 권한 | Admin, Marketer만 접근 가능 |
| 주요 기능 | 3단계 스텝 폼으로 조회 조건 설정 → 데이터 추출 요청 |

---

## 2. 레이아웃 구조

### 2.1 전체 구조

```
┌─────────────────────────────────────────────────────────────┐
│ AppLayout (GlobalNavBar + Sidebar + Breadcrumb)              │
├─────────────────────────────────────────────────────────────┤
│ 페이지 헤더: "새 데이터셋 생성" + 설명                        │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────┬───┬──────────────────┐                 │
│ │ 좌측 (800px)     │ | │ 우측 (420px)     │                 │
│ │ - 스테퍼         │ | │ Configuration    │                 │
│ │ - 스텝 컨텐츠    │ | │ Summary          │                 │
│ │ - 네비게이션 버튼 │ | │                  │                 │
│ └──────────────────┴───┴──────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

- Grid: `800px | 1px(구분선) | 420px`, gap: 48px
- 최대 너비: 1400px, 중앙 정렬
- 패딩: 32px

### 2.2 Breadcrumb

| 순서 | 라벨 | 동작 |
|---|---|---|
| 1 | SlotBoard | `/slotboard`로 이동 |
| 2 | {Slot명} | 비활성 (텍스트만) |
| 3 | DataShot | `/datashot`로 이동 |
| 4 | 새 데이터셋 생성 | 현재 페이지 (비활성) |

---

## 3. 스테퍼 (Step Indicator)

### 3.1 스텝 정의

| 스텝 | 타이틀 | 설명 | 주요 입력 |
|---|---|---|---|
| 1 | 기본 정보 | 데이터셋명 · 기간 · 업종 | 데이터셋명, 설명, 조회기간, 업종 |
| 2 | 상세 설정 | 매체 · 광고분류 · 지표 | 매체, 광고상품, 타겟팅 옵션, 지표 |
| 3 | 검토 및 추출 | 샘플 데이터 확인 | 미리보기 확인 후 추출 요청 |

### 3.2 스테퍼 UI 상태

| 스텝 상태 | 배경색 | 숫자/아이콘 | 텍스트 색상 |
|---|---|---|---|
| 현재 (active) | primary | 숫자 (primary-foreground 원) | primary-foreground |
| 완료 (completed) | muted | Check 아이콘 (primary 원) | foreground |
| 미진행 (upcoming) | transparent + border | 숫자 (muted 원) | muted-foreground |

- 스텝 간 연결선: width 24px, 완료 시 primary 색상, 미완료 시 border 색상

---

## 4. Step 1 — 기본 정보

### 4.1 데이터셋명

| 요소 | 스펙 |
|---|---|
| 라벨 | "데이터셋명" + 필수 표시(*) |
| 입력 타입 | text input |
| placeholder | "데이터셋명을 입력하세요." |
| 최대 길이 | 30자 |
| 글자수 표시 | `{현재}/30` (우측 하단) |
| 줄바꿈 방지 | Enter 키 preventDefault, \n 제거 |
| 공백 검증 | 공백만으로 구성 불가 |

| 유효성 검사 | 조건 | 에러 메시지 |
|---|---|---|
| 미입력 | trim() === '' | "데이터셋명을 입력해주세요." |
| 공백만 입력 | length > 0 && trim() === '' | "공백만으로 구성할 수 없습니다." |

### 4.2 설명

| 요소 | 스펙 |
|---|---|
| 라벨 | "설명" (선택 항목, * 없음) |
| 입력 타입 | textarea |
| placeholder | "데이터셋에 대한 설명을 입력하세요." |
| 최대 길이 | 200자 |
| 글자수 표시 | `{현재}/200` (우측 하단) |
| resize | vertical 허용 |
| 최소 높이 | 80px |

### 4.3 조회기간

| 요소 | 스펙 |
|---|---|
| 라벨 | "조회기간" + 필수 표시(*) |
| 안내 텍스트 | "최근 2년치 데이터를 조회할 수 있습니다." |
| 기간 유형 | radio: 월별 / 분기별 (기본: 월별) |
| 선택 UI | MonthRangePicker 컴포넌트 |
| 유형 변경 시 | 기간 값 초기화 (startYear/Month, endYear/Month 모두 리셋) |

| 유효성 검사 | 조건 | 에러 메시지 |
|---|---|---|
| 미선택 | start 또는 end 비어있음 | "조회기간을 선택해주세요." |
| 역순 | endTotal < startTotal | "종료일은 시작일보다 이후여야 합니다." |
| 초과 | endTotal - startTotal > 24 | "조회기간은 최대 2년까지 설정 가능합니다." |

### 4.4 업종

| 요소 | 스펙 |
|---|---|
| 라벨 | "업종" + 필수 표시(*) |
| 선택 UI | 클릭 시 IndustryDialog 오픈 |
| 표시 형식 | 미선택: "업종을 선택하세요." / 선택됨: "{N}개 업종 선택됨 ({레벨})" |
| 다중 선택 | 가능 |
| 분류 레벨 | 대분류 / 중분류 / 소분류 중 하나 선택 |

| 유효성 검사 | 조건 | 에러 메시지 |
|---|---|---|
| 미선택 | industries.length === 0 | "업종을 선택해주세요." |

### 4.5 Step 1 유효성 활성화 조건

- 아래 중 하나라도 입력/선택되면 유효성 검사 활성화:
  - datasetName 입력
  - description 입력
  - period.startYear 또는 startMonth 선택
  - industries 선택

### 4.6 Step 1 완료 조건 (다음 버튼 활성화)

```
datasetName.trim() !== '' &&
period.startYear && period.startMonth && period.endYear && period.endMonth &&
dateValidation.valid &&
industries.length > 0 &&
industryLevel !== null
```

---

## 5. Step 2 — 상세 설정

### 5.1 매체 선택

| 요소 | 스펙 |
|---|---|
| 라벨 | "매체" + 필수 표시(*) |
| 선택 방식 | 단일 선택 (6개 버튼 그리드) |
| 레이아웃 | grid 6열 |
| 매체 목록 | Google Ads, Meta, kakao모먼트, 네이버 성과형 DA, 네이버 보장형 DA, TikTok |
| 선택 스타일 | border: primary, bg: primary/0.1, font-weight: 600, color: primary |
| 미선택 스타일 | border: border, bg: transparent |
| 매체 변경 시 | products, metrics, targetingCategory, targetingOptions 모두 초기화 |

| 유효성 검사 | 조건 | 에러 메시지 |
|---|---|---|
| 미선택 | media === '' | "매체를 선택해주세요." |

### 5.2 매체 미선택 시 빈 상태

| 조건 | 표시 |
|---|---|
| media === '' | ListPlus 아이콘 + "매체를 먼저 선택해주세요" + "세분화된 조회 조건을 설정할 수 있습니다." |
| 데이터 없음 (fields[0].options.length === 0) | Undo2 아이콘 + "설정한 조건에 해당하는 데이터가 없습니다" + "Step1으로 돌아가 기간 또는 업종을 다시 선택해주세요." |

### 5.3 광고상품 (AdProductsSelector)

| 요소 | 스펙 |
|---|---|
| 라벨 | 매체별 동적 (예: "캠페인 유형") |
| 안내 메시지 | "Step1에서 설정한 기간, 업종의 집행 데이터가 있는 {label}만 표시됩니다." |
| 선택 방식 | 다중 선택 |
| 동적 제어 | 매체 선택에 따라 옵션 목록 변경 |
| 0건 예방 | 실제 데이터 존재하는 옵션만 활성화 |

| 유효성 검사 | 조건 | 에러 메시지 |
|---|---|---|
| 미선택 | products.length === 0 | (AdProductsSelector 내부 처리) |

### 5.4 타겟팅 옵션 (선택)

| 요소 | 스펙 |
|---|---|
| 노출 조건 | 해당 매체에 타겟팅 옵션이 존재할 때만 표시 |
| 카테고리 선택 | 단일 선택 |
| 옵션 선택 | 다중 선택 |
| 카테고리 변경 시 | targetingOptions, metrics 초기화 |

| 유효성 검사 | 조건 | 에러 메시지 |
|---|---|---|
| 카테고리 선택 후 옵션 미선택 | targetingCategory && targetingOptions.length === 0 | 에러 표시 |

### 5.5 지표

| 요소 | 스펙 |
|---|---|
| 라벨 | "지표" + 필수 표시(*) |
| 안내 텍스트 | "타겟팅 옵션 선택에 따라 조회 가능한 지표만 리스트에 표시됩니다." |
| 검색 | input, placeholder: "지표 검색", 실시간 필터링 |
| 선택 방식 | 다중 선택 (그룹별 체크박스) |
| 동적 제어 | 매체 + 타겟팅 옵션 조합에 따라 일부 지표 제외 |

| 매체 | 타겟팅 카테고리 | 제외 지표 |
|---|---|---|
| Meta | 기기유형 | post_reaction, post_engagement, cost_per_post_engagement, link_click, cost_per_link_click, link_ctr, complete_registration, cost_per_registration |
| kakao모먼트 | 디바이스 | conversions, message_send, message_open, message_click, message_open_rate, message_click_rate, channel_add_cpa, channel_add_cvr |
| 네이버 보장형 DA | 노출영역 | cost, cost_guaranteed, cpc, cpm, cpv |

| 유효성 검사 | 조건 | 에러 메시지 |
|---|---|---|
| 미선택 | metrics.length === 0 | "지표를 선택해주세요." |

### 5.6 Step 2 유효성 활성화 조건

- 아래 중 하나라도 입력/선택되면 활성화:
  - media 선택
  - products 선택
  - metrics 선택
  - targetingCategory 선택
  - targetingOptions 선택

### 5.7 Step 2 완료 조건 (다음 버튼 활성화)

```
media !== '' &&
products.length > 0 &&
metrics.length > 0 &&
(!targetingCategory || targetingOptions.length > 0)
```

---

## 6. Step 3 — 검토 및 추출

### 6.1 안내 영역

| 요소 | 스펙 |
|---|---|
| 아이콘 | Check(16px) |
| 텍스트 | "우측 Configuration Summary에서 설정 내용을 확인하세요." |
| 스타일 | bg: muted/0.3, border, border-radius: 8px |

### 6.2 데이터 미리보기

| 요소 | 스펙 |
|---|---|
| 타이틀 | "데이터 미리보기" |
| 설명 | "샘플 데이터를 통해 데이터 구조를 확인하세요." |
| 전체 컬럼 보기 버튼 | Maximize2 아이콘 + "전체 컬럼 보기" → SampleDataModal 오픈 |
| 테이블 행 수 | 5행 (Mock 데이터) |

### 6.3 미리보기 테이블 컬럼

| 고정 컬럼 | 동적 컬럼 |
|---|---|
| 기간, 매체, 업종(대), 업종(중), 업종(소) | 매체별 광고상품 컬럼 + 타겟팅 옵션(선택 시) + 지표 5개(cost, impressions, clicks, ctr, cpc) |

- Meta 매체: 캠페인 목표, 구매 유형, 플랫폼, 성과 목표 (4컬럼)
- 기타 매체: 캠페인 유형 (1컬럼)

### 6.4 데이터 없음 상태

| 조건 | 표시 |
|---|---|
| totalRows === 0 | SearchX 아이콘 + "설정한 조회조건에 맞는 데이터가 없습니다." + "이전 단계로 돌아가서 조회조건을 다시 설정해주세요." |

### 6.5 예상 데이터 크기

| 요소 | 스펙 |
|---|---|
| 위치 | 네비게이션 버튼 바로 위, 우측 정렬 |
| 표시 | Database 아이콘 + "예상 데이터 크기 : {N} 행" |
| 계산식 | periods × industries.length × products.length × (targetingOptions.length \|\| 1) |

---

## 7. Configuration Summary (우측 패널)

| 요소 | 스펙 |
|---|---|
| 위치 | 우측 420px 영역 |
| 역할 | 현재까지 설정한 조회 조건 실시간 요약 표시 |
| 스텝별 표시 | 현재 스텝까지 입력된 값만 표시 |

---

## 8. 네비게이션 버튼

### 8.1 버튼 구성

| 위치 | 버튼 | 동작 | 조건 |
|---|---|---|---|
| 좌측 | 취소 | `/datashot`으로 이동 | 항상 표시 |
| 우측 | 이전 | currentStep - 1 | currentStep > 1 |
| 우측 | 다음 | currentStep + 1 | currentStep < 3, 유효성 통과 시 |
| 우측 | 데이터셋 생성 요청 | handleSubmit 실행 | currentStep === 3 |

### 8.2 다음 버튼 비활성화

| 스텝 | 비활성 조건 |
|---|---|
| 1 | !isStep1Valid() → opacity: 0.5, cursor: not-allowed |
| 2 | !isStep2Valid() → opacity: 0.5, cursor: not-allowed |

### 8.3 생성 요청 버튼

| 상태 | 텍스트 | 스타일 |
|---|---|---|
| 기본 | "데이터셋 생성 요청" | btn-primary btn-lg |
| 제출 중 | "생성 중..." | opacity: 0.7, cursor: not-allowed, disabled |

---

## 9. 토스트 알림

| 타입 | 아이콘 | 타이틀 | 메시지 | 자동 닫힘 |
|---|---|---|---|---|
| success | CheckCircle (green) | "성공" | "Dataset이 성공적으로 생성되었습니다." | 5초 |
| error | AlertCircle (destructive) | "오류" | "데이터셋 생성 요청에 실패했습니다. 다시 시도해주세요." | 5초 |

- 성공 시: 2초 후 `/datashot` 목록으로 자동 이동
- X 버튼으로 수동 닫기 가능

---

## 10. SampleDataModal

| 요소 | 스펙 |
|---|---|
| 트리거 | Step3 "전체 컬럼 보기" 버튼 |
| 내용 | 전체 컬럼 포함 샘플 데이터 5행 테이블 |
| 닫기 | X 버튼 또는 오버레이 클릭 |

---

## 11. 에러 처리 및 엣지 케이스

### 11.1 유효성 검사 타이밍

| 시점 | 동작 |
|---|---|
| 최초 진입 | 유효성 비활성 (에러 메시지 미표시) |
| 첫 입력/선택 발생 | 해당 스텝 유효성 활성화 |
| "다음" 클릭 시 미충족 | 유효성 강제 활성화 + 진행 차단 |

### 11.2 스텝 간 데이터 의존성

| 시나리오 | 동작 |
|---|---|
| Step2에서 매체 변경 | products, metrics, targeting 모두 초기화 |
| Step1 기간/업종 변경 후 Step2 재진입 | 광고상품 옵션 목록 재계산 (데이터 없으면 빈 상태 표시) |
| Step2 타겟팅 카테고리 변경 | targetingOptions, metrics 초기화 |

### 11.3 네트워크/서버 에러

| 시나리오 | 동작 |
|---|---|
| 생성 요청 실패 | error 토스트 표시, 버튼 재활성화 |
| 타임아웃 (60초) | "목록에서 상태를 확인하세요" 안내 |

### 11.4 권한 제어

| 시나리오 | 동작 |
|---|---|
| Client/Agency가 URL 직접 접근 | 접근 차단 또는 목록으로 리다이렉트 |

---

## 12. 접근성 고려사항

| 항목 | 기준 |
|---|---|
| 필수 필드 | aria-required="true", 라벨에 * 표시 |
| 에러 메시지 | aria-describedby로 input과 연결 |
| 스테퍼 | aria-current="step" (현재 스텝) |
| 라디오 버튼 | fieldset + legend 구조 |
| 모달 | focus trap, ESC 닫기, aria-modal |
| 키보드 | Tab으로 모든 폼 요소 순차 접근 |

---

## 13. 비즈니스 규칙 검증 포인트 (TC 작성 기준)

| # | 검증 항목 | 기대 결과 |
|---|---|---|
| 1 | 데이터셋명 30자 초과 입력 시도 | 30자에서 입력 차단 |
| 2 | 데이터셋명 공백만 입력 | 에러 메시지 표시, 다음 진행 불가 |
| 3 | 설명 200자 초과 입력 시도 | 200자에서 입력 차단 |
| 4 | 조회기간 역순 설정 (종료 < 시작) | "종료일은 시작일보다 이후여야 합니다." |
| 5 | 조회기간 24개월 초과 설정 | "조회기간은 최대 2년까지 설정 가능합니다." |
| 6 | 기간 유형 변경 (월별↔분기별) | 기간 값 초기화 |
| 7 | 업종 미선택 상태에서 다음 클릭 | "업종을 선택해주세요." 에러 |
| 8 | 매체 변경 시 하위 설정 초기화 | products, metrics, targeting 모두 리셋 |
| 9 | 매체 미선택 시 하위 영역 | "매체를 먼저 선택해주세요" 빈 상태 표시 |
| 10 | Step1 조건에 해당하는 광고상품 없음 | "설정한 조건에 해당하는 데이터가 없습니다" 표시 |
| 11 | 타겟팅 카테고리 선택 후 옵션 미선택 | 유효성 실패, 다음 진행 불가 |
| 12 | 타겟팅 옵션에 따른 지표 제외 | 해당 지표 목록에서 사라짐 |
| 13 | 지표 검색 기능 | 입력값으로 실시간 필터링 |
| 14 | Step3 데이터 없음 상태 | totalRows === 0일 때 빈 상태 UI |
| 15 | 생성 요청 중 버튼 비활성화 | "생성 중..." 텍스트, 중복 클릭 방지 |
| 16 | 생성 성공 후 자동 이동 | 2초 후 `/datashot` 목록으로 이동 |
| 17 | 생성 실패 시 에러 토스트 | 에러 메시지 표시, 버튼 재활성화 |
| 18 | 취소 버튼 클릭 | `/datashot`으로 즉시 이동 (확인 없음) |
| 19 | 이전 버튼으로 스텝 이동 | 입력값 유지된 채 이전 스텝 표시 |
| 20 | Client/Agency 역할 직접 URL 접근 | 접근 차단 |
| 21 | 데이터셋명 Enter 키 입력 | 줄바꿈 방지 (preventDefault) |
| 22 | Configuration Summary 실시간 반영 | 입력값 변경 즉시 우측 패널 업데이트 |
| 23 | 0건 예방 정책 | 데이터 존재하는 옵션만 선택지에 표시 |
| 24 | Slot당 Quota 100개 도달 시 | 생성 화면 진입 차단 또는 생성 요청 차단 |
