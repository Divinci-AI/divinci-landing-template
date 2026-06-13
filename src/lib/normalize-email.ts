/**
 * Canonicalize an email address to its quota-relevant form.
 *
 * The free-message gate keys off `sha256(normalizeEmail(raw))`. Without
 * normalization, a Gmail user could mint unlimited free messages via
 * dot-permutations (`m.ike@gmail.com` vs `mike@gmail.com`), the
 * `+tag` alias mechanism (`mike+spam@gmail.com`), or the
 * `googlemail.com` domain alias.
 *
 * Rules — applied in order:
 *
 *   1. trim() + toLowerCase().
 *   2. For any domain in PLUS_TAG_DOMAINS, strip everything from the
 *      first `+` to the `@` in the local part (sub-addressing).
 *   3. For Gmail-family domains, strip all `.` from the local part
 *      (Gmail treats dots as insignificant for routing).
 *   4. For Gmail-family, rewrite domain to `gmail.com` (so
 *      `googlemail.com` collapses).
 *
 * Domains NOT in the allowlists are treated literally. This is
 * intentional — many smaller providers route `user+tag@x.io` to a
 * literal `user+tag` inbox; aggressive `+` stripping would conflate
 * unrelated users. We only normalize providers we KNOW use these
 * conventions.
 *
 * Edge cases:
 *   - No `@` at all → returns trimmed+lowercased input unchanged (the
 *     downstream regex will reject it as invalid format).
 *   - Empty local after stripping (`+abc@gmail.com`) → return as-is;
 *     downstream regex will catch it.
 *   - Quoted local parts (`"foo"@example.com`) → treated literally; the
 *     downstream regex rejects them anyway.
 */

// Providers that use `+tag` for sub-addressing. All deliver `user+x@y`
// to `user@y`'s inbox, so they're effectively the same account.
const PLUS_TAG_DOMAINS = new Set<string>([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "protonmail.ch",
  "icloud.com",
  "me.com",
  "mac.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.co.jp",
  "ymail.com",
  "fastmail.com",
  "fastmail.fm",
]);

// Providers where dots in the local part are insignificant for routing
// (Gmail and its googlemail.com alias).
const GMAIL_FAMILY_DOMAINS = new Set<string>(["gmail.com", "googlemail.com"]);

export function normalizeEmail(raw: string): string {
  if (typeof raw !== "string") return "";
  const email = raw.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 0) return email;

  let local = email.slice(0, at);
  let domain = email.slice(at + 1);

  if (PLUS_TAG_DOMAINS.has(domain)) {
    const plus = local.indexOf("+");
    if (plus >= 0) local = local.slice(0, plus);
  }

  if (GMAIL_FAMILY_DOMAINS.has(domain)) {
    local = local.replace(/\./g, "");
    domain = "gmail.com";
  }

  return `${local}@${domain}`;
}
