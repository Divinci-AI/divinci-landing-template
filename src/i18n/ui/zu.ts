import type { UIStrings } from "./en";

/**
 * Zulu (zu). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const zu: UIStrings = {
  meta: {
    title: "DrFurman.ai — Isiqondiso se-Nutritarian esiqhutshwa yi-AI, 24/7",
    description:
      "Xoxa ne-AI ka-Dr. Fuhrman, eqeqeshwe ngawo wonke umsebenzi wakhe — izincwadi ezingu-12, zonke izinkulumo zevidiyo, imibuzo nezimpendulo zamalungu ezingu-20,000+, kanye nayo yonke imikhiqizo engu-180. Iyatholakala 24/7 ngazo zonke izilimi ezikhulunywa yi-Gemini 3.5 Flash.",
    ogTitle: "DrFurman.ai — Isiqondiso se-Nutritarian esiqhutshwa yi-AI, 24/7",
    ogDescription:
      "Xoxa 24/7 nomsizi oqeqeshwe ngawo wonke umsebenzi ka-Dr. Joel Fuhrman.",
    ogImageAlt: "Dr. Fuhrman AI — yonke incwadi, yonke inkulumo, yonke impendulo.",
    twitterTitle:
      "DrFurman.ai — Isiqondiso se-Nutritarian esiqhutshwa yi-AI, 24/7",
    twitterDescription:
      "Xoxa 24/7 nomsizi oqeqeshwe ngawo wonke umsebenzi ka-Dr. Joel Fuhrman.",
  },

  nav: {
    chat: "Xoxa ne-AI",
    corpus: "Lokho ekwaziyo",
    examples: "Izibonelo",
    comingSoon: "Kuyeza maduzane",
    language: "Ulimi",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "Usuyilungu lwe-drfuhrman.com?",
    memberLoginCta: "Ngena",
    headline: "Yonke incwadi. Yonke inkulumo. Yonke impendulo.",
  },

  corpus: {
    headline: "Yakhelwe phezu kwamashumi{br}amane eminyaka yocwaningo luka-Dr. Fuhrman.",
    subheading:
      "I-AI ye-DFO ayiqagi — iphendula isekela impendulo emsebenzini wangempela ka-Dr. Fuhrman.",
    stats: {
      everyWord: "Zonke",
      lecturesUnit: "izinkulumo zevidiyo",
      lecturesFlavor:
        "Zonke izinkulumo ezirekhodiwe u-Dr. Fuhrman aziethulile, zifakwe ohlwini futhi zingaphendulwa ngolimi olulula.",
      booksUnit: "izincwadi",
      booksFlavor:
        "Umtapo wezincwadi ophelele oshicilelwe ka-Dr. Fuhrman, kusukela ku-Eat to Live kuya ku-Fast Food Genocide.",
      qasUnit: "imibuzo yamalungu",
      qasFlavor:
        "Izimpendulo u-Dr. Fuhrman aziphendule yena ngokwakhe emphakathini wakhe we-Member Center kule minyaka edlule.",
      productsUnit: "imikhiqizo",
      productsFlavor:
        "Wonke ama-supplement nemikhiqizo etholakala ku-DrFuhrman.com, enedatha ephelele yezithako nemininingwane.",
    },
    languagePrefix:
      "Iyatholakala ngazo zonke izilimi ezisekelwa yi-Gemini 3.5 Flash",
    videoAriaLabel:
      "Incwadi yempilo enekhava eqinile evuliwe phezu kwetafula lokhuni elifudumele, izungezwe ubhrokholi omusha, ikhabethe lekhale, ama-blueberry, ama-walnut, kanye nefoni ekhombisa isikhombimsebenzisi sengxoxo",
  },

  examples: {
    headline: "Zama ukubuza i-AI ye-DFO umbuzo wangempela.",
    description:
      "Chofoza noma yimuphi umbuzo ukuze uwufake engxoxweni engenhla — ibhokisi lakho lokubhala lizogxila ngokuzenzakalelayo ukuze ukwazi ukucindezela u-{kbd}Enter{/kbd} ukuze uthumele.",
    questions: [
      "Iyiphi indlela elula kakhulu yokuqala ukudla i-Nutritarian?",
      "Ngitshele ngokusabela komzimba ku-insulin.",
      "U-Dr. Fuhrman uncoma ini kumuntu onomfutho wegazi ophezulu?",
      "Ngiyenza kanjani inselele ye-Nutritarian yezinsuku ezi-5?",
      "Yini umehluko phakathi kwemifino yohlobo lwekhabethe (cruciferous) nemifino enamaqabunga aluhlaza?",
      "Iyiphi incwadi ka-Dr. Fuhrman okufanele ngiyifunde kuqala?",
    ],
    ctaHint: "Faka engxoxweni →",
    videoAriaLabel:
      "Umuntu osekhishini elinelanga ehlola i-AI ye-DFO efonini yakhe phezu kwesitsha sama-berry nemifino emisha",
  },

  chat: {
    welcomeMessage:
      "Sawubona, ngiyi-AI ka-Dr. Joel Fuhrman. Ngilapha ukukusiza ukuthi uphinde ulawule impilo yakho — yini ebilokhu isekhanda lakho muva nje?",
    starters: [
      "Sawubona, Dr. Fuhrman AI. Ungangitshela izinyathelo engingazithatha ukuze ngiqale indlela yokuphila enempilo engcono?",
      "Sawubona Dr. Fuhrman AI, ungangitshela ukuthi i-Nutritarian imayelana nani?",
      "Sawubona Dr. Fuhrman AI. Ungangitshela ngokusabela komzimba ku-insulin?",
    ],
    tryAsking: "Zama ukubuza",
    emailLabel: "Okokuqala, ithini i-imeyili yakho?",
    emailLabelValid: "I-imeyili yakho",
    emailAriaLabel: "I-imeyili yakho",
    emailPlaceholderSticky: "Okokuqala, faka i-imeyili yakho ukuze uqale ukuxoxa…",
    askButton: "Buza",
    questionPlaceholder: "Bhala umbuzo wakho…",
    questionAriaLabel: "Buza i-AI ka-Dr. Fuhrman",
    questionPlaceholderSticky:
      "Buza i-AI ka-Dr. Fuhrman — ukudla, ukuhlehlisa isifo, ukwehlisa isisindo…",
    sendAriaLabel: "Thumela umlayezo",
    disclaimer: [
      "Hlola kabili ulwazi olubalulekile.",
      "Akusona isikhundla seseluleko sezokwelapha.",
      "I-AI ingenza amaphutha.",
    ],
    errorEmailRequired: "Sicela ufake i-imeyili yakho ngenhla ukuze uqale ingxoxo.",
    errorEmailInvalid: "Sicela ufake ikheli le-imeyili elivumelekile.",
    errorEmailTooLong: "I-imeyili inde kakhulu.",
    errorDisposable:
      "Sicela usebenzise ikheli le-imeyili elihlala njalo — amabhokisi okwesikhashana awasekelwa.",
    errorNetwork:
      "Iphutha lenethiwekhi — lowo mlayezo awufikanga. Sicela uzame futhi.",
    quotaExhaustedNudge:
      "Usuwusebenzisile umlayezo wakho wamahhala — qhubeka uxoxe ne-AI ka-Dr. Fuhrman.",
    signupHeadline: "Ungathanda ukuqhubeka uxoxa ne-AI ka-Dr. Fuhrman?",
    signupBody:
      "Qhubeka nengxoxo — futhi uvule sonke isipiliyoni sobulungu be-Nutritarian — ku-DrFuhrman.com.",
    signupButton: "Bhalisa ku-DrFuhrman.com",
  },

  transcript: {
    heading: "Izimpendulo zangempela, eziqhamuka ngqo emsebenzini wakhe",
    subheading:
      "Ingxoxo eyodwa yangempela ne-AI ka-Dr. Fuhrman — yonke impendulo isekelwe ezincwadini, ezinkulumweni, nasezinhlelweni zakhe siqu, kanye nemithombo eqondile ekhonjisiwe. Skrola ukuze ufunde konke.",
    online: "Ku-inthanethi",
    assistantLabel: "Umsizi",
    recommendationPrefix: "Ngiqaphele ukuthi mhlawumbe ungathanda",
    composerAria: "Buza owakho umbuzo engxoxweni",
    composerPlaceholder: "Buza i-AI ka-Dr. Fuhrman owakho umbuzo…",
    questions: [
      "Yiziphi izinyathelo ezintathu zokuqala zokuqalisa ukudla kwe-Nutritarian?",
      "Ngomusho owodwa, kuyini ukudla kwe-Nutritarian?",
      "Bala imifino emithathu enamaqabunga aluhlaza enezakhamzimba eziningi.",
    ],
    answers: [
      [
        "Ngokusekelwe emsebenzini wami ku-*Eat for Health*, izinyathelo ezintathu zokuqala zokushintshela ekudleni okunempilo kwe-Nutritarian yilezi [[7]]:",
        "**1. Lungisa kabusha indlela yakho yokucabanga nokunambitha ukuze ukhethe ukudla okucebile ngezakhamzimba.** Kufanele uguqule indlela yakho yokucabanga. Esikhundleni sokugxila kulokho okuyekayo, ziqeqeshe ukuze ufise ukudla okwenza okuningi ekondleni nasekuvikeleni umzimba wakho—imifino enamaqabunga aluhlaza, ubhontshisi, u-anyanisi, amakhowe, ama-berry, kanye nezimbewu. Njengoba udla lokhu kudla, ukunambitha kwakho kuyaguquka ngempela, futhi lokho obekubukeka kungenambitheko noma kudina sekuba mnandi futhi kwanelisa.",
        "**2. Susa izimpawu zendlala ekudonsayo eziholela ekudleni ngokweqile ngokwenza ukudla okucebile ngezakhamzimba kube isisekelo sokudla kwakho.** Abantu abaningi babanjwe emjikelezweni “wendlala eyingozi”—ukuqhaqhazela, ikhanda elibuhlungu, kanye nokulangazelela okudalwa ukuyeka ukudla okuphekiwe okunezakhamzimba ezimbalwa. Lapho wakha ukudla kwakho ngokudla okucebile ngezakhamzimba, lokho kudonseka okukudonsayo kuyancipha. Uzwa indlala yangempela emphinjeni, hhayi izimpawu ezingakhululekile zokuhlanza umzimba esiswini, futhi ekugcineni umzimba wakho wanela ngenani elifanele lamakhalori.",
        "**3. Nciphisa ukudla okungenampilo ekudleni kwakho kwansuku zonke.** Njengoba ugcwalisa ipuleti lakho ngokudla okucebile ngezakhamzimba, ngokwemvelo unciphisa imikhiqizo ephekiwe, ecwengisisiwe, nesuselwa ezilwaneni. Akumayelana nokuphelela ngosuku olulodwa; kumayelana nokwenza ukudla kwezitshalo okucebile ngezakhamzimba kube okusemqoka, bese uvumela izinketho ezingenampilo zisale eceleni zize zingabe zisakubamba.",
        "Lezi zinyathelo ezintathu zisebenza ndawonye—awukwazi ukuzihlukanisa ngokuphelele. Njengoba izinga lezakhamzimba ekudleni kwakho likhuphuka, isifiso sakho sokudla okunezakhamzimba ezimbalwa siyehla, futhi ikhono lakho lokudlela impilo yangempela kunokudonseka kuba okwenzeka ngokwemvelo [[7]].",
      ],
      [
        "Ukudla kwe-Nutritarian kuyindlela yokudla ecebile ngezakhamzimba eyakhelwe phezu komgomo wokuthi Impilo ilingana neZakhamzimba kuhlukaniswe ngamaKhalori [[4]], lapho ukhulisa izakhamzimba ngekhalori ngalinye ngokugcizelela imifino eluhlaza, ubhontshisi, u-anyanisi, amakhowe, ama-berry, nezimbewu kuyilapho ugwema ukudla okuphekiwe, ushukela, ufulawa omhlophe, namafutha acwengisisiwe [[1]][[5]].",
      ],
      [
        "Ngingakuyalela ku-**kale, kolaradi, nespinashi**. Le mifino enamaqabunga amnyama aluhlaza ithola amaphuzu aphezulu kakhulu emugqeni wezakhamzimba—100 kwayi-100—ngoba igcwele amavithamini, amaminerali, namakhemikhali ezitshalo alwa nomdlavuza avikela ezifweni [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Kuyeza maduzane",
    headline: "Hamba ne-AI ye-DFO yonke indawo.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Uhlelo lokusebenza lweselula lwangempela olunokubona izithombe zokudla",
        body: "Thatha isithombe sokudla kwakho usesitolo, usekhishini, noma usendaweni yokudlela. I-AI ye-DFO izokutshela ngokushesha ukuthi kuyahambisana yini nendlela yokuphila ye-Nutritarian — nokuthi yini ongayifaka esikhundleni sako uma kungahambisani.",
        imageAlt:
          "Umuntu ophakamise ifoni emakethe yabalimi, ikhamera ibheke u-kale omusha namatamatisi enendingilizi eluhlaza yokuhlaziya",
      },
      {
        badge: "Ngaphandle kwe-inthanethi · Gemma 4",
        title: "I-AI ye-DFO, esebenza ngokugcwele kudivayisi yakho",
        body: "Inguqulo encane ye-AI ye-DFO, eqhutshwa yimodeli evulekile ye-Gemma 4 ka-Google. Isebenza ngisho usendizeni, emakhishini asemakhaya akude, noma usekugcineni kweshalofu lama-supplement — akudingeki ukuxhumana ku-inthanethi.",
        imageAlt:
          "Isihambi esihlalweni esiseduze kwefasitela lendiza sisebenzisa i-AI ye-DFO efonini yaso, amafu athambile aphuzi ngehora legolide abonakala ngefasitela",
      },
    ],
  },

  bios: {
    headline: "Ochwepheshe abangemuva kwe-AI.",
    subheading:
      "Izwi le-AI ye-DFO ligxile emashumini eminyaka omsebenzi wezokwelapha nokufundisa kuka-Dr. Joel no-Dr. Cara Fuhrman.",
    roles: [
      "Udokotela womndeni ogunyazwe yibhodi, umbhali, umcwaningi wezokudla",
      "Udokotela wezempilo yomndeni, ummeli wokudla okususelwa ezitshalweni",
    ],
    bodies: [
      "U-Dr. Fuhrman ungumbhali ohamba phambili ohlwini lwezincwadi ezithengwa kakhulu lwe-New York Times, futhi ungudokotela womndeni ogunyazwe yibhodi onguchwepheshe wezokwelapha ngokudla. Nguye owasungula igama elithi Nutritarian ukuchaza ukudla okugxile ekutholeni izakhamzimba ezisezingeni eliphezulu, futhi usebenzise amashumi amane eminyaka omsebenzi wezokwelapha nocwaningo ukufakazela ukuthi ukudla okucebile ngama-micronutrient kungazivimbela kanjani, ngisho nokuziguqula, izifo ezingamahlalakhona.",
      "U-Dr. Cara Fuhrman ungudokotela wezempilo yomndeni onothando olukhulu lokudla okususelwa ezitshalweni, futhi usiza imindeni ukwakha imikhuba enempilo yempilo yonke. Usebenzisana no-Dr. Joel Fuhrman ezinhlelweni zemfundo ezifikisa indlela ye-Nutritarian kuzethameli ezibanzi. Kanye noyise, basungula i-LongevityRx, umtholampilo othuthukile wezokwelapha okudala impilo ende, oseSan Diego.",
    ],
    footerPrefix:
      "Ukuthola imininingwane ephelele, izincwadi, nocwaningo, vakashela",
  },

  cta: {
    headline: "Usukulungele yini ukubuza i-AI ka-Dr. Fuhrman umbuzo?",
    description:
      "Kumahhala ukuzama. Awudingi i-akhawunti ukuze uqale. Ingxoxo iseduze nje, ekuqaleni kwaleli khasi.",
    buttonText: "Zama i-AI ye-DFO manje",
  },

  footer: {
    poweredBy: "Iqhutshwa yi-",
    aiSafety: "Ukuphepha Nokuziphatha kwe-AI",
    terms: "Imigomo",
    privacy: "Ubumfihlo",
  },
};
