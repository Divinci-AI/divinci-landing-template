import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * npm 12 refuses a project-scoped `npm install` when `allow-scripts` is
 * configured OUTSIDE the project — a user-level ~/.npmrc is enough:
 *
 *   npm error code EALLOWSCRIPTS
 *   npm error --allow-scripts is not allowed in project-scoped installs.
 *   npm error Add the entries to the "allowScripts" field in package.json,
 *   npm error or to .npmrc, instead.
 *
 * This template is cloned and installed by the demo pipeline on an operator's
 * machine, so it inherits whatever that machine's npm config happens to say.
 * On 2026-08-06 that took down the evonexus landing deploy three nights
 * running and quarantined the run.
 *
 * Declaring the field in package.json is what npm asks for, and the EMPTY
 * array is the right value: it settles the question for this project without
 * granting a single postinstall. Nothing here needs one — esbuild, workerd
 * and @resvg/resvg-js all ship prebuilt platform binaries as optional
 * dependencies, and a full `npm run build` (og.png included) succeeds with
 * every install script withheld.
 *
 * If you ever add a dependency that genuinely needs its postinstall, add that
 * one package by name. Do not delete the field.
 */
const pkg = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "..", "package.json"), "utf8"),
) as { allowScripts?: unknown };

describe("install-script policy", () => {
  it("declares allowScripts, so a project-scoped npm install cannot EALLOWSCRIPTS", () => {
    expect(Array.isArray(pkg.allowScripts)).toBe(true);
  });

  it("grants nothing by default", () => {
    expect(pkg.allowScripts).toEqual([]);
  });
});
