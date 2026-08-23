/**
 * Canonical cache tags for on-demand revalidation.
 * Tag cached reads with these, then call updateTag() after mutations.
 */
export const INFOGRAPHIC_CACHE_TAGS = ["infographic"] as const;

export const INFOGRAPHIC_ID = "default";
