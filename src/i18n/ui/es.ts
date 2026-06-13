import type { UIStrings } from "./en";

/**
 * Spanish (es). Brand names, product names, and numbers are kept
 * verbatim per the en source's translation rules.
 */
export const es: UIStrings = {
  meta: {
    title: "DrFurman.ai — Orientación Nutritarian con IA, 24/7",
    description:
      "Chatea con la IA de Dr. Fuhrman, entrenada con todo su corpus: 12 libros, todas sus conferencias en vídeo, más de 20.000 preguntas de miembros y los 180 productos. Disponible 24/7 en todos los idiomas que habla Gemini 3.5 Flash.",
    ogTitle: "DrFurman.ai — Orientación Nutritarian con IA, 24/7",
    ogDescription:
      "Chatea 24/7 con un asistente entrenado con la obra completa de Dr. Joel Fuhrman.",
    ogImageAlt:
      "Dr. Fuhrman AI: cada libro, cada conferencia, cada respuesta.",
    twitterTitle: "DrFurman.ai — Orientación Nutritarian con IA, 24/7",
    twitterDescription:
      "Chatea 24/7 con un asistente entrenado con la obra completa de Dr. Joel Fuhrman.",
  },

  nav: {
    chat: "Chatear con la IA",
    corpus: "Lo que sabe",
    examples: "Ejemplos",
    comingSoon: "Próximamente",
    language: "Idioma",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "¿Ya eres miembro de drfuhrman.com?",
    memberLoginCta: "Inicia sesión",
    headline: "Cada libro. Cada conferencia. Cada respuesta.",
  },

  corpus: {
    headline: "Basado en las{br}cuatro décadas de investigación de Dr. Fuhrman.",
    subheading:
      "La IA de DFO no adivina: responde a partir del corpus real de Dr. Fuhrman.",
    stats: {
      everyWord: "Todas",
      lecturesUnit: "conferencias en vídeo",
      lecturesFlavor:
        "Todas las conferencias grabadas de Dr. Fuhrman, indexadas y consultables en lenguaje sencillo.",
      booksUnit: "libros",
      booksFlavor:
        "La biblioteca publicada completa de Dr. Fuhrman, desde Eat to Live hasta Fast Food Genocide.",
      qasUnit: "preguntas de miembros",
      qasFlavor:
        "Respuestas que Dr. Fuhrman ha dado personalmente a su comunidad del Member Center a lo largo de los años.",
      productsUnit: "productos",
      productsFlavor:
        "Todos los suplementos y productos de DrFuhrman.com, con datos completos de ingredientes y especificaciones.",
    },
    languagePrefix:
      "Disponible en todos los idiomas que admite Gemini 3.5 Flash",
    videoAriaLabel:
      "Un libro de salud de tapa dura abierto sobre una mesa de madera cálida, rodeado de brócoli fresco, col rizada, arándanos, nueces y un teléfono que muestra una interfaz de chat",
  },

  examples: {
    headline: "Hazle a la IA de DFO una pregunta real.",
    description:
      "Haz clic en cualquier pregunta para insertarla en el chat de arriba: tu campo de texto recibe el foco para que puedas pulsar {kbd}Enter{/kbd} y enviarla.",
    questions: [
      "¿Cuál es la forma más sencilla de empezar a comer Nutritarian?",
      "Háblame de la sensibilidad a la insulina.",
      "¿Qué recomienda Dr. Fuhrman para la presión arterial alta?",
      "¿Cómo hago un reto Nutritarian de 5 días?",
      "¿Cuál es la diferencia entre las verduras crucíferas y las de hoja verde?",
      "¿Cuál de los libros de Dr. Fuhrman debería leer primero?",
    ],
    ctaHint: "Insertar en el chat →",
    videoAriaLabel:
      "Una persona en una cocina soleada consultando la IA de DFO en su teléfono sobre un cuenco de bayas y verduras frescas",
  },

  chat: {
    welcomeMessage:
      "Hola, soy la IA de Dr. Joel Fuhrman. Estoy aquí para ayudarte a retomar el control de tu salud — ¿qué te ha estado preocupando últimamente?",
    starters: [
      "Hola, Dr. Fuhrman AI. ¿Puedes decirme qué pasos puedo dar para empezar un estilo de vida más saludable?",
      "Hola Dr. Fuhrman AI, ¿puedes explicarme en qué consiste ser Nutritarian?",
      "Hola Dr. Fuhrman AI. ¿Puedes hablarme de la sensibilidad a la insulina?",
    ],
    tryAsking: "Prueba a preguntar",
    emailLabel: "Primero, ¿cuál es tu correo electrónico?",
    emailLabelValid: "Tu correo electrónico",
    emailAriaLabel: "Tu correo electrónico",
    emailPlaceholderSticky: "Primero, tu correo electrónico para empezar a chatear…",
    askButton: "Preguntar",
    questionPlaceholder: "Escribe tu pregunta…",
    questionAriaLabel: "Pregúntale a la Dr. Fuhrman AI",
    questionPlaceholderSticky:
      "Pregúntale a la Dr. Fuhrman AI — alimentación, reversión de enfermedades, pérdida de peso…",
    sendAriaLabel: "Enviar mensaje",
    disclaimer: [
      "Verifica la información importante.",
      "No sustituye el consejo médico.",
      "La IA puede cometer errores.",
    ],
    errorEmailRequired:
      "Introduce tu correo electrónico arriba para empezar el chat.",
    errorEmailInvalid: "Introduce una dirección de correo electrónico válida.",
    errorEmailTooLong: "El correo electrónico es demasiado largo.",
    errorDisposable:
      "Usa una dirección de correo permanente — los buzones desechables no son compatibles.",
    errorNetwork:
      "Error de red — ese mensaje no se entregó. Inténtalo de nuevo.",
    quotaExhaustedNudge:
      "Has usado tu mensaje gratuito — sigue hablando con la IA de Dr. Fuhrman.",
    signupHeadline: "¿Quieres seguir hablando con la IA de Dr. Fuhrman?",
    signupBody:
      "Continúa la conversación — y desbloquea toda la experiencia de membresía Nutritarian — en DrFuhrman.com.",
    signupButton: "Regístrate en DrFuhrman.com",
  },

  transcript: {
    heading: "Respuestas reales, directamente del corpus",
    subheading:
      "Una conversación real con la IA de Dr. Fuhrman — cada respuesta fundamentada en sus propios libros, conferencias y programas, con las fuentes exactas a la vista. Desplázate para leerla completa.",
    online: "En línea",
    assistantLabel: "Asistente",
    recommendationPrefix: "He notado que quizá te interese",
    composerAria: "Haz tu propia pregunta en el chat",
    composerPlaceholder: "Hazle a la IA de Dr. Fuhrman tu propia pregunta…",
    questions: [
      "¿Cuáles son los tres primeros pasos para empezar una dieta Nutritarian?",
      "En una frase, ¿qué es una dieta Nutritarian?",
      "Nombra tres verduras de hoja verde ricas en nutrientes.",
    ],
    answers: [
      [
        "Según mi trabajo en *Eat for Health*, los tres primeros pasos para hacer la transición a una dieta Nutritarian saludable son [[7]]:",
        "**1. Reprograma tu mente y tu paladar para preferir alimentos ricos en micronutrientes.** Tienes que cambiar tu mentalidad. En lugar de centrarte en lo que dejas atrás, entrénate para desear los alimentos que más nutren y protegen tu cuerpo: verduras de hoja verde, legumbres, cebollas, champiñones, bayas y semillas. A medida que consumes estos alimentos, tus papilas gustativas cambian de verdad, y lo que antes parecía soso o aburrido se vuelve vibrante y satisfactorio.",
        "**2. Elimina los síntomas de hambre adictiva que llevan a comer en exceso haciendo de los alimentos ricos en micronutrientes la base de tu dieta.** La mayoría de las personas están atrapadas en ciclos de «hambre tóxica»: temblores, dolores de cabeza y antojos provocados por la abstinencia de alimentos procesados y pobres en nutrientes. Cuando construyes tu dieta en torno a alimentos con alta densidad de nutrientes, ese tirón adictivo disminuye. Experimentas el hambre verdadera en la garganta, no incómodos síntomas de desintoxicación en el estómago, y tu cuerpo por fin se sacia con la cantidad adecuada de calorías.",
        "**3. Limita los alimentos poco saludables en tu dieta diaria.** A medida que llenas tu plato de alimentos ricos en nutrientes, reduces de forma natural los productos procesados, refinados y de origen animal. No se trata de la perfección en un solo día; se trata de hacer de los alimentos vegetales ricos en micronutrientes el protagonista y dejar que las opciones poco saludables queden en la periferia hasta que dejen de tener dominio sobre ti.",
        "Estos tres pasos funcionan en conjunto: no puedes separarlos del todo. A medida que sube la densidad de nutrientes de tu dieta, baja tu deseo de alimentos pobres en nutrientes, y tu capacidad de comer por salud genuina en lugar de por adicción se vuelve automática [[7]].",
      ],
      [
        "Una dieta Nutritarian es un estilo de alimentación rico en nutrientes basado en el principio de que la Salud es igual a los Nutrientes divididos entre las Calorías [[4]], donde maximizas los micronutrientes por caloría dando prioridad a las verduras verdes, las legumbres, las cebollas, los champiñones, las bayas y las semillas, evitando los alimentos procesados, el azúcar, la harina blanca y los aceites refinados [[1]][[5]].",
      ],
      [
        "Te recomendaría la **col rizada, las berzas y las espinacas**. Estas verduras de hoja verde oscura puntúan en lo más alto de la escala de densidad de nutrientes —100 sobre 100— porque están repletas de vitaminas, minerales y fitoquímicos anticancerígenos que protegen frente a las enfermedades [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Próximamente",
    headline: "Lleva la IA de DFO contigo, a todas partes.",
    cards: [
      {
        badge: "iOS + Android",
        title: "App móvil nativa con reconocimiento de fotos de comida",
        body: "Haz una foto de tu comida en el supermercado, en la cocina o en un restaurante. La IA de DFO te dice al instante si encaja con un estilo de vida Nutritarian, y qué cambiar si no es así.",
        imageAlt:
          "Una persona sosteniendo un teléfono en un mercado de agricultores, con la cámara enfocando col rizada y tomates frescos con un anillo de análisis verde",
      },
      {
        badge: "Sin conexión · Gemma 4",
        title: "La IA de DFO, funcionando por completo en tu dispositivo",
        body: "Una versión comprimida de la IA de DFO, impulsada por el modelo abierto Gemma 4 de Google. Funciona en aviones, en cocinas remotas, al fondo del pasillo de suplementos, sin necesidad de conexión.",
        imageAlt:
          "Un viajero en el asiento de ventanilla de un avión usando la IA de DFO en su teléfono, con suaves nubes doradas al atardecer visibles por la ventana",
      },
    ],
  },

  bios: {
    headline: "Las mentes detrás de la IA.",
    subheading:
      "La voz de la IA de DFO se basa en décadas de práctica clínica y docencia de Dr. Joel y Dr. Cara Fuhrman.",
    roles: [
      "Médico de familia certificado, autor, investigador en nutrición",
      "Médica de familia, defensora de la nutrición basada en plantas",
    ],
    bodies: [
      "Dr. Fuhrman es autor superventas n.º 1 del New York Times y médico de familia certificado especializado en medicina nutricional. Acuñó el término Nutritarian para describir una dieta que busca la excelencia nutricional, y ha dedicado cuatro décadas de práctica clínica e investigación a documentar cómo una dieta rica en micronutrientes puede prevenir y revertir enfermedades crónicas.",
      "Dr. Cara Fuhrman es médica de familia apasionada por la nutrición basada en plantas y por ayudar a las familias a crear hábitos saludables para toda la vida. Colabora con Dr. Joel Fuhrman en programas educativos que acercan el enfoque Nutritarian a un público más amplio. Junto a su padre, cofundó LongevityRx, una clínica avanzada de medicina de la longevidad en San Diego.",
    ],
    footerPrefix: "Para biografías completas, libros e investigación, visita",
  },

  cta: {
    headline: "¿Listo para hacerle una pregunta a la IA de Dr. Fuhrman?",
    description:
      "Gratis para probar. No necesitas cuenta para empezar. El chat está justo arriba en esta página.",
    buttonText: "Prueba la IA de DFO ahora",
  },

  footer: {
    poweredBy: "Desarrollado por",
    aiSafety: "Seguridad y ética de la IA",
    terms: "Términos",
    privacy: "Privacidad",
  },
};
