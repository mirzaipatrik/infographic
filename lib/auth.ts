import "server-only";

import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

type JwtClaims = {
  email?: unknown;
} | null | undefined;

function getAdminEmailAllowlist(): string[] | null {
  const raw = process.env.ADMIN_EMAILS?.trim();
  if (!raw) return null;

  const emails = raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return emails.length > 0 ? emails : null;
}

export function hasAdminAccess(claims: JwtClaims): boolean {
  if (!claims) return false;

  const allowlist = getAdminEmailAllowlist();
  if (!allowlist) return true;

  const email = typeof claims.email === "string" ? claims.email.trim().toLowerCase() : "";
  return allowlist.includes(email);
}

/** Verified JWT claims, or null when signed out / env missing. */
export async function getAuthClaims() {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims ?? null;
}

export async function isAdmin(): Promise<boolean> {
  return hasAdminAccess(await getAuthClaims());
}

export async function requireAuthClaims() {
  const claims = await getAuthClaims();
  if (!hasAdminAccess(claims)) {
    return { ok: false as const, error: "You must be signed in to save." };
  }
  return { ok: true as const, claims };
}
