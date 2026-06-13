/**
 * English source-of-truth UI dictionary for the landing-page template.
 * `UIStrings` (below) is derived from this object, so it defines the shape
 * every locale must satisfy.
 *
 * This is NEUTRAL PLACEHOLDER copy ("Acme Expert"). Replace it with the
 * customer's wording — by hand, or via the demo-pipeline brand extractor
 * (Steps 2–3) which generates this file from the prospect's site. Brand
 * nouns that recur (product name, person) are written inline here; swap
 * them when re-skinning. The template ships ONLY this `en` dictionary;
 * all other advertised locales fall back to it (see src/i18n/index.ts)
 * until a customer adds src/i18n/ui/<code>.ts translations.
 *
 * Inline markup ({br}, {kbd}…{/kbd}) is represented as placeholder tokens
 * the components re-inflate, so translators never touch HTML. Showcase
 * answers also use **bold**, *italic*, and [[n]] citation markers.
 */

export const en = {
  meta: {
    title: "Acme Expert AI — answers from our knowledge base, 24/7",
    description:
      "Chat with the Acme Expert AI, trained on our complete published work — articles, talks, and answered questions. Available 24/7, in your language.",
    ogTitle: "Acme Expert AI — answers from our knowledge base, 24/7",
    ogDescription:
      "Chat 24/7 with an assistant trained on Acme Expert's complete body of work.",
    ogImageAlt: "Acme Expert AI — every article, every talk, every answer.",
    twitterTitle: "Acme Expert AI — answers from our knowledge base, 24/7",
    twitterDescription:
      "Chat 24/7 with an assistant trained on Acme Expert's complete body of work.",
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
    logoAriaLabel: "Acme Expert AI",
  },

  hero: {
    memberLoginPrompt: "Already a member?",
    memberLoginCta: "Log in",
    headline: "Every article. Every talk. Every answer.",
  },

  corpus: {
    /** {br} is a literal line break. */
    headline: "Built on Acme Expert's{br}years of work.",
    subheading:
      "The Acme Expert AI doesn't guess — it answers from our real, published knowledge base.",
    /** The four corpus stats. Numbers/emoji stay in the component;
     *  only `unit` + `flavor` (and stat 0's word "Every") translate. */
    stats: {
      everyWord: "Every",
      lecturesUnit: "talk",
      lecturesFlavor:
        "Every recorded talk we've given, indexed and answerable in plain language.",
      booksUnit: "articles",
      booksFlavor:
        "Our complete published library, searchable and citable.",
      qasUnit: "answered questions",
      qasFlavor:
        "Real answers we've given our community over the years.",
      productsUnit: "resources",
      productsFlavor:
        "Every offering in our catalog, with full detail and specs.",
    },
    languagePrefix: "Available in every language the model supports",
    videoAriaLabel:
      "An open book on a warm wooden table beside a smartphone showing a chat interface",
  },

  examples: {
    headline: "Try asking the Acme Expert AI a real question.",
    /** {kbd}Enter{/kbd} renders the Enter key as a <kbd> chip. */
    description:
      "Click any question to drop it into the chat above — your input gets focus so you can press {kbd}Enter{/kbd} to send.",
    questions: [
      "What's the simplest way to get started?",
      "What do you specialize in?",
      "What do you recommend for a beginner?",
      "Can you walk me through the basics?",
      "What's the difference between your core offerings?",
      "Where should I begin?",
    ],
    ctaHint: "Drop into chat →",
    videoAriaLabel:
      "A person in a sunlit room checking the Acme Expert AI on their smartphone",
  },

  /**
   * The chat block (greeting, starters, gate form, errors, signup CTA).
   * `welcomeMessage` + `starters` render the opener client-side from this
   * dict so they localize today; they fall back to brand.config.chat and
   * are destined to come from the Divinci Release config server-side.
   */
  chat: {
    welcomeMessage:
      "Hi, I'm the Acme Expert AI. Ask me anything about our work — what's on your mind?",
    starters: [
      "Hi! Can you tell me how to get started?",
      "What does Acme Expert specialize in?",
      "How can you help me?",
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
    questionAriaLabel: "Ask the Acme Expert AI",
    questionPlaceholderSticky:
      "Ask the Acme Expert AI anything…",
    sendAriaLabel: "Send message",
    /** Three-line disclaimer under the composer (each line wraps separately). */
    disclaimer: [
      "Double-check important info.",
      "Not a substitute for professional advice.",
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
      "You've used your free message — keep talking to the Acme Expert AI.",
    signupHeadline: "Want to keep talking to the Acme Expert AI?",
    signupBody:
      "Continue the conversation — and unlock full access — on our site.",
    signupButton: "Sign up",
  },

  /**
   * The "Real answers, straight from the corpus" showcase — one real
   * conversation rendered for the visitor to read. Replace with a real
   * exchange from the customer's own assistant. Markup (**bold**, *italic*,
   * [[n]] citations) MUST survive translation untouched.
   */
  transcript: {
    heading: "Real answers, straight from the knowledge base",
    subheading:
      "One conversation with the Acme Expert AI — every reply grounded in our own published work, with the exact sources shown. Scroll to read the whole thing.",
    online: "Online",
    assistantLabel: "Assistant",
    recommendationPrefix: "I noticed you might be interested in",
    composerAria: "Ask your own question in the chat",
    composerPlaceholder: "Ask the Acme Expert AI your own question…",
    questions: [
      "What are the first steps to get started?",
      "In one sentence, what do you do?",
      "Name three things a beginner should know.",
    ],
    /** One string[] per question — paragraphs, in the same order. */
    answers: [
      [
        "Great question — here are the first three steps to get started [[1]]:",
        "**1. Start with the fundamentals.** Begin with our introductory material so you have a solid foundation before moving on to more advanced topics.",
        "**2. Practice consistently.** Small, regular steps compound — build a routine you can sustain rather than trying to do everything at once.",
        "**3. Ask questions as you go.** Use this assistant whenever you're unsure; every answer is grounded in our published work and cites its sources.",
        "These steps build on each other — start simple, stay consistent, and ask for help when you need it [[1]].",
      ],
      [
        "In short, we help you get expert, sourced answers from our complete published knowledge base — available anytime, in your language [[2]].",
      ],
      [
        "Three things worth knowing up front: **start with the basics**, **stay consistent**, and **lean on the sources** — every answer here is backed by our real published material [[1]][[2]].",
      ],
    ],
  },

  comingSoon: {
    label: "Coming soon",
    headline: "Take the Acme Expert AI with you — everywhere.",
    cards: [
      {
        badge: "iOS + Android",
        title: "Native mobile app",
        body: "Get expert, sourced answers on the go — in the field, at home, or anywhere you need them.",
        imageAlt:
          "A person holding up a smartphone, using the Acme Expert AI",
      },
      {
        badge: "Offline",
        title: "The Acme Expert AI, running on your device",
        body: "A compressed, on-device version that works with no connection required.",
        imageAlt:
          "A traveler using the Acme Expert AI on their smartphone with no signal",
      },
    ],
  },

  bios: {
    headline: "The team behind the AI.",
    subheading:
      "The Acme Expert AI's voice is grounded in years of real expertise and practice.",
    /** Names come from brand.config.bios; only role + body translate. */
    roles: [
      "Founder",
      "Co-founder",
    ],
    bodies: [
      "Replace this with the founder's bio — credentials, focus, and the body of work the assistant is trained on.",
      "Replace this with a second team member's bio, or remove the entry from brand.config.bios for a single-person layout.",
    ],
    footerPrefix: "For full bios and resources, visit",
  },

  cta: {
    headline: "Ready to ask the Acme Expert AI a question?",
    description:
      "Free to try. No account needed to start. The chat is right at the top of this page.",
    buttonText: "Try the Acme Expert AI now",
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
 * NOT `as const` — string fields stay typed as `string` so translated
 * locale files satisfy the same shape.
 */
export type UIStrings = typeof en;
