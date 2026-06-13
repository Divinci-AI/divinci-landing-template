import type { UIStrings } from "./en";

/**
 * Portuguese (pt, European/neutral). Brand names, product names, and
 * numbers are kept verbatim per the en source's translation rules.
 */
export const pt: UIStrings = {
  meta: {
    title: "DrFurman.ai — Orientação Nutritarian com IA, 24/7",
    description:
      "Converse com a IA de Dr. Fuhrman, treinada em todo o seu corpus: 12 livros, todas as suas palestras em vídeo, mais de 20.000 perguntas e respostas de membros e os 180 produtos. Disponível 24/7 em todos os idiomas que o Gemini 3.5 Flash fala.",
    ogTitle: "DrFurman.ai — Orientação Nutritarian com IA, 24/7",
    ogDescription:
      "Converse 24/7 com um assistente treinado na obra completa de Dr. Joel Fuhrman.",
    ogImageAlt:
      "Dr. Fuhrman AI — cada livro, cada palestra, cada resposta.",
    twitterTitle: "DrFurman.ai — Orientação Nutritarian com IA, 24/7",
    twitterDescription:
      "Converse 24/7 com um assistente treinado na obra completa de Dr. Joel Fuhrman.",
  },

  nav: {
    chat: "Conversar com a IA",
    corpus: "O que ela sabe",
    examples: "Exemplos",
    comingSoon: "Em breve",
    language: "Idioma",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "Já é membro do drfuhrman.com?",
    memberLoginCta: "Entrar",
    headline: "Cada livro. Cada palestra. Cada resposta.",
  },

  corpus: {
    headline: "Construído nas{br}quatro décadas de investigação de Dr. Fuhrman.",
    subheading:
      "A IA da DFO não adivinha: responde a partir do corpus real de Dr. Fuhrman.",
    stats: {
      everyWord: "Todas",
      lecturesUnit: "palestras em vídeo",
      lecturesFlavor:
        "Todas as palestras gravadas de Dr. Fuhrman, indexadas e consultáveis em linguagem simples.",
      booksUnit: "livros",
      booksFlavor:
        "A biblioteca publicada completa de Dr. Fuhrman, de Eat to Live a Fast Food Genocide.",
      qasUnit: "perguntas de membros",
      qasFlavor:
        "Respostas que Dr. Fuhrman deu pessoalmente à sua comunidade do Member Center ao longo dos anos.",
      productsUnit: "produtos",
      productsFlavor:
        "Todos os suplementos e produtos de DrFuhrman.com, com dados completos de ingredientes e especificações.",
    },
    languagePrefix:
      "Disponível em todos os idiomas suportados pelo Gemini 3.5 Flash",
    videoAriaLabel:
      "Um livro de saúde de capa dura aberto sobre uma mesa de madeira acolhedora, rodeado de brócolos frescos, couve, mirtilos, nozes e um smartphone a mostrar uma interface de chat",
  },

  examples: {
    headline: "Experimente fazer à IA da DFO uma pergunta real.",
    description:
      "Clique em qualquer pergunta para a inserir no chat acima: o seu campo de texto recebe o foco para que possa premir {kbd}Enter{/kbd} e enviá-la.",
    questions: [
      "Qual é a forma mais simples de começar a comer Nutritarian?",
      "Fale-me sobre a sensibilidade à insulina.",
      "O que recomenda Dr. Fuhrman para a tensão arterial alta?",
      "Como faço um desafio Nutritarian de 5 dias?",
      "Qual é a diferença entre os vegetais crucíferos e os de folha verde?",
      "Qual dos livros de Dr. Fuhrman devo ler primeiro?",
    ],
    ctaHint: "Inserir no chat →",
    videoAriaLabel:
      "Uma pessoa numa cozinha iluminada pelo sol a consultar a IA da DFO no seu smartphone sobre uma taça de bagas e vegetais verdes frescos",
  },

  chat: {
    welcomeMessage:
      "Olá, sou a IA de Dr. Joel Fuhrman. Estou aqui para o ajudar a retomar o controlo da sua saúde — o que o tem preocupado ultimamente?",
    starters: [
      "Olá, Dr. Fuhrman AI. Pode dizer-me que passos posso dar para começar um estilo de vida mais saudável?",
      "Olá Dr. Fuhrman AI, pode explicar-me em que consiste ser Nutritarian?",
      "Olá Dr. Fuhrman AI. Pode falar-me sobre a sensibilidade à insulina?",
    ],
    tryAsking: "Experimente perguntar",
    emailLabel: "Primeiro, qual é o seu e-mail?",
    emailLabelValid: "O seu e-mail",
    emailAriaLabel: "O seu e-mail",
    emailPlaceholderSticky: "Primeiro, o seu e-mail para começar a conversar…",
    askButton: "Perguntar",
    questionPlaceholder: "Escreva a sua pergunta…",
    questionAriaLabel: "Faça uma pergunta à Dr. Fuhrman AI",
    questionPlaceholderSticky:
      "Faça uma pergunta à Dr. Fuhrman AI — alimentação, reversão de doenças, perda de peso…",
    sendAriaLabel: "Enviar mensagem",
    disclaimer: [
      "Verifique as informações importantes.",
      "Não substitui aconselhamento médico.",
      "A IA pode cometer erros.",
    ],
    errorEmailRequired:
      "Introduza o seu e-mail acima para começar o chat.",
    errorEmailInvalid: "Introduza um endereço de e-mail válido.",
    errorEmailTooLong: "O e-mail é demasiado longo.",
    errorDisposable:
      "Use um endereço de e-mail permanente — as caixas descartáveis não são suportadas.",
    errorNetwork:
      "Erro de rede — essa mensagem não foi entregue. Tente novamente.",
    quotaExhaustedNudge:
      "Já usou a sua mensagem gratuita — continue a falar com a IA de Dr. Fuhrman.",
    signupHeadline: "Quer continuar a falar com a IA de Dr. Fuhrman?",
    signupBody:
      "Continue a conversa — e desbloqueie toda a experiência de adesão Nutritarian — em DrFuhrman.com.",
    signupButton: "Inscreva-se em DrFuhrman.com",
  },

  transcript: {
    heading: "Respostas reais, diretamente do corpus",
    subheading:
      "Uma conversa real com a IA de Dr. Fuhrman — cada resposta fundamentada nos seus próprios livros, palestras e programas, com as fontes exatas à vista. Desça para ler tudo.",
    online: "Online",
    assistantLabel: "Assistente",
    recommendationPrefix: "Reparei que talvez tenha interesse em",
    composerAria: "Faça a sua própria pergunta no chat",
    composerPlaceholder: "Faça à IA de Dr. Fuhrman a sua própria pergunta…",
    questions: [
      "Quais são os três primeiros passos para começar uma dieta Nutritarian?",
      "Numa frase, o que é uma dieta Nutritarian?",
      "Indique três vegetais de folha verde ricos em nutrientes.",
    ],
    answers: [
      [
        "Com base no meu trabalho em *Eat for Health*, os três primeiros passos para fazer a transição para uma dieta Nutritarian saudável são [[7]]:",
        "**1. Reprograme o seu pensamento e o seu paladar para preferir alimentos ricos em micronutrientes.** Tem de mudar a sua mentalidade. Em vez de se concentrar no que está a deixar para trás, treine-se para desejar os alimentos que mais fazem para nutrir e proteger o seu corpo: vegetais de folha verde, leguminosas, cebolas, cogumelos, bagas e sementes. À medida que consome estes alimentos, as suas papilas gustativas mudam de facto, e o que antes parecia sem graça ou aborrecido torna-se vibrante e saciante.",
        "**2. Elimine os sintomas de fome viciante que levam a comer em excesso, fazendo dos alimentos ricos em micronutrientes a base da sua dieta.** A maioria das pessoas está presa em ciclos de «fome tóxica»: tremores, dores de cabeça e desejos provocados pela abstinência de alimentos processados e pobres em nutrientes. Quando constrói a sua dieta em torno de alimentos com alta densidade de nutrientes, esse impulso viciante diminui. Sente a fome verdadeira na garganta, e não sintomas desconfortáveis de desintoxicação no estômago, e o seu corpo finalmente sacia-se com a quantidade certa de calorias.",
        "**3. Limite os alimentos pouco saudáveis na sua dieta diária.** À medida que enche o prato de alimentos ricos em nutrientes, reduz naturalmente os produtos processados, refinados e de origem animal. Não se trata de perfeição num único dia; trata-se de fazer dos alimentos vegetais ricos em micronutrientes o protagonista e de deixar que as opções pouco saudáveis fiquem na periferia até deixarem de ter domínio sobre si.",
        "Estes três passos funcionam em conjunto — não os pode separar por completo. À medida que a densidade de nutrientes da sua dieta sobe, o seu desejo por alimentos pobres em nutrientes desce, e a sua capacidade de comer por saúde genuína em vez de por vício torna-se automática [[7]].",
      ],
      [
        "Uma dieta Nutritarian é um estilo de alimentação rico em nutrientes, assente no princípio de que a Saúde é igual aos Nutrientes a dividir pelas Calorias [[4]], em que maximiza os micronutrientes por caloria dando prioridade a vegetais verdes, leguminosas, cebolas, cogumelos, bagas e sementes, evitando alimentos processados, açúcar, farinha branca e óleos refinados [[1]][[5]].",
      ],
      [
        "Apontaria para a **couve kale, a couve galega e os espinafres**. Estes vegetais de folha verde-escura situam-se no topo da escala de densidade de nutrientes — 100 em 100 — porque estão repletos de vitaminas, minerais e fitoquímicos anticancerígenos que protegem contra a doença [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Em breve",
    headline: "Leve a IA da DFO consigo, para todo o lado.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Aplicação móvel nativa com reconhecimento de fotos de comida",
        body: "Tire uma foto da sua comida no supermercado, na cozinha ou num restaurante. A IA da DFO diz-lhe instantaneamente se se enquadra num estilo de vida Nutritarian, e o que substituir se não se enquadrar.",
        imageAlt:
          "Uma pessoa a segurar um smartphone num mercado de produtores, com a câmara enquadrada sobre couve e tomates frescos com um anel de análise verde",
      },
      {
        badge: "Offline · Gemma 4",
        title: "A IA da DFO, a funcionar inteiramente no seu dispositivo",
        body: "Uma versão comprimida da IA da DFO, impulsionada pelo modelo aberto Gemma 4 da Google. Funciona em aviões, em cozinhas remotas, ao fundo do corredor dos suplementos, sem necessidade de ligação.",
        imageAlt:
          "Um viajante num lugar à janela de um avião a usar a IA da DFO no seu smartphone, com suaves nuvens douradas do entardecer visíveis pela janela",
      },
    ],
  },

  bios: {
    headline: "As mentes por trás da IA.",
    subheading:
      "A voz da IA da DFO baseia-se em décadas de prática clínica e ensino de Dr. Joel e Dr. Cara Fuhrman.",
    roles: [
      "Médico de família certificado, autor, investigador em nutrição",
      "Médica de família, defensora da nutrição à base de plantas",
    ],
    bodies: [
      "Dr. Fuhrman é autor best-seller n.º 1 do New York Times e médico de família certificado especializado em medicina nutricional. Cunhou o termo Nutritarian para descrever uma dieta que procura a excelência nutricional, e dedicou quatro décadas de prática clínica e investigação a documentar como uma dieta rica em micronutrientes pode prevenir e reverter doenças crónicas.",
      "Dr. Cara Fuhrman é médica de família apaixonada pela nutrição à base de plantas e por ajudar as famílias a criar hábitos saudáveis para toda a vida. Colabora com Dr. Joel Fuhrman em programas educativos que aproximam a abordagem Nutritarian de um público mais amplo. Com o seu pai, cofundou a LongevityRx, uma clínica avançada de medicina da longevidade em San Diego.",
    ],
    footerPrefix: "Para biografias completas, livros e investigação, visite",
  },

  cta: {
    headline: "Pronto para fazer uma pergunta à IA de Dr. Fuhrman?",
    description:
      "Grátis para experimentar. Não é necessária conta para começar. O chat está mesmo no topo desta página.",
    buttonText: "Experimente já a IA da DFO",
  },

  footer: {
    poweredBy: "Desenvolvido por",
    aiSafety: "Segurança e Ética da IA",
    terms: "Termos",
    privacy: "Privacidade",
  },
};
