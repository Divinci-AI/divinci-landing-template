/**
 * Clean a RAG chunk/source title for end-user display:
 * strip a trailing file extension and shard suffix, turn dashes/underscores
 * into spaces, and title-case fully-lowercase words.
 *   "Eat_For_Health.pdf"                            → "Eat For Health"
 *   "S2-E26-habits.txt"                             → "S2 E26 Habits"
 *   "Guide - Paperback.html"                        → "Guide Paperback"
 *   "atd-autoimmune-threshold-test.txt (shard 2/2)" → "Atd Autoimmune Threshold Test"
 *   "69a5e2883ab43f02e7023ab6.md"                   → "69a5e288…" (id-named file)
 * Falls back to the original string if cleaning would empty it.
 *
 * End-user-facing surfaces (this landing page) always show CLEANED names;
 * raw filenames are for operator surfaces (the whitelabel transcript views).
 *
 * KEEP IN SYNC with the platform copies:
 *   workspace/clients/web/src/components/Transcript/views/Chat/Transcript/utils/cleanContextTitle.ts
 *   workspace/clients/embed/embed-client/src/components/ContextDisplay/contextLabel.ts
 */
export function cleanContextTitle(name: string): string {
  let cleaned = name
    .replace(/\s*\(shard\s+\d+\s*\/\s*\d+\)\s*$/i, "") // "(shard 2/2)" suffix
    .replace(/\.[a-z0-9]{1,8}$/i, "")                  // trailing extension
    .replace(/[-_]+/g, " ")                            // dashes / underscores → space
    .replace(/\s+/g, " ")                              // collapse whitespace
    .trim();
  if (cleaned.length === 0) return name;

  // Mongo-id-named files have no human title — show a short handle.
  if (/^[a-f0-9]{24}$/i.test(cleaned)) {
    return `${cleaned.slice(0, 8)}…`;
  }

  // Title-case purely-alphabetic lowercase words; leave mixed-case, ALL-CAPS,
  // and digit-bearing tokens ("v1.2", "10in20") untouched.
  return cleaned
    .split(" ")
    .map((w) => (/^[a-z]+$/.test(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}
