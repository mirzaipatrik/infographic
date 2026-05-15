import type { InfographicData } from "./data";

type SearchParamReader = Pick<URLSearchParams, "get">;

export function parseInfographicFromSearch(searchParams: SearchParamReader): InfographicData | null {
  const data = searchParams.get("data");
  if (!data) return null;
  try {
    return JSON.parse(data) as InfographicData;
  } catch {
    return null;
  }
}

export function buildInfographicShareUrl(data: InfographicData, origin: string): string {
  return `${origin}?data=${encodeURIComponent(JSON.stringify(data))}`;
}
