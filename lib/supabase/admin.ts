import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database";
import { requirePublicSupabaseEnv } from "@/lib/supabase/env";

export function hasSupabaseWriteEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
      process.env.SUPABASE_SECRET_KEY,
  );
}

function requireSupabaseWriteEnv() {
  const publicEnv = requirePublicSupabaseEnv();
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing SUPABASE_SECRET_KEY environment variable");
  }
  return { ...publicEnv, secretKey };
}

/** Privileged client for authenticated server writes. Bypasses RLS; never import from client code. */
export function createServiceClient() {
  const { url, secretKey } = requireSupabaseWriteEnv();
  return createClient<Database>(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
