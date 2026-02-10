import { Bell, ChevronDown, ChevronRight, Sun, Moon, Zap, Activity, Target, Award, Crown, Star } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface GlobalNavBarProps {
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export function GlobalNavBar({ isDarkMode, onToggleDarkMode }: GlobalNavBarProps) {
  const [showNotificationLayer, setShowNotificationLayer] = useState(false)
  const [showGradeTooltip, setShowGradeTooltip] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const gradeRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 알림 레이어 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationLayer(false)
      }
      if (gradeRef.current && !gradeRef.current.contains(event.target as Node)) {
        setShowGradeTooltip(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 현재 사용자 등급 (예시: Strategy Builder)
  const currentGrade = {
    name: 'Strategy Builder',
    icon: Target,
    description: '개별 솔루션을 조합해 전략의 기틀을 잡는 숙련가.'
  }

  // 등급 정보
  const grades = [
    {
      name: 'Slot-In Ready',
      icon: Zap,
      description: 'ReadySet의 잠재력을 탐색 중인 예비 전략가.'
    },
    {
      name: 'Active Slotter',
      icon: Activity,
      description: '데이터의 흐름을 만들기 시작한 실무 전략가.'
    },
    {
      name: 'Strategy Builder',
      icon: Target,
      description: '개별 솔루션을 조합해 전략의 기틀을 잡는 숙련가.'
    },
    {
      name: 'Solution Expert',
      icon: Award,
      description: '플랫폼을 완벽히 활용해 최적의 해답을 도출하는 전문가.'
    },
    {
      name: 'Master Architect',
      icon: Crown,
      description: '복잡한 시나리오를 구조화하여 전략 생태계를 구축한 마스터.'
    },
    {
      name: 'ReadySet Visionary',
      icon: Star,
      description: '플랫폼의 한계를 넘어 전략의 새 지평을 여는 독보적 선구자.'
    }
  ]

  // 다음 등급 찾기
  const currentGradeIndex = grades.findIndex(grade => grade.name === currentGrade.name)
  const nextGrade = currentGradeIndex < grades.length - 1 ? grades[currentGradeIndex + 1] : null

  // 예시 광고주 프로필 이미지 데이터
  const advertiserProfiles = [
    { id: 1, name: '삼성전자', avatar: 'https://via.placeholder.com/32/3B82F6/FFFFFF?text=S' },
    { id: 2, name: 'LG전자', avatar: 'https://via.placeholder.com/32/EF4444/FFFFFF?text=L' },
    { id: 3, name: '현대자동차', avatar: 'https://via.placeholder.com/32/10B981/FFFFFF?text=H' }
  ]

  // 예시 알림 목록 데이터 (최근 10개)
  const notifications = [
    {
      id: 1,
      slotName: '삼성 갤럭시 S24 캠페인',
      scenarioType: 'A/B 테스트',
      scenarioName: '타겟 오디언스 비교',
      completedMinutesAgo: 3,
      isNew: true
    },
    {
      id: 2,
      slotName: 'LG 올레드 TV 런칭 캠페인',
      scenarioType: '성과 분석',
      scenarioName: '브랜드 인지도 측정',
      completedMinutesAgo: 15,
      isNew: true
    },
    {
      id: 3,
      slotName: '현대 아이오닉 6 마케팅',
      scenarioType: '타겟팅',
      scenarioName: '연령별 선호도 분석',
      completedMinutesAgo: 45,
      isNew: false
    },
    {
      id: 4,
      slotName: '네이버 쇼핑 프로모션',
      scenarioType: 'A/B 테스트',
      scenarioName: '할인율 최적화',
      completedMinutesAgo: 120,
      isNew: false
    },
    {
      id: 5,
      slotName: '카카오톡 광고 캠페인',
      scenarioType: '성과 분석',
      scenarioName: 'CTR 개선 분석',
      completedMinutesAgo: 180,
      isNew: false
    },
    {
      id: 6,
      slotName: '쿠팡 로켓배송 홍보',
      scenarioType: '타겟팅',
      scenarioName: '지역별 배송 선호도',
      completedMinutesAgo: 240,
      isNew: false
    },
    {
      id: 7,
      slotName: 'SK텔레콤 5G 서비스',
      scenarioType: 'A/B 테스트',
      scenarioName: '요금제 비교',
      completedMinutesAgo: 300,
      isNew: false
    },
    {
      id: 8,
      slotName: 'KT 인터넷 서비스',
      scenarioType: '성과 분석',
      scenarioName: '고객 만족도 조사',
      completedMinutesAgo: 360,
      isNew: false
    },
    {
      id: 9,
      slotName: 'LG유플러스 모바일',
      scenarioType: '타겟팅',
      scenarioName: '데이터 사용량 분석',
      completedMinutesAgo: 420,
      isNew: false
    },
    {
      id: 10,
      slotName: '롯데마트 온라인',
      scenarioType: 'A/B 테스트',
      scenarioName: '배송비 정책 테스트',
      completedMinutesAgo: 480,
      isNew: false
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
        {/* My Advertisers 섹션 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'hsl(var(--primary-foreground))' }}>
            My Advertisers
          </span>
          
          {/* 광고주 프로필 이미지들 (겹쳐서 표시) */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
            {advertiserProfiles.map((profile, index) => (
              <div
                key={profile.id}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: profile.avatar.includes('3B82F6') ? '#3B82F6' : 
                                   profile.avatar.includes('EF4444') ? '#EF4444' : '#10B981',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '600',
                  border: '2px solid hsl(var(--primary))',
                  marginLeft: index > 0 ? '-8px' : '0',
                  zIndex: advertiserProfiles.length - index
                }}
              >
                {profile.name.charAt(0)}
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
              +9
            </div>
          </div>
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
            position: 'relative'
          }}
          onClick={() => setShowNotificationLayer(!showNotificationLayer)}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--primary-foreground) / 0.1)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <Bell size={16} style={{ color: 'hsl(var(--primary-foreground))' }} />
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--primary-foreground))' }}>
            Reach Caster: {notifications[0].scenarioType} &gt; {notifications[0].scenarioName} 생성이 완료되었습니다!
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
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderLeft: notification.isNew ? '3px solid hsl(var(--primary))' : '3px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  onClick={() => {
                    console.log('알림 클릭:', notification)
                    setShowNotificationLayer(false)
                  }}
                >
                  <div style={{ marginBottom: '4px' }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '500',
                      marginBottom: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }} className="text-foreground">
                      {notification.slotName}
                      {notification.isNew && (
                        <span style={{
                          fontSize: '10px',
                          backgroundColor: 'hsl(var(--primary))',
                          color: 'hsl(var(--primary-foreground))',
                          padding: '1px 4px',
                          borderRadius: '4px',
                          fontWeight: '600'
                        }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <div style={{ 
                      fontSize: '12px',
                      marginBottom: '4px'
                    }} className="text-muted-foreground">
                      Reach Caster: {notification.scenarioType} &gt; {notification.scenarioName}
                    </div>
                    <div style={{ 
                      fontSize: '11px'
                    }} className="text-muted-foreground">
                      {formatTimeAgo(notification.completedMinutesAgo)} 완료
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
        <div 
          ref={gradeRef}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '16px',
            transition: 'all 0.2s',
            position: 'relative'
          }}
          onMouseEnter={() => setShowGradeTooltip(true)}
          onMouseLeave={() => setShowGradeTooltip(false)}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--primary-foreground) / 0.1)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <currentGrade.icon size={16} style={{ color: 'hsl(var(--primary-foreground))' }} />
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--primary-foreground))' }}>
            {currentGrade.name}
          </span>

          {/* 등급 설명 툴팁 */}
          {showGradeTooltip && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              padding: '16px',
              minWidth: '280px',
              maxWidth: '320px',
              boxShadow: '0 12px 24px 0 rgb(0 0 0 / 0.15)',
              zIndex: 1000
            }}>
              {/* 현재 등급 정보 */}
              <div style={{ marginBottom: nextGrade ? '16px' : '0' }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }} className="text-foreground">
                  <currentGrade.icon size={16} />
                  {currentGrade.name}
                </div>
                <div style={{ 
                  fontSize: '13px',
                  lineHeight: '1.4'
                }} className="text-muted-foreground">
                  {currentGrade.description}
                </div>
              </div>

              {/* 다음 등급 정보 */}
              {nextGrade && (
                <div>
                  <div style={{ 
                    fontSize: '12px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }} className="text-muted-foreground">
                    <span>Next</span>
                    <ChevronRight size={12} />
                    <nextGrade.icon size={14} />
                    <span style={{ 
                      fontSize: '13px',
                      fontWeight: '600'
                    }} className="text-foreground">
                      {nextGrade.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
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
          <h1 style={{
            fontSize: '20px',
            fontWeight: '700',
            margin: 0,
            color: 'hsl(var(--foreground))'
          }}>
            ReadySet
          </h1>
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
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '12px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--muted))'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}>
            {/* 프로필 이미지 */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              김
            </div>
            
            {/* 이름/역할 */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                lineHeight: '1.2'
              }} className="text-foreground">
                김마케터
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
          </div>
        </div>
      </header>
    </div>
  )
}