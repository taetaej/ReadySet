# Ratio Finder Step 2 컴포넌트 분리 가이드

> 🎯 **목표**: CreateScenario.tsx에서 Ratio Finder Step 2를 분리하여 800줄로 줄이기
> 
> ⏱️ **예상 소요 시간**: 40~50분
> 
> ⚠️ **난이도**: 높음 (복잡한 state 관리 포함)

---

## 📋 사전 준비

### 1. 현재 상태 확인
- CreateScenario.tsx: 1520줄
- Ratio Finder Step 2: 약 700줄 (404~1100번째 줄)
- 목표: 800줄 이하

### 2. 백업 생성
```bash
copy src\components\CreateScenario.tsx src\components\CreateScenario.before-rf.tsx
```

---

## 🔍 STEP 1: Ratio Finder Step 2 범위 확인 (5분)

### 1-1. 시작 지점 찾기
**Ctrl + F**로 검색: `{formData.moduleType === 'Ratio Finder' && (`

약 404번째 줄에서 시작:
```typescript
{formData.moduleType === 'Ratio Finder' && (
  <>
    {/* 총 예산 */}
    ...
```

### 1-2. 종료 지점 찾기
**Ctrl + F**로 검색: `{formData.moduleType === 'Reach Predictor' && (`

약 1100번째 줄 직전에서 종료:
```typescript
    </>
  )}

  {formData.moduleType === 'Reach Predictor' && (
```

### 1-3. 포함되는 내용
- 총 예산 입력
- 시뮬레이션 단위 선택
- 매체별 예산 배분 (DIGITAL/TV 탭)
- 매체 선택 체크박스
- 비중 입력
- 상품 선택 다이얼로그
- 상품 비중 입력
- 합계 검증

---

## 🛠️ STEP 2: 완전한 컴포넌트 파일 생성 (15분)

### 2-1. 파일 생성
`src/components/scenario/ScenarioStep2RatioFinder.complete.tsx` 파일을 새로 만드세요.

### 2-2. 기본 구조 작성

아래 코드를 **전체 복사해서 붙여넣기**:

```typescript
import { X } from 'lucide-react'
import { type ScenarioFormData, mediaData, numberToKorean } from './index'

interface ScenarioStep2RatioFinderProps {
  formData: ScenarioFormData
  setFormData: (data: ScenarioFormData) => void
  validationActive: boolean
  selectedMedia: string[]
  setSelectedMedia: (media: string[]) => void
  expandedMedia: string[]
  setExpandedMedia: (media: string[]) => void
  mediaRatios: { [key: string]: number }
  setMediaRatios: (ratios: { [key: string]: number }) => void
  productRatios: { [mediaKey: string]: { [productKey: string]: number } }
  setProductRatios: (ratios: { [mediaKey: string]: { [productKey: string]: number } }) => void
  selectedMediaCategory: 'DIGITAL' | 'TV'
  setSelectedMediaCategory: (category: 'DIGITAL' | 'TV') => void
  productSelectionDialog: { open: boolean; mediaName: string; selectedProducts: string[] }
  setProductSelectionDialog: (dialog: { open: boolean; mediaName: string; selectedProducts: string[] }) => void
  productSearchQuery: string
  setProductSearchQuery: (query: string) => void
}

export function ScenarioStep2RatioFinder(props: ScenarioStep2RatioFinderProps) {
  const {
    formData,
    setFormData,
    validationActive,
    selectedMedia,
    setSelectedMedia,
    expandedMedia,
    setExpandedMedia,
    mediaRatios,
    setMediaRatios,
    productRatios,
    setProductRatios,
    selectedMediaCategory,
    setSelectedMediaCategory,
    productSelectionDialog,
    setProductSelectionDialog,
    productSearchQuery,
    setProductSearchQuery
  } = props

  // 키보드 네비게이션 핸들러
  const handleRatioKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const inputs = Array.from(document.querySelectorAll('input[data-ratio-input]')) as HTMLInputElement[]
      const currentIndex = inputs.indexOf(e.currentTarget)
      
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        inputs[currentIndex - 1]?.focus()
      } else if (e.key === 'ArrowDown' && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1]?.focus()
      }
    }
  }

  // 매체 비중 합계 검증
  const getMediaRatioValidation = () => {
    const total = Object.values(mediaRatios).reduce((sum, ratio) => sum + ratio, 0)
    const isValid = total === 100
    return {
      total,
      isValid,
      message: isValid ? '✓ 비중 합계가 정확합니다' : `비중 합계가 ${total}%입니다. 100%로 맞춰주세요.`
    }
  }

  // 상품 비중 합계 검증
  const getProductRatioValidation = (mediaKey: string) => {
    const total = Object.values(productRatios[mediaKey] || {}).reduce((sum, val) => sum + val, 0)
    const isValid = total === 100
    return {
      total,
      isValid,
      message: isValid ? '✓ 비중 합계가 정확합니다' : `비중 합계가 ${total}%입니다. 100%로 맞춰주세요.`
    }
  }

  const mediaValidation = getMediaRatioValidation()

  return (
    <div style={{ width: '800px' }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '24px'
      }}>
        상세 설정 - Ratio Finder
      </h2>
      
      {/* 여기에 CreateScenario.tsx의 404~1100번째 줄 내용을 붙여넣을 예정 */}
      {/* PLACEHOLDER - 다음 단계에서 채울 것 */}
      
    </div>
  )
}
```

**Ctrl + S** 저장

---

## 📝 STEP 3: CreateScenario.tsx에서 코드 복사 (15분)

### 3-1. 복사할 범위 선택

1. CreateScenario.tsx 파일 열기
2. **Ctrl + G** → `404` 입력 (404번째 줄로 이동)
3. 다음 줄부터 선택 시작:
   ```typescript
   <>
     {/* 총 예산 */}
   ```
4. **Ctrl + F**로 `{formData.moduleType === 'Reach Predictor'` 검색
5. 그 직전 줄까지 선택:
   ```typescript
     </>
   )}
   ```
6. **Ctrl + C**로 복사

### 3-2. 컴포넌트에 붙여넣기

1. `ScenarioStep2RatioFinder.complete.tsx` 파일 열기
2. `{/* PLACEHOLDER - 다음 단계에서 채울 것 */}` 줄을 찾기
3. 이 줄을 **삭제**
4. **Ctrl + V**로 복사한 코드 붙여넣기

### 3-3. 불필요한 부분 제거

붙여넣은 코드에서 **첫 줄과 마지막 줄 제거**:
- 첫 줄: `<>` 삭제
- 마지막 줄: `</>` 삭제

**최종 구조:**
```typescript
export function ScenarioStep2RatioFinder(props: ScenarioStep2RatioFinderProps) {
  // ... props 및 함수들 ...

  return (
    <div style={{ width: '800px' }}>
      <h2>상세 설정 - Ratio Finder</h2>
      
      {/* 총 예산 */}
      <div style={{ marginBottom: '24px' }}>
        ...
      </div>

      {/* 시뮬레이션 단위 */}
      ...

      {/* 매체별 예산 배분 */}
      ...
      
    </div>
  )
}
```

**Ctrl + S** 저장

---

## 🔧 STEP 4: index.ts에 export 추가 (2분)

`src/components/scenario/index.ts` 파일 열기

**기존:**
```typescript
export * from './types'
export * from './constants'
export * from './utils'
export { ScenarioStep1 } from './ScenarioStep1'
export { ScenarioStep2ReachPredictor } from './ScenarioStep2ReachPredictor'
export { ReachPredictorMediaDialog } from './ReachPredictorMediaDialog'
```

**변경 후:**
```typescript
export * from './types'
export * from './constants'
export * from './utils'
export { ScenarioStep1 } from './ScenarioStep1'
export { ScenarioStep2ReachPredictor } from './ScenarioStep2ReachPredictor'
export { ScenarioStep2RatioFinder } from './ScenarioStep2RatioFinder.complete'
export { ReachPredictorMediaDialog } from './ReachPredictorMediaDialog'
```

**Ctrl + S** 저장

---

## 🔄 STEP 5: CreateScenario.tsx에서 교체 (10분)

### 5-1. Import 추가

CreateScenario.tsx 파일 상단 (약 6~16번째 줄):

**기존:**
```typescript
import { 
  ScenarioStep1, 
  ScenarioStep2ReachPredictor,
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

**변경 후:**
```typescript
import { 
  ScenarioStep1,
  ScenarioStep2RatioFinder,
  ScenarioStep2ReachPredictor,
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

**Ctrl + S** 저장

### 5-2. Ratio Finder Step 2 교체

**Ctrl + F**로 검색: `{formData.moduleType === 'Ratio Finder' && (`

약 404번째 줄에서 시작하는 전체 블록을 찾으세요:

**기존 (약 700줄):**
```typescript
{formData.moduleType === 'Ratio Finder' && (
  <>
    {/* 총 예산 */}
    <div style={{ marginBottom: '24px' }}>
      ...
    </div>
    
    {/* 시뮬레이션 단위 */}
    ...
    
    {/* 매체별 예산 배분 */}
    ...
    
    {/* 엄청 긴 코드 */}
    ...
  </>
)}
```

**변경 후 (7줄):**
```typescript
{formData.moduleType === 'Ratio Finder' && (
  <ScenarioStep2RatioFinder
    formData={formData}
    setFormData={setFormData}
    validationActive={validationActive}
    selectedMedia={selectedMedia}
    setSelectedMedia={setSelectedMedia}
    expandedMedia={expandedMedia}
    setExpandedMedia={setExpandedMedia}
    mediaRatios={mediaRatios}
    setMediaRatios={setMediaRatios}
    productRatios={productRatios}
    setProductRatios={setProductRatios}
    selectedMediaCategory={selectedMediaCategory}
    setSelectedMediaCategory={setSelectedMediaCategory}
    productSelectionDialog={productSelectionDialog}
    setProductSelectionDialog={setProductSelectionDialog}
    productSearchQuery={productSearchQuery}
    setProductSearchQuery={setProductSearchQuery}
  />
)}
```

### 5-3. 교체 방법

**방법 1: 수동 교체 (추천)**
1. 기존 코드 전체 선택 (404~1100번째 줄)
2. **Delete** 키로 삭제
3. 위의 "변경 후" 코드를 복사해서 붙여넣기

**방법 2: 찾아 바꾸기**
- 너무 길어서 비추천

**Ctrl + S** 저장

---

## ✅ STEP 6: 검증 및 테스트 (5분)

### 6-1. 에러 확인
- VS Code에서 빨간 밑줄이 없는지 확인
- 터미널에서 컴파일 에러 확인

### 6-2. 파일 크기 확인
```bash
$file = "src\components\CreateScenario.tsx"; $lines = (Get-Content $file | Measure-Object -Line).Lines; Write-Output "CreateScenario.tsx: $lines lines"
```

**예상 결과**: 약 800~850줄

### 6-3. 브라우저 테스트
1. 개발 서버 실행: `npm run dev`
2. 시나리오 생성 화면 열기
3. Ratio Finder 선택
4. Step 2로 이동
5. 모든 기능 테스트:
   - 총 예산 입력
   - 시뮬레이션 단위 선택
   - DIGITAL/TV 탭 전환
   - 매체 선택
   - 비중 입력
   - 상품 선택
   - 상품 비중 입력
   - 합계 검증

---

## 🆘 문제 해결

### 에러: "Cannot find module './scenario'"
**원인**: index.ts에 export가 없음

**해결**:
```typescript
// src/components/scenario/index.ts
export { ScenarioStep2RatioFinder } from './ScenarioStep2RatioFinder.complete'
```

### 에러: "Property 'xxx' does not exist"
**원인**: Props 타입이 맞지 않음

**해결**: 
1. CreateScenario.tsx에서 state 이름 확인
2. 컴포넌트 props와 일치하는지 확인

### 화면이 깨짐
**원인**: JSX 구조가 잘못됨

**해결**:
1. 백업에서 복구:
   ```bash
   copy src\components\CreateScenario.before-rf.tsx src\components\CreateScenario.tsx
   ```
2. 처음부터 다시 시도

### 기능이 작동하지 않음
**원인**: State 연결이 잘못됨

**해결**:
1. 브라우저 F12 콘솔 확인
2. 에러 메시지 확인
3. Props 이름이 정확한지 확인

---

## 📊 최종 결과

### Before
- CreateScenario.tsx: 1520줄
- 구조: Step 1 (컴포넌트) + Step 2 RF (인라인) + Step 2 RP (컴포넌트)

### After
- CreateScenario.tsx: **약 820줄** (46% 감소!)
- 구조: 모든 Step이 컴포넌트로 분리

### 파일 구조
```
src/components/
├── CreateScenario.tsx (820줄) ← 메인 파일
└── scenario/
    ├── ScenarioStep1.tsx (712줄)
    ├── ScenarioStep2RatioFinder.complete.tsx (700줄) ← 새로 생성!
    ├── ScenarioStep2ReachPredictor.tsx (282줄)
    ├── ReachPredictorMediaDialog.tsx (549줄)
    ├── types.ts
    ├── constants.ts
    ├── utils.ts
    └── index.ts
```

---

## 💡 팁

1. **천천히 진행**: 한 단계씩 확인하면서
2. **자주 저장**: Ctrl + S 습관화
3. **백업 활용**: 문제 생기면 바로 복구
4. **테스트 필수**: 각 단계마다 확인
5. **에러 무시 금지**: 빨간 밑줄 보이면 바로 수정

---

## 🎯 성공 기준

- ✅ CreateScenario.tsx가 800~850줄
- ✅ 컴파일 에러 없음
- ✅ Ratio Finder Step 2 정상 작동
- ✅ 모든 기능 유지
- ✅ 브라우저에서 테스트 완료

---

**작업 완료 후 이 가이드는 보관하세요!**
나중에 다른 컴포넌트 분리 시 참고할 수 있습니다.
