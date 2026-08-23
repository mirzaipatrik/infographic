"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminAccess, requireAuthClaims } from "@/lib/auth";
import { INFOGRAPHIC_CACHE_TAGS, INFOGRAPHIC_ID } from "@/lib/cache";
import { parseInfographicData, type InfographicData } from "@/lib/data";
import {
  clearFailedLogins,
  enforceLoginRateLimit,
  recordFailedLogin,
} from "@/lib/rate-limit";
import { createServiceClient, hasSupabaseWriteEnv } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function saveInfographic(
  data: InfographicData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await requireAuthClaims();
  if (!auth.ok) return auth;

  const parsed = parseInfographicData(data);
  if (!parsed) {
    return { ok: false, error: "Invalid infographic data." };
  }

  if (!hasSupabaseWriteEnv()) {
    return { ok: false, error: "Saving is not configured on the server." };
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("infographics").upsert(
      {
        id: INFOGRAPHIC_ID,
        content: parsed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error("Failed to save infographic:", error.message);
      return { ok: false, error: "Failed to save." };
    }
  } catch (error) {
    console.error("Failed to save infographic:", error);
    return { ok: false, error: "Failed to save." };
  }

  INFOGRAPHIC_CACHE_TAGS.forEach((tag) => updateTag(tag));
  return { ok: true };
}

export async function login(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=missing");
  }

  if (!hasSupabaseEnv()) {
    redirect("/login?error=unavailable");
  }

  const rateLimit = await enforceLoginRateLimit(email);
  if (!rateLimit.ok) {
    redirect("/login?error=rate_limited");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    recordFailedLogin(email);
    redirect("/login?error=invalid");
  }

  const { data } = await supabase.auth.getClaims();
  if (!hasAdminAccess(data?.claims ?? null)) {
    await supabase.auth.signOut();
    redirect("/login?error=invalid");
  }

  clearFailedLogins(email);
  redirect("/");
}

export async function logout(): Promise<void> {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
