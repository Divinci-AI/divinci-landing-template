import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { clientIp } from "../worker";

/**
 * `worker.ts` must stay loadable on a runtime that is not Cloudflare.
 *
 * ── Why this test exists ────────────────────────────────────────────────────
 *
 * `middleware.ts` reuses the worker's handlers verbatim so the two hosts cannot
 * drift. That only works while nothing in `worker.ts`'s import graph reaches a
 * Cloudflare-only module specifier — `cloudflare:workers` resolves nowhere
 * else, and Vercel's Edge Runtime fails to build.
 *
 * ⚠️ AND THE TEST SUITE CANNOT NOTICE ON ITS OWN. `vitest.config.ts` ALIASES
 * `cloudflare:workers` to a stub, so every test would keep passing while the
 * Vercel build broke. That is not hypothetical: it is how the first version of
 * the middleware shipped into review — 287 green tests, and an entry point that
 * could not have started.
 *
 * So this walks the real import graph over source text, deliberately ignoring
 * the resolver the rest of the suite uses.
 */

const SRC = resolve(__dirname, "..");

/** Specifiers that exist only inside the Workers runtime. */
const CLOUDFLARE_ONLY = [/^cloudflare:/, /^__STATIC_CONTENT/];

/** Resolve a specifier to a real file, returning the PATH as well as the body —
 *  the path is the graph key, and keying it extensionless made the vacuity
 *  check below fail, which is precisely what that check is for. */
function readModule(file: string): { path: string; body: string } | null {
  for (const p of [file, `${file}.ts`, `${file}.js`, join(file, "index.ts")]) {
    if (!existsSync(p)) continue;
    try { return { path: p, body: readFileSync(p, "utf8") }; } catch { /* a directory */ }
  }
  return null;
}

/** Every module reachable from `entry`, following relative imports only. */
function importGraph(entry: string): Map<string, string> {
  const seen = new Map<string, string>();
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift()!;
    const mod = readModule(file);
    if (mod === null || seen.has(mod.path)) continue;
    seen.set(mod.path, mod.body);
    const body = mod.body;
    // `import … from "x"`, `export … from "x"`, and bare `import "x"`.
    for (const m of body.matchAll(/\b(?:import|export)\b[^;]*?["']([^"']+)["']/g)) {
      const spec = m[1];
      if (spec.startsWith(".")) queue.push(resolve(dirname(mod.path), spec));
    }
  }
  return seen;
}

function externalSpecifiers(body: string): string[] {
  const out: string[] = [];
  for (const m of body.matchAll(/\b(?:import|export)\b[^;]*?from\s*["']([^"']+)["']/g)) {
    if (!m[1].startsWith(".")) out.push(m[1]);
  }
  // bare side-effect imports
  for (const m of body.matchAll(/^\s*import\s+["']([^"']+)["']/gm)) {
    if (!m[1].startsWith(".")) out.push(m[1]);
  }
  return out;
}

describe("worker.ts stays portable", () => {
  const graph = importGraph(join(SRC, "worker.ts"));

  it("actually walked the graph (a scan of nothing passes vacuously)", () => {
    expect(graph.size).toBeGreaterThan(4);
    expect([...graph.keys()].some((k) => k.endsWith("upstream-hmac.ts"))).toBe(true);
  });

  it("reaches no Cloudflare-only module specifier", () => {
    const offenders: string[] = [];
    for (const [file, body] of graph) {
      for (const spec of externalSpecifiers(body)) {
        if (CLOUDFLARE_ONLY.some((re) => re.test(spec))) {
          offenders.push(`${file.replace(SRC + "/", "")} → ${spec}`);
        }
      }
    }
    expect(offenders, "these cannot resolve on Vercel's Edge Runtime").toEqual([]);
  });

  it("does not reach the Durable Object class", () => {
    // It is the one thing that drags in `cloudflare:workers`. wrangler gets it
    // from worker.cf.ts instead.
    expect([...graph.keys()].some((k) => k.endsWith("quota-coordinator.ts"))).toBe(false);
  });

  it("reaches no node: builtin either", () => {
    // The Edge Runtime is not Node. This has never been violated, which is
    // exactly when a guard is cheap to add.
    const offenders: string[] = [];
    for (const [file, body] of graph) {
      for (const spec of externalSpecifiers(body)) {
        if (spec.startsWith("node:")) offenders.push(`${file.replace(SRC + "/", "")} → ${spec}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("the Cloudflare entry still exports what wrangler needs", () => {
  const cf = readFileSync(join(SRC, "worker.cf.ts"), "utf8");
  const wrangler = readFileSync(resolve(SRC, "..", "wrangler.toml"), "utf8");

  it("exports the Durable Object class by name", () => {
    // wrangler resolves `class_name` against the entry module's exports; if
    // this export goes, the deploy fails with "class not found".
    expect(cf).toMatch(/export\s*\{\s*EmailQuotaCoordinator\s*\}/);
    expect(wrangler).toMatch(/class_name\s*=\s*"EmailQuotaCoordinator"/);
  });

  it("re-exports the fetch handler, so the worker still serves", () => {
    expect(cf).toMatch(/export\s*\{\s*default\s*\}\s*from\s*"\.\/worker"/);
  });

  it("is what wrangler.toml points at", () => {
    expect(wrangler).toMatch(/main\s*=\s*"\.\/src\/worker\.cf\.ts"/);
  });
});

describe("clientIp trusts only what the platform stamps", () => {
  // This value is the QUOTA KEY whenever no email is collected — NO_EMAIL_GATE
  // and the anonymous grace window both key on it. A visitor who can choose it
  // gets unlimited free messages by rotating a header.
  const ip = (h: Record<string, string>) =>
    clientIp(new Request("https://x.test", { headers: h }));

  it("uses the Cloudflare header", () => {
    expect(ip({ "CF-Connecting-IP": "203.0.113.1" })).toBe("203.0.113.1");
  });

  it("uses the Vercel header", () => {
    expect(ip({ "X-Vercel-Forwarded-For": "203.0.113.2" })).toBe("203.0.113.2");
  });

  it("IGNORES X-Forwarded-For — a client can send it", () => {
    expect(ip({ "X-Forwarded-For": "1.2.3.4" })).toBe("unknown");
  });

  it("IGNORES X-Real-IP — a client can send that too", () => {
    expect(ip({ "X-Real-IP": "1.2.3.4" })).toBe("unknown");
  });

  it("a spoofed header cannot displace the platform's", () => {
    expect(ip({ "CF-Connecting-IP": "203.0.113.1", "X-Real-IP": "1.2.3.4", "X-Forwarded-For": "5.6.7.8" }))
      .toBe("203.0.113.1");
  });

  it("collapses to one identity when no platform header is present", () => {
    // The SAFE direction: everyone shares one budget, so an unrecognised
    // deployment refuses rather than over-serves.
    expect(ip({})).toBe("unknown");
  });

  it("takes the first hop of a multi-value platform header", () => {
    expect(ip({ "X-Vercel-Forwarded-For": "203.0.113.2, 10.0.0.1" })).toBe("203.0.113.2");
  });
});
