import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, X } from 'lucide-react'

interface EditFolderProps {
  onBack: () => void
  onSuccess: () => void
  folderData: {
    id: string
    folderName: string
    folderDescription: string
    advertiserId: string
    advertiserName: string
    visibility: 'Private' | 'Internal' | 'Shared'
  }
}

interface FormData {
  folderName: string
  folderDescription: string
  visibility: 'Private' | 'Internal' | 'Shared' | ''
  sharedWith: {
    client: boolean
    agency: boolean
  }
}

interface ValidationErrors {
  folderName?: string
  visibility?: string
  sharedWith?: string
}

export function EditFolder({ onBack, onSuccess, folderData }: EditFolderProps) {
  const [formData, setFormData] = useState<FormData>({
    folderName: folderData.folderName,
    folderDescription: folderData.folderDescription,
    visibility: folderData.visibility,
    sharedWith: {
      client: false,
      agency: false
    }
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showToast, setShowToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // 폼 데이터 변경 감지
  useEffect(() => {
    const hasChanges = 
      formData.folderName !== folderData.folderName ||
      formData.folderDescription !== folderData.folderDescription ||
      formData.visibility !== folderData.visibility
    setHasUnsavedChanges(hasChanges)
  }, [formData, folderData])

  // 유효성 검사
  const validateForm = () => {
    const newErrors: ValidationErrors = {}

    if (!formData.folderName.trim()) {
      newErrors.folderName = 'Slot명을 입력해주세요.'
    } else if (formData.folderName.length > 30) {
      newErrors.folderName = 'Slot명은 30자 이내로 입력해주세요.'
    }

    if (!formData.visibility) {
      newErrors.visibility = '가시성 설정을 선택해주세요.'
    }

    // Shared 선택 시 공유 대상 유효성 검사
    if (formData.visibility === 'Shared') {
      if (!formData.sharedWith.client && !formData.sharedWith.agency) {
        newErrors.sharedWith = '1개 이상의 공유 대상을 선택해야 합니다.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 실시간 유효성 검사
  useEffect(() => {
    if (hasUnsavedChanges) {
      validateForm()
    }
  }, [formData, hasUnsavedChanges])

  const isFormValid = () => {
    const baseValid = formData.folderName.trim() && 
                     formData.folderName.length <= 30 && 
                     formData.visibility &&
                     Object.keys(errors).length === 0

    // Shared 선택 시 추가 검증
    if (formData.visibility === 'Shared') {
      return baseValid && (formData.sharedWith.client || formData.sharedWith.agency)
    }

    return baseValid
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowConfirmDialog(true)
    } else {
      onBack()
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 성공 시
      setShowToast({ type: 'success', message: 'Slot이 성공적으로 수정되었습니다.' })
      setTimeout(() => {
        onSuccess()
      }, 2000)
      
    } catch (error) {
      // 실패 시
      setShowToast({ type: 'error', message: 'Slot 수정에 실패했습니다. 다시 시도해주세요.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmLeave = () => {
    setShowConfirmDialog(false)
    onBack()
  }

  return (
    <>
      {/* Main Content */}
      <div className="workspace-content">
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
            {/* 기본 정보 */}
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 20px 0'
              }} className="text-foreground">
                기본 정보
              </h2>

              {/* Slot명 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }} className="text-foreground">
                  Slot명 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.folderName}
                  onChange={(e) => handleInputChange('folderName', e.target.value)}
                  placeholder="Slot명을 입력하세요 (최대 30자)"
                  className="input"
                  style={{
                    borderColor: errors.folderName ? 'hsl(var(--destructive))' : undefined,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                />
                {errors.folderName && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '4px',
                    fontSize: '12px'
                  }} className="text-destructive">
                    <AlertCircle size={12} />
                    {errors.folderName}
                  </div>
                )}
                <div style={{
                  textAlign: 'right',
                  fontSize: '12px',
                  marginTop: '4px'
                }} className="text-muted-foreground">
                  {formData.folderName.length}/30
                </div>
              </div>

              {/* Slot 설명 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }} className="text-foreground">
                  Slot 설명 (선택)
                </label>
                <textarea
                  value={formData.folderDescription}
                  onChange={(e) => handleInputChange('folderDescription', e.target.value)}
                  placeholder="Slot에 대한 설명을 입력하세요 (최대 200자)"
                  rows={4}
                  className="textarea"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                />
                <div style={{
                  textAlign: 'right',
                  fontSize: '12px',
                  marginTop: '4px'
                }} className="text-muted-foreground">
                  {formData.folderDescription.length}/200
                </div>
              </div>
            </section>

            {/* 권한 설정 */}
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 20px 0'
              }} className="text-foreground">
                권한 설정
              </h2>

              {/* 광고주 설정 - 수정 불가 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }} className="text-foreground">
                  광고주 설정
                </label>
                <div
                  className="input"
                  style={{
                    backgroundColor: 'hsl(var(--muted))',
                    color: 'hsl(var(--muted-foreground))',
                    cursor: 'not-allowed',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                >
                  {folderData.advertiserName}
                </div>
                <div style={{
                  marginTop: '4px',
                  fontSize: '12px'
                }} className="text-muted-foreground">
                  광고주 ID: {folderData.advertiserId} (수정 불가)
                </div>
              </div>

              {/* 가시성 설정 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '12px'
                }} className="text-foreground">
                  가시성 설정 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(['Private', 'Internal', 'Shared'] as const).map(visibility => (
                    <label key={visibility} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      cursor: 'pointer',
                      padding: '12px',
                      border: `1px solid ${formData.visibility === visibility ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                      borderRadius: '6px',
                      backgroundColor: formData.visibility === visibility ? 'hsl(var(--primary) / 0.1)' : 'transparent'
                    }}>
                      <input
                        type="radio"
                        name="visibility"
                        value={visibility}
                        checked={formData.visibility === visibility}
                        onChange={(e) => handleInputChange('visibility', e.target.value)}
                        className="radio-custom"
                        style={{ marginTop: '2px' }}
                      />
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                          {visibility === 'Private' && 'Private (비공개)'}
                          {visibility === 'Internal' && 'Internal (내부 공유)'}
                          {visibility === 'Shared' && 'Shared (전체 공유)'}
                        </div>
                        <div style={{ fontSize: '12px' }} className="text-muted-foreground">
                          {visibility === 'Private' && '생성자 본인만 접근 및 편집이 가능합니다.'}
                          {visibility === 'Internal' && '해당 광고주 권한이 있는 사용자(내부)에게만 공개됩니다.'}
                          {visibility === 'Shared' && '외부 파트너를 포함하여 권한이 있는 모든 사용자에게 공개됩니다.'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.visibility && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '8px',
                    fontSize: '12px'
                  }} className="text-destructive">
                    <AlertCircle size={12} />
                    {errors.visibility}
                  </div>
                )}

                {/* Shared 선택 시 추가 옵션 */}
                {formData.visibility === 'Shared' && (
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    borderRadius: '6px',
                    border: errors.sharedWith ? '1px solid hsl(var(--destructive))' : '1px solid hsl(var(--border))'
                  }} className="bg-muted">
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '12px'
                    }} className="text-foreground">
                      공유 대상 선택 <span style={{ color: 'hsl(var(--destructive))' }}>*</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={formData.sharedWith.client}
                          onChange={(e) => handleInputChange('sharedWith', {
                            ...formData.sharedWith,
                            client: e.target.checked
                          })}
                          className="checkbox-custom"
                        />
                        <span style={{ fontSize: '14px' }}>Client</span>
                      </label>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={formData.sharedWith.agency}
                          onChange={(e) => handleInputChange('sharedWith', {
                            ...formData.sharedWith,
                            agency: e.target.checked
                          })}
                          className="checkbox-custom"
                        />
                        <span style={{ fontSize: '14px' }}>Agency</span>
                      </label>
                    </div>
                    {errors.sharedWith && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '8px',
                        fontSize: '12px'
                      }} className="text-destructive">
                        <AlertCircle size={12} />
                        {errors.sharedWith}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* 버튼 */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleBack}
                className="btn btn-secondary btn-md"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting || !hasUnsavedChanges}
                className={`btn btn-md ${
                  isFormValid() && !isSubmitting && hasUnsavedChanges
                    ? 'btn-primary' 
                    : 'bg-muted text-muted-foreground'
                }`}
                style={{
                  cursor: isFormValid() && !isSubmitting && hasUnsavedChanges ? 'pointer' : 'not-allowed'
                }}
              >
                {isSubmitting ? '수정 중...' : '수정'}
              </button>
            </div>
        </div>
      </div>

      {/* 확인 다이얼로그 */}
      {showConfirmDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title">
                페이지를 떠나시겠습니까?
              </h3>
              <p className="dialog-description">
                변경한 내용이 저장되지 않습니다. 정말로 페이지를 떠나시겠습니까?
              </p>
            </div>
            <div className="dialog-footer">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="btn btn-secondary btn-sm"
              >
                취소
              </button>
              <button
                onClick={confirmLeave}
                className="btn btn-sm"
                style={{
                  backgroundColor: 'hsl(var(--destructive))',
                  color: 'hsl(var(--destructive-foreground))'
                }}
              >
                떠나기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 알림 */}
      {showToast && (
        <div className={`toast ${showToast.type === 'success' ? 'toast--success' : 'toast--error'}`}>
          <div className="toast__icon">
            {showToast.type === 'success' ? (
              <CheckCircle size={20} style={{ color: 'hsl(142.1 76.2% 36.3%)' }} />
            ) : (
              <AlertCircle size={20} style={{ color: 'hsl(var(--destructive))' }} />
            )}
          </div>
          <div className="toast__content">
            <p className="toast__title">
              {showToast.type === 'success' ? '성공' : '오류'}
            </p>
            <p className="toast__description">
              {showToast.message}
            </p>
          </div>
          <button
            onClick={() => setShowToast(null)}
            className="toast__close"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  )
}