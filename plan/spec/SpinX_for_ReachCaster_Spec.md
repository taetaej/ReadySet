# SpinX for Reach Caster 화면 정의서

## 문서 정보
- **작성일**: 2026-03-24
- **버전**: v1.1
- **대상 화면**: SpinX AI Agent 패널 (시나리오 결과 / 시나리오 비교 결과 내)
- **관련 컴포넌트**: `SpinXPanel.tsx`, `SpinXButton.tsx`

---

## 1. 화면 개요

### 1.1 제품 정의
SpinX for Reach Caster는 AnXer의 Spin-off AI Agent로, Reach Caster의 시나리오 분석 결과를 기반으로 사용자에게 인사이트를 제공하는 대화형 AI 어시스턴트이다.

### 1.2 호출 컨텍스트
SpinX는 다음 두 화면에서 호출 가능하다:
- **시나리오 결과 화면**: Ratio Finder 결과, Reach Predictor 결과
- **시나리오 비교 결과 화면**: 타겟/기간/예산 비교 결과

### 1.3 세션 단위
- **세션 키**: `scenarioId × userId` (시나리오 결과) 또는 `comparisonId × userId` (비교 결과)
- 동일 시나리오를 볼 수 있는 다른 사용자도 각자의 세션으로 SpinX를 호출할 수 있음
- 한 사용자가 여러 시나리오에서 동시에 SpinX를 열 수 있으나, 화면당 1개 패널만 표시

---

## 2. 세션 관리

### 2.1 세션 생명주기

| 항목 | 정의 |
|------|------|
| 세션 ID | SpinX API에서 발급. 최초 패널 오픈 시 요청 |
| 유효 기간 | 세션 생성 시점부터 **14일** (336시간) |
| 잔여 시간 표시 | 입력 영역 하단에 `N일 N시간 남음` 형태로 표시 |
| 세션 이어가기 | 14일 이내 재방문 시 이전 대화 이력 + 컨텍스트 유지 |
| 세션 만료 | 14일 경과 시 자동 만료. 이전 대화 이력 조회 불가 |
| 수동 초기화 | 사용자가 초기화 버튼으로 세션 리셋 가능. 이전 이력 완전 삭제 |

### 2.2 세션 만료 조건

| 조건 | 동작 |
|------|------|
| 14일 경과 | 세션 자동 만료. 패널 오픈 시 새 세션 생성 |
| 사용자 수동 초기화 | 확인 다이얼로그 후 세션 삭제. 새 세션 생성 |
| 시나리오 비교 결과 삭제 | 해당 비교에 연결된 SpinX 세션도 함께 만료 |
| 시나리오 결과 삭제 | 해당 시나리오에 연결된 SpinX 세션도 함께 만료 |

### 2.3 세션 저장소
- 세션 ID, 생성 시점, 만료 시점 관리 필요
- 키 형식(추천): `spinx_session_{scenarioId}_{userId}` 또는 `spinx_session_comparison_{comparisonId}_{userId}`

---

## 3. 화면 구성

### 3.1 SpinX 호출 버튼 (SpinXButton)

**위치**: 시나리오 결과 화면 우측 하단 고정

**레이아웃**:
```
position: fixed
bottom: 24px
right: 24px (패널 닫힘) / 424px (패널 열림)
z-index: 998
transition: right 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)
```

**구성 요소**:

| 요소 | 스타일 | 비고 |
|------|--------|------|
| 버튼 컨테이너 | 48px × 48px, border-radius 50% (원형) | — |
| 배경 | `hsl(var(--foreground))` | 다크모드 자동 대응 |
| 아이콘 | Rotate3d, 20px, `hsl(var(--background))` | lucide-react |
| 그림자 | `0 4px 12px rgba(0, 0, 0, 0.15)` | — |
| 호버 | `transform: scale(1.05)`, 그림자 강화 `0 6px 20px rgba(0, 0, 0, 0.2)` | transition 0.2s |
| 클릭 | `transform: scale(0.95)` | transition 0.1s |

**패널 열림 시 위치 이동**:
- `right: 24px` → `right: 424px` (패널 400px + 간격 24px)
- 동일한 cubic-bezier 이징으로 패널과 동기화

---

### 3.2 패널 레이아웃 (SpinXPanel)

**위치**: 화면 우측 사이드 패널

**레이아웃**:
```
position: fixed (또는 absolute)
top: 0
right: 0 (열림) / -400px (닫힘)
width: 400px
height: 100vh (fixed) / 100% (absolute)
z-index: 1000
```

**진입 애니메이션**: `right: -400px → 0`, 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)

**전체 구조**:
```
┌──────────────────────────────────┐
│  [A] 헤더 영역 (flexShrink: 0)   │  56px
├──────────────────────────────────┤
│                                  │
│  [B] 메시지 영역 (flex: 1)        │  가변
│      overflowY: auto             │
│                                  │
│  ┌─ 컨텍스트 요약 ─────────────┐ │
│  │ [모듈 뱃지] 시나리오명       │ │
│  │ 요약 카드              [📋] │ │
│  └──────────────────────────────┘ │
│                                  │
│  ┌─ 추천 질문 ─────────────────┐ │
│  │ 질문 버튼 × 4               │ │
│  └──────────────────────────────┘ │
│                                  │
│  [사용자 메시지] ←── 우측 정렬   │
│  [AI 응답 + 출처] ←── 좌측 전폭  │
│  ...                             │
│                                  │
├──────────────────────────────────┤
│  [C] 입력 영역 (flexShrink: 0)   │  ~100px
│  [첨부 미리보기]                  │
│  [📎][모델▾]  입력...     [▲/■] │
│  세션 잔여: 13일 22시간           │
└──────────────────────────────────┘
```

**스타일**:
- 배경: `hsl(var(--card))`
- 좌측 테두리: `1px solid hsl(var(--border))`
- 그림자: `-4px 0 24px rgba(0, 0, 0, 0.15)`
- 폰트: `Paperlogy, sans-serif`

---

### 3.3 헤더 영역 [A]

**레이아웃**: `(타이틀 블록) ... (초기화 버튼)(닫기 버튼)`

**크기**: 패딩 `20px 24px`, 하단 테두리 `1px solid hsl(var(--border))`

**구성 요소**:

| 요소 | 스타일 | 동작 |
|------|--------|------|
| 타이틀 | "SpinX for Reach Caster", 18px, fontWeight 600, Paperlogy | — |
| 서브타이틀 | "AnXer Spin-off AI Agent", 11px, `hsl(var(--muted-foreground))` | — |
| 초기화 버튼 | RotateCcw 아이콘, 16px, `btn btn-ghost btn-sm`, padding 6px | 클릭 → 초기화 확인 다이얼로그 |
| 닫기 버튼 | X 아이콘, 16px, `btn btn-ghost btn-sm`, padding 6px | 클릭 → 패널 닫기 |

**버튼 영역**: `display: flex`, `gap: 4px`

---

### 3.4 메시지 영역 [B]

**레이아웃**:
```css
flex: 1;
overflowY: auto;
overflowX: hidden;
padding: 24px 32px 24px 24px;
background: hsl(var(--background));
```

**내부 구조**: `display: flex`, `flex-direction: column`, `justify-content: flex-end` (아래에서 위로 쌓임)

**스크롤**: 새 메시지 추가 시 `scrollIntoView({ behavior: 'smooth' })` 자동 스크롤

---

#### 3.4.1 컨텍스트 요약 (패널 오픈 시 자동 수행)

패널이 열리면 현재 시나리오/비교 결과의 핵심 데이터를 자동으로 요약하여 표시한다.

**모듈 뱃지 + 시나리오명**:

| 요소 | 스타일 |
|------|--------|
| 뱃지 컨테이너 | `display: flex`, `gap: 12px`, `marginBottom: 16px`, `flexWrap: wrap` |
| 모듈 뱃지 | padding `4px 12px`, borderRadius 12px, fontSize 12px, fontWeight 500 |
| 뱃지 배경 | `hsl(var(--foreground))` |
| 뱃지 텍스트 | `hsl(var(--background))` |
| 뱃지 아이콘 | Scale 14px (Ratio Finder) / Target 14px (Reach Predictor), gap 6px |
| 시나리오명 | 16px, fontWeight 600, Paperlogy, lineHeight 1.4 |

**요약 카드**:

| 요소 | 스타일 |
|------|--------|
| 카드 컨테이너 | `hsl(var(--muted))` 배경, padding 20px, borderRadius 12px, marginBottom 16px |
| 복사 버튼 | 우측 상단 absolute, `btn btn-ghost btn-sm`, padding 6px |
| 복사 아이콘 | Copy 14px → 클릭 시 Check 14px (2초 후 복귀) |
| 요약 타이틀 | "요약", 13px, fontWeight 600, marginBottom 12px |
| 요약 내용 | 13px, lineHeight 1.7, paddingRight 32px (복사 버튼 공간 확보) |

**시나리오 결과 요약 내용**:
별도 프롬프트 생성

**비교 결과 요약 내용**:
별도 프롬프트 생성

---

#### 3.4.2 추천 질문 (패널 오픈 시 자동 수행)

컨텍스트 요약 아래에 4개의 추천 질문을 버튼 형태로 표시한다.

**구성**:

| 요소 | 스타일 |
|------|--------|
| 섹션 타이틀 | "추천 질문", 13px, fontWeight 600, marginBottom 12px |
| 질문 버튼 컨테이너 | `display: flex`, `flex-direction: column`, `gap: 8px` |
| 질문 버튼 | padding `12px 16px`, borderRadius 8px, border `1px solid hsl(var(--border))` |
| 버튼 텍스트 | 13px, `hsl(var(--foreground))`, textAlign left, Paperlogy, lineHeight 1.5 |
| 호버 | 배경 `hsl(var(--muted))`, 테두리 `hsl(var(--foreground))` |
| 클릭 | 해당 질문 텍스트를 자동 전송 (100ms 딜레이 후 handleSend) |

**질문 생성 기준**:
별도 프롬프트 생성

**타임스탬프**: 추천 질문 아래 `11px`, `hsl(var(--muted-foreground))`, "방금 전"

---

#### 3.4.3 사용자 메시지

**레이아웃**: 우측 정렬 (`textAlign: right`)

| 요소 | 스타일 |
|------|--------|
| 메시지 버블 | `display: inline-block`, maxWidth 80%, textAlign left |
| 배경 | `hsl(var(--primary))` |
| 텍스트 | `hsl(var(--primary-foreground))`, 13px, Paperlogy, lineHeight 1.6 |
| 패딩 | `12px 16px` |
| 둥근 모서리 | 12px |
| 타임스탬프 | 11px, `hsl(var(--muted-foreground))`, marginTop 4px, 우측 정렬 |

---

#### 3.4.4 AI 응답 메시지

**레이아웃**: 좌측 정렬 (전체 너비)

| 요소 | 스타일 |
|------|--------|
| 메시지 텍스트 | 13px, `hsl(var(--foreground))`, lineHeight 1.7, Paperlogy |
| 타임스탬프 | 11px, `hsl(var(--muted-foreground))`, marginTop 4px |
| 복사 버튼 | 메시지 호버 시 표시, Copy/Check 아이콘 14px, ghost 스타일 |

**특수 응답 타입**:

| 타입 | 표시 방식 |
|------|-----------|
| 텍스트 | 마크다운 스타일 렌더링 (볼드, 리스트, 줄바꿈) |
| 차트 | Recharts 기반 인라인 차트 (ComposedChart, 높이 200px) |
| 에러 | `hsl(var(--muted))` 배경, borderRadius 12px, padding 12px, AlertCircle 아이콘 + 에러 메시지 |
| 모델 변경 알림 | 중앙 정렬 pill 뱃지 (`hsl(var(--muted) / 0.5)` 배경, borderRadius 12px, 11px) |

**차트 응답 상세**:

| 요소 | 스타일 |
|------|--------|
| 차트 컨테이너 | `hsl(var(--muted))` 배경, borderRadius 12px, padding 20px |
| 차트 타이틀 | 13px, fontWeight 600, marginBottom 8px |
| 차트 설명 | 12px, `hsl(var(--muted-foreground))`, lineHeight 1.5, marginBottom 16px |
| 차트 영역 | Recharts ComposedChart, 높이 200px, Bar + Line |
| 차트 색상 | Bar: `#1a1a1a` (TVC), `#00FF9D` (Digital), Line: `#B794F6` (Reach) |
| 범례 | 하단, 11px, `hsl(var(--muted-foreground))` |

**에러 응답 상세**:

| 요소 | 스타일 |
|------|--------|
| 에러 컨테이너 | `hsl(var(--muted))` 배경, borderRadius 12px, padding 12px |
| 에러 아이콘 | AlertCircle 14px, `hsl(var(--destructive))` |
| 에러 텍스트 | 13px, `hsl(var(--foreground))` |
| 재시도 버튼 | RefreshCw 14px + "다시 시도" 텍스트, ghost 스타일 |
| 재시도 소진 시 | opacity 0.5, cursor not-allowed |

---

#### 3.4.5 출처 표시 — 웹 검색 출처 (Web Sources)

웹 검색 기반 응답에 출처 정보를 아코디언 형태로 표시한다.

**아코디언 헤더**:

| 요소 | 스타일 |
|------|--------|
| 컨테이너 | `width: 100%`, padding `8px 0`, 배경 transparent, border none |
| 아이콘 | Globe 14px, flexShrink 0 |
| 텍스트 | "웹 검색 결과 N개", 12px, fontWeight 500, `hsl(var(--muted-foreground))` |
| 화살표 | ChevronRight 14px, 접힘 `rotate(0deg)` / 펼침 `rotate(90deg)`, transition 0.2s |
| 호버 | 텍스트 색상 → `hsl(var(--foreground))` |

**펼침 시 소스 목록** (paddingLeft 22px, marginTop 4px):

| 요소 | 스타일 |
|------|--------|
| 소스 항목 | `display: flex`, gap 10px, padding `6px 0`, 링크 (`<a>` 태그) |
| 파비콘 | Globe 10px, 14px × 14px 컨테이너, opacity 0.6, marginTop 2px |
| 제목 | 11px, fontWeight 400, 말줄임 (overflow hidden, textOverflow ellipsis, whiteSpace nowrap) |
| URL | 10px, opacity 0.6, 말줄임 |
| 호버 | 전체 항목 색상 → `hsl(var(--foreground))` |
| 클릭 | 새 탭에서 URL 열기 (`target="_blank"`, `rel="noopener noreferrer"`) |

---

#### 3.4.6 출처 표시 — RAG 참고 문서 (RAG Sources)

내부 문서 검색 기반 응답에 참고 문서 정보를 아코디언 형태로 표시한다.

**아코디언 헤더**:

| 요소 | 스타일 |
|------|--------|
| 아이콘 | FileText 14px |
| 텍스트 | "참고 문서 N개", 12px, fontWeight 500 |
| 화살표 | ChevronRight 14px, 회전 애니메이션 동일 |

**펼침 시 문서 목록**:

| 요소 | 스타일 |
|------|--------|
| 문서 타입 아이콘 | pdf/docx → FileText 12px, url → Globe 12px |
| 문서 제목 | 12px, fontWeight 500, `hsl(var(--foreground))` |
| 요약 | 11px, `hsl(var(--muted-foreground))`, lineHeight 1.5 |
| 하이라이트 | 각주 클릭 시 해당 문서 배경 `hsl(var(--primary) / 0.08)`, transition 0.3s |

---

#### 3.4.7 각주 (Footnotes)

응답 텍스트 내 `[1]`, `[2]` 등의 각주를 인라인 뱃지로 렌더링한다.

**각주 뱃지**:

| 요소 | 스타일 |
|------|--------|
| 크기 | 16px × 16px |
| 둥근 모서리 | 4px |
| 배경 (기본) | `hsl(var(--muted-foreground) / 0.2)` |
| 배경 (활성) | `hsl(var(--foreground))` |
| 텍스트 (기본) | `hsl(var(--foreground))`, 9px, fontWeight 700 |
| 텍스트 (활성) | `hsl(var(--background))` |
| 위치 | `vertical-align: super`, marginLeft 2px, marginRight 1px |
| 커서 | pointer |
| 전환 | transition `all 0.15s` |

**각주 클릭 동작**:
1. 해당 메시지의 RAG 아코디언 자동 펼침 (`expandedRagSources` Set에 추가)
2. 각주 번호에 해당하는 문서 하이라이트 (배경 `primary/0.08`)
3. 각주 뱃지 활성 상태로 변경
4. 외부 클릭 시 하이라이트 해제 (`document.addEventListener('click')`)

---

### 3.5 입력 영역 [C]

**레이아웃**:
```
┌──────────────────────────────────┐
│ [첨부 미리보기]                    │  ← 첨부 있을 때만 표시
├──────────────────────────────────┤
│ [📎][모델▾]  메시지 입력...  [▲/■] │
├──────────────────────────────────┤
│ 🕐 세션 잔여: 13일 22시간          │
└──────────────────────────────────┘
```

**컨테이너 스타일**:
- 패딩: `16px 24px 12px`
- 상단 테두리: `1px solid hsl(var(--border))`
- 배경: `hsl(var(--card))`
- flexShrink: 0

---

#### 3.5.1 입력 필드

| 요소 | 스타일 | 동작 |
|------|--------|------|
| textarea | 13px, Paperlogy, 자동 높이 조절, 최대 4줄, border none, resize none | Enter: 전송, Shift+Enter: 줄바꿈 |
| placeholder | "메시지를 입력하세요...", `hsl(var(--muted-foreground))` | — |
| 전송 버튼 | ArrowUp 16px, 32px × 32px, borderRadius 50%, `hsl(var(--primary))` 배경 | 메시지 전송 |
| 중지 버튼 | Square 14px, 32px × 32px, borderRadius 50%, `hsl(var(--destructive))` 배경 | 로딩 중일 때만 표시. 응답 생성 중지 |

**전송/중지 버튼 전환**:
- 기본 상태: ArrowUp (전송)
- 로딩 중: Square (중지), 배경 `hsl(var(--destructive))`
- 비활성 (입력 없음): opacity 0.5

---

#### 3.5.2 첨부 기능

**트리거**: Paperclip 아이콘 버튼 (16px, ghost 스타일)

**첨부 메뉴** (팝오버, 입력 필드 상단에 표시):

| 항목 | 아이콘 | 허용 형식 | 크기 제한 |
|------|--------|-----------|-----------|
| 이미지 첨부 | ImageIcon 14px | jpg, png, gif, webp | 10MB |
| PDF 첨부 | FileText 14px | pdf | 20MB |
| URL 첨부 | Globe 14px | https:// URL | — |

**팝오버 스타일**:
- 배경: `hsl(var(--popover))`
- 테두리: `1px solid hsl(var(--border))`
- borderRadius: 8px
- 그림자: `0 4px 12px rgba(0, 0, 0, 0.1)`
- 각 항목: padding `10px 16px`, 13px, gap 10px, 호버 시 `hsl(var(--muted))` 배경

**첨부 미리보기** (입력 필드 상단):

| 요소 | 스타일 |
|------|--------|
| 파일 미리보기 | 파일명 + 크기, 12px, `hsl(var(--muted-foreground))` |
| URL 미리보기 | URL 텍스트, 12px, `hsl(var(--muted-foreground))`, 말줄임 |
| 제거 버튼 | X 아이콘 12px, 클릭 시 첨부 제거 |
| 컨테이너 | `hsl(var(--muted))` 배경, borderRadius 6px, padding `6px 10px` |

**URL 입력 다이얼로그**:
- 입력 필드: URL 입력, placeholder "https://..."
- 확인 버튼: `btn btn-primary btn-sm`
- 취소 버튼: `btn btn-secondary btn-sm`
- 유효성: https:// 프로토콜만 허용

---

#### 3.5.3 모델 선택

**트리거**: 현재 모델명 드롭다운 클릭

**드롭다운 버튼 스타일**:
- 텍스트: 현재 모델 displayName, 11px, `hsl(var(--muted-foreground))`
- 아이콘: ChevronDown 12px
- 호버: `hsl(var(--foreground))` 텍스트

**사용 가능 모델**:

| Provider | 모델명 | 표시명 | 설명 |
|----------|--------|--------|------|
| Anthropic | claude-sonnet-4.5 | Claude Sonnet 4.5 | 데이터 해석 · 전략 수립 |
| Anthropic | claude-haiku-4.5 | Claude Haiku 4.5 | 빠르고 명확한 답변 |
| OpenAI | gpt-4o | Chat GPT 4o | 창의적 기획 · 아이디어 |
| Google | gemini-3pro | Gemini 3pro | 대량 컨텍스트 · 시장 탐색 |

**모델 메뉴 스타일**:
- 위치: 입력 필드 상단 (bottom-up)
- 너비: 280px
- 배경: `hsl(var(--popover))`
- 테두리: `1px solid hsl(var(--border))`
- borderRadius: 10px
- 그림자: `0 10px 25px rgba(0, 0, 0, 0.15)`

**모델 항목 스타일**:

| 요소 | 스타일 |
|------|--------|
| 항목 컨테이너 | padding `12px 16px`, 호버 시 `hsl(var(--muted))` 배경 |
| Provider | 10px, `hsl(var(--muted-foreground))`, fontWeight 500 |
| 모델명 | 13px, fontWeight 600, `hsl(var(--foreground))` |
| 설명 | 11px, `hsl(var(--muted-foreground))` |
| 선택 표시 | 우측 Check 아이콘 14px, `hsl(var(--primary))` |

**모델 변경 동작**:
1. 즉시 변경 (확인 다이얼로그 없음)
2. 대화 스레드에 모델 변경 시스템 메시지 삽입: "{모델명}(으)로 변경"
3. 이후 응답은 변경된 모델로 생성

---

#### 3.5.4 세션 잔여 시간

**위치**: 입력 영역 최하단

| 요소 | 스타일 |
|------|--------|
| 아이콘 | Clock 12px |
| 텍스트 | "세션 잔여: N일 N시간", 11px, `hsl(var(--muted-foreground))` |
| 컨테이너 | `display: flex`, gap 6px, alignItems center, marginTop 8px |
| 커서 | pointer (클릭 시 툴팁) |

**경고 상태**:

| 잔여 시간 | 텍스트 색상 |
|-----------|------------|
| 24시간 이상 | `hsl(var(--muted-foreground))` (기본) |
| 24시간 미만 | `hsl(38 92% 50%)` (주황) |
| 1시간 미만 | `hsl(var(--destructive))` (빨강) |

**툴팁** (클릭 시 표시):

| 요소 | 스타일 |
|------|--------|
| 컨테이너 | `hsl(var(--popover))` 배경, borderRadius 8px, padding `12px 16px`, 그림자 |
| 세션 생성일 | "생성: YYYY-MM-DD HH:mm", 11px |
| 만료 예정일 | "만료: YYYY-MM-DD HH:mm", 11px |
| 잔여 시간 | "잔여: N일 N시간 N분", 11px, fontWeight 600 |

---

## 4. 응답 처리

### 4.1 로딩 상태

**표시**: 로딩 인디케이터 + 순차 변경 메시지

**로딩 메시지 순서** (0.8초 간격 순환):
내용은 SpinX에서 내려줌

| 요소 | 스타일 |
|------|--------|
| 텍스트 | 13px, `hsl(var(--muted-foreground))`, Paperlogy |
| 애니메이션 | pulse (opacity 1 → 0.5 → 1, 2s infinite) |
| 점 인디케이터 | 3개 원형 dot, 4px, 순차 bounce 애니메이션 |

### 4.2 응답 중지

**조건**: 로딩 중일 때만 가능

**동작**:
1. 전송 버튼(ArrowUp)이 중지 버튼(Square, destructive 배경)으로 변경
2. 클릭 시 `setTimeout` 취소 + 로딩 메시지 인터벌 정리
3. 대화에 에러 메시지 삽입: "답변 생성이 중단되었습니다."
4. 재시도 가능

### 4.3 에러 처리 및 재시도

**재시도 규칙**:

| 항목 | 정의 |
|------|------|
| 최대 재시도 횟수 | 동일 질문당 **1회** |
| 재시도 버튼 | RefreshCw 14px + "다시 시도" 텍스트, ghost 스타일 |
| 재시도 소진 시 | 버튼 비활성화 (opacity 0.5, cursor not-allowed) |
| 재시도 카운트 기준 | 원본 질문 텍스트 기준 (`Map<string, number>`) |

### 4.4 응답 복사

**트리거**: AI 응답 메시지 호버 시 복사 버튼 표시

**동작**:
1. Copy 아이콘 클릭 → `navigator.clipboard.writeText()`
2. Check 아이콘으로 변경 (2초 후 복귀)

**복사 대상**:
- 텍스트 응답: 원문 텍스트
- 차트 응답: 차트 제목 + 설명 텍스트
- 에러 응답: 에러 메시지 텍스트

---

## 5. 초기화 다이얼로그

### 5.1 트리거
헤더의 초기화(RotateCcw) 버튼 클릭

### 5.2 다이얼로그 구성

| 요소 | 스타일 |
|------|--------|
| 오버레이 | `dialog-overlay` 클래스 |
| 컨테이너 | `dialog-content` 클래스 (confirm 사이즈) |
| 제목 | "대화를 초기화하시겠습니까?", `dialog-title` |
| 설명 | "모든 대화 내용이 삭제되며 복구할 수 없습니다. 세션이 새로 시작됩니다.", `dialog-description` |
| 취소 버튼 | `btn btn-secondary btn-sm` |
| 초기화 버튼 | `btn btn-primary btn-sm` |

### 5.3 초기화 동작

1. 서버에 세션 삭제 요청
2. localStorage에서 세션 ID 제거
3. 대화 이력 전체 삭제 (`setMessages([])`)
4. 첨부 파일/URL 초기화
5. 컨텍스트 요약 + 추천 질문 재생성 (새 세션)
6. 세션 잔여 시간 14일로 리셋

---

## 6. 인터랙션 플로우

### 6.1 최초 오픈 (세션 없음)

```
1. SpinX 버튼 클릭
2. 패널 슬라이드 인 (right: -400px → 0, 0.4s)
3. SpinX API에 세션 생성 요청 (scenarioId + userId)
4. 세션 ID 발급 → localStorage 저장
5. 현재 시나리오 데이터 기반 컨텍스트 요약 생성
6. 추천 질문 4개 생성
7. 패널에 요약 + 추천 질문 표시
```

### 6.2 재방문 (세션 있음, 14일 이내)

```
1. SpinX 버튼 클릭
2. 패널 슬라이드 인
3. localStorage에서 세션 ID 확인
4. SpinX API에 세션 복원 요청
5. 이전 대화 이력 로드
6. 컨텍스트 요약 + 이전 대화 + 추천 질문 표시
7. 잔여 시간 업데이트
```

### 6.3 세션 만료 후 오픈

```
1. SpinX 버튼 클릭
2. 패널 슬라이드 인
3. localStorage에서 세션 ID 확인
4. SpinX API에 세션 복원 요청 → 만료 응답
5. localStorage에서 만료 세션 ID 제거
6. 새 세션 생성 (6.1 플로우)
```

### 6.4 질문 → 응답

```
1. 사용자 메시지 입력 (또는 추천 질문 클릭)
2. 사용자 메시지 스레드에 추가
3. 로딩 상태 시작 (순차 메시지, 0.8초 간격)
4. SpinX API에 질문 전송 (세션 ID + 메시지 + 첨부)
5-a. 응답 수신 → AI 메시지 스레드에 추가
5-b. 사용자 중지 → "답변 생성이 중단되었습니다." 에러 메시지 삽입
5-c. 에러 발생 → 에러 메시지 + 재시도 버튼 (1회 제한)
6. 자동 스크롤 (scrollIntoView smooth)
```

### 6.5 비교 결과 삭제 시

```
1. 시나리오 비교 결과 삭제 실행
2. 해당 비교에 연결된 SpinX 세션 만료 처리
3. localStorage에서 세션 ID 제거
4. (패널이 열려있었다면) 패널 자동 닫힘
```

--


## 10. 공통 사항

### 10.1 다크모드 지원
- 모든 색상은 CSS 변수 사용 (`hsl(var(--foreground))`)
- 패널 배경, 메시지 영역 배경 모두 테마 대응
- 차트 색상은 다크모드 분기 처리 (isDarkMode prop)

### 10.2 폰트
- 기본: Paperlogy, sans-serif
- 크기:
  - 헤더 타이틀: 18px
  - 시나리오명: 16px
  - 요약/메시지 본문: 13px
  - 추천 질문: 13px
  - 보조 정보: 11-12px
  - 각주 뱃지: 9px

### 10.3 반응형
- 패널 너비: 400px 고정
- 메시지 영역: overflowY auto
- 차트 응답: ResponsiveContainer width 100%

### 10.4 접근성
- 버튼: 키보드 접근 가능 (button 태그)
- textarea: Enter/Shift+Enter 키보드 인터랙션
- 외부 클릭: 각주 팝오버 닫기
- title 속성: 초기화 버튼 "대화 초기화", 복사 버튼 "복사"

---

## 11. 향후 개선 사항

### 11.1 단기
- [ ] 스트리밍 응답 (SSE 기반 실시간 텍스트 출력)
- [ ] 대화 내보내기 (텍스트/PDF)
- [ ] 추천 질문 동적 생성 (이전 대화 기반)

### 11.2 중기
- [ ] 멀티턴 컨텍스트 최적화 (토큰 관리)
- [ ] 차트 응답 인터랙션 (호버, 클릭)
- [ ] 음성 입력 지원

### 11.3 장기
- [ ] 시나리오 간 크로스 분석 ("A 시나리오와 B 시나리오 비교해줘")
- [ ] 자동 리포트 생성
- [ ] 팀 공유 세션 (같은 시나리오의 SpinX 대화를 팀원과 공유)

---

## 12. 참고 자료

### 12.1 관련 컴포넌트
- `src/components/spinx/SpinXPanel.tsx`: SpinX 패널 메인 컴포넌트
- `src/components/spinx/SpinXButton.tsx`: SpinX 호출 버튼
- `src/components/reachcaster/RatioFinderResult.tsx`: Ratio Finder 결과 (SpinX 호출처)
- `src/components/reachcaster/ReachPredictorResult.tsx`: Reach Predictor 결과 (SpinX 호출처)
- `src/components/reachcaster/ScenarioComparisonResult.tsx`: 비교 결과 (SpinX 호출처)

### 12.2 디자인 시스템
- 색상: CSS 변수 기반 (`hsl(var(--foreground))`, `hsl(var(--muted-foreground))`)
- 폰트: Paperlogy, sans-serif
- 간격: 4px 단위 (4, 6, 8, 10, 12, 16, 20, 24, 32px)
- 둥근 모서리: 4px (각주), 6px (미리보기), 8px (팝오버/버튼), 12px (카드/메시지), 50% (원형 버튼)
- 다이얼로그: `ui-dialog-policy.md` 참조 (confirm 사이즈)
