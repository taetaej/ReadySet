// spinxTypes.ts — SpinX 패널에서 사용하는 모든 타입 정의

export interface SpinXMentionItem {
  id: string
  label: string
}

export interface SpinXPanelProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode?: boolean
  scenarioName?: string
  analysisType?: 'ratioFinder' | 'reachPredictor' | 'budgetOptimizer'
  positioning?: 'fixed' | 'absolute'
  initialMessage?: string
  /** 열릴 때 입력창에 미리 채울 텍스트 (자동 전송하지 않음) */
  initialInput?: string
  /** @멘션 가능한 항목 (예: 결과 화면 차트들) */
  mentionItems?: SpinXMentionItem[]
}

export type LLMModel = {
  provider: string
  name: string
  displayName: string
  description: string
}

export type MessageContent = string | { type: 'chart'; data: ChartData } | { type: 'error'; message: string }

export interface ChartData {
  title: string
  description: string
  categories: string[]
  series: Array<{ name: string; data: number[]; color: string; yAxis?: number }>
}

export interface Message {
  role: 'user' | 'assistant'
  content: MessageContent
  timestamp: string
  originalQuestion?: string
  webSources?: WebSource[]
  ragSources?: RagSource[]
  isModelChange?: boolean
}

export interface WebSource {
  title: string
  url: string
}

export interface RagSource {
  title: string
  summary: string
  type: 'pdf' | 'docx' | 'url'
  url?: string
}

export interface ClarifyingQuestion {
  question: string
  options: string[]
  allowCustom?: boolean
  selectionMode?: 'single' | 'multiple'
}
