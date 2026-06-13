import { describe, it, expect } from "vitest";
import {
  computeUpstreamHmacHeaders,
  verifyUpstreamHmac,
} from "./upstream-hmac";

const KEY = "phase-3-test-shared-secret-do-not-use-anywhere-else";
const RELEASE = "rel-abc-123";

describe("upstream-hmac", () => {
  it("returns null when the key is unset", async () => {
    expect(
      await computeUpstreamHmacHeaders({
        hmacKey: undefined,
        releaseId: RELEASE,
        newPrompt: "hi",
      }),
    ).toBeNull();
    expect(
      await computeUpstreamHmacHeaders({
        hmacKey: "",
        releaseId: RELEASE,
        newPrompt: "hi",
      }),
    ).toBeNull();
  });

  it("round-trips: signed headers verify on the upstream side", async () => {
    const headers = await computeUpstreamHmacHeaders({
      hmacKey: KEY,
      releaseId: RELEASE,
      newPrompt: "What is the Nutritarian diet?",
      nowSeconds: 1_000_000,
    });
    expect(headers).not.toBeNull();
    const verify = await verifyUpstreamHmac({
      hmacKey: KEY,
      releaseId: RELEASE,
      newPrompt: "What is the Nutritarian diet?",
      providedTs: headers!["X-Landing-Page-Ts"],
      providedSig: headers!["X-Landing-Page-Sig"],
      nowSeconds: 1_000_005,
    });
    expect(verify).toEqual({ ok: true });
  });

  it("rejects when the prompt was tampered after signing", async () => {
    const headers = await computeUpstreamHmacHeaders({
      hmacKey: KEY,
      releaseId: RELEASE,
      newPrompt: "innocent prompt",
      nowSeconds: 1_000_000,
    });
    const verify = await verifyUpstreamHmac({
      hmacKey: KEY,
      releaseId: RELEASE,
      newPrompt: "ATTACKER REPLACED PROMPT",
      providedTs: headers!["X-Landing-Page-Ts"],
      providedSig: headers!["X-Landing-Page-Sig"],
      nowSeconds: 1_000_005,
    });
    expect(verify).toEqual({ ok: false, reason: "bad_sig" });
  });

  it("rejects when the release id was tampered", async () => {
    const headers = await computeUpstreamHmacHeaders({
      hmacKey: KEY,
      releaseId: RELEASE,
      newPrompt: "hi",
      nowSeconds: 1_000_000,
    });
    const verify = await verifyUpstreamHmac({
      hmacKey: KEY,
      releaseId: "different-release",
      newPrompt: "hi",
      providedTs: headers!["X-Landing-Page-Ts"],
      providedSig: headers!["X-Landing-Page-Sig"],
      nowSeconds: 1_000_005,
    });
    expect(verify).toEqual({ ok: false, reason: "bad_sig" });
  });

  it("rejects expired timestamps (>5 min in past)", async () => {
    const headers = await computeUpstreamHmacHeaders({
      hmacKey: KEY,
      releaseId: RELEASE,
      newPrompt: "hi",
      nowSeconds: 1_000_000,
    });
    const verify = await verifyUpstreamHmac({
      hmacKey: KEY,
      releaseId: RELEASE,
      newPrompt: "hi",
      providedTs: headers!["X-Landing-Page-Ts"],
      providedSig: headers!["X-Landing-Page-Sig"],
      nowSeconds: 1_000_000 + 301,
    });
    expect(verify).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects future-stamped timestamps (>5 min ahead)", async () => {
    const headers = await computeUpstreamHmacHeaders({
      hmacKey: KEY,
      releaseId: RELEASE,
      newPrompt: "hi",
      nowSeconds: 2_000_000,
    });
    const verify = await verifyUpstreamHmac({
      hmacKey: KEY,
      releaseId: RELEASE,
      newPrompt: "hi",
      providedTs: headers!["X-Landing-Page-Ts"],
      providedSig: headers!["X-Landing-Page-Sig"],
      nowSeconds: 1_000_000, // verifier's clock is way behind
    });
    expect(verify).toEqual({ ok: false, reason: "future" });
  });

  it("rejects when the key differs between signer and verifier", async () => {
    const headers = await computeUpstreamHmacHeaders({
      hmacKey: KEY,
      releaseId: RELEASE,
      newPrompt: "hi",
      nowSeconds: 1_000_000,
    });
    const verify = await verifyUpstreamHmac({
      hmacKey: "different-key",
      releaseId: RELEASE,
      newPrompt: "hi",
      providedTs: headers!["X-Landing-Page-Ts"],
      providedSig: headers!["X-Landing-Page-Sig"],
      nowSeconds: 1_000_005,
    });
    expect(verify).toEqual({ ok: false, reason: "bad_sig" });
  });

  it("rejects malformed timestamps", async () => {
    const v = await verifyUpstreamHmac({
      hmacKey: KEY,
      releaseId: RELEASE,
      newPrompt: "hi",
      providedTs: "not-a-number",
      providedSig: "f".repeat(64),
    });
    expect(v).toEqual({ ok: false, reason: "bad_ts" });
  });
});
