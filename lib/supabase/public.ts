import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database";
import { requirePublicSupabaseEnv } from "@/lib/supabase/env";

/** Cookie-less client for cached public reads (`use cache` cannot access cookies). */
export function createPublicClient() {
  const { url, publishableKey } = requirePublicSupabaseEnv();
  return createClient<Database>(url, publishableKey);
}
