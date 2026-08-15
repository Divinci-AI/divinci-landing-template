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
