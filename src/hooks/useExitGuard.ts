import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface UseExitGuardOptions {
  /** 이탈 방지 활성화 여부 */
  isDirty: boolean
  /** 폼 제출 완료 상태 — true이면 Guard 해제 */
  isSubmitted?: boolean
}

interface UseExitGuardReturn {
  /** 이탈 확인 다이얼로그 표시 여부 */
  showExitDialog: boolean
  /** 다이얼로그 닫기 (페이지 유지) */
  cancelExit: () => void
  /** 이탈 확인 (네비게이션 수행) */
  confirmExit: () => void
  /** navigate를 감싸는 안전한 네비게이션 함수 */
  safeNavigate: (to: string) => void
  /** 취소 버튼 등에서 직접 호출 */
  handleCancel: (fallbackPath: string) => void
}

/**
 * 생성 화면 이탈 방지 훅
 * 
 * - 입력 값이 있을 때(isDirty) 페이지 이탈 시도 시 확인 다이얼로그 노출
 * - 브라우저 새로고침/닫기: beforeunload 이벤트
 * - SPA 내 네비게이션: safeNavigate로 감싸서 처리
 * - 뒤로 가기: popstate 이벤트 가로채기
 */
export function useExitGuard({ isDirty, isSubmitted = false }: UseExitGuardOptions): UseExitGuardReturn {
  const navigate = useNavigate()
  const [showExitDialog, setShowExitDialog] = useState(false)
  const pendingNavigationRef = useRef<string | null>(null)
  const isGuardActive = isDirty && !isSubmitted

  // 브라우저 새로고침/닫기 방지 (beforeunload)
  useEffect(() => {
    if (!isGuardActive) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isGuardActive])

  // 브라우저 뒤로가기 방지 (popstate)
  useEffect(() => {
    if (!isGuardActive) return

    // 히스토리에 더미 엔트리 추가하여 뒤로가기 감지
    window.history.pushState(null, '', window.location.href)

    const handlePopState = () => {
      // 뒤로가기 시도 감지 → 다이얼로그 표시
      window.history.pushState(null, '', window.location.href)
      pendingNavigationRef.current = '__back__'
      setShowExitDialog(true)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isGuardActive])

  /** SPA 내 네비게이션을 가로채는 함수 */
  const safeNavigate = useCallback((to: string) => {
    if (isGuardActive) {
      pendingNavigationRef.current = to
      setShowExitDialog(true)
    } else {
      navigate(to)
    }
  }, [isGuardActive, navigate])

  /** 취소 버튼용 핸들러 */
  const handleCancel = useCallback((fallbackPath: string) => {
    safeNavigate(fallbackPath)
  }, [safeNavigate])

  /** 다이얼로그에서 "계속 작성" 클릭 */
  const cancelExit = useCallback(() => {
    pendingNavigationRef.current = null
    setShowExitDialog(false)
  }, [])

  /** 다이얼로그에서 "나가기" 클릭 */
  const confirmExit = useCallback(() => {
    setShowExitDialog(false)
    const target = pendingNavigationRef.current
    pendingNavigationRef.current = null

    if (target === '__back__') {
      // 뒤로가기의 경우: 히스토리 뒤로
      window.history.go(-2)
    } else if (target) {
      navigate(target)
    }
  }, [navigate])

  return {
    showExitDialog,
    cancelExit,
    confirmExit,
    safeNavigate,
    handleCancel
  }
}
