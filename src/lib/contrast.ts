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
 * Tries the brand's own accent first and keeps it whenever it clears AA against
 * both the section behind it and its own label. Otherwise falls back to a pair
 * built from the palette's cream/near-white, which is what the hover state
 * already used — so the fallback is the design that was always there, just
 * reached without needing a mouse.
 */
export function buttonColors(
  sectionBg: string,
  accent: string,
  label: string,
  cream: string,
): { bg: string; text: string } {
  const accentWorks =
    contrastRatio(accent, sectionBg) >= AA_LARGE && contrastRatio(label, accent) >= AA_TEXT;
  if (accentWorks) return { bg: accent, text: label };
  // Cream against a dark section, with the darkest available label on it.
  return { bg: cream, text: readableOn(cream, sectionBg, "#000000") };
}
