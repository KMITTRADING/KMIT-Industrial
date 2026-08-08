import 'server-only';

/**
 * Fixed-window rate limiter for the RFQ endpoint.
 *
 * Deliberately small and in-process. What it stops is the case it is aimed at:
 * a single client hammering the form, whether that is a bot or a frustrated
 * buyer double-clicking submit. Combined with the honeypot in the adapter, that
 * covers ordinary abuse of a public B2B enquiry form.
 *
 * What it does NOT do, stated plainly so nobody assumes otherwise:
 *
 * - It does not survive a cold start. On a serverless target each instance
 *   keeps its own counters, so the effective limit is per instance.
 * - It is not a defence against a distributed flood. That belongs at the edge,
 *   in the host's own protection, and should be configured there once the
 *   deployment target is settled.
 *
 * Recorded as ADR-025.
 */

type Window = { count: number; resetAt: number };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const windows = new Map<string, Window>();

/** Drops expired windows so the map cannot grow without bound. */
function sweep(now: number) {
  if (windows.size < 512) return;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the window resets. Zero when allowed. */
  retryAfterSeconds: number;
};

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= MAX_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Best-effort client key from proxy headers.
 *
 * Falls back to a single shared bucket rather than to "no limit": if the host
 * strips the forwarding headers, the safe failure is a stricter limit for
 * everyone, not an open door.
 */
export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return headers.get('x-real-ip')?.trim() || 'unknown-client';
}
