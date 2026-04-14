---
inclusion: manual
---

# Design System Guide

> Reach Caster 프로젝트의 UI 디자인 시스템 가이드

## 목차
1. [컬러 시스템](#컬러-시스템)
2. [타이포그래피](#타이포그래피)
3. [컴포넌트 사이즈](#컴포넌트-사이즈)
4. [간격 시스템](#간격-시스템)
5. [투명도 정책](#투명도-정책)
6. [그림자 & 효과](#그림자--효과)
7. [애니메이션](#애니메이션)

---

## 컬러 시스템

### CSS 변수 토큰 (HSL → HEX 변환)

프로젝트는 Shadcn UI 기반의 CSS 변수 시스템을 사용합니다. 모든 컬러는 `hsl(var(--token-name))` 형태로 사용되지만, 디자인 작업 시 HEX 코드를 참고하세요.

#### Light Mode 컬러

| 토큰 | HSL | HEX | 용도 |
|------|-----|-----|------|
| `--background` | `0 0% 100%` | `#FFFFFF` | 흰색 배경 |
| `--foreground` | `0 0% 3.9%` | `#0A0A0A` | 거의 검정색 텍스트 |
| `--card` | `0 0% 100%` | `#FFFFFF` | 카드 배경 |
| `--card-foreground` | `0 0% 3.9%` | `#0A0A0A` | 카드 텍스트 |
| `--popover` | `0 0% 100%` | `#FFFFFF` | 팝오버 배경 |
| `--popover-foreground` | `0 0% 3.9%` | `#0A0A0A` | 팝오버 텍스트 |
| `--primary` | `0 0% 9%` | `#171717` | 주요 액션 색상 |
| `--primary-foreground` | `0 0% 98%` | `#FAFAFA` | 주요 액션 텍스트 |
| `--secondary` | `0 0% 96.1%` | `#F5F5F5` | 보조 색상 |
| `--secondary-foreground` | `0 0% 9%` | `#171717` | 보조 텍스트 |
| `--muted` | `0 0% 96.1%` | `#F5F5F5` | 음소거된 배경 |
| `--muted-foreground` | `0 0% 45.1%` | `#737373` | 음소거된 텍스트 |
| `--accent` | `0 0% 96.1%` | `#F5F5F5` | 강조 색상 |
| `--accent-foreground` | `0 0% 9%` | `#171717` | 강조 텍스트 |
| `--destructive` | `0 84.2% 60.2%` | `#EF4444` | 삭제/경고 색상 |
| `--destructive-foreground` | `0 0% 98%` | `#FAFAFA` | 삭제 텍스트 |
| `--border` | `0 0% 89.8%` | `#E5E5E5` | 테두리 색상 |
| `--input` | `0 0% 89.8%` | `#E5E5E5` | 입력 필드 테두리 |
| `--ring` | `0 0% 3.9%` | `#0A0A0A` | 포커스 링 |
| `--sidebar` | `0 0% 98%` | `#FAFAFA` | 사이드바 배경 |
| `--sidebar-foreground` | `0 0% 3.9%` | `#0A0A0A` | 사이드바 텍스트 |

### 브랜드 & 강조 컬러

프로젝트에서 사용하는 특수 브랜드 컬러입니다.

| 용도 | HEX | RGB | 설명 |
|------|-----|-----|------|
| **Primary Accent** | `#00FF9D` | `rgb(0, 255, 157)` | 네온 그린 - 주요 강조, Reach 표시 |
| **Secondary Accent** | `#B794F6` | `rgb(183, 148, 246)` | 연보라 - Reach 보조 색상 |
| **Success** | `#00FF9D` | `rgb(0, 255, 157)` | 성공 상태 (Primary Accent와 동일) |
| **Error/Destructive** | `#EF4444` | `rgb(239, 68, 68)` | 에러, 삭제, 경고 |
| **Info** | `#3B82F6` | `rgb(59, 130, 246)` | 정보, Full-Slot 뱃지 |

### 네온 그라데이션 (Avatar)

아바타 컴포넌트에서 사용하는 네온 컬러 팔레트:

```tsx
// Cyan → Violet → Pink 그라데이션
const gradients = [
  ['#00D9FF', '#7B2FFF', '#FF006B'],  // 기본
  ['#00F5FF', '#9D4EDD', '#FF1B8D'],  // 밝은 버전
  ['#00E5FF', '#6A0DAD', '#FF0080'],  // 진한 버전
]
```

| 색상 | HEX | RGB | 설명 |
|------|-----|-----|------|
| Cyan | `#00D9FF` | `rgb(0, 217, 255)` | 네온 시안 |
| Violet | `#7B2FFF` | `rgb(123, 47, 255)` | 네온 바이올렛 |
| Pink | `#FF006B` | `rgb(255, 0, 107)` | 네온 핑크 |

### 차트 컬러

Reach Curve Chart에서 사용하는 컬러:

| 용도 | Light Mode | Dark Mode | 설명 |
|------|------------|-----------|------|
| TVC | `#1A1A1A` | `#F5F5F5` | TVC 라인 |
| TVC Faded | `rgba(26, 26, 26, 0.4)` | `rgba(245, 245, 245, 0.4)` | TVC 투명 |
| Digital | `#00FF9D` | `#00FF9D` | Digital 라인 (네온 그린) |
| Digital Faded | `rgba(0, 255, 157, 0.4)` | `rgba(0, 255, 157, 0.4)` | Digital 투명 |
| Reach | `#B794F6` | `#B794F6` | Reach 라인 (연보라) |
| Reach Shadow | `rgba(183, 148, 246, 0.5)` | `rgba(183, 148, 246, 0.5)` | Reach 그림자 |
| Grid | `#E4E4E7` | `#27272A` | 그리드 라인 |
| Axis | `#E4E4E7` | `#3F3F46` | 축 라인 |
| Tick Text | `#71717A` | `#A1A1AA` | 축 레이블 |

### 상태별 컬러

| 상태 | HEX | 용도 |
|------|-----|------|
| **Active** | `#00FF9D` | 활성 상태, 선택됨 |
| **Hover** | `#F5F5F5` (Light) / `#262626` (Dark) | 호버 상태 |
| **Disabled** | `#A3A3A3` | 비활성 상태 |
| **Focus** | `#0A0A0A` (Light) / `#D4D4D4` (Dark) | 포커스 링 |

---

## 광고주별 컬러 할당 정책

광고주(Advertiser) 아바타는 이름 기반 해시를 통해 자동으로 네온 컬러가 할당됩니다.

### 컬러 할당 알고리즘

```typescript
// 이름의 각 문자 코드를 합산하여 해시 생성
const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
const color = SAAS_NEON_COLORS[hash % SAAS_NEON_COLORS.length]
```

### 광고주 네온 컬러 팔레트 (25개)

| 순번 | HEX | RGB | 색상명 |
|------|-----|-----|--------|
| 1 | `#00E5FF` | `rgb(0, 229, 255)` | Neon Cyan |
| 2 | `#7B2FFF` | `rgb(123, 47, 255)` | Electric Violet |
| 3 | `#00FF94` | `rgb(0, 255, 148)` | Neon Lime |
| 4 | `#FF006B` | `rgb(255, 0, 107)` | Neon Pink |
| 5 | `#FFD600` | `rgb(255, 214, 0)` | Neon Yellow |
| 6 | `#00D9FF` | `rgb(0, 217, 255)` | Bright Cyan |
| 7 | `#9D4EDD` | `rgb(157, 78, 221)` | Purple |
| 8 | `#FF1B8D` | `rgb(255, 27, 141)` | Hot Pink |
| 9 | `#00FFC2` | `rgb(0, 255, 194)` | Mint |
| 10 | `#FF3D00` | `rgb(255, 61, 0)` | Neon Orange |
| 11 | `#8B00FF` | `rgb(139, 0, 255)` | Electric Purple |
| 12 | `#00FFE5` | `rgb(0, 255, 229)` | Aqua |
| 13 | `#FF0080` | `rgb(255, 0, 128)` | Magenta |
| 14 | `#CCFF00` | `rgb(204, 255, 0)` | Lime |
| 15 | `#00C9FF` | `rgb(0, 201, 255)` | Sky Blue |
| 16 | `#FF007F` | `rgb(255, 0, 127)` | Rose |
| 17 | `#9333EA` | `rgb(147, 51, 234)` | Violet |
| 18 | `#00FF7F` | `rgb(0, 255, 127)` | Spring Green |
| 19 | `#FF4500` | `rgb(255, 69, 0)` | Orange Red |
| 20 | `#00E5E5` | `rgb(0, 229, 229)` | Turquoise |
| 21 | `#E500FF` | `rgb(229, 0, 255)` | Fuchsia |
| 22 | `#00FFB3` | `rgb(0, 255, 179)` | Sea Green |
| 23 | `#FF0055` | `rgb(255, 0, 85)` | Deep Pink |
| 24 | `#00D4FF` | `rgb(0, 212, 255)` | Light Cyan |
| 25 | `#B800FF` | `rgb(184, 0, 255)` | Purple |

### 텍스트 컬러 자동 결정

배경 컬러의 밝기(Luminance)에 따라 텍스트 색상이 자동으로 결정됩니다:

```typescript
// Relative Luminance 계산
const luminance = 0.299 * r + 0.587 * g + 0.114 * b

// 밝기가 128 이상이면 검정, 아니면 흰색
const textColor = luminance > 128 ? '#000000' : '#FFFFFF'
```

| 배경 밝기 | 텍스트 컬러 | 예시 배경 |
|-----------|-------------|-----------|
| Luminance ≥ 128 | `#000000` (검정) | `#FFD600`, `#CCFF00`, `#00FFE5` |
| Luminance < 128 | `#FFFFFF` (흰색) | `#7B2FFF`, `#FF006B`, `#8B00FF` |

### 디자인 특징

- **형태**: Soft Squircle (border-radius: 30% of size)
- **스타일**: Flat Design (그라데이션 없음)
- **일관성**: 같은 이름은 항상 같은 색상
- **접근성**: 자동 대비 조정으로 WCAG 준수

### 사용 예시

```tsx
// 광고주 아바타
<Avatar 
  name="Samsung" 
  type="advertiser" 
  size={32} 
/>

// 일반 유저 아바타
<Avatar 
  name="John Doe" 
  type="user" 
  size={32} 
/>
```

#### Dark Mode 컬러

| 토큰 | HSL | HEX | 용도 |
|------|-----|-----|------|
| `--background` | `0 0% 3.9%` | `#0A0A0A` | 어두운 배경 |
| `--foreground` | `0 0% 98%` | `#FAFAFA` | 밝은 텍스트 |
| `--card` | `0 0% 3.9%` | `#0A0A0A` | 카드 배경 |
| `--card-foreground` | `0 0% 98%` | `#FAFAFA` | 카드 텍스트 |
| `--popover` | `0 0% 3.9%` | `#0A0A0A` | 팝오버 배경 |
| `--popover-foreground` | `0 0% 98%` | `#FAFAFA` | 팝오버 텍스트 |
| `--primary` | `0 0% 98%` | `#FAFAFA` | 주요 액션 색상 |
| `--primary-foreground` | `0 0% 9%` | `#171717` | 주요 액션 텍스트 |
| `--secondary` | `0 0% 14.9%` | `#262626` | 보조 색상 |
| `--secondary-foreground` | `0 0% 98%` | `#FAFAFA` | 보조 텍스트 |
| `--muted` | `0 0% 14.9%` | `#262626` | 음소거된 배경 |
| `--muted-foreground` | `0 0% 63.9%` | `#A3A3A3` | 음소거된 텍스트 |
| `--accent` | `0 0% 14.9%` | `#262626` | 강조 색상 |
| `--accent-foreground` | `0 0% 98%` | `#FAFAFA` | 강조 텍스트 |
| `--destructive` | `0 90% 65%` | `#F87171` | 삭제/경고 색상 |
| `--destructive-foreground` | `0 0% 98%` | `#FAFAFA` | 삭제 텍스트 |
| `--border` | `0 0% 14.9%` | `#262626` | 테두리 색상 |
| `--input` | `0 0% 14.9%` | `#262626` | 입력 필드 테두리 |
| `--ring` | `0 0% 83.1%` | `#D4D4D4` | 포커스 링 |
| `--sidebar` | `0 0% 9.2%` | `#171717` | 사이드바 배경 |
| `--sidebar-foreground` | `0 0% 98%` | `#FAFAFA` | 사이드바 텍스트 |

### 컬러 사용 예시

#### CSS-in-JS 스타일

```tsx
// 기본 사용 (CSS 변수)
<div style={{ 
  backgroundColor: 'hsl(var(--card))',
  color: 'hsl(var(--card-foreground))',
  border: '1px solid hsl(var(--border))'
}} />

// HEX 코드 직접 사용 (권장하지 않음 - 다크모드 미지원)
<div style={{ 
  backgroundColor: '#FFFFFF',
  color: '#0A0A0A',
  border: '1px solid #E5E5E5'
}} />
```

#### Tailwind 클래스

```tsx
// globals.css에 정의된 유틸리티 클래스 사용
<div className="bg-card text-card-foreground border border-border" />
```

#### 투명도 적용

```tsx
// CSS 변수 + 투명도
<div style={{ 
  backgroundColor: 'hsl(var(--card) / 0.2)',      // 20% 불투명도
  border: '1px solid hsl(var(--border) / 0.3)'    // 30% 불투명도
}} />

// HEX + 투명도 (rgba 사용)
<div style={{ 
  backgroundColor: 'rgba(255, 255, 255, 0.2)',    // #FFFFFF 20%
  border: '1px solid rgba(229, 229, 229, 0.3)'    // #E5E5E5 30%
}} />
```

### 특수 배경 (SlotBoard 페이지)

SlotBoard 페이지는 그라데이션 배경을 사용합니다:

#### Light Mode 그라데이션

```css
background: linear-gradient(135deg, 
  hsl(210, 30%, 96%) 0%,    /* #EDF2F7 - 연한 파랑 */
  hsl(45, 25%, 95%) 20%,    /* #F5F3ED - 연한 베이지 */
  hsl(200, 35%, 94%) 40%,   /* #E8F2F5 - 연한 하늘색 */
  hsl(120, 20%, 95%) 60%,   /* #EFF5ED - 연한 초록 */
  hsl(340, 25%, 96%) 80%,   /* #F5EDF2 - 연한 핑크 */
  hsl(220, 30%, 97%) 100%   /* #F0F2F7 - 연한 보라 */
);
```

| 위치 | HSL | HEX | 색상 설명 |
|------|-----|-----|-----------|
| 0% | `hsl(210, 30%, 96%)` | `#EDF2F7` | 연한 파랑 (Sky Blue) |
| 20% | `hsl(45, 25%, 95%)` | `#F5F3ED` | 연한 베이지 (Warm Beige) |
| 40% | `hsl(200, 35%, 94%)` | `#E8F2F5` | 연한 하늘색 (Light Cyan) |
| 60% | `hsl(120, 20%, 95%)` | `#EFF5ED` | 연한 초록 (Mint Green) |
| 80% | `hsl(340, 25%, 96%)` | `#F5EDF2` | 연한 핑크 (Soft Pink) |
| 100% | `hsl(220, 30%, 97%)` | `#F0F2F7` | 연한 보라 (Lavender) |

#### Dark Mode 그라데이션

```css
background: linear-gradient(135deg, 
  hsl(220, 15%, 4%) 0%,     /* #090A0B - 어두운 파랑 */
  hsl(45, 10%, 4.5%) 20%,   /* #0C0B0A - 어두운 베이지 */
  hsl(200, 18%, 4%) 40%,    /* #080A0C - 어두운 하늘색 */
  hsl(120, 12%, 4.2%) 60%,  /* #090B09 - 어두운 초록 */
  hsl(340, 15%, 4.5%) 80%,  /* #0C090B - 어두운 핑크 */
  hsl(240, 15%, 5%) 100%    /* #0B0B0D - 어두운 보라 */
);
```

| 위치 | HSL | HEX | 색상 설명 |
|------|-----|-----|-----------|
| 0% | `hsl(220, 15%, 4%)` | `#090A0B` | 어두운 파랑 |
| 20% | `hsl(45, 10%, 4.5%)` | `#0C0B0A` | 어두운 베이지 |
| 40% | `hsl(200, 18%, 4%)` | `#080A0C` | 어두운 하늘색 |
| 60% | `hsl(120, 12%, 4.2%)` | `#090B09` | 어두운 초록 |
| 80% | `hsl(340, 15%, 4.5%)` | `#0C090B` | 어두운 핑크 |
| 100% | `hsl(240, 15%, 5%)` | `#0B0B0D` | 어두운 보라 |

**적용 방법:**
```tsx
<div className="workspace workspace--slotboard">
  {/* SlotBoard 컨텐츠 */}
</div>
```

---

## 타이포그래피

### 폰트 패밀리

```css
font-family: 'Paperlogy', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

- **Primary**: Paperlogy (한글 최적화)
- **Fallback**: Inter (영문)
- **System Fallback**: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto

### 폰트 웨이트

```css
font-weight: 400;  /* Regular - 본문 텍스트 */
font-weight: 500;  /* Medium - 버튼, 강조 */
font-weight: 600;  /* SemiBold - 제목, 헤더 */
font-weight: 700;  /* Bold - 주요 제목 */
font-weight: 800;  /* ExtraBold - 특별 강조 (Total 등) */
```

### 폰트 사이즈

| 용도 | 사이즈 | 비고 |
|------|--------|------|
| 큰 제목 | `1.125rem` (18px) | 다이얼로그 제목 |
| 중간 제목 | `1rem` (16px) | 섹션 제목 |
| 본문 | `0.875rem` (14px) | 기본 텍스트 |
| 작은 텍스트 | `0.75rem` (12px) | 버튼, 라벨 |
| 매우 작은 텍스트 | `0.6875rem` (11px) | 테이블 셀, 보조 정보 |

---

## 컴포넌트 사이즈

### 버튼

```css
/* Small */
.btn-sm {
  height: 2rem;        /* 32px */
  padding: 0 0.75rem;  /* 12px */
  font-size: 0.75rem;  /* 12px */
}

/* Medium (기본) */
.btn-md {
  height: 36px;
  min-height: 36px;
  padding: 0.5rem 1rem;  /* 8px 16px */
  font-size: 0.875rem;   /* 14px */
}

/* Large */
.btn-lg {
  height: 2.5rem;      /* 40px */
  padding: 0 2rem;     /* 32px */
  font-size: 0.875rem; /* 14px */
}
```

### 입력 필드

```css
/* Input */
.input {
  height: 36px;
  min-height: 36px;
  padding: 0.5rem 0.75rem;  /* 8px 12px */
  font-size: 0.875rem;      /* 14px */
  border-radius: 0.375rem;  /* 6px */
}

/* Textarea */
.textarea {
  min-height: 3.75rem;      /* 60px */
  padding: 0.5rem 0.75rem;  /* 8px 12px */
  font-size: 0.875rem;      /* 14px */
  border-radius: 0.375rem;  /* 6px */
}
```

### 카드

```css
.card {
  border-radius: 0.5rem;  /* 8px */
  padding: 1rem;          /* 16px - 기본값 */
  border: 1px solid hsl(var(--border));
}
```

### 체크박스 & 라디오

```css
.checkbox-custom,
.radio-custom {
  width: 1rem;   /* 16px */
  height: 1rem;  /* 16px */
}
```

---

## 간격 시스템

### Spacing Scale (8px 그리드 시스템)

모든 간격은 8px의 배수를 기본으로 합니다.

| 토큰 | rem | px | HEX (참고용) | 용도 |
|------|-----|----|--------------|----- |
| `0` | `0` | `0px` | - | 간격 없음 |
| `0.125rem` | `0.125rem` | `2px` | - | 최소 간격 (아이콘 내부) |
| `0.25rem` | `0.25rem` | `4px` | - | 매우 작은 간격 |
| `0.375rem` | `0.375rem` | `6px` | - | 작은 간격 |
| `0.5rem` | `0.5rem` | `8px` | - | 기본 작은 간격 ⭐ |
| `0.75rem` | `0.75rem` | `12px` | - | 중간 간격 |
| `1rem` | `1rem` | `16px` | - | 기본 간격 ⭐ |
| `1.25rem` | `1.25rem` | `20px` | - | 넓은 간격 |
| `1.5rem` | `1.5rem` | `24px` | - | 섹션 간격 ⭐ |
| `2rem` | `2rem` | `32px` | - | 큰 섹션 간격 ⭐ |
| `2.5rem` | `2.5rem` | `40px` | - | 매우 큰 간격 |
| `3rem` | `3rem` | `48px` | - | 헤더 높이 ⭐ |

### Padding 사용 예시

#### 컴포넌트별 Padding

```css
/* 버튼 */
.btn-sm {
  padding: 0 0.75rem;        /* 0 12px */
}
.btn-md {
  padding: 0.5rem 1rem;      /* 8px 16px */
}
.btn-lg {
  padding: 0 2rem;           /* 0 32px */
}

/* 입력 필드 */
.input {
  padding: 0.5rem 0.75rem;   /* 8px 12px */
}

/* 카드 */
.card {
  padding: 1rem;             /* 16px - 기본 */
  padding: 1.5rem;           /* 24px - 넓은 카드 */
}

/* 워크스페이스 헤더 */
.workspace-header {
  padding: 0 1.5rem;         /* 0 24px */
}

/* 워크스페이스 컨텐츠 */
.workspace-content {
  padding: 1.5rem;           /* 24px */
}

/* 테이블 셀 */
.data-table td {
  padding: 0.75rem 1rem;     /* 12px 16px */
}

/* 다이얼로그 */
.dialog-content {
  padding: 1.5rem;           /* 24px */
}

/* 드롭다운 */
.dropdown {
  padding: 0.25rem;          /* 4px */
}

.dropdown-item {
  padding: 0.375rem 0.5rem;  /* 6px 8px */
}
```

### Margin 사용 예시

#### 컴포넌트 간 Margin

```css
/* 다이얼로그 헤더 */
.dialog-header {
  margin-bottom: 1.25rem;    /* 20px */
}

/* 다이얼로그 푸터 */
.dialog-footer {
  margin-top: 1.5rem;        /* 24px */
}

/* 폼 요소 간격 */
.form-group {
  margin-bottom: 1rem;       /* 16px */
}

/* 섹션 간격 */
.section {
  margin-bottom: 2rem;       /* 32px */
}

/* 아이콘과 텍스트 간격 */
.icon-text {
  gap: 0.5rem;               /* 8px - flexbox gap 사용 권장 */
}

/* 버튼 그룹 */
.button-group {
  gap: 0.5rem;               /* 8px */
}
```

### Gap (Flexbox/Grid)

Flexbox와 Grid에서는 `gap` 속성을 사용하는 것이 권장됩니다.

```css
/* 작은 간격 */
gap: 0.25rem;  /* 4px */
gap: 0.5rem;   /* 8px ⭐ 가장 많이 사용 */

/* 중간 간격 */
gap: 0.75rem;  /* 12px */
gap: 1rem;     /* 16px ⭐ 기본 간격 */

/* 큰 간격 */
gap: 1.5rem;   /* 24px */
gap: 2rem;     /* 32px */
```

### 레이아웃 간격 가이드

#### 페이지 레벨

```css
/* 페이지 컨테이너 */
padding: 1.5rem;           /* 24px - 모바일 */
padding: 2rem;             /* 32px - 데스크톱 */

/* 섹션 간 간격 */
margin-bottom: 2rem;       /* 32px */
margin-bottom: 3rem;       /* 48px - 큰 섹션 */
```

#### 컴포넌트 레벨

```css
/* 카드 내부 */
padding: 1rem;             /* 16px - 작은 카드 */
padding: 1.5rem;           /* 24px - 일반 카드 */

/* 카드 간 간격 */
gap: 1rem;                 /* 16px - 그리드 */
gap: 1.5rem;               /* 24px - 넓은 그리드 */
```

#### 텍스트 레벨

```css
/* 제목과 본문 간격 */
margin-bottom: 0.5rem;     /* 8px */
margin-bottom: 0.75rem;    /* 12px */

/* 문단 간격 */
margin-bottom: 1rem;       /* 16px */

/* 리스트 아이템 */
gap: 0.5rem;               /* 8px */
```

---

## 투명도 정책

### 배경 투명도

```css
/* 카드 - Light Mode */
background-color: hsl(var(--card) / 0.2);   /* 20% 불투명도 */
border: 1px solid hsl(var(--border) / 0.3); /* 30% 불투명도 */

/* 카드 호버 - Light Mode */
background-color: hsl(var(--card) / 0.35);  /* 35% 불투명도 */

/* 사이드바 */
background-color: hsl(var(--sidebar) / 0.9); /* 90% 불투명도 */
border-right: 1px solid hsl(var(--border) / 0.2); /* 20% 불투명도 */

/* 다이얼로그 오버레이 */
background-color: rgb(0 0 0 / 0.8);  /* 80% 불투명도 */
```

### 텍스트 투명도

```css
/* 음소거된 텍스트 */
color: hsl(var(--muted-foreground));  /* 기본 45.1% lightness */

/* 비활성 상태 */
opacity: 0.6;

/* 아이콘 */
opacity: 0.6;  /* 기본 아이콘 */
opacity: 1;    /* 활성 아이콘 */
```

---

## 그림자 & 효과

### Box Shadow

```css
/* 카드 기본 */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 
            0 1px 2px -1px rgb(0 0 0 / 0.1);

/* 카드 강화 (Light Mode) */
box-shadow: 0 4px 16px 0 rgb(0 0 0 / 0.1);

/* 카드 호버 (Light Mode) */
box-shadow: 0 8px 24px 0 rgb(0 0 0 / 0.15);

/* 카드 강화 (Dark Mode) */
box-shadow: 0 4px 16px 0 rgb(0 0 0 / 0.6);

/* 카드 호버 (Dark Mode) */
box-shadow: 0 8px 24px 0 rgb(0 0 0 / 0.7);

/* 드롭다운 */
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 
            0 4px 6px -4px rgb(0 0 0 / 0.1);

/* 다이얼로그 */
box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.7), 
            0 0 0 1px rgb(255 255 255 / 0.2), 
            0 10px 30px rgb(0 0 0 / 0.5);
```

### Backdrop Filter (유리 효과)

```css
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
```

사이드바와 카드에 적용되어 배경이 살짝 블러 처리됩니다.

### Border Radius

```css
--radius: 0.65rem;  /* 10.4px - 기본 radius */

/* 컴포넌트별 */
border-radius: 0.125rem;  /* 2px - 드롭다운 아이템 */
border-radius: 0.25rem;   /* 4px - 체크박스 */
border-radius: 0.375rem;  /* 6px - 버튼, 입력 */
border-radius: 0.5rem;    /* 8px - 카드 */
border-radius: 24px;      /* 사이드바 상단 */
border-radius: 50%;       /* 원형 - 라디오, 아바타 */
```

---

## 애니메이션

### Transition 기본값

```css
transition: all 0.2s;  /* 대부분의 인터랙션 */
transition: all 0.3s ease;  /* 레이아웃 변경 */
```

### 주요 애니메이션

#### 1. 다이얼로그 등장

```css
@keyframes dialog-overlay-show {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes dialog-content-show {
  from { opacity: 0; }
  to { opacity: 1; }
}

animation: dialog-overlay-show 0.15s ease-out;
```

#### 2. Toast 슬라이드

```css
@keyframes toast-slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

animation: toast-slide-in 0.3s ease-out;
```

#### 3. Pulse (로딩)

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

animation: pulse 2s ease-in-out infinite;
```

#### 4. 검색 필드 확장

```css
@keyframes expandSearch {
  from {
    width: 36px;
    opacity: 0;
  }
  to {
    width: 300px;
    opacity: 1;
  }
}
```

### 호버 효과

```css
/* 버튼 호버 */
.btn-primary:hover {
  background-color: hsl(var(--primary) / 0.9);
}

/* 카드 호버 */
.card:hover {
  background-color: hsl(var(--card) / 0.35);
  box-shadow: 0 8px 24px 0 rgb(0 0 0 / 0.15);
}

/* 슬라이더 썸 호버 */
.slider-custom::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
```

---

## 포커스 상태

### Focus Ring

```css
/* 기본 포커스 */
.btn:focus-visible {
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
}

/* 입력 필드 포커스 */
.input:focus {
  outline: none;
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
}

/* 슬라이더 포커스 */
.slider-custom:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px hsl(var(--ring) / 0.2);
}
```

---

## 스크롤바 커스터마이징

```css
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--muted-foreground) / 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
```

---

## 반응형 브레이크포인트

```css
/* Mobile First 접근 */
@media (min-width: 640px) {  /* sm */
  .dialog-footer {
    flex-direction: row;
    justify-content: flex-end;
  }
}

@media (min-width: 768px) {  /* md */
  /* 태블릿 스타일 */
}

@media (min-width: 1024px) { /* lg */
  /* 데스크톱 스타일 */
}

@media (min-width: 1280px) { /* xl */
  /* 큰 화면 스타일 */
}
```

---

## 사용 가이드라인

### 1. 컬러 사용 원칙

- **항상 CSS 변수 사용**: 하드코딩된 색상 값 대신 `hsl(var(--token))` 사용
- **다크모드 고려**: 모든 컴포넌트는 자동으로 다크모드 지원
- **의미론적 토큰**: `--primary`, `--secondary` 등 의미 있는 토큰 사용

### 2. 간격 일관성

- **8px 그리드 시스템**: 모든 간격은 8의 배수 권장
- **rem 단위 사용**: 접근성을 위해 px 대신 rem 사용

### 3. 애니메이션 성능

- **transform 사용**: `left`, `top` 대신 `transform` 사용
- **will-change 주의**: 필요한 경우에만 사용
- **duration 일관성**: 0.2s (빠름), 0.3s (보통)

### 4. 접근성

- **포커스 표시**: 모든 인터랙티브 요소에 포커스 스타일 적용
- **색상 대비**: WCAG AA 기준 준수 (4.5:1)
- **키보드 네비게이션**: Tab, Enter, Space 지원

---

## 코드 예시

### 버튼 컴포넌트

```tsx
<button 
  className="btn btn-primary btn-md"
  style={{
    backgroundColor: 'hsl(var(--primary))',
    color: 'hsl(var(--primary-foreground))',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    transition: 'all 0.2s'
  }}
>
  Click Me
</button>
```

### 카드 컴포넌트

```tsx
<div 
  className="card"
  style={{
    backgroundColor: 'hsl(var(--card) / 0.2)',
    border: '1px solid hsl(var(--border) / 0.3)',
    borderRadius: '0.5rem',
    padding: '1rem',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 4px 16px 0 rgb(0 0 0 / 0.1)'
  }}
>
  Card Content
</div>
```

### 입력 필드

```tsx
<input 
  className="input"
  type="text"
  placeholder="Enter text..."
  style={{
    height: '36px',
    padding: '0.5rem 0.75rem',
    border: '1px solid hsl(var(--border))',
    borderRadius: '0.375rem',
    backgroundColor: 'hsl(var(--background))',
    color: 'hsl(var(--foreground))',
    fontSize: '0.875rem'
  }}
/>
```

---

## 참고 자료

- **Shadcn UI**: https://ui.shadcn.com/
- **HSL 컬러**: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl
- **CSS 변수**: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
