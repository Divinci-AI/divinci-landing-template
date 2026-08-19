/**
 * Vercel Edge Middleware — the landing page's API surface, off Cloudflare.
 *
 * ── Why this file exists ────────────────────────────────────────────────────
 *
 * A landing page looks like a static site and is not one. Two of its jobs need
 * code and a secret at REQUEST time:
 *
 *   1. SIGNING. Every upstream anonymous-chat call carries
 *      `X-Landing-Page-Ts` and `X-Landing-Page-Sig` — HMAC-SHA256 over
 *      `${ts}.${releaseId}.${newPrompt}` with `LANDING_PAGE_HMAC_KEY`. Paired
 *      with `release.requireSignedAnonymousChat`, that is what stops anyone who
 *      extracts the public release id from calling the chat API directly and
 *      bypassing the per-email quota.
 *
 *   2. THE QUOTA. One free message per email, lifetime — plus the anonymous
 *      grace window and the cached-starter budget.
 *
 * Deploy the built site to a static host with neither, and it looks perfect and
 * has every message refused by the API. That is the failure this file removes.
 *
 * ── Why it delegates instead of reimplementing ──────────────────────────────
 *
 * `src/worker.ts` is ~1,100 lines of email validation, normalisation,
 * disposable-domain blocking, grace-window accounting, claim rollback on
 * upstream failure, and seven routes. Writing that again for Vercel would give
 * two implementations that drift, and the drift would be invisible until a
 * demo on one host behaved differently from a demo on the other.
 *
 * So the handlers are shared verbatim. Only two things differ per host, and
 * both are injected here:
 *
 *   ASSETS    Vercel serves the static build itself; the matcher below means
 *             this never sees a non-/api request, so no assets binding is used.
 *   QUOTA_DO  a Durable Object on Cloudflare; Vercel KV here. See
 *             `src/lib/quota-store.ts`.
 *
 * Everything else in the worker is standard Request/Response/fetch/Web Crypto
 * and runs on the Edge Runtime unchanged — including `upstream-hmac.ts`, which
 * is `crypto.subtle` already, so the signature is computed by the SAME code on
 * both hosts rather than by two implementations that must agree.
 */
import worker, { type Env } from "./src/worker";
import { redisQuotaNamespace, upstashCommand } from "./src/lib/quota-store";

// Declared locally rather than pulling in @types/node or
// @cloudflare/workers-types. This repo has neither wired into tsconfig (a
// pre-existing gap — `tsc --noEmit` reports it across playwright.config.ts and
// several tests), and adding them here would be a dependency change dressed up
// as a feature. Both shapes are tiny and used in exactly one place each.
declare const process: { env: Record<string, string | undefined> };
/** The subset of the Workers ExecutionContext the handlers actually use. */
interface WorkerContext {
  waitUntil(p: Promise<unknown>): void;
}

export const config = {
  runtime: "edge",
  // Only the API surface. Everything else is the Astro static build, which
  // Vercel serves natively and faster than this could.
  matcher: ["/api/:path*"],
};

/** Vercel exposes `waitUntil` on the context; fall back to awaiting inline. */
interface VercelContext {
  waitUntil?: (p: Promise<unknown>) => void;
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export default async function middleware(
  request: Request,
  context: VercelContext = {},
): Promise<Response> {
  const env = process.env;

  // ── The quota store, or a clear refusal ───────────────────────────────────
  //
  // FAIL CLOSED. Without a store there is no per-email cap, and an
  // anonymous LLM endpoint with no cap on the public internet is the exact
  // thing the gate exists to prevent. Returning 503 with the reason is
  // survivable and obvious; quietly serving unlimited free inference is
  // neither, and would not show up until the bill did.
  const cmd = upstashCommand(env);
  if (!cmd) {
    console.error(
      "[middleware] no quota store — set KV_REST_API_URL + KV_REST_API_TOKEN " +
      "(Vercel KV) or the UPSTASH_REDIS_REST_* pair. Refusing rather than " +
      "serving uncapped anonymous inference.",
    );
    return json(503, { error: "quota_store_unconfigured" });
  }

  // ── The signing key ───────────────────────────────────────────────────────
  //
  // Also fail closed, and for a subtler reason. `computeUpstreamHmacHeaders`
  // returns null when the key is unset, so the request goes upstream WITHOUT
  // the headers — which was correct while the upstream side was unbuilt, and is
  // now a request the API rejects for any release with signing on. The visitor
  // sees a generic failure and the operator sees nothing.
  //
  // ⚠️ A comma-separated value is a KEY ROTATION window: the API accepts every
  // listed key, but a signer must pick ONE. Signing with the joined string
  // matches none of them, and the whole demo goes dark for the length of a
  // rotation with no error that names the cause.
  const hmacKey = (env.LANDING_PAGE_HMAC_KEY ?? "").split(",")[0]?.trim();
  if (!hmacKey) {
    console.error(
      "[middleware] LANDING_PAGE_HMAC_KEY is unset. Every chat call would go " +
      "upstream unsigned and be refused by any release that requires signing.",
    );
    return json(503, { error: "landing_page_hmac_unconfigured" });
  }

  const workerEnv: Env = {
    ...(env as unknown as Env),
    LANDING_PAGE_HMAC_KEY: hmacKey,
    QUOTA_DO: redisQuotaNamespace(cmd),
    // ASSETS and EMAIL_QUOTA are deliberately absent: the matcher guarantees
    // only /api/* reaches here, and the legacy KV fast path is Cloudflare-only.
  };

  const ctx: WorkerContext = {
    waitUntil: (p: Promise<unknown>) => {
      if (context.waitUntil) context.waitUntil(p);
      // No waitUntil available: swallow rejections rather than letting a
      // best-effort background task turn into an unhandled rejection that
      // takes down the response.
      else void Promise.resolve(p).catch(() => {});
    },
  };

  return worker.fetch(request, workerEnv, ctx);
}
