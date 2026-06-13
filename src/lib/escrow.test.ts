import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadEscrow, saveEscrow, clearEscrow } from "./escrow";

class MockStorage {
  private store = new Map<string, string>();
  getItem(k: string) {
    return this.store.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.store.set(k, v);
  }
  removeItem(k: string) {
    this.store.delete(k);
  }
  clear() {
    this.store.clear();
  }
}

function installLocalStorage(s: MockStorage | undefined) {
  // @ts-expect-error — test scaffold
  globalThis.window = s ? { localStorage: s } : undefined;
}

describe("escrow", () => {
  let storage: MockStorage;
  beforeEach(() => {
    storage = new MockStorage();
    installLocalStorage(storage);
  });

  describe("loadEscrow", () => {
    it("returns EMPTY when no window (SSR)", () => {
      installLocalStorage(undefined);
      const out = loadEscrow();
      expect(out).toEqual({
        firstName: null,
        email: null,
        emailSkipped: false,
        transcriptId: null,
        sessionId: null,
        createdAt: null,
      });
    });

    it("returns EMPTY when nothing stored", () => {
      const out = loadEscrow();
      expect(out.email).toBe(null);
      expect(out.firstName).toBe(null);
      expect(out.emailSkipped).toBe(false);
    });

    it("parses stored JSON", () => {
      storage.setItem(
        "drfuhrman.escrow",
        JSON.stringify({
          email: "mike@divinci.ai",
          firstName: "Mike",
          emailSkipped: true,
          transcriptId: "abc123",
          createdAt: "2026-01-01T00:00:00Z",
        }),
      );
      const out = loadEscrow();
      expect(out.email).toBe("mike@divinci.ai");
      expect(out.firstName).toBe("Mike");
      expect(out.emailSkipped).toBe(true);
      expect(out.transcriptId).toBe("abc123");
    });

    it("fills missing fields with EMPTY defaults", () => {
      storage.setItem(
        "drfuhrman.escrow",
        JSON.stringify({ email: "x@y.com" }),
      );
      const out = loadEscrow();
      expect(out.email).toBe("x@y.com");
      expect(out.firstName).toBe(null);
      expect(out.emailSkipped).toBe(false);
      expect(out.transcriptId).toBe(null);
    });

    it("returns EMPTY on malformed JSON", () => {
      storage.setItem("drfuhrman.escrow", "{not json");
      const out = loadEscrow();
      expect(out.email).toBe(null);
    });

    it("survives a getItem that throws (private browsing)", () => {
      // @ts-expect-error — override
      window.localStorage.getItem = () => {
        throw new Error("private mode");
      };
      expect(() => loadEscrow()).not.toThrow();
      expect(loadEscrow().email).toBe(null);
    });
  });

  describe("saveEscrow", () => {
    it("merges into existing record", () => {
      saveEscrow({ firstName: "Mike" });
      saveEscrow({ email: "mike@divinci.ai" });
      const out = loadEscrow();
      expect(out.firstName).toBe("Mike");
      expect(out.email).toBe("mike@divinci.ai");
    });

    it("stamps createdAt on first save and preserves it on later saves", () => {
      saveEscrow({ firstName: "A" });
      const first = loadEscrow().createdAt;
      expect(first).toBeTruthy();
      saveEscrow({ email: "a@b.com" });
      expect(loadEscrow().createdAt).toBe(first);
    });

    it("silently swallows localStorage write errors", () => {
      // @ts-expect-error — override
      window.localStorage.setItem = () => {
        throw new Error("quota exceeded");
      };
      expect(() => saveEscrow({ email: "x@y.com" })).not.toThrow();
    });
  });

  describe("clearEscrow", () => {
    it("removes the record", () => {
      saveEscrow({ email: "x@y.com" });
      clearEscrow();
      expect(loadEscrow().email).toBe(null);
    });

    it("is a no-op when no window", () => {
      installLocalStorage(undefined);
      expect(() => clearEscrow()).not.toThrow();
    });
  });
});
