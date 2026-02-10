# CreateScenario.tsx 리팩토링 - 초보자용 상세 가이드

> 🎯 **목표**: 3576줄 파일을 1800줄로 줄이기 (약 50% 감소)
> 
> ⏱️ **예상 소요 시간**: 30~40분
> 
> ⚠️ **주의**: 각 단계마다 저장하고, 문제 생기면 Ctrl+Z로 되돌리세요!

---

## 📋 사전 준비

### 1. 백업 확인
- `src/components/CreateScenario.backup.tsx` 파일이 있는지 확인
- 없으면 현재 `CreateScenario.tsx`를 복사해서 백업 생성

### 2. 파일 열기
VS Code에서 다음 파일들을 열어두세요:
- `src/components/CreateScenario.tsx` (수정할 파일)
- `src/components/scenario/types.ts` (참고용)
- `src/components/scenario/constants.ts` (참고용)

### 3. 검색 기능 사용법
- **Ctrl + F**: 파일 내 검색
- **Ctrl + H**: 찾아서 바꾸기
- **Ctrl + G**: 특정 라인으로 이동

---

## 🔧 STEP 1: Import 문 수정 (5분)

### 1-1. 기존 Import 찾기
**Ctrl + G**를 누르고 `1`을 입력해서 파일 맨 위로 이동

현재 1~6번째 줄이 이렇게 되어 있을 거예요:
```typescript
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, ArrowRight, Scale, Target, X, Clock, Info, CheckCircle, AlertCircle } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { AppLayout } from './layout/AppLayout'
```

### 1-2. Import 문 교체하기

**방법 1 (추천): 직접 수정**
1. 3번째 줄에서 필요없는 아이콘 삭제:
   - 삭제할 것: `ArrowRight, Scale, Target, Info` 
   - 남길 것: `Check, ChevronLeft, ChevronRight, X, Clock, CheckCircle, AlertCircle`

2. 4~5번째 줄 완전히 삭제:
   ```typescript
   import { DayPicker } from 'react-day-picker'
   import 'react-day-picker/dist/style.css'
   ```

3. 6번째 줄 아래에 새로운 import 추가:
   ```typescript
   import { 
     ScenarioStep1, 
     ReachPredictorMediaDialog,
     type ScenarioFormData,
     type ReachPredictorMedia,
     mediaData,
     unlinkedMedia,
     sampleBrands,
     targetGrpOptions,
     numberToKorean
   } from './scenario'
   ```

**최종 결과 (1~7번째 줄):**
```typescript
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, X, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { AppLayout } from './layout/AppLayout'
import { 
  ScenarioStep1, 
  ReachPredictorMediaDialog,
  type ScenarioFormData,
  type ReachPredictorMedia,
  mediaData,
  unlinkedMedia,
  sampleBrands,
  targetGrpOptions,
  numberToKorean
} from './scenario'
```

### 1-3. 저장 및 확인
- **Ctrl + S**로 저장
- 에러가 없는지 확인 (빨간 밑줄이 생기면 오타 확인)

---

## 🗑️ STEP 2: 중복 타입 및 상수 삭제 (10분)

이제 파일에서 중복된 정의들을 삭제할 거예요. 이미 `types.ts`와 `constants.ts`에 있으니까요.

### 2-1. ScenarioFormData 인터페이스 삭제

**Ctrl + F**로 `interface ScenarioFormData` 검색

약 11~40번째 줄에 이런 코드가 있을 거예요:
```typescript
interface ScenarioFormData {
  // 공통 속성 (Step 1)
  scenarioName: string
  description: string
  moduleType: 'Ratio Finder' | 'Reach Predictor' | ''
  brand: string
  industry: string
  period: { start: string; end: string }
  targetGrp: string[]
  
  // Ratio Finder 특화 (Step 2)
  totalBudget?: number
  budgetDistribution?: {
    [mediaKey: string]: {
      ratio: number
      products: {
        [productKey: string]: number
      }
    }
  }
  simulationUnit?: '5%' | '10%' | '20%' | ''
  
  // Reach Predictor 특화 (Step 2)
  mediaBudget?: any
  targeting?: any
  reachCurve?: any
}
```

**이 전체를 삭제하세요** (약 30줄)

### 2-2. mediaData 상수 삭제

**Ctrl + F**로 `const mediaData = {` 검색

약 42~180번째 줄에 엄청 긴 객체가 있을 거예요:
```typescript
const mediaData = {
  DIGITAL: {
    'Google Ads': [
      '범퍼애드_CPM',
      // ... 엄청 많은 데이터 ...
    ],
    // ... 더 많은 매체들 ...
  },
  TV: {
    // ... TV 데이터 ...
  }
}
```

**찾는 방법:**
1. `const mediaData = {` 줄을 찾으세요
2. 그 줄부터 시작해서 아래로 내려가면서
3. 마지막 `}` (닫는 중괄호)를 찾으세요
4. **전체를 선택해서 삭제**

**팁**: 중괄호 매칭 확인
- `const mediaData = {` 줄에 커서를 놓으면
- VS Code가 짝이 맞는 `}`를 하이라이트 해줘요

### 2-3. unlinkedMedia 배열 삭제

**Ctrl + F**로 `const unlinkedMedia = [` 검색

약 5~6줄 정도의 배열:
```typescript
const unlinkedMedia = [
  'SMR', '11번가', 'CJ ONE', 'L.POINT', 'OK캐쉬백', 'SOOP', 'X(구.트위터)',
  '골프존', '네이트', '넷플릭스', '다나와', '당근', '리멤버', '마이클',
  '배달의민족', '블라인드', '스노우', '스카이스캐너', '알바몬', '에브리타임',
  '에이블리', '엔카', '오늘의집', '웨이브', '잡코리아', '직방', '치지직',
  '카카오 T', '카카오뱅크', '카카오페이', '카카오페이지', '쿠팡', '토스',
  '티맵', '티빙', '틱톡', '페이코', '해피포인트'
]
```

**전체 삭제**

### 2-4. sampleBrands 배열 삭제

**Ctrl + F**로 `const sampleBrands = [` 검색

약 9줄 정도:
```typescript
const sampleBrands = [
  { name: '갤럭시', industry: '전자/IT' },
  { name: 'QLED TV', industry: '전자/IT' },
  { name: '비스포크', industry: '가전' },
  { name: '그램', industry: '전자/IT' },
  { name: '올레드 TV', industry: '전자/IT' },
  { name: '아이오닉', industry: '자동차' },
  { name: '쏘나타', industry: '자동차' },
  { name: '네이버페이', industry: '금융/핀테크' },
  { name: '카카오톡', industry: '소셜/메신저' }
]
```

**전체 삭제**

### 2-5. targetGrpOptions 객체 삭제

**Ctrl + F**로 `const targetGrpOptions = {` 검색

약 14줄 정도:
```typescript
const targetGrpOptions = {
  male: [
    '남성 7~12세', '남성 13~18세', '남성 19~24세', '남성 25~29세',
    '남성 30~34세', '남성 35~39세', '남성 40~44세', '남성 45~49세',
    '남성 50~54세', '남성 55~59세', '남성 60~69세', '남성 70~79세'
  ],
  female: [
    '여성 7~12세', '여성 13~18세', '여성 19~24세', '여성 25~29세',
    '여성 30~34세', '여성 35~39세', '여성 40~44세', '여성 45~49세',
    '여성 50~54세', '여성 55~59세', '여성 60~69세', '여성 70~79세'
  ]
}
```

**전체 삭제**

### 2-6. numberToKorean 함수 삭제

**Ctrl + F**로 `function numberToKorean` 또는 `const numberToKorean` 검색

함수 전체를 찾아서 삭제하세요.

### 2-7. 저장 및 확인
- **Ctrl + S**로 저장
- 현재까지 약 **250~300줄 삭제**됨
- 에러 확인

---

## 🧹 STEP 3: 사용하지 않는 State 삭제 (5분)

Step 1 컴포넌트로 이동된 state들을 삭제할 거예요.

### 3-1. 삭제할 State 목록

**Ctrl + F**로 하나씩 찾아서 **해당 줄 전체 삭제**:

1. `const [brandSearchQuery, setBrandSearchQuery] = useState('')`
2. `const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)`
3. `const [targetGrpDialogOpen, setTargetGrpDialogOpen] = useState(false)`
4. `const [startDateOpen, setStartDateOpen] = useState(false)`
5. `const [endDateOpen, setEndDateOpen] = useState(false)`

### 3-2. Reach Predictor 관련 State 정리

**Ctrl + F**로 `const [rpMediaSearchQuery` 검색해서 삭제:
```typescript
const [rpMediaSearchQuery, setRpMediaSearchQuery] = useState('')
```

**Ctrl + F**로 `const [rpSelectedProducts` 검색해서 삭제:
```typescript
const [rpSelectedProducts, setRpSelectedProducts] = useState<{
  [key: string]: string[]
}>({})
```

**Ctrl + F**로 `const [rpExpandedMedia` 검색해서 삭제:
```typescript
const [rpExpandedMedia, setRpExpandedMedia] = useState<string[]>([])
```

### 3-3. 저장
- **Ctrl + S**로 저장
- 약 **8줄 추가 삭제**됨

---

## 🎨 STEP 4: Step 1을 컴포넌트로 교체 (10분)

가장 큰 작업이에요. Step 1의 긴 JSX를 작은 컴포넌트 호출로 바꿀 거예요.

### 4-1. Step 1 JSX 찾기

**Ctrl + F**로 `{currentStep === 1 && (` 검색

이런 구조를 찾을 거예요:
```typescript
{currentStep === 1 && (
  <div style={{ width: '800px' }}>
    <h2 style={{
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '24px'
    }}>
      기본 정보
    </h2>
    
    {/* 여기서부터 엄청 긴 JSX가 시작됩니다 */}
    {/* 시나리오명 입력 */}
    <div style={{ marginBottom: '24px' }}>
      ...
    </div>
    
    {/* 설명 입력 */}
    ...
    
    {/* 분석 모듈 선택 */}
    ...
    
    {/* 브랜드 선택 */}
    ...
    
    {/* 기간 선택 */}
    ...
    
    {/* 타겟 GRP 선택 */}
    ...
    
  </div>
)}
```

### 4-2. 삭제 범위 확인

**중요**: 정확한 범위를 찾아야 해요!

1. `{currentStep === 1 && (` 줄을 찾으세요
2. 그 줄부터 시작해서
3. 마지막 `)}` (닫는 괄호 2개)를 찾으세요
4. **이 사이의 모든 내용이 약 800줄**입니다

**확인 방법:**
- `{currentStep === 1 && (` 줄에 커서를 놓고
- 괄호를 클릭하면 VS Code가 짝이 맞는 괄호를 보여줘요

### 4-3. 교체하기

**전체 선택 후 삭제하고, 이렇게 교체:**

```typescript
{currentStep === 1 && (
  <ScenarioStep1
    formData={formData}
    setFormData={setFormData}
    validationActive={validationActive}
  />
)}
```

**주의**: 
- `{currentStep === 1 && (` 는 그대로 두세요
- 마지막 `)}` 도 그대로 두세요
- 그 사이만 교체하세요

### 4-4. 저장 및 확인
- **Ctrl + S**로 저장
- 약 **800줄 삭제**됨!
- 에러 확인

---

## 🎭 STEP 5: Reach Predictor 매체 다이얼로그 교체 (10분)

### 5-1. 기존 다이얼로그 찾기

**Ctrl + F**로 `{rpMediaSelectionDialog && (` 검색

엄청 긴 다이얼로그 코드가 있을 거예요 (약 400줄):
```typescript
{rpMediaSelectionDialog && (
  <div className="dialog-overlay" onClick={() => setRpMediaSelectionDialog(false)}>
    <div 
      className="dialog-content"
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '900px',
        maxHeight: '80vh',
        // ... 엄청 긴 다이얼로그 내용 ...
      }}
    >
      {/* DIGITAL 섹션 */}
      ...
      
      {/* TVC 섹션 */}
      ...
      
      {/* 버튼들 */}
      ...
    </div>
  </div>
)}
```

### 5-2. 삭제 범위 확인

1. `{rpMediaSelectionDialog && (` 줄 찾기
2. 마지막 `)}` 찾기 (약 400줄 아래)
3. 전체 선택

### 5-3. 교체하기

**전체 삭제하고 이렇게 교체:**

```typescript
<ReachPredictorMediaDialog
  open={rpMediaSelectionDialog}
  onClose={() => setRpMediaSelectionDialog(false)}
  onConfirm={(mediaItems) => {
    setReachPredictorMedia([...reachPredictorMedia, ...mediaItems])
    setRpMediaSelectionDialog(false)
  }}
/>
```

**주의**: 
- 이건 조건부 렌더링이 아니에요 (`&&` 없음)
- 컴포넌트 내부에서 `open` prop으로 제어해요

### 5-4. 상품 선택 다이얼로그도 삭제

**Ctrl + F**로 `{rpProductSelectionDialog.open && (() => {` 검색

이것도 찾아서 **전체 삭제**하세요 (새 다이얼로그에 통합됨)

### 5-5. 저장 및 확인
- **Ctrl + S**로 저장
- 약 **500줄 추가 삭제**됨!
- 에러 확인

---

## ✅ 최종 확인 및 테스트

### 1. 파일 크기 확인
- VS Code 하단에 줄 번호가 표시돼요
- 원래 3576줄 → 약 1800~2000줄로 줄었을 거예요

### 2. 에러 확인
- 빨간 밑줄이 있는지 확인
- 있으면 오타나 누락 확인

### 3. 기능 테스트
터미널에서 실행:
```bash
npm run dev
```

브라우저에서 테스트:
1. 시나리오 생성 화면 열기
2. Step 1 입력 테스트
   - 시나리오명 입력
   - 분석 모듈 선택
   - 브랜드 선택
   - 기간 선택
   - 타겟 GRP 선택
3. Reach Predictor 선택 시
   - "매체 추가" 버튼 클릭
   - 새 다이얼로그가 열리는지 확인
   - DIGITAL/TVC 섹션 확인
   - 매체 확장/축소 확인
   - 여러 상품 선택 확인

### 4. 문제 발생 시
- **Ctrl + Z**로 되돌리기
- 또는 백업 파일에서 복구:
  ```bash
  copy src\components\CreateScenario.backup.tsx src\components\CreateScenario.tsx
  ```

---

## 📊 결과 요약

### 삭제된 내용
- ✅ Import 정리: ~2줄
- ✅ 타입 정의: ~30줄
- ✅ 상수 데이터: ~220줄
- ✅ 사용하지 않는 State: ~8줄
- ✅ Step 1 JSX: ~800줄
- ✅ 매체 다이얼로그: ~500줄

**총 약 1560줄 삭제!**

### 최종 파일 크기
- **Before**: 3576줄
- **After**: 약 2016줄
- **감소율**: 43.6%

### 다음 단계 (Phase 4 대비)
추가로 분리 가능:
- Ratio Finder Step 2: ~600줄
- Reach Predictor Step 2: ~400줄
- Step 3: ~200줄

→ 최종 목표: **800~1000줄**

---

## 🆘 자주 발생하는 문제

### Q1: "ScenarioStep1을 찾을 수 없습니다" 에러
**A**: Import 문이 제대로 추가되었는지 확인
```typescript
import { ScenarioStep1 } from './scenario'
```

### Q2: "mediaData가 정의되지 않았습니다" 에러
**A**: constants.ts에서 import 했는지 확인
```typescript
import { mediaData } from './scenario'
```

### Q3: 화면이 깨져요
**A**: 
1. 브라우저 콘솔(F12) 확인
2. 에러 메시지 확인
3. 백업에서 복구 후 다시 시도

### Q4: 어디까지 삭제해야 할지 모르겠어요
**A**: 
1. 괄호 매칭 기능 사용 (괄호 클릭)
2. 코드 접기 기능 사용 (줄 번호 옆 화살표)
3. 천천히 한 섹션씩 진행

---

## 💡 팁

1. **자주 저장하세요**: Ctrl + S
2. **한 단계씩 진행**: 서두르지 마세요
3. **테스트하면서 진행**: 각 단계마다 저장 후 확인
4. **백업 활용**: 문제 생기면 바로 복구
5. **휴식 취하기**: 30분 작업 후 5분 휴식

---

**작업 완료 후 이 가이드는 삭제하지 마세요!**
나중에 다시 참고할 수 있어요.
