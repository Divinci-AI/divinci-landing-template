import { describe, it, expect } from "vitest";
import { luminance, contrastRatio, readableOn, buttonColors, AA_TEXT } from "./contrast";

/**
 * AuraPath's real extracted palette — the one that produced an invisible CTA.
 * Both colours are nearly black because their site is a warm dark/cream design
 * with no bright accent, which is exactly the case the template's styling
 * assumed away.
 */
const AURAPATH = { primary: "#1a1610", accent: "#0f0d08", cream: "#f7fafc" };
/** A palette matching the template's original assumption: a bright accent. */
const BRIGHT = { primary: "#0f2c3f", accent: "#7ed957", cream: "#f7fafc" };

describe("contrastRatio", () => {
  it("anchors at the known extremes", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(contrastRatio("#123456", "#123456")).toBeCloseTo(1, 5);
  });

  it("is symmetric — order of arguments cannot matter", () => {
    expect(contrastRatio("#1a1610", "#f7fafc")).toBeCloseTo(contrastRatio("#f7fafc", "#1a1610"), 10);
  });

  it("accepts 3-digit hex", () => {
    expect(contrastRatio("#fff", "#000")).toBeCloseTo(21, 1);
  });

  it("measures the AuraPath CTA as effectively invisible", () => {
    // The bug, quantified: 1.08:1 where AA needs 4.5:1.
    expect(contrastRatio(AURAPATH.accent, AURAPATH.primary)).toBeLessThan(1.2);
  });
});

describe("luminance", () => {
  it("orders colours as the eye does", () => {
    expect(luminance("#ffffff")).toBeGreaterThan(luminance("#808080"));
    expect(luminance("#808080")).toBeGreaterThan(luminance("#000000"));
  });
});

describe("readableOn", () => {
  it("prefers the brand's own colour when it is no worse", () => {
    // Ties go to the brand: a palette that already works is never overridden.
    expect(readableOn("#ffffff", "#000000", "#000000")).toBe("#000000");
  });

  it("switches when the brand's colour is genuinely less readable", () => {
    expect(readableOn("#ffffff", "#fefefe", "#000000")).toBe("#000000");
  });
});

describe("buttonColors", () => {
  it("rescues the AuraPath CTA to a legible pair", () => {
    const c = buttonColors(AURAPATH.primary, AURAPATH.accent, AURAPATH.primary, AURAPATH.cream);
    expect(contrastRatio(c.text, c.bg)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrastRatio(c.bg, AURAPATH.primary)).toBeGreaterThanOrEqual(3);
  });

  it("labels in the brand's own dark, not pure black, when that clears AA", () => {
    // These pages exist to look like the customer's site. Pure black always
    // wins on ratio and reads as off-brand on a warm palette, so legibility is
    // a threshold to clear, not a number to maximise.
    const c = buttonColors(AURAPATH.primary, AURAPATH.accent, AURAPATH.primary, AURAPATH.cream);
    expect(c.text).toBe(AURAPATH.primary);
  });

  it("still falls back to black when the brand's dark is not dark enough", () => {
    const c = buttonColors("#8a8a8a", "#8a8a8a", "#8a8a8a", "#f7fafc");
    expect(c.text).toBe("#000000");
    expect(contrastRatio(c.text, c.bg)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("leaves a bright accent alone — this must not restyle working demos", () => {
    const c = buttonColors(BRIGHT.primary, BRIGHT.accent, BRIGHT.primary, BRIGHT.cream);
    expect(c.bg).toBe(BRIGHT.accent);
    expect(c.text).toBe(BRIGHT.primary);
  });

  it("rejects an accent that contrasts with the section but not with its own label", () => {
    // Readable against the page and unreadable as a button is still unreadable;
    // checking only the section background would pass this.
    const c = buttonColors("#0f2c3f", "#f7fafc", "#ffffff", "#f7fafc");
    expect(contrastRatio(c.text, c.bg)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});
