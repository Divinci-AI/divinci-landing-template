# Hosting this landing page on Vercel

The Cloudflare Worker (`src/worker.ts`) and the Vercel entry point
(`middleware.ts`) run **the same handlers**. Only two bindings differ, and both
are injected by the entry point:

| | Cloudflare | Vercel |
|---|---|---|
| static build | `ASSETS` binding | served by the platform |
| per-email quota | Durable Object | Vercel KV (`src/lib/quota-store.ts`) |
| signing | `crypto.subtle` | the same `crypto.subtle` |

There is no second implementation of the email validation, the grace window, the
claim rollback or the signing — which is the point. Two implementations drift,
and the drift shows up as a demo behaving differently on one host than the
other.

### The entry-point split

| file | |
|---|---|
| `src/worker.ts` | the handlers. Portable: no `cloudflare:` or `node:` imports. |
| `src/worker.cf.ts` | wrangler's entry — `worker.ts` plus the Durable Object export |
| `middleware.ts` | Vercel's entry — `worker.ts` plus a KV-backed quota namespace |

The Durable Object class lives behind `worker.cf.ts` because importing it drags
in `cloudflare:workers`, which resolves on no other runtime. `worker.ts` must
stay clean of it or `middleware.ts` cannot load at all.

⚠️ **The test suite cannot notice that on its own** — `vitest.config.ts` aliases
`cloudflare:workers` to a stub, so every test keeps passing while the Vercel
build breaks. `src/__test__/portable-worker.test.ts` walks the real import graph
over source text to catch it, and is the reason that alias is safe to keep.

## ⚠️ A landing page is not a static site

Two of its jobs need code and a secret **at request time**:

1. **Signing.** Every upstream chat call carries `X-Landing-Page-Ts` and
   `X-Landing-Page-Sig`. Paired with `release.requireSignedAnonymousChat`, that
   is what stops anyone who extracts the public release id from calling the chat
   API directly and bypassing the per-email quota.
2. **The quota.** One free message per email, lifetime, plus the anonymous grace
   window.

Deploy the built output to a plain static host and it looks perfect and has
**every message refused by the API**. That is why `middleware.ts` exists and why
it fails closed rather than starting without either piece.

## Setup

```sh
vercel link
vercel kv create landing-quota      # or attach an existing Upstash Redis
```

Then set these on the project (Settings → Environment Variables):

| variable | |
|---|---|
| `LANDING_PAGE_HMAC_KEY` | **required** — must be one of the values the API accepts |
| `DIVINCI_API_BASE` | `https://api.divinci.app` |
| `DIVINCI_RELEASE_ID` | the release this demo fronts |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | **required** — set for you by `vercel kv create` |
| `FREE_MESSAGES_BEFORE_EMAIL` | default `3` |
| `NO_EMAIL_GATE` / `DEMO_QUOTA_LIMIT` | for a direct-handoff demo |
| `BASIC_AUTH_PASSWORD` | optional preview gate — off by default, and [read why](src/worker.ts) before turning it on |

`UPSTASH_REDIS_REST_URL` / `_TOKEN` are accepted as aliases, so an existing
Upstash integration works without renaming anything.

**During a key rotation** `LANDING_PAGE_HMAC_KEY` may be `"<new>,<old>"` — the
API accepts either. The middleware signs with the **first**; signing with the
joined string would match neither and take the demo dark for the whole rotation.

## What is not ported

The **Phase-4 email-verification flow** (`markVerified`, `canSendVerified`,
`recordVerifiedSend`) and the **admin reset**. All of them need secrets
(`RESEND_API_KEY`, `VERIFY_TOKEN_SECRET`, `ADMIN_RESET_TOKEN`) that the demo
pipeline never sets, so they are dead code on both hosts for a demo.

The Vercel store **throws** if they are ever called rather than returning a
plausible default: a silent "not verified" would look like a working
verification flow that never verifies anyone. If you enable verification on
Vercel, implement them in `src/lib/quota-store.ts` — the error message says so.

## Verifying a deploy

```sh
curl -s -X POST https://<project>.vercel.app/api/chat-send \
  -H 'content-type: application/json' \
  -d '{"email":"you@example.com","newPrompt":"what do you do?"}' | head -c 400
```

- **200** with a transcript — working.
- **503 `landing_page_hmac_unconfigured`** or **`quota_store_unconfigured`** —
  a variable above is missing. The middleware refuses on purpose.
- **403** from upstream — the signature was rejected. Check that
  `LANDING_PAGE_HMAC_KEY` matches a key the API accepts, and that the clock is
  sane (the window is ±300s).
- **402** — the quota is working; that email has spent its free message.

## Tests

```sh
npm test
```

`src/__test__/middleware.test.ts` drives the middleware end to end with the
upstream and the KV store stubbed, and pins the signature against a **golden
vector produced by the server's own signer** — not by this repo's code. A change
to the payload shape, encoding or hash fails there rather than as "every message
is refused" on a customer's demo.
