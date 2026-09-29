/**
 * Turn the platform's moderation refusal into something a visitor can read.
 *
 * WHY (2026-09-28 prospect rehearsal). When a prompt fails moderation, the
 * anonymous-chat path answers with
 *
 *     I can't help with that request.
 *
 *     Message considered harmful (Specialized Advice).
 *
 * and attaches the SAME string as a "severe" safetyAdvisory, so the demo showed
 * the classifier's label twice, in a reply bubble and again in the amber
 * banner. A clinic prospect asking "Do I need surgery?" was told their question
 * was "harmful". Declining that question is right; the wording is not.
 *
 * The root is server copy (`formatModerationReasons`, shared with voice, SMS
 * and the embed). This is the demo-side fix, so it only rewrites text that is
 * recognisably that refusal and leaves every other reply untouched. Genuine
 * medical-safety advisories (a different server check, with its own wording)
 * still render.
 */

const REFUSAL_HEAD = /^\s*I can(?:'|’)?t help with that request\.\s*/i;
const REASON = /Message considered harmful(?:\s*\(([^)]+)\))?\.?/gi;
const NO_REASON = /^\s*This message did not pass content moderation\.?\s*$/i;

export interface Refusal {
  /** Categories the platform named, e.g. "Specialized Advice". Empty if none. */
  categories: string[];
}

/** Is this reply the platform's moderation refusal? Returns its categories if so. */
export function detectRefusal(text: string | undefined): Refusal | null {
  if (!text) return null;
  if (NO_REASON.test(text)) return { categories: [] };
  if (!REFUSAL_HEAD.test(text)) return null;
  const rest = text.replace(REFUSAL_HEAD, "");
  const categories = [...rest.matchAll(REASON)].map((m) => (m[1] ?? "").trim()).filter(Boolean);
  // Only the refusal: the head plus nothing but reason lines. A real answer
  // that happens to start with "I can't help with that request." is kept.
  const leftover = rest.replace(REASON, "").trim();
  return leftover ? null : { categories };
}

/** The visitor-facing sentence for a refusal. Plain, no classifier vocabulary. */
export function refusalCopy(r: Refusal): string {
  if (r.categories.some((c) => /speciali[sz]ed advice/i.test(c)))
    return "That's a question for a qualified professional, so I can't answer it here. " +
      "I'm happy to help you find the right page, service or person on this site instead.";
  return "I can't help with that one. Ask me about anything on this site and I'll do my best.";
}

/** Rewrite a reply if it is the moderation refusal; otherwise return it unchanged. */
export function humanizeReply(text: string): string {
  const r = detectRefusal(text);
  return r ? refusalCopy(r) : text;
}

/**
 * The advisory banner is worth showing only when it adds something. The
 * moderation path copies the reply into it verbatim; showing that twice is the
 * duplicate the rehearsal caught.
 */
export function advisoryAddsInformation(advisoryText: string | undefined, rawReply: string): boolean {
  if (!advisoryText) return false;
  if (detectRefusal(advisoryText)) return false;
  return advisoryText.trim() !== rawReply.trim();
}
