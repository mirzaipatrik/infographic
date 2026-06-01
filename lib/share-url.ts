import type { InfographicData } from "./data";

export function encodeInfographicData(data: InfographicData): string {
  return encodeURIComponent(JSON.stringify(data));
}

export function parseInfographicDataParam(dataParam: string | null): InfographicData | null {
  if (!dataParam) return null;

  try {
    return JSON.parse(dataParam) as InfographicData;
  } catch {
    return null;
  }
}
