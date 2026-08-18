import { describe, it, expect } from "vitest";
import { luminance, contrastRatio, readableOn, buttonColors, logoInkClass, AA_TEXT, AA_LARGE, isDarkPalette } from "./contrast";

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

// Real palettes, both produced by the extractor from the customers' own sites.
const DODCYBER = { primary: "#04090e", dark: "#00a1c2", mid: "#00d4ff", accent: "#00d4ff",
  cream: "#04090e", soft: "#0a1622", bubble: "#004a59", text: "#ddeeff" };
const LONGEVITYRX = { primary: "#1a2e20", dark: "#16271b", mid: "#30553b", accent: "#e9cc8f",
  cream: "#f5f0e8", soft: "#f0e9dd", bubble: "#f7ecd4", text: "#2c2c2c" };

describe("isDarkPalette", () => {
  it("calls dodcyberconsulting.com's palette dark", () => {
    expect(isDarkPalette(DODCYBER.cream)).toBe(true);
  });

  it("does NOT call a cream clinic dark", () => {
    // The whole light-brand estate depends on this staying false: every
    // semantic surface token flips at once, so a false positive turns a
    // working page inside out.
    expect(isDarkPalette(LONGEVITYRX.cream)).toBe(false);
  });

  it("classifies by whether the page needs LIGHT ink", () => {
    // Not by "is it nearly black". A forest-green or slate PAGE cannot carry
    // dark ink either, so it belongs on the dark path — the threshold is the
    // luminance at which white text stops clearing AA, and these sit under it.
    expect(isDarkPalette("#3b6b3f")).toBe(true);
    expect(isDarkPalette("#4a5568")).toBe(true);
    // Every page colour the light estate actually uses stays light.
    for (const light of ["#ffffff", "#f7fafc", "#f5f0e8", "#f4efda", "#edf2f7"])
      expect(isDarkPalette(light)).toBe(false);
  });
});

describe("ink on the brand chrome", () => {
  // `text-white` cannot ask whether white is legible. On dodcyber's #00a1c2
  // buttons it is not, and the answer has to be the near-black page colour.
  const onChrome = (p: typeof DODCYBER) => readableOn(p.dark, "#ffffff", p.cream);

  it("puts dark ink on a bright cyan button", () => {
    expect(onChrome(DODCYBER)).toBe(DODCYBER.cream);
    expect(contrastRatio(onChrome(DODCYBER), DODCYBER.dark)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("keeps white on a dark green button — light brands do not move", () => {
    expect(onChrome(LONGEVITYRX)).toBe("#ffffff");
  });
});
/**
 * Freedom with AI — the palette that produced a CTA nobody could read. `primary`
 * and `cream` are the SAME near-black, because on a dark-page brand `cream` is
 * the page colour, not a light colour. The old fallback took `cream` on faith.
 */
const FREEDOM = { primary: "#0f1419", accent: "#1a73e8", cream: "#0f1419", text: "#f4f6f8" };

describe("buttonColors on a dark-page brand", () => {
  it("never paints the button in the section's own colour", () => {
    // The bug: bg #0f1419 on a #0f1419 section, labelled #000000.
    const c = buttonColors(FREEDOM.primary, FREEDOM.accent, FREEDOM.primary, FREEDOM.cream);
    expect(contrastRatio(c.bg, FREEDOM.primary)).toBeGreaterThanOrEqual(AA_LARGE);
    expect(contrastRatio(c.text, c.bg)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("keeps the brand's accent and relabels it, rather than discarding it", () => {
    // The accent clears AA against the section; only the brand's dark LABEL
    // failed on top of it. Dropping the accent for that would have thrown away
    // the one colour on the page that is the customer's.
    const c = buttonColors(FREEDOM.primary, FREEDOM.accent, FREEDOM.primary, FREEDOM.cream);
    expect(c.bg).toBe(FREEDOM.accent);
  });

  it("is legible for every palette the estate actually has", () => {
    const palettes: Array<[string, string, string, string]> = [
      [FREEDOM.primary, FREEDOM.accent, FREEDOM.primary, FREEDOM.cream],
      [AURAPATH.primary, AURAPATH.accent, AURAPATH.primary, AURAPATH.cream],
      [BRIGHT.primary, BRIGHT.accent, BRIGHT.primary, BRIGHT.cream],
      [DODCYBER.primary, DODCYBER.accent, DODCYBER.primary, DODCYBER.cream],
      [LONGEVITYRX.primary, LONGEVITYRX.accent, LONGEVITYRX.primary, LONGEVITYRX.cream],
      // Degenerate on purpose: one colour for everything must still resolve.
      ["#000000", "#000000", "#000000", "#000000"],
      ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
    ];
    for (const [section, accent, label, cream] of palettes) {
      const c = buttonColors(section, accent, label, cream);
      expect(contrastRatio(c.bg, section), `bg on ${section}`).toBeGreaterThanOrEqual(AA_LARGE);
      expect(contrastRatio(c.text, c.bg), `label on ${c.bg}`).toBeGreaterThanOrEqual(AA_TEXT);
    }
  });
});

describe("logoInkClass", () => {
  it("whites out a dark logo on a dark brand", () => {
    // Freedom with AI's mark is filled #000000 and its avatar circle sits on a
    // near-black panel: a black glyph on a black disc.
    expect(logoInkClass(true, false)).toBe("brightness-0 invert");
    expect(logoInkClass(true, undefined)).toBe("brightness-0 invert");
  });

  it("blacks out a white logo on a light brand", () => {
    expect(logoInkClass(false, true)).toBe("brightness-0");
  });

  it("leaves a logo that already matches its surface alone", () => {
    expect(logoInkClass(true, true)).toBe("");
    expect(logoInkClass(false, false)).toBe("");
  });
});
