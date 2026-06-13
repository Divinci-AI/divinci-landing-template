// Generates the social-share unfurl card (1200x630) as an SVG, embedding the
// brand wordmark as a base64 data-URI, then rasterizes via rsvg-convert (see
// the npm "og" script). All brand values come from src/brand.config.ts — the
// single source of truth (no duplicated palette).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { brand } from "../src/brand.config.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// brand.media.logo is a public-root path (e.g. "/brand/logo.svg").
const logoSvg = readFileSync(resolve(root, "public", brand.media.logo.replace(/^\//, "")));
const logoB64 = logoSvg.toString("base64");

// Brand tokens — from brand.config.palette (kills the old global.css dup).
const NAVY = brand.palette.primary;
const GREEN_DARK = brand.palette.dark;
const GREEN_MID = brand.palette.mid;
const GREEN_LEAF = brand.palette.accent;
const CREAM = brand.palette.cream;
const TEXT = brand.palette.text;

const TAGLINE = brand.media.ogTagline;
const SUBTITLE = brand.media.ogSubtitle;
const PLACEHOLDER = `Ask the ${brand.identity.productName}…`;

// Lockup geometry — logo wordmark + gradient "AI" + sparkles, centered as a row.
const LOGO_H = 86;
const LOGO_W = (LOGO_H * 200) / 42; // preserve 200x42 aspect → ~409
const GAP = 30;
const AI_FONT = 96;
const AI_W = 122;
const ROW_CENTER_Y = 196;
const totalW = LOGO_W + GAP + AI_W;
const startX = (1200 - totalW) / 2;
const logoX = startX;
const logoY = ROW_CENTER_Y - LOGO_H / 2;
const aiX = startX + LOGO_W + GAP;
const aiBaseline = ROW_CENTER_Y + AI_FONT * 0.34;

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

  <image x="${logoX}" y="${logoY}" width="${LOGO_W}" height="${LOGO_H}" xlink:href="data:image/svg+xml;base64,${logoB64}"/>
  <text x="${aiX}" y="${aiBaseline}" font-family="Helvetica, Arial, sans-serif" font-size="${AI_FONT}" font-weight="800" letter-spacing="-2" fill="url(#aiGrad)">AI</text>
  ${star(aiX + AI_W - 6, ROW_CENTER_Y - AI_FONT * 0.34, 26, GREEN_LEAF)}
  ${star(aiX - 4, ROW_CENTER_Y + AI_FONT * 0.36, 18, GREEN_MID)}

  <text x="600" y="360" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="58" font-weight="700" letter-spacing="-1" fill="${TEXT}">${TAGLINE}</text>

  <text x="600" y="418" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="400" fill="${NAVY}">${SUBTITLE}</text>

  <g>
    <rect x="320" y="476" width="560" height="72" rx="36" fill="#ffffff" fill-opacity="0.94" stroke="${GREEN_DARK}" stroke-opacity="0.28" stroke-width="1.5"/>
    <text x="356" y="521" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="400" fill="#7c8390">${PLACEHOLDER}</text>
    <circle cx="844" cy="512" r="28" fill="${GREEN_DARK}"/>
    <path transform="translate(830 498) scale(1.15)" d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="#ffffff"/>
  </g>
</svg>`;

const outSvg = resolve(root, "public/og-card.svg");
writeFileSync(outSvg, svg);
console.log("Wrote", outSvg);
