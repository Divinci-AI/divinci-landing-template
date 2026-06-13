/**
 * EXAMPLE — a fully filled-in brand.config.ts for a fictional customer
 * ("Riverside Dental"). Shows what a completed config looks like vs. the
 * neutral "Acme Expert" placeholder in src/brand.config.ts.
 *
 * To use: copy the `brand` object's contents over src/brand.config.ts's
 * `brand` export, drop the customer's logo.svg / favicon.svg / hero.webp into
 * public/brand/, then `npm run og && npm run build`. (The demo-pipeline brand
 * extractor generates a file shaped exactly like this from a prospect's site.)
 */
import type { BrandConfig } from "../src/brand.config";

export const brand: BrandConfig = {
  identity: {
    siteName: "Riverside Dental",
    domain: "https://demo.riversidedental.com",
    productName: "Riverside Dental AI",
    legalName: "Riverside Dental Group",
  },
  palette: {
    primary: "#0b4f6c", dark: "#073649", mid: "#1c7a9c", accent: "#34c3e0",
    cream: "#f3f9fb", soft: "#e3eef2", bubble: "#d6ebf2", text: "#16242b",
  },
  fonts: {
    family: "'Poppins', system-ui, sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
  },
  links: {
    mainSite: "https://www.riversidedental.com",
    signupUrl: "https://www.riversidedental.com/book",
    loginUrl: "https://www.riversidedental.com/patient-portal",
    bioCreditUrl: "https://www.riversidedental.com/team",
  },
  divinci: {
    releaseId: "6b0000000000000000000001",
    apiBase: "https://api.divinci.app",
    whitelabelId: "6b0000000000000000000002",
  },
  bios: [
    { name: "Dr. Maya Chen, DDS", title: "Founder & Lead Dentist", blurbKey: "bios.bodies.0" },
    { name: "Dr. Andre Brooks, DDS", title: "Orthodontics", blurbKey: "bios.bodies.1" },
  ],
  corpus: {
    framing: "Built on 20 years of patient care",
    stats: [
      { value: "20+", label: "years in practice" },
      { value: "12k", label: "patients served" },
      { value: "4", label: "locations" },
    ],
  },
  chat: {
    fallbackWelcome:
      "Hi, I'm the Riverside Dental AI. Ask me about procedures, insurance, or booking a visit.",
    starters: [
      "What should I expect at a first cleaning?",
      "Do you accept my insurance plan?",
      "How do I book an appointment with Dr. Chen?",
    ],
  },
  media: {
    logo: "/brand/logo.svg",
    favicon: "/brand/favicon.svg",
    heroImage: "/brand/hero.webp",
    ogTagline: "Healthy smiles, answered 24/7.",
    ogSubtitle: "AI-powered patient answers from Riverside Dental — anytime, in any language.",
  },
  referral: { source: "riverside-demo" },
  deploy: { workerName: "riverside-landing", demoHost: "demo.riversidedental.com" },
};
