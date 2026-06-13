import type { UIStrings } from "./en";

/**
 * Korean (ko). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const ko: UIStrings = {
  meta: {
    title: "DrFurman.ai — AI 기반 Nutritarian 가이드, 24/7",
    description:
      "Dr. Fuhrman의 전체 코퍼스(12권의 책, 모든 영상 강의, 20,000+개의 회원 Q&A, 180개의 모든 제품)로 학습된 AI와 채팅하세요. Gemini 3.5 Flash가 구사하는 모든 언어로 24/7 이용 가능합니다.",
    ogTitle: "DrFurman.ai — AI 기반 Nutritarian 가이드, 24/7",
    ogDescription:
      "Dr. Joel Fuhrman의 모든 업적으로 학습된 어시스턴트와 24/7 채팅하세요.",
    ogImageAlt: "Dr. Fuhrman AI — 모든 책, 모든 강의, 모든 답변.",
    twitterTitle: "DrFurman.ai — AI 기반 Nutritarian 가이드, 24/7",
    twitterDescription:
      "Dr. Joel Fuhrman의 모든 업적으로 학습된 어시스턴트와 24/7 채팅하세요.",
  },

  nav: {
    chat: "AI와 채팅하기",
    corpus: "AI가 아는 것",
    examples: "예시",
    comingSoon: "출시 예정",
    language: "언어",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "이미 drfuhrman.com 회원이신가요?",
    memberLoginCta: "로그인",
    headline: "모든 책. 모든 강의. 모든 답변.",
  },

  corpus: {
    headline: "Dr. Fuhrman의{br}40년에 걸친 연구를 바탕으로 합니다.",
    subheading:
      "DFO AI는 추측하지 않습니다. Dr. Fuhrman의 실제 코퍼스를 기반으로 답합니다.",
    stats: {
      everyWord: "모든",
      lecturesUnit: "영상 강의",
      lecturesFlavor:
        "Dr. Fuhrman이 진행한 모든 녹화 강의를 색인화하여 쉬운 언어로 답변할 수 있습니다.",
      booksUnit: "권의 책",
      booksFlavor:
        "Eat to Live부터 Fast Food Genocide까지, Dr. Fuhrman의 출판된 전체 도서.",
      qasUnit: "개의 회원 Q&A",
      qasFlavor:
        "Dr. Fuhrman이 수년에 걸쳐 Member Center 커뮤니티에 직접 제공한 답변들.",
      productsUnit: "제품",
      productsFlavor:
        "DrFuhrman.com의 모든 보충제와 제품, 전체 성분 및 사양 데이터 포함.",
    },
    languagePrefix: "Gemini 3.5 Flash가 지원하는 모든 언어로 이용 가능",
    videoAriaLabel:
      "신선한 브로콜리, 케일, 블루베리, 호두, 그리고 채팅 화면이 표시된 스마트폰에 둘러싸여 따뜻한 나무 테이블 위에 펼쳐진 하드커버 건강 서적",
  },

  examples: {
    headline: "DFO AI에게 실제 질문을 해보세요.",
    description:
      "아무 질문이나 클릭하면 위의 채팅에 입력됩니다. 입력란에 포커스가 가므로 {kbd}Enter{/kbd}를 눌러 전송할 수 있습니다.",
    questions: [
      "Nutritarian 식단을 시작하는 가장 간단한 방법은 무엇인가요?",
      "인슐린 감수성에 대해 알려주세요.",
      "고혈압에 대해 Dr. Fuhrman은 무엇을 권장하나요?",
      "5일 Nutritarian 챌린지는 어떻게 하나요?",
      "십자화과 채소와 잎채소의 차이는 무엇인가요?",
      "Dr. Fuhrman의 책 중 어떤 것을 먼저 읽어야 하나요?",
    ],
    ctaHint: "채팅에 입력하기 →",
    videoAriaLabel:
      "햇살이 드는 주방에서 베리와 신선한 채소가 담긴 그릇 위로 스마트폰의 DFO AI를 확인하는 사람",
  },

  chat: {
    welcomeMessage:
      "안녕하세요, 저는 Dr. Joel Fuhrman의 AI입니다. 당신이 건강의 주도권을 되찾도록 돕기 위해 여기 있어요 — 요즘 마음에 걸리는 것이 있으신가요?",
    starters: [
      "안녕하세요, Dr. Fuhrman AI. 더 건강한 생활 방식을 시작하기 위해 제가 취할 수 있는 단계를 알려주실 수 있나요?",
      "안녕하세요, Dr. Fuhrman AI. Nutritarian이 무엇인지 알려주실 수 있나요?",
      "안녕하세요, Dr. Fuhrman AI. 인슐린 감수성에 대해 알려주실 수 있나요?",
    ],
    tryAsking: "이렇게 물어보세요",
    emailLabel: "먼저, 이메일 주소를 알려주세요.",
    emailLabelValid: "이메일 주소",
    emailAriaLabel: "이메일 주소",
    emailPlaceholderSticky: "먼저, 채팅을 시작하려면 이메일을…",
    askButton: "질문하기",
    questionPlaceholder: "질문을 입력하세요…",
    questionAriaLabel: "Dr. Fuhrman AI에게 질문하기",
    questionPlaceholderSticky:
      "Dr. Fuhrman AI에게 질문하세요 — 식사, 질병 개선, 체중 감량 등…",
    sendAriaLabel: "메시지 보내기",
    disclaimer: [
      "중요한 정보는 다시 확인하세요.",
      "의학적 조언을 대신하지 않습니다.",
      "AI는 실수를 할 수 있습니다.",
    ],
    errorEmailRequired: "채팅을 시작하려면 위에 이메일 주소를 입력하세요.",
    errorEmailInvalid: "유효한 이메일 주소를 입력하세요.",
    errorEmailTooLong: "이메일 주소가 너무 깁니다.",
    errorDisposable:
      "영구적인 이메일 주소를 사용해 주세요 — 일회용 메일함은 지원되지 않습니다.",
    errorNetwork:
      "네트워크 오류 — 해당 메시지가 전송되지 않았습니다. 다시 시도해 주세요.",
    quotaExhaustedNudge:
      "무료 메시지를 모두 사용하셨습니다 — Dr. Fuhrman의 AI와 대화를 계속하세요.",
    signupHeadline: "Dr. Fuhrman의 AI와 계속 대화하고 싶으신가요?",
    signupBody:
      "DrFuhrman.com에서 대화를 이어가고, Nutritarian의 완전한 멤버십 경험을 누려보세요.",
    signupButton: "DrFuhrman.com에서 가입하기",
  },

  transcript: {
    heading: "코퍼스에서 곧바로 나온, 진짜 답변",
    subheading:
      "Dr. Fuhrman AI와 나눈 실제 대화 하나 — 모든 답변은 그의 저서, 강의, 방송에 근거하며 정확한 출처가 함께 표시됩니다. 스크롤하여 전체를 읽어보세요.",
    online: "온라인",
    assistantLabel: "어시스턴트",
    recommendationPrefix: "이것에 관심이 있으실 것 같았습니다",
    composerAria: "채팅에서 직접 질문하기",
    composerPlaceholder: "Dr. Fuhrman의 AI에게 직접 질문해 보세요…",
    questions: [
      "Nutritarian 식단을 시작하기 위한 처음 세 단계는 무엇인가요?",
      "한 문장으로, Nutritarian 식단이란 무엇인가요?",
      "영양이 풍부한 잎채소 세 가지를 알려주세요.",
    ],
    answers: [
      [
        "제 저서 *Eat for Health* 에 근거하면, 건강한 Nutritarian 식단으로 전환하기 위한 처음 세 단계는 다음과 같습니다 [[7]]:",
        "**1. 미량 영양소가 풍부한 음식을 선호하도록 사고방식과 입맛을 다시 프로그래밍하세요.** 당신은 사고방식을 바꿔야 합니다. 무엇을 포기하는지에 집중하는 대신, 몸에 영양을 공급하고 몸을 보호하는 데 가장 효과적인 음식 — 잎채소, 콩, 양파, 버섯, 베리, 씨앗 — 을 갈망하도록 스스로를 훈련하세요. 이런 음식을 먹다 보면 미각이 실제로 변하고, 한때 밋밋하고 지루하게 느껴지던 것이 생생하고 만족스러운 것으로 바뀝니다.",
        "**2. 미량 영양소가 풍부한 음식을 식단의 토대로 삼아, 과식으로 이어지는 중독성 허기 증상을 없애세요.** 대부분의 사람들은 「독성 허기」의 악순환에 갇혀 있습니다 — 이는 영양가 낮은 가공식품에서 벗어날 때 생기는 떨림, 두통, 갈망입니다. 영양 밀도가 높은 음식을 중심으로 식단을 구성하면 그 중독적인 끌림이 줄어듭니다. 위장에 불편한 해독 증상이 나타나는 대신 목에서 진정한 허기를 느끼게 되고, 몸은 마침내 적절한 양의 칼로리로 만족하게 됩니다.",
        "**3. 매일의 식단에서 건강하지 않은 음식을 제한하세요.** 영양이 풍부한 음식으로 접시를 채워 가면, 가공되고 정제된, 그리고 동물성 제품은 자연스럽게 줄어듭니다. 하루 만에 완벽해지는 것이 아닙니다 — 미량 영양소가 풍부한 식물성 음식을 주인공으로 삼고, 건강하지 않은 선택지들이 더는 당신을 붙들지 못할 때까지 가장자리로 밀려나게 하는 것입니다.",
        "이 세 단계는 함께 작동하며, 완전히 분리할 수 없습니다. 식단의 영양 밀도가 높아질수록 영양가 낮은 음식에 대한 욕구는 줄어들고, 중독이 아니라 진정한 건강을 위해 먹는 능력이 저절로 몸에 배게 됩니다 [[7]].",
      ],
      [
        "Nutritarian 식단은 건강이 칼로리당 영양소와 같다는 원칙 [[4]] 위에 세워진 영양이 풍부한 식사 방식으로, 녹색 채소, 콩, 양파, 버섯, 베리, 씨앗을 강조하여 칼로리당 미량 영양소를 극대화하는 한편, 가공식품, 설탕, 흰 밀가루, 정제유는 피합니다 [[1]][[5]].",
      ],
      [
        "**케일, 콜라드 그린, 시금치** 를 추천하고 싶습니다. 이 진한 잎채소들은 영양 밀도 지표에서 가장 높은 자리 — 100점 만점에 100점 — 를 차지합니다. 비타민, 미네랄, 그리고 질병으로부터 보호하는 암과 싸우는 식물성 화학물질이 가득하기 때문입니다 [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "출시 예정",
    headline: "DFO AI를 어디든 함께 가져가세요.",
    cards: [
      {
        badge: "iOS + Android",
        title: "음식 사진 인식 기능을 갖춘 네이티브 모바일 앱",
        body: "식료품점, 주방 또는 식당에서 음식 사진을 찍으세요. DFO AI가 그것이 Nutritarian 라이프스타일에 맞는지, 맞지 않다면 무엇으로 바꿔야 하는지 즉시 알려줍니다.",
        imageAlt:
          "파머스 마켓에서 스마트폰을 들고, 카메라가 신선한 케일과 토마토를 초록색 분석 링으로 비추고 있는 사람",
      },
      {
        badge: "오프라인 · Gemma 4",
        title: "DFO AI, 기기에서 완전히 실행",
        body: "Google의 Gemma 4 오픈 모델로 구동되는 DFO AI의 압축 버전입니다. 비행기 안, 외딴 주방, 보충제 진열대 안쪽에서도 작동합니다. 연결이 필요 없습니다.",
        imageAlt:
          "비행기 창가 좌석에서 스마트폰의 DFO AI를 사용하는 여행자, 창밖으로 부드러운 황금빛 노을 구름이 보임",
      },
    ],
  },

  bios: {
    headline: "AI를 만든 사람들.",
    subheading:
      "DFO AI의 목소리는 Dr. Joel과 Dr. Cara Fuhrman의 수십 년에 걸친 임상 경험과 교육에 뿌리를 두고 있습니다.",
    roles: [
      "공인 가정의학과 전문의, 저자, 영양 연구자",
      "가정의학과 전문의, 식물 기반 영양 옹호자",
    ],
    bodies: [
      "Dr. Fuhrman은 New York Times 베스트셀러 1위 저자이자 영양 의학을 전문으로 하는 공인 가정의학과 전문의입니다. 그는 영양적 우수성을 추구하는 식단을 설명하기 위해 Nutritarian이라는 용어를 만들었으며, 미량 영양소가 풍부한 식단이 만성 질환을 예방하고 되돌릴 수 있는 방법을 기록하는 데 40년에 걸친 임상 경험과 연구를 바쳤습니다.",
      "Dr. Cara Fuhrman은 식물 기반 영양과 가족이 평생의 건강한 습관을 만들도록 돕는 일에 열정을 가진 가정의학과 전문의입니다. 그녀는 Dr. Joel Fuhrman과 협력하여 Nutritarian 접근법을 더 넓은 대중에게 전하는 교육 프로그램을 진행합니다. 아버지와 함께 그녀는 San Diego에 위치한 첨단 장수 의학 클리닉 LongevityRx를 공동 설립했습니다.",
    ],
    footerPrefix: "전체 약력, 책, 연구는 다음에서 확인하세요",
  },

  cta: {
    headline: "Dr. Fuhrman의 AI에게 질문할 준비가 되셨나요?",
    description:
      "무료로 사용해 보세요. 시작하는 데 계정이 필요 없습니다. 채팅은 이 페이지 맨 위에 있습니다.",
    buttonText: "지금 DFO AI 사용해 보기",
  },

  footer: {
    poweredBy: "제공",
    aiSafety: "AI 안전 및 윤리",
    terms: "약관",
    privacy: "개인정보 보호",
  },
};
