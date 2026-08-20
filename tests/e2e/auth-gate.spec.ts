import { test, expect, request as playwrightRequest } from "@playwright/test";

/**
 * Auth gate runs on the deployed worker. Each test creates a fresh
 * request context (without httpCredentials) so the config-level Basic
 * Auth header from the rest of the suite doesn't leak in.
 */
/**
 * Needs a REAL deployment. Until 2026-08-20 this fell back to the template's
 * own placeholder host, so with no deployment configured the suite did not
 * skip — it spent its timeout resolving `REPLACE-landing.example.workers.dev`
 * and failed with ENOTFOUND. 30 of 44 specs failed that way, which made the
 * whole suite look broken and is a large part of why it ran nowhere.
 *
 * A guard that cannot be run without production credentials still has to be
 * runnable *without* them — as a skip, not as a failure.
 */
const DEPLOYED = process.env.E2E_DEPLOYED_URL ?? "";
test.skip(
  !process.env.E2E_DEPLOYED_URL,
  "set E2E_DEPLOYED_URL (and E2E_BASIC_AUTH_USER/PASS) to run against a deployment",
);

const CREDS = {
  username: process.env.E2E_BASIC_AUTH_USER ?? "preview",
  password: process.env.E2E_BASIC_AUTH_PASS ?? "",
};

test.describe("HTTP Basic Auth gate (deployed worker)", () => {
  test("returns 401 with no credentials", async () => {
    const ctx = await playwrightRequest.newContext({
      httpCredentials: undefined,
    });
    const resp = await ctx.get(DEPLOYED, { failOnStatusCode: false });
    expect(resp.status()).toBe(401);
    expect(resp.headers()["www-authenticate"] ?? "").toContain("Basic");
    await ctx.dispose();
  });

  test("returns 401 with wrong password", async () => {
    const ctx = await playwrightRequest.newContext({
      httpCredentials: undefined,
    });
    const resp = await ctx.get(DEPLOYED, {
      failOnStatusCode: false,
      headers: {
        Authorization:
          "Basic " + Buffer.from("preview:wrong-pw").toString("base64"),
      },
    });
    expect(resp.status()).toBe(401);
    await ctx.dispose();
  });

  test("returns 200 with valid credentials", async () => {
    const ctx = await playwrightRequest.newContext({
      httpCredentials: undefined,
    });
    const resp = await ctx.get(DEPLOYED, {
      failOnStatusCode: false,
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${CREDS.username}:${CREDS.password}`).toString("base64"),
      },
    });
    expect(resp.status()).toBe(200);
    expect(resp.headers()["content-type"] ?? "").toContain("text/html");
    await ctx.dispose();
  });
});
