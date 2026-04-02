import { Bell, ChevronDown, Sun, Moon, LogOut, Info, TrendingUp, Database, DollarSign, Sparkles } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../common/Avatar'
import { GradeCard } from './GradeCard'

interface GlobalNavBarProps {
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export function GlobalNavBar({ isDarkMode, onToggleDarkMode }: GlobalNavBarProps) {
  const navigate = useNavigate()
  const [showClientLayer, setShowClientLayer] = useState(false)
  const [showNotificationLayer, setShowNotificationLayer] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const clientRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 레이어 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientRef.current && !clientRef.current.contains(event.target as Node)) {
        setShowClientLayer(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationLayer(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 광고주 목록 데이터 (자음 오름차순 정렬)
  const allAdvertisers = [
    { id: 1, name: '삼성전자', slotCount: 5 },
    { id: 2, name: '카카오', slotCount: 3 },
    { id: 3, name: '네이버', slotCount: 4 },
    { id: 4, name: 'LG전자', slotCount: 3 },
    { id: 5, name: '현대자동차', slotCount: 12 },
    { id: 6, name: 'SK텔레콤', slotCount: 9 },
    { id: 7, name: 'KT', slotCount: 7 },
    { id: 8, name: 'LG유플러스', slotCount: 11 },
    { id: 9, name: '롯데마트', slotCount: 4 },
    { id: 10, name: '쿠팡', slotCount: 15 },
    { id: 11, name: '배달의민족', slotCount: 8 },
    { id: 12, name: '토스', slotCount: 6 }
  ].sort((a, b) => a.name.localeCompare(b.name, 'ko'))

  // 상위 3개 광고주
  const topAdvertisers = allAdvertisers.slice(0, 3)

  // 알림 목록 데이터 (최근 10개) - 솔루션명과 결과물명 구조로 변경
  const notifications = [
    {
      id: 1,
      solution: 'Reach Caster',
      scenarioName: '시즌 프로모션 효과 예측',
      message: '시나리오 생성이 완료되었습니다.',
      completedMinutesAgo: 3,
      isNew: true,
      status: 'success',
      type: 'task',
      resultUrl: '/reachcaster/scenario/reach-predictor/result'
    },
    {
      id: 2,
      solution: 'DataShot',
      scenarioName: '2026년 3월 데이터',
      message: '최신 데이터가 업데이트되었습니다.',
      completedMinutesAgo: 5,
      isNew: true,
      status: 'info',
      type: 'notice',
      resultUrl: null
    },
    {
      id: 3,
      solution: 'DataShot',
      scenarioName: '2024 Q4 캠페인 데이터',
      message: '데이터셋 생성이 완료되었습니다.',
      completedMinutesAgo: 8,
      isNew: true,
      status: 'success',
      type: 'task',
      resultUrl: '/datashot/dataset/detail'
    },
    {
      id: 35,
      solution: 'ReadySet',
      scenarioName: '결과물 25개, 솔루션 2개 필요',
      message: 'Solution Expert까지 50% 도달했습니다.',
      completedMinutesAgo: 10,
      isNew: true,
      status: 'info',
      type: 'notice',
      resultUrl: null
    },
    {
      id: 4,
      solution: 'Reach Caster',
      scenarioName: '브랜드 인지도 측정',
      message: '시나리오 생성이 실패했습니다.',
      completedMinutesAgo: 15,
      isNew: true,
      status: 'error',
      type: 'task',
      resultUrl: '/reachcaster'
    },
    {
      id: 5,
      solution: 'DataShot',
      scenarioName: '메타 광고 성과 분석',
      message: '데이터셋 생성이 실패했습니다.',
      completedMinutesAgo: 25,
      isNew: false,
      status: 'error',
      type: 'task',
      resultUrl: '/datashot'
    },
    {
      id: 6,
      solution: 'Reach Caster',
      scenarioName: '연령별 선호도 분석',
      message: '시나리오 생성이 완료되었습니다.',
      completedMinutesAgo: 45,
      isNew: false,
      status: 'success',
      type: 'task',
      resultUrl: '/reachcaster/scenario/reach-predictor/result'
    },
    {
      id: 7,
      solution: 'DataShot',
      scenarioName: '구글 애즈 데이터 추출',
      message: '데이터셋 생성이 완료되었습니다.',
      completedMinutesAgo: 90,
      isNew: false,
      status: 'success',
      type: 'task',
      resultUrl: '/datashot/dataset/detail'
    },
    {
      id: 8,
      solution: 'Reach Caster',
      scenarioName: '할인율 최적화',
      message: '시나리오 생성이 완료되었습니다.',
      completedMinutesAgo: 120,
      isNew: false,
      status: 'success',
      type: 'task',
      resultUrl: '/reachcaster/scenario/ratio-finder/result'
    },
    {
      id: 9,
      solution: 'Reach Caster',
      scenarioName: 'CTR 개선 분석',
      message: '시나리오 생성이 완료되었습니다.',
      completedMinutesAgo: 180,
      isNew: false,
      status: 'success',
      type: 'task',
      resultUrl: '/reachcaster/scenario/reach-predictor/result'
    },
    {
      id: 10,
      solution: 'DataShot',
      scenarioName: '네이버 DA 캠페인 데이터',
      message: '데이터셋 생성이 완료되었습니다.',
      completedMinutesAgo: 240,
      isNew: false,
      status: 'success',
      type: 'task',
      resultUrl: '/datashot/dataset/detail'
    },
    {
      id: 11,
      solution: 'ReadySet',
      scenarioName: '개별 솔루션을 조합해 전략의 기틀을 잡는 숙련가입니다.',
      message: 'Strategy Builder 레벨에 도달했습니다.',
      completedMinutesAgo: 360,
      isNew: false,
      status: 'info',
      type: 'notice',
      resultUrl: null
    }
  ]

  // 시간 포맷팅 함수
  const formatTimeAgo = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}분 전`
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60)
      return `${hours}시간 전`
    } else {
      const days = Math.floor(minutes / 1440)
      return `${days}일 전`
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Floating Alert Bar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        borderRadius: '32px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 8px 24px 0 rgb(0 0 0 / 0.15)',
        backdropFilter: 'blur(12px)',
        minWidth: '600px',
        height: '40px'
      }}>
        {/* Clients 섹션 */}
        <div 
          ref={clientRef}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '16px',
            transition: 'all 0.2s',
            position: 'relative'
          }}
          onClick={() => setShowClientLayer(!showClientLayer)}
        >
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'hsl(var(--primary-foreground))' }}>
            Clients
          </span>
          
          {/* 광고주 프로필 이미지들 (겹쳐서 표시) */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
            {topAdvertisers.map((profile, index) => (
              <div
                key={profile.id}
                style={{
                  marginLeft: index > 0 ? '-6px' : '0',
                  zIndex: topAdvertisers.length - index,
                  border: '2px solid hsl(var(--primary))',
                  borderRadius: `${24 * 0.3}px`
                }}
              >
                <Avatar 
                  name={profile.name}
                  type="advertiser"
                  size={24}
                />
              </div>
            ))}
            
            {/* +개수 표시 칩 */}
            <div style={{
              marginLeft: '6px',
              backgroundColor: 'hsl(var(--primary-foreground))',
              color: 'hsl(var(--primary))',
              borderRadius: '12px',
              padding: '2px 6px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              +{allAdvertisers.length - 3}
            </div>
          </div>

          {/* 광고주 목록 레이어 */}
          {showClientLayer && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '8px',
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              padding: '12px 0',
              minWidth: '320px',
              maxHeight: '480px',
              overflowY: 'auto',
              boxShadow: '0 12px 24px 0 rgb(0 0 0 / 0.15)',
              zIndex: 1000
            }}
            className="custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div style={{ 
                padding: '0 16px 12px 16px',
                borderBottom: '1px solid hsl(var(--border))',
                marginBottom: '8px'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600'
                }} className="text-foreground">
                  광고주 목록
                </div>
                <div style={{ 
                  fontSize: '12px',
                  marginTop: '2px'
                }} className="text-muted-foreground">
                  총 {allAdvertisers.length}개 광고주
                </div>
              </div>

              {/* 광고주 목록 */}
              {allAdvertisers.map((advertiser) => (
                <div
                  key={advertiser.id}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  onClick={() => {
                    console.log('광고주 클릭:', advertiser.name)
                    setShowClientLayer(false)
                  }}
                >
                  <Avatar 
                    name={advertiser.name}
                    type="advertiser"
                    size={32}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '500'
                    }} className="text-foreground">
                      {advertiser.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div style={{
          width: '1px',
          height: '20px',
          backgroundColor: 'hsl(var(--primary-foreground))',
          opacity: 0.3
        }} />

        {/* 알림 섹션 */}
        <div 
          ref={notificationRef}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '16px',
            transition: 'all 0.2s',
            position: 'relative',
            minWidth: '400px'
          }}
          onClick={() => setShowNotificationLayer(!showNotificationLayer)}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Bell size={16} style={{ color: 'hsl(var(--primary-foreground))', flexShrink: 0 }} />
            {/* NEW 알림이 있을 때 빨간 점 표시 */}
            {notifications.some(n => n.isNew) && (
              <div style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                border: '2px solid hsl(var(--primary))',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
              }} />
            )}
          </div>
          <span style={{ 
            fontSize: '13px', 
            fontWeight: '500', 
            color: 'hsl(var(--primary-foreground))',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1,
            minWidth: 0
          }}>
            R/C {notifications[0].scenarioName}: {notifications[0].message}
          </span>

          {/* 알림 목록 레이어 */}
          {showNotificationLayer && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              padding: '12px 0',
              minWidth: '400px',
              maxHeight: '480px',
              overflowY: 'auto',
              boxShadow: '0 12px 24px 0 rgb(0 0 0 / 0.15)',
              zIndex: 1000
            }}
            className="custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div style={{ 
                padding: '0 16px 12px 16px',
                borderBottom: '1px solid hsl(var(--border))',
                marginBottom: '8px'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600'
                }} className="text-foreground">
                  최근 알림
                </div>
                <div style={{ 
                  fontSize: '12px',
                  marginTop: '2px'
                }} className="text-muted-foreground">
                  {notifications.filter(n => n.isNew).length}개의 새로운 알림 • 최근 10개 알림만 표시됩니다
                </div>
              </div>

              {/* 알림 목록 */}
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    padding: '12px 16px',
                    cursor: notification.resultUrl ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    borderLeft: notification.isNew 
                      ? `3px solid ${
                          notification.status === 'error' ? '#ef4444' : 
                          notification.status === 'info' ? '#3b82f6' : 
                          'hsl(var(--primary))'
                        }`
                      : '3px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (notification.resultUrl) {
                      e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  onClick={() => {
                    if (notification.resultUrl) {
                      navigate(notification.resultUrl)
                      setShowNotificationLayer(false)
                    }
                  }}
                >
                  <div style={{ marginBottom: '4px' }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '500',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: notification.status === 'error' ? '#ef4444' : 
                             notification.status === 'info' ? '#3b82f6' : 
                             'hsl(var(--foreground))'
                    }}>
                      {notification.type === 'notice' && (
                        <Info size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                      )}
                      {notification.message}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {notification.type === 'notice' && (
                          <span style={{
                            fontSize: '10px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '1px 4px',
                            borderRadius: '4px',
                            fontWeight: '600'
                          }}>
                            Notice
                          </span>
                        )}
                        {notification.isNew && (
                          <span style={{
                            fontSize: '10px',
                            backgroundColor: notification.status === 'error' ? '#ef4444' : 
                                            notification.status === 'info' ? '#3b82f6' : 
                                            'hsl(var(--primary))',
                            color: 'white',
                            padding: '1px 4px',
                            borderRadius: '4px',
                            fontWeight: '600'
                          }}>
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '12px',
                      marginBottom: '4px'
                    }} className="text-muted-foreground">
                      {notification.solution}: {notification.scenarioName}
                    </div>
                    <div style={{ 
                      fontSize: '11px'
                    }} className="text-muted-foreground">
                      {formatTimeAgo(notification.completedMinutesAgo)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div style={{
          width: '1px',
          height: '20px',
          backgroundColor: 'hsl(var(--primary-foreground))',
          opacity: 0.3
        }} />

        {/* 등급 섹션 */}
        <GradeCard />
      </div>

      {/* Main GNB */}
      <header style={{
        height: '64px',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'relative'
      }}>
        {/* 왼쪽 로고 영역 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a 
            href="/slotboard"
            style={{
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            <h1 style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              color: 'hsl(var(--foreground))',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
            >
              ReadySet
            </h1>
          </a>
        </div>

        {/* 오른쪽 프로필 영역 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* 다크모드 토글 */}
          <button
            onClick={onToggleDarkMode}
            className="btn btn-ghost btn-sm"
            style={{ padding: '8px' }}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* 프로필 영역 */}
          <div 
            ref={profileRef}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '12px',
              transition: 'all 0.2s',
              position: 'relative'
            }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {/* 프로필 이미지 */}
            <Avatar 
              name="Shin Jia"
              type="user"
              size={36}
              userId="USER001"
            />
            
            {/* 이름/역할 */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                lineHeight: '1.2'
              }} className="text-foreground">
                Shin Jia
              </div>
              <div style={{ 
                fontSize: '12px', 
                lineHeight: '1.2',
                marginTop: '2px'
              }} className="text-muted-foreground">
                Marketer
              </div>
            </div>
            
            {/* 화살표 아이콘 */}
            <ChevronDown size={16} className="text-muted-foreground" />

            {/* 프로필 메뉴 */}
            {showProfileMenu && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '4px',
                  minWidth: '180px',
                  boxShadow: '0 12px 24px 0 rgb(0 0 0 / 0.15)',
                  zIndex: 1000
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    console.log('로그아웃')
                    setShowProfileMenu(false)
                    // 실제 로그아웃 로직 추가
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  className="text-foreground"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}
