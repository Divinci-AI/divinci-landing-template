/**
 * Social-share unfurl card (1200x630) — SVG composition + PNG rasterization.
 *
 * Split out of build-og.ts so the pure parts are unit-testable: composing the
 * SVG and measuring a logo are just functions of bytes, and both are where the
 * bugs were.
 *
 * WHY THIS EXISTS AT ALL. `og:image` pointed at `/og.png`, but the card was
 * only ever produced by `npm run og`, which was NOT part of `npm run build` and
 * shelled out to `rsvg-convert` — a binary nobody had installed. So every
 * pipeline-built demo shipped og tags naming an image that did not exist. The
 * worker's SPA fallback then served index.html for /og.png with HTTP 200, so
 * an unfurler got a 200 with `content-type: text/html` and silently rendered no
 * preview. A 404 would at least have been visible.
 *
 * TWO ASSUMPTIONS THE ORIGINAL MADE THAT ARE FALSE ACROSS REAL BRANDS:
 *
 *   1. "the logo is an SVG" — it was embedded as `data:image/svg+xml`
 *      unconditionally. Of the 18 live demos, 8 have a PNG logo and 2 a WebP.
 *      A PNG under an SVG mime type renders as nothing.
 *   2. "the logo is 200x42" — LOGO_W was `LOGO_H * 200 / 42`. Any other aspect
 *      ratio comes out stretched, which is worse than not shipping a card.
 *
 * Both are now measured from the actual bytes. WebP is transcoded via `dwebp`
 * (resvg reads PNG/JPEG/GIF/SVG, not WebP).
 *
 * DEGRADATION POLICY. A brand whose logo cannot be embedded still gets a card —
 * the wordmark is drawn as text instead. The build must not fail over an unfurl
 * image, but it must also never go back to producing NOTHING silently, because
 * that is the failure this file exists to end. `composeOgCard` reports which
 * path it took so the caller can log it.
 */
import { execFileSync } from "node:child_process";

/** Escape text for interpolation into SVG. Brand names really do contain `&`. */
export function escapeXml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export interface LogoImage {
  /** data: URI ready for xlink:href, or null when the logo is unusable. */
  href: string | null;
  /** Intrinsic aspect ratio (width / height). */
  aspect: number;
  /** Why we fell back, for logging. Empty when the logo embedded cleanly. */
  note: string;
}

/** PNG intrinsic size — IHDR is always the first chunk, at a fixed offset. */
function pngSize(buf: Buffer): { w: number; h: number } | null {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

/** JPEG intrinsic size — walk the segment chain to the first SOF marker. */
function jpegSize(buf: Buffer): { w: number; h: number } | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    // SOF0..SOF15, excluding the non-frame markers DHT(c4)/JPG(c8)/DAC(cc).
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    if (i + 3 >= buf.length) break;
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

/**
 * SVG intrinsic aspect — prefer viewBox (authoritative and unitless); fall back
 * to width/height attributes, which may carry units we ignore deliberately
 * since only the RATIO matters here.
 */
function svgAspect(source: string): number | null {
  const vb = source.match(/viewBox\s*=\s*["']\s*[-\d.eE]+[,\s]+[-\d.eE]+[,\s]+([\d.eE]+)[,\s]+([\d.eE]+)/);
  if (vb) {
    const w = Number(vb[1]);
    const h = Number(vb[2]);
    if (w > 0 && h > 0) return w / h;
  }
  const w = Number((source.match(/\bwidth\s*=\s*["']\s*([\d.]+)/) ?? [])[1]);
  const h = Number((source.match(/\bheight\s*=\s*["']\s*([\d.]+)/) ?? [])[1]);
  if (w > 0 && h > 0) return w / h;
  return null;
}

/** Fallback aspect when a logo is unusable — matches the template's old default. */
export const DEFAULT_LOGO_ASPECT = 200 / 42;

/**
 * Turn raw logo bytes into an embeddable data URI plus its true aspect ratio.
 * `path` is used only for its extension; content is sniffed where possible so a
 * mislabelled file still works.
 */
export function prepareLogo(
  bytes: Buffer,
  path: string,
  opts: { transcodeWebp?: (b: Buffer) => Buffer | null; currentColor?: string } = {},
): LogoImage {
  const ext = (path.match(/\.([a-z0-9]+)$/i)?.[1] ?? "").toLowerCase();
  const isPng = bytes.length > 8 && bytes.readUInt32BE(0) === 0x89504e47;
  const isJpeg = bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8;
  const isWebp =
    bytes.length > 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  // Sniffing SVG: it is text, and may open with a comment or an XML decl.
  const head = bytes.toString("utf8", 0, Math.min(bytes.length, 1024));
  const isSvg = /<svg[\s>]/i.test(head) || ext === "svg";

  if (isPng) {
    const size = pngSize(bytes);
    return {
      href: `data:image/png;base64,${bytes.toString("base64")}`,
      aspect: size && size.h > 0 ? size.w / size.h : DEFAULT_LOGO_ASPECT,
      note: size ? "" : "png header unreadable — assumed default aspect",
    };
  }

  if (isJpeg) {
    const size = jpegSize(bytes);
    return {
      href: `data:image/jpeg;base64,${bytes.toString("base64")}`,
      aspect: size && size.h > 0 ? size.w / size.h : DEFAULT_LOGO_ASPECT,
      note: size ? "" : "jpeg header unreadable — assumed default aspect",
    };
  }

  if (isWebp) {
    // resvg has no WebP decoder, so this MUST be transcoded or dropped.
    const png = opts.transcodeWebp?.(bytes) ?? null;
    if (!png) return { href: null, aspect: DEFAULT_LOGO_ASPECT, note: "webp logo and no dwebp available" };
    const size = pngSize(png);
    return {
      href: `data:image/png;base64,${png.toString("base64")}`,
      aspect: size && size.h > 0 ? size.w / size.h : DEFAULT_LOGO_ASPECT,
      note: "transcoded webp → png",
    };
  }

  if (isSvg) {
    let source = bytes.toString("utf8");
    const aspect = svgAspect(source);

    // resvg does NOT render <text> inside an SVG embedded via <image>: the
    // font database is not propagated into the sub-tree, so shapes draw and
    // glyphs come out empty. Measured, not assumed — a nested <rect> fills
    // exactly 8400px where the identical nested <text> yields 0.
    //
    // This matters because the wordmarks the pipeline generates are a single
    // <text> element, so embedding them would leave a brand-shaped hole in the
    // middle of the card while every other element rendered correctly — the
    // silent-blank failure this whole file exists to end. Hand those back to
    // the caller as "no usable image" and let it draw the name as real text in
    // the OUTER document, where fonts work.
    const hasText = /<text[\s>]/i.test(source);
    const hasShapes = /<(path|rect|circle|ellipse|polygon|polyline|line|image|use)[\s>]/i.test(source);
    if (hasText && !hasShapes) {
      return { href: null, aspect: aspect ?? DEFAULT_LOGO_ASPECT, note: "text-only svg wordmark" };
    }

    // `currentColor` inherits from the CSS `color` of the element the SVG is
    // rendered INTO. Embedded via <image> there is no such element, so it
    // resolves to nothing and the mark renders invisible — which is exactly
    // what happened: the wordmarks the pipeline generates are a single <text
    // fill="currentColor">, so the first card came out with the brand name
    // simply absent while everything around it drew correctly. Bind it to a
    // concrete colour at embed time.
    let boundColor = "";
    if (opts.currentColor && /currentColor/i.test(source)) {
      source = source.replace(/currentColor/gi, opts.currentColor);
      boundColor = `bound currentColor → ${opts.currentColor}`;
    }

    const notes = [
      aspect ? "" : "svg has neither viewBox nor width/height — assumed default aspect",
      boundColor,
      // Mixed shape+text: the shapes will render, the glyphs will not. Embed it
      // (a partial mark still reads as the brand) but say so, because it is a
      // degradation and silence is how the original bug survived.
      hasText ? "⚠ svg contains <text>, which will not render inside the card" : "",
    ].filter(Boolean);

    return {
      href: `data:image/svg+xml;base64,${Buffer.from(source, "utf8").toString("base64")}`,
      aspect: aspect ?? DEFAULT_LOGO_ASPECT,
      note: notes.join("; "),
    };
  }

  return { href: null, aspect: DEFAULT_LOGO_ASPECT, note: `unrecognized logo format (.${ext || "?"})` };
}

/** Transcode WebP → PNG using libwebp's `dwebp`. Returns null if unavailable. */
export function dwebpTranscode(bytes: Buffer): Buffer | null {
  try {
    return execFileSync("dwebp", ["-quiet", "-o", "-", "--", "-"], {
      input: bytes,
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

export interface OgBrand {
  siteName: string;
  productName: string;
  palette: { primary: string; dark: string; mid: string; accent: string; cream: string; text: string };
  ogTagline: string;
  ogSubtitle: string;
  /**
   * The logo is designed for a DARK background (light/knocked-out artwork).
   * The card is light, so such a logo needs a dark plate behind it or it is
   * invisible — which is exactly how Centeno-Schultz's card came out: the
   * clinic's name and strapline rendered white-on-white while everything
   * around them was correct. The flag was already in brand.config; the card
   * simply ignored it.
   */
  logoIsLight?: boolean;
  /**
   * The logo is a square MARK, not a wordmark — it does not carry the brand's
   * name. The card's lockup assumes it does, exactly as the hero did, so a mark
   * produced a shared card reading "<glyph> AI" with the brand nowhere on the
   * image people actually see in Slack and iMessage.
   */
  logoIsMark?: boolean;
  /**
   * The brand's DISPLAY typeface, matching the hero lockup.
   *
   * The card is rasterized by resvg, which only sees fonts on disk — a webfont
   * named in CSS is invisible to it, so the wordmark fell back to Helvetica
   * while the live page rendered Fraunces italic. Same brand, two different
   * lockups, and the card is the one people see first.
   *
   * `family` must name a font actually loaded into the rasterizer (see
   * build-og.ts, which downloads it), or resvg silently substitutes.
   */
  displayFont?: { family: string; style?: string; weight?: string; letterSpacing?: string };
  /**
   * The wordmark's MEASURED width in px, when the caller has rasterized a probe.
   *
   * Without it the width is estimated at a fixed em-per-character, which is
   * calibrated for a bold grotesque and overshoots badly for a narrow italic
   * serif — the row is then laid out around a phantom width and the gap between
   * the wordmark and "AI" opens up visibly. Fraunces italic measured ~30% under
   * the estimate.
   */
  measuredWordmarkWidth?: number;
}

/**
 * The name to draw beside a separately-rendered "AI".
 *
 * The card draws "AI" as its own gradient element, so a brand already called
 * "AuraPath AI" reads "AuraPath AI AI" on the card. Mirrors the same rule in
 * the hero lockup; matches only a TRAILING occurrence, so "Xenon AI Labs" is
 * untouched, and never strips a name to nothing.
 */
/**
 * Shrink a font size until the text fits `maxWidth`.
 *
 * Both defects this fixes are the same mistake: text that does not fit was
 * drawn anyway.
 *
 *  * The wordmark width was `Math.min(720, measured)`. The CLAMP changed the
 *    number used for layout but not the text being drawn, so for a name wider
 *    than 720px the "AI" mark — positioned at `startX + logoW + gap` — landed
 *    INSIDE the still-drawing name. "BioRenew Integrative Medicine" rendered as
 *    "BioRenew Integrative M[AI]dicine".
 *  * The tagline is centred at x=600 with no width constraint at all, so a long
 *    one overflows BOTH card edges and is clipped at each end.
 *
 * Scaling the type is the honest fix: the text then genuinely occupies the
 * width the layout reserves for it.
 *
 * `ratio` is the average glyph advance as a fraction of font size. Helvetica
 * Bold runs ~0.54em; the caller passes what matches the weight it draws.
 */
export function fitFontSize(text: string, maxWidth: number, baseSize: number, ratio = 0.54, minSize = 10): number {
  const width = (size: number) => text.length * size * ratio;
  if (width(baseSize) <= maxWidth) return baseSize;
  const scaled = Math.floor((maxWidth / (text.length * ratio)) * 10) / 10;
  return Math.max(minSize, Math.min(baseSize, scaled));
}

export function nameBesideAi(siteName: string): string {
  return siteName.trim().replace(/\s*\bai\s*$/i, "").trim() || siteName.trim();
}

/**
 * Compose the 1200x630 card. Pure: same inputs → same SVG, no I/O.
 * Returns the SVG plus a note describing any degradation.
 */
/** The wordmark's font-size — exported so a measuring probe matches the card. */
export const WORDMARK_FONT_SIZE = Math.round(86 * 0.82);

/**
 * A minimal SVG containing ONLY the wordmark, for measuring its real width.
 *
 * Rasterized by the caller with the same font files the card uses, so the
 * measurement reflects the actual face rather than an em-per-character guess.
 */
export function wordmarkProbeSvg(
  text: string,
  font: { family?: string; style?: string; weight?: string; letterSpacing?: string } = {},
): string {
  const family = font.family ? `${font.family}, Helvetica, Arial, sans-serif` : "Helvetica, Arial, sans-serif";
  const style = font.style === "italic" ? ` font-style="italic"` : "";
  const tracking = font.letterSpacing && /^-?[\d.]+(px|em)?$/.test(font.letterSpacing) ? font.letterSpacing : "-1";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="200" viewBox="0 0 2000 200">` +
    `<text x="10" y="140" font-family="${escapeXml(family)}"${style} font-size="${WORDMARK_FONT_SIZE}" ` +
    `font-weight="${escapeXml(font.weight || "700")}" letter-spacing="${escapeXml(tracking)}" fill="#000">` +
    `${escapeXml(text)}</text></svg>`;
}

export function composeOgCard(brand: OgBrand, logo: LogoImage): { svg: string; note: string } {
  const { primary: NAVY, dark: GREEN_DARK, mid: GREEN_MID, accent: GREEN_LEAF, cream: CREAM, text: TEXT } =
    brand.palette;

  const TAGLINE = escapeXml(brand.ogTagline);
  const SUBTITLE = escapeXml(brand.ogSubtitle);
  const PLACEHOLDER = escapeXml(`Ask the ${brand.productName}…`);

  // Lockup geometry — wordmark + gradient "AI", centered as a row.
  const LOGO_H = 86;
  const GAP = 30;
  const ROW_CENTER_Y = 196;

  // Is the wordmark drawn as TEXT? Decided here because the "AI" is sized
  // against it. (A mark carries no name, so it takes the text path too.)
  const usingText = logo.href === null || brand.logoIsMark === true;
  const wordmarkText = nameBesideAi(brand.siteName);

  // "AI" matches the wordmark's size when both are TEXT — they read as one
  // piece of type, and 96 against a 71px wordmark made the AI visibly bigger
  // than the brand's own name. Against a LOGO IMAGE the 96/86 pairing is
  // deliberate and unchanged: an image's cap-height is not its box height, so
  // matching the numbers there would make the AI look small.
  const AI_FONT = usingText ? WORDMARK_FONT_SIZE : 96;
  // 122 was measured for "AI" at 96px; scale with the font so the row's width
  // stays right and the sparkles stay on the glyphs.
  const AI_W = Math.round(122 * (AI_FONT / 96));

  // The wordmark: the real logo when we could embed it, else the site name as
  // text. Text is measured at roughly 0.62em per character for Helvetica-ish
  // bold — approximate, but it only has to keep the row centered, and being a
  // little off is vastly better than an empty space where the brand should be.
  // Text when the logo cannot be embedded, AND when it is a MARK: a mark does
  // not contain the brand's name, so drawing it alone leaves the card without
  // the brand on it. Same rule as the hero lockup.
  // ⚠️ NOT `Math.min(720, measured)`. Clamping shrank the number the layout
  // used without shrinking the TEXT, so "AI" was placed inside a name that was
  // still drawing. If the wordmark is too wide the type is scaled down (see
  // wordmarkScale below) so the reserved width is the real width.
  const measuredW = brand.measuredWordmarkWidth ?? wordmarkText.length * LOGO_H * 0.52;
  const MAX_WORDMARK_W = 720;
  const wordmarkScale = measuredW > MAX_WORDMARK_W ? MAX_WORDMARK_W / measuredW : 1;
  const logoW = usingText ? Math.min(MAX_WORDMARK_W, measuredW) : LOGO_H * logo.aspect;

  // A light/knocked-out logo gets a dark plate (below). The plate extends
  // PLATE_PAD_X past the logo on each side, so the gap has to grow by the same
  // amount or it eats the space between the logo and the "AI" mark — measured
  // as 2px of clearance, with the A sitting on the plate's corner.
  const PLATE_PAD_X = 28;
  const PLATE_PAD_Y = 18;
  const plated = !usingText && brand.logoIsLight === true;
  // A TEXT wordmark needs a wider gap than a logo image does. 30px measures as
  // ~28px of ink, which is fine beside a logo but reads as ZERO between two
  // runs of type at 71px — "Applied BioCodeAI". An italic serif gets away with
  // it (the slant separates them); bold sans against bold sans does not, and
  // the brand name is the half that loses.
  //
  // Proportional to the type size rather than a fixed pixel value, so it stays
  // right if the size ever changes.
  const textGap = Math.round(AI_FONT * 0.55);
  const gap = (usingText ? textGap : GAP) + (plated ? PLATE_PAD_X : 0);

  const totalW = logoW + gap + AI_W + (plated ? PLATE_PAD_X : 0);
  const startX = (1200 - totalW) / 2 + (plated ? PLATE_PAD_X : 0);
  const logoY = ROW_CENTER_Y - LOGO_H / 2;
  const aiX = startX + logoW + gap;
  const aiBaseline = ROW_CENTER_Y + AI_FONT * 0.34;

  // Only the LOGO gets the plate, not the whole lockup: the "AI" mark is drawn
  // in a dark gradient and would disappear on top of it.
  const plate = plated
    ? `<rect x="${startX - PLATE_PAD_X}" y="${logoY - PLATE_PAD_Y}" width="${logoW + PLATE_PAD_X * 2}" ` +
      `height="${LOGO_H + PLATE_PAD_Y * 2}" rx="18" fill="${GREEN_DARK}"/>\n  `
    : "";

  // The brand's own display face when we have one, else the neutral default.
  // Weight and style come from the same extraction the hero uses, so the card
  // and the page render the same lockup rather than two different ones.
  const df = brand.displayFont;
  const wmFamily = df?.family ? `${df.family}, Helvetica, Arial, sans-serif` : "Helvetica, Arial, sans-serif";
  const wmStyle = df?.style === "italic" ? ` font-style="italic"` : "";
  const wmWeight = df?.weight || "700";
  const wmTracking = df?.letterSpacing && /^-?[\d.]+(px|em)?$/.test(df.letterSpacing) ? df.letterSpacing : "-1";

  const wordmark = usingText
    // wordmarkScale shrinks the TYPE when the name is too wide, so the width
    // the layout reserved is the width actually drawn and "AI" cannot land on
    // top of the name.
    ? `<text x="${startX}" y="${aiBaseline}" font-family="${escapeXml(wmFamily)}"${wmStyle} font-size="${Math.round(
        LOGO_H * 0.82 * wordmarkScale,
      )}" font-weight="${escapeXml(wmWeight)}" letter-spacing="${escapeXml(wmTracking)}" fill="${TEXT}">${escapeXml(wordmarkText)}</text>`
    : `${plate}<image x="${startX}" y="${logoY}" width="${logoW}" height="${LOGO_H}" preserveAspectRatio="xMidYMid meet" xlink:href="${logo.href}"/>`;

  const star = (cx: number, cy: number, s: number, fill: string) => {
    const u = s / 24;
    return `<path transform="translate(${cx - 12 * u} ${cy - 12 * u}) scale(${u})" d="M12 2L13.4 9.6 21 12L13.4 14.4 12 22 10.6 14.4 3 12 10.6 9.6Z" fill="${fill}"/>`;
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="aiGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${GREEN_DARK}"/>
      <stop offset="55%" stop-color="${GREEN_MID}"/>
      <stop offset="100%" stop-color="${GREEN_LEAF}"/>
    </linearGradient>
    <radialGradient id="glowLeaf" cx="22%" cy="20%" r="55%">
      <stop offset="0%" stop-color="${GREEN_LEAF}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="${GREEN_LEAF}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowDark" cx="82%" cy="92%" r="60%">
      <stop offset="0%" stop-color="${GREEN_DARK}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${GREEN_DARK}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="${CREAM}"/>
  <rect width="1200" height="630" fill="url(#glowLeaf)"/>
  <rect width="1200" height="630" fill="url(#glowDark)"/>

  <rect x="0" y="0" width="1200" height="6" fill="${GREEN_LEAF}"/>
  <rect x="0" y="624" width="1200" height="6" fill="${GREEN_DARK}"/>

  ${wordmark}
  <text x="${aiX}" y="${aiBaseline}" font-family="Helvetica, Arial, sans-serif" font-size="${AI_FONT}" font-weight="800" letter-spacing="-2" fill="url(#aiGrad)">AI</text>
  ${star(aiX + AI_W - 6, ROW_CENTER_Y - AI_FONT * 0.34, 26, GREEN_LEAF)}
  ${star(aiX - 4, ROW_CENTER_Y + AI_FONT * 0.36, 18, GREEN_MID)}

  <text x="600" y="360" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${fitFontSize(brand.ogTagline, 1080, 58, 0.54)}" font-weight="700" letter-spacing="-1" fill="${TEXT}">${TAGLINE}</text>

  <text x="600" y="418" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${fitFontSize(brand.ogSubtitle ?? "", 1080, 30, 0.5)}" font-weight="400" fill="${NAVY}">${SUBTITLE}</text>

  <g>
    <rect x="320" y="476" width="560" height="72" rx="36" fill="#ffffff" fill-opacity="0.94" stroke="${GREEN_DARK}" stroke-opacity="0.28" stroke-width="1.5"/>
    <text x="356" y="521" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="400" fill="#7c8390">${PLACEHOLDER}</text>
    <circle cx="844" cy="512" r="28" fill="${GREEN_DARK}"/>
    <path transform="translate(830 498) scale(1.15)" d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="#ffffff"/>
  </g>
</svg>`;

  const note = usingText ? `wordmark drawn as TEXT (${logo.note})` : logo.note;
  return { svg, note };
}
