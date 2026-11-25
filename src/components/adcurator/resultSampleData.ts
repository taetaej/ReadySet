// Ad Curator 큐레이션 결과 샘플 데이터 (데이터사이언티스트 결과 연동 전 화면 확인용)
// - 매체명·상품명은 BudgetOpt 2.0 카탈로그(boMediaData)의 실제 표기를 씀
// - 상품 설명·결론 구절·근거·점수·순위는 설명을 위한 예시 값임 (실제 데이터 아님)
// - 변형 A~D로 화면 분기를 확인함 (design.md "샘플 데이터")
import { boMediaData } from '../budgetoptimizer/constants'
import { sampleACCurations } from './sampleData'
import type { ACCuration, ACPurpose } from './types'
import type {
  ACAltCard,
  ACAppliedCondition,
  ACAttributeKey,
  ACCurationResult,
  ACEvalAxis,
  ACFitGroup,
  ACProductAttributes,
  ACPromotion,
  ACResultItem
} from './resultTypes'

// ---------- 상품 원천 (매체, 상품명, 상품 설명) ----------

type ProductSeed = [media: string, product: string, description: string]

const PRODUCTS: ProductSeed[] = [
  // Best Fit 후보 0~23
  ['kakao 모먼트', '카카오톡비즈보드_전환_카카오톡채널_CPA', '카카오톡 채팅 목록 최상단 배너'],
  ['NAVER 성과형 DA', '웹사이트 전환_네이버 메인_CPC', '네이버 메인 노출 성과형 디스플레이'],
  ['Google Ads', '건너뛸 수 없는 인스트림 광고_CPM', 'YouTube 영상 시청 중 건너뛸 수 없는 광고'],
  ['Meta', '경매_트래픽_랜딩 페이지 조회수 극대화_facebook', '페이스북 피드에서 랜딩 페이지로 연결'],
  ['TikTok', '웹사이트 전환_전환_TikTok_동영상', '틱톡 추천 피드 사이 세로형 영상'],
  ['Google Ads', '퍼포먼스 맥스 캠페인_CPA', '검색·YouTube·디스플레이 통합 노출'],
  ['NAVER 성과형 DA', '쇼핑 프로모션_쇼핑 영역_CPC', '네이버 쇼핑 검색 결과 상품 노출'],
  ['kakao 모먼트', '디스플레이_전환_픽셀&SDK_CPC', '카카오 서비스 전반 디스플레이 지면'],
  ['Meta', '경매_판매_전환값 극대화_instagram', '인스타그램 피드·스토리 쇼핑 광고'],
  ['Google Ads', '디맨드젠 동영상 광고_CPA', 'YouTube·Discover 피드 영상 광고'],
  ['NAVER 보장형 DA', 'M_메인_스마트채널_배너_동영상_확장형_CPM', '네이버 모바일 메인 상단 확장형 영상'],
  ['TikTok', '판매_전환_Pangle&TikTok_카탈로그 애즈', '틱톡·팽글 지면 카탈로그 상품 노출'],
  ['kakao 모먼트', '상품 카탈로그_전환_CPC', '카카오 지면 상품 카탈로그 노출'],
  ['Meta', '경매_트래픽_링크 클릭수 극대화_facebook&instagram', '페이스북·인스타그램 피드 링크 광고'],
  ['Google Ads', '반응형 디스플레이 광고_CPA', 'Google 디스플레이 네트워크 배너'],
  ['NAVER 성과형 DA', '카탈로그 판매_네이버 메인_CPC', '네이버 메인 카탈로그 상품 노출'],
  ['Targetpick', 'TargetPick Video', '제휴 앱 지면 동영상 광고'],
  ['SMR', '콘텐츠 타겟팅', '방송 클립 영상 앞 콘텐츠 타겟 광고'],
  ['Google Ads', '범퍼애드_CPM', 'YouTube 영상 앞 6초 범퍼 광고'],
  ['NAVER 보장형 DA', 'M_브랜드검색_라이트형(신)_검색_이미지_썸네일형_CPT', '네이버 모바일 브랜드 검색 결과 상단'],
  ['kakao 모먼트', '동영상_조회_CPV', '카카오 서비스 지면 동영상 광고'],
  ['Meta', '경매_인지도_ThruPlay 조회 극대화_facebook&instagram', '페이스북·인스타그램 릴스 영상 광고'],
  ['TikTok', '트래픽_랜딩 페이지 조회_TikTok_동영상', '틱톡 피드 영상에서 랜딩 페이지 연결'],
  ['kakao 모먼트', '카카오톡 비즈보드 채팅탭 CPT', '카카오톡 채팅탭 상단 기간 보장 배너'],
  // Good Fit 후보 24~49
  ['NAVER 성과형 DA', '인지도 및 트래픽_밴드_CPC', '네이버 밴드 피드 사이 배너'],
  ['NAVER 성과형 DA', '웹사이트 전환_스마트채널 (패밀리 매체)_CPC', '네이버 패밀리 매체 상단 띠배너'],
  ['Google Ads', '일반 디스플레이 광고_CPM', 'Google 디스플레이 네트워크 이미지 배너'],
  ['Google Ads', 'CPM 마스트헤드_CPM', 'YouTube 홈 최상단 마스트헤드'],
  ['Meta', '예약_인지도_노출_instagram', '인스타그램 피드 예약형 노출'],
  ['Meta', '경매_참여_게시물 참여 극대화_facebook', '페이스북 피드 게시물 참여 광고'],
  ['TikTok', '도달_도달_TikTok_캐러셀 애즈', '틱톡 피드 캐러셀 이미지'],
  ['TikTok', '커뮤니티 상호작용_팔로워_TikTok_동영상', '틱톡 피드 팔로워 확보 영상'],
  ['kakao 모먼트', '포커스 보드_도달_CPT', '카카오 서비스 상단 포커스 보드'],
  ['kakao 모먼트', '프로필 풀뷰_도달_CPT', '카카오톡 프로필 전면 노출'],
  ['NAVER 보장형 DA', 'P_메인_타임보드(신)_배너_이미지형(신)_CPT', '네이버 PC 메인 타임보드 배너'],
  ['NAVER 보장형 DA', 'M_웹툰_빅배너_통합(신)_배너_이미지형_CPM', '네이버 웹툰 하단 빅배너'],
  ['SMR', '랜덤 CPM', '방송 클립 영상 앞 랜덤 노출'],
  ['SMR', 'SMR Live', '방송 실시간 시청 중 영상 광고'],
  ['Targetpick', 'TargetPick 스플래시', '제휴 앱 실행 시 전면 스플래시'],
  ['Targetpick', 'TargetPick (띠배너)', '제휴 앱 하단 띠배너'],
  ['Google Ads', '앱 설치 캠페인_CPA', 'Google 검색·Play·YouTube 앱 설치'],
  ['Meta', '경매_앱 홍보_앱 설치수 극대화_instagram', '인스타그램 피드 앱 설치 광고'],
  ['NAVER 성과형 DA', '참여 유도_피드 영역_CPC', '네이버 피드 영역 참여형 광고'],
  ['Google Ads', '트루뷰 포 리치_CPM', 'YouTube 건너뛸 수 있는 도달형 영상'],
  ['TikTok', '동영상 조회_6초 조회수_TikTok_동영상', '틱톡 피드 6초 조회 영상'],
  ['NAVER 보장형 DA', 'M_스노우_스플래시(CPM)_배너_이미지형(신)_CPM', '스노우 앱 실행 시 스플래시'],
  ['kakao 모먼트', '디스플레이_방문_CPM', '카카오 서비스 전반 방문형 배너'],
  ['Meta', '경매_인지도_일일 고유 도달 극대화_facebook', '페이스북 피드 일일 도달 광고'],
  ['NAVER 성과형 DA', '동영상 조회_피드 영역_CPV', '네이버 피드 영역 동영상'],
  ['Google Ads', '인피드 동영상 광고_CPV', 'YouTube 검색·관련 영상 목록 노출']
]

// ---------- 상품 팝업 설명 (PRODUCTS와 같은 순서, 매체·지면 포함 한 문장 50자 내외) ----------

const DETAILS: string[] = [
  '카카오톡 채팅 목록 맨 위에 배너를 띄워 채널 친구 추가 같은 전환을 이끄는 광고입니다.',
  '네이버 첫 화면(메인) 지면에 이미지로 노출되고, 클릭한 만큼 비용을 내는 광고입니다.',
  'YouTube 영상 시청 중 나오며 건너뛸 수 없어 메시지를 끝까지 전하는 영상 광고입니다.',
  '페이스북 피드에 노출되어 광고를 누른 사람을 랜딩 페이지로 데려오는 광고입니다.',
  '틱톡 추천 피드 사이에 세로형 영상으로 노출되어 웹사이트 전환을 이끄는 광고입니다.',
  'Google 검색·YouTube·디스플레이 지면에 한 번에 노출되며 전환을 자동으로 최적화합니다.',
  '네이버 쇼핑 검색 결과에 상품이 노출되어 구매 직전 고객에게 닿는 광고입니다.',
  '카카오톡·다음 등 카카오 서비스 곳곳에 배너로 노출되어 전환을 이끄는 광고입니다.',
  '인스타그램 피드와 스토리에 상품을 보여 주고 구매 금액이 커지도록 최적화합니다.',
  'YouTube 홈·Shorts와 Discover 피드에 영상으로 노출되어 전환을 이끄는 광고입니다.',
  '네이버 모바일 앱 메인 상단에 영상이 펼쳐지며 노출되는 기간·노출 보장형 광고입니다.',
  '틱톡과 제휴 앱(팽글) 지면에 상품 카탈로그를 자동으로 보여 주는 광고입니다.',
  '카카오 서비스 지면에 등록한 상품 카탈로그를 자동으로 보여 주는 쇼핑 광고입니다.',
  '페이스북·인스타그램 피드에 노출되어 링크 클릭을 많이 모으도록 최적화하는 광고입니다.',
  'Google 제휴 사이트·앱 배너 지면에 소재가 자동으로 맞춰 노출되는 디스플레이 광고입니다.',
  '네이버 첫 화면(메인)에 상품 카탈로그를 보여 주고 클릭한 만큼 비용을 내는 광고입니다.',
  '여러 제휴 모바일 앱 지면에서 동영상으로 노출되어 연령·지역으로 타겟을 골라 닿는 광고입니다.',
  '방송사 클립 영상 앞에 시청 콘텐츠를 기준으로 골라 노출되는 동영상 광고입니다.',
  'YouTube 영상 시작 전에 나오는 건너뛸 수 없는 6초 길이의 짧은 영상 광고입니다.',
  '네이버 모바일에서 브랜드명을 검색하면 결과 맨 위에 노출되는 검색 광고입니다.',
  '카카오톡·다음 등 카카오 서비스 지면에 영상으로 노출되고 조회한 만큼 비용을 냅니다.',
  '페이스북·인스타그램 릴스와 피드에 영상으로 노출되어 끝까지 보도록 최적화합니다.',
  '틱톡 피드 영상에서 바로 랜딩 페이지로 이어져 방문을 모으는 광고입니다.',
  '카카오톡 채팅탭 상단에 정해진 기간 동안 노출을 보장받는 배너 광고입니다.',
  '네이버 밴드 피드 사이에 배너로 노출되고 클릭한 만큼 비용을 내는 광고입니다.',
  '네이버 패밀리 매체 상단 띠배너 지면에 노출되어 웹사이트 전환을 이끄는 광고입니다.',
  'Google 제휴 사이트·앱의 이미지 배너 지면에 노출되고 노출 수만큼 비용을 냅니다.',
  'YouTube 홈 화면 맨 위에 하루 동안 크게 노출되는 대형 영상 광고입니다.',
  '인스타그램 피드에 미리 예약한 노출량만큼 확실하게 노출되는 예약형 광고입니다.',
  '페이스북 피드에 노출되어 좋아요·댓글 같은 게시물 반응을 모으는 광고입니다.',
  '틱톡 피드에 이미지 여러 장을 넘겨 보는 캐러셀 형태로 노출되는 도달형 광고입니다.',
  '틱톡 피드에 영상으로 노출되어 계정 팔로워를 늘리도록 최적화하는 광고입니다.',
  '카카오톡·다음 서비스 상단 포커스 보드 지면에 기간 동안 노출되는 광고입니다.',
  '카카오톡 친구 프로필을 열면 전면으로 노출되는 기간 보장형 브랜딩 광고입니다.',
  '네이버 PC 메인 화면 타임보드 지면에 정해진 시간대 동안 노출되는 배너 광고입니다.',
  '네이버 웹툰 화면 하단 빅배너 지면에 이미지로 노출되어 웹툰 독자에게 닿는 광고입니다.',
  '방송사 클립 영상 앞에 무작위로 노출되고 노출 수만큼 비용을 내는 영상 광고입니다.',
  '방송 실시간 시청 화면에서 영상으로 노출되어 생방송 시청자에게 닿는 동영상 광고입니다.',
  '제휴 모바일 앱을 실행하는 순간 화면 전체에 노출되어 첫인상을 남기는 스플래시 광고입니다.',
  '제휴 모바일 앱 화면 하단 띠배너 지면에 노출되어 연령·지역으로 타겟을 고르는 광고입니다.',
  'Google 검색·Play 스토어·YouTube에 노출되어 앱 설치를 이끄는 광고입니다.',
  '인스타그램 피드에 노출되어 앱 설치 수를 늘리도록 최적화하는 광고입니다.',
  '네이버 피드 영역에 노출되어 참여·반응을 모으고 클릭한 만큼 비용을 냅니다.',
  'YouTube 영상에 건너뛸 수 있는 영상으로 노출되어 많은 사람에게 닿는 도달형 광고입니다.',
  '틱톡 피드에 영상으로 노출되어 6초 이상 시청을 늘리도록 최적화하는 광고입니다.',
  '스노우 앱을 실행하는 순간 전면에 이미지로 노출되는 스플래시 광고입니다.',
  '카카오톡·다음 등 카카오 서비스 전반에 배너로 노출되어 방문을 늘리는 광고입니다.',
  '페이스북 피드에 노출되어 하루에 닿는 사람 수를 최대로 늘리는 도달형 광고입니다.',
  '네이버 피드 영역에 영상으로 노출되고 조회한 만큼 비용을 내는 동영상 광고입니다.',
  'YouTube 검색 결과와 관련 영상 목록에 노출되어 영상 조회를 이끄는 광고입니다.',
]

// ---------- Best Fit 결론 구절·근거 (placeholder: {업종} {목적} {시기}) ----------

const BEST_TEXTS: [headline: string, reason: string][] = [
  ['{업종} 캠페인에서 가장 꾸준히 선택됐어요', '{목적} 효율도 상위권이라 믿고 먼저 담기 좋아요. 카카오톡을 여는 순간 채팅 목록 맨 위에 보이는 자리라 {시기} 신제품 런칭처럼 짧은 기간에 빠르게 알릴 때 잘 맞아요. 카카오톡 채널로 바로 이어져 관심 고객을 모으기도 쉬워요.'],
  ['네이버 메인 지면에 넓게 닿아요', '{업종} 업종에서도 많이 쓰여 운영이 안정적이에요. 네이버 메인을 여는 사람에게 넓게 노출되고, 성과형이라 클릭한 만큼만 비용을 내요. {목적} 목적 캠페인에서 예산을 나눠 쓰며 비용을 관리하기 좋아요.'],
  ['{업종} 업종에서 많이 쓰인 영상 상품이에요', '건너뛸 수 없는 영상이라 런칭 메시지를 끝까지 전할 수 있어요. 시청자 관심사로 타겟을 좁혀 원하는 사람에게 보여 주기 좋고, 이미 만든 영상 소재를 그대로 쓸 수 있어 {시기} 런칭 준비 부담도 적어요.'],
  ['이번 캠페인에 넓게 닿는 상품이에요', '{업종} 업종에서도 자주 쓰인 상품이에요. 페이스북 피드에서 광고를 누르면 랜딩 페이지로 바로 연결돼 {시기} 신제품 소개를 자세히 보여 주기 좋아요. 페이지를 실제로 본 사람 기준으로 노출이 최적화돼요.'],
  ['숏폼 영상으로 젊은 층에 빠르게 닿아요', '최근 {업종} 업종에서 쓰임이 빠르게 늘고 있어요. 추천 피드 사이에 세로형 영상으로 노출돼 젊은 층의 눈에 자연스럽게 들어가요. 영상 하나로 관심부터 {목적}까지 이어지는 흐름을 만들기 좋아요.'],
  ['여러 지면을 한 번에 묶어 운영해요', '검색·YouTube·디스플레이를 한 캠페인으로 함께 운영해요. {목적} 성과가 나는 지면에 예산이 자동으로 몰려 따로 나눠 관리할 필요가 적어요. {업종} 업종에서도 운영 사례가 충분해 처음 써도 안정적이에요.'],
  ['구매를 앞둔 사람에게 바로 닿아요', '네이버 쇼핑에서 상품을 찾는 순간 검색 결과에 노출돼 {목적}으로 이어지기 쉬워요. 이미 살 마음이 있는 사람에게 닿는 자리라 효율이 좋은 편이에요. {시기} 시즌 프로모션과 함께 쓰면 더 잘 맞아요.'],
  ['카카오 지면 전반에 고르게 닿아요', '카카오 서비스 전반의 지면에 고르게 노출돼요. 관심사와 행동으로 타겟을 세밀하게 나눌 수 있고, 픽셀로 성과를 추적해 비슷한 사람에게 다시 닿아요. 비즈보드와 함께 담으면 {업종} 고객에게 반복해서 닿기 좋아요.'],
  ['인스타그램 쇼핑 흐름에 잘 맞아요', '인스타그램 피드와 스토리에서 상품을 보고 바로 구매로 넘어갈 수 있어요. 전환값이 큰 고객을 우선해 노출하므로 객단가를 함께 챙기기 좋아요. {업종} 업종의 {목적} 캠페인에서 꾸준히 쓰인 상품이에요.'],
  ['피드 영상으로 관심층을 넓혀 줘요', 'YouTube와 Discover 피드에서 영상을 보여 줘 {업종} 관심층을 넓히기 좋아요. 피드를 둘러보는 사람에게 자연스럽게 노출돼 거부감이 적어요. 이미 만든 영상 소재를 그대로 쓸 수 있어 준비도 빨라요.'],
  ['모바일 메인에서 존재감을 키워 줘요', '네이버 앱을 여는 순간 메인 상단에서 확장형 영상이 보여요. 하루에 가장 많은 사람이 지나가는 자리라 {시기} 런칭 첫 주에 신제품을 크게 알리기 좋아요. 보장형이라 노출 계획을 미리 세울 수 있어요.'],
  ['상품 카탈로그를 그대로 보여 줘요', '등록한 상품 정보로 소재가 자동으로 만들어져 준비가 빨라요. 틱톡과 팽글 지면에 상품을 함께 보여 줘 닿는 범위도 넓어요. {목적} 목적 캠페인에서 효율이 좋은 편이라 상품 수가 많은 브랜드에 잘 맞아요.'],
  ['카카오 지면에서 상품을 바로 보여 줘요', '카탈로그 상품을 카카오 서비스 곳곳에 노출해요. 상품을 본 적 있는 사람에게 다시 보여 줘 구매를 망설이는 고객을 붙잡기 좋아요. {업종} 업종의 {목적} 캠페인에서 자주 쓰여 운영 사례도 충분해요.'],
  ['피드에서 랜딩 클릭을 모으기 좋아요', '페이스북과 인스타그램 피드에 함께 노출돼 닿는 범위가 넓어요. 링크를 누를 가능성이 높은 사람에게 우선 노출돼 {시기} 프로모션 페이지로 방문을 모으기 좋아요. 소재 하나로 두 매체를 함께 운영할 수 있어요.'],
  ['배너로 넓은 지면에 꾸준히 닿아요', '수많은 제휴 사이트와 앱에 배너가 노출돼 넓은 지면에 꾸준히 닿아요. 이미지와 문구만 넣으면 지면에 맞게 자동으로 조합돼요. {목적} 성과를 기준으로 최적화되어 운영 부담이 적은 편이에요.'],
  ['네이버 메인에서 상품을 바로 보여 줘요', '카탈로그 상품이 네이버 메인에 노출돼 관심이 바로 {목적}으로 이어지기 좋아요. 사용자 관심사에 맞는 상품이 골라져 보여서 클릭 효율도 좋은 편이에요. {업종} 업종에서도 쓰임이 늘고 있어요.'],
  ['제휴 앱 사용자에게 영상으로 닿아요', '여러 제휴 앱에서 영상을 보여 줘 기존 대형 매체에서 만나기 어려운 사람에게 닿아요. 주요 매체와 겹치지 않는 도달을 더해 주므로 {시기} 런칭 알림에 보조 매체로 함께 쓰기 좋아요.'],
  ['방송 클립 시청자를 골라 닿을 수 있어요', '방송 클립 영상 앞에 노출돼요. 보는 콘텐츠를 기준으로 타겟을 골라 {업종}에 관심 있는 시청자에게 영상을 보여 줄 수 있어요. 방송 콘텐츠와 함께 노출되는 만큼 브랜드 신뢰감을 쌓기에도 좋아요.'],
  ['6초 영상으로 짧고 강하게 기억돼요', '건너뛸 수 없는 6초 영상이라 짧지만 끝까지 보여요. {시기} 런칭 메시지를 여러 번 반복해 남기기 좋고, 긴 영상 광고와 함께 쓰면 기억에 남는 효과가 커져요. 노출 수 기준으로 비용을 내요.'],
  ['브랜드를 찾는 사람에게 정확히 닿아요', '브랜드명을 검색하면 결과 맨 위에 노출돼요. 이미 브랜드를 알고 찾아온 사람을 정확히 맞이하는 자리예요. {시기} 런칭 이후 늘어나는 검색을 놓치지 않게 해 주고, 기간 단위로 구매해 비용을 예측하기 쉬워요.'],
  ['카카오 지면에서 영상 조회를 모아요', '카카오 서비스 곳곳에서 영상을 보여 주고 조회한 만큼만 비용을 내요. 끝까지 보지 않으면 비용이 나가지 않아 예산 낭비가 적어요. {업종} 업종의 영상 소재를 넓은 사람에게 보여 주기 좋아요.'],
  ['릴스 영상으로 시청 완료를 늘려 줘요', '페이스북과 인스타그램 릴스에 노출되고, 끝까지 본 사람 기준으로 노출이 최적화돼요. {업종} 업종의 짧은 세로형 영상 소재와 잘 맞아 {시기} 런칭 메시지를 온전히 전하기 좋아요. 시청 완료가 많을수록 효율이 올라가요.'],
  ['틱톡 영상에서 랜딩 방문을 모아요', '피드 영상을 본 사람이 바로 랜딩 페이지로 넘어가요. 영상으로 관심을 끈 뒤 페이지에서 자세한 정보를 보여 주는 흐름이라 {시기} 신제품 페이지로 방문을 모으기 좋아요. 젊은 층 비중이 높은 매체예요.'],
  ['카카오톡 채팅탭 상단을 기간으로 잡아요', '정해진 기간 동안 채팅탭 상단 노출을 보장받아요. {시기} 런칭 기간에 노출 공백 없이 알리기 좋고, 카카오톡을 쓰는 거의 모든 사람에게 닿을 수 있어요. 기간 단위 구매라 비용을 미리 확정할 수 있어요.']
]

// ---------- BudgetOpt 2.0 연계 전달 판별 (샘플) ----------
// 실제로는 BudgetOpt 2.0 매체 카탈로그·업종×KPI 모델 학습 현황에서 받음.
// 샘플은 어느 큐레이션이든 목록 위쪽 몇 개만 담아도 두 제외 케이스가 보이도록 Best Fit 순위로 정함

/** 미지원 매체로 둘 Best Fit 순위 */
const BO_UNSUPPORTED_RANKS = [3]
/** KPI별로 학습 결과가 없는 Best Fit 순위 */
const BO_NO_MODEL_RANKS: Record<string, number[]> = {
  impression: [2],
  click: [4],
  view: [2, 4],
  reach: [4, 5]
}

// ---------- 변형 정의 ----------

type Variant = 'A' | 'B' | 'C' | 'D'

/** 샘플 큐레이션 id → 변형 */
const VARIANT_BY_CURATION: Record<number, Variant> = { 1: 'A', 12: 'A', 3: 'B', 9: 'C', 10: 'C', 2: 'D' }

interface VariantSpec {
  bestCount: number
  goodCount: number
  totalPool: number
  fromDescription: boolean
  /** 축 id 목록 (5 또는 6개) */
  axisIds: string[]
  /** 축별 가중치 (샘플 순위 산출용. 화면에는 노출하지 않음) */
  weights: number[]
  conditions: ACAppliedCondition[]
  /** 대안 카드 구성 (상품 인덱스) */
  alts: { industryFavorite?: number; topPerformer?: number }
  coWinner?: 'industry' | 'kpi'
  insightOk: boolean
}

const VARIANTS: Record<Variant, VariantSpec> = {
  A: {
    bestCount: 24, goodCount: 26, totalPool: 214, fromDescription: true,
    axisIds: ['fit', 'kpi', 'exp', 'trend', 'reach', 'target'],
    weights: [1.6, 1.5, 1.2, 0.8, 0.5, 0.4],
    conditions: [
      { conditionId: 'format', values: ['동영상', '이미지'] },
      { conditionId: 'buy', values: ['성과형'] },
      { conditionId: 'placement', values: ['TikTok'], relaxed: true },
      { conditionId: 'budget', values: ['3000'] },
      { conditionId: 'device', values: ['모바일'] },
      { conditionId: 'target', values: ['리타겟팅'], relaxed: true },
      { conditionId: 'exp', values: ['집행 경험이 많은 곳'] }
    ],
    alts: { industryFavorite: 2, topPerformer: 1 },
    insightOk: true
  },
  B: {
    bestCount: 20, goodCount: 14, totalPool: 187, fromDescription: true,
    axisIds: ['fit', 'kpi', 'exp', 'trend', 'reach', 'target'],
    weights: [1, 1, 1, 1, 1, 1],
    conditions: [
      { conditionId: 'format', values: ['동영상'] },
      { conditionId: 'scale', values: ['대형 매체'] }
    ],
    // 두 관점의 1등이 같은 상품: 병합하지 않고 카드 두 장에 각각 표시
    alts: { industryFavorite: 2, topPerformer: 2 },
    insightOk: true
  },
  C: {
    bestCount: 12, goodCount: 9, totalPool: 156, fromDescription: false,
    axisIds: ['fit', 'kpi', 'exp', 'reach', 'trend'],
    weights: [1, 1, 1, 1, 1],
    conditions: [],
    alts: { topPerformer: 3 },
    coWinner: 'industry',
    insightOk: true
  },
  D: {
    bestCount: 18, goodCount: 0, totalPool: 98, fromDescription: true,
    axisIds: ['fit', 'kpi', 'exp', 'trend', 'reach', 'target'],
    weights: [1.6, 1.5, 1.2, 0.8, 0.5, 0.4],
    conditions: [
      { conditionId: 'buy', values: ['성과형'] },
      { conditionId: 'billing', values: ['CPC', 'CPA'] },
      { conditionId: 'placement', values: ['네이버 메인'], exclude: true }
    ],
    alts: { industryFavorite: 2, topPerformer: 1 },
    insightOk: false
  }
}

// ---------- 유틸 ----------

/** 결정적 난수 (같은 큐레이션은 항상 같은 샘플) */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const clamp = (v: number) => Math.max(5, Math.min(99, Math.round(v)))

function addDays(ymd: string, days: number): string {
  const d = new Date(`${ymd}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** 평가 KPI: 목적 중 전환 → 트래픽 → 조회 → 인지 우선 */
function evalKpiOf(purposes: ACPurpose[]): { label: string; metric: string } {
  if (purposes.includes('conversion')) return { label: '전환', metric: 'CPA' }
  if (purposes.includes('traffic')) return { label: '클릭', metric: 'CPC' }
  if (purposes.includes('view')) return { label: '조회', metric: 'CPV' }
  return { label: '도달', metric: 'CPM' }
}

function axesOf(ids: string[], kpiLabel: string): ACEvalAxis[] {
  const names: Record<string, string> = {
    fit: '업종 적합', kpi: `${kpiLabel} 효율`, exp: '집행 경험', trend: '사용 추세', reach: '도달 규모', target: '타겟 정밀도'
  }
  return ids.map(id => ({ id, name: names[id] }))
}

// ---------- 상품 속성 (상품명 기반 예시 값) ----------

function attributesOf(media: string, product: string, idx: number): ACProductAttributes {
  const isGuaranteed = media === 'NAVER 보장형 DA' || /_CPT$|CPT$/.test(product)
  const billing = (product.match(/_(CPC|CPM|CPV|CPA|CPT|ROAS)$/) || [])[1]
    ?? (media === 'Meta' || media === 'TikTok' ? 'CPM' : media === 'SMR' || media === 'Targetpick' ? 'CPM' : undefined)
  const isVideo = /동영상|비디오|인스트림|영상|Video|ThruPlay|범퍼|Live|콘텐츠|랜덤/.test(product) || media === 'SMR'
  const isCatalog = /카탈로그/.test(product)
  const formats = isCatalog ? ['카탈로그'] : isVideo ? ['동영상'] : /배너|이미지|디스플레이|스플래시|보드|브랜드검색|풀뷰/.test(product) ? ['이미지'] : ['이미지', '동영상']
  const videoSpec = !formats.includes('동영상') ? undefined
    : /건너뛸 수 없는|논스킵/.test(product) ? '스킵 불가 · 15초'
      : /범퍼|6초/.test(product) ? '스킵 불가 · 6초'
        : '스킵 가능'
  const targetingByMedia: Record<string, string[] | undefined> = {
    Meta: ['연령', '성별', '지역', '관심사', '리타겟팅'],
    'Google Ads': ['연령', '성별', '관심사', '리타겟팅'],
    'kakao 모먼트': ['연령', '성별', '지역', '관심사'],
    'NAVER 성과형 DA': ['연령', '성별', '지역', '관심사'],
    'NAVER 보장형 DA': /브랜드검색/.test(product) ? undefined : ['연령', '성별'],
    TikTok: ['연령', '성별', '관심사'],
    SMR: ['콘텐츠'],
    Targetpick: ['연령', '성별', '지역']
  }
  const recommendedByMedia: Record<string, string> = {
    Meta: '20~30대 · 쇼핑 관심',
    TikTok: '10~20대 · 숏폼 시청',
    'kakao 모먼트': '20~40대 · 카카오톡 이용',
    'NAVER 성과형 DA': '30~40대 · 검색 이용',
    'Google Ads': '20~40대 · 영상 시청'
  }
  const devices = media === 'kakao 모먼트' || media === 'TikTok' || media === 'Targetpick' ? ['모바일']
    : media === 'NAVER 보장형 DA' ? (product.startsWith('P_') ? ['PC'] : product.startsWith('PM_') ? ['모바일', 'PC'] : ['모바일'])
      : ['모바일', 'PC']
  const minBudgets = [300, undefined, 500, 1000]
  return {
    buyType: isGuaranteed ? '보장형' : '성과형',
    billing,
    formats,
    videoSpec,
    targeting: targetingByMedia[media],
    recommendedTarget: idx % 3 === 0 ? recommendedByMedia[media] : undefined,
    devices,
    guarantee: isGuaranteed ? (/CPT/.test(product) ? '기간 보장' : '노출 보장') : undefined,
    minBudgetManwon: isGuaranteed ? 3000 : minBudgets[idx % 4]
  }
}

/** 조건 id → 상품 속성 키 (✓·조건 완화 표시용) */
const CONDITION_ATTR: Record<string, ACAttributeKey> = {
  format: 'formats', buy: 'buyType', billing: 'billing', device: 'devices',
  target: 'targeting', guarantee: 'guarantee', budget: 'minBudgetManwon'
}

function conditionMatches(cond: ACAppliedCondition, a: ACProductAttributes): boolean {
  switch (cond.conditionId) {
    case 'format': return !!a.formats?.some(f => cond.values.includes(f))
    case 'buy': return !!a.buyType && cond.values.includes(a.buyType)
    case 'billing': return !!a.billing && cond.values.includes(a.billing)
    case 'device': return !!a.devices?.some(d => cond.values.includes(d))
    case 'target': {
      const want = cond.values.flatMap(v => (v === '데모' ? ['연령', '성별'] : [v]))
      return !!a.targeting?.some(t => want.includes(t))
    }
    case 'guarantee': return !!a.guarantee && cond.values.includes(a.guarantee)
    case 'budget': return a.minBudgetManwon !== undefined && a.minBudgetManwon <= Number(cond.values[0])
    default: return false
  }
}

function matchKeys(conditions: ACAppliedCondition[], a: ACProductAttributes) {
  const matched: ACAttributeKey[] = []
  const relaxed: ACAttributeKey[] = []
  for (const c of conditions) {
    const key = CONDITION_ATTR[c.conditionId]
    if (!key || c.exclude || a[key] === undefined) continue
    const ok = conditionMatches(c, a)
    if (c.relaxed) { if (!ok) relaxed.push(key) } else if (ok) matched.push(key)
  }
  return { matched, relaxed }
}

// ---------- 프로모션 (캠페인 기간 기준 예시) ----------

function promotionsOf(idx: number, start: string): ACPromotion[] {
  const base = (name: string, s: number, e: number, benefit: string): ACPromotion => ({
    name,
    startDate: addDays(start, s),
    endDate: addDays(start, e),
    benefit,
    condition: '최소 집행 1,000만 원 이상, 다른 프로모션과 중복 적용 불가',
    advantage: '같은 예산으로 노출을 더 확보할 수 있습니다.',
    sourceUrl: 'https://mts.example.com/promotion'
  })
  switch (idx) {
    case 0: return [base('연말 비즈보드 보너스 노출', 0, 20, '집행 금액의 10% 추가 노출')]
    // 겹치는 프로모션 2개: 겹친 날이 더 많은 '런칭 지원'이 표시돼야 함 (6.5)
    case 3: return [
      base('신규 광고주 웰컴 혜택', 0, 9, '첫 집행 5% 할인'),
      base('시즌 런칭 지원', 5, 24, '집행 금액의 7% 추가 노출')
    ]
    case 6: return [base('쇼핑 영역 시즌 할인', 3, 30, 'CPC 8% 할인')]
    // 캠페인 기간과 겹치지 않음: 표시되면 안 됨 (V10)
    case 9: return [base('지난 분기 영상 프로모션', -40, -1, '조회당 단가 6% 할인')]
    case 26: return [base('디스플레이 네트워크 보너스', 0, 14, '노출 5% 추가')]
    default: return []
  }
}

// ---------- 점수 ----------

/** Best Match가 점수 합 1위가 아닌 예시(변형 A·D): 0번은 가중치 높은 축이 강하고, 1번은 낮은 축이 강해 합은 더 큼 */
const HANDCRAFTED: Record<number, number[]> = {
  0: [96, 95, 90, 70, 60, 62],
  1: [80, 74, 80, 96, 99, 98]
}

function scoresOf(spec: VariantSpec, variant: Variant, idx: number, group: ACFitGroup, order: number, rnd: () => number) {
  const scores: Record<string, number> = {}
  const useHand = (variant === 'A' || variant === 'D') && HANDCRAFTED[idx]
  // 상품마다 강한 축·약한 축이 뚜렷하도록 축별 편차를 크게 둠 (칸 높이가 축마다 달라 보이게)
  const base = group === 'best' ? 70 - order * 0.9 : 52 - order * 0.5
  const spread = group === 'best' ? 36 : 36
  spec.axisIds.forEach((axisId, k) => {
    if (useHand) { scores[axisId] = HANDCRAFTED[idx][k]; return }
    scores[axisId] = clamp(base + (rnd() - 0.5) * 2 * spread)
  })
  // B·C: 0번을 확실한 1위로 (그린이 맨 왼쪽인 예시). 축별 차이는 남김
  if ((variant === 'B' || variant === 'C') && idx === 0) {
    const profile = [97, 88, 94, 79, 91, 84]
    spec.axisIds.forEach((id, k) => { scores[id] = profile[k] })
  }
  // Good Fit: 약점 축 1개를 뚜렷하게
  if (group === 'good') {
    const weak = spec.axisIds[Math.floor(rnd() * spec.axisIds.length)]
    scores[weak] = clamp(scores[weak] - 22)
  }
  return scores
}

function weighted(spec: VariantSpec, scores: Record<string, number>): number {
  return spec.axisIds.reduce((s, id, k) => s + scores[id] * spec.weights[k], 0)
}

// ---------- 결과 생성 ----------

function fillText(t: string, ctx: Record<string, string>): string {
  return t.replace(/\{(업종|목적|시기)\}/g, (_, k) => ctx[k])
}

function buildResult(curation: ACCuration, variant: Variant): ACCurationResult {
  const spec = VARIANTS[variant]
  const rnd = mulberry32(curation.id * 7919 + variant.charCodeAt(0))
  const kpi = evalKpiOf(curation.purposes)
  const axes = axesOf(spec.axisIds, kpi.label)
  const ctx = {
    업종: curation.industry,
    목적: kpi.label,
    시기: `${Number(curation.startDate.slice(5, 7))}월`
  }

  const make = (idx: number, group: ACFitGroup, order: number): ACResultItem & { _w: number } => {
    const [mediaName, productName, description] = PRODUCTS[idx]
    const attributes = attributesOf(mediaName, productName, idx)
    const { matched, relaxed } = matchKeys(spec.conditions, attributes)
    const axisScores = scoresOf(spec, variant, idx, group, order, rnd)
    let headline: string
    let reason: string
    if (group === 'best') {
      headline = fillText(BEST_TEXTS[idx][0], ctx)
      reason = fillText(BEST_TEXTS[idx][1], ctx)
    } else {
      const sorted = spec.axisIds.slice().sort((a, b) => axisScores[b] - axisScores[a])
      const strong = axes.find(a => a.id === sorted[0])!.name
      const weak = axes.find(a => a.id === sorted[sorted.length - 1])!.name
      headline = `${strong} 평가는 괜찮은 편이에요`
      reason = `${weak} 평가가 상대적으로 낮아 Best Fit보다 한 걸음 뒤에 있어요. 다른 평가 축은 무난한 편이라 ${ctx.업종} 업종의 ${ctx.목적} 캠페인에서 주력 상품을 보완하는 선택지로 검토해 보세요. 예산에 여유가 있을 때 함께 담기 좋아요.`
    }
    return {
      id: `p${idx}`,
      group,
      rank: 0,
      mediaName,
      productName,
      description,
      detail: DETAILS[idx],
      headline,
      reason,
      axisScores,
      attributes,
      matchedAttributeKeys: matched,
      relaxedAttributeKeys: relaxed,
      promotions: promotionsOf(idx, curation.startDate),
      boSupported: (boMediaData as Record<string, string[]>)[mediaName]?.includes(productName) ?? false,
      _w: 0
    }
  }

  const best = Array.from({ length: spec.bestCount }, (_, i) => make(i, 'best', i))
  const good = Array.from({ length: spec.goodCount }, (_, j) => make(24 + j, 'good', j))
  // 샘플 전제: 0번이 종합 적합도 1위(Best Match). 넘는 상품은 점수를 비율대로 낮춤
  const topW = weighted(spec, best[0].axisScores)
  best.slice(1).forEach(it => {
    const w = weighted(spec, it.axisScores)
    if (w >= topW - 4) {
      const f = (topW - 8) / w
      spec.axisIds.forEach(id => { it.axisScores[id] = clamp(it.axisScores[id] * f) })
    }
  })
  for (const group of [best, good]) {
    group.forEach(it => { it._w = weighted(spec, it.axisScores) })
    group.slice().sort((a, b) => b._w - a._w).forEach((it, r) => { it.rank = r + 1 })
  }
  const items: ACResultItem[] = [...best, ...good].map(({ _w, ...rest }) => rest)
  items.filter(i => i.group === 'best').forEach(i => {
    if (BO_UNSUPPORTED_RANKS.includes(i.rank)) i.boUnsupported = true
    const kpis = Object.entries(BO_NO_MODEL_RANKS).filter(([, ranks]) => ranks.includes(i.rank)).map(([k]) => k)
    if (kpis.length) i.boNoModelKpis = kpis
  })
  const bestMatch = items.find(i => i.group === 'best' && i.rank === 1)!

  const ifSentence = `Best Fit 중 ${curation.industry} 업종 캠페인 ${48 + curation.id}건으로 가장 많이 집행되었습니다.`
  const tpSentence = `Best Fit 중 ${kpi.label} 기준 과거 ${kpi.metric}가 가장 우수했습니다.`
  const altCards: ACAltCard[] = []
  if (spec.alts.industryFavorite !== undefined) altCards.push({ kind: 'industryFavorite', itemId: `p${spec.alts.industryFavorite}`, sentence: ifSentence })
  if (spec.alts.topPerformer !== undefined) altCards.push({ kind: 'topPerformer', itemId: `p${spec.alts.topPerformer}`, sentence: tpSentence })

  const coWinners = spec.coWinner === 'industry' ? ['같은 업종 집행'] : spec.coWinner === 'kpi' ? [`${kpi.label} 효율`] : []

  const strongAxis = axes.slice().sort((a, b) => bestMatch.axisScores[b.id] - bestMatch.axisScores[a.id])[0].name
  const insight = !spec.insightOk ? null
    : `이번 큐레이션은 캠페인 설명의 ${kpi.label} 목적과 ${ctx.시기} 런칭 일정을 반영해 평가 축을 골랐습니다. `
      + `Best Match는 ${strongAxis}에서 가장 강해 이번 캠페인 기준 1위가 되었습니다. `
      + (variant === 'A' || variant === 'D'
        ? '점수 합이 더 높은 상품도 있지만, 이번 캠페인에서 중요한 축의 평가가 낮아 순위가 뒤로 밀렸습니다.'
        : '다음 순위 상품과는 대부분의 평가 축에서 고르게 차이가 납니다.')

  return {
    curation,
    axes,
    axesFromDescription: spec.fromDescription,
    evalKpi: kpi,
    totalPool: spec.totalPool,
    items,
    bestMatchId: bestMatch.id,
    bestMatchCoWinners: coWinners,
    altCards,
    appliedConditions: spec.conditions,
    insight,
    generatedAt: (curation.completedAt ?? curation.created).slice(0, 10),
  }
}

// ---------- 공개 API ----------

const cache = new Map<number, ACCurationResult>()

/** 결과 조회. Completed가 아니거나 없는 id면 null */
export function getACResult(id: number): ACCurationResult | null {
  const curation = sampleACCurations.find(c => c.id === id)
  if (!curation || curation.status !== 'Completed') return null
  if (!cache.has(id)) cache.set(id, buildResult(curation, VARIANT_BY_CURATION[id] ?? 'A'))
  return cache.get(id)!
}
