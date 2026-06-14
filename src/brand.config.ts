/**
 * brand.config.ts — the single source of truth for re-skinning this template.
 *
 * Everything brand-specific lives here. To launch a new customer demo:
 *   1. Fill out this file (or generate it via the demo-pipeline brand extractor)
 *   2. Drop logo.svg / favicon.svg / hero.webp into public/brand/
 *   3. `npm run og && npm run build && npm run deploy:prod`
 *
 * The default below is a NEUTRAL "Acme Expert" brand so the template builds and
 * deploys out-of-the-box. See examples/ for a real, filled-in config.
 */

export interface BrandConfig {
  identity: {
    siteName: string;        // "Acme Expert" — OG, copyright, og:site_name
    domain: string;          // canonical, e.g. "https://demo.acme.com"
    productName: string;     // AI product name shown in chat, "Acme Expert AI"
    legalName: string;       // copyright holder; year is always dynamic
  };
  /** 8 semantic tokens — override the --color-df-* CSS vars from the Layout AND
   *  feed the OG generator (one source, no duplication). */
  palette: {
    primary: string; dark: string; mid: string; accent: string;
    cream: string; soft: string; bubble: string; text: string;
  };
  fonts: { family: string; headingWeight: number; bodyWeight: number; links?: string[] };
  links: {
    mainSite: string; signupUrl: string; loginUrl: string; bioCreditUrl: string;
    /** True only when the client's site actually offers a member/patient login —
     *  gates the "Already a patient? Log in" affordances. */
    hasLogin?: boolean;
    /** Divinci legal URLs are shared defaults — set only to override. */
    terms?: string; privacy?: string; aiSafety?: string;
  };
  divinci: { releaseId: string; apiBase: string; whitelabelId: string };
  bios: Array<{ name: string; title: string; blurbKey: string; image?: string }>;
  corpus: { framing: string; stats: Array<{ value: string; label: string }> };
  chat: { fallbackWelcome: string; starters: string[] };
  media: {
    logo: string; favicon: string; heroImage: string; corpusVideo?: string;
    ogTagline: string; ogSubtitle: string;
    /** True when the logo is light/white (built for a dark header) — the hero
     *  darkens it so it doesn't wash out on the light background. */
    logoIsLight?: boolean;
  };
  referral: { source: string };
  deploy: { workerName: string; demoHost: string };
  /** Optional section toggles. A section renders unless its flag is explicitly
   *  false — so existing configs are unaffected, and demos can hide aspirational
   *  sections (examples, coming-soon) that would otherwise show empty media. */
  sections?: { examples?: boolean; comingSoon?: boolean };
}

export const brand: BrandConfig = {
  identity: {
    siteName: "Acme Expert",
    domain: "https://demo.acme.example",
    productName: "Acme Expert AI",
    legalName: "Acme Expert",
  },
  palette: {
    primary: "#2d3748", dark: "#1a2330", mid: "#4a5568", accent: "#4299e1",
    cream: "#f7fafc", soft: "#edf2f7", bubble: "#e2ecf7", text: "#1a1a1a",
  },
  fonts: {
    family: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
  links: {
    mainSite: "https://acme.example",
    signupUrl: "https://acme.example/signup",
    loginUrl: "https://acme.example/login",
    bioCreditUrl: "https://acme.example/about",
  },
  divinci: {
    releaseId: "REPLACE_WITH_RELEASE_ID",
    apiBase: "https://api.divinci.app",
    whitelabelId: "REPLACE_WITH_WHITELABEL_ID",
  },
  bios: [{ name: "Dr. Acme Expert", title: "Founder", blurbKey: "bios.bodies.0" }],
  corpus: {
    framing: "Built on years of expertise",
    stats: [
      { value: "100+", label: "articles" },
      { value: "1,000+", label: "answered questions" },
      { value: "10+", label: "years of practice" },
    ],
  },
  chat: {
    fallbackWelcome:
      "Hi, I'm the Acme Expert AI. Ask me anything about our work — what's on your mind?",
    starters: [
      "What does Acme Expert specialize in?",
      "How can you help me with my project?",
      "How do I get started with Acme Expert?",
    ],
  },
  media: {
    logo: "/brand/logo.svg",
    favicon: "/brand/favicon.svg",
    heroImage: "/brand/hero.webp",
    ogTagline: "Every answer, 24/7.",
    ogSubtitle: "AI-powered guidance — chat anytime, in any language.",
  },
  referral: { source: "acme-demo" },
  deploy: { workerName: "acme-landing", demoHost: "demo.acme.example" },
};

/** Anonymous-visitor quota before the upgrade gate (foundation default). */
export const FREE_MESSAGE_QUOTA = 1;
