/**
 * HMAC-SHA256-signed magic-link tokens for the Phase 4 email
 * verification flow.
 *
 * A token encodes (emailHash, expiresAtSeconds) under a server-side
 * secret. The verification link is opaque to the user and trivially
 * forge-resistant: changing either field invalidates the HMAC, so we
 * never need a server-side "issued tokens" table — we re-verify on
 * presentation.
 *
 * Wire format (URL-safe, no padding):
 *   <emailHash>.<expSeconds>.<hmacHex>
 *
 *   emailHash    — SHA-256 hex of the normalized email (64 chars)
 *   expSeconds   — unix epoch seconds, base-10
 *   hmacHex      — HMAC-SHA256 hex of "<emailHash>.<expSeconds>"
 *                  with key = VERIFY_TOKEN_SECRET (64 chars)
 *
 * All three segments are hex-only / digit-only, so we can split on
 * literal `.` without escaping. Total length ≈ 142 chars, fits in a
 * URL query parameter without any URL encoding.
 *
 * Verification rules (any failure → 401, opaque body):
 *   1. exactly two `.` separators
 *   2. emailHash is 64 lowercase hex chars
 *   3. expSeconds is a parseable positive integer
 *   4. now ≤ expSeconds (not expired)
 *   5. HMAC matches (constant-time comparison)
 */

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SignedToken {
  token: string;
  expiresAt: number; // unix epoch seconds
}

export async function signVerifyToken(
  secret: string,
  emailHash: string,
  ttlSeconds: number = TOKEN_TTL_SECONDS,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): Promise<SignedToken> {
  if (!secret) throw new Error("verify-token: empty signing secret");
  if (!/^[a-f0-9]{64}$/.test(emailHash)) {
    throw new Error("verify-token: emailHash must be 64-char lowercase hex");
  }
  const expiresAt = nowSeconds + ttlSeconds;
  const payload = `${emailHash}.${expiresAt}`;
  const sig = await hmacHex(secret, payload);
  return { token: `${payload}.${sig}`, expiresAt };
}

export type VerifyResult =
  | { ok: true; emailHash: string }
  | { ok: false; reason: VerifyFailure };

export type VerifyFailure =
  | "malformed"
  | "bad_hash"
  | "bad_exp"
  | "expired"
  | "bad_sig";

export async function verifyVerifyToken(
  secret: string,
  token: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): Promise<VerifyResult> {
  if (!secret) throw new Error("verify-token: empty signing secret");
  if (typeof token !== "string" || token.length > 256) {
    return { ok: false, reason: "malformed" };
  }
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "malformed" };
  const [emailHash, expStr, providedSig] = parts;

  if (!/^[a-f0-9]{64}$/.test(emailHash)) {
    return { ok: false, reason: "bad_hash" };
  }
  if (!/^[0-9]+$/.test(expStr)) {
    return { ok: false, reason: "bad_exp" };
  }
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp <= 0) {
    return { ok: false, reason: "bad_exp" };
  }
  if (nowSeconds > exp) {
    return { ok: false, reason: "expired" };
  }

  const expectedSig = await hmacHex(secret, `${emailHash}.${expStr}`);
  if (!constantTimeHexEq(providedSig, expectedSig)) {
    return { ok: false, reason: "bad_sig" };
  }
  return { ok: true, emailHash };
}

async function hmacHex(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeHexEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
