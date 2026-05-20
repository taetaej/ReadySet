# SpinX Square Symbol Animation Kit v1

이 패키지는 **square 타입 심볼 전용** 애니메이션 SVG와 React 적용 코드를 포함합니다.
심볼에는 **검정/흰색 rounded-square 타일 배경이 없습니다.** 실제 FAB 버튼의 배경은 각 솔루션 UI에서 별도로 적용하면 됩니다.

## 구성

| 파일 | 용도 |
|---|---|
| `spinx-square-symbol-animated.svg` | 단독 사용 가능한 animated SVG. 기본 `data-motion="active"` |
| `spinx-square-symbol-static.svg` | 정지 상태 SVG. 투명 배경 |
| `spinx-symbol-animation.css` | motion state별 CSS 애니메이션 |
| `SpinXSymbol.tsx` | React + TypeScript 컴포넌트 |
| `SpinXSymbol.jsx` | React + JavaScript 컴포넌트 |
| `SpinXFabExample.tsx` | FAB 버튼 적용 예시 |
| `demo.html` | 로컬 미리보기용 HTML |

## Motion State

- `idle`: 기본 대기. X 정렬감을 유지하면서 아주 약한 breathing.
- `hover`: 평소 idle, hover 시 회전.
- `engage`: 클릭/열림 순간의 짧은 activation burst.
- `active`: AI 응답 중 또는 패널 오픈 상태. 두 링이 반대 방향으로 지속 회전.
- `settle`: 완료/닫힘 후 X 정렬 상태로 복귀.
- `static`: 완전 정지.

## React 사용 예시

```tsx
import SpinXSymbol from "./SpinXSymbol";
import "./spinx-symbol-animation.css";

export function SpinXFab() {
  return (
    <button className="spinx-fab" aria-label="Open SpinX assistant">
      <SpinXSymbol size={48} motion="idle" title="" />
    </button>
  );
}
```

## 권장 적용

- FAB 기본 상태: `idle`
- 클릭 직후 0.8~1.2초: `engage`
- 패널 오픈 / 응답 생성 중: `active`
- 패널 닫힘 / 응답 종료: `settle` → `idle`

## 접근성

`prefers-reduced-motion: reduce` 환경에서는 CSS에서 애니메이션을 자동으로 중지합니다.
부모 버튼에 `aria-label`이 있으면 `<SpinXSymbol title="" />`로 전달하세요.
