import type { InfographicData } from "./data";

export function encodeInfographicForUrl(data: InfographicData): string {
  return encodeURIComponent(JSON.stringify(data));
}

export function parseInfographicFromSearch(searchParams: URLSearchParams): InfographicData | null {
  const serialized = searchParams.get("data");
  if (!serialized) return null;

  try {
    return JSON.parse(serialized) as InfographicData;
  } catch {
    return null;
  }
}
