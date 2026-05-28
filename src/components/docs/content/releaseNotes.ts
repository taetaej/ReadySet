import type { DocSection } from '../docsData'

export const releaseNotesSection: DocSection = {
  id: 'release-notes',
  title: 'Release Notes',
  pages: [
    {
      id: 'release-notes-latest',
      title: '최신 업데이트',
      slug: 'release-notes-latest',
      updatedAt: '2026-06-25',
      content: `# Release Notes

## v1.0.0 (2026-06-25)

### SlotBoard

- \`NEW\` 목적별 작업 공간(Slot) 생성 및 관리
- \`NEW\` 광고주 매핑 (생성 후 변경 불가)
- \`NEW\` 공개 범위 설정 (Private / Internal / Shared)
- \`NEW\` Slot Home: Slot Feed, Documents

### DataShot

- \`NEW\` 업종별 광고 성과 벤치마크 데이터셋 생성
- \`NEW\` 지원 매체: Google Ads, Meta, kakao모먼트, 네이버 성과형 DA, 네이버 보장형 DA, TikTok
- \`NEW\` 데이터셋 목록 관리 (이동, 복제, 삭제)
- \`NEW\` 결과 테이블 조회 및 CSV 내보내기

### Reach Caster

- \`NEW\` Ratio Finder: TVC/Digital 최적 비중 탐색
- \`NEW\` Reach Predictor: 매체 믹스 기반 도달률 예측
- \`NEW\` 시나리오 목록 관리 (리스트 뷰 + 타임라인 뷰)
- \`NEW\` 시나리오 복제, 이동, 삭제
- \`NEW\` 결과 화면: 차트 시각화 + 상세 데이터 테이블
- \`NEW\` 공유: Copy Link, Export to Excel

### SpinX

- \`NEW\` AI 인사이트 어시스턴트 (Reach Caster 연동)
- \`NEW\` 컨텍스트 자동 요약 + 추천 질문
- \`NEW\` 멀티 모델 선택 (Gemini, Claude, GPT)
- \`NEW\` 웹 검색 + 내부 문서 참조 (RAG) 기반 답변
- \`NEW\` 차트 시각화 응답
- \`NEW\` 세션 관리 (14일 유효)

### GNB

- \`NEW\` Floating Alert Bar (광고주 + 알림 + 등급)
- \`NEW\` 사용자 등급 시스템
- \`NEW\` 다크모드 토글

### User Guide

- \`NEW\` Gitbook 스타일 사용자 가이드 (/docs)
- \`NEW\` 헤딩 단위 검색 + 스니펫 미리보기
- \`NEW\` 우측 미니 TOC + Share 기능`
    }
  ]
}
