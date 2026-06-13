import type { UIStrings } from "./en";

/**
 * Dutch (nl). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const nl: UIStrings = {
  meta: {
    title: "DrFurman.ai — AI-gestuurde Nutritarian-begeleiding, 24/7",
    description:
      "Chat met de AI van Dr. Fuhrman, getraind op zijn volledige corpus: 12 boeken, al zijn videocolleges, meer dan 20.000 ledenvragen en alle 180 producten. Beschikbaar 24/7 in elke taal die Gemini 3.5 Flash spreekt.",
    ogTitle: "DrFurman.ai — AI-gestuurde Nutritarian-begeleiding, 24/7",
    ogDescription:
      "Chat 24/7 met een assistent die is getraind op het volledige werk van Dr. Joel Fuhrman.",
    ogImageAlt:
      "Dr. Fuhrman AI — elk boek, elk college, elk antwoord.",
    twitterTitle: "DrFurman.ai — AI-gestuurde Nutritarian-begeleiding, 24/7",
    twitterDescription:
      "Chat 24/7 met een assistent die is getraind op het volledige werk van Dr. Joel Fuhrman.",
  },

  nav: {
    chat: "Chat met de AI",
    corpus: "Wat het weet",
    examples: "Voorbeelden",
    comingSoon: "Binnenkort",
    language: "Taal",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "Al lid van drfuhrman.com?",
    memberLoginCta: "Inloggen",
    headline: "Elk boek. Elk college. Elk antwoord.",
  },

  corpus: {
    headline: "Gebouwd op Dr. Fuhrmans{br}vier decennia onderzoek.",
    subheading:
      "De DFO-AI gokt niet — het antwoordt vanuit het echte corpus van Dr. Fuhrman.",
    stats: {
      everyWord: "Alle",
      lecturesUnit: "videocolleges",
      lecturesFlavor:
        "Elk opgenomen college van Dr. Fuhrman, geïndexeerd en in eenvoudige taal te raadplegen.",
      booksUnit: "boeken",
      booksFlavor:
        "De volledige gepubliceerde bibliotheek van Dr. Fuhrman, van Eat to Live tot Fast Food Genocide.",
      qasUnit: "ledenvragen",
      qasFlavor:
        "Antwoorden die Dr. Fuhrman door de jaren heen persoonlijk aan zijn Member Center-gemeenschap heeft gegeven.",
      productsUnit: "producten",
      productsFlavor:
        "Alle supplementen en producten op DrFuhrman.com, met volledige ingrediënt- en specificatiegegevens.",
    },
    languagePrefix:
      "Beschikbaar in elke taal die door Gemini 3.5 Flash wordt ondersteund",
    videoAriaLabel:
      "Een open gebonden gezondheidsboek op een warme houten tafel, omringd door verse broccoli, boerenkool, bosbessen, walnoten en een smartphone met een chatinterface",
  },

  examples: {
    headline: "Stel de DFO-AI eens een echte vraag.",
    description:
      "Klik op een vraag om die in de chat hierboven te plaatsen — je invoerveld krijgt de focus, zodat je op {kbd}Enter{/kbd} kunt drukken om te verzenden.",
    questions: [
      "Wat is de eenvoudigste manier om Nutritarian te gaan eten?",
      "Vertel me over insulinegevoeligheid.",
      "Wat raadt Dr. Fuhrman aan bij hoge bloeddruk?",
      "Hoe doe ik een Nutritarian-uitdaging van 5 dagen?",
      "Wat is het verschil tussen kruisbloemige en bladgroene groenten?",
      "Welk van Dr. Fuhrmans boeken zou ik als eerste moeten lezen?",
    ],
    ctaHint: "In de chat plaatsen →",
    videoAriaLabel:
      "Een persoon in een zonovergoten keuken die de DFO-AI raadpleegt op zijn smartphone boven een kom bessen en vers groen",
  },

  chat: {
    welcomeMessage:
      "Hoi, ik ben de AI van Dr. Joel Fuhrman. Ik help je graag om de controle over je gezondheid terug te nemen — wat houdt je de laatste tijd bezig?",
    starters: [
      "Hoi, Dr. Fuhrman AI. Kun je me stappen vertellen die ik kan zetten om aan een gezondere levensstijl te beginnen?",
      "Hoi Dr. Fuhrman AI, kun je me vertellen waar Nutritarian allemaal over gaat?",
      "Hoi Dr. Fuhrman AI. Kun je me iets vertellen over insulinegevoeligheid?",
    ],
    tryAsking: "Probeer te vragen",
    emailLabel: "Eerst: wat is je e-mailadres?",
    emailLabelValid: "Je e-mailadres",
    emailAriaLabel: "Je e-mailadres",
    emailPlaceholderSticky: "Eerst je e-mailadres om te beginnen met chatten…",
    askButton: "Vragen",
    questionPlaceholder: "Typ je vraag…",
    questionAriaLabel: "Vraag het de Dr. Fuhrman AI",
    questionPlaceholderSticky:
      "Vraag het de Dr. Fuhrman AI — voeding, ziekteomkering, gewichtsverlies…",
    sendAriaLabel: "Bericht versturen",
    disclaimer: [
      "Controleer belangrijke informatie nog eens.",
      "Geen vervanging voor medisch advies.",
      "AI kan fouten maken.",
    ],
    errorEmailRequired: "Voer hierboven je e-mailadres in om de chat te starten.",
    errorEmailInvalid: "Voer een geldig e-mailadres in.",
    errorEmailTooLong: "Het e-mailadres is te lang.",
    errorDisposable:
      "Gebruik een permanent e-mailadres — wegwerpadressen worden niet ondersteund.",
    errorNetwork:
      "Netwerkfout — dat bericht is niet afgeleverd. Probeer het opnieuw.",
    quotaExhaustedNudge:
      "Je hebt je gratis bericht gebruikt — blijf praten met de AI van Dr. Fuhrman.",
    signupHeadline: "Wil je blijven praten met de AI van Dr. Fuhrman?",
    signupBody:
      "Zet het gesprek voort — en ontgrendel de volledige Nutritarian-lidmaatschapservaring — op DrFuhrman.com.",
    signupButton: "Meld je aan op DrFuhrman.com",
  },

  transcript: {
    heading: "Echte antwoorden, rechtstreeks uit het corpus",
    subheading:
      "Eén echt gesprek met de Dr. Fuhrman AI — elk antwoord gegrond in zijn eigen boeken, lezingen en shows, met de exacte bronnen erbij. Scroll om het hele gesprek te lezen.",
    online: "Online",
    assistantLabel: "Assistent",
    recommendationPrefix: "Ik merkte dat je mogelijk geïnteresseerd bent in",
    composerAria: "Stel je eigen vraag in de chat",
    composerPlaceholder: "Stel de AI van Dr. Fuhrman je eigen vraag…",
    questions: [
      "Wat zijn de eerste drie stappen om met een Nutritarian-dieet te beginnen?",
      "Wat is een Nutritarian-dieet in één zin?",
      "Noem drie voedingsrijke bladgroenten.",
    ],
    answers: [
      [
        "Op basis van mijn werk in *Eat for Health* zijn de eerste drie stappen om over te stappen op een gezond Nutritarian-dieet de volgende [[7]]:",
        "**1. Herprogrammeer je denken en je smaak om micronutriëntrijke voeding te verkiezen.** Je moet je mindset veranderen. In plaats van je te richten op wat je opgeeft, train jezelf om te verlangen naar de voeding die het meest doet om je lichaam te voeden en te beschermen — bladgroenten, bonen, uien, paddenstoelen, bessen en zaden. Naarmate je deze voeding eet, veranderen je smaakpapillen daadwerkelijk, en wat ooit saai of flauw leek, wordt levendig en bevredigend.",
        "**2. Schakel verslavende hongersymptomen uit die tot overeten leiden, door micronutriëntrijke voeding de basis van je dieet te maken.** De meeste mensen zitten gevangen in cycli van „toxische honger“ — beverigheid, hoofdpijn en cravings veroorzaakt door ontwenning van voedselarme, bewerkte producten. Wanneer je je dieet opbouwt rond voeding met een hoge voedingsdichtheid, neemt die verslavende drang af. Je ervaart echte honger in de keel, niet de ongemakkelijke ontgiftingssymptomen in de maag, en je lichaam raakt eindelijk verzadigd met de juiste hoeveelheid calorieën.",
        "**3. Beperk ongezonde voeding in je dagelijkse dieet.** Naarmate je je bord vult met voedingsrijke producten, verminder je vanzelf de bewerkte, geraffineerde en dierlijke producten. Het gaat niet om perfectie op één dag; het gaat erom micronutriëntrijke plantaardige voeding tot hoofdrol te maken en de ongezonde opties naar de zijlijn te laten zakken totdat ze geen grip meer op je hebben.",
        "Deze drie stappen werken samen — je kunt ze niet volledig van elkaar scheiden. Naarmate de voedingsdichtheid van je dieet toeneemt, neemt je verlangen naar voedselarme producten af, en wordt je vermogen om voor echte gezondheid te eten in plaats van uit verslaving vanzelfsprekend [[7]].",
      ],
      [
        "Een Nutritarian-dieet is een voedingsrijke eetstijl gebouwd op het principe dat Gezondheid gelijk is aan Voedingsstoffen gedeeld door Calorieën [[4]], waarbij je de micronutriënten per calorie maximaliseert door groene groenten, bonen, uien, paddenstoelen, bessen en zaden te benadrukken terwijl je bewerkte voeding, suiker, witte bloem en geraffineerde oliën vermijdt [[1]][[5]].",
      ],
      [
        "Ik zou je wijzen op **boerenkool, bladkool en spinazie**. Deze donkere bladgroenten scoren helemaal bovenaan de lijn van voedingsdichtheid — 100 van de 100 — omdat ze boordevol vitamines, mineralen en kankerbestrijdende fytochemicaliën zitten die tegen ziekten beschermen [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Binnenkort",
    headline: "Neem de DFO-AI overal mee naartoe.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Native mobiele app met voedselfotoherkenning",
        body: "Maak een foto van je eten in de supermarkt, in de keuken of in een restaurant. De DFO-AI vertelt je meteen of het past bij een Nutritarian-levensstijl — en wat je kunt vervangen als dat niet zo is.",
        imageAlt:
          "Een persoon die op een boerenmarkt een smartphone omhoog houdt, met de camera op verse boerenkool en tomaten gericht met een groene analysering",
      },
      {
        badge: "Offline · Gemma 4",
        title: "De DFO-AI, volledig draaiend op je apparaat",
        body: "Een gecomprimeerde versie van de DFO-AI, aangedreven door Google's open model Gemma 4. Werkt in vliegtuigen, in afgelegen keukens, achter in het supplementenschap — geen verbinding vereist.",
        imageAlt:
          "Een reiziger op een raamstoel in een vliegtuig die de DFO-AI op zijn smartphone gebruikt, met zachte gouden avondwolken zichtbaar door het raam",
      },
    ],
  },

  bios: {
    headline: "De geesten achter de AI.",
    subheading:
      "De stem van de DFO-AI is geworteld in decennia klinische praktijk en onderwijs van Dr. Joel en Dr. Cara Fuhrman.",
    roles: [
      "Gecertificeerd huisarts, auteur, voedingsonderzoeker",
      "Huisarts, pleitbezorger van plantaardige voeding",
    ],
    bodies: [
      "Dr. Fuhrman is een nummer 1 New York Times-bestsellerauteur en een gecertificeerd huisarts gespecialiseerd in voedingsgeneeskunde. Hij bedacht de term Nutritarian om een dieet te beschrijven dat streeft naar voedingskundige uitmuntendheid, en heeft vier decennia klinische praktijk en onderzoek gewijd aan het documenteren hoe een dieet rijk aan micronutriënten chronische ziekten kan voorkomen en omkeren.",
      "Dr. Cara Fuhrman is een huisarts met een passie voor plantaardige voeding en voor het helpen van gezinnen om levenslange gezonde gewoonten op te bouwen. Ze werkt samen met Dr. Joel Fuhrman aan educatieve programma's die de Nutritarian-aanpak bij een breder publiek brengen. Samen met haar vader richtte ze LongevityRx op, een geavanceerde kliniek voor longevity-geneeskunde in San Diego.",
    ],
    footerPrefix: "Voor volledige biografieën, boeken en onderzoek, bezoek",
  },

  cta: {
    headline: "Klaar om de AI van Dr. Fuhrman een vraag te stellen?",
    description:
      "Gratis te proberen. Geen account nodig om te beginnen. De chat staat boven aan deze pagina.",
    buttonText: "Probeer de DFO-AI nu",
  },

  footer: {
    poweredBy: "Mogelijk gemaakt door",
    aiSafety: "AI-veiligheid en -ethiek",
    terms: "Voorwaarden",
    privacy: "Privacy",
  },
};
