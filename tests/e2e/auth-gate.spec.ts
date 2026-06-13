import { test, expect, request as playwrightRequest } from "@playwright/test";

/**
 * Auth gate runs on the deployed worker. Each test creates a fresh
 * request context (without httpCredentials) so the config-level Basic
 * Auth header from the rest of the suite doesn't leak in.
 */
const DEPLOYED =
  process.env.E2E_DEPLOYED_URL ??
  "https://drfuhrman-ai-landing.divinci-ai.workers.dev";

const CREDS = {
  username: process.env.E2E_BASIC_AUTH_USER ?? "dfo",
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
          "Basic " + Buffer.from("dfo:wrong-pw").toString("base64"),
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
