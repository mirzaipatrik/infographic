import type { CategoryColor, InfographicData } from "./data";

type SearchParamsLike = Pick<URLSearchParams, "get">;

const categoryColors = ["emerald", "violet", "amber", "rose"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function idValue(value: unknown, fallback: string): string {
  const id = stringValue(value);
  return id || fallback;
}

function categoryColor(value: unknown): CategoryColor {
  return categoryColors.includes(value as CategoryColor) ? (value as CategoryColor) : "emerald";
}

export function normalizeInfographicData(value: unknown): InfographicData | null {
  if (!isRecord(value)) return null;

  const categories = Array.isArray(value.categories)
    ? value.categories.filter(isRecord).map((category, categoryIndex) => ({
        id: idValue(category.id, `category-${categoryIndex}`),
        title: stringValue(category.title),
        tabLabel: stringValue(category.tabLabel) || undefined,
        description: stringValue(category.description) || undefined,
        color: categoryColor(category.color),
        subcategories: Array.isArray(category.subcategories)
          ? category.subcategories.filter(isRecord).map((subcategory, subcategoryIndex) => ({
              id: idValue(subcategory.id, `category-${categoryIndex}-subcategory-${subcategoryIndex}`),
              name: stringValue(subcategory.name),
              bullets: Array.isArray(subcategory.bullets)
                ? subcategory.bullets.filter(isRecord).map((bullet, bulletIndex) => ({
                    id: idValue(
                      bullet.id,
                      `category-${categoryIndex}-subcategory-${subcategoryIndex}-bullet-${bulletIndex}`,
                    ),
                    text: stringValue(bullet.text),
                  }))
                : [],
            }))
          : [],
      }))
    : [];

  return {
    title: stringValue(value.title),
    subtitle: stringValue(value.subtitle),
    neighborhood: stringValue(value.neighborhood),
    year: stringValue(value.year),
    categories,
  };
}

export function parseInfographicFromSearch(searchParams: SearchParamsLike): InfographicData | null {
  const encoded = searchParams.get("data");
  if (!encoded) return null;

  try {
    return normalizeInfographicData(JSON.parse(encoded));
  } catch {
    return null;
  }
}
