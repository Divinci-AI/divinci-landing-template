/**
 * Cross-repo drift tripwire for the platform language registry.
 *
 * The 36-language registry is duplicated by necessity in two places:
 *   - DrFurman:  LOCALES (this repo, src/i18n/locales.ts)
 *   - server:    PLATFORM_LANGUAGES (@divinci-ai/models in the server repo)
 *
 * This repo needs its copy at BUILD time (static locale-page generation,
 * hreflang, per-locale translation dictionaries in src/i18n/ui/<code>.ts),
 * so a shared runtime source can't remove it. Drift is fail-safe — the
 * server's response-language allowlist silently ignores any language the
 * landing page shows that the server doesn't know — but a divergence
 * still produces a soft UX mismatch (visitor picks a language, gets the
 * default).
 *
 * This test makes that divergence fail loudly. Both repos compute a
 * canonical SHA-256 over their own `{code, englishName, autonym, dir}`
 * rows (in registry order) and assert it equals the SAME stamp below. If
 * you change the language set:
 *   1. this test prints the new hash on failure — copy it here, AND
 *   2. update the identical constant in the server repo's
 *      workspace/resources/models/tests/languages/registry-drift.test.ts
 * If the two stamps ever differ, one repo's CI goes red.
 */
import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { LOCALES } from "./locales";

/**
 * SHARED STAMP — must be byte-identical to the server repo's
 * LANGUAGE_REGISTRY_SHA256. See file header before changing.
 */
const LANGUAGE_REGISTRY_SHA256 =
  "539a93b416949e71754fafc773a4790ccbb69f25158ba12abba2a9ceef384ec9";

const EXPECTED_COUNT = 36;

/** Canonical projection → JSON → sha256. Key order is fixed explicitly. */
function canonicalSha256(
  list: ReadonlyArray<{
    code: string;
    englishName: string;
    autonym: string;
    dir: string;
  }>,
): string {
  const projected = list.map((l) => ({
    code: l.code,
    englishName: l.englishName,
    autonym: l.autonym,
    dir: l.dir,
  }));
  return createHash("sha256")
    .update(JSON.stringify(projected), "utf8")
    .digest("hex");
}

describe("DrFurman locale registry — drift tripwire", () => {
  it(`has exactly ${EXPECTED_COUNT} locales`, () => {
    expect(LOCALES).toHaveLength(EXPECTED_COUNT);
  });

  it("has unique codes", () => {
    const codes = LOCALES.map((l) => l.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("has English first and every row well-formed", () => {
    expect(LOCALES[0].code).toBe("en");
    for (const l of LOCALES) {
      expect(l.code).toMatch(/^[a-z]{2,3}(-[a-z]+)?$/);
      expect(l.englishName.length).toBeGreaterThan(0);
      expect(l.autonym.length).toBeGreaterThan(0);
      expect(l.dir === "ltr" || l.dir === "rtl").toBe(true);
    }
  });

  it("matches the cross-repo registry stamp (sync server PLATFORM_LANGUAGES if this fails)", () => {
    const actual = canonicalSha256(LOCALES);
    // On failure, `actual` is the new hash to paste here AND into the
    // server repo's registry-drift.test.ts.
    expect(actual).toBe(LANGUAGE_REGISTRY_SHA256);
  });
});
