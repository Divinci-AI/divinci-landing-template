import type { UIStrings } from "./en";

/**
 * Polish (pl). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const pl: UIStrings = {
  meta: {
    title: "DrFurman.ai — wskazówki Nutritarian wspierane przez AI, 24/7",
    description:
      "Rozmawiaj z AI Dr. Fuhrmana, wytrenowaną na całym jego dorobku: 12 książek, każdy wykład wideo, ponad 20 000 pytań i odpowiedzi członków oraz wszystkie 180 produktów. Dostępna 24/7 w każdym języku, którym posługuje się Gemini 3.5 Flash.",
    ogTitle: "DrFurman.ai — wskazówki Nutritarian wspierane przez AI, 24/7",
    ogDescription:
      "Rozmawiaj 24/7 z asystentem wytrenowanym na całym dorobku Dr. Joel Fuhrman.",
    ogImageAlt:
      "Dr. Fuhrman AI — każda książka, każdy wykład, każda odpowiedź.",
    twitterTitle: "DrFurman.ai — wskazówki Nutritarian wspierane przez AI, 24/7",
    twitterDescription:
      "Rozmawiaj 24/7 z asystentem wytrenowanym na całym dorobku Dr. Joel Fuhrman.",
  },

  nav: {
    chat: "Rozmawiaj z AI",
    corpus: "Co wie",
    examples: "Przykłady",
    comingSoon: "Wkrótce",
    language: "Język",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "Masz już konto w drfuhrman.com?",
    memberLoginCta: "Zaloguj się",
    headline: "Każda książka. Każdy wykład. Każda odpowiedź.",
  },

  corpus: {
    headline: "Oparte na{br}czterech dekadach badań Dr. Fuhrmana.",
    subheading:
      "AI DFO nie zgaduje — odpowiada na podstawie prawdziwego dorobku Dr. Fuhrmana.",
    stats: {
      everyWord: "Każdy",
      lecturesUnit: "wykład wideo",
      lecturesFlavor:
        "Każdy nagrany wykład Dr. Fuhrmana, zindeksowany i gotowy do odpowiedzi prostym językiem.",
      booksUnit: "książek",
      booksFlavor:
        "Pełna opublikowana biblioteka Dr. Fuhrmana, od Eat to Live po Fast Food Genocide.",
      qasUnit: "pytań i odpowiedzi członków",
      qasFlavor:
        "Odpowiedzi, których Dr. Fuhrman osobiście udzielał swojej społeczności Member Center przez lata.",
      productsUnit: "produktów",
      productsFlavor:
        "Każdy suplement i produkt z DrFuhrman.com, z pełnymi danymi o składnikach i specyfikacjach.",
    },
    languagePrefix:
      "Dostępne w każdym języku obsługiwanym przez Gemini 3.5 Flash",
    videoAriaLabel:
      "Otwarta książka o zdrowiu w twardej oprawie na ciepłym drewnianym stole, otoczona świeżymi brokułami, jarmużem, jagodami, orzechami włoskimi i smartfonem wyświetlającym interfejs czatu",
  },

  examples: {
    headline: "Zadaj AI DFO prawdziwe pytanie.",
    description:
      "Kliknij dowolne pytanie, aby wstawić je do czatu powyżej — Twoje pole tekstowe zyska fokus, więc możesz nacisnąć {kbd}Enter{/kbd}, aby wysłać.",
    questions: [
      "Jaki jest najprostszy sposób, aby zacząć jeść Nutritarian?",
      "Opowiedz mi o wrażliwości na insulinę.",
      "Co Dr. Fuhrman zaleca przy wysokim ciśnieniu krwi?",
      "Jak przeprowadzić 5-dniowe wyzwanie Nutritarian?",
      "Jaka jest różnica między warzywami kapustnymi a zielonymi liściastymi?",
      "Którą z książek Dr. Fuhrmana powinienem przeczytać najpierw?",
    ],
    ctaHint: "Wstaw do czatu →",
    videoAriaLabel:
      "Osoba w nasłonecznionej kuchni sprawdzająca AI DFO na smartfonie nad miską jagód i świeżych warzyw",
  },

  chat: {
    welcomeMessage:
      "Cześć, jestem AI Dr. Joel Fuhrman. Jestem tu, aby pomóc Ci odzyskać kontrolę nad swoim zdrowiem — co Cię ostatnio nurtuje?",
    starters: [
      "Cześć, Dr. Fuhrman AI. Czy możesz mi powiedzieć, jakie kroki mogę podjąć, aby rozpocząć zdrowszy styl życia?",
      "Cześć Dr. Fuhrman AI, czy możesz mi powiedzieć, na czym właściwie polega Nutritarian?",
      "Cześć Dr. Fuhrman AI. Czy możesz mi opowiedzieć o wrażliwości na insulinę?",
    ],
    tryAsking: "Spróbuj zapytać",
    emailLabel: "Najpierw: jaki jest Twój adres e-mail?",
    emailLabelValid: "Twój adres e-mail",
    emailAriaLabel: "Twój adres e-mail",
    emailPlaceholderSticky: "Najpierw Twój adres e-mail, aby rozpocząć czat…",
    askButton: "Zapytaj",
    questionPlaceholder: "Wpisz swoje pytanie…",
    questionAriaLabel: "Zapytaj Dr. Fuhrman AI",
    questionPlaceholderSticky:
      "Zapytaj Dr. Fuhrman AI — odżywianie, odwracanie chorób, utrata wagi…",
    sendAriaLabel: "Wyślij wiadomość",
    disclaimer: [
      "Sprawdź dokładnie ważne informacje.",
      "Nie zastępuje porady lekarskiej.",
      "AI może popełniać błędy.",
    ],
    errorEmailRequired:
      "Wprowadź powyżej swój adres e-mail, aby rozpocząć czat.",
    errorEmailInvalid: "Wprowadź prawidłowy adres e-mail.",
    errorEmailTooLong: "Adres e-mail jest zbyt długi.",
    errorDisposable:
      "Użyj stałego adresu e-mail — jednorazowe skrzynki nie są obsługiwane.",
    errorNetwork:
      "Błąd sieci — ta wiadomość nie została dostarczona. Spróbuj ponownie.",
    quotaExhaustedNudge:
      "Wykorzystałeś swoją darmową wiadomość — rozmawiaj dalej z AI Dr. Fuhrmana.",
    signupHeadline: "Chcesz dalej rozmawiać z AI Dr. Fuhrmana?",
    signupBody:
      "Kontynuuj rozmowę — i odblokuj pełne doświadczenie członkostwa Nutritarian — na DrFuhrman.com.",
    signupButton: "Zarejestruj się na DrFuhrman.com",
  },

  transcript: {
    heading: "Prawdziwe odpowiedzi, prosto z dorobku",
    subheading:
      "Jedna prawdziwa rozmowa z Dr. Fuhrman AI — każda odpowiedź oparta na jego własnych książkach, wykładach i programach, z dokładnie wskazanymi źródłami. Przewiń, aby przeczytać całość.",
    online: "Online",
    assistantLabel: "Asystent",
    recommendationPrefix: "Zauważyłem, że może Cię zainteresować",
    composerAria: "Zadaj własne pytanie na czacie",
    composerPlaceholder: "Zadaj AI Dr. Fuhrmana własne pytanie…",
    questions: [
      "Jakie są pierwsze trzy kroki, aby rozpocząć dietę Nutritarian?",
      "Czym jest dieta Nutritarian w jednym zdaniu?",
      "Wymień trzy bogate w składniki odżywcze zielone warzywa liściaste.",
    ],
    answers: [
      [
        "Na podstawie mojej pracy w *Eat for Health* pierwsze trzy kroki przejścia na zdrową dietę Nutritarian są następujące [[7]]:",
        "**1. Przeprogramuj swoje myślenie i upodobania smakowe, aby preferować pokarmy bogate w mikroskładniki.** Musisz zmienić sposób myślenia. Zamiast skupiać się na tym, z czego rezygnujesz, naucz się pragnąć pokarmów, które robią najwięcej, by odżywić i chronić Twoje ciało — zielonych warzyw liściastych, fasoli, cebuli, grzybów, jagód i nasion. Gdy spożywasz te pokarmy, Twoje kubki smakowe faktycznie się zmieniają, a to, co kiedyś wydawało się nijakie lub nudne, staje się wyraziste i satysfakcjonujące.",
        "**2. Wyeliminuj uzależniające objawy głodu prowadzące do przejadania się, czyniąc pokarmy bogate w mikroskładniki podstawą swojej diety.** Większość ludzi tkwi w cyklach „toksycznego głodu“ — drżenia, bólów głowy i zachcianek wywołanych odstawieniem ubogich w składniki, przetworzonych pokarmów. Gdy budujesz swoją dietę wokół pokarmów o wysokiej gęstości odżywczej, ten uzależniający pociąg słabnie. Doświadczasz prawdziwego głodu w gardle, a nie nieprzyjemnych objawów detoksykacji w żołądku, i Twoje ciało w końcu zaspokaja się odpowiednią ilością kalorii.",
        "**3. Ogranicz niezdrowe pokarmy w swojej codziennej diecie.** Gdy zapełniasz talerz pokarmami bogatymi w składniki odżywcze, naturalnie ograniczasz produkty przetworzone, rafinowane i pochodzenia zwierzęcego. Nie chodzi o doskonałość w jeden dzień; chodzi o to, by pokarmy roślinne bogate w mikroskładniki stały się głównym daniem, a niezdrowe opcje zeszły na margines, aż przestaną mieć nad Tobą władzę.",
        "Te trzy kroki działają razem — nie da się ich w pełni od siebie oddzielić. Wraz ze wzrostem gęstości odżywczej Twojej diety maleje Twoje pragnienie pokarmów ubogich w składniki, a Twoja zdolność do jedzenia dla prawdziwego zdrowia, a nie z uzależnienia, staje się automatyczna [[7]].",
      ],
      [
        "Dieta Nutritarian to bogaty w składniki odżywcze styl odżywiania oparty na zasadzie, że Zdrowie równa się Składniki odżywcze podzielone przez Kalorie [[4]], w którym maksymalizujesz mikroskładniki na kalorię, kładąc nacisk na zielone warzywa, fasolę, cebulę, grzyby, jagody i nasiona, jednocześnie unikając przetworzonych pokarmów, cukru, białej mąki i rafinowanych olejów [[1]][[5]].",
      ],
      [
        "Wskazałbym Ci **jarmuż, kapustę liściastą i szpinak**. Te ciemne warzywa liściaste znajdują się na samym szczycie skali gęstości odżywczej — 100 na 100 — ponieważ są pełne witamin, minerałów i zwalczających raka fitozwiązków, które chronią przed chorobami [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Wkrótce",
    headline: "Zabierz AI DFO ze sobą — wszędzie.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Natywna aplikacja mobilna z rozpoznawaniem zdjęć jedzenia",
        body: "Zrób zdjęcie swojego jedzenia w sklepie spożywczym, w kuchni lub w restauracji. AI DFO natychmiast powie Ci, czy pasuje do stylu życia Nutritarian — i co zamienić, jeśli nie pasuje.",
        imageAlt:
          "Osoba trzymająca smartfon na targu rolniczym, z kamerą skierowaną na świeży jarmuż i pomidory z zielonym pierścieniem analizy",
      },
      {
        badge: "Offline · Gemma 4",
        title: "AI DFO, działająca w całości na Twoim urządzeniu",
        body: "Skompresowana wersja AI DFO, oparta na otwartym modelu Gemma 4 od Google. Działa w samolotach, w odległych kuchniach, na końcu alejki z suplementami — bez potrzeby połączenia.",
        imageAlt:
          "Podróżny na miejscu przy oknie w samolocie korzystający z AI DFO na smartfonie, z miękkimi złocistymi chmurami zachodu słońca widocznymi przez okno",
      },
    ],
  },

  bios: {
    headline: "Umysły stojące za AI.",
    subheading:
      "Głos AI DFO jest oparty na dekadach praktyki klinicznej i nauczania Dr. Joel i Dr. Cara Fuhrman.",
    roles: [
      "Certyfikowany lekarz rodzinny, autor, badacz żywienia",
      "Lekarka rodzinna, propagatorka żywienia roślinnego",
    ],
    bodies: [
      "Dr. Fuhrman jest autorem bestsellerów nr 1 według New York Times oraz certyfikowanym lekarzem rodzinnym specjalizującym się w medycynie żywieniowej. Ukuł termin Nutritarian, aby opisać dietę dążącą do doskonałości żywieniowej, i poświęcił cztery dekady praktyki klinicznej oraz badań na dokumentowanie tego, jak dieta bogata w mikroskładniki może zapobiegać chorobom przewlekłym i je odwracać.",
      "Dr. Cara Fuhrman jest lekarką rodzinną z pasją do żywienia roślinnego i pomagania rodzinom w budowaniu zdrowych nawyków na całe życie. Współpracuje z Dr. Joel Fuhrman przy programach edukacyjnych, które przybliżają podejście Nutritarian szerszej publiczności. Wraz z ojcem współzałożyła LongevityRx, nowoczesną klinikę medycyny długowieczności w San Diego.",
    ],
    footerPrefix:
      "Pełne biografie, książki i badania znajdziesz na",
  },

  cta: {
    headline: "Gotowy, aby zadać pytanie AI Dr. Fuhrmana?",
    description:
      "Bezpłatne do wypróbowania. Aby zacząć, nie potrzebujesz konta. Czat znajduje się na samej górze tej strony.",
    buttonText: "Wypróbuj AI DFO teraz",
  },

  footer: {
    poweredBy: "Napędzane przez",
    aiSafety: "Bezpieczeństwo i etyka AI",
    terms: "Warunki",
    privacy: "Prywatność",
  },
};
