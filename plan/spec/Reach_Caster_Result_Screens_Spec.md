# Reach Caster 결과 화면 정의서

## 문서 정보
- **작성일**: 2026-05-27
- **최종 수정**: 2026-09-21
- **버전**: v1.2
- **대상 화면**: Ratio Finder 결과, Reach Predictor 결과
- **관련 컴포넌트**: `RatioFinderResult.tsx`, `ReachPredictorResult.tsx`, `ReachCurveChart.tsx`, `ReachPredictorScoreCards.tsx`
- **관련 스펙**: `Scenario_Creation_Spec.md`, `Scenario_Comparison_Spec.md`, `SpinX_for_ReachCaster_Spec.md`, `Scenario_Result_PDF_Export_Spec.md`

### 변경 이력
| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| v1.0 | 2026-05-27 | 초안 작성 |
| v1.1 | 2026-05-27 | SpinX 연동·비교 모드 섹션 반영 |
| v1.2 | 2026-09-21 | 작성 가이드 반영 — 문서 활용처(Docs/TC)·기획 의도 명시, 순수 시각 스타일 수치(px·hsl·hex·rgba·grid 문법·폰트 크기 표) 제거 후 의도·디자인 토큰 기준으로 위임(차트 인터랙션·Optimal Point 로직·테이블 컬럼 등 행동 규칙은 보존), 향후 개선을 개선 제안(제안·가치·상태) 표로 재구성 |

---

## 화면 개요 (공통)

### 기능 정의
Reach Caster 결과 화면은 분석 모듈별 예측 결과를 시각화한다. Ratio Finder는 TVC×Digital 예산 비중별 통합 도달률을, Reach Predictor는 선택 매체 믹스의 예상 도달률과 성과를 보여준다.

**기획 의도**: 결과 화면은 "숫자 덤프"가 아니라 전략 판단을 내리는 상황실이어야 한다. 그래서 핵심 결론(최적 비중·Optimal Point)을 먼저 시각적으로 짚어주고, 상세 수치는 사용자가 원할 때(막대 클릭·다이얼로그) 펼쳐 본다. 시스템이 "여기가 정답"이라 짚는 지점은 시그니처 그린으로 통일해, 어느 결과 화면에서든 색만 보고 핵심을 읽게 한다.

### 문서 활용처
- **개발 참고**: 프론트엔드 구현 시 화면 동작·규칙·제약의 기준 문서로 활용된다.
- **제품 Docs**: 결과 해석·차트 인터랙션 설명이 사용자 대상 기능 문서의 기반이 된다.
- **AI 기반 TC 생성**: 막대 선택 동작·Optimal Point 표시·테이블 표시 조건·SpinX 연동(Section 1·2·3)이 테스트 케이스의 원천 데이터가 된다.

### 진입 경로
- 시나리오 목록에서 Completed 시나리오 클릭 → 분석 모듈에 따라 결과 화면 이동
- URL: `/reachcaster/scenario/ratio-finder/result`, `/reachcaster/scenario/reach-predictor/result`

---

## 1. Ratio Finder 결과 화면

### 1.1 화면 개요
TVC와 Digital 매체의 최적 예산 비중을 분석한 결과를 시각화하여 제공하는 화면.

### 1.2 헤더 영역 (Single Line Layout)

**레이아웃**: 좌측 (뱃지 · 타이틀 · 주요 정보) … 우측 (Share · Info · Menu)

- **분석 모듈 뱃지**: "Ratio Finder" + Scale 아이콘. 검정 배경/흰 텍스트의 뱃지(다크모드 대응, 정확한 수치는 디자인 토큰 기준).
- **시나리오명**: 큰 굵은 텍스트, 말줄임 처리
- **주요 정보**(muted-foreground): 총 예산, 시뮬레이션 단위(예: 10%), 타겟(N개 + 돋보기 아이콘 → 타겟 GRP 다이얼로그), 기간, 브랜드/업종
- **액션 버튼**: Share 드롭다운(Copy Link, Export to Excel), Info 툴팁(설명·Scenario ID·생성일시·완료일시), Menu 드롭다운(복제·이동·삭제)

### 1.3 차트 영역

**차트 타입**: ECharts — Stacked Bar + Line (Combo Chart)

- **Stacked Bar (매체 비중)**: X축은 11개 비중 조합(0:100 ~ 100:0, 10% 단위), 좌측 Y축은 매체 비중(0~100%, 100% 누적 스택). TVC는 무채색(다크모드 대응), Digital은 시그니처 그린.
- **Line (통합 도달률)**: 우측 Y축은 통합 도달률(%). 무채색 직선.
- 정확한 색상 hex·선 두께는 구현 코드/디자인 토큰 기준. 다크모드는 색상 분기로 대응.

**인터랙션**:
1. **막대 클릭**: 클릭한 막대만 풀 컬러, 나머지는 페이드 처리. 하단 상세 테이블에 해당 조합 데이터 표시. 선택 상태 유지(selectedBarIndex).
2. **호버(Tooltip)**: axis 트리거(세로 영역 전체). 표시 내용 — 비중 조합, TVC %, Digital %, 통합 도달률 %.
3. **범례**: 하단 우측(TVC, Digital, 통합 도달률). 클릭 시 시리즈 표시/숨김.

**차트 설정**: 애니메이션 비활성화(성능 최적화), 부모 컨테이너 너비에 맞춤(반응형).

### 1.4 상세 데이터 테이블

- **표시 조건**: 차트에서 막대 클릭 시 노출
- **헤더**: "Detailed Performance Data", 모집단 정보(예: 46,039,423명)
- **컬럼**: 매체 비중(TVC/Digital), 통합 도달률(%), 예상 예산 배분(TVC/Digital), 빈도(Frequency), GRP, CPM
- **초기 상태**(막대 미선택): "차트에서 막대를 클릭하면 상세 데이터가 표시됩니다" 안내(muted 배경, 중앙 정렬)

### 1.5 DataShot CTA

**위치**: 테이블 하단, 얇은 상단 구분선으로 리듬을 끊고 배치.

```
[Database Icon] 이 예측을 실제 데이터와 비교해보세요
DataShot에서 [업종명] 캠페인 성과 확인하기 →
```
- 호버 시 muted 틴트 배경으로 강조. 클릭 시 `/datashot`로 이동. 정확한 여백·색은 디자인 토큰 기준.

### 1.6 타겟 GRP 다이얼로그

- **트리거**: 헤더 타겟 돋보기 아이콘 클릭
- **제목**: "선택한 타겟 GRP", 설명: "이 시나리오에 적용된 타겟 모수입니다"
- **내용**: 남성/여성 섹션 각 4×3 그리드(12개 연령대). 선택된 항목만 활성(읽기 전용), 선택 항목은 primary 테두리 + 배경으로 강조.

---

## 2. Reach Predictor 결과 화면

### 2.1 화면 개요
선택한 매체 믹스의 예상 도달률을 예측하고 성과를 시각화하여 제공하는 화면.

### 2.2 헤더 영역 (Single Line Layout)

**레이아웃**: Ratio Finder와 동일(좌측 뱃지·타이틀·주요 정보 / 우측 Share·Info·Menu)

- **분석 모듈 뱃지**: "Reach Predictor" + Target 아이콘
- **주요 정보**(muted-foreground): 총 예산, 시뮬레이션(매체/상품 개수 + 돋보기 → 매체/상품 상세 다이얼로그), 타겟(N개 + 돋보기), 기간, 브랜드/업종
- **액션 버튼**: Ratio Finder와 동일

### 2.3 레이아웃 구조
- 좌우 2단 구성 — 좌측 Key Metrics Summary(스코어카드) + 우측 Reach Curve Analysis(리치커브 차트). 좌우 비율·간격은 구현 코드 기준(우측 차트에 더 넓은 비중).

### 2.4 Key Metrics Summary

- 벤토 박스 스타일의 2×2 스코어카드. 값 강조, 아이콘은 배경 없이 표기(아이콘 뱃지 지양). 다크모드 대응.

| 카드 | 지표 | 아이콘 |
|------|------|--------|
| 1 | 예상 도달률 | Target |
| 2 | 예상 빈도 | Repeat |
| 3 | 예상 GRP | TrendingUp |
| 4 | 평균 CPM | DollarSign |

- 카드 강조는 값 하나에 집중. 배경 그라데이션/겹친 틴트는 지양하고, 위계는 크기·굵기·여백으로 만든다. 정확한 색·간격은 디자인 토큰 기준.

### 2.5 Reach Curve Analysis

**차트 타입**: Recharts — Composed Chart (Area + Line)

- **Area (예측 범위/신뢰 구간)**: primary 옅은 투명도, upperBound ~ lowerBound 범위, 부드러운 곡선.
- **Line (예상 도달률)**: primary 색 smooth curve, 원형 포인트.
- **X축**: 예산(억 단위), 리치커브 구간 설정에 따른 범위를 균등 간격으로 표시(예: "3.0억", "4.5억" …). Y축: 도달률(%), 점선 그리드.

**Optimal Point 마커**:
- 위치: S-curve의 변곡점(효율이 포화되기 시작하는 지점)
- 표시: ThumbsUp 아이콘 + "Optimal Point" 레이블. 페이드인 + 위치 계산.
- 강조는 시그니처 그린("시스템이 짚은 정답" 언어). 정확한 배경·그림자는 디자인 토큰 기준.

**인터랙션**:
1. **호버(Tooltip)**: 예산 / 예상 도달률 / 예측 범위(하한~상한) 표시(카드 스타일).
2. **반응형**: 부모 너비 100%, 리사이즈 시 Optimal Point 위치 재계산.

**리치커브 설정 다이얼로그**: 차트 제목 옆 돋보기 아이콘 트리거. 내용 — 예산 상한, 구간 설정(최소~최대), 구간 수 기준 / 구간별 금액 기준(라디오).

### 2.6 Estimated Performance 테이블

- **위치**: 차트 하단
- **헤더**: "Estimated Performance", 모집단 정보(우측 상단)
- **컬럼**: 매체/상품명, 카테고리(DIGITAL/TVC), 확정 예산, 예상 노출, CPM, 예상 도달률, 예상 빈도
- 카테고리 뱃지로 DIGITAL/TVC 구분, 매체명 굵게 + 상품명 작게(muted-foreground), 숫자 우측 정렬 + 천 단위 구분. 색은 디자인 토큰 기준.

### 2.7 매체/상품 상세 다이얼로그

- **트리거**: 헤더 시뮬레이션 돋보기 아이콘
- **제목**: "분석 매체/상품 상세", 설명: "시나리오 생성 시 설정된 매체 및 상품 정보입니다"
- **테이블**: 매체(카테고리 뱃지), 상품(매체명 + 상품명), 확정 예산, 예상 노출, CPM
- **개별 설정 표시**(있는 경우): 개별 기간, 개별 타겟(N개 선택). muted 옅은 틴트 배경으로 구분.

### 2.8 DataShot CTA
Ratio Finder(1.5)와 동일한 구조 및 스타일.

---

## 3. 공통 사항

### 3.1 다크모드
- 모든 색상은 CSS 변수(디자인 토큰) 사용. 차트 색은 다크모드 분기 처리. 배경·텍스트·테두리 모두 테마 대응.

### 3.2 네비게이션
- Breadcrumb: SlotBoard > Slot > [시나리오명]. 각 항목 클릭 시 이동, 현재 페이지는 클릭 불가(굵게 표시).

### 3.3 에러/로딩 처리
- 데이터 없음: 플레이스홀더 메시지. 로딩: 스켈레톤 UI(구현 예정).

### 3.4 SpinX 연동
- **버튼 위치**: 결과 화면 우측 하단 고정. 패널 열림 시 패널 폭만큼 좌측으로 이동(저비용 전환).
- **패널 연동**: 결과 화면에서는 fixed 포지셔닝. 패널 열림 시 메인 콘텐츠가 패널 폭만큼 밀림.
- **컨텍스트 전달**: 시나리오명, analysisType('ratioFinder' | 'reachPredictor'), 다크모드 상태.
- 화면 노출·인터랙션만 여기서 다루고, 프롬프팅·기능 상세는 `SpinX_for_ReachCaster_Spec.md` 관할.

---

## 4. 기술 스택

- **차트 라이브러리**: Ratio Finder = ECharts(Combo chart 지원), Reach Predictor = Recharts(React 친화, Area chart 지원)
- **아이콘**: Lucide React (Target, Scale, Database, ArrowRight, SearchCheck, Info, Share2, MoreVertical, Copy, ArrowRightLeft, Trash2, Users 등)
- **상태 관리**: React useState(차트 선택·다이얼로그 상태 등 로컬 상태)

---

## 5. 개선 제안 (이 화면 한정)

이 화면(결과 화면)에서 직접 조작·발생하는 개선만 다룬다. 비교 모드 상세는 `Scenario_Comparison_Spec.md`에서 다룬다.

| 제안 | 내용 | 사용자 가치 | 상태 |
|------|------|-------------|------|
| AI 인사이트(SpinX) | 결과 컨텍스트 기반 인사이트 제공 | 수치 너머 서사·발견 제공 | 채택(구현 완료) |
| 시나리오 공유 | Share 드롭다운(Copy Link, Export to Excel) | 결과 공유·보고 활용 | 채택(구현 완료) |
| 비교 모드 | 여러 시나리오 비교 | 대안 간 전략 판단 | 채택(구현 완료, 상세 별도 스펙) |
| 로딩 스켈레톤 | 결과 로딩 중 스켈레톤 UI | 체감 지연 감소 | 미채택 |
| 링크 복사 토스트 | 복사 완료 등 토스트 피드백 | 작업 반영 즉시 확인 | 검토 필요 |
| 차트 확대/축소 | 리치커브 구간 확대 | 세밀 구간 분석 | 미채택 |

---

## 6. 참고 자료

### 6.1 관련 컴포넌트
- `RatioFinderResult.tsx`, `ReachPredictorResult.tsx`: 결과 화면
- `ReachCurveChart.tsx`: 리치커브 차트
- `ReachPredictorScoreCards.tsx`: 스코어카드
- `RatioFinderDetailTable.tsx`, `ReachPredictorDetailTable.tsx`: 상세 테이블
- `SpinXButton.tsx`, `SpinXPanel.tsx`: SpinX 버튼·패널
- `ScenarioComparisonPanel.tsx`, `ScenarioComparisonResult.tsx`: 비교 패널·결과

### 6.2 관련 스펙
- `Scenario_Creation_Spec.md` — 시나리오 생성
- `Scenario_Comparison_Spec.md` — 비교
- `SpinX_for_ReachCaster_Spec.md` — SpinX 상세
- `Scenario_Result_PDF_Export_Spec.md` — 결과 내보내기

### 6.3 디자인 시스템
- 색상·간격·모서리·그림자는 모두 CSS 변수(디자인 토큰) 기반. 정확한 값은 구현 코드/디자인 토큰이 단일 진실 공급원.
