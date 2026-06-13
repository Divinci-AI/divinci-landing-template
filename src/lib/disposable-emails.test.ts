import { describe, it, expect } from "vitest";
import { isDisposableEmail, DISPOSABLE_DOMAINS } from "./disposable-emails";

describe("isDisposableEmail", () => {
  it("blocks the canonical offenders", () => {
    expect(isDisposableEmail("alice@mailinator.com")).toBe(true);
    expect(isDisposableEmail("bob@guerrillamail.com")).toBe(true);
    expect(isDisposableEmail("c@yopmail.com")).toBe(true);
    expect(isDisposableEmail("d@10minutemail.com")).toBe(true);
  });

  it("allows real consumer providers", () => {
    expect(isDisposableEmail("user@gmail.com")).toBe(false);
    expect(isDisposableEmail("user@protonmail.com")).toBe(false);
    expect(isDisposableEmail("user@outlook.com")).toBe(false);
    expect(isDisposableEmail("ceo@divinci.ai")).toBe(false);
    expect(isDisposableEmail("hi@drfuhrman.com")).toBe(false);
  });

  it("is case-insensitive on the domain", () => {
    expect(isDisposableEmail("alice@MAILINATOR.COM")).toBe(true);
    expect(isDisposableEmail("alice@MailiNator.coM")).toBe(true);
  });

  it("returns false for malformed inputs", () => {
    expect(isDisposableEmail("no-at-sign")).toBe(false);
    expect(isDisposableEmail("@no-local")).toBe(false);
    expect(isDisposableEmail("")).toBe(false);
  });

  it("only matches the domain, not arbitrary substrings", () => {
    // mailinator IS a domain in the list, but "mailinator-clone.com" isn't.
    expect(isDisposableEmail("x@mailinator-clone.com")).toBe(false);
  });

  it("blocklist has a reasonable size", () => {
    expect(DISPOSABLE_DOMAINS.size).toBeGreaterThan(100);
  });
});
