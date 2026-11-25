import { ACCuration, ACMoveTargetSlot, ACConditionDef, ACTraitDef } from './types'

export const sampleACCurations: ACCuration[] = [
  {
    id: 1, name: '11월 신제품 런칭 매체 큐레이션', description: '신제품 런칭 캠페인 매체·상품 후보 탐색',
    industry: '화장품', industryMode: 'brand', brand: '설화수', promotionIncluded: true,
    startDate: '2026-12-01', endDate: '2026-12-31', purposes: ['awareness', 'conversion'],
    status: 'Completed',
    created: '2026-11-10 14:30:12', creator: '김미영', creatorId: 'kimmiyoung@mezzo.co.kr',
    completedAt: '2026-11-10 14:41:08', errorAt: null
  },
  {
    id: 2, name: '연말 프로모션 전환 큐레이션', description: '연말 시즌 전환 목적 매체 선별',
    industry: '패션', industryMode: 'direct', promotionIncluded: false,
    startDate: '2026-12-10', endDate: '2027-01-10', purposes: ['conversion'],
    status: 'Completed',
    created: '2026-11-09 09:15:40', creator: '이준혁', creatorId: 'leejunhyuk@mezzo.co.kr',
    completedAt: '2026-11-09 09:24:55', errorAt: null
  },
  {
    id: 3, name: '브랜드 인지도 확대 큐레이션', description: '인지·조회·트래픽 복합 목적',
    industry: '화장품', industryMode: 'brand', brand: '라네즈', promotionIncluded: true,
    startDate: '2026-12-05', endDate: '2027-02-05', purposes: ['traffic', 'awareness', 'view'],
    status: 'Completed',
    created: '2026-11-08 17:02:21', creator: '김미영', creatorId: 'kimmiyoung@mezzo.co.kr',
    completedAt: '2026-11-08 17:13:47', errorAt: null
  },
  {
    id: 4, name: '신규 앱 설치 유도 큐레이션', description: '앱 설치 전환 중심',
    industry: '게임', industryMode: 'direct', promotionIncluded: false,
    startDate: '2026-12-15', endDate: '2027-01-14', purposes: ['conversion', 'traffic'],
    status: 'Processing',
    created: '2026-11-16 10:05:03', creator: '박서연', creatorId: 'parksy@mezzo.co.kr',
    completedAt: null, errorAt: null
  },
  {
    id: 5, name: '영상 조회수 확대 큐레이션', description: '영상 광고 조회 중심',
    industry: '식품', industryMode: 'brand', brand: '비비고', promotionIncluded: true,
    startDate: '2026-12-20', endDate: '2027-01-19', purposes: ['view'],
    status: 'Processing',
    created: '2026-11-16 10:12:44', creator: '이준혁', creatorId: 'leejunhyuk@mezzo.co.kr',
    completedAt: null, errorAt: null
  },
  {
    id: 6, name: '봄 시즌 사전 탐색 큐레이션', description: '봄 시즌 대비 매체 탐색',
    industry: '패션', industryMode: 'direct', promotionIncluded: false,
    startDate: '2027-02-01', endDate: '2027-03-31', purposes: ['awareness'],
    status: 'Processing',
    created: '2026-11-16 10:20:18', creator: '박서연', creatorId: 'parksy@mezzo.co.kr',
    completedAt: null, errorAt: null
  },
  {
    id: 7, name: '리타겟팅 트래픽 큐레이션', description: '재방문 유도 트래픽',
    industry: '가전', industryMode: 'brand', brand: '삼성전자', promotionIncluded: false,
    startDate: '2026-12-01', endDate: '2026-12-31', purposes: ['traffic'],
    status: 'Pending',
    created: '2026-11-16 10:25:30', creator: '김미영', creatorId: 'kimmiyoung@mezzo.co.kr',
    completedAt: null, errorAt: null
  },
  {
    id: 8, name: '팝업스토어 참여 유도 큐레이션', description: '오프라인 연계 캠페인',
    industry: '식품', industryMode: 'direct', promotionIncluded: false,
    startDate: '2026-11-25', endDate: '2026-12-25', purposes: ['view', 'conversion'],
    status: 'Error',
    created: '2026-11-07 11:40:09', creator: '이준혁', creatorId: 'leejunhyuk@mezzo.co.kr',
    completedAt: null, errorAt: '2026-11-07 11:43:52'
  },
  {
    id: 9, name: '(복제) 11월 신제품 런칭 매체 큐레이션', description: '조건 변경 재생성',
    industry: '화장품', industryMode: 'brand', brand: '설화수', promotionIncluded: false,
    startDate: '2026-12-08', endDate: '2027-01-07', purposes: ['awareness', 'view', 'traffic', 'conversion'],
    status: 'Completed',
    created: '2026-11-06 16:20:00', creator: '김미영', creatorId: 'kimmiyoung@mezzo.co.kr',
    completedAt: '2026-11-06 16:31:26', errorAt: null
  },
  {
    id: 10, name: '여름 시즌 조회 큐레이션', description: '지난 시즌 복기용',
    industry: '패션', industryMode: 'direct', promotionIncluded: false,
    startDate: '2026-07-01', endDate: '2026-08-15', purposes: ['view'],
    status: 'Completed',
    created: '2026-06-20 09:00:00', creator: '박서연', creatorId: 'parksy@mezzo.co.kr',
    completedAt: '2026-06-20 09:12:31', errorAt: null
  },
  {
    id: 11, name: '게임 신작 사전예약 큐레이션', description: '사전예약 전환',
    industry: '게임', industryMode: 'brand', brand: '넷마블', promotionIncluded: true,
    startDate: '2026-12-12', endDate: '2027-01-11', purposes: ['conversion'],
    status: 'Error',
    created: '2026-11-05 13:10:44', creator: '박서연', creatorId: 'parksy@mezzo.co.kr',
    completedAt: null, errorAt: '2026-11-05 13:14:02'
  },
  {
    id: 12, name: '가전 겨울 세일 큐레이션', description: '겨울 세일 시즌',
    industry: '가전', industryMode: 'direct', promotionIncluded: true,
    startDate: '2026-12-18', endDate: '2027-01-17', purposes: ['traffic', 'conversion'],
    status: 'Completed',
    created: '2026-11-04 08:45:12', creator: '이준혁', creatorId: 'leejunhyuk@mezzo.co.kr',
    completedAt: '2026-11-04 08:56:40', errorAt: null
  }
]

/** 이동 대상 Slot (동일 광고주의 다른 Slot) */
export const AC_MOVE_TARGET_SLOTS: ACMoveTargetSlot[] = [
  { id: 'slot-1', name: 'CJ올리브영 2026 상반기', visibility: 'Internal' },
  { id: 'slot-2', name: 'CJ올리브영 브랜드 캠페인', visibility: 'Private' },
  { id: 'slot-3', name: 'CJ올리브영 파트너 공유', visibility: 'Shared' }
]

/** 생성 화면: 현재 Slot 광고주(CJ올리브영) 하위 브랜드 (예시) */
export const AC_SAMPLE_BRANDS: { name: string; industry: string }[] = [
  { name: '올리브영 PB 바이오힐보', industry: '화장품' },
  { name: '올리브영 PB 웨이크메이크', industry: '화장품' },
  { name: '올리브영 PB 브링그린', industry: '화장품' },
  { name: '올리브영 헬스플러스', industry: '건강식품' },
  { name: '올리브영 온라인몰', industry: '이커머스' },
]

/**
 * 생성 화면: 현재 Slot (예시)
 * Shared Slot 동작(프로모션 "포함" 비활성)은 URL에 `?slot=shared`를 붙여 확인한다.
 */
export const AC_CREATE_SLOT = {
  id: 'SLT001',
  title: 'CJ올리브영 2026 하반기',
  visibility: 'Internal' as 'Private' | 'Internal' | 'Shared'
}

/**
 * Step 2 조건 카탈로그 (예시). 라벨 카탈로그 확정 전까지 사용하는 임시 목록. 설명 문구도 예시이며 라벨 정의와 함께 확정
 * 순서 = 카탈로그 순서 (값 표시 순서, 후속 추천 우선순위, 요약 순서에 사용)
 */
export const AC_CONDITION_CATALOG: ACConditionDef[] = [
  { id: 'format', label: '소재 포맷', description: '광고 소재의 형태입니다.', group: 'attribute', keys: ['영상', '동영상', '이미지', '배너', '소재'], values: ['동영상', '이미지', '캐러셀', '카탈로그', '메시지'] },
  { id: 'buy', label: '구매 방식', description: '광고 상품을 구매하는 방식입니다.', group: 'attribute', keys: ['보장', '성과', '구매'], values: ['보장형', '성과형'] },
  { id: 'placement', label: '매체·지면', description: '광고가 노출되는 매체와 지면입니다.', group: 'attribute', keys: ['매체', '지면', '카카오', '네이버', '유튜브', 'youtube', '인스타', 'instagram', '틱톡', 'tiktok'], values: ['YouTube', 'Instagram', 'TikTok', '카카오톡 비즈보드', '네이버 메인'] },
  { id: 'budget', label: '예산', description: '캠페인에 집행할 광고 예산입니다.', group: 'attribute', keys: ['예산', '금액', '만원', '원'], values: [], money: true },
  { id: 'video', label: '영상 형식', description: '동영상 소재의 길이와 노출 방식입니다.', group: 'attribute', keys: ['영상', '범퍼', '스킵', '숏폼', '쇼츠'], values: ['범퍼(6초)', '스킵 불가', '스킵 가능', '숏폼 세로형'] },
  { id: 'device', label: '디바이스', description: '광고가 노출되는 기기입니다.', group: 'attribute', keys: ['모바일', 'mo', 'pc', '디바이스'], values: ['모바일', 'PC'] },
  { id: 'target', label: '타게팅 지원', description: '광고 상품이 제공하는 타게팅 방식입니다.', group: 'attribute', keys: ['타게팅', '타깃', '타겟', '관심사', '리타겟팅', '지역'], values: ['데모', '관심사', '리타겟팅', '지역'] },
  { id: 'billing', label: '과금 방식', description: '광고비가 청구되는 기준입니다.', group: 'attribute', keys: ['과금', 'cpm', 'cpc', 'cpv', 'cpa', 'cpt'], values: ['CPM', 'CPC', 'CPV', 'CPA', 'CPT'] },
  { id: 'guarantee', label: '보장 형태', description: '보장형 상품이 약속하는 노출 조건입니다.', group: 'attribute', keys: ['기간 보장', '노출 보장', '도달', '빈도'], values: ['기간 보장', '노출 보장', '도달·빈도 예약'] },
  { id: 'trend', label: '단가 추세', description: '최근 집행 단가의 변화 흐름입니다.', group: 'efficiency', keys: ['단가', '추세', '하락', '내려'], values: ['단가가 내려가는 곳', '단가가 안정적인 곳'] },
  { id: 'type', label: '단가·효율 유형', description: '캠페인 목적 지표로 평가한 단가·효율 특성입니다.', group: 'efficiency', keys: ['가성비', '프리미엄', '물량', '효율'], values: ['가성비 좋은 곳', '프리미엄 매체', '물량 확보가 쉬운 곳'] },
  { id: 'exp', label: '집행 경험', description: '같은 업종에서 집행한 이력이 많은지 여부입니다.', group: 'efficiency', keys: ['경험', '집행'], values: ['집행 경험이 많은 곳'] },
  { id: 'scale', label: '매체 규모', description: '매체의 이용자 규모와 성격입니다.', group: 'efficiency', keys: ['대형', '규모', '버티컬'], values: ['대형 매체', '버티컬 매체'] },
  { id: 'core', label: '코어 유저 보유', description: '자주 방문하는 충성 이용자층이 있는지 여부입니다.', group: 'efficiency', keys: ['코어', '충성', '리텐션'], values: ['코어 유저가 있는 매체'] },
]

/**
 * 생성 화면에서 상세 선별 기준 표·기준 추가에 쓰는 속성 (정의서 4.0).
 * efficiency 항목은 결과 화면 호환용으로 카탈로그에 남기고, 생성 화면에서는 특성(AC_TRAIT_CATALOG)으로 다룬다.
 */
export const AC_ATTRIBUTE_CATALOG: ACConditionDef[] = AC_CONDITION_CATALOG.filter(c => c.group === 'attribute')

/**
 * Step 2 특성 카탈로그 (예시, 데이터팀 확정 필요). 캠페인 설명에서만 파싱하고 읽기 전용으로 표시 (정의서 4.4)
 * 순서 = 화면 표시·요약 순서
 */
export const AC_TRAIT_CATALOG: ACTraitDef[] = [
  { id: 'cost-down', label: '단가 하락 추세', kind: 'media', pattern: /단가[^.,\n]{0,6}(하락|내려|낮아)/ },
  { id: 'value', label: '가성비 중심', kind: 'media', pattern: /가성비/ },
  { id: 'premium', label: '프리미엄 매체', kind: 'media', pattern: /프리미엄/ },
  { id: 'volume', label: '물량 확보', kind: 'media', pattern: /물량/ },
  { id: 'experienced', label: '집행 경험 많음', kind: 'media', pattern: /집행\s*경험|경험이\s*많/ },
  { id: 'large', label: '대형 매체', kind: 'media', pattern: /대형/ },
  { id: 'vertical', label: '버티컬 매체', kind: 'media', pattern: /버티컬/ },
  { id: 'core', label: '코어 유저 보유', kind: 'media', pattern: /코어\s*유저|충성\s*(고객|유저|이용자)/ },
  { id: 'launch', label: '신제품 출시', kind: 'campaign', pattern: /신제품|신상품|(신규|새로운)?\s*출시|런칭|론칭/ },
  { id: 'renewal', label: '리뉴얼', kind: 'campaign', pattern: /리뉴얼/ },
  { id: 'black-friday', label: '블랙프라이데이', kind: 'campaign', pattern: /블랙\s*프라이데이|블프/i },
  { id: 'year-end', label: '크리스마스·연말', kind: 'campaign', pattern: /크리스마스|연말|홀리데이/ },
  { id: 'holiday', label: '명절', kind: 'campaign', pattern: /명절|추석|설날|설 연휴/ },
  { id: 'weekend', label: '주말 집중', kind: 'campaign', pattern: /주말/ },
  { id: 'promotion', label: '프로모션 진행', kind: 'campaign', pattern: /할인|세일|이벤트|프로모션/ },
  { id: 'repurchase', label: '재구매 유도', kind: 'campaign', pattern: /재구매|리텐션|재방문/ },
]

/** 첨부 파일을 읽은 것으로 가정하는 예시 브리프 내용 (SpinX 연동 전 모의) */
export const AC_SAMPLE_BRIEF_TEXT = '카카오·네이버 보장형으로 진행. 숏폼 영상 소재, 예산 2~3천만 원, 20대 여성 위주'
