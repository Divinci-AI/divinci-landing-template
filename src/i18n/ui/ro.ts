import type { UIStrings } from "./en";

/**
 * Romanian (ro). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const ro: UIStrings = {
  meta: {
    title: "DrFurman.ai — îndrumare Nutritarian cu ajutorul AI, 24/7",
    description:
      "Discută cu AI-ul Dr. Fuhrman, antrenat pe întregul său corpus: 12 cărți, fiecare prelegere video, peste 20.000 de întrebări și răspunsuri ale membrilor și toate cele 180 de produse. Disponibil 24/7 în toate limbile pe care le vorbește Gemini 3.5 Flash.",
    ogTitle: "DrFurman.ai — îndrumare Nutritarian cu ajutorul AI, 24/7",
    ogDescription:
      "Discută 24/7 cu un asistent antrenat pe întreaga operă a Dr. Joel Fuhrman.",
    ogImageAlt:
      "Dr. Fuhrman AI — fiecare carte, fiecare prelegere, fiecare răspuns.",
    twitterTitle: "DrFurman.ai — îndrumare Nutritarian cu ajutorul AI, 24/7",
    twitterDescription:
      "Discută 24/7 cu un asistent antrenat pe întreaga operă a Dr. Joel Fuhrman.",
  },

  nav: {
    chat: "Discută cu AI-ul",
    corpus: "Ce știe",
    examples: "Exemple",
    comingSoon: "În curând",
    language: "Limbă",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "Ești deja membru drfuhrman.com?",
    memberLoginCta: "Autentifică-te",
    headline: "Fiecare carte. Fiecare prelegere. Fiecare răspuns.",
  },

  corpus: {
    headline: "Construit pe{br}cele patru decenii de cercetare ale Dr. Fuhrman.",
    subheading:
      "AI-ul DFO nu ghicește — răspunde din corpusul real al Dr. Fuhrman.",
    stats: {
      everyWord: "Fiecare",
      lecturesUnit: "prelegere video",
      lecturesFlavor:
        "Fiecare prelegere înregistrată a Dr. Fuhrman, indexată și disponibilă pentru răspunsuri într-un limbaj simplu.",
      booksUnit: "cărți",
      booksFlavor:
        "Biblioteca publicată completă a Dr. Fuhrman, de la Eat to Live la Fast Food Genocide.",
      qasUnit: "întrebări ale membrilor",
      qasFlavor:
        "Răspunsuri pe care Dr. Fuhrman le-a oferit personal comunității sale din Member Center de-a lungul anilor.",
      productsUnit: "produse",
      productsFlavor:
        "Fiecare supliment și produs de pe DrFuhrman.com, cu date complete despre ingrediente și specificații.",
    },
    languagePrefix:
      "Disponibil în toate limbile pe care le acceptă Gemini 3.5 Flash",
    videoAriaLabel:
      "O carte de sănătate cu copertă cartonată, deschisă pe o masă de lemn caldă, înconjurată de broccoli proaspăt, varză kale, afine, nuci și un telefon care afișează o interfață de chat",
  },

  examples: {
    headline: "Pune AI-ului DFO o întrebare reală.",
    description:
      "Dă clic pe orice întrebare pentru a o insera în chatul de mai sus — câmpul tău de text primește focus, astfel încât poți apăsa {kbd}Enter{/kbd} pentru a trimite.",
    questions: [
      "Care este cel mai simplu mod de a începe să mănânci Nutritarian?",
      "Spune-mi despre sensibilitatea la insulină.",
      "Ce recomandă Dr. Fuhrman pentru tensiunea arterială mare?",
      "Cum fac o provocare Nutritarian de 5 zile?",
      "Care este diferența dintre legumele crucifere și cele cu frunze verzi?",
      "Care dintre cărțile Dr. Fuhrman ar trebui să o citesc prima?",
    ],
    ctaHint: "Inserează în chat →",
    videoAriaLabel:
      "O persoană într-o bucătărie însorită verificând AI-ul DFO pe telefon, deasupra unui bol cu fructe de pădure și verdețuri proaspete",
  },

  chat: {
    welcomeMessage:
      "Bună, sunt AI-ul Dr. Joel Fuhrman. Sunt aici să te ajut să preiei din nou controlul asupra sănătății tale — ce te-a preocupat în ultima vreme?",
    starters: [
      "Bună, Dr. Fuhrman AI. Îmi poți spune ce pași pot face pentru a începe un stil de viață mai sănătos?",
      "Bună Dr. Fuhrman AI, îmi poți explica în ce constă să fii Nutritarian?",
      "Bună Dr. Fuhrman AI. Îmi poți vorbi despre sensibilitatea la insulină?",
    ],
    tryAsking: "Încearcă să întrebi",
    emailLabel: "Mai întâi, care este adresa ta de e-mail?",
    emailLabelValid: "Adresa ta de e-mail",
    emailAriaLabel: "Adresa ta de e-mail",
    emailPlaceholderSticky: "Mai întâi, e-mailul tău pentru a începe conversația…",
    askButton: "Întreabă",
    questionPlaceholder: "Scrie întrebarea ta…",
    questionAriaLabel: "Întreabă AI-ul Dr. Fuhrman",
    questionPlaceholderSticky:
      "Întreabă AI-ul Dr. Fuhrman — alimentație, inversarea bolilor, pierdere în greutate…",
    sendAriaLabel: "Trimite mesajul",
    disclaimer: [
      "Verifică informațiile importante.",
      "Nu înlocuiește sfatul medical.",
      "AI-ul poate greși.",
    ],
    errorEmailRequired:
      "Introdu adresa ta de e-mail mai sus pentru a începe chatul.",
    errorEmailInvalid: "Introdu o adresă de e-mail validă.",
    errorEmailTooLong: "Adresa de e-mail este prea lungă.",
    errorDisposable:
      "Folosește o adresă de e-mail permanentă — căsuțele temporare nu sunt acceptate.",
    errorNetwork:
      "Eroare de rețea — acel mesaj nu a fost livrat. Te rugăm să încerci din nou.",
    quotaExhaustedNudge:
      "Ți-ai folosit mesajul gratuit — continuă să vorbești cu AI-ul Dr. Fuhrman.",
    signupHeadline: "Vrei să continui să vorbești cu AI-ul Dr. Fuhrman?",
    signupBody:
      "Continuă conversația — și deblochează întreaga experiență de membru Nutritarian — pe DrFuhrman.com.",
    signupButton: "Înscrie-te pe DrFuhrman.com",
  },

  transcript: {
    heading: "Răspunsuri reale, direct din corpus",
    subheading:
      "O conversație reală cu AI-ul Dr. Fuhrman — fiecare răspuns întemeiat pe propriile sale cărți, prelegeri și emisiuni, cu sursele exacte afișate. Derulează pentru a o citi în întregime.",
    online: "Online",
    assistantLabel: "Asistent",
    recommendationPrefix: "Am observat că te-ar putea interesa",
    composerAria: "Pune-ți propria întrebare în chat",
    composerPlaceholder: "Pune AI-ului Dr. Fuhrman propria ta întrebare…",
    questions: [
      "Care sunt primii trei pași pentru a începe o dietă Nutritarian?",
      "Într-o singură propoziție, ce este o dietă Nutritarian?",
      "Numește trei legume cu frunze verzi bogate în nutrienți.",
    ],
    answers: [
      [
        "Pe baza muncii mele din *Eat for Health*, primii trei pași pentru a face tranziția la o dietă Nutritarian sănătoasă sunt [[7]]:",
        "**1. Reprogramează-ți gândirea și gusturile pentru a prefera alimentele bogate în micronutrienți.** Trebuie să îți schimbi mentalitatea. În loc să te concentrezi pe ceea ce renunți, antrenează-te să îți dorești alimentele care fac cel mai mult pentru a-ți hrăni și proteja corpul: legume cu frunze verzi, leguminoase, ceapă, ciuperci, fructe de pădure și semințe. Pe măsură ce consumi aceste alimente, papilele tale gustative se schimbă cu adevărat, iar ceea ce odată părea fad sau plictisitor devine viu și satisfăcător.",
        "**2. Elimină simptomele foamei dependente care duc la mâncatul în exces, făcând din alimentele bogate în micronutrienți baza dietei tale.** Cei mai mulți oameni sunt prinși în cicluri de „foame toxică”: tremurături, dureri de cap și pofte provocate de renunțarea la alimentele procesate și sărace în nutrienți. Când îți construiești dieta în jurul alimentelor cu densitate mare de nutrienți, acea atracție care creează dependență scade. Simți foamea adevărată în gât, nu simptome neplăcute de detoxifiere în stomac, iar corpul tău se satură în sfârșit cu cantitatea potrivită de calorii.",
        "**3. Limitează alimentele nesănătoase din dieta ta zilnică.** Pe măsură ce îți umpli farfuria cu alimente bogate în nutrienți, reduci în mod natural produsele procesate, rafinate și de origine animală. Nu e vorba de perfecțiune într-o singură zi; e vorba de a face din alimentele vegetale bogate în micronutrienți elementul principal și de a lăsa opțiunile nesănătoase să treacă în plan secundar până când nu mai au putere asupra ta.",
        "Acești trei pași funcționează împreună — nu îi poți separa complet. Pe măsură ce densitatea de nutrienți a dietei tale crește, dorința ta pentru alimentele sărace în nutrienți scade, iar capacitatea ta de a mânca pentru o sănătate autentică, mai degrabă decât din dependență, devine automată [[7]].",
      ],
      [
        "O dietă Nutritarian este un stil de alimentație bogat în nutrienți, întemeiat pe principiul că Sănătatea este egală cu Nutrienții împărțiți la Calorii [[4]], în care maximizezi micronutrienții per calorie punând accentul pe legume verzi, leguminoase, ceapă, ciuperci, fructe de pădure și semințe, evitând totodată alimentele procesate, zahărul, făina albă și uleiurile rafinate [[1]][[5]].",
      ],
      [
        "Te-aș îndruma către **varza kale, varza creață și spanac**. Aceste legume cu frunze verde-închis se situează chiar în vârful scării densității de nutrienți — 100 din 100 — pentru că sunt pline de vitamine, minerale și fitochimicale care combat cancerul și protejează împotriva bolilor [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "În curând",
    headline: "Ia AI-ul DFO cu tine — oriunde.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Aplicație mobilă nativă cu recunoaștere a fotografiilor de mâncare",
        body: "Fotografiază-ți mâncarea la magazin, în bucătărie sau la restaurant. AI-ul DFO îți spune instantaneu dacă se potrivește unui stil de viață Nutritarian — și ce să înlocuiești dacă nu.",
        imageAlt:
          "O persoană ținând un telefon la o piață de fermieri, cu camera îndreptată spre varză kale și roșii proaspete, cu un inel verde de analiză",
      },
      {
        badge: "Offline · Gemma 4",
        title: "AI-ul DFO, rulând în întregime pe dispozitivul tău",
        body: "O versiune comprimată a AI-ului DFO, alimentată de modelul deschis Gemma 4 de la Google. Funcționează în avioane, în bucătării izolate, în capătul raionului de suplimente — fără a fi nevoie de conexiune.",
        imageAlt:
          "Un călător pe scaunul de la geam într-un avion folosind AI-ul DFO pe telefon, cu nori aurii și blânzi de apus vizibili prin fereastră",
      },
    ],
  },

  bios: {
    headline: "Mințile din spatele AI-ului.",
    subheading:
      "Vocea AI-ului DFO se bazează pe decenii de practică clinică și predare ale Dr. Joel și Dr. Cara Fuhrman.",
    roles: [
      "Medic de familie atestat, autor, cercetător în nutriție",
      "Medic de familie, susținătoare a nutriției pe bază de plante",
    ],
    bodies: [
      "Dr. Fuhrman este autor de bestselleruri nr. 1 New York Times și medic de familie atestat, specializat în medicină nutrițională. A inventat termenul Nutritarian pentru a descrie o dietă care urmărește excelența nutrițională și a dedicat patru decenii de practică clinică și cercetare documentării modului în care o dietă bogată în micronutrienți poate preveni și inversa bolile cronice.",
      "Dr. Cara Fuhrman este medic de familie pasionat de nutriția pe bază de plante și de a ajuta familiile să își formeze obiceiuri sănătoase pe viață. Colaborează cu Dr. Joel Fuhrman la programe educaționale care aduc abordarea Nutritarian unui public mai larg. Împreună cu tatăl ei, a cofondat LongevityRx, o clinică avansată de medicină a longevității din San Diego.",
    ],
    footerPrefix:
      "Pentru biografii complete, cărți și cercetări, vizitează",
  },

  cta: {
    headline: "Gata să pui o întrebare AI-ului Dr. Fuhrman?",
    description:
      "Gratuit de încercat. Nu este nevoie de cont pentru a începe. Chatul este chiar în partea de sus a acestei pagini.",
    buttonText: "Încearcă AI-ul DFO acum",
  },

  footer: {
    poweredBy: "Susținut de",
    aiSafety: "Siguranța și etica AI",
    terms: "Termeni",
    privacy: "Confidențialitate",
  },
};
