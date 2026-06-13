import { describe, it, expect } from "vitest";
import { signVerifyToken, verifyVerifyToken } from "./verify-token";

const SECRET = "test-secret-very-long-and-random-do-not-use-in-prod";
const HASH = "a".repeat(64); // 64-char hex stand-in

describe("verify-token", () => {
  describe("sign", () => {
    it("produces a 3-segment token with the expected shape", async () => {
      const { token, expiresAt } = await signVerifyToken(
        SECRET,
        HASH,
        3600,
        1_000_000,
      );
      const parts = token.split(".");
      expect(parts).toHaveLength(3);
      expect(parts[0]).toBe(HASH);
      expect(parts[1]).toBe("1003600");
      expect(parts[2]).toMatch(/^[a-f0-9]{64}$/);
      expect(expiresAt).toBe(1_003_600);
    });

    it("throws on a non-hex hash", async () => {
      await expect(
        signVerifyToken(SECRET, "not-64-hex"),
      ).rejects.toThrow(/emailHash/);
    });

    it("throws on an empty secret", async () => {
      await expect(signVerifyToken("", HASH)).rejects.toThrow(/secret/);
    });
  });

  describe("verify", () => {
    it("accepts a freshly-signed token", async () => {
      const { token } = await signVerifyToken(SECRET, HASH, 3600, 1_000_000);
      const result = await verifyVerifyToken(SECRET, token, 1_001_000);
      expect(result).toEqual({ ok: true, emailHash: HASH });
    });

    it("rejects an expired token", async () => {
      const { token } = await signVerifyToken(SECRET, HASH, 3600, 1_000_000);
      const result = await verifyVerifyToken(SECRET, token, 1_010_000);
      expect(result).toEqual({ ok: false, reason: "expired" });
    });

    it("rejects a token signed with a different secret", async () => {
      const { token } = await signVerifyToken(SECRET, HASH, 3600, 1_000_000);
      const result = await verifyVerifyToken(
        "different-secret",
        token,
        1_001_000,
      );
      expect(result).toEqual({ ok: false, reason: "bad_sig" });
    });

    it("rejects tampered hash (different bytes, same length)", async () => {
      const { token } = await signVerifyToken(SECRET, HASH, 3600, 1_000_000);
      const parts = token.split(".");
      const tampered = `${"b".repeat(64)}.${parts[1]}.${parts[2]}`;
      const result = await verifyVerifyToken(SECRET, tampered, 1_001_000);
      expect(result).toEqual({ ok: false, reason: "bad_sig" });
    });

    it("rejects tampered expiry (extends lifetime)", async () => {
      const { token } = await signVerifyToken(SECRET, HASH, 3600, 1_000_000);
      const parts = token.split(".");
      const tampered = `${parts[0]}.${Number(parts[1]) + 999_999}.${parts[2]}`;
      const result = await verifyVerifyToken(SECRET, tampered, 1_001_000);
      expect(result).toEqual({ ok: false, reason: "bad_sig" });
    });

    it("rejects non-3-segment tokens", async () => {
      expect(await verifyVerifyToken(SECRET, "")).toEqual({
        ok: false,
        reason: "malformed",
      });
      expect(await verifyVerifyToken(SECRET, "a.b")).toEqual({
        ok: false,
        reason: "malformed",
      });
      expect(await verifyVerifyToken(SECRET, "a.b.c.d")).toEqual({
        ok: false,
        reason: "malformed",
      });
    });

    it("rejects pathological-length tokens before doing crypto work", async () => {
      const huge = "a".repeat(10_000);
      const result = await verifyVerifyToken(SECRET, huge);
      expect(result).toEqual({ ok: false, reason: "malformed" });
    });

    it("rejects hash with wrong character class", async () => {
      const { token } = await signVerifyToken(SECRET, HASH, 3600, 1_000_000);
      const parts = token.split(".");
      // 64-char but with a capital letter (not lowercase hex)
      const badHash = "A".repeat(64);
      const tampered = `${badHash}.${parts[1]}.${parts[2]}`;
      const result = await verifyVerifyToken(SECRET, tampered, 1_001_000);
      expect(result).toEqual({ ok: false, reason: "bad_hash" });
    });

    it("rejects non-numeric expiry", async () => {
      const { token } = await signVerifyToken(SECRET, HASH, 3600, 1_000_000);
      const parts = token.split(".");
      const tampered = `${parts[0]}.notanumber.${parts[2]}`;
      const result = await verifyVerifyToken(SECRET, tampered, 1_001_000);
      expect(result).toEqual({ ok: false, reason: "bad_exp" });
    });
  });

  describe("round-trip resilience", () => {
    it("emits a verifiable token for many different hashes", async () => {
      const hashes = Array.from({ length: 20 }, (_, i) =>
        (i.toString(16).padStart(2, "0") + "f".repeat(62)).slice(0, 64),
      );
      for (const h of hashes) {
        const { token } = await signVerifyToken(SECRET, h);
        const result = await verifyVerifyToken(SECRET, token);
        expect(result).toEqual({ ok: true, emailHash: h });
      }
    });
  });
});
