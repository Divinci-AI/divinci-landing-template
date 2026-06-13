# Divinci SDK Landing-Page Template

An open-source, **re-skinnable** landing page with an embedded Divinci AI chat —
Astro + React islands on **Cloudflare Workers**, backed by a Divinci Release.
Generalized from the production `drfuhrman.ai` implementation.

The whole site re-skins from **one file**: [`src/brand.config.ts`](src/brand.config.ts).
Fill it out, drop in three assets, deploy.

## Quickstart

```sh
npm install
# 1. Edit src/brand.config.ts  (identity, palette, links, Divinci release, copy)
# 2. Drop your assets into public/brand/:  logo.svg  favicon.svg  hero.webp
# 3. Generate the social card + build:
npm run og
npm run build
# 4. Configure Cloudflare (wrangler.toml: worker name + KV namespace) and deploy:
npm run deploy:prod
```

The default `brand.config.ts` is a neutral **"Acme Expert"** brand so the
template builds and runs out of the box. See
[`examples/`](examples/) for filled-in configs.

## What re-skins from `brand.config.ts`

| Surface | Driven by |
|---|---|
| Colors (every `bg-df-*` / `text-df-*`) | `palette` → injected as CSS-var overrides in the Layout |
| Logo + favicon | `media.logo`, `media.favicon` (+ `--logo-url` for the hero gleam mask) |
| Hero image / corpus video | `media.heroImage`, `media.corpusVideo` |
| Site domain, title, OG | `identity`, `astro.config.mjs` (imports the config) |
| Nav / footer / bio credit links | `links.*` |
| Bio names | `bios[]` |
| Chat fallback welcome + starters | `chat.*` |
| Divinci release / API / whitelabel | `divinci.*` |
| OG social card (palette + tagline) | the OG generator reads the same config — no duplicated palette |

## How the chat authenticates

The chat is **anonymous** — no Divinci API key or user token lives in this repo.
The Cloudflare Worker signs each upstream call to the Divinci API with a
**landing-page HMAC** (`LANDING_PAGE_HMAC_KEY`, set via `wrangler secret put`,
matching the Release config), plus a per-email free-message **quota** (a Durable
Object) and optional magic-link **email verification**. All of that is
foundation infrastructure — generic, customer-agnostic.

## Architecture

- **Astro static site** (`src/pages`, `src/components/sections`) + **React chat
  island** (`src/components/chat`), 36-locale i18n (`src/i18n`).
- **Cloudflare Worker** (`src/worker.ts`) — proxies `/api/*`: quota-gated
  chat-send (HMAC-signed), email verification, welcome/release-meta.
- **Durable Object** (`src/quota-coordinator.ts`) — per-email quota
  (unverified = 1 lifetime message, verified = 5 / 24h).

See [`TEMPLATE-TODO.md`](TEMPLATE-TODO.md) for the remaining generalization work.

## Part of the Divinci SDK

This is a living `@divinci-ai/client` example, referenced from the
[sdk.divinci.ai](https://sdk.divinci.ai) docs. MIT licensed.
