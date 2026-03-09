
# IA

# DataShot (Phase 1) IA

본 IA는 ReadySet 내 DataShot 솔루션의 구조를 정의하며, 데이터셋 목록, 생성, 상세에 이르는 화면 구성과 권한 기준을 명확히 하기 위한 가이드라인입니다.

## IA 테이블 (원본 구조 유지)

### Dataset list

| 1depth Menu | 1depth format | 2depth Menu | 2depth format | 3depth Menu | 3depth format | 4depth Menu | 4depth format | 5depth Menu | 5depth format | Component/Features | Description | User Role | Data Isolation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DataShot | page | 데이터셋 목록 | page |  |  |  |  |  |  | (card) 데이터셋<br>(toggle) 뷰 모드 변환 | 해당 Slot 내 존재하는 시나리오 목록 | All |  |
|  |  |  |  | 데이터셋 | card |  |  |  |  | (checkbox) 데이터셋 선택 체크박스 | 데이터셋 컨텍스트 표시 카드 | All |  |
|  |  |  |  |  |  | 데이터 상세 | page |  |  |  |  | All |  |
|  |  |  |  |  |  |  |  | 데이터셋 헤더 | section | (card) 데이터셋 컨텍스트 (설정 정보) + 조회조건 | 데이터셋 컨텍스트 (설정 정보) + 조회조건 | All |  |
|  |  |  |  |  |  |  |  | 데이터셋 콘텐츠 | section | (chart) 추이/비중 차트<br>(chart) 통계 요약<br>(chart) 산점도<br>(table) | 조회 데이터 기반 시각화<br>조회 Raw 데이터 | All |  |
|  |  |  |  |  |  |  |  | 내보내기 | btn | csv 파일 내보내기 요청 |  | All |  |

### 데이터셋 목록 전역 기능

| 기능 | format | Component/Features | User Role |
|---|---|---|---|
| 검색 | form | (inputfield) 데이터셋 검색 | All |
| 정렬 | layer | (btn_icon) 정렬<br>(dropdown) 데이터셋 정렬 항목 선택 | All |
| 페이지네이션 | action | (dropdown) 페이지 수 옵션<br>(navigation) 페이지 번호 | All |
| export | btn | (btn) CSV 파일 내보내기 | All |

### Dataset Create

| 1depth Menu | format | 2depth Menu | format | 3depth Menu | format | Component/Features | Description | User Role |
|---|---|---|---|---|---|---|---|---|
| DataShot | page | 데이터셋 생성 | page |  |  |  | 조회 조건 입력 후 데이터셋을 생성하는 화면 | Admin, Marketer |
|  |  |  |  | 기본 정보 | form | (inputfield) 데이터셋명<br>(textarea) 설명 | 데이터셋 식별 정보 입력 | Admin, Marketer |
|  |  |  |  | 조회 조건 선택 | form | ⚠ 매체별로 상이 | 조회 조건 설정 | Admin, Marketer |