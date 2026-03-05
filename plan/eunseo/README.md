# 은서님 DataShot 개발 가이드 📚

## 🎯 빠른 시작

### 1. 개발 서버 실행
```bash
cd C:\Users\Mezzomedia\Desktop\ReadySet
npm run dev
```

### 2. 브라우저에서 확인
```
http://localhost:5173/datashot
```

### 3. 작업 폴더 열기
```
src/components/datashot/
```

---

## 📖 문서 목록

### 🌟 필수 읽기 (순서대로)

1. **프로젝트_현황_요약.md** ⭐⭐⭐
   - 프로젝트 전체 개요
   - 현재 구현 상태
   - 작업 우선순위
   - **가장 먼저 읽으세요!**

2. **DataShot_개발_가이드.md** ⭐⭐⭐
   - 상세한 개발 가이드
   - 코드 예제
   - 디버깅 팁
   - **개발 시 계속 참고하세요!**

3. **안전한_작업_체크리스트.md** ⭐⭐
   - 작업 전/중/후 체크리스트
   - 금지 사항
   - Git 사용법
   - **매일 확인하세요!**

---

## 🚫 절대 금지!

```
❌ src/components/layout/      (레이아웃)
❌ src/components/common/      (공통 컴포넌트)
❌ src/components/reachcaster/ (Reach Caster)
❌ src/App.tsx                 (라우팅)
❌ src/styles/globals.css      (전역 스타일)
```

## ✅ 작업 가능!

```
✅ src/components/datashot/    (DataShot 전용)
   - 이 폴더 안에서 자유롭게 작업하세요!
```

---

## 🎨 참고할 코드

### Reach Caster 코드 (복사는 OK, 수정은 NO)

```
src/components/reachcaster/
├── SlotListItem.tsx      # 시나리오 목록 아이템
├── SlotCard.tsx          # Slot 카드
├── CreateScenario.tsx    # 시나리오 생성
└── ... (기타 파일들)
```

**사용법**: 
- 코드를 보고 비슷하게 만들기 ✅
- 파일을 직접 수정하기 ❌

---

## 🔧 자주 사용하는 명령어

```bash
# 개발 서버 실행
npm run dev

# 의존성 설치
npm install

# Git 상태 확인
git status

# 변경사항 커밋
git add src/components/datashot/
git commit -m "DataShot: 작업 내용"

# 최신 코드 받기
git pull
```

---

## 📝 코드 템플릿

### 새 컴포넌트 만들기

```typescript
// src/components/datashot/MyComponent.tsx
import { useState } from 'react'
import { AppLayout } from '../layout/AppLayout'

export function MyComponent() {
  const [data, setData] = useState([])

  return (
    <AppLayout
      currentView="datashot"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: 'SlotBoard', href: '/slotboard' },
        { label: 'Slot명' },
        { label: 'Data Shot' }
      ]}
    >
      <div className="my-component">
        {/* 여기에 코드 작성 */}
      </div>
    </AppLayout>
  )
}
```

### 스타일 작성하기

```typescript
// ✅ 좋은 예 (다크모드 지원)
<div style={{
  background: 'hsl(var(--background))',
  color: 'hsl(var(--foreground))',
  border: '1px solid hsl(var(--border))'
}}>

// ❌ 나쁜 예 (다크모드 미지원)
<div style={{
  background: '#ffffff',
  color: '#000000'
}}>
```

---

## 🐛 에러 해결

### "Cannot find module" 에러
```bash
npm install
```

### "Unexpected token" 에러
```typescript
// import 경로 확인
import { Avatar } from '../common/Avatar'  // ✅
import { Avatar } from './common/Avatar'   // ❌
```

### 화면이 안 나올 때
```typescript
// 1. export 확인
export function MyComponent() { ... }  // ✅

// 2. import 확인
import { MyComponent } from './MyComponent'  // ✅
```

---

## 💡 개발 팁

### 1. 자주 저장하기
```
Ctrl + S (Windows)
Cmd + S (Mac)
```

### 2. 자주 테스트하기
```
브라우저에서 확인
콘솔 에러 확인
다크모드 확인
```

### 3. 작은 단위로 커밋하기
```bash
# 기능 하나 완성하면 바로 커밋
git add src/components/datashot/
git commit -m "DataShot: 시나리오 카드 추가"
```

### 4. 막히면 참고하기
```
1. Reach Caster 코드 보기
2. 문서 다시 읽기
3. 콘솔 로그 찍기
4. 질문하기
```

---

## 📞 질문하기

### 질문 템플릿

```markdown
## 문제 상황
- 무엇을 하려고 했나요?
- 어떤 에러가 발생했나요?

## 시도한 것
- 어떤 방법을 시도했나요?

## 코드
```typescript
// 관련 코드 첨부
```

## 스크린샷
[에러 화면 캡처]
```

---

## ✅ 매일 체크리스트

### 작업 시작 전
- [ ] `git pull` 실행
- [ ] `npm run dev` 실행
- [ ] 브라우저 확인

### 작업 중
- [ ] datashot 폴더에서만 작업
- [ ] 자주 저장
- [ ] 자주 테스트

### 작업 완료 후
- [ ] 에러 없이 실행
- [ ] 다크모드 확인
- [ ] `git status` 확인
- [ ] 커밋 메시지 작성

---

## 🎯 작업 순서 (추천)

### 1주차: 기본 이해
- [ ] 문서 읽기
- [ ] Reach Caster 코드 보기
- [ ] DataShotDetail.tsx 이해하기

### 2주차: 목록 만들기
- [ ] DataShotList.tsx 만들기
- [ ] DataShotCard.tsx 만들기
- [ ] DataShotDetail에 통합

### 3주차: 시나리오 생성
- [ ] CreateDataShot.tsx 만들기
- [ ] 입력 폼 구현
- [ ] 유효성 검사

### 4주차: 결과 화면
- [ ] DataShotResult.tsx 만들기
- [ ] 차트/테이블 구현
- [ ] Export 기능

---

## 🚀 유용한 링크

### 프로젝트 문서
- [프로젝트 현황 요약](./프로젝트_현황_요약.md)
- [개발 가이드](./DataShot_개발_가이드.md)
- [작업 체크리스트](./안전한_작업_체크리스트.md)

### 참고 문서
- [화면 스펙 가이드](../../guide/Screen_Specification_Guide.md)
- [아이콘 사용법](../../guide/Lucide_Icon_Usage_Reference.md)
- [공통 레이아웃 스펙](../spec/Common_Layout_Spec.md)

### 외부 문서
- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Lucide Icons](https://lucide.dev/)

---

## 🎉 환영합니다!

DataShot 개발을 시작하신 것을 환영합니다!

이 가이드를 따라하시면 안전하게 작업하실 수 있습니다.

**궁금한 점이 있으면 언제든지 질문하세요!**

**화이팅! 🚀**

---

## 📝 빠른 참조

### 작업 폴더
```
src/components/datashot/
```

### 개발 서버
```bash
npm run dev
# http://localhost:5173/datashot
```

### 커밋
```bash
git add src/components/datashot/
git commit -m "DataShot: 작업 내용"
```

### 도움말
```
1. 프로젝트_현황_요약.md 읽기
2. DataShot_개발_가이드.md 참고
3. 안전한_작업_체크리스트.md 확인
```

---

**마지막 업데이트**: 2026-03-05
