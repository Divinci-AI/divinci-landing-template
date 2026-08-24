/**
 * Keep a hover popover open while the pointer travels from its trigger INTO it.
 *
 * A popover that closes on the trigger's `mouseleave` is unreachable whenever
 * it is PORTALLED, because the popover is then not a DOM descendant of the
 * trigger — moving toward it IS leaving it. The bubble vanishes mid-journey and
 * anything interactive inside (here, a "View source" link) can never be
 * clicked, and a long excerpt can never be read.
 *
 * This is a regression that portalling introduces silently. The source popover
 * was originally `absolute`, where the pointer stayed inside the trigger's
 * subtree and `mouseleave` never fired. Moving it to a portal — necessary,
 * because the scrolling transcript clips its descendants on both axes — was
 * correct for clipping and quietly broke hover. Reported on the biorenewim
 * demo, 2026-08-23.
 *
 * The fix is a short close DELAY that the popover itself cancels on enter:
 *
 *     trigger  mouseenter -> open()            mouseleave -> scheduleClose()
 *     popover  mouseenter -> open()  (cancels) mouseleave -> scheduleClose()
 *
 * ⚠️ Only for popovers with content worth reaching. A `pointer-events-none`
 * tooltip cannot receive mouseenter at all, so giving it a grace period just
 * makes it linger after the pointer has gone.
 */
export const HOVER_GRACE_MS = 160;

export interface HoverGrace {
  /** Show now, cancelling any pending close. */
  open(): void;
  /** Close after the grace period, unless `open()` happens first. */
  scheduleClose(): void;
  /** Drop any pending close without changing visibility (unmount cleanup). */
  cancel(): void;
}

export function createHoverGrace(
  setOpen: (open: boolean) => void,
  delayMs: number = HOVER_GRACE_MS,
): HoverGrace {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const clear = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };
  return {
    open() {
      clear();
      setOpen(true);
    },
    scheduleClose() {
      clear();
      timer = setTimeout(() => {
        timer = null;
        setOpen(false);
      }, delayMs);
    },
    cancel: clear,
  };
}
