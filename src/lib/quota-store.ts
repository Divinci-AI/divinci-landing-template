/**
 * The per-email quota store, as an interface.
 *
 * On Cloudflare this is a Durable Object: `getByName(emailHash)` pins every
 * request for one canonical email to a single-threaded instance, which is what
 * closes the read-then-write race inside `claim()`.
 *
 * Vercel has no Durable Objects. It does have Vercel KV (Upstash Redis), whose
 * `SET … NX` is atomic — a better primitive for this than KV+DO, because the
 * atomicity is in the operation rather than in the execution model.
 *
 * ── What is and is not implemented here ─────────────────────────────────────
 *
 * Three methods, because three are what a DEMO deployment uses:
 *
 *   claim / releaseClaim   the 1-message-lifetime cap, and its rollback
 *   claimStarter           the more generous cached-starter budget
 *
 * The Phase-4 verified-email flow (`markVerified`, `canSendVerified`,
 * `recordVerifiedSend`) is deliberately NOT implemented. It only activates when
 * `RESEND_API_KEY` and `VERIFY_TOKEN_SECRET` are set, and the demo pipeline
 * sets neither — so on a demo it is dead code on both hosts. Those methods
 * THROW rather than returning a plausible default: a silent "not verified" here
 * would look like a working verification flow that never verifies anyone.
 *
 * `adminReset` is likewise unimplemented — it needs `ADMIN_RESET_TOKEN`, which
 * the pipeline also never sets.
 */

export interface ClaimResult {
  /** True if THIS call burned the lifetime quota slot. False if it already had one. */
  allowed: boolean;
  /** When the previous claim happened, if `allowed` is false. */
  priorClaimedAt?: string;
  /** Whether the prior claim has been email-verified. */
  priorVerified?: boolean;
}

export interface VerifySendResult {
  allowed: boolean;
  reason?: "not_verified" | "no_prior_claim" | "window_exhausted";
  /** Sends in the trailing window, after pruning. */
  sentInWindow: number;
  windowMax: number;
}

export interface MarkVerifiedResult {
  ok: boolean;
  reason?: "no_prior_claim";
}

/**
 * What the chat-send handler calls on a stub.
 *
 * ⚠️ Every method is REQUIRED and fully typed, including the four the Vercel
 * store does not implement. The first version marked those optional and
 * returned `Promise<unknown>`, which was wrong twice over: it made every call
 * site in the worker `possibly undefined` and every result `unknown`, so 18 of
 * the repository's type errors were this interface's fault — and it invited a
 * caller to feature-detect (`stub.markVerified?.()`), which would silently skip
 * verification instead of failing.
 *
 * The unsupported ones throw. A method that is present and throws is honest;
 * one that is absent is an invitation to route around it.
 *
 * These result shapes are declared here rather than imported from
 * `quota-coordinator.ts` on purpose — that module imports `cloudflare:workers`,
 * and pulling it in would break the portability this interface exists to
 * provide. The Durable Object satisfies them structurally.
 */
export interface QuotaStub {
  claim(emailHash: string, emailDomain: string): Promise<ClaimResult>;
  releaseClaim(emailHash: string): Promise<{ released: boolean }>;
  claimStarter(limit: number): Promise<{ allowed: boolean; used: number; limit: number }>;
  markVerified(emailHash: string): Promise<MarkVerifiedResult>;
  canSendVerified(emailHash: string, nowSeconds?: number): Promise<VerifySendResult>;
  recordVerifiedSend(nowSeconds?: number): Promise<void>;
  adminReset(emailHash: string): Promise<{ clearedClaim: boolean; clearedStarter: boolean }>;
}

/**
 * Structurally satisfied by `DurableObjectNamespace<EmailQuotaCoordinator>`,
 * so the Cloudflare path is unchanged and untyped-around.
 */
export interface QuotaNamespace {
  getByName(name: string): QuotaStub;
}

/** One Redis command, as Upstash's REST API takes it. Injectable for tests. */
export type RedisCommand = (args: (string | number)[]) => Promise<unknown>;

export class QuotaStoreUnsupported extends Error {
  constructor(method: string) {
    super(
      `${method} is not implemented by the Vercel quota store. It belongs to the ` +
      `email-verification flow, which needs RESEND_API_KEY and VERIFY_TOKEN_SECRET — ` +
      `neither of which a demo deployment sets. If you are enabling verification on ` +
      `Vercel, implement it here rather than letting it degrade silently.`,
    );
    this.name = "QuotaStoreUnsupported";
  }
}

const CLAIM_PREFIX = "landing:claim:";
const STARTER_PREFIX = "landing:starter:";

/** 90 days, matching the upstream device-quota TTL so abandoned keys age out. */
export const CLAIM_TTL_SECONDS = 90 * 24 * 60 * 60;

interface ClaimRecord {
  claimedAt: string;
  domain: string;
  verified: boolean;
}

/**
 * A quota namespace backed by one Redis command function.
 *
 * @param cmd    executes a Redis command and returns its reply
 * @param nowIso injectable clock, so the tests are deterministic
 */
export function redisQuotaNamespace(
  cmd: RedisCommand,
  nowIso: () => string = () => new Date().toISOString(),
): QuotaNamespace {
  return {
    getByName(emailHash: string): QuotaStub {
      const claimKey = CLAIM_PREFIX + emailHash;
      const starterKey = STARTER_PREFIX + emailHash;

      return {
        async claim(_hash, emailDomain) {
          const record: ClaimRecord = { claimedAt: nowIso(), domain: emailDomain, verified: false };
          // SET … NX is the whole point: it is atomic, so two concurrent
          // requests for the same email cannot both be told they claimed it.
          // The DO achieved this by being single-threaded; here the operation
          // itself carries the guarantee.
          const set = await cmd(["SET", claimKey, JSON.stringify(record), "NX", "EX", CLAIM_TTL_SECONDS]);
          if (set !== null && set !== undefined) return { allowed: true };

          // Somebody already holds it. Report their claim so the caller can
          // tell the visitor when they used it.
          const raw = await cmd(["GET", claimKey]);
          const prior = parseRecord(raw);
          return {
            allowed: false,
            priorClaimedAt: prior?.claimedAt,
            priorVerified: prior?.verified ?? false,
          };
        },

        async releaseClaim(_hash) {
          // Only UNVERIFIED claims may be rolled back — a verified row
          // represents a confirmed email and must never be undone. The caller
          // only releases immediately after a fresh claim (always unverified),
          // so this is defence in depth, exactly as the DO has it.
          const prior = parseRecord(await cmd(["GET", claimKey]));
          if (!prior || prior.verified) return { released: false };
          await cmd(["DEL", claimKey]);
          return { released: true };
        },

        async claimStarter(limit) {
          // INCR is atomic. Going over the limit and stepping back is safe in
          // a way that check-then-increment is not: two callers racing at
          // limit-1 get limit (allowed) and limit+1 (refused), and the refused
          // one restores the counter. It can never over-ALLOW, which is the
          // direction that costs money.
          const used = Number(await cmd(["INCR", starterKey]));
          if (!Number.isFinite(used)) throw new Error("starter quota: INCR returned a non-number");
          if (used === 1) await cmd(["EXPIRE", starterKey, CLAIM_TTL_SECONDS]);
          if (used > limit) {
            await cmd(["DECR", starterKey]);
            return { allowed: false, used: limit, limit };
          }
          return { allowed: true, used, limit };
        },

        // Present and throwing, never absent — see the note on QuotaStub.
        markVerified(): Promise<MarkVerifiedResult> { throw new QuotaStoreUnsupported("markVerified"); },
        canSendVerified(): Promise<VerifySendResult> { throw new QuotaStoreUnsupported("canSendVerified"); },
        recordVerifiedSend(): Promise<void> { throw new QuotaStoreUnsupported("recordVerifiedSend"); },
        adminReset(): Promise<{ clearedClaim: boolean; clearedStarter: boolean }> {
          throw new QuotaStoreUnsupported("adminReset");
        },
      };
    },
  };
}

function parseRecord(raw: unknown): ClaimRecord | undefined {
  if (typeof raw !== "string" || raw.length === 0) return undefined;
  try {
    const v = JSON.parse(raw) as ClaimRecord;
    return typeof v?.claimedAt === "string" ? v : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Build a `RedisCommand` against Vercel KV / Upstash over REST.
 *
 * Reads the Vercel KV variable names first and the Upstash ones second, so a
 * project using either integration works without extra configuration.
 */
export function upstashCommand(env: Record<string, string | undefined>): RedisCommand | null {
  const url = env.KV_REST_API_URL ?? env.UPSTASH_REDIS_REST_URL;
  const token = env.KV_REST_API_TOKEN ?? env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  return async (args) => {
    const res = await fetch(url.replace(/\/+$/, ""), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args.map(String)),
    });
    // Never a bare .json(): an Upstash error page or a proxy 502 is HTML, and
    // the resulting SyntaxError would name nothing useful.
    const text = await res.text();
    let body: { result?: unknown; error?: string };
    try {
      body = JSON.parse(text) as { result?: unknown; error?: string };
    } catch {
      throw new Error(`quota store returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
    }
    if (!res.ok || body.error) {
      throw new Error(`quota store ${args[0]} failed (${res.status}): ${body.error ?? text.slice(0, 200)}`);
    }
    return body.result;
  };
}
