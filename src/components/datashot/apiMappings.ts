// API 값 - 한글 매핑 데이터

// Facebook API 매핑
export const facebookMapping = {
  campaign_buying_type: {
    "AUCTION": "경매",
    "RESERVED": "예약"
  },
  campaign_objective: {
    "APP_INSTALLS": "앱 설치",
    "BRAND_AWARENESS": "브랜드 인지도",
    "CONVERSIONS": "전환",
    "EVENT_RESPONSES": "이벤트 응답",
    "LEAD_GENERATION": "잠재 고객 확보",
    "LINK_CLICKS": "트래픽",
    "MESSAGES": "메시지",
    "MOBILE_APP_INSTALLS": "모바일 앱 설치",
    "OFFER_CLAIMS": "쿠폰 발급",
    "OUTCOME_APP_PROMOTION": "앱 홍보",
    "OUTCOME_AWARENESS": "인지도",
    "OUTCOME_ENGAGEMENT": "참여",
    "OUTCOME_LEADS": "잠재 고객",
    "OUTCOME_SALES": "판매",
    "OUTCOME_TRAFFIC": "트래픽",
    "PAGE_LIKES": "페이지 좋아요",
    "POST_ENGAGEMENT": "게시물 참여",
    "PRODUCT_CATALOG_SALES": "카탈로그 판매",
    "REACH": "도달",
    "STORE_VISITS": "매장 유입",
    "VIDEO_VIEWS": "동영상 조회"
  },
  adset_optimization_goal: {
    "APP_INSTALLS": "앱 설치수 극대화",
    "LINK_CLICKS": "링크 클릭수 극대화",
    "OFFSITE_CONVERSIONS": "앱 이벤트 수 극대화",
    "AD_RECALL_LIFT": "광고 상기도 성과 증대",
    "BRAND_AWARENESS": "브랜드 인지도",
    "IMPRESSIONS": "노출",
    "LANDING_PAGE_VIEWS": "랜딩 페이지 조회수 극대화",
    "REACH": "일일 고유 도달 극대화",
    "VALUE": "전환값 극대화",
    "EVENT_RESPONSES": "이벤트 응답",
    "LEAD_GENERATION": "잠재 고객 수 극대화",
    "CLICKS": "CLICKS",
    "POST_ENGAGEMENT": "게시물 참여 극대화",
    "VISIT_INSTAGRAM_PROFILE": "Instagram 프로필 방문 수 극대화",
    "CONVERSATIONS": "대화",
    "THRUPLAY": "ThruPlay 조회 극대화",
    "TWO_SECOND_CONTINUOUS_VIDEO_VIEWS": "동영상 연속 2초 이상 재생 극대화",
    "PAGE_LIKES": "전환 이벤트",
    "REMINDERS_SET": "알림 설정 극대화",
    "QUALITY_CALL": "통화 수를 최대한 늘려보세요",
    "QUALITY_LEAD": "전환 잠재 고객 수 극대화",
    "PROFILE_VISIT": "Instagram 프로필 방문 수 극대화",
    "VIDEO_VIEWS": "동영상 10초 이상 조회"
  }
}

// Google API 매핑
export const googleMapping = {
  campaign_objective: {
    "VIDEO": "동영상",
    "DEMAND_GEN": "디맨드젠 캠페인",
    "DISCOVERY": "디맨드젠 캠페인",
    "MULTI_CHANNEL": "앱",
    "DISPLAY": "디스플레이",
    "PERFORMANCE_MAX": "실적 최대화"
  },
  campaign_advertising_channel_sub_type: {
    "UNSPECIFIED": "지정되지 않음",
    "VIDEO_NON_SKIPPABLE": "건너뛸 수 없음",
    "APP_CAMPAIGN_FOR_ENGAGEMENT": "앱 참여",
    "VIDEO_REACH_TARGET_FREQUENCY": "타겟 게재빈도",
    "VIDEO_SEQUENCE": "광고 순서",
    "VIDEO_ACTION": "전환 유도",
    "DISPLAY_SMART_CAMPAIGN": "스마트 디스플레이 캠페인",
    "VIDEO_OUTSTREAM": "아웃스트림",
    "APP_CAMPAIGN": "앱 설치"
  },
  campaign_bidding_strategy_type: {
    "UNRECOGNIZED": "고정 CPM",
    "TARGET_CPM": "타겟 CPM",
    "MAXIMIZE_CONVERSION_VALUE": "전환 가치 극대화",
    "MAXIMIZE_CONVERSIONS": "전환수 최대화",
    "TARGET_CPA": "타겟 CPA",
    "TARGET_SPEND": "클릭수 최대화",
    "TARGET_ROAS": "타겟 광고 투자수익(ROAS)",
    "ENHANCED_CPC": "전환 가치 극대화",
    "MANUAL_CPC": "수동 CPC",
    "MANUAL_CPM": "조회 가능 CPM",
    "MANUAL_CPV": "최대 CPV",
    "FIXED_CPM": "고정 CPM",
    "TARGET_CPV": "타겟 CPV",
    "UNKNOWN": "타겟 CPV"
  },
  adset_google_adgroup_type: {
    "UNKNOWN": "마스트헤드",
    "VIDEO_NON_SKIPPABLE_IN_STREAM": "건너뛸 수 없는 인스트림",
    "VIDEO_EFFICIENT_REACH": "효율적 잠재고객 도달",
    "UNSPECIFIED": "지정되지 않음",
    "DISPLAY_STANDARD": "디스플레이",
    "VIDEO_BUMPER": "범퍼",
    "VIDEO_RESPONSIVE": "반응형 동영상 광고",
    "VIDEO_TRUE_VIEW_IN_STREAM": "건너뛸 수 있는 인스트림",
    "VIDEO_OUTSTREAM": "아웃스트림",
    "VIDEO_TRUE_VIEW_IN_DISPLAY": "인피드 광고 동영상"
  },
  ad_google_ad_type: {
    "UNKNOWN": "마스트헤드 광고",
    "VIDEO_NON_SKIPPABLE_IN_STREAM_AD": "건너뛸 수 없는 인스트림 광고",
    "VIDEO_BUMPER_AD": "범퍼 광고",
    "VIDEO_TRUEVIEW_IN_STREAM_AD": "건너뛸 수 있는 인스트림 광고",
    "DEMAND_GEN_VIDEO_RESPONSIVE_AD": "디맨드젠 동영상 광고",
    "DISCOVERY_VIDEO_RESPONSIVE_AD": "디맨드젠 동영상 광고",
    "DEMAND_GEN_MULTI_ASSET_AD": "디맨드젠 이미지 광고",
    "DISCOVERY_MULTI_ASSET_AD": "디맨드젠 이미지 광고",
    "DEMAND_GEN_PRODUCT_AD": "디맨드젠 제품 광고",
    "DEMAND_GEN_CAROUSEL_AD": "디맨드젠 캐러셀 광고",
    "DISCOVERY_CAROUSEL_AD": "디맨드젠 캐러셀 광고",
    "APP_ENGAGEMENT_AD": "앱 참여 광고",
    "RESPONSIVE_DISPLAY_AD": "반응형 이미지 광고",
    "RESPONSIVE_SEARCH_AD": "반응형 이미지 광고",
    "VIDEO_RESPONSIVE_AD": "반응형 동영상 광고",
    "IMAGE_AD": "이미지 광고",
    "VIDEO_OUTSTREAM_AD": "아웃스트림 광고",
    "APP_AD": "앱 설치 광고",
    "IN_FEED_VIDEO_AD": "인피드 동영상 광고",
    "HTML5_UPLOAD_AD": "HTML5 광고"
  }
}


// Kakao API 매핑
export const kakaoMapping = {
  campaign_kko_campaign_type: {
    "DISPLAY": "디스플레이",
    "FOCUS_FULL_VIEW": "포커스 풀뷰",
    "PC_TALK_BOTTOM": "포커스 보드",
    "PC_TALK_RICH_POP": "리치팝 올데이",
    "PRODUCT_CATALOG": "상품 카탈로그",
    "PROFILE_FULL_VIEW": "프로필 풀뷰",
    "SPONSORED_BOARD": "스폰서드 보드",
    "TALK_BIZ_BOARD": "카카오톡비즈보드",
    "TALK_BIZ_BOARD_RESERVED": "카카오 비즈보드 CPT",
    "TALK_CHANNEL": "카카오톡 채널",
    "VIDEO": "동영상"
  },
  campaign_objective: {
    "CONVERSION": "전환",
    "VISITING": "방문",
    "REACH": "도달",
    "VIEW": "조회"
  },
  campaign_kko_objective_type: {
    "PIXEL_AND_SDK": "픽셀&SDK",
    "TALK_CHANNEL": "카카오톡채널",
    "CATALOG": "카탈로그 광고 최적화"
  },
  adset_kko_pricing_type: {
    "CPC": "CPC",
    "CPA": "CPA",
    "CPM": "CPM",
    "CPT": "CPT",
    "CPMS": "CPMS",
    "CPV": "CPV"
  },
  ad_kakao_format: {
    "CATALOG_MANUAL": "이미지 카탈로그",
    "IMAGE_BANNER": "이미지 배너",
    "IMAGE_NATIVE": "이미지 네이티브",
    "VIDEO_NATIVE": "비디오 네이티브",
    "RICH_NATIVE": "리치 네이티브",
    "CATALOG_DYNAMIC": "다이나믹 카탈로그",
    "SERVICE_CONTENT": "콘텐츠",
    "BASIC_TEXT_MESSAGE": "기본 텍스트",
    "CAROUSEL_COMMERCE_MESSAGE": "캐러셀 커머스",
    "CAROUSEL_FEED_MESSAGE": "캐러셀 피드",
    "PREMIUM_VIDEO_MESSAGE": "프리미엄 동영상",
    "WIDE_LIST_MESSAGE": "와이드 리스트",
    "WIDE_MESSAGE": "와이드 이미지"
  }
}

// Naver GFA API 매핑
export const naverGfaMapping = {
  campaign_objective: {
    "SHOPPING": "쇼핑 프로모션",
    "INSTALL_APP": "앱 전환",
    "CONVERSION": "웹사이트 전환",
    "WEB_SITE_TRAFFIC": "인지도 및 트래픽",
    "LEAD": "참여 유도",
    "WATCH_VIDEO": "동영상 조회",
    "CATALOG": "카탈로그 판매"
  },
  campaign_ng_pricing_name: {
    "CPC": "CPC",
    "CPM": "CPM",
    "CPV": "CPV"
  },
  adset_placement: {
    "M_MAIN": "네이버 > 배너 영역 > 네이버 메인",
    "M_BANNER": "네이버 > 배너 영역 > 서비스 통합",
    "N_SHOPPING": "네이버 > 쇼핑 영역",
    "F_BANNER": "네이버 패밀리 매체 > 배너 영역",
    "N_COMMUNICATION": "네이버 > 커뮤니케이션 영역",
    "M_FEED": "네이버 > 피드 영역",
    "F_SMARTCHANNEL": "네이버 패밀리 매체 > 스마트채널",
    "BAND": "네이버 패밀리 매체 > 피드 영역",
    "M_SMARTCHANNEL": "네이버 > 스마트채널",
    "NW_BANNER": "네이버 퍼포먼스 네트워크 > 배너 영역",
    "NW_SMARTCHANNEL": "네이버 퍼포먼스 네트워크 > 스마트채널",
    "N_INSTREAM": "네이버 > 인스트림 영역"
  }
}
