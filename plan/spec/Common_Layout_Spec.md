# 공통 레이아웃 화면 명세서

## 📋 문서 정보
- **작성일**: 2024-01-15
- **버전**: v1.0
- **담당자**: 기획팀
- **개발 우선순위**: 최우선 (모든 화면의 기반)

---

## 🎯 개요

ReadySet 플랫폼의 모든 화면에서 공통으로 사용되는 레이아웃 구조를 정의합니다. GNB(Global Navigation Bar), SNB(Side Navigation Bar), Breadcrumb, Footer로 구성됩니다.

---

## 📐 레이아웃 구조

### 전체 구조
```
┌─────────────────────────────────────────────────────────┐
│  Floating Alert Bar (상단 중앙 고정)                      │
├─────────────────────────────────────────────────────────┤
│  GNB (Global Navigation Bar) - 64px                     │
├──────────┬──────────────────────────────────────────────┤
│          │  Breadcrumb (조건부 표시)                     │
│   SNB    ├──────────────────────────────────────────────┤
│  240px   │                                               │
│          │  Main Content Area                            │
│          │                                               │
│          │                                               │
│          ├──────────────────────────────────────────────┤
│          │  Footer - 56px (최소)                         │
└──────────┴──────────────────────────────────────────────┘
```

### 크기 및 비율
- **GNB 높이**: 64px (고정)
- **SNB 너비**: 240px (고정)
- **Footer 최소 높이**: 56px
- **Floating Alert Bar**: 최소 600px 너비, 40px 높이
- **Main Content 영역**: calc(100vw - 240px) × calc(100vh - 64px - 56px)

---

## 🎨 1. Floating Alert Bar

### 위치 및 스타일
- **위치**: 화면 상단 중앙, GNB 위에 떠있는 형태
- **배경**: Primary 색상 (hsl(var(--primary)))
- **그림자**: 0 8px 24px 0 rgb(0 0 0 / 0.15)
- **Backdrop Filter**: blur(12px)
- **Border Radius**: 32px
- **Padding**: 0 24px
- **높이**: 40px
- **최소 너비**: 600px
- **Z-index**: 100

### 구성 요소 (좌측부터)

#### 1) My Advertisers 섹션

**레이블**
- 텍스트: "My Advertisers"
- 폰트 크기: 13px
- 폰트 굵기: 600
- 색상: Primary Foreground

**광고주 프로필 이미지**
- 크기: 24px × 24px (원형)
- 겹침 표시: 각 이미지가 -8px 씩 겹쳐서 표시
- Border: 2px solid Primary 색상
- Z-index: 역순 (첫 번째가 가장 위)
- 최대 3개까지 표시

**+개수 칩**
- 배경: Primary Foreground
- 텍스트 색상: Primary
- Border Radius: 12px
- Padding: 2px 6px
- 폰트 크기: 11px
- 폰트 굵기: 600
- 표시 내용: "+{나머지 광고주 수}"

#### 2) 구분선
- 너비: 1px
- 높이: 20px
- 색상: Primary Foreground (opacity: 0.3)

#### 3) 알림 섹션

**기본 상태**
- 아이콘: Bell (16px)
- 텍스트: "Reach Caster: {시나리오 타입} > {시나리오명} 생성이 완료되었습니다!"
- 폰트 크기: 13px
- 폰트 굵기: 500
- Padding: 6px 12px
- Border Radius: 16px
- Hover 시 배경: Primary Foreground (opacity: 0.1)

**알림 목록 레이어 (클릭 시 표시)**
- 위치: 알림 섹션 하단, 우측 정렬
- Margin Top: 8px
- 배경: Card 색상
- Border: 1px solid Border 색상
- Border Radius: 12px
- 최소 너비: 400px
- 최대 높이: 480px
- Overflow: 스크롤 (커스텀 스크롤바)
- 그림자: 0 12px 24px 0 rgb(0 0 0 / 0.15)
- Z-index: 1000

**알림 레이어 헤더**
- Padding: 0 16px 12px 16px
- Border Bottom: 1px solid Border 색상
- 제목: "최근 알림" (14px, 600)
- 부제: "{새 알림 개수}개의 새로운 알림 • 최근 10개 알림만 표시됩니다" (12px, Muted Foreground)

**알림 아이템**
- Padding: 12px 16px
- Border Left: 3px solid (새 알림: Primary, 기존 알림: transparent)
- Hover 시 배경: Muted 색상
- Cursor: pointer

**알림 아이템 내용**
- Slot명 (13px, 500, Foreground) + NEW 뱃지 (새 알림인 경우)
- 시나리오 정보: "Reach Caster: {타입} > {이름}" (12px, Muted Foreground)
- 완료 시간: "{시간} 전 완료" (11px, Muted Foreground)

**NEW 뱃지**
- 배경: Primary
- 텍스트: "NEW" (10px, 600, Primary Foreground)
- Padding: 1px 4px
- Border Radius: 4px

#### 4) 구분선 (동일)

#### 5) 등급 섹션

**기본 상태**
- 아이콘: 등급별 아이콘 (16px)
- 텍스트: 현재 등급명 (예: "Strategy Builder")
- 폰트 크기: 13px
- 폰트 굵기: 500
- Padding: 6px 12px
- Border Radius: 16px
- Hover 시 배경: Primary Foreground (opacity: 0.1)

**등급 툴팁 (Hover 시 표시)**
- 위치: 등급 섹션 하단, 우측 정렬
- Margin Top: 8px
- 배경: Card 색상
- Border: 1px solid Border 색상
- Border Radius: 12px
- Padding: 16px
- 최소 너비: 280px
- 최대 너비: 320px
- 그림자: 0 12px 24px 0 rgb(0 0 0 / 0.15)
- Z-index: 1000

**현재 등급 정보**
- 등급 아이콘 + 등급명 (14px, 600, Foreground)
- 등급 설명 (13px, line-height: 1.4, Muted Foreground)

**다음 등급 정보 (있는 경우)**
- "Next" 텍스트 + ChevronRight 아이콘 (12px)
- 다음 등급 아이콘 + 등급명 (13px, 600, Foreground)

### 등급 체계
1. **Slot-In Ready** (Zap 아이콘)
   - "ReadySet의 잠재력을 탐색 중인 예비 전략가."

2. **Active Slotter** (Activity 아이콘)
   - "데이터의 흐름을 만들기 시작한 실무 전략가."

3. **Strategy Builder** (Target 아이콘)
   - "개별 솔루션을 조합해 전략의 기틀을 잡는 숙련가."

4. **Solution Expert** (Award 아이콘)
   - "플랫폼을 완벽히 활용해 최적의 해답을 도출하는 전문가."

5. **Master Architect** (Crown 아이콘)
   - "복잡한 시나리오를 구조화하여 전략 생태계를 구축한 마스터."

6. **ReadySet Visionary** (Star 아이콘)
   - "플랫폼의 한계를 넘어 전략의 새 지평을 여는 독보적 선구자."

---

## 🎨 2. GNB (Global Navigation Bar)

### 위치 및 스타일
- **높이**: 64px (고정)
- **배경**: Transparent
- **Padding**: 0 24px
- **Display**: Flex (space-between)
- **Align Items**: Center

### 좌측 영역: 로고

**ReadySet 로고**
- 텍스트: "ReadySet"
- 폰트 크기: 20px
- 폰트 굵기: 700
- 색상: Foreground
- Margin: 0

### 우측 영역: 다크모드 토글 + 프로필

**다크모드 토글 버튼**
- 크기: 36px × 36px
- Padding: 8px
- 아이콘: Sun (라이트 모드) / Moon (다크 모드)
- 아이콘 크기: 18px
- 스타일: Ghost 버튼

**프로필 영역**
- Display: Flex
- Gap: 12px
- Padding: 8px 12px
- Border Radius: 12px
- Hover 시 배경: Muted 색상
- Cursor: pointer

**프로필 이미지**
- 크기: 36px × 36px (원형)
- 배경: Primary 색상
- 텍스트 색상: Primary Foreground
- 폰트 크기: 14px
- 폰트 굵기: 600
- 표시 내용: 사용자 이름의 첫 글자

**사용자 정보**
- 이름: 14px, 500, line-height: 1.2, Foreground
- 역할: 12px, line-height: 1.2, Muted Foreground
- Margin Top (역할): 2px

**드롭다운 아이콘**
- 아이콘: ChevronDown (16px)
- 색상: Muted Foreground

---

## 🎨 3. SNB (Side Navigation Bar)

### 위치 및 스타일
- **너비**: 240px (고정)
- **높이**: calc(100vh - 64px)
- **배경**: Background
- **Border Right**: 없음 (디자인 변경)
- **Overflow Y**: Auto (커스텀 스크롤바)

### 헤더 영역

**타이틀**
- 텍스트: "My Slots"
- 폰트 크기: 16px
- 폰트 굵기: 600
- Padding: 16px 16px 12px 16px

**Expand/Collapse 버튼**
- 텍스트: "Expand" / "Collapse"
- 폰트 크기: 11px
- 폰트 굵기: 500
- 스타일: Ghost 버튼 (Small)

### 네비게이션 영역

**SlotBoard 노드**
- 아이콘: LayoutGrid (16px)
- 텍스트: "SlotBoard" (14px)
- Padding: 8px 12px
- Border Radius: 6px
- Hover 시 배경: Muted 색상
- Cursor: pointer

**Slot 노드 (폴더)**
- 아이콘: Archive (16px)
- 텍스트: Slot명 (14px, ellipsis 처리)
- 결과물 개수 뱃지: 12px, Muted 배경, Muted Foreground
- Padding: 8px 12px
- Margin Left: 16px (들여쓰기)
- Border Radius: 6px
- Hover 시 배경: Muted 색상
- Cursor: pointer

**펼침/접힘 아이콘**
- 아이콘: ChevronRight (12px)
- 회전: 펼쳐진 상태 90deg, 접힌 상태 0deg
- Transition: transform 0.2s

**솔루션 노드**
- 아이콘: Hexagon (16px)
- 활성 솔루션: Fill Primary, Color Primary Foreground
- 비활성 솔루션: Opacity 0.5
- 텍스트: 솔루션명 (14px)
- 준비중 뱃지: "준비중" (11px, Muted 배경)
- Margin Left: 32px (2단계 들여쓰기)
- Border Left: 1px solid Border (계층 표시)
- Padding Left: 8px

**시나리오 노드**
- 텍스트: 시나리오명 (13px)
- Margin Left: 48px (3단계 들여쓰기)
- Padding: 6px 8px
- Border Radius: 4px
- Border Left: 1px solid Border

**시나리오 상태 표시**
- 완료: 일반 텍스트
- 생성 중: Pulse 애니메이션 + 진행률 원형 차트 (14px)
- 대기 중: Muted Foreground 색상 + 빈 원형 차트

**진행률 원형 차트**
- 크기: 14px × 14px
- 배경 원: Muted Foreground, Stroke Width 1.5px
- 진행 원: Primary, Stroke Width 1.5px, Stroke Linecap round
- 회전: -90deg (12시 방향부터 시작)

---

## 🎨 4. Breadcrumb

### 표시 조건
- SlotBoard 메인 화면: 표시 안 함
- 하위 페이지 (Slot 생성, 수정, 상세 등): 표시

### 위치 및 스타일
- **위치**: Main Content 영역 상단
- **높이**: 48px
- **Padding**: 12px 24px
- **배경**: Transparent
- **Border Bottom**: 1px solid Border

### 구성 요소

**Breadcrumb 아이템**
- 폰트 크기: 14px
- 색상: Muted Foreground (클릭 가능), Foreground (현재 페이지)
- Hover 시: Foreground 색상, Underline
- Cursor: pointer (클릭 가능한 경우)

**구분자**
- 아이콘: ChevronRight (14px)
- 색상: Muted Foreground
- Margin: 0 8px

**예시**
```
SlotBoard > 새 Slot 생성
SlotBoard > 삼성 갤럭시 S24 캠페인
SlotBoard > 삼성 갤럭시 S24 캠페인 > Reach Caster > 시나리오 A
```

---

## 🎨 5. Footer

### 위치 및 스타일
- **위치**: Main Content 영역 하단 (고정되지 않음, 컨텐츠 끝에 위치)
- **최소 높이**: 56px
- **배경**: Background (투명)
- **Border Top**: 없음
- **Padding**: 16px 24px
- **Display**: Flex (space-between)
- **Align Items**: Center

### 좌측 영역: 저작권 정보

**저작권 텍스트**
- 텍스트: "© 2026 CJ Mezzomedia. All rights reserved."
- 폰트 크기: 12px
- 색상: Muted Foreground

### 우측 영역: 버전 정보

**버전 텍스트**
- 텍스트: "ReadySet Platform v1.0"
- 폰트 크기: 11px
- 색상: Muted Foreground

### 특수 케이스
- 컨텐츠가 짧아서 화면을 채우지 못할 경우에도 Footer는 하단에 위치
- 스크롤이 있는 경우 Footer는 컨텐츠 끝에 위치 (고정되지 않음)
- 모든 페이지에서 동일한 Footer 표시 (로그인/회원가입 페이지 제외)

---

## 🔄 상호작용 정의

### Floating Alert Bar

**알림 클릭**
1. 알림 목록 레이어 토글 (열기/닫기)
2. 외부 클릭 시 레이어 자동 닫기
3. 알림 아이템 클릭 시:
   - 해당 시나리오 상세 페이지로 이동
   - 레이어 닫기

**등급 Hover**
1. 마우스 오버 시 등급 툴팁 표시
2. 마우스 아웃 시 툴팁 숨김
3. 현재 등급 정보 + 다음 등급 정보 표시

### GNB

**다크모드 토글**
1. 클릭 시 다크/라이트 모드 전환
2. 아이콘 변경 (Sun ↔ Moon)
3. HTML 요소에 'dark' 클래스 추가/제거

**프로필 클릭**
1. 프로필 드롭다운 메뉴 표시 (향후 구현)
2. 메뉴 항목: 내 정보, 설정, 로그아웃 등

### SNB

**Expand/Collapse 버튼**
1. 클릭 시 모든 Slot 펼치기/접기
2. 버튼 텍스트 변경 (Expand ↔ Collapse)

**Slot 노드 클릭**
1. 해당 Slot 펼치기/접기
2. ChevronRight 아이콘 회전 (0deg ↔ 90deg)
3. 하위 솔루션 노드 표시/숨김

**솔루션 노드 클릭**
1. 해당 솔루션 펼치기/접기
2. 하위 시나리오 노드 표시/숨김

**시나리오 노드 클릭**
1. 해당 시나리오 상세 페이지로 이동

**SlotBoard 노드 클릭**
1. SlotBoard 메인 화면으로 이동

### Breadcrumb

**Breadcrumb 아이템 클릭**
1. 클릭한 경로로 이동
2. 현재 페이지 아이템은 클릭 불가

### Footer

**Footer 표시**
- 모든 페이지 하단에 저작권 및 버전 정보 표시
- 좌측: 저작권 정보
- 우측: 버전 정보
- 링크나 버튼 없음 (정보 표시만)

---

## 📊 데이터 구조

### 광고주 프로필 데이터
```typescript
interface AdvertiserProfile {
  id: number
  name: string
  avatar: string // 프로필 이미지 URL 또는 색상 코드
}
```

### 알림 데이터
```typescript
interface Notification {
  id: number
  slotName: string
  scenarioType: string // 'A/B 테스트', '성과 분석', '타겟팅' 등
  scenarioName: string
  completedMinutesAgo: number
  isNew: boolean
}
```

### 사용자 등급 데이터
```typescript
interface UserGrade {
  name: string // 'Slot-In Ready', 'Active Slotter', 등
  icon: LucideIcon
  description: string
}
```

### Breadcrumb 데이터
```typescript
interface BreadcrumbItem {
  label: string
  onClick?: () => void // 클릭 가능한 경우
}
```

---

## 🎯 접근성 고려사항

### 키보드 네비게이션
- Tab 키로 모든 인터랙티브 요소 접근 가능
- Enter/Space 키로 버튼 및 링크 활성화
- Escape 키로 열린 레이어/드롭다운 닫기

### 스크린 리더 지원
- 모든 아이콘 버튼에 aria-label 추가
- 알림 개수, 등급 정보 등 시각적 정보를 텍스트로 제공
- 현재 페이지 위치를 aria-current로 표시
- Footer는 contentinfo role 자동 적용

### 색상 대비
- WCAG 2.1 AA 기준 준수 (최소 4.5:1)
- 다크/라이트 모드 모두 충분한 대비 제공

---

## 🚨 예외 케이스 및 에러 처리

### 알림 데이터 로딩 실패
- 알림 섹션에 "알림을 불러올 수 없습니다" 메시지 표시
- 재시도 버튼 제공

### 광고주 데이터 없음
- "My Advertisers" 섹션에 "광고주가 없습니다" 메시지 표시
- 광고주 추가 버튼 제공

### 네트워크 오류
- 토스트 메시지로 오류 알림
- 자동 재시도 (최대 3회)

### 세션 만료
- 로그인 페이지로 리디렉션
- 현재 페이지 URL을 저장하여 로그인 후 복귀

---

## 💡 개발 시 주의사항

### 성능 최적화
- 알림 목록은 최근 10개만 표시 (페이지네이션 없음)
- SNB 트리 구조는 가상 스크롤 고려 (Slot이 많을 경우)
- 다크모드 전환 시 애니메이션 최소화

### 반응형 고려
- 현재는 데스크톱 전용 (1280px 이상)
- 향후 태블릿/모바일 대응 시 SNB는 Drawer로 변경 예정

### 상태 관리
- 다크모드 설정은 localStorage에 저장
- SNB 펼침/접힘 상태는 sessionStorage에 저장
- 알림 읽음 상태는 서버와 동기화

### 애니메이션
- 모든 transition은 0.2s 이하로 유지
- Pulse 애니메이션은 성능 영향 최소화
- Hover 효과는 즉각 반응

---

## 📝 API 연동

### 알림 목록 조회
```
GET /api/notifications
Response: Notification[]
```

### 광고주 목록 조회
```
GET /api/advertisers/my
Response: AdvertiserProfile[]
```

### 사용자 등급 조회
```
GET /api/user/grade
Response: UserGrade
```

### Slot 트리 구조 조회
```
GET /api/slots/tree
Response: SlotTreeNode[]
```

---

## 🎨 디자인 토큰

### 색상
- Primary: hsl(var(--primary))
- Primary Foreground: hsl(var(--primary-foreground))
- Background: hsl(var(--background))
- Foreground: hsl(var(--foreground))
- Muted: hsl(var(--muted))
- Muted Foreground: hsl(var(--muted-foreground))
- Border: hsl(var(--border))
- Card: hsl(var(--card))

### 타이포그래피
- 제목 (GNB 로고): 20px, 700
- 섹션 제목 (SNB): 16px, 600
- 본문 (일반 텍스트): 14px, 400-500
- 보조 텍스트: 12-13px, 400-500
- 캡션: 11px, 400-600

### 간격
- 기본 Gap: 8px, 12px, 16px, 24px
- Padding (버튼): 6px 12px, 8px 12px
- Padding (컨테이너): 16px, 24px

### Border Radius
- 작은 요소 (뱃지): 4px, 8px, 12px
- 중간 요소 (버튼, 카드): 12px, 16px
- 큰 요소 (Floating Bar): 32px
- 원형: 50%

---

## ✅ 개발 체크리스트

### GNB
- [ ] 로고 표시
- [ ] 다크모드 토글 기능
- [ ] 프로필 영역 표시
- [ ] 프로필 드롭다운 (향후)

### Floating Alert Bar
- [ ] 광고주 프로필 이미지 표시
- [ ] 알림 섹션 표시
- [ ] 알림 목록 레이어
- [ ] 등급 섹션 표시
- [ ] 등급 툴팁
- [ ] 외부 클릭 시 레이어 닫기

### SNB
- [ ] Slot 트리 구조 표시
- [ ] 펼치기/접기 기능
- [ ] 시나리오 진행 상태 표시
- [ ] 커스텀 스크롤바
- [ ] 네비게이션 기능

### Breadcrumb
- [ ] 동적 경로 표시
- [ ] 클릭 네비게이션
- [ ] 현재 페이지 강조

### Footer
- [ ] 저작권 정보 표시
- [ ] 버전 정보 표시
- [ ] 레이아웃 정렬 (좌우 배치)

### 공통
- [ ] 다크/라이트 모드 지원
- [ ] 반응형 (향후)
- [ ] 접근성 (ARIA)
- [ ] 키보드 네비게이션

---

## 📚 참고 자료

### 구현 파일
- `src/components/layout/GlobalNavBar.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Footer.tsx` ✅ (구현 완료)
- `src/components/layout/AppLayout.tsx`
- `src/components/WorkspaceLayout.tsx`

### 디자인 시스템
- Shadcn UI 컴포넌트 라이브러리
- Lucide Icons
- Tailwind CSS + CSS Variables

### 관련 문서
- `guide/Screen_Specification_Guide.md`
- `plan/strategic(highlevel)/예측분석_플랫폼_IA_v1.0.md`

---

## 🔄 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| v1.0 | 2024-01-15 | 초안 작성 | 기획팀 |

---

## 💬 예상 질문 (FAQ)

### Q1. Floating Alert Bar는 모든 페이지에서 표시되나요?
**A**: 네, 로그인 후 모든 페이지에서 표시됩니다. 단, 로그인/회원가입 페이지에서는 표시되지 않습니다.

### Q2. SNB의 Slot 개수가 많아지면 어떻게 처리하나요?
**A**: 현재는 스크롤로 처리하며, 향후 Slot이 100개 이상일 경우 가상 스크롤(Virtual Scroll)을 적용할 예정입니다.

### Q3. 알림은 실시간으로 업데이트되나요?
**A**: Phase 1에서는 페이지 로드 시에만 조회하며, Phase 2에서 WebSocket을 통한 실시간 알림을 구현할 예정입니다.

### Q4. 다크모드 설정은 어디에 저장되나요?
**A**: 브라우저의 localStorage에 저장되며, 사용자가 다시 방문했을 때 이전 설정이 유지됩니다.

### Q5. Breadcrumb의 최대 깊이는 어떻게 되나요?
**A**: 최대 5단계까지 표시하며, 그 이상일 경우 중간 경로를 "..." 으로 축약합니다.

### Q6. 등급 시스템은 어떤 기준으로 산정되나요?
**A**: 사용자의 활동 지표(Slot 생성 수, 시나리오 실행 수, 플랫폼 사용 일수 등)를 종합하여 자동으로 산정됩니다. 자세한 기준은 별도 문서 참조.

### Q7. 프로필 드롭다운에는 어떤 메뉴가 들어가나요?
**A**: 내 정보, 계정 설정, 알림 설정, 도움말, 로그아웃 등이 포함될 예정입니다. (Phase 2)

### Q8. SNB에서 Slot을 드래그 앤 드롭으로 순서 변경할 수 있나요?
**A**: Phase 1에서는 지원하지 않으며, Phase 2에서 구현 예정입니다.

### Q9. 모바일에서는 레이아웃이 어떻게 변경되나요?
**A**: Phase 1은 데스크톱 전용이며, Phase 2에서 모바일 대응 시 SNB는 햄버거 메뉴로 변경되고, Floating Alert Bar는 하단 고정 바로 변경될 예정입니다.

### Q10. 광고주 프로필 이미지가 없을 경우 어떻게 표시되나요?
**A**: 광고주명의 첫 글자를 표시하며, 배경색은 광고주 ID를 기반으로 자동 생성됩니다.

### Q11. Footer는 모든 페이지에서 표시되나요?
**A**: 네, 로그인 후 모든 페이지에서 표시됩니다. 단, 로그인/회원가입 페이지에서는 표시되지 않습니다.

### Q12. Footer에 링크나 버튼을 추가할 수 있나요?
**A**: 현재는 정보 표시만 하며, 향후 필요 시 이용약관, 개인정보처리방침 등의 링크를 추가할 수 있습니다.

### Q13. 버전 정보는 어떻게 관리하나요?
**A**: 환경 변수 또는 package.json의 version 필드를 참조하여 자동으로 표시할 수 있습니다.

### Q14. Footer가 컨텐츠와 겹치지 않도록 하려면?
**A**: Main Content 영역에 `min-height: calc(100vh - 64px - 56px)` 를 적용하여 Footer가 항상 하단에 위치하도록 합니다.
