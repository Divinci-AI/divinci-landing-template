import { describe, it, expect } from "vitest";
import { normalizeEmail } from "./normalize-email";

describe("normalizeEmail", () => {
  describe("base normalization", () => {
    it("trims surrounding whitespace", () => {
      expect(normalizeEmail("  mike@example.io  ")).toBe("mike@example.io");
    });

    it("lowercases the whole string", () => {
      expect(normalizeEmail("Mike@Example.IO")).toBe("mike@example.io");
    });

    it("returns the trimmed string unchanged when there's no @", () => {
      expect(normalizeEmail(" no-at ")).toBe("no-at");
    });

    it("returns empty string for non-string input", () => {
      // @ts-expect-error — testing runtime behavior
      expect(normalizeEmail(null)).toBe("");
      // @ts-expect-error
      expect(normalizeEmail(undefined)).toBe("");
      // @ts-expect-error
      expect(normalizeEmail(12345)).toBe("");
    });
  });

  describe("Gmail family — dots are insignificant", () => {
    it("collapses dots in the local part", () => {
      expect(normalizeEmail("m.ike@gmail.com")).toBe("mike@gmail.com");
      expect(normalizeEmail("m.i.k.e@gmail.com")).toBe("mike@gmail.com");
    });

    it("collapses dots AND uppercase together", () => {
      expect(normalizeEmail("M.I.K.E@GMAIL.COM")).toBe("mike@gmail.com");
    });

    it("does NOT strip dots on non-Gmail domains", () => {
      expect(normalizeEmail("m.ike@outlook.com")).toBe("m.ike@outlook.com");
      expect(normalizeEmail("m.ike@example.io")).toBe("m.ike@example.io");
    });
  });

  describe("Gmail family — +tag aliases collapse", () => {
    it("strips the +tag suffix on gmail.com", () => {
      expect(normalizeEmail("mike+spam@gmail.com")).toBe("mike@gmail.com");
    });

    it("strips multiple +'s (keeps everything before the first)", () => {
      expect(normalizeEmail("mike+a+b+c@gmail.com")).toBe("mike@gmail.com");
    });
  });

  describe("googlemail.com canonicalizes to gmail.com", () => {
    it("rewrites the domain", () => {
      expect(normalizeEmail("mike@googlemail.com")).toBe("mike@gmail.com");
    });

    it("applies the dot+tag rules during the rewrite", () => {
      expect(normalizeEmail("m.i.k.e+test@GOOGLEMAIL.COM")).toBe(
        "mike@gmail.com",
      );
    });
  });

  describe("Outlook family — +tag only (no dot rule)", () => {
    it("strips +tag on outlook.com", () => {
      expect(normalizeEmail("mike+abc@outlook.com")).toBe("mike@outlook.com");
    });

    it("strips +tag on hotmail.com, live.com, msn.com", () => {
      expect(normalizeEmail("mike+x@hotmail.com")).toBe("mike@hotmail.com");
      expect(normalizeEmail("mike+x@live.com")).toBe("mike@live.com");
      expect(normalizeEmail("mike+x@msn.com")).toBe("mike@msn.com");
    });

    it("preserves dots on outlook (dots ARE significant there)", () => {
      expect(normalizeEmail("m.ike@outlook.com")).toBe("m.ike@outlook.com");
    });
  });

  describe("Proton family — +tag only", () => {
    it("strips +tag on proton.me, protonmail.com, pm.me", () => {
      expect(normalizeEmail("mike+abc@proton.me")).toBe("mike@proton.me");
      expect(normalizeEmail("mike+abc@protonmail.com")).toBe(
        "mike@protonmail.com",
      );
      expect(normalizeEmail("mike+abc@pm.me")).toBe("mike@pm.me");
    });
  });

  describe("iCloud / Yahoo / Fastmail families — +tag only", () => {
    it("strips +tag on iCloud aliases", () => {
      expect(normalizeEmail("mike+abc@icloud.com")).toBe("mike@icloud.com");
      expect(normalizeEmail("mike+abc@me.com")).toBe("mike@me.com");
      expect(normalizeEmail("mike+abc@mac.com")).toBe("mike@mac.com");
    });

    it("strips +tag on Yahoo families", () => {
      expect(normalizeEmail("mike+abc@yahoo.com")).toBe("mike@yahoo.com");
      expect(normalizeEmail("mike+abc@ymail.com")).toBe("mike@ymail.com");
    });

    it("strips +tag on Fastmail", () => {
      expect(normalizeEmail("mike+abc@fastmail.com")).toBe(
        "mike@fastmail.com",
      );
    });
  });

  describe("unknown providers — treated literally", () => {
    it("does NOT strip +tag on random domains", () => {
      expect(normalizeEmail("user+tag@example.io")).toBe(
        "user+tag@example.io",
      );
      expect(normalizeEmail("user+tag@my-startup.dev")).toBe(
        "user+tag@my-startup.dev",
      );
    });

    it("does NOT canonicalize unknown gmail-lookalikes", () => {
      expect(normalizeEmail("mike@gmaill.com")).toBe("mike@gmaill.com");
      expect(normalizeEmail("mike@gmail.co")).toBe("mike@gmail.co");
    });
  });

  describe("idempotency", () => {
    it("normalizeEmail(normalizeEmail(x)) === normalizeEmail(x)", () => {
      const inputs = [
        "M.IKE+spam@GoogleMail.com",
        "mike+a+b@outlook.com",
        "  mike@gmail.com  ",
        "user+tag@some-other.io",
        "",
        "@empty-local.com",
      ];
      for (const raw of inputs) {
        const once = normalizeEmail(raw);
        const twice = normalizeEmail(once);
        expect(twice).toBe(once);
      }
    });
  });
});
