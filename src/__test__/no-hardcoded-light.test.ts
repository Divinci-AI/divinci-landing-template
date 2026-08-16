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
    expect(hero).toContain("--chat-glass-tint-a");
    expect(hero).toContain("--chat-glass-border");
    expect(hero).toMatch(/border:\s*1px solid var\(--chat-glass-border\)/);
    expect(hero).not.toMatch(/--chat-glass-gradient:\s*linear-gradient\(135deg,\s*#fff/);
  });

  it("has a dark override for every glass variable it defines", () => {
    // A default with no override is a light value that ships to a dark page.
    const layout = readFileSync("src/layouts/Landing.astro", "utf8");
    for (const v of ["--chat-glass-tint-a", "--chat-glass-tint-b", "--chat-glass-border", "--chat-glass-shadow"])
      expect(layout, `${v} needs a dark-brand override`).toContain(v);
  });

  it("does not ring themed cards in literal black", () => {
    // `ring-black/5` is invisible on black and reads as a hairline on cream —
    // the token version does the right thing on both.
    const bad = FILES.filter((f) => /\bring-black\//.test(readFileSync(f, "utf8")));
    expect(bad).toEqual([]);
  });
});
