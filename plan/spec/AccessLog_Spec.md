# 접속 이력 (Access Log) 기능 스펙

---

## 1. 배경 및 목적

- **정책 근거**: SSO를 사용하더라도 각 시스템별로 접속 기록은 별도로 보관·관리되어야 한다. (그룹 보안정책)
- **적용 항목**: 보안성 검토 취약/자료요청 항목 전체 (접속 기록, 접속 이력 조회, 마지막 접속 이력)
- **대상**: ReadySet 포함, 이후 연동 예정 시스템 전체

---

## 2. 접속 식별 기준

| 항목 | 설명 |
|------|------|
| 식별 단위 | Cognito에서 발급하는 **JTI(JWT ID)** 값 |
| 새 접속 판정 | 새로운 JTI 값이 최초 수신될 때 |
| 동일 세션 판정 | 동일 JTI로 요청이 계속 들어오는 동안 (새로고침 포함) |
| IP 기록 시점 | 새 JTI 최초 수신 시점의 클라이언트 IP |

> **참고**: 같은 JTI 세션 내에서 IP가 변경될 수 있음 (Wi-Fi↔LTE 전환, VPN 등). IP는 접속 시작 시점 기준으로 기록한다.

---

## 3. 저장 데이터 구조

| 필드 | 타입 | 설명 |
|------|------|------|
| id | PK | 레코드 식별자 |
| user_id | string | 사용자 식별자 |
| jti | string | Cognito JWT ID (내부 참조용, UI 미노출) |
| started_at | timestamp | 접속 시작 시점 (JTI 최초 수신) |
| last_active_at | timestamp | 마지막 활동 시점 (동일 JTI 마지막 요청) |
| ip_address | string | 접속 시작 시점 클라이언트 IP |
| system | string | 시스템 구분 (예: "readyset") |

---

## 4. 보관 정책

- **보관 기간**: 최근 30일
- 30일 초과 데이터는 자동 삭제 또는 아카이빙 (운영 정책에 따라 결정)

---

## 5. 화면 구성

### 5-1. GNB 프로필 드롭다운

프로필 클릭 시 드롭다운 메뉴 구성:

```
┌─────────────────────┐
│ 최근 접속            │  ← 라벨 (text-muted)
│ 2026.07.13 09:42    │  ← 접속 시작 시점
│ IP 192.168.1.***    │  ← IP (마지막 옥텟 마스킹)
├─────────────────────┤
│ 🕐 접속 이력         │  ← 클릭 → /access-log
├─────────────────────┤
│ 🚪 Log Out          │
└─────────────────────┘
```

- IP는 마지막 옥텟을 `***`으로 마스킹하여 표시
- "접속 이력" 클릭 시 `/access-log` 페이지로 이동

### 5-2. 접속 이력 페이지 (`/access-log`)

**레이아웃**: AppLayout (GNB + Sidebar + Breadcrumb + Footer) 동일 적용

**Breadcrumb**: `SlotBoard > 접속 이력`

**페이지 헤더**:
- 타이틀: "접속 이력"
- 설명: "최근 30일간의 접속 이력이 보여집니다."

**테이블 컬럼**:

| 접속 시작 | 마지막 활동 | IP 주소 |
|-----------|------------|---------|
| 2026-07-13 09:42 | 2026-07-13 18:30 | 192.168.1.105 |

- 접속 시작: JTI 최초 수신 시점 (사용자 관점 "로그인 시점")
- 마지막 활동: 동일 JTI로 마지막 요청이 기록된 시점
- IP 주소: 접속 시작 시점의 IP (전체 노출)

**페이지네이션**: 기존 SlotDetail/WorkspaceLayout과 동일한 컴포넌트
- 페이지당 표시: 10 / 20 / 50 선택
- 기본값: 20
- 페이지 네비게이션: 첫/이전/번호/다음/마지막

---

## 6. 사용자에게 노출하지 않는 정보

- JTI 값 자체
- 세션 식별 메커니즘
- 토큰 관련 기술 용어

---

## 7. API 요구사항 (백엔드)

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/access-log` | GET | 접속 이력 목록 조회 (페이징, 최근 30일) |
| `/api/access-log/latest` | GET | 최근 접속 정보 1건 (GNB 표시용) |

### GET /api/access-log

**Query Parameters**:
- `page` (number, default: 1)
- `size` (number, default: 20, max: 50)

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "startedAt": "2026-07-13T09:42:15Z",
      "lastActiveAt": "2026-07-13T18:30:02Z",
      "ipAddress": "192.168.1.105"
    }
  ],
  "pagination": {
    "page": 1,
    "size": 20,
    "total": 35,
    "totalPages": 2
  }
}
```

### GET /api/access-log/latest

**Response**:
```json
{
  "startedAt": "2026-07-13T09:42:15Z",
  "ipAddress": "192.168.1.105"
}
```

---

## 8. 접속 기록 생성 로직 (백엔드)

```
요청 수신 시:
1. JWT에서 JTI 추출
2. DB에서 해당 user_id + jti 조합 조회
   - 존재하지 않음 → INSERT (started_at = now, last_active_at = now, ip = 요청 IP)
   - 존재함 → UPDATE last_active_at = now
```

---

## 9. 프론트엔드 구현 현황

| 항목 | 파일 | 상태 |
|------|------|------|
| GNB 프로필 메뉴 | `src/components/layout/GlobalNavBar.tsx` | ✅ Mock 완료 |
| 접속 이력 페이지 | `src/components/layout/AccessLog.tsx` | ✅ Mock 완료 |
| 라우팅 | `src/App.tsx` → `/access-log` | ✅ 완료 |

> 현재는 Mock 데이터 기반. API 연동 시 `GET /api/access-log`, `GET /api/access-log/latest` 호출로 전환 필요.
