import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Vitest config. Worker limits per CLAUDE.md (parent monorepo
 * convention) — maxThreads capped at 2, 512MB per worker. Tests live
 * alongside the source under src/.
 */
export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      "cloudflare:workers": fileURLToPath(
        new URL("./src/__test__/cloudflare-workers-stub.ts", import.meta.url),
      ),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules", "dist", ".astro", "tests/e2e/**"],
    environment: "node",
    globals: false,
    isolate: true,
    // Vitest 4: previously-nested poolOptions are now top-level. Caps
    // worker concurrency the same way the parent monorepo does in
    // CLAUDE.md.
    pool: "threads",
    maxWorkers: 2,
    minWorkers: 1,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/**", "src/worker.ts"],
      exclude: ["**/*.test.ts"],
    },
  },
});
