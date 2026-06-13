/**
 * Tests for the P7 cutover worker (worker-v2.ts). Covers the four
 * decision branches:
 *   - Basic-Auth gate still works (preserved from v42a)
 *   - /api/chat-start proxies with the upstream body shape
 *   - /api/chat-send forwards the body verbatim
 *   - /api/verify-email builds a 302 to the platform with redirectTo
 *
 * No DO / Redis / Resend / Turnstile mocks needed — those all live on
 * the platform now. We just stub global fetch.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import workerModule from "./worker-v2";

interface MockEnv {
  ASSETS: { fetch: ReturnType<typeof vi.fn> };
  BASIC_AUTH_PASSWORD?: string;
  BASIC_AUTH_USERNAME?: string;
  DIVINCI_API_BASE: string;
  DIVINCI_RELEASE_ID: string;
}

function makeEnv(overrides: Partial<MockEnv> = {}): MockEnv {
  return {
    ASSETS: {
      fetch: vi.fn(async () =>
        new Response("ASSETS_BODY", {
          status: 200,
          headers: { "Content-Type": "text/html" },
        }),
      ),
    },
    BASIC_AUTH_PASSWORD: "secret-pw",
    BASIC_AUTH_USERNAME: "dfo",
    DIVINCI_API_BASE: "https://api.stage.divinci.app",
    DIVINCI_RELEASE_ID: "6a118e81e44ce78e97327aa8",
    ...overrides,
  };
}

function auth() {
  return "Basic " + btoa("dfo:secret-pw");
}

describe("worker-v2 — basic auth gate", () => {
  it("401s without credentials", async () => {
    const env = makeEnv();
    const r = await workerModule.fetch(
      new Request("https://x.workers.dev/"),
      // @ts-expect-error - partial env
      env,
    );
    expect(r.status).toBe(401);
  });

  it("passes through to ASSETS on a static path with valid creds", async () => {
    const env = makeEnv();
    const r = await workerModule.fetch(
      new Request("https://x.workers.dev/", {
        headers: { Authorization: auth() },
      }),
      // @ts-expect-error
      env,
    );
    expect(r.status).toBe(200);
    expect(env.ASSETS.fetch).toHaveBeenCalledOnce();
  });

  it("failsafe: BASIC_AUTH_PASSWORD unset → no gate", async () => {
    const env = makeEnv({ BASIC_AUTH_PASSWORD: undefined });
    const r = await workerModule.fetch(
      new Request("https://x.workers.dev/"),
      // @ts-expect-error
      env,
    );
    expect(r.status).toBe(200);
  });
});

describe("worker-v2 — /api/chat-start proxy", () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("posts to upstream /free-chat-gate/start with the expected body", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            status: "sent",
            mode: "captcha+magic-link",
            nextStep: "link",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );
    const env = makeEnv();
    const r = await workerModule.fetch(
      new Request("https://x.workers.dev/api/chat-start", {
        method: "POST",
        headers: {
          Authorization: auth(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "u@example.com",
          turnstileToken: "ts-1",
        }),
      }),
      // @ts-expect-error
      env,
    );
    expect(r.status).toBe(200);
    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toBe(
      "https://api.stage.divinci.app/ai-chat/free-chat-gate/start",
    );
    expect((init as RequestInit).method).toBe("POST");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toMatchObject({
      releaseId: "6a118e81e44ce78e97327aa8",
      email: "u@example.com",
      turnstileToken: "ts-1",
      redirectTo: "https://x.workers.dev/verified",
    });
  });

  it("400s on invalid JSON body", async () => {
    const env = makeEnv();
    const r = await workerModule.fetch(
      new Request("https://x.workers.dev/api/chat-start", {
        method: "POST",
        headers: {
          Authorization: auth(),
          "Content-Type": "application/json",
        },
        body: "not json",
      }),
      // @ts-expect-error
      env,
    );
    expect(r.status).toBe(400);
  });

  it("returns 502 when the upstream throws", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));
    const env = makeEnv();
    const r = await workerModule.fetch(
      new Request("https://x.workers.dev/api/chat-start", {
        method: "POST",
        headers: {
          Authorization: auth(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "u@example.com", turnstileToken: "ts" }),
      }),
      // @ts-expect-error
      env,
    );
    expect(r.status).toBe(502);
  });
});

describe("worker-v2 — /api/chat-send proxy", () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("forwards the body verbatim to upstream /chat-send", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            transcript: [{ prompt: "p", response: "r" }],
            signiture: "sig-1",
            remaining: 4,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );
    const env = makeEnv();
    const r = await workerModule.fetch(
      new Request("https://x.workers.dev/api/chat-send", {
        method: "POST",
        headers: {
          Authorization: auth(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: "tok-1",
          prevSigniture: "prev",
          newPrompt: "hi",
          transcript: [],
        }),
      }),
      // @ts-expect-error
      env,
    );
    expect(r.status).toBe(200);
    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toBe(
      "https://api.stage.divinci.app/ai-chat/free-chat-gate/chat-send",
    );
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toEqual({
      token: "tok-1",
      prevSigniture: "prev",
      newPrompt: "hi",
      transcript: [],
    });
  });

  it("propagates the upstream status (e.g. 429 quota_exhausted) verbatim", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response('{"error":"quota_exhausted"}', { status: 429 }),
    );
    const env = makeEnv();
    const r = await workerModule.fetch(
      new Request("https://x.workers.dev/api/chat-send", {
        method: "POST",
        headers: {
          Authorization: auth(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: "t",
          prevSigniture: "",
          newPrompt: "x",
          transcript: [],
        }),
      }),
      // @ts-expect-error
      env,
    );
    expect(r.status).toBe(429);
  });
});

describe("worker-v2 — /api/verify-email magic-link landing", () => {
  it("302s to the platform /verify with token + redirectTo", async () => {
    const env = makeEnv();
    const r = await workerModule.fetch(
      new Request(
        "https://x.workers.dev/api/verify-email?token=rel-a.aa.exp.sig",
        { headers: { Authorization: auth() } },
      ),
      // @ts-expect-error
      env,
    );
    expect(r.status).toBe(302);
    const location = r.headers.get("Location");
    expect(location).toContain(
      "https://api.stage.divinci.app/ai-chat/free-chat-gate/verify",
    );
    expect(location).toContain("token=rel-a.aa.exp.sig");
    expect(location).toContain(
      "redirectTo=https%3A%2F%2Fx.workers.dev%2Fverified",
    );
  });

  it("400s when token is missing", async () => {
    const env = makeEnv();
    const r = await workerModule.fetch(
      new Request("https://x.workers.dev/api/verify-email", {
        headers: { Authorization: auth() },
      }),
      // @ts-expect-error
      env,
    );
    expect(r.status).toBe(400);
  });
});
