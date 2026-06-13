/**
 * Pre-warm the conversation-starter response cache.
 *
 * The platform's anonymous-chat response cache (release.publicResponseCache)
 * + the exact-match fast path only help AFTER a prompt has been asked once.
 * The first visitor per TTL window otherwise pays the full ~7–11s generation.
 * This script asks each fixed starter once (a signed request, exactly like the
 * landing-page worker) so the FIRST real visitor hits the cache instead.
 *
 * It signs with the landing-page HMAC key (so it passes verify-landing-page-hmac)
 * and goes through the normal anonymous-chat path — whose store-on-miss populates
 * both the semantic cache and the exact-match fast path. Run it after each deploy
 * and/or on a cron at an interval ≤ release.publicResponseCache.ttlSeconds.
 *
 * Usage:
 *   LANDING_PAGE_HMAC_KEY=... node scripts/prewarm-starters.mjs           # English starters
 *   LANDING_PAGE_HMAC_KEY=... node --experimental-strip-types \
 *       scripts/prewarm-starters.mjs --all                                 # all locales
 *   ... --langs=en,es,fr        # specific locales (needs --experimental-strip-types)
 *   ... --verify                # re-ask each starter to confirm a cache hit (timing)
 *
 * Env:
 *   LANDING_PAGE_HMAC_KEY  (required)  — the shared HMAC key (Infisical / wrangler secret)
 *   PREWARM_API_BASE       (default https://api.stage.divinci.app)
 *   PREWARM_RELEASE_ID     (default 6a118e81e44ce78e97327aa8 — DrFuhrman.ai)
 *   PREWARM_ORIGIN         (default https://drfuhrman.ai)
 */
import { createHmac } from "node:crypto";

const HMAC_KEY = process.env.LANDING_PAGE_HMAC_KEY;
const API_BASE = process.env.PREWARM_API_BASE || "https://api.stage.divinci.app";
const RELEASE_ID = process.env.PREWARM_RELEASE_ID || "6a118e81e44ce78e97327aa8";
const ORIGIN = process.env.PREWARM_ORIGIN || "https://drfuhrman.ai";

if (!HMAC_KEY) {
  console.error("✗ LANDING_PAGE_HMAC_KEY is required (the landing-page HMAC signing key).");
  process.exit(1);
}

const args = process.argv.slice(2);
const wantAll = args.includes("--all");
const wantVerify = args.includes("--verify");
const langsArg = args.find((a) => a.startsWith("--langs="));

// Canonical English starters (source of truth: src/i18n/ui/en.ts → chat.starters).
// Used as-is for the default English warm AND as the fallback when the localized
// i18n can't be imported (e.g. running without --experimental-strip-types).
const EN_STARTERS = [
  "Hi, Dr. Fuhrman AI. Can you tell me steps I can take about starting a healthier lifestyle?",
  "Hi Dr. Fuhrman AI, can you tell me what Nutritarian is all about?",
  "Hi Dr. Fuhrman AI. Can you tell me about insulin sensitivity?",
];

/** Build the warm jobs: [{ code, languageName|null, prompt }]. */
async function buildJobs() {
  const englishOnly = !wantAll && !langsArg;
  if (englishOnly) {
    return EN_STARTERS.map((prompt) => ({ code: "en", languageName: null, prompt }));
  }
  // Localized warm needs the TS i18n — only importable under type-stripping.
  try {
    const { getUI } = await import("../src/i18n/index.ts");
    const { LOCALES, getLocaleMeta, DEFAULT_LOCALE } = await import("../src/i18n/locales.ts");
    let codes = wantAll
      ? LOCALES.map((l) => l.code)
      : langsArg.slice("--langs=".length).split(",").map((s) => s.trim()).filter(Boolean);
    const jobs = [];
    for (const code of codes) {
      const starters = getUI(code)?.chat?.starters ?? [];
      const languageName = code === DEFAULT_LOCALE ? null : getLocaleMeta(code).englishName;
      for (const prompt of starters) jobs.push({ code, languageName, prompt });
    }
    return jobs;
  } catch (e) {
    console.warn(
      `⚠ Could not import localized starters (${e instanceof Error ? e.message : e}).\n` +
        "  Re-run with: node --experimental-strip-types scripts/prewarm-starters.mjs --all\n" +
        "  Falling back to English starters only.",
    );
    return EN_STARTERS.map((prompt) => ({ code: "en", languageName: null, prompt }));
  }
}

async function ask(prompt, languageName) {
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = createHmac("sha256", HMAC_KEY).update(`${ts}.${RELEASE_ID}.${prompt}`).digest("hex");
  const body = { releaseId: RELEASE_ID, prevSigniture: "", newPrompt: prompt, transcript: [] };
  if (languageName) body.language = languageName;
  const t0 = Date.now();
  const res = await fetch(`${API_BASE}/ai-chat/anonymous-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: ORIGIN,
      "X-Landing-Page-Ts": ts,
      "X-Landing-Page-Sig": sig,
    },
    body: JSON.stringify(body),
  });
  const txt = await res.text();
  return { status: res.status, ms: Date.now() - t0, len: txt.length };
}

const jobs = await buildJobs();
console.log(
  `Pre-warming ${jobs.length} starter(s) → ${API_BASE} release=${RELEASE_ID}` +
    (wantVerify ? " (+verify pass)" : ""),
);

let ok = 0;
for (const job of jobs) {
  const r = await ask(job.prompt, job.languageName);
  const mark = r.status === 200 ? "✓" : "✗";
  if (r.status === 200) ok++;
  let line = `${mark} [${job.code}] warm ${r.ms}ms status=${r.status} :: ${job.prompt.slice(0, 56)}`;
  if (wantVerify && r.status === 200) {
    // Small gap, then re-ask: a working cache returns much faster the 2nd time.
    await new Promise((res) => setTimeout(res, 800));
    const r2 = await ask(job.prompt, job.languageName);
    const faster = r2.ms < r.ms * 0.6 ? "✓ HIT" : "… (no clear speedup)";
    line += `  | verify ${r2.ms}ms ${faster}`;
  }
  console.log(line);
}
console.log(`Done: ${ok}/${jobs.length} warmed.`);
if (ok < jobs.length) process.exitCode = 1;
