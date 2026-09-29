import { describe, expect, it } from "vitest";
import { advisoryAddsInformation, detectRefusal, humanizeReply } from "./refusal-copy";

// Verbatim from diet-doctor.demos and orthocincy.demos, 2026-09-28.
const LIVE = "I can't help with that request.\n\nMessage considered harmful (Specialized Advice).";

describe("refusal copy", () => {
  it("rewrites the live Specialized Advice refusal without classifier vocabulary", () => {
    const out = humanizeReply(LIVE);
    expect(out).not.toMatch(/harmful|Specialized Advice|moderation/i);
    expect(out).toMatch(/qualified professional/);
  });
  it("handles an unlabelled and a no-reason refusal", () => {
    expect(humanizeReply("I can't help with that request.\n\nMessage considered harmful.")).not.toMatch(/harmful/i);
    expect(humanizeReply("This message did not pass content moderation.")).not.toMatch(/moderation/i);
  });
  it("leaves ordinary answers alone, even one that starts the same way", () => {
    const real = "I can't help with that request. But our booking page is https://x.example/book.";
    expect(humanizeReply(real)).toBe(real);
    expect(humanizeReply("We accept most insurance plans.")).toBe("We accept most insurance plans.");
  });
  it("hides the banner that only repeats the refusal, keeps a genuine advisory", () => {
    expect(advisoryAddsInformation(LIVE, LIVE)).toBe(false);
    expect(advisoryAddsInformation("If this is an emergency call 911.", "Here is what the guide says.")).toBe(true);
    expect(advisoryAddsInformation(undefined, "x")).toBe(false);
  });
  it("reports categories", () => {
    expect(detectRefusal(LIVE)).toEqual({ categories: ["Specialized Advice"] });
  });
});
