import { test } from './fixtures'

// ─────────────────────────────────────────────────────────────────────────────
// 권한 테스트 — AREA=AUTH
// HARD RULE: admin/marketer/agency/client 전부 skip.
//   이번 라운드는 단일 Admin 세션(사용자가 미리 로그인)만 사용하며, 계정 전환이
//   불가하다. 로그아웃도 금지되어 역할 전환 테스트를 수행할 수 없다.
// ─────────────────────────────────────────────────────────────────────────────

test('AUTH-001 @minor admin/marketer 권한', async () => {
  test.skip(true, '권한별 테스트 이번 라운드 skip — 단일 Admin 세션, 계정 전환/로그아웃 불가')
})
test('AUTH-002 @minor agency 권한', async () => {
  test.skip(true, '권한별 테스트 이번 라운드 skip — 단일 Admin 세션, 계정 전환/로그아웃 불가')
})
test('AUTH-003 @minor client 권한', async () => {
  test.skip(true, '권한별 테스트 이번 라운드 skip — 단일 Admin 세션, 계정 전환/로그아웃 불가')
})
