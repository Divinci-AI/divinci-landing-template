import type { UIStrings } from "./en";

/**
 * Czech (cs). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const cs: UIStrings = {
  meta: {
    title: "DrFurman.ai — Nutritarian poradenství s podporou AI, 24/7",
    description:
      "Chatujte s AI Dr. Fuhrmana, vytrénovanou na celém jeho díle: 12 knih, každá videopřednáška, více než 20 000 otázek a odpovědí členů a všech 180 produktů. K dispozici 24/7 ve všech jazycích, kterými mluví Gemini 3.5 Flash.",
    ogTitle: "DrFurman.ai — Nutritarian poradenství s podporou AI, 24/7",
    ogDescription:
      "Chatujte 24/7 s asistentem vytrénovaným na kompletním díle Dr. Joel Fuhrman.",
    ogImageAlt:
      "Dr. Fuhrman AI — každá kniha, každá přednáška, každá odpověď.",
    twitterTitle: "DrFurman.ai — Nutritarian poradenství s podporou AI, 24/7",
    twitterDescription:
      "Chatujte 24/7 s asistentem vytrénovaným na kompletním díle Dr. Joel Fuhrman.",
  },

  nav: {
    chat: "Chatovat s AI",
    corpus: "Co umí",
    examples: "Příklady",
    comingSoon: "Již brzy",
    language: "Jazyk",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "Už jste členem drfuhrman.com?",
    memberLoginCta: "Přihlásit se",
    headline: "Každá kniha. Každá přednáška. Každá odpověď.",
  },

  corpus: {
    headline: "Postaveno na{br}čtyřech desetiletích výzkumu Dr. Fuhrmana.",
    subheading:
      "AI DFO nehádá — odpovídá ze skutečného díla Dr. Fuhrmana.",
    stats: {
      everyWord: "Každá",
      lecturesUnit: "videopřednáška",
      lecturesFlavor:
        "Každá nahraná přednáška Dr. Fuhrmana, indexovaná a zodpověditelná srozumitelným jazykem.",
      booksUnit: "knih",
      booksFlavor:
        "Kompletní publikovaná knihovna Dr. Fuhrmana, od Eat to Live po Fast Food Genocide.",
      qasUnit: "otázek členů",
      qasFlavor:
        "Odpovědi, které Dr. Fuhrman osobně poskytl své komunitě Member Center v průběhu let.",
      productsUnit: "produktů",
      productsFlavor:
        "Každý doplněk a produkt na DrFuhrman.com, s úplnými údaji o složení a specifikacích.",
    },
    languagePrefix:
      "K dispozici ve všech jazycích, které podporuje Gemini 3.5 Flash",
    videoAriaLabel:
      "Otevřená kniha o zdraví v pevné vazbě na teplém dřevěném stole, obklopená čerstvou brokolicí, kapustou kale, borůvkami, vlašskými ořechy a chytrým telefonem se zobrazeným chatovacím rozhraním",
  },

  examples: {
    headline: "Položte AI DFO skutečnou otázku.",
    description:
      "Klikněte na libovolnou otázku a vložte ji do chatu výše — vaše textové pole získá fokus, takže můžete stisknout {kbd}Enter{/kbd} a odeslat ji.",
    questions: [
      "Jaký je nejjednodušší způsob, jak začít jíst Nutritarian?",
      "Pověz mi o citlivosti na inzulin.",
      "Co Dr. Fuhrman doporučuje při vysokém krevním tlaku?",
      "Jak provedu 5denní výzvu Nutritarian?",
      "Jaký je rozdíl mezi košťálovou a listovou zelenou zeleninou?",
      "Kterou z knih Dr. Fuhrmana bych měl přečíst jako první?",
    ],
    ctaHint: "Vložit do chatu →",
    videoAriaLabel:
      "Osoba ve slunné kuchyni kontrolující AI DFO na svém chytrém telefonu nad miskou bobulí a čerstvé zeleniny",
  },

  chat: {
    welcomeMessage:
      "Ahoj, jsem AI Dr. Joel Fuhrman. Jsem tu, abych vám pomohl převzít zpět kontrolu nad svým zdravím — co vám v poslední době leží na srdci?",
    starters: [
      "Ahoj, Dr. Fuhrman AI. Můžete mi říct, jaké kroky mohu podniknout pro zahájení zdravějšího životního stylu?",
      "Ahoj Dr. Fuhrman AI, můžete mi říct, o čem Nutritarian vlastně je?",
      "Ahoj Dr. Fuhrman AI. Můžete mi povědět něco o citlivosti na inzulin?",
    ],
    tryAsking: "Zkuste se zeptat",
    emailLabel: "Nejprve: jaký je váš e-mail?",
    emailLabelValid: "Váš e-mail",
    emailAriaLabel: "Váš e-mail",
    emailPlaceholderSticky: "Nejprve váš e-mail pro zahájení chatu…",
    askButton: "Zeptat se",
    questionPlaceholder: "Napište svou otázku…",
    questionAriaLabel: "Zeptejte se Dr. Fuhrman AI",
    questionPlaceholderSticky:
      "Zeptejte se Dr. Fuhrman AI — stravování, zvrácení nemocí, hubnutí…",
    sendAriaLabel: "Odeslat zprávu",
    disclaimer: [
      "Důležité informace si raději ověřte.",
      "Není náhradou lékařské rady.",
      "AI může dělat chyby.",
    ],
    errorEmailRequired:
      "Zadejte prosím výše svůj e-mail pro zahájení chatu.",
    errorEmailInvalid: "Zadejte prosím platnou e-mailovou adresu.",
    errorEmailTooLong: "E-mail je příliš dlouhý.",
    errorDisposable:
      "Použijte prosím trvalou e-mailovou adresu — jednorázové schránky nejsou podporovány.",
    errorNetwork:
      "Chyba sítě — tato zpráva nebyla doručena. Zkuste to prosím znovu.",
    quotaExhaustedNudge:
      "Využili jste svou bezplatnou zprávu — pokračujte v rozhovoru s AI Dr. Fuhrmana.",
    signupHeadline: "Chcete pokračovat v rozhovoru s AI Dr. Fuhrmana?",
    signupBody:
      "Pokračujte v konverzaci — a odemkněte plný zážitek z členství Nutritarian — na DrFuhrman.com.",
    signupButton: "Zaregistrujte se na DrFuhrman.com",
  },

  transcript: {
    heading: "Skutečné odpovědi, přímo z díla",
    subheading:
      "Jeden skutečný rozhovor s Dr. Fuhrman AI — každá odpověď vychází z jeho vlastních knih, přednášek a pořadů, s přesně uvedenými zdroji. Posouvejte se a přečtěte si celý rozhovor.",
    online: "Online",
    assistantLabel: "Asistent",
    recommendationPrefix: "Všiml jsem si, že by vás mohlo zajímat",
    composerAria: "Položte vlastní otázku v chatu",
    composerPlaceholder: "Položte AI Dr. Fuhrmana vlastní otázku…",
    questions: [
      "Jaké jsou první tři kroky k zahájení diety Nutritarian?",
      "Co je dieta Nutritarian v jedné větě?",
      "Jmenujte tři listové zeleniny bohaté na živiny.",
    ],
    answers: [
      [
        "Na základě své práce v *Eat for Health* jsou první tři kroky k přechodu na zdravou dietu Nutritarian tyto [[7]]:",
        "**1. Přeprogramujte své myšlení a chutě tak, abyste upřednostňovali potraviny bohaté na mikroživiny.** Musíte změnit své nastavení mysli. Místo abyste se zaměřovali na to, čeho se vzdáváte, naučte se toužit po potravinách, které nejvíce přispívají k výživě a ochraně vašeho těla — listové zelenině, fazolích, cibuli, houbách, bobulích a semínkách. Jak tyto potraviny konzumujete, vaše chuťové pohárky se skutečně mění a to, co dříve působilo nevýrazně či nudně, se stává živým a uspokojivým.",
        "**2. Odstraňte návykové příznaky hladu vedoucí k přejídání tím, že potraviny bohaté na mikroživiny učiníte základem své stravy.** Většina lidí je uvězněna v cyklech „toxického hladu“ — třesu, bolestí hlavy a chutí způsobených odvykáním od potravin chudých na živiny a zpracovaných. Když svou stravu postavíte na potravinách s vysokou hustotou živin, tento návykový tah polevuje. Zažíváte skutečný hlad v krku, nikoli nepříjemné detoxikační příznaky v žaludku, a vaše tělo je konečně uspokojeno správným množstvím kalorií.",
        "**3. Omezte nezdravé potraviny ve své každodenní stravě.** Jak svůj talíř plníte potravinami bohatými na živiny, přirozeně omezujete zpracované, rafinované a živočišné produkty. Nejde o dokonalost v jednom dni; jde o to, učinit z rostlinných potravin bohatých na mikroživiny hlavní chod a nechat nezdravé možnosti ustoupit na okraj, dokud nad vámi nepřestanou mít moc.",
        "Tyto tři kroky působí společně — nelze je od sebe zcela oddělit. Jak roste hustota živin ve vaší stravě, klesá vaše touha po potravinách chudých na živiny a vaše schopnost jíst pro skutečné zdraví, a ne ze závislosti, se stává automatickou [[7]].",
      ],
      [
        "Dieta Nutritarian je stravovací styl bohatý na živiny postavený na principu, že Zdraví se rovná Živiny dělené Kaloriemi [[4]], kdy maximalizujete mikroživiny na kalorii tím, že zdůrazňujete zelenou zeleninu, fazole, cibuli, houby, bobule a semínka, a přitom se vyhýbáte zpracovaným potravinám, cukru, bílé mouce a rafinovaným olejům [[1]][[5]].",
      ],
      [
        "Nasměroval bych vás na **kapustu kale, listovou kapustu a špenát**. Tyto tmavé listové zeleniny jsou na samém vrcholu škály hustoty živin — 100 ze 100 — protože jsou plné vitaminů, minerálů a fytochemikálií bojujících proti rakovině, které chrání před nemocemi [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Již brzy",
    headline: "Vezměte si AI DFO s sebou — kamkoli.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Nativní mobilní aplikace s rozpoznáváním fotek jídla",
        body: "Vyfoťte si své jídlo v obchodě s potravinami, v kuchyni nebo v restauraci. AI DFO vám okamžitě řekne, zda zapadá do životního stylu Nutritarian — a co vyměnit, pokud nezapadá.",
        imageAlt:
          "Osoba držící chytrý telefon na farmářském trhu, kamera namířená na čerstvou kapustu kale a rajčata se zeleným analytickým prstencem",
      },
      {
        badge: "Offline · Gemma 4",
        title: "AI DFO běžící zcela na vašem zařízení",
        body: "Komprimovaná verze AI DFO poháněná otevřeným modelem Gemma 4 od Google. Funguje v letadlech, ve vzdálených kuchyních, na konci uličky s doplňky — bez nutnosti připojení.",
        imageAlt:
          "Cestovatel na sedadle u okna v letadle používající AI DFO na svém chytrém telefonu, oknem jsou vidět jemné zlatavé mraky při západu slunce",
      },
    ],
  },

  bios: {
    headline: "Mysli za AI.",
    subheading:
      "Hlas AI DFO vychází z desetiletí klinické praxe a výuky Dr. Joel a Dr. Cara Fuhrman.",
    roles: [
      "Atestovaný praktický lékař, autor, výzkumník výživy",
      "Praktická lékařka, propagátorka rostlinné výživy",
    ],
    bodies: [
      "Dr. Fuhrman je autorem bestsellerů č. 1 podle New York Times a atestovaným praktickým lékařem se specializací na nutriční medicínu. Zavedl termín Nutritarian pro popis stravy usilující o nutriční dokonalost a věnoval čtyři desetiletí klinické praxe a výzkumu dokumentování toho, jak strava bohatá na mikroživiny dokáže předcházet chronickým onemocněním a zvrátit je.",
      "Dr. Cara Fuhrman je praktická lékařka s nadšením pro rostlinnou výživu a pomoc rodinám budovat celoživotní zdravé návyky. Spolupracuje s Dr. Joel Fuhrman na vzdělávacích programech, které přibližují přístup Nutritarian širšímu publiku. Společně se svým otcem spoluzaložila LongevityRx, moderní kliniku medicíny dlouhověkosti v San Diego.",
    ],
    footerPrefix:
      "Úplné biografie, knihy a výzkum najdete na",
  },

  cta: {
    headline: "Připraveni položit otázku AI Dr. Fuhrmana?",
    description:
      "Zdarma k vyzkoušení. K začátku není potřeba účet. Chat je hned nahoře na této stránce.",
    buttonText: "Vyzkoušejte AI DFO nyní",
  },

  footer: {
    poweredBy: "Poháněno",
    aiSafety: "Bezpečnost a etika AI",
    terms: "Podmínky",
    privacy: "Soukromí",
  },
};
