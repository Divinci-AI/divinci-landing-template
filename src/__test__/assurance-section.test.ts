import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ASSURANCE_STRINGS } from "../i18n/assurance-strings";
import { en as enUI } from "../i18n/ui/en";

const SECTION = readFileSync(
  join(process.cwd(), "src/components/sections/AssuranceSection.astro"),
  "utf8",
);

describe("assurance copy must not touch the customer copy surface", () => {
  /**
   * The failure this guards: the demo pipeline shape-checks each run's
   * generated branded `en.ts` against this template with EXACT key parity, so
   * a key added to `ui/en.ts` is missing from every previously generated run
   * and the pipeline rejects the branded copy wholesale — every demo in the
   * fleet then ships with neutral "Acme Expert" text. Adding `errorServer`
   * there did exactly that on 2026-08-17.
   */
  it("keeps every assurance string out of ui/en.ts", () => {
    const uiKeys = Object.keys(enUI as Record<string, unknown>);
    for (const key of Object.keys(ASSURANCE_STRINGS)) {
      expect(uiKeys, `"${key}" must live in assurance-strings, not ui/en.ts`).not.toContain(key);
    }
  });

  it("the section reads its copy from assurance-strings", () => {
    expect(SECTION).toContain('from "~/i18n/assurance-strings"');
  });
});

describe("an unscored demo must claim nothing", () => {
  /**
   * As of 2026-09-11 the fleet is QA-scored but NOT red-teamed: 0 of 165 demo
   * releases appear in any red-team sweep. A section that rendered a red-team
   * claim regardless of data would be asserting an untested control on the one
   * page whose purpose is to show we do not do that.
   */
  it("renders nothing at all without qa or redTeam data", () => {
    expect(SECTION).toMatch(/\{\(qa \|\| rt\) &&/);
  });

  it("gates the red-team block separately from the QA block", () => {
    expect(SECTION).toMatch(/\{rt && \(/);
    expect(SECTION).toMatch(/\{qa && \(/);
  });

  it("never hardcodes a score, a pass count or a percentage", () => {
    const body = SECTION.slice(SECTION.indexOf("---", 3));
    const markup = body.slice(0, body.indexOf("<style>"));
    expect(markup).not.toMatch(/\d{1,3}%/);
    expect(markup).not.toMatch(/\b\d+\s*\/\s*\d+\b/);
  });
});

describe("the composite score is never shown alone", () => {
  /**
   * wolf-greenfield measured an 81% composite over 70.5% correctness, because
   * near-perfect relevance carried it. Publishing the composite by itself
   * flatters; correctness sits beside it.
   */
  it("renders correctness alongside the composite when supplied", () => {
    expect(SECTION).toContain("qa.correctnessPct");
    expect(ASSURANCE_STRINGS.qaCorrectnessLabel).toMatch(/correctness/i);
  });

  it("describes what the adversarial questions try to do", () => {
    expect(ASSURANCE_STRINGS.qaMethod).toMatch(/fail|adversarial/i);
  });
});

describe("protections describe controls that actually exist", () => {
  it("lists several, each with a title and a body", () => {
    expect(ASSURANCE_STRINGS.protections.length).toBeGreaterThanOrEqual(4);
    for (const p of ASSURANCE_STRINGS.protections) {
      expect(p.title.length).toBeGreaterThan(3);
      expect(p.body.length).toBeGreaterThan(20);
    }
  });

  it("does not claim red teaming among the always-on protections", () => {
    const blob = ASSURANCE_STRINGS.protections.map((p) => `${p.title} ${p.body}`).join(" ");
    expect(blob).not.toMatch(/red.?team/i);
  });
});
