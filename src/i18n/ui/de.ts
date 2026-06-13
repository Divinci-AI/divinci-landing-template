import type { UIStrings } from "./en";

/**
 * German (de). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const de: UIStrings = {
  meta: {
    title: "DrFurman.ai — KI-gestützte Nutritarian-Beratung, 24/7",
    description:
      "Chatte mit der KI von Dr. Fuhrman, trainiert auf seinem gesamten Korpus: 12 Bücher, alle Video-Vorträge, über 20.000 Mitglieder-Fragen und alle 180 Produkte. Verfügbar rund um die Uhr in jeder Sprache, die Gemini 3.5 Flash spricht.",
    ogTitle: "DrFurman.ai — KI-gestützte Nutritarian-Beratung, 24/7",
    ogDescription:
      "Chatte rund um die Uhr mit einem Assistenten, der auf dem gesamten Werk von Dr. Joel Fuhrman trainiert wurde.",
    ogImageAlt:
      "Dr. Fuhrman AI — jedes Buch, jeder Vortrag, jede Antwort.",
    twitterTitle: "DrFurman.ai — KI-gestützte Nutritarian-Beratung, 24/7",
    twitterDescription:
      "Chatte rund um die Uhr mit einem Assistenten, der auf dem gesamten Werk von Dr. Joel Fuhrman trainiert wurde.",
  },

  nav: {
    chat: "Mit der KI chatten",
    corpus: "Was sie weiß",
    examples: "Beispiele",
    comingSoon: "Demnächst",
    language: "Sprache",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "Schon drfuhrman.com-Mitglied?",
    memberLoginCta: "Anmelden",
    headline: "Jedes Buch. Jeder Vortrag. Jede Antwort.",
  },

  corpus: {
    headline: "Aufgebaut auf Dr. Fuhrmans{br}vier Jahrzehnten Forschung.",
    subheading:
      "Die DFO-KI rät nicht — sie antwortet aus dem echten Korpus von Dr. Fuhrman.",
    stats: {
      everyWord: "Alle",
      lecturesUnit: "Video-Vorträge",
      lecturesFlavor:
        "Jeder aufgezeichnete Vortrag von Dr. Fuhrman, indexiert und in einfacher Sprache abfragbar.",
      booksUnit: "Bücher",
      booksFlavor:
        "Dr. Fuhrmans vollständige veröffentlichte Bibliothek, von Eat to Live bis Fast Food Genocide.",
      qasUnit: "Mitglieder-Fragen",
      qasFlavor:
        "Antworten, die Dr. Fuhrman im Laufe der Jahre persönlich seiner Member-Center-Community gegeben hat.",
      productsUnit: "Produkte",
      productsFlavor:
        "Alle Nahrungsergänzungsmittel und Produkte auf DrFuhrman.com, mit vollständigen Zutaten- und Spezifikationsdaten.",
    },
    languagePrefix:
      "Verfügbar in jeder von Gemini 3.5 Flash unterstützten Sprache",
    videoAriaLabel:
      "Ein aufgeschlagenes gebundenes Gesundheitsbuch auf einem warmen Holztisch, umgeben von frischem Brokkoli, Grünkohl, Heidelbeeren, Walnüssen und einem Smartphone mit einer Chat-Oberfläche",
  },

  examples: {
    headline: "Stelle der DFO-KI eine echte Frage.",
    description:
      "Klicke auf eine beliebige Frage, um sie in den Chat oben einzufügen — dein Eingabefeld erhält den Fokus, sodass du {kbd}Enter{/kbd} drücken kannst, um sie zu senden.",
    questions: [
      "Was ist der einfachste Weg, Nutritarian zu essen?",
      "Erzähl mir etwas über Insulinempfindlichkeit.",
      "Was empfiehlt Dr. Fuhrman bei Bluthochdruck?",
      "Wie mache ich eine 5-tägige Nutritarian-Challenge?",
      "Was ist der Unterschied zwischen Kreuzblütlern und grünem Blattgemüse?",
      "Welches von Dr. Fuhrmans Büchern sollte ich zuerst lesen?",
    ],
    ctaHint: "In den Chat einfügen →",
    videoAriaLabel:
      "Eine Person in einer sonnendurchfluteten Küche, die die DFO-KI auf ihrem Smartphone über einer Schale mit Beeren und frischem Grün abruft",
  },

  chat: {
    welcomeMessage:
      "Hallo, ich bin die KI von Dr. Joel Fuhrman. Ich bin hier, um dir zu helfen, die Kontrolle über deine Gesundheit zurückzugewinnen — was beschäftigt dich in letzter Zeit?",
    starters: [
      "Hallo, Dr. Fuhrman AI. Kannst du mir Schritte nennen, die ich unternehmen kann, um einen gesünderen Lebensstil zu beginnen?",
      "Hallo Dr. Fuhrman AI, kannst du mir erklären, worum es bei Nutritarian geht?",
      "Hallo Dr. Fuhrman AI. Kannst du mir etwas über Insulinempfindlichkeit erzählen?",
    ],
    tryAsking: "Frag doch mal",
    emailLabel: "Zuerst: Wie lautet deine E-Mail-Adresse?",
    emailLabelValid: "Deine E-Mail-Adresse",
    emailAriaLabel: "Deine E-Mail-Adresse",
    emailPlaceholderSticky: "Zuerst deine E-Mail-Adresse, um zu chatten…",
    askButton: "Fragen",
    questionPlaceholder: "Gib deine Frage ein…",
    questionAriaLabel: "Frag die Dr. Fuhrman AI",
    questionPlaceholderSticky:
      "Frag die Dr. Fuhrman AI — Ernährung, Krankheitsumkehr, Gewichtsverlust…",
    sendAriaLabel: "Nachricht senden",
    disclaimer: [
      "Überprüfe wichtige Informationen.",
      "Kein Ersatz für medizinischen Rat.",
      "KI kann Fehler machen.",
    ],
    errorEmailRequired:
      "Bitte gib oben deine E-Mail-Adresse ein, um den Chat zu starten.",
    errorEmailInvalid: "Bitte gib eine gültige E-Mail-Adresse ein.",
    errorEmailTooLong: "Die E-Mail-Adresse ist zu lang.",
    errorDisposable:
      "Bitte verwende eine dauerhafte E-Mail-Adresse — Wegwerf-Postfächer werden nicht unterstützt.",
    errorNetwork:
      "Netzwerkfehler — diese Nachricht wurde nicht zugestellt. Bitte versuche es erneut.",
    quotaExhaustedNudge:
      "Du hast deine kostenlose Nachricht verbraucht — sprich weiter mit der KI von Dr. Fuhrman.",
    signupHeadline: "Möchtest du weiter mit der KI von Dr. Fuhrman sprechen?",
    signupBody:
      "Setze das Gespräch fort — und schalte das vollständige Nutritarian-Mitgliedschaftserlebnis frei — auf DrFuhrman.com.",
    signupButton: "Registriere dich auf DrFuhrman.com",
  },

  transcript: {
    heading: "Echte Antworten, direkt aus dem Korpus",
    subheading:
      "Ein echtes Gespräch mit der Dr. Fuhrman AI — jede Antwort gründet auf seinen eigenen Büchern, Vorträgen und Sendungen, mit den exakt angezeigten Quellen. Scrolle, um das Ganze zu lesen.",
    online: "Online",
    assistantLabel: "Assistent",
    recommendationPrefix: "Mir ist aufgefallen, dass dich vielleicht interessiert:",
    composerAria: "Stelle deine eigene Frage im Chat",
    composerPlaceholder: "Stelle der KI von Dr. Fuhrman deine eigene Frage…",
    questions: [
      "Was sind die ersten drei Schritte, um eine Nutritarian-Ernährung zu beginnen?",
      "Was ist eine Nutritarian-Ernährung in einem Satz?",
      "Nenne drei nährstoffreiche grüne Blattgemüse.",
    ],
    answers: [
      [
        "Basierend auf meiner Arbeit in *Eat for Health* sind die ersten drei Schritte zum Übergang zu einer gesunden Nutritarian-Ernährung folgende [[7]]:",
        "**1. Programmiere dein Denken und deinen Geschmack neu, um mikronährstoffreiche Lebensmittel zu bevorzugen.** Du musst deine Denkweise ändern. Statt dich darauf zu konzentrieren, worauf du verzichtest, trainiere dich darauf, die Lebensmittel zu begehren, die am meisten dazu beitragen, deinen Körper zu nähren und zu schützen — grünes Blattgemüse, Bohnen, Zwiebeln, Pilze, Beeren und Samen. Während du diese Lebensmittel isst, verändern sich deine Geschmacksknospen tatsächlich, und was einst fade oder langweilig schien, wird lebendig und befriedigend.",
        "**2. Beseitige suchtartige Hungersymptome, die zu übermäßigem Essen führen, indem du mikronährstoffreiche Lebensmittel zur Grundlage deiner Ernährung machst.** Die meisten Menschen sind in Kreisläufen aus „toxischem Hunger“ gefangen — Zittern, Kopfschmerzen und Heißhunger, ausgelöst durch den Entzug von nährstoffarmen, verarbeiteten Lebensmitteln. Wenn du deine Ernährung um Lebensmittel mit hoher Nährstoffdichte aufbaust, lässt dieser süchtig machende Sog nach. Du erlebst echten Hunger im Hals, nicht unangenehme Entzugssymptome im Magen, und dein Körper wird endlich mit der richtigen Menge an Kalorien zufrieden.",
        "**3. Begrenze ungesunde Lebensmittel in deiner täglichen Ernährung.** Während du deinen Teller mit nährstoffreichen Lebensmitteln füllst, reduzierst du ganz natürlich die verarbeiteten, raffinierten und tierischen Produkte. Es geht nicht um Perfektion an einem einzigen Tag; es geht darum, mikronährstoffreiche pflanzliche Lebensmittel zur Hauptsache zu machen und die ungesunden Optionen an den Rand zu drängen, bis sie keine Macht mehr über dich haben.",
        "Diese drei Schritte wirken zusammen — du kannst sie nicht vollständig voneinander trennen. Je höher die Nährstoffdichte deiner Ernährung wird, desto geringer wird dein Verlangen nach nährstoffarmen Lebensmitteln, und deine Fähigkeit, für echte Gesundheit statt aus Sucht zu essen, wird automatisch [[7]].",
      ],
      [
        "Eine Nutritarian-Ernährung ist ein nährstoffreicher Ernährungsstil, der auf dem Prinzip beruht, dass Gesundheit gleich Nährstoffe geteilt durch Kalorien ist [[4]], wobei du die Mikronährstoffe pro Kalorie maximierst, indem du grünes Gemüse, Bohnen, Zwiebeln, Pilze, Beeren und Samen betonst und gleichzeitig verarbeitete Lebensmittel, Zucker, Weißmehl und raffinierte Öle vermeidest [[1]][[5]].",
      ],
      [
        "Ich würde dich auf **Grünkohl, Blattkohl und Spinat** verweisen. Diese dunklen Blattgemüse stehen ganz oben auf der Nährstoffdichte-Skala — 100 von 100 —, weil sie voller Vitamine, Mineralstoffe und krebsbekämpfender Phytochemikalien stecken, die vor Krankheiten schützen [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Demnächst",
    headline: "Nimm die DFO-KI überallhin mit.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Native mobile App mit Lebensmittel-Fotoerkennung",
        body: "Mach ein Foto von deinem Essen im Supermarkt, in der Küche oder im Restaurant. Die DFO-KI sagt dir sofort, ob es zu einem Nutritarian-Lebensstil passt — und was du austauschen kannst, wenn nicht.",
        imageAlt:
          "Eine Person, die auf einem Bauernmarkt ein Smartphone hochhält, die Kamera über frischem Grünkohl und Tomaten mit einem grünen Analyse-Ring",
      },
      {
        badge: "Offline · Gemma 4",
        title: "Die DFO-KI, die vollständig auf deinem Gerät läuft",
        body: "Eine komprimierte Version der DFO-KI, angetrieben von Googles offenem Modell Gemma 4. Funktioniert in Flugzeugen, in abgelegenen Küchen, hinten im Nahrungsergänzungsmittel-Regal — keine Verbindung erforderlich.",
        imageAlt:
          "Ein Reisender auf einem Fensterplatz im Flugzeug, der die DFO-KI auf seinem Smartphone nutzt, sanfte goldene Abendwolken durch das Fenster sichtbar",
      },
    ],
  },

  bios: {
    headline: "Die Köpfe hinter der KI.",
    subheading:
      "Die Stimme der DFO-KI gründet auf jahrzehntelanger klinischer Praxis und Lehre von Dr. Joel und Dr. Cara Fuhrman.",
    roles: [
      "Zertifizierter Facharzt für Familienmedizin, Autor, Ernährungsforscher",
      "Fachärztin für Familienmedizin, Verfechterin pflanzenbasierter Ernährung",
    ],
    bodies: [
      "Dr. Fuhrman ist ein Nr.-1-Bestsellerautor der New York Times und zertifizierter Facharzt für Familienmedizin mit Spezialisierung auf Ernährungsmedizin. Er prägte den Begriff Nutritarian, um eine Ernährung zu beschreiben, die nach ernährungsphysiologischer Exzellenz strebt, und hat vier Jahrzehnte klinischer Praxis und Forschung darauf verwendet, zu dokumentieren, wie eine mikronährstoffreiche Ernährung chronische Krankheiten vorbeugen und umkehren kann.",
      "Dr. Cara Fuhrman ist Fachärztin für Familienmedizin mit einer Leidenschaft für pflanzenbasierte Ernährung und dafür, Familien beim Aufbau lebenslanger gesunder Gewohnheiten zu helfen. Sie arbeitet mit Dr. Joel Fuhrman an Bildungsprogrammen, die den Nutritarian-Ansatz einem breiteren Publikum näherbringen. Gemeinsam mit ihrem Vater gründete sie LongevityRx, eine moderne Klinik für Longevity-Medizin in San Diego.",
    ],
    footerPrefix: "Vollständige Biografien, Bücher und Forschung finden Sie unter",
  },

  cta: {
    headline: "Bereit, der KI von Dr. Fuhrman eine Frage zu stellen?",
    description:
      "Kostenlos zum Ausprobieren. Kein Konto nötig, um zu starten. Der Chat befindet sich direkt oben auf dieser Seite.",
    buttonText: "Probiere die DFO-KI jetzt aus",
  },

  footer: {
    poweredBy: "Bereitgestellt von",
    aiSafety: "KI-Sicherheit & Ethik",
    terms: "Bedingungen",
    privacy: "Datenschutz",
  },
};
