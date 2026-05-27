# Reach Caster 시나리오 생성 통합 정의서

## 문서 정보
- **작성일**: 2026-05-27
- **버전**: v1.0
- **대상 화면**: 시나리오 생성 위자드 (Step 1 ~ Step 3)
- **관련 컴포넌트**: `CreateScenario.tsx`, `ScenarioStep1.tsx`, `ScenarioStep2RatioFinder.tsx`, `ScenarioStep2ReachPredictor.tsx`

---

## 1. 화면 개요

### 1.1 기능 정의
Reach Caster에서 새 시나리오를 생성하는 3단계 위자드 화면. 기본 정보 입력 → 모듈별 상세 설정 → 검토 및 실행 순서로 진행된다.

### 1.2 진입 경로
- 시나리오 목록 화면(SlotDetail) → "New Scenario" 버튼
- URL: `/reachcaster/scenario/new`

### 1.3 위자드 구조

```
Step 1: 기본 정보 → Step 2: 상세 설정 → Step 3: 검토 및 실행
```

---

## 2. 레이아웃

### 2.1 전체 구조

```
┌──────────────────────────────────────────────────────────────────┐
│  AppLayout (GNB + Sidebar + Breadcrumb)                          │
├──────────────────────────────────────────────────────────────────┤
│  페이지 헤더: "새 시나리오 생성"                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────┐ │ ┌──────────────────────┐             │
│  │ 좌측 (폼 영역)       │ │ │ 우측 (설정 요약)      │             │
│  │ - 스테퍼             │ │ │ Configuration Summary │             │
│  │ - 입력 폼 (800px)    │ │ │ (420px, sticky)       │             │
│  │ - 네비게이션 버튼     │ │ │                      │             │
│  └─────────────────────┘ │ └──────────────────────┘             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**그리드**: `grid-template-columns: 1fr 1px 420px`, gap 48px

### 2.2 스테퍼

| 스텝 | 타이틀 | 설명 |
|------|--------|------|
| 1 | 기본 정보 | 시나리오 기본 설정 |
| 2 | 상세 설정 | 모듈별 특화 설정 |
| 3 | 검토 및 실행 | 설정 확인 및 실행 |

**스타일**: pill 형태, 현재 스텝 primary 배경, 완료 스텝 muted + 체크 아이콘

### 2.3 Breadcrumb

```
SlotBoard > [Slot명] > Reach Caster > 새 시나리오 생성
```

---

## 3. Step 1: 기본 정보

### 3.1 입력 필드

| # | 필드 | 필수 | 타입 | 제한 | 기본값 |
|---|------|------|------|------|--------|
| 1 | 시나리오명 | ✅ | text | 최대 30자 | — |
| 2 | 설명 | ❌ | textarea | 최대 200자 | — |
| 3 | 분석 모듈 | ✅ | 카드 선택 | Ratio Finder / Reach Predictor | — |
| 4 | 브랜드 | ✅ | 드롭다운 (검색) | 등록된 브랜드 목록 | — |
| 5 | 업종 | 자동 | 읽기 전용 | 브랜드 선택 시 자동 매핑 | — |
| 6 | 캠페인 기간 | ✅ | 날짜 범위 | 시작일 ~ 종료일 | — |
| 7 | 타겟 GRP | ✅ | 다이얼로그 (체크박스) | 남성 12개 + 여성 12개 = 24개 | 전체 선택 (24개) |

### 3.2 분석 모듈 카드

| 모듈 | 아이콘 | 설명 |
|------|--------|------|
| Ratio Finder | Scale | TVC와 디지털 매체 간 최적 예산 배분 비율 탐색 |
| Reach Predictor | Target | 광고 집행 전후의 통합 및 개별 매체 도달률 예측 |

### 3.3 브랜드 드롭다운

- 검색 필드 포함 (Search 아이콘)
- 각 항목: 브랜드명 + 업종 뱃지
- 선택 시 업종 자동 세팅

### 3.4 타겟 GRP 다이얼로그

- 남성/여성 섹션 분리
- 4×3 그리드 (12개 연령대)
- 전체 선택/해제 버튼 (섹션별)
- 확인 버튼: "확인 (N개 선택)"

### 3.5 Step 1 유효성 검사

```
isStep1Valid = scenarioName && moduleType && brand && industry 
              && period.start && period.end && targetGrp.length > 0
```

---

## 4. Step 2: 상세 설정 — Ratio Finder

### 4.1 입력 필드

| # | 필드 | 필수 | 타입 | 제한 |
|---|------|------|------|------|
| 1 | 총 예산 | ✅ | number (천 단위 콤마) | > 0 |
| 2 | 시뮬레이션 단위 | ✅ | 버튼 그룹 | 5% / 10% / 20% |
| 3 | 매체 선택 (DIGITAL) | ✅ | 체크박스 | 최소 1개 |
| 4 | 매체 선택 (TVC) | ✅ | 체크박스 | 최소 1개 |
| 5 | 매체 비중 (%) | ✅ | number | 카테고리별 합 = 100% |
| 6 | 상품/채널 선택 | ✅ | 다이얼로그 | 매체당 최소 1개 |
| 7 | 상품/채널 비중 (%) | ✅ | number | 매체별 합 = 100% |

### 4.2 매체 카테고리 탭

| 탭 | 매체 목록 |
|---|---|
| DIGITAL | Google Ads, Meta, NAVER 보장형 DA, NAVER 성과형 DA, kakao 모먼트, TargetPick, TikTok |
| TV | CJ ENM, 지상파, 종편 |

### 4.3 비율 자동 균등 분배

매체/상품 추가·제거 시 자동 균등 분배 적용.
상세 정책: `RatioFinder_AutoDistribution_Spec.md` 참조

### 4.4 유효성 검사

상세 정책: `RatioFinder_Step2_Validation_Spec.md` 참조

### 4.5 Step 2 (Ratio Finder) 유효성 조건

```
isStep2Valid (Ratio Finder) =
  totalBudget > 0
  && simulationUnit 선택됨
  && DIGITAL 매체 ≥ 1개
  && TVC 매체 ≥ 1개
  && 모든 매체에 상품 ≥ 1개
  && 매체 비중 0% 항목 없음
  && 상품 비중 0% 항목 없음
  && 매체별 상품 비중 합 = 100%
  && DIGITAL 매체 비중 합 = 100%
  && TVC 매체 비중 합 = 100%
```

---

## 5. Step 2: 상세 설정 — Reach Predictor

### 5.1 입력 필드

| # | 필드 | 필수 | 타입 | 제한 |
|---|------|------|------|------|
| 1 | 매체·상품 추가 | ✅ | 다이얼로그 | 최소 1개 |
| 2 | 매체별 예산 | ✅ | number | > 0 |
| 3 | 매체별 노출 수 | 조건부 | number | 미연동 매체만 필수 |
| 4 | CPM | 자동 | 계산값 | (예산 / 노출) × 1000 |
| 5 | 개별 기간 | ❌ | 날짜 범위 | 매체별 오버라이드 |
| 6 | 개별 타겟 | ❌ | 체크박스 | 매체별 오버라이드 |
| 7 | 리치커브 구간 (최소) | ✅ | number | > 0 |
| 8 | 리치커브 구간 (최대) | ✅ | number | > 최소값 |
| 9 | 리치커브 기준 | ✅ | 라디오 | 구간 수 / 구간별 금액 |
| 10 | 구간 수 | 조건부 | number | 2~20 (구간 수 기준 선택 시) |
| 11 | 구간별 금액 | 조건부 | number | > 0, 결과 구간 ≤ 20개 (금액 기준 선택 시) |

### 5.2 매체 유형

| 유형 | 설명 | 노출 수 |
|------|------|---------|
| 연동 (linked) | 플랫폼 API 연동 매체 (Google, Meta 등) | 자동 계산 |
| 미연동 (unlinked) | 직접 입력 매체 (SMR, 쿠팡 등) | 수동 입력 필수 |

### 5.3 매체 추가 다이얼로그

- DIGITAL / TVC 탭 분리
- 연동 매체: 매체 > 상품 2depth 선택
- 미연동 매체: 단일 선택 (상품 구분 없음)
- 검색 필터 지원

### 5.4 개별 설정 (매체별 오버라이드)

- **개별 기간**: Step 1에서 설정한 기간과 다른 기간 적용 가능
- **개별 타겟**: Step 1에서 설정한 타겟과 다른 타겟 적용 가능
- 일괄 적용 도구: DIGITAL 매체 전체에 동일 기간/타겟 일괄 세팅

### 5.5 리치커브 설정

| 기준 | 설명 | 제한 |
|------|------|------|
| 구간 수 기준 | 최소~최대 범위를 N등분 | 2~20개 |
| 구간별 금액 기준 | 일정 금액 간격으로 구간 생성 | 결과 구간 ≤ 20개 |

### 5.6 Step 2 (Reach Predictor) 유효성 조건

```
isStep2Valid (Reach Predictor) =
  매체 ≥ 1개
  && 모든 매체 예산 > 0
  && 미연동 매체 노출 수 > 0
  && 리치커브 구간 최소값 > 0
  && 리치커브 구간 최대값 > 0
  && 최소값 < 최대값
  && (금액 기준 선택 시) 구간별 금액 > 0
  && (금액 기준 선택 시) 결과 구간 수 ≤ 20
```

---

## 6. Step 3: 검토 및 실행

### 6.1 화면 구성

- Step 1~2에서 입력한 모든 설정을 요약 표시
- 예상 소요 시간 안내: "약 20분 소요"
- 자동 확인 처리 (Step 3 진입 시 `isConfirmed = true`)

### 6.2 실행 버튼

| 상태 | 동작 |
|------|------|
| 클릭 | API 호출 (1초 시뮬레이션) |
| 성공 | 토스트: "시나리오 생성 요청이 완료되었습니다. 완료 시 알림 센터에서 알려드립니다." → 2초 후 `/reachcaster`로 이동 |
| 실패 | 토스트: "시나리오 생성 요청에 실패했습니다. 다시 시도해주세요." |
| 로딩 중 | 버튼 비활성화 + 스피너 |

---

## 7. Configuration Summary (우측 패널)

### 7.1 위치 및 스타일

- 너비: 420px
- `position: sticky; top: 32px`
- 모든 스텝에서 실시간 반영

### 7.2 표시 항목

| 섹션 | 항목 |
|------|------|
| 기본 정보 | 시나리오명, 분석 모듈, 브랜드/업종, 기간, 타겟 GRP |
| Ratio Finder | 총 예산, 시뮬레이션 단위, 선택 매체 수, 매체별 비중 |
| Reach Predictor | 매체 수, 총 예산(합산), 리치커브 구간 |

### 7.3 미입력 항목 표시

- 미입력 필드: `—` 또는 placeholder 텍스트
- 입력 완료 필드: 실제 값 표시

---

## 8. 유효성 검사 정책

### 8.1 활성화 시점

유효성 메시지는 **사용자가 첫 입력을 시작한 후**부터 표시 (Lazy Validation).

**활성화 조건** (`validationActive`):
```
scenarioName 입력 || description 입력 || moduleType 선택 || brand 선택
|| period 입력 || targetGrp 변경 (24개 아닌 경우) || totalBudget 입력
|| simulationUnit 선택 || 매체 선택
```

### 8.2 네비게이션 제어

| 버튼 | 조건 |
|------|------|
| 다음 (Step 1→2) | `isStep1Valid()` = true |
| 다음 (Step 2→3) | `isStep2Valid()` = true |
| 이전 | 항상 활성 |
| 실행 (Step 3) | `isConfirmed` = true |

### 8.3 에러 메시지 스타일

| 속성 | 값 |
|------|-----|
| fontSize | 11px |
| color | `hsl(var(--destructive))` |
| marginTop | 4~8px |
| border 변경 | 해당 input borderColor → `hsl(var(--destructive))` |

---

## 9. 데이터 구조

### 9.1 ScenarioFormData

```typescript
interface ScenarioFormData {
  // Step 1
  scenarioName: string          // 최대 30자
  description: string           // 최대 200자
  moduleType: 'Ratio Finder' | 'Reach Predictor' | ''
  brand: string
  industry: string              // 브랜드 선택 시 자동
  period: { start: string; end: string }
  targetGrp: string[]           // 기본값: 전체 24개

  // Ratio Finder (Step 2)
  totalBudget?: number
  simulationUnit?: '5%' | '10%' | '20%' | ''

  // Reach Predictor (Step 2)
  reachCurve?: {
    budgetCap?: number
    detailSettings?: {
      rangeMin?: number
      rangeMax?: number
      criteriaType?: 'count' | 'amount'
      intervalCount?: number
      intervalAmount?: number
    }
  }
}
```

### 9.2 ReachPredictorMedia

```typescript
interface ReachPredictorMedia {
  id: string
  category: 'DIGITAL' | 'TVC'
  type: 'linked' | 'unlinked'
  mediaName: string
  productName?: string
  budget: string
  impressions: string
  cpm: string                   // 자동 계산
  customPeriod?: { start: string; end: string }
  customTarget?: string[]
}
```

---

## 10. 지원 매체 목록

### 10.1 DIGITAL (연동)

| 매체 | 상품 수 |
|------|---------|
| Google Ads | 31개 |
| Meta | 58개 |
| NAVER 보장형 DA | 30개 |
| NAVER 성과형 DA | 34개 |
| kakao 모먼트 | 13개 |
| TargetPick | 9개 |
| TikTok | 44개 |

### 10.2 TV (연동)

| 매체 | 채널 수 |
|------|---------|
| CJ ENM | 11개 |
| 지상파 | 3개 |
| 종편 | 4개 |

### 10.3 미연동 매체 (Reach Predictor 전용)

SMR, 11번가, CJ ONE, L.POINT, OK캐쉬백, SOOP, X(구.트위터), 골프존, 네이트, 넷플릭스, 다나와, 당근, 리멤버, 마이클, 배달의민족, 블라인드, 스노우, 스카이스캐너, 알바몬, 에브리타임, 에이블리, 엔카, 오늘의집, 웨이브, 잡코리아, 직방, 치지직, 카카오 T, 카카오뱅크, 카카오페이, 카카오페이지, 쿠팡, 토스, 티맵, 티빙, 페이코, 해피포인트 (총 37개)

---

## 11. 인터랙션 플로우

### 11.1 정상 플로우

```
1. "New Scenario" 클릭 → 위자드 진입
2. Step 1: 기본 정보 입력 → "다음" 클릭
3. Step 2: 모듈별 상세 설정 → "다음" 클릭
4. Step 3: 설정 검토 → "실행" 클릭
5. API 호출 → 성공 토스트 → 시나리오 목록으로 이동
```

### 11.2 이탈 방지

- 현재 미구현 (향후: 입력 중 페이지 이탈 시 확인 다이얼로그)

---

## 12. 향후 개선 사항

### 12.1 단기
- [ ] 페이지 이탈 방지 (unsaved changes 경고)
- [ ] 시나리오 임시 저장 (Draft)
- [ ] Step 간 애니메이션 전환

### 12.2 중기
- [ ] 시나리오 복제 (기존 시나리오 기반 생성)
- [ ] 시나리오 템플릿
- [ ] 매체 즐겨찾기

### 12.3 장기
- [ ] AI 기반 설정 추천 (업종/브랜드 기반 자동 세팅)
- [ ] 실시간 예상 결과 미리보기

---

## 13. 참고 자료

### 13.1 관련 컴포넌트
- `src/components/reachcaster/CreateScenario.tsx` — 위자드 메인 컨테이너
- `src/components/scenario/ScenarioStep1.tsx` — Step 1 폼
- `src/components/scenario/ScenarioStep2RatioFinder.tsx` — Step 2 (Ratio Finder)
- `src/components/scenario/ScenarioStep2ReachPredictor.tsx` — Step 2 (Reach Predictor)
- `src/components/scenario/ReachPredictorMediaDialog.tsx` — 매체 추가 다이얼로그
- `src/components/scenario/types.ts` — 타입 정의
- `src/components/scenario/constants.ts` — 매체/브랜드/타겟 상수

### 13.2 관련 스펙
- `RatioFinder_Step2_Validation_Spec.md` — Step 2 유효성 검사 상세
- `RatioFinder_AutoDistribution_Spec.md` — 비율 자동 균등 분배 정책
- `Reach_Caster_Result_Screens_Spec.md` — 결과 화면 정의
- `Scenario_List_Screen_Spec.md` — 시나리오 목록 화면
