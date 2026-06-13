import type { UIStrings } from "./en";

/**
 * Swahili (sw). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const sw: UIStrings = {
  meta: {
    title: "DrFurman.ai — Mwongozo wa Nutritarian unaoendeshwa na AI, 24/7",
    description:
      "Piga gumzo na AI ya Dr. Fuhrman, iliyofunzwa kwa kazi zake zote — vitabu 12, kila mhadhara wa video, maswali na majibu ya wanachama 20,000+, na bidhaa zote 180. Inapatikana 24/7 kwa kila lugha anayoongea Gemini 3.5 Flash.",
    ogTitle: "DrFurman.ai — Mwongozo wa Nutritarian unaoendeshwa na AI, 24/7",
    ogDescription:
      "Piga gumzo 24/7 na msaidizi aliyefunzwa kwa kazi kamili ya Dr. Joel Fuhrman.",
    ogImageAlt: "Dr. Fuhrman AI — kila kitabu, kila mhadhara, kila jibu.",
    twitterTitle:
      "DrFurman.ai — Mwongozo wa Nutritarian unaoendeshwa na AI, 24/7",
    twitterDescription:
      "Piga gumzo 24/7 na msaidizi aliyefunzwa kwa kazi kamili ya Dr. Joel Fuhrman.",
  },

  nav: {
    chat: "Piga gumzo na AI",
    corpus: "Inayoyajua",
    examples: "Mifano",
    comingSoon: "Inakuja hivi karibuni",
    language: "Lugha",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "Tayari ni mwanachama wa drfuhrman.com?",
    memberLoginCta: "Ingia",
    headline: "Kila kitabu. Kila mhadhara. Kila jibu.",
  },

  corpus: {
    headline: "Imejengwa juu ya miongo{br}minne ya utafiti wa Dr. Fuhrman.",
    subheading:
      "AI ya DFO haibahatishi majibu — hujibu kwa kutegemea kazi halisi za Dr. Fuhrman.",
    stats: {
      everyWord: "Kila",
      lecturesUnit: "mhadhara wa video",
      lecturesFlavor:
        "Kila mhadhara uliorekodiwa ambao Dr. Fuhrman ametoa, umewekewa faharasa na unaweza kujibiwa kwa lugha rahisi.",
      booksUnit: "vitabu",
      booksFlavor:
        "Maktaba kamili iliyochapishwa ya Dr. Fuhrman, kutoka Eat to Live hadi Fast Food Genocide.",
      qasUnit: "maswali ya wanachama",
      qasFlavor:
        "Majibu ambayo Dr. Fuhrman ametoa binafsi kwa jamii yake ya Member Center kwa miaka mingi.",
      productsUnit: "bidhaa",
      productsFlavor:
        "Kila kirutubisho na bidhaa kwenye DrFuhrman.com, pamoja na data kamili ya viungo na vipimo.",
    },
    languagePrefix: "Inapatikana kwa kila lugha anayoongea Gemini 3.5 Flash",
    videoAriaLabel:
      "Kitabu cha afya cha jalada gumu kilichofunguliwa juu ya meza ya mbao yenye joto, kimezungukwa na brokoli mbichi, kabichi ya kale, blueberi, korosho, na simu ya mkononi inayoonyesha kiolesura cha gumzo",
  },

  examples: {
    headline: "Jaribu kuuliza AI ya DFO swali halisi.",
    description:
      "Bofya swali lolote ili kuliingiza kwenye gumzo hapo juu — kisanduku chako cha kuandika kinapata umakini ili uweze kubonyeza {kbd}Enter{/kbd} kutuma.",
    questions: [
      "Ni njia gani rahisi zaidi ya kuanza kula Nutritarian?",
      "Niambie kuhusu usikivu wa mwili kwa insulini.",
      "Dr. Fuhrman anapendekeza nini kwa shinikizo la damu lililo juu?",
      "Nitafanyaje changamoto ya siku 5 ya Nutritarian?",
      "Kuna tofauti gani kati ya mboga za jamii ya kabichi (cruciferous) na mboga za majani?",
      "Ni kitabu kipi cha Dr. Fuhrman nisome kwanza?",
    ],
    ctaHint: "Ingiza kwenye gumzo →",
    videoAriaLabel:
      "Mtu katika jiko lenye mwanga wa jua akiangalia AI ya DFO kwenye simu yake juu ya bakuli la beri na mboga mbichi",
  },

  chat: {
    welcomeMessage:
      "Habari, mimi ni AI ya Dr. Joel Fuhrman. Nipo hapa kukusaidia kurudisha mamlaka juu ya afya yako — ni nini kimekuwa kikikusumbua akilini hivi karibuni?",
    starters: [
      "Habari, Dr. Fuhrman AI. Unaweza kuniambia hatua ninazoweza kuchukua ili kuanza mtindo wa maisha wenye afya zaidi?",
      "Habari Dr. Fuhrman AI, unaweza kuniambia Nutritarian inahusu nini hasa?",
      "Habari Dr. Fuhrman AI. Unaweza kuniambia kuhusu usikivu wa mwili kwa insulini?",
    ],
    tryAsking: "Jaribu kuuliza",
    emailLabel: "Kwanza, barua pepe yako ni ipi?",
    emailLabelValid: "Barua pepe yako",
    emailAriaLabel: "Barua pepe yako",
    emailPlaceholderSticky: "Kwanza, weka barua pepe yako ili kuanza gumzo…",
    askButton: "Uliza",
    questionPlaceholder: "Andika swali lako…",
    questionAriaLabel: "Uliza AI ya Dr. Fuhrman",
    questionPlaceholderSticky:
      "Uliza AI ya Dr. Fuhrman — kula, kuondoa magonjwa, kupunguza uzito…",
    sendAriaLabel: "Tuma ujumbe",
    disclaimer: [
      "Hakiki tena taarifa muhimu.",
      "Si mbadala wa ushauri wa kitabibu.",
      "AI inaweza kufanya makosa.",
    ],
    errorEmailRequired: "Tafadhali weka barua pepe yako hapo juu ili kuanza gumzo.",
    errorEmailInvalid: "Tafadhali weka anwani sahihi ya barua pepe.",
    errorEmailTooLong: "Barua pepe ni ndefu mno.",
    errorDisposable:
      "Tafadhali tumia anwani ya kudumu ya barua pepe — visanduku vya muda havitumiki.",
    errorNetwork:
      "Hitilafu ya mtandao — ujumbe huo haukufika. Tafadhali jaribu tena.",
    quotaExhaustedNudge:
      "Umetumia ujumbe wako wa bure — endelea kuzungumza na AI ya Dr. Fuhrman.",
    signupHeadline: "Ungependa kuendelea kuzungumza na AI ya Dr. Fuhrman?",
    signupBody:
      "Endeleza mazungumzo — na ufungue uzoefu kamili wa uanachama wa Nutritarian — kwenye DrFuhrman.com.",
    signupButton: "Jisajili kwenye DrFuhrman.com",
  },

  transcript: {
    heading: "Majibu halisi, moja kwa moja kutoka kwa kazi zake",
    subheading:
      "Mazungumzo halisi moja na AI ya Dr. Fuhrman — kila jibu likitegemea vitabu, mihadhara, na vipindi vyake mwenyewe, vikionyeshwa na vyanzo kamili. Teremsha ili usome yote.",
    online: "Mtandaoni",
    assistantLabel: "Msaidizi",
    recommendationPrefix: "Niligundua huenda ungependezwa na",
    composerAria: "Uliza swali lako mwenyewe katika gumzo",
    composerPlaceholder: "Uliza AI ya Dr. Fuhrman swali lako mwenyewe…",
    questions: [
      "Ni hatua zipi tatu za kwanza za kuanza mlo wa Nutritarian?",
      "Kwa sentensi moja, mlo wa Nutritarian ni nini?",
      "Taja mboga tatu za majani zenye virutubisho vingi.",
    ],
    answers: [
      [
        "Kwa kuzingatia kazi yangu katika *Eat for Health*, hatua tatu za kwanza za kuhamia mlo bora wa Nutritarian ni hizi [[7]]:",
        "**1. Badilisha fikra na ladha yako ili kupendelea vyakula vyenye virutubisho vingi.** Lazima ubadilishe mtazamo wako. Badala ya kuangazia kile unachoacha, jizoeze kutamani vyakula vinavyolisha na kulinda mwili wako zaidi—mboga za majani, maharagwe, vitunguu, uyoga, beri, na mbegu. Unapokula vyakula hivi, ladha yako hubadilika kwelikweli, na kile ambacho hapo awali kilionekana kisicho na ladha au cha kuchosha sasa huwa chenye ladha tamu na cha kuridhisha.",
        "**2. Ondoa dalili za njaa ya kuzoeleka inayosababisha ulaji kupita kiasi kwa kufanya vyakula vyenye virutubisho vingi kuwa msingi wa mlo wako.** Watu wengi wamenaswa katika mzunguko wa “njaa hatari”—kutetemeka, maumivu ya kichwa, na tamaa kali zinazosababishwa na kuachana na vyakula vilivyosindikwa vyenye virutubisho vichache. Unapojenga mlo wako kwa vyakula vyenye virutubisho vingi, mvuto huo wa kuzoeleka hupungua. Unahisi njaa ya kweli kooni, badala ya dalili zisizopendeza za kusafisha mwili tumboni, na hatimaye mwili wako huridhika na kiasi sahihi cha kalori.",
        "**3. Punguza vyakula visivyo na afya katika mlo wako wa kila siku.** Unapojaza sahani yako kwa vyakula vyenye virutubisho vingi, kwa kawaida hupunguza bidhaa zilizosindikwa, zilizosafishwa, na zinazotokana na wanyama. Si suala la ukamilifu wa siku moja; ni suala la kufanya vyakula vya mimea vyenye virutubisho vingi kuwa kitu kikuu na kuviacha vyakula visivyo na afya vibaki pembeni hadi visiwe na nguvu juu yako tena.",
        "Hatua hizi tatu hufanya kazi pamoja—huwezi kuzitenganisha kabisa. Kadiri kiwango cha virutubisho katika mlo wako kinavyoongezeka, ndivyo tamaa yako ya vyakula vyenye virutubisho vichache inavyopungua, na uwezo wako wa kula kwa ajili ya afya ya kweli badala ya uzoefu wa kuzoeleka huwa wa kawaida [[7]].",
      ],
      [
        "Mlo wa Nutritarian ni mtindo wa ulaji wenye virutubisho vingi uliojengwa juu ya kanuni kwamba Afya ni sawa na Virutubisho kugawanya kwa Kalori [[4]], ambapo unaongeza virutubisho kwa kila kalori kwa kusisitiza mboga za kijani, maharagwe, vitunguu, uyoga, beri, na mbegu huku ukiepuka vyakula vilivyosindikwa, sukari, unga mweupe, na mafuta yaliyosafishwa [[1]][[5]].",
      ],
      [
        "Ningekuelekeza kwa **kabichi ya kale, mchicha wa kolardi, na spinachi**. Mboga hizi za majani za kijani-iliyokolea zinapata alama za juu kabisa kwenye kipimo cha virutubisho—100 kati ya 100—kwa sababu zimejaa vitamini, madini, na phytochemicals zinazopambana na saratani ambazo hulinda dhidi ya magonjwa [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Inakuja hivi karibuni",
    headline: "Chukua AI ya DFO popote uendako.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Programu asili ya simu yenye utambuzi wa picha za chakula",
        body: "Piga picha ya chakula chako ukiwa dukani, jikoni, au mgahawani. AI ya DFO itakuambia papo hapo kama kinaendana na mtindo wa maisha wa Nutritarian — na cha kubadilisha nacho iwapo hakiendani.",
        imageAlt:
          "Mtu akiinua simu ya mkononi kwenye soko la wakulima, kamera ikilenga kabichi ya kale na nyanya mbichi pamoja na pete ya kijani ya uchambuzi",
      },
      {
        badge: "Nje ya mtandao · Gemma 4",
        title: "AI ya DFO, ikiendeshwa kabisa kwenye kifaa chako",
        body: "Toleo dogo la AI ya DFO, linaloendeshwa na modeli huria ya Gemma 4 ya Google. Hufanya kazi ukiwa ndani ya ndege, jikoni za maeneo ya mbali, au mwisho kabisa wa rafu ya virutubisho — bila kuhitaji muunganisho wa intaneti.",
        imageAlt:
          "Msafiri kwenye kiti cha dirisha cha ndege akitumia AI ya DFO kwenye simu yake, mawingu laini ya rangi ya dhahabu ya jioni yakionekana dirishani",
      },
    ],
  },

  bios: {
    headline: "Wataalamu walio nyuma ya AI hii.",
    subheading:
      "Sauti ya AI ya DFO imejikita katika miongo kadhaa ya kazi ya kimatibabu na ufundishaji wa Dr. Joel na Dr. Cara Fuhrman.",
    roles: [
      "Daktari wa familia aliyethibitishwa na bodi, mwandishi, mtafiti wa masuala ya lishe",
      "Daktari wa tiba ya familia, mtetezi wa lishe inayotokana na mimea",
    ],
    bodies: [
      "Dr. Fuhrman ni mwandishi aliyeshika nafasi ya kwanza katika orodha ya vitabu vinavyouzwa zaidi ya New York Times, na daktari wa familia aliyethibitishwa na bodi, mbobezi wa tiba ya lishe. Ndiye aliyebuni neno Nutritarian kuelezea mlo unaolenga ubora wa juu wa virutubisho, na ametumia miongo minne ya kazi ya kimatibabu na utafiti kuthibitisha jinsi mlo wenye virutubisho vingi unavyoweza kuzuia na hata kuondoa magonjwa sugu.",
      "Dr. Cara Fuhrman ni daktari wa tiba ya familia mwenye shauku kubwa kuhusu lishe inayotokana na mimea, na husaidia familia kujenga tabia za kiafya za kudumu maisha yote. Anashirikiana na Dr. Joel Fuhrman katika programu za elimu zinazofikisha mtazamo wa Nutritarian kwa hadhira pana zaidi. Pamoja na baba yake, alianzisha LongevityRx, kliniki ya kisasa ya tiba ya kuongeza maisha marefu iliyoko San Diego.",
    ],
    footerPrefix:
      "Kwa wasifu kamili, vitabu, na utafiti, tembelea",
  },

  cta: {
    headline: "Uko tayari kuuliza AI ya Dr. Fuhrman swali?",
    description:
      "Ni bure kujaribu. Huhitaji akaunti ili kuanza. Gumzo liko juu kabisa la ukurasa huu.",
    buttonText: "Jaribu AI ya DFO sasa",
  },

  footer: {
    poweredBy: "Inaendeshwa na",
    aiSafety: "Usalama na Maadili ya AI",
    terms: "Masharti",
    privacy: "Faragha",
  },
};
