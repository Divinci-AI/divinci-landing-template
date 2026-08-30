import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * The hero lockup must align "AI" to the wordmark's LAST baseline.
 *
 * Flex baseline alignment uses an item's FIRST baseline. So the moment a brand
 * name wrapped, "AI" stayed pinned beside line 1 while the name ran on
 * underneath it. Measured on live demos: exactly one line-height adrift at two
 * lines (-48px) and two at three lines (-96px). The tell is that the error is
 * always a whole multiple of line-height — nothing else produces that.
 *
 * 32 of 71 deployed demos were showing it, mostly on mobile but also at 1440px
 * for any name long enough to wrap.
 *
 * `last baseline` was chosen over `flex-end`/`end` because those align bottom
 * EDGES, which is the exact bug the surrounding comments describe fixing with
 * items-baseline in the first place: an image baselines on its bottom edge but
 * a text box extends below its baseline by the descender depth, so edge
 * alignment reintroduces the descender gap on every image wordmark.
 *
 * Measured before/after on the built stylesheet, via the real DOM:
 *   one line     0px  ->    0px   (unchanged — it has only one baseline)
 *   two lines  -48px  ->    0px
 *   three      -96px  ->    0px
 *   image        n/a  ->  unchanged (first and last baseline are both its edge)
 */

const HERO = readFileSync(
  fileURLToPath(new URL("../components/sections/HeroSection.astro", import.meta.url)),
  "utf8",
);

describe("hero lockup baseline alignment", () => {
  it("does not leave items-baseline on the lockup container", () => {
    // The Tailwind utility would win or lose depending on ordering; the rule
    // below is the single source of truth.
    const div = HERO.match(/<div class="hero-lockup[^"]*"/)?.[0] ?? "";
    expect(div).not.toContain("items-baseline");
  });

  it("aligns to the last baseline", () => {
    expect(HERO).toMatch(/\.hero-lockup\s*\{[^}]*align-items:\s*last baseline/s);
  });

  it("keeps a plain-baseline fallback for browsers without support", () => {
    // The failure mode of this rule must be "no change", never "worse":
    // without any align-items the container falls back to `stretch`.
    expect(HERO).toMatch(/\.hero-lockup\s*\{\s*align-items:\s*baseline;\s*\}/);
  });

  it("guards the fallback with @supports, not two declarations", () => {
    /**
     * ⚠️ The two-declaration idiom (same property twice, invalid one ignored)
     * DOES NOT SURVIVE THIS BUILD. Lightning CSS deduplicates them and emits
     * only `align-items:last baseline`, so a browser without support would get
     * no align-items at all — `stretch`, which is worse than the bug this
     * fixes. Caught by reading dist/, which is the only thing that answers what
     * actually ships.
     */
    expect(HERO).toMatch(/@supports \(align-items: last baseline\)/);
    expect(HERO).not.toMatch(/align-items:\s*baseline;\s*align-items:\s*last baseline/);
  });

  it("does not use edge alignment, which regresses image wordmarks", () => {
    const rule = HERO.match(/\.hero-lockup\s*\{[^}]*\}/s)?.[0] ?? "";
    expect(rule).not.toMatch(/align-items:\s*(flex-end|end|center)/);
  });
});
