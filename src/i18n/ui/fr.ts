import type { UIStrings } from "./en";

/**
 * French (fr). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const fr: UIStrings = {
  meta: {
    title: "DrFurman.ai — Conseils Nutritarian propulsés par l'IA, 24/7",
    description:
      "Discutez avec l'IA de Dr. Fuhrman, entraînée sur l'intégralité de son corpus : 12 livres, toutes ses conférences vidéo, plus de 20 000 questions-réponses de membres et les 180 produits. Disponible 24/7 dans toutes les langues que parle Gemini 3.5 Flash.",
    ogTitle: "DrFurman.ai — Conseils Nutritarian propulsés par l'IA, 24/7",
    ogDescription:
      "Discutez 24/7 avec un assistant entraîné sur l'œuvre complète de Dr. Joel Fuhrman.",
    ogImageAlt:
      "Dr. Fuhrman AI — chaque livre, chaque conférence, chaque réponse.",
    twitterTitle: "DrFurman.ai — Conseils Nutritarian propulsés par l'IA, 24/7",
    twitterDescription:
      "Discutez 24/7 avec un assistant entraîné sur l'œuvre complète de Dr. Joel Fuhrman.",
  },

  nav: {
    chat: "Discuter avec l'IA",
    corpus: "Ce qu'elle sait",
    examples: "Exemples",
    comingSoon: "Bientôt disponible",
    language: "Langue",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "Déjà membre de drfuhrman.com ?",
    memberLoginCta: "Connectez-vous",
    headline: "Chaque livre. Chaque conférence. Chaque réponse.",
  },

  corpus: {
    headline: "Fondé sur les{br}quatre décennies de recherche de Dr. Fuhrman.",
    subheading:
      "L'IA de DFO ne devine pas : elle répond à partir du corpus réel de Dr. Fuhrman.",
    stats: {
      everyWord: "Toutes",
      lecturesUnit: "conférences vidéo",
      lecturesFlavor:
        "Toutes les conférences enregistrées de Dr. Fuhrman, indexées et consultables en langage simple.",
      booksUnit: "livres",
      booksFlavor:
        "La bibliothèque publiée complète de Dr. Fuhrman, de Eat to Live à Fast Food Genocide.",
      qasUnit: "questions de membres",
      qasFlavor:
        "Des réponses que Dr. Fuhrman a personnellement données à sa communauté du Member Center au fil des ans.",
      productsUnit: "produits",
      productsFlavor:
        "Tous les compléments et produits de DrFuhrman.com, avec données complètes d'ingrédients et de spécifications.",
    },
    languagePrefix:
      "Disponible dans toutes les langues prises en charge par Gemini 3.5 Flash",
    videoAriaLabel:
      "Un livre de santé relié ouvert sur une table en bois chaleureuse, entouré de brocolis frais, de chou kale, de myrtilles, de noix et d'un smartphone affichant une interface de chat",
  },

  examples: {
    headline: "Posez une vraie question à l'IA de DFO.",
    description:
      "Cliquez sur une question pour l'insérer dans le chat ci-dessus : votre champ de saisie reçoit le focus pour que vous puissiez appuyer sur {kbd}Enter{/kbd} pour l'envoyer.",
    questions: [
      "Quelle est la façon la plus simple de commencer à manger Nutritarian ?",
      "Parle-moi de la sensibilité à l'insuline.",
      "Que recommande Dr. Fuhrman pour l'hypertension artérielle ?",
      "Comment faire un défi Nutritarian de 5 jours ?",
      "Quelle est la différence entre les légumes crucifères et les légumes à feuilles vertes ?",
      "Lequel des livres de Dr. Fuhrman devrais-je lire en premier ?",
    ],
    ctaHint: "Insérer dans le chat →",
    videoAriaLabel:
      "Une personne dans une cuisine ensoleillée consultant l'IA de DFO sur son smartphone au-dessus d'un bol de baies et de légumes verts frais",
  },

  chat: {
    welcomeMessage:
      "Bonjour, je suis l'IA de Dr. Joel Fuhrman. Je suis là pour vous aider à reprendre le contrôle de votre santé — qu'est-ce qui vous préoccupe ces derniers temps ?",
    starters: [
      "Bonjour, Dr. Fuhrman AI. Pouvez-vous m'indiquer les étapes à suivre pour adopter un mode de vie plus sain ?",
      "Bonjour Dr. Fuhrman AI, pouvez-vous m'expliquer en quoi consiste l'approche Nutritarian ?",
      "Bonjour Dr. Fuhrman AI. Pouvez-vous me parler de la sensibilité à l'insuline ?",
    ],
    tryAsking: "Essayez de demander",
    emailLabel: "D'abord, quelle est votre adresse e-mail ?",
    emailLabelValid: "Votre adresse e-mail",
    emailAriaLabel: "Votre adresse e-mail",
    emailPlaceholderSticky: "D'abord, votre e-mail pour commencer à discuter…",
    askButton: "Demander",
    questionPlaceholder: "Saisissez votre question…",
    questionAriaLabel: "Posez une question à la Dr. Fuhrman AI",
    questionPlaceholderSticky:
      "Posez une question à la Dr. Fuhrman AI — alimentation, inversion des maladies, perte de poids…",
    sendAriaLabel: "Envoyer le message",
    disclaimer: [
      "Vérifiez les informations importantes.",
      "Ne remplace pas un avis médical.",
      "L'IA peut faire des erreurs.",
    ],
    errorEmailRequired:
      "Veuillez saisir votre adresse e-mail ci-dessus pour commencer le chat.",
    errorEmailInvalid: "Veuillez saisir une adresse e-mail valide.",
    errorEmailTooLong: "L'adresse e-mail est trop longue.",
    errorDisposable:
      "Veuillez utiliser une adresse e-mail permanente — les boîtes jetables ne sont pas prises en charge.",
    errorNetwork:
      "Erreur réseau — ce message n'a pas été délivré. Veuillez réessayer.",
    quotaExhaustedNudge:
      "Vous avez utilisé votre message gratuit — continuez à parler avec l'IA de Dr. Fuhrman.",
    signupHeadline: "Vous voulez continuer à parler avec l'IA de Dr. Fuhrman ?",
    signupBody:
      "Poursuivez la conversation — et débloquez toute l'expérience d'adhésion Nutritarian — sur DrFuhrman.com.",
    signupButton: "Inscrivez-vous sur DrFuhrman.com",
  },

  transcript: {
    heading: "De vraies réponses, directement issues du corpus",
    subheading:
      "Une vraie conversation avec l'IA de Dr. Fuhrman — chaque réponse fondée sur ses propres livres, conférences et émissions, avec les sources exactes affichées. Faites défiler pour tout lire.",
    online: "En ligne",
    assistantLabel: "Assistant",
    recommendationPrefix: "J'ai remarqué que cela pourrait vous intéresser",
    composerAria: "Posez votre propre question dans le chat",
    composerPlaceholder: "Posez à l'IA de Dr. Fuhrman votre propre question…",
    questions: [
      "Quelles sont les trois premières étapes pour commencer un régime Nutritarian ?",
      "En une phrase, qu'est-ce qu'un régime Nutritarian ?",
      "Citez trois légumes à feuilles vertes riches en nutriments.",
    ],
    answers: [
      [
        "D'après mon travail dans *Eat for Health*, les trois premières étapes pour passer à un régime Nutritarian sain sont [[7]] :",
        "**1. Reprogrammez votre pensée et vos goûts pour préférer les aliments riches en micronutriments.** Vous devez changer d'état d'esprit. Au lieu de vous concentrer sur ce que vous abandonnez, entraînez-vous à désirer les aliments qui font le plus pour nourrir et protéger votre corps : légumes à feuilles vertes, légumineuses, oignons, champignons, baies et graines. À mesure que vous consommez ces aliments, vos papilles changent réellement, et ce qui semblait autrefois fade ou ennuyeux devient vibrant et satisfaisant.",
        "**2. Éliminez les symptômes de faim addictive qui mènent à la suralimentation en faisant des aliments riches en micronutriments la base de votre alimentation.** La plupart des gens sont piégés dans des cycles de « faim toxique » : tremblements, maux de tête et fringales causés par le sevrage des aliments transformés et pauvres en nutriments. Lorsque vous bâtissez votre alimentation autour d'aliments à haute densité nutritionnelle, cette attirance addictive diminue. Vous ressentez la vraie faim dans la gorge, et non d'inconfortables symptômes de détox dans l'estomac, et votre corps est enfin rassasié avec la bonne quantité de calories.",
        "**3. Limitez les aliments malsains dans votre alimentation quotidienne.** À mesure que vous remplissez votre assiette d'aliments riches en nutriments, vous réduisez naturellement les produits transformés, raffinés et d'origine animale. Il ne s'agit pas d'être parfait en une journée ; il s'agit de faire des aliments végétaux riches en micronutriments la pièce maîtresse et de laisser les options malsaines passer en périphérie jusqu'à ce qu'elles n'aient plus d'emprise sur vous.",
        "Ces trois étapes fonctionnent ensemble — vous ne pouvez pas les séparer complètement. À mesure que la densité nutritionnelle de votre alimentation augmente, votre désir pour les aliments pauvres en nutriments diminue, et votre capacité à manger pour une santé véritable plutôt que par addiction devient automatique [[7]].",
      ],
      [
        "Un régime Nutritarian est un mode d'alimentation riche en nutriments fondé sur le principe que la Santé est égale aux Nutriments divisés par les Calories [[4]], où vous maximisez les micronutriments par calorie en privilégiant les légumes verts, les légumineuses, les oignons, les champignons, les baies et les graines, tout en évitant les aliments transformés, le sucre, la farine blanche et les huiles raffinées [[1]][[5]].",
      ],
      [
        "Je vous orienterais vers le **chou kale, le chou cavalier et les épinards**. Ces légumes à feuilles vert foncé se classent tout en haut de l'échelle de densité nutritionnelle — 100 sur 100 — car ils regorgent de vitamines, de minéraux et de phytonutriments anticancéreux qui protègent contre les maladies [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Bientôt disponible",
    headline: "Emportez l'IA de DFO partout avec vous.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Application mobile native avec reconnaissance de photos d'aliments",
        body: "Prenez une photo de votre repas au supermarché, dans la cuisine ou au restaurant. L'IA de DFO vous dit instantanément s'il correspond à un mode de vie Nutritarian, et quoi remplacer si ce n'est pas le cas.",
        imageAlt:
          "Une personne tenant un smartphone sur un marché de producteurs, l'appareil photo cadrant du chou kale et des tomates frais avec un anneau d'analyse vert",
      },
      {
        badge: "Hors ligne · Gemma 4",
        title: "L'IA de DFO, fonctionnant entièrement sur votre appareil",
        body: "Une version compressée de l'IA de DFO, propulsée par le modèle ouvert Gemma 4 de Google. Fonctionne dans les avions, dans les cuisines isolées, au fond du rayon des compléments, sans connexion requise.",
        imageAlt:
          "Un voyageur sur un siège côté hublot dans un avion utilisant l'IA de DFO sur son smartphone, de doux nuages dorés du couchant visibles par le hublot",
      },
    ],
  },

  bios: {
    headline: "Les esprits derrière l'IA.",
    subheading:
      "La voix de l'IA de DFO repose sur des décennies de pratique clinique et d'enseignement de Dr. Joel et Dr. Cara Fuhrman.",
    roles: [
      "Médecin de famille certifié, auteur, chercheur en nutrition",
      "Médecin de famille, défenseure de la nutrition à base de plantes",
    ],
    bodies: [
      "Dr. Fuhrman est un auteur best-seller n° 1 du New York Times et un médecin de famille certifié spécialisé en médecine nutritionnelle. Il a inventé le terme Nutritarian pour décrire un régime qui vise l'excellence nutritionnelle, et a consacré quatre décennies de pratique clinique et de recherche à documenter comment un régime riche en micronutriments peut prévenir et inverser les maladies chroniques.",
      "Dr. Cara Fuhrman est médecin de famille passionnée par la nutrition à base de plantes et par l'aide aux familles pour bâtir des habitudes saines pour la vie. Elle collabore avec Dr. Joel Fuhrman sur des programmes éducatifs qui font découvrir l'approche Nutritarian à un public plus large. Avec son père, elle a cofondé LongevityRx, une clinique de pointe en médecine de la longévité à San Diego.",
    ],
    footerPrefix: "Pour les biographies complètes, les livres et la recherche, visitez",
  },

  cta: {
    headline: "Prêt à poser une question à l'IA de Dr. Fuhrman ?",
    description:
      "Gratuit à l'essai. Aucun compte nécessaire pour commencer. Le chat se trouve juste en haut de cette page.",
    buttonText: "Essayez l'IA de DFO maintenant",
  },

  footer: {
    poweredBy: "Propulsé par",
    aiSafety: "Sécurité et éthique de l'IA",
    terms: "Conditions",
    privacy: "Confidentialité",
  },
};
