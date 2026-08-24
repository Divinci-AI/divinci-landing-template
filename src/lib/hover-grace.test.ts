import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createHoverGrace, HOVER_GRACE_MS } from "./hover-grace";

describe("createHoverGrace", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("opens immediately", () => {
    const setOpen = vi.fn();
    createHoverGrace(setOpen).open();
    expect(setOpen).toHaveBeenCalledWith(true);
  });

  it("does NOT close instantly — the pointer needs time to reach the popover", () => {
    // The whole defect: closing on the trigger's mouseleave makes a portalled
    // popover unreachable, because moving toward it is leaving the trigger.
    const setOpen = vi.fn();
    const g = createHoverGrace(setOpen);
    g.open();
    setOpen.mockClear();
    g.scheduleClose();
    expect(setOpen).not.toHaveBeenCalled();
    vi.advanceTimersByTime(HOVER_GRACE_MS);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("entering the popover cancels the pending close", () => {
    // trigger mouseleave -> popover mouseenter, the actual journey.
    const setOpen = vi.fn();
    const g = createHoverGrace(setOpen);
    g.open();
    g.scheduleClose();
    vi.advanceTimersByTime(HOVER_GRACE_MS - 20);
    g.open();
    setOpen.mockClear();
    vi.advanceTimersByTime(HOVER_GRACE_MS * 4);
    expect(setOpen).not.toHaveBeenCalledWith(false);
  });

  it("leaving the popover still closes it", () => {
    const setOpen = vi.fn();
    const g = createHoverGrace(setOpen);
    g.open();
    g.scheduleClose();
    g.open();
    g.scheduleClose();
    vi.advanceTimersByTime(HOVER_GRACE_MS);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("a second scheduleClose does not close EARLIER than the last one", () => {
    // Restarting the timer must reset it, or hopping trigger->popover->trigger
    // could fire a close inherited from an older schedule.
    const setOpen = vi.fn();
    const g = createHoverGrace(setOpen);
    g.scheduleClose();
    vi.advanceTimersByTime(HOVER_GRACE_MS - 10);
    g.scheduleClose();
    vi.advanceTimersByTime(20);
    expect(setOpen).not.toHaveBeenCalled();
    vi.advanceTimersByTime(HOVER_GRACE_MS);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("cancel drops a pending close without closing (unmount)", () => {
    const setOpen = vi.fn();
    const g = createHoverGrace(setOpen);
    g.scheduleClose();
    g.cancel();
    vi.advanceTimersByTime(HOVER_GRACE_MS * 4);
    expect(setOpen).not.toHaveBeenCalled();
  });
});

// The helper passing proves nothing about whether it is WIRED IN. Reverting
// the component to `onMouseLeave={() => setOpen(false)}` would leave every
// test above green while the bubble became unreachable again.
describe("the source popover is actually reachable", () => {
  const read = async (f: string) => (await import("node:fs")).readFileSync(f, "utf8");

  /** Comments stripped: a guard must not be satisfied — or tripped — by prose.
   *  The fix's own comment quotes the buggy handler it replaced, which is
   *  exactly the kind of text a naive source assertion mistakes for code. */
  function code(src: string): string {
    return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  }

  /** Just the SourceChip component, so an assertion cannot be satisfied by a
   *  matching line that belongs to a different component in the same file. */
  async function sourceChipSource(): Promise<string> {
    const src = await read("src/components/chat/Transcript.tsx");
    const start = src.indexOf("function SourceChip({");
    const end = src.indexOf("function SourceChips({");
    expect(start, "SourceChip not found").toBeGreaterThan(-1);
    expect(end, "SourceChips not found").toBeGreaterThan(start);
    return code(src.slice(start, end));
  }

  it("the chip popover goes through the shared grace helper", async () => {
    const chip = await sourceChipSource();
    expect(chip, "chip must use createHoverGrace").toContain("createHoverGrace(setOpen)");
    expect(chip, "the bubble must cancel the pending close on enter").toContain("onMouseEnter={hover.open}");
    // BOTH the trigger and the bubble must re-arm the close, so count them
    // rather than merely finding one: an earlier version of this guard passed
    // while the TRIGGER had been reverted to the naive close, because the
    // bubble's own handler still satisfied a bare `toContain`.
    const rearms = chip.match(/onMouseLeave=\{hover\.scheduleClose\}/g) ?? [];
    expect(rearms.length, "trigger AND bubble must both re-arm the close").toBe(2);
    // And the naive form must be gone from this component entirely.
    expect(chip, "the naive immediate close makes the bubble unreachable").not.toMatch(
      /onMouseLeave=\{\(\) => setOpen\(false\)\}/,
    );
  });

  it("FloatingLayer forwards hover to the PORTALLED box", async () => {
    // Without this the bubble cannot report that the pointer reached it, and
    // no grace period in the trigger can help.
    const src = await read("src/components/chat/FloatingLayer.tsx");
    expect(src).toContain("onMouseEnter={onMouseEnter}");
    expect(src).toContain("onMouseLeave={onMouseLeave}");
  });

  // The counterpart guard: do NOT hand a grace period to a tooltip the pointer
  // is never meant to enter. Those close on leave correctly, and a delay would
  // only make them linger after the pointer has gone. Both are kept
  // non-interactive by `pointer-events-none`, which is what makes that correct.
  it("leaves the non-interactive tooltips alone", async () => {
    const tsx = await read("src/components/chat/Transcript.tsx");
    const citation = code(tsx.slice(tsx.indexOf("function Citation(")));
    expect(citation, "the [[n]] tooltip stays non-interactive").toContain("pointer-events-none");
    expect(citation, "the [[n]] tooltip needs no grace period").not.toContain("hover.scheduleClose");

    const showcase = await read("src/components/sections/TranscriptShowcase.astro");
    expect(showcase, "the static showcase tooltip stays non-interactive").toContain("pointer-events-none");
  });
});
