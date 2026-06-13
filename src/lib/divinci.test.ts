import { describe, it, expect } from "vitest";
import {
  API_BASE,
  WHITELABEL_ID,
  RELEASE_ID,
  FREE_MESSAGE_QUOTA,
  SIGNUP_URL,
  FALLBACK_RELEASE,
} from "./divinci";
import { brand } from "../brand.config";

describe("divinci constants", () => {
  it("Divinci constants are wired from brand.config", () => {
    expect(API_BASE).toBe(brand.divinci.apiBase);
    expect(WHITELABEL_ID).toBe(brand.divinci.whitelabelId);
    expect(RELEASE_ID).toBe(brand.divinci.releaseId);
  });

  it("free message quota is the v1 lifetime gate (1)", () => {
    expect(FREE_MESSAGE_QUOTA).toBe(1);
  });

  it("signup URL derives from brand.config with UTM ref params", () => {
    const u = new URL(SIGNUP_URL);
    const configured = new URL(brand.links.signupUrl);
    expect(u.hostname).toBe(configured.hostname);
    expect(u.pathname).toBe(configured.pathname);
    expect(u.searchParams.get("utm_source")).toBe(brand.referral.source);
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
