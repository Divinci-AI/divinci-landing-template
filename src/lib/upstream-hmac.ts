/**
 * Phase 3 — HMAC-signed-request headers for the Divinci upstream
 * anonymous-chat endpoint.
 *
 * The landing-page worker stamps each upstream call with two headers:
 *
 *   X-Landing-Page-Ts:  <unix-epoch-seconds>
 *   X-Landing-Page-Sig: HMAC-SHA256(LANDING_PAGE_HMAC_KEY,
 *                                   `${ts}.${releaseId}.${newPrompt}`)
 *
 * The upstream's anonymous-chat middleware re-computes the HMAC with
 * the same shared secret and rejects requests where:
 *   1. headers are missing AND the release is configured as
 *      "landing-page-only" (rejects direct-curl), OR
 *   2. computed sig != provided sig, OR
 *   3. abs(now - ts) > 300 (5 min window — covers clock skew + a
 *      short replay window without giving an attacker more than that)
 *
 * The signature MUST include the `newPrompt` so that an attacker who
 * snoops one valid (ts, sig) pair from a victim's request can't reuse
 * it to send arbitrary prompts to the upstream. Without the prompt in
 * the payload, the ts/sig pair would be a generic "I'm the landing
 * page" stamp valid for 5 minutes.
 *
 * Returns null when the HMAC key is unset — caller skips the headers,
 * upstream just doesn't see them. Lets us ship the landing-page side
 * before the upstream side is ready without breaking anything.
 */

export interface UpstreamHmacInput {
  hmacKey: string | undefined;
  releaseId: string;
  newPrompt: string;
  nowSeconds?: number;
}

export interface UpstreamHmacHeaders {
  "X-Landing-Page-Ts": string;
  "X-Landing-Page-Sig": string;
}

export async function computeUpstreamHmacHeaders(
  input: UpstreamHmacInput,
): Promise<UpstreamHmacHeaders | null> {
  if (!input.hmacKey) return null;
  const ts = input.nowSeconds ?? Math.floor(Date.now() / 1000);
  const payload = `${ts}.${input.releaseId}.${input.newPrompt}`;
  const sig = await hmacHex(input.hmacKey, payload);
  return {
    "X-Landing-Page-Ts": String(ts),
    "X-Landing-Page-Sig": sig,
  };
}

/**
 * Mirror of the verification logic that the upstream Express
 * middleware will run. Exported here so we can unit-test the round
 * trip end-to-end without bouncing through the upstream during
 * landing-page development. The actual upstream implementation lives
 * in `workspace/servers/public-api/src/...` in the Divinci monorepo
 * — see PHASE-3-HANDOFF.md for the spec.
 */
export async function verifyUpstreamHmac(args: {
  hmacKey: string;
  releaseId: string;
  newPrompt: string;
  providedTs: string;
  providedSig: string;
  nowSeconds?: number;
  windowSeconds?: number;
}): Promise<
  | { ok: true }
  | { ok: false; reason: "bad_ts" | "expired" | "future" | "bad_sig" }
> {
  const ts = Number(args.providedTs);
  if (!Number.isFinite(ts) || ts <= 0) return { ok: false, reason: "bad_ts" };
  const now = args.nowSeconds ?? Math.floor(Date.now() / 1000);
  const window = args.windowSeconds ?? 300;
  if (now - ts > window) return { ok: false, reason: "expired" };
  if (ts - now > window) return { ok: false, reason: "future" };
  const expected = await hmacHex(
    args.hmacKey,
    `${args.providedTs}.${args.releaseId}.${args.newPrompt}`,
  );
  return constantTimeHexEq(args.providedSig, expected)
    ? { ok: true }
    : { ok: false, reason: "bad_sig" };
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
