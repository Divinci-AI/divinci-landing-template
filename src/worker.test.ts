import { describe, it, expect, vi } from "vitest";

// We exercise the worker fetch handler end-to-end with a mocked Env so
// the basic-auth gate + quota proxy + KV writes are covered without
// hitting the real upstream.

import workerModule from "./worker";

interface MockKVRecord {
  value: string;
}

class MockKVNamespace {
  store = new Map<string, MockKVRecord>();
  async get(key: string) {
    return this.store.get(key)?.value ?? null;
  }
  async put(key: string, value: string) {
    this.store.set(key, { value });
  }
  async delete(key: string) {
    this.store.delete(key);
  }
}

interface MockClaimRecord {
  domain: string;
  claimedAt: string;
  verified: boolean;
  verifiedAt: string | null;
  /** Unix-second timestamps of sends inside the rolling 24h window. */
  verifiedSends: number[];
}

class MockQuotaDONamespace {
  claims = new Map<string, MockClaimRecord>();
  starterUsed = new Map<string, number>();
  windowMax = 5;
  windowSeconds = 86400;

  getByName(hash: string) {
    const claims = this.claims;
    const starterUsed = this.starterUsed;
    const windowMax = this.windowMax;
    const windowSeconds = this.windowSeconds;
    return {
      claim: async (emailHash: string, emailDomain: string) => {
        const prior = claims.get(emailHash);
        if (prior) {
          return {
            allowed: false,
            priorClaimedAt: prior.claimedAt,
            priorVerified: prior.verified,
          };
        }
        const claimedAt = new Date().toISOString();
        claims.set(emailHash, {
          domain: emailDomain,
          claimedAt,
          verified: false,
          verifiedAt: null,
          verifiedSends: [],
        });
        return { allowed: true, priorVerified: false };
      },
      releaseClaim: async (emailHash: string) => {
        const row = claims.get(emailHash);
        if (!row || row.verified) return { released: false };
        claims.delete(emailHash);
        return { released: true };
      },
      claimStarter: async (limit: number) => {
        const used = starterUsed.get(hash) ?? 0;
        if (used >= limit) return { allowed: false, used, limit };
        starterUsed.set(hash, used + 1);
        return { allowed: true, used: used + 1, limit };
      },
      adminReset: async (emailHash: string) => {
        const clearedClaim = claims.delete(emailHash);
        const clearedStarter = starterUsed.delete(hash);
        return { clearedClaim, clearedStarter };
      },
      markVerified: async (emailHash: string) => {
        const row = claims.get(emailHash);
        if (!row) return { ok: false, reason: "no_prior_claim" as const };
        if (!row.verified) {
          row.verified = true;
          row.verifiedAt = new Date().toISOString();
        }
        return { ok: true };
      },
      canSendVerified: async (
        emailHash: string,
        nowSeconds: number = Math.floor(Date.now() / 1000),
      ) => {
        const row = claims.get(emailHash);
        if (!row) {
          return {
            allowed: false,
            reason: "no_prior_claim" as const,
            sentInWindow: 0,
            windowMax,
          };
        }
        if (!row.verified) {
          return {
            allowed: false,
            reason: "not_verified" as const,
            sentInWindow: 0,
            windowMax,
          };
        }
        const cutoff = nowSeconds - windowSeconds;
        row.verifiedSends = row.verifiedSends.filter((t) => t >= cutoff);
        if (row.verifiedSends.length >= windowMax) {
          return {
            allowed: false,
            reason: "window_exhausted" as const,
            sentInWindow: row.verifiedSends.length,
            windowMax,
          };
        }
        return {
          allowed: true,
          sentInWindow: row.verifiedSends.length,
          windowMax,
        };
      },
      recordVerifiedSend: async (
        nowSeconds: number = Math.floor(Date.now() / 1000),
      ) => {
        // We need a hash; the production DO is per-instance so it
        // doesn't take one. In tests we work around by tracking the
        // last hash seen via the parent map; verified sends are
        // recorded against whichever claim was just queried.
        const row = Array.from(claims.values()).at(-1);
        if (row && row.verified) row.verifiedSends.push(nowSeconds);
      },
    };
  }
}

interface MockEnv {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  EMAIL_QUOTA: MockKVNamespace;
  QUOTA_DO: MockQuotaDONamespace;
  BASIC_AUTH_PASSWORD?: string;
  BASIC_AUTH_USERNAME?: string;
  DIVINCI_API_BASE: string;
  DIVINCI_RELEASE_ID: string;
  RESEND_API_KEY?: string;
  VERIFY_TOKEN_SECRET?: string;
  ADMIN_RESET_TOKEN?: string;
}

function makeEnv(overrides: Partial<MockEnv> = {}): MockEnv {
  return {
    ASSETS: {
      fetch: vi.fn(async () =>
        new Response("ASSETS_BODY", { status: 200, headers: { "Content-Type": "text/html" } }),
      ),
    },
    EMAIL_QUOTA: new MockKVNamespace(),
    QUOTA_DO: new MockQuotaDONamespace(),
    BASIC_AUTH_PASSWORD: "secret-pw",
    BASIC_AUTH_USERNAME: "dfo",
    DIVINCI_API_BASE: "https://api.stage.divinci.app",
    DIVINCI_RELEASE_ID: "rel-abc-123",
    ...overrides,
  };
}

function authHeader(user: string, pass: string) {
  return "Basic " + btoa(`${user}:${pass}`);
}

class MockExecutionContext {
  waited: Array<Promise<unknown>> = [];
  waitUntil(p: Promise<unknown>) {
    this.waited.push(p);
  }
  passThroughOnException() {}
}

// Thin shim so existing `fetchHandler(req, env)` test sites
// continue to work after Phase 4 added an `ctx: ExecutionContext` arg
// to the worker handler. Each call gets its own fresh ctx mock.
const _lastCtx: { ref: MockExecutionContext | null } = { ref: null };
function fetchHandler(req: Request, env: MockEnv): Promise<Response> {
  const ctx = new MockExecutionContext();
  _lastCtx.ref = ctx;
  // @ts-expect-error — partial env / ctx for test
  return workerModule.fetch(req, env, ctx);
}

describe("worker: Basic Auth gate", () => {
  it("returns 401 with no credentials", async () => {
    const env = makeEnv();
    const resp = await fetchHandler(
      new Request("https://x.workers.dev/"),
      // @ts-expect-error — partial env for test
      env,
    );
    expect(resp.status).toBe(401);
    expect(resp.headers.get("www-authenticate")).toContain("Basic");
  });

  it("returns 401 with wrong password", async () => {
    const env = makeEnv();
    const resp = await fetchHandler(
      new Request("https://x.workers.dev/", {
        headers: { Authorization: authHeader("dfo", "wrong") },
      }),
      // @ts-expect-error
      env,
    );
    expect(resp.status).toBe(401);
  });

  it("returns 401 with wrong username", async () => {
    const env = makeEnv();
    const resp = await fetchHandler(
      new Request("https://x.workers.dev/", {
        headers: { Authorization: authHeader("admin", "secret-pw") },
      }),
      // @ts-expect-error
      env,
    );
    expect(resp.status).toBe(401);
  });

  it("passes through to ASSETS with valid credentials", async () => {
    const env = makeEnv();
    const resp = await fetchHandler(
      new Request("https://x.workers.dev/", {
        headers: { Authorization: authHeader("dfo", "secret-pw") },
      }),
      // @ts-expect-error
      env,
    );
    expect(resp.status).toBe(200);
    expect(await resp.text()).toBe("ASSETS_BODY");
    expect(env.ASSETS.fetch).toHaveBeenCalledOnce();
  });

  it("failsafe: BASIC_AUTH_PASSWORD unset → no gate, ASSETS served", async () => {
    const env = makeEnv({ BASIC_AUTH_PASSWORD: undefined });
    const resp = await fetchHandler(
      new Request("https://x.workers.dev/"),
      // @ts-expect-error
      env,
    );
    expect(resp.status).toBe(200);
  });
});

describe("worker: /api/chat-send quota gate", () => {
  it("400 email_invalid when payload missing email", async () => {
    const env = makeEnv();
    const resp = await fetchHandler(
      new Request("https://x.workers.dev/api/chat-send", {
        method: "POST",
        headers: {
          Authorization: authHeader("dfo", "secret-pw"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPrompt: "hi" }),
      }),
      // @ts-expect-error
      env,
    );
    expect(resp.status).toBe(400);
    const body = (await resp.json()) as { error: string };
    expect(body.error).toBe("email_invalid");
  });

  it("400 email_disposable on a known blocklist domain", async () => {
    const env = makeEnv();
    const resp = await fetchHandler(
      new Request("https://x.workers.dev/api/chat-send", {
        method: "POST",
        headers: {
          Authorization: authHeader("dfo", "secret-pw"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "trash@mailinator.com",
          newPrompt: "hi",
        }),
      }),
      // @ts-expect-error
      env,
    );
    expect(resp.status).toBe(400);
    const body = (await resp.json()) as { error: string };
    expect(body.error).toBe("email_disposable");
  });

  it("400 prompt_required when newPrompt empty", async () => {
    const env = makeEnv();
    const resp = await fetchHandler(
      new Request("https://x.workers.dev/api/chat-send", {
        method: "POST",
        headers: {
          Authorization: authHeader("dfo", "secret-pw"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "u@gmail.com", newPrompt: "   " }),
      }),
      // @ts-expect-error
      env,
    );
    expect(resp.status).toBe(400);
    const body = (await resp.json()) as { error: string };
    expect(body.error).toBe("prompt_required");
  });

  it("400 message_too_long past the 2000 cap", async () => {
    const env = makeEnv();
    const resp = await fetchHandler(
      new Request("https://x.workers.dev/api/chat-send", {
        method: "POST",
        headers: {
          Authorization: authHeader("dfo", "secret-pw"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "u@gmail.com",
          newPrompt: "x".repeat(2001),
        }),
      }),
      // @ts-expect-error
      env,
    );
    expect(resp.status).toBe(400);
    const body = (await resp.json()) as { error: string };
    expect(body.error).toBe("message_too_long");
  });

  it("first valid call forwards to upstream + writes KV; second call returns 402", async () => {
    const env = makeEnv();

    // Mock global fetch — the worker uses fetch() to reach the upstream.
    const upstreamPayload = {
      transcript: [
        {
          prompt: "hi",
          promptTimestamp: 1,
          response: "hello back",
          responseTimestamp: 2,
          context: [],
        },
      ],
      signiture: "sig-1",
    };
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify(upstreamPayload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    try {
      // First call — should succeed and write KV.
      const r1 = await fetchHandler(
        new Request("https://x.workers.dev/api/chat-send", {
          method: "POST",
          headers: {
            Authorization: authHeader("dfo", "secret-pw"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "u@gmail.com", newPrompt: "hi" }),
        }),
        // @ts-expect-error
        env,
      );
      expect(r1.status).toBe(200);
      const r1body = (await r1.json()) as typeof upstreamPayload;
      expect(r1body.transcript[0].response).toBe("hello back");
      // Phase 2: the claim lives in the Durable Object, not KV. The
      // legacy KV namespace is read-only from here forward.
      expect(env.QUOTA_DO.claims.size).toBe(1);
      expect(env.EMAIL_QUOTA.store.size).toBe(0);
      expect(fetchSpy).toHaveBeenCalledOnce();

      // Second call from the SAME email — 402, upstream not hit again.
      fetchSpy.mockClear();
      const r2 = await fetchHandler(
        new Request("https://x.workers.dev/api/chat-send", {
          method: "POST",
          headers: {
            Authorization: authHeader("dfo", "secret-pw"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "u@gmail.com", newPrompt: "again" }),
        }),
        // @ts-expect-error
        env,
      );
      expect(r2.status).toBe(402);
      const r2body = (await r2.json()) as { error: string };
      expect(r2body.error).toBe("quota_exhausted");
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("502 when upstream errors", async () => {
    const env = makeEnv();
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response("upstream boom", { status: 500 }),
      );

    try {
      const resp = await fetchHandler(
        new Request("https://x.workers.dev/api/chat-send", {
          method: "POST",
          headers: {
            Authorization: authHeader("dfo", "secret-pw"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "x@gmail.com", newPrompt: "hi" }),
        }),
        // @ts-expect-error
        env,
      );
      expect(resp.status).toBe(502);
      const body = (await resp.json()) as { error: string };
      expect(body.error).toBe("upstream_error");
      // KV should NOT be written on upstream failure.
      expect(env.EMAIL_QUOTA.store.size).toBe(0);
      // And the fresh manual claim must be ROLLED BACK so a transient
      // upstream failure doesn't permanently burn the free message.
      expect(env.QUOTA_DO.claims.size).toBe(0);
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("claim rolled back on failure lets the visitor retry successfully", async () => {
    const env = makeEnv();
    const okPayload = {
      transcript: [
        { prompt: "hi", promptTimestamp: 1, response: "hello", responseTimestamp: 2, context: [] },
      ],
      signiture: "sig",
    };
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response("boom", { status: 500 }))
      .mockResolvedValue(
        new Response(JSON.stringify(okPayload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    const send = () =>
      fetchHandler(
        new Request("https://x.workers.dev/api/chat-send", {
          method: "POST",
          headers: {
            Authorization: authHeader("dfo", "secret-pw"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "retry@gmail.com", newPrompt: "hi" }),
        }),
        // @ts-expect-error partial env
        env,
      );
    try {
      const r1 = await send();
      expect(r1.status).toBe(502);
      expect(env.QUOTA_DO.claims.size).toBe(0); // rolled back
      const r2 = await send();
      expect(r2.status).toBe(200); // retry succeeds — message wasn't burned
      expect(env.QUOTA_DO.claims.size).toBe(1);
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("starter sends use a separate budget and don't burn the manual message", async () => {
    const env = makeEnv();
    const okPayload = {
      transcript: [
        { prompt: "q", promptTimestamp: 1, response: "a", responseTimestamp: 2, context: [] },
      ],
      signiture: "sig",
    };
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify(okPayload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );
    const post = (extra: Record<string, unknown>) =>
      fetchHandler(
        new Request("https://x.workers.dev/api/chat-send", {
          method: "POST",
          headers: {
            Authorization: authHeader("dfo", "secret-pw"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "s@gmail.com", newPrompt: "q", ...extra }),
        }),
        // @ts-expect-error partial env
        env,
      );
    try {
      // A starter send succeeds without creating a manual claim.
      const r1 = await post({ starter: true });
      expect(r1.status).toBe(200);
      expect(env.QUOTA_DO.claims.size).toBe(0);
      // The visitor still has their free MANUAL message afterwards.
      const r2 = await post({});
      expect(r2.status).toBe(200);
      expect(env.QUOTA_DO.claims.size).toBe(1);
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("starter budget is capped (402 starter_quota_exhausted past the limit)", async () => {
    const env = makeEnv();
    const okPayload = {
      transcript: [
        { prompt: "q", promptTimestamp: 1, response: "a", responseTimestamp: 2, context: [] },
      ],
      signiture: "sig",
    };
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify(okPayload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );
    const post = () =>
      fetchHandler(
        new Request("https://x.workers.dev/api/chat-send", {
          method: "POST",
          headers: {
            Authorization: authHeader("dfo", "secret-pw"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "cap@gmail.com", newPrompt: "q", starter: true }),
        }),
        // @ts-expect-error partial env
        env,
      );
    try {
      // STARTER_QUOTA_LIMIT is 6 in the worker.
      for (let i = 0; i < 6; i++) {
        expect((await post()).status).toBe(200);
      }
      const over = await post();
      expect(over.status).toBe(402);
      const body = (await over.json()) as { error: string };
      expect(body.error).toBe("starter_quota_exhausted");
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("email is hashed before going into DO (no raw PII)", async () => {
    const env = makeEnv();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ transcript: [{ prompt: "x", response: "y", promptTimestamp: 1, responseTimestamp: 2, context: [] }], signiture: "s" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    await fetchHandler(
      new Request("https://x.workers.dev/api/chat-send", {
        method: "POST",
        headers: {
          Authorization: authHeader("dfo", "secret-pw"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "raw@example.com", newPrompt: "hi" }),
      }),
      // @ts-expect-error
      env,
    );
    // Phase 2: claim is stored in the DO keyed by SHA-256 hash of the
    // normalized email. Raw PII must never appear in the key or the row.
    const claimKeys = Array.from(env.QUOTA_DO.claims.keys());
    expect(claimKeys).toHaveLength(1);
    expect(claimKeys[0]).toMatch(/^[a-f0-9]{64}$/);
    expect(claimKeys[0]).not.toContain("raw@example.com");
    const claim = env.QUOTA_DO.claims.get(claimKeys[0]!)!;
    expect(claim.domain).toBe("example.com");
    expect(JSON.stringify(claim)).not.toContain("raw@example.com");
    vi.restoreAllMocks();
  });
});

// ---------- Phase 4 — magic-link verification + verified-window ----------

import { signVerifyToken } from "./lib/verify-token";

describe("worker: Phase 4 verify-email endpoint", () => {
  const VERIFY_SECRET = "phase-4-test-secret-do-not-use-anywhere-else";

  it("400 with malformed token", async () => {
    const env = makeEnv({ VERIFY_TOKEN_SECRET: VERIFY_SECRET });
    const resp = await fetchHandler(
      new Request("https://x.workers.dev/api/verify-email?token=notatoken", {
        headers: { Authorization: authHeader("dfo", "secret-pw") },
      }),
      env,
    );
    expect(resp.status).toBe(400);
    expect(resp.headers.get("content-type")).toContain("text/html");
    const body = await resp.text();
    expect(body).toMatch(/invalid|expired/i);
  });

  it("500 when VERIFY_TOKEN_SECRET is unset", async () => {
    const env = makeEnv(); // no VERIFY_TOKEN_SECRET
    const resp = await fetchHandler(
      new Request("https://x.workers.dev/api/verify-email?token=x.y.z", {
        headers: { Authorization: authHeader("dfo", "secret-pw") },
      }),
      env,
    );
    expect(resp.status).toBe(500);
  });

  it("404 when claim doesn't exist (forged hash)", async () => {
    const env = makeEnv({ VERIFY_TOKEN_SECRET: VERIFY_SECRET });
    const { token } = await signVerifyToken(VERIFY_SECRET, "a".repeat(64));
    const resp = await fetchHandler(
      new Request(
        `https://x.workers.dev/api/verify-email?token=${token}`,
        { headers: { Authorization: authHeader("dfo", "secret-pw") } },
      ),
      env,
    );
    expect(resp.status).toBe(404);
  });

  it("200 + marks claim verified for a fresh valid token", async () => {
    const env = makeEnv({ VERIFY_TOKEN_SECRET: VERIFY_SECRET });
    // Pre-populate a claim — simulate "user already sent first chat".
    const hash = "f".repeat(64);
    env.QUOTA_DO.claims.set(hash, {
      domain: "example.com",
      claimedAt: new Date().toISOString(),
      verified: false,
      verifiedAt: null,
      verifiedSends: [],
    });
    const { token } = await signVerifyToken(VERIFY_SECRET, hash);
    const resp = await fetchHandler(
      new Request(
        `https://x.workers.dev/api/verify-email?token=${token}`,
        { headers: { Authorization: authHeader("dfo", "secret-pw") } },
      ),
      env,
    );
    expect(resp.status).toBe(200);
    expect(env.QUOTA_DO.claims.get(hash)?.verified).toBe(true);
    expect(env.QUOTA_DO.claims.get(hash)?.verifiedAt).toBeTruthy();
  });
});

describe("worker: Phase 4 chat-send verified-window flow", () => {
  const SUCCESS_UPSTREAM = JSON.stringify({
    transcript: [
      {
        prompt: "x",
        response: "y",
        promptTimestamp: 1,
        responseTimestamp: 2,
        context: [],
      },
    ],
    signiture: "s",
  });

  function mockUpstreamOk() {
    return vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input) => {
        const url = typeof input === "string" ? input : (input as Request).url;
        // Only mock the Divinci upstream — let other fetches (CF email
        // API) hit the real network and fail gracefully (no email
        // secrets set in tests, so the dispatcher short-circuits).
        if (url.includes("/ai-chat/anonymous-chat")) {
          return new Response(SUCCESS_UPSTREAM, {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response("", { status: 200 });
      });
  }

  it("unverified visitor's second chat returns 402 quota_exhausted", async () => {
    // Phase 4 verification hint appears only when BOTH RESEND_API_KEY
    // and VERIFY_TOKEN_SECRET are set (i.e., when the worker is
    // actually configured to send verification emails). Set both so
    // the test exercises the "configured" branch of the 402 message.
    const env = makeEnv({
      RESEND_API_KEY: "re_test_key",
      VERIFY_TOKEN_SECRET: "test-secret",
    });
    const spy = mockUpstreamOk();
    try {
      // First call — allowed (writes claim, unverified).
      const r1 = await fetchHandler(
        new Request("https://x.workers.dev/api/chat-send", {
          method: "POST",
          headers: {
            Authorization: authHeader("dfo", "secret-pw"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "u1@example.com", newPrompt: "first" }),
        }),
        env,
      );
      expect(r1.status).toBe(200);
      // Second call from same email, unverified — 402.
      const r2 = await fetchHandler(
        new Request("https://x.workers.dev/api/chat-send", {
          method: "POST",
          headers: {
            Authorization: authHeader("dfo", "secret-pw"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "u1@example.com", newPrompt: "again" }),
        }),
        env,
      );
      expect(r2.status).toBe(402);
      const body = (await r2.json()) as { error: string; message: string };
      expect(body.error).toBe("quota_exhausted");
      expect(body.message).toMatch(/confirm/i);
    } finally {
      spy.mockRestore();
    }
  });

  it("verified visitor gets up to 5 more sends in a 24h window", async () => {
    const env = makeEnv();
    const spy = mockUpstreamOk();
    try {
      // First chat — allowed.
      await fetchHandler(
        new Request("https://x.workers.dev/api/chat-send", {
          method: "POST",
          headers: {
            Authorization: authHeader("dfo", "secret-pw"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "u2@example.com", newPrompt: "first" }),
        }),
        env,
      );
      // Mark verified directly (simulating magic-link click).
      const hash = Array.from(env.QUOTA_DO.claims.keys())[0]!;
      env.QUOTA_DO.claims.get(hash)!.verified = true;
      env.QUOTA_DO.claims.get(hash)!.verifiedAt = new Date().toISOString();

      // Now 5 more sends should all succeed.
      for (let i = 0; i < 5; i++) {
        const r = await fetchHandler(
          new Request("https://x.workers.dev/api/chat-send", {
            method: "POST",
            headers: {
              Authorization: authHeader("dfo", "secret-pw"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "u2@example.com",
              newPrompt: `verified-${i}`,
            }),
          }),
          env,
        );
        expect(r.status).toBe(200);
      }
      // 6th should be window_exhausted.
      const overflow = await fetchHandler(
        new Request("https://x.workers.dev/api/chat-send", {
          method: "POST",
          headers: {
            Authorization: authHeader("dfo", "secret-pw"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "u2@example.com", newPrompt: "overflow" }),
        }),
        env,
      );
      expect(overflow.status).toBe(402);
      const body = (await overflow.json()) as {
        error: string;
        sentInWindow: number;
        windowMax: number;
      };
      expect(body.error).toBe("verified_window_exhausted");
      expect(body.sentInWindow).toBe(5);
      expect(body.windowMax).toBe(5);
    } finally {
      spy.mockRestore();
    }
  });
});

describe("worker: /api/admin/reset-quota", () => {
  it("404→ASSETS when ADMIN_RESET_TOKEN is unset (feature disabled)", async () => {
    const env = makeEnv(); // no ADMIN_RESET_TOKEN
    const resp = await fetchHandler(
      new Request("https://x.workers.dev/api/admin/reset-quota", {
        method: "POST",
        headers: { Authorization: "Bearer anything", "Content-Type": "application/json" },
        body: JSON.stringify({ email: "mike@gmail.com" }),
      }),
      // @ts-expect-error partial env
      env,
    );
    // Disabled route falls through to ASSETS (no admin surface exposed).
    expect(await resp.text()).toBe("ASSETS_BODY");
  });

  it("401 with a wrong bearer token", async () => {
    const env = makeEnv({ ADMIN_RESET_TOKEN: "s3cret-admin" });
    const resp = await fetchHandler(
      new Request("https://x.workers.dev/api/admin/reset-quota", {
        method: "POST",
        headers: { Authorization: "Bearer nope", "Content-Type": "application/json" },
        body: JSON.stringify({ email: "mike@gmail.com" }),
      }),
      // @ts-expect-error partial env
      env,
    );
    expect(resp.status).toBe(401);
  });

  it("200 clears the claim so the visitor can chat again", async () => {
    const env = makeEnv({ ADMIN_RESET_TOKEN: "s3cret-admin" });
    const okPayload = {
      transcript: [
        { prompt: "hi", promptTimestamp: 1, response: "hello", responseTimestamp: 2, context: [] },
      ],
      signiture: "sig",
    };
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify(okPayload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );
    const sendManual = () =>
      fetchHandler(
        new Request("https://x.workers.dev/api/chat-send", {
          method: "POST",
          headers: {
            Authorization: authHeader("dfo", "secret-pw"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "mike@gmail.com", newPrompt: "hi" }),
        }),
        // @ts-expect-error partial env
        env,
      );
    try {
      expect((await sendManual()).status).toBe(200); // burns the claim
      expect((await sendManual()).status).toBe(402); // exhausted
      // Admin reset clears it.
      const reset = await fetchHandler(
        new Request("https://x.workers.dev/api/admin/reset-quota", {
          method: "POST",
          headers: {
            Authorization: "Bearer s3cret-admin",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "mike@gmail.com" }),
        }),
        // @ts-expect-error partial env
        env,
      );
      expect(reset.status).toBe(200);
      const rbody = (await reset.json()) as { ok: boolean; clearedClaim: boolean };
      expect(rbody.ok).toBe(true);
      expect(rbody.clearedClaim).toBe(true);
      expect(env.QUOTA_DO.claims.size).toBe(0);
      // ...and the visitor can chat again.
      expect((await sendManual()).status).toBe(200);
    } finally {
      fetchSpy.mockRestore();
    }
  });
});
