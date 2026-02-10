import React, { useState } from 'react'
import { X, ChevronDown, Lock, Users, Globe } from 'lucide-react'

interface CreateFolderModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateFolderModal({ isOpen, onClose }: CreateFolderModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    advertiser: '',
    visibility: 'private' as 'private' | 'internal' | 'shared'
  })

  // Mock data - 권한이 있는 광고주 목록
  const availableAdvertisers = [
    { id: 'samsung', name: '삼성전자' },
    { id: 'lg', name: 'LG전자' },
    { id: 'hyundai', name: '현대자동차' },
    { id: 'kia', name: '기아자동차' },
    { id: 'sk', name: 'SK텔레콤' }
  ]

  const visibilityOptions = [
    { 
      value: 'private', 
      label: 'Private', 
      description: '나만 볼 수 있음',
      icon: Lock 
    },
    { 
      value: 'internal', 
      label: 'Internal', 
      description: '같은 조직 내 공유',
      icon: Users 
    },
    { 
      value: 'shared', 
      label: 'Shared', 
      description: '전체 공유',
      icon: Globe 
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API 호출로 폴더 생성
    console.log('Creating folder:', formData)
    onClose()
  }

  const isValid = formData.name.trim() && formData.advertiser

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal modal--md">
        <div className="modal__header">
          <h2 className="modal__title">새 폴더 만들기</h2>
          <button className="modal__close" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body">
          {/* 폴더명 (필수) */}
          <div className="form-field">
            <label className="form-field__label form-field__label--required">
              폴더명
            </label>
            <input
              type="text"
              className="form-field__input"
              placeholder="폴더명을 입력하세요"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          {/* 폴더 설명 (선택) */}
          <div className="form-field">
            <label className="form-field__label">폴더 설명</label>
            <textarea
              className="form-field__textarea"
              placeholder="폴더에 대한 설명을 입력하세요 (선택사항)"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* 광고주명 (필수, 드롭다운) */}
          <div className="form-field">
            <label className="form-field__label form-field__label--required">
              광고주
            </label>
            <div className="select-wrapper">
              <select
                className="form-field__select"
                value={formData.advertiser}
                onChange={(e) => setFormData(prev => ({ ...prev, advertiser: e.target.value }))}
                required
              >
                <option value="">광고주를 선택하세요</option>
                {availableAdvertisers.map(advertiser => (
                  <option key={advertiser.id} value={advertiser.id}>
                    {advertiser.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-wrapper__icon" />
            </div>
          </div>

          {/* 가시성 설정 (필수) */}
          <div className="form-field">
            <label className="form-field__label form-field__label--required">
              가시성 설정
            </label>
            <div className="visibility-options">
              {visibilityOptions.map(option => {
                const IconComponent = option.icon
                return (
                  <label 
                    key={option.value}
                    className={`visibility-option ${formData.visibility === option.value ? 'visibility-option--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={option.value}
                      checked={formData.visibility === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                      className="visibility-option__input"
                    />
                    <div className="visibility-option__content">
                      <div className="visibility-option__header">
                        <IconComponent className="visibility-option__icon" />
                        <span className="visibility-option__label">{option.label}</span>
                      </div>
                      <span className="visibility-option__description">
                        {option.description}
                      </span>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        </form>

        <div className="modal__footer">
          <button 
            type="button" 
            className="btn btn--ghost"
            onClick={onClose}
          >
            취소
          </button>
          <button 
            type="submit"
            className={`btn btn--primary ${!isValid ? 'btn--disabled' : ''}`}
            disabled={!isValid}
            onClick={handleSubmit}
          >
            폴더 생성
          </button>
        </div>
      </div>
    </div>
  )
}