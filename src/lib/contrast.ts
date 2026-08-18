/**
 * WCAG contrast, used to pick readable colours from an EXTRACTED brand palette.
 *
 * The template's section styling assumed `accent` is a bright colour that
 * contrasts with the dark `primary` section background. That assumption is a
 * property of most brands, not all of them — and when it fails, it fails
 * silently and almost totally.
 *
 * AuraPath: `primary #1a1610`, `accent #0f0d08`. Both nearly black. The final
 * CTA rendered an accent-on-primary button with primary-coloured label text at
 * a contrast ratio of **1.08:1** against a required 4.5:1 — an invisible button
 * that only became readable on hover, because the hover state happens to
 * hardcode white. A visitor who never moused over it would not know the page's
 * main call to action was there.
 *
 * Palettes are derived from whatever colours a customer's site happens to use,
 * so this cannot be fixed by choosing better defaults. It has to be measured.
 */

/** Relative luminance per WCAG 2.x, from a `#rrggbb` string. */
export function luminance(hex: string): number {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio between two colours: 1 (identical) to 21 (black/white). */
export function contrastRatio(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** WCAG AA for normal-size body text. */
export const AA_TEXT = 4.5;
/** WCAG AA for large text (>=18.66px bold or >=24px) and UI component edges. */
export const AA_LARGE = 3;

/**
 * Pick the more readable of two candidate colours against `bg`.
 *
 * Ties go to `preferred` — the brand's own colour — so a palette that ALREADY
 * works is never overridden by this. It only intervenes where the brand's
 * choice is unreadable.
 */
export function readableOn(bg: string, preferred: string, fallback: string): string {
  return contrastRatio(preferred, bg) >= contrastRatio(fallback, bg) ? preferred : fallback;
}

/**
 * A legible {background, text} pair for a solid button on `sectionBg`.
 *
 * Every candidate is MEASURED against the section it sits on. An earlier
 * version tried the accent and then fell back to `cream` unconditionally,
 * which assumed `cream` is a light colour. On a dark-page brand `cream` IS the
 * page colour — Freedom with AI's palette has `primary` and `cream` both
 * `#0f1419` — so the fallback painted the button in the section's own colour
 * and then, finding no readable brand ink for it, labelled it `#000000`:
 * invisible on invisible, on the page's primary call to action.
 *
 * So the background is the first candidate that clears AA_LARGE against the
 * section, and the label the first that clears AA_TEXT against that
 * background. Brand colours come first in both lists, so a palette that
 * already works is never restyled; `#ffffff`/`#000000` are last and exist only
 * to guarantee the loop always terminates on a legible pair.
 */
export function buttonColors(
  sectionBg: string,
  accent: string,
  label: string,
  cream: string,
): { bg: string; text: string } {
  // Brand ink first, then the two colours that always work somewhere. `label`
  // and `sectionBg` are both brand-toned darks on these palettes; preferring
  // them over pure black keeps a warm palette warm, since legibility is a
  // threshold to clear rather than a number to maximise.
  const inks = [label, sectionBg, cream, "#ffffff", "#000000"];
  for (const bg of [accent, cream, "#ffffff", "#000000"]) {
    if (contrastRatio(bg, sectionBg) < AA_LARGE) continue;
    const text = inks.find((ink) => contrastRatio(ink, bg) >= AA_TEXT);
    if (text) return { bg, text };
  }
  // Unreachable in practice: a section is either light enough for a black
  // button or dark enough for a white one. Kept so the function is total.
  return { bg: "#ffffff", text: "#000000" };
}

/**
 * The Tailwind filter that makes a single-colour logo visible on the chrome.
 *
 * The rule the hero, the header and the avatar circles all need, in one place:
 * a dark-ink logo disappears on a dark page and must be whited out, and a
 * white logo (drawn for a dark header) washes out on a light page and must be
 * blacked out. A logo that already matches its surface is left alone.
 *
 * `brightness-0 invert` is a silhouette, so it is right for a mark drawn in
 * one colour and wrong for a full-colour one — apply it to `logo`, whose
 * lightness `logoIsLight` describes, not to an unclassified `markLogo`.
 */
export function logoInkClass(isDarkBrand: boolean, logoIsLight: boolean | undefined): string {
  if (isDarkBrand) return logoIsLight ? "" : "brightness-0 invert";
  return logoIsLight ? "brightness-0" : "";
}

/**
 * Below this luminance the PAGE needs LIGHT ink, which is what "dark brand"
 * has to mean if the classification is to decide anything.
 *
 * Derived, not chosen: white text clears AA (4.5:1) on a background of
 * luminance L while (1.0 + 0.05) / (L + 0.05) >= 4.5, i.e. L <= 0.1833. Above
 * that white starts failing and the light mapping is the right one.
 *
 * A first attempt used 0.22, which is the OTHER end of the same calculation —
 * the point below which near-black ink stops clearing AA. Between the two
 * values neither ink works, so picking the upper bound classifies as "dark"
 * several pages that light ink cannot serve either.
 *
 * Mirrors DARK_PAGE_MAX_LUM in the extractor that produces these palettes.
 * The two must agree: the extractor decides which mapping to emit and the
 * template decides which surfaces to paint, so a palette classified dark by
 * one and light by the other renders light text on a light page.
 */
export const DARK_BRAND_MAX_LUM = 0.1833;

/**
 * Is this a dark-page brand? Keyed on `cream`, which means "the page colour"
 * on both extractor paths — its name is a light-theme relic, not a claim.
 */
export function isDarkPalette(cream: string): boolean {
  return luminance(cream) < DARK_BRAND_MAX_LUM;
}
