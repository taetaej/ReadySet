# SpinX Symbol 적용 가이드

## 파일 구성

| 파일 | 용도 |
|------|------|
| `spinx-square-symbol-static.svg` | 원본 SVG (모든 모션 지원, data-motion="static") |
| `spinx-square-symbol-animated.svg` | 원본 SVG (data-motion="active" 기본) |
| `spinx-symbol-embed.html` | 독립형 데모 + 코드 스니펫 |
| `spinx-static.png` | 정적 PNG (애니메이션 불필요 시) |
| `spinx-icon-static.png` | 소형 아이콘 PNG |

---

## 적용 방법

### 방법 1: Inline SVG (권장 — 애니메이션 지원)

SVG 코드를 HTML에 직접 삽입합니다.

```html
<svg class="spinx-symbol" data-motion="idle"
     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
     width="48" height="48" role="img" aria-label="SpinX">
  <!-- style + defs + g 태그 전체 포함 -->
  <!-- spinx-symbol-embed.html 파일의 첫 번째 SVG 블록을 그대로 복사 -->
</svg>
```

### 방법 2: React / Next.js 컴포넌트

```tsx
// SpinXSymbol.tsx
import { CSSProperties } from 'react';

type SpinXMotion = 'static' | 'idle' | 'hover' | 'active' | 'engage' | 'settle';

interface Props {
  motion?: SpinXMotion;
  size?: number;
  style?: CSSProperties;
  className?: string;
}

export function SpinXSymbol({ motion = 'idle', size = 48, style, className }: Props) {
  return (
    <svg
      className={`spinx-symbol ${className || ''}`}
      data-motion={motion}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      role="img"
      aria-label="SpinX"
      style={style}
    >
      {/* SVG 내부 코드 전체 (style, defs, g) */}
    </svg>
  );
}
```

사용:
```tsx
<SpinXSymbol motion="idle" size={32} />
<SpinXSymbol motion="active" size={64} />
```

### 방법 3: PNG (정적만 필요한 경우)

```html
<img src="/spinx-static.png" alt="SpinX" width="48" height="48" />
```

Next.js:
```tsx
import Image from 'next/image';
<Image src="/spinx-static.png" alt="SpinX" width={48} height={48} />
```

---

## 모션 상태 설명

| data-motion | 동작 | 사용 시점 |
|---|---|---|
| `static` | 정지 | 로고, 파비콘, 정적 배치 |
| `idle` | 미세 호흡 (느린 스케일) | 기본 상태, 대기 중 |
| `hover` | idle + 호버 시 회전 활성화 | 버튼, 인터랙티브 요소 |
| `active` | 연속 양방향 회전 | AI 처리 중, 로딩 |
| `engage` | 짧은 버스트 (180° 회전) | 클릭/열기 순간 |
| `settle` | 원위치 복귀 | 닫기/완료 후 |

---

## JavaScript로 모션 전환

```js
const symbol = document.querySelector('.spinx-symbol');

// 상태 변경
symbol.dataset.motion = 'active';

// 예: 클릭 시 engage → 1.2초 후 idle 복귀
symbol.dataset.motion = 'engage';
setTimeout(() => { symbol.dataset.motion = 'idle'; }, 1200);
```

React:
```tsx
const [motion, setMotion] = useState<SpinXMotion>('idle');

<SpinXSymbol motion={motion} size={48} />

// 처리 시작
setMotion('active');
// 처리 완료
setMotion('settle');
setTimeout(() => setMotion('idle'), 1400);
```

---

## 주의사항

- 배경은 투명합니다. 어두운 배경에서 가장 잘 보입니다.
- SVG를 `<img>` 태그로 넣으면 CSS 애니메이션이 작동하지 않습니다. 반드시 inline SVG로 삽입하세요.
- 한 페이지에 여러 개를 넣을 경우, gradient/filter ID가 충돌할 수 있습니다. 접미사를 추가하세요 (예: `spinx-cyan-band-2`).
- `prefers-reduced-motion` 미디어쿼리를 지원합니다 (접근성).

---

## 크기 가이드

| 용도 | 권장 크기 |
|------|----------|
| GNB 아이콘 | 24–32px |
| 버튼 내 심볼 | 36–48px |
| 카드/히어로 | 64–96px |
| 풀사이즈 배치 | 128px+ |
