---
inclusion: fileMatch
fileMatchPattern: 'src/components/budgetoptimizer/**'
---

# Handoff Implementation Guide — 프로덕트 수준 전달 규범

> 기획 산출물을 프론트 리워크 없이 프로덕트에 얹기 위한 스타일 전달 규범.
> "무엇을 쓰는가(토큰·사이즈)"는 `design-system-guide.md`, "어떻게 보이게"는 `ui-design-principles.md`, 여기서는 **"어떻게 전달하게(스타일 형식)"**를 다룬다.
> 근거·배경: `plan/Zero_Rework_Handoff_Project.md`, `plan/decisions/Handoff_Rework_Judgment.md`

---

## 0. 한 줄 원칙

> **Budget Optimizer(`BO*`) 화면의 고유 스타일은 Tailwind 유틸리티 클래스로 작성한다.**
> Tailwind로 표현하기 복잡한 경우(애니메이션·차트 등)에만 CSS Module로 분리한다.
> 공통 클래스와 디자인 토큰은 그대로 쓰고, 동적 값만 인라인에 남긴다.

---

## 1. 모듈별 스타일 형식 (반드시 구분)

프로덕트가 모듈마다 스타일을 다르게 관리하므로, 산출물도 이를 따른다.

| 모듈 | 스타일 형식 | 규칙 |
|---|---|---|
| **Budget Optimizer (`src/components/budgetoptimizer/`)** | Tailwind 우선 + 공통 클래스 | 고유 레이아웃은 Tailwind 유틸. 복잡 스타일만 CSS Module. 이 가이드 적용 대상 |
| slot / reachcaster / datashot | 인라인 유지 | **변경 금지.** 프로덕트도 인라인으로 받는다 |

> 이 가이드는 `budgetoptimizer` 경로에만 적용된다. 다른 모듈 파일에는 적용하지 않는다.

---

## 2. Budget Optimizer 작성 규칙

### 2.1 우선순위 — Tailwind → CSS Module → 인라인

1. **Tailwind 유틸리티 (기본)**: 레이아웃·간격·타이포·색 등 정적 스타일은 Tailwind 클래스로 작성한다.
   - 예: `<div className="flex items-center justify-between mb-4">`
   - 예: `<h1 className="text-2xl font-semibold">`
2. **CSS Module (예외)**: Tailwind로 표현하기 복잡하거나 장황해지는 경우에만 `<컴포넌트명>.module.css`로 분리한다.
   - 대상: keyframes 애니메이션, 차트 커스텀 스타일, 복잡한 selector/의사요소 조합 등.
   - 단순 레이아웃을 CSS Module로 빼지 않는다. (프론트가 컴포넌트 분리 시 추가 작업이 발생함)
3. **인라인 (동적 값만)**: 런타임에 계산되는 값만 인라인에 남긴다.
   - 예: `style={{ width: \`${percent}%\` }}`, 조건부 색상 등.

### 2.2 색·토큰을 Tailwind에서 쓰는 법

- 디자인 토큰은 임의 값(arbitrary value) 문법으로 사용한다: `bg-[hsl(var(--primary))]`, `text-[hsl(var(--muted-foreground))]`.
- **HEX 하드코딩 금지** (다크모드 깨짐). 투명도 틴트는 한 겹만: `bg-[hsl(var(--primary)/0.08)]`.
- 다크모드는 `.dark` 클래스 기반 `dark:` variant를 사용한다. (globals.css에 `@custom-variant dark` 등록됨)

### 2.3 공통 클래스 — 그대로 사용 (Tailwind로 대체하지 말 것)

- `btn`, `input`, `card`, `dropdown`, `workspace-content`, `custom-scrollbar` 등 글로벌 공통 클래스는 **그대로 `className`으로 사용**한다.
- 이들을 Tailwind 유틸 조합이나 CSS Module로 복제하지 않는다. 프로덕트와 동일하게 유지한다.
- 공통 클래스 + Tailwind 보정이 필요하면 병기한다: `className="btn btn-ghost border border-[hsl(var(--border))]"`.

### 2.4 조건부 클래스

- 별도 유틸 없이 템플릿 리터럴로 조합한다. (이 프로젝트엔 `clsx`/`cn` 없음)
  - 예: `className={\`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}\`}`

---

## 3. 예시

```tsx
// BOScenarioList.tsx — Tailwind 우선
<div>
  <div className="flex items-center justify-between mb-4">
    <h1 className="text-2xl font-semibold">Budget Optimizer</h1>
    <button className="btn btn-primary">New Scenario</button>{/* 공통 클래스는 그대로 */}
  </div>

  {/* 동적 값만 인라인 */}
  <div className="h-2 rounded bg-[hsl(var(--bo-accent))]" style={{ width: `${ratio}%` }} />
</div>
```

```tsx
// 복잡 스타일(애니메이션)만 CSS Module로 분리
import styles from './BODiagram.module.css'
<div className={styles.pulseRing} />
```

```css
/* BODiagram.module.css — Tailwind로 장황해지는 애니메이션만 */
.pulseRing { animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
```

---

## 4. 셀프 체크 (BO 파일 작성/수정 시)

- [ ] 정적 레이아웃/간격/타이포를 **Tailwind 유틸리티**로 작성했나?
- [ ] CSS Module은 애니메이션·차트 등 **복잡 스타일에만** 썼나? (단순 레이아웃을 모듈로 빼지 않았나)
- [ ] 인라인에 남은 건 **동적 값뿐**인가?
- [ ] 공통 클래스(`btn`/`input`/`card`/`dropdown`)를 그대로 썼나? (Tailwind로 복제하지 않았나)
- [ ] 색·radius를 토큰(`hsl(var(--...))`)으로 썼나? HEX 하드코딩은 없나?
- [ ] slot/reachcaster/datashot 파일을 건드리지 않았나?
