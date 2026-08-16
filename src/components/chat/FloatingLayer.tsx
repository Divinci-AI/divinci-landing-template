import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

/**
 * A popover that is NOT clipped by the transcript's scroll container.
 *
 * The transcript scrolls (`overflow-y-auto`), and an `overflow` value other
 * than `visible` establishes a clipping box on BOTH axes — so an
 * `absolute bottom-full` bubble anchored to a chip near the top of the scroll
 * area is cut off at the container's edge. That is what made the source popups
 * on the BioRenew demo appear half-drawn and "covered up": nothing was on top
 * of them, they were being trimmed by their own ancestor.
 *
 * z-index cannot fix this. Clipping happens regardless of stacking order, and
 * raising z-index inside a clipped ancestor changes nothing. The only fixes are
 * to stop the ancestor clipping (it must scroll) or to take the bubble out of
 * it — which is what this does: a portal to <body> with `position: fixed`,
 * positioned from the anchor's viewport rect.
 *
 * Deliberately measures on every open rather than caching: the anchor is inside
 * a scroll container, so its viewport position changes as the reader scrolls.
 */
/**
 * Which side of the anchor the bubble opens on.
 *
 * The first rule preferred ABOVE whenever above happened to fit, and only
 * flipped when it did not AND below was roomier. For a citation chip near the
 * top of the transcript that means the bubble opens upward across the
 * conversation the reader is looking at — and when above fits by a margin
 * thinner than the bubble, it lands clamped against the viewport edge, on top
 * of the message it belongs to. That is what "the popup isn't showing up like
 * it should" looks like on the Aquillius demo.
 *
 * The rule now: take a side that FITS, and among two that fit take the roomier.
 * A chip near the top opens downward, one near the bottom opens upward, and
 * neither ever has to be clamped when there is anywhere it could have gone.
 *
 * Exported and pure so the decision is testable without a DOM — the bug lived
 * in one boolean, and one boolean is exactly what a test can pin.
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

export function FloatingLayer({
  anchorRef,
  open,
  children,
  className = "",
  role = "tooltip",
  gap = 8,
  maxWidth = "min(22rem, 80vw)",
}: {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  children: ReactNode;
  className?: string;
  role?: string;
  gap?: number;
  maxWidth?: string;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number }>();
  // Portals need a document. Astro renders this island's markup on the server,
  // so rendering the portal before mount would throw.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open || !mounted) {
      setPos(undefined);
      return;
    }
    const measure = () => {
      const a = anchorRef.current?.getBoundingClientRect();
      if (!a) return;
      const box = boxRef.current?.getBoundingClientRect();
      const h = box?.height ?? 0;
      const w = box?.width ?? 0;
      const roomAbove = a.top;
      const roomBelow = window.innerHeight - a.bottom;
      const below = placeBelow(roomAbove, roomBelow, h, gap);
      setPos({
        top: below ? a.bottom + gap : Math.max(8, a.top - gap - h),
        left: Math.min(Math.max(8, a.left), Math.max(8, window.innerWidth - w - 8)),
      });
    };
    measure();
    const raf = requestAnimationFrame(measure);
    // `true` — capture phase, so scrolling the TRANSCRIPT (not just the window)
    // repositions the bubble. Without capture the listener never fires for a
    // nested scroller and the bubble detaches from its chip.
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, mounted, anchorRef, gap]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      ref={boxRef}
      role={role}
      style={{
        position: "fixed",
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        maxWidth,
        // Above the sticky chat bar and the header, but this is a portal to
        // <body> so it competes with page chrome, not with transcript content.
        zIndex: 60,
        // Until the first measurement lands the box is parked off-screen;
        // hiding it avoids a one-frame flash in the corner.
        visibility: pos ? "visible" : "hidden",
      }}
      className={className}
    >
      {children}
    </div>,
    document.body,
  );
}
