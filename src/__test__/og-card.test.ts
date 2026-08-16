import { describe, it, expect } from "vitest";
import { composeOgCard, prepareLogo, escapeXml, DEFAULT_LOGO_ASPECT } from "../../scripts/og-card.ts";

/**
 * The unfurl card had shipped as og tags pointing at an image that was never
 * generated. These tests pin the three things that made the fix non-obvious —
 * each corresponds to a real, observed blank/broken card, not a hypothetical.
 */

const BRAND = {
  siteName: "Acme Expert",
  productName: "Acme Expert AI",
  palette: {
    primary: "#0672ac",
    dark: "#033753",
    mid: "#0899e7",
    accent: "#0672ac",
    cream: "#ffffff",
    text: "#212121",
  },
  ogTagline: "Every answer, 24/7.",
  ogSubtitle: "AI-powered guidance.",
};

/** Minimal valid PNG (1x1) with a forged IHDR size, for dimension probing. */
function fakePng(w: number, h: number): Buffer {
  const b = Buffer.alloc(24);
  b.writeUInt32BE(0x89504e47, 0);
  b.writeUInt32BE(w, 16);
  b.writeUInt32BE(h, 20);
  return b;
}

describe("escapeXml", () => {
  it("escapes the characters that would break the SVG", () => {
    expect(escapeXml(`Smith & Sons <"Best">`)).toBe("Smith &amp; Sons &lt;&quot;Best&quot;&gt;");
  });

  it("survives a brand name containing an ampersand", () => {
    // Real company names contain "&". Unescaped, this produced an SVG that
    // failed to parse — i.e. no card at all, for that customer only.
    const { svg } = composeOgCard({ ...BRAND, siteName: "Barnes & Noble" }, { href: null, aspect: 4, note: "" });
    expect(svg).toContain("Barnes &amp; Noble");
    expect(svg).not.toMatch(/Barnes & Noble/);
  });
});

describe("prepareLogo — format detection", () => {
  it("labels a PNG as image/png, not image/svg+xml", () => {
    // The original hardcoded svg+xml for every logo. 8 of 18 live demos have a
    // PNG logo, and a PNG under an SVG mime type renders as nothing.
    const got = prepareLogo(fakePng(400, 100), "/brand/logo.png");
    expect(got.href).toMatch(/^data:image\/png;base64,/);
  });

  it("takes the aspect ratio from the PNG header, not a hardcoded 200x42", () => {
    expect(prepareLogo(fakePng(400, 100), "/brand/logo.png").aspect).toBe(4);
    expect(prepareLogo(fakePng(300, 300), "/brand/logo.png").aspect).toBe(1);
  });

  it("reads the aspect ratio from an SVG viewBox", () => {
    const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 42"><path d="M0 0"/></svg>`);
    expect(prepareLogo(svg, "/brand/logo.svg").aspect).toBeCloseTo(230 / 42, 5);
  });

  it("falls back to the default aspect when the SVG declares no size", () => {
    const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>`);
    const got = prepareLogo(svg, "/brand/logo.svg");
    expect(got.aspect).toBe(DEFAULT_LOGO_ASPECT);
    expect(got.note).toMatch(/assumed default aspect/);
  });

  it("refuses a WebP when no transcoder is available", () => {
    // resvg has no WebP decoder. 2 live demos have a WebP logo; embedding one
    // produces a blank space, so it must degrade to the text wordmark instead.
    const webp = Buffer.concat([
      Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBP"), Buffer.alloc(8),
    ]);
    const got = prepareLogo(webp, "/brand/logo.webp");
    expect(got.href).toBeNull();
    expect(got.note).toMatch(/webp/i);
  });

  it("uses the transcoded PNG when a WebP transcoder IS available", () => {
    const webp = Buffer.concat([
      Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBP"), Buffer.alloc(8),
    ]);
    const got = prepareLogo(webp, "/brand/logo.webp", { transcodeWebp: () => fakePng(600, 200) });
    expect(got.href).toMatch(/^data:image\/png;base64,/);
    expect(got.aspect).toBe(3);
  });
});

describe("prepareLogo — the two silent-blank traps", () => {
  it("hands back a text-only SVG wordmark instead of embedding it", () => {
    // MEASURED: resvg does not render <text> inside an SVG embedded via
    // <image> — the font database is not propagated into the sub-tree. A
    // nested <rect> fills its box; the identical nested <text> yields zero
    // ink. The pipeline's generated wordmarks are exactly one <text> element,
    // so embedding them left a brand-shaped hole in the finished card.
    const wordmark = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 42" width="200" height="42">` +
        `<text x="0" y="31" fill="currentColor">Acme Expert</text></svg>`,
    );
    const got = prepareLogo(wordmark, "/brand/logo.svg", { currentColor: "#212121" });
    expect(got.href).toBeNull();
    expect(got.note).toMatch(/text-only/);
  });

  it("still embeds an SVG that has real shapes, but flags its text", () => {
    const mixed = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 42"><path d="M0 0h10v10H0z"/><text>Co</text></svg>`,
    );
    const got = prepareLogo(mixed, "/brand/logo.svg");
    expect(got.href).toMatch(/^data:image\/svg\+xml;base64,/);
    expect(got.note).toMatch(/<text>/);
  });

  it("binds currentColor to a concrete colour before embedding", () => {
    // currentColor inherits from the CSS `color` of the host element. Inside
    // <image> there is no host element, so it resolves to nothing and the mark
    // renders invisible.
    const shapeLogo = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><path d="M0 0h10v10H0z" fill="currentColor"/></svg>`,
    );
    const got = prepareLogo(shapeLogo, "/brand/logo.svg", { currentColor: "#212121" });
    const decoded = Buffer.from(got.href!.split(",")[1], "base64").toString("utf8");
    expect(decoded).toContain('fill="#212121"');
    expect(decoded).not.toContain("currentColor");
  });
});

describe("composeOgCard", () => {
  it("draws the brand name as real text when there is no usable logo", () => {
    const { svg, note } = composeOgCard(BRAND, { href: null, aspect: 4, note: "text-only svg wordmark" });
    expect(svg).toContain(">Acme Expert<");
    expect(svg).not.toContain("<image");
    expect(note).toMatch(/TEXT/);
  });

  it("embeds the logo and sizes it by its true aspect ratio", () => {
    const { svg } = composeOgCard(BRAND, { href: "data:image/png;base64,AAAA", aspect: 4, note: "" });
    // 86px tall at 4:1 → 344 wide. A wrong aspect is what stretched real logos.
    expect(svg).toMatch(/<image[^>]*width="344"[^>]*height="86"/);
    expect(svg).toContain('preserveAspectRatio="xMidYMid meet"');
  });

  it("always emits a 1200x630 canvas — the size named in the og:image meta", () => {
    const { svg } = composeOgCard(BRAND, { href: null, aspect: 4, note: "" });
    expect(svg).toMatch(/width="1200" height="630"/);
  });

  it("keeps the lockup on-canvas for an implausibly long brand name", () => {
    const { svg } = composeOgCard({ ...BRAND, siteName: "A".repeat(80) }, { href: null, aspect: 4, note: "" });
    const x = Number(svg.match(/<text x="([\d.-]+)"[^>]*font-size="7[01]"/)?.[1] ?? -1);
    expect(x).toBeGreaterThanOrEqual(0);
  });
});

describe("logoIsLight", () => {
  const LIGHT_LOGO = { href: "data:image/png;base64,AAAA", aspect: 4, note: "" };

  it("puts a dark plate behind a knocked-out logo so it is not invisible", () => {
    // Centeno-Schultz's logo is white artwork. On the light card its name and
    // strapline rendered white-on-white while everything around them was
    // correct — and `logoIsLight` was already set in brand.config; the card
    // just ignored it.
    const { svg } = composeOgCard({ ...BRAND, logoIsLight: true }, LIGHT_LOGO);
    const plate = svg.match(/<rect x="[\d.-]+" y="[\d.-]+" width="[\d.]+" height="[\d.]+" rx="18" fill="([^"]+)"\/>/);
    expect(plate?.[1]).toBe(BRAND.palette.dark);
  });

  it("draws no plate for an ordinary dark logo", () => {
    const { svg } = composeOgCard(BRAND, LIGHT_LOGO);
    expect(svg).not.toContain('rx="18"');
  });

  it("does not plate the TEXT wordmark — it is drawn in the brand's text colour", () => {
    // A plate behind text we control would only reduce contrast.
    const { svg } = composeOgCard({ ...BRAND, logoIsLight: true }, { href: null, aspect: 4, note: "" });
    expect(svg).not.toContain('rx="18"');
  });

  it("keeps the plate behind the logo only, never under the AI mark", () => {
    // The AI mark is a dark gradient; on the plate it would vanish in turn.
    const { svg } = composeOgCard({ ...BRAND, logoIsLight: true }, LIGHT_LOGO);
    const plateRight =
      Number(svg.match(/<rect x="([\d.-]+)"[^>]*rx="18"/)![1]) +
      Number(svg.match(/<rect x="[\d.-]+" y="[\d.-]+" width="([\d.]+)"[^>]*rx="18"/)![1]);
    const aiX = Number(svg.match(/<text x="([\d.]+)"[^>]*font-size="96"/)![1]);
    // Not merely "does not overlap" — the first version cleared the AI mark by
    // 2px, so the A visibly sat on the plate's rounded corner. Require real
    // breathing room, which is what the widened gap buys.
    expect(aiX - plateRight).toBeGreaterThanOrEqual(24);
  });
});

/**
 * The card is what people see in Slack, iMessage and LinkedIn — often before
 * they see the page. Two defects rendered there and nowhere else obvious.
 */
describe("mark logos and the AI suffix on the card", () => {
  const brand = {
    siteName: "AuraPath AI",
    productName: "AuraPath AI",
    palette: { primary: "#1a1610", dark: "#262017", mid: "#403627", accent: "#0f0d08", cream: "#f7fafc", text: "#0f0d08" },
    ogTagline: "answered 24/7.",
    ogSubtitle: "AI-powered answers.",
  };
  const embeddable = { href: "data:image/png;base64,AAAA", aspect: 1, note: "" };

  it("draws the NAME as text when the logo is a mark, not the glyph alone", () => {
    // A mark carries no name, so the shared card read "<glyph> AI" with the
    // brand absent from the image people actually see.
    const { svg } = composeOgCard({ ...brand, logoIsMark: true }, embeddable);
    expect(svg).toContain("AuraPath");
    expect(svg).not.toContain("<image");
  });

  it("still embeds a WORDMARK logo as an image", () => {
    const { svg } = composeOgCard({ ...brand, logoIsMark: false }, embeddable);
    expect(svg).toContain("<image");
  });

  it("does not print the AI suffix twice in the WORDMARK", () => {
    // "AI" is drawn separately as a gradient, so rendering the full site name
    // beside it produced "AuraPath AI AI" in the lockup.
    //
    // Scoped to the wordmark <text>, not the whole SVG: the input placeholder
    // legitimately reads "Ask the AuraPath AI…" — that is the product name and
    // it is correct. An over-broad assertion here fails on working output,
    // which is how a test starts costing more than the bug.
    const { svg } = composeOgCard({ ...brand, logoIsMark: true }, embeddable);
    const wordmark = svg.match(/<text[^>]*font-weight="700"[^>]*>([^<]*)<\/text>/);
    expect(wordmark?.[1]).toBe("AuraPath");
  });

  it("leaves a name whose AI is not a trailing word alone", () => {
    const { svg } = composeOgCard(
      { ...brand, siteName: "Xenon AI Labs", logoIsMark: true },
      embeddable,
    );
    expect(svg).toContain("Xenon AI Labs");
  });
});

describe("AI sizing against the wordmark", () => {
  const brand = {
    siteName: "AuraPath AI",
    productName: "AuraPath AI",
    palette: { primary: "#1a1610", dark: "#262017", mid: "#403627", accent: "#0f0d08", cream: "#f7fafc", text: "#0f0d08" },
    ogTagline: "answered 24/7.",
    ogSubtitle: "AI-powered answers.",
  };
  const embeddable = { href: "data:image/png;base64,AAAA", aspect: 4, note: "" };

  function fontSizes(svg: string) {
    return [...svg.matchAll(/font-size="(\d+)"/g)].map((m) => Number(m[1]));
  }

  it("sets AI to the SAME size as a TEXT wordmark", () => {
    // 96 against a 71px wordmark made the AI visibly larger than the brand's
    // own name; as two runs of type they should read as one piece.
    const { svg } = composeOgCard({ ...brand, logoIsMark: true }, embeddable);
    const wm = svg.match(/font-size="(\d+)"[^>]*font-weight="[^"]*"[^>]*>AuraPath</);
    const ai = svg.match(/font-size="(\d+)"[^>]*fill="url\(#aiGrad\)">AI</);
    expect(ai?.[1]).toBe(wm?.[1]);
  });

  it("keeps the larger AI beside a LOGO IMAGE", () => {
    // An image's cap-height is not its box height, so matching the numbers
    // there would make the AI look small. That pairing is deliberate.
    const { svg } = composeOgCard({ ...brand, logoIsMark: false }, embeddable);
    expect(fontSizes(svg)).toContain(96);
  });
});

/**
 * The unfurl thumbnail had TWO defects, both the same mistake: text that does
 * not fit was drawn anyway.
 *
 *  * the wordmark width was `Math.min(720, measured)`, which shrank the number
 *    used for LAYOUT without shrinking the TEXT — so "AI", placed at
 *    `startX + logoW + gap`, landed inside a name that was still drawing.
 *    "BioRenew Integrative Medicine" rendered as "BioRenew Integrative M[AI]dicine".
 *  * the tagline is centred at x=600 with no width constraint, so a long one
 *    overflows BOTH card edges and is clipped at each end.
 *
 * These pin the arithmetic. A rendered-pixel check would be better still, but
 * it needs the same fonts the card is drawn with, and a wrong-font measurement
 * is what caused the original overlap.
 */
describe("og card — text must fit the card it is drawn on", () => {
  it("scales an over-wide wordmark instead of clamping its reported width", async () => {
    const { fitFontSize } = await import("../../scripts/og-card");
    // Long real name at the card's wordmark size.
    const long = "BioRenew Integrative Medicine";
    const fitted = fitFontSize(long, 720, 96, 0.54);
    expect(fitted).toBeLessThan(96);
    // And it genuinely fits now.
    expect(long.length * fitted * 0.54).toBeLessThanOrEqual(720);
  });

  it("leaves a name that already fits at full size", async () => {
    const { fitFontSize } = await import("../../scripts/og-card");
    // The short lockup name the card now uses.
    expect(fitFontSize("BioRenewIM", 720, 96, 0.54)).toBe(96);
  });

  it("shrinks the tagline that overflowed both card edges", async () => {
    const { fitFontSize } = await import("../../scripts/og-card");
    // Verbatim from the deployed card.
    const tagline = "BioRenew Integrative Medicine — answered 24/7";
    const fitted = fitFontSize(tagline, 1080, 58, 0.54);
    expect(fitted).toBeLessThan(58);
    expect(tagline.length * fitted * 0.54).toBeLessThanOrEqual(1080);
  });

  it("never returns a size so small the text is unreadable", async () => {
    const { fitFontSize } = await import("../../scripts/og-card");
    const absurd = "x".repeat(500);
    expect(fitFontSize(absurd, 1080, 58)).toBeGreaterThanOrEqual(10);
  });

  it("handles an empty string without dividing by zero", async () => {
    const { fitFontSize } = await import("../../scripts/og-card");
    expect(fitFontSize("", 1080, 30, 0.5)).toBe(30);
  });
});
