import type { UIStrings } from "./en";

/**
 * Italian (it). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const it: UIStrings = {
  meta: {
    title: "DrFurman.ai — Guida Nutritarian basata sull'IA, 24/7",
    description:
      "Chatta con l'IA di Dr. Fuhrman, addestrata sull'intero suo corpus: 12 libri, tutte le sue conferenze video, oltre 20.000 domande e risposte dei membri e tutti i 180 prodotti. Disponibile 24/7 in tutte le lingue parlate da Gemini 3.5 Flash.",
    ogTitle: "DrFurman.ai — Guida Nutritarian basata sull'IA, 24/7",
    ogDescription:
      "Chatta 24/7 con un assistente addestrato sull'opera completa di Dr. Joel Fuhrman.",
    ogImageAlt:
      "Dr. Fuhrman AI — ogni libro, ogni conferenza, ogni risposta.",
    twitterTitle: "DrFurman.ai — Guida Nutritarian basata sull'IA, 24/7",
    twitterDescription:
      "Chatta 24/7 con un assistente addestrato sull'opera completa di Dr. Joel Fuhrman.",
  },

  nav: {
    chat: "Chatta con l'IA",
    corpus: "Cosa sa",
    examples: "Esempi",
    comingSoon: "Prossimamente",
    language: "Lingua",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "Già membro di drfuhrman.com?",
    memberLoginCta: "Accedi",
    headline: "Ogni libro. Ogni conferenza. Ogni risposta.",
  },

  corpus: {
    headline: "Costruito sui{br}quattro decenni di ricerca di Dr. Fuhrman.",
    subheading:
      "L'IA di DFO non indovina: risponde a partire dal corpus reale di Dr. Fuhrman.",
    stats: {
      everyWord: "Tutte",
      lecturesUnit: "conferenze video",
      lecturesFlavor:
        "Tutte le conferenze registrate di Dr. Fuhrman, indicizzate e consultabili in linguaggio semplice.",
      booksUnit: "libri",
      booksFlavor:
        "La biblioteca pubblicata completa di Dr. Fuhrman, da Eat to Live a Fast Food Genocide.",
      qasUnit: "domande dei membri",
      qasFlavor:
        "Risposte che Dr. Fuhrman ha dato personalmente alla sua comunità del Member Center nel corso degli anni.",
      productsUnit: "prodotti",
      productsFlavor:
        "Tutti gli integratori e i prodotti su DrFuhrman.com, con dati completi su ingredienti e specifiche.",
    },
    languagePrefix:
      "Disponibile in tutte le lingue supportate da Gemini 3.5 Flash",
    videoAriaLabel:
      "Un libro sulla salute con copertina rigida aperto su un caldo tavolo di legno, circondato da broccoli freschi, cavolo riccio, mirtilli, noci e uno smartphone che mostra un'interfaccia di chat",
  },

  examples: {
    headline: "Prova a fare all'IA di DFO una domanda reale.",
    description:
      "Clicca su una qualsiasi domanda per inserirla nella chat qui sopra: il tuo campo di testo riceve il focus così puoi premere {kbd}Enter{/kbd} per inviarla.",
    questions: [
      "Qual è il modo più semplice per iniziare a mangiare Nutritarian?",
      "Parlami della sensibilità all'insulina.",
      "Cosa raccomanda Dr. Fuhrman per la pressione alta?",
      "Come faccio una sfida Nutritarian di 5 giorni?",
      "Qual è la differenza tra le verdure crucifere e quelle a foglia verde?",
      "Quale dei libri di Dr. Fuhrman dovrei leggere per primo?",
    ],
    ctaHint: "Inserisci nella chat →",
    videoAriaLabel:
      "Una persona in una cucina soleggiata che consulta l'IA di DFO sul proprio smartphone sopra una ciotola di bacche e verdure fresche",
  },

  chat: {
    welcomeMessage:
      "Ciao, sono l'IA di Dr. Joel Fuhrman. Sono qui per aiutarti a riprendere il controllo della tua salute — cosa ti preoccupa ultimamente?",
    starters: [
      "Ciao, Dr. Fuhrman AI. Puoi dirmi quali passi posso compiere per iniziare uno stile di vita più sano?",
      "Ciao Dr. Fuhrman AI, puoi spiegarmi di cosa tratta l'approccio Nutritarian?",
      "Ciao Dr. Fuhrman AI. Puoi parlarmi della sensibilità all'insulina?",
    ],
    tryAsking: "Prova a chiedere",
    emailLabel: "Prima di tutto, qual è la tua email?",
    emailLabelValid: "La tua email",
    emailAriaLabel: "La tua email",
    emailPlaceholderSticky: "Prima di tutto, la tua email per iniziare a chattare…",
    askButton: "Chiedi",
    questionPlaceholder: "Scrivi la tua domanda…",
    questionAriaLabel: "Fai una domanda alla Dr. Fuhrman AI",
    questionPlaceholderSticky:
      "Fai una domanda alla Dr. Fuhrman AI — alimentazione, inversione delle malattie, perdita di peso…",
    sendAriaLabel: "Invia messaggio",
    disclaimer: [
      "Verifica le informazioni importanti.",
      "Non sostituisce il parere medico.",
      "L'IA può commettere errori.",
    ],
    errorEmailRequired:
      "Inserisci la tua email qui sopra per iniziare la chat.",
    errorEmailInvalid: "Inserisci un indirizzo email valido.",
    errorEmailTooLong: "L'email è troppo lunga.",
    errorDisposable:
      "Usa un indirizzo email permanente — le caselle usa e getta non sono supportate.",
    errorNetwork:
      "Errore di rete — quel messaggio non è stato consegnato. Riprova.",
    quotaExhaustedNudge:
      "Hai usato il tuo messaggio gratuito — continua a parlare con l'IA di Dr. Fuhrman.",
    signupHeadline: "Vuoi continuare a parlare con l'IA di Dr. Fuhrman?",
    signupBody:
      "Continua la conversazione — e sblocca l'esperienza completa di abbonamento Nutritarian — su DrFuhrman.com.",
    signupButton: "Registrati su DrFuhrman.com",
  },

  transcript: {
    heading: "Risposte reali, direttamente dal corpus",
    subheading:
      "Una vera conversazione con l'IA di Dr. Fuhrman — ogni risposta fondata sui suoi stessi libri, conferenze e programmi, con le fonti esatte mostrate. Scorri per leggerla tutta.",
    online: "Online",
    assistantLabel: "Assistente",
    recommendationPrefix: "Ho notato che potrebbe interessarti",
    composerAria: "Fai la tua domanda nella chat",
    composerPlaceholder: "Fai all'IA di Dr. Fuhrman la tua domanda…",
    questions: [
      "Quali sono i primi tre passi per iniziare una dieta Nutritarian?",
      "In una frase, che cos'è una dieta Nutritarian?",
      "Cita tre verdure a foglia verde ricche di nutrienti.",
    ],
    answers: [
      [
        "In base al mio lavoro in *Eat for Health*, i primi tre passi per passare a una dieta Nutritarian salutare sono [[7]]:",
        "**1. Riprogramma il tuo modo di pensare e i tuoi gusti per preferire gli alimenti ricchi di micronutrienti.** Devi cambiare mentalità. Invece di concentrarti su ciò a cui rinunci, allenati a desiderare gli alimenti che fanno di più per nutrire e proteggere il tuo corpo: verdure a foglia verde, legumi, cipolle, funghi, frutti di bosco e semi. Man mano che consumi questi alimenti, le tue papille gustative cambiano davvero, e ciò che prima sembrava insipido o noioso diventa vivace e appagante.",
        "**2. Elimina i sintomi della fame da dipendenza che portano a mangiare troppo facendo degli alimenti ricchi di micronutrienti la base della tua dieta.** La maggior parte delle persone è intrappolata in cicli di «fame tossica»: tremori, mal di testa e voglie causate dall'astinenza da alimenti processati e poveri di nutrienti. Quando costruisci la tua dieta attorno ad alimenti ad alta densità di nutrienti, quella spinta da dipendenza diminuisce. Avverti la vera fame in gola, non fastidiosi sintomi di disintossicazione nello stomaco, e il tuo corpo finalmente si sazia con la giusta quantità di calorie.",
        "**3. Limita gli alimenti poco salutari nella tua dieta quotidiana.** Man mano che riempi il piatto di alimenti ricchi di nutrienti, riduci naturalmente i prodotti processati, raffinati e di origine animale. Non si tratta della perfezione in un solo giorno; si tratta di rendere gli alimenti vegetali ricchi di micronutrienti i protagonisti e di lasciare che le opzioni poco salutari finiscano in secondo piano finché non avranno più presa su di te.",
        "Questi tre passi funzionano insieme: non puoi separarli del tutto. Man mano che sale la densità di nutrienti della tua dieta, cala il tuo desiderio di alimenti poveri di nutrienti, e la tua capacità di mangiare per una salute autentica anziché per dipendenza diventa automatica [[7]].",
      ],
      [
        "Una dieta Nutritarian è uno stile alimentare ricco di nutrienti fondato sul principio che la Salute è uguale ai Nutrienti divisi per le Calorie [[4]], in cui massimizzi i micronutrienti per caloria privilegiando verdure verdi, legumi, cipolle, funghi, frutti di bosco e semi, evitando alimenti processati, zucchero, farina bianca e oli raffinati [[1]][[5]].",
      ],
      [
        "Ti indirizzerei verso **cavolo riccio, cavolo nero e spinaci**. Queste verdure a foglia verde scuro si collocano al vertice della scala di densità di nutrienti — 100 su 100 — perché sono ricche di vitamine, minerali e fitochimici antitumorali che proteggono dalle malattie [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Prossimamente",
    headline: "Porta l'IA di DFO con te, ovunque.",
    cards: [
      {
        badge: "iOS + Android",
        title: "App mobile nativa con riconoscimento delle foto del cibo",
        body: "Scatta una foto del tuo cibo al supermercato, in cucina o al ristorante. L'IA di DFO ti dice all'istante se è in linea con uno stile di vita Nutritarian, e cosa sostituire in caso contrario.",
        imageAlt:
          "Una persona che alza uno smartphone in un mercato contadino, con la fotocamera inquadrata su cavolo riccio e pomodori freschi con un anello di analisi verde",
      },
      {
        badge: "Offline · Gemma 4",
        title: "L'IA di DFO, in esecuzione interamente sul tuo dispositivo",
        body: "Una versione compressa dell'IA di DFO, alimentata dal modello aperto Gemma 4 di Google. Funziona in aereo, in cucine remote, in fondo alla corsia degli integratori, senza bisogno di connessione.",
        imageAlt:
          "Un viaggiatore sul posto al finestrino di un aereo che usa l'IA di DFO sul proprio smartphone, con morbide nuvole dorate del tramonto visibili dal finestrino",
      },
    ],
  },

  bios: {
    headline: "Le menti dietro l'IA.",
    subheading:
      "La voce dell'IA di DFO si fonda su decenni di pratica clinica e insegnamento di Dr. Joel e Dr. Cara Fuhrman.",
    roles: [
      "Medico di famiglia certificato, autore, ricercatore nutrizionale",
      "Medico di famiglia, sostenitrice della nutrizione a base vegetale",
    ],
    bodies: [
      "Dr. Fuhrman è un autore best-seller n. 1 del New York Times e un medico di famiglia certificato specializzato in medicina nutrizionale. Ha coniato il termine Nutritarian per descrivere una dieta che punta all'eccellenza nutrizionale e ha dedicato quattro decenni di pratica clinica e ricerca a documentare come una dieta ricca di micronutrienti possa prevenire e invertire le malattie croniche.",
      "Dr. Cara Fuhrman è un medico di famiglia appassionata di nutrizione a base vegetale e di aiutare le famiglie a costruire abitudini sane per tutta la vita. Collabora con Dr. Joel Fuhrman a programmi educativi che avvicinano l'approccio Nutritarian a un pubblico più ampio. Insieme al padre ha cofondato LongevityRx, una clinica all'avanguardia di medicina della longevità a San Diego.",
    ],
    footerPrefix: "Per biografie complete, libri e ricerca, visita",
  },

  cta: {
    headline: "Pronto a fare una domanda all'IA di Dr. Fuhrman?",
    description:
      "Gratis da provare. Nessun account necessario per iniziare. La chat è proprio in cima a questa pagina.",
    buttonText: "Prova subito l'IA di DFO",
  },

  footer: {
    poweredBy: "Realizzato con",
    aiSafety: "Sicurezza ed etica dell'IA",
    terms: "Termini",
    privacy: "Privacy",
  },
};
