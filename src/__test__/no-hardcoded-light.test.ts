import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * A dark brand renders every component on a near-black page, so any colour
 * written as a literal instead of a token is a hole in the theme.
 *
 * Two got through the first conversion because the sweep matched utility
 * NAMES (`bg-white`, `text-gray-500`) and these are neither:
 *
 *   bg-gradient-to-b from-df-green-leaf/10 to-white   ← a gradient STOP
 *   --chat-glass-gradient: linear-gradient(..., #ffffff2e, ...)  ← a CSS var
 *
 * The gradient one shipped: dodcyber's chat window faded to solid white at
 * the bottom, so near-white body text finished at about 1.3:1 — measured
 * #ddeeff on #b7dce4 — and the glass drew a white fringe around the panel.
 */
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return walk(p);
    return /\.(astro|tsx|css)$/.test(f) ? [p] : [];
  });
}

const FILES = walk("src").filter((f) => !f.includes("__test__"));

describe("no hardcoded light colours on themed surfaces", () => {
  it("uses no white gradient STOPS", () => {
    const bad = FILES.filter((f) => /\b(to|from|via)-white\b/.test(readFileSync(f, "utf8")));
    expect(bad, "gradient stops must be tokens — a dark page fades to white").toEqual([]);
  });

  it("keeps the glass tint in variables the theme can override", () => {
    // The literals may exist as the LIGHT default, but only on the tint vars —
    // never inline in the gradient or the border, where nothing can reach them.
    const hero = readFileSync("src/components/sections/HeroSection.astro", "utf8");
    // The light values must be FALLBACKS, never declarations on the wrapper.
    // A custom property declared on the element shadows the inherited one for
    // its whole subtree regardless of cascade order — the first attempt at
    // this fix was present in the document and changed nothing.
    expect(hero).toMatch(/var\(--glass-tint-a,\s*#ffffff2e\)/);
    expect(hero).toMatch(/var\(--glass-tint-b,\s*#ffffff26\)/);
    expect(hero).toMatch(/border:\s*1px solid var\(--glass-border,/);
    expect(hero).toMatch(/var\(--glass-shadow,/);
    expect(hero).not.toMatch(/^\s*--glass-(tint-a|tint-b|border|shadow)\s*:/m);
  });

  it("has a dark override for every glass variable it defines", () => {
    // A default with no override is a light value that ships to a dark page.
    const layout = readFileSync("src/layouts/Landing.astro", "utf8");
    for (const v of ["--glass-tint-a", "--glass-tint-b", "--glass-border", "--glass-shadow"])
      expect(layout, `${v} needs a dark-brand override`).toContain(v);
  });

  it("does not ring themed cards in literal black", () => {
    // `ring-black/5` is invisible on black and reads as a hairline on cream —
    // the token version does the right thing on both.
    const bad = FILES.filter((f) => /\bring-black\//.test(readFileSync(f, "utf8")));
    expect(bad).toEqual([]);
  });
});
