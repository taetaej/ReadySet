# Reach Caster 결과 화면 정의서

## 문서 정보
- **작성일**: 2026-03-05
- **버전**: v1.0
- **대상 화면**: Ratio Finder 결과, Reach Predictor 결과

---

## 1. Ratio Finder 결과 화면

### 1.1 화면 개요
TVC와 Digital 매체의 최적 예산 비중을 분석한 결과를 시각화하여 제공하는 화면

### 1.2 화면 구성

#### 1.2.1 헤더 영역 (Single Line Layout)
**레이아웃**: `(Badge) (Title) ... (Key Info) | (Share) (Info) (Menu)`

**구성 요소**:
- **분석 모듈 뱃지**: "Ratio Finder" + Scale 아이콘
  - 스타일: 검정 배경, 흰색 텍스트, 12px, 둥근 모서리
- **시나리오명**: 20px, 굵게, 말줄임 처리
- **주요 정보** (12px, muted-foreground):
  - 총 예산: ₩1,000,000,000
  - 시뮬레이션: 10% 단위
  - 타겟: N개 + 돋보기 아이콘 (클릭 시 타겟 GRP 다이얼로그)
  - 기간: YYYY-MM-DD ~ YYYY-MM-DD
  - 브랜드/업종: 브랜드명 / 업종명
- **액션 버튼**:
  - Share (드롭다운): Copy Link, Export to Excel, Export to PDF
  - Info (툴팁): 설명, Scenario ID, 생성일시, 완료일시
  - Menu (드롭다운): 복제, 이동, 삭제

#### 1.2.2 차트 영역

**차트 타입**: ECharts - Stacked Bar + Line (Combo Chart)

**차트 구성**:
1. **Stacked Bar Chart** (매체 비중)
   - X축: 11개 비중 조합 (0:100 ~ 100:0, 10% 단위)
   - Y축 (좌측): 매체 비중 (0~100%)
   - 시리즈:
     - TVC: 검정/흰색 (다크모드 대응)
     - Digital: #00FF9D (민트색)
   - 스택 방식: 100% 누적

2. **Line Chart** (통합 도달률)
   - Y축 (우측): 통합 도달률 (40~80%)
   - 색상: #B794F6 (보라색)
   - 스타일: Smooth curve, 3px 두께
   - 포인트: 원형, 8px

**색상 시스템**:
```javascript
{
  tvc: isDarkMode ? '#f5f5f5' : '#1a1a1a',
  tvcFaded: 'rgba(245/26, 245/26, 245/26, 0.4)', // 선택되지 않은 막대
  digital: '#00FF9D',
  digitalFaded: 'rgba(0, 255, 157, 0.4)',
  reach: '#B794F6',
  reachShadow: 'rgba(183, 148, 246, 0.5)'
}
```

**인터랙션**:
1. **막대 클릭**:
   - 클릭한 막대만 풀 컬러, 나머지는 페이드 처리
   - 하단 상세 테이블에 해당 조합의 데이터 표시
   - 선택 상태 유지 (selectedBarIndex)

2. **호버 (Tooltip)**:
   - 트리거: axis (세로 영역 전체)
   - 표시 내용:
     ```
     비중 조합 N
     ■ TVC: XX%
     ■ Digital: XX%
     ─────────────
     ● 통합 도달률: XX.X%
     ```
   - 스타일: 반투명 배경, 테두리, Paperlogy 폰트

3. **범례 (Legend)**:
   - 위치: 하단 우측
   - 항목: TVC, Digital, 통합 도달률
   - 인터랙션: 클릭 시 시리즈 표시/숨김

**차트 설정**:
- 애니메이션: 비활성화 (성능 최적화)
- 반응형: 부모 컨테이너 너비에 맞춤
- 폰트: Paperlogy, sans-serif

#### 1.2.3 상세 데이터 테이블

**표시 조건**: 차트에서 막대 클릭 시

**테이블 구조**:
- **헤더**: "Detailed Performance Data"
- **모집단 정보**: 46,039,423명 (코리안클릭 2026년 1월 기준)
- **컬럼**:
  - 매체 비중 (TVC / Digital)
  - 통합 도달률 (%)
  - 예상 예산 배분 (TVC / Digital)
  - 빈도 (Frequency)
  - GRP
  - CPM

**초기 상태**: 
```
차트에서 막대를 클릭하면 상세 데이터가 표시됩니다
```
(회색 배경, 중앙 정렬, 60px 패딩)

#### 1.2.4 DataShot CTA

**위치**: 테이블 하단

**구조**:
```
─────────────────────────────────────────
  [Database Icon] 이 예측을 실제 데이터와 비교해보세요
  DataShot에서 [업종명] 캠페인 성과 확인하기 →
─────────────────────────────────────────
```

**스타일**:
- 상단 구분선: 1px solid border
- 패딩: 24px 0
- 호버: 배경색 muted/0.3, 텍스트 foreground
- 클릭: `/datashot` 페이지로 이동

#### 1.2.5 타겟 GRP 다이얼로그

**트리거**: 헤더의 타겟 돋보기 아이콘 클릭

**구조**:
- **제목**: "선택한 타겟 GRP"
- **설명**: "이 시나리오에 적용된 타겟 모수입니다"
- **내용**:
  - 남성 섹션: 4x3 그리드 (12개 연령대)
  - 여성 섹션: 4x3 그리드 (12개 연령대)
  - 체크박스: 선택된 항목만 활성화 (읽기 전용)
  - 스타일: 선택된 항목은 primary 색상 테두리 + 배경

---

## 2. Reach Predictor 결과 화면

### 2.1 화면 개요
선택한 매체 믹스의 예상 도달률을 예측하고 성과를 시각화하여 제공하는 화면

### 2.2 화면 구성

#### 2.2.1 헤더 영역 (Single Line Layout)
**레이아웃**: `(Badge) (Title) ... (Key Info) | (Share) (Info) (Menu)`

**구성 요소**:
- **분석 모듈 뱃지**: "Reach Predictor" + Target 아이콘
- **시나리오명**: 20px, 굵게, 말줄임 처리
- **주요 정보** (12px, muted-foreground):
  - 총 예산: ₩1,430,000,000
  - 시뮬레이션: 8개 (매체/상품 개수) + 돋보기 아이콘
  - 타겟: N개 + 돋보기 아이콘
  - 기간: YYYY-MM-DD ~ YYYY-MM-DD
  - 브랜드/업종: 브랜드명 / 업종명
- **액션 버튼**: Ratio Finder와 동일

#### 2.2.2 레이아웃 구조

**그리드**: 4fr (좌측) : 6fr (우측)

**좌측**: Key Metrics Summary (스코어카드)
**우측**: Reach Curve Analysis (리치커브 차트)

#### 2.2.3 Key Metrics Summary

**구성**: 벤토 박스 스타일 (2x2 그리드)

**카드 항목**:
1. **예상 도달률**
   - 값: 73.2%
   - 아이콘: Target
   - 배경: 그라데이션 (primary 계열)

2. **예상 빈도**
   - 값: 3.8회
   - 아이콘: Repeat
   - 배경: 그라데이션 (accent 계열)

3. **예상 GRP**
   - 값: 278.2
   - 아이콘: TrendingUp
   - 배경: 그라데이션 (secondary 계열)

4. **평균 CPM**
   - 값: ₩9,847
   - 아이콘: DollarSign
   - 배경: 그라데이션 (muted 계열)

**스타일**:
- 카드 크기: 동일 (1fr)
- 간격: 16px
- 둥근 모서리: 12px
- 그림자: 미세한 shadow
- 다크모드 대응

#### 2.2.4 Reach Curve Analysis

**차트 타입**: Recharts - Composed Chart (Area + Line)

**차트 구성**:
1. **Area Chart** (예측 범위 - 신뢰 구간)
   - 색상: primary 색상의 투명도 0.2
   - 범위: upperBound ~ lowerBound
   - 스타일: 부드러운 곡선

2. **Line Chart** (예상 도달률)
   - 색상: primary
   - 두께: 3px
   - 스타일: Smooth curve
   - 포인트: 원형, 6px

**X축**: 예산 (3억 ~ 18억, 1.5억 단위)
- 레이블: "3.0억", "4.5억", ..., "18.0억"

**Y축**: 도달률 (60% ~ 100%)
- 레이블: "60%", "70%", "80%", "90%", "100%"
- 그리드: 점선

**Optimal Point 마커**:
- 위치: S-curve의 변곡점 (약 13.5억)
- 표시: ThumbsUp 아이콘 + "Optimal Point" 레이블
- 애니메이션: 페이드인 + 위치 계산
- 스타일: 흰색 배경, 그림자, primary 색상 텍스트

**인터랙션**:
1. **호버 (Tooltip)**:
   - 표시 내용:
     ```
     예산: XX.X억
     예상 도달률: XX.X%
     예측 범위: XX.X% ~ XX.X%
     ```
   - 스타일: 카드 스타일, 테두리, 그림자

2. **반응형**:
   - 부모 컨테이너 너비 100%
   - 높이: 400px
   - 리사이즈 시 Optimal Point 위치 재계산

**리치커브 설정 다이얼로그**:
- 트리거: 차트 제목 옆 돋보기 아이콘
- 내용:
  - 예산 상한
  - 구간 설정 (최소~최대)
  - 구간 수 기준 / 구간별 금액 기준 (라디오 버튼)

#### 2.2.5 Estimated Performance 테이블

**위치**: 차트 하단

**테이블 구조**:
- **헤더**: "Estimated Performance"
- **모집단 정보**: 46,039,423명 (우측 상단)
- **컬럼**:
  - 매체/상품명
  - 카테고리 (DIGITAL / TVC)
  - 확정 예산
  - 예상 노출
  - CPM
  - 예상 도달률
  - 예상 빈도

**스타일**:
- 카테고리 뱃지: DIGITAL (primary), TVC (accent)
- 매체명: 굵게
- 상품명: 작게, muted-foreground
- 숫자: 우측 정렬, 천 단위 구분

#### 2.2.6 매체/상품 상세 다이얼로그

**트리거**: 헤더의 시뮬레이션 돋보기 아이콘

**구조**:
- **제목**: "분석 매체/상품 상세"
- **설명**: "시나리오 생성 시 설정된 매체 및 상품 정보입니다"
- **테이블**:
  - 매체 (카테고리 뱃지)
  - 상품 (매체명 + 상품명)
  - 확정 예산 (원)
  - 예상 노출
  - CPM (원)
- **개별 설정 표시** (있는 경우):
  - 개별 기간: YYYY-MM-DD ~ YYYY-MM-DD
  - 개별 타겟: N개 선택
  - 배경: muted/0.1

#### 2.2.7 DataShot CTA

Ratio Finder와 동일한 구조 및 스타일

---

## 3. 공통 사항

### 3.1 다크모드 지원
- 모든 색상은 CSS 변수 사용 (`hsl(var(--foreground))`)
- 차트 색상은 다크모드 분기 처리
- 배경, 텍스트, 테두리 모두 테마 대응

### 3.2 폰트
- 기본: Paperlogy, sans-serif
- 크기:
  - 헤더 타이틀: 20px
  - 주요 정보: 12px
  - 차트 레이블: 11-13px
  - 테이블 헤더: 12px
  - 테이블 내용: 13px

### 3.3 반응형
- 차트: 부모 컨테이너 너비 100%
- 테이블: 가로 스크롤 (overflow-x: auto)
- 헤더: 말줄임 처리 (minWidth: 0, overflow: hidden)

### 3.4 네비게이션
- Breadcrumb: SlotBoard > Slot > [시나리오명]
- 각 항목 클릭 시 해당 페이지로 이동
- 현재 페이지는 클릭 불가 (굵게 표시)

### 3.5 에러 처리
- 데이터 없음: 플레이스홀더 메시지 표시
- 로딩 상태: 스켈레톤 UI (구현 예정)

---

## 4. 기술 스택

### 4.1 차트 라이브러리
- **Ratio Finder**: ECharts (echarts-for-react)
  - 이유: Combo chart 지원, 커스터마이징 용이
- **Reach Predictor**: Recharts
  - 이유: React 친화적, Area chart 지원

### 4.2 아이콘
- Lucide React
- 사용 아이콘: Target, Scale, Database, ArrowRight, SearchCheck, Info, Share2, MoreVertical, Copy, ArrowRightLeft, Trash2, Users

### 4.3 상태 관리
- React useState
- 로컬 상태 관리 (차트 선택, 다이얼로그 열림/닫힘)

---

## 5. 향후 개선 사항

### 5.1 단기
- [ ] 로딩 스켈레톤 UI 추가
- [ ] 토스트 메시지 (링크 복사 완료 등)
- [ ] Export 기능 실제 구현 (Excel, PDF)

### 5.2 중기
- [ ] 차트 데이터 실시간 업데이트
- [ ] 비교 모드 (여러 시나리오 비교)
- [ ] 차트 확대/축소 기능

### 5.3 장기
- [ ] AI 인사이트 추가 (최적 비중 추천 이유)
- [ ] 시나리오 공유 기능
- [ ] 커스텀 리포트 생성

---

## 6. 참고 자료

### 6.1 관련 컴포넌트
- `RatioFinderResult.tsx`: Ratio Finder 결과 화면
- `ReachPredictorResult.tsx`: Reach Predictor 결과 화면
- `ReachCurveChart.tsx`: 리치커브 차트 컴포넌트
- `ReachPredictorScoreCards.tsx`: 스코어카드 컴포넌트
- `RatioFinderDetailTable.tsx`: Ratio Finder 상세 테이블
- `ReachPredictorDetailTable.tsx`: Reach Predictor 상세 테이블

### 6.2 디자인 시스템
- 색상: CSS 변수 기반 (`--foreground`, `--background`, `--primary`, etc.)
- 간격: 4px 단위 (8px, 12px, 16px, 24px, 32px)
- 둥근 모서리: 4px, 6px, 8px, 12px
- 그림자: 미세한 shadow (0 1px 3px rgba(0,0,0,0.1))
