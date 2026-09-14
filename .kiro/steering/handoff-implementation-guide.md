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

> **Budget Optimizer(`BO*`) 화면의 고유 스타일은 인라인이 아니라 CSS Module(역할명 camelCase)로 작성한다.**
> 공통 클래스와 디자인 토큰은 그대로 쓰고, 동적 값만 인라인에 남긴다.

---

## 1. 모듈별 스타일 형식 (반드시 구분)

프로덕트가 모듈마다 스타일을 다르게 관리하므로, 산출물도 이를 따른다.

| 모듈 | 스타일 형식 | 규칙 |
|---|---|---|
| **Budget Optimizer (`src/components/budgetoptimizer/`)** | CSS Module + 공통 클래스 | 고유 레이아웃은 `*.module.css`로. 이 가이드 적용 대상 |
| slot / reachcaster / datashot | 인라인 유지 | **변경 금지.** 프로덕트도 인라인으로 받는다 |

> 이 가이드는 `budgetoptimizer` 경로에만 적용된다. 다른 모듈 파일에는 적용하지 않는다.

---

## 2. Budget Optimizer 작성 규칙

### 2.1 CSS Module로 뺄 것 / 남길 것

- **CSS Module로 뺀다**: 정적인 레이아웃·간격·타이포. (`display:flex`, `gap`, `margin`, `padding`, `fontSize`, `fontWeight`, `gridTemplateColumns`, `width/height` 등)
- **인라인에 남긴다**: 런타임에 계산되는 **동적 값만**. (예: `style={{ width: \`${percent}%\` }}`, 조건부 색상 등)
- 정적 스타일을 인라인에 남기지 않는다.

### 2.2 파일·적용 방식

- 컴포넌트당 CSS Module 1개: `<컴포넌트명>.module.css` (예: `BOScenarioList.module.css`).
- `import styles from './<컴포넌트명>.module.css'` 후 `className={styles.역할명}`.
- 조건부 클래스는 템플릿 리터럴 또는 배열 join으로 조합한다. (별도 유틸 없음 — 이 프로젝트엔 `clsx`/`cn` 없음)

### 2.3 네이밍

- 엄격한 BEM은 적용하지 않는다.
- CSS Module 내 클래스는 **의미 있는 역할명을 camelCase**로 작성한다.
- 표준 역할명 예: `container`, `header`, `actionBar`, `trigger`, `dropdown`, `dropdownItem`, `selectedItem`, `title`, `count`, `row`, `cell`.

### 2.4 공통 클래스 — 그대로 사용 (모듈로 빼지 말 것)

- `btn`, `input`, `card`, `dropdown`, `workspace-content`, `custom-scrollbar` 등 글로벌 공통 클래스는 **그대로 `className`으로 사용**한다.
- 이들을 CSS Module로 복제/이관하지 않는다. 프로덕트와 동일하게 유지한다.

### 2.5 디자인 토큰 — 값 그대로

- 색·radius 등은 `hsl(var(--primary))`, `hsl(var(--muted-foreground))`, `var(--radius)`, 시그니처 그린 `hsl(var(--bo-accent))` 형태로 사용한다.
- **HEX 하드코딩 금지** (다크모드 깨짐). 투명도 틴트는 한 겹만: `hsl(var(--primary) / 0.08)`.

---

## 3. 예시

```tsx
// BOScenarioList.tsx
import styles from './BOScenarioList.module.css'

<div className={styles.container}>
  <div className={styles.header}>
    <h1 className={styles.title}>Budget Optimizer</h1>
    <button className="btn btn-primary">New Scenario</button>{/* 공통 클래스는 그대로 */}
  </div>

  {/* 동적 값만 인라인 */}
  <div className={styles.bar} style={{ width: `${ratio}%` }} />
</div>
```

```css
/* BOScenarioList.module.css */
.container { padding: 0; }
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.title { font-size: 24px; font-weight: 600; }
.bar { height: 8px; background: hsl(var(--bo-accent)); border-radius: var(--radius); }
```

---

## 4. 셀프 체크 (BO 파일 작성/수정 시)

- [ ] 정적 레이아웃/간격/타이포를 인라인이 아니라 `*.module.css`에 두었나?
- [ ] 인라인에 남은 건 **동적 값뿐**인가?
- [ ] 공통 클래스(`btn`/`input`/`card`/`dropdown`)를 그대로 썼나? (모듈로 복제하지 않았나)
- [ ] 색·radius를 토큰(`hsl(var(--...))`)으로 썼나? HEX 하드코딩은 없나?
- [ ] CSS Module 클래스명이 역할명 camelCase인가?
- [ ] slot/reachcaster/datashot 파일을 건드리지 않았나?
