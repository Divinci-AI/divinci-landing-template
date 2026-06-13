import type { UIStrings } from "./en";

/**
 * Chinese (Simplified) (zh-hans). Brand names, product names, and
 * numbers are kept verbatim per the en source's translation rules.
 */
export const zhHans: UIStrings = {
  meta: {
    title: "DrFurman.ai — AI 驱动的 Nutritarian 指导，24/7",
    description:
      "与 Dr. Fuhrman 的 AI 对话，它基于他的全部语料库进行训练——12 本书、所有视频讲座、20,000+ 条会员问答以及全部 180 款产品。以 Gemini 3.5 Flash 支持的每一种语言 24/7 提供服务。",
    ogTitle: "DrFurman.ai — AI 驱动的 Nutritarian 指导，24/7",
    ogDescription:
      "与基于 Dr. Joel Fuhrman 全部著作训练的助手 24/7 对话。",
    ogImageAlt: "Dr. Fuhrman AI — 每一本书、每一场讲座、每一个答案。",
    twitterTitle: "DrFurman.ai — AI 驱动的 Nutritarian 指导，24/7",
    twitterDescription:
      "与基于 Dr. Joel Fuhrman 全部著作训练的助手 24/7 对话。",
  },

  nav: {
    chat: "与 AI 对话",
    corpus: "它所掌握的知识",
    examples: "示例",
    comingSoon: "即将推出",
    language: "语言",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "已经是 drfuhrman.com 会员？",
    memberLoginCta: "登录",
    headline: "每一本书。每一场讲座。每一个答案。",
  },

  corpus: {
    headline: "基于 Dr. Fuhrman{br}四十年的研究构建。",
    subheading:
      "DFO AI 不靠猜测——它从 Dr. Fuhrman 真实的语料库中给出答案。",
    stats: {
      everyWord: "每一场",
      lecturesUnit: "视频讲座",
      lecturesFlavor:
        "Dr. Fuhrman 所做的每一场录制讲座，均已建立索引并可用通俗语言作答。",
      booksUnit: "本书",
      booksFlavor:
        "Dr. Fuhrman 已出版的完整著作，从 Eat to Live 到 Fast Food Genocide。",
      qasUnit: "条会员问答",
      qasFlavor:
        "多年来 Dr. Fuhrman 亲自向其 Member Center 社区给出的解答。",
      productsUnit: "款产品",
      productsFlavor:
        "DrFuhrman.com 上的每一款补充剂和产品，附完整的成分与规格数据。",
    },
    languagePrefix: "以 Gemini 3.5 Flash 支持的每一种语言提供",
    videoAriaLabel:
      "一本翻开的精装健康书摆在温暖的木桌上，周围环绕着新鲜的西兰花、羽衣甘蓝、蓝莓、核桃，以及一部显示聊天界面的智能手机",
  },

  examples: {
    headline: "试着向 DFO AI 提出一个真实的问题。",
    description:
      "点击任意问题即可将其填入上方的聊天框——你的输入框会获得焦点，因此可以按 {kbd}Enter{/kbd} 发送。",
    questions: [
      "开始 Nutritarian 饮食最简单的方法是什么？",
      "给我讲讲胰岛素敏感性。",
      "对于高血压，Dr. Fuhrman 有什么建议？",
      "如何进行为期 5 天的 Nutritarian 挑战？",
      "十字花科蔬菜和绿叶蔬菜有什么区别？",
      "Dr. Fuhrman 的书我应该先读哪一本？",
    ],
    ctaHint: "填入聊天框 →",
    videoAriaLabel:
      "一个人在洒满阳光的厨房里，在一碗浆果和新鲜蔬菜上方用智能手机查看 DFO AI",
  },

  chat: {
    welcomeMessage:
      "你好，我是 Dr. Joel Fuhrman 的 AI。我在这里帮助你重新掌控自己的健康——最近有什么困扰你的事吗？",
    starters: [
      "你好，Dr. Fuhrman AI。你能告诉我开始更健康的生活方式可以采取哪些步骤吗？",
      "你好，Dr. Fuhrman AI，你能告诉我 Nutritarian 到底是什么吗？",
      "你好，Dr. Fuhrman AI。你能给我讲讲胰岛素敏感性吗？",
    ],
    tryAsking: "试着这样问",
    emailLabel: "首先，你的电子邮箱是什么？",
    emailLabelValid: "你的电子邮箱",
    emailAriaLabel: "你的电子邮箱",
    emailPlaceholderSticky: "首先，输入你的电子邮箱以开始聊天…",
    askButton: "提问",
    questionPlaceholder: "输入你的问题…",
    questionAriaLabel: "向 Dr. Fuhrman AI 提问",
    questionPlaceholderSticky:
      "向 Dr. Fuhrman AI 提问——饮食、逆转疾病、减重…",
    sendAriaLabel: "发送消息",
    disclaimer: [
      "请仔细核对重要信息。",
      "不能替代医疗建议。",
      "AI 可能会出错。",
    ],
    errorEmailRequired: "请在上方输入你的电子邮箱以开始聊天。",
    errorEmailInvalid: "请输入有效的电子邮箱地址。",
    errorEmailTooLong: "电子邮箱地址过长。",
    errorDisposable:
      "请使用长期有效的电子邮箱地址——不支持一次性邮箱。",
    errorNetwork:
      "网络错误——该消息未能发送。请重试。",
    quotaExhaustedNudge:
      "你已用完免费消息——继续与 Dr. Fuhrman 的 AI 对话吧。",
    signupHeadline: "想继续与 Dr. Fuhrman 的 AI 对话吗？",
    signupBody:
      "在 DrFuhrman.com 继续对话，并解锁完整的 Nutritarian 会员体验。",
    signupButton: "在 DrFuhrman.com 注册",
  },

  transcript: {
    heading: "真实的答案，直接来自语料库",
    subheading:
      "一段与 Dr. Fuhrman AI 的真实对话——每一条回复都基于他本人的书籍、讲座和节目，并标明确切出处。滚动即可阅读全文。",
    online: "在线",
    assistantLabel: "助手",
    recommendationPrefix: "我注意到你可能对以下内容感兴趣",
    composerAria: "在聊天中提出你自己的问题",
    composerPlaceholder: "向 Dr. Fuhrman 的 AI 提出你自己的问题…",
    questions: [
      "开始 Nutritarian 饮食的前三个步骤是什么？",
      "用一句话说，什么是 Nutritarian 饮食？",
      "请说出三种高营养的绿叶蔬菜。",
    ],
    answers: [
      [
        "根据我在 *Eat for Health* 中的研究，过渡到健康的 Nutritarian 饮食的前三个步骤是 [[7]]：",
        "**1. 重新调整你的思维和口味，让自己偏爱富含微量营养素的食物。** 你必须转变心态。与其纠结于你所放弃的东西，不如训练自己去渴望那些对滋养和保护身体最有帮助的食物——绿叶蔬菜、豆类、洋葱、蘑菇、浆果和种子。当你食用这些食物时，你的味蕾会真正发生改变，曾经看似平淡或乏味的东西会变得鲜活而令人满足。",
        "**2. 通过让富含微量营养素的食物成为饮食的基础，消除导致暴饮暴食的成瘾性饥饿症状。** 大多数人被困在「毒性饥饿」的循环中——那是由戒断低营养加工食品所引起的颤抖、头痛和渴求。当你围绕高营养密度的食物来构建饮食时，那种成瘾性的牵引就会减弱。你会在喉咙处感受到真正的饥饿，而不是胃部令人不适的排毒症状，你的身体终于会在摄入适量热量后获得满足。",
        "**3. 在日常饮食中限制不健康的食物。** 当你用高营养的食物填满餐盘时，你自然会减少加工的、精制的和源自动物的产品。这并不是要在一天内做到完美；而是要让富含微量营养素的植物性食物成为主角，让不健康的选择退居边缘，直到它们不再对你有任何掌控。",
        "这三个步骤是协同作用的——你无法将它们完全分开。随着你饮食的营养密度上升，你对低营养食物的渴望会下降，而你为真正的健康而非成瘾去进食的能力会变得自然而然 [[7]]。",
      ],
      [
        "Nutritarian 饮食是一种高营养的饮食方式，建立在健康等于营养素除以热量这一原则之上 [[4]]，即通过强调绿色蔬菜、豆类、洋葱、蘑菇、浆果和种子来最大化每卡路里的微量营养素，同时避免加工食品、糖、白面粉和精制油 [[1]][[5]]。",
      ],
      [
        "我会向你推荐 **羽衣甘蓝、collard greens 和菠菜**。这些深色绿叶蔬菜在营养密度排行上位居最顶端——100 分满分中的 100 分——因为它们富含维生素、矿物质以及抵御疾病的抗癌植物化学物质 [[1]][[7]]。",
      ],
    ],
  },

  comingSoon: {
    label: "即将推出",
    headline: "随时随地带上 DFO AI。",
    cards: [
      {
        badge: "iOS + Android",
        title: "具备食物照片识别功能的原生移动应用",
        body: "在杂货店、厨房或餐厅给你的食物拍张照。DFO AI 会立刻告诉你它是否符合 Nutritarian 生活方式——如果不符合，又该换成什么。",
        imageAlt:
          "一个人在农贸市场举起智能手机，相机对准新鲜的羽衣甘蓝和番茄，画面上有一个绿色的分析环",
      },
      {
        badge: "离线 · Gemma 4",
        title: "DFO AI，完全在你的设备上运行",
        body: "DFO AI 的压缩版本，由 Google 的 Gemma 4 开放模型驱动。在飞机上、偏远的厨房里、补充剂货架的最里端都能使用——无需联网。",
        imageAlt:
          "一位旅客坐在飞机靠窗座位上，用智能手机使用 DFO AI，窗外可见柔和的金色黄昏云彩",
      },
    ],
  },

  bios: {
    headline: "AI 背后的智慧。",
    subheading:
      "DFO AI 的声音根植于 Dr. Joel 和 Dr. Cara Fuhrman 数十年的临床实践与教学。",
    roles: [
      "委员会认证的家庭医生、作家、营养研究者",
      "家庭医学医生、植物性营养倡导者",
    ],
    bodies: [
      "Dr. Fuhrman 是 New York Times 排名第一的畅销书作家，也是专攻营养医学的委员会认证家庭医生。他创造了 Nutritarian 一词来描述一种追求卓越营养的饮食，并将四十年的临床实践与研究致力于记录富含微量营养素的饮食如何预防和逆转慢性疾病。",
      "Dr. Cara Fuhrman 是一位家庭医学医生，热衷于植物性营养以及帮助家庭养成终生健康习惯。她与 Dr. Joel Fuhrman 合作开展教育项目，将 Nutritarian 理念带给更广泛的受众。她与父亲共同创办了 LongevityRx，这是一家位于 San Diego 的先进长寿医学诊所。",
    ],
    footerPrefix: "如需完整的简介、书籍和研究，请访问",
  },

  cta: {
    headline: "准备好向 Dr. Fuhrman 的 AI 提问了吗？",
    description:
      "免费试用。开始无需账户。聊天就在本页面的顶部。",
    buttonText: "立即试用 DFO AI",
  },

  footer: {
    poweredBy: "技术支持",
    aiSafety: "AI 安全与伦理",
    terms: "条款",
    privacy: "隐私",
  },
};
