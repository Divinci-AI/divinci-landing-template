import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * A token may not be both the INK and the SURFACE it sits on.
 *
 * WHY THIS IS THE RIGHT INVARIANT, and why the denylist version was not.
 *
 * `--color-df-green-dark` names a VALUE ("the brand's deep tone"). The design
 * uses it in two ROLES: ink at some call sites, surface at others. Roles have a
 * compatibility relation — ink must contrast with its surface — and values do
 * not, so nothing in the type system can object. The failure appears only where
 * the two roles MEET.
 *
 * An earlier test banned `text-df-green-dark` outright. That is too strong and
 * too weak at once:
 *   - too strong: on a LIGHT brand, green-dark as ink is correct nearly
 *     everywhere, so the ban would fail dozens of legitimate call sites;
 *   - too weak: it says nothing about the one arrangement that is always wrong.
 *
 * The arrangement that is always wrong is a token painted onto ITSELF. That is
 * brand-independent: it renders invisible on light brands and dark brands
 * alike, because the contrast is zero by construction.
 *
 * FOUND BY THIS TEST, live in the template: BrandAvatar wraps the initials in
 * `bg-df-green-dark` and then colours them `text-df-green-dark`. The Acme Realty
 * demo shipped a blank navy circle where the assistant's avatar should be. It
 * was mistaken for a dark-brand bug for most of a session; Acme Realty is a light
 * brand, and it was never about brand lightness at all.
 */

const SRC = new URL("..", import.meta.url).pathname;

/**
 * The surface's influence is its ELEMENT SUBTREE, found by tag-depth walking.
 *
 * ⚠️ A character window does not work, and failing that way is instructive: the
 * first version scanned 700 chars forward and stopped at the next `bg-df-*`.
 * It flagged BiosSection, whose avatar is correct (`bg-df-green-dark` with
 * `text-df-on-chrome`) — the window simply ran past `</span>` into a SIBLING
 * that legitimately uses green-dark as ink on the page background. One false
 * positive is enough to get a test switched off, so the scope has to be the
 * real subtree: ink inside the element that paints the surface.
 */
function subtreeAfter(body: string, openTagEnd: number): string {
  let depth = 1;
  let i = openTagEnd;
  while (i < body.length && depth > 0) {
    const open = body.indexOf("<", i);
    if (open === -1) break;
    if (body.startsWith("</", open)) depth -= 1;
    else if (/[A-Za-z]/.test(body[open + 1] ?? "")) {
      // Self-closing tags open and close in one go.
      const gt = body.indexOf(">", open);
      if (gt !== -1 && body[gt - 1] === "/") { i = gt + 1; continue; }
      depth += 1;
    }
    const gt = body.indexOf(">", open);
    if (gt === -1) break;
    i = gt + 1;
  }
  return body.slice(openTagEnd, i);
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "__test__" || entry === "node_modules") continue;
    const q = join(dir, entry);
    if (statSync(q).isDirectory()) walk(q, out);
    else if (/\.(astro|tsx)$/.test(entry)) out.push(q);
  }
  return out;
}

/** Strip comments — a warning ABOUT the pattern must not fail the test. */
function code(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

interface Conflict { file: string; token: string; excerpt: string }

function conflictsIn(body: string, file = ""): Conflict[] {
  const out: Conflict[] = [];
  // ⚠️ FULL-OPACITY backgrounds only. `bg-df-green-dark/5` is a 5% tint over the
  // page, not the dark tone — same-token ink on it is correct and high-contrast,
  // and SignupCTA, StickyChatBar and Transcript all do exactly that legitimately.
  // Treating a tint as its own base colour produced three false positives, which
  // is three more than it takes for a test to be deleted. A suffix of 80+ is
  // close enough to opaque to count.
  const surface = /\bbg-df-([a-z0-9-]+?)(?:\/(\d+))?(?=["'\s])/g;
  let m: RegExpExecArray | null;
  while ((m = surface.exec(body)) !== null) {
    const token = m[1];
    const opacity = m[2] ? Number(m[2]) : 100;
    if (opacity < 80) continue;
    // ⚠️ Is this background in a real ELEMENT attribute, or just a string?
    // Ternary branches in a className template literal are ALTERNATIVES, not
    // nesting — Transcript's thumb() has `bg-df-green-dark text-df-on-chrome`
    // in the on-branch and something else in the off-branch. Walking tags from
    // inside a template literal finds no element boundary and sweeps up the
    // rest of the file, which is how that became a false positive.
    const qStart = Math.max(body.lastIndexOf('"', m.index), body.lastIndexOf("'", m.index));
    const before = body.slice(Math.max(0, qStart - 24), qStart);
    const isAttribute = /\b(?:class|className)\s*=\s*\{?\s*$/.test(before);

    let scope: string;
    if (isAttribute) {
      const openTagEnd = body.indexOf(">", m.index);
      if (openTagEnd === -1) continue;
      // The element's own class attribute, plus everything it contains.
      const ownTag = body.slice(body.lastIndexOf("<", m.index), openTagEnd + 1);
      scope = ownTag + subtreeAfter(body, openTagEnd + 1);
    } else {
      // A bare string: only what is in THIS string can share its surface.
      const qEnd = body.indexOf(body[qStart] ?? '"', m.index);
      scope = body.slice(qStart, qEnd === -1 ? m.index + 200 : qEnd);
    }
    const ink = new RegExp(`\\btext-df-${token}(?:/\\d+)?(?=["'\\s])`);
    if (ink.test(scope)) {
      out.push({ file, token, excerpt: scope.replace(/\s+/g, " ").trim().slice(0, 100) });
    }
  }
  return out;
}

function findConflicts(file: string): Conflict[] {
  return conflictsIn(code(readFileSync(file, "utf8")), file.slice(SRC.length));
}

describe("no token is painted onto itself", () => {
  const files = walk(SRC);

  it("scans a meaningful number of components", () => {
    // A pathing mistake that scans nothing would pass silently — the exact
    // class of non-instrument this suite exists to prevent.
    expect(files.length).toBeGreaterThan(10);
  });

  it("finds no element whose ink token equals its surface token", () => {
    const conflicts = files.flatMap(findConflicts);
    expect(
      conflicts.map((c) => `${c.file}: bg-df-${c.token} + text-df-${c.token} — ${c.excerpt}`),
      "ink painted onto its own background renders invisible on EVERY brand. " +
        "Use text-df-on-chrome over a brand-coloured surface, or a dedicated " +
        "ink token — never the surface's own token.",
    ).toEqual([]);
  });
});

describe("the detector itself", () => {
  // A scanner nobody has seen fail is not a scanner.
  const flags = (src: string) => conflictsIn(code(src)).length > 0;

  it("flags the real BrandAvatar shape", () => {
    expect(
      flags(`<span class="rounded-full bg-df-green-dark text-df-on-chrome">
               <span class="text-[11px] font-bold text-df-green-dark">G</span>
             </span>`),
    ).toBe(true);
  });

  it("accepts contrasting ink on the same surface", () => {
    expect(flags(`<span class="bg-df-green-dark text-df-on-chrome">G</span>`)).toBe(false);
  });

  it("does not blame a SIBLING outside the element — the BiosSection false positive", () => {
    expect(
      flags(`<span class="rounded-full bg-df-green-dark text-df-on-chrome">JD</span>
             <p class="text-df-green-dark">role label on the page background</p>`),
    ).toBe(false);
  });

  it("does NOT flag a low-opacity tint — this assertion was wrong first time", () => {
    // Written asserting `true` on the assumption that a tint is the same
    // surface. The real template disproved it: SignupCTA, StickyChatBar and
    // Transcript all pair `bg-df-green-dark/5` with `text-df-green-dark`, which
    // is a pale wash under dark ink — correct, and high contrast. A 5% tint is
    // not the dark tone.
    expect(
      flags(`<span class="bg-df-green-leaf/20"><i class="text-df-green-leaf">x</i></span>`),
    ).toBe(false);
  });

  it("does not treat TERNARY BRANCHES as nesting — the Transcript false positive", () => {
    // Two alternatives in one className literal are never on top of each other.
    expect(
      flags('const t = on ? "bg-df-green-dark text-df-on-chrome" : "text-df-green-dark";'),
    ).toBe(false);
  });

  it("still flags a NEAR-opaque background", () => {
    expect(
      flags(`<span class="bg-df-green-dark/90"><i class="text-df-green-dark">x</i></span>`),
    ).toBe(true);
  });
});

describe("a component that does not own its background cannot pick ink that depends on one", () => {
  /**
   * The cross-file half of the same bug, and the half that actually shipped.
   *
   * BrandAvatar takes a `className` prop and its CALLERS supply the surface
   * (`bg-df-green-dark`). Internally it coloured the initials
   * `text-df-green-dark` — the same token, in a different file — so no
   * single-file scan could see it. Acme Realty shipped a blank navy circle.
   *
   * The invariant is a design rule, not a colour rule: a component whose
   * background is chosen by its caller may only use ink that is correct against
   * ANY caller-supplied surface. `on-chrome` is exactly that token; a brand
   * value token is exactly not.
   */
  const SURFACE_CAPABLE = ["green-dark", "navy", "green-mid", "cream", "cream-soft", "surface"];

  const componentsTakingClassName = walk(SRC).filter((f) => {
    const body = code(readFileSync(f, "utf8"));
    // Receives a className/class prop AND puts it on something it renders.
    return /\b(?:className|class)\s*[?:]/.test(body) && /\$\{\s*className\s*\}|\{className\}/.test(body);
  });

  it("finds components that take a className prop (else this asserts nothing)", () => {
    expect(componentsTakingClassName.length).toBeGreaterThan(0);
  });

  for (const token of SURFACE_CAPABLE) {
    it(`none of them inks with text-df-${token}`, () => {
      const offenders = componentsTakingClassName
        .filter((f) => new RegExp(`\\btext-df-${token}(?:/\\d+)?(?=["'\\s])`).test(code(readFileSync(f, "utf8"))))
        .map((f) => f.slice(SRC.length));
      expect(
        offenders,
        `these components let the CALLER set their background, so they cannot ` +
          `know that text-df-${token} will contrast with it. If the caller passes ` +
          `bg-df-${token}, the ink is painted onto itself and disappears — which ` +
          `is exactly how BrandAvatar rendered a blank circle. Use ` +
          `text-df-on-chrome, which is defined to contrast with brand chrome.`,
      ).toEqual([]);
    });
  }
});
