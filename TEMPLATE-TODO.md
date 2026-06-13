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
2. **DONE: Corpus stats** → `brand.config.corpus.stats` (value + label); the
   per-stat "flavor" paragraph was dropped (grid adapts to 3 or 4 stats).
3. **DONE: Bios layout** rewritten bare — initial-letter avatar cards driven by
   `brand.config.bios` (any count; 1 = centered, 2+ = grid). No hero-portrait /
   face-mask dependency. Swap the avatar `<span>` for an `<img>` when the brand
   kit supplies headshots.
4. **DONE: wrangler.toml** rewritten as a single-env template — placeholder
   worker name + KV id + `REPLACE_WITH_RELEASE_ID`; default API is now
   **prod** (`api.divinci.app`), not staging (the drfuhrman bug is not carried
   over). Multi-account staging/prod blocks removed (documented as optional).
5. **DONE: worker.ts** from-name, basic-auth realm/user, all quota messages,
   and the verify-email subject derive from `brand.config`.
6. **DONE: leftovers stripped** — orphaned `public/favicon.svg`, `worker-v2.ts`,
   ExamplesSection R2 video, ComingSoon `/logos/` badges, `prewarm-starters.mjs`
   defaults, all e2e fixtures. og.png/og-card.svg now gitignored (generated).
7. **DONE: examples/** — `riverside-dental.brand.config.ts` shows a fully
   filled config (the neutral Acme default lives in `src/brand.config.ts`).
8. **Remaining: assets.** Customer media (`hero.webp`, `examples.webm`,
   `corpus.webm`, `coming-soon-*.webm`, headshots) are referenced under
   `public/brand/` but ship empty — the brand-kit collection process supplies
   them. Sections degrade (alt/poster) when absent. Document the asset manifest.
9. **Remaining: dead i18n keys.** `corpus.stats.*` sub-keys in `en.ts` are now
   unused (stats come from config) — harmless, prune when convenient.
10. **Remaining: deploy verification** + smoke e2e against a deployed instance.

## Then
- **Step 4**: publish this repo public under `Divinci-AI`, add a
  "Landing-page starter" section to sdk.divinci.ai docs.
- **Steps 2–3** (in the demo-pipeline repo): auto-extract a customer's brand
  from their site → draft `brand.config.ts` → Fulcrum `[Landing]` gate → build +
  deploy per-customer; the resulting URL becomes the outreach demo link.
