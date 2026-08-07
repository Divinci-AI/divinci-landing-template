import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The desktop nav is `hidden md:flex`. For as long as that was the only nav,
 * every link in the header was unreachable below 768px — no menu button, no
 * alternative, just a logo. Measured on a deployed demo at 390px: nav present
 * in the DOM, `display: none`, 3 links, and no element in the header with
 * `aria-expanded` or a `<button>`.
 *
 * Astro components are not rendered in this suite, so these are source-level
 * guards. They are worth having anyway: the failure mode is silent — the page
 * looks fine, it is simply missing navigation that nobody notices until a
 * prospect does.
 */
const src = (p: string): string =>
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", ...p.split("/")), "utf8");

const header = src("components/Header.astro");
const landing = src("layouts/Landing.astro");

describe("mobile navigation", () => {
  it("ships a toggle that only exists below the desktop breakpoint", () => {
    expect(header).toMatch(/id="nav-toggle"/);
    expect(header).toMatch(/md:hidden/);
  });

  it("wires the toggle to the panel for screen readers", () => {
    expect(header).toMatch(/aria-controls="mobile-nav"/);
    expect(header).toMatch(/aria-expanded="false"/);
  });

  it("renders the SAME nav items, not a hand-maintained second list", () => {
    // Two lists drift, and the one that drifts is the one nobody looks at.
    expect(header.match(/navItems\.map/g) ?? []).toHaveLength(2);
  });

  it("closes when a link is chosen — every link is an in-page anchor", () => {
    // Leaving it open would cover the section the visitor just asked to see.
    expect(header).toMatch(/mobileNav\.querySelectorAll\("a"\)/);
  });

  it("closes when the viewport crosses to desktop", () => {
    // Otherwise the panel stays stuck open underneath the desktop nav.
    expect(header).toMatch(/min-width: 768px/);
  });

  it("keeps the links in the DOM when closed", () => {
    // `hidden` as the closed state, not conditional rendering: with JS off the
    // toggle never appears, rather than appearing and doing nothing.
    expect(header).toMatch(/id="mobile-nav" hidden/);
  });
});

describe("the bios section is optional", () => {
  it("can be turned off", () => {
    // With no identifiable person the card falls back to the ORGANISATION's
    // name under a personal role — a deployed demo read "The Space Finance
    // Group — Founder". An absent section is honest; a wrong one is not.
    expect(landing).toMatch(/brand\.sections\?\.bios !== false && <BiosSection/);
  });

  it("still renders by default", () => {
    // `!== false` rather than truthiness: an existing brand.config that has
    // never heard of this flag must be unaffected.
    expect(landing).not.toMatch(/brand\.sections\?\.bios && <BiosSection/);
  });
});

describe("new UI strings must not break existing demos", () => {
  it("the menu label is a component fallback, NOT a neutral-copy key", () => {
    // Per-customer copy is validated against the neutral en.ts SHAPE, and a
    // generated file missing a key is rejected wholesale — the run keeps the
    // neutral copy, so the demo ships branded "Acme Expert AI" in its title,
    // og:title, chat welcome and CTA. Adding `menuAriaLabel` to en.ts did
    // exactly that to a live mach33 demo, and it is the second time this class
    // has silently reverted demos.
    //
    // Rule: a new UI string gets a literal fallback in the component. A key in
    // en.ts is only correct alongside regenerating every demo's copy.
    expect(src("i18n/ui/en.ts")).not.toContain("menuAriaLabel");
    expect(header).toMatch(/menuAriaLabel \?\? "Menu"/);
  });
});
