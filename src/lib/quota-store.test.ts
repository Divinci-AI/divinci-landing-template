import { describe, it, expect } from "vitest";
import {
  redisQuotaNamespace, upstashCommand, QuotaStoreUnsupported, CLAIM_TTL_SECONDS,
  type RedisCommand,
} from "./quota-store";

/**
 * An in-memory Redis with the exact semantics these three methods rely on:
 * SET…NX returns null when the key exists, INCR is atomic, DEL removes.
 *
 * Nothing here can reach a network, so this suite runs in CI with no Vercel
 * account and no Upstash instance — which matters, because that is precisely
 * the part of this port that cannot otherwise be verified.
 */
function fakeRedis() {
  const store = new Map<string, string>();
  const log: string[][] = [];
  const cmd: RedisCommand = async (args) => {
    const a = args.map(String);
    log.push(a);
    const [op, key] = a;
    switch (op) {
      case "SET": {
        const nx = a.includes("NX");
        if (nx && store.has(key)) return null;      // ← the whole guarantee
        store.set(key, a[2]);
        return "OK";
      }
      case "GET": return store.get(key) ?? null;
      case "DEL": return store.delete(key) ? 1 : 0;
      case "INCR": {
        const next = Number(store.get(key) ?? "0") + 1;
        store.set(key, String(next));
        return next;
      }
      case "DECR": {
        const next = Number(store.get(key) ?? "0") - 1;
        store.set(key, String(next));
        return next;
      }
      case "EXPIRE": return 1;
      default: throw new Error(`unexpected command ${op}`);
    }
  };
  return { cmd, store, log };
}

const NOW = "2026-08-19T12:00:00.000Z";
const ns = (r = fakeRedis()) => ({ r, ns: redisQuotaNamespace(r.cmd, () => NOW) });

describe("claim — the 1-message-lifetime cap", () => {
  it("allows the first claim for an email", async () => {
    const { ns: n } = ns();
    expect(await n.getByName("h1").claim("h1", "example.com")).toEqual({ allowed: true });
  });

  it("refuses the second, and says when the first happened", async () => {
    const { ns: n } = ns();
    const stub = n.getByName("h1");
    await stub.claim("h1", "example.com");
    const second = await stub.claim("h1", "example.com");
    expect(second.allowed).toBe(false);
    expect(second.priorClaimedAt).toBe(NOW);
    expect(second.priorVerified).toBe(false);
  });

  it("keys per email — one visitor's claim does not spend another's", async () => {
    const { ns: n } = ns();
    expect((await n.getByName("h1").claim("h1", "a.com")).allowed).toBe(true);
    expect((await n.getByName("h2").claim("h2", "b.com")).allowed).toBe(true);
  });

  it("uses SET…NX, not GET-then-SET", async () => {
    // The atomicity is the point. A read-then-write would let two concurrent
    // requests for the same email BOTH be told they claimed it — which is the
    // exact race the Durable Object was introduced to close on Cloudflare.
    const { r, ns: n } = ns();
    await n.getByName("h1").claim("h1", "example.com");
    const set = r.log.find((c) => c[0] === "SET");
    expect(set).toBeDefined();
    expect(set).toContain("NX");
  });

  it("only ONE of two concurrent claims wins", async () => {
    const { ns: n } = ns();
    const stub = n.getByName("h1");
    const results = await Promise.all([
      stub.claim("h1", "example.com"),
      stub.claim("h1", "example.com"),
      stub.claim("h1", "example.com"),
    ]);
    expect(results.filter((r) => r.allowed)).toHaveLength(1);
  });

  it("expires abandoned claims rather than growing forever", async () => {
    const { r, ns: n } = ns();
    await n.getByName("h1").claim("h1", "example.com");
    const set = r.log.find((c) => c[0] === "SET")!;
    expect(set).toContain("EX");
    expect(set).toContain(String(CLAIM_TTL_SECONDS));
  });
});

describe("releaseClaim — the rollback", () => {
  it("frees a claim whose upstream call failed, so the visitor can retry", async () => {
    // The claim is recorded BEFORE the upstream call, for atomicity. Without
    // this rollback a transient 502 would permanently burn the visitor's one
    // free message for a reply they never received.
    const { ns: n } = ns();
    const stub = n.getByName("h1");
    await stub.claim("h1", "example.com");
    expect(await stub.releaseClaim("h1")).toEqual({ released: true });
    expect((await stub.claim("h1", "example.com")).allowed).toBe(true);
  });

  it("is a no-op when nothing was claimed", async () => {
    const { ns: n } = ns();
    expect(await n.getByName("h1").releaseClaim("h1")).toEqual({ released: false });
  });

  it("never rolls back a VERIFIED claim", async () => {
    // A verified row represents a confirmed email address and must not be
    // undone. Defence in depth: the caller only releases right after a fresh
    // claim, which is always unverified.
    const { r, ns: n } = ns();
    r.store.set("landing:claim:h1", JSON.stringify({ claimedAt: NOW, domain: "x.com", verified: true }));
    expect(await n.getByName("h1").releaseClaim("h1")).toEqual({ released: false });
    expect(r.store.has("landing:claim:h1")).toBe(true);
  });

  it("treats an unparseable record as nothing to release", async () => {
    const { r, ns: n } = ns();
    r.store.set("landing:claim:h1", "not json");
    expect(await n.getByName("h1").releaseClaim("h1")).toEqual({ released: false });
  });
});

describe("claimStarter — the cached-starter budget", () => {
  it("allows up to the limit and counts", async () => {
    const { ns: n } = ns();
    const stub = n.getByName("h1");
    expect(await stub.claimStarter(3)).toEqual({ allowed: true, used: 1, limit: 3 });
    expect(await stub.claimStarter(3)).toEqual({ allowed: true, used: 2, limit: 3 });
    expect(await stub.claimStarter(3)).toEqual({ allowed: true, used: 3, limit: 3 });
  });

  it("refuses past the limit", async () => {
    const { ns: n } = ns();
    const stub = n.getByName("h1");
    for (let i = 0; i < 3; i++) await stub.claimStarter(3);
    expect(await stub.claimStarter(3)).toEqual({ allowed: false, used: 3, limit: 3 });
  });

  it("does not drift upward when refused", async () => {
    // INCR-then-step-back. Without the DECR, every refused call would inflate the
    // counter and `used` would climb past the limit forever.
    const { r, ns: n } = ns();
    const stub = n.getByName("h1");
    for (let i = 0; i < 5; i++) await stub.claimStarter(2);
    expect(Number(r.store.get("landing:starter:h1"))).toBe(2);
  });

  it("never over-allows under concurrency", async () => {
    // The direction that costs money. Racing callers may briefly overshoot the
    // counter, but exactly `limit` of them may be told yes.
    const { ns: n } = ns();
    const stub = n.getByName("h1");
    const results = await Promise.all(Array.from({ length: 10 }, () => stub.claimStarter(4)));
    expect(results.filter((r) => r.allowed)).toHaveLength(4);
  });

  it("separates the starter budget from the lifetime claim", async () => {
    // A visitor can explore the cached starter questions and still keep their
    // one free personal message.
    const { ns: n } = ns();
    const stub = n.getByName("h1");
    await stub.claimStarter(3);
    expect((await stub.claim("h1", "example.com")).allowed).toBe(true);
  });
});

describe("the verification flow is unimplemented, and says so", () => {
  it("throws rather than degrading silently", async () => {
    // Returning "not verified" would look like a working verification flow
    // that never verifies anyone.
    const stub = ns().ns.getByName("h1");
    expect(() => stub.markVerified!("h1")).toThrow(QuotaStoreUnsupported);
    expect(() => stub.canSendVerified!("h1")).toThrow(QuotaStoreUnsupported);
    expect(() => stub.recordVerifiedSend!()).toThrow(QuotaStoreUnsupported);
    expect(() => stub.adminReset!("h1")).toThrow(QuotaStoreUnsupported);
  });

  it("names the secrets that would enable it", () => {
    try { ns().ns.getByName("h1").markVerified!("h1"); }
    catch (e) { expect((e as Error).message).toMatch(/RESEND_API_KEY/); }
  });
});

describe("upstashCommand", () => {
  it("is null when the project has no KV, so the caller can refuse clearly", () => {
    expect(upstashCommand({})).toBeNull();
  });

  it("accepts either the Vercel KV or the Upstash variable names", () => {
    expect(upstashCommand({ KV_REST_API_URL: "u", KV_REST_API_TOKEN: "t" })).toBeTypeOf("function");
    expect(upstashCommand({ UPSTASH_REDIS_REST_URL: "u", UPSTASH_REDIS_REST_TOKEN: "t" })).toBeTypeOf("function");
  });

  it("surfaces a non-JSON reply instead of throwing SyntaxError", async () => {
    const real = globalThis.fetch;
    globalThis.fetch = (async () => new Response("<html>502</html>", { status: 502 })) as typeof fetch;
    const cmd = upstashCommand({ KV_REST_API_URL: "https://x.test", KV_REST_API_TOKEN: "t" })!;
    await expect(cmd(["GET", "k"])).rejects.toThrow(/non-JSON \(502\)/);
    globalThis.fetch = real;
  });

  it("surfaces an Upstash error body", async () => {
    const real = globalThis.fetch;
    globalThis.fetch = (async () => Response.json({ error: "WRONGPASS" }, { status: 401 })) as typeof fetch;
    const cmd = upstashCommand({ KV_REST_API_URL: "https://x.test", KV_REST_API_TOKEN: "t" })!;
    await expect(cmd(["GET", "k"])).rejects.toThrow(/WRONGPASS/);
    globalThis.fetch = real;
  });
});
