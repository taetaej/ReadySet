// useSpinXChat.ts — 커스텀 훅 (메시지 상태, 전송/재시도/중단, 스트리밍, 역질문, 모델 선택 등 모든 로직)

import { useState, useRef, useEffect } from 'react'
import type { LLMModel, Message, ClarifyingQuestion } from './spinxTypes'
import { availableModels, answerExamples, clarifyingQuestions, clarifyingAnswers } from './spinxData'

type TimerId = ReturnType<typeof setTimeout>

const formatTimestamp = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}`
}

export function useSpinXChat() {
  const [message, setMessage] = useState('')
  const [monthlyChatCount, setMonthlyChatCount] = useState(23)
  const [monthlyChatLimit] = useState(100)
  const [copied, setCopied] = useState(false)
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [sessionTooltipOpen, setSessionTooltipOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [attachMenuOpen, setAttachMenuOpen] = useState(false)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [attachedUrl, setAttachedUrl] = useState<string>('')
  const [showUrlDialog, setShowUrlDialog] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentQuestion, setCurrentQuestion] = useState<string>('')
  const timeoutRef = useRef<TimerId | null>(null)
  const [selectedModel, setSelectedModel] = useState<LLMModel>(availableModels[0]) // Claude Sonnet 4.6
  const [modelMenuOpen, setModelMenuOpen] = useState(false)
  const [expandedWebSources, setExpandedWebSources] = useState<Set<number>>(new Set())
  const [expandedRagSources, setExpandedRagSources] = useState<Set<number>>(new Set())
  const [activeFootnote, setActiveFootnote] = useState<{ msgIndex: number, footnoteNum: number } | null>(null)
  const [loadingMessage, setLoadingMessage] = useState('질문을 분석하고 있어요...')
  const loadingMessageIntervalRef = useRef<TimerId | null>(null)
  const [retryCount, setRetryCount] = useState<Map<string, number>>(new Map())

  // 역질문 (Clarifying Question) 상태
  const [clarifyingQuestion, setClarifyingQuestion] = useState<ClarifyingQuestion | null>(null)
  const [clarifyingSelected, setClarifyingSelected] = useState<number | null>(null)
  const [clarifyingMultiSelected, setClarifyingMultiSelected] = useState<number[]>([])
  const [clarifyingCustom, setClarifyingCustom] = useState('')
  const [clarifyingCustomMode, setClarifyingCustomMode] = useState(false)

  // 스트리밍 (타이핑) 효과 상태
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null)
  const [streamingDisplayText, setStreamingDisplayText] = useState('')
  const streamingIntervalRef = useRef<TimerId | null>(null)
  const streamingFullTextRef = useRef<string>('')

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
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current)
      streamingIntervalRef.current = null
    }

    streamingFullTextRef.current = fullText
    setStreamingIndex(msgIndex)
    setStreamingDisplayText('')

    const cursor = { lineIdx: 0, charIdx: 0 }
    const lines = fullText.split('\n')
    const CHAR_INTERVAL = 12

    streamingIntervalRef.current = setInterval(() => {
      if (cursor.lineIdx >= lines.length) {
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

  const isLimitReached = monthlyChatCount >= monthlyChatLimit
  const [sessionLimitReached, setSessionLimitReached] = useState(false)

  const handleSend = (questionText?: string) => {
    const textToSend = questionText || message.trim()

    // "100" 입력 시 한도 초과 데모 모드 활성화
    if (textToSend === '100') {
      setMonthlyChatCount(100)
      setMessage('')
      return
    }

    // "10" 입력 시 세션 질문 한도 도달 데모
    if (textToSend === '10') {
      setSessionLimitReached(true)
      setMessage('')
      return
    }

    if (textToSend && !isLoading && !isLimitReached) {
      setMonthlyChatCount(prev => Math.min(prev + 1, monthlyChatLimit))
      const userMessage: Message = {
        role: 'user',
        content: textToSend,
        timestamp: formatTimestamp()
      }

      setMessages(prev => [...prev, userMessage])
      setMessage('')
      setAttachedFile(null)
      setAttachedUrl('')
      setCurrentQuestion(textToSend)
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
      }, 800)

      // AI 답변 생성 (예시) - 3초 딜레이
      timeoutRef.current = setTimeout(() => {
        if (loadingMessageIntervalRef.current) {
          clearInterval(loadingMessageIntervalRef.current)
          loadingMessageIntervalRef.current = null
        }

        // 역질문 트리거 체크
        const clarifying = clarifyingQuestions[textToSend]
        if (clarifying) {
          const aiResponse: Message = {
            role: 'assistant',
            content: clarifying.question,
            timestamp: formatTimestamp(),
            originalQuestion: textToSend
          }
          setMessages(prev => [...prev, aiResponse])
          setIsLoading(false)
          setCurrentQuestion('')
          timeoutRef.current = null
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

        const aiResponse: Message = {
          role: 'assistant',
          content: answer || '죄송합니다. 해당 질문에 대한 답변을 준비 중입니다. 다른 질문을 선택해주세요.',
          timestamp: formatTimestamp(),
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
        return
      }

      setRetryCount(prev => {
        const newMap = new Map(prev)
        newMap.set(originalQuestion, currentRetryCount + 1)
        return newMap
      })

      handleSend(originalQuestion)
    }
  }

  const handleStop = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (loadingMessageIntervalRef.current) {
      clearInterval(loadingMessageIntervalRef.current)
      loadingMessageIntervalRef.current = null
    }

    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current)
      streamingIntervalRef.current = null
    }
    setStreamingIndex(null)
    setStreamingDisplayText('')

    setIsLoading(false)

    const stopMessage: Message = {
      role: 'assistant',
      content: {
        type: 'error',
        message: '답변 생성이 중단되었습니다.'
      },
      timestamp: formatTimestamp(),
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

  // [역질문 타이머] 25초 후 자동 건너뛰기 — 제거 시 이 블록과 프로그레스 바 UI, CSS 키프레임(spinx-clarify-timer) 함께 제거
  const clarifyingTimerRef = useRef<TimerId | null>(null)

  // 역질문 건너뛰기
  const handleClarifyingSkip = () => {
    if (clarifyingTimerRef.current) {
      clearTimeout(clarifyingTimerRef.current)
      clarifyingTimerRef.current = null
    }
    setClarifyingQuestion(null)
    setClarifyingSelected(null)
    setClarifyingCustom('')
    setClarifyingCustomMode(false)
    handleSend('건너뛰기')
  }

  // 역질문 선택 전송
  const handleClarifyingSubmit = () => {
    // [역질문 타이머] 전송 시 타이머 정리 — 제거 시 이 if 블록 삭제
    if (clarifyingTimerRef.current) {
      clearTimeout(clarifyingTimerRef.current)
      clarifyingTimerRef.current = null
    }
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

  useEffect(() => {
    if (clarifyingQuestion) {
      clarifyingTimerRef.current = setTimeout(() => {
        handleClarifyingSkip()
      }, 25000)
    } else {
      if (clarifyingTimerRef.current) {
        clearTimeout(clarifyingTimerRef.current)
        clarifyingTimerRef.current = null
      }
    }
    return () => {
      if (clarifyingTimerRef.current) {
        clearTimeout(clarifyingTimerRef.current)
        clarifyingTimerRef.current = null
      }
    }
  }, [clarifyingQuestion])
  // [/역질문 타이머]

  const handleModelSelect = (model: LLMModel) => {
    if (model.name === selectedModel.name) {
      setModelMenuOpen(false)
      return
    }

    setSelectedModel(model)
    setModelMenuOpen(false)

    setMessages(prev => [...prev, {
      role: 'assistant' as const,
      content: `${model.displayName}(으)로 변경`,
      timestamp: formatTimestamp(),
      isModelChange: true
    }])
  }

  const handleCopy = (scenarioName: string) => {
    const text = `${scenarioName}

요약

"25-34세 여성 타겟 집중 공략" 시나리오를 분석했습니다.

최적 매체 비중은 TVC 50%, Digital 50%로 나타났으며, 이 비율로 집행 시 예상 Reach 1+는 73.2%입니다. 총 예산 10억원을 TVC 5억원, Digital 5억원으로 배분하는 것을 권장합니다.

이 비율은 타겟 오디언스의 미디어 소비 패턴과 과거 캠페인 데이터를 기반으로 최적화되었습니다.`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyMessage = (content: Message['content'], index: number) => {
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

  return {
    // 상태
    message, setMessage,
    monthlyChatCount, monthlyChatLimit, isLimitReached, sessionLimitReached,
    copied,
    copiedMessageIndex,
    showResetDialog, setShowResetDialog,
    sessionTooltipOpen, setSessionTooltipOpen,
    messages,
    attachMenuOpen, setAttachMenuOpen,
    attachedFile,
    attachedUrl,
    showUrlDialog,
    urlInput, setUrlInput,
    fileInputRef,
    isLoading,
    messagesEndRef,
    selectedModel,
    modelMenuOpen, setModelMenuOpen,
    expandedWebSources, setExpandedWebSources,
    expandedRagSources, setExpandedRagSources,
    activeFootnote, setActiveFootnote,
    loadingMessage,
    retryCount,
    clarifyingQuestion,
    clarifyingSelected, setClarifyingSelected,
    clarifyingMultiSelected, setClarifyingMultiSelected,
    clarifyingCustom, setClarifyingCustom,
    clarifyingCustomMode, setClarifyingCustomMode,
    streamingIndex,
    streamingDisplayText,
    // 세션 정보
    daysRemaining, hoursRemaining, minutesRemaining,
    // 핸들러
    handleSend,
    handleRetry,
    handleStop,
    handleKeyDown,
    handleQuestionClick,
    handleFileSelect,
    handleAttachClick,
    handleImageAdd,
    handlePdfAdd,
    removeAttachment,
    handleUrlAdd,
    handleUrlSubmit,
    handleUrlCancel,
    handleReset,
    confirmReset,
    handleClarifyingSubmit,
    handleClarifyingSkip,
    handleModelSelect,
    handleCopy,
    handleCopyMessage
  }
}
