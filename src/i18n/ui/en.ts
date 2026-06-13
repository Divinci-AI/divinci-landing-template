/**
 * English source-of-truth UI dictionary for the DrFurman.ai landing
 * page. Every other locale file (src/i18n/ui/<code>.ts) is typed as
 * `UIStrings` (derived from this object) so TypeScript enforces that
 * every locale has exactly the same keys.
 *
 * What's NOT here (stays in component code, never translated):
 *   - Brand names: Dr. Fuhrman, Dr. Joel/Cara Fuhrman, Nutritarian,
 *     DrFurman.ai, Divinci, Gemini 3.5 Flash, Gemma 4, DFO
 *   - Domains / URLs: drfuhrman.com, drfuhrman.ai
 *   - Numbers + emoji + the 4 stat values' digits (12, 20,000+, 180)
 *   - Book / publication titles (Eat to Live, New York Times, …)
 *   - The supported-language list (shown as autonyms — see locales.ts)
 *
 * Inline markup ({br}, {kbd}…{/kbd}) is represented as placeholder
 * tokens the components re-inflate, so translators never touch HTML.
 */

export const en = {
  meta: {
    title: "DrFurman.ai — AI-powered Nutritarian guidance, 24/7",
    description:
      "Chat with Dr. Fuhrman's AI, trained on his entire corpus — 12 books, every video lecture, 20,000+ member Q&As, and all 180 products. Available 24/7 in every language Gemini 3.5 Flash speaks.",
    ogTitle: "DrFurman.ai — AI-powered Nutritarian guidance, 24/7",
    ogDescription:
      "Chat 24/7 with an assistant trained on Dr. Joel Fuhrman's complete body of work.",
    ogImageAlt: "Dr. Fuhrman AI — every book, every lecture, every answer.",
    twitterTitle: "DrFurman.ai — AI-powered Nutritarian guidance, 24/7",
    twitterDescription:
      "Chat 24/7 with an assistant trained on Dr. Joel Fuhrman's complete body of work.",
  },

  nav: {
    chat: "Chat with the AI",
    corpus: "What it knows",
    examples: "Examples",
    comingSoon: "Coming soon",
    /** aria-label on the language switcher button. */
    language: "Language",
  },

  header: {
    logoAriaLabel: "Dr. Fuhrman AI",
  },

  hero: {
    memberLoginPrompt: "Already a drfuhrman.com member?",
    memberLoginCta: "Log in",
    headline: "Every book. Every lecture. Every answer.",
  },

  corpus: {
    /** {br} is a literal line break. */
    headline:
      "Built on Dr. Fuhrman's{br}four decades of research.",
    subheading:
      "Three years in the making, the DFO AI doesn't guess — it answers from Dr. Fuhrman's real corpus.",
    /** The four corpus stats. Numbers/emoji stay in the component;
     *  only `unit` + `flavor` (and stat 0's word "Every") translate. */
    stats: {
      everyWord: "Every",
      lecturesUnit: "video lecture",
      lecturesFlavor:
        "Every recorded lecture Dr. Fuhrman has given, indexed and answerable in plain language.",
      booksUnit: "books",
      booksFlavor:
        "Dr. Fuhrman's complete published library, from Eat to Live to Fast Food Genocide.",
      qasUnit: "member Q&As",
      qasFlavor:
        "Answers Dr. Fuhrman has personally given to his Member Center community over the years.",
      productsUnit: "products",
      productsFlavor:
        "Every supplement and offering on DrFuhrman.com, with full ingredient + spec data.",
    },
    languagePrefix: "Spoken in every language Gemini 3.5 Flash supports",
    videoAriaLabel:
      "An open hardcover health book on a warm wooden table surrounded by fresh broccoli, kale, blueberries, walnuts, and a smartphone showing a chat interface",
  },

  examples: {
    headline: "Try asking the DFO AI a real question.",
    /** {kbd}Enter{/kbd} renders the Enter key as a <kbd> chip. */
    description:
      "Click any question to drop it into the chat above — your input gets focus so you can press {kbd}Enter{/kbd} to send.",
    questions: [
      "What's the simplest way to start eating Nutritarian?",
      "Tell me about insulin sensitivity.",
      "What does Dr. Fuhrman recommend for high blood pressure?",
      "How do I do a 5-day Nutritarian challenge?",
      "What's the difference between cruciferous and leafy green vegetables?",
      "Which of Dr. Fuhrman's books should I read first?",
    ],
    ctaHint: "Drop into chat →",
    videoAriaLabel:
      "A person in a sunlit kitchen checking the DFO AI on their smartphone over a bowl of berries and fresh greens",
  },

  /**
   * The chat block (greeting, starters, gate form, errors, signup CTA).
   * These render in the page locale so the chat switches language with
   * the page.
   *
   * STOPGAP NOTE — `welcomeMessage` + `starters`: these render the chat
   * opener client-side from this dict so they localize today. Per the
   * FALLBACK_RELEASE comment in src/lib/divinci.ts they are destined to
   * come from the Divinci Release config (server, English) once real
   * release-fetch lands. At that point the durable fix is localized
   * release content server-side (the response-language directive already
   * handles the AI's replies). Until then, keep these translated here.
   */
  chat: {
    welcomeMessage:
      "Hi, I'm Dr. Joel Fuhrman's AI. I'm here to help you take back control of your health — what's been on your mind lately?",
    starters: [
      "Hi, Dr. Fuhrman AI. Can you tell me steps I can take about starting a healthier lifestyle?",
      "Hi Dr. Fuhrman AI, can you tell me what Nutritarian is all about?",
      "Hi Dr. Fuhrman AI. Can you tell me about insulin sensitivity?",
    ],
    /** Label above the conversation-starter pills (rendered uppercase). */
    tryAsking: "Try asking",
    /** Email gate — imperative label, with a required "*" appended in JSX. */
    emailLabel: "First, what's your email?",
    /** Email gate — label once a valid address is entered (with a ✓ in JSX). */
    emailLabelValid: "Your email",
    emailAriaLabel: "Your email",
    /** Sticky composer's email placeholder. */
    emailPlaceholderSticky: "First, your email to start chatting…",
    askButton: "Ask",
    questionPlaceholder: "Type your question…",
    questionAriaLabel: "Ask the Dr. Fuhrman AI",
    questionPlaceholderSticky:
      "Ask the Dr. Fuhrman AI — eating, disease reversal, weight loss…",
    sendAriaLabel: "Send message",
    /** Three-line disclaimer under the composer (each line wraps separately). */
    disclaimer: [
      "Double-check important info.",
      "Not a substitute for medical advice.",
      "AI can make mistakes.",
    ],
    errorEmailRequired: "Please enter your email above to start the chat.",
    errorEmailInvalid: "Please enter a valid email address.",
    errorEmailTooLong: "Email is too long.",
    errorDisposable:
      "Please use a permanent email address — disposable inboxes aren't supported.",
    errorNetwork:
      "Network error — that message wasn't delivered. Please try again.",
    /** Sticky bar nudge once the free message is spent. */
    quotaExhaustedNudge:
      "You've used your free message — keep talking to Dr. Fuhrman's AI.",
    signupHeadline: "Want to keep talking to Dr. Fuhrman's AI?",
    signupBody:
      "Continue the conversation — and unlock the full Nutritarian membership experience — at DrFuhrman.com.",
    signupButton: "Sign up at DrFuhrman.com",
  },

  /**
   * The "Real answers, straight from the corpus" showcase — one real
   * conversation rendered for the visitor to read.
   *
   * The answers carry the chat's inline markup, which MUST survive
   * translation untouched: **bold**, *italic*, and [[n]] citation markers
   * (the n maps to the nth retrieved source). Filenames (sources), book
   * titles (recommendations), the model string, and "Dr. Fuhrman AI" stay
   * in the component — only the prose below translates. The opening
   * greeting reuses `chat.welcomeMessage`.
   */
  transcript: {
    heading: "Real answers, straight from the corpus",
    subheading:
      "One real conversation with the Dr. Fuhrman AI — every reply grounded in his own books, lectures, and shows, with the exact sources shown. Scroll to read the whole thing.",
    online: "Online",
    assistantLabel: "Assistant",
    recommendationPrefix: "I noticed you might be interested in",
    composerAria: "Ask your own question in the chat",
    composerPlaceholder: "Ask Dr. Fuhrman's AI your own question…",
    questions: [
      "What are the first three steps to start a Nutritarian diet?",
      "In one sentence, what is a Nutritarian diet?",
      "Name three high-nutrient leafy greens.",
    ],
    /** One string[] per question — paragraphs, in the same order. */
    answers: [
      [
        "Based on my work in *Eat for Health*, the first three steps to transition to a healthful Nutritarian diet are [[7]]:",
        "**1. Reprogram your thinking and tastes to prefer micronutrient-rich foods.** You have to shift your mindset. Instead of focusing on what you’re giving up, train yourself to desire the foods that do the most to nourish and protect your body—leafy greens, beans, onions, mushrooms, berries, and seeds. As you consume these foods, your taste buds actually change, and what once seemed plain or boring becomes vibrant and satisfying.",
        "**2. Eliminate addictive hunger symptoms that lead to overeating by making micronutrient-rich foods the foundation of your diet.** Most people are trapped in cycles of “toxic hunger”—shakiness, headaches, and cravings caused by withdrawal from low-nutrient, processed foods. When you build your diet around foods with high nutrient density, that addictive pull diminishes. You experience true hunger in the throat, not uncomfortable detox symptoms in the stomach, and your body finally gets satisfied with the right amount of calories.",
        "**3. Limit unhealthful foods in your daily diet.** As you crowd your plate with high-nutrient foods, you naturally reduce the processed, refined, and animal-derived products. It’s not about perfection in one day; it’s about making micronutrient-rich plant foods the main event and letting the unhealthful options fall to the periphery until they no longer have a hold on you.",
        "These three steps work together—you can’t fully separate them. As the nutrient density of your diet goes up, your desire for low-nutrient foods goes down, and your ability to eat for genuine health rather than addiction becomes automatic [[7]].",
      ],
      [
        "A Nutritarian diet is a high-nutrient eating style built on the principle that Health equals Nutrients divided by Calories [[4]], where you maximize micronutrients per calorie by emphasizing green vegetables, beans, onions, mushrooms, berries, and seeds while avoiding processed foods, sugar, white flour, and refined oils [[1]][[5]].",
      ],
      [
        "I’d point you to **kale, collard greens, and spinach**. These dark leafy greens score at the very top of the nutrient-density line—100 out of 100—because they are loaded with vitamins, minerals, and cancer-fighting phytochemicals that protect against disease [[1]][[7]].",
      ],
    ],
  },

  comingSoon: {
    label: "Coming soon",
    headline: "Take the DFO AI with you — everywhere.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Native mobile app with food-photo recognition",
        body: "Snap a picture of your food at the grocery store, in the kitchen, or at a restaurant. The DFO AI tells you instantly whether it fits a Nutritarian lifestyle — and what to swap in if it doesn't.",
        imageAlt:
          "A person holding up a smartphone at a farmers market, the camera framed over fresh kale and tomatoes with a green analysis ring",
      },
      {
        badge: "Offline · Gemma 4",
        title: "The DFO AI, running entirely on your device",
        body: "A compressed version of the DFO AI, powered by Google's Gemma 4 open model. Works on planes, in remote kitchens, in the back of the supplement aisle — no connection required.",
        imageAlt:
          "A traveler in an airplane window seat using the DFO AI on their smartphone, soft golden-hour clouds visible through the window",
      },
    ],
  },

  bios: {
    headline: "The minds behind the AI.",
    subheading:
      "The DFO AI's voice is grounded in decades of clinical practice and teaching by Dr. Joel and Dr. Cara Fuhrman.",
    /** Names stay in component code; only role + body translate. */
    roles: [
      "Board-certified family physician, author, nutrition researcher",
      "Family medicine physician, plant-based nutrition advocate",
    ],
    bodies: [
      "Dr. Fuhrman is a #1 New York Times best-selling author and a board-certified family physician specializing in nutritional medicine. He coined the term Nutritarian to describe a diet that strives for nutritional excellence, and has devoted four decades of clinical practice and research to documenting how a diet rich in micronutrients can prevent and reverse chronic disease.",
      "Dr. Cara Fuhrman is a family medicine physician with a passion for plant-based nutrition and helping families build lifelong healthy habits. She partners with Dr. Joel Fuhrman on educational programs that bring the Nutritarian approach to a wider audience. With her father, she co-founded LongevityRx, an advanced longevity-medicine clinic in San Diego.",
    ],
    footerPrefix: "For full bios, books, and research, visit",
  },

  cta: {
    headline: "Ready to ask Dr. Fuhrman's AI a question?",
    description:
      "Free to try. No account needed to start. The chat is right at the top of this page.",
    buttonText: "Try the DFO AI now",
  },

  footer: {
    poweredBy: "Powered by",
    aiSafety: "AI Safety & Ethics",
    terms: "Terms",
    privacy: "Privacy",
  },
};

/**
 * The shape every locale dictionary must satisfy. `en` is intentionally
 * NOT `as const` — we want string fields typed as `string` (not their
 * English literal) so translated locale files satisfy the same shape.
 */
export type UIStrings = typeof en;
