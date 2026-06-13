/**
 * i18n runtime for the DrFurman.ai landing page.
 *
 * - `getUI(code)` returns the typed UI dictionary for a locale,
 *   falling back to English for any locale not yet translated (so the
 *   page always renders while locales are being filled in).
 * - `tokenize(str)` turns a source string's inline markup placeholders
 *   ({br}, {kbd}…{/kbd}) into a flat list of segments the .astro
 *   components re-inflate into real <br> / <kbd> — translators never
 *   touch HTML.
 *
 * Adding a locale = create src/i18n/ui/<code>.ts + add one import +
 * one registry line here. Nothing else.
 */
import { DEFAULT_LOCALE } from "./locales";
import { en, type UIStrings } from "./ui/en";
import { es } from "./ui/es";
import { fr } from "./ui/fr";
import { de } from "./ui/de";
import { it } from "./ui/it";
import { pt } from "./ui/pt";
import { nl } from "./ui/nl";
import { pl } from "./ui/pl";
import { ru } from "./ui/ru";
import { uk } from "./ui/uk";
import { cs } from "./ui/cs";
import { ro } from "./ui/ro";
import { el } from "./ui/el";
import { tr } from "./ui/tr";
import { ar } from "./ui/ar";
import { he } from "./ui/he";
import { hi } from "./ui/hi";
import { bn } from "./ui/bn";
import { ta } from "./ui/ta";
import { te } from "./ui/te";
import { mr } from "./ui/mr";
import { gu } from "./ui/gu";
import { pa } from "./ui/pa";
import { ur } from "./ui/ur";
import { fa } from "./ui/fa";
import { th } from "./ui/th";
import { vi } from "./ui/vi";
import { id } from "./ui/id";
import { ms } from "./ui/ms";
import { fil } from "./ui/fil";
import { ja } from "./ui/ja";
import { ko } from "./ui/ko";
import { zhHans } from "./ui/zh-hans";
import { zhHant } from "./ui/zh-hant";
import { sw } from "./ui/sw";
import { zu } from "./ui/zu";

/**
 * Locale dictionary registry — all 36 advertised languages. English is
 * the source; a locale absent here would render in English (graceful
 * fallback). Keys are the BCP-47 codes used in the URL.
 */
const DICTS: Record<string, UIStrings> = {
  en, es, fr, de, it, pt, nl, pl, ru, uk, cs, ro, el, tr, ar, he, hi, bn,
  ta, te, mr, gu, pa, ur, fa, th, vi, id, ms, fil, ja, ko,
  "zh-hans": zhHans,
  "zh-hant": zhHant,
  sw, zu,
};

export function getUI(code: string): UIStrings {
  return DICTS[code] ?? DICTS[DEFAULT_LOCALE];
}

/** True when a real (non-fallback) dictionary exists for this locale. */
export function hasUI(code: string): boolean {
  return code in DICTS;
}

export type { UIStrings };

// ── Inline-markup tokenizer ─────────────────────────────────────────
// Source strings carry two placeholder forms:
//   "{br}"            → a hard line break
//   "{kbd}Enter{/kbd}" → wrap "Enter" in a <kbd> chip
// tokenize() yields a flat segment list so .astro components can map
// over it without dangerouslySetInnerHTML.

export type Segment =
  | { kind: "text"; value: string }
  | { kind: "br" }
  | { kind: "kbd"; value: string };

export function tokenize(input: string): Segment[] {
  const out: Segment[] = [];
  // Split on {br} OR {kbd}...{/kbd}, keeping the delimiters.
  const re = /(\{br\}|\{kbd\}.*?\{\/kbd\})/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    if (m.index > lastIndex) {
      out.push({ kind: "text", value: input.slice(lastIndex, m.index) });
    }
    const tok = m[0];
    if (tok === "{br}") {
      out.push({ kind: "br" });
    } else {
      const inner = tok.slice("{kbd}".length, tok.length - "{/kbd}".length);
      out.push({ kind: "kbd", value: inner });
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < input.length) {
    out.push({ kind: "text", value: input.slice(lastIndex) });
  }
  return out;
}
