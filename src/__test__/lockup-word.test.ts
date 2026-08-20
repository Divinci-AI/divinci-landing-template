import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * The `[name] AI` lockup.
 *
 * Acme Renew's hero rendered the full legal name — "Acme Renew Integrative
 * Medicine" — which wrapped to two lines and left "AI" stranded at the upper
 * right, so it stopped reading as one lockup at all. `lockupName` lets a brand
 * supply a short form ("AcmeRenewIM") for this one purpose without changing the
 * name used in copy, OG tags or the chat byline.
 */

async function withBrand(identity: Record<string, unknown>) {
  vi.resetModules();
  vi.doMock("~/brand.config", () => ({ brand: { identity } }));
  return (await import("../lib/lockup-word")).lockupWord;
}

beforeEach(() => vi.resetModules());

describe("lockupWord", () => {
  it("prefers lockupName over the full siteName", async () => {
    const f = await withBrand({ siteName: "Acme Renew Integrative Medicine", lockupName: "AcmeRenewIM" });
    expect(f()).toBe("AcmeRenewIM");
  });

  it("falls back to siteName when no short form is given", async () => {
    const f = await withBrand({ siteName: "Ansir Cowork" });
    expect(f()).toBe("Ansir Cowork");
  });

  it("strips a trailing AI so the lockup does not read 'AcmePath AI AI'", async () => {
    // The lockup draws "AI" itself as a separate styled element.
    expect(await (await withBrand({ siteName: "AcmePath AI" }))()).toBe("AcmePath");
    expect(await (await withBrand({ siteName: "X", lockupName: "AcmeRenewIM AI" }))()).toBe("AcmeRenewIM");
  });

  it("does not strip 'AI' from the middle of a name", async () => {
    const f = await withBrand({ siteName: "Xenon AI Labs" });
    expect(f()).toBe("Xenon AI Labs");
  });

  it("never returns an empty string", async () => {
    // A name that is ONLY "AI" would otherwise strip to nothing and render a
    // lockup with no brand on it.
    const f = await withBrand({ siteName: "AI" });
    expect(f()).toBe("AI");
  });
});

describe("both lockups use the shared resolver", () => {
  // The header and hero each drew the name with their own inline
  // `.replace(/\s*\bai\s*$/i, "")`. Duplicated logic is how the citation badge
  // ended up fixed in one file and broken in the other.
  for (const rel of ["../components/Header.astro", "../components/sections/HeroSection.astro"]) {
    it(`${rel.split("/").pop()} calls the resolver rather than inlining the rule`, () => {
      const src = readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");
      expect(src).toContain("lockup-word");
      expect(src).toContain("lockupWord");
      expect(src).not.toMatch(/brand\.identity\.siteName\.replace/);
    });
  }
});
