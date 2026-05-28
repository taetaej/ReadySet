# Docs 콘텐츠 작업 가이드

## 파일 구조

```
src/components/docs/
├── docsData.ts              ← 타입 정의 + 전체 섹션 조합 (수정 거의 없음)
├── DocsLayout.tsx           ← 레이아웃 컴포넌트 (수정 거의 없음)
├── docs.css                 ← 스타일 (수정 거의 없음)
├── content/                 ← ⭐ 콘텐츠 작업 폴더 (여기서 작업)
│   ├── getStarted.ts        ← Get Started 섹션
│   ├── slotboard.ts         ← SlotBoard 섹션
│   ├── datashot.ts          ← DataShot 섹션
│   ├── disabled.ts          ← Ad Curator + Budget Optimizer (준비중)
│   ├── reachCaster.ts       ← Reach Caster 섹션
│   ├── spinx.ts             ← SpinX 섹션
│   ├── resources.ts         ← Resources 섹션
│   └── releaseNotes.ts      ← Release Notes 섹션
│
public/docs/images/          ← ⭐ 이미지 폴더
├── get-started/
│   ├── 001.png
│   └── 002.png
├── slotboard/
│   ├── 001.png
│   └── 002.png
├── datashot/
├── reach-caster/
├── spinx/
└── resources/
```

---

## 콘텐츠 작업 방법

### 1. 자기 담당 파일만 수정

각 섹션은 독립 파일이므로 **자기 담당 파일만 수정**하면 됩니다.
다른 파일을 건드릴 필요 없습니다.

### 2. 페이지 추가 방법

해당 섹션 파일의 `pages` 배열에 새 객체를 추가합니다:

```typescript
{
  id: 'reach-caster-new-page',     // 고유 ID (섹션명-페이지명)
  title: '새 페이지 제목',            // 좌측 TOC에 표시되는 이름
  slug: 'reach-caster-new-page',   // URL 경로 (/docs/reach-caster-new-page)
  updatedAt: '2026-05-28',         // 마지막 수정일 (선택)
  content: `# 제목

본문 내용...`
}
```

### 3. 마크다운 문법 (지원 범위)

| 문법 | 예시 | 비고 |
|------|------|------|
| 제목 | `# H1`, `## H2`, `### H3` | H1은 페이지 제목, H2/H3은 우측 미니 TOC에 표시 |
| 볼드 | `**텍스트**` | |
| 인라인 코드 | `` `코드` `` | |
| 리스트 | `- 항목` | 불릿 리스트 |
| 번호 리스트 | `1. 항목` | |
| 이미지 | `![설명](/docs/images/섹션명/001.png)` | public 폴더 기준 경로 |
| 링크 | `[텍스트](URL)` | |

### 4. 이미지 추가 방법

1. 이미지를 `public/docs/images/{섹션명}/` 폴더에 넣기
2. 파일명 규칙: `001.png`, `002.png`, `003.png` (시퀀스)
3. 콘텐츠에서 참조: `![설명](/docs/images/reach-caster/001.png)`

**파일명 규칙:**
```
public/docs/images/
├── get-started/001.png      ← Get Started 첫 번째 이미지
├── reach-caster/001.png     ← Reach Caster 첫 번째 이미지
├── reach-caster/002.png     ← Reach Caster 두 번째 이미지
└── spinx/001.png            ← SpinX 첫 번째 이미지
```

**주의:** 이미지 파싱은 추후 마크다운 렌더러 업데이트 시 지원 예정.
현재는 텍스트 기반 콘텐츠만 렌더링됩니다.

---

## 작업 시 주의사항

### ✅ DO

- 자기 담당 파일만 수정
- `slug`는 전체에서 고유해야 함 (중복 금지)
- `updatedAt`은 수정할 때마다 갱신
- 백틱 문자열(`` ` ``) 안에서 줄바꿈은 그대로 반영됨
- 커밋 전 `npx vite build`로 빌드 확인

### ❌ DON'T

- `docsData.ts` 직접 수정 (섹션 순서 변경 시에만)
- 다른 사람 담당 content 파일 수정
- `slug`에 한글 사용 (영문 kebab-case만)
- 이미지 파일명에 한글/공백 사용
- Admin 역할을 권한 표나 본문에 표기 (Admin은 시스템 관리자이므로 사용자 가이드에 노출하지 않음)
- 아이콘명, 컴포넌트명 등 개발 용어를 본문에 사용 (사용자 가이드이므로 기능 설명만)

---

## 섹션 담당 배정

| 섹션 | 파일 | 담당 |
|------|------|------|
| Get Started | `getStarted.ts` | — |
| SlotBoard | `slotboard.ts` | — |
| DataShot | `datashot.ts` | — |
| Reach Caster | `reachCaster.ts` | — |
| SpinX | `spinx.ts` | — |
| Resources | `resources.ts` | — |
| Release Notes | `releaseNotes.ts` | — |

---

## 새 섹션 추가 방법 (관리자용)

1. `content/` 폴더에 새 파일 생성 (예: `newSection.ts`)
2. `DocSection` 타입에 맞게 export
3. `docsData.ts`에서 import + `docsStructure` 배열에 추가
4. 빌드 확인

---

## 로컬 확인 방법

```bash
npm run dev
# 브라우저에서 http://localhost:3000/docs 접속
```
