# DataShot 고도화 — 광고상품 기준 화면 정의서

> 목적: 화면 동작·규칙·기획 의도 정의서 (프론트 구현 참조 + 제품 Docs 원천 + TC 생성 베이스)
> 버전: v1.0
> 작성일: 2026-10-07
> 상태: **구현 완료(목록·생성·조회)**. 이번 고도화의 관리 문서. 배포 완료 후 아래 기존 Spec에 섹션 단위로 병합한다.
> 병합 대상:
> - `plan/spec/DataShot_DatasetList_Spec.md` (§1 데이터셋 목록 변경분)
> - `plan/spec/DataShot_CreateDataset_Spec.md` (§2 데이터셋 생성 변경분)
> - `plan/spec/DataShot_DatasetDetail_Spec.md` (§3 데이터셋 상세/결과 변경분)
> 기준: 본 소스(`CreateDataset.tsx`, `CreateDatasetStep2.tsx`, `DatasetResult.tsx` 등) 구현을 단일 진실 공급원으로 삼는다. (구현 컴포넌트 맵 §6.1)
> 참조 정책: `DataShot_CreateDataset_Spec.md` v2.1, `DataShot_DatasetDetail_Spec.md` v2.0

---

## 변경 이력

> **이력 기준선(2026-10-07)**: 아래 v1.0을 "현재 최종본" 기준선으로 삼는다. 이후 변경은 이 표에 v1.1, v1.2… 로 **계속 누적**한다. (v1.0 이전의 단계별 작업 기록은 기준선으로 통합하며 더 추적하지 않는다.)

| 버전 | 일자 | 변경 내용 |
|---|---|---|
| v1.0 | 2026-10-07 | **최종본 기준선.** 광고상품 추출 기준 고도화 전 범위(목록·생성·조회) 구현 완료 상태를 단일 기준으로 확정. 조회(상세) 화면 최종 상태: ① 업종은 대분류만 제공 — 결과 차트 업종 드롭다운·Extracted Table에서 업종(중) 폐지(§3.1·§3.2). ② 결과 차트 제공 조건 = 상품 3개 이상(매체 수 무관), 단일 매체 업종은 '매체' 뷰 토글 비활성, Benchmark 안내 툴팁 축약(§3.1). ③ 헤더 — 요약 항목 **매체·광고상품 병합**("N개 · N개") + 돋보기 상세 모달, 공유는 **Excel 다운로드**, 더보기 복제(생성 화면으로 옵션 프리필·이름 앞 "(복사)")·이동(Slot 선택 다이얼로그)·삭제(§3.0). ④ Extracted Table 데이터 한도 경고 문구를 "파일 다운로드"로 중립화. 조건 조합 상세 화면(`DatasetDetail`)은 변경하지 않음. |
| v1.1 | 2026-10-07 | **결과 차트 정의 분리.** §3.1 Benchmark Analytics 차트 2종 상세를 별도 문서 `DataShot_ResultCharts_Spec.md`로 분리(정의 비대화 해소). §3.1은 요약 + 참조로 축소. 분리하며 **차트 2(Efficiency Map) 재설계** 확정: 클릭/조회 탭(비율×단가), X축 정방향(왼쪽=저렴)·효율 영역 좌상, 선택 평균 기준선(업종 평균 아님), 효율 포인트 1개 그린(이상점 거리² 최소·반응 우선 타이브레이커), 틴트/라벨 절제, 탭 활성·엣지 규칙. (차트2는 구현 예정) |
| v1.2 | 2026-10-07 | **외부 솔루션 → DataShot 유입 CTA 신설(§7).** Reach Caster 결과 화면(Reach Predictor·Ratio Finder) 하단에 "DataShot으로 벤치마크 확인하기" CTA 존 추가. 기존 하단의 ghost 링크 버튼을 BO 결과 화면과 동일한 맥락형 CTA 존(제목 → 설명 → primary pill 버튼)으로 교체. 세션 맥락(업종)을 제목에 프리필해 솔루션 간 연속성 확보. 구현 완료(`ReachPredictorResult.tsx`, `RatioFinderResult.tsx`). |
> **운영 메모**: 각 변경 항목에는 "병합 대상 문서 + 위치"를 달아, 배포 후 기존 Spec으로 섹션을 그대로 옮길 수 있게 한다.

---

## 0. 고도화 개요

### 0.1 목적

DataShot 데이터셋 생성·조회를 **"광고상품 기준 다매체 추출"**로 확장한다.
기존은 단일 매체 기준으로 조회 조건을 조립했으나, 이번 고도화는 **여러 매체를 한 번에 선택하고 매체별 광고상품·지표를 조합**해 추출할 수 있게 한다. 결과 화면에는 매체·상품 단위 비교를 돕는 **차트 2종**을 추가한다.

- **왜 "광고상품 기준"인가**: 사용자는 매체 하나하나의 저수준 옵션보다, "어떤 광고상품에 얼마를 쓰고 어떤 효율이 났나"를 상품 단위로 비교하고 싶어 한다. ReadySet 표준 광고상품을 축으로 삼으면 매체를 가로질러 비교가 가능해진다.
- **왜 "추출 기준" 택1을 두나**: 기존 조건 조합 방식을 쓰고 싶은 사용자도 있다. 그래서 진입점에서 `광고상품`(정돈된 표준 상품 기준) / `조건 조합`(기존 세밀 조합)을 **택1**하게 해, 기존 플로우를 보존하면서 새 플로우를 추가한다.

### 0.1.1 문서 활용처

- **개발 참고**: 프론트엔드 구현 시 화면 동작·규칙·표기 기준. 각 변경 항목에 구현 파일을 명시(§6.1).
- **제품 Docs**: 본 정의서의 기능 설명·의도가 사용자 대상 기능 문서의 기반이 됨.
- **AI 기반 TC 생성**: 유효성 규칙(§2.6 V1~V18)·표시 규칙이 테스트 케이스 원천. 각 규칙은 `조건 → 기대 결과`로 검증 가능하게 작성.

### 0.1.2 대상 화면 · 진입 경로

| 화면 | URL | 진입 경로 | 진입 조건 | 접근 권한 |
|---|---|---|---|---|
| 데이터셋 목록 | `/datashot` | GNB/슬롯 → DataShot | — | Admin, Marketer, Client, Agency |
| 데이터셋 생성 | `/datashot/new` | 목록 → "New Dataset" | — | Admin, Marketer |
| 데이터셋 상세(조회) | `/datashot/:id` | 목록 → Completed 행 클릭 | 상태 `Completed` | 전 역할 조회 |

- 상세는 클릭 시 `navigate(state: { datasetData, slotData })`로 데이터를 넘기고, `DatasetDetailRouter`가 `extractMode`로 분기(§3.0).

### 0.1.3 화면 구조 (고도화 범위 세로 흐름)

```
[목록]  … 매체 · 업종 · 조회기간 · 지표 구성 · [추출 기준]★ · 상태 …

[생성]  Step1 기본정보(+추출 기준·업종)
        → Step2 상세설정 (조건 조합: 기존 / 광고상품: 매체·상품 → 상세 조건 → 지표)
        → Step3 검토·추출 (미리보기 + 샘플 모달)
        우측: Configuration Summary (extractMode별 분기)

[상세]  extractMode='product' → DatasetResult
          헤더(데이터셋 메타) → Benchmark Analytics(차트 2종) → Extracted Data(테이블)
        그 외 → 기존 DatasetDetail
```

### 0.2 범위 (In / Out)

- **In**: ① 데이터셋 목록(추출 기준 컬럼·매체 표시 분기) ② 생성 Step1(추출 기준 선택·업종 노출/제약) ③ 생성 Step2 광고상품 분기(다매체·상품·상세 조건·지표) ④ 우측 요약 ⑤ 데이터셋 상세 결과 상단 차트 2종 + 목록→상세 분기
- **Out**: (없음)

### 0.3 변경점 요약 (한눈에)

| # | 영역 | 기존 | 고도화 | 이유 | 병합 대상 |
|---|---|---|---|---|---|
| C0 | 목록 컬럼 | 매체 단일 표시 | **추출 기준 컬럼** 신설(`광고상품`/`조건 조합`) + 매체 표시 분기(광고상품=N개 매체) | 두 추출 방식 구분·식별 | DatasetList_Spec |
| C1 | 추출 기준 | (없음) | **Step1**(조회기간 아래·업종 위)에 `광고상품`/`조건 조합` **택1** | 뒤 단계를 가르는 최상위 분기라 먼저 결정 | CreateDataset_Spec |
| C2 | 매체 선택 | 단일 매체 | **다매체 + 매체별 상품** 선택 | 상품 단위 교차 비교 | CreateDataset_Spec |
| C3 | 상품 선택 | 매체 하위 광고분류 | **상품 선택 다이얼로그**(RatioFinder UI 차용) | 학습된 인터랙션 재사용 | CreateDataset_Spec |
| C4 | 지표 | 매체별 지표 | 매체 2개↑일 때 **공통 지표**만 제공 | 매체 간 비교 가능한 지표로 수렴 | CreateDataset_Spec |
| C5 | 우측 요약 | 단일 매체 요약 | **다매체/매체별 상품 수** 요약 | 다매체 설정 가시화 | CreateDataset_Spec |
| C6 | Step3 검토 | 기존 미리보기 | 매체×상품 조합 행 + 선택 지표 컬럼 | 추출 결과 형상 사전 확인 | CreateDataset_Spec |
| C7 | 상세 결과 상단 | 테이블 중심 | **차트 2종**(광고비 도넛 + CTR×CPC 산점도), 업종 필터 공통 | 매체·상품 비교 인사이트 | DatasetDetail_Spec |
| C8 | 목록→상세 분기 | 단일 상세 화면 | `extractMode`별 분기(광고상품=다매체 결과 / 조건 조합=기존 상세) | 추출 방식에 맞는 분석 뷰 | DatasetDetail_Spec |
| C9 | 변경 시 초기화 | — | 추출기준↔업종, 매체수↔지표 전환 시 **확인 다이얼로그**로 초기화 | 입력 손실(파괴적)에 사전 동의 | CreateDataset_Spec |
| C10 | 유입 동선 | Reach Caster 결과 하단 ghost 링크 | Reach Caster 결과 하단 **맥락형 CTA 존**(제목→설명→primary pill)으로 교체, 업종 프리필 | 솔루션 간 단일 세션 연속성·DataShot 유입 강화 | ReachCaster_Result_Spec |

> 참고: 변경점 ID는 추적용 임의 번호(C0~C9)이며, 정렬·연속성만 위한 것이다.

> 각 항목 상세는 아래 §1(목록)·§2(생성)·§3(상세)에서 다룬다.

---

## 1. 데이터셋 목록 변경분 (C0) → `DataShot_DatasetList_Spec.md` 에 병합

> 상태: **구현 완료** (`DatasetList.tsx`, `types.ts`). 아래는 확정된 동작.

### 1.0 컬럼 순서 (변경 후)

```
체크박스 · ID · 데이터셋명 · 매체 · 업종 · 조회 기간 · 지표 구성 · [추출 기준]★ · 상태 · 생성자 · 생성일시 · ⋮
```
- ★ = 신규 컬럼. "지표 구성" 바로 뒤에 배치. 기존 컬럼 순서/정렬 동작은 그대로 유지.

### 1.1 추출 기준 컬럼 신설

목록 테이블의 **"지표 구성" 컬럼 뒤**에 "추출 기준" 컬럼을 신설한다. (사용자가 훑는 순서상 식별→데이터 범위(매체·업종·기간)→추출 성격(추출 기준·지표 구성) 흐름에 맞춰, 추출 성격 묶음의 앞에 배치)

- **왜 추가하나**: 고도화로 데이터셋 추출 방식이 두 갈래(광고상품 / 조건 조합)로 나뉜다. 목록에서 각 데이터셋이 어느 방식으로 뽑혔는지 한눈에 식별해야, 사용자가 결과 형상(단일 매체 vs 다매체)을 예측하고 들어갈 수 있다.
- **표시 값** (두 케이스 모두 노출):
  - `광고상품` — 추출 기준이 광고상품인 데이터셋
  - `조건 조합` — 기존 방식(조건을 조합해 추출). 기존 데이터와 동일
- **정렬·필터**: 미지원. (추출 기준 컬럼은 식별용 표시 전용)

### 1.2 매체 표시 분기

"매체" 컬럼은 추출 기준에 따라 표시가 달라진다.

- `광고상품`: 복수 매체 선택이 가능하므로 **"N개 매체"**로 요약 표시 (예: `3개 매체`). N은 선택된 매체 수(`mediaCount`).
- `조건 조합`: 기존과 동일하게 **단일 매체명** 1개를 표시 (예: `Google Ads`).
- **왜 분기하나**: 광고상품은 매체를 가로지르는 다매체 추출이라 매체명 하나로 대표할 수 없다. 개수 요약이 "여러 매체를 묶었다"는 사실을 정확히 전달한다.

### 1.3 업종 제약 (참고)

광고상품 기준은 **대분류 업종만** 선택 가능하다. 따라서 목록의 광고상품 데이터셋은 업종 분류 레벨이 항상 대분류(`industryLevel: 'major'`)다. (업종 표시 함수 자체는 기존과 공유 — 레벨·개수 그대로 표기)

### 1.4 데이터 모델 (목록)

| UI 용어 | 데이터 필드 | 비고 |
|---|---|---|
| 추출 기준 | `extractMode?: 'product' \| 'condition'` | 미지정 시 `condition`(기존 데이터 하위 호환) |
| 매체(광고상품) | `mediaCount?: number` | 선택된 매체 수. "N개 매체" 표시용 |
| 매체(조건 조합) | `media: string` | 단일 매체명 |

### 1.5 유효성 / 검증 포인트 (목록)

| # | 조건(입력) | 기대 결과 |
|---|---|---|
| L1 | `extractMode === 'product'` | 추출 기준 셀에 `광고상품` 표시 |
| L2 | `extractMode !== 'product'`(미지정 포함) | 추출 기준 셀에 `조건 조합` 표시 |
| L3 | `extractMode === 'product'`, `mediaCount = 3` | 매체 셀에 `3개 매체` 표시 |
| L4 | `extractMode === 'condition'`, `media = 'Google Ads'` | 매체 셀에 `Google Ads` 표시 |
| L5 | `extractMode` 미지정(기존 데이터) | 추출 기준 셀에 `조건 조합` 표시 (하위 호환) |
| L6 | `extractMode === 'product'` 데이터 | 업종 분류 레벨이 항상 대분류(`industryLevel: 'major'`) |

---

## 2. 데이터셋 생성 변경분 → `DataShot_CreateDataset_Spec.md` 에 병합

> 기존 §2(레이아웃)~§5(단계별 상세) 사이에 "추출 기준 분기" 개념을 추가하고, Step2 상세를 교체·확장한다.

### 2.0 전체 구조 (추출 기준 분기 흐름)

```
Step1 (기본 정보)
 ├─ 데이터셋명
 ├─ 지표 구성 (종합/성과)
 ├─ 조회기간
 ├─ 추출 기준 ★신규  [광고상품 | 조건 조합] 택1
 └─ 업종              ← 추출 기준 선택 후에만 노출 / 광고상품이면 대분류만

Step2 (상세 설정) — 추출 기준에 따라 분기
 ├─ extractMode='condition' → 기존 CreateDatasetStep2 (매체 단일 → 광고분류 → 타겟팅 → 지표)
 └─ extractMode='product'   → CreateDatasetStep2Product ★신규
       ├─ 매체 · 광고상품 (다매체 체크 + 매체별 상품 다이얼로그)
       │    └─(구분선, 매체 선택 후)
       ├─ 상세 조건 (선택, 매체 1개일 때만)
       │    ├─ 협력 광고 파트너사 (Meta 전용)
       │    └─ 타겟팅 옵션
       │    └─(구분선)
       └─ 지표 (매체 1개=매체 지표 / 2개↑=공통 지표)

Step3 (검토 및 추출)  ← extractMode별 분기(§2.5)

우측: Configuration Summary (BASIC INFORMATION / QUERY SETTINGS / REVIEW)
       └ extractMode별 QUERY SETTINGS 분기
```

- 분기 책임: `CreateDataset.tsx`가 `currentStep===2`에서 `formData.extractMode==='product'`면 `CreateDatasetStep2Product`, 아니면 `CreateDatasetStep2` 렌더.

### 2.1 추출 기준 선택 (C1)

> 상태: **구현 완료** (`CreateDatasetStep1.tsx`, `createDatasetTypes.ts`, `CreateDataset.tsx`). 추출 기준은 Step1에 배치.

- **배치 위치**: Step1(기본 정보)의 **조회기간 블록 아래 · 업종 블록 위**.
- **왜 Step1인가**: 추출 기준은 이후 전 단계(매체·업종·지표)의 선택지를 가르는 **최상위 분기**다. 가장 먼저 정해야 뒤 입력이 일관되므로, 기본 정보 단계에서 결정한다. (조회기간 다음, 업종 앞에 둬서 "범위를 정하기 직전에 추출 방식을 먼저 고른다"는 흐름)
- **선택지**: `광고상품` / `조건 조합` **택1** (아이콘 + 제목 + 2줄 설명 카드, Step1 "지표 구성"과 동일한 택1 버튼 패턴). 필수 항목(미선택 시 다음 단계 불가).
  - 카드 설명(개행 포함): 광고상품 = "ReadySet 표준 광고상품 기준으로 정돈된 성과 데이터를 추출 ⏎ (업종 대분류만 선택 가능)", 조건 조합 = "매체별 상세 옵션을 직접 조합해 세밀하게 데이터를 추출 ⏎ (업종 대·중분류 선택 가능)".
  - 상단 안내 문구: "데이터를 어떤 기준으로 추출할지 선택하세요. 선택한 기준에 따라 설정할 업종·매체·지표 항목이 달라집니다."
- **버튼 동작**: 같은 버튼을 다시 눌러도 아무 변화 없음(동일 값이면 무시). 다른 버튼을 누르면 전환하되, 아래 "기준 변경 시 초기화" 규칙을 거친다.
- **분기 효과**: `조건 조합` → 기존 매체·광고분류·지표 플로우 / `광고상품` → 다매체·상품·지표 플로우.
- **업종 블록 노출 제어**: 추출 기준이 **선택되기 전에는 업종 블록을 숨긴다.** 선택되면 바로 아래에 업종 블록이 나타난다. (추출 기준이 업종 선택 가능 레벨을 결정하므로, 순서를 강제)
- **업종 레벨 제약**:
  - `광고상품` → 업종 **대분류만** 선택 가능
  - `조건 조합` → 업종 **대분류·중분류** 선택 가능
  - **다이얼로그 반영**: 업종 선택 다이얼로그(`IndustryDialog`)에 추출 기준을 전달해, `광고상품`이면 **"중분류" 분류 레벨 토글을 비활성화**(disabled)한다. 토글 아래 안내 문구 표시: "추출 기준이 광고상품인 경우 대분류 업종만 선택할 수 있습니다."
- **기준 변경 시 초기화 (중분류만, 사전 확인)**: 추출 기준을 바꿀 때,
  - `광고상품`으로 바꾸는데 현재 선택 업종이 **중분류**(`industryLevel === 'mid'`)이고 1개 이상이면 → 즉시 바꾸지 않고 **확인 다이얼로그**를 띄운다.
    - 다이얼로그 제목: "선택한 업종 초기화"
    - 본문: "광고상품 기준은 대분류 업종만 선택할 수 있습니다. 변경하면 선택한 업종이 초기화됩니다. 계속 진행하시겠습니까?"
    - **변경** 선택 시 → `extractMode = 'product'` + 업종 초기화(`industries: []`, `industryLevel: null`)
    - **취소** 선택 시 → 아무것도 바뀌지 않음(추출 기준도 그대로)
  - 현재 선택이 **대분류**이거나 선택 업종이 없으면 → 확인 없이 **즉시 변경**(잃을 입력이 없음).
  - **왜 확인 다이얼로그인가**: 업종 초기화는 사용자 입력을 잃는 **파괴적 동작**이다. 사후 통보(토스트)로는 되돌릴 수 없으므로, 진행 전 사전 동의를 받는다. (`IndustryDialog`의 분류 레벨 변경 확인·삭제 확인과 동일한 패턴)
- **알림 방식**: 플랫폼 표준 **확인 다이얼로그**(`dialog-overlay > dialog-content`) 사용. CreateDataset이 다이얼로그를 렌더하고, Step1은 `onConfirmResetForProduct()` 콜백으로 상위에 확인을 요청한다.
- **유효성**: 추출 기준은 Step1 진행 필수 조건에 포함(`isStep1Valid`). 미선택 시 "추출 기준을 선택해주세요." 에러 표시 + 다음 버튼 비활성.
- **용어**: 생성 폼 `extractMode` 값은 `'product' | 'condition' | ''`(미선택). 목록과 동일하게 `'condition'` 사용("상세 옵션"/`'detail'` 폐기).

### 2.2 매체·상품 선택 (광고상품 기준) (C2·C3)

> 상태: **구현 완료** (`CreateDatasetStep2Product.tsx`, `MediaProductSelect.tsx`, `ProductDialog.tsx`). 광고상품 기준일 때 Step2를 `CreateDatasetStep2Product`로 분기.

- **매체 목록**: `Google Ads`, `Meta`, `kakao모먼트`, `NAVER 성과형 DA`, `NAVER 보장형 DA`, `TikTok` (6종, TVING·당근 제외).
- **매체 선택**: 체크박스로 다매체 선택. 선택 시 "상품 추가" 버튼 노출, 선택 상품 수 뱃지 표시.
- **상품 선택 다이얼로그** (`ProductDialog`, RatioFinder 상품 선택 UI 차용, 비중/예산 제외):
  - 상단에 "Step1에서 선택한 기간·업종의 집행 데이터가 있는 상품만 표시됩니다." 안내 박스 표시.
  - 상품 소스: `scenario/constants`의 `mediaData.DIGITAL`. DataShot 매체명 ↔ 키 표기 차이는 공백 제거 정규화로 보정.
  - 검색: 상품명 **부분 일치(substring)**, **대소문자 무시**, onChange 실시간(디바운스 없음), 공백 트리밍 없이 입력 그대로 비교.
  - 전체 선택/해제: **검색 필터 결과(filteredProducts) 기준**. 필터된 상품이 모두 선택돼 있으면 "전체 해제"(필터 결과만 해제, 그 외 선택은 유지), 아니면 "전체 선택"(기존 선택 + 필터 결과 합집합).
  - 선택 카운트: "선택됨: {선택 수}/{전체 상품 수}" 표기(검색과 무관하게 전체 기준).
  - 결과 없음: 전체 상품 0개면 "등록된 상품이 없습니다", 검색 결과 0개면 "검색 결과가 없습니다".

- **매체·상품 선택 인터랙션 세부** (추측 방지):
  - **매체 체크 ON**: `mediaProducts[media] = []`(빈 상품 배열로 등록). "상품 추가" 버튼 + 빈 상태 힌트("'상품 추가' 버튼을 클릭하여 상품을 추가하세요") 노출.
  - **매체 체크 OFF**: 해당 매체 키를 제거 → **그 매체의 선택 상품도 함께 삭제**(연관 데이터 제거).
  - **상품 다이얼로그 열기**: 해당 매체의 기존 선택 상품을 다이얼로그에 **복원**(이전 상태 유지), 검색어는 초기화.
  - **다이얼로그 확인**: 선택 상품으로 해당 매체 상품을 **덮어쓰기**(`handleConfirm`). 확인 후 다이얼로그 닫힘.
  - **다이얼로그 취소/오버레이 클릭/닫기**: 변경 **폐기**(해당 매체 상품은 열기 전 상태 그대로).
  - **개별 상품 제거(X)**: 리스트에서 해당 상품만 제거(다이얼로그 거치지 않음).
  - 상품 수 뱃지: "상품 추가" 버튼에 선택 상품 수를 뱃지로 표기(0개면 미표기).
- **상세 조건 그룹** (협력 파트너사 + 타겟팅을 묶는 선택 섹션):
  - 매체·광고상품(필수)과 지표(필수) 사이에 **"상세 조건"** label 섹션으로 분류. 별도 설명 문구 없음(label만).
  - 매체가 **정확히 1개**일 때만 노출. 내부 순서: (Meta면)협력 파트너사 → 타겟팅.
- **타겟팅/협력 파트너사 옵션** (조건 조합의 `TargetingSelector` 재사용):
  - 매체가 **정확히 1개**일 때만, 그 매체의 타겟팅 옵션(또는 협력 광고 파트너사)을 노출.
  - 매체가 **2개 이상**이면 타겟팅 섹션을 숨긴다. (매체 간 타겟팅 체계가 달라 공통 적용 불가)
  - 매체 수가 1개가 아니게 바뀌면 선택된 타겟팅 값(`targetingCategory`/`targetingOptions`)과 협력 파트너사를 초기화한다.
- **협력 광고 파트너사** (Meta 단일 선택 전용, `CollaborativePartnerSelect`):
  - Meta를 1개만 선택했을 때 **타겟팅 섹션 위**에 "협력 광고 파트너사"(아코디언 + 검색 + 전체선택 + 체크박스)를 노출. 옵션 소스는 조건 조합과 동일(`adProductStructureByMedia['Meta'].collaborativePartner`).
  - **기본 아코디언 닫힘** (선택 항목). 타겟팅 옵션도 동일하게 기본 닫힘. 단, **이미 선택값이 있으면 기본 열림**(파트너사 선택 있음 / 타겟팅은 카테고리·옵션 있음) — 스텝 이동 후 재진입 시 열림 유지(formData 기준).
  - **광고상품 미선택 시**: 아코디언 헤더는 유지하되 펼친 콘텐츠에 "광고상품을 먼저 선택해주세요." 안내만 노출(선택 불가).
  - **선택 상품에 데이터 있는 파트너사만 노출**: 선택한 광고상품에 집행 데이터가 있는 파트너사만 표시(여러 상품은 합집합). 현재는 상품명 해시 기반 결정적 서브셋(같은 상품엔 항상 같은 목록)으로 산출하며, 실데이터 연동 시 백엔드가 데이터 유무로 필터한다. 노출 목록에서 빠진 선택 파트너사는 자동 해제.
  - **상호 배제(조건 조합과 동일)**: 파트너사 선택 시 타겟팅의 "기기유형" 비활성화 / 기기유형 선택 중 + 파트너사 미선택이면 파트너사 아코디언 잠금.
  - 데이터 모델: `FormData.productCollaborativePartners: string[]`.
- **데이터 모델**: `FormData.mediaProducts: { [media]: string[] }`. 타겟팅은 조건 조합과 공유하는 `targetingCategory`/`targetingOptions` 재사용.
- **유효성**: 선택한 **모든 매체가 상품 1개 이상**이어야 통과.
  - 매체 미선택: "최소 1개 이상의 매체를 선택해주세요."
  - 상품 0개 매체(매체별): "{매체}: 최소 1개 이상의 상품을 선택해주세요."

### 2.3 지표 선택 (C4)

> 상태: **구현 완료** (`MetricSelect.tsx`). 매체 선택 후에만 노출.

- **매체 1개**: 해당 매체 지표 전체 제공(조건 조합과 동일 소스).
- **매체 2개 이상**: **공통 지표** 제공. 단, Step1의 **지표 구성(purpose)**에 따라 범위가 달라진다:
  - `종합 지표`(internal) → 공통 지표 **전체 9종** (광고비/노출수/클릭수/조회수/CPM/CPC/CPV/CTR/VTR)
  - `성과 지표`(external) → 공통 지표 중 **계산 지표 5종만** (CPM/CPC/CPV/CTR/VTR). 원본 4종(광고비/노출수/클릭수/조회수) 제외.
  - **왜 다른가**: 성과 지표는 효율·비용 지표에 집중하고, 원본 볼륨 지표(광고비·노출수 등)는 종합 분석 맥락에서만 의미가 있다.
- **타겟팅 선택에 따른 지표 제외** (매체 1개일 때만): 선택한 타겟팅에 따라 조회 불가 지표를 제외한다. 조건 조합 Step2와 **동일 규칙**을 공용 함수 `applyTargetingExclusions(base, media, targetingCategory)`로 공유. 제외 후 빈 그룹은 숨긴다. (제외 대상 지표 id 목록 — 구현 기준)
  - **Meta + 기기유형**: `post_reaction`, `post_engagement`, `cost_per_post_engagement`, `link_click`, `cost_per_link_click`, `link_ctr`, `complete_registration`, `cost_per_registration` 제외 + "협력 광고" 그룹 전체 비움.
  - **kakao모먼트 + 디바이스**: `conversions`, `message_send`, `message_open`, `message_click`, `message_open_rate`, `message_click_rate`, `channel_add_cpa`, `channel_add_cvr` 제외.
  - **NAVER 보장형 DA + 노출영역**: `cost`, `cost_guaranteed`, `cpc`, `cpm`, `cpv` 제외.
  - 그 외 매체·타겟팅 조합은 제외 없음. **매체 2개 이상(공통 지표)에는 미적용.**
- **공통 지표(9종)**: `common_cost`(광고비), `common_impressions`(노출수), `common_clicks`(클릭수), `common_views`(조회수), `common_cpm`(CPM), `common_cpc`(CPC), `common_cpv`(CPV), `common_ctr`(클릭률(CTR)), `common_vtr`(조회율(VTR)).
- **공통 지표 기준 매핑 다이얼로그**: 안내 영역의 "공통 지표 기준"(SearchCheck 아이콘) 클릭 시 매핑 표 다이얼로그 제공. 표 구성:
  - **원본 지표 4종**은 매체별 라벨로 매핑:

    | 공통 지표 | Google Ads | Meta | kakao모먼트 | NAVER 성과형 DA | NAVER 보장형 DA | TikTok |
    |---|---|---|---|---|---|---|
    | 광고비 | 광고비 | 광고 소진금액 | 비용 | 매출(소진금액) | 집행금액 | 광고 소진금액 |
    | 노출수 | 노출수 | 노출수 | 노출수 | 노출수 | 노출수 | 노출수 |
    | 클릭수 | 클릭수 | 클릭(전체) | 클릭수 | 클릭수 | 클릭수 | 클릭수 |
    | 조회수 | 조회수 | 동영상 3초 이상 재생수 | 재생수 | 비디오 재생 횟수 | 동영상 조회수 | 재생수 |

  - **계산 지표 5종**은 매체 구분 없이 **계산식 1개**로 표기(테이블에서 매체 열 colspan 병합):

    | 공통 지표 | 계산식 |
    |---|---|
    | 1,000회 노출당 비용(CPM) | 광고비 / 노출수 * 1,000 |
    | 클릭당 비용(CPC) | 광고비 / 클릭수 |
    | 조회당 비용(CPV) | 광고비 / 조회수 |
    | 클릭률(CTR) | 클릭수 / 노출수 * 100 |
    | 조회율(VTR) | 조회수 / 노출수 * 100 |
- **그룹 UI**: 접기/펼치기 + 검색(부분 일치, 대소문자 무시) + 그룹별 전체 선택/해제. (CreateDatasetStep2의 MetricGroupList 로직 복제)
- **매체 수 변경 시 지표 초기화 (사전 확인)**: 매체 선택이 **지표 소스 경계**(단일 매체 지표 `≤1개` ↔ 공통 지표 `≥2개`)를 넘고, 이미 선택한 지표가 있으면 → 즉시 반영하지 않고 **확인 다이얼로그**를 띄운다.
  - 제목 "선택한 지표 초기화" / 본문 "매체 수가 바뀌어 선택 가능한 지표가 달라집니다. 변경하면 선택한 지표가 초기화됩니다. 계속 진행하시겠습니까?"
  - **변경** → 매체 반영 + 지표 초기화(+ 매체가 1개가 아니게 되면 타겟팅/파트너사도 초기화) / **취소** → 매체 변경 자체를 되돌림.
  - 2→3, 3→2처럼 **둘 다 공통 지표(≥2) 영역**이면 소스가 안 바뀌므로 다이얼로그 없이 유지(초기화 안 함).
  - **왜 사전 확인인가**: 지표 선택 손실은 파괴적 동작 → 추출 기준/업종 초기화와 동일하게 사전 동의.
- **데이터 모델**: `FormData.productMetrics: string[]`.
- **유효성**: 지표 1개 이상 선택 필요.

### 2.4 우측 요약(Configuration Summary) (C5)

- **BASIC INFORMATION 블록에 "추출 기준" 항목 추가** (구현 완료 — `ConfigurationSummary.tsx`).
  - 위치: **조회기간 아래 · 업종 위** (Step1 입력 순서와 동일).
  - 값: `광고상품` / `조건 조합` / 미선택 시 `—`.
- **QUERY SETTINGS 블록 광고상품 분기** (구현 완료 — `ConfigurationSummary.tsx`의 `ProductQuerySettings`):
  - `광고상품` 기준이면 **매체 N개 · 매체별 상품 수(+총 상품 수) · 상세 조건(선택 시만) · 선택 지표**로 요약. 매체 미선택 시 `Pending`.
  - **상세 조건 요약**은 매체 1개일 때만 노출하며, **지표 블록과 동일 레이아웃**이다: "상세 조건 {합계}개" 헤더(합계 = 파트너사 수 + 타겟팅 옵션 수) 아래 그룹 칩 묶음(muted 박스)에 `협력 광고 파트너사 › 값들` / `{타겟팅 카테고리명} › 값들`을 각 그룹 행(`GroupChipRow`)으로 표시. 선택한 것만 행으로 노출.
  - `조건 조합` 기준은 기존 요약(매체·광고분류·타겟팅·지표) 유지.
  - 분기 기준: `formData.extractMode`. 광고상품은 `formData.media`(단일)가 아닌 `formData.mediaProducts`를 참조.

### 2.5 검토 및 추출 (Step3) (C6)

> 상태: **구현 완료** (`CreateDatasetStep3Product.tsx`). 광고상품 기준일 때 Step3를 분기(`extractMode==='product'` → `CreateDatasetStep3Product`, 아니면 기존 `CreateDatasetStep3`).

- **데이터 미리보기 테이블**:
  - 컬럼: 기간 / 매체 / 업종(대) / (업종(중) — 중분류 시만) / 광고상품 / (협력 광고 파트너사 — 선택 시만) / (타겟팅 카테고리명 — 선택 시만) / **선택 지표들**. (**업종(소) 없음**)
  - 행: **선택한 매체 × 광고상품 × 업종 조합** (`mediaProducts` × `formData.industries`를 flatten). 타겟팅·파트너사 행값은 선택 옵션을 순환(샘플 값). 미리보기는 **상위 5행**만 표시.
  - **업종(대)**: Step1에서 선택한 업종(대분류명). 미선택이면 "전체". (하드코딩 더미 금지 — 실제 선택값 사용)
- **선택 항목에 따라 컬럼 노출** (광고상품·조건 조합 Step3 공통 원칙):
  - 광고상품: 협력 파트너사 선택 시 "협력 광고 파트너사" 컬럼, 타겟팅 선택 시(카테고리+옵션) "{타겟팅 카테고리명}" 컬럼 추가(파트너사 → 타겟팅 순).
  - 조건 조합: 광고분류 컬럼은 **실제 값이 선택된 필드만** 노출(`products` JSON에서 선택 필드 추출, 매체 분류 구조 순서 유지). 타겟팅도 카테고리+옵션이 있을 때만.
  - 미선택 항목은 컬럼 미노출.
- **업종 컬럼은 선택한 업종 레벨(`industryLevel`)에 따라 노출 결정** (조건 조합 Step3·광고상품 Step3 **공통 규칙**):
  - 대분류 선택 → 업종(대)만
  - 중분류 선택 → 업종(대) + 업종(중)
  - 광고상품은 대분류만 가능하므로 항상 업종(대)만 노출된다. 값은 Step1에서 고른 실제 업종을 매핑(path를 레벨별로 분해).
  - **업종(소)는 제공하지 않는다(폐지).** 업종 분류는 대분류·중분류 2단계만 사용. (코드상 `minor` 흔적이 남아있을 수 있으나 레벨 토글에 노출되지 않아 선택 불가 — 추후 클린업 대상)
  - 지표 값은 샘플(실데이터 연동 영역). 단위: `%`(CTR·VTR), `원`(CPM·CPC·CPV·cost), `회`(impressions·clicks·views) 등.
- **"전체 컬럼 보기" 버튼** → **공용 `SampleDataModal`** 호출(조건 조합·광고상품 공용). 모달은 `extractMode`로 테이블 분기(`ConditionSampleTable`/`ProductSampleTable`)하며 껍데기(헤더/스크롤/푸터)는 1곳. "예상 데이터 크기 : 1,234 행"(샘플) 표기, zebra. 광고상품 Step3는 자체 모달 없이 상위 `onShowSampleData` 콜백으로 공용 모달을 띄운다.
- **데이터 없음 상태**: 행이 0개이거나 지표가 0개면 "설정한 조회조건에 맞는 데이터가 없습니다. / 이전 단계로 돌아가서 조회조건을 다시 설정해주세요." (SearchX 아이콘)
- **"데이터셋 생성 요청"(추출) 버튼**: 미리보기 데이터가 있을 때만 활성화. 데이터 없음(행=0 또는 지표=0)이면 비활성(opacity 0.5, not-allowed). 광고상품=매체×상품 조합 행 + 지표 기준, 조건 조합=products+metrics 기준.
  - ⚠️ 구현 주의: 조건 조합용 Step3(`formData.media/products` 기반)를 광고상품에 쓰면 `mediaProducts`를 못 읽어 항상 "데이터 없음"이 됨 → **반드시 extractMode로 분기**.
- 지표 라벨 매칭은 `getMetricGroups(selectedMedias)`(매체 1개=매체 지표, 2개↑=공통 지표) 기준으로 id→label 변환.

### 2.6 유효성 검증 규칙 (추가분)

> 범위: 추출 기준 선택(Step1) + 광고상품 기준 Step2. 조건 조합 Step2 규칙은 기존 `DataShot_CreateDataset_Spec.md`를 따른다.
> 그룹: **A 추출기준(Step1)** / **B 매체·상품(Step2)** / **C 지표(Step2)** / **D 전환 가드(변경 시 초기화·확인)** / **E Step3(검토·추출)**

#### 요약 표

| # | 그룹 | 규칙명 | 조건 | 기대 결과 / 에러 메시지 | 레벨 |
|---|---|---|---|---|---|
| V1 | A 추출기준 | 추출 기준 필수 | `extractMode === ''` | 다음 버튼 비활성 + "추출 기준을 선택해주세요." | error |
| V2 | A 추출기준 | 업종 노출 선행 | `extractMode === ''` | 업종 블록 숨김 (추출 기준 선택 후 노출) | 동작 |
| V3 | A 추출기준 | 광고상품=대분류만 | `extractMode === 'product'` | IndustryDialog 중분류 토글 disabled + "추출 기준이 광고상품인 경우 대분류 업종만 선택할 수 있습니다." | error(차단) |
| V4 | B 매체·상품 | 매체 최소 1개 | 광고상품 기준, 선택 매체 0개 | 다음 불가 + "최소 1개 이상의 매체를 선택해주세요." | error |
| V5 | B 매체·상품 | 매체별 상품 1개↑ | 선택한 매체 중 상품 0개가 있음 | 다음 불가 + "{매체}: 최소 1개 이상의 상품을 선택해주세요." | error |
| V6 | B 매체·상품 | 파트너사 상품 선행 | Meta 상품 0개 | 협력 파트너사 콘텐츠에 "광고상품을 먼저 선택해주세요." (선택 불가) | info |
| V7 | B 매체·상품 | 파트너사↔기기유형 배제 | 파트너사 선택됨 | 타겟팅 "기기유형" 비활성화 | 동작 |
| V8 | B 매체·상품 | 기기유형↔파트너사 배제 | 기기유형 선택 + 파트너사 미선택 | 파트너사 아코디언 잠금 | 동작 |
| V9 | C 지표 | 지표 최소 1개 | 광고상품 기준, 선택 지표 0개 | 다음 불가 + "지표를 선택해주세요." | error |
| V10 | C 지표 | 매체 수별 소스 | 매체 1개=매체 지표 / 2개↑=공통 지표 9종 | 소스 그룹 전환 | 동작 |
| V11 | C 지표 | 타겟팅별 지표 제외 | 매체 1개 + 특정 타겟팅(§2.3) | 해당 지표 그룹에서 제외 | 동작 |
| V12 | D 전환 가드 | 업종 초기화 확인 | 중분류 업종 있음 + 광고상품 전환 | 확인 다이얼로그 "선택한 업종 초기화" / 변경 시 업종 초기화, 취소 시 그대로 | 확인 |
| V13 | D 전환 가드 | 지표 초기화 확인 | 지표 소스 경계(≤1↔≥2) 넘음 또는 **단일매체 교체** + 지표 있음 | 확인 다이얼로그 "선택한 지표 초기화" / 변경 시 지표·타겟팅·파트너사 초기화, 취소 시 매체 변경도 되돌림 | 확인 |
| V14 | D 전환 가드 | 매체 구성 변경 연쇄 | 매체 구성(종류) 변경 + 지표 소스 안 바뀜(예: 2→3) | 타겟팅·파트너사 초기화(매체에 종속), 지표는 유지 | 동작 |
| V15 | D 전환 가드 | 타겟팅→지표 정리 | 타겟팅 카테고리 변경(또는 해제) | 새 타겟팅 기준 `applyTargetingExclusions`로 유효 지표만 남기고 나머지 해제 | 동작 |
| V16 | D 전환 가드 | purpose→지표 초기화 | Step1 지표 구성(종합↔성과) 변경 | `productMetrics: []` 초기화 (공통 지표 범위가 달라짐) | 동작 |
| V17 | D 전환 가드 | 추출 기준 전환 양쪽 초기화 | 광고상품↔조건 조합 전환 | 양쪽 Step2 필드 전부 초기화(`media/products/metrics` + `mediaProducts/productMetrics/partners` + `targetingCategory/Options`) | 동작 |
| V18 | E Step3 | 추출 버튼 비활성 | Step3에서 미리보기 데이터가 없음(행=0 또는 지표=0) | "데이터셋 생성 요청" 버튼 disabled(opacity 0.5, not-allowed) | 동작 |

#### 종합 진행 조건 (의사코드)

```
// Step1 (추출 기준 포함) — isStep1Valid
datasetName.trim() && 조회기간 유효 && extractMode !== '' && industries.length > 0 && industryLevel

// Step2 (광고상품 기준) — isStep2Valid (extractMode === 'product')
medias = Object.keys(mediaProducts)
medias.length > 0 && medias.every(m => mediaProducts[m].length > 0) && productMetrics.length > 0

// Step3 (추출 버튼) — isStep3HasData
// 광고상품: 매체×상품 행 > 0 && productMetrics > 0
// 조건 조합: products > 0 && metrics > 0
```

> 경계값(TC용): 매체 0개 ↔ 1개, 매체 1개(상품 0 ↔ 1), 매체 1개 ↔ 2개(지표 소스 전환), 지표 0개 ↔ 1개를 양방향으로 도출.

---

## 3. 데이터셋 상세/결과 변경분 → `DataShot_DatasetDetail_Spec.md` 에 병합

> 기존 "Extracted Data" 테이블 위에 결과 차트 2종 영역을 신설한다.

### 3.0 목록 → 상세 분기 (추출 기준별)

목록에서 데이터셋을 클릭하면 추출 기준에 따라 상세 화면이 분기된다. (`/datashot/:id` 라우트가 `DatasetDetailRouter`로 분기)

- `extractMode === 'product'`(광고상품) → **다매체 통합 결과 화면**(`DatasetResult`: 상단 차트 2종 + Extracted Data 테이블).
- 그 외/미지정(조건 조합) → **기존 상세 화면**(`DatasetDetail`).
- **왜 분기하나**: 광고상품은 다매체·상품 교차 데이터라 비교 차트가 필요하고, 조건 조합은 기존 단일 매체 상세로 충분하다. 추출 방식에 맞는 분석 뷰를 제공한다.
- 분기 입력: 목록 클릭 시 `navigate(state: { datasetData })`로 넘긴 `datasetData.extractMode`. (상태 유실 시 조건 조합 상세로 폴백)
- **헤더 반영**: `DatasetResult`는 `location.state.datasetData`에서 데이터셋명·매체 수("N개 매체")·업종·조회기간·브레드크럼을 받아 표시. (광고상품·지표 수치, 모달 내용은 실데이터 영역이라 샘플 유지)
- **헤더 요약 항목 + 돋보기 모달** (조건 조합 상세와 같은 패턴이되 광고상품 기준):
  - 순서: **매체 N개 · 조회기간 · 업종 N개 · 광고상품 N개 · 지표 N개**. (조건 조합 상세의 "조회조건" 자리를 **"광고상품"**으로 교체)
  - **돋보기(SearchCheck 아이콘)**: 매체 · 업종 · 광고상품 · 지표 항목에 노출. 클릭 시 상세 모달을 연다. (조회기간은 돋보기 없음)
    - **매체 돋보기 → 매체 상세 모달(`MediaModal`, 신규)**: 다매체 추출의 "N개 매체 + 매체별 선택 광고상품"을 읽기전용으로 표시(매체별 접기/펼치기). 광고상품은 매체를 가로지르는 다매체 추출이라 매체명 하나로 대표할 수 없어 상세 모달을 제공한다.
    - **업종 돋보기 → `IndustryModal`**(기존 공용 재사용). 대분류 업종 목록 표시.
    - **광고상품 돋보기 → `AdProductsModal`**(기존 공용 재사용). 선택 광고상품 구조 읽기전용 표시.
    - **지표 돋보기 → `MetricsModal`**(기존 공용 재사용). 지표 그룹 읽기전용 표시.
- **헤더 액션 버튼** (조건 조합 상세와 동일 동작):
  - **공유(Share2)**: Copy Link(현재 URL 복사 + 토스트 "현재 URL이 복사되었습니다.") / Export to CSV.
  - **정보(Info, hover)**: 설명 · Dataset ID · 생성일시/생성자(이메일은 `maskEmail` 마스킹) 툴팁.
  - **더보기(MoreVertical)**: 복제 / 이동 / 삭제. 삭제는 확인 다이얼로그(한글 조사 을/를 자동) → 성공 토스트 후 `/datashot` 이동. `id === 10`(종합 지표 데이터셋)은 복제 시 "복제 불가 안내" 다이얼로그.
  - 모달·유틸(`DatasetDetailModals`, `maskEmail`)은 조건 조합 상세와 **공용**하며, DatasetResult는 추가 분리 없이 이들을 재사용한다(조건 조합 상세 `DatasetDetail`은 미변경).

> 상태: **구현 완료** (`DatasetDetailRouter.tsx` → `DatasetResult.tsx` 연결).

### 3.1 결과 상단 차트 2종 — Benchmark Analytics (C7)

> 상태: 차트 1(Cost Share) **구현 완료**, 차트 2(Efficiency Map) **재설계 — 구현 예정**. (`ResultCharts.tsx`)
> **상세 정의는 별도 문서로 분리**: `plan/spec/DataShot_ResultCharts_Spec.md`. 차트 정의가 비대해져(포지셔닝 로직·탭·효율 포인트 산출·엣지) 조회 Spec 본문에서 떼어냈다. 아래는 요약만.

- 조회(상세) 상단에 **"Benchmark Analytics"**로 차트 2종을 한 세트로 제공. 선택 업종의 과거 집행 실적 기반, **순수 참고용**.
  - **차트 1 — Cost Share**(도넛): 매체/상품별 광고비 **비중(%)**. "어디에 나눠 썼나"(미디어믹스 참고). 비중 1위 1개 그린.
  - **차트 2 — Efficiency Map**(포지셔닝 맵): "내가 고른 것들 중 뭐가 효율적이었나". **클릭/조회 탭**(비율×단가), X축 정방향(왼쪽=저렴)·효율 영역 좌상, **선택 평균** 기준선, 효율 포인트 1개 그린.
- 두 차트는 한 세트로 **"많이 쓴 것 ≠ 효율 좋은 것"** 엇갈림을 드러낸다. 차트 2는 하단 Extracted Table(값 나열)과 달리 **배치·상대 위치**를 보여줘 차별화.
- **제공 조건**: 업종 최소 단위 기준 **상품 3개 이상**. 공통 컨트롤(업종 드롭다운 + 매체/상품 뷰 토글)은 두 차트 공유, **클릭/조회 탭은 차트 2 전용**.
- 상세 규칙(매체 뷰 비활성, 탭 활성/비활성, 효율 포인트 산출, 선택 평균 가중, 엣지 E1~E4): **→ `DataShot_ResultCharts_Spec.md` 참조.**

### 3.2 Extracted Data 테이블

> 상태: **구현 완료** (`ExtractedTable.tsx`). DatasetDetail 테이블을 다매체 기준으로 이식.

- 정렬 / 목록 필터(드롭다운 검색·다중선택) / 지표 필터(연산자+값) / 페이지네이션 / 집계행(전체·필터) 유지.
- 컬럼: 기간 / 매체 / **업종(대)** / **상품**(캠페인 목표+플랫폼으로 대표 상품명 구성) + 공통 지표. (상세 옵션 컬럼·타겟팅 컬럼은 상품 단일 컬럼으로 통합)
  - **업종(중) 컬럼 없음**: 광고상품 기준은 대분류 업종만 제공하므로 업종(중)을 노출하지 않는다. (관련 `industryMedium` 컬럼·필터·집계 자리 제거)
- 1,000행 초과 경고 배너("…전체 데이터는 **파일 다운로드**를 통해 확인하세요." — 매체 중립 표현), 최근 업데이트 안내 유지. 데이터는 `generateSampleData`(시드 기반 결정적).

---

## 4. 데이터 개념 및 용어 매핑

| UI 용어 | 개념 / 데이터 | 비고 |
|---|---|---|
| 추출 기준(목록) | `Dataset.extractMode?: 'product' \| 'condition'` | 미지정 시 `condition` 하위 호환 |
| 매체 수(목록) | `Dataset.mediaCount?: number` | 광고상품 "N개 매체" 표시용 |
| 추출 기준(생성) | `FormData.extractMode: 'product' \| 'condition' \| ''` | `''` = 미선택 |
| 매체별 상품(생성) | `FormData.mediaProducts: MediaProductSelection` = `{ [media]: string[] }` | 매체→선택 상품 배열 |
| 선택 지표(생성) | `FormData.productMetrics: string[]` | 광고상품 기준 지표 (매체/공통) |
| 협력 파트너사(생성) | `FormData.productCollaborativePartners: string[]` | Meta 단일 선택 시 |
| 타겟팅(생성, 공유) | `FormData.targetingCategory` / `targetingOptions` | 조건 조합과 공유 |

> 용어 통일: 추출 기준은 `'product'`(광고상품) / `'condition'`(조건 조합) 두 값으로 목록·생성이 동일하게 쓴다. "상세 옵션"/`'detail'` 라벨은 폐기.

### 4.1 조회(상세) 데이터 소스 매핑 (UI ↔ 데이터)

| UI 영역 | 데이터 소스 | 비고 |
|---|---|---|
| 상세 헤더(이름·매체 수·업종·기간) | `location.state.datasetData` | 목록 클릭 시 전달. 매체=`mediaCount`("N개 매체"), 업종=`industryCount` |
| 조회조건·지표 수치(헤더) | (샘플 고정) | 실데이터 연동 전까지 샘플 |
| 차트 2종(Benchmark) | `ResultCharts` 내부 샘플(업종별 실적) | 실데이터 연동 영역 |
| Extracted Table | `generateSampleData()` (시드 기반 결정적) | 상품명=캠페인목표+플랫폼 파생 |

> 실데이터 연동 시 위 샘플 소스가 백엔드 응답으로 교체된다. 화면 규칙·표기는 그대로 유지.

---

## 5. 스타일 / 컴포넌트 위임

- 모든 px/hsl/grid 수치는 **구현 코드 + 디자인 토큰**이 단일 진실 공급원. 본 문서는 의도만 서술.
- 차트 색/축/툴팁은 **Budget Optimizer 차트 패턴**과 동일. (시그니처 그린 = 최대 비중 1곳만)
- DataShot은 인라인 스타일 모듈 규칙을 따른다. (토큰 값을 인라인으로 사용)

---

## 6. 참고 자료

### 6.1 구현 컴포넌트 맵 (개발 진입점)

| 영역 | 파일 | 역할 | 상태 |
|---|---|---|---|
| 목록 | `DatasetList.tsx`, `types.ts` | 추출 기준 컬럼·매체 분기, `Dataset.extractMode/mediaCount` | 완료 |
| 생성 셸/분기 | `CreateDataset.tsx` | Step 렌더, Step2 분기, 확인 다이얼로그(업종/지표 초기화), 토스트, **복제 프리필**(`location.state.prefillForm` → 초기 폼) | 완료 |
| Step1 | `CreateDatasetStep1.tsx` | 추출 기준 택1, 업종 노출/제약, 전환 확인 콜백 | 완료 |
| 폼 타입 | `createDatasetTypes.ts` | `FormData`(extractMode/mediaProducts/productMetrics/productCollaborativePartners), `MediaProductSelection` | 완료 |
| 업종 다이얼로그 | `IndustryDialog.tsx` | `extractMode='product'` 시 중분류 토글 비활성 | 완료 |
| Step2(광고상품) | `CreateDatasetStep2Product.tsx` | 매체·상품 + 상세 조건 + 지표 조립, 매체수 전환 가드 | 완료 |
| 매체·상품 | `MediaProductSelect.tsx` | 다매체 체크 + 매체별 상품 리스트 | 완료 |
| 상품 다이얼로그 | `ProductDialog.tsx` | 상품 선택(검색/전체선택), 소스 `mediaData.DIGITAL` | 완료 |
| 지표 | `MetricSelect.tsx` | 매체/공통 지표, `applyTargetingExclusions`, 매핑표 | 완료 |
| 협력 파트너사 | `CollaborativePartnerSelect.tsx` | Meta 파트너사, 상품 데이터 필터(`getAvailablePartners`) | 완료 |
| 타겟팅 | `CreateDatasetStep2.tsx`의 `TargetingSelector`(export) | 조건 조합과 공유 | 완료 |
| 우측 요약 | `ConfigurationSummary.tsx`의 `ProductQuerySettings` | extractMode별 요약 분기 | 완료 |
| 샘플 모달 | `SampleDataModal.tsx` | extractMode별 테이블 분기(조건조합/광고상품) 공용 | 완료 |
| Step3(광고상품) | `CreateDatasetStep3Product.tsx` | 매체×상품 조합 미리보기 테이블 + 공용 모달 호출 | 완료 |
| 상세 분기 | `DatasetDetailRouter.tsx`, `App.tsx` | `/datashot/:id` extractMode 분기 | 완료 |
| 상세 셸(광고상품) | `DatasetResult.tsx` | 헤더(매체·광고상품 병합 요약·돋보기 모달·공유[Excel]/정보/더보기) + 복제(프리필)·이동(Slot 다이얼로그)·삭제·복제불가·토스트 + 차트 + 테이블 조립 | 완료 |
| 상세 헤더 모달 | `DatasetDetailModals.tsx` | `IndustryModal`/`MetricsModal`(공용) + `ProductListModal`(신규 — `MediaProductSelect` readOnly 재사용) | 완료 |
| 매체·광고상품 선택 | `MediaProductSelect.tsx` | 생성 Step2 선택 UI. `readOnly` prop으로 조회 모달에서 읽기전용 재사용 | 완료 |
| 결과 차트 | `ResultCharts.tsx` | Benchmark Analytics(Cost Share 도넛 + Efficiency Map 포지셔닝) + SpinX. **상세 정의 → `DataShot_ResultCharts_Spec.md`** | 차트1 완료 / 차트2 재설계 |
| Extracted Table | `ExtractedTable.tsx` | 정렬/필터/페이지네이션/집계행 | 완료 |

### 6.2 참고 문서/소스

- 기존 Spec: `plan/spec/DataShot_DatasetList_Spec.md`, `plan/spec/DataShot_CreateDataset_Spec.md` (v2.1), `plan/spec/DataShot_DatasetDetail_Spec.md` (v2.0)
- 조회 결과 차트 상세: `plan/spec/DataShot_ResultCharts_Spec.md` (Benchmark Analytics 차트 2종 — 본 문서 §3.1에서 분리)
- 차트 패턴 참조: Budget Optimizer 결과 화면 (`plan/spec/BudgetOptimizer_Result_Spec.md`)
- 상품 선택 UI 참조: RatioFinder (`src/components/scenario/ScenarioStep2RatioFinder.tsx`)

---

## 7. 외부 솔루션 → DataShot 유입 CTA (C10) → `Reach_Caster_Result_Screens_Spec.md` 에 병합

> 상태: **구현 완료** (`ReachPredictorResult.tsx`, `RatioFinderResult.tsx`).
> 범위: Reach Caster 결과 화면에서 DataShot으로 넘어가는 **유입 동선**. DataShot 내부 화면 변경은 아니지만, DataShot 유입 경로의 단일 기준으로 본 문서에 함께 기록한다. (배포 후 Reach Caster 결과 Spec으로 병합)

### 7.0 목적 · 기획 의도

Reach Caster 결과(도달·효율 분석)를 다 본 사용자에게, **"그래서 이 업종 캠페인은 보통 어떤 성과가 나오나?"**라는 다음 질문의 답을 DataShot에서 이어 보도록 연결한다.

- **왜 CTA를 두나**: 하나의 캠페인 판단 세션이 솔루션을 가로질러 흐르게 하는 것(경계 없는 단일 세션)이 제품 태도다. 결과를 본 직후가 "업종 벤치마크를 보고 싶다"는 니즈가 가장 큰 지점이므로, 그 자리에서 DataShot 진입점을 제시한다.
- **왜 기존 ghost 링크를 교체했나**: 기존에는 결과 하단에 중앙 정렬된 저강조(ghost) 링크 버튼("DataShot에서 {업종} 업종의 캠페인 성과 확인하기")만 있었다. "왜 넘어가야 하는지"의 맥락이 약하고 다음 액션으로서 눈에 띄지 않았다. Budget Optimizer 결과 화면의 Reach Caster 유도 CTA와 동일한 **맥락형 CTA 존**(제목 → 설명 → primary 버튼)으로 통일해, 솔루션 간 "다음 단계로 이어가기" 경험을 일관되게 만든다.

### 7.1 대상 화면 · 배치

| 화면 | 파일 | 배치 |
|---|---|---|
| Reach Predictor 결과 | `ReachPredictorResult.tsx` | 기본 결과 화면 콘텐츠 맨 아래 (Estimated Performance 테이블 뒤) |
| Ratio Finder 결과 | `RatioFinderResult.tsx` | 기본 결과 화면 콘텐츠 맨 아래 |

- 콘텐츠 흐름(분석 결과)과 CTA 사이를 **얇은 상단 구분선(1px)**으로 끊어 "결과 → 다음 액션"의 리듬을 만든다.
- CTA 존은 **좌측 정렬** 세로 스택이다. (우하단 상주 SpinX 플로팅 버튼과 겹치지 않게 우측 끝으로 밀지 않음)

### 7.2 구성 · 표기

세로 스택: **제목 → 설명 → 버튼** 순.

| 요소 | 노출 문구 | 비고 |
|---|---|---|
| 제목 | `{업종} 업종의 캠페인 성과는 어떨까요?` | 업종은 세션 맥락(`scenarioData.industry`)에서 프리필. 값이 없으면 기본 `여행` |
| 설명 | `DataShot에서 내 업종의 캠페인 성과 데이터를 이어서 확인할 수 있어요.` | "넘어가면 새로 얻게 되는 것"을 제시 (결과에서 이미 본 수치를 반복하지 않음) |
| 버튼(CTA) | `DataShot으로 캠페인 성과 보기 →` | 좌측에 Database 아이콘, 우측에 ArrowRight. 프로덕트 primary(pill) 표준 |

- **제목에 업종을 프리필하는 이유**: 세션 맥락(업종)을 들고 넘어간다는 신호를 주어, 새 화면에서 다시 입력하지 않아도 됨을 암시한다(단일 세션 연속성).
- 설명 문장은 읽는 폭 제한(약 560px)을 적용한다.

### 7.3 동작

- **클릭 시**: `navigate('/datashot')`로 DataShot 데이터셋 목록으로 이동.
- **버튼 hover**: 배경이 primary의 미세 저채도(`hsl(var(--primary)/0.9)`)로 바뀌고, 우측 화살표만 소폭(+3px) 미끄러진다. translateY 부양·그림자 확대 없음(절제된 인터랙션).
- 버튼은 primary pill 표준(시그니처 그린 배경 + primary-foreground 텍스트)을 따른다. 정확한 수치는 구현 코드/디자인 토큰에 위임.

### 7.4 유효성 / 검증 포인트 (CTA)

| # | 조건(입력) | 기대 결과 |
|---|---|---|
| X1 | 결과 화면 진입, `scenarioData.industry = '여행'` | 제목 "여행 업종의 캠페인 성과는 어떨까요?" 표시 |
| X2 | `scenarioData.industry` 없음(undefined) | 제목이 기본값 "여행 업종의 캠페인 성과는 어떨까요?"로 표시 |
| X3 | CTA 버튼 클릭 | `/datashot`로 이동 |
| X4 | 버튼에 마우스 올림 | 화살표가 +3px 이동, 배경 미세 저채도 전환 (부양·그림자 없음) |

### 7.5 데이터 개념 (CTA)

| UI 용어 | 데이터 / 소스 | 비고 |
|---|---|---|
| 제목의 업종 | `scenarioData.industry` | Reach Caster 시나리오 결과의 업종. 없으면 기본 `여행` |
| 이동 경로 | `navigate('/datashot')` | DataShot 데이터셋 목록 |

### 7.6 스타일 / 컴포넌트 위임

- CTA 존 레이아웃·버튼 스펙은 **Budget Optimizer 결과 화면의 Reach Caster 유도 CTA**(`BOResult.tsx`의 `bo-reach-cta`)와 동일 패턴. 정확한 px/radius/hsl은 구현 코드·디자인 토큰이 단일 진실 공급원.
- Reach Caster 모듈은 인라인 스타일 규칙을 따른다(토큰 값을 인라인으로 사용).

---

## 미결 사항

- [x] Step3(검토·추출) 테이블 이식 — `CreateDatasetStep3Product` (§2.5)
- [x] 결과 상단 차트 2종 이식 — `ResultCharts` (§3.1)
- [x] 광고상품 상세 화면 본 소스 승격 — `DatasetResult` (§3.0)
- [x] `_mockup` 폴더 삭제 + 임시 `/mockup/*` 라우트·import 제거
- [ ] 병합 시 유효성 번호 체계 통합 (본 문서 V1~V18 ↔ 기존 CreateDataset V-번호)
- [ ] (실데이터 연동 영역) 차트·테이블·조회조건/지표 수치의 백엔드 데이터 소스 교체
- [ ] 배포 후 본 문서 → 기존 3개 Spec에 섹션 병합 (목록/생성/상세)
- [ ] 배포 후 §7(유입 CTA) → `Reach_Caster_Result_Screens_Spec.md`에 병합
