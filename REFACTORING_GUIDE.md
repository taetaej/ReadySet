# CreateScenario.tsx 리팩토링 가이드

## 목표
3500줄이 넘는 CreateScenario.tsx를 관리 가능한 크기로 분리

## 준비된 컴포넌트
- ✅ `src/components/scenario/types.ts` - 타입 정의
- ✅ `src/components/scenario/constants.ts` - 상수 (매체 데이터 등)
- ✅ `src/components/scenario/utils.ts` - 유틸리티 함수
- ✅ `src/components/scenario/ScenarioStep1.tsx` - Step 1 컴포넌트
- ✅ `src/components/scenario/ReachPredictorMediaDialog.tsx` - 개선된 매체 선택 다이얼로그
- ✅ `src/components/scenario/index.ts` - Export 파일

## 단계별 수동 작업

### Step 1: Import 추가 (라인 1-6)

**기존:**
```typescript
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, ArrowRight, Scale, Target, X, Clock, Info, CheckCircle, AlertCircle } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { AppLayout } from './layout/AppLayout'
```

**변경 후:**
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

### Step 2: 중복 정의 제거 (라인 11-195)

다음 항목들을 **완전히 삭제**:
- `interface ScenarioFormData` (라인 11-40)
- `const mediaData = {` (라인 42-128)
- `const unlinkedMedia = [` (라인 131-136)
- `const sampleBrands = [` (라인 139-147)
- `const targetGrpOptions = {` (라인 150-162)
- `numberToKorean` 함수 (찾아서 삭제)

### Step 3: Reach Predictor State 간소화 (라인 244-261)

**기존:**
```typescript
const [reachPredictorMedia, setReachPredictorMedia] = useState<Array<{
  id: string
  category: 'DIGITAL' | 'TVC'
  type: 'linked' | 'unlinked'
  mediaName: string
  productName?: string
  budget: string
  impressions: string
  cpm: string
  customPeriod?: { start: string; end: string }
  customTarget?: string[]
}>>([])
const [rpMediaSelectionDialog, setRpMediaSelectionDialog] = useState(false)
const [rpMediaSearchQuery, setRpMediaSearchQuery] = useState('')
const [rpSelectedProducts, setRpSelectedProducts] = useState<{
  [key: string]: string[]
}>({})
const [rpExpandedMedia, setRpExpandedMedia] = useState<string[]>([])
```

**변경 후:**
```typescript
const [reachPredictorMedia, setReachPredictorMedia] = useState<ReachPredictorMedia[]>([])
const [rpMediaSelectionDialog, setRpMediaSelectionDialog] = useState(false)
```

### Step 4: Step 1 컴포넌트로 교체 (약 라인 700-1500)

**찾을 코드:**
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
    // ... 엄청 긴 JSX ...
  </div>
)}
```

**교체할 코드:**
```typescript
{currentStep === 1 && (
  <ScenarioStep1
    formData={formData}
    setFormData={setFormData}
    validationActive={validationActive}
  />
)}
```

### Step 5: Reach Predictor 매체 다이얼로그 교체 (약 라인 2557-2981)

**찾을 코드:**
```typescript
{/* 매체 선택 다이얼로그 */}
{rpMediaSelectionDialog && (
  <div className="dialog-overlay" onClick={() => setRpMediaSelectionDialog(false)}>
    // ... 엄청 긴 다이얼로그 코드 ...
  </div>
)}

{/* 상품 선택 다이얼로그 */}
{rpProductSelectionDialog.open && (() => {
  // ... 또 다른 긴 다이얼로그 코드 ...
})()}
```

**교체할 코드:**
```typescript
{/* 매체 선택 다이얼로그 */}
<ReachPredictorMediaDialog
  open={rpMediaSelectionDialog}
  onClose={() => setRpMediaSelectionDialog(false)}
  onConfirm={(mediaItems) => {
    setReachPredictorMedia([...reachPredictorMedia, ...mediaItems])
    setRpMediaSelectionDialog(false)
  }}
/>
```

### Step 6: 사용하지 않는 State 제거

다음 state들을 찾아서 삭제:
- `const [rpSelectedCategory, setRpSelectedCategory]`
- `const [rpProductSelectionDialog, setRpProductSelectionDialog]`
- `const [rpProductSearchQuery, setRpProductSearchQuery]`
- `const [rpMediaSearchQuery, setRpMediaSearchQuery]`
- `const [rpSelectedProducts, setRpSelectedProducts]`
- `const [rpExpandedMedia, setRpExpandedMedia]`
- `const [brandSearchQuery, setBrandSearchQuery]` (Step1 컴포넌트로 이동됨)
- `const [brandDropdownOpen, setBrandDropdownOpen]` (Step1 컴포넌트로 이동됨)
- `const [targetGrpDialogOpen, setTargetGrpDialogOpen]` (Step1 컴포넌트로 이동됨)
- `const [startDateOpen, setStartDateOpen]` (Step1 컴포넌트로 이동됨)
- `const [endDateOpen, setEndDateOpen]` (Step1 컴포넌트로 이동됨)

## 예상 결과
- 기존: ~3500줄
- 리팩토링 후: ~2000줄
- 제거된 코드: ~1500줄 (별도 컴포넌트로 분리)

## 테스트 체크리스트
- [ ] Step 1 화면이 정상 작동하는지
- [ ] Reach Predictor 매체 선택 다이얼로그가 열리는지
- [ ] 매체 선택 후 테이블에 추가되는지
- [ ] 기존 Ratio Finder 기능이 정상 작동하는지
- [ ] Step 3까지 진행이 가능한지

## 주의사항
1. 백업 파일이 있음: `src/components/CreateScenario.backup.tsx`
2. 문제 발생 시 백업에서 복구 가능
3. 한 단계씩 진행하고 테스트할 것
