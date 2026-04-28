// DataShot 타입 정의

export type DatasetStatus = 'Pending' | 'Processing' | 'Completed' | 'Error' | 'Expired'

export interface Dataset {
  id: number
  name: string
  media: string
  industry: string // 표시용 (하위 호환)
  industryLevel?: 'major' | 'mid' | 'minor' | null // 분류 레벨
  industryCount?: number // 선택된 업종 수 (전체면 null)
  startDate: string
  endDate: string
  periodType: 'month' | 'quarter' // 월별/분기별 구분
  status: DatasetStatus
  created: string
  creator: string
  creatorId: string
}

// 샘플 데이터
export const sampleDatasets: Dataset[] = [
  { id: 1,  name: '2024년 1월 Google Ads 캠페인 데이터', media: 'Google Ads',       industry: '전체',    industryLevel: null,    industryCount: undefined, startDate: '2024-01', endDate: '2024-01', periodType: 'month',   status: 'Completed',  created: '2024-02-01 14:30', creator: '김철수', creatorId: 'kimcheolsu@gmail.com' },
  { id: 2,  name: 'Meta 광고 성과 분석 데이터',          media: 'Meta',              industry: '3개 업종', industryLevel: 'major', industryCount: 3,         startDate: '2024-01', endDate: '2024-02', periodType: 'month',   status: 'Processing', created: '2024-02-10 09:15', creator: '이영희', creatorId: 'leeyounghee@naver.com' },
  { id: 3,  name: '카카오 모먼트 캠페인 추출',            media: 'kakao모먼트',       industry: '식품',    industryLevel: 'mid',   industryCount: 1,         startDate: '2024-02', endDate: '2024-02', periodType: 'month',   status: 'Pending',    created: '2024-02-20 11:20', creator: '박민수', creatorId: 'parkminsu@kakao.com' },
  { id: 4,  name: '네이버 성과형 DA 광고 데이터',         media: '네이버 성과형 DA',  industry: '5개 업종', industryLevel: 'mid',   industryCount: 5,         startDate: '2024-1',  endDate: '2024-1',  periodType: 'quarter', status: 'Error',      created: '2024-02-15 15:40', creator: '최지은', creatorId: 'choijieun@naver.com' },
  { id: 5,  name: 'TikTok 광고 성과 데이터',             media: 'TikTok',            industry: '패션',    industryLevel: 'minor', industryCount: 2,         startDate: '2024-01', endDate: '2024-02', periodType: 'month',   status: 'Completed',  created: '2024-03-01 10:00', creator: '정현우', creatorId: 'junghyunwoo@gmail.com' },
  { id: 6,  name: '네이버 보장형 DA 캠페인 분석',         media: '네이버 보장형 DA',  industry: '전체',    industryLevel: null,    industryCount: undefined, startDate: '2024-02', endDate: '2024-03', periodType: 'month',   status: 'Processing', created: '2024-02-05 13:25', creator: '강민지', creatorId: 'kangminji@naver.com' },
  { id: 7,  name: 'Google Ads 디스플레이 캠페인',        media: 'Google Ads',       industry: '2개 업종', industryLevel: 'major', industryCount: 2,         startDate: '2024-1',  endDate: '2024-2',  periodType: 'quarter', status: 'Expired',    created: '2024-01-22 16:10', creator: '윤서준', creatorId: 'yoonseojun@gmail.com' },
  { id: 8,  name: 'Meta 신제품 런칭 캠페인',              media: 'Meta',              industry: '전자제품', industryLevel: 'mid',   industryCount: 1,         startDate: '2024-03', endDate: '2024-03', periodType: 'month',   status: 'Pending',    created: '2024-02-20 10:45', creator: '조은비', creatorId: 'joeunbi@naver.com' },
  { id: 9,  name: 'kakao모먼트 여름 프로모션',            media: 'kakao모먼트',       industry: '7개 업종', industryLevel: 'minor', industryCount: 7,         startDate: '2024-2',  endDate: '2024-3',  periodType: 'quarter', status: 'Processing', created: '2024-04-25 14:00', creator: '한지우', creatorId: 'hanjiwoo@kakao.com' },
  { id: 10, name: 'TikTok 건강식품 타겟 마케팅',          media: 'TikTok',            industry: '건강식품', industryLevel: 'minor', industryCount: 3,         startDate: '2024-02', endDate: '2024-04', periodType: 'month',   status: 'Completed',  created: '2024-02-10 09:30', creator: '송하늘', creatorId: 'songhaneul@gmail.com' },
  { id: 11, name: '네이버 성과형 DA 봄 시즌 캠페인',      media: '네이버 성과형 DA',  industry: '2개 업종', industryLevel: 'mid',   industryCount: 2,         startDate: '2024-03', endDate: '2024-05', periodType: 'month',   status: 'Processing', created: '2024-03-05 11:15', creator: '김민준', creatorId: 'kimminjun@naver.com' },
  { id: 12, name: 'Google Ads 검색 광고 최적화',         media: 'Google Ads',       industry: '전체',    industryLevel: null,    industryCount: undefined, startDate: '2024-1',  endDate: '2024-2',  periodType: 'quarter', status: 'Completed',  created: '2024-01-18 14:20', creator: '이서연', creatorId: 'leeseoyeon@gmail.com' },
  { id: 13, name: 'Meta 리타겟팅 캠페인',                 media: 'Meta',              industry: '5개 업종', industryLevel: 'major', industryCount: 5,         startDate: '2024-04', endDate: '2024-06', periodType: 'month',   status: 'Pending',    created: '2024-04-01 09:00', creator: '박지훈', creatorId: 'parkjihun@naver.com' },
  { id: 14, name: 'kakao모먼트 브랜드 인지도 캠페인',     media: 'kakao모먼트',       industry: '전자제품', industryLevel: 'mid',   industryCount: 1,         startDate: '2024-2',  endDate: '2024-2',  periodType: 'quarter', status: 'Error',      created: '2024-04-10 16:30', creator: '최수진', creatorId: 'choisujin@kakao.com' },
  { id: 15, name: 'TikTok 신규 고객 유치 캠페인',         media: 'TikTok',            industry: '3개 업종', industryLevel: 'major', industryCount: 3,         startDate: '2024-05', endDate: '2024-07', periodType: 'month',   status: 'Processing', created: '2024-05-01 10:45', creator: '정예린', creatorId: 'jungyerin@gmail.com' },
]

// 업종 분류 데이터
export const industryCategories: { [major: string]: { [mid: string]: string[] } } = {
  '가정용전기전자': {
    '가사용전기전자': ['가사용전기전자기타', '가습기', '다리미', '세탁기', '청소기'],
    '가정용전기전자기타': ['가정용전기전자기업PR', '가정용전기전자기업공고', '가정용전기전자기타', '가정용전기전자제품종합'],
    '냉난방기기': ['냉난방기기기타', '냉장고', '에어컨', '제습기'],
    '영상음향기기': ['TV', '영상음향기기기타', '오디오', '카메라'],
    '조리기기': ['가스레인지', '전기밥솥', '전자레인지', '조리기기기타']
  },
  '가정용품': {
    '가정용품기타': ['가정용품기타'],
    '생활용품': ['생활용품기타', '욕실용품', '청소용품'],
    '주방용품': ['냄비및프라이팬', '주방용품기타', '주방잡화'],
    '침구및가구': ['가구', '침구', '침구및가구기타']
  },
  '건설건재및부동산': {
    '건설건재및부동산기타': ['건설건재및부동산기타'],
    '건설및건재': ['건설', '건재', '건설및건재기타'],
    '부동산': ['부동산기타', '아파트', '오피스텔']
  },
  '관공서및단체': {
    '공공기관': ['공공기관기타', '정부부처', '지방자치단체'],
    '관공서및단체기타': ['관공서및단체기타'],
    '단체및협회': ['단체및협회기타', '비영리단체', '협회']
  },
  '교육및복지후생': {
    '교육': ['교육기타', '어학', '온라인교육', '학원'],
    '교육및복지후생기타': ['교육및복지후생기타'],
    '복지후생': ['복지후생기타', '사회복지', '의료복지']
  },
  '그룹및기업광고': {
    '그룹및기업광고기타': ['그룹및기업광고기타'],
    '기업PR': ['기업PR기타', '대기업PR', '중소기업PR'],
    '그룹PR': ['그룹PR기타', '대기업그룹PR']
  },
  '금융보험및증권': {
    '금융보험및증권기타': ['금융보험및증권기타'],
    '금융': ['금융기타', '대출', '은행', '카드'],
    '보험': ['보험기타', '생명보험', '손해보험'],
    '증권및투자': ['증권', '증권및투자기타', '펀드']
  },
  '기초재': {
    '기초재기타': ['기초재기타'],
    '금속및철강': ['금속', '기타금속', '철강'],
    '비금속': ['비금속기타', '유리', '플라스틱']
  },
  '산업기기': {
    '산업기기기타': ['산업기기기타'],
    '건설기계': ['건설기계기타', '굴삭기', '지게차'],
    '산업설비': ['산업설비기타', '자동화설비', '제조설비']
  },
  '서비스': {
    '서비스기타': ['서비스기타'],
    '생활서비스': ['배달서비스', '생활서비스기타', '청소서비스'],
    '여행및레저': ['여행', '여행및레저기타', '호텔및숙박'],
    '플랫폼및IT서비스': ['IT서비스', '모바일앱', '플랫폼및IT서비스기타']
  },
  '수송기기': {
    '수송기기기타': ['수송기기기타'],
    '승용차': ['국산승용차', '수입승용차', '승용차기타'],
    '이륜차및기타': ['이륜차', '이륜차및기타기타', '전기차'],
    '상용차': ['버스', '상용차기타', '트럭']
  },
  '식품': {
    '가공식품': ['가공식품기타', '냉동식품', '즉석식품'],
    '식품기타': ['식품기타'],
    '신선식품': ['과일및채소', '신선식품기타', '육류및수산'],
    '조미료및소스': ['소스', '양념', '조미료및소스기타']
  },
  '엔터테인먼트': {
    '게임': ['게임기타', '모바일게임', 'PC게임'],
    '엔터테인먼트기타': ['엔터테인먼트기타'],
    '영화및공연': ['공연', '영화', '영화및공연기타'],
    '음악및방송': ['방송', '음악', '음악및방송기타']
  },
  '유통': {
    '유통기타': ['유통기타'],
    '대형마트및슈퍼': ['대형마트', '슈퍼마켓', '대형마트및슈퍼기타'],
    '온라인쇼핑': ['온라인쇼핑기타', '오픈마켓', '종합쇼핑몰'],
    '편의점및전문점': ['전문점', '편의점', '편의점및전문점기타']
  },
  '음료및기호식품': {
    '기호식품': ['기호식품기타', '담배', '커피'],
    '음료및기호식품기타': ['음료및기호식품기타'],
    '음료': ['기능성음료', '음료기타', '탄산음료']
  },
  '정밀기기및사무기기': {
    '사무기기': ['복합기', '사무기기기타', '프린터'],
    '정밀기기': ['광학기기', '계측기기', '정밀기기기타'],
    '정밀기기및사무기기기타': ['정밀기기및사무기기기타']
  },
  '제약및의료': {
    '의료기기': ['의료기기기타', '진단기기', '치료기기'],
    '의약품': ['건강기능식품', '의약품기타', '전문의약품'],
    '제약및의료기타': ['제약및의료기타']
  },
  '출판': {
    '도서및잡지': ['도서', '잡지', '도서및잡지기타'],
    '출판기타': ['출판기타'],
    '온라인콘텐츠': ['디지털콘텐츠', '온라인콘텐츠기타', '전자책']
  },
  '컴퓨터및정보통신': {
    '네트워크및통신': ['네트워크', '통신서비스', '네트워크및통신기타'],
    '소프트웨어': ['소프트웨어기타', '업무용SW', '보안SW'],
    '컴퓨터및정보통신기타': ['컴퓨터및정보통신기타'],
    '컴퓨터및주변기기': ['노트북', '데스크탑', '컴퓨터및주변기기기타']
  },
  '패션': {
    '스포츠의류및용품': ['스포츠용품', '스포츠의류', '스포츠의류및용품기타'],
    '잡화및액세서리': ['가방', '신발', '잡화및액세서리기타'],
    '패션기타': ['패션기타'],
    '패션의류': ['남성의류', '여성의류', '패션의류기타']
  },
  '화장품및보건용품': {
    '기초화장품': ['기초화장품기타', '스킨케어', '에센스및세럼'],
    '색조화장품': ['립메이크업', '색조화장품기타', '아이메이크업'],
    '화장품및보건용품기타': ['화장품및보건용품기타'],
    '헤어및바디': ['바디케어', '헤어케어', '헤어및바디기타']
  },
  '화학공업': {
    '석유화학': ['석유', '석유화학기타', '화학소재'],
    '화학공업기타': ['화학공업기타'],
    '화학제품': ['도료', '세제', '화학제품기타']
  }
}

// 브랜드-업종 매핑 (검색용)
export const brandIndustryMap: { [brand: string]: string } = {
  // 가정용전기전자
  'LG': '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
  '삼성': '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
  '다이슨': '가정용전기전자 > 가사용전기전자 > 청소기',
  '샤오미': '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
  '애플': '가정용전기전자 > 가정용전기전자기타 > 가정용전기전자제품종합',
  '소니': '가정용전기전자 > 영상음향기기 > TV',
  '필립스': '가정용전기전자 > 가사용전기전자 > 가사용전기전자기타',
  '보쉬': '가정용전기전자 > 가사용전기전자 > 세탁기',
  '일렉트로룩스': '가정용전기전자 > 가사용전기전자 > 세탁기',
  '코웨이': '가정용전기전자 > 가사용전기전자 > 가습기',
  '청호나이스': '가정용전기전자 > 가사용전기전자 > 가습기',
  '위닉스': '가정용전기전자 > 냉난방기기 > 제습기',
  '캐리어': '가정용전기전자 > 냉난방기기 > 에어컨',
  '쿠쿠홈시스': '가정용전기전자 > 조리기기 > 전기밥솥',
  // 가정용품
  '쿠쿠': '가정용품 > 주방용품 > 냄비및프라이팬',
  '락앤락': '가정용품 > 주방용품 > 주방잡화',
  '글라스락': '가정용품 > 주방용품 > 주방잡화',
  '한샘': '가정용품 > 침구및가구 > 가구',
  '이케아': '가정용품 > 침구및가구 > 가구',
  // 건설건재및부동산
  'GS건설': '건설건재및부동산 > 건설및건재 > 건설',
  '현대건설': '건설건재및부동산 > 건설및건재 > 건설',
  '대우건설': '건설건재및부동산 > 건설및건재 > 건설',
  '래미안': '건설건재및부동산 > 부동산 > 아파트',
  '힐스테이트': '건설건재및부동산 > 부동산 > 아파트',
  // 관공서및단체
  '서울시': '관공서및단체 > 공공기관 > 지방자치단체',
  '행정안전부': '관공서및단체 > 공공기관 > 정부부처',
  '한국관광공사': '관공서및단체 > 단체및협회 > 비영리단체',
  // 교육및복지후생
  '메가스터디': '교육및복지후생 > 교육 > 온라인교육',
  '대교': '교육및복지후생 > 교육 > 학원',
  '웅진씽크빅': '교육및복지후생 > 교육 > 학원',
  '야나두': '교육및복지후생 > 교육 > 어학',
  // 금융보험및증권
  '삼성생명': '금융보험및증권 > 보험 > 생명보험',
  'KB국민은행': '금융보험및증권 > 금융 > 은행',
  '신한은행': '금융보험및증권 > 금융 > 은행',
  '카카오뱅크': '금융보험및증권 > 금융 > 은행',
  '토스': '금융보험및증권 > 금융 > 금융기타',
  '삼성카드': '금융보험및증권 > 금융 > 카드',
  '미래에셋': '금융보험및증권 > 증권및투자 > 증권',
  // 그룹및기업광고
  '삼성그룹': '그룹및기업광고 > 그룹PR > 대기업그룹PR',
  'LG그룹': '그룹및기업광고 > 그룹PR > 대기업그룹PR',
  'SK그룹': '그룹및기업광고 > 그룹PR > 대기업그룹PR',
  // 기초재
  'POSCO': '기초재 > 금속및철강 > 철강',
  '현대제철': '기초재 > 금속및철강 > 철강',
  // 산업기기
  '두산': '산업기기 > 건설기계 > 굴삭기',
  '현대중공업': '산업기기 > 산업설비 > 산업설비기타',
  '볼보건설기계': '산업기기 > 건설기계 > 건설기계기타',
  // 서비스
  '배달의민족': '서비스 > 생활서비스 > 배달서비스',
  '쿠팡': '서비스 > 플랫폼및IT서비스 > 플랫폼및IT서비스기타',
  '네이버': '서비스 > 플랫폼및IT서비스 > 플랫폼및IT서비스기타',
  '카카오': '서비스 > 플랫폼및IT서비스 > 플랫폼및IT서비스기타',
  '야놀자': '서비스 > 여행및레저 > 여행',
  '여기어때': '서비스 > 여행및레저 > 호텔및숙박',
  // 수송기기
  '현대자동차': '수송기기 > 승용차 > 국산승용차',
  '기아': '수송기기 > 승용차 > 국산승용차',
  'BMW': '수송기기 > 승용차 > 수입승용차',
  '벤츠': '수송기기 > 승용차 > 수입승용차',
  '테슬라': '수송기기 > 이륜차및기타 > 전기차',
  // 식품
  'CJ제일제당': '식품 > 가공식품 > 가공식품기타',
  '오뚜기': '식품 > 조미료및소스 > 소스',
  '농심': '식품 > 가공식품 > 즉석식품',
  '풀무원': '식품 > 신선식품 > 신선식품기타',
  '동원': '식품 > 신선식품 > 육류및수산',
  // 엔터테인먼트
  '넥슨': '엔터테인먼트 > 게임 > PC게임',
  '넷마블': '엔터테인먼트 > 게임 > 모바일게임',
  '크래프톤': '엔터테인먼트 > 게임 > PC게임',
  'CJ ENM': '엔터테인먼트 > 음악및방송 > 방송',
  'CGV': '엔터테인먼트 > 영화및공연 > 영화',
  '멜론': '엔터테인먼트 > 음악및방송 > 음악',
  // 유통
  '이마트': '유통 > 대형마트및슈퍼 > 대형마트',
  '롯데마트': '유통 > 대형마트및슈퍼 > 대형마트',
  'GS25': '유통 > 편의점및전문점 > 편의점',
  'CU': '유통 > 편의점및전문점 > 편의점',
  '11번가': '유통 > 온라인쇼핑 > 오픈마켓',
  // 음료및기호식품
  '코카콜라': '음료및기호식품 > 음료 > 탄산음료',
  '롯데칠성': '음료및기호식품 > 음료 > 음료기타',
  '스타벅스': '음료및기호식품 > 기호식품 > 커피',
  '빙그레': '음료및기호식품 > 음료 > 음료기타',
  // 정밀기기및사무기기
  '캐논': '정밀기기및사무기기 > 사무기기 > 복합기',
  '후지필름': '정밀기기및사무기기 > 정밀기기 > 광학기기',
  '니콘': '정밀기기및사무기기 > 정밀기기 > 광학기기',
  // 제약및의료
  '유한양행': '제약및의료 > 의약품 > 전문의약품',
  '동아제약': '제약및의료 > 의약품 > 의약품기타',
  '한미약품': '제약및의료 > 의약품 > 전문의약품',
  '종근당': '제약및의료 > 의약품 > 건강기능식품',
  // 출판
  '교보문고': '출판 > 도서및잡지 > 도서',
  '예스24': '출판 > 온라인콘텐츠 > 디지털콘텐츠',
  '밀리의서재': '출판 > 온라인콘텐츠 > 전자책',
  // 컴퓨터및정보통신
  'SK텔레콤': '컴퓨터및정보통신 > 네트워크및통신 > 통신서비스',
  'KT': '컴퓨터및정보통신 > 네트워크및통신 > 통신서비스',
  'LG유플러스': '컴퓨터및정보통신 > 네트워크및통신 > 통신서비스',
  '삼성SDS': '컴퓨터및정보통신 > 소프트웨어 > 업무용SW',
  // 패션
  '나이키': '패션 > 스포츠의류및용품 > 스포츠의류',
  '아디다스': '패션 > 스포츠의류및용품 > 스포츠의류',
  '자라': '패션 > 패션의류 > 여성의류',
  '유니클로': '패션 > 패션의류 > 패션의류기타',
  '무신사': '패션 > 잡화및액세서리 > 잡화및액세서리기타',
  // 화장품및보건용품
  '아모레퍼시픽': '화장품및보건용품 > 기초화장품 > 스킨케어',
  'LG생활건강': '화장품및보건용품 > 헤어및바디 > 헤어케어',
  '이니스프리': '화장품및보건용품 > 기초화장품 > 기초화장품기타',
  '에뛰드': '화장품및보건용품 > 색조화장품 > 색조화장품기타',
  // 화학공업
  'LG화학': '화학공업 > 석유화학 > 화학소재',
  '롯데케미칼': '화학공업 > 석유화학 > 석유화학기타',
  '한화솔루션': '화학공업 > 화학제품 > 화학제품기타',
}

// 매체별 광고상품 데이터 구조
export interface AdProductField {
  label: string
  key: string
  required: boolean
  options: string[]
}

export interface MediaAdProductStructure {
  fields: AdProductField[]
}

export interface MetaAdProductCombination {
  campaignObjective: string
  buyingType: string
  performanceGoal: string
  platform: string
}

export const adProductsByMedia: { [media: string]: string[] } = {
  'Google Ads': [
    '검색 광고',
    '디스플레이 광고',
    '동영상 광고 (YouTube)',
    '쇼핑 광고',
    '앱 광고',
    '스마트 캠페인',
    '디스커버리 광고',
    'Performance Max'
  ],
  'Meta': [], // Meta는 4단계 구조로 별도 처리
  'kakao모먼트': [
    '카카오톡 비즈보드',
    '카카오톡 채널 광고',
    '카카오스토리 광고',
    'Daum 디스플레이',
    '카카오톡 메시지 광고',
    '브랜드 검색 광고'
  ],
  '네이버 성과형 DA': [
    '파워링크',
    '쇼핑검색',
    '브랜드검색',
    'GFA (보장형 배너)',
    '동영상 광고',
    '네이티브 광고'
  ],
  '네이버 보장형 DA': [
    '프리미엄 배너',
    '메인 롤링보드',
    '브랜드 배너',
    '동영상 배너',
    '네이티브 보드'
  ],
  'TikTok': [
    'In-Feed 광고',
    'TopView 광고',
    'Brand Takeover',
    'Branded Hashtag Challenge',
    'Branded Effects',
    'Spark Ads'
  ]
}

// Meta 광고 지표 데이터
export interface MetricItem {
  id: string
  label: string
  selected: boolean
}

export interface MetricGroup {
  group: string
  metrics: MetricItem[]
}

export { metaMetrics } from './metaMetrics'

// Google Ads 지표
export const googleMetrics: MetricGroup[] = [
  {
    group: '실적',
    metrics: [
      { id: 'cost', label: '광고비', selected: false },
      { id: 'impressions', label: '노출수', selected: false },
      { id: 'clicks', label: '클릭수', selected: false },
      { id: 'views', label: '조회수', selected: false },
      { id: 'cpc', label: '클릭당 비용(CPC)', selected: false },
      { id: 'cpm', label: '1,000회 노출당 비용(CPM)', selected: false },
      { id: 'ctr', label: '클릭률(CTR)', selected: false },
      { id: 'cpv', label: '조회당 비용(CPV)', selected: false },
      { id: 'vtr', label: '조회율(VTR)', selected: false },
      { id: 'video_views_25', label: '25% 재생수', selected: false },
      { id: 'video_views_50', label: '50% 재생수', selected: false },
      { id: 'video_views_75', label: '75% 재생수', selected: false },
      { id: 'video_views_100', label: '100% 재생수', selected: false },
      { id: 'video_views_25_rate', label: '25% 재생 진행률', selected: false },
      { id: 'video_views_50_rate', label: '50% 재생 진행률', selected: false },
      { id: 'video_views_75_rate', label: '75% 재생 진행률', selected: false },
      { id: 'video_views_100_rate', label: '100% 재생 진행률', selected: false },
      { id: 'interactions', label: '상호작용 수', selected: false },
    ]
  },
  {
    group: '전환',
    metrics: [
      { id: 'conversions', label: '전환수', selected: false },
      { id: 'conversion_rate', label: '전환율(전체)', selected: false },
      { id: 'cost_per_conversion', label: '전환당 비용', selected: false },
      { id: 'purchases', label: '구매수', selected: false },
      { id: 'cost_per_purchase', label: '구매당 비용', selected: false },
      { id: 'installs', label: '설치수', selected: false },
      { id: 'install_rate', label: '설치율', selected: false },
      { id: 'cost_per_install', label: '설치당 비용', selected: false },
    ]
  }
]

// Kakao Moment 지표
export const kakaoMetrics: MetricGroup[] = [
  {
    group: '기본',
    metrics: [
      { id: 'cost', label: '비용', selected: false },
      { id: 'impressions', label: '노출수', selected: false },
      { id: 'clicks', label: '클릭수', selected: false },
      { id: 'cpc', label: '클릭당 비용', selected: false },
      { id: 'cpm', label: '노출당 비용', selected: false },
      { id: 'ctr', label: '클릭률', selected: false },
      { id: 'cpv', label: '재생당 비용', selected: false },
      { id: 'vtr', label: 'VTR (3초 이상 재생률)', selected: false },
      { id: 'video_views', label: '재생수', selected: false },
      { id: 'video_play_cost', label: '재생당 비용', selected: false },
      { id: 'conversions', label: '전환수', selected: false },
    ]
  },
  {
    group: '동영상',
    metrics: [
      { id: 'video_views_25', label: '25% 재생수', selected: false },
      { id: 'video_views_50', label: '50% 재생수', selected: false },
      { id: 'video_views_75', label: '75% 재생수', selected: false },
      { id: 'video_views_100', label: '100% 재생수', selected: false },
      { id: 'video_views_3s', label: '3초 재생수', selected: false },
      { id: 'video_views_10s', label: '10초 재생수', selected: false },
      { id: 'video_views_15s', label: '15초 재생수', selected: false },
      { id: 'video_views_30s', label: '30초 재생수', selected: false },
      { id: 'video_views_60s', label: '60초 재생수', selected: false },
      { id: 'video_views_10s_cost', label: '10초 이상 재생당 비용', selected: false },
      { id: 'video_views_15s_cost', label: '15초 이상 재생당 비용', selected: false },
      { id: 'video_views_25_rate', label: '동영상 25% 진행률', selected: false },
      { id: 'video_views_50_rate', label: '동영상 50% 진행률', selected: false },
      { id: 'video_views_75_rate', label: '동영상 75% 진행률', selected: false },
      { id: 'video_views_100_rate', label: '동영상 100% 진행률', selected: false },
    ]
  },
  {
    group: '발송',
    metrics: [
      { id: 'message_send', label: '발송수', selected: false },
      { id: 'message_open', label: '열람수', selected: false },
      { id: 'message_click', label: '전체 클릭수', selected: false },
      { id: 'message_open_rate', label: '열람률', selected: false },
      { id: 'message_click_rate', label: '메시지 클릭률', selected: false },
    ]
  },
  {
    group: '카카오 친구',
    metrics: [
      { id: 'channel_add_cpa', label: 'CPA', selected: false },
      { id: 'channel_add_cvr', label: 'CVR', selected: false },
    ]
  }
]

// Naver GFA (성과형 DA) 지표
export const naverGfaMetrics: MetricGroup[] = [
  {
    group: '기본',
    metrics: [
      { id: 'cost', label: '매출(소진금액)', selected: false },
      { id: 'impressions', label: '노출수', selected: false },
      { id: 'clicks', label: '클릭수', selected: false },
      { id: 'cpc', label: '클릭당 비용', selected: false },
      { id: 'cpm', label: '1,000회 노출당 비용', selected: false },
      { id: 'ctr', label: '클릭률', selected: false },
    ]
  },
  {
    group: '재생',
    metrics: [
      { id: 'cpv', label: '조회당 비용', selected: false },
      { id: 'vtr', label: '조회율', selected: false },
      { id: 'video_views', label: '비디오 재생 횟수', selected: false },
    ]
  },
  {
    group: '전환',
    metrics: [
      { id: 'conversions', label: '전환수', selected: false },
      { id: 'cost_per_conversion', label: '전환당 비용', selected: false },
    ]
  }
]

// Naver NOSP (보장형 DA) 지표
export const naverNospMetrics: MetricGroup[] = [
  {
    group: '기본',
    metrics: [
      { id: 'cost', label: '광고비', selected: false },
      { id: 'cost_guaranteed', label: '집행금액', selected: false },
      { id: 'impressions', label: '노출수', selected: false },
      { id: 'clicks', label: '클릭수', selected: false },
      { id: 'video_views', label: '동영상 조회수', selected: false },
      { id: 'cpc', label: 'CPC', selected: false },
      { id: 'cpm', label: 'CPM', selected: false },
      { id: 'cpv', label: 'CPV', selected: false },
      { id: 'ctr', label: 'CTR', selected: false },
      { id: 'vtr', label: 'VTR', selected: false },
    ]
  },
  {
    group: '재생 상세',
    metrics: [
      { id: 'video_views_25', label: '동영상 25% 재생수', selected: false },
      { id: 'video_views_50', label: '동영상 50% 재생수', selected: false },
      { id: 'video_views_75', label: '동영상 75% 재생수', selected: false },
      { id: 'video_views_100', label: '동영상 100% 재생수', selected: false },
      { id: 'video_views_3s', label: '동영상 3초 재생수', selected: false },
      { id: 'video_views_10s', label: '동영상 10초 재생수', selected: false },
    ]
  },
]
// TikTok 지표
export const tiktokMetrics: MetricGroup[] = [
  {
    group: '주요',
    metrics: [
      { id: 'spend', label: '광고 소진금액', selected: false },
      { id: 'impressions', label: '노출수', selected: false },
      { id: 'clicks', label: '클릭수', selected: false },
      { id: 'conversions', label: '전환수', selected: false },
      { id: 'video_plays', label: '재생수', selected: false },
      { id: 'cpc', label: 'CPC', selected: false },
      { id: 'cpm', label: 'CPM', selected: false },
      { id: 'cpv', label: 'CPV', selected: false },
      { id: 'cpa', label: 'CPA', selected: false },
      { id: 'ctr', label: '클릭률', selected: false },
      { id: 'vtr', label: '재생율', selected: false },
      { id: 'cvr', label: '전환율', selected: false },
    ]
  },
  {
    group: '상호작용',
    metrics: [
      { id: 'video_view_25', label: '동영상 25% 재생', selected: false },
      { id: 'video_view_50', label: '동영상 50% 재생', selected: false },
      { id: 'video_view_75', label: '동영상 75% 재생', selected: false },
      { id: 'video_view_100', label: '동영상 100% 재생', selected: false },
      { id: 'video_views_2s', label: '2초 이상 동영상 시청', selected: false },
      { id: 'video_views_6s', label: '6초 이상 동영상 시청', selected: false },
    ]
  }
]

export const yearOptions = ['2023', '2024', '2025', '2026']
export const monthOptions = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
export const quarterOptions = ['1분기', '2분기', '3분기', '4분기']

// 매체별 타겟팅 옵션
export interface TargetingOption {
  category: string
  options: string[]
}

export const targetingOptionsByMedia: { [media: string]: TargetingOption[] } = {
  'Google Ads': [
    {
      category: '기기유형',
      options: ['컴퓨터', '휴대전화', '태블릿', 'TV 화면', '기타']
    }
  ],
  'Meta': [
    {
      category: '기기유형',
      options: ['모바일 웹', '앱 내', '데스크톱', '분류되지 않음']
    }
  ],
  'kakao모먼트': [
    {
      category: '성별',
      options: ['남', '여', '성별 알 수 없음']
    },
    {
      category: '연령',
      options: ['15~19', '20~24', '25~29', '30~34', '35~39', '40~44', '45~49', '50~54', '55~59', '60~64', '65~69', '70 이상', '연령 알 수 없음']
    },
    {
      category: '성별x연령',
      options: ['남성 15~19', '남성 20~24', '남성 25~29', '남성 30~34', '남성 35~39', '남성 40~44', '남성 45~49', '남성 50~54', '남성 55~59', '남성 60~64', '남성 65~69', '남성 70 이상', '여성 15~19', '여성 20~24', '여성 25~29', '여성 30~34', '여성 35~39', '여성 40~44', '여성 45~49', '여성 50~54', '여성 55~59', '여성 60~64', '여성 65~69', '여성 70 이상']
    },
    {
      category: '지역',
      options: ['서울특별시', '경기도', '인천광역시', '부산광역시', '대구광역시', '대전광역시', '광주광역시', '울산광역시', '세종특별자치시', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도', '해외', '알 수 없음']
    },
    {
      category: '디바이스',
      options: ['Android', 'iOS', 'PC', '기타']
    },
    {
      category: '게재지면',
      options: ['카카오톡', '다음', '카카오서비스', '네트워크', '카카오스토리']
    }
  ],
  '네이버 성과형 DA': [],
  '네이버 보장형 DA': [
    {
      category: '노출영역',
      options: [
        'M_치지직_인스트림_LIVE_중간광고(s)',
        'M_치지직_인스트림_동영상광고(s)',
        'M_치지직_인스트림_생중계 전광고(s)',
        'M_치지직_인스트림_엔터_코스트리밍_생중계 전광고(s)',
        'M_치지직_인스트림_엔터_코스트리밍_생중계 중간광고(s',
        'M_치지직_인스트림_코스트리밍_생중계_전광고_1',
        'P_치지직_인스트림_LIVE_중간광고(s)',
        'P_치지직_인스트림_동영상광고(s)',
        'P_치지직_인스트림_생중계 전광고(s)',
        'P_치지직_인스트림_엔터_코스트리밍_생중계 전광고(s)',
        'P_치지직_인스트림_엔터_코스트리밍_생중계 중간광고(s',
        'P_치지직_인스트림_코스트리밍_생중계_전광고_1'
      ]
    },
    {
      category: '시간',
      options: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
    }
  ],
  'TikTok': [
    {
      category: '플랫폼',
      options: ['Android', 'iPhone', 'iPad', 'WAP (모바일 웹)', '알 수 없음']
    },
    {
      category: '성별',
      options: ['남성', '여성', '성별 알 수 없음']
    },
    {
      category: '연령',
      options: ['13~17', '18~24', '25~34', '35~44', '45~54', '55+', '연령 알 수 없음']
    },
    {
      category: '성별X연령',
      options: ['남성 13~17', '남성 18~24', '남성 25~34', '남성 35~44', '남성 45~54', '남성 55+', '남성 연령 알 수 없음', '여성 13~17', '여성 18~24', '여성 25~34', '여성 35~44', '여성 45~54', '여성 55+', '여성 연령 알 수 없음', '성별 알 수 없음 13~17', '성별 알 수 없음 18~24', '성별 알 수 없음 25~34', '성별 알 수 없음 35~44', '성별 알 수 없음 45~54', '성별 알 수 없음 55+', '성별 알 수 없음 연령 알 수 없음']
    },
    {
      category: '국가',
      options: ['한국', '일본', '미국', '영국', '독일', '프랑스', '이탈리아', '스페인', '캐나다', '포르투갈', '아르헨티나', '볼리비아', '콜롬비아', '우루과이', '에콰도르', '싱가포르', '홍콩', '대만', '베트남', '태국', '필리핀', '인도네시아', '말레이시아', '파키스탄', 'UAE', '사우디아라비아', '카타르', '쿠웨이트', '오만', '레바논', '이집트', '터키', '오스트리아', '폴란드', '브라질', '칠레', '페루', '코스타리카', '남아프리카공화국', '멕시코', '알 수 없음']
    }
  ]
}

// Meta 광고상품 샘플 데이터 (실제로는 API에서 가져와야 함)
export const metaAdProductCombinations: MetaAdProductCombination[] = [
  // CONVERSIONS 샘플
  { campaignObjective: 'CONVERSIONS', buyingType: 'AUCTION', performanceGoal: 'OFFSITE_CONVERSIONS', platform: 'facebook' },
  { campaignObjective: 'CONVERSIONS', buyingType: 'AUCTION', performanceGoal: 'OFFSITE_CONVERSIONS', platform: 'instagram' },
  { campaignObjective: 'CONVERSIONS', buyingType: 'AUCTION', performanceGoal: 'LINK_CLICKS', platform: 'facebook' },
  { campaignObjective: 'CONVERSIONS', buyingType: 'AUCTION', performanceGoal: 'LINK_CLICKS', platform: 'instagram' },
  { campaignObjective: 'CONVERSIONS', buyingType: 'RESERVED', performanceGoal: 'OFFSITE_CONVERSIONS', platform: 'facebook' },
  
  // LEAD_GENERATION 샘플
  { campaignObjective: 'LEAD_GENERATION', buyingType: 'AUCTION', performanceGoal: 'LEAD_GENERATION', platform: 'facebook' },
  { campaignObjective: 'LEAD_GENERATION', buyingType: 'AUCTION', performanceGoal: 'LEAD_GENERATION', platform: 'instagram' },
  { campaignObjective: 'LEAD_GENERATION', buyingType: 'AUCTION', performanceGoal: 'QUALITY_LEAD', platform: 'facebook' },
  
  // OUTCOME_TRAFFIC 샘플
  { campaignObjective: 'OUTCOME_TRAFFIC', buyingType: 'AUCTION', performanceGoal: 'LINK_CLICKS', platform: 'facebook' },
  { campaignObjective: 'OUTCOME_TRAFFIC', buyingType: 'AUCTION', performanceGoal: 'LINK_CLICKS', platform: 'instagram' },
  { campaignObjective: 'OUTCOME_TRAFFIC', buyingType: 'AUCTION', performanceGoal: 'LANDING_PAGE_VIEWS', platform: 'facebook&instagram' },
  
  // VIDEO_VIEWS 샘플
  { campaignObjective: 'VIDEO_VIEWS', buyingType: 'AUCTION', performanceGoal: 'THRUPLAY', platform: 'facebook' },
  { campaignObjective: 'VIDEO_VIEWS', buyingType: 'AUCTION', performanceGoal: 'VIDEO_VIEWS', platform: 'instagram' },
  { campaignObjective: 'VIDEO_VIEWS', buyingType: 'RESERVED', performanceGoal: 'THRUPLAY', platform: 'facebook&instagram' }
]

// 네이버 보장형 DA 키워드 목 데이터 (실제로는 API에서 24,666개 로드)
export const naverNospKeywords: string[] = [
  '삼성 갤럭시 S24', '삼성 갤럭시 Z플립6', '삼성 갤럭시 Z폴드6', '삼성전자', '삼성 비스포크',
  '아이폰16', '아이폰16 프로', '아이폰15', '애플 맥북', '애플 아이패드',
  'LG 그램', 'LG 스탠바이미', 'LG 올레드 TV', 'LG 퓨리케어', 'LG 디오스',
  '현대자동차', '현대 아이오닉', '현대 캐스퍼', '기아 EV6', '기아 EV9',
  '나이키 에어맥스', '나이키 덩크', '아디다스 삼바', '뉴발란스 530', '아식스 젤',
  '올리브영', '다이소', '쿠팡', '무신사', '마켓컬리',
  '스타벅스', '투썸플레이스', '이디야커피', '메가커피', '컴포즈커피',
  '신한카드', '삼성카드', '현대카드', '국민카드', '롯데카드',
  '토스', '카카오뱅크', '케이뱅크', '네이버페이', '카카오페이',
  '배달의민족', '요기요', '쿠팡이츠', '당근마켓', '번개장터',
  '넷플릭스', '디즈니플러스', '웨이브', '티빙', '왓챠',
  '하이트진로', '참이슬', '카스', '테라', '클라우드',
  '설화수', '라네즈', '이니스프리', '에뛰드', '미샤',
  'SK텔레콤', 'KT', 'LG유플러스', 'SKT 5G', 'KT 인터넷',
  '대한항공', '아시아나항공', '제주항공', '진에어', '티웨이항공',
]
