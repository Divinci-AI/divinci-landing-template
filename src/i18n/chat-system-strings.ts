/**
 * System strings for the chat surface — the ones that describe what the
 * SERVER did, not what the customer sells.
 *
 * ⚠️ These deliberately do NOT live in `src/i18n/ui/en.ts`.
 *
 * That dictionary is the per-customer COPY surface: the demo pipeline
 * generates a branded `en.ts` per run and then shape-checks it against the
 * neutral template (`explainEnTsMismatch` in copy-gen.ts). Key-set parity is
 * exact, so any key added to the template is MISSING from every previously
 * generated run — and the pipeline responds by rejecting the branded copy
 * wholesale and shipping the demo with neutral "Acme Expert" text in its
 * title, og: tags, chat welcome and CTA.
 *
 * Adding `errorServer` there did exactly that on 2026-08-17. The guard caught
 * it before deploy; the lesson is that an error string is not customer copy
 * and should never have been in the customer's copy file.
 *
 * The cost of living here is that these are English-only for now. That is the
 * honest trade: they would have been English-only on every already-generated
 * site anyway, and the alternative silently de-brands the whole fleet. To
 * translate them, add a per-locale map in THIS module — not a key over there.
 */
export const CHAT_SYSTEM_STRINGS = {
  /**
   * A 5xx is OUR fault, not the visitor's connection. Blaming their network
   * sends them to reload and reproduce it — this is the case that actually
   * happened during the 2026-08-17 pool-exhaustion outage.
   */
  errorServer:
    "Something went wrong on our end — that message wasn't delivered. Please try again in a moment.",
  /** Upstream 429: the release's shared rate-limit bucket, not a failure. */
  errorBusy:
    "The assistant is handling a lot of questions right now. Please try again in a moment.",
  /**
   * The Divinci-side anonymous cap (release.maxAnonymousChatMessages) — a
   * DIFFERENT ceiling from this landing page's own free-message quota, and the
   * only refusal with a real next step. Kept separate from signupHeadline/-Body,
   * which send the visitor to the CUSTOMER's site; this one goes to Divinci.
   */
  anonLimitHeadline: "You've reached the anonymous chat limit",
  anonLimitBody:
    "Sign in to Divinci to keep this conversation going — no limit once you're signed in.",
  anonLimitButton: "Sign in to continue",
} as const;
