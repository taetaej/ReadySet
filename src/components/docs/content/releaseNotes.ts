import type { DocSection } from '../docsData'

export const releaseNotesSection: DocSection = {
  id: 'release-notes',
  title: 'Release Notes',
  pages: [
    {
      id: 'release-notes-latest',
      title: '최신 업데이트',
      slug: 'release-notes-latest',
      updatedAt: '2026-06-29',
      content: `# Release Notes

## v1.0.0 (2026-06-29)

ReadySet 플랫폼 정식 오픈

---

### SlotBoard

- \`NEW\` 목적별 작업 공간(Slot) 생성 · 관리
- \`NEW\` 광고주 매핑, 공개 범위 설정
- \`NEW\` Slot Home

### DataShot

- \`NEW\` 업종별 광고 성과 벤치마크 데이터셋 생성
- \`NEW\` 6개 매체 지원 (Google Ads, Meta, kakao모먼트, 네이버 성과형 DA, 네이버 보장형 DA, TikTok)
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
