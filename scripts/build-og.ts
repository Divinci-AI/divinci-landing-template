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
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { brand } from "../src/brand.config.ts";
import { composeOgCard, prepareLogo, dwebpTranscode, DEFAULT_LOGO_ASPECT } from "./og-card.ts";

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

const { svg, note } = composeOgCard(
  {
    siteName: brand.identity.siteName,
    productName: brand.identity.productName,
    palette: brand.palette,
    ogTagline: brand.media.ogTagline,
    ogSubtitle: brand.media.ogSubtitle,
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
  font: { loadSystemFonts: true },
})
  .render()
  .asPng();
writeFileSync(outPng, png);

console.log(`[og] wrote ${outPng} (${(png.length / 1024).toFixed(0)} KB)${note ? ` — ${note}` : ""}`);
