/**
 * Which side of its anchor a popover opens on.
 *
 * There are TWO popovers with this problem and they had two separate copies of
 * the rule — the React chat's FloatingLayer and the static showcase's inline
 * script — so fixing one left the other wrong. That is why the decision lives
 * here, in a module with no dependencies, importable from both an island and
 * an Astro `<script>`.
 *
 * The original rule, in both copies, preferred ABOVE whenever above happened
 * to fit:
 *
 *     const above = a.top >= t.height + 8;          // showcase
 *     !(roomAbove >= h + gap) && roomBelow > roomAbove;  // FloatingLayer
 *
 * For a citation near the top of the transcript that opens the bubble upward
 * across the message it belongs to, and when above fits by less than the
 * bubble's height it lands clamped against the viewport edge — which is what
 * "the popup isn't showing up like it should" looks like on the Acme Advisors demo.
 */
export function placeBelow(roomAbove: number, roomBelow: number, height: number, gap: number): boolean {
  const need = height + gap;
  const fitsAbove = roomAbove >= need;
  const fitsBelow = roomBelow >= need;
  if (fitsBelow && !fitsAbove) return true;
  if (fitsAbove && !fitsBelow) return false;
  // Both fit, or neither does: the roomier side. Ties go ABOVE, preserving the
  // original placement for the symmetric case.
  return roomBelow > roomAbove;
}
