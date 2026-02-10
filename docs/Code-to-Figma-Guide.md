# Code to Figma 변환 가이드

## 📋 필수 문서화 항목

### 1. Design Tokens 정의
- [ ] CSS Custom Properties 정리
- [ ] Spacing scale (8px grid)
- [ ] Typography scale
- [ ] Color palette
- [ ] Border radius values

### 2. 컴포넌트 Props 문서
- [ ] TypeScript interface 정의
- [ ] 각 prop의 가능한 값
- [ ] 기본값 설정
- [ ] 사용 예시

### 3. 상태별 Variants
- [ ] Default, Hover, Active, Disabled
- [ ] Loading states
- [ ] Error states
- [ ] Success states

---

## 🏗️ HTML/CSS 최적화

### 필수 사항
- [ ] 시맨틱 HTML 구조
- [ ] 명확한 BEM 클래스명
- [ ] CSS Grid/Flexbox 레이아웃
- [ ] 일관된 spacing system
- [ ] 인라인 스타일 제거

### 금지 사항
- [ ] 복잡한 중첩 구조 (3단계 초과)
- [ ] 하드코딩된 픽셀 값
- [ ] !important 사용
- [ ] 불필요한 wrapper div

---

## 📝 Storybook 설정

### 컴포넌트별 Story
- [ ] 기본 상태
- [ ] 모든 variant
- [ ] 상호작용 상태
- [ ] 에러 케이스

### Controls 설정
- [ ] Props 타입별 적절한 control
- [ ] 실시간 미리보기
- [ ] 문서화 자동 생성

---

## 🔧 변환 워크플로우

### 1. 개발 완료 후
- [ ] Storybook에서 모든 컴포넌트 확인
- [ ] Design tokens 문서 업데이트
- [ ] Props 인터페이스 정리

### 2. 변환 실행
- [ ] Code to Figma 플러그인 사용
- [ ] HTML/CSS 코드 복사
- [ ] Figma에서 변환 및 정리

### 3. 후처리
- [ ] Auto Layout 설정
- [ ] Component Variants 생성
- [ ] Design System 구축

---

**핵심**: 단순하고 일관된 구조가 변환 품질을 결정합니다!