import { brand } from "~/brand.config";

/**
 * The brand name shown beside the separately-styled "AI" glyphs.
 *
 * Two rules, in order:
 *
 * 1. Prefer `identity.lockupName` when the brand supplies one. A long legal
 *    name wraps: "BioRenew Integrative Medicine" broke to two lines in the
 *    hero and left "AI" stranded at the upper right, no longer reading as one
 *    lockup. There is no shortening rule good enough to apply automatically —
 *    "Integrative Medicine" is droppable, "Group" / "Associates" / "Clinic"
 *    often are not — so the short form is authored per brand, not guessed.
 *
 * 2. Strip a trailing "AI" from whichever name is used. The lockup draws "AI"
 *    itself, so a name that already ends in it renders "AuraPath AI AI".
 */
export function lockupWord(): string {
  const name = (brand.identity.lockupName || brand.identity.siteName).trim();
  return name.replace(/\s*\bai\s*$/i, "").trim() || name;
}

/**
 * Split the name for a logo MARK that already draws its opening letters.
 *
 * A square mark normally forces the whole name to be set as text, because a
 * mark carries no name. But some marks ARE the first letter: Probed's is a
 * ringed "P". Setting the full word beside it reads "P Probed", and dropping
 * the mark throws away the brand's actual artwork.
 *
 * With `media.logoDepictsPrefix: "P"` the hero draws the mark and sets only
 * "robed" next to it, so the lockup still spells the name once — the mark
 * doing the work of its own letter.
 *
 * Returns null whenever that cannot be done safely: no prefix declared, or a
 * prefix the name does not actually start with. Never guess — inferring "the
 * mark probably shows the first letter" from a square aspect ratio would
 * silently eat the "A" of every brand beginning with one.
 */
export function lockupMarkSplit(): { rest: string } | null {
  const prefix = brand.media.logoDepictsPrefix;
  if (!prefix) return null;
  const word = lockupWord();
  if (!word.toLowerCase().startsWith(prefix.toLowerCase())) return null;
  const rest = word.slice(prefix.length);
  // A mark that depicts the WHOLE name leaves nothing to set beside it; that
  // is an ordinary mark, and the caller should fall back to its normal path.
  if (!rest.trim()) return null;
  return { rest };
}
