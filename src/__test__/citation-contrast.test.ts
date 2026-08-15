import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * The inline `[[n]]` citation badge must be READABLE.
 *
 * It rendered `text-df-green-dark` on `bg-df-green-leaf/30`. Against
 * BioRenew's gold palette that measures **2.06:1** — the numeral showed as a
 * coloured smudge inside a coloured chip. At `text-[0.65em]` it needs *more*
 * contrast than body text, not less; WCAG AA for normal text is 4.5:1 and
 * small text has no lower bar.
 *
 * This computes the real composite from real palettes rather than eyeballing a
 * screenshot, so a future tint change that quietly drops contrast fails here.
 */

const TRANSCRIPT = fileURLToPath(new URL("../components/chat/Transcript.tsx", import.meta.url));

type RGB = { r: number; g: number; b: number };

function hex(h: string): RGB {
  const s = h.replace("#", "");
  const n = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return { r: parseInt(n.slice(0, 2), 16), g: parseInt(n.slice(2, 4), 16), b: parseInt(n.slice(4, 6), 16) };
}

/** Alpha-composite `fg` at `a` over `bg` — what an `/NN` opacity tint yields. */
function over(fg: RGB, a: number, bg: RGB): RGB {
  return {
    r: Math.round(a * fg.r + (1 - a) * bg.r),
    g: Math.round(a * fg.g + (1 - a) * bg.g),
    b: Math.round(a * fg.b + (1 - a) * bg.b),
  };
}

function luminance({ r, g, b }: RGB): number {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a: RGB, b: RGB): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Real palettes from generated demos — not invented swatches. */
const PALETTES = {
  // runs/biorenewim/2026-08-14-001 — the demo that surfaced this.
  biorenew: { leaf: "#d6ad62", dark: "#af812e", text: "#000000", bubble: "#ccccff" },
  // The template's own defaults.
  divinci: { leaf: "#9ec947", dark: "#3b6b3f", text: "#1a1a1a", bubble: "#eef4e4" },
};

describe("citation badge contrast", () => {
  it("the OLD pairing was genuinely unreadable — this is the regression", () => {
    const p = PALETTES.biorenew;
    const bg = over(hex(p.leaf), 0.3, hex(p.bubble));
    expect(contrast(hex(p.dark), bg)).toBeLessThan(3);
  });

  for (const [name, p] of Object.entries(PALETTES)) {
    it(`clears 4.5:1 on the ${name} palette`, () => {
      // The shipped pairing: bg-df-green-leaf/45 + text-df-text.
      const bg = over(hex(p.leaf), 0.45, hex(p.bubble));
      expect(contrast(hex(p.text), bg)).toBeGreaterThanOrEqual(4.5);
    });
  }

  it("the component still uses the pairing this test measures", () => {
    // Without this the numbers above drift away from the markup and the test
    // keeps passing while the badge goes dark again.
    const src = readFileSync(TRANSCRIPT, "utf8");
    const cite = src.slice(src.indexOf("df-cite"), src.indexOf("df-cite") + 400);
    expect(cite).toContain("bg-df-green-leaf/45");
    expect(cite).toContain("text-df-text");
    expect(cite).not.toContain("text-df-green-dark");
  });
});
