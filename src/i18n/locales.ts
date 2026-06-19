/**
 * Locale registry for the landing-page template.
 *
 * Single source of truth for:
 *   - the Astro i18n config (`locales` list)
 *   - the language switcher (autonym + code)
 *   - the CorpusSection "supported languages" display (autonyms)
 *   - <html lang> + dir="rtl" rendering
 *
 * The 36 languages mirror the set advertised in CorpusSection — every
 * language Gemini 3.5 Flash supports for the chat. The page UI itself
 * is translated into each (see src/i18n/ui/<code>.ts).
 *
 * `code` is the BCP-47 tag used both as the URL prefix (/es/, /fr/,
 * /zh-hans/) and the <html lang> value. English is the default locale
 * and lives at the root (no prefix).
 *
 * `autonym` is the language's own name in its own script — what we
 * show in the switcher and the corpus list (the universal convention
 * for language pickers, and it means that list never needs per-locale
 * translation).
 *
 * `needsReview` flags locales whose machine translation should get a
 * native-speaker pass before they're considered production-quality —
 * primarily the Indic-script and Sub-Saharan-African languages where
 * automated quality is least reliable for a health-adjacent brand.
 */

export interface LocaleMeta {
  /** BCP-47 tag — URL prefix + <html lang>. */
  code: string;
  /** English name (for internal reference / aria text). */
  englishName: string;
  /** The language's own name in its own script (shown in UI). */
  autonym: string;
  /** Emoji flag for the language (shown in switcher dropdown + corpus pills). */
  flag: string;
  /** Writing direction. */
  dir: "ltr" | "rtl";
  /** True if the machine translation needs a native review pass. */
  needsReview?: boolean;
}

export const DEFAULT_LOCALE = "en";

export const LOCALES: LocaleMeta[] = [
  { code: "en", englishName: "English", autonym: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "es", englishName: "Spanish", autonym: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "fr", englishName: "French", autonym: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "de", englishName: "German", autonym: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "it", englishName: "Italian", autonym: "Italiano", flag: "🇮🇹", dir: "ltr" },
  { code: "pt", englishName: "Portuguese", autonym: "Português", flag: "🇵🇹", dir: "ltr" },
  { code: "nl", englishName: "Dutch", autonym: "Nederlands", flag: "🇳🇱", dir: "ltr" },
  { code: "pl", englishName: "Polish", autonym: "Polski", flag: "🇵🇱", dir: "ltr" },
  { code: "ru", englishName: "Russian", autonym: "Русский", flag: "🇷🇺", dir: "ltr" },
  { code: "uk", englishName: "Ukrainian", autonym: "Українська", flag: "🇺🇦", dir: "ltr" },
  { code: "cs", englishName: "Czech", autonym: "Čeština", flag: "🇨🇿", dir: "ltr" },
  { code: "ro", englishName: "Romanian", autonym: "Română", flag: "🇷🇴", dir: "ltr" },
  { code: "el", englishName: "Greek", autonym: "Ελληνικά", flag: "🇬🇷", dir: "ltr" },
  { code: "tr", englishName: "Turkish", autonym: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { code: "ar", englishName: "Arabic", autonym: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "he", englishName: "Hebrew", autonym: "עברית", flag: "🇮🇱", dir: "rtl" },
  { code: "hi", englishName: "Hindi", autonym: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
  { code: "bn", englishName: "Bengali", autonym: "বাংলা", flag: "🇧🇩", dir: "ltr"},
  { code: "ta", englishName: "Tamil", autonym: "தமிழ்", flag: "🇮🇳", dir: "ltr"},
  { code: "te", englishName: "Telugu", autonym: "తెలుగు", flag: "🇮🇳", dir: "ltr"},
  { code: "mr", englishName: "Marathi", autonym: "मराठी", flag: "🇮🇳", dir: "ltr"},
  { code: "gu", englishName: "Gujarati", autonym: "ગુજરાતી", flag: "🇮🇳", dir: "ltr"},
  { code: "pa", englishName: "Punjabi", autonym: "ਪੰਜਾਬੀ", flag: "🇮🇳", dir: "ltr"},
  { code: "ur", englishName: "Urdu", autonym: "اردو", flag: "🇵🇰", dir: "rtl"},
  { code: "fa", englishName: "Persian", autonym: "فارسی", flag: "🇮🇷", dir: "rtl" },
  { code: "th", englishName: "Thai", autonym: "ไทย", flag: "🇹🇭", dir: "ltr" },
  { code: "vi", englishName: "Vietnamese", autonym: "Tiếng Việt", flag: "🇻🇳", dir: "ltr" },
  { code: "id", englishName: "Indonesian", autonym: "Bahasa Indonesia", flag: "🇮🇩", dir: "ltr" },
  { code: "ms", englishName: "Malay", autonym: "Bahasa Melayu", flag: "🇲🇾", dir: "ltr" },
  { code: "fil", englishName: "Filipino", autonym: "Filipino", flag: "🇵🇭", dir: "ltr" },
  { code: "ja", englishName: "Japanese", autonym: "日本語", flag: "🇯🇵", dir: "ltr" },
  { code: "ko", englishName: "Korean", autonym: "한국어", flag: "🇰🇷", dir: "ltr" },
  { code: "zh-hans", englishName: "Chinese (Simplified)", autonym: "简体中文", flag: "🇨🇳", dir: "ltr" },
  { code: "zh-hant", englishName: "Chinese (Traditional)", autonym: "繁體中文", flag: "🇹🇼", dir: "ltr" },
  { code: "sw", englishName: "Swahili", autonym: "Kiswahili", flag: "🇰🇪", dir: "ltr"},
  { code: "zu", englishName: "Zulu", autonym: "isiZulu", flag: "🇿🇦", dir: "ltr"},
];

/** All locale codes, in display order. */
export const LOCALE_CODES = LOCALES.map((l) => l.code);

/** Non-default locale codes — these get a URL prefix + getStaticPaths entry. */
export const NON_DEFAULT_LOCALE_CODES = LOCALE_CODES.filter(
  (c) => c !== DEFAULT_LOCALE,
);

const BY_CODE = new Map(LOCALES.map((l) => [l.code, l]));

export function getLocaleMeta(code: string): LocaleMeta {
  return BY_CODE.get(code) ?? LOCALES[0];
}

/** Writing direction for a locale code (defaults ltr). */
export function dirFor(code: string): "ltr" | "rtl" {
  return BY_CODE.get(code)?.dir ?? "ltr";
}

/**
 * The autonym list shown in the CorpusSection "spoken in every
 * language" display — every supported language in its own name. This
 * is identical across page locales (autonyms are universal), so it
 * never needs per-locale translation.
 */
export const SUPPORTED_LANGUAGE_AUTONYMS = LOCALES.map((l) => l.autonym);
