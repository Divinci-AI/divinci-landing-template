# Template generalization — remaining work

Step 1 (fork + parameterize) status. The **foundation spine is wired to
`src/brand.config.ts`**; the items below are the remaining generalization.

## Done (wired to brand.config.ts)
- `src/brand.config.ts` — the typed single-source-of-truth config (Acme default)
- `src/lib/divinci.ts` — release/api/whitelabel, signup/login, fallback chat
- `src/layouts/Landing.astro` — palette + font + `--logo-url` injected as
  `:root` overrides; site/canonical/`og:site_name`/favicon from config
- `astro.config.mjs` — `site` from config
- `scripts/build-og.ts` — palette + tagline + logo from config (killed the old
  global.css↔build-og color duplication); runs via `tsx`
- `src/components/Header.astro` — logo, alt, main-site nav link
- `src/components/sections/HeroSection.astro` — logo (img + gleam mask via
  `--logo-url`), hero image
- `src/components/Footer.astro` — legal name, legal links (shared defaults)
- `src/components/sections/CorpusSection.astro` — video/poster
- `src/components/sections/BiosSection.astro` — names + credit link
- `package.json` — renamed `divinci-landing-template`, MIT, `tsx` dep
- placeholder `public/brand/{logo,favicon}.svg`

## Remaining
1. **DONE (2026-06-13): i18n + all component copy neutralized.** `en.ts`
   rewritten to neutral "Acme Expert" copy; the 35 Fuhrman locale files deleted
   (the loader's English fallback serves all 36 advertised locales until a
   customer adds translations). Also neutralized the component-level refs the
   i18n split left behind: TranscriptShowcase (sources, labels, model →
   brand.config), ChatIsland/Transcript (labels, corpus fallback, logo, event
   name `divinci:populateInput`), ComingSoon (dropped dead Fuhrman card copy),
   Footer, links.ts REF_SOURCE, escrow storage key, verify-email templates
   (→ brand.identity.siteName), and the test fixtures. Deleted the dormant
   `worker-v2.ts`. **`grep -ri fuhrman src/` → zero.** Build = 36 pages.
2. **Corpus stats.** Values are still i18n-driven (`Every`, `talk`, etc. +
   unit/flavor). Move to `brand.config.corpus.stats` (value + label); decide
   whether to keep the per-stat "flavor" paragraph (add to schema if so).
3. **Bios layout.** Names come from config, but the radial face-mask geometry
   (`LAYOUT_SLOTS`) is tuned to the drfuhrman 2-person hero portrait. Generalize
   to a simpler avatar layout, or document the per-portrait re-tune.
4. **wrangler.toml.** Still has drfuhrman worker names, KV ids, and
   `DIVINCI_RELEASE_ID`. Templatize: worker name from `deploy.workerName`; the
   customer creates their own KV namespace; document the secrets
   (`LANDING_PAGE_HMAC_KEY`, etc.). NOTE the drfuhrman bug to NOT carry over:
   prod env pointed at the **staging** API — template prod must use prod.
5. **worker.ts** `DEFAULT_FROM_NAME` (verification email sender) — from config.
6. **Strip leftovers** — drfuhrman `public/favicon.svg` (replaced by
   `public/brand/favicon.svg`); `src/worker-v2.ts` (dormant experiment); any
   remaining `df-lang` localStorage key rename.
7. **examples/** — add `acme.brand.config.ts` (neutral) and
   `drfuhrman.brand.config.ts` (real values, proves extraction parity).
8. **Build/deploy verification** + a smoke e2e against a deployed Acme instance.

## Then
- **Step 4**: publish this repo public under `Divinci-AI`, add a
  "Landing-page starter" section to sdk.divinci.ai docs.
- **Steps 2–3** (in the demo-pipeline repo): auto-extract a customer's brand
  from their site → draft `brand.config.ts` → Fulcrum `[Landing]` gate → build +
  deploy per-customer; the resulting URL becomes the outreach demo link.
