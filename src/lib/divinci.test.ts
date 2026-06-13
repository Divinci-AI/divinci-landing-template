import { describe, it, expect } from "vitest";
import {
  API_BASE,
  WHITELABEL_ID,
  RELEASE_ID,
  FREE_MESSAGE_QUOTA,
  SIGNUP_URL,
  FALLBACK_RELEASE,
} from "./divinci";

describe("divinci constants", () => {
  it("staging API + DFO whitelabel + release IDs are set", () => {
    expect(API_BASE).toBe("https://api.stage.divinci.app");
    expect(WHITELABEL_ID).toMatch(/^[a-f0-9]{24}$/);
    expect(RELEASE_ID).toMatch(/^[a-f0-9]{24}$/);
  });

  it("free message quota is the v1 lifetime gate (1)", () => {
    expect(FREE_MESSAGE_QUOTA).toBe(1);
  });

  it("signup URL points at drfuhrman.com/membership with UTM ref params", () => {
    const u = new URL(SIGNUP_URL);
    expect(u.hostname).toBe("www.drfuhrman.com");
    expect(u.pathname).toBe("/membership");
    expect(u.searchParams.get("utm_source")).toBe("drfuhrman-ai");
    expect(u.searchParams.get("utm_medium")).toBe("referral");
    expect(u.searchParams.get("utm_campaign")).toBe("free-message-quota-cta");
  });
});

describe("FALLBACK_RELEASE", () => {
  it("has a non-empty welcome message", () => {
    expect(FALLBACK_RELEASE.welcomeMessage).toBeTruthy();
    expect(FALLBACK_RELEASE.welcomeMessage!.length).toBeGreaterThan(20);
  });

  it("has exactly 3 conversation starters", () => {
    expect(FALLBACK_RELEASE.starters).toHaveLength(3);
    for (const s of FALLBACK_RELEASE.starters) {
      expect(s.length).toBeGreaterThan(20);
    }
  });
});
