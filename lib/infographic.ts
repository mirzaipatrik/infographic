import "server-only";

import { cacheTag } from "next/cache";
import { INFOGRAPHIC_CACHE_TAGS, INFOGRAPHIC_ID } from "@/lib/cache";
import { defaultData, publishedInfographicFromQuery, type InfographicData } from "@/lib/data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

async function getPublishedInfographicCached(): Promise<InfographicData> {
  "use cache";
  cacheTag(...INFOGRAPHIC_CACHE_TAGS);

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("infographics")
    .select("content")
    .eq("id", INFOGRAPHIC_ID)
    .maybeSingle();

  // Throw on failure so `'use cache'` does not store defaultData for hours.
  return publishedInfographicFromQuery(data, error);
}

export async function getPublishedInfographic(): Promise<InfographicData> {
  if (!hasSupabaseEnv()) {
    return defaultData;
  }

  try {
    return await getPublishedInfographicCached();
  } catch (error) {
    console.error("Failed to load infographic:", error);
    return defaultData;
  }
}
