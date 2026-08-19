import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import middleware, { config } from "../../middleware";

/**
 * End-to-end through the Vercel entry point, with the upstream and the quota
 * store both stubbed at `fetch`.
 *
 * ── The golden vector ───────────────────────────────────────────────────────
 *
 * GOLDEN_SIG below was produced by the SERVER's own signer —
 * `signLandingPagePayload` in
 * workspace/servers/public-api/src/middleware/verify-landing-page-hmac.ts,
 * which is `node:crypto` `createHmac("sha256", key).update(payload)` — and NOT
 * by this repo's code. That is the entire point: it pins the middleware against
 * the implementation that will actually verify it in production, so a change to
 * the payload shape, the encoding, or the hash fails HERE rather than as
 * "every message is refused" on a customer's demo.
 *
 * Parity was verified across an empty prompt, a prompt containing dots, and a
 * non-ASCII key and prompt (UTF-8 encoding agreement between node:crypto and
 * Web Crypto is not free — it is the thing most likely to differ).
 */
const KEY = "test-key-1";
const RELEASE = "6a1b2c3d4e5f60718293a4b5";
const PROMPT = "What does this company do?";
const TS = 1755600000;
const GOLDEN_SIG = "137d5b1ebb3d198ca469901aa8c9967b443cd406f71739f88baa763c470180e0";

const KV = { KV_REST_API_URL: "https://kv.test", KV_REST_API_TOKEN: "kvtoken" };

/** Routes stubbed fetch to the quota store or the upstream API. */
function stubNetwork() {
  const redis = new Map<string, string>();
  const upstreamCalls: { url: string; headers: Headers; body: unknown }[] = [];

  const impl = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.startsWith("https://kv.test")) {
      const args = JSON.parse(String(init?.body ?? "[]")).map(String);
      const [op, key] = args;
      if (op === "SET") {
        if (args.includes("NX") && redis.has(key)) return Response.json({ result: null });
        redis.set(key, args[2]);
        return Response.json({ result: "OK" });
      }
      if (op === "GET") return Response.json({ result: redis.get(key) ?? null });
      if (op === "DEL") { const had = redis.delete(key); return Response.json({ result: had ? 1 : 0 }); }
      if (op === "INCR") { const n = Number(redis.get(key) ?? "0") + 1; redis.set(key, String(n)); return Response.json({ result: n }); }
      if (op === "DECR") { const n = Number(redis.get(key) ?? "0") - 1; redis.set(key, String(n)); return Response.json({ result: n }); }
      if (op === "EXPIRE") return Response.json({ result: 1 });
      throw new Error(`unstubbed redis op ${op}`);
    }
    upstreamCalls.push({
      url,
      headers: new Headers(init?.headers as HeadersInit),
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    return Response.json({ transcript: [{ role: "assistant", content: "hi" }], signiture: "s" });
  };
  vi.stubGlobal("fetch", vi.fn(impl));
  return { upstreamCalls, redis };
}

function chatSend(email = "visitor@example.com", newPrompt = PROMPT) {
  return new Request("https://demo.vercel.app/api/chat-send", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.9" },
    body: JSON.stringify({ email, newPrompt }),
  });
}

const ENV = {
  ...KV,
  LANDING_PAGE_HMAC_KEY: KEY,
  DIVINCI_API_BASE: "https://api.divinci.app",
  DIVINCI_RELEASE_ID: RELEASE,
  FREE_MESSAGES_BEFORE_EMAIL: "0",
};

let saved: Record<string, string | undefined>;
beforeEach(() => {
  saved = { ...process.env } as Record<string, string | undefined>;
  for (const k of Object.keys(ENV)) delete (process.env as Record<string, unknown>)[k];
  Object.assign(process.env, ENV);
  vi.useFakeTimers();
  vi.setSystemTime(TS * 1000);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  for (const k of Object.keys(ENV)) delete (process.env as Record<string, unknown>)[k];
  Object.assign(process.env, saved);
});

describe("the middleware signs the way the server verifies", () => {
  it("stamps the exact signature the server's own signer produces", async () => {
    const { upstreamCalls } = stubNetwork();
    const res = await middleware(chatSend());
    expect(res.status).toBe(200);
    expect(upstreamCalls).toHaveLength(1);
    const h = upstreamCalls[0].headers;
    expect(h.get("X-Landing-Page-Ts")).toBe(String(TS));
    expect(h.get("X-Landing-Page-Sig")).toBe(GOLDEN_SIG);
  });

  it("calls the anonymous-chat endpoint with the configured release", async () => {
    const { upstreamCalls } = stubNetwork();
    await middleware(chatSend());
    expect(upstreamCalls[0].url).toBe("https://api.divinci.app/ai-chat/anonymous-chat");
    expect((upstreamCalls[0].body as { releaseId: string }).releaseId).toBe(RELEASE);
  });

  it("signs with the FIRST key during a rotation, not the joined string", async () => {
    // A comma-separated value means "accept both for the cutover". The server
    // tries each key; a signer must pick ONE. Signing with "new,old" matches
    // neither, and the demo goes dark for the length of the rotation with
    // nothing naming the cause.
    process.env.LANDING_PAGE_HMAC_KEY = `${KEY},an-older-key`;
    const { upstreamCalls } = stubNetwork();
    await middleware(chatSend());
    expect(upstreamCalls[0].headers.get("X-Landing-Page-Sig")).toBe(GOLDEN_SIG);
  });

  it("signs the PROMPT, so a snooped (ts,sig) cannot be reused for another", async () => {
    const { upstreamCalls } = stubNetwork();
    await middleware(chatSend("a@example.com", "prompt one"));
    await middleware(chatSend("b@example.com", "prompt two"));
    const [one, two] = upstreamCalls.map((c) => c.headers.get("X-Landing-Page-Sig"));
    expect(one).not.toBe(two);
  });
});

describe("it fails closed rather than serving something broken", () => {
  it("refuses with no quota store, and calls nothing upstream", async () => {
    // No store means no per-email cap — an uncapped anonymous LLM endpoint on
    // the public internet, which is what the gate exists to prevent.
    delete (process.env as Record<string, unknown>).KV_REST_API_URL;
    const { upstreamCalls } = stubNetwork();
    const res = await middleware(chatSend());
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "quota_store_unconfigured" });
    expect(upstreamCalls).toHaveLength(0);
  });

  it("refuses with no signing key, and calls nothing upstream", async () => {
    // Unsigned requests are refused by any release with signing on. Sending
    // them anyway shows the visitor a generic failure and the operator nothing.
    delete (process.env as Record<string, unknown>).LANDING_PAGE_HMAC_KEY;
    const { upstreamCalls } = stubNetwork();
    const res = await middleware(chatSend());
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "landing_page_hmac_unconfigured" });
    expect(upstreamCalls).toHaveLength(0);
  });

  it("treats a whitespace-only key as unset", async () => {
    process.env.LANDING_PAGE_HMAC_KEY = "  ,  ";
    const res = await middleware(chatSend());
    expect(res.status).toBe(503);
  });
});

describe("the quota is enforced on Vercel, not just on Cloudflare", () => {
  it("spends the lifetime claim and refuses the second message", async () => {
    const { upstreamCalls } = stubNetwork();
    expect((await middleware(chatSend("one@example.com"))).status).toBe(200);
    const second = await middleware(chatSend("one@example.com"));
    expect(second.status).toBe(402);
    // The refusal must cost nothing upstream.
    expect(upstreamCalls).toHaveLength(1);
  });

  it("keys per email — one visitor does not spend another's", async () => {
    stubNetwork();
    expect((await middleware(chatSend("a@example.com"))).status).toBe(200);
    expect((await middleware(chatSend("b@example.com"))).status).toBe(200);
  });

  it("rolls the claim back when upstream fails, so the visitor can retry", async () => {
    // The claim is recorded BEFORE the upstream call for atomicity. Without the
    // rollback a transient 502 permanently burns the one free message for a
    // reply that never arrived.
    const redis = new Map<string, string>();
    let failUpstream = true;
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input instanceof Request ? input.url : input);
      if (url.startsWith("https://kv.test")) {
        const a = JSON.parse(String(init?.body ?? "[]")).map(String);
        const [op, key] = a;
        if (op === "SET") {
          if (a.includes("NX") && redis.has(key)) return Response.json({ result: null });
          redis.set(key, a[2]); return Response.json({ result: "OK" });
        }
        if (op === "GET") return Response.json({ result: redis.get(key) ?? null });
        if (op === "DEL") { redis.delete(key); return Response.json({ result: 1 }); }
        if (op === "INCR") { const n = Number(redis.get(key) ?? "0") + 1; redis.set(key, String(n)); return Response.json({ result: n }); }
        if (op === "DECR") { const n = Number(redis.get(key) ?? "0") - 1; redis.set(key, String(n)); return Response.json({ result: n }); }
        return Response.json({ result: 1 });
      }
      if (failUpstream) return new Response("upstream boom", { status: 502 });
      return Response.json({ transcript: [], signiture: "s" });
    }));

    const first = await middleware(chatSend("retry@example.com"));
    expect(first.status).toBeGreaterThanOrEqual(500);
    failUpstream = false;
    // The retry must be allowed — the failed attempt did not burn the quota.
    expect((await middleware(chatSend("retry@example.com"))).status).toBe(200);
  });
});

describe("routing", () => {
  it("only claims the API surface", () => {
    // Everything else is the Astro static build, which Vercel serves natively.
    expect(config.matcher).toEqual(["/api/:path*"]);
    expect(config.runtime).toBe("edge");
  });
});


describe("the routes that have no asset binding on Vercel", () => {
  it("404s the admin reset instead of crashing", async () => {
    // handleAdminReset falls through to ASSETS when ADMIN_RESET_TOKEN is unset
    // — which it is on every demo. On Cloudflare that serves the static 404
    // page; on Vercel there is no binding, and a bare env.ASSETS.fetch is a
    // TypeError. The matcher routes /api/* here, so this IS reachable.
    stubNetwork();
    const res = await middleware(new Request("https://demo.vercel.app/api/admin/reset-quota", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    }));
    expect(res.status).toBe(404);
  });

  it("404s an unknown /api route rather than 500ing", async () => {
    stubNetwork();
    const res = await middleware(new Request("https://demo.vercel.app/api/nope"));
    expect(res.status).toBe(404);
  });
});
