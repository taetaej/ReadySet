# 안전한 리팩토링 가이드 (실패 방지 버전)

> ⚠️ **중요**: 이전 가이드에서 실패한 이유는 들여쓰기와 괄호 매칭 문제였습니다.
> 
> 이번에는 **복사-붙여넣기 방식**으로 안전하게 진행합니다.

---

## 🎯 전략 변경

**기존 방식 (실패)**: 큰 블록을 찾아서 삭제 → 실수 발생
**새로운 방식 (안전)**: 정확한 코드를 복사해서 붙여넣기 → 실수 방지

---

## STEP 1: Import 문 교체 (안전)

### 1-1. 전체 선택 및 교체

**Ctrl + G** → `1` 입력 (1번째 줄로 이동)

**1~6번째 줄을 선택**하고 **삭제**한 후, 아래 코드를 **복사해서 붙여넣기**:

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

**Ctrl + S** 저장 → 에러 확인

---

## STEP 2: 중복 정의 삭제 (하나씩)

### 2-1. ScenarioFormData 인터페이스 삭제

**Ctrl + F** → `interface ScenarioFormData {` 검색

**정확히 이 부분을 찾으세요** (약 11~40번째 줄):

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

**이 전체를 선택해서 삭제**

**Ctrl + S** 저장 → 에러 확인

### 2-2. mediaData 삭제

**Ctrl + F** → `const mediaData = {` 검색

**시작 부분**:
```typescript
const mediaData = {
```

**끝 부분** (약 140줄 아래):
```typescript
  }
}
```

**팁**: `const mediaData = {` 줄의 `{`를 클릭하면 VS Code가 짝이 맞는 `}`를 보여줘요.

**전체 선택 후 삭제**

**Ctrl + S** 저장

### 2-3. 나머지 상수들 삭제

하나씩 찾아서 삭제:

1. **Ctrl + F** → `const unlinkedMedia = [`
   - 전체 배열 삭제
   - **Ctrl + S** 저장

2. **Ctrl + F** → `const sampleBrands = [`
   - 전체 배열 삭제
   - **Ctrl + S** 저장

3. **Ctrl + F** → `const targetGrpOptions = {`
   - 전체 객체 삭제
   - **Ctrl + S** 저장

4. **Ctrl + F** → `numberToKorean`
   - 함수 전체 삭제
   - **Ctrl + S** 저장

---

## STEP 3: 사용하지 않는 State 삭제

**하나씩 찾아서 해당 줄만 삭제**:

1. **Ctrl + F** → `const [brandSearchQuery`
   ```typescript
   const [brandSearchQuery, setBrandSearchQuery] = useState('')
   ```
   **이 줄만 삭제** → **Ctrl + S**

2. **Ctrl + F** → `const [brandDropdownOpen`
   ```typescript
   const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
   ```
   **이 줄만 삭제** → **Ctrl + S**

3. **Ctrl + F** → `const [targetGrpDialogOpen`
   ```typescript
   const [targetGrpDialogOpen, setTargetGrpDialogOpen] = useState(false)
   ```
   **이 줄만 삭제** → **Ctrl + S**

4. **Ctrl + F** → `const [startDateOpen`
   ```typescript
   const [startDateOpen, setStartDateOpen] = useState(false)
   ```
   **이 줄만 삭제** → **Ctrl + S**

5. **Ctrl + F** → `const [endDateOpen`
   ```typescript
   const [endDateOpen, setEndDateOpen] = useState(false)
   ```
   **이 줄만 삭제** → **Ctrl + S**

---

## ⚠️ STEP 4: Step 1 컴포넌트 교체 (매우 주의!)

이 부분이 가장 중요해요. 실패했던 부분입니다.

### 4-1. 교체할 위치 찾기

**Ctrl + F** → `{/* Step 1: 기본 정보 */}` 검색

이런 구조를 찾을 거예요:

```typescript
            {/* Step 1: 기본 정보 */}
            {currentStep === 1 && (
              <div style={{ width: '800px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '24px'
                }}>
                  기본 정보
                </h2>
                
                {/* 여기서부터 엄청 긴 내용 */}
                ...
                ...
                (약 800줄)
                ...
                ...
              </div>
            )}
```

### 4-2. 정확한 삭제 범위

**시작**: `{currentStep === 1 && (` 줄의 **다음 줄**부터
**끝**: 그에 해당하는 `)}` 줄의 **이전 줄**까지

**주의**: `{currentStep === 1 && (`와 `)}` 자체는 **삭제하지 마세요!**

### 4-3. 교체 방법

1. `{currentStep === 1 && (` 줄 **다음 줄**에 커서를 놓으세요

2. **Shift + Ctrl + End**를 눌러서 아래로 선택하면서
   해당하는 `)}` 줄 **이전**까지 선택

3. **삭제**

4. 아래 코드를 **복사해서 붙여넣기**:

```typescript
              <ScenarioStep1
                formData={formData}
                setFormData={setFormData}
                validationActive={validationActive}
              />
```

### 4-4. 최종 결과 확인

**이렇게 되어야 합니다**:

```typescript
            {/* Step 1: 기본 정보 */}
            {currentStep === 1 && (
              <ScenarioStep1
                formData={formData}
                setFormData={setFormData}
                validationActive={validationActive}
              />
            )}

            {/* Step 2: 상세 설정 */}
            {currentStep === 2 && (
```

**들여쓰기 확인**:
- `{currentStep === 1 && (`: 12칸 들여쓰기
- `<ScenarioStep1`: 14칸 들여쓰기
- `)}`: 12칸 들여쓰기

**Ctrl + S** 저장 → 에러 확인

---

## STEP 5: 매체 다이얼로그 교체

### 5-1. 위치 찾기

**Ctrl + F** → `{/* 매체 선택 다이얼로그 */}` 검색

### 5-2. 기존 다이얼로그 삭제

이 주석 **아래**에 있는 전체 다이얼로그 코드를 삭제:

```typescript
{rpMediaSelectionDialog && (
  <div className="dialog-overlay" ...>
    ...
    (약 400줄)
    ...
  </div>
)}
```

### 5-3. 새 컴포넌트로 교체

주석 아래에 이 코드를 붙여넣기:

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

**Ctrl + S** 저장

### 5-4. 상품 선택 다이얼로그 삭제

**Ctrl + F** → `{/* 상품 선택 다이얼로그 */}` 검색

이 주석과 아래 코드 전체 삭제:

```typescript
{/* 상품 선택 다이얼로그 */}
{rpProductSelectionDialog.open && (() => {
  ...
})()}
```

**Ctrl + S** 저장

---

## ✅ 최종 확인

### 1. 파일 저장
**Ctrl + S**

### 2. 에러 확인
- 빨간 밑줄이 없어야 함
- 터미널에 에러가 없어야 함

### 3. 브라우저 테스트
```bash
npm run dev
```

### 4. 기능 테스트
- Step 1 입력 가능한지
- Reach Predictor 매체 추가 버튼 작동하는지
- 다이얼로그 열리는지

---

## 🆘 문제 발생 시

### 에러: "Expected corresponding JSX closing tag"

**원인**: 괄호나 태그가 제대로 닫히지 않음

**해결**:
1. 백업에서 복구:
   ```bash
   copy src\components\CreateScenario.backup.tsx src\components\CreateScenario.tsx
   ```
2. 처음부터 다시 시작
3. 들여쓰기를 정확히 맞추세요

### 에러: "Cannot find module './scenario'"

**원인**: Import 문이 잘못됨

**해결**:
1. `src/components/scenario/index.ts` 파일이 있는지 확인
2. Import 문 다시 확인

---

## 💡 성공 팁

1. **한 단계씩**: 각 단계마다 저장하고 확인
2. **들여쓰기 주의**: 복사-붙여넣기 후 들여쓰기 확인
3. **괄호 매칭**: VS Code의 괄호 하이라이트 기능 활용
4. **자주 저장**: Ctrl + S를 습관화
5. **백업 활용**: 문제 생기면 바로 복구

---

**이 가이드대로 천천히 진행하면 성공할 수 있어요!**
