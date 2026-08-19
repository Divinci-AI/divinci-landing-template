/**
 * Landing-page template worker.
 *
 * Three responsibilities, in order:
 *
 *   1. Basic-Auth gate for the preview build (BASIC_AUTH_PASSWORD secret).
 *      Failsafe: an unset/empty secret disables the gate so we can
 *      unlock the site without redeploying.
 *
 *   2. Server-side free-message quota at POST /api/chat-send.
 *      - Validates the visitor's email (format + disposable blocklist
 *        + length cap + control-char rejection).
 *      - SHA-256 hashes the lowercased email and uses that hash as the
 *        KV key in EMAIL_QUOTA. No KV entry → first time, allow.
 *      - If allowed, forwards to {DIVINCI_API_BASE}/ai-chat/anonymous-chat
 *        with the configured release id, then writes the hash to KV
 *        with no TTL ("1 free message per email, lifetime").
 *      - Returns the upstream { transcript, signiture } on success,
 *        402 on quota, 400 on bad input, 502 on upstream failure.
 *      Never logs the raw email — only hash + domain + decision.
 *
 *   3. Everything else passes through to ASSETS (the Astro static build).
 *
 * ─────────────────────────────────────────────────────────────────────
 * v1 weaknesses status (post-HARDENING-V2 — 2026-05-29):
 *
 *   a. Gmail-alias normalization — ✅ CLOSED (Phase 1). normalizeEmail()
 *      collapses dots/+tags/googlemail.com on the Big-5 providers before
 *      hashing. Unknown domains stay literal.
 *
 *   b. KV get-then-put race — ✅ CLOSED (Phase 2). All lifetime-claim
 *      writes go through the EmailQuotaCoordinator Durable Object, which
 *      single-threads per email-hash. The KV namespace is read-only
 *      legacy fast-path; scheduled for removal two weeks after Phase 2.
 *
 *   c. Direct curl bypass — ✅ LANDING-PAGE SIDE SHIPPED (Phase 3).
 *      Each upstream call carries X-Landing-Page-Ts +
 *      X-Landing-Page-Sig headers (HMAC-SHA256 over ts.releaseId.
 *      newPrompt with shared LANDING_PAGE_HMAC_KEY). Upstream-side
 *      enforcement middleware is documented in PHASE-3-HANDOFF.md
 *      for the Divinci monorepo team to wire up + flip the per-
 *      release flag. Until that lands, the headers are no-op
 *      stamps; once it lands, direct curl → 403.
 *
 *   d. No verification email — ✅ CODE COMPLETE (Phase 4). On the first
 *      chat for a new email, the worker queues a CF Email Sending REST
 *      call with a 7-day HMAC-signed magic-link token. Clicking the
 *      link marks the DO claim verified, lifting the lifetime-1 cap to
 *      a rolling 5/24h window for that email. Unverified emails keep
 *      the 1-msg-lifetime gate.
 *      Email send is gated on three secrets (CF_EMAIL_API_TOKEN,
 *      CF_ACCOUNT_ID, VERIFY_TOKEN_SECRET); when unset the dispatcher
 *      logs a warning and the chat still succeeds — the user just
 *      doesn't get the verification email and stays at 1-msg-lifetime.
 * ─────────────────────────────────────────────────────────────────────
 */

import { brand } from "./brand.config";
import { isDisposableEmail } from "./lib/disposable-emails";
import { normalizeEmail } from "./lib/normalize-email";
import { sendResendEmail } from "./lib/resend-send";
import { computeUpstreamHmacHeaders } from "./lib/upstream-hmac";
import {
  renderVerifyEmailHtml,
  renderVerifyEmailText,
  renderVerifyFailureHtml,
  renderVerifySuccessHtml,
} from "./lib/verify-email-templates";
import { signVerifyToken, verifyVerifyToken } from "./lib/verify-token";
import type { QuotaNamespace } from "./lib/quota-store";

// ⚠️ The Durable Object class is deliberately NOT imported here. It pulls in
// `cloudflare:workers`, which resolves on no other runtime — and this module is
// shared verbatim with the Vercel entry point (middleware.ts). wrangler's entry
// is `worker.cf.ts`, which adds that export on top.

/**
 * The only part of the Workers ExecutionContext these handlers use.
 *
 * Structural for the same reason as ASSETS and EMAIL_QUOTA: naming Cloudflare's
 * `ExecutionContext` would put a Cloudflare type in the signature of the module
 * both hosts share, and force the Vercel entry to cast — which is precisely how
 * a real mismatch gets hidden.
 */
export interface WaitUntilContext {
  waitUntil(p: Promise<unknown>): void;
}

export interface Env {
  /**
   * The three bindings below are the ONLY parts of this worker that are
   * Cloudflare-shaped, so they are typed structurally and the rest of the file
   * runs unchanged on any host with the standard Request/Response/fetch and
   * Web Crypto — which is what makes the Vercel entry point (middleware.ts) a
   * thin adapter rather than a second implementation of these 1,000 lines.
   *
   * `ASSETS` — optional. Vercel serves the static build itself, and its entry
   * only ever handles /api/*, so it never falls through to assets.
   */
  ASSETS?: { fetch(request: Request): Promise<Response> };
  /**
   * `EMAIL_QUOTA` — optional. A read-only legacy fast path that predates the
   * Durable Object and is scheduled for removal; absent, the DO answers alone.
   */
  EMAIL_QUOTA?: { get(key: string): Promise<string | null>; delete(key: string): Promise<void> };
  /**
   * `QUOTA_DO` — typed as the structural interface rather than
   * `DurableObjectNamespace<EmailQuotaCoordinator>`. The real namespace
   * satisfies it, so nothing changes here; a Redis-backed namespace satisfies
   * it too. See lib/quota-store.ts.
   */
  QUOTA_DO: QuotaNamespace;
  BASIC_AUTH_PASSWORD?: string;
  BASIC_AUTH_USERNAME?: string;
  DIVINCI_API_BASE: string;
  DIVINCI_RELEASE_ID: string;
  /** "1" -> direct-handoff demo: no email is collected, so the free-message
   *  quota is keyed on the visitor's IP instead. See handleChatSend. */
  NO_EMAIL_GATE?: string;
  /** Per-visitor send budget when NO_EMAIL_GATE is on (default 500). */
  DEMO_QUOTA_LIMIT?: string;
  /**
   * How many messages a visitor may send BEFORE being asked for an email
   * (default 3; "0" restores the old ask-up-front behaviour).
   *
   * Asking for an address before the first answer was the single most common
   * piece of negative feedback on the demos: a stranger is asked to identify
   * themselves before seeing that the thing works at all. The grace window is
   * keyed on the visitor's IP through the same DO machinery as NO_EMAIL_GATE,
   * so it is a bounded, lifetime counter — not an open endpoint.
   */
  FREE_MESSAGES_BEFORE_EMAIL?: string;
  // Phase 4 — email verification. All optional at the type level so
  // the worker can boot without them set; the chat-send handler
  // degrades gracefully (skips the email send, keeps the 1-msg-
  // lifetime cap) when any required secret is missing.
  //
  // v42a pivot: Resend replaces CF Email Sending — CF rejects
  // recipients at any domain the account doesn't own (error 10202
  // "email.invalid") which is unusable for a public verification flow.
  RESEND_API_KEY?: string;
  VERIFY_TOKEN_SECRET?: string;
  VERIFY_EMAIL_FROM?: string;
  VERIFY_EMAIL_FROM_NAME?: string;
  PUBLIC_BASE_URL?: string;
  // Admin/support reset token. When set, enables POST /api/admin/reset-quota
  // (bearer-guarded) to clear a single email's free-chat quota. When unset,
  // the route 404s (feature disabled). Never logged.
  ADMIN_RESET_TOKEN?: string;
  // Phase 3 — HMAC-signed upstream calls. Optional; when unset, the
  // worker forwards to upstream without the X-Landing-Page-* headers.
  // The matching middleware on the Divinci public-api side ignores
  // requests without the headers UNTIL the release is flipped to
  // "landing-page-only" mode (per PHASE-3-HANDOFF.md). Lets us ship
  // the landing-page side first.
  LANDING_PAGE_HMAC_KEY?: string;
}

const VERIFY_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
// `onboarding@resend.dev` is Resend's sandbox sender — works without
// any DNS setup. Once the customer adds their domain to Resend + lands
// DKIM/SPF, swap via `wrangler secret put VERIFY_EMAIL_FROM`.
const DEFAULT_FROM = "onboarding@resend.dev";
const DEFAULT_FROM_NAME = brand.identity.siteName;

// Note the negated charset rejects whitespace, '@', AND ASCII control
// chars (0x00-0x1F + 0x7F). Earlier version with just [^\s@] allowed
// e.g. "mike@gmail.com\0" to slip through as a distinct hash —
// a trivial way to mint quota variants of a real email.
const EMAIL_RE =
  /^[^\s@\x00-\x1F\x7F]+@[^\s@\x00-\x1F\x7F]+\.[^\s@\x00-\x1F\x7F]+$/;
// RFC 5321 caps practical email length at 254 chars. Anything beyond
// that is almost certainly an abuse attempt + would waste KV/storage.
const MAX_EMAIL_LEN = 254;
const MAX_MESSAGE_LEN = 2000;
// Per-email lifetime budget for conversation-starter sends. Cheap (cached
// via CF AI Gateway) + the engagement hook, so it's separate from and more
// generous than the single lifetime manual message. Bounded per email just
// like the manual gate, so the ceiling stays "N cached questions per email,
// then rotate email" — the same email-rotation ceiling the gate already has.
const STARTER_QUOTA_LIMIT = 6;

export default {
  async fetch(
    request: Request,
    env: Env,
    // Structural, like ASSETS and EMAIL_QUOTA above: the handlers use
    // `waitUntil` and nothing else. Naming Cloudflare's ExecutionContext here
    // would put a Cloudflare type in the signature of the module both hosts
    // share — and force the Vercel entry to cast, which is how a real mismatch
    // gets hidden.
    ctx: WaitUntilContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    // 0. Admin/support quota reset — guarded by its own bearer token, so it
    //    sits BEFORE the Basic-Auth preview gate (the bearer is the stronger
    //    credential and support tooling shouldn't need the preview password).
    if (url.pathname === "/api/admin/reset-quota" && request.method === "POST") {
      return handleAdminReset(request, env);
    }

    // 1. Basic Auth gate
    const authResult = checkBasicAuth(request, env);
    if (!authResult.ok) return authResult.response;

    // 2. Quota-gated chat-send
    if (url.pathname === "/api/chat-send" && request.method === "POST") {
      return handleChatSend(request, env, ctx);
    }

    // 2b. Message feedback (thumbs/feedback) → anonymous-feedback proxy.
    if (url.pathname === "/api/chat-feedback" && request.method === "POST") {
      return handleChatFeedback(request, env);
    }

    // 2c. Terms-of-Service acceptance → public per-release accept proxy.
    if (url.pathname === "/api/terms-accept" && request.method === "POST") {
      return handleTermsAccept(request, env);
    }

    // 3. Magic-link verification landing
    if (url.pathname === "/api/verify-email" && request.method === "GET") {
      return handleVerifyEmail(url, env);
    }

    // 4. Server-side welcome message (translated) for the current locale
    if (url.pathname === "/api/welcome" && request.method === "GET") {
      return handleWelcome(url, env);
    }

    // 4b. Release metadata (the whitelabel's uploaded avatar) for the chat UI.
    if (url.pathname === "/api/release-meta" && request.method === "GET") {
      return handleReleaseMeta(env);
    }

    // 5. Otherwise → static assets
    return assetsOr404(request, env);
  },
};

// ---------- Basic Auth ----------

function checkBasicAuth(
  request: Request,
  env: Env,
): { ok: true } | { ok: false; response: Response } {
  const expected = env.BASIC_AUTH_PASSWORD;
  if (!expected) return { ok: true }; // gate disabled

  const username = env.BASIC_AUTH_USERNAME ?? "preview";
  const header = request.headers.get("Authorization");

  if (header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const sep = decoded.indexOf(":");
      if (sep >= 0) {
        const u = decoded.slice(0, sep);
        const p = decoded.slice(sep + 1);
        if (u === username && constantTimeEq(p, expected)) {
          return { ok: true };
        }
      }
    } catch {
      // fall through
    }
  }

  return {
    ok: false,
    response: new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate":
          `Basic realm="${brand.identity.siteName} preview", charset="UTF-8"`,
        "Cache-Control": "no-store",
      },
    }),
  };
}

/**
 * Hand the request to the static build, or 404 where there is no asset binding.
 *
 * On Cloudflare `ASSETS` serves the Astro output. On Vercel the platform serves
 * it and the function only ever sees /api/*, so the binding is absent — and a
 * bare `env.ASSETS.fetch` there is a TypeError, not a fallthrough.
 *
 * ⚠️ That is reachable, not theoretical: `handleAdminReset` falls through to
 * assets when ADMIN_RESET_TOKEN is unset (which it is on every demo), so a
 * probe of /api/admin/reset-quota would have returned 500 on Vercel instead of
 * looking like nothing is there.
 */
function assetsOr404(request: Request, env: Env): Response | Promise<Response> {
  if (env.ASSETS) return env.ASSETS.fetch(request);
  return new Response("Not found", { status: 404 });
}

/**
 * The visitor's IP, whichever edge we are running on.
 *
 * ⚠️ This is the QUOTA KEY whenever no email is collected — NO_EMAIL_GATE, and
 * the anonymous grace window. Returning a constant would give every visitor on
 * the internet the SAME identity and therefore a single shared budget: the
 * first few visitors would spend it and everyone after them would be refused,
 * with nothing in the logs to say why.
 *
 * `CF-Connecting-IP` is set by Cloudflare and `X-Vercel-Forwarded-For` by
 * Vercel; both are stamped BY the platform and cannot be spoofed by the client.
 * `X-Forwarded-For` is last and only its FIRST entry is taken — a client can
 * prepend to it, but the platform appends the real address, so the first hop is
 * the closest thing to trustworthy when the other two are absent.
 */
export function clientIp(request: Request): string {
  // ⚠️ PLATFORM-SET HEADERS ONLY. Both of these are stamped by the edge and
  // overwrite anything the client sent; `X-Forwarded-For` and `X-Real-IP` are
  // not, and an earlier version of this function fell back to them.
  //
  // That fallback was a quota bypass. This value IS the quota key whenever no
  // email is collected, so a visitor who can choose it gets unlimited free
  // messages by rotating a header — defeating the entire reason the
  // synthesized-identity machinery exists. It was unreachable on both
  // supported platforms, which is exactly what would have made it survive.
  //
  // Returning "unknown" is the SAFE direction: every visitor without a
  // platform header collapses onto one identity and therefore one shared
  // budget, so an unrecognised deployment refuses rather than over-serves.
  const platform =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Vercel-Forwarded-For");
  const first = platform?.split(",")[0]?.trim();
  return first || "unknown";
}

// ---------- /api/chat-send ----------
//
// The Divinci /ai-chat/anonymous-chat endpoint is stateless and single-
// shot: client sends { releaseId, prevSigniture, newPrompt, transcript },
// server returns { transcript, signiture } with the new exchange appended.
// There is no separate "create thread" step. We mirror that shape end-to-
// end and gate exactly one call per email per lifetime via KV.

interface ChatSendBody {
  email?: unknown;
  newPrompt?: unknown;
  /** Optional response-language request from a localized landing page. */
  language?: unknown;
  /**
   * Rolling signed conversation so the upstream chat is multi-turn:
   * `transcript` is the full prior exchange list the client accumulated,
   * `prevSigniture` is the signature the upstream returned for it. The
   * upstream verifies the signature, appends the new turn, and returns a
   * fresh transcript+signature. Empty/"" on the first message.
   */
  transcript?: unknown;
  prevSigniture?: unknown;
  /**
   * Stable per-visitor session id — forwarded so the upstream persists the
   * whole conversation as one customer chat (analytics + feedback links).
   */
  sessionId?: unknown;
  /**
   * True when this message originated from a tap on a built-in
   * conversation-starter pill. Starter questions are cached via the
   * Cloudflare AI Gateway, so they use a separate, more-generous per-email
   * budget and never consume the single lifetime manual message.
   */
  starter?: unknown;
}

/**
 * Clamp a browser-supplied session id before signing/forwarding it upstream:
 * 8–128 chars of [A-Za-z0-9_-] (covers crypto.randomUUID() and the s_<ts>_<rand>
 * fallback). Mirrors the upstream's authoritative validation — without this an
 * arbitrary-length/charset string would get HMAC-signed and forwarded.
 */
function validSessionId(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const id = raw.trim();
  return /^[A-Za-z0-9_-]{8,128}$/.test(id) ? id : undefined;
}

async function handleChatSend(
  request: Request,
  env: Env,
  ctx: WaitUntilContext,
): Promise<Response> {
  let body: ChatSendBody;
  try {
    const text = await request.text();
    const parsed = text ? JSON.parse(text) : {};
    // JSON.parse happily returns null, primitives, or arrays. Accessing
    // `.email` on null would throw an uncaught TypeError → 500 leak.
    // Reject everything that isn't a plain object up front.
    if (
      parsed === null ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return json(400, { error: "invalid_json" });
    }
    body = parsed as ChatSendBody;
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const gateOff = env.NO_EMAIL_GATE === "1";
  // NO_EMAIL_GATE: this demo collects no address, but the quota below is keyed
  // on one -- the email hash IS the abuse control ("N free messages, then
  // rotate email"). Dropping the field without replacing the key would leave
  // an uncapped anonymous LLM endpoint on the public internet. So derive a
  // stable per-visitor identity from the CF edge IP and let the existing
  // hash/DO machinery work unchanged.
  //
  // `.invalid` is reserved by RFC 2606 and can never receive mail, so the
  // verification path can never send to a synthesized address even if this
  // worker is later given the email-sending secrets.
  const suppliedEmail = typeof body.email === "string" ? body.email : "";
  const synthesizedEmail =
    "anon-" +
    clientIp(request).replace(/[^a-zA-Z0-9]/g, "-").slice(0, 60) +
    "@demo.invalid";
  // ANONYMOUS GRACE WINDOW. Distinct from NO_EMAIL_GATE: this demo DOES
  // collect an address, just not before the visitor has seen it work. Until
  // the grace is spent, an empty email is legitimate and is keyed on the same
  // synthesized per-IP identity, so the existing hash/DO quota machinery
  // applies unchanged. Once spent, the worker refuses with `email_required`
  // and the client reveals the field.
  const graceLimit = Math.max(0, Number(env.FREE_MESSAGES_BEFORE_EMAIL ?? "3") || 0);
  const anonymousGrace = !gateOff && graceLimit > 0 && suppliedEmail.trim().length === 0;
  const rawEmail =
    (gateOff || anonymousGrace) && suppliedEmail.trim().length === 0
      ? synthesizedEmail
      : suppliedEmail;
  const newPrompt = typeof body.newPrompt === "string" ? body.newPrompt : "";
  // Response language is allowlist-validated server-side; forward as-is.
  const language = typeof body.language === "string" ? body.language : undefined;
  const isStarter = body.starter === true;
  // Rolling signed conversation: forward the client-accumulated transcript +
  // its signature so the upstream chat is multi-turn (the AI sees prior
  // context) and the full conversation can be persisted. Empty on turn one.
  const priorTranscript = Array.isArray(body.transcript) ? body.transcript : [];
  const prevSigniture =
    typeof body.prevSigniture === "string" ? body.prevSigniture : "";
  // Stable session id for upstream conversation persistence. Browser-supplied,
  // so clamp before signing/forwarding (the upstream validates again,
  // authoritatively — this is defense-in-depth at the edge).
  const sessionId = validSessionId(body.sessionId);

  // Reject obviously-abusive email lengths BEFORE the regex test so we
  // don't burn CPU validating multi-MB strings.
  if (rawEmail.length > MAX_EMAIL_LEN) {
    return json(400, { error: "email_invalid" });
  }

  // Canonicalize before hashing so Gmail-style aliases
  // (`mike@gmail.com`, `m.ike+tag@googlemail.com`, etc.) collapse into
  // a single KV slot. Normalization is applied to the SHA-256 input
  // only; the visitor still sees their original email in logs/UI.
  const normalizedEmail = normalizeEmail(rawEmail);

  // Format + disposable checks run against the normalized form so
  // every variant of the same email gets the same yes/no decision.
  if (!EMAIL_RE.test(normalizedEmail)) {
    return json(400, { error: "email_invalid" });
  }
  if (isDisposableEmail(normalizedEmail)) {
    return json(400, { error: "email_disposable" });
  }
  const email = normalizedEmail;
  if (!newPrompt.trim()) {
    return json(400, { error: "prompt_required" });
  }
  if (newPrompt.length > MAX_MESSAGE_LEN) {
    return json(400, { error: "message_too_long" });
  }

  // Quota: hash the normalized email so we never store raw PII anywhere.
  const hash = await sha256(email);
  const domain = email.slice(email.lastIndexOf("@") + 1);
  const kvKey = `email:${hash}`;
  const stub = env.QUOTA_DO.getByName(hash);

  // `freshClaim` marks a first-ever MANUAL claim — the only state that
  // (a) dispatches a verification email on success and (b) is rolled back
  // if the upstream call fails, so a transient 502/403 never burns the
  // visitor's one free message. Starter sends draw on a separate budget
  // and leave the manual claim untouched.
  let isVerifiedSend = false;
  let freshClaim = false;

  // With no email to rotate, the lifetime-1 manual gate would give a reviewer a
  // single question, and the identity is now an IP -- so an office behind one
  // NAT shares it. In demo mode every send draws on one per-visitor budget.
  const demoQuota = Math.max(1, Number(env.DEMO_QUOTA_LIMIT ?? "500") || 500);
  if (isStarter || gateOff || anonymousGrace) {
    // Conversation-starter leniency: cheap cached questions get their own
    // per-email budget and do NOT consume the single manual message.
    //
    // The anonymous grace window rides the same counter deliberately: a
    // visitor who has not identified themselves gets `graceLimit` sends TOTAL,
    // whether they tap a starter or type. Giving starters a separate budget
    // here would let an unidentified caller spend both.
    const limit = gateOff ? demoQuota : anonymousGrace ? graceLimit : STARTER_QUOTA_LIMIT;
    const s = await stub.claimStarter(limit);
    if (!s.allowed) {
      if (anonymousGrace) {
        console.info("[chat-send] grace_exhausted — asking for email", {
          hash: hash.slice(0, 12),
          used: s.used,
          limit: s.limit,
        });
        // 402 + `email_required` is the signal the client watches for to
        // reveal the address field. It is NOT an error state for the visitor:
        // they have had their free look and are being asked to continue.
        return json(402, {
          error: "email_required",
          message: `Enter your email to keep chatting with the ${brand.identity.productName}.`,
          used: s.used,
          limit: s.limit,
        });
      }
      console.info("[chat-send] starter_quota_exhausted (DO)", {
        hash: hash.slice(0, 12),
        domain,
        used: s.used,
        limit: s.limit,
      });
      return json(402, {
        error: "starter_quota_exhausted",
        message:
          `You've explored the sample questions — ask your own question to use your free message, or sign up at ${brand.identity.siteName}.`,
        used: s.used,
        limit: s.limit,
      });
    }
  } else {
    // Two-layer manual gate during the KV→DO transition:
    //   1. KV fast-path read for legacy entries (pre-Phase-2 visitors).
    //      Read-only; we never write KV again from here.
    //   2. Durable Object atomic claim (the source of truth).
    // Optional: the legacy KV fast path exists only on Cloudflare, and only
    // until the two-week removal window after Phase 2 closes. Absent (Vercel),
    // the Durable-Object-shaped store below is the sole source of truth — which
    // it already is on Cloudflare too, since KV became read-only.
    const legacyKv = env.EMAIL_QUOTA ? await env.EMAIL_QUOTA.get(kvKey) : null;
    if (legacyKv) {
      console.info("[chat-send] quota_exhausted (legacy KV)", {
        hash: hash.slice(0, 12),
        domain,
      });
      return json(402, {
        error: "quota_exhausted",
        message:
          `You've already used your free message. Sign up at ${brand.identity.siteName} to continue.`,
      });
    }

    const claim = await stub.claim(hash, domain);
    // Phase 4 state machine:
    //   - claim.allowed=true  → first-ever chat for this email; let it
    //     through + queue a verification email.
    //   - claim.allowed=false + priorVerified=false → unverified visitor
    //     out of their lifetime budget; 402 with hint to check email.
    //   - claim.allowed=false + priorVerified=true → check the rolling
    //     5-per-24h window. If allowed, let it through + record the send
    //     after the upstream call. If exhausted, 402.
    if (!claim.allowed) {
      if (claim.priorVerified) {
        const v = await stub.canSendVerified(hash);
        if (!v.allowed) {
          console.info("[chat-send] verified_window_exhausted (DO)", {
            hash: hash.slice(0, 12),
            domain,
            sentInWindow: v.sentInWindow,
            windowMax: v.windowMax,
            reason: v.reason,
          });
          return json(402, {
            error: "verified_window_exhausted",
            message:
              `You've used your 5 verified messages for the day. Sign up at ${brand.identity.siteName} to keep chatting.`,
            sentInWindow: v.sentInWindow,
            windowMax: v.windowMax,
          });
        }
        isVerifiedSend = true;
      } else {
        console.info("[chat-send] quota_exhausted (DO, unverified)", {
          hash: hash.slice(0, 12),
          domain,
          priorClaimedAt: claim.priorClaimedAt,
        });
        // While Phase 4's verification email is paused pending the
        // platform-standardization migration, omit the "check your
        // email" hint — no email is actually sent without
        // RESEND_API_KEY + VERIFY_TOKEN_SECRET both set.
        const verificationConfigured = Boolean(
          env.RESEND_API_KEY && env.VERIFY_TOKEN_SECRET,
        );
        return json(402, {
          error: "quota_exhausted",
          message: verificationConfigured
            ? `You've already used your free message. Check your email to confirm + unlock 5 more, or sign up at ${brand.identity.siteName}.`
            : `You've already used your free message. Sign up at ${brand.identity.siteName} to continue.`,
        });
      }
    } else {
      freshClaim = true;
    }
  }

  // Forward to Divinci anonymous-chat — stateless, single-shot.
  // Phase 3: stamp the request with HMAC headers so the upstream can
  // reject direct-curl bypasses. computeUpstreamHmacHeaders returns
  // null when LANDING_PAGE_HMAC_KEY is unset → we skip the headers
  // and the upstream behaves as before.
  const hmacHeaders = await computeUpstreamHmacHeaders({
    hmacKey: env.LANDING_PAGE_HMAC_KEY,
    releaseId: env.DIVINCI_RELEASE_ID,
    newPrompt,
  });
  // Deliberately NO Origin header. This is a server-to-server call (Worker →
  // Divinci API), so CORS — a browser mechanism — doesn't apply. The API allows
  // requests with no Origin and gates this endpoint on the HMAC signature
  // instead, so omitting Origin means ANY deployment (localhost, any customer
  // domain) works with zero per-origin allowlisting. Sending the Worker's own
  // Origin (the previous approach) forced every new customer/domain onto the
  // API's CORS_FULL_ORIGINS list — which doesn't scale. Don't add it back.
  let upstream: Response;
  try {
    upstream = await fetch(
      `${env.DIVINCI_API_BASE}/ai-chat/anonymous-chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(hmacHeaders ?? {}),
        },
        body: JSON.stringify({
          releaseId: env.DIVINCI_RELEASE_ID,
          prevSigniture,
          newPrompt: newPrompt,
          transcript: priorTranscript,
          ...(language ? { language } : {}),
          ...(sessionId ? { sessionId } : {}),
        }),
      },
    );
  } catch (err) {
    console.error("[chat-send] upstream_fetch_failed", {
      message: err instanceof Error ? err.message : String(err),
    });
    // Roll back a fresh manual claim so a transient upstream failure
    // doesn't burn the visitor's one free message — they can retry.
    if (freshClaim) await stub.releaseClaim(hash);
    return json(502, { error: "upstream_unreachable" });
  }

  const upstreamText = await upstream.text();
  if (!upstream.ok) {
    // Terms-of-Service gate: the release requires the visitor to accept a
    // published ToS/medical-disclaimer version before chatting. Pass the gate
    // payload through (tosId/version/title/content) so the chat island can
    // render the acceptance modal — a generic 502 here would just look broken.
    // The fresh claim is released: the visitor hasn't actually chatted, and
    // their post-accept retry will claim again.
    if (upstream.status === 403) {
      try {
        const parsed = JSON.parse(upstreamText) as {
          error?: { code?: string, details?: unknown, message?: string },
        };
        if (parsed?.error?.code === "TERMS_NOT_ACCEPTED") {
          if (freshClaim) await stub.releaseClaim(hash);
          return json(403, parsed);
        }
      } catch {
        // fall through to the generic upstream_error below
      }
    }
    // The Divinci-side anonymous-message cap (400, "Max number of messages
    // reached." — the phrase lands in `message` on some paths and `context`
    // on others, so match the whole body). Flattening this to 502 told the
    // visitor their NETWORK had failed, when in fact they had simply run out
    // of free messages and had a real next step available: sign in.
    if (upstream.status === 400 && /max number of messages reached/i.test(upstreamText)) {
      console.info("[chat-send] anon_limit_reached");
      if (freshClaim) await stub.releaseClaim(hash);
      return json(409, { error: "anon_limit_reached" });
    }
    // Upstream rate limiting. Within one release, every Worker-fronted visitor
    // shares a bucket (the visitor IP is invisible to the API), so a busy demo
    // can 429 an unrelated visitor. That is "try again shortly", not an outage,
    // and it must not read as one.
    if (upstream.status === 429) {
      const retryAfterSeconds = Number(upstream.headers.get("Retry-After")) || undefined;
      console.info("[chat-send] rate_limited", { retryAfterSeconds });
      if (freshClaim) await stub.releaseClaim(hash);
      return json(429, {
        error: "rate_limited",
        ...(retryAfterSeconds ? { retryAfterSeconds } : {}),
      });
    }
    console.error("[chat-send] upstream_non_ok", {
      status: upstream.status,
      body: upstreamText.slice(0, 300),
    });
    if (freshClaim) await stub.releaseClaim(hash);
    // Everything else is ours to fix, not the visitor's. Pass 5xx through as
    // 502 (the island words it as a server fault, not a network one).
    return json(502, { error: "upstream_error" });
  }

  let result: { transcript?: unknown; signiture?: unknown };
  try {
    result = JSON.parse(upstreamText);
  } catch {
    if (freshClaim) await stub.releaseClaim(hash);
    return json(502, { error: "upstream_parse_failed" });
  }

  // Quota was already written into the DO above (before the upstream
  // call) — that's the price of atomicity. If the upstream returned 200
  // we're done. If it returned non-200, we don't roll back the claim;
  // a successful claim + failed upstream means the visitor effectively
  // used their free message even though they didn't get a reply. We
  // accept that trade for the stronger atomicity story; the client
  // surfaces an error toast and the user can sign up to retry.
  //
  // Verified-window sends DO get recorded AFTER the upstream 200, since
  // the rolling 24h log isn't constrained by the atomicity story —
  // each row is independent.

  if (isVerifiedSend) {
    try {
      await stub.recordVerifiedSend();
    } catch (err) {
      // Logging only — the user got their response; failing to record
      // would mean they get one extra free send. Acceptable.
      console.error("[chat-send] recordVerifiedSend_failed", {
        hash: hash.slice(0, 12),
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // First-ever MANUAL chat: queue a verification email. ctx.waitUntil keeps
  // the response fast — we don't block on CF email API latency.
  if (freshClaim) {
    const dispatched = await dispatchVerificationEmail({
      request,
      env,
      ctx,
      rawEmail,
      emailHash: hash,
    });
    console.info("[chat-send] allowed", {
      hash: hash.slice(0, 12),
      domain,
      verificationEmailDispatched: dispatched,
    });
  } else if (isStarter) {
    console.info("[chat-send] allowed (starter)", {
      hash: hash.slice(0, 12),
      domain,
    });
  } else {
    console.info("[chat-send] allowed (verified-window)", {
      hash: hash.slice(0, 12),
      domain,
    });
  }

  return json(200, result);
}

// ---------- /api/chat-feedback ----------
//
// Thumbs/feedback for one assistant reply. Forwards to Divinci's
// /ai-chat/anonymous-feedback with the configured release id + the client's
// held signed transcript. No HMAC and no quota — feedback isn't gated; the
// upstream verifies the transcript signature and rate-limits per IP. Routing
// through the worker (vs a browser→api.stage call) keeps the "all chat traffic
// flows through the worker" invariant and dodges the www/staging CORS gap.
async function handleChatFeedback(request: Request, env: Env): Promise<Response> {
  if (!env.DIVINCI_API_BASE || !env.DIVINCI_RELEASE_ID) {
    return json(500, { error: "not_configured" });
  }
  let body: {
    transcript?: unknown;
    signiture?: unknown;
    messageIndex?: unknown;
    sentiment?: unknown;
    feedback?: unknown;
    email?: unknown;
    sessionId?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }
  if (!Array.isArray(body.transcript) || typeof body.signiture !== "string") {
    return json(400, { error: "transcript_and_signiture_required" });
  }
  if (
    typeof body.messageIndex !== "number" ||
    !Number.isInteger(body.messageIndex) ||
    body.messageIndex < 0
  ) {
    return json(400, { error: "message_index_invalid" });
  }
  const sentiment =
    body.sentiment === -1 || body.sentiment === 1 ? body.sentiment : undefined;
  const feedback =
    typeof body.feedback === "string" ? body.feedback.slice(0, 2000) : undefined;
  if (sentiment === undefined && feedback === undefined) {
    return json(400, { error: "sentiment_or_feedback_required" });
  }
  // The gate email, forwarded so the admin can see who left the feedback.
  const email =
    typeof body.email === "string" ? body.email.slice(0, 254) : undefined;
  // Stable session id so the upstream upserts/links the persisted chat.
  // Clamped like chat-send (browser-supplied; upstream re-validates).
  const sessionId = validSessionId(body.sessionId);

  let upstream: Response;
  try {
    upstream = await fetch(`${env.DIVINCI_API_BASE}/ai-chat/anonymous-feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        releaseId: env.DIVINCI_RELEASE_ID,
        transcript: body.transcript,
        signiture: body.signiture,
        messageIndex: body.messageIndex,
        ...(sentiment !== undefined ? { sentiment } : {}),
        ...(feedback !== undefined ? { feedback } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(sessionId ? { sessionId } : {}),
      }),
    });
  } catch {
    return json(502, { error: "upstream_unreachable" });
  }

  const text = await upstream.text();
  if (!upstream.ok) {
    return json(upstream.status, { error: "upstream_error", detail: text.slice(0, 200) });
  }
  try {
    return json(200, JSON.parse(text));
  } catch {
    return json(200, { ok: true });
  }
}

// ---------- /api/release-meta (release avatar for the chat UI) ----------
//
// The chat island shows the Release's uploaded avatar (the whitelabel
// picture) instead of a hardcoded placeholder logo. The upstream
// `GET /white-label-release/:id` endpoint is public; this proxy trims it to
// just what the UI needs and lets the edge cache it briefly.

async function handleReleaseMeta(env: Env): Promise<Response> {
  if (!env.DIVINCI_API_BASE || !env.DIVINCI_RELEASE_ID) {
    return json(200, { avatarUrl: null });
  }
  let upstream: Response;
  try {
    upstream = await fetch(
      `${env.DIVINCI_API_BASE}/white-label-release/${env.DIVINCI_RELEASE_ID}`,
    );
  } catch {
    return json(200, { avatarUrl: null });
  }
  if (!upstream.ok) return json(200, { avatarUrl: null });
  let avatarUrl: string | null = null;
  try {
    const doc = (await upstream.json()) as { _whitelabelPicture?: unknown };
    // Only pass through an https URL — this lands in an <img src>.
    if (
      typeof doc._whitelabelPicture === "string" &&
      /^https:\/\//.test(doc._whitelabelPicture)
    ) {
      avatarUrl = doc._whitelabelPicture;
    }
  } catch {
    // fall through with null
  }
  return new Response(JSON.stringify({ avatarUrl }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // The avatar changes rarely — let browsers/edge cache it briefly.
      "Cache-Control": "public, max-age=300",
    },
  });
}

// ---------- /api/terms-accept (Terms of Service acceptance) ----------
//
// Records the visitor's acceptance of the release's published Terms of
// Service / medical-disclaimer version, keyed to their anonymous sessionId
// (the same identity the chat persists under). Proxies the Divinci public
// per-release accept endpoint server-to-server (no Origin — HMAC isn't
// needed here; the endpoint is public + rate-limited upstream).

async function handleTermsAccept(request: Request, env: Env): Promise<Response> {
  if (!env.DIVINCI_API_BASE || !env.DIVINCI_RELEASE_ID) {
    return json(500, { error: "not_configured" });
  }
  let body: { tosId?: unknown, version?: unknown, sessionId?: unknown };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }
  const tosId = typeof body.tosId === "string" ? body.tosId : "";
  const version = typeof body.version === "number" ? body.version : NaN;
  const sessionId = validSessionId(body.sessionId);
  if (!tosId || !Number.isInteger(version) || version <= 0 || !sessionId) {
    return json(400, { error: "tos_accept_fields_invalid" });
  }

  let upstream: Response;
  try {
    upstream = await fetch(
      `${env.DIVINCI_API_BASE}/white-label-release/${env.DIVINCI_RELEASE_ID}/terms-of-service/accept`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tosId, version, anonymousSessionId: sessionId }),
      },
    );
  } catch {
    return json(502, { error: "upstream_unreachable" });
  }
  const text = await upstream.text();
  try {
    return json(upstream.status, JSON.parse(text));
  } catch {
    return json(upstream.ok ? 200 : upstream.status, { ok: upstream.ok });
  }
}

// ---------- /api/admin/reset-quota (support tooling) ----------
//
// Clears one email's free-chat quota (manual lifetime claim + starter
// budget + legacy KV entry) so a visitor can start fresh. Guarded by a
// bearer token in ADMIN_RESET_TOKEN; 404 when the token isn't configured
// so the surface is invisible unless deliberately enabled.

async function handleAdminReset(request: Request, env: Env): Promise<Response> {
  const token = env.ADMIN_RESET_TOKEN;
  // Feature disabled → behave as if the route doesn't exist.
  if (!token) return assetsOr404(request, env);

  const header = request.headers.get("Authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!provided || !constantTimeEq(provided, token)) {
    return json(401, { error: "unauthorized" });
  }

  let body: { email?: unknown };
  try {
    const text = await request.text();
    const parsed = text ? JSON.parse(text) : {};
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return json(400, { error: "invalid_json" });
    }
    body = parsed as { email?: unknown };
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const rawEmail = typeof body.email === "string" ? body.email : "";
  if (!rawEmail || rawEmail.length > MAX_EMAIL_LEN) {
    return json(400, { error: "email_invalid" });
  }
  // Hash the SAME way the quota path does (normalize → SHA-256) so the
  // reset targets the exact DO instance the gate uses.
  const normalizedEmail = normalizeEmail(rawEmail);
  if (!EMAIL_RE.test(normalizedEmail)) {
    return json(400, { error: "email_invalid" });
  }
  const hash = await sha256(normalizedEmail);
  const domain = normalizedEmail.slice(normalizedEmail.lastIndexOf("@") + 1);

  // Clear the legacy KV fast-path entry too (pre-Phase-2 burns live there).
  await env.EMAIL_QUOTA?.delete(`email:${hash}`);
  const stub = env.QUOTA_DO.getByName(hash);
  const result = await stub.adminReset(hash);

  console.info("[admin-reset] quota cleared", {
    hash: hash.slice(0, 12),
    domain,
    clearedClaim: result.clearedClaim,
    clearedStarter: result.clearedStarter,
  });
  return json(200, { ok: true, ...result });
}

// ---------- /api/welcome (server-side translated welcome) ----------

/**
 * Proxy the platform's public welcome endpoint, with the release id
 * baked in server-side, so the chat can render the server-managed (and
 * translated) opener for the current locale. Any failure soft-falls-back
 * to an empty list — the client then uses its own default welcome, so a
 * release without configured welcome messages (or an upstream blip) never
 * breaks the page.
 */
async function handleWelcome(url: URL, env: Env): Promise<Response> {
  const language =
    url.searchParams.get("language") ?? url.searchParams.get("lang") ?? "";
  if (!env.DIVINCI_API_BASE || !env.DIVINCI_RELEASE_ID) {
    return json(200, { messages: [] });
  }
  const qs = new URLSearchParams({ releaseId: env.DIVINCI_RELEASE_ID });
  if (language) qs.set("language", language);

  let upstream: Response;
  try {
    upstream = await fetch(
      `${env.DIVINCI_API_BASE}/ai-chat/free-chat-gate/welcome?${qs}`,
    );
  } catch (err) {
    console.warn("[welcome] upstream_fetch_failed", { msg: String(err) });
    return json(200, { messages: [] });
  }
  const text = await upstream.text();
  if (!upstream.ok) {
    console.warn("[welcome] upstream_non_ok", { status: upstream.status });
    return json(200, { messages: [] });
  }
  try {
    return json(200, text ? JSON.parse(text) : { messages: [] });
  } catch {
    return json(200, { messages: [] });
  }
}

// ---------- /api/verify-email (magic-link landing) ----------

async function handleVerifyEmail(url: URL, env: Env): Promise<Response> {
  const secret = env.VERIFY_TOKEN_SECRET;
  if (!secret) {
    // Misconfigured — don't leak that to the user, just refuse cleanly.
    console.error("[verify-email] VERIFY_TOKEN_SECRET not set");
    return htmlResponse(500, renderVerifyFailureHtml("server_misconfigured"));
  }
  const token = url.searchParams.get("token") ?? "";
  const result = await verifyVerifyToken(secret, token);
  if (!result.ok) {
    console.info("[verify-email] token_rejected", { reason: result.reason });
    return htmlResponse(400, renderVerifyFailureHtml(result.reason));
  }
  const stub = env.QUOTA_DO.getByName(result.emailHash);
  const mark = await stub.markVerified(result.emailHash);
  if (!mark.ok) {
    console.info("[verify-email] mark_failed", { reason: mark.reason });
    return htmlResponse(404, renderVerifyFailureHtml(mark.reason ?? "unknown"));
  }
  console.info("[verify-email] success", {
    hash: result.emailHash.slice(0, 12),
  });
  return htmlResponse(200, renderVerifySuccessHtml());
}

// ---------- Verification email dispatcher ----------

interface DispatchVerifyEmailArgs {
  request: Request;
  env: Env;
  ctx: WaitUntilContext;
  rawEmail: string;
  emailHash: string;
}

/**
 * Signs the magic-link token and queues a CF Email Sending REST call.
 * Returns true if the dispatch was attempted (token + send queued),
 * false if config was incomplete (logs a warning and falls through —
 * the chat response is unaffected).
 *
 * The fetch itself runs inside `ctx.waitUntil()` so the visitor's
 * chat response isn't gated on email-delivery latency. Failures are
 * logged but never surfaced to the visitor.
 */
async function dispatchVerificationEmail({
  request,
  env,
  ctx,
  rawEmail,
  emailHash,
}: DispatchVerifyEmailArgs): Promise<boolean> {
  const apiKey = env.RESEND_API_KEY;
  const tokenSecret = env.VERIFY_TOKEN_SECRET;
  if (!apiKey || !tokenSecret) {
    console.warn("[verify-email] dispatch_skipped_unconfigured", {
      hasResendKey: Boolean(apiKey),
      hasTokenSecret: Boolean(tokenSecret),
    });
    return false;
  }
  const signed = await signVerifyToken(
    tokenSecret,
    emailHash,
    VERIFY_TOKEN_TTL_SECONDS,
  );
  const base = env.PUBLIC_BASE_URL ?? new URL(request.url).origin;
  const verifyUrl = `${base.replace(/\/+$/, "")}/api/verify-email?token=${signed.token}`;
  const ttlHours = Math.round(VERIFY_TOKEN_TTL_SECONDS / 3600);

  ctx.waitUntil(
    (async () => {
      const result = await sendResendEmail({
        apiKey,
        from: env.VERIFY_EMAIL_FROM ?? DEFAULT_FROM,
        fromName: env.VERIFY_EMAIL_FROM_NAME ?? DEFAULT_FROM_NAME,
        to: rawEmail, // visitor's typed-form email, not normalized
        subject: `Confirm your email — ${brand.identity.siteName}`,
        text: renderVerifyEmailText({ verifyUrl, ttlHours }),
        html: renderVerifyEmailHtml({ verifyUrl, ttlHours }),
      });
      if (!result.ok) {
        console.error("[verify-email] send_failed", {
          status: result.status,
          body: result.bodyExcerpt,
        });
      } else {
        console.info("[verify-email] send_ok", { messageId: result.messageId });
      }
    })(),
  );
  return true;
}

// ---------- helpers ----------

function constantTimeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function sha256(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function htmlResponse(status: number, body: string): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
