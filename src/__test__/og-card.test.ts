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
