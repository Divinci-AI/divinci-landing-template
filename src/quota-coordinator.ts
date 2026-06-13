/**
 * EmailQuotaCoordinator — one Durable Object instance per email-hash.
 *
 * Phase 2 (closed): KV race-condition fix. DO instances are single-
 * threaded; routing by `getByName(emailHash)` pins all requests for
 * the same canonical email to the same instance, so the read-then-
 * write window inside `claim()` is closed by the runtime.
 *
 * Phase 4 (this commit): deferred magic-link email verification +
 * 5-messages-per-24h sliding window for verified visitors. Unverified
 * visitors keep the 1-message-lifetime cap.
 *
 * State machine per email-hash:
 *   none → claim() → claimed-unverified
 *   claimed-unverified → markVerified(token) → claimed-verified
 *   claimed-verified → canSendVerified() ≤5 in last 24h → allowed
 *   claimed-verified → canSendVerified() >5 in last 24h → 24h_exhausted
 *
 * Storage shape (SQLite):
 *   quota_claim (singleton row per DO instance)
 *     - email_hash     TEXT   PRIMARY KEY  (SHA-256 hex of normalized email)
 *     - email_domain   TEXT                (e.g. "gmail.com", for analytics)
 *     - claimed_at     TEXT                (ISO-8601 timestamp)
 *     - verified       INTEGER NOT NULL DEFAULT 0  (boolean)
 *     - verified_at    TEXT                (ISO-8601, null if unverified)
 *
 *   verified_send (rolling 24h log; per-instance, so no email_hash col)
 *     - sent_at        INTEGER PRIMARY KEY  (unix epoch seconds)
 *   Rows older than 24h are pruned on each canSendVerified() call.
 */

import { DurableObject } from "cloudflare:workers";

export interface ClaimResult {
  /** True if THIS call burned the lifetime quota slot. False if the email already had one. */
  allowed: boolean;
  /** When the previous claim happened, if `allowed` is false. */
  priorClaimedAt?: string;
  /** Whether the prior claim has been email-verified. */
  priorVerified?: boolean;
}

export interface VerifySendResult {
  /** True if the verified visitor can send another message right now. */
  allowed: boolean;
  /** Why not, when `allowed` is false. */
  reason?:
    | "not_verified"
    | "no_prior_claim"
    | "window_exhausted";
  /** Count of sends in the trailing 24h, after pruning. */
  sentInWindow: number;
  /** Configured ceiling (5). */
  windowMax: number;
}

export interface MarkVerifiedResult {
  /** True if the row exists and is now (or was already) verified. */
  ok: boolean;
  /** Why not, when `ok` is false. */
  reason?: "no_prior_claim";
}

const VERIFIED_WINDOW_MAX = 5;
const VERIFIED_WINDOW_SECONDS = 60 * 60 * 24;

export class EmailQuotaCoordinator extends DurableObject {
  constructor(ctx: DurableObjectState, env: unknown) {
    super(ctx, env as DurableObjectState["env"] extends infer E ? E : never);
    ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS quota_claim (
          email_hash    TEXT PRIMARY KEY,
          email_domain  TEXT NOT NULL,
          claimed_at    TEXT NOT NULL,
          verified      INTEGER NOT NULL DEFAULT 0,
          verified_at   TEXT
        )
      `);
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS verified_send (
          sent_at INTEGER PRIMARY KEY
        )
      `);
      // Conversation-starter leniency (added 2026-06-05): starter clicks
      // are cheap (cached via the Cloudflare AI Gateway) and are the
      // engagement hook, so they get a separate, more generous per-email
      // budget that does NOT consume the single lifetime manual message.
      // Singleton counter row (id always 0) per email-hash DO instance.
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS starter_quota (
          id    INTEGER PRIMARY KEY,
          used  INTEGER NOT NULL DEFAULT 0
        )
      `);
      // Idempotent migration: instances created under the v1 schema
      // (before Phase 4) won't have the verified columns. SQLite has
      // no IF NOT EXISTS for ADD COLUMN, so we try and swallow the
      // "duplicate column" error.
      for (const stmt of [
        `ALTER TABLE quota_claim ADD COLUMN verified INTEGER NOT NULL DEFAULT 0`,
        `ALTER TABLE quota_claim ADD COLUMN verified_at TEXT`,
      ]) {
        try {
          this.ctx.storage.sql.exec(stmt);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          if (!/duplicate column/i.test(msg)) throw e;
        }
      }
    });
  }

  /**
   * Atomically check whether `emailHash` already has a claim. If not,
   * record the claim and return allowed=true. If so, return allowed=false
   * along with the previous claim timestamp.
   *
   * Single-threaded DO execution + single-statement SQL means there is
   * no race window between read and write.
   */
  async claim(emailHash: string, emailDomain: string): Promise<ClaimResult> {
    // Read first so we have an unambiguous yes/no on prior claims —
    // INSERT OR IGNORE's rowsWritten was returning 0 even on fresh
    // inserts (seen during Phase 2 bring-up). Atomicity is still
    // preserved by the single-threaded DO execution model — only one
    // claim() call runs in this DO instance at a time, so the
    // read-then-write window is closed by the runtime, not by SQL.
    const prior = this.ctx.storage.sql
      .exec<{ claimed_at: string; verified: number }>(
        `SELECT claimed_at, verified FROM quota_claim WHERE email_hash = ?`,
        emailHash,
      )
      .toArray()[0];

    if (prior) {
      return {
        allowed: false,
        priorClaimedAt: prior.claimed_at,
        priorVerified: prior.verified === 1,
      };
    }

    this.ctx.storage.sql.exec(
      `INSERT INTO quota_claim (email_hash, email_domain, claimed_at, verified, verified_at)
       VALUES (?, ?, ?, 0, NULL)`,
      emailHash,
      emailDomain,
      new Date().toISOString(),
    );
    return { allowed: true, priorVerified: false };
  }

  /**
   * Release a lifetime claim that was just recorded by `claim()` but whose
   * downstream chat call failed. Phase 2 records the claim BEFORE the
   * upstream call for atomicity, which means a transient upstream failure
   * (e.g. a 502/403 from the API) would otherwise permanently burn the
   * visitor's single free message even though they never got a reply.
   * The worker calls this when `claim.allowed === true` and the upstream
   * returned non-OK or threw, so the visitor can retry.
   *
   * Only deletes UNVERIFIED claims — a verified row represents a confirmed
   * email and must never be rolled back. (The worker only ever calls this
   * right after a fresh `allowed:true` claim, which is always unverified,
   * but we guard here as defense-in-depth.)
   */
  async releaseClaim(emailHash: string): Promise<{ released: boolean }> {
    const row = this.ctx.storage.sql
      .exec<{ verified: number }>(
        `SELECT verified FROM quota_claim WHERE email_hash = ?`,
        emailHash,
      )
      .toArray()[0];
    if (!row || row.verified === 1) return { released: false };
    this.ctx.storage.sql.exec(
      `DELETE FROM quota_claim WHERE email_hash = ? AND verified = 0`,
      emailHash,
    );
    return { released: true };
  }

  /**
   * Admin/support reset — fully clears this email's quota state so the
   * visitor starts fresh: deletes the lifetime manual claim (verified or
   * not) AND zeroes the starter budget. Only reachable via the
   * bearer-token-guarded /api/admin/reset-quota worker route. Pure local
   * SQLite — opens no connections, so it carries no duration-billing risk.
   */
  async adminReset(
    emailHash: string,
  ): Promise<{ clearedClaim: boolean; clearedStarter: boolean }> {
    const claimRow = this.ctx.storage.sql
      .exec(`SELECT email_hash FROM quota_claim WHERE email_hash = ?`, emailHash)
      .toArray()[0];
    if (claimRow) {
      this.ctx.storage.sql.exec(
        `DELETE FROM quota_claim WHERE email_hash = ?`,
        emailHash,
      );
    }
    const starterRow = this.ctx.storage.sql
      .exec(`SELECT used FROM starter_quota WHERE id = 0`)
      .toArray()[0];
    if (starterRow) {
      this.ctx.storage.sql.exec(`DELETE FROM starter_quota WHERE id = 0`);
    }
    return {
      clearedClaim: Boolean(claimRow),
      clearedStarter: Boolean(starterRow),
    };
  }

  /**
   * Claim one conversation-starter send against this email's separate,
   * more-generous starter budget. Returns allowed=false once `limit` is
   * reached. Starter sends do NOT touch the lifetime manual-message claim,
   * so a visitor can explore the cached starter questions and still keep
   * their one free personal message.
   *
   * NOTE on abuse: like the 1-message gate, this is bounded per-email, so
   * the ceiling is "limit cached questions per email, then rotate email"
   * — the same email-rotation ceiling the existing gate already has, just
   * a slightly higher per-email allowance for the cheap cached path.
   */
  async claimStarter(
    limit: number,
  ): Promise<{ allowed: boolean; used: number; limit: number }> {
    this.ctx.storage.sql.exec(
      `INSERT OR IGNORE INTO starter_quota (id, used) VALUES (0, 0)`,
    );
    const used = this.ctx.storage.sql
      .exec<{ used: number }>(`SELECT used FROM starter_quota WHERE id = 0`)
      .toArray()[0].used;
    if (used >= limit) {
      return { allowed: false, used, limit };
    }
    this.ctx.storage.sql.exec(`UPDATE starter_quota SET used = used + 1 WHERE id = 0`);
    return { allowed: true, used: used + 1, limit };
  }

  /**
   * Mark a prior claim as email-verified. Idempotent: if the row is
   * already verified, return ok:true without changing verified_at.
   * If the row doesn't exist (token forged or hash mismatched), return
   * ok:false with reason="no_prior_claim" — defense-in-depth in case
   * the worker forgot to validate the token before calling this.
   */
  async markVerified(emailHash: string): Promise<MarkVerifiedResult> {
    const row = this.ctx.storage.sql
      .exec<{ verified: number }>(
        `SELECT verified FROM quota_claim WHERE email_hash = ?`,
        emailHash,
      )
      .toArray()[0];
    if (!row) return { ok: false, reason: "no_prior_claim" };
    if (row.verified === 1) return { ok: true };
    this.ctx.storage.sql.exec(
      `UPDATE quota_claim
         SET verified = 1, verified_at = ?
       WHERE email_hash = ?`,
      new Date().toISOString(),
      emailHash,
    );
    return { ok: true };
  }

  /**
   * Check whether a verified visitor can send another message.
   * Prunes rows older than 24h before counting. Returns the post-prune
   * count + the ceiling so the worker can surface useful UI copy.
   *
   * Does NOT record the send — callers should follow up with
   * `recordVerifiedSend()` AFTER the upstream call returns 200, so
   * a failed upstream doesn't burn a slot in the rolling window.
   * (Phase 2's claim() burns the lifetime slot pre-upstream because
   * we couldn't roll it back atomically; the 24h window has no such
   * constraint — each row is independent.)
   */
  async canSendVerified(
    emailHash: string,
    nowSeconds: number = Math.floor(Date.now() / 1000),
  ): Promise<VerifySendResult> {
    const row = this.ctx.storage.sql
      .exec<{ verified: number }>(
        `SELECT verified FROM quota_claim WHERE email_hash = ?`,
        emailHash,
      )
      .toArray()[0];
    if (!row) {
      return {
        allowed: false,
        reason: "no_prior_claim",
        sentInWindow: 0,
        windowMax: VERIFIED_WINDOW_MAX,
      };
    }
    if (row.verified !== 1) {
      return {
        allowed: false,
        reason: "not_verified",
        sentInWindow: 0,
        windowMax: VERIFIED_WINDOW_MAX,
      };
    }
    const cutoff = nowSeconds - VERIFIED_WINDOW_SECONDS;
    this.ctx.storage.sql.exec(
      `DELETE FROM verified_send WHERE sent_at < ?`,
      cutoff,
    );
    const count = this.ctx.storage.sql
      .exec<{ n: number }>(`SELECT COUNT(*) AS n FROM verified_send`)
      .toArray()[0].n;
    if (count >= VERIFIED_WINDOW_MAX) {
      return {
        allowed: false,
        reason: "window_exhausted",
        sentInWindow: count,
        windowMax: VERIFIED_WINDOW_MAX,
      };
    }
    return {
      allowed: true,
      sentInWindow: count,
      windowMax: VERIFIED_WINDOW_MAX,
    };
  }

  /**
   * Record one verified send into the 24h rolling log. Called AFTER
   * the upstream chat returns 200, so a 502 upstream doesn't burn
   * the slot.
   *
   * `sent_at` is unix-epoch seconds. INSERT OR IGNORE handles the
   * sub-second-collision edge case (e.g. two near-simultaneous calls
   * landing in the same DO; DO single-thread means they're serialized
   * but both could land in the same wall-clock second).
   */
  async recordVerifiedSend(
    nowSeconds: number = Math.floor(Date.now() / 1000),
  ): Promise<void> {
    // The INSERT can clash with the PRIMARY KEY if two sends land in
    // the same second. Bump until we find a free slot. Bounded because
    // the table is capped at ~5 rows in any 24h window.
    let candidate = nowSeconds;
    for (let i = 0; i < 10; i++) {
      try {
        this.ctx.storage.sql.exec(
          `INSERT INTO verified_send (sent_at) VALUES (?)`,
          candidate,
        );
        return;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!/UNIQUE constraint|PRIMARY KEY/i.test(msg)) throw e;
        candidate += 1;
      }
    }
    throw new Error(
      "recordVerifiedSend: failed to find a free sent_at slot after 10 tries",
    );
  }

  /**
   * Read-only inspector — returns the claim record (if any) for the
   * email-hash this DO owns. Useful for diagnostics + admin tooling
   * (we don't expose it from the worker).
   */
  async inspect(emailHash: string): Promise<{
    claimed: boolean;
    claimedAt?: string;
    domain?: string;
    verified?: boolean;
    verifiedAt?: string | null;
    verifiedSendsInWindow?: number;
  }> {
    const row = this.ctx.storage.sql
      .exec<{
        claimed_at: string;
        email_domain: string;
        verified: number;
        verified_at: string | null;
      }>(
        `SELECT claimed_at, email_domain, verified, verified_at
           FROM quota_claim WHERE email_hash = ?`,
        emailHash,
      )
      .toArray()[0];
    if (!row) return { claimed: false };
    const count = this.ctx.storage.sql
      .exec<{ n: number }>(`SELECT COUNT(*) AS n FROM verified_send`)
      .toArray()[0].n;
    return {
      claimed: true,
      claimedAt: row.claimed_at,
      domain: row.email_domain,
      verified: row.verified === 1,
      verifiedAt: row.verified_at,
      verifiedSendsInWindow: count,
    };
  }
}
