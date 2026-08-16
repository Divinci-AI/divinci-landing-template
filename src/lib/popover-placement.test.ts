import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { placeBelow } from "../lib/popover-placement";

// A citation chip near the TOP of the transcript, bubble 160px tall, 8px gap.
// The old rule was `!(roomAbove >= h + gap) && roomBelow > roomAbove`.
describe("placeBelow", () => {
  it("opens DOWNWARD for a chip near the top of the viewport", () => {
    // The Aquillius case: 180px above (enough, but only just), 620px below.
    // The old rule saw above "fits" and opened upward across the conversation.
    expect(placeBelow(180, 620, 160, 8)).toBe(true);
  });

  it("opens UPWARD for a chip near the bottom", () => {
    expect(placeBelow(620, 180, 160, 8)).toBe(false);
  });

  it("takes the side that FITS even when the other has more room", () => {
    // Below fits exactly; above is roomier but cannot hold the bubble. Opening
    // upward here means clamping to the viewport edge, on top of the anchor.
    expect(placeBelow(100, 168, 160, 8)).toBe(true);
    expect(placeBelow(168, 100, 160, 8)).toBe(false);
  });

  it("falls back to the roomier side when neither fits", () => {
    expect(placeBelow(50, 90, 400, 8)).toBe(true);
    expect(placeBelow(90, 50, 400, 8)).toBe(false);
  });

  it("keeps the original placement when the two sides are symmetric", () => {
    // A tie must not silently move every existing bubble.
    expect(placeBelow(300, 300, 160, 8)).toBe(false);
  });
});

// Both popovers must go through this module. Two copies of the rule is exactly
// how the showcase stayed broken after the React chat was fixed — the demo
// still opened its citation bubble upward across the message.
describe("there is only ONE placement rule", () => {
  it("neither popover re-implements the above/below decision", async () => {
    const { readFileSync } = await import("node:fs");
    for (const f of [
      "src/components/chat/FloatingLayer.tsx",
      "src/components/sections/TranscriptShowcase.astro",
    ]) {
      const src = readFileSync(f, "utf8");
      expect(src, `${f} must call the shared rule`).toContain("placeBelow(");
      // The two original forms, either of which prefers ABOVE whenever above
      // merely fits.
      expect(src, `${f} re-implements the rule`).not.toMatch(/const above = a\.top >= t\.height/);
      expect(src, `${f} re-implements the rule`).not.toMatch(/!\(roomAbove >= h \+ gap\)/);
    }
  });
});

describe("lockupMarkSplit", () => {
  it("is null unless the brand opts in", async () => {
    // Never inferred from a square aspect ratio — that would silently eat the
    // first letter of every brand whose mark is not its initial.
    const src = readFileSync("src/lib/lockup-word.ts", "utf8");
    expect(src).toContain("logoDepictsPrefix");
    expect(src).toMatch(/if \(!prefix\) return null;/);
  });

  it("refuses a prefix the name does not start with", () => {
    const src = readFileSync("src/lib/lockup-word.ts", "utf8");
    expect(src).toMatch(/startsWith\(prefix\.toLowerCase\(\)\)\) return null/);
  });

  it("refuses when nothing would be left to set beside the mark", () => {
    const src = readFileSync("src/lib/lockup-word.ts", "utf8");
    expect(src).toMatch(/if \(!rest\.trim\(\)\) return null;/);
  });
});
