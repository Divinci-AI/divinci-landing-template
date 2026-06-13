import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
// Astro bundles this config with esbuild before eval, so importing the TS
// brand config works here (the source of truth for the canonical site URL).
import { brand } from "./src/brand.config.ts";

// 36 advertised languages — kept in sync with src/i18n/locales.ts.
// (Plain array here because astro.config can't import the TS module's
// types cleanly at config-eval time; the source of truth is locales.ts
// and a unit guard asserts these two lists match.)
const LOCALES = [
  "en", "es", "fr", "de", "it", "pt", "nl", "pl", "ru", "uk", "cs", "ro",
  "el", "tr", "ar", "he", "hi", "bn", "ta", "te", "mr", "gu", "pa", "ur",
  "fa", "th", "vi", "id", "ms", "fil", "ja", "ko", "zh-hans", "zh-hant",
  "sw", "zu",
];

export default defineConfig({
  site: brand.identity.domain,
  integrations: [react()],
  i18n: {
    defaultLocale: "en",
    locales: LOCALES,
    routing: {
      // English stays at "/"; other locales get a "/es/", "/zh-hans/" prefix.
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      // `astro dev` (port 4321) serves pages + React islands but NEVER runs the
      // Cloudflare Worker (src/worker.ts), so the /api/* routes — welcome,
      // chat-send, chat-feedback — 404 under it. Proxy them to a local
      // `wrangler dev` (port 8787) which runs the actual worker with the
      // .dev.vars secrets. Dev flow: `pnpm dev:worker` in one terminal +
      // `pnpm dev` in another, then develop on :4321 with hot-reload AND a
      // working chat. (Plain `pnpm dev:worker` alone on :8787 also works, just
      // without UI hot-reload.)
      proxy: {
        "/api": "http://localhost:8787",
      },
    },
  },
});
