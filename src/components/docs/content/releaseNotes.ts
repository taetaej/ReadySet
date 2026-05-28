import type { DocSection } from '../docsData'

export const releaseNotesSection: DocSection = {
  id: 'release-notes',
  title: 'Release Notes',
  pages: [
    {
      id: 'release-notes-latest',
      title: '최신 업데이트',
      slug: 'release-notes-latest',
      updatedAt: '2026-05-27',
      content: `# Release Notes

## v1.0.0 (2026.05)

- ReadySet 플랫폼 정식 출시
- SlotBoard, DataShot, Reach Caster 솔루션 제공
- SpinX AI 어시스턴트 베타 출시
- 시나리오 비교 기능 추가
- Gitbook 스타일 사용자 가이드 추가`
    }
  ]
}
