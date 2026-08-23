import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

type RateLimitOptions = {
  /** Maximum events allowed inside the window. */
  limit: number;
  /** Sliding window length in milliseconds. */
  windowMs: number;
};

const buckets = new Map<string, number[]>();
const MAX_TRACKED_KEYS = 10_000;

function pruneKey(key: string, windowMs: number, now: number): number[] {
  const fresh = (buckets.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
  if (fresh.length === 0) {
    buckets.delete(key);
  } else {
    buckets.set(key, fresh);
  }
  return fresh;
}

function evictStaleKeys(now: number, windowMs: number) {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, timestamps] of buckets) {
    const fresh = timestamps.filter((timestamp) => now - timestamp < windowMs);
    if (fresh.length === 0) buckets.delete(key);
    else buckets.set(key, fresh);
  }
}

/**
 * Sliding-window limiter. In-memory per server instance — enough for a
 * single-admin app; swap the store if you later need a shared cache.
 */
export function rateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  evictStaleKeys(now, windowMs);
  const hits = pruneKey(key, windowMs, now);

  if (hits.length >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((hits[0] + windowMs - now) / 1000));
    return { ok: false, retryAfterSeconds };
  }

  hits.push(now);
  buckets.set(key, hits);
  return { ok: true };
}

function peekRateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const hits = pruneKey(key, windowMs, now);
  if (hits.length >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((hits[0] + windowMs - now) / 1000));
    return { ok: false, retryAfterSeconds };
  }
  return { ok: true };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_IP_LIMIT = 10;
const LOGIN_UNKNOWN_IP_LIMIT = 5;
const LOGIN_EMAIL_LIMIT = 5;

function hashIdentifier(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function emailBucketKey(email: string) {
  return `login:email:${hashIdentifier(email.trim().toLowerCase())}`;
}

async function getClientIp(): Promise<string | null> {
  const headerStore = await headers();
  const trusted =
    headerStore.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("cf-connecting-ip")?.trim() ||
    headerStore.get("x-real-ip")?.trim();
  if (trusted) return trusted;

  const forwarded = headerStore.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || null;
}

/** Check IP (every attempt) and email (failed attempts) before calling Auth. */
export async function enforceLoginRateLimit(email: string): Promise<RateLimitResult> {
  const ip = await getClientIp();
  const ipLimit = rateLimit(ip ? `login:ip:${hashIdentifier(ip)}` : "login:ip:unknown", {
    limit: ip ? LOGIN_IP_LIMIT : LOGIN_UNKNOWN_IP_LIMIT,
    windowMs: LOGIN_WINDOW_MS,
  });
  if (!ipLimit.ok) return ipLimit;

  return peekRateLimit(emailBucketKey(email), {
    limit: LOGIN_EMAIL_LIMIT,
    windowMs: LOGIN_WINDOW_MS,
  });
}

export function recordFailedLogin(email: string) {
  rateLimit(emailBucketKey(email), {
    limit: LOGIN_EMAIL_LIMIT,
    windowMs: LOGIN_WINDOW_MS,
  });
}

export function clearFailedLogins(email: string) {
  resetRateLimit(emailBucketKey(email));
}
