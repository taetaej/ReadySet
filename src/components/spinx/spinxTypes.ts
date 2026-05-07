// spinxTypes.ts — SpinX 패널에서 사용하는 모든 타입 정의

export interface SpinXPanelProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode?: boolean
  scenarioName?: string
  analysisType?: 'ratioFinder' | 'reachPredictor'
  positioning?: 'fixed' | 'absolute'
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
