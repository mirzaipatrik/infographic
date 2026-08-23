export interface BulletPoint {
  id: string;
  text: string;
}

export interface SubCategory {
  id: string;
  name: string;
  bullets: BulletPoint[];
}

export const CATEGORY_COLORS = ["emerald", "violet", "amber", "rose"] as const;
export type CategoryColor = (typeof CATEGORY_COLORS)[number];

export interface Category {
  id: string;
  title: string;
  /** Short label shown on the column tab (e.g. area name). */
  tabLabel?: string;
  /** Italic line under the main column title. */
  description?: string;
  color: CategoryColor;
  subcategories: SubCategory[];
}

/** Editor swatch classes — matches Infographic column tab colors (not literal emerald/amber/rose). */
export const categoryColorSwatch: Record<CategoryColor, string> = {
  emerald: "bg-teal-600",
  violet: "bg-violet-500",
  amber: "bg-sky-500",
  rose: "bg-indigo-500",
};

export interface InfographicData {
  title: string;
  subtitle: string;
  neighborhood: string;
  year: string;
  categories: Category[];
}

const MAX_ID_LENGTH = 64;
const MAX_SHORT_TEXT = 500;
const MAX_LONG_TEXT = 2_000;
const MAX_CATEGORIES = 12;
const MAX_SUBCATEGORIES = 30;
const MAX_BULLETS = 50;
const MAX_PAYLOAD_BYTES = 100_000;

function isBoundedString(value: unknown, max: number): value is string {
  return typeof value === "string" && value.length <= max;
}

function isCategoryColor(value: unknown): value is CategoryColor {
  return typeof value === "string" && (CATEGORY_COLORS as readonly string[]).includes(value);
}

function parseBullet(value: unknown): BulletPoint | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<BulletPoint>;
  if (!isBoundedString(candidate.id, MAX_ID_LENGTH) || !isBoundedString(candidate.text, MAX_LONG_TEXT)) {
    return null;
  }
  return { id: candidate.id, text: candidate.text };
}

function parseSubCategory(value: unknown): SubCategory | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<SubCategory>;
  if (
    !isBoundedString(candidate.id, MAX_ID_LENGTH) ||
    !isBoundedString(candidate.name, MAX_SHORT_TEXT) ||
    !Array.isArray(candidate.bullets) ||
    candidate.bullets.length > MAX_BULLETS
  ) {
    return null;
  }

  const bullets: BulletPoint[] = [];
  for (const bullet of candidate.bullets) {
    const parsed = parseBullet(bullet);
    if (!parsed) return null;
    bullets.push(parsed);
  }

  return { id: candidate.id, name: candidate.name, bullets };
}

function parseCategory(value: unknown): Category | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<Category>;
  if (
    !isBoundedString(candidate.id, MAX_ID_LENGTH) ||
    !isBoundedString(candidate.title, MAX_SHORT_TEXT) ||
    !isCategoryColor(candidate.color) ||
    !Array.isArray(candidate.subcategories) ||
    candidate.subcategories.length > MAX_SUBCATEGORIES
  ) {
    return null;
  }

  if (candidate.tabLabel !== undefined && !isBoundedString(candidate.tabLabel, MAX_SHORT_TEXT)) {
    return null;
  }
  if (candidate.description !== undefined && !isBoundedString(candidate.description, MAX_LONG_TEXT)) {
    return null;
  }

  const subcategories: SubCategory[] = [];
  for (const subcategory of candidate.subcategories) {
    const parsed = parseSubCategory(subcategory);
    if (!parsed) return null;
    subcategories.push(parsed);
  }

  return {
    id: candidate.id,
    title: candidate.title,
    tabLabel: candidate.tabLabel,
    description: candidate.description,
    color: candidate.color,
    subcategories,
  };
}

/** Returns a typed copy when `value` matches InfographicData; otherwise null. */
export function parseInfographicData(value: unknown): InfographicData | null {
  if (!value || typeof value !== "object") return null;

  try {
    if (JSON.stringify(value).length > MAX_PAYLOAD_BYTES) return null;
  } catch {
    return null;
  }

  const candidate = value as Partial<InfographicData>;
  if (
    !isBoundedString(candidate.title, MAX_SHORT_TEXT) ||
    !isBoundedString(candidate.subtitle, MAX_LONG_TEXT) ||
    !isBoundedString(candidate.neighborhood, MAX_SHORT_TEXT) ||
    !isBoundedString(candidate.year, 32) ||
    !Array.isArray(candidate.categories) ||
    candidate.categories.length > MAX_CATEGORIES
  ) {
    return null;
  }

  const categories: Category[] = [];
  for (const category of candidate.categories) {
    const parsed = parseCategory(category);
    if (!parsed) return null;
    categories.push(parsed);
  }

  return {
    title: candidate.title,
    subtitle: candidate.subtitle,
    neighborhood: candidate.neighborhood,
    year: candidate.year,
    categories,
  };
}

export function isInfographicData(value: unknown): value is InfographicData {
  return parseInfographicData(value) !== null;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export const defaultData: InfographicData = {
  title: "Community Efforts",
  subtitle: "A summary of activities and initiatives in our area",
  neighborhood: "Our Neighborhood",
  year: new Date().getFullYear().toString(),
  categories: [
    {
      id: uid(),
      title: "Social Action",
      tabLabel: "Neighborhood",
      description: "Building capacity for service and fellowship",
      color: "emerald",
      subcategories: [
        {
          id: uid(),
          name: "Youth",
          bullets: [
            { id: uid(), text: "Junior Youth Spiritual Empowerment Program" },
            { id: uid(), text: "Tutoring and homework support" },
            { id: uid(), text: "Service projects in the neighborhood" },
          ],
        },
        {
          id: uid(),
          name: "Community Wellbeing",
          bullets: [
            { id: uid(), text: "Food assistance initiatives" },
            { id: uid(), text: "Visiting the elderly" },
          ],
        },
      ],
    },
    {
      id: uid(),
      title: "Public Discourses",
      tabLabel: "Outreach",
      description: "Conversations that enrich community life",
      color: "violet",
      subcategories: [
        {
          id: uid(),
          name: "Conversations",
          bullets: [
            { id: uid(), text: "Participation in local forums" },
            { id: uid(), text: "Discussions on justice and unity" },
            { id: uid(), text: "Interfaith gatherings" },
          ],
        },
        {
          id: uid(),
          name: "Media & Outreach",
          bullets: [
            { id: uid(), text: "Social media presence" },
            { id: uid(), text: "Newsletter contributions" },
          ],
        },
      ],
    },
    {
      id: uid(),
      title: "Teaching",
      tabLabel: "Invitation",
      description: "Sharing the message through personal relationships",
      color: "amber",
      subcategories: [
        {
          id: uid(),
          name: "Firesides",
          bullets: [
            { id: uid(), text: "Regular home gatherings" },
            { id: uid(), text: "Introductory talks on the Faith" },
            { id: uid(), text: "Online firesides for seekers" },
          ],
        },
        {
          id: uid(),
          name: "Individual Conversations",
          bullets: [
            { id: uid(), text: "Sharing the writings" },
            { id: uid(), text: "Inviting friends to core activities" },
          ],
        },
      ],
    },
    {
      id: uid(),
      title: "Core Activities",
      tabLabel: "Gatherings",
      description: "Study, worship, and classes for all ages",
      color: "rose",
      subcategories: [
        {
          id: uid(),
          name: "Study Circles",
          bullets: [
            { id: uid(), text: "Ruhi Books 1–7" },
            { id: uid(), text: "Book 1 in progress" },
          ],
        },
        {
          id: uid(),
          name: "Devotional Gatherings",
          bullets: [
            { id: uid(), text: "Weekly devotional meetings" },
            { id: uid(), text: "Special holy day observances" },
          ],
        },
        {
          id: uid(),
          name: "Children's Classes",
          bullets: [
            { id: uid(), text: "Weekly classes (ages 5–11)" },
            { id: uid(), text: "Arts, virtues, and prayers" },
          ],
        },
      ],
    },
  ],
};

export function makeCategory(): Category {
  return {
    id: Math.random().toString(36).slice(2, 9),
    title: "New Category",
    tabLabel: "New",
    description: "Short description for this column",
    color: "emerald",
    subcategories: [makeSubCategory()],
  };
}

export function makeSubCategory(): SubCategory {
  return {
    id: Math.random().toString(36).slice(2, 9),
    name: "New Subcategory",
    bullets: [{ id: Math.random().toString(36).slice(2, 9), text: "Bullet point" }],
  };
}

export function makeBullet(): BulletPoint {
  return { id: Math.random().toString(36).slice(2, 9), text: "New bullet point" };
}
