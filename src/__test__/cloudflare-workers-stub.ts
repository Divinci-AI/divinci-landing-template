/**
 * Node-side stub for the `cloudflare:workers` virtual module so that
 * `src/quota-coordinator.ts` (which extends `DurableObject`) can be
 * imported through `src/worker.ts` in plain vitest (node environment)
 * for the helper-level tests.
 *
 * Real DO runtime behavior is verified by the Playwright canary in
 * `tests/e2e/red-team-api.spec.ts` against the deployed worker.
 */

export class DurableObject {
  ctx: unknown;
  env: unknown;
  constructor(ctx: unknown, env: unknown) {
    this.ctx = ctx;
    this.env = env;
  }
}
