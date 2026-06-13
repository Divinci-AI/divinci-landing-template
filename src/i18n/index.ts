/**
 * i18n runtime for the landing-page template.
 *
 * - `getUI(code)` returns the typed UI dictionary for a locale, falling
 *   back to English for any locale without its own dictionary (so all
 *   advertised locales render while translations are filled in).
 * - `tokenize(str)` turns inline markup placeholders ({br}, {kbd}…{/kbd})
 *   into a flat segment list the .astro components re-inflate into real
 *   <br> / <kbd> — translators never touch HTML.
 *
 * The template ships ONLY the neutral English dictionary; every other
 * advertised locale (see LOCALES in ./locales) falls back to it. To
 * translate a locale, create src/i18n/ui/<code>.ts (typed as UIStrings)
 * and add one import + one registry line below.
 */
import { DEFAULT_LOCALE } from "./locales";
import { en, type UIStrings } from "./ui/en";

/**
 * Locale dictionary registry. English is the source; any advertised
 * locale absent here renders in English (graceful fallback via getUI).
 * Keys are the BCP-47 codes used in the URL.
 */
const DICTS: Record<string, UIStrings> = {
  en,
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
