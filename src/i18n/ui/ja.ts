import type { UIStrings } from "./en";

/**
 * Japanese (ja). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const ja: UIStrings = {
  meta: {
    title: "DrFurman.ai — AIによるNutritarianガイダンス、24/7",
    description:
      "Dr. FuhrmanのAIとチャット。彼の全コーパス（12冊の書籍、すべての動画講義、20,000+件の会員Q&A、180すべての製品）で学習済み。Gemini 3.5 Flashが話すあらゆる言語で24/7利用可能。",
    ogTitle: "DrFurman.ai — AIによるNutritarianガイダンス、24/7",
    ogDescription:
      "Dr. Joel Fuhrmanの全業績で学習したアシスタントと24/7チャット。",
    ogImageAlt: "Dr. Fuhrman AI — すべての書籍、すべての講義、すべての回答。",
    twitterTitle: "DrFurman.ai — AIによるNutritarianガイダンス、24/7",
    twitterDescription:
      "Dr. Joel Fuhrmanの全業績で学習したアシスタントと24/7チャット。",
  },

  nav: {
    chat: "AIとチャット",
    corpus: "AIが知っていること",
    examples: "例",
    comingSoon: "近日公開",
    language: "言語",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "すでに drfuhrman.com 会員ですか？",
    memberLoginCta: "ログイン",
    headline: "すべての書籍。すべての講義。すべての回答。",
  },

  corpus: {
    headline: "Dr. Fuhrmanの{br}40年にわたる研究に基づいています。",
    subheading:
      "DFO AIは推測しません。Dr. Fuhrmanの実際のコーパスから回答します。",
    stats: {
      everyWord: "すべての",
      lecturesUnit: "動画講義",
      lecturesFlavor:
        "Dr. Fuhrmanが行ったすべての録画講義を索引化し、平易な言葉で回答できます。",
      booksUnit: "冊の書籍",
      booksFlavor:
        "Eat to LiveからFast Food Genocideまで、Dr. Fuhrmanの出版された全著作。",
      qasUnit: "件の会員Q&A",
      qasFlavor:
        "Dr. Fuhrmanが長年にわたりMember Centerのコミュニティに直接回答してきた答え。",
      productsUnit: "製品",
      productsFlavor:
        "DrFuhrman.comのすべてのサプリメントと製品。成分と仕様の完全なデータ付き。",
    },
    languagePrefix: "Gemini 3.5 Flashが対応するあらゆる言語で利用可能",
    videoAriaLabel:
      "新鮮なブロッコリー、ケール、ブルーベリー、クルミ、そしてチャット画面を映したスマートフォンに囲まれた、温かみのある木製テーブルの上で開かれたハードカバーの健康書籍",
  },

  examples: {
    headline: "DFO AIに実際の質問を投げかけてみましょう。",
    description:
      "任意の質問をクリックすると、上のチャットに挿入されます。入力欄にフォーカスが移るので、{kbd}Enter{/kbd}を押して送信できます。",
    questions: [
      "Nutritarianの食事を始める最も簡単な方法は何ですか？",
      "インスリン感受性について教えてください。",
      "高血圧に対してDr. Fuhrmanは何を勧めていますか？",
      "5日間のNutritarianチャレンジはどうやって行いますか？",
      "アブラナ科の野菜と葉物野菜の違いは何ですか？",
      "Dr. Fuhrmanの書籍のうち、最初に読むべきはどれですか？",
    ],
    ctaHint: "チャットに挿入 →",
    videoAriaLabel:
      "日差しの差し込むキッチンで、ベリーと新鮮な野菜のボウルの上でスマートフォンのDFO AIを確認している人",
  },

  chat: {
    welcomeMessage:
      "こんにちは、Dr. Joel FuhrmanのAIです。あなたが健康の主導権を取り戻すお手伝いをします — 最近、気になっていることはありますか？",
    starters: [
      "こんにちは、Dr. Fuhrman AI。より健康的なライフスタイルを始めるために、どんなステップを踏めばよいか教えてもらえますか？",
      "こんにちは、Dr. Fuhrman AI。Nutritarianとはどういうものか教えてもらえますか？",
      "こんにちは、Dr. Fuhrman AI。インスリン感受性について教えてもらえますか？",
    ],
    tryAsking: "質問してみましょう",
    emailLabel: "まず、メールアドレスを教えてください。",
    emailLabelValid: "あなたのメールアドレス",
    emailAriaLabel: "あなたのメールアドレス",
    emailPlaceholderSticky: "まず、チャットを始めるためにメールアドレスを…",
    askButton: "質問する",
    questionPlaceholder: "質問を入力してください…",
    questionAriaLabel: "Dr. Fuhrman AIに質問する",
    questionPlaceholderSticky:
      "Dr. Fuhrman AIに質問する — 食事、病気の改善、減量など…",
    sendAriaLabel: "メッセージを送信",
    disclaimer: [
      "重要な情報は再確認してください。",
      "医学的助言の代わりにはなりません。",
      "AIは誤った内容を出力することがあります。",
    ],
    errorEmailRequired: "チャットを始めるには、上にメールアドレスを入力してください。",
    errorEmailInvalid: "有効なメールアドレスを入力してください。",
    errorEmailTooLong: "メールアドレスが長すぎます。",
    errorDisposable:
      "恒久的なメールアドレスをご利用ください — 使い捨てのメールアドレスには対応していません。",
    errorNetwork:
      "ネットワークエラー — そのメッセージは送信されませんでした。もう一度お試しください。",
    quotaExhaustedNudge:
      "無料メッセージを使い切りました — Dr. FuhrmanのAIとの会話を続けましょう。",
    signupHeadline: "Dr. FuhrmanのAIとの会話を続けたいですか？",
    signupBody:
      "DrFuhrman.comで会話を続け、Nutritarianの完全な会員体験をアンロックしましょう。",
    signupButton: "DrFuhrman.comで登録する",
  },

  transcript: {
    heading: "コーパスから直接お届けする、本物の回答",
    subheading:
      "Dr. Fuhrman AIとの実際の会話を1つ — すべての返答は、彼自身の書籍、講義、番組に基づいており、正確な出典が示されています。スクロールして全文をお読みください。",
    online: "オンライン",
    assistantLabel: "アシスタント",
    recommendationPrefix: "こちらにご興味があるかもしれないと思いました",
    composerAria: "チャットで自分の質問をする",
    composerPlaceholder: "Dr. Fuhrman AIに自分の質問をしてみましょう…",
    questions: [
      "Nutritarianの食事を始めるための最初の3つのステップは何ですか？",
      "一文で言うと、Nutritarianの食事とは何ですか？",
      "栄養価の高い葉物野菜を3つ挙げてください。",
    ],
    answers: [
      [
        "私の著書 *Eat for Health* に基づくと、健康的なNutritarianの食事へ移行するための最初の3つのステップは次のとおりです [[7]]：",
        "**1. 微量栄養素が豊富な食品を好むように、考え方と味覚をプログラムし直す。** あなたは考え方を切り替える必要があります。何をあきらめるかに意識を向けるのではなく、体を養い守るために最も役立つ食品 — 葉物野菜、豆類、玉ねぎ、きのこ、ベリー、種子 — を求めるように自分を訓練するのです。これらの食品を食べるうちに、味覚は実際に変化し、かつては味気なく退屈に思えたものが、生き生きとして満足感のあるものになります。",
        "**2. 微量栄養素が豊富な食品を食事の土台にすることで、過食につながる中毒性の空腹症状をなくす。** 多くの人は「有毒な空腹」の悪循環に囚われています — それは栄養価の低い加工食品からの離脱によって引き起こされる、震え、頭痛、渇望です。栄養密度の高い食品を中心に食事を組み立てると、その中毒性の引力は弱まります。胃に不快な解毒症状が出るのではなく、喉に本物の空腹を感じるようになり、体はついに適量のカロリーで満たされるようになります。",
        "**3. 日々の食事で不健康な食品を制限する。** 栄養価の高い食品で皿を満たしていくと、加工された、精製された、動物由来の製品は自然と減っていきます。1日で完璧を目指すということではありません — 微量栄養素が豊富な植物性食品を主役にし、不健康な選択肢が、もはやあなたを縛らなくなるまで周縁へと追いやられるようにすることなのです。",
        "これら3つのステップは互いに連動しており、完全に切り離すことはできません。食事の栄養密度が高まるにつれて、栄養価の低い食品への欲求は下がり、中毒ではなく本物の健康のために食べる能力が自然と身についていきます [[7]]。",
      ],
      [
        "Nutritarianの食事とは、健康はカロリーあたりの栄養素で決まるという原則 [[4]] に基づいた、栄養価の高い食べ方です。緑黄色野菜、豆類、玉ねぎ、きのこ、ベリー、種子を重視してカロリーあたりの微量栄養素を最大化する一方で、加工食品、砂糖、白い小麦粉、精製油を避けます [[1]][[5]]。",
      ],
      [
        "**ケール、コラードグリーン、ほうれん草** をお勧めします。これらの濃い緑の葉物野菜は、栄養密度の指標で最上位 — 100点満点中100点 — に位置します。ビタミン、ミネラル、そして病気から守るがんと闘う植物化学物質がたっぷり含まれているからです [[1]][[7]]。",
      ],
    ],
  },

  comingSoon: {
    label: "近日公開",
    headline: "DFO AIをどこへでも持ち歩こう。",
    cards: [
      {
        badge: "iOS + Android",
        title: "食品写真認識機能付きのネイティブモバイルアプリ",
        body: "スーパー、キッチン、レストランで食べ物の写真を撮るだけ。DFO AIがそれがNutritarianのライフスタイルに合うかどうか、合わない場合は何に置き換えればよいかを即座に教えてくれます。",
        imageAlt:
          "ファーマーズマーケットでスマートフォンを掲げ、カメラが新鮮なケールとトマトを緑色の分析リングで捉えている人",
      },
      {
        badge: "オフライン · Gemma 4",
        title: "DFO AIが、お使いのデバイス上で完全に動作",
        body: "GoogleのGemma 4オープンモデルを搭載した、圧縮版のDFO AI。飛行機の中、辺鄙なキッチン、サプリメント売り場の奥でも動作します。接続は不要です。",
        imageAlt:
          "飛行機の窓側の席でスマートフォンのDFO AIを使う旅行者。窓の外には柔らかな黄金色の夕暮れの雲が見える",
      },
    ],
  },

  bios: {
    headline: "AIを支える人々。",
    subheading:
      "DFO AIの声は、Dr. JoelとDr. Cara Fuhrmanによる数十年にわたる臨床経験と教育に根ざしています。",
    roles: [
      "認定家庭医、著者、栄養研究者",
      "家庭医、植物ベースの栄養の提唱者",
    ],
    bodies: [
      "Dr. Fuhrmanは、New York Timesのベストセラー第1位の著者であり、栄養医学を専門とする認定家庭医です。彼は栄養の卓越性を追求する食事を表すためにNutritarianという用語を作り出し、微量栄養素が豊富な食事が慢性疾患を予防・改善する仕組みを記録することに、40年にわたる臨床経験と研究を捧げてきました。",
      "Dr. Cara Fuhrmanは、植物ベースの栄養と、家族が生涯にわたる健康的な習慣を築く手助けに情熱を注ぐ家庭医です。彼女はDr. Joel Fuhrmanと協力し、Nutritarianのアプローチをより幅広い人々に届ける教育プログラムに取り組んでいます。父とともに、San Diegoにある先進的な長寿医療クリニックLongevityRxを共同で設立しました。",
    ],
    footerPrefix: "完全な経歴、書籍、研究については、こちらをご覧ください",
  },

  cta: {
    headline: "Dr. FuhrmanのAIに質問する準備はできましたか？",
    description:
      "無料でお試しいただけます。始めるのにアカウントは不要です。チャットはこのページの一番上にあります。",
    buttonText: "今すぐDFO AIを試す",
  },

  footer: {
    poweredBy: "提供",
    aiSafety: "AIの安全性と倫理",
    terms: "利用規約",
    privacy: "プライバシー",
  },
};
