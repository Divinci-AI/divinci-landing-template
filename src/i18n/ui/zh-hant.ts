import type { UIStrings } from "./en";

/**
 * Chinese (Traditional) (zh-hant). Brand names, product names, and
 * numbers are kept verbatim per the en source's translation rules.
 */
export const zhHant: UIStrings = {
  meta: {
    title: "DrFurman.ai — AI 驅動的 Nutritarian 指導，24/7",
    description:
      "與 Dr. Fuhrman 的 AI 對話，它以他的全部語料庫進行訓練——12 本書、所有影片講座、20,000+ 則會員問答以及全部 180 款產品。以 Gemini 3.5 Flash 支援的每一種語言 24/7 提供服務。",
    ogTitle: "DrFurman.ai — AI 驅動的 Nutritarian 指導，24/7",
    ogDescription:
      "與以 Dr. Joel Fuhrman 全部著作訓練的助理 24/7 對話。",
    ogImageAlt: "Dr. Fuhrman AI — 每一本書、每一場講座、每一個答案。",
    twitterTitle: "DrFurman.ai — AI 驅動的 Nutritarian 指導，24/7",
    twitterDescription:
      "與以 Dr. Joel Fuhrman 全部著作訓練的助理 24/7 對話。",
  },

  nav: {
    chat: "與 AI 對話",
    corpus: "它所掌握的知識",
    examples: "範例",
    comingSoon: "即將推出",
    language: "語言",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "已經是 drfuhrman.com 會員？",
    memberLoginCta: "登入",
    headline: "每一本書。每一場講座。每一個答案。",
  },

  corpus: {
    headline: "基於 Dr. Fuhrman{br}四十年的研究建構。",
    subheading:
      "DFO AI 不靠猜測——它從 Dr. Fuhrman 真實的語料庫中給出答案。",
    stats: {
      everyWord: "每一場",
      lecturesUnit: "影片講座",
      lecturesFlavor:
        "Dr. Fuhrman 所做的每一場錄製講座，皆已建立索引並可用淺白語言作答。",
      booksUnit: "本書",
      booksFlavor:
        "Dr. Fuhrman 已出版的完整著作，從 Eat to Live 到 Fast Food Genocide。",
      qasUnit: "則會員問答",
      qasFlavor:
        "多年來 Dr. Fuhrman 親自向其 Member Center 社群給出的解答。",
      productsUnit: "款產品",
      productsFlavor:
        "DrFuhrman.com 上的每一款補充品和產品，附完整的成分與規格資料。",
    },
    languagePrefix: "以 Gemini 3.5 Flash 支援的每一種語言提供",
    videoAriaLabel:
      "一本翻開的精裝健康書擺在溫暖的木桌上，周圍環繞著新鮮的青花菜、羽衣甘藍、藍莓、核桃，以及一支顯示聊天介面的智慧型手機",
  },

  examples: {
    headline: "試著向 DFO AI 提出一個真實的問題。",
    description:
      "點擊任一問題即可將其填入上方的聊天框——你的輸入框會取得焦點，因此可以按 {kbd}Enter{/kbd} 傳送。",
    questions: [
      "開始 Nutritarian 飲食最簡單的方法是什麼？",
      "跟我說說胰島素敏感性。",
      "對於高血壓，Dr. Fuhrman 有什麼建議？",
      "如何進行為期 5 天的 Nutritarian 挑戰？",
      "十字花科蔬菜和綠葉蔬菜有什麼區別？",
      "Dr. Fuhrman 的書我應該先讀哪一本？",
    ],
    ctaHint: "填入聊天框 →",
    videoAriaLabel:
      "一個人在灑滿陽光的廚房裡，在一碗莓果和新鮮蔬菜上方用智慧型手機查看 DFO AI",
  },

  chat: {
    welcomeMessage:
      "你好，我是 Dr. Joel Fuhrman 的 AI。我在這裡幫助你重新掌控自己的健康——最近有什麼困擾你的事嗎？",
    starters: [
      "你好，Dr. Fuhrman AI。你能告訴我開始更健康的生活方式可以採取哪些步驟嗎？",
      "你好，Dr. Fuhrman AI，你能告訴我 Nutritarian 到底是什麼嗎？",
      "你好，Dr. Fuhrman AI。你能跟我說說胰島素敏感性嗎？",
    ],
    tryAsking: "試著這樣問",
    emailLabel: "首先，你的電子郵件是什麼？",
    emailLabelValid: "你的電子郵件",
    emailAriaLabel: "你的電子郵件",
    emailPlaceholderSticky: "首先，輸入你的電子郵件以開始聊天…",
    askButton: "提問",
    questionPlaceholder: "輸入你的問題…",
    questionAriaLabel: "向 Dr. Fuhrman AI 提問",
    questionPlaceholderSticky:
      "向 Dr. Fuhrman AI 提問——飲食、逆轉疾病、減重…",
    sendAriaLabel: "傳送訊息",
    disclaimer: [
      "請仔細核對重要資訊。",
      "不能取代醫療建議。",
      "AI 可能會出錯。",
    ],
    errorEmailRequired: "請在上方輸入你的電子郵件以開始聊天。",
    errorEmailInvalid: "請輸入有效的電子郵件地址。",
    errorEmailTooLong: "電子郵件地址過長。",
    errorDisposable:
      "請使用長期有效的電子郵件地址——不支援拋棄式信箱。",
    errorNetwork:
      "網路錯誤——該訊息未能傳送。請重試。",
    quotaExhaustedNudge:
      "你已用完免費訊息——繼續與 Dr. Fuhrman 的 AI 對話吧。",
    signupHeadline: "想繼續與 Dr. Fuhrman 的 AI 對話嗎？",
    signupBody:
      "在 DrFuhrman.com 繼續對話，並解鎖完整的 Nutritarian 會員體驗。",
    signupButton: "在 DrFuhrman.com 註冊",
  },

  transcript: {
    heading: "真實的答案，直接來自語料庫",
    subheading:
      "一段與 Dr. Fuhrman AI 的真實對話——每一則回覆都根植於他本人的書籍、講座與節目，並標明確切出處。捲動即可閱讀全文。",
    online: "線上",
    assistantLabel: "助理",
    recommendationPrefix: "我注意到你可能對以下內容感興趣",
    composerAria: "在聊天中提出你自己的問題",
    composerPlaceholder: "向 Dr. Fuhrman 的 AI 提出你自己的問題…",
    questions: [
      "開始 Nutritarian 飲食的前三個步驟是什麼？",
      "用一句話說，什麼是 Nutritarian 飲食？",
      "請說出三種高營養的綠葉蔬菜。",
    ],
    answers: [
      [
        "根據我在 *Eat for Health* 中的研究，過渡到健康的 Nutritarian 飲食的前三個步驟是 [[7]]：",
        "**1. 重新調整你的思維與口味，讓自己偏愛富含微量營養素的食物。** 你必須轉變心態。與其糾結於你所放棄的東西，不如訓練自己去渴望那些對滋養和保護身體最有幫助的食物——綠葉蔬菜、豆類、洋蔥、蘑菇、莓果與種子。當你食用這些食物時，你的味蕾會真正改變，曾經看似平淡或乏味的東西會變得鮮活而令人滿足。",
        "**2. 透過讓富含微量營養素的食物成為飲食的基礎，消除導致暴飲暴食的成癮性飢餓症狀。** 大多數人被困在「毒性飢餓」的循環中——那是由戒斷低營養加工食品所引起的顫抖、頭痛與渴求。當你圍繞高營養密度的食物來建構飲食時，那種成癮性的牽引就會減弱。你會在喉嚨處感受到真正的飢餓，而不是胃部令人不適的排毒症狀，你的身體終於會在攝取適量熱量後獲得滿足。",
        "**3. 在日常飲食中限制不健康的食物。** 當你用高營養的食物填滿餐盤時，你自然會減少加工的、精製的與源自動物的產品。這並不是要在一天內做到完美；而是要讓富含微量營養素的植物性食物成為主角，讓不健康的選擇退居邊緣，直到它們不再對你有任何掌控。",
        "這三個步驟是協同作用的——你無法將它們完全分開。隨著你飲食的營養密度上升，你對低營養食物的渴望會下降，而你為真正的健康而非成癮去進食的能力會變得自然而然 [[7]]。",
      ],
      [
        "Nutritarian 飲食是一種高營養的飲食方式，建立在健康等於營養素除以熱量這一原則之上 [[4]]，亦即透過強調綠色蔬菜、豆類、洋蔥、蘑菇、莓果與種子來最大化每卡路里的微量營養素，同時避免加工食品、糖、白麵粉與精製油 [[1]][[5]]。",
      ],
      [
        "我會向你推薦 **羽衣甘藍、collard greens 與菠菜**。這些深色綠葉蔬菜在營養密度排行上位居最頂端——100 分滿分中的 100 分——因為它們富含維生素、礦物質以及抵禦疾病的抗癌植物化學物質 [[1]][[7]]。",
      ],
    ],
  },

  comingSoon: {
    label: "即將推出",
    headline: "隨時隨地帶上 DFO AI。",
    cards: [
      {
        badge: "iOS + Android",
        title: "具備食物照片辨識功能的原生行動應用程式",
        body: "在雜貨店、廚房或餐廳給你的食物拍張照。DFO AI 會立刻告訴你它是否符合 Nutritarian 生活方式——如果不符合，又該換成什麼。",
        imageAlt:
          "一個人在農夫市集舉起智慧型手機，相機對準新鮮的羽衣甘藍和番茄，畫面上有一個綠色的分析環",
      },
      {
        badge: "離線 · Gemma 4",
        title: "DFO AI，完全在你的裝置上執行",
        body: "DFO AI 的壓縮版本，由 Google 的 Gemma 4 開放模型驅動。在飛機上、偏遠的廚房裡、補充品貨架的最裡端都能使用——無需連線。",
        imageAlt:
          "一位旅客坐在飛機靠窗座位上，用智慧型手機使用 DFO AI，窗外可見柔和的金色黃昏雲彩",
      },
    ],
  },

  bios: {
    headline: "AI 背後的智慧。",
    subheading:
      "DFO AI 的聲音根植於 Dr. Joel 和 Dr. Cara Fuhrman 數十年的臨床實務與教學。",
    roles: [
      "委員會認證的家庭醫師、作家、營養研究者",
      "家庭醫學醫師、植物性營養倡導者",
    ],
    bodies: [
      "Dr. Fuhrman 是 New York Times 排名第一的暢銷書作家，也是專攻營養醫學的委員會認證家庭醫師。他創造了 Nutritarian 一詞來描述一種追求卓越營養的飲食，並將四十年的臨床實務與研究致力於記錄富含微量營養素的飲食如何預防和逆轉慢性疾病。",
      "Dr. Cara Fuhrman 是一位家庭醫學醫師，熱衷於植物性營養以及幫助家庭養成終生健康習慣。她與 Dr. Joel Fuhrman 合作開展教育計畫，將 Nutritarian 理念帶給更廣泛的受眾。她與父親共同創辦了 LongevityRx，這是一間位於 San Diego 的先進長壽醫學診所。",
    ],
    footerPrefix: "如需完整的簡介、書籍和研究，請造訪",
  },

  cta: {
    headline: "準備好向 Dr. Fuhrman 的 AI 提問了嗎？",
    description:
      "免費試用。開始無需帳戶。聊天就在本頁面的頂部。",
    buttonText: "立即試用 DFO AI",
  },

  footer: {
    poweredBy: "技術支援",
    aiSafety: "AI 安全與倫理",
    terms: "條款",
    privacy: "隱私",
  },
};
