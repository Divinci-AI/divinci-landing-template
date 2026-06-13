import type { UIStrings } from "./en";

/**
 * Filipino (fil). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const fil: UIStrings = {
  meta: {
    title: "DrFurman.ai — Gabay na Nutritarian na pinapagana ng AI, 24/7",
    description:
      "Makipag-chat sa AI ni Dr. Fuhrman, na sinanay sa kanyang buong corpus — 12 aklat, bawat video lecture, mahigit 20,000+ Q&A ng mga miyembro, at lahat ng 180 produkto. Available 24/7 sa bawat wikang sinasalita ng Gemini 3.5 Flash.",
    ogTitle: "DrFurman.ai — Gabay na Nutritarian na pinapagana ng AI, 24/7",
    ogDescription:
      "Makipag-chat 24/7 sa isang assistant na sinanay sa kumpletong gawa ni Dr. Joel Fuhrman.",
    ogImageAlt: "Dr. Fuhrman AI — bawat aklat, bawat lecture, bawat sagot.",
    twitterTitle: "DrFurman.ai — Gabay na Nutritarian na pinapagana ng AI, 24/7",
    twitterDescription:
      "Makipag-chat 24/7 sa isang assistant na sinanay sa kumpletong gawa ni Dr. Joel Fuhrman.",
  },

  nav: {
    chat: "Makipag-chat sa AI",
    corpus: "Ang alam nito",
    examples: "Mga halimbawa",
    comingSoon: "Malapit nang dumating",
    language: "Wika",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "Miyembro na ng drfuhrman.com?",
    memberLoginCta: "Mag-log in",
    headline: "Bawat aklat. Bawat lecture. Bawat sagot.",
  },

  corpus: {
    headline: "Itinayo sa apat na dekada{br}ng pananaliksik ni Dr. Fuhrman.",
    subheading:
      "Hindi nanghuhula ang AI ng DFO — sumasagot ito mula sa tunay na corpus ni Dr. Fuhrman.",
    stats: {
      everyWord: "Bawat",
      lecturesUnit: "video lecture",
      lecturesFlavor:
        "Bawat naitalang lecture ni Dr. Fuhrman, na-index at masasagot sa simpleng wika.",
      booksUnit: "aklat",
      booksFlavor:
        "Ang kumpletong nailathalang aklatan ni Dr. Fuhrman, mula sa Eat to Live hanggang Fast Food Genocide.",
      qasUnit: "Q&A ng mga miyembro",
      qasFlavor:
        "Mga sagot na personal na ibinigay ni Dr. Fuhrman sa kanyang komunidad ng Member Center sa paglipas ng mga taon.",
      productsUnit: "produkto",
      productsFlavor:
        "Bawat supplement at produkto sa DrFuhrman.com, na may kumpletong datos ng sangkap at specs.",
    },
    languagePrefix: "Sinasalita sa bawat wikang sinusuportahan ng Gemini 3.5 Flash",
    videoAriaLabel:
      "Isang bukás na hardcover na aklat ng kalusugan sa ibabaw ng mainit na mesang kahoy, napapaligiran ng sariwang broccoli, kale, blueberries, walnuts, at isang smartphone na nagpapakita ng chat interface",
  },

  examples: {
    headline: "Subukang magtanong sa AI ng DFO ng tunay na tanong.",
    description:
      "I-click ang anumang tanong para ilagay ito sa chat sa itaas — magka-focus ang iyong input field para makapindot ka ng {kbd}Enter{/kbd} upang ipadala.",
    questions: [
      "Ano ang pinakasimpleng paraan para magsimulang kumain nang Nutritarian?",
      "Sabihin mo sa akin ang tungkol sa insulin sensitivity.",
      "Ano ang inirerekomenda ni Dr. Fuhrman para sa altapresyon?",
      "Paano ako gagawa ng 5-araw na Nutritarian challenge?",
      "Ano ang pagkakaiba ng cruciferous at madahong gulay?",
      "Aling aklat ni Dr. Fuhrman ang dapat kong basahin muna?",
    ],
    ctaHint: "Ilagay sa chat →",
    videoAriaLabel:
      "Isang taong nasa kusinang naliliwanagan ng araw na tinitingnan ang AI ng DFO sa kanyang smartphone sa ibabaw ng isang mangkok ng berries at sariwang mga gulay",
  },

  chat: {
    welcomeMessage:
      "Kumusta, ako ang AI ni Dr. Joel Fuhrman. Narito ako para tulungan kang mabawi ang kontrol sa iyong kalusugan — ano ang nasa isip mo kamakailan?",
    starters: [
      "Kumusta, Dr. Fuhrman AI. Maaari mo ba akong sabihan ng mga hakbang na magagawa ko para magsimula ng mas malusog na pamumuhay?",
      "Kumusta Dr. Fuhrman AI, maaari mo bang ipaliwanag kung ano ang Nutritarian?",
      "Kumusta Dr. Fuhrman AI. Maaari mo bang ipaliwanag ang tungkol sa insulin sensitivity?",
    ],
    tryAsking: "Subukang magtanong",
    emailLabel: "Una, ano ang iyong email?",
    emailLabelValid: "Ang iyong email",
    emailAriaLabel: "Ang iyong email",
    emailPlaceholderSticky: "Una, ilagay ang iyong email para magsimulang mag-chat…",
    askButton: "Magtanong",
    questionPlaceholder: "I-type ang iyong tanong…",
    questionAriaLabel: "Magtanong sa Dr. Fuhrman AI",
    questionPlaceholderSticky:
      "Magtanong sa Dr. Fuhrman AI — pagkain, pagbabalik mula sa sakit, pagbabawas ng timbang…",
    sendAriaLabel: "Ipadala ang mensahe",
    disclaimer: [
      "Suriin muli ang mahahalagang impormasyon.",
      "Hindi kapalit ng payo medikal.",
      "Maaaring magkamali ang AI.",
    ],
    errorEmailRequired: "Pakilagay ang iyong email sa itaas para simulan ang chat.",
    errorEmailInvalid: "Pakilagay ang isang wastong email address.",
    errorEmailTooLong: "Masyadong mahaba ang email.",
    errorDisposable:
      "Pakigamit ang isang permanenteng email address — hindi sinusuportahan ang mga disposable na inbox.",
    errorNetwork:
      "Error sa network — hindi naipadala ang mensaheng iyon. Pakisubukang muli.",
    quotaExhaustedNudge:
      "Naubos mo na ang iyong libreng mensahe — magpatuloy sa pakikipag-usap sa AI ni Dr. Fuhrman.",
    signupHeadline: "Gusto mo bang ipagpatuloy ang pakikipag-usap sa AI ni Dr. Fuhrman?",
    signupBody:
      "Ipagpatuloy ang usapan — at i-unlock ang kumpletong karanasan ng pagiging miyembro ng Nutritarian — sa DrFuhrman.com.",
    signupButton: "Mag-sign up sa DrFuhrman.com",
  },

  transcript: {
    heading: "Tunay na mga sagot, diretso mula sa corpus",
    subheading:
      "Isang tunay na usapan sa Dr. Fuhrman AI — bawat sagot ay nakaugat sa kanyang sariling mga aklat, lecture, at palabas, na may eksaktong pinagmulan na ipinapakita. Mag-scroll para basahin ang kabuuan.",
    online: "Online",
    assistantLabel: "Assistant",
    recommendationPrefix: "Napansin ko na maaaring interesado ka sa",
    composerAria: "Magtanong ng sarili mong tanong sa chat",
    composerPlaceholder: "Tanungin ang Dr. Fuhrman's AI ng iyong sariling tanong…",
    questions: [
      "Ano ang unang tatlong hakbang para magsimula ng Nutritarian na diyeta?",
      "Sa isang pangungusap, ano ang Nutritarian na diyeta?",
      "Magbanggit ng tatlong madahong gulay na mayaman sa nutrisyon.",
    ],
    answers: [
      [
        "Batay sa aking gawa sa *Eat for Health*, ang unang tatlong hakbang para lumipat sa isang masustansyang Nutritarian na diyeta ay [[7]]:",
        "**1. I-reprogram ang iyong pag-iisip at panlasa para mas gustuhin ang mga pagkaing mayaman sa micronutrients.** Kailangan mong baguhin ang iyong pananaw. Sa halip na magpokus sa kung ano ang isinusuko mo, sanayin ang iyong sarili na hangarin ang mga pagkaing pinakanakapagpapasigla at nakapagpoprotekta sa iyong katawan—madahong gulay, beans, sibuyas, kabute, berries, at buto. Habang kinakain mo ang mga pagkaing ito, talagang nagbabago ang iyong panlasa, at ang dating tila tabang o nakakaumay ay nagiging masigla at kasiya-siya.",
        "**2. Alisin ang mga nakakahumaling na sintomas ng gutom na humahantong sa sobrang pagkain sa pamamagitan ng paggawa sa mga pagkaing mayaman sa micronutrients bilang pundasyon ng iyong diyeta.** Karamihan sa mga tao ay nabilanggo sa siklo ng “nakakalasong gutom”—panginginig, pananakit ng ulo, at paghahanap na dulot ng pag-aalis sa mga prosesadong pagkaing kulang sa nutrisyon. Kapag itinayo mo ang iyong diyeta sa paligid ng mga pagkaing may mataas na density ng nutrisyon, humuhupa ang nakakahumaling na hatak na iyon. Nararanasan mo ang tunay na gutom sa lalamunan, hindi ang nakakaabalang mga sintomas ng detox sa tiyan, at sa wakas ay napapanatag ang iyong katawan sa tamang dami ng calories.",
        "**3. Limitahan ang mga di-masustansyang pagkain sa iyong pang-araw-araw na diyeta.** Habang pinupuno mo ang iyong plato ng mga pagkaing mayaman sa nutrisyon, natural mong nababawasan ang mga prosesado, pino, at mula-sa-hayop na produkto. Hindi ito tungkol sa pagiging perpekto sa loob ng isang araw; tungkol ito sa paggawa sa mga pagkaing-halaman na mayaman sa micronutrients bilang pangunahing tampok at paghayaang maitulak ang mga di-masustansyang pagpipilian sa gilid hanggang sa wala na itong hawak sa iyo.",
        "Ang tatlong hakbang na ito ay magkakasamang gumagana—hindi mo lubusang mapaghihiwalay ang mga ito. Habang tumataas ang density ng nutrisyon ng iyong diyeta, bumababa ang iyong pagnanasa sa mga pagkaing kulang sa nutrisyon, at nagiging awtomatiko ang iyong kakayahang kumain para sa tunay na kalusugan sa halip na para sa pagkahumaling [[7]].",
      ],
      [
        "Ang Nutritarian na diyeta ay isang istilong-pagkain na mayaman sa nutrisyon na nakatayo sa prinsipyong ang Kalusugan ay katumbas ng Nutrients na hinati sa Calories [[4]], kung saan pinapalaki mo ang micronutrients kada calorie sa pamamagitan ng pagbibigay-diin sa berdeng gulay, beans, sibuyas, kabute, berries, at buto habang iniiwasan ang mga prosesadong pagkain, asukal, puting harina, at pinong langis [[1]][[5]].",
      ],
      [
        "Ituturo ko sa iyo ang **kale, collard greens, at spinach**. Ang madidilim na madahong gulay na ito ay umaabot sa pinakatuktok ng linya ng density ng nutrisyon—100 sa 100—dahil puno ang mga ito ng bitamina, mineral, at mga phytochemical na lumalaban sa kanser na nagpoprotekta laban sa sakit [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Malapit nang dumating",
    headline: "Dalhin ang AI ng DFO kahit saan ka pumunta.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Native mobile app na may food-photo recognition",
        body: "Kumuha ng larawan ng iyong pagkain sa grocery store, sa kusina, o sa restaurant. Sasabihin agad sa iyo ng AI ng DFO kung bagay ba ito sa isang Nutritarian na pamumuhay — at kung ano ang ipapalit kung hindi.",
        imageAlt:
          "Isang taong nakaangat ang smartphone sa isang farmers market, nakatutok ang camera sa sariwang kale at kamatis na may berdeng analysis ring",
      },
      {
        badge: "Offline · Gemma 4",
        title: "Ang AI ng DFO, ganap na tumatakbo sa iyong device",
        body: "Isang compressed na bersyon ng AI ng DFO, pinapagana ng open model na Gemma 4 ng Google. Gumagana sa eroplano, sa malalayong kusina, sa likod ng supplement aisle — walang kailangang koneksyon.",
        imageAlt:
          "Isang manlalakbay sa window seat ng eroplano na gumagamit ng AI ng DFO sa kanyang smartphone, makikita sa bintana ang malambot na ginintuang ulap ng golden hour",
      },
    ],
  },

  bios: {
    headline: "Ang mga isip sa likod ng AI.",
    subheading:
      "Ang boses ng AI ng DFO ay nakaugat sa mga dekada ng klinikal na pagsasanay at pagtuturo nina Dr. Joel at Dr. Cara Fuhrman.",
    roles: [
      "Board-certified na family physician, may-akda, mananaliksik sa nutrisyon",
      "Family medicine physician, tagapagtaguyod ng plant-based na nutrisyon",
    ],
    bodies: [
      "Si Dr. Fuhrman ay isang #1 New York Times best-selling na may-akda at board-certified na family physician na dalubhasa sa nutritional medicine. Kanyang ginawa ang terminong Nutritarian para ilarawan ang isang diyetang naghahangad ng kahusayan sa nutrisyon, at inilaan niya ang apat na dekada ng klinikal na pagsasanay at pananaliksik para idokumento kung paano ang isang diyetang mayaman sa micronutrients ay makakapigil at makakapagbalik ng mga kronikong sakit.",
      "Si Dr. Cara Fuhrman ay isang family medicine physician na may hilig sa plant-based na nutrisyon at sa pagtulong sa mga pamilya na bumuo ng panghabambuhay na malulusog na gawi. Nakikipagtulungan siya kay Dr. Joel Fuhrman sa mga programang pang-edukasyon na nagdadala ng Nutritarian na pamamaraan sa mas malawak na madla. Kasama ang kanyang ama, itinatag niya ang LongevityRx, isang advanced na klinika ng longevity-medicine sa San Diego.",
    ],
    footerPrefix: "Para sa kumpletong bios, aklat, at pananaliksik, bisitahin ang",
  },

  cta: {
    headline: "Handa ka na bang magtanong sa AI ni Dr. Fuhrman?",
    description:
      "Libreng subukan. Walang kailangang account para magsimula. Nasa itaas mismo ng pahinang ito ang chat.",
    buttonText: "Subukan ang AI ng DFO ngayon",
  },

  footer: {
    poweredBy: "Pinapagana ng",
    aiSafety: "Kaligtasan at Etika ng AI",
    terms: "Mga Tuntunin",
    privacy: "Privacy",
  },
};
