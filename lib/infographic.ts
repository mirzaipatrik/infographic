import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { INFOGRAPHIC_CACHE_TAGS, INFOGRAPHIC_ID } from "@/lib/cache";
import { defaultData, parseInfographicData, type InfographicData } from "@/lib/data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

async function getPublishedInfographicCached(): Promise<InfographicData> {
  "use cache";
  cacheLife("hours");
  INFOGRAPHIC_CACHE_TAGS.forEach((tag) => cacheTag(tag));

  if (!hasSupabaseEnv()) {
    return defaultData;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("infographics")
      .select("content")
      .eq("id", INFOGRAPHIC_ID)
      .maybeSingle();

    if (error || !data?.content) {
      if (error) {
        console.error("Failed to load infographic:", error.message);
      }
      return defaultData;
    }

    return parseInfographicData(data.content) ?? defaultData;
  } catch (error) {
    console.error("Failed to load infographic:", error);
    return defaultData;
  }
}

export const getPublishedInfographic = () => getPublishedInfographicCached();
