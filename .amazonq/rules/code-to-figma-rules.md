# Code to Figma 개발 규칙

## HTML 구조
- 시맨틱 태그 사용 (`<header>`, `<nav>`, `<main>`)
- BEM 클래스명 (`block__element--modifier`)
- 중첩 3단계 이하
- 불필요한 wrapper div 금지

## Figma Auto Layout 최적화 (핵심)
- **Gap-First**: 모든 간격은 margin 대신 gap 속성 우선 사용
- **Sizing Convention**: width: 100% = Fill, width: auto = Hug
- **컨테이너 Padding**: 모든 컨테이너에 명시적 padding 부여
- **Flexbox Simplify**: 중첩 div 최소화, 단순한 Flexbox 구조

## CSS 스타일
- CSS Grid/Flexbox만 사용
- CSS Custom Properties 필수
- 8px grid system (8, 16, 24, 32...)
- 하드코딩 픽셀값 금지
- !important 사용 금지

## 컴포넌트 설계
- Props 기반 variant 구현
- TypeScript interface 정의
- 모든 상태 외부화
- 명확한 기본값 설정

## 컴포넌트 구현 상세 가이드
- **Table & Grid**: min-width와 text-overflow: ellipsis 기본 적용
- **Interactive States**: Default, Hover, Focus, Disabled, Error 상태 명확히 구분
- **Chart Placeholder**: aspect-ratio 적용된 placeholder div로 레이아웃 밸런스 유지

## 체크리스트
- [ ] BEM 클래스명 적용
- [ ] Gap 속성 우선 사용
- [ ] 8px grid 준수
- [ ] CSS 변수 사용
- [ ] 중첩 깊이 확인
- [ ] Props 문서화
- [ ] 상태별 variant 구현

**핵심**: 단순하고 일관된 구조!