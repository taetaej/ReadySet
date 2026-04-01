import { X, Paperclip, Copy, Check, Clock, RotateCcw, Scale, Image as ImageIcon, Rotate3d, Square, RefreshCw, Target, ChevronDown, FileText, ArrowUp, Globe, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface SpinXPanelProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode?: boolean
  scenarioName?: string
  analysisType?: 'ratioFinder' | 'reachPredictor'
  positioning?: 'fixed' | 'absolute'
}

// LLM 모델 타입 정의
type LLMModel = {
  provider: string
  name: string
  displayName: string
  description: string
}

const availableModels: LLMModel[] = [
  { provider: 'Anthropic', name: 'claude-sonnet-4.5', displayName: 'Claude Sonnet 4.5', description: '데이터 해석 · 전략 수립' },
  { provider: 'Anthropic', name: 'claude-haiku-4.5', displayName: 'Claude Haiku 4.5', description: '빠르고 명확한 답변' },
  { provider: 'OpenAI', name: 'gpt-4o', displayName: 'Chat GPT 4o', description: '창의적 기획 · 아이디어' },
  { provider: 'Google', name: 'gemini-3pro', displayName: 'Gemini 3pro', description: '대량 컨텍스트 · 시장 탐색' }
]

export function SpinXPanel({ isOpen, onClose, isDarkMode = false, scenarioName = '25-34세 여성 타겟 집중 공략', analysisType = 'ratioFinder', positioning = 'fixed' }: SpinXPanelProps) {
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [sessionTooltipOpen, setSessionTooltipOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string | { type: 'chart', data: any } | { type: 'error', message: string }, timestamp: string, originalQuestion?: string, webSources?: Array<{ title: string, url: string }>, ragSources?: Array<{ title: string, summary: string, type: 'pdf' | 'docx' | 'url', url?: string }>, isModelChange?: boolean }>>([])
  const [attachMenuOpen, setAttachMenuOpen] = useState(false)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [attachedUrl, setAttachedUrl] = useState<string>('')
  const [showUrlDialog, setShowUrlDialog] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentQuestion, setCurrentQuestion] = useState<string>('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [selectedModel, setSelectedModel] = useState<LLMModel>(availableModels[3]) // Gemini 3pro
  const [modelMenuOpen, setModelMenuOpen] = useState(false)
  const [expandedWebSources, setExpandedWebSources] = useState<Set<number>>(new Set())
  const [expandedRagSources, setExpandedRagSources] = useState<Set<number>>(new Set())
  const [activeFootnote, setActiveFootnote] = useState<{ msgIndex: number, footnoteNum: number } | null>(null)
  const [loadingMessage, setLoadingMessage] = useState('질문을 분석하고 있어요...')
  const loadingMessageIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [retryCount, setRetryCount] = useState<Map<string, number>>(new Map())

  // 역질문 (Clarifying Question) 상태
  const [clarifyingQuestion, setClarifyingQuestion] = useState<{
    question: string
    options: string[]
    allowCustom?: boolean
    selectionMode?: 'single' | 'multiple'
  } | null>(null)
  const [clarifyingSelected, setClarifyingSelected] = useState<number | null>(null)
  const [clarifyingMultiSelected, setClarifyingMultiSelected] = useState<number[]>([])
  const [clarifyingCustom, setClarifyingCustom] = useState('')
  const [clarifyingCustomMode, setClarifyingCustomMode] = useState(false)

  // 스트리밍 (타이핑) 효과 상태
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null) // 현재 스트리밍 중인 메시지 인덱스
  const [streamingDisplayText, setStreamingDisplayText] = useState('') // 현재까지 표시된 텍스트
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const streamingFullTextRef = useRef<string>('') // 전체 텍스트 (ref로 관리)

  // 각주 팝오버 외부 클릭 시 닫기
  useEffect(() => {
    if (!activeFootnote) return
    const handleClickOutside = () => setActiveFootnote(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [activeFootnote])

  // 대화 시작 날짜 (실제로는 localStorage 등에서 관리)
  const conversationStartDate = new Date()
  const conversationExpiryDate = new Date(conversationStartDate)
  conversationExpiryDate.setDate(conversationExpiryDate.getDate() + 14)
  
  const timeRemaining = conversationExpiryDate.getTime() - new Date().getTime()
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

  // 스트리밍 효과: 줄 단위로 텍스트를 점진적으로 표시
  const startStreaming = (fullText: string, msgIndex: number) => {
    // 이전 스트리밍 정리
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current)
      streamingIntervalRef.current = null
    }

    streamingFullTextRef.current = fullText
    setStreamingIndex(msgIndex)
    setStreamingDisplayText('')

    // ref 기반 커서 추적 (클로저 문제 방지)
    const cursor = { lineIdx: 0, charIdx: 0 }
    const lines = fullText.split('\n')
    const CHAR_INTERVAL = 12

    streamingIntervalRef.current = setInterval(() => {
      if (cursor.lineIdx >= lines.length) {
        // 스트리밍 완료
        if (streamingIntervalRef.current) {
          clearInterval(streamingIntervalRef.current)
          streamingIntervalRef.current = null
        }
        setStreamingIndex(null)
        setStreamingDisplayText('')
        return
      }

      const currentLine = lines[cursor.lineIdx]

      if (cursor.charIdx <= currentLine.length) {
        const linesSoFar = lines.slice(0, cursor.lineIdx).join('\n')
        const partial = currentLine.slice(0, cursor.charIdx)
        const displayed = linesSoFar + (cursor.lineIdx > 0 ? '\n' : '') + partial
        setStreamingDisplayText(displayed)
        cursor.charIdx++
      } else {
        cursor.lineIdx++
        cursor.charIdx = 0
      }
    }, CHAR_INTERVAL)
  }

  // 새 assistant 텍스트 메시지가 추가되면 스트리밍 시작
  const prevMessagesLenRef = useRef(0)
  useEffect(() => {
    const len = messages.length
    if (len > prevMessagesLenRef.current && len > 0) {
      const lastMsg = messages[len - 1]
      if (lastMsg.role === 'assistant' && typeof lastMsg.content === 'string' && !lastMsg.isModelChange) {
        startStreaming(lastMsg.content, len - 1)
      }
    }
    prevMessagesLenRef.current = len
  }, [messages.length])

  // 스트리밍 중 스크롤 추적
  useEffect(() => {
    if (streamingIndex !== null) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [streamingDisplayText])

  // 컴포넌트 언마운트 시 스트리밍 정리
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current)
      }
    }
  }, [])

  // 메시지가 추가될 때마다 스크롤을 최신 메시지로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // 추천 질문 (Ratio Finder 컨텍스트)
  const suggestedQuestions = [
    '이 예측 결과를 어떻게 해석해야 하나요?',
    'Effective Impression이 무엇인가요?',
    '이 데이터를 차트로 시각화해주세요',
    '2026년 5월 주요 뷰티 행사가 있나요?'
  ]

  // 질문별 답변 예시 + 키워드 트리거
  const answerExamples: Record<string, string | { type: 'chart', data: any } | { type: 'error', message: string }> = {
    // 추천 질문 답변
    '이 예측 결과를 어떻게 해석해야 하나요?': '현재 분석 결과는 TVC 50%, Digital 50% 비율이 최적임을 보여줍니다.\n\n주요 해석 포인트:\n\n1. 예상 Reach 1+가 73.2%로, 타겟 오디언스의 약 73%에게 최소 1회 이상 광고가 노출됩니다.\n\n2. 이 비율은 비용 대비 효율성이 가장 높은 지점으로, 예산을 더 투입해도 도달률 증가폭이 감소하는 체감 수익 구간에 진입합니다.\n\n3. 25-34세 여성 타겟의 미디어 소비 패턴이 TV와 디지털을 균형있게 사용하기 때문에 이러한 결과가 도출되었습니다.',
    'Effective Impression이 무엇인가요?': 'Effective Impression(유효 노출)은 광고가 실제로 효과적으로 전달된 노출 수를 의미합니다. [1]\n\n일반 Impression과의 차이:\n\n• 일반 Impression: 광고가 화면에 표시된 모든 횟수\n• Effective Impression: 사용자가 실제로 인지할 수 있는 조건에서 노출된 횟수\n\nReadySet 플랫폼 내 측정 기준:\n- Digital: 광고 면적의 50% 이상이 1초 이상 뷰포트에 노출 (동영상은 2초 이상 + 음성 재생) [2]\n- TVC: Nielsen 패널 기반 프로그램 시청률 × 광고 시간대 잔존율로 추정 [3]\n\nRatio Finder에서의 활용:\n- Effective Impression은 매체별 예산 배분 최적화의 핵심 지표로, 단순 노출 수가 아닌 실질적 광고 효과를 기준으로 최적 비중을 산출합니다.\n- 시뮬레이션 시 각 매체의 Effective CPM(eCPM)을 기반으로 비용 효율성을 비교합니다. [4]',
    '이 데이터를 차트로 시각화해주세요': {
      type: 'chart',
      data: {
        title: '매체별 예산 배분 및 도달률 비교',
        description: '다양한 예산 배분 시나리오에 따른 TVC/Digital 예산과 예상 도달률을 비교한 차트입니다. 현재 최적 비율(TVC 50%, Digital 50%)이 가장 높은 도달률(73.2%)을 보이며, 예산을 20% 증액할 경우 78.5%까지 도달률이 증가합니다.',
        categories: ['현재 최적', '예산 +20%', 'TVC 중심', 'Digital 중심'],
        series: [
          { name: 'TVC 예산', data: [500, 600, 700, 300], color: '#1a1a1a' },
          { name: 'Digital 예산', data: [500, 600, 300, 700], color: '#00FF9D' },
          { name: 'Reach 1+', data: [73.2, 78.5, 68.5, 70.8], color: '#B794F6', yAxis: 1 }
        ]
      }
    },
    '2026년 5월 주요 뷰티 행사가 있나요?': '웹 검색 결과, 2026년 5월 주요 뷰티 행사 정보입니다:\n\n📍 코스모프로프 아시아 (Cosmoprof Asia)\n• 일정: 2026년 5월 12-14일\n• 장소: 홍콩 컨벤션센터\n• 규모: 아시아 최대 뷰티 전시회\n\n📍 뷰티월드 재팬 (Beauty World Japan)\n• 일정: 2026년 5월 18-20일\n• 장소: 도쿄 빅사이트\n• 특징: 화장품, 네일, 에스테틱 종합 전시\n\n💡 캠페인 시사점:\n이 시기에 뷰티 업계 관심도가 높아지므로, 5월 중순 전후로 광고 집행을 강화하면 효과적일 수 있습니다.\n\n출처: 웹 검색 결과 종합',
    // ── 키워드 트리거 ──
    '일반': '현재 시나리오의 TVC:Digital 최적 비율은 50:50이며, 예상 Reach 1+는 73.2%입니다.\n\n총 예산 10억원 기준으로 TVC 5억원, Digital 5억원 배분을 권장합니다. 이 비율은 25-34세 여성 타겟의 미디어 소비 패턴과 과거 캠페인 데이터를 기반으로 최적화되었습니다.',
    'RAG': 'Effective Impression(유효 노출)은 광고가 실제로 효과적으로 전달된 노출 수를 의미합니다. [1]\n\n일반 Impression과의 차이:\n\n• 일반 Impression: 광고가 화면에 표시된 모든 횟수\n• Effective Impression: 사용자가 실제로 인지할 수 있는 조건에서 노출된 횟수 [2]\n\nDigital 채널의 Viewability 기준: 광고 면적 50% 이상이 1초 이상 뷰포트에 노출 [3]\nTVC: Nielsen 패널 기반 프로그램 시청률 × 광고 시간대 잔존율로 추정 [4]',
    '웹서치': '웹 검색 결과, 2026년 상반기 주요 광고 트렌드입니다:\n\n📍 숏폼 콘텐츠 광고 성장\n• TikTok, Instagram Reels 중심 광고비 전년 대비 +35%\n• 15초 이하 영상 광고 CTR 평균 3.2%\n\n📍 AI 기반 타겟팅 고도화\n• 퍼포먼스 캠페인에서 AI 최적화 도입률 68%\n• CPA 평균 22% 개선\n\n💡 시사점:\n현재 시나리오의 Digital 비중(50%)은 이러한 트렌드에 부합하며, 특히 숏폼 광고 상품 비중 확대를 고려해볼 수 있습니다.\n\n출처: 웹 검색 결과 종합',
    '시각화': {
      type: 'chart',
      data: {
        title: '매체별 예산 배분 및 도달률 비교',
        description: '다양한 예산 배분 시나리오에 따른 TVC/Digital 예산과 예상 도달률을 비교한 차트입니다.',
        categories: ['현재 최적', '예산 +20%', 'TVC 중심', 'Digital 중심'],
        series: [
          { name: 'TVC 예산', data: [500, 600, 700, 300], color: '#1a1a1a' },
          { name: 'Digital 예산', data: [500, 600, 300, 700], color: '#00FF9D' },
          { name: 'Reach 1+', data: [73.2, 78.5, 68.5, 70.8], color: '#B794F6', yAxis: 1 }
        ]
      }
    },
    '실패': { type: 'error', message: '답변 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
    '스트리밍': '이 답변은 스트리밍 효과를 확인하기 위한 긴 텍스트입니다.\n\n현재 시나리오 분석 결과를 종합하면 다음과 같습니다:\n\n1. 매체 비중 최적화\nTVC 50%, Digital 50% 비율이 비용 대비 도달률 효율성이 가장 높은 지점입니다. TVC는 브랜드 인지도 확보에, Digital은 타겟 정밀 도달에 각각 강점을 보입니다.\n\n2. 타겟 분석\n25-34세 여성 타겟은 TV와 디지털을 균형있게 소비하는 특성이 있어, 현재 매체 비중이 이 타겟의 미디어 소비 패턴에 최적화되어 있습니다.\n\n3. 예산 효율성\n현재 10억원 예산 기준 Efficiency Peak는 약 8.5억원 지점이며, 추가 1.5억원의 한계 도달률 기여는 +2.1%p입니다.\n\n4. 경쟁사 대비\n동일 업종 평균 대비 도달률 +7.8%p, CPM -13.4% 수준으로 효율적인 매체 배분을 보이고 있습니다.\n\n5. 개선 제안\nDigital 예산 중 리타겟팅 비중을 15%에서 25%로 확대하면 Reach 3+ 기준 약 +4.2%p 개선이 예상됩니다.'
  }

  // 역질문 트리거 매핑 — 특정 질문에 대해 역질문으로 응답
  const clarifyingQuestions: Record<string, { question: string; options: string[]; allowCustom?: boolean; selectionMode?: 'single' | 'multiple' }> = {
    '이 예측 결과를 어떻게 해석해야 하나요?': {
      question: '어떤 관점에서 분석해드릴까요?',
      options: ['매체별 효율 비교', '타겟 도달률 중심', '예산 최적화 방향', '경쟁사 벤치마크 대비'],
      allowCustom: true,
      selectionMode: 'single'
    },
    '이 데이터를 차트로 시각화해주세요': {
      question: '어떤 지표를 포함할까요? (복수 선택 가능)',
      options: ['Reach 1+', 'CPRP', 'GRPs', 'Avg. Frequency', '매체별 예산 배분'],
      selectionMode: 'multiple'
    },
    // ── 키워드 트리거 ──
    '역질문': {
      question: '어떤 관점에서 분석해드릴까요?',
      options: ['매체별 효율 비교', '타겟 도달률 중심', '예산 최적화 방향', '경쟁사 벤치마크 대비'],
      allowCustom: true,
      selectionMode: 'single'
    },
    '역질문N': {
      question: '어떤 지표를 포함할까요? (복수 선택 가능)',
      options: ['Reach 1+', 'CPRP', 'GRPs', 'Avg. Frequency', '매체별 예산 배분'],
      selectionMode: 'multiple'
    }
  }

  // 역질문 선택 후 최종 답변 매핑
  const clarifyingAnswers: Record<string, string> = {
    '매체별 효율 비교': '매체별 효율 관점에서 분석한 결과입니다.\n\n현재 TVC 50% : Digital 50% 비율에서:\n\n• TVC의 CPM은 ₩12,500으로, Digital 대비 약 1.8배 높지만 도달 범위가 넓어 브랜드 인지도 확보에 유리합니다.\n• Digital은 CPM ₩6,900으로 비용 효율이 높고, 특히 25-34세 타겟에서 TVC 대비 1.4배 높은 도달률을 보입니다.\n\n결론적으로 현재 50:50 비율이 두 매체의 장점을 균형있게 활용하는 최적 지점입니다.',
    '타겟 도달률 중심': '타겟 도달률 관점에서 분석한 결과입니다.\n\n25-34세 여성 타겟 기준:\n\n• 예상 Reach 1+: 73.2% (약 340만 명 도달)\n• Reach 3+: 45.8% (3회 이상 반복 노출)\n• Effective Frequency 도달률: 52.1%\n\n이 타겟은 TV와 디지털을 균형있게 소비하는 특성이 있어, 현재 매체 비중이 도달률 극대화에 적합합니다.',
    '예산 최적화 방향': '예산 최적화 관점에서 분석한 결과입니다.\n\n현재 10억 예산 기준:\n\n• Efficiency Peak: 약 8.5억 (이 지점까지 도달률 증가폭이 가장 큼)\n• 현재 예산(10억)은 Peak 대비 +1.5억 초과 상태\n• 추가 1.5억의 한계 도달률 기여: +2.1%p\n\n💡 추천: 1.5억을 Digital 리타겟팅에 재배분하면 Reach 3+ 기준 약 +4.2%p 개선이 가능합니다.',
    '경쟁사 벤치마크 대비': '경쟁사 벤치마크 대비 분석 결과입니다.\n\n동일 업종(뷰티) 평균 대비:\n\n• 도달률: 73.2% vs 업종 평균 65.4% (+7.8%p 우위)\n• CPM: ₩9,700 vs 업종 평균 ₩11,200 (13.4% 효율적)\n• 매체 비중: TVC 50% vs 업종 평균 TVC 62% (Digital 비중 높음)\n\n현재 시나리오는 업종 평균 대비 효율적인 매체 배분을 보이고 있습니다.',
    '건너뛰기': '알겠습니다. 그럼 전체적인 관점에서 분석해드릴게요.\n\n현재 분석 결과는 TVC 50%, Digital 50% 비율이 최적임을 보여줍니다.\n\n• 예상 Reach 1+: 73.2%\n• 비용 대비 효율성이 가장 높은 지점\n• 25-34세 여성 타겟의 미디어 소비 패턴에 최적화\n\n더 구체적인 관점이 필요하시면 언제든 질문해주세요.'
  }

  // 각주 [1], [2] 등을 인라인 뱃지로 변환 — 클릭 시 아코디언 열고 해당 문서 하이라이트
  const renderWithFootnotes = (text: string, msgIndex: number, _ragSources?: Array<{ title: string, summary: string, type: 'pdf' | 'docx' | 'url', url?: string }>) => {
    const parts = text.split(/(\[\d+\])/)
    return parts.map((part, i) => {
      const match = part.match(/^\[(\d+)\]$/)
      if (match) {
        const footnoteNum = parseInt(match[1])
        const isActive = activeFootnote?.msgIndex === msgIndex && activeFootnote?.footnoteNum === footnoteNum
        return (
          <span
            key={i}
            onClick={(e) => {
              e.stopPropagation()
              if (isActive) {
                setActiveFootnote(null)
              } else {
                setActiveFootnote({ msgIndex, footnoteNum })
                // 아코디언 자동 열기
                setExpandedRagSources(prev => {
                  const newSet = new Set(prev)
                  newSet.add(msgIndex)
                  return newSet
                })
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              backgroundColor: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground) / 0.2)',
              color: isActive ? 'hsl(var(--background))' : 'hsl(var(--foreground))',
              fontSize: '9px',
              fontWeight: '700',
              marginLeft: '2px',
              marginRight: '1px',
              verticalAlign: 'super',
              lineHeight: 1,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {match[1]}
          </span>
        )
      }
      return part
    })
  }

  const handleSend = (questionText?: string) => {
    const textToSend = questionText || message.trim()
    if (textToSend && !isLoading) {
      // 사용자 메시지 추가
      const userMessage = {
        role: 'user' as const,
        content: textToSend,
        timestamp: '방금 전'
      }
      
      setMessages(prev => [...prev, userMessage])
      setMessage('')
      setAttachedFile(null) // 첨부파일 초기화
      setAttachedUrl('') // 첨부 URL 초기화
      setCurrentQuestion(textToSend) // 현재 질문 저장
      setIsLoading(true)
      
      // 로딩 메시지 순차 변경
      const loadingMessages = [
        '질문을 분석하고 있어요...',
        '관련 데이터를 찾고 있어요...',
        '답변을 생성하고 있어요...'
      ]
      let messageIndex = 0
      setLoadingMessage(loadingMessages[0])
      
      loadingMessageIntervalRef.current = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length
        setLoadingMessage(loadingMessages[messageIndex])
      }, 800) // 0.8초마다 메시지 변경
      
      // AI 답변 생성 (예시) - 3초 딜레이
      timeoutRef.current = setTimeout(() => {
        // 로딩 메시지 인터벌 정리
        if (loadingMessageIntervalRef.current) {
          clearInterval(loadingMessageIntervalRef.current)
          loadingMessageIntervalRef.current = null
        }
        
        // 역질문 트리거 체크
        const clarifying = clarifyingQuestions[textToSend]
        if (clarifying) {
          // 역질문 메시지를 AI 응답으로 추가
          const aiResponse = {
            role: 'assistant' as const,
            content: clarifying.question,
            timestamp: '방금 전',
            originalQuestion: textToSend
          }
          setMessages(prev => [...prev, aiResponse])
          setIsLoading(false)
          setCurrentQuestion('')
          timeoutRef.current = null
          // 역질문 UI 활성화
          setClarifyingQuestion(clarifying)
          setClarifyingSelected(null)
          setClarifyingMultiSelected([])
          setClarifyingCustom('')
          setClarifyingCustomMode(false)
          return
        }

        // 역질문 선택에 대한 최종 답변 체크
        const clarifyingAnswer = clarifyingAnswers[textToSend]
        
        const answer = clarifyingAnswer || answerExamples[textToSend]
        
        // 웹 검색 질문인 경우 소스 추가
        const webSources = (textToSend === '2026년 5월 주요 뷰티 행사가 있나요?' || textToSend === '웹서치') ? [
          { title: '2026 코스모프로프 아시아 공식 사이트', url: 'https://www.cosmoprof-asia.com' },
          { title: 'Beauty World Japan 2026 전시 정보', url: 'https://www.beautyworldjapan.com' },
          { title: '글로벌 뷰티 전시회 일정 - BeautyExpo', url: 'https://www.beautyexpo.com/calendar' },
          { title: '2026 아시아 뷰티 트렌드 리포트', url: 'https://www.beautytrends.asia/2026' }
        ] : undefined
        
        // RAG 검색 질문인 경우 내부 문서 소스 추가
        const ragSources = (textToSend === 'Effective Impression이 무엇인가요?' || textToSend === 'RAG') ? [
          { title: 'ReadySet_지표_정의서_v2.1.pdf', type: 'pdf' as const, summary: 'Effective Impression의 정의와 일반 Impression과의 차이를 설명. 유효 노출은 사용자가 실제 인지 가능한 조건에서 발생한 노출만을 집계한다.' },
          { title: 'Digital_광고_측정_가이드라인.pdf', type: 'pdf' as const, summary: 'Digital 채널의 Viewability 기준을 정의. 광고 면적 50% 이상이 1초 이상 뷰포트에 노출되어야 유효 노출로 인정한다.' },
          { title: 'TVC_효과_측정_방법론.docx', type: 'docx' as const, summary: 'Nielsen 패널 데이터 기반 TVC 광고 노출 추정 방법. 프로그램 시청률과 광고 시간대 잔존율을 곱하여 유효 노출을 산출한다.' },
          { title: 'IAB Viewability 측정 표준 가이드', type: 'url' as const, url: 'https://www.iab.com/guidelines/viewability', summary: 'IAB에서 정의한 글로벌 Viewability 측정 표준. Effective Impression 산출의 국제 기준을 제시한다.' }
        ] : undefined
        
        const aiResponse = {
          role: 'assistant' as const,
          content: answer || '죄송합니다. 해당 질문에 대한 답변을 준비 중입니다. 다른 질문을 선택해주세요.',
          timestamp: '방금 전',
          originalQuestion: textToSend,
          webSources,
          ragSources
        }
        
        setMessages(prev => [...prev, aiResponse])
        setIsLoading(false)
        setCurrentQuestion('')
        timeoutRef.current = null
      }, 3000)
    }
  }

  const handleRetry = (originalQuestion: string) => {
    if (!isLoading) {
      const currentRetryCount = retryCount.get(originalQuestion) || 0
      
      if (currentRetryCount >= 1) {
        // 이미 1번 재시도했으면 더 이상 재시도 불가
        return
      }
      
      // 재시도 횟수 증가
      setRetryCount(prev => {
        const newMap = new Map(prev)
        newMap.set(originalQuestion, currentRetryCount + 1)
        return newMap
      })
      
      handleSend(originalQuestion)
    }
  }

  const handleStop = () => {
    // setTimeout 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    // 로딩 메시지 인터벌 정리
    if (loadingMessageIntervalRef.current) {
      clearInterval(loadingMessageIntervalRef.current)
      loadingMessageIntervalRef.current = null
    }

    // 스트리밍 정리
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current)
      streamingIntervalRef.current = null
    }
    setStreamingIndex(null)
    setStreamingDisplayText('')
    
    setIsLoading(false)
    
    // 중단 메시지 추가
    const stopMessage = {
      role: 'assistant' as const,
      content: {
        type: 'error' as const,
        message: '답변 생성이 중단되었습니다.'
      },
      timestamp: '방금 전',
      originalQuestion: currentQuestion
    }
    
    setMessages(prev => [...prev, stopMessage])
    setCurrentQuestion('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuestionClick = (question: string) => {
    if (!isLoading) {
      setMessage(question)
      // 자동으로 전송
      setTimeout(() => handleSend(question), 100)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setAttachedFile(file)
      setAttachMenuOpen(false)
    }
  }

  const handleAttachClick = () => {
    setAttachMenuOpen(!attachMenuOpen)
  }

  const handleImageAdd = () => {
    fileInputRef.current?.click()
    setAttachMenuOpen(false)
  }

  const handlePdfAdd = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'application/pdf'
      fileInputRef.current.click()
    }
    setAttachMenuOpen(false)
  }

  const removeAttachment = () => {
    setAttachedFile(null)
    setAttachedUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUrlAdd = () => {
    setShowUrlDialog(true)
    setAttachMenuOpen(false)
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setAttachedUrl(urlInput.trim())
      setUrlInput('')
      setShowUrlDialog(false)
    }
  }

  const handleUrlCancel = () => {
    setUrlInput('')
    setShowUrlDialog(false)
  }

  const handleReset = () => {
    setShowResetDialog(true)
  }

  const confirmReset = () => {
    setMessages([])
    setMessage('')
    setAttachedFile(null)
    setAttachedUrl('')
    setShowResetDialog(false)
    // 스트리밍 정리
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current)
      streamingIntervalRef.current = null
    }
    setStreamingIndex(null)
    setStreamingDisplayText('')
    setClarifyingQuestion(null)
    setClarifyingSelected(null)
    setClarifyingCustom('')
    setClarifyingCustomMode(false)
  }

  // 역질문 선택 전송
  const handleClarifyingSubmit = () => {
    if (clarifyingCustomMode && clarifyingCustom.trim()) {
      handleSend(clarifyingCustom.trim())
      setClarifyingQuestion(null)
      setClarifyingSelected(null)
      setClarifyingMultiSelected([])
      setClarifyingCustom('')
      setClarifyingCustomMode(false)
    } else if (clarifyingQuestion?.selectionMode === 'multiple' && clarifyingMultiSelected.length > 0) {
      const selectedOptions = clarifyingMultiSelected.map(i => clarifyingQuestion.options[i])
      handleSend(selectedOptions.join(', '))
      setClarifyingQuestion(null)
      setClarifyingSelected(null)
      setClarifyingMultiSelected([])
      setClarifyingCustom('')
      setClarifyingCustomMode(false)
    } else if (clarifyingSelected !== null && clarifyingQuestion) {
      const selectedOption = clarifyingQuestion.options[clarifyingSelected]
      handleSend(selectedOption)
      setClarifyingQuestion(null)
      setClarifyingSelected(null)
      setClarifyingMultiSelected([])
      setClarifyingCustom('')
      setClarifyingCustomMode(false)
    }
  }

  // 역질문 건너뛰기
  const handleClarifyingSkip = () => {
    setClarifyingQuestion(null)
    setClarifyingSelected(null)
    setClarifyingCustom('')
    setClarifyingCustomMode(false)
    // "건너뛰기"를 사용자 메시지로 전송 → AI 기본 답변
    handleSend('건너뛰기')
  }

  const handleModelSelect = (model: LLMModel) => {
    // 선택한 모델이 현재 모델과 같으면 무시
    if (model.name === selectedModel.name) {
      setModelMenuOpen(false)
      return
    }
    
    setSelectedModel(model)
    setModelMenuOpen(false)
    
    // 대화 스레드에 모델 변경 알림 삽입
    setMessages(prev => [...prev, {
      role: 'assistant' as const,
      content: `${model.displayName}(으)로 변경`,
      timestamp: '방금 전',
      isModelChange: true
    }])
  }

  const handleCopy = () => {
    const text = `${scenarioName}

요약

"25-34세 여성 타겟 집중 공략" 시나리오를 분석했습니다.

최적 매체 비중은 TVC 50%, Digital 50%로 나타났으며, 이 비율로 집행 시 예상 Reach 1+는 73.2%입니다. 총 예산 10억원을 TVC 5억원, Digital 5억원으로 배분하는 것을 권장합니다.

이 비율은 타겟 오디언스의 미디어 소비 패턴과 과거 캠페인 데이터를 기반으로 최적화되었습니다.`
    
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyMessage = (content: string | { type: 'chart', data: any } | { type: 'error', message: string }, index: number) => {
    let textToCopy = ''
    if (typeof content === 'string') {
      textToCopy = content
    } else if (content.type === 'chart') {
      textToCopy = `${content.data.title}\n\n${content.data.description}`
    } else if (content.type === 'error') {
      textToCopy = content.message
    }
    
    navigator.clipboard.writeText(textToCopy)
    setCopiedMessageIndex(index)
    setTimeout(() => setCopiedMessageIndex(null), 2000)
  }

  return (
    <div
      style={{
        position: positioning,
        top: 0,
        right: isOpen ? 0 : '-400px',
        width: '400px',
        height: positioning === 'fixed' ? '100vh' : '100%',
        backgroundColor: isDarkMode ? 'hsl(var(--card))' : 'hsl(var(--card))',
        borderLeft: '1px solid hsl(var(--border))',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        transition: 'right 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        overflow: 'hidden',
        maxHeight: positioning === 'fixed' ? '100vh' : '100%'
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid hsl(var(--border))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        {/* 좌측: 타이틀 */}
        <div>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 2px 0',
              fontFamily: 'Paperlogy, sans-serif',
              color: 'hsl(var(--foreground))'
            }}
          >
            SpinX for Reach Caster
          </h3>
          <p
            style={{
              fontSize: '11px',
              margin: 0,
              color: 'hsl(var(--muted-foreground))'
            }}
          >
            AnXer Spin-off AI Agent
          </p>
        </div>

        {/* 우측: 초기화 + 닫기 버튼 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={handleReset}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px' }}
            title="대화 초기화"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* 메시지 영역 - 아래에서부터 쌓기 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px 32px 24px 24px',
          backgroundColor: isDarkMode ? 'hsl(var(--background))' : 'hsl(var(--background))',
          minHeight: 0
        }}
      >
        <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {/* NotebookLM 스타일 초기 분석 - 최신 메시지 (입력창 바로 위) */}
        <div style={{ marginTop: '24px' }}>
          {/* 분석 모듈 칩 + 시나리오명 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: 'hsl(var(--foreground))',
                color: 'hsl(var(--background))',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0
              }}
            >
              {analysisType === 'ratioFinder' ? (
                <>
                  <Scale size={14} />
                  Ratio Finder
                </>
              ) : (
                <>
                  <Target size={14} />
                  Reach Predictor
                </>
              )}
            </span>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
                color: 'hsl(var(--foreground))',
                fontFamily: 'Paperlogy, sans-serif',
                lineHeight: '1.4',
                flex: 1,
                minWidth: 0
              }}
            >
              {scenarioName}
            </h4>
          </div>

          {/* 요약 섹션 */}
          <div
            style={{
              backgroundColor: isDarkMode ? 'hsl(var(--muted))' : 'hsl(var(--muted))',
              padding: '20px',
              borderRadius: '12px',
              position: 'relative',
              marginBottom: '16px'
            }}
          >
            {/* 복사 버튼 */}
            <button
              onClick={handleCopy}
              className="btn btn-ghost btn-sm"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '6px'
              }}
              title="복사"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>

            {/* 요약 타이틀 */}
            <h5
              style={{
                fontSize: '13px',
                fontWeight: '600',
                margin: '0 0 12px 0',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Paperlogy, sans-serif'
              }}
            >
              요약
            </h5>

            {/* 요약 내용 */}
            <p
              style={{
                fontSize: '13px',
                margin: 0,
                color: 'hsl(var(--foreground))',
                lineHeight: '1.7',
                paddingRight: '32px'
              }}
            >
              최적 매체 비중은 <strong>TVC 50%, Digital 50%</strong>로 나타났으며, 이 비율로 집행 시 예상 <strong>Reach 1+는 73.2%</strong>입니다. 총 예산 10억원을 TVC 5억원, Digital 5억원으로 배분하는 것을 권장합니다. 이 비율은 타겟 오디언스의 미디어 소비 패턴과 과거 캠페인 데이터를 기반으로 최적화되었습니다.
            </p>
          </div>

          {/* 추천 질문 섹션 */}
          <div style={{ marginBottom: '16px' }}>
            <h5
              style={{
                fontSize: '13px',
                fontWeight: '600',
                margin: '0 0 12px 0',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Paperlogy, sans-serif'
              }}
            >
              추천 질문
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'transparent',
                    color: 'hsl(var(--foreground))',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'Paperlogy, sans-serif',
                    lineHeight: '1.5'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
                    e.currentTarget.style.borderColor = 'hsl(var(--foreground))'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = 'hsl(var(--border))'
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <span
            style={{
              fontSize: '11px',
              color: 'hsl(var(--muted-foreground))',
              display: 'block'
            }}
          >
            방금 전
          </span>

          {/* 추가 대화 메시지들 */}
          {messages.map((msg, index) => (
            <div key={index} style={{ marginTop: '24px' }}>
              {msg.isModelChange ? (
                <div style={{
                  textAlign: 'center',
                  padding: '8px 0',
                  fontFamily: 'Paperlogy, sans-serif'
                }}>
                  <span style={{
                    fontSize: '11px',
                    color: 'hsl(var(--muted-foreground))',
                    backgroundColor: 'hsl(var(--muted) / 0.5)',
                    padding: '4px 12px',
                    borderRadius: '12px'
                  }}>
                    {typeof msg.content === 'string' ? msg.content : ''}
                  </span>
                </div>
              ) : msg.role === 'user' ? (
                <div style={{ textAlign: 'right', marginBottom: '8px' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'hsl(var(--primary))',
                      color: 'hsl(var(--primary-foreground))',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      maxWidth: '80%',
                      textAlign: 'left',
                      fontFamily: 'Paperlogy, sans-serif',
                      lineHeight: '1.6'
                    }}
                  >
                    {msg.content}
                  </div>
                  <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginTop: '4px' }}>
                    {msg.timestamp}
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '8px' }}>
                  {/* 웹 검색 소스 표시 (있는 경우) */}
                  {msg.webSources && msg.webSources.length > 0 && (
                    <div style={{
                      marginBottom: '12px',
                      fontFamily: 'Paperlogy, sans-serif'
                    }}>
                      {/* 헤더 - 클릭하여 접기/펼치기 */}
                      <button
                        onClick={() => {
                          setExpandedWebSources(prev => {
                            const newSet = new Set(prev)
                            if (newSet.has(index)) {
                              newSet.delete(index)
                            } else {
                              newSet.add(index)
                            }
                            return newSet
                          })
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'hsl(var(--muted-foreground))',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                      >
                        <Globe size={14} style={{ flexShrink: 0 }} />
                        <span style={{ flex: 1, textAlign: 'left' }}>
                          웹 검색 결과 {msg.webSources.length}개
                        </span>
                        <ChevronRight 
                          size={14} 
                          style={{ 
                            flexShrink: 0,
                            transform: expandedWebSources.has(index) ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }} 
                        />
                      </button>
                      
                      {/* 소스 목록 - 펼쳐진 경우에만 표시 */}
                      {expandedWebSources.has(index) && (
                        <div style={{
                          paddingLeft: '22px',
                          marginTop: '4px'
                        }}>
                          {msg.webSources.map((source, sourceIdx) => (
                            <a
                              key={sourceIdx}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                padding: '6px 0',
                                textDecoration: 'none',
                                color: 'hsl(var(--muted-foreground))',
                                transition: 'color 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                            >
                              {/* 파비콘 또는 기본 아이콘 */}
                              <div style={{
                                width: '14px',
                                height: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginTop: '2px',
                                opacity: 0.6
                              }}>
                                <Globe size={10} />
                              </div>
                              
                              {/* 제목과 URL */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: '11px',
                                  fontWeight: '400',
                                  marginBottom: '2px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {source.title}
                                </div>
                                <div style={{
                                  fontSize: '10px',
                                  opacity: 0.6,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {source.url}
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* RAG 내부 문서 참조 표시 (있는 경우) */}
                  {msg.ragSources && msg.ragSources.length > 0 && (
                    <div style={{
                      marginBottom: '12px',
                      fontFamily: 'Paperlogy, sans-serif'
                    }}>
                      <button
                        onClick={() => {
                          setExpandedRagSources(prev => {
                            const newSet = new Set(prev)
                            if (newSet.has(index)) {
                              newSet.delete(index)
                            } else {
                              newSet.add(index)
                            }
                            return newSet
                          })
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'hsl(var(--muted-foreground))',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}
                      >
                        <FileText size={14} style={{ flexShrink: 0 }} />
                        <span style={{ flex: 1, textAlign: 'left' }}>
                          내부 문서 참조 {msg.ragSources.length}건
                        </span>
                        <ChevronRight 
                          size={14} 
                          style={{ 
                            flexShrink: 0,
                            transform: expandedRagSources.has(index) ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }} 
                        />
                      </button>
                      
                      {expandedRagSources.has(index) && (
                        <div style={{
                          paddingLeft: '4px',
                          marginTop: '4px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}>
                          {msg.ragSources.map((source, sourceIdx) => {
                            const isHighlighted = activeFootnote?.msgIndex === index && activeFootnote?.footnoteNum === sourceIdx + 1
                            return (
                              <div key={sourceIdx}>
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveFootnote(isHighlighted ? null : { msgIndex: index, footnoteNum: sourceIdx + 1 })
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    backgroundColor: isHighlighted ? 'hsl(var(--muted))' : 'transparent',
                                    transition: 'background-color 0.15s'
                                  }}
                                >
                                  <span style={{
                                    fontSize: '9px',
                                    fontWeight: '600',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '4px',
                                    backgroundColor: 'hsl(var(--foreground))',
                                    color: 'hsl(var(--background))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}>
                                    {sourceIdx + 1}
                                  </span>
                                  {source.type === 'url' ? (
                                    <Globe size={12} style={{ flexShrink: 0, opacity: 0.5 }} />
                                  ) : (
                                    <FileText size={12} style={{ flexShrink: 0, opacity: 0.5 }} />
                                  )}
                                  <span style={{
                                    fontSize: '11px',
                                    fontWeight: isHighlighted ? '500' : '400',
                                    color: isHighlighted ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {source.title}
                                  </span>
                                </div>
                                {isHighlighted && (
                                  <div style={{
                                    padding: '4px 8px 8px 44px'
                                  }}>
                                    <div style={{
                                      fontSize: '11px',
                                      lineHeight: '1.5',
                                      color: 'hsl(var(--muted-foreground))',
                                      marginBottom: source.type === 'url' && source.url ? '4px' : '0'
                                    }}>
                                      {source.summary}
                                    </div>
                                    {source.type === 'url' && source.url && (
                                      <a
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          fontSize: '10px',
                                          color: 'hsl(var(--muted-foreground))',
                                          textDecoration: 'underline',
                                          opacity: 0.7
                                        }}
                                      >
                                        {source.url}
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {typeof msg.content === 'string' ? (
                    <div
                      style={{
                        backgroundColor: isDarkMode ? 'hsl(var(--muted))' : 'hsl(var(--muted))',
                        padding: '16px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontFamily: 'Paperlogy, sans-serif',
                        lineHeight: '1.7',
                        whiteSpace: 'pre-line',
                        position: 'relative'
                      }}
                    >
                      {/* 복사 버튼 — 스트리밍 완료 후에만 표시 */}
                      {streamingIndex !== index && (
                        <button
                          onClick={() => handleCopyMessage(msg.content, index)}
                          className="btn btn-ghost btn-sm"
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            padding: '6px'
                          }}
                          title="복사"
                        >
                          {copiedMessageIndex === index ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      )}
                      <div style={{ paddingRight: '32px' }}>
                        {streamingIndex === index
                          ? <>{renderWithFootnotes(streamingDisplayText, index, msg.ragSources)}<span style={{ display: 'inline-block', width: '2px', height: '14px', backgroundColor: 'hsl(var(--foreground))', marginLeft: '2px', verticalAlign: 'text-bottom', animation: 'spinx-cursor-blink 0.8s step-end infinite' }} /></>
                          : renderWithFootnotes(msg.content as string, index, msg.ragSources)
                        }
                      </div>
                    </div>
                  ) : msg.content.type === 'error' ? (
                    // 에러 렌더링
                    <div
                      style={{
                        backgroundColor: isDarkMode ? 'hsl(var(--muted))' : 'hsl(var(--muted))',
                        padding: '16px',
                        borderRadius: '12px',
                        fontFamily: 'Paperlogy, sans-serif',
                        position: 'relative'
                      }}
                    >
                      <div style={{ 
                        fontSize: '13px', 
                        color: 'hsl(var(--destructive))',
                        marginBottom: '16px',
                        lineHeight: '1.6',
                        paddingRight: '32px'
                      }}>
                        {msg.content.message}
                      </div>
                      {(() => {
                        const currentRetryCount = retryCount.get(msg.originalQuestion || '') || 0
                        const canRetry = currentRetryCount < 1
                        
                        return canRetry ? (
                          <button
                            onClick={() => handleRetry(msg.originalQuestion || '')}
                            disabled={isLoading}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '12px',
                              padding: '8px 14px',
                              borderRadius: '6px',
                              border: '1px solid hsl(var(--border))',
                              backgroundColor: 'transparent',
                              color: 'hsl(var(--foreground))',
                              fontFamily: 'Paperlogy, sans-serif',
                              cursor: isLoading ? 'not-allowed' : 'pointer',
                              opacity: isLoading ? 0.5 : 1,
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              if (!isLoading) {
                                e.currentTarget.style.backgroundColor = 'hsl(var(--accent))'
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <RefreshCw size={14} />
                            재시도
                          </button>
                        ) : (
                          <div style={{
                            fontSize: '11px',
                            color: 'hsl(var(--muted-foreground))',
                            fontFamily: 'Paperlogy, sans-serif',
                            marginTop: '8px'
                          }}>
                            재시도 횟수를 초과했습니다. 다른 질문을 시도해주세요.
                          </div>
                        )
                      })()}
                    </div>
                  ) : (
                    // 차트 렌더링
                    <div
                      style={{
                        backgroundColor: isDarkMode ? 'hsl(var(--muted))' : 'hsl(var(--muted))',
                        padding: '16px',
                        borderRadius: '12px',
                        fontFamily: 'Paperlogy, sans-serif',
                        position: 'relative'
                      }}
                    >
                      {/* 복사 버튼 */}
                      <button
                        onClick={() => handleCopyMessage(msg.content, index)}
                        className="btn btn-ghost btn-sm"
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          padding: '6px',
                          zIndex: 1
                        }}
                        title="복사"
                      >
                        {copiedMessageIndex === index ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                      <h6 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 8px 0', paddingRight: '32px' }}>
                        {msg.content.data.title}
                      </h6>
                      <p style={{ 
                        fontSize: '12px', 
                        color: 'hsl(var(--muted-foreground))',
                        margin: '0 0 16px 0',
                        lineHeight: '1.6'
                      }}>
                        {msg.content.data.description}
                      </p>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', 
                        gap: '12px',
                        marginBottom: '16px'
                      }}>
                        {msg.content.data.categories.map((cat: string, i: number) => (
                          <div key={i} style={{ textAlign: 'center' }}>
                            <div style={{ 
                              fontSize: '11px', 
                              color: 'hsl(var(--muted-foreground))',
                              marginBottom: '8px'
                            }}>
                              {cat}
                            </div>
                            <div style={{ 
                              height: '120px', 
                              display: 'flex', 
                              flexDirection: 'column',
                              justifyContent: 'flex-end',
                              gap: '4px'
                            }}>
                              {/* TVC 바 */}
                              <div style={{
                                height: `${(msg.content.data.series[0].data[i] / 10)}px`,
                                backgroundColor: isDarkMode ? '#f5f5f5' : '#1a1a1a',
                                borderRadius: '4px 4px 0 0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                color: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                                fontWeight: '600'
                              }}>
                                {msg.content.data.series[0].data[i]}M
                              </div>
                              {/* Digital 바 */}
                              <div style={{
                                height: `${(msg.content.data.series[1].data[i] / 10)}px`,
                                backgroundColor: '#00FF9D',
                                borderRadius: '0 0 4px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                color: '#000',
                                fontWeight: '600'
                              }}>
                                {msg.content.data.series[1].data[i]}M
                              </div>
                            </div>
                            {/* Reach 표시 */}
                            <div style={{
                              marginTop: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#B794F6'
                            }}>
                              {msg.content.data.series[2].data[i]}%
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* 범례 */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '16px', 
                        justifyContent: 'center',
                        fontSize: '11px',
                        paddingTop: '12px',
                        borderTop: '1px solid hsl(var(--border))'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ 
                            width: '12px', 
                            height: '12px', 
                            backgroundColor: isDarkMode ? '#f5f5f5' : '#1a1a1a',
                            borderRadius: '2px'
                          }} />
                          <span>TVC 예산</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ 
                            width: '12px', 
                            height: '12px', 
                            backgroundColor: '#00FF9D',
                            borderRadius: '2px'
                          }} />
                          <span>Digital 예산</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ 
                            width: '12px', 
                            height: '12px', 
                            backgroundColor: '#B794F6',
                            borderRadius: '50%'
                          }} />
                          <span>Reach 1+</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginTop: '4px' }}>
                    {msg.timestamp}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 로딩 스켈레톤 */}
          {isLoading && (
            <div style={{ marginTop: '24px' }}>
              <div
                style={{
                  backgroundColor: isDarkMode ? 'hsl(var(--muted))' : 'hsl(var(--muted))',
                  padding: '16px',
                  borderRadius: '12px',
                  fontFamily: 'Paperlogy, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    animation: 'rotate3d 2s linear infinite',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#00ff9d'
                  }}
                >
                  <Rotate3d size={20} />
                </div>
                <div style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                  {loadingMessage}
                </div>
              </div>
            </div>
          )}
          {/* 스크롤 타겟 */}
          <div ref={messagesEndRef} />
        </div>
        </div>
      </div>

      {/* 입력 영역 */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid hsl(var(--border))',
          backgroundColor: isDarkMode ? 'hsl(var(--card))' : 'hsl(var(--card))',
          flexShrink: 0
        }}
      >
        {/* 모델 표시 + 대화 유지 기간 — 역질문 활성 시 숨김 */}
        {!clarifyingQuestion && (
        <div
          style={{
            fontSize: '10px',
            color: 'hsl(var(--muted-foreground))',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setModelMenuOpen(!modelMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                fontSize: '10px',
                color: 'hsl(var(--muted-foreground))'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#00ff9d'
                }}
              />
              {selectedModel.displayName}
              <ChevronDown size={12} />
            </button>

            {/* 모델 선택 드롭다운 */}
            {modelMenuOpen && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                marginBottom: '8px',
                width: '200px',
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                zIndex: 1000,
                fontFamily: 'Paperlogy, sans-serif',
                overflow: 'hidden'
              }}>
                {availableModels.map((model, index) => (
                  <button
                    key={index}
                    onClick={() => handleModelSelect(model)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: 'none',
                      backgroundColor: selectedModel.name === model.name ? 'hsl(var(--muted))' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      transition: 'background-color 0.2s',
                      color: 'hsl(var(--foreground))'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedModel.name !== model.name) {
                        e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedModel.name !== model.name) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <span style={{ fontWeight: '500' }}>{model.displayName}</span>
                    <span style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>{model.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <div
                onMouseEnter={() => setSessionTooltipOpen(true)}
                onMouseLeave={() => setSessionTooltipOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'help' }}
              >
                <Clock size={12} />
                <span>{daysRemaining}일 {hoursRemaining}시간 {minutesRemaining}분</span>
              </div>
              
              {sessionTooltipOpen && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  right: 0,
                  marginBottom: '8px',
                  width: '200px',
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  zIndex: 1000,
                  fontFamily: 'Paperlogy, sans-serif',
                  fontSize: '12px'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>대화 세션</div>
                  <div className="text-muted-foreground" style={{ lineHeight: '1.5' }}>
                    이 대화를 이어나갈 수 있는 잔여 세션입니다. 시간 내 돌아오면 대화를 이어할 수 있습니다.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {/* 역질문 선택 UI 또는 일반 입력 */}
        {clarifyingQuestion ? (
          <div style={{ width: '100%' }}>
            {/* 역질문 헤더 */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'hsl(var(--foreground))', fontFamily: 'Paperlogy, sans-serif' }}>
                {clarifyingQuestion.question}
              </span>
              <button
                onClick={handleClarifyingSkip}
                style={{
                  fontSize: '11px', color: 'hsl(var(--muted-foreground))',
                  background: 'none', border: '1px solid hsl(var(--border))',
                  borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
                  fontFamily: 'Paperlogy, sans-serif', transition: 'all 0.2s', flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'hsl(var(--foreground))'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'hsl(var(--border))'}
              >
                건너뛰기
              </button>
            </div>
            {/* 옵션 리스트 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {clarifyingQuestion.options.map((option, idx) => {
                const isMultiple = clarifyingQuestion.selectionMode === 'multiple'
                const isSelected = isMultiple
                  ? clarifyingMultiSelected.includes(idx)
                  : clarifyingSelected === idx
                return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isMultiple) {
                      setClarifyingMultiSelected(prev =>
                        prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                      )
                      setClarifyingCustomMode(false)
                    } else {
                      setClarifyingSelected(idx)
                      setClarifyingCustomMode(false)
                    }
                  }}
                  onDoubleClick={() => {
                    if (!isMultiple) {
                      setClarifyingSelected(idx)
                      setClarifyingCustomMode(false)
                      setTimeout(() => handleClarifyingSubmit(), 50)
                    }
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 12px', borderRadius: '6px',
                    border: isSelected ? '1px solid hsl(var(--foreground))' : '1px solid hsl(var(--border))',
                    backgroundColor: isSelected ? 'hsl(var(--muted))' : 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    fontFamily: 'Paperlogy, sans-serif', width: '100%', outline: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {isMultiple ? (
                    <span style={{
                      width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: isSelected ? 'none' : '1.5px solid hsl(var(--border))',
                      backgroundColor: isSelected ? 'hsl(var(--foreground))' : 'transparent',
                      color: isSelected ? 'hsl(var(--background))' : 'transparent',
                      fontSize: '11px', fontWeight: '700', transition: 'all 0.15s'
                    }}>
                      {isSelected ? '✓' : ''}
                    </span>
                  ) : (
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: '700',
                      backgroundColor: isSelected ? 'hsl(var(--foreground))' : 'hsl(var(--muted))',
                      color: isSelected ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))'
                    }}>
                      {idx + 1}
                    </span>
                  )}
                  <span style={{ fontSize: '13px', color: 'hsl(var(--foreground))' }}>{option}</span>
                  {!isMultiple && isSelected && (
                    <ArrowUp size={14} style={{ marginLeft: 'auto', color: 'hsl(var(--foreground))', flexShrink: 0 }} />
                  )}
                </button>
                )
              })}
              {/* 기타 직접 입력 */}
              {clarifyingQuestion.allowCustom && (
                <div
                  onClick={() => { setClarifyingCustomMode(true); setClarifyingSelected(null) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 12px', borderRadius: '6px',
                    border: clarifyingCustomMode ? '1px solid hsl(var(--foreground))' : '1px solid hsl(var(--border))',
                    backgroundColor: clarifyingCustomMode ? 'hsl(var(--muted))' : 'transparent',
                    cursor: 'pointer', transition: 'all 0.15s', width: '100%',
                    overflow: 'hidden', minWidth: 0, boxSizing: 'border-box'
                  }}
                >
                  <span style={{
                    width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px',
                    backgroundColor: clarifyingCustomMode ? 'hsl(var(--foreground))' : 'hsl(var(--muted))',
                    color: clarifyingCustomMode ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))'
                  }}>
                    ✎
                  </span>
                  {clarifyingCustomMode ? (
                    <input
                      autoFocus
                      value={clarifyingCustom}
                      onChange={(e) => setClarifyingCustom(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && clarifyingCustom.trim()) handleClarifyingSubmit() }}
                      placeholder="직접 입력..."
                      style={{
                        flex: 1, border: 'none', background: 'none', outline: 'none',
                        fontSize: '13px', color: 'hsl(var(--foreground))',
                        fontFamily: 'Paperlogy, sans-serif', padding: 0,
                        width: '100%', minWidth: 0
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>기타</span>
                  )}
                </div>
              )}
            </div>
            {/* 전송 버튼 */}
            {(clarifyingSelected !== null || clarifyingMultiSelected.length > 0 || (clarifyingCustomMode && clarifyingCustom.trim())) && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                {clarifyingQuestion.selectionMode === 'multiple' && clarifyingMultiSelected.length > 0 && (
                  <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', fontFamily: 'Paperlogy, sans-serif' }}>
                    {clarifyingMultiSelected.length}개 선택
                  </span>
                )}
                <button
                  onClick={handleClarifyingSubmit}
                  style={{
                    padding: '6px 16px', borderRadius: '6px', border: 'none',
                    backgroundColor: 'hsl(var(--foreground))', color: 'hsl(var(--background))',
                    fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                    fontFamily: 'Paperlogy, sans-serif', transition: 'opacity 0.2s'
                  }}
                >
                  선택 전송
                </button>
              </div>
            )}
          </div>
        ) : (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-end',
            width: '100%'
          }}
        >
          {/* 입력창 */}
          <div style={{ flex: 1, position: 'relative', minWidth: 0, maxWidth: '100%' }}>
            {/* 첨부 파일/URL 칩 */}
            {(attachedFile || attachedUrl) && (
              <div style={{
                marginBottom: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                backgroundColor: 'hsl(var(--muted))',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'Paperlogy, sans-serif',
                maxWidth: '100%'
              }}>
                {attachedFile ? (
                  <>
                    {attachedFile.type === 'application/pdf' ? (
                      <FileText size={14} style={{ flexShrink: 0 }} />
                    ) : (
                      <ImageIcon size={14} style={{ flexShrink: 0 }} />
                    )}
                    <span style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      minWidth: 0
                    }}>
                      {attachedFile.name}
                    </span>
                  </>
                ) : (
                  <>
                    <Globe size={14} style={{ flexShrink: 0 }} />
                    <span style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      minWidth: 0
                    }}>
                      {attachedUrl}
                    </span>
                  </>
                )}
                <button
                  onClick={removeAttachment}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'hsl(var(--muted-foreground))',
                    flexShrink: 0
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="SpinX에게 무엇이든 물어보세요!"
              style={{
                width: '100%',
                minHeight: '44px',
                maxHeight: '120px',
                padding: '12px 60px 12px 16px',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                backgroundColor: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                fontSize: '14px',
                fontFamily: 'Paperlogy, sans-serif',
                resize: 'none',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'hsl(var(--ring))'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'hsl(var(--border))'
              }}
            />

            {/* 숨겨진 파일 입력 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {/* 입력창 내부 버튼들 */}
            <div
              style={{
                position: 'absolute',
                right: '8px',
                bottom: '8px',
                display: 'flex',
                gap: '4px'
              }}
            >
              {/* 첨부 버튼 - ChatGPT 모델일 때는 숨김 */}
              {selectedModel !== 'ChatGPT 4o' && (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={handleAttachClick}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '6px' }}
                    title="파일 첨부"
                    disabled={attachedFile !== null || attachedUrl !== ''}
                  >
                    <Paperclip size={16} />
                  </button>
                  
                  {attachMenuOpen && (
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      right: 0,
                      marginBottom: '8px',
                      width: '140px',
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                      zIndex: 1000,
                      fontFamily: 'Paperlogy, sans-serif',
                      overflow: 'hidden'
                    }}>
                      <button
                        onClick={handleImageAdd}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'background-color 0.2s',
                          color: 'hsl(var(--foreground))'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <ImageIcon size={16} />
                        <span>이미지 추가</span>
                      </button>
                      <button
                        onClick={handlePdfAdd}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'background-color 0.2s',
                          color: 'hsl(var(--foreground))'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FileText size={16} />
                        <span>PDF 추가</span>
                      </button>
                      <button
                        onClick={handleUrlAdd}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'background-color 0.2s',
                          color: 'hsl(var(--foreground))'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Globe size={16} />
                        <span>URL 추가</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 전송 버튼 또는 정지 버튼 */}
              {isLoading ? (
                <button
                  onClick={handleStop}
                  className="btn btn-ghost btn-sm"
                  style={{
                    padding: '6px',
                    color: 'hsl(var(--destructive))'
                  }}
                  title="중단"
                >
                  <Square size={16} fill="currentColor" />
                </button>
              ) : (
                <button
                  onClick={() => handleSend()}
                  disabled={!message.trim() || isLoading}
                  style={{
                    padding: '6px',
                    opacity: message.trim() && !isLoading ? 1 : 0.5,
                    cursor: message.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    backgroundColor: message.trim() && !isLoading ? 'hsl(var(--foreground))' : 'hsl(var(--muted))',
                    color: message.trim() && !isLoading ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
                    border: 'none',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  title="전송 (Enter)"
                >
                  <ArrowUp size={16} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>
        )}

        {/* AI 면책 문구 */}
        <div style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'hsl(var(--muted-foreground))',
          opacity: 0.6,
          marginTop: '8px',
          fontFamily: 'Paperlogy, sans-serif',
          lineHeight: '1.4'
        }}>
          AI의 답변은 부정확할 수 있습니다. 중요한 정보는 반드시 확인하세요.
        </div>
      </div>

      {/* 초기화 확인 다이얼로그 */}
      {showResetDialog && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}
          onClick={() => setShowResetDialog(false)}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? 'hsl(var(--card))' : 'hsl(var(--card))',
              borderRadius: '12px',
              padding: '24px',
              width: '320px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 12px 0',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Paperlogy, sans-serif'
              }}
            >
              대화 초기화
            </h3>
            <p
              style={{
                fontSize: '13px',
                margin: '0 0 24px 0',
                color: 'hsl(var(--muted-foreground))',
                lineHeight: '1.6'
              }}
            >
              대화를 초기화하시겠습니까?<br />
              모든 대화 내용이 삭제됩니다.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowResetDialog(false)}
                className="btn btn-ghost"
                style={{ padding: '8px 16px' }}
              >
                취소
              </button>
              <button
                onClick={confirmReset}
                className="btn btn-primary"
                style={{ padding: '8px 16px' }}
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL 입력 다이얼로그 */}
      {showUrlDialog && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}
          onClick={handleUrlCancel}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? 'hsl(var(--card))' : 'hsl(var(--card))',
              borderRadius: '12px',
              padding: '24px',
              width: '340px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 4px 0',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Paperlogy, sans-serif'
              }}
            >
              URL 추가
            </h3>
            <p
              style={{
                fontSize: '12px',
                margin: '0 0 16px 0',
                color: 'hsl(var(--muted-foreground))',
                lineHeight: '1.5'
              }}
            >
              분석하고 싶은 웹페이지 URL을 입력하세요
            </p>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUrlSubmit()
                }
              }}
              placeholder="https://example.com"
              autoFocus
              className="input"
              style={{
                width: '100%',
                marginBottom: '20px',
                fontSize: '13px',
                fontFamily: 'Paperlogy, sans-serif'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleUrlCancel}
                className="btn btn-secondary btn-md"
              >
                취소
              </button>
              <button
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="btn btn-primary btn-md"
                style={{
                  opacity: urlInput.trim() ? 1 : 0.5,
                  cursor: urlInput.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
