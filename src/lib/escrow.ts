const STORAGE_KEY = "drfuhrman.escrow";

export interface EscrowState {
  firstName: string | null;
  email: string | null;
  emailSkipped: boolean;
  transcriptId: string | null;
  /** Stable per-visitor session id, sent with chat-send + feedback so the
   *  server persists the whole conversation as one customer chat. */
  sessionId: string | null;
  createdAt: string | null;
}

const EMPTY: EscrowState = {
  firstName: null,
  email: null,
  emailSkipped: false,
  transcriptId: null,
  sessionId: null,
  createdAt: null,
};

export function loadEscrow(): EscrowState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<EscrowState>;
    return {
      firstName: parsed.firstName ?? null,
      email: parsed.email ?? null,
      emailSkipped: parsed.emailSkipped ?? false,
      transcriptId: parsed.transcriptId ?? null,
      sessionId: parsed.sessionId ?? null,
      createdAt: parsed.createdAt ?? null,
    };
  } catch {
    return EMPTY;
  }
}

export function saveEscrow(partial: Partial<EscrowState>): EscrowState {
  if (typeof window === "undefined") return EMPTY;
  const current = loadEscrow();
  const next: EscrowState = {
    ...current,
    ...partial,
    createdAt: current.createdAt ?? new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage may throw in private-browsing modes — fail silent
  }
  return next;
}

export function clearEscrow(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
