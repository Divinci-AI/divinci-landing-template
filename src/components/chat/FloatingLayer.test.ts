import { describe, it, expect } from "vitest";
import { placeBelow } from "./FloatingLayer";

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
