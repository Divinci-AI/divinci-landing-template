/**
 * Cloudflare entry point.
 *
 * `wrangler.toml` points at THIS file rather than at `worker.ts`, for one
 * reason: the Durable Object class has to be exported from the worker's entry
 * module so wrangler can find it by `class_name` — and importing it drags
 * `cloudflare:workers` into the module graph.
 *
 * That specifier does not resolve anywhere else. Vercel's Edge Runtime cannot
 * load it, so a `worker.ts` that imported it could not be reused by
 * `middleware.ts`, and the whole point of that file is that both hosts run the
 * SAME handlers rather than two implementations that drift.
 *
 * So the split is: `worker.ts` holds the handlers and is portable;
 * `worker.cf.ts` adds the one Cloudflare-only export on top.
 *
 * ⚠️ `src/__test__/portable-worker.test.ts` fails if `cloudflare:workers` finds
 * its way back into `worker.ts`'s graph. It has to, because the test suite
 * ALIASES that specifier to a stub — so the tests would keep passing while the
 * Vercel build broke, which is exactly how this shipped in review.
 */
export { EmailQuotaCoordinator } from "./quota-coordinator";
export { default } from "./worker";
export type { Env } from "./worker";
