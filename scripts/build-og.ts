// Generates the social-share unfurl card (1200x630) into public/og.png.
//
// Runs as part of `npm run build` (see package.json) so EVERY build ships a
// card. It used to be a separate `npm run og` that also needed `rsvg-convert`
// on PATH; nothing in the demo pipeline ran it and no machine had the binary,
// so every generated demo advertised an og:image that 404'd into the SPA
// fallback. Rasterization is now @resvg/resvg-js — an npm dependency with
// prebuilt binaries, so it works wherever `npm install` worked.
//
// Composition + logo handling live in ./og-card.ts, which is unit-tested.
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { brand } from "../src/brand.config.ts";
import { composeOgCard, prepareLogo, dwebpTranscode, DEFAULT_LOGO_ASPECT, wordmarkProbeSvg, nameBesideAi } from "./og-card.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// brand.media.logo is a public-root path (e.g. "/brand/logo.svg").
const logoPath = resolve(root, "public", brand.media.logo.replace(/^\//, ""));
let logo;
try {
  logo = prepareLogo(readFileSync(logoPath), logoPath, {
    transcodeWebp: dwebpTranscode,
    // The card sits on the light `cream` background, so a currentColor
    // wordmark must resolve to the brand's TEXT colour, not its primary.
    currentColor: brand.palette.text,
  });
} catch (err) {
  // A missing logo is not a reason to ship no card — the text wordmark path
  // still produces a correct, on-brand unfurl.
  logo = { href: null, aspect: DEFAULT_LOGO_ASPECT, note: `could not read ${brand.media.logo}: ${String(err)}` };
}


/**
 * Download the brand's display font as a TrueType file resvg can load.
 *
 * resvg rasterizes from fonts ON DISK; a webfont named in CSS is invisible to
 * it. Without this the card's wordmark silently falls back to Helvetica while
 * the live page renders the brand's face — same brand, two lockups, and the
 * card is the one that reaches people first.
 *
 * Google serves a DIFFERENT format per user-agent for the same URL: a modern
 * UA gets woff2 and a legacy one gets EOT, neither of which resvg can decode.
 * The Android 2.2 UA is the one that yields plain TrueType. That is a quirk of
 * their CSS API, not a hack around a paywall — the font is the same OFL file.
 *
 * Returns null on any failure. A missing font must never mean a missing card:
 * the wordmark simply renders in the fallback family, which is what happened
 * for every card before this existed.
 */
async function fetchDisplayFont(stack: string | undefined, style: string, weight: string): Promise<string | null> {
  const family = (stack || "").split(",")[0].replace(/["']/g, "").trim();
  if (!family || /^(ui-|system-|-apple|sans-serif$|serif$|monospace$)/i.test(family)) return null;
  const spec = `${weight || "400"}${style === "italic" ? "italic" : ""}`;
  const cssUrl = `https://fonts.googleapis.com/css?family=${encodeURIComponent(family)}:${spec}`;
  try {
    const css = await fetch(cssUrl, { headers: { "User-Agent": "Mozilla/5.0 (Linux; U; Android 2.2)" } });
    if (!css.ok) return null;
    const url = (await css.text()).match(/https:\/\/fonts\.gstatic\.com[^)]*/)?.[0];
    if (!url) return null;
    const font = await fetch(url);
    if (!font.ok) return null;
    const buf = Buffer.from(await font.arrayBuffer());
    // Guard the format rather than trusting the UA trick to keep working: a
    // silent switch back to woff2 would put Helvetica on every card again.
    const magic = buf.subarray(0, 4).toString("hex");
    const isTrueType = magic === "00010000" || magic === "74727565" || magic === "4f54544f";
    if (!isTrueType) return null;
    const out = resolve(root, `public/_ogfont-${family.replace(/\W+/g, "-").toLowerCase()}.ttf`);
    writeFileSync(out, buf);
    return out;
  } catch {
    return null;
  }
}

const displayStack = brand.fonts.display;
const displayStyle = brand.fonts.displayStyle ?? "normal";
const displayWeight = brand.fonts.displayWeight ?? "500";
const fontFile = await fetchDisplayFont(displayStack, displayStyle, displayWeight);
const displayFamily = fontFile ? (displayStack || "").split(",")[0].replace(/["']/g, "").trim() : undefined;

// MEASURE the wordmark before laying out the row.
//
// The width was estimated at a fixed em-per-character, calibrated for a bold
// grotesque. A narrow italic serif measures ~30% under that, so the row was
// laid out around a phantom width and a visible gap opened between the wordmark
// and "AI". Rasterizing a probe with the SAME font files gives the real width.
const usesTextWordmark = logo.href === null || brand.media.logoIsMark === true;

// The OG lockup uses the SAME short name as the header and hero. Drawing the
// full legal name here is what pushed "BioRenew Integrative Medicine" past the
// card's width budget in the first place.
const ogLockupName = brand.identity.lockupName || brand.identity.siteName;

// ONE description of the wordmark's type, used by both the probe and the card.
//
// They were built separately and disagreed: the probe measured at weight 500
// (the extraction default) while the card rendered at 700 (its own fallback for
// a brand with no display font). The measurement was therefore for a narrower
// rendering than the one drawn, so the layout reserved 511px for 554px of type
// and "AI" was positioned INSIDE the wordmark — "Applied BioCodeAI" with a
// 4px overlap. A measurement is only as good as its agreement with what is
// actually drawn, so there is now a single object rather than two call sites
// that happen to look similar.
const displayFont = displayFamily
  ? { family: displayFamily, style: displayStyle, weight: displayWeight, letterSpacing: brand.fonts.displayLetterSpacing }
  : undefined;

let measuredWordmarkWidth: number | undefined;
if (usesTextWordmark) {
  try {
    const probe = new Resvg(
      wordmarkProbeSvg(nameBesideAi(ogLockupName), displayFont ?? {}),
      { font: { loadSystemFonts: true, fontFiles: fontFile ? [fontFile] : [] } },
    );
    const box = probe.getBBox();
    if (box && box.width > 0) measuredWordmarkWidth = Math.ceil(box.width);
  } catch {
    // Fall back to the estimate — a slightly wide gap beats no card.
  }
}

const { svg, note } = composeOgCard(
  {
    siteName: ogLockupName,
    productName: brand.identity.productName,
    palette: brand.palette,
    ogTagline: brand.media.ogTagline,
    ogSubtitle: brand.media.ogSubtitle,
    logoIsLight: brand.media.logoIsLight,
    logoIsMark: brand.media.logoIsMark,
    measuredWordmarkWidth,
    displayFont,
  },
  logo,
);

const outSvg = resolve(root, "public/og-card.svg");
const outPng = resolve(root, "public/og.png");
writeFileSync(outSvg, svg);

const png = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  // The card names Helvetica/Arial explicitly; without system fonts resvg
  // renders no text at all, which would silently produce a blank card.
  // fontFiles carries the brand's downloaded display face. loadSystemFonts
  // stays on for the fallback families the card also names.
  font: { loadSystemFonts: true, fontFiles: fontFile ? [fontFile] : [] },
})
  .render()
  .asPng();
writeFileSync(outPng, png);

// A CONTENT HASH for the og:image URL.
//
// Slack, iMessage and LinkedIn cache the unfurl IMAGE keyed by its URL, and
// independently of when they re-scrape the page. `/og.png` never changes, so a
// corrected card is never shown: re-scraping the page with ?v=2 made Slack
// report the new file SIZE while still rendering the image it already had.
// There is no way to push through that from the server — the URL has to differ.
//
// Written as a module the layout imports, so the hash is part of the build
// rather than a timestamp: an unchanged card keeps its URL and stays cached,
// and only a card that actually changed forces a re-fetch.
const hash = createHash("sha256").update(png).digest("hex").slice(0, 12);
writeFileSync(
  resolve(root, "src/og-version.ts"),
  `// GENERATED by scripts/build-og.ts — do not edit.\n` +
    `// Content hash of public/og.png; busts consumer unfurl caches when the card changes.\n` +
    `export const OG_VERSION = ${JSON.stringify(hash)};\n`,
);

console.log(`[og] wrote ${outPng} (${(png.length / 1024).toFixed(0)} KB, v=${hash}, wordmark font: ${displayFamily ?? "fallback"}${measuredWordmarkWidth ? `, measured ${measuredWordmarkWidth}px` : ""})${note ? ` — ${note}` : ""}`);
