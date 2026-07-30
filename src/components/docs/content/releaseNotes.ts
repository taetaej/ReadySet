import type { DocSection } from '../docsData'

export const releaseNotesSection: DocSection = {
  id: 'release-notes',
  title: 'Release Notes',
  pages: [
    {
      id: 'release-notes-latest',
      title: '최신 업데이트',
      slug: 'release-notes-latest',
      updatedAt: '2026-08-06',
      content: `# Release Notes

## v1.1.0 (2026-08-06)

ReadySet 플랫폼 기능 확장 및 데이터 고도화

---

### Slot Home

- \`NEW\` 활동 로그 — Slot 내 주요 활동 이력 조회
- \`NEW\` 리소스 파일 첨부 — Slot에 참고 자료 업로드 및 관리

### Reach Caster

- \`NEW\` 시나리오 비교 — 예산·타겟·기간 3가지 비교 유형으로 시나리오 간 도달 비교 분석

### DataShot

- \`NEW\` 집계 행 — 데이터셋 결과 테이블 상단에 전체/필터 기준 합산·평균 집계 표시
- \`NEW\` Meta 협력 광고 데이터 — 협력 광고 파트너사 조회조건 옵션 및 협력 광고 지표 추가



## v1.0.1 (2026-07-24)

ReadySet 플랫폼 보안 강화 및 개선

---

### GNB · 공통

- \`NEW\` 접속 이력 조회 기능 

### SpinX

- \`IMPROVED\` SpinX 버튼 UI 개선 — Ask SpinX 말풍선 추가, 다크모드 가시성 강화

### Reach Caster

- \`NEW\` 다운로드 파일 내 Reach Curve 데이터 추가



## v1.0.0 (2026-06-29)

ReadySet 플랫폼 정식 오픈

---

### SlotBoard

- \`NEW\` 목적별 작업 공간(Slot) 생성 · 관리
- \`NEW\` 광고주 매핑, 공개 범위 설정
- \`NEW\` Slot Home

### DataShot

- \`NEW\` 업종별 광고 성과 벤치마크 데이터셋 생성
- \`NEW\` 5개 매체 지원 (Google Ads, Meta, kakao모먼트, 네이버 성과형 DA, 네이버 보장형 DA, TikTok)
- \`NEW\` 데이터셋 목록 관리 및 CSV 내보내기

### Reach Caster

- \`NEW\` Ratio Finder: TVC/Digital 최적 비중 탐색
- \`NEW\` Reach Predictor: 매체 믹스 기반 도달률 예측
- \`NEW\` 시나리오 목록 (리스트 뷰 + 타임라인 뷰)
- \`NEW\` 결과 시각화 + 상세 데이터 테이블
- \`NEW\` 시나리오 복제, 공유 (Link / Excel)

### SpinX

- \`NEW\` AI 인사이트 어시스턴트 (Reach Caster 연동)
- \`NEW\` 컨텍스트 자동 요약 + 추천 질문
- \`NEW\` 멀티 모델 선택 (Claude, GPT)
- \`NEW\` 월간 질문 한도 관리

### GNB · 공통

- \`NEW\` Floating Alert Bar (광고주 + 알림 + 등급)
- \`NEW\` 다크모드 지원
- \`NEW\` Gitbook 스타일 사용자 가이드 (/docs)`
    }
  ]
}
