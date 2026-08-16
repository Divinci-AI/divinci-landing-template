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

describe("the assistant has ONE face", () => {
  it("no component re-implements the avatar fallback chain", () => {
    // Three near-identical copies had drifted: the hero and the live
    // transcript fell straight to INITIALS while the showcase directly below
    // used the brand logo, so one page showed "DC" and the customer's icon
    // for the same assistant.
    const users = ["src/components/chat/WelcomeMessage.tsx",
                   "src/components/chat/Transcript.tsx",
                   "src/components/chat/ChatIsland.tsx"];
    for (const f of users) {
      const src = readFileSync(f, "utf8");
      expect(src, `${f} must use the shared avatar`).toContain("BrandAvatar");
      expect(src, `${f} re-implements the fallback`).not.toContain("brandInitials(");
    }
  });

  it("prefers the brand mark over initials", () => {
    const src = readFileSync("src/components/chat/BrandAvatar.tsx", "utf8");
    expect(src.indexOf("brand.media.logo")).toBeLessThan(src.indexOf("brandInitials("));
    // A wordmark cropped to fill a small circle is unreadable.
    expect(src).toContain("object-contain");
  });
});

describe("hover states follow the brand, not the template", () => {
  it("the welcome bubble's hover colour is the brand's bubble token", () => {
    // Was `rgba(220, 234, 220, 0.85) !important` — the template's original
    // sage — so hovering turned EVERY customer's bubble green, and on a dark
    // brand painted a near-white slab under near-white text.
    // Comments are stripped first: this file explains the old value in prose,
    // and a guard that reads its own documentation is checking nothing.
    const hero = readFileSync("src/components/sections/HeroSection.astro", "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "");
    const rule = hero.slice(hero.indexOf(":hover .welcome-bubble")).slice(0, 400);
    expect(rule).toContain("--color-df-bubble-user");
    expect(rule).not.toMatch(/rgba\(220,\s*234,\s*220/);
  });
});

describe("a wordmark is never used as a circular avatar", () => {
  it("BrandAvatar requires logoIsMark before using the logo", () => {
    // Applied BioCode's logo is 1248x138. At 70% of a 36px circle that is
    // ~25px wide and under 3px tall — a smear — and the showcase's 16px
    // version read as barcode stripes. object-contain keeps it undistorted
    // without making it legible; there is no scale of a horizontal lockup
    // that works in a small circle.
    const src = readFileSync("src/components/chat/BrandAvatar.tsx", "utf8");
    expect(src).toMatch(/brand\.media\.logo && brand\.media\.logoIsMark/);
  });

  it("the showcase avatars are gated the same way", () => {
    const src = readFileSync("src/components/sections/TranscriptShowcase.astro", "utf8");
    // Every logo <img> in an avatar position must sit behind the mark check.
    const avatarImgs = src.match(/<img src=\{brand\.media\.logo\}[^>]*class="h-4 w-4"/g) || [];
    for (const _ of avatarImgs) expect(src).toContain("brand.media.logoIsMark ? (");
    expect(src).toContain("brandInitials(");
  });
});
