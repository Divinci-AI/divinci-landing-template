import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

/**
 * Regression guards for 2026-08-17.
 *
 * A colleague opened the Acme Realty demo for the FIRST time, sent one question,
 * got an answer, sent a second, and saw "Network error — that message wasn't
 * delivered." They reasonably read it as the anonymous-message limit. It was
 * not: the API had returned 500 from an exhausted Mongo connection pool.
 *
 * Both readings were unavailable to them, because three unrelated upstream
 * conditions — the anonymous cap (400), rate limiting (429), and a real server
 * fault (5xx) — all arrived as one flat `502 upstream_error` and rendered as
 * one string that blamed their network. The cap is the one with a real next
 * step (sign in at Divinci), and it was the one made indistinguishable.
 *
 * These are source-level guards, so they survive a refactor of the island's
 * internals but fail if the classification is dropped.
 */

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

/**
 * Source with comments stripped.
 *
 * ⚠️ Required for any "must NOT contain X" assertion: a good fix names the
 * anti-pattern it removed, so a naive scan matches the fix's own explanation.
 * Positive assertions may use the raw source; negative ones may not.
 */
const codeOf = (p: string) =>
  read(p).replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");

describe("the worker classifies upstream refusals", () => {
  const code = codeOf("worker.ts");

  it("recognises the anonymous cap and gives it its own status", () => {
    expect(code).toMatch(/max number of messages reached/i);
    expect(code).toMatch(/anon_limit_reached/);
  });

  it("matches the cap on the whole body, not one JSON field", () => {
    // The API's BAD_FORM carries the phrase in `context`; its `message` is the
    // generic "bad form data". Reading a single field would silently stop
    // matching if that ever moved.
    expect(code).toMatch(/test\(upstreamText\)/);
  });

  it("passes rate limiting through as 429, not as a server error", () => {
    expect(code).toMatch(/upstream\.status === 429/);
    expect(code).toMatch(/rate_limited/);
  });

  it("still rolls the free-message claim back on every refusal", () => {
    // A visitor who got no answer must not have spent their free message.
    // One releaseClaim per classified branch, plus the pre-existing ones.
    const releases = code.match(/if \(freshClaim\) await stub\.releaseClaim\(hash\)/g) ?? [];
    expect(releases.length).toBeGreaterThanOrEqual(4);
  });
});

describe("the chat island tells the visitor which thing happened", () => {
  const src = read("components/chat/ChatIsland.tsx");
  const code = codeOf("components/chat/ChatIsland.tsx");

  it("routes the cap to the sign-in CTA rather than an error toast", () => {
    expect(code).toMatch(/resp\.status === 409/);
    expect(code).toMatch(/anon_limit_reached/);
    expect(code).toMatch(/setAnonLimit\(true\)/);
    expect(code).toMatch(/<AnonLimitCTA/);
  });

  it("words a 5xx as our fault, not the visitor's connection", () => {
    expect(code).toMatch(/resp\.status >= 500/);
    expect(code).toMatch(/errorServer/);
  });

  it("has a distinct message for rate limiting", () => {
    expect(code).toMatch(/resp\.status === 429/);
    expect(code).toMatch(/errorBusy/);
  });

  it("keeps the visitor's text so a retry is not a retype", () => {
    // Every rolled-back branch restores the draft. Three new ones (409/429/5xx)
    // plus the pre-existing email-gate one.
    expect((src.match(/setDraft\(content\)/g) ?? []).length).toBeGreaterThanOrEqual(4);
  });

  it("takes its system strings from outside the customer copy dictionary", () => {
    // See the guard below for why. Reading these off `t` (getUI) is what broke.
    expect(code).toMatch(/CHAT_SYSTEM_STRINGS/);
    for (const key of ["errorServer", "errorBusy"]) {
      expect(code, `${key} must come from CHAT_SYSTEM_STRINGS`).toMatch(
        new RegExp(`SYS\\.${key}`),
      );
    }
  });
});

/**
 * The fleet-wide trap, caught by the pipeline on 2026-08-17 before it shipped.
 *
 * The demo pipeline generates a BRANDED `en.ts` per run and shape-checks it
 * against this neutral template with exact key-set parity. So a key added here
 * is missing from every previously generated run, and the pipeline's response
 * is to reject the branded copy WHOLESALE — every demo would then rebuild with
 * neutral "Acme Expert" text in its title, og: tags, chat welcome and CTA.
 *
 * An error string is not customer copy. It does not belong in that file.
 */
describe("chat system strings stay OUT of the per-customer copy dictionary", () => {
  const en = read("i18n/ui/en.ts");

  it("en.ts carries none of them", () => {
    for (const key of [
      "errorServer",
      "errorBusy",
      "anonLimitHeadline",
      "anonLimitBody",
      "anonLimitButton",
    ]) {
      expect(en, `${key} is in en.ts — it will de-brand every demo on rebuild`)
        .not.toMatch(new RegExp(`\\b${key}\\b`));
    }
  });

  it("UIStrings stays a plain derived type", () => {
    // An earlier attempt kept the keys in en.ts and made them optional on
    // UIStrings. That fixed the ~30 generated LOCALE files and did nothing for
    // the generated en.ts shape check — the failure that actually mattered.
    expect(en).toMatch(/export type UIStrings = typeof en;/);
  });
});

describe("the anonymous-cap CTA points at Divinci, not the customer", () => {
  it("links to chat.divinci.app", () => {
    expect(read("lib/divinci.ts")).toMatch(/https:\/\/chat\.divinci\.app/);
    expect(codeOf("components/chat/AnonLimitCTA.tsx")).toMatch(/DIVINCI_CHAT_URL/);
  });

  it("does NOT carry the customer's utm_source", () => {
    // withRef() tags with brand.referral.source. Applying it here would
    // attribute a DIVINCI signup to the prospect whose demo it happened on.
    const code = codeOf("lib/divinci.ts");
    expect(code).not.toMatch(/DIVINCI_CHAT_URL\s*=\s*withRef/);
  });

  it("is a link, not an automatic redirect", () => {
    // Navigating a prospect's evaluator off the demo without asking reads as a
    // hijack, and throws away the transcript they were reading.
    const code = codeOf("components/chat/AnonLimitCTA.tsx");
    expect(code).not.toMatch(/location\.(href|assign|replace)/);
    expect(code).toMatch(/href=\{DIVINCI_CHAT_URL\}/);
  });
});
