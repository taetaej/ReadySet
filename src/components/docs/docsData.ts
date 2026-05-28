export interface DocPage {
  id: string
  title: string
  slug: string
  content: string
  updatedAt?: string
  disabled?: boolean
  disabledLabel?: string
}

export interface DocSection {
  id: string
  title: string
  pages: DocPage[]
  disabled?: boolean
  disabledLabel?: string
}

// 각 섹션을 개별 파일에서 import
import { getStartedSection } from './content/getStarted'
import { slotboardSection } from './content/slotboard'
import { datashotSection } from './content/datashot'
import { adCuratorSection, budgetOptimizerSection } from './content/disabled'
import { reachCasterSection } from './content/reachCaster'
import { spinxSection } from './content/spinx'
import { resourcesSection } from './content/resources'
import { releaseNotesSection } from './content/releaseNotes'

export const docsStructure: DocSection[] = [
  getStartedSection,
  slotboardSection,
  datashotSection,
  adCuratorSection,
  budgetOptimizerSection,
  reachCasterSection,
  spinxSection,
  resourcesSection,
  releaseNotesSection
]
