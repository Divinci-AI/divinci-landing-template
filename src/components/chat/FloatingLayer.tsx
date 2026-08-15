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
      const below = !(roomAbove >= h + gap) && roomBelow > roomAbove;
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
