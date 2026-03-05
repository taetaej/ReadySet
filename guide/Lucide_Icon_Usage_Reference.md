# Lucide 아이콘 사용 현황 정리

## 문서 정보
- **작성일**: 2026-03-05
- **버전**: v2.0
- **목적**: 전체 화면에서 사용된 아이콘의 위치, 크기, 색상 정리

---

## 아이콘 사용 원칙

### 크기 체계
- **12px**: 매우 작은 UI 요소 (정렬 아이콘, 확장 화살표)
- **14px**: 작은 버튼, 뱃지 내부, 인라인 아이콘
- **16px**: 기본 버튼, 네비게이션, 일반 UI
- **18px**: 중요 액션 버튼, 헤더 버튼
- **20px**: 스코어카드, 강조 요소
- **24px**: 프로필, 대형 UI 요소

### 색상 체계
- **foreground**: 기본 아이콘 색상
- **muted-foreground**: 보조 정보, 비활성 상태
- **primary**: 강조, 활성 상태
- **primary-foreground**: Primary 배경 위의 아이콘
- **destructive**: 삭제, 에러 관련
- **background**: 반전 색상 (다크 배경 위)

---

## 1. Global Navigation Bar (GNB)

### 1.1 알림 & 등급 영역

| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| Bell | Floating Alert Bar | 16px | primary-foreground | 알림 아이콘 |
| Zap | 등급 툴팁 | 16px | foreground | Slot-In Ready 등급 |
| Activity | 등급 툴팁 | 16px | foreground | Active Slotter 등급 |
| Target | 등급 툴팁 | 16px | foreground/primary-foreground | Strategy Builder 등급 |
| Award | 등급 툴팁 | 16px | foreground | Solution Expert 등급 |
| Crown | 등급 툴팁 | 16px | foreground | Master Architect 등급 |
| Star | 등급 툴팁 | 16px | foreground | ReadySet Visionary 등급 |
| ChevronRight | 등급 툴팁 (Next) | 12px | muted-foreground | 다음 등급 화살표 |

### 1.2 프로필 & 테마
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| Sun | 다크모드 토글 | 18px | foreground | 라이트 모드 아이콘 |
| Moon | 다크모드 토글 | 18px | foreground | 다크 모드 아이콘 |
| ChevronDown | 프로필 드롭다운 | 16px | muted-foreground | 드롭다운 화살표 |
| LogOut | 프로필 메뉴 | 16px | foreground | 로그아웃 버튼 |

---

## 2. Sidebar

### 2.1 네비게이션
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| LayoutGrid | SlotBoard 링크 | 16px | foreground | SlotBoard 아이콘 |
| Archive | Slot 항목 | 16px | foreground | Slot 폴더 아이콘 |
| ChevronRight | 폴더 확장 | 12px | foreground | 폴더 확장/축소 |
| Hexagon | 솔루션 항목 | 16px | primary (fill) | 솔루션 아이콘 |

### 2.2 Support Section
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| BookOpen | User Guide 버튼 | 14px | muted-foreground | 가이드 아이콘 |
| FileText | Platform Overview 버튼 | 14px | muted-foreground | 문서 아이콘 |

---

## 3. Reach Caster - 결과 화면

### 3.1 헤더 영역
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| Scale | Ratio Finder 뱃지 | 14px | background | 분석 모듈 아이콘 |
| Target | Reach Predictor 뱃지 | 14px | background | 분석 모듈 아이콘 |
| SearchCheck | 타겟 GRP 버튼 | 14px | foreground | 타겟 상세 보기 |
| Share2 | 공유 버튼 | 18px | foreground | 공유 메뉴 |
| Link2 | 공유 드롭다운 | 16px | foreground | 링크 복사 |
| FileSpreadsheet | 공유 드롭다운 | 16px | foreground | Excel 내보내기 |
| FileText | 공유 드롭다운 | 16px | foreground | PDF 내보내기 |
| Info | 정보 버튼 | 18px | foreground | 시나리오 정보 |
| MoreVertical | 메뉴 버튼 | 18px | foreground | 컨텍스트 메뉴 |
| Copy | 메뉴 드롭다운 | 14px | foreground | 복제 |
| ArrowRightLeft | 메뉴 드롭다운 | 14px | foreground | 이동 |
| Trash2 | 메뉴 드롭다운 | 14px | foreground | 삭제 |

### 3.2 차트 & 데이터 영역
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| ThumbsUp | Optimal Point 마커 | 14px | primary | 최적 지점 표시 |
| Smartphone | 매체 비중 표시 | 14px | muted-foreground | Digital 매체 |
| Tv | 매체 비중 표시 | 14px | muted-foreground | TVC 매체 |
| Users | 모집단 정보 | 16px | muted-foreground | 모집단 아이콘 |
| Info | 모집단 툴팁 | 14px | muted-foreground | 정보 툴팁 |
| Database | DataShot CTA | 16px | foreground | 데이터베이스 |
| ArrowRight | DataShot CTA | 16px | foreground | 이동 화살표 |

### 3.3 스코어카드 (Reach Predictor)
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| Users | 예상 도달률 카드 | 20px | 차콜 그레이 | 도달률 아이콘 |
| Repeat | 예상 빈도 카드 | 20px | 차콜 그레이 | 빈도 아이콘 |
| Target | 예상 GRP 카드 | 20px | 차콜 그레이 | GRP 아이콘 |
| Coins | 평균 CPM 카드 | 20px | 차콜 그레이 | 비용 아이콘 |

---

## 4. Reach Caster - 시나리오 목록

### 4.1 컨트롤 영역
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| Plus | New Scenario 버튼 | 16px | primary-foreground | 생성 버튼 |
| List | 뷰 토글 | 16px | foreground | 리스트 뷰 |
| Calendar | 뷰 토글 | 16px | foreground | 타임라인 뷰 |
| ArrowRightLeft | 일괄 이동 버튼 | 16px | foreground | 이동 |
| Trash2 | 일괄 삭제 버튼 | 16px | destructive-foreground | 삭제 |
| Search | 검색 버튼/필드 | 16px | foreground/muted-foreground | 검색 |
| X | 검색 초기화 | 14px | muted-foreground | 초기화 |
| Filter | 필터 버튼 | 16px | foreground | 필터 |

### 4.2 테이블 영역
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| ChevronUp | 정렬 (오름차순) | 14px | foreground | 정렬 표시 |
| ChevronDown | 정렬 (내림차순) | 14px | foreground | 정렬 표시 |
| Scale | 분석 모듈 (RF) | 14px | background | Ratio Finder |
| Target | 분석 모듈 (RP) | 14px | background | Reach Predictor |
| Users | 타겟 GRP (전체) | 14px | muted-foreground | 전체 타겟 |
| User | 타겟 GRP (세그먼트) | 14px | muted-foreground | 세그먼트 타겟 |
| MoreVertical | 컨텍스트 메뉴 | 16px | foreground | 메뉴 |
| Copy | 메뉴 항목 | 14px | foreground | 복제 |
| ArrowRightLeft | 메뉴 항목 | 14px | foreground | 이동 |
| Trash2 | 메뉴 항목 | 14px | foreground | 삭제 |

### 4.3 타임라인 뷰
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| ChevronLeft | 이전 기간 | 14px | foreground | 이전 |
| ChevronRight | 다음 기간 | 14px | foreground | 다음 |

### 4.4 페이지네이션
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| ChevronLeft | 이전 페이지 | 14px | foreground | 이전 |
| ChevronRight | 다음 페이지 | 14px | foreground | 다음 |
| ChevronLeft×2 | 첫 페이지 | 14px | foreground | 처음으로 |
| ChevronRight×2 | 마지막 페이지 | 14px | foreground | 끝으로 |

---

## 5. Reach Caster - Slot 관련

### 5.1 Slot Header
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| MoreVertical | 메뉴 버튼 | 16px | foreground | Slot 메뉴 |
| Edit | 메뉴 항목 | 14px | foreground | 편집 |
| Trash2 | 메뉴 항목 | 14px | foreground | 삭제 |
| Info | 정보 버튼 | 16px | foreground | Slot 정보 |

### 5.2 Slot Card
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| Archive | Slot 타이틀 | 18px | muted-foreground | Slot 아이콘 |
| CheckCircle | 선택 표시 | 16px | primary-foreground | 선택됨 |
| Clock | 수정일 | 12px | muted-foreground | 시간 |
| MoreVertical | 메뉴 버튼 | 16px | foreground | 메뉴 |
| Edit | 메뉴 항목 | 14px | foreground | 편집 |
| Trash2 | 메뉴 항목 | 14px | foreground | 삭제 |

---

## 6. Reach Caster - 시나리오 생성

### 6.1 스텝 네비게이션
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| Check | 완료 단계 | 16px | primary-foreground | 완료 표시 |
| ChevronLeft | 이전 버튼 | 16px | foreground | 이전 단계 |
| ChevronRight | 다음 버튼 | 16px | primary-foreground | 다음 단계 |
| X | 취소 버튼 | 16px | foreground | 취소 |
| Clock | 대기 상태 | 16px | muted-foreground | 대기 중 |
| CheckCircle | 완료 상태 | 16px | primary | 완료 |
| AlertCircle | 에러 상태 | 16px | destructive | 에러 |

### 6.2 Step 1 (기본 정보)
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| ArrowRight | 분석 모듈 선택 | 16px | foreground | 화살표 |
| ChevronRight | 분석 모듈 선택 | 16px | foreground | 선택 화살표 |
| Scale | Ratio Finder 카드 | 20px | foreground | RF 아이콘 |
| Target | Reach Predictor 카드 | 20px | foreground | RP 아이콘 |

### 6.3 Step 2 (매체 설정)
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| X | 다이얼로그 닫기 | 16px | foreground | 닫기 |
| Calendar | 기간 선택 | 16px | foreground | 달력 |
| Users | 타겟 선택 | 16px | foreground | 타겟 |
| Smartphone | Digital 매체 | 16px | foreground | Digital |
| Tv | TVC 매체 | 16px | foreground | TVC |
| ArrowRight | 매체 추가 | 16px | foreground | 추가 |
| ChevronRight | 매체 상세 | 16px | foreground | 상세 |
| Info | 리치커브 설정 | 16px | foreground | 정보 |
| Plus | 매체 추가 | 16px | foreground | 추가 |
| Minus | 매체 제거 | 16px | foreground | 제거 |
| ListPlus | 매체 일괄 추가 | 16px | foreground | 일괄 추가 |

---

## 7. Workspace Layout

### 7.1 검색 & 필터
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| Search | 검색 버튼 | 16px | foreground | 검색 |
| X | 검색 초기화 | 16px | foreground | 초기화 |
| Filter | 필터 버튼 | 16px | foreground | 필터 |
| ChevronDown | 드롭다운 | 16px | foreground | 펼치기 |

### 7.2 뷰 모드
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| LayoutGrid | 그리드 뷰 | 16px | foreground | 그리드 |
| List | 리스트 뷰 | 16px | foreground | 리스트 |

### 7.3 상태 표시
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| CheckCircle | 완료 상태 | 16px | primary | 완료 |
| AlertCircle | 에러 상태 | 16px | destructive | 에러 |
| Trash2 | 삭제 버튼 | 16px | foreground | 삭제 |

### 7.4 페이지네이션
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| ChevronLeft | 이전 페이지 | 16px | foreground | 이전 |
| ChevronRight | 다음 페이지 | 16px | foreground | 다음 |

---

## 8. 폴더 관리

### 8.1 Create/Edit Folder
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| Search | 광고주 검색 | 16px | foreground | 검색 |
| ChevronDown | 드롭다운 | 16px | foreground | 펼치기 |
| AlertCircle | 에러 메시지 | 16px | destructive | 에러 |
| CheckCircle | 성공 메시지 | 16px | primary | 성공 |
| X | 다이얼로그 닫기 | 16px | foreground | 닫기 |

---

## 9. 상세 테이블

### 9.1 Ratio Finder Detail Table
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| ChevronRight | 카테고리 확장 | 14px | foreground | 확장 |
| Info | Effective Impression 툴팁 | 14px | muted-foreground | 정보 |

### 9.2 Reach Predictor Detail Table
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| ChevronRight | 카테고리 확장 | 14px | foreground | 확장 |
| Calendar | 개별 기간 | 14px | muted-foreground | 기간 |
| Users | 개별 타겟 | 14px | muted-foreground | 타겟 |
| Info | Effective Impression 툴팁 | 14px | muted-foreground | 정보 |

---

## 10. 기타 컴포넌트

### 10.1 Date Range Picker
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| Calendar | 날짜 선택 버튼 | 16px | foreground | 달력 |

### 10.2 Page Header
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| Plus | 추가 버튼 | 16px | primary-foreground | 추가 |

### 10.3 Breadcrumb
| 아이콘 | 위치 | 크기 | 색상 | 용도 |
|--------|------|------|------|------|
| ChevronRight | 구분자 | 14px | muted-foreground | 구분 |

---

## 사용 빈도 통계

### 가장 많이 사용된 아이콘 (Top 10)
1. **ChevronRight** (16회) - 확장, 네비게이션, 구분자
2. **ChevronDown** (8회) - 드롭다운, 정렬
3. **ChevronLeft** (7회) - 이전, 뒤로가기
4. **MoreVertical** (7회) - 컨텍스트 메뉴
5. **Trash2** (7회) - 삭제
6. **Info** (6회) - 정보 툴팁
7. **Search** (5회) - 검색
8. **Target** (5회) - 분석 모듈, 등급, 타겟
9. **Users** (5회) - 타겟, 모집단, 스코어카드
10. **Copy** (4회) - 복제

### 크기별 사용 빈도
- **12px**: 8회 (작은 UI 요소)
- **14px**: 45회 (가장 많이 사용)
- **16px**: 62회 (기본 크기)
- **18px**: 6회 (중요 버튼)
- **20px**: 6회 (스코어카드, 강조)
- **24px**: 1회 (프로필)

### 색상별 사용 빈도
- **foreground**: 85회 (기본)
- **muted-foreground**: 32회 (보조)
- **primary-foreground**: 8회 (강조 배경 위)
- **background**: 4회 (반전)
- **destructive**: 3회 (삭제/에러)
- **primary**: 5회 (활성 상태)

---

## 디자인 가이드라인

### 1. 일관성 유지
- 같은 기능은 같은 아이콘 사용
- 같은 위치는 같은 크기 사용
- 같은 맥락은 같은 색상 사용

### 2. 크기 선택 기준
- 버튼 내부: 16px 기본, 중요도에 따라 18px
- 인라인 텍스트: 14px
- 확장/정렬: 12-14px
- 강조 요소: 18-20px

### 3. 색상 선택 기준
- 기본 UI: foreground
- 보조 정보: muted-foreground
- 활성/강조: primary
- 삭제/에러: destructive
- 반전 배경: background 또는 primary-foreground

### 4. 접근성
- 최소 크기: 12px (터치 타겟은 최소 44px)
- 명확한 대비: 색상만으로 의미 전달 금지
- 툴팁 제공: 아이콘만 있는 버튼은 툴팁 필수

---

## 향후 개선 사항

### 단기
- [ ] 아이콘 컴포넌트 래퍼 생성 (크기/색상 props)
- [ ] 아이콘 스타일 가이드 문서화
- [ ] 미사용 아이콘 정리

### 중기
- [ ] 아이콘 애니메이션 가이드
- [ ] 다크모드 아이콘 색상 최적화
- [ ] 아이콘 접근성 개선

### 장기
- [ ] 커스텀 아이콘 세트 제작
- [ ] 아이콘 자동 최적화 시스템
- [ ] 아이콘 사용 분석 대시보드
