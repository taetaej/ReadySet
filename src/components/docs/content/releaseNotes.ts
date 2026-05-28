import type { DocSection } from '../docsData'

export const releaseNotesSection: DocSection = {
  id: 'release-notes',
  title: 'Release Notes',
  pages: [
    {
      id: 'release-notes-latest',
      title: '최신 업데이트',
      slug: 'release-notes-latest',
      updatedAt: '2026-05-28',
      content: `# Release Notes

## v1.1.0 (2026.05.28)

### 신규 기능

- User Guide (Docs) 페이지 추가
- 검색 기능 개선 (헤딩 단위 결과 + 스니펫 미리보기)
- SNB 하단 User Guide 진입 버튼 상시 노출

### 개선

- 다크모드 상태 Docs ↔ 플랫폼 간 동기화
- Sidebar 레이아웃 개선 (스크롤 독립 처리)

---

## v1.0.0 (2026.05)

### 플랫폼 출시

- ReadySet 플랫폼 정식 출시
- SlotBoard: 캠페인 작업 공간 관리
- 권한 시스템: 3-Step Filter (광고주 권한 → 공개 범위 → 롤 매칭)

### DataShot

- 광고 플랫폼 데이터셋 생성 (Meta, Google, Naver, Kakao)
- 데이터셋 목록 관리 및 상태 추적

### Reach Caster

- Ratio Finder: TVC/Digital 최적 비중 탐색
- Reach Predictor: 매체 믹스 기반 도달률 예측
- 시나리오 목록 관리 (리스트 뷰 + 타임라인 뷰)
- 시나리오 복제 / 이동 / 삭제
- 결과 화면: 차트 시각화 + 상세 데이터 테이블
- 시나리오 비교: 타겟 / 기간 / 예산 축 비교 + 정합성 체크

### SpinX

- AI 인사이트 어시스턴트 베타 출시
- Reach Caster 결과 화면 연동
- 컨텍스트 자동 요약 + 추천 질문
- 멀티 모델 선택 (Gemini, Claude, GPT)
- 웹 검색 + RAG 기반 답변
- 차트 시각화 응답
- 역질문 UI + 25초 자동 건너뛰기
- 세션 관리 (14일 유효)

### GNB

- Floating Alert Bar (광고주 + 알림 + 등급)
- 사용자 등급 시스템 (5단계)
- 다크모드 토글

---

## 향후 예정

### 단기 (Q3 2026)

- DataShot 결과 시각화 고도화
- 시나리오 비교 기능 정식 출시
- SpinX 스트리밍 응답 (SSE)
- Export 기능 실제 구현 (Excel, PDF)

### 중기 (Q4 2026)

- Ad Curator 솔루션 출시
- Budget Optimizer 솔루션 출시
- SpinX DataShot 연동
- 시나리오 템플릿 기능

### 장기 (2027)

- AI 기반 자동 시나리오 추천
- 크로스 솔루션 통합 리포트
- 팀 협업 기능 강화`
    }
  ]
}
