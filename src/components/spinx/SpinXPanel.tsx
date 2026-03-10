import { X, Minimize2, Paperclip, Send, Copy, Check, Clock, RotateCcw, Scale, Image as ImageIcon, Rotate3d, Square, RefreshCw } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface SpinXPanelProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode?: boolean
  scenarioName?: string
}

export function SpinXPanel({ isOpen, onClose, isDarkMode = false, scenarioName = '25-34세 여성 타겟 집중 공략' }: SpinXPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [sessionTooltipOpen, setSessionTooltipOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string | { type: 'chart', data: any } | { type: 'error', message: string }, timestamp: string, originalQuestion?: string }>>([])
  const [attachMenuOpen, setAttachMenuOpen] = useState(false)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentQuestion, setCurrentQuestion] = useState<string>('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 패널이 열릴 때 body 스크롤 막기 제거 (결과화면 스크롤 가능하도록)
  // useEffect는 제거

  // 대화 시작 날짜 (실제로는 localStorage 등에서 관리)
  const conversationStartDate = new Date()
  const conversationExpiryDate = new Date(conversationStartDate)
  conversationExpiryDate.setDate(conversationExpiryDate.getDate() + 14)
  
  const timeRemaining = conversationExpiryDate.getTime() - new Date().getTime()
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

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

  // 질문별 답변 예시
  const answerExamples: Record<string, string | { type: 'chart', data: any } | { type: 'error', message: string }> = {
    '이 예측 결과를 어떻게 해석해야 하나요?': '현재 분석 결과는 TVC 50%, Digital 50% 비율이 최적임을 보여줍니다.\n\n주요 해석 포인트:\n\n1. 예상 Reach 1+가 73.2%로, 타겟 오디언스의 약 73%에게 최소 1회 이상 광고가 노출됩니다.\n\n2. 이 비율은 비용 대비 효율성이 가장 높은 지점으로, 예산을 더 투입해도 도달률 증가폭이 감소하는 체감 수익 구간에 진입합니다.\n\n3. 25-34세 여성 타겟의 미디어 소비 패턴이 TV와 디지털을 균형있게 사용하기 때문에 이러한 결과가 도출되었습니다.',
    'Effective Impression이 무엇인가요?': 'Effective Impression은 광고가 실제로 효과적으로 전달된 노출 수를 의미합니다.\n\n일반 Impression과의 차이:\n\n• 일반 Impression: 광고가 화면에 표시된 모든 횟수\n• Effective Impression: 사용자가 실제로 볼 수 있는 위치에서 충분한 시간 동안 노출된 횟수\n\n측정 기준:\n- 디지털: 광고의 50% 이상이 1초 이상 화면에 노출 (동영상은 2초)\n- TVC: 프로그램 시청 중 광고 시간대 실제 시청 추정치\n\nEffective Impression이 높을수록 광고 효율이 좋다고 판단할 수 있습니다.',
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
    '답변 실패 예시': {
      type: 'error',
      message: '죄송합니다. 일시적인 오류로 답변을 생성하지 못했습니다.'
    },
    '시각화 예시': {
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
    }
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
      setCurrentQuestion(textToSend) // 현재 질문 저장
      setIsLoading(true)
      
      // AI 답변 생성 (예시) - 1초 딜레이
      timeoutRef.current = setTimeout(() => {
        const answer = answerExamples[textToSend]
        const aiResponse = {
          role: 'assistant' as const,
          content: answer || '죄송합니다. 해당 질문에 대한 답변을 준비 중입니다. 다른 질문을 선택해주세요.',
          timestamp: '방금 전',
          originalQuestion: textToSend
        }
        
        setMessages(prev => [...prev, aiResponse])
        setIsLoading(false)
        setCurrentQuestion('')
        timeoutRef.current = null
      }, 1000)
    }
  }

  const handleRetry = (originalQuestion: string) => {
    if (!isLoading) {
      handleSend(originalQuestion)
    }
  }

  const handleStop = () => {
    // setTimeout 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
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
    if (file && file.type.startsWith('image/')) {
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

  const removeAttachment = () => {
    setAttachedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleReset = () => {
    setShowResetDialog(true)
  }

  const confirmReset = () => {
    setMessages([])
    setMessage('')
    setAttachedFile(null)
    setShowResetDialog(false)
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
        position: 'fixed',
        top: 0,
        right: isOpen ? 0 : '-480px',
        width: '480px',
        height: '100vh',
        backgroundColor: isDarkMode ? 'hsl(var(--card))' : 'hsl(var(--card))',
        borderLeft: '1px solid hsl(var(--border))',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        transition: 'right 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        overflow: 'hidden',
        maxHeight: '100vh'
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
        {/* 좌측: SpinX 타이틀 */}
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
            SpinX
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

        {/* 우측: 최소화 + 닫기 버튼 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px' }}
          >
            <Minimize2 size={16} />
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
              <Scale size={14} />
              Ratio Finder
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
              {msg.role === 'user' ? (
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
                      {/* 복사 버튼 */}
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
                      <div style={{ paddingRight: '32px' }}>
                        {msg.content}
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
                  답변을 기다리고 있어요...
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
        {/* 모델 표시 + 대화 유지 기간 + 초기화 */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#00ff9d'
              }}
            />
            Claude Sonnet 4.5
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
            <button
              onClick={handleReset}
              className="btn btn-ghost btn-sm"
              style={{ padding: '4px', minHeight: 'auto', height: 'auto' }}
              title="대화 초기화"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>

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
            {/* 첨부 파일 칩 */}
            {attachedFile && (
              <div style={{
                marginBottom: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                backgroundColor: 'hsl(var(--muted))',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'Paperlogy, sans-serif'
              }}>
                <ImageIcon size={14} />
                <span>{attachedFile.name}</span>
                <button
                  onClick={removeAttachment}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'hsl(var(--muted-foreground))'
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
              placeholder="Ask anything..."
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
              accept="image/*"
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
              {/* 첨부 버튼 */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={handleAttachClick}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '6px' }}
                  title="파일 첨부"
                  disabled={attachedFile !== null}
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
                  </div>
                )}
              </div>

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
                  className="btn btn-primary btn-sm"
                  style={{
                    padding: '6px',
                    opacity: message.trim() && !isLoading ? 1 : 0.5,
                    cursor: message.trim() && !isLoading ? 'pointer' : 'not-allowed'
                  }}
                  title="전송 (Enter)"
                >
                  <Send size={16} />
                </button>
              )}
            </div>
          </div>
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
    </div>
  )
}
