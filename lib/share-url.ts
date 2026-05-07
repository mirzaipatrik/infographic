import type { InfographicData } from "./data";

export function parseInfographicFromSearch(
  searchParams: Pick<URLSearchParams, "get">,
): InfographicData | null {
  const serialized = searchParams.get("data");
  if (!serialized) return null;

  try {
    return JSON.parse(serialized) as InfographicData;
  } catch {
    return null;
  }
}

export function createShareUrl(currentHref: string, data: InfographicData): string {
  const url = new URL(currentHref);
  url.searchParams.set("data", JSON.stringify(data));
  return url.toString();
}
